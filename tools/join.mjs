#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REFERENCE, CAPTURES, ARTIFACTS } from "./lib/paths.mjs";
import { loadCodec } from "./lib/codec.mjs";
import { flattenSignals, labelOf, payloadsFrom } from "./lib/payloads.mjs";

const PREVIEW = 64;
const CELL = 30;
const inputs = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));

const captures = inputs.length
  ? inputs
  : readdirSync(CAPTURES)
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => join(CAPTURES, file));

if (!captures.length) throw new Error("no captures — run npm run capture, or pass files");

const signalsPath = join(REFERENCE, "signals.json");

if (!existsSync(signalsPath)) throw new Error("signals.json missing — run npm run signals first");

const registry = new Map();

for (const module of JSON.parse(readFileSync(signalsPath, "utf8")).modules) {
  for (const signal of module.signals)
    registry.set(signal.id, {
      module: module.key,
      ...signal,
    });
}

const envelopePath = join(REFERENCE, "envelope.json");

const envelopeKeys = new Map(
  existsSync(envelopePath)
    ? JSON.parse(readFileSync(envelopePath, "utf8")).keys.map(({ key, expression }) => [
        key,
        expression,
      ])
    : [],
);

const codec = await loadCodec({
  quiet: true,
});

const describe = (value) => {
  if (value === null || value === undefined)
    return {
      type: "null",
      preview: "null",
    };
  if (Array.isArray(value)) {
    const kinds = [...new Set(value.map((item) => (item === null ? "null" : typeof item)))];
    return {
      type: "array",
      length: value.length,
      of: kinds,
      preview: JSON.stringify(value).slice(0, PREVIEW),
    };
  }
  if (typeof value === "object") {
    return {
      type: "object",
      keys: Object.keys(value).sort(),
      preview: JSON.stringify(value).slice(0, PREVIEW),
    };
  }
  if (typeof value === "string") {
    return {
      type: "string",
      length: value.length,
      hex32: /^[0-9a-f]{32}$/.test(value),
      preview: value.length > PREVIEW ? `${value.slice(0, PREVIEW)}…` : value,
    };
  }
  return {
    type: typeof value,
    preview: String(value),
  };
};

const observations = new Map();
const sources = [];
const labels = [];

for (const path of captures) {
  if (!existsSync(path)) {
    console.warn(`skip ${path}: not found`);
    continue;
  }
  const label = labelOf(path);
  if (!labels.includes(label)) labels.push(label);
  for (const { origin, url, payload } of payloadsFrom(codec, path)) {
    const flat = flattenSignals(payload);
    sources.push({
      capture: basename(path),
      label,
      origin,
      url,
      signals: flat.length,
    });
    for (const entry of flat) {
      if (!observations.has(entry.id)) observations.set(entry.id, []);
      observations.get(entry.id).push({
        label,
        origin,
        s: entry.s,
        path: entry.path,
        ...describe(entry.v),
      });
    }
  }
}

if (sources.length === 0) throw new Error("no payload found in any capture");

function reconcile(signal, seen) {
  const notes = [];
  const codes = [...new Set(seen.map((entry) => entry.s))].sort((a, b) => b - a);
  const unexpected = codes.filter((code) => !signal.codes.includes(code));
  if (unexpected.length) notes.push(`code ${unexpected.join(" ")} not in source`);
  const objectShapes = signal.shapes.filter((shape) => shape.startsWith("{"));
  const open = objectShapes.some((shape) => shape.includes("..."));
  const declared = new Set(
    objectShapes.flatMap((shape) => shape.slice(1, -1).split(",").filter(Boolean)),
  );
  if (declared.size && !open) {
    const extra = [
      ...new Set(seen.flatMap((entry) => entry.keys ?? []).filter((key) => !declared.has(key))),
    ];
    if (extra.length) notes.push(`keys ${extra.slice(0, 6).join(" ")} not in source`);
  }
  if (seen.some((entry) => entry.hex32) && !signal.hashed)
    notes.push("digest value, no hash call found");
  return {
    codes,
    notes,
  };
}

const cellText = (entry) => {
  if (!entry) return "—";
  if (entry.s !== 0) return `s${entry.s}`;
  if (entry.type === "object") return `{${(entry.keys ?? []).join(",")}}`.slice(0, CELL);
  if (entry.type === "array") return `[${entry.length}]`;
  if (entry.type === "string" && entry.hex32) return `#${entry.preview.slice(0, 8)}`;
  return String(entry.preview).slice(0, CELL);
};

const rows = [];

