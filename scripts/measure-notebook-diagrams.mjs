// Requires a running Vite DEV server: measures the same exported Mermaid
// renderer and committed font used by notebook pages, not heuristic geometry.
// Run after changing a Mermaid source, its theme, font, or renderer options.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { loadNotebookData } from './check-notebook-content.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { portfolioNotes } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const charts = [...new Set(portfolioNotes.flatMap(note => [...note.content.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)].map(match => match[1].trim())))];
function hash(source) {
  let value = 2166136261;
  for (const character of source.trim()) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return (value >>> 0).toString(16);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  await page.goto(`${origin}/notebook`);
  await page.waitForSelector('.notebook-spread');
  const geometry = {};
  for (const chart of charts) {
    const dimensions = await page.evaluate(async chart => {
      const { renderMermaid } = await import('/components/MainContent.tsx');
      const svg = await renderMermaid(chart);
      const element = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement;
      const [, , width, height] = element.getAttribute('viewBox').trim().split(/[\s,]+/).map(Number);
      return { width, height };
    }, chart);
    assert(dimensions.width > 0 && dimensions.height > 0, 'Rendered figure must have measurable geometry');
    const key = hash(chart);
    assert(!geometry[key], `Source hash collision: ${key}`);
    geometry[key] = dimensions;
  }
  const target = new URL('../components/notebookDiagramGeometry.json', import.meta.url);
  await writeFile(target, `${JSON.stringify(geometry, null, 2)}\n`);
  console.log(`Measured ${charts.length} notebook diagrams → ${target.pathname}`);
} finally { await browser.close(); }
