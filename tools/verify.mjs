#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { AGENT, CLEAN_AGENT, DEFAULT_AGENT, PIN } from "./lib/paths.mjs";
import { loadAgentInternals, readTable } from "./lib/agent.mjs";

const traverse = traverseModule.default ?? traverseModule;

async function tablesFrom(agentPath) {
  const { internals, tables, roles } = await loadAgentInternals({
    agentPath,
    quiet: true,
  });
  const decoded = {};
  for (const { name } of tables) {
    const accessor = internals[`table_${name}`];
    decoded[name] = typeof accessor === "function" ? readTable(accessor) : null;
  }
  return {
    decoded,
    roles,
    count: tables.length,
  };
}

const cleanPath = CLEAN_AGENT;

if (!existsSync(cleanPath)) {
  console.error(`missing ${cleanPath} — run tools/clean.mjs first`);
  process.exit(1);
}

function freeIdentifiers(path) {
  const ast = parse(readFileSync(path, "utf8"), {
    sourceType: "module",
  });
  const names = new Set();
  traverse(ast, {
    ReferencedIdentifier(identifierPath) {
      if (identifierPath.scope.hasBinding(identifierPath.node.name)) return;
      names.add(identifierPath.node.name);
    },
  });
  return names;
}

const originalFree = freeIdentifiers(DEFAULT_AGENT);

const introduced = [...freeIdentifiers(cleanPath)].filter((name) => !originalFree.has(name)).sort();

const original = await tablesFrom(DEFAULT_AGENT);
const cleaned = await tablesFrom(cleanPath);

const originalValues = Object.values(original.decoded)
  .filter((entries) => entries?.length)
  .map((entries) => JSON.stringify(entries))
  .sort();

const cleanedValues = Object.values(cleaned.decoded)
  .filter((entries) => entries?.length)
  .map((entries) => JSON.stringify(entries))
  .sort();

const missing = originalValues.filter((value) => !cleanedValues.includes(value));
const extra = cleanedValues.filter((value) => !originalValues.includes(value));

console.log(`original: ${original.count} tables, ${originalValues.length} decoded`);
console.log(`cleaned:  ${cleaned.count} tables, ${cleanedValues.length} decoded`);
console.log(`free identifiers introduced: ${introduced.length}`);

if (missing.length === 0 && extra.length === 0 && introduced.length === 0) {
  const pin = JSON.parse(readFileSync(PIN, "utf8"));
  pin.derived = {};
  for (const name of ["agent.clean.js", "agent.clean.keepnames.js", "worker.clean.js"]) {
    const path = join(AGENT, name);
    if (!existsSync(path)) continue;
    pin.derived[name] = createHash("sha256").update(readFileSync(path)).digest("hex");
  }
  writeFileSync(PIN, `${JSON.stringify(pin, null, 2)}\n`);
  console.log("PASS: every decodable table matches, no declaration lost");
  console.log(`pin: derived hashes written for ${Object.keys(pin.derived).join(", ")}`);
  process.exit(0);
}

if (missing.length || extra.length) {
  console.log(`FAIL: ${missing.length} tables lost, ${extra.length} unexpected`);
  for (const value of missing.slice(0, 3)) console.log(`  lost: ${value.slice(0, 160)}`);
}

if (introduced.length) {
  console.log(`FAIL: ${introduced.length} identifiers left undeclared: ${introduced.join(", ")}`);
}

process.exit(1);
