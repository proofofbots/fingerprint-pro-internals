# Not determined

What this repository does not establish, stated so no section above reads as complete coverage.

## The `ex` module is empty in this build

Its three stages carry no collectors, so all 143 ids belong to `cm`. That is measured rather than
assumed: across the three captures the agent fetched no second script. If a server-delivered extended
module ever ships, the capture page records the fetch and `npm run diff` shows the ids it adds.

## One machine

The cross-browser matrix separates what varies by browser from what does not, but every capture was
taken on the same hardware behind the same address. A signal that is constant across the three
columns is only known to be constant for that machine.

The donor pool has the same limit. Every capture is macOS, so a profile for another OS carries macOS
values in every position no knob covers: the detected fonts, the per-family text metrics, the two
`getBoundingClientRect` boxes, the system colour table, the resolved system font. Two coherence rules
catch the most obvious of those and the rest are silent. One `collector/fp-collect.js` run per target
OS closes all of them at once.

## Four signals have a truncated call-graph walk

`s94`, `s219`, `s211` and `s70`, the WebRTC, media-capabilities and GPU families, fan out past the
walk limit. Their surfaces and status codes are complete; their branch lists are not. `s120` reaches
no recorded surface at all, because it throws a string and calls `toSource()` on the caught value,
and the walk only records reads rooted at a global.

## `verify` does not catch semantic drift

The gate proves that every string table still decodes from the cleaned file and that no identifier
was left undeclared. It does not prove the cleaned file computes what the original computes. An
earlier version of `inlineGlobalAliases` rewrote both halves of
`const { HTMLElement: a, Document: b } = window` to `window` itself: the file parsed, every table
decoded, no identifier was free, and the s63 collector read `window.prototype`. Running
`collector/fp-collect.js` against a capture is what found it. Nothing in the repository proves the
absence of a second bug of that shape.

## Server-side behaviour is inferred from responses

Everything about scoring is read off what the tenant answers. The client cannot show whether the
server validates a nonce, scores collection timing, or weights any particular signal. Where this
repository says a field is a bucket key, that is the best explanation of a paired experiment, not
something the client confirms.

## Replay contaminates its own measurements

- Everything sent comes back `replayed: true`, including payloads whose digests were reseeded and
  which mint a new `visitor_id`. So the flag is not keyed on the fingerprint, and what it is keyed on
  is not known. It contaminates `suspect_score` comparisons.
- A payload sent repeatedly burns as a control. The 2026-07-31 Chrome capture sent untouched a week
  later came back `tampering 0.82`, `anti_detect_browser true`, where the same bytes on the day they
  were taken recorded `tampering false`, `0.48`, `anti_detect false`. Whether that is model drift at
  the tenant or the accumulated replay history of one payload is not separated. No absolute score
  means anything; only differences against a control sent in the same session do.
- The request headers are part of the fingerprint, not transport. A Windows User-Agent on a macOS
  payload puts `anomaly_score` at exactly 1 with no field changed at all.
- A payload replayed from a Chrome window driven over the DevTools protocol came back
  `bot: bad, bot_type: webdriver, developer_tools: true`, while the payload itself reports every
  automation flag false and differs from an ordinary window only in session uuids, clocks and
  `navigator.connection.rtt`. What the server keyed that on is not determined.

## Identity findings are one tenant, two days

The seven breaking fields, the cumulative threshold and the `s56` binding were measured against the
public demo tenant on 2026-07-31 and 2026-08-01, on the build that shipped then. What happens to a
device that has presented another device's token is unresolved after four runs, and the two devices
in those runs also differ in how much history their family had, which is not separated.

## The GET leg's blob is opaque

`s56` is 96 bytes of sealed server output. What is inside it, and what the server does with the copy
it receives back, is not readable from the client.
