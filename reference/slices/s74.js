// s74 — sig_s74_canvas
// module cm, stage3, codes 0 -1 -2
//
// measures
//   document.createElement("canvas") document.documentElement.style navigator.buildID
//   window.CanvasCaptureMediaStream window.CSSMozDocumentRule window.mozInnerScreenX
//   window.onmozfullscreenchange
// engine
//   undefined
// reported value
//   null value
// probes
//   "WEBGL_debug_renderer_info" "number"
// compares against
//   == "function" == "number"
// decides on
//   fn155: typeof arg917 == "number"
//   h_s74_webglDebugRendererInfo: !v390
//   h_s74_webglDebugRendererInfo: !fn62(v390)
//   h_s74_webglDebugRendererInfo: fn112()
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   fn62: typeof arg468.getParameter == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn112:6114 fn129:6642 fn154:8197 fn155:8228 fn40:1892 fn46:3216 fn62:3807 fn88:4712 fn9:252

// agent.clean.js:2595
const h_s74_webglDebugRendererInfo = function ({ cache: arg305 }) {
    const v390 = fn154(arg305);
    if (!v390) {
      return -1;
    }
    if (!fn62(v390)) {
      return -2;
    }
    const v391 = fn112() ? null : v390.getExtension("WEBGL_debug_renderer_info");
    return {
      version: v390.getParameter(v390.VERSION)?.toString() || "",
      vendor: v390.getParameter(v390.VENDOR)?.toString() || "",
      vendorUnmasked: v391 ? v390.getParameter(v391.UNMASKED_VENDOR_WEBGL)?.toString() : "",
      renderer: v390.getParameter(v390.RENDERER)?.toString() || "",
      rendererUnmasked: v391 ? v390.getParameter(v391.UNMASKED_RENDERER_WEBGL)?.toString() : "",
      shadingLanguageVersion: v390.getParameter(v390.SHADING_LANGUAGE_VERSION)?.toString() || "",
    };
  };

// agent.clean.js:6049
const sig_s74_canvas = fn155(h_s74_webglDebugRendererInfo);
