import React, { useEffect, useRef } from 'react';
import { Note } from '../types';
import { ChevronLeft, Share, PenSquare } from 'lucide-react';

interface MainContentProps {
  note: Note | undefined;
  onBack: () => void;
  isMobile: boolean;
  onShare: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ note, onBack, isMobile, onShare }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when note changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [note?.id]);

  if (!note) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-apple-bgLight dark:bg-apple-bgDark text-apple-textGray">
        <div className="opacity-20 mb-4">
          <PenSquare className="w-16 h-16" />
        </div>
        <span className="text-xl font-medium">no selection</span>
      </div>
    );
  }

  // Format full date for the header: "january 20, 2025 at 9:00 am"
  const dateObj = new Date(note.created_at);
  const datePart = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timePart = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const fullDate = `${datePart} at ${timePart}`.toLowerCase();

  // Helper to render content with formatting
  // Refined Content Renderer
  const renderLine = (line: string, index: number) => {
      const isBullet = line.trim().startsWith('- ');
      const content = isBullet ? line.trim().substring(2) : line;
      
      const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);

      return (
          <div key={index} className={`min-h-[1.5em] ${isBullet ? 'pl-4 flex relative' : ''}`}>
              {isBullet && <span className="mr-2 absolute left-0">•</span>}
              <span className="break-words w-full">
                  {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                      }
                      if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.startsWith('**')) {
                           return <em key={j} className="italic text-apple-textGray">{part.slice(1, -1)}</em>;
                      }
                      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                          const match = part.match(/\[(.*?)\]\((.*?)\)/);
                          if (match) {
                              return (
                                  <a 
                                      key={j} 
                                      href={match[2]} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-apple-yellow hover:underline cursor-pointer"
                                  >
                                      {match[1]}
                                  </a>
                              );
                          }
                      }
                      return <span key={j}>{part}</span>;
                  })}
              </span>
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-apple-bgLight dark:bg-apple-bgDark relative">
      {/* Mobile Toolbar (Visible only on mobile) */}
      {isMobile && (
        <div className="h-12 flex items-center justify-between px-2 shrink-0 bg-apple-bgLight/80 dark:bg-apple-bgDark/70 backdrop-blur-xl border-b border-black/5 dark:border-white/10 z-20">
          <button 
            onClick={onBack}
            className="flex items-center text-apple-yellow hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-7 h-7" />
            <span className="text-[17px] font-normal leading-none -ml-1 pb-0.5">notes</span>
          </button>
          
          <div className="flex items-center space-x-4 pr-2">
             <button 
               onClick={onShare}
               className="text-apple-yellow hover:opacity-70"
             >
               <Share className="w-5 h-5" />
             </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar"
      >
        <div className="max-w-[760px] mx-auto px-6 md:px-12 py-8 min-h-full">
          {/* Date Header */}
          <div className="text-center mb-6 select-none">
            <span className="text-[13px] text-apple-textGray font-semibold tracking-[-0.01em]">
              {fullDate}
            </span>
          </div>

          {/* Note Title */}
          <h1 className="text-[34px] md:text-[34px] font-bold tracking-[-0.03em] text-black dark:text-white mb-6 leading-[1.12] outline-none">
            {note.title}
          </h1>

          {/* Note Body */}
          <div className="text-[17px] md:text-[17px] text-black/90 dark:text-white/90 leading-[1.65] font-sans outline-none space-y-1.5">
            {note.content.split('\n').map((line, i) => renderLine(line, i))}
          </div>
          
          <div className="h-24" /> {/* Bottom spacer */}
        </div>
      </div>
    </div>
  );
};

export default MainContent;