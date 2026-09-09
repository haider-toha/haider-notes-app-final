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

On phones, the actual paper fits the available viewport and is capped at 1.85 times its width. Handwriting stays at 23px; longer passages scroll inside the page. The paper turns through finger drags on its 20px side grips; no previous/next buttons are shown. Pull and hold the right grip outward to detach a sheet; scroll its prose normally and drag its header or grips to move it. Wide equations and tables retain horizontal scrolling, and browser pinch remains available. Short, coarse-pointer landscape screens use the same focused layout. Engine resizing waits until an active fold finishes; mobile rules preserve standard desktop geometry. Short desktop viewports cap paper height to the available desk space; taller desktop pages remain 720px. The small equation-to-prose spacing refinement applies across layouts. See the [mobile notebook research and interaction contract](docs/mobile-notebook.md).

## Tech

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **React Router** for client-side routing
- **Tailwind CSS** with an inline theme
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
  notebookPages.ts      # source-preserving pagination
  MainContent.tsx       # note renderer (markdown, math, diagrams)
constants.tsx           # all content (folders + notes)
seo.ts                  # titles, descriptions and structured data
scripts/prerender.mjs   # build-time static-HTML generation
```

## Verification

Run `npx tsc --noEmit` and `node scripts/check-notebook-content.mjs` for type and exact-content checks. With the Vite server running, the browser scripts in `scripts/check-notebook*.mjs` cover page interactions, routes, figures, handwritten math, and expanded media. They require Playwright; `PLAYWRIGHT_MODULE` can point to an external installation, and `NOTEBOOK_ORIGIN` overrides the default local server URL.

After changing Mermaid source or typography, run `scripts/measure-notebook-diagrams.mjs` against the dev server. Mathematical font changes use `scripts/collect-notebook-math-glyphs.mjs` and `scripts/build-notebook-math-font.py`; keep their generated files and OFL licenses together.

Mobile acceptance should exercise real touch scrolling, horizontal equation panning, both contents leaves, forward/backward grip folds, detached-sheet reading and reattachment, pinch, reduced motion, and portrait/landscape resizing. Compare desktop contents, prose, diagram, matrix, and simulation views against their baselines, accounting for the approved equation-spacing refinement and short-viewport height cap.

## Deployment

Push to the connected Vercel project. `npm run build` produces the static `dist/`, including a prerendered HTML file per route plus `sitemap.xml` and `robots.txt`. `vercel.json` handles clean URLs and client-side routing fallback.

---

Personal project. © Haider Toha.
