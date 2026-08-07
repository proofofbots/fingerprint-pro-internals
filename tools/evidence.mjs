#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

import { join } from "node:path";
import { ARTIFACTS, EVIDENCE } from "./lib/paths.mjs";

const args = process.argv.slice(2);

const flag = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

if (args.includes("--help")) {
  console.log(`evidence — copy measurement runs into evidence/ with the network identifiers removed

  npm run evidence                    read artifacts/identity and artifacts/distill
  npm run evidence -- --from <dir>    read another run directory
`);
  process.exit(0);
}

const from = flag("--from", ARTIFACTS);

const STRIPPED = new Set([
  "address",
  "proxySession",
  "heldSession",
  "proxy",
  "ip",
  "ip_address",
  "ipLocation",
]);

function scrub(value) {
  if (Array.isArray(value)) return value.map(scrub);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, entry] of Object.entries(value)) {
    if (STRIPPED.has(key)) continue;
    out[key] = scrub(entry);
  }
  return out;
}

const copy = (sourcePath, targetName) => {
  const parsed = JSON.parse(readFileSync(sourcePath, "utf8"));
  writeFileSync(join(EVIDENCE, targetName), `${JSON.stringify(scrub(parsed), null, 2)}\n`);
  return targetName;
};

mkdirSync(EVIDENCE, {
  recursive: true,
});

const written = [];
const identity = join(from, "identity");

if (existsSync(identity)) {
  for (const file of readdirSync(identity)
    .filter((name) => name.endsWith(".json"))
    .sort()) {
    written.push(copy(join(identity, file), `identity-${file}`));
  }
}

const distill = join(from, "distill", "report.json");

if (existsSync(distill)) written.push(copy(distill, "distill-report.json"));

for (const name of written) console.log(`out ${join(EVIDENCE, name)}`);

if (!written.length) console.log(`nothing to copy from ${from}`);
