// s132 — sig_s132
// module cm, stage3, codes 0 -1
//
// measures
//   window.close window.close.toString()
// engine
//   undefined
// reported value
//   call null
// decides on
//   window.close === undefined
//
// 0 owned helpers inlined below.

// agent.clean.js:1550
function sig_s132() {
  if (window.close === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: window.close.toString() };
}
