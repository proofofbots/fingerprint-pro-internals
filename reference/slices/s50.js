// s50 — sig_s50_performance
// module cm, stage3, codes 0 -1
//
// measures
//   window.performance TextEncoder
// engine
//   ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Uint32Array Uint8Array
//   undefined
// reported value
//   null value
// probes
//   "function" "memory"
// compares against
//   == "function" === "string"
// decides on
//   (v659 = (v658 = window.performance) == null ? undefined : readVaultedProp(v658, "memory")) == null
//   (v658 = window.performance) == null
//   jsHeapSizeLimit == null
//   readVaultedProp: typeof v316 == "function"
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn48:3370 readVaultedProp:1674 resolveNameByHash:7015
//   stringToBytes:7901

// agent.clean.js:4697
function sig_s50_performance() {
  var v658, v659;
  const jsHeapSizeLimit =
    (v659 = (v658 = window.performance) == null ? undefined : readVaultedProp(v658, "memory")) ==
    null
      ? undefined
      : v659.jsHeapSizeLimit;
  if (jsHeapSizeLimit == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: jsHeapSizeLimit };
}
