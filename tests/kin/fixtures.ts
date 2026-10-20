// Kin-block fixtures, written by hand: what a record's `kin` carries for each mechanism, until the catalogue validator
// (E2) produces them from records. Geometry is given in the reference configuration (the drivers' defaults).
import { bennettB, bennettFrames, dyadRRR, type Kin, type Vec3, v3 } from "../../src/kin";

export { sliderCrank, crankRockerNumeric, gearPair, rackPinion, planetary, camFollower, leadScrew, geneva, fiveBar, sarrus, escapement, flexureHinge, beltDrive } from "./fixtures2";

const D = Math.PI / 180;

const rot = (p: Vec3, deg: number): Vec3 => [p[0] * Math.cos(deg * D) - p[1] * Math.sin(deg * D), p[0] * Math.sin(deg * D) + p[1] * Math.cos(deg * D), p[2]];

export interface FourBarSpec {
  d: number; // ground length O2 O4
  a: number; // crank
  b: number; // rocker
  c: number; // coupler
  /** Driver default (the crank angle of the reference configuration) and kind. */
  theta0?: number;
  driver?: { kind: "rotary" } | { kind: "oscillating"; lo: number; hi: number };
  /** Which root of the dyad closes in the reference configuration: 0 = left of A→O4, 1 = right. */
  root?: 0 | 1;
}

/** A planar four-bar from its lengths: the coupler closes as an RRR dyad of A and O4. */
export function fourBar(s: FourBarSpec): Kin {
  const th0 = s.theta0 ?? 0;
  const O4: Vec3 = [s.d, 0, 0];
  const A = rot([s.a, 0, 0], th0);
  const sol = dyadRRR(A, O4, s.c, s.b);
  const B = sol.roots[s.root ?? 0];
  const drv = s.driver ?? { kind: "rotary" };
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "crank", role: "driver", at: { joint: "O2" } },
      { id: "coupler", role: "link" },
      { id: "rocker", role: "output" },
    ],
    joints: [
      { id: "O2", type: "revolute", a: "ground", b: "crank", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "A", type: "revolute", a: "crank", b: "coupler", at: A, axis: [0, 0, 1] },
      { id: "B", type: "revolute", a: "coupler", b: "rocker", at: B, axis: [0, 0, 1] },
      { id: "O4", type: "revolute", a: "rocker", b: "ground", at: O4, axis: [0, 0, 1] },
    ],
    params: [
      { id: "a", value: s.a, min: 10, max: 200 },
      { id: "b", value: s.b, min: 10, max: 200 },
      { id: "c", value: s.c, min: 10, max: 200 },
    ],
    design: [{ id: "branch", options: ["left", "right"], value: (s.root ?? 0) === 0 ? "left" : "right" }],
    drivers: [
      drv.kind === "rotary"
        ? { id: "input", joint: "O2", kind: "rotary", range: [0, 360], default: th0 }
        : { id: "input", joint: "O2", kind: "oscillating", lo: drv.lo, hi: drv.hi, default: th0 },
    ],
    solve: [{ block: "dyad", id: "coupler", in: { a: "A", b: "O4", ra: "c", rb: "b" }, branch: "branch", out: "B" }],
    points: [
      { id: "A", body: "crank", local: [A[0], A[1], A[2]] },
      { id: "B", body: "coupler", local: [B[0], B[1], B[2]] },
    ],
    outputs: [{ id: "rocker-angle", of: "rocker", kind: "angle", unit: "deg" }],
    fallback: null,
  };
}

/** Crank-rocker with ground 100: Grashof, the crank turns fully. */
export const crankRocker = (): Kin => fourBar({ d: 100, a: 30, b: 70, c: 80 });

/** Antiparallelogram: opposite sides equal (crank = rocker = 40, coupler = ground = 100), crossed branch. */
export function antiparallelogram(): Kin {
  const th0 = 90;
  const A = rot([40, 0, 0], th0);
  const O4: Vec3 = [100, 0, 0];
  const sol = dyadRRR(A, O4, 100, 40);
  // the parallelogram closure is B = A + (100, 0); the antiparallelogram is the other root
  const par = v3.add(A, [100, 0, 0]);
  const root: 0 | 1 = v3.dist(sol.roots[0], par) > v3.dist(sol.roots[1], par) ? 0 : 1;
  return fourBar({ d: 100, a: 40, b: 40, c: 100, theta0: th0, root });
}

