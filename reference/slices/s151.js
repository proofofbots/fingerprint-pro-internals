// s151 — sig_s151
// module cm, stage3, codes 0 -1
//
// measures
//   document
// engine
//   Object.getOwnPropertyDescriptor()
// reported value
//   null value
// probes
//   "createElement" "writeable"
// compares against
//   in "writeable"
//
// 0 owned helpers inlined below.

// agent.clean.js:4816
function sig_s151() {
  const v685 = Object.getOwnPropertyDescriptor(document, "createElement");
  if (v685) {
    return { s: 0, v: !("writeable" in v685) };
  }
  return { s: -1, v: null };
}
