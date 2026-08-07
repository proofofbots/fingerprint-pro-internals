// s217 — sig_s217_getBattery
// module cm, stage2, codes 0 -1 -2 -101
//
// measures
//   navigator.getBattery navigator.getBattery() DOMException TextEncoder
// engine
//   Number.isFinite() TypeError ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf()
//   Uint32Array Uint8Array Error
// reported value
//   null {c,l,ct,dt}
// probes
//   "NotAllowedError" "chargingTime" "dischargingTime" "function"
// compares against
//   == "function" === "NotAllowedError" === "function" === "string" in "getBattery"
// decides on
//   !("getBattery" in navigator) || !(typeof navigator.getBattery === "function")
//   fn118(v846)
//   v846 instanceof Error && v846.name === "NotAllowedError"
//   h_s217_fn: Number.isFinite(arg683)
//   readVaultedProp: typeof v316 == "function"
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn118:6312 fn48:3370 readVaultedProp:1674
//   resolveNameByHash:7015 stringToBytes:7901 v10:3418 v11:3419 v12:3420 v13:3421 v14:3422

// agent.clean.js:5825
function h_s217_fn(arg683) {
  return Number.isFinite(arg683) ? arg683 : h_s217_fn2;
}

// agent.clean.js:6245
async function sig_s217_getBattery() {
  if (!("getBattery" in navigator) || !(typeof navigator.getBattery === "function")) {
    return { s: -1, v: null };
  }
  try {
    const v845 = await navigator.getBattery();
    return {
      s: 0,
      v: {
        c: v845.charging,
        l: v845.level,
        ct: h_s217_fn(readVaultedProp(v845, "chargingTime")),
        dt: h_s217_fn(readVaultedProp(v845, "dischargingTime")),
      },
    };
  } catch (v846) {
    if (fn118(v846)) {
      return { s: -101, v: null };
    }
    if (v846 instanceof Error && v846.name === "NotAllowedError") {
      return { s: -2, v: null };
    }
    throw v846;
  }
}

// agent.clean.js:8288
const h_s217_fn2 = -1;
