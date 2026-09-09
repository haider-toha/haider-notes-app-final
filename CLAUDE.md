# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio site presented as an interactive handwritten notebook. It is a fully static, client-only React SPA — no backend, no database, no network calls. All content (the "notes") is hardcoded in `constants.tsx`. Deployed on Vercel.

At **build time** every route is additionally prerendered to real static HTML for SEO / crawler-and-recruiter scraping (see "SEO & prerendering" below). React still boots and takes over at runtime; the prerender is purely so non-JS clients get real content.

## Commands

```bash
npm install      # install deps (package-lock.json is the tracked lockfile)
npm run dev      # Vite dev server on http://localhost:3000 (host 0.0.0.0)
npm run build    # vite build to dist/, then `node scripts/prerender.mjs` (SEO prerender)
npm run prerender # re-run only the prerender step against an existing dist/
npm run preview  # serve the built dist/ locally
```

There is **no test runner, no linter, and no typecheck script**. `tsc` is configured with `noEmit` (type-check only) but is not wired into a script; Vite does not type-check on build. If you want to verify types, run `npx tsc --noEmit`.

> Use `npm` and the tracked `package-lock.json`; do not create a second package-manager lockfile.

## Editing content (the main task in this repo)

**All content lives in `constants.tsx`** as two exported arrays — there is no CMS or data fetching:

- `folders: Folder[]` — the contents groups. `"all"` is a special folder that aggregates every note.
- `portfolioNotes: Note[]` — every note. `content` is a markdown-ish string in a template literal.

To add/edit a note, edit `portfolioNotes`. Each note (`Note` in `types.ts`) requires:
- `slug` — **must be unique**; it is the URL segment (`/:folder/:slug`).
- `folder` — **must match a `folders[].id`**, or the note won't appear under that folder.
- `created_at` — ISO string; drives sort order (newest first) and the displayed date.
- `category`, `public`, `session_id` — legacy fields, not used for routing/filtering logic. Keep them present to satisfy the type.

The notebook preserves every note’s authored content; do not add summary metadata or rewrite source text to fill paper.

## Architecture

Routing is in `index.tsx`: three routes (`/`, `/:folder`, `/:folder/:slug`) all render `<App />`. `vercel.json` uses `cleanUrls`, redirects the apex to `https://www.haidertoha.site`, and keeps a catch-all rewrite to `/` **as a fallback only** — Vercel checks the filesystem first, so the prerendered `dist/<folder>/<slug>/index.html` files are served for real routes and the rewrite only catches unknown paths (preserving client-side routing there).

### SEO & prerendering (build-time)

The app is client-only, so the raw HTML Vite emits is an empty `#root` — invisible to non-JS crawlers and recruiter/ATS scrapers. `scripts/prerender.mjs` fixes this: after `vite build` it loads the note data through Vite's SSR runner and writes a real static HTML file per route (home, each folder, each note) plus `sitemap.xml`. `public/robots.txt` points at the sitemap.

Key rules when editing:
- **`seo.ts` is the single source of truth** for titles, descriptions, canonicals, and the `Person`/`WebSite`/`Article` JSON-LD. It's imported by BOTH the prerender script and `App.tsx` (which updates `document.title`/meta on client-side navigation), so they never drift. Change SEO copy there.
- **Canonical origin is `https://www.haidertoha.site`** (set in `seo.ts` as `SITE_URL`). If the production domain ever changes, update that constant and `public/robots.txt`.
- **Adding a note needs nothing extra** — the prerenderer enumerates `portfolioNotes`, so a new note automatically gets its own prerendered page + sitemap entry on the next build.
- The prerenderer has its **own minimal markdown→HTML converter** (a subset: headings, bullets, bold/italic, links, images, code, tables; math/mermaid are dropped). It is intentionally separate from `MainContent.tsx`'s full renderer — it only needs crawlable text, not visual fidelity. New markdown syntax does not have to be added here unless you care about how it reads to a crawler.
- The prerendered body is injected into `#root` as `<div id="ssg-root">`; `index.html` hides it via `html.js #ssg-root { display:none }` the instant JS is available, so it never flashes for real users but stays fully readable to non-JS clients.

`App.tsx` routes `/`, `/contents`, and `/notebook` to the preliminary contents leaves, regardless of saved reading position. `/all`, folder routes, and published note URLs open their corresponding reading pages. Explicit contents and note navigation update browser history and canonical metadata. The “← contents” link inside the paper’s upper-left margin navigates to `/contents`; “continue reading →” restores the saved source page and its canonical note URL. `/book-test` remains a separate photographed prototype. The Apple Notes sidebar and application shell have been removed.

