import { inflateRawSync, inflateSync } from "node:zlib";
import { loadAgentInternals } from "./agent.mjs";
import { findFrameProfiles } from "./detect.mjs";

const asBytes = (value) =>
  value instanceof Uint8Array ? value : new Uint8Array(value.buffer ?? value);

/**
 * Takes a sealed frame apart.
 *
 * The agent only ever builds one, so this is the only piece here that is written rather than
 * borrowed, and it is driven entirely by the numbers read off the bundle's own call sites:
 *
 *   [h] [h+marker[0]] .. [h+marker[n]] [h+padLength] [pad × padLength] [key × keyLength] [payload ^ key]
 *
 * `h` is a random byte the sealer emits first and then adds to every field that has to survive as a
 * number, which is what makes the marker and the pad length readable without knowing either.
 */

/**
 * Takes a sealed frame apart.
 *
 * The agent only ever builds one, so this is the only piece here that is written rather than
 * borrowed, and it is driven entirely by the numbers read off the bundle's own call sites:
 *
 *   [h] [h+marker[0]] .. [h+marker[n]] [h+padLength] [pad × padLength] [key × keyLength] [payload ^ key]
 *
 * `h` is a random byte the sealer emits first and then adds to every field that has to survive as a
 * number, which is what makes the marker and the pad length readable without knowing either.
 */
export function openFrame(buffer, profiles) {
  const bytes = asBytes(buffer);
  if (bytes.length < 3) throw new Error("frame too short");
  const header = bytes[0];
  const candidates = profiles.filter((profile) => {
    const marker = profile.markerBytes;
    if (!marker || bytes.length < 2 + marker.length) return false;
    return marker.every((value, index) => bytes[1 + index] === ((header + value) & 0xff));
  });
  if (candidates.length === 0)
    throw new Error(`no frame profile matches header 0x${header.toString(16)}`);
  const profile = candidates[0];
  let offset = 1 + profile.markerBytes.length;
  const padLength = (bytes[offset++] - header) & 0xff;
  if (padLength > profile.padMax)
    throw new Error(`pad length ${padLength} over profile max ${profile.padMax}`);
  offset += padLength;
  const key = bytes.slice(offset, offset + profile.keyLength);
  offset += profile.keyLength;
  const payload = new Uint8Array(bytes.length - offset);
  for (let index = 0; index < payload.length; index++) {
    payload[index] = bytes[offset + index] ^ key[index % profile.keyLength];
  }
  return {
    profile,
    header,
    padLength,
    key,
    payload,
  };
}

/** Frames over the size threshold are deflated before sealing; which flavour is not in the frame. */

/** Frames over the size threshold are deflated before sealing; which flavour is not in the frame. */
export function inflate(payload) {
  try {
    return new Uint8Array(inflateRawSync(payload));
  } catch {
    return new Uint8Array(inflateSync(payload));
  }
}

/**
 * The agent's own codec primitives, callable from node.
 *
 * Nothing here is reimplemented: the bundle is loaded through `loadAgentInternals`, which re-exports
 * the detected primitives under stable role names, so an encoder that drifts from the shipped agent
 * is not possible. What is added is the inverse of the two one-way steps — opening a frame and
 * inflating it — plus the frame parameters read off the call sites.
 */

/**
 * The agent's own codec primitives, callable from node.
 *
 * Nothing here is reimplemented: the bundle is loaded through `loadAgentInternals`, which re-exports
 * the detected primitives under stable role names, so an encoder that drifts from the shipped agent
 * is not possible. What is added is the inverse of the two one-way steps — opening a frame and
 * inflating it — plus the frame parameters read off the call sites.
 */
export async function loadCodec(options = {}) {
  const { internals, roles, ast, source } = await loadAgentInternals(options);
  const profiles = findFrameProfiles(ast, roles);
  const required = [
    "jsonEncode",
    "jsonDecode",
    "base64Encode",
    "base64Decode",
    "hash128",
    "sealFrame",
  ];
  const absent = required.filter((role) => typeof internals[role] !== "function");
  if (absent.length) throw new Error(`bundle layout changed, no ${absent.join(", ")}`);
  const defaultProfile = profiles.find((profile) => profile.keyLength === 9) ?? profiles[0];
  return {
    roles,
    profiles,
    source,
    encodeJson: (value) => asBytes(internals.jsonEncode(value)),
    decodeJson: (bytes) => internals.jsonDecode(asBytes(bytes)),
    base64Encode: (bytes) => internals.base64Encode(asBytes(bytes)),
    base64Decode: (text) => asBytes(internals.base64Decode(text)),
    hash128: (text, seed = 0) => internals.hash128(text, seed),
    sealFrame: (bytes, profile = defaultProfile) =>
      internals.sealFrame(asBytes(bytes), profile.markerBytes, profile.padMax, profile.keyLength),
    openFrame: (buffer) => openFrame(buffer, profiles),
    compress: internals.compress,
    inflate,
    helperUrl: typeof internals.helperUrl === "function" ? internals.helperUrl : null,
  };
}
