// s94 — sig_s94_webkitRTCPeerConnection
// module cm, stage1, codes 0 -3 -4 -6 -7 -8 -9
//
// measures
//   window.webkitRTCPeerConnection crypto crypto.getRandomValues() window.RTCPeerConnection
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden clearTimeout() setTimeout()
// engine
//   RegExp Object.entries() Array.isArray() Math.random() Object.assign()
//   Object.getOwnPropertyNames() Object.getPrototypeOf() Promise.race()
// reported value
//   null value {u,e,s}
// probes
//   "-" "/" "0123456789abcdef" "96375" ":" "Cannot create so many PeerConnections"
//   "NotSupportedError" "UnknownError" "admin" "closed" "createDataChannel" "errorCode"
//   "icecandidateerror" "message" "object" "tcp" "turn:" "url"
// compares against
//   !== 0 === "NotSupportedError" === "UnknownError" === "closed" === "object" === -4 === 0 === 400
//   in "errorCode" in "url"
// decides on
//   v816 === 0 || v816 === -4
//   fn142: !((v957 = arg822.cancel) == null)
//   h_s94_fn8: v980 !== 0
//   h_s94_fn8: v983 !== 0
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   h_s94_notSupportedError: !rtcPeerConnection
//   h_s94_notSupportedError: v799 instanceof Error
//   h_s94_notSupportedError: v799.name === "NotSupportedError"
//   h_s94_notSupportedError: h_s94_fn6(v799)
//   h_s94_fn5: fn183(arg566) && arg566.errorCode === 400 && arg566.url.includes(arg567)
//   h_s94_fn5: typeof arg568 === "object" && arg568 !== null && "errorCode" in arg568 && "url" in arg568
//   h_s94_fn5: v644 !== 0
//   h_s94_fn5: v645 !== 0
//   h_s94_fn5: fn182(arg569, arg565)
//   h_s94_fn5: v647.s !== 0
//   h_s94_fn5: !(arg564.connectionState === "closed")
//   h_s94_fn9: "turn:" + h_s94_fn7(arg874 ? "" + arg873 + ":" + arg874 + "" : arg873, { transport: "tcp" }) + ""
//   h_s94_fn6: arg574.name === "UnknownError" && new RegExp("Cannot create so many PeerConnections").test(readVaultedProp(arg574, "message"))
//   h_s94_fn11: !((v1126 = readVaultedProp(arg980, "createDataChannel")) == null)
//   h_s94_fn11: v1127 instanceof Error && v1127.name === "NotSupportedError"
//   h_s94_fn: !(v77 instanceof Error) || !new RegExp("\\bcreateOffer\\b.*(\\bcallback\\b.*\\bnot a function\\b|\\barguments required\\b.*\\bpresent\\b)", "i").test(readVaulte…
//   h_s94_fn: v76 === undefined
//   h_s94_fn7: Array.isArray(v683)
// the call graph walk hit its limit here, so the tests above are partial
//
// 12 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn111:5918 fn142:7227 fn158:8266 fn20:578 fn30:1580 fn48:3370 fn64:3826 fn66:3854 fn97:5431
//   readVaultedProp:1674 resolveNameByHash:7015 uint32Array:2786 visibilitychange:6423

// agent.clean.js:284
async function h_s94_fn(arg41, arg42) {
  let v75;
  try {
    v75 = arg41.createOffer(arg42);
  } catch (v77) {
    if (
      !(v77 instanceof Error) ||
      !new RegExp(
        "\\bcreateOffer\\b.*(\\bcallback\\b.*\\bnot a function\\b|\\barguments required\\b.*\\bpresent\\b)",
        "i",
      ).test(readVaultedProp(v77, "message"))
    ) {
      throw v77;
    }
    v75 = new Promise((arg43, arg44) => {
      arg41.createOffer(arg43, arg44, arg42);
    });
  }
  const v76 = await v75;
  if (v76 === undefined) {
    return { s: -8, v: null };
  }
  return { s: 0, v: v76 };
}

// agent.clean.js:543
function h_s94_fn2(arg64) {
  try {
    arg64.close();
  } catch (v105) {}
}

// agent.clean.js:1689
function h_s94_fn3(arg256, arg257, arg258) {
  const v318 = { credential: "admin" };
  v318.urls = h_s94_fn9(arg257, arg258);
  v318.username = arg256;
  const v319 = {};
  v319.iceServers = [v318];
  return v319;
}

// agent.clean.js:3967
function h_s94_fn4(arg488) {
  return arg488.split("/").map(encodeURIComponent).join("/");
}