/** Parallelogram, for contrast: the same lengths on the other branch. */
export function parallelogram(): Kin {
  const th0 = 90;
  const A = rot([40, 0, 0], th0);
  const sol = dyadRRR(A, [100, 0, 0], 100, 40);
  const par = v3.add(A, [100, 0, 0]);
  const root: 0 | 1 = v3.dist(sol.roots[0], par) < v3.dist(sol.roots[1], par) ? 0 : 1;
  return fourBar({ d: 100, a: 40, b: 40, c: 100, theta0: th0, root });
}

/**
 * Toggle clamp as a four-bar: handle (crank) 30, coupler 50, jaw (rocker) 25 on a ground of 60. The handle rocks over
 * ±30°; the dead centre where handle and coupler line up falls at ±12.4°.
 */
export const toggleClamp = (): Kin => fourBar({ d: 60, a: 30, b: 25, c: 50, theta0: 0, driver: { kind: "oscillating", lo: -30, hi: 30 } });

/** Universal joint: input shaft along x, output shaft bent by `beta` degrees about z, shafts meeting at the origin. */
export function universalJoint(beta = 30): Kin {
  const a1: Vec3 = [1, 0, 0];
  const a2: Vec3 = [Math.cos(beta * D), Math.sin(beta * D), 0];
  const pinA: Vec3 = [0, 1, 0];
  const pinB = v3.unit(v3.cross(pinA, a2));
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "shaftIn", role: "driver" },
      { id: "shaftOut", role: "output" },
    ],
    joints: [
      { id: "Ri", type: "revolute", a: "ground", b: "shaftIn", at: [-60, 0, 0], axis: a1 },
      { id: "Ro", type: "revolute", a: "ground", b: "shaftOut", at: v3.mul(a2, 60), axis: a2 },
      { id: "U", type: "universal", a: "shaftIn", b: "shaftOut", at: [0, 0, 0], axis: a1, axis2: a2, pinA, pinB },
    ],
    params: [{ id: "beta", value: beta, unit: "deg", min: 0, max: 45 }],
    drivers: [{ id: "input", joint: "Ri", kind: "rotary", range: [0, 360], default: 0 }],
    solve: [{ block: "hooke", id: "cardan", in: { joint: "U", input: "input" } }],
    outputs: [{ id: "out-angle", of: "shaftOut", kind: "angle", unit: "deg" }],
    fallback: null,
  };
}

/** Constant-velocity variant of the same arrangement. */
export function homokineticJoint(beta = 30): Kin {
  const k = universalJoint(beta);
  k.joints = k.joints.map((j) => (j.id === "U" ? { ...j, homokinetic: true } : j));
  k.solve = [{ block: "homokinetic", id: "cv", in: { joint: "U", input: "input" } }];
  // a CV joint's output frame mirrors the input frame in the bisecting plane: its cross arms are not a Cardan cross
  k.joints = k.joints.map((j) => (j.id === "U" ? { ...j, pinA: undefined, pinB: undefined } : j));
  return k;
}

export interface BennettSpec {
  a: number;
  alphaDeg: number;
  betaDeg: number;
  theta0Deg: number;
}

/** Bennett linkage whose DH ground frame is the world frame. */
export function bennett(s: BennettSpec = { a: 60, alphaDeg: 40, betaDeg: 70, theta0Deg: 50 }): Kin {
  const alpha = s.alphaDeg * D;
  const beta = s.betaDeg * D;
  const b = bennettB(s.a, alpha, beta);
  const f = bennettFrames({ a: s.a, b, alpha, beta }, s.theta0Deg * D);
  const ax = f.axes;
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "crank", role: "driver" },
      { id: "coupler", role: "link" },
      { id: "rocker", role: "output" },
    ],
    joints: [
      { id: "J1", type: "revolute", a: "ground", b: "crank", at: ax[0]![0], axis: ax[0]![1] },
      { id: "J2", type: "revolute", a: "crank", b: "coupler", at: ax[1]![0], axis: ax[1]![1] },
      { id: "J3", type: "revolute", a: "coupler", b: "rocker", at: ax[2]![0], axis: ax[2]![1] },
      { id: "J4", type: "revolute", a: "rocker", b: "ground", at: ax[3]![0], axis: ax[3]![1] },
    ],
    params: [
      { id: "a", value: s.a },
      { id: "alpha", value: s.alphaDeg },
      { id: "beta", value: s.betaDeg },
    ],
    drivers: [{ id: "input", joint: "J1", kind: "rotary", range: [0, 360], default: s.theta0Deg }],
    solve: [
      {
        block: "bennett",
        id: "loop",
        in: { a: "a", alpha: "alpha", beta: "beta", theta0: s.theta0Deg, input: "input", joints: ["J1", "J2", "J3", "J4"], bodies: ["crank", "coupler", "rocker"] },
      },
    ],
    fallback: null,
  };
}
