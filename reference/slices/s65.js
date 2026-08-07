// s65 — sig_s65_audio
// module cm, stage3, codes 0
//
// measures
//   Audio window.onorientationchange window.SharedWorker navigator.connection navigator.appVersion
//   window.orientation navigator.webkitPersistentStorage navigator.webkitTemporaryStorage
//   window.BatteryManager window.webkitMediaStream window.webkitResolveLocalFileSystemURL
//   window.webkitSpeechGrammar
// reported value
//   value
// probes
//   "ontypechange" "sinkId"
// compares against
//   === 0 >= 2 >= 4 >= 5 in "BatteryManager" in "CSSMozDocumentRule" in "CanvasCaptureMediaStream"
//   in "MozAppearance" in "SharedWorker" in "buildID" in "mozInnerScreenX"
//   in "onmozfullscreenchange" in "onorientationchange" in "ontypechange" in "orientation"
//   in "sinkId" in "webkitMediaStream" in "webkitPersistentStorage"
//   in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar" in "webkitTemporaryStorage"
// decides on
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn11:419 fn129:6642 fn23:692 fn40:1892 fn46:3216 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:6102
const sig_s65_audio = fn85(fn23);
