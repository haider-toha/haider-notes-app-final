# Mobile notebook: research and decision

## Constraints

Preserve desktop notebook interactions and the standard 720px page height. The mobile layout itself stays scoped to phones. Two separately approved refinements also apply on desktop: a small reduction in equation-to-prose spacing, and capping paper height to the available desk space on short viewports so its bottom remains visible. Mobile must preserve authored content, source-page numbering and URLs, physical folds, settling, changing page stacks, removable sheets, contents on every face, live simulations, handwritten equations and expanded-media controls. The reading surface stays paper, with no external toolbar.

## Findings

- [Apple Books on iPhone](https://support.apple.com/en-gb/guide/iphone/iphc1af7c57/ios) uses margins and directional gestures for page turns and offers curl, fade and scrolling as distinct reading choices. This supports explicit page-turn controls rather than making ordinary vertical scrolling turn pages.
- [Flipsnack's page views](https://help.flipsnack.com/en/articles/3954412-understanding-page-view) default to one page on phones and two pages on larger screens to balance readability and publication appearance.
- [DearFlip's settings](https://wordpress.dearflip.com/docs/settings/) distinguish an isolated single sheet from focusing on one page of an open book. The latter is the useful visual model here: readable ink with the binding and neighboring paper still present.
- [MDN's touch-action reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action) explains that browser gestures depend on the touched element and its ancestors. A book-wide pan-y rule blocks horizontal equation scrolling and native pinch. Changing that rule after a gesture begins cannot fix it.

Local baseline: mobile paper was always 1000px tall, leaving its folio and bottom stack outside the viewport. Two 70px interaction zones occupied about 39% of a 358px page; vertical movement near the prose margin could start detaching a sheet. Phone landscape fell into the desktop layout despite insufficient height.

## Adversarial review

An independent reviewer compared three approaches:

| Approach | Objection |
| --- | --- |
| Full-spread overview before reading | A 1080px spread on a phone makes 24px handwriting about 8px and makes every visitor zoom before reading. |
| One readable page with book context | Best option, provided the binding, adjacent ink and stack form a coherent book rather than a rounded card. |
| Scaled desktop spread with pan and zoom | Adds horizontal navigation to paragraphs and conflicts with folding, selection and loose-sheet coordinates. |

The selected approach is a focused page with a narrow glimpse of its neighbor, a visible binding, and the existing changing stacks. The actual page engine fits the viewport; typography is not scaled down. Long writing scrolls inside its leaf. Height is capped to avoid turning the paper into a receipt-shaped surface on tall phones. The review called for explicit touch grips, native pinch, preserved scroll positions, and deferred geometry changes during a fold. The final navigation shows only a previous link; forward turns use finger drags at any corner or side.

## Interaction contract

- About me opens first, with contents accessible at the top of the page and at `/contents`. The same source offsets and route history work across devices.
- The writing area owns native vertical scrolling; wide equations and tables retain horizontal scrolling. Browser pinch remains available.
- Blank side grips own page folding. A deliberate outward pull and hold from the outer grip can release a sheet. An ordinary vertical prose gesture cannot do so.
- Mobile has a previous link and no next button; finger drags on all corners and side edges use the physical page-turn engine. Previous uses that same animated engine.
- Loose-sheet text remains scrollable. Its binding grip and header move the paper; its body does not hijack scrolling.
- Geometry changes wait for an active fold to finish. Mobile landscape uses the focused reading layout.
- Phone appearance rules are scoped to the mobile layout. The shared equation-spacing adjustment and short-viewport height cap are deliberate exceptions to desktop visual parity. Desktop screenshot and geometry baselines cover contents, prose, diagram, matrix and simulation pages.

## Verification targets

320×568, 390×844 and 430×932, their landscape orientations, Chromium and WebKit where available, actual touch events, both contents leaves, all notes, fold cancellation, page-owned controls, scroll restoration, detached-sheet reading and reattachment, math/table panning, media pinch/zoom, animated simulations, reduced motion and desktop visual parity.

## Verified implementation

The default route opens about me; contents appears once per desktop spread and on every mobile page. Display equations have 16px less combined vertical margin. Short desktop windows fit the whole sheet, with a subtle fade indicating writing that continues below. Diagrams and images also respect the available reading height; expansion preserves close inspection.

The final Chromium audit covers 50 page/viewport combinations across ten sizes: four desktop windows (1440×1050, 1366×768, 1280×720, 1024×600) and the six phone orientations above. The exact-source check preserves all 27 notes and 199,424 characters. The figure and math checks cover 18 diagrams, three live simulations, 178 equations and 3,686 handwritten glyph instances without fallback. Permanent mobile regression coverage is in `scripts/check-notebook-mobile.mjs`.

WebKit smoke checks also pass at 390×844, 320×568, 844×390 and 1280×720: about me, contents navigation, live resizing, complete paper bounds and no runtime errors. These are browser-emulated checks, not a physical iPhone test.

The first mobile contents leaf shows a full-width open cover left of the hinge, cropped by the viewport rather than framed around the paper, with no invented preceding-page ink or read stack. Subsequent leaves restore the neighboring paper. Desktop and mobile ruling use a local background attachment so the lines travel with the writing during scrolling.
