# Architecture

The Fingerprint Pro v4 browser agent is a single ES module, 194,100 bytes, served per tenant from a
path that rotates. It exports `start`, `handleAgentData`, `isFingerprintError` and `withoutDefault`,
carries `Copyright (c) FingerprintJS, Inc, 2026`, and ships a stub source map whose `sourcesContent`
is one space.

Everything below describes the build pinned in [`agent/pin.json`](../agent/pin.json). The names in
backticks are the ones in `agent/agent.clean.js`; the ones assigned during deobfuscation are marked
in [the symbol table](#symbol-table).

## Components

| part | where it lives | what it does |
| --- | --- | --- |
| module registry | `cm` and `ex` module objects | maps a wire signal id to the function that collects it |
| collectors | 143 functions | read one browser surface each and return `{s, v}` |
| scheduler | `getComponents` closure | runs the stages, yields to the event loop on a budget |
| worker | Blob-URL Web Worker, 134 lines | runs the same source tables off the main thread |
| envelope builder | `buildEnvelope` | assembles the POST body from the collected components |
| codec | `encodeJsonBytes` / `sealFrame` / `compressPayload` | turns that object into the bytes on the wire |
| transport | request path builder, retry queue | two legs, GET then POST |

## Modules

A module is an object with a `key`, a `sources` table of three stages, and a `toRequest` function.
The registry is what makes the whole map readable: the keys of `sources` are the wire signal ids and
the values are the collectors.

```js
{
  key: "cm",
  sources: { stage1: {...}, stage2: {...}, stage3: {...} },
  browserCache: ...,
  toRequest: async (options, urlHashing) => ({ s69: ..., s55: ..., s48: ... }),
}
```

Two modules ship. `cm` registers 140 collectors across the three stages and contributes three more
ids through `toRequest`, for the 143 in `reference/signals.md`. `ex` registers `stage2: {}` and
`stage3: {}` and a single `toRequest` field, `epv: "3b947bb"`, so it collects nothing in this build.
It is the hook a server-delivered extended module would arrive through; across the three captures in
`captures/` the agent fetched no second script.

## Stages

The stages are a scheduling order, not a classification of what is measured.

1. `stage1` starts immediately. It holds four collectors, and they are the slow ones: `s94` and
   `s219` (RTCPeerConnection against the tenant's TURN endpoint), `s167` (Encrypted Media
   Extensions), `s213` (geolocation behind a permissions query).
2. `stage2` and `stage3` are merged into one map and started from `requestIdleCallback` with an 8 ms
   nominal wait and a 16 ms timeout, so first paint does not compete with the remaining 136 probes.
3. Both groups run through the same loop, which awaits a macrotask every time 50 ms of wall clock has
   passed. With `aggressiveOptimization` set the budget becomes 100000 ms, so the loop never yields
   and every probe starts in one burst. The public demo tenant sets it.

Results merge in a fixed order: stage2 and stage3 first, stage1 assigned over them, the worker's
results assigned over all of it.

## Two-phase collectors

A source is called once with the options object. If it returns a value, that value is the result. If
it returns a function, that function is a deferred second phase called later, and the reported
`duration` is the sum of both phases.

```js
const started = Date.now();
const first = await source(options);
const setup = Date.now() - started;
if (typeof first !== "function") return { value: first, duration: setup };
const resumed = Date.now();
return { value: await first(), duration: setup + (Date.now() - resumed) };
```

That is what lets the agent start every probe, leave the ones that need wall-clock time pending
(audio, network, permissions), and collect them together. A collector that throws becomes
`{error, duration}` for its own id and affects nothing else in the batch.

The per-signal `duration` ships with the results, so the client also reports a timing profile of its
own collection.

## Worker

`agent/worker.clean.js` is the Blob the agent instantiates. It is a separate program with none of
the agent's protection layers on it: no CRC32 name resolution, no string vault, plain minified
JavaScript.

Before installing its message handler it fakes enough of a window to run collectors written for the
main thread: `self.window = self`, a `requestIdleCallback` shim over `setTimeout`, and a `document`
stub with `hidden: false` and the two event-listener methods. A collector probing
`window.document.hidden` inside the worker reads that stub.

Messages are arrays, `[opcode, ...payload]`. Host and worker share one opcode space:

| op | direction | meaning |
| --- | --- | --- |
| 0 | host to worker | ping |
| 1 | worker to host | pong |
| 2 | worker to host | ready, posted once the handler is installed |
| 3 | host to worker | start collection, payload is the options object |
| 4 | worker to host | started |
| 5 | worker to host | start failed, payload is `name`, `message`, `stack` |
| 6 | host to worker | deliver results |
| 7 | worker to host | results |
| 8 | worker to host | collection failed |
| 9 | host to worker | confirm receipt |
| 10 | worker to host | confirmed, sent only if results were already delivered |

The host resolves its worker promise on op 2 and terminates on 5, 8 or 10, so a failed start and a
completed handover tear down the same way.

Inside the worker the staging is dropped: `Object.assign(all, stage1, stage2, stage3)`, one flat
pass. It merges the sources of whatever modules the page hands it, and in this build that is the `ex`
stub, whose stages are empty, so the worker collects nothing of its own. No capture has seen it
collect anything.

## Request legs

A collection produces two requests, both to the tenant's ingress:

1. A `GET` whose 96-byte body becomes the `s56` value in the next POST. The path is derived from a
   token rather than random, so the same token always yields the same path.
2. A `POST` carrying the envelope: 154 wire keys in the captures here, 144 signal ids and 10
   envelope keys, encoded with the agent's own JSON-to-bytes codec,
   deflate-raw compressed over 1024 bytes, then framed. `reference/endpoints.md` prints the sequence
   a capture actually recorded.

Both legs carry `?ci=<loader tag>&q=<public API key>`. The wire format is in
[03-wire-format](03-wire-format.md).

## Symbol table

The bundle ships one-letter identifiers. Names in this repository come from three places: the
agent's own strings (module keys, wire ids, error messages), a role signature matched against the
code, or evidence in the function body. Nothing is guessed from the shape of an identifier.

| name here | what it is | how it was named |
| --- | --- | --- |
| `resolveNameByHash` | CRC32 property-name resolver | role signature |
| `readVaultedProp` | accessor built on that resolver | role signature |
| `makeSelfKeyedVault` | string table whose key rides in the blob | role signature |
| `makeEnvKeyedVault` | string table keyed off live browser state | role signature |
| `decryptSelfKeyedTable`, `decryptEnvKeyedTable` | the two decryptors | role signature |
| `encodeJsonBytes`, `decodeJsonBytes` | the JSON-over-bytes codec | role signature |
| `sealFrame` | frame builder for the POST body | role signature |
| `compressPayload` | deflate-raw wrapper | role signature |
| `buildEnvelope` | POST body assembly | role signature (`s56:`) |
| `buildRequestPath` | request path chunker | role signature |
| `hash128` | x64-128 mixer behind every 32-hex digest | role signature |
| `sig_s<id>_<surface>` | a registered collector | the agent's own `sources` table |
| `h_s<id>_<evidence>` | a helper only that collector can reach | call-graph ownership |
| `vault_<name>` | a string table | the bundle's own binding name |
| `fn<n>`, `v<n>`, `arg<n>` | no evidence found | counter |

The full mapping between the shipped names and these is regenerated on every run; `npm run clean --
--no-rename` writes `agent/agent.clean.keepnames.js`, which keeps the original identifiers for
cross-referencing a stack trace or a breakpoint.
