// Run against a local Vite server. Supply PLAYWRIGHT_MODULE if Playwright is
// installed outside this project; no browser tooling ships with the site.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, notebookSections } = await loadNotebookData();
const total = notebookPages.length;
const browser = await chromium.launch();
const url = `${process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000'}/notebook`;
const delay = (page, ms = 1100) => page.waitForTimeout(ms);
const status = page => page.locator('.lined-notebook > .notebook-accessible-status').innerText();
const expected = (index, width = 1440) => `Pages ${index + 1}${width >= 700 && index + 1 < total ? `–${index + 2}` : ''} of ${total}.`;
const errors = [];
async function checkNavigationPlacement(page) {
  assert.equal(await page.locator('.notebook-spread > .notebook-contents-link').count(), 0, 'Navigation must belong to page faces, not float over the spread');
  const controls = page.locator('.notebook-leaf:not([inert]) > .notebook-sheet > .notebook-contents-link');
  assert.equal(await controls.count(), 1, 'Each desktop spread or mobile page has one contents control');
  assert(await controls.evaluateAll(buttons => buttons.every(button => {
    const control = button.getBoundingClientRect();
    const sheet = button.closest('.notebook-sheet');
    const paper = sheet.getBoundingClientRect();
    const body = sheet.querySelector('.notebook-writing').getBoundingClientRect();
    const overlapsTitle = [...sheet.querySelectorAll('.notebook-running-head span')].some(title => {
      const rect = title.getBoundingClientRect();
      return rect.left < control.right && rect.right > control.left && rect.top < control.bottom && rect.bottom > control.top;
    });
    return control.x >= paper.x && control.y >= paper.y && control.right <= paper.right && control.bottom <= body.top + 1 && !overlapsTitle;
  })), 'Each page control stays inside its own paper header without overlapping text');
}
async function open(width = 1440, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport: { width, height: 1050 }, reducedMotion });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url); await page.getByRole('button', { name: 'Open notebook', exact: true }).click(); await delay(page, 500); await page.evaluate(() => document.fonts.ready);
  assert.equal(await status(page), expected(0, width), 'The site opens on about me');
  await page.getByRole('button', { name: 'Open contents', exact: true }).first().click(); await delay(page);
  assert.equal(await status(page), 'Contents.');
  await checkNavigationPlacement(page);
  await page.getByRole('button', { name: 'Back to reading', exact: true }).first().click(); await delay(page);
  return page;
}
async function visit(page, section) {
  await page.getByRole('button', { name: 'Open contents', exact: true }).first().click();
  await delay(page);
  const entry = page.getByRole('button', { name: `Go to ${section.title}, page ${section.firstPage + 1}`, exact: true });
  if (!await entry.isVisible()) {
    await page.locator('.notebook-spread').focus(); await page.keyboard.press('ArrowRight'); await delay(page);
  }
  await entry.click();
  await delay(page);
}
try {
  const page = await open();
  const rect = await page.locator('.notebook-mount').boundingBox();
  const x = rect.x + rect.width - 12, y = rect.y + 360;
  const initialStack = await page.locator('.notebook-spread').evaluate(e => parseFloat(e.style.getPropertyValue('--stack-left')));
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x - 12, y, { steps: 5 }); await page.mouse.up(); await delay(page);
  assert.equal(await status(page), expected(0), 'Small grab must return');
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x - 140, y - 30, { steps: 15 }); await delay(page, 60);
  assert.equal(await page.locator('.notebook-leaf.--hard').count(), 0, 'Reading leaves remain soft');
  assert(await page.locator('.notebook-leaf').evaluateAll(leaves => leaves.some(e => e.style.clipPath.includes('polygon'))), 'Drag must render a flexible fold');
  assert(await page.locator('.notebook-leaf').evaluateAll(leaves => leaves.filter(leaf => leaf.style.clipPath.includes('polygon')).every(leaf => {
    const control = leaf.querySelector('.notebook-sheet > .notebook-contents-link');
    if (leaf.querySelector('.notebook-sheet')?.dataset.pageSide === 'right') return control === null;
    return control && getComputedStyle(control).visibility === 'visible' && getComputedStyle(control).opacity === '1';
  })), 'Only left desktop faces carry contents controls through a fold');
  await page.mouse.move(rect.x + 60, y, { steps: 30 }); await page.mouse.up();
  await page.waitForFunction(() => document.querySelector('.lined-notebook > .notebook-accessible-status').textContent.startsWith('Pages 3'));
  await delay(page);
  assert.equal(await status(page), expected(2));
  await checkNavigationPlacement(page);
  assert(await page.locator('.notebook-spread').evaluate(e => parseFloat(e.style.getPropertyValue('--stack-left'))) > initialStack, 'Turned pages thicken left stack');
  await page.reload(); await delay(page, 500); assert.equal(await status(page), expected(2), 'Remember place after refresh');
  await page.locator('.notebook-leaf:not([inert]) > [data-page-side=left] > .notebook-contents-link').click(); await delay(page);
  assert.equal(new URL(page.url()).pathname, '/contents');
  assert.equal(await status(page), 'Contents.');
  assert.equal(await page.locator('.notebook-leaf:has(.notebook-contents-page)').count(), 2, 'Contents are two real book leaves');
  assert.equal(await page.locator('.notebook-contents-page button').count(), notebookSections.length);
  assert.equal(await page.getByRole('dialog').count(), 0, 'Contents are printed on paper');
  assert.equal(await page.locator('.notebook-reading-ribbon,.notebook-bookmarks').count(), 0, 'Retired bookmark controls removed');
  await page.getByRole('button', {name:'Back to reading', exact:true}).first().click(); await delay(page);
  assert.equal(await status(page), expected(2), 'Contents returns to the previous reading spread');
  await visit(page, notebookSections[0]);
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 150, y, {steps:20}); await delay(page,250);
  assert.equal(await page.locator('.notebook-loose.is-released').count(), 1, 'Outward hold detaches');
  assert.equal(await page.locator('.notebook-loose .notebook-reverse-ink').getAttribute('aria-hidden'), 'true');
  await page.mouse.up(); await delay(page);
  const loose = await page.locator('.notebook-loose').boundingBox();
  await page.mouse.move(loose.x + 60, loose.y + 70); await page.mouse.down();
  await page.mouse.move(rect.x + rect.width / 2 + 60, rect.y + 70, {steps:30}); await page.mouse.up(); await delay(page,1400);
  assert.equal(await page.locator('.notebook-loose').count(), 0, 'Binding drag reattaches');
  assert.equal(await page.locator('textarea,[contenteditable=true]').count(), 0);
  await page.close();
  for (const width of [390, 1440]) {
    const p = await open(width, 'reduce');
    const last = notebookSections.at(-1);
    await visit(p, last);
    await checkNavigationPlacement(p);
    const destination = width < 700 ? last.firstPage : Math.floor(last.firstPage / 2) * 2;
    assert.equal(await status(p), expected(destination, width), 'Every folder and final note reachable');
    assert.equal(await p.evaluate(() => document.getAnimations().length), 0, 'Reduced motion has no decorative animations');
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
    await visit(p, notebookSections[0]); assert.equal(await status(p), expected(0,width));
    await p.goto(new URL('/contents', url).href);
    await p.waitForFunction(() => document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent === 'Contents.');
    await p.locator('.notebook-spread').focus();
    for (let turn = 0; turn < (width < 700 ? 2 : 1); turn++) {
      await p.keyboard.press('ArrowRight'); await p.evaluate(() => new Promise(requestAnimationFrame));
    }
    await p.waitForFunction(expected => document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent === expected, expected(0, width));
    await p.keyboard.press('ArrowLeft');
    await p.waitForFunction(() => document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent === 'Contents.');
    await p.waitForURL(new URL('/contents', url).href);
    await p.close();
  }
  const p = await browser.newPage(); p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(() => { Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}}); });
  await p.goto(url); await p.getByRole('button', { name: 'Open notebook', exact: true }).click(); await delay(p,500);
  assert.equal(await status(p), expected(0));
  await visit(p, notebookSections.at(-1));
  await p.close();
  assert.deepEqual(errors, []);
  console.log(`PASS: ${total} pages, soft folds, small-grab cancellation, stacks, saved place, two physical contents leaves, all note navigation, detach/reattach, mobile, reduced motion and unavailable storage.`);
} finally { await browser.close(); }
