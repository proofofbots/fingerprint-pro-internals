import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { DATA, AGENT, ARTIFACTS } from "./paths.mjs";

const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

export function crc32(text) {
  let c = ~0;
  for (const b of new TextEncoder().encode(text)) c = (c >>> 8) ^ TABLE[255 & (c ^ b)];
  return ~c >>> 0;
}

const AUTOMATION_NAMES = [
  "webdriver",
  "__webdriver_evaluate",
  "__selenium_evaluate",
  "__webdriver_script_function",
  "__webdriver_script_func",
  "__webdriver_script_fn",
  "__fxdriver_evaluate",
  "__driver_unwrapped",
  "__webdriver_unwrapped",
  "__driver_evaluate",
  "__selenium_unwrapped",
  "__fxdriver_unwrapped",
  "__$webdriverAsyncExecutor",
  "_phantom",
  "__nightmare",
  "_selenium",
  "callPhantom",
  "callSelenium",
  "_Selenium_IDE_Recorder",
  "domAutomation",
  "domAutomationController",
  "awesomium",
  "wdioElectron",
  "webdriverio",
  "phantomas",
  "puppeteer",
  "__puppeteer_evaluation_script__",
  "playwright",
  "__playwright",
  "__pwInitScripts",
  "cdc_adoQpoasnfa76pfcZLmcfl_Array",
  "cdc_adoQpoasnfa76pfcZLmcfl_Promise",
  "cdc_adoQpoasnfa76pfcZLmcfl_Symbol",
  "$cdc_asdjflasutopfhvcZLmcfl_",
];

const BROWSER_NAMES = [
  "chrome",
  "runtime",
  "loadTimes",
  "csi",
  "app",
  "isInstalled",
  "getIsInstalled",
  "brave",
  "isBrave",
  "duckduckgo",
  "opr",
  "yandex",
  "safari",
  "pushNotification",
  "userAgent",
  "userAgentData",
  "platform",
  "vendor",
  "vendorSub",
  "productSub",
  "oscpu",
  "buildID",
  "appVersion",
  "appName",
  "appCodeName",
  "product",
  "language",
  "languages",
  "hardwareConcurrency",
  "deviceMemory",
  "maxTouchPoints",
  "pdfViewerEnabled",
  "cookieEnabled",
  "doNotTrack",
  "globalPrivacyControl",
  "webkitPersistentStorage",
  "webkitTemporaryStorage",
  "queryUsageAndQuota",
  "requestQuota",
  "jsHeapSizeLimit",
  "totalJSHeapSize",
  "usedJSHeapSize",
  "connection",
  "contacts",
  "mimeTypes",
  "plugins",
  "permissions",
  "mediaDevices",
  "mediaCapabilities",
  "serviceWorker",
  "storage",
  "credentials",
  "keyboard",
  "locks",
  "presentation",
  "usb",
  "wakeLock",
  "xr",
  "gpu",
  "ink",
  "hid",
  "serial",
  "bluetooth",
  "clipboard",
  "scheduling",
  "userActivation",
  "virtualKeyboard",
  "windowControlsOverlay",
  "managed",
  "login",
  "getBattery",
  "geolocation",
  "deprecatedReplaceInURN",
];

const WEBGPU_NAMES = [
  "requestAdapter",
  "requestDevice",
  "requestAdapterInfo",
  "getPreferredCanvasFormat",
  "createShaderModule",
  "createRenderPipeline",
  "createComputePipeline",
  "createTexture",
  "createBuffer",
  "createBindGroup",
  "createSampler",
  "createQuerySet",
  "createCommandEncoder",
  "beginRenderPass",
  "beginComputePass",
  "setPipeline",
  "setBindGroup",
  "setVertexBuffer",
  "draw",
  "drawIndexed",
  "dispatchWorkgroups",
  "end",
  "resolveQuerySet",
  "copyBufferToBuffer",
  "finish",
  "submit",
  "mapAsync",
  "getMappedRange",
  "unmap",
  "getBindGroupLayout",
  "writeTexture",
  "writeBuffer",
  "createView",
  "queue",
  "features",
  "limits",
  "adapterInfo",
  "GPUBufferUsage",
  "GPUTextureUsage",
  "GPUMapMode",
  "GPUShaderStage",
  "COPY_SRC",
  "COPY_DST",
  "MAP_READ",
  "MAP_WRITE",
  "QUERY_RESOLVE",
  "TEXTURE_BINDING",
  "RENDER_ATTACHMENT",
  "UNIFORM",
];

const GRAPHICS_NAMES = [
  "getContext",
  "getParameter",
  "getExtension",
  "getShaderPrecisionFormat",
  "getSupportedExtensions",
  "getContextAttributes",
  "toDataURL",
  "toBlob",
  "getImageData",
  "measureText",
  "isPointInPath",
  "createOscillator",
  "createDynamicsCompressor",
  "startRendering",
  "getChannelData",
  "copyFromChannel",
  "getSupportedProfiles",
  "requestMediaKeySystemAccess",
  "createMediaKeys",
  "createSession",
  "generateRequest",
];

