import { PageFlip } from 'page-flip/src/PageFlip';
import { Render } from 'page-flip/src/Render/Render';
import { PageDensity } from 'page-flip/src/Page/Page';
import type { Point } from 'page-flip/src/BasicTypes';

/** Settle a phone fold without requiring its corner to leave the screen. */
export function finishNotebookTouch(book: PageFlip, commit: boolean) {
  const controller = book.getFlipController();
  const calculation = controller.getCalculation();
  // Clear the library's pointer state without its desktop binding-crossing rule.
  book.userStop({ x: 0, y: 0 }, true);
  if (!calculation) return;
  const rect = book.getRender().getRect();
  const destination = { x: commit ? -rect.pageWidth : rect.pageWidth,
    y: calculation.getCorner() === 'bottom' ? rect.height : 0 };
  // page-flip 2.0.7 exposes no public explicit commit/cancel operation. Reuse its
  // own continuation animator so the current fold never jumps or restarts.
  const animator = controller as unknown as {
    animateFlippingTo(start: Point, destination: Point, turned: boolean): void;
  };
  animator.animateFlippingTo(calculation.getPosition(), destination, commit);
}

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
