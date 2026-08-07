// s213 — sig_s213_getCurrentPosition
// module cm, stage1, codes 0 -1 -2 -3 -4 -5
//
// measures
//   navigator.geolocation.getCurrentPosition() navigator.permissions.query
//   navigator.permissions.query() navigator.permissions navigator.geolocation navigator TextEncoder
// engine
//   Object.assign() Object.keys() ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf()
//   Uint32Array Uint8Array Promise
// reported value
//   null {la,lo,al,ac,alac,h,s,t}
// probes
//   "PERMISSION_DENIED" "POSITION_UNAVAILABLE" "TIMEOUT" "coords" "denied" "function" "granted"
//   "prompt" "state"
// compares against
//   == "function" === "function" in "geolocation" in "permissions"
// decides on
//   !h_s213_geolocation() || !fn114()
//   h_s213_geolocation: "geolocation" in navigator && navigator.geolocation !== undefined
//   fn114: "permissions" in navigator && readVaultedProp(navigator, "permissions") && typeof navigator.permissions.query === "function"
//   h_s213_getCurrentPosition: !arg485
//   readVaultedProp: typeof v316 == "function"
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn114:6193 fn48:3370 fn98:5440 readVaultedProp:1674
//   resolveNameByHash:7015 stringToBytes:7901

// agent.clean.js:540
function h_s213_geolocation() {
  return "geolocation" in navigator && navigator.geolocation !== undefined;
}

// agent.clean.js:3893
async function h_s213_getCurrentPosition(arg482) {
  switch (arg482) {
    case "prompt":
      return { s: -2, v: null };
    case "denied":
      return { s: -3, v: null };
    case "granted":
      return new Promise((arg483) => {
        navigator.geolocation.getCurrentPosition(
          (arg484) =>
            arg483(
              (function (arg485) {
                if (!arg485) {
                  return { s: -5, v: null };
                }
                const {
                  accuracy: accuracy,
                  altitude: altitude,
                  altitudeAccuracy: altitudeAccuracy,
                  latitude: latitude,
                  longitude: longitude,
                  heading: heading,
                  speed: speed,
                } = readVaultedProp(arg485, "coords");
                return {
                  s: 0,
                  v: {
                    la: latitude,
                    lo: longitude,
                    al: altitude,
                    ac: accuracy,
                    alac: altitudeAccuracy,
                    h: heading,
                    s: speed,
                    t: arg485.timestamp,
                  },
                };
              })(arg484),
            ),
          (arg486) =>
            arg483(
              (function (arg487) {
                switch (((v577 = arg487), readVaultedProp(v577, "code"))) {
                  case readVaultedProp(arg487, "PERMISSION_DENIED"):
                    return { s: -3, v: null };
                  case readVaultedProp(arg487, "POSITION_UNAVAILABLE"):
                    return { s: -5, v: null };
                  case readVaultedProp(arg487, "TIMEOUT"):
                    return { s: -4, v: null };
                  default:
                    return { s: -5, v: null };
                }
                var v577;
              })(arg486),
            ),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
      });
    default:
      return { s: -5, v: null };
  }
}

// agent.clean.js:5446
async function h_s213_permissionsQuery() {
  return readVaultedProp(await navigator.permissions.query({ name: "geolocation" }), "state");
}

// agent.clean.js:8177
function sig_s213_getCurrentPosition() {
  if (!h_s213_geolocation() || !fn114()) {
    return { s: -1, v: null };
  }
  const v1027 = { s: -4, v: null };
  h_s213_permissionsQuery()
    .then((arg911) => h_s213_getCurrentPosition(arg911))
    .then((arg912) => {
      fn98(v1027, arg912);
    })
    .catch(() => fn98(v1027, { s: -5, v: null }));
  return v1027;
}
