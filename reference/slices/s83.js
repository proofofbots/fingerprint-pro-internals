// s83 — sig_s83_languages
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.languages
// reported value
//   null value
//
// 0 owned helpers inlined below.

// agent.clean.js:5741
function sig_s83_languages() {
  const languages3 = navigator.languages;
  if (languages3) {
    return { s: 0, v: languages3 };
  }
  return { s: -1, v: null };
}
