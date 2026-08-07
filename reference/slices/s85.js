// s85 — sig_s85_blob
// module cm, stage2, codes 0 -1 -2 -3 -4 -5
//
// measures
//   window.Blob window.indexedDB.deleteDatabase() window.indexedDB.open() window.indexedDB crypto
//   crypto.getRandomValues() navigator.vendor.indexOf("Apple") window.ApplePayError window.Counter
//   window.CSSPrimitiveValue window.RGBColor window.WebKitMediaKeys
// engine
//   Math.random() Promise.race() Uint32Array Promise Error undefined
// reported value
//   null string value
// probes
//   "-" "96375" "MozAppearance" "SecurityError"
// compares against
//   === "SecurityError" === 0 >= 4 in "ApplePayError" in "CSSMozDocumentRule" in "CSSPrimitiveValue"
//   in "CanvasCaptureMediaStream" in "Counter" in "MozAppearance" in "RGBColor" in "WebKitMediaKeys"
//   in "buildID" in "mozInnerScreenX" in "onmozfullscreenchange"
// decides on
//   fn25() || fn46()
//   fn142: !((v957 = arg822.cancel) == null)
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//   h_s85_securityError: !indexedDB2
//   h_s85_securityError: v504 instanceof Error
//   h_s85_securityError: !fn25()
//   h_s85_securityError: v505 instanceof Error && v505.name === "SecurityError"
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn142:7227 fn158:8266 fn25:712 fn46:3216 fn64:3826 fn66:3854 fn9:252 fn97:5431 uint32Array:2786
//   visibilitychange:6423

// agent.clean.js:3261
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

// agent.clean.js:4644
function sig_s85_blob() {
  return fn142(fn66(250, { s: -3, v: null }), async () => {
    if (fn25() || fn46()) {
      return h_s85_securityError();
    }
    return { s: -1, v: null };
  });
}

// agent.clean.js:7884
function h_s85_fn(arg891) {
  return fn97(arg891, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
}
