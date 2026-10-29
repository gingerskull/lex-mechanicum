// 3D vectors, rotations and rigid transforms for the kinematic block library.

export type Vec3 = [number, number, number];
/** Row-major 3x3 matrix. */
export type Mat3 = [number, number, number, number, number, number, number, number, number];
/** A rigid transform p' = R p + t. A body's pose is the transform that carries its reference configuration to now. */
export interface Xf {
  R: Mat3;
  t: Vec3;
}

export const TAU = Math.PI * 2;
export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;

export const v3 = {
  add: (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a: Vec3): number => Math.hypot(a[0], a[1], a[2]),
  dist: (a: Vec3, b: Vec3): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
  unit: (a: Vec3): Vec3 => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  },
  lerp: (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  /** The part of a perpendicular to the unit vector n. */
  perp: (a: Vec3, n: Vec3): Vec3 => {
    const k = a[0] * n[0] + a[1] * n[1] + a[2] * n[2];
    return [a[0] - k * n[0], a[1] - k * n[1], a[2] - k * n[2]];
  },
};

export const I3: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export const m3 = {
  mul: (a: Mat3, b: Mat3): Mat3 => {
    const r = new Array<number>(9).fill(0);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) r[i * 3 + j]! += a[i * 3 + k]! * b[k * 3 + j]!;
    return r as Mat3;
  },
  mulV: (a: Mat3, v: Vec3): Vec3 => [
    a[0] * v[0] + a[1] * v[1] + a[2] * v[2],
    a[3] * v[0] + a[4] * v[1] + a[5] * v[2],
    a[6] * v[0] + a[7] * v[1] + a[8] * v[2],
  ],
  T: (a: Mat3): Mat3 => [a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]],
  /** Rotation by ang about the axis (any length) through the origin. */
  axisAngle: (axis: Vec3, ang: number): Mat3 => {
    const [x, y, z] = v3.unit(axis);
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    const k = 1 - c;
    return [c + x * x * k, x * y * k - z * s, x * z * k + y * s, y * x * k + z * s, c + y * y * k, y * z * k - x * s, z * x * k - y * s, z * y * k + x * s, c + z * z * k];
  },
  /** Euler angles in degrees applied x then y then z (the record's `rot`). */
  eulerDeg: (r: Vec3): Mat3 =>
    m3.mul(m3.axisAngle([0, 0, 1], r[2] * D2R), m3.mul(m3.axisAngle([0, 1, 0], r[1] * D2R), m3.axisAngle([1, 0, 0], r[0] * D2R))),
  /** Rotation vector (axis times angle) of a rotation matrix. */
  log: (R: Mat3): Vec3 => {
    const c = Math.max(-1, Math.min(1, (R[0] + R[4] + R[8] - 1) / 2));
    const w: Vec3 = [R[7] - R[5], R[2] - R[6], R[3] - R[1]];
    const s = v3.len(w) / 2;
    if (s < 1e-12) {
      if (c > 0) return [0, 0, 0];
      // half turn, R = 2 n nᵀ − I: the largest diagonal entry gives its component, the off-diagonal ones the others' signs
      const k = R[0] >= R[4] && R[0] >= R[8] ? 0 : R[4] >= R[8] ? 1 : 2;
      const nk = Math.sqrt(Math.max(0, (R[k * 4]! + 1) / 2));
      const d = [0, 1, 2].map((j) => (j === k ? nk : R[k * 3 + j]! / (2 * nk))) as Vec3;
      return v3.mul(v3.unit(d), Math.PI);
    }
    return v3.mul(w, Math.atan2(s, c) / (2 * s));
  },
};

