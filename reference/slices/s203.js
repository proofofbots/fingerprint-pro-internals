// s203 — sig_s203_createElement
// module cm, stage3, codes 0
//
// measures
//   document.createElement("a")
// reported value
//   value
//
// 0 owned helpers inlined below.

// agent.clean.js:3843
function sig_s203_createElement() {
  const v573 = document.createElement("a");
  v573.style.width =
    "calc( 1px * ( sin( 66911823500 * ( 36781 / -0.55 * cos( -30780.497322536891 ) ) ) )";
  return { s: 0, v: v573.style.width };
}
