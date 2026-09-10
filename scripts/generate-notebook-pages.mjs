import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const output = fileURLToPath(new URL('../components/notebookPageCuts.json', import.meta.url));

/** Compute cuts only in Node; the browser reconstructs source slices from these offsets. */
export async function generateNotebookPages({ check = false } = {}) {
  const server = await createServer({
    configFile: false,
    cacheDir: 'node_modules/.vite-notebook-pagination',
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
  });
  try {
    const { portfolioNotes } = await server.ssrLoadModule('/constants.tsx');
    const { paginateNote, legacyPaginateNote } = await server.ssrLoadModule('/scripts/notebookPagination.ts');
    const offsets = (note, paginate) => {
      let offset = 0;
      const pages = paginate(note);
      assert.equal(pages.map(page => page.content).join(''), note.content, `${note.id}: source changed during pagination`);
      return pages.map(page => (offset += page.content.length));
    };
    const result = {
      sourceHash: createHash('sha256').update(JSON.stringify(portfolioNotes)).digest('hex'),
      notes: portfolioNotes.map(note => ({ id: note.id, pages: offsets(note, paginateNote), legacy: offsets(note, legacyPaginateNote) })),
    };
    const next = `${JSON.stringify(result, null, 2)}\n`;
    const current = await readFile(output, 'utf8').catch(error => {
      if (error.code === 'ENOENT') return '';
      throw error;
    });
    if (check) {
      assert.equal(current, next, 'Generated notebook cuts are stale; run npm run generate:pages');
      // Preserve the pre-optimization page boundaries even after a build has
      // regenerated the artifact. New authored content is free to repaginate.
      const baseline = JSON.parse(await readFile(new URL('./notebook-pagination-baseline.json', import.meta.url), 'utf8'));
      if (result.sourceHash === baseline.sourceHash) {
        const cutsHash = createHash('sha256').update(JSON.stringify(result.notes)).digest('hex');
        assert.equal(cutsHash, baseline.cutsHash, 'Unchanged source must retain all original reading and legacy bookmark boundaries');
      }
    }
    else if (current !== next) await writeFile(output, next);
    return result;
  } finally {
    await server.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await generateNotebookPages({ check: process.argv.includes('--check') });
  console.log(`Notebook pagination: ${result.notes.reduce((sum, note) => sum + note.pages.length, 0)} reading pages, ${result.notes.reduce((sum, note) => sum + note.legacy.length, 0)} legacy bookmark pages.`);
}
