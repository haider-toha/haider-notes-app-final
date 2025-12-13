
import React, { useMemo, useState } from 'react';
import { Note } from '../types';
import { Search } from 'lucide-react';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectedNoteId, onSelectNote }) => {
  const [query, setQuery] = useState('');

  // Format date for sidebar: "10:42 AM", "Yesterday", or "1/5/25"
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else if (isYesterday) {
      return 'yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
    }
  };

  const getPreview = (content: string) => {
    // Strip markdown chars for preview
    return content.replace(/[*#`-]/g, '').replace(/\n/g, ' ').substring(0, 100);
  };

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.category ?? '').toLowerCase().includes(q)
      );
    });
  }, [notes, query]);

  return (
    <div className="flex flex-col h-full border-r border-black/10 dark:border-white/10 bg-apple-sidebarLight/75 dark:bg-apple-sidebarDark/70 backdrop-blur-xl">
      {/* Header + Search */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 bg-apple-sidebarLight/70 dark:bg-apple-sidebarDark/60 backdrop-blur-xl select-none">
        <div className="flex items-baseline justify-between px-1 mb-2">
          <div className="text-[22px] font-bold tracking-[-0.02em] text-black dark:text-white">
            notes
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
        <div className="px-2 py-2 mb-1 text-[11px] font-bold text-apple-textGray uppercase tracking-wider flex justify-between items-center select-none">
          <span>iCloud</span>
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="px-3 py-8 text-center text-[13px] text-apple-textGray select-none">
            no results
          </div>
        ) : filteredNotes.map((note) => {
          const isSelected = selectedNoteId === note.id;
          const previewText = getPreview(note.content);
          const dateText = formatDate(note.created_at);

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`
                group flex flex-col px-3 py-2.5 rounded-[12px] cursor-pointer transition-colors duration-75 relative select-none
                ${isSelected
                  ? 'bg-black/10 dark:bg-white/12'
                  : 'hover:bg-black/5 dark:hover:bg-white/8'
                }
              `}
            >
              {/* left accent like Apple Notes selection */}
              <div
                className={`
                  absolute left-1 top-2 bottom-2 w-[3px] rounded-full
                  ${isSelected ? 'bg-apple-yellow' : 'bg-transparent'}
                `}
              />

              <div className={`font-semibold text-[15px] mb-0.5 leading-tight truncate ${isSelected ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}>
                {note.title}
              </div>
              <div className="flex gap-2 text-[13px] leading-snug w-full">
                <span className={`${isSelected ? 'text-black/60 dark:text-white/60' : 'text-black/50 dark:text-white/50'} whitespace-nowrap flex-shrink-0`}>
                  {dateText}
                </span>
                <span className={`truncate ${isSelected ? 'text-black/55 dark:text-white/55' : 'text-apple-textGray'}`}>
                  {previewText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
