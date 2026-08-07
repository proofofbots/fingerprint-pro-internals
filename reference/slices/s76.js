// s76 — sig_s76_canvas
// module cm, stage3, codes 0 -1, value is a digest
//
// measures
//   document.createElement("canvas") TextEncoder
// engine
//   Float32Array Uint8Array undefined
// reported value
//   call null
// probes
//   "00000000" "experimental-webgl" "void main(){gl_FragColor=vec4(1,0,0,1);}" "webgl"
//   "webglCreateContextError"
// compares against
//   !== 0 < 32 === 32 > 127
// decides on
//   !v991
//   v991 && v994
//   hash128: v422 > 127
//   hash128: ("00000000" + (v415[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (v415[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (v416[0] >>> 0).toString(16)).slic…
//   fn96: (arg641 %= 64) === 32
//   fn96: arg641 < 32
//   fn53: (arg404 %= 64) !== 0
//   fn53: arg404 < 32
//
// 0 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   fn154:8197 fn166:8783 fn53:3506 fn65:3849 fn91:4777 fn93:5043 fn96:5398 hash128:2674 v3:446
//   v4:447 v5:461 v6:462 v7:463 v8:464 v9:465

// agent.clean.js:7712
function sig_s76_canvas({ cache: arg869 }) {
  const v990 = fn154(arg869);
  if (v990) {
    (function (arg870) {
      arg870.clearColor(0, 0, 1, 1);
      const v991 = arg870.createProgram();
      if (!v991) {
        return;
      }
      function fn186(arg871, arg872) {
        const v994 = arg870.createShader(35633 - arg871);
        if (v991 && v994) {
          arg870.shaderSource(v994, arg872);
          arg870.compileShader(v994);
          arg870.attachShader(v991, v994);
        }
      }
      fn186(
        0,
        "attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}",
      );
      fn186(1, "void main(){gl_FragColor=vec4(1,0,0,1);}");
      arg870.linkProgram(v991);
      arg870.useProgram(v991);
      arg870.enableVertexAttribArray(0);
      const v992 = arg870.getUniformLocation(v991, "t"),
        v993 = arg870.createBuffer();
      arg870.bindBuffer(34962, v993);
      arg870.bufferData(34962, new Float32Array([0, 1, -1, -1, 1, -1]), 35044);
      arg870.vertexAttribPointer(0, 2, 5126, false, 0, 0);
      arg870.clear(16384);
      arg870.uniform1f(v992, 3.65);
      arg870.drawArrays(4, 0, 3);
    })(v990);
    return { s: 0, v: hash128(v990.canvas.toDataURL()) };
  }
  return { s: -1, v: null };
}
