import { notebookPages, legacyNotebookPages } from './notebookPages';

/** Store a source position so repagination does not move someone's bookmark. */
export function encodeNotebookPlace(index: number): string {
  const page = notebookPages[index];
  const offset = notebookPages.slice(0, index)
    .filter(candidate => candidate.note.id === page.note.id)
    .reduce((sum, candidate) => sum + candidate.content.length, 0);
  return JSON.stringify({ noteId: page.note.id, offset });
}

export function decodeNotebookPlace(value: string | null): number | null {
  if (value === null || !value.trim()) return null;
  try {
    let location = JSON.parse(value);
    if (typeof location === 'number') {
      if (!Number.isInteger(location) || location < 0 || location >= legacyNotebookPages.length) return null;
      const oldPage = legacyNotebookPages[location];
      location = {
        noteId: oldPage.note.id,
        offset: legacyNotebookPages.slice(0, location)
          .filter(candidate => candidate.note.id === oldPage.note.id)
          .reduce((sum, candidate) => sum + candidate.content.length, 0),
      };
    }
    if (!location || typeof location.noteId !== 'string' || !Number.isInteger(location.offset) || location.offset < 0) return null;
    let offset = 0;
    let last: number | null = null;
    for (const [index, page] of notebookPages.entries()) {
      if (page.note.id !== location.noteId) continue;
      last = index;
      offset += page.content.length;
      if (location.offset < offset) return index;
    }
    return last;
  } catch { return null; }
}
