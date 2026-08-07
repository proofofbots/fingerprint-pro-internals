# fingerprint-pro-internals

What the Fingerprint Pro v4 browser agent measures, how it hides it, and what the server does with
the result. The repository carries the deobfuscated agent, a generated map of all 143 signals, the
tooling that produces both from the shipped bundle, and a standalone script that runs the agent's own
collectors with the obfuscation folded away.

Everything here describes one pinned build: `jsl/4.0.0`, sha256 `250c7dfe…`, fetched 2026-08-07. The
tenant ships new builds and the paths rotate. `npm run fetch` checks the pin and `npm run diff` says
what changed.

## Quickstart

```bash
npm install
npm run fetch      # download the pinned bundle, verify its hash
npm run all        # deobfuscate, verify, regenerate every map
npm run capture    # serve the capture page, open it once per browser
```

To look at the signals without running anything, start at
[`reference/signals.md`](reference/signals.md) (one row per wire id) and
[`reference/slices/`](reference/slices/) (one file per wire id, the collector's own source).

To watch the agent on a live site, paste [`spy/fpspy.js`](spy/fpspy.js) into DevTools.

To run the collectors with no agent and no network, serve the repository and open
[`collector/index.html`](collector/index.html).

## Layout

| directory | what is in it |
| --- | --- |
| [`docs/`](docs/) | the writeup: architecture, protection layers, wire format, signals, identity |
| [`agent/`](agent/) | the deobfuscated bundle and worker, the decrypted string tables, the pin |
| [`reference/`](reference/) | generated maps: signals, slices, schema, envelope, codes, endpoints, observed |
| [`collector/`](collector/) | `fp-collect.js`, the collectors and codec as one plain module |
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

Everything the analysis does not establish is in [08-not-determined](docs/08-not-determined.md).

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
lands in the tree.
