import { memo } from 'react';
import NotebookContent from './NotebookContent';
import NotebookContents, { type NotebookSection } from './NotebookContents';
import type { NotebookPage } from './notebookPages';

interface NotebookSheetProps {
  index: number;
  content?: NotebookPage;
  reverseInk?: string;
  sections: NotebookSection[];
  nearby: boolean;
  active: boolean;
  mobile: boolean;
  compact: boolean;
  turning: boolean;
  onContents: (index: number) => void;
  onNavigate: (index: number) => void;
  onPrevious: (index: number) => void;
  onScroll: (index: number, writing: HTMLDivElement) => void;
}

/** Stable leaf faces do not reparse their writing when another leaf turns. */
export default memo(function NotebookSheet({ index, content, reverseInk, sections, nearby, active,
  mobile, compact, turning, onContents, onNavigate, onPrevious, onScroll }: NotebookSheetProps) {
  const contents = index < 2;
  const navigation = !mobile && index % 2 === 1 ? null : <button className="notebook-contents-link"
    aria-label={contents ? 'Back to reading' : 'Open contents'} disabled={turning} onClick={() => onContents(index)}>
    {contents ? 'continue reading →' : '← contents'}
  </button>;
  const grips = compact && nearby && <>
    <button type="button" tabIndex={-1} className="notebook-mobile-grip" data-side="left" aria-hidden="true" />
    <button type="button" tabIndex={-1} className="notebook-mobile-grip" data-side="right" aria-hidden="true" />
    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner =>
      <button key={corner} type="button" tabIndex={-1} className="notebook-mobile-corner" data-corner={corner} aria-hidden="true" />)}
    {index > 0 && <button className="notebook-mobile-previous" aria-label="Previous notebook page" disabled={turning}
      onClick={() => onPrevious(index)}>← previous</button>}
  </>;
  return <article className={`notebook-sheet${contents ? ' notebook-contents-sheet' : ''}`}
    data-page-side={index % 2 ? 'right' : 'left'} data-contents-part={contents ? index : undefined}
    data-note-id={content?.note.id} data-page-index={contents ? undefined : index - 2}>
    {navigation}
    {!contents && <span className="notebook-reverse-ink" aria-hidden="true">{reverseInk}</span>}
    <div className="notebook-running-head" aria-hidden="true">{!contents && index !== 2 && <span>{content!.note.title}</span>}</div>
    <div className="notebook-writing" onScroll={event => onScroll(index, event.currentTarget)}>
      {contents ? <NotebookContents sections={sections} part={index as 0 | 1} onNavigate={onNavigate} />
        : nearby && <NotebookContent page={content!} active={active} />}
    </div>
    {grips}
    <span className="notebook-page-number">{contents ? (index === 0 ? 'i' : 'ii') : index - 1}</span>
  </article>;
});
