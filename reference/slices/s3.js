// s3 — sig_s3_colorDepth
// module cm, stage3, codes 0 -1
//
// measures
//   window.screen.colorDepth
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

// agent.clean.js:2293
const h_s3_colorDepth = function () {
    return window.screen.colorDepth;
  };

// agent.clean.js:5991
const sig_s3_colorDepth = fn159(h_s3_colorDepth, -1);
