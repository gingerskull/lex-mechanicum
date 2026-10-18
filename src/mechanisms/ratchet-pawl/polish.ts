// Overrides and additions to the generated ratchet assembly (standard 5.2). The clevis lever (the front plate a twin of
// the rear one), the pawls and their pivots are the model's; the rules build the live input shaft with the wheel on its
// own bearing, the pawl pivot bolt, the holding pawl's dead axle with its bridge, the lever stops and the oscillating
// drive. What differs from the rules:
// - a leaf spring on each pawl, screwed down on a post (F6): the ratchet's only way of holding a position;
// - six spokes in the wheel (M2), an index dot on one tooth and its mark on the base (F9);
// - hardened steel for the wheel and both pawls (M10);
// - notes, badges and build rules (A16).
import { D2R, TAU, area, arcPts, circle, polar, wrap, type Vec2 } from "../../core/geom";
import { toLocal, toWorld } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { poseOf } from "../../model/pose";
import type { Part, Pose } from "../../model/types";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { pitch, rRoot } from "./model";

/** Leaf spring: length from its screw to the pawl, width, thickness and height above the pawl's bottom face, mm. */
const LEAF = { L: 24, t: 0.8, z: 2.4 };
/** The spring ends this far short of the pawl's edge at the pawl's highest lift (the clearance test forbids contact). */
const GAP = 3;
/** Spoke web left round the bearing seat and under the teeth (M2). */
const WEB = 8;
const STEEL = "Steel 42CrMo4, hardened and ground";

