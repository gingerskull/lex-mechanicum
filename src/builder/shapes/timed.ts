// Timed wheels and escapements: a ratchet wheel, an escape wheel, a star wheel, a crown wheel and a verge.
import { D2R, TAU, area, circle, roundedPoly, type Vec2 } from "../../core/geom";
import type { Kin, KinBody } from "../../kin/types";
import type { Setup } from "../../kin/compose";
import { sawOutline, starOutline, type StarSpec } from "../../kin/blocks/timed";
import { type Vec3, v3 } from "../../kin/math";
import type { BodyGeom } from "../shapes";
import { type OutlineFn, num } from "./common";

const ratchetWheel: OutlineFn = (shape) => {
  // a ratchet wheel's sawtooth: steep faces and back slopes (src/kin sawOutline)
  const outer = sawOutline({ n: num(shape.n, 12), root: num(shape.root, 50), tip: num(shape.tip, 62), face: num(shape.face, 3), back: num(shape.back, 27), tip0: num(shape.tip0, 0) }, 0);
  return { profile: { outer, holes: [circle(num(shape.bore, 12) / 2, 0, 0, 28).reverse()] }, thick: num(shape.thickness, 8), approx: false };
};

const escapeWheel: OutlineFn = (shape) => {
  // an escape wheel's pointed teeth: each tip with its two roots `lead` and `back` degrees from it (src/kin escape)
  const n = num(shape.n, 30);
  const outer: Vec2[] = [];
  for (let k = 0; k < n; k++) {
    const a = (num(shape.tip0, 0) + (360 / n) * k) * D2R;
    if (Array.isArray(shape.tooth)) {
      for (const q of shape.tooth as number[][]) outer.push([q[0]! * Math.cos(a) - q[1]! * Math.sin(a), q[0]! * Math.sin(a) + q[1]! * Math.cos(a)]);
      continue;
    }
    for (const [r, b] of [[num(shape.root, 40), a + num(shape.lead, 1) * D2R], [num(shape.tip, 50), a], [num(shape.root, 40), a + num(shape.back, 8) * D2R]] as const) outer.push([r * Math.cos(b), r * Math.sin(b)]);
  }
  const ring = area(outer) < 0 ? outer.reverse() : outer;
  return { profile: { outer: ring, holes: [circle(num(shape.bore, 6) / 2, 0, 0, 24).reverse()] }, thick: num(shape.thickness, 4), approx: false };
};

const star: OutlineFn = (shape) => {
  // a star wheel: straight flanks from each tip to the roots half a pitch either side (src/kin starOutline)
  const outer = starOutline({ n: num(shape.n, 10), tip: num(shape.tip, 20), root: num(shape.root, 12), tip0: num(shape.tip0, 0), c: [0, 0] } as StarSpec, 0);
  return { profile: { outer, holes: [circle(num(shape.bore, 6) / 2, 0, 0, 24).reverse()] }, thick: num(shape.thickness, 6), approx: false };
};

/**
 * A crown wheel (`crownWheel`): a ring of radius `R` (rim `rim` wide) on spokes, its face in the plane through its joint
 * square to its axis, and `n` saw teeth standing `h` out of that face toward its front (−axis): each a triangle of its
 * steep leading face and its back slope (`back` deg of the circle behind), extruded across the rim. The first tooth's
 * tip stands at `tip0` deg from the world +z toward +x (the verge block's convention; the simulated phase at the
 * reference). The wheel turns forward about +y.
 */
