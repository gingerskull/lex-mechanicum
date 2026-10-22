// The block registry: each `solve` step names one of these. A block reads named inputs through the context, calls the
// closed forms in ./blocks, and writes points, values and body poses. The exact `in` fields of each block are
// listed above it.
import { type BlockFn, type BlockCtx, KinError } from "./ctx";
import { type SolveStep } from "./types";
import { D2R, TAU, type Vec3, m3, v3, wrapPi, xf, R2D } from "./math";
import { dyadRPR, dyadRRP, dyadRRR, fiveBarFK, fiveBarIK } from "./blocks/linkage";
import { bennettB, bennettFrames, bisectorNormal, hookeAngle, sarrusPair } from "./blocks/spatial";
import { ellipticalAngle, meshRatio, ravigneaux, willis } from "./blocks/gears";
import { type CamLaw, type CamSchedule, camMotion, lawRise, pressureAngle } from "./blocks/cam";
import { chainAdvance, chainSpeed, chainTurn, differentialAdvance, flexureEnd, pathAt, pathLength, reeve, screwAdvance, sheaveShift, variatorR2, vonMises } from "./blocks/members";
import { genevaAngle, genevaInternalAngle, ratchetWheel, rideAngle, sawOutline, simulateEscape, simulateEscapement, simulateStar, simulateVerge, type VergeSpec, type EscapementSpec, type RatchetSpec, type StarSpec } from "./blocks/timed";
import { COUPLING_BLOCKS } from "./blocks/couplings";

function outName(step: SolveStep, key?: string): string | undefined {
  const o = step.out;
  if (typeof o === "string") return key === undefined || key === "" ? o : undefined;
  if (Array.isArray(o)) return undefined;
  return key ? o?.[key] : undefined;
}

function outPoint(c: BlockCtx, step: SolveStep, p: Vec3, key?: string): void {
  const n = outName(step, key);
  if (n) c.setPt(n, p);
}

function outVal(c: BlockCtx, step: SolveStep, v: number, key?: string): void {
  const n = outName(step, key);
  if (n) c.setVal(n, v);
}

const str = (v: unknown, what: string): string => {
  if (typeof v !== "string") throw new KinError(`${what} must be a name`);
  return v;
};

/** Rotate a body (mounted on the ground) about the line through `center` with `axis`, relative to the reference pose. */
const spin = (c: BlockCtx, body: string, center: Vec3, axis: Vec3, ang: number): void => c.setXf(body, xf.rotAbout(center, axis, ang));

/**
 * dyad (RRR). in: a, b (points), ra, rb (lengths: the link from a, the link from b), n (plane normal, default +z).
 * out: the point closing both links. branch picks the side (+1: left of a→b seen from +n).
 */
const dyad: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const sol = dyadRRR(c.vec(i.a), c.vec(i.b), c.num(i.ra), c.num(i.rb), i.n ? c.vec(i.n) : [0, 0, 1]);
  const k = c.root(sol.roots, sol.h);
  outPoint(c, s, sol.roots[k]);
};

/**
 * slider-dyad. in.kind "rrp": a (pivot), r (link length), p, d (a point and direction of the slide). out: the point;
 * out.s: the slide coordinate. branch: +1 far along d, −1 near.
 * in.kind "rpr": a (slot link pivot), p (the pin's point), body (the slotted link, optional), n. out.angle, out.dist (deg, mm).
 */
const sliderDyad: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const kind = (i.kind as string | undefined) ?? "rrp";
  if (kind === "rrp") {
    const sol = dyadRRP(c.vec(i.a), c.num(i.r), c.vec(i.p), c.vec(i.d));
    const k = c.root(sol.points, sol.h);
    outPoint(c, s, sol.points[k], typeof s.out === "string" ? "" : "p");
    outVal(c, s, sol.s[k], "s");
    return;
  }
  if (kind === "rpr") {
    const a = c.vec(i.a);
    const n = i.n ? c.vec(i.n) : ([0, 0, 1] as Vec3);
    const r = dyadRPR(a, c.vec(i.p), n);
    const r0 = dyadRPR(c.refVec(i.a), c.refVec(i.p), n);
    outVal(c, s, r.angle * R2D, "angle");
    outVal(c, s, r.dist, "dist");
    if (typeof i.body === "string") {
      const dAng = Math.atan2(Math.sin(r.angle - r0.angle), Math.cos(r.angle - r0.angle));
      c.setXf(i.body, xf.mul(xf.trans(v3.sub(a, c.refVec(i.a))), xf.rotAbout(c.refVec(i.a), n, dAng)));
    }
    return;
  }
  throw new KinError(`slider-dyad kind ${kind}`);
};

/**
 * five-bar. in: A1, A2 (base points), l1 l2 (cranks), l3 l4 (distal links), n.
 * mode "fk" (default): th1, th2 (crank angles, deg), out {P, E1, E2}; branch picks the side of the distal dyad.
 * mode "ik": target (a point), elbow1, elbow2 (+1/−1), cranks [body, body], joints [j1, j2]; out {th1, th2, E1, E2}.
 */
const fiveBar: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const g = { A1: c.vec(i.A1), A2: c.vec(i.A2), l1: c.num(i.l1), l2: c.num(i.l2), l3: c.num(i.l3), l4: c.num(i.l4), n: i.n ? c.vec(i.n) : undefined };
  if ((i.mode as string | undefined) === "ik") {
    const r = fiveBarIK(g, c.vec(i.target), (c.num(i.elbow1 ?? 1) >= 0 ? 1 : -1), (c.num(i.elbow2 ?? 1) >= 0 ? 1 : -1));
    if (!r) throw new KinError(`five-bar ${s.id}: target out of reach`);
    outVal(c, s, r.th1 * R2D, "th1");
    outVal(c, s, r.th2 * R2D, "th2");
    outPoint(c, s, r.E1, "E1");
    outPoint(c, s, r.E2, "E2");
    const cranks = (i.cranks as string[] | undefined) ?? [];
    const joints = (i.joints as string[] | undefined) ?? [];
    [r.th1, r.th2].forEach((th, k) => {
      const body = cranks[k];
      const j = joints[k];
      if (body && j) spin(c, body, c.jointAt(j), c.jointAxis(j), c.delta(`th${k}`, th));
    });
    return;
  }
  const th1 = c.rad(i.th1);
  const th2 = c.rad(i.th2);
  const base = fiveBarFK(g, th1, th2, 1);
  const alt = fiveBarFK(g, th1, th2, -1);
  const k = c.root([[...base.P], [...alt.P]], base.h);
  const sol = k === 0 ? base : alt;
  outPoint(c, s, sol.P, "P");
  outPoint(c, s, sol.E1, "E1");
  outPoint(c, s, sol.E2, "E2");
};

const sideOf = (q: unknown): number => (typeof q === "number" ? q : 1);

/** Angle of vector d about unit axis a, from the unit direction e0 (right-handed). */
const angleFrom = (d: Vec3, a: Vec3, e0: Vec3): number => Math.atan2(v3.dot(a, v3.cross(e0, d)), v3.dot(e0, d));

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
const cols = (x: Vec3, y: Vec3, z: Vec3) => [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]] as import("./math").Mat3;

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

import type { Xf } from "./math";

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

/**
 * gear-mesh. in: joint (a `gear-mesh` joint: za/zb or ratio, internal, crossed/sign, radiusA for a rack, ncg { e, phase,
 * a }: out contact, the driver's pitch radius at the contact), input (a
 * value: body a's angle, deg), ref (b's angle in the reference configuration, default 0), parent (a body whose pose
 * carries b's centre, for a planet), shaft b's axis is joint.axis2 or joint.axis. out: b's angle (deg) or rack travel (mm).
 * With `carrier` (the angle of a link that carries the mesh round, deg) b turns relative to the carrier by the ratio
 * times a's turn relative to it (a ring of pins held still and a disc on an eccentric: a is the ground, no input; b's
 * centre rides the carrier given as `parent`).
 * A gear a on a moving centre (a planet fixed to a rod, the sun-and-planet gear): `line` [p, q], two points of body a
 * whose direction gives a's turn in place of `input`, and `carrier` (a value: the angle of the link that carries a's
 * centre round b, deg); b turns by the carrier's turn plus the ratio times a's turn relative to the carrier.
 */
