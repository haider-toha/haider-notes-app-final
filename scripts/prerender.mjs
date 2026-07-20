// Build-time prerenderer.
//
// After `vite build`, this walks every route in the app and writes a real static
// HTML file for each one — full <head> (title, description, canonical, Open Graph,
// Twitter, JSON-LD) plus the note's body rendered to semantic HTML inside #root.
//
// Why: the app is a client-only React SPA, so the HTML Vite emits is an empty
// <div id="root">. Search engines *can* run the JS eventually, but recruiter/ATS
// scrapers and most link-preview bots do not. Prerendering gives every one of them
// real, readable HTML with zero JavaScript. React still boots for real users and
// replaces #ssg-root instantly (hidden via `html.js #ssg-root{display:none}`).
//
// Data + SEO metadata are loaded through Vite's SSR module runner so this stays in
// lockstep with the actual app (same constants.tsx, same seo.ts — no duplication).

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

// ---------------------------------------------------------------------------
// Small HTML helpers
// ---------------------------------------------------------------------------

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const attrEscape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\s+/g, " ")
    .trim();

// JSON-LD, safe to drop inside a <script> tag.
const ldScript = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ---------------------------------------------------------------------------
// Minimal markdown -> semantic HTML for the subset used in the notes.
// This does not need pixel fidelity with the in-app renderer; it needs correct,
// crawlable text, headings and links. Math/mermaid are dropped (not useful as text).
// ---------------------------------------------------------------------------

