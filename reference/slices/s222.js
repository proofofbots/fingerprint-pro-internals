// s222 — sig_s222_keyboard
// module cm, stage2, codes 0 -1 -2 -101
//
// measures
//   navigator.keyboard navigator.keyboard.getLayoutMap navigator.keyboard.getLayoutMap()
//   window.DOMException DOMException
// engine
//   Array.from() TypeError
// reported value
//   call null
// probes
//   "function"
// compares against
//   !== "function"
// decides on
//   !keyboard || typeof keyboard.getLayoutMap !== "function"
//   fn118(v924)
//   h_s222_fn(v924)
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//   h_s222_fn: arg545 instanceof window.DOMException && arg545.message.includes("must be called from a top-level browsing context")
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 v10:3418 v11:3419 v12:3420 v13:3421 v14:3422

// agent.clean.js:4305
function h_s222_fn(arg545) {
  return (
    arg545 instanceof window.DOMException &&
    arg545.message.includes("must be called from a top-level browsing context")
  );
}

// agent.clean.js:6970
async function sig_s222_keyboard() {
  const keyboard = navigator.keyboard;
  if (!keyboard || typeof keyboard.getLayoutMap !== "function") {
    return { s: -1, v: null };
  }
  let v923;
  try {
    v923 = await keyboard.getLayoutMap();
  } catch (v924) {
    if (fn118(v924)) {
      return { s: -101, v: null };
    }
    if (h_s222_fn(v924)) {
      return { s: -2, v: null };
    }
    throw v924;
  }
  return { s: 0, v: Array.from(v923.entries()) };
}
