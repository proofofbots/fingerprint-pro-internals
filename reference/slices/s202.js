// s202 — sig_s202_intl
// module cm, stage3, codes 0 -1 -2 -3
//
// measures
//   window.Intl window.Intl.DateTimeFormat
// reported value
//   null value
// probes
//   "number"
// compares against
//   !== "" == "number"
// decides on
//   fn155: typeof arg917 == "number"
//   h_s202_intl: !window.Intl
//   h_s202_intl: !dateTimeFormat2
//   h_s202_intl: !locale && locale !== ""
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn155:8228 fn40:1892 fn88:4712

// agent.clean.js:2581
const h_s202_intl = function () {
    if (!window.Intl) {
      return -1;
    }
    const dateTimeFormat2 = window.Intl.DateTimeFormat;
    if (!dateTimeFormat2) {
      return -2;
    }
    const locale = dateTimeFormat2().resolvedOptions().locale;
    if (!locale && locale !== "") {
      return -3;
    }
    return locale;
  };

// agent.clean.js:6081
const sig_s202_intl = fn155(h_s202_intl);
