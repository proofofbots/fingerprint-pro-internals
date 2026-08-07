import generateModule from "@babel/generator";
import traverseModule from "@babel/traverse";
import { camelCase as camel } from "./naming.mjs";

const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;
const MAX_DEPTH = 6;
const MAX_HELPERS = 240;
const CHECK_DEPTH = 2;
const MAX_CHECKS = 60;
const CHECK_WIDTH = 160;

const COMPARISONS = new Set(["===", "!==", "==", "!=", "<", "<=", ">", ">=", "instanceof", "in"]);

const LANGUAGE_GLOBALS = new Set([
  "Object",
  "Array",
  "String",
  "Number",
  "Boolean",
  "Symbol",
  "BigInt",
  "Math",
  "JSON",
  "Promise",
  "Function",
  "RegExp",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "WeakRef",
  "Reflect",
  "Proxy",
  "Error",
  "TypeError",
  "RangeError",
  "SyntaxError",
  "EvalError",
  "ReferenceError",
  "URIError",
  "AggregateError",
  "Infinity",
  "NaN",
  "undefined",
  "parseInt",
  "parseFloat",
  "isNaN",
  "isFinite",
  "encodeURIComponent",
  "decodeURIComponent",
  "encodeURI",
  "decodeURI",
  "escape",
  "unescape",
  "console",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array",
  "Atomics",
  "arguments",
]);

const NOISE_PATHS = new Set(["Date.now()"]);

const ENGINE_NOISE = new Set([
  "Object.keys",
  "Object.assign",
  "Object.entries",
  "Object.values",
  "Object.defineProperty",
  "Object.getOwnPropertyDescriptor",
  "Object.freeze",
  "Object.create",
  "Array.isArray",
  "Array.from",
  "JSON.stringify",
  "JSON.parse",
  "Promise.all",
  "Promise.resolve",
  "Promise.race",
  "Promise.reject",
  "Math.min",
  "Math.max",
  "Math.floor",
  "Math.round",
  "Math.abs",
  "Math.pow",
  "String.fromCharCode",
  "Number.isNaN",
  "Number.isFinite",
  "parseInt",
  "parseFloat",
  "isNaN",
  "encodeURIComponent",
  "decodeURIComponent",
  "console.error",
  "console.warn",
  "console.log",
]);

function numericCode(node) {
  if (!node) return null;
  if (node.type === "NumericLiteral") return node.value;
  if (
    node.type === "UnaryExpression" &&
    node.operator === "-" &&
    node.argument.type === "NumericLiteral"
  ) {
    return -node.argument.value;
  }
  return null;
}

function statusCodes(node, path, depth = 0) {
  if (!node || depth > 3) return [];
  const direct = numericCode(node);
  if (direct !== null) return [direct];
  if (node.type === "ConditionalExpression") {
    return [
      ...statusCodes(node.consequent, path, depth + 1),
      ...statusCodes(node.alternate, path, depth + 1),
    ];
  }
  if (node.type === "LogicalExpression") {
    return [
      ...statusCodes(node.left, path, depth + 1),
      ...statusCodes(node.right, path, depth + 1),
    ];
  }
  if (node.type === "Identifier") {
    const binding = path.scope.getBinding(node.name);
    const init = binding?.path?.node?.init;
    return init ? statusCodes(init, binding.path, depth + 1) : [];
  }
  return [];
}

function declaredName(path) {
  if (path.isFunctionDeclaration() || path.isClassDeclaration()) return path.node.id?.name ?? null;
  return null;
}

function callArgument(node) {
  if (!node) return "";
  if (node.type === "StringLiteral") return JSON.stringify(node.value.slice(0, 40));
  if (node.type === "TemplateLiteral") {
    const text = node.quasis.map((quasi) => quasi.value.cooked).join("${}");
    return `\`${text.slice(0, 40)}\``;
  }
  return "";
}

function memberPath(path, base = null) {
  let current = path;
  const parts = [base ?? current.node.name];
  while (parts.length < 4) {
    const parent = current.parentPath;
    if (!parent) break;
    if (
      (parent.isMemberExpression() || parent.isOptionalMemberExpression()) &&
      current.key === "object"
    ) {
      const { property, computed } = parent.node;
      if (!computed && property.type === "Identifier") parts.push(property.name);
      else if (computed && property.type === "StringLiteral") parts.push(property.value);
      else break;
      current = parent;
      continue;
    }
    if (
      (parent.isCallExpression() || parent.isOptionalCallExpression()) &&
      current.key === "callee"
    ) {
      return `${parts.join(".")}(${callArgument(parent.node.arguments[0])})`;
    }
    break;
  }
  return parts.join(".");
}

