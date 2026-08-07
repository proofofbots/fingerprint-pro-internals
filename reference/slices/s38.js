// s38 — sig_s38_prefersContrast
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(prefers-contrast: ${})`)
// reported value
//   value
// probes
//   "forced" "high" "less" "low" "more" "no-preference"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s38_fn: h_s38_prefersContrast("no-preference")
//   h_s38_fn: h_s38_prefersContrast("high") || h_s38_prefersContrast("more")
//   h_s38_fn: h_s38_prefersContrast("low") || h_s38_prefersContrast("less")
//   h_s38_fn: h_s38_prefersContrast("forced")
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:54
function h_s38_prefersContrast(arg6) {
  return matchMedia(`(prefers-contrast: ${arg6})`).matches;
}

// agent.clean.js:2467
const h_s38_fn = function () {
    if (h_s38_prefersContrast("no-preference")) {
      return 0;
    }
    if (h_s38_prefersContrast("high") || h_s38_prefersContrast("more")) {
      return 1;
    }
    if (h_s38_prefersContrast("low") || h_s38_prefersContrast("less")) {
      return -1;
    }
    if (h_s38_prefersContrast("forced")) {
      return 10;
    }
    return;
  };

// agent.clean.js:6028
const sig_s38_prefersContrast = fn159(h_s38_fn, -1);
