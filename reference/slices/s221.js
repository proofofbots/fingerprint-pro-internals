// s221 — sig_s221_canvas
// module cm, stage3, codes 1 0 -1
//
// measures
//   document.createElement("canvas")
// engine
//   Map Array.from() Math.ceil() Uint32Array undefined
// reported value
//   null {b,u}
// probes
//   "EXT_blend_minmax" "EXT_clip_control" "EXT_clip_cull_distance" "EXT_color_buffer_float"
//   "EXT_color_buffer_half_float" "EXT_conservative_depth" "EXT_depth_clamp"
//   "EXT_disjoint_timer_query" "EXT_disjoint_timer_query_webgl2" "EXT_float_blend" "EXT_frag_depth"
//   "EXT_polygon_offset_clamp" "EXT_render_snorm" "EXT_sRGB" "EXT_shader_texture_lod"
//   "EXT_texture_compression_bptc" "EXT_texture_compression_rgtc" "EXT_texture_filter_anisotropic"
//   "EXT_texture_mirror_clamp_to_edge" "EXT_texture_norm16" "KHR_parallel_shader_compile"
//   "NV_shader_noperspective_interpolation" "OES_depth_texture" "OES_draw_buffers_indexed"
//   "OES_element_index_uint" "OES_fbo_render_mipmap" "OES_sample_variables"
//   "OES_shader_multisample_interpolation" "OES_standard_derivatives" "OES_texture_float"
//   "OES_texture_float_linear" "OES_texture_half_float" "OES_texture_half_float_linear"
//   "OES_vertex_array_object" "OVR_multiview2" "WEBGL_blend_func_extended"
//   "WEBGL_clip_cull_distance" "WEBGL_color_buffer_float" "WEBGL_compressed_texture_astc"
//   "WEBGL_compressed_texture_etc" "WEBGL_compressed_texture_etc1" "WEBGL_compressed_texture_pvrtc"
//   "WEBGL_compressed_texture_s3tc" "WEBGL_compressed_texture_s3tc_srgb" "WEBGL_debug_renderer_info"
//   "WEBGL_debug_shaders" "WEBGL_depth_texture" "WEBGL_draw_buffers"
//   "WEBGL_get_buffer_sub_data_async" "WEBGL_lose_context" "WEBGL_multi_draw"
//   "WEBGL_multi_draw_instanced" "WEBGL_multiview" "WEBGL_polygon_mode" "WEBGL_provoking_vertex"
//   "WEBGL_render_shared_exponent" "WEBGL_shader_pixel_local_storage" "WEBGL_stencil_texturing"
//   "WEBGL_video_texture" "WEBGL_webcodecs_video_frame" "WEBKIT_WEBGL_compressed_texture_pvrtc"
//   "webgl2"
// compares against
//   < 10
// decides on
//   arg373 | arg374
//   !v491
//   v498 === undefined
//   v495.length < 10
//
// 2 owned helpers inlined below.

// agent.clean.js:3228
function sig_s221_canvas() {
  const v490 = function (arg373, arg374) {
    return arg373 | arg374;
  };
  const v491 = document.createElement("canvas").getContext("webgl2");
  if (!v491) {
    return { s: -1, v: null };
  }
  const v492 = v491.getSupportedExtensions() ?? [],
    v493 = Math.ceil(h_s221_extBlendMinmaxList.length / 32),
    uint32Array3 = new Uint32Array(v493);
  let v494 = false;
  const v495 = [],
    v496 = h_s221_fn();
  for (const v497 of v492) {
    const v498 = v496.get(v497);
    if (v498 === undefined) {
      v494 = true;
      if (v495.length < 10) {
        v495.push(v497.slice(0, 60));
      }
      continue;
    }
    const v499 = (v498 / 32) | 0,
      v500 = v498 & 31;
    uint32Array3[v499] = v490(uint32Array3[v499], 1 << v500) >>> 0;
  }
  return { s: v494 ? 1 : 0, v: { b: Array.from(uint32Array3), u: v495 } };
}

// agent.clean.js:6382
function h_s221_fn() {
  const v859 = new Map();
  for (let v860 = 0; v860 < h_s221_extBlendMinmaxList.length; v860++) {
    v859.set(h_s221_extBlendMinmaxList[v860], v860);
  }
  return v859;
}

// agent.clean.js:8356
const h_s221_extBlendMinmaxList = [
  "EXT_blend_minmax",
  "EXT_clip_control",
  "EXT_clip_cull_distance",
  "EXT_color_buffer_float",
  "EXT_color_buffer_half_float",
  "EXT_conservative_depth",
  "EXT_depth_clamp",
  "EXT_disjoint_timer_query",
  "EXT_disjoint_timer_query_webgl2",
  "EXT_float_blend",
  "EXT_frag_depth",
  "EXT_polygon_offset_clamp",
  "EXT_render_snorm",
  "EXT_sRGB",
  "EXT_shader_texture_lod",
  "EXT_texture_compression_bptc",
  "EXT_texture_compression_rgtc",
  "EXT_texture_filter_anisotropic",
  "EXT_texture_mirror_clamp_to_edge",
  "EXT_texture_norm16",
  "KHR_parallel_shader_compile",
  "NV_shader_noperspective_interpolation",
  "OES_depth_texture",
  "OES_element_index_uint",
  "OES_fbo_render_mipmap",
  "OES_standard_derivatives",
  "OES_texture_float",
  "OES_texture_float_linear",
  "OES_texture_half_float",
  "OES_texture_half_float_linear",
  "OES_vertex_array_object",
  "OES_draw_buffers_indexed",
  "OES_sample_variables",
  "OES_shader_multisample_interpolation",
  "OVR_multiview2",
  "WEBGL_blend_func_extended",
  "WEBGL_clip_cull_distance",
  "WEBGL_color_buffer_float",
  "WEBGL_compressed_texture_astc",
  "WEBGL_compressed_texture_etc",
  "WEBGL_compressed_texture_etc1",
  "WEBGL_compressed_texture_pvrtc",
  "WEBGL_compressed_texture_s3tc",
  "WEBGL_compressed_texture_s3tc_srgb",
  "WEBGL_debug_renderer_info",
  "WEBGL_debug_shaders",
  "WEBGL_depth_texture",
  "WEBGL_draw_buffers",
  "WEBGL_draw_instanced_base_vertex_base_instance",
  "WEBGL_get_buffer_sub_data_async",
  "WEBGL_lose_context",
  "WEBGL_multi_draw",
  "WEBGL_multi_draw_instanced",
  "WEBGL_multi_draw_instanced_base_vertex_base_instance",
  "WEBGL_multiview",
  "WEBGL_polygon_mode",
  "WEBGL_provoking_vertex",
  "WEBGL_render_shared_exponent",
  "WEBGL_shader_pixel_local_storage",
  "WEBGL_stencil_texturing",
  "WEBGL_video_texture",
  "WEBGL_webcodecs_video_frame",
  "WEBKIT_WEBGL_compressed_texture_pvrtc",
];
