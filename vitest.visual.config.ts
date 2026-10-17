import { defineConfig } from "vitest/config";

// Local only: visual snapshots (npm run test:visual), never in npm run check or CI.
export default defineConfig({
  test: {
    include: ["tests/visual/**/*.visual.ts"],
    fileParallelism: false,
  },
});
