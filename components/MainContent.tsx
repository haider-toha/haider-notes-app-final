import React, { useEffect, useRef, useState, useCallback } from "react";
import { Note, Theme } from "../types";
import {
  ChevronLeft,
  Share,
  PenSquare,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Moon,
  Sun,
} from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import mermaid from "mermaid";

// Initialize mermaid (theme is set dynamically in MermaidDiagram component)
mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
});

interface MainContentProps {
  note: Note | undefined;
  onBack: () => void;
  isMobile: boolean;
  onShare: () => void;
  theme?: Theme;
  onToggleTheme?: () => void;
}

/** Canvas logical sizes from each simulation HTML file — keeps iframe height tight. */
const IFRAME_ASPECT_RATIOS: Record<string, number> = {
  "/dynamical_systems/rolling_system_minimal.html": 900 / 420,
  "/dynamical_systems/gear-twin-crank_minimal.html": 940 / 660,
  "/dynamical_systems/cam-skater_minimal.html": 940 / 600,
};

// Diagram Modal Component for full-screen view with pinch/scroll zoom
const DiagramModal: React.FC<{
  svg: string;
  onClose: () => void;
}> = ({ svg, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number | null>(null);

  // Keyboard (Esc to close) + lock body scroll while the modal is open.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Wheel-zoom needs a NON-passive listener: React 19 attaches onWheel passively,
  // so preventDefault() there is ignored and the page scrolls behind the modal.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.min(Math.max(prev + delta, 0.25), 5));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Handle touch events for pinch zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = distance;
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (distance - lastTouchDistance.current) * 0.01;
      setScale((prev) => Math.min(Math.max(prev + delta, 0.25), 5));
      lastTouchDistance.current = distance;
    } else if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null;
    setIsDragging(false);
  }, []);

  // Handle mouse drag for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset position and scale
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close button - positioned below the fixed header (h-12 = 48px) */}
      <button
        onClick={onClose}
        aria-label="Close diagram"
        className="absolute top-16 right-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        title="Close (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Zoom indicator */}
      <div className="absolute top-16 left-4 z-[110] text-white/50 text-sm bg-black/50 px-3 py-1.5 rounded-full">
        {Math.round(scale * 100)}%
      </div>

      {/* Reset button */}
      {(scale !== 1 || position.x !== 0 || position.y !== 0) && (
        <button
          onClick={handleReset}
          className="absolute top-16 left-20 z-[110] text-white/50 hover:text-white text-sm bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-full transition-colors"
        >
          Reset
        </button>
      )}

      {/* Diagram container */}
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
          className="transition-transform duration-75 [&_svg]:max-w-none [&_svg]:max-h-none"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] text-white/40 text-sm bg-black/50 px-4 py-2 rounded-full pointer-events-none">
        scroll to zoom • drag to pan • esc to close
      </div>
    </div>
  );
};

// Theme variables for Mermaid diagrams
const darkThemeVariables = {
  primaryColor: "#1a1a1a",
  primaryTextColor: "#ffffff",
  primaryBorderColor: "#333333",
  lineColor: "#444444",
  secondaryColor: "#2a2a2a",
  tertiaryColor: "#1a1a1a",
  background: "#0a0a0a",
  mainBkg: "#1a1a1a",
  secondBkg: "#2a2a2a",
  nodeBorder: "#444444",
  clusterBkg: "#1a1a1a",
  clusterBorder: "#333333",
  titleColor: "#ffffff",
  edgeLabelBackground: "#1a1a1a",
};

const lightThemeVariables = {
  primaryColor: "#f5f5f5",
  primaryTextColor: "#1a1a1a",
  primaryBorderColor: "#cccccc",
  lineColor: "#888888",
  secondaryColor: "#e8e8e8",
  tertiaryColor: "#f0f0f0",
  background: "#ffffff",
  mainBkg: "#f5f5f5",
  secondBkg: "#e8e8e8",
  nodeBorder: "#999999",
  clusterBkg: "#f8f8f8",
  clusterBorder: "#cccccc",
  titleColor: "#1a1a1a",
  edgeLabelBackground: "#ffffff",
};

// Mermaid renders against shared global state (a single sandbox + global config),
// so firing many renders at once — one per diagram on a page — makes them clobber
// each other and some silently produce no SVG. That's why diagrams vanished in
// light mode: unlike dark mode, light mode never triggered the second render pass
// (from the theme-class flip) that happened to mask the race. Serialize every
// render through one queue and give each a unique id so they can't collide.
let mermaidRenderChain: Promise<unknown> = Promise.resolve();
let mermaidRenderSeq = 0;

