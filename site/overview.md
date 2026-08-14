What the Fingerprint Pro v4 browser agent measures, how it hides it, and what the server does with
the result. One pinned build, taken apart offline: the deobfuscated bundle, a map of all 143 signals,
the source of every collector, and a page that runs those collectors against your own browser.

<div class="cards">
  <a class="card" href="./explorer.html">
    <div class="kicker">Live</div>
    <b>Signal explorer</b>
    <span>Run the agent's collectors here and read what each one measured, under readable names.</span>
  </a>
  <a class="card" href="./01-architecture.html">
    <div class="kicker">Guide</div>
    <b>How the agent works</b>
    <span>Modules, stages, worker, the two protection layers, the wire format, identity.</span>
  </a>
  <a class="card" href="./reference/signals.html">
    <div class="kicker">Reference</div>
    <b>The signal map</b>
    <span>One row per wire id: the surfaces it touches, the codes it can return, the value shape.</span>
  </a>
  <a class="card" href="./slices/index.html">
    <div class="kicker">Source</div>
    <b>Collector sources</b>
    <span>140 files, one per collector, each with the helpers only that collector reaches.</span>
  </a>
</div>

## The pinned build

Everything here describes `{{version}}`, sha256 `{{sha}}`, fetched {{fetched}}. The tenant ships new
builds and the paths rotate, so a map generated today will not match a bundle pulled next month.
`npm run fetch` checks the pin and `npm run diff` says what changed between two builds.

## What the analysis found

<div class="findings">
  <div class="finding">
    <b>Both protection layers come apart offline</b>
    <span>Property names are CRC32 constants over DOM identifiers, which a dictionary resolves. The
    four string tables that key off live browser state key off property names, which the same
    dictionary already recovers.</span>
  </div>
  <div class="finding">
    <b>The agent names its own signals</b>
    <span>Each module registers a sources table mapping the wire id to the collector, so the map is
    the agent's own labels, not assigned ones. 143 ids, 4 of them scheduled first because they are
    slow.</span>
  </div>
  <div class="finding">
    <b>The wire format is JSON over bytes</b>
    <span>Deflate-raw over 1024 bytes, then framed with a key that ships inside the frame.</span>
  </div>
  <div class="finding">
    <b>s56 is a bearer token</b>
    <span>The blob the server issues over the GET leg and the client replays. Any payload carrying a
    bound one answers as that visitor whatever the device reports.</span>
  </div>
  <div class="finding">
    <b>58 of 143 signals differ across browsers on one machine</b>
    <span>The remaining 85 are identical between Chrome, Firefox and Safari. The static read and the
    captures disagree nowhere.</span>
  </div>
</div>

Everything the analysis does not establish is written down in
[not determined](./08-not-determined.html).

## Where to start

Read the [architecture](./01-architecture.html) first if you want the shape of the program, or go
straight to [what the agent collects](./04-collection.html) if you only care about the signals. The
[wire format](./03-wire-format.html) covers the codec and the envelope, and
[identity](./06-identity.html) covers what the visitor id is actually a function of.

To reproduce any of it, [reproducing](./07-reproducing.html) lists the pinned target and every
command, and [toolchain](./09-toolchain.html) documents each tool flag by flag.

## Scope

The shipped bundle is not redistributed. The deobfuscated agent is derived work: the same program
with the obfuscation removed and every binding renamed, published alongside the hash of the original
so anyone can fetch it and check. The captures and evidence files are runs against Fingerprint's own
public demo tenant with its public API key, with third-party storage entries, proxy sessions and IP
addresses stripped before anything lands in the tree.

The explorer on this site collects locally and sends nothing: no API key ships in the page, no
request leaves it, no visitor id is minted.
