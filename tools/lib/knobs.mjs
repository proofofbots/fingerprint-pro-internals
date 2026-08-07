import { knobValue } from "./address.mjs";

/**
 * The human profile, mapped onto wire positions.
 *
 * One entry per knob. `targets` are payload paths (`s84.v.w`, `s69.v[].l`), `value` is what the knob
 * puts there, and a knob absent from the profile writes nothing at all — the donor's value stands.
 * That is what makes a profile a patch over a real capture rather than a specification of 144
 * fields, and it is why an unmodelled signal is carried rather than invented.
 *
 * `requires` names the knobs an entry reads beyond its own, so `npm run profile` can report which
 * knob was missing rather than writing an `undefined`.
 */

/**
 * The human profile, mapped onto wire positions.
 *
 * One entry per knob. `targets` are payload paths (`s84.v.w`, `s69.v[].l`), `value` is what the knob
 * puts there, and a knob absent from the profile writes nothing at all — the donor's value stands.
 * That is what makes a profile a patch over a real capture rather than a specification of 144
 * fields, and it is why an unmodelled signal is carried rather than invented.
 *
 * `requires` names the knobs an entry reads beyond its own, so `npm run profile` can report which
 * knob was missing rather than writing an `undefined`.
 */
export const KNOBS = [
  {
    knob: "browser.userAgent",
    targets: ["s101.v"],
    value: (profile) => knobValue(profile, "browser.userAgent"),
  },
  {
    knob: "browser.userAgent",
    note: "appVersion is the User-Agent without its Mozilla/ prefix",
    targets: ["s103.v"],
    value: (profile) => String(knobValue(profile, "browser.userAgent")).replace(/^Mozilla\//, ""),
  },
  {
    knob: "browser.vendor",
    targets: ["s27.v"],
    value: (profile) => knobValue(profile, "browser.vendor"),
  },
  {
    knob: "browser.productSub",
    targets: ["s123.v"],
    value: (profile) => knobValue(profile, "browser.productSub"),
  },
  {
    knob: "browser.engineNames",
    note: "the engine list the agent matched, not the brand",
    targets: ["s28.v"],
    value: (profile) => knobValue(profile, "browser.engineNames"),
  },
  {
    knob: "os.platform",
    targets: ["s15.v"],
    value: (profile) => knobValue(profile, "os.platform"),
  },
  {
    knob: "os.oscpu",
    note: "Gecko only; every other engine reports -1 and the knob should be left out",
    targets: ["s1.v"],
    value: (profile) => knobValue(profile, "os.oscpu"),
  },
  {
    knob: "os.systemFont",
    targets: ["s206.v"],
    value: (profile) => knobValue(profile, "os.systemFont"),
  },
  {
    knob: "hardware.cores",
    targets: ["s7.v"],
    value: (profile) => knobValue(profile, "hardware.cores"),
  },
  {
    knob: "hardware.memoryGb",
    targets: ["s4.v"],
    value: (profile) => knobValue(profile, "hardware.memoryGb"),
  },
  {
    knob: "hardware.touchPoints",
    targets: ["s19.v.maxTouchPoints"],
    value: (profile) => knobValue(profile, "hardware.touchPoints"),
  },
  {
    knob: "hardware.touchPoints",
    targets: ["s19.v.touchEvent", "s19.v.touchStart"],
    value: (profile) => Number(knobValue(profile, "hardware.touchPoints")) > 0,
  },
  {
    knob: "screen.size",
    note: "the agent sorts the two dimensions descending, so orientation is not on the wire",
    targets: ["s5.v"],
    value: (profile) => {
      const size = knobValue(profile, "screen.size");
      return [size.width, size.height].sort((a, b) => b - a);
    },
  },
  {
    knob: "screen.size",
    targets: ["s84.v.w"],
    value: (profile) => knobValue(profile, "screen.size").width,
  },
  {
    knob: "screen.size",
    targets: ["s84.v.h"],
    value: (profile) => knobValue(profile, "screen.size").height,
  },
  {
    knob: "screen.avail",
    note: "[availTop, width-availWidth-availLeft, height-availHeight-availTop, availLeft]",
    requires: ["screen.size"],
    targets: ["s6.v"],
    value: (profile) => {
      const size = knobValue(profile, "screen.size");
      const avail = knobValue(profile, "screen.avail");
      return [
        avail.top,
        size.width - avail.width - avail.left,
        size.height - avail.height - avail.top,
        avail.left,
      ];
    },
  },
  {
    knob: "screen.colorDepth",
    targets: ["s3.v"],
    value: (profile) => knobValue(profile, "screen.colorDepth"),
  },
  {
    knob: "screen.pixelRatio",
    targets: ["s57.v"],
    value: (profile) => knobValue(profile, "screen.pixelRatio"),
  },
  {
    knob: "screen.colorGamut",
    targets: ["s37.v"],
    value: (profile) => knobValue(profile, "screen.colorGamut"),
  },
  {
    knob: "window.outer",
    targets: ["s150.v.outerWidth"],
    value: (profile) => knobValue(profile, "window.outer").width,
  },
  {
    knob: "window.outer",
    targets: ["s150.v.outerHeight"],
    value: (profile) => knobValue(profile, "window.outer").height,
  },
  {
    knob: "window.inner",
    targets: ["s150.v.innerWidth"],
    value: (profile) => knobValue(profile, "window.inner").width,
  },
  {
    knob: "window.inner",
    targets: ["s150.v.innerHeight"],
    value: (profile) => knobValue(profile, "window.inner").height,
  },
  {
    knob: "locale.languages",
    note: "the outer array is one entry per language source the agent asked",
    targets: ["s2.v"],
    value: (profile) => {
      const languages = knobValue(profile, "locale.languages");
      return [languages];
    },
  },
  {
    knob: "locale.languages",
    targets: ["s82.v", "s202.v"],
    value: (profile) => knobValue(profile, "locale.languages")[0],
  },
  {
    knob: "locale.timezone",
    targets: ["s9.v"],
    value: (profile) => knobValue(profile, "locale.timezone"),
  },
  {
    knob: "gpu.version",
    targets: ["s74.v.version"],
    value: (profile) => knobValue(profile, "gpu.version"),
  },
  {
    knob: "gpu.vendor",
    targets: ["s74.v.vendor"],
    value: (profile) => knobValue(profile, "gpu.vendor"),
  },
  {
    knob: "gpu.vendorUnmasked",
    targets: ["s74.v.vendorUnmasked"],
    value: (profile) => knobValue(profile, "gpu.vendorUnmasked"),
  },
  {
    knob: "gpu.renderer",
    targets: ["s74.v.renderer"],
    value: (profile) => knobValue(profile, "gpu.renderer"),
  },
  {
    knob: "gpu.rendererUnmasked",
    targets: ["s74.v.rendererUnmasked"],
    value: (profile) => knobValue(profile, "gpu.rendererUnmasked"),
  },
  {
    knob: "gpu.shadingLanguageVersion",
    targets: ["s74.v.shadingLanguageVersion"],
    value: (profile) => knobValue(profile, "gpu.shadingLanguageVersion"),
  },
  {
    knob: "gpu.limits",
    note: "the WebGL limit vector; s210.l on the wire",
    targets: ["s210.v.l"],
    value: (profile) => knobValue(profile, "gpu.limits"),
  },
  {
    knob: "gpu.driverStrings",
    targets: ["s210.v.ds", "s210.v.dv"],
    value: (profile) => knobValue(profile, "gpu.driverStrings"),
  },
  {
    knob: "fonts.detected",
    targets: ["s20.v"],
    value: (profile) => knobValue(profile, "fonts.detected"),
  },
  {
    knob: "fonts.metrics",
    note: "per-family measured text width; every key is a family the agent measured",
    targets: ["s51.v"],
    value: (profile) => knobValue(profile, "fonts.metrics"),
  },
  {
    knob: "uach.brands",
    targets: ["s58.v.b"],
    value: (profile) => knobValue(profile, "uach.brands"),
  },
  {
    knob: "uach.mobile",
    targets: ["s58.v.m"],
    value: (profile) => knobValue(profile, "uach.mobile"),
  },
  {
    knob: "uach.platform",
    targets: ["s58.v.p", "s58.v.h.platform"],
    value: (profile) => knobValue(profile, "uach.platform"),
  },
  {
    knob: "uach.platformVersion",
    targets: ["s58.v.h.platformVersion"],
    value: (profile) => knobValue(profile, "uach.platformVersion"),
  },
  {
    knob: "uach.architecture",
    targets: ["s58.v.h.architecture"],
    value: (profile) => knobValue(profile, "uach.architecture"),
  },
  {
    knob: "uach.bitness",
    targets: ["s58.v.h.bitness"],
    value: (profile) => knobValue(profile, "uach.bitness"),
  },
  {
    knob: "uach.model",
    targets: ["s58.v.h.model"],
    value: (profile) => knobValue(profile, "uach.model"),
  },
  {
    knob: "uach.fullVersion",
    targets: ["s58.v.h.uaFullVersion"],
    value: (profile) => knobValue(profile, "uach.fullVersion"),
  },
  {
    knob: "uach.brands",
    note: "the high-entropy hints ride as JSON strings, not as objects",
    targets: ["s58.v.h.brands"],
    value: (profile) =>
      JSON.stringify(
        knobValue(profile, "uach.brands").map(({ b, v }) => ({
          brand: b,
          version: v,
        })),
      ),
  },
  {
    knob: "uach.fullVersionList",
    targets: ["s58.v.h.fullVersionList"],
    value: (profile) =>
      JSON.stringify(
        knobValue(profile, "uach.fullVersionList").map(({ b, v }) => ({
          brand: b,
          version: v,
        })),
      ),
  },
  {
    knob: "uach.mobile",
    targets: ["s58.v.h.mobile"],
    value: (profile) => String(knobValue(profile, "uach.mobile")),
  },
  {
    knob: "plugins",
    note: "name, description and the mime table, which is the whole of what the agent reports",
    targets: ["s16.v"],
    value: (profile) => knobValue(profile, "plugins"),
  },
  {
    knob: "automation.flags",
    note: "every bot-framework probe the agent runs; a profile normally leaves this out",
    targets: ["s157.v"],
    value: (profile) => knobValue(profile, "automation.flags"),
  },
  {
    knob: "battery",
    targets: ["s217.v"],
    value: (profile) => knobValue(profile, "battery"),
  },
  {
    knob: "storage.quota",
    targets: ["s29.v"],
    value: (profile) => knobValue(profile, "storage.quota"),
  },
  {
    knob: "storage.jsHeapLimit",
    targets: ["s50.v"],
    value: (profile) => knobValue(profile, "storage.jsHeapLimit"),
  },
];

/**
 * The same map read backwards: a donor payload to the profile that would reproduce it.
 *
 * This is what `--template` writes, and it is the only way a profile stays writable by hand — the
 * alternative is typing 40 knobs from a capture. A reader returning `undefined` leaves its knob out
 * of the template, so a signal the donor never collected does not become a knob claiming it did.
 */

/**
 * The same map read backwards: a donor payload to the profile that would reproduce it.
 *
 * This is what `--template` writes, and it is the only way a profile stays writable by hand — the
 * alternative is typing 40 knobs from a capture. A reader returning `undefined` leaves its knob out
 * of the template, so a signal the donor never collected does not become a knob claiming it did.
 */
export const READERS = {
  "browser.userAgent": (payload) => at(payload, "s101.v"),
  "browser.vendor": (payload) => at(payload, "s27.v"),
  "browser.productSub": (payload) => at(payload, "s123.v"),
  "browser.engineNames": (payload) => at(payload, "s28.v"),
  "os.platform": (payload) => at(payload, "s15.v"),
  "os.oscpu": (payload) => at(payload, "s1.v"),
  "os.systemFont": (payload) => at(payload, "s206.v"),
  "hardware.cores": (payload) => at(payload, "s7.v"),
  "hardware.memoryGb": (payload) => at(payload, "s4.v"),
  "hardware.touchPoints": (payload) => at(payload, "s19.v.maxTouchPoints"),
  "screen.size": (payload) => {
    const media = at(payload, "s84.v");
    return media
      ? {
          width: media.w,
          height: media.h,
        }
      : undefined;
  },
  "screen.avail": (payload) => {
    const insets = at(payload, "s6.v");
    const media = at(payload, "s84.v");
    if (!Array.isArray(insets) || insets.length !== 4 || !media) return undefined;
    const [top, right, bottom, left] = insets;
    return {
      top,
      left,
      width: media.w - right - left,
      height: media.h - bottom - top,
    };
  },
  "screen.colorDepth": (payload) => at(payload, "s3.v"),
  "screen.pixelRatio": (payload) => at(payload, "s57.v"),
  "screen.colorGamut": (payload) => at(payload, "s37.v"),
  "window.outer": (payload) => {
    const window = at(payload, "s150.v");
    return window
      ? {
          width: window.outerWidth,
          height: window.outerHeight,
        }
      : undefined;
  },
  "window.inner": (payload) => {
    const window = at(payload, "s150.v");
    return window
      ? {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      : undefined;
  },
  "locale.languages": (payload) => at(payload, "s2.v")?.[0],
  "locale.timezone": (payload) => at(payload, "s9.v"),
  "gpu.version": (payload) => at(payload, "s74.v.version"),
  "gpu.vendor": (payload) => at(payload, "s74.v.vendor"),
  "gpu.vendorUnmasked": (payload) => at(payload, "s74.v.vendorUnmasked"),
  "gpu.renderer": (payload) => at(payload, "s74.v.renderer"),
  "gpu.rendererUnmasked": (payload) => at(payload, "s74.v.rendererUnmasked"),
  "gpu.shadingLanguageVersion": (payload) => at(payload, "s74.v.shadingLanguageVersion"),
  "gpu.limits": (payload) => at(payload, "s210.v.l"),
  "gpu.driverStrings": (payload) => at(payload, "s210.v.ds"),
  "fonts.detected": (payload) => at(payload, "s20.v"),
  "fonts.metrics": (payload) => at(payload, "s51.v"),
  "uach.brands": (payload) => at(payload, "s58.v.b"),
  "uach.mobile": (payload) => at(payload, "s58.v.m"),
  "uach.platform": (payload) => at(payload, "s58.v.p"),
  "uach.platformVersion": (payload) => at(payload, "s58.v.h.platformVersion"),
  "uach.architecture": (payload) => at(payload, "s58.v.h.architecture"),
  "uach.bitness": (payload) => at(payload, "s58.v.h.bitness"),
  "uach.model": (payload) => at(payload, "s58.v.h.model"),
  "uach.fullVersion": (payload) => at(payload, "s58.v.h.uaFullVersion"),
  "uach.fullVersionList": (payload) => {
    const list = at(payload, "s58.v.h.fullVersionList");
    if (typeof list !== "string") return undefined;
    try {
      return JSON.parse(list).map(({ brand, version }) => ({
        b: brand,
        v: version,
      }));
    } catch {
      return undefined;
    }
  },
  plugins: (payload) => at(payload, "s16.v"),
  "automation.flags": (payload) => at(payload, "s157.v"),
  battery: (payload) => at(payload, "s217.v"),
  "storage.quota": (payload) => at(payload, "s29.v"),
  "storage.jsHeapLimit": (payload) => at(payload, "s50.v"),
};

function at(payload, path) {
  const [id] = path.split(".");
  if (payload[id]?.s !== undefined && payload[id].s !== 0) return undefined;
  const held = path
    .split(".")
    .reduce((node, part) => (node == null ? undefined : node[part]), payload);
  return held === null ? undefined : held;
}

/** Every knob path the map understands, for the profile template and for validation. */

/** Every knob path the map understands, for the profile template and for validation. */
export function knobPaths() {
  return [...new Set(KNOBS.map((entry) => entry.knob))].sort();
}

/** Every payload position any knob can write, so unowned wire keys can be counted. */

/** Every payload position any knob can write, so unowned wire keys can be counted. */
export function targetPaths() {
  return [...new Set(KNOBS.flatMap((entry) => entry.targets))].sort();
}
