import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // the built site is checked by npm run test:site after npm run build
    exclude: ["tests/site/**", "**/node_modules/**"],
  },
});
