# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio site presented as an interactive handwritten notebook. It is a static, client-only React SPA with no application backend, database, or runtime content fetching. Vercel Analytics collects site usage. All content (the "notes") is hardcoded in `constants.tsx`. Deployed on Vercel.

At **build time** every route is additionally prerendered to real static HTML for SEO / crawler-and-recruiter scraping (see "SEO & prerendering" below). React still boots and takes over at runtime; the prerender is purely so non-JS clients get real content.

## Commands

```bash
npm install      # install deps (package-lock.json is the tracked lockfile)
npm run dev      # Vite dev server on http://localhost:3000 (host 0.0.0.0)
npm run build    # vite build to dist/, then `node scripts/prerender.mjs` (SEO prerender)
npm run prerender # re-run only the prerender step against an existing dist/
npm run preview  # serve the built dist/ locally
```

There is no test-framework runner, linter, or package typecheck script. Standalone regression scripts live in `scripts/check-notebook*.mjs`. `tsc` is configured with `noEmit` (type-check only) but is not wired into a script; Vite does not type-check on build. If you want to verify types, run `npx tsc --noEmit`.

> Use `npm` and the tracked `package-lock.json`; do not create a second package-manager lockfile.

## Editing content (the main task in this repo)

**All content lives in `constants.tsx`** as two exported arrays — there is no CMS or data fetching:

- `folders: Folder[]` — the contents groups. `"all"` is a special folder that aggregates every note.
- `portfolioNotes: Note[]` — every note. `content` is a markdown-ish string in a template literal.

To add/edit a note, edit `portfolioNotes`. Each note (`Note` in `types.ts`) requires:
- `slug` — **must be unique**; it is the URL segment (`/:folder/:slug`).
- `folder` — **must match a `folders[].id`**, or the note won't appear under that folder.
- `created_at` — ISO date metadata. Notebook reading order follows `portfolioNotes`, not a date sort.
- `category`, `public`, `session_id` — retain the fields required by `Note`; category supplies a folder fallback where necessary.

The notebook preserves every note’s authored content; do not add summary metadata or rewrite source text to fill paper.

## Architecture

Routing is in `index.tsx`; root, notebook, folder, note, and fallback routes render `<App />`. `App.tsx` resolves contents and reading positions. `vercel.json` uses `cleanUrls`, redirects the apex to `https://www.haidertoha.site`, and keeps a catch-all rewrite to `/` **as a fallback only** — Vercel checks the filesystem first, so the prerendered `dist/<folder>/<slug>/index.html` files are served for real routes and the rewrite only catches unknown paths (preserving client-side routing there).

### SEO & prerendering (build-time)

The app is client-only, so the raw HTML Vite emits is an empty `#root` — invisible to non-JS crawlers and recruiter/ATS scrapers. `scripts/prerender.mjs` fixes this: after `vite build` it loads the note data through Vite's SSR runner and writes a real static HTML file per route (home, each folder, each note) plus `sitemap.xml`. `public/robots.txt` points at the sitemap.

Key rules when editing:
- **`seo.ts` is the single source of truth** for titles, descriptions, canonicals, and the `Person`/`WebSite`/`Article` JSON-LD. It's imported by BOTH the prerender script and `App.tsx` (which updates `document.title`/meta on client-side navigation), so they never drift. Change SEO copy there.
- **Canonical origin is `https://www.haidertoha.site`** (set in `seo.ts` as `SITE_URL`). If the production domain ever changes, update that constant and `public/robots.txt`.
- **Adding a note needs nothing extra** — the prerenderer enumerates `portfolioNotes`, so a new note automatically gets its own prerendered page + sitemap entry on the next build.
- The prerenderer has its **own minimal markdown→HTML converter** (a subset: headings, bullets, bold/italic, links, images, code, tables; math/mermaid are dropped). It is intentionally separate from `MainContent.tsx`'s full renderer — it only needs crawlable text, not visual fidelity. New markdown syntax does not have to be added here unless you care about how it reads to a crawler.
- The prerendered body is injected into `#root` as `<div id="ssg-root">`; `index.html` hides it via `html.js #ssg-root { display:none }` the instant JS is available, so it never flashes for real users but stays fully readable to non-JS clients.

