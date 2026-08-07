// s21 — sig_s21_domRectList
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   window.DOMRectList window.OfflineAudioContext window.ontransitioncancel
//   window.RTCPeerConnectionIceEvent window.SVGGeometryElement window.webkitOfflineAudioContext
//   window.ongestureend window.safari window.TouchEvent window.orientation
//   navigator.vendor.indexOf("Apple") window.ApplePayError
// engine
//   Math.abs() Math.min() Promise Error undefined
// reported value
//   null value
// probes
//   "running" "suspended" "timeout" "triangle"
// compares against
//   != "function" == "function" === "suspended" === "timeout" === -1 === -2 === -3 === 0 > 0 >= 3
//   >= 4 in "ApplePayError" in "CSSPrimitiveValue" in "Counter" in "DOMRectList" in "RGBColor"
//   in "RTCPeerConnectionIceEvent" in "SVGGeometryElement" in "TouchEvent" in "WebKitMediaKeys"
//   in "autocapitalize" in "ongestureend" in "ontransitioncancel" in "orientation"
//   in "pointerLockElement" in "safari"
// decides on
//   arg708 === -1 || arg708 === -2 || arg708 === -3
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   h_s21_domRectList: !offlineAudioContext
//   h_s21_domRectList: fn25() && !fn14() && !function () { return fn9(["DOMRectList" in window, "RTCPeerConnectionIceEvent" in window, "SVGGeometryElement" in window, "ontransitioncan…
//   h_s21_domRectList: fn9(["DOMRectList" in window, "RTCPeerConnectionIceEvent" in window, "SVGGeometryElement" in window, "ontransitioncancel" in window]) >= 3
//   h_s21_domRectList: v1077 && v1078 >= 3
//   h_s21_domRectList: !v1077
//   h_s21_domRectList: v1079 > 0
//   h_s21_domRectList: arg952.name === "timeout" || arg952.name === "suspended"
//   fn40: typeof arg286 != "function"
//   fn88: !!arg590 && typeof arg590.then == "function"
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//   fn14: fn9(["safari" in window, !("ongestureend" in window), !("TouchEvent" in window), !("orientation" in window), HTMLElement && !("autocapitalize" in HTMLElement.pr…
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn14:448 fn25:712 fn40:1892 fn88:4712 fn9:252

// agent.clean.js:5979
const sig_s21_domRectList = fn129(h_s21_domRectList, (arg708) => {
    if (arg708 === -1 || arg708 === -2 || arg708 === -3) {
      return { s: arg708, v: null };
    }
    return { s: 0, v: arg708 };
  });

// agent.clean.js:6270
function h_s21_fn(arg727) {
  const v847 = new Error(arg727);
  v847.name = arg727;
  return v847;
}

// agent.clean.js:8224
function h_s21_fn2(arg915) {
  arg915.then(undefined, () => {});
  return arg915;
}

// agent.clean.js:8617
function h_s21_domRectList() {
  const offlineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!offlineAudioContext) {
    return -2;
  }
  if (
    fn25() &&
    !fn14() &&
    !(function () {
      return (
        fn9([
          "DOMRectList" in window,
          "RTCPeerConnectionIceEvent" in window,
          "SVGGeometryElement" in window,
          "ontransitioncancel" in window,
        ]) >= 3
      );
    })()
  ) {
    return -1;
  }
  const v1070 = new offlineAudioContext(1, 5e3, 44100),
    v1071 = v1070.createOscillator();
  v1071.type = "triangle";
  v1071.frequency.value = 1e4;
  const v1072 = v1070.createDynamicsCompressor();
  v1072.threshold.value = -50;
  v1072.knee.value = 40;
  v1072.ratio.value = 12;
  v1072.attack.value = 0;
  v1072.release.value = 0.25;
  v1071.connect(v1072);
  v1072.connect(v1070.destination);
  v1071.start(0);
  const [v1073, v1074] = (function (arg946) {
      let v1076 = () => {};
      return [
        new Promise((arg947, arg948) => {
          let v1077 = false,
            v1078 = 0,
            v1079 = 0;
          arg946.oncomplete = (arg949) => arg947(arg949.renderedBuffer);
          const v1080 = () => {
              setTimeout(
                () => arg948(h_s21_fn("timeout")),
                Math.min(500, v1079 + 5e3 - Date.now()),
              );
            },
            v1081 = () => {
              try {
                const v1082 = arg946.startRendering();
                switch ((fn88(v1082) && h_s21_fn2(v1082), arg946.state)) {
                  case "running":
                    ((v1079 = Date.now()), v1077 && v1080());
                    break;
                  case "suspended":
                    (document.hidden || v1078++,
                      v1077 && v1078 >= 3 ? arg948(h_s21_fn("suspended")) : setTimeout(v1081, 500));
                }
              } catch (v1083) {
                arg948(v1083);
              }
            };
          v1081();
          v1076 = () => {
            if (!v1077) {
              v1077 = true;
              if (v1079 > 0) {
                v1080();
              }
            }
          };
        }),
        v1076,
      ];
    })(v1070),
    v1075 = h_s21_fn2(
      v1073.then(
        (arg950) =>
          (function (arg951) {
            let v1084 = 0;
            for (let v1085 = 0; v1085 < arg951.length; ++v1085) {
              v1084 += Math.abs(arg951[v1085]);
            }
            return v1084;
          })(arg950.getChannelData(0).subarray(4500)),
        (arg952) => {
          if (arg952.name === "timeout" || arg952.name === "suspended") {
            return -3;
          }
          throw arg952;
        },
      ),
    );
  return () => {
    v1074();
    return v1075;
  };
}
