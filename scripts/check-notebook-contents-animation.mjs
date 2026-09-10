// Contents navigation shows real sampled folds without writing intermediate URLs.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookSections, notebookPages } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const near = notebookSections[0], far = notebookSections.at(-1);
const expected = (section, mobile) => {
  const first = mobile ? section.firstPage : Math.floor(section.firstPage / 2) * 2;
  return `Pages ${first + 1}${mobile ? '' : `–${first + 2}`} of ${notebookPages.length}.`;
};
try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1050 }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const button = section => page.getByRole('button', { name: `Go to ${section.title}, page ${section.firstPage + 1}`, exact: true });
    async function prepare(section, reduced = false) {
      await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
      await page.goto(`${origin}/contents`);
      await page.waitForSelector('.notebook-contents-page');
      await page.evaluate(() => document.fonts.ready);
      if (mobile && section === far) {
        await page.locator('.notebook-spread').focus();
        await page.keyboard.press('ArrowRight');
        await button(section).waitFor({ state: 'visible' });
        await page.waitForFunction(() => !document.querySelector('.notebook-spread').classList.contains('is-turning'));
      }
      await page.evaluate(() => {
        window.contentsJourney = { start: 0, folds: 0, statuses: [], history: [] };
        for (const method of ['pushState', 'replaceState']) {
          const original = history[method];
          history[method] = function (...args) {
            window.contentsJourney.history.push({ method, url: args[2] });
            return original.apply(this, args);
          };
        }
        const sample = () => {
          const trace = window.contentsJourney;
          if (document.querySelector('.notebook-spread')?.classList.contains('is-turning') && [...document.querySelectorAll('.notebook-leaf')].some(leaf => leaf.style.clipPath.includes('polygon'))) trace.folds++;
          const status = document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent;
          if (trace.statuses.at(-1) !== status) trace.statuses.push(status);
          requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      await button(section).evaluate(element => element.addEventListener('click', () => { window.contentsJourney.start = performance.now(); }, { once: true, capture: true }));
    }
    async function arrive(section) {
      await page.waitForFunction(status => document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent === status && !document.querySelector('.notebook-spread')?.classList.contains('is-turning'), expected(section, mobile));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      return page.evaluate(() => ({ ...window.contentsJourney, duration: performance.now() - window.contentsJourney.start }));
    }
    const durations = [];
    for (const section of [near, far]) {
      await prepare(section);
      await button(section).click();
      const trace = await arrive(section);
      assert(trace.folds > 1, `${mobile}: ${section.title} uses polygon folds`);
      assert(trace.duration >= 120 && trace.duration < 1400, `${mobile}: bounded duration ${trace.duration}ms`);
      assert.equal(trace.history.length, 1, 'Only the selected note writes browser history');
      assert.equal(trace.history[0].method, 'pushState');
      assert.equal(new URL(page.url()).pathname, `/${section.folder}/${section.slug}`);
      if (section === far) assert(trace.statuses.filter(status => status?.startsWith('Pages ')).length >= 4, 'Long jumps show multiple sampled reading positions');
      durations.push(trace.duration);
    }
    assert(durations[1] > durations[0] + 250, 'Far contents targets take longer than nearby targets');

    await prepare(far);
    await button(far).click();
    await page.waitForFunction(() => window.contentsJourney.folds > 1);
    await page.goBack();
    await page.waitForURL(`${origin}/contents`);
    await page.waitForTimeout(2000);
    assert.equal(await page.locator('.lined-notebook > .notebook-accessible-status').textContent(), 'Contents.');
    assert.equal(page.url(), `${origin}/contents`, 'Cancelled steps cannot replace the Back destination');
    assert.equal(await page.evaluate(() => window.contentsJourney.history.length), 1, 'Cancelled journey makes no intermediate history writes');
    await page.evaluate(() => { window.contentsJourney.folds = 0; });
    await page.goForward();
    await arrive(far);
    assert.equal(await page.evaluate(() => window.contentsJourney.folds), 0, 'Forward POP restores immediately without replaying the journey');

    await prepare(far);
    await button(far).click();
    await page.waitForFunction(() => window.contentsJourney.folds > 1);
    await page.locator('.notebook-spread').dispatchEvent('pointerdown', { button: 0, pointerId: 1 });
    await page.waitForFunction(() => !document.querySelector('.notebook-spread').classList.contains('is-turning'));
    const interrupted = await page.locator('.lined-notebook > .notebook-accessible-status').textContent();
    await page.waitForTimeout(1900);
    assert.equal(await page.locator('.lined-notebook > .notebook-accessible-status').textContent(), interrupted, 'Pointer interruption cancels future sampled folds');
    assert.notEqual(interrupted, expected(far, mobile));

    await prepare(far, true);
    await button(far).click();
    const reduced = await arrive(far);
    assert.equal(reduced.folds, 0, 'Reduced motion never animates contents navigation');
    assert(reduced.duration < 500, `Reduced motion reaches the target promptly (${reduced.duration}ms)`);
    assert.deepEqual(errors, []);
    console.log(`PASS: ${mobile ? 'mobile' : 'desktop'} contents near ${Math.round(durations[0])}ms / far ${Math.round(durations[1])}ms; folds, history, Back/Forward, pointer cancellation, reduced motion.`);
    await page.close();
  }
} finally { await browser.close(); }
