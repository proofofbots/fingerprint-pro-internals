// s215 — sig_s215_publicKeyCredential
// module cm, stage2, codes 0 -1 -2
//
// measures
//   window.PublicKeyCredential window.PublicKeyCredential.getClientCapabilities
//   window.PublicKeyCredential.getClientCapabilities()
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden clearTimeout() setTimeout()
// engine
//   Object.entries() Promise.race() Promise Error undefined
// reported value
//   null value
// probes
//   "96375" "cc" "cg" "eai" "eaie" "ecb" "ecp" "ecpr" "ehs" "elb" "empl" "ep" "epy"
//   "extension:appid" "extension:appidExclude" "extension:credBlob" "extension:credProps"
//   "extension:credProtect" "extension:hmacSecret" "extension:largeBlob" "extension:minPinLength"
//   "extension:payment" "extension:prf" "function" "ht" "ppa" "ro" "saac" "scud" "suc" "uvpa"
// compares against
//   !== "function"
// decides on
//   fn142: !((v957 = arg822.cancel) == null)
//   h_s215_publicKeyCredential: !publicKeyCredential || typeof publicKeyCredential.getClientCapabilities !== "function"
//   h_s215_publicKeyCredential: v155 !== undefined
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn142:7227 fn158:8266 fn66:3854 visibilitychange:6423

// agent.clean.js:653
function sig_s215_publicKeyCredential() {
  return fn142(fn66(450, { s: -2, v: null }), h_s215_publicKeyCredential);
}

// agent.clean.js:820
async function h_s215_publicKeyCredential() {
  const publicKeyCredential = window.PublicKeyCredential;
  if (!publicKeyCredential || typeof publicKeyCredential.getClientCapabilities !== "function") {
    return { s: -1, v: null };
  }
  const v151 = await publicKeyCredential.getClientCapabilities(),
    v152 = {};
  for (const [v153, v154] of Object.entries(v151)) {
    const v155 = h_s215_fn[v153];
    if (v155 !== undefined) {
      v152[v155] = v154;
    }
  }
  return { s: 0, v: v152 };
}

// agent.clean.js:8156
const h_s215_fn = {
  conditionalCreate: "cc",
  conditionalGet: "cg",
  hybridTransport: "ht",
  passkeyPlatformAuthenticator: "ppa",
  userVerifyingPlatformAuthenticator: "uvpa",
  relatedOrigins: "ro",
  signalAllAcceptedCredentials: "saac",
  signalCurrentUserDetails: "scud",
  signalUnknownCredential: "suc",
  "extension:credProps": "ecp",
  "extension:prf": "ep",
  "extension:appid": "eai",
  "extension:appidExclude": "eaie",
  "extension:credBlob": "ecb",
  "extension:credProtect": "ecpr",
  "extension:hmacSecret": "ehs",
  "extension:largeBlob": "elb",
  "extension:minPinLength": "empl",
  "extension:payment": "epy",
};
