// The blocks and composition features the planar linkages (R1) added: lerp, line-crossing, target-path, speed-ratio
// outputs computed with the pose, a point's position along an axis or from a point, and drivers the cycle sets.
import { describe, expect, it } from "vitest";
import { Kinematics, TAU, verifyK1, v3 } from "../../src/kin";
import { roundedSquareAt } from "../../src/kin/registry";
import type { Kin } from "../../src/kin/types";
import { recordById } from "../../src/catalog";
import { crankRocker } from "./fixtures";

const D = Math.PI / 180;

describe("target-path", () => {
  it("a rounded square starts at the middle of its right side and closes on itself", () => {
    expect(roundedSquareAt(25, 90, 50, 8, 0)).toEqual([50, 90, 0]);
    const end = roundedSquareAt(25, 90, 50, 8, 1 - 1e-9);
    expect(v3.dist(end, [50, 90, 0])).toBeLessThan(1e-6);
  });

  it("a rounded square moves at constant speed and stays on its outline", () => {
    const n = 2000;
    const steps: number[] = [];
    let prev = roundedSquareAt(0, 0, 50, 8, 0);
    for (let i = 1; i <= n; i++) {
      const p = roundedSquareAt(0, 0, 50, 8, i / n);
      steps.push(v3.dist(p, prev));
      prev = p;
      // inside the square, never past its sides
      expect(Math.max(Math.abs(p[0]), Math.abs(p[1]))).toBeLessThanOrEqual(25 + 1e-9);
    }
    const perimeter = 4 * (50 - 16) + 2 * Math.PI * 8;
    expect(Math.max(...steps)).toBeCloseTo(perimeter / n, 4);
    expect(Math.min(...steps)).toBeGreaterThan((perimeter / n) * 0.99);
  });
});

/** A five-bar whose tip follows a rounded square by inverse kinematics, both cranks set by the cycle. */
function pathFiveBar(): Kin {
  const P: [number, number, number] = [50, 90, 0];
  const elbow = (O: [number, number, number], side: number): [number, number, number] => {
    const d = v3.sub(P, O);
    const L = v3.len(d);
    const x = (60 * 60 - 80 * 80 + L * L) / (2 * L);
    const h = Math.sqrt(60 * 60 - x * x);
    const e = v3.mul(d, 1 / L);
    return [O[0] + e[0] * x - side * e[1] * h, O[1] + e[1] * x + side * e[0] * h, 0];
  };
  const A = elbow([0, 0, 0], 1);
  const B = elbow([50, 0, 0], -1);
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "left", role: "driver", at: { joint: "O1" } },
      { id: "right", role: "driver", at: { joint: "O2" } },
      { id: "dl", role: "link", at: { joint: "A" } },
      { id: "dr", role: "output", at: { joint: "B" } },
    ],
    joints: [
      { id: "O1", type: "revolute", a: "ground", b: "left", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "O2", type: "revolute", a: "ground", b: "right", at: [50, 0, 0], axis: [0, 0, 1] },
      { id: "A", type: "revolute", a: "left", b: "dl", at: A, axis: [0, 0, 1] },
      { id: "B", type: "revolute", a: "right", b: "dr", at: B, axis: [0, 0, 1] },
      { id: "P", type: "revolute", a: "dl", b: "dr", at: P, axis: [0, 0, 1] },
    ],
    params: [],
    drivers: [
      { id: "left", joint: "O1", kind: "manual", range: [90, 180], default: Math.atan2(A[1], A[0]) / D, cycle: { from: "ik" } },
      { id: "right", joint: "O2", kind: "manual", range: [0, 90], default: Math.atan2(B[1], B[0] - 50) / D, cycle: { from: "ik" } },
    ],
    solve: [
      { block: "target-path", id: "target", in: { shape: "rounded-square", cx: 25, cy: 90, side: 50, corner: 8 }, out: "P" },
      { block: "five-bar", id: "ik", in: { mode: "ik", A1: "O1", A2: "O2", l1: 60, l2: 60, l3: 80, l4: 80, target: "P", elbow1: 1, elbow2: -1, cranks: ["left", "right"], joints: ["O1", "O2"] }, out: { E1: "A", E2: "B" } },
    ],
    outputs: [{ id: "left-angle", of: "left", kind: "angle" }],
  } as Kin;
}

