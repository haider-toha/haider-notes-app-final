import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { Note } from "../types";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import mermaid from "mermaid";
import "./MediaModal.css";

// Rendering is explicit and serialized; Mermaid never scans the document.
mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
});

interface MainContentProps {
  note: Note;
  mediaActive?: boolean;
}

/** Canvas logical sizes from each simulation HTML file — keeps iframe height tight. */
const IFRAME_ASPECT_RATIOS: Record<string, number> = {
  "/dynamical_systems/rolling_system_minimal.html": 900 / 420,
  "/dynamical_systems/gear-twin-crank_minimal.html": 940 / 660,
  "/dynamical_systems/cam-skater_minimal.html": 940 / 600,
};
const IFRAME_TITLES: Record<string, string> = {
  "/dynamical_systems/rolling_system_minimal.html": "Rolling system — animated dynamical simulation",
  "/dynamical_systems/gear-twin-crank_minimal.html": "Gear and twin crank — animated dynamical simulation",
  "/dynamical_systems/cam-skater_minimal.html": "Cam-wagged coasting skater — animated dynamical simulation",
};

interface MediaModalProps {
  kind: "diagram" | "image";
  children: React.ReactNode;
  onClose: () => void;
  caption?: string;
}

/** Shared viewer: the toolbar never participates in the media transform. */
const MediaModal: React.FC<MediaModalProps> = ({ kind, children, onClose, caption }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const zoom = useCallback((delta: number) => setScale(value => Math.min(5, Math.max(0.25, Math.round((value + delta) * 100) / 100))), []);
  const reset = useCallback(() => { setScale(1); setPosition({ x: 0, y: 0 }); }, []);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Disable every background branch, including the notebook's own scroller.
    const inactive: Array<{ element: HTMLElement; inert: boolean }> = [];
    let branch: HTMLElement | null = containerRef.current;
    while (branch && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement?.children ?? [])) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          inactive.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    closeRef.current?.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault(); event.stopImmediatePropagation(); onCloseRef.current();
      } else if (event.key === "Tab") {
        const buttons = Array.from(containerRef.current?.querySelectorAll('button:not(:disabled)') ?? []) as HTMLButtonElement[];
        const first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", keyboard, true);
    return () => {
      document.removeEventListener("keydown", keyboard, true);
      inactive.forEach(({ element, inert }) => { element.inert = inert; });
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault(); event.stopPropagation();
      zoom(event.deltaY > 0 ? -0.1 : 0.1);
    };
    stage.addEventListener("wheel", wheel, { passive: false });
    return () => stage.removeEventListener("wheel", wheel);
  }, [zoom]);

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(pointers.current.size > 0);
  };

  return <div ref={containerRef} role="dialog" aria-modal="true" aria-label={`Expanded ${kind}`}
    className={`note-media-modal is-notebook${kind === "diagram" ? " notebook-diagram-modal" : ""}`}
    onPointerDown={event => event.stopPropagation()}
    onPointerMove={event => event.stopPropagation()}
    onPointerUp={event => event.stopPropagation()}
    onClick={event => event.stopPropagation()}
    onKeyDown={event => {
      event.stopPropagation();
      const directions: Record<string, [number, number]> = { ArrowLeft: [-40, 0], ArrowRight: [40, 0], ArrowUp: [0, -40], ArrowDown: [0, 40] };
      if (directions[event.key]) {
        event.preventDefault(); const [x, y] = directions[event.key];
        setPosition(value => ({ x: value.x + x, y: value.y + y }));
      } else if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(0.25); }
      else if (event.key === "-") { event.preventDefault(); zoom(-0.25); }
      else if (event.key === "0") { event.preventDefault(); reset(); }
    }}>
    <div className="note-media-toolbar">
      <div className="note-media-zoom-controls" role="group" aria-label="Zoom controls">
        <button type="button" aria-label="Zoom out" disabled={scale <= 0.25} onClick={() => zoom(-0.25)}><ZoomOut /></button>
        <output className="note-media-scale" aria-label="Zoom level">{Math.round(scale * 100)}%</output>
        <button type="button" aria-label="Zoom in" disabled={scale >= 5} onClick={() => zoom(0.25)}><ZoomIn /></button>
        <button type="button" className="note-media-reset" onClick={reset}>Reset</button>
      </div>
      <button ref={closeRef} type="button" className="note-media-close" aria-label={`Close ${kind}`} title="Close (Esc)" onClick={onClose}><X /></button>
    </div>
    <div ref={stageRef} className={`note-media-stage${dragging ? " is-dragging" : ""}`}
      onPointerDown={event => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        setDragging(true);
      }}
      onPointerMove={event => {
        const previous = pointers.current.get(event.pointerId);
        if (!previous) return;
        event.preventDefault();
        const next = { x: event.clientX, y: event.clientY };
        const other = Array.from(pointers.current.entries()).find(([id]) => id !== event.pointerId)?.[1];
        if (other) {
          const before = Math.hypot(previous.x - other.x, previous.y - other.y);
          const after = Math.hypot(next.x - other.x, next.y - other.y);
          if (before > 1) setScale(value => Math.min(5, Math.max(0.25, value * after / before)));
          setPosition(value => ({ x: value.x + (next.x - previous.x) / 2, y: value.y + (next.y - previous.y) / 2 }));
        } else setPosition(value => ({ x: value.x + next.x - previous.x, y: value.y + next.y - previous.y }));
        pointers.current.set(event.pointerId, next);
      }}
      onPointerUp={endPointer} onPointerCancel={endPointer} onLostPointerCapture={event => {
        pointers.current.delete(event.pointerId); setDragging(pointers.current.size > 0);
      }}>
      <div className="note-media-content" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}>{children}</div>
    </div>
    <div className="note-media-footer">
      {caption && <span className="note-media-caption">{caption}</span>}
      <span className="note-media-hint">drag to pan · scroll or pinch to zoom · esc to close</span>
    </div>
  </div>;
};

