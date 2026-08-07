#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { AGENT, DEFAULT_AGENT } from "./lib/paths.mjs";
import { loadAgentInternals, readTable } from "./lib/agent.mjs";

const { internals, roles, tables, resolver } = await loadAgentInternals();
const dump = {
  agent: DEFAULT_AGENT,
  roles,
  tables: {},
};

for (const { name, kind, keyHashes } of tables) {
  const accessor = internals[`table_${name}`];
  if (typeof accessor !== "function") {
    dump.tables[name] = {
      kind,
      error: "not callable",
    };
    continue;
  }
  const entries = readTable(accessor);
  const record = {
    kind,
    size: entries.length,
    entries,
  };
  if (entries.length === 0 && keyHashes.length) {
    record.unresolvedKeyHashes = keyHashes.filter((h) => !resolver.resolve(h));
    record.resolvedKeyNames = Object.fromEntries(
      keyHashes.map((h) => [h, resolver.resolve(h)]).filter(([, n]) => n),
    );
  }
  dump.tables[name] = record;
}

const outPath = join(AGENT, "vaults.json");

writeFileSync(outPath, JSON.stringify(dump, null, 2));

const decoded = Object.values(dump.tables).filter((t) => t.size > 0).length;

console.log(
  `roles: ${Object.entries(roles)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")}`,
);
console.log(`tables: ${tables.length} found, ${decoded} decoded -> ${outPath}`);

for (const [name, table] of Object.entries(dump.tables)) {
  const preview = table.entries
    ? table.entries
        .slice(0, 6)
        .map((e) => JSON.stringify(e).slice(0, 60))
        .join(", ")
    : table.error;
  console.log(`  ${name} [${table.kind}] n=${table.size ?? 0}  ${preview}`);
  if (table.unresolvedKeyHashes?.length) {
    console.log(`    unresolved key hashes: ${table.unresolvedKeyHashes.join(", ")}`);
  }
}
