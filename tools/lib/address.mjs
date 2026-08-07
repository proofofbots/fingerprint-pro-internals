/**
 * Dotted addressing over a decoded payload, with `[]` meaning every element of an array.
 *
 * `s84.v.w` is one position. `s69.v[].l` is one position per element, which is how a per-element
 * field is written without the caller knowing how many elements a donor carried.
 */
export function getPath(node, path) {
  const parts = splitPath(path);
  let current = node;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    if (part === "[]") {
      if (!Array.isArray(current)) return undefined;
      return current;
    }
    current = current[part];
  }
  return current;
}

export function setPath(node, path, value) {
  const parts = splitPath(path);
  const written = [];
  writeInto(node, parts, value, written);
  return written;
}

function writeInto(node, parts, value, written) {
  if (node === undefined || node === null) return;
  const [head, ...rest] = parts;
  if (head === "[]") {
    if (!Array.isArray(node)) return;
    if (!rest.length) return;
    for (const item of node) writeInto(item, rest, value, written);
    return;
  }
  if (!rest.length) {
    node[head] = typeof value === "function" ? value(node[head]) : value;
    written.push(node[head]);
    return;
  }
  if (rest[0] === "[]") {
    writeInto(node[head], rest, value, written);
    return;
  }
  if (node[head] === undefined || node[head] === null || typeof node[head] !== "object")
    node[head] = {};
  writeInto(node[head], rest, value, written);
}

export function splitPath(path) {
  return path.replace(/\[\]/g, ".[].").split(".").filter(Boolean);
}

/** Reads a knob out of a profile: `screen.size.width`, absent knobs come back undefined. */

/** Reads a knob out of a profile: `screen.size.width`, absent knobs come back undefined. */
export function knobValue(profile, path) {
  return path
    .split(".")
    .reduce(
      (node, part) => (node === undefined || node === null ? undefined : node[part]),
      profile,
    );
}
