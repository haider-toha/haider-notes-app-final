// Verify actual browser font use for every source equation, not just its CSS
// declaration. Chromium's platform-font report catches silent fallback glyphs.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import katex from 'katex';
import { collectMathGlyphs } from './collect-notebook-math-glyphs.mjs';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { formulas, ...inventory } = await collectMathGlyphs();
const committed = JSON.parse(await readFile(new URL('./notebook-math-glyphs.json', import.meta.url), 'utf8'));
assert.deepEqual(inventory, committed, 'Rebuild the handwriting font inventory when equation glyphs change');
const { notebookPages, encodeNotebookPlace } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/notebook`);
  await page.waitForSelector('.notebook-spread');
  const html = formulas.map(formula => `<div>${katex.renderToString(formula.latex, { displayMode: formula.display, throwOnError: true, strict: false, output: 'html' })}</div>`).join('');
  await page.evaluate(html => {
    const host = document.createElement('div');
    host.className = 'notebook-content math-font-audit';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:absolute;top:0;left:-20000px;width:468px;font-size:24px;color:#303f53;pointer-events:none;';
    host.innerHTML = html;
    document.body.appendChild(host);
  }, html);
  await page.evaluate(() => document.fonts.load('24px "Notebook Math"'));
  const htmlNodes = page.locator('.math-font-audit .katex-html');
  assert.equal(await htmlNodes.count(), formulas.length, 'Every inventoried equation is rendered');
  const families = await htmlNodes.locator('span').evaluateAll(elements => [...new Set(elements.map(element => getComputedStyle(element).fontFamily.split(',')[0].replaceAll('"', '').trim()))]);
  assert.deepEqual(families, ['Notebook Math'], 'All visible KaTeX glyph span styles select the handwritten face');
  const inks = await htmlNodes.locator('span').evaluateAll(elements => [...new Set(elements.filter(element => [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())).map(element => `${getComputedStyle(element).color}/${getComputedStyle(element).opacity}`))]);
  assert.deepEqual(inks, ['rgb(48, 63, 83)/1'], 'Greek, Latin, punctuation and operators share the same solid notebook ink');
  for (const [selector, feature] of [['.mathbb', 'ss01'], ['.mathcal', 'ss02']]) {
    const settings = await page.locator(`.math-font-audit ${selector}`).evaluateAll(elements => elements.map(element => getComputedStyle(element).fontFeatureSettings));
    assert(settings.length && settings.every(value => value.includes(`"${feature}"`)), `${selector}: preserve the distinct mathematical alphabet`);
  }
  const client = await page.context().newCDPSession(page);
  await client.send('DOM.enable'); await client.send('CSS.enable');
  const { root } = await client.send('DOM.getDocument');
  const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.math-font-audit' });
  const { nodeIds } = await client.send('DOM.querySelectorAll', { nodeId, selector: '.katex-html span' });
  const fonts = [];
  // The protocol reports direct text children only; querying the host alone
  // returns an empty list and would falsely pass an every()-only assertion.
  for (const nodeId of nodeIds) fonts.push(...(await client.send('CSS.getPlatformFontsForNode', { nodeId })).fonts);
  const glyphs = fonts.reduce((sum, font) => sum + font.glyphCount, 0);
  assert(glyphs > 0, 'Platform font audit must observe actual rendered glyphs');
  assert.deepEqual([...new Set(fonts.map(font => font.familyName))], ['Notebook Math'], 'No typeset or system-font fallback in any equation');
  await client.detach();

  // Font-family checks cannot detect a tiny bracket. Measure actual painted
  // ink, not inline span boxes (which ignore the overflowing matrix rows).
  const matrixFormula = formulas.find(formula => /\\begin\{[bp]matrix\}/.test(formula.latex));
  assert(matrixFormula, 'Source inventory includes a matrix delimiter regression fixture');
  await page.locator('.math-font-audit').evaluate((host, html) => {
    host.style.cssText = 'position:fixed;left:30px;top:100px;width:1300px;font-size:24px;color:#303f53;background:#f1eee3;z-index:2147483647;padding:100px 0;';
    host.innerHTML = html;
  }, katex.renderToString(matrixFormula.latex, { displayMode: true, throwOnError: true }));
  const geometry = await page.locator('.math-font-audit').evaluate(host => {
    const table = host.querySelector('.mtable');
    let group = table.parentElement;
    while (group && !group.querySelector('.delimsizing')) group = group.parentElement;
    const delimiter = group.querySelector('.delimsizing').getBoundingClientRect();
    const columns = [...table.querySelectorAll('.vlist-t')].map(element => element.getBoundingClientRect());
    const top = Math.min(...columns.map(rect => rect.top));
    const bottom = Math.max(...columns.map(rect => rect.bottom));
    return { x: Math.floor(delimiter.left), y: Math.floor(top - 20), width: Math.ceil(delimiter.width), height: Math.ceil(bottom - top + 40), matrixHeight: bottom - top };
  });
  assert(geometry.matrixHeight > 24, 'Fixture must contain multiple matrix rows');
  const png = await page.screenshot({ clip: { x: geometry.x, y: geometry.y, width: geometry.width, height: geometry.height } });
  const inkHeight = await page.evaluate(async source => {
    const image = new Image(); image.src = source; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height).data;
    let first = image.height, last = -1;
    for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
      const index = (y * image.width + x) * 4;
      if (pixels[index] < 120 && pixels[index + 1] < 130 && pixels[index + 2] < 145) { first = Math.min(first, y); last = Math.max(last, y); }
    }
    return Math.max(0, last - first + 1);
  }, `data:image/png;base64,${png.toString('base64')}`);
  assert(inkHeight >= geometry.matrixHeight * .85, `Handwritten matrix bracket ink spans its rows (${inkHeight}px ink / ${geometry.matrixHeight.toFixed(1)}px matrix)`);
  await page.locator('.math-font-audit').evaluate(host => host.remove());

  // Exercise real complex equations at both paper widths; oversized display
  // equations must remain horizontally scrollable without widening the site.
  const samples = [
    notebookPages.findIndex(entry => entry.content.includes('\\mathbb{E}')),
    notebookPages.findIndex(entry => /\\begin\{[bp]matrix\}/.test(entry.content)),
    notebookPages.findIndex(entry => entry.content.includes('\\frac{d\\mathbf{p}}')),
  ].filter(index => index >= 0);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    await page.waitForFunction(portrait => document.querySelector('.notebook-spread').classList.contains('is-portrait') === portrait, width < 700);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    for (const index of samples) {
      const place = JSON.parse(encodeNotebookPlace(index));
      const note = notebookPages[index].note;
      await page.goto(`${origin}/${note.folder}/${note.slug}?at=${place.offset}`);
      const leaf = page.locator(`.notebook-leaf:has([data-page-index="${index}"])`);
      await leaf.locator('.katex').first().waitFor();
      await page.evaluate(() => document.fonts.load('24px "Notebook Math"'));
      assert.equal(await leaf.locator('.katex-error').count(), 0);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: equations stay within notebook viewport`);
      const spans = await leaf.locator('.katex-html span').evaluateAll(elements => elements.filter(element => element.textContent.trim()).map(element => getComputedStyle(element).fontFamily));
      assert(spans.length && spans.every(family => family.startsWith('"Notebook Math"')), 'Real notebook equations use handwritten glyphs');
      for (const display of await leaf.locator('.katex-display').all()) {
        assert(await display.evaluate(element => {
          const wrapper = element.parentElement;
          return wrapper.scrollWidth <= wrapper.clientWidth + 1 || ['auto', 'scroll'].includes(getComputedStyle(wrapper).overflowX);
        }), 'Wide display equation remains reachable by scrolling');
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: all ${formulas.length} source equations, ${inventory.characters.length} inventoried characters, ${glyphs} actual handwritten glyph instances with zero fallback; mathematical alphabets and desktop/mobile pages.`);
} finally { await browser.close(); }
