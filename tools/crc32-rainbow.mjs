#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { AGENT, DEFAULT_AGENT } from "./lib/paths.mjs";

import { buildDictionary, buildRainbow, loadOverrides, resolveHash } from "./lib/crc32.mjs";

import { detectPrimitives } from "./lib/detect.mjs";
import { inlineOperatorWrappers } from "./lib/passes.mjs";

const traverse = traverseModule.default ?? traverseModule;
const source = readFileSync(DEFAULT_AGENT, "utf8");
const ast = parse(source, {
  sourceType: "module",
});

inlineOperatorWrappers(ast);

const dictionary = buildDictionary({
  agentSource: source,
});
const rainbow = buildRainbow(dictionary);
const overrides = loadOverrides();
const { roles } = detectPrimitives(ast);
const hashedCallees = new Set([roles.readProp, roles.findName, roles.xorFromName]);
const sites = new Map();

traverse(ast, {
  CallExpression(path) {
    const callee = path.node.callee;
    if (callee.type !== "Identifier" || !hashedCallees.has(callee.name)) return;
    const arg = path.node.arguments[1];
    if (arg?.type !== "NumericLiteral") return;
    sites.set(arg.value, (sites.get(arg.value) ?? 0) + 1);
  },
});

const resolved = [];
const unresolved = [];

for (const [hash, uses] of [...sites].sort((a, b) => b[1] - a[1])) {
  const name = resolveHash(rainbow, overrides, hash);
  if (name)
    resolved.push({
      hash,
      uses,
      name,
      ambiguous: rainbow.get(hash)?.length > 1,
    });
  else
    unresolved.push({
      hash,
      uses,
      candidates: rainbow.get(hash) ?? [],
    });
}

writeFileSync(
  join(AGENT, "crc32-map.json"),
  JSON.stringify(
    {
      agent: DEFAULT_AGENT,
      dictionary: rainbow.size,
      resolved,
      unresolved,
    },
    null,
    2,
  ),
);

console.log(
  `dictionary=${rainbow.size} sites=${sites.size} resolved=${resolved.length} unresolved=${unresolved.length}`,
);

for (const entry of resolved.slice(0, Number(process.env.FP_TOP || 40))) {
  console.log(`${String(entry.hash).padStart(10)}  x${String(entry.uses).padEnd(3)} ${entry.name}`);
}

for (const entry of unresolved) {
  console.log(`${String(entry.hash).padStart(10)}  x${String(entry.uses).padEnd(3)} UNRESOLVED`);
}
