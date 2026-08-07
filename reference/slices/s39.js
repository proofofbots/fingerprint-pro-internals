// s39 — sig_s39_forcedColors
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(forced-colors: ${})`)
// reported value
//   value
// probes
//   "active" "none"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s39_fn: h_s39_forcedColors("active")
//   h_s39_fn: h_s39_forcedColors("none")
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2448
const h_s39_fn = function () {
    if (h_s39_forcedColors("active")) {
      return true;
    }
    if (h_s39_forcedColors("none")) {
      return false;
    }
    return;
  };

// agent.clean.js:6026
const sig_s39_forcedColors = fn159(h_s39_fn, -1);

// agent.clean.js:7295
function h_s39_forcedColors(arg828) {
  return matchMedia(`(forced-colors: ${arg828})`).matches;
}
