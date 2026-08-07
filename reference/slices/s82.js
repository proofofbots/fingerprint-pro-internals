// s82 — sig_s82_language
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.language
// reported value
//   null value
//
// 0 owned helpers inlined below.

// agent.clean.js:5731
function sig_s82_language() {
  const language2 = navigator.language;
  if (language2) {
    return { s: 0, v: language2 };
  }
  return { s: -1, v: null };
}
