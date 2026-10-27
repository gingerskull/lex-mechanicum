// Engines: an oscillating cylinder and its piston, and a rotary engine's rotor (with its internal gear ring) and housing.
import { TAU, circle, gearOutline, roundRect, roundedPoly, type Vec2 } from "../../core/geom";
import { type Vec3, v3 } from "../../kin/math";
import type { KinBody } from "../../kin/types";
import type { Profile } from "../../solids/types";
import type { BodyGeom } from "../shapes";
import { type OutlineFn, num, pair } from "./common";

/** A `custom` shape's rotary engine profiles: the rotor, the housing. */
const rotaryProfile: OutlineFn = (shape) => {
  const pr = (shape.profile ?? {}) as Record<string, Record<string, unknown> | undefined>;
  if (pr.rotor) return rotorOf(pr.rotor, pr.internalGear, num(shape.thick, 16));
  if (pr.housing) return { profile: housingOf(pr.housing, pr.bore), thick: num(shape.thick, 16), approx: false };
  return null;
};

/**
 * A cylinder that swings on a trunnion (`cylinder`) and its piston on a rod (`piston`), in the body's frame: x along
 * the bore, z the trunnion's axis. The cylinder is a port pad on the trunnion, its flat port face at `face`, the port
 * drilled through it at `port` [x, r]; a tube on the pad along x at `axis` height, open at the rod end through a gland,
 * closed at the other. The piston is a rod from its eye on the crank pin to a head that fills the bore. Both stand
 * where their joints put them.
 */
export function cylinder(b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  const type = String(sh.type);
  if (type !== "cylinder" && type !== "piston") return null;
  const F = g.frame;
  const yv = v3.cross(F.z, F.x);
  const at = (x: number, y: number, z: number): Vec3 => v3.add(F.o, v3.add(v3.mul(F.x, x), v3.add(v3.mul(yv, y), v3.mul(F.z, z))));
  const h = num(sh.axis, 14);
  const bore = num(sh.bore, 40);
  if (type === "cylinder") {
    const R = bore / 2 + num(sh.wall, 6);
    const [x0, x1] = pair(sh.span, [-46, 46]);
    const face = num(sh.face, -14);
    const [p0, p1, pw] = (Array.isArray(sh.pad) ? sh.pad : [-12, 40, 28]) as number[];
    const [px, pr] = pair(sh.port, [30, 2.5]);
    const tube = (id: string, a: number, c: number, holeR: number) => ({ id, name: "", frame: { o: at(a, 0, h), x: F.z, z: F.x }, profile: { outer: circle(R, 0, 0, 48), holes: holeR > 0 ? [circle(holeR, 0, 0, 40).reverse()] : [] }, h: c - a });
    return {
      ...g,
      frame: F,
      profile: { outer: roundRect(p0!, -pw! / 2, p1!, pw! / 2, 4), holes: [circle(pr, px, 0, 24).reverse()] },
      // the pad rises from the port face into the tube's wall, short of the bore
      thick: h - bore / 2 - face,
      approx: false,
      exact: { offset: face },
      plan: roundRect(x0 - 5, -R, x1 + 5, R, 4),
      pieces: [tube(`${b.id}-tube`, x0, x1, bore / 2), tube(`${b.id}-head`, x1, x1 + 5, 0), tube(`${b.id}-gland`, x0 - 5, x0, num(sh.rod, 10) / 2 + 0.5)],
    };
  }
  // the piston: its eye on the crank pin at the origin, the rod along x to the head
  const L = num(sh.length, 120);
  const rod = num(sh.rod, 10);
  const eye = num(sh.eye, 9);
  const [hl, hd] = pair(sh.head, [16, bore - 1]);
  return {
    ...g,
    profile: { outer: circle(eye, 0, 0, 36), holes: [] },
    thick: rod,
    approx: false,
    exact: { offset: h - rod / 2 },
    plan: roundedPoly([[0, 0], [L + hl / 2, 0]], Math.max(eye, hd / 2)),
    pieces: [
      { id: `${b.id}-rod`, name: "", frame: { o: at(eye - 2, 0, h), x: F.z, z: F.x }, profile: { outer: circle(rod / 2, 0, 0, 24), holes: [] }, h: L - hl / 2 - (eye - 2) },
      { id: `${b.id}-head`, name: "", frame: { o: at(L - hl / 2, 0, h), x: F.z, z: F.x }, profile: { outer: circle(hd / 2, 0, 0, 48), holes: [] }, h: hl },
    ],
  };
}

