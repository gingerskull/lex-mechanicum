// Spatial linkage blocks: the Hooke joint (with or without its cross as a body), the homokinetic joint, Bennett's linkage
// (from its parameters or read from its joints) and the Sarrus linkage.
import { type BlockFn, type BlockCtx, KinError } from "../ctx";
import type { SolveStep } from "../types";
import { D2R, type Vec3, type Xf, m3, v3, wrapPi, xf, R2D } from "../math";
import { bennettB, bennettFrames, bisectorNormal, hookeAngle, sarrusPair } from "../blocks/spatial";
import { angleFrom, outVal, spin, str } from "./shared";

/**
 * hooke. in: joint (a `universal` joint: axis = input shaft, axis2 = output shaft, pinA and pinB the cross arms),
 * input (the input yoke's angle, deg, as a value name), bodies [input shaft body, output shaft body].
 * The output yoke follows tan θ2 = tan θ1 / cos β with both angles measured as in blocks/spatial.
 */
const hooke: BlockFn = (c, s) => {
  const i = s.in ?? {};
  if (i.cross !== undefined) return hookeCross(c, s);
  const jid = str(i.joint, "hooke.joint");
  const j = c.joint(jid);
  const a1 = c.jointAxis(jid);
  const a2 = v3.unit(c.vec(j.axis2, "universal axis2"));
  const centre = c.jointAt(jid);
  const pinA = v3.unit(c.vec(j.pinA, "universal pinA"));
  const np = v3.unit(v3.cross(a1, a2));
  const p1 = v3.cross(np, a1);
  const beta = Math.acos(Math.max(-1, Math.min(1, v3.dot(a1, a2))));
  const psi0 = Math.atan2(v3.dot(pinA, np), v3.dot(pinA, p1));
  const d1 = c.delta("in", c.rad(i.input));
  const t2 = hookeAngle(psi0 + d1, beta);
  const d2 = t2 - hookeAngle(psi0, beta);
  const bodies = (i.bodies as string[] | undefined) ?? [j.a, j.b];
  spin(c, bodies[0]!, centre, a1, d1);
  spin(c, bodies[1]!, centre, a2, d2);
  outVal(c, s, d2 * R2D, "delta");
};

/** The columns x, y, z of a rotation matrix (row-major Mat3). */
const cols = (x: Vec3, y: Vec3, z: Vec3) => [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]] as import("../math").Mat3;

/**
 * hooke, with the cross as a body of its own (a Cardan joint as built: two yokes, a cross and four revolutes).
 * in: input (the input shaft's angle, deg, as a value name), cross (body), joints { in, out, a, b }: the input shaft's
 * ground revolute, the output shaft's, the input yoke's pin into the cross and the output yoke's (their axes the cross
 * arms, all four meeting at the cross centre). The output follows tan θ2 = tan θ1 / cos β, and the cross turns so its
 * arms stay on both yokes' pins. A shaft with no ground joint of its own (the centre yoke of a double Cardan joint, held
 * on its line by the crosses at both ends) is given instead as in.shafts.in or in.shafts.out: { body, axis }.
 */
function hookeCross(c: BlockCtx, s: SolveStep): void {
  const i = s.in ?? {};
  const J = (i.joints ?? {}) as Record<string, unknown>;
  const sh = (i.shafts ?? {}) as Record<string, { body?: unknown; axis?: unknown } | undefined>;
  const jA = str(J.a, "hooke.joints.a");
  const jB = str(J.b, "hooke.joints.b");
  const shaft = (k: "in" | "out"): { body: string; axis: Vec3 } => {
    const free = sh[k];
    if (free) return { body: str(free.body, `hooke.shafts.${k}.body`), axis: v3.unit(c.vec(free.axis, `hooke.shafts.${k}.axis`)) };
    const jid = str(J[k], `hooke.joints.${k}`);
    const g = c.joint(jid);
    return { body: g.a === "ground" ? g.b : g.a, axis: c.jointAxis(jid) };
  };
  const sIn = shaft("in");
  const sOut = shaft("out");
  const a1 = sIn.axis;
  const a2 = sOut.axis;
  const pinA = c.jointAxis(jA);
  const pinB = c.jointAxis(jB);
  const centre = c.jointAt(jA);
  const np = v3.unit(v3.cross(a1, a2));
  const p1 = v3.cross(np, a1);
  const beta = Math.acos(Math.max(-1, Math.min(1, v3.dot(a1, a2))));
  const psi0 = Math.atan2(v3.dot(pinA, np), v3.dot(pinA, p1));
  const d1 = c.delta("in", c.rad(i.input));
  const d2 = beta < 1e-9 ? d1 : hookeAngle(psi0 + d1, beta) - hookeAngle(psi0, beta);
  const shaftIn = sIn.body;
  const shaftOut = sOut.body;
  const X1 = xf.rotAbout(centre, a1, d1);
  const X2 = xf.rotAbout(centre, a2, d2);
  c.setXf(shaftIn, X1);
  c.setXf(shaftOut, X2);
  // the cross: its arms carried by the two yokes' pins
  const qA = xf.dir(X1, pinA);
  const qB = xf.dir(X2, pinB);
  const R = m3.mul(cols(qA, qB, v3.cross(qA, qB)), m3.T(cols(pinA, pinB, v3.cross(pinA, pinB))));
  c.setXf(str(i.cross, "hooke.cross"), { R, t: v3.sub(centre, m3.mulV(R, centre)) });
  outVal(c, s, d2 * R2D, "delta");
}

