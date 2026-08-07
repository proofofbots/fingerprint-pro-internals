// s91 — sig_s91_prefersReducedTransparency
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(prefers-reduced-transparency: ${})`)
// reported value
//   value
// probes
//   "no-preference"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s91_fn: h_s91_prefersReducedTransparency("reduce")
//   h_s91_fn: h_s91_prefersReducedTransparency("no-preference")
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:1895
function h_s91_prefersReducedTransparency(arg287) {
  return matchMedia(`(prefers-reduced-transparency: ${arg287})`).matches;
}

// agent.clean.js:2488
const h_s91_fn = function () {
    if (h_s91_prefersReducedTransparency("reduce")) {
      return true;
    }
    if (h_s91_prefersReducedTransparency("no-preference")) {
      return false;
    }
    return;
  };

// agent.clean.js:6030
const sig_s91_prefersReducedTransparency = fn159(h_s91_fn, -1);
