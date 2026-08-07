// s163 — sig_s163_applePayError
// module cm, stage2, codes 0 -1 -101
//
// measures
//   navigator.vendor.indexOf("Apple") window.ApplePayError window.Counter window.CSSPrimitiveValue
//   window.RGBColor navigator.webkitPersistentStorage navigator.webkitTemporaryStorage
//   window.BatteryManager window.webkitMediaStream window.webkitResolveLocalFileSystemURL
//   window.webkitSpeechGrammar navigator.vendor
// engine
//   Object.defineProperty() Promise.reject() TypeError ArrayBuffer Object.getOwnPropertyNames()
//   Object.getPrototypeOf() JSON.stringify() Promise.race()
// reported value
//   null value
// probes
//   " " "Google" "div" "stack"
// compares against
//   == "function" === 0 > 0 >= 4 >= 5 in "ApplePayError" in "BatteryManager" in "CSSPrimitiveValue"
//   in "Counter" in "RGBColor" in "WebKitMediaKeys" in "webkitMediaStream"
//   in "webkitPersistentStorage" in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar"
//   in "webkitTemporaryStorage"
// decides on
//   fn11() || fn25()
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   h_s163_fn: fn11()
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   readVaultedProp: typeof v316 == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn11:419 fn118:6312 fn158:8266 fn21:656 fn25:712 fn48:3370
//   fn66:3854 fn9:252 readVaultedProp:1674 resolveNameByHash:7015 sharedIframeIsNotAvailable:8819
//   stringToBytes:7901 v10:3418 v11:3419 v12:3420 v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:1765
async function sig_s163_applePayError(arg266) {
  if (fn11() || fn25()) {
    return await h_s163_fn(arg266);
  }
  return { s: -1, v: null };
}

// agent.clean.js:5856
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
