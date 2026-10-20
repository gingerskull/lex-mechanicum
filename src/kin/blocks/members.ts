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
