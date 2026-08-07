// s62 — sig_s62_applePayError
// module cm, stage3, codes 0
//
// measures
//   navigator.vendor.indexOf("Apple") window.ApplePayError window.Counter window.CSSPrimitiveValue
//   window.RGBColor window.WebKitMediaKeys
// reported value
//   value
// compares against
//   === 0 >= 4 in "ApplePayError" in "CSSPrimitiveValue" in "Counter" in "RGBColor"
//   in "WebKitMediaKeys"
// decides on
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn25:712 fn40:1892 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:6099
const sig_s62_applePayError = fn85(fn25);
