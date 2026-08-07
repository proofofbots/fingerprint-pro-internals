// s10 — sig_s10_sessionStorage
// module cm, stage3, codes 0
//
// measures
//   window.sessionStorage
// reported value
//   value
// decides on
//   h_s10_sessionStorage: !!window.sessionStorage
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2319
const h_s10_sessionStorage = function () {
    try {
      return !!window.sessionStorage;
    } catch (v368) {
      return true;
    }
  };

// agent.clean.js:5999
const sig_s10_sessionStorage = fn85(h_s10_sessionStorage);
