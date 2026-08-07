// s145 — sig_s145
// module cm, stage3, codes 0 -1
//
// measures
//   navigator
// engine
//   String() Object.getOwnPropertyNames() Object.getPrototypeOf() Error undefined
// reported value
//   [] value
// probes
//   "connectionSpeed" "function" "hid" "webkitPersistentStorage" "xr"
// compares against
//   == "function"
// decides on
//   !webkitPersistentStorageList.includes(v296)
//   typeof v297 == "function" && v297.name !== undefined
//   v298 instanceof Error
//
// 0 owned helpers inlined below.

// agent.clean.js:1585
function sig_s145() {
  const webkitPersistentStorageList = ["webkitPersistentStorage", "connectionSpeed", "xr", "hid"],
    v295 = [];
  for (const v296 of Object.getOwnPropertyNames(Object.getPrototypeOf(navigator))) {
    if (!webkitPersistentStorageList.includes(v296)) {
      try {
        const v297 = navigator[v296];
        if (typeof v297 == "function" && v297.name !== undefined) {
          v295.push(v297.name);
        }
      } catch (v298) {
        return { s: -1, v: [v298 instanceof Error ? v298.message : String(v298)] };
      }
    }
  }
  return { s: 0, v: v295 };
}
