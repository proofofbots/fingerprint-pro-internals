// s120 — sig_s120
// module cm, stage3, codes 0
//
// reported value
//   boolean
// probes
//   "a"
//
// 0 owned helpers inlined below.

// agent.clean.js:7162
function sig_s120() {
  try {
    throw "a";
  } catch (v951) {
    try {
      v951.toSource();
      return { s: 0, v: true };
    } catch (v952) {
      return { s: 0, v: false };
    }
  }
}