const DiagramModal: React.FC<{ svg: string; onClose: () => void }> = ({ svg, onClose }) =>
  <MediaModal kind="diagram" onClose={onClose}>
    <div className="note-media-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
  </MediaModal>;

const notebookThemeVariables = {
  fontFamily: '"Reenie Beanie", cursive',
  fontSize: "24px",
  primaryColor: "transparent",
  primaryTextColor: "#303f53",
  primaryBorderColor: "#303f53",
  lineColor: "#303f53",
  secondaryColor: "transparent",
  tertiaryColor: "transparent",
  background: "transparent",
  mainBkg: "transparent",
  secondBkg: "transparent",
  nodeBorder: "#303f53",
  clusterBkg: "transparent",
  clusterBorder: "#303f53",
  titleColor: "#303f53",
  edgeLabelBackground: "transparent",
  actorBkg: "transparent",
  actorBorder: "#303f53",
  actorTextColor: "#303f53",
  actorLineColor: "#303f53",
  signalColor: "#303f53",
  signalTextColor: "#303f53",
  noteBkgColor: "transparent",
  noteTextColor: "#303f53",
  noteBorderColor: "#303f53",
};

// Mermaid owns shared global render state. Serialize renders and allocate unique
// IDs so neighboring notebook figures cannot overwrite each other's SVGs.
let mermaidRenderChain: Promise<unknown> = Promise.resolve();
let mermaidRenderSeq = 0;

export const renderMermaid = (chart: string): Promise<string> => {
  const run = mermaidRenderChain.then(async () => {
    // Mermaid measures labels before creating the SVG; using a fallback font
    // here clips handwritten labels when the notebook font arrives later.
    await document.fonts.load('24px "Reenie Beanie"');
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      fontFamily: '"Reenie Beanie", cursive',
      look: "handDrawn",
      handDrawnSeed: 17,
      // Mermaid derives a half-black label background from "transparent";
      // override that generated rule inside the SVG so expanded views agree.
      themeCSS: ".labelBkg, .edgeLabel, .edgeLabel p { background: transparent !important; } .edgeLabel rect { fill: transparent !important; }",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        nodeSpacing: 24, rankSpacing: 30, padding: 8,
      },
      sequence: {
        actorFontFamily: '"Reenie Beanie", cursive',
        noteFontFamily: '"Reenie Beanie", cursive',
        messageFontFamily: '"Reenie Beanie", cursive',
        actorFontSize: 24,
        noteFontSize: 24,
        messageFontSize: 24,
      },
      themeVariables: notebookThemeVariables,
    });
    const { svg } = await mermaid.render(
      `mermaid-render-light-${++mermaidRenderSeq}`,
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
  const [reloadRequired, setReloadRequired] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError(null);

    renderMermaid(chart)
      .then((rendered) => {
        if (cancelled) return;
        setSvg(rendered);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Mermaid rendering error:", err);
        // Browsers cache a rejected module import. Re-running Mermaid cannot
        // recover that session after a stale deployment/dev dependency URL.
        setReloadRequired(/dynamically imported module|module script|loading chunk|importing a module/i.test(String(err)));
        setError("Failed to render diagram");
      });

    // If the diagram unmounts or its chart changes before this render
    // resolves, drop the stale result so it can't overwrite a newer one.
    return () => {
      cancelled = true;
    };
  }, [chart, id, attempt]);

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {error}
        <button type="button" className="ml-3 underline" onClick={() => {
          if (reloadRequired) window.location.reload();
          else setAttempt(value => value + 1);
        }}>{reloadRequired ? "Reload to restore diagram" : "Retry diagram"}</button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 relative group notebook-diagram"
    >
      {/* Expand button */}
      <button
        onClick={event => { event.currentTarget.focus(); onExpand(svg); }}
        disabled={!svg}
        className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Expand diagram"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
      {/* Diagram */}
      <div 
        className="flex justify-center overflow-x-auto cursor-pointer"
        role="button"
        tabIndex={svg ? 0 : -1}
        aria-label="Expand diagram"
        onClick={event => { if (svg) { event.currentTarget.focus(); onExpand(svg); } }}
        onKeyDown={event => {
          if (svg && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault(); event.stopPropagation(); onExpand(svg);
          }
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};

const ImageModal: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) =>
  <MediaModal kind="image" onClose={onClose} caption={alt}>
    <img src={src} alt={alt} draggable={false} />
  </MediaModal>;

