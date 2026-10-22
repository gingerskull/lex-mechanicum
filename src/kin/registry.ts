// The block registry: each `solve` step names one of these. A block reads named inputs through the context, calls the
// closed forms in ./blocks, and writes points, values and body poses. The exact `in` fields of each block are
// listed above it.
import { type BlockFn, type BlockCtx, KinError } from "./ctx";
import { type SolveStep } from "./types";
import { D2R, TAU, type Vec3, m3, v3, xf, R2D } from "./math";
import { dyadRPR, dyadRRP, dyadRRR, fiveBarFK, fiveBarIK } from "./blocks/linkage";
import { bennettB, bennettFrames, bisectorNormal, hookeAngle, sarrusPair } from "./blocks/spatial";
import { ellipticalAngle, meshRatio, willis } from "./blocks/gears";
import { type CamLaw, type CamSchedule, camMotion, pressureAngle } from "./blocks/cam";
import { chainAdvance, chainSpeed, chainTurn, differentialAdvance, flexureEnd, pathAt, pathLength, reeve, screwAdvance, sheaveShift, variatorR2, vonMises } from "./blocks/members";
import { genevaAngle, simulateEscapement, type EscapementSpec } from "./blocks/timed";

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
 * arms stay on both yokes' pins.
 */
function hookeCross(c: BlockCtx, s: SolveStep): void {
  const i = s.in ?? {};
  const J = (i.joints ?? {}) as Record<string, unknown>;
  const jIn = str(J.in, "hooke.joints.in");
  const jOut = str(J.out, "hooke.joints.out");
  const jA = str(J.a, "hooke.joints.a");
  const jB = str(J.b, "hooke.joints.b");
  const a1 = c.jointAxis(jIn);
  const a2 = c.jointAxis(jOut);
  const pinA = c.jointAxis(jA);
  const pinB = c.jointAxis(jB);
  const centre = c.jointAt(jA);
  const np = v3.unit(v3.cross(a1, a2));
  const p1 = v3.cross(np, a1);
  const beta = Math.acos(Math.max(-1, Math.min(1, v3.dot(a1, a2))));
  const psi0 = Math.atan2(v3.dot(pinA, np), v3.dot(pinA, p1));
  const d1 = c.delta("in", c.rad(i.input));
  const d2 = beta < 1e-9 ? d1 : hookeAngle(psi0 + d1, beta) - hookeAngle(psi0, beta);
  const bIn = c.joint(jIn);
  const bOut = c.joint(jOut);
  const shaftIn = bIn.a === "ground" ? bIn.b : bIn.a;
  const shaftOut = bOut.a === "ground" ? bOut.b : bOut.a;
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
 * gear-mesh. in: joint (a `gear-mesh` joint: za/zb or ratio, internal, crossed/sign, radiusA for a rack, ncg), input (a
 * value: body a's angle, deg), ref (b's angle in the reference configuration, default 0), parent (a body whose pose
 * carries b's centre, for a planet), shaft b's axis is joint.axis2 or joint.axis. out: b's angle (deg) or rack travel (mm).
 */
const gearMesh: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "gear-mesh.joint");
  const j = c.joint(jid);
  const dA = c.delta("in", c.rad(i.input));
  const axisB = j.axis2 ? v3.unit(c.vec(j.axis2)) : c.jointAxis(jid);
  let X: Xf;
  let dB = 0;
  if (j.radiusA !== undefined && j.radiusB === undefined && j.zb === undefined && j.ratio === undefined && !j.ncg) {
    // rack: b translates along axis2 by r Δθa
    const t = c.num(j.radiusA) * dA;
    X = xf.trans(v3.mul(axisB, t));
    outVal(c, s, t, "travel");
  } else {
    dB = gearDelta(c, j, dA);
    X = xf.rotAbout(c.vec(j.cb ?? j.at), axisB, dB);
  }
  const parent = i.parent as string | undefined;
  c.setXf(j.b, parent && c.has(parent) ? xf.mul(c.xf(parent), X) : X);
  outVal(c, s, dB * R2D + c.num(i.ref ?? 0), "angle");
};

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
 * bodies {sun, ring, carrier}, planets [{ body, center }]. out {sun, ring, carrier, planet}: the angles turned (deg).
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
  if (w.planet !== null) outVal(c, s, w.planet * R2D, "planet");
};

const lawOf = (l: string | undefined): CamLaw => (l === "harmonic" || l === "poly345" || l === "uniform" ? l : "cycloidal");

/**
 * cam. in: joint (a `cam-contact` joint carrying cam: schedule, lift, rb, e, theta0), input (the cam angle, deg),
 * follower (body), axis (the follower's direction of travel, unit; or the pivot axis when swing is true),
 * swing (true: an oscillating follower about the joint's `at`; lift is then radians' worth in degrees).
 * out {s, v, pressure}: displacement (mm or deg), ds/dθ, pressure angle (deg).
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
  const follower = str(i.follower, "cam.follower");
  if (i.swing === true) {
    c.setXf(follower, xf.rotAbout(c.jointAt(jid), c.vec(i.axis), (m.s - m0.s) * D2R));
  } else {
    c.setXf(follower, xf.trans(v3.mul(v3.unit(c.vec(i.axis)), m.s - m0.s)));
  }
  outVal(c, s, m.s, "s");
  outVal(c, s, m.v, "v");
  outVal(c, s, pressureAngle({ rb: c.num(j.cam.rb), e: j.cam.e !== undefined ? c.num(j.cam.e) : 0 }, m.s, m.v) * R2D, "pressure");
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
 * centres with the pin nearest the wheel at 0), phi0 (its reference value), wheel (body), center, axis, sense (+1 or −1,
 * default −1: an external Geneva turns against its crank).
 * out {angle}: the wheel's angle (deg).
 */
const indexer: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const n = c.num(i.n);
  const phi0 = c.num(i.phi0 ?? 0) * D2R;
  const phi = phi0 + c.delta("in", c.rad(i.input));
  const sense = i.sense !== undefined ? c.num(i.sense) : -1; // an external Geneva turns against its crank
  const d = sense * (genevaAngle(n, phi) - genevaAngle(n, phi0));
  if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.center), v3.unit(c.vec(i.axis ?? [0, 0, 1])), d);
  outVal(c, s, d * R2D, "angle");
};

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
  cam: camBlock,
  screw: screwBlock,
  convey: conveyBlock,
  flexure: flexureBlock,
  reeve: reeveBlock,
  variator: variatorBlock,
  integrator: integratorBlock,
  escapement: escapementBlock,
  indexer,
};
