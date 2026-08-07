#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ARTIFACTS } from "./lib/paths.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPLAY = join(HERE, "replay.mjs");
const OUTDIR = join(ARTIFACTS, "distill");
const execFileP = promisify(execFile);
const args = process.argv.slice(2);

const flag = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : (args[i + 1] ?? fallback);
};

const has = (name) => args.includes(name);

if (has("--help") || args.length === 0) {
  console.log(`distill — attribute server-side detections to input signals with a small request budget

  node tools/distill.mjs --from <capture.json> [options]

  --from <file>       capture to mutate (passed straight to replay.mjs)
  --as-origin <url>   rewrite the capture origin (default https://demo.fingerprint.com)
  --budget <n>        screening: max replays INCLUDING the baseline (default 5)
  --only <a,b>        run only these bundle ids
  --ofat <id>         one-factor-at-a-time: split a bundle into per-signal replays so each output
                        traces to a single input. baseline + one replay per set in the bundle
  --max <n>           hard ceiling on total replays across the whole run (default 100)
  --threads <n>       concurrent replays, rolling (a new one starts the instant one finishes,
                        default 50). baseline always runs alone first
  --soak              after the ofat replays, keep firing to --max to find the rate-limit ceiling
                        (stops after 3 consecutive failures). throughput is recorded, not attributed
  --proxy <spec>      one SOCKS5 base line (socks5://host:port:user:pass). The session-XXXX token
                        in it is ignored — a fresh random one is generated per replay, so N replays
                        leave from N exit IPs. One line is all you need; no pre-made session list
  --proxies <file>    optional: several DISTINCT base lines (different creds/endpoints), round-robin.
                        sessions are still auto-generated per replay on top of whichever line is used
  --dry               print the plan, send nothing

Default screening flips whole bundles (fast, coarse). --ofat isolates one bundle to per-signal
attribution. --soak reuses the ofat traffic to measure how many replays land before the endpoint
starts refusing, so the rate-limit curve comes for free instead of a separate hammer test.`);
  process.exit(0);
}

const from = flag("--from");

if (!from) throw new Error("--from <capture.json> is required");

const asOrigin = flag("--as-origin", "https://demo.fingerprint.com");
const budget = Number(flag("--budget", "5"));
const maxReplays = Number(flag("--max", "100"));
const ofatId = flag("--ofat");
const soak = has("--soak");
const threads = Math.max(1, Number(flag("--threads", "50")));

