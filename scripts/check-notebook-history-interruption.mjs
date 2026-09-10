// Browser POP navigation must supersede both timed turns and captured folds.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const status = page => page.locator('.lined-notebook > .notebook-accessible-status').innerText();
async function settled(page) {
  await page.waitForFunction(() => !document.querySelector('.notebook-spread')?.classList.contains('is-turning'));
}
try {
  for (const mobile of [false, true]) {
    const label = mobile ? 'mobile' : 'desktop';
    const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1050 }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/profile/about-me`);
    await page.getByRole('button', { name: 'Open contents', exact: true }).first().click();
    await page.waitForURL(`${origin}/contents`);
    await page.getByRole('button', { name: /Go to global sentiment engine,/ }).click();
    await page.waitForFunction(() => document.querySelector('.notebook-accessible-status')?.textContent.startsWith('Pages '));
    await settled(page);
    const readingURL = page.url();
    const readingStatus = await status(page);
    await page.evaluate(() => {
      window.historyWrites = [];
      for (const method of ['pushState', 'replaceState']) {
        const original = history[method];
        history[method] = function (...args) {
          window.historyWrites.push({ method, url: args[2] });
          return original.apply(this, args);
        };
      }
    });
    async function backAndForward(release = async () => {}) {
      await page.goBack();
      await page.waitForURL(`${origin}/contents`);
      await release();
      // The superseded animation would otherwise finish and rewrite this URL.
      await page.waitForTimeout(1200);
      assert.equal(page.url(), `${origin}/contents`, `${label}: interrupted turn must not overwrite Back`);
      assert.equal(await status(page), 'Contents.');
      await settled(page);
      await page.goForward();
      await page.waitForURL(readingURL);
      await page.waitForFunction(expected => document.querySelector('.notebook-accessible-status')?.textContent === expected, readingStatus);
      await settled(page);
      assert.deepEqual(await page.evaluate(() => window.historyWrites), [], `${label}: interruption preserves the complete forward history`);
    }
    await page.locator('.notebook-spread').focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('.notebook-spread')?.classList.contains('is-turning'));
    await page.waitForTimeout(60);
    await backAndForward();

    const mount = await page.locator('.notebook-mount').boundingBox();
    const start = { x: mount.x + mount.width - 10, y: mount.y + mount.height / 2 };
    const end = { x: start.x - 100, y: start.y - 15 };
    let release;
    if (mobile) {
      const client = await page.context().newCDPSession(page);
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }] });
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...end, id: 1 }] });
      release = () => client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(end.x, end.y, { steps: 8 });
      release = () => page.mouse.up();
    }
    await page.waitForFunction(() => document.querySelector('.notebook-spread')?.classList.contains('is-turning'));
    await page.waitForFunction(() => [...document.querySelectorAll('.notebook-leaf')].some(leaf => leaf.style.clipPath.includes('polygon')));
    await backAndForward(release);
    assert.deepEqual(errors, [], `${label}: browser errors`);
    await page.close();
  }
  console.log('PASS: desktop/mobile Back interrupts timed turns and captured folds; contents, forward restoration and history remain intact.');
} finally { await browser.close(); }
