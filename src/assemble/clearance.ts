// A15: zero clashes over the full cycle. Every pair of solids that move relative to each other and share a z range is
// tested for interpenetration of their outlines at n phases. Pairs that are one body, one group, or allowed by
// design are skipped.
import { TAU, xf } from "../core/geom";
import { overlap, region, type Region } from "../core/poly";
import type { Solid } from "../hardware/solid";
import type { MechanismModel } from "../model/types";
import type { Assembly } from "./index";
import { indexParts, isGround, solidPose } from "./pose";

export interface Clash {
  a: string;
  b: string;
  /** Phase of the deepest contact. */
  u: number;
  /** Penetration, mm. */
  depth: number;
}

/** Penetration below this is touching, not clashing (polygon discretisation of circles). */
export const CLASH_TOL = 0.1;

export function clearance(model: MechanismModel, assembly: Assembly, n = 72): Clash[] {
  const parts = indexParts(model);
  // traced-point markers ride a part and are not hardware; faint internals sit inside their bought unit
  const S = assembly.solids.filter((t) => !t.faint && t.role !== "trace");
  const motionKey = (t: Solid) => (t.motion ? `m:${JSON.stringify(t.motion)}:${t.body}` : isGround(parts, t.body) ? "ground" : t.body);
  const keys = S.map(motionKey);
  const contact = new Set((model.cams ?? []).flatMap((c) => [`${c.cam}|${c.follower}`, `${c.follower}|${c.cam}`]));
  const pairs: [number, number][] = [];
  for (let i = 0; i < S.length; i++)
    for (let k = i + 1; k < S.length; k++) {
      if (keys[i] === keys[k]) continue;
      const a = S[i]!;
      const b = S[k]!;
      if (a.group && a.group === b.group) continue;
      if (a.allow?.includes(b.id) || b.allow?.includes(a.id) || contact.has(`${a.id}|${b.id}`)) continue;
      if (Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0) <= 0.05) continue;
      pairs.push([i, k]);
    }
  const worst = new Map<string, Clash>();
  for (let step = 0; step < n; step++) {
    const u = (step / n) * TAU;
    const s = model.solve(u);
    const regs: (Region | null)[] = S.map((t) => {
      const q = solidPose(model, parts, t, s, u);
      return q ? region(xf(t.outer, q), t.holes.map((h) => xf(h, q))) : null;
    });
    for (const [i, k] of pairs) {
      const ra = regs[i];
      const rb = regs[k];
      if (!ra || !rb) continue;
      const d = overlap(ra, rb);
      if (d <= CLASH_TOL) continue;
      const key = `${S[i]!.id}|${S[k]!.id}`;
      const w = worst.get(key);
      if (!w || d > w.depth) worst.set(key, { a: S[i]!.id, b: S[k]!.id, u, depth: d });
    }
  }
  return [...worst.values()].sort((x, y) => y.depth - x.depth);
}
