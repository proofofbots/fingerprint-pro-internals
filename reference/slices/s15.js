// s15 — sig_s15_webkitRequestFullscreen
// module cm, stage3, codes 0 -1
//
// measures
//   Element.prototype.webkitRequestFullscreen navigator.platform window.MediaSource screen.height
//   screen.width window.ongestureend window.safari window.TouchEvent window.orientation navigator
//   navigator.vendor.indexOf("Apple") window.ApplePayError
// reported value
//   value
// probes
//   "MacIntel" "iPad" "iPhone"
// compares against
//   < 1.53 === "MacIntel" === "iPad" === 0 > 0.65 >= 2 >= 4 in "ApplePayError"
//   in "CSSPrimitiveValue" in "Counter" in "MediaSource" in "RGBColor" in "TouchEvent"
//   in "WebKitMediaKeys" in "autocapitalize" in "ongestureend" in "orientation"
//   in "pointerLockElement" in "safari"
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s15_webkitRequestFullscreen: platform === "MacIntel" && fn25() && !fn14()
//   h_s15_webkitRequestFullscreen: function () { if (navigator.platform === "iPad") { return true; } const v370 = screen.width / screen.height; return fn9(["MediaSource" in window, !!Element.prot…
//   h_s15_webkitRequestFullscreen: navigator.platform === "iPad"
//   h_s15_webkitRequestFullscreen: fn9(["MediaSource" in window, !!Element.prototype.webkitRequestFullscreen, v370 > 0.65 && v370 < 1.53]) >= 2
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   fn14: fn9(["safari" in window, !("ongestureend" in window), !("TouchEvent" in window), !("orientation" in window), HTMLElement && !("autocapitalize" in HTMLElement.pr…
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn14:448 fn159:8289 fn25:712 fn40:1892 fn88:4712 fn9:252

// agent.clean.js:2339
const h_s15_webkitRequestFullscreen = function () {
    const { platform: platform } = navigator;
    if (platform === "MacIntel" && fn25() && !fn14()) {
      return (function () {
        if (navigator.platform === "iPad") {
          return true;
        }
        const v370 = screen.width / screen.height;
        return (
          fn9([
            "MediaSource" in window,
            !!Element.prototype.webkitRequestFullscreen,
            v370 > 0.65 && v370 < 1.53,
          ]) >= 2
        );
      })()
        ? "iPad"
        : "iPhone";
    }
    return platform;
  };

// agent.clean.js:6003
const sig_s15_webkitRequestFullscreen = fn159(h_s15_webkitRequestFullscreen, -1);