/**
 * homokinetic. in: joint (a `universal` joint with homokinetic true), input (deg), bodies [in, out].
 * The output turns with the input: θ2 = θ1, the balls in the bisecting plane.
 */
const homokinetic: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "homokinetic.joint");
  const j = c.joint(jid);
  const a1 = c.jointAxis(jid);
  const a2 = v3.unit(c.vec(j.axis2, "homokinetic axis2"));
  const centre = c.jointAt(jid);
  const d1 = c.delta("in", c.rad(i.input));
  const bodies = (i.bodies as string[] | undefined) ?? [j.a, j.b];
  spin(c, bodies[0]!, centre, a1, d1);
  spin(c, bodies[1]!, centre, a2, d1);
  void bisectorNormal;
  outVal(c, s, d1 * R2D, "delta");
};

/**
 * bennett. in: a, alpha, beta (deg), b (optional, derived from Bennett's condition), joints [j1..j4] (ground-crank,
 * crank-coupler, coupler-rocker, rocker-ground), bodies [crank, coupler, rocker], input (crank joint angle, deg),
 * theta0 (its value in the reference configuration, deg), origin and rot (the world pose of the DH frame of the ground link).
 */
const bennett: BlockFn = (c, s) => {
  const i = s.in ?? {};
  if (Array.isArray(i.joints) && i.a === undefined) return bennettByJoints(c, s);
  const a = c.num(i.a);
  const alpha = c.num(i.alpha) * D2R;
  const beta = c.num(i.beta) * D2R;
  const b = i.b !== undefined ? c.num(i.b) : bennettB(a, alpha, beta);
  const p = { a, b, alpha, beta };
  const th0 = c.num(i.theta0 ?? 0) * D2R;
  const th = th0 + c.delta("in", c.rad(i.input));
  const G = bennettWorld(c, i);
  const now = bennettFrames(p, th);
  const ref = bennettFrames(p, th0);
  const bodies = (i.bodies as string[] | undefined) ?? [];
  const conj = (X: Xf, X0: Xf): Xf => xf.mul(G, xf.mul(X, xf.mul(xf.inv(X0), xf.inv(G))));
  if (bodies[0]) c.setXf(bodies[0], conj(now.crank, ref.crank));
  if (bodies[1]) c.setXf(bodies[1], conj(now.coupler, ref.coupler));
  if (bodies[2]) c.setXf(bodies[2], conj(now.rocker, ref.rocker));
};

/**
 * bennett, with no a, b, α, β given: the geometry read from the four joints (in.joints [j1..j4] in loop order, j1 the driven
 * ground joint): the link lengths and twists, the ground's DH frame and the reference input angle all come from the
 * joints' reference positions and axes (all offsets zero: each joint sits at the feet of the common normals). The four
 * twists must alternate (α β α β) and the lengths too, with Bennett's condition a sin β = b sin α. in.bodies [crank,
 * coupler, rocker], else the body each pair of neighbouring joints shares. in.input: the driven joint's angle (deg).
 */
