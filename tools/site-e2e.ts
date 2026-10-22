// npm run test:e2e: builds the site and runs the browser tests of the stage and the library against it, in local Chrome.
// Local only; CI never draws. `--skip-build` reuses dist/site.
import { spawnSync } from "node:child_process";

const run = (cmd: string, args: string[]) => spawnSync(cmd, args, { stdio: "inherit", shell: true }).status ?? 1;

if (!process.argv.includes("--skip-build") && run("npm", ["run", "build"]) !== 0) process.exit(1);
// the build test too: it checks that the setup worker counts in the pages' JavaScript budget
const site = run("npx", ["vitest", "run", "--config", "vitest.site.config.ts"]);
process.exit(run("npx", ["vitest", "run", "--config", "vitest.e2e.config.ts"]) || site);
