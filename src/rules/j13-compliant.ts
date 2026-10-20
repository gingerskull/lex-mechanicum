// J13: a compliant joint the model declares (MechanismModel.compliant): a flexure neck joining a lever to the block it
// is cut from. The neck is drawn rigid; the model's `bend` overlay shows its bend and stress zone. The rule adds a stop
// pin each side just past the lever's swing, so the neck is never bent beyond its range (F5): on the lever's edge at
// the stop radius, the margin a fifth of the half swing; a lever that does not turn (a shuttle guided between two
// necks) is banked at the ends of its solved travel instead. It seats the blank's ground block on a ground plate of its
// own outline (the standoffs rule leaves the block and the neck alone) and clamps it to the base under a clamp plate
// with two screws and two dowels, reamed through block, clamp plate and seat (A6, F1, F2).
import { TAU, bbox, circle, xf, type Vec2 } from "../core/geom";
import { toLocal } from "../core/poly";
import { dowel, plate, screw } from "../hardware/primitives";
import { poseOf } from "../model/pose";
import type { Part } from "../model/types";
import type { CompliantJoint, Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Margin of a stop past the end of the swing or the travel, as a fraction of its half. */
export const STOP_MARGIN = 0.2;
/** Stop pin radius, mm. */
const R_PIN = 2.5;

/** The lever's half width on one side (+1 above, -1 below its x axis) where its outline crosses x. */
function edge(outer: Vec2[], x: number, side: 1 | -1): number {
  let best = 0;
  outer.forEach(([ax, ay], i) => {
    const [bx, by] = outer[(i + 1) % outer.length]!;
    if ((ax - x) * (bx - x) <= 0 && ax !== bx) best = Math.max(best, side * (ay + ((by - ay) * (x - ax)) / (bx - ax)));
  });
  return best;
}

/** A lever that keeps its angle over the cycle and moves: its travel axis, the ends of its travel along it. */
function guided(ctx: Pick<RuleContext, "model">, lever: Part, n = 90): { ax: Vec2; t: [number, number]; c0: Vec2; th: number } | null {
  const q = Array.from({ length: n }, (_, i) => poseOf(lever, ctx.model.solve((i / n) * TAU)));
  if (q.some((p) => !p)) return null;
  const P = q as [number, number, number][];
  if (P.some((p) => Math.abs(Math.atan2(Math.sin(p[2] - P[0]![2]), Math.cos(p[2] - P[0]![2]))) > 1e-6)) return null;
  let far: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < n; i++)
    for (let k = i + 1; k < n; k++) {
      const d = Math.hypot(P[k]![0] - P[i]![0], P[k]![1] - P[i]![1]);
      if (d > far[2]) far = [i, k, d];
    }
  if (far[2] < 1e-3) return null;
  // the axis points up the plan (+y), or along +x when it lies along x
  const flip = P[far[1]]![1] - P[far[0]]![1] < -1e-9 || (Math.abs(P[far[1]]![1] - P[far[0]]![1]) <= 1e-9 && P[far[1]]![0] < P[far[0]]![0]) ? -1 : 1;
  const ax: Vec2 = [(flip * (P[far[1]]![0] - P[far[0]]![0])) / far[2], (flip * (P[far[1]]![1] - P[far[0]]![1])) / far[2]];
  const t = P.map((p) => p[0] * ax[0] + p[1] * ax[1]);
  return { ax, t: [Math.min(...t), Math.max(...t)], c0: [P[0]![0], P[0]![1]], th: P[0]![2] };
}

