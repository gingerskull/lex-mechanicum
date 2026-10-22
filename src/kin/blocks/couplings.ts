// Blocks of the couplings and spatial linkages (R6): closed forms only, each a few lines of geometry.
//   cross-slide       an intermediate body with two slides at right angles between two parallel shafts (Oldham)
//   parallel-cranks   discs that turn alike about their own centres, joined by links that never turn (Schmidt)
//   plane-slide       sliders whose line meets a plane that a turning body carries (the tilt frame of a swash plate)
//   rzeppa            a homokinetic joint as built: cage in the bisecting plane, balls where it meets the grooves
//   conical-pendulum  arms hinged on a spinning spindle, standing where the speed balances them
import { type BlockCtx, type BlockFn, KinError } from "../ctx";
import type { SolveStep } from "../types";
import { D2R, R2D, type Vec3, v3, xf, type Xf } from "../math";

const str = (v: unknown, what: string): string => {
  if (typeof v !== "string") throw new KinError(`${what} must be a name`);
  return v;
};

const outVal = (c: BlockCtx, s: SolveStep, key: string, v: number): void => {
  const o = s.out;
  if (o && typeof o === "object" && !Array.isArray(o) && typeof o[key] === "string") c.setVal(o[key]!, v);
};

/** The other body of a joint to the ground. */
const grounded = (c: BlockCtx, jid: string): string => {
  const j = c.joint(jid);
  return j.a === "ground" ? j.b : j.a;
};

/**
 * The point where the line through `a` along `d` meets the plane through `p` with normal `n`: the line parameter.
 * Null when the line runs in the plane.
 */
export function linePlane(a: Vec3, d: Vec3, p: Vec3, n: Vec3): number | null {
  const k = v3.dot(d, n);
  if (Math.abs(k) < 1e-12) return null;
  return v3.dot(v3.sub(p, a), n) / k;
}

/**
 * Oldham's middle body: it turns with both shafts, and its centre lies on the input slot line and on the output slot
 * line, square to each other, so it is the foot of the perpendicular from the output axis to the input slot line.
 * Returns the translation along the input slot (from where the turn alone would carry it), and the centre.
 */
export function crossSlide(o1: Vec3, o2: Vec3, axis: Vec3, c0: Vec3, e1: Vec3, d: number): { s: number; c: Vec3 } {
  const R = xf.rotAbout(o1, axis, d);
  const R2 = xf.rotAbout(o2, axis, d);
  const p1 = xf.apply(R, c0);
  const p2 = xf.apply(R2, c0);
  const e = v3.unit(xf.dir(R, e1));
  const s = v3.dot(v3.sub(p2, p1), e);
  return { s, c: v3.add(p1, v3.mul(e, s)) };
}

/**
 * cross-slide. in: input (the input shaft's angle, deg, as a value name), joints { in, out } (the two shafts' ground
 * revolutes, on parallel axes), slide (the prismatic joint between the input hub and the middle body: its axis is the
 * input slot), body (the middle body), center (its centre: a point name). The output shaft turns with the input; the
 * middle body turns with both and slides on each. out { orbit }: the angle of the centre about the midpoint of the two
 * shaft axes (deg, from the reference, continuous): twice the input's.
 */
const crossSlideBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const J = (i.joints ?? {}) as Record<string, unknown>;
  const jIn = str(J.in, "cross-slide.joints.in");
  const jOut = str(J.out, "cross-slide.joints.out");
  const o1 = c.jointAt(jIn);
  const o2 = c.jointAt(jOut);
  const axis = c.jointAxis(jIn);
  const d = c.delta("in", c.rad(i.input));
  const c0 = c.refPt(str(i.center, "cross-slide.center"));
  const e1 = c.jointAxis(str(i.slide, "cross-slide.slide"));
  const r = crossSlide(o1, o2, axis, c0, e1, d);
  const body = str(i.body, "cross-slide.body");
  c.setXf(body, xf.mul(xf.trans(v3.mul(v3.unit(xf.dir(xf.rotAbout(o1, axis, d), e1)), r.s)), xf.rotAbout(o1, axis, d)));
  c.setXf(grounded(c, jOut), xf.rotAbout(o2, axis, d));
  // the orbit: about the midpoint of the axes, in the plane square to them
  const m = v3.mul(v3.add(o1, o2), 0.5);
  const ref = v3.perp(v3.sub(c0, m), axis);
  const now = v3.perp(v3.sub(r.c, m), axis);
  const ang = Math.atan2(v3.dot(axis, v3.cross(ref, now)), v3.dot(ref, now));
  // continuous: the orbit runs twice as fast as the shaft, so unwrap against twice the input's turn
  const turns = Math.round((2 * d - ang) / (2 * Math.PI));
  outVal(c, s, "orbit", (ang + turns * 2 * Math.PI) * R2D);
};

