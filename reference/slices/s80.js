// s80 — sig_s80_pdfViewerEnabled
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.pdfViewerEnabled
// reported value
//   value
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

// agent.clean.js:2550
const h_s80_pdfViewerEnabled = function () {
    return navigator.pdfViewerEnabled;
  };

// agent.clean.js:6040
const sig_s80_pdfViewerEnabled = fn159(h_s80_pdfViewerEnabled, -1);
