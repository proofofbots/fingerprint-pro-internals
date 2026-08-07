// s95 — sig_s95_atomics
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   window.Atomics window.CSSRule window.Error
//   navigator.requestMediaKeySystemAccess("org.w3.clearkey") window.Document.prototype
//   window.Iterator window.SVGDocument navigator.requestMediaKeySystemAccess crypto
//   crypto.getRandomValues() document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange")
// engine
//   NaN Math.floor() Number() Math.random() Promise.race() Uint32Array Uint8Array Promise
// reported value
//   null value
// probes
//   "96375" "UNKNOWN_RULE" "audio/mp4" "fragmentDirective" "function" "isError" "network_connection"
//   "pause" "webm"
// compares against
//   < 10 === "function" === -1 >= 4 in "Iterator" in "SVGDocument" in "UNKNOWN_RULE"
//   in "fragmentDirective" in "isError" in "pause"
// decides on
//   h_s95_requestMediaKeySystemAccess()
//   v106[0] === -1
//   h_s95_requestMediaKeySystemAccess: typeof navigator.requestMediaKeySystemAccess === "function"
//   fn142: !((v957 = arg822.cancel) == null)
//   h_s95_requestMediaKeySystemAccess2: h_s95_atomics()
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   h_s95_atomics: fn36(["Iterator" in window, window.Error && "isError" in window.Error, window.Atomics && "pause" in window.Atomics, "network_connection".Document?.prototype && …
//   h_s95_fn3: Math.floor(fn64() * (arg995 - arg994 + 1)) + arg994
//
// 6 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn142:7227 fn158:8266 fn21:656 fn36:1793 fn64:3826 fn66:3854 uint32Array:2786
//   visibilitychange:6423

// agent.clean.js:551
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

// agent.clean.js:1613
async function h_s95_fn(arg244, arg245) {
  const v302 = arg244.createSession();
  await v302.generateRequest("webm", arg245);
  return Number(v302.sessionId);
}

// agent.clean.js:1671
function h_s95_requestMediaKeySystemAccess() {
  return typeof navigator.requestMediaKeySystemAccess === "function";
}

// agent.clean.js:3970
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

// agent.clean.js:7093
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

// agent.clean.js:8128
function h_s95_fn2(arg909, arg910) {
  const v1026 = arg909.createSession();
  fn21(v1026.generateRequest("webm", arg910));
}

// agent.clean.js:8957
function h_s95_fn3(arg994, arg995) {
  return Math.floor(fn64() * (arg995 - arg994 + 1)) + arg994;
}
