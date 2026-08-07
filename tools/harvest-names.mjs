#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { WebSocket } from "ws";
import { DATA } from "./lib/paths.mjs";

const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const COLLECT = `(async () => {
  const names = new Set();
  const seen = new Set();

  const harvest = (value) => {
    let current = value;
    while (current && !seen.has(current)) {
      seen.add(current);
      try {
        for (const name of Object.getOwnPropertyNames(current)) names.add(name);
      } catch {}
      try {
        current = Object.getPrototypeOf(current);
      } catch {
        break;
      }
    }
  };

  // Each root is a thunk: several of these throw on a restricted origin, and one eager throw
  // while building the list would lose every name after it.
  const roots = [
    () => window, () => navigator, () => screen, () => document,
    () => document.documentElement, () => document.body, () => location, () => history,
    () => performance, () => console, () => crypto, () => indexedDB,
    () => localStorage, () => sessionStorage,
    () => navigator.connection, () => navigator.mediaDevices, () => navigator.permissions,
    () => navigator.storage, () => navigator.userAgentData, () => navigator.gpu,
    () => navigator.serviceWorker, () => navigator.keyboard, () => navigator.contacts,
    () => new Image(), () => new Image().style, () => document.createElement("div").style,
    () => document.createElement("frameset"), () => document.createElement("canvas"),
    () => document.createElement("iframe"), () => document.createElement("video"),
    () => document.createElement("audio"), () => document.createElement("input"),
    () => document.createElement("canvas").getContext("2d"),
    () => document.createElement("canvas").getContext("webgl"),
    () => document.createElement("canvas").getContext("webgl2"),
    () => new Error(), () => new Date(), () => new RegExp("x"), () => new Map(), () => new Set(),
    () => Promise.resolve(), () => Intl, () => Reflect, () => Math, () => JSON,
    () => WebAssembly, () => Atomics,
  ];

  // Objects that only exist after an async handshake, and which the agent probes heavily.
  const asyncRoots = [
    async () => (await navigator.gpu?.requestAdapter()) ?? null,
    async () => {
      const adapter = await navigator.gpu?.requestAdapter();
      return adapter ? await adapter.requestDevice() : null;
    },
    async () => (await navigator.gpu?.requestAdapter())?.limits ?? null,
    async () => await navigator.storage?.estimate(),
    async () => await navigator.permissions?.query({ name: "geolocation" }),
    async () => await navigator.mediaCapabilities?.decodingInfo({
      type: "file",
      video: { contentType: "video/mp4; codecs=avc1.640028", width: 640, height: 480, bitrate: 1e5, framerate: 30 },
    }),
    async () => await navigator.getBattery?.(),
    async () => await navigator.mediaDevices?.enumerateDevices().then((d) => d[0] ?? null),
  ];

  const syncRoots = [
    () => new RTCPeerConnection(),
    () => new RTCPeerConnection().createDataChannel("x"),
    () => new (window.AudioContext || window.webkitAudioContext)(),
    () => new OfflineAudioContext(1, 1, 44100),
    () => new OfflineAudioContext(1, 1, 44100).createOscillator(),
    () => new OfflineAudioContext(1, 1, 44100).createDynamicsCompressor(),
    () => window.PublicKeyCredential,
    () => window.speechSynthesis,
    () => new Worker(URL.createObjectURL(new Blob([""], { type: "text/javascript" }))),
    () => document.createElement("canvas").getContext("bitmaprenderer"),
    () => new OffscreenCanvas(1, 1),
    () => new FontFace("x", "url(x)"),
    () => new IntersectionObserver(() => {}),
    () => new PerformanceObserver(() => {}),
    () => new TextEncoder(),
    () => new BroadcastChannel("x"),
    () => window.crypto.subtle,
    () => performance.memory,
    () => navigator.webkitTemporaryStorage,
    () => navigator.webkitPersistentStorage,
    () => performance.timing,
    () => performance.navigation,
    () => window.chrome,
    () => window.chrome?.runtime,
    () => window.chrome?.loadTimes,
    () => document.createElement("canvas").getContext("webgl").getExtension("WEBGL_debug_renderer_info"),
  ];

  for (const root of [...roots, ...syncRoots]) {
    try { harvest(root()); } catch {}
  }

  for (const root of asyncRoots) {
    try { harvest(await root()); } catch {}
  }

  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    for (const extension of gl.getSupportedExtensions()) harvest(gl.getExtension(extension));
  } catch {}

  for (const name of Object.getOwnPropertyNames(window)) {
    try {
      const value = window[name];
      if (typeof value === "function" && value.prototype) harvest(value.prototype);
      if (value && typeof value === "object") harvest(value);
    } catch {}
  }

  try {
    const style = getComputedStyle(document.documentElement);
    for (let i = 0; i < style.length; i++) names.add(style[i]);
  } catch {}

  return [...names];
})()`;

