import { useEffect, useRef, useState } from 'react';
import './NotebookCover.css';

interface NotebookCoverProps {
  opening: boolean;
  onOpen: () => void;
  onPrepare: () => void;
  onOpened: () => void;
}

/** The cover belongs outside the numbered leaves and source-position history. */
export default function NotebookCover({ opening, onOpen, onPrepare, onOpened }: NotebookCoverProps) {
  const drag = useRef<{ id: number; x: number; width: number; moved: boolean; progress: number } | null>(null);
  const suppressClick = useRef(false);
  const [progress, setProgress] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const updatePosition = (value: number) => {
    stage.current?.closest<HTMLElement>('.notebook-experience')?.style.setProperty('--cover-progress', String(value));
  };
  const measureHinge = () => {
    const scene = stage.current?.closest<HTMLElement>('.notebook-experience');
    const mount = scene?.querySelector<HTMLElement>('.notebook-mount');
    if (!scene || !mount || !stage.current) return;
    const cover = stage.current.getBoundingClientRect();
    const book = mount.getBoundingClientRect();
    const reading = mount.closest<HTMLElement>('.notebook-cover-reading')!;
    const matrix = (element: HTMLElement) => {
      const transform = getComputedStyle(element).transform;
      return new DOMMatrix(transform === 'none' ? undefined : transform);
    };
    const coverShift = matrix(stage.current), bookShift = matrix(reading);
    const portrait = mount.parentElement?.classList.contains('is-portrait');
    scene.style.setProperty('--cover-shift-x', `${book.left - bookShift.e + (portrait ? 0 : book.width / 2) - cover.left + coverShift.e}px`);
    scene.style.setProperty('--cover-shift-y', `${book.top - bookShift.f - cover.top + coverShift.f}px`);
  };
  const beginOpening = () => {
    onPrepare();
    requestAnimationFrame(() => {
      if (!stage.current) return;
      // The first frame mounts and measures the real notebook. The second
      // starts both surfaces from their shared hinge, including on phones.
      measureHinge();
      requestAnimationFrame(() => { if (stage.current) { updatePosition(1); onOpen(); } });
    });
  };
  useEffect(() => {
    if (!opening) return;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 780;
    const timer = window.setTimeout(onOpened, duration);
    return () => window.clearTimeout(timer);
  }, [opening, onOpened]);

  return <main className={`notebook-cover-desk${opening ? ' is-opening' : ''}${progress !== null ? ' is-dragging' : ''}`} aria-label="Haider Toha’s notebook"
    style={!opening && progress !== null ? { backgroundColor: `rgba(255,255,255,${1 - progress})` } : undefined}>
    <h1 className="sr-only">Haider Toha’s notebook</h1>
    <div ref={stage} className="notebook-cover-stage">
      <button type="button" className="notebook-cover" aria-label="Open notebook" aria-describedby="notebook-cover-hint" disabled={opening}
        style={!opening && progress !== null ? { transform: `rotateY(${-165 * progress}deg)` } : undefined}
        onClick={event => {
          const ignorePointerClick = suppressClick.current && event.detail > 0;
          suppressClick.current = false;
          if (!ignorePointerClick) beginOpening();
        }}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || opening) return;
          suppressClick.current = false;
          drag.current = { id: event.pointerId, x: event.clientX, width: event.currentTarget.clientWidth, moved: false, progress: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
          onPrepare();
          requestAnimationFrame(measureHinge);
        }}
        onPointerMove={event => {
          const held = drag.current;
          if (!held || held.id !== event.pointerId) return;
          const distance = held.x - event.clientX;
          if (Math.abs(distance) > 6) held.moved = true;
          if (!held.moved) return;
          held.progress = Math.max(0, Math.min(1, distance / held.width));
          setProgress(held.progress);
          updatePosition(held.progress);
        }}
        onPointerUp={event => {
          const held = drag.current;
          if (!held || held.id !== event.pointerId) return;
          drag.current = null;
          suppressClick.current = held.moved;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          if (held.moved && held.progress >= .25) { updatePosition(1); onOpen(); }
          else updatePosition(0);
          setProgress(null);
        }}
        onPointerCancel={() => { drag.current = null; suppressClick.current = true; setProgress(null); updatePosition(0); }}
        onLostPointerCapture={() => { if (drag.current) { drag.current = null; suppressClick.current = true; setProgress(null); updatePosition(0); } }}>
        <picture>
          <source type="image/webp" srcSet="/cover-600.webp 600w, /cover.webp 1086w" sizes="(max-width: 600px) 85vw, 540px" />
          <img src="/cover.png" width="1086" height="1448" alt="" fetchPriority="high" draggable={false} />
        </picture>
        <span className="notebook-cover-invitation" aria-hidden="true">open notebook <svg viewBox="0 0 30 18"><path d="M3 10 Q14 8.5 26 9 M19 3 Q22 6 26 9 Q22 11 19 15" /></svg></span>
      </button>
      <p id="notebook-cover-hint" className="sr-only">Click, tap, or drag the cover left to open. Keyboard: Enter or Space.</p>
    </div>
  </main>;
}
