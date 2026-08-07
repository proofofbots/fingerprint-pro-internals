// s75 — sig_s75_canvas
// module cm, stage3, codes 0 -1 -2, value is a digest
//
// measures
//   document.createElement("canvas") navigator.vendor.indexOf("Apple") window.ApplePayError
//   window.Counter window.CSSPrimitiveValue window.RGBColor navigator.webkitPersistentStorage
//   navigator.webkitTemporaryStorage window.BatteryManager window.webkitMediaStream
//   window.webkitResolveLocalFileSystemURL window.webkitSpeechGrammar
// engine
//   Set Object.keys() Uint8Array undefined
// reported value
//   null {contextAttributes,parameters,parameters2,shaderPrecisions,extensions,extensionParameters,extensionParameters2,unsupportedExtensions}
// probes
//   "&" "," "00000000" "32926" "32928" "34047" "=" "FRAGMENT_SHADER" "HIGH_FLOAT" "HIGH_INT"
//   "LOW_FLOAT" "LOW_INT" "MEDIUM_FLOAT" "MEDIUM_INT" "VERTEX_SHADER" "WEBGL_debug_renderer_info"
//   "WEBGL_polygon_mode" "number" "string"
// compares against
//   != "function" !== "34047" !== 0 < 32 == "function" == "number" == "string"
//   === "WEBGL_debug_renderer_info" === "WEBGL_polygon_mode" === 32 > 127
// decides on
//   typeof arg717 == "number"
//   v834 !== undefined || v829.includes(v833)
//   v837 !== undefined && v836 !== "34047"
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   h_s75_fn4: !v392
//   h_s75_fn4: !fn62(v392)
//   h_s75_fn4: h_s75_fn.has(v403)
//   h_s75_fn4: v404 === "WEBGL_debug_renderer_info" && fn112() || v404 === "WEBGL_polygon_mode" && h_s75_fn7()
//   h_s75_fn4: h_s75_fn2.has(v407)
//   hash128: v422 > 127
//   hash128: ("00000000" + (v415[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (v415[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (v416[0] >>> 0).toString(16)).slic…
//   fn40: typeof arg286 != "function"
//   fn88: !!arg590 && typeof arg590.then == "function"
//   fn62: typeof arg468.getParameter == "function"
//   h_s75_fn7: fn11() || fn25()
//   fn96: (arg641 %= 64) === 32
//   fn96: arg641 < 32
//   fn53: (arg404 %= 64) !== 0
//   fn53: arg404 < 32
//   h_s75_fn5: typeof arg615 == "string" && !arg615.match(/[^A-Z0-9_x]/)
//
// 9 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn11:419 fn112:6114 fn129:6642 fn154:8197 fn166:8783 fn25:712 fn40:1892 fn46:3216 fn53:3506
//   fn62:3807 fn65:3849 fn88:4712 fn9:252 fn91:4777 fn93:5043 fn96:5398 hash128:2674 v3:446 v4:447
//   v5:461 v6:462 v7:463 v8:464 v9:465

// agent.clean.js:1874
const h_s75_fn = new Set([
    10752, 2849, 2884, 2885, 2886, 2928, 2929, 2930, 2931, 2932, 2960, 2961, 2962, 2963, 2964, 2965,
    2966, 2967, 2968, 2978, 3024, 3042, 3088, 3089, 3106, 3107, 32773, 32777, 32777, 32823, 32824,
    32936, 32937, 32938, 32939, 32968, 32969, 32970, 32971, 3317, 33170, 3333, 3379, 3386, 33901,
    33902, 34016, 34024, 34076, 3408, 3410, 3411, 3412, 3413, 3414, 3415, 34467, 34816, 34817,
    34818, 34819, 34877, 34921, 34930, 35660, 35661, 35724, 35738, 35739, 36003, 36004, 36005,
    36347, 36348, 36349, 37440, 37441, 37443, 7936, 7937, 7938,
  ]);

// agent.clean.js:1882
const h_s75_fn2 = new Set([34047, 35723, 36063, 34852, 34853, 34854, 34229, 36392, 36795, 38449]);

// agent.clean.js:1883
const h_s75_fn3 = ["FRAGMENT_SHADER", "VERTEX_SHADER"];

