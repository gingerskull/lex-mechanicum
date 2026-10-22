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

/**
 * Internal Geneva wheel with n slots, crank radius a = c sin(π/n) on a centre c from the wheel's. The crank angle φ is
 * measured from the line of centres with the pin farthest from the wheel centre at φ = 0. The pin drives while it is
 * past the slots' mouths, |φ| < π/2 + π/n (270° of crank for four slots); the wheel turns the same way as the crank,
 * tan β = sin φ / (k + cos φ) with k = c / a, and is held between.
 */
export function genevaInternalIndex(n: number, phi: number): { angle: number; engaged: boolean; ratio: number } {
  const half = Math.PI / 2 + Math.PI / n;
  const p = ((phi + Math.PI) % TAU + TAU) % TAU - Math.PI;
  const k = 1 / Math.sin(Math.PI / n);
  if (Math.abs(p) >= half) return { angle: p < 0 ? 0 : TAU / n, engaged: false, ratio: 0 };
  const beta = Math.atan2(Math.sin(p), k + Math.cos(p));
  const dbeta = (1 + k * Math.cos(p)) / (1 + k * k + 2 * k * Math.cos(p));
  return { angle: beta + Math.PI / n, engaged: true, ratio: dbeta };
}

/** Total wheel angle of an internal Geneva for a continuously turning crank (see genevaInternalIndex). */
export function genevaInternalAngle(n: number, phi: number): number {
  const turns = Math.round(phi / TAU);
  return turns * (TAU / n) + genevaInternalIndex(n, phi - turns * TAU).angle;
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

export interface StarSpec {
  /** Teeth, tip and root radii; the star's tips stand at `tip0` + k·360/n degrees (counter-clockwise) at rest. */
  n: number;
  tip: number;
  root: number;
  tip0: number;
  /** Star centre relative to the driver's centre, mm; the finger's radius and pin radius; its angle at rest (deg). */
  c: [number, number];
  rf: number;
  pin: number;
  finger0: number;
  /** The jumper: pivot (relative to the driver's centre), arm, roller radius, and the arm's swing (deg from the world x). */
  jumper: [number, number];
  swing: [number, number];
  arm: number;
  roller: number;
  /** Driver degrees over which the jumper snaps the star from the crest to the next gap. */
  snap: number;
}

/** The star's outline (straight flanks from each tip to the roots half a pitch either side), turned clockwise by ψ. */
export function starOutline(s: StarSpec, psi: number): [number, number][] {
  const out: [number, number][] = [];
  const p = TAU / s.n;
  for (let k = 0; k < s.n; k++) {
    const a = (s.tip0 * Math.PI) / 180 + k * p - psi;
    out.push([s.c[0] + s.tip * Math.cos(a), s.c[1] + s.tip * Math.sin(a)]);
    out.push([s.c[0] + s.root * Math.cos(a + p / 2), s.c[1] + s.root * Math.sin(a + p / 2)]);
  }
  return out;
}

/** Signed distance of a point to a closed polygon: positive outside. */
export function polyDist(poly: [number, number][], x: number, y: number): number {
  let d = Infinity;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j]!;
    const [bx, by] = poly[i]!;
    const ex = bx - ax;
    const ey = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey)));
    d = Math.min(d, Math.hypot(x - ax - t * ex, y - ay - t * ey));
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
  }
  return inside ? -d : d;
}

/**
 * Star wheel with a jumper, by stepping the driver through one turn (counter-clockwise from its rest angle). The finger
 * (a pin of radius `pin` on radius `rf`) pushes the star clockwise by contact with a flank; once a tooth's tip reaches the
 * jumper's crest the jumper snaps the star on to the next gap over `snap` degrees of driver (cycloidal, never behind the
 * finger); otherwise the jumper holds it. The jumper's roller rides the star's outline, pressed toward it by its spring.
 * Returns tables over the driver angle (degrees, one per `step`) of the star's turn ψ (deg, clockwise), the finger's push
 * alone (deg), and the jumper's angle about its pivot (deg, counter-clockwise, from its rest).
 */
