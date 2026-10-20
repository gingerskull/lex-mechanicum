// The pilots through the whole v3 path: every solid meshes in Manifold, the browser's tessellation of the shipped shapes
// is as sound and as big as Manifold's, and the browser setup returns the same arrays on every run.
import { beforeAll, describe, expect, it } from "vitest";
import { buildPackage2, type Built2 } from "../../src/package/build2";
import { encode2 } from "../../src/package/format2";
import { checkMesh } from "../../src/solids/check";
import { manifold, meshOf } from "../../src/solids/manifold";
import { meshOfShape } from "../../src/solids/prepare";
import { setupForWorker, setupInline } from "../../src/solids/setup";
import { volume } from "../../src/solids/tessellate";

const PILOTS = ["four-bar", "spur-gears", "bevel-gears", "helical-gears", "worm-drive"];
const built: Record<string, Built2> = {};
let M: Awaited<ReturnType<typeof manifold>>;

beforeAll(async () => {
  M = await manifold();
  for (const id of PILOTS) built[id] = await buildPackage2(id);
}, 180_000);

describe.each(PILOTS)("%s", (id) => {
  it("meshes every solid in Manifold, closed and tagged", () => {
    const b = built[id]!;
    expect(b.failed).toEqual([]);
    expect(b.reports.length).toBe(b.solids.length);
    expect(b.reports.filter((r) => !r.report.ok).map((r) => `${r.id}: ${r.report.issues.join("; ")}`)).toEqual([]);
  });

  it("tessellates every shipped shape as a closed solid close to Manifold's volume", () => {
    const b = built[id]!;
    for (const s of b.pkg.solids) {
      const shape = b.pkg.shapes[s.shape]!;
      const mesh = meshOfShape(shape);
      expect(checkMesh(mesh).issues, s.id).toEqual([]);
      const solid = b.solids.find((x) => x.id === s.id)!;
      if (solid.stretch) continue;
      // the shipped profile is snapped to the package grid, Manifold's mesh is not: allow the snap and the twist diagonal
      expect(Math.abs(volume(mesh) / volume(meshOf(M, solid)) - 1), s.id).toBeLessThan(0.03);
    }
  });

  it("sets up the same arrays on every run, in one thread or for a worker", async () => {
    const blob = await encode2(built[id]!.pkg);
    const a = await setupInline(blob);
    const b = await setupInline(blob);
    expect(a.meshes.length).toBe(built[id]!.pkg.shapes.length);
    a.meshes.forEach((m, i) => {
      expect(Array.from(m.pos)).toEqual(Array.from(b.meshes[i]!.pos));
      expect(Array.from(m.tri)).toEqual(Array.from(b.meshes[i]!.tri));
    });
    a.edges.forEach((e, i) => expect(Array.from(e.data)).toEqual(Array.from(b.edges[i]!.data)));
    const w = await setupForWorker(blob);
    expect(w.result.pkg.shapes).toEqual([]);
    expect(w.result.pkg.solids.length).toBe(built[id]!.pkg.solids.length);
    expect(new Set(w.transfer).size).toBe(w.transfer.length);
  });
});
