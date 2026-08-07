// s142 — sig_s142_matchMedia
// module cm, stage3, codes 0 -1 -2
//
// measures
//   window.matchMedia window.matchMedia("(-webkit-min-device-pixel-ratio: 2), (mi")
// engine
//   undefined
// reported value
//   null value
// probes
//   "function"
// compares against
//   != "function"
// decides on
//   typeof window.matchMedia != "function"
//   mediaQuery.matches === undefined
//
// 0 owned helpers inlined below.

// agent.clean.js:7035
function sig_s142_matchMedia() {
  if (typeof window.matchMedia != "function") {
    return { s: -2, v: null };
  }
  const mediaQuery = window.matchMedia(
    "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
  );
  if (mediaQuery.matches === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: mediaQuery.matches };
}
