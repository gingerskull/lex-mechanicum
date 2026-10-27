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
 * A `shaft` with a `journal` ({ joint, diameter, collar, neck, seat [s0, s1], bore, shank }): the wobble hub. Its own
 * part is the straight shank (the shaft shape, keyed on the live shaft by the stack; `shank` long where the shape's
 * length also spans the shaft's run on through the journal); the journal is machined on it along the
 * journal joint's axis through that joint's point, from the seat's start to past its end (room for the circlip that
 * holds the bearing), with the collar the inner race stands on below the seat, `neck` long, running back into the shank;
 * the shaft's bore runs through the whole piece along its own axis.
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
    const rc = num(jr.collar, 25) / 2;
    const [s0, s1] = pair(jr.seat, [-5, 5]);
    const neck = num(jr.neck, 10);
    const end = s1 + 1.5;
    const rb = num(jr.bore, 0) / 2;
    const at = (s: number): Vec3 => v3.add(c, v3.mul(a, s));
    const len = 4 * (end - s0 + neck + rc) + (g.thick ?? 0);
    // `shank`: the straight shank's own length; past it the shape's length is only the run of the shaft through the
    // journal to the pillow block beyond, so the stack straddles the hub: the shank is cut back to it
    const shank = num(jr.shank, g.thick);
    const back = shank < g.thick ? [cylinder("cut", po, F.x, F.z, v3.add(po, v3.mul(F.z, shank)), F.z, rc + 2, g.thick - shank + 1)] : [];
    const features: Feature[] = [
      ...back,
      cylinder("add", po, F.x, F.z, at(s0), a, rj, end - s0),
      cylinder("add", po, F.x, F.z, at(s0 - neck), a, rc, neck),
      ...(rb > 0 ? [cylinder("cut", po, F.x, F.z, v3.sub(c, v3.mul(F.z, len / 2)), F.z, rb + 0.05, len)] : []),
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
