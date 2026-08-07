// s6 — sig_s6_availLeft
// module cm, stage2, codes 0
//
// measures
//   screen.availLeft screen.availTop document.exitFullscreen document.fullscreenElement
//   document.mozCancelFullScreen document.mozFullScreenElement document.msExitFullscreen
//   document.msFullscreenElement document.webkitExitFullscreen document.webkitFullscreenElement
//   screen.availHeight screen.availWidth
// engine
//   parseFloat() isNaN() undefined
// reported value
//   call
// compares against
//   != "function" < 4 == "function"
// decides on
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   h_s6_exitFullscreen: h_s6_fn2 !== undefined
//   h_s6_exitFullscreen: h_s6_fn3(v1150)
//   h_s6_exitFullscreen: h_s6_fn3(v1151)
//   h_s6_exitFullscreen: h_s6_fullscreenElement()
//   h_s6_exitFullscreen: !h_s6_fn3(v1151)
//   fn40: typeof arg286 != "function"
//   fn88: !!arg590 && typeof arg590.then == "function"
//   h_s6_fullscreenElement: document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || null
//
// 4 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn113:6135 fn129:6642 fn170:8960 fn40:1892 fn88:4712

// agent.clean.js:395
function h_s6_fullscreenElement() {
  return (
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    null
  );
}

// agent.clean.js:1733
function h_s6_availLeft() {
  return [
    fn170(fn113(screen.availTop), null),
    fn170(fn113(screen.width) - fn113(screen.availWidth) - fn170(fn113(screen.availLeft), 0), null),
    fn170(
      fn113(screen.height) - fn113(screen.availHeight) - fn170(fn113(screen.availTop), 0),
      null,
    ),
    fn170(fn113(screen.availLeft), null),
  ];
}

// agent.clean.js:4311
function h_s6_fn3(arg546) {
  for (let v626 = 0; v626 < 4; ++v626) {
    if (arg546[v626]) {
      return false;
    }
  }
  return true;
}

// agent.clean.js:5985
const sig_s6_availLeft = fn129(h_s6_exitFullscreen, (arg709) => ({
    s: 0,
    v: arg709.map((arg710) => arg710 ?? -1),
  }));

// agent.clean.js:8994
function h_s6_exitFullscreen() {
  (function () {
    if (h_s6_fn2 !== undefined) {
      return;
    }
    const v1149 = () => {
      const v1150 = h_s6_availLeft();
      if (h_s6_fn3(v1150)) {
        h_s6_fn2 = setTimeout(v1149, 2500);
      } else {
        h_s6_fn = v1150;
        h_s6_fn2 = undefined;
      }
    };
    v1149();
  })();
  return async () => {
    let v1151 = h_s6_availLeft();
    if (h_s6_fn3(v1151)) {
      if (h_s6_fn) {
        return [...h_s6_fn];
      }
      if (h_s6_fullscreenElement()) {
        await (function () {
          return (
            document.exitFullscreen ||
            document.msExitFullscreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen
          ).call(document);
        })();
        v1151 = h_s6_availLeft();
      }
    }
    if (!h_s6_fn3(v1151)) {
      h_s6_fn = v1151;
    }
    return v1151;
  };
}
