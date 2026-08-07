// s52 — sig_s52_origin
// module cm, stage2, codes 1 0 -1 -2, value is a digest
//
// measures
//   window.origin window.AudioBuffer window.PushManager window.ServiceWorker navigator.geolocation
//   window.RTCPeerConnection navigator.vendor.indexOf("Apple") window.ApplePayError window.Counter
//   window.CSSPrimitiveValue window.RGBColor window.WebKitMediaKeys
// engine
//   Array.isArray() ArrayBuffer JSON.stringify() Uint32Array Uint8Array Promise undefined
// reported value
//   call null value
// probes
//   "," "0" "1" "\\$1" "function" "voiceschanged"
// compares against
//   != "function" === 0 === 548031109 > 127 >= 3 >= 4 in "ApplePayError" in "AudioBuffer"
//   in "CSSMozDocumentRule" in "CSSPrimitiveValue" in "CanvasCaptureMediaStream" in "Counter"
//   in "MozAppearance" in "PushManager" in "RGBColor" in "RTCPeerConnection" in "ServiceWorker"
//   in "WebKitMediaKeys" in "buildID" in "geolocation" in "mozInnerScreenX"
//   in "onmozfullscreenchange"
// decides on
//   fn161: typeof speechSynthesis?.getVoices != "function"
//   fn161: !arg931.tts
//   fn161: fn25()
//   fn161: function (arg934) { return !arg934.addEventListener || fn46() && fn140() || fn25() && fn48(window.origin ?? "") === 548031109; }(arg933)
//   fn161: !arg934.addEventListener || fn46() && fn140() || fn25() && fn48(window.origin ?? "") === 548031109
//   fn161: Array.isArray(v1058) && v1058.length
//   fn161: !(v1055 == null)
//   fn161: !v1055
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//   fn140: fn36([!("PushManager" in window), !("AudioBuffer" in window), !("RTCPeerConnection" in window), !("geolocation" in navigator), !("ServiceWorker" in window)]) >=…
//   fn158: Date.now() < v1036
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   hash128: v422 > 127
//   hash128: ("00000000" + (v415[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (v415[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (v416[0] >>> 0).toString(16)).slic…
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn140:7174 fn158:8266 fn161:8448 fn166:8783 fn25:712
//   fn36:1793 fn46:3216 fn48:3370 fn53:3506 fn65:3849 fn81:4410 fn9:252 fn91:4777 fn93:5043
//   fn96:5398 hash128:2674 stringToBytes:7901 v3:446 v4:447 v5:461 v6:462 v7:463 v8:464 v9:465
//   visibilitychange:6423

// agent.clean.js:6821
function sig_s52_origin(arg782) {
  return fn161(arg782, h_s52_fn);
}

// agent.clean.js:7125
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
