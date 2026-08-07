# Toolchain

Every command writes into the tree and prints what it wrote. Run them in the order below; each one's
output feeds the next. `npm run all` is the whole chain.

| command | reads | writes |
| --- | --- | --- |
| `npm run fetch` | `agent/pin.json` | `artifacts/agent.original.js` |
| `npm run libs` | network | `artifacts/ts-lib.*.d.ts` |
| `npm run harvest` | a local Chrome over CDP | `tools/data/browser-names.json` |
| `npm run vaults` | the original bundle | `agent/vaults.json` |
| `npm run hashes` | the original bundle | `agent/crc32-map.json` |
| `npm run clean` | the original bundle | `agent/agent.clean.js` |
| `npm run worker` | the original bundle | `agent/worker.clean.js` |
| `npm run verify` | both files | pass or fail, and the derived hashes in `agent/pin.json` |
| `npm run signals` | the clean file | `reference/signals.{json,md}` |
| `npm run slice` | the clean file | `reference/slices/` |
| `npm run envelope` | the clean file | `reference/envelope.{json,md}` |
| `npm run codes` | the clean file | `reference/codes.{json,md}` |
| `npm run endpoints` | the clean file, a capture | `reference/endpoints.{json,md}` |
| `npm run join` | the map, every capture | `reference/observed.{json,md}` |
| `npm run schema` | the map, every capture | `reference/schema.{json,md}` |
| `npm run collector` | the clean file | `collector/fp-collect.js` |
| `npm run spy` | `tools/fpspy.src.js`, the map | `spy/fpspy.js` |
| `npm run capture` | the original bundle, the spy | a file in `captures/` |
| `npm run scrub` | `captures/` | the same files, third-party storage dropped |
| `npm run diff` | a baseline, the map | `reference/diff.md` |
| `npm run evidence` | `artifacts/identity`, `artifacts/distill` | `evidence/` |

## Deobfuscation

**`vaults`** loads the agent's own decryption primitives into Node and dumps every string table.
Nothing is reimplemented: a throwaway copy of the bundle gets two edits, the CRC32 resolver is
short-circuited through the rainbow table so no DOM is needed, and the internals are re-exported
under stable role names. The decoders cannot drift from the bundle.

**`hashes`** reports every CRC32 site and what it resolves to. Diagnostic only; `clean` does its own
resolution. The dictionary is built from the TypeScript libs, `known-css-properties`, the harvested
browser names, every string literal in the agent, and every string recovered from the vaults, because
the agent's own short field names exist only inside the encrypted tables. Unresolved or ambiguous
hashes can be pinned by hand in `tools/data/names.json`, whose `hashes` map is keyed by CRC32 and
therefore survives a version bump. Its `identifiers` map is keyed by minified name and does not.

**`clean`** sweeps these passes until nothing changes, regenerating and reparsing between sweeps,
then renames every binding and formats the result.

| pass | what it does |
| --- | --- |
| `simplifyLiterals` | `!0`/`!1`/`void 0`/`1/0` back to real literals, un-Yoda comparisons |
| `ensureBlocks` | gives every branch and loop a block so statements can be spliced in |
| `inlineOperatorWrappers` | folds the javascript-obfuscator operator wrappers |
| `inlineWrapperObjects` | folds the dispatch-table form of the same |
| `inlineConstantBindings` | pushes literal-valued bindings to their use sites |
| `foldConstants` | evaluates the arithmetic and concatenation that exposes |
| `restoreMemberAccess` | `readVaultedProp(o, "f")(x)` back to `o.f(x)`, plus value positions |
| `restoreNullishOperators` | rebuilds `?.` and `??` from the downlevelled ternaries |
| `resolveHashArguments` | CRC32 constants to the names they stand for |
| `inlineVaultReads` | vault table reads to the decrypted value |
| `inlineGlobalAliases` | `var t = atob` back to `atob` at every use site |
| `decodeBase64Literals` | folds `atob("...")` on a constant |
| `normalizeMemberAccess` | `o["name"]` to `o.name` |
| `normalizeObjectKeys` | `{ ["s94"]: fn }` to `{ s94: fn }` |
| `flattenSequences` | `(a(), b(), c)` to three statements |
| `statementizeControlFlow` | `a && b();` to `if (a) b();` |
| `statementizeReturns` | `return a ? x : b ? y : z` to the `if` chain |
| `removeUnusedBindings` | drops what the above orphaned |
| `acceptResolvedNames` | teaches the resolver to take a name as well as a hash |
| `collectSignalRegistries` | reads the agent's own `sources` tables: wire id to collector |
| `renameIdentifiers` | one readable name per binding |

Only aliases of a bare global are inlined. An alias of a member path (`var t = Object.keys`) is left
alone, because `t(x)` and `Object.keys(x)` do not pass the same `this`, and a destructured binding is
left alone because both halves of `const { a: x, b: y } = window` are bindings of one declarator.

Names come from evidence, never from the shape of an identifier. `tools/lib/naming.mjs` reads a
binding's initializer, the property a destructured binding came off, the properties its uses go
through, and the one string in a function body specific enough to have been the point of writing it.
`tools/lib/surface.mjs` gives a collector the rarest browser surface it reaches, which is the `sig_*`
suffix. A binding with no evidence keeps a counter. Every generated name is unique across the file.

Naming the collectors alone leaves the code under them as numbers, which is where the measurement
happens. `exclusiveOwners` walks the call graph from every collector and stops at the other
collectors: a helper only one of them can reach is that signal's own code and is named
`h_<id>_<evidence>`; one reached from several is shared plumbing and keeps its counter.

Flags:

