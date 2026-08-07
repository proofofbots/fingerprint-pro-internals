// s156 — sig_s156
// module cm, stage3, codes 0
//
// measures
//   window TextEncoder
// engine
//   Set ArrayBuffer Object.getOwnPropertyNames() Uint32Array Uint8Array
// reported value
//   value
// compares against
//   < 256 < 8 === 4191585516 > 127
// decides on
//   h_s156_fn.has(v843) && v839.push(v842), v843 === 4191585516
//   crc32OfBytes: 1 & v696
//   crc32OfBytes: (-1 ^ v695) >>> 0
//   stringToBytes: v1013 > 127
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn48:3370 stringToBytes:7901

// agent.clean.js:6232
function sig_s156() {
  const v839 = [],
    v840 = Object.getOwnPropertyNames(window);
  for (let v841 = 0; v841 < v840.length; v841++) {
    const v842 = v840[v841],
      v843 = fn48(v842);
    if ((h_s156_fn.has(v843) && v839.push(v842), v843 === 4191585516)) {
      const v844 = v840[v841 + 1] || "";
      v839.push(v844);
    }
  }
  return { s: 0, v: v839 };
}

// agent.clean.js:7006
const h_s156_fn = new Set([
  4106781067, 3209949814, 2612078219, 2382064880, 3225112721, 1018714844, 2899793226, 2094258580,
  3169460974, 3079760821, 392195965, 3461410589, 3582327722, 1731918890, 1767246934, 3419607467,
  1110225616, 1455947556, 450291099, 176445009, 1998723369, 2961538051, 3413933903, 2299562828,
  3945560591, 485550147, 3336694844, 3737152292, 2669437517, 3860417393, 4191585516,
]);