// agent.clean.js:4414
function h_s94_fn5(arg564, arg565) {
  function fn182(arg566, arg567) {
    return fn183(arg566) && arg566.errorCode === 400 && arg566.url.includes(arg567);
  }
  function fn183(arg568) {
    return (
      typeof arg568 === "object" && arg568 !== null && "errorCode" in arg568 && "url" in arg568
    );
  }
  let v641 = null,
    v642 = false;
  async function fn184() {
    const v644 = h_s94_fn11(arg564);
    if (v644 !== 0) {
      return { s: v644, v: null };
    }
    const { s: v645, v: v646 } = await h_s94_fn(arg564);
    if (v645 !== 0) {
      return { s: v645, v: null };
    }
    return { s: 0, v: v646 };
  }
  if (arg565) {
    arg564.addEventListener("icecandidateerror", (arg569) => {
      if (fn182(arg569, arg565)) {
        if (v641) {
          v641();
          v641 = null;
          h_s94_fn2(arg564);
        } else {
          v642 = true;
        }
      }
    });
  }
  const v643 = {
    closeConnection: () => h_s94_fn2(arg564),
    createDataChannelAndOffer: async () => {
      const v647 = await fn184();
      if (v647.s !== 0) {
        h_s94_fn2(arg564);
      }
      return v647;
    },
  };
  return arg565
    ? Object.assign(v643, {
        closeConnectionWhenTurnEnds: function () {
          if (!(arg564.connectionState === "closed")) {
            if (v642) {
              h_s94_fn2(arg564);
            } else {
              v641 = visibilitychange(h_s94_fn2, 5e3, arg564);
            }
          }
        },
      })
    : v643;
}

// agent.clean.js:4635
function h_s94_fn6(arg574) {
  return (
    arg574.name === "UnknownError" &&
    new RegExp("Cannot create so many PeerConnections").test(readVaultedProp(arg574, "message"))
  );
}

// agent.clean.js:4805
function h_s94_fn7(arg605, arg606) {
  const v681 = fn20(arg605);
  let { query: query } = v681;
  for (const [v682, v683] of Object.entries(arg606)) {
    for (const v684 of Array.isArray(v683) ? v683 : [v683]) {
      query = `${query ? `${query}&` : ""}${v682}=${h_s94_fn4(v684)}`;
    }
  }
  v681.query = query;
  return fn30(v681);
}

// agent.clean.js:5701
function h_s94_notSupportedError(arg662, arg663) {
  const rtcPeerConnection = arg663
    ? window.RTCPeerConnection || window.webkitRTCPeerConnection
    : window.RTCPeerConnection;
  if (!rtcPeerConnection) {
    return { s: -3, v: null };
  }
  let v798;
  try {
    v798 = new rtcPeerConnection(arg662);
  } catch (v799) {
    if (v799 instanceof Error) {
      if (v799.name === "NotSupportedError") {
        return { s: -6, v: null };
      }
      if (h_s94_fn6(v799)) {
        return { s: -9, v: null };
      }
    }
    throw v799;
  }
  return { s: 0, v: v798 };
}

// agent.clean.js:5838
async function sig_s94_webkitRTCPeerConnection({ te: arg684 }, arg685) {
  const v813 = function (arg686, arg687, arg688) {
      return arg686(arg687, arg688);
    },
    v814 = h_s94_fn10(),
    v815 = await v813(fn142, fn66(300, -4), h_s94_fn8.bind(null, v814, arg684, arg685));
  return () => {
    const v816 = v815();
    if (v816 === 0 || v816 === -4) {
      return { s: v816, v: { u: v814, e: [], s: [] } };
    }
    return { s: v816, v: null };
  };
}

// agent.clean.js:7640
async function h_s94_fn8(arg855, arg856, arg857) {
  const v979 = h_s94_fn3(arg855, arg856, arg857),
    { s: v980, v: v981 } = h_s94_notSupportedError(v979, true);
  if (v980 !== 0) {
    return v980;
  }
  const v982 = h_s94_fn5(v981, arg856);
  try {
    const { s: v983, v: v984 } = await v982.createDataChannelAndOffer();
    return v983 !== 0 ? v983 : (await v981.setLocalDescription(v984), 0);
  } finally {
    v982.closeConnectionWhenTurnEnds();
  }
}

// agent.clean.js:7805
function h_s94_fn9(arg873, arg874) {
  return (
    "turn:" +
    h_s94_fn7(arg874 ? "" + arg873 + ":" + arg874 + "" : arg873, { transport: "tcp" }) +
    ""
  );
}

// agent.clean.js:8780
function h_s94_fn10() {
  return [8, 4, 4, 4, 12].map((arg971) => fn97(arg971, "0123456789abcdef")).join("-");
}

// agent.clean.js:8876
function h_s94_fn11(arg980, arg981) {
  var v1126;
  try {
    if (!((v1126 = readVaultedProp(arg980, "createDataChannel")) == null)) {
      v1126.call(arg980, arg981 || Math.random().toString());
    }
    return 0;
  } catch (v1127) {
    if (v1127 instanceof Error && v1127.name === "NotSupportedError") {
      return -7;
    }
    throw v1127;
  }
}
