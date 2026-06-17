# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio site styled to look exactly like the macOS/iOS **Apple Notes** app. It is a fully static, client-only React SPA — no backend, no database, no network calls. All content (the "notes") is hardcoded in `constants.tsx`. Deployed on Vercel.

## Commands

```bash
npm install      # install deps (package-lock.json is the tracked lockfile)
npm run dev      # Vite dev server on http://localhost:3000 (host 0.0.0.0)
npm run build    # production build to dist/
npm run preview  # serve the built dist/ locally
```

There is **no test runner, no linter, and no typecheck script**. `tsc` is configured with `noEmit` (type-check only) but is not wired into a script; Vite does not type-check on build. If you want to verify types, run `npx tsc --noEmit`.

> Note: an untracked `pnpm-lock.yaml` exists alongside the tracked `package-lock.json`. Stick to `npm` unless told otherwise.

## Editing content (the main task in this repo)

**All content lives in `constants.tsx`** as two exported arrays — there is no CMS or data fetching:

- `folders: Folder[]` — the sidebar folders. `"all"` is a special folder that aggregates every note.
- `portfolioNotes: Note[]` — every note. `content` is a markdown-ish string in a template literal.

To add/edit a note, edit `portfolioNotes`. Each note (`Note` in `types.ts`) requires:
- `slug` — **must be unique**; it is the URL segment (`/:folder/:slug`).
- `folder` — **must match a `folders[].id`**, or the note won't appear under that folder.
- `created_at` — ISO string; drives sort order (newest first) and the displayed date.
- `category`, `public`, `session_id` — legacy fields, not used for routing/filtering logic. Keep them present to satisfy the type.

Notes in the `"blog"` folder additionally get an auto-computed word count + reading time in the header (see `MainContent.tsx`).

## Architecture

Routing is in `index.tsx`: three routes (`/`, `/:folder`, `/:folder/:slug`) all render `<App />`. `vercel.json` rewrites every path to `/` so client-side routing works on deep links.

`App.tsx` is the single stateful container. It does **not** receive props — it reads `folder`/`slug` from the URL via `useParams`, resolves the matching note out of `portfolioNotes`, and owns theme + responsive (mobile/desktop) + sidebar-visibility state. The `"all"` folder is resolved specially (match by slug across all notes). Navigation is done by pushing URLs, not by setting "selected note" state.

Two presentational components:
- `components/Sidebar.tsx` — folder list + note list (two-column on desktop, drill-down navigation on mobile), plus client-side search over title/content/category. Note: `renderFoldersList`/`renderNotesList` are intentionally called as **functions**, not rendered as `<Components/>` — see the comment in the file; doing the latter remounts them on every parent render and loses scroll/focus.
- `components/MainContent.tsx` — renders the selected note.

### Custom markdown renderer (important)

`MainContent.tsx` contains a **hand-written, line-by-line markdown parser** — there is no markdown library. It supports a specific subset only: headings via bold lines, `- ` bullets, `**bold**`, `*italic*`, `[links](url)`, `![images](url)` (click-to-zoom modal), pipe tables, fenced code blocks, **KaTeX** math (inline `$...$`, block `$$...$$`), and **Mermaid** diagrams (` ```mermaid ` blocks, click-to-zoom/pan modal). Any new markdown syntax must be added to this renderer by hand — don't assume standard markdown works.

### Styling: Tailwind is CDN-based

There is **no `tailwind.config.js`, no PostCSS, no CSS build step.** Tailwind is loaded from `https://cdn.tailwindcss.com` in `index.html`, and the **entire custom theme** (the `apple-*` color palette, SF Pro font stack, `darkMode: 'class'`) is configured inline in a `<script>` block in `index.html`. To add a custom color/token or change the theme, edit `index.html` — not a config file.

### Dark mode

Driven by the `dark` class on `<html>`. `App.tsx` toggles it and initializes from `prefers-color-scheme`. `MainContent.tsx` uses a `MutationObserver` on the `<html>` class to re-render Mermaid diagrams with theme-appropriate colors when the mode changes.

## Vestigial scaffolding

This repo was generated from Google AI Studio. `vite.config.ts` injects `process.env.API_KEY` / `process.env.GEMINI_API_KEY` from the environment, and `README.md` mentions setting `GEMINI_API_KEY` — **but no source file uses it and the app makes no API calls.** Ignore the Gemini setup unless you are deliberately adding AI features.
