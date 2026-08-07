# Protection layers

Three layers sit between the shipped bundle and readable code. None of them needed a browser to come
apart, and the reasons why are specific rather than general.

## Property names are CRC32 constants

Every property the agent touches is stored as a CRC32 hash of its name, not as a string.
`resolveNameByHash(object, hash)` walks the prototype chain calling `Object.getOwnPropertyNames`,
hashes each name with CRC32 (polynomial `0xEDB88320`), and returns the first name that matches.
`readVaultedProp(object, hash)` is the accessor built on it: `object[resolveNameByHash(object, hash)]`,
bound if callable. So `navigator.requestMediaKeySystemAccess` appears in the bundle as `3994889901`
and nowhere else.

This is name erasure, not encryption, and the input space is DOM identifiers. A rainbow table over a
dictionary of 228,932 names resolves all 119 hashed read sites in this build, with none left over.
The dictionary comes from TypeScript's `lib.dom`, `lib.es5` and `lib.webworker` declarations, the
`known-css-properties` list, every string literal in the bundle, every string recovered from the
decrypted tables, and a harvest of `Object.getOwnPropertyNames` out of a real Chrome.

That last source is what closes the gap. The names that resist a declaration-file dictionary are
exactly the ones no declaration file lists: `webkitTapHighlightColor`, `webkitTouchCallout`,
`glyphOrientationVertical`, `queryUsageAndQuota`, `jsHeapSizeLimit`. Harvesting them is a fixed cost,
not a per-build one, and `tools/data/browser-names.json` carries the result.

Two consequences follow from the design rather than from the analysis. Every vaulted property access
enumerates and hashes an entire prototype chain, which is real work at runtime. And any property the
agent reads has to be enumerable on the object or its prototype chain, which is a behaviour a
defender can observe.

## String tables are XOR-encrypted

Thirty-two tables hold the string literals that matter. Two constructors build them:

| constructor | tables | key |
| --- | --- | --- |
| `makeSelfKeyedVault(words, n)` | 28 | embedded in the blob itself |
| `makeEnvKeyedVault(words, keyFns)` | 4 | derived at runtime from live browser state |

A self-keyed table validates a small header, then XORs the payload against a key that rides in the
same blob, so it decodes offline with nothing but the bundle.

The four env-keyed tables are the layer designed to require a browser. Each key is built by
permuting property *names* read off live objects:

```js
permuteChars(
  [
    resolveNameByHash(document.createElement("frameset"), 3017323393),
    xorAgainstName(navigator, 859837811, "QjslADtOBipACA"),
  ],
  [20, 1, 24, 23, 23, 21, 14, 8, 11, 8, 6, 13, 1, 1, 12, 4, 9, 10, 6, 2, 1, 2, 0, 1, 2, 1, 1],
)
```

Names, not values. `resolveNameByHash` is the same CRC32 resolver from the first layer, so the key
material is a permutation of two names the rainbow table already recovers. Patching that one function
to answer from the rainbow table decrypts all four tables in Node with no DOM at all. Had the key
come from a value instead, a computed style, a WebGL renderer string, an audio digest, the tables
would need a browser, and a browser matching the target's configuration.

| table | key material |
| --- | --- |
| WebGPU collector | `onorientationchange` on `<frameset>`, `contacts` on `navigator` |
| two style tables | `webkitTapHighlightColor` and `webkitTouchCallout` on `new Image().style` |
| one style table | `strokeColor` and `glyphOrientationVertical` on `new Image().style` |

What the tables hold is the part of the agent that was genuinely opaque: the WebGPU timestamp-query
pipeline and its WGSL source, the DRM probe with its Widevine service certificate and PSSH box, a
64-entry WebGL extension list, a 36-entry WebGPU limits list, the WebAuthn capability map with its
two- and three-letter wire keys, the TURN endpoint and region map, a CSS float-precision probe, and
the 144-entry `s<n>` id space itself.

The wire keys and the agent's own short field names (`drm`, `ri`, `lr`, `s94`) exist *only* inside
those tables, which is why the dictionary builder feeds `agent/vaults.json` back into itself: they
are unresolvable as hashes until the tables have been decoded once.

## Selective expression obfuscation

Hot functions carry the javascript-obfuscator operator-wrapper style: local aliases like
`const w = function (a, b) { return a !== b; }` substituted for every operator, plus the dispatch-table
form, `const t = { mFbXW(f, a, b) { return f(a, b); } }` called as `t.mFbXW(readVaultedProp, o, hash)`.
This build folds 1,415 wrappers and 21 wrapper-object calls.

The plumbing, error types, fetch, retry, the event bus, ships plain. Nothing is control-flow
flattened. There is no string-array rotation, no VM, no anti-debug and no self-integrity check in
this build.

## What the deobfuscator does about it

`npm run clean` sweeps a fixed set of passes until nothing changes, reparsing between sweeps, then
renames every binding and formats the result. The full pass list is in
[09-toolchain](09-toolchain.md). On this build:

| measure | count |
| --- | --- |
| operator wrappers folded | 1,415 |
| wrapper-object calls folded | 21 |
| CRC32 constants resolved to names | 221 rewrites over 119 sites |
| vault strings inlined | 481 |
| `atob` literals folded | 100 |
| bindings renamed | 2,992 |
| collectors named after their wire id | 143 |
| helpers named after the collector that owns them | 199 |
| hashes left unresolved | 0 |

The output stays runnable. Rewriting hash constants to strings breaks the env-keyed key derivation
unless the resolver also accepts a name, so the deobfuscator prepends a string short-circuit to
`resolveNameByHash`. Without it the file parses and every key derivation silently produces the wrong
key.

## Verification

`npm run verify` is the equivalence gate, and it is two checks.

The first decodes all 32 tables from the cleaned file and diffs them against the original. That path
exercises name resolution, CRC32, the XOR keystream, the binary decoder and the env-keyed derivation
end to end, so a pass that corrupts any of them stops a table decoding. It is what caught
`resolveHashArguments` breaking the WebGPU table's key derivation: the cleaned file parsed perfectly
and only the table diff noticed.

The second diffs the free identifiers of the cleaned file against the original's and fails on any the
passes introduced. A pass that deletes a declaration whose references it miscounted leaves the output
parseable and every table decodable, and throws `ReferenceError` the moment that code runs.

Both checks are necessary and neither is sufficient. A pass can rewrite an expression into something
that parses, declares everything, decodes every table and still means something else: an earlier
version of `inlineGlobalAliases` replaced both halves of
`const { HTMLElement: a, Document: b } = window` with `window` itself, which the gate did not see and
running the collector did. Semantic drift of that kind is caught by running `collector/fp-collect.js`
against a capture, not by `verify`.
