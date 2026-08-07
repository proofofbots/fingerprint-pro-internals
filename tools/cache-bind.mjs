#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { ARTIFACTS } from "./lib/paths.mjs";
import { loadCodec } from "./lib/codec.mjs";
import { readJson } from "./lib/payloads.mjs";
import { presentAs } from "./lib/origin.mjs";
import { getPath, setPath } from "./lib/address.mjs";
import { freshToken, installProxy, parseProxy, setSession } from "./lib/proxy.mjs";
import { fetchBrowserCache, readVerdict, sendPayload } from "./lib/tenant.mjs";

const OUT = join(ARTIFACTS, "identity");
const DEFAULT_ENDPOINT = "https://demo.fingerprint.com/DBqbMN7zXxwl4Ei8";
const args = process.argv.slice(2);
const has = (name) => args.includes(name);

const flag = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

if (has("--help") || !args.length) {
  console.log(`cache-bind — what the s56 blob does to identity

  node tools/cache-bind.mjs --a <payloadA.json> --b <payloadB.json> [options]

  --a <file>       one device
  --b <file>       a second device that must be a different one — a different OS is the clearest
  --proxy <spec>   socks5://host:port:user:pass, rotated per send
  --endpoint <url> default ${DEFAULT_ENDPOINT}
  --gap <ms>       default 1200

s56 is a blob the tenant issues over the agent's GET leg and the client replays on every POST. The
run answers three things in order: whether a device with an empty s56 is identified from its
fingerprint alone, whether a fresh blob binds to the first device that presents it, and whether that
bound blob then carries the same visitor_id onto a completely different device.
`);
  process.exit(0);
}

const pathA = flag("--a");
const pathB = flag("--b");

if (!pathA || !existsSync(pathA)) throw new Error("--a <payload.json> is required");
if (!pathB || !existsSync(pathB)) throw new Error("--b <payload.json> is required");

const codec = await loadCodec({
  quiet: true,
});
const endpoint = flag("--endpoint", DEFAULT_ENDPOINT);
const origin = new URL(endpoint).origin;
const gap = Number(flag("--gap", "1200"));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const proxySpec = flag("--proxy");
const proxyBase = proxySpec ? parseProxy(proxySpec) : null;

const rotate = () => {
  if (!proxyBase) return;
  installProxy(setSession(proxyBase, freshToken(), 1));
};

function mint(payload, salt) {
  for (const [path, value] of Object.entries({
    "s17.v.geometry": null,
    "s17.v.text": null,
    "s76.v": null,
    "s46.v": null,
    "s52.v": null,
    "s75.v.parameters": null,
    "s75.v.extensions": null,
  })) {
    void value;
    const before = getPath(payload, path);
    if (typeof before === "string" && /^[0-9a-f]{32}$/.test(before)) {
      setPath(payload, path, codec.hash128(`${salt}|${path}|${before}`));
    }
  }
  return payload;
}

function load(path, salt) {
  const payload = readJson(path);
  presentAs(payload, {
    origin,
    endpoint,
    apiKey: payload.c,
  });
  mint(payload, salt);
  setPath(payload, "s56.v", "");
  return payload;
}

const salt = String(Date.now());
const deviceA = load(pathA, `${salt}|a`);
const deviceB = load(pathB, `${salt}|b`);
const uaA = getPath(deviceA, "s101.v") ?? "Mozilla/5.0";
const uaB = getPath(deviceB, "s101.v") ?? "Mozilla/5.0";
const steps = [];

async function step(label, payload, userAgent, note) {
  rotate();
  const outcome = readVerdict(
    await sendPayload(codec, payload, {
      endpoint,
      origin,
      userAgent,
    }),
  );
  steps.push({
    label,
    note,
    ...outcome,
  });
  console.log(
    `${label.padEnd(26)}${String(outcome.visitor ?? outcome.error ?? "-").padEnd(22)}` +
      `conf ${String(outcome.confidence ?? "-").padEnd(6)}${outcome.found ? "returning" : "new"}   ${note}`,
  );
  await sleep(gap);
  return outcome;
}

console.log(`a         ${basename(pathA)}  ${uaA.slice(0, 48)}`);
console.log(`b         ${basename(pathB)}  ${uaB.slice(0, 48)}`);

console.log(
  `proxy     ${proxyBase ? `${proxyBase.host}:${proxyBase.port}, rotated per send` : "none"}\n`,
);

const a1 = await step("A, no cache", deviceA, uaA, "mints A from its fingerprint");
const b1 = await step("B, no cache", deviceB, uaB, "mints B, must differ from A");

rotate();

const token = await fetchBrowserCache(codec, {
  endpoint,
  origin,
  userAgent: uaA,
  apiKey: deviceA.c,
});

console.log(
  `\ntoken     ${token ? `${token.length} chars from the GET leg` : "GET leg gave nothing"}\n`,
);

const withTokenA = JSON.parse(JSON.stringify(deviceA));

setPath(withTokenA, "s56.v", token ?? "");

const a2 = await step("A, fresh token", withTokenA, uaA, "binds the token to A");
const withTokenB = JSON.parse(JSON.stringify(deviceB));

setPath(withTokenB, "s56.v", token ?? "");

const b2 = await step("B, A's token", withTokenB, uaB, "the question: does B answer as A");

const b3 = await step("B, no cache again", deviceB, uaB, "control, B should be B again");
const transferred = Boolean(a2.visitor && b2.visitor && a2.visitor === b2.visitor);
const distinct = Boolean(a1.visitor && b1.visitor && a1.visitor !== b1.visitor);
const stable = Boolean(b1.visitor && b3.visitor && b1.visitor === b3.visitor);

mkdirSync(OUT, {
  recursive: true,
});

writeFileSync(
  join(OUT, `cache-bind-${salt}.json`),
  JSON.stringify(
    {
      a: basename(pathA),
      b: basename(pathB),
      token,
      steps,
      transferred,
      distinct,
      stable,
    },
    null,
    2,
  ),
);

console.log(
  `\ndevices distinct without a token   ${distinct ? "yes" : "NO — the run proves nothing"}`,
);

console.log(`B stable across the run           ${stable ? "yes" : "no"}`);

console.log(
  `A's token carries A's identity    ${transferred ? "YES — B answered as A" : "no — B kept its own visitor"}`,
);

console.log(`out ${join(OUT, `cache-bind-${salt}.json`)}`);
