// J13: a compliant joint the model declares (MechanismModel.compliant): a flexure neck joining a lever to the block it
// is cut from. The neck is drawn rigid; the model's `bend` overlay shows its bend and stress zone. The rule adds a stop
// pin each side just past the lever's swing, so the neck is never bent beyond its range (F5), and clamps the blank's
// ground block to the base under a clamp plate with two screws and two dowels (F1, F2).
import { bbox, type Vec2 } from "../core/geom";
import { dowel, plate, screw } from "../hardware/primitives";
import { poseOf } from "../model/pose";
import type { CompliantJoint, Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Margin of a stop past the end of the swing, radians. */
const MARGIN = (2 * Math.PI) / 180;

function build(ctx: RuleContext, j: CompliantJoint): void {
  const J = ctx.joint(j.id)!;
  const c = j.spec;
  const at = ctx.s0.pts[c.at];
  const lever = ctx.parts[c.lever];
  const ground = ctx.parts[c.ground];
  const gs = ctx.solidOf[c.ground];
  const ls = ctx.solidOf[c.lever];
  if (!at || !lever || !ground || !gs || !ls) return;
  // the stops: pins either side of the lever, at 70 % of its reach, just past each end of its swing
  const reach = Math.max(...lever.shape.outer.map(([x, y]) => Math.hypot(x, y)));
  const w = Math.max(...lever.shape.outer.map(([, y]) => Math.abs(y)));
  const R = 0.7 * reach;
  const half = Math.asin(Math.min(0.9, (w + 2.5) / R));
  const ends: [number, number][] = [
    [c.range[0] - half - MARGIN, -1],
    [c.range[1] + half + MARGIN, 1],
  ];
  ends.forEach(([a], k) => {
    const p: Vec2 = [at[0] + R * Math.cos(a), at[1] + R * Math.sin(a)];
    ctx.add(dowel(`${j.id}-stop${k}`, 5, { body: "ground", at: [p[0], p[1], 0], z0: ctx.b1 - 4, z1: ls.z1 + 1, ex: ls.ex, joints: [j.id], kind: "stop", name: k ? "" : "Stop pin Ø5, hardened, just past each end of the swing", qty: k ? 0 : 2, why: "keeps the neck within its elastic range (F5)" }));
    (J.serves.F5 ??= []).push(`${j.id}-stop${k}`);
  });
  // the blank's ground block clamped to the base: a clamp plate over it, two screws through both, two dowels
  const g = poseOf(ground, ctx.s0)!;
  const [x0, y0, x1, y1] = bbox(ground.shape.outer.map(([x, y]): Vec2 => [g[0] + x * Math.cos(g[2]) - y * Math.sin(g[2]), g[1] + x * Math.sin(g[2]) + y * Math.cos(g[2])]));
  const m = 3;
  const rect: Vec2[] = [[x0 + m, y0 + m], [x1 - m, y0 + m], [x1 - m, y1 - m], [x0 + m, y1 - m]];
  const cp = plate(`${j.id}-clamp`, rect, { body: "ground", kind: "plate", name: `Clamp plate ${fmt(x1 - x0 - 2 * m)} x ${fmt(y1 - y0 - 2 * m)} x 4 over the blank's block`, z0: gs.z1, z1: gs.z1 + 4, ex: gs.ex + 1, joints: [j.id], mat: "Steel S235, zinc plated" });
  ctx.add(cp);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const dx = (x1 - x0) / 2 - m - 5;
  for (const [k, s] of [[0, -1], [1, 1]] as const) {
    ctx.add(screw(`${j.id}-csc${k}`, "socket", 4, gs.z1 + 4 - ctx.b1 + 6, { body: "ground", at: [cx + s * dx, cy, 0], face: gs.z1 + 4, dir: -1, ex: gs.ex + 2, joints: [j.id], name: k ? "" : undefined, qty: k ? 0 : 2 }));
    ctx.add(dowel(`${j.id}-cdw${k}`, 3, { body: "ground", at: [cx, cy + s * ((y1 - y0) / 2 - m - 4), 0], z0: ctx.b1 - 5, z1: gs.z1 + 4, ex: gs.ex, joints: [j.id], name: k ? "" : "Dowel pin Ø3, blank to base", qty: k ? 0 : 2 }));
  }
  (J.serves.F1 ??= []).push(`${j.id}-cdw0`, `${j.id}-cdw1`);
  (J.serves.F2 ??= []).push(cp.id);
  J.note = `Flexure neck ${c.neck} joining the ${c.lever} to its block: the neck drawn rigid with its bend shown by the overlay; stop pins just past each end of the ${fmt(((c.range[1] - c.range[0]) * 180) / Math.PI)}° swing (F5); the blank clamped to the base under a plate, screwed and dowelled (F1, F2).`;
  J.badge = ["neck within range", "ok"];
}

export const j13: Rule = {
  id: "j13-compliant",
  tier: "AUTO",
  ids: ["J13", "F1", "F2", "F5"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J13"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "compliant") build(ctx, j);
  },
};
