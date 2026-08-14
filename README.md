<p align="center">
  <img src="docs/logo.svg" alt="Fingerprint Pro Internals" width="420" />
</p>

<h3 align="center">The complete, documented teardown of the Fingerprint Pro v4 browser agent</h3>

<p align="center">
  Every signal it collects, named and explained. The obfuscation removed and the source published.
  The wire format, the identity model and the tooling to reproduce all of it.
</p>

<p align="center">
  <b><a href="docs/index.html">Documentation site</a></b> ·
  <b><a href="docs/explorer.html">Live signal explorer</a></b> ·
  <a href="reference/signals.md">Signal map</a> ·
  <a href="reference/slices/">Collector sources</a> ·
  <a href="docs/01-architecture.md">Guide</a>
</p>

---

Fingerprint Pro is the commercial browser fingerprinting service behind `fpjs.io`. Its agent ships
as an obfuscated bundle: CRC32 constants instead of property names, four encrypted string tables,
operator wrappers over every expression, and a binary wire format that hides what leaves your
browser. This repository is that agent taken apart, and what came out of it written down.

**What is in here**

- **All 143 wire signals, documented.** One row per signal id with the browser surfaces it touches,
  the status codes it can return, the constants it compares against and the shape of the value it
  reports. Canvas, WebGL, WebGPU with timestamp queries, audio, fonts, speech voices, DRM key
  systems, the automation and tamper probes, the engine discriminators, the full media-query
  battery. [`reference/signals.md`](reference/signals.md)
- **The deobfuscated agent.** The shipped program with the CRC32 property lookups resolved, the
  string vaults decrypted and inlined, the operator wrappers folded and every binding renamed.
  Pinned to the hash of the original so it can be checked against the real bundle.
  [`agent/`](agent/)
- **The source of every collector, on its own page.** 143 files, each carrying one collector plus
  every helper only that collector can reach, so you can read what a single signal does without
  opening a 200 KB bundle. [`reference/slices/`](reference/slices/)
- **The collectors as a runnable module.** `fp-collect.js` exports `collect`, `buildPayload`,
  `frame` and `send`: the agent's own measurement code, callable from a page or a console, with no
  agent and no network. [`collector/`](collector/)
- **The wire format, end to end.** JSON to bytes, deflate-raw over 1024 bytes, sealed with a key
  that ships inside the frame. A codec that opens and rebuilds real frames from Node.
  [`03-wire-format`](docs/03-wire-format.md)
- **What the visitor id is actually a function of.** Paired sends against a live tenant: which
  fields break an identity match on their own, how much drift the server absorbs, and why `s56` is
  a bearer token rather than a fingerprint. [`06-identity`](docs/06-identity.md)
- **Captures and evidence.** Chrome, Firefox and Safari runs of the same pinned build, the raw rows
  behind every claim, and the tools that produced them. Nothing here is asserted without the file
  that shows it.
- **A live explorer.** A page that runs those 143 collectors against your own browser and shows what
  each one measured under readable names, with a JSON tree per signal. It sends nothing.

Everything the analysis does **not** establish is written down too, in
[08-not-determined](docs/08-not-determined.md).

## The site

The whole repository is also published as a browsable site: the guide, every generated map as a
filterable table, all 143 collector sources syntax highlighted, and the live explorer. `npm run
site` builds it into [`docs/`](docs/), which is what GitHub Pages serves. Open `docs/index.html`
over HTTP locally, or point Pages at `main` and `/docs`.

## Quickstart

```bash
npm install
npm run fetch      # download the pinned bundle, verify its hash
npm run all        # deobfuscate, verify, regenerate every map
npm run site       # rebuild the documentation site into docs/
npm run capture    # serve the capture page, open it once per browser
```

To read rather than run, start at [`reference/signals.md`](reference/signals.md) for the inventory
and [`reference/slices/`](reference/slices/) for the code behind any single signal.

To watch the agent on a live site, paste [`spy/fpspy.js`](spy/fpspy.js) into DevTools.

To run the collectors with no agent and no network, serve the repository and open
[`collector/index.html`](collector/index.html) for the raw table, or `docs/explorer.html` for the
explorer.

