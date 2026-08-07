#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REFERENCE, ARTIFACTS } from "./lib/paths.mjs";
import { loadCodec } from "./lib/codec.mjs";
import { captureFiles, payloadFromCapture, readJson } from "./lib/payloads.mjs";
import { KNOBS, READERS, knobPaths } from "./lib/knobs.mjs";
import { getPath, knobValue, setPath } from "./lib/address.mjs";
import { applyDigests, remintSession } from "./lib/derive.mjs";
import { runRules } from "./lib/coherence.mjs";

const OUT_DIR = join(ARTIFACTS, "profiles");
const args = process.argv.slice(2);
const has = (name) => args.includes(name);

const flag = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

const positional = args.filter(
  (argument, index) => !argument.startsWith("--") && !args[index - 1]?.startsWith("--"),
);

if (has("--help") || (!args.length && !has("--template"))) {
  console.log(`profile — compile a human-readable device profile into a wire payload

  node tools/profile.mjs <profile.json> [options]
  node tools/profile.mjs --template --donor chrome > profiles/mac-chrome.json

  --donor <label|file>  the capture the unmodelled signals are carried from
                          (default: the profile's own \`donor\`, else the newest capture)
  --template            read a donor back into a profile instead of compiling one
  --entropy <seed>      reseed the digests no node process can measure; default is the profile's
                          own \`entropy\`, and a profile without one keeps the donor's digests
  --no-remint           keep the donor's session uuids and clocks (they will read as a replay)
  --out <file>          where the payload goes (default artifacts/profiles/<name>.payload.json)
  --json                print the report as JSON

Send what it writes with:
  node tools/replay.mjs --payload artifacts/profiles/<name>.payload.json --as-origin <url> --result
`);
  process.exit(0);
}

const codec = await loadCodec({
  quiet: true,
});
const schemaPath = join(REFERENCE, "schema.json");

if (!existsSync(schemaPath)) throw new Error("schema.json missing — run npm run schema first");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const schemaKeys = new Map(schema.keys.map((row) => [row.id, row]));

function resolveDonor(reference) {
  if (reference && existsSync(reference)) return reference;
  const files = captureFiles();
  if (reference) {
    const match = files.find(
      (file) => basename(file).startsWith(`${reference}-`) || basename(file) === reference,
    );
    if (!match) throw new Error(`no capture for donor ${reference}`);
    return match;
  }
  if (!files.length) throw new Error("no captures — pass --donor <file>");
  return files[files.length - 1];
}

if (has("--template")) {
  const donorPath = resolveDonor(flag("--donor"));
  const donor = payloadFromCapture(codec, donorPath);
  const template = {
    name: basename(donorPath).replace(/\.json$/, ""),
    donor: flag("--donor") ?? donorPath,
    entropy: null,
  };
  for (const knob of knobPaths()) {
    const read = READERS[knob];
    if (!read) continue;
    const held = read(donor);
    if (held === undefined) continue;
    setPath(template, knob, held);
  }
  console.log(JSON.stringify(template, null, 2));
  process.exit(0);
}

const profilePath = positional[0] ?? flag("--profile");

if (!profilePath) throw new Error("no profile — pass a profile.json, or --template to write one");

const profile = readJson(profilePath);
const donorPath = resolveDonor(flag("--donor") ?? profile.donor);
const donor = payloadFromCapture(codec, donorPath);
const payload = JSON.parse(JSON.stringify(donor));

function validateTarget(path, value) {
  const [id, ...rest] = path.split(".");
  const row = schemaKeys.get(id);
  if (!row) return `${path}: ${id} is not a wire key`;
  let leaf;
  if (row.kind === "signal") {
    if (rest[0] !== "v") return `${path}: a signal is written through .v`;
    leaf = rest.slice(1).join(".");
  } else {
    leaf = rest.join(".");
  }
  const key = leaf ? `.${leaf}` : ".";
  const meta = row.shape[key];
  if (!meta) return `${path}: no leaf ${key} on ${id} in the schema`;
  const observed = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
  if (!meta.types.includes(observed)) {
    return `${path}: wrote ${observed}, the wire carries ${meta.types.join("|")}`;
  }
  return null;
}

const written = [];
const skipped = [];
const problems = [];

