import traverseModule from "@babel/traverse";
import * as t from "@babel/types";
import { suggestName } from "./naming.mjs";

const traverse = traverseModule.default ?? traverseModule;

const SKIPPED_KEYS = new Set([
  "loc",
  "start",
  "end",
  "range",
  "leadingComments",
  "trailingComments",
]);

function walk(node, visit, parent = null, key = null) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) walk(node[i], visit, parent, key);
    return;
  }
  if (!node.type) return;
  visit(node, parent, key);
  for (const child of Object.keys(node)) {
    if (SKIPPED_KEYS.has(child)) continue;
    walk(node[child], visit, node, child);
  }
}

function isNamePosition(node, parent, key) {
  if (!parent) return false;
  if (parent.type === "MemberExpression" && key === "property" && !parent.computed) return true;
  if (parent.type === "OptionalMemberExpression" && key === "property" && !parent.computed)
    return true;
  if (
    (parent.type === "ObjectProperty" || parent.type === "ObjectMethod") &&
    key === "key" &&
    !parent.computed
  ) {
    return true;
  }
  if (parent.type === "ClassMethod" && key === "key" && !parent.computed) return true;
  return false;
}

function countReferences(node, name) {
  let count = 0;
  walk(node, (child, parent, key) => {
    if (child.type === "Identifier" && child.name === name && !isNamePosition(child, parent, key))
      count++;
  });
  return count;
}

function containsFunction(node) {
  let found = false;
  walk(node, (child) => {
    if (
      child.type === "FunctionExpression" ||
      child.type === "ArrowFunctionExpression" ||
      child.type === "FunctionDeclaration" ||
      child.type === "ThisExpression"
    ) {
      found = true;
    }
  });
  return found;
}

function substituteParams(expression, substitutions) {
  const clone = t.cloneNode(expression, true);
  const replaceIn = (node) => {
    if (!node || typeof node !== "object") return node;
    if (Array.isArray(node)) return node.map(replaceIn);
    if (!node.type) return node;
    for (const key of Object.keys(node)) {
      if (SKIPPED_KEYS.has(key)) continue;
      const child = node[key];
      if (Array.isArray(child)) {
        node[key] = child.map((item) => {
          if (item?.type === "Identifier" && substitutions.has(item.name)) {
            return t.cloneNode(substitutions.get(item.name), true);
          }
          return replaceIn(item);
        });
      } else if (child?.type === "Identifier" && substitutions.has(child.name)) {
        if (!isNamePosition(child, node, key)) {
          node[key] = t.cloneNode(substitutions.get(child.name), true);
        }
      } else {
        node[key] = replaceIn(child);
      }
    }
    return node;
  };
  return replaceIn(clone);
}

function isPureValue(node) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "ThisExpression":
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
    case "NullLiteral":
    case "BigIntLiteral":
    case "RegExpLiteral":
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      return true;
    case "MemberExpression":
      return !node.computed && isPureValue(node.object);
    case "UnaryExpression":
      return node.operator !== "delete" && isPureValue(node.argument);
    case "ArrayExpression":
      return node.elements.every((element) => !element || isPureValue(element));
    case "ObjectExpression":
      return node.properties.every(
        (property) =>
          property.type === "ObjectProperty" && !property.computed && isPureValue(property.value),
      );
    default:
      return false;
  }
}

function asOperatorWrapper(fn) {
  if (!fn) return null;
  if (fn.type !== "FunctionExpression" && fn.type !== "ArrowFunctionExpression") return null;
  if (fn.async || fn.generator) return null;
  if (!fn.params.every((p) => p.type === "Identifier")) return null;
  let expression = null;
  if (fn.body.type !== "BlockStatement") {
    expression = fn.body;
  } else if (fn.body.body.length === 1 && fn.body.body[0].type === "ReturnStatement") {
    expression = fn.body.body[0].argument;
  }
  if (!expression) return null;
  if (containsFunction(expression)) return null;
  const paramNames = fn.params.map((p) => p.name);
  const paramSet = new Set(paramNames);
  let usesOuterBinding = false;
  walk(expression, (node, parent, key) => {
    if (node.type !== "Identifier") return;
    if (isNamePosition(node, parent, key)) return;
    if (!paramSet.has(node.name)) usesOuterBinding = true;
  });
  if (usesOuterBinding) return null;
  return {
    paramNames,
    expression,
  };
}

function tryInline(wrapper, args) {
  const { paramNames, expression } = wrapper;
  if (args.length !== paramNames.length) return null;
  if (args.some((arg) => arg.type === "SpreadElement")) return null;
  let impureCount = 0;
  const substitutions = new Map();
  for (let i = 0; i < paramNames.length; i++) {
    const arg = args[i];
    const uses = countReferences(expression, paramNames[i]);
    const pure = isPureValue(arg);
    if (!pure) impureCount++;
    if (uses !== 1 && !pure) return null;
    substitutions.set(paramNames[i], arg);
  }
  if (impureCount > 1) return null;
  return substituteParams(expression, substitutions);
}

const isLive = (path) =>
  Boolean(path?.node) &&
  !path.removed &&
  Boolean(path.container) &&
  Boolean(path.parentPath?.node) &&
  Boolean(path.parentPath.container ?? path.parentPath.isProgram());

