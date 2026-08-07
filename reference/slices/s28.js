// s28 — sig_s28
// module cm, stage3, codes 0
//
// measures
//   window
// reported value
//   value
// probes
//   "UCShellJava" "__crWeb" "__edgeTrackingPreventionStatistics" "__firefox__" "__gCrWeb" "__yb"
//   "__ybro" "chrome" "object" "oprt" "puffinDevice" "safari" "samsungAr" "ucweb" "webkit" "yandex"
// compares against
//   == "object"
// decides on
//   h_s28_fn: v383 && typeof v383 == "object"
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2402
const h_s28_fn = function () {
    const v381 = [];
    for (const v382 of [
      "chrome",
      "safari",
      "__crWeb",
      "__gCrWeb",
      "yandex",
      "__yb",
      "__ybro",
      "__firefox__",
      "__edgeTrackingPreventionStatistics",
      "webkit",
      "oprt",
      "samsungAr",
      "ucweb",
      "UCShellJava",
      "puffinDevice",
    ]) {
      const v383 = window[v382];
      if (v383 && typeof v383 == "object") {
        v381.push(v382);
      }
    }
    return v381.sort();
  };

// agent.clean.js:6022
const sig_s28 = fn85(h_s28_fn);