const gearMesh: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "gear-mesh.joint");
  const j = c.joint(jid);
  if (Array.isArray(i.line)) return planetMesh(c, s, j);
  // a's turn (a held ring or ground pins have none); with a carrier, b's turn relative to it follows a's relative to it
  const dA = i.input !== undefined ? c.delta("in", c.rad(i.input)) : 0;
  const dC = i.carrier !== undefined ? c.delta("carrier", c.rad(i.carrier)) : 0;
  const axisB = j.axis2 ? v3.unit(c.vec(j.axis2)) : c.jointAxis(jid);
  let X: Xf;
  let dB = 0;
  if (j.radiusA !== undefined && j.radiusB === undefined && j.zb === undefined && j.ratio === undefined && !j.ncg) {
    // rack: b translates along axis2 by r Δθa
    const t = c.num(j.radiusA) * dA;
    X = xf.trans(v3.mul(axisB, t));
    outVal(c, s, t, "travel");
  } else {
    dB = gearDelta(c, j, dA - dC);
    X = xf.rotAbout(c.vec(j.cb ?? j.at), axisB, dB);
  }
  if (j.ncg && j.ncg.a !== undefined) {
    // the contact on the line of centres: the driver's pitch radius there (the ellipse about its focus; at phase 0 its
    // long radius meets the driven gear's short one, as ellipticalAngle counts it)
    const e = c.num(j.ncg.e);
    const ph = c.num(j.ncg.phase ?? 0) * D2R + dA;
    const r1 = (c.num(j.ncg.a) * (1 - e * e)) / (1 - e * Math.cos(ph));
    outVal(c, s, r1, "contact");
    // and the contact point itself, on the line of centres ca-cb (out.point: the mesh joint's name keeps it there)
    if (j.ca !== undefined && j.cb !== undefined) {
      const ca = c.vec(j.ca);
      outPoint(c, s, v3.add(ca, v3.mul(v3.unit(v3.sub(c.vec(j.cb), ca)), r1)), "point");
    }
  }
  const parent = i.parent as string | undefined;
  // with a carrier but no parent, b's centre stands still and it turns by the carrier's turn as well
  const own = i.carrier !== undefined && !(parent && c.has(parent)) ? xf.mul(xf.rotAbout(c.vec(j.cb ?? j.at), axisB, dC), X) : X;
  c.setXf(j.b, parent && c.has(parent) ? xf.mul(c.xf(parent), own) : own);
  // the pitch point carried round with b's centre on the line of centres from a's (out.point)
  if (parent && c.has(parent) && j.ca !== undefined && j.cb !== undefined) {
    const ca = c.vec(j.ca);
    const cbNow = xf.apply(c.xf(parent), c.vec(j.cb));
    outPoint(c, s, v3.add(ca, v3.mul(v3.unit(v3.sub(cbNow, ca)), v3.dist(c.vec(j.at), ca))), "point");
  }
  outVal(c, s, (dB + dC) * R2D + c.num(i.ref ?? 0), "angle");
};

/** gear-mesh with a on a moving centre: a's turn from a line of two of its points, b's turn about its fixed axis. */
function planetMesh(c: BlockCtx, s: SolveStep, j: import("./types").KinJoint): void {
  const i = s.in ?? {};
  const [p, q] = i.line as unknown[];
  const axisB = j.axis2 ? v3.unit(c.vec(j.axis2)) : c.jointAxis(j.id);
  const e0 = v3.sub(c.refVec(q), c.refVec(p));
  const e1 = v3.sub(c.vec(q), c.vec(p));
  const dA = angleFrom(e1, axisB, v3.unit(e0));
  const dC = i.carrier !== undefined ? c.delta("carrier", c.rad(i.carrier)) : 0;
  const dB = dC + gearDelta(c, j, dA - dC);
  c.setXf(j.b, xf.rotAbout(c.vec(j.cb ?? j.at), axisB, dB));
  outVal(c, s, dB * R2D + c.num(i.ref ?? 0), "angle");
}

/** Angle of gear b for a turn dA of a, from the joint's ratio, tooth counts or non-circular pitch curve. */
export function gearDelta(c: BlockCtx, j: import("./types").KinJoint, dA: number): number {
  if (j.ncg) {
    const e = c.num(j.ncg.e);
    const ph = c.num(j.ncg.phase ?? 0) * D2R;
    return -(ellipticalAngle(e, ph + dA) - ellipticalAngle(e, ph));
  }
  if (j.ratio !== undefined) return c.num(j.ratio) * dA;
  const sign = j.crossed ? (j.hand === "left" ? -1 : 1) : undefined;
  return meshRatio({ za: c.num(j.za), zb: c.num(j.zb), internal: j.internal, sign: (sign as 1 | -1 | undefined) }) * dA;
}

/**
 * willis. in: zs, zr (sun and ring teeth), zp (planet teeth, optional), center and axis (the common axis),
 * sun, ring, carrier: two of them as values (deg) or numbers (a held member is 0), the third is solved;
 * bodies {sun, ring, carrier}, planets [{ body, center }]. out {sun, ring, carrier, planet, spin}: the angles turned (deg);
 * planet is a planet's turn in the world, spin its turn on its own pin (relative to the carrier).
 */
const willisBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const spec = { zs: c.num(i.zs), zr: c.num(i.zr), zp: i.zp !== undefined ? c.num(i.zp) : undefined };
  const known: Partial<Record<"sun" | "ring" | "carrier", number>> = {};
  for (const k of ["sun", "ring", "carrier"] as const) if (i[k] !== undefined) known[k] = c.delta(k, c.rad(i[k]));
  const w = willis(spec, known);
  const centre = c.vec(i.center);
  const axis = v3.unit(c.vec(i.axis));
  const bodies = (i.bodies as Record<string, string> | undefined) ?? {};
  for (const k of ["sun", "ring", "carrier"] as const) {
    const b = bodies[k];
    if (b) spin(c, b, centre, axis, w[k]);
    outVal(c, s, w[k] * R2D, k);
  }
  const planets = (i.planets as { body: string; center: unknown }[] | undefined) ?? [];
  for (const p of planets) {
    const pc = c.refVec(p.center);
    const own = xf.rotAbout(pc, axis, (w.planet ?? 0) - w.carrier);
    c.setXf(p.body, xf.mul(xf.rotAbout(centre, axis, w.carrier), own));
  }
  if (w.planet !== null) {
    outVal(c, s, w.planet * R2D, "planet");
    // a planet's turn on its own pin, relative to the carrier
    outVal(c, s, (w.planet - w.carrier) * R2D, "spin");
  }
};

/**
 * ravigneaux. A compound planetary set with two suns, short and long pinions on one carrier and a ring (see `ravigneaux`
 * in blocks/gears). in: zSs, zSl, zPs, zPl, zR (teeth), center, axis (the common axis), input (the input member's
 * angle, deg), inputMember, held, locked (design choices: a member's name; held "none"; locked "none" or "a+b"),
 * bodies { sunS, sunL, carrier, ring }, short and long [{ body, joint }] (each pinion on its pin, joints to the carrier).
 * out { sunS, sunL, carrier, ring, short, long }: the members' angles and the pinions' turns on their pins (deg).
 */
const ravigneauxBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const members = ["sunS", "sunL", "carrier", "ring"] as const;
  type M = (typeof members)[number];
  const member = (v: string | undefined, what: string): M => {
    if (!members.includes(v as M)) throw new KinError(`${s.id}: ${what} "${String(v)}" is not sunS, sunL, carrier or ring`);
    return v as M;
  };
  const pick = (k: string): string | undefined => (typeof i[k] === "string" ? (c.choice(i[k]) ?? (i[k] as string)) : undefined);
  const inputMember = member(pick("inputMember"), "input member");
  const heldName = pick("held");
  const lockName = pick("locked");
  const held = heldName && heldName !== "none" ? member(heldName, "held member") : null;
  const lock = lockName && lockName !== "none" ? (lockName.split("+").map((m) => member(m, "locked member")) as [M, M]) : null;
  const spec = { zSs: c.num(i.zSs), zSl: c.num(i.zSl), zPs: c.num(i.zPs), zPl: c.num(i.zPl), zR: c.num(i.zR) };
  const w = ravigneaux(spec, c.delta("in", c.rad(i.input)), inputMember, lock ? null : held, lock);
  const centre = c.vec(i.center);
  const axis = v3.unit(c.vec(i.axis));
  const bodies = (i.bodies as Record<string, string> | undefined) ?? {};
  for (const k of members) {
    const b = bodies[k];
    if (b) spin(c, b, centre, axis, w[k]);
    outVal(c, s, w[k] * R2D, k);
  }
  const C = xf.rotAbout(centre, axis, w.carrier);
  for (const set of ["short", "long"] as const) {
    for (const p of (i[set] as { body: string; joint: string }[] | undefined) ?? []) c.setXf(p.body, xf.mul(C, xf.rotAbout(c.refVec(p.joint), axis, w[set])));
    outVal(c, s, w[set] * R2D, set);
  }
};

const lawOf = (l: string | undefined): CamLaw => (l === "harmonic" || l === "poly345" || l === "uniform" || l === "modsine" ? l : "cycloidal");

/**
 * cam. in: joint (a `cam-contact` joint carrying cam: schedule, lift, rb, e, theta0), input (the cam angle, deg),
 * follower (body), axis (the follower's direction of travel, unit; or the pivot axis when swing is true),
 * swing (true: an oscillating follower about the joint's `at`; lift is then radians' worth in degrees).
 * follower may be a list (the follower and the bodies it carries); rr (roller radius) or flat (true: a flat face) place
 * the contact point, which needs the joint's `ca` (the cam's centre).
 * out {s, v, pressure, contact}: displacement (mm or deg), ds/dθ, pressure angle (deg), the contact point.
 */
const camBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "cam.joint");
  const j = c.joint(jid);
  if (!j.cam) throw new KinError(`cam ${s.id}: joint ${jid} has no cam data`);
  const sched: CamSchedule = {
    lift: c.num(j.cam.lift),
    segments: j.cam.schedule.map((g) => ({ kind: g.kind, span: c.num(g.span) * D2R, law: lawOf(g.law) })),
  };
  const th0 = c.num(j.cam.theta0 ?? 0) * D2R;
  const th = th0 + c.delta("in", c.rad(i.input));
  const m = camMotion(sched, th);
  const m0 = camMotion(sched, th0);
  // the follower and the bodies it carries (a roller on its stud): one name or a list
  const carried = (Array.isArray(i.follower) ? i.follower : [i.follower]).map((f) => str(f, "cam.follower"));
  const X = i.swing === true ? xf.rotAbout(c.jointAt(jid), c.vec(i.axis), (m.s - m0.s) * D2R) : xf.trans(v3.mul(v3.unit(c.vec(i.axis)), m.s - m0.s));
  for (const f of carried) c.setXf(f, X);
  const rb = c.num(j.cam.rb);
  outVal(c, s, m.s, "s");
  outVal(c, s, m.v, "v");
  // a barrel cam's follower runs along the axis at the pitch radius: tan φ = s' / rb
  const phi = j.cam.form === "barrel" ? Math.atan2(m.v, rb) : pressureAngle({ rb, e: j.cam.e !== undefined ? c.num(j.cam.e) : 0 }, m.s, m.v);
  outVal(c, s, phi * R2D, "pressure");
  // the contact point on the cam (a translating follower in line with the cam centre): a roller of radius `rr` touches
  // along the pitch curve's normal, n ∝ ρ r̂ + v t̂ with ρ = rb + s; a flat face (`flat: true`) touches at ρ r̂ − v t̂,
  // the envelope of its lines. r̂ is the follower's direction from the cam centre, t̂ = axis × r̂, the cam turning about +axis.
  const kOut = outName(s, "contact");
  if (kOut && i.swing !== true && j.ca) {
    const ax = c.jointAxis(jid);
    const centre = c.vec(j.ca);
    const tip = xf.apply(X, c.jointAt(jid));
    const rel = v3.sub(tip, centre);
    const rHat = v3.unit(v3.sub(rel, v3.mul(ax, v3.dot(rel, ax))));
    const tHat = v3.cross(ax, rHat);
    const rho = rb + m.s;
    // a barrel cam: the groove's normal in the cylinder's tangent plane, n ∝ rb â + s' t̂ (â the axis)
    if (j.cam.form === "barrel") c.setPt(kOut, v3.sub(tip, v3.mul(v3.unit(v3.add(v3.mul(ax, rb), v3.mul(tHat, m.v))), c.num(i.rr ?? 0))));
    else if (i.flat === true) c.setPt(kOut, v3.add(v3.add(centre, v3.mul(ax, v3.dot(rel, ax))), v3.sub(v3.mul(rHat, rho), v3.mul(tHat, m.v))));
    else {
      const n = v3.unit(v3.add(v3.mul(rHat, rho), v3.mul(tHat, m.v)));
      c.setPt(kOut, v3.sub(tip, v3.mul(n, c.num(i.rr ?? 0))));
    }
  }
};

/**
 * screw. in: joint (a `screw` joint: lead, hand; a the shaft, b the nut), input (the shaft's angle about the joint's axis,
 * deg), nut (body; default the joint's b), hand (optional: the name of a design choice whose value "opposite" flips the
 * joint's hand, a differential screw's hand switch), lead2 (a second lead for a differential screw: the second nut `nut2`
 * advances (lead − lead2) per turn), balls ({ ratio, r }: a ball nut's balls, the ball
 * centres' share of the turn and their circle's radius; their travel along the circuit is out.balls, mm).
 * The nut does not turn (its guide holds it), so it turns by −Δθ relative to the shaft and, by the helical law, moves
 * hand · lead · (−Δθ) / 2π along the axis relative to the shaft, plus whatever the shaft itself has advanced (a screw
 * running in a fixed nut of its own). A right-hand screw turned positively about +axis drives its nut toward −axis.
 */
const screwBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "screw.joint");
  const j = c.joint(jid);
  const d = c.delta("in", c.rad(i.input));
  const axis = c.jointAxis(jid);
  const at = c.jointAt(jid);
  const lead = c.num(j.lead);
  let hand = j.hand ?? "right";
  if (typeof i.hand === "string") {
    if (c.design(i.hand) === "opposite") hand = hand === "right" ? "left" : "right";
  }
  const shaft = (i.shaft as string | undefined) ?? j.a;
  const own = shaft !== "ground" && c.has(shaft) ? v3.dot(v3.sub(xf.apply(c.xf(shaft), at), at), axis) : 0;
  const adv = own + screwAdvance(lead, -d, hand);
  c.setXf((i.nut as string | undefined) ?? j.b, xf.trans(v3.mul(axis, adv)));
  outVal(c, s, adv, "advance");
  // a ball nut's balls roll between the turning and the still groove: relative to the nut each ball centre turns at
  // `ratio` of the screw's turn, on its helix of radius `r`; their travel along the circuit (mm) for the conveyed balls
  const balls = i.balls as { ratio?: unknown; r?: unknown } | undefined;
  if (balls) outVal(c, s, c.num(balls.ratio ?? 0.5) * d * Math.hypot(c.num(balls.r), lead / (2 * Math.PI)), "balls");
  if (i.lead2 !== undefined && typeof i.nut2 === "string") {
    const a2 = differentialAdvance(lead, c.num(i.lead2), d) * (j.hand === "left" ? -1 : 1);
    c.setXf(i.nut2, xf.trans(v3.mul(axis, a2)));
    outVal(c, s, a2, "advance2");
  }
};

/**
 * convey. in: joint (a `belt` joint: radiusA of the driving pulley, radiusB, crossed), input (driving pulley angle,
 * deg), C and r (obround path: centre distance and pitch radius), items [{ body, s }] (arc length of each at the
 * reference), origin and rot (the path's plane in the world, xy by default), driven (body, centre point).
 * out {angle}: the driven pulley's angle (deg).
 */
const conveyBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "convey.joint");
  const j = c.joint(jid);
  const d = c.delta("in", c.rad(i.input));
  if (i.mode === "chain") {
    // a roller chain on the sprockets' pitch polygons (chordal action): the joint gives za, zb, pitch and the seated
    // rollers' phases (deg); the travel is the chain's advance, the driven sprocket turns to take it up
    const jr = j as unknown as Record<string, unknown>;
    const za = c.num(j.za), zb = c.num(j.zb), p = c.num(jr.pitch);
    const pa = c.num(jr.phaseA ?? 0) * D2R, pb = c.num(jr.phaseB ?? 0) * D2R;
    const t = chainAdvance(d, za, p, pa) - chainAdvance(0, za, p, pa);
    const dB = chainTurn(chainAdvance(0, zb, p, pb) + t, zb, p, pb);
    if (typeof i.driven === "string") spin(c, i.driven, c.vec(i.drivenCenter ?? j.at), c.jointAxis(jid), dB);
    outVal(c, s, dB * R2D, "angle");
    outVal(c, s, t, "travel");
    outVal(c, s, chainSpeed(d, za, pa), "speed");
    return;
  }
  const ra = c.num(j.radiusA);
  const rb = c.num(j.radiusB ?? j.radiusA);
  const path = { C: c.num(i.C), r: c.num(i.r) };
  const travel = ra * d;
  const G: Xf = { R: m3.eulerDeg(i.rot ? c.vec(i.rot) : [0, 0, 0]), t: i.origin ? c.vec(i.origin) : [0, 0, 0] };
  const items = (i.items as { body: string; s: unknown }[] | undefined) ?? [];
  void pathLength;
  for (const it of items) {
    const s0 = c.num(it.s);
    const p0 = pathAt(path, s0);
    const p1 = pathAt(path, s0 + travel);
    const local = xf.mul(xf.trans([p1.x - p0.x, p1.y - p0.y, 0]), xf.rotAbout([p0.x, p0.y, 0], [0, 0, 1], p1.heading - p0.heading));
    c.setXf(it.body, xf.mul(G, xf.mul(local, xf.inv(G))));
  }
  const dB = (j.crossed ? -1 : 1) * (ra / rb) * d;
  if (typeof i.driven === "string") spin(c, i.driven, c.vec(i.drivenCenter ?? j.at), c.jointAxis(jid), dB);
  outVal(c, s, dB * R2D, "angle");
  outVal(c, s, travel, "travel");
};

/**
 * flexure. in: joint (a `flexure` joint at the pseudo-rigid-body pivot), input (the pivot angle Θ, deg), beam (the rigid
 * link, body), l (beam length), thetaMax (deg). out {bend, end}: Θ over Θmax, and the free end's distance along the beam.
 */
const flexureBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  if (i.mode === "snap") return snapBlock(c, s);
  const jid = str(i.joint, "flexure.joint");
  const th = c.rad(i.input);
  const d = c.delta("in", th);
  const beam = (i.beam as string | undefined) ?? c.joint(jid).b;
  spin(c, beam, c.jointAt(jid), c.jointAxis(jid), d);
  const e = flexureEnd(c.num(i.l), th, i.thetaMax !== undefined ? c.num(i.thetaMax) * D2R : undefined);
  outVal(c, s, e.bend, "bend");
  outVal(c, s, e.a, "end");
};

/**
 * flexure, mode "snap": a bistable shuttle held by two inclined beams (vonMises in blocks/members) and driven by a
 * pusher through springs. in: drive (the pusher's driver value, mm), q0 (the pusher's place at drive 0; default the
 * stable rest L0 sin θ0), dir (+1 or −1: the pusher's place moves dir · drive), L0, theta0 (deg), ka, ks, span (deg of
 * the cycle the snap takes, so a fold is not a jump, K2), shuttle (body), axis (its slide), beams [{ a, b, anchor, tip }]
 * (each beam's two pseudo-rigid halves, its anchor joint and its joint on the shuttle). On the way out (the drive rising,
 * the first half of the cycle) the shuttle stays on its first branch until the pusher passes the fold, then crosses to the
 * other over `span`; on the way back the same, mirrored. out { y, bend }: the shuttle's place and the beams' turn (deg).
 */
