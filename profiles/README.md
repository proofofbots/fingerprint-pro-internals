# profiles

Input profiles for `npm run profile`. A profile is a patch over a donor capture, not a specification
of 144 fields: about forty knobs map onto the wire positions that carry them, and a knob left out
writes nothing, so the donor's value stands.

`mac-chrome.json` is the Chrome capture in `captures/` read back through the knob map, which is what
`--template` produces. It compiles to a payload the demo tenant accepts and identifies.

```bash
node tools/profile.mjs --template --donor chrome > profiles/mine.json
node tools/profile.mjs profiles/mine.json
node tools/replay.mjs --payload artifacts/profiles/mine.payload.json --dry
```

Compiled payloads and their reports land in `artifacts/profiles/`, which is not committed. The
coherence rules that run over a compiled payload, and what `fail` and `warn` mean there, are in
[09-toolchain](../docs/09-toolchain.md).

Every capture in this tree is macOS, so a profile for another OS carries macOS values in every
position no knob covers. [08-not-determined](../docs/08-not-determined.md) lists which ones.
