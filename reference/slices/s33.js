// s33 — sig_s33_brave
// module cm, stage3, codes 0
//
// measures
//   Navigator.prototype.brave Navigator.prototype.connection window.braveEthereum window.braveSolana
//   document.featurePolicy Navigator.prototype navigator.webkitPersistentStorage
//   navigator.webkitTemporaryStorage window.BatteryManager window.webkitMediaStream
//   window.webkitResolveLocalFileSystemURL window.webkitSpeechGrammar
// engine
//   undefined
// reported value
//   value
// probes
//   "Google" "cardano" "ethereum" "solana"
// compares against
//   === 0 >= 2 >= 5 in "BatteryManager" in "brave" in "braveEthereum" in "braveSolana"
//   in "connection" in "webkitMediaStream" in "webkitPersistentStorage"
//   in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar" in "webkitTemporaryStorage"
// decides on
//   !fn11()
//   (v320 = document.featurePolicy) == null
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn11:419 fn36:1793 fn9:252

// agent.clean.js:1708
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

// agent.clean.js:5020
function h_s33_fn(arg627) {
  return { s: 0, v: arg627 };
}
