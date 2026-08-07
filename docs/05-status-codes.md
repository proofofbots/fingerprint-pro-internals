# Status codes

Every collector returns `{s, v}`: a status integer and a value. `0` is always success and negatives
are always failure, but the specific negative is chosen by the collector, so a `-3` read without
knowing which signal produced it means nothing.

A failed signal is reported by throwing `botdError(code, message)`, which the `{s, v}` wrapper turns
into the status. Those throws are the only place the meaning of a code is written down anywhere, so
the descriptions here are the agent's own message strings.
[`reference/codes.md`](../reference/codes.md) lists every site, grouped by code, with the message.

| code | sites | reads as | one of the agent's own messages |
| --- | --- | --- | --- |
| `0` | 108 | collected | no message |
| `-1` | 86 | the surface is not there | `navigator.plugins is undefined` |
| `-2` | 31 | it is there but is the wrong thing | `navigator.permissions.query is not a function` |
| `-3` | 25 | it answered, but not the way the agent expects | `errorTrace signal unexpected behaviour` |
| `-4` | 8 | connection or deadline | no message; one site is a 300 ms fallback |
| `-5` | 11 | local to the collector | no message |
| `-6` | 3 | local to the collector | no message |
| `-7` | 2 | local to the collector | no message |
| `-8` | 1 | local to the collector | no message |
| `-9` | 1 | local to the collector | no message |
| `-101` | 6 | something on the path threw | no message; all six sites sit in a `catch` |

282 sites in total, across 11 codes.

## The two stable readings

`-1` is "the value is not there". It is the default argument of the wrapper most stage3 collectors
are built from: the wrapper returns `{s: 0, v}` when the probe yields a value and `{s: -1, v: null}`
when it yields `null` or `undefined`.

`-101` is "this ran in a context that would not let it". One predicate produces it everywhere,
matching five error messages:

```text
Blocked a frame.*cross-origin frame
Permission denied.*cross-origin object
Failed to execute.*in this context
Context not access storage
(\w+)\(\)\s+called for opaque origin
```

It marks a sandboxed or opaque-origin frame, not a failed measurement.

## Everything from -2 to -9 is local

The geolocation collector reads `-2` prompt, `-3` `PERMISSION_DENIED`, `-4` `TIMEOUT`, `-5`
`POSITION_UNAVAILABLE`. The network path in the same bundle reads `-2` `AbortError`, `-3`
`TimeoutError`, `-4` `TypeError`, `-6` `CSPError`, `-7` `InvalidURLError`. Per-signal code sets are in
`reference/signals.md`.

## Why the codes matter

The tri-state is itself information. A surface that is absent, a surface that is present but throws,
and a surface that answers with something unexpected land in three different buckets, and all three
reach the server. A patched browser that makes an API throw is reporting a different thing than one
that deletes the API, whatever value it eventually supplies.

Static reads of the code miss statuses that never appear as an `s:` literal, which is why `codes`
looks for the shape rather than the literal: a bare `return -1`, a ternary chain assigned to a local,
a deadline handed to a wrapper, and a `botdError` thrown anywhere on the path. Against the three
captures in `captures/`, every status observed on the wire is one the static read predicts.