export function inlineOperatorWrappers(ast) {
  let total = 0;
  for (let round = 0; round < 64; round++) {
    let changed = 0;
    traverse(ast, {
      CallExpression(path) {
        const wrapper = asOperatorWrapper(path.node.callee);
        if (!wrapper) return;
        const inlined = tryInline(wrapper, path.node.arguments);
        if (!inlined) return;
        path.replaceWith(inlined);
        changed++;
      },
    });
    const aliases = [];
    traverse(ast, {
      VariableDeclarator(path) {
        if (!isLive(path) || path.node.id.type !== "Identifier") return;
        const wrapper = asOperatorWrapper(path.node.init);
        if (!wrapper) return;
        const binding = path.scope.getBinding(path.node.id.name);
        if (!binding || binding.constantViolations.length > 0) return;
        if (binding.referencePaths.length === 0) return;
        aliases.push({
          path,
          wrapper,
          references: binding.referencePaths,
        });
      },
    });
    const spent = [];
    for (const { path, wrapper, references } of aliases) {
      let fullyInlined = true;
      for (const reference of references) {
        const call = reference.parentPath;
        if (!isLive(call) || !call.isCallExpression() || call.node.callee !== reference.node) {
          fullyInlined = false;
          continue;
        }
        const inlined = tryInline(wrapper, call.node.arguments);
        if (!inlined) {
          fullyInlined = false;
          continue;
        }
        try {
          call.replaceWith(inlined);
          changed++;
        } catch {
          fullyInlined = false;
        }
      }
      if (fullyInlined) spent.push(path);
    }
    for (const path of spent) {
      if (!isLive(path)) continue;
      const name = path.node.id.name;
      const owner = path.scope.block;
      const remaining = countReferences(owner, name) - 1;
      if (remaining <= 0) path.remove();
    }
    total += changed;
    if (changed === 0) break;
  }
  return total;
}

/**
 * The dispatch-table form of the same wrapper: an object literal whose every value is an operator
 * wrapper, called as `table.kEy(fn, a, b)`. Folding it exposes the calls the table was hiding —
 * including the hashed property reads, which cannot be resolved while they ride as arguments.
 */

/**
 * The dispatch-table form of the same wrapper: an object literal whose every value is an operator
 * wrapper, called as `table.kEy(fn, a, b)`. Folding it exposes the calls the table was hiding —
 * including the hashed property reads, which cannot be resolved while they ride as arguments.
 */
export function inlineWrapperObjects(ast) {
  let total = 0;
  for (let round = 0; round < 8; round++) {
    const candidates = [];
    traverse(ast, {
      VariableDeclarator(path) {
        if (!isLive(path) || path.node.id.type !== "Identifier") return;
        const init = path.node.init;
        if (init?.type !== "ObjectExpression" || init.properties.length === 0) return;
        const wrappers = new Map();
        for (const property of init.properties) {
          if (property.type !== "ObjectProperty" && property.type !== "ObjectMethod") return;
          if (property.computed) return;
          const key =
            property.key.type === "Identifier"
              ? property.key.name
              : property.key.type === "StringLiteral"
                ? property.key.value
                : null;
          if (!key) return;
          const fn =
            property.type === "ObjectMethod"
              ? {
                  ...property,
                  type: "FunctionExpression",
                }
              : property.value;
          const wrapper = asOperatorWrapper(fn);
          if (!wrapper) return;
          wrappers.set(key, wrapper);
        }
        const binding = path.scope.getBinding(path.node.id.name);
        if (!binding || binding.constantViolations.length > 0) return;
        if (binding.referencePaths.length === 0) return;
        candidates.push({
          path,
          wrappers,
          references: binding.referencePaths,
        });
      },
    });
    let changed = 0;
    const spent = [];
    for (const { path, wrappers, references } of candidates) {
      let fullyInlined = true;
      for (const reference of references) {
        const member = reference.parentPath;
        const call = member?.parentPath;
        if (
          !isLive(member) ||
          !member.isMemberExpression() ||
          member.node.object !== reference.node ||
          member.node.computed ||
          member.node.property.type !== "Identifier" ||
          !isLive(call) ||
          !call.isCallExpression() ||
          call.node.callee !== member.node
        ) {
          fullyInlined = false;
          continue;
        }
        const wrapper = wrappers.get(member.node.property.name);
        const inlined = wrapper && tryInline(wrapper, call.node.arguments);
        if (!inlined) {
          fullyInlined = false;
          continue;
        }
        try {
          call.replaceWith(inlined);
          changed++;
        } catch {
          fullyInlined = false;
        }
      }
      if (fullyInlined) spent.push(path);
    }
    for (const path of spent) {
      if (!isLive(path)) continue;
      const remaining = countReferences(path.scope.block, path.node.id.name) - 1;
      if (remaining <= 0) path.remove();
    }
    total += changed;
    if (changed === 0) break;
  }
  return total;
}

export function simplifyLiterals(ast) {
  let count = 0;
  traverse(ast, {
    UnaryExpression(path) {
      const { operator, argument } = path.node;
      if (
        operator === "!" &&
        argument.type === "NumericLiteral" &&
        (argument.value === 0 || argument.value === 1)
      ) {
        path.replaceWith(t.booleanLiteral(argument.value === 0));
        count++;
        return;
      }
      if (operator === "void" && argument.type === "NumericLiteral" && argument.value === 0) {
        path.replaceWith(t.identifier("undefined"));
        count++;
      }
    },
    BinaryExpression(path) {
      const { operator, left, right } = path.node;
      if (
        operator === "/" &&
        left.type === "NumericLiteral" &&
        left.value === 1 &&
        right.type === "NumericLiteral" &&
        right.value === 0
      ) {
        path.replaceWith(t.identifier("Infinity"));
        count++;
        return;
      }
      const comparisons = ["==", "===", "!=", "!==", ">", ">=", "<", "<="];
      const flipped = {
        ">": "<",
        ">=": "<=",
        "<": ">",
        "<=": ">=",
      };
      if (comparisons.includes(operator) && isLiteralLike(left) && !isLiteralLike(right)) {
        path.replaceWith(t.binaryExpression(flipped[operator] ?? operator, right, left));
        count++;
      }
    },
  });
  return count;
}

const LITERAL_IDENTIFIERS = new Set(["undefined", "NaN", "Infinity"]);

function isLiteralLike(node) {
  if (node.type.endsWith("Literal")) return true;
  if (node.type === "Identifier") return LITERAL_IDENTIFIERS.has(node.name);
  if (node.type === "UnaryExpression" && (node.operator === "-" || node.operator === "+")) {
    return node.argument.type === "NumericLiteral";
  }
  return false;
}

