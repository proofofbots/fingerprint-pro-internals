// s149 — sig_s149
// module cm, stage3, codes 0 -1 -3
//
// measures
//   window
// engine
//   Object.setPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: ${} undefined
//   -3: ${} not an object
// reported value
//   null value
// probes
//   "number" "object" "window.process is"
// compares against
//   != "number" != "object" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s149_fn: process === undefined
//   h_s149_fn: process && typeof process != "object"
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5163
const h_s149_fn = function () {
    const { process: process } = window;
    if (process === undefined) {
      throw new botdError(-1, `${"window.process is"} undefined`);
    }
    if (process && typeof process != "object") {
      throw new botdError(-3, `${"window.process is"} not an object`);
    }
    return process;
  };

// agent.clean.js:6093
const sig_s149 = fn123(h_s149_fn);