Everything here describes one pinned build: `jsl/4.0.0`, sha256 `250c7dfe…`, fetched 2026-08-07. The
tenant ships new builds and the paths rotate. `npm run fetch` checks the pin and `npm run diff` says
what changed.

## Layout

| directory | what is in it |
| --- | --- |
| [`docs/`](docs/) | the writeup, plus the generated site GitHub Pages serves |
| [`agent/`](agent/) | the deobfuscated bundle and worker, the decrypted string tables, the pin |
| [`reference/`](reference/) | generated maps: signals, slices, schema, envelope, codes, endpoints, observed |
| [`collector/`](collector/) | `fp-collect.js`, the collectors and codec as one plain module |
| [`site/`](site/) | source of the generated site |
| [`spy/`](spy/) | the DevTools instrumentation script |
| [`captures/`](captures/) | three browser captures of the pinned build |
| [`profiles/`](profiles/) | a device profile that compiles to a payload |
| [`evidence/`](evidence/) | raw rows behind the identity and attribution findings |
| [`tools/`](tools/) | the toolchain, one job per file |
| `artifacts/` | everything generated that is not committed |

## What the analysis found

- Both protection layers come apart offline. Property names are CRC32 constants over DOM
  identifiers, which a dictionary resolves; the four string tables that key off live browser state
  key off property *names*, which the same dictionary already recovers.
  [02-obfuscation](docs/02-obfuscation.md)
- The agent names its own signals. Each module registers a `sources` table mapping the wire id to the
  collector, so the map is the agent's labels, not assigned ones. 143 ids, 4 of them scheduled first
  because they are slow. [01-architecture](docs/01-architecture.md), [04-collection](docs/04-collection.md)
- The wire format is JSON over bytes, deflate-raw over 1024 bytes, then framed with a key that ships
  inside the frame. [03-wire-format](docs/03-wire-format.md)
- `s56`, the blob the server issues over the GET leg and the client replays, is a bearer token. Any
  payload carrying a bound one answers as that visitor whatever the device reports. With it empty,
  seven fields break the identity match on their own, and the rest hold until six groups of them move
  at once. [06-identity](docs/06-identity.md)
- Across Chrome, Firefox and Safari on one machine, 58 of the 143 signals report a different value
  and the remaining 85 are identical. The static read and the captures disagree nowhere.
  [04-collection](docs/04-collection.md)

## Docs

1. [Architecture](docs/01-architecture.md) — modules, stages, worker, request legs, symbol table
2. [Protection layers](docs/02-obfuscation.md) — CRC32 names, encrypted tables, what the passes do
3. [Wire format](docs/03-wire-format.md) — codec, frame, envelope, request path
4. [What the agent collects](docs/04-collection.md) — the signal inventory and how to read it
5. [Status codes](docs/05-status-codes.md) — the 11 codes and what they mean
6. [Identity](docs/06-identity.md) — what `visitor_id` is a function of
7. [Reproducing](docs/07-reproducing.md) — the pinned target and every command
8. [Not determined](docs/08-not-determined.md) — the limits of all of the above
9. [Toolchain](docs/09-toolchain.md) — every tool, flag by flag

## Scope

The shipped bundle is not redistributed here. `agent/agent.clean.js` is derived work: the same
program with the obfuscation removed and every binding renamed. `agent/pin.json` carries the hash of
the original so anyone can fetch it and check.

The captures and evidence files are runs against Fingerprint's own public demo tenant with its public
API key. Third-party storage entries, proxy sessions and IP addresses are stripped before anything
lands in the tree, and the stored frames are rebuilt from the published payloads rather than kept as
sent.

## License and contact

Public domain, [Unlicense](LICENSE). Use it however you like, anywhere, commercially or not, with no
attribution required.

"Fingerprint" and the fingerprint mark are trademarks of Fingerprint. This project is unofficial and
not affiliated with, endorsed by or supported by them, and the logo above is a derivative of their
mark used to identify what is documented here.

Contact, including takedown and legal enquiries: proofofbot@pm.me