export function crown(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) !== "crownWheel") return null;
  const j = kin.joints.find((q) => (q.a === "ground" || q.b === "ground") && (q.a === b.id || q.b === b.id));
  const C = j ? S.joints.get(j.id)!.at : g.frame.o;
  const n = num(g.shape.n, 15);
  const R = num(g.shape.R, 40);
  const rim = num(g.shape.rim, 5);
  const h = num(g.shape.h, 8);
  const back = num(g.shape.back, 12) * D2R;
  const t0 = num(g.shape.tip0, 0) * D2R;
  const pieces = [...(g.pieces ?? [])];
  const bl = (R - rim / 2) * back;
  for (let k = 0; k < n; k++) {
    const a = t0 + (k * TAU) / n;
    const rad: Vec3 = [Math.sin(a), 0, Math.cos(a)];
    const tan: Vec3 = [Math.cos(a), 0, -Math.sin(a)];
    pieces.push({ id: `${b.id}-tooth${k}`, name: "", frame: { o: v3.add(C, v3.mul(rad, R - rim)), x: tan, z: rad }, profile: { outer: [[0, 0.2], [0, -h], [-bl, 0.2]], holes: [] }, h: rim });
  }
  // the rim and its spokes, in the face's plane: the body's frame has z along +y
  const spokes = 4;
  const holes: Vec2[][] = [];
  for (let k = 0; k < spokes; k++) {
    const a0 = (k * TAU) / spokes + 0.2;
    const a1 = ((k + 1) * TAU) / spokes - 0.2;
    const w: Vec2[] = [];
    for (let i = 0; i <= 12; i++) w.push([(R - rim) * Math.cos(a0 + ((a1 - a0) * i) / 12), (R - rim) * Math.sin(a0 + ((a1 - a0) * i) / 12)]);
    for (let i = 12; i >= 0; i--) w.push([9 * Math.cos(a0 + ((a1 - a0) * i) / 12), 9 * Math.sin(a0 + ((a1 - a0) * i) / 12)]);
    holes.push(w.reverse());
  }
  return { ...g, profile: { outer: circle(R, 0, 0, 120), holes }, thick: num(g.shape.thickness, 4), approx: false, exact: { offset: 0 }, pieces };
}

/**
 * A verge (`verge`): a staff (`staff` { diameter, from, to } along its axis from its joint), two flag pallets
 * (`pallets` [{ at (height), angle (deg from +x about +z at foliot 0), from, to, height, thickness }]) and a foliot bar
 * (`foliot` { at, length, weights, weightR }) across its top.
 */
export function vergeStaff(g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) !== "verge") return null;
  const F = g.frame;
  const st = (g.shape.staff ?? {}) as Record<string, number>;
  const d = num(st.diameter, 4);
  const from = num(st.from, -50);
  const to = num(st.to, 80);
  const pieces = [...(g.pieces ?? [])];
  const up: Vec3 = F.z;
  for (const [k, p] of ((g.shape.pallets ?? []) as Record<string, number>[]).entries()) {
    const be = num(p.angle, 0) * D2R;
    const dir: Vec3 = [Math.cos(be), Math.sin(be), 0];
    const nrm: Vec3 = [-Math.sin(be), Math.cos(be), 0];
    const th = num(p.thickness, 1.5);
    const zc = num(p.at, 0);
    const hh = num(p.height, 10) / 2;
    // frame x along the flag, z its normal, so y is −z of the world: the outline's v is minus the height
    pieces.push({ id: `${g.id}-pallet${k}`, name: "", frame: { o: v3.sub(F.o, v3.mul(nrm, th / 2)), x: dir, z: nrm }, profile: { outer: [[num(p.from, 2), -(zc - hh)], [num(p.to, 12), -(zc - hh)], [num(p.to, 12), -(zc + hh)], [num(p.from, 2), -(zc + hh)]].map(([a, c]): Vec2 => [a!, c!]), holes: [] }, h: th });
  }
  const fo = (g.shape.foliot ?? {}) as Record<string, number>;
  const fz = num(fo.at, to);
  const L = num(fo.length, 160) / 2;
  const top = v3.add(F.o, v3.mul(up, fz));
  pieces.push({ id: `${g.id}-foliot`, name: "", frame: { o: top, x: [1, 0, 0], z: up }, profile: { outer: roundedPoly([[-L, 0], [L, 0]], 3), holes: [] }, h: 5 });
  for (const s2 of [1, -1]) pieces.push({ id: `${g.id}-weight${s2 > 0 ? 0 : 1}`, name: "", frame: { o: v3.add(top, v3.mul(up, -2)), x: [1, 0, 0], z: up }, profile: { outer: circle(num(fo.weightR, 8), s2 * num(fo.weights, 60), 0, 32), holes: [] }, h: 9 });
  return { ...g, profile: { outer: circle(d / 2, 0, 0, 24), holes: [] }, thick: to - from, approx: false, exact: { offset: from }, pieces };
}

export const TIMED_OUTLINES: Record<string, OutlineFn> = { ratchetWheel, escapeWheel, star };
