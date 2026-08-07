import generateModule from "@babel/generator";

const generate = generateModule.default ?? generateModule;

const SIGNATURES = {
  crc32Bytes: /3988292384/,
  hash128: /"00000000"[\s\S]*slice\(\s*-8\s*\)/,
  toBytes: /new TextEncoder\(\)\.encode/,
  asBytes: /instanceof ArrayBuffer/,
  findName: {
    pattern: /getOwnPropertyNames[\s\S]*getPrototypeOf/,
    params: 2,
  },
  readProp: /\.bind\(\s*\w+\s*\)\s*:/,
  xorFromName: /charCodeAt\(\s*\w+\s*%\s*\w+\.length\s*\)/,
  permute: /\.splice\(\s*\w+\[\s*\w+\s*%\s*\w+\.length\s*\]\s*,\s*1\s*\)/,
  decryptSelfKeyed: /"Invalid data"/,
  decryptEnvKeyed: /"SyntaxError"[\s\S]*new Uint32Array|new Uint32Array[\s\S]*"SyntaxError"/,
  makeEnvVault: /"Invalid encryption configuration/,
  makeVault: /new Uint32Array\(\s*\w+\s*\)\s*,\s*\[\s*\]\s*,/,
  deepClone: /instanceof Array[\s\S]*Object\.keys/,
  jsonEncode: /"Recursive input"/,
  jsonDecode: /`byte \$\{/,
  base64Encode: /String\.fromCharCode\.apply[\s\S]*btoa\(/,
  base64Decode: /atob\([\s\S]*charCodeAt\(/,
  sealFrame: /\^\s*\w+\[\s*\w+\s*%\s*\w+\s*\]/,
  compress: /deflate-raw/,
  envelope: /s56:/,
  requestPath: /\+=\s*"\/"[\s\S]*slice\(0,\s*-1\)/,
};

const ROLE_ORDER = Object.keys(SIGNATURES);
const FUNCTION_VALUES = new Set(["FunctionExpression", "ArrowFunctionExpression"]);

function* topLevelFunctions(ast) {
  for (const statement of ast.program.body) {
    const node =
      statement.type === "ExportNamedDeclaration"
        ? (statement.declaration ?? statement)
        : statement;
    if (node.type === "FunctionDeclaration" && node.id) {
      yield [node.id.name, node];
      continue;
    }
    if (node.type !== "VariableDeclaration") continue;
    for (const declarator of node.declarations) {
      if (declarator.id.type !== "Identifier") continue;
      if (!declarator.init || !FUNCTION_VALUES.has(declarator.init.type)) continue;
      yield [declarator.id.name, declarator.init];
    }
  }
}

export function detectPrimitives(ast, overrides = {}) {
  const found = {};
  const claimed = new Set();
  for (const [name, node] of topLevelFunctions(ast)) {
    const code = generate(node, {
      compact: true,
    }).code;
    for (const role of ROLE_ORDER) {
      if (found[role] || claimed.has(name)) continue;
      const signature = SIGNATURES[role];
      const pattern = signature instanceof RegExp ? signature : signature.pattern;
      if (!pattern.test(code)) continue;
      if (signature.params !== undefined && node.params.length !== signature.params) continue;
      found[role] = name;
      claimed.add(name);
    }
  }
  if (found.requestPath) {
    const reference = new RegExp(
      `(^|[^\\w$])${found.requestPath.replace(/\$/g, "\\$")}([^\\w$]|$)`,
    );
    for (const [name, node] of topLevelFunctions(ast)) {
      if (name === found.requestPath || claimed.has(name)) continue;
      if (
        !reference.test(
          generate(node, {
            compact: true,
          }).code,
        )
      )
        continue;
      found.helperUrl = name;
      break;
    }
  }
  Object.assign(found, overrides);
  const missing = ROLE_ORDER.filter((role) => !found[role]);
  return {
    roles: found,
    missing,
  };
}

function collectHashes(node) {
  const hashes = new Set();
  JSON.stringify(node, (key, value) => {
    if (key === "type" || !value) return value;
    if (typeof value === "object" && value.type === "NumericLiteral") {
      if (value.value > 0xffff && value.value <= 0xffffffff) hashes.add(value.value);
    }
    return value;
  });
  return [...hashes];
}

function topLevelValues(ast) {
  const values = new Map();
  for (const statement of ast.program.body) {
    const node =
      statement.type === "ExportNamedDeclaration"
        ? (statement.declaration ?? statement)
        : statement;
    if (node.type !== "VariableDeclaration") continue;
    for (const declarator of node.declarations) {
      if (declarator.id.type !== "Identifier" || !declarator.init) continue;
      const init = declarator.init;
      if (init.type === "NumericLiteral") values.set(declarator.id.name, init.value);
      else if (
        init.type === "ArrayExpression" &&
        init.elements.every((e) => e?.type === "NumericLiteral")
      ) {
        values.set(
          declarator.id.name,
          init.elements.map((element) => element.value),
        );
      }
    }
  }
  return values;
}

/**
 * Every distinct way the frame sealer is called: `seal(payload, marker, padMax, keyLength)`.
 *
 * The four are bindings, not literals, and the marker selects what the frame is (a telemetry POST
 * body, a stored request-log entry). Reading them off the call sites is what lets the frame be taken
 * apart again — the agent only ever builds one, so the reverse has to be driven by these numbers
 * rather than by anything in the bundle.
 */

/**
 * Every distinct way the frame sealer is called: `seal(payload, marker, padMax, keyLength)`.
 *
 * The four are bindings, not literals, and the marker selects what the frame is (a telemetry POST
 * body, a stored request-log entry). Reading them off the call sites is what lets the frame be taken
 * apart again — the agent only ever builds one, so the reverse has to be driven by these numbers
 * rather than by anything in the bundle.
 */
export function findFrameProfiles(ast, roles) {
  if (!roles.sealFrame) return [];
  const values = topLevelValues(ast);
  const markers = (node) => {
    if (node?.type === "Identifier") return [node.name];
    if (node?.type === "ConditionalExpression") {
      return [node.consequent, node.alternate]
        .filter((branch) => branch.type === "Identifier")
        .map((branch) => branch.name);
    }
    return [];
  };
  const profiles = [];
  const seen = new Set();
  JSON.stringify(ast, (key, value) => {
    if (!value || typeof value !== "object") return value;
    if (value.type !== "CallExpression") return value;
    if (value.callee?.type !== "Identifier" || value.callee.name !== roles.sealFrame) return value;
    if (value.arguments.length < 4) return value;
    const numeric = (node) =>
      node?.type === "NumericLiteral" ? node.value : (values.get(node?.name) ?? null);
    const bytes = (node) =>
      node?.type === "ArrayExpression" && node.elements.every((e) => e?.type === "NumericLiteral")
        ? node.elements.map((element) => element.value)
        : null;
    const [, marker, padMax, keyLength] = value.arguments;
    const inlineBytes = bytes(marker);
    const names = inlineBytes ? [inlineBytes.join(",")] : markers(marker);
    for (const name of names) {
      const signature = `${name}:${numeric(padMax)}:${numeric(keyLength)}`;
      if (seen.has(signature)) continue;
      seen.add(signature);
      profiles.push({
        marker: name,
        markerBytes: inlineBytes ?? values.get(name) ?? null,
        padMax: numeric(padMax),
        keyLength: numeric(keyLength),
      });
    }
    return value;
  });
  return profiles;
}

export function findVaultTables(ast, roles) {
  const tables = [];
  for (const node of ast.program.body) {
    if (node.type !== "VariableDeclaration") continue;
    for (const decl of node.declarations) {
      const init = decl.init;
      if (init?.type !== "CallExpression" || init.callee.type !== "Identifier") continue;
      if (decl.id.type !== "Identifier") continue;
      if (init.callee.name === roles.makeVault) {
        tables.push({
          name: decl.id.name,
          kind: "self-keyed",
          keyHashes: [],
        });
      } else if (init.callee.name === roles.makeEnvVault) {
        tables.push({
          name: decl.id.name,
          kind: "env-keyed",
          keyHashes: collectHashes(init.arguments[1]),
        });
      }
    }
  }
  return tables;
}
