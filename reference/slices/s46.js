// s46 — sig_s46
// module cm, stage3, codes 0, value is a digest
//
// measures
//   TextEncoder
// engine
//   Object.keys() Uint8Array
// reported value
//   call
// probes
//   "," "00000000"
// compares against
//   != "function" !== 0 < 32 == "function" === 32 > 127
// decides on
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   hash128: v422 > 127
//   hash128: ("00000000" + (v415[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (v415[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (v416[0] >>> 0).toString(16)).slic…
//   fn40: typeof arg286 != "function"
//   fn88: !!arg590 && typeof arg590.then == "function"
//   fn96: (arg641 %= 64) === 32
//   fn96: arg641 < 32
//   fn53: (arg404 %= 64) !== 0
//   fn53: arg404 < 32
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn166:8783 fn40:1892 fn53:3506 fn65:3849 fn88:4712 fn91:4777 fn93:5043 fn96:5398
//   hash128:2674 v3:446 v4:447 v5:461 v6:462 v7:463 v8:464 v9:465

// agent.clean.js:1839
const h_s46_fn = Math;

// agent.clean.js:1840
const h_s46_fn2 = () => 0;

// agent.clean.js:2506
const h_s46_fn3 = function () {
    const acos = h_s46_fn.acos || h_s46_fn2,
      acosh = h_s46_fn.acosh || h_s46_fn2,
      asin = h_s46_fn.asin || h_s46_fn2,
      asinh = h_s46_fn.asinh || h_s46_fn2,
      atanh = h_s46_fn.atanh || h_s46_fn2,
      atan = h_s46_fn.atan || h_s46_fn2,
      sin = h_s46_fn.sin || h_s46_fn2,
      sinh = h_s46_fn.sinh || h_s46_fn2,
      cos = h_s46_fn.cos || h_s46_fn2,
      cosh = h_s46_fn.cosh || h_s46_fn2,
      tan = h_s46_fn.tan || h_s46_fn2,
      tanh = h_s46_fn.tanh || h_s46_fn2,
      exp = h_s46_fn.exp || h_s46_fn2,
      expm1 = h_s46_fn.expm1 || h_s46_fn2,
      log1p = h_s46_fn.log1p || h_s46_fn2;
    return {
      acos: acos(0.12312423423423424),
      acosh: acosh(1e308),
      acoshPf: ((v388 = 1e154), h_s46_fn.log(v388 + h_s46_fn.sqrt(v388 * v388 - 1))),
      asin: asin(0.12312423423423424),
      asinh: asinh(1),
      asinhPf: ((arg297) => h_s46_fn.log(arg297 + h_s46_fn.sqrt(arg297 * arg297 + 1)))(1),
      atanh: atanh(0.5),
      atanhPf: ((arg298) => h_s46_fn.log((1 + arg298) / (1 - arg298)) / 2)(0.5),
      atan: atan(0.5),
      sin: sin(-1e300),
      sinh: sinh(1),
      sinhPf: ((arg299) => h_s46_fn.exp(arg299) - 1 / h_s46_fn.exp(arg299) / 2)(1),
      cos: cos(10.000000000123),
      cosh: cosh(1),
      coshPf: ((arg300) => (h_s46_fn.exp(arg300) + 1 / h_s46_fn.exp(arg300)) / 2)(1),
      tan: tan(-1e300),
      tanh: tanh(1),
      tanhPf: ((arg301) => (h_s46_fn.exp(2 * arg301) - 1) / (h_s46_fn.exp(2 * arg301) + 1))(1),
      exp: exp(1),
      expm1: expm1(1),
      expm1Pf: ((arg302) => h_s46_fn.exp(arg302) - 1)(1),
      log1p: log1p(10),
      log1pPf: ((arg303) => h_s46_fn.log(1 + arg303))(10),
      powPI: ((arg304) => h_s46_fn.pow(h_s46_fn.PI, arg304))(-100),
    };
    var v388;
  };

// agent.clean.js:6032
const sig_s46 = fn129(h_s46_fn3, (arg714) => ({
    s: 0,
    v: hash128(
      Object.keys(arg714)
        .map((arg715) => `${arg715}=${arg714[arg715]}`)
        .join(","),
    ),
  }));
