// s32 — sig_s32_cookie
// module cm, stage3, codes 0
//
// measures
//   document.cookie.indexOf("cookietest=") document.cookie
// reported value
//   value
// probes
//   "cookietest=1; SameSite=Strict;"
// compares against
//   !== -1
// decides on
//   fn129: fn40(arg775)
//   fn129: fn88(v896)
//   fn129: fn88(v897)
//
// 1 owned helper inlined below.
// shared with other collectors, see agent.clean.js:
//   fn129:6642 fn40:1892 fn85:4641 fn88:4712

// agent.clean.js:2428
const h_s32_cookie = function () {
    try {
      document.cookie = "cookietest=1; SameSite=Strict;";
      const v384 = document.cookie.indexOf("cookietest=") !== -1;
      document.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return v384;
    } catch (v385) {
      return false;
    }
  };

// agent.clean.js:6023
const sig_s32_cookie = fn85(h_s32_cookie);
