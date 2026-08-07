// s22 — sig_s22_webAssembly
// module cm, stage3, codes 0 -1
//
// measures
//   window.WebAssembly window.WebAssembly.validate window.WebAssembly.validate()
// engine
//   Uint8Array.of()
// reported value
//   null value
// decides on
//   !webAssembly?.validate
//   webAssembly.validate(Uint8Array.of(...v601, ...v604))
//
// 0 owned helpers inlined below.

// agent.clean.js:4154
function sig_s22_webAssembly() {
  const webAssembly = window.WebAssembly;
  if (!webAssembly?.validate) {
    return { s: -1, v: null };
  }
  const v601 = [0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10],
    v602 = [
      [9, 1, 7, 0, 65, 0, 253, 15, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [240, 67, 0, 0, 0, 12, 1, 10, 0, 252, 2, 3, 1, 1, 0, 0, 110, 26, 11, 161, 10],
      [6, 1, 4, 0, 18, 0, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [8, 1, 6, 0, 65, 0, 192, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
      [7, 1, 5, 0, 208, 112, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0],
    ];
  let v603 = 0;
  for (const v604 of v602) {
    v603 <<= 1;
    v603 |= webAssembly.validate(Uint8Array.of(...v601, ...v604)) ? 1 : 0;
  }
  return { s: 0, v: v603 };
}
