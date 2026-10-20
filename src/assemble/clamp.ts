// A12: a rotating stack never touches a ground face, so tightening never squeezes a moving part. Contact through a
// bearing's inner race is allowed, and a thrust washer is the designed sliding face (F4). Solids on different axes
// (src/core/axis.ts) touch when their world boxes share a face over an area. M6: hole walls.
import { TAU, bbox, xf } from "../core/geom";
import type { Box3 } from "../core/axis";
import { edgeDist, overlap, region } from "../core/poly";
import type { Solid } from "../hardware/solid";
import type { MechanismModel } from "../model/types";
import type { Assembly } from "./index";
import { indexParts, isGround, solidBox, solidPose } from "./pose";

const maxR = (t: Solid, cx: number, cy: number, q: [number, number, number]) =>
  Math.max(...xf(t.outer, q).map(([x, y]) => Math.hypot(x - cx, y - cy)));

/** Two boxes meet face to face: one direction where a face of one lies on a face of the other, overlap in the other two. */
function boxesTouch(a: Box3, b: Box3): boolean {
  for (let k = 0; k < 3; k++) {
    if (Math.abs(a[k + 3]! - b[k]!) > 0.05 && Math.abs(b[k + 3]! - a[k]!) > 0.05) continue;
    const o = [0, 1, 2].filter((j) => j !== k).map((j) => Math.min(a[j + 3]!, b[j + 3]!) - Math.max(a[j]!, b[j]!));
    if (o.every((v) => v > 0.05)) return true;
  }
  return false;
}

export function clampCheck(model: MechanismModel, assembly: Assembly, n = 12): string[] {
  const parts = indexParts(model);
  const S = assembly.solids.filter((t) => !t.faint);
  const moving = (t: Solid) => !!t.motion || !isGround(parts, t.body);
  const out = new Set<string>();
  for (let step = 0; step < n; step++) {
    const u = (step / n) * TAU;
    const s = model.solve(u);
    const pose = new Map(S.map((t) => [t, solidPose(model, parts, t, s, u)] as const));
    for (const r of S) {
      if (!moving(r) || r.kind === "thrustWasher") continue;
      for (const g of S) {
        if (moving(g) || g.kind === "thrustWasher") continue;
        const qr = pose.get(r);
        const qg = pose.get(g);
        if (r.axis !== g.axis) {
          if (qr && qg && boxesTouch(solidBox(r, qr), solidBox(g, qg))) out.add(`${r.id} (turning) touches the ground face of ${g.id}`);
          continue;
        }
        if (Math.abs(r.z1 - g.z0) > 0.05 && Math.abs(g.z1 - r.z0) > 0.05) continue;
        if (!qr || !qg) continue;
        const ra = region(xf(r.outer, qr), r.holes.map((h) => xf(h, qr)));
        const rb = region(xf(g.outer, qg), g.holes.map((h) => xf(h, qg)));
        // touching faces overlap in plan when a vertex of one lies inside the other's material
        if (overlap(ra, rb) <= 0.05) continue;
        const brg = r.kind === "bearing" ? r : g.kind === "bearing" ? g : null;
        if (brg && brg.d !== undefined && brg.D !== undefined) {
          const qb = pose.get(brg)!;
          const other = brg === r ? g : r;
          const qo = pose.get(other)!;
          const inner = (brg.d + (brg.D - brg.d) * 0.36) / 2;
          if (maxR(other, qb[0], qb[1], qo) <= inner + 0.05) continue;
        }
        out.add(`${r.id} (turning) touches the ground face of ${g.id}`);
      }
    }
  }
  return [...out];
}

/** M6: walls round holes in plates: 1.2 mm round bearing seats, 1.5 mm elsewhere. */
export function edgeCheck(assembly: Assembly): string[] {
  const out: string[] = [];
  const kinds = new Set(["part", "plate", "bracket", "bridge", "housing"]);
  for (const t of assembly.solids) {
    if (!kinds.has(t.kind)) continue;
    for (const h of t.holes) {
      const [x0, y0, x1, y1] = bbox(h);
      const r = (x1 - x0) / 2;
      if (Math.abs((y1 - y0) / 2 - r) > 0.05) continue;
      const c: [number, number] = [(x0 + x1) / 2, (y0 + y1) / 2];
      // round holes only: a window with a square bounding box is not one
      if (h.some((p) => Math.abs(Math.hypot(p[0] - c[0], p[1] - c[1]) - r) > 0.1)) continue;
      const wall = edgeDist(t.outer, c) - r;
      const seat = assembly.solids.some((b) => b.kind === "bearing" && b.body === t.body && Math.hypot(b.at[0] - c[0], b.at[1] - c[1]) < 0.1);
      const min = seat ? 1.2 : 1.5;
      if (wall < min - 0.05) out.push(`${t.id}: wall ${wall.toFixed(2)} mm round the Ø${(2 * r).toFixed(1)} hole at (${c[0].toFixed(1)}, ${c[1].toFixed(1)}), needs ${min}`);
    }
  }
  return out;
}
