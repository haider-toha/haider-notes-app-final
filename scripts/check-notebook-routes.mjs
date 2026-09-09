// Audit notebook entry routes, canonical note links, and every contents entry.
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { portfolioNotes, notebookSections, folders } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  async function open(path) {
    await page.goto(`${origin}${path}`);
    await page.waitForSelector('.lined-notebook');
    assert.equal(await page.locator('.lined-notebook').count(), 1, `${path}: main experience is the notebook`);
    assert.equal(await page.getByRole('button', { name: 'Share note', exact: true }).count(), 0, `${path}: retired notes toolbar absent`);
  }
  async function checkNote(note) {
    await page.waitForFunction(id => [...document.querySelectorAll('.notebook-leaf:not([inert]) [data-note-id]')].some(element => element.dataset.noteId === id), note.id);
  }
  const checkContents = () => page.waitForFunction(() => document.querySelector('.lined-notebook > .notebook-accessible-status').textContent === 'Contents.');
  for (const path of ['/', '/notebook']) { await open(path); await checkNote(portfolioNotes[0]); }
  await open('/contents'); await checkContents();
  assert((await page.title()).toLowerCase().includes('contents'), 'Contents has route-specific metadata');
  assert((await page.locator('link[rel=canonical]').getAttribute('href')).endsWith('/contents'));
  for (const note of portfolioNotes) {
    await open(`/${note.folder}/${note.slug}`);
    await checkNote(note);
    assert((await page.title()).includes(note.title), `${note.id}: meaningful note title retained`);
    assert((await page.locator('link[rel=canonical]').getAttribute('href')).endsWith(`/${note.folder}/${note.slug}`), `${note.id}: canonical URL retained`);
  }
  for (const folder of folders) {
    await open(`/${folder.id}`);
    await checkNote(portfolioNotes.find(note => folder.id === 'all' || note.folder === folder.id));
  }
  // The old app accepted /all/<slug> links as well as real folder paths.
  const sample = portfolioNotes.find(note => note.folder === 'blog');
  await open(`/all/${sample.slug}`); await checkNote(sample);
  await page.locator('.notebook-spread').focus(); await page.keyboard.press('ArrowRight');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const savedReadingStatus = await page.locator('.lined-notebook > .notebook-accessible-status').innerText();
  await page.reload();
  await page.waitForFunction(expected => document.querySelector('.lined-notebook > .notebook-accessible-status')?.textContent === expected, savedReadingStatus);
  await open('/');
  await checkNote(portfolioNotes[0]); await page.reload(); await checkNote(portfolioNotes[0]);
  for (const section of notebookSections) {
    const contents = page.getByRole('button', { name: 'Open contents', exact: true }).first();
    if (await contents.count()) { await contents.click(); await page.waitForURL(`${origin}/contents`); }
    await page.getByRole('button', { name: `Go to ${section.title}, page ${section.firstPage + 1}`, exact: true }).click();
    await checkNote(portfolioNotes.find(note => note.id === section.id));
  }
  await page.goBack(); await checkContents();
  await page.goBack(); await checkNote(portfolioNotes.find(note => note.id === notebookSections.at(-2).id));
  await page.goForward(); await checkContents();
  await page.goForward(); await checkNote(portfolioNotes.find(note => note.id === notebookSections.at(-1).id));
  await open('/missing-note-path');
  await page.waitForURL(`${origin}/`);
  await open('/book-test');
  await page.waitForURL(`${origin}/`); await checkNote(portfolioNotes[0]);
  await assert.rejects(access(new URL('../public/book-test', import.meta.url)), { code: 'ENOENT' }, 'Retired prototype assets must not ship');
  assert.deepEqual(errors, [], 'Route and contents navigation produce no runtime errors');
  console.log(`PASS: root/alias open about me even after saved reading, /contents route, routed reading-position refresh, all ${portfolioNotes.length} canonical note routes, ${folders.length} folder routes, old /all links, every contents entry and browser history.`);
} finally { await browser.close(); }