function build(ctx: RuleContext, j: CompliantJoint): void {
  const J = ctx.joint(j.id)!;
  const c = j.spec;
  const at = ctx.s0.pts[c.at];
  const lever = ctx.parts[c.lever];
  const ground = ctx.parts[c.ground];
  const gs = ctx.solidOf[c.ground];
  const ls = ctx.solidOf[c.lever];
  if (!at || !lever || !ground || !gs || !ls) return;
  const g = poseOf(ground, ctx.s0)!;
  const G = xf(ground.shape.outer, g);
  const pin = (k: number, p: Vec2, name: string) => {
    ctx.add(dowel(`${j.id}-stop${k}`, 2 * R_PIN, { body: "ground", at: [p[0], p[1], 0], z0: ctx.b1 - 4, z1: ls.z1 + 1, ex: ls.ex, joints: [j.id], kind: "stop", name: k ? "" : name, qty: k ? 0 : 2, why: "keeps the neck within its elastic range (F5)" }));
    (J.serves.F5 ??= []).push(`${j.id}-stop${k}`);
  };
  const gd = guided(ctx, lever);
  let stopNote: string;
  if (gd) {
    // a guided lever: a pin at each end of its travel, past the body's end face by the margin, on the ground's side
    const { ax, t } = gd;
    const n: Vec2 = [-ax[1], ax[0]];
    const O = xf(lever.shape.outer, [0, 0, gd.th]);
    const along = O.map((p) => p[0] * ax[0] + p[1] * ax[1]);
    const w = Math.max(...O.map((p) => Math.abs(p[0] * n[0] + p[1] * n[1])));
    const gc = G.reduce((a, p): Vec2 => [a[0] + p[0] / G.length, a[1] + p[1] / G.length], [0, 0]);
    const side = Math.sign((gc[0] - gd.c0[0]) * n[0] + (gc[1] - gd.c0[1]) * n[1]) || 1;
    const lat = gd.c0[0] * n[0] + gd.c0[1] * n[1] + (side * w) / 2;
    const m = (STOP_MARGIN * (t[1] - t[0])) / 2;
    const ends = [t[0] + Math.min(...along) - m - R_PIN, t[1] + Math.max(...along) + m + R_PIN];
    ends.forEach((s, k) => pin(k, [s * ax[0] + lat * n[0], s * ax[1] + lat * n[1]], `Stop pin Ø${2 * R_PIN}, hardened, banking the ${c.lever} just past each end of its travel`));
    stopNote = `stop pins bank the ${c.lever} ${fmt(m)} mm past each end of its travel (F5)`;
  } else {
    // a turning lever: pins either side at 70 % of its reach, on its edge a fifth of the half swing past each end
    const reach = Math.max(...lever.shape.outer.map(([x, y]) => Math.hypot(x, y)));
    const R = 0.7 * reach;
    const m = (STOP_MARGIN * (c.range[1] - c.range[0])) / 2;
    const half = (side: 1 | -1) => {
      let al = 0.2;
      for (let k = 0; k < 8; k++) al = Math.asin(Math.min(0.9, (edge(lever.shape.outer, R * Math.cos(al), side) + R_PIN) / R));
      return al;
    };
    const ends = [c.range[0] - m - half(-1), c.range[1] + m + half(1)];
    ends.forEach((a, k) => pin(k, [at[0] + R * Math.cos(a), at[1] + R * Math.sin(a)], `Stop pin Ø${2 * R_PIN}, hardened, just past each end of the swing`));
    stopNote = `stop pins ${String(+((m * 180) / Math.PI).toFixed(2))}° past each end of the ${fmt(((c.range[1] - c.range[0]) * 180) / Math.PI)}° swing (F5)`;
  }
  // the blank's ground block clamped to the base: a clamp plate over it, two screws through both, two dowels reamed
  // through block, clamp plate and seat
  const [x0, y0, x1, y1] = bbox(G);
  const mm = 3;
  const rect: Vec2[] = [[x0 + mm, y0 + mm], [x1 - mm, y0 + mm], [x1 - mm, y1 - mm], [x0 + mm, y1 - mm]];
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const dx = (x1 - x0) / 2 - mm - 5;
  const dw: Vec2[] = [-1, 1].map((s): Vec2 => [cx, cy + s * ((y1 - y0) / 2 - mm - 4)]);
  const reamed = (pts: Vec2[]) => pts.map((p) => circle(1.5, p[0], p[1], 24));
  gs.holes.push(...reamed(dw.map((p) => toLocal(g, p))));
  const cp = plate(`${j.id}-clamp`, rect, { body: "ground", kind: "plate", name: `Clamp plate ${fmt(x1 - x0 - 2 * mm)} x ${fmt(y1 - y0 - 2 * mm)} x 4 over the blank's block`, holes: reamed(dw), z0: gs.z1, z1: gs.z1 + 4, ex: gs.ex + 1, joints: [j.id], mat: "Steel S235, zinc plated" });
  ctx.add(cp);
  // the block stands on a ground seat plate of its own outline, never on posts
  const seated = gs.z0 > ctx.b1 + 0.5;
  if (seated)
    ctx.add(plate(`${j.id}-seat`, G, { body: "ground", name: `Seat plate ${fmt(x1 - x0)} x ${fmt(y1 - y0)} x ${fmt(gs.z0 - ctx.b1)} under the blank's block`, holes: reamed(dw), z0: ctx.b1, z1: gs.z0, ex: gs.ex - 0.5, joints: [j.id], mat: "Steel C45, ground both faces", why: "seats the clamped block flat over the base, so the blank moves clear of it" }));
  for (const [k, s] of [[0, -1], [1, 1]] as const) {
    ctx.add(screw(`${j.id}-csc${k}`, "socket", 4, gs.z1 + 4 - ctx.b1 + 6, { body: "ground", at: [cx + s * dx, cy, 0], face: gs.z1 + 4, dir: -1, ex: gs.ex + 2, joints: [j.id], name: k ? "" : undefined, qty: k ? 0 : 2 }));
    ctx.add(dowel(`${j.id}-cdw${k}`, 3, { body: "ground", at: [dw[k]![0], dw[k]![1], 0], z0: ctx.b1 - 5, z1: gs.z1 + 4, ex: gs.ex, joints: [j.id], name: k ? "" : "Dowel pin Ø3, blank to base", qty: k ? 0 : 2 }));
  }
  (J.serves.F1 ??= []).push(`${j.id}-cdw0`, `${j.id}-cdw1`);
  (J.serves.F2 ??= []).push(cp.id);
  J.note = `Flexure neck ${c.neck} joining the ${c.lever} to its block: the neck drawn rigid with its bend shown by the overlay; ${stopNote}; the blank's block ${seated ? "seated on a ground plate and " : ""}clamped to the base under a plate, screwed and dowelled (F1, F2).`;
  J.badge = ["neck within range", "ok"];
}

export const j13: Rule = {
  id: "j13-compliant",
  tier: "AUTO",
  ids: ["J13", "A6", "F1", "F2", "F5"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J13"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "compliant") build(ctx, j);
  },
};
