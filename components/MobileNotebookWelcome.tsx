import { useEffect, useState, type ReactNode } from 'react';

const phoneLayout = '(max-width: 700px), (max-height: 500px) and (pointer: coarse)';
const acceptanceKey = 'haider-notebook-mobile-welcome';

/** A one-time heads-up before the closed cover, only in the phone layout. */
export default function MobileNotebookWelcome({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(() => matchMedia(phoneLayout).matches);
  const [accepted, setAccepted] = useState(() => {
    try { return sessionStorage.getItem(acceptanceKey) === 'accepted'; }
    catch { return false; }
  });
  useEffect(() => {
    const query = matchMedia(phoneLayout);
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  if (!mobile || accepted) return children;
  return <main className="notebook-mobile-welcome" aria-labelledby="notebook-welcome-title">
    <div>
      <h1 id="notebook-welcome-title">Best experienced on desktop</h1>
      <button type="button" onClick={event => {
        try { sessionStorage.setItem(acceptanceKey, 'accepted'); } catch { /* Continue without storage. */ }
        setAccepted(true);
        if (event.detail === 0) requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.notebook-cover')?.focus({ preventScroll: true }));
      }}>Okay, let me explore <span aria-hidden="true">→</span></button>
    </div>
  </main>;
}
