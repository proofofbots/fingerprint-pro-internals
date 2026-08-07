// s104 — sig_s104_rtt
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.connection.rtt navigator.connection
// engine
//   Object.setPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: navigator.connection is undefined / navigator.connection.rtt is undefined
// reported value
//   null value
// probes
//   "navigator.connection is undefined" "navigator.connection.rtt is undefined" "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s104_rtt: navigator.connection === undefined
//   h_s104_rtt: navigator.connection.rtt === undefined
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5063
const h_s104_rtt = function () {
    if (navigator.connection === undefined) {
      throw new botdError(-1, "navigator.connection is undefined");
    }
    if (navigator.connection.rtt === undefined) {
      throw new botdError(-1, "navigator.connection.rtt is undefined");
    }
    return navigator.connection.rtt;
  };

// agent.clean.js:6084
const sig_s104_rtt = fn123(h_s104_rtt);
