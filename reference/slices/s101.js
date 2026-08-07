// s101 — sig_s101_userAgent
// module cm, stage3, codes 0
//
// measures
//   navigator.userAgent
// engine
//   Object.setPrototypeOf() JSON.stringify() Error
// reported value
//   null value
// probes
//   "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5053
const h_s101_userAgent = function () {
    return navigator.userAgent;
  };

// agent.clean.js:6082
const sig_s101_userAgent = fn123(h_s101_userAgent);
