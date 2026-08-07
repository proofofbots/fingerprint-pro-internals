// s29 — sig_s29
// module cm, stage2, codes 1 0 -1 -2 -101
//
// measures
//   DOMException TextEncoder clearTimeout() setTimeout()
// engine
//   TypeError ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Promise.race()
//   Uint32Array Uint8Array Promise
// reported value
//   null value
// probes
//   "3b947bb" "function" "quota"
// compares against
//   == "function" === "string"
// decides on
//   !webkitTemporaryStorage && !storage?.estimate
//   v464 !== undefined
//   v465 !== undefined
//   fn118(v466)
//   readVaultedProp: typeof v316 == "function"
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//   fn158: Date.now() < v1036
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
//
// 2 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn118:6312 fn158:8266 fn167:8899 fn48:3370
//   readVaultedProp:1674 resolveNameByHash:7015 stringToBytes:7901 v10:3418 v11:3419 v12:3420
//   v13:3421 v14:3422

// agent.clean.js:3054
async function sig_s29() {
  const storage = v30.storage,
    webkitTemporaryStorage = v30.webkitTemporaryStorage;
  if (!webkitTemporaryStorage && !storage?.estimate) {
    return { s: -1, v: null };
  }
  if (webkitTemporaryStorage) {
    const v464 = await Promise.race([
      fn167(250, undefined),
      new Promise((arg357) => {
        webkitTemporaryStorage.queryUsageAndQuota((arg358, arg359) => arg357(arg359));
      }),
    ]);
    if (v464 !== undefined) {
      return { s: 0, v: v464 };
    }
  }
  try {
    if (storage?.estimate) {
      const v465 = await Promise.race([
        fn167(250, undefined),
        storage.estimate().then((arg360) => readVaultedProp(arg360, "quota")),
      ]);
      if (v465 !== undefined) {
        return { s: 1, v: v465 };
      }
    }
    return { s: -2, v: null };
  } catch (v466) {
    if (fn118(v466)) {
      return { s: -101, v: null };
    }
    throw v466;
  }
}

// agent.clean.js:9034
const h_s29_fn = {};

// agent.clean.js:9035
const v30 = function () {
  return {
    key: "ex",
    ab: h_s29_fn,
    sources: { stage2: {}, stage3: {} },
    toRequest: () => ({ epv: "3b947bb" }),
  };
};
