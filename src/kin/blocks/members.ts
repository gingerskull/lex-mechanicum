// Screw and nut, convey (belt and chain travel) and the pseudo-rigid-body flexure.
import { TAU } from "../math";

/** Advance of a nut for a screw turn: lead per turn, sign by hand (right-hand: positive turn advances along +axis). */
export const screwAdvance = (lead: number, theta: number, hand: "right" | "left" = "right"): number =>
  (hand === "right" ? 1 : -1) * (lead * theta) / TAU;

/** Differential screw: two threads of leads l1 and l2 on one shaft; the second nut moves (l1 − l2) per turn relative to the first. */
export const differentialAdvance = (l1: number, l2: number, theta: number): number => ((l1 - l2) * theta) / TAU;

export interface ObroundPath {
  /** Sprocket centre distance C and pitch radius r: two arcs and two straight spans. */
  C: number;
  r: number;
}

export const pathLength = (p: ObroundPath): number => 2 * p.C + 2 * Math.PI * p.r;

/**
 * Position and heading at arc length s along the closed path: bottom span (0,−r)→(C,−r) heading 0, right arc about
 * (C,0), top span heading π, left arc about (0,0). The belt or chain advances r·Δθ for a sprocket turn Δθ.
 */
export function pathAt(p: ObroundPath, s: number): { x: number; y: number; heading: number } {
  const L = pathLength(p);
  let t = ((s % L) + L) % L;
  const arc = Math.PI * p.r;
  if (t < p.C) return { x: t, y: -p.r, heading: 0 };
  t -= p.C;
  if (t < arc) {
    const a = -Math.PI / 2 + t / p.r;
    return { x: p.C + p.r * Math.cos(a), y: p.r * Math.sin(a), heading: a + Math.PI / 2 };
  }
  t -= arc;
  if (t < p.C) return { x: p.C - t, y: p.r, heading: Math.PI };
  t -= p.C;
  const a = Math.PI / 2 + t / p.r;
  return { x: p.r * Math.cos(a), y: p.r * Math.sin(a), heading: a + Math.PI / 2 };
}

/** Pitch radius of a sprocket with z teeth for chain pitch p: p / (2 sin(π/z)). */
export const sprocketRadius = (pitch: number, z: number): number => pitch / (2 * Math.sin(Math.PI / z));

/** Pseudo-rigid-body parameters of a small-length flexural pivot loaded at the free end (Howell). */
export const PRB = { gamma: 0.85, kTheta: 2.65, cTheta: 1.24 };

/**
 * End of a cantilever beam of length l whose pseudo-rigid-body pivot turns by Θ (the pivot sits at (1−γ) l from the free end):
 * a = l (1 − γ (1 − cos Θ)) along the beam, b = γ l sin Θ across it. `bend` is Θ over the limit Θmax, in −1..1.
 */
export function flexureEnd(l: number, theta: number, thetaMax = Math.PI / 2, gamma = PRB.gamma): { a: number; b: number; bend: number; beamAngle: number } {
  return {
    a: l * (1 - gamma * (1 - Math.cos(theta))),
    b: gamma * l * Math.sin(theta),
    bend: theta / thetaMax,
    beamAngle: PRB.cTheta * theta,
  };
}

/** Torque at the pivot of the equivalent torsion spring: γ K_Θ E I / l per radian. */
export const flexureStiffness = (E: number, I: number, l: number): number => (PRB.gamma * PRB.kTheta * E * I) / l;

/**
 * A bistable pair of inclined beams (a von Mises truss, pseudo-rigid: two bars of length L0 at θ0, axial stiffness ka)
 * holding a shuttle that a pusher drives through springs of rate ks. The beams push the shuttle with F(y) =
 * 2 ka (L0 − L) y / L, L = √(c² + y²), c = L0 cos θ0; the shuttle stands where ks (q − y) + F(y) = 0, q the pusher's
 * place. Two stable branches (|y| ≥ yFold) meet the pusher's travel; at the fold, where F′(y) = ks, a branch ends and the
 * shuttle snaps to the other.
 */
