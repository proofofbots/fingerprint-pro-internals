// s57 — sig_s57_devicePixelRatio
// module cm, stage3, codes 0 -1
//
// measures
//   window.devicePixelRatio
// reported value
//   null value
// decides on
//   devicePixelRatio == null
//
// 0 owned helpers inlined below.

// agent.clean.js:8006
function sig_s57_devicePixelRatio() {
  const devicePixelRatio = window.devicePixelRatio;
  if (devicePixelRatio == null) {
    return { s: -1, v: null };
  }
  return { s: 0, v: devicePixelRatio };
}
