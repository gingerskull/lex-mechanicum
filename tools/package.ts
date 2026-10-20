// npx tsx tools/package.ts [--v2] [--mesh] [id ...]: assembles every registered mechanism (or the given ids) and writes
// dist/packages/<id>.mxp (standard R4, Q3). Prints the size of each package.
//
// --v2 writes package v2 instead (dist/packages/<id>.mx2): the assembly lifted to v3 solids, every solid meshed by
// Manifold and checked (SOLID, D11), plain extrusions shipped as profiles and boolean results as meshes (D10). It
// prints the size against the v1 package and the shapes per kind. --mesh ships every solid as a mesh (the worst case,
// for comparing sizes).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../src/audit/sheet";
import { mechanisms } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import { buildPackage2 } from "../src/package/build2";
import { encode } from "../src/package/format";
import { encode2 } from "../src/package/format2";

async function main() {
  const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
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
    if (flags.has("--v2")) {
      const b = await buildPackage2(id, flags.has("--mesh") ? { allMesh: true } : {});
      const buf = await encode2(b.pkg);
      writeFileSync(join(dir, `${id}.mx2`), buf);
      const v1 = (await encode(b.built.pkg)).length;
      const meshes = b.pkg.shapes.filter((s) => s.mesh);
      const tris = meshes.reduce((n, s) => n + s.mesh!.tag.length, 0);
      const unsound = b.reports.filter((r) => !r.report.ok);
      console.log(
        `${id}: ${(buf.length / 1024).toFixed(1)} KB (${(buf.length / v1).toFixed(2)}x v1 ${(v1 / 1024).toFixed(1)} KB), ${b.pkg.solids.length} solids on ${b.pkg.shapes.length} shapes (${b.pkg.shapes.length - meshes.length} profiles, ${meshes.length} meshes, ${tris} triangles), grid 1/${b.pkg.grid} mm`,
      );
      for (const f of b.failed) console.log(`  SOLID ${f.id}: Manifold would not mesh it: ${f.error}`);
      for (const r of unsound) console.log(`  SOLID ${r.id}: ${r.report.issues.join("; ")}`);
      if (b.failed.length || unsound.length) process.exitCode = 1;
      continue;
    }
    const { pkg } = await buildPackage(id);
    const buf = await encode(pkg);
    writeFileSync(join(dir, `${id}.mxp`), buf);
    const pts = pkg.solids.reduce((n, s) => n + s.pts.length / 2, 0);
    console.log(`${id}: ${(buf.length / 1024).toFixed(1)} KB, ${pkg.solids.length} solids, ${pts} points, grid 1/${pkg.grid} mm, standard ${pkg.standard}`);
  }
}

await main();
