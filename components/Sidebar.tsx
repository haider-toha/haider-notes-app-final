
import React from 'react';
import { Note } from '../types';
import { Search } from 'lucide-react';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectedNoteId, onSelectNote, isMobile }) => {
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

  return (
    <div className="flex flex-col h-full bg-apple-sidebarLight dark:bg-apple-sidebarDark border-r border-apple-separatorLight dark:border-apple-separatorDark select-none">
      {/* Search Bar Area */}
      <div className="px-4 py-3 sticky top-0 z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-apple-textGray" />
          </div>
          <input
            type="text"
            placeholder="search"
            disabled
            className="w-full pl-9 pr-4 py-1.5 bg-apple-searchLight dark:bg-apple-searchDark rounded-lg text-[15px] text-gray-900 dark:text-white placeholder-apple-textGray focus:outline-none focus:ring-0 transition-colors cursor-default"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4 space-y-1">
        <div className="px-3 py-1 mb-1 text-[11px] font-bold text-apple-textGray uppercase tracking-wider flex justify-between items-center">
          <span>iCloud</span>
        </div>
        
        {notes.map((note) => {
          const isSelected = selectedNoteId === note.id;
          const previewText = getPreview(note.content);
          const dateText = formatDate(note.created_at);

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`
                group flex flex-col p-3 rounded-[10px] cursor-pointer transition-all duration-75 relative
                ${isSelected 
                  ? 'bg-apple-selectionLight dark:bg-apple-selectionDark shadow-[0_1px_2px_rgba(0,0,0,0.1)]' 
                  : 'hover:bg-black/5 dark:hover:bg-white/10 bg-white dark:bg-[#2C2C2E]'
                }
              `}
            >
              <div className={`font-bold text-[16px] mb-0.5 leading-tight truncate ${isSelected ? 'text-white' : 'text-black dark:text-white'}`}>
                {note.title}
              </div>
              <div className="flex gap-2 text-[14px] leading-tight w-full">
                <span className={`${isSelected ? 'text-white/90' : 'text-black/50 dark:text-white/50'} whitespace-nowrap flex-shrink-0`}>
                  {dateText}
                </span>
                <span className={`truncate ${isSelected ? 'text-white/80' : 'text-apple-textGray'}`}>
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
