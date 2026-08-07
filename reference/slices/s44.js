// s44 — sig_s44_prefersColorScheme
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(prefers-color-scheme: ${})`)
// reported value
//   boolean null
// probes
//   "dark" "light"
// decides on
//   h_s44_prefersColorScheme("dark")
//   h_s44_prefersColorScheme("light")
//
// 1 owned helper inlined below.

// agent.clean.js:255
function h_s44_prefersColorScheme(arg39) {
  return matchMedia(`(prefers-color-scheme: ${arg39})`).matches;
}

// agent.clean.js:3769
function sig_s44_prefersColorScheme() {
  if (h_s44_prefersColorScheme("dark")) {
    return { s: 0, v: true };
  }
  if (h_s44_prefersColorScheme("light")) {
    return { s: 0, v: false };
  }
  return { s: -1, v: null };
}
