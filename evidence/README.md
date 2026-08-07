# evidence

Raw rows behind the findings in [06-identity](../docs/06-identity.md) and the replay caveats in
[08-not-determined](../docs/08-not-determined.md). Written by `npm run evidence`, which copies runs
out of `artifacts/` and drops every address, proxy session and IP field on the way.

| file | what it holds |
| --- | --- |
| `identity-pairs-*.json` | one paired run: an arm's base payload, the field it changed, the two visitor ids it drew |
| `identity-cache-bind-*.json` | the five sends that answer whether `s56` carries identity between devices |
| `identity-runs.json` | the control run and its summary |
| `distill-report.json` | one attribution run: a baseline verdict and the bundles tested against it |

Read `mode` first. `pairs` is the measurement that matters: each arm mints a device the tenant has
never seen, sends it, sends it again with one field changed, and records `same`. `sticky` asks the
other question, how much an already established visitor absorbs, and its rows are not evidence about
what identity is made of.

`collisions` is the run's own validity check. A run where two arms' first sends landed on the same
visitor measured nothing, and the number says so.

The base payloads these runs were built from are not in the tree. Two of them were compiled from an
internal telemetry row rather than from a capture, so the runs are not reproducible byte for byte;
the same measurement reproduces from any donor capture with `tools/identity.mjs`.
