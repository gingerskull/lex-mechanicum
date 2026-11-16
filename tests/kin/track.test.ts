// The composite track: its geometry exact per segment (points, tangents, length, nearest point, offsets), the target-path
// block that runs a pin along it, and the K1 residual that keeps the pin on it.
import { describe, expect, it } from "vitest";
import { Kinematics } from "../../src/kin/compose";
import { resolveTrack, track, trackAt, trackNearest, trackOffset, trackTangent, type Vec2 } from "../../src/kin/blocks/track";
import { jointResidual } from "../../src/kin/residual";
import { verifyK1 } from "../../src/kin/verify";
import { xf } from "../../src/kin/math";
import type { Kin } from "../../src/kin/types";
import { trackFollower } from "./fixtures";

const D = Math.PI / 180;
// the fixture's S: up from (60, -30), left on R 40 for 45°, 20 straight, right on R 40 for 45°
const S = () => track([60, -30], 90 * D, [{ k: 1 / 40, L: 40 * 45 * D }, { k: 0, L: 20 }, { k: -1 / 40, L: 40 * 45 * D }]);
const close = (a: Vec2, b: Vec2, d = 9) => {
  expect(a[0]).toBeCloseTo(b[0], d);
  expect(a[1]).toBeCloseTo(b[1], d);
};

describe("track geometry", () => {
  it("chains its segments: the ends of each arc and line where the circles put them, the length their sum", () => {
    const t = S();
    const r = Math.SQRT1_2 * 40;
    expect(t.length).toBeCloseTo(2 * 40 * 45 * D + 20, 12);
    close(trackAt(t, 0).p, [60, -30]);
    // the first arc's centre is (20, -30): it ends 45° round it, heading 135°
    close(trackAt(t, 40 * 45 * D).p, [20 + r, -30 + r]);
    expect(trackAt(t, 40 * 45 * D).h).toBeCloseTo(135 * D, 12);
    close(trackAt(t, 40 * 45 * D + 20).p, [20 + r - 20 * Math.SQRT1_2, -30 + r + 20 * Math.SQRT1_2]);
    // the second arc turns back to 90°, about its centre 40 to the right of the line
    const end = trackAt(t, t.length);
    expect(end.h).toBeCloseTo(90 * D, 12);
    close(end.p, [20 + r - 20 * Math.SQRT1_2 + r - 40, -30 + r + 20 * Math.SQRT1_2 + r]);
    // clamped past the ends
    close(trackAt(t, -5).p, [60, -30]);
    close(trackAt(t, t.length + 5).p, end.p);
  });

  it("is G1: the tangent runs on through every junction, and is the derivative of the point", () => {
    const t = S();
    for (const g of t.segs.slice(1)) {
      const a = trackTangent(t, g.s0 - 1e-9);
      const b = trackTangent(t, g.s0 + 1e-9);
      close(a, b, 6);
      close(trackAt(t, g.s0 - 1e-9).p, trackAt(t, g.s0 + 1e-9).p, 6);
    }
    for (const s of [3, 20, 40, 55, 70]) {
      const h = 1e-6;
      const p0 = trackAt(t, s - h).p;
      const p1 = trackAt(t, s + h).p;
      close([(p1[0] - p0[0]) / (2 * h), (p1[1] - p0[1]) / (2 * h)], trackTangent(t, s), 6);
    }
  });

  it("finds the nearest point exactly: a point set off square to the track comes back with its travel and offset", () => {
    const t = S();
    for (const s of [0.5, 10, 31.4, 40, 51.4, 60, 82]) {
      for (const off of [-6, -0.5, 0, 0.5, 6]) {
        const q = trackAt(t, s);
        const p: Vec2 = [q.p[0] - off * Math.sin(q.h), q.p[1] + off * Math.cos(q.h)];
        const n = trackNearest(t, p);
        expect(n.s).toBeCloseTo(s, 9);
        expect(n.off).toBeCloseTo(off, 9);
        expect(n.d).toBeCloseTo(Math.abs(off), 9);
      }
    }
  });

  it("agrees with a dense sampling for points anywhere, past the ends included", () => {
    const t = S();
    const dense = Array.from({ length: 40001 }, (_, i) => trackAt(t, (t.length * i) / 40000).p);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 120 - 40;
    for (let k = 0; k < 60; k++) {
      const p: Vec2 = [rnd() + 30, rnd() + 10];
      const best = Math.min(...dense.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])));
      const n = trackNearest(t, p);
      expect(n.d).toBeLessThanOrEqual(best + 1e-9);
      expect(best - n.d).toBeLessThan(1e-3);
      close(trackAt(t, n.s).p, n.p, 9);
    }
  });

  it("draws an offset curve whose vertices lie at the offset and whose chords sag no more than asked", () => {
    const t = S();
    for (const off of [-9.7, 8.2, 19.7]) {
      const pts = trackOffset(t, off, 0.01);
      for (const p of pts) expect(trackNearest(t, p).off).toBeCloseTo(off, 9);
      for (let i = 1; i < pts.length; i++) {
        const m: Vec2 = [(pts[i - 1]![0] + pts[i]![0]) / 2, (pts[i - 1]![1] + pts[i]![1]) / 2];
        expect(Math.abs(Math.abs(trackNearest(t, m).off) - Math.abs(off))).toBeLessThanOrEqual(0.0100001);
      }
    }
  });

  it("puts the record's track in its plane: through the pin's height, its direction an angle or a vector", () => {
    const num = (v: unknown) => Number(v);
    const vec = (v: unknown): [number, number, number] => {
      const a = v as number[];
      return [a[0]!, a[1]!, a[2] ?? 0];
    };
    const spec = { start: [60, -30], dir: 90, segments: [{ radius: 40, angle: 45 }, { length: 20 }, { radius: -40, length: 40 * 45 * D }] };
    const T = resolveTrack(spec, num, vec, [60, -30, 12], [0, 0, 1]);
    expect(T.o).toEqual([60, -30, 12]);
    expect(T.x[0]).toBeCloseTo(0, 12);
    expect(T.x[1]).toBeCloseTo(1, 12);
    expect(T.t.length).toBeCloseTo(S().length, 12);
    const V = resolveTrack({ ...spec, dir: [0, 2, 5] }, num, vec, [60, -30, 0], [0, 0, 1]);
    V.x.forEach((c, i) => expect(c).toBeCloseTo(T.x[i]!, 12));
    expect(() => resolveTrack({ ...spec, dir: [0, 0, 1] }, num, vec, [60, -30, 0], [0, 0, 1])).toThrow(/along the joint's axis/);
  });
});