const groups = (name) =>
  (flag(name) ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const only = groups("--only");
const without = groups("--skip");

const inGroup = (knob, list) =>
  list.some((prefix) => knob === prefix || knob.startsWith(`${prefix}.`));

for (const entry of KNOBS) {
  if (only.length && !inGroup(entry.knob, only)) continue;
  if (without.length && inGroup(entry.knob, without)) continue;
  const held = knobValue(profile, entry.knob);
  if (held === undefined || held === null) {
    skipped.push({
      knob: entry.knob,
      targets: entry.targets,
      why: "absent from the profile",
    });
    continue;
  }
  const missing = (entry.requires ?? []).filter(
    (needed) => knobValue(profile, needed) === undefined,
  );
  if (missing.length) {
    problems.push(`${entry.knob}: needs ${missing.join(", ")}`);
    continue;
  }
  let value;
  try {
    value = entry.value(profile);
  } catch (error) {
    problems.push(`${entry.knob}: ${error.message}`);
    continue;
  }
  if (value === undefined) {
    skipped.push({
      knob: entry.knob,
      targets: entry.targets,
      why: "the knob produced nothing",
    });
    continue;
  }
  for (const target of entry.targets) {
    if (getPath(payload, target.replace(/\[\]/g, "")) === undefined && !target.includes("[]")) {
      const [id] = target.split(".");
      if (payload[id]?.s !== undefined && payload[id].s !== 0) {
        skipped.push({
          knob: entry.knob,
          targets: [target],
          why: `the donor reports ${id} as s${payload[id].s}`,
        });
        continue;
      }
    }
    const complaint = validateTarget(target, value);
    if (complaint) {
      problems.push(complaint);
      continue;
    }
    setPath(payload, target, value);
    written.push({
      knob: entry.knob,
      target,
      value,
    });
  }
}

const entropy = flag("--entropy") ?? profile.entropy ?? null;
const digests = applyDigests(payload, profile, codec, entropy);
const minted = has("--no-remint") ? [] : remintSession(payload, schema);
const findings = runRules(payload, profile, {
  donor,
});
const knownKnobs = new Set(knobPaths());
const declared = [];

(function collect(node, prefix) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (knownKnobs.has(path)) declared.push(path);
    else collect(value, path);
  }
})(profile, "");

const METADATA = ["name", "donor", "entropy", "notes", "source", "voices", "webgl", "audio"];

const unknown = Object.keys(profile).filter(
  (key) =>
    !METADATA.includes(key) && !declared.some((path) => path === key || path.startsWith(`${key}.`)),
);

const wireKeys = Object.keys(payload);
const ownedKeys = new Set(written.map((entry) => entry.target.split(".")[0]));

const derivedKeys = new Set([...digests, ...minted].map((entry) => entry.path.split(".")[0]));

const report = {
  profile: profilePath,
  donor: basename(donorPath),
  name: profile.name ?? basename(profilePath, ".json"),
  entropy,
  coverage: {
    wireKeys: wireKeys.length,
    fromProfile: ownedKeys.size,
    derived: derivedKeys.size,
    fromDonor: wireKeys.filter((key) => !ownedKeys.has(key) && !derivedKeys.has(key)).length,
  },
  written,
  skipped,
  digests,
  minted,
  problems,
  unknownKnobs: unknown,
  coherence: findings,
};

const outPath = flag("--out") ?? join(OUT_DIR, `${report.name}.payload.json`);

mkdirSync(OUT_DIR, {
  recursive: true,
});
writeFileSync(outPath, JSON.stringify(payload, null, 2));

writeFileSync(join(OUT_DIR, `${report.name}.report.json`), JSON.stringify(report, null, 2));

if (has("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`profile   ${report.name} (${basename(profilePath)})`);
  console.log(`donor     ${report.donor}`);
  console.log(
    `coverage  ${report.coverage.wireKeys} wire keys: ${report.coverage.fromProfile} from the profile, ` +
      `${report.coverage.derived} derived, ${report.coverage.fromDonor} carried from the donor`,
  );
  console.log(
    `written   ${written.length} positions from ${new Set(written.map((entry) => entry.knob)).size} knobs`,
  );
  console.log(
    `digests   ${digests.filter((entry) => entry.mode === "recomputed").length} recomputed, ` +
      `${digests.filter((entry) => entry.mode === "reseeded").length} reseeded`,
  );
  console.log(`session   ${minted.length} leaves reminted`);
  for (const problem of problems) console.log(`problem   ${problem}`);
  for (const knob of unknown) console.log(`unknown   ${knob} is not a knob this build maps`);
  const failed = findings.filter((finding) => finding.state === "fail");
  const warned = findings.filter((finding) => finding.state === "warn");
  const skippedRules = findings.filter((finding) => finding.state === "skipped");
  console.log(
    `coherence ${findings.filter((finding) => finding.state === "ok").length} ok, ${failed.length} fail, ` +
      `${warned.length} warn, ${skippedRules.length} not applicable`,
  );
  for (const finding of [...failed, ...warned]) {
    console.log(`  ${finding.state === "fail" ? "FAIL" : "warn"} ${finding.id}: ${finding.detail}`);
  }
  console.log(`out       ${outPath}`);
}

process.exit(problems.length || findings.some((finding) => finding.state === "fail") ? 1 : 0);
