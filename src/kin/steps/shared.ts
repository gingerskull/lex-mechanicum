// Helpers the solve blocks share: a step's named outputs (a name, or keyed names), writing points and values to them, a
// name check on an input, a body's turn about a line, an angle about an axis and a cam law by its name.
import { type BlockCtx, KinError } from "../ctx";
import type { SolveStep } from "../types";
import { type Vec3, v3, xf } from "../math";
import type { CamLaw } from "../blocks/cam";

export function outName(step: SolveStep, key?: string): string | undefined {
  const o = step.out;
  if (typeof o === "string") return key === undefined || key === "" ? o : undefined;
  if (Array.isArray(o)) return undefined;
  return key ? o?.[key] : undefined;
}

export function outPoint(c: BlockCtx, step: SolveStep, p: Vec3, key?: string): void {
  const n = outName(step, key);
  if (n) c.setPt(n, p);
}

export function outVal(c: BlockCtx, step: SolveStep, v: number, key?: string): void {
  const n = outName(step, key);
  if (n) c.setVal(n, v);
}

export const str = (v: unknown, what: string): string => {
  if (typeof v !== "string") throw new KinError(`${what} must be a name`);
  return v;
};

/** Rotate a body (mounted on the ground) about the line through `center` with `axis`, relative to the reference pose. */
export const spin = (c: BlockCtx, body: string, center: Vec3, axis: Vec3, ang: number): void => c.setXf(body, xf.rotAbout(center, axis, ang));

/** Angle of vector d about unit axis a, from the unit direction e0 (right-handed). */
export const angleFrom = (d: Vec3, a: Vec3, e0: Vec3): number => Math.atan2(v3.dot(a, v3.cross(e0, d)), v3.dot(e0, d));

export const lawOf = (l: string | undefined): CamLaw => (l === "harmonic" || l === "poly345" || l === "uniform" || l === "modsine" ? l : "cycloidal");
