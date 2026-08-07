// s64 — sig_s64_style
// module cm, stage3, codes 0
//
// measures
//   document.documentElement.style navigator.buildID window.CanvasCaptureMediaStream
//   window.CSSMozDocumentRule window.mozInnerScreenX window.onmozfullscreenchange
// reported value
//   value
// probes
//   "MozAppearance"
// compares against
//   >= 4 in "CSSMozDocumentRule" in "CanvasCaptureMediaStream" in "MozAppearance" in "buildID"
//   in "mozInnerScreenX" in "onmozfullscreenchange"
// decides on
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn46:3216 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:6101
const sig_s64_style = fn85(fn46);
