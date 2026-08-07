// s13 — sig_s13_openDatabase
// module cm, stage3, codes 0
//
// measures
//   window.openDatabase
// reported value
//   value
// decides on
//   h_s13_openDatabase: !!window.openDatabase
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2333
const h_s13_openDatabase = function () {
    return !!window.openDatabase;
  };

// agent.clean.js:6001
const sig_s13_openDatabase = fn85(h_s13_openDatabase);
