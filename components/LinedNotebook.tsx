import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PageFlip, loadNotebookPages } from './notebookPageFlip';
import { portfolioNotes } from '../constants';
import './LinedNotebook.css';
import { useLooseSheet } from './useLooseSheet';

const paragraphs = portfolioNotes[0].content.split('\n\n');
// Keep the opening identity page, then combine consecutive paragraphs into
// readable page-length passages. Paragraph breaks are not page breaks.
const pages = [paragraphs.slice(0, 2).join('\n\n')];
let passage = '';
for (const paragraph of paragraphs.slice(3)) {
  const combined = passage ? passage + '\n\n' + paragraph : paragraph;
  const visibleLength = combined.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1 ↗').length;
  if (passage && visibleLength > 1050) {
    pages.push(passage);
    passage = paragraph;
  } else {
    passage = combined;
  }
}
if (passage) pages.push(passage);
// Avoid an almost-empty final reading page by balancing the last two pages.
if (pages.length > 2) {
  const previous = pages[pages.length - 2].split('\n\n');
  while (pages[pages.length - 1].length < 525 && previous.length > 1) {
    pages[pages.length - 1] = previous.pop()! + '\n\n' + pages[pages.length - 1];
  }
  pages[pages.length - 2] = previous.join('\n\n');
}
const pageCount = pages.length;

function HandwrittenText({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    const external = link && /^https?:\/\//i.test(link[2]);
    return link ? <a key={i} href={link[2]} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{link[1]}<span className="notebook-link-arrow" aria-hidden="true">↗</span></a> : <React.Fragment key={i}>{part}</React.Fragment>;
  })}</>;
}

