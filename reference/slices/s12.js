// s12 — sig_s12_indexedDB
// module cm, stage3, codes 0
//
// measures
//   window.indexedDB
// reported value
//   value
//
// 1 owned helper inlined below.

// agent.clean.js:3099
function sig_s12_indexedDB() {
  try {
    return h_s12_fn(!!window.indexedDB);
  } catch (v469) {
    return h_s12_fn(true);
  }
}

// agent.clean.js:7012
function h_s12_fn(arg799) {
  return { s: 0, v: arg799 };
}
