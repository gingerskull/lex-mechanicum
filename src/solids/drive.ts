// The oscillating drive's crank and link (standard V5): parts the record has no body for, posed from the input they
// drive. The motor turns a crank; a link from the crank pin to a pin in the input's lever swings the input through its
// range, the crank and the link at a dead centre at each end of the swing. The input's pose places the lever's pin, the
// crank pin lies where the crank's circle about the motor meets the link's circle about that pin, on the side the
// crank turns through in that half of the cycle. A swing wider than a crank and link can give goes through a gear
// step-up: the link swings a sector meshed with a pinion on the input. Pure, shared by the builder, the checks and the
// renderer.
import { D2R, type Vec3, type Xf, v3, xf } from "../kin/math";

export interface DriveMotion {
  /**
   * Which part: the crank (and everything that turns with the motor shaft), the connecting link, or the gear sector of a
   * step-up.
   */
  part: "crank" | "link" | "sector";
  /** The body the drive swings. */
  input: string;
  /** A point on the motor axis and its direction (unit), world reference coordinates. */
  motor: Vec3;
  axis: Vec3;
  /** The lever's pin on the input body and the crank pin, world reference coordinates (the reference configuration). */
  tip: Vec3;
  pin: Vec3;
  /** Crank throw and link length, mm, measured in the plane normal to the axis. */
  r: number;
  L: number;
  /**
   * The side of the motor-to-tip line the crank pin lies on while sin(speed u + phase) >= 0 (the input's driver
   * rising), +1 to the left about the axis; the other half of the cycle takes the other side, so the crank turns on.
   */
  side: 1 | -1;
  /** The input driver's cycle: turns per cycle and phase, radians. */
  speed: number;
  phase: number;
  /**
   * A swing wider than a crank and link can give: the link drives a gear sector on its own pivot, meshed with a pinion on
   * the input, so the sector turns -1/ratio of the input's turn; the turn is read from the driver's law (its range and
   * default, degrees) and the sign of the input's turn about the axis per degree of the driver.
   */
  step?: { pivot: Vec3; ratio: number; lo: number; hi: number; def: number; sign: 1 | -1 };
}

const flat = (d: Vec3, n: Vec3): Vec3 => v3.perp(d, n);

/** Signed angle from a to b about the unit axis n. */
const angleAbout = (a: Vec3, b: Vec3, n: Vec3): number => Math.atan2(v3.dot(n, v3.cross(a, b)), v3.dot(a, b));

/** The crank pin for the lever's pin at T on side s: the two circles' meeting point in the motor's plane. */
export function crankPin(m: Pick<DriveMotion, "motor" | "axis" | "r" | "L">, T: Vec3, s: 1 | -1): Vec3 {
  const d3 = flat(v3.sub(T, m.motor), m.axis);
  const d = v3.len(d3) || 1e-9;
  const e = v3.mul(d3, 1 / d);
  const f = v3.cross(m.axis, e);
  const a = (m.r * m.r - m.L * m.L + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, m.r * m.r - a * a));
  return v3.add(m.motor, v3.add(v3.mul(e, a), v3.mul(f, s * h)));
}

/** The side of the crank pin at phase u. */
export const driveSide = (m: Pick<DriveMotion, "side" | "speed" | "phase">, u: number): 1 | -1 => (Math.sin(m.speed * u + m.phase) >= 0 ? m.side : m.side === 1 ? -1 : 1);

/** The pose of a step-up's sector at phase u (reference to now). */
export function sectorXf(m: Pick<DriveMotion, "axis" | "speed" | "phase"> & { step: NonNullable<DriveMotion["step"]> }, u: number): Xf {
  const s = m.step;
  const v = s.lo + (s.hi - s.lo) * (0.5 - 0.5 * Math.cos(m.speed * u + m.phase));
  return xf.rotAbout(s.pivot, m.axis, (-s.sign * (v - s.def) * D2R) / s.ratio);
}

/** The pose (reference to now) of a drive part at phase u, given the pose X of the input body at u. */
export function driveXf(m: DriveMotion, X: Xf, u: number): Xf {
  // the link's far pin is on the input's lever, or on the step-up's sector
  const lever = m.step ? sectorXf({ ...m, step: m.step }, u) : X;
  if (m.part === "sector") return lever;
  const T = xf.apply(lever, m.tip);
  const C = crankPin(m, T, driveSide(m, u));
  if (m.part === "crank") {
    const ang = angleAbout(flat(v3.sub(m.pin, m.motor), m.axis), flat(v3.sub(C, m.motor), m.axis), m.axis);
    return xf.rotAbout(m.motor, m.axis, ang);
  }
  // the link turns about its crank pin by the change of its direction, then goes with the pin
  const ang = angleAbout(flat(v3.sub(m.tip, m.pin), m.axis), flat(v3.sub(T, C), m.axis), m.axis);
  return xf.mul(xf.trans(v3.sub(C, m.pin)), xf.rotAbout(m.pin, m.axis, ang));
}
