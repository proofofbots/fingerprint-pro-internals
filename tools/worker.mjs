#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import generateModule from "@babel/generator";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import prettier from "prettier";
import { AGENT, DEFAULT_AGENT } from "./lib/paths.mjs";

import {
  ensureBlocks,
  flattenSequences,
  foldConstants,
  inlineConstantBindings,
  inlineOperatorWrappers,
  normalizeMemberAccess,
  normalizeObjectKeys,
  removeUnusedBindings,
  renameIdentifiers,
  restoreNullishOperators,
  simplifyLiterals,
  statementizeControlFlow,
} from "./lib/passes.mjs";

const generate = generateModule.default ?? generateModule;
const traverse = traverseModule.default ?? traverseModule;
const MARKER = "Worker is already running.";

const NAMES = {
  VB: "postThrown",
  Ix: "post",
  Al: "installMessageHandler",
  ii: "bootstrap",
};

const outPath = join(AGENT, "worker.clean.js");
const agent = readFileSync(DEFAULT_AGENT, "utf8");
let workerSource = null;

traverse(
  parse(agent, {
    sourceType: "module",
  }),
  {
    StringLiteral(path) {
      if (workerSource || !path.node.value.includes(MARKER)) return;
      workerSource = path.node.value;
    },
  },
);

if (!workerSource) {
  console.error(`no worker blob in ${DEFAULT_AGENT}: no string literal contains ${MARKER}`);
  process.exit(1);
}

const emit = (ast) =>
  generate(ast, {
    comments: false,
    jsescOption: {
      minimal: true,
    },
  }).code;

const reparse = (code) =>
  parse(code, {
    sourceType: "script",
  });
let ast = reparse(workerSource);

const stats = {
  literals: 0,
  blocks: 0,
  wrappers: 0,
  constants: 0,
  folded: 0,
  nullish: 0,
  dotAccess: 0,
  objectKeys: 0,
  sequences: 0,
  branches: 0,
  deadBindings: 0,
  passes: 0,
};

const MAX_SWEEPS = 8;

for (let sweep = 0; sweep < MAX_SWEEPS; sweep++) {
  const changes = {
    literals: simplifyLiterals(ast),
    blocks: ensureBlocks(ast),
    wrappers: inlineOperatorWrappers(ast),
    constants: inlineConstantBindings(ast),
    folded: foldConstants(ast),
    nullish: restoreNullishOperators(ast),
    dotAccess: normalizeMemberAccess(ast),
    objectKeys: normalizeObjectKeys(ast),
    sequences: flattenSequences(ast),
    branches: statementizeControlFlow(ast),
    deadBindings: removeUnusedBindings(ast),
  };
  for (const [key, value] of Object.entries(changes)) stats[key] += value;
  stats.passes = sweep + 1;
  if (Object.values(changes).every((n) => n === 0)) break;
  if (sweep < MAX_SWEEPS - 1) ast = reparse(emit(ast));
}

stats.renamed = renameIdentifiers(ast, {
  manual: NAMES,
});

const formatted = await prettier.format(emit(ast), {
  parser: "babel",
  printWidth: 100,
});

writeFileSync(outPath, formatted);
console.log(`in  ${DEFAULT_AGENT} (worker blob, ${workerSource.length} bytes)`);

console.log(`out ${outPath} (${formatted.length} bytes, ${formatted.split("\n").length} lines)`);

for (const [key, value] of Object.entries(stats)) console.log(`  ${key.padEnd(14)} ${value}`);