`App.tsx` routes `/` and `/notebook` to the about-me page, regardless of saved reading position. `/contents` opens the preliminary contents leaves. `/all`, folder routes, and published note URLs open their corresponding reading pages. Explicit contents and note navigation update browser history and canonical metadata. The “← contents” link at the upper left of each desktop spread or mobile page navigates to `/contents`; “continue reading →” restores the saved source page and its canonical note URL.

`LinedNotebook.tsx` owns the page engine and visible leaves. `NotebookContents.tsx` supplies two preliminary contents leaves in the same page-turn engine. `notebookPages.ts` preserves source bytes while paginating; `notebookPlace.ts` stores note IDs and source offsets so changing pagination does not lose the reading position. `MainContent.tsx` supplies the complete content renderer.

### Mobile layout and gestures

`LinedNotebook.tsx` applies `.is-mobile` at `(max-width: 700px)` or `(max-height: 500px) and (pointer: coarse)`. Keep all phone appearance changes scoped through that class in `NotebookMobile.css`; short phone landscape uses the focused page, and desktop appearance otherwise stays unchanged. The approved shared exceptions are tighter equation-to-prose spacing and a paper-height cap to the available desk space on short desktop viewports; standard desktop pages remain 720px. The engine uses the available viewport height capped at `pageWidth * 1.85`, rather than scaling a desktop spread. Safe-area desk margins keep the full page outline, binding, neighboring ink sliver, and bottom/right stacks visible.

Keep mobile body text at 23px on the existing 29px ruling. Source pagination and source-offset URLs remain shared with desktop; overflow scrolls natively within `.notebook-writing`. Show only a previous link on mobile, except on the first contents leaf; no next button. Full-height 20px side grips and 44px corner areas claim fold gestures; navigation links remain above their hit areas. A deliberate outward pull and hold on the right grip detaches a sheet; vertical prose gestures must never detach or turn it. Detached prose still scrolls; its header or grips move the paper. Retain native pinch and horizontal equation/table panning by leaving general book and writing touch handling at `auto`. Defer geometry updates while a fold or captured page gesture is active. See [mobile research and decisions](docs/mobile-notebook.md).

### Custom markdown renderer (important)

