#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import generateModule from "@babel/generator";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import * as t from "@babel/types";
import prettier from "prettier";
import { AGENT, ARTIFACTS, COLLECTOR, CLEAN_AGENT } from "./lib/paths.mjs";
import { detectPrimitives, findFrameProfiles } from "./lib/detect.mjs";
import { collectSignalRegistries, moduleBuilders } from "./lib/passes.mjs";
import { buildSurface, apiSlug } from "./lib/surface.mjs";

const generate = generateModule.default ?? generateModule;
const traverse = traverseModule.default ?? traverseModule;

const PRETTIER = {
  parser: "babel",
  printWidth: 100,
  semi: true,
  singleQuote: false,
};

const required = (value, what) => {
  if (!value) throw new Error(`collector: ${what} not found in ${CLEAN_AGENT}`);
  return value;
};

async function inlineVaultedProps(source) {
  const ast = parse(source, {
    sourceType: "module",
  });
  const { roles } = detectPrimitives(ast);
  const readProp = required(roles.readProp, "the vaulted property reader");
  const called = new Set();
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.type === "Identifier") called.add(path.node.callee.name);
    },
  });
  let asCall = 0;
  let asValue = 0;
  let bound = 0;
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      if (node.callee.type !== "Identifier" || node.callee.name !== readProp) return;
      const [object, key] = node.arguments;
      if (!object || key?.type !== "StringLiteral") return;
      if (!t.isValidIdentifier(key.value)) return;
      const declarator = path.findParent((up) => up.isVariableDeclarator());
      const holder = declarator?.node.id.type === "Identifier" ? declarator.node.id.name : null;
      const isCallee = path.parent.type === "CallExpression" && path.parent.callee === node;
      if (!isCallee && holder && called.has(holder)) {
        bound++;
        path.replaceWith(
          t.callExpression(t.identifier("boundProperty"), [
            t.cloneNode(object, true),
            t.stringLiteral(key.value),
          ]),
        );
        return;
      }
      if (isCallee) asCall++;
      else asValue++;
      path.replaceWith(t.memberExpression(t.cloneNode(object, true), t.identifier(key.value)));
    },
  });
  let tables = 0;
  let names = 0;
  const vaults = JSON.parse(readFileSync(join(AGENT, "vaults.json"), "utf8")).tables;
  const entryAt = (name, index) => {
    const table = vaults[name.replace(/^vault_/, "")];
    const value = table?.entries?.[index];
    return value === undefined || value === null ? null : value;
  };
  const findName = roles.findName;
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      if (node.callee.type !== "Identifier" || node.callee.name !== findName) return;
      const key = node.arguments[1];
      if (key?.type !== "StringLiteral") return;
      names++;
      path.replaceWith(t.stringLiteral(key.value));
    },
    SequenceExpression(path) {
      const expressions = path.node.expressions;
      const last = expressions.at(-1);
      if (last?.type !== "CallExpression" || last.callee.type !== "Identifier") return;
      const locals = new Map();
      for (const expression of expressions.slice(0, -1)) {
        if (expression.type !== "AssignmentExpression" || expression.operator !== "=") return;
        if (expression.left.type !== "Identifier") return;
        locals.set(expression.left.name, expression.right);
      }
      const callee = locals.get(last.callee.name);
      const argument = last.arguments[0];
      const index =
        argument?.type === "NumericLiteral" ? argument.value : locals.get(argument?.name)?.value;
      if (callee?.type !== "Identifier" || !callee.name.startsWith("vault_")) return;
      if (typeof index !== "number") return;
      const value = entryAt(callee.name, index);
      if (value === null) return;
      tables++;
      path.replaceWith(t.valueToNode(value));
    },
  });
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      if (node.callee.type !== "Identifier" || !node.callee.name.startsWith("vault_")) return;
      if (node.arguments.length !== 1 || node.arguments[0].type !== "NumericLiteral") return;
      const value = entryAt(node.callee.name, node.arguments[0].value);
      if (value === null) return;
      tables++;
      path.replaceWith(t.valueToNode(value));
    },
  });
  tables += await evaluateInlineTables(ast, roles);
  return {
    code: generate(ast, {
      comments: false,
    }).code,
    asCall,
    asValue,
    bound,
    tables,
    names,
  };
}