function nullishTarget(node, expectNullish) {
  if (node.type !== "BinaryExpression") return null;
  const { operator, left, right } = node;
  const loose = operator === (expectNullish ? "==" : "!=");
  const strict = operator === (expectNullish ? "===" : "!==");
  if (!loose && !strict) return null;
  const sides = [
    [left, right],
    [right, left],
  ];
  for (const [probe, other] of sides) {
    const isNull = probe.type === "NullLiteral";
    const isUndefined = probe.type === "Identifier" && probe.name === "undefined";
    if (!isNull && !isUndefined) continue;
    return {
      target: other,
      loose,
      matches: loose ? "both" : isNull ? "null" : "undefined",
    };
  }
  return null;
}

function sameTarget(a, b) {
  if (a.type === "Identifier" && b.type === "Identifier") return a.name === b.name;
  return false;
}

function assignedValue(node) {
  if (
    node.type === "AssignmentExpression" &&
    node.operator === "=" &&
    node.left.type === "Identifier"
  ) {
    return {
      name: node.left.name,
      value: node.right,
    };
  }
  return null;
}

function markOptional(node, rootName, rootReplacement = null) {
  const asRoot = (identifier) =>
    rootReplacement ? t.cloneNode(rootReplacement, true) : identifier;
  if (node.type === "MemberExpression") {
    if (node.object.type === "Identifier" && node.object.name === rootName) {
      return t.optionalMemberExpression(asRoot(node.object), node.property, node.computed, true);
    }
    const object = markOptional(node.object, rootName, rootReplacement);
    if (!object) return null;
    return t.optionalMemberExpression(object, node.property, node.computed, false);
  }
  if (node.type === "CallExpression") {
    const callee = markOptional(node.callee, rootName, rootReplacement);
    if (!callee) return null;
    return t.optionalCallExpression(callee, node.arguments, false);
  }
  if (node.type === "OptionalMemberExpression" || node.type === "OptionalCallExpression") {
    const object = markOptional(node.object ?? node.callee, rootName, rootReplacement);
    if (!object) return null;
    return node.type === "OptionalMemberExpression"
      ? t.optionalMemberExpression(object, node.property, node.computed, node.optional)
      : t.optionalCallExpression(object, node.arguments, node.optional);
  }
  return null;
}

function nullishHalf(node) {
  if (node.type !== "BinaryExpression") return null;
  if (node.operator !== "===" && node.operator !== "==") return null;
  for (const [probe, other] of [
    [node.left, node.right],
    [node.right, node.left],
  ]) {
    const isNull = probe.type === "NullLiteral";
    const isUndefined = probe.type === "Identifier" && probe.name === "undefined";
    if (!isNull && !isUndefined) continue;
    const assignment = assignedValue(other);
    if (assignment) {
      return {
        kind: isNull ? "null" : "undefined",
        name: assignment.name,
        value: assignment.value,
        node: other,
      };
    }
    if (other.type === "Identifier") {
      return {
        kind: isNull ? "null" : "undefined",
        name: other.name,
        value: other,
        node: other,
      };
    }
    return null;
  }
  return null;
}

function doubleNullGuard(test) {
  if (test.type !== "LogicalExpression" || test.operator !== "||") return null;
  const left = nullishHalf(test.left);
  const right = nullishHalf(test.right);
  if (!left || !right || left.name !== right.name) return null;
  if (left.kind === right.kind) return null;
  const assigned = assignedValue(left.node) ? left : assignedValue(right.node) ? right : null;
  return {
    name: left.name,
    value: assigned ? assigned.value : left.value,
    lhs: assigned ? assigned.node : t.identifier(left.name),
    assignment: Boolean(assigned),
  };
}

/** Rebuilds `?.` and `??` out of the ternaries the TypeScript downlevel emitted. */

/** Rebuilds `?.` and `??` out of the ternaries the TypeScript downlevel emitted. */
export function restoreNullishOperators(ast) {
  let count = 0;
  traverse(ast, {
    ConditionalExpression(path) {
      const { test, consequent, alternate } = path.node;
      const guard = doubleNullGuard(test);
      if (guard && consequent.type === "Identifier" && consequent.name === "undefined") {
        const optional = markOptional(alternate, guard.name, guard.assignment ? guard.value : null);
        if (optional) {
          path.replaceWith(optional);
          count++;
          return;
        }
      }
      if (test.type === "LogicalExpression" && test.operator === "&&") {
        const left = nullishTarget(test.left, false);
        const right = nullishTarget(test.right, false);
        if (left && right) {
          const assignment = assignedValue(left.target);
          const leftName = assignment ? assignment.name : left.target.name;
          if (
            leftName &&
            right.target.type === "Identifier" &&
            right.target.name === leftName &&
            consequent.type === "Identifier" &&
            consequent.name === leftName
          ) {
            const value = assignment ? assignment.value : left.target;
            path.replaceWith(t.logicalExpression("??", value, alternate));
            count++;
            return;
          }
        }
      }
      const positive = nullishTarget(test, true);
      if (positive && positive.target.type === "Identifier") {
        const consequentIsUndefined =
          consequent.type === "Identifier" && consequent.name === "undefined";
        if (consequentIsUndefined) {
          const optional = markOptional(alternate, positive.target.name);
          if (optional) {
            path.replaceWith(optional);
            count++;
            return;
          }
        }
        if (alternate.type === "Identifier" && alternate.name === positive.target.name) {
          path.replaceWith(t.logicalExpression("??", alternate, consequent));
          count++;
          return;
        }
      }
      const negative = nullishTarget(test, false);
      if (negative && negative.target.type === "Identifier") {
        const alternateIsUndefined =
          alternate.type === "Identifier" && alternate.name === "undefined";
        if (alternateIsUndefined) {
          const optional = markOptional(consequent, negative.target.name);
          if (optional) {
            path.replaceWith(optional);
            count++;
          }
        }
      }
    },
    LogicalExpression(path) {
      const { operator, left, right } = path.node;
      if (operator === "||") {
        const guard = doubleNullGuard(path.node);
        if (guard) {
          path.replaceWith(t.binaryExpression("==", t.cloneNode(guard.lhs, true), t.nullLiteral()));
          count++;
        }
        return;
      }
      if (operator !== "&&") return;
      const a = nullishTarget(left, false);
      const b = nullishTarget(right, false);
      if (!a || !b) return;
      if (!sameTarget(a.target, b.target)) return;
      path.replaceWith(t.binaryExpression("!=", t.cloneNode(a.target, true), t.nullLiteral()));
      count++;
    },
  });
  return count;
}

