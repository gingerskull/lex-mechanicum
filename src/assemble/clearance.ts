// A15: zero clashes over the full cycle. Every pair of solids that move relative to each other and share a z range is
// tested for interpenetration of their outlines at n phases. Pairs that are one body, one group, or allowed by
// design are skipped. Two solids on different axes (src/core/axis.ts) are tested by their world boxes, except a posed
// solid whose frame's axis stands along the base z (a sheave half or a belt sliding up a z shaft): it is tested with
// the z solids by its outline in plan, as they are.
import { boxOverlap, frameAxis, framePoint } from "../core/axis";
import { TAU, xf } from "../core/geom";
import { overlap, region, type Region } from "../core/poly";
import type { Solid } from "../hardware/solid";
import type { MechanismModel } from "../model/types";
import type { Assembly } from "./index";
import { extentAt, indexParts, isGround, planeKey, ringsAt, solidBox, solidPose } from "./pose";

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
  // cam contacts and crossed meshes touch by design (their teeth are drawn whole)
  const contact = new Set([...(model.cams ?? []).map((c) => [c.cam, c.follower]), ...(model.meshes ?? []).map((m) => [m.a, m.b])].flatMap(([a, b]) => [`${a}|${b}`, `${b}|${a}`]));
  const pairs: [number, number][] = [];
  for (let i = 0; i < S.length; i++)
    for (let k = i + 1; k < S.length; k++) {
      if (keys[i] === keys[k]) continue;
      const a = S[i]!;
      const b = S[k]!;
      if (a.group && a.group === b.group) continue;
      if (a.allow?.includes(b.id) || b.allow?.includes(a.id) || contact.has(`${a.id}|${b.id}`)) continue;
      if (planeKey(a) === planeKey(b) && Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0) <= 0.05) continue;
      pairs.push([i, k]);
    }
  const worst = new Map<string, Clash>();
  for (let step = 0; step < n; step++) {
    const u = (step / n) * TAU;
    const s = model.solve(u);
    const poses = S.map((t) => solidPose(model, parts, t, s, u));
    const regs: (Region | null)[] = S.map((t, i) => {
      const q = poses[i];
      if (!q) return null;
      const r = ringsAt(parts, t, s);
      return region(xf(r.outer, q), r.holes.map((h) => xf(h, q)));
    });
    // z solids and posed solids standing along z: their outline in plan and their z range
    const flats = S.map((t, i): { r: Region; z: [number, number] } | null => {
      if (!t.axis) return regs[i] ? { r: regs[i]!, z: [t.z0, t.z1] } : null;
      const f = t.axis === "p" && t.frame ? s.frames?.[t.frame] : undefined;
      const q = poses[i];
      if (!f || !q || Math.abs(frameAxis(f)[2]) < 1 - 1e-9) return null;
      const [w0, w1] = extentAt(t, f);
      const plan = (P: typeof t.outer) => xf(P, q).map((p): [number, number] => {
        const X = framePoint(f, p, 0);
        return [X[0], X[1]];
      });
      const r = ringsAt(parts, t, s);
      const za = framePoint(f, [q[0], q[1]], w0)[2];
      const zb = framePoint(f, [q[0], q[1]], w1)[2];
      return { r: region(plan(r.outer), r.holes.map(plan)), z: [Math.min(za, zb), Math.max(za, zb)] };
    });
    for (const [i, k] of pairs) {
      const a = S[i]!;
      const b = S[k]!;
      let d: number;
      const fa = flats[i];
      const fb = flats[k];
      if (planeKey(a) !== planeKey(b) && fa && fb) {
        if (Math.min(fa.z[1], fb.z[1]) - Math.max(fa.z[0], fb.z[0]) <= 0.05) continue;
        d = overlap(fa.r, fb.r);
      } else if (planeKey(a) !== planeKey(b)) {
        const qa = poses[i];
        const qb = poses[k];
        if (!qa || !qb) continue;
        d = boxOverlap(solidBox(a, qa, s, parts), solidBox(b, qb, s, parts));
      } else {
        const ra = regs[i];
        const rb = regs[k];
        if (!ra || !rb) continue;
        d = overlap(ra, rb);
      }
      if (d <= CLASH_TOL) continue;
      const key = `${S[i]!.id}|${S[k]!.id}`;
      const w = worst.get(key);
      if (!w || d > w.depth) worst.set(key, { a: S[i]!.id, b: S[k]!.id, u, depth: d });
    }
  }
  return [...worst.values()].sort((x, y) => y.depth - x.depth);
}
