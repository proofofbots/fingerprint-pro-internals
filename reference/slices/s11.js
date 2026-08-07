// s11 — sig_s11_localStorage
// module cm, stage3, codes 0
//
// measures
//   window.localStorage
// reported value
//   value
// decides on
//   h_s11_localStorage: !!window.localStorage
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2326
const h_s11_localStorage = function () {
    try {
      return !!window.localStorage;
    } catch (v369) {
      return true;
    }
  };

// agent.clean.js:6000
const sig_s11_localStorage = fn85(h_s11_localStorage);
