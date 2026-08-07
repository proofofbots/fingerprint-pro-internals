// s86 — sig_s86_removeItem
// module cm, stage3, codes 0 -1
//
// measures
//   window.localStorage.removeItem("test") window.localStorage.setItem("test") window.onafterprint
//   window.PointerEvent window.visualViewport navigator.maxTouchPoints window.localStorage
//   navigator.mediaCapabilities navigator.vendor.indexOf("Apple") window.ApplePayError
//   window.Counter window.CSSPrimitiveValue
// engine
//   ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Uint32Array Uint8Array
// reported value
//   boolean null
// probes
//   "1" "function" "openDatabase"
// compares against
//   == "function" === "string" === 0 >= 4 in "ApplePayError" in "CSSPrimitiveValue" in "Counter"
//   in "PointerEvent" in "RGBColor" in "WebKitMediaKeys" in "maxTouchPoints" in "mediaCapabilities"
//   in "onafterprint" in "visualViewport"
// decides on
//   !fn25() || h_s86_onafterprint()
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   h_s86_onafterprint: fn36(["maxTouchPoints" in navigator, "mediaCapabilities" in navigator, "PointerEvent" in window, "visualViewport" in window, "onafterprint" in window]) >= 4
//   readVaultedProp: typeof v316 == "function"
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn25:712 fn36:1793 fn48:3370 fn9:252 readVaultedProp:1674
//   resolveNameByHash:7015 stringToBytes:7901

// agent.clean.js:1697
function h_s86_onafterprint() {
  return (
    fn36([
      "maxTouchPoints" in navigator,
      "mediaCapabilities" in navigator,
      "PointerEvent" in window,
      "visualViewport" in window,
      "onafterprint" in window,
    ]) >= 4
  );
}

// agent.clean.js:3182
function sig_s86_removeItem() {
  if (!fn25() || h_s86_onafterprint()) {
    return { s: -1, v: null };
  }
  const v486 = readVaultedProp(window, "openDatabase"),
    v487 = window.localStorage;
  try {
    v486(null, null, null, null);
  } catch (v488) {
    return { s: 0, v: true };
  }
  try {
    v487.setItem("test", "1");
    v487.removeItem("test");
    return { s: 0, v: false };
  } catch (v489) {
    return { s: 0, v: true };
  }
}
