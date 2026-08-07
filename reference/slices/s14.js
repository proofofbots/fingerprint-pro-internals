// s14 — sig_s14_cpuClass
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.cpuClass
// reported value
//   value
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2336
const h_s14_cpuClass = function () {
    return navigator.cpuClass;
  };

// agent.clean.js:6002
const sig_s14_cpuClass = fn159(h_s14_cpuClass, -1);
