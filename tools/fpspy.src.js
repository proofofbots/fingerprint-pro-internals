(() => {
  const NS = "__fpspy";
  if (window[NS] && window[NS].version) {
    console.log("[fpspy] already installed, version", window[NS].version);
    return window[NS];
  }

  const SIGNAL_LABELS = {};

  const VERSION = "1.0.0";
  const T0 = performance.now();
  const enc = new TextEncoder();
  const dec = new TextDecoder("utf-8", { fatal: false });

  const nativeFetch = window.fetch;
  const nativeBlob = window.Blob;
  const nativeResponse = window.Response;
  const nativeXhrOpen = window.XMLHttpRequest && XMLHttpRequest.prototype.open;
  const nativeXhrSend = window.XMLHttpRequest && XMLHttpRequest.prototype.send;
  const nativeXhrHeader = window.XMLHttpRequest && XMLHttpRequest.prototype.setRequestHeader;
  const nativeBeacon = navigator.sendBeacon && navigator.sendBeacon.bind(navigator);
  const nativeCreateObjectURL = URL.createObjectURL;
  const nativeToString = Function.prototype.toString;
  const nativeLog = console.log.bind(console);
  const nativeGroup = console.groupCollapsed ? console.groupCollapsed.bind(console) : nativeLog;
  const nativeGroupEnd = console.groupEnd ? console.groupEnd.bind(console) : () => {};
  const nativeTable = console.table ? console.table.bind(console) : nativeLog;

  const opts = {
    all: false,
    deep: true,
    deepProps: false,
    quiet: false,
    maxBytesKept: 4 << 20,
    detailPerApi: 3,
    maxProbeRecords: 20000,
  };

  const state = {
    version: VERSION,
    origin: location.href,
    startedAt: new Date().toISOString(),
    requests: [],
    api: [],
    probes: [],
    probeCounts: Object.create(null),
    workers: [],
    messages: [],
    storage: null,
    resources: [],
    notes: [],
  };

  const restores = [];
  const fakeNative = new WeakMap();

  const clock = () => +(performance.now() - T0).toFixed(1);

  function stealth(wrapper, original) {
    try {
      Object.defineProperty(wrapper, "name", { value: original.name, configurable: true });
    } catch (e) {}
    try {
      Object.defineProperty(wrapper, "length", { value: original.length, configurable: true });
    } catch (e) {}
    fakeNative.set(wrapper, original);
    return wrapper;
  }

  function installToStringTrap() {
    const trap = function toString() {
      const target = fakeNative.get(this);
      return nativeToString.call(target === undefined ? this : target);
    };
    fakeNative.set(trap, nativeToString);
    Function.prototype.toString = trap;
    restores.push(() => {
      Function.prototype.toString = nativeToString;
    });
  }

  function note(msg) {
    state.notes.push({ t: clock(), msg });
    if (!opts.quiet) nativeLog("[fpspy]", msg);
  }

  function toU8(v) {
    try {
      if (v == null) return null;
      if (v instanceof Uint8Array) return v;
      if (v instanceof ArrayBuffer) return new Uint8Array(v);
      if (ArrayBuffer.isView(v)) return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
      if (typeof v === "string") return enc.encode(v);
    } catch (e) {}
    return null;
  }

  const RAW_BODY_LIMIT = 1 << 20;

  function toB64(u8) {
    let s = "";
    for (let i = 0; i < u8.length; i += 0x8000) {
      s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    }
    return btoa(s);
  }

  function fromB64(str) {
    try {
      const bin = atob(str);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    } catch (e) {
      return null;
    }
  }

  function hex(u8, n = 48) {
    let s = "";
    for (let i = 0; i < Math.min(n, u8.length); i++) s += u8[i].toString(16).padStart(2, "0");
    return s + (u8.length > n ? "…" : "");
  }

  function tryJson(u8) {
    if (!u8 || !u8.length) return undefined;
    const c = u8[0];
    if (c !== 0x7b && c !== 0x5b && c !== 0x22) return undefined;
    try {
      return JSON.parse(dec.decode(u8));
    } catch (e) {
      return undefined;
    }
  }

  async function inflate(u8, format) {
    try {
      const stream = new nativeBlob([u8]).stream().pipeThrough(new DecompressionStream(format));
      return new Uint8Array(await new nativeResponse(stream).arrayBuffer());
    } catch (e) {
      return null;
    }
  }

  function frameCandidates(u8, wide) {
    const out = [];
    if (!u8 || u8.length < 6) return out;
    const r = u8[0];
    const tagLens = wide ? [2, 1, 3, 0, 4] : [2];
    const keyLens = wide ? [9, 7, 8, 16, 12, 6, 10, 5, 4, 3, 2, 1, 11, 13, 14, 15] : [9, 7];
    for (const tagLen of tagLens) {
      const padIdx = 1 + tagLen;
      if (padIdx >= u8.length) continue;
      const pad = (u8[padIdx] - r) & 255;
      if (pad > 3) continue;
      const tag = [];
      for (let i = 1; i <= tagLen; i++) tag.push((u8[i] - r) & 255);
      const keyStart = padIdx + 1 + pad;
      for (const keyLen of keyLens) {
        const bodyStart = keyStart + keyLen;
        if (bodyStart >= u8.length) continue;
        const key = u8.subarray(keyStart, bodyStart);
        const body = u8.subarray(bodyStart);
        const plain = new Uint8Array(body.length);
        for (let i = 0; i < body.length; i++) plain[i] = body[i] ^ key[i % keyLen];
        out.push({ tag, pad, keyLen, key: Array.from(key), plain });
      }
    }
    return out;
  }

  async function decodeCandidates(cands) {
    for (const c of cands) {
      const json = tryJson(c.plain);
      if (json !== undefined) {
        return { encoding: `framed(tag=${c.tag},key=${c.keyLen})`, frame: c, json, bytes: c.plain };
      }
    }
    for (const c of cands) {
      for (const fmt of ["deflate-raw", "deflate", "gzip"]) {
        const raw = await inflate(c.plain, fmt);
        if (!raw) continue;
        const json = tryJson(raw);
        if (json !== undefined) {
          return {
            encoding: `framed(tag=${c.tag},key=${c.keyLen})+${fmt}`,
            frame: c,
            json,
            bytes: raw,
          };
        }
      }
    }
    return null;
  }

  async function decodeBody(input) {
    const u8 = toU8(input);
    if (!u8 || !u8.length) return { encoding: "empty", size: 0 };
    const direct = tryJson(u8);
    if (direct !== undefined) {
      return { encoding: "json", size: u8.length, json: direct };
    }
    let hit = await decodeCandidates(frameCandidates(u8, false));
    if (!hit) hit = await decodeCandidates(frameCandidates(u8, true));
    if (hit) {
      return {
        encoding: hit.encoding,
        size: u8.length,
        plainSize: hit.bytes.length,
        key: hit.frame.key,
        tag: hit.frame.tag,
        json: hit.json,
      };
    }
    for (const fmt of ["gzip", "deflate", "deflate-raw"]) {
      const raw = await inflate(u8, fmt);
      if (!raw) continue;
      const json = tryJson(raw);
      if (json !== undefined) return { encoding: fmt, size: u8.length, plainSize: raw.length, json };
    }
    const text = dec.decode(u8.subarray(0, 4096));
    return {
      encoding: "opaque",
      size: u8.length,
      head: hex(u8),
      text: /[\x00-\x08\x0e-\x1f]/.test(text) ? undefined : text,
      base64: u8.length <= 65536 ? toB64(u8) : undefined,
    };
  }

  function flattenSignals(node, path, out) {
    if (!node || typeof node !== "object") return out;
    if (Array.isArray(node)) {
      node.forEach((v, i) => flattenSignals(v, `${path}[${i}]`, out));
      return out;
    }
    const keys = Object.keys(node);
    if (keys.length <= 3 && "s" in node && "v" in node) {
      const id = path.split(".").pop();
      out.push({
        id,
        label: SIGNAL_LABELS[id] || "",
        s: node.s,
        v: preview(node.v, 120),
        path,
      });
      return out;
    }
    for (const k of keys) flattenSignals(node[k], path ? `${path}.${k}` : k, out);
    return out;
  }

  function preview(v, max = 200) {
    try {
      if (v == null) return v;
      const t = typeof v;
      if (t === "string") return v.length > max ? v.slice(0, max) + `…(${v.length})` : v;
      if (t === "number" || t === "boolean") return v;
      if (t === "function") return `[function ${v.name || "anonymous"}]`;
      if (ArrayBuffer.isView(v) || v instanceof ArrayBuffer) {
        const u = toU8(v);
        return `[bytes ${u.length}] ${hex(u, 24)}`;
      }
      if (v instanceof Blob) return `[Blob ${v.size} ${v.type}]`;
      if (v instanceof Element) return `[<${v.tagName.toLowerCase()}>]`;
      const s = JSON.stringify(v);
      if (s === undefined) return String(v);
      return s.length > max ? JSON.parse(JSON.stringify(v)) : JSON.parse(s);
    } catch (e) {
      return String(v);
    }
  }

  const FP_HOST = /(^|\.)(fpjs\.io|fpcdn\.io|fptls\.com|fpnpmcdn\.net|fingerprint\.com|fingerprintjs\.com)$/i;
  const FP_PATH = /\/web\/v\d|\/agent\b|\/fpjs\b|fingerprintjs/i;

  function fpTarget(url) {
    try {
      const u = new URL(String(url), location.href);
      return FP_HOST.test(u.hostname) || FP_PATH.test(u.pathname) || u.search.includes("ci=jsl");
    } catch (e) {
      return false;
    }
  }

  function isInteresting(url, decoded) {
    if (opts.all) return true;
    if (fpTarget(url)) return true;
    return !!(decoded && decoded.encoding && decoded.encoding.startsWith("framed"));
  }

  function recordRequest(entry) {
    state.requests.push(entry);
    if (opts.quiet) return;
    const tag = entry.decoded ? entry.decoded.encoding : "-";
    nativeGroup(
      `[fpspy] ${entry.t}ms ${entry.method} ${entry.url.slice(0, 140)} · req ${tag} ${entry.reqSize || 0}B · ${entry.status || "?"} ${entry.ms || 0}ms`,
    );
    if (entry.decoded && entry.decoded.json !== undefined) nativeLog("request", entry.decoded.json);
    if (entry.response && entry.response.json !== undefined)
      nativeLog("response", entry.response.json);
    else if (entry.response) nativeLog("response", entry.response);
    if (entry.signals && entry.signals.length) {
      const bad = entry.signals.filter((s) => s.s !== 0);
      nativeLog(`signals ${entry.signals.length} total, ${bad.length} non-zero status`);
      if (bad.length) nativeTable(bad);
    }
    nativeGroupEnd();
  }

  async function annotate(entry, reqBody, resBody, headers) {
    entry.headers = headers;
    const u8 = toU8(reqBody);
    entry.reqSize = u8 ? u8.length : 0;
    // The bytes as sent, so a capture can be replayed through tools/codec.mjs offline instead of
    // being taken on trust from the in-page decode.
    if (u8 && u8.length && u8.length <= RAW_BODY_LIMIT) entry.reqRaw = toB64(u8);
    entry.decoded = await decodeBody(reqBody);
    if (entry.decoded.json !== undefined) {
      entry.signals = flattenSignals(entry.decoded.json, "", []);
    }
    if (resBody !== undefined && resBody !== null) {
      entry.response = await decodeBody(resBody);
    }
    if (!isInteresting(entry.url, entry.decoded)) return null;
    return entry;
  }

  function report(pending) {
    pending.then(
      (entry) => entry && recordRequest(entry),
      (err) => note(`decode failed: ${err}`),
    );
  }

  function hookFetch() {
    const wrapped = async function (input, init) {
      const url = typeof input === "string" ? input : input && input.url ? input.url : String(input);
      const method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();
      let body = init && init.body;
      if (body === undefined && input instanceof Request && method !== "GET") {
        try {
          body = await input.clone().arrayBuffer();
        } catch (e) {}
      }
      if (body instanceof Blob) {
        try {
          body = await body.arrayBuffer();
        } catch (e) {}
      }
      const started = performance.now();
      const t = clock();
      let res;
      try {
        res = await nativeFetch.call(this, input, init);
      } catch (err) {
        const entry = { t, kind: "fetch", method, url, error: String(err) };
        report(annotate(entry, body, null, headerBag(init)));
        throw err;
      }
      const ms = +(performance.now() - started).toFixed(1);
      let resBody = null;
      try {
        resBody = await res.clone().arrayBuffer();
      } catch (e) {}
      const entry = {
        t,
        kind: "fetch",
        method,
        url,
        status: res.status,
        ms,
        respHeaders: headersToObj(res.headers),
      };
      report(annotate(entry, body, resBody, headerBag(init)));
      return res;
    };
    window.fetch = stealth(wrapped, nativeFetch);
    restores.push(() => {
      window.fetch = nativeFetch;
    });
  }

  function headerBag(init) {
    if (!init || !init.headers) return undefined;
    if (init.headers instanceof Headers) return headersToObj(init.headers);
    return preview(init.headers, 500);
  }

  function headersToObj(h) {
    const o = {};
    try {
      h.forEach((v, k) => {
        o[k] = v;
      });
    } catch (e) {}
    return o;
  }

  function hookXhr() {
    if (!nativeXhrOpen) return;
    XMLHttpRequest.prototype.open = stealth(function (method, url, ...rest) {
      this.__fpspy = { method: String(method).toUpperCase(), url: String(url), headers: {} };
      return nativeXhrOpen.call(this, method, url, ...rest);
    }, nativeXhrOpen);
    XMLHttpRequest.prototype.setRequestHeader = stealth(function (k, v) {
      if (this.__fpspy) this.__fpspy.headers[k] = v;
      return nativeXhrHeader.call(this, k, v);
    }, nativeXhrHeader);
    XMLHttpRequest.prototype.send = stealth(function (body) {
      const meta = this.__fpspy || { method: "GET", url: "?", headers: {} };
      const started = performance.now();
      const t = clock();
      this.addEventListener("loadend", () => {
        const entry = {
          t,
          kind: "xhr",
          method: meta.method,
          url: meta.url,
          status: this.status,
          ms: +(performance.now() - started).toFixed(1),
        };
        let resBody = null;
        try {
          resBody = this.responseType === "" || this.responseType === "text" ? this.responseText : this.response;
        } catch (e) {}
        report(annotate(entry, body, resBody, meta.headers));
      });
      return nativeXhrSend.call(this, body);
    }, nativeXhrSend);
    restores.push(() => {
      XMLHttpRequest.prototype.open = nativeXhrOpen;
      XMLHttpRequest.prototype.send = nativeXhrSend;
      XMLHttpRequest.prototype.setRequestHeader = nativeXhrHeader;
    });
  }

  function hookBeacon() {
    if (!nativeBeacon) return;
    const wrapped = function (url, data) {
      const entry = { t: clock(), kind: "beacon", method: "POST", url: String(url) };
      report(annotate(entry, data, null, undefined));
      return nativeBeacon(url, data);
    };
    navigator.sendBeacon = stealth(wrapped, navigator.sendBeacon);
    restores.push(() => {
      navigator.sendBeacon = nativeBeacon;
    });
  }

  const blobSource = new WeakMap();
  const urlSource = new Map();

  function hookBlobAndWorkers() {
    const WrappedBlob = function Blob(parts, options) {
      const b = new nativeBlob(parts || [], options);
      try {
        if (Array.isArray(parts) && parts.every((p) => typeof p === "string")) {
          blobSource.set(b, parts.join(""));
        }
      } catch (e) {}
      return b;
    };
    WrappedBlob.prototype = nativeBlob.prototype;
    window.Blob = stealth(WrappedBlob, nativeBlob);

    URL.createObjectURL = stealth(function (obj) {
      const url = nativeCreateObjectURL.call(URL, obj);
      const src = blobSource.get(obj);
      if (src !== undefined) urlSource.set(url, src);
      return url;
    }, nativeCreateObjectURL);

    restores.push(() => {
      window.Blob = nativeBlob;
      URL.createObjectURL = nativeCreateObjectURL;
    });

    for (const name of ["Worker", "SharedWorker"]) {
      const Native = window[name];
      if (!Native) continue;
      const Wrapped = function (url, options) {
        const w = new Native(url, options);
        const source = urlSource.get(String(url));
        const rec = {
          t: clock(),
          kind: name,
          url: String(url),
          sourceLength: source ? source.length : undefined,
          source,
        };
        state.workers.push(rec);
        if (source === undefined && String(url).startsWith("blob:")) {
          nativeFetch
            .call(window, String(url))
            .then((r) => r.text())
            .then((text) => {
              rec.source = text;
              rec.sourceLength = text.length;
              if (!opts.quiet) nativeLog(`[fpspy] ${name} source (${text.length}B)`, text.slice(0, 4000));
            })
            .catch(() => {});
        }
        if (!opts.quiet) {
          nativeGroup(`[fpspy] ${rec.t}ms new ${name} ${rec.url.slice(0, 80)}`);
          if (source) nativeLog(source.length > 4000 ? source.slice(0, 4000) + "…" : source);
          nativeGroupEnd();
        }
        const port = name === "SharedWorker" ? w.port : w;
        const nativePost = port.postMessage;
        port.postMessage = stealth(function (msg, ...rest) {
          state.messages.push({ t: clock(), dir: "to-worker", url: rec.url, msg: preview(msg, 400) });
          return nativePost.call(this, msg, ...rest);
        }, nativePost);
        port.addEventListener("message", (e) => {
          state.messages.push({ t: clock(), dir: "from-worker", url: rec.url, msg: preview(e.data, 400) });
        });
        return w;
      };
      Wrapped.prototype = Native.prototype;
      window[name] = stealth(Wrapped, Native);
      restores.push(() => {
        window[name] = Native;
      });
    }
  }

  function bumpProbe(label, detail) {
    const n = (state.probeCounts[label] = (state.probeCounts[label] || 0) + 1);
    if (n <= opts.detailPerApi && state.probes.length < opts.maxProbeRecords) {
      state.probes.push(Object.assign({ t: clock(), api: label, call: n }, detail));
    }
  }

  function wrapMethod(owner, name, label, shape) {
    if (!owner) return;
    let original;
    try {
      original = owner[name];
    } catch (e) {
      return;
    }
    if (typeof original !== "function") return;
    const wrapped = function (...args) {
      const started = performance.now();
      let ret, threw;
      try {
        ret = original.apply(this, args);
      } catch (err) {
        threw = err;
      }
      const detail = {
        args: args.map((a) => preview(a, 160)),
        ms: +(performance.now() - started).toFixed(2),
      };
      if (threw) detail.error = String(threw);
      else if (ret && typeof ret.then === "function") {
        ret.then(
          (v) => bumpProbe(label, Object.assign({ ret: shape ? shape(v, args) : preview(v) }, detail)),
          (e) => bumpProbe(label, Object.assign({ error: String(e) }, detail)),
        );
        return ret;
      } else detail.ret = shape ? shape(ret, args) : preview(ret);
      bumpProbe(label, detail);
      if (threw) throw threw;
      return ret;
    };
    owner[name] = stealth(wrapped, original);
    restores.push(() => {
      try {
        owner[name] = original;
      } catch (e) {}
    });
  }

  function hookProbes() {
    const W = window;
    wrapMethod(W.HTMLCanvasElement && HTMLCanvasElement.prototype, "toDataURL", "canvas.toDataURL", (v) =>
      typeof v === "string" ? `${v.slice(0, 64)}…(${v.length})` : preview(v),
    );
    wrapMethod(W.HTMLCanvasElement && HTMLCanvasElement.prototype, "getContext", "canvas.getContext", (v, a) =>
      `${a && a[0]} -> ${v ? "ctx" : "null"}`,
    );
    wrapMethod(
      W.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype,
      "getImageData",
      "2d.getImageData",
      (v) => (v ? `ImageData ${v.width}x${v.height}` : preview(v)),
    );
    wrapMethod(
      W.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype,
      "measureText",
      "2d.measureText",
      (v) => (v ? preview({ width: v.width, actualBoundingBoxLeft: v.actualBoundingBoxLeft }) : null),
    );
    for (const gl of ["WebGLRenderingContext", "WebGL2RenderingContext"]) {
      const proto = W[gl] && W[gl].prototype;
      wrapMethod(proto, "getParameter", `${gl}.getParameter`);
      wrapMethod(proto, "getExtension", `${gl}.getExtension`, (v, a) => `${a && a[0]} -> ${v ? "ok" : "null"}`);
      wrapMethod(proto, "getSupportedExtensions", `${gl}.getSupportedExtensions`, (v) =>
        Array.isArray(v) ? `${v.length} extensions` : preview(v),
      );
      wrapMethod(proto, "getShaderPrecisionFormat", `${gl}.getShaderPrecisionFormat`, (v) =>
        v ? preview({ rangeMin: v.rangeMin, rangeMax: v.rangeMax, precision: v.precision }) : null,
      );
      wrapMethod(proto, "readPixels", `${gl}.readPixels`, () => "void");
      wrapMethod(proto, "getContextAttributes", `${gl}.getContextAttributes`);
    }
    wrapMethod(W, "matchMedia", "matchMedia", (v, a) => `${a && a[0]} -> ${v && v.matches}`);
    wrapMethod(W, "getComputedStyle", "getComputedStyle", () => "CSSStyleDeclaration");
    wrapMethod(W.CSS, "supports", "CSS.supports");
    wrapMethod(W.OfflineAudioContext && OfflineAudioContext.prototype, "startRendering", "audio.startRendering", () => "AudioBuffer");
    wrapMethod(navigator.mediaDevices, "enumerateDevices", "mediaDevices.enumerateDevices", (v) =>
      Array.isArray(v) ? v.map((d) => `${d.kind}:${d.deviceId ? "id" : "noid"}:${d.label || ""}`) : preview(v),
    );
    wrapMethod(navigator.permissions, "query", "permissions.query", (v, a) =>
      `${a && a[0] && a[0].name} -> ${v && v.state}`,
    );
    wrapMethod(navigator.storage, "estimate", "storage.estimate");
    wrapMethod(navigator, "getBattery", "navigator.getBattery", (v) =>
      v ? preview({ level: v.level, charging: v.charging }) : null,
    );
    wrapMethod(navigator, "requestMediaKeySystemAccess", "requestMediaKeySystemAccess", (v, a) => `${a && a[0]}`);
    wrapMethod(navigator.mediaCapabilities, "decodingInfo", "mediaCapabilities.decodingInfo");
    wrapMethod(navigator.userAgentData, "getHighEntropyValues", "uaData.getHighEntropyValues");
    wrapMethod(W.PublicKeyCredential, "getClientCapabilities", "PublicKeyCredential.getClientCapabilities");
    wrapMethod(W.FontFace && FontFace.prototype, "load", "FontFace.load");
    wrapMethod(document.fonts, "check", "fonts.check");
    wrapMethod(W.indexedDB, "open", "indexedDB.open", (v, a) => `${a && a[0]}`);
    wrapMethod(W.indexedDB, "databases", "indexedDB.databases");

    if (navigator.gpu) {
      wrapMethod(navigator.gpu, "requestAdapter", "gpu.requestAdapter", (adapter) => {
        if (adapter) {
          wrapMethod(adapter, "requestAdapterInfo", "gpuAdapter.requestAdapterInfo");
          wrapMethod(adapter, "requestDevice", "gpuAdapter.requestDevice", () => "GPUDevice");
          try {
            bumpProbe("gpuAdapter.info", { ret: preview(adapter.info) });
          } catch (e) {}
        }
        return adapter ? "GPUAdapter" : "null";
      });
      wrapMethod(navigator.gpu, "getPreferredCanvasFormat", "gpu.getPreferredCanvasFormat");
    }

    for (const name of ["RTCPeerConnection", "webkitRTCPeerConnection"]) {
      const Native = W[name];
      if (!Native) continue;
      const Wrapped = function (config, ...rest) {
        const pc = new Native(config, ...rest);
        bumpProbe(`${name}.new`, { args: [preview(config, 300)] });
        try {
          pc.addEventListener("icecandidate", (e) => {
            bumpProbe(`${name}.icecandidate`, {
              ret: e.candidate ? e.candidate.candidate : "(end of candidates)",
            });
          });
        } catch (e) {}
        return pc;
      };
      Wrapped.prototype = Native.prototype;
      W[name] = stealth(Wrapped, Native);
      restores.push(() => {
        W[name] = Native;
      });
    }

    for (const name of ["PresentationRequest"]) {
      const Native = W[name];
      if (!Native) continue;
      const Wrapped = function (...args) {
        bumpProbe(`${name}.new`, { args: args.map((a) => preview(a, 200)) });
        return new Native(...args);
      };
      Wrapped.prototype = Native.prototype;
      W[name] = stealth(Wrapped, Native);
      restores.push(() => {
        W[name] = Native;
      });
    }

    const nativeCreateElement = document.createElement;
    document.createElement = stealth(function (tag, ...rest) {
      const el = nativeCreateElement.call(document, tag, ...rest);
      const t = String(tag).toLowerCase();
      if (t === "iframe" || t === "canvas" || t === "script") bumpProbe(`createElement.${t}`, {});
      return el;
    }, nativeCreateElement);
    restores.push(() => {
      document.createElement = nativeCreateElement;
    });
  }

  function hookProps() {
    const targets = [
      [navigator, ["userAgent", "platform", "vendor", "languages", "language", "hardwareConcurrency", "deviceMemory", "maxTouchPoints", "plugins", "mimeTypes", "webdriver", "productSub", "appVersion", "oscpu", "pdfViewerEnabled", "doNotTrack", "cookieEnabled", "onLine"], "navigator"],
      [screen, ["width", "height", "availWidth", "availHeight", "colorDepth", "pixelDepth", "availLeft", "availTop"], "screen"],
      [window, ["devicePixelRatio", "innerWidth", "innerHeight", "outerWidth", "outerHeight"], "window"],
    ];
    for (const [obj, keys, label] of targets) {
      for (const key of keys) {
        let desc;
        try {
          desc = findDescriptor(obj, key);
        } catch (e) {
          continue;
        }
        if (!desc || !desc.owner || !desc.desc.configurable) continue;
        const d = desc.desc;
        const read = d.get ? () => d.get.call(obj) : () => d.value;
        try {
          Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: d.enumerable,
            get: stealth(function () {
              const v = read();
              bumpProbe(`${label}.${key}`, { ret: preview(v, 120) });
              return v;
            }, d.get || function () {}),
          });
          restores.push(() => {
            try {
              if (desc.owner === obj) Object.defineProperty(obj, key, d);
              else delete obj[key];
            } catch (e) {}
          });
        } catch (e) {}
      }
    }
    note("property tracing on — this changes property descriptors and IS detectable (s118/s162/s166)");
  }

  function findDescriptor(obj, key) {
    let cur = obj;
    while (cur) {
      const desc = Object.getOwnPropertyDescriptor(cur, key);
      if (desc) return { owner: cur, desc };
      cur = Object.getPrototypeOf(cur);
    }
    return null;
  }

  function wrapAgentApi(mod, globalName) {
    if (!mod || typeof mod.load !== "function") return mod;
    const nativeLoad = mod.load;
    mod.load = stealth(function (loadOpts) {
      const merged = Object.assign({}, loadOpts, { debug: true });
      state.api.push({ t: clock(), ev: "load", global: globalName, opts: preview(merged, 800) });
      if (!opts.quiet) nativeLog("[fpspy] load()", merged);
      return Promise.resolve(nativeLoad.call(this, merged)).then((agent) => {
        if (!agent || typeof agent.get !== "function") return agent;
        const nativeGet = agent.get;
        agent.get = stealth(function (getOpts) {
          const started = performance.now();
          state.api.push({ t: clock(), ev: "get", opts: preview(getOpts, 400) });
          return Promise.resolve(nativeGet.call(this, getOpts)).then(
            (result) => {
              const rec = {
                t: clock(),
                ev: "result",
                ms: +(performance.now() - started).toFixed(1),
                result,
              };
              state.api.push(rec);
              if (!opts.quiet) {
                nativeGroup(`[fpspy] visitorId ${result && result.visitorId} in ${rec.ms}ms`);
                nativeLog(result);
                nativeGroupEnd();
              }
              return result;
            },
            (err) => {
              state.api.push({ t: clock(), ev: "error", error: String(err) });
              throw err;
            },
          );
        }, nativeGet);
        return agent;
      });
    }, nativeLoad);
    note(`wrapped ${globalName}.load (debug forced on)`);
    return mod;
  }

  function watchGlobals() {
    for (const name of ["FingerprintJS", "FingerprintjsPro", "FingerprintJSPro", "FPJS", "fpjs", "fpPromise"]) {
      let cur;
      try {
        cur = window[name];
      } catch (e) {
        continue;
      }
      if (cur !== undefined) {
        wrapAgentApi(cur, name);
        continue;
      }
      try {
        Object.defineProperty(window, name, {
          configurable: true,
          enumerable: true,
          get() {
            return cur;
          },
          set(v) {
            cur = v;
            state.api.push({ t: clock(), ev: "global-set", global: name });
            try {
              wrapAgentApi(v, name);
            } catch (e) {}
          },
        });
      } catch (e) {}
    }
  }

  function watchScripts() {
    try {
      const mo = new MutationObserver((records) => {
        for (const r of records) {
          for (const n of r.addedNodes) {
            if (n.tagName === "SCRIPT" && n.src) {
              state.resources.push({ t: clock(), kind: "script", url: n.src });
              if (fpTarget(n.src)) note(`agent script injected: ${n.src}`);
            }
            if (n.tagName === "IFRAME") {
              state.resources.push({ t: clock(), kind: "iframe", url: n.src || "(srcless)" });
            }
          }
        }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      restores.push(() => mo.disconnect());
    } catch (e) {}
  }

  function snapshotResources() {
    try {
      for (const e of performance.getEntriesByType("resource")) {
        if (fpTarget(e.name)) {
          state.resources.push({
            t: +e.startTime.toFixed(1),
            kind: e.initiatorType,
            url: e.name,
            ms: +e.duration.toFixed(1),
            size: e.transferSize,
          });
        }
      }
    } catch (e) {}
  }

  async function snapshotStorage() {
    const out = { local: {}, session: {}, cookies: {}, databases: [] };
    for (const [store, bag] of [
      [localStorage, out.local],
      [sessionStorage, out.session],
    ]) {
      try {
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          const v = store.getItem(k);
          bag[k] = { raw: v.length > 400 ? v.slice(0, 400) + `…(${v.length})` : v };
          const decodedEntries = await decodeStorageValue(v);
          if (decodedEntries) bag[k].decoded = decodedEntries;
        }
      } catch (e) {}
    }
    try {
      for (const part of document.cookie.split(";")) {
        const i = part.indexOf("=");
        if (i > 0) out.cookies[part.slice(0, i).trim()] = part.slice(i + 1).trim();
      }
    } catch (e) {}
    try {
      if (indexedDB.databases) out.databases = (await indexedDB.databases()).map((d) => d.name);
    } catch (e) {}
    state.storage = out;
    return out;
  }

  async function decodeStorageValue(v) {
    if (typeof v !== "string" || !v.length) return null;
    let parsed;
    try {
      parsed = JSON.parse(v);
    } catch (e) {}
    if (Array.isArray(parsed)) {
      const out = [];
      for (const item of parsed) {
        if (Array.isArray(item) && typeof item[1] === "string") {
          const bytes = fromB64(item[1]);
          if (bytes) {
            const d = await decodeBody(bytes);
            out.push({ key: item[0], value: d.json !== undefined ? d.json : d });
          }
        }
      }
      if (out.length) return out;
    }
    if (/^[A-Za-z0-9+/=]{16,}$/.test(v)) {
      const bytes = fromB64(v);
      if (bytes) {
        const d = await decodeBody(bytes);
        if (d.json !== undefined) return d.json;
      }
    }
    return null;
  }

  function summary() {
    return {
      requests: state.requests.length,
      apiEvents: state.api.length,
      workers: state.workers.length,
      probeApis: Object.keys(state.probeCounts).length,
      probeCalls: Object.values(state.probeCounts).reduce((a, b) => a + b, 0),
    };
  }

  const api = {
    version: VERSION,
    opts,
    state,
    decode: (v) => decodeBody(typeof v === "string" && /^[A-Za-z0-9+/=]+$/.test(v) ? fromB64(v) || v : v),
    unframe: (v, wide = true) => frameCandidates(toU8(v), wide),
    signals: (payload) => flattenSignals(payload, "", []),
    last() {
      return state.requests[state.requests.length - 1];
    },
    payloads() {
      return state.requests.filter((r) => r.decoded && r.decoded.json !== undefined).map((r) => r.decoded.json);
    },
    storage: snapshotStorage,
    probes(sort = true) {
      const rows = Object.entries(state.probeCounts).map(([api, calls]) => ({ api, calls }));
      if (sort) rows.sort((a, b) => b.calls - a.calls);
      nativeTable(rows);
      return rows;
    },
    deep() {
      hookProbes();
      opts.deep = true;
      note("method probes on");
    },
    deepProps() {
      hookProps();
      opts.deepProps = true;
    },
    dump() {
      nativeGroup("[fpspy] dump");
      nativeLog("summary", summary());
      nativeTable(state.requests.map((r) => ({ t: r.t, method: r.method, url: r.url.slice(0, 90), enc: r.decoded && r.decoded.encoding, req: r.reqSize, status: r.status, ms: r.ms })));
      nativeLog("requests", state.requests);
      nativeLog("api", state.api);
      nativeLog("workers", state.workers);
      nativeLog("storage", state.storage);
      nativeLog("resources", state.resources);
      api.probes();
      nativeGroupEnd();
      return state;
    },
    json(space = 2) {
      const seen = new WeakSet();
      return JSON.stringify(
        Object.assign({ summary: summary() }, state),
        (k, v) => {
          if (typeof v === "object" && v !== null) {
            if (seen.has(v)) return "[circular]";
            seen.add(v);
          }
          if (ArrayBuffer.isView(v) || v instanceof ArrayBuffer) return `[bytes ${toU8(v).length}]`;
          if (typeof v === "function") return "[function]";
          return v;
        },
        space,
      );
    },
    async save(filename) {
      await snapshotStorage();
      snapshotResources();
      const blob = new nativeBlob([api.json()], { type: "application/json" });
      const url = nativeCreateObjectURL.call(URL, blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `fpspy-${location.hostname}-${Date.now()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return a.download;
    },
    copy() {
      const text = api.json();
      if (navigator.clipboard) return navigator.clipboard.writeText(text).then(() => text.length);
      return text;
    },
    stop() {
      while (restores.length) {
        try {
          restores.pop()();
        } catch (e) {}
      }
      note("uninstalled");
      return summary();
    },
  };

  installToStringTrap();
  hookFetch();
  hookXhr();
  hookBeacon();
  hookBlobAndWorkers();
  watchGlobals();
  watchScripts();
  snapshotResources();
  if (opts.deep) hookProbes();
  snapshotStorage();

  window[NS] = api;
  nativeLog(
    `%c[fpspy ${VERSION}]%c installed on ${location.host}\n` +
      `  __fpspy.dump()      console report\n` +
      `  __fpspy.payloads()  decoded request bodies\n` +
      `  __fpspy.signals(p)  flatten {s,v} pairs with labels\n` +
      `  __fpspy.probes()    API call counts\n` +
      `  __fpspy.storage()   local/session/cookie/idb snapshot, framed values decoded\n` +
      `  __fpspy.decode(x)   decode a base64/bytes body by hand\n` +
      `  __fpspy.deepProps() trace navigator/screen reads (DETECTABLE)\n` +
      `  __fpspy.save()      download everything as JSON\n` +
      `  __fpspy.stop()      restore all originals`,
    "color:#0a0;font-weight:bold",
    "color:inherit",
  );
  return api;
})();
