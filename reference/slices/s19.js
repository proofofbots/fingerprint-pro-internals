// s19 — sig_s19_touchEvent
// module cm, stage3, codes 0
//
// measures
//   document.createEvent("TouchEvent") window.ontouchstart navigator.maxTouchPoints
//   navigator.msMaxTouchPoints
// engine
//   parseInt() undefined
// reported value
//   value
// compares against
//   in "ontouchstart"
// decides on
//   h_s19_touchEvent: navigator.maxTouchPoints !== undefined
//   h_s19_touchEvent: navigator.msMaxTouchPoints !== undefined
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn57:3688 fn85:4641 fn88:4712

// agent.clean.js:2380
const h_s19_touchEvent = function () {
    let v377,
      v378 = 0;
    if (navigator.maxTouchPoints !== undefined) {
      v378 = fn57(navigator.maxTouchPoints);
    } else {
      if (navigator.msMaxTouchPoints !== undefined) {
        v378 = navigator.msMaxTouchPoints;
      }
    }
    try {
      document.createEvent("TouchEvent");
      v377 = true;
    } catch (v380) {
      v377 = false;
    }
    const v379 = "ontouchstart" in window;
    return { maxTouchPoints: v378, touchEvent: v377, touchStart: v379 };
  };

// agent.clean.js:6020
const sig_s19_touchEvent = fn85(h_s19_touchEvent);
