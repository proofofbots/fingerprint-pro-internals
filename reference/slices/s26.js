// s26 — sig_s26_mediaDevices
// module cm, stage2, codes 0 -1 -2 -3 -4 -5
//
// measures
//   navigator.mediaDevices navigator.mediaDevices.enumerateDevices
//   navigator.mediaDevices.enumerateDevices() navigator.permissions.query()
//   navigator.permissions.query navigator.permissions navigator
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden TextEncoder clearTimeout()
// engine
//   Math.ceil() Object.assign() ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf()
//   Promise.race() Uint32Array Uint8Array
// reported value
//   call null
// probes
//   "96375" "camera" "denied" "function" "granted" "microphone" "prompt" "state"
// compares against
//   !== "granted" <= 0 == "function" === "denied" === "function" === "granted" === "prompt"
//   in "mediaDevices" in "permissions"
// decides on
//   !h_s26_mediaDevices() || !fn114()
//   v470 !== "granted"
//   v470 === "prompt"
//   fn142: !((v957 = arg822.cancel) == null)
//   fn157: v1032 = undefined, !v1034
//   fn157: v1033-- <= 0
//   fn157: !v1034
//   fn157: !(v1032 == null)
//   h_s26_mediaDevices: "mediaDevices" in navigator && navigator.mediaDevices !== undefined && typeof navigator.mediaDevices.enumerateDevices === "function"
//   fn114: "permissions" in navigator && readVaultedProp(navigator, "permissions") && typeof navigator.permissions.query === "function"
//   h_s26_fn: v898 === v899
//   h_s26_fn: v898 === "granted" || v899 === "granted"
//   h_s26_fn: v898 === "denied" || v899 === "denied"
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   readVaultedProp: typeof v316 == "function"
//
// 4 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn114:6193 fn142:7227 fn157:8239 fn158:8266 fn31:1619
//   fn48:3370 readVaultedProp:1674 resolveNameByHash:7015 stringToBytes:7901 visibilitychange:6423

// agent.clean.js:1573
function h_s26_mediaDevices() {
  return (
    "mediaDevices" in navigator &&
    navigator.mediaDevices !== undefined &&
    typeof navigator.mediaDevices.enumerateDevices === "function"
  );
}

// agent.clean.js:3106
function sig_s26_mediaDevices() {
  return fn142(fn157(300, 4, { s: -2, v: null }), async () => {
    if (!h_s26_mediaDevices() || !fn114()) {
      return { s: -1, v: null };
    }
    try {
      const v470 = await h_s26_fn();
      if (v470 !== "granted") {
        return { s: v470 === "prompt" ? -3 : -4, v: null };
      }
    } catch (v471) {
      return { s: -5, v: null };
    }
    return {
      s: 0,
      v: (await navigator.mediaDevices.enumerateDevices()).map((arg362) => ({
        d: arg362.deviceId,
        g: arg362.groupId,
        k: arg362.kind,
        l: arg362.label,
      })),
    };
  });
}

// agent.clean.js:4851
async function h_s26_permissionsQuery() {
  return readVaultedProp(await navigator.permissions.query({ name: "microphone" }), "state");
}

// agent.clean.js:5414
async function h_s26_permissionsQuery2() {
  return readVaultedProp(await navigator.permissions.query({ name: "camera" }), "state");
}

// agent.clean.js:6718
async function h_s26_fn() {
  const v898 = await h_s26_permissionsQuery2(),
    v899 = await h_s26_permissionsQuery();
  if (v898 === v899) {
    return v898;
  }
  if (v898 === "granted" || v899 === "granted") {
    return "granted";
  }
  if (v898 === "denied" || v899 === "denied") {
    return "denied";
  }
  return "prompt";
}
