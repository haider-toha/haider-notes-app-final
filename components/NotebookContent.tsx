import React from 'react';
import MainContent from './MainContent';
import type { NotebookPage } from './notebookPages';
import './NotebookContent.css';

interface NotebookContentProps {
  page: NotebookPage;
  active?: boolean;
}

function NotebookContent({ page, active = true }: NotebookContentProps) {
  const render = (content: string) => <MainContent note={{ ...page.note, content }} mediaActive={active} />;
  const intro = page.note.id === 'profile-about-me' && page.part === 0;
  const paragraphs = intro ? page.content.trimEnd().split('\n\n') : [];
  return <div className="notebook-content" data-note-id={page.note.id} data-note-part={page.part}>
    {intro ? <div className="notebook-intro">
      <h1>{paragraphs[0].split('\n')[0]}</h1>
      <p className="notebook-location">{paragraphs[0].split('\n').slice(1).join('\n')}</p>
      <div className="notebook-socials">{render(paragraphs[1])}</div>
      <div className="notebook-opening-copy">{render(paragraphs.slice(2).join('\n\n'))}</div>
    </div> : <>
      {page.part === 0 && <h1 className="notebook-note-title">{page.note.title}</h1>}
      {render(page.content.trimEnd())}
    </>}
  </div>;
}

export default React.memo(NotebookContent);