export const xf = {
  id: (): Xf => ({ R: [...I3], t: [0, 0, 0] }),
  apply: (X: Xf, p: Vec3): Vec3 => v3.add(m3.mulV(X.R, p), X.t),
  dir: (X: Xf, d: Vec3): Vec3 => m3.mulV(X.R, d),
  /** X after Y: (X∘Y)(p) = X(Y(p)). */
  mul: (X: Xf, Y: Xf): Xf => ({ R: m3.mul(X.R, Y.R), t: v3.add(m3.mulV(X.R, Y.t), X.t) }),
  inv: (X: Xf): Xf => {
    const Rt = m3.T(X.R);
    return { R: Rt, t: v3.mul(m3.mulV(Rt, X.t), -1) };
  },
  /** Rotation by ang about the line through c with direction axis. */
  rotAbout: (c: Vec3, axis: Vec3, ang: number): Xf => {
    const R = m3.axisAngle(axis, ang);
    return { R, t: v3.sub(c, m3.mulV(R, c)) };
  },
  trans: (d: Vec3): Xf => ({ R: [...I3], t: [...d] }),
  /** Signed rotation angle of X about the unit axis n (the component of its rotation vector along n). */
  angleAbout: (X: Xf, n: Vec3): number => v3.dot(m3.log(X.R), v3.unit(n)),
};

/** Orthonormal frame (columns e1 e2 e3) from three non-collinear points. Null when they are collinear. */
/** A joint's frame: at its point, z along its axis, x the world up (or x) made square to it. */
export function jointFrame(at: Vec3, axis: Vec3): Xf {
  const z = v3.unit(axis);
  const h: Vec3 = Math.abs(z[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const x = v3.unit(v3.sub(h, v3.mul(z, v3.dot(h, z))));
  const y = v3.cross(z, x);
  return { R: [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]], t: at };
}

/** A transform that moves something: off the identity by more than rounding. */
export const moves = (D: Xf): boolean => Math.hypot(...D.t) > 1e-6 || D.R.some((v, i) => Math.abs(v - (i % 4 === 0 ? 1 : 0)) > 1e-9);

export function frameFrom3(p0: Vec3, p1: Vec3, p2: Vec3): Mat3 | null {
  const e1 = v3.unit(v3.sub(p1, p0));
  const n = v3.cross(e1, v3.sub(p2, p0));
  if (v3.len(n) < 1e-9 * (v3.dist(p0, p1) + v3.dist(p0, p2) + 1e-12)) return null;
  const e3 = v3.unit(n);
  const e2 = v3.cross(e3, e1);
  return [e1[0], e2[0], e3[0], e1[1], e2[1], e3[1], e1[2], e2[2], e3[2]];
}

/**
 * The rigid transform carrying the reference points to their current positions.
 * Three non-collinear points fix it; two (or collinear ones) fix it up to a turn about the line, which `hint`
 * (a unit axis, as a planar mechanism's joint axis) resolves by turning about the hint; one point gives a translation.
 */
export function fitXf(ref: Vec3[], now: Vec3[], hint?: Vec3): Xf | null {
  if (ref.length === 0) return null;
  const r0 = ref[0]!;
  const n0 = now[0]!;
  for (let i = 1; i < ref.length; i++) {
    for (let j = i + 1; j < ref.length; j++) {
      const Fr = frameFrom3(r0, ref[i]!, ref[j]!);
      const Fn = frameFrom3(n0, now[i]!, now[j]!);
      if (Fr && Fn) {
        const R = m3.mul(Fn, m3.T(Fr));
        return { R, t: v3.sub(n0, m3.mulV(R, r0)) };
      }
    }
  }
  if (ref.length >= 2 && hint) {
    const n = v3.unit(hint);
    for (let i = 1; i < ref.length; i++) {
      const a = v3.perp(v3.sub(ref[i]!, r0), n);
      const b = v3.perp(v3.sub(now[i]!, n0), n);
      if (v3.len(a) > 1e-9 && v3.len(b) > 1e-9) {
        const ang = Math.atan2(v3.dot(n, v3.cross(a, b)), v3.dot(a, b));
        const R = m3.axisAngle(n, ang);
        return { R, t: v3.sub(n0, m3.mulV(R, r0)) };
      }
    }
  }
  return null;
}

/** Wrap an angle to (-π, π]. */
export const wrapPi = (a: number): number => {
  let x = a % TAU;
  if (x > Math.PI) x -= TAU;
  else if (x <= -Math.PI) x += TAU;
  return x;
};
