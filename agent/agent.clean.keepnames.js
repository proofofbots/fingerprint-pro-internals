const w = {
  client_timeout: "Client timeout",
  network_connection: "Network connection error",
  network_abort: "Network request aborted",
  csp_block: "Blocked by CSP",
  invalid_endpoint: 'The provided endpoint in "endpoints" parameter is not a valid URL',
  handle_agent_data: "Handle on demand agent data error",
  script_load_fail: "Failed to load the JS script of the agent",
  bundle_not_defined: "9319",
  bad_response_format: "Can't parse the backend response. Make sure the proper endpoints are used.",
  api_key_missing: "The `apiKey` option is not provided",
  api_key_invalid: "The `apiKey` option is not a string",
  cache_misconfigured: "The `cache` option is misconfigured",
  endpoints_misconfigured: "The `endpoints` option is misconfigured",
  wrong_worker_option: "Wrong `worker` option, it should be a Worker instance",
  worker_initialization_failed: "Web Worker initialization failed",
  sandboxed_iframe: "Running inside sandboxed iframes is not supported",
};
class V extends Error {
  constructor(m, W) {
    super(m);
    this.name = "FingerprintError";
    this.event_id = null;
    this.code = W;
  }
}
function M(m) {
  const W = Number(m);
  return isNaN(W) ? -1 : W;
}
function u() {
  const m = ql();
  return { u: m ? nl(m, 1e3) : null };
}
function S$1(m = `${"[Fingerprint]"} `) {
  const W = {};
  return (l) => {
    switch (l.e) {
      case 15:
        W[l.getCallId] = l.body;
        break;
      case 18:
        console.log(`${m}Visitor id request`, W[l.getCallId]);
        break;
      case 19:
        console.log(`${m}Visitor id response`, l.body);
        break;
      case 16:
      case 17:
        delete W[l.getCallId];
    }
  };
}
function e(m) {
  return matchMedia(`(prefers-contrast: ${m})`).matches;
}
function z() {
  return !document.hidden;
}
function F(m) {
  return !!m && typeof m.then == "function";
}
async function b(m) {
  if (!PO()) {
    return [false, m];
  }
  const [W, l] = (function () {
      try {
        return [true, new CompressionStream("deflate-raw")];
      } catch (x) {
        return [false, new CompressionStream("deflate")];
      }
    })(),
    r = await (async function (m, W) {
      const l = W.writable.getWriter();
      l.write(m);
      l.close();
      const r = W.readable.getReader(),
        P = [];
      let N = 0;
      for (;;) {
        const { value: m, done: W } = await r.read();
        if (W) {
          break;
        }
        P.push(m);
        N += m.byteLength;
      }
      if (P.length === 1) {
        return P[0];
      }
      const t = new Uint8Array(N);
      let o = 0;
      for (const m of P) {
        t.set(m, o);
        o += m.byteLength;
      }
      return t;
    })(m, l),
    P = W
      ? r
      : (function (m) {
          return new Uint8Array(m.buffer, m.byteOffset + 2, m.byteLength - 6);
        })(r);
  return [true, P];
}
function A(m, W) {
  const l = new Error(W);
  l.name = m;
  return l;
}
function Z(m, W, l) {
  const r = () => {
      throw new Error("Invalid data");
    },
    P = XO(m);
  if (P.length < W.length + 2) {
    r();
  }
  for (let m = 0; m < W.length; ++m) {
    if (xD(P[1 + m], P[0]) !== W[m]) {
      r();
    }
  }
  const N = 1 + W.length,
    t = xD(P[N], P[0]);
  if (P.length < N + 1 + t + l) {
    r();
  }
  const o = N + 1 + t,
    a = o + l,
    O = new ArrayBuffer(P.length - a),
    f = new Uint8Array(O);
  for (let m = 0; m < f.length; ++m) {
    f[m] = P[a + m] ^ P[o + (m % l)];
  }
  return O;
}
function k$1(m, W) {
  try {
    return new window.URL(m, window.location.href);
  } catch (d) {
    if (FN(d)) {
      console.warn(`Ignoring an invalid '${W}' value: "${m}"`);
      return null;
    }
    throw d;
  }
}
function x(m) {
  return BD((m, { document: W }) => {
    const l = W.body;
    l.style.fontSize = "48px";
    const r = W.createElement("div");
    r.style.setProperty("visibility", "hidden", "important");
    const P = {},
      N = {},
      t = (m) => {
        const l = W.createElement("span"),
          { style: P } = l;
        P.position = "absolute";
        P.top = "0";
        P.left = "0";
        P.fontFamily = m;
        l.textContent = "mmMwWLliI0O&1";
        r.appendChild(l);
        return l;
      },
      o = (m, W) => t(`'${m}',${W}`),
      a = va.map(t),
      O = (() => {
        const m = {};
        for (const W of Ra) {
          m[W] = va.map((m) => o(W, m));
        }
        return m;
      })();
    l.appendChild(r);
    for (let m = 0; m < va.length; m++) {
      P[va[m]] = a[m].offsetWidth;
      N[va[m]] = a[m].offsetHeight;
    }
    const f = Ra.filter((m) => {
      W = O[m];
      return va.some((m, l) => W[l].offsetWidth !== P[m] || W[l].offsetHeight !== N[m]);
      var W;
    });
    l.removeChild(r);
    l.style.fontSize = "";
    return { s: 0, v: f };
  }, m.sis);
}
function C() {
  return new Promise((m) => {
    const W = new MessageChannel();
    W.port1.onmessage = () => m();
    W.port2.postMessage(null);
  });
}
async function T() {
  const N = await cO();
  let t = null;
  if (!(N.s === 0)) {
    return N;
  }
  t = NW(N, "v");
  if (!oN()) {
    return { s: -1, v: null };
  }
  const o = uO();
  if (o) {
    return { s: 0, v: [t, o] };
  }
  return { s: -5, v: null };
}
let q;
async function G(m, W, l) {
  for (const P of m) {
    try {
      return !!(await Yf(P, W, l));
    } catch (w) {}
  }
  return false;
}
function B(m) {
  const W = location.hostname,
    l = vl();
  if (
    !(function (m, W) {
      let l = m.length - (m.slice(-1) === "." ? 1 : 0);
      do {
        if (((l = l > 0 ? m.lastIndexOf(".", l - 1) : -1), W(m.slice(l + 1)) === true)) {
          return true;
        }
      } while (l >= 0);
      return false;
    })(W, (r) => {
      if (!l || !/^([^.]{1,3}\.)*[^.]+\.?$/.test(r) || r === W) {
        return m(r);
      }
    })
  ) {
    m();
  }
}
function I(m) {
  return m.reduce((m, W) => m + (W ? 1 : 0), 0);
}
function v(m) {
  return matchMedia(`(prefers-color-scheme: ${m})`).matches;
}
function R() {
  return { error: new V(w.bad_response_format, "bad_response_format") };
}
const E = Array.isArray;
async function K(m) {
  const f = await lN(m, false);
  switch (f.s) {
    case -3:
      return { s: -4, v: null };
    case -1:
      return { s: -1, v: null };
    case -2:
      return { s: -3, v: null };
  }
  const d = vD(
      "CAUSxwUKwQIIAxIQFwW5F8wSBIaLBjM6L3cqjBiCtIKSBSKOAjCCAQoCggEBAJntWzsyfateJO/DtiqVtZhSCtW8yzdQPgZFuBTYdrjfQFEEQa2M462xG7iMTnJaXkqeB5UpHVhYQCOn4a8OOKkSeTkwCGELbxWMh4x+Ib/7/up34QGeHleB6KRfRiY9FOYOgFioYHrc4E+shFexN6jWfM3rM3BdmDoh+07svUoQykdJDKR+ql1DghjduvHK3jOS8T1v+2RC/THhv0CwxgTRxLpMlSCkv5fuvWCSmvzu9Vu69WTi0Ods18Vcc6CCuZYSC4NZ7c4kcHCCaA1vZ8bYLErF8xNEkKdO7DevSy8BDFnoKEPiWC8La59dsPxebt9k+9MItHEbzxJQAZyfWgkCAwEAAToUbGljZW5zZS53aWRldmluZS5jb20SgAOuNHMUtag1KX8nE4j7e7jLUnfSSYI83dHaMLkzOVEes8y96gS5RLknwSE0bv296snUE5F+bsF2oQQ4RgpQO8GVK5uk5M4PxL/CCpgIqq9L/NGcHc/N9XTMrCjRtBBBbPneiAQwHL2zNMr80NQJeEI6ZC5UYT3wr8+WykqSSdhV5Cs6cD7xdn9qm9Nta/gr52u/DLpP3lnSq8x2/rZCR7hcQx+8pSJmthn8NpeVQ/ypy727+voOGlXnVaPHvOZV+WRvWCq5z3CqCLl5+Gf2Ogsrf9s2LFvE7NVV2FvKqcWTw4PIV9Sdqrd+QLeFHd/SSZiAjjWyWOddeOrAyhb3BHMEwg2T7eTo/xxvF+YkPj89qPwXCYcOxF+6gjomPwzvofcJOxkJkoMmMzcFBDopvab5tDQsyN9UPLGhGC98X/8z8QSQ+spbJTYLdgFenFoGq47gLwDS6NWYYQSqzE3Udf2W7pzk4ybyG4PHBYV3s4cyzdq8amvtE/sNSdOKReuHpfQ=",
    ),
    D = await AN(NW(f, "v"));
  if (D.s === -1) {
    return { s: -6, v: null };
  }
  return { s: 0, v: CD(await FO(NW(D, "v"), d)) };
}
function U() {
  return { s: 0, v: new URL("C:/").protocol };
}
async function J(m, W) {
  let a;
  try {
    a = m.createOffer(W);
  } catch (R) {
    if (
      !(R instanceof Error) ||
      !new RegExp(
        "\\bcreateOffer\\b.*(\\bcallback\\b.*\\bnot a function\\b|\\barguments required\\b.*\\bpresent\\b)",
        "i",
      ).test(NW(R, "message"))
    ) {
      throw R;
    }
    a = new Promise((r, P) => {
      m.createOffer(r, P, W);
    });
  }
  const O = await a;
  if (O === undefined) {
    return { s: -8, v: null };
  }
  return { s: 0, v: O };
}
function h(m, W, l) {
  let r = [],
    P = null;
  if (m.internal) {
    try {
      [r, P] = (function (m) {
        const W = Yt(Xm(vD(m), false));
        return [W.notifications, W.visitor_token];
      })(m.internal);
    } catch (S) {
      return R();
    }
  }
  for (const m of r) {
    Ll(m);
  }
  if (m.error) {
    return { error: zo(m.error), stop: m.error.code === "visitor_not_found" };
  }
  !(function (m, W, l) {
    var r;
    for (const P of W) {
      if (!((r = P.onGetResponse) == null)) {
        r.call(P, m, l);
      }
    }
  })(P, W, l);
  const N = {
    event_id: m.event_id,
    sealed_result: m.sealed_result === null ? null : NO(m.sealed_result),
  };
  if ("visitor_id" in m) {
    N.visitor_id = m.visitor_id;
  }
  if ("suspect_score" in m) {
    N.suspect_score = m.suspect_score;
  }
  return { result: N };
}
function j() {
  if (navigator.plugins === undefined) {
    return { s: -1, v: null };
  }
  const { plugins: m } = navigator;
  let W = Object.getPrototypeOf(m) === PluginArray.prototype;
  for (let l = 0; l < m.length; l++) {
    if (W) {
      W = Object.getPrototypeOf(m[l]) === Plugin.prototype;
    }
  }
  return { s: 0, v: W };
}
async function _() {
  const a = navigator.managed;
  if (!a || typeof a.getManagedConfiguration !== "function") {
    return { s: -1, v: null };
  }
  if (rm() && Zm()) {
    return { s: -3, v: null };
  }
  try {
    await a.getManagedConfiguration([""]);
  } catch (T) {
    if (T instanceof Error) {
      const l = [
        1754725009, 1957733438, 1042345413, 1882473574, 1759470430, 348095318, 1236583996,
      ].indexOf(pl(NW(T, "message")));
      if (l !== -1) {
        return { s: 0, v: Bl(l) };
      }
    }
    throw T;
  }
  return { s: 0, v: "" };
}
function i(m, W) {
  const l = [],
    r = Object.getOwnPropertyNames(m);
  for (let m = 0; m < r.length; m++) {
    const P = r[m],
      N = pl(P);
    if (W.has(N)) {
      l.push({ i: m, n: P });
    }
  }
  return { l: r.length, p: l };
}
function mm() {
  return (
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    null
  );
}
function Wm() {
  const N = new Uint32Array(4);
  window.crypto.getRandomValues(N);
  return [N[0] | 0, N[1] | 0, N[2] | 0, N[3] | 0];
}
async function lm(m) {
  return BD((m, W) => {
    const l = W.document.createElement("div");
    l.style.border = ".5px dotted transparent";
    W.document.body.appendChild(l);
    const r = l.offsetHeight;
    W.document.body.removeChild(l);
    return { s: 0, v: r };
  }, m.sis);
}
function rm() {
  return (
    I([
      "webkitPersistentStorage" in navigator,
      "webkitTemporaryStorage" in navigator,
      (navigator.vendor || "").indexOf("Google") === 0,
      "webkitResolveLocalFileSystemURL" in window,
      "BatteryManager" in window,
      "webkitMediaStream" in window,
      "webkitSpeechGrammar" in window,
    ]) >= 5
  );
}
function Pm() {
  return "mediaCapabilities" in navigator && "decodingInfo" in navigator.mediaCapabilities;
}
function Nm(m) {
  const W = {};
  for (const l of Object.keys(m)) {
    const r = m[l];
    if (r) {
      const m = "error" in r ? rt(r.error) : r.value;
      W[l] = m;
    }
  }
  return W;
}
const tm = [4283543511, 3981806797],
  om = [3301882366, 444984403];
function am() {
  const { HTMLElement: W, Document: l } = window;
  return (
    I([
      "safari" in window,
      !("ongestureend" in window),
      !("TouchEvent" in window),
      !("orientation" in window),
      W && !("autocapitalize" in W.prototype),
      l && "pointerLockElement" in l.prototype,
    ]) >= 4
  );
}
const Om = [2277735313, 289559509],
  fm = [1291169091, 658871167],
  dm = [0, 5],
  Dm = [0, 1390208809],
  sm = [0, 944331445];