`LinedNotebook.tsx` owns the page engine and visible leaves. `NotebookContents.tsx` supplies two preliminary contents leaves in the same page-turn engine. `notebookPages.ts` preserves source bytes while paginating; `notebookPlace.ts` stores note IDs and source offsets so changing pagination does not lose the reading position. `MainContent.tsx` supplies the complete content renderer.

### Custom markdown renderer (important)

`MainContent.tsx` contains a **hand-written, line-by-line markdown parser** — there is no markdown library. It supports a specific subset only: headings via bold lines, `- ` bullets, `**bold**`, `*italic*`, `[links](url)`, `![images](url)` (click-to-zoom modal), pipe tables, fenced code blocks, **KaTeX** math (inline `$...$`, block `$$...$$`), and **Mermaid** diagrams (` ```mermaid ` blocks, click-to-zoom/pan modal). Any new markdown syntax must be added to this renderer by hand — don't assume standard markdown works.

### Styling: Tailwind is CDN-based

There is **no `tailwind.config.js`, no PostCSS, no CSS build step.** Tailwind is loaded from `https://cdn.tailwindcss.com` in `index.html`, and the **entire custom theme** (the `apple-*` color palette, SF Pro font stack, `darkMode: 'class'`) is configured inline in a `<script>` block in `index.html`. To add a custom color/token or change the theme, edit `index.html` — not a config file.

### Notebook appearance

The main notebook uses ivory paper, blue-black ink and locally hosted handwriting fonts. It clears legacy dark appearance on entry. Expanded diagrams and images have their own accessible paper-colored media viewer. All diagram SVGs fit within page width and a 450px height cap; the complete viewBox remains visible, with expansion for closer reading.

## Interactive notebook constraints

The main site and `/notebook` use `components/LinedNotebook.tsx` and its CSS; `/book-test` is a separate photographed prototype. Preserve the approved minimal desktop design: Reenie Beanie only, no toolbar/footer, standard page numbers, external-link arrows and matching subtle curved underlines.

Pack consecutive profile paragraphs into page-length passages; never restore one paragraph per page. Keep source text and links intact, and balance the final reading pages. Verify actual rendered height after the font loads. Keep the opening identity page. All notebook content is authored in `constants.tsx`; do not add scratchpads, editing controls or local draft storage. Handle odd page counts without adding blank editor pages.

Page grabs must work along either outer edge without hover curls. The page-flip engine takes corner coordinates: preserve the grab anchor plus pointer displacement mapping. Feeding raw mid-edge positions into the engine makes a tiny grab fold half the sheet. Verify small pulls settle back, full pulls turn, and links still work after pagination changes.

`components/useLooseSheet.ts` manages the removable-sheet gesture separately from ordinary page turns. Keep outward resistance/hold detection separate from inward turning, and preserve movement-relative corner anchors. The loose sheet must use the source's captured presentation and scroll position; do not move its running heading or restyle it on detach. Render the underlying sheet's real content. Drag rotation responds to velocity and grab position, not a constant tilted pose. Reattachment is spatial at the spine; do not add a "Put back" button. Verify small-pull cancellation, normal turns, detach/reattach, source/loose layout equality, and detached content and links.

Notebook paper details: `notebookDetails.ts` owns a small post-turn settle on the inner sheet only, changing stack depths and decorative reverse ink. Never animate the engine-owned leaf transform. The book has two actual preliminary contents leaves, numbered i and ii, followed by reading pages numbered from 1. `NotebookContents` groups all 27 notes across these leaves (14/13), with plain ink navigation and page numbers. A small ink control inside the paper’s upper-left margin navigates to `/contents` or returns to the remembered reading spread at its canonical note URL. Contents is the default landing surface even when a reading position is saved. There are no bookmark ribbons, protruding tabs or contents popups. Keep the engine's two-page contents offset separate from source-page indices used in routes, source audits and saved reading positions. The guarded reading-position key stores a note ID and source offset, never draft content; unavailable storage must not break reading.

Regression: StPageFlip marks an odd final page hard even when showCover is false, and that makes its neighboring face turn rigidly too. `loadNotebookPages` must restore all notebook pages to soft density after loading. Test actual polygon folding, not only page-number changes. Browser checks: with Vite running, run `node scripts/check-notebook.mjs` with Playwright available; `PLAYWRIGHT_MODULE` can point to an external installation.