export function vonMises(o: { L0: number; theta0: number; ka: number; ks: number }) {
  const c = o.L0 * Math.cos(o.theta0);
  const F = (y: number): number => {
    const L = Math.hypot(c, y);
    return (2 * o.ka * (o.L0 - L) * y) / L;
  };
  const q = (y: number): number => y - F(y) / o.ks;
  // the fold: F'(y) = 2 ka (L0 c² / L³ − 1) = ks
  const L3 = (2 * o.ka * o.L0 * c * c) / (o.ks + 2 * o.ka);
  const yFold = Math.sqrt(Math.max(0, Math.cbrt(L3) ** 2 - c * c));
  const qFold = q(yFold);
  /** The shuttle on a branch (+1 the upper, y ≥ yFold; −1 the lower) for a pusher place q (bisection; q is monotonic there). */
  const solve = (qq: number, side: 1 | -1): number => {
    let lo = side > 0 ? yFold : -4 * o.L0;
    let hi = side > 0 ? 4 * o.L0 : -yFold;
    for (let k = 0; k < 80; k++) {
      const m = (lo + hi) / 2;
      if (q(m) < qq) lo = m;
      else hi = m;
    }
    return (lo + hi) / 2;
  };
  return { F, q, yFold, qFold, solve, rest: o.L0 * Math.sin(o.theta0) };
}

/**
 * A roller chain on a sprocket's pitch polygon (chordal action): the chain's advance, in pitches of p, for a turn θ of a
 * sprocket of z teeth whose seated roller stands φ ahead of the span's foot. Within each tooth the seated roller swings
 * through the span's direction, so the chain moves R sin of its angle from the span's normal (R the polygon's
 * circumradius) and a pitch per tooth on the whole: its speed falls to cos(π/z) of its peak once per tooth.
 */
export function chainAdvance(theta: number, z: number, p: number, phi = 0): number {
  const d = TAU / z;
  const R = p / (2 * Math.sin(Math.PI / z));
  const x = theta + phi;
  const k = Math.round(x / d);
  return p * k + R * Math.sin(x - k * d);
}

/** The sprocket turn that gives a chain advance s (the inverse of chainAdvance). */
export function chainTurn(s: number, z: number, p: number, phi = 0): number {
  const d = TAU / z;
  const R = p / (2 * Math.sin(Math.PI / z));
  const k = Math.round(s / p);
  return k * d + Math.asin(Math.max(-1, Math.min(1, (s - p * k) / R))) - phi;
}

/** The chain's speed over its peak at a turn θ: cos of the seated roller's angle from the span's normal. */
export function chainSpeed(theta: number, z: number, phi = 0): number {
  const d = TAU / z;
  const x = theta + phi;
  return Math.cos(x - Math.round(x / d) * d);
}

/**
 * A tackle reeved with one vertical part and `slanted` parts at a fleet offset DX (block and tackle): hauling the fall
 * by h raises the lower block so the rope's length is kept, h = (D0 − D) + slanted (√(DX² + D0²) − √(DX² + D²)), D the
 * pin spacing. Returns the spacing for a haul (bisection; h is monotonic in D) and the shortening of a slanted part.
 */
export function reeve(o: { D0: number; DX: number; slanted: number }) {
  const s = (D: number) => Math.hypot(o.DX, D);
  const haul = (D: number) => o.D0 - D + o.slanted * (s(o.D0) - s(D));
  const spacing = (h: number): number => {
    let lo = 0;
    let hi = o.D0 + h + 1;
    for (let k = 0; k < 80; k++) {
      const m = (lo + hi) / 2;
      if (haul(m) > h) lo = m;
      else hi = m;
    }
    return (lo + hi) / 2;
  };
  return { haul, spacing, slant: (D: number) => s(o.D0) - s(D) };
}

/** The length of an open belt round two wheels of pitch radii r1 and r2 at centre distance C. */
export function openBeltLength(r1: number, r2: number, C: number): number {
  const psi = Math.asin((r1 - r2) / C);
  return 2 * C * Math.cos(psi) + Math.PI * (r1 + r2) + 2 * psi * (r1 - r2);
}

/**
 * A variator (a belt CVT): the pitch radius on wheel 2 that keeps an open belt of length L when wheel 1 runs at r1, and
 * the shift of a movable sheave from its open stop (at rmin) for a pitch radius r: the V of half-angle alpha closes by
 * 2 · (r − rmin) · tan alpha.
 */
export function variatorR2(r1: number, C: number, L: number): number {
  let lo = Math.max(1e-6, r1 - C + 1e-6);
  let hi = r1 + C - 1e-6;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (openBeltLength(r1, m, C) < L) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

export const sheaveShift = (r: number, rmin: number, alphaRad: number): number => 2 * (r - rmin) * Math.tan(alphaRad);
