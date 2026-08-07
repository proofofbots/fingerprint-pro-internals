// s5 — sig_s5_height
// module cm, stage3, codes 0
//
// measures
//   screen.height screen.width
// engine
//   isNaN() parseInt()
// reported value
//   call
// compares against
//   != "function" == "function" == "number"
// decides on
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   fn40: typeof arg286 != "function"
//   fn88: !!arg590 && typeof arg590.then == "function"
//   fn170: typeof arg996 == "number" && isNaN(arg996)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn170:8960 fn40:1892 fn57:3688 fn88:4712

// agent.clean.js:4189
function h_s5_height() {
  const v605 = (arg521) => fn170(fn57(arg521), null),
    v606 = [v605(screen.width), v605(screen.height)];
  v606.sort().reverse();
  return v606;
}

// agent.clean.js:5993
const sig_s5_height = fn129(h_s5_height, (arg711) => ({
    s: 0,
    v: arg711.map((arg712) => arg712 ?? -1),
  }));
