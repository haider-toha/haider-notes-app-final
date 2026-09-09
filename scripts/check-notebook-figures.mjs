// Exercise the migrated rich content in its actual notebook leaves.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, notebookSections } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const errors = [];
let diagrams = 0, simulations = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /Mermaid rendering error|Failed to fetch dynamically imported module/.test(message.text())) errors.push(message.text());
  });
  await page.goto(`${origin}/notebook`);
  async function openLeaf(index) {
    await page.waitForFunction(() => document.querySelector(".lined-notebook > .notebook-accessible-status"));
    const section = notebookSections.find(section => section.id === notebookPages[index].note.id);
    const contents = page.getByRole('button', { name: 'Open contents', exact: true }).first();
    if (await contents.count()) await contents.click();
    await page.getByRole('button', { name: `Go to ${section.title}, page ${section.firstPage + 1}`, exact: true }).click();
    await page.waitForFunction(first => document.querySelector('.lined-notebook > .notebook-accessible-status').textContent.startsWith(`Pages ${first}–`), Math.floor(section.firstPage / 2) * 2 + 1);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    await page.locator('.notebook-spread').focus();
    for (let current = Math.floor(section.firstPage / 2) * 2; current < Math.floor(index / 2) * 2; current += 2) {
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(first => document.querySelector('.lined-notebook > .notebook-accessible-status').textContent.startsWith(`Pages ${first}`), current + 3);
    }
    const leaf = page.locator(`.notebook-leaf:has([data-page-index="${index}"])`);
    await leaf.waitFor({ state: 'visible' });
    const separators = await leaf.locator('.notebook-content').evaluate(element => {
      const hr = element.querySelectorAll('hr').length;
      const lines = [...element.querySelectorAll('div, span, p')].filter(node => node.children.length === 0 && /^(?:[-*_]{3,}|\.{3}|…)$/.test(node.textContent.trim())).length;
      return hr + lines;
    });
    assert.equal(separators, 0, `Page ${index + 1}: notebook omits visible separator rules and literal separator text`);
    return leaf;
  }
  for (const [index, entry] of notebookPages.entries()) {
    const mermaidCount = [...entry.content.matchAll(/```mermaid\n/g)].length;
    const iframeSources = [...entry.content.matchAll(/```iframe\s*\n([^\n]+)\n```/g)].map(match => match[1].trim());
    if (!mermaidCount && !iframeSources.length && !entry.content.includes('![')) continue;
    const leaf = await openLeaf(index);
    if (mermaidCount) {
      await page.waitForFunction(({ index, count }) => document.querySelector(`[data-page-index="${index}"]`)?.querySelectorAll('svg[id^="mermaid-"]').length === count, { index, count: mermaidCount }, { timeout: 20000 });
      assert.equal(await leaf.locator('svg[id^="mermaid-"]').count(), mermaidCount, `${entry.note.id}: every Mermaid figure rendered`);
      const styles = await leaf.locator('svg[id^="mermaid-"]').evaluateAll(elements => elements.map(svg => ({
        font: getComputedStyle(svg).fontFamily,
        size: getComputedStyle(svg).fontSize,
        background: getComputedStyle(svg).backgroundColor,
        labelBackgrounds: [...svg.querySelectorAll('.labelBkg, .edgeLabel, .edgeLabel p')].map(label => getComputedStyle(label).backgroundColor),
        height: svg.getBoundingClientRect().height,
        width: svg.getBoundingClientRect().width,
        availableWidth: svg.closest('.notebook-content').clientWidth,
        availableHeight: Math.max(96, svg.closest('.notebook-writing').clientHeight - 48),
        viewBox: svg.getAttribute('viewBox'),
      })));
      for (const style of styles) {
        assert.match(style.font, /Reenie Beanie/, `${entry.note.id}: figure labels use the notebook handwriting`);
        assert.equal(style.size, '24px', `${entry.note.id}: readable figure label base size`);
        assert.equal(style.background, 'rgba(0, 0, 0, 0)', `${entry.note.id}: notebook paper remains visible through SVG`);
        assert(style.labelBackgrounds.every(color => color === 'rgba(0, 0, 0, 0)'), `${entry.note.id}: edge label backgrounds stay transparent`);
        assert(style.height <= Math.min(450, style.availableHeight) + 1 && style.width <= style.availableWidth + 1, `${entry.note.id}: the complete diagram fits the paper without horizontal panning`);
      }
      diagrams += mermaidCount;
    }
    for (const src of iframeSources) {
      const iframe = leaf.locator(`iframe[src="${src}"]`);
      await iframe.scrollIntoViewIfNeeded();
      const frame = await (await iframe.elementHandle()).contentFrame();
      await frame.waitForSelector('#scene');
      await frame.evaluate(() => document.fonts.ready);
      assert(await frame.evaluate(() => document.fonts.check('16px "Notebook Math"')), `${src}: handwritten simulation labels load`);
      const canvasStyle = await frame.locator('#scene').evaluate(canvas => ({
        background: getComputedStyle(canvas).backgroundColor,
        cornerAlpha: canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3],
      }));
      assert.equal(canvasStyle.background, 'rgba(0, 0, 0, 0)', `${src}: simulation background is transparent`);
      assert.equal(canvasStyle.cornerAlpha, 0, `${src}: canvas leaves paper visible behind simulation`);
      const before = await frame.locator('#scene').evaluate(canvas => canvas.toDataURL());
      await page.waitForTimeout(220);
      const after = await frame.locator('#scene').evaluate(canvas => canvas.toDataURL());
      assert.notEqual(after, before, `${src}: simulation canvas must animate`);
      assert(await iframe.evaluate(element => element.clientWidth > 100 && element.clientHeight > 80), `${src}: visible figure dimensions`);
      simulations++;
    }
    if (entry.content.includes('![')) {
      const image = leaf.locator('img[src="/sahad_tulip.png"]');
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
      assert(await image.evaluate(image => image.naturalWidth > 0));
    }
  }
  // A short writing area must scale the entire tall diagram, not crop its nodes.
  const tallIndex = notebookPages.findIndex(entry => entry.content.includes('```mermaid'));
  await openLeaf(tallIndex);
  const touchClient = await page.context().newCDPSession(page);
  let intactViewBox, intactNodeCount;
  for (const [width, height, mobile] of [[1440,1050,false], [1366,768,false], [1280,720,false], [1024,600,false], [390,844,true], [320,568,true], [430,932,true], [844,390,true], [568,320,true], [932,430,true]]) {
    const fitted = page;
    await touchClient.send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
    await fitted.setViewportSize({ width, height });
    await fitted.waitForTimeout(200);
    assert.equal(await fitted.locator('.lined-notebook').evaluate(element => element.classList.contains('is-mobile')), mobile, 'Responsive phone mode matches touch viewport');
    {
      const svg = fitted.locator('.notebook-leaf:not([inert]) svg[id^="mermaid-"]').first();
      await svg.waitFor({ timeout: 20000 });
      await fitted.evaluate(() => document.fonts.ready);
      await fitted.waitForTimeout(100);
      const size = await svg.evaluate(element => ({
        height: element.getBoundingClientRect().height,
        width: element.getBoundingClientRect().width,
        writingHeight: element.closest('.notebook-writing').clientHeight,
        writingWidth: element.closest('.notebook-writing').clientWidth,
        viewBox: element.getAttribute('viewBox'), nodes: element.querySelectorAll('.node').length,
        aspectRatio: element.getAttribute('preserveAspectRatio') || 'xMidYMid meet',
      }));
      intactViewBox ??= size.viewBox; intactNodeCount ??= size.nodes;
      assert(size.height <= Math.max(96, size.writingHeight - 48) + 1, `${width}×${height}: diagram fits the writing area with its controls`);
      assert(size.width <= size.writingWidth + 1, `${width}×${height}: full diagram fits horizontally`);
      assert.equal(size.viewBox, intactViewBox, 'Responsive fitting preserves the complete diagram viewBox');
      assert.equal(size.nodes, intactNodeCount, 'Responsive fitting preserves every diagram node');
      assert.match(size.aspectRatio, /meet/, 'Diagram fitting preserves all edges instead of slicing');
    }
  }
  await touchClient.send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await touchClient.detach();
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.waitForTimeout(200);
  // Rapid page turns force nearby diagrams to unmount and remount while
  // Mermaid's shared async renderer is busy (also exercised under StrictMode).
  const firstFigure = notebookPages.findIndex(entry => entry.content.includes('```mermaid'));
  await openLeaf(firstFigure);
  await page.locator('.notebook-spread').focus();
  for (let repeat = 0; repeat < 3; repeat++) {
    for (let turn = 0; turn < 4; turn++) await page.keyboard.press('ArrowRight');
    for (let turn = 0; turn < 4; turn++) await page.keyboard.press('ArrowLeft');
  }
  await page.locator(`.notebook-leaf:has([data-page-index="${firstFigure}"])`).locator('svg[id^="mermaid-"]').first().waitFor({ timeout: 20000 });
  assert.equal(await page.locator('.notebook-leaf:not([inert])').getByText('Failed to render diagram', { exact: true }).count(), 0);
  const mathIndex = notebookPages.findIndex(entry => entry.content.includes('$$'));
  const mathLeaf = await openLeaf(mathIndex);
  assert(await mathLeaf.locator('.katex').count() > 0, 'LaTeX renders as math');
  assert.equal(await mathLeaf.locator('.katex-error').count(), 0);
  assert.match(await mathLeaf.locator('.katex .mathnormal').first().evaluate(element => getComputedStyle(element).fontFamily), /Notebook Math/, 'Equation letters use notebook handwriting');
  const tableIndex = notebookPages.findIndex(entry => /^\|.*\|\n\|[\s:|-]+\|/m.test(entry.content));
  assert(await (await openLeaf(tableIndex)).locator('table tbody tr').count() > 0, 'Markdown tables render with data rows');
  const intro = await openLeaf(0);
  assert.equal(await intro.locator('a[href="https://github.com/haider-toha"]').count(), 1, 'Opening social links preserved');
  assert.deepEqual(errors, [], 'No browser errors while rendering the migrated figures');

  // Explicit source-position restore is a different path from navigation:
  // verify it mounts a diagram even when its leaf is the right-hand page.
  const restoreIndex = notebookPages.findIndex((entry, index) => index % 2 === 1 && entry.content.includes('```mermaid'));
  if (restoreIndex >= 0) {
    const { encodeNotebookPlace } = await loadNotebookData();
    const place = JSON.parse(encodeNotebookPlace(restoreIndex));
    const note = notebookPages[restoreIndex].note;
    await page.goto(`${origin}/${note.folder}/${note.slug}?at=${place.offset}`);
    await page.reload();
    await page.locator(`.notebook-leaf:has([data-page-index="${restoreIndex}"])`).locator('svg[id^="mermaid-"]').first().waitFor({ timeout: 20000 });
  }

  // A rejected lazy module import is cached by the browser. Simulate the
  // reported failed figure and verify its recovery control keeps the place.
  const recovery = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  await recovery.route('**/*flowDiagram*', route => route.abort());
  await recovery.goto(`${origin}/${notebookPages[0].note.folder}/${notebookPages[0].note.slug}`);
  await recovery.waitForSelector('.notebook-spread');
  await recovery.locator('.notebook-spread').focus();
  for (let current = 0; current < Math.floor(firstFigure / 2) * 2; current += 2) await recovery.keyboard.press('ArrowRight');
  const recoveryLeaf = recovery.locator(`.notebook-leaf:has([data-page-index="${firstFigure}"])`);
  const reload = recoveryLeaf.getByRole('button', { name: 'Reload to restore diagram', exact: true });
  await reload.waitFor({ timeout: 20000 });
  const savedStatus = await recovery.locator('.lined-notebook > .notebook-accessible-status').innerText();
  await recovery.unroute('**/*flowDiagram*');
  await reload.click();
  await recovery.locator(`.notebook-leaf:has([data-page-index="${firstFigure}"])`).locator('svg[id^="mermaid-"]').first().waitFor({ timeout: 20000 });
  assert.equal(await recovery.locator('.lined-notebook > .notebook-accessible-status').innerText(), savedStatus, 'Restoring a failed diagram preserves the reading place');
  await recovery.close();
  console.log(`PASS: ${diagrams} live Mermaid figures, ${simulations} animated dynamical systems, full diagram fitting with intact viewBox/nodes at 10 desktop/mobile sizes, local image, equations, tables and links through real page turns, rapid remounts, and failed-module recovery.`);
} finally { await browser.close(); }
