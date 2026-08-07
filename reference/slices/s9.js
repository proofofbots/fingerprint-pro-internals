// s9 — sig_s9_date
// module cm, stage3, codes 0
//
// measures
//   Date window.Intl.DateTimeFormat
// engine
//   Math.max() parseFloat()
// reported value
//   value
// probes
//   "+"
// compares against
//   >= 0
// decides on
//   h_s9_dateTimeFormat: v366 >= 0
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn113:6135 fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2302
const h_s9_dateTimeFormat = function () {
    const dateTimeFormat = window.Intl?.DateTimeFormat;
    if (dateTimeFormat) {
      const timeZone = new dateTimeFormat().resolvedOptions().timeZone;
      if (timeZone) {
        return timeZone;
      }
    }
    const v366 = -(function () {
      const v367 = new Date().getFullYear();
      return Math.max(
        fn113(new Date(v367, 0, 1).getTimezoneOffset()),
        fn113(new Date(v367, 6, 1).getTimezoneOffset()),
      );
    })();
    return `UTC${v366 >= 0 ? "+" : ""}${v366}`;
  };

// agent.clean.js:5998
const sig_s9_date = fn85(h_s9_dateTimeFormat);
