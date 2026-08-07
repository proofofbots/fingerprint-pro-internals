// s165 — sig_s165_event
// module cm, stage3, codes 0 -1
//
// measures
//   window.Event
// reported value
//   null {isTrusted}
// probes
//   "boolean"
// compares against
//   !== "boolean"
// decides on
//   typeof isTrusted !== "boolean"
//
// 0 owned helpers inlined below.

// agent.clean.js:5828
function sig_s165_event() {
  const isTrusted = new window.Event("").isTrusted;
  if (typeof isTrusted !== "boolean") {
    return { s: -1, v: null };
  }
  return { s: 0, v: { isTrusted: isTrusted } };
}
