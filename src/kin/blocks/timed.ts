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
  // the jumper's roller rides the star where its spring holds it
  const roll = (psi: number): number => rideAngle(starOutline(s, (psi * Math.PI) / 180), s.jumper, s.arm, s.roller, s.swing, s.c);
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

/**
 * Where a sprung arm (a jumper, a pawl) rests on an outline: over its swing (`swing`, deg about the pivot from the world
 * x), the angle (radians) that brings its roller (radius `roller`, 0 for a knife edge) nearest the outline's `centre`
 * while it stays outside the outline: the spring presses it in until it touches.
 */
export function rideAngle(poly: [number, number][], pivot: readonly [number, number] | readonly number[], arm: number, roller: number, swing: readonly number[], centre: readonly number[]): number {
  const g0 = (swing[0]! * Math.PI) / 180;
  const g1 = (swing[1]! * Math.PI) / 180;
  const at = (a: number): [number, number] => [pivot[0]! + arm * Math.cos(a), pivot[1]! + arm * Math.sin(a)];
  const d = (a: number) => polyDist(poly, ...at(a)) - roller;
  const r = (a: number) => Math.hypot(at(a)[0] - centre[0]!, at(a)[1] - centre[1]!);
  const N = 400;
  let best = NaN;
  let bestR = Infinity;
  for (let k = 0; k <= N; k++) {
    const a = g0 + ((g1 - g0) * k) / N;
    if (d(a) >= -1e-9 && r(a) < bestR) {
      bestR = r(a);
      best = a;
    }
  }
  if (!Number.isFinite(best)) throw new Error("an arm finds no place on its outline within its swing");
  // refine toward the infeasible neighbour, where it touches
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
}

export interface RatchetSpec {
  n: number;
  root: number;
  tip: number;
  /** The steep face's and the back slope's spans, deg; a tip at `tip0` + k·360/n at rest. */
  face: number;
  back: number;
  tip0: number;
}

/**
 * A ratchet wheel's sawtooth outline about the origin, turned counter-clockwise by w (rad): each tooth rises over its
 * steep face (counter-clockwise, from the root at tip − face to the tip) and falls over its back slope to the next root.
 */
export function sawOutline(s: RatchetSpec, w: number): [number, number][] {
  const out: [number, number][] = [];
  const p = TAU / s.n;
  const D = Math.PI / 180;
  for (let k = 0; k < s.n; k++) {
    const t = s.tip0 * D + k * p + w;
    out.push([s.root * Math.cos(t - s.face * D), s.root * Math.sin(t - s.face * D)]);
    out.push([s.tip * Math.cos(t), s.tip * Math.sin(t)]);
  }
  return out;
}

/**
 * The wheel of a lever ratchet, over a cycle of the lever (u from 0 to 2π: forward from its low end for u < π, back for
 * u >= π): after `lost` degrees of lost motion the driving pawl pushes the wheel with the lever, one pitch per stroke;
 * on the return the wheel rests. Degrees.
 */
export function ratchetWheel(u: number, lever: number, lo: number, lost: number, pitch: number): number {
  const turns = Math.floor(u / TAU);
  const v = u - turns * TAU;
  const step = v < Math.PI ? Math.max(0, Math.min(pitch, lever - lo - lost)) : pitch;
  return turns * pitch + step;
}

/** A polygon turned by a about a centre. */
const turnPoly = (poly: readonly (readonly [number, number])[], c: readonly [number, number], a: number): [number, number][] => {
  const cs = Math.cos(a);
  const sn = Math.sin(a);
  return poly.map(([x, y]) => [c[0] + (x - c[0]) * cs - (y - c[1]) * sn, c[1] + (x - c[0]) * sn + (y - c[1]) * cs]);
};

/** How far two polygons overlap (mm, 0 when apart): the deepest vertex of either inside the other. */
export function overlapDepth(a: [number, number][], b: [number, number][]): number {
  let d = 0;
  for (const [x, y] of a) d = Math.max(d, -polyDist(b, x, y));
  for (const [x, y] of b) d = Math.max(d, -polyDist(a, x, y));
  return d;
}

export interface EscapeGeometry {
  /** The escape wheel's outline about its centre `wc` at rest (2D, the escapement's plane), turning positive forward. */
  wheel: [number, number][];
  wc: [number, number];
  /** The pallets' outlines at rest and the arbor `ac` they turn about. */
  pallets: [number, number][][];
  ac: [number, number];
  /** Teeth: the wheel's pitch is 2π/n. */
  n: number;
  /** The wheel's sense of turn: +1 counter-clockwise in the plane's (x, y). */
  sense: 1 | -1;
}

/**
 * A geometric escapement, time-stepped: the pallets swing as `pallet(u)` (radians about the arbor, u the cycle phase);
 * the wheel is urged forward by its train and goes forward until a tooth meets a pallet (an instant drop), and is pushed
 * back where a pallet moves into a tooth (the recoil). Run until periodic; returns the wheel's angle (radians, forward
 * positive) over one cycle in `steps` samples, its advance per cycle, and the recoil of the beat each sample lies in.
 */
export function simulateEscape(g: EscapeGeometry, pallet: (u: number) => number, steps = 1440): { wheel: Float64Array; recoil: Float64Array; advance: number; beats: number[]; recoils: number[] } {
  const pitch = TAU / g.n;
  const tol = 1e-4;
  const free = (w: number, p: number) => {
    const wp = turnPoly(g.wheel, g.wc, g.sense * w);
    return g.pallets.every((pl) => overlapDepth(wp, turnPoly(pl, g.ac, p)) <= tol);
  };
  const settle = (w: number, p: number): number => {
    if (!free(w, p)) {
      // a pallet moved into a tooth: back the wheel off until it is clear (recoil)
      let lo = w;
      let hi = w;
      let k = 0;
      while (!free(lo, p) && k++ < 400) lo -= 0.0005;
      for (let i = 0; i < 40; i++) {
        const m = (lo + hi) / 2;
        if (free(m, p)) lo = m;
        else hi = m;
      }
      return lo;
    }
    // urged forward: on until a tooth meets a pallet (the drop is instant)
    let lo = w;
    let hi = w + 0.002;
    let k = 0;
    while (free(hi, p) && k++ < 2 * pitch / 0.002) {
      lo = hi;
      hi += 0.002;
    }
    for (let i = 0; i < 40; i++) {
      const m = (lo + hi) / 2;
      if (free(m, p)) lo = m;
      else hi = m;
    }
    return lo;
  };
  let w = settle(0, pallet(0));
  const cycles = 3;
  const wheel = new Float64Array(steps + 1);
  for (let c = 0; c < cycles; c++) {
    for (let i = 0; i <= steps; i++) {
      const u = (i / steps) * TAU;
      w = settle(w, pallet(u));
      if (c === cycles - 1) wheel[i] = w;
    }
  }
  const advance = wheel[steps]! - wheel[0]!;
  // per beat (half cycle): the wheel's net step, and its recoil (its peak after the drop less where it ends)
  const half = steps / 2;
  const beats: number[] = [];
  const recoils: number[] = [];
  const recoil = new Float64Array(steps + 1);
  for (const [a, b] of [[0, half], [half, steps]] as const) {
    let peak = -Infinity;
    let rc = 0;
    for (let i = a; i <= b; i++) {
      peak = Math.max(peak, wheel[i]!);
      rc = Math.max(rc, peak - wheel[i]!);
    }
    beats.push(wheel[b]! - wheel[a]!);
    recoils.push(rc);
    for (let i = a; i <= b; i++) recoil[i] = rc;
  }
  void pitch;
  return { wheel, recoil, advance, beats, recoils };
}
