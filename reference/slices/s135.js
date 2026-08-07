// s135 — sig_s135_mimeTypes
// module cm, stage3, codes 0 -1 -3
//
// measures
//   navigator.mimeTypes.length navigator.mimeTypes
// engine
//   undefined
// reported value
//   null value
// decides on
//   navigator.mimeTypes === undefined
//   navigator.mimeTypes.length === undefined
//
// 0 owned helpers inlined below.

// agent.clean.js:4361
function sig_s135_mimeTypes() {
  if (navigator.mimeTypes === undefined) {
    return { s: -1, v: null };
  }
  if (navigator.mimeTypes.length === undefined) {
    return { s: -3, v: null };
  }
  return { s: 0, v: navigator.mimeTypes.length };
}
