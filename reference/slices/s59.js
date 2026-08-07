// s59 — sig_s59_msPointerEnabled
// module cm, stage3, codes 0
//
// measures
//   navigator.msPointerEnabled window.MSCSSMatrix window.msIndexedDB window.msSetImmediate
//   navigator.msMaxTouchPoints
// reported value
//   value
// compares against
//   >= 4 in "MSCSSMatrix" in "msIndexedDB" in "msMaxTouchPoints" in "msPointerEnabled"
//   in "msSetImmediate"
// decides on
//   fn49: fn9(["MSCSSMatrix" in window, "msSetImmediate" in window, "msIndexedDB" in window, "msMaxTouchPoints" in navigator, "msPointerEnabled" in navigator]) >= 4
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn49:3373 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:6096
const sig_s59_msPointerEnabled = fn85(fn49);
