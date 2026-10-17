// H.stops (F5): two stop posts just beyond each end of an oscillating part's swing, from the solved range. Each is a
// neoprene bumper sleeve on an M4 button-head screw into the base. Never touched while driven; with the drive off the
// part lands on rubber.
import { TAU, type Vec2 } from "../../core/geom";
import { poseOf } from "../../model/pose";
import type { Part } from "../../model/types";
import { heights } from "../../parts";
import type { RuleContext } from "../../rules/types";
import { bumper, screw } from "../primitives";

export interface StopSpec {
  part: Part;
  pivot: Vec2;
  /** Swing of the part's angle, radians, lo < hi (unwrapped). */
  range: [number, number];
  /** Angle beyond each end before the stop, radians. */
  margin?: number;
  joint: string;
}

/** The part's angle over the cycle, unwrapped, as [lo, hi]; null when it turns fully. */
export function swing(ctx: RuleContext, part: Part, n = 180): [number, number] | null {
  let prev: number | null = null;
  let acc = 0;
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i <= n; i++) {
    const q = poseOf(part, ctx.model.solve((i / n) * TAU));
    if (!q) return null;
    if (prev !== null) acc += Math.atan2(Math.sin(q[2] - prev), Math.cos(q[2] - prev));
    else acc = q[2];
    prev = q[2];
    lo = Math.min(lo, acc);
    hi = Math.max(hi, acc);
  }
  // a part that ends the cycle at another angle indexes (a Geneva wheel) and is not an oscillation
  if (Math.abs(acc - (poseOf(part, ctx.model.solve(0))?.[2] ?? acc)) > 1e-3) return null;
  return hi - lo < TAU - 0.2 ? [lo, hi] : null;
}

const R_STOP = 6;

export function stops(ctx: RuleContext, o: StopSpec): string[] {
  const margin = o.margin ?? (2 * Math.PI) / 180;
  const [pz0, pz1] = heights(o.part);
  const reach = Math.max(...o.part.shape.outer.map(([x, y]) => Math.hypot(x, y)));
  const RS = Math.max(20, reach * 0.7);
  const top = pz0 + (pz1 - pz0) * 0.7;
  const out: string[] = [];
  for (const [k, a0, sg] of [[0, o.range[1] + margin, 1], [1, o.range[0] - margin, -1]] as const) {
    let found: Vec2 | null = null;
    for (let s = 0; s < 0.7; s += 0.002) {
      const a = a0 + sg * s;
      const p: Vec2 = [o.pivot[0] + RS * Math.cos(a), o.pivot[1] + RS * Math.sin(a)];
      if (ctx.clearance(p, R_STOP, ctx.b1, top + 2.3, (t) => t.isBase === true) >= 1) {
        found = p;
        break;
      }
    }
    if (!found) continue;
    const at: [number, number, number] = [found[0], found[1], 0];
    const G = { at, joints: [o.joint], ex: 0 };
    ctx.add(bumper(`${o.joint}-stop${k}`, 4.3, 2 * R_STOP, { ...G, name: k ? "" : `Stop bumper, neoprene sleeve Ø${2 * R_STOP}`, qty: k ? 0 : 2, z0: ctx.b1, z1: top }));
    ctx.add(screw(`${o.joint}-stop${k}-sc`, "button", 4, top - ctx.b1 + 6, { ...G, face: top, dir: -1, name: k ? "" : undefined, qty: k ? 0 : 2 }));
    out.push(`${o.joint}-stop${k}`);
  }
  return out;
}