const MainContent: React.FC<MainContentProps> = ({ note, mediaActive = true }) => {
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [modalDiagram, setModalDiagram] = useState<string | null>(null);

  // Image click handler
  const handleImageClick = (src: string, alt: string) => {
    setModalImage({ src, alt });
  };

  // Render inline image
  const renderImage = (src: string, alt: string, key: string | number) => (
    <div
      key={key}
      className="my-4 cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`Expand image${alt ? `: ${alt}` : ""}`}
      onClick={event => { event.currentTarget.focus(); handleImageClick(src, alt); }}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault(); event.stopPropagation(); handleImageClick(src, alt);
        }
      }}
    >
      <div className="relative overflow-hidden rounded-xl bg-black/5">
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
              <div class="flex items-center justify-center py-8 text-note-muted text-sm">
                <span>image could not be loaded</span>
              </div>
            `;
            }
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-xl pointer-events-none" />
      </div>
      {alt && (
        <p className="text-center text-[13px] text-note-muted mt-2 italic">
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
            <tr className="border-b border-black/20">
              {headerRow.map((cell, i) => (
                <th
                  key={i}
                  className="text-left py-2 px-3 font-semibold text-black/80"
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
                className="border-b border-black/10"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="py-2 px-3 text-black/70"
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
          {mediaActive ? <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            style={{ border: "none", background: "transparent" }}
            allow="autoplay"
            title={IFRAME_TITLES[src] ?? "Animated simulation"}
          /> : <div className="flex h-full items-center justify-center text-sm opacity-60">{IFRAME_TITLES[src] ?? "Animated simulation"}</div>}
        </div>
      );
    }

    // Regular code block
    return (
      <div key={key} className="my-4">
        <pre className="bg-black/5 rounded-lg p-4 overflow-x-auto">
          <code className="text-[13px] md:text-[14px] font-mono text-black/80 whitespace-pre">
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
    if (/^\s{0,3}(?:(?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,})$/.test(line)) {
      return null;
    }
    if (/^\s*(?:\.{3,}|…)\s*$/.test(line)) return null;
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
          className={`font-bold text-black tracking-[-0.015em] mt-4 mb-1 leading-snug ${sizeByLevel[level - 1]}`}
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
          <span className="absolute left-0 tabular-nums text-black/80">
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
          <span className="absolute left-1 text-black/70">
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

    // Render a markdown link token, or null if it isn't one.
    const renderLink = (token: string, key: string | number) => {
      const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (!linkMatch) return null;
      return (
        <a
          key={key}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-note-link hover:underline cursor-pointer"
        >
          {linkMatch[1]}{'\u00a0'}<span className="notebook-link-arrow" aria-hidden="true">↗</span>
        </a>
      );
    };

    // Re-parse links inside bold/italic so e.g. **work at [acme](url)** works.
    const withNestedLinks = (text: string, keyPrefix: string) =>
      text.split(/(\[.*?\]\(.*?\))/g).map((chunk, i) => {
        const link = renderLink(chunk, `${keyPrefix}-${i}`);
        return link ?? <span key={`${keyPrefix}-${i}`}>{chunk}</span>;
      });

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
            className="px-1.5 py-0.5 mx-px rounded-md bg-black/[0.07] font-mono text-[0.85em] text-black/85"
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
            {withNestedLinks(part.slice(2, -2), `b${j}`)}
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
            <em key={j} className="italic text-note-muted">
              {withNestedLinks(inner, `i${j}`)}
            </em>
          );
        }
        return <span key={j}>{part}</span>;
      }
      {
        const link = renderLink(part, j);
        if (link) return link;
      }
      return <span key={j}>{part}</span>;
    });
  };

  return <>
    {renderContent(note.content)}
    {modalImage && createPortal(<ImageModal {...modalImage} onClose={() => setModalImage(null)} />, document.body)}
    {modalDiagram && createPortal(<DiagramModal svg={modalDiagram} onClose={() => setModalDiagram(null)} />, document.body)}
  </>;
};

export default MainContent;
