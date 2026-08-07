#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { REFERENCE, CLEAN_AGENT } from "./lib/paths.mjs";
import { findStatusError } from "./lib/surface.mjs";

const traverse = traverseModule.default ?? traverseModule;
const CLEAN = CLEAN_AGENT;
const source = readFileSync(CLEAN, "utf8");
const ast = parse(source, {
  sourceType: "module",
});
const statusError = findStatusError(ast);

if (!statusError) console.warn("no status error class found — throw sites will be missing");

const numeric = (node) => {
  if (node?.type === "NumericLiteral") return node.value;
  if (
    node?.type === "UnaryExpression" &&
    node.operator === "-" &&
    node.argument.type === "NumericLiteral"
  ) {
    return -node.argument.value;
  }
  return null;
};

function owningBinding(path) {
  let current = path;
  while (current) {
    const parent = current.parentPath;
    if (parent?.isProgram()) {
      if (current.isFunctionDeclaration() || current.isClassDeclaration())
        return current.node.id?.name ?? null;
      if (current.isVariableDeclaration()) return current.node.declarations[0]?.id?.name ?? null;
      if (current.isExportNamedDeclaration()) return null;
      return null;
    }
    if (parent?.isVariableDeclarator() && parent.parentPath?.parentPath?.isProgram()) {
      return parent.node.id?.name ?? null;
    }
    current = parent;
  }
  return null;
}

const sites = [];

const record = (code, entry) => {
  if (code === null || code > 0 || code < -200) return;
  sites.push({
    code,
    ...entry,
  });
};

traverse(ast, {
  NewExpression(path) {
    if (path.node.callee.name !== statusError) return;
    const message = path.node.arguments[1];
    const reason =
      message?.type === "StringLiteral"
        ? message.value
        : message?.type === "TemplateLiteral"
          ? message.quasis.map((quasi) => quasi.value.cooked).join("${}")
          : null;
    record(numeric(path.node.arguments[0]), {
      kind: "thrown",
      reason,
      owner: owningBinding(path),
      line: path.node.loc.start.line,
    });
  },
  ObjectExpression(path) {
    const property = path.node.properties.find(
      (candidate) => !candidate.computed && (candidate.key?.name ?? candidate.key?.value) === "s",
    );
    if (!property) return;
    const code = numeric(property.value);
    if (code === null) return;
    record(code, {
      kind: path.findParent((parent) => parent.isCatchClause()) ? "caught" : "returned",
      reason: null,
      owner: owningBinding(path),
      line: path.node.loc.start.line,
    });
  },
  CallExpression(path) {
    const callee = path.node.callee;
    if (callee.type !== "Identifier") return;
    const binding = path.scope.getBinding(callee.name);
    if (!binding || !binding.path.parentPath?.isProgram()) {
      if (!binding || binding.scope.block.type !== "Program") return;
    }
    const numbers = path.node.arguments.map(numeric);
    const deadline = numbers.find((value) => value !== null && value > 0);
    for (const value of numbers) {
      if (value === null || value >= 0 || value < -20) continue;
      record(value, {
        kind: deadline ? `fallback after ${deadline}ms` : "fallback",
        reason: null,
        owner: owningBinding(path),
        line: path.node.loc.start.line,
        via: callee.name,
      });
    }
  },
});

const signalsPath = join(REFERENCE, "signals.json");

const signals = existsSync(signalsPath)
  ? JSON.parse(readFileSync(signalsPath, "utf8")).modules.flatMap((module) => module.signals)
  : [];

const observedPath = join(REFERENCE, "observed.json");

const observed = existsSync(observedPath) ? JSON.parse(readFileSync(observedPath, "utf8")) : null;

const codes = new Map();

for (const site of sites) {
  if (!codes.has(site.code)) {
    codes.set(site.code, {
      code: site.code,
      sites: [],
      kinds: new Map(),
      reasons: new Set(),
    });
  }
  const entry = codes.get(site.code);
  entry.sites.push(site);
  entry.kinds.set(site.kind, (entry.kinds.get(site.kind) ?? 0) + 1);
  if (site.reason) entry.reasons.add(site.reason.slice(0, 90));
}

