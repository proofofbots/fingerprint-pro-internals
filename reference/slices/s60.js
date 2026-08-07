// s60 — sig_s60_msLaunchUri
// module cm, stage3, codes 0
//
// measures
//   navigator.msLaunchUri navigator.msSaveBlob window.MSStream window.msWriteProfilerMark
//   navigator.msPointerEnabled window.MSCSSMatrix window.msIndexedDB window.msSetImmediate
//   navigator.msMaxTouchPoints
// reported value
//   value
// compares against
//   >= 3 >= 4 in "MSCSSMatrix" in "MSStream" in "msIndexedDB" in "msLaunchUri" in "msMaxTouchPoints"
//   in "msPointerEnabled" in "msSaveBlob" in "msSetImmediate" in "msWriteProfilerMark"
// decides on
//   fn100: fn9(["msWriteProfilerMark" in window, "MSStream" in window, "msLaunchUri" in navigator, "msSaveBlob" in navigator]) >= 3 && !fn49()
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   fn49: fn9(["MSCSSMatrix" in window, "msSetImmediate" in window, "msIndexedDB" in window, "msMaxTouchPoints" in navigator, "msPointerEnabled" in navigator]) >= 4
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn100:5463 fn129:6642 fn40:1892 fn49:3373 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:6097
const sig_s60_msLaunchUri = fn85(fn100);
