# What visitor_id is a function of

Measured against the public demo tenant by sending payloads from Node with no browser, on
2026-07-31 and 2026-08-01. Every number here comes from a paired experiment: mint a device the
tenant has never seen, send it, send it again with one thing changed, compare the two ids. The raw
rows are in [`evidence/`](../evidence/), with the network identifiers removed.

Two identity mechanisms exist and the first one wins.

1. `s56` is a bearer token. It is a sealed blob the tenant issues over the agent's GET leg and the
   client replays on every POST. Once bound to a visitor, any payload carrying it answers as that
   visitor: different OS, different screen, different everything. The fingerprint is not consulted.
2. With `s56` empty, identity is fuzzy-matched from the payload. Seven fields break the match on
   their own. Everything else sits inside a tolerance that only breaks when enough of it moves at
   once.

The client's IP address is not part of identity. That is what makes `--rotate-ip` free: the ingress
rate-limits per address at around 30 sends, and rotating the exit costs nothing in accuracy.

## Method, and the two ways it goes wrong

The first sweep held one `s56` blob constant across every arm and concluded that nothing mattered:
canvas, WebGL, screen, User-Agent, timezone, all changed with no effect on the id. That was the token
pinning the answer, not tolerance. `--no-cache` empties `s56` on every send and is not optional for
anything measuring the fingerprint.

The second failure mode is history. An established visitor absorbs far more than a new one: sending
30 variants of one device in sequence walks the cluster along with you and reads "same" for
everything. So every arm mints its own device by reseeding the digests from that arm's salt, and each
run asserts that no two arms' first sends landed on the same visitor. The runs quoted here report
zero collisions; a run with collisions measured nothing and says so.

## Fields that break the match on their own

Each measured on separate devices with `s56` empty, twice except `s27`, which was measured once.

| id | what it is | why it is a plausible bucket key |
| --- | --- | --- |
| `s3` | `screen.colorDepth` | display class, tiny value set, stable for the life of the machine |
| `s4` | `navigator.deviceMemory` | hardware class, quantised |
| `s19` | `maxTouchPoints`, `touchEvent`, `touchStart` | desktop against touch device |
| `s24` | `eval.toString().length` | engine family: 33 is V8, 37 is SpiderMonkey and JSC |
| `s27` | `navigator.vendor` | browser vendor |
| `s37` | screen colour gamut | display class |
| `s46` | the hashed audio block | the only high-cardinality member of the set |

The shape of that list reads as a blocking key: low cardinality, hard to change without changing
machine, and mostly not things a User-Agent string can lie about. `s24` and `s27` are engine
intrinsics. The User-Agent itself is not in the set, and neither is `navigator.platform`.

## Fields that do not break the match on their own

Changed one at a time, each on its own minted device, every one of these came back as the same
visitor: both canvas digests (`s17`), the second canvas digest (`s76`), all seven WebGL digests
(`s75`), the unmasked WebGL vendor and renderer strings (`s74`), the speech-voice digest (`s52`), the
detected font list (`s20`), the per-family font metrics (`s51`), the screen box (`s5`, `s84`),
`devicePixelRatio` (`s57`), `hardwareConcurrency` (`s7`), the User-Agent and `appVersion` (`s101`,
`s103`), `navigator.platform` (`s15`), languages (`s2`, `s82`, `s202`), timezone (`s9`), the plugin
and mime table (`s16`), the session uuids (`s216`, `s94.u`, `s219.u`), the storage quota (`s29`),
both `getBoundingClientRect` boxes (`s92`, `s93`), the keyboard layout map (`s222`), battery
(`s217`), the WebAuthn capability table (`s215`), `productSub` (`s123`), the engine-name list
(`s28`), `oscpu` (`s1`), the system font (`s206`), the window boxes (`s150`), the available-screen
insets (`s6`), the client-hint block (`s58`), the WebGL limit vector (`s210.l`), the storage flags
(`s10`, `s11`, `s12`), architecture (`s81`), WebAssembly (`s22`), and `s104`, `s117`, `s135`, `s152`,
`s205`, `s214`.

