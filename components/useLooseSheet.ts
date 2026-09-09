import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Pose = { x: number; y: number; angle: number; lift: number };
type Sheet = { index: number; width: number; height: number; left: boolean; released: boolean; padding: string; background: string; radius: string; headingAlign: string; scrollTop: number };
type Grip = { id: number; x: number; y: number; origin: Pose; canAttach: boolean };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** A single removable sheet. Pointer position drives a damped spring, not React frames. */
export function useLooseSheet(reducedMotion: boolean, onAttach: (index: number) => DOMRect) {
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const sheetRef = useRef<Sheet | null>(null);
  const element = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLElement | null>(null);
  const grip = useRef<Grip | null>(null);
  const pose = useRef<Pose>({ x: 0, y: 0, angle: 0, lift: 0 });
  const target = useRef<Pose>({ ...pose.current });
  const velocity = useRef<Pose>({ ...pose.current });
  const frame = useRef(0);
  const motion = useRef({ x: 0, y: 0, time: 0, vx: 0, vy: 0 });
  const done = useRef<(() => void) | null>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useRef(reducedMotion);
  reduced.current = reducedMotion;

  const paint = () => {
    const el = element.current;
    if (!el) return;
    const p = pose.current;
    el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.angle}deg)`;
    el.style.setProperty('--loose-lift', String(p.lift));
  };
  const animate = () => {
    if (frame.current) return;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 1 / 30);
      previous = now;
      if (sheetRef.current?.released && grip.current && now - motion.current.time > 60) {
        target.current.angle *= Math.exp(-dt * 5);
      }
      let moving = false;
      for (const key of ['x', 'y', 'angle', 'lift'] as const) {
        const distance = target.current[key] - pose.current[key];
        // F = k(target - position) - c*velocity; m = 1.
        const stiffness = key === 'angle' ? 115 : 240;
        const damping = key === 'angle' ? 16 : 29;
        velocity.current[key] += (stiffness * distance - damping * velocity.current[key]) * dt;
        pose.current[key] += velocity.current[key] * dt;
        if (reduced.current || (Math.abs(distance) < .08 && Math.abs(velocity.current[key]) < .2)) {
          pose.current[key] = target.current[key]; velocity.current[key] = 0;
        } else moving = true;
      }
      paint();
      if (moving) frame.current = requestAnimationFrame(tick);
      else { frame.current = 0; const callback = done.current; done.current = null; callback?.(); }
    };
    frame.current = requestAnimationFrame(tick);
  };
  const clearTimer = () => { if (releaseTimer.current) clearTimeout(releaseTimer.current); releaseTimer.current = null; };
  const clear = () => {
    const writing = source.current?.querySelector<HTMLElement>('.notebook-writing');
    if (writing && element.current) writing.scrollTop = element.current.querySelector<HTMLElement>('.notebook-writing')?.scrollTop ?? 0;
    source.current?.classList.remove('is-detached');
    source.current = null;
    sheetRef.current = null; setSheet(null); grip.current = null;
    clearTimer();
  };
  const begin = (index: number, leaf: HTMLElement, left: boolean, id: number, x: number, y: number) => {
    if (sheetRef.current) return false;
    const rect = leaf.getBoundingClientRect();
    const article = leaf.querySelector<HTMLElement>('.notebook-sheet')!;
    const style = getComputedStyle(article);
    const next = { index, width: rect.width, height: rect.height, left, released: false,
      padding: style.padding, background: style.backgroundImage, radius: getComputedStyle(leaf).borderRadius,
      headingAlign: getComputedStyle(leaf.querySelector('.notebook-running-head')!).justifyContent,
      scrollTop: leaf.querySelector<HTMLElement>('.notebook-writing')!.scrollTop,
    };
    pose.current = { x: rect.x, y: rect.y, angle: 0, lift: 0 };
    target.current = { ...pose.current }; velocity.current = { x: 0, y: 0, angle: 0, lift: 0 };
    grip.current = { id, x, y, origin: { ...pose.current }, canAttach: false };
    source.current = leaf; leaf.classList.add('is-detached');
    sheetRef.current = next; setSheet(next);
    return true;
  };
  const release = () => {
    const current = sheetRef.current;
    if (!current || !grip.current) return;
    const next = { ...current, released: true };
    sheetRef.current = next; setSheet(next);
    // Preserve the position at separation: subsequent movement is relative to it.
    grip.current.origin = { ...target.current };
    grip.current.x = last.current.x; grip.current.y = last.current.y;
    target.current.lift = 1;
    animate();
  };
  const last = useRef({ x: 0, y: 0 });
  const move = (id: number, x: number, y: number) => {
    const g = grip.current, current = sheetRef.current;
    if (!g || !current || g.id !== id) return;
    last.current = { x, y };
    const now = performance.now();
    const dt = Math.max(8, now - motion.current.time) / 1000;
    const vx = (x - motion.current.x) / dt, vy = (y - motion.current.y) / dt;
    motion.current = { x, y, time: now, vx: motion.current.vx * .55 + vx * .45, vy: motion.current.vy * .55 + vy * .45 };
    const dx = x - g.x, dy = y - g.y;
    if (!current.released) {
      const pull = dx * (current.left ? -1 : 1) + (innerWidth <= 700 ? Math.max(0, Math.abs(dy) - 40) * .8 : 0);
      const resistance = 70 * (1 - Math.exp(-Math.max(0, pull) / 130));
      target.current = { x: g.origin.x + resistance * (current.left ? -1 : 1), y: g.origin.y + dy * .12, angle: clamp(dy * .015, -2, 2), lift: clamp(pull / 160, 0, .8) };
      const threshold = Math.min(120, current.width * .32);
      if (pull > threshold) {
        if (!releaseTimer.current) releaseTimer.current = setTimeout(release, 180);
      } else clearTimer();
    } else {
      const leverX = (g.x - g.origin.x - current.width / 2) / current.width;
      const leverY = (g.y - g.origin.y - current.height / 2) / current.height;
      const torque = (motion.current.vy * leverX - motion.current.vx * leverY) * .045;
      target.current = { x: g.origin.x + dx, y: g.origin.y + dy, angle: clamp(torque, -24, 24), lift: 1 };
    }
    animate();
  };
  const pickUp = (id: number, x: number, y: number) => {
    if (!sheetRef.current?.released) return;
    done.current = null;
    motion.current = { x, y, time: performance.now(), vx: 0, vy: 0 };
    grip.current = { id, x, y, origin: { ...pose.current }, canAttach: true };
    target.current = { ...pose.current, lift: 1 }; animate();
  };
  const finish = (cancelled = false) => {
    const current = sheetRef.current;
    if (!current || !grip.current) return;
    clearTimer();
    const g = grip.current; grip.current = null;
    if (!current.released) {
      target.current = { ...g.origin, angle: 0, lift: 0 };
      done.current = clear; animate(); return;
    }
    const rect = source.current?.closest('.notebook-mount')?.getBoundingClientRect();
    const spine = rect ? (rect.width > current.width * 1.5 ? rect.x + rect.width / 2 : rect.x) : -10000;
    const innerEdge = target.current.x + (current.left ? current.width : 0);
    const aligned = Math.abs(innerEdge - spine) < 65 && rect && Math.abs(target.current.y - rect.y) < Math.min(180, current.height * .25);
    if (!cancelled && g.canAttach && aligned) {
      const home = onAttach(current.index);
      target.current = { x: home.x, y: home.y, angle: 0, lift: 0 };
      done.current = clear; animate();
    } else {
      // Keep a reachable strip on-screen, even after a fast throw or touch cancel.
      target.current = { x: clamp(target.current.x, 48 - current.width, innerWidth - 48), y: clamp(target.current.y, 48 - current.height, innerHeight - 100), angle: clamp(pose.current.angle, -14, 14), lift: 0 };
      animate();
    }
  };
  const nudge = (dx: number, dy: number) => {
    if (!sheetRef.current?.released) return;
    grip.current = { id: -1, x: 0, y: 0, origin: { ...pose.current }, canAttach: true };
    target.current = { ...target.current, x: target.current.x + dx, y: target.current.y + dy, lift: .5 };
    animate();
  };
  useLayoutEffect(() => {
    paint();
    if (!sheet || !element.current) return;
    const article = element.current.querySelector<HTMLElement>('.notebook-sheet')!;
    article.style.padding = sheet.padding;
    article.style.backgroundImage = sheet.background;
    article.style.borderRadius = sheet.radius;
    element.current.style.borderRadius = sheet.radius;
    element.current.querySelector<HTMLElement>('.notebook-running-head')!.style.justifyContent = sheet.headingAlign;
    element.current.querySelector<HTMLElement>('.notebook-writing')!.scrollTop = sheet.scrollTop;
  }, [sheet]);
  useEffect(() => {
    const resize = () => {
      if (!sheetRef.current) return;
      if (!sheetRef.current.released) { finish(true); return; }
      target.current.x = clamp(target.current.x, 48 - sheetRef.current.width, innerWidth - 48);
      target.current.y = clamp(target.current.y, 48 - sheetRef.current.height, innerHeight - 100); animate();
    };
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(frame.current); clearTimer(); source.current?.classList.remove('is-detached'); };
  }, []);
  return { sheet, element, begin, move, finish, pickUp, nudge, active: () => sheetRef.current !== null };
}
