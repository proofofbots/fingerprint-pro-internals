// s160 — sig_s160_origin
// module cm, stage2, codes 1 0 -1 -2
//
// measures
//   window.origin window.AudioBuffer window.PushManager window.ServiceWorker navigator.geolocation
//   window.RTCPeerConnection navigator.vendor.indexOf("Apple") window.ApplePayError window.Counter
//   window.CSSPrimitiveValue window.RGBColor window.WebKitMediaKeys
// engine
//   Map Array.isArray() ArrayBuffer Uint32Array Uint8Array Promise undefined
// reported value
//   null value
// probes
//   "function" "voiceschanged"
// compares against
//   != "function" === 0 === 1655763047 === 548031109 > 0 >= 3 >= 4 in "ApplePayError"
//   in "AudioBuffer" in "CSSMozDocumentRule" in "CSSPrimitiveValue" in "CanvasCaptureMediaStream"
//   in "Counter" in "MozAppearance" in "PushManager" in "RGBColor" in "RTCPeerConnection"
//   in "ServiceWorker" in "WebKitMediaKeys" in "buildID" in "geolocation" in "mozInnerScreenX"
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
//   h_s160_fn: fn48(arg629?.name?.slice(0, 6)) === 1655763047
//   h_s160_fn: v710.length > 0
//   h_s160_fn: v713 !== undefined
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//   fn140: fn36([!("PushManager" in window), !("AudioBuffer" in window), !("RTCPeerConnection" in window), !("geolocation" in navigator), !("ServiceWorker" in window)]) >=…
//   fn158: Date.now() < v1036
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn140:7174 fn158:8266 fn161:8448 fn25:712 fn36:1793
//   fn46:3216 fn48:3370 fn81:4410 fn9:252 stringToBytes:7901 visibilitychange:6423

// agent.clean.js:835
function sig_s160_origin(arg99) {
  return fn161(arg99, h_s160_fn);
}

// agent.clean.js:5023
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
