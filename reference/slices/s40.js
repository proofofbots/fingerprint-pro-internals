// s40 — sig_s40_dynamicRange
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(dynamic-range: ${})`)
// reported value
//   value
// probes
//   "high" "standard"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s40_fn: h_s40_dynamicRange("high")
//   h_s40_fn: h_s40_dynamicRange("standard")
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2497
const h_s40_fn = function () {
    if (h_s40_dynamicRange("high")) {
      return true;
    }
    if (h_s40_dynamicRange("standard")) {
      return false;
    }
    return;
  };

// agent.clean.js:4186
function h_s40_dynamicRange(arg520) {
  return matchMedia(`(dynamic-range: ${arg520})`).matches;
}

// agent.clean.js:6031
const sig_s40_dynamicRange = fn159(h_s40_fn, -1);
