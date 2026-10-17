// npx tsx tools/package.ts [id ...]: assembles every registered mechanism (or the given ids) and writes
// dist/packages/<id>.mxp (standard R4, Q3). Prints the size of each package.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../src/audit/sheet";
import { mechanisms } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";

async function main() {
  const args = process.argv.slice(2);
  const ids = args.length ? args : Object.keys(mechanisms);
  const unknown = ids.filter((id) => !mechanisms[id]);
  if (unknown.length) {
    console.error(`unknown mechanism ${unknown.join(", ")}; registered: ${Object.keys(mechanisms).join(", ")}`);
    process.exitCode = 1;
    return;
  }
  const dir = join(ROOT, "dist", "packages");
  mkdirSync(dir, { recursive: true });
  for (const id of ids) {
    const { pkg } = await buildPackage(id);
    const buf = await encode(pkg);
    writeFileSync(join(dir, `${id}.mxp`), buf);
    const pts = pkg.solids.reduce((n, s) => n + s.pts.length / 2, 0);
    console.log(`${id}: ${(buf.length / 1024).toFixed(1)} KB, ${pkg.solids.length} solids, ${pts} points, grid 1/${pkg.grid} mm, standard ${pkg.standard}`);
  }
}

await main();
