import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { PageFlip, loadNotebookPages, finishNotebookTouch } from './notebookPageFlip';
import { notebookPages as pages, notebookSections, sheetTexts } from './notebookPages';
import NotebookContent from './NotebookContent';
import { decodeNotebookPlace, encodeNotebookPlace } from './notebookPlace';
import './LinedNotebook.css';
import { useLooseSheet } from './useLooseSheet';
import NotebookContents from './NotebookContents';
import { reverseInkText, useNotebookDetails } from './notebookDetails';
import './NotebookMobile.css';
import { stripMarkdown } from '../seo';

const phoneLayout = '(max-width: 700px), (max-height: 500px) and (pointer: coarse)';
const contentsPages = 2;
const pageCount = pages.length + contentsPages;
const sections = notebookSections.map(section => ({ id: section.id, label: section.title, page: section.firstPage, folder: section.folder }));
const placeKey = 'haider-notebook-place';

function facingInk(text: string) {
  const lines = [''];
  for (const word of stripMarkdown(text).split(/\s+/)) {
    const last = lines.length - 1;
    if (lines[last].length + word.length > 40) lines.push(word);
    else lines[last] += `${lines[last] ? ' ' : ''}${word}`;
  }
  return lines.join('\n');
}

function updateScrollCue(writing: HTMLElement) {
  writing.style.setProperty('--notebook-figure-height', `${Math.max(96, writing.clientHeight - 48)}px`);
  writing.parentElement?.setAttribute('data-more-below', String(writing.scrollHeight - writing.clientHeight - writing.scrollTop > 8));
}

function savedPage() {
  try {
    return decodeNotebookPlace(localStorage.getItem(placeKey)) ?? 0;
  } catch { return 0; }
}

interface LinedNotebookProps {
  initialPage?: number;
  showContents?: boolean;
  onOpenContents?: () => void;
  navigationKey?: string;
  onPageChange?: (page: number) => void;
  onSelectPage?: (page: number) => void;
}

