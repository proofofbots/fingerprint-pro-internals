#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REFERENCE, ARTIFACTS } from "./lib/paths.mjs";
import { loadCodec } from "./lib/codec.mjs";
import { readJson } from "./lib/payloads.mjs";
import { presentAs } from "./lib/origin.mjs";
import { getPath, setPath } from "./lib/address.mjs";
import { freshToken, installProxy, parseProxy, setSession } from "./lib/proxy.mjs";
import { fetchBrowserCache, readVerdict, sendPayload } from "./lib/tenant.mjs";

const OUT = join(ARTIFACTS, "identity");
const DEFAULT_ENDPOINT = "https://demo.fingerprint.com/DBqbMN7zXxwl4Ei8";
const DIGEST = /^[0-9a-f]{32}$/;
const args = process.argv.slice(2);
const has = (name) => args.includes(name);

const flag = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

if (has("--help") || !args.length) {
  console.log(`identity — what the tenant's visitor_id is a function of

  node tools/identity.mjs --payload <file> [options]

  --mode pairs|sticky   pairs (default): mint a device the tenant has never seen, send it, then send
                          it again with one field changed, and compare the two visitor ids. sticky:
                          send every arm against one established visitor, which measures how much
                          that visitor absorbs rather than what identity is made of
  --payload <file>      the base payload every arm derives a device from
  --proxy <spec>        socks5://host:port:user:pass
  --lifetime <min>      minutes to hold a pinned exit IP, default 40
  --arms <a,b,c>        only these arms
  --gap <ms>            wait between sends, default 1200
  --salt <text>         makes every minted device distinct from a previous run's, default the clock
  --endpoint <url>      default ${DEFAULT_ENDPOINT}
  --no-cache            empty s56 on every send. s56 is the tenant's own identity token and pins
                          the visitor id regardless of what the device reports, so any arm
                          measuring the fingerprint has to run with this on
  --list                print the arms and exit

In pairs mode an arm is two sends. The first mints a device by reseeding every digest and nudging
every measured float from the arm's own salt, so the tenant has never seen it and it shares no
history with any other arm. The second sends that same device with one field changed. Same visitor
id means the field is not part of identity, or is inside its matching tolerance; a different id means
the change broke the match.
`);
  process.exit(0);
}

const codec = await loadCodec({
  quiet: true,
});
const schemaPath = join(REFERENCE, "schema.json");

if (!existsSync(schemaPath)) throw new Error("schema.json missing — run npm run schema first");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const DIGEST_PATHS = [];
const MEASURED_PATHS = [];

for (const row of schema.keys) {
  for (const [leaf, meta] of Object.entries(row.shape)) {
    const suffix = leaf === "." ? "" : leaf;
    const path = row.kind === "signal" ? `${row.id}.v${suffix}` : `${row.id}${suffix}`;
    if (meta.digest) DIGEST_PATHS.push(path);
    else if (meta.scope === "measured") MEASURED_PATHS.push(path);
  }
}

const randomDigest = () => codec.hash128(`${Math.random()}:${Date.now()}`);

const uuid = () => {
  const hex = (length) =>
    Array.from(
      {
        length,
      },
      () => Math.floor(Math.random() * 16).toString(16),
    ).join("");
  return `${hex(8)}-${hex(4)}-${hex(4)}-${hex(4)}-${hex(12)}`;
};

function mintDevice(payload, salt) {
  for (const path of DIGEST_PATHS) {
    const before = getPath(payload, path);
    if (typeof before === "string" && DIGEST.test(before)) {
      setPath(payload, path, codec.hash128(`${salt}|${path}|${before}`));
    }
  }
  const spread = Number.parseInt(codec.hash128(salt).slice(0, 6), 16) / 0xffffff;
  for (const path of MEASURED_PATHS) {
    const before = getPath(payload, path);
    if (typeof before === "number")
      setPath(payload, path, Number((before + spread * 0.7 + 0.05).toFixed(12)));
  }
  for (const path of ["s216.v", "s94.v.u", "s219.v.u"]) {
    if (getPath(payload, path) !== undefined) setPath(payload, path, uuid());
  }
  return payload;
}

