// s20 — sig_s20_hidden
// module cm, stage2, codes 0 -101
//
// measures
//   DOMException document.removeEventListener("visibilitychange")
//   document.addEventListener("visibilitychange") document.hidden clearTimeout() setTimeout()
// engine
//   Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error undefined
// reported value
//   value
// probes
//   "0" "48px" "ARNO PRO" "Agency FB" "Arabic Typesetting" "Arial Unicode MS" "AvantGarde Bk BT"
//   "BankGothic Md BT" "Batang" "Bitstream Vera Sans Mono" "Calibri" "Century" "Century Gothic"
//   "Clarendon" "EUROSTILE" "Franklin Gothic" "Futura Bk BT" "Futura Md BT" "GOTHAM" "Gill Sans"
//   "HELV" "Haettenschweiler" "Helvetica Neue" "Humanst521 BT" "Leelawadee" "Letter Gothic"
//   "Levenim MT" "Lucida Bright" "Lucida Sans" "MS Mincho" "MS Outlook" "MS Reference Specialty"
//   "MS UI Gothic" "MT Extra" "MYRIAD PRO" "Marlett" "Meiryo UI" "Menlo" "Microsoft Uighur"
//   "Minion Pro" "Monotype Corsiva" "PMingLiU" "Pristina" "SCRIPTINA" "Segoe UI Light" "Serifa"
//   "SimHei" "Small Fonts" "Staccato222 BT" "TRAJAN PRO" "Univers CE 55 Medium" "Vrinda" "ZWAdobeF"
//   "absolute" "div" "important" "mmMwWLliI0O&1" "monospace" "sans-serif" "sans-serif-thin" "serif"
//   "span"
// compares against
//   === 0 > 0
// decides on
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn66:3854 sharedIframeIsNotAvailable:8819 v10:3418 v11:3419 v12:3420
//   v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:150
function h_s20_fn(arg18) {
  return sharedIframeIsNotAvailable((arg19, { document: arg20 }) => {
    const body = arg20.body;
    body.style.fontSize = "48px";
    const element = arg20.createElement("div");
    element.style.setProperty("visibility", "hidden", "important");
    const v53 = {},
      v54 = {},
      v55 = (arg21) => {
        const v60 = arg20.createElement("span"),
          { style: style } = v60;
        style.position = "absolute";
        style.top = "0";
        style.left = "0";
        style.fontFamily = arg21;
        v60.textContent = "mmMwWLliI0O&1";
        element.appendChild(v60);
        return v60;
      },
      v56 = (arg22, arg23) => v55(`'${arg22}',${arg23}`),
      v57 = h_s20_monospaceList.map(v55),
      v58 = (() => {
        const v61 = {};
        for (const v62 of h_s20_sansSerifThinList) {
          v61[v62] = h_s20_monospaceList.map((arg24) => v56(v62, arg24));
        }
        return v61;
      })();
    body.appendChild(element);
    for (let v63 = 0; v63 < h_s20_monospaceList.length; v63++) {
      v53[h_s20_monospaceList[v63]] = v57[v63].offsetWidth;
      v54[h_s20_monospaceList[v63]] = v57[v63].offsetHeight;
    }
    const v59 = h_s20_sansSerifThinList.filter((arg25) => {
      v64 = v58[arg25];
      return h_s20_monospaceList.some(
        (arg26, arg27) =>
          v64[arg27].offsetWidth !== v53[arg26] || v64[arg27].offsetHeight !== v54[arg26],
      );
      var v64;
    });
    body.removeChild(element);
    body.style.fontSize = "";
    return { s: 0, v: v59 };
  }, arg18.sis);
}

// agent.clean.js:4884
async function sig_s20_hidden(arg614) {
  return await h_s20_fn(arg614);
}

// agent.clean.js:6138
const h_s20_monospaceList = ["monospace", "sans-serif", "serif"];

// agent.clean.js:6139
const h_s20_sansSerifThinList = [
    "sans-serif-thin",
    "ARNO PRO",
    "Agency FB",
    "Arabic Typesetting",
    "Arial Unicode MS",
    "AvantGarde Bk BT",
    "BankGothic Md BT",
    "Batang",
    "Bitstream Vera Sans Mono",
    "Calibri",
    "Century",
    "Century Gothic",
    "Clarendon",
    "EUROSTILE",
    "Franklin Gothic",
    "Futura Bk BT",
    "Futura Md BT",
    "GOTHAM",
    "Gill Sans",
    "HELV",
    "Haettenschweiler",
    "Helvetica Neue",
    "Humanst521 BT",
    "Leelawadee",
    "Letter Gothic",
    "Levenim MT",
    "Lucida Bright",
    "Lucida Sans",
    "Menlo",
    "MS Mincho",
    "MS Outlook",
    "MS Reference Specialty",
    "MS UI Gothic",
    "MT Extra",
    "MYRIAD PRO",
    "Marlett",
    "Meiryo UI",
    "Microsoft Uighur",
    "Minion Pro",
    "Monotype Corsiva",
    "PMingLiU",
    "Pristina",
    "SCRIPTINA",
    "Segoe UI Light",
    "Serifa",
    "SimHei",
    "Small Fonts",
    "Staccato222 BT",
    "TRAJAN PRO",
    "Univers CE 55 Medium",
    "Vrinda",
    "ZWAdobeF",
  ];
