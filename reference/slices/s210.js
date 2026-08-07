// s210 — sig_s210_gpu
// module cm, stage2, codes 0 -1 -2 -3 -4
//
// measures
//   navigator.gpu navigator.gpu.requestAdapter() document.documentElement.style navigator.buildID
//   window.CanvasCaptureMediaStream window.CSSMozDocumentRule window.mozInnerScreenX
//   window.onmozfullscreenchange TextEncoder
// engine
//   ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Uint32Array Uint8Array Error
// reported value
//   null value {ds,dv,f,l}
// probes
//   ": " "Error accessing property " "Illegal invocation" "adapter.info" "adapterInfo.description"
//   "adapterInfo.device" "adapterInfo.isFallbackAdapter" "function" "info" "isFallbackAdapter"
//   "limits." "maxBindGroups" "maxBindGroupsPlusVertexBuffers" "maxBindingsPerBindGroup"
//   "maxBufferSize" "maxColorAttachmentBytesPerSample" "maxColorAttachments"
//   "maxComputeInvocationsPerWorkgroup" "maxComputeWorkgroupSizeX" "maxComputeWorkgroupSizeY"
//   "maxComputeWorkgroupSizeZ" "maxComputeWorkgroupStorageSize" "maxComputeWorkgroupsPerDimension"
//   "maxInterStageShaderComponents" "maxInterStageShaderVariables"
//   "maxSampledTexturesPerShaderStage" "maxSamplersPerShaderStage" "maxStorageBufferBindingSize"
//   "maxStorageBuffersInFragmentStage" "maxStorageBuffersInVertexStage"
//   "maxStorageBuffersPerShaderStage" "maxStorageTexturesInFragmentStage"
//   "maxStorageTexturesInVertexStage" "maxStorageTexturesPerShaderStage" "maxTextureArrayLayers"
//   "maxTextureDimension1D" "maxTextureDimension2D" "maxTextureDimension3D"
//   "maxUniformBufferBindingSize" "maxUniformBuffersPerShaderStage" "maxVertexAttributes"
//   "maxVertexBufferArrayStride" "maxVertexBuffers" "message" "minStorageBufferOffsetAlignment"
//   "minUniformBufferOffsetAlignment" "string"
// compares against
//   == "function" === "Illegal invocation" === "string" === -3 === -4 >= 4 in "CSSMozDocumentRule"
//   in "CanvasCaptureMediaStream" in "MozAppearance" in "buildID" in "isFallbackAdapter"
//   in "mozInnerScreenX" in "onmozfullscreenchange"
// decides on
//   arg382 + arg383
//   v510.s === -3
//   typeof v510.v === "string"
//   v510.s === -4
//   v516 in v511.limits
//   "isFallbackAdapter" in v515
//   h_s210_illegalInvocation(v517)
//   fn131: !gpu
//   fn131: v918 instanceof Error && fn46()
//   readVaultedProp: typeof v316 == "function"
//   h_s210_fn: readVaultedProp(arg899, "info") ?? (await arg899.requestAdapterInfo())
//   fn46: fn9(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMoz…
//   resolveNameByHash: typeof arg801 === "string"
//   resolveNameByHash: fn48(v928) === arg801
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn131:6850 fn46:3216 fn48:3370 fn9:252 readVaultedProp:1674
//   resolveNameByHash:7015 stringToBytes:7901

// agent.clean.js:3307
async function sig_s210_gpu() {
  const v509 = function (arg382, arg383) {
      return arg382 + arg383;
    },
    v510 = await fn131();
  if (v510.s === -3) {
    let v514 = null;
    if (typeof v510.v === "string") {
      v514 = readVaultedProp(v510, "v");
    }
    return { s: -1, v: v514 };
  }
  if (v510.s === -4) {
    return { s: -2, v: null };
  }
  const v511 = v510.v,
    v512 = [];
  let v513 = "";
  try {
    if (v511) {
      for (const v516 of h_s210_maxTextureDimension1DList) {
        v513 = "limits." + v516 + "";
        v512.push(v516 in v511.limits ? v511.limits[v516] : null);
      }
    }
    v513 = "adapter.info";
    const v515 = await h_s210_fn(v511);
    v513 = "adapterInfo.description";
    const description = v515.description;
    v513 = "adapterInfo.device";
    const device = v515.device;
    v513 = "adapterInfo.isFallbackAdapter";
    return {
      s: 0,
      v: {
        ds: description,
        dv: device,
        f: "isFallbackAdapter" in v515 ? v515.isFallbackAdapter : null,
        l: v512,
      },
    };
  } catch (v517) {
    if (h_s210_illegalInvocation(v517)) {
      return {
        s: -3,
        v: v509("Error accessing property " + v513 + ": ", readVaultedProp(v517, "message")) + "",
      };
    }
    throw v517;
  }
}

// agent.clean.js:4473
const h_s210_illegalInvocation = (arg570) =>
  arg570 instanceof Error && arg570.message === "Illegal invocation";

// agent.clean.js:7968
const h_s210_maxTextureDimension1DList = [
  "maxTextureDimension1D",
  "maxTextureDimension2D",
  "maxTextureDimension3D",
  "maxTextureArrayLayers",
  "maxBindGroups",
  "maxBindingsPerBindGroup",
  "maxDynamicUniformBuffersPerPipelineLayout",
  "maxDynamicStorageBuffersPerPipelineLayout",
  "maxSampledTexturesPerShaderStage",
  "maxSamplersPerShaderStage",
  "maxStorageBuffersPerShaderStage",
  "maxStorageTexturesPerShaderStage",
  "maxUniformBuffersPerShaderStage",
  "maxUniformBufferBindingSize",
  "maxStorageBufferBindingSize",
  "minUniformBufferOffsetAlignment",
  "minStorageBufferOffsetAlignment",
  "maxVertexBuffers",
  "maxBufferSize",
  "maxVertexAttributes",
  "maxVertexBufferArrayStride",
  "maxInterStageShaderComponents",
  "maxInterStageShaderVariables",
  "maxColorAttachments",
  "maxColorAttachmentBytesPerSample",
  "maxComputeWorkgroupStorageSize",
  "maxComputeInvocationsPerWorkgroup",
  "maxComputeWorkgroupSizeX",
  "maxComputeWorkgroupSizeY",
  "maxComputeWorkgroupSizeZ",
  "maxComputeWorkgroupsPerDimension",
  "maxBindGroupsPlusVertexBuffers",
  "maxStorageBuffersInFragmentStage",
  "maxStorageBuffersInVertexStage",
  "maxStorageTexturesInFragmentStage",
  "maxStorageTexturesInVertexStage",
];

// agent.clean.js:8057
async function h_s210_fn(arg899) {
  return readVaultedProp(arg899, "info") ?? (await arg899.requestAdapterInfo());
}
