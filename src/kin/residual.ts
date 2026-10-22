// Joint residuals: how far a set of body poses is from satisfying each declared joint, in 3D. This is the K1 check;
// it knows nothing of the blocks that produced the poses, and the numeric fallback minimises the same vectors.
import { D2R, type Mat3, type Vec3, m3, v3, wrapPi, xf, type Xf } from "./math";
import { evalExpr } from "./expr";
import type { KinJoint } from "./types";
import { ellipticalAngle, meshRatio } from "./blocks/gears";
import { type CamSchedule, camMotion, type CamLaw } from "./blocks/cam";
import { screwAdvance } from "./blocks/members";
import { reflection, bisectorNormal } from "./blocks/spatial";

/** A joint with its numbers and vectors evaluated (parameters bound) and its reference geometry in world coordinates. */
export interface ResolvedJoint {
  joint: KinJoint;
  at: Vec3;
  axis: Vec3;
  axis2?: Vec3;
  pinA?: Vec3;
  pinB?: Vec3;
  slot?: { from: Vec3; to: Vec3; repeat?: number; center?: Vec3; circle?: number };
  ca?: Vec3;
  cb?: Vec3;
  num: (v: unknown) => number;
}

const axisLike = (R: Mat3, a: Vec3): Vec3 => m3.mulV(R, a);

/** Rotation of the relative pose about a unit axis, and the translation along it, of b with respect to a. */
function relative(Xa: Xf, Xb: Xf): Xf {
  return xf.mul(Xb, xf.inv(Xa));
}

export function wrapped(joint: KinJoint, driverValue: (id: string) => number | undefined): boolean {
  const a = joint.active;
  if (!a) return true;
  const v = driverValue(a.driver);
  if (v === undefined) return true;
  const span = (((a.hi - a.lo) % 360) + 360) % 360;
  const off = ((((v - a.lo) % 360) + 360) % 360);
  return off <= span;
}

/**
 * Vector of position-type residuals (mm and unit-vector components, all 0 for a satisfied joint) for the pose
 * (Xa, Xb) of the joint's two bodies. Joints whose condition is a relation between motions (meshes, belts, screws) are
 * checked by `stepResidual` instead and give an empty vector here.
 */
