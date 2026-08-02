import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { portfolioNotes, folders } from "./constants";
import { Theme } from "./types";
import {
  SITE_URL,
  homeMeta,
  folderMeta,
  noteMeta,
  type PageMeta,
} from "./seo";
import { Moon, Sun, PanelLeft, Share } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

const isValidFolder = (id: string | undefined) =>
  !!id && folders.some((f) => f.id === id);

// Resolve the note for the current URL. Prefers an exact folder+slug match, then
// falls back to a slug-only match so links like /blog/about-me (wrong folder),
// /badfolder/about-me (invalid folder) or /all/about-me still resolve. A separate
// effect rewrites the address bar to the canonical /<folder>/<slug>.
const getNoteFromParams = (
  folderParam: string | undefined,
  slugParam: string | undefined,
) => {
  if (!slugParam) {
    // No slug: only the "all" landing page auto-selects the first note.
    return folderParam === "all" ? portfolioNotes[0] ?? null : null;
  }
  if (folderParam && folderParam !== "all") {
    const exact = portfolioNotes.find(
      (n) => n.folder === folderParam && n.slug === slugParam,
    );
    if (exact) return exact;
  }
  return portfolioNotes.find((n) => n.slug === slugParam) ?? null;
};

// Keep the document head in sync with the current view on client-side navigation.
// The prerendered HTML already ships correct tags for the first load / non-JS
// crawlers; this mirrors seo.ts so the tab title, share metadata and canonical stay
// right once React takes over. (Structured-data JSON-LD is left as prerendered.)
const upsertMeta = (key: "name" | "property", value: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const applyHeadMeta = (meta: PageMeta) => {
  const url = SITE_URL + meta.path;
  const ogDesc = meta.ogDescription ?? meta.description;
  document.title = meta.title;
  upsertMeta("name", "description", meta.description);
  upsertMeta("property", "og:title", meta.title);
  upsertMeta("property", "og:description", ogDesc);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:type", meta.ogType);
  upsertMeta("name", "twitter:title", meta.title);
  upsertMeta("name", "twitter:description", ogDesc);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
};

const App: React.FC = () => {
  const { folder: folderParam, slug } = useParams<{
    folder?: string;
    slug?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return !slug;
    return true;
  });
  const [theme, setTheme] = useState<Theme>("light");
  const prevIsMobile = useRef(isMobile);

  const selectedNote = getNoteFromParams(folderParam, slug);
  const selectedNoteId = selectedNote?.id ?? null;
  // Highlight the URL folder when it's valid; "all" stays "all"; otherwise follow
  // the resolved note's real folder so the sidebar selection never lies.
  const selectedFolderId =
    folderParam === "all"
      ? "all"
      : isValidFolder(folderParam)
        ? folderParam!
        : selectedNote?.folder ?? "all";

  // Track viewport → mobile/desktop.
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop opens the first note when landing on "/" (Apple auto-selects a note).
  useEffect(() => {
    if (!isMobile && location.pathname === "/" && portfolioNotes[0]) {
      navigate(`/all/${portfolioNotes[0].slug}`, { replace: true });
    }
  }, [isMobile, location.pathname, navigate]);

  // Rewrite non-canonical note URLs (wrong / invalid folder) to the note's folder.
  useEffect(() => {
    if (
      slug &&
      selectedNote &&
      folderParam !== "all" &&
      folderParam !== selectedNote.folder
    ) {
      navigate(`/${selectedNote.folder}/${selectedNote.slug}`, {
        replace: true,
      });
    }
  }, [slug, selectedNote, folderParam, navigate]);

  // Keep sidebar visibility coherent with viewport + selection.
  useEffect(() => {
    const wasMobile = prevIsMobile.current;
    prevIsMobile.current = isMobile;
    if (!isMobile) {
      // mobile → desktop: reveal the sidebar. In steady-state desktop the toolbar
      // toggle owns this state, so don't clobber it on unrelated re-renders.
      if (wasMobile) setShowSidebar(true);
    } else {
      // Mobile: show the list when nothing is open, hide it while reading a note.
      setShowSidebar(!slug);
    }
  }, [isMobile, slug]);

  // Initialize theme from the system preference.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Update <title>/description/canonical/OG for the current view as the user
  // navigates client-side (see applyHeadMeta above).
  useEffect(() => {
    const meta = selectedNote
      ? noteMeta(selectedNote)
      : folderParam
        ? folderMeta(selectedFolderId)
        : homeMeta();
    applyHeadMeta(meta);
  }, [selectedNote, folderParam, selectedFolderId]);

  const handleSelectNote = (id: string) => {
    const note = portfolioNotes.find((n) => n.id === id);
    if (!note) return;
    // Preserve the current folder context — if viewing "all", stay in "all".
    const currentFolder = selectedFolderId === "all" ? "all" : note.folder;
    navigate(`/${currentFolder}/${note.slug}`);
    if (isMobile) setShowSidebar(false);
  };

  const handleSelectFolder = (folderId: string) => {
    if (folderId === "all") {
      // "all" is the landing page: open the first note on desktop, list on mobile.
      if (isMobile) navigate("/all");
      else if (portfolioNotes[0]) navigate(`/all/${portfolioNotes[0].slug}`);
    } else {
      navigate(`/${folderId}`);
    }
  };

  const handleBack = () => setShowSidebar(true);
  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));
  const toggleDesktopSidebar = () => {
    if (!isMobile) setShowSidebar((p) => !p);
  };

  const handleShare = async () => {
    if (!selectedNote) return;
    // Always share the canonical /<folder>/<slug> link so it resolves anywhere.
    const shareUrl = `${window.location.origin}/${selectedNote.folder}/${selectedNote.slug}`;
    const shareData = {
      title: selectedNote.title,
      text: selectedNote.content.substring(0, 200) + "...",
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("link copied to clipboard");
      }
    } catch {
      // user dismissed the share sheet, or clipboard was denied — non-fatal
    }
  };

  return (
    <>
      <Analytics />
      <div className="h-full w-full flex flex-col bg-apple-bgLight dark:bg-black overflow-hidden font-sans transition-colors duration-200">
        {/* Desktop Toolbar — unified, translucent, monochrome glyphs (macOS Notes) */}
        {!isMobile && (
          <div className="h-[52px] bg-apple-sidebarLight/80 dark:bg-apple-sidebarDark/70 backdrop-blur-xl flex items-center justify-between px-4 border-b border-black/[0.07] dark:border-white/[0.08] shrink-0 z-20 select-none">
            <div className="flex items-center">
              <button
                onClick={toggleDesktopSidebar}
                aria-label="Toggle sidebar"
                title="Toggle sidebar"
                className="p-1.5 -ml-1.5 rounded-md text-apple-textGray hover:text-black/75 dark:hover:text-white/75 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <PanelLeft className="w-[18px] h-[18px] stroke-[1.8]" />
              </button>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={handleShare}
                aria-label="Share note"
                title="Share"
                className="p-1.5 rounded-md text-apple-textGray hover:text-black/75 dark:hover:text-white/75 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Share className="w-[17px] h-[17px] stroke-[1.8]" />
              </button>
              <div className="w-px h-5 bg-apple-separatorLight dark:bg-apple-separatorDark mx-1.5" />
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                title="Toggle appearance"
                className="p-1.5 rounded-md text-apple-textGray hover:text-black/75 dark:hover:text-white/75 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="w-[17px] h-[17px] stroke-[1.8]" />
                ) : (
                  <Sun className="w-[17px] h-[17px] stroke-[1.8]" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Split View */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar Column.
              Mobile: slides over the content (transform). Desktop: collapses by
              animating width so the editor smoothly reclaims the space (macOS). */}
          <div
            className={`
            shrink-0 h-full bg-apple-sidebarLight dark:bg-apple-sidebarDark
            ease-[cubic-bezier(0.42,0,0.58,1)] duration-[250ms]
            ${
              isMobile
                ? `absolute inset-0 z-30 w-full transition-transform ${showSidebar ? "translate-x-0" : "-translate-x-full"}`
                : `relative overflow-hidden transition-[width] ${showSidebar ? "w-[480px] lg:w-[520px]" : "w-0"}`
            }
            ${showSidebar ? "border-r border-apple-separatorLight dark:border-apple-separatorDark" : ""}
          `}
          >
            <div className="h-full w-full md:w-[480px] lg:w-[520px]">
              <Sidebar
                notes={portfolioNotes}
                folders={folders}
                selectedNoteId={selectedNoteId}
                selectedFolderId={selectedFolderId}
                onSelectNote={handleSelectNote}
                onSelectFolder={handleSelectFolder}
                isMobile={isMobile}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            </div>
          </div>

          {/* Main Content Column */}
          <div className="flex-1 h-full bg-apple-bgLight dark:bg-apple-bgDark relative z-10 w-full min-w-0">
            <MainContent
              note={selectedNote ?? undefined}
              onBack={handleBack}
              isMobile={isMobile}
              onShare={handleShare}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
