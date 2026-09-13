let lastPulse = -Infinity;
const durations = { open: 30, turn: 20, release: 35, attach: 25 } as const;

/** Desktop Chrome exposes vibrate() even though it cannot drive Mac trackpads. */
export function canUseVibration() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
    && !/Macintosh|Mac OS X/.test(navigator.userAgent);
}

/** Switch support is a candidate fallback, not proof of a working motor. */
export function usesNativeSwitch() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate !== 'function'
    && typeof HTMLInputElement !== 'undefined' && 'switch' in HTMLInputElement.prototype;
}

export function claimHaptic() {
  if (document.visibilityState !== 'visible') return false;
  const now = performance.now();
  if (now - lastPulse < 100) return false;
  lastPulse = now;
  return true;
}

/** Never emulate missing hardware with sound, timers, or synthetic clicks. */
export function notebookHaptic(moment: keyof typeof durations) {
  if (!canUseVibration()) return;
  if (!claimHaptic()) return;
  try { navigator.vibrate(durations[moment]); } catch { /* Reading must always continue. */ }
}
