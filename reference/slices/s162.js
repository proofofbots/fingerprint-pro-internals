// s162 — sig_s162_languages
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.languages
// engine
//   Object.getOwnPropertyDescriptor()
// reported value
//   call null
// probes
//   "length"
// decides on
//   h_s162_fn: v920 && v920.writable
//   h_s162_fn: v922 && (v922.writable || v922.configurable)
//
// 1 owned helper inlined below.

// agent.clean.js:4199
function sig_s162_languages() {
  const languages2 = navigator.languages;
  if (languages2) {
    return { s: 0, v: h_s162_fn(languages2) };
  }
  return { s: -1, v: null };
}

// agent.clean.js:6938
function h_s162_fn(arg793) {
  const v920 = Object.getOwnPropertyDescriptor(arg793, "length");
  if (v920 && v920.writable) {
    return true;
  }
  for (let v921 = 0; v921 < arg793.length; v921++) {
    const v922 = Object.getOwnPropertyDescriptor(arg793, v921);
    if (v922 && (v922.writable || v922.configurable)) {
      return true;
    }
  }
  return false;
}
