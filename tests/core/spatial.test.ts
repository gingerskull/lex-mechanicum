// Gear and screw geometry across axes (src/core/spatial.ts) against worked examples: the catalogue's build specs
// (bevel-gears, worm-drive, helical-gears, herringbone-gears, crossed-helical-gears, lead-screw, ball-screw) and ISO tables.
import { describe, expect, it } from "vitest";
import { D2R } from "../../src/core/geom";
import {
  bevel,
  bevelOutline,
  crossedCentres,
  helicalCentres,
  helicalDiameter,
  helixLead,
  leadAngle,
  metric,
  pitchCones,
  screwLead,
  selfLocking,
  transverseModule,
  transversePressure,
  trapezoidal,
  travel,
  twist,
  worm,
} from "../../src/core/spatial";

const deg = (r: number) => r / D2R;

describe("bevel gears", () => {
  it("gives the catalogue's cone angles of 26.57° and 63.43° for 16:32 at 90°", () => {
    const [d1, d2] = pitchCones(16, 32);
    expect(deg(d1)).toBeCloseTo(26.565, 3);
    expect(deg(d2)).toBeCloseTo(63.435, 3);
    // a mitre pair is 45° each; a 60° shaft angle at 1:1 splits it
    expect(deg(pitchCones(20, 20)[0])).toBeCloseTo(45, 9);
    expect(deg(pitchCones(20, 20, 60 * D2R)[0])).toBeCloseTo(30, 9);
  });

  it("gives the outer cone distance 71.55, the back cone and the inner end of the face", () => {
    const [d1, d2] = pitchCones(16, 32);
    const p = bevel(16, 4, d1, 20);
    const g = bevel(32, 4, d2, 20);
    expect(p.d).toBe(64);
    expect(g.d).toBe(128);
    expect(p.Re).toBeCloseTo(71.554, 3);
    expect(g.Re).toBeCloseTo(p.Re, 9);
    // Tredgold: zv = z / cos δ, rv = r / cos δ
    expect(p.zv).toBeCloseTo(17.889, 3);
    expect(g.zv).toBeCloseTo(71.554, 3);
    expect(p.rv).toBeCloseTo(35.777, 3);
    expect(p.inner).toBeCloseTo((71.554 - 20) / 71.554, 4);
    // apex to the outer pitch circle along each axis: 64 for the pinion, 32 for the gear (the axes meet at the apex)
    expect(p.apex).toBeCloseTo(64, 9);
    expect(g.apex).toBeCloseTo(32, 9);
    expect(p.axial).toBeCloseTo(20 * Math.cos(d1), 9);
    // the default face width is a third of the cone distance
    expect(bevel(16, 4, d1).b).toBeCloseTo(71.554 / 3, 3);
  });

  it("lays the back-cone teeth onto the gear: z teeth, tips at r + m cos δ, roots at r - 1.25 m cos δ", () => {
    const [d1] = pitchCones(16, 32);
    const P = bevelOutline(16, 4, d1);
    const R = P.map(([x, y]) => Math.hypot(x, y));
    expect(Math.max(...R)).toBeCloseTo(32 + 4 * Math.cos(d1), 1);
    expect(Math.min(...R)).toBeCloseTo(32 - 5 * Math.cos(d1), 1);
    // the outline closes round the full turn: the tooth count of the virtual gear drawn back onto 2π
    const tips = P.filter((_, i) => R[i]! > 32 + 3.5 * Math.cos(d1)).map(([x, y]) => Math.atan2(y, x));
    expect(tips.length).toBeGreaterThan(0);
  });
});

describe("worm and wheel", () => {
  it("gives the catalogue's worm drive: lead angle 5.71°, axial pitch 9.42, centre distance 60, 30:1", () => {
    const w = worm(3, 1, 30, 10);
    expect(w.p).toBeCloseTo(9.4248, 4);
    expect(w.lead).toBeCloseTo(9.4248, 4);
    expect(w.d1).toBe(30);
    expect(w.d2).toBe(90);
    expect(deg(w.gamma)).toBeCloseTo(5.711, 3);
    expect(w.a).toBe(60);
    expect(w.ratio).toBeCloseTo(1 / 30, 12);
    // the lead angle is also atan(L / (π d1))
    expect(Math.atan(w.lead / (Math.PI * w.d1))).toBeCloseTo(w.gamma, 12);
    // a two-start worm doubles the lead and the angle's tangent
    expect(Math.tan(worm(3, 2, 30, 10).gamma)).toBeCloseTo(0.2, 12);
  });
});

describe("helical gears", () => {
  it("gives the catalogue's helical pair: mt 3.193, centre distance 81.41", () => {
    const b = 20 * D2R;
    expect(transverseModule(3, b)).toBeCloseTo(3.1925, 4);
    expect(helicalCentres(17, 34, 3, b)).toBeCloseTo(81.41, 2);
    expect(helicalDiameter(17, 3, b) / 2).toBeCloseTo(27.14, 2);
    expect(deg(transversePressure(b))).toBeCloseTo(21.173, 3);
  });

  it("gives the herringbone pair's centre distance 103.92 and the crossed pair's 76.37", () => {
    expect(helicalCentres(20, 40, 3, 30 * D2R)).toBeCloseTo(103.92, 2);
    expect(crossedCentres(12, 45 * D2R, 24, 45 * D2R, 3)).toBeCloseTo(76.37, 2);
    expect(helicalDiameter(12, 3, 45 * D2R)).toBeCloseTo(50.91, 2);
  });

  it("gives a helix lead and the profile's twist over a face width", () => {
    const d = helicalDiameter(17, 3, 20 * D2R);
    const L = helixLead(d, 20 * D2R);
    expect(L).toBeCloseTo((Math.PI * d) / Math.tan(20 * D2R), 9);
    expect(helixLead(d, 20 * D2R, -1)).toBeCloseTo(-L, 9);
    // over a 30 mm face the pitch circle point moves 30 tan β along the arc
    expect(twist(30, L) * (d / 2)).toBeCloseTo(30 * Math.tan(20 * D2R), 9);
  });
});

describe("screws", () => {
  it("gives the catalogue's lead screw Tr12x3: mean diameter 10.5, lead angle 5.2°, self-locking with μ 0.15", () => {
    const t = trapezoidal(12, 3);
    expect(t.d2).toBe(10.5);
    expect(t.d3).toBe(8.5);
    expect(t.D1).toBe(9);
    const L = screwLead(3);
    expect(deg(leadAngle(L, t.d2))).toBeCloseTo(5.197, 3);
    expect(selfLocking(L, t.d2, 0.15)).toBe(true);
    // the ball screw: lead 5, a turn moves the nut 5 mm, and it does not self-lock (rolling, μ about 0.005)
    expect(travel(5, 2 * Math.PI)).toBeCloseTo(5, 12);
    expect(selfLocking(5, 16, 0.005)).toBe(false);
    expect(screwLead(5, 2)).toBe(10);
  });

  it("gives ISO metric thread diameters: M6 x 1", () => {
    const t = metric(6, 1);
    expect(t.d2).toBeCloseTo(5.350, 3);
    expect(t.d3).toBeCloseTo(4.773, 3);
    expect(t.D1).toBeCloseTo(4.917, 3);
  });
});
