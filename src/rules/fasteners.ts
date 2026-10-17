// Stage 3 (A8, M4), after the polish so hand-added screws get the same treatment. Every head without a shank gets its
// threaded shank into the part it fastens; every plate a shank passes gets a clearance hole, tapped where the shank
// ends; a blind tapped hole is a mark, not a hole; two screws meeting in a standoff stop short of its middle; a
// countersunk head gets its countersink.
import { circle, type Vec2 } from "../core/geom";
import { edgeDist, inside, toLocal } from "../core/poly";
import { shank } from "../hardware/primitives";
import type { Solid } from "../hardware/solid";
import type { SolidKind } from "../style/kinds";
import { isGround } from "../assemble/pose";
import type { RuleContext } from "./types";

const PLATE: ReadonlySet<SolidKind> = new Set<SolidKind>(["part", "base", "plate", "bracket", "housing", "bridge", "standoff", "spigot", "wearStrip", "retainerPlate", "gib", "stop", "eccentric", "shim"]);
const isPlate = (t: Solid) => PLATE.has(t.kind) && !t.motion && !t.faint;

export function rigid(ctx: RuleContext, a: Solid, b: Solid): boolean {
  if (a.motion || b.motion) return a.body === b.body && JSON.stringify(a.motion) === JSON.stringify(b.motion);
  return a.body === b.body || (isGround(ctx.parts, a.body) && isGround(ctx.parts, b.body));
}

export function fasteners(ctx: RuleContext): void {
  const S = ctx.solids;
  const W = new Map<Solid, Vec2 | null>();
  const at = (t: Solid): Vec2 | null => {
    if (!W.has(t)) {
      const q = ctx.world(t);
      W.set(t, q ? [q[0], q[1]] : null);
    }
    return W.get(t)!;
  };
  const local = (t: Solid, P: Vec2): Vec2 | null => {
    const q = ctx.world(t);
    return q ? toLocal(q, P) : null;
  };
  const inMaterial = (t: Solid, P: Vec2, r: number): boolean => {
    const l = local(t, P);
    if (!l || !inside(t.outer, l)) return false;
    return !t.holes.some((h) => inside(h, l) && edgeDist(h, l) > r * 0.6);
  };
  const ctxRule = ctx.rule;
  ctx.rule = "fasteners";

  // 1. a shank for every head that has none
  for (const h of S.filter((t) => t.kind === "head")) {
    const grp = h.group ?? h.id;
    if (S.some((t) => t !== h && t.group === grp && (t.kind === "shank" || t.kind === "shaft"))) continue;
    const P = at(h);
    if (!P) continue;
    const d = h.thread ?? 5;
    const cand = S.filter((t) => t !== h && isPlate(t) && rigid(ctx, t, h) && (() => { const l = local(t, P); return !!l && inside(t.outer, l); })());
    const below = cand.find((t) => Math.abs(t.z1 - h.z0) < 0.4);
    const above = cand.find((t) => Math.abs(t.z0 - h.z1) < 0.4);
    const T = below ?? above;
    if (!T) continue;
    const dir = below ? -1 : 1;
    const next = cand.find((t) => t !== T && Math.abs(dir < 0 ? t.z1 - T.z0 : t.z0 - T.z1) < 0.4);
    const reach = next ? Math.min(1.5 * d, next.z1 - next.z0 - 0.5) : -0.4;
    const zA = dir < 0 ? h.z0 : h.z1;
    const zB = dir < 0 ? T.z0 - reach : T.z1 + reach;
    const tapped = next ?? T;
    h.group = grp;
    const s = shank(`${h.id}-sh`, d, {
      body: h.body,
      at: h.at,
      z0: Math.min(zA, zB),
      z1: Math.max(zA, zB),
      // thread only where it engages: in the part it ends in (never along a shoulder or a clearance hole)
      threadZ: dir < 0 ? [Math.min(zA, zB), Math.min(tapped.z1, Math.max(zA, zB))] : [Math.max(tapped.z0, Math.min(zA, zB)), Math.max(zA, zB)],
      ex: h.ex,
      joints: [...h.joints],
      group: grp,
    });
    ctx.add(s);
  }

  // 2. two screws meeting in a short standoff each stop short of its middle
  const shanks = S.filter((t) => t.kind === "shank" && at(t));
  for (let i = 0; i < shanks.length; i++)
    for (let k = i + 1; k < shanks.length; k++) {
      const a = shanks[i]!;
      const b = shanks[k]!;
      if (a.group && a.group === b.group) continue;
      const pa = at(a)!;
      const pb = at(b)!;
      if (!rigid(ctx, a, b) || Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) > 0.3) continue;
      if (Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0) <= 0) continue;
      const [lo, hi] = a.z0 < b.z0 ? [a, b] : [b, a];
      const mid = (Math.max(lo.z0, hi.z0) + Math.min(lo.z1, hi.z1)) / 2;
      lo.z1 = Math.min(lo.z1, mid - 0.4);
      hi.z0 = Math.max(hi.z0, mid + 0.4);
      for (const t of [lo, hi]) if (t.threadZ) t.threadZ = [Math.max(t.threadZ[0], t.z0), Math.min(t.threadZ[1], t.z1)];
    }

  // 3. holes where shanks pass: clearance through, tapped where they end, a mark where the tapped hole is blind
  for (const sh of S.filter((t) => t.kind === "shank")) {
    const P = at(sh);
    if (!P) continue;
    const r = (sh.d ?? 3) / 2;
    const h = S.find((t) => t.kind === "head" && t.group === sh.group && t !== sh);
    const headUp = h ? h.z0 + h.z1 > sh.z0 + sh.z1 : true;
    const far = headUp ? sh.z0 : sh.z1;
    for (const t of S) {
      if (t === sh || t.group === sh.group || !isPlate(t) || !rigid(ctx, t, sh)) continue;
      if (Math.min(t.z1, sh.z1) - Math.max(t.z0, sh.z0) < 0.3 || !inMaterial(t, P, r)) continue;
      const l = local(t, P)!;
      const endsInside = far > t.z0 + 0.2 && far < t.z1 - 0.2;
      const endsAtFace = Math.abs(far - (headUp ? t.z0 : t.z1)) <= 0.25;
      if (endsInside) t.marks.push({ kind: "thread", pts: circle(r + 0.45, l[0], l[1], 24) });
      else if (endsAtFace) {
        t.holes.push(circle(r, l[0], l[1], 24));
        t.marks.push({ kind: "thread", pts: circle(r + 0.45, l[0], l[1], 24) });
      } else t.holes.push(circle(r + ctx.form.fasteners.clearance, l[0], l[1], 24));
      sh.allow = [...(sh.allow ?? []), t.id];
    }
  }

  // 4. countersinks for countersunk heads (M4)
  for (const h of S.filter((t) => t.kind === "head" && t.headKind === "csk")) {
    const P = at(h);
    if (!P) continue;
    const T = S.find((t) => t !== h && isPlate(t) && rigid(ctx, t, h) && Math.abs(t.z1 - h.z1) < 0.3 && local(t, P) && inside(t.outer, local(t, P)!));
    if (!T) continue;
    const l = local(T, P)!;
    T.marks.push({ kind: "chamfer", pts: circle((h.D ?? 6) / 2 + 0.2, l[0], l[1], 28) });
  }
  ctx.rule = ctxRule;
}
