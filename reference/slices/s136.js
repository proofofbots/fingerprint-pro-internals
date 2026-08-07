// s136 — sig_s136_mimeTypes
// module cm, stage3, codes 0 -1
//
// measures
//   MimeType.prototype MimeTypeArray.prototype navigator.mimeTypes navigator
// engine
//   Object.setPrototypeOf() Object.getPrototypeOf() JSON.stringify() Error undefined
// status codes mean
//   -1: navigator.mimeTypes is undefined
// reported value
//   null value
// probes
//   "navigator.mimeTypes is undefined" "number"
// compares against
//   != "number" == "function"
// decides on
//   fn123: !(arg750 instanceof botdError)
//   fn123: typeof state != "number"
//   fn123: fn4(v876)
//   h_s136_mimeTypes: navigator.mimeTypes === undefined
//   fn4: !!arg7 && typeof arg7.then == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   botdError:4843 fn123:6460 fn4:60

// agent.clean.js:5116
const h_s136_mimeTypes = function () {
    if (navigator.mimeTypes === undefined) {
      throw new botdError(-1, "navigator.mimeTypes is undefined");
    }
    const { mimeTypes: mimeTypes } = navigator;
    let v717 = Object.getPrototypeOf(mimeTypes) === MimeTypeArray.prototype;
    for (let v718 = 0; v718 < mimeTypes.length; v718++) {
      if (v717) {
        v717 = Object.getPrototypeOf(mimeTypes[v718]) === MimeType.prototype;
      }
    }
    return v717;
  };

// agent.clean.js:6091
const sig_s136_mimeTypes = fn123(h_s136_mimeTypes);
