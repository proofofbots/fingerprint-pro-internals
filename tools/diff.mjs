#!/usr/bin/env node
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";

import { basename, join } from "node:path";
import { REFERENCE } from "./lib/paths.mjs";

const BASELINES = join(REFERENCE, "baselines");
const CURRENT = join(REFERENCE, "signals.json");
const args = process.argv.slice(2);

const flag = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? null : (args[index + 1] ?? "");
};

const load = (path) => {
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  const map = new Map();
  for (const module of parsed.modules) {
    for (const signal of module.signals)
      map.set(signal.id, {
        module: module.key,
        ...signal,
      });
  }
  return map;
};

if (args.includes("--save")) {
  mkdirSync(BASELINES, {
    recursive: true,
  });
  const label = flag("--save") || new Date().toISOString().slice(0, 10);
  const target = join(BASELINES, `signals-${label}.json`);
  copyFileSync(CURRENT, target);
  console.log(`baseline ${target}`);
  process.exit(0);
}

const positional = args.filter((argument) => !argument.startsWith("--"));

const baselines = existsSync(BASELINES)
  ? readdirSync(BASELINES)
      .filter((file) => file.endsWith(".json"))
      .sort()
  : [];

const oldPath =
  positional[0] ?? (baselines.length ? join(BASELINES, baselines[baselines.length - 1]) : null);

const newPath = positional[1] ?? CURRENT;

if (!oldPath) {
  console.error(
    "no baseline: run `npm run diff -- --save` against a build worth comparing to first",
  );
  process.exit(1);
}

const before = load(oldPath);
const after = load(newPath);
const added = [...after.keys()].filter((id) => !before.has(id));
const removed = [...before.keys()].filter((id) => !after.has(id));

const listChange = (a = [], b = []) => {
  const gone = a.filter((value) => !b.includes(value));
  const fresh = b.filter((value) => !a.includes(value));
  return gone.length || fresh.length
    ? {
        gone,
        fresh,
      }
    : null;
};

const canonical = (value) =>
  String(value)
    .replace(/_fn\d*\b/g, "_fn#")
    .replace(/\b(fn|v|arg)\d+\b/g, "$1#");

const testChange = (a = [], b = []) => {
  const left = a.map(canonical);
  const right = b.map(canonical);
  const gone = a.filter((_, index) => !right.includes(left[index]));
  const fresh = b.filter((_, index) => !left.includes(right[index]));
  return gone.length || fresh.length
    ? {
        gone,
        fresh,
      }
    : null;
};

const changed = [];

for (const [id, next] of after) {
  const previous = before.get(id);
  if (!previous) continue;
  const change = {
    id,
    binding: next.binding,
  };
  if (previous.binding !== next.binding) change.renamed = [previous.binding, next.binding];
  if (previous.stage !== next.stage) change.stage = [previous.stage, next.stage];
  if (previous.hashed !== next.hashed) change.hashed = [previous.hashed, next.hashed];
  const apis = listChange(previous.apis, next.apis);
  if (apis) change.apis = apis;
  const codes = listChange(previous.codes.map(String), next.codes.map(String));
  if (codes) change.codes = codes;
  const shapes = listChange(previous.shapes, next.shapes);
  if (shapes) change.shapes = shapes;
  const checks = testChange(previous.checks, next.checks);
  if (checks)
    change.checks = {
      gone: checks.gone.length,
      fresh: checks.fresh.length,
      sample: checks.fresh.slice(0, 3),
    };
  const constants = listChange(previous.constants, next.constants);
  if (constants) change.constants = constants;
  if (Object.keys(change).length > 2) changed.push(change);
}

const out = {
  before: basename(oldPath),
  after: basename(newPath),
  totals: {
    before: before.size,
    after: after.size,
    added: added.length,
    removed: removed.length,
    changed: changed.length,
  },
  added: added.map((id) => ({
    id,
    binding: after.get(id).binding,
    apis: after.get(id).apis.slice(0, 4),
  })),
  removed: removed.map((id) => ({
    id,
    binding: before.get(id).binding,
  })),
  changed,
};

writeFileSync(join(REFERENCE, "diff.json"), JSON.stringify(out, null, 2));

const bullets = (change) => {
  const lines = [];
  if (change.renamed) lines.push(`renamed \`${change.renamed[0]}\` to \`${change.renamed[1]}\``);
  if (change.stage) lines.push(`stage ${change.stage[0]} to ${change.stage[1]}`);
  if (change.hashed) lines.push(`hashed ${change.hashed[0]} to ${change.hashed[1]}`);
  if (change.apis?.fresh?.length)
    lines.push(`reads \`${change.apis.fresh.slice(0, 4).join("`, `")}\``);
  if (change.apis?.gone?.length)
    lines.push(`no longer reads \`${change.apis.gone.slice(0, 4).join("`, `")}\``);
  if (change.codes?.fresh?.length) lines.push(`new codes ${change.codes.fresh.join(" ")}`);
  if (change.codes?.gone?.length) lines.push(`dropped codes ${change.codes.gone.join(" ")}`);
  if (change.shapes?.fresh?.length) lines.push(`value shape \`${change.shapes.fresh.join(" ")}\``);
  if (change.constants?.fresh?.length)
    lines.push(
      `compares against ${change.constants.fresh
        .slice(0, 4)
        .map((value) => `\`${value}\``)
        .join(" ")}`,
    );
  if (change.checks) lines.push(`${change.checks.fresh} new tests, ${change.checks.gone} gone`);
  return lines;
};

writeFileSync(
  join(REFERENCE, "diff.md"),
  [
    "# Signal map diff",
    "",
    `\`${out.before}\` to \`${out.after}\`: ${out.totals.added} added, ${out.totals.removed} removed, ${out.totals.changed} changed.`,
    "",
    "Compares the generated map, not the bundle, so a change here is a change in what the agent",
    "measures or reports — not a change in how it was minified. Save a baseline before pulling a new",
    "agent with `npm run diff -- --save`.",
    "",
    ...(added.length
      ? [
          "## Added",
          "",
          ...out.added.map(
            (entry) =>
              `- \`${entry.id}\` \`${entry.binding}\` — ${entry.apis.join(", ") || "no surface"}`,
          ),
          "",
        ]
      : []),
    ...(removed.length
      ? [
          "## Removed",
          "",
          ...out.removed.map((entry) => `- \`${entry.id}\` \`${entry.binding}\``),
          "",
        ]
      : []),
    ...(changed.length
      ? [
          "## Changed",
          "",
          ...changed.flatMap((change) => [
            `### ${change.id} — \`${change.binding}\``,
            "",
            ...bullets(change).map((line) => `- ${line}`),
            "",
          ]),
        ]
      : []),
  ].join("\n"),
);

console.log(`before   ${out.before} (${out.totals.before} signals)`);
console.log(`after    ${out.after} (${out.totals.after} signals)`);
console.log(`added    ${out.totals.added}`);
console.log(`removed  ${out.totals.removed}`);
console.log(`changed  ${out.totals.changed}`);
console.log(`out      ${join(REFERENCE, "diff.md")}`);
