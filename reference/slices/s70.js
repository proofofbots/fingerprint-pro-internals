// s70 — sig_s70_textDecoder
// module cm, stage2, codes 0 -1 -2 -3 -4 -5 -7, value is a digest
//
// measures
//   TextDecoder navigator.gpu.getPreferredCanvasFormat() window.GPUBufferUsage.COPY_DST
//   window.GPUBufferUsage.COPY_SRC window.GPUBufferUsage.MAP_READ
//   window.GPUBufferUsage.QUERY_RESOLVE window.GPUBufferUsage.UNIFORM window.GPUMapMode.READ
//   window.GPUTextureUsage.COPY_DST window.GPUTextureUsage.TEXTURE_BINDING window.performance.now()
//   navigator.gpu
// engine
//   decodeURIComponent() escape() Float32Array.BYTES_PER_ELEMENT Float64Array Array() Math.PI
//   SyntaxError String.fromCharCode.apply()
// reported value
//   [] null value {s,f,v,a}
// probes
//   "96375" "auto" "axrs" "checkered" "encoder" "function" "message" "nearest" "none" "pipeline"
//   "renderPass" "rgba8unorm" "shader" "store" "timestamp" "unmapped" "webgpu"
// compares against
//   !== 0 <= 0 == "function" === "string" === "unmapped" === 0 === 4169850297
// decides on
//   v1138.s !== 0
//   fn142: !((v957 = arg822.cancel) == null)
//   fn90: !v666
//   h_s70_fn: !(v65.s === 0)
//   h_s70_fn: !h_s70_gpu()
//   readVaultedProp: typeof v316 == "function"
//   h_s70_fn4: arg235 instanceof TypeError && h_s70_fn5(readVaultedProp(arg235, "message"))
//   fn157: v1032 = undefined, !v1034
//   fn157: v1033-- <= 0
//   fn157: !v1034
//   fn157: !(v1032 == null)
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   fn131: !gpu
//   fn131: v918 instanceof Error && fn46()
//   h_s70_gpu: "gpu" && navigator.gpu
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
//   h_s70_getPreferredCanvasFormat: v772.mapState === "unmapped"
//   h_s70_fn7: arg602.info ?? (await arg602.requestAdapterInfo())
//   h_s70_fn5: !!v485 && fn48(v485[1]) === 4169850297
// the call graph walk hit its limit here, so the tests above are partial
//
// 11 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 base64Encode:8766 crc32OfBytes:4943 decodeJsonBytes:5252
//   decryptSelfKeyedTable:112 deepClone:4738 fn124:6501 fn131:6850 fn142:7227 fn157:8239 fn158:8266
//   fn165:8763 fn166:8783 fn31:1619 fn43:3089 fn46:3216 fn48:3370 fn53:3506 fn58:3750 fn65:3849
//   fn74:4219 fn76:4296 fn78:4342 fn9:252 fn90:4751 fn91:4777 fn93:5043 fn96:5398 hash128:2674
//   makeSelfKeyedVault:3791 readVaultedProp:1674 resolveNameByHash:7015 stringToBytes:7901
//   uint8Array2:3955 uint8Array3:3956 uint8Array4:3957 v18:3959 v3:446 v4:447 v5:461 v6:462 v7:463
//   v8:464 v9:465 visibilitychange:6423

// agent.clean.js:203
async function h_s70_fn() {
  const v65 = await fn131();
  let v66 = null;
  if (!(v65.s === 0)) {
    return v65;
  }
  v66 = readVaultedProp(v65, "v");
  if (!h_s70_gpu()) {
    return { s: -1, v: null };
  }
  const v67 = h_s70_canvas();
  if (v67) {
    return { s: 0, v: [v66, v67] };
  }
  return { s: -5, v: null };
}

// agent.clean.js:660
async function h_s70_fn2(arg73, arg74) {
  const v124 = Array.from(arg73?.features.values()),
    [v125, v126] = await Promise.all([
      h_s70_getPreferredCanvasFormat(arg73, v124, arg74),
      h_s70_fn7(arg73),
    ]);
  return [v125, v126, v124];
}

// agent.clean.js:802
function h_s70_fn3(canvas) {
  return h_s70_fn6(hash128(canvas.toDataURL()));
}

