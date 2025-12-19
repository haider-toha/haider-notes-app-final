import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { portfolioNotes, folders } from "./constants";
import { Theme } from "./types";
import { Moon, Sun, PanelLeft, Share } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  const { folder: folderParam, slug } = useParams<{ folder?: string; slug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the folder param is a valid folder
  const isValidFolder = (id: string | undefined) => {
    if (!id) return false;
    return folders.some((f) => f.id === id);
  };

  // Find note by folder and slug
  const getNoteFromParams = (folderParam: string | undefined, slugParam: string | undefined) => {
    if (!folderParam) return null;
    
    // Special handling for "all" folder - search all notes by slug only
    if (folderParam === "all") {
      if (slugParam) {
        return portfolioNotes.find((n) => n.slug === slugParam) || null;
      }
      // Return first note if no slug specified (only for "all" as landing page)
      return portfolioNotes[0] || null;
    }
    
    // If we have both folder and slug, find the specific note
    if (slugParam) {
      return portfolioNotes.find((n) => n.folder === folderParam && n.slug === slugParam) || null;
    }
    
    // For other folders without a slug, don't auto-select a note
    return null;
  };

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return !slug && !folderParam;
    }
    return true;
  });
  const [theme, setTheme] = useState<Theme>("light");

  // Get selected folder from URL param
  const selectedFolderId = isValidFolder(folderParam) ? folderParam! : "all";

  // Get selected note from URL
  const selectedNote = getNoteFromParams(folderParam, slug);
  const selectedNoteId = selectedNote?.id || null;

  // Handle initial load - redirect to first note on desktop if at root
  useEffect(() => {
    if (location.pathname === "/" && !isMobile) {
      const firstNote = portfolioNotes[0];
      navigate(`/all/${firstNote.slug}`, { replace: true });
    }
  }, [location.pathname, isMobile, navigate]);

  // Determine mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const wasMobile = isMobile;
      setIsMobile(mobile);

      if (mobile) {
        if (location.pathname === "/") {
          setShowSidebar(true);
        }
      } else {
        setShowSidebar(true);
        if (location.pathname === "/" && wasMobile) {
          const firstNote = portfolioNotes[0];
          navigate(`/all/${firstNote.slug}`, { replace: true });
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, location.pathname, navigate]);

  // Theme Toggle Effect
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Update sidebar visibility when route changes to a note
  useEffect(() => {
    if (isMobile && slug) {
      setShowSidebar(false);
    }
  }, [slug, isMobile]);

  const handleSelectNote = (id: string) => {
    const note = portfolioNotes.find((n) => n.id === id);
    if (note) {
      // Preserve current folder context - if viewing "all", stay in "all"
      const currentFolder = selectedFolderId === "all" ? "all" : note.folder;
      navigate(`/${currentFolder}/${note.slug}`);
      if (isMobile) {
        setShowSidebar(false);
      }
    }
  };

  const handleSelectFolder = (folderId: string) => {
    if (folderId === "all") {
      // For "all", navigate to /all with the first note (landing page behavior)
      const firstNote = portfolioNotes[0];
      if (isMobile) {
        navigate("/all");
      } else {
        navigate(`/all/${firstNote.slug}`);
      }
    } else {
      // For other folders, just navigate to the folder without selecting a note
      navigate(`/${folderId}`);
    }
  };

  const handleBack = () => {
    // Simply show the sidebar, keep the current note selected
    setShowSidebar(true);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleDesktopSidebar = () => {
    if (!isMobile) setShowSidebar((prev) => !prev);
  };

  const handleShare = async () => {
    if (!selectedNote) return;

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
    } catch (err) {
      console.error("error sharing:", err);
    }
  };

  return (
    <>
      <Analytics />
      <div className="h-screen w-screen flex flex-col bg-apple-bgLight dark:bg-black overflow-hidden font-sans transition-colors duration-200">
        {/* Desktop Toolbar */}
        {!isMobile && (
          <div className="h-12 bg-apple-sidebarLight/70 dark:bg-apple-sidebarDark/60 backdrop-blur-xl flex items-center justify-between px-4 border-b border-black/10 dark:border-white/10 shrink-0 z-20 select-none">
            <div className="flex items-center space-x-5">
              <button
                onClick={toggleDesktopSidebar}
                className={`hover:opacity-70 transition-opacity ${!showSidebar ? "text-apple-textGray" : "text-apple-yellow"}`}
                title="toggle sidebar"
              >
                <PanelLeft className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="text-apple-textGray hover:opacity-60 transition-opacity"
                title="share"
              >
                <Share className="w-4 h-4 stroke-[2]" />
              </button>
              <div className="w-px h-4 bg-apple-separatorLight dark:bg-apple-separatorDark mx-2"></div>
              <button
                onClick={toggleTheme}
                className="p-1 rounded-full text-apple-textGray hover:text-apple-yellow transition-colors"
                aria-label="toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 stroke-[2]" />
                ) : (
                  <Sun className="w-4 h-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Split View */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar Column */}
          <div
            className={`
            ${isMobile ? "absolute inset-0 z-30" : "relative"}
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
            w-full md:w-[440px] lg:w-[480px] shrink-0 h-full
            bg-apple-sidebarLight dark:bg-apple-sidebarDark
            border-r border-apple-separatorLight dark:border-apple-separatorDark
            ${!showSidebar && !isMobile ? "w-0" : ""} 
          `}
            style={
              !showSidebar && !isMobile ? { width: 0, border: "none" } : {}
            }
          >
            <Sidebar
              notes={portfolioNotes}
              folders={folders}
              selectedNoteId={selectedNoteId}
              selectedFolderId={selectedFolderId}
              onSelectNote={handleSelectNote}
              onSelectFolder={handleSelectFolder}
              isMobile={isMobile}
            />
          </div>

          {/* Main Content Column */}
          <div className="flex-1 h-full bg-apple-bgLight dark:bg-apple-bgDark relative z-10 w-full min-w-0">
            <MainContent
              note={selectedNote}
              onBack={handleBack}
              isMobile={isMobile}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
