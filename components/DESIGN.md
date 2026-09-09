# Lined notebook

Scope: `LinedNotebook.tsx`, `LinedNotebook.css`, and `notebookPageFlip.ts` on `/notebook`. Other site pages and the photographed `/book-test` prototype keep their own design.

The open notebook is the entire visible interface. White desk, ivory ruled paper, a narrow binding, stacked paper edges, blue-black ink (#303f53), and understated blue links (#355b78). No toolbar, footer, font picker, corner labels, decorative corner folds, or hover animation.

Reenie Beanie is the only handwriting font, served locally with its license. Body text uses 24px type on a 29px ruling (21px on compact desktop, 23px on mobile); the opening title uses 66px (60px on mobile). Page numbers always use 12px system sans-serif with lining, tabular numerals.

Desktop shows two 720px-tall pages in a spread up to 1080px wide. Narrow layouts show one 1000px-tall page. Keep the responsive engine minimum-width override: removing it causes horizontal overflow. Long passages scroll within the ruled writing area.

Deliberate outer-edge dragging/tapping turns a soft sheet across the spine. StPageFlip 2.0.7 supplies the fold geometry, reverse face, and moving shadows (950ms release animation, 0.28 maximum shadow opacity). The lifecycle adapter cancels the renderer on unmount. Hover keeps the page flat. Reduced motion changes pages immediately.

Invisible 24px-wide full-height outer-edge controls retain accessible labels and keyboard focus. Arrow keys turn pages when the spread has focus; they never intercept writing or links. Hidden pages are inert. Page position and save status remain available to screen readers. Browser-local draft storage and external links opening in a new tab are preserved.

Reading pages combine consecutive paragraphs, with blank lines between them. Keep the opening identity page; balance the final passages to avoid a nearly empty final reading page. Preserve the 24px handwriting and 29px rule rhythm rather than shrinking type. Side grabs map pointer displacement from an outer-boundary anchor, preventing an oversized fold at the first movement.
