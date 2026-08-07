import { getPath, knobValue, setPath } from "./address.mjs";

const DIGEST = /^[0-9a-f]{32}$/;

/**
 * A digest is `hash128` over a string the agent built out of a live measurement, so it can be
 * written in exactly one of two ways.
 *
 * `recompute` rebuilds the input string the way the bundle does and hashes it, which needs the raw
 * measurement in the profile — the WebGL parameter lists, the speech-voice table. `reseed` is the
 * fallback for the ones whose input a node process cannot produce at all (both canvas digests are
 * `hash128` of a rendered dataURL): the donor's digest is mixed with the profile's entropy, which
 * gives a value that is stable for a profile and distinct between profiles, and is honestly not a
 * measurement of anything.
 */

/**
 * A digest is `hash128` over a string the agent built out of a live measurement, so it can be
 * written in exactly one of two ways.
 *
 * `recompute` rebuilds the input string the way the bundle does and hashes it, which needs the raw
 * measurement in the profile — the WebGL parameter lists, the speech-voice table. `reseed` is the
 * fallback for the ones whose input a node process cannot produce at all (both canvas digests are
 * `hash128` of a rendered dataURL): the donor's digest is mixed with the profile's entropy, which
 * gives a value that is stable for a profile and distinct between profiles, and is honestly not a
 * measurement of anything.
 */
export const DIGESTS = [
  {
    path: "s17.v.geometry",
    input: null,
    why: "hash128 of a rendered canvas dataURL",
  },
  {
    path: "s17.v.text",
    input: null,
    why: "hash128 of a rendered canvas dataURL",
  },
  {
    path: "s76.v",
    input: null,
    why: "hash128 of a rendered canvas dataURL",
  },
  {
    path: "s46.v",
    knob: "audio.metrics",
    input: (value) =>
      Object.keys(value)
        .map((key) => `${key}=${value[key]}`)
        .join(","),
    why: "hash128 of the object's own k=v pairs, joined by comma",
  },
  {
    path: "s52.v",
    knob: "voices",
    input: (voices) => {
      const escape = (text) => (text ? String(text).replace(/([,\\])/g, "\\$1") : "");
      const rows = voices
        .map((voice) =>
          [
            escape(voice.voiceURI),
            escape(voice.name),
            escape(voice.lang),
            voice.localService ? "1" : "0",
            voice.default ? "1" : "0",
          ].join(","),
        )
        .sort();
      return JSON.stringify(rows);
    },
    why: "hash128 of the JSON of the sorted voice rows",
  },
  {
    path: "s75.v.contextAttributes",
    knob: "webgl.contextAttributes",
    input: (list) => list.join("&"),
    why: "hash128 of the attribute list joined by &",
  },
  {
    path: "s75.v.parameters",
    knob: "webgl.parameters",
    input: (list) => list.join("&"),
    why: "hash128 of the parameter list joined by &",
  },
  {
    path: "s75.v.parameters2",
    knob: "webgl.parameters2",
    input: (list) => list.join("&"),
    why: "hash128 of the second parameter list joined by &",
  },
  {
    path: "s75.v.shaderPrecisions",
    knob: "webgl.shaderPrecisions",
    input: (list) => list.join("&"),
    why: "hash128 of the shader-precision list joined by &",
  },
  {
    path: "s75.v.extensions",
    knob: "webgl.extensions",
    input: (list) => list.join(","),
    why: "hash128 of the extension list joined by comma",
  },
  {
    path: "s75.v.extensionParameters",
    knob: "webgl.extensionParameters",
    input: (list) => list.join(","),
    why: "hash128 of the extension-parameter list joined by comma",
  },
  {
    path: "s75.v.extensionParameters2",
    knob: "webgl.extensionParameters2",
    input: (list) => list.join("&"),
    why: "hash128 of the second extension-parameter list joined by &",
  },
];

export function applyDigests(payload, profile, codec, entropy) {
  const applied = [];
  for (const digest of DIGESTS) {
    const before = getPath(payload, digest.path);
    if (typeof before !== "string" || !DIGEST.test(before)) continue;
    const raw = digest.knob ? knobValue(profile, digest.knob) : undefined;
    if (raw !== undefined && digest.input) {
      const text = digest.input(raw);
      const after = codec.hash128(text);
      setPath(payload, digest.path, after);
      applied.push({
        path: digest.path,
        mode: "recomputed",
        from: digest.knob,
        before,
        after,
      });
      continue;
    }
    if (entropy === null) continue;
    const after = codec.hash128(`${digest.path}|${before}|${entropy}`);
    setPath(payload, digest.path, after);
    applied.push({
      path: digest.path,
      mode: "reseeded",
      from: "entropy",
      before,
      after,
    });
  }
  return applied;
}

const hex = (length) => {
  let out = "";
  for (let index = 0; index < length; index++) out += Math.floor(Math.random() * 16).toString(16);
  return out;
};

/** The agent's uuids come out of getRandomValues with no version bits set, so neither does this. */

/** The agent's uuids come out of getRandomValues with no version bits set, so neither does this. */
export const mintUuid = () => `${hex(8)}-${hex(4)}-${hex(4)}-${hex(4)}-${hex(12)}`;

/**
 * Session-scoped leaves, reminted so a send is a new event rather than the same one twice.
 *
 * Only `uuid` and `clock` are touched. A `counter` leaf (the storage quota, the heap ceiling) and a
 * `measured` one (a text metric, a domRect) read as session-scoped to the shape heuristic in
 * `npm run schema` but are device constants: reminting them would make the same device report
 * different hardware on every send, which is worse than replaying them.
 */

/**
 * Session-scoped leaves, reminted so a send is a new event rather than the same one twice.
 *
 * Only `uuid` and `clock` are touched. A `counter` leaf (the storage quota, the heap ceiling) and a
 * `measured` one (a text metric, a domRect) read as session-scoped to the shape heuristic in
 * `npm run schema` but are device constants: reminting them would make the same device report
 * different hardware on every send, which is worse than replaying them.
 */
export function remintSession(payload, schema, options = {}) {
  const { uuid = true, clock = true } = options;
  const minted = [];
  const clocks = [];
  for (const row of schema.keys) {
    for (const [leaf, meta] of Object.entries(row.shape)) {
      if (meta.scope !== "uuid" && meta.scope !== "clock") continue;
      const suffix = leaf === "." ? "" : leaf;
      const path = row.kind === "signal" ? `${row.id}.v${suffix}` : `${row.id}${suffix}`;
      const before = getPath(payload, path);
      if (before === undefined) continue;
      if (meta.scope === "uuid") {
        if (!uuid || typeof before !== "string") continue;
        const after = mintUuid();
        setPath(payload, path, after);
        minted.push({
          path,
          scope: "uuid",
          before,
          after,
        });
        continue;
      }
      if (!clock) continue;
      if (typeof before === "number")
        clocks.push({
          path,
          before,
        });
      else if (Array.isArray(before) && before.every((item) => typeof item === "number")) {
        clocks.push({
          path,
          before,
        });
      }
    }
  }
  const readings = clocks.flatMap(({ before }) => (Array.isArray(before) ? before : [before]));
  if (readings.length) {
    const shift = Date.now() - Math.max(...readings);
    for (const { path, before } of clocks) {
      const after = Array.isArray(before) ? before.map((item) => item + shift) : before + shift;
      setPath(payload, path, after);
      minted.push({
        path,
        scope: "clock",
        before,
        after,
      });
    }
  }
  return minted;
}