function probedPath(path, base = null) {
  const parent = path.parentPath;
  if (
    parent?.isBinaryExpression() &&
    parent.node.operator === "in" &&
    path.key === "right" &&
    parent.node.left.type === "StringLiteral"
  ) {
    return `${base ?? path.node.name}.${parent.node.left.value}`;
  }
  return memberPath(path, base);
}

function isReferencePosition(path) {
  const parent = path.parentPath;
  if (!parent) return true;
  if (
    (parent.isMemberExpression() || parent.isOptionalMemberExpression()) &&
    path.key === "property" &&
    !parent.node.computed
  ) {
    return false;
  }
  if (
    (parent.isObjectProperty() || parent.isObjectMethod()) &&
    path.key === "key" &&
    !parent.node.computed
  ) {
    return false;
  }
  if (parent.isClassMethod() && path.key === "key" && !parent.node.computed) return false;
  return true;
}

function collectAliases(path) {
  const direct = new Map();
  path.traverse({
    VariableDeclarator(declaratorPath) {
      const { id, init } = declaratorPath.node;
      if (id.type !== "Identifier" || !init) return;
      if (init.type === "Identifier") {
        direct.set(id.name, {
          value: init.name,
          scope: declaratorPath.scope,
        });
        return;
      }
      if (init.type !== "MemberExpression" || init.computed) return;
      if (init.property.type !== "Identifier") return;
      if (init.object.type !== "Identifier") return;
      direct.set(id.name, {
        value: `${init.object.name}.${init.property.name}`,
        scope: declaratorPath.scope,
      });
    },
  });
  const resolved = new Map();
  for (const [name, entry] of direct) {
    let value = entry.value;
    const seen = new Set([name]);
    for (let step = 0; step < 4; step++) {
      const head = value.split(".")[0];
      if (seen.has(head) || !direct.has(head)) break;
      seen.add(head);
      value = value.replace(head, direct.get(head).value);
    }
    const head = value.split(".")[0];
    if (entry.scope.getBinding(head) || LANGUAGE_GLOBALS.has(head)) continue;
    resolved.set(name, value);
  }
  return resolved;
}

function valueShape(node) {
  if (!node) return null;
  switch (node.type) {
    case "ObjectExpression": {
      const keys = node.properties
        .map((property) =>
          property.type === "SpreadElement"
            ? "..."
            : property.computed
              ? null
              : (property.key?.name ?? property.key?.value),
        )
        .filter((key) => key !== null && key !== undefined);
      return keys.length ? `{${keys.join(",")}}` : "{}";
    }
    case "ArrayExpression":
      return "[]";
    case "StringLiteral":
      return "string";
    case "NumericLiteral":
      return "number";
    case "BooleanLiteral":
      return "boolean";
    case "NullLiteral":
      return "null";
    case "Identifier":
      return node.name === "undefined" ? "null" : "value";
    case "AwaitExpression":
      return valueShape(node.argument);
    case "ConditionalExpression":
      return valueShape(node.consequent) ?? valueShape(node.alternate);
    case "CallExpression":
    case "OptionalCallExpression":
      return "call";
    default:
      return "value";
  }
}

function checkText(node) {
  if (!node) return null;
  if (node.type === "Identifier" || node.type === "ThisExpression") return null;
  if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") return null;
  let text;
  try {
    text = generate(node, {
      comments: false,
      concise: true,
    }).code;
  } catch {
    return null;
  }
  text = text.replace(/\s+/g, " ").trim();
  if (text.length < 4) return null;
  return text.length > CHECK_WIDTH ? `${text.slice(0, CHECK_WIDTH)}…` : text;
}

const literalValue = (node) => {
  if (!node) return null;
  if (node.type === "StringLiteral") return JSON.stringify(node.value.slice(0, 40));
  if (node.type === "NumericLiteral") return String(node.value);
  if (node.type === "BooleanLiteral") return String(node.value);
  if (
    node.type === "UnaryExpression" &&
    node.operator === "-" &&
    node.argument.type === "NumericLiteral"
  ) {
    return String(-node.argument.value);
  }
  return null;
};

function recordDecisions(path, record) {
  const add = (node) => {
    const text = checkText(node);
    if (text) record.checks.add(text);
  };
  path.traverse({
    IfStatement(branch) {
      add(branch.node.test);
    },
    ConditionalExpression(branch) {
      add(branch.node.test);
    },
    ReturnStatement(branch) {
      const argument = branch.node.argument;
      if (!argument) return;
      if (
        argument.type === "BinaryExpression" ||
        argument.type === "LogicalExpression" ||
        (argument.type === "UnaryExpression" && argument.operator === "!")
      ) {
        add(argument);
      }
    },
    BinaryExpression(branch) {
      if (!COMPARISONS.has(branch.node.operator)) return;
      const value = literalValue(branch.node.right) ?? literalValue(branch.node.left);
      if (value !== null) record.constants.add(`${branch.node.operator} ${value}`);
    },
  });
}

