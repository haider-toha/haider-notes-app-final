// Expanded figures must remain dismissible, legible and keyboard accessible.
import assert from 'node:assert/strict';
import { loadNotebookData } from './check-notebook-content.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { notebookPages, notebookSections } = await loadNotebookData();
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const errors = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', hasTouch: width < 700 });
    page.on('pageerror', error => errors.push(error.message));
    const index = notebookPages.findIndex(entry => entry.content.includes('```mermaid'));
    const note = notebookPages[index].note;
    const section = notebookSections.find(section => section.id === note.id);
    await page.goto(`${origin}/${note.folder}/${note.slug}`);
    await page.waitForSelector('.notebook-spread');
    await page.locator('.notebook-spread').focus();
    const step = width < 700 ? 1 : 2;
    for (let current = Math.floor(section.firstPage / step) * step; current < Math.floor(index / step) * step; current += step) await page.keyboard.press('ArrowRight');
    const leaf = page.locator(`.notebook-leaf:has([data-page-index="${index}"])`);
    await leaf.locator('svg[id^="mermaid-"]').first().waitFor({ timeout: 20000 });
    const expand = leaf.getByRole('button', { name: 'Expand diagram', exact: true }).first();
    await expand.focus(); await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    const close = dialog.getByRole('button', { name: 'Close diagram', exact: true });
    assert.equal(await close.evaluate(element => document.activeElement === element), true, 'Expanded diagram focuses close control');
    const before = await page.locator('.lined-notebook > .notebook-accessible-status').innerText();
    // 300% diagram zoom must not move or obscure the overlay controls.
    await page.keyboard.press('Tab');
    assert(await dialog.evaluate(element => element.contains(document.activeElement)), 'Tab remains in the modal');
    for (let zoom = 0; zoom < 8; zoom++) await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await page.keyboard.press('ArrowRight');
    const state = await close.evaluate(button => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      const modal = button.closest('[role="dialog"]');
      const rgba = value => value.match(/[\d.]+/g).map(Number);
      const paper = rgba(getComputedStyle(modal).backgroundColor);
      const background = rgba(style.backgroundColor);
      const alpha = background[3] ?? 1;
      const blended = background.slice(0, 3).map((value, index) => value * alpha + paper[index] * (1 - alpha));
      const luminance = rgb => rgb.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      const foreground = luminance(rgba(style.color)), backing = luminance(blended);
      return {
        visible: rect.width >= 40 && rect.height >= 40 && rect.x >= 0 && rect.y >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
        hit: button.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)),
        contrast: (Math.max(foreground, backing) + .05) / (Math.min(foreground, backing) + .05),
        text: modal.textContent,
      };
    });
    assert(state.visible && state.hit, `${width}px: close button remains visible and clickable after zoom`);
    assert(state.contrast >= 3, `${width}px: close icon contrast is ${state.contrast.toFixed(2)}:1`);
    assert.match(state.text, /300%/, 'Expanded diagram reaches 300% zoom');
    if (width < 700) {
      await dialog.getByRole('button', { name: 'Reset', exact: true }).click();
      const client = await page.context().newCDPSession(page);
      const stage = await dialog.locator('.note-media-stage').boundingBox();
      const x = stage.x + stage.width / 2, y = stage.y + stage.height / 2;
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x - 25, y, id: 1 }, { x: x + 25, y, id: 2 }] });
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 75, y, id: 1 }, { x: x + 75, y, id: 2 }] });
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      assert.equal(await dialog.locator('.note-media-scale').innerText(), '300%', 'Two-finger pinch zoom works on mobile');
      await client.detach();
    }
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.locator('.lined-notebook > .notebook-accessible-status').innerText(), before, 'Modal keys do not turn notebook pages');
    assert(await expand.evaluate(element => document.activeElement === element), 'Closing returns focus to figure control');
    await expand.click(); await dialog.waitFor(); await close.click(); await dialog.waitFor({ state: 'detached' });
    const imageIndex = notebookPages.findIndex(entry => entry.content.includes('!['));
    const imageNote = notebookPages[imageIndex].note;
    const imageSection = notebookSections.find(section => section.id === imageNote.id);
    await page.goto(`${origin}/${imageNote.folder}/${imageNote.slug}`);
    await page.waitForSelector('.notebook-spread');
    await page.evaluate(() => new Promise(requestAnimationFrame));
    await page.locator('.notebook-spread').focus();
    for (let current = Math.floor(imageSection.firstPage / step) * step; current < Math.floor(imageIndex / step) * step; current += step) await page.keyboard.press('ArrowRight');
    const imageExpand = page.locator(`.notebook-leaf:has([data-page-index="${imageIndex}"])`).getByRole('button', { name: /^Expand image/ }).first();
    await imageExpand.focus(); await page.keyboard.press('Enter');
    const imageDialog = page.getByRole('dialog', { name: 'Expanded image', exact: true });
    await imageDialog.waitFor();
    for (let zoom = 0; zoom < 8; zoom++) await imageDialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
    assert.equal(await imageDialog.locator('.note-media-scale').innerText(), '300%');
    await imageDialog.getByRole('button', { name: 'Close image', exact: true }).click();
    await imageDialog.waitFor({ state: 'detached' });
    assert(await imageExpand.evaluate(element => document.activeElement === element), 'Image close restores focus');
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: desktop/mobile diagram and image modals, visible high-contrast close at 300%, keyboard open/Escape, touch pinch, focus restoration and pointer close.');
} finally { await browser.close(); }
