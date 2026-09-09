import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PageFlip, loadNotebookPages } from './notebookPageFlip';
import { Link } from 'react-router';
import { portfolioNotes } from '../constants';
import './LinedNotebook.css';

const paragraphs = portfolioNotes[0].content.split('\n\n');
// Keep the opening identity page, then combine consecutive paragraphs into
// readable page-length passages. Paragraph breaks are not page breaks.
const pages = [paragraphs.slice(0, 2).join('\n\n')];
let passage = '';
for (const paragraph of paragraphs.slice(2)) {
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
if (pages.length % 2) pages.push('');
const scratchStart = pages.length;
const pageCount = pages.length + 2;


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
  const [drafts, setDrafts] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('haider-notebook-drafts') || '["", ""]');
      return Array.isArray(saved) && saved.length === 2 && saved.every(v => typeof v === 'string') ? saved : ['', ''];
    } catch { return ['', '']; }
  });
  const [saveStatus, setSaveStatus] = useState('Only saved in this browser');
  const pointer = useRef<{ id: number; back: boolean; start: { x: number; y: number }; anchor: { x: number; y: number } } | null>(null);
  const step = mobile ? 1 : 2;
  const move = (next: number) => {
    const target = Math.max(0, Math.min(pageCount - step, next));
    if (!book.current || turning || target === page) return;
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

  const write = (index: number, value: string) => {
    const next = [...drafts];
    next[index] = value;
    setDrafts(next);
    try {
      localStorage.setItem('haider-notebook-drafts', JSON.stringify(next));
      setSaveStatus('Saved in this browser');
    } catch { setSaveStatus('Could not save. Copy your writing before leaving.'); }
  };

  return <main className="lined-notebook">
    <section className="notebook-desk" aria-label="Interactive lined notebook">
      <div className={`notebook-spread ${mobile ? 'is-portrait' : ''} ${turning ? 'is-turning' : ''}`} tabIndex={0} aria-label="Notebook. Drag either outer edge or use left and right arrow keys to turn pages."
        onKeyDown={e => {
          if ((e.target as HTMLElement).closest('textarea, button, a')) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault(); move(page + (e.key === 'ArrowRight' ? step : -step));
          }
        }}
        onPointerDown={e => {
          if (e.button !== 0 || (e.target as HTMLElement).closest('textarea, a') || turning) return;
          const rect = host.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x > 70 && x < rect.width - 70) return;
          const back = x < rect.width / 2;
          if ((back && page === 0) || (!back && page >= pageCount - step)) return;
          const start = point(e);
          // The renderer expects a CORNER position. Feeding it a mid-edge
          // pointer position instantly folds half a sheet before any real drag.
          // Start flat at the outer boundary and apply only pointer displacement.
          const anchor = { x: back ? 1 : rect.width - 1, y: start.y < rect.height / 2 ? 1 : rect.height - 1 };
          pointer.current = { id: e.pointerId, back, start, anchor };
          e.currentTarget.setPointerCapture(e.pointerId);
          e.preventDefault();
          if (!reducedMotion) book.current?.startUserTouch(anchor);
        }}
        onPointerMove={e => {
          if (reducedMotion || !book.current) return;
          const drag = pointer.current;
          if (!drag || drag.id !== e.pointerId) return;
          const current = point(e);
          book.current.userMove({
            x: drag.anchor.x + current.x - drag.start.x,
            y: drag.anchor.y + current.y - drag.start.y,
          }, true);
        }}
        onPointerUp={e => {
          const drag = pointer.current;
          if (!drag || drag.id !== e.pointerId) return;
          pointer.current = null;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
          if (reducedMotion) move(page + (drag.back ? -step : step));
          else book.current?.userStop(point(e));
        }}
        onPointerCancel={e => {
          if (pointer.current) book.current?.userStop(point(e));
          pointer.current = null;
        }}>
        <div className="notebook-mount" ref={host} />
        {!turning && <>
          <button className="notebook-edge edge-back" aria-label="Turn previous page" disabled={page === 0} onClick={e => { if (e.detail === 0) move(page - step); }}></button>
          <button className="notebook-edge edge-next" aria-label="Turn next page" disabled={page >= pageCount - step} onClick={e => { if (e.detail === 0) move(page + step); }}></button>
        </>}
        {leaves.map((leaf, index) => {
          const scratch = index >= scratchStart;
          return createPortal(<article className="notebook-sheet">
            <div className="notebook-running-head"><span>{scratch ? 'a little room for your thoughts' : index === 0 ? 'a few words about me' : 'about me, continued'}</span></div>
            {scratch && saveStatus.startsWith('Could not save') && <p className="notebook-save-error" role="alert">{saveStatus}</p>}
            <div className="notebook-writing">
              {scratch ? <textarea aria-label={`Scratchpad page ${index - scratchStart + 1}`} placeholder="Put pen to paper…" value={drafts[index - scratchStart]} onChange={e => write(index - scratchStart, e.target.value)} spellCheck={false} /> : <p><HandwrittenText text={pages[index]} /></p>}
              {index === 0 && <div className="notebook-intro"><p>haider's<br />notebook.</p><span>notes, work & things along the way</span><Link to="/profile/about-me">explore all notes<span className="notebook-link-arrow" aria-hidden="true">↗</span></Link></div>}
            </div>
            <span className="notebook-page-number">{index + 1}</span>
          </article>, leaf, String(index));
        })}
      </div>
    </section>

    <span className="notebook-accessible-status" aria-live="polite">Pages {page + 1}{!mobile && `–${page + 2}`} of {pageCount}. {page >= scratchStart ? saveStatus : ''}</span>
  </main>;
}
