// s167 — sig_s167_atob
// module cm, stage1, codes 0 -1 -2 -3 -4 -5 -6
//
// measures
//   atob() window.clearTimeout() window.setTimeout() navigator.brave
//   navigator.requestMediaKeySystemAccess() window.MediaKeys window.MSMediaKeys
//   document.featurePolicy btoa() navigator.mediaCapabilities.decodingInfo()
//   navigator.requestMediaKeySystemAccess navigator.mediaCapabilities
// engine
//   Math.max() Object.prototype.hasOwnProperty.call String.fromCharCode.apply() Math.min() RegExp
//   String() Math.ceil() Object.assign()
// reported value
//   call null
// probes
//   "..." "CreateCdmFunc not available" "cenc" "drm" "message" "name" "object"
// compares against
//   == "function" == "object" === -1 === 2 in "message" in "name"
// decides on
//   !arg623
//   fn150: readVaultedProp(arg898, "drm") || (arg898.drm = {})
//   h_s167_fn: v74.s === -1
//   readVaultedProp: typeof v316 == "function"
//   comWidevineAlpha: !fn147() || !fn39()
//   comWidevineAlpha: !(await fn130())
//   h_s167_fn3: v660 == null
//   h_s167_fn3: new RegExp("CreateCdmFunc not available").test(v661)
//   h_s167_fn5: v885 !== undefined
//   h_s167_fn5: !v886
//   h_s167_fn5: arg767.message.byteLength === 2
//   h_s167_fn6: arg842 && typeof arg842 == "object" && "message" in arg842
//   h_s167_fn6: "name" in arg842
//   h_s167_fn2: arg354.length <= arg355
//
// 7 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 base64Encode:8766 comWidevineAlpha:4347 crc32OfBytes:4943 fn102:5647
//   fn106:5738 fn11:419 fn12:432 fn130:6824 fn141:7220 fn147:7758 fn150:8043 fn23:692 fn39:1826
//   fn46:3216 fn48:3370 fn71:4148 fn9:252 fn98:5440 readVaultedProp:1674 resolveNameByHash:7015
//   stringToBytes:7901

// agent.clean.js:262
async function h_s167_fn(arg40) {
  const v72 = await comWidevineAlpha(arg40, false);
  switch (v72.s) {
    case -3:
      return { s: -4, v: null };
    case -1:
      return { s: -1, v: null };
    case -2:
      return { s: -3, v: null };
  }
  const v73 = base64Decode(
      "CAUSxwUKwQIIAxIQFwW5F8wSBIaLBjM6L3cqjBiCtIKSBSKOAjCCAQoCggEBAJntWzsyfateJO/DtiqVtZhSCtW8yzdQPgZFuBTYdrjfQFEEQa2M462xG7iMTnJaXkqeB5UpHVhYQCOn4a8OOKkSeTkwCGELbxWMh4x+Ib/7/up34QGeHleB6KRfRiY9FOYOgFioYHrc4E+shFexN6jWfM3rM3BdmDoh+07svUoQykdJDKR+ql1DghjduvHK3jOS8T1v+2RC/THhv0CwxgTRxLpMlSCkv5fuvWCSmvzu9Vu69WTi0Ods18Vcc6CCuZYSC4NZ7c4kcHCCaA1vZ8bYLErF8xNEkKdO7DevSy8BDFnoKEPiWC8La59dsPxebt9k+9MItHEbzxJQAZyfWgkCAwEAAToUbGljZW5zZS53aWRldmluZS5jb20SgAOuNHMUtag1KX8nE4j7e7jLUnfSSYI83dHaMLkzOVEes8y96gS5RLknwSE0bv296snUE5F+bsF2oQQ4RgpQO8GVK5uk5M4PxL/CCpgIqq9L/NGcHc/N9XTMrCjRtBBBbPneiAQwHL2zNMr80NQJeEI6ZC5UYT3wr8+WykqSSdhV5Cs6cD7xdn9qm9Nta/gr52u/DLpP3lnSq8x2/rZCR7hcQx+8pSJmthn8NpeVQ/ypy727+voOGlXnVaPHvOZV+WRvWCq5z3CqCLl5+Gf2Ogsrf9s2LFvE7NVV2FvKqcWTw4PIV9Sdqrd+QLeFHd/SSZiAjjWyWOddeOrAyhb3BHMEwg2T7eTo/xxvF+YkPj89qPwXCYcOxF+6gjomPwzvofcJOxkJkoMmMzcFBDopvab5tDQsyN9UPLGhGC98X/8z8QSQ+spbJTYLdgFenFoGq47gLwDS6NWYYQSqzE3Udf2W7pzk4ybyG4PHBYV3s4cyzdq8amvtE/sNSdOKReuHpfQ=",
    ),
    v74 = await h_s167_fn3(readVaultedProp(v72, "v"));
  if (v74.s === -1) {
    return { s: -6, v: null };
  }
  return { s: 0, v: base64Encode(await h_s167_fn5(readVaultedProp(v74, "v"), v73)) };
}

