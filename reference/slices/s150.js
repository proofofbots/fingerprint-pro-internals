// s150 — sig_s150_innerHeight
// module cm, stage3, codes 0
//
// measures
//   window.innerHeight window.innerWidth window.outerHeight window.outerWidth
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

// agent.clean.js:5072
const h_s150_innerHeight = function () {
    return {
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  };

// agent.clean.js:6094
const sig_s150_innerHeight = fn123(h_s150_innerHeight);
