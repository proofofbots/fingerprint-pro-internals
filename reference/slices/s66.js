// s66 — sig_s66_createElement
// module cm, stage3, codes 0 -1
//
// measures
//   document.createElement("a")
// engine
//   String() undefined
// reported value
//   value
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s66_createElement: attributionSourceId === undefined
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2560
const h_s66_createElement = function () {
    const v389 = document.createElement("a"),
      attributionSourceId = v389.attributionSourceId ?? v389.attributionsourceid;
    return attributionSourceId === undefined ? undefined : String(attributionSourceId);
  };

// agent.clean.js:6042
const sig_s66_createElement = fn159(h_s66_createElement, -1);