function snapBlock(c: BlockCtx, s: SolveStep): void {
  const i = s.in ?? {};
  const vm = vonMises({ L0: c.num(i.L0), theta0: c.num(i.theta0) * D2R, ka: c.num(i.ka), ks: c.num(i.ks) });
  const dir = i.dir !== undefined ? c.num(i.dir) : 1;
  const q0 = i.q0 !== undefined ? c.num(i.q0) : vm.rest;
  const drive = c.num(i.drive);
  const q = q0 + dir * drive;
  const span = c.num(i.span ?? 8) * D2R;
  const u = ((c.u % TAU) + TAU) % TAU;
  // the side the shuttle starts on is the one its rest is on; the pusher's place at each phase of the driver's cosine law
  const start: 1 | -1 = q0 >= 0 ? 1 : -1;
  const qAt = (x: number): number => q0 + dir * driveAt(c, str(i.drive, "flexure.drive"), x);
  let y: number;
  const blend = (t: number) => t * t * (3 - 2 * t);
  const out = u <= Math.PI;
  const from: 1 | -1 = out ? start : (-start as 1 | -1);
  // the fold on this half: the branch `from` ends where q passes from · qFold toward the other side
  const fold = from * vm.qFold;
  const beyond = (qq: number) => (from > 0 ? qq < fold : qq > fold);
  // the phase of the fold on this half (bisection on the cosine law, which is monotonic in each half)
  let us = NaN;
  {
    let lo = out ? 0 : Math.PI;
    let hi = out ? Math.PI : TAU;
    if (beyond(qAt(hi)) && !beyond(qAt(lo))) {
      for (let k = 0; k < 60; k++) {
        const m = (lo + hi) / 2;
        if (beyond(qAt(m))) hi = m;
        else lo = m;
      }
      us = (lo + hi) / 2;
    }
  }
  if (c.u === 0 || !Number.isFinite(us) || u < us) y = vm.solve(beyond(q) ? fold : q, from);
  else if (u < us + span) {
    const t = blend((u - us) / span);
    y = (1 - t) * vm.solve(fold, from) + t * vm.solve(q, (-from) as 1 | -1);
  } else y = vm.solve(q, (-from) as 1 | -1);
  const dy = c.delta("y", y);
  const axis = v3.unit(c.vec(i.axis ?? [0, 1, 0]));
  if (typeof i.shuttle === "string") c.setXf(i.shuttle, xf.trans(v3.mul(axis, dy)));
  let bend = 0;
  for (const b of (i.beams as { a: string; b: string; anchor: string; tip: string }[] | undefined) ?? []) {
    const A = c.jointAt(b.anchor);
    const T0 = c.jointAt(b.tip);
    const T = v3.add(T0, v3.mul(axis, dy));
    const n = c.jointAxis(b.anchor);
    const ang = (p: Vec3) => Math.atan2(v3.dot(n, v3.cross([1, 0, 0], v3.sub(p, A))), v3.dot([1, 0, 0], v3.sub(p, A)));
    let dphi = ang(T) - ang(T0);
    while (dphi > Math.PI) dphi -= TAU;
    while (dphi < -Math.PI) dphi += TAU;
    c.setXf(b.a, xf.rotAbout(A, n, dphi));
    c.setXf(b.b, xf.mul(xf.trans(v3.sub(T, T0)), xf.rotAbout(T0, n, dphi)));
    bend = dphi * R2D;
  }
  outVal(c, s, y, "y");
  outVal(c, s, bend, "bend");
}

/** A driver's value at cycle phase x by its own law (the oscillating and linear cosine law, lo at 0). */
function driveAt(c: BlockCtx, id: string, x: number): number {
  const d = c.driver(id);
  if (!d) return 0;
  const lo = d.lo ?? d.range?.[0] ?? 0;
  const hi = d.hi ?? d.range?.[1] ?? 0;
  return lo + (hi - lo) * (0.5 - 0.5 * Math.cos(x));
}

/**
 * reeve (a block and tackle). in: fall (the driver: the fall hauled, mm), D0 (pin spacing at no haul), DX (the lower pin's
 * offset across the load line, the fleet), slanted (parts at the fleet; the first part is vertical), block (the lower
 * block, body), axis (its rise), sheaves [{ body, center (joint or point), k }] (k the slanted parts the rope has run
 * before reaching the sheave: the turn is (rise + k · shortening) / RP), RP (rope pitch radius), turn axis (default +z).
 * out { rise }: the block's rise (mm).
 */
const reeveBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const r = reeve({ D0: c.num(i.D0), DX: c.num(i.DX), slanted: c.num(i.slanted ?? 3) });
  const h = c.num(i.fall);
  const D = r.spacing(h);
  const rise = c.num(i.D0) - D;
  const slant = r.slant(D);
  const dRise = c.delta("rise", rise);
  const dSlant = c.delta("slant", slant);
  const ax = v3.unit(c.vec(i.axis ?? [0, 1, 0]));
  if (typeof i.block === "string") c.setXf(i.block, xf.trans(v3.mul(ax, dRise)));
  const n = v3.unit(c.vec(i.turnAxis ?? [0, 0, 1]));
  const RP = c.num(i.RP);
  for (const sh of (i.sheaves as { body: string; center: string; k: number; moving?: boolean }[] | undefined) ?? []) {
    const ang = (dRise + sh.k * dSlant) / RP;
    const ctr = c.refVec(sh.center);
    const turn = xf.rotAbout(ctr, n, ang);
    c.setXf(sh.body, sh.moving ? xf.mul(xf.trans(v3.mul(ax, dRise)), turn) : turn);
  }
  outVal(c, s, rise, "rise");
};

/**
 * variator (a belt CVT). in: r1 (wheel 1's pitch radius, the ratio setting), built (the r1 the solids are built at), C,
 * length (the belt's pitch length), alpha (sheave half-angle, deg), rmin (pitch radius at a sheave's open stop), input
 * (wheel 1's angle, deg); wheels [{ fixed, movable, joint (the shaft's revolute), slide (the movable half's prismatic
 * joint, its axis the closing direction) }, same for wheel 2]; shifter (optional: a body that carries wheel 1's shift).
 * Wheel 2's radius keeps the belt's length; each movable half sits closed by its shift from the open stop; wheel 2 turns
 * r1/r2 times wheel 1; the belt advances r1 per radian. out { r1, r2, shift1, shift2, angle, travel, offset }: offset is the
 * belt plane's move along wheel 1's axis from where it is built (half of each sheave's move, averaged).
 */
const variatorBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const C = c.num(i.C);
  const L = c.num(i.length);
  const al = c.rad(i.alpha);
  const rmin = c.num(i.rmin);
  const r1 = c.num(i.r1);
  const r2 = variatorR2(r1, C, L);
  const rb1 = c.num(i.built ?? i.r1);
  const rb2 = variatorR2(rb1, C, L);
  const sh = [sheaveShift(r1, rmin, al), sheaveShift(r2, rmin, al)];
  const d = [sheaveShift(r1, rmin, al) - sheaveShift(rb1, rmin, al), sheaveShift(r2, rmin, al) - sheaveShift(rb2, rmin, al)];
  const dA = c.delta("in", c.rad(i.input));
  const turns = [dA, (r1 / r2) * dA];
  const wheels = (i.wheels as { fixed: string; movable: string; joint: string; slide: string }[] | undefined) ?? [];
  const ax0 = wheels[0] ? c.jointAxis(wheels[0].joint) : ([0, 0, 1] as Vec3);
  let off = 0;
  wheels.forEach((w, k) => {
    const at = c.jointAt(w.joint);
    const ax = c.jointAxis(w.joint);
    const R = xf.rotAbout(at, ax, turns[k]!);
    c.setXf(w.fixed, R);
    const close = c.jointAxis(w.slide);
    c.setXf(w.movable, xf.mul(xf.trans(v3.mul(close, d[k]!)), R));
    off += (d[k]! / 2) * v3.dot(close, ax0);
  });
  if (typeof i.shifter === "string" && wheels[0]) c.setXf(i.shifter, xf.trans(v3.mul(c.jointAxis(wheels[0].slide), d[0]!)));
  outVal(c, s, r1, "r1");
  outVal(c, s, r2, "r2");
  outVal(c, s, sh[0]!, "shift1");
  outVal(c, s, sh[1]!, "shift2");
  outVal(c, s, turns[1]! * R2D, "angle");
  outVal(c, s, r1 * dA, "travel");
  outVal(c, s, off / 2, "offset");
};

/**
 * integrator (a ball-and-disc integrator). in: disc and x (drivers: the disc's angle, deg, and the ball's radius on it, mm,
 * the carriage's travel), rc (the output cylinder's radius), rb (the ball's), ball (body) and centre (the joint at its
 * centre, on the carriage), spinAxis (the ball's spin axis: the carriage's travel), cylinder (body) and cylJoint (its
 * ground revolute). The ball rolls on the disc at radius x and drives the cylinder: θc = (1/rc) ∫ x dθd over the
 * drivers' laws from the reference to this phase, so it holds for any setting of either.
 * out { angle, spin }: the cylinder's and the ball's turns (deg).
 */
