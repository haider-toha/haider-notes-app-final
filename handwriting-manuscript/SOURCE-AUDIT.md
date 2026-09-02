# Source audit

Proof that the handwriting manuscript is a lift-and-shift of the published website notes. Conversion removed markdown/JSX syntax only. Naive regression (below) matches word sequence, letter sequence and punctuation sequence for every published note.

## Totals

| Metric | Count |
|---|---:|
| Published notes converted | 27 |
| Physical notebook pages | 241 |
| External-link occurrences (`↗`) | 19 |
| Internal-link occurrences (`→ [Nxx]`) | 0 |
| Images or media assets (`[IMAGE:]`) | 4 |

Naive regression across all published note bodies (markdown syntax stripped on the source side; page chrome / `↗` / `[IMAGE:…]` / `[CODE START|END]` stripped on the manuscript side):

| Check | Source | Manuscript | Match |
|---|---:|---:|---|
| Word tokens (letters+digits runs, order-sensitive) | 33,231 | 33,231 | exact sequence |
| Alphanumeric characters | 150,114 | 150,114 | exact sequence |
| Punctuation inventory `.,;:!?…'"“”‘’()[]{}—–-` | 7,357 | 7,357 | exact sequence |

## Content-bearing files inspected

| File | Role | In manuscript? |
|---|---|---|
| `constants.tsx` | All published notes (`portfolioNotes`) and folder names | Yes — note bodies only |
| `types.ts` | Type shapes only | No |
| `App.tsx` | Routing, theme, share | No — UI chrome |
| `components/Sidebar.tsx` | Folder list, search, dates, previews | No — UI chrome |
| `components/MainContent.tsx` | Markdown renderer, date/word-count header, image/iframe/mermaid UI | No — renderer, not content |
| `index.tsx` | Route table | No |
| `index.html` | Theme, fonts, `rel=me` social URLs | No — SEO/chrome |
| `seo.ts` | Titles, meta descriptions, JSON-LD, rewritten bios | No — crawler-only, rewritten |
| `scripts/prerender.mjs` | Build-time HTML, contact footer, site index | No — crawler-only; JS users never see `#ssg-root` |
| `metadata.json` | Unused tooling label | No |
| `README.md` | Repo docs | No |
| `CLAUDE.md` | Agent notes | No |
| `public/robots.txt` | Crawler policy | No |
| `public/favicon.svg` | Tab icon | No |
| `public/dynamical_systems/*.html` | Three interactive simulations | Yes — as `[IMAGE:]` overlays for N08 |
| `public/sahad_tulip.png` | Referenced by N06, **file not in the repo** | Placeholder only |

## Notes found (published `portfolioNotes`)

27 notes. Stable IDs `N01`–`N27` are assigned in manuscript order and must stay fixed even if photographed page numbers change.

## Manuscript order

Inferred from the live UI, not from array position in `constants.tsx`:

1. Sidebar folder order from `folders` (skip `all`): profile → blog → projects → finds → reflections.
2. Inside a folder: pinned notes first, then `created_at` descending (same sort as `Sidebar.tsx`).

Default landing note on desktop is `portfolioNotes[0]` (`about-me`), which is also first in this order.

| ID | Title | Folder | `created_at` (UTC date) | Pinned |
|---|---|---|---|---|
| N01 | about me | profile | 2026-06-12 | yes |
| N02 | current focus | profile | 2026-05-29 | yes |
| N03 | stack & gear | profile | 2026-04-03 | yes |
| N04 | operating principles | profile | 2026-03-18 | yes |
| N05 | experience | profile | 2026-03-01 | yes |
| N06 | the training set was us | blog | 2026-07-07 | no |
| N07 | merkle sync | blog | 2026-07-06 | no |
| N08 | what constraints do to momentum | blog | 2026-07-03 | no |
| N09 | holding has no shape | blog | 2026-01-28 | no |
| N10 | the $10b shortcut | blog | 2026-01-09 | no |
| N11 | a small lit circle | blog | 2026-01-03 | no |
| N12 | the moonshot that leaked | blog | 2025-12-28 | no |
| N13 | i have everything but nothing at all | blog | 2025-12-01 | no |
| N14 | reading without reading | blog | 2025-11-01 | no |
| N15 | two faces of desire | blog | 2025-08-27 | no |
| N16 | gold medal, one blind spot | blog | 2025-08-03 | no |
| N17 | self-engineering agent | projects | 2025-09-18 | no |
| N18 | parallel navier-stokes solver | projects | 2025-08-15 | no |
| N19 | fpl analyser | projects | 2025-07-22 | no |
| N20 | global sentiment engine | projects | 2025-06-10 | no |
| N21 | food adventures | finds | 2025-08-08 | no |
| N22 | favourite interviews & videos | finds | 2025-07-14 | no |
| N23 | sporting moments i love | finds | 2025-07-09 | no |
| N24 | books that shaped me | finds | 2025-06-01 | no |
| N25 | places & walks | finds | 2025-04-28 | no |
| N26 | questions i'm sitting with | reflections | 2025-06-22 | no |
| N27 | things i've changed my mind on | reflections | 2025-05-31 | no |

## Content deliberately excluded

