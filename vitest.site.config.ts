import { defineConfig } from "vitest/config";

// Run after npm run build: checks the built site (CI runs it in the site job).
export default defineConfig({ test: { include: ["tests/site/**/*.test.ts"] } });
