# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors to Haider Toha's personal website who want to explore his profile, writing, projects, finds, and reflections. The site must remain usable on desktop and mobile browsers.

## Product Purpose

Present Haider's existing personal-site content as a digital version of a real handwritten notebook. Success means a visitor can browse photographed pages as naturally as a physical book while links, note navigation, references, images, video, and interactive media still behave like a website.

## Positioning

The photographed physical notebook is the actual content surface rather than a decorative skin around typeset web content. Digital interaction is layered onto the photographed handwriting without replacing it.

## Operating Context

All authored content originates in this repository. It is converted into a copy-ready manuscript, copied into a physical notebook by hand, photographed, and then mapped back into the web experience. The source photographs and physical page order are production assets, not illustrative placeholders.

## Capabilities and Constraints

- Preserve the existing published content faithfully; do not rewrite or redesign its substance.
- The finished manuscript must account for every published note, link, media placement, reference, and page break.
- Photographed handwriting remains visually exact. Generated or re-typeset handwriting must not silently replace it.
- Invisible interactive regions may be positioned over photographed links and media areas.
- The notebook must support direct navigation between notes and responsive use on desktop and mobile.
- The current prototype scope is the closed cover, first handwritten page, and second handwritten page.
- The final 3D implementation and complete capture workflow remain open until the test photographs establish legibility and interaction quality.

## Brand Commitments

- Product identity: Haider Toha's personal notebook and personal website.
- Preserve the real green, red, and gold textile cover, lined paper, handwriting, and physical imperfections of the supplied notebook.
- The notebook should feel handled and personal, not like a generic 3D product configurator.

## Evidence on Hand

- The authored website content lives in `constants.tsx`.
- `handwriting-manuscript/` contains a 27-note, 241-page copy manuscript plus source, link, and asset audits.
- `handwriting-manuscript/test/` contains real cover, spine, first-page, second-page, and page-turn reference captures.
- No testimonials, commercial claims, or synthetic photography should be fabricated.

## Product Principles

1. The physical artifact leads; interface chrome recedes.
2. Faithfulness outranks decorative polish.
3. Every interaction must remain discoverable, accessible, and reversible.
4. Page imagery loads sharply without making the experience fragile on mobile networks.
5. Prototype risky page-turn and legibility decisions before scaling to the complete manuscript.

## Lined Notebook Experiment

The separate `/notebook` route recreates the supplied open cream lined notebook in HTML/CSS. Its fixed handwriting font is Reenie Beanie, self-hosted with its license; printed page numbers use system sans-serif. The notebook is the only visible surface: no toolbar, selector, footer, corner labels, or hover curls.

Soft pages turn by deliberate outer-edge dragging/tapping or keyboard navigation, with folds, reverse faces and moving shadows based on the supplied screen recording. Reduced motion uses immediate page changes. The existing about-me text and external links remain interactive; all pages display content authored in `constants.tsx`, with no scratchpads, editing controls or draft storage. This is a preview, not a conversion of the full manuscript.

The photographed `/book-test` prototype remains a separate working route with its original assets.

### Reading density

Keep the opening identity page, then group consecutive source paragraphs into fuller reading pages. A paragraph break must not automatically create a new page. Preserve the authored text, paragraph spacing, links, and order; balance the final two reading pages to avoid leaving a tiny trailing paragraph by itself. The profile starts on the identity page and continues across fuller reading pages. Do not add filler copy or reduce the handwriting size to fill paper.

### Removable sheet interaction

A deliberate outward pull from an outer edge meets resistance; holding beyond the threshold releases one live sheet. Normal inward drags retain the approved page-turn behavior. On narrow touch screens a deliberate vertical edge pull can release the sheet without requiring off-screen movement. Only one sheet is loose at a time. The underlying sheet's real writing remains visible where another sheet exists.

Move the loose sheet freely and drag its binding edge back to the spine to reattach. There is no recovery button or added visible toolbar. Motion uses damped springs and movement-dependent angular response. Preserve the source page's exact heading alignment, padding, paper appearance and scroll position during separation and reattachment. Content and links remain readable while detached; a refresh restores the bound book.

### Opening page

The first page is a spacious identity page: “haider toha” as the main heading, “london, uk” below, then GitHub/email/LinkedIn/Twitter near the top. After a two-rule gap, include the original opening paragraph about Haider’s current work; continue subsequent paragraphs on the following pages without duplication. Remove repeated introductions, “haider’s notebook,” the generic tagline and “explore all notes.” Do not add an on-page contents list: the intended direction for section navigation is protruding bookmarks, to be implemented separately once their destinations are defined.
