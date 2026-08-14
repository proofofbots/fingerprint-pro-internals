import { Marked } from "marked";
import hljs from "highlight.js";

const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const slug = (text) =>
  text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function highlight(source, language) {
  const known = language && hljs.getLanguage(language) ? language : null;
  if (!known) return escapeHtml(source);
  return hljs.highlight(source, { language: known }).value;
}

export function renderMarkdown(source, { resolve = (href) => href, tables = true } = {}) {
  const headings = [];
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, "");
        const id = slug(plain);
        if (depth === 2 || depth === 3) headings.push({ id, text: plain, depth });
        const anchor = depth === 1 ? "" : `<a class="anchor" href="#${id}">#</a>`;
        return `<h${depth} id="${id}">${text}${anchor}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const language = (lang ?? "").split(/\s+/)[0];
        return `<pre><code class="hljs language-${escapeHtml(language)}">${highlight(text, language)}</code></pre>\n`;
      },
      table(token) {
        const head = token.header
          .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
          .join("");
        const rows = token.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join("")}</tr>`,
          )
          .join("\n");
        const table = `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
        if (!tables || token.rows.length < 12) return `${table}\n`;
        return [
          `<div class="tablewrap" data-filterable>`,
          `<div class="tablebar">`,
          `<input class="search" type="search" placeholder="Filter ${token.rows.length} rows" />`,
          `<span class="rowcount">${token.rows.length} rows</span>`,
          `</div>`,
          table,
          `</div>\n`,
        ].join("");
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const label = title ? ` title="${escapeHtml(title)}"` : "";
        return `<a href="${escapeHtml(resolve(href ?? ""))}"${label}>${text}</a>`;
      },
    },
  });

  return { html: marked.parse(source), headings };
}

export function makeResolver({ from, pages, base }) {
  const dir = from.includes("/") ? from.slice(0, from.lastIndexOf("/")) : "";
  return (href) => {
    if (!href || /^(https?:|mailto:|#)/.test(href)) return href ?? "";
    const [path, hash = ""] = href.split("#");
    const suffix = hash ? `#${hash}` : "";
    if (!path) return suffix;

    const parts = [...dir.split("/").filter(Boolean), ...path.split("/")];
    const stack = [];
    for (const part of parts) {
      if (part === "." || part === "") continue;
      if (part === "..") stack.pop();
      else stack.push(part);
    }
    const target = stack.join("/");
    const hit = pages.get(target) ?? pages.get(`${target}/`) ?? pages.get(`${target}/README.md`);
    if (hit) return `${base}${hit}${suffix}`;
    return href;
  };
}

function navHtml(nav, current, base) {
  return nav
    .map((section) => {
      const links = section.links
        .map((link) => {
          const active = link.url === current ? ' class="current"' : "";
          return `<a href="${base}${link.url}"${active} data-nav="${escapeHtml(link.search ?? link.title)}">${escapeHtml(link.title)}</a>`;
        })
        .join("\n");
      return `<div class="section"><span>${escapeHtml(section.title)}</span>\n${links}\n</div>`;
    })
    .join("\n");
}

function tocHtml(headings) {
  if (headings.length < 2) return "";
  const links = headings
    .map(
      (heading) =>
        `<a href="#${heading.id}"${heading.depth === 3 ? ' class="deep"' : ""}>${escapeHtml(heading.text)}</a>`,
    )
    .join("\n");
  return `<aside class="toc"><span>On this page</span>${links}</aside>`;
}

export function layout({
  title,
  kicker = "",
  lede = "",
  heading = "",
  body,
  nav,
  current,
  base = "./",
  headings = [],
  wide = false,
  scripts = [],
  pagenav = "",
  logo = false,
}) {
  const toc = wide ? "" : tocHtml(headings);
  const head = heading
    ? `<div class="pagehead">${logo ? `<img class="herologo" src="${base}logo.svg" alt="Fingerprint Pro Internals" />` : ""}${kicker ? `<div class="kicker">${escapeHtml(kicker)}</div>` : ""}<h1>${escapeHtml(heading)}</h1>${lede ? `<p class="lede">${escapeHtml(lede)}</p>` : ""}</div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    ${lede ? `<meta name="description" content="${escapeHtml(lede)}" />` : ""}
    <link rel="icon" href="${base}logo-mark.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700&family=JetBrains+Mono:wght@300;400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${base}styles.css" />
  </head>
  <body>
    <header class="masthead">
      <div class="wrap">
        <a class="mark" href="${base}index.html"><img src="${base}logo.svg" alt="Fingerprint Pro Internals" /></a>
        <nav>
          <a href="${base}index.html">Overview</a>
          <a href="${base}01-architecture.html">Guide</a>
          <a href="${base}reference/signals.html">Reference</a>
          <a href="${base}slices/index.html">Collectors</a>
          <a href="${base}explorer.html">Explorer</a>
        </nav>
      </div>
    </header>

    <div class="shell${toc ? " with-toc" : ""}">
      <aside class="sidebar">
        <input class="search filter" id="navfilter" type="search" placeholder="Filter pages" />
        ${navHtml(nav, current, base)}
      </aside>
      <main class="prose${wide ? " wide" : ""}">
        ${head}
        ${body}
        ${pagenav}
      </main>
      ${toc}
    </div>

    <footer class="footer">
      <div class="wrap">
        <p>
          One pinned build of the Fingerprint Pro v4 browser agent, taken apart offline. Every page
          here is generated from the repository by <code>npm run site</code>: the guide from the
          markdown in <code>docs/</code>, the tables from the maps in <code>reference/</code>, the
          collector sources from <code>reference/slices/</code>, and the explorer from
          <code>collector/fp-collect.js</code>.
        </p>
        <p>
          Public domain, <a href="${base}repo/license.html">Unlicense</a>: use it however you like,
          with no attribution required. Unofficial and not affiliated with Fingerprint;
          "Fingerprint" and the fingerprint mark are their trademarks. Contact, including takedown
          and legal enquiries: <a href="mailto:proofofbot@pm.me">proofofbot@pm.me</a>.
        </p>
      </div>
    </footer>

    <script src="${base}hub.js"></script>
    ${scripts.map((src) => `<script type="module" src="${base}${src}"></script>`).join("\n    ")}
  </body>
</html>
`;
}
