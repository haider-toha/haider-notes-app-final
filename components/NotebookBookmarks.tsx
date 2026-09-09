import React, { useEffect, useState } from 'react';
import './NotebookBookmarks.css';

const sections = [
  { label: 'start', page: 0, color: '#6d7f8b' },
  { label: 'work', page: 1, color: '#8a9279' },
  { label: 'off duty', page: 2, color: '#ac8873' },
];

interface NotebookBookmarksProps {
  currentPage: number;
  visiblePages: number;
  onNavigate: (index: number) => void;
}

export default function NotebookBookmarks({ currentPage, visiblePages, onNavigate }: NotebookBookmarksProps) {
  const [labelsDismissed, setLabelsDismissed] = useState(false);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLabelsDismissed(true);
    };
    document.addEventListener('keydown', dismiss, true);
    return () => document.removeEventListener('keydown', dismiss, true);
  }, []);
  return <nav className={`notebook-bookmarks${labelsDismissed ? ' labels-dismissed' : ''}`} aria-label="Notebook sections"
    onPointerDown={event => event.stopPropagation()}
    onKeyDown={event => event.stopPropagation()}>
    {sections.map(section => {
      const visible = section.page >= currentPage && section.page < currentPage + visiblePages;
      return <button key={section.page} type="button"
        className={`notebook-bookmark${visible ? ' is-visible' : ''}`}
        style={{ '--bookmark-color': section.color } as React.CSSProperties}
        aria-label={`Go to ${section.label}`}
        onPointerEnter={() => setLabelsDismissed(false)}
        onFocus={() => setLabelsDismissed(false)}
        onClick={() => onNavigate(section.page)}>
        <span className="notebook-bookmark-fabric" aria-hidden="true" />
        <span className="notebook-bookmark-label" aria-hidden="true">{section.label}</span>
      </button>;
    })}
  </nav>;
}