export function jointResidual(r: ResolvedJoint, Xa: Xf, Xb: Xf, driverValue: (id: string) => number | undefined = () => undefined): number[] {
  const j = r.joint;
  const pa = xf.apply(Xa, r.at);
  const pb = xf.apply(Xb, r.at);
  const ax = axisLike(Xa.R, r.axis);
  const bx = axisLike(Xb.R, r.axis);
  const out: number[] = [];
  const push = (v: Vec3) => out.push(v[0], v[1], v[2]);
  switch (j.type) {
    case "revolute":
    case "flexure":
      push(v3.sub(pa, pb));
      push(v3.cross(ax, bx));
      break;
    case "cylindrical":
      push(v3.perp(v3.sub(pa, pb), ax));
      push(v3.cross(ax, bx));
      break;
    case "prismatic": {
      push(v3.perp(v3.sub(pa, pb), ax));
      push(v3.cross(ax, bx));
      const rel = relative(Xa, Xb);
      // no relative turn: the rotation vector of the relative pose
      push(m3.log(rel.R));
      break;
    }
    case "screw": {
      push(v3.perp(v3.sub(pa, pb), ax));
      push(v3.cross(ax, bx));
      break;
    }
    case "spherical":
      push(v3.sub(pa, pb));
      break;
    case "universal": {
      push(v3.sub(pa, pb));
      if (r.pinA && r.pinB) out.push(v3.dot(axisLike(Xa.R, r.pinA), axisLike(Xb.R, r.pinB)));
      if (j.homokinetic && r.axis2) {
        // CV condition: the output frame is the mirror image of the input frame in the bisecting plane
        const a1 = ax;
        const a2 = axisLike(Xb.R, r.axis2);
        const M = reflection(bisectorNormal(a1, a2));
        const expect = m3.mul(M, m3.mul(Xa.R, M));
        for (let k = 0; k < 9; k++) out.push(Xb.R[k]! - expect[k]!);
      }
      break;
    }
    case "planar": {
      out.push(v3.dot(v3.sub(pa, pb), ax));
      push(v3.cross(ax, bx));
      break;
    }
    case "pin-in-slot": {
      if (r.slot?.circle !== undefined && r.slot.center) {
        // a pin running round a round hole: its centre stays at the radius from the hole's centre
        out.push(v3.dist(xf.apply(Xa, r.at), xf.apply(Xb, r.slot.center)) - r.slot.circle);
        break;
      }
      if (!wrapped(j, driverValue) || !r.slot) break;
      const pin = xf.apply(Xa, r.at);
      let best: Vec3 | null = null;
      const n = r.slot.repeat ?? 1;
      for (let k = 0; k < n; k++) {
        const turn = r.slot.center ? xf.rotAbout(r.slot.center, r.axis, (k * 2 * Math.PI) / n) : xf.id();
        const from = xf.apply(Xb, xf.apply(turn, r.slot.from));
        const dir = v3.unit(xf.dir(Xb, xf.dir(turn, v3.sub(r.slot.to, r.slot.from))));
        const miss = v3.perp(v3.sub(pin, from), dir);
        if (!best || v3.len(miss) < v3.len(best)) best = miss;
      }
      push(best!);
      break;
    }
    case "cam-contact": {
      if (!j.cam) break;
      const n = r.num;
      const sched: CamSchedule = {
        lift: n(j.cam.lift),
        segments: j.cam.schedule.map((g) => ({ kind: g.kind, span: n(g.span) * D2R, law: (g.law as CamLaw | undefined) ?? "cycloidal" })),
      };
      if (!r.ca) break; // the cam's axis point is needed
      const th = n(j.cam.theta0 ?? 0) * D2R + xf.angleAbout(Xb, r.axis);
      const m = camMotion(sched, th);
      const e = j.cam.e !== undefined ? n(j.cam.e) : 0;
      const rb = n(j.cam.rb);
      const tip = xf.apply(xf.inv(Xb), xf.apply(Xa, r.at));
      const centre = r.ca;
      const radial = v3.len(v3.perp(v3.sub(tip, centre), r.axis));
      if (j.cam.form === "barrel") {
        // a barrel cam: the roller stays at the pitch radius and moves along the axis by the law, from its reference place
        const s0 = camMotion(sched, n(j.cam.theta0 ?? 0) * D2R).s;
        const a0 = v3.dot(v3.sub(r.at, centre), r.axis);
        out.push(radial - rb, v3.dot(v3.sub(tip, centre), r.axis) - (a0 + m.s - s0));
        break;
      }
      out.push(radial - Math.hypot(e, Math.sqrt(Math.max(0, rb * rb - e * e)) + m.s));
      break;
    }
    default:
      break;
  }
  if (r.ca && r.cb && (j.type === "gear-mesh" || j.type === "rolling")) {
    const d = v3.dist(xf.apply(Xa, r.ca), xf.apply(Xb, r.cb));
    out.push(d - v3.dist(r.ca, r.cb));
  }
  return out;
}

/** Angle of a relative pose about an axis (unit), the part of its rotation vector along it. */
const turn = (X0: Xf, X1: Xf, axis: Vec3): number => xf.angleAbout(xf.mul(X1, xf.inv(X0)), axis);

export interface StepInput {
  /** The two bodies' poses at two consecutive samples. */
  a0: Xf;
  a1: Xf;
  b0: Xf;
  b1: Xf;
  /** The carrier's poses, for a mesh inside a planetary (steps below π). */
  c0?: Xf;
  c1?: Xf;
}

/**
 * Residual of a motion relation between two consecutive poses (steps well below a half turn): a gear mesh keeps the
 * ratio of the two bodies' turns, a belt or rolling pair the ratio of the radii, a screw its lead, a rack its pitch
 * radius. Null when the joint has no such relation.
 */