const proxies = (() => {
  const file = flag("--proxies");
  if (file)
    return readFileSync(file, "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
  const one = flag("--proxy");
  return one ? [one] : [];
})();

const proxyFor = (i) => (proxies.length ? proxies[i % proxies.length] : null);

const OUTPUTS = {
  suspect_score: "suspect_score",
  bot: "bot",
  tampering: "tampering",
  tampering_ml: "tampering_ml_score",
  anomaly: "tampering_details.anomaly_score",
  anti_detect: "tampering_details.anti_detect_browser",
  vm_ml: "virtual_machine_ml_score",
  incognito: "incognito",
  privacy_settings: "privacy_settings",
  devtools: "developer_tools",
  rare_device: "rare_device",
  rare_bucket: "rare_device_percentile_bucket",
  confidence: "identification.confidence.score",
};

const ECHOES = {
  e_hw: "raw_device_attributes.hardware_concurrency",
  e_mem: "raw_device_attributes.device_memory",
  e_color: "raw_device_attributes.color_depth",
  e_screen: "raw_device_attributes.screen_resolution",
  e_platform: "raw_device_attributes.platform",
  e_vendor: "raw_device_attributes.vendor",
  e_langs: "raw_device_attributes.languages",
  e_canvas: "raw_device_attributes.canvas.text",
  e_wglrend: "raw_device_attributes.webgl_basics.renderer_unmasked",
};

const BUNDLES = [
  {
    id: "tamper-mismatch",
    hypothesis: "cross-signal inconsistency (UA=Windows/Chrome while platform+vendor stay macOS)",
    targets: ["navigator.userAgent", "navigator.platform", "navigator.vendor"],
    sets: [
      [
        "s101",
        '"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.34 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.34"',
      ],
      ["s58.p", '"Windows"'],
    ],
  },
  {
    id: "rare-hardware",
    hypothesis: "implausible hardware profile (64 cores, 128GB, 8K screen)",
    targets: ["navigator.hardwareConcurrency", "navigator.deviceMemory", "screen"],
    sets: [
      ["s7", "64"],
      ["s4", "128"],
      ["s5", "[7680,4320]"],
    ],
  },
  {
    id: "bot-surface",
    hypothesis: "automation surface (no plugins, empty languages)",
    targets: ["navigator.plugins", "navigator.languages"],
    sets: [
      ["s16", "[]"],
      ["s117", "0"],
      ["s83", "[]"],
    ],
  },
  {
    id: "locale-shift",
    hypothesis: "locale far from IP geo (zh-CN languages)",
    targets: ["navigator.languages"],
    sets: [["s83", '["zh-CN","zh"]']],
  },
  {
    id: "identity-canvas",
    hypothesis: "novel canvas fingerprint (unseen text+geometry hash)",
    targets: ["canvas"],
    sets: [
      ["s17.v.text", '"ffffffffffffffffffffffffffffffff"'],
      ["s17.v.geometry", '"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"'],
    ],
  },
];

const only = flag("--only");
const selected = only ? BUNDLES.filter((b) => only.split(",").includes(b.id)) : BUNDLES;

function get(obj, path) {
  return path.split(".").reduce((n, k) => (n == null ? undefined : n[k]), obj);
}

const fmt = (v) => (v === undefined ? "-" : typeof v === "object" ? JSON.stringify(v) : String(v));

let sentCount = 0;
const soakLog = [];

async function runReplay(sets, tag, proxy) {
  const out = join(OUTDIR, `${tag.replace(/[^\w.-]/g, "_")}.json`);
  const resultFile = `${out}.result.json`;
  rmSync(resultFile, {
    force: true,
  });
  const argv = [REPLAY, "--from", from, "--as-origin", asOrigin, "--result", "--out", out];
  if (proxy) argv.push("--proxy", proxy);
  for (const [path, value] of sets) argv.push("--set", `${path}=${value}`);
  const started = Date.now();
  let log = "";
  try {
    const { stdout } = await execFileP("node", argv, {
      encoding: "utf8",
      maxBuffer: 1 << 24,
    });
    log = stdout;
  } catch (e) {
    log = `${e.stdout ?? ""}${e.stderr ?? ""}`;
  }
  sentCount += 1;
  const ms = Date.now() - started;
  const postStatus = Number(/post\s+frame\s+(\d+)/.exec(log)?.[1]) || null;
  const bffStatus = Number(/result\s+(\d+)/.exec(log)?.[1]) || null;
  const event = existsSync(resultFile) ? JSON.parse(readFileSync(resultFile, "utf8")) : null;
  const ok = postStatus === 200 && !!event;
  const session = /session ([A-Za-z0-9]+)/.exec(log)?.[1] ?? null;
  const ip = event?.ip_address ?? null;
  return {
    event,
    postStatus,
    bffStatus,
    ok,
    ms,
    log,
    session,
    ip,
  };
}

function extract(event) {
  const row = {};
  for (const [label, path] of Object.entries({
    ...OUTPUTS,
    ...ECHOES,
  }))
    row[label] = get(event, path);
  return row;
}

function buildUnits() {
  if (ofatId) {
    const bundle = BUNDLES.find((b) => b.id === ofatId);
    if (!bundle)
      throw new Error(
        `--ofat: unknown bundle ${ofatId} (have ${BUNDLES.map((b) => b.id).join(", ")})`,
      );
    return bundle.sets.map(([path, value]) => ({
      id: `${path}=${value}`,
      hypothesis: `${bundle.id}: isolate ${path}`,
      sets: [[path, value]],
    }));
  }
  return selected.slice(0, Math.max(0, budget - 1)).map((b) => ({
    id: b.id,
    hypothesis: b.hypothesis,
    sets: b.sets,
  }));
}

const units = buildUnits();

if (has("--dry")) {
  const mode = ofatId ? `ofat ${ofatId}` : "screening";
  const totalTasks = soak ? Math.max(units.length, maxReplays - 1) : units.length;
  console.log(
    `plan (${mode}): baseline + ${totalTasks} replays, ${Math.min(threads, totalTasks)} concurrent${soak ? ` (soak fills to --max ${maxReplays})` : ""}\n`,
  );
  for (const u of units) {
    console.log(`  ${u.id}  — ${u.hypothesis}`);
    for (const [p, v] of u.sets) console.log(`      set ${p} = ${v}`);
  }
  process.exit(0);
}

mkdirSync(OUTDIR, {
  recursive: true,
});

if (proxies.length) console.log(`proxy pool: ${proxies.length} line(s), fresh session per replay`);

console.log(`baseline replay...`);

const baseRun = await runReplay([], "baseline", proxyFor(0));

soakLog.push({
  n: 0,
  tag: "baseline",
  postStatus: baseRun.postStatus,
  bffStatus: baseRun.bffStatus,
  ok: baseRun.ok,
  ms: baseRun.ms,
  session: baseRun.session,
  ip: baseRun.ip,
});

if (!baseRun.ok) {
  console.error(
    `baseline failed (post ${baseRun.postStatus}); aborting\n${baseRun.log.slice(-400)}`,
  );
  process.exit(1);
}

const base = extract(baseRun.event);

const tasks = units.map((u) => ({
  tag: u.id,
  sets: u.sets,
  unit: u,
  attribute: true,
}));

if (soak) {
  const cycle = units.length
    ? units
    : [
        {
          id: "baseline",
          sets: [],
        },
      ];
  while (1 + tasks.length < maxReplays) {
    const u = cycle[tasks.length % cycle.length];
    tasks.push({
      tag: `soak_${tasks.length}`,
      sets: u.sets,
      unit: u,
      attribute: false,
    });
  }
}

tasks.length = Math.min(tasks.length, Math.max(0, maxReplays - 1));

const rows = [];
const concurrency = Math.min(threads, tasks.length) || 1;

console.log(`\n${tasks.length} replays, ${concurrency} concurrent (rolling)...`);

let launched = 0;
let done = 0;

async function worker() {
  while (true) {
    const idx = launched++;
    if (idx >= tasks.length) return;
    const t = tasks[idx];
    const run = await runReplay(t.sets, `${t.tag}_${idx}`, proxyFor(idx + 1));
    done += 1;
    soakLog.push({
      n: idx + 1,
      tag: t.attribute ? t.tag : `soak:${t.unit.id}`,
      postStatus: run.postStatus,
      bffStatus: run.bffStatus,
      ok: run.ok,
      ms: run.ms,
      session: run.session,
      ip: run.ip,
    });
    const via = run.session ? ` via ${run.session}/${run.ip ?? "?"}` : "";
    console.log(
      `[${done}/${tasks.length}] ${t.tag.padEnd(22)} post ${run.postStatus} bff ${run.bffStatus} ${run.ms}ms${via}${run.ok ? "" : "  FAIL"}`,
    );
    if (t.attribute && run.ok)
      rows.push({
        bundle: t.unit,
        row: extract(run.event),
      });
  }
}

await Promise.all(
  Array.from(
    {
      length: concurrency,
    },
    () => worker(),
  ),
);
rows.sort((a, b) => units.indexOf(a.bundle) - units.indexOf(b.bundle));

const numeric = (v) => (typeof v === "number" ? v : null);

function cell(label, baseV, mutV) {
  if (JSON.stringify(baseV) === JSON.stringify(mutV)) return ".";
  const bn = numeric(baseV);
  const mn = numeric(mutV);
  if (bn !== null && mn !== null) {
    const d = mn - bn;
    return `${mn}(${d >= 0 ? "+" : ""}${d.toFixed(4).replace(/\.?0+$/, "")})`;
  }
  return `${fmt(baseV)}→${fmt(mutV)}`;
}

const outputLabels = Object.keys(OUTPUTS);
const echoLabels = Object.keys(ECHOES);

console.log(`\n=== BASELINE ===`);

for (const l of outputLabels) console.log(`  ${l.padEnd(16)} ${fmt(base[l])}`);

function table(labels, title) {
  console.log(`\n=== ${title} (baseline vs each bundle; "." = unchanged) ===`);
  const w = Math.max(...labels.map((l) => l.length), 8);
  for (const l of labels) {
    const cells = rows.map((r) => cell(l, base[l], r.row[l]));
    if (cells.every((c) => c === ".")) continue;
    console.log(
      `  ${l.padEnd(w)} | ${rows.map((r, i) => `${r.bundle.id.slice(0, 10).padEnd(10)}:${cells[i]}`).join("  ")}`,
    );
  }
}

table(outputLabels, "SERVER-DERIVED OUTPUTS");
table(echoLabels, "ECHO (landing confirmation)");
console.log(`\n=== ATTRIBUTION ===`);

for (const l of outputLabels) {
  const movers = rows.filter((r) => JSON.stringify(base[l]) !== JSON.stringify(r.row[l]));
  if (!movers.length) continue;
  console.log(
    `  ${l}: ${movers.map((m) => `${m.bundle.id} (${cell(l, base[l], m.row[l])})`).join(", ")}`,
  );
}

const report = {
  from,
  as_origin: asOrigin,
  budget,
  mode: ofatId ? `ofat:${ofatId}` : "screening",
  baseline: base,
  bundles: rows.map((r) => ({
    id: r.bundle.id,
    hypothesis: r.bundle.hypothesis,
    sets: r.bundle.sets,
    outputs: r.row,
  })),
  throughput: soakLog,
};

const hist = (key) =>
  soakLog.reduce((m, e) => ((m[e[key] ?? "none"] = (m[e[key] ?? "none"] || 0) + 1), m), {});

const okCount = soakLog.filter((e) => e.ok).length;
const distinctIps = new Set(soakLog.map((e) => e.ip).filter(Boolean)).size;
const distinctSessions = new Set(soakLog.map((e) => e.session).filter(Boolean)).size;
const firstFail = soakLog.find((e) => !e.ok)?.n ?? null;
const avgMs = Math.round(soakLog.reduce((s, e) => s + e.ms, 0) / soakLog.length);

report.ratelimit = {
  total_replays: sentCount,
  ok: okCount,
  first_failure_at: firstFail,
  post_status_hist: hist("postStatus"),
  bff_status_hist: hist("bffStatus"),
  avg_ms: avgMs,
};

report.ratelimit.distinct_ips = distinctIps;
report.ratelimit.distinct_sessions = distinctSessions;
console.log(`\n=== RATELIMIT / THROUGHPUT ===`);
console.log(`  replays sent   ${sentCount} (ok ${okCount})`);

if (proxies.length)
  console.log(`  distinct exit  ${distinctIps} IPs across ${distinctSessions} sessions`);

console.log(
  `  first failure  ${firstFail === null ? "none — never refused within --max" : `replay #${firstFail}`}`,
);

console.log(`  post status    ${JSON.stringify(hist("postStatus"))}`);
console.log(`  bff status     ${JSON.stringify(hist("bffStatus"))}`);
console.log(`  avg latency    ${avgMs}ms/replay`);

const reportFile = join(OUTDIR, "report.json");

writeFileSync(reportFile, JSON.stringify(report, null, 2));
console.log(`\nwrote ${reportFile}`);
