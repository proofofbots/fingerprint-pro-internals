// s51 — sig_s51_iframe
// module cm, stage2, codes 0 -101
//
// measures
//   document.createElement("iframe") document.body document.body.appendChild()
//   navigator.vendor.indexOf("Apple") window.ApplePayError window.Counter window.CSSPrimitiveValue
//   window.RGBColor navigator.webkitPersistentStorage navigator.webkitTemporaryStorage
//   window.BatteryManager window.webkitMediaStream
// engine
//   Array() Object.keys() TypeError Promise undefined
// reported value
//   call null
// probes
//   " " "-apple-system-body" "0" "1px" "about:blank" "absolute" "block" "br" "complete" "display"
//   "div" "hidden" "important" "mmMwWLliI0fiflO&1" "monospace" "none" "nowrap" "reset" "sans-serif"
//   "serif" "span" "srcdoc" "system-ui" "text-size-adjust" "word" "zoom"
// compares against
//   === "complete" === 0 >= 4 >= 5 in "ApplePayError" in "BatteryManager" in "CSSPrimitiveValue"
//   in "Counter" in "RGBColor" in "WebKitMediaKeys" in "srcdoc" in "webkitMediaStream"
//   in "webkitPersistentStorage" in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar"
//   in "webkitTemporaryStorage"
// decides on
//   fn118(v576)
//   h_s51_fn: fn11()
//   h_s51_fn: fn25()
//   h_s51_fn: v565 !== undefined
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//   h_s51_iframe: arg703 && "srcdoc" in iframe2
//   h_s51_iframe: !v826
//   h_s51_iframe: iframe2.contentWindow?.document?.readyState === "complete"
//   h_s51_iframe: !((parentElement2 = iframe2.parentNode) == null)
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//   fn25: fn9(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "RGBColor" in window, "WebKitMediaK…
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn11:419 fn118:6312 fn168:8902 fn25:712 fn9:252 v10:3418 v11:3419 v12:3420 v13:3421 v14:3422

// agent.clean.js:3705
function h_s51_fn() {
  return (function (arg438, arg439 = 4e3) {
    return h_s51_iframe((arg440, arg441) => {
      const v556 = arg441.document,
        body2 = v556.body,
        style4 = body2.style;
      style4.width = `${arg439}px`;
      style4.webkitTextSizeAdjust = "none";
      style4.setProperty("text-size-adjust", "none");
      if (fn11()) {
        body2.style.setProperty("zoom", "" + 1 / arg441.devicePixelRatio);
      } else {
        if (fn25()) {
          body2.style.setProperty("zoom", "reset");
        }
      }
      const v557 = v556.createElement("div");
      v557.textContent = [...Array((arg439 / 20) | 0)].map(() => "word").join(" ");
      body2.appendChild(v557);
      return arg438(v556, body2);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  })((arg442, arg443) => {
    const v558 = {},
      v559 = {};
    for (const v560 of Object.keys(h_s51_fn2)) {
      const [v561 = {}, v562 = "mmMwWLliI0fiflO&1"] = h_s51_fn2[v560],
        v563 = arg442.createElement("span");
      v563.textContent = v562;
      v563.style.whiteSpace = "nowrap";
      for (const v564 of Object.keys(v561)) {
        const v565 = v561[v564];
        if (v565 !== undefined) {
          v563.style[v564] = v565;
        }
      }
      v558[v560] = v563;
      arg443.append(arg442.createElement("br"), v563);
    }
    for (const v566 of Object.keys(h_s51_fn2)) {
      v559[v566] = v558[v566].getBoundingClientRect().width;
    }
    return v559;
  });
}

// agent.clean.js:3883
async function sig_s51_iframe() {
  try {
    return { s: 0, v: await h_s51_fn() };
  } catch (v576) {
    if (fn118(v576)) {
      return { s: -101, v: null };
    }
    throw v576;
  }
}

// agent.clean.js:5925
async function h_s51_iframe(arg702, arg703, arg704 = 50) {
  var parentElement2;
  for (; !document.body;) {
    await fn168(arg704);
  }
  const iframe2 = document.createElement("iframe");
  try {
    for (
      await new Promise((arg705, arg706) => {
        let v826 = false;
        const v827 = () => {
          v826 = true;
          arg705();
        };
        iframe2.onload = v827;
        iframe2.onerror = (arg707) => {
          v826 = true;
          arg706(arg707);
        };
        const { style: style5 } = iframe2;
        style5.setProperty("display", "block", "important");
        style5.position = "absolute";
        style5.top = "0";
        style5.left = "0";
        style5.visibility = "hidden";
        if (arg703 && ("srcdoc" in iframe2)) {
          iframe2.srcdoc = arg703;
        } else {
          iframe2.src = "about:blank";
        }
        document.body.appendChild(iframe2);
        const complete2 = () => {
          if (!v826) {
            if (iframe2.contentWindow?.document?.readyState === "complete") {
              v827();
            } else {
              setTimeout(complete2, 10);
            }
          }
        };
        complete2();
      });
      !iframe2.contentWindow?.document?.body;
    ) {
      await fn168(arg704);
    }
    return await arg702(iframe2, iframe2.contentWindow);
  } finally {
    if (!((parentElement2 = iframe2.parentNode) == null)) {
      parentElement2.removeChild(iframe2);
    }
  }
}

// agent.clean.js:6223
const h_s51_fn2 = {
  default: [],
  apple: [{ font: "-apple-system-body" }],
  serif: [{ fontFamily: "serif" }],
  sans: [{ fontFamily: "sans-serif" }],
  mono: [{ fontFamily: "monospace" }],
  min: [{ fontSize: "1px" }],
  system: [{ fontFamily: "system-ui" }],
};
