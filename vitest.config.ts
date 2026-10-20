import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // the built site is checked by npm run test:site after npm run build
    exclude: ["tests/site/**", "**/node_modules/**"],
    // the rule fixtures assemble whole mechanisms over the cycle; the CI runner is a few times slower than a desk
    testTimeout: 30_000,
  },
});
