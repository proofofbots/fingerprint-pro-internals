// s206 — sig_s206_style
// module cm, stage2, codes 0 -1 -101
//
// measures
//   document.documentElement.style navigator.buildID window.CanvasCaptureMediaStream
//   window.CSSMozDocumentRule window.mozInnerScreenX window.onmozfullscreenchange DOMException
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden clearTimeout() setTimeout()
// engine
//   Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error undefined
// reported value
//   null value
// probes
//   "MozAppearance" "Shared iframe is not available" "font-family" "input" "radio"
// compares against
//   === 0 > 0 >= 4 in "CSSMozDocumentRule" in "CanvasCaptureMediaStream" in "MozAppearance"
//   in "buildID" in "mozInnerScreenX" in "onmozfullscreenchange"
// decides on
//   !fn46()
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn46:3216 fn66:3854 fn9:252 sharedIframeIsNotAvailable:8819 v10:3418
//   v11:3419 v12:3420 v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:7112
async function sig_s206_style(arg810) {
  return sharedIframeIsNotAvailable((arg811, arg812) => {
    if (!fn46()) {
      return { s: -1, v: null };
    }
    const v947 = arg812.document.createElement("input");
    v947.type = "radio";
    arg812.document.body.appendChild(v947);
    const v948 = arg812.getComputedStyle(v947).getPropertyValue("font-family");
    arg812.document.body.removeChild(v947);
    return { s: 0, v: v948 };
  }, arg810.sis);
}
