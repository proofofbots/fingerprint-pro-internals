// s214 — sig_s214_storageBuckets
// module cm, stage2, codes 0 -1 -2 -3 -101
//
// measures
//   navigator.storageBuckets navigator.storageBuckets.delete navigator.storageBuckets.delete()
//   navigator.storageBuckets.open navigator.storageBuckets.open() DOMException
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden TextEncoder clearTimeout() setTimeout()
// engine
//   Math.random() Math.ceil() Object.assign() TypeError ArrayBuffer Object.getOwnPropertyNames()
//   Object.getPrototypeOf() Promise.race()
// reported value
//   null value
// probes
//   "1" "96375" "error" "function" "number" "object"
// compares against
//   !== "function" !== "number" !== "object" <= 0 == "function" === "function"
// decides on
//   fn142: !((v957 = arg822.cancel) == null)
//   fn157: v1032 = undefined, !v1034
//   fn157: v1033-- <= 0
//   fn157: !v1034
//   fn157: !(v1032 == null)
//   h_s214_storageBuckets: !storageBuckets || typeof storageBuckets !== "object" || typeof storageBuckets.open !== "function"
//   h_s214_storageBuckets: fn118(v120)
//   h_s214_storageBuckets: indexedDB === undefined || typeof indexedDB.open !== "function" || typeof v119.estimate !== "function"
//   h_s214_storageBuckets: usage === undefined || typeof usage !== "number"
//   h_s214_storageBuckets: typeof storageBuckets.delete === "function"
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//   readVaultedProp: typeof v316 == "function"
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn118:6312 fn142:7227 fn157:8239 fn158:8266 fn31:1619
//   fn48:3370 readVaultedProp:1674 resolveNameByHash:7015 stringToBytes:7901 v10:3418 v11:3419
//   v12:3420 v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:597
async function h_s214_storageBuckets() {
  const storageBuckets = navigator.storageBuckets;
  if (
    !storageBuckets ||
    typeof storageBuckets !== "object" ||
    typeof storageBuckets.open !== "function"
  ) {
    return { s: -1, v: null };
  }
  const v118 = Math.random().toString().split(".")[1];
  let v119;
  try {
    v119 = await storageBuckets.open(v118);
  } catch (v120) {
    if (fn118(v120)) {
      return { s: -101, v: null };
    }
    throw v120;
  }
  const indexedDB = v119.indexedDB;
  if (
    indexedDB === undefined ||
    typeof indexedDB.open !== "function" ||
    typeof v119.estimate !== "function"
  ) {
    return { s: -1, v: null };
  }
  try {
    const v121 = await new Promise((arg70, arg71) => {
        try {
          const v122 = indexedDB.open("1");
          v122.onupgradeneeded = () => {
            v122.result.createObjectStore("s", { keyPath: "k" });
          };
          v122.onsuccess = async () => {
            v122.result.close();
            arg70(await v119.estimate());
          };
          v122.onerror = () => {
            arg71(readVaultedProp(v122, "error"));
          };
        } catch (v123) {
          arg71(v123);
        }
      }),
      usage = v121?.usage;
    if (usage === undefined || typeof usage !== "number") {
      return { s: -3, v: null };
    }
    return { s: 0, v: usage };
  } finally {
    if (typeof storageBuckets.delete === "function") {
      storageBuckets.delete(v118).catch(() => {});
    }
  }
}

// agent.clean.js:4302
function sig_s214_storageBuckets() {
  return fn142(fn157(400, 4, { s: -2, v: null }), h_s214_storageBuckets);
}
