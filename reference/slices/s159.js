// s159 — sig_s159_function
// module cm, stage3, codes 0 -1 -2
//
// measures
//   window.Function window.Object navigator
// engine
//   Object.getOwnPropertyDescriptor() Object.getPrototypeOf()
// reported value
//   boolean null
// probes
//   "hardwareConcurrency"
// decides on
//   !v861 || !v861.get
//   !v863
//
// 0 owned helpers inlined below.

// agent.clean.js:6389
function sig_s159_function() {
  return (function (arg739, arg740) {
    const v861 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(arg739), arg740);
    if (!v861 || !v861.get) {
      return { s: -1, v: null };
    }
    const v862 = window.Function,
      object = window.Object;
    let v863 = false;
    try {
      v863 = delete window.Function && delete window.Object;
    } catch (v864) {
      v863 = false;
    }
    if (!v863) {
      fn185();
      return { s: -2, v: null };
    }
    try {
      v861.get.toString();
      return { s: 0, v: false };
    } catch (v865) {
      return { s: 0, v: true };
    } finally {
      fn185();
    }
    function fn185() {
      try {
        window.Function = v862;
        window.Object = object;
      } catch (v866) {}
    }
  })(navigator, "hardwareConcurrency");
}
