const v1 = {
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
class fingerprintError extends Error {
  constructor(arg1, arg2) {
    super(arg1);
    this.name = "FingerprintError";
    this.event_id = null;
    this.code = arg2;
  }
}
function h_s45_fn(arg3) {
  const v31 = Number(arg3);
  return isNaN(v31) ? -1 : v31;
}
function fn1() {
  const v32 = fn44();
  return { u: v32 ? h_s167_fn2(v32, 1e3) : null };
}
function fn2(arg4 = `${"[Fingerprint]"} `) {
  const v33 = {};
  return (arg5) => {
    switch (arg5.e) {
      case 15:
        v33[arg5.getCallId] = arg5.body;
        break;
      case 18:
        console.log(`${arg4}Visitor id request`, v33[arg5.getCallId]);
        break;
      case 19:
        console.log(`${arg4}Visitor id response`, arg5.body);
        break;
      case 16:
      case 17:
        delete v33[arg5.getCallId];
    }
  };
}
function h_s38_prefersContrast(arg6) {
  return matchMedia(`(prefers-contrast: ${arg6})`).matches;
}
function fn3() {
  return !document.hidden;
}
function fn4(arg7) {
  return !!arg7 && typeof arg7.then == "function";
}
async function compressPayload(arg8) {
  if (!fn119()) {
    return [false, arg8];
  }
  const [v34, v35] = (function () {
      try {
        return [true, new CompressionStream("deflate-raw")];
      } catch (v38) {
        return [false, new CompressionStream("deflate")];
      }
    })(),
    v36 = await (async function (arg9, arg10) {
      const v39 = arg10.writable.getWriter();
      v39.write(arg9);
      v39.close();
      const v40 = arg10.readable.getReader(),
        v41 = [];
      let v42 = 0;
      for (;;) {
        const { value: value, done: done } = await v40.read();
        if (done) {
          break;
        }
        v41.push(value);
        v42 += value.byteLength;
      }
      if (v41.length === 1) {
        return v41[0];
      }
      const uint8Array5 = new Uint8Array(v42);
      let v43 = 0;
      for (const buffer of v41) {
        uint8Array5.set(buffer, v43);
        v43 += buffer.byteLength;
      }
      return uint8Array5;
    })(arg8, v35),
    v37 = v34
      ? v36
      : (function (buffer2) {
          return new Uint8Array(buffer2.buffer, buffer2.byteOffset + 2, buffer2.byteLength - 6);
        })(v36);
  return [true, v37];
}
function fn5(arg11, arg12) {
  const v44 = new Error(arg12);
  v44.name = arg11;
  return v44;
}
function decryptSelfKeyedTable(arg13, arg14, arg15) {
  const invalidData = () => {
      throw new Error("Invalid data");
    },
    v45 = asUint8Array(arg13);
  if (v45.length < arg14.length + 2) {
    invalidData();
  }
  for (let v50 = 0; v50 < arg14.length; ++v50) {
    if (fn165(v45[1 + v50], v45[0]) !== arg14[v50]) {
      invalidData();
    }
  }
  const v46 = 1 + arg14.length,
    v47 = fn165(v45[v46], v45[0]);
  if (v45.length < v46 + 1 + v47 + arg15) {
    invalidData();
  }
  const v48 = v46 + 1 + v47,
    v49 = v48 + arg15,
    arrayBuffer = new ArrayBuffer(v45.length - v49),
    uint8Array6 = new Uint8Array(arrayBuffer);
  for (let v51 = 0; v51 < uint8Array6.length; ++v51) {
    uint8Array6[v51] = v45[v49 + v51] ^ v45[v48 + (v51 % arg15)];
  }
  return arrayBuffer;
}
function fn6(arg16, arg17) {
  try {
    return new window.URL(arg16, window.location.href);
  } catch (v52) {
    if (typeError(v52)) {
      console.warn(`Ignoring an invalid '${arg17}' value: "${arg16}"`);
      return null;
    }
    throw v52;
  }
}
function h_s20_fn(arg18) {
  return sharedIframeIsNotAvailable((arg19, { document: arg20 }) => {
    const body = arg20.body;
    body.style.fontSize = "48px";
    const element = arg20.createElement("div");
    element.style.setProperty("visibility", "hidden", "important");
    const v53 = {},
      v54 = {},
      v55 = (arg21) => {
        const v60 = arg20.createElement("span"),
          { style: style } = v60;
        style.position = "absolute";
        style.top = "0";
        style.left = "0";
        style.fontFamily = arg21;
        v60.textContent = "mmMwWLliI0O&1";
        element.appendChild(v60);
        return v60;
      },
      v56 = (arg22, arg23) => v55(`'${arg22}',${arg23}`),
      v57 = h_s20_monospaceList.map(v55),
      v58 = (() => {
        const v61 = {};
        for (const v62 of h_s20_sansSerifThinList) {
          v61[v62] = h_s20_monospaceList.map((arg24) => v56(v62, arg24));
        }
        return v61;
      })();
    body.appendChild(element);
    for (let v63 = 0; v63 < h_s20_monospaceList.length; v63++) {
      v53[h_s20_monospaceList[v63]] = v57[v63].offsetWidth;
      v54[h_s20_monospaceList[v63]] = v57[v63].offsetHeight;
    }
    const v59 = h_s20_sansSerifThinList.filter((arg25) => {
      v64 = v58[arg25];
      return h_s20_monospaceList.some(
        (arg26, arg27) =>
          v64[arg27].offsetWidth !== v53[arg26] || v64[arg27].offsetHeight !== v54[arg26],
      );
      var v64;
    });
    body.removeChild(element);
    body.style.fontSize = "";
    return { s: 0, v: v59 };
  }, arg18.sis);
}
function fn7() {
  return new Promise((arg28) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = () => arg28();
    messageChannel.port2.postMessage(null);
  });
}
async function h_s70_fn() {
  const v65 = await fn131();
  let v66 = null;
  if (!(v65.s === 0)) {
    return v65;
  }
  v66 = readVaultedProp(v65, "v");
  if (!h_s70_gpu()) {
    return { s: -1, v: null };
  }
  const v67 = h_s70_canvas();
  if (v67) {
    return { s: 0, v: [v66, v67] };
  }
  return { s: -5, v: null };
}
let v2;
async function h_s154_fn(arg29, arg30, arg31) {
  for (const v68 of arg29) {
    try {
      return !!(await fn141(v68, arg30, arg31));
    } catch (v69) {}
  }
  return false;
}
function fn8(arg32) {
  const hostname = location.hostname,
    v70 = fn46();
  if (
    !(function (arg33, arg34) {
      let v71 = arg33.length - (arg33.slice(-1) === "." ? 1 : 0);
      do {
        if (
          ((v71 = v71 > 0 ? arg33.lastIndexOf(".", v71 - 1) : -1),
          arg34(arg33.slice(v71 + 1)) === true)
        ) {
          return true;
        }
      } while (v71 >= 0);
      return false;
    })(hostname, (arg35) => {
      if (!v70 || !/^([^.]{1,3}\.)*[^.]+\.?$/.test(arg35) || arg35 === hostname) {
        return arg32(arg35);
      }
    })
  ) {
    arg32();
  }
}
function fn9(arg36) {
  return arg36.reduce((arg37, arg38) => arg37 + (arg38 ? 1 : 0), 0);
}
function h_s44_prefersColorScheme(arg39) {
  return matchMedia(`(prefers-color-scheme: ${arg39})`).matches;
}
function badResponseFormat() {
  return { error: new fingerprintError(v1.bad_response_format, "bad_response_format") };
}
const isArray = Array.isArray;
async function h_s167_fn(arg40) {
  const v72 = await comWidevineAlpha(arg40, false);
  switch (v72.s) {
    case -3:
      return { s: -4, v: null };
    case -1:
      return { s: -1, v: null };
    case -2:
      return { s: -3, v: null };
  }
  const v73 = base64Decode(
      "CAUSxwUKwQIIAxIQFwW5F8wSBIaLBjM6L3cqjBiCtIKSBSKOAjCCAQoCggEBAJntWzsyfateJO/DtiqVtZhSCtW8yzdQPgZFuBTYdrjfQFEEQa2M462xG7iMTnJaXkqeB5UpHVhYQCOn4a8OOKkSeTkwCGELbxWMh4x+Ib/7/up34QGeHleB6KRfRiY9FOYOgFioYHrc4E+shFexN6jWfM3rM3BdmDoh+07svUoQykdJDKR+ql1DghjduvHK3jOS8T1v+2RC/THhv0CwxgTRxLpMlSCkv5fuvWCSmvzu9Vu69WTi0Ods18Vcc6CCuZYSC4NZ7c4kcHCCaA1vZ8bYLErF8xNEkKdO7DevSy8BDFnoKEPiWC8La59dsPxebt9k+9MItHEbzxJQAZyfWgkCAwEAAToUbGljZW5zZS53aWRldmluZS5jb20SgAOuNHMUtag1KX8nE4j7e7jLUnfSSYI83dHaMLkzOVEes8y96gS5RLknwSE0bv296snUE5F+bsF2oQQ4RgpQO8GVK5uk5M4PxL/CCpgIqq9L/NGcHc/N9XTMrCjRtBBBbPneiAQwHL2zNMr80NQJeEI6ZC5UYT3wr8+WykqSSdhV5Cs6cD7xdn9qm9Nta/gr52u/DLpP3lnSq8x2/rZCR7hcQx+8pSJmthn8NpeVQ/ypy727+voOGlXnVaPHvOZV+WRvWCq5z3CqCLl5+Gf2Ogsrf9s2LFvE7NVV2FvKqcWTw4PIV9Sdqrd+QLeFHd/SSZiAjjWyWOddeOrAyhb3BHMEwg2T7eTo/xxvF+YkPj89qPwXCYcOxF+6gjomPwzvofcJOxkJkoMmMzcFBDopvab5tDQsyN9UPLGhGC98X/8z8QSQ+spbJTYLdgFenFoGq47gLwDS6NWYYQSqzE3Udf2W7pzk4ybyG4PHBYV3s4cyzdq8amvtE/sNSdOKReuHpfQ=",
    ),
    v74 = await h_s167_fn3(readVaultedProp(v72, "v"));
  if (v74.s === -1) {
    return { s: -6, v: null };
  }
  return { s: 0, v: base64Encode(await h_s167_fn5(readVaultedProp(v74, "v"), v73)) };
}
function sig_s205_url() {
  return { s: 0, v: new URL("C:/").protocol };
}
async function h_s94_fn(arg41, arg42) {
  let v75;
  try {
    v75 = arg41.createOffer(arg42);
  } catch (v77) {
    if (
      !(v77 instanceof Error) ||
      !new RegExp(
        "\\bcreateOffer\\b.*(\\bcallback\\b.*\\bnot a function\\b|\\barguments required\\b.*\\bpresent\\b)",
        "i",
      ).test(readVaultedProp(v77, "message"))
    ) {
      throw v77;
    }
    v75 = new Promise((arg43, arg44) => {
      arg41.createOffer(arg43, arg44, arg42);
    });
  }
  const v76 = await v75;
  if (v76 === undefined) {
    return { s: -8, v: null };
  }
  return { s: 0, v: v76 };
}
function fn10(arg45, arg46, arg47) {
  let v78 = [],
    v79 = null;
  if (arg45.internal) {
    try {
      [v78, v79] = (function (arg48) {
        const v81 = decodeJsonBytes(fn16(base64Decode(arg48), false));
        return [v81.notifications, v81.visitor_token];
      })(arg45.internal);
    } catch (v82) {
      return badResponseFormat();
    }
  }
  for (const v83 of v78) {
    fn41(v83);
  }
  if (arg45.error) {
    return { error: fn110(arg45.error), stop: arg45.error.code === "visitor_not_found" };
  }
  !(function (arg49, arg50, arg51) {
    var v84;
    for (const v85 of arg50) {
      if (!((v84 = v85.onGetResponse) == null)) {
        v84.call(v85, arg49, arg51);
      }
    }
  })(v79, arg46, arg47);
  const v80 = {
    event_id: arg45.event_id,
    sealed_result: arg45.sealed_result === null ? null : fn120(arg45.sealed_result),
  };
  if ("visitor_id" in arg45) {
    v80.visitor_id = arg45.visitor_id;
  }
  if ("suspect_score" in arg45) {
    v80.suspect_score = arg45.suspect_score;
  }
  return { result: v80 };
}
function sig_s118_plugins() {
  if (navigator.plugins === undefined) {
    return { s: -1, v: null };
  }
  const { plugins: plugins } = navigator;
  let v86 = Object.getPrototypeOf(plugins) === PluginArray.prototype;
  for (let v87 = 0; v87 < plugins.length; v87++) {
    if (v86) {
      v86 = Object.getPrototypeOf(plugins[v87]) === Plugin.prototype;
    }
  }
  return { s: 0, v: v86 };
}
async function h_s216_managed() {
  const managed = navigator.managed;
  if (!managed || typeof managed.getManagedConfiguration !== "function") {
    return { s: -1, v: null };
  }
  if (fn11() && fn23()) {
    return { s: -3, v: null };
  }
  try {
    await managed.getManagedConfiguration([""]);
  } catch (v88) {
    if (v88 instanceof Error) {
      const v89 = [
        1754725009, 1957733438, 1042345413, 1882473574, 1759470430, 348095318, 1236583996,
      ].indexOf(fn48(readVaultedProp(v88, "message")));
      if (v89 !== -1) {
        return { s: 0, v: h_s216_getRandomValues(v89) };
      }
    }
    throw v88;
  }
  return { s: 0, v: "" };
}
function h_s166_fn(arg52, arg53) {
  const v90 = [],
    v91 = Object.getOwnPropertyNames(arg52);
  for (let v92 = 0; v92 < v91.length; v92++) {
    const v93 = v91[v92],
      v94 = fn48(v93);
    if (arg53.has(v94)) {
      v90.push({ i: v92, n: v93 });
    }
  }
  return { l: v91.length, p: v90 };
}
function h_s6_fullscreenElement() {
  return (
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    null
  );
}
function h_s209_getRandomValues() {
  const uint32Array2 = new Uint32Array(4);
  window.crypto.getRandomValues(uint32Array2);
  return [uint32Array2[0] | 0, uint32Array2[1] | 0, uint32Array2[2] | 0, uint32Array2[3] | 0];
}
async function sig_s152_hidden(arg54) {
  return sharedIframeIsNotAvailable((arg55, arg56) => {
    const v95 = arg56.document.createElement("div");
    v95.style.border = ".5px dotted transparent";
    arg56.document.body.appendChild(v95);
    const offsetHeight = v95.offsetHeight;
    arg56.document.body.removeChild(v95);
    return { s: 0, v: offsetHeight };
  }, arg54.sis);
}
function fn11() {
  return (
    fn9([
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
function fn12() {
  return "mediaCapabilities" in navigator && "decodingInfo" in navigator.mediaCapabilities;
}
function fn13(arg57) {
  const v96 = {};
  for (const v97 of Object.keys(arg57)) {
    const v98 = arg57[v97];
    if (v98) {
      const v99 = "error" in v98 ? h_s167_fn4(v98.error) : v98.value;
      v96[v97] = v99;
    }
  }
  return v96;
}
const v3 = [4283543511, 3981806797],
  v4 = [3301882366, 444984403];
function fn14() {
  const { HTMLElement: HTMLElement, Document: Document } = window;
  return (
    fn9([
      "safari" in window,
      !("ongestureend" in window),
      !("TouchEvent" in window),
      !("orientation" in window),
      HTMLElement && !("autocapitalize" in HTMLElement.prototype),
      Document && "pointerLockElement" in Document.prototype,
    ]) >= 4
  );
}
const v5 = [2277735313, 289559509],
  v6 = [1291169091, 658871167],
  v7 = [0, 5],
  v8 = [0, 1390208809],
  v9 = [0, 944331445];
function sig_s216_managed() {
  return fn142(fn66(250, { s: -2, v: null }), h_s216_managed);
}
function fn15() {
  const style2 = new Image().style;
  return permuteChars(
    [
      resolveNameByHash((v100 = style2), "webkitTapHighlightColor"),
      resolveNameByHash(v100, "webkitTouchCallout"),
    ],
    [
      18, 23, 22, 11, 23, 17, 3, 20, 4, 22, 19, 11, 25, 13, 23, 22, 7, 7, 17, 18, 4, 18, 11, 8, 11,
      8, 3, 5, 2, 4, 3, 3, 5, 6, 5, 3, 1, 2, 2, 0, 0,
    ],
  );
  var v100;
}
function fn16(arg58, arg59) {
  return decryptSelfKeyedTable(arg58, arg59 ? v25 : v24, 9);
}
function sig_s87_hidden(arg60) {
  return sharedIframeIsNotAvailable((arg61, arg62) => {
    const v101 = {},
      v102 = arg62.document.createElement("div");
    function fn173(arg63) {
      v102.style.color = arg63;
      return arg62.getComputedStyle(v102).color;
    }
    arg62.document.body.appendChild(v102);
    const v103 = {
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
    for (const v104 of Object.keys(v103)) {
      v101[v103[v104]] = fn173(v104);
    }
    arg62.document.body.removeChild(v102);
    return { s: 0, v: v101 };
  }, arg60.sis);
}
function h_s213_geolocation() {
  return "geolocation" in navigator && navigator.geolocation !== undefined;
}
function h_s94_fn2(arg64) {
  try {
    arg64.close();
  } catch (v105) {}
}
function fn17(arg65) {
  return `${arg65.code ?? "NO_CODE"}: ${arg65}`;
}
async function sig_s95_atomics() {
  return h_s95_requestMediaKeySystemAccess()
    ? fn142(fn66(500, { s: -2, v: null }), async () => {
        const v106 = await h_s95_requestMediaKeySystemAccess2();
        if (v106[0] === -1) {
          return { s: -3, v: null };
        }
        return { s: 0, v: v106 };
      })
    : () => ({ s: -1, v: null });
}
function fn18() {
  return new TypeError("Can't pick from nothing");
}
async function fn19(arg66, arg67, arg68 = 16) {
  const v107 = Array(arg66.length);
  let v108 = Date.now();
  for (let v109 = 0; v109 < arg66.length; ++v109) {
    v107[v109] = arg67(arg66[v109], v109);
    const v110 = Date.now();
    if (v110 >= v108 + arg68) {
      v108 = v110;
      await fn7();
    }
  }
  return v107;
}
function fn20(arg69) {
  const [v111, v112] = fn111(arg69, "#"),
    [v113, v114] = fn111(v111, "?");
  let v115, v116;
  const v117 = /^((\w+:)?\/\/[^/]*)?((\/)(.*)|$)$/.exec(v113);
  if (v117) {
    v115 = (v117[1] || "") + (v117[4] || "");
    v116 = v117[5] || "";
  } else {
    v115 = "";
    v116 = v113;
  }
  return {
    origin: v115,
    path: v116,
    query: v114.length ? v114.join("?") : null,
    fragment: v112.length ? v112.join("#") : null,
  };
}
async function h_s214_storageBuckets() {
  const storageBuckets = navigator.storageBuckets;
  if (
    !storageBuckets ||
    typeof storageBuckets !== "object" ||
    typeof storageBuckets.open !== "function"
  ) {
    return { s: -1, v: null };
  }
  const v118 = Math.random().toString().split(".")[1];
  let v119;
  try {
    v119 = await storageBuckets.open(v118);
  } catch (v120) {
    if (fn118(v120)) {
      return { s: -101, v: null };
    }
    throw v120;
  }
  const indexedDB = v119.indexedDB;
  if (
    indexedDB === undefined ||
    typeof indexedDB.open !== "function" ||
    typeof v119.estimate !== "function"
  ) {
    return { s: -1, v: null };
  }
  try {
    const v121 = await new Promise((arg70, arg71) => {
        try {
          const v122 = indexedDB.open("1");
          v122.onupgradeneeded = () => {
            v122.result.createObjectStore("s", { keyPath: "k" });
          };
          v122.onsuccess = async () => {
            v122.result.close();
            arg70(await v119.estimate());
          };
          v122.onerror = () => {
            arg71(readVaultedProp(v122, "error"));
          };
        } catch (v123) {
          arg71(v123);
        }
      }),
      usage = v121?.usage;
    if (usage === undefined || typeof usage !== "number") {
      return { s: -3, v: null };
    }
    return { s: 0, v: usage };
  } finally {
    if (typeof storageBuckets.delete === "function") {
      storageBuckets.delete(v118).catch(() => {});
    }
  }
}
function sig_s215_publicKeyCredential() {
  return fn142(fn66(450, { s: -2, v: null }), h_s215_publicKeyCredential);
}
function fn21(arg72) {
  arg72.then(undefined, () => {});
  return arg72;
}
async function h_s70_fn2(arg73, arg74) {
  const v124 = Array.from(arg73?.features.values()),
    [v125, v126] = await Promise.all([
      h_s70_getPreferredCanvasFormat(arg73, v124, arg74),
      h_s70_fn7(arg73),
    ]);
  return [v125, v126, v124];
}
function fn22(arg75, arg76, arg77) {
  if (arg75 === undefined) {
    return [arg76];
  }
  let v127,
    v128 = false;
  if (withoutDefault(arg75)) {
    v128 = true;
    v127 = fn92(arg75.value);
  } else {
    v127 = fn92(arg75);
  }
  const v129 = [];
  for (const v130 of v127) {
    const v131 = fn6(v130, arg77);
    if (v131) {
      v129.push(v131.href);
    }
  }
  if (!v128) {
    v129.push(arg76);
  }
  return v129;
}
function fn23() {
  const v132 = fn11(),
    v133 = fn46();
  return v132
    ? fn9([
        !("SharedWorker" in window),
        navigator.connection && "ontypechange" in navigator.connection,
        !("sinkId" in new Audio()),
      ]) >= 2
    : !!v133 &&
        fn9([
          "onorientationchange" in window,
          "orientation" in window,
          /android/i.test(navigator.appVersion),
        ]) >= 2;
}
function fn24() {
  crypto.getRandomValues(uint8Array);
  return uint8Array[0];
}
function fn25() {
  return (
    fn9([
      "ApplePayError" in window,
      "CSSPrimitiveValue" in window,
      "Counter" in window,
      navigator.vendor.indexOf("Apple") === 0,
      "RGBColor" in window,
      "WebKitMediaKeys" in window,
    ]) >= 4
  );
}
function xorAgainstName(arg78, arg79, arg80) {
  const text = resolveNameByHash(arg78, arg79);
  if (!text) {
    return "";
  }
  const v134 = base64Decode(arg80),
    v135 = Array(v134.length);
  for (let v136 = 0; v136 < v134.length; v136++) {
    v135[v136] = v134[v136] ^ text.charCodeAt(v136 % text.length);
  }
  return String.fromCharCode.apply(null, v135);
}
function fn26(arg81, arg82, arg83, arg84) {
  const v137 = (function (arg85) {
      const v140 = [...arg85];
      return {
        current: () => v140[0],
        postpone() {
          const v141 = v140.shift();
          if (v141 !== undefined) {
            v140.push(v141);
          }
        },
        exclude() {
          v140.shift();
        },
      };
    })(arg81),
    v138 = fn56(arg83, arg84),
    v139 = new Set();
  return [
    v137.current(),
    (arg86, arg87, arg88) => {
      const v142 = arg82(arg86, arg87, arg88);
      if (v142.action === "exclude") {
        v137.exclude();
      } else {
        v137.postpone();
      }
      const v143 = () => Math.max(0, arg86.getTime() + v138() - Date.now());
      let v144;
      v144 = typeof v142.delay == "number" ? v142.delay : v143();
      const v145 = v137.current();
      if (v144 === 0 && v145) {
        if (Date.now() - arg86.getTime() < 50) {
          if (v139.has(v145)) {
            v144 = v143();
          } else {
            v139.add(v145);
          }
        }
      }
      return v145 === undefined ? undefined : [v145, v144];
    },
  ];
}
function fn27(arg89) {
  if (arg89) {
    return {
      p: arg89.path ? 1 : undefined,
      q: arg89.query ? 1 : undefined,
      f: arg89.fragment ? 1 : undefined,
    };
  }
}
function fn28(arg90, arg91, arg92) {
  fn8((arg93) => {
    !(function (arg94, arg95) {
      fn47(arg94, "", -1, arg95);
    })(arg90, arg93);
  });
  if (!(arg92 < 0)) {
    fn8((arg96) => {
      fn47(arg90, arg91, arg92, arg96);
      return h_s55_fn8(arg90) === arg91;
    });
  }
}
function h_s70_fn3(canvas) {
  return h_s70_fn6(hash128(canvas.toDataURL()));
}
function sig_s48() {
  const v146 = function (arg97, arg98) {
      return arg97 * arg98;
    },
    v147 = [];
  let v148 = Math.random();
  for (let v149 = 24575; v149 >= 0; --v149) {
    if (v149 % 4096 === 0) {
      const v150 = Math.random();
      v147.push(v146(v148 - v150, 2 ** 31) | 0);
      v148 = v150;
    }
  }
  return { s: 0, v: v147 };
}
async function h_s215_publicKeyCredential() {
  const publicKeyCredential = window.PublicKeyCredential;
  if (!publicKeyCredential || typeof publicKeyCredential.getClientCapabilities !== "function") {
    return { s: -1, v: null };
  }
  const v151 = await publicKeyCredential.getClientCapabilities(),
    v152 = {};
  for (const [v153, v154] of Object.entries(v151)) {
    const v155 = h_s215_fn[v153];
    if (v155 !== undefined) {
      v152[v155] = v154;
    }
  }
  return { s: 0, v: v152 };
}
function sig_s160_origin(arg99) {
  return fn161(arg99, h_s160_fn);
}
async function sig_s211_decodingInfo() {
  if (!("mediaCapabilities" in navigator)) {
    return { s: -1, v: null };
  }
  return {
    s: 0,
    v: await Promise.all(
      h_s211_fn6.map(async (arg100) => {
        try {
          const v156 = await navigator.mediaCapabilities.decodingInfo(arg100);
          let v157 = 0;
          if (v156.supported) {
            v157 += 1;
          }
          if (v156.smooth) {
            v157 += 2;
          }
          if (v156.powerEfficient) {
            v157 += 4;
          }
          return v157;
        } catch (v158) {
          return v158 instanceof Error ? readVaultedProp(v158, "message") : String(v158);
        }
      }),
    ),
  };
}
function fn29(arg101) {
  var v159;
  const v160 = (function (arg102) {
      const v162 = arg102.filter((arg103) => !!arg103);
      return v162.length
        ? (...arg104) => {
            for (const v163 of v162) {
              fn163(() => v163(...arg104));
            }
          }
        : undefined;
    })([fn72() && fn2(), ...(arg101?.modules || []).map((arg105) => arg105.addEvent)]),
    v161 =
      v160 &&
      (function (arg106, arg107) {
        return (arg108) => {
          const v164 = { ...arg108, agentId: arg107 };
          return arg106(v164);
        };
      })(v160, h_s85_fn(8));
  fn94(v161, () => ({ e: 0, version: "4.1.4", options: arg101 }));
  try {
    const {
      apiKey: apiKey,
      region: v165 = "us",
      storageKeyPrefix: v166 = "_vid_",
      endpoints: endpoints,
      te: te,
      integrationInfo: v167 = [],
      imi: v168 = { m: "s" },
      urlHashing: urlHashing,
      modules: modules,
      abTests: v169 = {},
      externalABSelections: v170 = {},
      optimizeRepeatedVisits: v171 = false,
      aggressiveOptimization: v172 = false,
      extendedSignalCollection: v173 = true,
      webRtcViaPort80: v174 = false,
      worker: worker,
      cache: cache,
    } = arg101;
    if (!apiKey) {
      throw new fingerprintError(v1.api_key_missing, "api_key_missing");
    }
    if (typeof apiKey != "string") {
      throw new fingerprintError(v1.api_key_invalid, "api_key_invalid");
    }
    if (
      cache &&
      !(function (arg109) {
        return (
          !!arg109 &&
          ((v182 = arg109.duration),
          (typeof v182 == "number" && v182 > 0 && v182 <= 43200) || v26.includes(v182)) &&
          agentList.includes(arg109.storage)
        );
        var v182;
      })(cache)
    ) {
      throw new fingerprintError(v1.cache_misconfigured, "cache_misconfigured");
    }
    if (
      (function () {
        try {
          document.cookie;
          return false;
        } catch (v183) {
          return h_s55_fn4(v183);
        }
      })()
    ) {
      throw new fingerprintError(v1.sandboxed_iframe, "sandboxed_iframe");
    }
    const v175 = (function (arg110) {
        const v184 = (arg111) => {
          if (arg111 instanceof Worker) {
            return arg111;
          }
          throw wrongWorkerOption();
        };
        if (arg110 instanceof Worker) {
          return arg110;
        }
        if (!fn4(arg110)) {
          throw wrongWorkerOption();
        }
        return fn21(arg110).then(v184);
      })(worker),
      v176 = (function (arg112, arg113, arg114) {
        const v185 = { ...arg114 },
          v186 = Object.entries(arg112);
        for (const [v187, v188] of v186) {
          const v189 = arg113[v187];
          if (v189) {
            try {
              v185[v187] = fn121(v189);
              continue;
            } catch (v190) {
              console.error(v190);
            }
          }
          v185[v187] = fn121(v188);
        }
        return v185;
      })(
        (function (arg115) {
          const v191 = { ...v16 };
          for (const v192 of arg115) {
            Object.assign(v191, v192.ab);
          }
          return v191;
        })(modules),
        v169,
        v170,
      ),
      v177 = (function (arg116, arg117, arg118) {
        if (arg116 === undefined) {
          return { helper: [arg118(arg117)], ingress: [arg117] };
        }
        if (fn63(arg116)) {
          const v193 = (function (arg119, arg120, arg121) {
            let v194,
              v195 = false;
            if (withoutDefault(arg119)) {
              v195 = true;
              v194 = fn92(arg119.value);
            } else {
              v194 = fn92(arg119);
            }
            const v196 = [],
              v197 = [];
            for (const v198 of v194) {
              const v199 = fn6(v198, "endpoints");
              if (v199) {
                v196.push(fn61(v199, arg121));
                v197.push(v199.href);
              }
            }
            if (!v195) {
              v196.push(arg121(arg120));
              v197.push(arg120);
            }
            return { helper: v196, ingress: v197 };
          })(arg116, arg117, arg118);
          return { helper: v193.helper, ingress: v193.ingress };
        }
        if (
          (function (arg122) {
            if (!arg122 || typeof arg122 != "object") {
              return false;
            }
            const v200 = arg122;
            return (
              typeof v200.__type__ == "string" &&
              fn48(v200.__type__) === 694409711 &&
              (v200.script === undefined || fn63(v200.script)) &&
              (v200.helper === undefined || fn63(v200.helper)) &&
              (v200.ingress === undefined || fn63(v200.ingress))
            );
          })(arg116)
        ) {
          return {
            helper: fn22(arg116.helper, arg118(arg117), "helper"),
            ingress: fn22(arg116.ingress, arg117, "ingress"),
          };
        }
        return null;
      })(
        endpoints,
        (function (arg123) {
          let v201 = "api.fpjs.io";
          if (arg123 !== "us") {
            v201 = "" + arg123 + "." + v201 + "";
          }
          return "https://" + v201 + "/";
        })(v165),
        fn77,
      );
    if (v177 === null) {
      throw new fingerprintError(v1.endpoints_misconfigured, "endpoints_misconfigured");
    }
    const v178 =
      (v159 = (function (arg124) {
        for (const v202 of arg124) {
          if (v202.browserCache) {
            return v202.browserCache;
          }
        }
        return;
      })(modules)) == null
        ? undefined
        : v159(v177.helper, apiKey, undefined, v161);
    fn94(v161, () => ({ e: 12 }));
    const v179 = (function (arg125, arg126) {
        return arg125 === undefined ? fn139(arg126) : String(arg125);
      })(te, v165),
      v180 = { aq: [], ipq: false, si: null, siw: null, ip: null, dc: { adb: 0, crs: 0, asib: 0 } };
    !(function (arg127, arg128 = 50) {
      arg127.ip = fn21(
        (async function (arg129, arg130) {
          const { dc: dc } = arg129;
          for (; !document.body;) {
            dc.adb++;
            await fn125(arg130);
          }
          const iframe = document.createElement("iframe");
          await new Promise((arg131, arg132) => {
            let v203 = false;
            const v204 = () => {
                v203 = true;
                arg131();
              },
              v205 = (arg133) => {
                v203 = true;
                arg132(arg133);
              };
            iframe.onload = v204;
            iframe.onerror = v205;
            const { style: style3 } = iframe;
            style3.setProperty("display", "block", "important");
            style3.position = "absolute";
            style3.top = "0";
            style3.left = "0";
            style3.visibility = "hidden";
            iframe.src = "about:blank";
            document.body.appendChild(iframe);
            const complete = () => {
              dc.crs++;
              if (!v203) {
                if (iframe.contentWindow?.document?.readyState === "complete") {
                  v204();
                } else {
                  setTimeout(complete, 10);
                }
              }
            };
            complete();
          });
          for (; !iframe.contentWindow?.document?.body;) {
            dc.asib++;
            await fn125(arg130);
          }
          arg129.si = iframe;
          arg129.siw = iframe.contentWindow;
        })(arg127, arg128),
      );
    })(v180);
    const { getComponents: getComponents, collectWorkerComponents: collectWorkerComponents } =
        (function (arg134, arg135, arg136, arg137, arg138, arg139, arg140, arg141, arg142) {
          const v206 = {
              urlHashing: arg138,
              ab: arg139,
              te: arg137,
              sis: arg140,
              esc: arg141,
              ewr: arg142,
            },
            v207 = (function (arg143, arg144) {
              const v209 = { ...arg144, sis: undefined, cache: undefined },
                v210 = fn21(
                  (async function (arg145, arg146) {
                    const v212 = await arg145;
                    fn134(v212, 0);
                    await fn33(v212, [1, 2]);
                    await (async function (arg147, arg148) {
                      fn134(arg147, 3, arg148);
                      const v213 = await fn33(arg147, [4, 5]);
                      if (v213[0] === 5) {
                        throw fn145(v213);
                      }
                    })(v212, arg146);
                    return v212;
                  })(arg143, v209),
                );
              let v211;
              return async () => {
                if (!(v211 != null)) {
                  v211 = v210.then(fn79);
                }
                try {
                  return await v211;
                } catch (v214) {
                  throw (function (arg149) {
                    if (arg149 instanceof fingerprintError) {
                      return arg149;
                    }
                    const workerinitializationfailed = v1.worker_initialization_failed;
                    let v215;
                    if (arg149 instanceof Error) {
                      v215 = `${arg149.name}: ${arg149.message}`;
                    } else {
                      if (arg149 != null) {
                        v215 = String(arg149);
                      }
                    }
                    return new fingerprintError(
                      v215 ? `${workerinitializationfailed}. ${v215}` : workerinitializationfailed,
                      "worker_initialization_failed",
                    );
                  })(v214);
                }
              };
            })(arg134, v206),
            v208 = (function (arg150, arg151, arg152) {
              const v216 = { ...arg152, cache: {} },
                [v217, v218] = (function (arg153) {
                  const v222 = {},
                    v223 = {},
                    v224 = {};
                  for (const { sources: sources } of arg153) {
                    if (sources) {
                      Object.assign(v222, sources.stage1);
                      Object.assign(v223, sources.stage2);
                      Object.assign(v224, sources.stage3);
                    }
                  }
                  const v225 = v223;
                  Object.assign(v225, v224);
                  return [v222, v225];
                })(arg150),
                v219 = arg151 ? 1e5 : 50,
                v220 = fn148(v217, v216, [], v219),
                v221 = fn21(
                  (function (arg154 = 50) {
                    return (function (arg155, arg156 = Infinity) {
                      const { requestIdleCallback: requestIdleCallback } = window;
                      return requestIdleCallback
                        ? new Promise((arg157) =>
                            requestIdleCallback.call(window, () => arg157(), { timeout: arg156 }),
                          )
                        : fn168(Math.min(arg155, arg156));
                    })(arg154, 2 * arg154);
                  })(8).then(() => fn148(v218, v216, [], v219)),
                );
              return async () => {
                const [v226, v227] = await Promise.all([v220(), v221.then((arg158) => arg158())]);
                !(function (arg159) {
                  const { si: si, aq: aq } = arg159;
                  if (si && si.parentNode) {
                    si.parentNode.removeChild(si);
                  }
                  arg159.si = null;
                  arg159.siw = null;
                  arg159.ip = null;
                  for (; aq.length > 0;) {
                    const v229 = aq.shift();
                    if (v229) {
                      v229.reject(new Error("Iframe cleanup called"));
                    }
                  }
                  arg159.ipq = false;
                })(v216.sis);
                const v228 = v227;
                Object.assign(v228, v226);
                return v228;
              };
            })(arg135, arg136, v206);
          return {
            getComponents: async () => {
              const [v230, v231] = await Promise.all([v207(), v208()]);
              Object.assign(v231, v230);
              return v231;
            },
            collectWorkerComponents: v207,
          };
        })(v175, modules, v172, v179, urlHashing, v176, v180, v173, v174),
      v181 = (function (
        arg160,
        arg161,
        arg162,
        arg163,
        arg164,
        arg165,
        arg166,
        arg167,
        arg168,
        arg169,
        arg170,
        arg171,
        arg172,
        arg173,
      ) {
        const v232 = {
          modules: arg160,
          apiKey: arg164,
          ii: arg167,
          imi: arg168,
          storageKeyPrefix: arg166,
          ab: arg170,
          urlHashing: arg169,
        };
        function fn174(arg174) {
          if (!arg173) {
            return;
          }
          const v243 = h_s85_fn(8);
          switch (arg174) {
            case "get":
              return (function (arg175, arg176) {
                return (arg177) => {
                  const v244 = { ...arg177, getCallId: arg176 };
                  return arg175(v244);
                };
              })(arg173, v243);
            case "collect":
              return (function (arg178, arg179) {
                return (arg180) => {
                  const v245 = { ...arg180, collectCallId: arg179 };
                  return arg178(v245);
                };
              })(arg173, v243);
          }
        }
        const clientTimeout = (arg181) =>
            fn66(arg181 != null ? arg181 : 1e4).then(() =>
              Promise.reject(new fingerprintError(v1.client_timeout, "client_timeout")),
            ),
          v233 = (arg182 = {}) => {
            const v246 = fn174("collect");
            return fn86(
              v246,
              () => ({ e: 21, options: arg182 }),
              (arg183) => ({ e: 22, result: arg183 }),
              (arg184) => ({ e: 23, error: arg184 }),
              () => fn144((arg185) => v234(arg182, v246, arg185)),
            );
          },
          v234 = async (arg186, arg187, arg188) => {
            var v247;
            const v248 = clientTimeout(arg186.timeout);
            arg188(await v235(arg186, v248, arg187));
            for (const v249 of arg160) {
              if (!((v247 = v249.onCollectResponse) == null)) {
                v247.call(v249, arg166);
              }
            }
          },
          v235 = async (
            { timeout: arg191 = 1e4, tag: arg189, linkedId: arg190 },
            arg192,
            arg193,
          ) => {
            const v250 = fn21(Promise.all([v242(arg193), v241(arg191, arg193)])),
              [v251, v252] = await Promise.race([arg192, v250]),
              v253 = await buildEnvelope({
                ...v232,
                components: v251,
                tag: arg189,
                browserCache: v252,
                linkedId: fn45(arg190),
              });
            return await (async function (arg194, arg195) {
              const v254 = [fn104(), []],
                v255 = encodeJsonBytes(v254),
                v256 = encodeJsonBytes(arg194),
                [v257, v258] = fn95(v256) ? await compressPayload(v256) : [false, v256],
                v259 = fn128(v258, v257);
              fn94(arg195, () => ({
                e: 24,
                agentMetadata: v254,
                body: arg194,
                isCompressed: v257,
              }));
              return `${fn169(v255)}:${fn169(v259)}`;
            })(v253, arg193);
          },
          v236 = arg172
            ? (function (arg196, arg197, arg198) {
                let v260 = arg196;
                if (
                  !(function (arg199) {
                    switch (arg199) {
                      case "sessionStorage":
                        try {
                          window.sessionStorage.getItem("item");
                        } catch (v266) {
                          return false;
                        }
                        return true;
                      case "localStorage":
                        try {
                          window.localStorage.getItem("item");
                        } catch (v267) {
                          return false;
                        }
                        return true;
                      case "agent":
                        return true;
                      default:
                        return false;
                    }
                  })(arg196)
                ) {
                  v260 = "agent";
                }
                const v261 = (function (arg200, arg201) {
                  switch (arg200) {
                    case "localStorage":
                      return fn127("localStorage", arg201);
                    case "sessionStorage":
                      return fn127("sessionStorage", arg201);
                    case "agent":
                      return (function () {
                        const v268 = {},
                          v269 = (arg202, arg203) => {
                            v268[arg202] = arg203;
                          },
                          v270 = (arg204) => {
                            const v272 = v268[arg204];
                            if (v272) {
                              return v272;
                            }
                          },
                          v271 = (arg205) => {
                            !(function (arg206, arg207) {
                              const v273 = Object.getOwnPropertyDescriptor?.call(
                                Object,
                                arg206,
                                arg207,
                              );
                              if (v273?.configurable) {
                                delete arg206[arg207];
                              } else {
                                if (!(v273 && !v273.writable)) {
                                  arg206[arg207] = undefined;
                                }
                              }
                            })(v268, arg205);
                          };
                        return { set: v269, get: v270, remove: v271 };
                      })();
                    default:
                      return null;
                  }
                })(v260, arg198);
                if (!v261) {
                  return null;
                }
                const v262 = typeof arg197 == "number" ? arg197 : v27[arg197];
                function fn175(arg208) {
                  return { body: arg208, expiresAt: Math.floor(Date.now() / 1e3) + v262 };
                }
                const v263 = (arg209) => {
                    const v274 = v261.get(arg209.toKey());
                    if (!v274) {
                      return;
                    }
                    const v275 = Math.floor(Date.now() / 1e3);
                    if (!(v274.expiresAt < v275)) {
                      return v274.body;
                    }
                    v261.remove(arg209.toKey());
                  },
                  v264 = (arg210, arg211) => {
                    const v276 = fn175(arg211);
                    try {
                      v261.set(arg210.toKey(), v276);
                    } catch (v277) {}
                  },
                  v265 = (arg212) => {
                    v261.remove(arg212.toKey());
                  };
                return { get: v263, set: v264, remove: v265 };
              })(arg172.storage, arg172.duration, arg172.cachePrefix)
            : undefined,
          v237 = (arg213 = {}) => {
            const v278 = fn174("get");
            return fn86(
              v278,
              () => ({ e: 3, options: arg213 }),
              (arg214) => ({ e: 4, result: arg214 }),
              (arg215) => ({ e: 5, error: arg215 }),
              () => fn144((arg216) => v238(arg213, v278, arg216)),
            );
          },
          v238 = async (arg217, arg218, arg219) => {
            const v279 = v236?.get(fn135(arg217));
            if (v279) {
              arg219({ ...v279, cache_hit: true });
              return void fn21(arg162());
            }
            const v280 = fn108();
            try {
              const v281 = v15(v280),
                v282 = clientTimeout(arg217.timeout),
                v283 = v239(arg217, v281, arg218),
                v284 = await visitorNotFound(arg217, v281, v282, arg218);
              if (v284) {
                arg219(v284);
                await v283(v284.event_id, v282);
              } else {
                const v285 = await v283(undefined, v282);
                if (!(v236 == null)) {
                  v236.set(fn135(arg217), { ...v285 });
                }
                if (v236) {
                  v285.cache_hit = false;
                }
                arg219(v285);
              }
            } finally {
              v280.resolve();
            }
          },
          visitorNotFound = async ({ tag: arg220, linkedId: arg221 }, arg222, arg223, arg224) => {
            if (!arg171) {
              return;
            }
            const v286 = await v240();
            let v287 = false;
            arg223.catch(() => (v287 = true));
            try {
              return await fn70(
                arg165,
                { ...v232, tag: arg220, linkedId: fn45(arg221), browserCache: v286, fast: true },
                arg222,
                arg223,
                arg224,
              );
            } catch (v288) {
              if (v287) {
                throw v288;
              }
              return void (
                (v288 instanceof fingerprintError && v288.code === "visitor_not_found") ||
                console.warn(v288)
              );
            }
          },
          v239 = ({ timeout: arg227 = 1e4, tag: arg225, linkedId: arg226 }, arg228, arg229) => {
            const v289 = fn21(Promise.all([v242(arg229), v241(arg227, arg229)]));
            return async (arg230, arg231) => {
              const [v290, v291] = await Promise.race([arg231, v289]);
              return await fn70(
                arg165,
                {
                  ...v232,
                  components: v290,
                  tag: arg225,
                  browserCache: v291,
                  linkedId: fn45(arg226),
                  eventId: arg230,
                },
                arg228,
                arg231,
                arg229,
              );
            };
          },
          v240 = () => (arg163 == null ? undefined : arg163(0, 50, undefined)),
          v241 = (arg232, arg233) =>
            arg163 == null ? undefined : arg163(0.1 * arg232, 0.4 * arg232, arg233),
          v242 = async (arg234) => {
            try {
              const v292 = await arg161();
              fn94(arg234, () => ({ e: 13, result: v292 }));
              return v292;
            } catch (v293) {
              throw (fn94(arg234, () => ({ e: 14, error: v293 })), v293);
            }
          };
        return { get: v237, collect: v233 };
      })(
        modules,
        getComponents,
        collectWorkerComponents,
        v178,
        apiKey,
        v177.ingress,
        v166,
        v167,
        v168,
        urlHashing,
        v176,
        v171,
        cache,
        v161,
      );
    fn94(v161, () => ({ e: 1, ab: v176 }));
    return v181;
  } catch (v294) {
    throw (fn94(v161, () => ({ e: 2, error: v294 })), v294);
  }
}
function sig_s132() {
  if (window.close === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: window.close.toString() };
}
function h_s70_fn4(arg235) {
  if (arg235 instanceof TypeError && h_s70_fn5(readVaultedProp(arg235, "message"))) {
    return { s: -7, v: null };
  }
  throw arg235;
}
async function sig_s97_dataTransfer() {
  return await fn142(fn66(500, { s: -2, v: null }), async () => {
    if (h_s97_fn2()) {
      if (fn99()) {
        return { s: 0, v: await h_s97_fn3() };
      }
      return { s: -1, v: null };
    }
    return { s: -3, v: null };
  });
}
function h_s26_mediaDevices() {
  return (
    "mediaDevices" in navigator &&
    navigator.mediaDevices !== undefined &&
    typeof navigator.mediaDevices.enumerateDevices === "function"
  );
}
function fn30({ origin: arg236, path: arg237, query: arg238, fragment: arg239 }) {
  return (
    arg236 + arg237 + (arg238 === null ? "" : `?${arg238}`) + (arg239 === null ? "" : `#${arg239}`)
  );
}
function sig_s145() {
  const webkitPersistentStorageList = ["webkitPersistentStorage", "connectionSpeed", "xr", "hid"],
    v295 = [];
  for (const v296 of Object.getOwnPropertyNames(Object.getPrototypeOf(navigator))) {
    if (!webkitPersistentStorageList.includes(v296)) {
      try {
        const v297 = navigator[v296];
        if (typeof v297 == "function" && v297.name !== undefined) {
          v295.push(v297.name);
        }
      } catch (v298) {
        return { s: -1, v: [v298 instanceof Error ? v298.message : String(v298)] };
      }
    }
  }
  return { s: 0, v: v295 };
}
function h_s211_fn(arg240, arg241 = h_s211_fn3, arg242 = null, arg243 = h_s211_fn5) {
  const v299 = {
    type: ((v300 = vault_nd), (v301 = 1), v300(v301)),
    video: { contentType: arg240, ...arg241 },
  };
  var v300, v301;
  if (arg242) {
    return { ...v299, audio: { contentType: arg242, ...arg243 } };
  }
  return v299;
}
async function h_s95_fn(arg244, arg245) {
  const v302 = arg244.createSession();
  await v302.generateRequest("webm", arg245);
  return Number(v302.sessionId);
}
let h_s6_fn, h_s6_fn2;
function fn31(arg246, arg247) {
  return Object.assign(arg246, { cancel: arg247 });
}
function h_s36_createElement(arg248) {
  const [v303, v304] = (function (arg249) {
      const v305 = `Unexpected syntax '${arg249}'`,
        v306 = /^\s*([a-z-]*)(.*)$/i.exec(arg249),
        v307 = v306[1] || undefined,
        v308 = {},
        v309 = /([.:#][\w-]+|\[.+?\])/gi,
        v310 = (arg250, arg251) => {
          v308[arg250] = v308[arg250] || [];
          v308[arg250].push(arg251);
        };
      for (;;) {
        const v311 = v309.exec(v306[2]);
        if (!v311) {
          break;
        }
        const v312 = v311[0];
        switch (v312[0]) {
          case ".":
            v310("class", v312.slice(1));
            break;
          case "#":
            v310("id", v312.slice(1));
            break;
          case "[": {
            const v313 = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(v312);
            if (!v313) {
              throw new Error(v305);
            }
            v310(v313[1], v313[4] ?? v313[5] ?? "");
            break;
          }
          default:
            throw new Error(v305);
        }
      }
      return [v307, v308];
    })(arg248),
    element2 = document.createElement(v303 != null ? v303 : "div");
  for (const v314 of Object.keys(v304)) {
    const v315 = v304[v314].join(" ");
    if (v314 === "style") {
      h_s36_fn2(element2.style, v315);
    } else {
      element2.setAttribute(v314, v315);
    }
  }
  return element2;
}
function h_s95_requestMediaKeySystemAccess() {
  return typeof navigator.requestMediaKeySystemAccess === "function";
}
function readVaultedProp(arg252, arg253) {
  const v316 = arg252[resolveNameByHash(arg252, arg253)];
  return typeof v316 == "function" ? v316.bind(arg252) : v316;
}
function h_s55_cookie(arg254, arg255) {
  try {
    document.cookie;
  } catch (v317) {
    if (h_s55_fn4(v317)) {
      return arg255;
    }
    throw v317;
  }
  return arg254();
}
function h_s94_fn3(arg256, arg257, arg258) {
  const v318 = { credential: "admin" };
  v318.urls = h_s94_fn9(arg257, arg258);
  v318.username = arg256;
  const v319 = {};
  v319.iceServers = [v318];
  return v319;
}
function h_s86_onafterprint() {
  return (
    fn36([
      "maxTouchPoints" in navigator,
      "mediaCapabilities" in navigator,
      "PointerEvent" in window,
      "visualViewport" in window,
      "onafterprint" in window,
    ]) >= 4
  );
}
function sig_s33_brave() {
  var v320;
  if (!fn11()) {
    return h_s33_fn(false);
  }
  try {
    const v321 = Navigator.prototype,
      v322 =
        ((v320 = document.featurePolicy) == null ? undefined : v320.features)?.call(v320) || [];
    return h_s33_fn(
      fn36([
        "brave" in v321,
        "braveSolana" in window,
        "braveEthereum" in window,
        ["cardano", "solana", "ethereum"].some((arg259) => v322.includes(arg259)),
        !("connection" in v321),
      ]) >= 2,
    );
  } catch (v323) {
    return h_s33_fn(false);
  }
}
function fn32(arg260) {
  return typeof arg260 == "object" && arg260 !== null && !Array.isArray(arg260);
}
function h_s6_availLeft() {
  return [
    fn170(fn113(screen.availTop), null),
    fn170(fn113(screen.width) - fn113(screen.availWidth) - fn170(fn113(screen.availLeft), 0), null),
    fn170(
      fn113(screen.height) - fn113(screen.availHeight) - fn170(fn113(screen.availTop), 0),
      null,
    ),
    fn170(fn113(screen.availLeft), null),
  ];
}
function fn33(arg261, arg262) {
  return new Promise((arg263) => {
    const v324 = fn81(arg261, "message", ({ data: arg264 }) => {
      if (arg264 instanceof Array && arg262.includes(arg264[0])) {
        v324();
        arg263(arg264);
      }
    });
  });
}
function fn34(arg265) {
  const result = arg265[13]?.event.result;
  if (!result) {
    return {};
  }
  const v325 = {};
  for (const v326 in result) {
    v325[v326] = Math.round(result[v326].duration);
  }
  return v325;
}
async function sig_s163_applePayError(arg266) {
  if (fn11() || fn25()) {
    return await h_s163_fn(arg266);
  }
  return { s: -1, v: null };
}
function h_s209_fn(arg267, arg268, arg269, arg270) {
  return function () {
    const v327 = arg268 << 9;
    let v328 = 5 * arg267;
    v328 = 9 * ((v328 << 7) | (v328 >>> 25));
    arg270 ^= arg268;
    arg268 ^= arg269 ^= arg267;
    arg267 ^= arg270;
    arg269 ^= v327;
    arg270 = (arg270 << 11) | (arg270 >>> 21);
    return (v328 >>> 0) / 4294967296;
  };
}
function fn35(arg271) {
  return (
    arg271 !== null &&
    typeof arg271 == "object" &&
    "name" in arg271 &&
    arg271.name === "FingerprintError" &&
    "code" in arg271
  );
}
function fn36(arg272) {
  return arg272.reduce((arg273, arg274) => arg273 + (arg274 ? 1 : 0), 0);
}
function fn37(arg275, arg276) {
  const v329 = fn116(arg275);
  if (arg276.size === 0) {
    return;
  }
  const v330 = fn153(v329).filter((arg277) => !arg276.has(arg277[0]));
  if (v330.length !== 0) {
    fn152(v329, JSON.stringify(v330));
  } else {
    (function (arg278) {
      var v331;
      try {
        if (!((v331 = localStorage?.removeItem) == null)) {
          v331.call(localStorage, arg278);
        }
      } catch (v332) {}
    })(v329);
  }
}
function fn38(arg279, arg280) {
  const v333 = arg279.length + arg280.length,
    uint8Array7 = new Uint8Array(v333);
  for (let v334 = 0; v334 < arg279.length; v334++) {
    uint8Array7[v334] = arg279[v334];
  }
  for (let v335 = 0; v335 < arg280.length; v335++) {
    uint8Array7[v335 + arg279.length] = arg280[v335];
  }
  return uint8Array7;
}
function fn39() {
  var v336;
  return (
    !fn11() ||
    !("featurePolicy" in document) ||
    !!((v336 = document.featurePolicy) == null
      ? undefined
      : v336.allowedFeatures().includes("encrypted-media"))
  );
}
function wrongWorkerOption() {
  return new fingerprintError(v1.wrong_worker_option, "wrong_worker_option");
}
const h_s46_fn = Math,
  h_s46_fn2 = () => 0;
function sig_s153_onLine() {
  return { s: 0, v: Boolean(navigator.onLine) };
}
function sig_s209_getRandomValues() {
  const v337 = function (arg281, arg282, arg283, arg284, arg285) {
      return arg281(arg282, arg283, arg284, arg285);
    },
    canvas2 = document.createElement("canvas"),
    v338 = canvas2.getContext("2d");
  if (!v338) {
    return { s: -1, v: null };
  }
  canvas2.width = 4;
  canvas2.height = 4;
  const v339 = h_s209_getRandomValues(),
    v340 = v337(h_s209_fn, v339[0], v339[1], v339[2], v339[3]);
  for (let v342 = 0; v342 < 4; v342++) {
    for (let v343 = 0; v343 < 4; v343++) {
      const v344 = Math.floor(v340() * 256),
        v345 = Math.floor(v340() * 256),
        v346 = Math.floor(v340() * 256);
      v338.fillStyle = "rgba(" + v344 + "," + v345 + "," + v346 + ",255)";
      v338.fillRect(v343, v342, 1, 1);
    }
  }
  const v341 = v338.getImageData(
    0,
    0,
    readVaultedProp(canvas2, "width"),
    readVaultedProp(canvas2, "height"),
  );
  return { s: 0, v: { s: v339, p: Array.from(readVaultedProp(v341, "data")), d: 4 } };
}
const h_s75_fn = new Set([
    10752, 2849, 2884, 2885, 2886, 2928, 2929, 2930, 2931, 2932, 2960, 2961, 2962, 2963, 2964, 2965,
    2966, 2967, 2968, 2978, 3024, 3042, 3088, 3089, 3106, 3107, 32773, 32777, 32777, 32823, 32824,
    32936, 32937, 32938, 32939, 32968, 32969, 32970, 32971, 3317, 33170, 3333, 3379, 3386, 33901,
    33902, 34016, 34024, 34076, 3408, 3410, 3411, 3412, 3413, 3414, 3415, 34467, 34816, 34817,
    34818, 34819, 34877, 34921, 34930, 35660, 35661, 35724, 35738, 35739, 36003, 36004, 36005,
    36347, 36348, 36349, 37440, 37441, 37443, 7936, 7937, 7938,
  ]),
  h_s75_fn2 = new Set([34047, 35723, 36063, 34852, 34853, 34854, 34229, 36392, 36795, 38449]),
  h_s75_fn3 = ["FRAGMENT_SHADER", "VERTEX_SHADER"],
  h_s75_lowFLOATList = [
    "LOW_FLOAT",
    "MEDIUM_FLOAT",
    "HIGH_FLOAT",
    "LOW_INT",
    "MEDIUM_INT",
    "HIGH_INT",
  ];
function fn40(arg286) {
  return typeof arg286 != "function";
}
function h_s91_prefersReducedTransparency(arg287) {
  return matchMedia(`(prefers-reduced-transparency: ${arg287})`).matches;
}
function permuteChars(arg288, arg289) {
  const v347 = arg288.join(""),
    v348 = v347.split(""),
    v349 = Array(v347.length);
  for (let v350 = 0; v350 < v349.length; ++v350) {
    v349[v350] = v348.splice(arg289[v350 % arg289.length], 1);
  }
  return v349.join("");
}
function sig_s30_doNotTrack() {
  const doNotTrack = navigator.doNotTrack;
  if (doNotTrack == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: doNotTrack };
}
const h_s36_div = async function ({ debug: arg290 } = {}) {
    if (!fn25() && !fn23()) {
      return;
    }
    const v351 = {
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
      v352 = Object.keys(v351),
      v353 = [].concat(...v352.map((arg291) => v351[arg291])),
      v354 = await (async function (arg292) {
        var parentElement;
        const element3 = document.createElement("div"),
          v356 = new Array(arg292.length),
          v357 = {};
        h_s36_fn(element3);
        for (let v358 = 0; v358 < arg292.length; ++v358) {
          const v359 = h_s36_createElement(arg292[v358]);
          if (v359.tagName === "DIALOG") {
            v359.show();
          }
          const element4 = document.createElement("div");
          h_s36_fn(element4);
          element4.appendChild(v359);
          element3.appendChild(element4);
          v356[v358] = v359;
        }
        for (; !document.body;) {
          await fn168(50);
        }
        document.body.appendChild(element3);
        try {
          for (let v360 = 0; v360 < arg292.length; ++v360) {
            if (!v356[v360].offsetParent) {
              v357[arg292[v360]] = true;
            }
          }
        } finally {
          if (!((parentElement = element3.parentNode) == null)) {
            parentElement.removeChild(element3);
          }
        }
        return v357;
      })(v353);
    if (arg290) {
      (function (arg293, arg294) {
        let v361 = "DOM blockers debug:\n```";
        for (const v362 of Object.keys(arg293)) {
          v361 += `\n${v362}:`;
          for (const v363 of arg293[v362]) {
            v361 += `\n  ${arg294[v363] ? "🚫" : "➡️"} ${v363}`;
          }
        }
        console.log(`${v361}\n\`\`\``);
      })(v351, v354);
    }
    const v355 = v352.filter((arg295) => {
      const v364 = v351[arg295];
      return fn9(v364.map((arg296) => v354[arg296])) > 0.6 * v364.length;
    });
    v355.sort();
    return v355;
  },
  h_s1_oscpu = function () {
    return navigator.oscpu;
  },
  h_s2_browserLanguage = function () {
    const v365 = [],
      language =
        navigator.language ||
        navigator.userLanguage ||
        navigator.browserLanguage ||
        navigator.systemLanguage;
    if (language !== undefined) {
      v365.push([language]);
    }
    if (Array.isArray(navigator.languages)) {
      if (!(
        fn11() &&
        (function () {
          return (
            fn9([
              !("MediaSettingsRange" in window),
              "RTCEncodedAudioFrame" in window,
              "" + window.Intl == "[object Intl]",
              "" + window.Reflect == "[object Reflect]",
            ]) >= 3
          );
        })()
      )) {
        v365.push(navigator.languages);
      }
    } else if (typeof navigator.languages == "string") {
      const languages = navigator.languages;
      if (languages) {
        v365.push(languages.split(","));
      }
    }
    return v365;
  },
  h_s3_colorDepth = function () {
    return window.screen.colorDepth;
  },
  h_s4_deviceMemory = function () {
    return fn170(fn113(navigator.deviceMemory), undefined);
  },
  h_s7_hardwareConcurrency = function () {
    return fn170(fn57(navigator.hardwareConcurrency), undefined);
  },
  h_s9_dateTimeFormat = function () {
    const dateTimeFormat = window.Intl?.DateTimeFormat;
    if (dateTimeFormat) {
      const timeZone = new dateTimeFormat().resolvedOptions().timeZone;
      if (timeZone) {
        return timeZone;
      }
    }
    const v366 = -(function () {
      const v367 = new Date().getFullYear();
      return Math.max(
        fn113(new Date(v367, 0, 1).getTimezoneOffset()),
        fn113(new Date(v367, 6, 1).getTimezoneOffset()),
      );
    })();
    return `UTC${v366 >= 0 ? "+" : ""}${v366}`;
  },
  h_s10_sessionStorage = function () {
    try {
      return !!window.sessionStorage;
    } catch (v368) {
      return true;
    }
  },
  h_s11_localStorage = function () {
    try {
      return !!window.localStorage;
    } catch (v369) {
      return true;
    }
  },
  h_s13_openDatabase = function () {
    return !!window.openDatabase;
  },
  h_s14_cpuClass = function () {
    return navigator.cpuClass;
  },
  h_s15_webkitRequestFullscreen = function () {
    const { platform: platform } = navigator;
    if (platform === "MacIntel" && fn25() && !fn14()) {
      return (function () {
        if (navigator.platform === "iPad") {
          return true;
        }
        const v370 = screen.width / screen.height;
        return (
          fn9([
            "MediaSource" in window,
            !!Element.prototype.webkitRequestFullscreen,
            v370 > 0.65 && v370 < 1.53,
          ]) >= 2
        );
      })()
        ? "iPad"
        : "iPhone";
    }
    return platform;
  },
  h_s16_plugins = function () {
    const plugins2 = navigator.plugins;
    if (!plugins2) {
      return;
    }
    const v371 = [];
    for (let v372 = 0; v372 < plugins2.length; ++v372) {
      const v373 = plugins2[v372];
      if (!v373) {
        continue;
      }
      const v374 = [];
      for (let v375 = 0; v375 < v373.length; ++v375) {
        const v376 = v373[v375];
        v374.push({ type: v376.type, suffixes: v376.suffixes });
      }
      v371.push({ name: v373.name, description: v373.description, mimeTypes: v374 });
    }
    return v371;
  },
  h_s19_touchEvent = function () {
    let v377,
      v378 = 0;
    if (navigator.maxTouchPoints !== undefined) {
      v378 = fn57(navigator.maxTouchPoints);
    } else {
      if (navigator.msMaxTouchPoints !== undefined) {
        v378 = navigator.msMaxTouchPoints;
      }
    }
    try {
      document.createEvent("TouchEvent");
      v377 = true;
    } catch (v380) {
      v377 = false;
    }
    const v379 = "ontouchstart" in window;
    return { maxTouchPoints: v378, touchEvent: v377, touchStart: v379 };
  },
  h_s27_vendor = function () {
    return navigator.vendor || "";
  },
  h_s28_fn = function () {
    const v381 = [];
    for (const v382 of [
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
      const v383 = window[v382];
      if (v383 && typeof v383 == "object") {
        v381.push(v382);
      }
    }
    return v381.sort();
  },
  h_s32_cookie = function () {
    try {
      document.cookie = "cookietest=1; SameSite=Strict;";
      const v384 = document.cookie.indexOf("cookietest=") !== -1;
      document.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return v384;
    } catch (v385) {
      return false;
    }
  },
  h_s37_colorGamut = function () {
    for (const v386 of ["rec2020", "p3", "srgb"]) {
      if (matchMedia(`(color-gamut: ${v386})`).matches) {
        return v386;
      }
    }
  },
  h_s41_fn = function () {
    return !!h_s41_invertedColors("inverted") || (!h_s41_invertedColors("none") && undefined);
  },
  h_s39_fn = function () {
    if (h_s39_forcedColors("active")) {
      return true;
    }
    if (h_s39_forcedColors("none")) {
      return false;
    }
    return;
  },
  h_s42_tooHighValue = function () {
    if (matchMedia("(min-monochrome: 0)").matches) {
      for (let v387 = 0; v387 <= 100; ++v387) {
        if (matchMedia(`(max-monochrome: ${v387})`).matches) {
          return v387;
        }
      }
      throw new Error("Too high value");
    }
  },
  h_s38_fn = function () {
    if (h_s38_prefersContrast("no-preference")) {
      return 0;
    }
    if (h_s38_prefersContrast("high") || h_s38_prefersContrast("more")) {
      return 1;
    }
    if (h_s38_prefersContrast("low") || h_s38_prefersContrast("less")) {
      return -1;
    }
    if (h_s38_prefersContrast("forced")) {
      return 10;
    }
    return;
  },
  h_s43_fn = function () {
    return (
      !!h_s43_prefersReducedMotion("reduce") ||
      (!h_s43_prefersReducedMotion("no-preference") && undefined)
    );
  },
  h_s91_fn = function () {
    if (h_s91_prefersReducedTransparency("reduce")) {
      return true;
    }
    if (h_s91_prefersReducedTransparency("no-preference")) {
      return false;
    }
    return;
  },
  h_s40_fn = function () {
    if (h_s40_dynamicRange("high")) {
      return true;
    }
    if (h_s40_dynamicRange("standard")) {
      return false;
    }
    return;
  },
  h_s46_fn3 = function () {
    const acos = h_s46_fn.acos || h_s46_fn2,
      acosh = h_s46_fn.acosh || h_s46_fn2,
      asin = h_s46_fn.asin || h_s46_fn2,
      asinh = h_s46_fn.asinh || h_s46_fn2,
      atanh = h_s46_fn.atanh || h_s46_fn2,
      atan = h_s46_fn.atan || h_s46_fn2,
      sin = h_s46_fn.sin || h_s46_fn2,
      sinh = h_s46_fn.sinh || h_s46_fn2,
      cos = h_s46_fn.cos || h_s46_fn2,
      cosh = h_s46_fn.cosh || h_s46_fn2,
      tan = h_s46_fn.tan || h_s46_fn2,
      tanh = h_s46_fn.tanh || h_s46_fn2,
      exp = h_s46_fn.exp || h_s46_fn2,
      expm1 = h_s46_fn.expm1 || h_s46_fn2,
      log1p = h_s46_fn.log1p || h_s46_fn2;
    return {
      acos: acos(0.12312423423423424),
      acosh: acosh(1e308),
      acoshPf: ((v388 = 1e154), h_s46_fn.log(v388 + h_s46_fn.sqrt(v388 * v388 - 1))),
      asin: asin(0.12312423423423424),
      asinh: asinh(1),
      asinhPf: ((arg297) => h_s46_fn.log(arg297 + h_s46_fn.sqrt(arg297 * arg297 + 1)))(1),
      atanh: atanh(0.5),
      atanhPf: ((arg298) => h_s46_fn.log((1 + arg298) / (1 - arg298)) / 2)(0.5),
      atan: atan(0.5),
      sin: sin(-1e300),
      sinh: sinh(1),
      sinhPf: ((arg299) => h_s46_fn.exp(arg299) - 1 / h_s46_fn.exp(arg299) / 2)(1),
      cos: cos(10.000000000123),
      cosh: cosh(1),
      coshPf: ((arg300) => (h_s46_fn.exp(arg300) + 1 / h_s46_fn.exp(arg300)) / 2)(1),
      tan: tan(-1e300),
      tanh: tanh(1),
      tanhPf: ((arg301) => (h_s46_fn.exp(2 * arg301) - 1) / (h_s46_fn.exp(2 * arg301) + 1))(1),
      exp: exp(1),
      expm1: expm1(1),
      expm1Pf: ((arg302) => h_s46_fn.exp(arg302) - 1)(1),
      log1p: log1p(10),
      log1pPf: ((arg303) => h_s46_fn.log(1 + arg303))(10),
      powPI: ((arg304) => h_s46_fn.pow(h_s46_fn.PI, arg304))(-100),
    };
    var v388;
  },
  h_s80_pdfViewerEnabled = function () {
    return navigator.pdfViewerEnabled;
  },
  h_s81_fn = function () {
    const float32Array = new Float32Array(1),
      uint8Array8 = new Uint8Array(float32Array.buffer);
    float32Array[0] = Infinity;
    float32Array[0] = float32Array[0] - float32Array[0];
    return uint8Array8[3];
  },
  h_s66_createElement = function () {
    const v389 = document.createElement("a"),
      attributionSourceId = v389.attributionSourceId ?? v389.attributionsourceid;
    return attributionSourceId === undefined ? undefined : String(attributionSourceId);
  },
  h_s96_audioContext = function () {
    if (!fn23() && !fn25()) {
      return -2;
    }
    if (!window.AudioContext) {
      return -1;
    }
    const baseLatency = new AudioContext().baseLatency;
    if (baseLatency == null) {
      return -1;
    }
    if (!isFinite(baseLatency)) {
      return -3;
    }
    return baseLatency;
  },
  h_s202_intl = function () {
    if (!window.Intl) {
      return -1;
    }
    const dateTimeFormat2 = window.Intl.DateTimeFormat;
    if (!dateTimeFormat2) {
      return -2;
    }
    const locale = dateTimeFormat2().resolvedOptions().locale;
    if (!locale && locale !== "") {
      return -3;
    }
    return locale;
  },
  h_s74_webglDebugRendererInfo = function ({ cache: arg305 }) {
    const v390 = fn154(arg305);
    if (!v390) {
      return -1;
    }
    if (!fn62(v390)) {
      return -2;
    }
    const v391 = fn112() ? null : v390.getExtension("WEBGL_debug_renderer_info");
    return {
      version: v390.getParameter(v390.VERSION)?.toString() || "",
      vendor: v390.getParameter(v390.VENDOR)?.toString() || "",
      vendorUnmasked: v391 ? v390.getParameter(v391.UNMASKED_VENDOR_WEBGL)?.toString() : "",
      renderer: v390.getParameter(v390.RENDERER)?.toString() || "",
      rendererUnmasked: v391 ? v390.getParameter(v391.UNMASKED_RENDERER_WEBGL)?.toString() : "",
      shadingLanguageVersion: v390.getParameter(v390.SHADING_LANGUAGE_VERSION)?.toString() || "",
    };
  },
  h_s75_fn4 = function ({ cache: arg306 }) {
    const v392 = fn154(arg306);
    if (!v392) {
      return -1;
    }
    if (!fn62(v392)) {
      return -2;
    }
    const v393 = v392.getSupportedExtensions(),
      v394 = v392.getContextAttributes(),
      v395 = [],
      v396 = [],
      v397 = [],
      v398 = [],
      v399 = [];
    if (v394) {
      for (const v401 of Object.keys(v394)) {
        v396.push(`${v401}=${v394[v401]}`);
      }
    }
    const v400 = h_s75_fn6(v392);
    for (const v402 of v400) {
      const v403 = v392[v402];
      v397.push(`${v402}=${v403}${h_s75_fn.has(v403) ? `=${v392.getParameter(v403)}` : ""}`);
    }
    if (v393) {
      for (const v404 of v393) {
        if (
          (v404 === "WEBGL_debug_renderer_info" && fn112()) ||
          (v404 === "WEBGL_polygon_mode" && h_s75_fn7())
        ) {
          continue;
        }
        const v405 = v392.getExtension(v404);
        if (v405) {
          for (const v406 of h_s75_fn6(v405)) {
            const v407 = v405[v406];
            v398.push(`${v406}=${v407}${h_s75_fn2.has(v407) ? `=${v392.getParameter(v407)}` : ""}`);
          }
        } else {
          v395.push(v404);
        }
      }
    }
    for (const v408 of h_s75_fn3) {
      for (const v409 of h_s75_lowFLOATList) {
        const v410 = h_s75_fn8(v392, v408, v409);
        v399.push(`${v408}.${v409}=${v410.join(",")}`);
      }
    }
    v398.sort();
    v397.sort();
    return {
      contextAttributes: v396,
      parameters: v397,
      shaderPrecisions: v399,
      extensions: v393,
      extensionParameters: v398,
      unsupportedExtensions: v395,
    };
  };
const hash128 = function (arg307, arg308) {
    const v411 = (function (text2) {
      const uint8Array9 = new Uint8Array(text2.length);
      for (let v421 = 0; v421 < text2.length; v421++) {
        const v422 = text2.charCodeAt(v421);
        if (v422 > 127) {
          return new TextEncoder().encode(text2);
        }
        uint8Array9[v421] = v422;
      }
      return uint8Array9;
    })(arg307);
    arg308 = arg308 || 0;
    const v412 = [0, v411.length],
      v413 = v412[1] % 16,
      v414 = v412[1] - v413,
      v415 = [0, arg308],
      v416 = [0, arg308],
      v417 = [0, 0],
      v418 = [0, 0];
    let v419;
    for (v419 = 0; v419 < v414; v419 += 16) {
      v417[0] =
        v411[v419 + 4] | (v411[v419 + 5] << 8) | (v411[v419 + 6] << 16) | (v411[v419 + 7] << 24);
      v417[1] =
        v411[v419] | (v411[v419 + 1] << 8) | (v411[v419 + 2] << 16) | (v411[v419 + 3] << 24);
      v418[0] =
        v411[v419 + 12] |
        (v411[v419 + 13] << 8) |
        (v411[v419 + 14] << 16) |
        (v411[v419 + 15] << 24);
      v418[1] =
        v411[v419 + 8] | (v411[v419 + 9] << 8) | (v411[v419 + 10] << 16) | (v411[v419 + 11] << 24);
      fn166(v417, v5);
      fn96(v417, 31);
      fn166(v417, v6);
      fn65(v415, v417);
      fn96(v415, 27);
      fn91(v415, v416);
      fn166(v415, v7);
      fn91(v415, v8);
      fn166(v418, v6);
      fn96(v418, 33);
      fn166(v418, v5);
      fn65(v416, v418);
      fn96(v416, 31);
      fn91(v416, v415);
      fn166(v416, v7);
      fn91(v416, v9);
    }
    v417[0] = 0;
    v417[1] = 0;
    v418[0] = 0;
    v418[1] = 0;
    const v420 = [0, 0];
    switch (v413) {
      case 15:
        ((v420[1] = v411[v419 + 14]), fn53(v420, 48), fn65(v418, v420));
      case 14:
        ((v420[1] = v411[v419 + 13]), fn53(v420, 40), fn65(v418, v420));
      case 13:
        ((v420[1] = v411[v419 + 12]), fn53(v420, 32), fn65(v418, v420));
      case 12:
        ((v420[1] = v411[v419 + 11]), fn53(v420, 24), fn65(v418, v420));
      case 11:
        ((v420[1] = v411[v419 + 10]), fn53(v420, 16), fn65(v418, v420));
      case 10:
        ((v420[1] = v411[v419 + 9]), fn53(v420, 8), fn65(v418, v420));
      case 9:
        ((v420[1] = v411[v419 + 8]),
          fn65(v418, v420),
          fn166(v418, v6),
          fn96(v418, 33),
          fn166(v418, v5),
          fn65(v416, v418));
      case 8:
        ((v420[1] = v411[v419 + 7]), fn53(v420, 56), fn65(v417, v420));
      case 7:
        ((v420[1] = v411[v419 + 6]), fn53(v420, 48), fn65(v417, v420));
      case 6:
        ((v420[1] = v411[v419 + 5]), fn53(v420, 40), fn65(v417, v420));
      case 5:
        ((v420[1] = v411[v419 + 4]), fn53(v420, 32), fn65(v417, v420));
      case 4:
        ((v420[1] = v411[v419 + 3]), fn53(v420, 24), fn65(v417, v420));
      case 3:
        ((v420[1] = v411[v419 + 2]), fn53(v420, 16), fn65(v417, v420));
      case 2:
        ((v420[1] = v411[v419 + 1]), fn53(v420, 8), fn65(v417, v420));
      case 1:
        ((v420[1] = v411[v419]),
          fn65(v417, v420),
          fn166(v417, v5),
          fn96(v417, 31),
          fn166(v417, v6),
          fn65(v415, v417));
    }
    fn65(v415, v412);
    fn65(v416, v412);
    fn91(v415, v416);
    fn91(v416, v415);
    fn93(v415);
    fn93(v416);
    fn91(v415, v416);
    fn91(v416, v415);
    return (
      ("00000000" + (v415[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (v415[1] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (v416[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (v416[1] >>> 0).toString(16)).slice(-8)
    );
  },
  uint32Array = new Uint32Array(2);
function fn41({ level: arg309, message: arg310 }) {
  if (arg309 === "error") {
    console.error(arg310);
  } else {
    if (arg309 === "warning") {
      console.warn(arg310);
    } else {
      console.log(arg310);
    }
  }
}
async function buildEnvelope({
  modules: arg311,
  components: arg323 = {},
  apiKey: arg312,
  browserCache: arg313,
  tag: arg314,
  linkedId: arg315,
  imi: arg316,
  storageKeyPrefix: arg317,
  urlHashing: arg318,
  ii: arg319,
  ab: arg320,
  fast: arg321,
  eventId: arg322,
}) {
  const v423 = {
    c: arg312,
    t: fn117(arg314),
    lid: arg315,
    m: arg316.m,
    l: arg316.l,
    mo: arg311.map((arg324) => arg324.key).filter((arg325) => Boolean(arg325)),
    s56: arg313,
    sc: fn1(),
    uh: fn27(arg318),
    ii: arg319,
    gt: 1,
    ab: arg320,
    hu: arg321 ? 0 : arg322 ? 1 : undefined,
    ri: arg322,
    ...fn13(arg323),
  };
  await Promise.all(
    arg311.map(async ({ toRequest: arg326 }) => {
      if (arg326) {
        Object.assign(v423, await arg326(arg317, arg318));
      }
    }),
  );
  return v423;
}
function fn42() {
  const v424 = (function (arg327) {
    const v426 = {},
      v427 = [],
      v428 = [];
    let v429 = false;
    const v430 = fn81(document, "visibilitychange", fn176);
    function fn176() {
      v428.push({ t: Math.round(performance.now()), s: fn3() ? "v" : "h" });
    }
    function fn177(arg328) {
      if (v429) {
        return;
      }
      switch ((fn178({ timestamp: Math.round(performance.now()), event: arg328 }), arg328.e)) {
        case 9:
        case 18:
          v427.push(arg328.url);
          break;
        case 4:
        case 5:
          fn179(arg328.agentId, arg328.getCallId, "get");
          break;
        case 22:
        case 23:
          fn179(arg328.agentId, arg328.collectCallId, "collect");
      }
    }
    function fn178(arg329) {
      const event = arg329.event;
      if (!fn84(event)) {
        return;
      }
      const { agentId: agentId } = event;
      if (
        (v426[agentId] || (v426[agentId] = { commonEvents: [], getCalls: {}, collectCalls: {} }),
        fn67(event))
      ) {
        const { getCallId: getCallId } = event;
        let v431 = v426[agentId].getCalls[getCallId];
        if (!v431) {
          v431 = [];
        }
        v431.push(arg329);
        return void (v426[agentId].getCalls[getCallId] = v431);
      }
      if (fn132(event)) {
        const { collectCallId: collectCallId } = event;
        let v432 = v426[agentId].collectCalls[collectCallId];
        if (!v432) {
          v432 = [];
        }
        v432.push(arg329);
        return void (v426[agentId].collectCalls[collectCallId] = v432);
      }
      v426[agentId].commonEvents.push(arg329);
    }
    function fn179(arg330, arg331, arg332) {
      const v433 = (function (arg333, arg334, arg335, arg336) {
          const v449 = [];
          if (arg333[arg334]) {
            v449.push(...arg333[arg334].commonEvents);
            if (arg336 === "get" && arg335) {
              v449.push(...(arg333[arg334].getCalls[arg335] || []));
            }
            if (arg336 === "collect" && arg335) {
              v449.push(...(arg333[arg334].collectCalls[arg335] || []));
            }
          }
          return v449;
        })(v426, arg330, arg331, arg332),
        v434 = {};
      for (const v450 of v433) {
        v434[v450.event.e] = v450;
      }
      const v435 = v434[4] ?? v434[5],
        v436 = v434[22] ?? v434[23],
        v437 = v434[3] && v435,
        v438 = v434[21] && v436,
        v439 = v437 || v438;
      if (!(v434[0] && v434[1] && v434[12] && v439)) {
        return;
      }
      const {
        apiKey: apiKey2,
        storageKeyPrefix: v440 = "_vid_",
        modules: modules2,
        ldi: ldi,
        aggressiveOptimization: v441 = false,
        optimizeRepeatedVisits: v442 = false,
      } = v434[0].event.options;
      if (!apiKey2) {
        return;
      }
      const v443 = Math.min(
          v434[0].timestamp,
          fn69(ldi?.attempts[0].startedAt ?? new Date("8524-04-28")),
        ),
        v444 = v434[5]?.event.error,
        result2 = v434[4]?.event.result,
        v445 = v434[23]?.event.error,
        v446 = v434[13] ?? v434[14],
        v447 = resource(v427),
        v448 = {
          am: v438 ? "collect" : "get",
          v: "1",
          dt: new Date().toISOString(),
          ci: fn104(),
          pi: fn59(),
          ai: arg330,
          ri: h_s85_fn(12),
          c: apiKey2,
          rid: result2?.event_id ?? v444?.event_id ?? null,
          er: v444 ? fn17(v444) : null,
          cr: v445?.message ?? null,
          mo: modules2.map((arg337) => arg337.key).filter((arg338) => Boolean(arg338)),
          sa: fn51(ldi?.attempts ?? []),
          ls: v434[0].timestamp,
          le: v434[1].timestamp,
          ca: fn143(v433, v447, 9, 10, 11),
          ss: v434[12].timestamp,
          se: v446?.timestamp ?? null,
          sd: fn34(v434),
          gs: v434[3]?.timestamp ?? null,
          ge: v435?.timestamp ?? null,
          cs: v434[21]?.timestamp ?? null,
          ce: v436?.timestamp ?? null,
          fa: fn143(v433, v447, 18, 19, 20, 0),
          ia: fn143(v433, v447, 18, 19, 20, 1),
          vs: fn107(ldi?.visibilityStates ?? [], v428, v443, v435?.timestamp ?? v436?.timestamp),
          ab: v434[1].event.ab,
          ao: v441,
          or: v442,
        };
      arg327(v448, v440);
    }
    fn176();
    return {
      addEvent: fn177,
      destroy: () => {
        v429 = true;
        v430();
      },
    };
  })((arg339, arg340) => {
    !(function (arg341, arg342) {
      const v451 = fn116(arg342),
        v452 = fn153(v451) || [];
      v452.splice(0, v452.length - 2);
      const v453 = sealFrame(encodeJsonBytes(arg341), v21, 3, 7);
      v452.push([arg341.ri, base64Encode(v453)]);
      fn152(v451, JSON.stringify(v452));
    })(arg339, arg340);
  });
  let v425 = new Set();
  return {
    toRequest(arg343) {
      const v454 = (function (arg344) {
        const v455 = fn116(arg344),
          v456 = fn153(v455) || [],
          v457 = [];
        v456.forEach((arg345) => {
          try {
            const v458 = decodeJsonBytes(decryptSelfKeyedTable(base64Decode(arg345[1]), v21, 7));
            v457.push(v458);
          } catch (v459) {}
        });
        return v457;
      })(arg343);
      v425 = new Set(v454.map((arg346) => arg346.ri));
      return { lr: v454 };
    },
    onGetResponse(arg347, arg348) {
      fn37(arg348, v425);
    },
    onCollectResponse(arg349) {
      fn37(arg349, v425);
    },
    addEvent: v424.addEvent,
    destroy: v424.destroy,
  };
}
function sig_s84_hidden(arg350) {
  return sharedIframeIsNotAvailable((arg351, arg352) => {
    const v460 = arg352.screen,
      v461 = (arg353) => {
        const v462 = parseInt(arg353);
        return typeof v462 == "number" && isNaN(v462) ? -1 : v462;
      };
    return { s: 0, v: { w: v461(v460.width), h: v461(v460.height) } };
  }, arg350.sis);
}
const uint8Array = new Uint8Array(1);
function h_s167_fn2(arg354, arg355, arg356 = "...") {
  return arg354.length <= arg355
    ? arg354
    : `${arg354.slice(0, Math.max(0, arg355 - arg356.length))}${arg356}`;
}
async function sig_s79_url() {
  const v463 = h_s79_fn();
  return v463
    ? fn99()
      ? await fn142(fn66(350, { s: -2, v: null }), async () => ({
          s: 0,
          v: await Promise.all(v463.map(h_s79_fn2)),
        }))
      : await fn142(fn66(350, { s: -1, v: null }), async () => ({
          s: -1,
          v: await Promise.all([h_s79_file(v463[0])]),
        }))
    : await fn142(fn66(350, { s: -3, v: null }), async () => ({
        s: -3,
        v: await Promise.all([h_s79_file()]),
      }));
}
async function sig_s29() {
  const storage = v30.storage,
    webkitTemporaryStorage = v30.webkitTemporaryStorage;
  if (!webkitTemporaryStorage && !storage?.estimate) {
    return { s: -1, v: null };
  }
  if (webkitTemporaryStorage) {
    const v464 = await Promise.race([
      fn167(250, undefined),
      new Promise((arg357) => {
        webkitTemporaryStorage.queryUsageAndQuota((arg358, arg359) => arg357(arg359));
      }),
    ]);
    if (v464 !== undefined) {
      return { s: 0, v: v464 };
    }
  }
  try {
    if (storage?.estimate) {
      const v465 = await Promise.race([
        fn167(250, undefined),
        storage.estimate().then((arg360) => readVaultedProp(arg360, "quota")),
      ]);
      if (v465 !== undefined) {
        return { s: 1, v: v465 };
      }
    }
    return { s: -2, v: null };
  } catch (v466) {
    if (fn118(v466)) {
      return { s: -101, v: null };
    }
    throw v466;
  }
}
function fn43(arg361) {
  if (typeof TextDecoder == "function") {
    const v468 = new TextDecoder().decode(arg361);
    if (v468) {
      return v468;
    }
  }
  const v467 = asUint8Array(arg361);
  return decodeURIComponent(escape(String.fromCharCode.apply(null, v467)));
}
function sig_s12_indexedDB() {
  try {
    return h_s12_fn(!!window.indexedDB);
  } catch (v469) {
    return h_s12_fn(true);
  }
}
function sig_s26_mediaDevices() {
  return fn142(fn157(300, 4, { s: -2, v: null }), async () => {
    if (!h_s26_mediaDevices() || !fn114()) {
      return { s: -1, v: null };
    }
    try {
      const v470 = await h_s26_fn();
      if (v470 !== "granted") {
        return { s: v470 === "prompt" ? -3 : -4, v: null };
      }
    } catch (v471) {
      return { s: -5, v: null };
    }
    return {
      s: 0,
      v: (await navigator.mediaDevices.enumerateDevices()).map((arg362) => ({
        d: arg362.deviceId,
        g: arg362.groupId,
        k: arg362.kind,
        l: arg362.label,
      })),
    };
  });
}
async function sig_s154_brave({ cache: arg363 }) {
  if (!fn147() || !fn39()) {
    return () => ({ s: -1, v: null });
  }
  if (fn23()) {
    return () => ({ s: -3, v: null });
  }
  const v472 = fn150(arg363);
  return fn142(fn90(300, 10, 500, { s: -2, v: null }), async () => {
    const v473 = await Promise.all(
        h_s154_fn2.map(async (arg364) => {
          const [v475, v476] = arg364;
          return [v475, await v476(v472)];
        }),
      ),
      v474 = {};
    for (const [v477, v478] of v473) {
      v474[v477] = v478;
    }
    return { s: 0, v: v474 };
  });
}
function fn44() {
  const v479 = new Error(),
    v480 = (function (arg365) {
      if (arg365.fileName) {
        return arg365.fileName.split(" ")[0];
      }
      if (arg365.sourceURL) {
        return arg365.sourceURL;
      }
      return null;
    })(v479);
  if (v480) {
    return v480;
  }
  if (v479.stack) {
    const v481 = (function (arg366) {
      const [v482, v483] = arg366.split("\n"),
        v484 = v22.exec(v483) || v23.exec(v482);
      return v484 ? v484[1] : undefined;
    })(v479.stack);
    if (v481) {
      return v481;
    }
  }
  return null;
}
function h_s70_fn5(arg367) {
  const v485 = arg367.match(h_s70_fn8);
  return !!v485 && fn48(v485[1]) === 4169850297;
}
function sig_s86_removeItem() {
  if (!fn25() || h_s86_onafterprint()) {
    return { s: -1, v: null };
  }
  const v486 = readVaultedProp(window, "openDatabase"),
    v487 = window.localStorage;
  try {
    v486(null, null, null, null);
  } catch (v488) {
    return { s: 0, v: true };
  }
  try {
    v487.setItem("test", "1");
    v487.removeItem("test");
    return { s: 0, v: false };
  } catch (v489) {
    return { s: 0, v: true };
  }
}
function h_s216_getRandomValues(arg368) {
  const uint8Array10 = new Uint8Array(16);
  window.crypto.getRandomValues(uint8Array10);
  uint8Array10[(uint8Array10[0] % 15) + 1] = arg368;
  return uint8Array10.reduce(
    (arg369, arg370, arg371) =>
      arg369 +
      (arg371 === 4 || arg371 === 6 || arg371 === 8 || arg371 === 10 ? "-" : "") +
      arg370.toString(16).padStart(2, "0"),
    "",
  );
}
function fn45(arg372) {
  return arg372 === undefined ? undefined : `${arg372}`;
}
function fn46() {
  return (
    fn9([
      "buildID" in navigator,
      "MozAppearance" in (document.documentElement?.style ?? {}),
      "onmozfullscreenchange" in window,
      "mozInnerScreenX" in window,
      "CSSMozDocumentRule" in window,
      "CanvasCaptureMediaStream" in window,
    ]) >= 4
  );
}
function sig_s221_canvas() {
  const v490 = function (arg373, arg374) {
    return arg373 | arg374;
  };
  const v491 = document.createElement("canvas").getContext("webgl2");
  if (!v491) {
    return { s: -1, v: null };
  }
  const v492 = v491.getSupportedExtensions() ?? [],
    v493 = Math.ceil(h_s221_extBlendMinmaxList.length / 32),
    uint32Array3 = new Uint32Array(v493);
  let v494 = false;
  const v495 = [],
    v496 = h_s221_fn();
  for (const v497 of v492) {
    const v498 = v496.get(v497);
    if (v498 === undefined) {
      v494 = true;
      if (v495.length < 10) {
        v495.push(v497.slice(0, 60));
      }
      continue;
    }
    const v499 = (v498 / 32) | 0,
      v500 = v498 & 31;
    uint32Array3[v499] = v490(uint32Array3[v499], 1 << v500) >>> 0;
  }
  return { s: v494 ? 1 : 0, v: { b: Array.from(uint32Array3), u: v495 } };
}
function sig_s45_date() {
  const v501 = Date.now();
  return { s: 0, v: [h_s45_fn(v501), h_s45_fn(v501 - 6e4 * new Date().getTimezoneOffset())] };
}
async function h_s85_securityError() {
  const indexedDB2 = window.indexedDB;
  if (!indexedDB2) {
    return { s: -2, v: null };
  }
  const v502 = "" + h_s85_fn(16) + "";
  return new Promise((arg375, arg376) => {
    try {
      const v503 = indexedDB2.open(v502, 1);
      v503.onerror = () => {
        arg375({ s: -5, v: null });
      };
      v503.onupgradeneeded = (arg377) => {
        const result3 = arg377.target.result;
        try {
          result3.createObjectStore("-", { autoIncrement: true }).put(new window.Blob());
          return void arg375({ s: 0, v: "" });
        } catch (v504) {
          if (v504 instanceof Error) {
            return void arg375({ s: 0, v: v504.message });
          }
          arg376(v504);
        } finally {
          result3.close();
          indexedDB2.deleteDatabase(v502);
        }
      };
    } catch (v505) {
      if (!fn25()) {
        return void arg375({ s: -5, v: null });
      }
      if (v505 instanceof Error && v505.name === "SecurityError") {
        return void arg375({ s: -4, v: null });
      }
      arg376(v505);
    }
  });
}
function fn47(arg378, arg379, arg380, arg381) {
  h_s55_cookie(() => {
    const v506 = `${arg378}=${arg379}`,
      v507 = `expires=${new Date(Date.now() + 24 * arg380 * 60 * 60 * 1e3).toUTCString()}`,
      v508 = arg381 ? `domain=${arg381}` : "";
    document.cookie = [v506, "path=/", v507, v508, "SameSite=Lax"].join("; ");
  }, undefined);
}
async function sig_s210_gpu() {
  const v509 = function (arg382, arg383) {
      return arg382 + arg383;
    },
    v510 = await fn131();
  if (v510.s === -3) {
    let v514 = null;
    if (typeof v510.v === "string") {
      v514 = readVaultedProp(v510, "v");
    }
    return { s: -1, v: v514 };
  }
  if (v510.s === -4) {
    return { s: -2, v: null };
  }
  const v511 = v510.v,
    v512 = [];
  let v513 = "";
  try {
    if (v511) {
      for (const v516 of h_s210_maxTextureDimension1DList) {
        v513 = "limits." + v516 + "";
        v512.push(v516 in v511.limits ? v511.limits[v516] : null);
      }
    }
    v513 = "adapter.info";
    const v515 = await h_s210_fn(v511);
    v513 = "adapterInfo.description";
    const description = v515.description;
    v513 = "adapterInfo.device";
    const device = v515.device;
    v513 = "adapterInfo.isFallbackAdapter";
    return {
      s: 0,
      v: {
        ds: description,
        dv: device,
        f: "isFallbackAdapter" in v515 ? v515.isFallbackAdapter : null,
        l: v512,
      },
    };
  } catch (v517) {
    if (h_s210_illegalInvocation(v517)) {
      return {
        s: -3,
        v: v509("Error accessing property " + v513 + ": ", readVaultedProp(v517, "message")) + "",
      };
    }
    throw v517;
  }
}
function h_s211_fn2() {
  return [
    h_s211_fn("video/mp4; codecs=av01.0.08M.08"),
    h_s211_fn("video/webm; codecs=vp8"),
    h_s211_fn("video/webm; codecs=vp09.00.10.08"),
    h_s211_fn("video/mp4; codecs=hvc1.1.6.L93.B0"),
    h_s211_fn("video/mp4; codecs=avc1.640028"),
    h_s211_fn("video/mp4; codecs=avc1.640033", h_s211_fn4),
    h_s211_fn("video/webm; codecs=vp09.00.10.08", h_s211_fn3, "audio/ogg; codecs=opus"),
    h_s211_fn("video/mp4; codecs=avc1.640028", h_s211_fn3, "audio/mp4; codecs=mp4a.40.5"),
  ];
}
function fn48(arg384) {
  return crc32OfBytes(stringToBytes(arg384));
}
function fn49() {
  return (
    fn9([
      "MSCSSMatrix" in window,
      "msSetImmediate" in window,
      "msIndexedDB" in window,
      "msMaxTouchPoints" in navigator,
      "msPointerEnabled" in navigator,
    ]) >= 4
  );
}
function h_s55_getItemCall(arg385) {
  try {
    return localStorage?.getItem?.call(localStorage, arg385) ?? undefined;
  } catch (v518) {}
}
function fn50(arg386, arg387, arg388) {
  if (arg387) {
    const v519 = (function (arg389) {
      const v520 = arg389.getHeader("retry-after");
      if (!v520) {
        return;
      }
      if (/^\s*\d+(\.\d+)?\s*$/.test(v520)) {
        return 1e3 * parseFloat(v520);
      }
      const v521 = new Date(v520);
      if (!isNaN(v521)) {
        return v521.getTime() - Date.now();
      }
      return;
    })(arg387);
    if (v519 !== undefined) {
      return { action: "postpone", delay: v519 };
    }
    return { action: "exclude", delay: "backoff" };
  }
  if (
    arg388 instanceof Error &&
    (arg388.name === "CSPError" || arg388.name === "InvalidURLError")
  ) {
    return { action: "exclude", delay: 0 };
  }
  return { action: "postpone", delay: Date.now() - arg386.getTime() < 50 ? 0 : "backoff" };
}
const v10 = /Blocked a frame.*cross-origin frame/,
  v11 = /Permission denied.*cross-origin object/,
  v12 = /Failed to execute.*in this context/,
  v13 = /Context not access storage/,
  v14 = /(\w+)\(\)\s+called for opaque origin/;
function h_s17_canvas(arg390) {
  let v522,
    v523,
    v524 = false;
  const [canvas3, v525] = (function () {
    const canvas4 = document.createElement("canvas");
    canvas4.width = 1;
    canvas4.height = 1;
    return [canvas4, canvas4.getContext("2d")];
  })();
  if (!!(!v525 || !canvas3.toDataURL)) {
    v522 = v523 = "unsupported";
  } else {
    v524 = (v525.rect(0, 0, 10, 10), v525.rect(2, 2, 6, 6), !v525.isPointInPath(5, 5, "evenodd"));
    if (arg390) {
      v522 = v523 = "skipped";
    } else {
      [v522, v523] = (function (arg391, arg392) {
        !(function (arg393, arg394) {
          arg393.width = 240;
          arg393.height = 60;
          arg394.textBaseline = "alphabetic";
          arg394.fillStyle = "#f60";
          arg394.fillRect(100, 1, 62, 20);
          arg394.fillStyle = "#069";
          arg394.font = '11pt "Times New Roman"';
          const v529 = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835)}`;
          arg394.fillText(v529, 2, 15);
          arg394.fillStyle = "rgba(102, 204, 0, 0.2)";
          arg394.font = "18pt Arial";
          arg394.fillText(v529, 4, 45);
        })(arg391, arg392);
        const v526 = h_s17_fn(arg391),
          v527 = h_s17_fn(arg391);
        if (v526 !== v527) {
          return ["unstable", "unstable"];
        }
        !(function (arg395, arg396) {
          arg395.width = 122;
          arg395.height = 110;
          arg396.globalCompositeOperation = "multiply";
          for (const [v530, v531, v532] of [
            ["#f2f", 40, 40],
            ["#2ff", 80, 40],
            ["#ff2", 60, 80],
          ]) {
            arg396.fillStyle = v530;
            arg396.beginPath();
            arg396.arc(v531, v532, 40, 0, 2 * Math.PI, true);
            arg396.closePath();
            arg396.fill();
          }
          arg396.fillStyle = "#f9c";
          arg396.arc(60, 60, 60, 0, 2 * Math.PI, true);
          arg396.arc(60, 60, 20, 0, 2 * Math.PI, true);
          arg396.fill("evenodd");
        })(arg391, arg392);
        const v528 = h_s17_fn(arg391);
        return [v528, v526];
      })(canvas3, v525);
    }
  }
  return { winding: v524, geometry: v522, text: v523 };
}
const h_s69_pathList = ["path", "query", "fragment"];
function fn51(arg397) {
  const v533 = resource(arg397.map((arg398) => arg398.url).filter((arg399) => Boolean(arg399)));
  return arg397.map((arg400, arg401) => {
    const v534 = arg397.length > 1 && arg401 < arg397.length - 1 && !("error" in arg400);
    return fn171(
      arg400.url,
      fn69(arg400.startedAt),
      fn69(arg400.finishedAt),
      v534 ? "Unknown" : arg400.error,
      v533[arg400.url],
    );
  });
}
function fn52(arg402) {
  return (
    arg402 instanceof Error || (arg402 !== null && typeof arg402 == "object" && "name" in arg402)
  );
}
function fn53(arg403, arg404) {
  if ((arg404 %= 64) !== 0) {
    if (arg404 < 32) {
      arg403[0] = arg403[1] >>> (32 - arg404);
      arg403[1] = arg403[1] << arg404;
    } else {
      arg403[0] = arg403[1] << (arg404 - 32);
      arg403[1] = 0;
    }
  }
}
function fn54(arg405) {
  return (function (arg406, arg407, arg408, arg409) {
    let v535;
    const v536 = (arg410) => {
      const url = new URL(arg406, location.href),
        { blockedURI: blockedURI } = arg410;
      if (!(
        blockedURI !== url.href &&
        blockedURI !== url.protocol.slice(0, -1) &&
        blockedURI !== url.origin
      )) {
        v535 = arg410;
        securitypolicyviolation();
      }
    };
    document.addEventListener("securitypolicyviolation", v536);
    const securitypolicyviolation = () =>
      document.removeEventListener("securitypolicyviolation", v536);
    if (!(arg409 == null)) {
      arg409.then(securitypolicyviolation, securitypolicyviolation);
    }
    return Promise.resolve()
      .then(arg407)
      .then(
        (arg411) => {
          securitypolicyviolation();
          return arg411;
        },
        (arg412) =>
          new Promise((arg413) => {
            const messageChannel2 = new MessageChannel();
            messageChannel2.port1.onmessage = () => arg413();
            messageChannel2.port2.postMessage(null);
          }).then(() => {
            if ((securitypolicyviolation(), v535)) {
              return arg408(v535);
            }
            throw arg412;
          }),
      );
  })(
    arg405.url,
    () =>
      (async function ({
        url: arg414,
        method: arg420 = "GET",
        body: arg415,
        headers: arg416,
        withCredentials: arg421 = false,
        timeout: arg417,
        responseFormat: arg418,
        abort: arg419,
      }) {
        if (
          (function (arg422) {
            if (!URL.prototype) {
              return;
            }
            try {
              new URL(arg422, location.href);
              return false;
            } catch (v539) {
              if (typeError(v539)) {
                return true;
              }
              throw v539;
            }
          })(arg414)
        ) {
          throw fn5("InvalidURLError", "Invalid URL");
        }
        const [response, v537] = await (async function (arg423) {
          const abortController = new AbortController(),
            v540 = { current: false },
            v541 =
              arg423.timeout && arg423.timeout > 0
                ? fn158(() => {
                    v540.current = true;
                    abortController.abort();
                  }, arg423.timeout)
                : undefined;
          try {
            return [
              await fn115(
                fetch(arg423.url, {
                  method: arg423.method,
                  headers: arg423.headers,
                  body: arg423.body,
                  credentials: arg423.withCredentials ? "include" : "same-origin",
                  signal: abortController.signal,
                }),
                arg423.abort,
              ),
              null,
            ];
          } catch (v542) {
            if (v542 instanceof DOMException && v542.name === "AbortError") {
              return v540.current
                ? [null, fn5("TimeoutError", "The request timed out")]
                : [null, fn5("AbortError", "The request is aborted")];
            }
            if (v542 instanceof TypeError) {
              return [
                null,
                fn5("TypeError", navigator.onLine ? "Connection error" : "Network offline"),
              ];
            }
            return [null, v542];
          } finally {
            if (!(v541 == null)) {
              v541();
            }
          }
        })({
          url: arg414,
          method: arg420,
          headers: arg416,
          body: arg415,
          withCredentials: arg421,
          timeout: arg417,
          abort: arg419,
        });
        if (v537) {
          throw v537;
        }
        const v538 = {
          status: response.status,
          statusText: response.statusText,
          getHeader(arg424) {
            return response.headers.get(arg424) ?? undefined;
          },
        };
        if (arg418 === "binary") {
          const v543 = await response.arrayBuffer();
          return { ...v538, body: v543 };
        }
        {
          const v544 = await response.text();
          return { ...v538, body: v544 };
        }
      })(arg405),
    () => {
      throw fn5("CSPError", "The request is blocked by the CSP");
    },
    arg405.abort,
  );
}
function fn55(arg425, arg426, arg427, arg428, arg429 = {}) {
  const {
      maxAttemptCount: v545 = 5,
      backoffBase: v546 = 200,
      backoffCap: v547 = 1e4,
      abort: abort,
    } = arg429,
    v548 = { failedAttempts: [] },
    [v549, v550] = fn26(arg425, arg428, v546, v547),
    v551 = ((v552 = [
      abort?.then(
        (arg430) => (v548.aborted = { resolve: true, value: arg430 }),
        (arg431) => (v548.aborted = { resolve: false, error: arg431 }),
      ),
      fn87(v549, v545, arg426, arg427, v550, v548, abort),
    ]),
    Promise.race(v552.filter((arg432) => !!arg432))).then(() => v548);
  var v552;
  return { then: v551.then.bind(v551), current: v548 };
}
function fn56(arg433, arg434) {
  let v553 = 0;
  return () => Math.random() * Math.min(arg434, arg433 * Math.pow(2, v553++));
}
function fn57(arg435) {
  return parseInt(arg435);
}
function sig_s71() {
  return (function ({ location: arg436, origin: arg437 }) {
    const origin = arg436.origin,
      ancestorOrigins = arg436.ancestorOrigins;
    let v554 = null;
    if (ancestorOrigins) {
      v554 = new Array(ancestorOrigins.length);
      for (let v555 = 0; v555 < ancestorOrigins.length; ++v555) {
        v554[v555] = ancestorOrigins[v555];
      }
    }
    return { s: 0, v: { w: arg437 ?? null, l: origin ?? null, a: v554 } };
  })(window);
}
function h_s51_fn() {
  return (function (arg438, arg439 = 4e3) {
    return h_s51_iframe((arg440, arg441) => {
      const v556 = arg441.document,
        body2 = v556.body,
        style4 = body2.style;
      style4.width = `${arg439}px`;
      style4.webkitTextSizeAdjust = "none";
      style4.setProperty("text-size-adjust", "none");
      if (fn11()) {
        body2.style.setProperty("zoom", "" + 1 / arg441.devicePixelRatio);
      } else {
        if (fn25()) {
          body2.style.setProperty("zoom", "reset");
        }
      }
      const v557 = v556.createElement("div");
      v557.textContent = [...Array((arg439 / 20) | 0)].map(() => "word").join(" ");
      body2.appendChild(v557);
      return arg438(v556, body2);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  })((arg442, arg443) => {
    const v558 = {},
      v559 = {};
    for (const v560 of Object.keys(h_s51_fn2)) {
      const [v561 = {}, v562 = "mmMwWLliI0fiflO&1"] = h_s51_fn2[v560],
        v563 = arg442.createElement("span");
      v563.textContent = v562;
      v563.style.whiteSpace = "nowrap";
      for (const v564 of Object.keys(v561)) {
        const v565 = v561[v564];
        if (v565 !== undefined) {
          v563.style[v564] = v565;
        }
      }
      v558[v560] = v563;
      arg443.append(arg442.createElement("br"), v563);
    }
    for (const v566 of Object.keys(h_s51_fn2)) {
      v559[v566] = v558[v566].getBoundingClientRect().width;
    }
    return v559;
  });
}
const v15 = fn160(fn54);
function fn58(arg444, arg445) {
  fn105(arg444, arg444.len + 1);
  arg444.arr[arg444.len++] = arg445;
}
function retryAfter(arg446, arg447, arg448, arg449, arg450, arg451) {
  return fn86(
    arg447,
    () => ({ e: 9, tryNumber: arg450, url: arg449, timeout: arg446 }),
    ({ status: arg452, getHeader: arg453, body: arg454 }) => ({
      e: 10,
      tryNumber: arg450,
      status: arg452,
      retryAfter: arg453("retry-after"),
      body: arg454,
    }),
    (arg455) => ({ e: 11, tryNumber: arg450, error: arg455 }),
    () => fn164({ url: arg449, timeout: arg446, abort: arg451, container: arg448 }),
  );
}
function sig_s44_prefersColorScheme() {
  if (h_s44_prefersColorScheme("dark")) {
    return { s: 0, v: true };
  }
  if (h_s44_prefersColorScheme("light")) {
    return { s: 0, v: false };
  }
  return { s: -1, v: null };
}
const h_s55_fn = /The document is sandboxed and lacks the 'allow-same-origin' flag/,
  h_s55_fn2 = /The operation is insecure/,
  h_s55_fn3 = /Forbidden in a sandboxed document without the 'allow-same-origin' flag/;
function fn59() {
  const fpjspvid = window.__fpjs_pvid;
  return (window.__fpjs_pvid = typeof fpjspvid == "string" ? fpjspvid : h_s85_fn(10));
}
function fn60(arg456, arg457, arg458) {
  const v567 = function (arg459, arg460) {
    return arg459 * arg460;
  };
  return arg457 + Math.floor(v567(arg456 / 256, arg458 - arg457 + 1));
}
function makeSelfKeyedVault(arg461, arg462) {
  let v568;
  return (arg463) => {
    if (!v568) {
      v568 = (function (arg464, arg465) {
        return decodeJsonBytes(decryptSelfKeyedTable(new Uint32Array(arg464), [], arg465));
      })(arg461, arg462);
    }
    return deepClone(v568[arg463]);
  };
}
function fn61(arg466, arg467) {
  const v569 = arg467(`${arg466.origin}${arg466.pathname}`),
    v570 = arg466.searchParams.get("region");
  return v570 ? h_s94_fn7(v569, { region: v570 }) : v569;
}
function fn62(arg468) {
  return typeof arg468.getParameter == "function";
}
function fn63(arg469) {
  return withoutDefault(arg469) ? fn82(arg469.value) : fn82(arg469);
}
function h_s201_srChannelCount() {
  const v571 = Audio.prototype,
    { visualViewport: visualViewport } = window;
  return (
    fn9([
      "srLatency" in v571,
      "srChannelCount" in v571,
      "devicePosture" in navigator,
      visualViewport && "segments" in visualViewport,
      "getTextInformation" in Image.prototype,
    ]) >= 3
  );
}
function fn64() {
  if (!crypto) {
    return Math.random();
  }
  crypto.getRandomValues(uint32Array);
  return (1048576 * uint32Array[0] + (1048575 & uint32Array[1])) / 4503599627370496;
}
function h_s41_invertedColors(arg470) {
  return matchMedia(`(inverted-colors: ${arg470})`).matches;
}
function h_s55_fn4(arg471) {
  if (!(arg471 instanceof DOMException)) {
    return false;
  }
  const v572 = arg471.message;
  return h_s55_fn.test(v572) || h_s55_fn2.test(v572) || h_s55_fn3.test(v572);
}
function sig_s203_createElement() {
  const v573 = document.createElement("a");
  v573.style.width =
    "calc( 1px * ( sin( 66911823500 * ( 36781 / -0.55 * cos( -30780.497322536891 ) ) ) )";
  return { s: 0, v: v573.style.width };
}
function fn65(arg472, arg473) {
  arg472[0] ^= arg473[0];
  arg472[1] ^= arg473[1];
}
const v16 = { noop: ["a", "b"] };
function fn66(arg474, arg475) {
  return new Promise((arg476) => visibilitychange(arg476, arg474, arg475));
}
function withoutDefault(arg477) {
  return !!arg477 && arg477.__type__ === "withoutDefault";
}
function fn67(arg478) {
  const v574 = arg478;
  return !!v574.getCallId && typeof v574.getCallId == "string";
}
function h_s157_fn(arg479, arg480) {
  return arg479.indexOf(arg480) !== -1;
}
function h_s79_fn() {
  return [
    "var/db/MobileIdentityData/Version.plist",
    "private/preboot/active",
    "etc/hosts",
    "var/mobile/Library/SpringBoard/TodayViewArchive.plist",
    "var/mobile/Library/Preferences/com.apple.corerecents.recentsd.plist",
  ];
}
function h_s70_fn6(arg481) {
  const uint8Array11 = new Uint8Array(arg481.length / 2);
  for (let v575 = 0; v575 < arg481.length; v575 += 2) {
    uint8Array11[v575 / 2] = parseInt(arg481[v575] + arg481[v575 + 1], 16);
  }
  return uint8Array11;
}
async function sig_s51_iframe() {
  try {
    return { s: 0, v: await h_s51_fn() };
  } catch (v576) {
    if (fn118(v576)) {
      return { s: -101, v: null };
    }
    throw v576;
  }
}
async function h_s213_getCurrentPosition(arg482) {
  switch (arg482) {
    case "prompt":
      return { s: -2, v: null };
    case "denied":
      return { s: -3, v: null };
    case "granted":
      return new Promise((arg483) => {
        navigator.geolocation.getCurrentPosition(
          (arg484) =>
            arg483(
              (function (arg485) {
                if (!arg485) {
                  return { s: -5, v: null };
                }
                const {
                  accuracy: accuracy,
                  altitude: altitude,
                  altitudeAccuracy: altitudeAccuracy,
                  latitude: latitude,
                  longitude: longitude,
                  heading: heading,
                  speed: speed,
                } = readVaultedProp(arg485, "coords");
                return {
                  s: 0,
                  v: {
                    la: latitude,
                    lo: longitude,
                    al: altitude,
                    ac: accuracy,
                    alac: altitudeAccuracy,
                    h: heading,
                    s: speed,
                    t: arg485.timestamp,
                  },
                };
              })(arg484),
            ),
          (arg486) =>
            arg483(
              (function (arg487) {
                switch (((v577 = arg487), readVaultedProp(v577, "code"))) {
                  case readVaultedProp(arg487, "PERMISSION_DENIED"):
                    return { s: -3, v: null };
                  case readVaultedProp(arg487, "POSITION_UNAVAILABLE"):
                    return { s: -5, v: null };
                  case readVaultedProp(arg487, "TIMEOUT"):
                    return { s: -4, v: null };
                  default:
                    return { s: -5, v: null };
                }
                var v577;
              })(arg486),
            ),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
      });
    default:
      return { s: -5, v: null };
  }
}
const uint8Array2 = new Uint8Array([110, 117, 108, 108]),
  uint8Array3 = new Uint8Array([116, 114, 117, 101]),
  uint8Array4 = new Uint8Array([102, 97, 108, 115, 101]),
  v17 = { '"': '"', "\\": "\\", "\b": "b", "\f": "f", "\n": "n", "\r": "r", "\t": "t" },
  v18 = (() => {
    const uint8Array12 = new Uint8Array(128);
    for (const [text3, text4] of Object.entries(v17)) {
      uint8Array12[text4.charCodeAt(0)] = text3.charCodeAt(0);
    }
    return uint8Array12;
  })(),
  v19 = /[\x00-\x1F"\\]/g;
function h_s94_fn4(arg488) {
  return arg488.split("/").map(encodeURIComponent).join("/");
}
function h_s95_atomics() {
  return (
    fn36([
      "Iterator" in window,
      window.Error && "isError" in window.Error,
      window.Atomics && "pause" in window.Atomics,
      "network_connection".Document?.prototype && "fragmentDirective" in window.Document.prototype,
      window.CSSRule && !("UNKNOWN_RULE" in window.CSSRule),
      !("SVGDocument" in window),
    ]) >= 4
  );
}
function fn68(arg489, arg490, arg491, arg492) {
  const v578 = (function (arg493, arg494) {
    return arg493.map((arg495) => h_s94_fn7(arg495, { q: arg494 }));
  })(arg489, arg490);
  if (v578.length === 0) {
    return () => Promise.resolve({ s: -1, v: null });
  }
  fn94(arg492, () => ({ e: 6 }));
  const v579 = fn108(),
    v580 = v15(v579),
    v581 = Date.now(),
    v582 = fn133(
      v578,
      retryAfter.bind(null, 5e3, arg492, v580),
      fn75,
      Math.max(10, v578.length),
      arg491,
    );
  v582.then(
    () => v579.resolve(),
    () => v579.resolve(),
  );
  return async function (arg496, arg497, arg498) {
    try {
      await Promise.race([v582, fn80(v581, arg496, arg497)]);
      const v583 = (function ({ result: arg499, failedAttempts: arg500 }) {
        if (arg499 !== undefined) {
          return arg499;
        }
        const v584 = arg500[0];
        if (!v584) {
          return { s: -3, v: null };
        }
        if (v584.level === 1) {
          return v584.error;
        }
        const { error: error, endpoint: endpoint } = v584;
        if (error instanceof Error) {
          const { name: name, message: message } = error;
          switch (name) {
            case "AbortError":
              return { s: -2, v: message };
            case "TimeoutError":
              return { s: -3, v: message };
            case "CSPError":
              return { s: -6, v: message };
            case "InvalidURLError":
              return { s: -7, v: `Invalid URL: ${h_s167_fn2(endpoint, 255)}` };
            case "TypeError":
              return { s: -4, v: message };
          }
        }
        return h_s167_fn4(error);
      })(v582.current);
      fn94(arg498, () => ({ e: 7, result: v583 }));
      return v583;
    } catch (v585) {
      throw (fn94(arg498, () => ({ e: 8, error: v585 })), v585);
    }
  };
}
function fn69(arg501) {
  const timeOrigin = performance.timeOrigin ?? Date.now() - performance.now();
  return Math.round(arg501.getTime() - timeOrigin);
}
function sig_s200_timeOrigin() {
  return { s: 0, v: performance.timeOrigin ?? Date.now() - performance.now() };
}
function sig_s155() {
  const v586 = [
    ["navigator", ["plugins", "userAgent", "platform", "appName", "languages"]],
    ["screen", ["width", "availWidth", "height", "availHeight"]],
  ];
  const v587 = {};
  for (const [v588, v589] of v586) {
    for (const v590 of v589) {
      const v591 = Object.getOwnPropertyDescriptor(window[v588], v590)?.get?.toString();
      if (v591 !== undefined) {
        v587[`${v588}.${v590}`] = v591;
      }
    }
  }
  return { s: 0, v: v587 };
}
var vault_FP = makeSelfKeyedVault(
  [
    103540708, 3177468069, 195515584, 1035000902, 3608426121, 1070496435, 568496454, 2672325332,
    550707368, 2079295255, 2669640837, 1787111349, 833865798, 2672325270, 1787109797, 934664262,
    2672325270, 1787110561, 665902150, 2434364054, 634616290, 854512406, 2467773143, 2089106345,
    2140987718, 3779492997, 226851740,
  ],
  6,
);
async function fn70(arg502, arg503, arg504, arg505, arg506) {
  if (arg502.length === 0) {
    throw new TypeError("The list of endpoints is empty");
  }
  const v592 = arg502.map((arg507) =>
      (function (arg508, { apiKey: arg509 }) {
        return h_s94_fn7(arg508, { ci: fn104(), q: arg509 });
      })(arg507, arg503),
    ),
    v593 = await buildEnvelope(arg503),
    v594 = encodeJsonBytes(v593),
    v595 = arg503.fast ? 0 : 1;
  return await fn86(
    arg506,
    () => ({ e: 15, stage: v595, body: v593, isCompressed: fn95(v594) }),
    (arg510) => ({ e: 16, stage: v595, result: arg510 }),
    (arg511) => ({ e: 17, stage: v595, error: arg511 }),
    async () =>
      (function ({ result: arg512, failedAttempts: arg513, aborted: arg514 }) {
        if (arg512) {
          return arg512;
        }
        const v596 = arg513[0];
        if (!v596) {
          throw arg514 && !arg514.resolve ? arg514.error : new Error("aborted");
        }
        const { level: level, error: error2 } = v596;
        if (level === 0 && error2 instanceof Error) {
          switch (error2.name) {
            case "CSPError":
              throw new fingerprintError(v1.csp_block, "csp_block");
            case "InvalidURLError":
              throw new fingerprintError(v1.invalid_endpoint, "invalid_endpoint");
            case "AbortError":
              throw new fingerprintError(v1.network_abort, "network_abort");
          }
          throw new fingerprintError(v1.network_connection, "network_connection");
        }
        throw error2;
      })(
        await fn133(
          v592,
          fn146.bind(null, {
            body: v594,
            getCallDebugger: arg506,
            stage: v595,
            pollingContainer: arg504,
          }),
          fn151.bind(null, arg503.modules, arg503.storageKeyPrefix),
          Infinity,
          arg505,
        ),
      ),
  );
}
function h_s97_fn(arg515) {
  return new Promise((arg516) => {
    const v597 = "/private/var/mobile/Media/PhotoData/external/" + arg515 + "/1";
    try {
      const [, v598, v599] = fn103(v597);
      if (v598 !== 0) {
        return void arg516(v598);
      }
      v599.getParent(
        () => arg516(0),
        () => arg516(-1),
      );
    } catch (v600) {
      arg516(-2);
    }
  });
}
const v20 = [202, 206];
function fn71() {
  return {
    initDataTypes: ["cenc"],
    audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
  };
}
function sig_s22_webAssembly() {
  const webAssembly = window.WebAssembly;
  if (!webAssembly?.validate) {
    return { s: -1, v: null };
  }
  const v601 = [0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10],
    v602 = [
      [9, 1, 7, 0, 65, 0, 253, 15, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [240, 67, 0, 0, 0, 12, 1, 10, 0, 252, 2, 3, 1, 1, 0, 0, 110, 26, 11, 161, 10],
      [6, 1, 4, 0, 18, 0, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [8, 1, 6, 0, 65, 0, 192, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [7, 1, 5, 0, 208, 112, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
    ];
  let v603 = 0;
  for (const v604 of v602) {
    v603 <<= 1;
    v603 |= webAssembly.validate(Uint8Array.of(...v601, ...v604)) ? 1 : 0;
  }
  return { s: 0, v: v603 };
}
function sig_s158_hidden(arg517) {
  return sharedIframeIsNotAvailable((arg518, arg519) => {
    const { webdriver: webdriver } = arg519.navigator;
    if (webdriver === null) {
      return { s: -1, v: null };
    }
    if (webdriver === undefined) {
      return { s: -2, v: null };
    }
    return { s: 0, v: webdriver };
  }, arg517.sis);
}
function h_s40_dynamicRange(arg520) {
  return matchMedia(`(dynamic-range: ${arg520})`).matches;
}
function h_s5_height() {
  const v605 = (arg521) => fn170(fn57(arg521), null),
    v606 = [v605(screen.width), v605(screen.height)];
  v606.sort().reverse();
  return v606;
}
function fn72() {
  const v607 = /{(.*?)}/.exec(location.hash);
  return !!v607 && fn48(v607[1]) === 3025844545;
}
function sig_s162_languages() {
  const languages2 = navigator.languages;
  if (languages2) {
    return { s: 0, v: h_s162_fn(languages2) };
  }
  return { s: -1, v: null };
}
function fn73(arg522, arg523) {
  const v608 = {},
    v609 = ["x", "y", "left", "right", "bottom", "height", "top", "width"],
    v610 = arg522.getBoundingClientRect();
  for (const v612 of v609) {
    if (v612 in v610) {
      v608[v612] = v610[v612];
    }
  }
  const v611 = arg523.getComputedStyle(arg522, null).getPropertyValue("font-family");
  v608.font = v611;
  return v608;
}
function fn74(arg524) {
  return (arg524 >= 48 && arg524 < 58) || arg524 === 45;
}
function makeEnvKeyedVault(arg525, arg526, arg527) {
  if (arg525.length !== arg526.length || arg525.length !== arg527.length) {
    throw new Error(
      "Invalid encryption configuration: all input arrays must have the same length.",
    );
  }
  const v613 = new Array(arg525.length).fill(undefined);
  return (arg528) => {
    if (v613.every((arg529) => arg529 === null)) {
      return null;
    }
    for (let v614 = 0; v614 < arg525.length; v614++) {
      if (
        v613[v614] !== null &&
        (v613[v614] ||
          (v613[v614] = decryptEnvKeyedTable(arg525[v614], arg526[v614], arg527[v614])),
        v613[v614] !== null)
      ) {
        return deepClone(v613[v614]?.[arg528]);
      }
    }
    return null;
  };
}
function fn75({ status: arg530, body: arg531 }) {
  if (arg530 === 200 && /^[a-zA-Z0-9+/]{1,1022}={0,2}$/.test(arg531)) {
    return { result: { s: 0, v: arg531 } };
  }
  return { error: { s: -5, v: h_s167_fn2(`${arg530}: ${arg531}`, 255) } };
}
function sig_s92_createDocumentFragment(arg532) {
  const v615 = document.createDocumentFragment(),
    v616 = fn180(v615, "mrow"),
    v617 = fn180(v616, "munderover"),
    v618 = fn180(v617, "mmultiscripts");
  fn180(v618, "mo", "∏");
  const v619 = [
    ["𝔈", "υ", "τ", "ρ", "σ"],
    ["𝔇", "π", "ο", "ν", "ξ"],
    ["𝔄", "δ", "γ", "α", "β"],
    ["𝔅", "θ", "η", "ε", "ζ"],
    ["𝔉", "ω", "ψ", "ϕ", "χ"],
    ["ℭ", "μ", "λ", "ι", "κ"],
  ];
  function fn180(arg533, arg534, arg535 = "") {
    const v620 = document.createElement(arg534);
    v620.textContent = arg535;
    arg533.append(v620);
    return v620;
  }
  function fn181(arg536, arg537, arg538, arg539, arg540) {
    const v621 = document.createElement("mmultiscripts");
    fn180(v621, "mi", arg536);
    fn180(v621, "mi", arg537);
    fn180(v621, "mi", arg538);
    fn180(v621, "mprescripts");
    fn180(v621, "mi", arg539);
    fn180(v621, "mi", arg540);
    return v621;
  }
  for (const v622 of v619) {
    const v623 = fn181(...v622);
    v618.append(v623);
  }
  return sharedIframeIsNotAvailable((arg541, arg542) => {
    const v624 = document.createElement("math");
    v624.style.whiteSpace = "nowrap";
    v624.append(v615);
    arg542.document.body.append(v624);
    const v625 = fn73(v624, arg542);
    arg542.document.body.removeChild(v624);
    return { s: 0, v: v625 };
  }, arg532.sis);
}
function fn76(arg543) {
  return arg543.arr.subarray(0, arg543.len);
}
function h_s55_fn5(arg544) {
  return `${arg544}t`;
}
function sig_s214_storageBuckets() {
  return fn142(fn157(400, 4, { s: -2, v: null }), h_s214_storageBuckets);
}
function h_s222_fn(arg545) {
  return (
    arg545 instanceof window.DOMException &&
    arg545.message.includes("must be called from a top-level browsing context")
  );
}
function h_s6_fn3(arg546) {
  for (let v626 = 0; v626 < 4; ++v626) {
    if (arg546[v626]) {
      return false;
    }
  }
  return true;
}
function fn77(arg547) {
  const v627 = function (arg548, arg549) {
      return arg548 + arg549;
    },
    v628 = hash128(arg547),
    uint8Array13 = new Uint8Array(16);
  for (let v633 = 0; v633 < v628.length; v633 += 2) {
    uint8Array13[v633 / 2] = parseInt(v627("" + v628[v633] + "", v628[v633 + 1]) + "", 16);
  }
  const v629 = base64Encode(uint8Array13),
    v630 = fn60(uint8Array13[parseInt(v628[v628.length - 1], 16)], 8, 22),
    v631 = v629.slice(0, Math.min(v629.length - 2, v630)),
    v632 = base64Encode(fn109(crc32OfBytes(fn38(stringToBytes(v631), v20)))).slice(0, 2);
  return fn138(
    arg547,
    buildRequestPath(
      ("" + v631 + "" + v632 + "")
        .replace(new RegExp("\\+", "g"), "-")
        .replace(new RegExp("\\/", "g"), "_"),
      uint8Array13,
    ),
  );
}
function fn78(arg550, arg551) {
  fn105(arg550, arg550.len + arg551.length);
  arg550.arr.set(arg551, arg550.len);
  arg550.len += arg551.length;
}
async function comWidevineAlpha(arg552, arg553 = false) {
  if (!fn147() || !fn39()) {
    return { s: -1, v: null };
  }
  if (!(await fn130())) {
    return { s: -2, v: null };
  }
  const v634 = fn102(arg553);
  try {
    return { s: 0, v: await fn141("com.widevine.alpha", arg552, [v634]) };
  } catch (v635) {
    return { s: -3, v: null };
  }
}
function sig_s135_mimeTypes() {
  if (navigator.mimeTypes === undefined) {
    return { s: -1, v: null };
  }
  if (navigator.mimeTypes.length === undefined) {
    return { s: -3, v: null };
  }
  return { s: 0, v: navigator.mimeTypes.length };
}
async function fn79(arg554) {
  fn134(arg554, 6);
  const v636 = await fn33(arg554, [7, 8]);
  if (v636[0] === 8) {
    throw fn145(v636);
  }
  fn134(arg554, 9);
  const v637 = v636[1];
  if (
    !(function (arg555) {
      if (!fn32(arg555)) {
        return false;
      }
      for (const v638 of Object.keys(arg555)) {
        const v639 = arg555[v638];
        if (
          !fn32(v639) ||
          !Number.isFinite(fn89(v639, "duration")) ||
          (!fn106(v639, "value") && !fn106(v639, "error"))
        ) {
          return false;
        }
      }
      return true;
    })(v637)
  ) {
    throw new Error("The worker returned a malformed GetOk payload.");
  }
  return v637;
}
function fn80(arg556, arg557, arg558) {
  return fn66(Math.min(Math.max(arg557, arg556 + 1e4 - Date.now()), arg558));
}
function sig_s212_getComputedStyle() {
  const v640 = window.getComputedStyle(document.documentElement);
  return { s: 0, v: fn36(h_s212_fn.map((arg559) => v640.getPropertyValue(arg559) !== "")) >= 4 };
}
function h_s70_gpu() {
  return "gpu" && navigator.gpu;
}
function fn81(arg560, arg561, arg562, arg563) {
  arg560.addEventListener(arg561, arg562, arg563);
  return () => arg560.removeEventListener(arg561, arg562, arg563);
}
function h_s94_fn5(arg564, arg565) {
  function fn182(arg566, arg567) {
    return fn183(arg566) && arg566.errorCode === 400 && arg566.url.includes(arg567);
  }
  function fn183(arg568) {
    return (
      typeof arg568 === "object" && arg568 !== null && "errorCode" in arg568 && "url" in arg568
    );
  }
  let v641 = null,
    v642 = false;
  async function fn184() {
    const v644 = h_s94_fn11(arg564);
    if (v644 !== 0) {
      return { s: v644, v: null };
    }
    const { s: v645, v: v646 } = await h_s94_fn(arg564);
    if (v645 !== 0) {
      return { s: v645, v: null };
    }
    return { s: 0, v: v646 };
  }
  if (arg565) {
    arg564.addEventListener("icecandidateerror", (arg569) => {
      if (fn182(arg569, arg565)) {
        if (v641) {
          v641();
          v641 = null;
          h_s94_fn2(arg564);
        } else {
          v642 = true;
        }
      }
    });
  }
  const v643 = {
    closeConnection: () => h_s94_fn2(arg564),
    createDataChannelAndOffer: async () => {
      const v647 = await fn184();
      if (v647.s !== 0) {
        h_s94_fn2(arg564);
      }
      return v647;
    },
  };
  return arg565
    ? Object.assign(v643, {
        closeConnectionWhenTurnEnds: function () {
          if (!(arg564.connectionState === "closed")) {
            if (v642) {
              h_s94_fn2(arg564);
            } else {
              v641 = visibilitychange(h_s94_fn2, 5e3, arg564);
            }
          }
        },
      })
    : v643;
}
const h_s210_illegalInvocation = (arg570) =>
  arg570 instanceof Error && arg570.message === "Illegal invocation";
const v21 = [3, 7];
function fn82(arg571) {
  return (
    typeof arg571 == "string" ||
    (Array.isArray(arg571) && arg571.every((arg572) => typeof arg572 == "string"))
  );
}
function fn83() {
  return {
    stage1: {
      s94: sig_s94_webkitRTCPeerConnection,
      s219: sig_s219_webkitRTCPeerConnection,
      s167: sig_s167_atob,
      s213: sig_s213_getCurrentPosition,
    },
    stage2: {
      s52: sig_s52_origin,
      s6: sig_s6_availLeft,
      s26: sig_s26_mediaDevices,
      s58: sig_s58,
      s20: sig_s20_hidden,
      s36: sig_s36_div,
      s51: sig_s51_iframe,
      s21: sig_s21_domRectList,
      s154: sig_s154_brave,
      s79: sig_s79_url,
      s23: sig_s23_clipboardItem,
      s29: sig_s29,
      s84: sig_s84_hidden,
      s85: sig_s85_blob,
      s89: sig_s89_storage,
      s17: sig_s17_canvas,
      s87: sig_s87_hidden,
      s92: sig_s92_createDocumentFragment,
      s93: sig_s93_hidden,
      s204: sig_s204_hidden,
      s206: sig_s206_style,
      s207: sig_s207_fontFace,
      s210: sig_s210_gpu,
      s211: sig_s211_decodingInfo,
      s158: sig_s158_hidden,
      s152: sig_s152_hidden,
      s163: sig_s163_applePayError,
      s95: sig_s95_atomics,
      s97: sig_s97_dataTransfer,
      s160: sig_s160_origin,
      s70: sig_s70_textDecoder,
      s106: sig_s106_notification,
      s214: sig_s214_storageBuckets,
      s215: sig_s215_publicKeyCredential,
      s216: sig_s216_managed,
      s217: sig_s217_getBattery,
      s222: sig_s222_keyboard,
      s223: sig_s223_presentationRequest,
    },
    stage3: {
      s22: sig_s22_webAssembly,
      s30: sig_s30_doNotTrack,
      s33: sig_s33_brave,
      s44: sig_s44_prefersColorScheme,
      s45: sig_s45_date,
      s49: sig_s49,
      s50: sig_s50_performance,
      s57: sig_s57_devicePixelRatio,
      s59: sig_s59_msPointerEnabled,
      s60: sig_s60_msLaunchUri,
      s61: sig_s61_webkitPersistentStorage,
      s62: sig_s62_applePayError,
      s63: sig_s63_ongestureend,
      s64: sig_s64_style,
      s65: sig_s65_audio,
      s66: sig_s66_createElement,
      s68: sig_s68_audioBuffer,
      s71: sig_s71,
      s24: sig_s24,
      s72: sig_s72,
      s1: sig_s1_oscpu,
      s2: sig_s2_browserLanguage,
      s3: sig_s3_colorDepth,
      s4: sig_s4_deviceMemory,
      s5: sig_s5_height,
      s7: sig_s7_hardwareConcurrency,
      s9: sig_s9_date,
      s10: sig_s10_sessionStorage,
      s11: sig_s11_localStorage,
      s12: sig_s12_indexedDB,
      s13: sig_s13_openDatabase,
      s14: sig_s14_cpuClass,
      s15: sig_s15_webkitRequestFullscreen,
      s16: sig_s16_plugins,
      s19: sig_s19_touchEvent,
      s27: sig_s27_vendor,
      s28: sig_s28,
      s32: sig_s32_cookie,
      s37: sig_s37_colorGamut,
      s41: sig_s41_invertedColors,
      s39: sig_s39_forcedColors,
      s42: sig_s42_minMonochrome,
      s38: sig_s38_prefersContrast,
      s43: sig_s43_prefersReducedMotion,
      s40: sig_s40_dynamicRange,
      s46: sig_s46,
      s80: sig_s80_pdfViewerEnabled,
      s81: sig_s81,
      s82: sig_s82_language,
      s83: sig_s83_languages,
      s86: sig_s86_removeItem,
      s91: sig_s91_prefersReducedTransparency,
      s96: sig_s96_audioContext,
      s98: sig_s98,
      s99: sig_s99_isSecureContext,
      s200: sig_s200_timeOrigin,
      s201: sig_s201_srChannelCount,
      s202: sig_s202_intl,
      s101: sig_s101_userAgent,
      s103: sig_s103_appVersion,
      s104: sig_s104_rtt,
      s117: sig_s117_plugins,
      s119: sig_s119,
      s123: sig_s123,
      s131: sig_s131,
      s133: sig_s133_external,
      s136: sig_s136_mimeTypes,
      s148: sig_s148,
      s149: sig_s149,
      s150: sig_s150_innerHeight,
      s157: sig_s157,
      s102: sig_s102_userAgentData,
      s118: sig_s118_plugins,
      s120: sig_s120,
      s130: sig_s130_sourceBuffer,
      s132: sig_s132,
      s135: sig_s135_mimeTypes,
      s139: sig_s139_css,
      s142: sig_s142_matchMedia,
      s144: sig_s144_sharedArrayBuffer,
      s145: sig_s145,
      s146: sig_s146_objectToInspect,
      s151: sig_s151,
      s153: sig_s153_onLine,
      s155: sig_s155,
      s156: sig_s156,
      s159: sig_s159_function,
      s162: sig_s162_languages,
      s165: sig_s165_event,
      s166: sig_s166,
      s205: sig_s205_url,
      s203: sig_s203_createElement,
      s209: sig_s209_getRandomValues,
      s212: sig_s212_getComputedStyle,
      s74: sig_s74_canvas,
      s75: sig_s75_canvas,
      s221: sig_s221_canvas,
      s76: sig_s76_canvas,
    },
  };
}
function fn84(arg573) {
  return "agentId" in arg573;
}
function h_s94_fn6(arg574) {
  return (
    arg574.name === "UnknownError" &&
    new RegExp("Cannot create so many PeerConnections").test(readVaultedProp(arg574, "message"))
  );
}
function fn85(arg575) {
  return fn129(arg575, (arg576) => ({ s: 0, v: arg576 }));
}
function sig_s85_blob() {
  return fn142(fn66(250, { s: -3, v: null }), async () => {
    if (fn25() || fn46()) {
      return h_s85_securityError();
    }
    return { s: -1, v: null };
  });
}
async function fn86(arg577, arg578, arg579, arg580, arg581) {
  let v648;
  fn94(arg577, arg578);
  try {
    v648 = await arg581();
  } catch (v649) {
    throw (fn94(arg577, arg580, v649), v649);
  }
  fn94(arg577, arg579, v648);
  return v648;
}
async function fn87(arg582, arg583, arg584, arg585, arg586, arg587, arg588) {
  if (arg582 === undefined) {
    return;
  }
  let v650 = arg582;
  for (let v651 = 0; v651 < arg583; ++v651) {
    const v652 = new Date();
    let v653, v654;
    try {
      v653 = await fn115(() => arg584(v650, v651, arg588), arg588);
    } catch (v656) {
      v654 = v656;
      arg587.failedAttempts.push({ level: 0, endpoint: v650, error: v656 });
    }
    if (v653) {
      const v657 = arg585(v653);
      if ("result" in v657) {
        arg587.result = v657.result;
        break;
      }
      if (
        (arg587.failedAttempts.push({ level: 1, endpoint: v650, error: v657.error }), v657.stop)
      ) {
        break;
      }
    }
    const v655 = arg586(v652, v653, v654);
    if (!v655) {
      break;
    }
    await fn115(fn167(v655[1]), arg588);
    v650 = v655[0];
  }
}
function sig_s50_performance() {
  var v658, v659;
  const jsHeapSizeLimit =
    (v659 = (v658 = window.performance) == null ? undefined : readVaultedProp(v658, "memory")) ==
    null
      ? undefined
      : v659.jsHeapSizeLimit;
  if (jsHeapSizeLimit == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: jsHeapSizeLimit };
}
function typeError(arg589) {
  return arg589 instanceof Error && arg589.name === "TypeError";
}
function fn88(arg590) {
  return !!arg590 && typeof arg590.then == "function";
}
function fn89(arg591, arg592) {
  return fn106(arg591, arg592) ? arg591[arg592] : undefined;
}
async function h_s167_fn3(arg593) {
  try {
    return { s: 0, v: await arg593.createMediaKeys() };
  } catch (v660) {
    const v661 = String((v660 == null ? undefined : readVaultedProp(v660, "message")) ?? v660);
    if (new RegExp("CreateCdmFunc not available").test(v661)) {
      return { s: -1, v: null };
    }
    throw v660;
  }
}
function h_s23_clipboardItem() {
  return (
    fn36([
      "ClipboardItem" in window,
      "PerformanceEventTiming" in window,
      "RTCSctpTransport" in window,
    ]) >= 2
  );
}
function deepClone(arg594) {
  if (arg594 instanceof Array) {
    return arg594.map(deepClone);
  }
  if (arg594 && typeof arg594 == "object") {
    const v662 = {};
    for (const v663 of Object.keys(arg594)) {
      v662[v663] = deepClone(arg594[v663]);
    }
    return v662;
  }
  return arg594;
}
function fn90(arg595, arg596, arg597, arg598) {
  const v664 = fn157(arg595, arg596, arg598),
    v665 = (function (arg599, arg600) {
      let v669 = () => {};
      return fn31(
        new Promise((arg601) => {
          v669 = visibilitychange(arg601, arg599, arg600);
        }),
        v669,
      );
    })(arg597, arg598);
  let v666 = false;
  const v667 = () => {
      if (!v666) {
        v666 = true;
        v664.cancel();
        v665.cancel();
      }
    },
    v668 = Promise.race([v664, v665]);
  v668.then(v667, v667);
  return fn31(v668, v667);
}
async function h_s70_fn7(arg602) {
  return arg602.info ?? (await arg602.requestAdapterInfo());
}
function fn91(arg603, arg604) {
  const v670 = arg603[0] >>> 16,
    v671 = 65535 & arg603[0],
    v672 = arg603[1] >>> 16,
    v673 = 65535 & arg603[1],
    v674 = arg604[0] >>> 16,
    v675 = 65535 & arg604[0],
    v676 = arg604[1] >>> 16;
  let v677 = 0,
    v678 = 0,
    v679 = 0,
    v680 = 0;
  v680 += v673 + (65535 & arg604[1]);
  v679 += v680 >>> 16;
  v680 &= 65535;
  v679 += v672 + v676;
  v678 += v679 >>> 16;
  v679 &= 65535;
  v678 += v671 + v675;
  v677 += v678 >>> 16;
  v678 &= 65535;
  v677 += v670 + v674;
  v677 &= 65535;
  arg603[0] = (v677 << 16) | v678;
  arg603[1] = (v679 << 16) | v680;
}
const v22 = /\(([^(^\s^}]+):(\d)+:(\d)+\)/i,
  v23 = /@([^(^\s^}]+):(\d)+:(\d)+/i;
function h_s94_fn7(arg605, arg606) {
  const v681 = fn20(arg605);
  let { query: query } = v681;
  for (const [v682, v683] of Object.entries(arg606)) {
    for (const v684 of Array.isArray(v683) ? v683 : [v683]) {
      query = `${query ? `${query}&` : ""}${v682}=${h_s94_fn4(v684)}`;
    }
  }
  v681.query = query;
  return fn30(v681);
}
function sig_s151() {
  const v685 = Object.getOwnPropertyDescriptor(document, "createElement");
  if (v685) {
    return { s: 0, v: !("writeable" in v685) };
  }
  return { s: -1, v: null };
}
const h_s157_fn2 = {
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
class botdError extends Error {
  constructor(arg607, arg608) {
    super(arg608);
    this.state = arg607;
    this.name = "BotdError";
    Object.setPrototypeOf(this, botdError.prototype);
  }
}
async function h_s26_permissionsQuery() {
  return readVaultedProp(await navigator.permissions.query({ name: "microphone" }), "state");
}
async function h_s69_subtle(arg609, arg610) {
  if (h_s69_fn3(arg610)) {
    return arg609;
  }
  const v686 = fn20(arg609);
  await Promise.all(
    h_s69_pathList.map(async (arg611) => {
      const v687 = v686[arg611];
      var v688;
      if (arg610[arg611] && v687) {
        v686[arg611] = await (async function (arg612) {
          if (arg612 === "") {
            return "";
          }
          const subtle = window.crypto?.subtle;
          return subtle?.digest
            ? base64Encode(await subtle.digest("SHA-256", stringToBytes(arg612)))
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
            : "stripped";
        })(arg611 === "query" ? ((v688 = v687), v688.split("&").sort().join("&")) : v687);
      }
    }),
  );
  return fn30(v686);
}
function withoutDefault2(arg613) {
  return { __type__: "withoutDefault", value: arg613 };
}
async function sig_s20_hidden(arg614) {
  return await h_s20_fn(arg614);
}
async function sig_s23_clipboardItem() {
  if (fn11() && h_s23_clipboardItem()) {
    return { s: -3, v: null };
  }
  const v689 = await Promise.race([fn167(100, null), h_s23_webkitRequestFileSystem()]);
  if (v689 === null) {
    return { s: -2, v: null };
  }
  if (v689 === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: v689 };
}
function sig_s223_presentationRequest() {
  return fn142(fn66(300, { s: -3, v: null }), async () => {
    const presentationRequest = window.PresentationRequest;
    if (typeof presentationRequest !== "function") {
      return { s: -1, v: null };
    }
    let v690;
    try {
      v690 = new presentationRequest(["cast:"]);
    } catch (v691) {
      return { s: -4, v: null };
    }
    if (typeof v690.reconnect !== "function") {
      return { s: -1, v: null };
    }
    try {
      await v690.reconnect("1bf61339ba6d48768badd4270e9c568c");
    } catch (v692) {
      return { s: 0, v: v692 instanceof Error ? v692.message : String(v692) };
    }
    return { s: -2, v: null };
  });
}
function sig_s24() {
  return { s: 0, v: eval.toString().length };
}
function h_s75_fn5(arg615) {
  return typeof arg615 == "string" && !arg615.match(/[^A-Z0-9_x]/);
}
function sig_s146_objectToInspect() {
  try {
    objectToInspect;
    return { s: 0, v: true };
  } catch (v693) {
    return { s: 0, v: false };
  }
}
function fn92(arg616) {
  return isArray(arg616) ? arg616 : [arg616];
}
function h_s167_fn4(arg617) {
  return { e: h_s167_fn6(arg617) };
}
function crc32OfBytes(arg618) {
  const v694 = asUint8Array(arg618);
  v2 =
    v2 ||
    (function () {
      let v696;
      const uint32Array4 = new Uint32Array(256);
      for (let v697 = 0; v697 < 256; v697++) {
        v696 = v697;
        for (let v698 = 0; v698 < 8; v698++) {
          v696 = 1 & v696 ? 3988292384 ^ (v696 >>> 1) : v696 >>> 1;
        }
        uint32Array4[v697] = v696;
      }
      return uint32Array4;
    })();
  let v695 = ~0;
  for (let v699 = 0; v699 < v694.length; v699++) {
    v695 = (v695 >>> 8) ^ v2[255 & (v695 ^ v694[v699])];
  }
  return (-1 ^ v695) >>> 0;
}
function sig_s49() {
  const { performance: v700 } = window;
  if (!v700?.now) {
    return { s: -1, v: null };
  }
  let v701 = 1,
    v702 = 1,
    v703 = v700.now(),
    v704 = v703;
  for (let v705 = 0; v705 < 5e4; v705++) {
    if ((v703 = v704) < (v704 = v700.now())) {
      const v706 = v704 - v703;
      if (v706 > v701) {
        if (v706 < v702) {
          v702 = v706;
        }
      } else {
        if (v706 < v701) {
          v702 = v701;
          v701 = v706;
        }
      }
    }
  }
  return { s: 0, v: [v701, v702] };
}
async function sig_s204_hidden(arg619) {
  return sharedIframeIsNotAvailable((arg620, arg621) => {
    const element5 = arg621.document.createElement("div");
    element5.style.width = "100px";
    element5.style.height = "100px";
    element5.style.overflow = "scroll";
    element5.style.visibility = "hidden";
    arg621.document.body.appendChild(element5);
    const v707 = element5.offsetWidth === element5.clientWidth;
    arg621.document.body.removeChild(element5);
    return { s: 0, v: v707 };
  }, arg619.sis);
}
function sig_s167_atob({ cache: arg622, esc: arg623 = true }) {
  if (!arg623) {
    return { s: -5, v: null };
  }
  const v708 = { s: -2, v: null },
    v709 = fn150(arg622);
  h_s167_fn(v709)
    .then((arg624) => {
      fn98(v708, arg624);
    })
    .catch((arg625) => fn98(v708, h_s167_fn4(arg625)));
  return v708;
}
function h_s43_prefersReducedMotion(arg626) {
  return matchMedia(`(prefers-reduced-motion: ${arg626})`).matches;
}
function h_s33_fn(arg627) {
  return { s: 0, v: arg627 };
}
function h_s160_fn(arg628) {
  const v710 = arg628.filter((arg629) => {
      return fn48(arg629?.name?.slice(0, 6)) === 1655763047;
    }),
    v711 = [];
  if (v710.length > 0) {
    const v712 = new Map();
    v710.forEach((arg630) => {
      const v713 = arg630.name.codePointAt(6);
      if (v713 !== undefined) {
        const v714 = v712.get(v713) || 0;
        v712.set(v713, v714 + 1);
      }
    });
    v712.forEach((arg631, arg632) => {
      v711.push(arg632, arg631);
    });
  }
  return { s: arg628.length ? 0 : 1, v: v711 };
}
function fn93(arg633) {
  const v715 = [0, arg633[0] >>> 1];
  fn65(arg633, v715);
  fn166(arg633, v3);
  v715[1] = arg633[0] >>> 1;
  fn65(arg633, v715);
  fn166(arg633, v4);
  v715[1] = arg633[0] >>> 1;
  fn65(arg633, v715);
}
const h_s101_userAgent = function () {
    return navigator.userAgent;
  },
  h_s103_appVersion = function () {
    const appVersion = navigator.appVersion;
    if (appVersion == null) {
      throw new botdError(-1, "navigator.appVersion is undefined");
    }
    return appVersion;
  },
  h_s104_rtt = function () {
    if (navigator.connection === undefined) {
      throw new botdError(-1, "navigator.connection is undefined");
    }
    if (navigator.connection.rtt === undefined) {
      throw new botdError(-1, "navigator.connection.rtt is undefined");
    }
    return navigator.connection.rtt;
  },
  h_s150_innerHeight = function () {
    return {
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  },
  h_s117_navigatorPluginsIsUndefined = function () {
    if (navigator.plugins === undefined) {
      throw new botdError(-1, "navigator.plugins is undefined");
    }
    if (navigator.plugins.length === undefined) {
      throw new botdError(-3, "navigator.plugins.length is undefined");
    }
    return navigator.plugins.length;
  },
  h_s119_fn = function () {
    try {
      null[0]();
    } catch (v716) {
      if (v716 instanceof Error && v716.stack != null) {
        return v716.stack.toString();
      }
    }
    throw new botdError(-3, "errorTrace signal unexpected behaviour");
  },
  h_s123_fn = function () {
    const { productSub: productSub } = navigator;
    if (productSub === undefined) {
      throw new botdError(-1, "navigator.productSub is undefined");
    }
    return productSub;
  },
  h_s133_external = function () {
    if (window.external === undefined) {
      throw new botdError(-1, "window.external is undefined");
    }
    const { external: external } = window;
    if (typeof external.toString != "function") {
      throw new botdError(-2, "window.external.toString is not a function");
    }
    return external.toString();
  },
  h_s136_mimeTypes = function () {
    if (navigator.mimeTypes === undefined) {
      throw new botdError(-1, "navigator.mimeTypes is undefined");
    }
    const { mimeTypes: mimeTypes } = navigator;
    let v717 = Object.getPrototypeOf(mimeTypes) === MimeTypeArray.prototype;
    for (let v718 = 0; v718 < mimeTypes.length; v718++) {
      if (v717) {
        v717 = Object.getPrototypeOf(mimeTypes[v718]) === MimeType.prototype;
      }
    }
    return v717;
  },
  h_s106_notification = async function () {
    if (window.Notification === undefined) {
      throw new botdError(-1, "window.Notification is undefined");
    }
    if (navigator.permissions === undefined) {
      throw new botdError(-1, "navigator.permissions is undefined");
    }
    const { permissions: permissions } = navigator;
    if (typeof permissions.query != "function") {
      throw new botdError(-2, "navigator.permissions.query is not a function");
    }
    try {
      const v719 = await permissions.query({ name: "notifications" });
      return window.Notification.permission === "denied" && v719.state === "prompt";
    } catch (v720) {
      throw new botdError(-3, "notificationPermissions signal unexpected behaviour");
    }
  },
  h_s131_fn = function () {
    if (document.documentElement === undefined) {
      throw new botdError(-1, "document.documentElement is undefined");
    }
    const { documentElement: documentElement } = document;
    if (typeof documentElement.getAttributeNames != "function") {
      throw new botdError(-2, "document.documentElement.getAttributeNames is not a function");
    }
    return documentElement.getAttributeNames();
  },
  h_s148_fn = function () {
    if (Function.prototype.bind === undefined) {
      throw new botdError(-2, "Function.prototype.bind is undefined");
    }
    return Function.prototype.bind.toString();
  },
  h_s149_fn = function () {
    const { process: process } = window;
    if (process === undefined) {
      throw new botdError(-1, `${"window.process is"} undefined`);
    }
    if (process && typeof process != "object") {
      throw new botdError(-3, `${"window.process is"} not an object`);
    }
    return process;
  },
  h_s157_fn3 = function () {
    const v721 = {
      [h_s157_fn2.Awesomium]: { window: ["awesomium"] },
      [h_s157_fn2.Cef]: { window: ["RunPerfTest"] },
      [h_s157_fn2.CefSharp]: { window: ["CefSharp"] },
      [h_s157_fn2.CoachJS]: { window: ["emit"] },
      [h_s157_fn2.FMiner]: { window: ["fmget_targets"] },
      [h_s157_fn2.Geb]: { window: ["geb"] },
      [h_s157_fn2.NightmareJS]: { window: ["__nightmare", "nightmare"] },
      [h_s157_fn2.Phantomas]: { window: ["__phantomas"] },
      [h_s157_fn2.PhantomJS]: { window: ["callPhantom", "_phantom"] },
      [h_s157_fn2.Rhino]: { window: ["spawn"] },
      [h_s157_fn2.Selenium]: {
        window: [
          "_Selenium_IDE_Recorder",
          "_selenium",
          "calledSelenium",
          /^([a-z]){3}_.*_(Array|Promise|Symbol)$/,
        ],
        document: ["__selenium_evaluate", "selenium-evaluate", "__selenium_unwrapped"],
      },
      [h_s157_fn2.WebDriverIO]: { window: ["wdioElectron"] },
      [h_s157_fn2.WebDriver]: {
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
      [h_s157_fn2.HeadlessChrome]: { window: ["domAutomation", "domAutomationController"] },
    };
    let v722;
    const v723 = {},
      v724 = h_s157_fn4(window);
    let v725 = [];
    for (v722 in (window.document !== undefined && (v725 = h_s157_fn4(window.document)), v721)) {
      const v726 = v721[v722];
      if (v726 !== undefined) {
        const v727 = v726.window !== undefined && h_s157_fn5(v724, ...v726.window),
          v728 =
            !(v726.document === undefined || !v725.length) && h_s157_fn5(v725, ...v726.document);
        v723[v722] = v727 || v728;
      }
    }
    return v723;
  };
function fn94(arg634, arg635, ...arg636) {
  if (arg634) {
    fn163(() => {
      const v729 = arg635(...arg636);
      if (v729 !== undefined) {
        arg634(v729);
      }
    });
  }
}
function h_s75_fn6(arg637) {
  return Object.keys(arg637.__proto__).filter(h_s75_fn5);
}
function decodeJsonBytes(arg638) {
  const v730 = fn124(),
    v731 = asUint8Array(arg638);
  let v732 = 0;
  const v733 = () => {
      v738();
      if (v731[v732] === 34) {
        return v734();
      }
      if (fn74(v731[v732])) {
        return v735();
      }
      if (v739(uint8Array2)) {
        v732 += uint8Array2.length;
        return null;
      }
      if (v739(uint8Array3)) {
        v732 += uint8Array3.length;
        return true;
      }
      if (v739(uint8Array4)) {
        v732 += uint8Array4.length;
        return false;
      }
      if (v731[v732] === 91) {
        return v736();
      }
      if (v731[v732] === 123) {
        return v737();
      }
      return v740();
    },
    v734 = () => {
      for (v730.len = 0; v732++, v731[v732] !== 34;) {
        if (v731[v732] === 92) {
          if ((v732++, v731[v732] === 117)) {
            const v743 = parseInt(fn43(v731.subarray(v732 + 1, v732 + 5)), 16);
            fn78(v730, stringToBytes(String.fromCharCode(v743)));
            v732 += 4;
            continue;
          }
          const v742 = v18[v731[v732]];
          if (v742) {
            fn58(v730, v742);
            continue;
          }
          return v740();
        }
        if (v731[v732] === undefined) {
          return v740();
        }
        fn58(v730, v731[v732]);
      }
      v732++;
      return fn43(fn76(v730));
    },
    v735 = () => {
      const v744 = v732;
      for (
        ;
        v731[v732] === 46 ||
        v731[v732] === 101 ||
        v731[v732] === 69 ||
        v731[v732] === 43 ||
        fn74(v731[v732]);
      ) {
        v732++;
      }
      return Number(fn43(v731.subarray(v744, v732)));
    },
    v736 = () => {
      const v745 = [];
      for (v732++; ;) {
        if ((v738(), v731[v732] === 93)) {
          v732++;
          break;
        }
        if (v745.length) {
          if (v731[v732] !== 44) {
            return v740();
          }
          v732++;
        }
        v745.push(v733());
      }
      return v745;
    },
    v737 = () => {
      const v746 = {};
      let v747 = true;
      for (v732++; ;) {
        if ((v738(), v731[v732] === 125)) {
          v732++;
          break;
        }
        if (!v747) {
          if (v731[v732] !== 44) {
            return v740();
          }
          v732++;
          v738();
        }
        if (v731[v732] !== 34) {
          return v740();
        }
        const v748 = v734();
        if ((v738(), v731[v732] !== 58)) {
          return v740();
        }
        v732++;
        Object.defineProperty(v746, v748, {
          value: v733(),
          configurable: true,
          enumerable: true,
          writable: true,
        });
        v747 = false;
      }
      return v746;
    },
    v738 = () => {
      for (; v731[v732] === 32 || v731[v732] === 10 || v731[v732] === 13 || v731[v732] === 9;) {
        v732++;
      }
    },
    v739 = (arg639) => {
      for (let v749 = 0; v749 < arg639.length; v749++) {
        if (v731[v732 + v749] !== arg639[v749]) {
          return false;
        }
      }
      return true;
    },
    v740 = () => {
      throw new SyntaxError("Unexpected " + (v732 < v731.length ? `byte ${v732}` : "end"));
    },
    v741 = v733();
  v738();
  if (v731[v732] !== undefined) {
    v740();
  }
  return v741;
}
function fn95(buffer3) {
  return buffer3.byteLength > 1024 && fn119();
}
function fn96(arg640, arg641) {
  const v750 = arg640[0];
  if ((arg641 %= 64) === 32) {
    arg640[0] = arg640[1];
    arg640[1] = v750;
  } else {
    if (arg641 < 32) {
      arg640[0] = (v750 << arg641) | (arg640[1] >>> (32 - arg641));
      arg640[1] = (arg640[1] << arg641) | (v750 >>> (32 - arg641));
    } else {
      arg641 -= 32;
      arg640[0] = (arg640[1] << arg641) | (v750 >>> (32 - arg641));
      arg640[1] = (v750 << arg641) | (arg640[1] >>> (32 - arg641));
    }
  }
}
async function h_s26_permissionsQuery2() {
  return readVaultedProp(await navigator.permissions.query({ name: "camera" }), "state");
}
function sig_s166() {
  return { s: 0, v: h_s166_fn(Navigator.prototype, h_s166_fn2) };
}
async function h_s69_fn(arg642, arg643) {
  return Promise.all(
    arg642.map(async (arg644) => {
      const [v751, v752] = await Promise.all([
        h_s69_subtle(arg644.l, arg643),
        h_s69_subtle(arg644.f, arg643),
      ]);
      return { l: v751, f: v752 };
    }),
  );
}
function fn97(arg645, arg646, arg647 = fn64) {
  let v753 = "";
  for (let v754 = 0; v754 < arg645; v754++) {
    v753 += arg646.charAt(arg647() * arg646.length);
  }
  return v753;
}
const v24 = [3, 13],
  v25 = [3, 14];
function fn98(arg648, arg649) {
  for (const v755 of Object.keys(arg648)) {
    delete arg648[v755];
  }
  Object.assign(arg648, arg649);
}
async function h_s213_permissionsQuery() {
  return readVaultedProp(await navigator.permissions.query({ name: "geolocation" }), "state");
}
function fn99() {
  if (!("DataTransfer" in window)) {
    return false;
  }
  try {
    new window.DataTransfer();
    return true;
  } catch (v756) {
    if (v756 instanceof Error && v756.name === "TypeError") {
      return false;
    }
    throw v756;
  }
}
function fn100() {
  return (
    fn9([
      "msWriteProfilerMark" in window,
      "MSStream" in window,
      "msLaunchUri" in navigator,
      "msSaveBlob" in navigator,
    ]) >= 3 && !fn49()
  );
}
function fn101(arg650, arg651) {
  try {
    const v757 = arg650();
    if (fn88(v757)) {
      v757.then(
        (arg652) => arg651(true, arg652),
        (arg653) => arg651(false, arg653),
      );
    } else {
      arg651(true, v757);
    }
  } catch (v758) {
    arg651(false, v758);
  }
}
async function h_s70_getPreferredCanvasFormat(gpuAdapter, arg654, arg655) {
  const v759 = await gpuAdapter.requestDevice({ requiredFeatures: arg654 }),
    pi = Math.PI,
    v760 = [
      [0, 1, 0, pi / 7],
      [1, 0, 0, pi / 8],
      [0, 1, 1, pi / 4],
      [1, 2, 1, pi / 8],
    ],
    v761 = v760.length,
    uint8Array14 = new Uint8Array(v761 * 40),
    v762 = navigator.gpu.getPreferredCanvasFormat();
  arg655.configure({ device: v759, format: v762 });
  const v763 = v759.createShaderModule({
      label: "shader",
      code: "struct O{@builtin(position)position:vec4f,@location(0)texcoord:vec2f}fn rotation(a:vec4f)->mat4x4f{var m=mat4x4f();var x=a.x;var y=a.y;var z=a.z;let n=sqrt(x*x+y*y+z*z);x/=n;y/=n;z/=n;let xx=x*x;let yy=y*y;let zz=z*z;let c=cos(a.w);let s=sin(a.w);let o=1-c;m[0]=vec4f(xx+(1-xx)*c,x*y*o+z*s,x*z*o-y*s,0);m[1]=vec4f(x*y*o-z*s,yy+(1-yy)*c,y*z*o+x*s,0);m[2]=vec4f(x*z*o+y*s,y*z*o-x*s,zz+(1-zz)*c,0);m[3]=vec4f(0,0,0,1);return transpose(m);}@group(1) @binding(0) var<uniform> axr:vec4f;@vertex fn vs(@builtin(vertex_index) i:u32)->O{let n=vec2f(-0.5,0.5);let o=vec2f(1.0,0.0);let v=array(n.xxy,n.yxy,n.xyy,n.yyy,n.xxx,n.yxx,n.xyx,n.yyx);let t=array(0,2,3,0,3,1,4,6,7,4,7,5,0,2,6,0,6,4,1,3,7,1,7,5,2,6,7,2,7,3,0,4,5,0,5,1);let u=array(o.yx,o.yy,o.xy,o.yx,o.xy,o.xx);var r:O;r.position=rotation(axr)*vec4f(v[t[i]],1);r.texcoord=u[i%6];return r;}@group(0) @binding(0) var s:sampler;@group(0) @binding(1) var t:texture_2d<f32>;@fragment fn fs(i:O)->@location(0) vec4f{return textureSample(t,s,i.texcoord);}",
    }),
    v764 = v759.createRenderPipeline({
      label: "pipeline",
      layout: "auto",
      vertex: { module: v763 },
      fragment: { module: v763, targets: [{ format: v762 }] },
      primitive: { cullMode: "none" },
    }),
    v765 = [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
    ],
    uint8Array15 = new Uint8Array(
      Array(63)
        .fill(undefined)
        .map((arg656, arg657) => v765[arg657 % 3])
        .flat(),
    ),
    v766 = v759.createTexture({
      label: "checkered",
      size: [7, 9],
      format: "rgba8unorm",
      usage: window.GPUTextureUsage.TEXTURE_BINDING | window.GPUTextureUsage.COPY_DST,
    });
  v759.queue.writeTexture(
    { texture: v766 },
    uint8Array15,
    { bytesPerRow: 28 },
    { width: 7, height: 9 },
  );
  const v767 = v759.createSampler({ magFilter: "nearest" }),
    v768 = v759.createBindGroup({
      layout: v764.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: v767 },
        { binding: 1, resource: v766.createView() },
      ],
    }),
    v769 = v760.map((arg658) => {
      const v774 = v759.createBuffer({
        label: "axrs",
        size: 4 * Float32Array.BYTES_PER_ELEMENT,
        usage: window.GPUBufferUsage.UNIFORM,
        mappedAtCreation: true,
      });
      new Float32Array(v774.getMappedRange()).set(arg658);
      v774.unmap();
      return v759.createBindGroup({
        layout: v764.getBindGroupLayout(1),
        entries: [{ binding: 0, resource: { buffer: v774 } }],
      });
    }),
    v770 = v759.createQuerySet({ type: "timestamp", count: 2 }),
    v771 = v759.createBuffer({
      size: v770.count * 8,
      usage: window.GPUBufferUsage.QUERY_RESOLVE | window.GPUBufferUsage.COPY_SRC,
    }),
    v772 = v759.createBuffer({
      size: v771.size * v761,
      usage: window.GPUBufferUsage.COPY_DST | window.GPUBufferUsage.MAP_READ,
    }),
    v773 = {
      label: "renderPass",
      colorAttachments: [{ clearValue: [0.3, 0.3, 0.3, 1], loadOp: "clear", storeOp: "store" }],
      timestampWrites: { querySet: v770, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 },
    };
  for (let v775 = 0; v775 < v769.length; v775++) {
    const v776 = v769[v775];
    v773.colorAttachments[0].view = arg655.getCurrentTexture().createView();
    const v777 = v759.createCommandEncoder({ label: "encoder" }),
      v778 = v777.beginRenderPass(v773);
    v778.setPipeline(v764);
    v778.setBindGroup(0, v768);
    v778.setBindGroup(1, v776);
    const v779 = window.performance.now();
    v778.draw(48);
    v778.end();
    v777.resolveQuerySet(v770, 0, v770.count, v771, 0);
    if (v772.mapState === "unmapped") {
      v777.copyBufferToBuffer(v771, 0, v772, v775 * 16, v771.size);
    }
    const v780 = v777.finish();
    v759.queue.submit([v780]);
    const v781 = h_s70_fn3(arg655.canvas);
    uint8Array14.set(v781, 8 + v775 * 40);
    uint8Array14.set(new Uint8Array(new Float64Array([v779]).buffer), v775 * 40);
  }
  if (v772.mapState === "unmapped") {
    await v772.mapAsync(window.GPUMapMode.READ);
    const v782 = v772.getMappedRange(),
      uint8Array16 = new Uint8Array(v782);
    for (let v783 = 0; v783 < v761; v783++) {
      uint8Array14.set(uint8Array16.subarray(v783 * 16, (v783 + 1) * 16), 24 + v783 * 40);
    }
    v772.unmap();
  }
  return base64Encode(uint8Array14);
}
function sig_s89_storage() {
  return fn142(fn157(270, 9, { s: -2, v: null }), async () => {
    const storage2 = navigator.storage;
    if (!storage2?.getDirectory) {
      return { s: -1, v: null };
    }
    let v784, v785;
    try {
      v784 = await storage2.getDirectory();
    } catch (v786) {
      return {
        s: 0,
        v: { re: v786 instanceof Error ? v786.message : String(v786), cwe: "", clm: 0, wlm: 0 },
      };
    }
    try {
      v785 = Math.random().toString();
      const v787 = await v784.getFileHandle(v785, { create: true }),
        lastModified = (await v787.getFile()).lastModified;
      if ((await fn167(10), typeof v787.createWritable !== "function")) {
        return { s: 0, v: { re: "", cwe: "createWritable is not a function", clm: 0, wlm: 0 } };
      }
      const v788 = await v787.createWritable({ keepExistingData: true });
      try {
        await v788.write(".agent");
      } finally {
        await v788.close();
      }
      return {
        s: 0,
        v: { re: "", cwe: "", clm: lastModified, wlm: (await v787.getFile()).lastModified },
      };
    } catch (v789) {
      return {
        s: 0,
        v: { re: "", cwe: v789 instanceof Error ? v789.message : String(v789), clm: 0, wlm: 0 },
      };
    } finally {
      if (v785 && typeof v784.removeEntry === "function") {
        v784.removeEntry(v785).catch(() => {});
      }
    }
  });
}
function fn102(arg659 = false) {
  const v790 = fn71();
  if (v790.audioCapabilities) {
    v790.audioCapabilities[0].robustness = "SW_SECURE_CRYPTO";
  }
  if (arg659) {
    v790.sessionTypes = ["persistent-license"];
  }
  return v790;
}
function h_s69_fn2(arg660) {
  if (!arg660 || typeof arg660 != "object") {
    return false;
  }
  const v791 = arg660;
  return (
    !(
      (!fn49() && !fn100()) ||
      (v791.name !== "Error" && v791.name !== "TypeError") ||
      v791.message !== "Permission denied"
    ) || v791.name === "SecurityError"
  );
}
function fn103(arg661) {
  const [v792] = arg661.split("/").slice(-1),
    v793 = new window.DataTransfer(),
    v794 = resolveNameByHash(new window.RegExp("").exec(""), "input"),
    v795 = document.createElement(v794);
  v795.type = "file";
  const v796 = new window.File([], arg661, { type: "text/plain" });
  try {
    v793.items.add(v796);
  } catch (v797) {
    if (
      v797 instanceof Error &&
      v797.name === "TypeError" &&
      v797.message?.indexOf("must be an instance of File") !== -1
    ) {
      return [v792, -3, null];
    }
    throw v797;
  }
  v795.files = v793.files;
  if (typeof v795.webkitEntries === "undefined") {
    return [v792, -4, null];
  }
  if (v795.webkitEntries.length === 0) {
    return [v792, -2, null];
  }
  return [v792, 0, v795.webkitEntries[0]];
}
function fn104() {
  return `js/${"4.1.4"}`;
}
function h_s94_notSupportedError(arg662, arg663) {
  const rtcPeerConnection = arg663
    ? window.RTCPeerConnection || window.webkitRTCPeerConnection
    : window.RTCPeerConnection;
  if (!rtcPeerConnection) {
    return { s: -3, v: null };
  }
  let v798;
  try {
    v798 = new rtcPeerConnection(arg662);
  } catch (v799) {
    if (v799 instanceof Error) {
      if (v799.name === "NotSupportedError") {
        return { s: -6, v: null };
      }
      if (h_s94_fn6(v799)) {
        return { s: -9, v: null };
      }
    }
    throw v799;
  }
  return { s: 0, v: v798 };
}
function fn105(arg664, arg665) {
  if (arg664.arr.length < arg665) {
    const uint8Array17 = new Uint8Array(Math.max(2 * arg664.arr.length, arg665));
    uint8Array17.set(arg664.arr);
    arg664.arr = uint8Array17;
  }
}
function sig_s82_language() {
  const language2 = navigator.language;
  if (language2) {
    return { s: 0, v: language2 };
  }
  return { s: -1, v: null };
}
function fn106(arg666, arg667) {
  return Object.prototype.hasOwnProperty.call(arg666, arg667);
}
function sig_s83_languages() {
  const languages3 = navigator.languages;
  if (languages3) {
    return { s: 0, v: languages3 };
  }
  return { s: -1, v: null };
}
const agentList = ["agent", "localStorage", "sessionStorage"],
  v26 = ["optimize-cost", "aggressive"];
function fn107(arg668, arg669, arg670, arg671) {
  const v800 = (function* (arg672, arg673, arg674) {
      let v804 = 0,
        v805 = 0;
      for (; v804 < arg672.length && v805 < arg673.length;) {
        if (arg674(arg672[v804], arg673[v805])) {
          yield arg672[v804];
          v804++;
        } else {
          yield arg673[v805];
          v805++;
        }
      }
      for (; v804 < arg672.length; v804++) {
        yield arg672[v804];
      }
      for (; v805 < arg673.length; v805++) {
        yield arg673[v805];
      }
    })(
      arg668.map((arg675) => ({ t: fn69(arg675.time), s: arg675.state === "visible" ? "v" : "h" })),
      arg669,
      (arg676, arg677) => arg676.t < arg677.t,
    ),
    v801 = [];
  let v802;
  const v803 = () => {
    if (v801.length === 0 && v802 !== undefined) {
      v801.push({ t: arg670, s: v802 });
    }
  };
  for (; v801.length < 100;) {
    const v806 = v800.next();
    if (v806.done) {
      break;
    }
    const v807 = v806.value,
      v808 = v807.t,
      v809 = v807.s;
    if (v808 > arg671) {
      break;
    }
    if (v808 < arg670) {
      v802 = v809;
    } else {
      if (v809 !== v802) {
        v803();
        v801.push(v807);
        v802 = v809;
      }
    }
  }
  v803();
  return v801;
}
function h_s69_fn3(arg678) {
  return !(arg678 && h_s69_pathList.some((arg679) => arg678[arg679]));
}
function sig_s130_sourceBuffer() {
  return { s: 0, v: [typeof SourceBuffer, typeof SourceBufferList] };
}
function fn108() {
  let v810, v811;
  const v812 = new Promise((arg680, arg681) => {
    v810 = arg680;
    v811 = arg681;
  });
  v812.resolve = v810;
  v812.reject = v811;
  return v812;
}
function fn109(arg682) {
  return new Uint8Array([arg682 >> 24, arg682 >> 16, arg682 >> 8, arg682]);
}
const v27 = { "optimize-cost": 3600, aggressive: 43200 };
function h_s217_fn(arg683) {
  return Number.isFinite(arg683) ? arg683 : h_s217_fn2;
}
function sig_s165_event() {
  const isTrusted = new window.Event("").isTrusted;
  if (typeof isTrusted !== "boolean") {
    return { s: -1, v: null };
  }
  return { s: 0, v: { isTrusted: isTrusted } };
}
function h_s17_fn(canvas5) {
  return canvas5.toDataURL();
}
async function sig_s94_webkitRTCPeerConnection({ te: arg684 }, arg685) {
  const v813 = function (arg686, arg687, arg688) {
      return arg686(arg687, arg688);
    },
    v814 = h_s94_fn10(),
    v815 = await v813(fn142, fn66(300, -4), h_s94_fn8.bind(null, v814, arg684, arg685));
  return () => {
    const v816 = v815();
    if (v816 === 0 || v816 === -4) {
      return { s: v816, v: { u: v814, e: [], s: [] } };
    }
    return { s: v816, v: null };
  };
}
function h_s36_fn(arg689) {
  arg689.style.setProperty("visibility", "hidden", "important");
  arg689.style.setProperty("display", "block", "important");
}
function h_s163_fn(arg690) {
  return sharedIframeIsNotAvailable(
    (arg691, arg692) => {
      const v817 = new Promise((arg693) => {
        let v818;
        if (fn11()) {
          v818 = new Error();
          v818.name = " ";
          Object.defineProperty(v818, "stack", { get: arg693 });
        } else {
          v818 = arg692.document.createElement("div");
          v818.toString = () => "";
          Object.defineProperty(v818, "id", {
            get: () => {
              arg693(true);
              const v819 = new Error();
              throw ((v819.name = ""), v819);
            },
          });
        }
        arg692.setTimeout(arg692.console.debug, 0, v818);
        arg692.setTimeout(() => {
          arg693(false);
        });
      });
      return fn21(v817).then((arg694) => ({ s: 0, v: arg694 === undefined || arg694 }));
    },
    readVaultedProp(arg690, "sis"),
  );
}
async function sig_s69_subtle({ urlHashing: arg695 }) {
  const v820 = (function (arg696) {
    const v821 = [];
    let v822 = arg696;
    for (;;) {
      try {
        const href = v822.location?.href,
          referrer = v822.document?.referrer;
        if (href === undefined || referrer === undefined) {
          return { s: 1, v: v821 };
        }
        v821.push({ l: href, f: referrer });
        const parent = v822.parent;
        if (!parent || parent === v822) {
          return { s: 0, v: v821 };
        }
        v822 = parent;
      } catch (v823) {
        if (h_s69_fn2(v823)) {
          return { s: 1, v: v821 };
        }
        throw v823;
      }
    }
  })(window);
  return { ...v820, v: await h_s69_fn(v820.v, arg695) };
}
function fn110({ message: arg697, code: arg698, ...arg699 }) {
  const v824 = new fingerprintError(arg697, arg698);
  Object.assign(v824, arg699);
  return v824;
}
function fn111(arg700, arg701) {
  if (arg701 === "") {
    return [arg700, []];
  }
  const v825 = arg700.split(arg701);
  return [v825[0], v825.length > 1 ? v825.slice(1) : []];
}
async function h_s51_iframe(arg702, arg703, arg704 = 50) {
  var parentElement2;
  for (; !document.body;) {
    await fn168(arg704);
  }
  const iframe2 = document.createElement("iframe");
  try {
    for (
      await new Promise((arg705, arg706) => {
        let v826 = false;
        const v827 = () => {
          v826 = true;
          arg705();
        };
        iframe2.onload = v827;
        iframe2.onerror = (arg707) => {
          v826 = true;
          arg706(arg707);
        };
        const { style: style5 } = iframe2;
        style5.setProperty("display", "block", "important");
        style5.position = "absolute";
        style5.top = "0";
        style5.left = "0";
        style5.visibility = "hidden";
        if (arg703 && ("srcdoc" in iframe2)) {
          iframe2.srcdoc = arg703;
        } else {
          iframe2.src = "about:blank";
        }
        document.body.appendChild(iframe2);
        const complete2 = () => {
          if (!v826) {
            if (iframe2.contentWindow?.document?.readyState === "complete") {
              v827();
            } else {
              setTimeout(complete2, 10);
            }
          }
        };
        complete2();
      });
      !iframe2.contentWindow?.document?.body;
    ) {
      await fn168(arg704);
    }
    return await arg702(iframe2, iframe2.contentWindow);
  } finally {
    if (!((parentElement2 = iframe2.parentNode) == null)) {
      parentElement2.removeChild(iframe2);
    }
  }
}
const sig_s36_div = fn159(h_s36_div, -1),
  sig_s21_domRectList = fn129(h_s21_domRectList, (arg708) => {
    if (arg708 === -1 || arg708 === -2 || arg708 === -3) {
      return { s: arg708, v: null };
    }
    return { s: 0, v: arg708 };
  }),
  sig_s6_availLeft = fn129(h_s6_exitFullscreen, (arg709) => ({
    s: 0,
    v: arg709.map((arg710) => arg710 ?? -1),
  })),
  sig_s1_oscpu = fn159(h_s1_oscpu, -1),
  sig_s2_browserLanguage = fn85(h_s2_browserLanguage),
  sig_s3_colorDepth = fn159(h_s3_colorDepth, -1),
  sig_s4_deviceMemory = fn159(h_s4_deviceMemory, -1),
  sig_s5_height = fn129(h_s5_height, (arg711) => ({
    s: 0,
    v: arg711.map((arg712) => arg712 ?? -1),
  })),
  sig_s7_hardwareConcurrency = fn159(h_s7_hardwareConcurrency, -1),
  sig_s9_date = fn85(h_s9_dateTimeFormat),
  sig_s10_sessionStorage = fn85(h_s10_sessionStorage),
  sig_s11_localStorage = fn85(h_s11_localStorage),
  sig_s13_openDatabase = fn85(h_s13_openDatabase),
  sig_s14_cpuClass = fn159(h_s14_cpuClass, -1),
  sig_s15_webkitRequestFullscreen = fn159(h_s15_webkitRequestFullscreen, -1),
  sig_s16_plugins = fn159(h_s16_plugins, -1),
  sig_s17_canvas = fn129(
    () => h_s17_canvas(),
    (arg713) => {
      const { geometry: geometry, text: text5 } = arg713,
        v828 = geometry === "unsupported" ? -1 : geometry === "unstable" ? -2 : 0;
      return {
        s: v828,
        v: {
          ...arg713,
          geometry: v828 === 0 ? hash128(geometry) : "",
          text: v828 === 0 ? hash128(text5) : "",
        },
      };
    },
  ),
  sig_s19_touchEvent = fn85(h_s19_touchEvent),
  sig_s27_vendor = fn85(h_s27_vendor),
  sig_s28 = fn85(h_s28_fn),
  sig_s32_cookie = fn85(h_s32_cookie),
  sig_s37_colorGamut = fn159(h_s37_colorGamut, -1),
  sig_s41_invertedColors = fn159(h_s41_fn, -1),
  sig_s39_forcedColors = fn159(h_s39_fn, -1),
  sig_s42_minMonochrome = fn159(h_s42_tooHighValue, -1),
  sig_s38_prefersContrast = fn159(h_s38_fn, -1),
  sig_s43_prefersReducedMotion = fn159(h_s43_fn, -1),
  sig_s91_prefersReducedTransparency = fn159(h_s91_fn, -1),
  sig_s40_dynamicRange = fn159(h_s40_fn, -1),
  sig_s46 = fn129(h_s46_fn3, (arg714) => ({
    s: 0,
    v: hash128(
      Object.keys(arg714)
        .map((arg715) => `${arg715}=${arg714[arg715]}`)
        .join(","),
    ),
  })),
  sig_s80_pdfViewerEnabled = fn159(h_s80_pdfViewerEnabled, -1),
  sig_s81 = fn85(h_s81_fn),
  sig_s66_createElement = fn159(h_s66_createElement, -1),
  sig_s96_audioContext = fn129(h_s96_audioContext, (arg716) => {
    if (arg716 === -1 || arg716 === -2 || arg716 === -3) {
      return { s: arg716, v: null };
    }
    return { s: 0, v: arg716 };
  }),
  sig_s74_canvas = fn155(h_s74_webglDebugRendererInfo),
  sig_s75_canvas = fn129(h_s75_fn4, (arg717) => {
    if (typeof arg717 == "number") {
      return { s: arg717, v: null };
    }
    const v829 = ["32926", "32928"],
      v830 = arg717.parameters.map((arg718) => {
        const [v832, v833, v834] = arg718.split("=", 3);
        return v834 !== undefined || v829.includes(v833)
          ? `${v832}(${v833})=null`
          : `${v832}=${v833}`;
      }),
      v831 = arg717.extensionParameters.map((arg719) => {
        const [v835, v836, v837] = arg719.split("=", 3);
        return v837 !== undefined && v836 !== "34047"
          ? `${v835}(${v836})=${v837}`
          : `${v835}=${v836}`;
      });
    return {
      s: 0,
      v: {
        contextAttributes: hash128(arg717.contextAttributes.join("&")),
        parameters: hash128(v830.join("&")),
        parameters2: hash128(arg717.parameters.join("&")),
        shaderPrecisions: hash128(arg717.shaderPrecisions.join("&")),
        extensions: hash128(arg717.extensions?.join(",") || ""),
        extensionParameters: hash128(v831.join(",")),
        extensionParameters2: hash128(arg717.extensionParameters.join("&")),
        unsupportedExtensions: arg717.unsupportedExtensions,
      },
    };
  }),
  sig_s202_intl = fn155(h_s202_intl),
  sig_s101_userAgent = fn123(h_s101_userAgent),
  sig_s103_appVersion = fn123(h_s103_appVersion),
  sig_s104_rtt = fn123(h_s104_rtt),
  sig_s106_notification = fn123(h_s106_notification),
  sig_s117_plugins = fn123(h_s117_navigatorPluginsIsUndefined),
  sig_s119 = fn123(h_s119_fn),
  sig_s123 = fn123(h_s123_fn),
  sig_s131 = fn123(h_s131_fn),
  sig_s133_external = fn123(h_s133_external),
  sig_s136_mimeTypes = fn123(h_s136_mimeTypes),
  sig_s148 = fn123(h_s148_fn),
  sig_s149 = fn123(h_s149_fn),
  sig_s150_innerHeight = fn123(h_s150_innerHeight),
  sig_s157 = fn123(h_s157_fn3),
  sig_s59_msPointerEnabled = fn85(fn49),
  sig_s60_msLaunchUri = fn85(fn100),
  sig_s61_webkitPersistentStorage = fn85(fn11),
  sig_s62_applePayError = fn85(fn25),
  sig_s63_ongestureend = fn85(fn14),
  sig_s64_style = fn85(fn46),
  sig_s65_audio = fn85(fn23),
  sig_s68_audioBuffer = fn85(fn140),
  sig_s201_srChannelCount = fn85(h_s201_srChannelCount);
var vault_Ca = makeSelfKeyedVault(
  [
    3452176135, 2121212106, 1168961439, 3216050702, 302018735, 45330093, 3215350851, 1544181419,
    1386803176, 2661353486, 269372581, 48689061, 3148155917, 370894255, 1437581217, 2531810306,
    202261480, 1336192160, 3202765389, 269372581, 48689061, 2829847050, 320488888, 48664806,
    2745831692, 387662767, 2112398251,
  ],
  6,
);
function fn112() {
  return fn46();
}
var vault_Ga = makeSelfKeyedVault(
  [
    4092288861, 610672049, 1189767122, 268372292, 1158969800, 763646975, 1257244740, 1410559644,
    2124158391, 364726281, 155464083, 1841566975, 100619779, 1258631382, 1069746366, 1258227274,
    1075081939, 2040272311, 179522079, 138706648, 1855736560, 1253531151, 138705372, 2140949232,
    45894151, 1091449027, 1775829179, 1174305092, 1729263830, 1757481661, 884359442, 1091200197,
    2039696368, 178734857, 1628599252, 2027684542, 988827656,
  ],
  6,
);
const h_s212_fn = [
  "--hydra-450",
  "--super-color",
  "--super-bg-color",
  "--border-dynamic",
  "--size-md",
  "--banner-height",
];
function fn113(arg720) {
  return parseFloat(arg720);
}
const h_s20_monospaceList = ["monospace", "sans-serif", "serif"],
  h_s20_sansSerifThinList = [
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
function fn114() {
  return (
    "permissions" in navigator &&
    readVaultedProp(navigator, "permissions") &&
    typeof navigator.permissions.query === "function"
  );
}
function fn115(arg721, arg722) {
  return new Promise((arg723, arg724) => {
    let v838 = false;
    if (!(arg722 == null)) {
      arg722.then(
        () => (v838 = true),
        () => (v838 = true),
      );
    }
    (typeof arg721 == "function" ? fn115(Promise.resolve(), arg722).then(arg721) : arg721).then(
      (arg725) => {
        if (!v838) {
          arg723(arg725);
        }
      },
      (arg726) => {
        if (!v838) {
          arg724(arg726);
        }
      },
    );
  });
}
const h_s51_fn2 = {
  default: [],
  apple: [{ font: "-apple-system-body" }],
  serif: [{ fontFamily: "serif" }],
  sans: [{ fontFamily: "sans-serif" }],
  mono: [{ fontFamily: "monospace" }],
  min: [{ fontSize: "1px" }],
  system: [{ fontFamily: "system-ui" }],
};
function sig_s156() {
  const v839 = [],
    v840 = Object.getOwnPropertyNames(window);
  for (let v841 = 0; v841 < v840.length; v841++) {
    const v842 = v840[v841],
      v843 = fn48(v842);
    if ((h_s156_fn.has(v843) && v839.push(v842), v843 === 4191585516)) {
      const v844 = v840[v841 + 1] || "";
      v839.push(v844);
    }
  }
  return { s: 0, v: v839 };
}
async function sig_s217_getBattery() {
  if (!("getBattery" in navigator) || !(typeof navigator.getBattery === "function")) {
    return { s: -1, v: null };
  }
  try {
    const v845 = await navigator.getBattery();
    return {
      s: 0,
      v: {
        c: v845.charging,
        l: v845.level,
        ct: h_s217_fn(readVaultedProp(v845, "chargingTime")),
        dt: h_s217_fn(readVaultedProp(v845, "dischargingTime")),
      },
    };
  } catch (v846) {
    if (fn118(v846)) {
      return { s: -101, v: null };
    }
    if (v846 instanceof Error && v846.name === "NotAllowedError") {
      return { s: -2, v: null };
    }
    throw v846;
  }
}
function h_s21_fn(arg727) {
  const v847 = new Error(arg727);
  v847.name = arg727;
  return v847;
}
var vault_pa = makeSelfKeyedVault(
  [463754065, 1795937577, 2079814302, 3125799950, 1207895673, 3276369590],
  5,
);
function fn116(arg728) {
  return `${arg728}lr`;
}
function fn117(arg729) {
  if (arg729 && typeof arg729 == "object") {
    return arg729;
  }
  if (arg729 != null) {
    return { tag: arg729 };
  }
  return undefined;
}
async function sig_s207_fontFace() {
  try {
    const fontFace = new FontFace("font", "local('Arial')");
    await fontFace.load();
    return { s: 0, v: true };
  } catch (v848) {
    return { s: 0, v: false };
  }
}
function buildRequestPath(arg730, arg731) {
  let v849 = 0,
    v850 = 0,
    v851 = "";
  for (; v849 < arg730.length;) {
    v850 = fn60(arg731[v849 & 15], 4, 7);
    v851 += arg730.slice(v849, v849 + v850);
    v851 += "/";
    v849 += v850;
  }
  return v851.slice(0, -1);
}
function fn118(arg732) {
  return (
    (arg732 instanceof DOMException || arg732 instanceof TypeError) &&
    (v10.test(arg732.message) ||
      v12.test(arg732.message) ||
      v11.test(arg732.message) ||
      v13.test(arg732.message) ||
      v14.test(arg732.message))
  );
}
function fn119() {
  return typeof CompressionStream != "undefined";
}
function fn120(arg733) {
  return {
    byteArray: () => base64Decode(arg733),
    blob: () => new Blob([base64Decode(arg733)]),
    base64: () => arg733,
    toJSON: () => arg733,
    toString: () => arg733,
    [Symbol.toPrimitive](arg734) {
      if (arg734 === "number") {
        throw new TypeError("Cannot convert BinaryOutput to a number");
      }
      return arg733;
    },
  };
}
function fn121(arg735) {
  return isArray(arg735)
    ? (function (arg736) {
        if (arg736.length === 0) {
          throw fn18();
        }
        return arg736[Math.floor(fn64() * arg736.length)];
      })(arg735)
    : (function (arg737) {
        const v852 = fn64();
        let v853 = 0,
          v854 = 0;
        for (const [, v855] of arg737) {
          v853 += v855;
        }
        for (const [v856, v857] of arg737) {
          if (v852 >= v854 / v853 && v852 < (v854 + v857) / v853) {
            return v856;
          }
          v854 += v857;
        }
        throw fn18();
      })(Object.entries(arg735));
}
const h_s58_brandsList = [
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
function fn122(arg738) {
  const v858 = [...(arg738.modules || []), fn162()];
  if (!arg738.dlr) {
    v858.push(fn42());
  }
  return v858;
}
function h_s221_fn() {
  const v859 = new Map();
  for (let v860 = 0; v860 < h_s221_extBlendMinmaxList.length; v860++) {
    v859.set(h_s221_extBlendMinmaxList[v860], v860);
  }
  return v859;
}
function sig_s159_function() {
  return (function (arg739, arg740) {
    const v861 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(arg739), arg740);
    if (!v861 || !v861.get) {
      return { s: -1, v: null };
    }
    const v862 = window.Function,
      object = window.Object;
    let v863 = false;
    try {
      v863 = delete window.Function && delete window.Object;
    } catch (v864) {
      v863 = false;
    }
    if (!v863) {
      fn185();
      return { s: -2, v: null };
    }
    try {
      v861.get.toString();
      return { s: 0, v: false };
    } catch (v865) {
      return { s: 0, v: true };
    } finally {
      fn185();
    }
    function fn185() {
      try {
        window.Function = v862;
        window.Object = object;
      } catch (v866) {}
    }
  })(navigator, "hardwareConcurrency");
}
function visibilitychange(arg741, arg742, ...arg743) {
  const v867 = () => (document.hidden ? stop() : start()),
    { start: start, stop: stop } = (function (arg744, arg745, arg746, ...arg747) {
      let v868,
        v869 = false,
        v870 = arg744,
        v871 = 0;
      const v872 = () => {
          if (!(v869 || v868)) {
            v871 = Date.now();
            v868 = fn158(() => {
              v869 = true;
              arg746(...arg747);
            }, v870);
          }
        },
        v873 = () => {
          if (!v869 && v868) {
            v868();
            v868 = undefined;
            v870 -= Date.now() - v871;
          }
        };
      if (arg745) {
        v872();
      }
      return { start: v872, stop: v873 };
    })(arg742, !document.hidden, () => {
      document.removeEventListener("visibilitychange", v867);
      arg741(...arg743);
    });
  document.addEventListener("visibilitychange", v867);
  return () => {
    document.removeEventListener("visibilitychange", v867);
    stop();
  };
}
function fn123(arg748) {
  const v874 = (arg749) => ({ s: 0, v: arg749 }),
    v875 = (arg750) => {
      if (!(arg750 instanceof botdError)) {
        throw arg750;
      }
      const { state: state } = arg750;
      if (typeof state != "number") {
        throw new Error(
          `Unexpected non-numeric error state ${JSON.stringify(state)}. Error message: ${arg750.message}`,
        );
      }
      return { s: state, v: null };
    };
  return () => {
    try {
      const v876 = arg748();
      if (fn4(v876)) {
        return v876.then(v874, v875);
      }
      return { s: 0, v: v876 };
    } catch (v877) {
      return v875(v877);
    }
  };
}
var vault_HO = makeSelfKeyedVault(
  [
    1642514889, 448644821, 76850679, 1132704436, 345289455, 1137359792, 42513331, 260681633,
    1134422775, 1373430950, 1133569273, 331660783, 1138549936, 46459639, 1539613602, 76850679,
    914600628, 9613223, 1099147959, 264680892, 13021882, 261333237, 244298422, 1137370299,
    1133226678, 1137374959, 1133226658, 479983343, 180665849, 613852080, 362131373, 629254332,
    1132966580, 345289455, 1137359792, 75606011, 1019523771,
  ],
  4,
);
function asUint8Array(buffer4) {
  return buffer4 instanceof ArrayBuffer
    ? new Uint8Array(buffer4)
    : new Uint8Array(buffer4.buffer, buffer4.byteOffset, buffer4.byteLength);
}
function fn124() {
  return { len: 0, arr: new Uint8Array(128) };
}
function fn125(arg751, arg752) {
  return new Promise((arg753) => setTimeout(arg753, arg751, arg752));
}
function fn126(arg754, arg755) {
  const v878 = h_s55_fn5(arg754);
  if (arg755) {
    fn136(arg755, v878);
  }
}
function h_s70_canvas() {
  return document.createElement("canvas").getContext("webgpu");
}
var vault_SO = makeEnvKeyedVault(
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
  [fn15],
  [1],
);
function fn127(arg756, arg757 = "__fpsac__") {
  return {
    set: (arg758, arg759) => {
      window[arg756].setItem(fn137(arg758, arg757), JSON.stringify(arg759));
    },
    get: (arg760) => {
      const v879 = window[arg756].getItem(fn137(arg760, arg757));
      if (!v879) {
        return;
      }
      let v880;
      try {
        v880 = JSON.parse(v879);
      } catch (v881) {
        return;
      }
      if (
        !(function (arg761) {
          if (!fn32(arg761)) {
            return false;
          }
          const { body: body3, expiresAt: expiresAt } = arg761;
          return (
            fn32(body3) &&
            (body3.sealed_result === null || typeof body3.sealed_result == "string") &&
            typeof expiresAt == "number" &&
            Number.isFinite(expiresAt)
          );
        })(v880)
      ) {
        return;
      }
      const sealedresult = v880.body.sealed_result;
      return typeof sealedresult == "string"
        ? ((v880.body.sealed_result = fn120(sealedresult)), v880)
        : v880;
    },
    remove: (arg762) => {
      window[arg756].removeItem(fn137(arg762, arg757));
    },
  };
}
var vault_eO = makeSelfKeyedVault(
  [
    426709007, 538360605, 1061327092, 2504422367, 2506716645, 2996653695, 2147303221, 900895052,
    1816456767, 2067512534, 2269477586, 3731450601, 3218807419, 882327350, 1152571167,
  ],
  7,
);
async function h_s167_fn5(arg763, arg764) {
  const v882 = arg763.createSession();
  try {
    const v883 = new Promise((arg765, arg766) => {
        let v885,
          v886 = false;
        const v887 = () => {
            v886 = true;
            if (v885 !== undefined) {
              window.clearTimeout(v885);
            }
            v882.removeEventListener("message", v888);
          },
          v888 = (arg767) => {
            if (!v886)
              if (arg767.message.byteLength === 2) {
                v882.update(arg764).catch((arg768) => {
                  v887();
                  arg766(arg768);
                });
              } else {
                v887();
                const uint8Array18 = new Uint8Array(arg767.message);
                arg765(uint8Array18);
              }
          };
        v882.addEventListener("message", v888);
        v885 = window.setTimeout(() => {
          if (!v886) {
            v887();
          }
        }, 5e3);
      }),
      v884 = base64Decode(
        "AAAARHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAACQIARIBMRoNd2lkZXZpbmVfdGVzdCIKMjAxNV90ZWFycyoCU0Q=",
      );
    await v882.generateRequest("cenc", v884);
    return await v883;
  } finally {
    try {
      await v882.close();
    } catch (v889) {}
  }
}
function fn128(arg769, arg770) {
  return sealFrame(arg769, arg770 ? v25 : v24, 3, 9);
}
function h_s36_fn2(arg771, arg772) {
  for (const v890 of arg772.split(";")) {
    const v891 = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(v890);
    if (v891) {
      const [, v892, v893, , v894] = v891;
      arg771.setProperty(v892, v893, v894 || "");
    }
  }
}
function fn129(arg773, arg774) {
  const v895 = (arg775) =>
    fn40(arg775)
      ? arg774(arg775)
      : () => {
          const v896 = arg775();
          return fn88(v896) ? v896.then(arg774) : arg774(v896);
        };
  return (arg776) => {
    const v897 = arg773(arg776);
    return fn88(v897) ? v897.then(v895) : v895(v897);
  };
}
function h_s97_fn2() {
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
async function h_s26_fn() {
  const v898 = await h_s26_permissionsQuery2(),
    v899 = await h_s26_permissionsQuery();
  if (v898 === v899) {
    return v898;
  }
  if (v898 === "granted" || v899 === "granted") {
    return "granted";
  }
  if (v898 === "denied" || v899 === "denied") {
    return "denied";
  }
  return "prompt";
}
function h_s79_file(arg777 = "default.ini") {
  const v900 = function (arg778, arg779) {
    return arg778 + arg779;
  };
  const [v901] = arg777.split("/").slice(-1);
  try {
    const v902 = new window.File([], arg777),
      v903 = new window.URL(
        v900(
          "filesystem:///" + (readVaultedProp(v902, "webkitRelativePath") || "") + "" + v901 + "?#",
          readVaultedProp(v902, "lastModified"),
        ) + "",
      );
    if (v903.hash?.substring(1) === "") {
      return { n: v901, l: -2 };
    }
    return { n: v901, l: fn48(v903.hash?.substring(1)) };
  } catch (v904) {
    return { n: v901, l: -1 };
  }
}
function encodeJsonBytes(arg780) {
  const v905 = fn124(),
    v906 = new WeakSet(),
    v907 = (arg781) => {
      if (typeof arg781 == "string") {
        const v908 = arg781.replace(
          v19,
          (text6) => `\\${v17[text6] || `u${text6.charCodeAt(0).toString(16).padStart(4, "0")}`}`,
        );
        fn58(v905, 34);
        fn78(v905, stringToBytes(v908));
        return void fn58(v905, 34);
      }
      if (typeof arg781 == "number" || arg781 === true || arg781 === false) {
        if (Number.isNaN(arg781) || arg781 === Infinity || arg781 === -1 / 0) {
          arg781 = null;
        }
        return void fn78(v905, stringToBytes(String(arg781)));
      }
      if (typeof arg781 == "object" && arg781) {
        if (v906.has(arg781)) {
          throw new TypeError("Recursive input");
        }
        v906.add(arg781);
        const { toJSON: toJSON } = arg781;
        if (typeof toJSON == "function") {
          return void v907(toJSON.call(arg781));
        }
        if (arg781 instanceof Number || arg781 instanceof String) {
          return void v907(arg781.valueOf());
        }
        let v909 = true;
        const v910 = () => {
          if (v909) {
            v909 = false;
          } else {
            fn58(v905, 44);
          }
        };
        if (Array.isArray(arg781)) {
          fn58(v905, 91);
          for (const v911 of arg781) {
            v910();
            v907(v911);
          }
          fn58(v905, 93);
        } else {
          fn58(v905, 123);
          for (const [v912, v913] of Object.entries(arg781)) {
            if (!fn156(v913)) {
              v910();
              v907(v912);
              fn58(v905, 58);
              v907(v913);
            }
          }
          fn58(v905, 125);
        }
        return void v906.delete(arg781);
      }
      fn78(v905, uint8Array2);
    };
  v907(arg780);
  return fn76(v905);
}
function sig_s99_isSecureContext() {
  return { s: 0, v: Boolean(window.isSecureContext) };
}
function sig_s52_origin(arg782) {
  return fn161(arg782, h_s52_fn);
}
async function fn130() {
  if (fn46() || fn23()) {
    return false;
  }
  let v914 = false;
  if (fn12()) {
    const v915 = {
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
      v916 = await navigator.mediaCapabilities.decodingInfo(v915);
    v914 = fn106(v916, "keySystemAccess") && v916.keySystemAccess;
  }
  return (v914 && !("brave" in navigator)) || !fn11();
}
async function fn131() {
  const gpu = navigator.gpu;
  if (!gpu) {
    return { s: -3, v: null };
  }
  let v917 = null;
  try {
    v917 = await gpu.requestAdapter();
  } catch (v918) {
    if (v918 instanceof Error && fn46()) {
      return { s: -3, v: v918.message };
    }
    throw v918;
  }
  if (v917) {
    return { s: 0, v: v917 };
  }
  return { s: -4, v: null };
}
var vault_BO = makeSelfKeyedVault(
  [
    102480310, 1640088542, 149133546, 430221188, 595961743, 249819080, 330540676, 1306767749,
    347057352, 11773082, 78620302, 94676879, 1136324552, 246789771, 329428387, 262450831, 368828830,
    480556696, 226746822, 1306763653, 44339400, 363377055, 330532499, 1021555077,
  ],
  4,
);
function h_s157_fn4(arg783) {
  return Object.getOwnPropertyNames(arg783);
}
function fn132(arg784) {
  const v919 = arg784;
  return !!v919.collectCallId && typeof v919.collectCallId == "string";
}
function fn133(arg785, arg786, arg787, arg788 = Infinity, arg789) {
  return fn55(arg785, arg786, arg787, fn50, {
    maxAttemptCount: arg788,
    backoffBase: 200,
    backoffCap: 1e4,
    abort: arg789,
  });
}
var vault_EO = makeSelfKeyedVault(
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
const h_s154_fn2 = [
  ["wv", (arg790) => h_s154_fn3(false, arg790)],
  ["wvp", () => h_s154_fn3(true)],
  ["pr", () => h_s154_fn(["com.microsoft.playready", "com.youtube.playready"])],
  ["ck", () => h_s154_fn(["webkit-org.w3.clearkey", "org.w3.clearkey"])],
  ["pt", () => h_s154_fn(["com.adobe.primetime", "com.adobe.access"])],
  ["fp", () => h_s154_fn(["com.apple.fairplay"])],
];
function fn134(port, ...arg791) {
  port.postMessage(arg791);
}
function sig_s219_webkitRTCPeerConnection(arg792) {
  return arg792.ewr
    ? sig_s94_webkitRTCPeerConnection(arg792, 80)
    : Promise.resolve(() => ({ s: h_s219_fn, v: null }));
}
function h_s162_fn(arg793) {
  const v920 = Object.getOwnPropertyDescriptor(arg793, "length");
  if (v920 && v920.writable) {
    return true;
  }
  for (let v921 = 0; v921 < arg793.length; v921++) {
    const v922 = Object.getOwnPropertyDescriptor(arg793, v921);
    if (v922 && (v922.writable || v922.configurable)) {
      return true;
    }
  }
  return false;
}
function fn135(arg794) {
  const tag = arg794.tag ?? null,
    linkedId = arg794.linkedId ?? null;
  return {
    tag: tag,
    linkedId: linkedId,
    toKey: () => `${JSON.stringify(tag)}__${JSON.stringify(linkedId)}`,
  };
}
function sig_s144_sharedArrayBuffer() {
  if (typeof window.SharedArrayBuffer != "function") {
    return { s: -2, v: null };
  }
  const buffer5 = new window.SharedArrayBuffer(1);
  if (buffer5.byteLength === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: buffer5.byteLength };
}
async function sig_s222_keyboard() {
  const keyboard = navigator.keyboard;
  if (!keyboard || typeof keyboard.getLayoutMap !== "function") {
    return { s: -1, v: null };
  }
  let v923;
  try {
    v923 = await keyboard.getLayoutMap();
  } catch (v924) {
    if (fn118(v924)) {
      return { s: -101, v: null };
    }
    if (h_s222_fn(v924)) {
      return { s: -2, v: null };
    }
    throw v924;
  }
  return { s: 0, v: Array.from(v923.entries()) };
}
var vault__O = makeSelfKeyedVault(
  [
    2577284927, 3250767258, 3908827068, 3992976880, 3065769205, 4075469765, 4160224748, 3098918121,
    3976194795, 4160486872, 3098918126, 3942381038, 4109170175, 4223382200, 4292143598, 3049062388,
    4109955768, 4194036985, 3300715004, 3099767495, 4226349805, 3049059580, 4092509377, 3170037242,
    4026513589, 3455449083, 4142857719, 4055676603, 4076795903, 3166092266, 4043304184, 4093433590,
    3169776121, 3301164996,
  ],
  3,
);
function fn136(arg795, arg796) {
  fn28(arg796, arg795, 365);
  fn152(arg796, arg795);
}
function fn137(arg797, arg798) {
  return `${arg798}__${arg797}`;
}
const h_s156_fn = new Set([
  4106781067, 3209949814, 2612078219, 2382064880, 3225112721, 1018714844, 2899793226, 2094258580,
  3169460974, 3079760821, 392195965, 3461410589, 3582327722, 1731918890, 1767246934, 3419607467,
  1110225616, 1455947556, 450291099, 176445009, 1998723369, 2961538051, 3413933903, 2299562828,
  3945560591, 485550147, 3336694844, 3737152292, 2669437517, 3860417393, 4191585516,
]);
function h_s12_fn(arg799) {
  return { s: 0, v: arg799 };
}
function resolveNameByHash(arg800, arg801) {
  if (typeof arg801 === "string") {
    return arg801;
  }
  let v925 = arg800;
  for (; v925;) {
    const v926 = Object.getOwnPropertyNames(v925);
    for (let v927 = 0; v927 < v926.length; v927++) {
      const v928 = v926[v927];
      if (fn48(v928) === arg801) {
        return v928;
      }
    }
    v925 = Object.getPrototypeOf(v925);
  }
  return "";
}
function sig_s98() {
  return { s: 0, v: "serviceWorker" in Navigator.prototype };
}
function sig_s142_matchMedia() {
  if (typeof window.matchMedia != "function") {
    return { s: -2, v: null };
  }
  const mediaQuery = window.matchMedia(
    "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
  );
  if (mediaQuery.matches === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: mediaQuery.matches };
}
var vault_Of = makeSelfKeyedVault([2723538402, 345782709, 3194136822, 1590072184, 4124343528], 5);
function sig_s93_hidden(arg802) {
  let v929 = "";
  for (let v930 = 128512; v930 <= 128591; v930++) {
    const v931 = String.fromCodePoint(v930);
    v929 += v931;
  }
  return sharedIframeIsNotAvailable((arg803, arg804) => {
    const v932 = arg804.document.createElement("span");
    v932.style.whiteSpace = "nowrap";
    v932.innerText = v929;
    arg804.document.body.append(v932);
    const v933 = fn73(v932, arg804);
    arg804.document.body.removeChild(v932);
    return { s: 0, v: v933 };
  }, arg802.sis);
}
function fn138(arg805, arg806) {
  const v934 = fn20(arg805);
  let v935 = v934.origin + v934.path;
  if (v935 && !v935.endsWith("/")) {
    v935 += "/";
  }
  v935 += arg806;
  v934.origin = "";
  v934.path = v935;
  return fn30(v934);
}
function resource(arg807) {
  const v936 = {};
  new Set(arg807).forEach((arg808) => {
    const v937 = (function (arg809) {
        if (!URL.prototype) {
          return arg809;
        }
        try {
          return new URL(arg809, window.location.origin).toString();
        } catch (v939) {
          return arg809;
        }
      })(arg808),
      v938 = performance.getEntriesByName(v937, "resource");
    v936[arg808] = v938;
  });
  return v936;
}
async function h_s95_requestMediaKeySystemAccess2() {
  if (h_s95_atomics()) {
    return [-1, NaN];
  }
  const uint8Array19 = new Uint8Array([0]),
    v940 = [{ initDataTypes: ["webm"], audioCapabilities: [{ contentType: "audio/mp4" }] }],
    v941 = await navigator.requestMediaKeySystemAccess("org.w3.clearkey", v940),
    v942 = await v941.createMediaKeys();
  let v943 = await h_s95_fn(v942, uint8Array19);
  const v944 = v943 < 10;
  if (v944) {
    const v945 = h_s95_fn3(10, 2500) - v943 - 1;
    for (let v946 = 0; v946 < v945; v946++) {
      h_s95_fn2(v942, uint8Array19);
    }
    v943 = await h_s95_fn(v942, uint8Array19);
  }
  return [v944 ? 1 : 0, v943];
}
async function sig_s206_style(arg810) {
  return sharedIframeIsNotAvailable((arg811, arg812) => {
    if (!fn46()) {
      return { s: -1, v: null };
    }
    const v947 = arg812.document.createElement("input");
    v947.type = "radio";
    arg812.document.body.appendChild(v947);
    const v948 = arg812.getComputedStyle(v947).getPropertyValue("font-family");
    arg812.document.body.removeChild(v947);
    return { s: 0, v: v948 };
  }, arg810.sis);
}
function h_s52_fn(arg813) {
  const v949 = (arg814) => (arg814 ? arg814.replace(/([,\\])/g, "\\$1") : ""),
    v950 = arg813
      .map((arg815) =>
        [
          v949(arg815?.voiceURI),
          v949(arg815?.name),
          v949(arg815?.lang),
          arg815?.localService ? "1" : "0",
          arg815?.default ? "1" : "0",
        ].join(","),
      )
      .sort();
  return { s: arg813.length ? 0 : 1, v: hash128(JSON.stringify(v950)) };
}
function fn139(arg816) {
  return "" + { us: "use1", eu: "euc1", ap: "aps1" }[arg816] + "-turn.fpjs.io";
}
var vault_Sf = makeSelfKeyedVault(
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
function sig_s120() {
  try {
    throw "a";
  } catch (v951) {
    try {
      v951.toSource();
      return { s: 0, v: true };
    } catch (v952) {
      return { s: 0, v: false };
    }
  }
}
function fn140() {
  return (
    fn36([
      !("PushManager" in window),
      !("AudioBuffer" in window),
      !("RTCPeerConnection" in window),
      !("geolocation" in navigator),
      !("ServiceWorker" in window),
    ]) >= 3
  );
}
async function sig_s58() {
  const { userAgentData: userAgentData } = navigator;
  if (!userAgentData || typeof userAgentData != "object") {
    return { s: -1, v: null };
  }
  const v953 = {},
    v954 = [];
  if (typeof userAgentData.getHighEntropyValues == "function") {
    await Promise.all(
      h_s58_brandsList.map(async (arg817) => {
        try {
          const v955 = (await userAgentData.getHighEntropyValues([arg817]))[arg817];
          if (v955 !== undefined) {
            v953[arg817] = typeof v955 == "string" ? v955 : JSON.stringify(v955);
          }
        } catch (v956) {
          if (!(v956 instanceof Error && v956.name === "NotAllowedError")) {
            throw v956;
          }
          v954.push(arg817);
        }
      }),
    );
  }
  return {
    s: 0,
    v: {
      b: userAgentData.brands.map((arg818) => ({ b: arg818.brand, v: arg818.version })),
      m: userAgentData.mobile,
      p: userAgentData.platform ?? null,
      h: v953,
      nah: v954,
    },
  };
}
function fn141(arg819, arg820 = {}, arg821) {
  if (!(arg821 != null)) {
    arg821 = [fn71()];
  }
  return arg820[arg819] ?? (arg820[arg819] = navigator.requestMediaKeySystemAccess(arg819, arg821));
}
const h_s219_fn = -10;
async function fn142(arg822, arg823) {
  var v957;
  let v958, v959, v960;
  try {
    v958 = arg823().then(
      (arg824) => (v959 = [true, arg824]),
      (arg825) => (v959 = [false, arg825]),
    );
  } catch (v962) {
    v959 = [false, v962];
  }
  const v961 = arg822.then(
    (arg826) => (v960 = [true, arg826]),
    (arg827) => (v960 = [false, arg827]),
  );
  try {
    await Promise.race([v958, v961]);
  } finally {
    if (!((v957 = arg822.cancel) == null)) {
      v957.call(arg822);
    }
  }
  return () => {
    if (v959) {
      if (v959[0]) {
        return v959[1];
      }
      throw v959[1];
    }
    if (v960) {
      if (v960[0]) {
        return v960[1];
      }
      throw v960[1];
    }
    throw new Error("96375");
  };
}
var vault_xf = makeEnvKeyedVault(
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
      const style6 = new Image().style;
      return permuteChars(
        [
          resolveNameByHash((v963 = style6), "strokeColor"),
          resolveNameByHash(v963, "glyphOrientationVertical"),
        ],
        [
          5, 23, 47, 9, 35, 9, 44, 7, 37, 41, 19, 25, 32, 26, 30, 32, 8, 31, 12, 15, 40, 18, 15, 20,
          9, 4, 2, 13, 21, 17, 18, 34, 40, 2, 48,
        ],
      );
      var v963;
    },
  ],
  [2],
);
function h_s39_forcedColors(arg828) {
  return matchMedia(`(forced-colors: ${arg828})`).matches;
}
async function h_s23_webkitRequestFileSystem() {
  const v964 = readVaultedProp(window, "webkitRequestFileSystem");
  if (v964) {
    return new Promise((arg829) => {
      v964(
        0,
        1,
        () => arg829(true),
        () => arg829(false),
      );
    });
  }
}
function h_s157_fn5(arg830, ...arg831) {
  for (const v965 of arg831) {
    if (typeof v965 == "string") {
      if (h_s157_fn(arg830, v965)) {
        return true;
      }
    } else {
      if (h_s157_fn6(arg830, (arg832) => v965.test(arg832)) != null) {
        return true;
      }
    }
  }
  return false;
}
function sig_s55_localStorage(arg833) {
  const v966 = h_s55_fn5(arg833);
  let [v967, v968] = h_s55_fn7(v966);
  v967 = h_s55_fn6(v967);
  v968 = h_s55_fn6(v968);
  if (v967 !== undefined && v968 !== undefined) {
    return { s: 0, v: v967 || v968 };
  }
  if (v967 !== undefined) {
    return { s: 1, v: v967 };
  }
  if (v968 !== undefined) {
    return { s: 2, v: v968 };
  }
  return { s: -1, v: null };
}
var vault_Qf = makeEnvKeyedVault(
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
  [fn15],
  [2],
);
function h_s75_fn7() {
  return fn11() || fn25();
}
function fn143(arg834, arg835, arg836, arg837, arg838, arg839) {
  var v969;
  const v970 = [];
  for (const v971 of arg834) {
    const event2 = v971.event;
    if (event2.e !== arg836 && event2.e !== arg837 && event2.e !== arg838) {
      continue;
    }
    if (event2.stage !== arg839) {
      continue;
    }
    (v970[(v969 = event2.tryNumber)] || (v970[v969] = {}))[event2.e] = v971;
  }
  return v970
    .map((arg840) => {
      const timestamp = arg840[arg836]?.timestamp,
        timestamp2 = arg840[arg837]?.timestamp ?? arg840[arg838]?.timestamp,
        url2 = arg840[arg836]?.event.url,
        v972 = arg840[arg838]?.event.error;
      return timestamp && timestamp2 && url2
        ? fn171(url2, timestamp, timestamp2, v972, arg835[url2])
        : null;
    })
    .filter((arg841) => Boolean(arg841));
}
function h_s167_fn6(arg842) {
  let v973;
  try {
    if (arg842 && typeof arg842 == "object" && "message" in arg842) {
      v973 = String(arg842.message);
      if ("name" in arg842) {
        v973 = `${arg842.name}: ${v973}`;
      }
    } else {
      v973 = String(arg842);
    }
  } catch (v974) {
    v973 = `Code 3017: ${v974}`;
  }
  return h_s167_fn2(v973, 500);
}
function sig_s139_css() {
  if (typeof CSS == "undefined") {
    return { s: -1, v: null };
  }
  return { s: 0, v: CSS.supports("backdrop-filter", "blur(2px)") };
}
var vault_Jf = makeEnvKeyedVault(
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
      return (function (arg843, arg844) {
        const connection = arg843.connection;
        return permuteChars(
          [
            resolveNameByHash(arg844, "onorientationchange"),
            xorAgainstName(arg843, "contacts", "QjslADtOBipACA") ||
              xorAgainstName(connection, "ontypechange", "Tjo/DSpIETFCCQ"),
          ],
          [
            20, 1, 24, 23, 23, 21, 14, 8, 11, 8, 6, 13, 1, 1, 12, 4, 9, 10, 6, 2, 1, 2, 0, 1, 2, 1,
            1,
          ],
        );
      })(navigator, document.createElement("frameset"));
    },
    fn15,
  ],
  [1, 1],
);
function fn144(arg845) {
  return new Promise((arg846, arg847) => {
    arg845(arg846, arg847).then(
      () => arg847(new Error("Action didn't call `resolve` or `reject`")),
      arg847,
    );
  });
}
function h_s55_fn6(arg848) {
  return arg848 && arg848.length <= 1e3 ? arg848 : undefined;
}
const h_s70_fn8 = new RegExp(
  makeSelfKeyedVault(
    [
      865597172, 819291933, 1162251996, 3803533715, 1156907896, 528002739, 4205401008, 1133067128,
      1010149879, 2776700811, 1844920372,
    ],
    6,
  )(0),
);
function decryptEnvKeyedTable(arg849, arg850, arg851) {
  const v975 = stringToBytes(arg850());
  try {
    return decodeJsonBytes(
      (function (arg852, arg853, arg854) {
        const v976 = asUint8Array(arg852),
          arrayBuffer2 = new ArrayBuffer(v976.length - arg854),
          uint8Array20 = new Uint8Array(arrayBuffer2);
        for (let v977 = 0; v977 < v976.length; ++v977) {
          uint8Array20[v977] = v976[v977] ^ arg853[v977 % arg853.length];
        }
        return arrayBuffer2;
      })(new Uint32Array(arg849), v975, arg851),
    );
  } catch (v978) {
    if (fn52(v978) && v978.name === "SyntaxError") {
      return null;
    }
    throw v978;
  }
}
async function h_s94_fn8(arg855, arg856, arg857) {
  const v979 = h_s94_fn3(arg855, arg856, arg857),
    { s: v980, v: v981 } = h_s94_notSupportedError(v979, true);
  if (v980 !== 0) {
    return v980;
  }
  const v982 = h_s94_fn5(v981, arg856);
  try {
    const { s: v983, v: v984 } = await v982.createDataChannelAndOffer();
    return v983 !== 0 ? v983 : (await v981.setLocalDescription(v984), 0);
  } finally {
    v982.closeConnectionWhenTurnEnds();
  }
}
function fn145(arg858) {
  if (arg858[1] === null) {
    return arg858[2];
  }
  const v985 = new Error(arg858[2]);
  v985.name = arg858[1];
  v985.stack = arg858[3];
  return v985;
}
function fn146(arg859, arg860, arg861, arg862) {
  const {
    body: body4,
    getCallDebugger: getCallDebugger,
    stage: stage,
    pollingContainer: pollingContainer,
  } = arg859;
  return fn86(
    getCallDebugger,
    () => ({ e: 18, stage: stage, tryNumber: arg861, url: arg860 }),
    ({ status: arg863, getHeader: arg864, body: arg865 }) => {
      let v986 = arg865;
      try {
        v986 = decodeJsonBytes(arg865);
      } catch (v987) {}
      return {
        e: 19,
        stage: stage,
        tryNumber: arg861,
        status: arg863,
        retryAfter: arg864("retry-after"),
        body: v986,
      };
    },
    (arg866) => ({ e: 20, stage: stage, tryNumber: arg861, error: arg866 }),
    () =>
      (async function ({ body: arg867, ...arg868 }) {
        const [v988, v989] = fn95(arg867) ? await compressPayload(arg867) : [false, arg867];
        return {
          ...(await fn164({ ...arg868, body: fn128(v989, v988), responseFormat: "binary" })),
        };
      })({
        url: arg860,
        method: "post",
        headers: { "Content-Type": "text/plain" },
        body: body4,
        withCredentials: true,
        abort: arg862,
        container: pollingContainer,
      }),
  );
}
var vault_td = makeSelfKeyedVault(
  [
    1168920910, 812244275, 1267103231, 3189017411, 1473450498, 2320697017, 1141356568, 234838493,
    4049045849, 1469798731, 2588101617, 1560316161, 497556122, 3193426706, 445406726, 2719091889,
  ],
  5,
);
function sig_s76_canvas({ cache: arg869 }) {
  const v990 = fn154(arg869);
  if (v990) {
    (function (arg870) {
      arg870.clearColor(0, 0, 1, 1);
      const v991 = arg870.createProgram();
      if (!v991) {
        return;
      }
      function fn186(arg871, arg872) {
        const v994 = arg870.createShader(35633 - arg871);
        if (v991 && v994) {
          arg870.shaderSource(v994, arg872);
          arg870.compileShader(v994);
          arg870.attachShader(v991, v994);
        }
      }
      fn186(
        0,
        "attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}",
      );
      fn186(1, "void main(){gl_FragColor=vec4(1,0,0,1);}");
      arg870.linkProgram(v991);
      arg870.useProgram(v991);
      arg870.enableVertexAttribArray(0);
      const v992 = arg870.getUniformLocation(v991, "t"),
        v993 = arg870.createBuffer();
      arg870.bindBuffer(34962, v993);
      arg870.bufferData(34962, new Float32Array([0, 1, -1, -1, 1, -1]), 35044);
      arg870.vertexAttribPointer(0, 2, 5126, false, 0, 0);
      arg870.clear(16384);
      arg870.uniform1f(v992, 3.65);
      arg870.drawArrays(4, 0, 3);
    })(v990);
    return { s: 0, v: hash128(v990.canvas.toDataURL()) };
  }
  return { s: -1, v: null };
}
const h_s166_fn2 = new Set([2882888216, 2306836488, 1040191956, 1447924955]);
function sig_s102_userAgentData() {
  return { s: 0, v: !(!navigator.userAgentData || typeof navigator.userAgentData != "object") };
}
var vault_fd = makeSelfKeyedVault(
  [1684980417, 3234352095, 251477960, 279356862, 2733271037, 783485863, 971681449],
  6,
);
function fn147() {
  return (
    ("MediaKeys" in window || "WebKitMediaKeys" in window || "MSMediaKeys" in window) &&
    "requestMediaKeySystemAccess" in navigator
  );
}
var vault_Dd = makeSelfKeyedVault(
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
function h_s94_fn9(arg873, arg874) {
  return (
    "turn:" +
    h_s94_fn7(arg874 ? "" + arg873 + ":" + arg874 + "" : arg873, { transport: "tcp" }) +
    ""
  );
}
function fn148(arg875, arg876, arg877, arg878) {
  const v995 = Object.keys(arg875).filter(
      (arg879) =>
        !(function (arg880, arg881) {
          for (let v997 = 0, v998 = arg880.length; v997 < v998; ++v997) {
            if (arg880[v997] === arg881) {
              return true;
            }
          }
          return false;
        })(arg877, arg879),
    ),
    v996 = h_s21_fn2(
      fn19(
        v995,
        (arg882) =>
          (function (arg883, arg884) {
            const v999 = h_s21_fn2(
              new Promise((arg885) => {
                const v1000 = Date.now();
                fn101(arg883.bind(null, arg884), (...arg886) => {
                  const v1001 = Date.now() - v1000;
                  if (!arg886[0]) {
                    return arg885(() => ({ error: arg886[1], duration: v1001 }));
                  }
                  const v1002 = arg886[1];
                  if (fn40(v1002)) {
                    return arg885(() => ({ value: v1002, duration: v1001 }));
                  }
                  arg885(
                    () =>
                      new Promise((arg887) => {
                        const v1003 = Date.now();
                        fn101(v1002, (...arg888) => {
                          const v1004 = v1001 + Date.now() - v1003;
                          if (!arg888[0]) {
                            return arg887({ error: arg888[1], duration: v1004 });
                          }
                          arg887({ value: arg888[1], duration: v1004 });
                        });
                      }),
                  );
                });
              }),
            );
            return function () {
              return v999.then((arg889) => arg889());
            };
          })(arg875[arg882], arg876),
        arg878,
      ),
    );
  return async function () {
    const v1005 = await v996,
      v1006 = await fn19(v1005, (arg890) => h_s21_fn2(arg890()), arg878),
      v1007 = await Promise.all(v1006),
      v1008 = {};
    for (let v875 = 0; v875 < v995.length; ++v875) {
      v1008[v995[v875]] = v1007[v875];
    }
    return v1008;
  };
}
var vault_Xd = makeSelfKeyedVault(
  [
    1366508869, 2826119371, 128594945, 874483252, 3208582822, 82410833, 956804920, 2826133481,
    1537752338, 688126577, 3815856619, 497164883, 1732635513, 4083172082, 1140744769, 1901718369,
    4251079651, 1408919876, 1633610622, 3949217509, 480801113, 2085872418, 4083565560, 1258258243,
    1665267814, 4083630334, 1525375050, 2018763377, 2524142315,
  ],
  3,
);
function h_s85_fn(arg891) {
  return fn97(arg891, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
}
function h_s157_fn6(arg892, arg893) {
  if ("find" in arg892) {
    return arg892.find(arg893);
  }
  for (let v1010 = 0; v1010 < arg892.length; v1010++) {
    if (arg893(arg892[v1010], v1010, arg892)) {
      return arg892[v1010];
    }
  }
}
function h_s75_fn8(arg894, arg895, arg896) {
  const v1011 = arg894.getShaderPrecisionFormat(arg894[arg895], arg894[arg896]);
  return v1011 ? [v1011.rangeMin, v1011.rangeMax, v1011.precision] : [];
}
function stringToBytes(text7) {
  const uint8Array21 = new Uint8Array(text7.length);
  for (let v1012 = 0; v1012 < text7.length; v1012++) {
    const v1013 = text7.charCodeAt(v1012);
    if (v1013 > 127) {
      return new TextEncoder().encode(text7);
    }
    uint8Array21[v1012] = v1013;
  }
  return uint8Array21;
}
var vault_Sd = makeSelfKeyedVault(
  [
    513200334, 3422481445, 2115632544, 3317276110, 2839571868, 2563616402, 3536736631, 2006762473,
    3918368083, 1093394316, 3622425294, 2219933076, 2508384220, 2525711484, 1003586239, 2811397443,
    1231063539, 2196233353, 2370272911, 3750554070, 3420002101, 1003586274, 3146227270, 2017170132,
  ],
  7,
);
function fn149(arg897) {
  return typeof arg897 == "number" ? (arg897 === 0 ? null : Math.round(arg897)) : null;
}
var vault_zd = makeSelfKeyedVault(
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
const h_s210_maxTextureDimension1DList = [
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
function sig_s57_devicePixelRatio() {
  const devicePixelRatio = window.devicePixelRatio;
  if (devicePixelRatio == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: devicePixelRatio };
}
var vault_nd = makeSelfKeyedVault(
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
const h_s211_fn3 = { width: 1920, height: 1080, bitrate: 5000000, framerate: 30 },
  h_s211_fn4 = { width: 3840, height: 2160, bitrate: 20000000, framerate: 60 },
  h_s211_fn5 = { channels: 2, bitrate: 132700, samplerate: 5200 };
function sig_s72() {
  const { webdriver: webdriver2 } = navigator;
  if (webdriver2 === null) {
    return { s: -1, v: null };
  }
  if (webdriver2 === undefined) {
    return { s: -2, v: null };
  }
  return { s: 0, v: webdriver2 };
}
const h_s211_fn6 = h_s211_fn2();
function fn150(arg898) {
  return readVaultedProp(arg898, "drm") || (arg898.drm = {});
}
var vault_Gd = makeSelfKeyedVault(
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
async function h_s210_fn(arg899) {
  return readVaultedProp(arg899, "info") ?? (await arg899.requestAdapterInfo());
}
function fn151(arg900, arg901, response2) {
  if (response2.status >= 500) {
    return {
      error: new fingerprintError(
        ((v1014 = response2.status),
        (v1015 = response2.statusText),
        v1015 ? `Server error (${v1014}): ${v1015}` : `Server error: ${v1014}`),
        "server_error",
      ),
    };
  }
  var v1014, v1015;
  let v1016;
  try {
    v1016 = decodeJsonBytes(response2.body);
  } catch (v1017) {
    return badResponseFormat();
  }
  return (function (arg902) {
    return arg902 instanceof Object && arg902.version === "4" && "event_id" in arg902;
  })(v1016)
    ? fn10(v1016, arg900, arg901)
    : badResponseFormat();
}
function fn152(arg903, arg904) {
  var v1018;
  try {
    if (!((v1018 = localStorage?.setItem) == null)) {
      v1018.call(localStorage, arg903, arg904);
    }
  } catch (v1019) {}
}
function fn153(arg905) {
  const v1020 = h_s55_getItemCall(arg905);
  if (!v1020) {
    return [];
  }
  try {
    const v1021 = v1020 ? JSON.parse(v1020) : [];
    return Array.isArray(v1021) ? v1021 : [];
  } catch (v1022) {
    return [];
  }
}
async function h_s79_fn2(arg906) {
  const [v1023, v1024, v1025] = fn103(arg906);
  if (v1024 !== 0) {
    return { n: v1023, l: v1024 };
  }
  return await new Promise((arg907) => {
    v1025.file(
      (arg908) => {
        arg907({ n: v1023, l: arg908.lastModified });
      },
      () => {
        arg907({ n: v1023, l: -1 });
      },
    );
  });
}
var vault_Rd = makeSelfKeyedVault(
  [
    2204210323, 833803501, 3487079034, 526110907, 4174379001, 4094646160, 3720190432, 2713081951,
    1103608450, 2313349149, 525655217, 4136232702, 4049095326, 3548681446, 3115848261, 1284554703,
    2213328982, 424855463, 4137611519, 4095021982, 3718684646, 2713081923, 1407164803, 2963400735,
  ],
  7,
);
function h_s95_fn2(arg909, arg910) {
  const v1026 = arg909.createSession();
  fn21(v1026.generateRequest("webm", arg910));
}
var vault_Kd = makeSelfKeyedVault(
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
const h_s215_fn = {
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
function sig_s213_getCurrentPosition() {
  if (!h_s213_geolocation() || !fn114()) {
    return { s: -1, v: null };
  }
  const v1027 = { s: -4, v: null };
  h_s213_permissionsQuery()
    .then((arg911) => h_s213_getCurrentPosition(arg911))
    .then((arg912) => {
      fn98(v1027, arg912);
    })
    .catch(() => fn98(v1027, { s: -5, v: null }));
  return v1027;
}
var vault_$d = makeSelfKeyedVault(
  [2130256161, 2726532549, 3990922076, 4205578906, 3880967149, 243331574, 2762078897],
  5,
);
function h_s55_fn7(arg913) {
  return [h_s55_fn8(arg913), h_s55_getItemCall(arg913)];
}
function fn154(arg914) {
  if (arg914.webgl) {
    return arg914.webgl.context;
  }
  const canvas6 = document.createElement("canvas");
  let v1028;
  canvas6.addEventListener("webglCreateContextError", () => (v1028 = undefined));
  for (const v1029 of ["webgl", "experimental-webgl"]) {
    try {
      v1028 = canvas6.getContext(v1029);
    } catch (v1030) {}
    if (v1028) {
      break;
    }
  }
  arg914.webgl = { context: v1028 };
  return v1028;
}
var vault_PD = makeSelfKeyedVault(
  [
    3812597917, 1095880503, 645108934, 893365940, 1836297123, 774094820, 1663418283, 607972842,
    87074466, 574142883, 1836301475, 790931940, 775469989, 981331368, 741384676, 1668017571,
    607956645, 1014214324, 796112106, 1664393895, 675081724, 826195365, 608149678, 1669182180,
    675261090, 477342627,
  ],
  4,
);
function h_s21_fn2(arg915) {
  arg915.then(undefined, () => {});
  return arg915;
}
function fn155(arg916) {
  return fn129(arg916, (arg917) => {
    if (typeof arg917 == "number") {
      return { s: arg917, v: null };
    }
    return { s: 0, v: arg917 };
  });
}
function fn156(arg918) {
  return arg918 === undefined || typeof arg918 == "function" || typeof arg918 == "symbol";
}
function fn157(arg919, arg920, arg921) {
  const v1031 = Math.ceil(arg919 / arg920);
  let v1032,
    v1033 = arg920,
    v1034 = false;
  return fn31(
    new Promise((arg922) => {
      const v1035 = () => {
        if (((v1032 = undefined), !v1034)) {
          return v1033-- <= 0
            ? ((v1034 = true), void arg922(arg921))
            : void (v1032 = visibilitychange(v1035, v1031));
        }
      };
      v1035();
    }),
    () => {
      if (!v1034) {
        v1034 = true;
        if (!(v1032 == null)) {
          v1032();
        }
        v1032 = undefined;
      }
    },
  );
}
function fn158(arg923, arg924, ...arg925) {
  const v1036 = Date.now() + arg924;
  let v1037 = 0;
  const v1038 = () => {
    v1037 = setTimeout(() => {
      if (Date.now() < v1036) {
        v1038();
      } else {
        arg923(...arg925);
      }
    }, v1036 - Date.now());
  };
  v1038();
  return () => clearTimeout(v1037);
}
var vault_fD = makeSelfKeyedVault(
  [
    1366125159, 1283463894, 44187970, 549547565, 704083246, 1056071462, 1621256237, 954563936,
    955546368, 1861838887, 971389038, 636778796, 295859245,
  ],
  4,
);
const h_s217_fn2 = -1;
function fn159(arg926, arg927) {
  return fn129(arg926, (arg928) => ({
    s: arg928 == null ? arg927 : 0,
    v: arg928 != null ? arg928 : null,
  }));
}
var vault_yD = makeSelfKeyedVault(
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
const h_s221_extBlendMinmaxList = [
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
function fn160(arg929) {
  return (arg930) => {
    const v1039 = [],
      v1040 = new Map();
    const v1041 = window.setInterval(function () {
      const v1042 = v1039.shift();
      if (v1042) {
        const [v1043, v1044] = v1042,
          v1045 = fn21(arg929(v1044));
        v1040.set(v1043, v1045);
      }
    }, 1);
    function fn187() {
      window.clearInterval(v1041);
    }
    arg930.then(fn187, fn187);
    return [v1039, v1040, arg930];
  };
}
var vault_MD = makeSelfKeyedVault(
  [
    1196193395, 2453196235, 446059553, 3106362623, 1950674968, 1308514734, 4095256881, 413154131,
    2720006643, 827178824, 33447355, 3847733046, 1604533586, 2738569906, 542766924, 1706038511,
    3934093339, 1287467330, 4013575931, 558346260, 1223056291, 3474629435,
  ],
  5,
);
async function fn161({ cache: arg931 }, arg932) {
  const { speechSynthesis: speechSynthesis } = window;
  if (typeof speechSynthesis?.getVoices != "function") {
    return { s: -1, v: null };
  }
  if (!arg931.tts) {
    arg931.tts = (async function (arg933) {
      const v1046 = () => {
        return fn25()
          ? ((v1049 = () => arg933.getVoices()),
            () => {
              let v1050 = null,
                v1051 = null;
              try {
                v1051 = v1049();
              } catch (v1052) {
                v1050 = v1052;
              }
              return [v1050, v1051];
            })()
          : [null, arg933.getVoices()];
        var v1049;
      };
      if (
        (function (arg934) {
          return (
            !arg934.addEventListener ||
            (fn46() && fn140()) ||
            (fn25() && fn48(window.origin ?? "") === 548031109)
          );
        })(arg933)
      ) {
        const [v1053, v1054] = v1046();
        if (v1053) {
          throw v1053;
        }
        return { v: v1054 };
      }
      const v1047 = { v: null };
      let v1048;
      try {
        await new Promise((arg935, arg936) => {
          let v1055;
          const v1056 = () => {
            const [v1057, v1058] = v1046();
            if (Array.isArray(v1058) && v1058.length) {
              v1047.v = v1058;
              if (!(v1055 == null)) {
                v1055();
              }
              v1055 = fn158(arg935, 50);
            } else {
              if (!v1055) {
                v1055 = visibilitychange(arg935, 600);
              }
            }
            return [v1057, v1058];
          };
          v1048 = fn81(arg933, "voiceschanged", () => {
            try {
              const [v1059] = v1056();
              if (v1059) {
                arg936(v1059);
              }
            } catch (v1060) {
              arg936(v1060);
            }
          });
          v1056();
        });
      } finally {
        if (v1048) {
          visibilitychange(v1048, 1e4);
        }
      }
      return v1047;
    })(speechSynthesis);
  }
  const tts = await arg931.tts;
  return () => {
    if (tts.v) {
      return arg932(tts.v);
    }
    return { s: -2, v: null };
  };
}
function sealFrame(arg937, arg938, arg939, arg940, arg941 = fn24) {
  const v1061 = arg941() % (arg939 + 1),
    v1062 = asUint8Array(arg937),
    v1063 = 1 + arg938.length + 1 + v1061 + arg940 + v1062.length,
    arrayBuffer3 = new ArrayBuffer(v1063),
    uint8Array22 = new Uint8Array(arrayBuffer3);
  let v1064 = 0;
  const v1065 = arg941();
  uint8Array22[v1064++] = v1065;
  for (const v1066 of arg938) {
    uint8Array22[v1064++] = v1065 + v1066;
  }
  uint8Array22[v1064++] = v1065 + v1061;
  for (let v1067 = 0; v1067 < v1061; ++v1067) {
    uint8Array22[v1064++] = arg941();
  }
  const uint8Array23 = new Uint8Array(arg940);
  for (let v1068 = 0; v1068 < arg940; ++v1068) {
    uint8Array23[v1068] = arg941();
    uint8Array22[v1064++] = uint8Array23[v1068];
  }
  for (let v1069 = 0; v1069 < v1062.length; ++v1069) {
    uint8Array22[v1064++] = v1062[v1069] ^ uint8Array23[v1069 % arg940];
  }
  return arrayBuffer3;
}
var vault_eD = makeSelfKeyedVault(
  [
    2910197527, 756286602, 1734732175, 682137346, 3973007158, 2655331634, 1081435827, 591183561,
    1709741376, 3097039472, 2484282419, 1310863849, 908634318, 2012208934, 3956873329, 3273227632,
    56975832, 913373640, 1911328602, 3822654842, 4032068203,
  ],
  5,
);
function fn162() {
  return {
    key: "cm",
    sources: fn83(),
    browserCache: fn68,
    toRequest: async (arg942, arg943) => ({
      s69: await sig_s69_subtle({ urlHashing: arg943 }),
      s55: sig_s55_localStorage(arg942),
      s48: sig_s48(),
    }),
    onGetResponse(arg944, arg945) {
      fn126(arg945, arg944);
    },
  };
}
var vault_nD = makeSelfKeyedVault(
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
function h_s21_domRectList() {
  const offlineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!offlineAudioContext) {
    return -2;
  }
  if (
    fn25() &&
    !fn14() &&
    !(function () {
      return (
        fn9([
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
  const v1070 = new offlineAudioContext(1, 5e3, 44100),
    v1071 = v1070.createOscillator();
  v1071.type = "triangle";
  v1071.frequency.value = 1e4;
  const v1072 = v1070.createDynamicsCompressor();
  v1072.threshold.value = -50;
  v1072.knee.value = 40;
  v1072.ratio.value = 12;
  v1072.attack.value = 0;
  v1072.release.value = 0.25;
  v1071.connect(v1072);
  v1072.connect(v1070.destination);
  v1071.start(0);
  const [v1073, v1074] = (function (arg946) {
      let v1076 = () => {};
      return [
        new Promise((arg947, arg948) => {
          let v1077 = false,
            v1078 = 0,
            v1079 = 0;
          arg946.oncomplete = (arg949) => arg947(arg949.renderedBuffer);
          const v1080 = () => {
              setTimeout(
                () => arg948(h_s21_fn("timeout")),
                Math.min(500, v1079 + 5e3 - Date.now()),
              );
            },
            v1081 = () => {
              try {
                const v1082 = arg946.startRendering();
                switch ((fn88(v1082) && h_s21_fn2(v1082), arg946.state)) {
                  case "running":
                    ((v1079 = Date.now()), v1077 && v1080());
                    break;
                  case "suspended":
                    (document.hidden || v1078++,
                      v1077 && v1078 >= 3 ? arg948(h_s21_fn("suspended")) : setTimeout(v1081, 500));
                }
              } catch (v1083) {
                arg948(v1083);
              }
            };
          v1081();
          v1076 = () => {
            if (!v1077) {
              v1077 = true;
              if (v1079 > 0) {
                v1080();
              }
            }
          };
        }),
        v1076,
      ];
    })(v1070),
    v1075 = h_s21_fn2(
      v1073.then(
        (arg950) =>
          (function (arg951) {
            let v1084 = 0;
            for (let v1085 = 0; v1085 < arg951.length; ++v1085) {
              v1084 += Math.abs(arg951[v1085]);
            }
            return v1084;
          })(arg950.getChannelData(0).subarray(4500)),
        (arg952) => {
          if (arg952.name === "timeout" || arg952.name === "suspended") {
            return -3;
          }
          throw arg952;
        },
      ),
    );
  return () => {
    v1074();
    return v1075;
  };
}
async function fn163(arg953, arg954) {
  try {
    return await arg953();
  } catch (v1086) {
    console.error(v1086);
    return arg954;
  }
}
function fn164(arg955) {
  const v1087 = Math.random();
  (function (arg956, arg957, arg958) {
    const [v1088] = arg956;
    v1088.push([arg957, arg958]);
  })(arg955.container, v1087, arg955);
  return (function (arg959, arg960, arg961) {
    let v1089;
    function fn188() {
      window.clearInterval(v1089);
    }
    const [, v1090, v1091] = arg959,
      v1092 = new Promise((arg962, arg963) => {
        v1089 = window.setInterval(function () {
          const v1093 = v1090.get(arg960);
          if (v1093) {
            v1090.delete(arg960);
            return v1093.then(arg962, arg963);
          }
        }, 1);
      });
    v1092.then(fn188, fn188);
    if (!(arg961 == null)) {
      arg961.then(fn188, fn188);
    }
    v1091.then(fn188, fn188);
    return v1092;
  })(arg955.container, v1087, arg955.abort);
}
async function h_s97_fn3() {
  const v1094 = h_s97_fn2(),
    v1095 = await Promise.all(v1094.map(h_s97_fn)),
    v1096 = {};
  v1094.forEach((arg964, arg965) => {
    const v1097 = fn48(arg964).toString(16);
    v1096[v1097] = v1095[arg965];
  });
  return v1096;
}
function fn165(arg966, arg967) {
  return (arg966 - arg967 + 256) % 256;
}
function base64Encode(arg968) {
  const v1098 = asUint8Array(arg968),
    v1099 = Math.ceil(v1098.length / 65535),
    v1100 = [];
  for (let v1101 = 0; v1101 < v1099; v1101++) {
    const v1102 = v1101 * 65535,
      v1103 = v1098.slice(v1102, Math.min(v1102 + 65535, v1098.length));
    v1100.push(String.fromCharCode.apply(null, v1103));
  }
  return btoa(v1100.join(""));
}
async function h_s154_fn3(arg969 = false, arg970) {
  return (await comWidevineAlpha(arg970, arg969)).s === 0;
}
function h_s94_fn10() {
  return [8, 4, 4, 4, 12].map((arg971) => fn97(arg971, "0123456789abcdef")).join("-");
}
function fn166(arg972, arg973) {
  const v1104 = arg972[0] >>> 16,
    v1105 = 65535 & arg972[0],
    v1106 = arg972[1] >>> 16,
    v900 = 65535 & arg972[1],
    v1108 = arg973[0] >>> 16,
    v1109 = 65535 & arg973[0],
    v1110 = arg973[1] >>> 16,
    v1111 = 65535 & arg973[1];
  let v1112 = 0,
    v1113 = 0,
    v1114 = 0,
    v1115 = 0;
  v1115 += v900 * v1111;
  v1114 += v1115 >>> 16;
  v1115 &= 65535;
  v1114 += v1106 * v1111;
  v1113 += v1114 >>> 16;
  v1114 &= 65535;
  v1114 += v900 * v1110;
  v1113 += v1114 >>> 16;
  v1114 &= 65535;
  v1113 += v1105 * v1111;
  v1112 += v1113 >>> 16;
  v1113 &= 65535;
  v1113 += v1106 * v1110;
  v1112 += v1113 >>> 16;
  v1113 &= 65535;
  v1113 += v900 * v1109;
  v1112 += v1113 >>> 16;
  v1113 &= 65535;
  v1112 += v1104 * v1111 + v1105 * v1110 + v1106 * v1109 + v900 * v1108;
  v1112 &= 65535;
  arg972[0] = (v1112 << 16) | v1113;
  arg972[1] = (v1114 << 16) | v1115;
}
async function sharedIframeIsNotAvailable(arg974, arg975) {
  const { aq: aq2, ip: ip } = arg975;
  if (ip === null) {
    throw new Error("Shared iframe is not available");
  }
  try {
    await Promise.race([
      ip,
      ((v1116 = `Iframe initialization timed out, debugCounters: ${JSON.stringify(arg975.dc)}`),
      fn66(2e3).then(() => Promise.reject(new Error(v1116)))),
    ]);
  } catch (v1118) {
    if (fn118(v1118)) {
      return { s: -101, v: null };
    }
    throw v1118;
  }
  var v1116;
  const v1117 = await new Promise((arg976, arg977) => {
    const v1119 = { action: arg974, resolve: arg976, reject: arg977 };
    aq2.push(v1119);
    (async function (arg978) {
      const { aq: aq3, ipq: ipq, si: si2, siw: siw } = arg978;
      if (ipq || aq3.length === 0) {
        return;
      }
      arg978.ipq = true;
      for (; aq3.length > 0;) {
        const v1120 = aq3.shift();
        if (v1120) {
          try {
            const v1121 = await v1120.action(si2, siw);
            v1120.resolve(v1121);
          } catch (v1122) {
            v1120.reject(v1122);
          }
        }
      }
      arg978.ipq = false;
    })(arg975);
  });
  return v1117;
}
function h_s55_fn8(arg979) {
  return h_s55_cookie(() => {
    const v1123 = `${arg979}=`;
    for (const v1124 of document.cookie.split(";")) {
      let v1125 = 0;
      for (; v1124[v1125] === " " && v1125 < v1124.length;) {
        ++v1125;
      }
      if (v1124.indexOf(v1123) === v1125) {
        return v1124.slice(v1125 + v1123.length);
      }
    }
  }, undefined);
}
function h_s94_fn11(arg980, arg981) {
  var v1126;
  try {
    if (!((v1126 = readVaultedProp(arg980, "createDataChannel")) == null)) {
      v1126.call(arg980, arg981 || Math.random().toString());
    }
    return 0;
  } catch (v1127) {
    if (v1127 instanceof Error && v1127.name === "NotSupportedError") {
      return -7;
    }
    throw v1127;
  }
}
function base64Decode(arg982) {
  const text8 = atob(arg982),
    v1128 = text8.length,
    uint8Array24 = new Uint8Array(v1128);
  for (let v1129 = 0; v1129 < v1128; v1129++) {
    uint8Array24[v1129] = text8.charCodeAt(v1129);
  }
  return uint8Array24;
}
function fn167(arg983, arg984) {
  return new Promise((arg985) => fn158(arg985, arg983, arg984));
}
function fn168(arg986, arg987) {
  return new Promise((arg988) => setTimeout(arg988, arg986, arg987));
}
const v28 = (arg989) => fn29({ ...arg989, modules: fn122(arg989) }),
  v29 = function (arg990, arg991 = {}) {
    const { storageKeyPrefix: v1131 = "_vid_", do: v1130 } = arg991;
    try {
      const v1132 = (function (arg992) {
        const v1133 = base64Decode(arg992);
        let v1134 = v1133;
        try {
          v1134 = fn16(v1133, false);
        } catch (v1135) {}
        try {
          return decodeJsonBytes(v1134);
        } catch (v1136) {}
        return null;
      })(arg990);
      if (v1132 !== null) {
        if (v1132.visitorToken) {
          fn136(v1132.visitorToken, h_s55_fn5(v1131));
        }
        v1132.notifications.forEach(fn41);
        fn94(v1130, () => ({ e: 25, result: { response: v1132 } }));
      } else {
        fn94(v1130, () => ({ e: 25, result: { error: new Error("Failed to decode response") } }));
      }
    } catch (v1137) {
      throw (
        fn94(v1130, () => ({
          e: 25,
          result: { error: v1137 instanceof Error ? v1137 : new Error(String(v1137)) },
        })),
        new fingerprintError(v1.handle_agent_data, "handle_agent_data")
      );
    }
  };
function fn169(arg993) {
  return base64Encode(arg993).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function sig_s70_textDecoder() {
  return fn142(fn90(600, 6, 1e3, { s: -2, v: null }), async () => {
    const v1138 = await h_s70_fn();
    if (v1138.s !== 0) {
      return v1138;
    }
    try {
      const [v1139, v1140] = readVaultedProp(v1138, "v"),
        [v1141, v1142, v1143] = await h_s70_fn2(v1139, v1140);
      return { s: 0, v: { s: v1143, f: v1141, v: v1142.vendor, a: v1142.architecture } };
    } catch (v1144) {
      return h_s70_fn4(v1144);
    }
  });
}
function h_s95_fn3(arg994, arg995) {
  return Math.floor(fn64() * (arg995 - arg994 + 1)) + arg994;
}
function fn170(arg996, arg997) {
  return typeof arg996 == "number" && isNaN(arg996) ? arg997 : arg996;
}
function fn171(arg998, arg999, arg1000, arg1001, arg1002) {
  const v1145 = (function (arg1003, arg1004, arg1005) {
    if (!arg1003) {
      return;
    }
    let v1146;
    for (let v1147 = arg1003.length - 1; v1147 >= 0; v1147--) {
      const v1148 = arg1003[v1147];
      if (v1148.startTime < arg1004 - 1) {
        break;
      }
      if (v1148.responseEnd <= arg1005 + 1) {
        v1146 = v1148;
      }
    }
    return v1146;
  })(arg1002, arg999, arg1000);
  return {
    s: fn149(v1145?.startTime) || Math.round(arg999),
    e: fn149(v1145?.responseEnd) || Math.round(arg1000),
    u: arg998 || null,
    er: arg1001 ? String(arg1001) : null,
    ds: fn149(v1145?.domainLookupStart),
    de: fn149(v1145?.domainLookupEnd),
    cs: fn149(v1145?.connectStart),
    css: fn149(v1145?.secureConnectionStart),
    ce: fn149(v1145?.connectEnd),
    qs: fn149(v1145?.requestStart),
    ss: fn149(v1145?.responseStart),
  };
}
function h_s6_exitFullscreen() {
  (function () {
    if (h_s6_fn2 !== undefined) {
      return;
    }
    const v1149 = () => {
      const v1150 = h_s6_availLeft();
      if (h_s6_fn3(v1150)) {
        h_s6_fn2 = setTimeout(v1149, 2500);
      } else {
        h_s6_fn = v1150;
        h_s6_fn2 = undefined;
      }
    };
    v1149();
  })();
  return async () => {
    let v1151 = h_s6_availLeft();
    if (h_s6_fn3(v1151)) {
      if (h_s6_fn) {
        return [...h_s6_fn];
      }
      if (h_s6_fullscreenElement()) {
        await (function () {
          return (
            document.exitFullscreen ||
            document.msExitFullscreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen
          ).call(document);
        })();
        v1151 = h_s6_availLeft();
      }
    }
    if (!h_s6_fn3(v1151)) {
      h_s6_fn = v1151;
    }
    return v1151;
  };
}
const h_s29_fn = {};
const v30 = function () {
  return {
    key: "ex",
    ab: h_s29_fn,
    sources: { stage2: {}, stage3: {} },
    toRequest: () => ({ epv: "3b947bb" }),
  };
};
function fn172(arg1006) {
  const v1152 = { region: "us" };
  if (arg1006) {
    for (const v1153 in arg1006) {
      if (arg1006.hasOwnProperty(v1153) && arg1006[v1153] !== undefined) {
        v1152[v1153] = arg1006[v1153];
      }
    }
  }
  v1152.apiKey = "ahNo3Idb3RiQg69bQglE";
  v1152.imi = { m: "l", l: "jsl/4.0.0" };
  v1152.modules = [v30()];
  v1152.aggressiveOptimization = true;
  v1152.webRtcViaPort80 = true;
  v1152.worker = new Promise((arg1007, arg1008) => {
    const v1154 = URL.createObjectURL(
      new Blob(
        [
          'function $P(m,...W){m.postMessage(W);}function GD(m,W,l){l instanceof Error?$P(m,W,l.name,l.message,l.stack):$P(m,W,null,String(l));}const $D=function({port:m=self,workerModules:W=[]}={}){!function(m,W){let l;(r=self).window||(r.window=self),self.requestIdleCallback||(self.requestIdleCallback=(m,{timeout:W}={})=>setTimeout(m,null!=W?W:1e3)),self.document||(self.document={hidden:!1,addEventListener:(m,W,l)=>self.addEventListener(m,W,l),removeEventListener:(m,W,l)=>self.removeEventListener(m,W,l)});var r;let P=!1;m.addEventListener("message",async({data:r})=>{if(r instanceof Array)switch(r[0]){case 0:$P(m,1);break;case 3:try{if(l)throw new Error("Worker is already running.");const P=r[1],N=W(),t={};for(const m of N)m.sources&&Object.assign(t,m.sources.stage1,m.sources.stage2,m.sources.stage3);const o=Object.keys(t),a=Promise.all(o.map(async m=>{const W=await async function(m,W){const l=Date.now();try{const r=await m(W),P=Date.now()-l;if("function"!=typeof r)return ()=>({value:r,duration:P});const N=r;return async()=>{const m=Date.now();try{return {value:await N(),duration:P+(Date.now()-m)}}catch(hO){return {error:String(hO),duration:P+(Date.now()-m)}}}}catch(kO){const W=Date.now()-l;return ()=>({error:String(kO),duration:W})}}(t[m],P);return [m,W]}));l=async()=>{const m=await a,W={};return await Promise.all(m.map(async([m,l])=>{W[m]=await l();})),W},$P(m,4);}catch(CO){GD(m,5,CO);}break;case 6:try{if(!l)throw new Error("Worker signal collection was not started.");$P(m,7,await l()),P=!0;}catch(ZO){GD(m,8,ZO);}break;case 9:P&&$P(m,10);}}),$P(m,2);}(m,()=>[{sources:{stage1:{},stage2:{},stage3:{}}},...W.map(m=>m())]);};$D();',
        ],
        { type: "text/javascript" },
      ),
    );
    try {
      const worker2 = new Worker(v1154);
      worker2.addEventListener("error", () => {
        arg1008("Check console for errors.");
      });
      const v1155 = (arg875) => {
        if (arg875.data[0] !== 2) {
          return arg875.data[0] === 5 || arg875.data[0] === 8 || arg875.data[0] === 10
            ? (worker2.removeEventListener("message", v1155), void worker2.terminate())
            : undefined;
        }
        arg1007(worker2);
      };
      worker2.addEventListener("message", v1155);
    } catch (v1156) {
      arg1008(v1156);
    }
  });
  return v28(v1152);
}
export {
  v29 as handleAgentData,
  fn35 as isFingerprintError,
  fn172 as start,
  withoutDefault2 as withoutDefault,
};
