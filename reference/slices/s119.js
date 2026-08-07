// s119 — sig_s119
// module cm, stage3, codes 0 -3
//
// engine
//   Object.setPrototypeOf() JSON.stringify() Error
// status codes mean
//   -3: errorTrace signal unexpected behaviour
// reported value
//   null value
// probes
//   "errorTrace signal unexpected behaviour" "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s119_fn: v716 instanceof Error && v716.stack != null
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5089
const h_s119_fn = function () {
    try {
      null[0]();
    } catch (v716) {
      if (v716 instanceof Error && v716.stack != null) {
        return v716.stack.toString();
      }
    }
    throw new botdError(-3, "errorTrace signal unexpected behaviour");
  };

// agent.clean.js:6087
const sig_s119 = fn123(h_s119_fn);
