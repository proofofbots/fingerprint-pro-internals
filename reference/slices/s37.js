// s37 — sig_s37_colorGamut
// module cm, stage3, codes 0 -1
//
// measures
//   matchMedia(`(color-gamut: ${})`)
// reported value
//   value
// probes
//   "p3" "rec2020" "srgb"
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

// agent.clean.js:2438
const h_s37_colorGamut = function () {
    for (const v386 of ["rec2020", "p3", "srgb"]) {
      if (matchMedia(`(color-gamut: ${v386})`).matches) {
        return v386;
      }
    }
  };

// agent.clean.js:6024
const sig_s37_colorGamut = fn159(h_s37_colorGamut, -1);
