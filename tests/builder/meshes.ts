// The teeth of every parallel mesh of a built record, over the sampled cycle: the overlap of the two meshing outlines
// in their common plane. Meshing teeth touch on their flanks and never cut into each other.
import type { Vec2 } from "../../src/core/geom";
import type { BuildCtx } from "../../src/builder/ctx";
import { fromPlane, planeCoords } from "../../src/builder/frames";
import { meshLevel } from "../../src/builder/shapes";
import { xf } from "../../src/kin/math";

export function meshOverlap(ctx: BuildCtx): { joint: string; max: number; at: number }[] {
  const out: { joint: string; max: number; at: number }[] = [];
  for (const j of ctx.kin.joints) {
    if (j.type !== "gear-mesh" || j.crossed) continue;
    const rings = (id: string): Vec2[][] | null => {
      const g = ctx.geoms.get(id);
      if (!g) return null;
      const lv = meshLevel(g, j);
      const p = lv ? g.levels![lv - 1]!.profile : g.profile;
      return [p.outer, ...p.holes];
    };
    const A = rings(j.a);
    const B = rings(j.b);
    const ga = ctx.geoms.get(j.a);
    const gb = ctx.geoms.get(j.b);
    if (!A || !B || !ga || !gb) continue;
    const plane = ga.frame;
    let max = 0;
    let at = 0;
    ctx.sampled.us.forEach((_, i) => {
      const put = (rs: Vec2[][], body: string, f: typeof plane) =>
        rs.map((r) => r.map((q): Vec2 => planeCoords(plane, xf.apply(ctx.xfOf(body, i), fromPlane(f, q, 0))).uv));
      const ca = new ctx.M.CrossSection(put(A, j.a, ga.frame), "EvenOdd");
      const cb = new ctx.M.CrossSection(put(B, j.b, gb.frame), "EvenOdd");
      const x = ca.intersect(cb);
      const a = x.area();
      if (a > max) {
        max = a;
        at = i;
      }
      ca.delete();
      cb.delete();
      x.delete();
    });
    out.push({ joint: j.id, max, at });
  }
  return out;
}
