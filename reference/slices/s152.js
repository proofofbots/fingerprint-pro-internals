// s152 — sig_s152_hidden
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
//   ".5px dotted transparent" "Shared iframe is not available" "div"
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

// agent.clean.js:409
async function sig_s152_hidden(arg54) {
  return sharedIframeIsNotAvailable((arg55, arg56) => {
    const v95 = arg56.document.createElement("div");
    v95.style.border = ".5px dotted transparent";
    arg56.document.body.appendChild(v95);
    const offsetHeight = v95.offsetHeight;
    arg56.document.body.removeChild(v95);
    return { s: 0, v: offsetHeight };
  }, arg54.sis);
}
