// s68 — sig_s68_audioBuffer
// module cm, stage3, codes 0
//
// measures
//   window.AudioBuffer window.PushManager window.ServiceWorker navigator.geolocation
//   window.RTCPeerConnection
// reported value
//   value
// compares against
//   >= 3 in "AudioBuffer" in "PushManager" in "RTCPeerConnection" in "ServiceWorker"
//   in "geolocation"
// decides on
//   fn140: fn36([!("PushManager" in window), !("AudioBuffer" in window), !("RTCPeerConnection" in window), !("geolocation" in navigator), !("ServiceWorker" in window)]) >=…
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn140:7174 fn36:1793 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:6103
const sig_s68_audioBuffer = fn85(fn140);
