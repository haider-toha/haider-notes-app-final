import React from 'react';
import './NotebookContents.css';

export interface NotebookSection {
  id: string;
  label: string;
  /** Zero-based source reading page; the two contents leaves are preliminary. */
  page: number;
  folder?: string;
}

interface NotebookContentsProps {
  sections: NotebookSection[];
  part: 0 | 1;
  onNavigate: (sourcePage: number) => void;
}

/** Plain contents ink, rendered on the same physical leaves as the writing. */
export default function NotebookContents({ sections, part, onNavigate }: NotebookContentsProps) {
  const groups = sections.reduce<{ id: string; label: string; notes: NotebookSection[] }[]>((result, section) => {
    const id = section.folder || section.id;
    const group = result.find(item => item.id === id);
    if (group) group.notes.push(section);
    else result.push({ id, label: section.folder || section.label, notes: [section] });
    return result;
  }, []);
  const ordered = groups.flatMap(group => group.notes);
  const midpoint = Math.ceil(ordered.length / 2);
  const visibleIds = new Set(ordered.slice(part === 0 ? 0 : midpoint, part === 0 ? midpoint : ordered.length).map(note => note.id));

  return <nav className="notebook-contents-page" aria-label={`Notebook contents, page ${part + 1} of 2`}>
    {part === 0 && <h1>contents</h1>}
    {groups.map(group => {
      const notes = group.notes.filter(note => visibleIds.has(note.id));
      if (!notes.length) return null;
      return <section key={group.id} aria-labelledby={`notebook-contents-${part}-${group.id}`}>
        <h2 id={`notebook-contents-${part}-${group.id}`}>{group.label}</h2>
        {notes.map(note => <button type="button" key={note.id}
          aria-label={`Go to ${note.label}, page ${note.page + 1}`}
          onPointerDown={event => event.stopPropagation()}
          onClick={() => onNavigate(note.page)}>
          <span>{note.label}</span><small>{note.page + 1}</small>
        </button>)}
      </section>;
    })}
  </nav>;
}
