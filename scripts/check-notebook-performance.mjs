// Local production diagnostics, not field Core Web Vitals. Run without other
// browser suites, using the same hardware/network conditions for comparisons.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { preview } from 'vite';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseline = process.env.NOTEBOOK_PERFORMANCE_BASELINE === '1';
const repetitions = Number(process.env.NOTEBOOK_PERFORMANCE_RUNS || 3);
assert(Number.isInteger(repetitions) && repetitions > 0 && repetitions <= 10);
let server, browser;
const results = [];
const pageCuts = JSON.parse(await readFile(new URL('../components/notebookPageCuts.json', import.meta.url), 'utf8'));
const totalPages = pageCuts.notes.reduce((total, note) => total + note.pages.length, 0);
const expectedStatus = (mobile, turned = false) => {
  const first = turned ? (mobile ? 2 : 3) : 1;
  return `Pages ${first}${mobile ? '' : `–${first + 1}`} of ${totalPages}.`;
};

function metricDifference(before, after) {
  const names = ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'LayoutCount', 'RecalcStyleCount'];
  return Object.fromEntries(after.metrics.filter(metric => names.includes(metric.name)).map(metric =>
    [metric.name, metric.value - before.metrics.find(previous => previous.name === metric.name).value]));
}

try {
  if (!process.env.NOTEBOOK_ORIGIN) server = await preview({ preview: { host: '127.0.0.1', port: 4176, strictPort: false } });
  const origin = process.env.NOTEBOOK_ORIGIN || server.resolvedUrls.local[0].replace(/\/$/, '');
  browser = await chromium.launch();
  for (const profile of [
    { name: 'desktop', viewport: { width: 1440, height: 1050 }, rate: 1 },
    { name: 'mobile-4x-cpu', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, rate: 4 },
  ]) {
    for (let run = 0; run < repetitions; run++) {
      const { name, rate, ...options } = profile;
      const homeStatus = expectedStatus(!!options.isMobile);
      const turnStatus = expectedStatus(!!options.isMobile, true);
      const decodedSizes = new Map();
      const context = await browser.newContext(options);
      const page = await context.newPage();
      const client = await context.newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate });
      await client.send('Performance.enable');
      if (process.env.NOTEBOOK_THROTTLE_NETWORK === '1') {
        await client.send('Network.enable');
        await client.send('Network.emulateNetworkConditions', {
          offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 100_000,
        });
      }
      await page.addInitScript(() => {
        window.notebookPerformance = { longTasks: [], taskEntries: [], shifts: [], lcp: 0 };
        new PerformanceObserver(list => {
          window.notebookPerformance.longTasks.push(...list.getEntries().map(entry => entry.duration));
          window.notebookPerformance.taskEntries.push(...list.getEntries().map(entry => ({ start: entry.startTime, duration: entry.duration })));
        }).observe({ type: 'longtask', buffered: true });
        new PerformanceObserver(list => {
          window.notebookPerformance.shifts.push(...list.getEntries().filter(entry => !entry.hadRecentInput)
            .map(entry => ({ time: entry.startTime, value: entry.value })));
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver(list => {
          window.notebookPerformance.lcp = list.getEntries().at(-1).startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
      for (const cache of ['cold', 'warm']) {
        // Cold means a fresh browser-context cache. Warm preserves the prior
        // HTTP cache and saved reading place. New home visits start closed;
        // opening always reaches page one. Baseline builds have no cover.
        await page.goto(`${origin}/`, { waitUntil: 'load' });
        const opener = page.getByRole('button', { name: 'Open notebook', exact: true });
        if (baseline) {
          await page.waitForFunction(expected => document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent === expected, homeStatus);
          await page.waitForSelector('.notebook-leaf:not([inert]) .notebook-intro h1');
        } else await opener.waitFor({ state: 'visible' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(400);
        const startup = await page.evaluate(() => {
          const data = window.notebookPerformance;
          let cls = 0, sum = 0, first = null, last = null;
          for (const shift of data.shifts) {
            if (first === null || shift.time - last > 1000 || shift.time - first > 5000) { sum = 0; first = shift.time; }
            sum += shift.value; last = shift.time; cls = Math.max(cls, sum);
          }
          return {
            fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
            lcpMs: data.lcp, cls, longestTaskMs: Math.max(0, ...data.longTasks),
            blockingMs: data.longTasks.reduce((total, duration) => total + Math.max(0, duration - 50), 0),
            elements: document.querySelectorAll('*').length,
            status: document.querySelector('.notebook-accessible-status')?.textContent ?? null,
            resources: performance.getEntriesByType('resource').map(entry => ({
              name: entry.name, transferBytes: entry.transferSize, decodedBytes: entry.decodedBodySize,
            })),
          };
        });
        startup.surface = baseline ? 'reading' : 'closed-cover';
        let opening = null;
        if (baseline) assert.equal(startup.status, homeStatus, `${name}/${cache}: baseline starts on the opening page`);
        else {
          assert(await opener.isVisible(), `${name}/${cache}: home starts on the closed cover`);
          await opener.evaluate(button => button.addEventListener('click', () => {
            window.notebookPerformance.openStartedAt = performance.now();
          }, { once: true, capture: true }));
          await opener.click();
          await opener.waitFor({ state: 'hidden' });
          await page.waitForFunction(expected => document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent === expected, homeStatus);
          await page.waitForSelector('.notebook-leaf:not([inert]) .notebook-intro h1');
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          opening = await page.evaluate(() => {
            const data = window.notebookPerformance;
            const tasks = data.taskEntries.filter(entry => entry.start + entry.duration >= data.openStartedAt);
            return {
              clickToReadingReadyMs: performance.now() - data.openStartedAt,
              longestTaskMs: Math.max(0, ...tasks.map(entry => entry.duration)),
              blockingMs: tasks.reduce((total, entry) => total + Math.max(0, entry.duration - 50), 0),
              elements: document.querySelectorAll('*').length,
              status: document.querySelector('.notebook-accessible-status')?.textContent ?? null,
              resources: performance.getEntriesByType('resource').map(entry => ({
                name: entry.name, transferBytes: entry.transferSize, decodedBytes: entry.decodedBodySize,
              })),
            };
          });
          assert.equal(opening.status, homeStatus, `${name}/${cache}: opening the cover reaches about me`);
          assert(Number.isFinite(opening.clickToReadingReadyMs), 'Opening duration includes the real activation event');
          await page.waitForTimeout(400);
        }
        for (const sample of [startup, ...(opening ? [opening] : [])]) {
          const javascript = sample.resources.filter(resource =>
            new URL(resource.name).origin === new URL(origin).origin && /\/assets\/.*\.js(?:\?|$)/.test(resource.name));
          assert(javascript.length > 0, 'Production JavaScript resource timings must be present');
          sample.javascriptCachedSizeFallbacks = 0;
          sample.javascriptDecodedBytes = javascript.reduce((total, resource) => {
            // Reuse a measured cold size only for the exact same cached URL.
            if (resource.decodedBytes > 0) decodedSizes.set(resource.name, resource.decodedBytes);
            else sample.javascriptCachedSizeFallbacks++;
            const bytes = decodedSizes.get(resource.name);
            assert(bytes > 0, `Decoded JavaScript size unavailable: ${resource.name}`);
            return total + bytes;
          }, 0);
        }
        await page.evaluate(() => {
          window.notebookPerformance.styleMutations = 0;
          window.notebookPerformance.observer = new MutationObserver(records => {
            window.notebookPerformance.styleMutations += records.length;
          });
          window.notebookPerformance.observer.observe(document.querySelector('.notebook-mount'), {
            attributes: true, subtree: true, attributeFilter: ['style'],
          });
        });
        const before = await client.send('Performance.getMetrics');
        await page.waitForTimeout(1000);
        const after = await client.send('Performance.getMetrics');
        const styleMutations = await page.evaluate(() => {
          window.notebookPerformance.observer.disconnect();
          return window.notebookPerformance.styleMutations;
        });
        await page.locator('.notebook-spread').focus();
        await page.evaluate(() => {
          const data = window.notebookPerformance;
          data.gaps = []; data.longTasks = [];
          let last = performance.now(); const end = last + 1400;
          const tick = time => { data.gaps.push(time - last); last = time; if (time < end) requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
        });
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(1500);
        const turn = await page.evaluate(() => ({
          longestTaskMs: Math.max(0, ...window.notebookPerformance.longTasks),
          gapsOver34ms: window.notebookPerformance.gaps.filter(gap => gap > 34).length,
          maxFrameGapMs: Math.max(0, ...window.notebookPerformance.gaps),
          status: document.querySelector('.notebook-accessible-status')?.textContent ?? null,
        }));
        assert.equal(turn.status, turnStatus, `${name}/${cache}: the measured turn reaches the next page`);
        const result = { profile: name, run: run + 1, cache, startup, opening,
          idle: { styleMutations, ...metricDifference(before, after) }, turn };
        results.push(result);
        if (!baseline) {
          assert(styleMutations <= 5, `${name}: the idle book must not redraw continuously`);
          assert(!startup.resources.some(resource => /tailwindcss\.com/.test(resource.name)), 'Production CSS must not depend on the Play CDN');
          assert(!startup.resources.some(resource => /mermaid|flowDiagram|sequenceDiagram/.test(resource.name)), 'Home must not request diagram rendering chunks');
          assert(opening.javascriptDecodedBytes < 950_000, 'Opened plain reading JavaScript stays below the optimized budget');
          assert(!opening.resources.some(resource => /mermaid|flowDiagram|sequenceDiagram/.test(resource.name)), 'Opening about me must not request diagram chunks');
        }
        console.log(JSON.stringify({ profile: name, run: run + 1, cache, startupSurface: startup.surface, fcpMs: startup.fcpMs,
          openingMs: opening?.clickToReadingReadyMs ?? null,
          longestTaskMs: startup.longestTaskMs, cls: startup.cls, idleStyleMutations: styleMutations,
          idleTaskMs: result.idle.TaskDuration * 1000, turnGapsOver34ms: turn.gapsOver34ms }));
      }
      await context.close();
    }
  }
  if (process.env.NOTEBOOK_PERFORMANCE_OUTPUT) await writeFile(process.env.NOTEBOOK_PERFORMANCE_OUTPUT, `${JSON.stringify({
    conditions: { origin, repetitions, homeSurface: baseline ? 'reading' : 'closed-cover', openingMeasuredSeparately: !baseline, networkThrottled: process.env.NOTEBOOK_THROTTLE_NETWORK === '1', baseline }, results,
  }, null, 2)}\n`);
  console.log(baseline ? 'Baseline diagnostics captured.' : 'PASS: production loading and idle rendering budgets; cold/warm desktop/mobile diagnostics captured.');
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => { server.httpServer.close(resolve); server.httpServer.closeAllConnections(); });
}
