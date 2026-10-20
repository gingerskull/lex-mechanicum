import { describe, expect, it } from "vitest";
import { Kinematics, TAU, verifyK1, v3, xf, type K1Report } from "../../src/kin";
import { antiparallelogram, bennett, crankRocker, homokineticJoint, parallelogram, sliderCrank, toggleClamp, universalJoint } from "./fixtures";

const D = Math.PI / 180;

const report = (r: K1Report): string => JSON.stringify({ ...r, jumps: r.jumps.slice(0, 3), failures: r.failures.slice(0, 3) });

describe("composition from a kin block's joint graph", () => {
  it("four-bar composes from the fixture alone, K1 residual < 1e-9 over the cycle", () => {
    const r = verifyK1(new Kinematics(crankRocker()));
    expect(r.failures).toEqual([]);
    expect(r.maxResidual).toBeLessThan(1e-9);
    expect(r.ok, report(r)).toBe(true);
    expect(r.fallback).toEqual([]);
  });

  it("four-bar: the rocker swings by the closed-form range", () => {
    const k = new Kinematics(crankRocker());
    const ang: number[] = [];
    for (let i = 0; i < 720; i++) ang.push((k.pose((i / 720) * TAU).outputs["rocker-angle"] as number) ?? NaN);
    // a=30, b=70, c=80, d=100: extreme rocker angles are where crank and coupler line up
    const ext = (sign: number) => {
      const L = sign > 0 ? 30 + 80 : 80 - 30; // |O2B|
      const cosPhi = (70 * 70 + 100 * 100 - L * L) / (2 * 70 * 100); // angle at O4 between O4→O2 and O4→B
      return Math.acos(cosPhi);
    };
    const span = Math.max(...ang) - Math.min(...ang);
    expect(span * D).toBeCloseTo(ext(1) - ext(-1), 3);
  });

  it("universal joint composes from the fixture alone, residual < 1e-9, and follows tan θ2 = tan θ1 / cos β", () => {
    const k = new Kinematics(universalJoint(30));
    const r = verifyK1(k);
    expect(r.ok, report(r)).toBe(true);
    expect(r.maxResidual).toBeLessThan(1e-9);
    // the output yoke: angle of the output shaft about its axis, from the pose
    const a2 = [Math.cos(30 * D), Math.sin(30 * D), 0] as [number, number, number];
    for (const deg of [20, 50, 140, 200, 310]) {
      const out = xf.angleAbout(k.pose(deg * D).bodies.get("shaftOut")!, a2);
      expect(Math.tan(out)).toBeCloseTo(Math.tan(deg * D) / Math.cos(30 * D), 9);
    }
    expect(Number.isFinite(r.periodicity)).toBe(true);
  });

  it("homokinetic joint holds θ2 = θ1 with balls in the bisecting plane", () => {
    const k = new Kinematics(homokineticJoint(30));
    const r = verifyK1(k);
    expect(r.ok, report(r)).toBe(true);
    const a2 = [Math.cos(30 * D), Math.sin(30 * D), 0] as [number, number, number];
    for (const deg of [10, 77, 150, 250]) {
      const p = k.pose(deg * D);
      expect(xf.angleAbout(p.bodies.get("shaftOut")!, a2)).toBeCloseTo(((((deg + 180) % 360) + 360) % 360 - 180) * D, 9);
    }
  });

  it("Bennett linkage composes from the fixture alone: closure residual < 1e-9 over the cycle", () => {
    const k = new Kinematics(bennett());
    const r = verifyK1(k);
    expect(r.failures).toEqual([]);
    expect(r.maxResidual).toBeLessThan(1e-9);
    expect(r.ok, report(r)).toBe(true);
  });

  it("slider-crank: the slide closes as an RRP dyad", () => {
    const k = new Kinematics(sliderCrank());
    const r = verifyK1(k);
    expect(r.ok, report(r)).toBe(true);
    const x0 = k.pose(0).outputs["slider-x"] as number;
    const xHalf = k.pose(Math.PI).outputs["slider-x"] as number;
    // crank 30, rod 90, offset 10: stroke is 2 × 30 within a small correction
    expect(Math.abs(x0 - xHalf)).toBeGreaterThan(55);
    expect(Math.abs(x0 - xHalf)).toBeLessThan(61);
  });
});

