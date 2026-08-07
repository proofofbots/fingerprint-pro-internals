import { getPath } from "./address.mjs";

const DIGEST = /^[0-9a-f]{32}$/;
const value = (payload, id, leaf = "") => getPath(payload, `${id}.v${leaf}`);
const status = (payload, id) => getPath(payload, `${id}.s`);

const collected = (payload, id) => status(payload, id) === 0;

/**
 * What the server can check by reading the payload against itself.
 *
 * Every rule here is a relation between two fields a real browser cannot break, so a violation is a
 * tell regardless of how good any single value is. `fail` is a relation the agent's own code
 * guarantees — breaking it means the payload could not have come from the bundle at all. `warn` is
 * a relation real browsers hold in practice but nothing in the client enforces, so an exotic device
 * can trip it honestly.
 *
 * A rule whose inputs are not on the wire (the signal failed, the donor never carried it) returns
 * `null` and is counted as skipped, not as passed.
 */

/**
 * What the server can check by reading the payload against itself.
 *
 * Every rule here is a relation between two fields a real browser cannot break, so a violation is a
 * tell regardless of how good any single value is. `fail` is a relation the agent's own code
 * guarantees — breaking it means the payload could not have come from the bundle at all. `warn` is
 * a relation real browsers hold in practice but nothing in the client enforces, so an exotic device
 * can trip it honestly.
 *
 * A rule whose inputs are not on the wire (the signal failed, the donor never carried it) returns
 * `null` and is counted as skipped, not as passed.
 */
