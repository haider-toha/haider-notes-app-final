// No browser required: checks the actual Vite-loaded notebook model against
// every source note, including byte-for-byte prose and atomic rich blocks.
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

export async function loadNotebookData() {
  const server = await createServer({ cacheDir: 'node_modules/.vite-notebook-check', server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
  try {
    const source = await server.ssrLoadModule('/constants.tsx');
    const model = await server.ssrLoadModule('/components/notebookPages.ts');
    const place = await server.ssrLoadModule('/components/notebookPlace.ts');
    return { ...source, ...model, ...place };
  } finally { await server.close(); }
}

export async function checkContent() {
  const { portfolioNotes, notebookPages, legacyNotebookPages, notebookSections, sheetTexts, encodeNotebookPlace, decodeNotebookPlace } = await loadNotebookData();
  assert.equal(new Set(portfolioNotes.map(note => note.id)).size, portfolioNotes.length);
  assert.deepEqual([...new Set(notebookPages.map(page => page.note.id))], portfolioNotes.map(note => note.id), 'Every source note must remain in source order');
  assert.equal(notebookSections.length, portfolioNotes.length, 'Every note must have a navigable entry');
  assert.equal(sheetTexts.length, notebookPages.length);
  for (let index = 0; index < notebookPages.length; index++) {
    assert.equal(decodeNotebookPlace(encodeNotebookPlace(index)), index, `Page ${index}: source-based saved place must round trip`);
  }
  const sourceOffsets = new Map();
  for (const [index, page] of legacyNotebookPages.entries()) {
    const oldOffset = sourceOffsets.get(page.note.id) ?? 0;
    const migratedIndex = decodeNotebookPlace(String(index));
    assert.notEqual(migratedIndex, null, `Legacy page ${index} must migrate`);
    assert.equal(notebookPages[migratedIndex].note.id, page.note.id, `Legacy page ${index}: bookmark stays in same note`);
    const newOffset = notebookPages.slice(0, migratedIndex).filter(candidate => candidate.note.id === page.note.id).reduce((sum, candidate) => sum + candidate.content.length, 0);
    assert(newOffset <= oldOffset && oldOffset < newOffset + notebookPages[migratedIndex].content.length, `Legacy page ${index}: saved source position remains on selected leaf`);
    sourceOffsets.set(page.note.id, oldOffset + page.content.length);
  }
  for (const invalid of [null, '', ' ', 'broken JSON', 'null', '[]', '{}', '-1', '1.5', String(legacyNotebookPages.length), JSON.stringify({ noteId: 'missing', offset: 0 }), JSON.stringify({ noteId: portfolioNotes[0].id, offset: -1 }), JSON.stringify({ noteId: portfolioNotes[0].id, offset: '2' })]) {
    assert.equal(decodeNotebookPlace(invalid), null, `Reject malformed saved place: ${invalid}`);
  }
  let richBlocks = 0;
  const media = new Set();
  for (const note of portfolioNotes) {
    const pages = notebookPages.filter(page => page.note.id === note.id);
    assert(pages.length, `${note.id}: missing note`);
    assert.equal(pages.map(page => page.content).join(''), note.content, `${note.id}: exact source reconstruction (prose, links, media, math)`);
    for (const [part, page] of pages.entries()) {
      assert.deepEqual(page.note, note, `${note.id}: metadata changed`);
      assert.equal(page.part, part);
      assert.equal(page.partCount, pages.length);
      if (part < pages.length - 1) {
        const lastLine = page.content.trimEnd().split('\n').at(-1).trim();
        assert(!/^(?:#{1,6}\s+.+|\*\*[^*]+\*\*|[-*_]{3,})$/.test(lastLine), `${note.id}, part ${part}: heading or divider stranded at foot of leaf`);
      }
    }
    const section = notebookSections.find(section => section.id === note.id);
    assert(section, `${note.id}: missing contents entry`);
    assert.equal(section.title, note.title);
    assert.equal(section.firstPage, notebookPages.indexOf(pages[0]));
    assert.equal(section.pageCount, pages.length);
    assert.equal(section.folder, note.folder ?? note.category);

    // A source-preserving split can still break rendering by separating a
    // fence, equation, table, or link across two leaves. Check whole blocks.
    const blocks = [
      ...note.content.matchAll(/```[^\n]*\n[\s\S]*?```/g),
      ...note.content.matchAll(/\$\$[\s\S]*?\$\$/g),
      ...note.content.matchAll(/^\|[^\n]*\|\n\|[\s:|-]+\|\n(?:\|[^\n]*\|(?:\n|$))*/gm),
      ...note.content.matchAll(/!?\[[^\]]*\]\([^\n)]+\)/g),
    ];
    for (const [block] of blocks) {
      assert(pages.some(page => page.content.includes(block)), `${note.id}: rich block split across pages: ${block.slice(0, 90)}`);
      richBlocks++;
    }
    for (const match of note.content.matchAll(/```iframe\s*\n([^\n]+)\n```|!\[[^\]]*\]\((\/[^)]+)\)/g)) {
      media.add((match[1] || match[2]).trim());
    }
  }
  for (const path of media) await access(resolve('public', path.slice(1)));
  assert.equal([...media].filter(path => path.startsWith('/dynamical_systems/')).length, 3, 'All three live dynamical systems must remain');
  console.log(`PASS: ${portfolioNotes.length} complete notes, ${portfolioNotes.reduce((sum, note) => sum + note.content.length, 0).toLocaleString()} exact source characters, ${notebookPages.length} pages, ${richBlocks} intact rich blocks, ${media.size} local media assets.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await checkContent();
