<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="docs/logo.svg" />
    <img src="docs/logo.svg" alt="Fingerprint Pro Internals" width="420" />
  </picture>
</p>

<h3 align="center">Fingerprint Pro v4, deobfuscated and documented</h3>

<p align="center">
  <b>143 signals named. The bundle unpacked. The wire format decoded.</b>
</p>

<p align="center">
  <b><a href="docs/explorer.html">Run it on your browser</a></b> ·
  <b><a href="docs/index.html">Read the docs</a></b> ·
  <a href="reference/signals.md">Signal map</a> ·
  <a href="reference/slices/">Collector sources</a>
</p>

---

`fpjs.io` ships its agent as an obfuscated bundle: CRC32 constants instead of property names, four
encrypted string tables, operator wrappers over every expression, and a binary wire format. This is
that agent taken apart.

| | |
| --- | --- |
| [**143 signals, one row each**](reference/signals.md) | surfaces touched, status codes, constants compared, value shape |
| [**The agent, readable**](agent/) | CRC32 names resolved, tables decrypted, wrappers folded, bindings renamed, hash-pinned |
| [**Every collector as its own file**](reference/slices/) | one signal plus only the helpers it reaches, instead of a 200 KB bundle |
| [**The collectors, runnable**](collector/) | `collect`, `buildPayload`, `frame`, `send` from a console. No agent, no network |
| [**Wire format, end to end**](docs/03-wire-format.md) | JSON to bytes, deflate-raw over 1024, sealed with a key that ships inside the frame |
| [**What `visitor_id` is a function of**](docs/06-identity.md) | 7 fields break a match alone, `s56` is a bearer token, not a fingerprint |

Chrome, Firefox and Safari captures of the same pinned build back every claim, and the limits are
written down in [08-not-determined](docs/08-not-determined.md).

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
