// The numerical fixtures were captured before the rendering optimizations:
// 120 animation frames from each authored initial state, with the original RK4
// step sizes and substeps. External Playwright keeps tooling out of the bundle.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseline = JSON.parse(await readFile(new URL('./notebook-simulation-baselines.json', import.meta.url), 'utf8'));
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
function compare(actual, expected, path = '') {
  if (typeof expected === 'number') {
    assert(Number.isFinite(actual) && Math.abs(actual - expected) <= 1e-10 * Math.max(1, Math.abs(expected)), `${path}: ${actual} differs from ${expected}`);
  } else {
    assert.deepEqual(Object.keys(actual), Object.keys(expected), path);
    for (const key of Object.keys(expected)) compare(actual[key], expected[key], `${path}.${key}`);
  }
}
try {
  for (const [file, expected] of Object.entries(baseline)) {
    for (const [width, deviceScaleFactor] of [[320, 3], [720, 1]]) {
      const page = await browser.newPage({ viewport: { width, height: 932 }, deviceScaleFactor });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      // Advance manually so comparison is independent of display refresh rate.
      await page.addInitScript(() => { window.requestAnimationFrame = () => 1; });
      await page.goto(`${origin}/dynamical_systems/${file}`);
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => {
        draw();
        const first = cv.toDataURL();
        for (let i = 0; i < 120; i++) frame();
        return {
          physics: { state: S, time: simT, energy: energy(), dt: DT, substeps: SUBSTEPS },
          moved: cv.toDataURL() !== first,
          painted: ctx.getImageData(0, 0, cv.width, cv.height).data.some((value, i) => i % 4 === 3 && value > 0),
          buffer: [cv.width, cv.height],
          expectedBuffer: [Math.round(cv.clientWidth * devicePixelRatio), Math.round(cv.clientWidth * devicePixelRatio * CH / CW)],
          chartSamples: eHist.length,
          chartPixels: ech.width * ech.height,
          hiddenReadout: document.getElementById('rt').textContent,
        };
      });
      compare(result.physics, expected, file);
      assert(result.moved && result.painted, `${file}: simulation paints and moves`);
      assert.deepEqual(result.buffer, result.expectedBuffer, `${file}: buffer follows display size and DPR`);
      assert.equal(result.chartSamples, 0);
      assert.equal(result.chartPixels, 1);
      assert.equal(result.hiddenReadout, '');
      const nextWidth = width === 320 ? 430 : 600;
      await page.setViewportSize({ width: nextWidth, height: 932 });
      await page.waitForFunction(expectedWidth => cv.width === expectedWidth, nextWidth * deviceScaleFactor, { polling: 50 });
      assert(await page.evaluate(() => {
        draw();
        return ctx.getImageData(0, 0, cv.width, cv.height).data.some((value, i) => i % 4 === 3 && value > 0);
      }), `${file}: redraw after viewport resize`);
      assert.deepEqual(errors, [], `${file}: browser errors`);
      await page.close();
    }
  }
  console.log('PASS: all three simulations retain baseline physics over 120 frames; mobile/desktop DPR, visible motion, resized drawing and hidden diagnostic work verified.');
} finally { await browser.close(); }
