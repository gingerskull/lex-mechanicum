// Spatial blocks: Hooke, homokinetic, Bennett and Sarrus, all in closed form.
import { type Mat3, type Vec3, I3, m3, v3, wrapPi, xf, type Xf } from "../math";

/**
 * Hooke (Cardan) joint: output angle from input angle and bend β between the shafts, tan θ2 = tan θ1 / cos β.
 * Angles are those of the two yokes measured from the plane of the two shafts; θ2 is on the same turn as θ1.
 */
export function hookeAngle(theta1: number, beta: number): number {
  const raw = Math.atan2(Math.sin(theta1), Math.cos(beta) * Math.cos(theta1));
  return theta1 + wrapPi(raw - theta1);
}

/** ω2/ω1 of a Hooke joint: cos β / (1 − sin²β cos²θ1). */
export function hookeSpeedRatio(theta1: number, beta: number): number {
  const s = Math.sin(beta);
  return Math.cos(beta) / (1 - s * s * Math.cos(theta1) ** 2);
}

/** Output shaft axis for a bend β of the input axis a1 about the unit axis `bendAxis` (the normal of the shafts' plane). */
export function bentAxis(a1: Vec3, bendAxis: Vec3, beta: number): Vec3 {
  return m3.mulV(m3.axisAngle(bendAxis, beta), v3.unit(a1));
}

/** Constant-velocity (homokinetic) joint: the output turns with the input, θ2 = θ1, while the balls sit in the bisecting plane. */
export const homokineticAngle = (theta1: number): number => theta1;

/** Unit normal of the bisecting plane of shafts a1 (into the joint) and a2 (out of it). */
export function bisectorNormal(a1: Vec3, a2: Vec3): Vec3 {
  return v3.unit(v3.add(v3.unit(a1), v3.unit(a2)));
}

/** Householder reflection through the plane through the origin with unit normal n. */
export function reflection(n: Vec3): Mat3 {
  const [x, y, z] = v3.unit(n);
  return [1 - 2 * x * x, -2 * x * y, -2 * x * z, -2 * y * x, 1 - 2 * y * y, -2 * y * z, -2 * z * x, -2 * z * y, 1 - 2 * z * z];
}

export interface BennettParams {
  /** Link lengths (a on links 1 and 3, b on 2 and 4) and twists (α on 1 and 3, β on 2 and 4), radians. */
  a: number;
  b: number;
  alpha: number;
  beta: number;
}

/** Bennett's condition a sin β = b sin α. The residual of it, in mm. */
export const bennettCondition = (p: BennettParams): number => p.a * Math.sin(p.beta) - p.b * Math.sin(p.alpha);

/** b for a given a, α, β so that the linkage is a Bennett linkage. */
export const bennettB = (a: number, alpha: number, beta: number): number => (a * Math.sin(beta)) / Math.sin(alpha);

/**
 * The second joint angle from the first: tan(θ2/2) = k cot(θ1/2), k = sin((β+α)/2) / sin((β−α)/2).
 * θ3 = −θ1 and θ4 = −θ2 (the opposite joints turn equal and opposite in this DH convention).
 */
export function bennettAngles(p: BennettParams, th1: number): { th1: number; th2: number; th3: number; th4: number } {
  const k = Math.sin((p.beta + p.alpha) / 2) / Math.sin((p.beta - p.alpha) / 2);
  const th2 = 2 * Math.atan2(k * Math.cos(th1 / 2), Math.sin(th1 / 2));
  return { th1, th2, th3: -th1, th4: -th2 };
}

/** Denavit–Hartenberg step with no joint offset: Rz(θ) Tx(a) Rx(α). */
export function dhStep(theta: number, alpha: number, a: number): Xf {
  const Rz = xf.rotAbout([0, 0, 0], [0, 0, 1], theta);
  const Tx = xf.trans([a, 0, 0]);
  const Rx = xf.rotAbout([0, 0, 0], [1, 0, 0], alpha);
  return xf.mul(Rz, xf.mul(Tx, Rx));
}

export interface BennettFrames {
  /** Frames (in the ground link's DH frame) that move with crank, coupler and rocker. */
  crank: Xf;
  coupler: Xf;
  rocker: Xf;
  /** The four joint axes (point and direction), in the ground frame: ground-crank, crank-coupler, coupler-rocker, rocker-ground. */
  axes: [Vec3, Vec3][];
  /** Product of the four DH steps: the identity when the loop closes. */
  closure: Xf;
}

export function bennettFrames(p: BennettParams, th1: number): BennettFrames {
  const t = bennettAngles(p, th1);
  const T1 = dhStep(t.th1, p.alpha, p.a);
  const T2 = dhStep(t.th2, p.beta, p.b);
  const T3 = dhStep(t.th3, p.alpha, p.a);
  const T4 = dhStep(t.th4, p.beta, p.b);
  const F1 = T1;
  const F2 = xf.mul(F1, T2);
  const F3 = xf.mul(F2, T3);
  const axisOf = (F: Xf): [Vec3, Vec3] => [F.t, [F.R[2], F.R[5], F.R[8]]];
  return {
    crank: xf.rotAbout([0, 0, 0], [0, 0, 1], t.th1),
    coupler: xf.mul(F1, xf.rotAbout([0, 0, 0], [0, 0, 1], t.th2)),
    rocker: xf.mul(F2, xf.rotAbout([0, 0, 0], [0, 0, 1], t.th3)),
    axes: [axisOf(xf.id()), axisOf(F1), axisOf(F2), axisOf(F3)],
    closure: xf.mul(F3, T4),
  };
}

/** Largest deviation of the loop closure from the identity (mm and radians mixed, as a residual). */
export function bennettClosure(p: BennettParams, th1: number): number {
  const c = bennettFrames(p, th1).closure;
  return Math.max(v3.len(c.t), ...c.R.map((r, i) => Math.abs(r - I3[i]!)));
}

/**
 * Sarrus pair: two legs of two hinged links (l1 on the base, l2 on the top) in orthogonal planes carry a top plate that
 * moves in a straight line normal to the base. With the base link at θ from the base plane the upper link stands at φ
 * with l2 cos φ = l1 cos θ (no lateral drift); the top height is l1 sin θ + l2 sin φ.
 */
export function sarrusPair(l1: number, l2: number, theta: number): { phi: number; z: number; reachable: boolean } {
  const c = (l1 * Math.cos(theta)) / l2;
  if (Math.abs(c) > 1) return { phi: 0, z: l1 * Math.sin(theta), reachable: false };
  const phi = Math.acos(c) * (Math.sin(theta) < 0 ? -1 : 1);
  return { phi, z: l1 * Math.sin(theta) + l2 * Math.sin(phi), reachable: true };
}