/** Gives every branch and loop a real block so later passes can splice statements into them. */

/** Gives every branch and loop a real block so later passes can splice statements into them. */
export function ensureBlocks(ast) {
  let count = 0;
  traverse(ast, {
    IfStatement(path) {
      for (const key of ["consequent", "alternate"]) {
        const branch = path.node[key];
        if (!branch || branch.type === "BlockStatement" || branch.type === "IfStatement") continue;
        path.node[key] = t.blockStatement([branch]);
        count++;
      }
    },
    Loop(path) {
      if (path.node.body?.type === "BlockStatement") return;
      path.ensureBlock();
      count++;
    },
  });
  return count;
}

/** `(a(), b(), c)` is minifier output for three statements; put them back. */

/** `(a(), b(), c)` is minifier output for three statements; put them back. */
export function flattenSequences(ast) {
  let count = 0;
  traverse(ast, {
    ExpressionStatement(path) {
      if (path.node.expression.type !== "SequenceExpression") return;
      if (!path.parentPath.isBlockStatement() && !path.parentPath.isProgram()) return;
      path.replaceWithMultiple(
        path.node.expression.expressions.map((expression) => t.expressionStatement(expression)),
      );
      count++;
    },
    ReturnStatement(path) {
      if (path.node.argument?.type !== "SequenceExpression") return;
      if (!path.parentPath.isBlockStatement()) return;
      const expressions = [...path.node.argument.expressions];
      const last = expressions.pop();
      path.replaceWithMultiple([
        ...expressions.map((expression) => t.expressionStatement(expression)),
        t.returnStatement(last),
      ]);
      count++;
    },
    ArrowFunctionExpression(path) {
      if (path.node.body.type !== "SequenceExpression") return;
      const expressions = [...path.node.body.expressions];
      const last = expressions.pop();
      path.node.body = t.blockStatement([
        ...expressions.map((expression) => t.expressionStatement(expression)),
        t.returnStatement(last),
      ]);
      count++;
    },
  });
  return count;
}

/** `a && b();` and `a ? b() : c();` in statement position are minified `if`/`else`. */

/** `a && b();` and `a ? b() : c();` in statement position are minified `if`/`else`. */
export function statementizeControlFlow(ast) {
  let count = 0;
  traverse(ast, {
    ExpressionStatement(path) {
      const parent = path.parentPath;
      if (!parent.isBlockStatement() && !parent.isProgram() && !parent.isSwitchCase()) return;
      const expression = path.node.expression;
      if (expression.type === "LogicalExpression") {
        if (expression.operator === "&&") {
          path.replaceWith(
            t.ifStatement(
              expression.left,
              t.blockStatement([t.expressionStatement(expression.right)]),
            ),
          );
          count++;
          return;
        }
        if (expression.operator === "||") {
          path.replaceWith(
            t.ifStatement(
              t.unaryExpression("!", expression.left),
              t.blockStatement([t.expressionStatement(expression.right)]),
            ),
          );
          count++;
          return;
        }
      }
      if (expression.type === "ConditionalExpression") {
        path.replaceWith(
          t.ifStatement(
            expression.test,
            t.blockStatement([t.expressionStatement(expression.consequent)]),
            t.blockStatement([t.expressionStatement(expression.alternate)]),
          ),
        );
        count++;
      }
    },
  });
  return count;
}

/**
 * `return a ? x : b ? y : z` is a decision tree written as an expression. It becomes the `if` chain
 * it stands for once it is either more than one level deep or returning object literals, both of
 * which the formatter breaks across lines anyway. Nested consequents are picked up by the next
 * sweep, once they are returns in a block themselves.
 */

/**
 * `return a ? x : b ? y : z` is a decision tree written as an expression. It becomes the `if` chain
 * it stands for once it is either more than one level deep or returning object literals, both of
 * which the formatter breaks across lines anyway. Nested consequents are picked up by the next
 * sweep, once they are returns in a block themselves.
 */
export function statementizeReturns(ast) {
  let count = 0;
  const chainLength = (node) => {
    let length = 0;
    let current = node;
    while (current?.type === "ConditionalExpression") {
      length++;
      current = current.alternate;
    }
    return length;
  };
  const worthSplitting = (node) => {
    const length = chainLength(node);
    if (length === 0) return false;
    if (length >= 2) return true;
    return (
      node.consequent.type === "ObjectExpression" || node.alternate.type === "ObjectExpression"
    );
  };
  traverse(ast, {
    ReturnStatement(path) {
      const argument = path.node.argument;
      if (argument?.type !== "ConditionalExpression") return;
      if (!path.parentPath.isBlockStatement()) return;
      if (!worthSplitting(argument)) return;
      const statements = [];
      let current = argument;
      while (current.type === "ConditionalExpression") {
        statements.push(
          t.ifStatement(current.test, t.blockStatement([t.returnStatement(current.consequent)])),
        );
        current = current.alternate;
      }
      statements.push(t.returnStatement(current));
      path.replaceWithMultiple(statements);
      count++;
    },
    ArrowFunctionExpression(path) {
      if (!worthSplitting(path.node.body)) return;
      path.node.body = t.blockStatement([t.returnStatement(path.node.body)]);
      count++;
    },
  });
  return count;
}

/**
 * `var t = atob` hides a browser global behind a one-letter name. Only aliases of a free identifier
 * are inlined: an alias of a member path (`var t = Object.keys`) would change the `this` a later
 * `t(x)` call sees, so those are left for the renamer to label instead.
 */

/**
 * `var t = atob` hides a browser global behind a one-letter name. Only aliases of a free identifier
 * are inlined: an alias of a member path (`var t = Object.keys`) would change the `this` a later
 * `t(x)` call sees, so those are left for the renamer to label instead.
 */