const page = createServer((_request, response) => {
  response.writeHead(200, {
    "content-type": "text/html",
  });
  response.end("<!doctype html><title>harvest</title>");
});

await new Promise((resolve) => page.listen(0, "127.0.0.1", resolve));

const pageUrl = `http://127.0.0.1:${page.address().port}/`;
const profile = mkdtempSync(join(tmpdir(), "fpjs-harvest-"));

const chrome = spawn(CHROME, [
  "--headless=new",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu-sandbox",
  "--enable-unsafe-webgpu",
  "--use-angle=swiftshader",
  "about:blank",
]);

const endpoint = await new Promise((resolve, reject) => {
  let buffer = "";
  const timer = setTimeout(
    () => reject(new Error("chrome did not report a devtools endpoint")),
    20000,
  );
  chrome.stderr.on("data", (chunk) => {
    buffer += chunk.toString();
    const match = buffer.match(/ws:\/\/[^\s]+/);
    if (match) {
      clearTimeout(timer);
      resolve(match[0]);
    }
  });
  chrome.on("exit", (code) => reject(new Error(`chrome exited with ${code}`)));
});

const socket = new WebSocket(endpoint, {
  perMessageDeflate: false,
  maxPayload: 256 * 1024 * 1024,
});

await new Promise((resolve, reject) => {
  socket.once("open", resolve);
  socket.once("error", reject);
});

const send = (method, params) =>
  new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1e9);
    const onMessage = (raw) => {
      const message = JSON.parse(raw.toString());
      if (message.id !== id) return;
      socket.off("message", onMessage);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    };
    socket.on("message", onMessage);
    socket.send(
      JSON.stringify({
        id,
        method,
        params,
      }),
    );
  });

const { targetId } = await send("Target.createTarget", {
  url: pageUrl,
});

const { sessionId } = await send("Target.attachToTarget", {
  targetId,
  flatten: true,
});

const evaluate = (expression) =>
  new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1e9);
    const onMessage = (raw) => {
      const message = JSON.parse(raw.toString());
      if (message.id !== id) return;
      socket.off("message", onMessage);
      if (message.error) return reject(new Error(message.error.message));
      const result = message.result?.result;
      if (result?.subtype === "error") return reject(new Error(result.description));
      resolve(result?.value);
    };
    socket.on("message", onMessage);
    socket.send(
      JSON.stringify({
        id,
        sessionId,
        method: "Runtime.evaluate",
        params: {
          expression,
          returnByValue: true,
          awaitPromise: true,
        },
      }),
    );
  });

const harvested = await evaluate(COLLECT);

socket.close();
chrome.kill();
page.close();
rmSync(profile, {
  recursive: true,
  force: true,
});

const outPath = join(DATA, "browser-names.json");
const previous = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : {};
const names = [...new Set([...(previous.names ?? []), ...harvested])].sort();
const browsers = [...new Set([...(previous.browsers ?? []), CHROME])];

writeFileSync(
  outPath,
  JSON.stringify(
    {
      browsers,
      count: names.length,
      names,
    },
    null,
    2,
  ),
);

console.log(`${CHROME}: ${harvested.length} names, ${names.length} total -> ${outPath}`);
