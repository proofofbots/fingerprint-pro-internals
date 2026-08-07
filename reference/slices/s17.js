// s17 — sig_s17_canvas
// module cm, stage2, codes 0 -1 -2, value is a digest
//
// measures
//   document.createElement("canvas") TextEncoder
// engine
//   Math.PI String.fromCharCode() Uint8Array
// reported value
//   {...,geometry,text}
// probes
//   "#069" "#2ff" "#f2f" "#f60" "#f9c" "#ff2" "00000000" "11pt \"Times New Roman\"" "18pt Arial"
//   "2d" "alphabetic" "evenodd" "multiply" "rgba(102, 204, 0, 0.2)" "skipped" "unstable"
//   "unsupported"
// compares against
//   != "function" !== 0 < 32 == "function" === "unstable" === "unsupported" === 0 === 32 > 127
// decides on
//   geometry === "unsupported"
//   geometry === "unstable"
//   v828 === 0
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   h_s17_canvas: !!(!v525 || !canvas3.toDataURL)
//   h_s17_canvas: v526 !== v527
//   hash128: v422 > 127
//   hash128: ("00000000" + (v415[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (v415[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (v416[0] >>> 0).toString(16)).slic…
//   fn40: typeof arg286 != "function"
//   fn88: !!arg590 && typeof arg590.then == "function"
//   fn96: (arg641 %= 64) === 32
//   fn96: arg641 < 32
//   fn53: (arg404 %= 64) !== 0
//   fn53: arg404 < 32
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn166:8783 fn40:1892 fn53:3506 fn65:3849 fn88:4712 fn91:4777 fn93:5043 fn96:5398
//   hash128:2674 v3:446 v4:447 v5:461 v6:462 v7:463 v8:464 v9:465

// agent.clean.js:3423
function h_s17_canvas(arg390) {
  let v522,
    v523,
    v524 = false;
  const [canvas3, v525] = (function () {
    const canvas4 = document.createElement("canvas");
    canvas4.width = 1;
    canvas4.height = 1;
    return [canvas4, canvas4.getContext("2d")];
  })();
  if (!!(!v525 || !canvas3.toDataURL)) {
    v522 = v523 = "unsupported";
  } else {
    v524 = (v525.rect(0, 0, 10, 10), v525.rect(2, 2, 6, 6), !v525.isPointInPath(5, 5, "evenodd"));
    if (arg390) {
      v522 = v523 = "skipped";
    } else {
      [v522, v523] = (function (arg391, arg392) {
        !(function (arg393, arg394) {
          arg393.width = 240;
          arg393.height = 60;
          arg394.textBaseline = "alphabetic";
          arg394.fillStyle = "#f60";
          arg394.fillRect(100, 1, 62, 20);
          arg394.fillStyle = "#069";
          arg394.font = '11pt "Times New Roman"';
          const v529 = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835)}`;
          arg394.fillText(v529, 2, 15);
          arg394.fillStyle = "rgba(102, 204, 0, 0.2)";
          arg394.font = "18pt Arial";
          arg394.fillText(v529, 4, 45);
        })(arg391, arg392);
        const v526 = h_s17_fn(arg391),
          v527 = h_s17_fn(arg391);
        if (v526 !== v527) {
          return ["unstable", "unstable"];
        }
        !(function (arg395, arg396) {
          arg395.width = 122;
          arg395.height = 110;
          arg396.globalCompositeOperation = "multiply";
          for (const [v530, v531, v532] of [
            ["#f2f", 40, 40],
            ["#2ff", 80, 40],
            ["#ff2", 60, 80],
          ]) {
            arg396.fillStyle = v530;
            arg396.beginPath();
            arg396.arc(v531, v532, 40, 0, 2 * Math.PI, true);
            arg396.closePath();
            arg396.fill();
          }
          arg396.fillStyle = "#f9c";
          arg396.arc(60, 60, 60, 0, 2 * Math.PI, true);
          arg396.arc(60, 60, 20, 0, 2 * Math.PI, true);
          arg396.fill("evenodd");
        })(arg391, arg392);
        const v528 = h_s17_fn(arg391);
        return [v528, v526];
      })(canvas3, v525);
    }
  }
  return { winding: v524, geometry: v522, text: v523 };
}

// agent.clean.js:5835
function h_s17_fn(canvas5) {
  return canvas5.toDataURL();
}

// agent.clean.js:6005
const sig_s17_canvas = fn129(
    () => h_s17_canvas(),
    (arg713) => {
      const { geometry: geometry, text: text5 } = arg713,
        v828 = geometry === "unsupported" ? -1 : geometry === "unstable" ? -2 : 0;
      return {
        s: v828,
        v: {
          ...arg713,
          geometry: v828 === 0 ? hash128(geometry) : "",
          text: v828 === 0 ? hash128(text5) : "",
        },
      };
    },
  );
