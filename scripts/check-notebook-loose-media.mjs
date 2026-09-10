// A detached mobile figure must retain its bound page's size, including scrolling.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages } = await loadNotebookData();
const imagePage = notebookPages.find(page => page.content.includes('sahad_tulip'));
assert(imagePage, 'The authored tulip image remains present');
const offset = imagePage.note.content.indexOf(imagePage.content);
assert(offset >= 0, 'Figure page retains its source offset');
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
function measurements(writing) {
  return {
    height: writing.clientHeight,
    cap: getComputedStyle(writing).getPropertyValue('--notebook-figure-height'),
    imageHeight: writing.querySelector('img').clientHeight,
    scrollTop: writing.scrollTop,
  };
}
try {
  const page = await browser.newPage({ viewport: { width: 568, height: 320 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/${imagePage.note.folder}/${imagePage.note.slug}?at=${offset}`);
  const bound = page.locator('.notebook-leaf:not([inert]) .notebook-writing');
  await bound.locator('img').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const writing = document.querySelector('.notebook-leaf:not([inert]) .notebook-writing');
    return writing && writing.style.getPropertyValue('--notebook-figure-height') && writing.querySelector('img')?.complete;
  });
  const before = await bound.evaluate(measurements);
  assert(before.imageHeight <= Number.parseFloat(before.cap) + 1, 'Bound figure respects its mobile height cap');
  const grip = await page.locator('.notebook-leaf:not([inert]) .notebook-mobile-grip[data-side="right"]').boundingBox();
  const start = { x: grip.x + grip.width / 2, y: grip.y + 30 };
  const client = await page.context().newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }] });
  for (const point of [{ x: start.x + 12, y: start.y }, { x: start.x + 12, y: start.y + 210 }]) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...point, id: 1 }] });
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(250);
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const loose = page.locator('.notebook-loose.is-released .notebook-writing');
  await loose.waitFor();
  await page.waitForTimeout(100);
  function check(actual, phase) {
    assert.equal(actual.height, before.height, `${phase}: writing geometry preserved`);
    assert.equal(actual.cap, before.cap, `${phase}: figure height cap preserved`);
    assert(Math.abs(actual.imageHeight - before.imageHeight) <= 1, `${phase}: image does not grow after detach`);
  }
  check(await loose.evaluate(measurements), 'Detached');
  await loose.evaluate(writing => { writing.scrollTop = writing.scrollHeight; });
  await page.waitForTimeout(100);
  const scrolled = await loose.evaluate(measurements);
  assert(scrolled.scrollTop > 0, 'Detached writing still scrolls');
  check(scrolled, 'Scrolled');
  assert.deepEqual(errors, []);
  console.log('PASS: detached mobile image retains bound writing geometry and figure cap before and after scrolling.');
} finally { await browser.close(); }
