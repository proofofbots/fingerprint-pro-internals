// s93 — sig_s93_hidden
// module cm, stage2, codes 0 -101
//
// measures
//   DOMException document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange") document.hidden clearTimeout() setTimeout()
// engine
//   String.fromCodePoint() Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error
//   undefined
// reported value
//   null value
// probes
//   "Shared iframe is not available" "bottom" "font-family" "height" "left" "nowrap" "right" "span"
//   "top" "width"
// compares against
//   <= 128591 === 0 > 0
// decides on
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   fn73: v612 in v610
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn66:3854 fn73:4206 sharedIframeIsNotAvailable:8819 v10:3418 v11:3419
//   v12:3420 v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:7048
function sig_s93_hidden(arg802) {
  let v929 = "";
  for (let v930 = 128512; v930 <= 128591; v930++) {
    const v931 = String.fromCodePoint(v930);
    v929 += v931;
  }
  return sharedIframeIsNotAvailable((arg803, arg804) => {
    const v932 = arg804.document.createElement("span");
    v932.style.whiteSpace = "nowrap";
    v932.innerText = v929;
    arg804.document.body.append(v932);
    const v933 = fn73(v932, arg804);
    arg804.document.body.removeChild(v932);
    return { s: 0, v: v933 };
  }, arg802.sis);
}