function bennettByJoints(c: BlockCtx, s: SolveStep): void {
  const i = s.in ?? {};
  const ids = (i.joints as unknown[]).map((j, k) => str(j, `bennett.joints[${k}]`));
  if (ids.length !== 4) throw new KinError(`bennett ${s.id}: four joints`);
  const J = ids.map((id) => c.jointAt(id));
  const Z = ids.map((id) => c.jointAxis(id));
  const X = J.map((p, k) => v3.unit(v3.sub(J[(k + 1) % 4]!, p)));
  const len = J.map((p, k) => v3.dist(J[(k + 1) % 4]!, p));
  const tw = Z.map((z, k) => angleFrom(Z[(k + 1) % 4]!, X[k]!, z));
  const p = { a: len[0]!, b: len[1]!, alpha: tw[0]!, beta: tw[1]! };
  const off = Math.max(Math.abs(len[2]! - p.a), Math.abs(len[3]! - p.b), Math.abs(wrapPi(tw[2]! - p.alpha)) * p.a, Math.abs(wrapPi(tw[3]! - p.beta)) * p.b, Math.abs(p.a * Math.sin(p.beta) - p.b * Math.sin(p.alpha)));
  if (off > 1e-3) throw new KinError(`bennett ${s.id}: the joints do not make a Bennett linkage (off by ${off.toFixed(4)})`);
  // the ground's DH frame at j1: z its axis, x along the ground link as it arrives (j4 to j1)
  const x0 = X[3]!;
  const z0 = Z[0]!;
  const G: Xf = { R: cols(x0, v3.cross(z0, x0), z0), t: J[0]! };
  const th0 = angleFrom(X[0]!, z0, x0);
  const th = th0 + c.delta("in", c.rad(i.input));
  const now = bennettFrames(p, th);
  const ref = bennettFrames(p, th0);
  const shared = (ja: string, jb: string): string | undefined => {
    const A = c.joint(ja);
    const B = c.joint(jb);
    return [A.a, A.b].find((b) => b !== "ground" && (b === B.a || b === B.b));
  };
  const given = (i.bodies as string[] | undefined) ?? [];
  const bodies = [given[0] ?? shared(ids[0]!, ids[1]!), given[1] ?? shared(ids[1]!, ids[2]!), given[2] ?? shared(ids[2]!, ids[3]!)];
  const conj = (Xn: Xf, X0: Xf): Xf => xf.mul(G, xf.mul(Xn, xf.mul(xf.inv(X0), xf.inv(G))));
  if (bodies[0]) c.setXf(bodies[0], conj(now.crank, ref.crank));
  if (bodies[1]) c.setXf(bodies[1], conj(now.coupler, ref.coupler));
  if (bodies[2]) c.setXf(bodies[2], conj(now.rocker, ref.rocker));
}

/** World pose of a Bennett linkage's DH ground frame, from in.origin and in.rot (degrees). */
function bennettWorld(c: BlockCtx, i: Record<string, unknown>): Xf {
  const o = i.origin ? c.vec(i.origin) : ([0, 0, 0] as Vec3);
  const r = i.rot ? c.vec(i.rot) : ([0, 0, 0] as Vec3);
  return { R: m3.eulerDeg(r), t: o };
}

/**
 * sarrus. in: l1, l2 (base and top link lengths), input (the base links' angle above the base plane, deg),
 * theta0 (its reference value), top (body), legs [{ lower, upper, base, knee }] (two legs in orthogonal planes; base
 * and knee are joint ids, their axes horizontal).
 */
const sarrus: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const l1 = c.num(i.l1);
  const l2 = c.num(i.l2);
  const th0 = c.num(i.theta0 ?? 0) * D2R;
  const th = th0 + c.delta("in", c.rad(i.input));
  const now = sarrusPair(l1, l2, th);
  const ref = sarrusPair(l1, l2, th0);
  if (!now.reachable) throw new KinError(`sarrus ${s.id}: links cannot reach`);
  const dTh = th - th0;
  const dPhi = now.phi - ref.phi;
  const legs = (i.legs as { lower: string; upper: string; base: string; knee: string }[] | undefined) ?? [];
  for (const leg of legs) {
    const axis = c.jointAxis(leg.base);
    const base = c.jointAt(leg.base);
    const knee = c.jointAt(leg.knee);
    // positive theta must raise the knee
    const sign = Math.sign(v3.dot(v3.cross(axis, v3.sub(knee, base)), [0, 0, 1])) || 1;
    const lower = xf.rotAbout(base, axis, sign * dTh);
    c.setXf(leg.lower, lower);
    // the upper link turns by -dPhi in the sense of theta, about the knee, then rides with the lower link
    c.setXf(leg.upper, xf.mul(lower, xf.rotAbout(knee, axis, sign * (-dPhi - dTh))));
  }
  if (typeof i.top === "string") c.setXf(i.top, xf.trans([0, 0, now.z - ref.z]));
  outVal(c, s, now.z - ref.z, "lift");
};

export const SPATIAL_BLOCKS: Record<string, BlockFn> = {
  hooke,
  homokinetic,
  bennett,
  sarrus,
};
