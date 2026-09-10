// Optional WebKit integration smoke check; install with `npx playwright install webkit`.
// This complements Chromium's native touch/CDP suites, not real iOS testing.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { webkit } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, encodeNotebookPlace } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:4173';
const browser = await webkit.launch();
const status = page => page.locator('.notebook-accessible-status').innerText();
const route = index => {
  const note = notebookPages[index].note;
  return `${origin}/${note.folder}/${note.slug}?at=${JSON.parse(encodeNotebookPlace(index)).offset}`;
};
try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1050 },
      isMobile: mobile, hasTouch: mobile, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/`);
    await page.getByRole('button', { name: 'Open notebook', exact: true }).click();
    await page.waitForSelector('.notebook-intro');
    await page.evaluate(() => document.fonts.ready);
    const initial = await status(page);
    await page.waitForTimeout(250);
    await page.locator('.notebook-spread').focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('.notebook-spread').classList.contains('is-turning'));
    await page.waitForFunction(() => !document.querySelector('.notebook-spread').classList.contains('is-turning'));
    assert.notEqual(await status(page), initial, 'WebKit completes its first animated turn after idle');
    await page.getByRole('button', { name: 'Open contents', exact: true }).first().click();
    await page.waitForFunction(() => document.querySelector('.notebook-accessible-status').textContent === 'Contents.');
    await page.goBack();
    await page.waitForFunction(() => document.querySelector('.notebook-accessible-status').textContent.startsWith('Pages '));

    const diagram = notebookPages.findIndex(entry => entry.content.includes('```mermaid'));
    await page.goto(route(diagram));
    const leaf = page.locator(`.notebook-leaf:not([inert]) [data-page-index="${diagram}"]`);
    await leaf.locator('svg[id^="mermaid-"]').waitFor();
    const expand = leaf.getByRole('button', { name: 'Expand diagram', exact: true }).first();
    await expand.click();
    const modal = page.getByRole('dialog', { name: 'Expanded diagram' });
    await modal.waitFor();
    await modal.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await page.keyboard.press('Escape');
    await modal.waitFor({ state: 'detached' });
    assert(await expand.evaluate(element => element === document.activeElement), 'WebKit restores diagram opener focus');

    const tablePage = notebookPages.findIndex(entry => /\|[^\n]*\|\n\|[\s:|-]+\|/.test(entry.content));
    await page.goto(route(tablePage));
    const table = page.locator(`[data-page-index="${tablePage}"] table`).first();
    await table.waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.match(await table.evaluate(element => getComputedStyle(element).fontFamily), /Reenie Beanie/);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'WebKit keeps tables inside the viewport');
    if (mobile) {
      const writing = page.locator('.notebook-leaf:not([inert]) .notebook-writing');
      await writing.evaluate(element => { element.scrollTop = element.scrollHeight; });
      assert(await writing.evaluate(element => element.scrollTop > 0), 'WebKit mobile writing remains scrollable');
      await page.setViewportSize({ width: 320, height: 568 });
      await page.waitForTimeout(100);
      assert(await page.locator('.notebook-mount').evaluate(element => element.getBoundingClientRect().right <= innerWidth), 'WebKit notebook resizes inside the viewport');
    }
    assert.deepEqual(errors, [], 'WebKit runtime errors');
    await page.close();
  }
  console.log('PASS: desktop/mobile WebKit startup, animated turn after idle, history, diagrams, modal focus, handwritten tables, scrolling and resize.');
} finally { await browser.close(); }