export const RULES = [
  {
    id: "ua-appversion",
    severity: "fail",
    why: "navigator.appVersion is the User-Agent with the Mozilla/ prefix cut, in every engine",
    check(payload) {
      const ua = value(payload, "s101");
      const appVersion = value(payload, "s103");
      if (typeof ua !== "string" || typeof appVersion !== "string") return null;
      const expected = ua.replace(/^Mozilla\//, "");
      return expected === appVersion ? true : `s103 is ${appVersion}, s101 implies ${expected}`;
    },
  },
  {
    id: "ua-platform",
    severity: "warn",
    why: "the platform token and the User-Agent's OS token name the same system",
    check(payload) {
      const ua = value(payload, "s101");
      const platform = value(payload, "s15");
      if (typeof ua !== "string" || typeof platform !== "string") return null;
      const expect = [
        [/^Win/, "Windows"],
        [/^Mac/, "Macintosh"],
        [/^Linux (x86_64|i686)/, "Linux"],
        [/^Linux (arm|aarch)/, "Android"],
      ].find(([pattern]) => pattern.test(platform));
      if (!expect) return null;
      return ua.includes(expect[1])
        ? true
        : `s15 ${platform} against a User-Agent naming no ${expect[1]}`;
    },
  },
  {
    id: "vendor-engine",
    severity: "warn",
    why: "navigator.vendor is fixed per engine: Blink Google Inc., Gecko empty, WebKit Apple Computer, Inc.",
    check(payload) {
      const vendor = value(payload, "s27");
      const productSub = value(payload, "s123");
      if (typeof vendor !== "string" || typeof productSub !== "string") return null;
      if (productSub === "20100101") {
        return vendor === "" ? true : `Gecko productSub with vendor ${JSON.stringify(vendor)}`;
      }
      const known = ["Google Inc.", "Apple Computer, Inc.", ""];
      return known.includes(vendor)
        ? true
        : `vendor ${JSON.stringify(vendor)} is not one any engine reports`;
    },
  },
  {
    id: "screen-sorted",
    severity: "fail",
    why: "the collector sorts the two screen dimensions descending before reporting them",
    check(payload) {
      const size = value(payload, "s5");
      if (!Array.isArray(size) || size.length !== 2) return null;
      return size[0] >= size[1] ? true : `s5 is [${size}], the collector would have sorted it`;
    },
  },
  {
    id: "screen-matches-media",
    severity: "fail",
    why: "s84 is the same screen s5 reports, read through a media query instead",
    check(payload) {
      const size = value(payload, "s5");
      const media = value(payload, "s84");
      if (!Array.isArray(size) || !media || typeof media !== "object") return null;
      const sorted = [media.w, media.h].sort((a, b) => b - a);
      return sorted[0] === size[0] && sorted[1] === size[1]
        ? true
        : `s84 ${media.w}x${media.h} against s5 [${size}]`;
    },
  },
  {
    id: "avail-fits",
    severity: "fail",
    why: "the available screen area cannot exceed the screen or be negative",
    check(payload) {
      const avail = value(payload, "s6");
      const size = value(payload, "s5");
      if (!Array.isArray(avail) || avail.length !== 4 || !Array.isArray(size)) return null;
      const negative = avail.filter((item) => typeof item === "number" && item < 0);
      if (negative.length) return `s6 has a negative inset: [${avail}]`;
      const [top, right, bottom, left] = avail;
      if (top + bottom >= size[1] || left + right >= size[0]) {
        return `s6 insets [${avail}] leave no room inside [${size}]`;
      }
      return true;
    },
  },
  {
    id: "window-fits-screen",
    severity: "warn",
    why: "the outer window is not larger than the screen it sits on",
    check(payload) {
      const window = value(payload, "s150");
      const size = value(payload, "s5");
      if (!window || !Array.isArray(size)) return null;
      const widest = Math.max(...size);
      if (window.outerWidth > widest || window.outerHeight > widest) {
        return `outer ${window.outerWidth}x${window.outerHeight} against a ${size[0]}x${size[1]} screen`;
      }
      return true;
    },
  },
  {
    id: "language-agreement",
    severity: "fail",
    why: "the three language reads come off the same navigator.languages",
    check(payload) {
      const languages = value(payload, "s2");
      const primary = value(payload, "s82");
      const intl = value(payload, "s202");
      if (!Array.isArray(languages) || !Array.isArray(languages[0])) return null;
      const first = languages[0][0];
      const problems = [];
      if (typeof primary === "string" && primary !== first) problems.push(`s82 ${primary}`);
      if (typeof intl === "string" && intl !== first) problems.push(`s202 ${intl}`);
      return problems.length ? `${problems.join(", ")} against s2 ${first}` : true;
    },
  },
  {
    id: "timezone-known",
    severity: "fail",
    why: "the reported zone has to be one the runtime resolving it would have produced",
    check(payload) {
      const zone = value(payload, "s9");
      if (typeof zone !== "string" || !zone) return null;
      try {
        new Intl.DateTimeFormat("en-US", {
          timeZone: zone,
        });
        return true;
      } catch {
        return `s9 ${zone} is not an IANA zone`;
      }
    },
  },
  {
    id: "uach-engine",
    severity: "warn",
    why: "userAgentData is Blink only; a Gecko or WebKit payload reporting it is a contradiction",
    check(payload) {
      const productSub = value(payload, "s123");
      if (typeof productSub !== "string") return null;
      if (productSub !== "20100101") return null;
      return collected(payload, "s58") ? "s58 carries userAgentData on a Gecko payload" : true;
    },
  },
  {
    id: "uach-platform",
    severity: "fail",
    why: "the hint platform and the string platform are two reads of the same value",
    check(payload) {
      const hint = value(payload, "s58", ".p");
      const platform = value(payload, "s15");
      if (typeof hint !== "string" || typeof platform !== "string") return null;
      const expect = {
        Windows: /^Win/,
        macOS: /^Mac/,
        Linux: /^Linux/,
        Android: /^Linux/,
        "Chrome OS": /^Linux/,
      }[hint];
      if (!expect) return null;
      return expect.test(platform)
        ? true
        : `hint platform ${hint} against navigator.platform ${platform}`;
    },
  },
  {
    id: "uach-version",
    severity: "fail",
    why: "the brand version, the full version and the User-Agent all carry the same major",
    check(payload) {
      const brands = value(payload, "s58", ".b");
      const full = value(payload, "s58", ".h.uaFullVersion");
      const ua = value(payload, "s101");
      if (!Array.isArray(brands) || typeof full !== "string" || typeof ua !== "string") return null;
      const majors = new Set(
        brands
          .filter((brand) => brand.b && !/not.?a.?brand/i.test(brand.b))
          .map((brand) => String(brand.v).split(".")[0]),
      );
      if (!majors.size) return null;
      const fullMajor = full.split(".")[0];
      const uaMajor = (ua.match(/Chrome\/(\d+)/) ?? [])[1];
      const problems = [];
      if (!majors.has(fullMajor)) problems.push(`uaFullVersion ${full}`);
      if (uaMajor && !majors.has(uaMajor)) problems.push(`User-Agent Chrome/${uaMajor}`);
      return problems.length
        ? `${problems.join(", ")} against brands ${[...majors].join(",")}`
        : true;
    },
  },
  {
    id: "uach-mobile-touch",
    severity: "warn",
    why: "a mobile hint with no touch points, or the reverse, is a half-finished spoof",
    check(payload) {
      const mobile = value(payload, "s58", ".m");
      const touch = value(payload, "s19", ".maxTouchPoints");
      if (typeof mobile !== "boolean" || typeof touch !== "number") return null;
      if (mobile && touch === 0) return "userAgentData.mobile with maxTouchPoints 0";
      return true;
    },
  },
  {
    id: "gpu-os",
    severity: "warn",
    why: "the unmasked renderer names the graphics stack of the OS it runs on",
    check(payload) {
      const renderer = value(payload, "s74", ".rendererUnmasked");
      const platform = value(payload, "s15");
      if (typeof renderer !== "string" || !renderer || typeof platform !== "string") return null;
      if (/^Win/.test(platform) && /Metal|Apple/.test(renderer))
        return `Windows platform, ${renderer}`;
      if (/^Mac/.test(platform) && /Direct3D|D3D11|Vulkan/.test(renderer))
        return `macOS platform, ${renderer}`;
      return true;
    },
  },
  {
    id: "automation-clean",
    severity: "warn",
    why: "every bot-framework probe reporting false is what an unautomated browser looks like",
    check(payload) {
      const flags = value(payload, "s157");
      if (!flags || typeof flags !== "object") return null;
      const raised = Object.entries(flags)
        .filter(([, on]) => on === true)
        .map(([name]) => name);
      return raised.length ? `s157 raises ${raised.join(", ")}` : true;
    },
  },
  {
    id: "origin-agreement",
    severity: "fail",
    why: "the page origin is read four separate ways and the server compares them to the request Origin",
    check(payload) {
      const window = value(payload, "s71");
      if (!window || typeof window.w !== "string") return null;
      const origin = window.w;
      const problems = [];
      if (typeof window.l === "string" && window.l !== origin) problems.push(`s71.l ${window.l}`);
      const crypto = value(payload, "s69");
      if (Array.isArray(crypto)) {
        for (const entry of crypto) {
          if (typeof entry?.l === "string" && !entry.l.startsWith(origin))
            problems.push(`s69 ${entry.l}`);
        }
      }
      const loader = getPath(payload, "sc.u");
      if (typeof loader === "string" && !loader.startsWith(origin)) problems.push(`sc.u ${loader}`);
      return problems.length ? `${problems.join(", ")} against s71.w ${origin}` : true;
    },
  },
  {
    id: "device-memory-observed",
    severity: "warn",
    why: "the value is one shipping browsers have been seen to report",
    check(payload) {
      const memory = value(payload, "s4");
      if (typeof memory !== "number") return null;
      const seen = [0.25, 0.5, 1, 2, 4, 8, 16, 24, 32, 64];
      return seen.includes(memory)
        ? true
        : `s4 is ${memory}, outside every value observed in the wild`;
    },
  },
  {
    id: "concurrency-plausible",
    severity: "warn",
    why: "navigator.hardwareConcurrency is a real core count, not an arbitrary integer",
    check(payload) {
      const cores = value(payload, "s7");
      if (typeof cores !== "number") return null;
      if (!Number.isInteger(cores) || cores < 1 || cores > 128) return `s7 is ${cores}`;
      return true;
    },
  },
  {
    id: "system-font-os",
    severity: "warn",
    why: "the resolved system font names the platform's own UI font",
    check(payload) {
      const font = value(payload, "s206");
      const platform = value(payload, "s15");
      if (typeof font !== "string" || !font || typeof platform !== "string") return null;
      if (font === "-apple-system" && !/^Mac|^iP/.test(platform))
        return `s206 ${font} on ${platform}`;
      return true;
    },
  },
  {
    id: "fonts-os",
    severity: "warn",
    why: "a detected font list carries families that only ship with one OS",
    check(payload) {
      const fonts = value(payload, "s20");
      const platform = value(payload, "s15");
      if (!Array.isArray(fonts) || typeof platform !== "string") return null;
      const mac = [
        "Helvetica Neue",
        "Menlo",
        "Gill Sans",
        "Geneva",
        "Lucida Grande",
        "Monaco",
        "Arial Unicode MS",
      ];
      const windows = [
        "Segoe UI",
        "Calibri",
        "Cambria",
        "Consolas",
        "MS Gothic",
        "Tahoma",
        "Sylfaen",
      ];
      const foreign = /^Mac/.test(platform)
        ? fonts.filter((font) => windows.includes(font))
        : /^Win/.test(platform)
          ? fonts.filter((font) => mac.includes(font))
          : [];
      return foreign.length ? `s20 lists ${foreign.join(", ")} on ${platform}` : true;
    },
  },
  {
    id: "digest-format",
    severity: "fail",
    why: "a digest position holds 32 lowercase hex characters or the mixer did not produce it",
    check(payload) {
      const problems = [];
      for (const [path, expected] of [
        ["s17.v.geometry", true],
        ["s17.v.text", true],
        ["s76.v", true],
        ["s46.v", true],
        ["s52.v", true],
        ["s75.v.parameters", true],
        ["s75.v.extensions", true],
      ]) {
        const held = getPath(payload, path);
        if (held === undefined || held === null || held === "") continue;
        if (expected && (typeof held !== "string" || !DIGEST.test(held))) problems.push(path);
      }
      return problems.length ? `not a digest: ${problems.join(", ")}` : true;
    },
  },
  {
    id: "session-fresh",
    severity: "warn",
    why: "a session uuid or clock carried over from the donor presents the same event twice",
    check(payload, _profile, context = {}) {
      const donor = context.donor;
      if (!donor) return null;
      const shared = [];
      for (const path of ["s216.v", "s94.v.u", "s219.v.u"]) {
        const now = getPath(payload, path);
        const then = getPath(donor, path);
        if (now !== undefined && now === then) shared.push(path);
      }
      return shared.length ? `unchanged from the donor: ${shared.join(", ")}` : true;
    },
  },
];

export function runRules(payload, profile, context = {}) {
  const findings = [];
  for (const rule of RULES) {
    let outcome;
    try {
      outcome = rule.check(payload, profile, context);
    } catch (error) {
      outcome = `rule threw: ${error.message}`;
    }
    if (outcome === null || outcome === undefined) {
      findings.push({
        id: rule.id,
        state: "skipped",
        severity: rule.severity,
        why: rule.why,
      });
    } else if (outcome === true) {
      findings.push({
        id: rule.id,
        state: "ok",
        severity: rule.severity,
      });
    } else {
      findings.push({
        id: rule.id,
        state: rule.severity,
        severity: rule.severity,
        detail: outcome,
        why: rule.why,
      });
    }
  }
  return findings;
}
