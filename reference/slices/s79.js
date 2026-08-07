// s79 — sig_s79_url
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   window.URL window.DataTransfer window.File window.RegExp document.createElement()
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden TextEncoder clearTimeout() setTimeout()
// engine
//   Promise.all() ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Promise.race()
//   Uint32Array Uint8Array Promise
// reported value
//   call null
// probes
//   "/" "96375" "?#" "TypeError" "default.ini" "etc/hosts" "filesystem:///" "lastModified"
//   "private/preboot/active" "var/db/MobileIdentityData/Version.plist" "webkitRelativePath"
// compares against
//   !== -1 !== 0 == "function" === "" === "TypeError" === "undefined" === 0 in "DataTransfer"
// decides on
//   fn99()
//   fn99: !("DataTransfer" in window)
//   fn99: v756 instanceof Error && v756.name === "TypeError"
//   fn142: !((v957 = arg822.cancel) == null)
//   h_s79_fn2: v1024 !== 0
//   h_s79_file: arg778 + arg779
//   h_s79_file: v903.hash?.substring(1) === ""
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   fn103: v797 instanceof Error && v797.name === "TypeError" && v797.message?.indexOf("must be an instance of File") !== -1
//   fn103: typeof v795.webkitEntries === "undefined"
//   fn103: v795.webkitEntries.length === 0
//   readVaultedProp: typeof v316 == "function"
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn103:5670 fn142:7227 fn158:8266 fn48:3370 fn66:3854
//   fn99:5449 readVaultedProp:1674 resolveNameByHash:7015 stringToBytes:7901 visibilitychange:6423

// agent.clean.js:3037
async function sig_s79_url() {
  const v463 = h_s79_fn();
  return v463
    ? fn99()
      ? await fn142(fn66(350, { s: -2, v: null }), async () => ({
          s: 0,
          v: await Promise.all(v463.map(h_s79_fn2)),
        }))
      : await fn142(fn66(350, { s: -1, v: null }), async () => ({
          s: -1,
          v: await Promise.all([h_s79_file(v463[0])]),
        }))
    : await fn142(fn66(350, { s: -3, v: null }), async () => ({
        s: -3,
        v: await Promise.all([h_s79_file()]),
      }));
}

// agent.clean.js:3867
function h_s79_fn() {
  return [
    "var/db/MobileIdentityData/Version.plist",
    "private/preboot/active",
    "etc/hosts",
    "var/mobile/Library/SpringBoard/TodayViewArchive.plist",
    "var/mobile/Library/Preferences/com.apple.corerecents.recentsd.plist",
  ];
}

// agent.clean.js:6732
function h_s79_file(arg777 = "default.ini") {
  const v900 = function (arg778, arg779) {
    return arg778 + arg779;
  };
  const [v901] = arg777.split("/").slice(-1);
  try {
    const v902 = new window.File([], arg777),
      v903 = new window.URL(
        v900(
          "filesystem:///" + (readVaultedProp(v902, "webkitRelativePath") || "") + "" + v901 + "?#",
          readVaultedProp(v902, "lastModified"),
        ) + "",
      );
    if (v903.hash?.substring(1) === "") {
      return { n: v901, l: -2 };
    }
    return { n: v901, l: fn48(v903.hash?.substring(1)) };
  } catch (v904) {
    return { n: v901, l: -1 };
  }
}

// agent.clean.js:8104
async function h_s79_fn2(arg906) {
  const [v1023, v1024, v1025] = fn103(arg906);
  if (v1024 !== 0) {
    return { n: v1023, l: v1024 };
  }
  return await new Promise((arg907) => {
    v1025.file(
      (arg908) => {
        arg907({ n: v1023, l: arg908.lastModified });
      },
      () => {
        arg907({ n: v1023, l: -1 });
      },
    );
  });
}
