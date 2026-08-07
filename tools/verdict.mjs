#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ARTIFACTS } from "./lib/paths.mjs";
import { readJson } from "./lib/payloads.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const WORK = join(ARTIFACTS, "profiles", "runs");
const DEFAULT_ORIGIN = "https://demo.fingerprint.com";
const args = process.argv.slice(2);
const has = (name) => args.includes(name);

const flag = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

const positional = args.filter(
  (argument, index) => !argument.startsWith("--") && !args[index - 1]?.startsWith("--"),
);

if (has("--help") || !positional.length) {
  console.log(`verdict — compile a profile, send it, print the server's answer as one row

  node tools/verdict.mjs <profile.json> [options]

  --only <knobs>     comma-separated knob prefixes to apply, everything else stays the donor's
  --skip <knobs>     comma-separated knob prefixes to leave out
  --label <text>     what to call this run in the output
  --entropy <seed>   digest seed; fixed across a bisect keeps the digests from moving with it
  --as-origin <url>  origin to present as, default ${DEFAULT_ORIGIN}
  --ua <string>      User-Agent header, default the profile's own
  --keep             keep the compiled payload instead of deleting it

Bisecting which knob draws a verdict is what this is for:

  node tools/verdict.mjs p.json --label base --only nothing
  node tools/verdict.mjs p.json --label os   --only browser,os,uach
  node tools/verdict.mjs p.json --label hw   --only hardware,screen,window
`);
  process.exit(0);
}

const profilePath = positional[0];
const profile = readJson(profilePath);
const label = flag("--label") ?? basename(profilePath, ".json");
const origin = flag("--as-origin", DEFAULT_ORIGIN);
const userAgent = flag("--ua") ?? profile.browser?.userAgent;

mkdirSync(WORK, {
  recursive: true,
});

const payloadPath = join(WORK, `${label}.payload.json`);
const resultPath = join(WORK, `${label}.sent.json`);
const compileArgs = [join(HERE, "profile.mjs"), profilePath, "--out", payloadPath];

for (const name of ["--only", "--skip", "--donor", "--entropy"]) {
  if (flag(name)) compileArgs.push(name, flag(name));
}

if (has("--no-remint")) compileArgs.push("--no-remint");

let compiled = "";

try {
  compiled = execFileSync("node", compileArgs, {
    encoding: "utf8",
  });
} catch (error) {
  compiled = `${error.stdout ?? ""}${error.stderr ?? ""}`;
}

const written = (compiled.match(/written\s+(\d+) positions/) ?? [])[1] ?? "?";
const failures = compiled.split("\n").filter((line) => line.includes("FAIL ")).length;

const replayArgs = [
  join(HERE, "replay.mjs"),
  "--payload",
  payloadPath,
  "--as-origin",
  origin,
  "--result",
  "--out",
  resultPath,
];

if (userAgent) replayArgs.push("--ua", userAgent);
if (flag("--proxy")) replayArgs.push("--proxy", flag("--proxy"));

execFileSync("node", replayArgs, {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

const verdictPath = `${resultPath}.result.json`;

if (!existsSync(verdictPath)) {
  console.log(`${label}\tno verdict — the post was rejected before an event existed`);
  process.exit(1);
}

const verdict = JSON.parse(readFileSync(verdictPath, "utf8"));
const attributes = verdict.raw_device_attributes ?? {};

const row = {
  label,
  written: Number(written),
  coherenceFails: failures,
  suspect: verdict.suspect_score,
  bot: verdict.bot,
  tampering: verdict.tampering,
  tamperingMl: verdict.tampering_ml_score,
  anomaly: verdict.tampering_details?.anomaly_score,
  antiDetect: verdict.tampering_details?.anti_detect_browser,
  vm: verdict.virtual_machine,
  vmMl: verdict.virtual_machine_ml_score,
  incognito: verdict.incognito,
  privacy: verdict.privacy_settings,
  rareDevice: verdict.rare_device,
  replayed: verdict.replayed,
  visitor: verdict.identification?.visitor_id,
  confidence: verdict.identification?.confidence?.score,
  os: `${verdict.os} ${verdict.os_version ?? ""}`.trim(),
  memory: attributes.device_memory,
  cores: attributes.hardware_concurrency,
  platform: attributes.platform,
};

if (has("--json")) {
  console.log(JSON.stringify(row));
} else {
  console.log(
    [
      row.label.padEnd(16),
      `w${row.written}`.padEnd(5),
      `suspect ${row.suspect}`.padEnd(12),
      `tamper ${row.tampering ? "Y" : "n"} ${row.tamperingMl}`.padEnd(20),
      `anomaly ${row.anomaly}`.padEnd(12),
      `antidetect ${row.antiDetect ? "Y" : "n"}`.padEnd(14),
      `vm ${row.vm ? "Y" : "n"} ${row.vmMl}`.padEnd(14),
      `incog ${row.incognito ? "Y" : "n"}`.padEnd(9),
      `replayed ${row.replayed ? "Y" : "n"}`.padEnd(12),
      row.os,
    ].join(""),
  );
}

if (!has("--keep")) {
  for (const path of [payloadPath, resultPath]) if (existsSync(path)) unlinkSync(path);
}