/**
 * Which collector a module-level helper belongs to. A helper reached from exactly one root is that
 * signal's own measurement code and can be named after it; one reached from several is shared
 * plumbing and stays anonymous. Roots stop the walk, so a collector that calls another collector
 * does not swallow it.
 */

/**
 * Which collector a module-level helper belongs to. A helper reached from exactly one root is that
 * signal's own measurement code and can be named after it; one reached from several is shared
 * plumbing and stays anonymous. Roots stop the walk, so a collector that calls another collector
 * does not swallow it.
 */
export function exclusiveOwners(index, roots) {
  const rootSet = new Set(roots);
  const owners = new Map();
  for (const root of rootSet) {
    const seen = new Set([root]);
    let frontier = [root];
    while (frontier.length) {
      const next = [];
      for (const name of frontier) {
        for (const dep of index.get(name)?.deps ?? []) {
          if (seen.has(dep) || rootSet.has(dep)) continue;
          seen.add(dep);
          if (!owners.has(dep)) owners.set(dep, new Set());
          owners.get(dep).add(root);
          next.push(dep);
        }
      }
      frontier = next;
    }
  }
  const exclusive = new Map();
  for (const [name, claimants] of owners) {
    if (claimants.size === 1) exclusive.set(name, [...claimants][0]);
  }
  return exclusive;
}

/**
 * The agent reports a failed signal by throwing one error class carrying a numeric state, which the
 * `{s, v}` wrapper turns into the status code. The class is found by shape — an `Error` subclass
 * whose constructor assigns its first parameter to `state` — so a rename cannot lose it.
 */

/**
 * The agent reports a failed signal by throwing one error class carrying a numeric state, which the
 * `{s, v}` wrapper turns into the status code. The class is found by shape — an `Error` subclass
 * whose constructor assigns its first parameter to `state` — so a rename cannot lose it.
 */
export function findStatusError(ast) {
  let found = null;
  traverse(ast, {
    Class(path) {
      if (found || path.node.superClass?.name !== "Error" || !path.node.id?.name) return;
      const constructor = path.node.body.body.find((member) => member.kind === "constructor");
      const first = constructor?.params?.[0];
      if (first?.type !== "Identifier") return;
      const assignsState = constructor.body.body.some(
        (statement) =>
          statement.type === "ExpressionStatement" &&
          statement.expression.type === "AssignmentExpression" &&
          statement.expression.left.type === "MemberExpression" &&
          statement.expression.left.object.type === "ThisExpression" &&
          statement.expression.left.property.name === "state" &&
          statement.expression.right.type === "Identifier" &&
          statement.expression.right.name === first.name,
      );
      if (assignsState) found = path.node.id.name;
    },
  });
  return found;
}

