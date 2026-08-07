#!/usr/bin/env node
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { REFERENCE, CLEAN_AGENT } from "./lib/paths.mjs";
import { detectPrimitives } from "./lib/detect.mjs";
import { collectSignalRegistries } from "./lib/passes.mjs";
import { buildSurface, exclusiveOwners, rankByRarity } from "./lib/surface.mjs";

const traverse = traverseModule.default ?? traverseModule;
const OUT = join(REFERENCE, "slices");
const CLEAN = CLEAN_AGENT;
const source = readFileSync(CLEAN, "utf8");
const ast = parse(source, {
  sourceType: "module",
});
const registries = collectSignalRegistries(ast);
const { roles } = detectPrimitives(ast);
const { index, collect } = buildSurface(ast, {
  hashName: roles.hash128,
});
const statements = new Map();

traverse(ast, {
  Program(programPath) {
    for (const statement of programPath.get("body")) {
      const path = statement.isExportNamedDeclaration() ? statement.get("declaration") : statement;
      if (!path?.node) continue;
      const record = {
        start: path.node.start,
        end: path.node.end,
        line: path.node.loc.start.line,
      };
      if (path.isFunctionDeclaration() || path.isClassDeclaration()) {
        if (path.node.id?.name) statements.set(path.node.id.name, record);
        continue;
      }
      if (!path.isVariableDeclaration()) continue;
      for (const declarator of path.get("declarations")) {
        if (declarator.node.id.type !== "Identifier") continue;
        statements.set(declarator.node.id.name, {
          start: declarator.node.start,
          end: declarator.node.end,
          line: declarator.node.loc.start.line,
          declarator: path.node.kind,
        });
      }
    }
  },
});

const text = (name) => {
  const record = statements.get(name);
  if (!record) return null;
  const body = source.slice(record.start, record.end);
  return record.declarator ? `${record.declarator} ${body};` : body;
};

const roots = [
  ...new Set(registries.flatMap(({ entries }) => entries.map(({ binding }) => binding))),
];

const owned = exclusiveOwners(index, roots);

const ownedBy = (root) =>
  new Set([...owned].filter(([, owner]) => owner === root).map(([name]) => name));

const everySignal = registries.flatMap(({ key, entries }) =>
  entries.map(({ id, stage, binding }) => ({
    id,
    module: key,
    stage,
    binding,
    ...collect(binding, {
      owned: ownedBy(binding),
    }),
  })),
);

const rank = rankByRarity(everySignal.map((signal) => signal.apis));
const rankEngine = rankByRarity(everySignal.map((signal) => signal.engine));

for (const signal of everySignal) {
  signal.apis = rank(signal.apis);
  signal.engine = rankEngine(signal.engine);
}

const block = (title, lines) =>
  lines.length ? [`// ${title}`, ...lines.map((line) => `//   ${line}`)] : [];

const wrap = (values, width = 96) => {
  const lines = [];
  let current = "";
  for (const value of values) {
    const piece = current ? `${current} ${value}` : value;
    if (piece.length > width) {
      if (current) lines.push(current);
      current = value;
    } else current = piece;
  }
  if (current) lines.push(current);
  return lines;
};

mkdirSync(OUT, {
  recursive: true,
});

for (const file of readdirSync(OUT)) rmSync(join(OUT, file));

const rows = [];

for (const signal of everySignal) {
  const mine = signal.helpers.filter((name) => owned.get(name) === signal.binding);
  const shared = signal.helpers.filter((name) => owned.get(name) !== signal.binding);
  const parts = [
    `// ${signal.id} — ${signal.binding}`,
    `// module ${signal.module}, ${signal.stage}, codes ${signal.codes.join(" ") || "none"}${signal.hashed ? ", value is a digest" : ""}`,
    "//",
    ...block("measures", wrap(signal.apis.slice(0, 12))),
    ...block("engine", wrap(signal.engine.slice(0, 8))),
    ...block(
      "status codes mean",
      Object.entries(signal.reasons).map(([code, reasons]) => `${code}: ${reasons.join(" / ")}`),
    ),
    ...block("reported value", signal.shapes.length ? [signal.shapes.join(" ")] : []),
    ...block("probes", wrap(signal.probes.map((value) => JSON.stringify(value)))),
    ...block("compares against", wrap(signal.constants)),
    ...block("decides on", signal.checks),
    ...(signal.truncated
      ? ["// the call graph walk hit its limit here, so the tests above are partial"]
      : []),
    "//",
    `// ${mine.length} owned helper${mine.length === 1 ? "" : "s"} inlined below.`,
    ...(shared.length
      ? block(
          `shared with other collectors, see ${CLEAN.split("/").pop()}:`,
          wrap(shared.map((name) => `${name}:${statements.get(name)?.line ?? "?"}`)),
        )
      : []),
    "",
  ];
  const bodies = [signal.binding, ...mine]
    .map((name) => ({
      name,
      line: statements.get(name)?.line ?? Infinity,
      body: text(name),
    }))
    .filter((entry) => entry.body)
    .sort((a, b) => a.line - b.line)
    .map((entry) => `// ${CLEAN.split("/").pop()}:${entry.line}\n${entry.body}`);
  const file = `${signal.id}.js`;
  writeFileSync(join(OUT, file), `${parts.join("\n")}\n${bodies.join("\n\n")}\n`);
  rows.push({
    signal,
    file,
    owned: mine.length,
    shared: shared.length,
  });
}

rows.sort((a, b) => Number(a.signal.id.slice(1)) - Number(b.signal.id.slice(1)));

writeFileSync(
  join(OUT, "README.md"),
  [
    "# Per-signal slices",
    "",
    "Generated by `npm run slice`. One file per wire signal id: the collector, every module-level",
    "helper only that collector can reach, and a header carrying what the signal measures, the status",
    "codes it can report, the constants it compares against and the tests it branches on.",
    "",
    "Helpers reachable from more than one collector are shared plumbing; they are listed with their",
    "line in `agent/agent.clean.js` rather than copied into every slice that touches them.",
    "",
    "A slice is source text, not a runnable program: it is cut out of the cleaned bundle and still",
    "refers to the globals, vault tables and shared helpers that live there.",
    "",
    "| id | module | stage | binding | own | shared | measures |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map(
      ({ signal, file, owned: own, shared }) =>
        `| [${signal.id}](${file}) | ${signal.module} | ${signal.stage.replace("stage", "")} | ${signal.binding} | ${own} | ${shared} | ${signal.apis.slice(0, 4).join(", ") || "-"} |`,
    ),
    "",
  ].join("\n"),
);

const totalOwned = rows.reduce((sum, row) => sum + row.owned, 0);

console.log(`slices  ${rows.length}`);

console.log(`owned   ${totalOwned} helpers inlined, ${owned.size} exclusively owned in the bundle`);

console.log(`out     ${OUT}`);
