// s99 — sig_s99_isSecureContext
// module cm, stage3, codes 0
//
// measures
//   window.isSecureContext
// engine
//   Boolean()
// reported value
//   call
//
// 0 owned helpers inlined below.

// agent.clean.js:6818
function sig_s99_isSecureContext() {
  return { s: 0, v: Boolean(window.isSecureContext) };
}
