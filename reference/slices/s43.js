// s43 — sig_s43_prefersReducedMotion
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(prefers-reduced-motion: ${})`)
// engine
//   undefined
// reported value
//   value
// probes
//   "no-preference"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s43_fn: !!h_s43_prefersReducedMotion("reduce") || !h_s43_prefersReducedMotion("no-preference") && undefined
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2482
const h_s43_fn = function () {
    return (
      !!h_s43_prefersReducedMotion("reduce") ||
      (!h_s43_prefersReducedMotion("no-preference") && undefined)
    );
  };

// agent.clean.js:5017
function h_s43_prefersReducedMotion(arg626) {
  return matchMedia(`(prefers-reduced-motion: ${arg626})`).matches;
}

// agent.clean.js:6029
const sig_s43_prefersReducedMotion = fn159(h_s43_fn, -1);
