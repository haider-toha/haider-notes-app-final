// Rebuild the exact glyph inventory from every equation in the source notes.
import { writeFile } from 'node:fs/promises';
import katex from 'katex';
import { loadNotebookData } from './check-notebook-content.mjs';

export async function collectMathGlyphs() {
  const { portfolioNotes } = await loadNotebookData();
  const characters = new Set();
  const formulas = [];
  for (const note of portfolioNotes) {
    for (const match of note.content.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g)) {
      const latex = match[1] ?? match[2];
      if (!latex || (match[1] === undefined && /^\s|\s$/.test(latex))) continue;
      const html = katex.renderToString(latex, { displayMode: match[1] !== undefined, throwOnError: true, strict: false, output: 'html' });
      // Structural SVG radicals/stretchy accents are paths, not font glyphs.
      const text = html.replace(/<svg\b[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '')
        .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
        .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&nbsp;/g, '\u00a0');
      for (const character of text) characters.add(character);
      formulas.push({ noteId: note.id, latex, display: match[1] !== undefined });
    }
  }
  const equationCharacterCount = characters.size;
  // Additional symbols drawn by the three dynamical-system canvas figures.
  const simulationCharacters = 'βφ⊥';
  for (const character of simulationCharacters) characters.add(character);
  return { formulaCount: formulas.length, equationCharacterCount, simulationCharacters, characters: [...characters].sort().join(''), formulas };
}

if (process.argv[1]?.endsWith('collect-notebook-math-glyphs.mjs')) {
  const { formulas, ...inventory } = await collectMathGlyphs();
  await writeFile(new URL('./notebook-math-glyphs.json', import.meta.url), JSON.stringify(inventory, null, 2) + '\n');
  console.log(`${inventory.formulaCount} source equations, ${inventory.characters.length} distinct emitted glyphs.`);
}