export function buildSurface(ast, { hashName = null } = {}) {
  const index = new Map();
  const statusError = findStatusError(ast);
  traverse(ast, {
    Program(programPath) {
      const scan = (owner, path) => {
        if (!index.has(owner)) {
          index.set(owner, {
            apis: new Map(),
            engine: new Map(),
            deps: new Set(),
            codes: new Set(),
            defaults: new Set(),
            strings: new Set(),
            shapes: new Set(),
            checks: new Set(),
            constants: new Set(),
            reasons: new Map(),
            hashes: false,
          });
        }
        const record = index.get(owner);
        const aliases = collectAliases(path);
        recordDecisions(path, record);
        if (path.isCallExpression()) {
          for (const argument of path.node.arguments) {
            const code = numericCode(argument);
            if (code !== null && code <= 0 && code >= -200) record.defaults.add(code);
          }
        }
        const visit = (identifierPath) => {
          if (!isReferencePosition(identifierPath)) return;
          const name = identifierPath.node.name;
          if (name === owner) return;
          const binding = identifierPath.scope.getBinding(name);
          const alias = aliases.get(name);
          if (!binding || alias) {
            if (
              alias &&
              identifierPath.parentPath?.isVariableDeclarator() &&
              identifierPath.key === "id"
            )
              return;
            const key = probedPath(identifierPath, alias ?? null);
            if (NOISE_PATHS.has(key)) return;
            const target = !alias && LANGUAGE_GLOBALS.has(name) ? record.engine : record.apis;
            if (target === record.engine && ENGINE_NOISE.has(key)) return;
            target.set(key, (target.get(key) ?? 0) + 1);
            return;
          }
          if (name === hashName) record.hashes = true;
          if (binding.scope === programPath.scope) record.deps.add(name);
        };
        path.traverse({
          Identifier: visit,
          StringLiteral(literalPath) {
            const value = literalPath.node.value;
            if (!value || value.length > 40) return;
            if (literalPath.parentPath?.isImportDeclaration()) return;
            record.strings.add(value);
          },
          ObjectProperty(propertyPath) {
            const { key, computed, value } = propertyPath.node;
            const name = !computed && key.type === "Identifier" ? key.name : null;
            if (name === "v") {
              const shape = valueShape(value);
              if (shape) record.shapes.add(shape);
              return;
            }
            if (name !== "s") return;
            for (const code of statusCodes(value, propertyPath)) record.codes.add(code);
          },
          ReturnStatement(returnPath) {
            const code = numericCode(returnPath.node.argument);
            if (code !== null && code < 0 && code >= -200) record.codes.add(code);
          },
          CallExpression(callPath) {
            const callee = callPath.node.callee;
            if (callee.type !== "Identifier") return;
            const binding = callPath.scope.getBinding(callee.name);
            if (!binding || binding.scope !== programPath.scope) return;
            for (const argument of callPath.node.arguments) {
              const code = numericCode(argument);
              if (code !== null && code < 0 && code >= -20) record.codes.add(code);
            }
          },
          NewExpression(newPath) {
            if (!statusError || newPath.node.callee.name !== statusError) return;
            const code = numericCode(newPath.node.arguments[0]);
            if (code === null) return;
            record.codes.add(code);
            const message = newPath.node.arguments[1];
            const reason =
              message?.type === "StringLiteral"
                ? message.value
                : message?.type === "TemplateLiteral"
                  ? message.quasis.map((quasi) => quasi.value.cooked).join("${}")
                  : null;
            if (!reason) return;
            if (!record.reasons.has(code)) record.reasons.set(code, new Set());
            record.reasons.get(code).add(reason.slice(0, 80));
          },
        });
      };
      for (const statement of programPath.get("body")) {
        const path = statement.isExportNamedDeclaration()
          ? statement.get("declaration")
          : statement;
        if (!path?.node) continue;
        const name = declaredName(path);
        if (name) {
          scan(name, path);
          continue;
        }
        if (!path.isVariableDeclaration()) continue;
        for (const declarator of path.get("declarations")) {
          if (declarator.node.id.type !== "Identifier" || !declarator.node.init) continue;
          scan(declarator.node.id.name, declarator.get("init"));
        }
      }
    },
  });
  const collect = (root, { owned = null } = {}) => {
    const apis = new Map();
    const engine = new Map();
    const codes = new Set();
    const strings = new Set();
    const shapes = new Set();
    const checks = [];
    const constants = new Set();
    const reasons = new Map();
    const helpers = [];
    let hashes = false;
    const seen = new Set([root]);
    let frontier = [root];
    let reached = 0;
    let truncated = false;
    for (let depth = 0; depth <= MAX_DEPTH && frontier.length; depth++) {
      const next = [];
      for (const name of frontier) {
        const entry = index.get(name);
        if (!entry) continue;
        const own = name === root || Boolean(owned?.has(name));
        if (name !== root) helpers.push(name);
        for (const [api, count] of entry.apis) apis.set(api, (apis.get(api) ?? 0) + count);
        for (const [api, count] of entry.engine) engine.set(api, (engine.get(api) ?? 0) + count);
        for (const code of entry.codes) codes.add(code);
        for (const [code, messages] of entry.reasons) {
          if (!reasons.has(code)) reasons.set(code, new Set());
          for (const message of messages) reasons.get(code).add(message);
        }
        if (entry.hashes) hashes = true;
        if (own || depth <= 1) for (const shape of entry.shapes) shapes.add(shape);
        if (name === root) for (const code of entry.defaults) codes.add(code);
        if (own || depth <= 1) for (const value of entry.strings) strings.add(value);
        if (own || depth <= CHECK_DEPTH) {
          for (const text of entry.checks) checks.push(name === root ? text : `${name}: ${text}`);
          for (const value of entry.constants) constants.add(value);
        }
        for (const dep of entry.deps) {
          if (seen.has(dep)) continue;
          if (reached >= MAX_HELPERS) {
            truncated = true;
            continue;
          }
          seen.add(dep);
          reached++;
          next.push(dep);
        }
      }
      if (depth === MAX_DEPTH && next.length) truncated = true;
      frontier = next;
    }
    const probes = [...strings].filter(
      (value) => ![...apis.keys()].some((api) => api.includes(value)),
    );
    const allChecks = [...new Set(checks)];
    return {
      apis,
      engine,
      probes: probes.sort(),
      codes: [...codes].sort((a, b) => b - a),
      shapes: [...shapes].sort(),
      checks: allChecks.slice(0, MAX_CHECKS),
      constants: [...constants].sort(),
      reasons: Object.fromEntries(
        [...reasons].sort((a, b) => b[0] - a[0]).map(([code, set]) => [code, [...set]]),
      ),
      hashed: hashes,
      helpers: helpers.sort(),
      truncated: truncated || allChecks.length > MAX_CHECKS,
    };
  };
  return {
    index,
    collect,
  };
}

