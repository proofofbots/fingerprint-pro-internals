// s2 — sig_s2_browserLanguage
// module cm, stage3, codes 0
//
// measures
//   navigator.browserLanguage navigator.languages.split(",") navigator.systemLanguage
//   navigator.userLanguage window.MediaSettingsRange window.Reflect window.RTCEncodedAudioFrame
//   navigator.language window.Intl navigator.languages navigator.webkitPersistentStorage
//   navigator.webkitTemporaryStorage
// engine
//   Array.isArray() undefined
// reported value
//   value
// probes
//   "[object Intl]" "[object Reflect]" "string"
// compares against
//   == "[object Intl]" == "[object Reflect]" == "string" === 0 >= 3 >= 5 in "BatteryManager"
//   in "MediaSettingsRange" in "RTCEncodedAudioFrame" in "webkitMediaStream"
//   in "webkitPersistentStorage" in "webkitResolveLocalFileSystemURL" in "webkitSpeechGrammar"
//   in "webkitTemporaryStorage"
// decides on
//   h_s2_browserLanguage: language !== undefined
//   h_s2_browserLanguage: Array.isArray(navigator.languages)
//   h_s2_browserLanguage: !(fn11() && function () { return fn9([!("MediaSettingsRange" in window), "RTCEncodedAudioFrame" in window, "" + window.Intl == "[object Intl]", "" + window.Refl…
//   h_s2_browserLanguage: fn9([!("MediaSettingsRange" in window), "RTCEncodedAudioFrame" in window, "" + window.Intl == "[object Intl]", "" + window.Reflect == "[object Reflect]"]) >= 3
//   h_s2_browserLanguage: typeof navigator.languages == "string"
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//   fn11: fn9(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, (navigator.vendor || "").indexOf("Google") === 0, "webkitResolveLocalFileSys…
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn11:419 fn129:6642 fn40:1892 fn85:4641 fn88:4712 fn9:252

// agent.clean.js:2259
const h_s2_browserLanguage = function () {
    const v365 = [],
      language =
        navigator.language ||
        navigator.userLanguage ||
        navigator.browserLanguage ||
        navigator.systemLanguage;
    if (language !== undefined) {
      v365.push([language]);
    }
    if (Array.isArray(navigator.languages)) {
      if (!(
        fn11() &&
        (function () {
          return (
            fn9([
              !("MediaSettingsRange" in window),
              "RTCEncodedAudioFrame" in window,
              "" + window.Intl == "[object Intl]",
              "" + window.Reflect == "[object Reflect]",
            ]) >= 3
          );
        })()
      )) {
        v365.push(navigator.languages);
      }
    } else if (typeof navigator.languages == "string") {
      const languages = navigator.languages;
      if (languages) {
        v365.push(languages.split(","));
      }
    }
    return v365;
  };

// agent.clean.js:5990
const sig_s2_browserLanguage = fn85(h_s2_browserLanguage);
