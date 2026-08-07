// s71 — sig_s71
// module cm, stage3, codes 0
//
// measures
//   window
// engine
//   Array
// reported value
//   {w,l,a}
//
// 0 owned helpers inlined below.

// agent.clean.js:3691
function sig_s71() {
  return (function ({ location: arg436, origin: arg437 }) {
    const origin = arg436.origin,
      ancestorOrigins = arg436.ancestorOrigins;
    let v554 = null;
    if (ancestorOrigins) {
      v554 = new Array(ancestorOrigins.length);
      for (let v555 = 0; v555 < ancestorOrigins.length; ++v555) {
        v554[v555] = ancestorOrigins[v555];
      }
    }
    return { s: 0, v: { w: arg437 ?? null, l: origin ?? null, a: v554 } };
  })(window);
}
