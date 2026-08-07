import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const TOOLS = join(ROOT, "tools");
export const DATA = join(TOOLS, "data");
export const AGENT = join(ROOT, "agent");
export const REFERENCE = join(ROOT, "reference");
export const CAPTURES = join(ROOT, "captures");
export const PROFILES = join(ROOT, "profiles");
export const EVIDENCE = join(ROOT, "evidence");
export const SPY = join(ROOT, "spy");
export const COLLECTOR = join(ROOT, "collector");
export const ARTIFACTS = join(ROOT, "artifacts");
export const PIN = join(AGENT, "pin.json");
export const CLEAN_AGENT = join(AGENT, "agent.clean.js");

export const DEFAULT_AGENT = process.env.FP_AGENT
  ? resolve(process.env.FP_AGENT)
  : join(ARTIFACTS, "agent.original.js");