export default function LinedNotebook() {
  const [page, setPage] = useState(0);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches);
  const host = useRef<HTMLDivElement>(null);
  const book = useRef<PageFlip | null>(null);
  const currentPage = useRef(0);
  const [turning, setTurning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [leaves] = useState(() => Array.from({ length: pageCount }, () => {
    const leaf = document.createElement('div');
    leaf.className = 'notebook-leaf';
    return leaf;
  }));
  const pointer = useRef<{ id: number; back: boolean; start: { x: number; y: number }; anchor: { x: number; y: number }; mode: 'pending' | 'turn' | 'loose' } | null>(null);
  const loose = useLooseSheet(reducedMotion, index => {
    book.current?.turnToPage(index);
    const rect = host.current!.getBoundingClientRect();
    const portrait = book.current?.getOrientation() === 'portrait';
    const width = portrait ? rect.width : rect.width / 2;
    return new DOMRect(rect.x + (!portrait && index % 2 ? width : 0), rect.y, width, rect.height);
  });
  const step = mobile ? 1 : 2;
  const lastPage = Math.floor((pageCount - 1) / step) * step;
  const move = (next: number) => {
    const target = Math.max(0, Math.min(lastPage, next));
    if (!book.current || turning || target === page || (loose.sheet && !loose.sheet.released)) return;
    if (reducedMotion) book.current.turnToPage(target);
    else book.current.flip(target, 'bottom');
  };

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const mount = host.current!;
    const container = document.createElement('div');
    container.className = 'notebook-engine';
    mount.appendChild(container);
    const instance = new PageFlip(container, {
      width: 540, height: 680, size: 'fixed' as never,
      minWidth: 280, maxWidth: 540, minHeight: 680, maxHeight: 1100,
      autoSize: false, usePortrait: true, showCover: false,
      drawShadow: true, maxShadowOpacity: 0.28, flippingTime: 950,
      useMouseEvents: false, showPageCorners: false, disableFlipByClick: false,
      startPage: currentPage.current,
    });
    book.current = instance;
    const sync = () => {
      const current = instance.getCurrentPageIndex();
      currentPage.current = current;
      setPage(current);
      const portrait = instance.getOrientation() === 'portrait';
      setMobile(portrait);
      leaves.forEach((leaf, i) => {
        const visible = i >= current && i < current + (portrait ? 1 : 2);
        leaf.inert = !visible;
        leaf.setAttribute('aria-hidden', String(!visible));
      });
    };
    instance.on('init', sync);
    instance.on('flip', sync);
    instance.on('changeOrientation', sync);
    instance.on('changeState', event => setTurning(event.data === 'flipping' || event.data === 'user_fold'));
    const dispose = loadNotebookPages(instance, leaves);
    const observer = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const portrait = width < 700;
      // A page keeps its readable line height; narrow paper gets taller.
      container.style.height = (portrait ? 1000 : 720) + 'px';
      const settings = instance.getSettings();
      settings.width = portrait ? Math.min(width, 540) : width / 2;
      settings.height = portrait ? 1000 : 720;
      settings.usePortrait = portrait;
      instance.update();
      sync();
    });
    observer.observe(mount);
    sync();
    return () => { observer.disconnect(); dispose(); book.current = null; };
  }, [leaves]);

  const point = (event: React.PointerEvent) => {
    const rect = host.current!.querySelector('.stf__block')!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  useEffect(() => {
    document.title = "Notebook · Haider Toha";
  }, []);

  const renderSheet = (index: number) => {
    return <article className="notebook-sheet">
            <div className="notebook-running-head" aria-hidden={index === 0 ? true : undefined}>{index !== 0 && <span>about me, continued</span>}</div>
            <div className="notebook-writing">
              {index === 0 ? (
                <div className="notebook-intro">
                  <h1>{paragraphs[0].split('\n')[0]}</h1>
                  <p className="notebook-location">{paragraphs[0].split('\n').slice(1).join('\n')}</p>
                  <p className="notebook-socials"><HandwrittenText text={paragraphs[1]} /></p>
                  <p className="notebook-opening-copy"><HandwrittenText text={paragraphs[2]} /></p>
                </div>
              ) : <p><HandwrittenText text={pages[index]} /></p>}
            </div>
            <span className="notebook-page-number">{index + 1}</span>
          </article>;
  };

  return <main className="lined-notebook">
    <section className="notebook-desk" aria-label="Interactive lined notebook">
      <div className={`notebook-spread ${mobile ? 'is-portrait' : ''} ${turning ? 'is-turning' : ''}`} tabIndex={0} aria-label="Notebook. Drag either outer edge or use left and right arrow keys to turn pages."
        onKeyDown={e => {
          if ((e.target as HTMLElement).closest('button, a')) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault(); move(page + (e.key === 'ArrowRight' ? step : -step));
          }
        }}
        onPointerDown={e => {
          if (e.button !== 0 || pointer.current || (e.target as HTMLElement).closest('a') || turning) return;
          const rect = host.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x > 70 && x < rect.width - 70) return;
          const back = x < rect.width / 2;
          const start = point(e);
          // The renderer expects a CORNER position. Feeding it a mid-edge
          // pointer position instantly folds half a sheet before any real drag.
          // Start flat at the outer boundary and apply only pointer displacement.
          const anchor = { x: back ? 1 : rect.width - 1, y: start.y < rect.height / 2 ? 1 : rect.height - 1 };
          pointer.current = { id: e.pointerId, back, start, anchor, mode: 'pending' };
          e.currentTarget.setPointerCapture(e.pointerId);
          e.preventDefault();
        }}
        onPointerMove={e => {
          const drag = pointer.current;
          if (!drag || drag.id !== e.pointerId || !book.current) return;
          const current = point(e);
          const dx = current.x - drag.start.x, dy = current.y - drag.start.y;
          if (drag.mode === 'pending') {
            if (Math.hypot(dx, dy) < 8) return;
            const outward = dx * (drag.back ? -1 : 1);
            if (!loose.active() && (outward > 8 || (mobile && Math.abs(dy) > 24 && outward > -8))) {
              const index = mobile ? page : page + (drag.back ? 0 : 1);
              const rect = host.current!.getBoundingClientRect();
              if (leaves[index] && loose.begin(index, leaves[index], !mobile && drag.back, e.pointerId, rect.x + drag.start.x, rect.y + drag.start.y)) {
                drag.mode = 'loose';
              }
            } else {
              if (mobile && outward > -8 && Math.abs(dy) <= 24) return;
              if ((drag.back && page === 0) || (!drag.back && page >= lastPage)) return;
              drag.mode = 'turn';
              if (!reducedMotion) book.current.startUserTouch(drag.anchor);
            }
          }
          if (drag.mode === 'loose') { loose.move(e.pointerId, e.clientX, e.clientY); return; }
          if (!reducedMotion && drag.mode === 'turn') book.current.userMove({
            x: drag.anchor.x + dx,
            y: drag.anchor.y + dy,
          }, true);
        }}
        onPointerUp={e => {
          const drag = pointer.current;
          if (!drag || drag.id !== e.pointerId) return;
          pointer.current = null;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
          if (drag.mode === 'loose') { loose.finish(); return; }
          if (reducedMotion || drag.mode === 'pending') move(page + (drag.back ? -step : step));
          else book.current?.userStop(point(e));
        }}
        onPointerCancel={e => {
          if (pointer.current?.mode === 'loose') loose.finish(true);
          else if (pointer.current?.mode === 'turn') book.current?.userStop(point(e));
          pointer.current = null;
        }}>
        <div className="notebook-mount" ref={host} />
        {!turning && <>
          <button className="notebook-edge edge-back" aria-label="Turn previous page" aria-disabled={page === 0} onClick={e => { if (e.detail === 0) move(page - step); }}></button>
          <button className="notebook-edge edge-next" aria-label="Turn next page" aria-disabled={page >= lastPage} onClick={e => { if (e.detail === 0) move(page + step); }}></button>
        </>}
        {leaves.map((leaf, index) => {
          const removed = loose.sheet?.index === index;
          const underneath = index + (loose.sheet?.left ? -2 : (mobile ? 1 : 2));
          return createPortal(<>
            {renderSheet(index)}
            {removed && underneath >= 0 && underneath < pageCount && <div className="notebook-underleaf">{renderSheet(underneath)}</div>}
          </>, leaf, String(index));
        })}
      </div>
    </section>

    {loose.sheet && <div
      ref={loose.element}
      className={`notebook-loose ${loose.sheet.left ? 'loose-left' : 'loose-right'} ${loose.sheet.released ? 'is-released' : 'is-attached'}`}
      style={{ width: loose.sheet.width, height: loose.sheet.height }}
      tabIndex={0}
      aria-label="Loose notebook sheet. Drag its binding edge back to the spine to reattach. Arrow keys move the sheet; Enter releases it."
      onKeyDown={e => {
        if ((e.target as HTMLElement).closest('a')) return;
        const direction: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] };
        if (direction[e.key]) { e.preventDefault(); loose.nudge(...direction[e.key]); }
        if (e.key === 'Enter') { e.preventDefault(); loose.finish(); }
      }}
      onPointerDown={e => {
        if (!loose.sheet?.released || (e.target as HTMLElement).closest('a')) return;
        e.preventDefault(); e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        loose.pickUp(e.pointerId, e.clientX, e.clientY);
      }}
      onPointerMove={e => loose.move(e.pointerId, e.clientX, e.clientY)}
      onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) { e.currentTarget.releasePointerCapture(e.pointerId); loose.finish(); } }}
      onPointerCancel={() => loose.finish(true)}
    >{renderSheet(loose.sheet.index)}</div>}
    <span className="notebook-accessible-status" aria-live="polite">Pages {page + 1}{!mobile && page + 1 < pageCount && `–${page + 2}`} of {pageCount}.</span>
  </main>;
}