function renderInline(escaped) {
  return escaped
    .replace(
      /!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g,
      (_m, alt, src) => `<img src="${src}" alt="${attrEscape(alt)}" loading="lazy" />`,
    )
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g,
      (_m, txt, url) => `<a href="${url}">${txt}</a>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\$([^$\n]+)\$/g, "<span>$1</span>");
}

const inline = (raw) => renderInline(escapeHtml(raw));

function splitRow(row) {
  let s = row.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function renderMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let para = [];
  let i = 0;

  const flush = () => {
    if (!para.length) return;
    const text = para.join(" ").trim();
    if (text) out.push(`<p>${inline(text)}</p>`);
    para = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    // fenced code
    if (/^```/.test(t)) {
      flush();
      const lang = t.replace(/^```/, "").trim().toLowerCase();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) buf.push(lines[i++]);
      i++; // closing fence
      if (lang !== "mermaid") out.push(`<pre><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // block math $$ ... $$ — drop (garbled as text, no SEO value)
    if (t === "$$") {
      flush();
      i++;
      while (i < lines.length && lines[i].trim() !== "$$") i++;
      i++;
      continue;
    }

    if (t === "") {
      flush();
      i++;
      continue;
    }

    // pipe table (header row followed by a |---|--- separator)
    if (
      t.includes("|") &&
      i + 1 < lines.length &&
      lines[i + 1].includes("|") &&
      /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])
    ) {
      flush();
      const header = splitRow(t);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitRow(lines[i].trim()));
        i++;
      }
      let tbl = `<table><thead><tr>${header.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>`;
      for (const r of rows) tbl += `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`;
      out.push(`${tbl}</tbody></table>`);
      continue;
    }

    // atx headings (# .. ####) -> h2..h4
    const atx = t.match(/^(#{1,4})\s+(.*)$/);
    if (atx) {
      flush();
      out.push(`<h${Math.min(atx[1].length + 1, 4)}>${inline(atx[2].trim())}</h${Math.min(atx[1].length + 1, 4)}>`);
      i++;
      continue;
    }

    // whole-line bold -> heading (the app's convention for note headings)
    const boldHead = t.match(/^\*\*([^*][\s\S]*?)\*\*$/);
    if (boldHead && !/\*\*/.test(boldHead[1])) {
      flush();
      out.push(`<h3>${inline(boldHead[1].trim())}</h3>`);
      i++;
      continue;
    }

    // bullet list
    if (/^[-*]\s+/.test(t)) {
      flush();
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ul>`);
      continue;
    }

    // blockquote
    if (/^>\s?/.test(t)) {
      flush();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    para.push(t);
    i++;
  }
  flush();
  return out.join("\n");
}

// ---------------------------------------------------------------------------
// Body fragments (go inside #root, wrapped in #ssg-root)
// ---------------------------------------------------------------------------

function contactFooter(seo) {
  return `<footer class="ssg-footer">
  <p>Haider Toha — ${escapeHtml(seo.AUTHOR_TAGLINE)}. London, United Kingdom.</p>
  <p>Contact: <a href="mailto:mohammedhaidertoha@gmail.com">mohammedhaidertoha@gmail.com</a>
   · <a href="https://www.linkedin.com/in/haidertoha" rel="me">LinkedIn</a>
   · <a href="https://github.com/haider-toha" rel="me">GitHub</a>
   · <a href="https://x.com/HaiderToha" rel="me">X (Twitter)</a></p>
</footer>`;
}

function siteIndex(notes, folders, seo) {
  const groups = folders
    .filter((f) => f.id !== "all")
    .map((f) => ({
      label: seo.FOLDER_LABELS[f.id] ?? f.name,
      id: f.id,
      notes: notes
        .filter((n) => n.folder === f.id)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }))
    .filter((g) => g.notes.length);

  let html = `<nav class="ssg-index" aria-label="All notes"><h2>All notes</h2>`;
  for (const g of groups) {
    html += `<h3><a href="/${g.id}">${escapeHtml(g.label)}</a></h3><ul>`;
    for (const n of g.notes) {
      html += `<li><a href="/${n.folder}/${n.slug}">${escapeHtml(n.title)}</a></li>`;
    }
    html += `</ul>`;
  }
  return `${html}</nav>`;
}

function homeBody(notes, folders, seo) {
  const about = notes.find((n) => n.slug === "about-me");
  return `<div id="ssg-root">
<article>
<h1>Haider Toha</h1>
<p class="ssg-meta">${escapeHtml(seo.AUTHOR_TAGLINE)} · London, United Kingdom</p>
${about ? renderMarkdown(about.content) : ""}
</article>
${siteIndex(notes, folders, seo)}
${contactFooter(seo)}
</div>`;
}

function folderBody(folderId, notes, folders, seo) {
  const label = seo.FOLDER_LABELS[folderId] ?? folderId;
  const list = (folderId === "all" ? notes : notes.filter((n) => n.folder === folderId))
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const items = list
    .map(
      (n) =>
        `<li><h3><a href="/${n.folder}/${n.slug}">${escapeHtml(n.title)}</a></h3><p>${escapeHtml(
          seo.truncate(seo.stripMarkdown(n.content), 160),
        )}</p></li>`,
    )
    .join("");
  return `<div id="ssg-root">
<article>
<p class="ssg-crumbs"><a href="/">Haider Toha</a> › ${escapeHtml(label)}</p>
<h1>${escapeHtml(label)}</h1>
<ul class="ssg-list">${items}</ul>
</article>
${contactFooter(seo)}
</div>`;
}

function noteBody(note, notes, folders, seo) {
  const label = seo.FOLDER_LABELS[note.folder] ?? note.folder;
  return `<div id="ssg-root">
<article>
<p class="ssg-crumbs"><a href="/">Haider Toha</a> › <a href="/${note.folder}">${escapeHtml(label)}</a></p>
<h1>${escapeHtml(note.title)}</h1>
<p class="ssg-meta">by <a href="/profile/about-me" rel="author">Haider Toha</a> · <time datetime="${note.created_at}">${formatDate(note.created_at)}</time></p>
${renderMarkdown(note.content)}
</article>
${siteIndex(notes, folders, seo)}
${contactFooter(seo)}
</div>`;
}

// ---------------------------------------------------------------------------
// <head> fragment (injected before </head>)
// ---------------------------------------------------------------------------

function headTags(meta, jsonld, seo) {
  const url = seo.absUrl(meta.path);
  const ogDesc = meta.ogDescription ?? meta.description;
  const tags = [
    `<meta name="description" content="${attrEscape(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:title" content="${attrEscape(meta.title)}" />`,
    `<meta property="og:description" content="${attrEscape(ogDesc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${attrEscape(meta.title)}" />`,
    `<meta name="twitter:description" content="${attrEscape(ogDesc)}" />`,
  ];
  if (meta.ogType === "article" && meta.publishedTime) {
    tags.push(
      `<meta property="article:published_time" content="${meta.publishedTime}" />`,
      `<meta property="article:author" content="Haider Toha" />`,
    );
  }
  for (const obj of jsonld) tags.push(ldScript(obj));
  return tags.join("\n    ");
}

// ---------------------------------------------------------------------------
// Assemble a page from the built template
// ---------------------------------------------------------------------------

function renderPage(template, { meta, head, body }) {
  return template
    .replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`)
    // Drop the placeholder comments first (Vite may or may not keep them), then
    // inject before </head> and into the now-empty #root — robust either way.
    .replace(/<!--\s*SSG-(?:HEAD|BODY)\s*-->/gi, "")
    .replace(/<\/head>/i, `    ${head}\n  </head>`)
    .replace(/(<div id="root"[^>]*>)(<\/div>)/i, (_m, open, close) => `${open}${body}${close}`);
}

async function writeHtml(routePath, html) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html, "utf8");
  return rel;
}

