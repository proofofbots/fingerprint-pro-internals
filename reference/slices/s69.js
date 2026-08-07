// s69 — sig_s69_subtle
// module cm, request, codes 1 0
//
// measures
//   window.crypto.subtle navigator.msLaunchUri navigator.msSaveBlob window.MSStream
//   window.msWriteProfilerMark btoa() navigator.msPointerEnabled window.MSCSSMatrix
//   window.msIndexedDB window.msSetImmediate navigator.msMaxTouchPoints window
// engine
//   String.fromCharCode.apply() Math.min() Promise.all() Math.ceil() ArrayBuffer Uint8Array
//   undefined
// reported value
//   call value
// probes
//   "&" "-" "Error" "Permission denied" "SHA-256" "SecurityError" "TypeError" "_" "fragment"
//   "object" "path" "query" "stripped"
// compares against
//   != "object" !== "Error" !== "Permission denied" !== "TypeError" === "" === "SecurityError"
//   === "query" >= 3 >= 4 in "MSCSSMatrix" in "MSStream" in "msIndexedDB" in "msLaunchUri"
//   in "msMaxTouchPoints" in "msPointerEnabled" in "msSaveBlob" in "msSetImmediate"
//   in "msWriteProfilerMark"
// decides on
//   href === undefined || referrer === undefined
//   !parent || parent === v822
//   h_s69_fn2(v823)
//   h_s69_fn2: !arg660 || typeof arg660 != "object"
//   h_s69_fn2: !(!fn49() && !fn100() || v791.name !== "Error" && v791.name !== "TypeError" || v791.message !== "Permission denied") || v791.name === "SecurityError"
//   fn49: fn9(["MSCSSMatrix" in window, "msSetImmediate" in window, "msIndexedDB" in window, "msMaxTouchPoints" in navigator, "msPointerEnabled" in navigator]) >= 4
//   fn100: fn9(["msWriteProfilerMark" in window, "MSStream" in window, "msLaunchUri" in navigator, "msSaveBlob" in navigator]) >= 3 && !fn49()
//   h_s69_subtle: h_s69_fn3(arg610)
//   h_s69_subtle: arg610[arg611] && v687
//   h_s69_subtle: arg612 === ""
//   h_s69_subtle: arg611 === "query"
//   h_s69_fn3: !(arg678 && h_s69_pathList.some(arg679 => arg678[arg679]))
//
// 5 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 base64Encode:8766 fn100:5463 fn111:5918 fn20:578 fn30:1580 fn49:3373 fn9:252
//   stringToBytes:7901

// agent.clean.js:3487
const h_s69_pathList = ["path", "query", "fragment"];

// agent.clean.js:4854
async function h_s69_subtle(arg609, arg610) {
  if (h_s69_fn3(arg610)) {
    return arg609;
  }
  const v686 = fn20(arg609);
  await Promise.all(
    h_s69_pathList.map(async (arg611) => {
      const v687 = v686[arg611];
      var v688;
      if (arg610[arg611] && v687) {
        v686[arg611] = await (async function (arg612) {
          if (arg612 === "") {
            return "";
          }
          const subtle = window.crypto?.subtle;
          return subtle?.digest
            ? base64Encode(await subtle.digest("SHA-256", stringToBytes(arg612)))
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
            : "stripped";
        })(arg611 === "query" ? ((v688 = v687), v688.split("&").sort().join("&")) : v687);
      }
    }),
  );
  return fn30(v686);
}

// agent.clean.js:5420
async function h_s69_fn(arg642, arg643) {
  return Promise.all(
    arg642.map(async (arg644) => {
      const [v751, v752] = await Promise.all([
        h_s69_subtle(arg644.l, arg643),
        h_s69_subtle(arg644.f, arg643),
      ]);
      return { l: v751, f: v752 };
    }),
  );
}

// agent.clean.js:5657
function h_s69_fn2(arg660) {
  if (!arg660 || typeof arg660 != "object") {
    return false;
  }
  const v791 = arg660;
  return (
    !(
      (!fn49() && !fn100()) ||
      (v791.name !== "Error" && v791.name !== "TypeError") ||
      v791.message !== "Permission denied"
    ) || v791.name === "SecurityError"
  );
}

// agent.clean.js:5805
function h_s69_fn3(arg678) {
  return !(arg678 && h_s69_pathList.some((arg679) => arg678[arg679]));
}

// agent.clean.js:5886
async function sig_s69_subtle({ urlHashing: arg695 }) {
  const v820 = (function (arg696) {
    const v821 = [];
    let v822 = arg696;
    for (;;) {
      try {
        const href = v822.location?.href,
          referrer = v822.document?.referrer;
        if (href === undefined || referrer === undefined) {
          return { s: 1, v: v821 };
        }
        v821.push({ l: href, f: referrer });
        const parent = v822.parent;
        if (!parent || parent === v822) {
          return { s: 0, v: v821 };
        }
        v822 = parent;
      } catch (v823) {
        if (h_s69_fn2(v823)) {
          return { s: 1, v: v821 };
        }
        throw v823;
      }
    }
  })(window);
  return { ...v820, v: await h_s69_fn(v820.v, arg695) };
}
