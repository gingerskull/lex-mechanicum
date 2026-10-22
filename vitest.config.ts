import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // the built site is checked by npm run test:site after npm run build
    exclude: ["tests/site/**", "**/node_modules/**"],
    // the fixtures build whole mechanisms in 3D over the cycle; on the CI runner, a few times slower than a desk, the
    // longest build takes about 20 s
    testTimeout: 120_000,
    // the runner's 4 cores all run test files (the default leaves one free); a desk uses its own default
    ...(process.env.CI ? { maxWorkers: 4 } : {}),
  },
});
