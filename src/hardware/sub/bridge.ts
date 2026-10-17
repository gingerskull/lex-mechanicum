// H.bridge (D5, F1, A11): a bridge over one or more pivots on two spigoted Ø10 posts, placed where nothing moving ever
// passes, high enough to clear every sweep under its footprint. One post's spigot sits in a round hole, the other in a
// slot toward it, so the bridge goes back square after a rebuild.
import { TAU, roundedPoly, type Vec2 } from "../../core/geom";
import { depth, overlap, region } from "../../core/poly";
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

export function bridge(ctx: RuleContext, o: BridgeSpec): BridgeResult | null {
  const base = ctx.get("base");
  if (!base) return null;
  const rB = o.rBoss ?? 10.5;
  const c: Vec2 = [o.over.reduce((s, p) => s + p[0], 0) / o.over.length, o.over.reduce((s, p) => s + p[1], 0) / o.over.length];
  const R = STANDOFF.D / 2;
  const cands: { p: Vec2; r: number; a: number }[] = [];
  for (let r = 24; r <= 84; r += 4)
    for (let k = 0; k < 60; k++) {
      const a = (k / 60) * TAU;
      const p: Vec2 = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
      if (depth(base.outer, [], p) < R + 9) continue;
      if (o.over.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 16)) continue;
      if (ctx.clearance(p, R + POST_MARGIN, ctx.b1, ctx.b1 + 80, (t) => t.isBase === true) < 0) continue;
      cands.push({ p, r, a });
    }
  let best: [typeof cands[0], typeof cands[0]] | null = null;
  let cost = Infinity;
  for (let i = 0; i < cands.length; i++)
    for (let j = i + 1; j < cands.length; j++) {
      const A = cands[i]!;
      const B = cands[j]!;
      const sep = Math.abs(Math.atan2(Math.sin(A.a - B.a), Math.cos(A.a - B.a))) * (180 / Math.PI);
      if (sep < 50 || sep > 160 || Math.hypot(A.p[0] - B.p[0], A.p[1] - B.p[1]) < 20) continue;
      const k = A.r + B.r + 0.3 * Math.abs(sep - 100);
      if (k < cost) {
        cost = k;
        best = [A, B];
      }
    }
  if (!best) return null;
  const posts: [Vec2, Vec2] = [best[0].p, best[1].p];
  const outer = hullOf([...o.over.map(([x, y]): [number, number, number] => [x, y, rB]), ...posts.map(([x, y]): [number, number, number] => [x, y, R + 1.5])]);
  // underside above every sweep that passes under the footprint
  const foot = region(outer, []);
  let z0 = o.zMin;
  for (const sw of ctx.sweeps()) if (sw.regions.some((g) => overlap(foot, g) > 0.05)) z0 = Math.max(z0, sw.z1 + 0.8);
  for (const t of ctx.solids) {
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