/**
 * ∫ x dθd from the reference to phase u (θd in radians): in closed form for a rotary disc and a carriage held or on its
 * cosine law (each checked against the drivers' values), else by Simpson's rule.
 */
function integral(c: BlockCtx, dId: string, xId: string, u: number): number {
  const dd = c.driver(dId);
  const dx = c.driver(xId);
  const a = (c.driverAt(dId, 1) - c.driverAt(dId, 0)) * D2R;
  const x0 = c.driverAt(xId, 0.3);
  const x1 = c.driverAt(xId, 1.1);
  if (dd?.kind === "rotary" && dx && Math.abs(c.driverAt(dId, 2) - c.driverAt(dId, 0) - 2 * (a / D2R)) < 1e-9) {
    if (Math.abs(x1 - x0) < 1e-12 && Math.abs(c.driverAt(xId, 2.7) - x0) < 1e-12) return a * x0 * u;
    if (dx.kind === "linear" || dx.kind === "oscillating") {
      const lo = dx.lo ?? dx.range?.[0] ?? 0;
      const hi = dx.hi ?? dx.range?.[1] ?? 0;
      const sp = dx.speed ?? 1;
      const ph = (dx.phase ?? 0) * D2R;
      const m = (lo + hi) / 2;
      const A = (hi - lo) / 2;
      const law = (v: number) => m - A * Math.cos(sp * v + ph);
      if (Math.abs(law(0.3) - x0) < 1e-9 && Math.abs(law(1.1) - x1) < 1e-9) return a * (m * u - (A / sp) * (Math.sin(sp * u + ph) - Math.sin(ph)));
    }
  }
  const n = 2 * Math.max(1, Math.ceil((Math.abs(u) / TAU) * 200));
  const h = u / n;
  const th = (v: number) => c.driverAt(dId, v) * D2R;
  const f = (v: number) => c.driverAt(xId, v) * ((th(v + 1e-5) - th(v - 1e-5)) / 2e-5);
  let sum = f(0) + f(u);
  for (let k = 1; k < n; k++) sum += (k % 2 ? 4 : 2) * f(k * h);
  return (sum * h) / 3;
}

const integratorBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const dId = str(i.disc, "integrator.disc");
  const xId = str(i.x, "integrator.x");
  const rc = c.num(i.rc);
  const rb = c.num(i.rb);
  const u = c.u;
  const theta = u === 0 ? 0 : integral(c, dId, xId, u) / rc;
  const dTheta = c.delta("theta", theta);
  const phi = (dTheta * rc) / rb;
  const cj = str(i.cylJoint, "integrator.cylJoint");
  if (typeof i.cylinder === "string") c.setXf(i.cylinder, xf.rotAbout(c.jointAt(cj), c.jointAxis(cj), dTheta));
  if (typeof i.ball === "string" && typeof i.centre === "string") {
    const ref = c.refVec(i.centre);
    const now = c.vec(i.centre);
    c.setXf(i.ball, xf.mul(xf.trans(v3.sub(now, ref)), xf.rotAbout(ref, v3.unit(c.vec(i.spinAxis ?? [0, 1, 0])), phi)));
  }
  outVal(c, s, dTheta * R2D, "angle");
  outVal(c, s, phi * R2D, "spin");
};

/**
 * rocker: a rocker held against a translating follower's end by a round nose, its pivot level with the nose at the
 * reference, so the nose drops exactly the follower's travel: ψ = sense · asin(s / arm). in: value (the travel s, mm, a
 * value name), v (ds/dθ of the driving cam, mm per radian, a value name), joint (the rocker's ground revolute), body (the
 * rocker; default the joint's b), arm (pivot to nose, mm), sense (+1 or −1 about the joint's axis), shoe (a point on the
 * rocker riding a cam lobe) and cam (the cam's ground revolute), for the pressure angle at the shoe: the angle between
 * the shoe's path in the cam's frame and the arm square to its motion. out {angle, pressure} (deg).
 */
const rockerBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "rocker.joint");
  const sOf = c.num(i.value);
  const b = c.num(i.arm);
  const sense = i.sense !== undefined ? c.num(i.sense) : 1;
  if (Math.abs(sOf) > b) throw new KinError(`rocker ${s.id}: travel ${sOf.toFixed(2)} beyond the arm ${b}`);
  const psi = sense * Math.asin(sOf / b);
  const body = (i.body as string | undefined) ?? c.joint(jid).b;
  const ax = c.jointAxis(jid);
  const Q = c.jointAt(jid);
  const X = xf.rotAbout(Q, ax, psi - sense * Math.asin(c.num(i.ref ?? 0) / b));
  c.setXf(body, X);
  outVal(c, s, psi * R2D, "angle");
  if (typeof i.shoe === "string" && typeof i.cam === "string" && i.v !== undefined) {
    // the shoe's path relative to the cam turning about +a: T = ψ'·a×(P−Q) − a×(P−O), ψ' = sense·v / (arm cos ψ)
    const P = xf.apply(X, c.refPt(i.shoe));
    const O = c.jointAt(i.cam);
    const a = c.jointAxis(i.cam);
    const dpsi = (sense * c.num(i.v)) / (b * Math.cos(psi));
    const T = v3.sub(v3.mul(v3.cross(ax, v3.sub(P, Q)), dpsi * v3.dot(ax, a)), v3.cross(a, v3.sub(P, O)));
    const r = v3.sub(P, Q);
    const cos = Math.abs(v3.dot(T, r)) / (v3.len(T) * v3.len(r) || 1);
    outVal(c, s, Math.acos(Math.min(1, cos)) * R2D, "pressure");
  }
};

const starCache = new Map<string, ReturnType<typeof simulateStar>>();

/**
 * star (a star wheel driven by a finger, held and snapped by a jumper): in: input (the driver's angle, deg), driver (its
 * ground joint), star and jumper (bodies), starJoint and jumperJoint (their ground revolutes), n, tip, root, tip0 (deg,
 * a tip's angle at rest), rf (finger radius), pin (its contact radius), finger0 (deg, the finger's angle at rest), arm,
 * roller, swing ([deg, deg] the arm's range about its pivot), snap (deg of driver). The star turns clockwise (seen from
 * +z) by ψ; the jumper rides it. out {star, push, jumper}: ψ (deg), the finger's push alone (deg), the jumper's turn (deg,
 * counter-clockwise).
 */
const starBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const O = c.jointAt(str(i.driver, "star.driver"));
  const sj = str(i.starJoint, "star.starJoint");
  const jj = str(i.jumperJoint, "star.jumperJoint");
  const C = c.jointAt(sj);
  const J = c.jointAt(jj);
  const spec: StarSpec = {
    n: c.num(i.n), tip: c.num(i.tip), root: c.num(i.root), tip0: c.num(i.tip0),
    c: [C[0] - O[0], C[1] - O[1]], rf: c.num(i.rf), pin: c.num(i.pin), finger0: c.num(i.finger0),
    jumper: [J[0] - O[0], J[1] - O[1]], swing: (i.swing as number[]).map((v) => c.num(v)) as [number, number],
    arm: c.num(i.arm), roller: c.num(i.roller), snap: c.num(i.snap),
  };
  const key = JSON.stringify(spec);
  let sim = starCache.get(key);
  if (!sim) {
    sim = simulateStar(spec);
    starCache.set(key, sim);
  }
  const th = c.delta("in", c.num(i.input));
  const x = ((((th % 360) + 360) % 360) / sim.step);
  const k = Math.min(sim.star.length - 2, Math.floor(x));
  const f = x - k;
  const lerp = (t: Float64Array) => t[k]! + (t[k + 1]! - t[k]!) * f;
  const turns = Math.floor(th / 360);
  const pitch = 360 / spec.n;
  const psi = lerp(sim.star) + turns * pitch;
  const jum = lerp(sim.jumper);
  spin(c, str(i.star, "star.star"), C, [0, 0, 1], -psi * D2R);
  spin(c, str(i.jumper, "star.jumper"), J, [0, 0, 1], jum * D2R);
  outVal(c, s, psi, "star");
  outVal(c, s, lerp(sim.push), "push");
  outVal(c, s, jum, "jumper");
};

/**
 * ratchet (a lever ratchet with a driving pawl on the lever and a holding pawl on the ground): in: input (the lever's
 * angle, deg, an oscillating driver from `lo`), lo, lost (deg of lost motion before the pawl meets a face), wheel (body),
 * wheelJoint, the sawtooth (n, root, tip, face, back, tip0: see blocks/timed sawOutline), pawls ([{ body, joint (its
 * pivot), tip (a point at its tip at rest), carrier (the body its pivot rides, "ground" or the lever), carrierJoint,
 * swing (deg either side of its line at rest) }]). The wheel steps one pitch per forward stroke; each pawl rides the teeth
 * where its spring holds it. out {wheel}: the wheel's turn (deg).
 */
const ratchetBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const spec: RatchetSpec = { n: c.num(i.n), root: c.num(i.root), tip: c.num(i.tip), face: c.num(i.face), back: c.num(i.back), tip0: c.num(i.tip0) };
  const W = c.jointAt(str(i.wheelJoint, "ratchet.wheelJoint"));
  const lever = c.num(i.input);
  const lo = c.num(i.lo);
  const pitch = 360 / spec.n;
  // the driver's own phase (deg): the cycle may start part way through the stroke
  const ph = c.num(i.phase ?? 0) * D2R;
  const turn = (u: number, lv: number) => ratchetWheel(u + ph, lv, lo, c.num(i.lost), pitch) - ratchetWheel(ph, lo, lo, c.num(i.lost), pitch);
  const w = c.delta("wheel", turn(c.u, lever) * D2R);
  spin(c, str(i.wheel, "ratchet.wheel"), W, [0, 0, 1], w);
  outVal(c, s, w * R2D, "wheel");
  const local = (p: Vec3): [number, number] => [p[0] - W[0], p[1] - W[1]];
  for (const pw of (i.pawls as Record<string, unknown>[] | undefined) ?? []) {
    const body = str(pw.body, "ratchet.pawls.body");
    const jp = str(pw.joint, "ratchet.pawls.joint");
    const P0 = c.jointAt(jp);
    const T0 = c.refPt(str(pw.tip, "ratchet.pawls.tip"));
    const arm = Math.hypot(T0[0] - P0[0], T0[1] - P0[1]);
    const line0 = Math.atan2(T0[1] - P0[1], T0[0] - P0[0]);
    const carrier = (pw.carrier as string | undefined) ?? "ground";
    const Xc = carrier === "ground" ? xf.id() : c.xf(carrier);
    const P = xf.apply(Xc, P0);
    const cTurn = carrier === "ground" ? 0 : xf.angleAbout(Xc, [0, 0, 1]);
    const sw = c.num(pw.swing ?? 25);
    const ride = (ww: number, pv: [number, number], base: number) => rideAngle(sawOutline(spec, ww), pv, arm, 0, [(base - sw * D2R) * R2D, (base + sw * D2R) * R2D], [0, 0]);
    const a = ride(w, local(P), line0 + cTurn);
    // the record's tip point is where the tip rests at the reference, so the reference pose is the identity
    c.setXf(body, xf.mul(xf.rotAbout(P, [0, 0, 1], a - line0 - cTurn), Xc));
  }
};

/**
 * one-way (a freewheel, a sprag clutch): the output follows the input 1:1 while the input turns forward and stays while
 * it turns back, so an oscillating input steps it. in: input (an oscillating driver, deg, from `lo`; its cycle runs
 * forward for the first half), lo, stroke (its travel, deg), phase (the driver's, deg), output (body), joint (its ground revolute), carried
 * (bodies that turn with the output: a sprag set), thrust ([a, b]: two points whose line, against the radius at a,
 * gives the grip angle). out {angle, grip}: the output's turn and the grip angle (deg).
 */
const oneWay: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const lo = c.num(i.lo ?? 0);
  const ph = c.num(i.phase ?? 0) * D2R;
  const lv = c.num(i.input);
  // the forward half follows the input; the return holds; `stroke` (deg) is the input's travel per half cycle
  const span = (u: number, v: number) => {
    const turns = Math.floor((u + ph) / TAU);
    const w = u + ph - turns * TAU;
    return w < Math.PI ? turns * c.num(i.stroke ?? 0) + (v - lo) : (turns + 1) * c.num(i.stroke ?? 0);
  };
  const d = c.delta("out", span(c.u, lv) * D2R);
  const jid = str(i.joint, "one-way.joint");
  const O = c.jointAt(jid);
  const ax = c.jointAxis(jid);
  for (const b of [str(i.output, "one-way.output"), ...((i.carried as string[] | undefined) ?? [])]) spin(c, b, O, ax, d);
  outVal(c, s, d * R2D, "angle");
  const th = i.thrust as string[] | undefined;
  if (th && th.length === 2) {
    const X = c.xf(str(i.output, "one-way.output"));
    const a = xf.apply(X, c.refPt(th[0]!));
    const b = xf.apply(X, c.refPt(th[1]!));
    // in the plane square to the axis
    const t = v3.perp(v3.sub(b, a), ax);
    const r = v3.perp(v3.sub(a, O), ax);
    outVal(c, s, Math.acos(Math.min(1, Math.abs(v3.dot(t, r)) / (v3.len(t) * v3.len(r)))) * R2D, "grip");
  }
};

const escapeCache = new Map<string, ReturnType<typeof simulateEscape>>();

/**
 * escape (a geometric escapement in a plane: anchor, lever): the pallets swing with the oscillating driver of their arbor
 * (`lo` to `hi` deg over the cycle, `default` at the reference); the escape wheel, urged forward by its train, goes on
 * until a tooth meets a pallet and is pushed back where a pallet moves into a tooth (blocks/timed simulateEscape).
 * in: input (the pallets' angle, deg), lo, hi, default, wheel (body), wheelJoint, palletJoint, plane ("xz" or "xy": the
 * escapement's plane, its 2D axes), sense (+1: the wheel goes forward counter-clockwise in the plane), the wheel's teeth
 * (n, tip, root, lead and back: the tip's two roots, deg from the tip, positive ahead), tip0 (deg), pallets (outlines,
 * [u, v] in the plane relative to the arbor at the reference); `fork` (a balance driving a lever: see below) with
 * `pallets_body` (the lever) and `rate` (a speed limit on the wheel). out {advance, recoil, pallet}: the wheel's turn
 * since the cycle's start, the recoil of the current beat, the lever's angle (deg).
 */
const escapeBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const E = c.jointAt(str(i.wheelJoint, "escape.wheelJoint"));
  const Aj = str(i.palletJoint, "escape.palletJoint");
  const A = c.jointAt(Aj);
  const plane = (i.plane as string | undefined) ?? "xy";
  const P2 = (p: Vec3): [number, number] => (plane === "xz" ? [p[0], p[2]] : [p[0], p[1]]);
  const n = c.num(i.n);
  const D = Math.PI / 180;
  const tip0 = c.num(i.tip0 ?? 0);
  const wc = P2(E);
  const wheel: [number, number][] = [];
  // a tooth: the record's polygon (in the wheel's plane, its tip at angle 0), else a pointed tip with its two roots
  const tooth = i.tooth as number[][] | undefined;
  for (let k = 0; k < n; k++) {
    const a = (tip0 + (360 / n) * k) * D;
    if (tooth) {
      for (const q of tooth) wheel.push([wc[0] + q[0]! * Math.cos(a) - q[1]! * Math.sin(a), wc[1] + q[0]! * Math.sin(a) + q[1]! * Math.cos(a)]);
      continue;
    }
    for (const [r, b] of [[c.num(i.root), a + c.num(i.lead) * D], [c.num(i.tip), a], [c.num(i.root), a + c.num(i.back) * D]] as const) wheel.push([wc[0] + r * Math.cos(b), wc[1] + r * Math.sin(b)]);
  }
  const ac = P2(A);
  const pallets = ((i.pallets as number[][][] | undefined) ?? []).map((pl) => pl.map((q): [number, number] => [ac[0] + q[0]!, ac[1] + q[1]!]));
  const lo = c.num(i.lo);
  const hi = c.num(i.hi);
  const def = c.num(i.default ?? 0);
  const sense = (c.num(i.sense ?? 1) >= 0 ? 1 : -1) as 1 | -1;
  const spec = { wheel, wc, pallets, ac, n, sense };
  // the pallets' angle (rad, from the reference) at cycle phase u: the driver's own swing, or, with a `fork` (a lever's
  // fork on a balance's impulse pin: { joint (the balance's), roller, reach (lever pivot to fork), window (deg) }), the
  // lever following the pin while the balance is within the window and resting on its banking outside it
  const fork = i.fork as Record<string, unknown> | undefined;
  const swing = (u: number) => (lo + (hi - lo) * (0.5 - 0.5 * Math.cos(u)) - def) * D;
  let palletAt = swing;
  if (fork) {
    const rr = c.num(fork.roller);
    const reach = c.num(fork.reach);
    const win = c.num(fork.window) * D;
    const follow = (t: number) => Math.atan2(-rr * Math.sin(t), reach + rr - rr * Math.cos(t));
    const bank = Math.abs(follow(win));
    palletAt = (u) => {
      const t = swing(u);
      return Math.abs(t) < win ? follow(t) : -Math.sign(t) * bank;
    };
  }
  const rate = i.rate !== undefined ? c.num(i.rate) : Infinity;
  const key = JSON.stringify([spec, lo, hi, def, fork ?? null, rate]);
  let sim = escapeCache.get(key);
  if (!sim) {
    sim = simulateEscape(spec, palletAt, 1440, rate);
    escapeCache.set(key, sim);
  }
  const N = sim.wheel.length - 1;
  // the reference (every driver at its default) is where the swing first passes the default
  const input = c.num(i.input);
  const uRef = Math.acos(Math.max(-1, Math.min(1, (lo + hi - 2 * def) / (hi - lo))));
  const u = c.u === 0 && Math.abs(input - def) < 1e-12 && Math.abs(def - lo) > 1e-12 ? uRef : c.u;
  const turns = Math.floor(u / TAU);
  const f = ((u - turns * TAU) / TAU) * N;
  const k = Math.min(N - 1, Math.floor(f));
  const t = f - k;
  const w = sim.wheel[k]! + (sim.wheel[k + 1]! - sim.wheel[k]!) * t + turns * sim.advance;
  const d = c.delta("wheel", w);
  // the wheel's axis: its plane's normal, the sense of the 2D turn (xz: about −y; xy: about +z)
  spin(c, str(i.wheel, "escape.wheel"), E, plane === "xz" ? [0, -1, 0] : [0, 0, 1], sense * d);
  if (fork && typeof i.pallets_body === "string") {
    // the lever, moved by the fork (its arbor is not driven)
    spin(c, i.pallets_body, A, plane === "xz" ? [0, -1, 0] : [0, 0, 1], palletAt(u) - palletAt(uRef));
    outVal(c, s, palletAt(u) * R2D, "pallet");
  }
  outVal(c, s, (w - sim.wheel[0]!) * R2D, "advance");
  outVal(c, s, sim.recoil[k]! * R2D, "recoil");
  outVal(c, s, w * R2D, "phase");
};

