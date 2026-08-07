// s49 — sig_s49
// module cm, stage3, codes 0 -1
//
// measures
//   window
// reported value
//   [] null
// compares against
//   < 50000
// decides on
//   !v700?.now
//   (v703 = v704) < (v704 = v700.now())
//   v706 > v701
//   v706 < v702
//   v706 < v701
//
// 0 owned helpers inlined below.

// agent.clean.js:4965
function sig_s49() {
  const { performance: v700 } = window;
  if (!v700?.now) {
    return { s: -1, v: null };
  }
  let v701 = 1,
    v702 = 1,
    v703 = v700.now(),
    v704 = v703;
  for (let v705 = 0; v705 < 5e4; v705++) {
    if ((v703 = v704) < (v704 = v700.now())) {
      const v706 = v704 - v703;
      if (v706 > v701) {
        if (v706 < v702) {
          v702 = v706;
        }
      } else {
        if (v706 < v701) {
          v702 = v701;
          v701 = v706;
        }
      }
    }
  }
  return { s: 0, v: [v701, v702] };
}
