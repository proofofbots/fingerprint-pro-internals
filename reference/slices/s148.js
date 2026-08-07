// s148 — sig_s148
// module cm, stage3, codes 0 -2
//
// engine
//   Function.prototype.bind Function.prototype.bind.toString Object.setPrototypeOf()
//   JSON.stringify() Error undefined
// status codes mean
//   -2: Function.prototype.bind is undefined
// reported value
//   null value
// probes
//   "Function.prototype.bind is undefined" "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s148_fn: Function.prototype.bind === undefined
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5157
const h_s148_fn = function () {
    if (Function.prototype.bind === undefined) {
      throw new botdError(-2, "Function.prototype.bind is undefined");
    }
    return Function.prototype.bind.toString();
  };

// agent.clean.js:6092
const sig_s148 = fn123(h_s148_fn);