| What | Where | Why |
|---|---|---|
| Sidebar strings (`folders`, `search`, `no notes`, `yesterday`, …) | `Sidebar.tsx` | UI chrome |
| `no note selected`, modal zoom labels, `image could not be loaded` | `MainContent.tsx` | UI chrome |
| Toolbar aria-labels, share toast `link copied to clipboard` | `App.tsx` | UI chrome |
| Computed note header date/time and blog `N min read · N words` | `MainContent.tsx` | Generated chrome, not authored body. UTC calendar date is recorded on each per-note file header instead. |
| `seo.ts` descriptions, tagline, JSON-LD skills list, Imperial URL in schema | `seo.ts` | Rewritten crawler copy; including it would add claims not in the note bodies |
| Prerender contact footer, breadcrumbs, site index, author link to `/profile/about-me` | `scripts/prerender.mjs` | Hidden once JS runs; also invents an internal “author” link that is not in the notes |
| `rel=me` LinkedIn/GitHub/X in `index.html` | `index.html` | Duplicate of the already-linked about-me line; not note body |
| README, CLAUDE.md, metadata.json | repo docs | Not the website notes |
| Entire note `something-big` | `constants.tsx` lines ~389–424, JS comment `/* not ready to publish` | Not in `portfolioNotes`, not on the site |
| Kuala Lumpur / Penang / Singapore restaurant lists | `food-adventures` template-literal `/* … */` splice | Not in the published string |
| Kuala Lumpur / Penang / Singapore place lists | `places-and-walks` same splice | Not in the published string |
| Favicon | `public/favicon.svg` | Chrome |

## Duplicated content found

- Company names (Zymbly, Sammy Labs, Goldman Sachs) appear as **linked** in both N01 and N05. Each occurrence is marked `↗` separately; destinations are the same company URLs.
- Goldman Sachs is linked **twice** in N05 (analyst role and intern role) plus once in N01 — three `goldman sachs ↗` ledger rows, matching the site.
- GitHub appears five times with **five different destinations** (profile vs four repos).
- About-me social URLs are repeated in `index.html` `rel=me` and `seo.ts` JSON-LD. Manuscript uses only the about-me body occurrence.
- `seo.ts` `DESCRIPTION_OVERRIDES` paraphrases about-me and experience. Excluded so the notebook is not a rewritten bio.

## Broken or unresolved links

- No markdown link in published notes failed to parse.
- No internal note routes (`/folder/slug`) exist in note bodies, so there are **zero** `→ [Nxx]` markers. None were invented.
- `/sahad_tulip.png` is a valid relative image URL in N06 but **the file is not in the repository**. The site would show the broken-image fallback. Placeholder is still in the manuscript.

## Conversion decisions (not content changes)

- `[label](https://…)` and `[label](mailto:…)` → `label ↗`. Raw URLs stay in `LINK-LEDGER.md`.
- `![alt](src)` → `[IMAGE: …]`.
- ` ```iframe ` blocks → `[IMAGE: …]` for the three dynamical-system simulations (digital overlay later).
- Fenced mermaid / go / unlabeled code → `[CODE START]` … `[CODE END]` with the original code, because that is the authored content. On the site, mermaid renders as diagrams; you may later photograph a drawing instead of the source.
- `**heading**` on its own line and `# education` → heading lines without markdown markers.
- `- ` lists kept as `- ` (the renderer draws a `•`; the words are unchanged).
- Pipe tables: markdown separator rows dropped; cells joined with ` · ` for handwriting. Cell words and punctuation still match the source under the naive check.
- `$…$` / `$$…$$` math kept as the original LaTeX (what you wrote), without the fence lines that are only delimiters for KaTeX.
- The toolbox line `idea → interface` is **not** an internal link; the arrow is original wording.
- Page wrap: about 8 words per line, about 24 body lines per page. Headings stay with the following paragraph when it fits. Long math/code lines are not split mid-token.

## Ambiguous items that need your attention

1. **`public/sahad_tulip.png` is missing.** N06 still has an image placeholder. You will need the original photograph (or a replacement) before shooting that page.
2. **Unpublished essay `something-big`.** It is fully written in `constants.tsx` but commented `not ready to publish`. It is **not** in this manuscript. Say if you want it added as a later note ID (do not reuse N01–N27).
3. **Commented South-East Asia sections** in food adventures and places & walks (KL, Penang, Singapore). Same situation: written, not live, not copied. Do not reuse existing IDs if you add them later.
4. **No internal notebook links exist today.** Cross-references such as “i’ve written about before” in N11 are prose, not links. No `→ [Nxx]` was added.
5. **Mermaid diagrams** (N07, N17, N19, N20) are in the manuscript as code, not as `[IMAGE:]`. If you want to *draw* those diagrams in the notebook and overlay photos later, treat the code block as a script for the drawing.
6. **Interactive simulations** (N08) should be reserved blank/photo areas; the HTML files live under `public/dynamical_systems/`.
7. **Note date/time** is browser-local on the live site (`en-US`, lowercased). Per-note files record the UTC calendar date from `created_at`. Times were not copied into the master pages.

## Application files

Only `handwriting-manuscript/` was added. No existing website source was modified.
