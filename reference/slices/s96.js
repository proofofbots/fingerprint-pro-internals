// s96 — sig_s96_audioContext
// module cm, stage3, codes 0 -1 -2 -3
//
// measures
//   AudioContext window.AudioContext Audio window.onorientationchange window.SharedWorker
//   navigator.connection navigator.appVersion window.orientation navigator.vendor.indexOf("Apple")
//   window.ApplePayError window.Counter window.CSSPrimitiveValue
// engine
//   isFinite()
// reported value
//   null value
// compares against
//   != "function" == "function" === -1 === -2 === -3 === 0 >= 2 >= 4 in "ApplePayError"
//   in "CSSPrimitiveValue" in "Counter" in "RGBColor" in "SharedWorker" in "WebKitMediaKeys"
//   in "onorientationchange" in "ontypechange" in "orientation" in "sinkId"
// decides on
//   arg716 === -1 || arg716 === -2 || arg716 === -3
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   h_s96_audioContext: !fn23() && !fn25()
//   h_s96_audioContext: !window.AudioContext
//   h_s96_audioContext: baseLatency == null
//   h_s96_audioContext: !isFinite(baseLatency)
//   fn40: typeof arg286 != "function"
//   fn88: !!arg590 && typeof arg590.then == "function"
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn11:419 fn129:6642 fn23:692 fn25:712 fn40:1892 fn46:3216 fn88:4712 fn9:252

// agent.clean.js:2565
const h_s96_audioContext = function () {
    if (!fn23() && !fn25()) {
      return -2;
    }
    if (!window.AudioContext) {
      return -1;
    }
    const baseLatency = new AudioContext().baseLatency;
    if (baseLatency == null) {
      return -1;
    }
    if (!isFinite(baseLatency)) {
      return -3;
    }
    return baseLatency;
  };

// agent.clean.js:6043
const sig_s96_audioContext = fn129(h_s96_audioContext, (arg716) => {
    if (arg716 === -1 || arg716 === -2 || arg716 === -3) {
      return { s: arg716, v: null };
    }
    return { s: 0, v: arg716 };
  });