// agent.clean.js:1884
const h_s75_lowFLOATList = [
    "LOW_FLOAT",
    "MEDIUM_FLOAT",
    "HIGH_FLOAT",
    "LOW_INT",
    "MEDIUM_INT",
    "HIGH_INT",
  ];

// agent.clean.js:2613
const h_s75_fn4 = function ({ cache: arg306 }) {
    const v392 = fn154(arg306);
    if (!v392) {
      return -1;
    }
    if (!fn62(v392)) {
      return -2;
    }
    const v393 = v392.getSupportedExtensions(),
      v394 = v392.getContextAttributes(),
      v395 = [],
      v396 = [],
      v397 = [],
      v398 = [],
      v399 = [];
    if (v394) {
      for (const v401 of Object.keys(v394)) {
        v396.push(`${v401}=${v394[v401]}`);
      }
    }
    const v400 = h_s75_fn6(v392);
    for (const v402 of v400) {
      const v403 = v392[v402];
      v397.push(`${v402}=${v403}${h_s75_fn.has(v403) ? `=${v392.getParameter(v403)}` : ""}`);
    }
    if (v393) {
      for (const v404 of v393) {
        if (
          (v404 === "WEBGL_debug_renderer_info" && fn112()) ||
          (v404 === "WEBGL_polygon_mode" && h_s75_fn7())
        ) {
          continue;
        }
        const v405 = v392.getExtension(v404);
        if (v405) {
          for (const v406 of h_s75_fn6(v405)) {
            const v407 = v405[v406];
            v398.push(`${v406}=${v407}${h_s75_fn2.has(v407) ? `=${v392.getParameter(v407)}` : ""}`);
          }
        } else {
          v395.push(v404);
        }
      }
    }
    for (const v408 of h_s75_fn3) {
      for (const v409 of h_s75_lowFLOATList) {
        const v410 = h_s75_fn8(v392, v408, v409);
        v399.push(`${v408}.${v409}=${v410.join(",")}`);
      }
    }
    v398.sort();
    v397.sort();
    return {
      contextAttributes: v396,
      parameters: v397,
      shaderPrecisions: v399,
      extensions: v393,
      extensionParameters: v398,
      unsupportedExtensions: v395,
    };
  };

// agent.clean.js:4926
function h_s75_fn5(arg615) {
  return typeof arg615 == "string" && !arg615.match(/[^A-Z0-9_x]/);
}

// agent.clean.js:5249
function h_s75_fn6(arg637) {
  return Object.keys(arg637.__proto__).filter(h_s75_fn5);
}

// agent.clean.js:6050
const sig_s75_canvas = fn129(h_s75_fn4, (arg717) => {
    if (typeof arg717 == "number") {
      return { s: arg717, v: null };
    }
    const v829 = ["32926", "32928"],
      v830 = arg717.parameters.map((arg718) => {
        const [v832, v833, v834] = arg718.split("=", 3);
        return v834 !== undefined || v829.includes(v833)
          ? `${v832}(${v833})=null`
          : `${v832}=${v833}`;
      }),
      v831 = arg717.extensionParameters.map((arg719) => {
        const [v835, v836, v837] = arg719.split("=", 3);
        return v837 !== undefined && v836 !== "34047"
          ? `${v835}(${v836})=${v837}`
          : `${v835}=${v836}`;
      });
    return {
      s: 0,
      v: {
        contextAttributes: hash128(arg717.contextAttributes.join("&")),
        parameters: hash128(v830.join("&")),
        parameters2: hash128(arg717.parameters.join("&")),
        shaderPrecisions: hash128(arg717.shaderPrecisions.join("&")),
        extensions: hash128(arg717.extensions?.join(",") || ""),
        extensionParameters: hash128(v831.join(",")),
        extensionParameters2: hash128(arg717.extensionParameters.join("&")),
        unsupportedExtensions: arg717.unsupportedExtensions,
      },
    };
  });

// agent.clean.js:7393
function h_s75_fn7() {
  return fn11() || fn25();
}

// agent.clean.js:7897
function h_s75_fn8(arg894, arg895, arg896) {
  const v1011 = arg894.getShaderPrecisionFormat(arg894[arg895], arg894[arg896]);
  return v1011 ? [v1011.rangeMin, v1011.rangeMax, v1011.precision] : [];
}
