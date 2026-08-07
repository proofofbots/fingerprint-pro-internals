// s219 — sig_s219_webkitRTCPeerConnection
// module cm, stage1, codes 0 -3 -4 -6 -7 -8 -9 -10
//
// measures
//   window.webkitRTCPeerConnection crypto crypto.getRandomValues() window.RTCPeerConnection
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden clearTimeout() setTimeout()
// engine
//   Promise.resolve() RegExp Object.entries() Array.isArray() Math.random() Object.assign()
//   Object.getOwnPropertyNames() Object.getPrototypeOf()
// reported value
//   null {u,e,s}
// compares against
//   !== 0 === -4 === 0
// decides on
//   sig_s94_webkitRTCPeerConnection: v816 === 0 || v816 === -4
//   fn142: !((v957 = arg822.cancel) == null)
//   h_s94_fn8: v980 !== 0
//   h_s94_fn8: v983 !== 0
// the call graph walk hit its limit here, so the tests above are partial
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn142:7227 fn158:8266 fn20:578 fn30:1580 fn64:3826 fn66:3854 fn97:5431 h_s94_fn:284
//   h_s94_fn10:8780 h_s94_fn11:8876 h_s94_fn2:543 h_s94_fn3:1689 h_s94_fn4:3967 h_s94_fn5:4414
//   h_s94_fn6:4635 h_s94_fn7:4805 h_s94_fn8:7640 h_s94_fn9:7805 h_s94_notSupportedError:5701
//   readVaultedProp:1674 resolveNameByHash:7015 sig_s94_webkitRTCPeerConnection:5838
//   uint32Array:2786 visibilitychange:6423

// agent.clean.js:6933
function sig_s219_webkitRTCPeerConnection(arg792) {
  return arg792.ewr
    ? sig_s94_webkitRTCPeerConnection(arg792, 80)
    : Promise.resolve(() => ({ s: h_s219_fn, v: null }));
}

// agent.clean.js:7226
const h_s219_fn = -10;
