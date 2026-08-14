#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { COLLECTOR, DOCS, PIN, REFERENCE, ROOT } from "./lib/paths.mjs";
import { highlight, layout, makeResolver, renderMarkdown } from "./lib/site-render.mjs";

const args = process.argv.slice(2);
const check = args.includes("--check");

if (args.includes("--help") || args.includes("-h")) {
  console.log(`site — build the documentation hub and signal explorer into docs/

  node tools/site.mjs [--check]

  --check   compare what this build would write against docs/ and exit 1 on any difference
`);
  process.exit(0);
}

const read = (path) => readFileSync(join(ROOT, path), "utf8");

const labels = JSON.parse(read("reference/labels.json"));
const pin = JSON.parse(readFileSync(PIN, "utf8"));

const signalRows = read("reference/signals.md")
  .split("\n")
  .filter((line) => /^\| s\d+ \|/.test(line))
  .map((line) => line.split("|")[1].trim());

const groups = new Set(labels.groups.map((group) => group.id));
const labelled = new Set(Object.keys(labels.signals));
const missing = signalRows.filter((id) => !labelled.has(id));
const stale = [...labelled].filter((id) => !signalRows.includes(id));
const badGroup = Object.entries(labels.signals).filter(([, meta]) => !groups.has(meta.group));

if (missing.length || badGroup.length) {
  for (const id of missing) console.error(`site: ${id} has no entry in reference/labels.json`);
  for (const [id, meta] of badGroup) console.error(`site: ${id} uses unknown group ${meta.group}`);
  process.exit(1);
}
for (const id of stale) console.warn(`site: labels.json still carries ${id}, gone from signals.md`);

const guide = readdirSync(join(ROOT, "docs"))
  .filter((name) => /^\d\d-[a-z-]+\.md$/.test(name))
  .sort();

const referenceMaps = ["signals", "schema", "codes", "envelope", "endpoints", "observed", "diff"];

const repoReadmes = [
  ["agent/README.md", "repo/agent.html", "The deobfuscated bundle"],
  ["collector/README.md", "repo/collector.html", "The standalone collectors"],
  ["captures/README.md", "repo/captures.html", "Browser captures"],
  ["profiles/README.md", "repo/profiles.html", "Device profiles"],
  ["evidence/README.md", "repo/evidence.html", "Identity evidence"],
  ["spy/README.md", "repo/spy.html", "DevTools instrumentation"],
];

const sliceFiles = readdirSync(join(REFERENCE, "slices"))
  .filter((name) => /^s\d+\.js$/.test(name))
  .sort((a, b) => Number(a.slice(1, -3)) - Number(b.slice(1, -3)));

