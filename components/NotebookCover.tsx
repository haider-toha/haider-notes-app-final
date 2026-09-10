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
  const drag = useRef<{ id: number; x: number; width: number; start: number; moved: boolean; progress: number; time: number; velocity: number } | null>(null);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const position = useRef(0);
  const frame = useRef(0);
  const prepared = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const inside = useRef<HTMLSpanElement>(null);
  const updatePosition = (value: number) => {
    position.current = value;
    stage.current?.querySelector('.notebook-cover')?.setAttribute('data-face', value > .5 ? 'inside' : 'outside');
    const scene = stage.current?.closest<HTMLElement>('.notebook-experience');
    if (!scene) return;
    // Projected board travel is cosine-shaped. The camera follows that travel,
    // rather than sliding the spine at constant speed through an angular turn.
    scene.style.setProperty('--cover-progress', String(value));
    scene.style.setProperty('--cover-ready', prepared.current && value > 0 ? '1' : '0');
    scene.style.setProperty('--cover-layout', String((1 - Math.cos(Math.PI * value)) / 2));
    scene.style.setProperty('--cover-lift', String(Math.sin(Math.PI * value)));
  };
  const settle = (target: 0 | 1, velocity = 0) => {
    cancelAnimationFrame(frame.current);
    const from = position.current;
    const distance = target - from;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updatePosition(target);
      if (target) onOpened();
      return;
    }
    const duration = Math.max(260, 960 * Math.sqrt(Math.abs(distance)));
    const start = performance.now();
    // Monotone Hermite continuation preserves release velocity without letting
    // the board bounce through the desk. Taps start and finish at rest.
    const tangent = distance === 0 ? 0 : Math.max(0, Math.min(2.4, velocity * duration / distance));
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const travel = (3 * t * t - 2 * t * t * t) + tangent * t * (1 - t) ** 2;
      updatePosition(from + distance * travel);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else {
        frame.current = 0;
        if (target) onOpened();
      }
    };
    frame.current = requestAnimationFrame(tick);
  };
  const measureHinge = () => {
    const scene = stage.current?.closest<HTMLElement>('.notebook-experience');
    const mount = scene?.querySelector<HTMLElement>('.notebook-mount');
    if (!scene || !mount || !stage.current || prepared.current) return;
    const cover = stage.current.getBoundingClientRect();
    const book = mount.getBoundingClientRect();
    const reading = mount.closest<HTMLElement>('.notebook-cover-reading')!;
    const matrix = (element: HTMLElement) => {
      const transform = getComputedStyle(element).transform;
      return new DOMMatrix(transform === 'none' ? undefined : transform);
    };
    const coverShift = matrix(stage.current), bookShift = matrix(reading);
    const portrait = mount.parentElement?.classList.contains('is-portrait');
    const pageWidth = book.width / (portrait ? 1 : 2);
    const readingRect = reading.getBoundingClientRect();
    scene.style.setProperty('--reading-hinge-x', `${book.left + (portrait ? 0 : pageWidth) - readingRect.left}px`);
    scene.style.setProperty('--reading-hinge-y', `${book.top - readingRect.top}px`);
    scene.style.setProperty('--cover-scale-x', String(pageWidth / stage.current.offsetWidth));
    scene.style.setProperty('--cover-scale-y', String(book.height / stage.current.offsetHeight));
    // The facing flyleaf travels with the board. Its inert copy meets the real
    // leaf at 180 degrees; the permanent board remains underneath that leaf.
    const facing = mount.querySelector<HTMLElement>('.notebook-leaf.--left[aria-hidden="false"] .notebook-sheet');
    if (inside.current && !portrait && facing) {
      const copy = facing.cloneNode(true) as HTMLElement;
      copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      copy.style.width = `${pageWidth}px`;
      copy.style.height = `${book.height}px`;
      copy.style.transformOrigin = 'top left';
      copy.style.transform = `scale(${stage.current.offsetWidth / pageWidth}, ${stage.current.offsetHeight / book.height})`;
      inside.current.replaceChildren(copy);
    }
    if (inside.current && portrait) {
      const neighbor = mount.parentElement?.querySelector<HTMLElement>('.notebook-mobile-facing');
      if (neighbor) {
        const copy = neighbor.cloneNode(true) as HTMLElement;
        copy.classList.add('lined-notebook', 'is-mobile');
        copy.style.width = `${pageWidth}px`;
        copy.style.height = `${book.height}px`;
        copy.style.transformOrigin = 'top left';
        copy.style.transform = `scale(${stage.current.offsetWidth / pageWidth}, ${stage.current.offsetHeight / book.height})`;
        inside.current.replaceChildren(copy);
      }
    }
    scene.style.setProperty('--cover-shift-x', `${book.left - bookShift.e + (portrait ? 0 : book.width / 2) - cover.left + coverShift.e}px`);
    scene.style.setProperty('--cover-shift-y', `${book.top - bookShift.f - cover.top + coverShift.f}px`);
    prepared.current = true;
    // Preparing on pointer-down must not expose the book around a closed board.
    updatePosition(position.current);
  };
  const beginOpening = () => {
    onPrepare();
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!stage.current) return;
      measureHinge();
      onOpen();
      settle(1);
    });
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return <main className={`notebook-cover-desk${opening ? ' is-opening' : ''}${dragging ? ' is-dragging' : ''}`} aria-label="Haider Toha’s notebook">
    <h1 className="sr-only">Haider Toha’s notebook</h1>
    <div ref={stage} className="notebook-cover-stage">
      <button type="button" className="notebook-cover" aria-label="Open notebook" aria-describedby="notebook-cover-hint" disabled={opening}
        onClick={event => {
          const ignorePointerClick = suppressClick.current && event.detail > 0;
          suppressClick.current = false;
          if (!ignorePointerClick) beginOpening();
        }}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || opening) return;
          suppressClick.current = false;
          cancelAnimationFrame(frame.current);
          drag.current = { id: event.pointerId, x: event.clientX, width: event.currentTarget.clientWidth, start: position.current, moved: false, progress: position.current, time: event.timeStamp, velocity: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
          onPrepare();
          frame.current = requestAnimationFrame(measureHinge);
        }}
        onPointerMove={event => {
          const held = drag.current;
          if (!held || held.id !== event.pointerId) return;
          const distance = held.x - event.clientX;
          if (Math.abs(distance) > 6 && !held.moved) { held.moved = true; setDragging(true); }
          if (!held.moved) return;
          const next = Math.acos(Math.max(-1, Math.min(1, Math.cos(Math.PI * held.start) - distance / held.width))) / Math.PI;
          const elapsed = Math.max(1, event.timeStamp - held.time);
          held.velocity = .6 * held.velocity + .4 * (next - held.progress) / elapsed;
          held.time = event.timeStamp;
          held.progress = next;
          updatePosition(next);
        }}
        onPointerUp={event => {
          const held = drag.current;
          if (!held || held.id !== event.pointerId) return;
          drag.current = null;
          suppressClick.current = held.moved;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          const velocity = event.timeStamp - held.time < 100 ? held.velocity : 0;
          if (held.moved && held.progress >= .25) { onOpen(); settle(1, velocity); }
          else if (held.moved) settle(0, velocity);
          setDragging(false);
        }}
        onPointerCancel={() => { drag.current = null; suppressClick.current = true; setDragging(false); settle(0); }}
        onLostPointerCapture={() => { if (drag.current) { drag.current = null; suppressClick.current = true; setDragging(false); settle(0); } }}>
        <picture>
          <source type="image/webp" srcSet="/cover-600.webp 600w, /cover.webp 1086w" sizes="(max-width: 600px) 85vw, 540px" />
          <img src="/cover.png" width="1086" height="1448" alt="" fetchPriority="high" draggable={false} />
        </picture>
        <span ref={inside} className="notebook-cover-inside" aria-hidden="true" inert>
          <span className="notebook-cover-endpaper" />
        </span>
      </button>
      <p id="notebook-cover-hint" className="sr-only">Click, tap, or drag the cover left to open. Keyboard: Enter or Space.</p>
    </div>
  </main>;
}
