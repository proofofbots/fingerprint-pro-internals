#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { loadCodec } from "./lib/codec.mjs";

const args = process.argv.slice(2);

const flag = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? null : (args[index + 1] ?? "");
};

const codec = await loadCodec({
  quiet: true,
});
const hex = (bytes) => Buffer.from(bytes).toString("hex");
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function report(name, ok, detail = "") {
  console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(22)} ${detail}`);
  return ok;
}

async function selfTest() {
  let passed = true;
  const value = {
    c: "kBwLN2IyH1GjeJBLpl8C",
    mo: ["cm", "ex"],
    s2: [["en-US"]],
    s5: [1512, 982],
    nested: {
      escaped: 'quote " backslash \\ unicode é',
      empty: [],
      null: null,
    },
  };
  const encoded = codec.encodeJson(value);
  passed =
    report(
      "json round trip",
      deepEqual(codec.decodeJson(encoded), value),
      `${encoded.length} bytes`,
    ) && passed;
  const random = new Uint8Array(64).map(() => Math.floor(Math.random() * 256));
  const text = codec.base64Encode(random);
  passed =
    report("base64 round trip", hex(codec.base64Decode(text)) === hex(random), text.slice(0, 24)) &&
    passed;
  const digest = codec.hash128("the quick brown fox");
  passed =
    report(
      "hash128",
      /^[0-9a-f]{32}$/.test(digest) && codec.hash128("the quick brown fox") === digest,
      digest,
    ) && passed;
  for (const profile of codec.profiles) {
    const sealed = codec.sealFrame(encoded, profile);
    const opened = codec.openFrame(sealed);
    const same = hex(opened.payload) === hex(encoded) && opened.profile.marker === profile.marker;
    passed =
      report(
        `frame ${profile.marker}`,
        same,
        `marker ${profile.markerBytes.join(",")} key ${profile.keyLength} pad<=${profile.padMax}`,
      ) && passed;
  }
  if (typeof codec.compress === "function") {
    const [compressed, body] = await codec.compress(
      codec.encodeJson({
        padding: "x".repeat(4096),
      }),
    );
    const inflated = compressed ? codec.inflate(new Uint8Array(body)) : new Uint8Array(body);
    passed =
      report(
        "compress round trip",
        codec.decodeJson(inflated).padding.length === 4096,
        `deflated ${compressed}`,
      ) && passed;
  }
  return passed;
}

function frameFrom(path) {
  if (path.endsWith(".bin") || path.endsWith(".frame")) return new Uint8Array(readFileSync(path));
  const text = readFileSync(path, "utf8").trim();
  if (!text.startsWith("{")) return Uint8Array.from(Buffer.from(text, "base64"));
  const capture = JSON.parse(text);
  const bodies = (capture.requests ?? []).filter((request) => request.reqRaw);
  if (bodies.length === 0) {
    throw new Error(`${path} has no reqRaw — recapture with a build of fpspy.js that records it`);
  }
  const largest = bodies.reduce((a, b) => (b.reqSize > a.reqSize ? b : a));
  console.error(`capture ${largest.method} ${largest.url.slice(0, 80)} (${largest.reqSize} bytes)`);
  return Uint8Array.from(Buffer.from(largest.reqRaw, "base64"));
}

const input = flag("--open");

if (input !== null) {
  const opened = codec.openFrame(frameFrom(input));
  let payload = opened.payload;
  if (payload[0] !== 0x7b && payload[0] !== 0x5b) payload = codec.inflate(payload);
  const out = flag("--out");
  const json = JSON.stringify(codec.decodeJson(payload), null, 2);
  if (out) writeFileSync(out, json);
  else console.log(json);
  console.error(
    `frame ${opened.profile.marker} marker ${opened.profile.markerBytes.join(",")} pad ${opened.padLength} key ${hex(opened.key)}`,
  );
} else if (args.includes("--seal")) {
  const value = JSON.parse(readFileSync(flag("--seal"), "utf8"));
  const sealed = new Uint8Array(codec.sealFrame(codec.encodeJson(value)));
  const out = flag("--out");
  if (out) writeFileSync(out, sealed);
  else console.log(codec.base64Encode(sealed));
} else {
  console.log(
    `roles: ${Object.entries(codec.roles)
      .map(([role, name]) => `${role}=${name}`)
      .join(" ")}`,
  );
  const passed = await selfTest();
  process.exit(passed ? 0 : 1);
}
