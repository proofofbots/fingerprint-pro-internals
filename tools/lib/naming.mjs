const RESERVED = new Set([
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "undefined",
  "NaN",
  "Infinity",
  "globalThis",
  "arguments",
  "eval",
]);

const UNINFORMATIVE_PROPERTIES = new Set([
  "length",
  "name",
  "value",
  "type",
  "data",
  "call",
  "apply",
  "bind",
  "toString",
  "valueOf",
  "constructor",
  "prototype",
  "then",
  "catch",
  "finally",
  "push",
  "pop",
  "shift",
  "slice",
  "splice",
  "concat",
  "join",
  "map",
  "filter",
  "forEach",
  "reduce",
  "some",
  "every",
  "find",
  "indexOf",
  "includes",
  "sort",
  "keys",
  "get",
  "set",
  "has",
  "add",
  "size",
  "message",
  "stack",
  "error",
  "s",
  "v",
  "e",
  "0",
  "1",
  "2",
]);

const PROPERTY_ROLES = {
  getContext: "canvas",
  toDataURL: "canvas",
  getExtension: "gl",
  getShaderPrecisionFormat: "gl",
  createShader: "gl",
  getSupportedExtensions: "gl",
  appendChild: "element",
  setAttribute: "element",
  classList: "element",
  offsetWidth: "element",
  removeChild: "parentElement",
  postMessage: "port",
  contentWindow: "iframe",
  contentDocument: "iframe",
  userAgent: "navigator",
  plugins: "navigator",
  mimeTypes: "navigator",
  hardwareConcurrency: "navigator",
  matches: "mediaQuery",
  addListener: "mediaQuery",
  charCodeAt: "text",
  codePointAt: "text",
  toFixed: "number",
  byteLength: "buffer",
  getFloatFrequencyData: "analyser",
  createOscillator: "audioContext",
  destination: "audioContext",
  requestAdapter: "gpu",
  requestDevice: "gpuAdapter",
  readyState: "request",
  responseText: "request",
  statusText: "response",
};

const GENERIC_CONSTRUCTORS = new Set([
  "Object",
  "Array",
  "Set",
  "Map",
  "WeakMap",
  "WeakSet",
  "Promise",
  "Error",
  "Number",
  "String",
  "Boolean",
  "RegExp",
  "Function",
  "Date",
]);

const IDENTIFIER_WORD = /^[A-Za-z][A-Za-z0-9]*$/;
const SLUGGABLE = /^[A-Za-z][A-Za-z0-9 ._:/-]{2,29}$/;

function lowerHead(word) {
  const run = /^[A-Z]+/.exec(word)?.[0];
  if (!run) return word;
  if (run.length === word.length) return word.toLowerCase();
  if (run.length === 1) return word[0].toLowerCase() + word.slice(1);
  return run.slice(0, -1).toLowerCase() + word.slice(run.length - 1);
}

export function camelCase(words) {
  const parts = words
    .filter(Boolean)
    .map((word) => word.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);
  const joined = parts
    .map((word, position) =>
      position === 0 ? lowerHead(word) : word[0].toUpperCase() + word.slice(1),
    )
    .join("");
  return /^[A-Za-z]/.test(joined) ? joined.slice(0, 28) : null;
}

const camel = camelCase;

export function slugify(text) {
  if (!SLUGGABLE.test(text)) return null;
  const name = camel(text.split(/[ ._:/-]+/));
  return name && !RESERVED.has(name) ? name : null;
}

function staticProperty(node) {
  if (!node || node.computed) return null;
  if (node.property?.type === "Identifier") return node.property.name;
  return null;
}

