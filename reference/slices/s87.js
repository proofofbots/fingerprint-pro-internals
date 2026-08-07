// s87 — sig_s87_hidden
// module cm, stage2, codes 0 -101
//
// measures
//   DOMException document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange") document.hidden clearTimeout() setTimeout()
// engine
//   Object.keys() Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error undefined
// reported value
//   null value
// probes
//   "Shared iframe is not available" "ab" "ac" "aca" "act" "at" "aw" "bb" "bf" "bh" "bs" "bt" "div"
//   "ft" "gt" "ht" "ic" "ict" "lt" "sit" "tdds" "tdf" "tdh" "tdls" "tds" "vt" "w" "wf" "wt"
// compares against
//   === 0 > 0
// decides on
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn66:3854 sharedIframeIsNotAvailable:8819 v10:3418 v11:3419 v12:3420
//   v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:486
function sig_s87_hidden(arg60) {
  return sharedIframeIsNotAvailable((arg61, arg62) => {
    const v101 = {},
      v102 = arg62.document.createElement("div");
    function fn173(arg63) {
      v102.style.color = arg63;
      return arg62.getComputedStyle(v102).color;
    }
    arg62.document.body.appendChild(v102);
    const v103 = {
      AccentColor: "ac",
      AccentColorText: "act",
      ActiveText: "at",
      ActiveBorder: "ab",
      ActiveCaption: "aca",
      AppWorkspace: "aw",
      Background: "b",
      ButtonHighlight: "bh",
      ButtonShadow: "bs",
      ButtonBorder: "bb",
      ButtonFace: "bf",
      ButtonText: "bt",
      FieldText: "ft",
      GrayText: "gt",
      Highlight: "h",
      HighlightText: "ht",
      InactiveBorder: "ib",
      InactiveCaption: "ic",
      InactiveCaptionText: "ict",
      InfoBackground: "ib",
      InfoText: "it",
      LinkText: "lt",
      Mark: "m",
      Menu: "me",
      Scrollbar: "s",
      ThreeDDarkShadow: "tdds",
      ThreeDFace: "tdf",
      ThreeDHighlight: "tdh",
      ThreeDLightShadow: "tdls",
      ThreeDShadow: "tds",
      VisitedText: "vt",
      Window: "w",
      WindowFrame: "wf",
      WindowText: "wt",
      Selecteditem: "si",
      Selecteditemtext: "sit",
    };
    for (const v104 of Object.keys(v103)) {
      v101[v103[v104]] = fn173(v104);
    }
    arg62.document.body.removeChild(v102);
    return { s: 0, v: v101 };
  }, arg60.sis);
}
