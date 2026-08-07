// s4 — sig_s4_deviceMemory
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.deviceMemory
// engine
//   parseFloat() isNaN() undefined
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
//   fn113:6135 fn129:6642 fn159:8289 fn170:8960 fn40:1892 fn88:4712

// agent.clean.js:2296
const h_s4_deviceMemory = function () {
    return fn170(fn113(navigator.deviceMemory), undefined);
  };

// agent.clean.js:5992
const sig_s4_deviceMemory = fn159(h_s4_deviceMemory, -1);
