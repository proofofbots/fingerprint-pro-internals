// s166 — sig_s166
// module cm, stage3, codes 0
//
// measures
//   Navigator.prototype TextEncoder
// engine
//   Set ArrayBuffer Object.getOwnPropertyNames() Uint32Array Uint8Array
// reported value
//   call
// decides on
//   h_s166_fn: arg53.has(v94)
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn48:3370 stringToBytes:7901

// agent.clean.js:383
function h_s166_fn(arg52, arg53) {
  const v90 = [],
    v91 = Object.getOwnPropertyNames(arg52);
  for (let v92 = 0; v92 < v91.length; v92++) {
    const v93 = v91[v92],
      v94 = fn48(v93);
    if (arg53.has(v94)) {
      v90.push({ i: v92, n: v93 });
    }
  }
  return { l: v91.length, p: v90 };
}

// agent.clean.js:5417
function sig_s166() {
  return { s: 0, v: h_s166_fn(Navigator.prototype, h_s166_fn2) };
}

// agent.clean.js:7750
const h_s166_fn2 = new Set([2882888216, 2306836488, 1040191956, 1447924955]);
