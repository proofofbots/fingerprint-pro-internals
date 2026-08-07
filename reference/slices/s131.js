// s131 — sig_s131
// module cm, stage3, codes 0 -1 -2
//
// measures
//   document.documentElement document
// engine
//   Object.setPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: document.documentElement is undefined
//   -2: document.documentElement.getAttributeNames is not a function
// reported value
//   null value
// probes
//   "document.documentElement is undefined" "function" "number"
// compares against
//   != "function" != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s131_fn: document.documentElement === undefined
//   h_s131_fn: typeof documentElement.getAttributeNames != "function"
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5147
const h_s131_fn = function () {
    if (document.documentElement === undefined) {
      throw new botdError(-1, "document.documentElement is undefined");
    }
    const { documentElement: documentElement } = document;
    if (typeof documentElement.getAttributeNames != "function") {
      throw new botdError(-2, "document.documentElement.getAttributeNames is not a function");
    }
    return documentElement.getAttributeNames();
  };

// agent.clean.js:6089
const sig_s131 = fn123(h_s131_fn);
