// s117 — sig_s117_plugins
// module cm, stage3, codes 0 -1 -3
//
// measures
//   navigator.plugins.length navigator.plugins
// engine
//   Object.setPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: navigator.plugins is undefined
//   -3: navigator.plugins.length is undefined
// reported value
//   null value
// probes
//   "navigator.plugins is undefined" "navigator.plugins.length is undefined" "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s117_navigatorPluginsIsUndefined: navigator.plugins === undefined
//   h_s117_navigatorPluginsIsUndefined: navigator.plugins.length === undefined
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5080
const h_s117_navigatorPluginsIsUndefined = function () {
    if (navigator.plugins === undefined) {
      throw new botdError(-1, "navigator.plugins is undefined");
    }
    if (navigator.plugins.length === undefined) {
      throw new botdError(-3, "navigator.plugins.length is undefined");
    }
    return navigator.plugins.length;
  };

// agent.clean.js:6086
const sig_s117_plugins = fn123(h_s117_navigatorPluginsIsUndefined);