export function simulateStar(s: StarSpec, step = 0.05): { star: Float64Array; push: Float64Array; jumper: Float64Array; step: number; crest: number } {
  const n = Math.round(360 / step);
  const star = new Float64Array(n + 1);
  const push = new Float64Array(n + 1);
  const jumper = new Float64Array(n + 1);
  const pitch = 360 / s.n;
  const pen = (psi: number, th: number) => {
    const a = ((s.finger0 + th) * Math.PI) / 180;
    return polyDist(starOutline(s, (psi * Math.PI) / 180), s.rf * Math.cos(a), s.rf * Math.sin(a)) - s.pin;
  };
  // the finger alone: the least turn at which the pin no longer cuts into the star, never going back
  const pushed = (psi0: number, th: number): number => {
    if (pen(psi0, th) >= 0) return psi0;
    // the first clear turn ahead, in small steps (the pin may cut into two flanks), then bisected
    let lo = psi0;
    let hi = psi0;
    while (hi < psi0 + pitch && pen(hi, th) < 0) {
      lo = hi;
      hi += 0.25;
    }
    if (pen(hi, th) < 0) throw new Error(`star wheel: the finger jams at driver ${th.toFixed(2)}`);
    for (let k = 0; k < 60; k++) {
      const m = (lo + hi) / 2;
      if (pen(m, th) >= 0) hi = m;
      else lo = m;
    }
    return hi;
  };
  // the jumper's roller: over the arm's swing (`swing`, deg about the pivot, from the world x), the angle that brings the
  // roller nearest the star's centre while it stays outside the outline: where its spring holds it
  const J = s.jumper;
  const [g0, g1] = s.swing.map((v) => (v * Math.PI) / 180) as [number, number];
  const roll = (psi: number): number => {
    const poly = starOutline(s, (psi * Math.PI) / 180);
    const at = (a: number): [number, number] => [J[0] + s.arm * Math.cos(a), J[1] + s.arm * Math.sin(a)];
    const d = (a: number) => polyDist(poly, ...at(a)) - s.roller;
    const r = (a: number) => Math.hypot(at(a)[0] - s.c[0], at(a)[1] - s.c[1]);
    const N = 400;
    let best = NaN;
    let bestR = Infinity;
    for (let k = 0; k <= N; k++) {
      const a = g0 + ((g1 - g0) * k) / N;
      if (d(a) >= 0 && r(a) < bestR) {
        bestR = r(a);
        best = a;
      }
    }
    if (!Number.isFinite(best)) throw new Error("star wheel: the jumper's roller finds no place on the star");
    // refine toward the infeasible neighbour, where the roller touches
    const h = (g1 - g0) / N;
    for (const dir of [1, -1]) {
      const b = best + dir * h;
      if ((dir > 0 ? b > g1 : b < g0) || d(b) >= 0) continue;
      let lo = best;
      let hi = b;
      for (let k = 0; k < 50; k++) {
        const m = (lo + hi) / 2;
        if (d(m) >= 0) lo = m;
        else hi = m;
      }
      if (r(lo) < bestR) {
        best = lo;
        bestR = r(lo);
      }
    }
    return best;
  };
  let psi = 0;
  let fing = 0;
  let snapAt = -1;
  let crest = NaN;
  let base = 0;
  for (let i = 0; i <= n; i++) {
    const th = i * step;
    fing = pushed(fing, th);
    if (snapAt < 0 && fing - base >= pitch / 2) {
      snapAt = th;
      crest = th;
    }
    if (snapAt >= 0 && Number.isFinite(snapAt)) {
      const x = Math.min(1, (th - snapAt) / s.snap);
      const law = base + pitch / 2 + (pitch / 2) * (x - Math.sin(TAU * x) / TAU);
      psi = Math.max(psi, law, fing);
      if (x >= 1) {
        base += pitch;
        psi = base;
        snapAt = Infinity;
      }
    } else psi = Math.max(psi, fing);
    star[i] = psi;
    push[i] = fing;
    jumper[i] = roll(psi);
  }
  const j0 = jumper[0]!;
  for (let i = 0; i <= n; i++) jumper[i] = ((jumper[i]! - j0) * 180) / Math.PI;
  return { star, push, jumper, step, crest };
}
