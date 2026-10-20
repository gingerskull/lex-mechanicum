// Timed mechanisms: Geneva and star wheel in closed form, escapement by simulation.
import { TAU } from "../math";

/**
 * External Geneva wheel with n slots and crank radius r (centre distance c = r / sin(π/n)). The crank angle φ is
 * measured from the line of centres with the pin nearest the wheel centre at φ = 0. Returns the wheel angle within one
 * index (0 at the start of the engagement of this index, 2π/n at the end) and whether the pin is engaged.
 */
export function genevaIndex(n: number, phi: number): { angle: number; engaged: boolean; ratio: number } {
  const half = Math.PI / 2 - Math.PI / n; // engagement half-angle of the crank
  const p = ((phi + Math.PI) % TAU + TAU) % TAU - Math.PI; // -π..π
  const k = 1 / Math.sin(Math.PI / n); // c / r
  if (Math.abs(p) >= half) return { angle: p < 0 ? 0 : TAU / n, engaged: false, ratio: 0 };
  // the slot centre line through the wheel centre: tan ψ = sin p / (k − cos p), ψ from −π/n to +π/n
  const psi = Math.atan2(Math.sin(p), k - Math.cos(p));
  const dpsi = (k * Math.cos(p) - 1) / (1 + k * k - 2 * k * Math.cos(p));
  return { angle: psi + Math.PI / n, engaged: true, ratio: dpsi };
}

/**
 * Total wheel angle for a continuously turning crank: the wheel advances 2π/n per crank turn, in the engagement window
 * around φ = 0 (mod 2π), and holds elsewhere.
 */
export function genevaAngle(n: number, phi: number): number {
  const turns = Math.round(phi / TAU);
  const local = phi - turns * TAU;
  return turns * (TAU / n) + genevaIndex(n, local).angle;
}

/** Crank angle at which the pin enters the slot (and leaves it): ±(π/2 − π/n). */
export const genevaEngagement = (n: number): number => Math.PI / 2 - Math.PI / n;

/**
 * Star wheel (external Geneva with open teeth): the pin pushes a tooth flank that lies on the line through the wheel
 * centre, so the motion law is the Geneva's. The wheel is held by a detent between indexes; the pin never locks it.
 */
export const starWheelAngle = genevaAngle;

export type EscapementKind = "anchor" | "lever" | "verge";

export interface EscapementSpec {
  kind: EscapementKind;
  /** Escape wheel teeth. */
  z: number;
  /** Pendulum or balance amplitude, radians, and the angle at which the engaged pallet releases the tooth. */
  amplitude: number;
  /** Fraction of the half swing, from the centre, where the pallet releases the tooth (the locking arc). */
  lock: number;
  /** Drop of the wheel after release as a fraction of the pitch. */
  drop: number;
  /** Recoil (anchor) as a fraction of the pitch the wheel is pushed back while the pallet over-swings; 0 for dead-beat. */
  recoil: number;
}

export interface EscapementState {
  wheel: number; // total wheel angle, radians
  pallet: number; // pallet / fork / verge angle, radians
  locked: boolean;
}

/**
 * Escapement by simulation. The oscillator (pendulum, balance, verge staff) swings θp = A sin u. The escape wheel is
 * held by the engaged pallet and advances one pitch per half swing:
 *  - locked: |sin u| >= lock. The wheel rests on the pallet; an anchor or verge recoils it by `recoil` pitches at the
 *    extreme of the swing, a lever (recoil 0) holds it dead;
 *  - impulse: |sin u| < lock, the pallet face pushes the wheel (1 − drop) of a pitch as the pallet crosses the centre;
 *  - drop: the wheel is released and falls the last `drop` of the pitch under constant acceleration until the other
 *    pallet catches it.
 * The step is time-stepped over one cycle from the pendulum's extreme; the table is interpolated, so poses are random
 * access and periodic (2 pitches per cycle).
 */
export function simulateEscapement(spec: EscapementSpec, steps = 3600): { at: (u: number) => EscapementState; table: EscapementState[] } {
  const pitch = TAU / spec.z;
  const du = TAU / steps;
  const fallSpan = 0.05 * Math.PI; // time of the drop, in u
  const accel = (2 * spec.drop * pitch) / (fallSpan * fallSpan);
  const table: EscapementState[] = [];
  let base = 0;
  let wheel = -spec.recoil * pitch; // at the extreme of the swing, with the recoil of the pallet that holds it
  let phase: "locked" | "impulse" | "fall" = "locked";
  let w0 = 0; // wheel angle at the start of the impulse
  let omega = 0;
  for (let i = 0; i <= steps; i++) {
    const u = i * du - Math.PI / 2; // the simulation starts at the pendulum's extreme
    const sn = Math.sin(u);
    const dir = Math.cos(u) >= 0 ? 1 : -1;
    const inWindow = Math.abs(sn) < spec.lock;
    if (phase === "locked" && inWindow) {
      phase = "impulse";
      w0 = wheel;
    }
    if (phase === "impulse") {
      if (inWindow) {
        const x = (sn * dir + spec.lock) / (2 * spec.lock);
        wheel = w0 + (base + (1 - spec.drop) * pitch - w0) * Math.min(1, Math.max(0, x));
      } else {
        phase = "fall";
        wheel = base + (1 - spec.drop) * pitch;
        omega = 0;
      }
    }
    if (phase === "fall") {
      omega += accel * du;
      wheel += omega * du;
      if (wheel >= base + pitch) {
        wheel = base + pitch;
        base += pitch;
        phase = "locked";
      }
    }
    if (phase === "locked") {
      const over = Math.max(0, (Math.abs(sn) - spec.lock) / Math.max(1e-9, 1 - spec.lock));
      wheel = base - spec.recoil * pitch * over;
    }
    table.push({ wheel, pallet: spec.amplitude * sn, locked: phase === "locked" });
  }
  const at = (u: number): EscapementState => {
    const v = u + Math.PI / 2; // table index 0 is the extreme at u = -π/2
    const cyc = Math.floor(v / TAU);
    const f = (((v % TAU) + TAU) % TAU) / du;
    const i = Math.min(steps - 1, Math.floor(f));
    const a = table[i]!;
    const b = table[i + 1]!;
    const t = f - i;
    return { wheel: a.wheel + (b.wheel - a.wheel) * t + cyc * 2 * pitch, pallet: spec.amplitude * Math.sin(u), locked: t < 0.5 ? a.locked : b.locked };
  };
  return { at, table };
}