export function inlineGlobalAliases(ast) {
  let count = 0;
  traverse(ast, {
    Scopable(path) {
      for (const binding of Object.values(path.scope.bindings)) {
        if (binding.constantViolations.length > 0) continue;
        if (!binding.path.isVariableDeclarator() || !isLive(binding.path)) continue;
        if (binding.path.node.id.type !== "Identifier") continue;
        const init = binding.path.node.init;
        if (init?.type !== "Identifier") continue;
        if (path.scope.hasBinding(init.name)) continue;
        const declaration = binding.path.parentPath;
        if (!declaration.isVariableDeclaration()) continue;
        if (!declaration.parentPath.isBlockStatement() && !declaration.parentPath.isProgram())
          continue;
        if (binding.referencePaths.some((reference) => reference.scope.hasBinding(init.name)))
          continue;
        try {
          for (const reference of binding.referencePaths)
            reference.replaceWith(t.identifier(init.name));
          binding.path.remove();
          count++;
        } catch {}
      }
    },
  });
  return count;
}

const BASE64_CHARS = /^[A-Za-z0-9+/]+={0,2}$/;
const PRINTABLE = /^[\x20-\x7e]+$/;

function decodedBase64(value) {
  if (value.length < 8 || value.length % 4 !== 0 || !BASE64_CHARS.test(value)) return null;
  const decoded = Buffer.from(value, "base64").toString("latin1");
  if (Buffer.from(decoded, "latin1").toString("base64") !== value) return null;
  if (!PRINTABLE.test(decoded)) return null;
  return decoded;
}

/**
 * The adblock filter lists ship half their CSS selectors as `atob("...")`. Folding the constant ones
 * puts the actual selector in the source, which is what the probe list is for. Only round-trippable,
 * printable payloads are folded, so a call whose argument is not really base64 is left alone.
 */

/**
 * The adblock filter lists ship half their CSS selectors as `atob("...")`. Folding the constant ones
 * puts the actual selector in the source, which is what the probe list is for. Only round-trippable,
 * printable payloads are folded, so a call whose argument is not really base64 is left alone.
 */
export function decodeBase64Literals(ast) {
  let count = 0;
  traverse(ast, {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (callee.type !== "Identifier" || callee.name !== "atob") return;
      if (path.scope.hasBinding("atob")) return;
      if (args.length !== 1 || args[0].type !== "StringLiteral") return;
      const decoded = decodedBase64(args[0].value);
      if (decoded === null) return;
      path.replaceWith(t.stringLiteral(decoded));
      count++;
    },
  });
  return count;
}

const INLINE_STRING_BUDGET = 400;

/** Pushes literal-valued bindings to their use sites so arithmetic and keys read directly. */

/** Pushes literal-valued bindings to their use sites so arithmetic and keys read directly. */
export function inlineConstantBindings(ast) {
  let count = 0;
  traverse(ast, {
    Scopable(path) {
      for (const binding of Object.values(path.scope.bindings)) {
        if (binding.constantViolations.length > 0) continue;
        if (!binding.path.isVariableDeclarator() || !isLive(binding.path)) continue;
        if (binding.path.parentPath.parentPath?.isExportNamedDeclaration()) continue;
        const init = binding.path.node.init;
        if (!init) continue;
        const literal =
          init.type === "NumericLiteral" ||
          init.type === "BooleanLiteral" ||
          init.type === "NullLiteral" ||
          init.type === "StringLiteral";
        if (!literal) continue;
        const references = binding.referencePaths;
        if (references.length === 0) continue;
        if (
          init.type === "StringLiteral" &&
          init.value.length * references.length > INLINE_STRING_BUDGET
        ) {
          continue;
        }
        if (references.some((reference) => reference.parentPath?.node?.shorthand)) continue;
        let replaced = 0;
        for (const reference of references) {
          if (!isLive(reference)) continue;
          try {
            reference.replaceWith(t.cloneNode(init, true));
            replaced++;
          } catch {}
        }
        if (replaced === references.length && isLive(binding.path)) {
          const name = binding.path.node.id.name;
          const remaining = countReferences(binding.path.scope.block, name) - 1;
          if (remaining <= 0) binding.path.remove();
        }
        count += replaced;
      }
    },
  });
  return count;
}

const FOLDABLE = new Set(["+", "-", "*", "/", "%", "|", "&", "^", "<<", ">>", ">>>"]);

export function foldConstants(ast) {
  let count = 0;
  traverse(ast, {
    BinaryExpression: {
      exit(path) {
        const { operator, left, right } = path.node;
        if (!FOLDABLE.has(operator)) return;
        if (
          operator === "+" &&
          left.type === "StringLiteral" &&
          right.type === "StringLiteral" &&
          left.value.length + right.value.length <= INLINE_STRING_BUDGET
        ) {
          path.replaceWith(t.stringLiteral(left.value + right.value));
          count++;
          return;
        }
        if (left.type !== "NumericLiteral" || right.type !== "NumericLiteral") return;
        let value;
        switch (operator) {
          case "+":
            value = left.value + right.value;
            break;
          case "-":
            value = left.value - right.value;
            break;
          case "*":
            value = left.value * right.value;
            break;
          case "/":
            value = left.value / right.value;
            break;
          case "%":
            value = left.value % right.value;
            break;
          case "|":
            value = left.value | right.value;
            break;
          case "&":
            value = left.value & right.value;
            break;
          case "^":
            value = left.value ^ right.value;
            break;
          case "<<":
            value = left.value << right.value;
            break;
          case ">>":
            value = left.value >> right.value;
            break;
          case ">>>":
            value = left.value >>> right.value;
            break;
          default:
            return;
        }
        if (!Number.isFinite(value)) return;
        path.replaceWith(
          value < 0 ? t.unaryExpression("-", t.numericLiteral(-value)) : t.numericLiteral(value),
        );
        count++;
      },
    },
  });
  return count;
}