const renderMermaid = (chart: string, isDark: boolean): Promise<string> => {
  const run = mermaidRenderChain.then(async () => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      fontFamily: "inherit",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
      },
      themeVariables: isDark ? darkThemeVariables : lightThemeVariables,
    });
    const { svg } = await mermaid.render(
      `mermaid-render-${isDark ? "dark" : "light"}-${++mermaidRenderSeq}`,
      chart,
    );
    return svg;
  });
  // Keep the queue alive even if one render rejects, so a single failure
  // doesn't stall every diagram behind it.
  mermaidRenderChain = run.catch(() => {});
  return run;
};

// Mermaid Diagram Component
const MermaidDiagram: React.FC<{ chart: string; id: string; onExpand: (svg: string) => void }> = ({ chart, id, onExpand }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    renderMermaid(chart, isDark)
      .then((rendered) => {
        if (cancelled) return;
        setSvg(rendered);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram");
      });

    // If the diagram unmounts or re-renders (e.g. theme flip) before this render
    // resolves, drop the stale result so it can't overwrite a newer one.
    return () => {
      cancelled = true;
    };
  }, [chart, id, isDark]);

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 relative group"
    >
      {/* Expand button */}
      <button
        onClick={() => onExpand(svg)}
        className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Expand diagram"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
      {/* Diagram */}
      <div 
        className="flex justify-center overflow-x-auto cursor-pointer"
        onClick={() => onExpand(svg)}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};

// Image Modal Component for full-screen view
const ImageModal: React.FC<{
  src: string;
  alt: string;
  onClose: () => void;
}> = ({ src, alt, onClose }) => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5));

  // Esc to close + lock body scroll while open (parity with DiagramModal).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          aria-label="Zoom out"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          aria-label="Zoom in"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          aria-label="Close image"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `scale(${scale})` }}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-200"
      />

      {/* Caption */}
      {alt && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-full">
          {alt}
        </div>
      )}
    </div>
  );
};

