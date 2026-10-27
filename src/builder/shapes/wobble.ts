// A wobble drive's two own parts, each one solid: the wobble hub (the input body's straight shank keyed on the shaft,
// with the inclined journal and its collar machined on it at the journal angle and the shaft's bore through it) and the
// trunnion ring that turns on the journal (a housing bored for the journal's bearing, with two trunnion pins square to
// the journal on boss pads). Both stand where the joints put them, about the common centre of the four axes; the yoke
// the trunnions sit in is the universal joint's (./spatial).
import { circle } from "../../core/geom";
import type { Kin, KinBody } from "../../kin/types";
import type { Setup } from "../../kin/compose";
import { type Vec3, v3 } from "../../kin/math";
import type { Feature } from "../../solids/types";
import { canon } from "../frames";
import type { BodyGeom } from "../shapes";
import { num, pair } from "./common";

/**
 * A cylinder along a world line, `from` and `len` along `dir`, of radius r, added to or cut from a part whose own frame
 * is (o, x, z): a feature in the part's own coordinates.
 */
function cylinder(mode: Feature["mode"], o: Vec3, x: Vec3, z: Vec3, from: Vec3, dir: Vec3, r: number, len: number): Feature {
  const y = v3.cross(z, x);
  const loc = (q: Vec3): Vec3 => [v3.dot(q, x), v3.dot(q, y), v3.dot(q, z)];
  const d = v3.unit(loc(dir));
  const fx = v3.unit(v3.perp(Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0], d));
  return { mode, profile: { outer: circle(r, 0, 0, Math.max(32, Math.round(r * 4))), holes: [] }, op: { op: "extrude", h: len, steps: 1 }, frame: { o: loc(v3.sub(from, o)), x: fx, z: d } };
}

/**
 * A `shaft` with a `journal` ({ joint, diameter, seat [s0, s1], shoulder, boss [diameter, from, to], bore }): the
 * wobble hub, one solid turned on the journal joint's axis through that joint's point: a boss, the shoulder step the
 * inner race stands on and the journal to past the seat's end (room for the circlip that holds the bearing), bored
 * obliquely for the shaft along the shaft's axis. The shape's own straight part (the shank the stack keys and sizes
 * the shaft from, its length the shaft's run to both pillow blocks) is not drawn; the kit puts the key in the boss.
 * `wobble-ring` (outer, width, bore, trunnion, pad): the housing round the journal's bearing, its trunnions out to the
 * yoke's cup radius along the trunnion joint's axis, each on a boss pad, one solid.
 */
export function wobble(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  const type = String(sh.type);
  const jr = type === "shaft" && typeof sh.journal === "object" && sh.journal !== null ? (sh.journal as Record<string, unknown>) : null;
  if (!jr && type !== "wobble-ring") return null;
  const F = g.frame;
  // the part's own frame: the body's frame moved to where the part starts along z (the placement rule's)
  const po = v3.add(F.o, v3.mul(F.z, g.exact?.offset ?? 0));
  if (jr) {
    const jj = typeof jr.joint === "string" ? S.joints.get(jr.joint) : undefined;
    if (!jj) return null;
    const c = jj.at;
    const a = canon(jj.axis);
    const rj = num(jr.diameter, 20) / 2;
    const [s0, s1] = pair(jr.seat, [-5, 5]);
    const end = s1 + 1.5;
    const rb = num(jr.bore, 0) / 2;
    const at = (s: number): Vec3 => v3.add(c, v3.mul(a, s));
    // the hub is turned on the journal's axis, one stepped piece: a boss (`boss` [diameter, from, to] along the journal
    // from the centre), the shoulder step the inner race stands on (`shoulder` across, from the boss to the seat) and the
    // journal; every face square to the journal, so nothing meets the ring at a grazing angle. The shank's straight part
    // stands only for the stack (it sizes and keys the shaft and spans its run to both pillow blocks): it is cut away
    const bb = Array.isArray(jr.boss) ? (jr.boss as unknown[]) : [];
    const db = num(bb[0], 2 * rj + 10);
    const b0 = num(bb[1], s0 - 15);
    const b1 = num(bb[2], s0 - 4);
    const rs = num(jr.shoulder, 2 * rj + 4) / 2;
    const reach = 2 * (g.thick + Math.abs(b0) + end);
    // (each step starts a millimetre inside the one before it, so no two faces are coplanar)
    const features: Feature[] = [
      cylinder("cut", po, F.x, F.z, v3.sub(po, F.z), F.z, num(g.shape.diameter, 22) / 2 + 1, g.thick + 2),
      cylinder("add", po, F.x, F.z, at(b0), a, db / 2, b1 - b0),
      cylinder("add", po, F.x, F.z, at(b1 - 1), a, rs, s0 - b1 + 1),
      cylinder("add", po, F.x, F.z, at(s0 - 1), a, rj, end - s0 + 1),
      ...(rb > 0 ? [cylinder("cut", po, F.x, F.z, v3.sub(c, v3.mul(F.z, reach / 2)), F.z, rb + 0.05, reach)] : []),
    ];
    return { ...g, approx: false, features: [...(g.features ?? []), ...features] };
  }
  const ro = num(sh.outer, 40) / 2;
  const w = num(sh.width, 14);
  const bore = num(sh.bore, 32) / 2 + 0.05;
  const rt = num(sh.trunnion, 10) / 2;
  const rp = num(sh.pad, 14) / 2;
  // the trunnion axis and the yoke's cup radius, from the trunnion joint and the yoke's shape
  const tj = kin.joints.find((j) => (j.a === b.id || j.b === b.id) && j.type === "revolute" && [j.a, j.b].some((x) => (kin.bodies.find((q) => q.id === x)?.shape as Record<string, unknown> | undefined)?.yoke));
  const yokeId = tj ? (tj.a === b.id ? tj.b : tj.a) : undefined;
  const yk = ((kin.bodies.find((q) => q.id === yokeId)?.shape as Record<string, unknown> | undefined)?.yoke ?? {}) as Record<string, unknown>;
  const reach = num(yk.radius, ro + 10);
  const t = v3.unit(tj ? S.joints.get(tj.id)!.axis : F.x);
  const root = bore + 1;
  const ro0 = v3.add(F.o, v3.mul(F.z, -w / 2));
  const features: Feature[] = ([1, -1] as const).flatMap((k) => {
    const d = v3.mul(t, k);
    return [cylinder("add", ro0, F.x, F.z, v3.add(F.o, v3.mul(d, root)), d, rp, ro + 1.5 - root), cylinder("add", ro0, F.x, F.z, v3.add(F.o, v3.mul(d, ro + 1)), d, rt, reach - ro - 1)];
  });
  return {
    ...g,
    profile: { outer: circle(ro, 0, 0, 48), holes: [circle(bore, 0, 0, 40).reverse()] },
    thick: w,
    approx: false,
    exact: { offset: -w / 2 },
    features,
  };
}
