import assert from 'node:assert/strict';
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:4192';
const settle = page => page.waitForFunction(() => {
  const spread = document.querySelector('.notebook-spread');
  return spread && !spread.classList.contains('is-turning') && !document.querySelector('.has-cover');
});

for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  try {
    for (const native of [false, true]) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce',
        userAgent: native ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 Version/26.5 Mobile/15E148 Safari/604.1'
          : 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(native => {
        // An old testing preference must no longer disable default feedback.
        localStorage.setItem('haider-notebook-haptics', 'off');
        window.pulses = [];
        window.switchClicks = [];
        Object.defineProperty(navigator, 'vibrate', { configurable: true, value: native ? undefined : value => { window.pulses.push(value); return true; } });
        if (native && !('switch' in HTMLInputElement.prototype)) Object.defineProperty(HTMLInputElement.prototype, 'switch', { configurable: true, value: false });
        document.addEventListener('click', event => {
          if (event.target.matches?.('.notebook-haptic-switch')) window.switchClicks.push({ trusted: event.isTrusted, cancelled: event.defaultPrevented });
        }, true);
      }, native);
      await page.goto(origin);
      const welcome = page.getByRole('button', { name: 'Okay, let me explore' });
      if (await welcome.count()) await welcome.click();
      const cover = page.getByRole('button', { name: 'Open notebook', exact: true });
      const coverBox = await cover.boundingBox();
      await page.mouse.move(coverBox.x + coverBox.width * .8, coverBox.y + coverBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(coverBox.x + coverBox.width * .7, coverBox.y + coverBox.height / 2, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(180);
      assert(await cover.isVisible(), 'Short cover drag cancels');
      if (!native) assert.deepEqual(await page.evaluate(() => window.pulses), [], 'Cancelled opening is quiet on the Vibration API');
      await cover.click();
      await settle(page);
      assert.match(await page.locator('.notebook-accessible-status').innerText(), /^Pages 1 of/);
      if (native) assert((await page.evaluate(() => window.switchClicks)).some(event => event.trusted && !event.cancelled), 'A trusted native switch activation opens the cover');
      else assert.deepEqual(await page.evaluate(() => window.pulses), [30], 'Cover pulses once; initial reading setup is quiet');

      await page.waitForTimeout(120);
      const right = page.locator('.notebook-leaf:not([inert]) .notebook-mobile-grip[data-side="right"]');
      const grip = await right.boundingBox();
      const beforeDrag = await page.evaluate(() => [window.pulses.length, window.switchClicks.length]);
      await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
      await page.mouse.down();
      await page.mouse.move(grip.x - 25, grip.y + grip.height / 2, { steps: 5 });
      await page.mouse.up();
      await settle(page);
      assert.match(await page.locator('.notebook-accessible-status').innerText(), /^Pages 1 of/, 'Short page drag cancels');
      if (!native) assert.equal(await page.evaluate(() => window.pulses.length), beforeDrag[0], 'Cancelled page drag is quiet on the Vibration API');
      await right.click();
      await settle(page);
      assert.match(await page.locator('.notebook-accessible-status').innerText(), /^Pages 2 of/);
      if (!native) assert.deepEqual(await page.evaluate(() => window.pulses), [30, 20], 'A completed page turn pulses once');
      else assert((await page.evaluate(() => window.switchClicks)).every(event => event.trusted), 'Native switch events originate in actual interactions');

      await page.waitForTimeout(120);
      const previous = page.getByRole('button', { name: 'Previous notebook page', exact: true }).filter({ visible: true });
      await previous.focus();
      await page.keyboard.press('Space');
      await settle(page);
      assert.match(await page.locator('.notebook-accessible-status').innerText(), /^Pages 1 of/, 'Keyboard activation turns exactly one page');

      assert.equal(await page.locator('.notebook-haptics-preference, .notebook-haptics-panel').count(), 0, 'No haptics controls or test panel');
      await page.reload();
      await settle(page);
      assert.deepEqual(await page.evaluate(() => window.pulses), [], 'Reload never pulses');
      await right.click();
      await settle(page);
      if (!native) assert.deepEqual(await page.evaluate(() => window.pulses), [20], 'Feedback is on by default after reload despite the old off preference');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${engine.name()} ${native ? 'native switch fallback' : 'Vibration API'}: cover, page tap, keyboard, default-on feedback, no test UI, quiet reload.`);
    }
    const mac = await browser.newPage({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36', reducedMotion: 'reduce' });
    await mac.addInitScript(() => {
      window.pulses = [];
      Object.defineProperty(navigator, 'vibrate', { value: value => { window.pulses.push(value); return true; } });
    });
    await mac.goto(origin);
    assert.equal(await mac.locator('.notebook-haptics-preference').count(), 0, 'No haptics UI on Mac Chrome either');
    assert.equal(await mac.getByRole('button', { name: 'Test a tap', exact: true }).count(), 0, 'Mac Chrome does not offer a nonfunctional test');
    await mac.getByRole('button', { name: 'Open notebook', exact: true }).click();
    await settle(mac);
    assert.deepEqual(await mac.evaluate(() => window.pulses), [], 'Mac Chrome never invokes a nonfunctional vibration backend');
    await mac.close();
    console.log(`PASS ${engine.name()}: Mac Chrome capability exclusion.`);
  } finally { await browser.close(); }
}