export function resolveHashArguments(ast, roles, resolve) {
  const hashedCallees = new Map([
    [roles.readProp, 1],
    [roles.findName, 1],
    [roles.xorFromName, 1],
  ]);
  let resolved = 0;
  const unresolved = new Set();
  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (callee.type !== "Identifier") return;
      const index = hashedCallees.get(callee.name);
      if (index === undefined) return;
      const arg = path.node.arguments[index];
      if (arg?.type !== "NumericLiteral") return;
      const name = resolve(arg.value);
      if (!name) {
        unresolved.add(arg.value);
        return;
      }
      path.node.arguments[index] = t.stringLiteral(name);
      resolved++;
    },
  });
  return {
    resolved,
    unresolved: [...unresolved],
  };
}

const VALUE_BINARY = new Set(["==", "===", "!=", "!==", ">", ">=", "<", "<=", "-", "*", "/", "%"]);

const VALUE_UNARY = new Set(["typeof", "!", "void", "-", "+", "~"]);
const VALUE_CALLS = new Set(["Number", "Boolean", "isNaN", "isFinite"]);

const VALUE_CONSTRUCTORS = new Set([
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Float32Array",
  "Float64Array",
  "DataView",
]);

function isValueConsumed(path) {
  const parent = path.parentPath;
  if (!parent?.node) return false;
  const node = parent.node;
  switch (node.type) {
    case "UnaryExpression":
      return VALUE_UNARY.has(node.operator);
    case "IfStatement":
    case "WhileStatement":
    case "DoWhileStatement":
    case "ConditionalExpression":
      return path.key === "test";
    case "BinaryExpression": {
      if (node.operator === "in") return path.key === "right";
      if (!VALUE_BINARY.has(node.operator)) return false;
      const other = path.key === "left" ? node.right : path.key === "right" ? node.left : null;
      return Boolean(other) && isLiteralLike(other);
    }
    case "MemberExpression":
    case "OptionalMemberExpression":
      return path.key === "object";
    case "SwitchStatement":
      return (
        path.key === "discriminant" && node.cases.every((c) => !c.test || isLiteralLike(c.test))
      );
    case "CallExpression":
      return (
        path.listKey === "arguments" &&
        node.callee.type === "Identifier" &&
        VALUE_CALLS.has(node.callee.name)
      );
    case "NewExpression":
      return (
        path.listKey === "arguments" &&
        node.callee.type === "Identifier" &&
        VALUE_CONSTRUCTORS.has(node.callee.name)
      );
    case "ObjectProperty":
      return path.key === "value";
    case "ArrayExpression":
      return path.listKey === "elements";
    case "VariableDeclarator":
      return path.key === "init" && declaredBindingNeverCalled(parent);
    default:
      return false;
  }
}

function declaredBindingNeverCalled(declaratorPath) {
  if (declaratorPath.node.id.type !== "Identifier") return false;
  const binding = declaratorPath.scope.getBinding(declaratorPath.node.id.name);
  if (!binding) return false;
  return binding.referencePaths.every((ref) => {
    const callPath = ref.parentPath;
    return !(callPath?.isCallExpression() && callPath.node.callee === ref.node);
  });
}

const TRANSPARENT_KEYS = new Set(["consequent", "alternate", "left", "right"]);

function climbTransparent(path) {
  let current = path;
  for (let depth = 0; depth < 6; depth++) {
    const parent = current.parentPath;
    if (!parent?.node) return current;
    const inConditionalBranch =
      parent.isConditionalExpression() && TRANSPARENT_KEYS.has(current.key);
    const inLogicalOperand = parent.isLogicalExpression() && TRANSPARENT_KEYS.has(current.key);
    if (!inConditionalBranch && !inLogicalOperand) return current;
    current = parent;
  }
  return current;
}

/**
 * Turns a resolved vault read back into a plain property access.
 *
 * `readVaultedProp` returns `obj[name]` pre-bound to `obj` when the property is a function, so
 * collapsing it to `obj.name` is only unconditionally safe where the receiver is the same either
 * way — the result is called immediately — or where a bound function is indistinguishable from the
 * function itself (`isValueConsumed`). Anywhere else the bound reference can outlive the
 * expression, so those sites are left alone unless `all` is set for a read-only pass.
 */

/**
 * Turns a resolved vault read back into a plain property access.
 *
 * `readVaultedProp` returns `obj[name]` pre-bound to `obj` when the property is a function, so
 * collapsing it to `obj.name` is only unconditionally safe where the receiver is the same either
 * way — the result is called immediately — or where a bound function is indistinguishable from the
 * function itself (`isValueConsumed`). Anywhere else the bound reference can outlive the
 * expression, so those sites are left alone unless `all` is set for a read-only pass.
 */
export function restoreMemberAccess(ast, roles, { all = false, valueContexts = true } = {}) {
  let count = 0;
  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (callee.type !== "Identifier" || callee.name !== roles.readProp) return;
      const [object, name] = path.node.arguments;
      if (!object || name?.type !== "StringLiteral") return;
      if (!IDENTIFIER_LIKE.test(name.value)) return;
      const isImmediateCallee =
        path.parentPath.isCallExpression() && path.parentPath.node.callee === path.node;
      const consumed = valueContexts && isValueConsumed(climbTransparent(path));
      if (!isImmediateCallee && !all && !consumed) return;
      path.replaceWith(t.memberExpression(object, t.identifier(name.value)));
      count++;
    },
  });
  return count;
}

function staticKeyName(property) {
  if (!property || (property.type !== "ObjectProperty" && property.type !== "ObjectMethod")) {
    return null;
  }
  const { key, computed } = property;
  if (key.type === "StringLiteral") return key.value;
  if (key.type === "Identifier" && !computed) return key.name;
  return null;
}

function requestEntries(node) {
  const body = node?.type === "ArrowFunctionExpression" ? node.body : null;
  if (body?.type !== "ObjectExpression") return [];
  const entries = [];
  for (const property of body.properties) {
    const id = staticKeyName(property);
    if (!id) continue;
    let value = property.value;
    if (value?.type === "AwaitExpression") value = value.argument;
    if (value?.type !== "CallExpression" || value.callee.type !== "Identifier") continue;
    entries.push({
      id,
      binding: value.callee.name,
    });
  }
  return entries;
}

