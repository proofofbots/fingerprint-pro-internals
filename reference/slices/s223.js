// s223 — sig_s223_presentationRequest
// module cm, stage2, codes 0 -1 -2 -3 -4
//
// measures
//   window.PresentationRequest document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange") document.hidden clearTimeout() setTimeout()
// engine
//   String() Promise.race() Promise Error undefined
// reported value
//   null value
// probes
//   "1bf61339ba6d48768badd4270e9c568c" "96375" "cast:" "function"
// compares against
//   !== "function"
// decides on
//   typeof presentationRequest !== "function"
//   typeof v690.reconnect !== "function"
//   v692 instanceof Error
//   fn142: !((v957 = arg822.cancel) == null)
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn142:7227 fn158:8266 fn66:3854 visibilitychange:6423

// agent.clean.js:4900
function sig_s223_presentationRequest() {
  return fn142(fn66(300, { s: -3, v: null }), async () => {
    const presentationRequest = window.PresentationRequest;
    if (typeof presentationRequest !== "function") {
      return { s: -1, v: null };
    }
    let v690;
    try {
      v690 = new presentationRequest(["cast:"]);
    } catch (v691) {
      return { s: -4, v: null };
    }
    if (typeof v690.reconnect !== "function") {
      return { s: -1, v: null };
    }
    try {
      await v690.reconnect("1bf61339ba6d48768badd4270e9c568c");
    } catch (v692) {
      return { s: 0, v: v692 instanceof Error ? v692.message : String(v692) };
    }
    return { s: -2, v: null };
  });
}