const titleOf = (markdown) => (markdown.match(/^#\s+(.+)$/m) ?? [, "Untitled"])[1].trim();
const ledeOf = (markdown) => {
  const body = markdown.replace(/^#\s+.+$/m, "").trim();
  const paragraph = body.split(/\n\s*\n/).find((block) => !block.startsWith("|") && !block.startsWith("```"));
  return paragraph ? paragraph.replace(/\s+/g, " ").replace(/[[\]`]|\(([^)]+)\)/g, "").slice(0, 200) : "";
};

const pages = new Map([
  ["README.md", "index.html"],
  ["collector/index.html", "explorer.html"],
  ["reference/README.md", "reference/index.html"],
  ["reference/slices/README.md", "slices/index.html"],
  ["reference/slices", "slices/index.html"],
]);
for (const name of guide) pages.set(`docs/${name}`, `${name.replace(/\.md$/, "")}.html`);
for (const name of referenceMaps) pages.set(`reference/${name}.md`, `reference/${name}.html`);
for (const [source, url] of repoReadmes) pages.set(source, url);
for (const name of sliceFiles) pages.set(`reference/slices/${name}`, `slices/${name.replace(/\.js$/, "")}.html`);

const guideTitles = guide.map((name) => ({
  url: `${name.replace(/\.md$/, "")}.html`,
  title: titleOf(read(`docs/${name}`)),
  source: `docs/${name}`,
}));

const nav = [
  {
    title: "Start",
    links: [
      { url: "index.html", title: "Overview" },
      { url: "explorer.html", title: "Signal explorer", search: "explorer scan run collectors live" },
    ],
  },
  {
    title: "Guide",
    links: guideTitles.map(({ url, title, source }) => ({ url, title, search: `${title} ${source}` })),
  },
  {
    title: "Reference",
    links: [
      { url: "reference/index.html", title: "What is generated" },
      ...referenceMaps.map((name) => ({
        url: `reference/${name}.html`,
        title: titleOf(read(`reference/${name}.md`)),
        search: `${titleOf(read(`reference/${name}.md`))} reference/${name}.md`,
      })),
    ],
  },
  {
    title: "Collectors",
    links: [{ url: "slices/index.html", title: `All ${sliceFiles.length} sources`, search: "slices collectors source" }],
  },
  {
    title: "Repository",
    links: [
      ...repoReadmes.map(([source, url, title]) => ({ url, title, search: `${title} ${source}` })),
      { url: "repo/license.html", title: "License and contact", search: "license unlicense legal contact email" },
    ],
  },
];

const written = [];
const emit = (path, content) => written.push([content, join(DOCS, path)]);

function page({ source, url, markdown, kicker, heading, lede, wide = false, scripts = [], body, logo = false }) {
  const base = url.includes("/") ? "../" : "./";
  const resolve = makeResolver({ from: source ?? "", pages, base });
  const rendered = markdown ? renderMarkdown(markdown, { resolve }) : { html: body, headings: [] };

  emit(
    url,
    layout({
      title: `${heading} — fingerprint-pro-internals`,
      kicker,
      heading,
      lede,
      body: rendered.html,
      nav,
      current: url,
      base,
      headings: rendered.headings,
      wide,
      scripts,
      logo,
      pagenav: pagenavFor(url),
    }),
  );
}

const order = [
  "index.html",
  "explorer.html",
  ...guideTitles.map((entry) => entry.url),
  "reference/index.html",
  ...referenceMaps.map((name) => `reference/${name}.html`),
  "slices/index.html",
  ...repoReadmes.map(([, url]) => url),
  "repo/license.html",
];

const titleForUrl = new Map(
  nav.flatMap((section) => section.links.map((link) => [link.url, link.title])),
);

function pagenavFor(url) {
  const index = order.indexOf(url);
  if (index === -1) return "";
  const base = url.includes("/") ? "../" : "./";
  const previous = order[index - 1];
  const next = order[index + 1];
  const link = (target, prefix) =>
    target
      ? `<a href="${base}${target}">${prefix} ${titleForUrl.get(target) ?? target}</a>`
      : "<span></span>";
  return `<div class="pagenav">${link(previous, "←")}${link(next, "→")}</div>`;
}

const overview = read("site/overview.md")
  .replace(/{{version}}/g, pin.version)
  .replace(/{{sha}}/g, `${pin.sha256.slice(0, 8)}…`)
  .replace(/{{fetched}}/g, pin.fetchedAt.slice(0, 10));

page({
  source: "site/overview.md",
  url: "index.html",
  markdown: overview,
  kicker: "Fingerprint Pro v4",
  heading: "The agent, taken apart",
  lede: "Deobfuscated bundle, a map of all 143 signals, the source of every collector, and a page that runs them against your own browser.",
  logo: true,
});

page({
  source: "site/explorer.html",
  url: "explorer.html",
  body: read("site/explorer.html"),
  kicker: "Live",
  heading: "Signal explorer",
  lede: "The agent's own collectors, run here, under readable names. Nothing leaves the page.",
  wide: true,
  scripts: ["app.js"],
});

for (const entry of guideTitles) {
  const markdown = read(entry.source);
  page({
    source: entry.source,
    url: entry.url,
    markdown: markdown.replace(/^#\s+.+$/m, ""),
    kicker: "Guide",
    heading: entry.title,
    lede: ledeOf(markdown),
  });
}

const referenceIndex = read("reference/README.md");
page({
  source: "reference/README.md",
  url: "reference/index.html",
  markdown: referenceIndex.replace(/^#\s+.+$/m, ""),
  kicker: "Reference",
  heading: titleOf(referenceIndex),
  lede: ledeOf(referenceIndex),
  wide: true,
});

for (const name of referenceMaps) {
  const markdown = read(`reference/${name}.md`);
  page({
    source: `reference/${name}.md`,
    url: `reference/${name}.html`,
    markdown: markdown.replace(/^#\s+.+$/m, ""),
    kicker: "Reference",
    heading: titleOf(markdown),
    lede: ledeOf(markdown),
    wide: true,
  });
}

const groupLabel = new Map(labels.groups.map((group) => [group.id, group.label]));
const sliceCards = labels.groups
  .map((group) => {
    const ids = sliceFiles
      .map((name) => name.replace(/\.js$/, ""))
      .filter((id) => labels.signals[id]?.group === group.id);
    if (ids.length === 0) return "";
    const cards = ids
      .map(
        (id) =>
          `<a href="./${id}.html">${labels.signals[id].label}<em>${id}</em></a>`,
      )
      .join("\n");
    return `<h2 id="${group.id}">${group.label}</h2>\n<div class="slicegrid">${cards}</div>`;
  })
  .join("\n");

page({
  source: "reference/slices/README.md",
  url: "slices/index.html",
  body: `${renderMarkdown(read("reference/slices/README.md").replace(/^#\s+.+$/m, ""), { resolve: makeResolver({ from: "reference/slices/README.md", pages, base: "../" }) }).html}${sliceCards}`,
  kicker: "Collectors",
  heading: "Collector sources",
  lede: `One page per wire id: the collector's own source with every helper only it can reach, ${sliceFiles.length} in total.`,
  wide: true,
});

for (const name of sliceFiles) {
  const id = name.replace(/\.js$/, "");
  const meta = labels.signals[id] ?? {};
  const source = readFileSync(join(REFERENCE, "slices", name), "utf8");
  const body = [
    meta.note ? `<p class="lede">${meta.note}</p>` : "",
    `<p class="lede">Group: ${groupLabel.get(meta.group) ?? "unclassified"} · <a href="../reference/signals.html">signal map</a> · <a href="../explorer.html">run it live</a></p>`,
    `<pre><code class="hljs language-javascript">${highlight(source, "javascript")}</code></pre>`,
  ].join("\n");

  emit(
    `slices/${id}.html`,
    layout({
      title: `${meta.label ?? id} (${id}) — fingerprint-pro-internals`,
      kicker: `Collector ${id}`,
      heading: meta.label ?? id,
      lede: "",
      body,
      nav,
      current: "slices/index.html",
      base: "../",
      headings: [],
      wide: true,
      pagenav: "",
    }),
  );
}

for (const [source, url, kicker] of repoReadmes) {
  const markdown = read(source);
  page({
    source,
    url,
    markdown: markdown.replace(/^#\s+.+$/m, ""),
    kicker,
    heading: titleOf(markdown),
    lede: ledeOf(markdown),
    wide: true,
  });
}

const license = read("LICENSE")
  .split(/\n\s*\n/)
  .map((block) => block.trim())
  .filter(Boolean)
  .map((block) =>
    block === "---"
      ? "<hr />"
      : `<p>${block
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, " ")
          .replace(/(proofofbot@pm\.me)/, '<a href="mailto:$1">$1</a>')}</p>`,
  )
  .join("\n");

page({
  source: "LICENSE",
  url: "repo/license.html",
  body: license,
  kicker: "Legal",
  heading: "License and contact",
  lede: "Public domain, no attribution required. Unofficial, not affiliated with Fingerprint.",
});

emit("styles.css", read("site/styles.css"));
emit("hub.js", read("site/hub.js"));
emit("logo.svg", read("site/logo.svg"));
emit("logo-mark.svg", read("site/logo-mark.svg"));
emit("app.js", read("site/app.js"));
emit("fp-collect.js", readFileSync(join(COLLECTOR, "fp-collect.js"), "utf8"));
emit("labels.json", `${JSON.stringify(labels, null, 2)}\n`);
emit(".nojekyll", "");

if (check) {
  const drifted = written.filter(
    ([content, to]) => !existsSync(to) || readFileSync(to, "utf8") !== content,
  );
  for (const [, to] of drifted) console.error(`site: ${to} is out of date, run npm run site`);
  process.exit(drifted.length ? 1 : 0);
}

for (const directory of ["slices", "reference", "repo"]) {
  rmSync(join(DOCS, directory), { recursive: true, force: true });
}
for (const [, to] of written) mkdirSync(to.slice(0, to.lastIndexOf("/")), { recursive: true });
for (const [content, to] of written) writeFileSync(to, content);

const html = written.filter(([, to]) => to.endsWith(".html")).length;
console.log(
  `site: ${html} pages and ${written.length - html} assets into docs/, ` +
    `${guide.length} guide, ${referenceMaps.length} reference maps, ${sliceFiles.length} collectors, ` +
    `${labelled.size} signals labelled`,
);