- `--no-rename` keeps the original minified identifiers, into `agent/agent.clean.keepnames.js`.
  Useful when cross-referencing a stack trace or a breakpoint against the shipped file.
- `--no-infer` keeps the renaming but drops the inferred names, so every binding is `v12`/`fn7`.
  Bisecting a rename that breaks `verify` starts here.
- `--member-access` collapses every remaining vault read, including the ones held and called later.
  More readable, no longer equivalent.

## Mapping

**`signals`**, **`slice`**, **`envelope`**, **`codes`**, **`schema`** read the clean file and write
the inventories described in [04-collection](04-collection.md). **`join`** adds what the captures
actually carried, and is where a hole in the static read shows up as a disagreement.

**`diff`** compares two generated maps, not two bundles, so a rebuild that only shuffles minified
names is silent while a collector that starts reading a new surface, gains a status code or changes
its reported shape shows up per signal. Save a baseline before pulling a new agent:

```bash
npm run diff -- --save 2026-08-07-jsl4.0.0
npm run diff
node tools/diff.mjs reference/baselines/old.json reference/baselines/new.json
```

Counter names are normalised before comparing branch tests, so a helper that moved from `fn3` to
`fn7` does not read as a change.

## Wire tools

**`codec`** makes the agent's own codec callable from Node, by the same re-export trick as `vaults`.

```bash
npm run codec                                 # print the detected roles, then self-test
node tools/codec.mjs --open captures/chrome-*.json
node tools/codec.mjs --open body.bin --out payload.json
node tools/codec.mjs --seal payload.json
```

As a library through `tools/lib/codec.mjs`: `encodeJson`/`decodeJson`, `base64Encode`/`base64Decode`,
`hash128(text, seed)`, `sealFrame(bytes, profile)`, `openFrame(buffer)` (written here, the agent has
no unsealer), `compress`/`inflate`, `helperUrl(endpoint)`.

**`replay`** rebuilds a payload and sends it from Node, then reads the verdict back.

```bash
node tools/replay.mjs --payload payload.json --dry
node tools/replay.mjs --from captures/chrome-*.json --as-origin https://demo.fingerprint.com --result
node tools/replay.mjs --payload payload.json --set s7.v=32 --result
```

`--set` edits a field before sending: `s7=32` sets that signal's value, a full `{s,v}` object replaces
the whole signal, `c='"<key>"'` addresses the envelope. `--key`, `--endpoint`, `--origin` and `--ua`
retarget another tenant.

The origin is bound into several signals (`sc.u`, the window and location probe, the crypto-origin
list, an error stack trace) and the tenant rejects the event when they disagree with the request
`Origin` header. `--as-origin` finds the origin a capture was taken on and rewrites it everywhere by
string, which is what lets a localhost capture present as the target. That the check falls to string
substitution is the point worth noting: origin coherence is real, but it is client-reported data.

`--probe` sends the frame, then a corrupted copy, and confirms they draw different answers, so a
`403` is the tenant's policy rather than a malformed body.

**`profile`** compiles a human-readable device profile into a payload, and is where a payload comes
from when it is not a capture.

```bash
node tools/profile.mjs --template --donor chrome > profiles/mine.json
node tools/profile.mjs profiles/mine.json
```

A profile is a patch over a donor capture, not a specification of 144 fields. About forty knobs
(`hardware.cores`, `screen.avail`, `gpu.rendererUnmasked`, `uach.brands`) map onto the wire positions
that carry them, and a knob absent from the profile writes nothing, so the donor's value stands. The
report says how many wire keys came from the profile, how many were derived and how many are still
the donor's. `--template` reads the map backwards, turning a donor into the profile that reproduces
it, which is the only way a profile stays writable by hand. `--only` and `--skip` take knob prefixes.

Three things happen after the knobs are written. Digests whose input the profile can carry are
recomputed with the agent's own `hash128`; the three that hash a rendered canvas cannot be produced
in Node at all and are reseeded from the profile's entropy instead, which is stable per profile and
honestly not a measurement of anything. Every session uuid is reminted and every clock is shifted by
one offset rather than set to one value, because a capture's own offsets are real measurements and
flattening them produces a set of simultaneous readings no browser makes. Coherence rules then check
relations a real browser cannot break; `fail` is a relation the agent's own code guarantees, `warn`
is one real browsers hold but nothing in the client enforces.

**`verdict`** compiles, sends, and prints the server's answer as one row, which is what `--only` and
`--skip` exist for.

**`identity`** and **`cache-bind`** are the two tools behind [06-identity](06-identity.md).
`identity` runs paired arms: mint a device the tenant has never seen, send it, send it again with one
field changed, compare the two ids. `--no-cache` empties `s56` on every send and without it the tool
measures nothing. `--rotate-ip` takes a fresh exit per send. `--mode sticky` asks the other question,
how much an already established visitor absorbs.

**`distill`** attributes a server-side detection to input signals with a bounded request budget.

## Instrumentation

**`spy`** builds `spy/fpspy.js` from `tools/fpspy.src.js`, inlining the signal-id labels from
`reference/signals.json` so a decoded payload is readable. **`capture`** serves the page that runs the
stored bundle and saves what the spy recorded. Both are covered in
[07-reproducing](07-reproducing.md).

**`collector`** generates `collector/fp-collect.js`: the collectors, the envelope builder and the
codec, with the vaulted property reads collapsed to plain member access, the encrypted strings
inlined, and the roots found structurally rather than by name, so a version bump regenerates instead
of breaking. Two reads are kept behind a `boundProperty` helper because their result is stored and
called later, where collapsing would drop the receiver.
