import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REFERENCE, SPY, TOOLS } from "./lib/paths.mjs";

const src = readFileSync(join(TOOLS, "fpspy.src.js"), "utf8");
const signals = JSON.parse(readFileSync(join(REFERENCE, "signals.json"), "utf8"));
const labels = {};

for (const mod of signals.modules) {
  for (const sig of mod.signals) {
    const api = (sig.apis || []).find((a) => a && a.length < 60);
    const probe = (sig.probes || [])[0];
    const label = api || (probe ? `probe:${probe}` : "");
    if (label) labels[sig.id] = label.length > 48 ? label.slice(0, 47) + "…" : label;
  }
}

const line = `  const SIGNAL_LABELS = ${JSON.stringify(labels)};`;
const out = src.replace(/^ {2}const SIGNAL_LABELS = \{\};$/m, line);

if (out === src) {
  throw new Error("SIGNAL_LABELS placeholder not found in fpspy.src.js");
}

const target = join(SPY, "fpspy.js");

writeFileSync(target, out);

console.log(`fpspy.js written: ${out.length} bytes, ${Object.keys(labels).length} signal labels`);
