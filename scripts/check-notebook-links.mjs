// Run against Vite. All authored anchors must keep their destination, show ↗,
// and open separately; the contents/previous controls remain page navigation.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, encodeNotebookPlace } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const authored = notebookPages.flatMap((page, index) => [...page.content.matchAll(/(?<!!)\[([^\]]*)\]\(([^)]*)\)/g)].map(match => ({ index, label: match[1], href: match[2] })));
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  for (const index of new Set(authored.map(link => link.index))) {
    const { note } = notebookPages[index], { offset } = JSON.parse(encodeNotebookPlace(index));
    await page.goto(`${origin}/${note.folder}/${note.slug}?at=${offset}`, { waitUntil: 'domcontentloaded' });
    const content = page.locator(`[data-page-index="${index}"] .notebook-content`);
    await content.waitFor();
    const links = await content.locator('a').evaluateAll(anchors => anchors.map(anchor => ({
      href: anchor.getAttribute('href'), target: anchor.target, rel: anchor.rel,
      label: [...anchor.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim(),
      arrow: anchor.querySelector('.notebook-link-arrow')?.textContent,
      arrowVisible: anchor.querySelector('.notebook-link-arrow')?.getBoundingClientRect().width > 0,
    })));
    const expected = authored.filter(link => link.index === index);
    assert.deepEqual(links.map(({ href, label }) => ({ href, label })), expected.map(({ href, label }) => ({ href, label })), `Page ${index + 1}: all source links preserved`);
    assert(links.every(link => link.target === '_blank' && /noopener/.test(link.rel) && /noreferrer/.test(link.rel) && link.arrow === '↗' && link.arrowVisible), `Page ${index + 1}: every link opens separately and shows an arrow`);
  }
  await page.goto(`${origin}/profile/about-me`, { waitUntil: 'domcontentloaded' });
  await page.locator('.notebook-spread').waitFor();
  const before = { url: page.url(), status: await page.locator('.lined-notebook > .notebook-accessible-status').innerText() };
  // Fulfill the destination locally so popup behavior never depends on GitHub uptime.
  await page.context().route('https://github.com/haider-toha', route => route.fulfill({ contentType: 'text/html', body: '<title>External link destination</title>' }));
  const externalPromise = page.waitForEvent('popup');
  await page.locator('.notebook-leaf:not([inert]) a[href="https://github.com/haider-toha"]').click();
  const external = await externalPromise;
  await external.waitForURL('https://github.com/haider-toha');
  assert.equal(await external.evaluate(() => window.opener), null);
  await external.close();
  // There are no authored relative links today. Render a real NotebookContent
  // fixture with the former navigation callback to catch accidental interception.
  await page.evaluate(async fixture => {
    const [{ default: React }, { default: ReactDOM }, { default: NotebookContent }] = await Promise.all([
      import('/node_modules/.vite/deps/react.js'), import('/node_modules/.vite/deps/react-dom_client.js'), import('/components/NotebookContent.tsx'),
    ]);
    const host = document.createElement('div');
    host.id = 'internal-link-regression';
    document.querySelector('.notebook-leaf:not([inert]) .notebook-writing').appendChild(host);
    ReactDOM.createRoot(host).render(React.createElement(NotebookContent, { page: fixture, onNavigate: () => { window.linkIntercepted = true; } }));
  }, { ...notebookPages[0], part: 1, content: '[Related note](/profile/current-focus)' });
  const internal = page.locator('#internal-link-regression a');
  await internal.waitFor();
  const internalPromise = page.waitForEvent('popup'); await internal.click();
  const related = await internalPromise;
  await related.waitForURL(`${origin}/profile/current-focus`);
  await related.locator('.notebook-spread').waitFor();
  assert.equal(await related.evaluate(() => window.opener), null);
  assert.equal(await page.evaluate(() => Boolean(window.linkIntercepted)), false);
  await related.close();
  assert.deepEqual({ url: page.url(), status: await page.locator('.lined-notebook > .notebook-accessible-status').innerText() }, before, 'Both links leave the reading page in place');
  await page.getByRole('button', { name: 'Open contents', exact: true }).first().click();
  await page.waitForURL(`${origin}/contents`);
  assert.deepEqual(errors, []);
  console.log(`PASS: all ${authored.length} authored hyperlinks retain their href and label, show ↗ and target a new tab; real external/internal popups preserve the notebook and contents navigation.`);
} finally { await browser.close(); }
