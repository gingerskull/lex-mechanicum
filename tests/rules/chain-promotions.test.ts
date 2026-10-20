// The chain drive's hand fixes promoted (standard 2.12): P.sprocket (ISO 606), the chain conveyed on a path exactly a
// whole number of pitches long, and the idler a whole-tooth sprocket on the rollers' line, phased and geared to them.
import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import { alongPath, indexParts, solidPose } from "../../src/assemble/pose";
import { beltLength, beltPath, centresFor, chainPath, pathLength, sprocketR, sprocketSeat } from "../../src/core/flex";
import { TAU } from "../../src/core/geom";
import { P } from "../../src/parts";
import { chainModel } from "../fixtures/models";

const p = 12.7;
const d1 = 8.5;

describe("P.sprocket", () => {
  it("draws the ISO 606 form: z seats on the pitch polygon's vertices, the first at a0, and sets z", () => {
    const s = P.sprocket("s", 15, p, d1, { a0: 0.2 });
    expect(s.z).toBe(15);
    expect(s.m).toBeUndefined();
    const R = sprocketR(15, p);
    const seat = sprocketSeat(d1);
    // the deepest point of each gap is the seat's bottom, R - seat from the centre, on the vertex's ray
    const r = s.shape.outer.map(([x, y]) => Math.hypot(x, y));
    expect(Math.min(...r)).toBeCloseTo(R - seat, 2);
    const deepest = s.shape.outer[r.indexOf(Math.min(...r))]!;
    const k = Math.round(((Math.atan2(deepest[1], deepest[0]) - 0.2) * 15) / TAU);
    expect(Math.atan2(deepest[1], deepest[0])).toBeCloseTo(0.2 + (k * TAU) / 15, 2);
  });
});

describe("the chain's path", () => {
  it("is exactly N pitches long, where the arcs drawn as chords would run short", () => {
    const [r1, r2] = [sprocketR(15, p), sprocketR(30, p)];
    const C = centresFor(r1, r2, 62 * p);
    expect(beltLength(r1, r2, C)).toBeCloseTo(62 * p, 6);
    expect(62 * p - pathLength(beltPath([0, 0], r1, [C, 0], r2))).toBeGreaterThan(0.1);
    const { path, off } = chainPath([0, 0], r1, [C, 0], r2, 62, p);
    expect(pathLength(path)).toBeCloseTo(62 * p, 6);
    expect(Math.abs(off)).toBeLessThan(0.1);
  });

  it("brings each roller back to the same place every circuit", () => {
    const { assembly } = assembleWith(chainModel);
    const parts = indexParts(chainModel);
    const r0 = assembly.solids.find((s) => s.id === "flex-chain-0-r0")!;
    const m = r0.motion as { path: [number, number][] };
    expect(pathLength(m.path)).toBeCloseTo(62 * p, 6);
    // one lap of travel is 62 pitches: a roller then sits where the one 62 behind it sat
    const s = chainModel.solve(0.3);
    const a = solidPose(chainModel, parts, r0, s, 0.3)!;
    const b = alongPath(m.path, (s.t as number) + 62 * p);
    expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeLessThan(1e-6);
  });
});

describe("the chain's idler sprocket", () => {
  const { assembly } = assembleWith(chainModel);
  const parts = indexParts(chainModel);
  const idl = assembly.solids.find((s) => s.id === "flex-chain-0-idler")!;
  const mo = idl.motion as { around: [number, number]; ratio: number };
  const rollers = assembly.solids.filter((s) => /^flex-chain-0-r\d+$/.test(s.id));
  const ri = sprocketR(9, p);

  it("has nine teeth, its pitch circle on the rollers' line, and turns one tooth per pitch of travel", () => {
    expect(idl.name).toMatch(/9 teeth/);
    expect(mo.ratio).toBeCloseTo(-15 / 9, 12);
    // as the rollers pass, the nearest comes to the pitch radius from the idler's centre, never closer
    let d = Infinity;
    for (let i = 0; i < 60; i++) {
      const u = i * 0.01;
      const s = chainModel.solve(u);
      for (const t of rollers) {
        const q = solidPose(chainModel, parts, t, s, u)!;
        d = Math.min(d, Math.hypot(q[0] - mo.around[0], q[1] - mo.around[1]));
      }
    }
    expect(d).toBeCloseTo(ri, 1);
  });

  it("keeps a seat on the roller nearest it at every phase", () => {
    for (const u of [0, 0.37, 1.3, 2.9, 4.4, 6]) {
      const s = chainModel.solve(u);
      const q = solidPose(chainModel, parts, idl, s, u)!;
      const X = rollers.map((t) => solidPose(chainModel, parts, t, s, u)!).reduce((a, b) => (Math.hypot(b[0] - mo.around[0], b[1] - mo.around[1]) < Math.hypot(a[0] - mo.around[0], a[1] - mo.around[1]) ? b : a));
      const ang = Math.atan2(X[1] - mo.around[1], X[0] - mo.around[0]);
      // a seat every 2π / 9 from the idler's angle
      const k = ((((ang - q[2]) * 9) / TAU) % 1 + 1) % 1;
      expect(Math.min(k, 1 - k) * (TAU / 9) * ri).toBeLessThan(0.6);
    }
  });
});
