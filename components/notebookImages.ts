interface NotebookImage {
  width: number;
  height: number;
  srcSet: string;
  sizes: string;
}

/** Authored URLs remain the source of truth and the full-resolution modal fallback. */
export const notebookImages: Record<string, NotebookImage> = {
  '/sahad_tulip.png': {
    width: 500,
    height: 759,
    srcSet: '/sahad_tulip-320.webp 320w, /sahad_tulip.webp 500w',
    // Contained within the notebook's 440px image-height limit; narrow phones
    // have less writing width. High-density displays select the original resolution.
    sizes: '(max-width: 400px) calc(100vw - 88px), 290px',
  },
};
