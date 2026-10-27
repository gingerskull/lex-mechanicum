// Strain-wave and cycloidal drives: a wave generator's elliptical cam, a flexspline's segments (a tooth and its piece of
// rim, bent as the wave block bends them) and their wall strips, and a cycloidal disc.
import { D2R, TAU, circle, gearOutline, type Vec2 } from "../../core/geom";
import { type OutlineFn, hole, num, pair, rot } from "./common";

/** A `custom` shape's drive profiles: an ellipse (a wave generator), a flexspline tooth, a cycloidal disc. */
const driveProfile: OutlineFn = (shape) => {
  const prof = (shape.profile ?? {}) as Record<string, unknown>;
  if (Array.isArray(prof.ellipse)) {
    // an elliptical cam (a wave generator), semi-axes [a, b] along the frame's x and y
    const [ea, eb] = pair(prof.ellipse, [20, 15]);
    const outer = Array.from({ length: 144 }, (_, i): Vec2 => [ea * Math.cos((i * TAU) / 144), eb * Math.sin((i * TAU) / 144)]);
    return { profile: { outer, holes: typeof shape.bore === "number" ? [hole(shape.bore / 2).reverse()] : [] }, thick: num(shape.thickness, 10), approx: false, ...(shape.exact === true ? { exact: true } : {}) };
  }
  if (prof.flexTooth && typeof prof.flexTooth === "object") {
    // one tooth of a flexspline with its piece of rim, at angle 2πk/z (the wave block bends the rim)
    const f = prof.flexTooth as Record<string, unknown>;
    return { profile: { outer: flexTooth(num(f.z, 30), num(f.module, 2), num(f.addendum, 0.8), num(f.inner, 26.5), num(f.k, 0), num(f.w0, 0)), holes: [] }, thick: num(shape.thickness, 10), approx: false, exact: true };
  }
  if (/trochoid/.test(String(prof.curve ?? ""))) {
    // a cycloidal disc: N - 1 lobes rolling on N ring pins (radius Rr on a circle R), eccentricity e; 0.1 mm running
    // clearance on the pins; its bore and the output pins' holes ({ count, radius, circle, start })
    const outer = cycloidalDisc(num(prof.R, 50), num(prof.Rr, 5) + 0.1, num(prof.e, 4), num(prof.N, 10));
    const holes: Vec2[][] = [];
    if (typeof shape.bore === "number") holes.push(hole(shape.bore / 2).reverse());
    const hs = (shape.holes ?? {}) as Record<string, unknown>;
    const n = num(hs.count, 0);
    for (let k = 0; k < n; k++) {
      const a = (num(hs.start, 0) + (k * 360) / n) * D2R;
      holes.push(circle(num(hs.radius, 5), num(hs.circle, 20) * Math.cos(a), num(hs.circle, 20) * Math.sin(a), 32).reverse());
    }
    return { profile: { outer, holes }, thick: num(shape.thickness, 10), approx: false };
  }
  return null;
};

/**
 * One tooth of a z-tooth gear (addendum ha modules, dedendum 1.25) with its piece of rim down to the inner radius, the
 * tooth centred at angle 2πk/z, the piece spanning half a pitch either side (a flexspline's segment).
 */
export function flexTooth(z: number, m: number, ha: number, inner: number, k: number, w0 = 0): Vec2[] {
  const full = gearOutline(z, m, ha, 1.25);
  const per = full.length / z;
  // tooth 0's points and its root arc to the next tooth's start, then turned to tooth k; a hairline gap between
  // neighbouring segments, which tighten on the oval's curve
  const half = Math.PI / z - 0.4 / inner;
  // the tooth thinned by 8% for running clearance in the rigid spline's spaces (its flanks are a 30-tooth involute
  // working in 32-tooth spaces)
  const pts = full.filter(([x, y]) => Math.abs(Math.atan2(y, x)) < half - 1e-9).map(([x, y]): Vec2 => {
    const r = Math.hypot(x, y);
    const t = Math.atan2(y, x) * 0.92;
    return [r * Math.cos(t), r * Math.sin(t)];
  });
  const rf = (z * m) / 2 - 1.25 * m;
  const edge = (a: number): Vec2 => [rf * Math.cos(a), rf * Math.sin(a)];
  const arc = Array.from({ length: 9 }, (_, i): Vec2 => [inner * Math.cos(half - (i * 2 * half) / 8), inner * Math.sin(half - (i * 2 * half) / 8)]);
  void per;
  const ring: Vec2[] = [edge(-half), ...pts.sort((p, q) => Math.atan2(p[1], p[0]) - Math.atan2(q[1], q[0])), edge(half), ...arc];
  return bentSegment(ring, z, m, k, w0);
}

/** A flexspline's wall strip under segment k: a band of the cup's wall, inner - t to inner, bent as the segment is. */
export function flexWall(z: number, m: number, inner: number, t: number, k: number, w0 = 0): Vec2[] {
  const half = Math.PI / z - 0.4 / inner;
  const arc = (r: number, s: 1 | -1) => Array.from({ length: 9 }, (_, i): Vec2 => [r * Math.cos(s * (-half + (i * 2 * half) / 8)), r * Math.sin(s * (-half + (i * 2 * half) / 8))]);
  return bentSegment([...arc(inner, 1), ...arc(inner - t, -1)], z, m, k, w0);
}

/** A segment's ring, drawn about angle 0, turned to segment k of z and bent as the wave block bends it at the reference. */
function bentSegment(ring: Vec2[], z: number, m: number, k: number, w0: number): Vec2[] {
  const a = (k * TAU) / z;
  if (!w0) return rot(ring, a);
  // bent as at the reference, its long axis on x: out by w = w0 cos 2a along its radius, tilted with the oval's slope
  const r = (z * m) / 2;
  const w = w0 * Math.cos(2 * a);
  const rho = -Math.atan2(-2 * w0 * Math.sin(2 * a), r + w);
  // the inextensible rim's slide along itself (the wave block's)
  const at = a - ((w0 / 2) * Math.sin(2 * a)) / r;
  const p = rot([[r, 0]], rho + a)[0]!;
  const t: Vec2 = [(r + w) * Math.cos(at) - p[0], (r + w) * Math.sin(at) - p[1]];
  return rot(ring, rho + a).map(([x, y]): Vec2 => [x + t[0], y + t[1]]);
}

/**
 * A cycloidal disc's outline (counter-clockwise, about its centre): the curtate epitrochoid offset by the pin radius
 * that rolls N - 1 lobes on N pins of radius Rr on a circle R, eccentricity e; at its reference the disc's centre stands
 * at +e on x and a pin at angle 0 sits between two lobes.
 */
export function cycloidalDisc(R: number, Rr: number, e: number, N: number, n = 720): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i * TAU) / n;
    const psi = Math.atan2(Math.sin((1 - N) * t), R / (e * N) - Math.cos((1 - N) * t));
    pts.push([R * Math.cos(t) - Rr * Math.cos(t + psi) - e * Math.cos(N * t), -R * Math.sin(t) + Rr * Math.sin(t + psi) + e * Math.sin(N * t)]);
  }
  return pts.reverse();
}

export const DRIVE_PROFILES: OutlineFn[] = [driveProfile];
