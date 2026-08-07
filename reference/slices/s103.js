// s103 — sig_s103_appVersion
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.appVersion
// engine
//   Object.setPrototypeOf() JSON.stringify() Error
// status codes mean
//   -1: navigator.appVersion is undefined
// reported value
//   null value
// probes
//   "navigator.appVersion is undefined" "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s103_appVersion: appVersion == null
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5056
const h_s103_appVersion = function () {
    const appVersion = navigator.appVersion;
    if (appVersion == null) {
      throw new botdError(-1, "navigator.appVersion is undefined");
    }
    return appVersion;
  };

// agent.clean.js:6083
const sig_s103_appVersion = fn123(h_s103_appVersion);
