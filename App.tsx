import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { portfolioNotes } from './constants';
import { Theme } from './types';
import { Moon, Sun, PanelLeft, Share } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  // State - on mobile, start with no selection; on desktop, select first note
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    // Check if mobile on initial load
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return null;
    }
    return portfolioNotes[0].id;
  });
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>('light');

  // Determine mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      if (mobile) {
        // On mobile, show sidebar if no note selected
        if (!selectedNoteId) {
          setShowSidebar(true);
        }
      } else {
        // Switching from mobile to desktop
        setShowSidebar(true);
        // If no note selected on desktop, select the first one
        if (!selectedNoteId && wasMobile) {
          setSelectedNoteId(portfolioNotes[0].id);
        }
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedNoteId, isMobile]);

  // Theme Toggle Effect
  useEffect(() => {
    // Check system preference initially
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBack = () => {
    setShowSidebar(true);
    // On mobile, unselect the note when going back to sidebar
    if (isMobile) {
      setSelectedNoteId(null);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleDesktopSidebar = () => {
    if (!isMobile) setShowSidebar(prev => !prev);
  };

  const selectedNote = portfolioNotes.find(n => n.id === selectedNoteId);

  const handleShare = async () => {
    if (!selectedNote) return;

    const shareData = {
      title: selectedNote.title,
      text: selectedNote.content,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${selectedNote.title}\n\n${selectedNote.content}`);
        alert('note copied to clipboard');
      }
    } catch (err) {
      console.error('error sharing:', err);
    }
  };

  return (
    <>
    <Analytics />
    <div className="h-screen w-screen flex flex-col bg-apple-bgLight dark:bg-black overflow-hidden font-sans transition-colors duration-200">
      
      {/* Desktop Toolbar (Simulating the Mac App Toolbar) */}
      {!isMobile && (
        <div className="h-12 bg-apple-sidebarLight/70 dark:bg-apple-sidebarDark/60 backdrop-blur-xl flex items-center justify-between px-4 border-b border-black/10 dark:border-white/10 shrink-0 z-20 select-none">
          <div className="flex items-center space-x-5">
            <button 
              onClick={toggleDesktopSidebar}
              className={`hover:opacity-70 transition-opacity ${!showSidebar ? 'text-apple-textGray' : 'text-apple-yellow'}`}
              title="toggle sidebar"
            >
              <PanelLeft className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
          
          {/* Theme Toggle in center-right area for accessibility/demo purposes */}
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
                {theme === 'light' ? <Moon className="w-4 h-4 stroke-[2]" /> : <Sun className="w-4 h-4 stroke-[2]" />}
             </button>
          </div>
        </div>
      )}

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Column */}
        <div 
          className={`
            ${isMobile ? 'absolute inset-0 z-30' : 'relative'}
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
            w-full md:w-[300px] lg:w-[320px] shrink-0 h-full
            bg-apple-sidebarLight dark:bg-apple-sidebarDark
            border-r border-apple-separatorLight dark:border-apple-separatorDark
            ${!showSidebar && !isMobile ? 'w-0' : ''} 
          `}
          style={!showSidebar && !isMobile ? { width: 0, border: 'none' } : {}}
        >
          <Sidebar 
            notes={portfolioNotes} 
            selectedNoteId={selectedNoteId} 
            onSelectNote={handleSelectNote}
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