Canvas is on that list. Changing both canvas digests moves `confidence.score` from 0.99 to about
0.97 and nothing else.

## The tolerance is cumulative and the threshold is sharp

Soft changes applied in a fixed cumulative order, same device, `s56` empty:

| arm | changed | result |
| --- | --- | --- |
| `soft-1` | canvas | same |
| `soft-2` | + all WebGL digests | same |
| `soft-3` | + screen box | same |
| `soft-4` | + User-Agent | same |
| `soft-5` | + languages and timezone | same |
| `soft-6` | + font list and font metrics | same |
| `soft-7` | + `hardwareConcurrency` and `devicePixelRatio` | new visitor |
| `soft-8` | + WebGL strings and plugins | new visitor |

Canvas, every WebGL digest, the screen resolution, the User-Agent, the locale, the timezone and the
whole font profile can move simultaneously and the tenant still calls it the same device. Two more
hardware scalars on top and it does not.

`hardwareConcurrency` and `devicePixelRatio` sent together, with nothing else changed, hold. So
`soft-7` is a threshold crossing rather than a seventh key being tripped, and the threshold sits
between six and seven of these groups. Replicated on separate devices. `all-coarse-soft`, every
coarse attribute except the seven keys, also breaks, which is the same threshold from the other side.

## s56 carries identity between devices

Five sends per run, four runs, in `evidence/identity-cache-bind-*.json`:

1. Device A with `s56` empty mints a visitor from its fingerprint.
2. Device B, a different OS, with `s56` empty mints a different one. Asserted, not assumed.
3. A fresh blob is fetched from the GET leg and sent with A. A keeps its id; the blob is now bound.
4. B sends that same blob and answers as A, `visitor_found: true`, confidence 0.99.

That held in all four runs, in both directions, across macOS and Windows payloads that share no
attribute the matcher cares about. The blob is fetched from an endpoint that takes nothing but the
public API key: no cookie, no fingerprint, no authentication. It is identity-free at issuance and
becomes identity-bearing on first use.

What happens to B afterwards is not settled. In two runs B, sent again with an empty `s56`, kept A's
visitor permanently, so presenting the token once had merged B's fingerprint into A's cluster. In
the other two runs B minted a third id instead. The split tracks direction: a Windows payload
presenting a macOS token kept the identity, a macOS payload presenting a Windows token did not. Four
runs is not enough to call that the mechanism, and the two devices also differ in how much history
their family had, which is not separated.

## Confidence

`confidence.score` is the only continuous readout. A newly minted device reports 1. A device matched
back to itself reports 0.97 to 0.99. Emptying `s56` on an otherwise unchanged device drops it to
0.95. Individual soft changes move it by about 0.02. It never came close to distinguishing a match
from a miss on its own: the id either moved or it did not, and confidence barely twitched either way.

## Reading this as a defender

- Canvas and WebGL randomisation, alone, do not produce a new visitor here. They cost about 0.02 of
  confidence.
- Changing the User-Agent, the screen, the locale and the fonts together also does not produce a new
  visitor.
- What produces a new visitor cheaply is `screen.colorDepth`, `navigator.deviceMemory`, touch
  support, colour gamut, the audio digest, `navigator.vendor` and `eval.toString().length`. The last
  two cannot move without changing engine, which is the point of them.
- Anything holding a bound `s56` is that visitor, whatever else it reports. The blob is issued
  without authentication and accepted from anyone, so it is a bearer token in the ordinary sense.

## Reproducing

```bash
node tools/identity.mjs --payload <payload.json> --no-cache --rotate-ip
node tools/identity.mjs --payload <payload.json> --no-cache \
  --arms none,soft-1,soft-2,soft-3,soft-4,soft-5,soft-6,soft-7
node tools/cache-bind.mjs --a <windows.json> --b <macos.json>
```

Raw rows land in `artifacts/identity/`; `npm run evidence` copies them into `evidence/` with the
addresses removed. These runs send real requests to a real tenant, so read
[08-not-determined](08-not-determined.md) on what a score from them is worth before quoting one.
