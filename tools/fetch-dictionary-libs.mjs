#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARTIFACTS } from "./lib/paths.mjs";

const VERSION = process.env.TS_VERSION || "5.7.2";

const FILES = [
  "lib.dom.d.ts",
  "lib.dom.iterable.d.ts",
  "lib.webworker.d.ts",
  "lib.es5.d.ts",
  "lib.es2023.d.ts",
];

for (const file of FILES) {
  const url = `https://unpkg.com/typescript@${VERSION}/lib/${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  const body = await response.text();
  writeFileSync(join(ARTIFACTS, `ts-${file}`), body);
  console.log(`ts-${file} (${body.length} bytes)`);
}
