// Toothed bodies: a gear (spur, helical, herringbone, straight or spiral bevel, worm and wheel, non-circular), a ring
// gear, a pulley or sprocket and a rack.
import { D2R, TAU, circle, gearOutline, rackOutline, roundRect, type Vec2 } from "../../core/geom";
import { bevel, bevelOutline, wormSection } from "../../core/spatial";
import type { LoftSection, Profile } from "../../solids/types";
import { bevelTeeth3, type Bevel3 } from "../bevel3";
import { noncircularOutline, pitchOf } from "../conjugate";
import { type OutlineFn, hole, num, rot } from "./common";

const gear: OutlineFn = (shape) => {
  const z = num(shape.z, 20);
  const m = num(shape.module, 2);
  const bore = num(shape.bore, 6);
  if (typeof shape.cone === "number") {
    // a straight bevel gear: Tredgold's back-cone teeth at the outer end, tapering toward the apex over the face
    const bv = bevel(z, m, shape.cone * D2R, num(shape.face, 0) || undefined);
    const outer = bevelOutline(z, m, bv.delta);
    if (typeof shape.spiral === "number" && shape.spiral !== 0) {
      // a spiral bevel or hypoid gear: the back-cone teeth lofted toward the apex, shrinking along the pitch cone and
      // turning by the spiral angle along the face (left hand clockwise going in); the bore is the stack's
      const turn = spiralTurn(shape);
      const n = Math.max(6, Math.ceil(Math.abs(turn) / (4 * D2R)));
      const loft: LoftSection[] = Array.from({ length: n }, (_, i) => {
        const t = (i + 1) / n;
        const s = 1 - t * (1 - bv.inner);
        return { z: t * bv.axial, outer: rot(outer, t * turn).map(([x, y]): Vec2 => [x * s, y * s]), holes: [] };
      });
      // the part itself: the teeth on the back cone (the loft stands for it in the planning)
      const teeth: Bevel3 = { z, m, cone: shape.cone, face: bv.b, turn };
      return { profile: { outer, holes: [] }, thick: bv.axial, approx: false, scaleTop: bv.inner, loft, exact: true, mesh: bevelTeeth3(teeth), teeth };
    }
    // its back face at `backFace` along the frame's z (default the frame's origin); `facing: -1` puts its apex toward
    // -z: the frustum then runs from its small end up to its back face. The part is its teeth on the back cone (the
    // frustum stands for it in the planning)
    const back = num(shape.backFace, 0);
    if (shape.facing === -1) {
      const s = bv.inner;
      const teeth: Bevel3 = { z, m, cone: shape.cone, face: bv.b, bore, facing: -1, back: bv.axial };
      return { profile: { outer: outer.map(([x, y]): Vec2 => [x * s, y * s]), holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: 1 / s, exact: true, exactOffset: back - bv.axial, mesh: bevelTeeth3(teeth), teeth };
    }
    const teeth: Bevel3 = { z, m, cone: shape.cone, face: bv.b, bore };
    return { profile: { outer, holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: bv.inner, exact: true, ...(back ? { exactOffset: back } : {}), mesh: bevelTeeth3(teeth), teeth };
  }
  if (shape.form === "worm" || shape.form === "worm wheel") return wormShape(shape, z, m);
  // a non-circular gear: teeth along its own pitch curve (the gear it drives is cut conjugate to it, conjugate.ts)
  const pc = pitchOf(shape);
  if (pc) return { profile: { outer: noncircularOutline(pc, z).outer, holes: [hole(bore / 2)] }, thick: num(shape.face, 10), approx: false };
  if (typeof shape.helix === "number" && shape.helix !== 0 && Array.isArray(shape.hand)) {
    // a herringbone (double-helical) gear: two halves of opposite hand meeting in a V across a relief groove cut to
    // the root circle; a loft of sections every few millimetres so each half's twist stays true
    const beta = shape.helix * D2R;
    const mt = shape.modules === "transverse" ? m : m / Math.cos(beta);
    const halves = (shape.halves ?? {}) as Record<string, unknown>;
    const w = num(halves.width, 20);
    const gap = num(halves.gap, 0);
    const rp = (z * mt) / 2;
    const sense = shape.hand[0] === "left" ? -1 : 1;
    const t = (sense * w * Math.tan(beta)) / rp;
    const base = gearOutline(z, mt);
    const rf = rp - 1.25 * mt - 0.4;
    // the bore is the stack's, cut into every section
    const bore: Vec2[][] = [];
    const ring = (a: number, groove = false): Vec2[] =>
      rot(base, a).map(([x, y]): Vec2 => {
        const r = Math.hypot(x, y);
        return groove && r > rf ? [(x * rf) / r, (y * rf) / r] : [x, y];
      });
    const n = Math.max(2, Math.ceil(Math.abs(t / D2R) / 3));
    const sections: LoftSection[] = [];
    for (let i = 1; i <= n; i++) sections.push({ z: (w * i) / n, outer: ring((t * i) / n), holes: bore });
    if (gap > 0) {
      sections.push({ z: w + 0.01, outer: ring(t, true), holes: bore }, { z: w + gap - 0.01, outer: ring(t, true), holes: bore }, { z: w + gap, outer: ring(t), holes: bore });
    }
    for (let i = 1; i <= n; i++) sections.push({ z: w + gap + (w * i) / n, outer: ring(t - (t * i) / n), holes: bore });
    return { profile: { outer: base, holes: bore }, thick: 2 * w + gap, approx: false, loft: sections, exact: true };
  }
  if (typeof shape.helix === "number" && shape.helix !== 0) {
    // a helical gear: the transverse outline of the normal module, turned along the face by its helix (right hand
    // counter-clockwise going up its axis); it stands at its joint's plane, so both of a pair share their faces
    const beta = shape.helix * D2R;
    const mt = shape.modules === "transverse" ? m : m / Math.cos(beta);
    const b = num(shape.face, 10);
    const turn = ((b * Math.tan(beta)) / ((z * mt) / 2)) * (shape.hand === "left" ? -1 : 1);
    // centred on its joint (a crossed pair meets at mid-face), else standing on it
    return { profile: { outer: gearOutline(z, mt), holes: [hole(bore / 2)] }, thick: b, approx: false, twist: turn / D2R, exact: true, ...(shape.centred === true ? { exactOffset: -b / 2 } : {}) };
  }
  return { profile: { outer: gearOutline(z, m), holes: [hole(bore / 2)] }, thick: num(shape.face, 10), approx: false };
};

const ringGear: OutlineFn = (shape) => {
  const z = num(shape.z, 40);
  const m = num(shape.module, 3);
  const rim = num(shape.rim, (z * m) / 2 + 12);
  // its teeth's tips stand `addendum` modules in from the pitch circle (short teeth, a harmonic drive's rigid spline)
  return { profile: { outer: circle(rim, 0, 0, 72), holes: [gearOutline(z, m, 1.25, num(shape.addendum, 1)).reverse()] }, thick: num(shape.face, 10), approx: false };
};

const pulley: OutlineFn = (shape, _pins, _far, type) => {
  const z = num(shape.z, 20);
  const p = num(shape.pitch, 8);
  const r = (z * p) / TAU + (type === "pulley" ? 1.4 : 2.5);
  return { profile: { outer: circle(r, 0, 0, Math.max(36, Math.round(r * 3))), holes: [hole(num(shape.bore, 8) / 2)] }, thick: num(shape.face, 10), approx: false };
};

const rack: OutlineFn = (shape) => {
  // toothed along its pitch line (y = 0, the frame's x); the mesh phasing shifts the teeth to put a gap at the mesh
  const L = num(shape.length, 120);
  const h = num(shape.height, 20);
  const m = num(shape.module, 0);
  return { profile: { outer: m > 0 ? rackOutline(m, -L / 2, L / 2, h) : roundRect(-L / 2, -h, L / 2, 0, 1), holes: [] }, thick: num(shape.face, 12), approx: false };
};

/**
 * A worm (`form: "worm"`, `z` starts, `module` axial, `pitchDiameter`, `face` its length) or its wheel
 * (`form: "worm wheel"`, `z` teeth, `helix` the worm's lead angle, `throat: { centre, radius }` the worm's axis distance
 * and the throat's radius about it), both as lofts centred on their joint: the worm's square section turned by its lead
 * along its length (right hand counter-clockwise), the wheel's teeth turned by the lead angle across its face and
 * reaching up round the worm in the throat. Their bores are the stack's, cut into every section.
 */
function wormShape(shape: Record<string, unknown>, z: number, m: number): { profile: Profile; thick: number; approx: boolean; loft: LoftSection[]; exact: boolean; exactOffset: number } {
  const sense = shape.hand === "left" ? -1 : 1;
  const L = num(shape.face, 20);
  const sections: LoftSection[] = [];
  if (shape.form === "worm") {
    const d1 = num(shape.pitchDiameter, 10 * m);
    const lead = Math.PI * m * z;
    const s0 = wormSection(m, z, d1, 72);
    const turn = (sense * 2 * Math.PI * L) / lead;
    const n = Math.max(2, Math.ceil(Math.abs(turn) / (12 * D2R)));
    for (let i = 1; i <= n; i++) sections.push({ z: (L * i) / n, outer: rot(s0, (turn * i) / n), holes: [] });
    return { profile: { outer: s0, holes: [] }, thick: L, approx: false, loft: sections, exact: true, exactOffset: -L / 2 };
  }
  const rp = (z * m) / 2;
  const lam = num(shape.helix, 5) * D2R;
  const th = (shape.throat ?? {}) as Record<string, unknown>;
  const a = num(th.centre, 0);
  const R = num(th.radius, 0);
  const n = Math.max(4, Math.round(L));
  const ring = (dz: number): Vec2[] => {
    // the tips follow the throat round the worm: higher toward the faces, up to 1.6 modules
    const rt = a > 0 && R > Math.abs(dz) ? a - Math.sqrt(R * R - dz * dz) : rp + m;
    const ad = Math.max(1, Math.min(1.6, (rt - rp) / m));
    return rot(gearOutline(z, m, ad), (sense * dz * Math.tan(lam)) / rp);
  };
  for (let i = 1; i <= n; i++) sections.push({ z: (L * i) / n, outer: ring((L * i) / n - L / 2), holes: [] });
  return { profile: { outer: ring(-L / 2), holes: [] }, thick: L, approx: false, loft: sections, exact: true, exactOffset: -L / 2 };
}

/** A spiral bevel or hypoid gear's turn of its teeth from the outer end to the inner, radians, signed by its hand; 0 else. */
export function spiralTurn(shape: Record<string, unknown>): number {
  if (typeof shape.cone !== "number" || typeof shape.spiral !== "number" || !shape.spiral) return 0;
  const z = num(shape.z, 20);
  const m = num(shape.module, 2);
  const bv = bevel(z, m, shape.cone * D2R, num(shape.face, 0) || undefined);
  const rMean = ((z * m) / 2) * (1 - (1 - bv.inner) / 2);
  return ((bv.b * Math.tan(shape.spiral * D2R)) / rMean) * (shape.hand === "left" ? -1 : 1);
}

export const GEAR_OUTLINES: Record<string, OutlineFn> = { gear, ringGear, pulley, sprocket: pulley, rack };
