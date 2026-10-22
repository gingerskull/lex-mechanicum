// The interface a block sees while it runs inside a composition.
import type { KinJoint, SolveStep } from "./types";
import type { Vec3, Xf } from "./math";

export class KinError extends Error {}

export interface BlockCtx {
  readonly step: SolveStep;
  /** Cycle phase (radians) of this pose; 0 while the reference pose is built. */
  readonly u: number;
  /** A number: literal, parameter or value name, or an expression over them. Angles stored as values are degrees. */
  num(v: unknown, what?: string): number;
  /** An angle from `num`, converted from degrees to radians. */
  rad(v: unknown, what?: string): number;
  /** A position: a point or joint name, or a literal [x, y, z?] whose entries may be expressions. */
  vec(v: unknown, what?: string): Vec3;
  /** The same, in the reference configuration. */
  refVec(v: unknown, what?: string): Vec3;
  /** Current and reference world position of a named point or joint. */
  pt(name: string): Vec3;
  refPt(name: string): Vec3;
  joint(id: string): KinJoint;
  /** Joint position and unit axis in the reference configuration. */
  jointAt(id: string): Vec3;
  jointAxis(id: string): Vec3;
  /** Current pose of a body (identity until set); true when the body has one. */
  has(body: string): boolean;
  xf(body: string): Xf;
  setXf(body: string, X: Xf): void;
  setPt(name: string, p: Vec3): void;
  /** Store a named scalar (degrees or mm) for later blocks and outputs. */
  setVal(name: string, v: number): void;
  /** `now` minus its value in the reference pose: 0 in the reference pose itself. `key` is unique within the step. */
  delta(key: string, now: number): number;
  /**
   * Choose one of the two closures of a stateful block. `roots` are [+, −] candidates (as number arrays), `h` is the
   * block's distance from the singular (touching) configuration; the choice follows the branch table so that a
   * pass through a double root stays on the analytic branch.
   */
  root(roots: [number[], number[]], h: number): 0 | 1;
  /** A driver of the record, by id. */
  driver(id: string): import("./types").KinDriver | undefined;
  /** A driver's value (degrees or mm) at another cycle phase, at the current controls (a block that integrates). */
  driverAt(id: string, u: number): number;
  /** The chosen value of a design choice (its default, or the controls' setting). */
  design(id: string): string | undefined;
  /** The design choice or literal `branch` of the step as a side, +1 or −1. */
  declaredSide(): 1 | -1;
  /** Mark that this pose used the numeric fallback. */
  flagFallback(): void;
}

export type BlockFn = (c: BlockCtx, step: SolveStep) => void;