async function evaluateInlineTables(ast, roles) {
  const sites = [];
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      if (node.arguments.length !== 1 || node.arguments[0].type !== "NumericLiteral") return;
      const inner = node.callee;
      if (inner.type !== "CallExpression" || inner.callee.type !== "Identifier") return;
      if (inner.callee.name !== roles.makeVault) return;
      if (inner.arguments[0]?.type !== "ArrayExpression") return;
      if (inner.arguments[1]?.type !== "NumericLiteral") return;
      sites.push(path);
    },
  });
  if (!sites.length) return 0;
  const { index } = buildSurface(ast);
  const declarations = new Map();
  traverse(ast, {
    Program(programPath) {
      for (const statement of programPath.get("body")) {
        const path = statement.isExportNamedDeclaration()
          ? statement.get("declaration")
          : statement;
        if (path?.isFunctionDeclaration() && path.node.id)
          declarations.set(path.node.id.name, path.node);
        if (!path?.isVariableDeclaration()) continue;
        for (const declarator of path.node.declarations) {
          if (declarator.id.type === "Identifier") {
            declarations.set(
              declarator.id.name,
              t.variableDeclaration(path.node.kind, [declarator]),
            );
          }
        }
      }
    },
  });
  const needed = new Set([roles.makeVault]);
  let frontier = [roles.makeVault];
  while (frontier.length) {
    const next = [];
    for (const name of frontier) {
      for (const dep of index.get(name)?.deps ?? []) {
        if (needed.has(dep)) continue;
        needed.add(dep);
        next.push(dep);
      }
    }
    frontier = next;
  }
  const parts = [...declarations]
    .filter(([name]) => needed.has(name))
    .map(
      ([, node]) =>
        generate(node, {
          comments: false,
        }).code,
    );
  parts.push(`export { ${roles.makeVault} as makeVault };`);
  const modulePath = join(ARTIFACTS, ".inline-tables.mjs");
  writeFileSync(modulePath, `${parts.join("\n")}\n`);
  const { makeVault } = await import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);
  let folded = 0;
  for (const path of sites) {
    const inner = path.node.callee;
    const words = inner.arguments[0].elements.map((element) => element.value);
    const keyLength = inner.arguments[1].value;
    const value = makeVault(words, keyLength)(path.node.arguments[0].value);
    if (value === undefined || value === null) continue;
    path.replaceWith(t.valueToNode(value));
    folded++;
  }
  return folded;
}

function liftedFunction(ast, match, name) {
  let found = null;
  traverse(ast, {
    "FunctionExpression|ArrowFunctionExpression"(path) {
      if (found) return;
      if (!match(path)) return;
      found = path;
    },
  });
  if (!found) return null;
  const node = found.node;
  const params = node.params.map((param) => generate(param).code).join(", ");
  const body =
    node.body.type === "BlockStatement"
      ? generate(node.body).code
      : `{ return ${generate(node.body).code}; }`;
  const references = new Set();
  found.traverse({
    ReferencedIdentifier(path) {
      if (found.scope.hasOwnBinding(path.node.name)) return;
      if (
        path.scope.hasBinding(path.node.name, {
          noGlobals: true,
        })
      )
        return;
      references.add(path.node.name);
    },
  });
  return {
    text: `${node.async ? "async " : ""}function ${name}(${params}) ${body}`,
    references: [...references],
  };
}

const rawSource = readFileSync(CLEAN_AGENT, "utf8");
const inlined = await inlineVaultedProps(rawSource);
const source = await prettier.format(inlined.code, PRETTIER);
const ast = parse(source, {
  sourceType: "module",
});
const { roles } = detectPrimitives(ast);
const registries = collectSignalRegistries(ast);
const builders = moduleBuilders(ast);

