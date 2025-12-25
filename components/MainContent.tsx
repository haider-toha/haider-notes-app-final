import React, { useEffect, useRef, useState, useCallback } from "react";
import { Note } from "../types";
import {
  ChevronLeft,
  Share,
  PenSquare,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import mermaid from "mermaid";

// Initialize mermaid with dark/light theme support
mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "inherit",
});

interface MainContentProps {
  note: Note | undefined;
  onBack: () => void;
  isMobile: boolean;
  onShare: () => void;
}

// Mermaid Diagram Component
const MermaidDiagram: React.FC<{ chart: string; id: string }> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;
      
      try {
        // Check if dark mode is active
        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          securityLevel: "loose",
          fontFamily: "inherit",
          flowchart: {
            htmlLabels: true,
            curve: "basis",
          },
        });

        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram");
      }
    };

    renderDiagram();
  }, [chart, id]);

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
      className="my-6 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
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
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
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
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

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
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.parentElement!.innerHTML = `
              <div class="flex items-center justify-center py-8 text-apple-textGray text-sm">
                <span>image could not be loaded</span>
              </div>
            `;
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

  // Helper to render markdown tables
  const renderTable = (tableLines: string[], startIndex: number) => {
    // Parse header row
    const headerRow = tableLines[0]
      .split("|")
      .filter((cell) => cell.trim() !== "")
      .map((cell) => cell.trim());

    // Skip separator row (index 1)

    // Parse data rows
    const dataRows = tableLines.slice(2).map((line) =>
      line
        .split("|")
        .filter((cell) => cell.trim() !== "")
        .map((cell) => cell.trim()),
    );

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
      return <MermaidDiagram key={key} chart={code} id={`diagram-${key}`} />;
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
        
        // Collect code block content until closing ```
        while (j < lines.length && !lines[j].trim().startsWith("```")) {
          codeLines.push(lines[j]);
          j++;
        }
        
        const code = codeLines.join("\n");
        elements.push(renderCodeBlock(code, language, i));
        i = j + 1; // Skip past the closing ```
        continue;
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

    // Regular line without images
    const isBullet = line.trim().startsWith("- ");
    const content = isBullet ? line.trim().substring(2) : line;

    return (
      <div
        key={index}
        className={`min-h-[1.5em] ${isBullet ? "pl-4 flex relative" : ""}`}
      >
        {isBullet && <span className="mr-2 absolute left-0">•</span>}
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

  // Helper to render text with bold, italic, links and math
  const renderTextWithFormatting = (content: string): React.ReactNode[] => {
    // First, handle block math ($$...$$)
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    // Check for block math
    const contentWithBlockMath = content.replace(
      blockMathRegex,
      (_, latex) => `\x00BLOCKMATH:${latex}\x00`,
    );

    // Split by inline math and other formatting
    const segments = contentWithBlockMath.split(
      /(\x00BLOCKMATH:[\s\S]*?\x00|\$[^$\n]+\$|\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g,
    );

    return segments.map((part, j) => {
      // Block math
      if (part.startsWith("\x00BLOCKMATH:") && part.endsWith("\x00")) {
        const latex = part.slice(11, -1);
        return renderMath(latex, true, `block-math-${j}`);
      }

      // Inline math ($...$) - but not block math ($$...$$)
      if (
        part.startsWith("$") &&
        part.endsWith("$") &&
        !part.startsWith("$$") &&
        part.length > 2
      ) {
        const latex = part.slice(1, -1);
        return renderMath(latex, false, `inline-math-${j}`);
      }

      if (part.startsWith("**") && part.endsWith("**")) {
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
        return (
          <em key={j} className="italic text-apple-textGray">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
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

      <div className="flex flex-col h-full bg-apple-bgLight dark:bg-apple-bgDark relative">
        {/* Mobile Toolbar */}
        {isMobile && (
          <div className="h-12 flex items-center justify-between px-2 shrink-0 bg-apple-bgLight/80 dark:bg-apple-bgDark/70 backdrop-blur-xl border-b border-black/5 dark:border-white/10 z-20">
            <button
              onClick={onBack}
              className="flex items-center text-apple-yellow hover:opacity-70 transition-opacity"
            >
              <ChevronLeft className="w-7 h-7" />
              <span className="text-[17px] font-normal leading-none -ml-1 pb-0.5">
                notes
              </span>
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
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8 min-h-full">
            {/* Date Header */}
            <div className="text-center mb-4 md:mb-6 select-none">
              <span className="text-[12px] md:text-[13px] text-apple-textGray font-semibold tracking-[-0.01em]">
                {fullDate}
              </span>
            </div>
            {/* Note Title */}
            <h1 className="text-[28px] md:text-[34px] font-bold tracking-[-0.03em] text-black dark:text-white mb-4 md:mb-6 leading-[1.12] outline-none">
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