const rows = [...codes.values()].sort((a, b) => b.code - a.code);

for (const row of rows) {
  row.signals = signals
    .filter((signal) => signal.codes.includes(row.code))
    .map((signal) => signal.id);
  row.observed = observed
    ? observed.signals
        .filter((signal) => signal.observedCodes.includes(row.code))
        .map((signal) => signal.id)
    : [];
  row.kinds = Object.fromEntries(row.kinds);
  row.reasons = [...row.reasons].sort();
  const total = row.sites.length;
  const caught = row.kinds.caught ?? 0;
  const deadline = Object.keys(row.kinds).find((kind) => kind.startsWith("fallback after"));
  row.summary = row.reasons.length
    ? null
    : caught === total
      ? `every site is inside a \`catch\`: reported when something on the collector's path threw`
      : deadline
        ? `one site is a ${deadline.replace("fallback after ", "deadline of ")}, the rest are direct returns`
        : null;
}

writeFileSync(
  join(REFERENCE, "codes.json"),
  JSON.stringify(
    {
      source: "agent/agent.clean.js",
      statusError,
      totals: {
        codes: rows.length,
        sites: sites.length,
      },
      codes: rows.map(
        ({ code, kinds, reasons, signals: reachable, observed: seen, sites: where }) => ({
          code,
          kinds,
          reasons,
          signals: reachable,
          observed: seen,
          sites: where.map(({ owner, line, kind, via }) => ({
            owner,
            line,
            kind,
            via,
          })),
        }),
      ),
    },
    null,
    2,
  ),
);

const list = (values, limit = 14) =>
  values.length > limit
    ? `${values.slice(0, limit).join(" ")} +${values.length - limit}`
    : values.join(" ");

writeFileSync(
  join(REFERENCE, "codes.md"),
  [
    "# Status codes",
    "",
    "Generated by `npm run codes`. Every site in `agent/agent.clean.js` that can put a value in a",
    "signal's `s`, grouped by the code it produces.",
    "",
    `A failed signal is reported by throwing \`${statusError}(code, message)\`, which the \`{s, v}\``,
    "wrapper turns into the status. Those throws are the only place the meaning of a code is written",
    "down, so the messages below are the agent's own words, not an interpretation. `returned` sites",
    "build the object directly, `caught` ones do it in a `catch`, and a `fallback after Nms` is a",
    "deadline handed to an internal helper.",
    "",
    "| code | sites | kinds | reported by | seen on the wire |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.code} | ${row.sites.length} | ${Object.entries(row.kinds)
          .map(([kind, count]) => `${kind} ${count}`)
          .join(
            ", ",
          )} | ${row.signals.length} signals | ${row.observed.length ? list(row.observed, 8) : "-"} |`,
    ),
    "",
    ...rows.flatMap((row) => [
      `## ${row.code}`,
      "",
      ...(row.reasons.length
        ? ["The agent's own messages:", "", ...row.reasons.map((reason) => `- ${reason}`), ""]
        : [`No thrown message carries this code${row.summary ? `; ${row.summary}` : ""}.`, ""]),
      `Reported by: ${row.signals.length ? list(row.signals) : "no registered signal"}`,
      "",
      `Sites: ${list(
        row.sites.map((site) => `${site.owner ?? "?"}:${site.line}`),
        12,
      )}`,
      "",
    ]),
  ].join("\n"),
);

console.log(`status error  ${statusError}`);
console.log(`codes         ${rows.length}`);
console.log(`sites         ${sites.length}`);

for (const row of rows) {
  console.log(
    `  ${String(row.code).padStart(4)}  ${String(row.sites.length).padStart(3)} sites  ${row.signals.length} signals  ${row.reasons[0] ?? ""}`,
  );
}

console.log(`out           ${join(REFERENCE, "codes.md")}`);