// agent.clean.js:1556
function h_s70_fn4(arg235) {
  if (arg235 instanceof TypeError && h_s70_fn5(readVaultedProp(arg235, "message"))) {
    return { s: -7, v: null };
  }
  throw arg235;
}

// agent.clean.js:3178
function h_s70_fn5(arg367) {
  const v485 = arg367.match(h_s70_fn8);
  return !!v485 && fn48(v485[1]) === 4169850297;
}

// agent.clean.js:3876
function h_s70_fn6(arg481) {
  const uint8Array11 = new Uint8Array(arg481.length / 2);
  for (let v575 = 0; v575 < arg481.length; v575 += 2) {
    uint8Array11[v575 / 2] = parseInt(arg481[v575] + arg481[v575 + 1], 16);
  }
  return uint8Array11;
}

// agent.clean.js:4407
function h_s70_gpu() {
  return "gpu" && navigator.gpu;
}

// agent.clean.js:4774
async function h_s70_fn7(arg602) {
  return arg602.info ?? (await arg602.requestAdapterInfo());
}

// agent.clean.js:5488
async function h_s70_getPreferredCanvasFormat(gpuAdapter, arg654, arg655) {
  const v759 = await gpuAdapter.requestDevice({ requiredFeatures: arg654 }),
    pi = Math.PI,
    v760 = [
      [0, 1, 0, pi / 7],
      [1, 0, 0, pi / 8],
      [0, 1, 1, pi / 4],
      [1, 2, 1, pi / 8],
    ],
    v761 = v760.length,
    uint8Array14 = new Uint8Array(v761 * 40),
    v762 = navigator.gpu.getPreferredCanvasFormat();
  arg655.configure({ device: v759, format: v762 });
  const v763 = v759.createShaderModule({
      label: "shader",
      code: "struct O{@builtin(position)position:vec4f,@location(0)texcoord:vec2f}fn rotation(a:vec4f)->mat4x4f{var m=mat4x4f();var x=a.x;var y=a.y;var z=a.z;let n=sqrt(x*x+y*y+z*z);x/=n;y/=n;z/=n;let xx=x*x;let yy=y*y;let zz=z*z;let c=cos(a.w);let s=sin(a.w);let o=1-c;m[0]=vec4f(xx+(1-xx)*c,x*y*o+z*s,x*z*o-y*s,0);m[1]=vec4f(x*y*o-z*s,yy+(1-yy)*c,y*z*o+x*s,0);m[2]=vec4f(x*z*o+y*s,y*z*o-x*s,zz+(1-zz)*c,0);m[3]=vec4f(0,0,0,1);return transpose(m);}@group(1) @binding(0) var<uniform> axr:vec4f;@vertex fn vs(@builtin(vertex_index) i:u32)->O{let n=vec2f(-0.5,0.5);let o=vec2f(1.0,0.0);let v=array(n.xxy,n.yxy,n.xyy,n.yyy,n.xxx,n.yxx,n.xyx,n.yyx);let t=array(0,2,3,0,3,1,4,6,7,4,7,5,0,2,6,0,6,4,1,3,7,1,7,5,2,6,7,2,7,3,0,4,5,0,5,1);let u=array(o.yx,o.yy,o.xy,o.yx,o.xy,o.xx);var r:O;r.position=rotation(axr)*vec4f(v[t[i]],1);r.texcoord=u[i%6];return r;}@group(0) @binding(0) var s:sampler;@group(0) @binding(1) var t:texture_2d<f32>;@fragment fn fs(i:O)->@location(0) vec4f{return textureSample(t,s,i.texcoord);}",
    }),
    v764 = v759.createRenderPipeline({
      label: "pipeline",
      layout: "auto",
      vertex: { module: v763 },
      fragment: { module: v763, targets: [{ format: v762 }] },
      primitive: { cullMode: "none" },
    }),
    v765 = [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
    ],
    uint8Array15 = new Uint8Array(
      Array(63)
        .fill(undefined)
        .map((arg656, arg657) => v765[arg657 % 3])
        .flat(),
    ),
    v766 = v759.createTexture({
      label: "checkered",
      size: [7, 9],
      format: "rgba8unorm",
      usage: window.GPUTextureUsage.TEXTURE_BINDING | window.GPUTextureUsage.COPY_DST,
    });
  v759.queue.writeTexture(
    { texture: v766 },
    uint8Array15,
    { bytesPerRow: 28 },
    { width: 7, height: 9 },
  );
  const v767 = v759.createSampler({ magFilter: "nearest" }),
    v768 = v759.createBindGroup({
      layout: v764.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: v767 },
        { binding: 1, resource: v766.createView() },
      ],
    }),
    v769 = v760.map((arg658) => {
      const v774 = v759.createBuffer({
        label: "axrs",
        size: 4 * Float32Array.BYTES_PER_ELEMENT,
        usage: window.GPUBufferUsage.UNIFORM,
        mappedAtCreation: true,
      });
      new Float32Array(v774.getMappedRange()).set(arg658);
      v774.unmap();
      return v759.createBindGroup({
        layout: v764.getBindGroupLayout(1),
        entries: [{ binding: 0, resource: { buffer: v774 } }],
      });
    }),
    v770 = v759.createQuerySet({ type: "timestamp", count: 2 }),
    v771 = v759.createBuffer({
      size: v770.count * 8,
      usage: window.GPUBufferUsage.QUERY_RESOLVE | window.GPUBufferUsage.COPY_SRC,
    }),
    v772 = v759.createBuffer({
      size: v771.size * v761,
      usage: window.GPUBufferUsage.COPY_DST | window.GPUBufferUsage.MAP_READ,
    }),
    v773 = {
      label: "renderPass",
      colorAttachments: [{ clearValue: [0.3, 0.3, 0.3, 1], loadOp: "clear", storeOp: "store" }],
      timestampWrites: { querySet: v770, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 },
    };
  for (let v775 = 0; v775 < v769.length; v775++) {
    const v776 = v769[v775];
    v773.colorAttachments[0].view = arg655.getCurrentTexture().createView();
    const v777 = v759.createCommandEncoder({ label: "encoder" }),
      v778 = v777.beginRenderPass(v773);
    v778.setPipeline(v764);
    v778.setBindGroup(0, v768);
    v778.setBindGroup(1, v776);
    const v779 = window.performance.now();
    v778.draw(48);
    v778.end();
    v777.resolveQuerySet(v770, 0, v770.count, v771, 0);
    if (v772.mapState === "unmapped") {
      v777.copyBufferToBuffer(v771, 0, v772, v775 * 16, v771.size);
    }
    const v780 = v777.finish();
    v759.queue.submit([v780]);
    const v781 = h_s70_fn3(arg655.canvas);
    uint8Array14.set(v781, 8 + v775 * 40);
    uint8Array14.set(new Uint8Array(new Float64Array([v779]).buffer), v775 * 40);
  }
  if (v772.mapState === "unmapped") {
    await v772.mapAsync(window.GPUMapMode.READ);
    const v782 = v772.getMappedRange(),
      uint8Array16 = new Uint8Array(v782);
    for (let v783 = 0; v783 < v761; v783++) {
      uint8Array14.set(uint8Array16.subarray(v783 * 16, (v783 + 1) * 16), 24 + v783 * 40);
    }
    v772.unmap();
  }
  return base64Encode(uint8Array14);
}

// agent.clean.js:6513
function h_s70_canvas() {
  return document.createElement("canvas").getContext("webgpu");
}

// agent.clean.js:7610
const h_s70_fn8 = new RegExp(
  makeSelfKeyedVault(
    [
      865597172, 819291933, 1162251996, 3803533715, 1156907896, 528002739, 4205401008, 1133067128,
      1010149879, 2776700811, 1844920372,
    ],
    6,
  )(0),
);

// agent.clean.js:8942
function sig_s70_textDecoder() {
  return fn142(fn90(600, 6, 1e3, { s: -2, v: null }), async () => {
    const v1138 = await h_s70_fn();
    if (v1138.s !== 0) {
      return v1138;
    }
    try {
      const [v1139, v1140] = readVaultedProp(v1138, "v"),
        [v1141, v1142, v1143] = await h_s70_fn2(v1139, v1140);
      return { s: 0, v: { s: v1143, f: v1141, v: v1142.vendor, a: v1142.architecture } };
    } catch (v1144) {
      return h_s70_fn4(v1144);
    }
  });
}
