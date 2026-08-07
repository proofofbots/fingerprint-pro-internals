// s23 — sig_s23_clipboardItem
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   window.ClipboardItem window.PerformanceEventTiming window.RTCSctpTransport
//   navigator.webkitPersistentStorage navigator.webkitTemporaryStorage window.BatteryManager
//   window.webkitMediaStream window.webkitResolveLocalFileSystemURL window.webkitSpeechGrammar
//   navigator.vendor window TextEncoder
// engine
//   ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Promise.race() Uint32Array
//   Uint8Array Promise undefined
// reported value
//   null value
// probes
//   "Google" "webkitRequestFileSystem"
// compares against
//   == "function" === 0 >= 2 >= 5 in "BatteryManager" in "ClipboardItem" in "PerformanceEventTiming"
//   in "RTCSctpTransport" in "webkitMediaStream" in "webkitPersistentStorage"
//   in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar" in "webkitTemporaryStorage"
// decides on
//   fn11() && h_s23_clipboardItem()
//   v689 === null
//   v689 === undefined
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//   h_s23_clipboardItem: fn36(["ClipboardItem" in window, "PerformanceEventTiming" in window, "RTCSctpTransport" in window]) >= 2
//   fn158: Date.now() < v1036
//   readVaultedProp: typeof v316 == "function"
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn11:419 fn158:8266 fn167:8899 fn36:1793 fn48:3370 fn9:252
//   readVaultedProp:1674 resolveNameByHash:7015 stringToBytes:7901

// agent.clean.js:4729
function h_s23_clipboardItem() {
  return (
    fn36([
      "ClipboardItem" in window,
      "PerformanceEventTiming" in window,
      "RTCSctpTransport" in window,
    ]) >= 2
  );
}

// agent.clean.js:4887
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

// agent.clean.js:7298
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