const cm = required(
  registries.find((module) => module.key === "cm"),
  "the cm module registry",
);

const cmBuilder = required(builders.get("cm"), "the cm module builder");
const exBuilder = required(builders.get("ex"), "the ex module builder");
const envelope = required(roles.envelope, "the envelope builder");
const topLevel = new Map();

traverse(ast, {
  Program(programPath) {
    for (const statement of programPath.get("body")) {
      const path = statement.isExportNamedDeclaration() ? statement.get("declaration") : statement;
      if (!path?.node) continue;
      const record = {
        start: path.node.start,
        end: path.node.end,
        line: path.node.loc.start.line,
      };
      if (path.isFunctionDeclaration() || path.isClassDeclaration()) {
        if (path.node.id?.name) topLevel.set(path.node.id.name, record);
        continue;
      }
      if (!path.isVariableDeclaration()) continue;
      for (const declarator of path.get("declarations")) {
        if (declarator.node.id.type !== "Identifier") continue;
        topLevel.set(declarator.node.id.name, {
          start: declarator.node.start,
          end: declarator.node.end,
          line: declarator.node.loc.start.line,
          declarator: path.node.kind,
        });
      }
    }
  },
});

const statementText = (name) => {
  const record = topLevel.get(name);
  if (!record) return null;
  const body = source.slice(record.start, record.end);
  return record.declarator ? `${record.declarator} ${body};` : body;
};

function moduleListRoots() {
  let queue = null;
  traverse(ast, {
    FunctionDeclaration(path) {
      if (queue) return;
      let mentionsCm = false;
      const calls = [];
      path.traverse({
        CallExpression(callPath) {
          if (callPath.node.callee.type !== "Identifier") return;
          if (callPath.node.callee.name === cmBuilder) mentionsCm = true;
          else if (topLevel.has(callPath.node.callee.name)) calls.push(callPath.node.callee.name);
        },
      });
      if (mentionsCm && calls.length === 1) queue = calls[0];
    },
  });
  return queue;
}

const retryQueue = required(moduleListRoots(), "the retry-queue module builder");

function functionWithLiteral(fragment) {
  let name = null;
  for (const [candidate, record] of topLevel) {
    if (name) break;
    if (source.slice(record.start, record.end).includes(fragment)) name = candidate;
  }
  return name;
}

const turnHost = required(functionWithLiteral("-turn.fpjs.io"), "the TURN host builder");

const sharedIframe = required(
  liftedFunction(
    ast,
    (path) => {
      let hit = false;
      path.traverse({
        AssignmentExpression(assign) {
          const left = assign.node.left;
          if (left.type !== "MemberExpression" || left.computed) return;
          if (left.property.name !== "siw") return;
          hit = true;
        },
      });
      return hit;
    },
    "bootSharedIframe",
  ),
  "the shared-iframe boot",
);

const frameBody = required(
  liftedFunction(
    ast,
    (path) => {
      if (!path.node.async) return false;
      let hit = false;
      path.traverse({
        TemplateLiteral(template) {
          if (template.node.expressions.length !== 2) return;
          if (template.node.quasis.map((quasi) => quasi.value.raw).join("|") !== "|:|") return;
          hit = true;
        },
      });
      return hit;
    },
    "frameRequestBody",
  ),
  "the request-body framer",
);

const profiles = findFrameProfiles(ast, roles);

const postProfile = required(
  profiles.find((profile) => profile.markerBytes?.join() === "3,14") ?? profiles[0],
  "a frame profile for the telemetry POST",
);

const { index, collect } = buildSurface(ast);

function closure(roots) {
  const seen = new Set(roots);
  let frontier = [...roots];
  while (frontier.length) {
    const next = [];
    for (const name of frontier) {
      for (const dep of index.get(name)?.deps ?? []) {
        if (seen.has(dep)) continue;
        seen.add(dep);
        next.push(dep);
      }
    }
    frontier = next;
  }
  return seen;
}

