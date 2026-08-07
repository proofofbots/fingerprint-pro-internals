// s123 — sig_s123
// module cm, stage3, codes 0 -1
//
// measures
//   navigator
// engine
//   Object.setPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: navigator.productSub is undefined
// reported value
//   null value
// probes
//   "navigator.productSub is undefined" "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s123_fn: productSub === undefined
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5099
const h_s123_fn = function () {
    const { productSub: productSub } = navigator;
    if (productSub === undefined) {
      throw new botdError(-1, "navigator.productSub is undefined");
    }
    return productSub;
  };

// agent.clean.js:6088
const sig_s123 = fn123(h_s123_fn);