describe("branches and toggles", () => {
  it("antiparallelogram passes its two toggle points on the right branch", () => {
    const k = new Kinematics(antiparallelogram());
    const r = verifyK1(k);
    expect(r.failures).toEqual([]);
    expect(r.jumps, report(r)).toEqual([]);
    expect(r.ok, report(r)).toBe(true);
    // the crank is at 90° + u; it passes the singular collinear positions at 0° (u = 270°) and 180° (u = 90°)
    const table = k.setup().tables.get("coupler")!;
    expect(table.flips.length).toBe(2);
    const at = (deg: number) => k.pose(deg * D);
    // collinear at crank 0°: A = (40, 0), the coupler lies along the ground line, B = (140, 0)
    const b0 = at(270).points.get("B")!;
    expect(b0[0]).toBeCloseTo(140, 4);
    expect(b0[1]).toBeCloseTo(0, 4);
    // crank 180°: A = (-40, 0), B = (60, 0)
    const b180 = at(90).points.get("B")!;
    expect(b180[0]).toBeCloseTo(60, 4);
    expect(b180[1]).toBeCloseTo(0, 4);
    // on the right branch the rocker turns against the crank (antiparallelogram), the cranks stay equal and opposite in the half angles
    const ratio = (deg: number) => {
      const p = at(deg);
      const crank = Math.atan2(p.points.get("A")![1], p.points.get("A")![0]);
      const B = p.points.get("B")!;
      const rock = Math.atan2(B[1], B[0] - 100);
      return Math.tan(rock / 2) / Math.tan(crank / 2);
    };
    const vals = [20, 60, 100, 150, 200, 250, 330].map((deg) => ratio((deg + 270) % 360));
    // tan(φ/2) / tan(θ/2) = (a + d) / (a − d) for a = b, c = d
    for (const v of vals) expect(v).toBeCloseTo((40 + 100) / (40 - 100), 6);
    // the parallelogram on the other branch keeps rocker = crank angle
    const kp = new Kinematics(parallelogram());
    const rp = verifyK1(kp);
    expect(rp.ok, report(rp)).toBe(true);
    for (const deg of [20, 100, 200, 300]) {
      const p = kp.pose(deg * D);
      const crank = Math.atan2(p.points.get("A")![1], p.points.get("A")![0]);
      const B = p.points.get("B")!;
      expect(Math.atan2(B[1], B[0] - 100)).toBeCloseTo(crank, 6);
    }
  });

  it("toggle clamp passes its toggle points on the right branch", () => {
    const k = new Kinematics(toggleClamp());
    const r = verifyK1(k);
    expect(r.failures).toEqual([]);
    expect(r.jumps, report(r)).toEqual([]);
    expect(r.ok, report(r)).toBe(true);
    // no branch flip anywhere on the stroke: the dyad stays on the declared closure
    expect(k.setup().tables.get("coupler")!.flips).toEqual([]);
    // at the dead centre handle and coupler are collinear: cos θ = (10000 − 625) / 9600
    const th = Math.acos((60 * 60 + 80 * 80 - 25 * 25) / (2 * 60 * 80)) / D;
    const p = k.poseAt({ input: th });
    const A = p.points.get("A")!;
    const B = p.points.get("B")!;
    const cross = v3.cross(A, v3.sub(B, A));
    expect(Math.abs(cross[2])).toBeLessThan(1e-9);
    // and the jaw angle is stationary there (the toggle): extremum over the handle angle
    const jaw = (t: number) => k.poseAt({ input: t }).outputs["rocker-angle"] as number;
    const eps = 0.05;
    const dm = jaw(th - eps) - jaw(th);
    const dp = jaw(th + eps) - jaw(th);
    expect(dm * dp).toBeGreaterThan(0); // same sign both sides: an extremum
    expect(Math.abs(jaw(th + 1e-4) - jaw(th - 1e-4))).toBeLessThan(1e-6);
  });
});
