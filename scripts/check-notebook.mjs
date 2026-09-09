// Run against a local Vite server. Supply PLAYWRIGHT_MODULE if Playwright is
// installed outside this project; no browser tooling ships with the site.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch();
const url = `${process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000'}/notebook`;
const delay = (page, ms = 1100) => page.waitForTimeout(ms);
const status = page => page.locator('.notebook-accessible-status').innerText();
const errors = [];
async function open(width = 1440, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport: { width, height: 1050 }, reducedMotion });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url); await delay(page, 400); await page.evaluate(() => document.fonts.ready);
  return page;
}
try {
  const page = await open();
  const rect = await page.locator('.notebook-mount').boundingBox();
  const x = rect.x + rect.width - 12, y = rect.y + 360;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x - 12, y, { steps: 5 }); await page.mouse.up(); await delay(page);
  assert.match(await status(page), /^Pages 1–2/, 'Small grab must return');
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x - 140, y - 30, { steps: 15 }); await delay(page, 60);
  assert.equal(await page.locator('.notebook-leaf.--hard').count(), 0, 'Odd final leaf must stay soft');
  assert(await page.locator('.notebook-leaf').evaluateAll(leaves => leaves.some(e => e.style.clipPath.includes('polygon'))), 'Drag must render a flexible fold');
  await page.mouse.move(rect.x + 60, y, { steps: 30 }); await page.mouse.up();
  await page.waitForFunction(() => document.querySelector('.notebook-accessible-status').textContent.startsWith('Pages 3'));
  await page.waitForFunction(() => document.getAnimations().some(a => a.effect?.target?.classList.contains('notebook-sheet')), { timeout: 2000 });
  await delay(page);
  assert.equal(await status(page), 'Pages 3 of 3.');
  assert.equal(await page.locator('.notebook-spread').evaluate(e => e.style.getPropertyValue('--stack-left')), '7px');
  await page.reload(); await delay(page, 500); assert.equal(await status(page), 'Pages 3 of 3.', 'Remember place after refresh');
  await page.getByRole('button', {name:'Go to start'}).click(); await delay(page);
  assert.match(await status(page), /^Pages 1–2/);
  const work = page.getByRole('button', {name:'Go to work'});
  await work.focus(); await delay(page, 200);
  assert.equal(await work.locator('.notebook-bookmark-label').evaluate(e => getComputedStyle(e).opacity), '1');
  await page.keyboard.press('Escape'); await delay(page, 200);
  assert.equal(await work.locator('.notebook-bookmark-label').evaluate(e => getComputedStyle(e).opacity), '0');
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 150, y, {steps:20}); await delay(page, 250);
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
    await p.getByRole('button', {name:'Go to off duty'}).click(); await delay(p,100);
    assert.equal(await status(p), 'Pages 3 of 3.');
    assert.equal(await p.evaluate(() => document.getAnimations().length), 0, 'Reduced motion has no decorative animations');
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await p.getByRole('button', {name:'Go to work'}).click(); await delay(p,100);
    assert.match(await status(p), width < 700 ? /^Pages 2 of/ : /^Pages 1–2/);
    await p.close();
  }
  const p = await browser.newPage(); p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(() => { Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}}); });
  await p.goto(url); await delay(p,500); assert.match(await status(p), /^Pages 1/); await p.close();
  assert.deepEqual(errors, []);
  console.log('PASS: soft folds, small-grab cancellation, settling, stacks, saved place, bookmarks, detach/reattach, mobile, reduced motion and unavailable storage.');
} finally { await browser.close(); }
