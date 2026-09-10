// Actual SVG geometry catches subgraph-title collisions that CSS font checks miss.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, encodeNotebookPlace } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const figures = notebookPages.flatMap((entry, index) =>
  [...entry.content.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)].map((match, part) => ({ entry, index, part, source: match[1].trim() })));
const browser = await chromium.launch();
let checked = 0;
function inspectSvg(svg) {
  const rect = svg.getBoundingClientRect();
  const matrix = svg.getScreenCTM();
  const scale = Math.hypot(matrix.a, matrix.b);
  const labels = [...svg.querySelectorAll('.nodeLabel, .edgeLabel .label, .cluster-label, text')]
    .filter(element => element.textContent.trim() && !element.querySelector('.nodeLabel, .cluster-label, text'))
    .map(element => ({ text: element.textContent.trim(), box: element.getBoundingClientRect(), size: parseFloat(getComputedStyle(element).fontSize) * scale }));
  const overlaps = [];
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    const a = labels[i].box, b = labels[j].box;
    if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > .75 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > .75) overlaps.push([labels[i].text, labels[j].text]);
  }
  return {
    overlaps,
    clipped: labels.filter(({ box }) => box.left < rect.left - 1 || box.top < rect.top - 1 || box.right > rect.right + 1 || box.bottom > rect.bottom + 1).map(label => label.text),
    minimumSize: Math.min(...labels.map(label => label.size)),
    nodes: svg.querySelectorAll('.node, .rough-node').length,
    viewBox: svg.getAttribute('viewBox'),
    noteFills: [...svg.querySelectorAll('rect.note')].map(note => getComputedStyle(note).fill),
  };
}
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 1050 });
    for (const { entry, index, part, source } of figures) {
      const { offset } = JSON.parse(encodeNotebookPlace(index));
      await page.goto(`${origin}/${entry.note.folder}/${entry.note.slug}?at=${offset}`);
      const container = page.locator(`[data-page-index="${index}"] .notebook-diagram`).nth(part);
      const svg = container.locator('svg[id^="mermaid-"]');
      await svg.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await container.scrollIntoViewIfNeeded();
      const inline = await svg.evaluate(inspectSvg);
      assert.deepEqual(inline.overlaps, [], `Page ${index + 1}, ${width}px: labels must not overlap`);
      assert.deepEqual(inline.clipped, [], `Page ${index + 1}: complete inline labels fit the SVG`);
      if (await container.evaluate(element => element.classList.contains('is-wide'))) {
        const coveredInk = await container.evaluate(element => {
          const control = element.querySelector('button[title="Expand diagram"]').getBoundingClientRect();
          return [...element.querySelectorAll('svg[id^="mermaid-"] .rough-node, svg[id^="mermaid-"] .node, .nodeLabel, .cluster-label, .edgeLabel, svg[id^="mermaid-"] text')].some(label => {
            const ink = label.getBoundingClientRect();
            return Math.min(control.right, ink.right) - Math.max(control.left, ink.left) > .5 && Math.min(control.bottom, ink.bottom) - Math.max(control.top, ink.top) > .5;
          });
        });
        assert.equal(coveredInk, false, 'Expand control must not cover wide-diagram nodes or labels');
      }
      if (source.startsWith('flowchart')) assert(inline.nodes > 0, 'Hand-drawn nodes must actually be counted');
      assert(inline.noteFills.every(fill => fill === 'rgb(241, 238, 227)'), 'Sequence notes mask crossing lifelines with paper');
      const frame = await container.evaluate(element => ({
        width: element.clientWidth,
        height: element.clientHeight,
        ratio: getComputedStyle(element).aspectRatio.split('/').map(Number),
        cap: Math.min(450, parseFloat(getComputedStyle(element).getPropertyValue('--notebook-figure-height')) || 450),
      }));
      assert(Math.abs(frame.height - Math.min(frame.cap, frame.width * frame.ratio[1] / frame.ratio[0])) <= 1, `Page ${index+1}: inline figure keeps historical allocation ${JSON.stringify(frame)}`);
      await container.getByRole('button', { name: 'Expand diagram', exact: true }).first().click();
      const modal = page.getByRole('dialog');
      const expanded = modal.locator('svg[id^="mermaid-"]');
      const fitted = await expanded.evaluate(inspectSvg);
      assert.equal(fitted.viewBox, inline.viewBox);
      assert.equal(fitted.nodes, inline.nodes);
      assert.deepEqual(fitted.overlaps, [], 'Expanded group and node labels remain separate');
      assert.deepEqual(fitted.clipped, [], 'Fit mode shows complete diagram');
      if (source.includes('Bayesian Update')) {
        const struckThrough = await expanded.evaluate(svg => {
          const labels = [...svg.querySelectorAll('.edgeLabel p')].map(label => {
            const range = document.createRange(); range.selectNodeContents(label);
            return range.getBoundingClientRect();
          });
          return [...svg.querySelectorAll('.flowchart-link')].some(path => {
            const length = path.getTotalLength();
            for (let step = 0; step <= 100; step++) {
              const point = path.getPointAtLength(length * step / 100);
              const screen = new DOMPoint(point.x, point.y).matrixTransform(path.getScreenCTM());
              if (labels.some(box => screen.x > box.left && screen.x < box.right && screen.y > box.top && screen.y < box.bottom)) return true;
            }
            return false;
          });
        });
        assert.equal(struckThrough, false, 'Bayesian update connectors stay clear of their text');
      }
      assert(await modal.locator('.note-media-toolbar button').evaluateAll(buttons => buttons.every(button => {
        const rect = button.getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth && rect.width >= 44 && rect.height >= 44;
      })), 'Every toolbar control fits the narrow phone and keeps its touch target');
      await modal.getByRole('button', { name: 'Read diagram labels' }).click();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const reading = await expanded.evaluate(inspectSvg);
      assert(reading.minimumSize >= 23.9, `Page ${index + 1}: Read gives every label a 24px rendered size (${reading.minimumSize})`);
      const drawing = modal.locator('.note-media-content');
      const before = await drawing.evaluate(element => getComputedStyle(element).transform);
      const stage = await modal.locator('.note-media-stage').boundingBox();
      await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2);
      await page.mouse.down(); await page.mouse.move(stage.x + stage.width / 2 - 45, stage.y + stage.height / 2 - 40); await page.mouse.up();
      assert.notEqual(await drawing.evaluate(element => getComputedStyle(element).transform), before, 'Readable drawing remains pannable');
      await modal.getByRole('button', { name: 'Reset', exact: true }).click();
      const reset = await expanded.evaluate(inspectSvg);
      assert(Math.abs(reset.minimumSize - fitted.minimumSize) < .1, 'Fit restores original complete-view scale');
      await modal.getByRole('button', { name: 'Close diagram' }).click();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Diagram never widens the document');
      checked++;
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checked} diagram views (${figures.length} authored diagrams × desktop/320px phone), no label overlap/clipping, original inline allocations, 24px Read mode, pan/Fit, and accessible toolbar bounds.`);
} finally { await browser.close(); }
