import { describe, expect, it } from "vitest";
import { ease, slotAt, turnOf, type Leg } from "../../src/kin/steps/transfer";
import { D2R, v3, xf, type Vec3 } from "../../src/kin/math";
import { recordById } from "../../src/catalog";
import { Kinematics } from "../../src/kin";
import { verifyK1 } from "../../src/kin/verify";
import type { Kin } from "../../src/kin/types";

const near = (a: Vec3, b: Vec3, tol = 1e-9) => expect(v3.dist(a, b)).toBeLessThan(tol);

// a beam on cranks of radius 20 about O, the pin at A: it translates by the pin's move
const O: Vec3 = [0, 0, 0];
const A: Vec3 = [-20, 0, 0];
const beam = (d: number): Vec3 => v3.sub(xf.apply(xf.rotAbout(O, [0, 1, 0], d * D2R), A), A);

describe("transfer blocks", () => {
  it("ease starts and stops at rest", () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.5)).toBeCloseTo(0.5, 12);
    expect((ease(1e-4) - ease(0)) / 1e-4).toBeLessThan(1e-6);
  });

  it("a part on the beam is carried one diameter over the upper half turn and rests over the lower", () => {
    const legs: Leg[] = [{ carry: true, window: [0, 180] }];
    const from: Vec3 = [-20, 0, 50];
    near(slotAt(from, legs, 0, beam), from);
    near(slotAt(from, legs, 90, beam), [0, 0, 70]);
    near(slotAt(from, legs, 180, beam), [20, 0, 50]);
    for (const d of [200, 270, 359]) near(slotAt(from, legs, d, beam), [20, 0, 50]);
  });

  it("moves run in their windows and hold between them", () => {
    const legs: Leg[] = [
      { carry: false, to: [10, 0, 0], window: [20, 40] },
      { carry: false, to: [10, 10, 0], window: [100, 200] },
    ];
    near(slotAt([0, 0, 0], legs, 10, beam), [0, 0, 0]);
    near(slotAt([0, 0, 0], legs, 30, beam), [5, 0, 0]);
    near(slotAt([0, 0, 0], legs, 60, beam), [10, 0, 0]);
    near(slotAt([0, 0, 0], legs, 150, beam), [10, 5, 0]);
    near(slotAt([0, 0, 0], legs, 300, beam), [10, 10, 0]);
  });

  it("turns count on: the phase wraps, the turn steps", () => {
    expect(turnOf(0)).toEqual({ turn: 0, phase: 0 });
    expect(turnOf(370).turn).toBe(1);
    expect(turnOf(370).phase).toBeCloseTo(10, 9);
    expect(turnOf(-10).turn).toBe(-1);
  });

  it("walking-beam: every ball stands where the next stood after one turn, and K1 holds where they touch", () => {
    const rec = recordById("walking-beam") as { kin: Kin } | undefined;
    expect(rec).toBeDefined();
    const k = new Kinematics(rec!.kin);
    const r = verifyK1(k, { samples: 360 });
    expect(r.failures).toEqual([]);
    expect(r.maxResidual).toBeLessThan(1e-9);
    expect(r.periodicity).toBeLessThan(1e-6);
    // a turn and a half on: the balls go on round the circuit with no jump between the turns
    const ids = rec!.kin.bodies.filter((b) => b.next).map((b) => b.id);
    const P = k.pose(2 * Math.PI);
    const Q = k.pose(2 * Math.PI + 1e-6);
    for (const id of ids) expect(v3.dist(P.bodies.get(id)!.t, Q.bodies.get(id)!.t)).toBeLessThan(1e-3);
  });
});
