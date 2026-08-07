// s204 — sig_s204_hidden
// module cm, stage2, codes 0 -101
//
// measures
//   DOMException document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange") document.hidden clearTimeout() setTimeout()
// engine
//   Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error undefined
// reported value
//   null value
// probes
//   "100px" "Shared iframe is not available" "div" "scroll"
// compares against
//   === 0 > 0
// decides on
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn66:3854 sharedIframeIsNotAvailable:8819 v10:3418 v11:3419 v12:3420
//   v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:4991
async function sig_s204_hidden(arg619) {
  return sharedIframeIsNotAvailable((arg620, arg621) => {
    const element5 = arg621.document.createElement("div");
    element5.style.width = "100px";
    element5.style.height = "100px";
    element5.style.overflow = "scroll";
    element5.style.visibility = "hidden";
    arg621.document.body.appendChild(element5);
    const v707 = element5.offsetWidth === element5.clientWidth;
    arg621.document.body.removeChild(element5);
    return { s: 0, v: v707 };
  }, arg619.sis);
}
