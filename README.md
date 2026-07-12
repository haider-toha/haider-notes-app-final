# Notes

A personal site built to look and feel exactly like the macOS / iOS **Apple Notes** app. It's a fast, fully static single-page app — the whole "notebook" (profile, writing, projects, finds, reflections) is content, rendered through a faithful recreation of the Notes interface.

Live at **[haidertoha.site](https://www.haidertoha.site)**.

## Features

- Pixel-faithful Apple Notes UI — sidebar folders, note list and editor pane, with the same typography, spacing and yellow accent.
- Responsive: a two-column split view on desktop, drill-down navigation on mobile.
- Light / dark mode that follows the system preference.
- Instant client-side search across every note's title and content.
- A hand-written markdown renderer with headings, lists, tables, links, click-to-zoom images, fenced code, **KaTeX** math and **Mermaid** diagrams.
- Deep-linkable notes (`/:folder/:slug`), prerendered to static HTML at build time for SEO and rich link previews.

## Tech

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **React Router** for client-side routing
- **Tailwind CSS** with an inline theme
- **KaTeX** and **Mermaid** for math and diagrams
- Deployed as a static site on **Vercel**

No backend, no database, no external API calls — everything ships as static assets.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:3000
npm run build    # production build to dist/ (also prerenders every route)
npm run preview  # serve the built dist/ locally
```

## Editing content

All content lives in `constants.tsx` as two arrays:

- `folders` — the sidebar folders.
- `portfolioNotes` — every note, each with a `slug`, `folder`, `created_at` and markdown `content`.

Add or edit an entry there and it appears automatically; the build also generates that note's prerendered page and a `sitemap.xml` entry.

## Project structure

```
index.tsx               # entry point + routes
App.tsx                 # stateful container (routing, theme, layout)
components/
  Sidebar.tsx           # folders + note list + search
  MainContent.tsx       # note renderer (markdown, math, diagrams)
constants.tsx           # all content (folders + notes)
seo.ts                  # titles, descriptions and structured data
scripts/prerender.mjs   # build-time static-HTML generation
```

## Deployment

Push to the connected Vercel project. `npm run build` produces the static `dist/`, including a prerendered HTML file per route plus `sitemap.xml` and `robots.txt`. `vercel.json` handles clean URLs and client-side routing fallback.

---

Personal project. © Haider Toha.
