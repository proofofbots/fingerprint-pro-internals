// s144 — sig_s144_sharedArrayBuffer
// module cm, stage3, codes 0 -1 -2
//
// measures
//   window.SharedArrayBuffer
// engine
//   undefined
// reported value
//   null value
// probes
//   "function"
// compares against
//   != "function"
// decides on
//   typeof window.SharedArrayBuffer != "function"
//   buffer5.byteLength === undefined
//
// 0 owned helpers inlined below.

// agent.clean.js:6960
function sig_s144_sharedArrayBuffer() {
  if (typeof window.SharedArrayBuffer != "function") {
    return { s: -2, v: null };
  }
  const buffer5 = new window.SharedArrayBuffer(1);
  if (buffer5.byteLength === undefined) {
    return { s: -1, v: null };
  }
  return { s: 0, v: buffer5.byteLength };
}
