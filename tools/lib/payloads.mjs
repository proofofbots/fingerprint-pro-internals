import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

export { CAPTURES } from "./paths.mjs";

import { CAPTURES } from "./paths.mjs";

/** A file pasted out of a devtools console keeps its backtick template-literal quoting. */

/** A file pasted out of a devtools console keeps its backtick template-literal quoting. */
export function readJson(path) {
  let text = readFileSync(path, "utf8").trim();
  if (text.startsWith("`") && text.endsWith("`")) text = text.slice(1, -1);
  return JSON.parse(text);
}

export const looksLikePayload = (value) =>
  value && typeof value === "object" && Object.keys(value).some((key) => /^s\d+$/.test(key));

/** `chrome-2026-07-31T06-30-07-595Z.json` is the chrome run; anything else is its own label. */

/** `chrome-2026-07-31T06-30-07-595Z.json` is the chrome run; anything else is its own label. */
export const labelOf = (path) =>
  basename(path)
    .replace(/\.json$/, "")
    .replace(/-\d{4}-\d{2}-\d{2}T.*$/, "");

export function captureFiles() {
  if (!existsSync(CAPTURES)) return [];
  return readdirSync(CAPTURES)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => join(CAPTURES, file));
}

export function newestCapture() {
  const files = captureFiles();
  return files.length ? files[files.length - 1] : null;
}

export function openPayload(codec, bytes) {
  const opened = codec.openFrame(bytes);
  let payload = opened.payload;
  if (payload[0] !== 0x7b && payload[0] !== 0x5b) payload = codec.inflate(payload);
  return codec.decodeJson(payload);
}

/**
 * Every payload a capture holds, with where it came from. `reqRaw` is the bytes as sent and is
 * opened with the agent's own decoder; a capture predating `reqRaw` has only the in-page decode,
 * which is the agent's object before it was framed rather than the wire itself — usable for values,
 * so it is taken, but labelled, because nothing here re-derived it from bytes.
 */

/**
 * Every payload a capture holds, with where it came from. `reqRaw` is the bytes as sent and is
 * opened with the agent's own decoder; a capture predating `reqRaw` has only the in-page decode,
 * which is the agent's object before it was framed rather than the wire itself — usable for values,
 * so it is taken, but labelled, because nothing here re-derived it from bytes.
 */
export function payloadsFrom(codec, path) {
  const text = readFileSync(path, "utf8").trim();
  if (!text.startsWith("{") && !text.startsWith("[") && !text.startsWith("`")) {
    return [
      {
        origin: "frame",
        payload: openPayload(codec, Uint8Array.from(Buffer.from(text, "base64"))),
      },
    ];
  }
  const parsed = readJson(path);
  if (looksLikePayload(parsed) && !parsed.requests)
    return [
      {
        origin: "payload",
        payload: parsed,
      },
    ];
  if (looksLikePayload(parsed.payload))
    return [
      {
        origin: "payload",
        payload: parsed.payload,
      },
    ];
  const found = [];
  for (const request of parsed.requests ?? []) {
    if (request.reqRaw) {
      try {
        const payload = openPayload(codec, Uint8Array.from(Buffer.from(request.reqRaw, "base64")));
        if (looksLikePayload(payload)) {
          found.push({
            origin: "reqRaw",
            url: request.url,
            size: request.reqSize ?? 0,
            payload,
          });
          continue;
        }
      } catch {}
    }
    const decoded = request.decoded?.json;
    if (looksLikePayload(decoded)) {
      found.push({
        origin: "in-page decode",
        url: request.url,
        size: request.reqSize ?? 0,
        payload: decoded,
      });
    }
  }
  return found;
}

/** The largest agent payload in a capture — the analysis POST, not the GET leg or a beacon. */

/** The largest agent payload in a capture — the analysis POST, not the GET leg or a beacon. */
export function payloadFromCapture(codec, path) {
  const found = payloadsFrom(codec, path);
  if (!found.length) throw new Error(`${basename(path)} carries no agent payload`);
  return found.reduce((a, b) => ((b.size ?? 0) > (a.size ?? 0) ? b : a)).payload;
}

/** The `{s,v}` pairs anywhere in a payload, keyed by the id they sit under. */

/** The `{s,v}` pairs anywhere in a payload, keyed by the id they sit under. */
export function flattenSignals(node, path = "", out = []) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    node.forEach((item, position) => flattenSignals(item, `${path}[${position}]`, out));
    return out;
  }
  const keys = Object.keys(node);
  if (keys.length <= 3 && "s" in node && "v" in node) {
    out.push({
      id: path.split(".").pop(),
      s: node.s,
      v: node.v,
      path,
    });
    return out;
  }
  for (const key of keys) flattenSignals(node[key], path ? `${path}.${key}` : key, out);
  return out;
}

const AGENT_STORAGE = /(^|_)(vid|fpjs)/i;

/**
 * A capture is taken in a real browser, so it picks up whatever else that origin had stored. Only
 * the agent's own entries carry meaning here; every other entry is a third-party session token, key
 * included, and is dropped. Returns the count so a caller can report it.
 */

/**
 * A capture is taken in a real browser, so it picks up whatever else that origin had stored. Only
 * the agent's own entries carry meaning here; every other entry is a third-party session token, key
 * included, and is dropped. Returns the count so a caller can report it.
 */
export function scrubCapture(capture) {
  let redacted = 0;
  for (const area of ["local", "session", "cookies"]) {
    const bucket = capture?.storage?.[area];
    if (!bucket || typeof bucket !== "object") continue;
    for (const key of Object.keys(bucket)) {
      if (AGENT_STORAGE.test(key)) continue;
      delete bucket[key];
      redacted++;
    }
  }
  return {
    redacted,
  };
}
