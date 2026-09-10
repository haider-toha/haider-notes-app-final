# Diagram and live-figure audit — 10 September 2026

## Final result

Audited **all 18 Mermaid diagrams and all three live simulations**. The Mermaid diagrams preserve all authored content and topology, show complete figures in inline/Fit mode, and provide an explicit **Read** action that makes every label at least **24 CSS pixels** on desktop and a 320px phone. Group-title collisions, connector strokes through edge labels, lifelines through note text, and Expand controls covering wide-diagram nodes were corrected.

Dense inline diagrams remain **overviews**, especially on phones. Their full-width structure cannot also provide readable text at the same scale. Expand → Read provides readable detail with pan access, and Fit restores the entire figure. This distinction is deliberate; a 24px font declaration before SVG scaling does not establish inline legibility.

## Every Mermaid figure

All rows passed complete-viewBox and label-bounds checks, zero label-pair intersections, Read sizing, pan/Fit, and 320px toolbar bounds. Source hashes identify the original geometry allocation, not a different or rewritten source.

| # | Reading page | Diagram | Source hash | Final visual result |
|---|---|---|---|---|
| 1 | 13 | Traditional workflow | `6ea5ad20` | Clear; original topology/layout retained. |
| 2 | 15 | Self-engineering workflow | `48845add` | Clear; original topology/layout retained. |
| 3 | 17 | Agent architecture | `7dcdd376` | Four colliding group headings separated from their first nodes. |
| 4 | 19 | TDD synthesis pipeline | `7f016229` | Full-width overview retained; protected Expand control and readable detail. |
| 5 | 21 | Defense layers | `7eb3c208` | Defense Layers heading separated from its first node. |
| 6 | 23 | Semantic tool discovery | `ecd2a9d9` | Semantic Tool Discovery heading separated from Tool Docstring. |
| 7 | 24 | Learning loop | `39e143b3` | Full-width overview retained; protected Expand control and readable detail. |
| 8 | 35 | Prediction / optimization / risk | `efb45367` | Group headings clear; protected Expand control and readable detail. |
| 9 | 36 | FPL service architecture | `57ece90c` | Clear service branches and connector labels. |
| 10 | 39 | Features and models | `c81c0953` | Both feature/model group headings separated from nodes. |
| 11 | 40 | Bayesian season update | `674a0328` | Both Bayesian Update labels raised above connector strokes; Expand protected. |
| 12 | 53 | Sentiment architecture | `b6671ae2` | Five group headings separated from top-node labels and borders. |
| 13 | 56 | Country attribution | `43c56fd2` | Country attribution branches and labels clear. |
| 14 | 103 | Merkle peer trees | `3356d40` | Both peer group headings separated; Expand protected. |
| 15 | 110 | Disconnected concurrent edits | `f6fffdc4` | Paper-colored note rectangles mask crossing actor lifelines. |
| 16 | 114 | Protocol frame validation | `cbbd4193` | Frame-validation branches intact; Expand protected. |
| 17 | 121 | Watcher flow | `9bdccf66` | Watcher decisions and feedback branches intact; Expand protected. |
| 18 | 125 | File read race | `958ccd3c` | Paper-colored note rectangles mask scanner lifeline through note text. |

## Source and visual correctness

- Independent source-versus-SVG checks preserved **141 flowchart nodes, 113 directed edges, 23 groups**, all five bidirectional start markers, and every end marker. The two sequence diagrams preserve ordered messages/notes and intentional top/bottom participant repetition.
- Inspected actual browser captures at **1440 × 1050** and **390 × 844**, including paper, expanded Fit, and expanded Read. The repeatable regression additionally covers **320 × 568**. No actual node-pair collision or text outside the complete SVG bounds was found. Intentional connectors ending at node boundaries and ordinary edge crossings are not incorrectly classified as collisions.
- The initial audit found **15 group-heading/first-label bounds intersections across six diagrams**. Final measured label intersections are zero. Subgraph title margins create real layout separation; labels are not merely hidden or cropped.
- Edge labels sit above their strokes. The Bayesian update example has a dedicated regression that samples actual connector paths against text bounds. Sequence notes use a small paper-colored rectangle to stop vertical lifelines from crossing the writing; the overall diagram remains transparent.
- Wide diagrams reserve a narrow right gutter for the 44px Expand control. The control no longer intersects their actual node or label bounds. The diagram's outer page allocation is unchanged.
- Every Read view reaches at least 24px nominal rendered text, including the smaller text generated in sequence diagrams. Read starts at the drawing's upper beginning; panning reveals the remainder. Fit restores original complete-view scale. All toolbar controls retain 44px touch targets and fit a 320px phone.

