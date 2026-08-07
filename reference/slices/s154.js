// s154 — sig_s154_brave
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   navigator.brave navigator.requestMediaKeySystemAccess() window.MediaKeys window.MSMediaKeys
//   document.featurePolicy navigator.mediaCapabilities.decodingInfo()
//   navigator.requestMediaKeySystemAccess navigator.mediaCapabilities Audio
//   window.onorientationchange window.SharedWorker navigator.connection
// engine
//   Object.prototype.hasOwnProperty.call Promise.all() Math.ceil() Object.assign() ArrayBuffer
//   Object.getOwnPropertyNames() Object.getPrototypeOf() Promise.race()
// reported value
//   null value
// probes
//   "96375" "ck" "com.adobe.access" "com.adobe.primetime" "com.apple.fairplay"
//   "com.microsoft.playready" "com.youtube.playready" "drm" "encrypted-media" "fp" "ontypechange"
//   "org.w3.clearkey" "pr" "sinkId" "webkit-org.w3.clearkey" "wv" "wvp"
// compares against
//   <= 0 == "function" === 0 >= 2 >= 4 >= 5 in "BatteryManager" in "CSSMozDocumentRule"
//   in "CanvasCaptureMediaStream" in "MSMediaKeys" in "MediaKeys" in "MozAppearance"
//   in "SharedWorker" in "WebKitMediaKeys" in "buildID" in "featurePolicy" in "mozInnerScreenX"
//   in "onmozfullscreenchange" in "onorientationchange" in "ontypechange" in "orientation"
//   in "requestMediaKeySystemAccess" in "sinkId" in "webkitMediaStream" in "webkitPersistentStorage"
//   in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar" in "webkitTemporaryStorage"
// decides on
//   !fn147() || !fn39()
//   fn23()
//   fn147: ("MediaKeys" in window || "WebKitMediaKeys" in window || "MSMediaKeys" in window) && "requestMediaKeySystemAccess" in navigator
//   fn39: !fn11() || !("featurePolicy" in document) || !!((v336 = document.featurePolicy) == null ? undefined : v336.allowedFeatures().includes("encrypted-media"))
//   fn39: (v336 = document.featurePolicy) == null
//   fn150: readVaultedProp(arg898, "drm") || (arg898.drm = {})
//   fn142: !((v957 = arg822.cancel) == null)
//   fn90: !v666
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//   readVaultedProp: typeof v316 == "function"
//   fn157: v1032 = undefined, !v1034
//   fn157: v1033-- <= 0
//   fn157: !v1034
//   fn157: !(v1032 == null)
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   h_s154_fn3: (await comWidevineAlpha(arg970, arg969)).s === 0
//   h_s154_fn: !!(await fn141(v68, arg30, arg31))
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 comWidevineAlpha:4347 crc32OfBytes:4943 fn102:5647 fn106:5738 fn11:419
//   fn12:432 fn130:6824 fn141:7220 fn142:7227 fn147:7758 fn150:8043 fn157:8239 fn158:8266 fn23:692
//   fn31:1619 fn39:1826 fn46:3216 fn48:3370 fn71:4148 fn9:252 fn90:4751 readVaultedProp:1674
//   resolveNameByHash:7015 stringToBytes:7901 visibilitychange:6423

// agent.clean.js:220
async function h_s154_fn(arg29, arg30, arg31) {
  for (const v68 of arg29) {
    try {
      return !!(await fn141(v68, arg30, arg31));
    } catch (v69) {}
  }
  return false;
}

// agent.clean.js:3130
async function sig_s154_brave({ cache: arg363 }) {
  if (!fn147() || !fn39()) {
    return () => ({ s: -1, v: null });
  }
  if (fn23()) {
    return () => ({ s: -3, v: null });
  }
  const v472 = fn150(arg363);
  return fn142(fn90(300, 10, 500, { s: -2, v: null }), async () => {
    const v473 = await Promise.all(
        h_s154_fn2.map(async (arg364) => {
          const [v475, v476] = arg364;
          return [v475, await v476(v472)];
        }),
      ),
      v474 = {};
    for (const [v477, v478] of v473) {
      v474[v477] = v478;
    }
    return { s: 0, v: v474 };
  });
}

// agent.clean.js:6922
const h_s154_fn2 = [
  ["wv", (arg790) => h_s154_fn3(false, arg790)],
  ["wvp", () => h_s154_fn3(true)],
  ["pr", () => h_s154_fn(["com.microsoft.playready", "com.youtube.playready"])],
  ["ck", () => h_s154_fn(["webkit-org.w3.clearkey", "org.w3.clearkey"])],
  ["pt", () => h_s154_fn(["com.adobe.primetime", "com.adobe.access"])],
  ["fp", () => h_s154_fn(["com.apple.fairplay"])],
];

// agent.clean.js:8777
async function h_s154_fn3(arg969 = false, arg970) {
  return (await comWidevineAlpha(arg970, arg969)).s === 0;
}
