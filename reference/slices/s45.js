// s45 — sig_s45_date
// module cm, stage3, codes 0
//
// measures
//   Date
// engine
//   Number() isNaN()
// reported value
//   []
// decides on
//   h_s45_fn: isNaN(v31)
//
// 1 owned helper inlined below.

// agent.clean.js:27
function h_s45_fn(arg3) {
  const v31 = Number(arg3);
  return isNaN(v31) ? -1 : v31;
}

// agent.clean.js:3257
function sig_s45_date() {
  const v501 = Date.now();
  return { s: 0, v: [h_s45_fn(v501), h_s45_fn(v501 - 6e4 * new Date().getTimezoneOffset())] };
}
