// s41 — sig_s41_invertedColors
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(inverted-colors: ${})`)
// engine
//   undefined
// reported value
//   value
// probes
//   "none"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s41_fn: !!h_s41_invertedColors("inverted") || !h_s41_invertedColors("none") && undefined
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2445
const h_s41_fn = function () {
    return !!h_s41_invertedColors("inverted") || (!h_s41_invertedColors("none") && undefined);
  };

// agent.clean.js:3833
function h_s41_invertedColors(arg470) {
  return matchMedia(`(inverted-colors: ${arg470})`).matches;
}

// agent.clean.js:6025
const sig_s41_invertedColors = fn159(h_s41_fn, -1);
