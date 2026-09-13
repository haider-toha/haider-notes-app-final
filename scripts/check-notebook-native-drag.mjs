import assert from 'node:assert/strict';
import { webkit } from 'playwright';

const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:4194';
const browser = await webkit.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.goto(`${origin}/profile/about-me`);
    await page.locator('.notebook-spread').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert(await page.evaluate(() => 'switch' in HTMLInputElement.prototype), 'Real WebKit switch support, without a mock');
    await page.evaluate(() => {
      window.nativeDragEvents = [];
      for (const type of ['pointerdown', 'mousedown', 'mousemove', 'mouseup']) window.addEventListener(type, event => {
        if (event.target.matches?.('.notebook-haptic-drag-input')) window.nativeDragEvents.push({ type, trusted: event.isTrusted, cancelled: event.defaultPrevented });
      });
    });
    const grip = page.locator(width > 700 ? '.notebook-edge.edge-next' : '.notebook-leaf:not([inert]) .notebook-mobile-grip[data-side="right"]');
    const box = await grip.boundingBox();
    const mount = await page.locator('.notebook-mount').boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    assert(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.matches('.notebook-haptic-drag-input'), { x, y }), 'The actual page grip hits the native switch');
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(mount.x + mount.width * .15, y, { steps: 25 });
    await page.mouse.up();
    await page.waitForFunction(() => !document.querySelector('.notebook-spread').classList.contains('is-turning'));
    const status = await page.locator('.notebook-accessible-status').innerText();
    assert.match(status, width > 700 ? /^Pages 3–4 of/ : /^Pages 2 of/, 'Native switch drag completes exactly one page turn');
    const events = await page.evaluate(() => window.nativeDragEvents);
    for (const type of ['pointerdown', 'mousedown', 'mousemove', 'mouseup']) {
      assert(events.some(event => event.type === type && event.trusted && !event.cancelled), `${type} reaches the native input, trusted and uncancelled`);
    }
    assert.equal(await page.locator('.notebook-haptics-preference').count(), 0, 'No haptics settings or test panel');
    const previous = page.getByRole('button', { name: width > 700 ? 'Turn previous page' : 'Previous notebook page', exact: true }).filter({ visible: true });
    await previous.focus(); await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.notebook-spread').classList.contains('is-turning'));
    assert.match(await page.locator('.notebook-accessible-status').innerText(), /^Pages 1(?:–2)? of/, 'Keyboard navigation remains functional');
    await page.close();
    console.log(`PASS WebKit ${width}px: native switch receives trusted drag; page turns and keyboard work without test UI.`);
  }
} finally { await browser.close(); }
