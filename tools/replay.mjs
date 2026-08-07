#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { CAPTURES } from "./lib/paths.mjs";
import { loadCodec } from "./lib/codec.mjs";
import { parseProxy, rotateSession, installProxy, sessionToken } from "./lib/proxy.mjs";
import { presentAs } from "./lib/origin.mjs";

const DEFAULT_ENDPOINT = "https://demo.fingerprint.com/DBqbMN7zXxwl4Ei8";
const LOADER = "js/4.1.3";
const COMPRESS_OVER = 1024;

const DEFAULT_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.34 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.34";

const args = process.argv.slice(2);
const has = (name) => args.includes(name);

const flag = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

const all = (name) => args.flatMap((value, index) => (value === name ? [args[index + 1]] : []));

if (has("--help") || args.length === 0) {
  console.log(`replay — rebuild a payload and send it from node, no browser

  node tools/replay.mjs --from <capture.json> [options]

  --from <file>        capture to take the payload from (default: newest in artifacts/captures)
  --payload <file>     an already-decoded payload instead of a capture
  --set <path=json>    override a field before sending, repeatable:
                         --set s7.v=32           one signal's value
                         --set s7=32             shorthand for .v
                         --set c='"<apiKey>"'    an envelope key
  --as-origin <url>    rewrite the capture's own origin to this everywhere in the payload, so a
                         capture taken on localhost is accepted by a tenant bound to its own origin
  --key <apiKey>       rewrite \`c\` and the query, and derive the endpoint's GET leg
  --endpoint <url>     tenant ingress, default ${DEFAULT_ENDPOINT}
  --origin <url>       Origin header (default: the endpoint's own origin)
  --ua <string>        User-Agent header; matters, the server parses device/os/browser from it
  --region <r>         us | eu | ap, default us
  --result             after the POST, hit the site's BFF (POST /api/event/v4/:id) for the verdict
  --secret <key>       Server API key instead: read the event off the Fingerprint server API
  --cookie <string>    Cookie header for the BFF call, if the site scopes results to a session
  --no-get             skip the GET leg (leaves the payload's own s56 in place)
  --proxy <spec>       route every request through a SOCKS5 proxy. Positional format:
                         socks5://host:port:user:pass — the pass' \`session-XXXX\` token is rotated
                         to a fresh value per run, so each replay leaves from a different exit IP
  --dry                build and unseal locally, send nothing
  --probe              send the frame, then a corrupted copy, and compare the two answers
  --out <file>         write the payload that was sent
`);
  process.exit(0);
}

const codec = await loadCodec({
  quiet: true,
});
const proxySpec = flag("--proxy");

if (proxySpec && !has("--dry")) {
  const proxy = rotateSession(parseProxy(proxySpec));
  installProxy(proxy);
  console.log(`proxy   socks5 ${proxy.host}:${proxy.port} session ${sessionToken(proxy) ?? "-"}`);
}

function readJson(path) {
  let text = readFileSync(path, "utf8").trim();
  if (text.startsWith("`") && text.endsWith("`")) text = text.slice(1, -1);
  return JSON.parse(text);
}

const newestCapture = () => {
  if (!existsSync(CAPTURES)) return null;
  const files = readdirSync(CAPTURES)
    .filter((file) => file.endsWith(".json"))
    .sort();
  return files.length ? join(CAPTURES, files[files.length - 1]) : null;
};

const looksLikePayload = (value) =>
  value && typeof value === "object" && Object.keys(value).some((key) => /^s\d+$/.test(key));

function openPayload(bytes) {
  const opened = codec.openFrame(bytes);
  let payload = opened.payload;
  if (payload[0] !== 0x7b && payload[0] !== 0x5b) payload = codec.inflate(payload);
  return codec.decodeJson(payload);
}

