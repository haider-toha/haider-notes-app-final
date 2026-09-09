import geometry from './notebookDiagramGeometry.json';

export const NOTEBOOK_DIAGRAM_MAX_HEIGHT = 450;
export function notebookDiagramKey(chart: string): string {
  let hash = 2166136261;
  for (const character of chart.trim()) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(16);
}

/** Geometry only, measured from live SVG; the actual diagram still renders live. */
export function estimatedDiagramHeight(chart: string, availableWidth: number): number {
  const size = (geometry as Record<string, { width: number; height: number }>)[notebookDiagramKey(chart)];
  if (!size) return 450;
  const width = Math.min(size.width, availableWidth);
  return Math.min(NOTEBOOK_DIAGRAM_MAX_HEIGHT, size.height * width / size.width);
}
