// s207 — sig_s207_fontFace
// module cm, stage2, codes 0
//
// measures
//   FontFace
// reported value
//   boolean
// probes
//   "font" "local('Arial')"
//
// 0 owned helpers inlined below.

// agent.clean.js:6291
async function sig_s207_fontFace() {
  try {
    const fontFace = new FontFace("font", "local('Arial')");
    await fontFace.load();
    return { s: 0, v: true };
  } catch (v848) {
    return { s: 0, v: false };
  }
}
