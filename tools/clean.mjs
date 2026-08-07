#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import generateModule from "@babel/generator";
import { parse } from "@babel/parser";
import prettier from "prettier";
import { AGENT, DATA, DEFAULT_AGENT } from "./lib/paths.mjs";
import { buildNameResolver } from "./lib/agent.mjs";
import { detectPrimitives } from "./lib/detect.mjs";

import {
  apiSlug,
  buildSurface,
  exclusiveOwners,
  isInformativeSlug,
  rankByRarity,
} from "./lib/surface.mjs";

import {
  acceptResolvedNames,
  collectSignalRegistries,
  decodeBase64Literals,
  ensureBlocks,
  flattenSequences,
  foldConstants,
  inlineConstantBindings,
  inlineGlobalAliases,
  inlineOperatorWrappers,
  inlineVaultReads,
  moduleBuilders,
  inlineWrapperObjects,
  normalizeMemberAccess,
  normalizeObjectKeys,
  removeUnusedBindings,
  renameIdentifiers,
  resolveHashArguments,
  restoreMemberAccess,
  restoreNullishOperators,
  simplifyLiterals,
  statementizeControlFlow,
  statementizeReturns,
} from "./lib/passes.mjs";

const generate = generateModule.default ?? generateModule;
const flags = new Set(process.argv.slice(2));
const skipRename = flags.has("--no-rename");
const allMemberAccess = flags.has("--member-access");
const outPath = join(AGENT, skipRename ? "agent.clean.keepnames.js" : "agent.clean.js");

const emit = (ast) =>
  generate(ast, {
    comments: false,
    jsescOption: {
      minimal: true,
    },
  }).code;

const reparse = (code) =>
  parse(code, {
    sourceType: "module",
  });

function signalLabels(registries, ast) {
  const ids = new Map();
  const owners = new Map();
  for (const { key, entries } of registries) {
    for (const { id, binding } of entries) {
      if (!ids.has(binding)) ids.set(binding, []);
      if (!ids.get(binding).includes(id)) ids.get(binding).push(id);
      if (!owners.has(binding)) owners.set(binding, key);
    }
  }
  const { index, collect } = buildSurface(ast);
  const reached = new Map([...ids.keys()].map((binding) => [binding, collect(binding).apis]));
  const rank = rankByRarity([...reached.values()]);
  const labels = {};
  const taken = new Set();
  for (const [binding, list] of ids) {
    const measured = rank(reached.get(binding)).map(apiSlug).find(isInformativeSlug) ?? null;
    let label = `sig_${list.join("_")}`;
    if (measured) label = `${label}_${measured}`;
    if (taken.has(label)) label = `${label}_${owners.get(binding)}`;
    if (taken.has(label)) continue;
    taken.add(label);
    labels[binding] = label;
  }
  const helperRank = rankByRarity([...index.values()].map((entry) => entry.apis));
  const builders = new Set(moduleBuilders(ast).values());
  const helpers = new Map();
  for (const [name, root] of exclusiveOwners(index, [...ids.keys()])) {
    const sig = ids.get(root)?.[0];
    if (!sig || builders.has(name)) continue;
    const slug =
      helperRank(index.get(name)?.apis ?? new Map())
        .map(apiSlug)
        .find(isInformativeSlug) ?? null;
    helpers.set(name, {
      sig,
      slug,
    });
  }
  return {
    labels,
    helpers,
  };
}

const source = readFileSync(DEFAULT_AGENT, "utf8");

const manualNames = existsSync(join(DATA, "names.json"))
  ? JSON.parse(readFileSync(join(DATA, "names.json"), "utf8"))
  : {};

const vaultsPath = join(AGENT, "vaults.json");

if (!existsSync(vaultsPath)) console.warn("vaults.json missing — run tools/vault-dump.mjs first");

const vaults = existsSync(vaultsPath) ? JSON.parse(readFileSync(vaultsPath, "utf8")).tables : {};

const resolver = buildNameResolver(source);
let ast = reparse(source);
const { roles, missing } = detectPrimitives(ast, manualNames.functions ?? {});

if (missing.length) console.warn(`detect: no match for ${missing.join(", ")}`);

const stats = {
  literals: 0,
  blocks: 0,
  wrappers: 0,
  wrapperObjects: 0,
  constants: 0,
  folded: 0,
  memberAccess: 0,
  nullish: 0,
  hashesResolved: 0,
  vaultStrings: 0,
  globalAliases: 0,
  base64: 0,
  dotAccess: 0,
  objectKeys: 0,
  sequences: 0,
  branches: 0,
  returnChains: 0,
  deadBindings: 0,
  passes: 0,
};

let unresolvedHashes = [];
const MAX_SWEEPS = 8;

for (let sweep = 0; sweep < MAX_SWEEPS; sweep++) {
  const changes = {
    literals: simplifyLiterals(ast),
    blocks: ensureBlocks(ast),
    wrappers: inlineOperatorWrappers(ast),
    wrapperObjects: inlineWrapperObjects(ast),
    constants: inlineConstantBindings(ast),
    folded: foldConstants(ast),
    memberAccess: restoreMemberAccess(ast, roles, {
      all: allMemberAccess,
    }),
    nullish: restoreNullishOperators(ast),
    vaultStrings: inlineVaultReads(ast, vaults),
    globalAliases: inlineGlobalAliases(ast),
    base64: decodeBase64Literals(ast),
    dotAccess: normalizeMemberAccess(ast),
    objectKeys: normalizeObjectKeys(ast),
    sequences: flattenSequences(ast),
    branches: statementizeControlFlow(ast),
    returnChains: statementizeReturns(ast),
    deadBindings: removeUnusedBindings(ast),
  };
  const hashes = resolveHashArguments(ast, roles, resolver.resolve);
  stats.hashesResolved += hashes.resolved;
  unresolvedHashes = hashes.unresolved;
  for (const [key, value] of Object.entries(changes)) stats[key] += value;
  stats.passes = sweep + 1;
  const settled = Object.values(changes).every((n) => n === 0) && hashes.resolved === 0;
  if (settled) break;
  if (sweep < MAX_SWEEPS - 1) ast = reparse(emit(ast));
}

const registries = collectSignalRegistries(ast);
const { labels: signals, helpers } = signalLabels(registries, ast);

stats.signalsNamed = Object.keys(signals).length;
stats.helpersNamed = helpers.size;
stats.resolverPatched = acceptResolvedNames(ast, roles);

stats.renamed = skipRename
  ? 0
  : renameIdentifiers(ast, {
      roles,
      manual: manualNames.identifiers ?? {},
      vaults,
      signals,
      owners: flags.has("--no-infer") ? new Map() : helpers,
      semantic: !flags.has("--no-infer"),
    });

const formatted = await prettier.format(emit(ast), {
  parser: "babel",
  printWidth: 100,
  objectWrap: "collapse",
});

writeFileSync(outPath, formatted);

writeFileSync(join(AGENT, "unresolved-hashes.json"), JSON.stringify(unresolvedHashes, null, 2));

console.log(`in  ${DEFAULT_AGENT} (${source.length} bytes)`);

console.log(`out ${outPath} (${formatted.length} bytes, ${formatted.split("\n").length} lines)`);

for (const [key, value] of Object.entries(stats)) console.log(`  ${key.padEnd(18)} ${value}`);

console.log(`  ${"hashesUnresolved".padEnd(18)} ${unresolvedHashes.length}`);