export function stepResidual(r: ResolvedJoint, s: StepInput): number | null {
  const j = r.joint;
  const n = r.num;
  const ax = r.axis;
  const ax2 = r.axis2 ?? r.axis;
  if (j.type === "gear-mesh") {
    // a mesh carried round by a carrier is checked in the carrier's frame (a planet's mesh, a differential's spiders on
    // a case that turns about another axis)
    if (s.c0 && s.c1) {
      const i0 = xf.inv(s.c0);
      const i1 = xf.inv(s.c1);
      s = { a0: xf.mul(i0, s.a0), a1: xf.mul(i1, s.a1), b0: xf.mul(i0, s.b0), b1: xf.mul(i1, s.b1) };
    }
    const dC = 0;
    const dA = turn(s.a0, s.a1, ax) - dC;
    if (j.radiusA !== undefined && j.radiusB === undefined && j.zb === undefined && j.ratio === undefined && !j.ncg) {
      // rack: b's origin travels along axis2 by r Δθa
      const trav = v3.dot(v3.sub(xf.apply(s.b1, r.at), xf.apply(s.b0, r.at)), ax2);
      return trav - n(j.radiusA) * dA;
    }
    if (j.ncg) return null; // the pitch curve is checked at the sample angles, see verify
    const ratio = j.ratio !== undefined ? n(j.ratio) : meshRatio({ za: n(j.za), zb: n(j.zb), internal: j.internal, sign: j.crossed ? ((j.hand === "left" ? -1 : 1) as 1 | -1) : undefined });
    return wrapPi(turn(s.b0, s.b1, ax2) - dC - ratio * dA);
  }
  if (j.type === "belt" || j.type === "rolling") {
    const dA = turn(s.a0, s.a1, ax);
    const ra = n(j.radiusA);
    const rb = n(j.radiusB ?? j.radiusA);
    const sign = j.type === "belt" ? (j.crossed ? -1 : 1) : -1;
    return wrapPi(turn(s.b0, s.b1, ax2) - sign * (ra / rb) * dA);
  }
  if (j.type === "screw") {
    const p0 = xf.apply(s.b0, r.at);
    const p1 = xf.apply(s.b1, r.at);
    const pa0 = xf.apply(s.a0, r.at);
    const pa1 = xf.apply(s.a1, r.at);
    const adv = v3.dot(v3.sub(v3.sub(p1, pa1), v3.sub(p0, pa0)), ax);
    const turnRel = turn(s.a0, s.a1, ax) - turn(s.b0, s.b1, ax); // the shaft's turn relative to the nut
    return adv - screwAdvance(n(j.lead), turnRel, j.hand ?? "right");
  }
  return null;
}

/** Residual of the non-circular mesh over one step, using the ellipse's closed form at the driver angle. */
export function ncgResidual(r: ResolvedJoint, a0: Xf, a1: Xf, b0: Xf, b1: Xf): number | null {
  const j = r.joint;
  if (!j.ncg) return null;
  const e = r.num(j.ncg.e);
  const ph = r.num(j.ncg.phase ?? 0) * D2R;
  const t0 = xf.angleAbout(a0, r.axis);
  const t1 = xf.angleAbout(a1, r.axis);
  const dA = wrapPi(t1 - t0);
  const expect = -(ellipticalAngle(e, ph + t0 + dA) - ellipticalAngle(e, ph + t0));
  return wrapPi(turn(b0, b1, r.axis2 ?? r.axis) - expect);
}

export function resolveJoint(j: KinJoint, num: (v: unknown) => number, vec: (v: unknown) => Vec3): ResolvedJoint {
  const unit = (v: Vec3): Vec3 => v3.unit(v);
  return {
    joint: j,
    at: vec(j.at),
    axis: unit(j.axis ? vec(j.axis) : [0, 0, 1]),
    axis2: j.axis2 ? unit(vec(j.axis2)) : undefined,
    pinA: j.pinA ? unit(vec(j.pinA)) : undefined,
    pinB: j.pinB ? unit(vec(j.pinB)) : undefined,
    slot: j.slot
      ? j.slot.path === "circle"
        ? { from: [0, 0, 0], to: [0, 0, 0], center: j.slot.center ? vec(j.slot.center) : undefined, circle: num(j.slot.radius) }
        : { from: vec(j.slot.from), to: vec(j.slot.to), repeat: j.slot.repeat, center: j.slot.center ? vec(j.slot.center) : undefined }
      : undefined,
    ca: j.ca ? vec(j.ca) : undefined,
    cb: j.cb ? vec(j.cb) : undefined,
    num,
  };
}

export { evalExpr };
