import { portfolioNotes } from '../constants';
import type { Note } from '../types';
import { estimatedDiagramHeight } from './notebookDiagramGeometry';

export interface NotebookPage {
  note: Note;
  content: string;
  part: number;
  partCount: number;
}

/** Keep every source byte, and never break a fenced figure or display equation. */
function contentBlocks(content: string): string[] {
  const blocks: string[] = [];
  let block = '';
  let fence = false;
  let math = false;
  for (const line of content.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
    block += line;
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) fence = !fence;
    if (!fence && trimmed === '$$') math = !math;
    if (!fence && !math && !trimmed) {
      blocks.push(block);
      block = '';
    }
  }
  if (block) blocks.push(block);
  return blocks;
}

function pageWeight(block: string): number {
  if (/```(?:mermaid|iframe)/.test(block)) return 900;
  if (/!\[/.test(block)) return 700;
  return block.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').length
    + (block.match(/\n/g)?.length ?? 0) * 18;
}

function legacyPaginateNote(note: Note): NotebookPage[] {
  const blocks = contentBlocks(note.content);
  const chunks: string[] = [];
  // The opening leaf keeps the identity, social links and complete first paragraph.
  if (note.id === 'profile-about-me') chunks.push(blocks.splice(0, 3).join(''));
  let chunk = '';
  let weight = 0;
  for (const block of blocks) {
    const nextWeight = pageWeight(block);
    if (chunk && weight + nextWeight > 1080) {
      chunks.push(chunk);
      chunk = '';
      weight = 0;
    }
    chunk += block;
    weight += nextWeight;
  }
  if (chunk || chunks.length === 0) chunks.push(chunk);
  return chunks.map((content, part) => ({ note, content, part, partCount: chunks.length }));
}

// Keep this historical layout only to migrate numeric browser bookmarks. New
// positions are stored by source offset so subsequent pagination stays stable.
export const legacyNotebookPages = portfolioNotes.flatMap(legacyPaginateNote);

const PAGE_LINES = 21;
const LINE_WIDTH = 468;
const RULE_HEIGHT = 29;

// Measured advances for the committed Reenie Beanie font at 24px (ASCII 32–126).
// This keeps pagination deterministic before the font loads, without shrinking it.
const GLYPH_ADVANCES = [
  9.94,5.45,5.59,15.24,8.83,15.02,7.85,4.39,5.71,6.86,8.18,7.73,4.27,6.14,3.34,7.37,
  8.57,6.94,8.81,8.81,9.5,8.47,7.3,9.36,9.98,9.6,4.68,4.73,11.21,9.31,11.09,9.41,
  12.77,9.74,13.56,12.53,10.75,8.86,8.06,11.28,9.17,12.46,8.78,11.23,9.22,12.31,11.35,9.67,
  8.54,11.71,12.29,10.94,10.25,9.58,8.02,13.42,9.89,7.54,13.51,8.86,7.37,13.15,13.82,7.66,
  6.46,11.69,7.94,8.83,8.64,8.38,9.38,7.94,9.22,3.72,3.72,9.55,5.06,12.58,8.45,6.72,
  9.05,7.08,7.58,7.46,7.66,8.86,6.77,9.29,8.81,6.77,9.72,10.15,9.72,11.06,13.49,
];

function textWidth(text: string): number {
  return [...text].reduce((width, character) => width + (GLYPH_ADVANCES[character.charCodeAt(0) - 32] ?? 9), 0);
}

function proseLines(text: string): number {
  const visible = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1 ↗')
    .replace(/\$([^$]+)\$/g, (_, math: string) => math.replace(/\\[a-zA-Z]+/g, 'MM').replace(/[{}_^]/g, ''))
    .replace(/\*\*|__/g, '');
  let lines = 1;
  let width = 0;
  for (const word of visible.trim().split(/\s+/)) {
    const next = textWidth(word);
    if (width && width + 9.94 + next > LINE_WIDTH) { lines++; width = 0; }
    width += (width ? 9.94 : 0) + next;
    if (width > LINE_WIDTH) { lines += Math.floor(width / LINE_WIDTH); width %= LINE_WIDTH; }
  }
  return lines;
}

function isHeading(block: string): boolean {
  return /^(?:#{1,6}\s+[^\n]+|\*\*[^\n]+\*\*|__[^\n]+__|[-*_]{3,})$/.test(block.trim());
}

/** Estimate rendered height, not source length: a 3-line fence can be a figure. */
function blockLines(block: string): number {
  const body = block.trimEnd();
  const blankLines = (block.slice(body.length).match(/\n/g)?.length ?? 0) - 1;
  const spacing = Math.max(0, blankLines);
  if (/```iframe/.test(body)) {
    const aspect = body.includes('rolling_system') ? 900 / 420
      : body.includes('gear-twin-crank') ? 940 / 660
      : body.includes('cam-skater') ? 940 / 600 : 16 / 9;
    return LINE_WIDTH / aspect / RULE_HEIGHT + 24 / RULE_HEIGHT + spacing;
  }
  if (/```mermaid/.test(body)) {
    // Match the live SVG geometry and its readable minimum scale. Wide charts
    // pan horizontally; a tall chart remains atomic and scrolls on its leaf.
    const chart = body.replace(/^\s*```mermaid[^\n]*\n/, '').replace(/\n\s*```\s*$/, '').trim();
    const height = estimatedDiagramHeight(chart, LINE_WIDTH);
    return height / RULE_HEIGHT + 24 / RULE_HEIGHT + spacing;
  }
  if (/^\s*[-*_]{3,}\s*$/.test(body)) return spacing;
  if (/```/.test(body)) return Math.max(1, body.split('\n').length - 2) * 19.2 / RULE_HEIGHT + 64 / RULE_HEIGHT + spacing;
  if (/!\[/.test(body)) return 440 / RULE_HEIGHT + 1 + spacing;
  if (/^\s*\|/m.test(body)) return body.split('\n').length * 40 / RULE_HEIGHT + spacing;
  if (/\$\$/.test(body)) {
    const equations = [...body.matchAll(/\$\$([\s\S]*?)\$\$/g)];
    return equations.reduce((height, [, math]) => height + Math.max(1.4, (math.match(/\\\\/g)?.length ?? 0) + 1) + 28 / RULE_HEIGHT, 0) + spacing;
  }
  return body.split('\n').reduce((height, line) => height + proseLines(line) + (/^\s*#{1,6}\s/.test(line) ? 1 : 0), 0) + spacing;
}

function linesFor(content: string): number {
  return contentBlocks(content.trimEnd()).reduce((height, block) => height + blockLines(block), 0);
}

function canSplitProse(block: string): boolean {
  const body = block.trim();
  return !!body && !isHeading(block) && !/```|\$\$|!\[|^\s*(?:\||[-*+]\s|\d+[.)]\s|#{1,6}\s)/m.test(body) && !body.includes('\n');
}

/** Only cut at whitespace outside complete inline markup; every byte survives. */
function proseCuts(block: string): number[] {
  if (!canSplitProse(block)) return [];
  const protectedSpans = [...block.matchAll(/!?\[[^\]]*\]\([^\n)]+\)|\$[^$\n]+\$|`[^`\n]+`|\*\*[^\n]+?\*\*|__[^\n]+?__/g)]
    .map(match => [match.index!, match.index! + match[0].length]);
  return [...block.matchAll(/\s+/g)]
    .map(match => match.index! + match[0].length)
    .filter(cut => cut < block.trimEnd().length && !protectedSpans.some(([start, end]) => cut > start && cut < end));
}

function splitProse(block: string, fits: (prefix: string) => boolean): [string, string] | null {
  const candidates = proseCuts(block).filter(cut => fits(block.slice(0, cut)));
  if (!candidates.length) return null;
  const latest = candidates[candidates.length - 1];
  // Prefer a sentence when it still fills most of the available space.
  const sentence = candidates.filter(cut => cut >= latest * 0.72 && /[.!?]["')]*\s+$/.test(block.slice(0, cut))).pop();
  const cut = sentence ?? latest;
  if (proseLines(block.slice(0, cut)) < 3 || proseLines(block.slice(cut)) < 2) return null;
  return [block.slice(0, cut), block.slice(cut)];
}

/** Lists and short multiline sections can break between complete source lines. */
function readingBlocks(content: string): string[] {
  return contentBlocks(content).flatMap(block => {
    if (/```|\$\$|^\s*\|/m.test(block) || !block.trimEnd().includes('\n')) return [block];
    const lines = block.match(/[^\n]*\n|[^\n]+$/g) ?? [];
    const pieces: string[] = [];
    for (const line of lines) {
      if (!line.trim() && pieces.length) pieces[pieces.length - 1] += line;
      else pieces.push(line);
    }
    return pieces;
  });
}

export function paginateNote(note: Note): NotebookPage[] {
  const sourceBlocks = contentBlocks(note.content);
  const opening = note.id === 'profile-about-me' ? sourceBlocks.splice(0, 3).join('') : '';
  const blocks = readingBlocks(sourceBlocks.join(''));
  const chunks: string[] = [];
  const intro = note.id === 'profile-about-me';
  if (intro) chunks.push(opening);
  let chunk = '';
  let heading = '';
  const capacity = () => PAGE_LINES - (!intro && !chunks.length ? 3 : 0);
  const flush = () => { if (chunk) { chunks.push(chunk); chunk = ''; } };
  for (let block of blocks) {
    if (isHeading(block) || !block.trim()) { heading += block; continue; }
    while (block) {
      if (linesFor(chunk + heading + block) <= capacity()) { chunk += heading + block; heading = ''; break; }
      const split = splitProse(block, prefix => linesFor(chunk + heading + prefix) <= capacity());
      if (split) {
        chunk += heading + split[0];
        heading = '';
        block = split[1];
        flush();
      } else if (chunk) flush();
      else { chunk = heading + block; heading = ''; break; } // Atomic rich content can scroll.
    }
  }
  // A final source heading is preserved, but never moved onto its own leaf.
  chunk += heading;
  if (chunk || chunks.length === 0) chunks.push(chunk);

  // Rebalance safe boundaries when an atomic figure leaves a tiny adjacent leaf.
  const firstReadingPage = intro ? 1 : 0;
  for (let index = firstReadingPage; index < chunks.length - 1; index++) {
    const budget = PAGE_LINES - (!intro && index === 0 ? 3 : 0);
    if (linesFor(chunks[index] + chunks[index + 1]) <= budget) {
      chunks.splice(index, 2, chunks[index] + chunks[index + 1]);
      index--;
      continue;
    }
    if (linesFor(chunks[index]) >= 12 && linesFor(chunks[index + 1]) >= 12) continue;
    const combined = chunks[index] + chunks[index + 1];
    const candidates: number[] = [];
    let offset = 0;
    for (const block of readingBlocks(combined)) {
      candidates.push(...proseCuts(block).map(cut => offset + cut));
      offset += block.length;
      if (!isHeading(block)) candidates.push(offset);
    }
    const previousBudget = PAGE_LINES - (!intro && index === 0 ? 3 : 0);
    const cuts = candidates.filter(cut => cut > 0 && cut < combined.length).map(cut => ({ cut, left: linesFor(combined.slice(0, cut)), right: linesFor(combined.slice(cut)) }))
      .filter(({ cut, left, right }) => left <= previousBudget && right <= PAGE_LINES && left >= 6 && right >= 6
        && !isHeading(combined.slice(0, cut).trimEnd().split('\n').at(-1) ?? ''))
      .sort((a, b) => Math.abs(a.left - a.right) - Math.abs(b.left - b.right));
    if (cuts.length) { chunks[index] = combined.slice(0, cuts[0].cut); chunks[index + 1] = combined.slice(cuts[0].cut); }
  }
  return chunks.map((content, part) => ({ note, content, part, partCount: chunks.length }));
}

export const notebookPages = portfolioNotes.flatMap(paginateNote);
export const sheetTexts = notebookPages.map(page => page.content);
export const notebookSections = portfolioNotes.map(note => {
  const firstPage = notebookPages.findIndex(page => page.note.id === note.id);
  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    folder: note.folder ?? note.category,
    firstPage,
    pageCount: notebookPages[firstPage].partCount,
  };
});

export function notebookPageForLink(href: string): number | undefined {
  const match = href.match(/^\/(?:note\/)?([^/?#]+)\/?(?:[?#].*)?$/);
  if (!match) return undefined;
  return notebookSections.find(section => section.slug === match[1] || section.id === match[1])?.firstPage;
}