const vergeCache = new Map<string, ReturnType<typeof simulateVerge>>();

/**
 * verge (a crown wheel and a verge with two flag pallets): in: input (the foliot's angle, deg, an oscillating driver: lo,
 * hi, default), wheel (body), wheelJoint (its revolute, axis along y, the crown's rim face in the plane through it, the
 * teeth pointing toward −y), vergeJoint (the staff's, axis z), n, R, h, back (deg), upper and lower (the pallets'
 * directions at foliot 0, deg from +x about +z), from, to, width (the pallets' reach and width), sense. out {advance,
 * recoil} (deg).
 */
const vergeBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const C = c.jointAt(str(i.wheelJoint, "verge.wheelJoint"));
  const V = c.jointAt(str(i.vergeJoint, "verge.vergeJoint"));
  const D = Math.PI / 180;
  const sense = (c.num(i.sense ?? 1) >= 0 ? 1 : -1) as 1 | -1;
  const spec: VergeSpec = {
    n: c.num(i.n), R: c.num(i.R), h: c.num(i.h), back: c.num(i.back) * D,
    staff: [V[0] - C[0], V[1] - C[1]], upper: c.num(i.upper) * D, lower: c.num(i.lower) * D,
    from: c.num(i.from), to: c.num(i.to), width: c.num(i.width), sense,
  };
  const lo = c.num(i.lo);
  const hi = c.num(i.hi);
  const def = c.num(i.default ?? 0);
  const key = JSON.stringify([spec, lo, hi, def]);
  let sim = vergeCache.get(key);
  if (!sim) {
    sim = simulateVerge(spec, (u) => (lo + (hi - lo) * (0.5 - 0.5 * Math.cos(u)) - def) * D);
    vergeCache.set(key, sim);
  }
  const N = sim.wheel.length - 1;
  const input = c.num(i.input);
  const uRef = Math.acos(Math.max(-1, Math.min(1, (lo + hi - 2 * def) / (hi - lo))));
  const u = c.u === 0 && Math.abs(input - def) < 1e-12 && Math.abs(def - lo) > 1e-12 ? uRef : c.u;
  const turns = Math.floor(u / TAU);
  const f = ((u - turns * TAU) / TAU) * N;
  const k = Math.min(N - 1, Math.floor(f));
  const w = sim.wheel[k]! + (sim.wheel[k + 1]! - sim.wheel[k]!) * (f - k) + turns * sim.advance;
  // the crown turns about +y: its top teeth move toward +x for a positive turn
  spin(c, str(i.wheel, "verge.wheel"), C, [0, 1, 0], sense * c.delta("wheel", w));
  outVal(c, s, (w - sim.wheel[0]!) * R2D, "advance");
  outVal(c, s, sim.recoil[k]! * R2D, "recoil");
  // the wheel's absolute angle in the simulation (the drawn wheel's teeth stand at its value at the reference)
  outVal(c, s, w * R2D, "phase");
};

const escapementCache = new Map<string, ReturnType<typeof simulateEscapement>>();

/**
 * escapement. in: kind ("anchor" | "lever" | "verge"), z (wheel teeth), amplitude (deg), lock (0..1), drop (0..1),
 * recoil (0..1), wheel and pallet (bodies), wheelCenter and palletCenter (points), wheelAxis, palletAxis.
 * The oscillator is the cycle phase itself, θ = A sin u. out {wheel, pallet}: angles (deg).
 */
const escapementBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const spec: EscapementSpec = {
    kind: ((i.kind as string | undefined) ?? "anchor") as EscapementSpec["kind"],
    z: c.num(i.z),
    amplitude: c.num(i.amplitude) * D2R,
    lock: c.num(i.lock ?? 0.5),
    drop: c.num(i.drop ?? 0.1),
    recoil: c.num(i.recoil ?? 0),
  };
  const key = JSON.stringify(spec);
  let sim = escapementCache.get(key);
  if (!sim) {
    sim = simulateEscapement(spec);
    escapementCache.set(key, sim);
  }
  const now = sim.at(c.u);
  const ref = sim.at(0);
  if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.wheelCenter), v3.unit(c.vec(i.wheelAxis ?? [0, 0, 1])), now.wheel - ref.wheel);
  if (typeof i.pallet === "string") spin(c, i.pallet, c.vec(i.palletCenter), v3.unit(c.vec(i.palletAxis ?? [0, 0, 1])), now.pallet - ref.pallet);
  outVal(c, s, (now.wheel - ref.wheel) * R2D, "wheel");
  outVal(c, s, (now.pallet - ref.pallet) * R2D, "pallet");
};

/**
 * indexer (Geneva and star wheel). in: n (slots or teeth), input (the crank angle, deg, measured from the line of
 * centres with the pin nearest the wheel at 0; for an internal Geneva, `internal: true`, farthest from it), phi0 (its
 * reference value), wheel (body), center, axis, sense (+1 or −1; default −1 for an external Geneva, which turns against
 * its crank, +1 for an internal one). `mode: "mutilated"`: a mutilated gear pair, `window` (deg of driver, centred on
 * φ = 0) and `ratio` (driven per driver while in mesh, default −1).
 * out {angle}: the wheel's angle (deg).
 */
const indexer: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const n = i.mode === "mutilated" || i.mode === "cam" ? 0 : c.num(i.n);
  const phi0 = c.num(i.phi0 ?? 0) * D2R;
  const phi = phi0 + c.delta("in", c.rad(i.input));
  // an external Geneva turns against its crank, an internal one with it
  if (i.mode === "cam") {
    // a cam indexer (a roller-gear or barrel indexer): the output steps `step` deg by the law over `index` deg of input
    // (from φ = 0 each turn) and dwells the rest
    const step = c.num(i.step) * D2R;
    const idx = c.num(i.index) * D2R;
    const law = lawOf(i.law as string | undefined);
    const at = (p: number) => {
      const turns = Math.floor(p / TAU);
      const local = p - turns * TAU;
      return step * (turns + lawRise(law, Math.min(1, local / idx)).s);
    };
    const dm = (c.num(i.sense ?? 1) >= 0 ? 1 : -1) * (at(phi) - at(phi0));
    if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.center), v3.unit(c.vec(i.axis ?? [0, 0, 1])), dm);
    outVal(c, s, dm * R2D, "angle");
    return;
  }
  if (i.mode === "mutilated") {
    // a mutilated gear: the driven gear turns at `ratio` while the driver's toothed `window` (deg, centred on φ = 0)
    // passes the mesh, and is held by the locking rim for the rest of the turn
    const w = c.num(i.window) * D2R;
    const ratio = c.num(i.ratio ?? -1);
    const law = (p: number) => {
      const turns = Math.round(p / TAU);
      const local = p - turns * TAU;
      return ratio * (Math.max(-w / 2, Math.min(w / 2, local)) + turns * w);
    };
    const dm = law(phi) - law(phi0);
    if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.center), v3.unit(c.vec(i.axis ?? [0, 0, 1])), dm);
    outVal(c, s, dm * R2D, "angle");
    return;
  }
  const internal = i.internal === true;
  const sense = i.sense !== undefined ? c.num(i.sense) : internal ? 1 : -1;
  const law = internal ? genevaInternalAngle : genevaAngle;
  const d = sense * (law(n, phi) - law(n, phi0));
  if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.center), v3.unit(c.vec(i.axis ?? [0, 0, 1])), d);
  outVal(c, s, d * R2D, "angle");
};

/**
 * follow. in: body (the follower), joint (its revolute to the ground), of (a body solved before it). The follower turns
 * about its joint exactly as `of` turns (a cycloidal drive's output flange with its disc, whose pins in oversized holes
 * make a parallelogram at every pin). out: the angle turned (deg).
 */
const follow: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "follow.joint");
  const of = str(i.of, "follow.of");
  const axis = c.jointAxis(jid);
  const a = xf.angleAbout(c.xf(of), axis);
  spin(c, str(i.body, "follow.body"), c.jointAt(jid), axis, a);
  outVal(c, s, a * R2D, "angle");
};

/**
 * wave. A flexspline bent into an oval by its wave generator, as z rigid segments (one tooth and its piece of rim each,
 * built undeformed at angle 2πk/z). in: input (the wave generator's angle, deg), turn (the flexspline's turn, deg, from
 * its mesh), segments [bodies, k = 0..z-1], r (pitch radius at rest), w0 (radial bend at the long axis), center, axis,
 * longAxis (its angle at the reference, deg). The segments are built bent as at the reference (flexTooth with w0).
 * Segment k's material angle is 2πk/z + turn; it moves out by w = w0 cos 2(φ - input), along its radius, and tilts with
 * the oval's slope. out: the bend at segment 0 (mm).
 */
