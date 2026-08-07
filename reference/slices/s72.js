// s72 — sig_s72
// module cm, stage3, codes 0 -1 -2
//
// measures
//   navigator
// engine
//   undefined
// reported value
//   null value
// decides on
//   webdriver2 === null
//   webdriver2 === undefined
//
// 0 owned helpers inlined below.

// agent.clean.js:8032
function sig_s72() {
  const { webdriver: webdriver2 } = navigator;
  if (webdriver2 === null) {
    return { s: -1, v: null };
  }
  if (webdriver2 === undefined) {
    return { s: -2, v: null };
  }
  return { s: 0, v: webdriver2 };
}