const EXTRA_NAMES = [
  ...AUTOMATION_NAMES,
  ...BROWSER_NAMES,
  ...WEBGPU_NAMES,
  ...GRAPHICS_NAMES,
  "onorientationchange",
  "cols",
  "rows",
  "cssFloat",
  "cssText",
  "getPropertyValue",
  "speechSynthesis",
  "getVoices",
  "matchMedia",
  "devicePixelRatio",
  "visualViewport",
  "outerWidth",
  "outerHeight",
  "innerWidth",
  "innerHeight",
  "availWidth",
  "availHeight",
  "availLeft",
  "availTop",
  "colorDepth",
  "pixelDepth",
  "orientation",
  "isExtended",
  "requestFileSystem",
  "webkitRequestFileSystem",
  "webkitResolveLocalFileSystemURL",
  "openDatabase",
  "SharedArrayBuffer",
  "Notification",
  "external",
  "process",
  "Buffer",
];

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const camel = (name) =>
  name
    .replace(/^-(webkit|moz|ms|o|epub|apple|khtml|internal)-/, "$1-")
    .replace(/^-/, "")
    .replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());

const CSS_VENDOR_PREFIXES = ["-webkit-", "-moz-", "-ms-", "-o-", "-apple-", "-epub-"];

const JS_VENDOR_PREFIXES = [
  "webkit",
  "Webkit",
  "moz",
  "Moz",
  "ms",
  "Ms",
  "o",
  "O",
  "epub",
  "apple",
];

function harvestIdentifiers(source, into) {
  for (const m of source.matchAll(/\b([A-Za-z_$][A-Za-z0-9_$]{1,48})\b/g)) into.add(m[1]);
  for (const m of source.matchAll(/"([^"\\\n]{1,48})"/g)) into.add(m[1]);
  for (const m of source.matchAll(/'([^'\\\n]{1,48})'/g)) into.add(m[1]);
}

const VENDOR_STEMS = ["webkit", "moz", "ms", "epub", "apple", "khtml", "internal"];

function loadKnownCssProperties() {
  try {
    const { all } = createRequire(import.meta.url)("known-css-properties");
    return all;
  } catch {
    return [];
  }
}

function loadBrowserNames() {
  const path = join(DATA, "browser-names.json");
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf8")).names ?? [];
}

function loadVaultStrings() {
  const path = join(AGENT, "vaults.json");
  if (!existsSync(path)) return [];
  const strings = new Set();
  const visit = (value) => {
    if (typeof value === "string") {
      if (value.length <= 64) strings.add(value);
      return;
    }
    if (Array.isArray(value)) return value.forEach(visit);
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        if (key.length <= 64) strings.add(key);
        visit(child);
      }
    }
  };
  for (const table of Object.values(JSON.parse(readFileSync(path, "utf8")).tables ?? {})) {
    visit(table.entries);
  }
  return [...strings];
}

export function buildDictionary({ agentSource = "" } = {}) {
  const base = new Set(EXTRA_NAMES);
  for (const file of readdirSync(ARTIFACTS).filter((n) => n.startsWith("ts-lib."))) {
    harvestIdentifiers(readFileSync(join(ARTIFACTS, file), "utf8"), base);
  }
  for (const name of loadKnownCssProperties()) base.add(name);
  for (const name of loadBrowserNames()) base.add(name);
  for (const name of loadVaultStrings()) base.add(name);
  if (agentSource) harvestIdentifiers(agentSource, base);
  const dictionary = new Set();
  for (const name of base) {
    dictionary.add(name);
    dictionary.add("_" + name);
    dictionary.add("__" + name);
    const dashed = kebab(name);
    dictionary.add(dashed);
    for (const prefix of CSS_VENDOR_PREFIXES) dictionary.add(prefix + dashed);
    if (name.includes("-")) dictionary.add(camel(name));
    for (const stem of VENDOR_STEMS) {
      if (!name.startsWith(stem) || name.length === stem.length) continue;
      dictionary.add(`-${stem}-${kebab(name.slice(stem.length))}`.replace("--", "-"));
    }
    if (dashed.startsWith(`${VENDOR_STEMS[0]}-`)) dictionary.add(`-${dashed}`);
    for (const stem of VENDOR_STEMS) {
      if (dashed.startsWith(`${stem}-`)) dictionary.add(`-${dashed}`);
    }
    if (/^[a-z]/.test(name)) {
      const capitalized = name[0].toUpperCase() + name.slice(1);
      for (const prefix of JS_VENDOR_PREFIXES) dictionary.add(prefix + capitalized);
    }
  }
  return dictionary;
}

export function buildRainbow(dictionary) {
  const rainbow = new Map();
  for (const name of dictionary) {
    const hash = crc32(name);
    const existing = rainbow.get(hash);
    if (!existing) rainbow.set(hash, [name]);
    else if (!existing.includes(name)) existing.push(name);
  }
  return rainbow;
}

export function loadOverrides() {
  try {
    const raw = JSON.parse(readFileSync(join(DATA, "names.json"), "utf8"));
    return new Map(Object.entries(raw.hashes ?? {}).map(([k, v]) => [Number(k), v]));
  } catch {
    return new Map();
  }
}

export function resolveHash(rainbow, overrides, hash) {
  const override = overrides.get(hash);
  if (override) return override;
  const candidates = rainbow.get(hash);
  return candidates && candidates.length === 1 ? candidates[0] : null;
}
