// Run with a local Vite server and PLAYWRIGHT_MODULE when installed externally.
// Uses native Chromium touch input, including scroll arbitration and cancelled drags.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, notebookSections } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const screenshots = process.env.NOTEBOOK_SCREENSHOTS;
if (screenshots) await mkdir(screenshots, { recursive: true });
const browser = await chromium.launch();
const failures = [], results = [];
const sizes = process.argv.includes('--animated-only') ? [] : [[390, 844], [320, 568], [430, 932], [844, 390], [568, 320], [932, 430]];
const visible = '.notebook-leaf:not([inert])';
const status = page => page.locator('.lined-notebook > .notebook-accessible-status').innerText();
const expected = index => `Pages ${index + 1} of ${notebookPages.length}.`;
async function settle(page) { await page.waitForTimeout(850); }
async function open(page, path) {
  await page.goto(origin + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('.notebook-spread');
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
}
async function touch(page, client, points, { cancel = false, hold = 0 } = {}) {
  const [start, ...ends] = points;
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }] });
  let previous = start;
  for (const end of ends) {
    for (let step = 1; step <= 16; step++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: previous.x + (end.x - previous.x) * step / 16, y: previous.y + (end.y - previous.y) * step / 16, id: 1 }] });
      await page.waitForTimeout(12);
    }
    previous = end;
  }
  if (hold) await page.waitForTimeout(hold);
  await client.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
  await settle(page);
}
async function scrollBody(page, client, selector = `${visible} .notebook-writing`) {
  const box = await page.locator(selector).boundingBox();
  const top = Math.max(0, box.y), bottom = Math.min(page.viewportSize().height, box.y + box.height);
  assert(bottom - top > 60, 'A usable writing area must be visible');
  await touch(page, client, [{ x: box.x + box.width / 2, y: bottom - 18 }, { x: box.x + box.width / 2, y: top + 18 }]);
}
async function edgeTurn(page, client, side, cancel = false) {
  const box = await page.locator(`${visible} .notebook-mobile-grip[data-side="${side}"]`).boundingBox();
  const y = Math.max(0, box.y) + Math.min(box.height, page.viewportSize().height - box.y) / 2;
  const mount = await page.locator('.notebook-mount').boundingBox();
  await touch(page, client, [{ x: box.x + box.width / 2, y }, { x: mount.x + mount.width * (side === 'right' ? .2 : .8), y: y - 8 }], { cancel });
}
async function geometry(page) {
  const result = await page.evaluate(selector => {
    const box = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
    const root = document.querySelector('.lined-notebook');
    const sheet = document.querySelector(`${selector} .notebook-sheet`);
    return { mobile: root.classList.contains('is-mobile'), outerOverflow: root.scrollHeight - root.clientHeight, horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      paper: box(sheet), mount: box(document.querySelector('.notebook-mount')), body: box(sheet.querySelector('.notebook-writing')),
      folio: box(sheet.querySelector('.notebook-page-number')), buttons: sheet.querySelectorAll('.notebook-mobile-turn').length };
  }, visible);
  assert(result.mobile, 'Touch phones must use the focused mobile page, including landscape');
  assert(result.outerOverflow <= 1, `Only the paper body scrolls; outer overflow ${result.outerOverflow}px`);
  assert(result.horizontalOverflow <= 1, 'No horizontal document overflow');
  assert(result.paper.y >= 0 && result.paper.bottom <= page.viewportSize().height + 1, 'Whole page and folio fit the viewport');
  assert(Math.abs(result.paper.height - result.mount.height) <= 1, 'Engine and paper use the same height');
  assert.equal(result.buttons, 0, 'Mobile has no previous/next buttons');
  assert(result.folio.y >= 0 && result.folio.bottom <= page.viewportSize().height + 1, 'Page number stays on screen');
  return result;
}
try {
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    page.setDefaultTimeout(8000);
    page.setDefaultNavigationTimeout(45000);
    console.log(`Checking ${width}×${height}`);
    const client = await page.context().newCDPSession(page);
    page.on('pageerror', error => failures.push(`${width}×${height}: ${error.message}`));
    try {
      await open(page, '/');
      assert.equal(await status(page), expected(0), 'The landing page opens about me');
      await page.getByRole('button', { name: 'Open contents', exact: true }).click(); await settle(page);
      assert.equal(await status(page), 'Contents.');
      const layout = await geometry(page);
      assert.equal(await page.locator('.notebook-mobile-facing').count(), 0, 'First leaf has no preceding page');
      assert(await page.locator('.stack-read').isHidden(), 'First leaf has no turned-page stack');
      assert.equal(await page.locator(`${visible} .notebook-writing`).evaluate(e => getComputedStyle(e).backgroundAttachment), 'local', 'Ruled lines scroll with the writing');
      assert.equal(await page.locator('.notebook-contents-page button').count(), notebookSections.length);
      await scrollBody(page, client);
      assert(await page.locator(`${visible} .notebook-writing`).evaluate(e => e.scrollTop) > 0, 'Contents scrolls with native touch');
      await edgeTurn(page, client, 'right');
      assert.equal(await page.locator(`${visible} [data-contents-part]`).getAttribute('data-contents-part'), '1');
      assert(await page.locator('.notebook-mobile-facing').isVisible(), 'Turned pages restore the neighboring paper');
      await edgeTurn(page, client, 'left');
      assert.equal(await page.locator(`${visible} [data-contents-part]`).getAttribute('data-contents-part'), '0');
      await open(page, '/profile/about-me');
      await scrollBody(page, client);
      const scrollTop = await page.locator(`${visible} .notebook-writing`).evaluate(e => e.scrollTop);
      assert(scrollTop > 0, 'Native prose swipe scrolls the body');
      assert.equal(await status(page), expected(0), 'Vertical prose swipe never turns the page');
      await edgeTurn(page, client, 'right', true);
      assert.equal(await status(page), expected(0), 'Cancelled grip returns to the same page');
      await edgeTurn(page, client, 'right');
      assert.equal(await status(page), expected(1), 'Right grip flips forward');
      const routed = page.url(); await page.reload(); await settle(page);
      assert.equal(page.url(), routed); assert.equal(await status(page), expected(1), 'Reload restores exact source page');
      await edgeTurn(page, client, 'left');
      assert.equal(await status(page), expected(0), 'Left grip flips backward');
      // Scroll restoration is intentionally tested without a document reload.
      await scrollBody(page, client);
      const remembered = await page.locator(`${visible} .notebook-writing`).evaluate(e => e.scrollTop);
      await edgeTurn(page, client, 'right'); await edgeTurn(page, client, 'left');
      assert(Math.abs(await page.locator(`${visible} .notebook-writing`).evaluate(e => e.scrollTop) - remembered) <= 2, 'Returning to a page restores its body scroll');
      await page.getByRole('button', { name: 'Open contents', exact: true }).click(); await settle(page);
      assert.equal(new URL(page.url()).pathname, '/contents');
      await page.goBack(); await settle(page); assert.equal(await status(page), expected(0));
      if (screenshots) await page.screenshot({ path: `${screenshots}/${width}x${height}-prose.png` });
      results.push({ width, height, layout, nativeScroll: scrollTop });
    } catch (error) { failures.push(`${width}×${height}: ${error.message}`); console.error(failures.at(-1)); }
    finally { await page.close(); }
  }
  // Normal animation, orientation and the removable sheet need real pointer input too.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page.setDefaultTimeout(8000);
  const client = await page.context().newCDPSession(page);
  try {
    await open(page, '/profile/about-me');
    const partialGrip = await page.locator(`${visible} .notebook-mobile-grip[data-side="right"]`).boundingBox();
    const partial = { x: partialGrip.x + partialGrip.width / 2, y: partialGrip.y + partialGrip.height / 2 };
    await touch(page, client, [partial, { x: partial.x - 80, y: partial.y - 8 }]);
    assert.equal(await status(page), expected(0), 'Partial animated fold returns home');
    await edgeTurn(page, client, 'right', true);
    assert.equal(await status(page), expected(0), 'Cancelled animated fold never commits');
    await edgeTurn(page, client, 'right'); assert.equal(await status(page), expected(1));
    const route = page.url();
    await page.setViewportSize({ width: 844, height: 390 }); await settle(page);
    await geometry(page); assert.equal(page.url(), route); assert.equal(await status(page), expected(1), 'Orientation preserves exact page');
    await page.setViewportSize({ width: 390, height: 844 }); await settle(page);
    await geometry(page); assert.equal(await status(page), expected(1));
    await edgeTurn(page, client, 'left'); assert.equal(await status(page), expected(0));
    const grip = await page.locator(`${visible} .notebook-mobile-grip[data-side="right"]`).boundingBox();
    const start = { x: grip.x + grip.width / 2, y: grip.y + 50 };
    await touch(page, client, [start, { x: start.x + 12, y: start.y }, { x: start.x + 12, y: start.y + 200 }], { hold: 250 });
    assert.equal(await page.locator('.notebook-loose.is-released').count(), 1, 'Mobile outward pull and hold detaches paper');
    const beforeScroll = await page.locator('.notebook-loose').boundingBox();
    await scrollBody(page, client, '.notebook-loose .notebook-writing');
    const afterScroll = await page.locator('.notebook-loose').boundingBox();
    assert(Math.abs(beforeScroll.x - afterScroll.x) < 1 && Math.abs(beforeScroll.y - afterScroll.y) < 1, 'Loose prose scroll does not drag the sheet');
    const header = await page.locator('.notebook-loose .notebook-running-head').boundingBox();
    const mount = await page.locator('.notebook-mount').boundingBox();
    const from = { x: header.x + header.width / 2, y: header.y + header.height / 2 };
    await touch(page, client, [from, { x: from.x + mount.x - afterScroll.x, y: from.y + mount.y - afterScroll.y }]);
    assert.equal(await page.locator('.notebook-loose').count(), 0, 'Header drag returns sheet to binding');
    results.push({ animatedTurns: true, orientationRestore: true, looseSheet: true });
  } catch (error) { failures.push(`Animated mobile: ${error.message}`); }
  finally { await page.close(); }
  console.log(JSON.stringify({ results, failures }, null, 2));
  assert.deepEqual(failures, [], 'Mobile notebook regressions');
} finally { await browser.close(); }
