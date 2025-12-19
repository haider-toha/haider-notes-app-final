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

  const getPreview = (content: string) => {
    // Strip markdown chars and images for preview
    return content
      .replace(/!\[.*?\]\(.*?\)/g, "[image]")
      .replace(/[*#`-]/g, "")
      .replace(/\n/g, " ")
      .substring(0, 100);
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
    return [...filtered].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

  // Folders List View
  const FoldersList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 bg-apple-sidebarLight/70 dark:bg-apple-sidebarDark/60 backdrop-blur-xl select-none">
        <div className="flex items-baseline justify-between px-1 mb-2">
          <div className="text-[22px] font-bold tracking-[-0.02em] text-black dark:text-white">
            folders
          </div>
        </div>
      </div>

      {/* Folders List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4">
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id && !isMobile;
          const count = getFolderCount(folder.id);

          return (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder.id)}
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-200 ease-out select-none mb-0.5
                ${
                  isSelected
                    ? "bg-[#A69050] dark:bg-[#998542]"
                    : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                }
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className={`flex-shrink-0 ${isSelected ? "text-white" : "text-apple-yellow"}`}
                >
                  {getFolderIcon(folder.icon)}
                </span>
                <span
                  className={`font-medium text-[15px] truncate ${isSelected ? "text-white" : "text-black dark:text-white"}`}
                >
                  {folder.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                <span
                  className={`text-[13px] ${isSelected ? "text-white/70" : "text-apple-textGray"}`}
                >
                  {count}
                </span>
                {isMobile && (
                  <ChevronRight
                    className={`w-4 h-4 ${isSelected ? "text-white/70" : "text-apple-textGray"}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Notes List View
  const NotesList = () => (
    <div className="flex flex-col h-full">
      {/* Header + Search */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 bg-apple-sidebarLight/70 dark:bg-apple-sidebarDark/60 backdrop-blur-xl select-none">
        {/* Back button on mobile */}
        {isMobile && (
          <button
            onClick={handleBackToFolders}
            className="flex items-center text-apple-yellow hover:opacity-70 transition-opacity mb-2 -ml-1"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-[15px] font-normal">folders</span>
          </button>
        )}

        <div className="flex items-baseline justify-between px-1 mb-2">
          <div className="text-[22px] font-bold tracking-[-0.02em] text-black dark:text-white">
            {selectedFolder?.name.toLowerCase() || "notes"}
          </div>
          <div className="text-[12px] font-semibold text-apple-textGray">
            {filteredNotes.length}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-apple-textGray" />
          </div>
          <input
            type="text"
            placeholder="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/55 dark:bg-white/10 rounded-[10px] text-[15px] text-gray-900 dark:text-white placeholder-apple-textGray focus:outline-none focus:ring-0 transition-colors cursor-text shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4 space-y-0.5">
        {filteredNotes.length === 0 ? (
          <div className="px-3 py-8 text-center text-[13px] text-apple-textGray select-none">
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
                group flex flex-col px-3.5 py-2.5 rounded-[10px] cursor-pointer transition-all duration-200 ease-out relative select-none
                ${
                  isSelected
                    ? "bg-[#A69050] dark:bg-[#998542]"
                    : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                }
              `}
              >
                <div
                  className={`font-semibold text-[15px] mb-0.5 leading-tight truncate ${isSelected ? "text-white" : "text-black dark:text-white"}`}
                >
                  {note.title}
                </div>
                <div className="flex gap-2 text-[13px] leading-snug w-full">
                  <span
                    className={`${isSelected ? "text-white/70" : "text-black/50 dark:text-white/50"} whitespace-nowrap flex-shrink-0`}
                  >
                    {dateText}
                  </span>
                  <span
                    className={`truncate ${isSelected ? "text-white/60" : "text-apple-textGray"}`}
                  >
                    {previewText}
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
      <div className="flex flex-col h-full border-r border-black/10 dark:border-white/10 bg-apple-sidebarLight/75 dark:bg-apple-sidebarDark/70 backdrop-blur-xl">
        {showNotesList ? <NotesList /> : <FoldersList />}
      </div>
    );
  }

  // Desktop: Two-column layout
  return (
    <div className="flex h-full border-r border-black/10 dark:border-white/10 bg-apple-sidebarLight/75 dark:bg-apple-sidebarDark/70 backdrop-blur-xl">
      {/* Folders Column */}
      <div className="w-[180px] lg:w-[200px] border-r border-black/5 dark:border-white/5 flex-shrink-0 overflow-hidden">
        <FoldersList />
      </div>

      {/* Notes Column */}
      <div className="flex-1 min-w-0">
        <NotesList />
      </div>
    </div>
  );
};

export default Sidebar;
