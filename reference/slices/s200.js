// s200 — sig_s200_timeOrigin
// module cm, stage3, codes 0
//
// measures
//   performance.now() performance.timeOrigin
// reported value
//   value
//
// 0 owned helpers inlined below.

// agent.clean.js:4047
function sig_s200_timeOrigin() {
  return { s: 0, v: performance.timeOrigin ?? Date.now() - performance.now() };
}
