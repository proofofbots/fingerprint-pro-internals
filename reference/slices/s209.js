// s209 — sig_s209_getRandomValues
// module cm, stage3, codes 0 -1
//
// measures
//   window.crypto.getRandomValues() document.createElement("canvas") TextEncoder
// engine
//   Math.floor() Array.from() ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf()
//   Uint32Array Uint8Array
// reported value
//   null {s,p,d}
// probes
//   "," ",255)" "2d" "data" "function" "height" "rgba(" "width"
// compares against
//   < 4 == "function" === "string"
// decides on
//   !v338
//   h_s209_fn: (v328 >>> 0) / 4294967296
//   readVaultedProp: typeof v316 == "function"
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn48:3370 readVaultedProp:1674 resolveNameByHash:7015
//   stringToBytes:7901

// agent.clean.js:404
function h_s209_getRandomValues() {
  const uint32Array2 = new Uint32Array(4);
  window.crypto.getRandomValues(uint32Array2);
  return [uint32Array2[0] | 0, uint32Array2[1] | 0, uint32Array2[2] | 0, uint32Array2[3] | 0];
}

// agent.clean.js:1771
function h_s209_fn(arg267, arg268, arg269, arg270) {
  return function () {
    const v327 = arg268 << 9;
    let v328 = 5 * arg267;
    v328 = 9 * ((v328 << 7) | (v328 >>> 25));
    arg270 ^= arg268;
    arg268 ^= arg269 ^= arg267;
    arg267 ^= arg270;
    arg269 ^= v327;
    arg270 = (arg270 << 11) | (arg270 >>> 21);
    return (v328 >>> 0) / 4294967296;
  };
}

// agent.clean.js:1844
function sig_s209_getRandomValues() {
  const v337 = function (arg281, arg282, arg283, arg284, arg285) {
      return arg281(arg282, arg283, arg284, arg285);
    },
    canvas2 = document.createElement("canvas"),
    v338 = canvas2.getContext("2d");
  if (!v338) {
    return { s: -1, v: null };
  }
  canvas2.width = 4;
  canvas2.height = 4;
  const v339 = h_s209_getRandomValues(),
    v340 = v337(h_s209_fn, v339[0], v339[1], v339[2], v339[3]);
  for (let v342 = 0; v342 < 4; v342++) {
    for (let v343 = 0; v343 < 4; v343++) {
      const v344 = Math.floor(v340() * 256),
        v345 = Math.floor(v340() * 256),
        v346 = Math.floor(v340() * 256);
      v338.fillStyle = "rgba(" + v344 + "," + v345 + "," + v346 + ",255)";
      v338.fillRect(v343, v342, 1, 1);
    }
  }
  const v341 = v338.getImageData(
    0,
    0,
    readVaultedProp(canvas2, "width"),
    readVaultedProp(canvas2, "height"),
  );
  return { s: 0, v: { s: v339, p: Array.from(readVaultedProp(v341, "data")), d: 4 } };
}
