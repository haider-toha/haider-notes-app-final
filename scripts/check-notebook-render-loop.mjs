// Isolated page-flip adapter lifecycle check. Run against Vite (not preview).
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/__render-loop-check', route => route.fulfill({ contentType: 'text/html', body: '<div id="host" style="width:800px;height:600px"></div>' }));
  await page.goto(`${origin}/__render-loop-check`);
  await page.evaluate(async () => {
    const { PageFlip, loadNotebookPages } = await import('/components/notebookPageFlip.ts');
    window.mountBook = () => {
      const host = document.getElementById('host');
      const mount = document.createElement('div');
      host.append(mount);
      const leaves = Array.from({ length: 5 }, (_, i) => {
        const el = document.createElement('div'); el.textContent = `Page ${i}`; mount.append(el); return el;
      });
      const book = new PageFlip(mount, { width: 400, height: 600, flippingTime: 400, usePortrait: false, showCover: false });
      const dispose = loadNotebookPages(book, leaves);
      const renderer = book.getRender();
      const render = renderer.render;
      const probe = { book, dispose, leaves, draws: 0 };
      renderer.render = function (time) { probe.draws++; return render.call(this, time); };
      window.probe = probe;
    };
    window.mountBook();
  });
  await page.waitForTimeout(100);
  assert(await page.evaluate(() => probe.leaves.every((_, i) => probe.book.getPage(i).getDensity() === 'soft')), 'Odd final leaf stays soft');
  const initial = await page.evaluate(() => probe.draws);
  await page.waitForTimeout(450);
  assert.equal(await page.evaluate(() => probe.draws), initial, 'Idle renderer schedules no draws');
  await page.evaluate(() => probe.book.flipNext());
  await page.waitForTimeout(70);
  assert(await page.evaluate(() => probe.book.getState() !== 'read' && probe.leaves.some(e => e.style.clipPath.includes('polygon'))), 'First turn after idle animates a soft fold');
  await page.waitForTimeout(600);
  assert.equal(await page.evaluate(() => probe.book.getCurrentPageIndex()), 2);
  const settled = await page.evaluate(() => probe.draws);
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => probe.draws), settled, 'Final turn frame settles back to idle');
  await page.evaluate(() => probe.book.turnToPage(4));
  await page.waitForTimeout(60);
  assert(await page.evaluate(() => probe.leaves[4].style.display !== 'none'), 'Immediate navigation invalidates the renderer');
  const beforeResize = await page.evaluate(() => probe.draws);
  await page.evaluate(() => probe.book.update());
  await page.waitForTimeout(60);
  assert((await page.evaluate(() => probe.draws)) > beforeResize, 'Geometry updates draw again');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    probe.book.turnToPage(0);
  });
  const hidden = await page.evaluate(() => probe.draws);
  await page.waitForTimeout(80);
  assert.equal(await page.evaluate(() => probe.draws), hidden, 'Hidden documents do no rendering');
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(60);
  assert((await page.evaluate(() => probe.draws)) > hidden, 'Foreground redraws changes made while hidden');
  await page.evaluate(() => { probe.book.flipNext(); probe.dispose(); window.oldProbe = probe; mountBook(); });
  const disposed = await page.evaluate(() => oldProbe.draws);
  await page.waitForTimeout(550);
  assert.equal(await page.evaluate(() => oldProbe.draws), disposed, 'Unmount cancels an in-flight animation');
  await page.evaluate(() => probe.book.flipNext());
  await page.waitForTimeout(650);
  assert.equal(await page.evaluate(() => probe.book.getCurrentPageIndex()), 2, 'Remount has an independent working scheduler');
  await page.evaluate(() => probe.dispose());
  await page.evaluate(() => {
    mountBook();
    window.immediateProbe = probe;
    probe.book.on('init', () => { immediateProbe.lateInit = true; });
    probe.dispose();
    mountBook();
  });
  await page.waitForTimeout(60);
  assert.equal(await page.evaluate(() => immediateProbe.lateInit), undefined, 'StrictMode disposal suppresses the library delayed init callback');
  await page.evaluate(() => probe.dispose());
  assert.deepEqual(errors, []);
  console.log('PASS: idle, delayed animated turn, soft odd leaf, immediate navigation, geometry, background/foreground, disposal, immediate StrictMode cleanup and remount.');
} finally { await browser.close(); }