/**
 * Every stage-2 collector runs through the same shared-iframe wrapper, so the APIs that wrapper
 * touches turn up under all of them. Ranking rarest-first puts what distinguishes a collector in
 * front of what it inherits, which is what makes the first entry usable as a name.
 */

/**
 * Every stage-2 collector runs through the same shared-iframe wrapper, so the APIs that wrapper
 * touches turn up under all of them. Ranking rarest-first puts what distinguishes a collector in
 * front of what it inherits, which is what makes the first entry usable as a name.
 */
export function rankByRarity(apiSets) {
  const documentFrequency = new Map();
  for (const apis of apiSets) {
    for (const api of apis.keys())
      documentFrequency.set(api, (documentFrequency.get(api) ?? 0) + 1);
  }
  return (apis) =>
    [...apis]
      .sort(
        (a, b) =>
          documentFrequency.get(a[0]) - documentFrequency.get(b[0]) ||
          b[1] - a[1] ||
          a[0].localeCompare(b[0]),
      )
      .map(([api]) => api);
}

const ROOT_OBJECTS = new Set(["window", "navigator", "document", "screen", "self", "globalThis"]);

const GENERIC_CALLS = new Set([
  "createElement",
  "getContext",
  "matchMedia",
  "createEvent",
  "query",
  "getExtension",
  "getItem",
  "setItem",
  "getParameter",
  "supports",
  "getPropertyValue",
  "call",
  "apply",
]);

const UNINFORMATIVE_SLUGS = new Set([
  "domException",
  "textEncoder",
  "prototype",
  "indexOf",
  "close",
  "toString",
  "valueOf",
  "call",
  "apply",
  "hasOwnProperty",
  "keys",
  "length",
  "error",
  "window",
  "self",
  "document",
  "navigator",
  "screen",
  "name",
  "message",
  "then",
  "assign",
  "push",
  "test",
  "exec",
  "slice",
  "join",
  "split",
  "addEventListener",
  "removeEventListener",
  "setTimeout",
  "clearTimeout",
  "now",
  "getTime",
  "appendChild",
  "removeChild",
  "body",
  "documentElement",
  "createObjectURL",
  "revokeObjectURL",
]);

export const isInformativeSlug = (slug) => Boolean(slug) && !UNINFORMATIVE_SLUGS.has(slug);

/**
 * A short name for one recorded API path. `matchMedia(`(prefers-color-scheme: ${})`)` is the media
 * feature, `document.createElement("canvas")` is the element: for a call whose name says nothing on
 * its own, what identifies the probe is the argument, not the method.
 */

/**
 * A short name for one recorded API path. `matchMedia(`(prefers-color-scheme: ${})`)` is the media
 * feature, `document.createElement("canvas")` is the element: for a call whose name says nothing on
 * its own, what identifies the probe is the argument, not the method.
 */
export function apiSlug(api) {
  const match = /^([^(]+)(?:\((.*)\)\s*)?$/.exec(api);
  if (!match) return null;
  const [, pathText, argText = ""] = match;
  const parts = pathText.split(".").filter(Boolean);
  while (parts.length > 1 && ROOT_OBJECTS.has(parts[0])) parts.shift();
  const tail = parts[parts.length - 1];
  if (!tail) return null;
  const feature = /([a-z]+(?:-[a-z]+)+)/.exec(argText);
  if (feature) return camel(feature[1].split("-"));
  const word = /^["'`]?([A-Za-z][A-Za-z0-9]{1,20})["'`]?$/.exec(argText.trim());
  if (word && GENERIC_CALLS.has(tail)) return camel([word[1]]);
  const prefix = parts.length > 1 ? parts[parts.length - 2] : null;
  if (prefix && GENERIC_CALLS.has(tail)) return camel([prefix, tail]);
  return camel([tail]);
}
