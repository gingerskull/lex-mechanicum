// A cam schedule of several turns (a self-reversing screw's track) and the trapezoidal law.
import { describe, expect, it } from "vitest";
import { camMotion, camTurns, lawRise, scheduleOf } from "../../src/kin/blocks/cam";
import { barrelTrack, camLawOf } from "../../src/builder/cams";
import type { KinJoint } from "../../src/kin/types";

const D = Math.PI / 180;

describe("trapezoidal law", () => {
  it("starts and ends at rest and runs at 1 / (1 − b) between its blends", () => {
    for (const b of [0.1, 1 / 6, 0.25, 0.5]) {
      expect(lawRise("trapezoidal", 0, b).s).toBe(0);
      expect(lawRise("trapezoidal", 0, b).v).toBe(0);
      expect(lawRise("trapezoidal", 1, b).s).toBeCloseTo(1, 12);
      expect(lawRise("trapezoidal", 1, b).v).toBeCloseTo(0, 12);
      if (b < 0.5) expect(lawRise("trapezoidal", 0.5, b).v).toBeCloseTo(1 / (1 - b), 12);
      // continuous at the blend edges, and v is ds/dx
      for (const x of [b, 1 - b, 0.3, 0.7]) {
        const h = 1e-6;
        expect(lawRise("trapezoidal", x + h, b).s - lawRise("trapezoidal", x - h, b).s).toBeCloseTo(2 * h * lawRise("trapezoidal", x, b).v, 9);
      }
    }
  });
});

describe("a schedule of several turns", () => {
  const cam = {
    schedule: [
      { kind: "rise" as const, span: 1080, law: "trapezoidal", blend: 1 / 6 },
      { kind: "return" as const, span: 1080, law: "trapezoidal", blend: 1 / 6 },
    ],
    lift: 120,
    turns: 6,
  };
  const sched = scheduleOf(cam, (v) => Number(v), (l) => (l === "trapezoidal" ? "trapezoidal" : "cycloidal"));

  it("repeats after its period, not after one turn", () => {
    expect(camTurns(sched)).toBe(6);
    expect(camMotion(sched, 540 * D).s).toBeCloseTo(60, 9);
    expect(camMotion(sched, 1080 * D).s).toBeCloseTo(120, 9);
    expect(camMotion(sched, 900 * D).s).not.toBeCloseTo(camMotion(sched, 540 * D).s, 3);
    expect(camMotion(sched, (2160 + 300) * D).s).toBeCloseTo(camMotion(sched, 300 * D).s, 9);
  });

  it("runs at one lead per turn in the steady runs", () => {
    // 120 / (3 turns × 5/6) = 48 mm per turn
    expect(camMotion(sched, 540 * D).v * 2 * Math.PI).toBeCloseTo(48, 9);
    expect(camMotion(sched, 1620 * D).v * 2 * Math.PI).toBeCloseTo(-48, 9);
  });

  it("leaves a one-turn schedule as it was", () => {
    const one = scheduleOf({ schedule: [{ kind: "rise", span: 180 }, { kind: "return", span: 180 }], lift: 10 }, (v) => Number(v), () => "cycloidal");
    expect(one.period).toBeUndefined();
    expect(camTurns(one)).toBe(1);
    expect(one.segments[0]).toEqual({ kind: "rise", span: Math.PI, law: "cycloidal" });
  });

  it("cuts its barrel track in closed pieces that share their end rings", () => {
    const j = { id: "C", type: "cam-contact", a: "f", b: "c", at: [0, -14, 40], axis: [1, 0, 0], cam: { form: "barrel", ...cam } } as unknown as KinJoint;
    const L = camLawOf(j, (v) => Number(v), 0)!;
    const pieces = barrelTrack(L, 0, 14, 7, 11, 18);
    expect(pieces.length).toBe(36);
    for (let p = 0; p < pieces.length; p++) {
      const a = pieces[p]!;
      const b = pieces[(p + 1) % pieces.length]!;
      // each a closed tube: every edge shared by exactly two triangles
      const edges = new Map<string, number>();
      for (let t = 0; t < a.tri.length; t += 3)
        for (let e = 0; e < 3; e++) {
          const i = a.tri[t + e]!;
          const k = a.tri[t + ((e + 1) % 3)]!;
          const key = i < k ? `${i},${k}` : `${k},${i}`;
          edges.set(key, (edges.get(key) ?? 0) + 1);
        }
      expect([...edges.values()].every((n) => n === 2)).toBe(true);
      // the last ring of one piece is the first ring of the next
      const last = a.pos.slice(a.pos.length - 12);
      expect([...b.pos.slice(0, 12)]).toEqual([...last]);
    }
  });
});
