#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REFERENCE } from "./lib/paths.mjs";
import { loadCodec } from "./lib/codec.mjs";
import { captureFiles, flattenSignals, labelOf, payloadsFrom } from "./lib/payloads.mjs";

const DIGEST = /^[0-9a-f]{32}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const EPOCH_MS = [1.4e12, 3e12];
const SAMPLES = 4;
const args = process.argv.slice(2);
const inputs = args.filter((argument) => !argument.startsWith("--"));

if (args.includes("--help")) {
  console.log(`schema — the payload's type map, from the static read joined against real captures

  node tools/schema.mjs [capture.json ...]

Writes artifacts/schema.json and artifacts/schema.md: one row per wire key, and for an object or
array value one row per leaf inside it, carrying the type, the observed values, whether the leaf is
a 32-hex digest, and whether it is session-scoped (a uuid, a clock reading, a heap size) and so has
to be reminted per send rather than replayed.
`);
  process.exit(0);
}

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
const captures = inputs.length ? inputs : captureFiles();

if (!captures.length) throw new Error("no captures — run npm run capture first, or pass a file");

function walkLeaves(value, path, into) {
  if (Array.isArray(value)) {
    record(into, path, {
      kind: "array",
      length: value.length,
    });
    for (const item of value) walkLeaves(item, `${path}[]`, into);
    return;
  }
  if (value && typeof value === "object") {
    record(into, path, {
      kind: "object",
      keys: Object.keys(value).sort(),
    });
    for (const key of Object.keys(value)) walkLeaves(value[key], `${path}.${key}`, into);
    return;
  }
  record(into, path, {
    kind: value === null ? "null" : typeof value,
    value,
  });
}

function record(into, path, entry) {
  if (!into.has(path)) into.set(path, []);
  into.get(path).push(entry);
}

function sessionScope(samples) {
  const strings = samples.filter((sample) => typeof sample.value === "string");
  const numbers = samples.filter((sample) => sample.kind === "number");
  if (strings.some((sample) => UUID.test(sample.value))) return "uuid";
  if (
    numbers.length &&
    numbers.every((sample) => sample.value >= EPOCH_MS[0] && sample.value <= EPOCH_MS[1])
  ) {
    return "clock";
  }
  if (
    numbers.length &&
    numbers.every((sample) => Number.isInteger(sample.value) && sample.value > 1e8)
  ) {
    return "counter";
  }
  if (
    numbers.length &&
    numbers.every(
      (sample) =>
        !Number.isInteger(sample.value) && String(sample.value).split(".")[1]?.length >= 8,
    )
  ) {
    return "measured";
  }
  return null;
}

const observations = new Map();
const labels = [];
const sources = [];

for (const path of captures) {
  if (!existsSync(path)) {
    console.warn(`skip ${path}: not found`);
    continue;
  }
  const label = labelOf(path);
  if (!labels.includes(label)) labels.push(label);
  for (const { origin, payload } of payloadsFrom(codec, path)) {
    const flat = flattenSignals(payload);
    const envelope = Object.keys(payload).filter((key) => !/^s\d+$/.test(key));
    sources.push({
      capture: basename(path),
      label,
      origin,
      signals: flat.length,
      envelope: envelope.length,
    });
    for (const entry of flat) {
      if (!observations.has(entry.id))
        observations.set(entry.id, {
          kind: "signal",
          seen: [],
        });
      observations.get(entry.id).seen.push({
        label,
        origin,
        s: entry.s,
        value: entry.v,
      });
    }
    for (const key of envelope) {
      if (!observations.has(key))
        observations.set(key, {
          kind: "envelope",
          seen: [],
        });
      observations.get(key).seen.push({
        label,
        origin,
        s: null,
        value: payload[key],
      });
    }
  }
}

if (!sources.length) throw new Error("no payload found in any capture");

const rows = [];

for (const [id, { kind, seen }] of observations) {
  const signal = registry.get(id) ?? null;
  const leaves = new Map();
  for (const entry of seen) {
    if (entry.s !== null && entry.s !== 0) continue;
    walkLeaves(entry.value, "", leaves);
  }
  const perLabel = {};
  for (const label of labels) {
    const first = seen.find((entry) => entry.label === label);
    perLabel[label] = first
      ? {
          s: first.s,
          value: first.value,
        }
      : null;
  }
  const present = Object.values(perLabel).filter(Boolean);
  const varies = new Set(present.map((entry) => JSON.stringify([entry.s, entry.value]))).size > 1;
  const shape = {};
  for (const [path, samples] of leaves) {
    const kinds = [...new Set(samples.map((sample) => sample.kind))];
    const values = samples.filter((sample) => "value" in sample).map((sample) => sample.value);
    const distinct = [...new Set(values.map((value) => JSON.stringify(value)))].map((text) =>
      JSON.parse(text),
    );
    const scope = sessionScope(samples);
    const digest = values.some((value) => typeof value === "string" && DIGEST.test(value));
    const numeric = values.filter((value) => typeof value === "number");
    shape[path || "."] = {
      types: kinds,
      digest,
      scope,
      distinct: distinct.length,
      samples: distinct.slice(0, SAMPLES),
      ...(kinds.includes("object")
        ? {
            keys: [...new Set(samples.flatMap((sample) => sample.keys ?? []))].sort(),
          }
        : {}),
      ...(kinds.includes("array")
        ? {
            lengths: [
              ...new Set(samples.map((sample) => sample.length).filter((n) => n !== undefined)),
            ],
          }
        : {}),
      ...(numeric.length
        ? {
            min: Math.min(...numeric),
            max: Math.max(...numeric),
          }
        : {}),
    };
  }
  const digestLeaves = Object.entries(shape)
    .filter(([, leaf]) => leaf.digest)
    .map(([path]) => path);
  const sessionLeaves = Object.entries(shape)
    .filter(([, leaf]) => leaf.scope)
    .map(([path]) => path);
  rows.push({
    id,
    kind,
    binding: signal?.binding ?? null,
    module: signal?.module ?? null,
    stage: signal?.stage ?? null,
    builtFrom: envelopeKeys.get(id) ?? null,
    codes: {
      static: signal?.codes ?? [],
      observed: [...new Set(seen.map((entry) => entry.s).filter((code) => code !== null))].sort(
        (a, b) => b - a,
      ),
    },
    hashed: signal?.hashed ?? null,
    varies,
    byLabel: perLabel,
    shape,
    digestLeaves,
    sessionLeaves,
  });
}