## Pagination and measurement contract

`components/notebookDiagramGeometry.json` is now explicitly the **historical inline allocation contract** used by the published pagination. It preserves the aspect ratios and page space that existing page numbers/bookmarks depend on. Corrected SVGs are fitted completely into those same boxes, with the same responsive 450px height cap. The space is reserved before Mermaid finishes loading, avoiding a loading-time geometry jump.

Current rendered SVG dimensions can differ from that historical allocation because group-title spacing changed. `scripts/measure-notebook-diagrams.mjs` now writes its current measurements to **`/tmp/notebook-diagram-geometry.json` by default**; `NOTEBOOK_DIAGRAM_GEOMETRY_OUTPUT` can select a separate report path. It does **not** overwrite historical allocations. Do not copy new rendering measurements over existing historical entries merely because label spacing changes. New authored diagrams need new measured allocation entries and the normal source/pagination checks.

Every source character and existing pagination cut remains unchanged. The original diagram directions are retained. This avoids turning formerly short overview figures into tall blocks that would add scrolling to existing pages.

## Three live simulations

The separate simulation audit inspected actual canvas screenshots at desktop **470px** and mobile **294px** content widths, after 60 fixed frames. Apparatus geometry matches the source and has no new unintended clipping.

| Figure | Checks | Result |
|---|---|---|
| Rolling system | Cradle, contact geometry, trajectory; 8 labels per sampled frame | Complete apparatus; all labels inside canvas |
| Gear and twin crank | Gear mesh, pendulum chains; 17 labels per sampled frame | Complete apparatus; all labels inside canvas |
| Cam-wagged skater | Cam/follower, skater and grid; 14 labels per sampled frame | Complete apparatus; all labels inside canvas |

Label bounds were sampled at frames **0, 60, 120, and 240**, with zero out-of-canvas labels. Numerical physics parity was separately verified against the original implementation over 120 frames. Fine dimension labels remain small on phones, particularly in the gear and skater figures; their logical drawing geometry was preserved. This is a remaining readability limitation, not a claim that every simulation annotation is independently readable at phone scale.

## Repeatable checks and evidence

Run against a running app:

`NOTEBOOK_ORIGIN=http://127.0.0.1:4173 node scripts/check-notebook-diagram-legibility.mjs`

This covers all 18 diagrams at desktop and 320px phone width: label intersections, complete bounds, real hand-drawn node counts, protected Expand controls, historical inline allocations, paper-backed sequence notes, connector/text separation, 24px Read sizing, panning, Fit, and toolbar/document bounds. The figure suite now counts **`.node, .rough-node`**; the previous `.node`-only selector silently counted zero hand-drawn flowchart nodes.

The existing `check-notebook-figures.mjs` additionally covers ten viewport sizes, expanded viewers, rapid remounts, rendering failures/recovery, images, simulations, and real page turns. The exact-source and pagination-baseline checks protect authored content and published page cuts.

Temporary visual evidence:

- Final Mermaid comparison sheets: [1–3](/tmp/diagram-audit-final/contact-1.png), [4–6](/tmp/diagram-audit-final/contact-2.png), [7–9](/tmp/diagram-audit-final/contact-3.png), [10–12](/tmp/diagram-audit-final/contact-4.png), [13–15](/tmp/diagram-audit-final/contact-5.png), [16–18](/tmp/diagram-audit-final/contact-6.png).
- Final protected wide-diagram controls: [desktop and phone](/tmp/diagram-audit-final/wide-controls.png). This final control-placement capture supersedes the wide inline control placement in the comparison sheets; SVG content and expanded views are unchanged.
- Simulation screenshots: [rolling desktop](/tmp/notebook-simulation-visuals/rolling-desktop.png), [rolling mobile](/tmp/notebook-simulation-visuals/rolling-mobile.png), [gear desktop](/tmp/notebook-simulation-visuals/gear-desktop.png), [gear mobile](/tmp/notebook-simulation-visuals/gear-mobile.png), [skater desktop](/tmp/notebook-simulation-visuals/skater-desktop.png), [skater mobile](/tmp/notebook-simulation-visuals/skater-mobile.png).
- Source semantics: [/tmp/notebook-diagram-semantics.json](/tmp/notebook-diagram-semantics.json). Current rendered geometry: [/tmp/notebook-diagram-geometry.json](/tmp/notebook-diagram-geometry.json).

These are Chromium desktop/mobile-viewport checks; physical-device Safari testing remains outside this audit. Temporary screenshots may be cleared by the OS; the source hashes, findings, and repeatable regression remain in the repository.