/**
 * parallel-cranks. in: input (deg, a value), discs [{ body, center (a point or joint), axis }] (every disc turns by the
 * input's turn about its own centre; the input disc's own driver may already have turned it), links [{ body, pin (a
 * joint), disc }] (each link keeps its direction and moves with the pin it shares with that disc). out { turn }: the
 * discs' turn from the reference (deg).
 */
const parallelCranks: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const d = c.delta("in", c.rad(i.input));
  const spins = new Map<string, Xf>();
  for (const q of (i.discs as { body: unknown; center: unknown; axis?: unknown }[] | undefined) ?? []) {
    const body = str(q.body, "parallel-cranks.discs.body");
    const X = xf.rotAbout(c.refVec(q.center), v3.unit(q.axis ? c.vec(q.axis) : [0, 0, 1]), d);
    spins.set(body, X);
    c.setXf(body, X);
  }
  for (const l of (i.links as { body: unknown; pin: unknown; disc: unknown }[] | undefined) ?? []) {
    const X = spins.get(str(l.disc, "parallel-cranks.links.disc"));
    if (!X) throw new KinError(`parallel-cranks ${s.id}: link ${String(l.body)} follows a disc the block does not turn`);
    const p0 = c.jointAt(str(l.pin, "parallel-cranks.links.pin"));
    c.setXf(str(l.body, "parallel-cranks.links.body"), xf.trans(v3.sub(xf.apply(X, p0), p0)));
  }
  outVal(c, s, "turn", d * R2D);
};

/** The least turn carrying the unit direction a onto the unit direction b. */
export function turnOnto(a: Vec3, b: Vec3): Xf {
  const ax = v3.cross(a, b);
  const sn = v3.len(ax);
  const cs = v3.dot(a, b);
  if (sn < 1e-12) return cs > 0 ? xf.id() : xf.rotAbout([0, 0, 0], v3.unit(v3.perp(Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], a)), Math.PI);
  return xf.rotAbout([0, 0, 0], ax, Math.atan2(sn, cs));
}

/**
 * plane-slide. in: plate (the body that carries the plane), rides (optional: a body the plate is fixed to, whose pose
 * it takes: a swash plate pinned to its shaft at the tilt angle), point and normal (the plane in the reference
 * configuration, world: a point name or [x, y, z], and a direction), pistons [{ body, joint (its prismatic joint to the
 * ground, whose axis is the slide), at (the point of the slider held at a fixed distance from the plane: its ball
 * centre), out (a value name: the slide, mm, from the reference) }], shoes [{ body, at (the ball centre it swivels on) }]
 * (each shoe stays face to face with the plane and goes with its ball). Each slider stands where its line meets the
 * plane as the plate carries it now.
 */
const planeSlide: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const plate = str(i.plate, "plane-slide.plate");
  if (typeof i.rides === "string") c.setXf(plate, c.xf(i.rides));
  const X = c.xf(plate);
  const p0 = c.refVec(i.point);
  const n0 = v3.unit(c.vec(i.normal));
  const p = xf.apply(X, p0);
  const n = xf.dir(X, n0);
  const moved = new Map<string, Vec3>();
  for (const q of (i.pistons as { body: unknown; joint: unknown; at: unknown; out?: unknown }[] | undefined) ?? []) {
    const jid = str(q.joint, "plane-slide.pistons.joint");
    const dir = c.jointAxis(jid);
    const a = c.refVec(q.at);
    const t = linePlane(a, dir, p, n);
    const t0 = linePlane(a, dir, p0, n0);
    if (t === null || t0 === null) throw new KinError(`plane-slide ${s.id}: slider ${String(q.body)} runs in the plane`);
    c.setXf(str(q.body, "plane-slide.pistons.body"), xf.trans(v3.mul(dir, t - t0)));
    if (typeof q.at === "string") moved.set(q.at, v3.add(a, v3.mul(dir, t - t0)));
    if (typeof q.out === "string") c.setVal(q.out, t - t0);
  }
  const T = turnOnto(n0, n);
  for (const q of (i.shoes as { body: unknown; at: unknown }[] | undefined) ?? []) {
    const a = c.refVec(q.at);
    const now = (typeof q.at === "string" && moved.get(q.at)) || a;
    c.setXf(str(q.body, "plane-slide.shoes.body"), { R: T.R, t: v3.sub(now, xf.dir(T, a)) });
  }
};

/**
 * The centre of a Rzeppa ball: in the bisecting plane (normal `n`), on the meridian plane of the input race that holds
 * the groove direction `q` (square to the input axis `a1`), at `rp` from the joint centre `j`.
 */
export function rzeppaBall(j: Vec3, a1: Vec3, n: Vec3, q: Vec3, rp: number): Vec3 {
  const meridian = v3.cross(a1, q);
  let m = v3.unit(v3.cross(meridian, n));
  if (v3.dot(m, q) < 0) m = v3.mul(m, -1);
  return v3.add(j, v3.mul(m, rp));
}

