// npx tsx tools/package.ts [--mesh] [id ...]: builds every registered mechanism (or the given ids) from its record by the
// hardware builder and writes dist/packages/<id>.mx2 (package v2, standard R4, Q3): every solid meshed by Manifold and
// checked (SOLID, D11), plain extrusions, revolutions, sweeps and lofts shipped as profiles and boolean results as meshes
// (D10). Prints the size of each package and its shapes. --mesh ships every solid as a mesh (the worst case, for
// comparing sizes).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../src/audit/sheet";
import { allIds, isKnown } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import { encode2 } from "../src/package/format2";

async function main() {
  const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const ids = args.length ? args : allIds();
  const unknown = ids.filter((id) => !isKnown(id));
  if (unknown.length) {
    console.error(`unknown mechanism ${unknown.join(", ")}; known: ${allIds().join(", ")}`);
    process.exitCode = 1;
    return;
  }
  const dir = join(ROOT, "dist", "packages");
  mkdirSync(dir, { recursive: true });
  for (const id of ids) {
    const b = await buildPackage(id, flags.has("--mesh") ? { allMesh: true } : {});
    const buf = await encode2(b.pkg);
    writeFileSync(join(dir, `${id}.mx2`), buf);
    const meshes = b.pkg.shapes.filter((s) => s.mesh);
    const tris = meshes.reduce((n, s) => n + s.mesh!.tag.length, 0);
    const unsound = b.reports.filter((r) => !r.report.ok);
    console.log(
      `${id}: ${(buf.length / 1024).toFixed(1)} KB, ${b.pkg.solids.length} solids on ${b.pkg.shapes.length} shapes (${b.pkg.shapes.length - meshes.length} profiles, ${meshes.length} meshes, ${tris} triangles), grid 1/${b.pkg.grid} mm`,
    );
    for (const f of b.failed) console.log(`  SOLID ${f.id}: Manifold would not mesh it: ${f.error}`);
    for (const r of unsound) console.log(`  SOLID ${r.id}: ${r.report.issues.join("; ")}`);
    if (b.failed.length || unsound.length) process.exitCode = 1;
  }
}

await main();