const ROOTS = [
  cmBuilder,
  exBuilder,
  retryQueue,
  envelope,
  turnHost,
  roles.jsonEncode,
  roles.compress,
  roles.sealFrame,
  ...sharedIframe.references,
  ...frameBody.references,
];

const reachable = closure(ROOTS.filter((name) => topLevel.has(name)));
const dropped = [...reachable].filter((name) => !topLevel.has(name));

if (dropped.length)
  console.warn(
    `collector: ${dropped.length} closure names have no statement: ${dropped.join(", ")}`,
  );

const used = new Set();

const uniqueName = (candidate, id) => {
  const base = candidate && /^[A-Za-z][A-Za-z0-9]*$/.test(candidate) ? candidate : id;
  let name = base;
  let n = 2;
  while (used.has(name)) name = `${base}_${n++}`;
  used.add(name);
  return name;
};

const collectors = cm.entries.filter((entry) => entry.stage !== "request");

const labels = Object.fromEntries(
  collectors.map((entry) => {
    const suffix = /^sig_s\d+_(.+)$/.exec(entry.binding)?.[1];
    if (suffix) return [entry.id, uniqueName(suffix, entry.id)];
    const { apis, engine } = collect(entry.binding);
    const surface = [...apis.keys()][0] ?? [...engine.keys()][0];
    return [entry.id, uniqueName(surface ? apiSlug(surface) : null, entry.id)];
  }),
);

const headers = new Map();

for (const entry of collectors) {
  const { apis, engine, codes } = collect(entry.binding);
  const keys = [...(apis.size ? apis : engine).keys()];
  headers.set(
    entry.binding,
    `// ${entry.id} ${labels[entry.id]} — ${keys.slice(0, 4).join(", ") || "no browser surface read"} (codes: ${codes.join(" ") || 0})`,
  );
}

const emitted = [...reachable]
  .map((name) => ({
    name,
    record: topLevel.get(name),
  }))
  .filter((entry) => entry.record)
  .sort((a, b) => a.record.line - b.record.line)
  .map((entry) => {
    const header = headers.get(entry.name);
    return header ? `${header}\n${statementText(entry.name)}` : statementText(entry.name);
  });

