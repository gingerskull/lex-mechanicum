import { describe, expect, it } from "vitest";
import { circuitRolls, ease, rollAt, slotAt, turnOf, type Leg } from "../../src/kin/steps/transfer";
import { D2R, TAU, m3, v3, xf, type Mat3, type Vec3 } from "../../src/kin/math";
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

  it("a round part rolls whole turns over each run of moves about one axis, and not on the beam", () => {
    // carried 40 along x, then 30 along y and 20 back along x on its own, radius 5
    const slots: { from: Vec3; legs: Leg[] }[] = [
      { from: [-20, 0, 50], legs: [{ carry: true, window: [0, 180] }] },
      { from: [20, 0, 50], legs: [{ carry: false, to: [20, 15, 50], window: [200, 250] }, { carry: false, to: [20, 30, 45], window: [250, 300] }] },
      { from: [20, 30, 45], legs: [{ carry: false, to: [0, 30, 45], window: [200, 300] }, { carry: false, to: [-20, 0, 50], window: [300, 350] }] },
    ];
    const rolls = circuitRolls(slots, 5, beam);
    expect(rolls[0]![0]).toBeNull();
    // across y: 30 mm is 0.95 of a turn, rounded to one; the two legs share it by their travel
    const [a, b] = [rolls[1]![0]!, rolls[1]![1]!];
    near(a.axis, [-1, 0, 0]);
    expect(b.a1).toBeCloseTo(TAU, 12);
    expect(a.a1 / b.a1).toBeCloseTo(0.5, 12);
    // back along x: 20 mm is 0.64 of a turn, rounded to one; the last leg turns across the circuit's diagonal, a run of its own
    expect(rolls[2]![0]!.a1).toBeCloseTo(TAU, 12);
    near(rolls[2]![0]!.axis, [0, -1, 0]);
    expect(rolls[2]![1]!.a1).toBeCloseTo(TAU * Math.round(Math.hypot(20, 30) / 5 / TAU), 12);
    // the hold before a slot is where the last leg left the part; mid-leg it has rolled as far as it moved
    expect(rollAt(slots[2]!.legs, rolls[2]!, rolls[1]![1]!, 0)!.a).toBeCloseTo(TAU, 12);
    expect(rollAt(slots[1]!.legs, rolls[1]!, null, 225)!.a).toBeCloseTo(a.a1 * ease(0.5), 12);
    expect(rollAt(slots[0]!.legs, rolls[0]!, rolls[2]![1]!, 90)).toBeNull();
  });

  it("walking-beam: the balls roll on the tracks, not on the beam, and come round turned as the next one started", () => {
    const rec = recordById("walking-beam") as { kin: Kin } | undefined;
    const k = new Kinematics(rec!.kin);
    const R = (u: number, id: string) => k.pose(u).bodies.get(id)!.R;
    const between = (A: Mat3, B: Mat3) => v3.len(m3.log(m3.mul(m3.T(A), B)));
    // ball 0 rides the beam over the first half turn: never turned
    for (const d of [0, 45, 90, 179]) expect(v3.len(m3.log(R(d * D2R, "ball0")))).toBeLessThan(1e-9);
    // ball 5 rolls along the return lane over its window
    expect(between(R(250 * D2R, "ball5"), R(300 * D2R, "ball5"))).toBeGreaterThan(0.1);
    // no jump in a ball's turn from one turn to the next
    for (const id of ["ball3", "ball5", "ball12"]) {
      const P = k.pose(2 * Math.PI).bodies.get(id)!;
      const Q = k.pose(2 * Math.PI + 1e-6).bodies.get(id)!;
      expect(between(P.R, Q.R)).toBeLessThan(1e-3);
    }
  });
});
