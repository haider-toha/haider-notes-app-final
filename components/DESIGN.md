# Lined notebook

Scope: `LinedNotebook.tsx`, `LinedNotebook.css`, and `notebookPageFlip.ts` on `/notebook`. Other site pages and the photographed `/book-test` prototype keep their own design.

The open notebook is the entire visible interface. White desk, ivory ruled paper, a narrow binding, stacked paper edges, blue-black ink (#303f53), and understated blue links (#355b78). No toolbar, footer, font picker, corner labels, decorative corner folds, or hover animation.

Reenie Beanie is the only handwriting font, served locally with its license. Body text uses 24px type on a 29px ruling (21px on compact desktop, 23px on mobile); the opening title uses 62px (48px on mobile). Page numbers always use 12px system sans-serif with lining, tabular numerals.

Desktop shows two 720px-tall pages in a spread up to 1080px wide. Narrow layouts show one 1000px-tall page. Keep the responsive engine minimum-width override: removing it causes horizontal overflow. Long passages scroll within the ruled writing area.

Deliberate outer-edge dragging/tapping turns a soft sheet across the spine. StPageFlip 2.0.7 supplies the fold geometry, reverse face, and moving shadows (950ms release animation, 0.28 maximum shadow opacity). The lifecycle adapter cancels the renderer on unmount. Hover keeps the page flat. Reduced motion changes pages immediately.

Invisible 24px-wide full-height outer-edge controls retain accessible labels and keyboard focus. Arrow keys turn pages when the spread has focus; they never intercept links. Hidden pages are inert. Page position remains available to screen readers. Content is authored in `constants.tsx`; there are no scratchpads or browser-local drafts. External links open in a new tab.

Reading pages combine consecutive paragraphs, with blank lines between them. Keep the opening identity page; balance the final passages to avoid a nearly empty final reading page. Preserve the 24px handwriting and 29px rule rhythm rather than shrinking type. Side grabs map pointer displacement from an outer-boundary anchor, preventing an oversized fold at the first movement.

A removable sheet uses outward rubber-band resistance followed by a damped spring release. The implementation uses unit mass, translational stiffness 240/damping 29, angular stiffness 115/damping 16, bounded frame time, and velocity-dependent torque around the grab position. Reduced motion removes the spring delay and unfurl effect. Heading alignment, padding, background and scroll position are captured from the source rather than recomposed. Reveal real underlying-page content during removal. The sheet returns by aligning its binding edge to the spine, with no extra recovery control.

Opening page: a 62px Reenie Beanie name (48px on mobile), location immediately below on a 29px line, then social links after one blank ruled line. After a two-rule gap below the social links, place the original opening paragraph about current work. Maintain generous margins; move subsequent paragraphs to the following pages without repetition. No running-heading label, repeated name, tagline, or contents list. Preserve the empty running-head element's geometry because detached-sheet presentation reads that element.

Paper details stay still at rest. A completed turn gets a 310ms flex of less than one degree on the inner article; the renderer retains sole ownership of leaf transforms. Stack edges range from 1–7px with reading progress. Reverse ink is mirrored from the opposite face, aria-hidden, noninteractive and faint (about 2% at rest, 5–6% while lifting). No effect introduces a separate layer that captures grabs.

Three muted woven tabs protrude from the right edge for start/work/off duty. Hover or focus reveals the label inward; Escape dismisses it. Tabs have 44px targets and stop propagation into page grabs. Reduced motion disables decorative transitions. A single saved page index restores reading position, guarded against blocked or invalid storage. Odd final pages remain soft after library initialization.
