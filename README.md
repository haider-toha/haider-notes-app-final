# Notes

A personal site presented as a handwritten, interactive notebook. All profile, writing, project, finds and reflection content comes from `constants.tsx`.

Live at **[haidertoha.site](https://www.haidertoha.site)**.

## Features

- Lined paper, flexible page turns, changing paper stacks and removable sheets.
- Two preliminary contents leaves list every note, with one title on the left and an ink link to open contents or return to reading.
- Home opens the about-me page; the contents link stays at the top left of each desktop spread and every mobile page.
- Two-page desktop spreads and viewport-fit mobile reading with a visible binding, neighboring-page sliver, and page stacks.
- Transparent hand-drawn diagrams, live physics simulations and handwritten equations.
- Accessible expanded media with zoom, pan, keyboard controls and visible close buttons.
- Existing note URLs (`/:folder/:slug`) open their notebook pages; build-time HTML preserves SEO and link previews.
- Exact source-content checks and browser regressions in `scripts/check-notebook*.mjs`.

The routes `/` and `/notebook` open the about-me page, including on return visits. `/contents` opens the two contents leaves. `/all` and published note URLs open reading pages. The quiet ink control at the upper left of each desktop spread or mobile page navigates to `/contents` or back to the remembered page’s canonical note URL.

On phones, the actual paper fits the available viewport and is capped at 1.85 times its width. Handwriting stays at 23px; longer passages scroll inside the page. The paper turns through finger drags on all four corners and its full-height 20px side grips; a previous link allows going back, while forward turns use the paper. Pull and hold the right grip outward to detach a sheet; scroll its prose normally and drag its header or grips to move it. Wide equations and tables retain horizontal scrolling, and browser pinch remains available. Short, coarse-pointer landscape screens use the same focused layout. Engine resizing waits until an active fold finishes; mobile rules preserve standard desktop geometry. Short desktop viewports cap paper height to the available desk space; taller desktop pages remain 720px. The small equation-to-prose spacing refinement applies across layouts. See the [mobile notebook research and interaction contract](docs/mobile-notebook.md).

## Tech

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **React Router** for client-side routing
- **Tailwind CSS v3** compiled locally with notebook theme tokens
- **KaTeX** and **Mermaid** for math and diagrams
- Deployed as a static site on **Vercel**

Authored content and simulations ship as static assets, with no application backend or database. Vercel Analytics collects site usage.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:3000
npm run build    # production build to dist/ (also prerenders every route)
npm run preview  # serve the built dist/ locally
```

## Editing content

All content lives in `constants.tsx` as two arrays:

- `folders` — the contents groups.
- `portfolioNotes` — every note, each with a `slug`, `folder`, `created_at` and markdown `content`.

Add or edit an entry there and it appears automatically; the build also generates that note's prerendered page and a `sitemap.xml` entry.

## Project structure

```
index.tsx               # entry point + routes
App.tsx                 # notebook routes, canonical links and metadata
components/
  LinedNotebook.tsx      # page engine, reading state and live leaves
  NotebookContents.tsx  # two preliminary contents leaves
  NotebookMobile.css    # scoped phone geometry, paper context and touch controls
  NotebookSheet.tsx     # memoized live page faces
  notebookPages.ts      # reconstruct pages from generated source offsets
  notebookPageCuts.json # current and legacy bookmark page boundaries
  MainContent.tsx       # note renderer (markdown, math, diagrams)
  renderMermaid.ts      # lazy diagram renderer and reusable SVG cache
constants.tsx           # all content (folders + notes)
seo.ts                  # titles, descriptions and structured data
scripts/prerender.mjs   # build-time static-HTML generation
scripts/notebookPagination.ts # source-preserving page-packing algorithm
scripts/generate-notebook-pages.mjs # build/dev pagination generation
```

## Verification

Install Chromium once with `npx playwright install chromium`, then run `npm run check`. It checks types, generated pagination freshness and exact source preservation, builds the site, starts its own servers, and runs the desktop/mobile, navigation, media, table, simulation and engine lifecycle regressions. Playwright is a development dependency; no test tooling ships to readers. `PLAYWRIGHT_MODULE` still supports an external installation.

For additional WebKit desktop/mobile smoke coverage, install it with `npx playwright install webkit` and run `NOTEBOOK_WEBKIT=1 npm run check`. This complements physical-device testing. See the [performance report](docs/performance.md) and [complete diagram audit](docs/diagram-audit.md).

For individual browser scripts, `NOTEBOOK_ORIGIN` selects a running server. Most tests support the production preview; the internal-link and engine-isolation fixtures require Vite development modules. `npm run check:performance` measures a built production preview with three cold/warm runs for desktop and mobile CPU throttling. Run it separately from other browser jobs. Set `NOTEBOOK_PERFORMANCE_OUTPUT` to save JSON or `NOTEBOOK_THROTTLE_NETWORK=1` for a 150ms/1.6Mbps network profile. These are local diagnostics, not field Core Web Vitals.

Vite regenerates `notebookPageCuts.json` at build/dev startup and after relevant content changes. Commit that file with content edits; `npm run generate:pages` refreshes it manually. `npm run check:pages` catches stale cuts and requires unchanged source to retain every original reading and legacy-bookmark boundary.

Tables use the same handwriting and ink as prose. Wide phone tables pan horizontally with touch, wheel or focused arrow keys. Mermaid loads only near diagram pages and caches completed SVGs with unique IDs for each live copy. Equation markup is cached synchronously to retain exact layout. The page engine draws on demand and is pinned to page-flip 2.0.7; run lifecycle checks before upgrading it. Simulation buffers follow their displayed size and preserve the original integration steps.

After changing Mermaid source or typography, run `scripts/measure-notebook-diagrams.mjs` against the dev server. It reports current SVG geometry to `/tmp/notebook-diagram-geometry.json`; `NOTEBOOK_DIAGRAM_GEOMETRY_OUTPUT` selects another report path. Existing entries in `notebookDiagramGeometry.json` are the published inline allocations shared by rendering and pagination; keep them stable when correcting labels. New source hashes need measured allocations added deliberately. Run the figure and diagram-legibility checks after any such edit. Mathematical font changes use `scripts/collect-notebook-math-glyphs.mjs` and `scripts/build-notebook-math-font.py`; keep their generated files and OFL licenses together.

Mobile acceptance should exercise real touch scrolling, horizontal equation panning, both contents leaves, forward/backward grip folds, detached-sheet reading and reattachment, pinch, reduced motion, and portrait/landscape resizing. Compare desktop contents, prose, diagram, matrix, and simulation views against their baselines, accounting for the approved equation-spacing refinement and short-viewport height cap.

## Deployment

Push to the connected Vercel project. `npm run build` produces the static `dist/`, including a prerendered HTML file per route plus `sitemap.xml` and `robots.txt`. `vercel.json` handles clean URLs and client-side routing fallback.

---

Personal project. © Haider Toha.
