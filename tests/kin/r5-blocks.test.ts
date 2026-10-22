// The blocks and closed forms the cam, indexing and escapement rebuild added (R5): the cam's contact point and barrel
// form, the rocker, the internal Geneva, the mutilated gear and the cam indexer, the star wheel, the ratchet, the
// one-way clutch, the geometric escapements (planar and verge), the modified sine, and the cam outlines.
import { describe, expect, it } from "vitest";
import { lawRise } from "../../src/kin/blocks/cam";
import { genevaInternalAngle, overlapDepth, polyDist, ratchetWheel, rideAngle, sawOutline, simulateEscape, simulateStar, simulateVerge, starOutline } from "../../src/kin/blocks/timed";
import { Kinematics, anchorAt, anchorName } from "../../src/kin/compose";
import { verifyK1 } from "../../src/kin/verify";
import type { Kin } from "../../src/kin/types";
import { xf } from "../../src/kin/math";
import { camLawOf, flatCam, pitchCurve, rollerCam } from "../../src/builder/cams";

const D = Math.PI / 180;

/** A translating roller follower on a plate cam, rise 120 dwell 60 return 120 dwell 60, h 20, prime 40, roller 8. */
function plateCam(extra: Record<string, unknown> = {}): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "cam", role: "cam", at: { joint: "O" } },
      { id: "stem", role: "follower" },
    ],
    joints: [
      { id: "O", type: "revolute", a: "ground", b: "cam", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "G", type: "prismatic", a: "stem", b: "ground", at: [0, 40, 0], axis: [0, 1, 0] },
      {
        id: "C", type: "cam-contact", a: "stem", b: "cam", at: [0, 40, 0], axis: [0, 0, 1], ca: [0, 0, 0], follower: "roller",
        cam: { schedule: [{ kind: "rise", span: 120 }, { kind: "dwell", span: 60 }, { kind: "return", span: 120 }, { kind: "dwell", span: 60 }], lift: 20, rb: 40, theta0: 0 },
      },
    ],
    drivers: [{ id: "input", joint: "O", kind: "rotary", range: [0, 360], default: 0 }],
    solve: [{ block: "cam", id: "lift", in: { joint: "C", input: "input", follower: "stem", axis: [0, 1, 0], rr: 8, ...extra }, out: { s: "lift", contact: "K" } }],
    points: [{ id: "K", body: "cam", local: [0, 32, 0] }],
    fallback: null,
  };
}

