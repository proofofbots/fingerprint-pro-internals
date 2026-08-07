// s133 — sig_s133_external
// module cm, stage3, codes 0 -1 -2
//
// measures
//   window.external window
// engine
//   Object.setPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: window.external is undefined
//   -2: window.external.toString is not a function
// reported value
//   null value
// probes
//   "function" "number" "window.external is undefined"
// compares against
//   != "function" != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s133_external: window.external === undefined
//   h_s133_external: typeof external.toString != "function"
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5106
const h_s133_external = function () {
    if (window.external === undefined) {
      throw new botdError(-1, "window.external is undefined");
    }
    const { external: external } = window;
    if (typeof external.toString != "function") {
      throw new botdError(-2, "window.external.toString is not a function");
    }
    return external.toString();
  };

// agent.clean.js:6090
const sig_s133_external = fn123(h_s133_external);
