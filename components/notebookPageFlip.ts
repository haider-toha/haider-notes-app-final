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

// Keep the v2.0.7 renderer and fold calculations, but schedule work only when
// its inputs change. The adapter is deliberately version-specific: animation
// state and timer are protected/private library fields, as is render().
export function loadNotebookPages(book: PageFlip, elements: HTMLElement[]) {
  let frame = 0;
  let disposed = false;
  let drawing = false;
  let renderer: { render(time: number): void; animation: unknown; timer: number } | undefined;
  const wake = () => {
    if (!disposed && !drawing && !frame && !document.hidden) {
      frame = requestAnimationFrame(draw);
    }
  };
  const draw = (time: number) => {
    frame = 0;
    if (disposed || document.hidden || !renderer) return;
    drawing = true;
    // A callback queued during the current browser frame can carry a timestamp
    // slightly older than startAnimation's performance.now(). Never index the
    // library's animation frames with a negative elapsed time.
    try { renderer.render(Math.max(time, renderer.timer)); }
    finally { drawing = false; }
    // Pointer-driven folds wake through setters. Only timed animations need
    // continuous frames; their final frame also draws the settled pages.
    if (renderer.animation !== null) wake();
  };
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake();
  };
  const originalStart = Render.prototype.start;
  Render.prototype.start = function () {
    // Patch this instance only; restore the prototype before returning to React.
    renderer = this as unknown as NonNullable<typeof renderer>;
    const target = this;
    const mutations = [
      'update', 'reload', 'setLeftPage', 'setRightPage', 'setBottomPage',
      'setFlippingPage', 'setPageRect', 'setDirection', 'setShadowData',
      'clearShadow', 'finishAnimation',
    ] as const;
    for (const name of mutations) {
      const original = target[name];
      Object.defineProperty(target, name, { configurable: true, value: function (...args: unknown[]) {
        if (disposed) return;
        const result = Reflect.apply(original, target, args);
        wake();
        return result;
      } });
    }
    const startAnimation = target.startAnimation;
    target.startAnimation = (...args) => {
      if (disposed) return;
      // The original endless loop kept this clock fresh. Without this reset a
      // turn requested after idle would skip directly to its last frame.
      renderer!.timer = performance.now();
      startAnimation.apply(target, args);
      wake();
    };
    this.update();
    wake();
  };
  document.addEventListener('visibilitychange', onVisibility);
  try {
    book.loadFromHTML(elements);
    // The library marks an unpaired final page hard even with showCover false.
    // This notebook has no covers: keep odd page counts folding like paper too.
    elements.forEach((_, index) => book.getPage(index).setDensity(PageDensity.SOFT));
  }
  catch (error) {
    disposed = true;
    cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', onVisibility);
    throw error;
  }
  finally { Render.prototype.start = originalStart; }
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', onVisibility);
    // destroy() leaves the library's delayed init callback and event map alive.
    // A StrictMode mount/unmount must not call back into the next React mount.
    for (const event of ['init', 'flip', 'changeOrientation', 'changeState', 'update']) book.off(event);
    book.destroy();
  };
}
export { PageFlip };
