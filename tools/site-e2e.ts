// npm run test:e2e: builds the site with three 2.5D mechanisms on the v3 stage (SITE_V3, site/src/drawn.ts) and runs the
// browser tests of the stage and the library against it, in local Chrome. Local only; CI never draws. `--skip-build`
// reuses dist/site.
import { spawnSync } from "node:child_process";

const env = { ...process.env, SITE_V3: "four-bar,bevel-gears,oscillating-cylinder,universal-joint" };
const run = (cmd: string, args: string[]) => spawnSync(cmd, args, { stdio: "inherit", env, shell: true }).status ?? 1;

if (!process.argv.includes("--skip-build") && run("npm", ["run", "build"]) !== 0) process.exit(1);
// the build test too: with v3 pages in the build it checks that the setup worker counts in their JavaScript budget
const site = run("npx", ["vitest", "run", "--config", "vitest.site.config.ts"]);
process.exit(run("npx", ["vitest", "run", "--config", "vitest.e2e.config.ts"]) || site);
