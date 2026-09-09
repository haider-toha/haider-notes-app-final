# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors to Haider Toha's personal website who want to explore his profile, writing, projects, finds, and reflections. Reading and navigation must work on desktop and mobile browsers.

## Product Purpose

Present all of Haider's published notes as a live handwritten notebook. Visitors turn lined pages, follow links, read equations, explore figures, and watch simulations within the same book.

## Positioning

The notebook is the website's primary interface. Ivory ruled paper, handwriting, a narrow binding, and flexible leaves give the content a physical reading experience. Text and media remain live HTML, SVG, and canvas so they stay selectable, accessible, and interactive.

## Operating Context

This is a static React site deployed on Vercel. `constants.tsx` supplies the authored notes and folder groups. Source-preserving pagination creates reading leaves; the shared renderer handles prose, links, tables, code, equations, images, and diagrams. Build-time HTML provides crawlable content and note metadata. There is no CMS or application backend.

## Capabilities and Constraints

- Preserve every published note, source character, link, reference, and media block. Do not rewrite content to fill pages.
- Include all 27 notes and all three live dynamical-system simulations.
- Keep figures and equations intact across pagination. Fit complete diagrams inside the page, with an accessible expanded view for closer reading.
- Use locally hosted Reenie Beanie for handwriting and Notebook Math for equations and simulation labels. Retain the font licenses and complete mathematical glyph coverage.
- Support contents navigation, published note URLs, browser history, keyboard input, touch, and reduced motion.
- Remember the reading position as a note ID and source offset so repagination does not lose the reader's place. Storage failures must not prevent reading.
- Keep the experience read-only: no editing controls, scratchpads, or local drafts.

## Brand Commitments

- Haider Toha's personal notebook: quiet, handled, and readable.
- White desk, ivory lined paper, blue-black ink, and understated blue links.
- The book provides the interface. Avoid toolbars, extra page chrome, decorative tabs, or popup contents.
- Preserve supplied facts and authored language; do not invent claims or filler.

## Product Principles

1. Reading and content fidelity lead every visual decision.
2. Navigation stays clear and belongs on the paper.
3. Physical interactions remain deliberate, accessible, and reversible.
4. Rich content loads near the reading position and remains usable on mobile.
5. Verify source parity, rendered fit, and real interaction paths before shipping.

## Contents and Navigation

The default landing surface is the about-me reading page. `/` and `/notebook` open it, including on return visits. `/contents` opens two preliminary contents leaves, numbered i and ii, and remains accessible through the top-of-page contents link. `/all`, folder routes, and published note URLs open reading pages.

Contents lists all 27 notes in folder groups across the two leaves. Only the left leaf has the “contents” title; an equal-height spacer on the right keeps both columns aligned. Larger group headings, indented entries, and handwritten page references establish the hierarchy. These leaves turn through the same engine as the reading pages.

A small handwritten control inside each page's upper outer margin reads “← contents” during reading and navigates to `/contents`. On contents, “continue reading →” restores the remembered source page at its canonical note URL. Visiting contents preserves the saved reading position. Reading page numbers start at 1 and exclude the two preliminary leaves.

## Reading and Media

The first reading page contains “haider toha,” location, social links, and the original opening paragraph about current work. Subsequent paragraphs continue without duplication. Keep the identity leaf separate from contents and preserve its generous spacing.

Group source paragraphs into full reading pages. Use rendered line heights and media geometry, split prose only at safe boundaries, keep headings with their following content, and balance sparse pages. Preserve paragraph order, links, and mathematical notation; do not shrink handwriting or add filler to fill paper. Markdown section dividers remain in the source audit but are not drawn in the notebook.

Mermaid diagrams render live with transparent backgrounds, blue-black ink, and the page's handwriting. Every full diagram fits within the page width and a 450px height cap. Expanded diagrams and images use an accessible paper-colored viewer with visible close, zoom, and reset controls. Equations and simulation labels use Notebook Math. The three dynamical simulations retain their numerical behavior and transparent canvases.

## Page Interaction

Desktop displays two pages with its existing geometry and appearance. Phones focus on one page while showing its binding, a sliver of neighboring ink, and changing paper stacks. The full paper silhouette fits the available viewport, capped at 1.85 times page width. Body handwriting stays at 23px; long passages scroll inside the leaf without changing source pagination or page references. Short, coarse-pointer phone landscape uses the same focused layout.

Desktop outer-edge drags, taps, or arrow keys turn flexible sheets. Mobile adds 44px previous/next controls in each face's bottom margin and explicit 20px side grips for folding. Ordinary prose gestures retain native vertical scrolling; wide equations and tables retain horizontal scrolling, and browser pinch remains available. The page stays flat on hover. Reduced motion changes pages immediately, and viewport-driven geometry changes wait until an active fold finishes.

An outward edge pull meets resistance, then releases one live sheet after a hold. On mobile this is a deliberate outward pull from the right grip, not a vertical prose gesture. Scroll detached prose normally and use its header or grips to move the paper. Align its binding edge with the spine to reattach. Preserve its writing, heading alignment, padding, and scroll position throughout. The real underlying leaf remains visible. Only one sheet can be loose at a time; refreshing restores the bound book.

Completed turns settle briefly. Read pages thicken the left stack while unread pages thin the right; cut edges remain visible along the outside and bottom. Faint mirrored reverse ink is decorative and slightly stronger on lifted sheets. These details never intercept reading or page grabs, and reduced motion skips their animation.

The [mobile research and interaction contract](docs/mobile-notebook.md) records the focused-page decision and its acceptance targets. Mobile appearance stays scoped to phones. Preserve desktop behavior and standard geometry, with the approved shared equation-spacing refinement and a height cap on short desktop viewports to keep paper bottoms visible.

## Verification

`check-notebook-content.mjs` reconstructs every source note exactly and checks atomic rich blocks, headings, local assets, and stored positions. Browser checks cover turns, contents routes, media rendering, equation glyphs, expanded viewers, and the live simulations. Re-measure diagram geometry after changing diagram source or typography; regenerate and audit Notebook Math when adding mathematical glyphs.
