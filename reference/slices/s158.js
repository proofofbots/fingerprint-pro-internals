// s158 — sig_s158_hidden
// module cm, stage2, codes 0 -1 -2 -101
//
// measures
//   DOMException document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange") document.hidden clearTimeout() setTimeout()
// engine
//   Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error undefined
// reported value
//   null value
// probes
//   "Shared iframe is not available"
// compares against
//   === 0 > 0
// decides on
//   webdriver === null
//   webdriver === undefined
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn66:3854 sharedIframeIsNotAvailable:8819 v10:3418 v11:3419 v12:3420
//   v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:4174
function sig_s158_hidden(arg517) {
  return sharedIframeIsNotAvailable((arg518, arg519) => {
    const { webdriver: webdriver } = arg519.navigator;
    if (webdriver === null) {
      return { s: -1, v: null };
    }
    if (webdriver === undefined) {
      return { s: -2, v: null };
    }
    return { s: 0, v: webdriver };
  }, arg517.sis);
}