/** Rounds the concave corners of an outline with a cutter radius r (M5, M7), leaving convex corners (the pawl tip) alone. */
function roundInside(P: Vec2[], r: number): Vec2[] {
  const sg = Math.sign(area(P));
  const out: Vec2[] = [];
  const n = P.length;
  for (let i = 0; i < n; i++) {
    const p = P[(i - 1 + n) % n]!;
    const c = P[i]!;
    const q = P[(i + 1) % n]!;
    const u: Vec2 = [p[0] - c[0], p[1] - c[1]];
    const v: Vec2 = [q[0] - c[0], q[1] - c[1]];
    const lu = Math.hypot(...u);
    const lv = Math.hypot(...v);
    const turn = (c[0] - p[0]) * (q[1] - c[1]) - (c[1] - p[1]) * (q[0] - c[0]);
    const th = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (lu * lv))));
    const t = r / Math.tan(th / 2);
    if (turn * sg > 0 || th > Math.PI - 0.15 || t > 0.45 * Math.min(lu, lv)) {
      out.push(c);
      continue;
    }
    const a: Vec2 = [c[0] + (u[0] / lu) * t, c[1] + (u[1] / lu) * t];
    const b: Vec2 = [c[0] + (v[0] / lv) * t, c[1] + (v[1] / lv) * t];
    const bis: Vec2 = [u[0] / lu + v[0] / lv, u[1] / lu + v[1] / lv];
    const bl = Math.hypot(...bis);
    const h = r / Math.sin(th / 2);
    const C: Vec2 = [c[0] + (bis[0] / bl) * h, c[1] + (bis[1] / bl) * h];
    const a0 = Math.atan2(a[1] - C[1], a[0] - C[0]);
    let a1 = Math.atan2(b[1] - C[1], b[0] - C[0]);
    while (a1 - a0 > Math.PI) a1 -= TAU;
    while (a0 - a1 > Math.PI) a1 += TAU;
    out.push(...arcPts(C[0], C[1], r, a0, a1, Math.PI / 12));
  }
  return out;
}

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const wheel = A.get("wheel")!;
  const model = ctx.model;
  const part = (id: string): Part => model.parts.find((p) => p.id === id)!;

  // ---- M2: six spokes; the web keeps WEB mm round the wheel's bearing flange and under the tooth roots ----
  const brg = A.get("pO-wheel-brg")!;
  const fl = A.get("pO-wheel-brg-fl");
  const seat = Math.max(brg.D!, fl?.D ?? 0) / 2 + 0.2;
  wheel.holes.push(...H.spokes({ rIn: seat + WEB, rOut: rRoot - WEB + 1, n: 6, half: 5, fillet: 3 }));

  // ---- F6: a leaf spring on each pawl, screwed to a post, pressing the pawl into the wheel ----
  // The spring is drawn at the pawl's highest lift (where it is most bent), 0.5 mm clear of the pawl's edge: a flexing
  // leaf is not modelled, so at rest the drawn leaf stands off the pawl by that lift (audit: promotion candidate).
  const spring = (pid: string, bodyId: string | null, pawlId: string, tag: string, name: string, ang: number) => {
    const pawl = part(pawlId);
    const body = bodyId ? part(bodyId) : null;
    const rel = (u: number): { pawlQ: Pose; bodyQ: Pose } => {
      const s = model.solve(u);
      return { pawlQ: poseOf(pawl, s)!, bodyQ: body ? poseOf(body, s)! : [0, 0, 0] };
    };
    // highest lift: the pawl's angle in the body frame at its least (the lift turns it away from the wheel)
    const r0 = rel(Math.PI);
    let best = Math.PI;
    let low = 0;
    for (let i = 0; i < 180; i++) {
      const u = (i / 180) * TAU;
      const r = rel(u);
      const d = wrap(r.pawlQ[2] - r.bodyQ[2] - (r0.pawlQ[2] - r0.bodyQ[2]));
      if (d < low) {
        low = d;
        best = u;
      }
    }
    const { pawlQ, bodyQ } = rel(best);
    // contact on the pawl's boss-side edge, midway between the boss arc and the first bow of the arm
    const Q = toLocal(bodyQ, toWorld(pawlQ, [7, -12]));
    const nrm = Math.atan2(-0.92, -0.39) + pawlQ[2] - bodyQ[2];
    const dir = nrm + ang;
    const E: Vec2 = [Q[0] + (GAP + 0.1) * Math.cos(nrm), Q[1] + (GAP + 0.1) * Math.sin(nrm)];
    const Pp: Vec2 = [E[0] + LEAF.L * Math.cos(dir), E[1] + LEAF.L * Math.sin(dir)];
    const host = bodyId ?? "ground";
    const pawlSolid = A.get(pawlId)!;
    const z0 = pawlSolid.z0 + LEAF.z;
    const z1 = z0 + LEAF.t;
    const ex = pawlSolid.ex;
    const J = bodyId ? "pD" : "pH";
    const sp = H.spring(`${tag}-spring`, "leaf", { L: LEAF.L, wire: LEAF.t, body: host, at: [Pp[0], Pp[1], dir + Math.PI], z0, z1, ex, joints: [J], name });
    A.add(sp);
    // the post under the free screw end: a Ø8 standoff from the base (or the rear lever plate) up to the leaf
    const zb = bodyId ? A.get(bodyId)!.z1 : ctx.b1;
    A.add(H.standoff(`${tag}-spring-post`, { name: "Spring post Ø8", outer: H.disc(4), D: 8, role: bodyId ? "driver" : "ground", body: host, at: [Pp[0], Pp[1], 0], z0: zb, z1: z0, ex: ex - 0.5, joints: [J], mat: "Steel C45, black oxide" }));
    A.add(H.screw(`${tag}-spring-sc`, "button", 3, z1 - zb + 4, { body: host, at: [Pp[0], Pp[1], 0], face: z1, dir: -1, ex: ex + 0.5, joints: [J], name: undefined }));
    const jt = ctx.joint(J);
    if (jt) (jt.serves.F6 ??= []).push(sp.id);
    return { E, P: Pp };
  };
  spring("pD", "leverRear", "pawl", "pD", `Leaf spring ${LEAF.L} x 6 x ${LEAF.t}, driving pawl`, 0.5);
  spring("pH", null, "holdPawl", "pH", `Leaf spring ${LEAF.L} x 6 x ${LEAF.t}, holding pawl`, 0.5);

  // ---- F9: an index dot on tooth 8 of the wheel and its line on the base: at rest after a stroke the marked tooth sits
  // on the line, so the wheel goes back in phase ----
  const omega0 = model.solve(0).wheel as number;
  const mark = 8;
  wheel.marks.push({ kind: "timing", pts: circle(0.8, ...polar(rRoot - 3, mark * pitch + 0.5 * D2R), 12) });
  const rest = omega0 + pitch + mark * pitch;
  A.get("base")!.marks.push({ kind: "timing", pts: [polar(66, rest), polar(72, rest)] });

  for (const id of ["pawl", "holdPawl"]) A.get(id)!.outer = roundInside(A.get(id)!.outer, 1.5);
  H.boreChamfers(wheel);
  locking.apply(ctx);
  materials.apply(ctx);
  for (const id of ["wheel", "pawl", "holdPawl"]) A.get(id)!.mat = STEEL;
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  A.joint("pO", { note: `${A.joint("pO").note} The lever's two plates are keyed to the shaft; the wheel runs free on its own bearing between them, so the lever turns the shaft back and forth while the wheel only ever goes forward.` });
  const D = A.joint("pD");
  D.note = `${D.note} The two lever plates are a clevis round the pawl, so the pivot bolt works in double shear. A leaf spring on a post between the plates presses the pawl into the wheel.`;
  D.badge = ["double shear", "ok"];
  const sEnd = model.solve(TAU);
  const tipH = Math.atan2(sEnd.pts.TH![1], sEnd.pts.TH![0]);
  const backlash = ((((sEnd.wheel as number) - tipH) % pitch) + pitch) % pitch / D2R;
  A.joint("pO").badge = ["single shear", "warn"];
  const Hh = A.joint("pH");
  Hh.note = `${Hh.note} The holding pawl's axle is held by the base and by the bridge above, and a leaf spring on its own post presses the pawl into the wheel. It rests ${backlash.toFixed(0)}° of wheel angle behind the face it holds: that is the wheel's backlash.`;
  Hh.badge = ["both ends held", "ok"];
  A.rules.push(
    { title: "Pawls are pushers", text: "Both pawls are cut so their line is tangent to the root circle where they meet the steep face: they push the tooth, they do not try to lever it out." },
    { title: "Wheel free, lever keyed", text: "The lever's plates are keyed to the shaft; the wheel runs on its own bearing between them and is turned only by the driving pawl." },
    { title: "Sprung, never loose", text: "Each pawl has a leaf spring screwed to its own post so it drops into every root and cannot bounce over a tooth." },
    { title: "Stops outside the stroke", text: "Rubber stops sit 2° beyond each end of the lever's swing; the drive's crank sets the swing exactly." },
    { title: "Kinematics untouched", text: "Tooth profile, pivot centres and pawl lengths are the model's; the springs, spokes and bridge are placed round them." },
  );
};
