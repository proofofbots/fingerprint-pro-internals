// s211 — sig_s211_decodingInfo
// module cm, stage2, codes 0 -1
//
// measures
//   navigator.mediaCapabilities.decodingInfo() navigator.mediaCapabilities TextEncoder
// engine
//   SyntaxError Object.defineProperty() String.fromCharCode() Array Number() parseInt() String()
//   Promise.all()
// reported value
//   call null
// probes
//   "audio/mp4; codecs=mp4a.40.5" "audio/ogg; codecs=opus" "function" "message"
//   "video/mp4; codecs=av01.0.08M.08" "video/mp4; codecs=avc1.640028"
//   "video/mp4; codecs=avc1.640033" "video/mp4; codecs=hvc1.1.6.L93.B0"
//   "video/webm; codecs=vp09.00.10.08" "video/webm; codecs=vp8"
// compares against
//   == "function" === "string" in "mediaCapabilities"
// decides on
//   !("mediaCapabilities" in navigator)
//   v158 instanceof Error
//   readVaultedProp: typeof v316 == "function"
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
// the call graph walk hit its limit here, so the tests above are partial
//
// 7 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 decodeJsonBytes:5252 decryptSelfKeyedTable:112
//   deepClone:4738 fn48:3370 makeSelfKeyedVault:3791 readVaultedProp:1674 resolveNameByHash:7015
//   stringToBytes:7901

// agent.clean.js:838
async function sig_s211_decodingInfo() {
  if (!("mediaCapabilities" in navigator)) {
    return { s: -1, v: null };
  }
  return {
    s: 0,
    v: await Promise.all(
      h_s211_fn6.map(async (arg100) => {
        try {
          const v156 = await navigator.mediaCapabilities.decodingInfo(arg100);
          let v157 = 0;
          if (v156.supported) {
            v157 += 1;
          }
          if (v156.smooth) {
            v157 += 2;
          }
          if (v156.powerEfficient) {
            v157 += 4;
          }
          return v157;
        } catch (v158) {
          return v158 instanceof Error ? readVaultedProp(v158, "message") : String(v158);
        }
      }),
    ),
  };
}

// agent.clean.js:1602
function h_s211_fn(arg240, arg241 = h_s211_fn3, arg242 = null, arg243 = h_s211_fn5) {
  const v299 = {
    type: ((v300 = vault_nd), (v301 = 1), v300(v301)),
    video: { contentType: arg240, ...arg241 },
  };
  var v300, v301;
  if (arg242) {
    return { ...v299, audio: { contentType: arg242, ...arg243 } };
  }
  return v299;
}

// agent.clean.js:3358
function h_s211_fn2() {
  return [
    h_s211_fn("video/mp4; codecs=av01.0.08M.08"),
    h_s211_fn("video/webm; codecs=vp8"),
    h_s211_fn("video/webm; codecs=vp09.00.10.08"),
    h_s211_fn("video/mp4; codecs=hvc1.1.6.L93.B0"),
    h_s211_fn("video/mp4; codecs=avc1.640028"),
    h_s211_fn("video/mp4; codecs=avc1.640033", h_s211_fn4),
    h_s211_fn("video/webm; codecs=vp09.00.10.08", h_s211_fn3, "audio/ogg; codecs=opus"),
    h_s211_fn("video/mp4; codecs=avc1.640028", h_s211_fn3, "audio/mp4; codecs=mp4a.40.5"),
  ];
}

// agent.clean.js:8013
var vault_nd = makeSelfKeyedVault(
  [
    2438195688, 1087750592, 3820735174, 4289145014, 867804334, 3992103908, 3853460215, 631349426,
    4075924452, 2717284327, 564585452, 2762793387, 4105314727, 1927347170, 3988627958, 4256114423,
    1660543909, 2762274992, 3786108858, 603323124, 2728785321, 3886513574, 1895559408, 2365104616,
    3019796731, 698606572, 4004508834, 4238615970, 800514555, 2997089442, 2847291112, 922217954,
    2930111919, 4087560186, 603323053, 2728785321, 3786440102, 1895561456, 4059152374, 3019796731,
    698606572, 4004508834, 2867998904, 616211168, 4239651491, 2695182013, 1996222702, 4076461544,
    3019244283, 698606572, 4004508834, 2867998904, 616211168, 4239651491, 2695182004, 1893857262,
    3824722934, 4172309241, 1874502820, 4210352555, 4121502709, 2108072613, 4037273511, 2717021947,
    1659302640, 3030496234, 3198757297, 2075305647, 2779771622, 2897552304, 866169263, 2699214308,
    4272891040, 1957014767, 2929963517, 3802473905, 1957014781, 4059348903, 3185866235, 615558370,
    2693001391, 4171506085, 698460332, 2632114851,
  ],
  6,
);

// agent.clean.js:8029
const h_s211_fn3 = { width: 1920, height: 1080, bitrate: 5000000, framerate: 30 };

// agent.clean.js:8030
const h_s211_fn4 = { width: 3840, height: 2160, bitrate: 20000000, framerate: 60 };

// agent.clean.js:8031
const h_s211_fn5 = { channels: 2, bitrate: 132700, samplerate: 5200 };

// agent.clean.js:8042
const h_s211_fn6 = h_s211_fn2();