function returnedObjects(ast) {
  const objects = new Map();
  for (const statement of ast.program.body) {
    const node =
      statement.type === "ExportNamedDeclaration"
        ? (statement.declaration ?? statement)
        : statement;
    const candidates =
      node.type === "FunctionDeclaration" && node.id
        ? [[node.id.name, node]]
        : node.type === "VariableDeclaration"
          ? node.declarations
              .filter((d) => d.id.type === "Identifier" && d.init)
              .map((d) => [d.id.name, d.init])
          : [];
    for (const [name, fn] of candidates) {
      if (fn.type === "ArrowFunctionExpression" && fn.body.type === "ObjectExpression") {
        objects.set(name, fn.body);
        continue;
      }
      const body = fn.body?.type === "BlockStatement" ? fn.body.body : null;
      if (!body) continue;
      const returned = body.find((s) => s.type === "ReturnStatement");
      if (returned?.argument?.type === "ObjectExpression") objects.set(name, returned.argument);
    }
  }
  return objects;
}

/**
 * Module builders by wire key: the top-level bindings whose returned object carries `key` and
 * `sources`. They are plumbing rather than a collector's own code, so naming has to keep its hands
 * off them, and the collector bundle uses them as its roots.
 */

/**
 * Module builders by wire key: the top-level bindings whose returned object carries `key` and
 * `sources`. They are plumbing rather than a collector's own code, so naming has to keep its hands
 * off them, and the collector bundle uses them as its roots.
 */
export function moduleBuilders(ast) {
  const builders = new Map();
  for (const [name, object] of returnedObjects(ast)) {
    let key = null;
    let hasSources = false;
    for (const property of object.properties) {
      const propertyName = staticKeyName(property);
      if (propertyName === "key" && property.value?.type === "StringLiteral")
        key = property.value.value;
      if (propertyName === "sources") hasSources = true;
    }
    if (key && hasSources) builders.set(key, name);
  }
  return builders;
}

export function collectSignalRegistries(ast) {
  const modules = [];
  const returned = returnedObjects(ast);
  const asObject = (node) => {
    if (node?.type === "ObjectExpression") return node;
    if (node?.type === "CallExpression" && node.callee.type === "Identifier") {
      return returned.get(node.callee.name) ?? null;
    }
    return null;
  };
  traverse(ast, {
    ObjectExpression(path) {
      let moduleKey = null;
      let sources = null;
      let toRequest = null;
      for (const property of path.node.properties) {
        const name = staticKeyName(property);
        if (name === "key" && property.value?.type === "StringLiteral")
          moduleKey = property.value.value;
        if (name === "sources") sources = asObject(property.value);
        if (name === "toRequest") toRequest = property.value;
      }
      if (moduleKey === null || !sources) return;
      const entries = [];
      for (const stage of sources.properties) {
        const stageName = staticKeyName(stage);
        if (!stageName || stage.value?.type !== "ObjectExpression") continue;
        for (const entry of stage.value.properties) {
          const id = staticKeyName(entry);
          if (!id || entry.value?.type !== "Identifier") continue;
          entries.push({
            stage: stageName,
            id,
            binding: entry.value.name,
          });
        }
      }
      for (const { id, binding } of requestEntries(toRequest)) {
        entries.push({
          stage: "request",
          id,
          binding,
        });
      }
      modules.push({
        key: moduleKey,
        entries,
      });
    },
  });
  return modules;
}

/**
 * Once hash constants are rewritten to the names they stand for, the resolver has to accept a name
 * as well as a hash, otherwise the output parses but no longer runs.
 */

/**
 * Once hash constants are rewritten to the names they stand for, the resolver has to accept a name
 * as well as a hash, otherwise the output parses but no longer runs.
 */
export function acceptResolvedNames(ast, roles) {
  let patched = false;
  traverse(ast, {
    FunctionDeclaration(path) {
      if (patched || path.node.id?.name !== roles.findName) return;
      const hashParam = path.node.params[1];
      if (hashParam?.type !== "Identifier") return;
      path.node.body.body.unshift(
        t.ifStatement(
          t.binaryExpression(
            "===",
            t.unaryExpression("typeof", t.cloneNode(hashParam, true)),
            t.stringLiteral("string"),
          ),
          t.blockStatement([t.returnStatement(t.cloneNode(hashParam, true))]),
        ),
      );
      patched = true;
    },
  });
  return patched ? 1 : 0;
}

export function inlineVaultReads(ast, vaults) {
  let count = 0;
  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (callee.type !== "Identifier") return;
      const table = vaults[callee.name];
      if (!table?.entries) return;
      if (path.node.arguments.length !== 1) return;
      const index = path.node.arguments[0];
      if (index?.type !== "NumericLiteral") return;
      const value = table.entries[index.value];
      if (value === undefined || value === null) return;
      path.replaceWith(t.valueToNode(value));
      count++;
    },
  });
  return count;
}

const IDENTIFIER_LIKE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** Turns `obj["someName"]` back into `obj.someName` once the vault strings are inlined. */

/** Turns `obj["someName"]` back into `obj.someName` once the vault strings are inlined. */
export function normalizeMemberAccess(ast) {
  let count = 0;
  const convert = (path) => {
    const { computed, property } = path.node;
    if (!computed || property.type !== "StringLiteral") return;
    if (!IDENTIFIER_LIKE.test(property.value)) return;
    path.node.computed = false;
    path.node.property = t.identifier(property.value);
    count++;
  };
  traverse(ast, {
    MemberExpression: convert,
    OptionalMemberExpression: convert,
  });
  return count;
}

const UNSAFE_KEY = new Set(["__proto__"]);

/**
 * `{ ["s94"]: fn }` back to `{ s94: fn }`. Inlining vault reads leaves object and class keys as
 * computed string literals; where the string is a plain identifier they read as ordinary keys.
 * `__proto__` is excluded — unquoting it would turn an own property into the prototype setter.
 */

/**
 * `{ ["s94"]: fn }` back to `{ s94: fn }`. Inlining vault reads leaves object and class keys as
 * computed string literals; where the string is a plain identifier they read as ordinary keys.
 * `__proto__` is excluded — unquoting it would turn an own property into the prototype setter.
 */
