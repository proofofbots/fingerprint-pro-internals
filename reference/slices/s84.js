// s84 — sig_s84_hidden
// module cm, stage2, codes 0 -101
//
// measures
//   DOMException document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange") document.hidden clearTimeout() setTimeout()
// engine
//   isNaN() parseInt() Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error
// reported value
//   null {w,h}
// probes
//   "Shared iframe is not available" "number"
// compares against
//   == "number" === 0 > 0
// decides on
//   typeof v462 == "number" && isNaN(v462)
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn66:3854 sharedIframeIsNotAvailable:8819 v10:3418 v11:3419 v12:3420
//   v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:3021
function sig_s84_hidden(arg350) {
  return sharedIframeIsNotAvailable((arg351, arg352) => {
    const v460 = arg352.screen,
      v461 = (arg353) => {
        const v462 = parseInt(arg353);
        return typeof v462 == "number" && isNaN(v462) ? -1 : v462;
      };
    return { s: 0, v: { w: v461(v460.width), h: v461(v460.height) } };
  }, arg350.sis);
}
