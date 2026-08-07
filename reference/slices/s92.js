// s92 — sig_s92_createDocumentFragment
// module cm, stage2, codes 0 -101
//
// measures
//   document.createDocumentFragment() document.createElement("math")
//   document.createElement("mmultiscripts") document.createElement() DOMException
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden clearTimeout() setTimeout()
// engine
//   Promise.reject() TypeError JSON.stringify() Promise.race() Promise Error undefined
// reported value
//   null value
// probes
//   "Shared iframe is not available" "bottom" "font-family" "height" "left" "mi" "mprescripts"
//   "mrow" "munderover" "nowrap" "right" "top" "width" "α" "β" "γ" "δ" "ε" "ζ" "η" "θ" "ι" "κ" "λ"
//   "μ" "ν" "ξ" "ο" "π" "ρ" "σ" "τ" "υ" "χ" "ψ" "ω" "ϕ" "ℭ" "∏" "𝔄" "𝔅" "𝔇" "𝔈" "𝔉"
// compares against
//   === 0 > 0
// decides on
//   sharedIframeIsNotAvailable: ip === null
//   sharedIframeIsNotAvailable: fn118(v1118)
//   sharedIframeIsNotAvailable: ipq || aq3.length === 0
//   fn73: v612 in v610
//   fn118: (arg732 instanceof DOMException || arg732 instanceof TypeError) && (v10.test(arg732.message) || v12.test(arg732.message) || v11.test(arg732.message) || v13.test…
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn118:6312 fn158:8266 fn66:3854 fn73:4206 sharedIframeIsNotAvailable:8819 v10:3418 v11:3419
//   v12:3420 v13:3421 v14:3422 visibilitychange:6423

// agent.clean.js:4252
function sig_s92_createDocumentFragment(arg532) {
  const v615 = document.createDocumentFragment(),
    v616 = fn180(v615, "mrow"),
    v617 = fn180(v616, "munderover"),
    v618 = fn180(v617, "mmultiscripts");
  fn180(v618, "mo", "∏");
  const v619 = [
    ["𝔈", "υ", "τ", "ρ", "σ"],
    ["𝔇", "π", "ο", "ν", "ξ"],
    ["𝔄", "δ", "γ", "α", "β"],
    ["𝔅", "θ", "η", "ε", "ζ"],
    ["𝔉", "ω", "ψ", "ϕ", "χ"],
    ["ℭ", "μ", "λ", "ι", "κ"],
  ];
  function fn180(arg533, arg534, arg535 = "") {
    const v620 = document.createElement(arg534);
    v620.textContent = arg535;
    arg533.append(v620);
    return v620;
  }
  function fn181(arg536, arg537, arg538, arg539, arg540) {
    const v621 = document.createElement("mmultiscripts");
    fn180(v621, "mi", arg536);
    fn180(v621, "mi", arg537);
    fn180(v621, "mi", arg538);
    fn180(v621, "mprescripts");
    fn180(v621, "mi", arg539);
    fn180(v621, "mi", arg540);
    return v621;
  }
  for (const v622 of v619) {
    const v623 = fn181(...v622);
    v618.append(v623);
  }
  return sharedIframeIsNotAvailable((arg541, arg542) => {
    const v624 = document.createElement("math");
    v624.style.whiteSpace = "nowrap";
    v624.append(v615);
    arg542.document.body.append(v624);
    const v625 = fn73(v624, arg542);
    arg542.document.body.removeChild(v624);
    return { s: 0, v: v625 };
  }, arg532.sis);
}
