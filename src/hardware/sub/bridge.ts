// H.bridge (D5, F1, A11): a bridge over one or more pivots on two spigoted Ø10 posts, placed where nothing moving ever
// passes, high enough to clear every sweep under its footprint, and with its box clear of the swept box of any part
// turning on an axis in plan. One post's spigot sits in a round hole, the other in a slot toward it, so the bridge goes
// back square after a rebuild.
import { TAU, bbox, circle, roundedPoly, type Vec2 } from "../../core/geom";
import { depth, inside, overlap, region } from "../../core/poly";
import type { RuleContext } from "../../rules/types";
import { disc, hullOf, screw, spigot, standoff, plate } from "../primitives";
import type { Solid } from "../solid";
import { STANDOFF } from "../tables";

export interface BridgeSpec {
  id: string;
  /** Pivots the bridge holds, world mm. */
  over: Vec2[];
  /** Lowest allowed underside: above the top of every stack it caps. */
  zMin: number;
  /** Boss radius round each pivot. */
  rBoss?: number;
  joint: string;
}

export interface BridgeResult {
  bridge: Solid;
  posts: [Vec2, Vec2];
  z0: number;
  z1: number;
}

const POST_MARGIN = 2;
const THICK = 6;

/** Post distance from the pivot beyond which the bridge is built as two arms. */
const ARM_FROM = 40;
const FILLET = 6;

const densify = (P: Vec2[], step = 1): Vec2[] =>
  P.flatMap((p, i) => {
    const q = P[(i + 1) % P.length]!;
    const k = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / step));
    return Array.from({ length: k }, (_, j): Vec2 => [p[0] + ((q[0] - p[0]) * j) / k, p[1] + ((q[1] - p[1]) * j) / k]);
  });

/** Two straight arms of half-width w from a boss of radius rB at P to bosses at the posts, the crotch filleted. */
function arms(P: Vec2, posts: [Vec2, Vec2], rB0: number, w: number): Vec2[] {
  const rB = Math.max(rB0, w + 0.5);
  const shapes = [circle(rB, P[0], P[1], 64), ...posts.map((q) => hullOf([[P[0], P[1], w], [q[0], q[1], w]]))].map((t) => densify(t));
  const ang = (p: Vec2) => Math.atan2(p[1] - P[1], p[0] - P[0]);
  let pts = shapes.flatMap((t, i) => t.filter((p) => shapes.every((u, j) => j === i || !inside(u, p))));
  // the fillet: a circle tangent to both inner edges, on the bisector of the arms
  const u = posts.map((q) => {
    const L = Math.hypot(q[0] - P[0], q[1] - P[1]);
    return [(q[0] - P[0]) / L, (q[1] - P[1]) / L] as Vec2;
  });
  const bx = u[0]![0] + u[1]![0];
  const by = u[0]![1] + u[1]![1];
  const bl = Math.hypot(bx, by);
  const half = Math.acos(Math.max(-1, Math.min(1, u[0]![0] * u[1]![0] + u[0]![1] * u[1]![1]))) / 2;
  const dc = (w + FILLET) / Math.sin(half);
  // a wide V has its crotch inside the pivot boss: the union is already right there
  if (bl > 1e-6 && half > 0.1 && dc - FILLET > rB) {
    const b: Vec2 = [bx / bl, by / bl];
    const C: Vec2 = [P[0] + b[0] * dc, P[1] + b[1] * dc];
    const T = u.map((v): Vec2 => {
      const t = dc * Math.cos(half);
      return [P[0] + v[0] * t + (b[0] - v[0] * Math.cos(half)) * (w / Math.sin(half)), P[1] + v[1] * t + (b[1] - v[1] * Math.cos(half)) * (w / Math.sin(half))];
    });
    const a0 = ang(T[0]!);
    const a1 = ang(T[1]!);
    const within = (p: Vec2) => {
      const t = ang(p);
      const span = Math.atan2(Math.sin(a1 - a0), Math.cos(a1 - a0));
      const rel = Math.atan2(Math.sin(t - a0), Math.cos(t - a0));
      return span > 0 ? rel > 0 && rel < span : rel < 0 && rel > span;
    };
    const dT = Math.hypot(T[0]![0] - P[0], T[0]![1] - P[1]);
    pts = pts.filter((p) => !(within(p) && Math.hypot(p[0] - P[0], p[1] - P[1]) <= dT + FILLET + 0.5));
    const c0 = Math.atan2(T[0]![1] - C[1], T[0]![0] - C[0]);
    const c1 = Math.atan2(T[1]![1] - C[1], T[1]![0] - C[0]);
    // the short way round the fillet centre, on the side facing the pivot
    let d1 = c1 - c0;
    while (d1 > Math.PI) d1 -= TAU;
    while (d1 < -Math.PI) d1 += TAU;
    for (let i = 0; i <= 12; i++) {
      const t = c0 + (d1 * i) / 12;
      pts.push([C[0] + FILLET * Math.cos(t), C[1] + FILLET * Math.sin(t)]);
    }
  }
  return pts.sort((p, q) => ang(p) - ang(q));
}

