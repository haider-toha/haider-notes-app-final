import { PageFlip } from 'page-flip/src/PageFlip';
import { Render } from 'page-flip/src/Render/Render';
import { PageDensity } from 'page-flip/src/Page/Page';

// v2.0.7 does not cancel its rendering loop on destroy. Keep the same renderer,
// but own its frame handle so React unmounts and StrictMode clean up correctly.
export function loadNotebookPages(book: PageFlip, elements: HTMLElement[]) {
  let frame = 0;
  let disposed = false;
  const originalStart = Render.prototype.start;
  Render.prototype.start = function () {
    this.update();
    const renderer = this as unknown as { render(time: number): void };
    const draw = (time: number) => {
      if (disposed) return;
      renderer.render(time);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
  };
  try {
    book.loadFromHTML(elements);
    // The library marks an unpaired final page hard even with showCover false.
    // This notebook has no covers: keep odd page counts folding like paper too.
    elements.forEach((_, index) => book.getPage(index).setDensity(PageDensity.SOFT));
  }
  finally { Render.prototype.start = originalStart; }
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    book.destroy();
  };
}
export { PageFlip };
