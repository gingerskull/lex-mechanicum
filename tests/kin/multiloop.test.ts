// A second loop that starts on a body the first loop places (a Watt six-bar), and the output and claim forms the
// straight-line and six-bar records read: a point projected on a direction, a datum, a distance from a point, an
// absolute angle, a point's speed, a stat over a window of the cycle and on the absolute value.
import { describe, expect, it } from "vitest";
import { dyadRRR, Kinematics, TAU, verifyK1, type Kin, type Vec3 } from "../../src/kin";
import { checkClaims, type Claim } from "../../src/checks/claims";
import { crankRocker, fourBar } from "./fixtures";

const D = Math.PI / 180;

/** The crank-rocker with a second arm on its rocker (90° clockwise of O4B, 40 mm) driving a dyad to a second rocker. */
function wattSixBar(): Kin {
  const k = crankRocker();
  const B = k.joints.find((j) => j.id === "B")!.at as Vec3;
  const O4: Vec3 = [100, 0, 0];
  const r = Math.hypot(B[0] - O4[0], B[1] - O4[1]);
  const C: Vec3 = [O4[0] + ((B[1] - O4[1]) * 40) / r, O4[1] - ((B[0] - O4[0]) * 40) / r, 0];
  const O6: Vec3 = [190, 30, 0];
  const Dp = dyadRRR(C, O6, 70, 40).roots[0];
  return {
    ...k,
    bodies: [...k.bodies, { id: "coupler2", role: "link" }, { id: "rocker2", role: "output", at: { joint: "O6" } }],
    joints: [
      ...k.joints,
      { id: "C", type: "revolute", a: "rocker", b: "coupler2", at: C, axis: [0, 0, 1] },
      { id: "D", type: "revolute", a: "coupler2", b: "rocker2", at: Dp, axis: [0, 0, 1] },
      { id: "O6", type: "revolute", a: "ground", b: "rocker2", at: O6, axis: [0, 0, 1] },
    ],
    params: [...(k.params ?? []), { id: "e", value: 70 }, { id: "f", value: 40 }],
    solve: [...k.solve, { block: "dyad", id: "loop2", in: { a: "C", b: "O6", ra: "e", rb: "f" }, branch: "left", out: "D" }],
    outputs: [
      { id: "rocker2-angle", of: "rocker2", kind: "angle", unit: "deg" },
      { id: "rocker2-abs", of: "rocker2", kind: "angle", unit: "deg", absolute: true },
      { id: "d-x", of: "D", kind: "position", unit: "mm", axis: [1, 0, 0] },
      { id: "d-up", of: "D", kind: "position", unit: "mm", axis: [0, 1, 0], datum: 10 },
      { id: "c-d", of: "C", kind: "position", unit: "mm", from: "D" },
      { id: "d-speed", of: "D", kind: "speed-ratio", unit: "%" },
    ],
  };
}

describe("a second loop on a body the first loop places", () => {
  it("composes without the numeric fallback, K1 residual < 1e-9", () => {
    const K = new Kinematics(wattSixBar());
    const r = verifyK1(K);
    expect(r.maxResidual).toBeLessThan(1e-9);
    expect(r.ok).toBe(true);
    expect(r.fallback).toEqual([]);
  });

  it("projects, offsets and measures points; absolute angles follow the link's direction", () => {
    const K = new Kinematics(wattSixBar());
    for (const u of [0, 1, 2.5, 4]) {
      const p = K.pose(u);
      const Dp = p.points.get("D")!;
      const C = p.points.get("C")!;
      const O6 = p.points.get("O6")!;
      expect(p.outputs["d-x"]).toBeCloseTo(Dp[0], 9);
      expect(p.outputs["d-up"]).toBeCloseTo(Dp[1] - 10, 9);
      expect(p.outputs["c-d"]).toBeCloseTo(70, 9);
      const abs = Math.atan2(Dp[1] - O6[1], Dp[0] - O6[0]) / D;
      const got = p.outputs["rocker2-abs"] as number;
      expect(Math.abs(((got - abs + 540) % 360) - 180)).toBeLessThan(1e-7);
      expect(Math.hypot(C[0] - 100, C[1])).toBeCloseTo(40, 9);
    }
  });

  it("claims: a window of the cycle, the absolute value and a point's speed as a share of its mean", () => {
    const K = new Kinematics(wattSixBar());
    const n = 720;
    const xs: number[] = [];
    for (let i = 0; i < n; i++) xs.push(K.pose((i / n) * TAU).outputs["d-x"] as number);
    const win = xs.filter((_, i) => (i / n) * 360 <= 90);
    const claims: Claim[] = [
      { text: "window", output: "d-x", stat: "max", value: Math.max(...win), tol: 1e-9, span: [0, 90] },
      { text: "abs", output: "d-up", stat: "max", value: Math.max(...xs.map(() => 0)), tol: Infinity, abs: true },
      { text: "mean speed", output: "d-speed", stat: "mean", value: 100, tol: 1e-9 },
    ];
    const res = checkClaims(K, claims, K.kin.outputs ?? []);
    expect(res.map((r) => r.status)).toEqual(["ok", "ok", "ok"]);
    expect(res[1]!.got!).toBeGreaterThanOrEqual(0);
  });
});

describe("an oscillating input that turns back near a toggle of the closure", () => {
  it("stays on the declared branch (Chebyshev: the midpoint keeps to its line over the whole swing)", () => {
    // ground 120, rockers 150, coupler 60; the input rocker's low limit is a toggle of the far side
    for (const root of [0, 1] as const) {
      const k = fourBar({ d: 120, a: 150, c: 60, b: 150, theta0: 63.43, root, driver: { kind: "oscillating", lo: 36.87, hi: 90 } });
      const K = new Kinematics(k);
      const ref = K.referencePose();
      const mid = (p: ReturnType<typeof K.pose>) => {
        const A = p.points.get("A")!, B = p.points.get("B")!;
        return [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      };
      const y0 = mid(ref)[1]!;
      if (Math.abs(y0 - 120) > 1) continue; // the uncrossed branch is not the straight-line one
      for (let i = 0; i < 360; i++) expect(Math.abs(mid(K.pose((i / 360) * TAU))[1]! - 120)).toBeLessThan(0.5);
      return;
    }
    throw new Error("neither branch is the crossed one");
  });
});
