// s7 — sig_s7_hardwareConcurrency
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.hardwareConcurrency
// engine
//   isNaN() parseInt() undefined
// reported value
//   value
// compares against
//   == "number"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   fn170: typeof arg996 == "number" && isNaN(arg996)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn170:8960 fn40:1892 fn57:3688 fn88:4712

// agent.clean.js:2299
const h_s7_hardwareConcurrency = function () {
    return fn170(fn57(navigator.hardwareConcurrency), undefined);
  };

// agent.clean.js:5997
const sig_s7_hardwareConcurrency = fn159(h_s7_hardwareConcurrency, -1);
