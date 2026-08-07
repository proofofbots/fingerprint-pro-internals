// s30 — sig_s30_doNotTrack
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.doNotTrack
// reported value
//   null value
// decides on
//   doNotTrack == null
//
// 0 owned helpers inlined below.

// agent.clean.js:1907
function sig_s30_doNotTrack() {
  const doNotTrack = navigator.doNotTrack;
  if (doNotTrack == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: doNotTrack };
}