`MainContent.tsx` contains a **hand-written, line-by-line markdown parser** — there is no markdown library. It supports a specific subset only: headings via bold lines, `- ` bullets, `**bold**`, `*italic*`, `[links](url)`, `![images](url)` (click-to-zoom modal), pipe tables, fenced code blocks, **KaTeX** math (inline `$...$`, block `$$...$$`), and **Mermaid** diagrams (` ```mermaid ` blocks, click-to-zoom/pan modal). Any new markdown syntax must be added to this renderer by hand — don't assume standard markdown works.

### Styling: Tailwind is CDN-based

There is **no `tailwind.config.js`, no PostCSS, no CSS build step.** Tailwind is loaded from `https://cdn.tailwindcss.com` in `index.html`, and the custom `note` color tokens are configured inline in a `<script>` block in `index.html`. To add a custom color/token or change the theme, edit `index.html` — not a config file.

### Notebook appearance

The main notebook uses ivory paper, blue-black ink and locally hosted handwriting fonts. It clears legacy dark appearance on entry. Expanded diagrams and images have their own accessible paper-colored media viewer. All diagram SVGs fit within page width and a 450px height cap; the complete viewBox remains visible, with expansion for closer reading.

## Interactive notebook constraints

The main site and its contents and reading routes use `components/LinedNotebook.tsx` and its CSS. Preserve the approved minimal desktop design: Reenie Beanie handwriting with Notebook Math for equations and simulation labels, no toolbar/footer, standard page numbers, ↗ markers on every content hyperlink, new-tab link targets and matching subtle curved underlines.

Pack consecutive profile paragraphs into page-length passages; never restore one paragraph per page. Keep source text and links intact, and balance the final reading pages. Verify actual rendered height after the font loads. Keep the opening identity page. All notebook content is authored in `constants.tsx`; do not add scratchpads, editing controls or local draft storage. Handle odd page counts without adding blank editor pages.

Desktop page grabs must work along either outer edge without hover curls; mobile uses all four corners and full-height side grips. The page-flip engine takes corner coordinates: preserve the grab anchor plus pointer displacement mapping. Feeding raw mid-edge positions into the engine makes a tiny grab fold half the sheet. Verify small pulls settle back, full pulls turn, and links still work after pagination changes.

`components/useLooseSheet.ts` manages the removable-sheet gesture separately from ordinary page turns. Keep outward resistance/hold detection separate from inward turning, and preserve movement-relative corner anchors. The loose sheet must use the source's captured presentation and scroll position; do not move its running heading or restyle it on detach. Render the underlying sheet's real content. Drag rotation responds to velocity and grab position, not a constant tilted pose. Reattachment is spatial at the spine; do not add a "Put back" button. Verify small-pull cancellation, normal turns, detach/reattach, source/loose layout equality, and detached content and links.

Notebook paper details: `notebookDetails.ts` owns a small post-turn settle on the inner sheet only, changing stack depths and decorative reverse ink. Never animate the engine-owned leaf transform. The book has two actual preliminary contents leaves, numbered i and ii, followed by reading pages numbered from 1. `NotebookContents` groups all 27 notes across these leaves (14/13), with plain ink navigation and page numbers. Show the contents title on the left only; preserve an equal-height spacer on the right so groups align. A small ink control at the upper left of each desktop spread or mobile page navigates to `/contents` or returns to the remembered reading spread at its canonical note URL. About me is the default landing surface even when a reading position is saved; contents remains accessible through the top-of-page link and its own route. There are no bookmark ribbons, protruding tabs or contents popups. Keep the engine's two-page contents offset separate from source-page indices used in routes, source audits and saved reading positions. The guarded reading-position key stores a note ID and source offset, never draft content; unavailable storage must not break reading.

Regression: StPageFlip marks an odd final page hard even when showCover is false, and that makes its neighboring face turn rigidly too. `loadNotebookPages` must restore all notebook pages to soft density after loading. Test actual polygon folding, not only page-number changes. Browser checks: with Vite running, run `node scripts/check-notebook.mjs` with Playwright available; `PLAYWRIGHT_MODULE` can point to an external installation.


## Content and media verification

Run `node scripts/check-notebook-content.mjs` for exact source reconstruction, rich-block integrity, heading placement, local media assets, and saved-position round trips. Browser suites `check-notebook.mjs`, `check-notebook-routes.mjs`, `check-notebook-figures.mjs`, `check-notebook-math.mjs`, and `check-notebook-modals.mjs` cover the live notebook. They use `NOTEBOOK_ORIGIN` (default `http://127.0.0.1:3000`) and can import Playwright through `PLAYWRIGHT_MODULE` when it is installed outside the repository.

For mobile changes, verify actual touch events on 320×568, 390×844, and 430×932 plus phone landscape. Include inner scrolling, wide equations, both contents leaves, full and cancelled folds, page-owned controls, loose prose scrolling and reattachment, pinch, preserved source offsets, reduced motion, and resizing after a fold. Compare desktop contents, prose, diagram, matrix, and simulation screenshots to their existing baselines; mobile acceptance does not replace desktop regression checks.

`notebookDiagramGeometry.json` records measured live SVG geometry for deterministic page packing. Rebuild it with `node scripts/measure-notebook-diagrams.mjs` against the Vite dev server after changing Mermaid content, typography, or renderer options. The diagrams themselves still render live.

Notebook Math extends the committed Reenie Beanie font with handwritten mathematical symbols under the OFL. `node scripts/collect-notebook-math-glyphs.mjs` regenerates the source equation glyph inventory. `python scripts/build-notebook-math-font.py` rebuilds the derivative font with Python 3.11+, fonttools, and brotli. Preserve licenses, and use the math browser audit to verify every emitted glyph and simulation label.
