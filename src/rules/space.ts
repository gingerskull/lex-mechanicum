// Free-space queries for placing hardware: does an outline stay clear of every sweep over a z range.
import type { Vec2 } from "../core/geom";
import { overlap, region } from "../core/poly";
import type { RuleContext } from "./types";

/** True when the world outline over [z0, z1] overlaps no moving part's sweep and no moving solid. */
export function clearOf(ctx: RuleContext, outer: Vec2[], z0: number, z1: number, tol = 0.05): boolean {
  const g = region(outer, []);
  const zHit = (a: number, b: number) => Math.min(b, z1) - Math.max(a, z0) > 0.05;
  for (const sw of ctx.sweeps()) if (zHit(sw.z0, sw.z1) && sw.regions.some((r) => overlap(g, r) > tol)) return false;
  for (const t of ctx.solids) {
    if ((t.body === "ground" || ctx.parts[t.body]?.fixed) && !t.motion) continue;
    if (ctx.solidOf[t.id] === t || !zHit(t.z0, t.z1)) continue;
    if (ctx.swept(t).some((r) => overlap(g, r) > tol)) return false;
  }
  return true;
}