/**
 * A rotary engine's rotor about its centre (the frame origin): three apexes at `apexRadius`, the first on the frame's x,
 * each flank an arc about the opposite apex's side, `flank` times the apex-to-apex distance in radius (1 is the
 * Reuleaux triangle, larger is flatter), bored for its eccentric (`bore`, radius). Its internal gear ring stands on it as
 * an upper plate: `internalGear` { z, module, rim } about the centre, half the rotor's thickness.
 */
function rotorOf(r: Record<string, unknown>, ig: Record<string, unknown> | undefined, thick: number): { profile: Profile; thick: number; approx: boolean; upper?: { profile: Profile; h: number; name?: string } } {
  const R = num(r.apexRadius, 102.6);
  const side = R * Math.sqrt(3);
  const rho = num(r.flank, 1.25) * side;
  const outer: Vec2[] = [];
  for (let k = 0; k < 3; k++) {
    const a = (k * TAU) / 3;
    const b = ((k + 1) * TAU) / 3;
    const A: Vec2 = [R * Math.cos(a), R * Math.sin(a)];
    const B: Vec2 = [R * Math.cos(b), R * Math.sin(b)];
    // the arc's centre on the far side of the rotor centre from the flank's middle
    const m: Vec2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const ml = Math.hypot(m[0], m[1]);
    const d = Math.sqrt(rho * rho - (side / 2) ** 2);
    const c: Vec2 = [(-m[0] / ml) * (d - ml), (-m[1] / ml) * (d - ml)];
    const t0 = Math.atan2(A[1] - c[1], A[0] - c[0]);
    let t1 = Math.atan2(B[1] - c[1], B[0] - c[0]);
    while (t1 < t0) t1 += TAU;
    for (let i = 0; i < 40; i++) {
      const t = t0 + ((t1 - t0) * i) / 40;
      outer.push([c[0] + rho * Math.cos(t), c[1] + rho * Math.sin(t)]);
    }
  }
  const bore = num(r.bore, 28);
  const holes = [circle(bore, 0, 0, 96).reverse()];
  if (!ig) return { profile: { outer, holes }, thick, approx: false };
  const z = num(ig.z, 45);
  const m = num(ig.module, 2);
  const rim = num(ig.rim, (z * m) / 2 + 9);
  const h = Math.floor(thick / 2);
  return { profile: { outer, holes }, thick, approx: false, upper: { profile: { outer: circle(rim, 0, 0, 96), holes: [gearOutline(z, m, 1.25, 1).reverse()] }, h, name: `internal gear ring, ${z} teeth` } };
}

/**
 * A rotary engine's housing about the shaft (the frame origin): a block `rect` [w, h] with corners of `corner`, its bore
 * the epitrochoid the apexes trace, x = R cos b - e cos 3b, y = R sin b - e sin 3b, opened `clear` mm (the apex seals'
 * running clearance is the rotor's).
 */
function housingOf(h: Record<string, unknown>, bore: Record<string, unknown> | undefined): Profile {
  const [w, ht] = pair(h.rect, [296, 236]);
  const ep = (bore?.epitrochoid ?? {}) as Record<string, unknown>;
  const R = num(ep.R, 103);
  const e = num(ep.e, 15);
  const hole: Vec2[] = [];
  for (let k = 0; k < 360; k++) {
    const b = (k * TAU) / 360;
    hole.push([R * Math.cos(b) - e * Math.cos(3 * b), R * Math.sin(b) - e * Math.sin(3 * b)]);
  }
  return { outer: roundRect(-w / 2, -ht / 2, w / 2, ht / 2, num(h.corner, 22)), holes: [hole.reverse()] };
}

export const ENGINE_PROFILES: OutlineFn[] = [rotaryProfile];