const ARMS = [
  {
    id: "none",
    why: "nothing changed — the pair that has to match",
    apply: () => {},
  },
  {
    id: "canvas",
    why: "s17 — both canvas digests",
    apply: (payload) => {
      setPath(payload, "s17.v.geometry", randomDigest());
      setPath(payload, "s17.v.text", randomDigest());
    },
  },
  {
    id: "canvas-text-only",
    why: "s17.text alone",
    apply: (payload) => setPath(payload, "s17.v.text", randomDigest()),
  },
  {
    id: "canvas2",
    why: "s76 — the other rendered-canvas digest",
    apply: (payload) => setPath(payload, "s76.v", randomDigest()),
  },
  {
    id: "webgl-digests",
    why: "s75 — all seven WebGL digests",
    apply: (payload) => {
      for (const key of [
        "contextAttributes",
        "parameters",
        "parameters2",
        "shaderPrecisions",
        "extensions",
        "extensionParameters",
        "extensionParameters2",
      ]) {
        if (getPath(payload, `s75.v.${key}`) !== undefined)
          setPath(payload, `s75.v.${key}`, randomDigest());
      }
    },
  },
  {
    id: "webgl-params-only",
    why: "s75.parameters alone",
    apply: (payload) => setPath(payload, "s75.v.parameters", randomDigest()),
  },
  {
    id: "webgl-strings",
    why: "s74 — the unmasked vendor and renderer strings",
    apply: (payload) => {
      setPath(payload, "s74.v.vendorUnmasked", "Google Inc. (Intel)");
      setPath(
        payload,
        "s74.v.rendererUnmasked",
        "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)",
      );
    },
  },
  {
    id: "audio-digest",
    why: "s46 — the hashed audio block",
    apply: (payload) => setPath(payload, "s46.v", randomDigest()),
  },
  {
    id: "audio-float",
    why: "s21 — published as raw_device_attributes.audio",
    apply: (payload) => setPath(payload, "s21.v", 35.74996626004577),
  },
  {
    id: "voices",
    why: "s52 — the speech-voice digest",
    apply: (payload) => setPath(payload, "s52.v", randomDigest()),
  },
  {
    id: "fonts",
    why: "s20 — the detected font list",
    apply: (payload) => setPath(payload, "s20.v", ["Calibri", "Cambria", "Consolas", "MS Gothic"]),
  },
  {
    id: "font-metrics",
    why: "s51 — the per-family text widths",
    apply: (payload) => {
      const metrics = getPath(payload, "s51.v");
      if (!metrics) return;
      for (const key of Object.keys(metrics))
        metrics[key] = Number((metrics[key] + 3.5).toFixed(6));
    },
  },
  {
    id: "screen",
    why: "s5 and s84 — the screen box",
    apply: (payload) => {
      setPath(payload, "s5.v", [2560, 1440]);
      setPath(payload, "s84.v.w", 2560);
      setPath(payload, "s84.v.h", 1440);
    },
  },
  {
    id: "color-depth",
    why: "s3",
    apply: (payload) => setPath(payload, "s3.v", getPath(payload, "s3.v") === 24 ? 30 : 24),
  },
  {
    id: "pixel-ratio",
    why: "s57",
    apply: (payload) => setPath(payload, "s57.v", 1.5),
  },
  {
    id: "cores",
    why: "s7 — hardwareConcurrency",
    apply: (payload) => setPath(payload, "s7.v", getPath(payload, "s7.v") === 16 ? 4 : 16),
  },
  {
    id: "memory",
    why: "s4 — deviceMemory",
    apply: (payload) => setPath(payload, "s4.v", getPath(payload, "s4.v") === 8 ? 4 : 8),
  },
  {
    id: "user-agent",
    why: "s101 and s103 — a different Chrome major",
    apply: (payload) => {
      const ua = String(getPath(payload, "s101.v")).replace(/Chrome\/\d+/, "Chrome/139");
      setPath(payload, "s101.v", ua);
      setPath(payload, "s103.v", ua.replace(/^Mozilla\//, ""));
    },
  },
  {
    id: "platform",
    why: "s15 — navigator.platform alone",
    apply: (payload) =>
      setPath(payload, "s15.v", getPath(payload, "s15.v") === "Win32" ? "MacIntel" : "Win32"),
  },
  {
    id: "languages",
    why: "s2, s82, s202",
    apply: (payload) => {
      setPath(payload, "s2.v", [["fr-FR", "fr"]]);
      setPath(payload, "s82.v", "fr-FR");
      setPath(payload, "s202.v", "fr-FR");
    },
  },
  {
    id: "timezone",
    why: "s9",
    apply: (payload) => setPath(payload, "s9.v", "America/Chicago"),
  },
  {
    id: "plugins",
    why: "s16 — the plugin and mime table",
    apply: (payload) => setPath(payload, "s16.v", []),
  },
  {
    id: "session-uuid",
    why: "s216, s94.u, s219.u",
    apply: (payload) => {
      for (const path of ["s216.v", "s94.v.u", "s219.v.u"]) {
        if (getPath(payload, path) !== undefined) setPath(payload, path, uuid());
      }
    },
  },
  {
    id: "browser-cache",
    why: "s56 — the blob the GET leg issues",
    apply: (payload) => setPath(payload, "s56.v", ""),
  },
  {
    id: "storage-quota",
    why: "s29",
    apply: (payload) => setPath(payload, "s29.v", 4294967296),
  },
  {
    id: "dom-rects",
    why: "s92 and s93 — the two getBoundingClientRect boxes",
    apply: (payload) => {
      for (const id of ["s92", "s93"]) {
        const box = getPath(payload, `${id}.v`);
        if (!box) continue;
        for (const key of ["x", "y", "left", "right", "bottom", "top", "width", "height"]) {
          if (typeof box[key] === "number") box[key] = Number((box[key] + 1.5).toFixed(6));
        }
      }
    },
  },
  {
    id: "keyboard",
    why: "s222 — the keyboard layout map",
    apply: (payload) => {
      const layout = getPath(payload, "s222.v");
      if (Array.isArray(layout)) setPath(payload, "s222.v", layout.slice(0, 5));
    },
  },
  {
    id: "battery",
    why: "s217",
    apply: (payload) => setPath(payload, "s217.v.l", 0.31),
  },
  {
    id: "webauthn",
    why: "s215 — the WebAuthn capability table",
    apply: (payload) => {
      const caps = getPath(payload, "s215.v");
      if (caps && typeof caps === "object") for (const key of Object.keys(caps)) caps[key] = false;
    },
  },
  {
    id: "ip",
    why: "nothing in the payload; the second send leaves from a different exit IP",
    ip: "fresh",
    apply: () => {},
  },
  {
    id: "all-coarse",
    why: "every coarse attribute at once, s56 left pinned",
    apply: (payload) => {
      applyCoarse(payload);
    },
  },
  {
    id: "all-coarse-nocache",
    why: "the same, with s56 emptied",
    apply: (payload) => {
      applyCoarse(payload);
      setPath(payload, "s56.v", "");
    },
  },
  {
    id: "all-coarse-soft",
    why: "every coarse attribute except s3, s4 and s46 — the three that moved identity on their own",
    apply: (payload) => {
      applyCoarse(payload, {
        keepKeys: true,
      });
    },
  },
  {
    id: "keys-only",
    why: "s3, s4 and s46 together, nothing else touched",
    apply: (payload) => {
      setPath(payload, "s3.v", getPath(payload, "s3.v") === 24 ? 30 : 24);
      setPath(payload, "s4.v", getPath(payload, "s4.v") === 8 ? 4 : 8);
      setPath(payload, "s46.v", randomDigest());
    },
  },
  {
    id: "colour-depth-30",
    why: "s3 to 30 specifically, which is what the macOS captures report",
    apply: (payload) => setPath(payload, "s3.v", 30),
  },
  {
    id: "memory-4",
    why: "s4 to 4 specifically",
    apply: (payload) => setPath(payload, "s4.v", 4),
  },
  {
    id: "cache-only",
    why: "s56 emptied and nothing else touched",
    apply: (payload) => setPath(payload, "s56.v", ""),
  },
];

function applyCoarse(payload, { keepKeys = false } = {}) {
  setPath(payload, "s5.v", [3440, 1440]);
  setPath(payload, "s84.v.w", 3440);
  setPath(payload, "s84.v.h", 1440);
  if (!keepKeys) setPath(payload, "s3.v", 30);
  setPath(payload, "s57.v", 1.25);
  setPath(payload, "s7.v", 24);
  if (!keepKeys) setPath(payload, "s4.v", 4);
  setPath(payload, "s9.v", "Asia/Tokyo");
  setPath(payload, "s2.v", [["ja-JP", "ja"]]);
  setPath(payload, "s82.v", "ja-JP");
  setPath(payload, "s202.v", "ja-JP");
  setPath(payload, "s20.v", ["MS Gothic", "Meiryo UI", "MS Mincho"]);
  setPath(payload, "s16.v", []);
  setPath(payload, "s74.v.vendorUnmasked", "Google Inc. (Intel)");
  setPath(
    payload,
    "s74.v.rendererUnmasked",
    "ANGLE (Intel, Intel(R) Iris Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
  );
  const ua = String(getPath(payload, "s101.v")).replace(/Chrome\/\d+/, "Chrome/133");
  setPath(payload, "s101.v", ua);
  setPath(payload, "s103.v", ua.replace(/^Mozilla\//, ""));
  const digests = keepKeys
    ? ["s17.v.geometry", "s17.v.text", "s76.v", "s52.v"]
    : ["s17.v.geometry", "s17.v.text", "s76.v", "s46.v", "s52.v"];
  for (const path of digests) {
    if (getPath(payload, path) !== undefined) setPath(payload, path, randomDigest());
  }
  for (const key of [
    "contextAttributes",
    "parameters",
    "parameters2",
    "shaderPrecisions",
    "extensions",
  ]) {
    if (getPath(payload, `s75.v.${key}`) !== undefined)
      setPath(payload, `s75.v.${key}`, randomDigest());
  }
}

const SOFT_STEPS = [
  [
    "canvas",
    (payload) => {
      setPath(payload, "s17.v.geometry", randomDigest());
      setPath(payload, "s17.v.text", randomDigest());
      setPath(payload, "s76.v", randomDigest());
    },
  ],
  [
    "webgl",
    (payload) => {
      for (const key of [
        "contextAttributes",
        "parameters",
        "parameters2",
        "shaderPrecisions",
        "extensions",
      ]) {
        if (getPath(payload, `s75.v.${key}`) !== undefined)
          setPath(payload, `s75.v.${key}`, randomDigest());
      }
    },
  ],
  [
    "screen",
    (payload) => {
      setPath(payload, "s5.v", [2560, 1440]);
      setPath(payload, "s84.v.w", 2560);
      setPath(payload, "s84.v.h", 1440);
    },
  ],
  [
    "ua",
    (payload) => {
      const ua = String(getPath(payload, "s101.v")).replace(/Chrome\/\d+/, "Chrome/139");
      setPath(payload, "s101.v", ua);
      setPath(payload, "s103.v", ua.replace(/^Mozilla\//, ""));
    },
  ],
  [
    "locale",
    (payload) => {
      setPath(payload, "s2.v", [["fr-FR", "fr"]]);
      setPath(payload, "s82.v", "fr-FR");
      setPath(payload, "s202.v", "fr-FR");
      setPath(payload, "s9.v", "America/Chicago");
    },
  ],
  [
    "fonts",
    (payload) => {
      setPath(payload, "s20.v", ["Calibri", "Cambria", "Consolas"]);
      const metrics = getPath(payload, "s51.v");
      if (metrics)
        for (const key of Object.keys(metrics))
          metrics[key] = Number((metrics[key] + 3.5).toFixed(6));
    },
  ],
  [
    "cores",
    (payload) => {
      setPath(payload, "s7.v", 24);
      setPath(payload, "s57.v", 1.5);
    },
  ],
  [
    "gpu-strings",
    (payload) => {
      setPath(payload, "s74.v.vendorUnmasked", "Google Inc. (Intel)");
      setPath(
        payload,
        "s74.v.rendererUnmasked",
        "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)",
      );
      setPath(payload, "s16.v", []);
    },
  ],
];

ARMS.push({
  id: "hw-pair",
  why: "s7 and s57 together and nothing else, the step that tipped soft-7 over",
  apply: (payload) => {
    setPath(payload, "s7.v", 24);
    setPath(payload, "s57.v", 1.5);
  },
});

for (let count = 1; count <= SOFT_STEPS.length; count++) {
  const steps = SOFT_STEPS.slice(0, count);
  ARMS.push({
    id: `soft-${count}`,
    why: `cumulative soft change: ${steps.map(([name]) => name).join(" + ")}`,
    apply: (payload) => {
      for (const [, step] of steps) step(payload);
    },
  });
}

const SCALAR_ARMS = [
  [
    "touch",
    "s19 — the touch support block",
    [
      ["s19.v.maxTouchPoints", 5],
      ["s19.v.touchEvent", true],
      ["s19.v.touchStart", true],
    ],
  ],
  [
    "storage-flags",
    "s10, s11, s12 — session, local and indexed storage",
    [
      ["s10.v", false],
      ["s11.v", false],
      ["s12.v", false],
    ],
  ],
  ["engine-names", "s28", [["s28.v", ["safari"]]]],
  ["product-sub", "s123", [["s123.v", "20100101"]]],
  ["color-gamut", "s37", [["s37.v", "rec2020"]]],
  ["architecture", "s81", [["s81.v", 255]]],
  ["wasm", "s22", [["s22.v", 19]]],
  ["s24", "s24 — a constant integer the collector reports", [["s24.v", 37]]],
  ["s117", "s117", [["s117.v", 9]]],
  ["s135", "s135", [["s135.v", 4]]],
  ["s152", "s152", [["s152.v", 0]]],
  ["s104", "s104", [["s104.v", 90]]],
  ["s214", "s214", [["s214.v", 2048]]],
  ["s66", "s66", [["s66.v", "2"]]],
  ["s205", "s205", [["s205.v", "d:"]]],
  ["system-font", "s206", [["s206.v", "system-ui"]]],
  [
    "window-size",
    "s150 — the outer and inner window boxes",
    [
      ["s150.v.outerWidth", 1280],
      ["s150.v.outerHeight", 800],
      ["s150.v.innerWidth", 1280],
      ["s150.v.innerHeight", 712],
    ],
  ],
  ["avail-insets", "s6 — the available-screen insets", [["s6.v", [40, 0, 0, 0]]]],
  [
    "uach",
    "s58 — the client-hint block",
    [
      ["s58.v.p", "macOS"],
      ["s58.v.h.platform", "macOS"],
      ["s58.v.h.architecture", "arm"],
    ],
  ],
  ["vendor", "s27 — navigator.vendor", [["s27.v", "Apple Computer, Inc."]]],
  ["oscpu", "s1 — navigator.oscpu", [["s1.v", "Intel Mac OS X 10.15"]]],
  [
    "webgl-limits",
    "s210.l — the WebGL limit vector",
    [
      [
        "s210.v.l",
        [
          8192,
          8192,
          1024,
          1024,
          4,
          500,
          10,
          8,
          32,
          16,
          10,
          8,
          12,
          32768,
          4294967292,
          128,
          128,
          8,
          4294967292,
          30,
          1024,
          null,
          28,
          8,
          128,
          16384,
          512,
          512,
          512,
          32,
          65535,
          24,
          10,
          10,
          8,
          8,
        ],
      ],
    ],
  ],
];

for (const [id, why, sets] of SCALAR_ARMS) {
  ARMS.push({
    id,
    why,
    apply: (payload) => {
      for (const [target, held] of sets) {
        if (getPath(payload, target) !== undefined) setPath(payload, target, held);
      }
    },
  });
}

if (has("--list")) {
  for (const arm of ARMS) console.log(`${arm.id.padEnd(18)} ${arm.why}`);
  process.exit(0);
}

const payloadPath = flag("--payload");

if (!payloadPath || !existsSync(payloadPath)) throw new Error("--payload <file> is required");

const base = readJson(payloadPath);
const endpoint = flag("--endpoint", DEFAULT_ENDPOINT);
const origin = new URL(endpoint).origin;
const apiKey = base.c;

presentAs(base, {
  origin,
  endpoint,
  apiKey,
});

const userAgent = getPath(base, "s101.v") ?? "Mozilla/5.0";
const gap = Number(flag("--gap", "1200"));
const lifetime = Number(flag("--lifetime", "40"));
const salt = flag("--salt", String(Date.now()));
const mode = flag("--mode", "pairs");

const wanted = (flag("--arms") ?? "")
  .split(",")
  .map((part) => part.trim())
  .filter(Boolean);

const proxySpec = flag("--proxy");
const proxyBase = proxySpec ? parseProxy(proxySpec) : null;
const heldToken = freshToken();
const rotateEveryIp = has("--rotate-ip");

function useProxy(kind) {
  if (!proxyBase) return null;
  const fresh = kind === "fresh" || rotateEveryIp;
  const proxy = fresh
    ? setSession(proxyBase, freshToken(), 1)
    : setSession(proxyBase, heldToken, lifetime);
  installProxy(proxy);
  return proxy;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const noCache = has("--no-cache");

const browserCache = noCache
  ? null
  : await fetchBrowserCache(codec, {
      endpoint,
      origin,
      userAgent,
      apiKey,
    });

const arms = ARMS.filter((arm) => !wanted.length || wanted.includes(arm.id));

console.log(`base      ${basename(payloadPath)}`);
console.log(`mode      ${mode}`);
console.log(`ua        ${userAgent}`);

console.log(
  `proxy     ${proxyBase ? `${proxyBase.host}:${proxyBase.port}, held ${heldToken}` : "none"}`,
);

console.log(
  `s56       ${noCache ? "emptied on every send" : browserCache ? `pinned, ${browserCache.length} chars` : "not refreshed"}`,
);

console.log(`salt      ${salt}`);

console.log(
  `plan      ${arms.length} arms, ${mode === "sticky" ? arms.length : arms.length * 2} sends\n`,
);

const results = [];

for (const [index, arm] of arms.entries()) {
  const device =
    mode === "sticky"
      ? JSON.parse(JSON.stringify(base))
      : mintDevice(JSON.parse(JSON.stringify(base)), `${salt}|${arm.id}`);
  if (browserCache) setPath(device, "s56.v", browserCache);
  if (noCache) setPath(device, "s56.v", "");
  let first;
  if (mode === "sticky") {
    first = {
      visitor: results[0]?.second.visitor ?? null,
      confidence: null,
      found: null,
      status: null,
      error: null,
    };
  } else {
    useProxy("hold");
    first = readVerdict(
      await sendPayload(codec, device, {
        endpoint,
        origin,
        userAgent,
      }),
    );
    await sleep(gap);
  }
  const mutated = JSON.parse(JSON.stringify(device));
  arm.apply(mutated, codec);
  const ua = arm.id === "user-agent" ? getPath(mutated, "s101.v") : userAgent;
  useProxy(arm.ip === "fresh" ? "fresh" : "hold");
  const second = readVerdict(
    await sendPayload(codec, mutated, {
      endpoint,
      origin,
      userAgent: ua,
    }),
  );
  const same = first.visitor && second.visitor ? first.visitor === second.visitor : null;
  results.push({
    arm: arm.id,
    why: arm.why,
    first,
    second,
    same,
  });
  console.log(
    `${String(index + 1).padStart(3)}/${arms.length} ${arm.id.padEnd(18)}` +
      `${String(first.visitor ?? first.error ?? "-").padEnd(22)}` +
      `${String(second.visitor ?? second.error ?? "-").padEnd(22)}` +
      `${same === null ? "?" : same ? "same" : "CHANGED"}`.padEnd(9) +
      `conf ${String(second.confidence ?? "-").padEnd(6)}${second.found ? "returning" : "new"}`,
  );
  if (index < arms.length - 1) await sleep(gap);
}

const firsts = results.map((row) => row.first.visitor).filter(Boolean);
const collisions = firsts.length - new Set(firsts).size;

mkdirSync(OUT, {
  recursive: true,
});

const report = {
  base: basename(payloadPath),
  mode,
  salt,
  endpoint,
  userAgent,
  collisions,
  results,
};

writeFileSync(join(OUT, `pairs-${salt}.json`), JSON.stringify(report, null, 2));

const changed = results.filter((row) => row.same === false);
const kept = results.filter((row) => row.same === true);

console.log(`\nminted devices    ${firsts.length}, ${collisions} collided`);

console.log(
  `identity moved    ${changed.length}: ${changed.map((row) => row.arm).join(", ") || "none"}`,
);

console.log(`identity held     ${kept.length}: ${kept.map((row) => row.arm).join(", ") || "none"}`);

console.log(`out               ${join(OUT, `pairs-${salt}.json`)}`);