function payloadFromCapture(path) {
  const capture = readJson(path);
  if (looksLikePayload(capture) && !capture.requests) return capture;
  const candidates = [];
  for (const request of capture.requests ?? []) {
    if (request.reqRaw) {
      try {
        const payload = openPayload(Uint8Array.from(Buffer.from(request.reqRaw, "base64")));
        if (looksLikePayload(payload))
          candidates.push({
            payload,
            size: request.reqSize ?? 0,
          });
        continue;
      } catch {}
    }
    if (looksLikePayload(request.decoded?.json)) {
      candidates.push({
        payload: request.decoded.json,
        size: request.reqSize ?? 0,
      });
    }
  }
  if (!candidates.length) throw new Error(`${basename(path)} carries no agent payload`);
  return candidates.reduce((a, b) => (b.size > a.size ? b : a)).payload;
}

const source = flag("--payload") ?? flag("--from") ?? newestCapture();

if (!source) throw new Error("no capture to replay — run npm run capture first, or pass --payload");

const loaded = readJson(source);

const payload =
  looksLikePayload(loaded) && !loaded.requests
    ? loaded
    : looksLikePayload(loaded.payload)
      ? loaded.payload
      : payloadFromCapture(source);

if (!payload.c && !flag("--key")) {
  throw new Error(
    `${basename(source)} has no api key in \`c\` — pass --key <apiKey>, or point at a capture that carries it`,
  );
}

function applyOverride(target, expression) {
  const split = expression.indexOf("=");
  if (split === -1) throw new Error(`--set needs path=value, got ${expression}`);
  const rawPath = expression.slice(0, split);
  const rawValue = expression.slice(split + 1);
  let value;
  try {
    value = JSON.parse(rawValue);
  } catch {
    value = rawValue;
  }
  const isFullSignal = value && typeof value === "object" && "s" in value && "v" in value;
  const path =
    /^s\d+$/.test(rawPath) && target[rawPath] && "v" in target[rawPath] && !isFullSignal
      ? `${rawPath}.v`
      : rawPath;
  const parts = path.split(".");
  let node = target;
  for (const part of parts.slice(0, -1)) {
    if (node[part] === undefined || node[part] === null || typeof node[part] !== "object")
      node[part] = {};
    node = node[part];
  }
  node[parts.at(-1)] = value;
  return {
    path,
    value,
  };
}

const endpoint = flag("--endpoint", DEFAULT_ENDPOINT);
const region = flag("--region", "us");
const origin = flag("--origin") ?? new URL(endpoint).origin;
const userAgent = flag("--ua", DEFAULT_UA);
const apiKey = flag("--key") ?? payload.c;

if (apiKey !== payload.c) payload.c = apiKey;

const asOrigin = flag("--as-origin");

if (asOrigin) {
  const moved = presentAs(payload, {
    origin: asOrigin,
    endpoint,
    apiKey,
  });
  if (!moved.from) {
    console.warn("--as-origin: could not detect the capture's origin; nothing rewritten");
  } else if (moved.rewritten) {
    console.log(`origin  ${moved.from} -> ${moved.to}`);
  }
}

const applied = all("--set").map((expression) => applyOverride(payload, expression));
let helper = null;

if (!has("--no-get") && !has("--dry")) {
  helper = codec.helperUrl ? codec.helperUrl(endpoint) : null;
  if (!helper) {
    console.warn("helper URL builder not detected in this bundle; keeping the payload's own s56");
  } else {
    const url = `${helper}?q=${encodeURIComponent(apiKey)}`;
    try {
      const response = await fetch(url, {
        headers: {
          Origin: origin,
          "User-Agent": userAgent,
        },
      });
      const text = (await response.text()).trim();
      if (response.ok && text) {
        payload.s56 = {
          s: 0,
          v: text,
        };
        console.log(`get   ${response.status} ${url} -> ${text.length} chars into s56`);
      } else {
        console.log(`get   ${response.status} ${url} -> keeping the payload's own s56`);
      }
    } catch (error) {
      console.log(`get   failed (${error.message}) -> keeping the payload's own s56`);
    }
  }
}

const encoded = codec.encodeJson(payload);
const [compressed, body] = await codec.compress(encoded);
const bytes = compressed ? new Uint8Array(body) : encoded;

const profile =
  codec.profiles.find(
    (candidate) => candidate.markerBytes.join() === (compressed ? "3,14" : "3,13"),
  ) ?? codec.profiles[0];

const frame = new Uint8Array(codec.sealFrame(bytes, profile));
const ids = Object.keys(payload).filter((key) => /^s\d+$/.test(key));

