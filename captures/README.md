# captures

Three runs of the pinned build, one per browser, taken on 2026-08-07 on the same macOS machine
through `npm run capture`.

| file | browser | requests | signal ids on the wire |
| --- | --- | --- | --- |
| `chrome-2026-08-07T16-01-51-717Z.json` | Chrome 149 | 2 | 144 |
| `firefox-2026-08-07T15-59-37-104Z.json` | Firefox 151 | 2 | 144 |
| `safari-2026-08-07T16-00-02-124Z.json` | Safari 26.4.1 | 16 | 144 |

Safari's sixteen requests are the retry queue: the demo tenant rejects a `localhost` origin, so the
agent posted the same frame seven times and re-fetched the GET leg between attempts.

A capture holds the requests with their frame bytes (`reqRaw`), the in-page decode, the API call
log, the worker messages, the probe counts and a storage snapshot. Third-party storage entries are
dropped on save, and `npm run scrub` does the same to a file taken earlier.

The frames in the files here were rebuilt rather than kept as sent: `npm run scrub -- --reseal`
re-encodes each request's decoded payload with the agent's own codec and writes the result back to
`reqRaw`, so opening a frame gives the same values the file shows in plain text. The frame layout,
the compression threshold and the seal are the agent's, so `node tools/codec.mjs --open` reads them
like any other frame, but the byte-for-byte original request is not published.

`npm run join` reads every file here and writes `reference/observed.md`. `npm run replay` and
`npm run profile` take one as a donor.
