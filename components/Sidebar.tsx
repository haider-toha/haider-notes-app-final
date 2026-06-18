import React, { useMemo, useState, useEffect } from "react";
import { Note, Folder } from "../types";
import {
  Search,
  ChevronRight,
  Cloud,
  FolderOpen,
  FileText,
  Bookmark,
  BookOpen,
  PenLine,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  notes: Note[];
  folders: Folder[];
  selectedNoteId: string | null;
  selectedFolderId: string;
  onSelectNote: (id: string) => void;
  onSelectFolder: (folderId: string) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  folders,
  selectedNoteId,
  selectedFolderId,
  onSelectNote,
  onSelectFolder,
  isMobile = false,
}) => {
  const [query, setQuery] = useState("");
  // On mobile, show notes list if a note is selected, otherwise show folders
  const [showNotesList, setShowNotesList] = useState(() => {
    if (!isMobile) return true;
    return !!selectedNoteId;
  });

  // Sync showNotesList when selectedNoteId changes on mobile
  useEffect(() => {
    if (isMobile && selectedNoteId) {
      setShowNotesList(true);
    }
  }, [isMobile, selectedNoteId]);

  // Format date for sidebar
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return "yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });
    }
  };

  // Build a clean one-line preview: drop images, keep link text, strip markdown
  // markers — but preserve hyphens/apostrophes so words aren't mangled.
  const getPreview = (content: string) => {
    return content
      .replace(/!\[.*?\]\(.*?\)/g, "") // drop images
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // keep link text only
      .replace(/```[\s\S]*?```/g, "") // drop fenced code blocks
      .replace(/^\s*#{1,6}\s+/gm, "") // strip heading markers
      .replace(/^\s*[-*]\s+/gm, "") // strip leading bullet markers
      .replace(/[*_`>#|]/g, "") // strip inline markers (NOT hyphens)
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 120);
  };

  // Get icon for folder
  const getFolderIcon = (iconType?: string) => {
    switch (iconType) {
      case "cloud":
        return <Cloud className="w-[18px] h-[18px]" />;
      case "blog":
        return <PenLine className="w-[18px] h-[18px]" />;
      case "bookmarks":
        return <Bookmark className="w-[18px] h-[18px]" />;
      case "reflections":
        return <BookOpen className="w-[18px] h-[18px]" />;
      case "notes":
        return <FileText className="w-[18px] h-[18px]" />;
      default:
        return <FolderOpen className="w-[18px] h-[18px]" />;
    }
  };

  // Get note count for a folder
  const getFolderCount = (folderId: string) => {
    if (folderId === "all") return notes.length;
    return notes.filter((n) => n.folder === folderId).length;
  };

  // Filter notes by selected folder and search query, then sort by date (newest first)
  const filteredNotes = useMemo(() => {
    let filtered =
      selectedFolderId === "all"
        ? notes
        : notes.filter((n) => n.folder === selectedFolderId);

    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((n) => {
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.category ?? "").toLowerCase().includes(q)
        );
      });
    }

    // Sort by created_at descending (newest first)
    return [...filtered].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [notes, selectedFolderId, query]);

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  // Mobile: Show folder list or notes list
  const handleFolderClick = (folderId: string) => {
    onSelectFolder(folderId);
    if (isMobile) {
      setShowNotesList(true);
    }
  };

  const handleBackToFolders = () => {
    setShowNotesList(false);
  };

  // Folders List View.
  // NOTE: invoked as a function (renderFoldersList()), never rendered as
  // <FoldersList />. A component defined inside another component gets a fresh
  // identity on every render, so rendering it as a JSX element makes React
  // remount it each time the parent re-renders — which resets the list's scroll
  // position to the top (and drops search-input focus). Calling it as a plain
  // function inlines its JSX and keeps the DOM stable.
  const renderFoldersList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-2 bg-apple-sidebarLight dark:bg-apple-sidebarDark select-none">
        <div className="flex items-baseline justify-between px-1 mb-1">
          <div className="text-[22px] font-bold tracking-[-0.022em] text-black dark:text-white">
            folders
          </div>
        </div>
      </div>

      {/* Folders List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2.5 pb-4">
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id && !isMobile;
          const count = getFolderCount(folder.id);

          return (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder.id)}
              className={`
                group flex items-center justify-between px-2.5 py-[7px] rounded-md cursor-pointer transition-colors duration-150 select-none mb-px
                ${
                  isSelected
                    ? "bg-apple-selectionLight dark:bg-apple-selectionDark"
                    : "hover:bg-apple-hoverLight dark:hover:bg-apple-hoverDark"
                }
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className={`flex-shrink-0 ${isSelected ? "text-black/80" : "text-apple-yellow"}`}
                >
                  {getFolderIcon(folder.icon)}
                </span>
                <span
                  className={`text-[15px] truncate ${isSelected ? "font-semibold text-black" : "font-medium text-black dark:text-white"}`}
                >
                  {folder.name.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                <span
                  className={`text-[13px] tabular-nums ${isSelected ? "text-black/55" : "text-apple-textGray"}`}
                >
                  {count}
                </span>
                {isMobile && (
                  <ChevronRight
                    className={`w-4 h-4 ${isSelected ? "text-black/45" : "text-apple-textGray/70"}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Notes List View (invoked as a function — see note above renderFoldersList)
  const renderNotesList = () => (
    <div className="flex flex-col h-full">
      {/* Header + Search */}
      <div className="sticky top-0 z-10 px-2.5 pt-4 pb-2 bg-apple-sidebarLight dark:bg-apple-sidebarDark select-none">
        {/* Back button on mobile */}
        {isMobile && (
          <button
            onClick={handleBackToFolders}
            aria-label="Back to folders"
            className="flex items-center text-apple-yellow hover:opacity-70 transition-opacity mb-1.5 -ml-1.5"
          >
            <ChevronLeft className="w-[22px] h-[22px]" />
            <span className="text-[17px] font-normal -ml-0.5">folders</span>
          </button>
        )}

        <div className="flex items-baseline justify-between px-1 mb-2">
          <div className="text-[22px] font-bold tracking-[-0.022em] text-black dark:text-white truncate">
            {selectedFolder?.name.toLowerCase() || "notes"}
          </div>
          <div className="text-[12px] font-semibold text-apple-textGray tabular-nums ml-2 flex-shrink-0">
            {filteredNotes.length}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="h-[15px] w-[15px] text-apple-textGray" />
          </div>
          <input
            type="text"
            placeholder="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-[30px] pr-3 py-[6px] bg-black/[0.06] dark:bg-white/[0.09] rounded-lg text-[13px] text-gray-900 dark:text-white placeholder-apple-textGray focus:outline-none focus:ring-0 transition-colors cursor-text"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2.5 pb-4">
        {filteredNotes.length === 0 ? (
          <div className="px-3 py-10 text-center text-[13px] text-apple-textGray select-none">
            no notes
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isSelected = selectedNoteId === note.id;
            const previewText = getPreview(note.content);
            const dateText = formatDate(note.created_at);

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`
                group flex flex-col px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-150 relative select-none mb-px
                ${
                  isSelected
                    ? "bg-apple-selectionLight dark:bg-apple-selectionDark"
                    : "hover:bg-apple-hoverLight dark:hover:bg-apple-hoverDark"
                }
              `}
              >
                <div
                  className={`font-semibold text-[15px] mb-0.5 leading-tight truncate ${isSelected ? "text-black" : "text-black dark:text-white"}`}
                >
                  {note.title}
                </div>
                <div className="flex gap-1.5 text-[13px] leading-snug w-full">
                  <span
                    className={`whitespace-nowrap flex-shrink-0 ${isSelected ? "text-black/65" : "text-black/55 dark:text-white/55"}`}
                  >
                    {dateText}
                  </span>
                  <span
                    className={`truncate ${isSelected ? "text-black/55" : "text-apple-textGray"}`}
                  >
                    {previewText || "no additional text"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Desktop: Show both folders and notes side by side (or just notes with folder indicator)
  // Mobile: Show folders OR notes based on state
  if (isMobile) {
    return (
      <div className="flex flex-col h-full border-r border-black/[0.08] dark:border-white/[0.08] bg-apple-sidebarLight dark:bg-apple-sidebarDark">
        {showNotesList ? renderNotesList() : renderFoldersList()}
      </div>
    );
  }

  // Desktop: Two-column layout
  return (
    <div className="flex h-full border-r border-black/[0.08] dark:border-white/[0.08] bg-apple-sidebarLight dark:bg-apple-sidebarDark">
      {/* Folders Column */}
      <div className="w-[200px] lg:w-[220px] flex-shrink-0 overflow-hidden border-r border-black/[0.08] dark:border-white/[0.08]">
        {renderFoldersList()}
      </div>

      {/* Notes Column */}
      <div className="flex-1 min-w-0">{renderNotesList()}</div>
    </div>
  );
};

export default Sidebar;