const numeric = (id) => Number(id.replace(/\D/g, "")) || 0;

rows.sort((a, b) =>
  a.kind === b.kind ? numeric(a.id) - numeric(b.id) : a.kind === "signal" ? -1 : 1,
);

const signalRows = rows.filter((row) => row.kind === "signal");

const out = {
  source: {
    signals: basename(signalsPath),
    captures: captures.map((path) => basename(path)),
  },
  labels,
  sources,
  totals: {
    keys: rows.length,
    signals: signalRows.length,
    envelope: rows.length - signalRows.length,
    varying: rows.filter((row) => row.varies).length,
    withDigest: rows.filter((row) => row.digestLeaves.length).length,
    withSession: rows.filter((row) => row.sessionLeaves.length).length,
    leaves: rows.reduce((total, row) => total + Object.keys(row.shape).length, 0),
    digestLeaves: rows.reduce((total, row) => total + row.digestLeaves.length, 0),
    sessionLeaves: rows.reduce((total, row) => total + row.sessionLeaves.length, 0),
    alwaysFailing: signalRows.filter((row) => row.codes.observed.every((code) => code !== 0))
      .length,
  },
  keys: rows,
};

writeFileSync(join(REFERENCE, "schema.json"), JSON.stringify(out, null, 2));

const cell = (text) =>
  String(text ?? "-")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");

const brief = (value) => {
  const text = JSON.stringify(value);
  return text === undefined ? "-" : text.length > 40 ? `${text.slice(0, 39)}…` : text;
};

const leafRows = [];

for (const row of rows) {
  for (const [path, leaf] of Object.entries(row.shape)) {
    if (leaf.types.includes("object") || leaf.types.includes("array")) continue;
    leafRows.push({
      key: `${row.id}${path === "." ? "" : path}`,
      type: leaf.types.join("|"),
      digest: leaf.digest ? "digest" : "",
      scope: leaf.scope ?? "",
      samples: leaf.samples.map(brief).join(" "),
    });
  }
}

writeFileSync(
  join(REFERENCE, "schema.md"),
  [
    "# Payload schema",
    "",
    "Generated by `npm run schema`. One row per addressable leaf of the POST body, joined from the",
    "static map in `signals.json` and the values real captures carried. This is the type map a",
    "synthesized payload is checked against: `npm run profile` writes through these paths and",
    "refuses one that is not here.",
    "",
    "`digest` marks a leaf whose value is a 32-hex mixer output, so it cannot be written by hand —",
    "it is either recomputed from inputs or carried over from a donor. `scope` marks a leaf whose",
    "value is session-bound rather than device-bound (`uuid`, `clock`, `counter`, `measured`), which",
    "is what has to be reminted per send so a replay does not present as the same event twice.",
    "",
    "## Totals",
    "",
    ...Object.entries(out.totals).map(([name, value]) => `- ${name}: ${value}`),
    "",
    "## Keys",
    "",
    `| key | kind | ≠ | codes | leaves | digest | session |`,
    `| --- | --- | --- | --- | --- | --- | --- |`,
    ...rows.map(
      (row) =>
        `| ${row.id} | ${cell(row.binding ?? row.builtFrom ?? row.kind)} | ${row.varies ? "≠" : ""} | ${cell(row.codes.observed.join(" "))} | ${Object.keys(row.shape).length} | ${row.digestLeaves.length} | ${row.sessionLeaves.length} |`,
    ),
    "",
    "## Leaves",
    "",
    "| path | type | note | scope | observed |",
    "| --- | --- | --- | --- | --- |",
    ...leafRows.map(
      (leaf) =>
        `| \`${cell(leaf.key)}\` | ${cell(leaf.type)} | ${cell(leaf.digest)} | ${cell(leaf.scope)} | ${cell(leaf.samples)} |`,
    ),
    "",
  ].join("\n"),
);

console.log(
  `captures  ${new Set(sources.map((source) => source.capture)).size} (${labels.join(", ")})`,
);

console.log(
  `keys      ${out.totals.keys} (${out.totals.signals} signals, ${out.totals.envelope} envelope)`,
);

console.log(`leaves    ${out.totals.leaves}`);

console.log(`digest    ${out.totals.digestLeaves} leaves in ${out.totals.withDigest} keys`);

console.log(`session   ${out.totals.sessionLeaves} leaves in ${out.totals.withSession} keys`);

console.log(`varying   ${out.totals.varying}`);
console.log(`out       ${join(REFERENCE, "schema.json")}`);
console.log(`out       ${join(REFERENCE, "schema.md")}`);
