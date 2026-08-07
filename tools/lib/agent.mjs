import { readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "@babel/parser";
import { ARTIFACTS, DEFAULT_AGENT } from "./paths.mjs";
import { buildDictionary, buildRainbow, loadOverrides, resolveHash } from "./crc32.mjs";
import { detectPrimitives, findVaultTables } from "./detect.mjs";

export function parseAgent(agentPath = DEFAULT_AGENT) {
  const source = readFileSync(agentPath, "utf8");
  const ast = parse(source, {
    sourceType: "module",
    ranges: true,
  });
  return {
    source,
    ast,
    agentPath,
  };
}

export function buildNameResolver(source) {
  const rainbow = buildRainbow(
    buildDictionary({
      agentSource: source,
    }),
  );
  const overrides = loadOverrides();
  return {
    rainbow,
    overrides,
    resolve: (hash) => resolveHash(rainbow, overrides, hash),
  };
}

function installStubs(names) {
  globalThis.__FP_HASH_NAMES = names;
  if (!globalThis.window) globalThis.window = globalThis;
  if (!globalThis.navigator) globalThis.navigator = {};
  if (!globalThis.screen) globalThis.screen = {};
  if (!globalThis.document)
    globalThis.document = {
      createElement: () => ({
        style: {},
      }),
    };
  if (!globalThis.Image) {
    globalThis.Image = class {
      constructor() {
        this.style = {};
      }
    };
  }
}

/**
 * Loads the agent's own vault primitives into this process.
 *
 * Two edits are made to a throwaway copy of the bundle: the CRC32 name resolver is short-circuited
 * through a rainbow table so no real DOM is needed, and the internals are re-exported under stable
 * role names. Everything else runs as shipped, so the decoders can never drift from the bundle.
 */

/**
 * Loads the agent's own vault primitives into this process.
 *
 * Two edits are made to a throwaway copy of the bundle: the CRC32 name resolver is short-circuited
 * through a rainbow table so no real DOM is needed, and the internals are re-exported under stable
 * role names. Everything else runs as shipped, so the decoders can never drift from the bundle.
 */
export async function loadAgentInternals({ agentPath = DEFAULT_AGENT, quiet = false } = {}) {
  const { source, ast } = parseAgent(agentPath);
  const resolver = buildNameResolver(source);
  const { roles, missing } = detectPrimitives(ast);
  if (missing.length && !quiet) {
    console.warn(`detect: no match for ${missing.join(", ")} — bundle layout may have changed`);
  }
  const tables = findVaultTables(ast, roles);
  const exported = {
    ...roles,
  };
  for (const table of tables) exported[`table_${table.name}`] = table.name;
  const exportList = Object.entries(exported)
    .map(([alias, local]) => `${local} as ${alias}`)
    .join(", ");
  const findName = roles.findName;
  const patched = source.replace(
    new RegExp(`function ${findName}\\s*\\(([^)]*)\\)\\s*\\{`),
    (_match, params) => {
      const hashParam = params.split(",")[1]?.trim();
      return (
        `function ${findName}(${params}){` +
        `if(typeof ${hashParam}==="string")return ${hashParam};` +
        `const __hit=globalThis.__FP_HASH_NAMES&&globalThis.__FP_HASH_NAMES.get(${hashParam});` +
        `if(__hit)return __hit;`
      );
    },
  );
  if (patched === source) throw new Error(`could not patch name resolver "${findName}"`);
  const modulePath = join(ARTIFACTS, `.internals-${basename(agentPath)}`);
  writeFileSync(modulePath, `${patched}\nexport { ${exportList} };\n`);
  const names = new Map();
  for (const [hash, candidates] of resolver.rainbow) {
    if (candidates.length === 1) names.set(hash, candidates[0]);
  }
  for (const [hash, name] of resolver.overrides) names.set(hash, name);
  installStubs(names);
  const internals = await import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);
  return {
    internals,
    roles,
    tables,
    resolver,
    source,
    ast,
  };
}

const PROBE_LIMIT = 1024;
const STOP_AFTER_EMPTY = 24;

export function readTable(accessor) {
  const entries = [];
  let empty = 0;
  for (let i = 0; i < PROBE_LIMIT && empty < STOP_AFTER_EMPTY; i++) {
    let value;
    try {
      value = accessor(i);
    } catch {
      value = undefined;
    }
    if (value === undefined || value === null) {
      empty++;
      entries.push(null);
    } else {
      empty = 0;
      entries.push(value);
    }
  }
  while (entries.length && entries.at(-1) === null) entries.pop();
  return entries;
}
