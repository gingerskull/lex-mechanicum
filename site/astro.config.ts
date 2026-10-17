// The static site (standard SS8): the library at /, one page per registered mechanism at /mechanisms/<id>/.
// Built into dist/site. The engine (renderer, packages loader, mechanism models) is one shared chunk loaded only by
// the stage and by a card on hover; each mechanism's model is its own chunk.
import { defineConfig } from "astro/config";

export default defineConfig({
  outDir: "../dist/site",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  vite: {
    build: { target: "es2022" },
  },
});
