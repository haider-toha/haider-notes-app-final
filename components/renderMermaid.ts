import historicalDiagramGeometry from "./notebookDiagramGeometry.json";

/** The published page cuts reserve this original diagram footprint. */
export function diagramFrame(chart: string): { width: number; height: number } | undefined {
  let value = 2166136261;
  for (const character of chart.trim()) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return (historicalDiagramGeometry as Record<string, { width: number; height: number }>)[(value >>> 0).toString(16)];
}

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
  noteBkgColor: "#f1eee3",
  noteTextColor: "#303f53",
  noteBorderColor: "#303f53",
};

// Mermaid owns shared global render state. Serialize renders and allocate unique
// IDs so neighboring notebook figures cannot overwrite each other's SVGs.
let mermaidRenderChain: Promise<unknown> = Promise.resolve();
let mermaidRenderSeq = 0;
const renderedCharts = new Map<string, string>();
let mermaidModule: Promise<typeof import("mermaid")> | undefined;

/** Cached SVGs need new IDs for every live copy, including the expanded viewer. */
export function uniqueDiagramSvg(svg: string): string {
  const prefix = `mermaid-copy-${++mermaidRenderSeq}-`;
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  for (const id of new Set(ids)) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    svg = svg.replace(new RegExp(`id="${escaped}"`, "g"), `id="${prefix}${id}"`)
      .replace(new RegExp(`#${escaped}(?![\\w-])`, "g"), `#${prefix}${id}`);
  }
  const idSet = new Set(ids);
  return svg.replace(/(aria-labelledby|aria-describedby)="([^"]+)"/g, (_, attribute, value: string) =>
    `${attribute}="${value.split(/\s+/).map(id => idSet.has(id) ? prefix + id : id).join(" ")}"`);
}

export const renderMermaid = (chart: string, signal?: AbortSignal): Promise<string> => {
  const run = mermaidRenderChain.then(async () => {
    if (signal?.aborted) throw new DOMException("Diagram no longer needed", "AbortError");
    const cached = renderedCharts.get(chart);
    if (cached) return cached;
    mermaidModule ??= import("mermaid").catch(error => { mermaidModule = undefined; throw error; });
    const { default: mermaid } = await mermaidModule;
    // Mermaid measures labels before creating the SVG; using a fallback font
    // here clips handwritten labels when the notebook font arrives later.
    await document.fonts.load('24px "Reenie Beanie"');
    if (signal?.aborted) throw new DOMException("Diagram no longer needed", "AbortError");
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      fontFamily: '"Reenie Beanie", cursive',
      look: "handDrawn",
      handDrawnSeed: 17,
      // Mermaid derives a half-black label background from "transparent";
      // override that generated rule inside the SVG so expanded views agree.
      themeCSS: ".labelBkg, .edgeLabel, .edgeLabel p { background: transparent !important; } .edgeLabel rect { fill: transparent !important; } .edgeLabel .label { translate: 0 -14px; }",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        nodeSpacing: 24, rankSpacing: 30, padding: 8,
        subGraphTitleMargin: { top: 8, bottom: 16 },
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
    renderedCharts.set(chart, svg);
    return svg;
  });
  // Keep the queue alive even if one render rejects, so a single failure
  // doesn't stall every diagram behind it.
  mermaidRenderChain = run.catch(() => {});
  return run.then(uniqueDiagramSvg);
};
