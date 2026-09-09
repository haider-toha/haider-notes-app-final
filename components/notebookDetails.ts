import { useEffect, useRef, type CSSProperties } from 'react';
import './notebookDetails.css';

/** Plain, mirrored ink from the other face of the same physical sheet. */
export function reverseInkText(texts: readonly string[], index: number): string | undefined {
  const reverse = texts[index % 2 ? index + 1 : index - 1];
  return reverse?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

/** Decoration stays on the sheet contents: the page-flip renderer owns its leaf. */
export function useNotebookDetails(
  page: number,
  pageCount: number,
  portrait: boolean,
  reducedMotion: boolean,
  leaves: readonly HTMLElement[],
  turning: boolean,
): CSSProperties {
  const previous = useRef({ page, portrait });
  const landed = useRef<number | null>(null);
  const animation = useRef<Animation | null>(null);
  const didTurn = useRef(false);

  useEffect(() => {
    const last = previous.current;
    previous.current = { page, portrait };
    if (turning) didTurn.current = true;
    if (portrait !== last.portrait) { landed.current = null; didTurn.current = false; }
    else if (page !== last.page) landed.current = portrait || page > last.page ? page : page + 1;

    animation.current?.cancel();
    animation.current = null;
    if (turning) return;
    const index = landed.current;
    const completedTurn = didTurn.current;
    landed.current = null;
    didTurn.current = false;
    if (reducedMotion || index === null || !completedTurn) return;
    const sheet = leaves[index]?.querySelector<HTMLElement>(':scope > .notebook-sheet');
    if (!sheet || leaves[index].classList.contains('is-detached')) return;
    const left = !portrait && index % 2 === 0;
    animation.current = sheet.animate([
      { transform: 'perspective(1800px) rotateY(0deg)', filter: 'brightness(1)' },
      { transform: `perspective(1800px) rotateY(${left ? 0.65 : -0.65}deg)`, filter: 'brightness(1.007)', offset: 0.28 },
      { transform: 'perspective(1800px) rotateY(0deg)', filter: 'brightness(1)' },
    ], { duration: 310, easing: 'cubic-bezier(.2,.7,.3,1)' });
    return () => { animation.current?.cancel(); animation.current = null; };
  }, [page, portrait, turning, reducedMotion, leaves]);

  const progress = page / Math.max(1, pageCount - 1);
  return {
    '--stack-left': `${1 + progress * 6}px`,
    '--stack-right': `${1 + (1 - progress) * 6}px`,
  } as CSSProperties;
}
