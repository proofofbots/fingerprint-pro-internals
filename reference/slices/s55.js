// s55 — sig_s55_localStorage
// module cm, request, codes 2 1 0 -1
//
// measures
//   document.cookie.split(";") localStorage localStorage.getItem.call() document.cookie DOMException
// engine
//   undefined
// reported value
//   null value
// probes
//   " "
// compares against
//   <= 1000 === " "
// decides on
//   v967 !== undefined && v968 !== undefined
//   v967 !== undefined
//   v968 !== undefined
//   h_s55_fn6: arg848 && arg848.length <= 1e3
//   h_s55_fn8: v1124.indexOf(v1123) === v1125
//   h_s55_getItemCall: localStorage?.getItem?.call(localStorage, arg385) ?? undefined
//   h_s55_cookie: h_s55_fn4(v317)
//   h_s55_fn4: !(arg471 instanceof DOMException)
//   h_s55_fn4: h_s55_fn.test(v572) || h_s55_fn2.test(v572) || h_s55_fn3.test(v572)
//
// 10 owned helpers inlined below.

// agent.clean.js:1678
function h_s55_cookie(arg254, arg255) {
  try {
    document.cookie;
  } catch (v317) {
    if (h_s55_fn4(v317)) {
      return arg255;
    }
    throw v317;
  }
  return arg254();
}

// agent.clean.js:3384
function h_s55_getItemCall(arg385) {
  try {
    return localStorage?.getItem?.call(localStorage, arg385) ?? undefined;
  } catch (v518) {}
}

// agent.clean.js:3778
const h_s55_fn = /The document is sandboxed and lacks the 'allow-same-origin' flag/;

// agent.clean.js:3779
const h_s55_fn2 = /The operation is insecure/;

// agent.clean.js:3780
const h_s55_fn3 = /Forbidden in a sandboxed document without the 'allow-same-origin' flag/;

// agent.clean.js:3836
function h_s55_fn4(arg471) {
  if (!(arg471 instanceof DOMException)) {
    return false;
  }
  const v572 = arg471.message;
  return h_s55_fn.test(v572) || h_s55_fn2.test(v572) || h_s55_fn3.test(v572);
}

// agent.clean.js:4299
function h_s55_fn5(arg544) {
  return `${arg544}t`;
}

// agent.clean.js:7325
function sig_s55_localStorage(arg833) {
  const v966 = h_s55_fn5(arg833);
  let [v967, v968] = h_s55_fn7(v966);
  v967 = h_s55_fn6(v967);
  v968 = h_s55_fn6(v968);
  if (v967 !== undefined && v968 !== undefined) {
    return { s: 0, v: v967 || v968 };
  }
  if (v967 !== undefined) {
    return { s: 1, v: v967 };
  }
  if (v968 !== undefined) {
    return { s: 2, v: v968 };
  }
  return { s: -1, v: null };
}

// agent.clean.js:7607
function h_s55_fn6(arg848) {
  return arg848 && arg848.length <= 1e3 ? arg848 : undefined;
}

// agent.clean.js:8194
function h_s55_fn7(arg913) {
  return [h_s55_fn8(arg913), h_s55_getItemCall(arg913)];
}

// agent.clean.js:8862
function h_s55_fn8(arg979) {
  return h_s55_cookie(() => {
    const v1123 = `${arg979}=`;
    for (const v1124 of document.cookie.split(";")) {
      let v1125 = 0;
      for (; v1124[v1125] === " " && v1125 < v1124.length;) {
        ++v1125;
      }
      if (v1124.indexOf(v1123) === v1125) {
        return v1124.slice(v1125 + v1123.length);
      }
    }
  }, undefined);
}