export default function LinedNotebook({ initialPage, showContents = false, onOpenContents, navigationKey, onPageChange, onSelectPage }: LinedNotebookProps = {}) {
  const pageChangeHandler = useRef(onPageChange);
  pageChangeHandler.current = onPageChange;
  const [page, setPage] = useState(() => showContents ? 0 : (initialPage ?? savedPage()) + contentsPages);
  const [destination, setDestination] = useState<number | null>(null);
  const [compact, setCompact] = useState(() => window.matchMedia(phoneLayout).matches);
  const [mobile, setMobile] = useState(compact);
  const scrollPositions = useRef(new Map<number, number>());
  const host = useRef<HTMLDivElement>(null);
  const book = useRef<PageFlip | null>(null);
  const resizeBook = useRef<() => void>(() => {});
  const currentPage = useRef(page);
  const readingPage = useRef((initialPage ?? savedPage()) + contentsPages);
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
  }, compact);
  const step = mobile ? 1 : 2;
  const paperStyle = useNotebookDetails(page, pageCount, mobile, reducedMotion, leaves, turning);
  const lastPage = Math.floor((pageCount - 1) / step) * step;
  const move = (next: number) => {
    const target = Math.max(0, Math.min(lastPage, next));
    if (!book.current || turning || target === page || (loose.sheet && !loose.sheet.released)) return;
    // Mount the destination before the engine takes its first animation frame.
    flushSync(() => setDestination(target));
    if (reducedMotion) book.current.turnToPage(target);
    else book.current.flip(target, 'bottom');
  };

  useEffect(() => {
    const query = window.matchMedia(phoneLayout);
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    if (!compact) return;
    for (let index = Math.max(0, page - 1); index <= Math.min(pageCount - 1, page + 1); index++) {
      const writing = leaves[index]?.querySelector<HTMLElement>('.notebook-writing');
      if (writing) writing.scrollTop = scrollPositions.current.get(index) ?? 0;
    }
    if (destination !== null) {
      const writing = leaves[destination]?.querySelector<HTMLElement>('.notebook-writing');
      if (writing) writing.scrollTop = scrollPositions.current.get(destination) ?? 0;
    }
  }, [compact, page, destination, leaves]);

  useEffect(() => {
    const writers = leaves.flatMap((leaf, index) =>
      Math.abs(index - page) <= 3 || (destination !== null && Math.abs(index - destination) <= 3)
        ? Array.from(leaf.querySelectorAll('.notebook-writing')) as HTMLElement[] : []);
    const refresh = () => writers.forEach(updateScrollCue);
    const observer = new ResizeObserver(refresh);
    for (const writing of writers) {
      observer.observe(writing);
      for (const child of writing.children) observer.observe(child);
    }
    refresh();
    return () => observer.disconnect();
  }, [compact, page, destination, leaves]);

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
      setDestination(null);
      const portrait = instance.getOrientation() === 'portrait';
      setMobile(portrait);
      leaves.forEach((leaf, i) => {
        const visible = i >= current && i < current + (portrait ? 1 : 2);
        leaf.inert = !visible;
        leaf.setAttribute('aria-hidden', String(!visible));
      });
    };
    instance.on('init', sync);
    instance.on('flip', () => {
      sync();
      try {
        const index = instance.getCurrentPageIndex();
        if (index >= contentsPages) {
          readingPage.current = index;
          localStorage.setItem(placeKey, encodeNotebookPlace(index - contentsPages));
        }
      }
      catch { /* Reading still works when browser storage is unavailable. */ }
    });
    instance.on('changeOrientation', sync);
    let resizePending = false;
    let resizeFrame = 0;
    let lastGeometry = '';
    const resize = () => {
      resizeFrame = 0;
      if (instance.getState() !== 'read' || pointer.current) { resizePending = true; return; }
      resizePending = false;
      const width = mount.clientWidth;
      const phone = window.matchMedia(phoneLayout).matches;
      const portrait = phone || width < 700;
      const desk = mount.closest<HTMLElement>('.notebook-desk')!;
      const deskStyle = getComputedStyle(desk);
      const available = desk.clientHeight - parseFloat(deskStyle.paddingTop) - parseFloat(deskStyle.paddingBottom);
      const height = Math.max(220, Math.floor(Math.min(available, phone ? width * 1.85 : portrait ? 1000 : 720)));
      const pageWidth = portrait ? Math.min(width, 540) : width / 2;
      const geometry = `${pageWidth}:${height}:${portrait}`;
      if (geometry === lastGeometry) return;
      lastGeometry = geometry;
      container.style.height = height + 'px';
      const settings = instance.getSettings();
      settings.width = pageWidth;
      settings.height = height;
      settings.usePortrait = portrait;
      instance.update();
      sync();
    };
    const scheduleResize = () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(resize);
    };
    resizeBook.current = scheduleResize;
    instance.on('changeState', event => {
      setTurning(event.data === 'flipping' || event.data === 'user_fold');
      if (event.data === 'read' && resizePending) scheduleResize();
    });
    const dispose = loadNotebookPages(instance, leaves);
    const observer = new ResizeObserver(scheduleResize);
    observer.observe(mount);
    observer.observe(mount.closest('.notebook-desk')!);
    window.addEventListener('resize', scheduleResize);
    window.visualViewport?.addEventListener('resize', scheduleResize);
    sync();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', scheduleResize);
      window.visualViewport?.removeEventListener('resize', scheduleResize);
      dispose(); book.current = null;
    };
  }, [leaves]);

  const point = (event: React.PointerEvent) => {
    const rect = host.current!.querySelector('.stf__block')!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const previouslyVisiblePage = useRef(page);
  useEffect(() => {
    if (page >= contentsPages) pageChangeHandler.current?.(page - contentsPages);
    else if (previouslyVisiblePage.current >= contentsPages) onOpenContents?.();
    previouslyVisiblePage.current = page;
  }, [page]);

  useEffect(() => {
    const target = showContents ? 0 : (initialPage ?? savedPage()) + contentsPages;
    setDestination(target);
    const frame = requestAnimationFrame(() => {
      const instance = book.current;
      if (instance) instance.turnToPage(target);
    });
    return () => cancelAnimationFrame(frame);
  }, [initialPage, showContents, navigationKey]);

  const selectPage = (index: number) => {
    if (turning) return;
    if (onSelectPage) onSelectPage(index);
    else move(Math.floor((index + contentsPages) / step) * step);
  };

  const renderContentsLink = (index: number) => !mobile && index % 2 === 1 ? null : <button className="notebook-contents-link"
    aria-label={index < contentsPages ? 'Back to reading' : 'Open contents'} disabled={turning}
    onClick={() => {
      if (index < contentsPages) selectPage(readingPage.current - contentsPages);
      else { readingPage.current = index; if (onOpenContents) onOpenContents(); else move(0); }
    }}>
    {index < contentsPages ? 'continue reading →' : '← contents'}
  </button>;

  const renderMobileControls = (index: number) => compact && <>
    <div className="notebook-mobile-grip" data-side="left" aria-hidden="true" />
    <div className="notebook-mobile-grip" data-side="right" aria-hidden="true" />
    <div className="notebook-mobile-page-controls">
      <button className="notebook-mobile-turn" aria-label="Previous notebook page" disabled={turning || index === 0} onClick={() => move(index - 1)}>← prev</button>
      <button className="notebook-mobile-turn" aria-label="Next notebook page" disabled={turning || index >= pageCount - 1} onClick={() => move(index + 1)}>next →</button>
    </div>
  </>;

  const rememberScroll = (index: number, event: React.UIEvent<HTMLDivElement>) => {
    updateScrollCue(event.currentTarget);
    if (compact && ((index >= page && index < page + step) || loose.sheet?.index === index)) {
      scrollPositions.current.set(index, event.currentTarget.scrollTop);
    }
  };

  const renderSheet = (index: number) => {
    const sourceIndex = index - contentsPages;
    const content = pages[sourceIndex];
    const nearby = Math.abs(index - page) <= 3 || (destination !== null && Math.abs(index - destination) <= 3);
    const detached = loose.sheet?.index === index;
    if (index < contentsPages) return <article className="notebook-sheet notebook-contents-sheet" data-page-side={index % 2 ? 'right' : 'left'} data-contents-part={index}>
      {renderContentsLink(index)}
      <div className="notebook-running-head" aria-hidden="true" />
      <div className="notebook-writing" onScroll={event => rememberScroll(index, event)}><NotebookContents sections={sections} part={index as 0 | 1} onNavigate={selectPage} /></div>
      {renderMobileControls(index)}
      <span className="notebook-page-number">{index === 0 ? 'i' : 'ii'}</span>
    </article>;
    return <article className="notebook-sheet" data-page-side={index % 2 ? 'right' : 'left'} data-note-id={content.note.id} data-page-index={sourceIndex}>
            {renderContentsLink(index)}
            <span className="notebook-reverse-ink" aria-hidden="true">{reverseInkText(sheetTexts, sourceIndex)}</span>
            <div className="notebook-running-head" aria-hidden="true">{sourceIndex !== 0 && <span>{content.note.title}</span>}</div>
            <div className="notebook-writing" onScroll={event => rememberScroll(index, event)}>
              {(nearby || detached) && <NotebookContent page={content} active={detached || (index >= page && index < page + step)} onNavigate={selectPage} />}
            </div>
            {renderMobileControls(index)}
            <span className="notebook-page-number">{sourceIndex + 1}</span>
          </article>;
  };

  return <main className={`lined-notebook${compact ? ' is-mobile' : ''}`}>
    <section className="notebook-desk" aria-label="Interactive lined notebook">
      <div className={`notebook-spread ${mobile ? 'is-portrait' : ''} ${turning ? 'is-turning' : ''}`} style={paperStyle} tabIndex={0} aria-label="Notebook. Drag either outer edge or use left and right arrow keys to turn pages."
        onKeyDown={e => {
          if ((e.target as HTMLElement).closest('button, a, input, textarea, select, iframe, [role=dialog]')) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault(); move(currentPage.current + (e.key === 'ArrowRight' ? step : -step));
          }
        }}
        onPointerDown={e => {
          if (e.button !== 0 || pointer.current || (e.target as HTMLElement).closest('a, button:not(.notebook-edge), input, textarea, select, iframe, .notebook-diagram, [role=dialog]') || turning) return;
          if (compact && !(e.target as HTMLElement).closest('.notebook-edge, .notebook-mobile-grip')) return;
          const rect = host.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x > (compact ? 24 : 70) && x < rect.width - (compact ? 24 : 70)) return;
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
            if (!loose.active() && (!compact || !drag.back) && (outward > 8 || (!compact && mobile && Math.abs(dy) > 24 && outward > -8))) {
              const index = mobile ? page : page + (drag.back ? 0 : 1);
              const rect = host.current!.getBoundingClientRect();
              if (leaves[index] && loose.begin(index, leaves[index], !mobile && drag.back, e.pointerId, rect.x + drag.start.x, rect.y + drag.start.y)) {
                drag.mode = 'loose';
              }
            } else {
              if (compact && (outward > -8 || Math.abs(dx) < Math.abs(dy) * 0.8)) return;
              if (!compact && mobile && outward > -8 && Math.abs(dy) <= 24) return;
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
          resizeBook.current();
          if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
          if (drag.mode === 'loose') { loose.finish(); return; }
          if (compact && drag.mode === 'pending' && Math.hypot(point(e).x - drag.start.x, point(e).y - drag.start.y) >= 8) return;
          if (compact && drag.mode === 'turn') {
            const distance = (point(e).x - drag.start.x) * (drag.back ? 1 : -1);
            const commit = distance >= host.current!.getBoundingClientRect().width / 2;
            if (reducedMotion) { if (commit) move(page + (drag.back ? -step : step)); }
            else if (book.current) finishNotebookTouch(book.current, commit);
            return;
          }
          if (reducedMotion || drag.mode === 'pending') move(page + (drag.back ? -step : step));
          else book.current?.userStop(point(e));
        }}
        onPointerCancel={e => {
          if (pointer.current?.mode === 'loose') loose.finish(true);
          else if (pointer.current?.mode === 'turn') {
            if (compact && book.current) finishNotebookTouch(book.current, false);
            else book.current?.userStop(point(e));
          }
          pointer.current = null;
          resizeBook.current();
        }}>
        <div className="notebook-paper-stack stack-read" aria-hidden="true" />
        <div className="notebook-paper-stack stack-unread" aria-hidden="true" />
        {compact && <span className="notebook-mobile-facing" aria-hidden="true">{page >= contentsPages ? facingInk(sheetTexts[Math.max(0, page - contentsPages - 1)]) : 'contents\n\nprofile\n\nprojects\n\nblog'}</span>}
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
        if ((e.target as HTMLElement).closest('a, button, input, textarea, select, iframe')) return;
        const direction: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] };
        if (direction[e.key]) { e.preventDefault(); loose.nudge(...direction[e.key]); }
        if (e.key === 'Enter') { e.preventDefault(); loose.finish(); }
      }}
      onPointerDown={e => {
        if (!loose.sheet?.released || (e.target as HTMLElement).closest('a, button, input, textarea, select, iframe')) return;
        if (compact && !(e.target as HTMLElement).closest('.notebook-mobile-grip, .notebook-running-head')) return;
        e.preventDefault(); e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        loose.pickUp(e.pointerId, e.clientX, e.clientY);
      }}
      onPointerMove={e => loose.move(e.pointerId, e.clientX, e.clientY)}
      onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) { e.currentTarget.releasePointerCapture(e.pointerId); loose.finish(); } }}
      onPointerCancel={() => loose.finish(true)}
    >{renderSheet(loose.sheet.index)}</div>}
    <span className="notebook-accessible-status" aria-live="polite">{page < contentsPages ? 'Contents.' : `Pages ${page - contentsPages + 1}${!mobile && page + 1 < pageCount ? `–${page - contentsPages + 2}` : ''} of ${pages.length}.`}</span>
  </main>;
}