export function bridge(ctx: RuleContext, o: BridgeSpec): BridgeResult | null {
  const base = ctx.get("base");
  if (!base) return null;
  const rB = o.rBoss ?? 10.5;
  const c: Vec2 = [o.over.reduce((s, p) => s + p[0], 0) / o.over.length, o.over.reduce((s, p) => s + p[1], 0) / o.over.length];
  const R = STANDOFF.D / 2;
  // candidates in order of distance; the sweep clearance, the costly test, is run only for a pair that would beat the
  // best so far (cost >= rA + rB, so the search stops as soon as no pair can)
  const cands: { p: Vec2; r: number; a: number; ok?: boolean }[] = [];
  for (let r = 24; r <= 124; r += 4)
    for (let k = 0; k < 60; k++) {
      const a = (k / 60) * TAU;
      const p: Vec2 = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
      if (depth(base.outer, [], p) < R + 9) continue;
      if (o.over.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 16)) continue;
      cands.push({ p, r, a });
    }
  const clear = (x: (typeof cands)[0]) => (x.ok ??= !ctx.hits(x.p, R + POST_MARGIN, ctx.b1, ctx.b1 + 80, (t) => t.isBase === true));
  // a part on an x, y or posed axis is tested against the bridge by world boxes (A15): the box round the bosses and
  // posts must stay off its swept box wherever their heights meet, or the bridge would sit in it
  const outs = ctx
    .sweeps()
    .filter((sw) => (sw.part.axis === "x" || sw.part.axis === "y" || sw.part.axis === "p") && sw.regions.length && sw.z1 > o.zMin - 0.8 && sw.z0 < o.zMin + THICK + 0.8)
    .map((sw) => bbox(sw.regions.flatMap((g): Vec2[] => [[g.box[0], g.box[1]], [g.box[2], g.box[3]]])));
  const boxFree = (A: (typeof cands)[0], B: (typeof cands)[0]) => {
    if (!outs.length) return true;
    const r = R + 1.5;
    const [x0, y0, x1, y1] = bbox([...o.over.flatMap(([x, y]): Vec2[] => [[x - rB, y - rB], [x + rB, y + rB]]), ...[A.p, B.p].flatMap(([x, y]): Vec2[] => [[x - r, y - r], [x + r, y + r]])]);
    return outs.every((b) => b[0] >= x1 + 0.8 || b[2] <= x0 - 0.8 || b[1] >= y1 + 0.8 || b[3] <= y0 - 0.8);
  };
  let best: [typeof cands[0], typeof cands[0]] | null = null;
  let cost = Infinity;
  for (let i = 0; i < cands.length && 2 * cands[i]!.r < cost; i++) {
    const A = cands[i]!;
    for (let j = i + 1; j < cands.length && A.r + cands[j]!.r < cost; j++) {
      const B = cands[j]!;
      const sep = Math.abs(Math.atan2(Math.sin(A.a - B.a), Math.cos(A.a - B.a))) * (180 / Math.PI);
      if (sep < 50 || sep > 160 || Math.hypot(A.p[0] - B.p[0], A.p[1] - B.p[1]) < 20) continue;
      const k = A.r + B.r + 0.3 * Math.abs(sep - 100);
      if (k < cost && boxFree(A, B) && clear(A) && clear(B)) {
        cost = k;
        best = [A, B];
      }
    }
  }
  if (!best) return null;
  const posts: [Vec2, Vec2] = [best[0].p, best[1].p];
  // posts far from a single pivot: two arms with a filleted crotch, material only where the load runs (D2, M7);
  // close posts: one plate round all of them
  const far = o.over.length === 1 && Math.min(best[0].r, best[1].r) > ARM_FROM;
  const outer = far
    ? arms(o.over[0]!, posts, rB, R + 1.5)
    : hullOf([...o.over.map(([x, y]): [number, number, number] => [x, y, rB]), ...posts.map(([x, y]): [number, number, number] => [x, y, R + 1.5])]);
  // underside above every sweep that passes under the footprint
  const foot = region(outer, []);
  let z0 = o.zMin;
  for (const sw of ctx.sweeps()) if (sw.regions.some((g) => overlap(foot, g) > 0.05)) z0 = Math.max(z0, sw.z1 + 0.8);
  // highest first: a solid whose top cannot raise the underside any more is never swept
  for (const t of [...ctx.solids].sort((p, q) => q.z1 - p.z1)) {
    if (t.z1 + 0.8 <= z0) break;
    if (t.body === "ground" && !t.motion) continue;
    if (ctx.solidOf[t.id] === t) continue;
    if (ctx.swept(t).some((g) => overlap(foot, g) > 0.05)) z0 = Math.max(z0, t.z1 + 0.8);
  }
  z0 = Math.round(z0 * 2) / 2;
  const z1 = z0 + THICK;
  const ex = ctx.levels.length;
  const u: Vec2 = [(posts[1][0] - posts[0][0]) / 40, (posts[1][1] - posts[0][1]) / 40];
  const S2 = posts[1];
  const b = plate(o.id, outer, {
    name: `Bridge over ${o.over.length > 1 ? "the pivots" : "the pivot"}, on two spigoted posts`,
    kind: "bridge",
    z0,
    z1,
    ex,
    holes: [disc(STANDOFF.spigotD / 2, ...posts[0]), roundedPoly([[S2[0] - u[0], S2[1] - u[1]], [S2[0] + u[0], S2[1] + u[1]]], STANDOFF.spigotD / 2)],
    joints: [o.joint, `${o.id}-post`],
    why: "holds the axle's top end so it works in double shear (A9, A11)",
  });
  ctx.add(b);
  posts.forEach((p, k) => {
    const at: [number, number, number] = [p[0], p[1], 0];
    const j = [`${o.id}-post`];
    ctx.add(standoff(`${o.id}-post${k}`, { name: k ? "" : `Standoff Ø${STANDOFF.D} x ${+(z0 - ctx.b1).toFixed(1)}, M${STANDOFF.M}, Ø${STANDOFF.spigotD} h7 spigot`, qty: k ? 0 : 2, at, z0: ctx.b1, z1: z0, span: [-1, ex], joints: j }));
    ctx.add(spigot(`${o.id}-post${k}-spigot`, { at, z0, z1: z0 + 3, ex, joints: j, allow: [o.id] }));
    ctx.add(screw(`${o.id}-post${k}-top`, "button", STANDOFF.M, THICK + 1.5 * STANDOFF.M, { at, face: z1, dir: -1, ex, joints: j, name: k ? "" : undefined }));
    ctx.add(screw(`${o.id}-post${k}-bot`, "button", STANDOFF.M, ctx.b1 - ctx.b0 + 1.5 * STANDOFF.M, { at, face: ctx.b0, dir: 1, ex: -1, joints: j, name: k ? "" : undefined }));
  });
  ctx.joints.push({
    id: `${o.id}-post`,
    type: "post",
    at: posts[0],
    title: `Post · ${b.name}`,
    note: `Two Ø${STANDOFF.D} standoffs, ${+(z0 - ctx.b1).toFixed(1)} mm, where nothing moving passes; Ø${STANDOFF.spigotD} spigots in a round hole and a slot locate the bridge, M${STANDOFF.M} button heads from both sides.`,
    badge: ["located", "ok"],
    serves: { F1: [`${o.id}-post0-spigot`, `${o.id}-post1-spigot`] },
  });
  return { bridge: b, posts, z0, z1 };
}
