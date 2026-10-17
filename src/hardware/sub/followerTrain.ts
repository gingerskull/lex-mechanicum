// H.followerTrain (J7): the cam follower's return spring with its seats, guide and preload screw (F6), a guide bushing
// with a circlip where no slide guides the follower (F2), an anti-rotation key on a flat follower (F3), a felt oiler
// on the cam track (F8). The zero line is the timing rule's (F9); the hardened cam is the materials rule's (M10).
import { TAU, bbox, circle, type Vec2 } from "../../core/geom";
import { toWorld } from "../../core/poly";
import { poseOf } from "../../model/pose";
import type { Part } from "../../model/types";
import { heights } from "../../parts";
import type { CamJoint, RuleContext } from "../../rules/types";
import { bushing, circlip, felt, key, plate, setScrew, spring, washer } from "../primitives";
import { SPRINGS } from "../tables";

const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** The follower's travel: unit direction and the extremes of its centre along it. */
function travel(ctx: RuleContext, f: Part): { dir: Vec2; lo: number; hi: number; o: Vec2 } | null {
  const pts: Vec2[] = [];
  for (let i = 0; i < 36; i++) {
    const q = poseOf(f, ctx.model.solve((i / 36) * TAU));
    if (q) pts.push([q[0], q[1]]);
  }
  if (pts.length < 2) return null;
  const o = pts[0]!;
  let far = o;
  for (const p of pts) if (Math.hypot(p[0] - o[0], p[1] - o[1]) > Math.hypot(far[0] - o[0], far[1] - o[1])) far = p;
  const L = Math.hypot(far[0] - o[0], far[1] - o[1]);
  if (L < 1e-6) return null;
  const dir: Vec2 = [(far[0] - o[0]) / L, (far[1] - o[1]) / L];
  const t = pts.map((p) => (p[0] - o[0]) * dir[0] + (p[1] - o[1]) * dir[1]);
  return { dir, lo: Math.min(...t), hi: Math.max(...t), o };
}

export function followerTrain(ctx: RuleContext, j: CamJoint): void {
  const J = ctx.joint(j.id)!;
  const f = j.follower;
  const tr = travel(ctx, f);
  const [fz0, fz1] = heights(f);
  const fs = ctx.solidOf[f.id]!;
  const G = { joints: [j.id], ex: fs.ex };
  if (!tr) {
    J.note = "The follower does not translate; its return is by form closure or a torsion spring (polish).";
    return;
  }
  const q0 = poseOf(f, ctx.s0)!;
  const a = Math.atan2(tr.dir[1], tr.dir[0]) - q0[2];
  // the follower's back face along its travel, away from the cam
  const camQ = poseOf(j.cam, ctx.s0)!;
  const toCam = (camQ[0] - q0[0]) * tr.dir[0] + (camQ[1] - q0[1]) * tr.dir[1];
  const back = toCam > 0 ? -1 : 1;
  const [bx0, , bx1] = bbox(f.shape.outer.map(([x, y]) => [x * Math.cos(-a) - y * Math.sin(-a), x * Math.sin(-a) + y * Math.cos(-a)] as Vec2));
  const face = back > 0 ? bx1 : bx0;
  const s = SPRINGS[1]!;
  const reach = back > 0 ? tr.hi : -tr.lo;
  // spring frame: x along the travel from the follower origin at s0, y across
  const F: [number, number, number] = [q0[0], q0[1], Math.atan2(tr.dir[1], tr.dir[0]) + (back > 0 ? 0 : Math.PI)];
  const Wf = (pts: Vec2[]) => pts.map((p) => toWorld(F, p));
  const x0 = Math.abs(face);
  const seatX = x0 + reach + s.L0 * 0.75;
  const zc = (fz0 + fz1) / 2;
  const sw = washer(`${j.id}-seat`, 0, s.D + 2, { ...G, body: f.id, name: "Spring seat on the follower", holes: [], outer: rect(-1, 0, -(s.D + 2) / 2, (s.D + 2) / 2).map(([x, y]) => [x + face, y] as Vec2), z0: zc - s.D / 2 - 1, z1: zc + s.D / 2 + 1 });
  const sp = spring(`${j.id}-spring`, "compression", { ...G, ex: fs.ex, outer: Wf(rect(x0 + reach, seatX, -s.D / 2, s.D / 2)), holes: [], z0: zc - s.D / 2, z1: zc + s.D / 2, D: s.D, wire: s.wire, why: "returns the follower onto the cam (F6)" });
  const blk = plate(`${j.id}-spring-block`, Wf(rect(seatX, seatX + 8, -s.D, s.D)), { ...G, name: "Spring seat block, screwed to the base", z0: ctx.b1, z1: zc + s.D / 2 + 2 });
  const pre = setScrew(`${j.id}-preload`, 5, { ...G, name: "Preload screw M5 and lock nut, sets the spring force", outer: Wf(rect(seatX + 8, seatX + 12, -2.5, 2.5)), z0: zc - 2.5, z1: zc + 2.5 });
  ctx.add(sw, sp, blk, pre);
  (J.serves.F6 ??= []).push(sp.id, pre.id);
  const guided = ctx.info.some((k) => k.kind === "slide" && k.slider.id === f.id);
  if (!guided) {
    const gb = bushing(`${j.id}-guide`, 0, 0, { ...G, name: "Follower guide bushing, bronze", outer: Wf(rect(x0 + reach + 2, x0 + reach + 10, -s.D, s.D)), holes: [], z0: fz0, z1: fz1 });
    const cl = circlip(`${j.id}-guide-cl`, s.D, { ...G, z0: fz1, at: [gb.outer[0]![0], gb.outer[0]![1], 0] });
    ctx.add(gb, cl);
    (J.serves.F2 ??= []).push(cl.id);
    // a flat follower must not turn in its guide
    const k = key(`${j.id}-antirot`, 3, 8, { ...G, body: f.id, z0: fz1 - 3, z1: fz1 });
    ctx.add(k);
    (J.serves.F3 ??= []).push(k.id);
  }
  // felt oiler bearing on the cam track, on the side away from the follower
  const r = Math.max(...j.cam.shape.outer.map(([x, y]) => Math.hypot(x, y)));
  const [cz0, cz1] = heights(j.cam);
  for (let k = 0; k < 12; k++) {
    const ang = F[2] + Math.PI + (k - 6) * 0.3;
    const p: Vec2 = [camQ[0] + (r + 3) * Math.cos(ang), camQ[1] + (r + 3) * Math.sin(ang)];
    if (ctx.clearance(p, 3, cz0, cz1) < 0.5) continue;
    const fe = felt(`${j.id}-felt`, circle(2.5, p[0], p[1], 20), { ...G, z0: cz0 + 0.5, z1: cz1 - 0.5 });
    ctx.add(fe);
    (J.serves.F8 ??= []).push(fe.id);
    break;
  }
  J.note = `Cam follower returned by a ${s.D} mm compression spring with a preload screw${guided ? ", guided by its slide" : ", in a bronze guide bushing with a circlip and an anti-rotation key"}; felt oiler on the track.`;
  J.badge = ["force closed", "ok"];
}
