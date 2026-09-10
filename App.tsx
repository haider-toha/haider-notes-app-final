import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useNavigationType } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import LinedNotebook from './components/LinedNotebook';
import NotebookCover from './components/NotebookCover';
import MobileNotebookWelcome from './components/MobileNotebookWelcome';
import { notebookPages, notebookSections } from './components/notebookPages';
import { decodeNotebookPlace, encodeNotebookPlace } from './components/notebookPlace';
import { homeMeta, noteMeta, folderMeta, SITE_URL, type PageMeta } from './seo';

function applyHead(meta: PageMeta) {
  document.title = 'Haider Toha';
  for (const [attribute, name, content] of [
    ['name', 'description', meta.description],
    ['property', 'og:title', meta.title],
    ['property', 'og:description', meta.ogDescription ?? meta.description],
    ['property', 'og:url', SITE_URL + meta.path],
    ['property', 'og:type', meta.ogType],
    ['name', 'twitter:title', meta.title],
    ['name', 'twitter:description', meta.ogDescription ?? meta.description],
  ]) {
    let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, name); document.head.appendChild(tag); }
    tag.content = content;
  }
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = SITE_URL + meta.path;
}

/** The notebook is the site; existing published note URLs still open their leaf. */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [visiblePage, setVisiblePage] = useState(0);
  const [coverOpened, setCoverOpened] = useState(false);
  const [coverOpening, setCoverOpening] = useState(false);
  const [coverPrepared, setCoverPrepared] = useState(false);
  const finishOpening = useCallback(() => { setCoverOpened(true); setCoverOpening(false); }, []);
  const parts = location.pathname.split('/').filter(Boolean);
  const slug = parts.length > 1 ? parts[1] : undefined;
  const noteSection = slug ? notebookSections.find(section => section.slug === slug || section.id === slug) : undefined;
  const folder = parts[0];
  const home = parts.length === 0 || (parts.length === 1 && folder === 'notebook');
  const showCover = home && !coverOpened;
  useEffect(() => {
    if (!coverOpened || !home) return;
    const frame = requestAnimationFrame(() => document.querySelector<HTMLElement>('.notebook-spread')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [coverOpened]);
  useEffect(() => { if (!home) setCoverOpening(false); }, [home]);
  const showContents = parts.length === 1 && folder === 'contents';
  const folderSection = !slug && folder && !['notebook', 'contents', 'all'].includes(folder)
    ? notebookSections.find(section => section.folder === folder) : undefined;
  const valid = home || showContents || (parts.length === 1 && folder === 'all') || !!noteSection || !!folderSection;
  const offset = Number(new URLSearchParams(location.search).get('at') ?? 0);
  const requestedPage = noteSection
    ? decodeNotebookPlace(JSON.stringify({ noteId: noteSection.id, offset })) ?? noteSection.firstPage
    : folderSection?.firstPage ?? (home || folder === 'all' ? 0 : undefined);

  // A page turn updates the shareable URL without issuing another imperative
  // engine navigation. Browser history POPs still restore their own position.
  const animateNavigation = navigationType === 'PUSH' && location.state?.notebookContentsJump === true;
  const navigationRequest = useRef({ key: location.key, page: requestedPage, showContents, animateNavigation });
  const pageTurnReplace = navigationType === 'REPLACE' && location.state?.notebookPageTurn === true;
  if (!pageTurnReplace && navigationRequest.current.key !== location.key) {
    navigationRequest.current = { key: location.key, page: requestedPage, showContents, animateNavigation };
  }
  const currentRoute = useRef({ location, requestedPage, navigate });
  currentRoute.current = { location, requestedPage, navigate };
  const onPageChange = useCallback((index: number) => {
    setVisiblePage(index);
    const route = currentRoute.current;
    const visibleCount = document.querySelector('.notebook-spread')?.classList.contains('is-portrait') ? 1 : 2;
    // A note may start on the right leaf. Keep that explicit note URL while its
    // requested source page is still visible, including initial spread setup.
    if (route.requestedPage !== undefined && route.requestedPage >= index && route.requestedPage < index + visibleCount) return;
    const page = notebookPages[index];
    if (!page) return;
    const place = JSON.parse(encodeNotebookPlace(index));
    const target = `/${page.note.folder}/${page.note.slug}${place.offset ? `?at=${place.offset}` : ''}`;
    if (route.location.pathname + route.location.search !== target) {
      route.navigate(target, { replace: true, state: { notebookPageTurn: true } });
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    const meta = showContents ? { ...homeMeta(), ...(folder === 'contents' ? { path: '/contents', title: 'Contents · Haider Toha' } : {}) }
      : noteSection ? noteMeta(notebookPages[noteSection.firstPage].note)
      : folderSection || folder === 'all' ? folderMeta(folder)
      : visiblePage === 0 ? homeMeta() : noteMeta(notebookPages[visiblePage].note);
    applyHead(meta);
  }, [location.pathname, noteSection?.id, folderSection?.id, visiblePage]);

  if (!valid) return <Navigate to="/" replace />;
  if (noteSection && folder !== noteSection.folder) return <Navigate to={`/${noteSection.folder}/${noteSection.slug}${location.search}`} replace />;

  return <div className={`notebook-experience${showCover ? ' has-cover' : ''}`}>
    <Analytics />
    {(!showCover || coverOpening || coverPrepared) && <div className="notebook-cover-reading" inert={showCover} aria-hidden={showCover || undefined}>
    <LinedNotebook initialPage={navigationRequest.current.page} showContents={navigationRequest.current.showContents}
      animateNavigation={navigationRequest.current.animateNavigation}
      navigationKey={navigationRequest.current.key} onPageChange={onPageChange}
      onOpenContents={() => { if (location.pathname !== '/contents') navigate('/contents'); }}
      onSelectPage={index => {
        const page = notebookPages[index];
        const place = JSON.parse(encodeNotebookPlace(index));
        navigate(`/${page.note.folder}/${page.note.slug}${place.offset ? `?at=${place.offset}` : ''}`, { state: { notebookContentsJump: true } });
      }} />
    </div>}
    {showCover && <MobileNotebookWelcome><NotebookCover opening={coverOpening} onPrepare={() => setCoverPrepared(true)} onOpen={() => setCoverOpening(true)} onOpened={finishOpening} /></MobileNotebookWelcome>}
  </div>;
}
