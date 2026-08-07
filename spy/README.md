# fpspy

A console script that instruments the Fingerprint agent on any page it runs on. Paste
`fpspy.js` into the DevTools console. It works whether the agent has already loaded, is loading, or
has not been injected yet.

Regenerate with `npm run spy` after editing `tools/fpspy.src.js`. The generator's one job is to
inline the signal-id labels from `reference/signals.json` so a decoded payload is readable.

## What it hooks

`fetch`, `XMLHttpRequest`, `sendBeacon`, `Blob` and `URL.createObjectURL`, `Worker`, the
collector-facing browser APIs, and the `FingerprintJS` global if one appears. The global's `load()`
gets `debug: true` forced on, which turns on the agent's own request and response logger.

## API

```js
__fpspy.dump()        // console report: request table, api events, workers, storage, probe counts
__fpspy.payloads()    // decoded request bodies, newest last
__fpspy.signals(p)    // flatten a payload's {s,v} pairs to id / label / status / value rows
__fpspy.probes()      // API call counts, most-called first
__fpspy.storage()     // local, session, cookie and indexedDB snapshot, framed values decoded
__fpspy.decode(x)     // decode a base64 string or byte array by hand
__fpspy.deepProps()   // also trace navigator and screen property reads
__fpspy.save()        // download the whole capture as JSON
__fpspy.stop()        // restore every original
```

The point of it is the request body. The agent frames every POST as
`[R] [tag[0]+R] [tag[1]+R] [padLen+R] [pad] [key] [payload ^ key]`, all bytes mod 256, tag `3,13` for
a plain body and `3,14` for a deflate-raw compressed one. The script brute-forces the key length
against a JSON-shaped result, so a change to the tag or key size does not break it. The same framing
with a 7-byte key holds the `<prefix>lr` entry in `localStorage`, which `__fpspy.storage()` decodes as
well.

Third-party traffic is filtered by host and path rather than by the whole URL, because analytics
beacons carry `Fingerprint` in their query strings and a substring match logs all of them. Anything
whose body unframes is captured regardless of host, which is what catches a customer proxying the
endpoint under their own domain. `__fpspy.opts.all = true` logs everything.

## Detectability

`Function.prototype.toString` is patched to return the original source for every wrapper, so the
hooks survive a source check. They are still detectable: a `Function.prototype.toString` that is not
itself native is the obvious tell. `deepProps()` is worse, because it replaces property descriptors
on `navigator` and `screen`, which is exactly what `s118`, `s162` and `s166` look at. The default is
method wraps only.