describe("target-path along a track, and its K1 residual", () => {
  it("runs the pin from its place to the far end and back once a cycle, the linkage closing on it (K1, periodic)", () => {
    const k = new Kinematics(trackFollower());
    const rep = verifyK1(k, { samples: 180 });
    expect(rep.maxResidual).toBeLessThan(1e-9);
    expect(rep.periodicity).toBeLessThan(1e-9);
    const L = S().length;
    expect(k.pose(0).values.travel).toBeCloseTo(0, 12);
    expect(k.pose(Math.PI).values.travel).toBeCloseTo(L, 9);
    expect(k.pose(Math.PI / 2).values.travel).toBeCloseTo(L / 2, 9);
    expect(k.pose(Math.PI / 3).values.travel).toBeCloseTo(k.pose((5 * Math.PI) / 3).values.travel!, 9);
    const end = k.pose(Math.PI).points.get("F")!;
    const e = trackAt(S(), L).p;
    expect(end[0]).toBeCloseTo(e[0], 9);
    expect(end[1]).toBeCloseTo(e[1], 9);
    // the crank's driver reads its turn back off the pose
    expect(Math.abs(k.pose(Math.PI).values.hand!)).toBeGreaterThan(30);
  });

  it("runs once over the cycle, or to a set travel, or by a driver's value", () => {
    const once = trackFollower();
    once.solve[0]!.in = { shape: "track", joint: "F", mode: "once", to: 50 };
    const k = new Kinematics(once);
    expect(k.pose(Math.PI).values.travel).toBeCloseTo(25, 9);
    expect(k.pose(2 * Math.PI - 1e-9).values.travel).toBeCloseTo(50, 6);
    const set = trackFollower();
    set.drivers.push({ id: "s", kind: "manual", range: [0, 80], default: 30 });
    set.solve[0]!.in = { shape: "track", joint: "F", travel: "s" };
    expect(new Kinematics(set).pose(1, { drivers: { s: 30 } }).values.travel).toBeCloseTo(30, 12);
  });

  it("refuses a joint without a track and a travel off the track", () => {
    const bad = trackFollower();
    bad.solve[0]!.in = { shape: "track", joint: "A" };
    expect(() => new Kinematics(bad).pose(1)).toThrow(/not a pin in a composite track/);
    const far = trackFollower();
    far.solve[0]!.in = { shape: "track", joint: "F", to: 200 };
    expect(() => new Kinematics(far).pose(Math.PI)).toThrow(/off the track/);
  });

  it("measures the pin's distance from the track: zero on a solved pose, the miss when the arm is moved off it", () => {
    const kin: Kin = trackFollower();
    const k = new Kinematics(kin);
    const r = k.joints().find((j) => j.joint.id === "F")!;
    for (const u of [0, 0.7, 1.9, 2.8, 4.1, 5.5]) {
      const p = k.pose(u);
      expect(Math.abs(jointResidual(r, p.bodies.get("arm")!, p.bodies.get("ground") ?? xf.id())[0]!)).toBeLessThan(1e-9);
      // the arm moved 0.75 mm square to the track at the pin: the residual is that miss, signed
      const s = p.values.travel!;
      const h = trackAt(S(), s).h;
      const moved = xf.mul(xf.trans([-0.75 * Math.sin(h), 0.75 * Math.cos(h), 0]), p.bodies.get("arm")!);
      const m = jointResidual(r, moved, xf.id())[0]!;
      expect(m).toBeCloseTo(0.75, 9);
    }
  });
});
