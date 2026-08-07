// s212 — sig_s212_getComputedStyle
// module cm, stage3, codes 0
//
// measures
//   window.getComputedStyle() document.documentElement
// reported value
//   value
// probes
//   "--banner-height" "--border-dynamic" "--hydra-450" "--size-md" "--super-bg-color"
//   "--super-color"
// compares against
//   !== "" >= 4
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn36:1793

// agent.clean.js:4403
function sig_s212_getComputedStyle() {
  const v640 = window.getComputedStyle(document.documentElement);
  return { s: 0, v: fn36(h_s212_fn.map((arg559) => v640.getPropertyValue(arg559) !== "")) >= 4 };
}

// agent.clean.js:6127
const h_s212_fn = [
  "--hydra-450",
  "--super-color",
  "--super-bg-color",
  "--border-dynamic",
  "--size-md",
  "--banner-height",
];