/**
 * rzeppa. in: input (deg, a value), joints { in, out } (the two shafts' ground revolutes, axes meeting at the joint
 * centre `center`, a point or joint), cage (body), balls [{ body, phase (deg about the input axis from the plane of the
 * shafts' normal) }], rp (pitch radius). The output turns with the input (θ2 = θ1); the cage turns about the bisector of
 * the two axes; each ball stands where the bisecting plane meets its groove's meridian. out { tilt }: the cage axis's
 * angle from the input axis (deg), β/2.
 */
const rzeppaBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const J = (i.joints ?? {}) as Record<string, unknown>;
  const jIn = str(J.in, "rzeppa.joints.in");
  const jOut = str(J.out, "rzeppa.joints.out");
  const a1 = c.jointAxis(jIn);
  let a2 = c.jointAxis(jOut);
  const j = c.refVec(i.center);
  // both axes pointing away from the input side: the output axis leaves the centre
  if (v3.dot(v3.sub(c.jointAt(jOut), j), a2) < 0) a2 = v3.mul(a2, -1);
  const a1in = v3.dot(v3.sub(j, c.jointAt(jIn)), a1) >= 0 ? a1 : v3.mul(a1, -1);
  const n = v3.unit(v3.add(a1in, a2));
  const d = c.delta("in", c.rad(i.input));
  c.setXf(grounded(c, jOut), xf.rotAbout(j, a2, v3.dot(a2, a1) >= 0 ? d : d));
  const cage = str(i.cage, "rzeppa.cage");
  const C = xf.rotAbout(j, n, d);
  c.setXf(cage, C);
  const rp = c.num(i.rp);
  // the plane of the shafts' normal: phase 0 for the grooves
  const np = v3.cross(a1in, a2);
  const e0 = v3.len(np) > 1e-9 ? v3.unit(np) : v3.unit(v3.perp(Math.abs(a1in[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0], a1in));
  for (const b of (i.balls as { body: unknown; phase: unknown }[] | undefined) ?? []) {
    const ph = c.num(b.phase) * D2R;
    const q0 = xf.dir(xf.rotAbout([0, 0, 0], a1in, ph), e0);
    const q = xf.dir(xf.rotAbout([0, 0, 0], a1in, d), q0);
    const now = rzeppaBall(j, a1in, n, q, rp);
    const ref = rzeppaBall(j, a1in, n, q0, rp);
    c.setXf(str(b.body, "rzeppa.balls.body"), { R: C.R, t: v3.sub(now, xf.dir(C, ref)) });
  }
  outVal(c, s, "tilt", Math.acos(Math.max(-1, Math.min(1, v3.dot(n, a1in)))) * R2D);
};

/** The arm angle from the spindle (rad) at which a conical pendulum of length l (mm) balances at n rpm; 0 below the lift-off speed. */
export function pendulumAngle(rpm: number, l: number, g = 9810): number {
  const w = (rpm * 2 * Math.PI) / 60;
  const c = g / (l * w * w);
  return c >= 1 ? 0 : Math.acos(c);
}

/**
 * conical-pendulum. in: speed (rpm, a value: a manual driver), l (pivot to ball centre, mm), g (mm/s², default 9810),
 * spindle (the turning body that carries the arms), arms [{ body, joint (its hinge on the spindle), down (a point below
 * the hinge on the spindle axis), tip (a point or joint of the arm off its hinge) }], all in the reference
 * configuration. Each arm stands at acos(g / (l ω²)) from the spindle, on the side its reference pose is on, and the
 * spindle's turn carries it. out { angle }: that angle (deg).
 */
const conicalPendulum: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const phi = pendulumAngle(c.num(i.speed), c.num(i.l), i.g !== undefined ? c.num(i.g) : undefined);
  const S = c.xf(str(i.spindle, "conical-pendulum.spindle"));
  for (const a of (i.arms as { body: unknown; joint: unknown; down: unknown; tip: unknown }[] | undefined) ?? []) {
    const jid = str(a.joint, "conical-pendulum.arms.joint");
    const at = c.jointAt(jid);
    const ax = c.jointAxis(jid);
    const down = v3.perp(v3.sub(c.refVec(a.down), at), ax);
    const r0 = v3.perp(v3.sub(c.refVec(a.tip), at), ax);
    const phi0 = Math.atan2(v3.dot(ax, v3.cross(down, r0)), v3.dot(down, r0));
    // the arm turns by the change of the balance angle since the reference (where the record's geometry stands)
    const body = str(a.body, "conical-pendulum.arms.body");
    const turn = c.delta(`phi:${body}`, (phi0 < 0 ? -1 : 1) * phi);
    c.setXf(body, xf.mul(S, xf.rotAbout(at, ax, turn)));
  }
  outVal(c, s, "angle", phi * R2D);
};

export const COUPLING_BLOCKS: Record<string, BlockFn> = {
  "cross-slide": crossSlideBlock,
  "parallel-cranks": parallelCranks,
  "plane-slide": planeSlide,
  rzeppa: rzeppaBlock,
  "conical-pendulum": conicalPendulum,
};
