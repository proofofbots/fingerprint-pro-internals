# Reproducing

## The pinned target

| | |
| --- | --- |
| bundle | `https://demo.fingerprint.com/DBqbMN7zXxwl4Ei8/web/v4/kBwLN2IyH1GjeJBLpl8C?ci=jsl/4.0.0` |
| sha256 | `250c7dfed751a8699cbcbb34c98626fd08f6980f09cba9706fa8091698a40592` |
| size | 194,100 bytes |
| fetched | 2026-08-07 |
| loader tag | `jsl/4.0.0`, install marker `{m: "l", l: "jsl/4.0.0"}` |
| `ex` build marker | `epv: "3b947bb"` |
| captures | Chrome 149, Firefox 151, Safari 26.4.1, macOS 26.4.1, 2026-08-07, one machine |
| identity runs | public demo tenant, 2026-07-31 and 2026-08-01 |
| tooling | Node 20 or newer, Chrome for `harvest` and `capture` |

Machine-readable in [`agent/pin.json`](../agent/pin.json), which also carries the sha256 of each
derived file `npm run verify` accepted.

**Shelf life.** The tenant ships new builds and the path segments rotate. Between 2026-07-31 and
2026-08-07 the bundle went from 192,978 to 194,100 bytes with no change to the loader tag or the `ex`
build marker, and `npm run diff` reported 0 signals added, 0 removed, 56 changed. Everything under
`reference/` describes the pinned build only.

## Install

```bash
npm install
npm run fetch
```

`npm run fetch` downloads the pinned URL, writes `artifacts/agent.original.js`, and compares the hash
against `agent/pin.json`. A mismatch means the tenant has shipped a new build: snapshot the current
map with `npm run diff -- --save <label>` before regenerating anything, then read the diff.

## Rebuild everything

```bash
npm run all
```

That is `fetch`, then `deobfuscate` (`libs`, `vaults`, `clean`, `worker`, `verify`), then `map`
(`signals`, `slice`, `envelope`, `endpoints`, `codes`, `join`, `schema`, `collector`, `spy`). It
needs network access for `fetch` and `libs` and nothing else; `harvest` is optional because
`tools/data/browser-names.json` ships with the harvested names.

Expected output on the pinned build:

| step | result |
| --- | --- |
| `vaults` | 32 tables found, 32 decoded |
| `clean` | 1,415 wrappers folded, 481 vault strings inlined, 0 hashes unresolved |
| `verify` | PASS, 32 of 32 tables match, 0 identifiers introduced |
| `signals` | 143 signals, 4 truncated, 18 branchless |
| `slice` | 143 slices, 198 owned helpers inlined |
| `codes` | 11 codes, 282 sites |
| `join` | 3 captures, 144 ids observed, 58 varying, 0 disagreements |
| `schema` | 154 keys, 546 leaves, 12 digest leaves, 11 session leaves |
| `collector` | 140 collectors, 509 module-level declarations |

## Take your own captures

```bash
npm run capture
```

Serves `http://localhost:8099/?b=<label>`. Open it once per browser. The page loads
`spy/fpspy.js`, imports the stored bundle as a module, calls its exported `start()` and `get()`,
waits 8 seconds for the delayed stages, and posts the capture back to `/save`. Nothing is
reimplemented and nothing is driven through the npm loader: the bytes the rest of the toolchain
analyses are the ones that run.

The tenant answers `403 origin_not_available`, because the demo key is bound to its own site. That
costs nothing: the spy records the request body inside the `fetch` hook, before the call leaves, so
the payload is captured whatever the server thinks of the origin. The only thing lost is the
response, which is a verdict.

Third-party storage entries are dropped on save; `npm run scrub` does the same to a capture taken
earlier.

## Watch a live site instead

```bash
npm run spy
```

Writes `spy/fpspy.js`, a console script to paste into DevTools on any page running the agent. It
hooks `fetch`, `XMLHttpRequest`, `sendBeacon`, `Blob`/`URL.createObjectURL`, `Worker`, the
collector-facing browser APIs, and the `FingerprintJS` global if one appears. See
[`spy/README.md`](../spy/README.md).

## Check the wire half

```bash
npm run profile profiles/mac-chrome.json
node tools/replay.mjs --payload artifacts/profiles/mac-chrome.payload.json --dry
```

`--dry` builds the frame with the agent's own codec and unseals it locally. A round trip that matches
proves the codec extraction has not drifted from the bundle. Everything past `--dry` sends real
requests to a real tenant; [09-toolchain](09-toolchain.md) covers those tools and
[08-not-determined](08-not-determined.md) covers what a server verdict from them is worth.

## Run the collectors without the agent

```bash
python3 -m http.server 8123
open http://127.0.0.1:8123/collector/index.html
```

`collector/fp-collect.js` is the agent's own collectors with the protection layers folded away. On
the machine used here it reports the same status code as the Chrome capture for 132 of the 140
collectors; the eight that differ are the WebRTC pair, which needs the tenant's TURN credentials,
and six signals whose result depends on page origin and browser state.