describe("a path drives the linkage (target-path and inverse kinematics)", () => {
  it("the tip follows the target and K1 holds with both cranks set by the cycle", () => {
    const k = new Kinematics(pathFiveBar());
    const r = verifyK1(k);
    expect(r.maxResidual).toBeLessThan(1e-9);
    for (const f of [0, 0.2, 0.55, 0.9]) {
      const P = k.pose(f * TAU).points.get("P")!;
      expect(v3.dist(P, roundedSquareAt(25, 90, 50, 8, f))).toBeLessThan(1e-9);
    }
  });

  it("a driver the cycle sets reads its value off the pose: its crank's absolute angle", () => {
    const k = new Kinematics(pathFiveBar());
    for (const f of [0.1, 0.4, 0.7]) {
      const p = k.pose(f * TAU);
      const A = p.points.get("A")!;
      expect(p.outputs["left-angle"]).toBeCloseTo(Math.atan2(A[1], A[0]) / D, 6);
    }
  });
});

describe("line-crossing", () => {
  // the record's antiparallelogram: long cranks (100) on a short ground (40), the crossed closure
  const kin = (): Kin => recordById("antiparallelogram")!.kin as unknown as Kin;

  it("an antiparallelogram's crossing runs on the ellipse with foci at the ground pivots, change points included", () => {
    const k = new Kinematics(kin());
    for (let i = 0; i <= 72; i++) {
      const X = k.pose((i / 72) * TAU).points.get("X")!;
      expect(v3.dist(X, [0, 0, 0]) + v3.dist(X, [40, 0, 0])).toBeCloseTo(100, 6);
    }
  });

  it("without a sum, lines that run together do not cross", () => {
    const base = crankRocker();
    const k = new Kinematics({ ...base, solve: [...base.solve, { block: "line-crossing", id: "X", in: { a1: [0, 0, 0], a2: [1, 0, 0], b1: [0, 5, 0], b2: [7, 5, 0] }, out: "X" }] } as Kin);
    expect(() => k.pose(0.3)).toThrow(/parallel/);
  });
});

describe("lerp, speed ratios and positions", () => {
  it("lerp places a point along the line through two others", () => {
    const base = crankRocker();
    const k = new Kinematics({ ...base, solve: [...base.solve, { block: "lerp", id: "far", in: { a: "O2", b: "A", t: 2 }, out: "Q" }] } as Kin);
    const p = k.pose(1.3);
    const A = p.points.get("A")!;
    expect(v3.dist(p.points.get("Q")!, v3.mul(A, 2))).toBeLessThan(1e-9);
  });

  it("a body's speed ratio is its turn per degree of input; a point's over another point is their speed ratio", () => {
    const base = crankRocker();
    const k = new Kinematics({
      ...base,
      solve: [...base.solve, { block: "lerp", id: "far", in: { a: "O2", b: "A", t: 2 }, out: "Q" }],
      outputs: [
        { id: "rocker-rate", of: "rocker", kind: "speed-ratio" },
        { id: "rocker-angle", of: "rocker", kind: "angle" },
        { id: "far-over-pin", of: "Q", kind: "speed-ratio", over: "A" },
        { id: "A-x", of: "A", kind: "position", axis: [1, 0, 0] },
        { id: "A-reach", of: "A", kind: "position", from: "O2" },
      ],
    } as Kin);
    const u = 1.1, h = 1e-5;
    const a0 = k.pose(u - h).outputs["rocker-angle"] as number;
    const a1 = k.pose(u + h).outputs["rocker-angle"] as number;
    const p = k.pose(u);
    expect(p.outputs["rocker-rate"] as number).toBeCloseTo((a1 - a0) / ((2 * h) / D), 3);
    expect(p.outputs["far-over-pin"] as number).toBeCloseTo(2, 6);
    expect(p.outputs["A-x"] as number).toBeCloseTo(p.points.get("A")![0], 9);
    expect(p.outputs["A-reach"] as number).toBeCloseTo(30, 9);
  });
});