function buildSitemap(entries, seo) {
  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${seo.absUrl(e.path)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const server = await createServer({
    root: ROOT,
    configFile: false,
    logLevel: "error",
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: "custom",
  });

  let notes, folders, seo;
  try {
    const constants = await server.ssrLoadModule("/constants.tsx");
    seo = await server.ssrLoadModule("/seo.ts");
    notes = constants.portfolioNotes;
    folders = constants.folders;
  } finally {
    await server.close();
  }

  const template = await fs.readFile(path.join(DIST, "index.html"), "utf8");
  if (!/<div id="root"/.test(template)) {
    throw new Error("dist/index.html has no #root div — did the build change?");
  }

  const person = seo.personJsonLd();
  const latest = notes.map((n) => n.created_at).sort().at(-1);
  const written = [];
  const sitemap = [];

  // Home
  {
    const meta = seo.homeMeta();
    const head = headTags(meta, [person, seo.websiteJsonLd(), seo.profilePageJsonLd()], seo);
    written.push(await writeHtml("/", renderPage(template, { meta, head, body: homeBody(notes, folders, seo) })));
    sitemap.push({ path: "/", lastmod: latest, changefreq: "weekly", priority: "1.0" });
  }

  // Folder landing pages (skip "all" — it duplicates home)
  for (const f of folders) {
    if (f.id === "all") continue;
    const meta = seo.folderMeta(f.id);
    const crumbs = seo.breadcrumbJsonLd([
      { name: "Haider Toha", path: "/" },
      { name: seo.FOLDER_LABELS[f.id] ?? f.name, path: `/${f.id}` },
    ]);
    const head = headTags(meta, [person, crumbs], seo);
    written.push(await writeHtml(`/${f.id}`, renderPage(template, { meta, head, body: folderBody(f.id, notes, folders, seo) })));
    const folderLatest =
      notes.filter((n) => n.folder === f.id).map((n) => n.created_at).sort().at(-1) ?? latest;
    sitemap.push({ path: `/${f.id}`, lastmod: folderLatest, changefreq: "weekly", priority: "0.7" });
  }

  // Notes (canonical /<folder>/<slug>)
  for (const note of notes) {
    const meta = seo.noteMeta(note);
    const crumbs = seo.breadcrumbJsonLd([
      { name: "Haider Toha", path: "/" },
      { name: seo.FOLDER_LABELS[note.folder] ?? note.folder, path: `/${note.folder}` },
      { name: note.title, path: meta.path },
    ]);
    const head = headTags(meta, [person, seo.articleJsonLd(note), crumbs], seo);
    written.push(await writeHtml(meta.path, renderPage(template, { meta, head, body: noteBody(note, notes, folders, seo) })));
    sitemap.push({
      path: meta.path,
      lastmod: note.created_at,
      changefreq: "monthly",
      priority: note.folder === "blog" ? "0.9" : "0.8",
    });
  }

  await fs.writeFile(path.join(DIST, "sitemap.xml"), buildSitemap(sitemap, seo), "utf8");

  console.log(
    `[prerender] wrote ${written.length} pages + sitemap.xml (${sitemap.length} urls) to dist/`,
  );
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