describe("cam block (R5)", () => {
  it("places the roller's contact point on the cam outline, rr from the roller centre", () => {
    const k = new Kinematics(plateCam());
    const L = camLawOf(plateCam().joints[2]!, (v) => Number(v), Math.PI / 2);
    const outline = rollerCam(L!, 8);
    for (const u of [0.3, 1.1, 2.5, 4.0]) {
      const P = k.pose(u);
      const K = P.points.get("K")!;
      const F = xf.apply(P.bodies.get("stem")!, [0, 40, 0]);
      expect(Math.hypot(K[0] - F[0], K[1] - F[1])).toBeCloseTo(8, 6);
      // in the cam's frame the contact lies on its outline
      const kc = xf.apply(xf.inv(P.bodies.get("cam")!), K);
      const d = Math.min(...outline.map(([x, y]) => Math.hypot(x - kc[0], y - kc[1])));
      expect(d).toBeLessThan(0.3);
    }
  });

  it("the roller cam lies rr inside the pitch curve, the flat cam's least radius is the base circle", () => {
    const L = camLawOf(plateCam().joints[2]!, (v) => Number(v), 0)!;
    const pc = pitchCurve(L, 360);
    const rc = rollerCam(L, 8, 360);
    for (let i = 0; i < 360; i += 37) expect(Math.hypot(rc[i]![0] - pc[i]![0], rc[i]![1] - pc[i]![1])).toBeCloseTo(8, 6);
    const fc = flatCam(L, 720);
    expect(Math.min(...fc.map(([x, y]) => Math.hypot(x, y)))).toBeCloseTo(40, 3);
  });

  it("a barrel cam's follower runs along the axis at the pitch radius, and K1 checks it", () => {
    const kin: Kin = {
      bodies: [{ id: "ground", role: "ground" }, { id: "drum", role: "cam" }, { id: "slide", role: "follower" }],
      joints: [
        { id: "O", type: "revolute", a: "ground", b: "drum", at: [0, 0, 0], axis: [1, 0, 0] },
        { id: "G", type: "prismatic", a: "slide", b: "ground", at: [0, -60, 0], axis: [1, 0, 0] },
        { id: "C", type: "cam-contact", a: "slide", b: "drum", at: [0, -60, 0], axis: [1, 0, 0], ca: [0, 0, 0], cam: { form: "barrel", schedule: [{ kind: "rise", span: 180 }, { kind: "return", span: 180 }], lift: 30, rb: 60 } },
      ],
      drivers: [{ id: "input", joint: "O", kind: "rotary", range: [0, 360], default: 0 }],
      solve: [{ block: "cam", id: "g", in: { joint: "C", input: "input", follower: "slide", axis: [1, 0, 0] }, out: { s: "s", pressure: "phi" } }],
      fallback: null,
    };
    const k = new Kinematics(kin);
    expect(k.pose(Math.PI).values.s).toBeCloseTo(30, 6);
    // tan φ = s' / Rp: the cycloidal rise's peak s' = 2h / β
    let peak = 0;
    for (let i = 0; i < 360; i++) peak = Math.max(peak, k.pose((i / 360) * 2 * Math.PI).values.phi!);
    expect(peak).toBeCloseTo(Math.atan2((2 * 30) / Math.PI, 60) / D, 1);
    expect(verifyK1(k, { samples: 90 }).maxResidual).toBeLessThan(1e-9);
  });
});

describe("modified sine", () => {
  it("rises 0 to 1 with Cv 1.76 and Ca 5.53", () => {
    let v = 0;
    let a = 0;
    for (let i = 0; i <= 4000; i++) {
      const r = lawRise("modsine", i / 4000);
      v = Math.max(v, r.v);
      a = Math.max(a, Math.abs(r.a));
    }
    expect(lawRise("modsine", 0).s).toBeCloseTo(0, 12);
    expect(lawRise("modsine", 1).s).toBeCloseTo(1, 12);
    expect(v).toBeCloseTo(1.76, 2);
    expect(a).toBeCloseTo(5.53, 2);
  });
});

describe("indexing laws", () => {
  it("internal Geneva: same direction, 90 degrees per index over 270 of crank, peak 0.41", () => {
    expect(genevaInternalAngle(4, 0.999 * Math.PI) - genevaInternalAngle(4, -0.999 * Math.PI)).toBeCloseTo(Math.PI / 2, 6);
    let peak = 0;
    for (let i = -1000; i <= 1000; i++) {
      const p = (i / 1000) * 0.74 * Math.PI;
      peak = Math.max(peak, (genevaInternalAngle(4, p + 1e-6) - genevaInternalAngle(4, p - 1e-6)) / 2e-6);
    }
    expect(peak).toBeCloseTo(0.414, 2);
  });

  it("ratchet: lost motion, then one pitch with the lever; rest on the return", () => {
    expect(ratchetWheel(0.5, 62 + 3, 62, 6, 30)).toBe(0);
    expect(ratchetWheel(2, 62 + 20, 62, 6, 30)).toBe(14);
    expect(ratchetWheel(4, 70, 62, 6, 30)).toBe(30);
    expect(ratchetWheel(2 * Math.PI + 2, 82, 62, 6, 30)).toBe(44);
  });
});

