// s155 — sig_s155
// module cm, stage3, codes 0
//
// measures
//   window
// engine
//   Object.getOwnPropertyDescriptor() undefined
// reported value
//   value
// probes
//   "appName" "availHeight" "availWidth" "height" "languages" "navigator" "platform" "plugins"
//   "screen" "userAgent" "width"
// decides on
//   v591 !== undefined
//
// 0 owned helpers inlined below.

// agent.clean.js:4050
function sig_s155() {
  const v586 = [
    ["navigator", ["plugins", "userAgent", "platform", "appName", "languages"]],
    ["screen", ["width", "availWidth", "height", "availHeight"]],
  ];
  const v587 = {};
  for (const [v588, v589] of v586) {
    for (const v590 of v589) {
      const v591 = Object.getOwnPropertyDescriptor(window[v588], v590)?.get?.toString();
      if (v591 !== undefined) {
        v587[`${v588}.${v590}`] = v591;
      }
    }
  }
  return { s: 0, v: v587 };
}
