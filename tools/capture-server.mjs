#!/usr/bin/env node
import { createServer } from "node:http";

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

import { join } from "node:path";
import { CAPTURES, SPY, DEFAULT_AGENT } from "./lib/paths.mjs";
import { scrubCapture } from "./lib/payloads.mjs";

const PORT = Number(process.env.FP_PORT ?? 8099);

mkdirSync(CAPTURES, {
  recursive: true,
});

const spyPath = join(SPY, "fpspy.js");

if (!existsSync(spyPath)) throw new Error("spy/fpspy.js missing — run npm run spy first");

const page = (label) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>fpjs capture — ${label}</title>
<style>
  body { font: 14px ui-monospace, SFMono-Regular, Menlo, monospace; margin: 40px; max-width: 720px; }
  h1 { font-size: 18px; }
  #log { white-space: pre-wrap; border: 1px solid #ccc; padding: 12px; min-height: 220px; }
  .row { margin: 12px 0; }
  button { font: inherit; padding: 6px 12px; }
  code { background: #f2f2f2; padding: 1px 4px; }
</style>
</head>
<body>
<h1>fpjs capture — <code>${label}</code></h1>
<p>The agent runs on load, the payload it POSTs is captured before it leaves, and the whole capture
is saved to <code>captures/</code> when collection settles. Label this run by browser with
<code>?b=firefox</code>.</p>
<div class="row">
  <button id="again">Run again</button>
  <button id="save">Save now</button>
</div>
<div id="log"></div>
<script src="/fpspy.js"></script>
<script type="module">
const label = ${JSON.stringify(label)};
const out = document.getElementById("log");
const say = (text) => { out.textContent += text + "\\n"; };

say("fpspy " + (window.__fpspy ? window.__fpspy.version : "MISSING"));
window.__fpspy.opts.quiet = true;

let agent = null;

async function run() {
  try {
    if (!agent) {
      const module = await import("/agent.js");
      say("agent module loaded, exports: " + Object.keys(module).join(" "));
      agent = await module.start({});
      say("agent started");
    }
    const result = await agent.get({ extendedResult: true });
    say("get() ok, requestId " + (result && result.requestId));
  } catch (error) {
    say("get() rejected (expected when the tenant restricts by origin): " + error);
  }
}

async function save() {
  const state = window.__fpspy.state;
  const bodies = state.requests.filter((request) => request.reqRaw).length;
  const response = await fetch("/save?b=" + encodeURIComponent(label), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: window.__fpspy.json(0),
  });
  const saved = await response.json();
  say("saved " + saved.file + " — " + bodies + " framed bodies, " + saved.signals + " signals");
}

document.getElementById("again").addEventListener("click", () => run());
document.getElementById("save").addEventListener("click", () => save());

await run();
say("waiting 8s for the delayed stages…");
await new Promise((resolve) => setTimeout(resolve, 8000));
await save();
say("done — this browser is captured, next one can be opened now");
</script>
</body>
</html>`;

const send = (response, status, type, body) => {
  response.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
  });
  response.end(body);
};

const readBody = (request) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });

const slug = (value) => (value || "unlabelled").replace(/[^a-z0-9._-]/gi, "-").slice(0, 40);

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  if (request.method === "POST" && url.pathname === "/save") {
    const label = slug(url.searchParams.get("b"));
    const text = await readBody(request);
    let signals = 0;
    let body = text;
    let redacted = 0;
    try {
      const capture = JSON.parse(text);
      signals = (capture.requests ?? []).reduce(
        (sum, entry) => sum + (entry.signals?.length ?? 0),
        0,
      );
      ({ redacted } = scrubCapture(capture));
      body = JSON.stringify(capture, null, 2);
    } catch {}
    const file = `${label}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    writeFileSync(join(CAPTURES, file), body);
    console.log(
      `saved ${file} (${(body.length / 1024).toFixed(0)} KB, ${signals} signals, ${redacted} third-party storage entries dropped)`,
    );
    return send(
      response,
      200,
      "application/json",
      JSON.stringify({
        ok: true,
        file,
        signals,
      }),
    );
  }
  if (url.pathname === "/fpspy.js") {
    return send(response, 200, "text/javascript", readFileSync(spyPath));
  }
  if (url.pathname === "/agent.js") {
    return send(response, 200, "text/javascript", readFileSync(DEFAULT_AGENT));
  }
  if (url.pathname === "/captures") {
    return send(response, 200, "application/json", JSON.stringify(readdirSync(CAPTURES), null, 2));
  }
  if (url.pathname === "/") {
    return send(response, 200, "text/html; charset=utf-8", page(slug(url.searchParams.get("b"))));
  }
  return send(response, 404, "text/plain", "not found");
});

server.listen(PORT, () => {
  console.log(`capture server  http://localhost:${PORT}/?b=<browser>`);
  console.log(`captures        ${CAPTURES}`);
  console.log(`agent           ${DEFAULT_AGENT}`);
});
