// s16 — sig_s16_plugins
// module cm, stage3, codes 0 -1
//
// measures
//   navigator.plugins.length navigator.plugins
// reported value
//   value
// decides on
//   fn159: arg928 == null
//   fn159: arg928 != null
//   h_s16_plugins: !plugins2
//   h_s16_plugins: !v373
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn159:8289 fn40:1892 fn88:4712

// agent.clean.js:2360
const h_s16_plugins = function () {
    const plugins2 = navigator.plugins;
    if (!plugins2) {
      return;
    }
    const v371 = [];
    for (let v372 = 0; v372 < plugins2.length; ++v372) {
      const v373 = plugins2[v372];
      if (!v373) {
        continue;
      }
      const v374 = [];
      for (let v375 = 0; v375 < v373.length; ++v375) {
        const v376 = v373[v375];
        v374.push({ type: v376.type, suffixes: v376.suffixes });
      }
      v371.push({ name: v373.name, description: v373.description, mimeTypes: v374 });
    }
    return v371;
  };

// agent.clean.js:6004
const sig_s16_plugins = fn159(h_s16_plugins, -1);
