#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARTIFACTS, DEFAULT_AGENT, PIN } from "./lib/paths.mjs";

const args = process.argv.slice(2);
const has = (name) => args.includes(name);

const flag = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

if (has("--help")) {
  console.log(`fetch-agent — download the shipped agent bundle and check it against agent/pin.json

  npm run fetch                 fetch the pinned URL, verify the hash
  npm run fetch -- --url <url>  fetch another tenant's bundle
  npm run fetch -- --pin        rewrite agent/pin.json from what was fetched
`);
  process.exit(0);
}

const pin = JSON.parse(readFileSync(PIN, "utf8"));
const url = flag("--url", pin.url);
const response = await fetch(url, {
  headers: {
    accept: "*/*",
  },
});

if (!response.ok) throw new Error(`fetch failed: ${response.status} ${response.statusText}`);

const body = Buffer.from(await response.arrayBuffer());
const sha256 = createHash("sha256").update(body).digest("hex");

mkdirSync(ARTIFACTS, {
  recursive: true,
});
writeFileSync(DEFAULT_AGENT, body);

const headerLines = [`HTTP ${response.status}`];

for (const [name, value] of [...response.headers].sort()) headerLines.push(`${name}: ${value}`);

writeFileSync(join(ARTIFACTS, "agent.original.headers.txt"), `${headerLines.join("\n")}\n`);

console.log(`url    ${url}`);
console.log(`bytes  ${body.length}`);
console.log(`sha256 ${sha256}`);
console.log(`out    ${DEFAULT_AGENT}`);

if (has("--pin")) {
  const next = {
    ...pin,
    url,
    sha256,
    bytes: body.length,
    etag: response.headers.get("etag") ?? null,
    fetchedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  };
  writeFileSync(PIN, `${JSON.stringify(next, null, 2)}\n`);
  console.log("pin    rewritten");
  process.exit(0);
}

if (sha256 !== pin.sha256) {
  console.log("");
  console.log(
    `pin    MISMATCH — expected ${pin.sha256} (${pin.version}, fetched ${pin.fetchedAt})`,
  );
  console.log(
    "       The tenant ships a new build. Everything under reference/ describes the pinned one.",
  );
  console.log("       Snapshot first (npm run diff -- --save <version>), then rerun the pipeline.");
  process.exit(1);
}

console.log(`pin    match (${pin.version})`);
