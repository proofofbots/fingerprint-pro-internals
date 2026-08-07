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

A capture holds the requests with their raw bytes as sent (`reqRaw`), the in-page decode, the API
call log, the worker messages, the probe counts and a storage snapshot. Third-party storage entries
are dropped on save, and `npm run scrub` does the same to a file taken earlier.

`npm run join` reads every file here and writes `reference/observed.md`. `npm run replay` and
`npm run profile` take one as a donor.
