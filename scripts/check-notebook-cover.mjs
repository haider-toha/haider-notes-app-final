import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.NOTEBOOK_ORIGIN || 'http://127.0.0.1:4188';
const browser = await (process.env.NOTEBOOK_COVER_WEBKIT === '1' ? webkit : chromium).launch();
const screenshots = process.env.NOTEBOOK_SCREENSHOTS;
if (screenshots) await mkdir(screenshots, { recursive: true });
try {
  for (const [width, height] of [[1440,1050], [390,844], [320,568], [844,390]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width !== 1440, isMobile: width !== 1440, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin);
    const welcome = page.getByRole('button', { name: 'Okay, let me explore' });
    if (width !== 1440) {
      await welcome.waitFor();
      assert.equal(await page.locator('.notebook-cover').count(), 0, 'Mobile notice precedes the cover');
      await welcome.click();
    } else assert.equal(await welcome.count(), 0, 'Desktop bypasses the mobile notice');
    const cover = page.getByRole('button', { name: 'Open notebook', exact: true });
    await cover.waitFor();
    await cover.locator('img').evaluate(image => image.decode());
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.notebook-leaf').count(), 0, 'Closed cover does not initialize every reading leaf');
    assert.equal(await page.locator('.notebook-cover-invitation').count(), 0, 'No visible opening caption');
    const rect = await cover.boundingBox();
    assert(rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= width && rect.y + rect.height + (width === 1440 ? 55 : 7) <= height, 'Cover and invitation fit the viewport');
    assert(Math.abs(rect.width / rect.height - .75) < .005, 'Original cover proportions are preserved on desktop and mobile');
    if (screenshots && [1440,390].includes(width)) await page.screenshot({ path: `${screenshots}/cover-${width}.png` });
    const x = rect.x + rect.width * .9, y = rect.y + rect.height * .5;
    const client = width !== 1440 && process.env.NOTEBOOK_COVER_WEBKIT !== '1' ? await page.context().newCDPSession(page) : null;
    const pull = async fraction => {
      if (client) {
        await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
        for(let step=1;step<=12;step++) await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-rect.width*fraction*step/12,y,id:1}]});
      } else {
        await page.mouse.move(x,y); await page.mouse.down();
        await page.mouse.move(x - rect.width * fraction,y,{steps:12});
      }
      assert.notEqual(await cover.evaluate(element => getComputedStyle(element).transform), 'matrix(1, 0, 0, 1, 0, 0)', 'Cover follows a held native drag');
      assert.equal(await cover.evaluate(element => getComputedStyle(element).opacity), '1', 'Rigid board never fades during a turn');
      assert.equal(await page.locator('.notebook-cover-inside').evaluate(element => getComputedStyle(element).visibility), 'hidden', 'Inside face stays hidden before the half turn, including WebKit');
      if (width === 1440) assert.equal(await page.locator('.notebook-cover-inside .notebook-sheet').count(), 1, 'Facing flyleaf travels with the board');
      if (fraction > .25) await page.evaluate(() => {
        window.coverMotionSamples = [];
        const sample = () => {
          const stage = document.querySelector('.notebook-cover-stage');
          if (!stage) return;
          const mount = document.querySelector('.notebook-mount');
          const a = stage.getBoundingClientRect(), b = mount.getBoundingClientRect();
          const portrait = mount.parentElement.classList.contains('is-portrait');
          window.coverMotionSamples.push({
            progress: Number(getComputedStyle(stage).getPropertyValue('--cover-progress')),
            hingeError: Math.abs(a.x - b.x - (portrait ? 0 : b.width / 2)),
            topError: Math.abs(a.y - b.y),
          });
          requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      if(client) await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); else await page.mouse.up();
    };
    await pull(.12);
    await page.waitForTimeout(820);
    assert(await cover.isVisible(), 'A short pull returns to the closed cover');
    assert.equal(await page.locator('.notebook-experience').evaluate(e => e.style.getPropertyValue('--cover-ready')), '0', 'Canceled opening restores the opaque closed desk');
    if (width !== 1440) assert.equal(await page.locator('.notebook-cover-endpaper').count(), 1, 'Phone cover has a paper lining over the thick board');
    await pull(.55);
    await cover.waitFor({state:'detached'});
    const samples = await page.evaluate(() => window.coverMotionSamples);
    assert(samples.length >= 8, 'Release continues over multiple rendered frames');
    assert(samples.every(s => s.hingeError < 1 && s.topError < 1), 'Cover and paper share the hinge throughout the turn');
    for (let i = 1; i < samples.length; i++) {
      assert(samples[i].progress >= samples[i - 1].progress, 'Opening never reverses or restarts');
      assert(samples[i].progress - samples[i - 1].progress < .25, 'No large release jump');
    }
    assert(samples.at(-1).progress > .98, 'Animated board reaches its resting position before handoff');
    await page.locator('.notebook-intro h1').waitFor();
    assert(await page.locator('.notebook-bound-cover').isVisible(), 'Cover board remains beneath the open book');
    if (width !== 1440) assert(await page.locator('.notebook-mobile-cover').isVisible(), 'Open front board stays attached beside the phone page');
    assert.match(await page.locator('.notebook-accessible-status').innerText(), /^Pages 1(?:–2)? of 267\./);
    assert(await page.locator('.notebook-spread').evaluate(element => element === document.activeElement), 'Opening gives keyboard focus to the book');
    if (screenshots && [1440,390].includes(width)) await page.screenshot({ path: `${screenshots}/opened-${width}.png` });
    await page.getByRole('button',{name:'Open contents',exact:true}).first().click();
    await page.getByRole('button',{name:'Back to reading',exact:true}).first().waitFor();
    assert.equal(await cover.count(),0,'Contents navigation does not close the cover again');
    assert.deepEqual(errors,[]);
    await client?.detach();
    await page.close();
  }
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true,isMobile:true});
  for (const method of ['Enter','Space','tap']) {
    await page.goto(`${origin}/notebook`);
    const welcome = page.getByRole('button', { name: 'Okay, let me explore' });
    if (await welcome.count()) await welcome.click();
    const cover=page.getByRole('button',{name:'Open notebook',exact:true});
    await cover.waitFor();
    if(method==='Enter' && process.env.NOTEBOOK_COVER_WEBKIT !== '1') {
      const client=await page.context().newCDPSession(page);
      const r=await cover.boundingBox(),x=r.x+r.width/2,y=r.y+r.height/2;
      await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
      await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-90,id:1}]});
      await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await client.detach();
    }
    if(method==='tap') await cover.tap(); else { await cover.focus(); await page.keyboard.press(method); }
    await cover.waitFor({state:'detached'});
    await page.locator('.notebook-intro h1').waitFor();
    assert.equal(await page.evaluate(()=>document.getAnimations().length),0,'Reduced-motion opening has no animation');
  }
  await page.goto(`${origin}/contents`);
  assert.equal(await page.getByRole('button',{name:'Open notebook',exact:true}).count(),0,'Direct contents route bypasses cover');
  await page.getByRole('button',{name:/Go to current focus,/}).click();
  const noteUrl=page.url();
  await page.reload();
  await page.locator('.notebook-spread').waitFor();
  assert.equal(page.url(),noteUrl);
  assert.equal(await page.getByRole('button',{name:'Open notebook',exact:true}).count(),0,'Direct note reload bypasses cover');
  await page.close();
  console.log('PASS: cover artwork fits four desktop/phone sizes, short-drag cancellation, drag/tap/keyboard opening to about me, focus, reduced motion and direct routes.');
} finally { await browser.close(); }
