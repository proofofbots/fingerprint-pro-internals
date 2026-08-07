// s81 — sig_s81
// module cm, stage3, codes 0
//
// engine
//   Infinity Float32Array Uint8Array
// reported value
//   value
// decides on
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2553
const h_s81_fn = function () {
    const float32Array = new Float32Array(1),
      uint8Array8 = new Uint8Array(float32Array.buffer);
    float32Array[0] = Infinity;
    float32Array[0] = float32Array[0] - float32Array[0];
    return uint8Array8[3];
  };

// agent.clean.js:6041
const sig_s81 = fn85(h_s81_fn);