function ym() {
  return kf(Qr(250, { s: -2, v: null }), _);
}
function Hm() {
  const m = new Image().style;
  return BW(
    [Pf((W = m), "webkitTapHighlightColor"), Pf(W, "webkitTouchCallout")],
    [
      18, 23, 22, 11, 23, 17, 3, 20, 4, 22, 19, 11, 25, 13, 23, 22, 7, 7, 17, 18, 4, 18, 11, 8, 11,
      8, 3, 5, 2, 4, 3, 3, 5, 6, 5, 3, 1, 2, 2, 0, 0,
    ],
  );
  var W;
}
function Xm(m, W) {
  return Z(m, W ? It : Bt, 9);
}
function wm(m) {
  return BD((m, W) => {
    const l = {},
      r = W.document.createElement("div");
    function P(m) {
      r.style.color = m;
      return W.getComputedStyle(r).color;
    }
    W.document.body.appendChild(r);
    const N = {
      AccentColor: "ac",
      AccentColorText: "act",
      ActiveText: "at",
      ActiveBorder: "ab",
      ActiveCaption: "aca",
      AppWorkspace: "aw",
      Background: "b",
      ButtonHighlight: "bh",
      ButtonShadow: "bs",
      ButtonBorder: "bb",
      ButtonFace: "bf",
      ButtonText: "bt",
      FieldText: "ft",
      GrayText: "gt",
      Highlight: "h",
      HighlightText: "ht",
      InactiveBorder: "ib",
      InactiveCaption: "ic",
      InactiveCaptionText: "ict",
      InfoBackground: "ib",
      InfoText: "it",
      LinkText: "lt",
      Mark: "m",
      Menu: "me",
      Scrollbar: "s",
      ThreeDDarkShadow: "tdds",
      ThreeDFace: "tdf",
      ThreeDHighlight: "tdh",
      ThreeDLightShadow: "tdls",
      ThreeDShadow: "tds",
      VisitedText: "vt",
      Window: "w",
      WindowFrame: "wf",
      WindowText: "wt",
      Selecteditem: "si",
      Selecteditemtext: "sit",
    };
    for (const m of Object.keys(N)) {
      l[N[m]] = P(m);
    }
    W.document.body.removeChild(r);
    return { s: 0, v: l };
  }, m.sis);
}
function Vm() {
  return "geolocation" in navigator && navigator.geolocation !== undefined;
}
function Mm(m) {
  try {
    m.close();
  } catch (L) {}
}
function um(m) {
  return `${m.code ?? "NO_CODE"}: ${m}`;
}
async function Sm() {
  return PW()
    ? kf(Qr(500, { s: -2, v: null }), async () => {
        const l = await Hf();
        if (l[0] === -1) {
          return { s: -3, v: null };
        }
        return { s: 0, v: l };
      })
    : () => ({ s: -1, v: null });
}
function Lm() {
  return new TypeError("Can't pick from nothing");
}
async function em(m, W, l = 16) {
  const r = Array(m.length);
  let P = Date.now();
  for (let N = 0; N < m.length; ++N) {
    r[N] = W(m[N], N);
    const t = Date.now();
    if (t >= P + l) {
      P = t;
      await C();
    }
  }
  return r;
}
function zm(m) {
  const [W, l] = Fo(m, "#"),
    [r, P] = Fo(W, "?");
  let N, t;
  const o = /^((\w+:)?\/\/[^/]*)?((\/)(.*)|$)$/.exec(r);
  if (o) {
    N = (o[1] || "") + (o[4] || "");
    t = o[5] || "";
  } else {
    N = "";
    t = r;
  }
  return {
    origin: N,
    path: t,
    query: P.length ? P.join("?") : null,
    fragment: l.length ? l.join("#") : null,
  };
}
async function Fm() {
  const e = navigator.storageBuckets;
  if (!e || typeof e !== "object" || typeof e.open !== "function") {
    return { s: -1, v: null };
  }
  const z = Math.random().toString().split(".")[1];
  let F;
  try {
    F = await e.open(z);
  } catch (Q) {
    if (rO(Q)) {
      return { s: -101, v: null };
    }
    throw Q;
  }
  const b = F.indexedDB;
  if (b === undefined || typeof b.open !== "function" || typeof F.estimate !== "function") {
    return { s: -1, v: null };
  }
  try {
    const t = await new Promise((t, o) => {
        try {
          const m = b.open("1");
          m.onupgradeneeded = () => {
            m.result.createObjectStore("s", { keyPath: "k" });
          };
          m.onsuccess = async () => {
            m.result.close();
            t(await F.estimate());
          };
          m.onerror = () => {
            o(NW(m, "error"));
          };
        } catch (y) {
          o(y);
        }
      }),
      o = t?.usage;
    if (o === undefined || typeof o !== "number") {
      return { s: -3, v: null };
    }
    return { s: 0, v: o };
  } finally {
    if (typeof e.delete === "function") {
      e.delete(z).catch(() => {});
    }
  }
}
function bm() {
  return kf(Qr(450, { s: -2, v: null }), Qm);
}
function nm(m) {
  m.then(undefined, () => {});
  return m;
}
async function Ym(m, W) {
  const t = Array.from(m?.features.values()),
    [o, a] = await Promise.all([$t(m, t, W), BN(m)]);
  return [o, a, t];
}
function Am(m, W, l) {
  if (m === undefined) {
    return [W];
  }
  let r,
    P = false;
  if (vr(m)) {
    P = true;
    r = lt(m.value);
  } else {
    r = lt(m);
  }
  const N = [];
  for (const m of r) {
    const W = k$1(m, l);
    if (W) {
      N.push(W.href);
    }
  }
  if (!P) {
    N.push(W);
  }
  return N;
}
function Zm() {
  const m = rm(),
    W = vl();
  return m
    ? I([
        !("SharedWorker" in window),
        navigator.connection && "ontypechange" in navigator.connection,
        !("sinkId" in new Audio()),
      ]) >= 2
    : !!W &&
        I([
          "onorientationchange" in window,
          "orientation" in window,
          /android/i.test(navigator.appVersion),
        ]) >= 2;
}
function km() {
  crypto.getRandomValues(bl);
  return bl[0];
}
function Cm() {
  return (
    I([
      "ApplePayError" in window,
      "CSSPrimitiveValue" in window,
      "Counter" in window,
      navigator.vendor.indexOf("Apple") === 0,
      "RGBColor" in window,
      "WebKitMediaKeys" in window,
    ]) >= 4
  );
}
function Tm(m, W, l) {
  const r = Pf(m, W);
  if (!r) {
    return "";
  }
  const P = vD(l),
    N = Array(P.length);
  for (let m = 0; m < P.length; m++) {
    N[m] = P[m] ^ r.charCodeAt(m % r.length);
  }
  return String.fromCharCode.apply(null, N);
}
function qm(m, W, l, r) {
  const P = (function (m) {
      const W = [...m];
      return {
        current: () => W[0],
        postpone() {
          const m = W.shift();
          if (m !== undefined) {
            W.push(m);
          }
        },
        exclude() {
          W.shift();
        },
      };
    })(m),
    N = sr(l, r),
    t = new Set();
  return [
    P.current(),
    (m, l, r) => {
      const o = W(m, l, r);
      if (o.action === "exclude") {
        P.exclude();
      } else {
        P.postpone();
      }
      const a = () => Math.max(0, m.getTime() + N() - Date.now());
      let O;
      O = typeof o.delay == "number" ? o.delay : a();
      const f = P.current();
      if (O === 0 && f) {
        if (Date.now() - m.getTime() < 50) {
          if (t.has(f)) {
            O = a();
          } else {
            t.add(f);
          }
        }
      }
      return f === undefined ? undefined : [f, O];
    },
  ];
}
function Gm(m) {
  if (m) {
    return { p: m.path ? 1 : undefined, q: m.query ? 1 : undefined, f: m.fragment ? 1 : undefined };
  }
}
function cm(m, W, l) {
  B((W) => {
    !(function (m, W) {
      Jl(m, "", -1, W);
    })(m, W);
  });
  if (!(l < 0)) {
    B((r) => {
      Jl(m, W, l, r);
      return ID(m) === W;
    });
  }
}
function Bm(m) {
  return Ur(ul(m.toDataURL()));
}
function Im() {
  const W = function (m, W) {
      return m * W;
    },
    a = [];
  let O = Math.random();
  for (let f = 24575; f >= 0; --f) {
    if (f % 4096 === 0) {
      const m = Math.random();
      a.push(W(O - m, 2 ** 31) | 0);
      O = m;
    }
  }
  return { s: 0, v: a };
}
async function Qm() {
  const r = window.PublicKeyCredential;
  if (!r || typeof r.getClientCapabilities !== "function") {
    return { s: -1, v: null };
  }
  const P = await r.getClientCapabilities(),
    N = {};
  for (const [W, l] of Object.entries(P)) {
    const r = Jd[W];
    if (r !== undefined) {
      N[r] = l;
    }
  }
  return { s: 0, v: N };
}
function vm(m) {
  return SD(m, ft);
}
async function Rm() {
  if (!("mediaCapabilities" in navigator)) {
    return { s: -1, v: null };
  }
  return {
    s: 0,
    v: await Promise.all(
      Td.map(async (N) => {
        try {
          const r = await navigator.mediaCapabilities.decodingInfo(N);
          let P = 0;
          if (r.supported) {
            P += 1;
          }
          if (r.smooth) {
            P += 2;
          }
          if (r.powerEfficient) {
            P += 4;
          }
          return P;
        } catch (s) {
          return s instanceof Error ? NW(s, "message") : String(s);
        }
      }),
    ),
  };
}
function Em(W) {
  var l;
  const r = (function (m) {
      const W = m.filter((m) => !!m);
      return W.length
        ? (...m) => {
            for (const l of W) {
              AD(() => l(...m));
            }
          }
        : undefined;
    })([QP() && S$1(), ...(W?.modules || []).map((m) => m.addEvent)]),
    P =
      r &&
      (function (m, W) {
        return (l) => {
          const r = { ...l, agentId: W };
          return m(r);
        };
      })(r, wd(8));
  bt(P, () => ({ e: 0, version: "4.1.4", options: W }));
  try {
    const {
      apiKey: r,
      region: N = "us",
      storageKeyPrefix: t = "_vid_",
      endpoints: o,
      te: D,
      integrationInfo: H = [],
      imi: M = { m: "s" },
      urlHashing: u,
      modules: S,
      abTests: L = {},
      externalABSelections: e = {},
      optimizeRepeatedVisits: z = false,
      aggressiveOptimization: n = false,
      extendedSignalCollection: Y = true,
      webRtcViaPort80: A = false,
      worker: Z,
      cache: x,
    } = W;
    if (!r) {
      throw new V(w.api_key_missing, "api_key_missing");
    }
    if (typeof r != "string") {
      throw new V(w.api_key_invalid, "api_key_invalid");
    }
    if (
      x &&
      !(function (m) {
        return (
          !!m &&
          ((W = m.duration), (typeof W == "number" && W > 0 && W <= 43200) || ao.includes(W)) &&
          oo.includes(m.storage)
        );
        var W;
      })(x)
    ) {
      throw new V(w.cache_misconfigured, "cache_misconfigured");
    }
    if (
      (function () {
        try {
          document.cookie;
          return false;
        } catch (K) {
          return qr(K);
        }
      })()
    ) {
      throw new V(w.sandboxed_iframe, "sandboxed_iframe");
    }
    const C = (function (m) {
        const W = (m) => {
          if (m instanceof Worker) {
            return m;
          }
          throw FW();
        };
        if (m instanceof Worker) {
          return m;
        }
        if (!F(m)) {
          throw FW();
        }
        return nm(m).then(W);
      })(Z),
      T = (function (m, W, l) {
        const r = { ...l },
          P = Object.entries(m);
        for (const [m, l] of P) {
          const P = W[m];
          if (P) {
            try {
              r[m] = tO(P);
              continue;
            } catch (U) {
              console.error(U);
            }
          }
          r[m] = tO(l);
        }
        return r;
      })(
        (function (m) {
          const W = { ...Ir };
          for (const l of m) {
            Object.assign(W, l.ab);
          }
          return W;
        })(S),
        L,
        e,
      ),
      q = (function (m, W, l) {
        if (m === undefined) {
          return { helper: [l(W)], ingress: [W] };
        }
        if (kr(m)) {
          const r = (function (m, W, l) {
            let r,
              P = false;
            if (vr(m)) {
              P = true;
              r = lt(m.value);
            } else {
              r = lt(m);
            }
            const N = [],
              t = [];
            for (const m of r) {
              const W = k$1(m, "endpoints");
              if (W) {
                N.push(Ar(W, l));
                t.push(W.href);
              }
            }
            if (!P) {
              N.push(l(W));
              t.push(W);
            }
            return { helper: N, ingress: t };
          })(m, W, l);
          return { helper: r.helper, ingress: r.ingress };
        }
        if (
          (function (m) {
            if (!m || typeof m != "object") {
              return false;
            }
            const W = m;
            return (
              typeof W.__type__ == "string" &&
              pl(W.__type__) === 694409711 &&
              (W.script === undefined || kr(W.script)) &&
              (W.helper === undefined || kr(W.helper)) &&
              (W.ingress === undefined || kr(W.ingress))
            );
          })(m)
        ) {
          return { helper: Am(m.helper, l(W), "helper"), ingress: Am(m.ingress, W, "ingress") };
        }
        return null;
      })(
        o,
        (function (m) {
          let l = "api.fpjs.io";
          if (m !== "us") {
            l = "" + m + "." + l + "";
          }
          return "https://" + l + "/";
        })(N),
        mN,
      );
    if (q === null) {
      throw new V(w.endpoints_misconfigured, "endpoints_misconfigured");
    }
    const G =
      (l = (function (m) {
        for (const W of m) {
          if (W.browserCache) {
            return W.browserCache;
          }
        }
        return;
      })(S)) == null
        ? undefined
        : l(q.helper, r, undefined, P);
    bt(P, () => ({ e: 12 }));
    const c = (function (m, W) {
        return m === undefined ? uf(W) : String(m);
      })(D, N),
      B = { aq: [], ipq: false, si: null, siw: null, ip: null, dc: { adb: 0, crs: 0, asib: 0 } };
    !(function (m, W = 50) {
      m.ip = nm(
        (async function (m, W) {
          const { dc: P } = m;
          for (; !document.body;) {
            P.adb++;
            await VO(W);
          }
          const t = document.createElement("iframe");
          await new Promise((m, W) => {
            let l = false;
            const r = () => {
                l = true;
                m();
              },
              o = (m) => {
                l = true;
                W(m);
              };
            t.onload = r;
            t.onerror = o;
            const { style: a } = t;
            a.setProperty("display", "block", "important");
            a.position = "absolute";
            a.top = "0";
            a.left = "0";
            a.visibility = "hidden";
            t.src = "about:blank";
            document.body.appendChild(t);
            const O = () => {
              P.crs++;
              if (!l) {
                if (t.contentWindow?.document?.readyState === "complete") {
                  r();
                } else {
                  setTimeout(O, 10);
                }
              }
            };
            O();
          });
          for (; !t.contentWindow?.document?.body;) {
            P.asib++;
            await VO(W);
          }
          m.si = t;
          m.siw = t.contentWindow;
        })(m, W),
      );
    })(B);
    const { getComponents: I, collectWorkerComponents: Q } = (function (m, W, l, r, P, N, t, o, a) {
        const O = { urlHashing: P, ab: N, te: r, sis: t, esc: o, ewr: a },
          f = (function (m, W) {
            const l = { ...W, sis: undefined, cache: undefined },
              r = nm(
                (async function (m, W) {
                  const l = await m;
                  UO(l, 0);
                  await sW(l, [1, 2]);
                  await (async function (m, W) {
                    UO(m, 3, W);
                    const l = await sW(m, [4, 5]);
                    if (l[0] === 5) {
                      throw Pd(l);
                    }
                  })(l, W);
                  return l;
                })(m, l),
              );
            let P;
            return async () => {
              if (!(P != null)) {
                P = r.then(PN);
              }
              try {
                return await P;
              } catch (B) {
                throw (function (m) {
                  if (m instanceof V) {
                    return m;
                  }
                  const W = w.worker_initialization_failed;
                  let l;
                  if (m instanceof Error) {
                    l = `${m.name}: ${m.message}`;
                  } else {
                    if (m != null) {
                      l = String(m);
                    }
                  }
                  return new V(l ? `${W}. ${l}` : W, "worker_initialization_failed");
                })(B);
              }
            };
          })(m, O),
          d = (function (m, W, l) {
            const r = { ...l, cache: {} },
              [P, N] = (function (m) {
                const W = {},
                  l = {},
                  r = {};
                for (const { sources: P } of m) {
                  if (P) {
                    Object.assign(W, P.stage1);
                    Object.assign(l, P.stage2);
                    Object.assign(r, P.stage3);
                  }
                }
                const P = l;
                Object.assign(P, r);
                return [W, P];
              })(m),
              t = W ? 1e5 : 50,
              o = Hd(P, r, [], t),
              a = nm(
                (function (m = 50) {
                  return (function (m, W = Infinity) {
                    const { requestIdleCallback: l } = window;
                    return l
                      ? new Promise((m) => l.call(window, () => m(), { timeout: W }))
                      : ED(Math.min(m, W));
                  })(m, 2 * m);
                })(8).then(() => Hd(N, r, [], t)),
              );
            return async () => {
              const [m, W] = await Promise.all([o(), a.then((m) => m())]);
              !(function (m) {
                const { si: W, aq: l } = m;
                if (W && W.parentNode) {
                  W.parentNode.removeChild(W);
                }
                m.si = null;
                m.siw = null;
                m.ip = null;
                for (; l.length > 0;) {
                  const m = l.shift();
                  if (m) {
                    m.reject(new Error("Iframe cleanup called"));
                  }
                }
                m.ipq = false;
              })(r.sis);
              const l = W;
              Object.assign(l, m);
              return l;
            };
          })(W, l, O);
        return {
          getComponents: async () => {
            const [m, W] = await Promise.all([f(), d()]);
            Object.assign(W, m);
            return W;
          },
          collectWorkerComponents: f,
        };
      })(C, S, n, c, u, T, B, Y, A),
      v = (function (W, l, r, P, N, t, o, a, O, f, d, D, s, y) {
        const M = {
          modules: W,
          apiKey: N,
          ii: a,
          imi: O,
          storageKeyPrefix: o,
          ab: d,
          urlHashing: f,
        };
        function u(m) {
          if (!y) {
            return;
          }
          const W = wd(8);
          switch (m) {
            case "get":
              return (function (m, W) {
                return (l) => {
                  const r = { ...l, getCallId: W };
                  return m(r);
                };
              })(y, W);
            case "collect":
              return (function (m, W) {
                return (l) => {
                  const r = { ...l, collectCallId: W };
                  return m(r);
                };
              })(y, W);
          }
        }
        const S = (W) =>
            Qr(W != null ? W : 1e4).then(() =>
              Promise.reject(new V(w.client_timeout, "client_timeout")),
            ),
          L = (m = {}) => {
            const W = u("collect");
            return LN(
              W,
              () => ({ e: 21, options: m }),
              (m) => ({ e: 22, result: m }),
              (m) => ({ e: 23, error: m }),
              () => hf((l) => e(m, W, l)),
            );
          },
          e = async (m, l, r) => {
            var P;
            const N = S(m.timeout);
            r(await z(m, N, l));
            for (const m of W) {
              if (!((P = m.onCollectResponse) == null)) {
                P.call(m, o);
              }
            }
          },
          z = async ({ timeout: m = 1e4, tag: W, linkedId: l }, r, P) => {
            const N = nm(Promise.all([C(P), x(m, P)])),
              [t, o] = await Promise.race([r, N]),
              a = await el({ ...M, components: t, tag: W, browserCache: o, linkedId: Il(l) });
            return await (async function (m, W) {
              const l = [it(), []],
                r = CO(l),
                P = CO(m),
                [N, t] = At(P) ? await b(P) : [false, P],
                o = bO(t, N);
              bt(W, () => ({ e: 24, agentMetadata: l, body: m, isCompressed: N }));
              return `${JD(r)}:${JD(o)}`;
            })(a, P);
          },
          F = s
            ? (function (m, W, l) {
                let r = m;
                if (
                  !(function (m) {
                    switch (m) {
                      case "sessionStorage":
                        try {
                          window.sessionStorage.getItem("item");
                        } catch (r) {
                          return false;
                        }
                        return true;
                      case "localStorage":
                        try {
                          window.localStorage.getItem("item");
                        } catch (g) {
                          return false;
                        }
                        return true;
                      case "agent":
                        return true;
                      default:
                        return false;
                    }
                  })(m)
                ) {
                  r = "agent";
                }
                const P = (function (m, W) {
                  switch (m) {
                    case "localStorage":
                      return LO("localStorage", W);
                    case "sessionStorage":
                      return LO("sessionStorage", W);
                    case "agent":
                      return (function () {
                        const m = {},
                          W = (W, l) => {
                            m[W] = l;
                          },
                          l = (W) => {
                            const l = m[W];
                            if (l) {
                              return l;
                            }
                          },
                          r = (W) => {
                            !(function (m, W) {
                              const r = Object.getOwnPropertyDescriptor?.call(Object, m, W);
                              if (r?.configurable) {
                                delete m[W];
                              } else {
                                if (!(r && !r.writable)) {
                                  m[W] = undefined;
                                }
                              }
                            })(m, W);
                          };
                        return { set: W, get: l, remove: r };
                      })();
                    default:
                      return null;
                  }
                })(r, l);
                if (!P) {
                  return null;
                }
                const N = typeof W == "number" ? W : Ho[W];
                function t(m) {
                  return { body: m, expiresAt: Math.floor(Date.now() / 1e3) + N };
                }
                const o = (m) => {
                    const W = P.get(m.toKey());
                    if (!W) {
                      return;
                    }
                    const l = Math.floor(Date.now() / 1e3);
                    if (!(W.expiresAt < l)) {
                      return W.body;
                    }
                    P.remove(m.toKey());
                  },
                  a = (m, W) => {
                    const l = t(W);
                    try {
                      P.set(m.toKey(), l);
                    } catch (A) {}
                  },
                  O = (m) => {
                    P.remove(m.toKey());
                  };
                return { get: o, set: a, remove: O };
              })(s.storage, s.duration, s.cachePrefix)
            : undefined,
          n = (m = {}) => {
            const W = u("get");
            return LN(
              W,
              () => ({ e: 3, options: m }),
              (m) => ({ e: 4, result: m }),
              (m) => ({ e: 5, error: m }),
              () => hf((l) => Y(m, W, l)),
            );
          },
          Y = async (m, W, l) => {
            const P = F?.get(jO(m));
            if (P) {
              l({ ...P, cache_hit: true });
              return void nm(r());
            }
            const N = so();
            try {
              const r = wr(N),
                P = S(m.timeout),
                t = Z(m, r, W),
                o = await A(m, r, P, W);
              if (o) {
                l(o);
                await t(o.event_id, P);
              } else {
                const W = await t(undefined, P);
                if (!(F == null)) {
                  F.set(jO(m), { ...W });
                }
                if (F) {
                  W.cache_hit = false;
                }
                l(W);
              }
            } finally {
              N.resolve();
            }
          },
          A = async ({ tag: m, linkedId: W }, l, r, P) => {
            if (!D) {
              return;
            }
            const N = await k();
            let o = false;
            r.catch(() => (o = true));
            try {
              return await bP(
                t,
                { ...M, tag: m, linkedId: Il(W), browserCache: N, fast: true },
                l,
                r,
                P,
              );
            } catch (f) {
              if (o) {
                throw f;
              }
              return void ((f instanceof V && f.code === "visitor_not_found") || console.warn(f));
            }
          },
          Z = ({ timeout: m = 1e4, tag: W, linkedId: l }, r, P) => {
            const N = nm(Promise.all([C(P), x(m, P)]));
            return async (m, o) => {
              const [a, O] = await Promise.race([o, N]);
              return await bP(
                t,
                { ...M, components: a, tag: W, browserCache: O, linkedId: Il(l), eventId: m },
                r,
                o,
                P,
              );
            };
          },
          k = () => (P == null ? undefined : P(0, 50, undefined)),
          x = (m, W) => (P == null ? undefined : P(0.1 * m, 0.4 * m, W)),
          C = async (m) => {
            try {
              const W = await l();
              bt(m, () => ({ e: 13, result: W }));
              return W;
            } catch (N) {
              throw (bt(m, () => ({ e: 14, error: N })), N);
            }
          };
        return { get: n, collect: L };
      })(S, I, Q, G, r, q.ingress, t, H, M, u, T, z, x, P);
    bt(P, () => ({ e: 1, ab: T }));
    return v;
  } catch (i) {
    throw (bt(P, () => ({ e: 2, error: i })), i);
  }
}
function Km() {
  if (window.close === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: window.close.toString() };
}
function Um(m) {
  if (m instanceof TypeError && Gl(NW(m, "message"))) {
    return { s: -7, v: null };
  }
  throw m;
}
async function Jm() {
  return await kf(Qr(500, { s: -2, v: null }), async () => {
    if (AO()) {
      if (Ut()) {
        return { s: 0, v: await kD() };
      }
      return { s: -1, v: null };
    }
    return { s: -3, v: null };
  });
}
function hm() {
  return (
    "mediaDevices" in navigator &&
    navigator.mediaDevices !== undefined &&
    typeof navigator.mediaDevices.enumerateDevices === "function"
  );
}
function $m({ origin: m, path: W, query: l, fragment: r }) {
  return m + W + (l === null ? "" : `?${l}`) + (r === null ? "" : `#${r}`);
}
function jm() {
  const W = ["webkitPersistentStorage", "connectionSpeed", "xr", "hid"],
    l = [];
  for (const r of Object.getOwnPropertyNames(Object.getPrototypeOf(navigator))) {
    if (!W.includes(r)) {
      try {
        const W = navigator[r];
        if (typeof W == "function" && W.name !== undefined) {
          l.push(W.name);
        }
      } catch (D) {
        return { s: -1, v: [D instanceof Error ? D.message : String(D)] };
      }
    }
  }
  return { s: 0, v: l };
}
function pm(m, W = Ad, l = null, r = kd) {
  const P = { type: ((N = nd), (t = 1), N(t)), video: { contentType: m, ...W } };
  var N, t;
  if (l) {
    return { ...P, audio: { contentType: l, ...r } };
  }
  return P;
}
async function gm(m, W) {
  const N = m.createSession();
  await N.generateRequest("webm", W);
  return Number(N.sessionId);
}
let mW, WW;
function lW(m, W) {
  return Object.assign(m, { cancel: W });
}
function rW(m) {
  const [W, l] = (function (m) {
      const r = `Unexpected syntax '${m}'`,
        P = /^\s*([a-z-]*)(.*)$/i.exec(m),
        N = P[1] || undefined,
        t = {},
        o = /([.:#][\w-]+|\[.+?\])/gi,
        a = (m, W) => {
          t[m] = t[m] || [];
          t[m].push(W);
        };
      for (;;) {
        const m = o.exec(P[2]);
        if (!m) {
          break;
        }
        const N = m[0];
        switch (N[0]) {
          case ".":
            a("class", N.slice(1));
            break;
          case "#":
            a("id", N.slice(1));
            break;
          case "[": {
            const m = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(N);
            if (!m) {
              throw new Error(r);
            }
            a(m[1], m[4] ?? m[5] ?? "");
            break;
          }
          default:
            throw new Error(r);
        }
      }
      return [N, t];
    })(m),
    r = document.createElement(W != null ? W : "div");
  for (const m of Object.keys(l)) {
    const W = l[m].join(" ");
    if (m === "style") {
      nO(r.style, W);
    } else {
      r.setAttribute(m, W);
    }
  }
  return r;
}
function PW() {
  return typeof navigator.requestMediaKeySystemAccess === "function";
}
function NW(m, W) {
  const l = m[Pf(m, W)];
  return typeof l == "function" ? l.bind(m) : l;
}
function tW(m, W) {
  try {
    document.cookie;
  } catch (e) {
    if (qr(e)) {
      return W;
    }
    throw e;
  }
  return m();
}
function aW(m, W, l) {
  const t = { credential: "admin" };
  t.urls = yd(W, l);
  t.username = m;
  const o = {};
  o.iceServers = [t];
  return o;
}
function OW() {
  return (
    SW([
      "maxTouchPoints" in navigator,
      "mediaCapabilities" in navigator,
      "PointerEvent" in window,
      "visualViewport" in window,
      "onafterprint" in window,
    ]) >= 4
  );
}
function fW() {
  var X;
  if (!rm()) {
    return Ot(false);
  }
  try {
    const H = Navigator.prototype,
      V = ((X = document.featurePolicy) == null ? undefined : X.features)?.call(X) || [];
    return Ot(
      SW([
        "brave" in H,
        "braveSolana" in window,
        "braveEthereum" in window,
        ["cardano", "solana", "ethereum"].some((m) => V.includes(m)),
        !("connection" in H),
      ]) >= 2,
    );
  } catch (G) {
    return Ot(false);
  }
}
function dW(m) {
  return typeof m == "object" && m !== null && !Array.isArray(m);
}
function DW() {
  return [
    pD(Ba(screen.availTop), null),
    pD(Ba(screen.width) - Ba(screen.availWidth) - pD(Ba(screen.availLeft), 0), null),
    pD(Ba(screen.height) - Ba(screen.availHeight) - pD(Ba(screen.availTop), 0), null),
    pD(Ba(screen.availLeft), null),
  ];
}
function sW(m, W) {
  return new Promise((l) => {
    const r = aN(m, "message", ({ data: m }) => {
      if (m instanceof Array && W.includes(m[0])) {
        r();
        l(m);
      }
    });
  });
}
function HW(m) {
  const l = m[13]?.event.result;
  if (!l) {
    return {};
  }
  const r = {};
  for (const m in l) {
    r[m] = Math.round(l[m].duration);
  }
  return r;
}
async function XW(m) {
  if (rm() || Cm()) {
    return await Lo(m);
  }
  return { s: -1, v: null };
}
function wW(m, W, l, r) {
  return function () {
    const P = W << 9;
    let N = 5 * m;
    N = 9 * ((N << 7) | (N >>> 25));
    r ^= W;
    W ^= l ^= m;
    m ^= r;
    l ^= P;
    r = (r << 11) | (r >>> 21);
    return (N >>> 0) / 4294967296;
  };
}
function MW(m) {
  return (
    m !== null &&
    typeof m == "object" &&
    "name" in m &&
    m.name === "FingerprintError" &&
    "code" in m
  );
}
function SW(m) {
  return m.reduce((m, W) => m + (W ? 1 : 0), 0);
}
function LW(m, W) {
  const l = ga(m);
  if (W.size === 0) {
    return;
  }
  const r = Qd(l).filter((m) => !W.has(m[0]));
  if (r.length !== 0) {
    Id(l, JSON.stringify(r));
  } else {
    (function (m) {
      var W;
      try {
        if (!((W = localStorage?.removeItem) == null)) {
          W.call(localStorage, m);
        }
      } catch (X) {}
    })(l);
  }
}
function eW(m, W) {
  const N = m.length + W.length,
    t = new Uint8Array(N);
  for (let W = 0; W < m.length; W++) {
    t[W] = m[W];
  }
  for (let r = 0; r < W.length; r++) {
    t[r + m.length] = W[r];
  }
  return t;
}
function zW() {
  var t;
  return (
    !rm() ||
    !("featurePolicy" in document) ||
    !!((t = document.featurePolicy) == null
      ? undefined
      : t.allowedFeatures().includes("encrypted-media"))
  );
}
function FW() {
  return new V(w.wrong_worker_option, "wrong_worker_option");
}
const bW = Math,
  nW = () => 0;
function AW() {
  return { s: 0, v: Boolean(navigator.onLine) };
}
function ZW() {
  const P = function (m, W, l, r, P) {
      return m(W, l, r, P);
    },
    M = document.createElement("canvas"),
    u = M.getContext("2d");
  if (!u) {
    return { s: -1, v: null };
  }
  M.width = 4;
  M.height = 4;
  const S = Wm(),
    L = P(wW, S[0], S[1], S[2], S[3]);
  for (let m = 0; m < 4; m++) {
    for (let W = 0; W < 4; W++) {
      const P = Math.floor(L() * 256),
        N = Math.floor(L() * 256),
        w = Math.floor(L() * 256);
      u.fillStyle = "rgba(" + P + "," + N + "," + w + ",255)";
      u.fillRect(W, m, 1, 1);
    }
  }
  const e = u.getImageData(0, 0, NW(M, "width"), NW(M, "height"));
  return { s: 0, v: { s: S, p: Array.from(NW(e, "data")), d: 4 } };
}
const kW = new Set([
    10752, 2849, 2884, 2885, 2886, 2928, 2929, 2930, 2931, 2932, 2960, 2961, 2962, 2963, 2964, 2965,
    2966, 2967, 2968, 2978, 3024, 3042, 3088, 3089, 3106, 3107, 32773, 32777, 32777, 32823, 32824,
    32936, 32937, 32938, 32939, 32968, 32969, 32970, 32971, 3317, 33170, 3333, 3379, 3386, 33901,
    33902, 34016, 34024, 34076, 3408, 3410, 3411, 3412, 3413, 3414, 3415, 34467, 34816, 34817,
    34818, 34819, 34877, 34921, 34930, 35660, 35661, 35724, 35738, 35739, 36003, 36004, 36005,
    36347, 36348, 36349, 37440, 37441, 37443, 7936, 7937, 7938,
  ]),
  xW = new Set([34047, 35723, 36063, 34852, 34853, 34854, 34229, 36392, 36795, 38449]),
  CW = ["FRAGMENT_SHADER", "VERTEX_SHADER"],
  TW = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];
function GW(m) {
  return typeof m != "function";
}
function cW(m) {
  return matchMedia(`(prefers-reduced-transparency: ${m})`).matches;
}
function BW(m, W) {
  const l = m.join(""),
    r = l.split(""),
    P = Array(l.length);
  for (let m = 0; m < P.length; ++m) {
    P[m] = r.splice(W[m % W.length], 1);
  }
  return P.join("");
}
function IW() {
  const l = navigator.doNotTrack;
  if (l == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: l };
}
const QW = async function ({ debug: m } = {}) {
    if (!Cm() && !Zm()) {
      return;
    }
    const W = {
        abpIndo: [
          "#Iklan-Melayang",
          "#Kolom-Iklan-728",
          "#SidebarIklan-wrapper",
          '[title="ALIENBOLA" i]',
          "#Box-Banner-ads",
        ],
        abpvn: [".quangcao", "#mobileCatfish", ".close-ads", '[id^="bn_bottom_fixed_"]', "#pmadv"],
        adBlockFinland: [
          ".mainostila",
          ".sponsorit",
          ".ylamainos",
          'a[href*="/clickthrgh.asp?"]',
          'a[href^="https://app.readpeak.com/ads"]',
        ],
        adBlockPersian: [
          "#navbar_notice_50",
          ".kadr",
          'TABLE[width="140px"]',
          "#divAgahi",
          'a[href^="http://g1.v.fwmrm.net/ad/"]',
        ],
        adBlockWarningRemoval: [
          "#adblock-honeypot",
          ".adblocker-root",
          ".wp_adblock_detect",
          ".header-blocked-ad",
          "#ad_blocker",
        ],
        adGuardAnnoyances: [
          ".hs-sosyal",
          "#cookieconsentdiv",
          'div[class^="app_gdpr"]',
          ".as-oil",
          '[data-cypress="soft-push-notification-modal"]',
        ],
        adGuardBase: [
          ".BetterJsPopOverlay",
          "#ad_300X250",
          "#bannerfloat22",
          "#campaign-banner",
          "#Ad-Content",
        ],
        adGuardChinese: [
          ".Zi_ad_a_H",
          'a[href*=".hthbet34.com"]',
          "#widget-quan",
          'a[href*="/84992020.xyz"]',
          'a[href*=".1956hl.com/"]',
        ],
        adGuardFrench: [
          "#pavePub",
          ".ad-desktop-rectangle",
          ".mobile_adhesion",
          ".widgetadv",
          ".ads_ban",
        ],
        adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
        adGuardJapanese: [
          "#kauli_yad_1",
          'a[href^="http://ad2.trafficgate.net/"]',
          "._popIn_infinite_ad",
          ".adgoogle",
          ".__isboostReturnAd",
        ],
        adGuardMobile: [
          "amp-auto-ads",
          ".amp_ad",
          'amp-embed[type="24smi"]',
          "#mgid_iframe1",
          "#ad_inview_area",
        ],
        adGuardRussian: [
          'a[href^="https://ad.letmeads.com/"]',
          ".reclama",
          'div[id^="smi2adblock"]',
          'div[id^="AdFox_banner_"]',
          "#psyduckpockeball",
        ],
        adGuardSocial: [
          'a[href^="//www.stumbleupon.com/submit?url="]',
          'a[href^="//telegram.me/share/url?"]',
          ".etsy-tweet",
          "#inlineShare",
          ".popup-social",
        ],
        adGuardSpanishPortuguese: [
          "#barraPublicidade",
          "#Publicidade",
          "#publiEspecial",
          "#queTooltip",
          ".cnt-publi",
        ],
        adGuardTrackingProtection: [
          "#qoo-counter",
          'a[href^="http://click.hotlog.ru/"]',
          'a[href^="http://hitcounter.ru/top/stat.php"]',
          'a[href^="http://top.mail.ru/jump"]',
          "#top100counter",
        ],
        adGuardTurkish: [
          "#backkapat",
          "#reklami",
          'a[href^="http://adserv.ontek.com.tr/"]',
          'a[href^="http://izlenzi.com/campaign/"]',
          'a[href^="http://www.installads.net/"]',
        ],
        bulgarian: [
          "td#freenet_table_ads",
          "#ea_intext_div",
          ".lapni-pop-over",
          "#xenium_hot_offers",
        ],
        easyList: [
          ".yb-floorad",
          ".widget_po_ads_widget",
          ".trafficjunky-ad",
          ".textad_headline",
          ".sponsored-text-links",
        ],
        easyListChina: [
          '.appguide-wrap[onclick*="bcebos.com"]',
          ".frontpageAdvM",
          "#taotaole",
          "#aafoot.top_box",
          ".cfa_popup",
        ],
        easyListCookie: [
          ".ezmob-footer",
          ".cc-CookieWarning",
          "[data-cookie-number]",
          ".aw-cookie-banner",
          ".sygnal24-gdpr-modal-wrap",
        ],
        easyListCzechSlovak: [
          "#onlajny-stickers",
          "#reklamni-box",
          ".reklama-megaboard",
          ".sklik",
          '[id^="sklikReklama"]',
        ],
        easyListDutch: [
          "#advertentie",
          "#vipAdmarktBannerBlock",
          ".adstekst",
          'a[href^="https://xltube.nl/click/"]',
          "#semilo-lrectangle",
        ],
        easyListGermany: [
          "#SSpotIMPopSlider",
          ".sponsorlinkgruen",
          "#werbungsky",
          "#reklame-rechts-mitte",
          'a[href^="https://bd742.com/"]',
        ],
        easyListItaly: [
          ".box_adv_annunci",
          ".sb-box-pubbliredazionale",
          'a[href^="http://affiliazioniads.snai.it/"]',
          'a[href^="https://adserver.html.it/"]',
          'a[href^="https://affiliazioniads.snai.it/"]',
        ],
        easyListLithuania: [
          ".reklamos_tarpas",
          ".reklamos_nuorodos",
          'img[alt="Reklaminis skydelis"]',
          'img[alt="Dedikuoti.lt serveriai"]',
          'img[alt="Hostingas Serveriai.lt"]',
        ],
        estonian: ['A[href*="http://pay4results24.eu"]'],
        fanboyAnnoyances: [
          "#ac-lre-player",
          ".navigate-to-top",
          "#subscribe_popup",
          ".newsletter_holder",
          "#back-top",
        ],
        fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
        fanboyEnhancedTrackers: [
          ".open.pushModal",
          "#issuem-leaky-paywall-articles-zero-remaining-nag",
          "#sovrn_container",
          'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
          ".BlockNag__Card",
        ],
        fanboySocial: [
          "#FollowUs",
          "#meteored_share",
          "#social_follow",
          ".article-sharer",
          ".community__social-desc",
        ],
        frellwitSwedish: [
          'a[href*="casinopro.se"][target="_blank"]',
          'a[href*="doktor-se.onelink.me"]',
          "article.category-samarbete",
          "div.holidAds",
          "ul.adsmodern",
        ],
        greekAdBlock: [
          'A[href*="adman.otenet.gr/click?"]',
          'A[href*="http://axiabanners.exodus.gr/"]',
          'A[href*="http://interactive.forthnet.gr/click?"]',
          "DIV.agores300",
          "TABLE.advright",
        ],
        hungarian: [
          "#cemp_doboz",
          ".optimonk-iframe-container",
          ".ad__main",
          '[class*="GoogleAds"]',
          "#hirdetesek_box",
        ],
        iDontCareAboutCookies: [
          '.alert-info[data-block-track*="CookieNotice"]',
          ".ModuleTemplateCookieIndicator",
          ".o--cookies--container",
          "#cookies-policy-sticky",
          "#stickyCookieBar",
        ],
        icelandicAbp: ['A[href^="/framework/resources/forms/ads.aspx"]'],
        latvian: [
          'a[href="http://www.salidzini.lv/"][style="display: block; width: 120px; height: 40px; overflow: hidden; position: relative;"]',
          'a[href="http://www.salidzini.lv/"][style="display: block; width: 88px; height: 31px; overflow: hidden; position: relative;"]',
        ],
        listKr: [
          'a[href*="//ad.planbplus.co.kr/"]',
          "#livereAdWrapper",
          'a[href*="//adv.imadrep.co.kr/"]',
          "ins.fastview-ad",
          ".revenue_unit_item.dable",
        ],
        listeAr: [
          ".geminiLB1Ad",
          ".right-and-left-sponsers",
          'a[href*=".aflam.info"]',
          'a[href*="booraq.org"]',
          'a[href*="dubizzle.com/ar/?utm_source="]',
        ],
        listeFr: [
          'a[href^="http://promo.vador.com/"]',
          "#adcontainer_recherche",
          'a[href*="weborama.fr/fcgi-bin/"]',
          ".site-pub-interstitiel",
          'div[id^="crt-"][data-criteo-id]',
        ],
        officialPolish: [
          "#ceneo-placeholder-ceneo-12",
          '[href^="https://aff.sendhub.pl/"]',
          'a[href^="http://advmanager.techfun.pl/redirect/"]',
          'a[href^="http://www.trizer.pl/?utm_source"]',
          "div#skapiec_ad",
        ],
        ro: [
          'a[href^="//afftrk.altex.ro/Counter/Click"]',
          'a[href^="https://blackfridaysales.ro/trk/shop/"]',
          'a[href^="https://event.2performant.com/events/click"]',
          'a[href^="https://l.profitshare.ro/"]',
          'a[href^="/url/"]',
        ],
        ruAd: [
          'a[href*="//febrare.ru/"]',
          'a[href*="//utimg.ru/"]',
          'a[href*="://chikidiki.ru"]',
          "#pgeldiz",
          ".yandex-rtb-block",
        ],
        thaiAds: [
          "a[href*=macau-uta-popup]",
          "#ads-google-middle_rectangle-group",
          ".ads300s",
          ".bumq",
          ".img-kosana",
        ],
        webAnnoyancesUltralist: [
          "#mod-social-share-2",
          "#social-tools",
          ".ctpl-fullbanner",
          ".zergnet-recommend",
          ".yt.btn-link.btn-md.btn",
        ],
      },
      l = Object.keys(W),
      r = [].concat(...l.map((m) => W[m])),
      P = await (async function (m) {
        var W;
        const r = document.createElement("div"),
          P = new Array(m.length),
          N = {};
        So(r);
        for (let W = 0; W < m.length; ++W) {
          const N = rW(m[W]);
          if (N.tagName === "DIALOG") {
            N.show();
          }
          const t = document.createElement("div");
          So(t);
          t.appendChild(N);
          r.appendChild(t);
          P[W] = N;
        }
        for (; !document.body;) {
          await ED(50);
        }
        document.body.appendChild(r);
        try {
          for (let W = 0; W < m.length; ++W) {
            if (!P[W].offsetParent) {
              N[m[W]] = true;
            }
          }
        } finally {
          if (!((W = r.parentNode) == null)) {
            W.removeChild(r);
          }
        }
        return N;
      })(r);
    if (m) {
      (function (m, W) {
        let l = "DOM blockers debug:\n```";
        for (const r of Object.keys(m)) {
          l += `\n${r}:`;
          for (const P of m[r]) {
            l += `\n  ${W[P] ? "🚫" : "➡️"} ${P}`;
          }
        }
        console.log(`${l}\n\`\`\``);
      })(W, P);
    }
    const N = l.filter((m) => {
      const l = W[m];
      return I(l.map((m) => P[m])) > 0.6 * l.length;
    });
    N.sort();
    return N;
  },
  vW = function () {
    return navigator.oscpu;
  },
  RW = function () {
    const W = [],
      l =
        navigator.language ||
        navigator.userLanguage ||
        navigator.browserLanguage ||
        navigator.systemLanguage;
    if (l !== undefined) {
      W.push([l]);
    }
    if (Array.isArray(navigator.languages)) {
      if (!(
        rm() &&
        (function () {
          return (
            I([
              !("MediaSettingsRange" in window),
              "RTCEncodedAudioFrame" in window,
              "" + window.Intl == "[object Intl]",
              "" + window.Reflect == "[object Reflect]",
            ]) >= 3
          );
        })()
      )) {
        W.push(navigator.languages);
      }
    } else if (typeof navigator.languages == "string") {
      const l = navigator.languages;
      if (l) {
        W.push(l.split(","));
      }
    }
    return W;
  },
  EW = function () {
    return window.screen.colorDepth;
  },
  KW = function () {
    return pD(Ba(navigator.deviceMemory), undefined);
  },
  UW = function () {
    return pD(yr(navigator.hardwareConcurrency), undefined);
  },
  JW = function () {
    const W = window.Intl?.DateTimeFormat;
    if (W) {
      const m = new W().resolvedOptions().timeZone;
      if (m) {
        return m;
      }
    }
    const l = -(function () {
      const m = new Date().getFullYear();
      return Math.max(
        Ba(new Date(m, 0, 1).getTimezoneOffset()),
        Ba(new Date(m, 6, 1).getTimezoneOffset()),
      );
    })();
    return `UTC${l >= 0 ? "+" : ""}${l}`;
  },
  hW = function () {
    try {
      return !!window.sessionStorage;
    } catch (E) {
      return true;
    }
  },
  $W = function () {
    try {
      return !!window.localStorage;
    } catch (F) {
      return true;
    }
  },
  jW = function () {
    return !!window.openDatabase;
  },
  pW = function () {
    return navigator.cpuClass;
  },
  gW = function () {
    const { platform: m } = navigator;
    if (m === "MacIntel" && Cm() && !am()) {
      return (function () {
        if (navigator.platform === "iPad") {
          return true;
        }
        const W = screen.width / screen.height;
        return (
          I([
            "MediaSource" in window,
            !!Element.prototype.webkitRequestFullscreen,
            W > 0.65 && W < 1.53,
          ]) >= 2
        );
      })()
        ? "iPad"
        : "iPhone";
    }
    return m;
  },
  _W = function () {
    const m = navigator.plugins;
    if (!m) {
      return;
    }
    const W = [];
    for (let l = 0; l < m.length; ++l) {
      const r = m[l];
      if (!r) {
        continue;
      }
      const P = [];
      for (let m = 0; m < r.length; ++m) {
        const W = r[m];
        P.push({ type: W.type, suffixes: W.suffixes });
      }
      W.push({ name: r.name, description: r.description, mimeTypes: P });
    }
    return W;
  },
  iW = function () {
    let W,
      l = 0;
    if (navigator.maxTouchPoints !== undefined) {
      l = yr(navigator.maxTouchPoints);
    } else {
      if (navigator.msMaxTouchPoints !== undefined) {
        l = navigator.msMaxTouchPoints;
      }
    }
    try {
      document.createEvent("TouchEvent");
      W = true;
    } catch (a) {
      W = false;
    }
    const r = "ontouchstart" in window;
    return { maxTouchPoints: l, touchEvent: W, touchStart: r };
  },
  ml = function () {
    return navigator.vendor || "";
  },
  Wl = function () {
    const m = [];
    for (const W of [
      "chrome",
      "safari",
      "__crWeb",
      "__gCrWeb",
      "yandex",
      "__yb",
      "__ybro",
      "__firefox__",
      "__edgeTrackingPreventionStatistics",
      "webkit",
      "oprt",
      "samsungAr",
      "ucweb",
      "UCShellJava",
      "puffinDevice",
    ]) {
      const l = window[W];
      if (l && typeof l == "object") {
        m.push(W);
      }
    }
    return m.sort();
  },
  ll = function () {
    try {
      document.cookie = "cookietest=1; SameSite=Strict;";
      const W = document.cookie.indexOf("cookietest=") !== -1;
      document.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return W;
    } catch ($) {
      return false;
    }
  },
  rl = function () {
    for (const m of ["rec2020", "p3", "srgb"]) {
      if (matchMedia(`(color-gamut: ${m})`).matches) {
        return m;
      }
    }
  },
  Pl = function () {
    return !!Tr("inverted") || (!Tr("none") && undefined);
  },
  Nl = function () {
    if (qf("active")) {
      return true;
    }
    if (qf("none")) {
      return false;
    }
    return;
  },
  tl = function () {
    if (matchMedia("(min-monochrome: 0)").matches) {
      for (let m = 0; m <= 100; ++m) {
        if (matchMedia(`(max-monochrome: ${m})`).matches) {
          return m;
        }
      }
      throw new Error("Too high value");
    }
  },
  ol = function () {
    if (e("no-preference")) {
      return 0;
    }
    if (e("high") || e("more")) {
      return 1;
    }
    if (e("low") || e("less")) {
      return -1;
    }
    if (e("forced")) {
      return 10;
    }
    return;
  },
  al = function () {
    return !!at("reduce") || (!at("no-preference") && undefined);
  },
  Ol = function () {
    if (cW("reduce")) {
      return true;
    }
    if (cW("no-preference")) {
      return false;
    }
    return;
  },
  fl = function () {
    if (cP("high")) {
      return true;
    }
    if (cP("standard")) {
      return false;
    }
    return;
  },
  dl = function () {
    const m = bW.acos || nW,
      W = bW.acosh || nW,
      l = bW.asin || nW,
      r = bW.asinh || nW,
      P = bW.atanh || nW,
      N = bW.atan || nW,
      t = bW.sin || nW,
      o = bW.sinh || nW,
      a = bW.cos || nW,
      O = bW.cosh || nW,
      f = bW.tan || nW,
      d = bW.tanh || nW,
      D = bW.exp || nW,
      s = bW.expm1 || nW,
      y = bW.log1p || nW;
    return {
      acos: m(0.12312423423423424),
      acosh: W(1e308),
      acoshPf: ((H = 1e154), bW.log(H + bW.sqrt(H * H - 1))),
      asin: l(0.12312423423423424),
      asinh: r(1),
      asinhPf: ((m) => bW.log(m + bW.sqrt(m * m + 1)))(1),
      atanh: P(0.5),
      atanhPf: ((m) => bW.log((1 + m) / (1 - m)) / 2)(0.5),
      atan: N(0.5),
      sin: t(-1e300),
      sinh: o(1),
      sinhPf: ((m) => bW.exp(m) - 1 / bW.exp(m) / 2)(1),
      cos: a(10.000000000123),
      cosh: O(1),
      coshPf: ((m) => (bW.exp(m) + 1 / bW.exp(m)) / 2)(1),
      tan: f(-1e300),
      tanh: d(1),
      tanhPf: ((m) => (bW.exp(2 * m) - 1) / (bW.exp(2 * m) + 1))(1),
      exp: D(1),
      expm1: s(1),
      expm1Pf: ((m) => bW.exp(m) - 1)(1),
      log1p: y(10),
      log1pPf: ((m) => bW.log(1 + m))(10),
      powPI: ((m) => bW.pow(bW.PI, m))(-100),
    };
    var H;
  },
  Dl = function () {
    return navigator.pdfViewerEnabled;
  },
  sl = function () {
    const m = new Float32Array(1),
      W = new Uint8Array(m.buffer);
    m[0] = Infinity;
    m[0] = m[0] - m[0];
    return W[3];
  },
  yl = function () {
    const W = document.createElement("a"),
      l = W.attributionSourceId ?? W.attributionsourceid;
    return l === undefined ? undefined : String(l);
  },
  Hl = function () {
    if (!Zm() && !Cm()) {
      return -2;
    }
    if (!window.AudioContext) {
      return -1;
    }
    const m = new AudioContext().baseLatency;
    if (m == null) {
      return -1;
    }
    if (!isFinite(m)) {
      return -3;
    }
    return m;
  },
  Xl = function () {
    if (!window.Intl) {
      return -1;
    }
    const m = window.Intl.DateTimeFormat;
    if (!m) {
      return -2;
    }
    const W = m().resolvedOptions().locale;
    if (!W && W !== "") {
      return -3;
    }
    return W;
  },
  wl = function ({ cache: m }) {
    const o = rD(m);
    if (!o) {
      return -1;
    }
    if (!Zr(o)) {
      return -2;
    }
    const a = qa() ? null : o.getExtension("WEBGL_debug_renderer_info");
    return {
      version: o.getParameter(o.VERSION)?.toString() || "",
      vendor: o.getParameter(o.VENDOR)?.toString() || "",
      vendorUnmasked: a ? o.getParameter(a.UNMASKED_VENDOR_WEBGL)?.toString() : "",
      renderer: o.getParameter(o.RENDERER)?.toString() || "",
      rendererUnmasked: a ? o.getParameter(a.UNMASKED_RENDERER_WEBGL)?.toString() : "",
      shadingLanguageVersion: o.getParameter(o.SHADING_LANGUAGE_VERSION)?.toString() || "",
    };
  },
  Vl = function ({ cache: m }) {
    const W = rD(m);
    if (!W) {
      return -1;
    }
    if (!Zr(W)) {
      return -2;
    }
    const l = W.getSupportedExtensions(),
      r = W.getContextAttributes(),
      P = [],
      N = [],
      t = [],
      o = [],
      a = [];
    if (r) {
      for (const m of Object.keys(r)) {
        N.push(`${m}=${r[m]}`);
      }
    }
    const O = nt(W);
    for (const m of O) {
      const l = W[m];
      t.push(`${m}=${l}${kW.has(l) ? `=${W.getParameter(l)}` : ""}`);
    }
    if (l) {
      for (const m of l) {
        if ((m === "WEBGL_debug_renderer_info" && qa()) || (m === "WEBGL_polygon_mode" && vf())) {
          continue;
        }
        const l = W.getExtension(m);
        if (l) {
          for (const m of nt(l)) {
            const r = l[m];
            o.push(`${m}=${r}${xW.has(r) ? `=${W.getParameter(r)}` : ""}`);
          }
        } else {
          P.push(m);
        }
      }
    }
    for (const m of CW) {
      for (const l of TW) {
        const r = Md(W, m, l);
        a.push(`${m}.${l}=${r.join(",")}`);
      }
    }
    o.sort();
    t.sort();
    return {
      contextAttributes: N,
      parameters: t,
      shaderPrecisions: a,
      extensions: l,
      extensionParameters: o,
      unsupportedExtensions: P,
    };
  };
const ul = function (m, W) {
    const l = (function (m) {
      const W = new Uint8Array(m.length);
      for (let l = 0; l < m.length; l++) {
        const r = m.charCodeAt(l);
        if (r > 127) {
          return new TextEncoder().encode(m);
        }
        W[l] = r;
      }
      return W;
    })(m);
    W = W || 0;
    const r = [0, l.length],
      P = r[1] % 16,
      N = r[1] - P,
      t = [0, W],
      o = [0, W],
      a = [0, 0],
      O = [0, 0];
    let f;
    for (f = 0; f < N; f += 16) {
      a[0] = l[f + 4] | (l[f + 5] << 8) | (l[f + 6] << 16) | (l[f + 7] << 24);
      a[1] = l[f] | (l[f + 1] << 8) | (l[f + 2] << 16) | (l[f + 3] << 24);
      O[0] = l[f + 12] | (l[f + 13] << 8) | (l[f + 14] << 16) | (l[f + 15] << 24);
      O[1] = l[f + 8] | (l[f + 9] << 8) | (l[f + 10] << 16) | (l[f + 11] << 24);
      cD(a, Om);
      Zt(a, 31);
      cD(a, fm);
      cr(t, a);
      Zt(t, 27);
      IN(t, o);
      cD(t, dm);
      IN(t, Dm);
      cD(O, fm);
      Zt(O, 33);
      cD(O, Om);
      cr(o, O);
      Zt(o, 31);
      IN(o, t);
      cD(o, dm);
      IN(o, sm);
    }
    a[0] = 0;
    a[1] = 0;
    O[0] = 0;
    O[1] = 0;
    const d = [0, 0];
    switch (P) {
      case 15:
        ((d[1] = l[f + 14]), fr(d, 48), cr(O, d));
      case 14:
        ((d[1] = l[f + 13]), fr(d, 40), cr(O, d));
      case 13:
        ((d[1] = l[f + 12]), fr(d, 32), cr(O, d));
      case 12:
        ((d[1] = l[f + 11]), fr(d, 24), cr(O, d));
      case 11:
        ((d[1] = l[f + 10]), fr(d, 16), cr(O, d));
      case 10:
        ((d[1] = l[f + 9]), fr(d, 8), cr(O, d));
      case 9:
        ((d[1] = l[f + 8]), cr(O, d), cD(O, fm), Zt(O, 33), cD(O, Om), cr(o, O));
      case 8:
        ((d[1] = l[f + 7]), fr(d, 56), cr(a, d));
      case 7:
        ((d[1] = l[f + 6]), fr(d, 48), cr(a, d));
      case 6:
        ((d[1] = l[f + 5]), fr(d, 40), cr(a, d));
      case 5:
        ((d[1] = l[f + 4]), fr(d, 32), cr(a, d));
      case 4:
        ((d[1] = l[f + 3]), fr(d, 24), cr(a, d));
      case 3:
        ((d[1] = l[f + 2]), fr(d, 16), cr(a, d));
      case 2:
        ((d[1] = l[f + 1]), fr(d, 8), cr(a, d));
      case 1:
        ((d[1] = l[f]), cr(a, d), cD(a, Om), Zt(a, 31), cD(a, fm), cr(t, a));
    }
    cr(t, r);
    cr(o, r);
    IN(t, o);
    IN(o, t);
    dt(t);
    dt(o);
    IN(t, o);
    IN(o, t);
    return (
      ("00000000" + (t[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (t[1] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (o[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (o[1] >>> 0).toString(16)).slice(-8)
    );
  },
  Sl = new Uint32Array(2);
function Ll({ level: m, message: W }) {
  if (m === "error") {
    console.error(W);
  } else {
    if (m === "warning") {
      console.warn(W);
    } else {
      console.log(W);
    }
  }
}
async function el({
  modules: m,
  components: W = {},
  apiKey: l,
  browserCache: r,
  tag: P,
  linkedId: N,
  imi: t,
  storageKeyPrefix: o,
  urlHashing: a,
  ii: O,
  ab: f,
  fast: d,
  eventId: D,
}) {
  const s = {
    c: l,
    t: _a(P),
    lid: N,
    m: t.m,
    l: t.l,
    mo: m.map((m) => m.key).filter((m) => Boolean(m)),
    s56: r,
    sc: u(),
    uh: Gm(a),
    ii: O,
    gt: 1,
    ab: f,
    hu: d ? 0 : D ? 1 : undefined,
    ri: D,
    ...Nm(W),
  };
  await Promise.all(
    m.map(async ({ toRequest: m }) => {
      if (m) {
        Object.assign(s, await m(o, a));
      }
    }),
  );
  return s;
}
function zl() {
  const m = (function (m) {
    const W = {},
      l = [],
      r = [];
    let P = false;
    const N = aN(document, "visibilitychange", t);
    function t() {
      r.push({ t: Math.round(performance.now()), s: z() ? "v" : "h" });
    }
    function o(m) {
      if (P) {
        return;
      }
      switch ((a({ timestamp: Math.round(performance.now()), event: m }), m.e)) {
        case 9:
        case 18:
          l.push(m.url);
          break;
        case 4:
        case 5:
          O(m.agentId, m.getCallId, "get");
          break;
        case 22:
        case 23:
          O(m.agentId, m.collectCallId, "collect");
      }
    }
    function a(m) {
      const l = m.event;
      if (!VN(l)) {
        return;
      }
      const { agentId: r } = l;
      if ((W[r] || (W[r] = { commonEvents: [], getCalls: {}, collectCalls: {} }), Rr(l))) {
        const { getCallId: P } = l;
        let N = W[r].getCalls[P];
        if (!N) {
          N = [];
        }
        N.push(m);
        return void (W[r].getCalls[P] = N);
      }
      if (QO(l)) {
        const { collectCallId: P } = l;
        let N = W[r].collectCalls[P];
        if (!N) {
          N = [];
        }
        N.push(m);
        return void (W[r].collectCalls[P] = N);
      }
      W[r].commonEvents.push(m);
    }
    function O(P, N, t) {
      const n = (function (m, W, l, r) {
          const P = [];
          if (m[W]) {
            P.push(...m[W].commonEvents);
            if (r === "get" && l) {
              P.push(...(m[W].getCalls[l] || []));
            }
            if (r === "collect" && l) {
              P.push(...(m[W].collectCalls[l] || []));
            }
          }
          return P;
        })(W, P, N, t),
        Y = {};
      for (const m of n) {
        Y[m.event.e] = m;
      }
      const A = Y[4] ?? Y[5],
        Z = Y[22] ?? Y[23],
        k = Y[3] && A,
        x = Y[21] && Z,
        C = k || x;
      if (!(Y[0] && Y[1] && Y[12] && C)) {
        return;
      }
      const {
        apiKey: T,
        storageKeyPrefix: q = "_vid_",
        modules: G,
        ldi: c,
        aggressiveOptimization: B = false,
        optimizeRepeatedVisits: I = false,
      } = Y[0].event.options;
      if (!T) {
        return;
      }
      const Q = Math.min(Y[0].timestamp, LP(c?.attempts[0].startedAt ?? new Date("8524-04-28"))),
        v = Y[5]?.event.error,
        R = Y[4]?.event.result,
        E = Y[23]?.event.error,
        K = Y[13] ?? Y[14],
        U = yf(l),
        J = {
          am: x ? "collect" : "get",
          v: "1",
          dt: new Date().toISOString(),
          ci: it(),
          pi: zr(),
          ai: P,
          ri: wd(12),
          c: T,
          rid: R?.event_id ?? v?.event_id ?? null,
          er: v ? um(v) : null,
          cr: E?.message ?? null,
          mo: G.map((m) => m.key).filter((m) => Boolean(m)),
          sa: ar(c?.attempts ?? []),
          ls: Y[0].timestamp,
          le: Y[1].timestamp,
          ca: Rf(n, U, 9, 10, 11),
          ss: Y[12].timestamp,
          se: K?.timestamp ?? null,
          sd: HW(Y),
          gs: Y[3]?.timestamp ?? null,
          ge: A?.timestamp ?? null,
          cs: Y[21]?.timestamp ?? null,
          ce: Z?.timestamp ?? null,
          fa: Rf(n, U, 18, 19, 20, 0),
          ia: Rf(n, U, 18, 19, 20, 1),
          vs: Oo(c?.visibilityStates ?? [], r, Q, A?.timestamp ?? Z?.timestamp),
          ab: Y[1].event.ab,
          ao: B,
          or: I,
        };
      m(J, q);
    }
    t();
    return {
      addEvent: o,
      destroy: () => {
        P = true;
        N();
      },
    };
  })((m, W) => {
    !(function (m, W) {
      const l = ga(W),
        r = Qd(l) || [];
      r.splice(0, r.length - 2);
      const P = LD(CO(m), DN, 3, 7);
      r.push([m.ri, CD(P)]);
      Id(l, JSON.stringify(r));
    })(m, W);
  });
  let W = new Set();
  return {
    toRequest(m) {
      const l = (function (m) {
        const W = ga(m),
          l = Qd(W) || [],
          r = [];
        l.forEach((m) => {
          try {
            const W = Yt(Z(vD(m[1]), DN, 7));
            r.push(W);
          } catch (c) {}
        });
        return r;
      })(m);
      W = new Set(l.map((m) => m.ri));
      return { lr: l };
    },
    onGetResponse(m, l) {
      LW(l, W);
    },
    onCollectResponse(m) {
      LW(m, W);
    },
    addEvent: m.addEvent,
    destroy: m.destroy,
  };
}
function Fl(m) {
  return BD((m, W) => {
    const l = W.screen,
      r = (m) => {
        const W = parseInt(m);
        return typeof W == "number" && isNaN(W) ? -1 : W;
      };
    return { s: 0, v: { w: r(l.width), h: r(l.height) } };
  }, m.sis);
}
const bl = new Uint8Array(1);
function nl(m, W, l = "...") {
  return m.length <= W ? m : `${m.slice(0, Math.max(0, W - l.length))}${l}`;
}
async function Al() {
  const N = Kr();
  return N
    ? Ut()
      ? await kf(Qr(350, { s: -2, v: null }), async () => ({
          s: 0,
          v: await Promise.all(N.map(vd)),
        }))
      : await kf(Qr(350, { s: -1, v: null }), async () => ({
          s: -1,
          v: await Promise.all([xO(N[0])]),
        }))
    : await kf(Qr(350, { s: -3, v: null }), async () => ({ s: -3, v: await Promise.all([xO()]) }));
}
async function Zl() {
  const f = O.storage,
    d = O.webkitTemporaryStorage;
  if (!d && !f?.estimate) {
    return { s: -1, v: null };
  }
  if (d) {
    const W = await Promise.race([
      RD(250, undefined),
      new Promise((W) => {
        d.queryUsageAndQuota((m, l) => W(l));
      }),
    ]);
    if (W !== undefined) {
      return { s: 0, v: W };
    }
  }
  try {
    if (f?.estimate) {
      const m = await Promise.race([RD(250, undefined), f.estimate().then((m) => NW(m, "quota"))]);
      if (m !== undefined) {
        return { s: 1, v: m };
      }
    }
    return { s: -2, v: null };
  } catch (_) {
    if (rO(_)) {
      return { s: -101, v: null };
    }
    throw _;
  }
}
function kl(m) {
  if (typeof TextDecoder == "function") {
    const W = new TextDecoder().decode(m);
    if (W) {
      return W;
    }
  }
  const W = XO(m);
  return decodeURIComponent(escape(String.fromCharCode.apply(null, W)));
}
function xl() {
  try {
    return rf(!!window.indexedDB);
  } catch (u) {
    return rf(true);
  }
}
function Cl() {
  return kf(aD(300, 4, { s: -2, v: null }), async () => {
    if (!hm() || !Ea()) {
      return { s: -1, v: null };
    }
    try {
      const m = await kO();
      if (m !== "granted") {
        return { s: m === "prompt" ? -3 : -4, v: null };
      }
    } catch (H) {
      return { s: -5, v: null };
    }
    return {
      s: 0,
      v: (await navigator.mediaDevices.enumerateDevices()).map((W) => ({
        d: W.deviceId,
        g: W.groupId,
        k: W.kind,
        l: W.label,
      })),
    };
  });
}
async function Tl({ cache: m }) {
  if (!dd() || !zW()) {
    return () => ({ s: -1, v: null });
  }
  if (Zm()) {
    return () => ({ s: -3, v: null });
  }
  const t = qd(m);
  return kf(cN(300, 10, 500, { s: -2, v: null }), async () => {
    const l = await Promise.all(
        KO.map(async (W) => {
          const [l, r] = W;
          return [l, await r(t)];
        }),
      ),
      r = {};
    for (const [m, W] of l) {
      r[m] = W;
    }
    return { s: 0, v: r };
  });
}
function ql() {
  const m = new Error(),
    W = (function (m) {
      if (m.fileName) {
        return m.fileName.split(" ")[0];
      }
      if (m.sourceURL) {
        return m.sourceURL;
      }
      return null;
    })(m);
  if (W) {
    return W;
  }
  if (m.stack) {
    const W = (function (m) {
      const [W, l] = m.split("\n"),
        r = QN.exec(l) || vN.exec(W);
      return r ? r[1] : undefined;
    })(m.stack);
    if (W) {
      return W;
    }
  }
  return null;
}
function Gl(m) {
  const r = m.match(Wd);
  return !!r && pl(r[1]) === 4169850297;
}
function cl() {
  if (!Cm() || OW()) {
    return { s: -1, v: null };
  }
  const N = NW(window, "openDatabase"),
    t = window.localStorage;
  try {
    N(null, null, null, null);
  } catch (o) {
    return { s: 0, v: true };
  }
  try {
    t.setItem("test", "1");
    t.removeItem("test");
    return { s: 0, v: false };
  } catch (M) {
    return { s: 0, v: true };
  }
}
function Bl(m) {
  const N = new Uint8Array(16);
  window.crypto.getRandomValues(N);
  N[(N[0] % 15) + 1] = m;
  return N.reduce(
    (m, W, l) =>
      m + (l === 4 || l === 6 || l === 8 || l === 10 ? "-" : "") + W.toString(16).padStart(2, "0"),
    "",
  );
}
function Il(m) {
  return m === undefined ? undefined : `${m}`;
}
function vl() {
  return (
    I([
      "buildID" in navigator,
      "MozAppearance" in (document.documentElement?.style ?? {}),
      "onmozfullscreenchange" in window,
      "mozInnerScreenX" in window,
      "CSSMozDocumentRule" in window,
      "CanvasCaptureMediaStream" in window,
    ]) >= 4
  );
}
function Rl() {
  const y = function (m, W) {
    return m | W;
  };
  const w = document.createElement("canvas").getContext("webgl2");
  if (!w) {
    return { s: -1, v: null };
  }
  const V = w.getSupportedExtensions() ?? [],
    M = Math.ceil(HD.length / 32),
    u = new Uint32Array(M);
  let S = false;
  const L = [],
    e = dO();
  for (const m of V) {
    const W = e.get(m);
    if (W === undefined) {
      S = true;
      if (L.length < 10) {
        L.push(m.slice(0, 60));
      }
      continue;
    }
    const l = (W / 32) | 0,
      r = W & 31;
    u[l] = y(u[l], 1 << r) >>> 0;
  }
  return { s: S ? 1 : 0, v: { b: Array.from(u), u: L } };
}
function El() {
  const m = Date.now();
  return { s: 0, v: [M(m), M(m - 6e4 * new Date().getTimezoneOffset())] };
}
async function Kl() {
  const f = window.indexedDB;
  if (!f) {
    return { s: -2, v: null };
  }
  const d = "" + wd(16) + "";
  return new Promise((o, a) => {
    try {
      const W = f.open(d, 1);
      W.onerror = () => {
        o({ s: -5, v: null });
      };
      W.onupgradeneeded = (m) => {
        const W = m.target.result;
        try {
          W.createObjectStore("-", { autoIncrement: true }).put(new window.Blob());
          return void o({ s: 0, v: "" });
        } catch (P) {
          if (P instanceof Error) {
            return void o({ s: 0, v: P.message });
          }
          a(P);
        } finally {
          W.close();
          f.deleteDatabase(d);
        }
      };
    } catch (q) {
      if (!Cm()) {
        return void o({ s: -5, v: null });
      }
      if (q instanceof Error && q.name === "SecurityError") {
        return void o({ s: -4, v: null });
      }
      a(q);
    }
  });
}
function Jl(m, W, l, r) {
  tW(() => {
    const P = `${m}=${W}`,
      N = `expires=${new Date(Date.now() + 24 * l * 60 * 60 * 1e3).toUTCString()}`,
      t = r ? `domain=${r}` : "";
    document.cookie = [P, "path=/", N, t, "SameSite=Lax"].join("; ");
  }, undefined);
}
async function hl() {
  const a = function (m, W) {
      return m + W;
    },
    F = await cO();
  if (F.s === -3) {
    let m = null;
    if (typeof F.v === "string") {
      m = NW(F, "v");
    }
    return { s: -1, v: m };
  }
  if (F.s === -4) {
    return { s: -2, v: null };
  }
  const b = F.v,
    n = [];
  let Y = "";
  try {
    if (b) {
      for (const m of Fd) {
        Y = "limits." + m + "";
        n.push(m in b.limits ? b.limits[m] : null);
      }
    }
    Y = "adapter.info";
    const m = await cd(b);
    Y = "adapterInfo.description";
    const W = m.description;
    Y = "adapterInfo.device";
    const l = m.device;
    Y = "adapterInfo.isFallbackAdapter";
    return {
      s: 0,
      v: { ds: W, dv: l, f: "isFallbackAdapter" in m ? m.isFallbackAdapter : null, l: n },
    };
  } catch (h) {
    if (dN(h)) {
      return { s: -3, v: a("Error accessing property " + Y + ": ", NW(h, "message")) + "" };
    }
    throw h;
  }
}
function $l() {
  return [
    pm("video/mp4; codecs=av01.0.08M.08"),
    pm("video/webm; codecs=vp8"),
    pm("video/webm; codecs=vp09.00.10.08"),
    pm("video/mp4; codecs=hvc1.1.6.L93.B0"),
    pm("video/mp4; codecs=avc1.640028"),
    pm("video/mp4; codecs=avc1.640033", Zd),
    pm("video/webm; codecs=vp09.00.10.08", Ad, "audio/ogg; codecs=opus"),
    pm("video/mp4; codecs=avc1.640028", Ad, "audio/mp4; codecs=mp4a.40.5"),
  ];
}
function pl(m) {
  return Pt(ud(m));
}
function gl() {
  return (
    I([
      "MSCSSMatrix" in window,
      "msSetImmediate" in window,
      "msIndexedDB" in window,
      "msMaxTouchPoints" in navigator,
      "msPointerEnabled" in navigator,
    ]) >= 4
  );
}
function _l(m) {
  try {
    return localStorage?.getItem?.call(localStorage, m) ?? undefined;
  } catch (t) {}
}
function il(m, W, l) {
  if (W) {
    const m = (function (m) {
      const W = m.getHeader("retry-after");
      if (!W) {
        return;
      }
      if (/^\s*\d+(\.\d+)?\s*$/.test(W)) {
        return 1e3 * parseFloat(W);
      }
      const l = new Date(W);
      if (!isNaN(l)) {
        return l.getTime() - Date.now();
      }
      return;
    })(W);
    if (m !== undefined) {
      return { action: "postpone", delay: m };
    }
    return { action: "exclude", delay: "backoff" };
  }
  if (l instanceof Error && (l.name === "CSPError" || l.name === "InvalidURLError")) {
    return { action: "exclude", delay: 0 };
  }
  return { action: "postpone", delay: Date.now() - m.getTime() < 50 ? 0 : "backoff" };
}
const mr = /Blocked a frame.*cross-origin frame/,
  Wr = /Permission denied.*cross-origin object/,
  lr = /Failed to execute.*in this context/,
  rr = /Context not access storage/,
  Pr = /(\w+)\(\)\s+called for opaque origin/;
function Nr(m) {
  let W,
    l,
    r = false;
  const [P, N] = (function () {
    const m = document.createElement("canvas");
    m.width = 1;
    m.height = 1;
    return [m, m.getContext("2d")];
  })();
  if (!!(!N || !P.toDataURL)) {
    W = l = "unsupported";
  } else {
    r = (N.rect(0, 0, 10, 10), N.rect(2, 2, 6, 6), !N.isPointInPath(5, 5, "evenodd"));
    if (m) {
      W = l = "skipped";
    } else {
      [W, l] = (function (m, W) {
        !(function (m, W) {
          m.width = 240;
          m.height = 60;
          W.textBaseline = "alphabetic";
          W.fillStyle = "#f60";
          W.fillRect(100, 1, 62, 20);
          W.fillStyle = "#069";
          W.font = '11pt "Times New Roman"';
          const l = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835)}`;
          W.fillText(l, 2, 15);
          W.fillStyle = "rgba(102, 204, 0, 0.2)";
          W.font = "18pt Arial";
          W.fillText(l, 4, 45);
        })(m, W);
        const l = Mo(m),
          r = Mo(m);
        if (l !== r) {
          return ["unstable", "unstable"];
        }
        !(function (m, W) {
          m.width = 122;
          m.height = 110;
          W.globalCompositeOperation = "multiply";
          for (const [m, l, r] of [
            ["#f2f", 40, 40],
            ["#2ff", 80, 40],
            ["#ff2", 60, 80],
          ]) {
            W.fillStyle = m;
            W.beginPath();
            W.arc(l, r, 40, 0, 2 * Math.PI, true);
            W.closePath();
            W.fill();
          }
          W.fillStyle = "#f9c";
          W.arc(60, 60, 60, 0, 2 * Math.PI, true);
          W.arc(60, 60, 20, 0, 2 * Math.PI, true);
          W.fill("evenodd");
        })(m, W);
        const P = Mo(m);
        return [P, l];
      })(P, N);
    }
  }
  return { winding: r, geometry: W, text: l };
}
const or = ["path", "query", "fragment"];
function ar(m) {
  const W = yf(m.map((m) => m.url).filter((m) => Boolean(m)));
  return m.map((l, r) => {
    const P = m.length > 1 && r < m.length - 1 && !("error" in l);
    return _D(l.url, LP(l.startedAt), LP(l.finishedAt), P ? "Unknown" : l.error, W[l.url]);
  });
}
function Or(m) {
  return m instanceof Error || (m !== null && typeof m == "object" && "name" in m);
}
function fr(m, W) {
  if ((W %= 64) !== 0) {
    if (W < 32) {
      m[0] = m[1] >>> (32 - W);
      m[1] = m[1] << W;
    } else {
      m[0] = m[1] << (W - 32);
      m[1] = 0;
    }
  }
}
function dr(m) {
  return (function (m, W, l, r) {
    let t;
    const o = (W) => {
      const l = new URL(m, location.href),
        { blockedURI: r } = W;
      if (!(r !== l.href && r !== l.protocol.slice(0, -1) && r !== l.origin)) {
        t = W;
        a();
      }
    };
    document.addEventListener("securitypolicyviolation", o);
    const a = () => document.removeEventListener("securitypolicyviolation", o);
    if (!(r == null)) {
      r.then(a, a);
    }
    return Promise.resolve()
      .then(W)
      .then(
        (m) => {
          a();
          return m;
        },
        (m) =>
          new Promise((m) => {
            const W = new MessageChannel();
            W.port1.onmessage = () => m();
            W.port2.postMessage(null);
          }).then(() => {
            if ((a(), t)) {
              return l(t);
            }
            throw m;
          }),
      );
  })(
    m.url,
    () =>
      (async function ({
        url: m,
        method: W = "GET",
        body: l,
        headers: r,
        withCredentials: P = false,
        timeout: N,
        responseFormat: t,
        abort: o,
      }) {
        if (
          (function (m) {
            if (!URL.prototype) {
              return;
            }
            try {
              new URL(m, location.href);
              return false;
            } catch (W) {
              if (FN(W)) {
                return true;
              }
              throw W;
            }
          })(m)
        ) {
          throw A("InvalidURLError", "Invalid URL");
        }
        const [a, O] = await (async function (m) {
          const W = new AbortController(),
            l = { current: false },
            r =
              m.timeout && m.timeout > 0
                ? OD(() => {
                    l.current = true;
                    W.abort();
                  }, m.timeout)
                : undefined;
          try {
            return [
              await Ka(
                fetch(m.url, {
                  method: m.method,
                  headers: m.headers,
                  body: m.body,
                  credentials: m.withCredentials ? "include" : "same-origin",
                  signal: W.signal,
                }),
                m.abort,
              ),
              null,
            ];
          } catch (n) {
            if (n instanceof DOMException && n.name === "AbortError") {
              return l.current
                ? [null, A("TimeoutError", "The request timed out")]
                : [null, A("AbortError", "The request is aborted")];
            }
            if (n instanceof TypeError) {
              return [
                null,
                A("TypeError", navigator.onLine ? "Connection error" : "Network offline"),
              ];
            }
            return [null, n];
          } finally {
            if (!(r == null)) {
              r();
            }
          }
        })({ url: m, method: W, headers: r, body: l, withCredentials: P, timeout: N, abort: o });
        if (O) {
          throw O;
        }
        const f = {
          status: a.status,
          statusText: a.statusText,
          getHeader(m) {
            return a.headers.get(m) ?? undefined;
          },
        };
        if (t === "binary") {
          const m = await a.arrayBuffer();
          return { ...f, body: m };
        }
        {
          const m = await a.text();
          return { ...f, body: m };
        }
      })(m),
    () => {
      throw A("CSPError", "The request is blocked by the CSP");
    },
    m.abort,
  );
}
function Dr(m, W, l, r, P = {}) {
  const { maxAttemptCount: N = 5, backoffBase: t = 200, backoffCap: o = 1e4, abort: a } = P,
    O = { failedAttempts: [] },
    [f, d] = qm(m, r, t, o),
    D = ((s = [
      a?.then(
        (m) => (O.aborted = { resolve: true, value: m }),
        (m) => (O.aborted = { resolve: false, error: m }),
      ),
      eN(f, N, W, l, d, O, a),
    ]),
    Promise.race(s.filter((m) => !!m))).then(() => O);
  var s;
  return { then: D.then.bind(D), current: O };
}
function sr(m, W) {
  let l = 0;
  return () => Math.random() * Math.min(W, m * Math.pow(2, l++));
}
function yr(m) {
  return parseInt(m);
}
function Hr() {
  return (function ({ location: m, origin: W }) {
    const l = m.origin,
      r = m.ancestorOrigins;
    let P = null;
    if (r) {
      P = new Array(r.length);
      for (let m = 0; m < r.length; ++m) {
        P[m] = r[m];
      }
    }
    return { s: 0, v: { w: W ?? null, l: l ?? null, a: P } };
  })(window);
}
function Xr() {
  return (function (m, W = 4e3) {
    return bo((l, r) => {
      const P = r.document,
        N = P.body,
        t = N.style;
      t.width = `${W}px`;
      t.webkitTextSizeAdjust = "none";
      t.setProperty("text-size-adjust", "none");
      if (rm()) {
        N.style.setProperty("zoom", "" + 1 / r.devicePixelRatio);
      } else {
        if (Cm()) {
          N.style.setProperty("zoom", "reset");
        }
      }
      const o = P.createElement("div");
      o.textContent = [...Array((W / 20) | 0)].map(() => "word").join(" ");
      N.appendChild(o);
      return m(P, N);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  })((m, W) => {
    const l = {},
      r = {};
    for (const r of Object.keys(Ja)) {
      const [P = {}, N = "mmMwWLliI0fiflO&1"] = Ja[r],
        t = m.createElement("span");
      t.textContent = N;
      t.style.whiteSpace = "nowrap";
      for (const m of Object.keys(P)) {
        const W = P[m];
        if (W !== undefined) {
          t.style[m] = W;
        }
      }
      l[r] = t;
      W.append(m.createElement("br"), t);
    }
    for (const m of Object.keys(Ja)) {
      r[m] = l[m].getBoundingClientRect().width;
    }
    return r;
  });
}
const wr = VD(dr);
function Vr(m, W) {
  Wo(m, m.len + 1);
  m.arr[m.len++] = W;
}
function Mr(m, W, l, r, P, N) {
  return LN(
    W,
    () => ({ e: 9, tryNumber: P, url: r, timeout: m }),
    ({ status: m, getHeader: W, body: l }) => ({
      e: 10,
      tryNumber: P,
      status: m,
      retryAfter: W("retry-after"),
      body: l,
    }),
    (m) => ({ e: 11, tryNumber: P, error: m }),
    () => ZD({ url: r, timeout: m, abort: N, container: l }),
  );
}
function ur() {
  if (v("dark")) {
    return { s: 0, v: true };
  }
  if (v("light")) {
    return { s: 0, v: false };
  }
  return { s: -1, v: null };
}
const Sr = /The document is sandboxed and lacks the 'allow-same-origin' flag/,
  Lr = /The operation is insecure/,
  er = /Forbidden in a sandboxed document without the 'allow-same-origin' flag/;
function zr() {
  const W = window.__fpjs_pvid;
  return (window.__fpjs_pvid = typeof W == "string" ? W : wd(10));
}
function Fr(m, W, l) {
  const P = function (m, W) {
    return m * W;
  };
  return W + Math.floor(P(m / 256, l - W + 1));
}
function Yr(m, W) {
  let l;
  return (r) => {
    if (!l) {
      l = (function (m, W) {
        return Yt(Z(new Uint32Array(m), [], W));
      })(m, W);
    }
    return kN(l[r]);
  };
}
function Ar(m, W) {
  const l = W(`${m.origin}${m.pathname}`),
    r = m.searchParams.get("region");
  return r ? RN(l, { region: r }) : l;
}
function Zr(m) {
  return typeof m.getParameter == "function";
}
function kr(m) {
  return vr(m) ? XN(m.value) : XN(m);
}
function xr() {
  const l = Audio.prototype,
    { visualViewport: r } = window;
  return (
    I([
      "srLatency" in l,
      "srChannelCount" in l,
      "devicePosture" in navigator,
      r && "segments" in r,
      "getTextInformation" in Image.prototype,
    ]) >= 3
  );
}
function Cr() {
  if (!crypto) {
    return Math.random();
  }
  crypto.getRandomValues(Sl);
  return (1048576 * Sl[0] + (1048575 & Sl[1])) / 4503599627370496;
}
function Tr(m) {
  return matchMedia(`(inverted-colors: ${m})`).matches;
}
function qr(m) {
  if (!(m instanceof DOMException)) {
    return false;
  }
  const W = m.message;
  return Sr.test(W) || Lr.test(W) || er.test(W);
}
function Gr() {
  const r = document.createElement("a");
  r.style.width =
    "calc( 1px * ( sin( 66911823500 * ( 36781 / -0.55 * cos( -30780.497322536891 ) ) ) )";
  return { s: 0, v: r.style.width };
}
function cr(m, W) {
  m[0] ^= W[0];
  m[1] ^= W[1];
}
const Ir = { noop: ["a", "b"] };
function Qr(m, W) {
  return new Promise((l) => sO(l, m, W));
}
function vr(m) {
  return !!m && m.__type__ === "withoutDefault";
}
function Rr(m) {
  const W = m;
  return !!W.getCallId && typeof W.getCallId == "string";
}
function Er(m, W) {
  return m.indexOf(W) !== -1;
}
function Kr() {
  return [
    "var/db/MobileIdentityData/Version.plist",
    "private/preboot/active",
    "etc/hosts",
    "var/mobile/Library/SpringBoard/TodayViewArchive.plist",
    "var/mobile/Library/Preferences/com.apple.corerecents.recentsd.plist",
  ];
}
function Ur(m) {
  const W = new Uint8Array(m.length / 2);
  for (let l = 0; l < m.length; l += 2) {
    W[l / 2] = parseInt(m[l] + m[l + 1], 16);
  }
  return W;
}
async function Jr() {
  try {
    return { s: 0, v: await Xr() };
  } catch (Y) {
    if (rO(Y)) {
      return { s: -101, v: null };
    }
    throw Y;
  }
}
async function hr(m) {
  switch (m) {
    case "prompt":
      return { s: -2, v: null };
    case "denied":
      return { s: -3, v: null };
    case "granted":
      return new Promise((m) => {
        navigator.geolocation.getCurrentPosition(
          (W) =>
            m(
              (function (m) {
                if (!m) {
                  return { s: -5, v: null };
                }
                const {
                  accuracy: l,
                  altitude: r,
                  altitudeAccuracy: P,
                  latitude: N,
                  longitude: t,
                  heading: o,
                  speed: a,
                } = NW(m, "coords");
                return {
                  s: 0,
                  v: { la: N, lo: t, al: r, ac: l, alac: P, h: o, s: a, t: m.timestamp },
                };
              })(W),
            ),
          (W) =>
            m(
              (function (m) {
                switch (((r = m), NW(r, "code"))) {
                  case NW(m, "PERMISSION_DENIED"):
                    return { s: -3, v: null };
                  case NW(m, "POSITION_UNAVAILABLE"):
                    return { s: -5, v: null };
                  case NW(m, "TIMEOUT"):
                    return { s: -4, v: null };
                  default:
                    return { s: -5, v: null };
                }
                var r;
              })(W),
            ),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
      });
    default:
      return { s: -5, v: null };
  }
}
const sP = new Uint8Array([110, 117, 108, 108]),
  yP = new Uint8Array([116, 114, 117, 101]),
  HP = new Uint8Array([102, 97, 108, 115, 101]),
  XP = { '"': '"', "\\": "\\", "\b": "b", "\f": "f", "\n": "n", "\r": "r", "\t": "t" },
  wP = (() => {
    const m = new Uint8Array(128);
    for (const [W, l] of Object.entries(XP)) {
      m[l.charCodeAt(0)] = W.charCodeAt(0);
    }
    return m;
  })(),
  VP = /[\x00-\x1F"\\]/g;
function MP(m) {
  return m.split("/").map(encodeURIComponent).join("/");
}
function uP() {
  return (
    SW([
      "Iterator" in window,
      window.Error && "isError" in window.Error,
      window.Atomics && "pause" in window.Atomics,
      "network_connection".Document?.prototype && "fragmentDirective" in window.Document.prototype,
      window.CSSRule && !("UNKNOWN_RULE" in window.CSSRule),
      !("SVGDocument" in window),
    ]) >= 4
  );
}
function SP(m, W, l, r) {
  const P = (function (m, W) {
    return m.map((m) => RN(m, { q: W }));
  })(m, W);
  if (P.length === 0) {
    return () => Promise.resolve({ s: -1, v: null });
  }
  bt(r, () => ({ e: 6 }));
  const N = so(),
    t = wr(N),
    o = Date.now(),
    a = RO(P, Mr.bind(null, 5e3, r, t), JP, Math.max(10, P.length), l);
  a.then(
    () => N.resolve(),
    () => N.resolve(),
  );
  return async function (m, W, l) {
    try {
      await Promise.race([a, NN(o, m, W)]);
      const r = (function ({ result: m, failedAttempts: W }) {
        if (m !== undefined) {
          return m;
        }
        const l = W[0];
        if (!l) {
          return { s: -3, v: null };
        }
        if (l.level === 1) {
          return l.error;
        }
        const { error: r, endpoint: P } = l;
        if (r instanceof Error) {
          const { name: m, message: W } = r;
          switch (m) {
            case "AbortError":
              return { s: -2, v: W };
            case "TimeoutError":
              return { s: -3, v: W };
            case "CSPError":
              return { s: -6, v: W };
            case "InvalidURLError":
              return { s: -7, v: `Invalid URL: ${nl(P, 255)}` };
            case "TypeError":
              return { s: -4, v: W };
          }
        }
        return rt(r);
      })(a.current);
      bt(l, () => ({ e: 7, result: r }));
      return r;
    } catch (V) {
      throw (bt(l, () => ({ e: 8, error: V })), V);
    }
  };
}
function LP(m) {
  const l = performance.timeOrigin ?? Date.now() - performance.now();
  return Math.round(m.getTime() - l);
}
function eP() {
  return { s: 0, v: performance.timeOrigin ?? Date.now() - performance.now() };
}
function zP() {
  const l = [
    ["navigator", ["plugins", "userAgent", "platform", "appName", "languages"]],
    ["screen", ["width", "availWidth", "height", "availHeight"]],
  ];
  const r = {};
  for (const [P, N] of l) {
    for (const l of N) {
      const N = Object.getOwnPropertyDescriptor(window[P], l)?.get?.toString();
      if (N !== undefined) {
        r[`${P}.${l}`] = N;
      }
    }
  }
  return { s: 0, v: r };
}
var FP = Yr(
  [
    103540708, 3177468069, 195515584, 1035000902, 3608426121, 1070496435, 568496454, 2672325332,
    550707368, 2079295255, 2669640837, 1787111349, 833865798, 2672325270, 1787109797, 934664262,
    2672325270, 1787110561, 665902150, 2434364054, 634616290, 854512406, 2467773143, 2089106345,
    2140987718, 3779492997, 226851740,
  ],
  6,
);
async function bP(m, N, t, o, a) {
  if (m.length === 0) {
    throw new TypeError("The list of endpoints is empty");
  }
  const O = m.map((m) =>
      (function (m, { apiKey: W }) {
        return RN(m, { ci: it(), q: W });
      })(m, N),
    ),
    f = await el(N),
    d = CO(f),
    D = N.fast ? 0 : 1;
  return await LN(
    a,
    () => ({ e: 15, stage: D, body: f, isCompressed: At(d) }),
    (m) => ({ e: 16, stage: D, result: m }),
    (m) => ({ e: 17, stage: D, error: m }),
    async () =>
      (function ({ result: m, failedAttempts: N, aborted: t }) {
        if (m) {
          return m;
        }
        const o = N[0];
        if (!o) {
          throw t && !t.resolve ? t.error : new Error("aborted");
        }
        const { level: a, error: O } = o;
        if (a === 0 && O instanceof Error) {
          switch (O.name) {
            case "CSPError":
              throw new V(w.csp_block, "csp_block");
            case "InvalidURLError":
              throw new V(w.invalid_endpoint, "invalid_endpoint");
            case "AbortError":
              throw new V(w.network_abort, "network_abort");
          }
          throw new V(w.network_connection, "network_connection");
        }
        throw O;
      })(
        await RO(
          O,
          Nd.bind(null, { body: d, getCallDebugger: a, stage: D, pollingContainer: t }),
          Bd.bind(null, N.modules, N.storageKeyPrefix),
          Infinity,
          o,
        ),
      ),
  );
}
function nP(m) {
  return new Promise((t) => {
    const o = "/private/var/mobile/Media/PhotoData/external/" + m + "/1";
    try {
      const [, m, W] = _t(o);
      if (m !== 0) {
        return void t(m);
      }
      W.getParent(
        () => t(0),
        () => t(-1),
      );
    } catch (k) {
      t(-2);
    }
  });
}
const ZP = [202, 206];
function TP() {
  return {
    initDataTypes: ["cenc"],
    audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
  };
}
function qP() {
  const r = window.WebAssembly;
  if (!r?.validate) {
    return { s: -1, v: null };
  }
  const P = [0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10],
    N = [
      [9, 1, 7, 0, 65, 0, 253, 15, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [240, 67, 0, 0, 0, 12, 1, 10, 0, 252, 2, 3, 1, 1, 0, 0, 110, 26, 11, 161, 10],
      [6, 1, 4, 0, 18, 0, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [8, 1, 6, 0, 65, 0, 192, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [7, 1, 5, 0, 208, 112, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
    ];
  let t = 0;
  for (const m of N) {
    t <<= 1;
    t |= r.validate(Uint8Array.of(...P, ...m)) ? 1 : 0;
  }
  return { s: 0, v: t };
}
function GP(m) {
  return BD((m, W) => {
    const { webdriver: l } = W.navigator;
    if (l === null) {
      return { s: -1, v: null };
    }
    if (l === undefined) {
      return { s: -2, v: null };
    }
    return { s: 0, v: l };
  }, m.sis);
}
function cP(m) {
  return matchMedia(`(dynamic-range: ${m})`).matches;
}
function BP() {
  const W = (m) => pD(yr(m), null),
    l = [W(screen.width), W(screen.height)];
  l.sort().reverse();
  return l;
}
function QP() {
  const m = /{(.*?)}/.exec(location.hash);
  return !!m && pl(m[1]) === 3025844545;
}
function vP() {
  const W = navigator.languages;
  if (W) {
    return { s: 0, v: hO(W) };
  }
  return { s: -1, v: null };
}
function EP(m, W) {
  const l = {},
    r = ["x", "y", "left", "right", "bottom", "height", "top", "width"],
    P = m.getBoundingClientRect();
  for (const m of r) {
    if (m in P) {
      l[m] = P[m];
    }
  }
  const N = W.getComputedStyle(m, null).getPropertyValue("font-family");
  l.font = N;
  return l;
}
function KP(m) {
  return (m >= 48 && m < 58) || m === 45;
}
function UP(m, W, l) {
  if (m.length !== W.length || m.length !== l.length) {
    throw new Error(
      "Invalid encryption configuration: all input arrays must have the same length.",
    );
  }
  const r = new Array(m.length).fill(undefined);
  return (P) => {
    if (r.every((m) => m === null)) {
      return null;
    }
    for (let t = 0; t < m.length; t++) {
      if (r[t] !== null && (r[t] || (r[t] = ld(m[t], W[t], l[t])), r[t] !== null)) {
        return kN(r[t]?.[P]);
      }
    }
    return null;
  };
}
function JP({ status: m, body: W }) {
  if (m === 200 && /^[a-zA-Z0-9+/]{1,1022}={0,2}$/.test(W)) {
    return { result: { s: 0, v: W } };
  }
  return { error: { s: -5, v: nl(`${m}: ${W}`, 255) } };
}
function hP(m) {
  const W = document.createDocumentFragment(),
    l = t(W, "mrow"),
    r = t(l, "munderover"),
    P = t(r, "mmultiscripts");
  t(P, "mo", "∏");
  const N = [
    ["𝔈", "υ", "τ", "ρ", "σ"],
    ["𝔇", "π", "ο", "ν", "ξ"],
    ["𝔄", "δ", "γ", "α", "β"],
    ["𝔅", "θ", "η", "ε", "ζ"],
    ["𝔉", "ω", "ψ", "ϕ", "χ"],
    ["ℭ", "μ", "λ", "ι", "κ"],
  ];
  function t(m, W, l = "") {
    const r = document.createElement(W);
    r.textContent = l;
    m.append(r);
    return r;
  }
  function o(m, W, l, r, P) {
    const N = document.createElement("mmultiscripts");
    t(N, "mi", m);
    t(N, "mi", W);
    t(N, "mi", l);
    t(N, "mprescripts");
    t(N, "mi", r);
    t(N, "mi", P);
    return N;
  }
  for (const m of N) {
    const W = o(...m);
    P.append(W);
  }
  return BD((m, l) => {
    const r = document.createElement("math");
    r.style.whiteSpace = "nowrap";
    r.append(W);
    l.document.body.append(r);
    const P = EP(r, l);
    l.document.body.removeChild(r);
    return { s: 0, v: P };
  }, m.sis);
}
function jP(m) {
  return m.arr.subarray(0, m.len);
}
function pP(m) {
  return `${m}t`;
}
function gP() {
  return kf(aD(400, 4, { s: -2, v: null }), Fm);
}
function _P(m) {
  return (
    m instanceof window.DOMException &&
    m.message.includes("must be called from a top-level browsing context")
  );
}
function iP(m) {
  for (let W = 0; W < 4; ++W) {
    if (m[W]) {
      return false;
    }
  }
  return true;
}
function mN(m) {
  const N = function (m, W) {
      return m + W;
    },
    S = ul(m),
    L = new Uint8Array(16);
  for (let m = 0; m < S.length; m += 2) {
    L[m / 2] = parseInt(N("" + S[m] + "", S[m + 1]) + "", 16);
  }
  const e = CD(L),
    z = Fr(L[parseInt(S[S.length - 1], 16)], 8, 22),
    F = e.slice(0, Math.min(e.length - 2, z)),
    b = CD(yo(Pt(eW(ud(F), ZP)))).slice(0, 2);
  return sf(
    m,
    lO(
      ("" + F + "" + b + "")
        .replace(new RegExp("\\+", "g"), "-")
        .replace(new RegExp("\\/", "g"), "_"),
      L,
    ),
  );
}
function WN(m, W) {
  Wo(m, m.len + W.length);
  m.arr.set(W, m.len);
  m.len += W.length;
}
async function lN(m, W = false) {
  if (!dd() || !zW()) {
    return { s: -1, v: null };
  }
  if (!(await GO())) {
    return { s: -2, v: null };
  }
  const t = pt(W);
  try {
    return { s: 0, v: await Yf("com.widevine.alpha", m, [t]) };
  } catch (C) {
    return { s: -3, v: null };
  }
}
function rN() {
  if (navigator.mimeTypes === undefined) {
    return { s: -1, v: null };
  }
  if (navigator.mimeTypes.length === undefined) {
    return { s: -3, v: null };
  }
  return { s: 0, v: navigator.mimeTypes.length };
}
async function PN(m) {
  UO(m, 6);
  const W = await sW(m, [7, 8]);
  if (W[0] === 8) {
    throw Pd(W);
  }
  UO(m, 9);
  const l = W[1];
  if (
    !(function (m) {
      if (!dW(m)) {
        return false;
      }
      for (const W of Object.keys(m)) {
        const l = m[W];
        if (!dW(l) || !Number.isFinite(YN(l, "duration")) || (!ro(l, "value") && !ro(l, "error"))) {
          return false;
        }
      }
      return true;
    })(l)
  ) {
    throw new Error("The worker returned a malformed GetOk payload.");
  }
  return l;
}
function NN(m, W, l) {
  return Qr(Math.min(Math.max(W, m + 1e4 - Date.now()), l));
}
function tN() {
  const r = window.getComputedStyle(document.documentElement);
  return { s: 0, v: SW(ca.map((m) => r.getPropertyValue(m) !== "")) >= 4 };
}
function oN() {
  return "gpu" && navigator.gpu;
}
function aN(m, W, l, r) {
  m.addEventListener(W, l, r);
  return () => m.removeEventListener(W, l, r);
}
function fN(m, W) {
  function L(m, W) {
    return e(m) && m.errorCode === 400 && m.url.includes(W);
  }
  function e(m) {
    return typeof m === "object" && m !== null && "errorCode" in m && "url" in m;
  }
  let z = null,
    F = false;
  async function b() {
    const W = QD(m);
    if (W !== 0) {
      return { s: W, v: null };
    }
    const { s: l, v: r } = await J(m);
    if (l !== 0) {
      return { s: l, v: null };
    }
    return { s: 0, v: r };
  }
  if (W) {
    m.addEventListener("icecandidateerror", (l) => {
      if (L(l, W)) {
        if (z) {
          z();
          z = null;
          Mm(m);
        } else {
          F = true;
        }
      }
    });
  }
  const n = {
    closeConnection: () => Mm(m),
    createDataChannelAndOffer: async () => {
      const W = await b();
      if (W.s !== 0) {
        Mm(m);
      }
      return W;
    },
  };
  return W
    ? Object.assign(n, {
        closeConnectionWhenTurnEnds: function () {
          if (!(m.connectionState === "closed")) {
            if (F) {
              Mm(m);
            } else {
              z = sO(Mm, 5e3, m);
            }
          }
        },
      })
    : n;
}
const dN = (m) => m instanceof Error && m.message === "Illegal invocation";
const DN = [3, 7];
function XN(m) {
  return typeof m == "string" || (Array.isArray(m) && m.every((m) => typeof m == "string"));
}
function wN() {
  return {
    stage1: { s94: uo, s219: JO, s167: ot, s213: hd },
    stage2: {
      s52: qO,
      s6: Ao,
      s26: Cl,
      s58: nf,
      s20: jN,
      s36: no,
      s51: Jr,
      s21: Yo,
      s154: Tl,
      s79: Al,
      s23: gN,
      s29: Zl,
      s84: Fl,
      s85: SN,
      s89: jt,
      s17: Eo,
      s87: wm,
      s92: hP,
      s93: ff,
      s204: tt,
      s206: Xf,
      s207: ia,
      s210: hl,
      s211: Rm,
      s158: GP,
      s152: lm,
      s163: XW,
      s95: Sm,
      s97: Jm,
      s160: vm,
      s70: hD,
      s106: sa,
      s214: gP,
      s215: bm,
      s216: ym,
      s217: $a,
      s222: gO,
      s223: _N,
    },
    stage3: {
      s22: qP,
      s30: IW,
      s33: fW,
      s44: ur,
      s45: El,
      s49: Nt,
      s50: zN,
      s57: bd,
      s59: za,
      s60: Fa,
      s61: ba,
      s62: na,
      s63: Ya,
      s64: Aa,
      s65: Za,
      s66: Na,
      s68: ka,
      s71: Hr,
      s24: iN,
      s72: xd,
      s1: Zo,
      s2: ko,
      s3: xo,
      s4: Co,
      s5: To,
      s7: qo,
      s9: Go,
      s10: co,
      s11: Bo,
      s12: xl,
      s13: Io,
      s14: Qo,
      s15: vo,
      s16: Ro,
      s19: Ko,
      s27: Uo,
      s28: Jo,
      s32: ho,
      s37: $o,
      s41: jo,
      s39: po,
      s42: go,
      s38: _o,
      s43: io,
      s40: Wa,
      s46: la,
      s80: ra,
      s81: Pa,
      s82: lo,
      s83: Po,
      s86: cl,
      s91: ma,
      s96: ta,
      s98: tf,
      s99: TO,
      s200: eP,
      s201: xa,
      s202: Oa,
      s101: fa,
      s103: da,
      s104: Da,
      s117: ya,
      s119: Ha,
      s123: Xa,
      s131: wa,
      s133: Va,
      s136: Ma,
      s148: ua,
      s149: Sa,
      s150: La,
      s157: ea,
      s102: Od,
      s118: j,
      s120: zf,
      s130: Do,
      s132: Km,
      s135: rN,
      s139: Uf,
      s142: af,
      s144: pO,
      s145: jm,
      s146: Wt,
      s151: EN,
      s153: AW,
      s155: zP,
      s156: ha,
      s159: DO,
      s162: vP,
      s165: wo,
      s166: Ct,
      s205: U,
      s203: Gr,
      s209: ZW,
      s212: tN,
      s74: oa,
      s75: aa,
      s221: Rl,
      s76: od,
    },
  };
}
function VN(m) {
  return "agentId" in m;
}
function MN(m) {
  return (
    m.name === "UnknownError" &&
    new RegExp("Cannot create so many PeerConnections").test(NW(m, "message"))
  );
}
function uN(m) {
  return YO(m, (m) => ({ s: 0, v: m }));
}
function SN() {
  return kf(Qr(250, { s: -3, v: null }), async () => {
    if (Cm() || vl()) {
      return Kl();
    }
    return { s: -1, v: null };
  });
}
async function LN(m, W, l, r, P) {
  let N;
  bt(m, W);
  try {
    N = await P();
  } catch (Z) {
    throw (bt(m, r, Z), Z);
  }
  bt(m, l, N);
  return N;
}
async function eN(m, W, l, r, P, N, t) {
  if (m === undefined) {
    return;
  }
  let o = m;
  for (let m = 0; m < W; ++m) {
    const W = new Date();
    let a, O;
    try {
      a = await Ka(() => l(o, m, t), t);
    } catch (p) {
      O = p;
      N.failedAttempts.push({ level: 0, endpoint: o, error: p });
    }
    if (a) {
      const m = r(a);
      if ("result" in m) {
        N.result = m.result;
        break;
      }
      if ((N.failedAttempts.push({ level: 1, endpoint: o, error: m.error }), m.stop)) {
        break;
      }
    }
    const f = P(W, a, O);
    if (!f) {
      break;
    }
    await Ka(RD(f[1]), t);
    o = f[0];
  }
}
function zN() {
  var m, W;
  const t =
    (W = (m = window.performance) == null ? undefined : NW(m, "memory")) == null
      ? undefined
      : W.jsHeapSizeLimit;
  if (t == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: t };
}
function FN(m) {
  return m instanceof Error && m.name === "TypeError";
}
function bN(m) {
  return !!m && typeof m.then == "function";
}
function YN(m, W) {
  return ro(m, W) ? m[W] : undefined;
}
async function AN(m) {
  try {
    return { s: 0, v: await m.createMediaKeys() };
  } catch (z) {
    const t = String((z == null ? undefined : NW(z, "message")) ?? z);
    if (new RegExp("CreateCdmFunc not available").test(t)) {
      return { s: -1, v: null };
    }
    throw z;
  }
}
function ZN() {
  return (
    SW([
      "ClipboardItem" in window,
      "PerformanceEventTiming" in window,
      "RTCSctpTransport" in window,
    ]) >= 2
  );
}
function kN(m) {
  if (m instanceof Array) {
    return m.map(kN);
  }
  if (m && typeof m == "object") {
    const W = {};
    for (const l of Object.keys(m)) {
      W[l] = kN(m[l]);
    }
    return W;
  }
  return m;
}
function cN(m, W, l, r) {
  const P = aD(m, W, r),
    N = (function (m, W) {
      let l = () => {};
      return lW(
        new Promise((r) => {
          l = sO(r, m, W);
        }),
        l,
      );
    })(l, r);
  let t = false;
  const o = () => {
      if (!t) {
        t = true;
        P.cancel();
        N.cancel();
      }
    },
    a = Promise.race([P, N]);
  a.then(o, o);
  return lW(a, o);
}
async function BN(m) {
  return m.info ?? (await m.requestAdapterInfo());
}
function IN(m, W) {
  const l = m[0] >>> 16,
    r = 65535 & m[0],
    P = m[1] >>> 16,
    N = 65535 & m[1],
    t = W[0] >>> 16,
    o = 65535 & W[0],
    a = W[1] >>> 16;
  let O = 0,
    f = 0,
    d = 0,
    D = 0;
  D += N + (65535 & W[1]);
  d += D >>> 16;
  D &= 65535;
  d += P + a;
  f += d >>> 16;
  d &= 65535;
  f += r + o;
  O += f >>> 16;
  f &= 65535;
  O += l + t;
  O &= 65535;
  m[0] = (O << 16) | f;
  m[1] = (d << 16) | D;
}
const QN = /\(([^(^\s^}]+):(\d)+:(\d)+\)/i,
  vN = /@([^(^\s^}]+):(\d)+:(\d)+/i;
function RN(m, W) {
  const l = zm(m);
  let { query: r } = l;
  for (const [m, l] of Object.entries(W)) {
    for (const W of Array.isArray(l) ? l : [l]) {
      r = `${r ? `${r}&` : ""}${m}=${MP(W)}`;
    }
  }
  l.query = r;
  return $m(l);
}
function EN() {
  const m = Object.getOwnPropertyDescriptor(document, "createElement");
  if (m) {
    return { s: 0, v: !("writeable" in m) };
  }
  return { s: -1, v: null };
}
const KN = {
  Awesomium: "awesomium",
  Cef: "cef",
  CefSharp: "cefsharp",
  CoachJS: "coachjs",
  Electron: "electron",
  FMiner: "fminer",
  Geb: "geb",
  NightmareJS: "nightmarejs",
  Phantomas: "phantomas",
  PhantomJS: "phantomjs",
  Rhino: "rhino",
  Selenium: "selenium",
  Sequentum: "sequentum",
  SlimerJS: "slimerjs",
  WebDriverIO: "webdriverio",
  WebDriver: "webdriver",
  HeadlessChrome: "headless_chrome",
  Unknown: "unknown",
};
class UN extends Error {
  constructor(m, W) {
    super(W);
    this.state = m;
    this.name = "BotdError";
    Object.setPrototypeOf(this, UN.prototype);
  }
}
async function JN() {
  return NW(await navigator.permissions.query({ name: "microphone" }), "state");
}
async function hN(m, W) {
  if (fo(W)) {
    return m;
  }
  const l = zm(m);
  await Promise.all(
    or.map(async (m) => {
      const r = l[m];
      var P;
      if (W[m] && r) {
        l[m] = await (async function (m) {
          if (m === "") {
            return "";
          }
          const l = window.crypto?.subtle;
          return l?.digest
            ? CD(await l.digest("SHA-256", ud(m)))
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
            : "stripped";
        })(m === "query" ? ((P = r), P.split("&").sort().join("&")) : r);
      }
    }),
  );
  return $m(l);
}
function $N(m) {
  return { __type__: "withoutDefault", value: m };
}
async function jN(m) {
  return await x(m);
}
async function gN() {
  if (rm() && ZN()) {
    return { s: -3, v: null };
  }
  const P = await Promise.race([RD(100, null), Gf()]);
  if (P === null) {
    return { s: -2, v: null };
  }
  if (P === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: P };
}
function _N() {
  return kf(Qr(300, { s: -3, v: null }), async () => {
    const a = window.PresentationRequest;
    if (typeof a !== "function") {
      return { s: -1, v: null };
    }
    let O;
    try {
      O = new a(["cast:"]);
    } catch (J) {
      return { s: -4, v: null };
    }
    if (typeof O.reconnect !== "function") {
      return { s: -1, v: null };
    }
    try {
      await O.reconnect("1bf61339ba6d48768badd4270e9c568c");
    } catch (OO) {
      return { s: 0, v: OO instanceof Error ? OO.message : String(OO) };
    }
    return { s: -2, v: null };
  });
}
function iN() {
  return { s: 0, v: eval.toString().length };
}
function mt(m) {
  return typeof m == "string" && !m.match(/[^A-Z0-9_x]/);
}
function Wt() {
  try {
    objectToInspect;
    return { s: 0, v: true };
  } catch (bO) {
    return { s: 0, v: false };
  }
}
function lt(m) {
  return E(m) ? m : [m];
}
function rt(m) {
  return { e: Kf(m) };
}
function Pt(m) {
  const W = XO(m);
  q =
    q ||
    (function () {
      let m;
      const W = new Uint32Array(256);
      for (let l = 0; l < 256; l++) {
        m = l;
        for (let W = 0; W < 8; W++) {
          m = 1 & m ? 3988292384 ^ (m >>> 1) : m >>> 1;
        }
        W[l] = m;
      }
      return W;
    })();
  let l = ~0;
  for (let m = 0; m < W.length; m++) {
    l = (l >>> 8) ^ q[255 & (l ^ W[m])];
  }
  return (-1 ^ l) >>> 0;
}
function Nt() {
  const { performance: m } = window;
  if (!m?.now) {
    return { s: -1, v: null };
  }
  let W = 1,
    l = 1,
    r = m.now(),
    P = r;
  for (let N = 0; N < 5e4; N++) {
    if ((r = P) < (P = m.now())) {
      const m = P - r;
      if (m > W) {
        if (m < l) {
          l = m;
        }
      } else {
        if (m < W) {
          l = W;
          W = m;
        }
      }
    }
  }
  return { s: 0, v: [W, l] };
}
async function tt(m) {
  return BD((m, W) => {
    const l = W.document.createElement("div");
    l.style.width = "100px";
    l.style.height = "100px";
    l.style.overflow = "scroll";
    l.style.visibility = "hidden";
    W.document.body.appendChild(l);
    const r = l.offsetWidth === l.clientWidth;
    W.document.body.removeChild(l);
    return { s: 0, v: r };
  }, m.sis);
}
function ot({ cache: m, esc: W = true }) {
  if (!W) {
    return { s: -5, v: null };
  }
  const P = { s: -2, v: null },
    N = qd(m);
  K(N)
    .then((m) => {
      Rt(P, m);
    })
    .catch((m) => Rt(P, rt(m)));
  return P;
}
function at(m) {
  return matchMedia(`(prefers-reduced-motion: ${m})`).matches;
}
function Ot(m) {
  return { s: 0, v: m };
}
function ft(m) {
  const W = m.filter((m) => {
      return pl(m?.name?.slice(0, 6)) === 1655763047;
    }),
    l = [];
  if (W.length > 0) {
    const m = new Map();
    W.forEach((W) => {
      const l = W.name.codePointAt(6);
      if (l !== undefined) {
        const W = m.get(l) || 0;
        m.set(l, W + 1);
      }
    });
    m.forEach((m, W) => {
      l.push(W, m);
    });
  }
  return { s: m.length ? 0 : 1, v: l };
}
function dt(m) {
  const W = [0, m[0] >>> 1];
  cr(m, W);
  cD(m, tm);
  W[1] = m[0] >>> 1;
  cr(m, W);
  cD(m, om);
  W[1] = m[0] >>> 1;
  cr(m, W);
}
const Dt = function () {
    return navigator.userAgent;
  },
  st = function () {
    const m = navigator.appVersion;
    if (m == null) {
      throw new UN(-1, "navigator.appVersion is undefined");
    }
    return m;
  },
  yt = function () {
    if (navigator.connection === undefined) {
      throw new UN(-1, "navigator.connection is undefined");
    }
    if (navigator.connection.rtt === undefined) {
      throw new UN(-1, "navigator.connection.rtt is undefined");
    }
    return navigator.connection.rtt;
  },
  Ht = function () {
    return {
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  },
  Xt = function () {
    if (navigator.plugins === undefined) {
      throw new UN(-1, "navigator.plugins is undefined");
    }
    if (navigator.plugins.length === undefined) {
      throw new UN(-3, "navigator.plugins.length is undefined");
    }
    return navigator.plugins.length;
  },
  wt = function () {
    try {
      null[0]();
    } catch (xO) {
      if (xO instanceof Error && xO.stack != null) {
        return xO.stack.toString();
      }
    }
    throw new UN(-3, "errorTrace signal unexpected behaviour");
  },
  Vt = function () {
    const { productSub: m } = navigator;
    if (m === undefined) {
      throw new UN(-1, "navigator.productSub is undefined");
    }
    return m;
  },
  Mt = function () {
    if (window.external === undefined) {
      throw new UN(-1, "window.external is undefined");
    }
    const { external: m } = window;
    if (typeof m.toString != "function") {
      throw new UN(-2, "window.external.toString is not a function");
    }
    return m.toString();
  },
  ut = function () {
    if (navigator.mimeTypes === undefined) {
      throw new UN(-1, "navigator.mimeTypes is undefined");
    }
    const { mimeTypes: m } = navigator;
    let W = Object.getPrototypeOf(m) === MimeTypeArray.prototype;
    for (let l = 0; l < m.length; l++) {
      if (W) {
        W = Object.getPrototypeOf(m[l]) === MimeType.prototype;
      }
    }
    return W;
  },
  St = async function () {
    if (window.Notification === undefined) {
      throw new UN(-1, "window.Notification is undefined");
    }
    if (navigator.permissions === undefined) {
      throw new UN(-1, "navigator.permissions is undefined");
    }
    const { permissions: m } = navigator;
    if (typeof m.query != "function") {
      throw new UN(-2, "navigator.permissions.query is not a function");
    }
    try {
      const W = await m.query({ name: "notifications" });
      return window.Notification.permission === "denied" && W.state === "prompt";
    } catch (dO) {
      throw new UN(-3, "notificationPermissions signal unexpected behaviour");
    }
  },
  Lt = function () {
    if (document.documentElement === undefined) {
      throw new UN(-1, "document.documentElement is undefined");
    }
    const { documentElement: m } = document;
    if (typeof m.getAttributeNames != "function") {
      throw new UN(-2, "document.documentElement.getAttributeNames is not a function");
    }
    return m.getAttributeNames();
  },
  et = function () {
    if (Function.prototype.bind === undefined) {
      throw new UN(-2, "Function.prototype.bind is undefined");
    }
    return Function.prototype.bind.toString();
  },
  zt = function () {
    const { process: m } = window;
    if (m === undefined) {
      throw new UN(-1, `${"window.process is"} undefined`);
    }
    if (m && typeof m != "object") {
      throw new UN(-3, `${"window.process is"} not an object`);
    }
    return m;
  },
  Ft = function () {
    const m = {
      [KN.Awesomium]: { window: ["awesomium"] },
      [KN.Cef]: { window: ["RunPerfTest"] },
      [KN.CefSharp]: { window: ["CefSharp"] },
      [KN.CoachJS]: { window: ["emit"] },
      [KN.FMiner]: { window: ["fmget_targets"] },
      [KN.Geb]: { window: ["geb"] },
      [KN.NightmareJS]: { window: ["__nightmare", "nightmare"] },
      [KN.Phantomas]: { window: ["__phantomas"] },
      [KN.PhantomJS]: { window: ["callPhantom", "_phantom"] },
      [KN.Rhino]: { window: ["spawn"] },
      [KN.Selenium]: {
        window: [
          "_Selenium_IDE_Recorder",
          "_selenium",
          "calledSelenium",
          /^([a-z]){3}_.*_(Array|Promise|Symbol)$/,
        ],
        document: ["__selenium_evaluate", "selenium-evaluate", "__selenium_unwrapped"],
      },
      [KN.WebDriverIO]: { window: ["wdioElectron"] },
      [KN.WebDriver]: {
        window: [
          "webdriver",
          "__webdriverFunc",
          "__lastWatirAlert",
          "__lastWatirConfirm",
          "__lastWatirPrompt",
          "_WEBDRIVER_ELEM_CACHE",
          "ChromeDriverw",
        ],
        document: [
          "__webdriver_script_fn",
          "__driver_evaluate",
          "__webdriver_evaluate",
          "__fxdriver_evaluate",
          "__driver_unwrapped",
          "__webdriver_unwrapped",
          "__fxdriver_unwrapped",
          "__webdriver_script_fn",
          "__webdriver_script_func",
          "__webdriver_script_function",
          "$cdc_asdjflasutopfhvcZLmcf",
          "$cdc_asdjflasutopfhvcZLmcfl_",
          "$chrome_asyncScriptInfo",
          "__$webdriverAsyncExecutor",
        ],
      },
      [KN.HeadlessChrome]: { window: ["domAutomation", "domAutomationController"] },
    };
    let W;
    const l = {},
      r = IO(window);
    let P = [];
    for (W in (window.document !== undefined && (P = IO(window.document)), m)) {
      const N = m[W];
      if (N !== undefined) {
        const m = N.window !== undefined && cf(r, ...N.window),
          t = !(N.document === undefined || !P.length) && cf(P, ...N.document);
        l[W] = m || t;
      }
    }
    return l;
  };
function bt(m, W, ...l) {
  if (m) {
    AD(() => {
      const r = W(...l);
      if (r !== undefined) {
        m(r);
      }
    });
  }
}
function nt(m) {
  return Object.keys(m.__proto__).filter(mt);
}
function Yt(m) {
  const W = wO(),
    l = XO(m);
  let r = 0;
  const P = () => {
      O();
      if (l[r] === 34) {
        return N();
      }
      if (KP(l[r])) {
        return t();
      }
      if (f(sP)) {
        r += sP.length;
        return null;
      }
      if (f(yP)) {
        r += yP.length;
        return true;
      }
      if (f(HP)) {
        r += HP.length;
        return false;
      }
      if (l[r] === 91) {
        return o();
      }
      if (l[r] === 123) {
        return a();
      }
      return d();
    },
    N = () => {
      for (W.len = 0; r++, l[r] !== 34;) {
        if (l[r] === 92) {
          if ((r++, l[r] === 117)) {
            const m = parseInt(kl(l.subarray(r + 1, r + 5)), 16);
            WN(W, ud(String.fromCharCode(m)));
            r += 4;
            continue;
          }
          const m = wP[l[r]];
          if (m) {
            Vr(W, m);
            continue;
          }
          return d();
        }
        if (l[r] === undefined) {
          return d();
        }
        Vr(W, l[r]);
      }
      r++;
      return kl(jP(W));
    },
    t = () => {
      const m = r;
      for (; l[r] === 46 || l[r] === 101 || l[r] === 69 || l[r] === 43 || KP(l[r]);) {
        r++;
      }
      return Number(kl(l.subarray(m, r)));
    },
    o = () => {
      const m = [];
      for (r++; ;) {
        if ((O(), l[r] === 93)) {
          r++;
          break;
        }
        if (m.length) {
          if (l[r] !== 44) {
            return d();
          }
          r++;
        }
        m.push(P());
      }
      return m;
    },
    a = () => {
      const m = {};
      let W = true;
      for (r++; ;) {
        if ((O(), l[r] === 125)) {
          r++;
          break;
        }
        if (!W) {
          if (l[r] !== 44) {
            return d();
          }
          r++;
          O();
        }
        if (l[r] !== 34) {
          return d();
        }
        const t = N();
        if ((O(), l[r] !== 58)) {
          return d();
        }
        r++;
        Object.defineProperty(m, t, {
          value: P(),
          configurable: true,
          enumerable: true,
          writable: true,
        });
        W = false;
      }
      return m;
    },
    O = () => {
      for (; l[r] === 32 || l[r] === 10 || l[r] === 13 || l[r] === 9;) {
        r++;
      }
    },
    f = (m) => {
      for (let W = 0; W < m.length; W++) {
        if (l[r + W] !== m[W]) {
          return false;
        }
      }
      return true;
    },
    d = () => {
      throw new SyntaxError("Unexpected " + (r < l.length ? `byte ${r}` : "end"));
    },
    D = P();
  O();
  if (l[r] !== undefined) {
    d();
  }
  return D;
}
function At(m) {
  return m.byteLength > 1024 && PO();
}
function Zt(m, W) {
  const l = m[0];
  if ((W %= 64) === 32) {
    m[0] = m[1];
    m[1] = l;
  } else {
    if (W < 32) {
      m[0] = (l << W) | (m[1] >>> (32 - W));
      m[1] = (m[1] << W) | (l >>> (32 - W));
    } else {
      W -= 32;
      m[0] = (m[1] << W) | (l >>> (32 - W));
      m[1] = (l << W) | (m[1] >>> (32 - W));
    }
  }
}
async function xt() {
  return NW(await navigator.permissions.query({ name: "camera" }), "state");
}
function Ct() {
  return { s: 0, v: i(Navigator.prototype, ad) };
}
async function Tt(m, W) {
  return Promise.all(
    m.map(async (m) => {
      const [l, r] = await Promise.all([hN(m.l, W), hN(m.f, W)]);
      return { l: l, f: r };
    }),
  );
}
function ct(m, W, l = Cr) {
  let r = "";
  for (let P = 0; P < m; P++) {
    r += W.charAt(l() * W.length);
  }
  return r;
}
const Bt = [3, 13],
  It = [3, 14];
function Rt(m, W) {
  for (const W of Object.keys(m)) {
    delete m[W];
  }
  Object.assign(m, W);
}
async function Kt() {
  return NW(await navigator.permissions.query({ name: "geolocation" }), "state");
}
function Ut() {
  if (!("DataTransfer" in window)) {
    return false;
  }
  try {
    new window.DataTransfer();
    return true;
  } catch (wO) {
    if (wO instanceof Error && wO.name === "TypeError") {
      return false;
    }
    throw wO;
  }
}
function Jt() {
  return (
    I([
      "msWriteProfilerMark" in window,
      "MSStream" in window,
      "msLaunchUri" in navigator,
      "msSaveBlob" in navigator,
    ]) >= 3 && !gl()
  );
}
function ht(m, W) {
  try {
    const l = m();
    if (bN(l)) {
      l.then(
        (m) => W(true, m),
        (m) => W(false, m),
      );
    } else {
      W(true, l);
    }
  } catch (vO) {
    W(false, vO);
  }
}
async function $t(m, W, l) {
  const Lm = await m.requestDevice({ requiredFeatures: W }),
    em = Math.PI,
    zm = [
      [0, 1, 0, em / 7],
      [1, 0, 0, em / 8],
      [0, 1, 1, em / 4],
      [1, 2, 1, em / 8],
    ],
    Fm = zm.length,
    bm = new Uint8Array(Fm * 40),
    nm = navigator.gpu.getPreferredCanvasFormat();
  l.configure({ device: Lm, format: nm });
  const Ym = Lm.createShaderModule({
      label: "shader",
      code: "struct O{@builtin(position)position:vec4f,@location(0)texcoord:vec2f}fn rotation(a:vec4f)->mat4x4f{var m=mat4x4f();var x=a.x;var y=a.y;var z=a.z;let n=sqrt(x*x+y*y+z*z);x/=n;y/=n;z/=n;let xx=x*x;let yy=y*y;let zz=z*z;let c=cos(a.w);let s=sin(a.w);let o=1-c;m[0]=vec4f(xx+(1-xx)*c,x*y*o+z*s,x*z*o-y*s,0);m[1]=vec4f(x*y*o-z*s,yy+(1-yy)*c,y*z*o+x*s,0);m[2]=vec4f(x*z*o+y*s,y*z*o-x*s,zz+(1-zz)*c,0);m[3]=vec4f(0,0,0,1);return transpose(m);}@group(1) @binding(0) var<uniform> axr:vec4f;@vertex fn vs(@builtin(vertex_index) i:u32)->O{let n=vec2f(-0.5,0.5);let o=vec2f(1.0,0.0);let v=array(n.xxy,n.yxy,n.xyy,n.yyy,n.xxx,n.yxx,n.xyx,n.yyx);let t=array(0,2,3,0,3,1,4,6,7,4,7,5,0,2,6,0,6,4,1,3,7,1,7,5,2,6,7,2,7,3,0,4,5,0,5,1);let u=array(o.yx,o.yy,o.xy,o.yx,o.xy,o.xx);var r:O;r.position=rotation(axr)*vec4f(v[t[i]],1);r.texcoord=u[i%6];return r;}@group(0) @binding(0) var s:sampler;@group(0) @binding(1) var t:texture_2d<f32>;@fragment fn fs(i:O)->@location(0) vec4f{return textureSample(t,s,i.texcoord);}",
    }),
    Am = Lm.createRenderPipeline({
      label: "pipeline",
      layout: "auto",
      vertex: { module: Ym },
      fragment: { module: Ym, targets: [{ format: nm }] },
      primitive: { cullMode: "none" },
    }),
    Zm = [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
    ],
    km = new Uint8Array(
      Array(63)
        .fill(undefined)
        .map((m, W) => Zm[W % 3])
        .flat(),
    ),
    xm = Lm.createTexture({
      label: "checkered",
      size: [7, 9],
      format: "rgba8unorm",
      usage: window.GPUTextureUsage.TEXTURE_BINDING | window.GPUTextureUsage.COPY_DST,
    });
  Lm.queue.writeTexture({ texture: xm }, km, { bytesPerRow: 28 }, { width: 7, height: 9 });
  const Cm = Lm.createSampler({ magFilter: "nearest" }),
    Tm = Lm.createBindGroup({
      layout: Am.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: Cm },
        { binding: 1, resource: xm.createView() },
      ],
    }),
    qm = zm.map((m) => {
      const W = Lm.createBuffer({
        label: "axrs",
        size: 4 * Float32Array.BYTES_PER_ELEMENT,
        usage: window.GPUBufferUsage.UNIFORM,
        mappedAtCreation: true,
      });
      new Float32Array(W.getMappedRange()).set(m);
      W.unmap();
      return Lm.createBindGroup({
        layout: Am.getBindGroupLayout(1),
        entries: [{ binding: 0, resource: { buffer: W } }],
      });
    }),
    Gm = Lm.createQuerySet({ type: "timestamp", count: 2 }),
    cm = Lm.createBuffer({
      size: Gm.count * 8,
      usage: window.GPUBufferUsage.QUERY_RESOLVE | window.GPUBufferUsage.COPY_SRC,
    }),
    Im = Lm.createBuffer({
      size: cm.size * Fm,
      usage: window.GPUBufferUsage.COPY_DST | window.GPUBufferUsage.MAP_READ,
    }),
    Qm = {
      label: "renderPass",
      colorAttachments: [{ clearValue: [0.3, 0.3, 0.3, 1], loadOp: "clear", storeOp: "store" }],
      timestampWrites: { querySet: Gm, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 },
    };
  for (let m = 0; m < qm.length; m++) {
    const W = qm[m];
    Qm.colorAttachments[0].view = l.getCurrentTexture().createView();
    const t = Lm.createCommandEncoder({ label: "encoder" }),
      o = t.beginRenderPass(Qm);
    o.setPipeline(Am);
    o.setBindGroup(0, Tm);
    o.setBindGroup(1, W);
    const a = window.performance.now();
    o.draw(48);
    o.end();
    t.resolveQuerySet(Gm, 0, Gm.count, cm, 0);
    if (Im.mapState === "unmapped") {
      t.copyBufferToBuffer(cm, 0, Im, m * 16, cm.size);
    }
    const O = t.finish();
    Lm.queue.submit([O]);
    const f = Bm(l.canvas);
    bm.set(f, 8 + m * 40);
    bm.set(new Uint8Array(new Float64Array([a]).buffer), m * 40);
  }
  if (Im.mapState === "unmapped") {
    await Im.mapAsync(window.GPUMapMode.READ);
    const m = Im.getMappedRange(),
      W = new Uint8Array(m);
    for (let m = 0; m < Fm; m++) {
      bm.set(W.subarray(m * 16, (m + 1) * 16), 24 + m * 40);
    }
    Im.unmap();
  }
  return CD(bm);
}
function jt() {
  return kf(aD(270, 9, { s: -2, v: null }), async () => {
    const w = navigator.storage;
    if (!w?.getDirectory) {
      return { s: -1, v: null };
    }
    let V, M;
    try {
      V = await w.getDirectory();
    } catch (IO) {
      return {
        s: 0,
        v: { re: IO instanceof Error ? IO.message : String(IO), cwe: "", clm: 0, wlm: 0 },
      };
    }
    try {
      M = Math.random().toString();
      const W = await V.getFileHandle(M, { create: true }),
        l = (await W.getFile()).lastModified;
      if ((await RD(10), typeof W.createWritable !== "function")) {
        return { s: 0, v: { re: "", cwe: "createWritable is not a function", clm: 0, wlm: 0 } };
      }
      const P = await W.createWritable({ keepExistingData: true });
      try {
        await P.write(".agent");
      } finally {
        await P.close();
      }
      return { s: 0, v: { re: "", cwe: "", clm: l, wlm: (await W.getFile()).lastModified } };
    } catch (lO) {
      return {
        s: 0,
        v: { re: "", cwe: lO instanceof Error ? lO.message : String(lO), clm: 0, wlm: 0 },
      };
    } finally {
      if (M && typeof V.removeEntry === "function") {
        V.removeEntry(M).catch(() => {});
      }
    }
  });
}
function pt(m = false) {
  const t = TP();
  if (t.audioCapabilities) {
    t.audioCapabilities[0].robustness = "SW_SECURE_CRYPTO";
  }
  if (m) {
    t.sessionTypes = ["persistent-license"];
  }
  return t;
}
function gt(m) {
  if (!m || typeof m != "object") {
    return false;
  }
  const W = m;
  return (
    !(
      (!gl() && !Jt()) ||
      (W.name !== "Error" && W.name !== "TypeError") ||
      W.message !== "Permission denied"
    ) || W.name === "SecurityError"
  );
}
function _t(m) {
  const [V] = m.split("/").slice(-1),
    M = new window.DataTransfer(),
    u = Pf(new window.RegExp("").exec(""), "input"),
    S = document.createElement(u);
  S.type = "file";
  const L = new window.File([], m, { type: "text/plain" });
  try {
    M.items.add(L);
  } catch (RO) {
    if (
      RO instanceof Error &&
      RO.name === "TypeError" &&
      RO.message?.indexOf("must be an instance of File") !== -1
    ) {
      return [V, -3, null];
    }
    throw RO;
  }
  S.files = M.files;
  if (typeof S.webkitEntries === "undefined") {
    return [V, -4, null];
  }
  if (S.webkitEntries.length === 0) {
    return [V, -2, null];
  }
  return [V, 0, S.webkitEntries[0]];
}
function it() {
  return `js/${"4.1.4"}`;
}
function mo(m, W) {
  const t = W
    ? window.RTCPeerConnection || window.webkitRTCPeerConnection
    : window.RTCPeerConnection;
  if (!t) {
    return { s: -3, v: null };
  }
  let o;
  try {
    o = new t(m);
  } catch (SO) {
    if (SO instanceof Error) {
      if (SO.name === "NotSupportedError") {
        return { s: -6, v: null };
      }
      if (MN(SO)) {
        return { s: -9, v: null };
      }
    }
    throw SO;
  }
  return { s: 0, v: o };
}
function Wo(m, W) {
  if (m.arr.length < W) {
    const l = new Uint8Array(Math.max(2 * m.arr.length, W));
    l.set(m.arr);
    m.arr = l;
  }
}
function lo() {
  const m = navigator.language;
  if (m) {
    return { s: 0, v: m };
  }
  return { s: -1, v: null };
}
function ro(m, W) {
  return Object.prototype.hasOwnProperty.call(m, W);
}
function Po() {
  const m = navigator.languages;
  if (m) {
    return { s: 0, v: m };
  }
  return { s: -1, v: null };
}
const oo = ["agent", "localStorage", "sessionStorage"],
  ao = ["optimize-cost", "aggressive"];
function Oo(m, W, l, r) {
  const P = (function* (m, W, l) {
      let r = 0,
        P = 0;
      for (; r < m.length && P < W.length;) {
        if (l(m[r], W[P])) {
          yield m[r];
          r++;
        } else {
          yield W[P];
          P++;
        }
      }
      for (; r < m.length; r++) {
        yield m[r];
      }
      for (; P < W.length; P++) {
        yield W[P];
      }
    })(
      m.map((m) => ({ t: LP(m.time), s: m.state === "visible" ? "v" : "h" })),
      W,
      (m, W) => m.t < W.t,
    ),
    N = [];
  let t;
  const o = () => {
    if (N.length === 0 && t !== undefined) {
      N.push({ t: l, s: t });
    }
  };
  for (; N.length < 100;) {
    const m = P.next();
    if (m.done) {
      break;
    }
    const W = m.value,
      a = W.t,
      O = W.s;
    if (a > r) {
      break;
    }
    if (a < l) {
      t = O;
    } else {
      if (O !== t) {
        o();
        N.push(W);
        t = O;
      }
    }
  }
  o();
  return N;
}
function fo(m) {
  return !(m && or.some((W) => m[W]));
}
function Do() {
  return { s: 0, v: [typeof SourceBuffer, typeof SourceBufferList] };
}
function so() {
  let m, W;
  const l = new Promise((l, r) => {
    m = l;
    W = r;
  });
  l.resolve = m;
  l.reject = W;
  return l;
}
function yo(m) {
  return new Uint8Array([m >> 24, m >> 16, m >> 8, m]);
}
const Ho = { "optimize-cost": 3600, aggressive: 43200 };
function Xo(m) {
  return Number.isFinite(m) ? m : DD;
}
function wo() {
  const l = new window.Event("").isTrusted;
  if (typeof l !== "boolean") {
    return { s: -1, v: null };
  }
  return { s: 0, v: { isTrusted: l } };
}
function Mo(m) {
  return m.toDataURL();
}
async function uo({ te: m }, W) {
  const N = function (m, W, l) {
      return m(W, l);
    },
    t = qD(),
    o = await N(kf, Qr(300, -4), rd.bind(null, t, m, W));
  return () => {
    const m = o();
    if (m === 0 || m === -4) {
      return { s: m, v: { u: t, e: [], s: [] } };
    }
    return { s: m, v: null };
  };
}
function So(m) {
  m.style.setProperty("visibility", "hidden", "important");
  m.style.setProperty("display", "block", "important");
}
function Lo(m) {
  return BD(
    (m, O) => {
      const M = new Promise((m) => {
        let l;
        if (rm()) {
          l = new Error();
          l.name = " ";
          Object.defineProperty(l, "stack", { get: m });
        } else {
          l = O.document.createElement("div");
          l.toString = () => "";
          Object.defineProperty(l, "id", {
            get: () => {
              m(true);
              const l = new Error();
              throw ((l.name = ""), l);
            },
          });
        }
        O.setTimeout(O.console.debug, 0, l);
        O.setTimeout(() => {
          m(false);
        });
      });
      return nm(M).then((m) => ({ s: 0, v: m === undefined || m }));
    },
    NW(m, "sis"),
  );
}
async function eo({ urlHashing: m }) {
  const W = (function (m) {
    const r = [];
    let P = m;
    for (;;) {
      try {
        const m = P.location?.href,
          N = P.document?.referrer;
        if (m === undefined || N === undefined) {
          return { s: 1, v: r };
        }
        r.push({ l: m, f: N });
        const t = P.parent;
        if (!t || t === P) {
          return { s: 0, v: r };
        }
        P = t;
      } catch (TO) {
        if (gt(TO)) {
          return { s: 1, v: r };
        }
        throw TO;
      }
    }
  })(window);
  return { ...W, v: await Tt(W.v, m) };
}
function zo({ message: m, code: W, ...l }) {
  const r = new V(m, W);
  Object.assign(r, l);
  return r;
}
function Fo(m, W) {
  if (W === "") {
    return [m, []];
  }
  const l = m.split(W);
  return [l[0], l.length > 1 ? l.slice(1) : []];
}
async function bo(m, W, l = 50) {
  var N;
  for (; !document.body;) {
    await ED(l);
  }
  const o = document.createElement("iframe");
  try {
    for (
      await new Promise((m, l) => {
        let r = false;
        const P = () => {
          r = true;
          m();
        };
        o.onload = P;
        o.onerror = (m) => {
          r = true;
          l(m);
        };
        const { style: N } = o;
        N.setProperty("display", "block", "important");
        N.position = "absolute";
        N.top = "0";
        N.left = "0";
        N.visibility = "hidden";
        if (W && ("srcdoc" in o)) {
          o.srcdoc = W;
        } else {
          o.src = "about:blank";
        }
        document.body.appendChild(o);
        const a = () => {
          if (!r) {
            if (o.contentWindow?.document?.readyState === "complete") {
              P();
            } else {
              setTimeout(a, 10);
            }
          }
        };
        a();
      });
      !o.contentWindow?.document?.body;
    ) {
      await ED(l);
    }
    return await m(o, o.contentWindow);
  } finally {
    if (!((N = o.parentNode) == null)) {
      N.removeChild(o);
    }
  }
}
const no = sD(QW, -1),
  Yo = YO(YD, (m) => {
    if (m === -1 || m === -2 || m === -3) {
      return { s: m, v: null };
    }
    return { s: 0, v: m };
  }),
  Ao = YO(ms, (m) => ({ s: 0, v: m.map((m) => m ?? -1) })),
  Zo = sD(vW, -1),
  ko = uN(RW),
  xo = sD(EW, -1),
  Co = sD(KW, -1),
  To = YO(BP, (m) => ({ s: 0, v: m.map((m) => m ?? -1) })),
  qo = sD(UW, -1),
  Go = uN(JW),
  co = uN(hW),
  Bo = uN($W),
  Io = uN(jW),
  Qo = sD(pW, -1),
  vo = sD(gW, -1),
  Ro = sD(_W, -1),
  Eo = YO(
    () => Nr(),
    (m) => {
      const { geometry: W, text: l } = m,
        r = W === "unsupported" ? -1 : W === "unstable" ? -2 : 0;
      return { s: r, v: { ...m, geometry: r === 0 ? ul(W) : "", text: r === 0 ? ul(l) : "" } };
    },
  ),
  Ko = uN(iW),
  Uo = uN(ml),
  Jo = uN(Wl),
  ho = uN(ll),
  $o = sD(rl, -1),
  jo = sD(Pl, -1),
  po = sD(Nl, -1),
  go = sD(tl, -1),
  _o = sD(ol, -1),
  io = sD(al, -1),
  ma = sD(Ol, -1),
  Wa = sD(fl, -1),
  la = YO(dl, (m) => ({
    s: 0,
    v: ul(
      Object.keys(m)
        .map((W) => `${W}=${m[W]}`)
        .join(","),
    ),
  })),
  ra = sD(Dl, -1),
  Pa = uN(sl),
  Na = sD(yl, -1),
  ta = YO(Hl, (m) => {
    if (m === -1 || m === -2 || m === -3) {
      return { s: m, v: null };
    }
    return { s: 0, v: m };
  }),
  oa = tD(wl),
  aa = YO(Vl, (m) => {
    if (typeof m == "number") {
      return { s: m, v: null };
    }
    const l = ["32926", "32928"],
      r = m.parameters.map((m) => {
        const [W, r, P] = m.split("=", 3);
        return P !== undefined || l.includes(r) ? `${W}(${r})=null` : `${W}=${r}`;
      }),
      P = m.extensionParameters.map((m) => {
        const [W, l, r] = m.split("=", 3);
        return r !== undefined && l !== "34047" ? `${W}(${l})=${r}` : `${W}=${l}`;
      });
    return {
      s: 0,
      v: {
        contextAttributes: ul(m.contextAttributes.join("&")),
        parameters: ul(r.join("&")),
        parameters2: ul(m.parameters.join("&")),
        shaderPrecisions: ul(m.shaderPrecisions.join("&")),
        extensions: ul(m.extensions?.join(",") || ""),
        extensionParameters: ul(P.join(",")),
        extensionParameters2: ul(m.extensionParameters.join("&")),
        unsupportedExtensions: m.unsupportedExtensions,
      },
    };
  }),
  Oa = tD(Xl),
  fa = yO(Dt),
  da = yO(st),
  Da = yO(yt),
  sa = yO(St),
  ya = yO(Xt),
  Ha = yO(wt),
  Xa = yO(Vt),
  wa = yO(Lt),
  Va = yO(Mt),
  Ma = yO(ut),
  ua = yO(et),
  Sa = yO(zt),
  La = yO(Ht),
  ea = yO(Ft),
  za = uN(gl),
  Fa = uN(Jt),
  ba = uN(rm),
  na = uN(Cm),
  Ya = uN(am),
  Aa = uN(vl),
  Za = uN(Zm),
  ka = uN(bf),
  xa = uN(xr);
var Ca = Yr(
  [
    3452176135, 2121212106, 1168961439, 3216050702, 302018735, 45330093, 3215350851, 1544181419,
    1386803176, 2661353486, 269372581, 48689061, 3148155917, 370894255, 1437581217, 2531810306,
    202261480, 1336192160, 3202765389, 269372581, 48689061, 2829847050, 320488888, 48664806,
    2745831692, 387662767, 2112398251,
  ],
  6,
);
function qa() {
  return vl();
}
var Ga = Yr(
  [
    4092288861, 610672049, 1189767122, 268372292, 1158969800, 763646975, 1257244740, 1410559644,
    2124158391, 364726281, 155464083, 1841566975, 100619779, 1258631382, 1069746366, 1258227274,
    1075081939, 2040272311, 179522079, 138706648, 1855736560, 1253531151, 138705372, 2140949232,
    45894151, 1091449027, 1775829179, 1174305092, 1729263830, 1757481661, 884359442, 1091200197,
    2039696368, 178734857, 1628599252, 2027684542, 988827656,
  ],
  6,
);
const ca = [
  "--hydra-450",
  "--super-color",
  "--super-bg-color",
  "--border-dynamic",
  "--size-md",
  "--banner-height",
];
function Ba(m) {
  return parseFloat(m);
}
const va = ["monospace", "sans-serif", "serif"],
  Ra = [
    "sans-serif-thin",
    "ARNO PRO",
    "Agency FB",
    "Arabic Typesetting",
    "Arial Unicode MS",
    "AvantGarde Bk BT",
    "BankGothic Md BT",
    "Batang",
    "Bitstream Vera Sans Mono",
    "Calibri",
    "Century",
    "Century Gothic",
    "Clarendon",
    "EUROSTILE",
    "Franklin Gothic",
    "Futura Bk BT",
    "Futura Md BT",
    "GOTHAM",
    "Gill Sans",
    "HELV",
    "Haettenschweiler",
    "Helvetica Neue",
    "Humanst521 BT",
    "Leelawadee",
    "Letter Gothic",
    "Levenim MT",
    "Lucida Bright",
    "Lucida Sans",
    "Menlo",
    "MS Mincho",
    "MS Outlook",
    "MS Reference Specialty",
    "MS UI Gothic",
    "MT Extra",
    "MYRIAD PRO",
    "Marlett",
    "Meiryo UI",
    "Microsoft Uighur",
    "Minion Pro",
    "Monotype Corsiva",
    "PMingLiU",
    "Pristina",
    "SCRIPTINA",
    "Segoe UI Light",
    "Serifa",
    "SimHei",
    "Small Fonts",
    "Staccato222 BT",
    "TRAJAN PRO",
    "Univers CE 55 Medium",
    "Vrinda",
    "ZWAdobeF",
  ];
function Ea() {
  return (
    "permissions" in navigator &&
    NW(navigator, "permissions") &&
    typeof navigator.permissions.query === "function"
  );
}
function Ka(m, W) {
  return new Promise((l, r) => {
    let P = false;
    if (!(W == null)) {
      W.then(
        () => (P = true),
        () => (P = true),
      );
    }
    (typeof m == "function" ? Ka(Promise.resolve(), W).then(m) : m).then(
      (m) => {
        if (!P) {
          l(m);
        }
      },
      (m) => {
        if (!P) {
          r(m);
        }
      },
    );
  });
}
const Ja = {
  default: [],
  apple: [{ font: "-apple-system-body" }],
  serif: [{ fontFamily: "serif" }],
  sans: [{ fontFamily: "sans-serif" }],
  mono: [{ fontFamily: "monospace" }],
  min: [{ fontSize: "1px" }],
  system: [{ fontFamily: "system-ui" }],
};
function ha() {
  const m = [],
    W = Object.getOwnPropertyNames(window);
  for (let l = 0; l < W.length; l++) {
    const r = W[l],
      P = pl(r);
    if ((lf.has(P) && m.push(r), P === 4191585516)) {
      const r = W[l + 1] || "";
      m.push(r);
    }
  }
  return { s: 0, v: m };
}
async function $a() {
  if (!("getBattery" in navigator) || !(typeof navigator.getBattery === "function")) {
    return { s: -1, v: null };
  }
  try {
    const W = await navigator.getBattery();
    return {
      s: 0,
      v: {
        c: W.charging,
        l: W.level,
        ct: Xo(NW(W, "chargingTime")),
        dt: Xo(NW(W, "dischargingTime")),
      },
    };
  } catch (LO) {
    if (rO(LO)) {
      return { s: -101, v: null };
    }
    if (LO instanceof Error && LO.name === "NotAllowedError") {
      return { s: -2, v: null };
    }
    throw LO;
  }
}
function ja(m) {
  const W = new Error(m);
  W.name = m;
  return W;
}
var pa = Yr([463754065, 1795937577, 2079814302, 3125799950, 1207895673, 3276369590], 5);
function ga(m) {
  return `${m}lr`;
}
function _a(m) {
  if (m && typeof m == "object") {
    return m;
  }
  if (m != null) {
    return { tag: m };
  }
  return undefined;
}
async function ia() {
  try {
    const m = new FontFace("font", "local('Arial')");
    await m.load();
    return { s: 0, v: true };
  } catch (yO) {
    return { s: 0, v: false };
  }
}
function lO(m, W) {
  let t = 0,
    o = 0,
    a = "";
  for (; t < m.length;) {
    o = Fr(W[t & 15], 4, 7);
    a += m.slice(t, t + o);
    a += "/";
    t += o;
  }
  return a.slice(0, -1);
}
function rO(m) {
  return (
    (m instanceof DOMException || m instanceof TypeError) &&
    (mr.test(m.message) ||
      lr.test(m.message) ||
      Wr.test(m.message) ||
      rr.test(m.message) ||
      Pr.test(m.message))
  );
}
function PO() {
  return typeof CompressionStream != "undefined";
}
function NO(m) {
  return {
    byteArray: () => vD(m),
    blob: () => new Blob([vD(m)]),
    base64: () => m,
    toJSON: () => m,
    toString: () => m,
    [Symbol.toPrimitive](W) {
      if (W === "number") {
        throw new TypeError("Cannot convert BinaryOutput to a number");
      }
      return m;
    },
  };
}
function tO(m) {
  return E(m)
    ? (function (m) {
        if (m.length === 0) {
          throw Lm();
        }
        return m[Math.floor(Cr() * m.length)];
      })(m)
    : (function (m) {
        const W = Cr();
        let l = 0,
          r = 0;
        for (const [, W] of m) {
          l += W;
        }
        for (const [P, N] of m) {
          if (W >= r / l && W < (r + N) / l) {
            return P;
          }
          r += N;
        }
        throw Lm();
      })(Object.entries(m));
}
const OO = [
  "brands",
  "mobile",
  "platform",
  "platformVersion",
  "architecture",
  "bitness",
  "model",
  "uaFullVersion",
  "fullVersionList",
];
function fO(m) {
  const W = [...(m.modules || []), bD()];
  if (!m.dlr) {
    W.push(zl());
  }
  return W;
}
function dO() {
  const l = new Map();
  for (let r = 0; r < HD.length; r++) {
    l.set(HD[r], r);
  }
  return l;
}
function DO() {
  return (function (m, W) {
    const l = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(m), W);
    if (!l || !l.get) {
      return { s: -1, v: null };
    }
    const r = window.Function,
      P = window.Object;
    let N = false;
    try {
      N = delete window.Function && delete window.Object;
    } catch (sO) {
      N = false;
    }
    if (!N) {
      t();
      return { s: -2, v: null };
    }
    try {
      l.get.toString();
      return { s: 0, v: false };
    } catch (QO) {
      return { s: 0, v: true };
    } finally {
      t();
    }
    function t() {
      try {
        window.Function = r;
        window.Object = P;
      } catch (KO) {}
    }
  })(navigator, "hardwareConcurrency");
}
function sO(m, W, ...l) {
  const N = () => (document.hidden ? o() : t()),
    { start: t, stop: o } = (function (m, W, l, ...r) {
      let P,
        N = false,
        t = m,
        o = 0;
      const a = () => {
          if (!(N || P)) {
            o = Date.now();
            P = OD(() => {
              N = true;
              l(...r);
            }, t);
          }
        },
        O = () => {
          if (!N && P) {
            P();
            P = undefined;
            t -= Date.now() - o;
          }
        };
      if (W) {
        a();
      }
      return { start: a, stop: O };
    })(W, !document.hidden, () => {
      document.removeEventListener("visibilitychange", N);
      m(...l);
    });
  document.addEventListener("visibilitychange", N);
  return () => {
    document.removeEventListener("visibilitychange", N);
    o();
  };
}
function yO(m) {
  const W = (m) => ({ s: 0, v: m }),
    l = (m) => {
      if (!(m instanceof UN)) {
        throw m;
      }
      const { state: W } = m;
      if (typeof W != "number") {
        throw new Error(
          `Unexpected non-numeric error state ${JSON.stringify(W)}. Error message: ${m.message}`,
        );
      }
      return { s: W, v: null };
    };
  return () => {
    try {
      const r = m();
      if (F(r)) {
        return r.then(W, l);
      }
      return { s: 0, v: r };
    } catch (UO) {
      return l(UO);
    }
  };
}
var HO = Yr(
  [
    1642514889, 448644821, 76850679, 1132704436, 345289455, 1137359792, 42513331, 260681633,
    1134422775, 1373430950, 1133569273, 331660783, 1138549936, 46459639, 1539613602, 76850679,
    914600628, 9613223, 1099147959, 264680892, 13021882, 261333237, 244298422, 1137370299,
    1133226678, 1137374959, 1133226658, 479983343, 180665849, 613852080, 362131373, 629254332,
    1132966580, 345289455, 1137359792, 75606011, 1019523771,
  ],
  4,
);
function XO(m) {
  return m instanceof ArrayBuffer
    ? new Uint8Array(m)
    : new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
}
function wO() {
  return { len: 0, arr: new Uint8Array(128) };
}
function VO(m, W) {
  return new Promise((l) => setTimeout(l, m, W));
}
function MO(m, W) {
  const r = pP(m);
  if (W) {
    iO(W, r);
  }
}
function uO() {
  return document.createElement("canvas").getContext("webgpu");
}
var SO = UP(
  [
    [
      290799128, 256122120, 104421910, 67116302, 755371265, 505093152, 152897830, 504707661,
      470222364, 504898635, 1531393810, 35461445, 285283613, 151395398, 386279171, 454440300,
      1259148302, 67715140, 117915663, 1445400833, 70599515, 280581, 270008841, 369435995,
      272236574, 119803980, 704973062, 135268614, 184563807, 1026755337, 824180753, 521019142,
      404440330, 1310525212, 689393240, 992889883, 118162967, 75079, 371069214, 14400, 67440946,
      336725549, 100928582, 419697754, 37884160, 822483751, 151655985, 440867606, 34934535,
      1544297499, 69023765, 1530421525, 521022789, 352788490, 152182535, 1095068179, 168111383,
      102371362, 1379942426, 218301962, 410405200, 674697750, 150995736, 1460669954, 289295192,
      422585355, 276197185, 1241580055, 503401029, 169544981, 956309037, 1628772625, 269702473,
      1481182751, 12887, 860704273, 607786827, 1079856400, 370150428, 234881091, 407897606,
      354309752, 1157892134, 252333381, 1264080656, 304025857, 1627786793, 302143352, 172563473,
      34688007, 17172047, 337261841, 285893380, 117845831, 1448695310, 152569103, 1095068178,
      68628788, 120395278, 352653340, 1245924639, 288361223, 2951185, 3425555,
    ],
  ],
  [Hm],
  [1],
);
function LO(m, W = "__fpsac__") {
  return {
    set: (l, r) => {
      window[m].setItem(mf(l, W), JSON.stringify(r));
    },
    get: (l) => {
      const r = window[m].getItem(mf(l, W));
      if (!r) {
        return;
      }
      let P;
      try {
        P = JSON.parse(r);
      } catch (BO) {
        return;
      }
      if (
        !(function (m) {
          if (!dW(m)) {
            return false;
          }
          const { body: W, expiresAt: l } = m;
          return (
            dW(W) &&
            (W.sealed_result === null || typeof W.sealed_result == "string") &&
            typeof l == "number" &&
            Number.isFinite(l)
          );
        })(P)
      ) {
        return;
      }
      const N = P.body.sealed_result;
      return typeof N == "string" ? ((P.body.sealed_result = NO(N)), P) : P;
    },
    remove: (l) => {
      window[m].removeItem(mf(l, W));
    },
  };
}
var eO = Yr(
  [
    426709007, 538360605, 1061327092, 2504422367, 2506716645, 2996653695, 2147303221, 900895052,
    1816456767, 2067512534, 2269477586, 3731450601, 3218807419, 882327350, 1152571167,
  ],
  7,
);
async function FO(m, W) {
  const H = m.createSession();
  try {
    const m = new Promise((m, D) => {
        let X,
          w = false;
        const V = () => {
            w = true;
            if (X !== undefined) {
              window.clearTimeout(X);
            }
            H.removeEventListener("message", M);
          },
          M = (l) => {
            if (!w)
              if (l.message.byteLength === 2) {
                H.update(W).catch((m) => {
                  V();
                  D(m);
                });
              } else {
                V();
                const W = new Uint8Array(l.message);
                m(W);
              }
          };
        H.addEventListener("message", M);
        X = window.setTimeout(() => {
          if (!w) {
            V();
          }
        }, 5e3);
      }),
      y = vD(
        "AAAARHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAACQIARIBMRoNd2lkZXZpbmVfdGVzdCIKMjAxNV90ZWFycyoCU0Q=",
      );
    await H.generateRequest("cenc", y);
    return await m;
  } finally {
    try {
      await H.close();
    } catch (rO) {}
  }
}
function bO(m, W) {
  return LD(m, W ? It : Bt, 3, 9);
}
function nO(m, W) {
  for (const l of W.split(";")) {
    const W = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(l);
    if (W) {
      const [, l, r, , P] = W;
      m.setProperty(l, r, P || "");
    }
  }
}
function YO(m, W) {
  const l = (m) =>
    GW(m)
      ? W(m)
      : () => {
          const l = m();
          return bN(l) ? l.then(W) : W(l);
        };
  return (W) => {
    const r = m(W);
    return bN(r) ? r.then(l) : l(r);
  };
}
function AO() {
  return [
    "br.gov.meugovbr",
    "co.visualsupply.cam",
    "com.airbnb.app",
    "com.alipay.iphoneclient",
    "com.apple.MobileSMS",
    "com.apple.Preferences",
    "com.apple.ScreenshotServicesService",
    "com.apple.mediaanalysisd",
    "com.apple.mobilephone",
    "com.atebits.Tweetie2",
    "com.badoo.Badoo",
    "com.burbn.barcelona",
    "com.burbn.instagram",
    "com.canva.canvaeditor",
    "com.cardify.tinder",
    "com.einnovation.temu",
    "com.facebook.Facebook",
    "com.facebook.Messenger",
    "com.google.Drive",
    "com.google.Gmail",
    "com.google.GoogleMobile",
    "com.google.Maps.WatchKitApp",
    "com.google.Translate",
    "com.google.chrome.ios",
    "com.google.ios.youtube",
    "com.google.photos",
    "com.grabtaxi.iphone",
    "com.grubhub.search",
    "com.hammerandchisel.discord",
    "com.iwilab.KakaoTalk",
    "com.lemon.lvoverseas",
    "com.linkedin.LinkedIn",
    "com.microsoft.skype.teams",
    "com.moxco.bumble",
    "com.openai.chat",
    "com.reddit.Reddit",
    "com.revolut.revolut",
    "com.ss.iphone.ugc.Ame",
    "com.ss.iphone.ugc.Aweme",
    "com.strava.stravaride",
    "com.tencent.xin",
    "com.tenten.app",
    "com.tinyspeck.chatlyio",
    "com.toyopagroup.picaboo",
    "com.ubercab.UberEats",
    "com.viber",
    "com.vk.vkclient",
    "com.woltapp.wolt",
    "com.zhiliaoapp.musically",
    "doordash.DoorDashConsumer",
    "ee.mtakso.client",
    "jp.naver.line",
    "net.whatsapp.WhatsApp",
    "net.whatsapp.WhatsAppSMB",
    "org.whispersystems.signal",
    "ph.telegra.Telegraph",
    "pinterest",
    "ru.yandex.ytaxi",
    "tv.twitch",
  ];
}
async function kO() {
  const o = await xt(),
    a = await JN();
  if (o === a) {
    return o;
  }
  if (o === "granted" || a === "granted") {
    return "granted";
  }
  if (o === "denied" || a === "denied") {
    return "denied";
  }
  return "prompt";
}
function xO(m = "default.ini") {
  const P = function (m, W) {
    return m + W;
  };
  const [y] = m.split("/").slice(-1);
  try {
    const H = new window.File([], m),
      X = new window.URL(
        P(
          "filesystem:///" + (NW(H, "webkitRelativePath") || "") + "" + y + "?#",
          NW(H, "lastModified"),
        ) + "",
      );
    if (X.hash?.substring(1) === "") {
      return { n: y, l: -2 };
    }
    return { n: y, l: pl(X.hash?.substring(1)) };
  } catch (gO) {
    return { n: y, l: -1 };
  }
}
function CO(m) {
  const W = wO(),
    l = new WeakSet(),
    r = (m) => {
      if (typeof m == "string") {
        const l = m.replace(
          VP,
          (m) => `\\${XP[m] || `u${m.charCodeAt(0).toString(16).padStart(4, "0")}`}`,
        );
        Vr(W, 34);
        WN(W, ud(l));
        return void Vr(W, 34);
      }
      if (typeof m == "number" || m === true || m === false) {
        if (Number.isNaN(m) || m === Infinity || m === -1 / 0) {
          m = null;
        }
        return void WN(W, ud(String(m)));
      }
      if (typeof m == "object" && m) {
        if (l.has(m)) {
          throw new TypeError("Recursive input");
        }
        l.add(m);
        const { toJSON: P } = m;
        if (typeof P == "function") {
          return void r(P.call(m));
        }
        if (m instanceof Number || m instanceof String) {
          return void r(m.valueOf());
        }
        let N = true;
        const t = () => {
          if (N) {
            N = false;
          } else {
            Vr(W, 44);
          }
        };
        if (Array.isArray(m)) {
          Vr(W, 91);
          for (const W of m) {
            t();
            r(W);
          }
          Vr(W, 93);
        } else {
          Vr(W, 123);
          for (const [l, P] of Object.entries(m)) {
            if (!oD(P)) {
              t();
              r(l);
              Vr(W, 58);
              r(P);
            }
          }
          Vr(W, 125);
        }
        return void l.delete(m);
      }
      WN(W, sP);
    };
  r(m);
  return jP(W);
}
function TO() {
  return { s: 0, v: Boolean(window.isSecureContext) };
}
function qO(m) {
  return SD(m, Vf);
}
async function GO() {
  if (vl() || Zm()) {
    return false;
  }
  let O = false;
  if (Pm()) {
    const m = {
        type: "media-source",
        audio: { contentType: 'audio/mp4; codecs="mp4a.40.2"' },
        video: {
          contentType: 'video/mp4; codecs="avc1.42E01E"',
          bitrate: 10000,
          framerate: 30,
          height: 480,
          width: 640,
        },
        keySystemConfiguration: {
          keySystem: "com.widevine.alpha",
          video: { robustness: "SW_SECURE_CRYPTO" },
        },
      },
      W = await navigator.mediaCapabilities.decodingInfo(m);
    O = ro(W, "keySystemAccess") && W.keySystemAccess;
  }
  return (O && !("brave" in navigator)) || !rm();
}
async function cO() {
  const P = navigator.gpu;
  if (!P) {
    return { s: -3, v: null };
  }
  let N = null;
  try {
    N = await P.requestAdapter();
  } catch (AO) {
    if (AO instanceof Error && vl()) {
      return { s: -3, v: AO.message };
    }
    throw AO;
  }
  if (N) {
    return { s: 0, v: N };
  }
  return { s: -4, v: null };
}
var BO = Yr(
  [
    102480310, 1640088542, 149133546, 430221188, 595961743, 249819080, 330540676, 1306767749,
    347057352, 11773082, 78620302, 94676879, 1136324552, 246789771, 329428387, 262450831, 368828830,
    480556696, 226746822, 1306763653, 44339400, 363377055, 330532499, 1021555077,
  ],
  4,
);
function IO(m) {
  return Object.getOwnPropertyNames(m);
}
function QO(m) {
  const W = m;
  return !!W.collectCallId && typeof W.collectCallId == "string";
}
function RO(m, W, l, r = Infinity, P) {
  return Dr(m, W, l, il, { maxAttemptCount: r, backoffBase: 200, backoffCap: 1e4, abort: P });
}
var EO = Yr(
  [
    3085740714, 2511804784, 2508286740, 3248175964, 3234739538, 2613995782, 2510186834, 3570287196,
    3670176799, 3634264601, 3280631299, 3598739806, 3599330057, 2613993492, 3666049618, 3263389790,
    3532549124, 3598739806, 3599330057, 3939393556, 3700374364, 2511811922, 3700325383, 3636555033,
    3233971714, 3683596099, 3701372949, 2613993493, 3500045906, 2581556830, 3599332627, 3465114114,
    2512405586, 2613996800, 3633265451, 3549247261, 2575923999, 3666176768, 3666177301, 2512403221,
    2575398419, 3582164241, 3566024469, 3298786323, 2512405586, 2613995798, 3633265451, 3347920669,
    2575922432, 3313858582, 3465377024, 2512405586, 3733486653, 3465105937, 2512403203, 4237196327,
    3533794585, 4237127700, 2510250005, 3835771740, 3733486653, 3465105937, 2512403203, 3265100802,
    4204292629, 3599072533, 3835001915, 3533203977, 3566163997, 2510252565, 3532274524, 3315166481,
    3682814229, 2509601305, 3649649500, 3348458259, 2592635908, 3733486621, 2512403217, 3733486621,
    3347929617, 3682958097, 3531959577, 2512403203, 3633282068, 3498209300, 3632953145, 3570283858,
    3233969183, 3247013145, 2575922969, 3751572753, 2512403217, 3733486621, 3634312209, 3532614405,
    2509714770, 3280107027, 3818419989, 2508810505, 3264035658, 2558750740, 2362992925, 3548609104,
    2325707285, 3347135276, 2210560068, 3957208896, 2609986386, 3633265419, 3649662238, 3348450564,
    2513845013, 3532156934, 3347133983, 3570147908, 3565780255, 2511348739, 2257547025, 4074646878,
    3953731648, 2512403282, 3315101714, 2508811537, 2279352394, 2512398656, 3666701078, 3280825109,
    2228632341, 3754833216, 3750457365, 2211855108, 2512398664, 3280498695, 2178300696, 2609981764,
    3634248459, 3282005010, 3298786334, 3838714706, 4072621607, 4072557619, 4005452335, 2510507296,
    3704501517, 3468648469, 3666439427, 3532618289, 2613996035, 3600710482, 2614000646, 3582159698,
    3650644485, 2510252565, 3770628956, 4104735279, 3903408933, 3887418163, 2613990948, 3297339986,
    3649269763, 3533463588, 3972020995, 3314116946, 3282006019, 2593683221, 3532615708, 2508810782,
    2509714733, 3280303897, 3600316468, 3533463588, 3973462787, 3649665618, 2612083475, 3550050386,
    3601823257, 3733878784, 3734532124, 2379115029, 3570295339, 3533207327, 3468193054, 2379119616,
    3550050386, 3670242841, 3570871552, 3565780255, 2511348739, 3604506909, 2581343582, 2513323330,
    3935388685,
  ],
  4,
);
const KO = [
  ["wv", (m) => TD(false, m)],
  ["wvp", () => TD(true)],
  ["pr", () => G(["com.microsoft.playready", "com.youtube.playready"])],
  ["ck", () => G(["webkit-org.w3.clearkey", "org.w3.clearkey"])],
  ["pt", () => G(["com.adobe.primetime", "com.adobe.access"])],
  ["fp", () => G(["com.apple.fairplay"])],
];
function UO(m, ...W) {
  m.postMessage(W);
}
function JO(m) {
  return m.ewr ? uo(m, 80) : Promise.resolve(() => ({ s: Zf, v: null }));
}
function hO(m) {
  const t = Object.getOwnPropertyDescriptor(m, "length");
  if (t && t.writable) {
    return true;
  }
  for (let W = 0; W < m.length; W++) {
    const r = Object.getOwnPropertyDescriptor(m, W);
    if (r && (r.writable || r.configurable)) {
      return true;
    }
  }
  return false;
}
function jO(m) {
  const r = m.tag ?? null,
    P = m.linkedId ?? null;
  return { tag: r, linkedId: P, toKey: () => `${JSON.stringify(r)}__${JSON.stringify(P)}` };
}
function pO() {
  if (typeof window.SharedArrayBuffer != "function") {
    return { s: -2, v: null };
  }
  const m = new window.SharedArrayBuffer(1);
  if (m.byteLength === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: m.byteLength };
}
async function gO() {
  const N = navigator.keyboard;
  if (!N || typeof N.getLayoutMap !== "function") {
    return { s: -1, v: null };
  }
  let t;
  try {
    t = await N.getLayoutMap();
  } catch (fO) {
    if (rO(fO)) {
      return { s: -101, v: null };
    }
    if (_P(fO)) {
      return { s: -2, v: null };
    }
    throw fO;
  }
  return { s: 0, v: Array.from(t.entries()) };
}
var _O = Yr(
  [
    2577284927, 3250767258, 3908827068, 3992976880, 3065769205, 4075469765, 4160224748, 3098918121,
    3976194795, 4160486872, 3098918126, 3942381038, 4109170175, 4223382200, 4292143598, 3049062388,
    4109955768, 4194036985, 3300715004, 3099767495, 4226349805, 3049059580, 4092509377, 3170037242,
    4026513589, 3455449083, 4142857719, 4055676603, 4076795903, 3166092266, 4043304184, 4093433590,
    3169776121, 3301164996,
  ],
  3,
);
function iO(m, W) {
  cm(W, m, 365);
  Id(W, m);
}
function mf(m, W) {
  return `${W}__${m}`;
}
const lf = new Set([
  4106781067, 3209949814, 2612078219, 2382064880, 3225112721, 1018714844, 2899793226, 2094258580,
  3169460974, 3079760821, 392195965, 3461410589, 3582327722, 1731918890, 1767246934, 3419607467,
  1110225616, 1455947556, 450291099, 176445009, 1998723369, 2961538051, 3413933903, 2299562828,
  3945560591, 485550147, 3336694844, 3737152292, 2669437517, 3860417393, 4191585516,
]);
function rf(m) {
  return { s: 0, v: m };
}
function Pf(m, W) {
  if (typeof W === "string") {
    return W;
  }
  let l = m;
  for (; l;) {
    const m = Object.getOwnPropertyNames(l);
    for (let l = 0; l < m.length; l++) {
      const r = m[l];
      if (pl(r) === W) {
        return r;
      }
    }
    l = Object.getPrototypeOf(l);
  }
  return "";
}
function tf() {
  return { s: 0, v: "serviceWorker" in Navigator.prototype };
}
function af() {
  if (typeof window.matchMedia != "function") {
    return { s: -2, v: null };
  }
  const m = window.matchMedia(
    "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
  );
  if (m.matches === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: m.matches };
}
var Of = Yr([2723538402, 345782709, 3194136822, 1590072184, 4124343528], 5);
function ff(m) {
  let W = "";
  for (let m = 128512; m <= 128591; m++) {
    const l = String.fromCodePoint(m);
    W += l;
  }
  return BD((m, l) => {
    const r = l.document.createElement("span");
    r.style.whiteSpace = "nowrap";
    r.innerText = W;
    l.document.body.append(r);
    const P = EP(r, l);
    l.document.body.removeChild(r);
    return { s: 0, v: P };
  }, m.sis);
}
function sf(m, W) {
  const l = zm(m);
  let r = l.origin + l.path;
  if (r && !r.endsWith("/")) {
    r += "/";
  }
  r += W;
  l.origin = "";
  l.path = r;
  return $m(l);
}
function yf(m) {
  const W = {};
  new Set(m).forEach((m) => {
    const l = (function (m) {
        if (!URL.prototype) {
          return m;
        }
        try {
          return new URL(m, window.location.origin).toString();
        } catch (DO) {
          return m;
        }
      })(m),
      r = performance.getEntriesByName(l, "resource");
    W[m] = r;
  });
  return W;
}
async function Hf() {
  if (uP()) {
    return [-1, NaN];
  }
  const o = new Uint8Array([0]),
    a = [{ initDataTypes: ["webm"], audioCapabilities: [{ contentType: "audio/mp4" }] }],
    O = await navigator.requestMediaKeySystemAccess("org.w3.clearkey", a),
    f = await O.createMediaKeys();
  let d = await gm(f, o);
  const D = d < 10;
  if (D) {
    const m = jD(10, 2500) - d - 1;
    for (let W = 0; W < m; W++) {
      Ed(f, o);
    }
    d = await gm(f, o);
  }
  return [D ? 1 : 0, d];
}
async function Xf(m) {
  return BD((m, W) => {
    if (!vl()) {
      return { s: -1, v: null };
    }
    const l = W.document.createElement("input");
    l.type = "radio";
    W.document.body.appendChild(l);
    const r = W.getComputedStyle(l).getPropertyValue("font-family");
    W.document.body.removeChild(l);
    return { s: 0, v: r };
  }, m.sis);
}
function Vf(m) {
  const W = (m) => (m ? m.replace(/([,\\])/g, "\\$1") : ""),
    l = m
      .map((m) =>
        [
          W(m?.voiceURI),
          W(m?.name),
          W(m?.lang),
          m?.localService ? "1" : "0",
          m?.default ? "1" : "0",
        ].join(","),
      )
      .sort();
  return { s: m.length ? 0 : 1, v: ul(JSON.stringify(l)) };
}
function uf(m) {
  return "" + { us: "use1", eu: "euc1", ap: "aps1" }[m] + "-turn.fpjs.io";
}
var Sf = Yr(
  [
    1628208763, 3688670562, 460704692, 3623462910, 3229552825, 2866655154, 4271847705, 480694458,
    4154558325, 1996996246, 2532835030, 3615360702, 2933504690, 3045537623, 278450616, 2847527785,
    962193863, 3668552145, 3728168945, 2865147902, 3017107483, 1340719273, 2881474873, 962180758,
    3887051755, 3396011454, 2949754798, 3017238832, 1474795177, 2342515017, 1476898513, 3518345930,
    3396469160, 3919116722, 3083304450, 563724466, 3199858008, 1964673222, 3233331659, 2272598690,
    2783050224, 2882172190, 129626549, 4160673652, 1964279958, 2494542795, 3296593832, 3096755880,
    3184016154, 636210613, 2561589374, 2115741147, 3685918918, 2302215845, 2850588670, 3183503638,
    327471535, 2276376701, 828090856, 3599204493, 3380024488, 2698492606, 4073146153, 395831537,
    4222143093, 1846799317, 3719282635, 4182186916, 2548606910, 3151460887, 464443822, 2851919471,
    1912650449, 3904879063, 2402621335, 3151398784, 3117841927, 697811125, 4160654457, 1897374870,
    2528100288, 3615381479, 2294723758, 4274028314, 129930999, 4193290103, 2014357725, 3720327876,
    3228505263, 2764483001, 4270405895, 111466680, 4160668030, 1947838614, 3684219350, 3330153381,
    2782638760, 3213309783, 27972009, 2948456830, 2048755925, 3636376267, 3934198666, 3117530554,
    3213309783, 280550327, 3048393304, 1912711377, 3700208330, 3494845358, 2784081326, 2173134865,
  ],
  7,
);
function zf() {
  try {
    throw "a";
  } catch (eO) {
    try {
      eO.toSource();
      return { s: 0, v: true };
    } catch (iO) {
      return { s: 0, v: false };
    }
  }
}
function bf() {
  return (
    SW([
      !("PushManager" in window),
      !("AudioBuffer" in window),
      !("RTCPeerConnection" in window),
      !("geolocation" in navigator),
      !("ServiceWorker" in window),
    ]) >= 3
  );
}
async function nf() {
  const { userAgentData: W } = navigator;
  if (!W || typeof W != "object") {
    return { s: -1, v: null };
  }
  const l = {},
    r = [];
  if (typeof W.getHighEntropyValues == "function") {
    await Promise.all(
      OO.map(async (m) => {
        try {
          const r = (await W.getHighEntropyValues([m]))[m];
          if (r !== undefined) {
            l[m] = typeof r == "string" ? r : JSON.stringify(r);
          }
        } catch (GO) {
          if (!(GO instanceof Error && GO.name === "NotAllowedError")) {
            throw GO;
          }
          r.push(m);
        }
      }),
    );
  }
  return {
    s: 0,
    v: {
      b: W.brands.map((m) => ({ b: m.brand, v: m.version })),
      m: W.mobile,
      p: W.platform ?? null,
      h: l,
      nah: r,
    },
  };
}
function Yf(m, W = {}, l) {
  if (!(l != null)) {
    l = [TP()];
  }
  return W[m] ?? (W[m] = navigator.requestMediaKeySystemAccess(m, l));
}
const Zf = -10;
async function kf(m, W) {
  var l;
  let r, P, N;
  try {
    r = W().then(
      (m) => (P = [true, m]),
      (m) => (P = [false, m]),
    );
  } catch (XO) {
    P = [false, XO];
  }
  const t = m.then(
    (m) => (N = [true, m]),
    (m) => (N = [false, m]),
  );
  try {
    await Promise.race([r, t]);
  } finally {
    if (!((l = m.cancel) == null)) {
      l.call(m);
    }
  }
  return () => {
    if (P) {
      if (P[0]) {
        return P[1];
      }
      throw P[1];
    }
    if (N) {
      if (N[0]) {
        return N[1];
      }
      throw N[1];
    }
    throw new Error("96375");
  };
}
var xf = UP(
  [
    [
      1158230590, 352328197, 922751784, 234887733, 1045777409, 235013451, 1077693209, 86185296,
      321396490, 462366, 488115742, 1213075980, 4402479, 184943903, 188551425, 1398147351,
      268897603, 491523647, 306988571, 1261376568, 269223502, 570890009, 34866732, 470426899,
      403966778, 253756433, 304419089, 491347009, 508233756, 403654977, 421396492, 1329803025,
      184551506, 1057755406, 136120322, 118163754, 373378420, 453843998, 1159464460, 319444544,
      855642889, 402851378, 1191248155, 151015493, 219352090, 67375366, 17696018, 1263095066,
      420348421, 21908811, 168961297, 171640095, 14413,
    ],
  ],
  [
    function () {
      const m = new Image().style;
      return BW(
        [Pf((W = m), "strokeColor"), Pf(W, "glyphOrientationVertical")],
        [
          5, 23, 47, 9, 35, 9, 44, 7, 37, 41, 19, 25, 32, 26, 30, 32, 8, 31, 12, 15, 40, 18, 15, 20,
          9, 4, 2, 13, 21, 17, 18, 34, 40, 2, 48,
        ],
      );
      var W;
    },
  ],
  [2],
);
function qf(m) {
  return matchMedia(`(forced-colors: ${m})`).matches;
}
async function Gf() {
  const W = NW(window, "webkitRequestFileSystem");
  if (W) {
    return new Promise((l) => {
      W(
        0,
        1,
        () => l(true),
        () => l(false),
      );
    });
  }
}
function cf(m, ...W) {
  for (const l of W) {
    if (typeof l == "string") {
      if (Er(m, l)) {
        return true;
      }
    } else {
      if (Vd(m, (m) => l.test(m)) != null) {
        return true;
      }
    }
  }
  return false;
}
function If(m) {
  const a = pP(m);
  let [O, f] = lD(a);
  O = gf(O);
  f = gf(f);
  if (O !== undefined && f !== undefined) {
    return { s: 0, v: O || f };
  }
  if (O !== undefined) {
    return { s: 1, v: O };
  }
  if (f !== undefined) {
    return { s: 2, v: f };
  }
  return { s: -1, v: null };
}
var Qf = UP(
  [
    [
      89472536, 67911963, 202988290, 386077465, 1866537770, 1224742518, 488243476, 419627011,
      184819487, 437598027, 340225859, 172033032, 437716482, 471155211, 1095068177, 1092107040,
      419499526, 423762697, 100665116, 490210839, 1194790674, 673115, 85280006, 1510540548, 2756129,
      939992591, 1246643516, 1108281098, 52370449, 641031181, 822350097, 201595136, 1447512348,
      1107565334, 605101077, 923815180, 201460231, 369557787, 421401919, 370608902, 386208007,
      1158809130, 67652933, 420829977, 1325996060, 705104933, 100734005, 18485518, 1079117841,
      520555597, 117716299, 441132557, 117836552, 454886414, 1079380231, 235285315, 167851373,
      438045445, 354104902, 218503945, 1450723136, 1261309460, 853525, 339100932, 1443038736,
      103498560, 3566862, 1175192861, 252709131, 16777237, 1984516105, 1829509143, 185926151,
      436356353, 185073670, 1779174662, 991969605, 50610456, 1275666182, 419565839, 202771726,
      1124408096, 135546735, 168313092, 253563142, 135813653, 822480166, 72178038, 222758157,
      52298251, 454823449, 56244746, 1427123716, 67914571, 353589766, 51775754, 625419022,
      219166498, 1258491144, 521093188, 151601409, 456523793, 678234648, 169481234, 118557701,
      391005526, 241568771, 422784012, 438716682, 1309089280, 806492, 990010373, 638390299,
      134885451, 1481180934, 17176407, 655231834, 2049314574, 84410418, 220531716, 167778574,
      105923661, 106502459, 185600556, 170279180, 1046087172, 151977997, 35061763, 1263338788,
      84282176, 52366156, 1544356616, 420816433, 50605842, 1229146882, 1511529224, 186319630,
      4664589, 35268139, 100748290, 1379942427, 1174536207, 322636309, 208471067, 373756952, 7684,
      1481509910, 69665358, 440083533, 1174866696, 403505177, 1129127711, 956961098, 571674714,
      285606663, 67257606, 151460637, 725827670, 862785030, 168106503, 289803037, 203297033,
      1197361671, 1327110967, 169477163, 84548876, 1840656, 1325404447, 537919532, 1158350651,
      118114894, 454640143, 269026054, 471146315, 372321280, 1196229131, 421140297, 17891399,
      256321038, 167983925, 135074069, 1379942427, 1174536207, 523897886, 187303186, 16788313,
      1007685120, 1447054106, 1193610767, 121055758, 235738112, 118572573, 1091181577, 956569372,
      1632457991, 1191843846, 387122178, 420174362, 755830297, 929124171, 222888474, 50727960,
      118447621, 1229986830, 202905462, 51517293, 1159661069, 219156518, 1296957445, 772541034,
      285869946, 471598093, 437591628, 102564608, 341211207, 72035854, 453396244, 286989059,
      252909895, 100927823, 207059041, 440798984, 347163, 218169348, 389222492, 3416153, 1128989210,
      404424777, 102242906, 1193875213, 338048784, 17827353, 1077939469, 33558354, 973080134,
      923734551, 118361931, 390678349, 407312666, 756351505, 606227719, 1078676741, 1275397643,
      369236248, 102176796, 152328767, 505090338, 1195966464, 68884054, 402849858, 604117287,
      387586598, 184555596, 52366851, 290079565, 39467274, 337061379, 1044450054, 822546697,
      1309087752, 202009165, 100891182, 1259996933, 521093188, 51986689, 390009692, 187041819,
      1296385283, 1528366088, 1539, 1194856717, 20458516, 188762957, 374080774, 100861208,
      604249353, 906778884, 134487574, 1444022019, 51205721, 688201243, 275581722, 638910490,
      553654793, 438246915, 1191185666, 68310648, 100862061, 1157897218, 203233559, 1296957442,
      1829962602, 35198010, 17122832, 1079118092, 101515597, 370942795, 117714965, 54019863,
      889585674, 1079385113, 386672195, 236790637, 420024595, 406539288, 689707789, 956765442,
      1198474037, 1091441944, 102564636, 119409668, 205263381, 108670990, 151781382, 1313753605,
      457245696, 855645709, 391058950, 235019008, 471534109, 474699863, 756351517, 540018203,
      272974679, 51463965, 386470914, 67506497, 1297423660, 1224806753, 520230941, 878058775,
      289625664, 571801658, 289411104, 88480259, 1641997, 388317194, 1477786881, 50998065,
      521022728, 202398474, 33949981, 1095115776, 1582986863, 239750725, 289150477, 469830174,
      14416,
    ],
  ],
  [Hm],
  [2],
);
function vf() {
  return rm() || Cm();
}
function Rf(m, W, l, r, P, N) {
  var t;
  const o = [];
  for (const W of m) {
    const m = W.event;
    if (m.e !== l && m.e !== r && m.e !== P) {
      continue;
    }
    if (m.stage !== N) {
      continue;
    }
    (o[(t = m.tryNumber)] || (o[t] = {}))[m.e] = W;
  }
  return o
    .map((m) => {
      const d = m[l]?.timestamp,
        D = m[r]?.timestamp ?? m[P]?.timestamp,
        s = m[l]?.event.url,
        y = m[P]?.event.error;
      return d && D && s ? _D(s, d, D, y, W[s]) : null;
    })
    .filter((m) => Boolean(m));
}
function Kf(m) {
  let W;
  try {
    if (m && typeof m == "object" && "message" in m) {
      W = String(m.message);
      if ("name" in m) {
        W = `${m.name}: ${W}`;
      }
    } else {
      W = String(m);
    }
  } catch (EO) {
    W = `Code 3017: ${EO}`;
  }
  return nl(W, 500);
}
function Uf() {
  if (typeof CSS == "undefined") {
    return { s: -1, v: null };
  }
  return { s: 0, v: CSS.supports("backdrop-filter", "blur(2px)") };
}
var Jf = UP(
  [
    [
      37637135, 1447917654, 1074862848, 221320987, 185417728, 1279479069, 287641348, 1585126709,
      277761, 1427768864, 1124076042, 2035529, 455018507, 23675461, 120393521, 1444036433,
      1141263183, 303105822, 319645969, 1275726848, 36457547, 388709920, 101924677, 1077349638,
      303367169, 135938595, 1112349448, 153357637, 121505586, 1480802129, 1141246529, 839976462,
      805901, 167780891, 1160643090, 438979704, 100941378, 1381385537, 33619995, 505875729,
      119147817, 153229835, 20323964, 453520970, 1308901389, 134224668, 324158218, 140184588,
      136785483, 455937847, 1145648204, 1494293834, 320544012, 1971969, 319380746, 359333889,
      104340027, 1544500554, 1141003010, 1209157132, 67441480, 1511480093, 104666369, 1328827942,
      1075133262, 152198427, 149830, 1477446935, 1427587336, 1194921745, 1547195181, 353853786,
      470698257, 1510890510, 1159481353, 521949703, 526588437, 192026238, 239739657, 442307401,
      256466199, 1481069662, 1091916807, 191889498, 175708721, 1578723163, 1142444571, 403526171,
      474109016, 436863826, 1513165895, 1227047982, 1410678607, 1310151680, 1326799388, 156435474,
      491723532, 153230682, 91688828, 286089482, 471550231, 1511481182, 945321480, 218765652,
      526583891, 1131496748, 1561928206, 1498942025, 241044293, 373446478, 340072261, 510001485,
      1114971518, 789340426, 1464415314, 121639178, 474109261, 339869763, 510074189, 1131496749,
      1561862926, 1482164809, 241043525, 373445966, 1430675269, 981021962, 289151081, 206126103,
      1314788169, 308153156, 524440649, 373424195, 493296973, 1131496750, 1562058766, 290982473,
      974735686, 324366422, 140184588, 1466392143, 1131765368, 286482698, 1325800471, 394831,
      169369099, 54987290, 657872206, 120986675, 1565553235, 1209411907, 253564417, 1280836866,
      470686025, 237312859, 522912050, 201357853, 1141003025, 1511147020, 386751269, 1310132765,
      292225025, 270091815, 865110, 1465648906, 67108874, 184644125, 1192692237, 309397319,
      1601199207, 404362525, 1330912518, 34669650, 1212173143, 1113211225, 1316896855, 104596079,
      39597315, 1195772422, 1364869959, 1430658377, 184767552, 1513967123, 321592373, 1510961754,
      218960155, 420305921, 1258684700, 1108743697, 506609673, 1547125293, 1478042203, 1494042381,
      1327128087, 1225806877, 387334407, 191907615, 108599857, 101923614, 291246082, 1381515331,
      1447304521, 1514364485, 1348950091, 1165318776, 1145925391, 391666511, 1465401923, 1413749065,
      1497586757, 1348951883, 1081432952, 1129147407, 374889295, 1364738371, 1346640201, 1531141957,
      1549950795, 1378683704, 100689750, 151848977, 420305920, 474366537, 1073758992, 140973855,
      1579227002, 219771980, 1499072079, 391076631, 390618884, 475275347, 337911369, 489691709,
      454256461, 1207961623, 6036480, 1329684253, 1510738463, 1010648577, 791688480, 1565554302,
      1431968600, 236390922, 1477205770, 1258697756, 359674705, 2890289, 1326676557, 1393764638,
      1225000704, 625476693, 167839243, 1328283662, 75056996, 121710658, 1276451417, 319888927,
      386887006, 1176443398, 661342039, 372705078, 1543910474, 1465139282, 357826574, 487414111,
      186456605, 1529830456, 1282104626, 101128728, 1142492674, 122947073, 370019595, 559220289,
      661996366, 322568504, 437138263, 22894923, 1427576601, 1725955, 1907229, 523115079, 388700960,
      67910512, 1432095759, 139985219, 487414091, 469762058, 443565827, 293290614, 16209,
      1326529286, 822482699, 151870732, 1275724032, 238767179, 456461092, 1480802125, 1426131009,
      441995264, 152915527, 167780869, 1165052930, 389480762, 1447896833, 1074862848, 69211931,
      387799325, 1279479052, 70125060, 388696895, 1447917639, 1075187217, 236586839, 1229602839,
      993994827, 322112307, 658250785, 285621072, 1968588097, 874523178, 657942583, 657137952,
      1265183017, 571878774, 656737658, 56118071, 336660254, 1195642624, 436608286, 523123202,
      388700960, 390297089, 1427442705, 202711306, 386744597, 1276396363, 556535562, 388825661,
      1448835153, 1393888269, 1124073738, 105513240, 437127707, 153234434, 489367856, 1480796758,
      1427181121, 85596973, 268918562, 386802457, 1161763592, 3820664, 286604102, 1443954741,
      39214669, 285820951, 135933196, 1161366273, 171461752, 1480796497, 1965894465, 824910122,
      540507936, 723659301, 1265187369, 654911862, 302460769, 1377901318, 1125192974, 725421897,
      1008740640, 1164397610, 1059916595, 286337602, 1326791431, 1297487624, 286088775, 458048331,
      388629257, 293290614, 16209, 1140930566, 69667613, 507776785, 504765259, 1165052930,
      389285664, 419442256, 56118035, 251731212, 1464995601, 223167252, 321198856, 595280502,
      758325110, 1915829052, 606223904, 642384199, 825638694, 1158167604, 455756920, 1480802137,
      1899308097, 540090416, 1195642657, 167840283, 102439938, 1585126695, 390275448, 1393888271,
      337122105, 1045565184, 1113342297, 1266171991, 1584021604, 1447888658, 1159005711, 1532363296,
      282183, 1112349960, 138353989, 34999078, 121856001, 1141245463, 1294536525, 151473735,
      439229702, 254283539, 104270649, 1447917648, 1443954709, 106323533, 271276288, 662811,
      523123219, 388700960, 390297089, 1427442705, 203108618, 17189896, 17563948, 1161366275,
      511382904, 402929730, 1146508097, 85659905, 407527168, 185421125, 891619072, 389873713,
      117443153, 56118032, 822089500, 151870732, 1275724032, 37243979, 472919072, 454237511,
      223746326, 319881805, 135938563, 185336072, 157893189, 1585125691, 353582593, 56118036,
      1125129226, 1707849, 402849818, 37633794, 386537254, 1447917655, 1912866830, 67113755,
      273285447, 504234503, 1160710935, 490359928, 19080019, 1393626885, 339090747, 386747139,
      139281227, 337772558, 1349864508, 419639120, 223747338, 117510221, 1192904707, 251809093,
      506998551, 1585122618, 556866817, 1812203566, 1125193216, 540675913, 1112353576, 87956805,
      321592373, 1447917658, 1076889111, 857805595, 1195642665, 17367296, 359219781, 388767537,
      270544464, 1140857090, 119159581, 3477258,
    ],
    [
      386942744, 1229409564, 135333655, 220795160, 755369005, 1162041120, 503777537, 1079123715,
      101517389, 52050726, 1427192580, 236473163, 17109769, 173424715, 371009796, 1292251441,
      203046987, 50927385, 503982872, 1446053403, 2376539, 169555715, 117837325, 355405073,
      438900482, 405154853, 1145049870, 34409291, 436733206, 2017924890, 638784598, 973210372,
      286198279, 134625543, 1778647041, 1009795397, 268569364, 290080074, 202965528, 507332635,
      134354452, 152965423, 402923329, 102564125, 236739842, 706150459, 290790203, 240978695,
      52177998, 454823436, 1197226506, 251672392, 419431940, 285429263, 286416394, 290006535,
      454303788, 1090915598, 354048009, 1091132175, 356080479, 1362842883, 236919825, 1209617177,
      1075316761, 1093555476, 337803338, 1427785501, 1461339656, 1327303942, 2047102737, 571952141,
      1411208983, 1326531854, 1276973337, 957501722, 745215771, 457971551, 407048258, 1413810758,
      189744919, 1549274479, 1208835629, 122683732, 290717969, 1259620628, 638538288, 504780064,
      289608031, 404029529, 1326585167, 1276018207, 1460741645, 67916804, 1511283736, 5195038,
      273234948, 18622334, 507904847, 352344385, 1426083608, 1329023043, 947075610, 202117450,
      224136543, 1162101260, 1076894017, 225976393, 122166853, 524816962, 356848732, 759700802,
      1934427230, 839535692, 39204446, 173872912, 827003996, 778964035, 457907295, 1396720145,
      1175783745, 475925317, 240979582, 341646696, 1346527045, 877014553, 34144849, 994774908,
      138743678, 457380169, 375002446, 172294213, 223881039, 1179478043, 1108677450, 1146689345,
      924407616, 357832018, 155268902, 1497649743, 1094734404, 220025925, 438702086, 70325591,
      1643545, 408686104, 873550429, 472322827, 1550150419, 16787279, 34278407, 1180648471,
      637797448, 705626696, 68491267, 202001233, 153046535, 1929861143, 640029993, 1109330433,
      340264718, 221009951, 287179034, 392108605, 33756966, 84029457, 1074532368, 341187916,
      1850366843, 185875050, 105454599, 253041247, 1598032221, 1531017813, 1582329169, 520750428,
      38280011, 172363532, 1397193033, 1599825007, 201611598, 1293566492, 152902925, 1513770251,
      1228544271, 386943257, 1528448786, 1477775372, 271666946, 1530556186, 1142562583, 337331719,
      1090600968, 2015169296, 974674202, 89939485, 4923146, 505091400, 2018055445, 1735348549,
      1363894105, 1447319620, 1480607296, 1381915715, 1364935032, 1364940655, 1564958533,
      1482178904, 1447053120, 1951357028, 1430470776, 1598381646, 1532780110, 1111776323,
      1113088073, 1112109901, 1346787403, 1409356039, 504713500, 1259350291, 386693676, 273026379,
      1577274897, 121837076, 1479285852, 473648920, 390531163, 55525907, 105650965, 460533334,
      104543053, 118166278, 51401991, 102436100, 894245895, 1766327564, 1560547859, 790446857,
      822095617, 1632649257, 544018770, 218371856, 1594628871, 1241852697, 390673753, 318898225,
      1543849261, 420228884, 1090781211, 558652764, 655163434, 1325931325, 508117330, 525344259,
      520690773, 85014549, 84018010, 1126112264, 878009691, 135922955, 1259218440, 425033074,
      491261958, 134813266, 220011032, 1211127597, 1534153233, 487532364, 270076938, 306978074,
      439238914, 980298315, 677136966, 218171141, 16778500, 1951154752, 1996624386, 202705923,
      437853723, 336330837, 756226304, 606995002, 374278681, 189012548, 386466882, 387778316,
      474766640, 72698209, 520751643, 118564625, 824054024, 788928801, 1158290237, 18434638,
      85723410, 1581910529, 50410823, 206135566, 119147077, 270153991, 1313754636, 101132047,
      1297688929, 135073796, 355993372, 437918484, 1450723095, 103155988, 169542172, 1465403663,
      353242630, 103158868, 1500917265, 1026695245, 404360509, 973741573, 822219547, 390290262,
      1009987360, 909389373, 623721020, 1682123578, 67903563, 824389676, 1078217532, 436798749,
      1197361674, 354289187, 521285926, 236526109, 173431126, 353177886, 771897901, 352983332,
      1242711104, 706153743, 387711750, 1431205399, 84157967, 1226512898, 391600150, 404031771,
      218106372, 463655, 1162482194, 67700042, 201393710, 20649781, 472001799, 1293750808,
      118966599, 286787601, 506267706, 376860481, 469959197, 169290252, 1293748502, 738480196,
      1866662918, 1027487047, 607402026, 691414576, 220997944, 2019637031, 926361687, 68033578,
      473498121, 1192693518, 790779512, 892871434, 1229409572, 603983891, 68944909, 755120940,
      1263341619, 470555456, 424820800, 34144769, 341211207, 50603539, 236599298, 287706393,
      391663133, 319831107, 1297053222, 201657107, 487396891, 1245924636, 438372881, 1467564803,
      206261002, 18488836, 625886550, 807019577, 638652732, 758393632, 792740939, 808860735,
      1982210107, 705844568, 1162154527, 606742093, 757868074, 1783451184, 808257051, 53943568,
      1313479195, 206441271, 387124483, 337319170, 1011697446, 1196966233, 1162304324, 1298094684,
      1632580729, 51255864, 1380653101, 152833856, 1581915406, 402663239, 120202771, 407720773,
      285678367, 1076433227, 252062531, 456402476, 17498899, 67241733, 1245924639, 53545988,
      39931221, 438965010, 454105369, 201932032, 205132824, 376860481, 469959197, 17640204,
      184618269, 990256173, 1628639760, 88411209, 403573006, 155930199, 739118874, 694227212,
      117787993, 805699599, 168304137, 370358301, 1130059303, 922943536, 118365952, 1259412253,
      69162560, 755641148, 136131120, 1145772055, 504699968, 521797641, 303512068, 424111939,
      1196236296, 352784457, 1314410014, 1091380740, 168261231, 520359188, 353973005, 222041630,
      1450723078, 909312026, 169674243, 5654345, 67961882, 1261175836, 439837007, 488644127,
      503778831, 439157540, 637539342, 625171286, 437131532, 1447512327, 17498374, 1682118685,
      842400075, 1075120659, 50678596, 371142940, 1229982465, 874984310, 705102862, 1225657094,
      740710232, 1296969773, 555096682, 102565685, 1246054939, 221512470, 540872219, 1431860777,
      402861320, 424494405, 285213966, 137697306, 102578176, 152771889, 3489800,
    ],
  ],
  [
    function () {
      return (function (m, W) {
        const l = m.connection;
        return BW(
          [
            Pf(W, "onorientationchange"),
            Tm(m, "contacts", "QjslADtOBipACA") || Tm(l, "ontypechange", "Tjo/DSpIETFCCQ"),
          ],
          [
            20, 1, 24, 23, 23, 21, 14, 8, 11, 8, 6, 13, 1, 1, 12, 4, 9, 10, 6, 2, 1, 2, 0, 1, 2, 1,
            1,
          ],
        );
      })(navigator, document.createElement("frameset"));
    },
    Hm,
  ],
  [1, 1],
);
function hf(m) {
  return new Promise((W, l) => {
    m(W, l).then(() => l(new Error("Action didn't call `resolve` or `reject`")), l);
  });
}
function gf(m) {
  return m && m.length <= 1e3 ? m : undefined;
}
const Wd = new RegExp(
  Yr(
    [
      865597172, 819291933, 1162251996, 3803533715, 1156907896, 528002739, 4205401008, 1133067128,
      1010149879, 2776700811, 1844920372,
    ],
    6,
  )(0),
);
function ld(m, W, l) {
  const r = ud(W());
  try {
    return Yt(
      (function (m, W, l) {
        const r = XO(m),
          P = new ArrayBuffer(r.length - l),
          N = new Uint8Array(P);
        for (let m = 0; m < r.length; ++m) {
          N[m] = r[m] ^ W[m % W.length];
        }
        return P;
      })(new Uint32Array(m), r, l),
    );
  } catch (FO) {
    if (Or(FO) && FO.name === "SyntaxError") {
      return null;
    }
    throw FO;
  }
}
async function rd(m, W, l) {
  const a = aW(m, W, l),
    { s: O, v: f } = mo(a, true);
  if (O !== 0) {
    return O;
  }
  const d = fN(f, W);
  try {
    const { s: m, v: W } = await d.createDataChannelAndOffer();
    return m !== 0 ? m : (await f.setLocalDescription(W), 0);
  } finally {
    d.closeConnectionWhenTurnEnds();
  }
}
function Pd(m) {
  if (m[1] === null) {
    return m[2];
  }
  const W = new Error(m[2]);
  W.name = m[1];
  W.stack = m[3];
  return W;
}
function Nd(m, W, l, r) {
  const { body: P, getCallDebugger: N, stage: t, pollingContainer: o } = m;
  return LN(
    N,
    () => ({ e: 18, stage: t, tryNumber: l, url: W }),
    ({ status: m, getHeader: W, body: r }) => {
      let P = r;
      try {
        P = Yt(r);
      } catch (aO) {}
      return { e: 19, stage: t, tryNumber: l, status: m, retryAfter: W("retry-after"), body: P };
    },
    (m) => ({ e: 20, stage: t, tryNumber: l, error: m }),
    () =>
      (async function ({ body: m, ...W }) {
        const [l, r] = At(m) ? await b(m) : [false, m];
        return { ...(await ZD({ ...W, body: bO(r, l), responseFormat: "binary" })) };
      })({
        url: W,
        method: "post",
        headers: { "Content-Type": "text/plain" },
        body: P,
        withCredentials: true,
        abort: r,
        container: o,
      }),
  );
}
var td = Yr(
  [
    1168920910, 812244275, 1267103231, 3189017411, 1473450498, 2320697017, 1141356568, 234838493,
    4049045849, 1469798731, 2588101617, 1560316161, 497556122, 3193426706, 445406726, 2719091889,
  ],
  5,
);
function od({ cache: m }) {
  const W = rD(m);
  if (W) {
    (function (m) {
      m.clearColor(0, 0, 1, 1);
      const W = m.createProgram();
      if (!W) {
        return;
      }
      function l(l, r) {
        const P = m.createShader(35633 - l);
        if (W && P) {
          m.shaderSource(P, r);
          m.compileShader(P);
          m.attachShader(W, P);
        }
      }
      l(
        0,
        "attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}",
      );
      l(1, "void main(){gl_FragColor=vec4(1,0,0,1);}");
      m.linkProgram(W);
      m.useProgram(W);
      m.enableVertexAttribArray(0);
      const r = m.getUniformLocation(W, "t"),
        P = m.createBuffer();
      m.bindBuffer(34962, P);
      m.bufferData(34962, new Float32Array([0, 1, -1, -1, 1, -1]), 35044);
      m.vertexAttribPointer(0, 2, 5126, false, 0, 0);
      m.clear(16384);
      m.uniform1f(r, 3.65);
      m.drawArrays(4, 0, 3);
    })(W);
    return { s: 0, v: ul(W.canvas.toDataURL()) };
  }
  return { s: -1, v: null };
}
const ad = new Set([2882888216, 2306836488, 1040191956, 1447924955]);
function Od() {
  return { s: 0, v: !(!navigator.userAgentData || typeof navigator.userAgentData != "object") };
}
var fd = Yr([1684980417, 3234352095, 251477960, 279356862, 2733271037, 783485863, 971681449], 6);
function dd() {
  return (
    ("MediaKeys" in window || "WebKitMediaKeys" in window || "MSMediaKeys" in window) &&
    "requestMediaKeySystemAccess" in navigator
  );
}
var Dd = Yr(
  [
    2653511773, 3134415755, 4047027337, 820627705, 4158442923, 3237184020, 3952745469, 3862219727,
    818655740, 4041798545, 3220683041, 3417329904, 2416639715, 821543118, 4089637265, 3405363490,
    4189860605, 2435242990, 399688699, 3321544836, 3972968965, 4277939446, 2232604157, 819254222,
    2229194384, 3638470938, 4236838124, 2318925564, 97975262, 4190960770, 3297292850, 3269547400,
    2651491278, 49735662, 3656962443, 4193248801, 3820697076, 3173842904, 746907790, 4024627612,
    4275144454, 4137035007, 2654258411, 1220853202, 2342967450, 3133843020, 3751031432, 2433142977,
    99533452, 2245055361, 3336805413, 3585746395, 2953966800, 278383758, 3303865531, 3738232109,
    3370135258, 3072430020, 198430167, 3485371128, 3637872149, 4038527173, 4164024269, 663610827,
    3638809268, 3270681878, 3919317391, 2773674161, 552516497, 3569479420, 4277789461, 3901162692,
    2652106993, 150985430, 3387920293, 3673785365, 3483964881, 3843484336, 183033475, 3488478691,
    3941395282, 4186985951, 2151343868, 972209657, 3619543524, 3405355776, 3437372125, 2315355347,
    634309878, 4190618347, 3336476680, 3434489739, 2438710746, 215142398, 3587833752, 3313668148,
    3739899613, 3055283450, 142999e3, 4123296760, 3959397143, 3952679878, 3038439112, 551022317,
    4258057618, 3704981282, 3502187742, 2841045971, 1351211744, 3504074162, 4241931783, 3504746726,
    2152959723, 385075421, 3921998493, 3101536791, 3572186103, 3825830092, 802602719, 4025472134,
    2985527856, 3684370319, 2835935428, 117039093, 2247131808, 3169432661, 3568840686, 3810979838,
    1519321048, 3924281829, 2734482982, 2291470558, 3878874598, 852291304, 3939402396, 3805275688,
    3941019273, 2420961521, 719059449, 4038118306, 3942489420, 4110156020, 2654463152, 836160200,
    4274780327, 3973350145, 3447857877, 2840719553, 1540277492, 4141413603, 3220411910, 4024836326,
    2756765904, 882356680, 4026061226, 3755128624, 2359304329, 2874472682, 310765534, 3368518590,
    4225629186, 2510705033, 2199122125, 819127689, 2398192290, 3403718988, 3652932846, 3947414744,
    251058890, 2229785255, 3755975469, 3400158445, 3830549488, 752091025, 3536967316, 3253383733,
    3968412874, 2771512226, 1456327405, 3452602793, 3168182048, 2293572759, 2702236614, 1372565724,
    4194303135, 3756825940, 4054132110, 2268389368, 720158157, 3638199173, 2732499218, 4239798253,
    2152519873, 584438761, 3319713977, 3990789172, 4221643993, 3758216432, 653378040, 3904626084,
    3874403924, 3433765779, 3090847695, 1518658538, 3841911458, 3336145440, 2365072836, 3188512494,
    365362922, 4142587068, 3285297964, 3617459415, 2499856068, 332647928, 2313935781, 4209743639,
    4025101765, 3139760345, 1535494909, 3333526923, 3639181915, 3634565271, 2671438019, 117108446,
    4226219197, 4002277138, 3918992624, 2318725823, 317708515, 3921346473, 3733501191, 3517518731,
    2852242877, 736935421, 2413814673, 4040812304, 2191656902, 2803225064, 768583423, 4157005440,
    3251615281, 2273445324, 2420215979, 400420040, 3522034102, 3939804709, 3468430748, 2987777449,
    31319507, 2427183039, 3973492801, 3548844509, 2785860068, 1100000206, 3489324990, 2883564546,
    3751821712, 3188386045, 399107807, 4255880945, 3690697250, 3651740148, 2451758011, 1425918203,
    3452277174, 3673013563, 3283703247, 3791706826, 1423227368, 4257807234, 3371401760, 4153486062,
    3073233883, 970450312, 3740917899, 3990652174, 3735631355, 2653484490, 767871184, 3870917509,
    3938686260, 4019195077, 4049530297, 115321750, 3786135997,
  ],
  5,
);
function yd(m, W) {
  return "turn:" + RN(W ? "" + m + ":" + W + "" : m, { transport: "tcp" }) + "";
}
function Hd(m, W, l, r) {
  const P = Object.keys(m).filter(
      (m) =>
        !(function (m, W) {
          for (let l = 0, r = m.length; l < r; ++l) {
            if (m[l] === W) {
              return true;
            }
          }
          return false;
        })(l, m),
    ),
    N = ND(
      em(
        P,
        (l) =>
          (function (m, W) {
            const l = ND(
              new Promise((l) => {
                const r = Date.now();
                ht(m.bind(null, W), (...m) => {
                  const W = Date.now() - r;
                  if (!m[0]) {
                    return l(() => ({ error: m[1], duration: W }));
                  }
                  const P = m[1];
                  if (GW(P)) {
                    return l(() => ({ value: P, duration: W }));
                  }
                  l(
                    () =>
                      new Promise((m) => {
                        const l = Date.now();
                        ht(P, (...r) => {
                          const P = W + Date.now() - l;
                          if (!r[0]) {
                            return m({ error: r[1], duration: P });
                          }
                          m({ value: r[1], duration: P });
                        });
                      }),
                  );
                });
              }),
            );
            return function () {
              return l.then((m) => m());
            };
          })(m[l], W),
        r,
      ),
    );
  return async function () {
    const m = await N,
      W = await em(m, (m) => ND(m()), r),
      l = await Promise.all(W),
      t = {};
    for (let m = 0; m < P.length; ++m) {
      t[P[m]] = l[m];
    }
    return t;
  };
}
var Xd = Yr(
  [
    1366508869, 2826119371, 128594945, 874483252, 3208582822, 82410833, 956804920, 2826133481,
    1537752338, 688126577, 3815856619, 497164883, 1732635513, 4083172082, 1140744769, 1901718369,
    4251079651, 1408919876, 1633610622, 3949217509, 480801113, 2085872418, 4083565560, 1258258243,
    1665267814, 4083630334, 1525375050, 2018763377, 2524142315,
  ],
  3,
);
function wd(m) {
  return ct(m, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
}
function Vd(m, W) {
  if ("find" in m) {
    return m.find(W);
  }
  for (let l = 0; l < m.length; l++) {
    if (W(m[l], l, m)) {
      return m[l];
    }
  }
}
function Md(m, W, l) {
  const r = m.getShaderPrecisionFormat(m[W], m[l]);
  return r ? [r.rangeMin, r.rangeMax, r.precision] : [];
}
function ud(m) {
  const W = new Uint8Array(m.length);
  for (let l = 0; l < m.length; l++) {
    const r = m.charCodeAt(l);
    if (r > 127) {
      return new TextEncoder().encode(m);
    }
    W[l] = r;
  }
  return W;
}
var Sd = Yr(
  [
    513200334, 3422481445, 2115632544, 3317276110, 2839571868, 2563616402, 3536736631, 2006762473,
    3918368083, 1093394316, 3622425294, 2219933076, 2508384220, 2525711484, 1003586239, 2811397443,
    1231063539, 2196233353, 2370272911, 3750554070, 3420002101, 1003586274, 3146227270, 2017170132,
  ],
  7,
);
function ed(m) {
  return typeof m == "number" ? (m === 0 ? null : Math.round(m)) : null;
}
var zd = Yr(
  [
    3030302396, 972475544, 3566715808, 2564866388, 3990110611, 3380450238, 1251518965, 3349346249,
    4004807293, 3436730523, 3578629801, 1353886186, 2242051533, 4277587792, 3129744306, 4097939361,
    1283634429, 2676555218, 3220620628, 2882426527, 2182468744, 1838067189, 2209931461, 3201942859,
    3571013764, 3529281453, 467332843, 3031759309, 2348600912, 3906295428, 2182468799, 2072948213,
    2678650569, 2632697687, 4058139539, 3531510434, 461814263, 2543958668, 2732713025, 4224275607,
    3327170713, 2073804535, 2477457109, 2848510795, 3905513860, 3461388969, 1083670781, 3568889295,
    2918547989, 4141448590, 3276839853, 1268365515, 3031039937, 2852046412, 4260383364, 3494946494,
    1470079229, 2410534085, 4008498518, 4190968794, 3445138868, 1569956072, 2192899572, 3221082700,
    3419561126, 3311245220, 1484955626, 3673095623, 3036269851, 3905771685, 3544945568, 1787079112,
    2477324744, 2917987147, 3028442257, 3629685742, 1268365515, 3031039937, 2852046412, 4260383364,
    3243353534, 1787079164, 2477521364, 2713357339, 3975365015, 3344467107, 1100191997, 2478763476,
    3204313162, 4240527781, 3563750569, 462662649, 2543958668, 2784425281, 4124202640, 3328148366,
    1770372861, 2661280453, 3204301912, 4290858405, 2182468777, 1821289973, 2578117070, 3118124363,
    3938803600, 3294076814, 1787929329, 3567903433, 2918547989, 4157893262, 3311310782, 1603320282,
    2676943557, 2733753431, 3804850833, 2182468777, 1821943285, 2578117070, 3118124363, 3938803600,
    3546255491, 1438103805, 2611150793, 4008496732, 4056751066, 3477972386, 1553051114, 2427121122,
    2866270812, 3972352656, 3343948429, 1469293046, 3571497684, 2598420820, 4258548627, 3326915764,
    1250208254, 2616112258, 3118127192, 3938803600, 3309543327, 1423237306, 2476400833, 3036533835,
    3939782071, 3561788581, 366264317, 2393765250, 3102393711, 3991028115, 3529281706, 1485094617,
    2226703321, 4009608272, 4190968794, 3562520500, 1302707965, 2779381697, 2851914065, 4124015236,
    3310852540, 461748470, 2543958668, 3103189313, 3975367571, 4082930093, 1553116656, 2225983186,
    2700788048, 3028437651, 3629685742, 1452975067, 2193152466, 2716910424, 3956561811, 3441154798,
    1454748921, 3082745804, 2952385613, 4140127390, 3561010360, 1554431997, 2611858386, 4009610313,
    4190968794, 3445011892, 1552071144, 2646538231, 3120026206, 4157893254, 3311310782, 1552721355,
    2616112258, 2749093976, 3973400987, 3596074921, 1301786615, 2242049993, 2615854441, 4291513241,
    3494681022, 1423237306, 2576343233, 3102593108, 3939462803, 3477836199, 1353039085, 3566534106,
    2918547989, 4124015246, 3310191548, 1384424399, 2208557767, 3069309769, 3028443283, 3629685742,
    1234936795, 2712267989, 2884883030, 3906295428, 3309543327, 467332802, 3048536525, 3119041878,
    4160183426, 3529416126, 1250343415, 2998861296, 2734542160, 4140781701, 3441154798, 1354020089,
    2223766734, 3219707222, 3956626854, 3561722778, 1286911229, 2225733318, 4004807242, 3419953307,
    3242957240, 1286908415, 2225733318, 2331437386, 4123482244, 4081948841, 1553051116, 2616112258,
    3100366936, 4290857881, 3326915753, 1250208254, 2476406505, 3036533835, 4290858405, 2182468777,
    1787735541, 2545874900, 2848769374, 3939847566, 3463480745, 1587003102, 2191719885, 2885276778,
    3129744275, 4081162145, 1485087724, 2476277191, 3203257409, 4142484115, 3561722778, 1302705405,
    3567910849, 3216673892, 4140387202, 2182468779, 1352377844, 3571641300, 2834924053, 4258548119,
    3461404862, 366257150, 2544433538, 3204305993, 4156970943, 3546059490, 1235205883, 2560881108,
    2914683931, 3973077138, 3463480489, 1574478846, 2510679749, 4004807260, 3904986519, 3914044344,
    395946742, 2542463945, 2918894677, 4242625173, 3310192301, 467332842, 2542463945, 2918894677,
    4242625173, 3310192301, 467332842, 2579426021, 2952364107, 3956497557, 2153683109, 1234812648,
    2411260613, 4004807193, 3313637836,
  ],
  5,
);
const Fd = [
  "maxTextureDimension1D",
  "maxTextureDimension2D",
  "maxTextureDimension3D",
  "maxTextureArrayLayers",
  "maxBindGroups",
  "maxBindingsPerBindGroup",
  "maxDynamicUniformBuffersPerPipelineLayout",
  "maxDynamicStorageBuffersPerPipelineLayout",
  "maxSampledTexturesPerShaderStage",
  "maxSamplersPerShaderStage",
  "maxStorageBuffersPerShaderStage",
  "maxStorageTexturesPerShaderStage",
  "maxUniformBuffersPerShaderStage",
  "maxUniformBufferBindingSize",
  "maxStorageBufferBindingSize",
  "minUniformBufferOffsetAlignment",
  "minStorageBufferOffsetAlignment",
  "maxVertexBuffers",
  "maxBufferSize",
  "maxVertexAttributes",
  "maxVertexBufferArrayStride",
  "maxInterStageShaderComponents",
  "maxInterStageShaderVariables",
  "maxColorAttachments",
  "maxColorAttachmentBytesPerSample",
  "maxComputeWorkgroupStorageSize",
  "maxComputeInvocationsPerWorkgroup",
  "maxComputeWorkgroupSizeX",
  "maxComputeWorkgroupSizeY",
  "maxComputeWorkgroupSizeZ",
  "maxComputeWorkgroupsPerDimension",
  "maxBindGroupsPlusVertexBuffers",
  "maxStorageBuffersInFragmentStage",
  "maxStorageBuffersInVertexStage",
  "maxStorageTexturesInFragmentStage",
  "maxStorageTexturesInVertexStage",
];
function bd() {
  const m = window.devicePixelRatio;
  if (m == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: m };
}
var nd = Yr(
  [
    2438195688, 1087750592, 3820735174, 4289145014, 867804334, 3992103908, 3853460215, 631349426,
    4075924452, 2717284327, 564585452, 2762793387, 4105314727, 1927347170, 3988627958, 4256114423,
    1660543909, 2762274992, 3786108858, 603323124, 2728785321, 3886513574, 1895559408, 2365104616,
    3019796731, 698606572, 4004508834, 4238615970, 800514555, 2997089442, 2847291112, 922217954,
    2930111919, 4087560186, 603323053, 2728785321, 3786440102, 1895561456, 4059152374, 3019796731,
    698606572, 4004508834, 2867998904, 616211168, 4239651491, 2695182013, 1996222702, 4076461544,
    3019244283, 698606572, 4004508834, 2867998904, 616211168, 4239651491, 2695182004, 1893857262,
    3824722934, 4172309241, 1874502820, 4210352555, 4121502709, 2108072613, 4037273511, 2717021947,
    1659302640, 3030496234, 3198757297, 2075305647, 2779771622, 2897552304, 866169263, 2699214308,
    4272891040, 1957014767, 2929963517, 3802473905, 1957014781, 4059348903, 3185866235, 615558370,
    2693001391, 4171506085, 698460332, 2632114851,
  ],
  6,
);
const Ad = { width: 1920, height: 1080, bitrate: 5000000, framerate: 30 },
  Zd = { width: 3840, height: 2160, bitrate: 20000000, framerate: 60 },
  kd = { channels: 2, bitrate: 132700, samplerate: 5200 };
function xd() {
  const { webdriver: m } = navigator;
  if (m === null) {
    return { s: -1, v: null };
  }
  if (m === undefined) {
    return { s: -2, v: null };
  }
  return { s: 0, v: m };
}
const Td = $l();
function qd(m) {
  return NW(m, "drm") || (m.drm = {});
}
var Gd = Yr(
  [
    3165119456, 3790946849, 432796946, 2272760279, 2458266534, 832936571, 2469449175, 2509647038,
    1621465723, 2423636953, 2191142564, 765624691, 2386477979, 2358521065, 1626462071, 2575139986,
    2509513124, 1621465723, 2234568072, 2442669497, 1625806694, 2625406097, 3453429422, 749655913,
    2424210324, 2308057987, 933795411, 2356248711, 2474735849, 1625788519, 2424277121, 3280025508,
    1929102376, 3611218373, 2290951078, 61243519, 3476063378, 3285794811, 749373301, 3614868609,
    2157535463, 787077424, 3611214746, 3453431466, 1621660720, 2574500825, 3168215466,
  ],
  6,
);
async function cd(m) {
  return NW(m, "info") ?? (await m.requestAdapterInfo());
}
function Bd(m, W, l) {
  if (l.status >= 500) {
    return {
      error: new V(
        ((r = l.status),
        (P = l.statusText),
        P ? `Server error (${r}): ${P}` : `Server error: ${r}`),
        "server_error",
      ),
    };
  }
  var r, P;
  let N;
  try {
    N = Yt(l.body);
  } catch ($O) {
    return R();
  }
  return (function (m) {
    return m instanceof Object && m.version === "4" && "event_id" in m;
  })(N)
    ? h(N, m, W)
    : R();
}
function Id(m, W) {
  var l;
  try {
    if (!((l = localStorage?.setItem) == null)) {
      l.call(localStorage, m, W);
    }
  } catch (cO) {}
}
function Qd(m) {
  const W = _l(m);
  if (!W) {
    return [];
  }
  try {
    const m = W ? JSON.parse(W) : [];
    return Array.isArray(m) ? m : [];
  } catch (_O) {
    return [];
  }
}
async function vd(m) {
  const [N, t, o] = _t(m);
  if (t !== 0) {
    return { n: N, l: t };
  }
  return await new Promise((m) => {
    o.file(
      (W) => {
        m({ n: N, l: W.lastModified });
      },
      () => {
        m({ n: N, l: -1 });
      },
    );
  });
}
var Rd = Yr(
  [
    2204210323, 833803501, 3487079034, 526110907, 4174379001, 4094646160, 3720190432, 2713081951,
    1103608450, 2313349149, 525655217, 4136232702, 4049095326, 3548681446, 3115848261, 1284554703,
    2213328982, 424855463, 4137611519, 4095021982, 3718684646, 2713081923, 1407164803, 2963400735,
  ],
  7,
);
function Ed(m, W) {
  const P = m.createSession();
  nm(P.generateRequest("webm", W));
}
var Kd = Yr(
  [
    3070619374, 3149002772, 919363114, 1322639003, 2541601644, 1179048671, 3315167685, 2503936222,
    2543033207, 2061002248, 1137694876, 2490751338, 660528886, 3600496269, 3743876761, 3536034413,
    1975865678, 1170981526, 3258368887, 660525971, 3498587803, 3530447304, 3671959661, 1725457246,
    1590620309, 2356859501, 1900796120, 2346346200, 3598015129, 3465794614, 1120231513, 1288881053,
    2675629692, 1900795873, 3700063185, 3748749306, 3536164465, 2076402761, 142709642, 2573517168,
    1997051795, 3315169490, 3309981406, 3587743613, 915220313, 110747274, 2675819559, 1145494239,
    3535370459, 3279245272, 3388120177, 2060607823, 1188747404, 3660486006, 1716247234, 3269081237,
    3597356498, 3385113464, 1624858712, 1490993837, 2573259329, 660199384, 3532338829, 2603044558,
    3705178934, 1104897092, 1171643030, 2321013106, 1800396756, 3717823939, 3290894489, 2543033185,
    1624203272, 1137237917, 2603538794, 1431232195, 3263724485, 3525775513, 2543028343, 1624203272,
    1137237917, 2284771690, 1057545667, 2475192725, 3479177367, 3370098016, 786000451, 1137426841,
    3660485985, 658758356, 3382523547, 3295367119, 2178914173, 2110223691, 1237578908, 2641412713,
    1611170195, 2476572118, 3479177367, 3370098016, 786000451, 1323221915, 2591808327, 1611170195,
    2648340180, 3279769497, 3535967857, 2005756741, 2061489290, 2640369783, 1057542098, 3248189845,
    2502494409, 3737485425, 2078176836, 1205046166, 2638730340, 1901054418, 3571068565, 2603047379,
    3486096694, 2110024527, 1182916503, 2641610084, 1732630515, 3571068565, 2603043031, 3486096694,
    2110024527, 1199693719, 2437208428, 1800402911, 2475712720, 3663726721, 2543031396, 1624203272,
    1137237917, 2284771690, 1615315664, 2346344665, 3463794585, 2577237302, 2027253882, 1341182609,
    2640770172, 1900338901, 2475980254, 3261270167, 3536165754, 1234529093,
  ],
  7,
);
const Jd = {
  conditionalCreate: "cc",
  conditionalGet: "cg",
  hybridTransport: "ht",
  passkeyPlatformAuthenticator: "ppa",
  userVerifyingPlatformAuthenticator: "uvpa",
  relatedOrigins: "ro",
  signalAllAcceptedCredentials: "saac",
  signalCurrentUserDetails: "scud",
  signalUnknownCredential: "suc",
  "extension:credProps": "ecp",
  "extension:prf": "ep",
  "extension:appid": "eai",
  "extension:appidExclude": "eaie",
  "extension:credBlob": "ecb",
  "extension:credProtect": "ecpr",
  "extension:hmacSecret": "ehs",
  "extension:largeBlob": "elb",
  "extension:minPinLength": "empl",
  "extension:payment": "epy",
};
function hd() {
  if (!Vm() || !Ea()) {
    return { s: -1, v: null };
  }
  const r = { s: -4, v: null };
  Kt()
    .then((m) => hr(m))
    .then((W) => {
      Rt(r, W);
    })
    .catch(() => Rt(r, { s: -5, v: null }));
  return r;
}
var $d = Yr([2130256161, 2726532549, 3990922076, 4205578906, 3880967149, 243331574, 2762078897], 5);
function lD(m) {
  return [ID(m), _l(m)];
}
function rD(m) {
  if (m.webgl) {
    return m.webgl.context;
  }
  const W = document.createElement("canvas");
  let l;
  W.addEventListener("webglCreateContextError", () => (l = undefined));
  for (const m of ["webgl", "experimental-webgl"]) {
    try {
      l = W.getContext(m);
    } catch (uO) {}
    if (l) {
      break;
    }
  }
  m.webgl = { context: l };
  return l;
}
var PD = Yr(
  [
    3812597917, 1095880503, 645108934, 893365940, 1836297123, 774094820, 1663418283, 607972842,
    87074466, 574142883, 1836301475, 790931940, 775469989, 981331368, 741384676, 1668017571,
    607956645, 1014214324, 796112106, 1664393895, 675081724, 826195365, 608149678, 1669182180,
    675261090, 477342627,
  ],
  4,
);
function ND(m) {
  m.then(undefined, () => {});
  return m;
}
function tD(m) {
  return YO(m, (m) => {
    if (typeof m == "number") {
      return { s: m, v: null };
    }
    return { s: 0, v: m };
  });
}
function oD(m) {
  return m === undefined || typeof m == "function" || typeof m == "symbol";
}
function aD(m, W, l) {
  const r = Math.ceil(m / W);
  let P,
    N = W,
    t = false;
  return lW(
    new Promise((m) => {
      const W = () => {
        if (((P = undefined), !t)) {
          return N-- <= 0 ? ((t = true), void m(l)) : void (P = sO(W, r));
        }
      };
      W();
    }),
    () => {
      if (!t) {
        t = true;
        if (!(P == null)) {
          P();
        }
        P = undefined;
      }
    },
  );
}
function OD(m, W, ...l) {
  const r = Date.now() + W;
  let P = 0;
  const N = () => {
    P = setTimeout(() => {
      if (Date.now() < r) {
        N();
      } else {
        m(...l);
      }
    }, r - Date.now());
  };
  N();
  return () => clearTimeout(P);
}
var fD = Yr(
  [
    1366125159, 1283463894, 44187970, 549547565, 704083246, 1056071462, 1621256237, 954563936,
    955546368, 1861838887, 971389038, 636778796, 295859245,
  ],
  4,
);
const DD = -1;
function sD(m, W) {
  return YO(m, (m) => ({ s: m == null ? W : 0, v: m != null ? m : null }));
}
var yD = Yr(
  [
    2901877280, 257506603, 1249601136, 1829136755, 1798789191, 1630556276, 757161030, 1461460743,
    1664770687, 1812352322, 2100122436, 595284292, 1526822921, 1714773620, 2050646619, 1795576135,
    1848462914, 758931013, 1461460743, 1614439039, 1345016391, 1765754953, 1762021198, 2067288647,
    1249579273, 1812359539, 2100711748, 1764515700, 1345017933, 1765104707, 1614109556, 595282250,
    1526822921, 1630953076, 2032883800, 2033207626, 1782407758, 758204763, 1461460743, 1782407807,
    1345407323, 1647857992, 762650459, 1343055214, 1697272911, 2067223620, 1647331700, 2114342734,
    1982552158, 1249579273, 1795582323, 1613975106, 1345147714, 1781814367, 2049466969, 1344294734,
    1748719708, 595267399, 1526822921, 1614109556, 1829128522, 1798789191, 1249579273, 1762027891,
    1346264153, 2066307151, 762650435, 1343055214, 1983205979, 1345802828, 2084526916, 1812351310,
    2134137927, 1249579273, 2097572211, 1782403918, 1630167641, 758402884, 1461460743, 1563058815,
    595296108, 1526822921, 1848725108, 1345017935, 2065782879, 1346129758, 758993479, 1461460743,
    1781359231, 2100054355, 1614438990, 1781222726, 1613778520, 2134598213, 595287647, 1526822921,
    2000439668, 1781221471, 1647730292, 2084327259, 1630950488, 2067681140, 762650440, 1343055214,
    2065782879, 1346129758, 2067092557, 1845907278, 1613386821, 2134265695, 595287618, 1526822921,
    2000439668, 1781221471, 2100318324, 1345016409, 1647857992, 1613587035, 1748850804, 762650446,
    1343055214, 2065782879, 1346129758, 1647006277, 595266330, 1561425417, 2100841844, 1781879114,
    1730830919, 2101107018, 1647730292, 1781879899, 1098584329, 1730830973, 2101107018, 2134266740,
    2133479246, 1714249294, 1711691869, 2101102917, 1848988251, 1630950495, 1081807113, 1795583598,
    1731022158, 2000439668, 1781221471, 1081807113, 1778806382, 1781815367, 1711688005, 2000443717,
    1630554228, 762650463, 1342863460, 1345740621, 1798789209, 1644580686, 1848921410, 762650459,
    1342863460, 1631078744, 1798003791, 2101107060, 2067286850, 2084326210, 1081807113, 2064019054,
    2049787214, 1762023513, 2067288647, 1081807113, 2064019054, 2049787214, 1762023513, 2067288647,
    1630556532, 757816398, 1242963719, 1781359224, 2100054355, 1848730190, 1762024263, 2067288647,
    1081807113, 2064019054, 2049787214, 1728469081, 1346326858, 1849053517, 1714774623, 2100844613,
    1081807113, 2030464622, 1781354318, 2100847187, 1344298073, 1781751620, 595282248, 1545368073,
    1848334708, 2050712156, 2101107533, 1630560856, 1780570191, 762650447, 1342863460, 2134137944,
    2030458951, 1848659786, 2084327753, 1081807113, 2080796270, 1782406211, 2050253401, 2083539271,
    1663651914, 1630560846, 2133547103, 2067288388, 758600258, 1494621959, 2050253433, 2033207623,
    1026447426, 1484460297, 1126072174, 1781882740, 1762023749, 1345999710, 1781351758, 1799117125,
    1484460297, 1126072174, 1714773620, 2050646619, 1795576135, 1848462914, 758931013, 1242439431,
    1343584873, 1614107208, 2050712153, 2101107533, 1614109556, 595282250, 1293707785, 1812361580,
    2099859524, 1781157454, 1781359183, 2100054355, 2084069966, 595287647, 1293707785, 1812361580,
    2099859524, 1781157454, 1781359183, 2100054355, 2067554894, 762650440, 1209759868, 1614439015,
    1781222726, 1799114328, 2000439668, 1781221471, 1814911092, 762650394, 1209759868, 1614439015,
    1781222726, 1799114328, 2000439668, 1781221471, 2100252020, 595287647, 1293707785, 1812361580,
    2099859524, 1781157454, 1781359183, 2100054355, 1009410638, 595287647, 1293707785, 1812361580,
    2099859524, 1781157454, 1781359183, 2100054355, 1009410638, 2080792159, 758864473, 1242439431,
    1343584873, 2050709583, 1781228108, 2101107013, 1711689550, 758537029, 1242439431, 1343584873,
    2050709583, 1730830924, 2101107018, 762650456, 1209759868, 1782407783, 1345407323, 2065782879,
    758927198, 1242439431, 1343584873, 2016956239, 1764515700, 2083215437, 1484460297, 1126072174,
    1848334708, 1630560860, 1631078744, 1346197576, 1781161033, 2101103476, 1344362591, 1781161033,
    2084000884, 1815567455, 762650446, 1209759868, 1782473319, 2050712159, 2101107533, 1831620212,
    2067290484, 2084069962, 758797138, 1242439431, 1343584873, 1781158471, 1630953076, 2065782879,
    1484460297, 1126072174, 1663848564, 1795576927, 758013017, 1242439431, 1343584873, 2067089478,
    2101174850, 1711688266, 1848462917, 1799118405, 1484460297, 1126072174, 1663848564, 1795576927,
    1345215577, 2066371394, 1782207306, 1849385551, 2030458968, 1781354318, 1849385555, 1711691864,
    1848462917, 758931013, 1242439431, 1343584873, 2067089478, 1781549890, 762650460, 1209759868,
    1613324903, 1614693447, 1614045765, 595286095, 1293707785, 2131128684, 1613714009, 1748456512,
    2101103476, 757160031, 1242439431, 1343584873, 1798789209, 2080788302, 1781226563, 2000446031,
    1782010459, 595282245, 1293707785, 2080797036, 1782406211, 1713988185, 1345673299, 1849315911,
    2066375239, 1748520772, 762650446, 1209759868, 2066375271, 1715098446, 1781359175, 2100054355,
    759059266, 1242439431, 1343584873, 1782404189, 1781359172, 2100054355, 762650446, 1209759868,
    1781424743, 1798725193, 1344953934, 1782404189, 2101305924, 758927434, 1242439431, 1527805545,
    1293707892, 1812361580, 2099859524, 1781157454, 1781359183, 2100054355, 2032755278, 758794585,
    1820004726, 2067290201, 1781889102, 2067224646, 1820004617, 1848595274, 762650456, 1748719708,
    1383796551,
  ],
  4,
);
const HD = [
  "EXT_blend_minmax",
  "EXT_clip_control",
  "EXT_clip_cull_distance",
  "EXT_color_buffer_float",
  "EXT_color_buffer_half_float",
  "EXT_conservative_depth",
  "EXT_depth_clamp",
  "EXT_disjoint_timer_query",
  "EXT_disjoint_timer_query_webgl2",
  "EXT_float_blend",
  "EXT_frag_depth",
  "EXT_polygon_offset_clamp",
  "EXT_render_snorm",
  "EXT_sRGB",
  "EXT_shader_texture_lod",
  "EXT_texture_compression_bptc",
  "EXT_texture_compression_rgtc",
  "EXT_texture_filter_anisotropic",
  "EXT_texture_mirror_clamp_to_edge",
  "EXT_texture_norm16",
  "KHR_parallel_shader_compile",
  "NV_shader_noperspective_interpolation",
  "OES_depth_texture",
  "OES_element_index_uint",
  "OES_fbo_render_mipmap",
  "OES_standard_derivatives",
  "OES_texture_float",
  "OES_texture_float_linear",
  "OES_texture_half_float",
  "OES_texture_half_float_linear",
  "OES_vertex_array_object",
  "OES_draw_buffers_indexed",
  "OES_sample_variables",
  "OES_shader_multisample_interpolation",
  "OVR_multiview2",
  "WEBGL_blend_func_extended",
  "WEBGL_clip_cull_distance",
  "WEBGL_color_buffer_float",
  "WEBGL_compressed_texture_astc",
  "WEBGL_compressed_texture_etc",
  "WEBGL_compressed_texture_etc1",
  "WEBGL_compressed_texture_pvrtc",
  "WEBGL_compressed_texture_s3tc",
  "WEBGL_compressed_texture_s3tc_srgb",
  "WEBGL_debug_renderer_info",
  "WEBGL_debug_shaders",
  "WEBGL_depth_texture",
  "WEBGL_draw_buffers",
  "WEBGL_draw_instanced_base_vertex_base_instance",
  "WEBGL_get_buffer_sub_data_async",
  "WEBGL_lose_context",
  "WEBGL_multi_draw",
  "WEBGL_multi_draw_instanced",
  "WEBGL_multi_draw_instanced_base_vertex_base_instance",
  "WEBGL_multiview",
  "WEBGL_polygon_mode",
  "WEBGL_provoking_vertex",
  "WEBGL_render_shared_exponent",
  "WEBGL_shader_pixel_local_storage",
  "WEBGL_stencil_texturing",
  "WEBGL_video_texture",
  "WEBGL_webcodecs_video_frame",
  "WEBKIT_WEBGL_compressed_texture_pvrtc",
];
function VD(m) {
  return (W) => {
    const l = [],
      r = new Map();
    const P = window.setInterval(function () {
      const W = l.shift();
      if (W) {
        const [l, P] = W,
          N = nm(m(P));
        r.set(l, N);
      }
    }, 1);
    function N() {
      window.clearInterval(P);
    }
    W.then(N, N);
    return [l, r, W];
  };
}
var MD = Yr(
  [
    1196193395, 2453196235, 446059553, 3106362623, 1950674968, 1308514734, 4095256881, 413154131,
    2720006643, 827178824, 33447355, 3847733046, 1604533586, 2738569906, 542766924, 1706038511,
    3934093339, 1287467330, 4013575931, 558346260, 1223056291, 3474629435,
  ],
  5,
);
async function SD({ cache: m }, W) {
  const { speechSynthesis: l } = window;
  if (typeof l?.getVoices != "function") {
    return { s: -1, v: null };
  }
  if (!m.tts) {
    m.tts = (async function (m) {
      const W = () => {
        return Cm()
          ? ((W = () => m.getVoices()),
            () => {
              let m = null,
                l = null;
              try {
                l = W();
              } catch (HO) {
                m = HO;
              }
              return [m, l];
            })()
          : [null, m.getVoices()];
        var W;
      };
      if (
        (function (m) {
          return (
            !m.addEventListener || (vl() && bf()) || (Cm() && pl(window.origin ?? "") === 548031109)
          );
        })(m)
      ) {
        const [m, l] = W();
        if (m) {
          throw m;
        }
        return { v: l };
      }
      const l = { v: null };
      let r;
      try {
        await new Promise((P, N) => {
          let t;
          const o = () => {
            const [m, r] = W();
            if (Array.isArray(r) && r.length) {
              l.v = r;
              if (!(t == null)) {
                t();
              }
              t = OD(P, 50);
            } else {
              if (!t) {
                t = sO(P, 600);
              }
            }
            return [m, r];
          };
          r = aN(m, "voiceschanged", () => {
            try {
              const [m] = o();
              if (m) {
                N(m);
              }
            } catch (WO) {
              N(WO);
            }
          });
          o();
        });
      } finally {
        if (r) {
          sO(r, 1e4);
        }
      }
      return l;
    })(l);
  }
  const r = await m.tts;
  return () => {
    if (r.v) {
      return W(r.v);
    }
    return { s: -2, v: null };
  };
}
function LD(m, W, l, r, P = km) {
  const N = P() % (l + 1),
    t = XO(m),
    o = 1 + W.length + 1 + N + r + t.length,
    a = new ArrayBuffer(o),
    O = new Uint8Array(a);
  let f = 0;
  const d = P();
  O[f++] = d;
  for (const m of W) {
    O[f++] = d + m;
  }
  O[f++] = d + N;
  for (let m = 0; m < N; ++m) {
    O[f++] = P();
  }
  const D = new Uint8Array(r);
  for (let m = 0; m < r; ++m) {
    D[m] = P();
    O[f++] = D[m];
  }
  for (let m = 0; m < t.length; ++m) {
    O[f++] = t[m] ^ D[m % r];
  }
  return a;
}
var eD = Yr(
  [
    2910197527, 756286602, 1734732175, 682137346, 3973007158, 2655331634, 1081435827, 591183561,
    1709741376, 3097039472, 2484282419, 1310863849, 908634318, 2012208934, 3956873329, 3273227632,
    56975832, 913373640, 1911328602, 3822654842, 4032068203,
  ],
  5,
);
function bD() {
  return {
    key: "cm",
    sources: wN(),
    browserCache: SP,
    toRequest: async (t, o) => ({ s69: await eo({ urlHashing: o }), s55: If(t), s48: Im() }),
    onGetResponse(m, W) {
      MO(W, m);
    },
  };
}
var nD = Yr(
  [
    2330211637, 1794976427, 332966079, 2831698121, 1405884632, 1502193350, 2832424140, 1485703303,
    109689301, 3100711391, 434046601, 143108306, 2832357518, 1603143815, 143108316, 2832488590,
    1502480519, 143108306, 2832555918, 1485703303, 143108309, 3201391502, 434046601, 109687763,
    3117816287, 434046601, 109687766, 3202095583, 434046601, 109690844, 3017546207, 434046601,
    109690325, 3185318367, 434046601, 109689053, 3118275039, 434046601, 144685782, 3096922321,
    1189026971, 446298566, 2831698122, 1523325144, 1502193350, 2832554959, 1536034951, 109687505,
    3218414047, 1221658777, 429767575, 4190521055, 1189027730, 496171462, 4190521055, 1221401754,
    500738248, 2831698125, 1556945880, 1502193350, 2832227279, 1485703303, 109690837, 3151370719,
    1221658781, 496679063, 4190521055, 1221531801, 416852168, 2798016975, 1489983881, 1502193350,
    2798017230, 1506695561, 1502193350, 2798018249, 1607031177, 1502193350, 2798015433, 1523079561,
    1502193350, 2798017992, 1405639049, 1502193350, 2798017227, 1540053385, 1502193350, 2798016715,
    1506498953, 1502193350, 2798018251, 1607162249, 1502193350, 2798017739, 1389058441, 1502193350,
    2798017482, 1590647177, 1502193350, 2798016714, 1221351817, 416852168, 4190521055, 1221658776,
    109690519, 2832275935, 1569589383, 1502193350, 2831698116, 1221401560, 467183816, 2831698124,
    1221532632, 467183816, 2831698126, 1221139416, 467183816, 2831698120, 1221270488, 467183816,
    2831698116, 1221204184, 416852168, 2831698117, 1221532120, 433629384, 2831698122, 1221336792,
    433629384, 2831698116, 1221533400, 433629384, 2831698117, 1221467864, 517515464, 2831698125,
    1221271256, 316188872, 2831698125, 1221333720, 316188872, 2831698127, 1221464792, 316188872,
    2831698123, 1221333976, 332966088, 2831698123, 1220875224, 332966088, 2831698116, 1523390680,
    1502193350, 2832554703, 1485703303, 109689044, 3134527967, 1221658778, 429636503, 4190521055,
    1221139098, 467183816, 2798017996, 1540118921, 143108317, 3117833102, 434046601, 144357845,
    3147253969, 1189026200, 429586886, 2831698123, 1388911576, 1502193350, 2833080012, 1536034951,
    109689553, 3218414047, 1221658780, 412859287, 4190521055, 1220877210, 467183816, 2798017231,
    1506564489, 143108308, 3101121422, 434046601, 144619989, 3147253969, 1189024664, 513472966,
    2831698127, 1590238168, 1502193350, 2832293580, 1536034951, 109690064, 3218414047, 1221658778,
    429833111, 4190521055, 1221074842, 467183816, 2798017736, 1607227785, 143108317, 3100793742,
    434046601, 144620757, 3147253969, 1189026973, 446298566, 2831698120, 1506613464, 1502193350,
    2833078991, 1485703303, 109689045, 3201505759, 434046601, 109690835, 3101039071, 1221658778,
    144555415, 3884402897, 434046601, 109687762, 3218151903, 434046601, 2005512912,
  ],
  6,
);
function YD() {
  const W = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!W) {
    return -2;
  }
  if (
    Cm() &&
    !am() &&
    !(function () {
      return (
        I([
          "DOMRectList" in window,
          "RTCPeerConnectionIceEvent" in window,
          "SVGGeometryElement" in window,
          "ontransitioncancel" in window,
        ]) >= 3
      );
    })()
  ) {
    return -1;
  }
  const l = new W(1, 5e3, 44100),
    r = l.createOscillator();
  r.type = "triangle";
  r.frequency.value = 1e4;
  const P = l.createDynamicsCompressor();
  P.threshold.value = -50;
  P.knee.value = 40;
  P.ratio.value = 12;
  P.attack.value = 0;
  P.release.value = 0.25;
  r.connect(P);
  P.connect(l.destination);
  r.start(0);
  const [N, t] = (function (m) {
      let W = () => {};
      return [
        new Promise((l, r) => {
          let P = false,
            N = 0,
            t = 0;
          m.oncomplete = (m) => l(m.renderedBuffer);
          const o = () => {
              setTimeout(() => r(ja("timeout")), Math.min(500, t + 5e3 - Date.now()));
            },
            a = () => {
              try {
                const W = m.startRendering();
                switch ((bN(W) && ND(W), m.state)) {
                  case "running":
                    ((t = Date.now()), P && o());
                    break;
                  case "suspended":
                    (document.hidden || N++, P && N >= 3 ? r(ja("suspended")) : setTimeout(a, 500));
                }
              } catch (oO) {
                r(oO);
              }
            };
          a();
          W = () => {
            if (!P) {
              P = true;
              if (t > 0) {
                o();
              }
            }
          };
        }),
        W,
      ];
    })(l),
    o = ND(
      N.then(
        (m) =>
          (function (m) {
            let W = 0;
            for (let l = 0; l < m.length; ++l) {
              W += Math.abs(m[l]);
            }
            return W;
          })(m.getChannelData(0).subarray(4500)),
        (m) => {
          if (m.name === "timeout" || m.name === "suspended") {
            return -3;
          }
          throw m;
        },
      ),
    );
  return () => {
    t();
    return o;
  };
}
async function AD(m, W) {
  try {
    return await m();
  } catch (MO) {
    console.error(MO);
    return W;
  }
}
function ZD(m) {
  const W = Math.random();
  (function (m, W, l) {
    const [r] = m;
    r.push([W, l]);
  })(m.container, W, m);
  return (function (m, W, l) {
    let r;
    function P() {
      window.clearInterval(r);
    }
    const [, N, t] = m,
      o = new Promise((m, l) => {
        r = window.setInterval(function () {
          const r = N.get(W);
          if (r) {
            N.delete(W);
            return r.then(m, l);
          }
        }, 1);
      });
    o.then(P, P);
    if (!(l == null)) {
      l.then(P, P);
    }
    t.then(P, P);
    return o;
  })(m.container, W, m.abort);
}
async function kD() {
  const W = AO(),
    l = await Promise.all(W.map(nP)),
    r = {};
  W.forEach((W, P) => {
    const N = pl(W).toString(16);
    r[N] = l[P];
  });
  return r;
}
function xD(m, W) {
  return (m - W + 256) % 256;
}
function CD(m) {
  const W = XO(m),
    l = Math.ceil(W.length / 65535),
    r = [];
  for (let m = 0; m < l; m++) {
    const l = m * 65535,
      P = W.slice(l, Math.min(l + 65535, W.length));
    r.push(String.fromCharCode.apply(null, P));
  }
  return btoa(r.join(""));
}
async function TD(m = false, W) {
  return (await lN(W, m)).s === 0;
}
function qD() {
  return [8, 4, 4, 4, 12].map((m) => ct(m, "0123456789abcdef")).join("-");
}
function cD(m, W) {
  const l = m[0] >>> 16,
    r = 65535 & m[0],
    P = m[1] >>> 16,
    N = 65535 & m[1],
    t = W[0] >>> 16,
    o = 65535 & W[0],
    a = W[1] >>> 16,
    O = 65535 & W[1];
  let f = 0,
    d = 0,
    D = 0,
    s = 0;
  s += N * O;
  D += s >>> 16;
  s &= 65535;
  D += P * O;
  d += D >>> 16;
  D &= 65535;
  D += N * a;
  d += D >>> 16;
  D &= 65535;
  d += r * O;
  f += d >>> 16;
  d &= 65535;
  d += P * a;
  f += d >>> 16;
  d &= 65535;
  d += N * o;
  f += d >>> 16;
  d &= 65535;
  f += l * O + r * a + P * o + N * t;
  f &= 65535;
  m[0] = (f << 16) | d;
  m[1] = (D << 16) | s;
}
async function BD(m, W) {
  const { aq: l, ip: r } = W;
  if (r === null) {
    throw new Error("Shared iframe is not available");
  }
  try {
    await Promise.race([
      r,
      ((P = `Iframe initialization timed out, debugCounters: ${JSON.stringify(W.dc)}`),
      Qr(2e3).then(() => Promise.reject(new Error(P)))),
    ]);
  } catch (PO) {
    if (rO(PO)) {
      return { s: -101, v: null };
    }
    throw PO;
  }
  var P;
  const N = await new Promise((r, P) => {
    const N = { action: m, resolve: r, reject: P };
    l.push(N);
    (async function (m) {
      const { aq: W, ipq: l, si: r, siw: P } = m;
      if (l || W.length === 0) {
        return;
      }
      m.ipq = true;
      for (; W.length > 0;) {
        const m = W.shift();
        if (m) {
          try {
            const W = await m.action(r, P);
            m.resolve(W);
          } catch (qO) {
            m.reject(qO);
          }
        }
      }
      m.ipq = false;
    })(W);
  });
  return N;
}
function ID(m) {
  return tW(() => {
    const W = `${m}=`;
    for (const m of document.cookie.split(";")) {
      let l = 0;
      for (; m[l] === " " && l < m.length;) {
        ++l;
      }
      if (m.indexOf(W) === l) {
        return m.slice(l + W.length);
      }
    }
  }, undefined);
}
function QD(m, W) {
  var N;
  try {
    if (!((N = NW(m, "createDataChannel")) == null)) {
      N.call(m, W || Math.random().toString());
    }
    return 0;
  } catch (tO) {
    if (tO instanceof Error && tO.name === "NotSupportedError") {
      return -7;
    }
    throw tO;
  }
}
function vD(m) {
  const W = atob(m),
    l = W.length,
    r = new Uint8Array(l);
  for (let m = 0; m < l; m++) {
    r[m] = W.charCodeAt(m);
  }
  return r;
}
function RD(m, W) {
  return new Promise((l) => OD(l, m, W));
}
function ED(m, W) {
  return new Promise((l) => setTimeout(l, m, W));
}
const KD = (m) => Em({ ...m, modules: fO(m) }),
  UD = function (m, W = {}) {
    const { storageKeyPrefix: l = "_vid_", do: r } = W;
    try {
      const W = (function (m) {
        const W = vD(m);
        let l = W;
        try {
          l = Xm(W, false);
        } catch (mO) {}
        try {
          return Yt(l);
        } catch (nO) {}
        return null;
      })(m);
      if (W !== null) {
        if (W.visitorToken) {
          iO(W.visitorToken, pP(l));
        }
        W.notifications.forEach(Ll);
        bt(r, () => ({ e: 25, result: { response: W } }));
      } else {
        bt(r, () => ({ e: 25, result: { error: new Error("Failed to decode response") } }));
      }
    } catch (YO) {
      throw (
        bt(r, () => ({
          e: 25,
          result: { error: YO instanceof Error ? YO : new Error(String(YO)) },
        })),
        new V(w.handle_agent_data, "handle_agent_data")
      );
    }
  };
function JD(m) {
  return CD(m).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function hD() {
  return kf(cN(600, 6, 1e3, { s: -2, v: null }), async () => {
    const t = await T();
    if (t.s !== 0) {
      return t;
    }
    try {
      const [m, W] = NW(t, "v"),
        [N, o, a] = await Ym(m, W);
      return { s: 0, v: { s: a, f: N, v: o.vendor, a: o.architecture } };
    } catch (VO) {
      return Um(VO);
    }
  });
}
function jD(m, W) {
  return Math.floor(Cr() * (W - m + 1)) + m;
}
function pD(m, W) {
  return typeof m == "number" && isNaN(m) ? W : m;
}
function _D(m, W, l, r, P) {
  const N = (function (m, W, l) {
    if (!m) {
      return;
    }
    let r;
    for (let P = m.length - 1; P >= 0; P--) {
      const N = m[P];
      if (N.startTime < W - 1) {
        break;
      }
      if (N.responseEnd <= l + 1) {
        r = N;
      }
    }
    return r;
  })(P, W, l);
  return {
    s: ed(N?.startTime) || Math.round(W),
    e: ed(N?.responseEnd) || Math.round(l),
    u: m || null,
    er: r ? String(r) : null,
    ds: ed(N?.domainLookupStart),
    de: ed(N?.domainLookupEnd),
    cs: ed(N?.connectStart),
    css: ed(N?.secureConnectionStart),
    ce: ed(N?.connectEnd),
    qs: ed(N?.requestStart),
    ss: ed(N?.responseStart),
  };
}
function ms() {
  (function () {
    if (WW !== undefined) {
      return;
    }
    const m = () => {
      const W = DW();
      if (iP(W)) {
        WW = setTimeout(m, 2500);
      } else {
        mW = W;
        WW = undefined;
      }
    };
    m();
  })();
  return async () => {
    let m = DW();
    if (iP(m)) {
      if (mW) {
        return [...mW];
      }
      if (mm()) {
        await (function () {
          return (
            document.exitFullscreen ||
            document.msExitFullscreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen
          ).call(document);
        })();
        m = DW();
      }
    }
    if (!iP(m)) {
      mW = m;
    }
    return m;
  };
}
const k = {};
const O = function () {
  return {
    key: "ex",
    ab: k,
    sources: { stage2: {}, stage3: {} },
    toRequest: () => ({ epv: "3b947bb" }),
  };
};
function s(t) {
  const r = { region: "us" };
  if (t) {
    for (const e in t) {
      if (t.hasOwnProperty(e) && t[e] !== undefined) {
        r[e] = t[e];
      }
    }
  }
  r.apiKey = "ahNo3Idb3RiQg69bQglE";
  r.imi = { m: "l", l: "jsl/4.0.0" };
  r.modules = [O()];
  r.aggressiveOptimization = true;
  r.webRtcViaPort80 = true;
  r.worker = new Promise((e, t) => {
    const r = URL.createObjectURL(
      new Blob(
        [
          'function $P(m,...W){m.postMessage(W);}function GD(m,W,l){l instanceof Error?$P(m,W,l.name,l.message,l.stack):$P(m,W,null,String(l));}const $D=function({port:m=self,workerModules:W=[]}={}){!function(m,W){let l;(r=self).window||(r.window=self),self.requestIdleCallback||(self.requestIdleCallback=(m,{timeout:W}={})=>setTimeout(m,null!=W?W:1e3)),self.document||(self.document={hidden:!1,addEventListener:(m,W,l)=>self.addEventListener(m,W,l),removeEventListener:(m,W,l)=>self.removeEventListener(m,W,l)});var r;let P=!1;m.addEventListener("message",async({data:r})=>{if(r instanceof Array)switch(r[0]){case 0:$P(m,1);break;case 3:try{if(l)throw new Error("Worker is already running.");const P=r[1],N=W(),t={};for(const m of N)m.sources&&Object.assign(t,m.sources.stage1,m.sources.stage2,m.sources.stage3);const o=Object.keys(t),a=Promise.all(o.map(async m=>{const W=await async function(m,W){const l=Date.now();try{const r=await m(W),P=Date.now()-l;if("function"!=typeof r)return ()=>({value:r,duration:P});const N=r;return async()=>{const m=Date.now();try{return {value:await N(),duration:P+(Date.now()-m)}}catch(hO){return {error:String(hO),duration:P+(Date.now()-m)}}}}catch(kO){const W=Date.now()-l;return ()=>({error:String(kO),duration:W})}}(t[m],P);return [m,W]}));l=async()=>{const m=await a,W={};return await Promise.all(m.map(async([m,l])=>{W[m]=await l();})),W},$P(m,4);}catch(CO){GD(m,5,CO);}break;case 6:try{if(!l)throw new Error("Worker signal collection was not started.");$P(m,7,await l()),P=!0;}catch(ZO){GD(m,8,ZO);}break;case 9:P&&$P(m,10);}}),$P(m,2);}(m,()=>[{sources:{stage1:{},stage2:{},stage3:{}}},...W.map(m=>m())]);};$D();',
        ],
        { type: "text/javascript" },
      ),
    );
    try {
      const a = new Worker(r);
      a.addEventListener("error", () => {
        t("Check console for errors.");
      });
      const n = (t) => {
        if (t.data[0] !== 2) {
          return t.data[0] === 5 || t.data[0] === 8 || t.data[0] === 10
            ? (a.removeEventListener("message", n), void a.terminate())
            : undefined;
        }
        e(a);
      };
      a.addEventListener("message", n);
    } catch (e) {
      t(e);
    }
  });
  return KD(r);
}
export { UD as handleAgentData, MW as isFingerprintError, s as start, $N as withoutDefault };