function readProperties(binding) {
  const counts = new Map();
  for (const reference of binding.referencePaths) {
    const parent = reference.parentPath;
    if (!parent?.isMemberExpression() && !parent?.isOptionalMemberExpression()) continue;
    if (reference.key !== "object") continue;
    const property = staticProperty(parent.node);
    if (!property || UNINFORMATIVE_PROPERTIES.has(property)) continue;
    counts.set(property, (counts.get(property) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1]).map(([property]) => property);
}

function paramName(binding) {
  for (const property of readProperties(binding)) {
    if (PROPERTY_ROLES[property]) return PROPERTY_ROLES[property];
  }
  return null;
}

function memberName(node) {
  const property = staticProperty(node);
  if (!property || UNINFORMATIVE_PROPERTIES.has(property)) return null;
  return camel([property]);
}

function distinctiveString(node) {
  const found = new Set();
  const stack = [node];
  let steps = 0;
  while (stack.length && steps++ < 4000) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    if (Array.isArray(current)) {
      stack.push(...current);
      continue;
    }
    if (current.type === "StringLiteral" && SLUGGABLE.test(current.value)) found.add(current.value);
    if (found.size > 1) return null;
    for (const key of Object.keys(current)) {
      if (key === "loc" || key === "start" || key === "end" || key === "range") continue;
      const child = current[key];
      if (child && typeof child === "object") stack.push(child);
    }
  }
  return found.size === 1 ? [...found][0] : null;
}

const NAMING_STRING_LENGTH = 8;

function functionName(node) {
  const text = distinctiveString(node.body);
  if (!text || text.length < NAMING_STRING_LENGTH) return null;
  const slug = slugify(text);
  return slug && slug.length >= NAMING_STRING_LENGTH ? slug : null;
}

function valueName(node, depth = 0) {
  if (!node || depth > 3) return null;
  switch (node.type) {
    case "MemberExpression":
    case "OptionalMemberExpression":
      return memberName(node);
    case "NewExpression":
      if (node.callee.type !== "Identifier") return null;
      if (GENERIC_CONSTRUCTORS.has(node.callee.name)) return null;
      return camel([node.callee.name]);
    case "AwaitExpression":
      return valueName(node.argument, depth + 1);
    case "LogicalExpression":
      return valueName(node.left, depth + 1) ?? valueName(node.right, depth + 1);
    case "ConditionalExpression":
      return valueName(node.consequent, depth + 1) ?? valueName(node.alternate, depth + 1);
    case "TSAsExpression":
      return valueName(node.expression, depth + 1);
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      return functionName(node);
    case "ArrayExpression": {
      const values = node.elements;
      if (values.length < 3) return null;
      if (!values.every((element) => element?.type === "StringLiteral")) return null;
      const first = slugify(values[0].value);
      return first ? `${first}List` : null;
    }
    default:
      return null;
  }
}

/**
 * A name for one binding, or null to leave it numbered. Everything here is read off the code the
 * binding is defined by or used through, so a name can be checked against the line it came from;
 * nothing is guessed from the shape of the identifier itself.
 */

/**
 * A name for one binding, or null to leave it numbered. Everything here is read off the code the
 * binding is defined by or used through, so a name can be checked against the line it came from;
 * nothing is guessed from the shape of the identifier itself.
 */
export function suggestName(binding) {
  const name = proposeName(binding);
  if (!name || name.length < 2 || RESERVED.has(name)) return null;
  return /^[A-Za-z][A-Za-z0-9]*$/.test(name) ? name : null;
}

function proposeName(binding) {
  const path = binding.path;
  if (!path?.node) return null;
  if (binding.kind === "param") return paramName(binding);
  if (path.isVariableDeclarator()) {
    if (path.node.id.type === "ObjectPattern") {
      for (const property of path.node.id.properties) {
        if (property.type !== "ObjectProperty" || property.computed) continue;
        if (property.value.type !== "Identifier" || property.value.name !== binding.identifier.name)
          continue;
        const key = property.key.type === "Identifier" ? property.key.name : property.key.value;
        if (typeof key === "string") return key;
      }
      return null;
    }
    const named = valueName(path.node.init);
    if (named) return named;
    return paramName(binding);
  }
  if (path.isFunctionDeclaration()) return functionName(path.node);
  if (path.isClassDeclaration()) {
    const named = functionName({
      body: path.node.body,
    });
    return named ? camel([named]) : null;
  }
  return null;
}