const wave: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const segs = (i.segments as string[] | undefined) ?? [];
  const z = segs.length;
  const r = c.num(i.r);
  const w0 = c.num(i.w0);
  const th = c.rad(i.input);
  const psi = c.rad(i.turn);
  const o = c.vec(i.center ?? [0, 0, 0]);
  const axis = v3.unit(c.vec(i.axis ?? [0, 0, 1]));
  const ex: Vec3 = Math.abs(axis[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const e1 = v3.unit(v3.sub(ex, v3.mul(axis, v3.dot(ex, axis))));
  const e2 = v3.cross(axis, e1);
  const at = (rad: number, a: number): Vec3 => v3.add(o, v3.add(v3.mul(e1, rad * Math.cos(a)), v3.mul(e2, rad * Math.sin(a))));
  // the input and the turn are measured from the reference, where the long axis lies at angle th0 (deg, default 0)
  const th0 = c.num(i.longAxis ?? 0) * D2R;
  const pose = (k: number, thA: number, psiA: number): Xf => {
    const pk = (k * 2 * Math.PI) / z;
    // an inextensible rim slides along itself as it bends: v = -(w0/2) sin 2(φ - th), so the teeth keep their pitch
    const phi0 = pk + psiA;
    const phi = phi0 - (w0 / 2) * Math.sin(2 * (phi0 - thA)) / r;
    const w = w0 * Math.cos(2 * (phi0 - thA));
    // the oval's slope dr/dφ: its tangent leans from the circle's by -atan(r'/r)
    const slope = -2 * w0 * Math.sin(2 * (phi0 - thA));
    const rho = psiA - Math.atan2(slope, r + w);
    // the segment turned by rho about the centre, then its pitch point carried out to the bent radius
    const turned = xf.rotAbout(o, axis, rho);
    const from = xf.apply(turned, at(r, pk));
    return xf.mul(xf.trans(v3.sub(at(r + w, phi), from)), turned);
  };
  let bend0 = 0;
  const dth = c.delta("in", th);
  const dpsi = c.delta("turn", psi);
  segs.forEach((b, k) => {
    // the segments are built bent as at the reference: their pose is from there
    c.setXf(b, xf.mul(pose(k, th0 + dth, dpsi), xf.inv(pose(k, th0, 0))));
    if (k === 0) bend0 = w0 * Math.cos(2 * (dpsi - dth));
  });
  outVal(c, s, bend0, "bend");
};

/**
 * bevel-diff. A bevel differential's spider train on its case. in: case (body, posed before), difference (the left side
 * gear's turn relative to the case, deg), sides { left: [body, joint], right: [body, joint] } (their revolutes to the case),
 * spiders [{ body, joint }] (on the cross-pin), zs, zp (side and spider teeth). The left side gear turns +difference
 * relative to the case, the right one -difference, and each spider spins on its pin by difference zs / zp about its own
 * joint's axis. out { left, right, spin }: the side gears' and a spider's turns relative to the case (deg).
 */
const bevelDiff: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const C = c.xf(str(i.case, "bevel-diff.case"));
  const d = c.delta("diff", c.rad(i.difference));
  const sides = (i.sides ?? {}) as Record<string, [string, string]>;
  const put = (pair: [string, string] | undefined, a: number) => {
    if (!pair) return;
    c.setXf(pair[0], xf.mul(C, xf.rotAbout(c.refVec(pair[1]), c.jointAxis(pair[1]), a)));
  };
  put(sides.left, d);
  put(sides.right, -d);
  const spin = (d * c.num(i.zs)) / c.num(i.zp);
  for (const sp of (i.spiders as { body: string; joint: string }[] | undefined) ?? []) c.setXf(sp.body, xf.mul(C, xf.rotAbout(c.refVec(sp.joint), c.jointAxis(sp.joint), spin)));
  outVal(c, s, d * R2D, "left");
  outVal(c, s, -d * R2D, "right");
  outVal(c, s, spin * R2D, "spin");
};

/**
 * lerp. in: a, b (points), t (a number): out = a + t (b − a), a point on the line through two others (a scissor bar's
 * far pin, 2 M − R, from its near pin and its middle pin).
 */
const lerp: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const a = c.vec(i.a);
  outPoint(c, s, v3.add(a, v3.mul(v3.sub(c.vec(i.b), a), c.num(i.t))));
};

/**
 * line-crossing. in: a1, a2 (two points of one line), b1, b2 (of the other), n (plane normal, default +z), sum
 * (optional). out: where the lines cross in that plane (the crossing of an antiparallelogram's bars, an instant
 * centre). Where the lines run together (an antiparallelogram's change points) the crossing is the limit: the point
 * on the line a1→a2 whose distances to a1 and b1 add up to `sum` (the ellipse with foci a1 and b1); without `sum`
 * parallel lines do not cross and the block fails there.
 */
const lineCrossing: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const n = v3.unit(i.n ? c.vec(i.n) : [0, 0, 1]);
  const p = c.vec(i.a1);
  const d = v3.perp(v3.sub(c.vec(i.a2), p), n);
  const q = c.vec(i.b1);
  const e = v3.perp(v3.sub(c.vec(i.b2), q), n);
  const den = v3.dot(v3.cross(d, e), n);
  if (Math.abs(den) > 1e-6 * v3.len(d) * v3.len(e)) {
    const t = v3.dot(v3.cross(v3.sub(q, p), e), n) / den;
    outPoint(c, s, v3.add(p, v3.mul(d, t)));
    return;
  }
  if (i.sum === undefined) throw new KinError(`line-crossing ${s.id}: the lines are parallel`);
  // on the ray p + rho u: rho + |p + rho u - q| = L gives rho = (L^2 - |q - p|^2) / (2 (L - u.(q - p)))
  const L = c.num(i.sum);
  const u = v3.unit(d);
  const w = v3.perp(v3.sub(q, p), n);
  const rho = (L * L - v3.dot(w, w)) / (2 * (L - v3.dot(u, w)));
  outPoint(c, s, v3.add(p, v3.mul(u, rho)));
};

/**
 * target-path. A point that goes once round a closed curve per cycle, from the cycle phase itself: the target a tip or a
 * stylus follows, the linkage closing on it by inverse kinematics. in.shape "rounded-square": cx, cy (centre), side,
 * corner (radius), at constant speed along the outline, counter-clockwise from the middle of the right side; "flower":
 * cx, cy, r0, lobe, lobes (default 5): r = r0 + lobe cos(lobes u) at the polar angle u. n (plane normal) is +z.
 */
const targetPath: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const cx = c.num(i.cx), cy = c.num(i.cy);
  const u = ((c.u % TAU) + TAU) % TAU;
  if (i.shape === "flower") {
    const r = c.num(i.r0) + c.num(i.lobe) * Math.cos(c.num(i.lobes ?? 5) * u);
    outPoint(c, s, [cx + r * Math.cos(u), cy + r * Math.sin(u), 0]);
    return;
  }
  if (i.shape !== "rounded-square") throw new KinError(`target-path ${s.id}: unknown shape ${String(i.shape)}`);
  outPoint(c, s, roundedSquareAt(cx, cy, c.num(i.side), c.num(i.corner), u / TAU));
};

/** A point at the fraction f of the way round a rounded square, counter-clockwise from the middle of its right side. */
export function roundedSquareAt(cx: number, cy: number, side: number, corner: number, f: number): Vec3 {
  const h = side / 2;
  const st = side - 2 * corner;
  const arc = (Math.PI / 2) * corner;
  const total = 4 * (st + arc);
  let L = ((((f % 1) + 1) % 1) * total + st / 2) % total; // from the bottom of the right side's straight run
  // four sides in turn: right (up), top (left), left (down), bottom (right); each a straight run then a corner
  const dirs: [number, number][] = [[0, 1], [-1, 0], [0, -1], [1, 0]];
  const starts: [number, number][] = [[h, -h + corner], [h - corner, h], [-h, h - corner], [-h + corner, -h]];
  for (let k = 0; k < 4; k++) {
    const [dx, dy] = dirs[k]!;
    const [sx, sy] = starts[k]!;
    if (L <= st) return [cx + sx + dx * L, cy + sy + dy * L, 0];
    L -= st;
    if (L <= arc || k === 3) {
      // the corner's centre is inward of the run's end; it turns a quarter, counter-clockwise
      const ex = sx + dx * st, ey = sy + dy * st;
      const ox = ex - dy * corner, oy = ey + dx * corner;
      const a0 = Math.atan2(ey - oy, ex - ox);
      const a = a0 + Math.min(L, arc) / corner;
      return [cx + ox + corner * Math.cos(a), cy + oy + corner * Math.sin(a), 0];
    }
    L -= arc;
  }
  return [cx + h, cy, 0];
}

void sideOf;
void angleFrom;

export const BLOCKS: Record<string, BlockFn> = {
  dyad,
  "slider-dyad": sliderDyad,
  "five-bar": fiveBar,
  hooke,
  homokinetic,
  bennett,
  sarrus,
  "gear-mesh": gearMesh,
  willis: willisBlock,
  ravigneaux: ravigneauxBlock,
  cam: camBlock,
  rocker: rockerBlock,
  star: starBlock,
  ratchet: ratchetBlock,
  "one-way": oneWay,
  escape: escapeBlock,
  verge: vergeBlock,
  screw: screwBlock,
  convey: conveyBlock,
  flexure: flexureBlock,
  reeve: reeveBlock,
  variator: variatorBlock,
  integrator: integratorBlock,
  escapement: escapementBlock,
  indexer,
  follow,
  wave,
  "bevel-diff": bevelDiff,
  ...COUPLING_BLOCKS,
  lerp,
  "line-crossing": lineCrossing,
  "target-path": targetPath,
};
