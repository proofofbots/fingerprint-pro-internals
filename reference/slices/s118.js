// s118 — sig_s118_plugins
// module cm, stage3, codes 0 -1
//
// measures
//   Plugin.prototype PluginArray.prototype navigator.plugins navigator
// engine
//   Object.getPrototypeOf() undefined
// reported value
//   null value
// decides on
//   navigator.plugins === undefined
//
// 0 owned helpers inlined below.

// agent.clean.js:347
function sig_s118_plugins() {
  if (navigator.plugins === undefined) {
    return { s: -1, v: null };
  }
  const { plugins: plugins } = navigator;
  let v86 = Object.getPrototypeOf(plugins) === PluginArray.prototype;
  for (let v87 = 0; v87 < plugins.length; v87++) {
    if (v86) {
      v86 = Object.getPrototypeOf(plugins[v87]) === Plugin.prototype;
    }
  }
  return { s: 0, v: v86 };
}
