// s42 — sig_s42_minMonochrome
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia("(min-monochrome: 0)") matchMedia(`(max-monochrome: ${})`)
// engine
//   Error
// reported value
//   value
// probes
//   "Too high value"
// compares against
//   <= 100
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2457
const h_s42_tooHighValue = function () {
    if (matchMedia("(min-monochrome: 0)").matches) {
      for (let v387 = 0; v387 <= 100; ++v387) {
        if (matchMedia(`(max-monochrome: ${v387})`).matches) {
          return v387;
        }
      }
      throw new Error("Too high value");
    }
  };

// agent.clean.js:6027
const sig_s42_minMonochrome = fn159(h_s42_tooHighValue, -1);