const imiMatch = /\.imi\s*=\s*\{\s*m:\s*"([^"]+)"\s*,\s*l:\s*"([^"]+)"\s*\}/.exec(source);

const imi = imiMatch
  ? {
      m: imiMatch[1],
      l: imiMatch[2],
    }
  : {
      m: "l",
      l: "jsl/4.0.0",
    };

const driver = `
function boundProperty(object, name) {
  const value = object[name];
  return typeof value === "function" ? value.bind(object) : value;
}

const SIGNAL_NAMES = ${JSON.stringify(labels, null, 2)};

const FRAME = ${JSON.stringify({
  marker: postProfile.markerBytes,
  padMax: postProfile.padMax,
  keyLength: postProfile.keyLength,
})};

${sharedIframe.text}

${frameBody.text}

function serialisable(value) {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(value, (key, entry) => {
      if (typeof entry === "object" && entry !== null) {
        if (typeof Window !== "undefined" && entry instanceof Window) return "[Window]";
        if (typeof Node !== "undefined" && entry instanceof Node) return \`[\${entry.nodeName}]\`;
        if (seen.has(entry)) return "[Circular]";
        seen.add(entry);
      }
      return entry;
    }),
  );
}

async function runSource(source, options) {
  const started = Date.now();
  try {
    const first = await source(options);
    const setup = Date.now() - started;
    if (typeof first !== "function") return { value: first, duration: setup };
    const resumed = Date.now();
    try {
      return { value: await first(), duration: setup + (Date.now() - resumed) };
    } catch (error) {
      return { error: String(error), duration: setup + (Date.now() - resumed) };
    }
  } catch (error) {
    return { error: String(error), duration: Date.now() - started };
  }
}

export async function collect({ region = "us", urlHashing = false } = {}) {
  const shared = { aq: [], ipq: false, si: null, siw: null, ip: null, dc: { adb: 0, crs: 0, asib: 0 } };
  bootSharedIframe(shared);

  const options = {
    urlHashing,
    ab: {},
    te: ${turnHost}(region),
    sis: shared,
    esc: true,
    ewr: false,
    cache: {},
  };

  const module = ${cmBuilder}();
  const sources = {
    ...module.sources.stage1,
    ...module.sources.stage2,
    ...module.sources.stage3,
  };

  const components = {};
  await Promise.all(
    Object.entries(sources).map(async ([id, source]) => {
      components[id] = await runSource(source, options);
    }),
  );

  const named = {};
  for (const [id, outcome] of Object.entries(components)) {
    named[SIGNAL_NAMES[id] ?? id] = { id, ...outcome };
  }

  return { module, components, named: serialisable(named), options };
}

export async function buildPayload({ apiKey, region = "us", urlHashing = false } = {}) {
  const { module, components } = await collect({ region, urlHashing });
  const payload = await ${envelope}({
    modules: [${exBuilder}(), module, ${retryQueue}()],
    components,
    apiKey,
    ii: [],
    imi: ${JSON.stringify(imi)},
    storageKeyPrefix: "_vid_",
    ab: {},
    urlHashing,
  });
  return serialisable(payload);
}

export async function frame(payload) {
  const bytes = ${roles.jsonEncode}(payload);
  const [compressed, deflated] = await ${roles.compress}(bytes);
  const sealed = ${roles.sealFrame}(
    compressed ? deflated : bytes,
    FRAME.marker,
    FRAME.padMax,
    FRAME.keyLength,
  );
  return { bytes: new Uint8Array(sealed), compressed, json: bytes.length };
}

export async function send({
  apiKey,
  endpoint,
  region = "us",
  payload = null,
  urlHashing = false,
} = {}) {
  const body = payload ?? (await buildPayload({ apiKey, region, urlHashing }));
  const sealed = await frame(body);
  const url = \`\${endpoint}?region=\${encodeURIComponent(region)}&ci=\${encodeURIComponent("${imi.l}")}&q=\${encodeURIComponent(apiKey)}\`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: sealed.bytes,
  });
  const text = await response.text();
  return { status: response.status, body: text, payload: body };
}
`.trim();

const banner = [
  "/**",
  " * The Fingerprint Pro v4 agent's own collectors, cut out of the deobfuscated bundle.",
  " *",
  " * Generated by tools/collector.mjs from agent/agent.clean.js. Every function here is the shipped",
  " * code with the string vaults decrypted, the CRC32 property reads collapsed to plain member",
  " * access and the obfuscator's wrappers folded away. Nothing is reimplemented, so a rebuild after",
  " * a version bump reports what changed instead of drifting.",
  " */",
].join("\n");

const out = `${banner}\n\n${[...emitted, driver].join("\n\n")}\n`;
const formatted = await prettier.format(out, PRETTIER);

writeFileSync(join(COLLECTOR, "fp-collect.js"), formatted);

const consoleBuild = [
  "(() => {",
  formatted.replace(/^export (async function|function)/gm, "$1"),
  "window.fpCollect = { collect, buildPayload, frame, send };",
  'console.log("fpCollect ready: await fpCollect.collect()");',
  "})();",
].join("\n");

writeFileSync(join(COLLECTOR, "fp-collect.console.js"), consoleBuild);

console.log(`vault reads   ${inlined.asValue} properties collapsed, ${inlined.bound} kept bound`);

console.log(`vault strings ${inlined.tables} table reads, ${inlined.names} resolved names inlined`);

console.log(
  `roots         cm=${cmBuilder} ex=${exBuilder} queue=${retryQueue} envelope=${envelope} turn=${turnHost}`,
);

console.log(
  `frame         tag ${postProfile.markerBytes?.join(",")}, pad ${postProfile.padMax}, key ${postProfile.keyLength}`,
);

console.log(`signals       ${collectors.length}`);
console.log(`bindings      ${reachable.size} module-level declarations`);
console.log(`out           ${join(COLLECTOR, "fp-collect.js")}`);
