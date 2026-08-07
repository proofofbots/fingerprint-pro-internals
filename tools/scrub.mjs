#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CAPTURES } from "./lib/paths.mjs";
import { scrubCapture } from "./lib/payloads.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`scrub — redact third-party storage values in a capture, in place

  npm run scrub                 every file in captures/
  npm run scrub -- a.json b.json
`);
  process.exit(0);
}

const files = args.length
  ? args
  : readdirSync(CAPTURES)
      .filter((name) => name.endsWith(".json"))
      .map((name) => join(CAPTURES, name));

for (const file of files) {
  const capture = JSON.parse(readFileSync(file, "utf8"));
  const { redacted } = scrubCapture(capture);
  writeFileSync(file, `${JSON.stringify(capture, null, 2)}\n`);
  console.log(`${file}: ${redacted} values redacted`);
}
