// s63 — sig_s63_ongestureend
// module cm, stage3, codes 0
//
// measures
//   window.ongestureend window.safari window.TouchEvent window.orientation window
// reported value
//   value
// probes
//   "autocapitalize" "pointerLockElement"
// compares against
//   >= 4 in "TouchEvent" in "autocapitalize" in "ongestureend" in "orientation"
//   in "pointerLockElement" in "safari"
// decides on
//   fn14: fn9(["safari" in window, !("ongestureend" in window), !("TouchEvent" in window), !("orientation" in window), HTMLElement && !("autocapitalize" in HTMLElement.pr…
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn14:448 fn40:1892 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:6100
const sig_s63_ongestureend = fn85(fn14);