for (const [id, seen] of observations) {
  const signal = registry.get(id) ?? null;
  const unregistered = envelopeKeys.has(id)
    ? `envelope key, ${envelopeKeys.get(id)}`
    : "not in any sources registry";
  const { codes, notes } = signal
    ? reconcile(signal, seen)
    : {
        codes: [...new Set(seen.map((entry) => entry.s))],
        notes: [unregistered],
      };
  const perLabel = {};
  for (const label of labels) {
    const first = seen.find((entry) => entry.label === label);
    perLabel[label] = first
      ? {
          s: first.s,
          type: first.type,
          cell: cellText(first),
          preview: first.preview,
        }
      : null;
  }
  const present = Object.values(perLabel).filter(Boolean);
  const varies = new Set(present.map((entry) => `${entry.s}|${entry.cell}`)).size > 1;
  const reasons = signal?.reasons ?? {};
  const explained = codes
    .filter((code) => code !== 0 && reasons[code])
    .map((code) => `${code}: ${reasons[code][0]}`);
  rows.push({
    id,
    binding: signal?.binding ?? null,
    module: signal?.module ?? null,
    stage: signal?.stage ?? null,
    staticCodes: signal?.codes ?? [],
    observedCodes: codes,
    why: explained,
    byBrowser: perLabel,
    varies,
    missing: labels.filter((label) => !perLabel[label]),
    observed: seen,
    notes,
  });
}

const missing = [...registry.keys()].filter((id) => !observations.has(id));
const numeric = (id) => Number(id.replace(/\D/g, "")) || 0;

rows.sort((a, b) => numeric(a.id) - numeric(b.id));

const out = {
  labels,
  sources,
  totals: {
    captures: new Set(sources.map((source) => source.capture)).size,
    payloads: sources.length,
    observed: rows.length,
    registered: registry.size,
    envelope: rows.filter((row) => !row.binding && envelopeKeys.has(row.id)).length,
    unregistered: rows.filter((row) => !row.binding && !envelopeKeys.has(row.id)).length,
    neverObserved: missing.length,
    varying: rows.filter((row) => row.varies).length,
    failing: rows.filter((row) => row.observedCodes.some((code) => code !== 0)).length,
    disagreements: rows.filter((row) => row.binding && row.notes.length).length,
  },
  signals: rows,
  neverObserved: missing.sort((a, b) => numeric(a) - numeric(b)),
};

writeFileSync(join(REFERENCE, "observed.json"), JSON.stringify(out, null, 2));

const cell = (text) => String(text ?? "-").replace(/\|/g, "\\|");

writeFileSync(
  join(REFERENCE, "observed.md"),
  [
    "# Observed signals",
    "",
    "Generated by `npm run join`. Joins the static map in `signals.json` against what captures",
    "actually carried, one column per browser, so a row is what the collector reports on real",
    "hardware next to what its source says it can report.",
    "",
    "A cell is the reported value: `sN` where the status was non-zero, `{a,b}` for an object's keys,",
    "`[n]` for an array's length, `#abcd1234` for a digest, the value itself otherwise. `≠` marks a",
    "signal whose value differs between browsers, which is the set an anti-detect build has to keep",
    "coherent; everything else is constant across all of them.",
    "",
    "`notes` is where static and observed disagree: a status code no branch produces, object keys the",
    "source never names, a digest from a collector with no hash call on its path. Each is a gap in",
    "the static read.",
    "",
    "## Captures",
    "",
    "| capture | browser | origin | signals | url |",
    "| --- | --- | --- | --- | --- |",
    ...sources.map(
      (source) =>
        `| ${cell(source.capture)} | ${cell(source.label)} | ${cell(source.origin)} | ${source.signals} | ${cell((source.url ?? "-").slice(0, 60))} |`,
    ),
    "",
    "## Signals",
    "",
    `| id | binding | ≠ | ${labels.join(" | ")} | notes |`,
    `| --- | --- | --- | ${labels.map(() => "---").join(" | ")} | --- |`,
    ...rows.map((row) => {
      const cells = labels.map((label) => `\`${cell(row.byBrowser[label]?.cell ?? "—")}\``);
      const notes = [...row.notes, ...row.why].join("; ");
      return `| ${row.id} | ${cell(row.binding)} | ${row.varies ? "≠" : ""} | ${cells.join(" | ")} | ${cell(notes || "-")} |`;
    }),
    "",
    "## Registered but never observed",
    "",
    missing.length ? out.neverObserved.map((id) => `\`${id}\``).join(" ") : "none",
    "",
  ].join("\n"),
);

console.log(`captures     ${out.totals.captures} (${labels.join(", ")})`);
console.log(`payloads     ${out.totals.payloads}`);

console.log(`observed     ${out.totals.observed} of ${out.totals.registered} registered`);

console.log(`varying      ${out.totals.varying}`);
console.log(`failing      ${out.totals.failing}`);
console.log(`envelope     ${out.totals.envelope}`);
console.log(`unregistered ${out.totals.unregistered}`);
console.log(`never seen   ${out.totals.neverObserved}`);
console.log(`disagree     ${out.totals.disagreements}`);
console.log(`out          ${join(REFERENCE, "observed.json")}`);
console.log(`out          ${join(REFERENCE, "observed.md")}`);
