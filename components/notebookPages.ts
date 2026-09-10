import { portfolioNotes } from '../constants';
import type { Note } from '../types';
import pageCuts from './notebookPageCuts.json';

export interface NotebookPage {
  note: Note;
  content: string;
  part: number;
  partCount: number;
}

/** Build-generated source offsets avoid running the page-packing algorithm at startup. */
function pagesFromCuts(kind: 'pages' | 'legacy'): NotebookPage[] {
  return portfolioNotes.flatMap(note => {
    const ends = pageCuts.notes.find(entry => entry.id === note.id)?.[kind];
    if (!ends || ends.at(-1) !== note.content.length) {
      throw new Error(`Missing or stale notebook pagination for ${note.id}; restart Vite or rebuild.`);
    }
    return ends.map((end, part) => ({
      note,
      content: note.content.slice(part ? ends[part - 1] : 0, end),
      part,
      partCount: ends.length,
    }));
  });
}

// Retain historical cuts for migration of numeric browser bookmarks.
export const legacyNotebookPages = pagesFromCuts('legacy');
export const notebookPages = pagesFromCuts('pages');
export const sheetTexts = notebookPages.map(page => page.content);
export const notebookSections = portfolioNotes.map(note => {
  const firstPage = notebookPages.findIndex(page => page.note.id === note.id);
  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    folder: note.folder ?? note.category,
    firstPage,
    pageCount: notebookPages[firstPage].partCount,
  };
});