const MainContent: React.FC<MainContentProps> = ({
  note,
  onBack,
  isMobile,
  onShare,
  theme,
  onToggleTheme,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [modalDiagram, setModalDiagram] = useState<string | null>(null);

  // Scroll to top when note changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [note?.id]);

  if (!note) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-apple-bgLight dark:bg-apple-bgDark text-apple-textGray select-none">
        <div className="opacity-15 mb-4">
          <PenSquare className="w-14 h-14 stroke-[1.5]" />
        </div>
        <span className="text-[17px] font-medium text-apple-textGray/80">
          no note selected
        </span>
      </div>
    );
  }

  // Format full date for the header
  const dateObj = new Date(note.created_at);
  const datePart = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const fullDate = `${datePart} at ${timePart}`.toLowerCase();

  // Calculate word count and reading time for blog posts
  const isBlogPost = note.folder === "blog";
  const calculateWordCount = (text: string): number => {
    // Remove markdown formatting, URLs and special characters
    const cleanText = text
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/\[.*?\]\(.*?\)/g, (match) => match.replace(/\[|\]|\(.*?\)/g, "")) // Keep link text only
      .replace(/\$\$[\s\S]*?\$\$/g, "") // Remove block math
      .replace(/\$[^$]+\$/g, "") // Remove inline math
      .replace(/\*\*/g, "") // Remove bold markers
      .replace(/\*/g, "") // Remove italic markers
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/---/g, "") // Remove horizontal rules
      .replace(/\|/g, " ") // Replace table pipes with spaces
      .replace(/[^\w\s]/g, " ") // Replace other special chars
      .trim();
    
    const words = cleanText.split(/\s+/).filter((word) => word.length > 0);
    return words.length;
  };

  const wordCount = calculateWordCount(note.content);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words per minute

  // Format word count with commas
  const formattedWordCount = wordCount.toLocaleString();

  // Check if content starts with the old hardcoded metadata line and strip it
  const metadataLineRegex = /^\*\*[a-z]+ \d{1,2}, \d{4} · \d+ min read · [\d,]+ words\*\*\n*/i;
  const contentWithoutMetadata = note.content.replace(metadataLineRegex, "");

  // Image click handler
  const handleImageClick = (src: string, alt: string) => {
    setModalImage({ src, alt });
  };

  // Render inline image
  const renderImage = (src: string, alt: string, key: string | number) => (
    <div
      key={key}
      className="my-4 cursor-pointer group"
      onClick={() => handleImageClick(src, alt)}
    >
      <div className="relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full max-w-full h-auto rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-[1.01]"
          onError={(e) => {
            // Fallback for broken images. Guard parentElement: the node may have
            // unmounted if the user navigated away before the load failed.
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.innerHTML = `
              <div class="flex items-center justify-center py-8 text-apple-textGray text-sm">
                <span>image could not be loaded</span>
              </div>
            `;
            }
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors rounded-xl pointer-events-none" />
      </div>
      {alt && (
        <p className="text-center text-[13px] text-apple-textGray mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  );

  // Split a "| a | b | c |" row into trimmed cells. Strip ONLY the outer pipes —
  // filtering every empty cell (the old behaviour) deletes intentionally-blank
  // interior cells and shifts every later column left, misaligning the table.
  const parseTableRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  // Helper to render markdown tables
  const renderTable = (tableLines: string[], startIndex: number) => {
    // Parse header row (defines the column count)
    const headerRow = parseTableRow(tableLines[0]);
    const colCount = headerRow.length;

    // Skip separator row (index 1). Parse data rows, padding/truncating each to
    // the header width so blank cells keep their column position.
    const dataRows = tableLines.slice(2).map((line) => {
      const cells = parseTableRow(line);
      while (cells.length < colCount) cells.push("");
      return cells.slice(0, colCount);
    });

    return (
      <div key={startIndex} className="my-4 overflow-x-auto">
        <table className="w-full border-collapse text-[14px] md:text-[15px]">
          <thead>
            <tr className="border-b border-black/20 dark:border-white/20">
              {headerRow.map((cell, i) => (
                <th
                  key={i}
                  className="text-left py-2 px-3 font-semibold text-black/80 dark:text-white/80"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-black/10 dark:border-white/10"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="py-2 px-3 text-black/70 dark:text-white/70"
                  >
                    {renderTextWithFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Check if a line is part of a markdown table
  const isTableRow = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith("|") && trimmed.endsWith("|");
  };

  const isTableSeparator = (line: string) => {
    const trimmed = line.trim();
    return /^\|[\s\-:|]+\|$/.test(trimmed);
  };

  // Helper to render code blocks
  const renderCodeBlock = (code: string, language: string, key: number) => {
    // Check if this is a mermaid diagram
    if (language === "mermaid") {
      return <MermaidDiagram key={key} chart={code} id={`diagram-${key}`} onExpand={setModalDiagram} />;
    }

    if (language === "iframe") {
      const src = code.trim();
      const aspectRatio = IFRAME_ASPECT_RATIOS[src] ?? 16 / 9;
      return (
        <div
          key={key}
          className="my-3 w-full overflow-hidden relative"
          style={{ aspectRatio }}
        >
          <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            style={{ border: "none", background: "transparent" }}
            allow="autoplay"
            title="simulation"
          />
        </div>
      );
    }

    // Regular code block
    return (
      <div key={key} className="my-4">
        <pre className="bg-black/5 dark:bg-white/5 rounded-lg p-4 overflow-x-auto">
          <code className="text-[13px] md:text-[14px] font-mono text-black/80 dark:text-white/80 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    );
  };

  // Content Renderer with image, table, and code block support
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check for code block start (```)
      if (line.trim().startsWith("```")) {
        const language = line.trim().slice(3).trim().toLowerCase();
        const codeLines: string[] = [];
        let j = i + 1;
        let closed = false;

        // Collect code block content until the closing ```
        while (j < lines.length) {
          if (lines[j].trim().startsWith("```")) {
            closed = true;
            break;
          }
          codeLines.push(lines[j]);
          j++;
        }

        // Guard: an unclosed fence shouldn't swallow the rest of the note. If we
        // hit EOF without a closing ```, render this line as text and move on.
        if (!closed) {
          elements.push(renderLine(line, i));
          i++;
          continue;
        }

        elements.push(renderCodeBlock(codeLines.join("\n"), language, i));
        i = j + 1; // Skip past the closing ```
        continue;
      }

      // Standalone block math: a line that is exactly "$$" opens a display-math
      // block that runs until the next line that is exactly "$$".
      if (line.trim() === "$$") {
        const mathLines: string[] = [];
        let j = i + 1;
        while (j < lines.length && lines[j].trim() !== "$$") {
          mathLines.push(lines[j]);
          j++;
        }
        if (j < lines.length) {
          elements.push(renderMath(mathLines.join("\n"), true, `blockmath-${i}`));
          i = j + 1;
          continue;
        }
        // No closing "$$": fall through and treat the line as ordinary text.
      }

      // Check for table start
      if (
        isTableRow(line) &&
        i + 1 < lines.length &&
        isTableSeparator(lines[i + 1])
      ) {
        // Collect all table lines
        const tableLines: string[] = [line];
        let j = i + 1;
        while (j < lines.length && isTableRow(lines[j])) {
          tableLines.push(lines[j]);
          j++;
        }
        elements.push(renderTable(tableLines, i));
        i = j;
        continue;
      }

      // Regular line rendering
      elements.push(renderLine(line, i));
      i++;
    }

    return elements;
  };

  // Content Renderer with image support
  const renderLine = (line: string, index: number) => {
    // Check for image markdown: ![alt](url)
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    const images: { alt: string; src: string; index: number }[] = [];
    let match;

    while ((match = imageRegex.exec(line)) !== null) {
      images.push({
        alt: match[1],
        src: match[2],
        index: match.index,
      });
    }

    // If the line is ONLY an image (common case)
    if (images.length === 1 && line.trim().match(/^!\[.*?\]\(.*?\)$/)) {
      return renderImage(images[0].src, images[0].alt, index);
    }

    // If line contains images mixed with text
    if (images.length > 0) {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      images.forEach((img, i) => {
        // Add text before image
        if (img.index > lastIndex) {
          const textBefore = line.slice(lastIndex, img.index);
          if (textBefore) {
            parts.push(
              <span key={`text-${i}`}>
                {renderTextWithFormatting(textBefore)}
              </span>,
            );
          }
        }
        // Add image
        parts.push(renderImage(img.src, img.alt, `img-${i}`));
        lastIndex = img.index + `![${img.alt}](${img.src})`.length;
      });

      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(
          <span key="text-end">
            {renderTextWithFormatting(line.slice(lastIndex))}
          </span>,
        );
      }

      return <div key={index}>{parts}</div>;
    }

    // ATX headings: "# " … "###### "
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const sizeByLevel = [
        "text-[27px] md:text-[31px]",
        "text-[20px] md:text-[21px]",
        "text-[18px] md:text-[19px]",
        "text-[17px]",
        "text-[16px]",
        "text-[15px]",
      ];
      return (
        <div
          key={index}
          className={`font-bold text-black dark:text-white tracking-[-0.015em] mt-4 mb-1 leading-snug ${sizeByLevel[level - 1]}`}
        >
          {renderTextWithFormatting(headingMatch[2])}
        </div>
      );
    }

    // Numbered list: "1. text", "2. text", … Cap at 3 digits so a paragraph that
    // happens to start with a 4-digit year ("2024. ...") isn't treated as a list.
    const orderedMatch = line.match(/^(\s*)(\d{1,3})\.\s+(.*)$/);
    if (orderedMatch) {
      return (
        <div key={index} className="pl-6 relative min-h-[1.5em]">
          <span className="absolute left-0 tabular-nums text-black/80 dark:text-white/80">
            {orderedMatch[2]}.
          </span>
          <span className="break-words">
            {renderTextWithFormatting(orderedMatch[3])}
          </span>
        </div>
      );
    }

    // Bulleted list: "- text"
    const isBullet = line.trim().startsWith("- ");
    const content = isBullet ? line.trim().substring(2) : line;

    return (
      <div
        key={index}
        className={`min-h-[1.5em] ${isBullet ? "pl-5 flex relative" : ""}`}
      >
        {isBullet && (
          <span className="absolute left-1 text-black/70 dark:text-white/70">
            •
          </span>
        )}
        <span className="break-words w-full">
          {renderTextWithFormatting(content)}
        </span>
      </div>
    );
  };

  // Helper to render LaTeX math
  const renderMath = (
    latex: string,
    displayMode: boolean,
    key: string | number,
  ): React.ReactNode => {
    try {
      const html = katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
      return (
        <span
          key={key}
          className={displayMode ? "block my-4 text-center overflow-x-auto" : ""}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      // If KaTeX fails, return the original text
      return <span key={key}>{displayMode ? `$$${latex}$$` : `$${latex}$`}</span>;
    }
  };

  // Helper to render text with inline code, bold, italic, links and math
  const renderTextWithFormatting = (content: string): React.ReactNode[] => {
    // Stash block math ($$...$$) behind a sentinel so the splitter treats it as
    // one opaque token.
    const contentWithBlockMath = content.replace(
      /\$\$([\s\S]*?)\$\$/g,
      (_, latex) => `\x00BLOCKMATH:${latex}\x00`,
    );

    // Split into tokens. Inline code comes first so backticked spans are never
    // re-parsed as bold/italic/etc. No regex lookbehind (older Safari support);
    // space-padding is validated in the handlers below.
    const segments = contentWithBlockMath.split(
      /(\x00BLOCKMATH:[\s\S]*?\x00|`[^`\n]+`|\$[^$\n]+?\$|\*\*[^\n]*?\*\*|\*[^*\n]+?\*|\[.*?\]\(.*?\))/g,
    );

    // True when s has no leading/trailing whitespace just inside the delimiters —
    // used to reject prose like "$5 to $10" or "a * b *" that isn't really math/italic.
    const tight = (s: string) => s.length > 0 && !/^\s|\s$/.test(s);

    return segments.map((part, j) => {
      // Block math
      if (part.startsWith("\x00BLOCKMATH:") && part.endsWith("\x00")) {
        return renderMath(part.slice(11, -1), true, `block-math-${j}`);
      }

      // Inline code `…`
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={j}
            className="px-1.5 py-0.5 mx-px rounded-md bg-black/[0.07] dark:bg-white/[0.1] font-mono text-[0.85em] text-black/85 dark:text-white/85"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Inline math $…$ (not $$…$$, and not a prose dollar amount)
      if (
        part.startsWith("$") &&
        part.endsWith("$") &&
        !part.startsWith("$$") &&
        part.length > 2
      ) {
        const latex = part.slice(1, -1);
        if (tight(latex)) return renderMath(latex, false, `inline-math-${j}`);
        return <span key={j}>{part}</span>;
      }

      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={j} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (
        part.startsWith("*") &&
        part.endsWith("*") &&
        part.length > 2 &&
        !part.startsWith("**")
      ) {
        const inner = part.slice(1, -1);
        if (tight(inner)) {
          return (
            <em key={j} className="italic text-apple-textGray">
              {inner}
            </em>
          );
        }
        return <span key={j}>{part}</span>;
      }
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          // Only http(s) links open in a new tab; mailto:/relative open in place.
          const isExternal = /^https?:\/\//i.test(linkMatch[2]);
          return (
            <a
              key={j}
              href={linkMatch[2]}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-apple-yellow hover:underline cursor-pointer"
            >
              {linkMatch[1]}
            </a>
          );
        }
      }
      return <span key={j}>{part}</span>;
    });
  };

  return (
    <>
      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}

      {/* Diagram Modal */}
      {modalDiagram && (
        <DiagramModal
          svg={modalDiagram}
          onClose={() => setModalDiagram(null)}
        />
      )}

      <div className="flex flex-col h-full bg-apple-bgLight dark:bg-apple-bgDark relative">
        {/* Mobile Toolbar */}
        {isMobile && (
          <div className="h-12 flex items-center justify-between px-2 shrink-0 bg-apple-bgLight/80 dark:bg-apple-bgDark/70 backdrop-blur-xl border-b border-black/5 dark:border-white/10 z-20">
            <button
              onClick={onBack}
              aria-label="Back to notes"
              className="flex items-center text-apple-yellow hover:opacity-70 transition-opacity"
            >
              <ChevronLeft className="w-7 h-7" />
              <span className="text-[17px] font-normal leading-none -ml-1 pb-0.5">
                notes
              </span>
            </button>

            <div className="flex items-center space-x-4 pr-2">
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  aria-label="Toggle dark mode"
                  className="text-apple-yellow hover:opacity-70"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>
              )}
              <button
                onClick={onShare}
                aria-label="Share note"
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
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="max-w-[720px] mx-auto px-4 sm:px-6 md:px-12 py-5 md:py-7 min-h-full">
            {/* Date Header — centered, gray, regular weight (Apple Notes) */}
            <div className="text-center mb-3 md:mb-5 select-none">
              <span className="text-[12px] md:text-[13px] text-apple-textGray tracking-[-0.005em]">
                {fullDate}
              </span>
            </div>
            {/* Note Title */}
            <h1 className="text-[27px] md:text-[31px] font-bold tracking-[-0.025em] text-black dark:text-white mb-3 md:mb-5 leading-[1.14] outline-none">
              {note.title}
            </h1>
            {/* Blog metadata - dynamic word count */}
            {isBlogPost && (
              <div className="text-[14px] md:text-[15px] text-apple-textGray mb-6 font-medium">
                {datePart.toLowerCase()} · {readingTime} min read · {formattedWordCount} words
              </div>
            )}
            {/* Note Body */}
            <div className="text-[16px] md:text-[17px] text-black/90 dark:text-white/90 leading-[1.65] font-sans outline-none space-y-1.5">
              {renderContent(contentWithoutMetadata)}
            </div>
            <div className="h-16 md:h-24" /> {/* Bottom spacer */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContent;
