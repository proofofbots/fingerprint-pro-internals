// s27 — sig_s27_vendor
// module cm, stage3, codes 0
//
// measures
//   navigator.vendor
// reported value
//   value
// decides on
//   h_s27_vendor: navigator.vendor || ""
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2399
const h_s27_vendor = function () {
    return navigator.vendor || "";
  };

// agent.clean.js:6021
const sig_s27_vendor = fn85(h_s27_vendor);
