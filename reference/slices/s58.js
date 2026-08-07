// s58 — sig_s58
// module cm, stage2, codes 0 -1
//
// measures
//   navigator
// engine
//   Promise.all() JSON.stringify() Error undefined
// reported value
//   null value {b,m,p,h,nah}
// probes
//   "NotAllowedError" "architecture" "bitness" "brands" "fullVersionList" "function" "mobile"
//   "model" "object" "platform" "platformVersion" "string" "uaFullVersion"
// compares against
//   != "object" == "function" == "string" === "NotAllowedError"
// decides on
//   !userAgentData || typeof userAgentData != "object"
//   typeof userAgentData.getHighEntropyValues == "function"
//   v955 !== undefined
//   typeof v955 == "string"
//   !(v956 instanceof Error && v956.name === "NotAllowedError")
//
// 1 owned helper inlined below.

// agent.clean.js:6364
const h_s58_brandsList = [
  "brands",
  "mobile",
  "platform",
  "platformVersion",
  "architecture",
  "bitness",
  "model",
  "uaFullVersion",
  "fullVersionList",
];

// agent.clean.js:7185
async function sig_s58() {
  const { userAgentData: userAgentData } = navigator;
  if (!userAgentData || typeof userAgentData != "object") {
    return { s: -1, v: null };
  }
  const v953 = {},
    v954 = [];
  if (typeof userAgentData.getHighEntropyValues == "function") {
    await Promise.all(
      h_s58_brandsList.map(async (arg817) => {
        try {
          const v955 = (await userAgentData.getHighEntropyValues([arg817]))[arg817];
          if (v955 !== undefined) {
            v953[arg817] = typeof v955 == "string" ? v955 : JSON.stringify(v955);
          }
        } catch (v956) {
          if (!(v956 instanceof Error && v956.name === "NotAllowedError")) {
            throw v956;
          }
          v954.push(arg817);
        }
      }),
    );
  }
  return {
    s: 0,
    v: {
      b: userAgentData.brands.map((arg818) => ({ b: arg818.brand, v: arg818.version })),
      m: userAgentData.mobile,
      p: userAgentData.platform ?? null,
      h: v953,
      nah: v954,
    },
  };
}