describe("ride solver, sawtooth and star outlines", () => {
  it("a knife pawl rests on the sawtooth where its spring holds it, nearest the wheel's centre", () => {
    const spec = { n: 12, root: 50, tip: 62, face: 3, back: 27, tip0: 29.24 };
    const P = [75.07 * Math.cos(-22 * D), 75.07 * Math.sin(-22 * D)];
    const a = rideAngle(sawOutline(spec, 0), P, 56, 0, [86, 146], [0, 0]);
    const tip = [P[0]! + 56 * Math.cos(a), P[1]! + 56 * Math.sin(a)];
    expect(Math.hypot(tip[0]!, tip[1]!)).toBeCloseTo(50, 1);
    expect(polyDist(sawOutline(spec, 0), tip[0]!, tip[1]!)).toBeGreaterThanOrEqual(-1e-6);
  });

  it("the star wheel reproduces the review: crest 18 at 195.85, snapped by 203.85, reach 22.72, jumper lift 18", () => {
    const r = simulateStar({ n: 10, tip: 20, root: 11.5, tip0: 30.91, c: [28, 0], rf: 12, pin: 1.9, finger0: 180, jumper: [36.7, 27.8], swing: [-165, -135], arm: 22, roller: 2.8, snap: 8 });
    expect(r.crest).toBeCloseTo(195.85, 1);
    expect(r.star[Math.round(203.85 / r.step)]).toBeCloseTo(36, 3);
    expect(Math.max(...r.push)).toBeCloseTo(22.72, 1);
    expect(Math.min(...r.jumper)).toBeCloseTo(-18, 0);
    expect(starOutline({ n: 10, tip: 20, root: 11.5, tip0: 0, c: [0, 0] } as never, 0)).toHaveLength(20);
  });

  it("overlap depth sees edges that cross with no vertex inside", () => {
    const a: [number, number][] = [[-5, -0.5], [5, -0.5], [5, 0.5], [-5, 0.5]];
    const b: [number, number][] = [[-0.5, -5], [0.5, -5], [0.5, 5], [-0.5, 5]];
    expect(overlapDepth(a, b)).toBeGreaterThan(0);
    expect(overlapDepth(a, b.map(([x, y]) => [x + 20, y]))).toBe(0);
  });
});

describe("geometric escapements", () => {
  it("the anchor's pallets let the wheel through one tooth per period, in beat", () => {
    const E: [number, number] = [0, 160];
    const A: [number, number] = [0, 230.71];
    const wheel: [number, number][] = [];
    for (let k = 0; k < 30; k++) {
      const a = 12 * k * D;
      for (const [r, b] of [[39.4, a + D], [50, a], [39.4, a + 8 * D]] as const) wheel.push([E[0] + r * Math.cos(b), E[1] + r * Math.sin(b)]);
    }
    const p = (q: number[][]) => q.map(([x, z]): [number, number] => [A[0] + x!, A[1] + z!]);
    const r = simulateEscape({ wheel, wc: E, pallets: [p([[38, -40.02], [44.77, -36.14], [43.22, -34.18], [36.46, -38.06]]), p([[-28.67, -22.76], [-21.91, -26.65], [-24.1, -27.85], [-30.87, -23.97]])], ac: A, n: 30, sense: 1 }, (u) => -7 * Math.cos(u) * D, 720);
    expect(r.advance / D).toBeCloseTo(12, 6);
    for (const b of r.beats) expect(Math.abs(b / D - 6)).toBeLessThan(0.3);
    for (const rc of r.recoils) expect(rc / D).toBeGreaterThan(1.5);
  });

  it("the verge steps 12 degrees per beat", () => {
    const r = simulateVerge({ n: 15, R: 40, h: 8, back: 12 * D, staff: [0, -14], upper: 42.5 * D, lower: 137.5 * D, from: 3.5, to: 12, width: 1.5, sense: 1 }, (u) => -45 * Math.cos(u) * D, 720);
    expect(r.advance / D).toBeCloseTo(24, 6);
    for (const b of r.beats) expect(b / D).toBeCloseTo(12, 1);
  });
});

describe("body anchors", () => {
  it("a named anchor carries a reference point by its body's pose", () => {
    const n = anchorName("cam", [1, 2, 3]);
    expect(n).toBe("@cam:1:2:3");
    const X = xf.rotAbout([0, 0, 0], [0, 0, 1], Math.PI / 2);
    const p = anchorAt(n, new Map([["cam", X]]))!;
    expect(p[0]).toBeCloseTo(-2, 9);
    expect(p[1]).toBeCloseTo(1, 9);
    expect(anchorAt("@ground:4:5:6", new Map())).toEqual([4, 5, 6]);
  });
});
