import { describe, expect, it } from "vitest";
import { crossSlide, linePlane, pendulumAngle, rzeppaBall, turnOnto } from "../../src/kin/blocks/couplings";
import { m3, v3, xf, type Vec3 } from "../../src/kin/math";

const D = Math.PI / 180;
const near = (a: Vec3, b: Vec3, tol = 1e-9) => expect(v3.dist(a, b)).toBeLessThan(tol);

describe("coupling blocks", () => {
  it("cross-slide: the middle body's centre sees both shafts at a right angle and runs a circle of diameter e twice per turn", () => {
    const o1: Vec3 = [0, 0, 0];
    const o2: Vec3 = [28, 0, 0];
    const c0: Vec3 = [28 * Math.cos(30 * D) ** 2, 28 * Math.cos(30 * D) * Math.sin(30 * D), 0];
    const e1: Vec3 = [Math.cos(30 * D), Math.sin(30 * D), 0];
    for (const d of [0, 0.4, 1.3, 2.9, 4.4]) {
      const { c } = crossSlide(o1, o2, [0, 0, 1], c0, e1, d);
      expect(Math.abs(v3.dot(v3.sub(c, o1), v3.sub(c, o2)))).toBeLessThan(1e-9);
      expect(Math.abs(v3.dist(c, [14, 0, 0]) - 14)).toBeLessThan(1e-9);
    }
    // a quarter turn of the shafts carries the centre half way round its orbit
    const a = crossSlide(o1, o2, [0, 0, 1], c0, e1, 0).c;
    const b = crossSlide(o1, o2, [0, 0, 1], c0, e1, Math.PI / 2).c;
    expect(Math.abs(v3.dist(a, b) - 28)).toBeLessThan(1e-9);
  });

  it("line meets plane", () => {
    expect(linePlane([0, 1, 2], [1, 0, 0], [5, 0, 0], [1, 0, 0])).toBeCloseTo(5, 12);
    expect(linePlane([0, 0, 0], [1, 0, 0], [0, 0, 0], [0, 1, 0])).toBeNull();
  });

  it("rzeppa: every ball lies in the bisecting plane, Rp from the centre, and runs ±Rp sin(β/2) along the input axis", () => {
    const beta = 30 * D;
    const a1: Vec3 = [1, 0, 0];
    const n: Vec3 = [Math.cos(beta / 2), Math.sin(beta / 2), 0];
    let lo = Infinity;
    let hi = -Infinity;
    for (let k = 0; k < 360; k++) {
      const q: Vec3 = [0, -Math.sin(k * D), Math.cos(k * D)];
      const b = rzeppaBall([0, 0, 0], a1, n, q, 25);
      expect(Math.abs(v3.dot(b, n))).toBeLessThan(1e-9);
      expect(Math.abs(v3.len(b) - 25)).toBeLessThan(1e-9);
      lo = Math.min(lo, b[0]);
      hi = Math.max(hi, b[0]);
    }
    expect(hi).toBeCloseTo(25 * Math.sin(beta / 2), 6);
    expect(lo).toBeCloseTo(-25 * Math.sin(beta / 2), 6);
  });

  it("conical pendulum: cos φ = g / (L ω²), zero below lift-off", () => {
    expect(pendulumAngle(101.63, 100) / D).toBeCloseTo(30, 1);
    expect(pendulumAngle(133.76, 100) / D).toBeCloseTo(60, 1);
    expect(pendulumAngle(50, 100)).toBe(0);
  });

  it("turnOnto carries one direction onto another, a half turn included", () => {
    const a = v3.unit([1, 2, 3]);
    const b = v3.unit([-2, 1, 0.5]);
    near(xf.dir(turnOnto(a, b), a), b);
    near(xf.dir(turnOnto(a, v3.mul(a, -1)), a), v3.mul(a, -1));
  });

  it("the rotation log keeps the axis's signs at a half turn", () => {
    const axis = v3.unit([0.94, -0.34, 0]);
    const w = m3.log(m3.axisAngle(axis, Math.PI));
    expect(Math.abs(Math.abs(v3.dot(v3.unit(w), axis)) - 1)).toBeLessThan(1e-12);
    expect(v3.len(w)).toBeCloseTo(Math.PI, 12);
  });
});
