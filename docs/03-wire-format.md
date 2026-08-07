# Wire format

The POST body is a framed, compressed, byte-encoded JSON object. Each layer is the agent's own code,
and `tools/lib/codec.mjs` calls those same functions rather than reimplementing them, so a frame
built in Node is byte-for-byte what the browser sends.

## The codec is JSON over bytes

`encodeJsonBytes` and `decodeJsonBytes` look like a custom binary format: the writer emits bare
type-tag bytes and the reader dispatches on them. The tags are ASCII. `34` is `"`, `44` is `,`, `58`
is `:`, `91` and `93` are the brackets, `123` and `125` the braces, plus the literal byte strings
`null`, `true` and `false`. The encoder is `JSON.stringify` writing into a growable `Uint8Array` and
the decoder is a recursive-descent JSON parser reading one.

Two details are not incidental. The encoder skips properties a predicate rejects rather than relying
on `undefined`, and the decoder defines object properties with `Object.defineProperty` instead of
assigning them, so a `__proto__` key or a poisoned setter in a response cannot execute. The same
codec decodes the encrypted string tables, so one implementation serves both directions.

## Compression

A body over 1024 bytes goes through `CompressionStream("deflate-raw")`. The frame tag records which
of the two happened; nothing else in the body changes.

## Frame

`sealFrame(bytes, marker, padMax, keyLength)` produces:

```text
[R] [marker[0]+R] [marker[1]+R] [padLen+R] [padLen random bytes] [key(keyLength)] [payload ^ key]
```

`R` is one random byte, every sum is mod 256, `padLen` is a fresh random value in `0..padMax`, and
the payload is XORed against the key repeating over its length. The key is in the frame. This is
framing, not encryption: it defeats a naive body-content filter and nothing more.

The four parameters are bindings rather than literals in the shipped file, so
`findFrameProfiles` reads them off the call sites:

| marker | pad max | key length | what it frames |
| --- | --- | --- | --- |
| `3,14` | 3 | 9 | telemetry POST, deflate-raw compressed |
| `3,13` | 3 | 9 | telemetry POST, uncompressed |
| `3,7` | 3 | 7 | the request-log entry kept in `localStorage` under `<prefix>lr` |

The agent only ever builds a frame, so the inverse is written here. `node tools/codec.mjs --open
<file>` unseals one, and `npm run replay -- --dry` builds a frame and reopens it locally to prove the
round trip.

## Envelope

`buildEnvelope` assembles the object. Every key that is not an `sN` signal:

| key | built from |
| --- | --- |
| `c` | the public API key |
| `t` | the tag passed to `get()` |
| `lid` | `linkedId` |
| `m`, `l` | install-method marker, `{m: "l", l: "jsl/4.0.0"}` on the loader path |
| `mo` | the keys of the registered modules |
| `s56` | the blob the server issued on the GET leg |
| `sc` | `{u}`, the agent's own script URL, read out of a thrown `Error`'s `fileName`, `sourceURL` or stack |
| `uh` | URL hashing flag |
| `ii` | integration info |
| `gt` | constant `1` |
| `ab` | A/B selections |
| `hu` | `fast ? 0 : eventId ? 1 : undefined` |
| `ri` | the previous event id |
| `epv` | the `ex` module's build marker, `3b947bb` |
| `lr` | the retry queue's stored request log |

Ten of these appear across the three captures: `c`, `m`, `l`, `mo`, `sc`, `ii`, `gt`, `ab`, `epv`,
`lr`. The others are absent when their value is `undefined`, which on a first collection is most of
them. `s56` is present too, but the schema counts it with the signals because that is where it sits
on the wire.

The signal ids enter through a spread that writes one wire key per collected component, unwrapping
each result to its value or to a flattened error. `reference/envelope.md` is the generated version of
this table, and `reference/schema.md` types every key and every addressable leaf inside it.

`s56` is worth separating from the rest: it is not a measurement. The agent fetches it over the GET
leg and replays it, and what it does to identity is in [06-identity](06-identity.md).

## Request path

The path is derived, not random. `buildRequestPath` cuts a token into `/`-joined chunks whose lengths
come from bytes of a seed, 4 to 7 characters each, so the same token always produces the same path.
That is what makes a replay reach the same endpoint as the browser did.

A capture's own sequence is in `reference/endpoints.md`. In the Safari capture the tenant answered
nothing useful, so the agent's retry queue posted the same frame seven times, which is the retry
behaviour visible on the wire.

## Diagnostics stream

Alongside the signals the agent ships a numbered event stream: per-`getCall` and per-`collectCall`
correlation ids, per-stage timestamps (`ls`, `le`, `ca`, `ss`, `se`, `sd`, `gs`, `ge`, `cs`, `ce`,
`fa`, `ia`, `vs`), visibility-state history, and failed-attempt records. Together with the per-signal
`duration` this makes the timing of collection itself a channel the server receives. Whether the
server scores it is not observable from the client.
