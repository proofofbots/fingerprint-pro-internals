// s48 — sig_s48
// module cm, request, codes 0
//
// engine
//   Math.random()
// reported value
//   value
// compares against
//   === 0 >= 0
// decides on
//   arg97 * arg98
//   v149 % 4096 === 0
//
// 0 owned helpers inlined below.

// agent.clean.js:805
function sig_s48() {
  const v146 = function (arg97, arg98) {
      return arg97 * arg98;
    },
    v147 = [];
  let v148 = Math.random();
  for (let v149 = 24575; v149 >= 0; --v149) {
    if (v149 % 4096 === 0) {
      const v150 = Math.random();
      v147.push(v146(v148 - v150, 2 ** 31) | 0);
      v148 = v150;
    }
  }
  return { s: 0, v: v147 };
}
