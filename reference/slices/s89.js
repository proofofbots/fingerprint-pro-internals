// s89 — sig_s89_storage
// module cm, stage2, codes 0 -1 -2
//
// measures
//   navigator.storage navigator.storage.getDirectory navigator.storage.getDirectory()
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden clearTimeout() setTimeout()
// engine
//   String() Math.random() Math.ceil() Object.assign() Promise.race() Promise Error undefined
// reported value
//   null {re,cwe,clm,wlm}
// probes
//   ".agent" "96375" "createWritable is not a function" "function"
// compares against
//   !== "function" <= 0 === "function"
// decides on
//   !storage2?.getDirectory
//   v786 instanceof Error
//   await fn167(10), typeof v787.createWritable !== "function"
//   v789 instanceof Error
//   v785 && typeof v784.removeEntry === "function"
//   fn142: !((v957 = arg822.cancel) == null)
//   fn157: v1032 = undefined, !v1034
//   fn157: v1033-- <= 0
//   fn157: !v1034
//   fn157: !(v1032 == null)
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   fn158: Date.now() < v1036
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn142:7227 fn157:8239 fn158:8266 fn167:8899 fn31:1619 visibilitychange:6423

// agent.clean.js:5603
function sig_s89_storage() {
  return fn142(fn157(270, 9, { s: -2, v: null }), async () => {
    const storage2 = navigator.storage;
    if (!storage2?.getDirectory) {
      return { s: -1, v: null };
    }
    let v784, v785;
    try {
      v784 = await storage2.getDirectory();
    } catch (v786) {
      return {
        s: 0,
        v: { re: v786 instanceof Error ? v786.message : String(v786), cwe: "", clm: 0, wlm: 0 },
      };
    }
    try {
      v785 = Math.random().toString();
      const v787 = await v784.getFileHandle(v785, { create: true }),
        lastModified = (await v787.getFile()).lastModified;
      if ((await fn167(10), typeof v787.createWritable !== "function")) {
        return { s: 0, v: { re: "", cwe: "createWritable is not a function", clm: 0, wlm: 0 } };
      }
      const v788 = await v787.createWritable({ keepExistingData: true });
      try {
        await v788.write(".agent");
      } finally {
        await v788.close();
      }
      return {
        s: 0,
        v: { re: "", cwe: "", clm: lastModified, wlm: (await v787.getFile()).lastModified },
      };
    } catch (v789) {
      return {
        s: 0,
        v: { re: "", cwe: v789 instanceof Error ? v789.message : String(v789), clm: 0, wlm: 0 },
      };
    } finally {
      if (v785 && typeof v784.removeEntry === "function") {
        v784.removeEntry(v785).catch(() => {});
      }
    }
  });
}
