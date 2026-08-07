// s139 — sig_s139_css
// module cm, stage3, codes 0 -1
//
// measures
//   CSS CSS.supports("backdrop-filter")
// reported value
//   call null
// probes
//   "blur(2px)" "undefined"
// compares against
//   == "undefined"
// decides on
//   typeof CSS == "undefined"
//
// 0 owned helpers inlined below.

// agent.clean.js:7437
function sig_s139_css() {
  if (typeof CSS == "undefined") {
    return { s: -1, v: null };
  }
  return { s: 0, v: CSS.supports("backdrop-filter", "blur(2px)") };
}
