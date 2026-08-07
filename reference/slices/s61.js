// s61 — sig_s61_webkitPersistentStorage
// module cm, stage3, codes 0
//
// measures
//   navigator.webkitPersistentStorage navigator.webkitTemporaryStorage window.BatteryManager
//   window.webkitMediaStream window.webkitResolveLocalFileSystemURL window.webkitSpeechGrammar
//   navigator.vendor
// reported value
//   value
// probes
//   "Google"
// compares against
//   === 0 >= 5 in "BatteryManager" in "webkitMediaStream" in "webkitPersistentStorage"
//   in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar" in "webkitTemporaryStorage"
// decides on
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn11:419 fn129:6642 fn40:1892 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:6098
const sig_s61_webkitPersistentStorage = fn85(fn11);