export function normalizeObjectKeys(ast) {
  let count = 0;
  const convert = (path) => {
    const { computed, key } = path.node;
    if (!computed || key?.type !== "StringLiteral") return;
    if (!IDENTIFIER_LIKE.test(key.value) || UNSAFE_KEY.has(key.value)) return;
    path.node.computed = false;
    path.node.key = t.identifier(key.value);
    count++;
  };
  traverse(ast, {
    ObjectProperty: convert,
    ObjectMethod: convert,
    ClassMethod: convert,
    ClassProperty: convert,
  });
  return count;
}

export function removeUnusedBindings(ast) {
  let removed = 0;
  for (let round = 0; round < 8; round++) {
    let changed = 0;
    traverse(ast, {
      Scopable(path) {
        path.scope.crawl();
      },
    });
    traverse(ast, {
      VariableDeclarator(path) {
        if (path.node.id.type !== "Identifier") return;
        const init = path.node.init;
        if (init && !isPureValue(init)) return;
        const binding = path.scope.getBinding(path.node.id.name);
        if (!binding || binding.references > 0 || binding.constantViolations.length > 0) return;
        if (path.parentPath.parentPath?.isExportNamedDeclaration()) return;
        path.remove();
        changed++;
      },
    });
    removed += changed;
    if (changed === 0) break;
  }
  return removed;
}

const ROLE_LABELS = {
  crc32Bytes: "crc32OfBytes",
  toBytes: "stringToBytes",
  asBytes: "asUint8Array",
  findName: "resolveNameByHash",
  readProp: "readVaultedProp",
  xorFromName: "xorAgainstName",
  permute: "permuteChars",
  decryptSelfKeyed: "decryptSelfKeyedTable",
  decryptEnvKeyed: "decryptEnvKeyedTable",
  makeEnvVault: "makeEnvKeyedVault",
  makeVault: "makeSelfKeyedVault",
  deepClone: "deepClone",
  jsonEncode: "encodeJsonBytes",
  jsonDecode: "decodeJsonBytes",
  base64Encode: "base64Encode",
  base64Decode: "base64Decode",
  hash128: "hash128",
  sealFrame: "sealFrame",
  compress: "compressPayload",
  envelope: "buildEnvelope",
  requestPath: "buildRequestPath",
};

function usedNames(ast) {
  const names = new Set();
  traverse(ast, {
    ReferencedIdentifier(path) {
      if (path.scope.hasBinding(path.node.name)) return;
      names.add(path.node.name);
    },
    Scopable(path) {
      for (const name of Object.keys(path.scope.bindings)) names.add(name);
    },
  });
  return names;
}

export function renameIdentifiers(
  ast,
  { roles = {}, manual = {}, vaults = {}, signals = {}, owners = new Map(), semantic = true } = {},
) {
  const fixed = new Map(Object.entries(manual));
  for (const [role, minified] of Object.entries(roles)) {
    if (ROLE_LABELS[role] && !fixed.has(minified)) fixed.set(minified, ROLE_LABELS[role]);
  }
  for (const name of Object.keys(vaults)) {
    if (!fixed.has(name)) fixed.set(name, `vault_${name}`);
  }
  for (const [name, label] of Object.entries(signals)) {
    if (!fixed.has(name)) fixed.set(name, label);
  }
  const counters = {
    fn: 0,
    arg: 0,
    v: 0,
    cls: 0,
  };
  const globals = usedNames(ast);
  const taken = new Set();
  for (const [minified, label] of fixed) {
    if (!taken.has(label)) {
      taken.add(label);
      continue;
    }
    for (let suffix = 2; suffix < 100; suffix++) {
      if (taken.has(`${label}${suffix}`)) continue;
      fixed.set(minified, `${label}${suffix}`);
      taken.add(`${label}${suffix}`);
      break;
    }
  }
  const nextName = (prefix) => {
    let candidate;
    do {
      candidate = `${prefix}${++counters[prefix]}`;
    } while (taken.has(candidate));
    taken.add(candidate);
    return candidate;
  };
  const claim = (base) => {
    if (globals.has(base)) return null;
    if (!taken.has(base)) {
      taken.add(base);
      return base;
    }
    for (let suffix = 2; suffix < 100; suffix++) {
      const candidate = `${base}${suffix}`;
      if (globals.has(candidate) || taken.has(candidate)) continue;
      taken.add(candidate);
      return candidate;
    }
    return null;
  };
  const isMangled = (name) =>
    /^[A-Za-z_$][A-Za-z0-9_$]?$/.test(name) || /^[A-Za-z]{1,2}\$?\d?$/.test(name);
  const renames = [];
  traverse(ast, {
    Scopable(path) {
      const isModuleScope = path.isProgram();
      for (const [name, binding] of Object.entries(path.scope.bindings)) {
        if (binding.__renamed) continue;
        binding.__renamed = true;
        const target = isModuleScope ? fixed.get(name) : undefined;
        if (target) {
          renames.push([path.scope, name, target]);
          continue;
        }
        if (!isMangled(name)) continue;
        const proposal = semantic ? suggestName(binding) : null;
        const owner = isModuleScope ? owners.get(name) : undefined;
        const base = owner ? `h_${owner.sig}_${proposal ?? owner.slug ?? "fn"}` : proposal;
        const inferred = base ? claim(base) : null;
        if (inferred) {
          renames.push([path.scope, name, inferred]);
          continue;
        }
        const kind = binding.kind;
        if (kind === "param") renames.push([path.scope, name, nextName("arg")]);
        else if (binding.path.isFunctionDeclaration())
          renames.push([path.scope, name, nextName("fn")]);
        else if (binding.path.isClassDeclaration())
          renames.push([path.scope, name, nextName("cls")]);
        else renames.push([path.scope, name, nextName("v")]);
      }
    },
  });
  for (const [scope, from, to] of renames) {
    try {
      scope.rename(from, to);
    } catch {}
  }
  return renames.length;
}
