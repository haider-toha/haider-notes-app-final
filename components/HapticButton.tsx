import { useId, useRef, type HTMLAttributes, type MouseEvent } from 'react';
import { claimHaptic, usesNativeSwitch } from './notebookHaptics';
import './NotebookHaptics.css';

type Props = HTMLAttributes<HTMLElement> & { disabled?: boolean; feedbackDisabled?: boolean; directTap?: boolean; nativeDrag?: boolean; type?: 'button' };

/** Safari receives real switch gestures on explicit tap/drag controls.
 * Drag switches share pointer events with the notebook engine; native mouse
 * events must not be cancelled. Native feedback timing belongs to Safari.
 * Ordinary reading content never receives a switch overlay.
 */
export default function HapticButton({ children, disabled, feedbackDisabled, directTap = false, nativeDrag = false, type: _type, onClick,
  onPointerDown, onPointerMove, onPointerCancel, onKeyDown, onKeyUp, onBlur, ...props }: Props) {
  const switchId = useId();
  const start = useRef<{ x: number; y: number; moved: boolean; allowed: boolean } | null>(null);
  const space = useRef(false);
  const native = usesNativeSwitch();
  if (!native) return <button {...props} type="button" disabled={disabled} onClick={onClick}
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerCancel={onPointerCancel}
    onKeyDown={onKeyDown} onKeyUp={onKeyUp} onBlur={onBlur}>{children}</button>;

  // Tap-only controls don't forward pointers to the notebook's drag engine.
  // Safari decides the tick before JS receives click, so disabled state
  // must disable the input up front, not try to cancel feedback afterward.
  if (directTap) return <span {...props} role="button" tabIndex={disabled ? -1 : (props.tabIndex ?? 0)}
    className={`${props.className ?? ''} notebook-haptic-tap`} aria-disabled={disabled || undefined}
    onClick={event => {
      event.stopPropagation();
      if (!disabled) onClick?.(event);
    }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;
      if (event.key === 'Enter') { event.preventDefault(); if (!event.repeat) event.currentTarget.click(); }
      if (event.key === ' ') { event.preventDefault(); space.current = true; }
    }}
    onKeyUp={event => {
      onKeyUp?.(event);
      if (event.key === ' ' && space.current) {
        space.current = false; event.preventDefault();
        if (!disabled) event.currentTarget.click();
      }
    }} onBlur={event => { space.current = false; onBlur?.(event); }}>
    {children}
    <input type="checkbox" {...{ switch: '' }} className="notebook-haptic-direct"
      aria-hidden="true" tabIndex={-1} disabled={disabled || feedbackDisabled}
      onPointerDown={event => event.stopPropagation()} />
  </span>;

  const activate = (event: MouseEvent<HTMLElement>) => {
    // The browser forwards a second click to the associated input. Let its
    // default action toggle, but never dispatch the notebook action twice.
    if (event.target instanceof HTMLInputElement) {
      event.stopPropagation();
      // Native input clicks are the original interaction on drag controls.
      // Label-forwarded clicks on the fallback are a second event.
      if (nativeDrag && !disabled && start.current?.allowed) onClick?.(event);
      start.current = null;
      return;
    }
    // Pointer-up may start a page turn and disable the control before click.
    // Retain that tap's eligibility, but reject fresh taps during animation.
    if (!(start.current?.allowed ?? (!disabled && !feedbackDisabled && props['aria-disabled'] !== true))) { event.preventDefault(); start.current = null; return; }
    onClick?.(event);
    if (event.defaultPrevented || start.current?.moved || !event.isTrusted || !claimHaptic()) event.preventDefault();
    start.current = null;
  };

  return <label {...props} htmlFor={switchId} role="button" tabIndex={disabled ? -1 : (props.tabIndex ?? 0)}
    aria-disabled={disabled || props['aria-disabled']} onClick={activate}
    onPointerDown={event => {
      start.current = { x: event.clientX, y: event.clientY, moved: false, allowed: !disabled && !feedbackDisabled && props['aria-disabled'] !== true };
      if (!disabled) onPointerDown?.(event);
    }}
    onPointerMove={event => {
      if (start.current && Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) >= 6) start.current.moved = true;
      if (!disabled) onPointerMove?.(event);
    }}
    onPointerCancel={event => { if (start.current) start.current.moved = true; onPointerCancel?.(event); }}
    onBlur={event => { space.current = false; onBlur?.(event); }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (disabled || event.defaultPrevented) return;
      if (event.key === 'Enter') { event.preventDefault(); if (!event.repeat) event.currentTarget.click(); }
      if (event.key === ' ') { event.preventDefault(); space.current = true; }
    }}
    onKeyUp={event => {
      onKeyUp?.(event);
      if (event.key === ' ' && space.current) {
        space.current = false;
        event.preventDefault();
        if (!disabled) event.currentTarget.click();
      }
    }}>
    {children}
    <input id={switchId} className={`notebook-haptic-switch${nativeDrag ? ' notebook-haptic-drag-input' : ''}`} type="checkbox" {...{ switch: '' }}
      tabIndex={-1} aria-hidden="true" disabled={disabled}
      onPointerDown={event => {
        if (!nativeDrag) return;
        if (feedbackDisabled || props['aria-disabled'] === true) { event.preventDefault(); return; }
        // Start at the end opposite the intended turn. The user's real drag
        // crosses the switch detent once; no synthetic click or vibration loop.
        event.currentTarget.checked = props.className?.includes('edge-back') || props['data-side'] === 'left'
          || String(props['data-corner'] ?? '').endsWith('left') ? false : true;
      }} />
  </label>;
}
