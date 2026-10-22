import { defineConfig } from "vitest/config";

// Local only (needs Google Chrome): the built site's stage and library in a real browser, desktop and phone. `npm run
// test:e2e` builds the site first, then runs this. Never in CI, which never draws.
export default defineConfig({
  test: {
    include: ["tests/site/**/*.e2e.ts"],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
});
