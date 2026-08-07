# Signal map diff

`signals-2026-07-31-jsl4.0.0.json` to `signals.json`: 0 added, 0 removed, 56 changed.

Compares the generated map, not the bundle, so a change here is a change in what the agent
measures or reports — not a change in how it was minified. Save a baseline before pulling a new
agent with `npm run diff -- --save`.

## Changed

### s94 — `sig_s94_webkitRTCPeerConnection`

- 1 new tests, 1 gone

### s167 — `sig_s167_atob`

- new codes -6
- compares against `=== -1`
- 3 new tests, 0 gone

### s52 — `sig_s52_origin`

- value shape `value`
- compares against `=== 0` `>= 3` `>= 4` `in "ApplePayError"`
- 12 new tests, 6 gone

### s26 — `sig_s26_mediaDevices`

- 0 new tests, 2 gone

### s20 — `sig_s20_hidden`

- compares against `=== 0`
- 1 new tests, 2 gone

### s36 — `sig_s36_div`

- 2 new tests, 2 gone

### s51 — `sig_s51_iframe`

- 5 new tests, 5 gone

### s21 — `sig_s21_domRectList`

- compares against `=== 0` `>= 4` `in "ApplePayError"` `in "CSSPrimitiveValue"`
- 8 new tests, 7 gone

### s154 — `sig_s154_brave`

- 2 new tests, 2 gone

### s23 — `sig_s23_clipboardItem`

- 1 new tests, 1 gone

### s29 — `sig_s29`

- 1 new tests, 3 gone

### s84 — `sig_s84_hidden`

- compares against `=== 0`
- 1 new tests, 1 gone

### s85 — `sig_s85_blob`

- no longer reads `TextEncoder`
- value shape `value`
- 6 new tests, 7 gone

### s89 — `sig_s89_storage`

- renamed `sig_s89_hidden` to `sig_s89_storage`
- reads `navigator.storage`, `navigator.storage.getDirectory`, `navigator.storage.getDirectory()`
- no longer reads `navigator`, `TextEncoder`
- 1 new tests, 5 gone

### s17 — `sig_s17_canvas`

- 1 new tests, 1 gone

### s87 — `sig_s87_hidden`

- compares against `=== 0`
- 1 new tests, 1 gone

### s92 — `sig_s92_createDocumentFragment`

- compares against `=== 0`
- 1 new tests, 1 gone

### s93 — `sig_s93_hidden`

- compares against `=== 0`
- 1 new tests, 1 gone

### s204 — `sig_s204_hidden`

- compares against `=== 0`
- 1 new tests, 1 gone

### s206 — `sig_s206_style`

- compares against `=== 0`
- 2 new tests, 2 gone

### s210 — `sig_s210_gpu`

- renamed `sig_s210_style` to `sig_s210_gpu`
- reads `navigator.gpu`, `navigator.gpu.requestAdapter()`
- no longer reads `navigator`
- 1 new tests, 1 gone

### s158 — `sig_s158_hidden`

- compares against `=== 0`
- 1 new tests, 1 gone

### s152 — `sig_s152_hidden`

- compares against `=== 0`
- 1 new tests, 1 gone

### s163 — `sig_s163_applePayError`

- 3 new tests, 3 gone

### s160 — `sig_s160_origin`

- compares against `=== 0` `>= 3` `>= 4` `in "ApplePayError"`
- 12 new tests, 6 gone

### s70 — `sig_s70_textDecoder`

- reads `navigator.gpu.requestAdapter()`
- no longer reads `navigator`
- value shape `value`

### s214 — `sig_s214_storageBuckets`

- renamed `sig_s214_hidden` to `sig_s214_storageBuckets`
- reads `navigator.storageBuckets`, `navigator.storageBuckets.delete`, `navigator.storageBuckets.delete()`, `navigator.storageBuckets.open`
- no longer reads `navigator`
- 5 new tests, 6 gone

### s216 — `sig_s216_managed`