console.log(`source  ${basename(source)}`);
console.log(`payload ${ids.length} signal ids, ${encoded.length} bytes json`);

for (const change of applied)
  console.log(`set     ${change.path} = ${JSON.stringify(change.value)}`);

console.log(
  `frame   ${frame.length} bytes, tag ${profile.markerBytes.join(",")}, key ${profile.keyLength}, ${compressed ? `deflate-raw over ${COMPRESS_OVER}` : "uncompressed"}`,
);

if (flag("--out")) writeFileSync(flag("--out"), JSON.stringify(payload, null, 2));

if (has("--dry")) {
  const reopened = openPayload(frame);
  const same = JSON.stringify(reopened) === JSON.stringify(payload);
  console.log(`dry     unsealed locally, round trip ${same ? "matches" : "DIFFERS"}`);
  process.exit(same ? 0 : 1);
}

const target = `${endpoint}?region=${encodeURIComponent(region)}&ci=${encodeURIComponent(LOADER)}&q=${encodeURIComponent(apiKey)}`;

const headers = {
  "Content-Type": "text/plain",
  Origin: origin,
  "User-Agent": userAgent,
};

async function post(payloadBytes, label) {
  const response = await fetch(target, {
    method: "POST",
    headers,
    body: payloadBytes,
  });
  const text = await response.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {}
  console.log(`post    ${label} ${response.status} ${response.statusText}`);
  console.log(`        ${text.slice(0, 400)}`);
  return {
    status: response.status,
    parsed,
    text,
  };
}

const sent = await post(frame, "frame");

if (has("--probe")) {
  const corrupted = frame.slice();
  for (let index = corrupted.length - 24; index < corrupted.length; index++)
    corrupted[index] ^= 0xff;
  const control = await post(corrupted, "corrupted");
  const identical = control.status === sent.status && control.text === sent.text;
  console.log(
    identical
      ? "probe   same answer for a corrupted body: the rejection happens before the payload is read"
      : "probe   different answer for a corrupted body: the endpoint read the frame",
  );
}

const eventId = sent.parsed?.event_id ?? sent.parsed?.requestId ?? null;
const secret = flag("--secret");

function printVerdict(json) {
  const identification = json.products?.identification?.data ?? json.identification ?? null;
  const bot = json.products?.botd?.data?.bot ?? json.botd?.bot ?? null;
  if (identification) {
    console.log(
      `        visitor ${identification.visitor_id ?? identification.visitorId}, ` +
        `confidence ${identification.confidence?.score}, ` +
        `${(identification.visitor_found ?? identification.visitorFound) ? "returning" : "new"}`,
    );
  }
  if (bot) console.log(`        bot ${bot.result} (${bot.type ?? "-"})`);
}

if (!eventId) {
  console.log("event   no event_id in the response; the frame was rejected before identification");
} else if (secret) {
  const host = region === "us" ? "api.fpjs.io" : `${region}.api.fpjs.io`;
  const url = `https://${host}/events/${encodeURIComponent(eventId)}`;
  const response = await fetch(url, {
    headers: {
      "Auth-API-Key": secret,
    },
  });
  const text = await response.text();
  console.log(`event   ${response.status} ${url}`);
  try {
    printVerdict(JSON.parse(text));
  } catch {}
  console.log(text.slice(0, 4000));
} else if (has("--result")) {
  const url = `${origin}/api/event/v4/${encodeURIComponent(eventId)}`;
  const bffHeaders = {
    Origin: origin,
    "User-Agent": userAgent,
  };
  if (flag("--cookie")) bffHeaders.Cookie = flag("--cookie");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: bffHeaders,
    });
    const text = await response.text();
    console.log(`result  ${response.status} ${url}`);
    try {
      const json = JSON.parse(text);
      printVerdict(json);
      if (flag("--out"))
        writeFileSync(`${flag("--out")}.result.json`, JSON.stringify(json, null, 2));
    } catch {}
    console.log(text.slice(0, 4000));
  } catch (error) {
    console.log(
      `result  failed (${error.message}) — the post frame was likely rejected before an event existed`,
    );
  }
} else {
  console.log(`event   ${eventId} — add --result for the site BFF, or --secret for the server API`);
}
