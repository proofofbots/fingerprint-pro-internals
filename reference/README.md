# reference

Generated maps. Every file here is rebuilt by `npm run map` from `agent/agent.clean.js` and the
captures; none of it is written by hand.

| file | one row per | built by |
| --- | --- | --- |
| `signals.md`, `signals.json` | wire signal id: surfaces, branch tests, constants, status codes, value shape | `npm run signals` |
| `slices/` | wire signal id: the collector's source and every helper only it can reach | `npm run slice` |
| `schema.md`, `schema.json` | wire key and addressable leaf: types, observed values, digest and session labels | `npm run schema` |
| `envelope.md`, `envelope.json` | non-signal wire key: the expression that builds it | `npm run envelope` |
| `codes.md`, `codes.json` | status code: every site that can produce it, with the agent's own message | `npm run codes` |
| `endpoints.md`, `endpoints.json` | the request path rule, plus one capture's observed sequence | `npm run endpoints` |
| `observed.md`, `observed.json` | wire id: what Chrome, Firefox and Safari sent, and where that disagrees with the static read | `npm run join` |
| `diff.md`, `diff.json` | signal that changed between two saved maps | `npm run diff` |
| `baselines/` | a saved `signals.json`, one per build worth comparing to | `npm run diff -- --save` |

Start with `signals.md` for what a signal measures and `slices/<id>.js` for the code that measures
it. A slice is source text, not a program: it is cut out of the cleaned bundle and still refers to
the globals, string tables and shared helpers that live there.