- renamed `sig_s216_getRandomValues` to `sig_s216_managed`
- reads `navigator.managed`, `navigator.managed.getManagedConfiguration`, `navigator.managed.getManagedConfiguration()`
- no longer reads `navigator`
- 5 new tests, 5 gone

### s222 — `sig_s222_keyboard`

- renamed `sig_s222` to `sig_s222_keyboard`
- reads `navigator.keyboard`, `navigator.keyboard.getLayoutMap`, `navigator.keyboard.getLayoutMap()`
- no longer reads `navigator`, `TextEncoder`
- 1 new tests, 4 gone

### s223 — `sig_s223_presentationRequest`

- no longer reads `TextEncoder`
- value shape `value`
- 0 new tests, 3 gone

### s22 — `sig_s22_webAssembly`

- renamed `sig_s22` to `sig_s22_webAssembly`
- reads `window.WebAssembly`, `window.WebAssembly.validate`, `window.WebAssembly.validate()`
- no longer reads `window`, `TextEncoder`
- 2 new tests, 6 gone

### s30 — `sig_s30_doNotTrack`

- renamed `sig_s30` to `sig_s30_doNotTrack`
- reads `navigator.doNotTrack`
- no longer reads `navigator`, `TextEncoder`
- 1 new tests, 4 gone

### s33 — `sig_s33_brave`

- renamed `sig_s33_braveEthereum` to `sig_s33_brave`
- reads `Navigator.prototype.brave`, `Navigator.prototype.connection`, `Navigator.prototype`
- no longer reads `Navigator`, `TextEncoder`
- 1 new tests, 4 gone

### s49 — `sig_s49`

- 1 new tests, 1 gone

### s50 — `sig_s50_performance`

- 1 new tests, 1 gone

### s61 — `sig_s61_webkitPersistentStorage`

- 1 new tests, 1 gone

### s62 — `sig_s62_applePayError`

- 1 new tests, 1 gone

### s63 — `sig_s63_ongestureend`

- 1 new tests, 1 gone

### s64 — `sig_s64_style`

- 1 new tests, 1 gone

### s65 — `sig_s65_audio`

- 2 new tests, 2 gone

### s72 — `sig_s72`

- compares against `=== "client_timeout"`
- 1 new tests, 1 gone

### s2 — `sig_s2_browserLanguage`

- 3 new tests, 3 gone

### s15 — `sig_s15_webkitRequestFullscreen`

- 4 new tests, 4 gone

### s39 — `sig_s39_forcedColors`

- 2 new tests, 1 gone

### s42 — `sig_s42_minMonochrome`

- 0 new tests, 1 gone

### s43 — `sig_s43_prefersReducedMotion`

- 1 new tests, 2 gone

### s86 — `sig_s86_removeItem`

- renamed `sig_s86_onafterprint` to `sig_s86_removeItem`
- reads `window.localStorage.removeItem("test")`, `window.localStorage.setItem("test")`, `window.localStorage`
- 1 new tests, 1 gone

### s96 — `sig_s96_audioContext`

- 3 new tests, 3 gone

### s201 — `sig_s201_srChannelCount`

- 1 new tests, 1 gone

### s157 — `sig_s157`

- 0 new tests, 1 gone

### s144 — `sig_s144_sharedArrayBuffer`

- 1 new tests, 1 gone

### s162 — `sig_s162_languages`

- renamed `sig_s162` to `sig_s162_languages`
- reads `navigator.languages`
- no longer reads `navigator`, `TextEncoder`
- 2 new tests, 5 gone

### s165 — `sig_s165_event`

- no longer reads `TextEncoder`
- 1 new tests, 4 gone

### s203 — `sig_s203_createElement`

- no longer reads `TextEncoder`
- value shape `value`
- 0 new tests, 3 gone

### s74 — `sig_s74_canvas`

- new codes -1 -2

### s75 — `sig_s75_canvas`

- new codes -1 -2