// agent.clean.js:3032
function h_s167_fn2(arg354, arg355, arg356 = "...") {
  return arg354.length <= arg355
    ? arg354
    : `${arg354.slice(0, Math.max(0, arg355 - arg356.length))}${arg356}`;
}

// agent.clean.js:4718
async function h_s167_fn3(arg593) {
  try {
    return { s: 0, v: await arg593.createMediaKeys() };
  } catch (v660) {
    const v661 = String((v660 == null ? undefined : readVaultedProp(v660, "message")) ?? v660);
    if (new RegExp("CreateCdmFunc not available").test(v661)) {
      return { s: -1, v: null };
    }
    throw v660;
  }
}

// agent.clean.js:4940
function h_s167_fn4(arg617) {
  return { e: h_s167_fn6(arg617) };
}

// agent.clean.js:5004
function sig_s167_atob({ cache: arg622, esc: arg623 = true }) {
  if (!arg623) {
    return { s: -5, v: null };
  }
  const v708 = { s: -2, v: null },
    v709 = fn150(arg622);
  h_s167_fn(v709)
    .then((arg624) => {
      fn98(v708, arg624);
    })
    .catch((arg625) => fn98(v708, h_s167_fn4(arg625)));
  return v708;
}

// agent.clean.js:6586
async function h_s167_fn5(arg763, arg764) {
  const v882 = arg763.createSession();
  try {
    const v883 = new Promise((arg765, arg766) => {
        let v885,
          v886 = false;
        const v887 = () => {
            v886 = true;
            if (v885 !== undefined) {
              window.clearTimeout(v885);
            }
            v882.removeEventListener("message", v888);
          },
          v888 = (arg767) => {
            if (!v886)
              if (arg767.message.byteLength === 2) {
                v882.update(arg764).catch((arg768) => {
                  v887();
                  arg766(arg768);
                });
              } else {
                v887();
                const uint8Array18 = new Uint8Array(arg767.message);
                arg765(uint8Array18);
              }
          };
        v882.addEventListener("message", v888);
        v885 = window.setTimeout(() => {
          if (!v886) {
            v887();
          }
        }, 5e3);
      }),
      v884 = base64Decode(
        "AAAARHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAACQIARIBMRoNd2lkZXZpbmVfdGVzdCIKMjAxNV90ZWFycyoCU0Q=",
      );
    await v882.generateRequest("cenc", v884);
    return await v883;
  } finally {
    try {
      await v882.close();
    } catch (v889) {}
  }
}

// agent.clean.js:7421
function h_s167_fn6(arg842) {
  let v973;
  try {
    if (arg842 && typeof arg842 == "object" && "message" in arg842) {
      v973 = String(arg842.message);
      if ("name" in arg842) {
        v973 = `${arg842.name}: ${v973}`;
      }
    } else {
      v973 = String(arg842);
    }
  } catch (v974) {
    v973 = `Code 3017: ${v974}`;
  }
  return h_s167_fn2(v973, 500);
}

// agent.clean.js:8890
function base64Decode(arg982) {
  const text8 = atob(arg982),
    v1128 = text8.length,
    uint8Array24 = new Uint8Array(v1128);
  for (let v1129 = 0; v1129 < v1128; v1129++) {
    uint8Array24[v1129] = text8.charCodeAt(v1129);
  }
  return uint8Array24;
}
