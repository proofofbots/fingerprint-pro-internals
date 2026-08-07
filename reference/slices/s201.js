// s201 — sig_s201_srChannelCount
// module cm, stage3, codes 0
//
// measures
//   Audio.prototype Audio.prototype.srChannelCount Audio.prototype.srLatency Image.prototype
//   navigator.devicePosture window
// reported value
//   value
// probes
//   "getTextInformation" "segments"
// compares against
//   >= 3 in "devicePosture" in "getTextInformation" in "segments" in "srChannelCount" in "srLatency"
// decides on
//   h_s201_srChannelCount: fn9(["srLatency" in v571, "srChannelCount" in v571, "devicePosture" in navigator, visualViewport && "segments" in visualViewport, "getTextInformation" in Image.…
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:3813
function h_s201_srChannelCount() {
  const v571 = Audio.prototype,
    { visualViewport: visualViewport } = window;
  return (
    fn9([
      "srLatency" in v571,
      "srChannelCount" in v571,
      "devicePosture" in navigator,
      visualViewport && "segments" in visualViewport,
      "getTextInformation" in Image.prototype,
    ]) >= 3
  );
}

// agent.clean.js:6104
const sig_s201_srChannelCount = fn85(h_s201_srChannelCount);
