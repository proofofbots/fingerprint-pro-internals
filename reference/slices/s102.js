// s102 — sig_s102_userAgentData
// module cm, stage3, codes 0
//
// measures
//   navigator.userAgentData
// reported value
//   value
// probes
//   "object"
// compares against
//   != "object"
//
// 0 owned helpers inlined below.

// agent.clean.js:7751
function sig_s102_userAgentData() {
  return { s: 0, v: !(!navigator.userAgentData || typeof navigator.userAgentData != "object") };
}
