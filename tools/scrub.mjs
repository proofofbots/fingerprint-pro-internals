#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CAPTURES } from "./lib/paths.mjs";
import { loadCodec } from "./lib/codec.mjs";
import { scrubCapture } from "./lib/payloads.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`scrub — redact third-party storage values in a capture, in place

  npm run scrub                 every file in captures/
  npm run scrub -- a.json b.json
  npm run scrub -- --reseal     also rebuild reqRaw from the decoded payload

  --reseal re-encodes each request's decoded JSON with the agent's own codec and writes the
  result back as reqRaw, so the stored frame carries the same values the file shows in plain
  text. It needs the original bundle, the same one npm run fetch downloads.
`);
  process.exit(0);
}

const COMPRESS_OVER = 1024;

const reseal = args.includes("--reseal");
const named = args.filter((arg) => !arg.startsWith("--"));

const files = named.length
  ? named
  : readdirSync(CAPTURES)
      .filter((name) => name.endsWith(".json"))
      .map((name) => join(CAPTURES, name));

const codec = reseal ? await loadCodec({ quiet: true }) : null;

async function resealRequests(capture) {
  let count = 0;
  for (const request of capture.requests ?? []) {
    const payload = request.decoded?.json;
    if (!request.reqRaw || !payload) continue;

    const encoded = codec.encodeJson(payload);
    const [deflated, body] =
      encoded.length > COMPRESS_OVER ? await codec.compress(encoded) : [false, encoded];
    const sealed = new Uint8Array(codec.sealFrame(deflated ? body : encoded));
    const opened = codec.openFrame(sealed);

    request.reqRaw = Buffer.from(sealed).toString("base64");
    if ("reqSize" in request) request.reqSize = sealed.length;
    if ("size" in request.decoded) request.decoded.size = sealed.length;
    if ("plainSize" in request.decoded) request.decoded.plainSize = encoded.length;
    request.decoded.key = [...opened.key];
    request.decoded.tag = [...opened.profile.markerBytes];
    count++;
  }
  return count;
}

for (const file of files) {
  const capture = JSON.parse(readFileSync(file, "utf8"));
  const { redacted } = scrubCapture(capture);
  const resealed = reseal ? await resealRequests(capture) : 0;
  writeFileSync(file, `${JSON.stringify(capture, null, 2)}\n`);
  console.log(
    `${file}: ${redacted} values redacted${reseal ? `, ${resealed} frames resealed` : ""}`,
  );
}
