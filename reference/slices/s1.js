// s1 — sig_s1_oscpu
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.oscpu
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

// agent.clean.js:2256
const h_s1_oscpu = function () {
    return navigator.oscpu;
  };

// agent.clean.js:5989
const sig_s1_oscpu = fn159(h_s1_oscpu, -1);
