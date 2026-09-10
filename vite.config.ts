import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateNotebookPages } from "./scripts/generate-notebook-pages.mjs";

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0",
  },
  plugins: [
    react(),
    {
      name: "notebook-pagination",
      async buildStart() { await generateNotebookPages(); },
      async handleHotUpdate({ file }) {
        if (/(?:constants\.tsx|notebookPagination\.ts|notebookDiagramGeometry\.(?:ts|json))$/.test(file)) {
          await generateNotebookPages();
        }
      },
    },
  ],
});
