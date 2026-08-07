// s216 — sig_s216_managed
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   navigator.managed navigator.managed.getManagedConfiguration
//   navigator.managed.getManagedConfiguration() window.crypto.getRandomValues() Audio
//   window.onorientationchange window.SharedWorker navigator.connection navigator.appVersion
//   window.orientation navigator.webkitPersistentStorage navigator.webkitTemporaryStorage
// engine
//   ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Promise.race() Uint32Array
//   Uint8Array Promise Error
// reported value
//   call null string
// probes
//   "-" "0" "96375" "function" "message"
// compares against
//   !== "function" !== -1 == "function" === 0 === 10 === 4 === 6 === 8 >= 2 >= 5 in "BatteryManager"
//   in "SharedWorker" in "onorientationchange" in "ontypechange" in "orientation" in "sinkId"
//   in "webkitMediaStream" in "webkitPersistentStorage" in "webkitResolveLocalFileSystemURL"
//   in "webkitSpeechGrammar" in "webkitTemporaryStorage"
// decides on
//   fn142: !((v957 = arg822.cancel) == null)
//   h_s216_managed: !managed || typeof managed.getManagedConfiguration !== "function"
//   h_s216_managed: fn11() && fn23()
//   h_s216_managed: v88 instanceof Error
//   h_s216_managed: v89 !== -1
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//   readVaultedProp: typeof v316 == "function"
//   h_s216_getRandomValues: arg371 === 4 || arg371 === 6 || arg371 === 8 || arg371 === 10
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn11:419 fn142:7227 fn158:8266 fn23:692 fn46:3216 fn48:3370
//   fn66:3854 fn9:252 readVaultedProp:1674 resolveNameByHash:7015 stringToBytes:7901
//   visibilitychange:6423

// agent.clean.js:360
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

// agent.clean.js:466
function sig_s216_managed() {
  return fn142(fn66(250, { s: -2, v: null }), h_s216_managed);
}

// agent.clean.js:3201
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
