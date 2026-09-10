// Check real authored tables at both notebook widths, including native panning.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, encodeNotebookPlace } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const samples = notebookPages.flatMap((entry, index) => {
  const tables = [...entry.content.matchAll(/^\|[^\n]+\|\n\|[\s\-:|]+\|\n(?:\|[^\n]*\|(?:\n|$))*/gm)].map(match =>
    match[0].trim().split('\n').filter((_, row) => row !== 1).map(line => line.trim().slice(1, -1).split('|').map(cell => cell.trim().replace(/\*\*(.*?)\*\*/g, '$1'))));
  return tables.length ? [{ entry, index, tables }] : [];
});
let checked = 0;
let widestRow = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1050 });
    for (const { entry, index, tables } of samples) {
      const place = JSON.parse(encodeNotebookPlace(index));
      await page.goto(`${origin}/${entry.note.folder}/${entry.note.slug}?at=${place.offset}`);
      const leaf = page.locator(`[data-page-index="${index}"]`);
      await leaf.locator('table').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      const actual = await leaf.locator('table').evaluateAll(nodes => nodes.map(table => ({
        rows: [...table.rows].map(row => [...row.cells].map(cell => cell.textContent.trim())),
        headerCount: table.querySelectorAll('thead th').length,
        bodyHeaderCount: table.querySelectorAll('tbody th').length,
        cells: [...table.querySelectorAll('th, td')].map(cell => ({ font: getComputedStyle(cell).fontFamily, size: getComputedStyle(cell).fontSize })),
        heights: [...table.rows].map(row => row.getBoundingClientRect().height),
        overflow: getComputedStyle(table.parentElement).overflowX,
        touch: getComputedStyle(table.parentElement).touchAction,
      })));
      assert.equal(actual.length, tables.length, `Page ${index + 1}: table count`);
      actual.forEach((table, tableIndex) => {
        assert.deepEqual(table.rows, tables[tableIndex], `Page ${index + 1}: every authored cell stays in order`);
        assert.equal(table.headerCount, tables[tableIndex][0].length);
        assert.equal(table.bodyHeaderCount, 0);
        assert(table.cells.every(cell => /Reenie Beanie/.test(cell.font) && cell.size === (width === 390 ? '23px' : '24px')));
        assert(table.heights.every(height => height >= 29), 'Rows retain readable line height');
        widestRow = Math.max(widestRow, ...table.heights);
        assert.equal(table.overflow, 'auto');
        assert.equal(table.touch, 'auto');
        checked++;
      });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Tables never widen the viewport');
    }
  }

  const sample = samples.find(({ tables }) => tables.some(table => table[0].length >= 3));
  const place = JSON.parse(encodeNotebookPlace(sample.index));
  await page.goto(`${origin}/${sample.entry.note.folder}/${sample.entry.note.slug}?at=${place.offset}`);
  const scroller = page.locator(`[data-page-index="${sample.index}"] .notebook-table-scroll`).first();
  await scroller.scrollIntoViewIfNeeded();
  await scroller.hover();
  await page.mouse.wheel(160, 0);
  await page.waitForFunction(index => document.querySelector(`[data-page-index="${index}"] .notebook-table-scroll`).scrollLeft > 0, sample.index);
  await scroller.evaluate(element => { element.scrollLeft = 0; });
  const route = page.url();
  await scroller.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(index => document.querySelector(`[data-page-index="${index}"] .notebook-table-scroll`).scrollLeft > 0, sample.index);
  assert.equal(page.url(), route, 'Keyboard table panning must not turn the notebook page');
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checked} authored table renders at desktop/mobile widths, every cell and header preserved, handwritten fonts, readable rows (largest ${widestRow.toFixed(1)}px), native wheel/keyboard panning, and no viewport overflow.`);
} finally { await browser.close(); }
