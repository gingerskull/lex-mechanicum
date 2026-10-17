// World pose of a solid at a solved phase: its body's pose composed with its local pose, or the solid's own motion
// (belt-driven pulleys, the oscillating drive's crank and link). Shared by assembly, checks, packaging and renderer.
import { xfPose, type Pose, type Vec2 } from "../core/geom";
import { circleX } from "../core/vec";
import type { Solid } from "../hardware/solid";
import { poseOf } from "../model/pose";
import type { MechanismModel, Part, Solved } from "../model/types";

export type PartIndex = Record<string, Part>;

export const indexParts = (model: MechanismModel): PartIndex => Object.fromEntries(model.parts.map((p) => [p.id, p]));

export function bodyPose(parts: PartIndex, body: string, s: Solved): Pose | null {
  if (body === "ground") return [0, 0, 0];
  const p = parts[body];
  return p ? poseOf(p, s) : null;
}

/** True when the body never moves relative to ground. */
export const isGround = (parts: PartIndex, body: string): boolean => body === "ground" || !!parts[body]?.fixed;

/** The phase direction of the input at u: +1 when the input angle grows. */
function direction(model: MechanismModel, parts: PartIndex, body: string, u: number): 1 | -1 {
  const a = bodyPose(parts, body, model.solve(u - 1e-3));
  const b = bodyPose(parts, body, model.solve(u + 1e-3));
  return a && b && b[2] < a[2] ? -1 : 1;
}

export function solidPose(model: MechanismModel, parts: PartIndex, t: Pick<Solid, "body" | "at" | "motion">, s: Solved, u: number): Pose | null {
  const B = bodyPose(parts, t.body, s);
  if (!B) return null;
  const m = t.motion;
  if (!m) return xfPose(B, t.at);
  if (m.type === "geared") return [m.around[0], m.around[1], B[2] * m.ratio + t.at[2]];
  if (m.type === "rolling") {
    const travel = B[0] * m.axis[0] + B[1] * m.axis[1];
    return [m.around[0], m.around[1], -travel / m.r + t.at[2]];
  }
  // oscillating drive: the rocker arm tip on the input, the crank pin on the motor circle, the link between them
  const th = B[2] + m.off;
  const T: Vec2 = [m.pivot[0] + m.rho * Math.cos(th), m.pivot[1] + m.rho * Math.sin(th)];
  const side = direction(model, parts, t.body, u);
  const C = circleX(m.motor, m.r, T, m.L, side);
  const P: Pose =
    m.type === "crank" ? [m.motor[0], m.motor[1], Math.atan2(C[1] - m.motor[1], C[0] - m.motor[0])] : [C[0], C[1], Math.atan2(T[1] - C[1], T[0] - C[0])];
  return xfPose(P, t.at);
}
