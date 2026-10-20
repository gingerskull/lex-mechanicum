import { describe, expect, it } from "vitest";
import { Kinematics, TAU, pathAt, verifyK1, xf, type K1Report } from "../../src/kin";
import { beltDrive, camFollower, crankRocker, crankRockerNumeric, escapement, fiveBar, flexureHinge, gearPair, geneva, leadScrew, planetary, rackPinion, sarrus, sliderCrank } from "./fixtures";

const D = Math.PI / 180;
const rep = (r: K1Report): string => JSON.stringify({ ...r, jumps: r.jumps.slice(0, 3), failures: r.failures.slice(0, 3) });

describe("blocks composed from fixtures, K1 verified over the cycle", () => {
  it("gear pair: ratio and centre distance", () => {
    const k = new Kinematics(gearPair());
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    // the pinion turns three times per cycle, so a third of the way it has turned one turn; the gear −20/30 of that
    expect(k.pose(TAU / 3).values["g2-angle"]).toBeCloseTo(-360 * (20 / 30), 6);
  });

  it("rack and pinion: travel is r θ", () => {
    const k = new Kinematics(rackPinion());
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    expect(k.pose(Math.PI).values["rack-travel"]).toBeCloseTo(20 * Math.PI, 9);
  });

  it("planetary: ring held, sun in: carrier at zs / (zs + zr) of the sun, planets turn against it", () => {
    const k = new Kinematics(planetary());
    const r = verifyK1(k);
    expect(r.failures).toEqual([]);
    expect(r.ok, rep(r)).toBe(true);
    const p = k.pose(0.5);
    const sunTurn = 4 * 0.5 * (180 / Math.PI);
    expect(p.values["carrier-angle"]! / sunTurn).toBeCloseTo(24 / 96, 9);
    // planet: ωp = ωc − (zs / zp)(ωs − ωc) = ωc (1 + 1) − ωs with ωc = ωs / 4 → −ωs / 2
    expect(p.values["planet-angle"]! / sunTurn).toBeCloseTo(-0.5, 9);
  });

  it("cam: lift, dwells and the contact radius on the prime curve", () => {
    const k = new Kinematics(camFollower());
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    expect(k.pose(120 * D).values["lift"]).toBeCloseTo(12, 9);
    expect(k.pose(150 * D).values["lift"]).toBeCloseTo(12, 9);
    expect(k.pose(330 * D).values["lift"]).toBeCloseTo(0, 9);
    expect(Math.abs(k.pose(60 * D).values["pressure-angle"]!)).toBeGreaterThan(1);
  });

  it("lead screw: nut advances lead per turn, K1 checks the screw's helix", () => {
    const k = new Kinematics(leadScrew());
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    expect(k.pose(Math.PI).values["nut-travel"]).toBeCloseTo(8, 9);
  });

  it("Geneva: one index per turn, the pin is on the slot line while engaged", () => {
    const k = new Kinematics(geneva(4, 20));
    const r = verifyK1(k, { samples: 1440 });
    expect(r.failures).toEqual([]);
    expect(r.ok, rep(r)).toBe(true);
    expect(r.byJoint["Pin"] ?? 1).toBeLessThan(1e-9);
    const w0 = k.pose(0).values["wheel-angle"]!;
    const w1 = k.pose(TAU - 1e-9).values["wheel-angle"]!;
    expect(Math.abs(w1 - w0)).toBeCloseTo(90, 6);
  });

  it("five-bar: two inputs, the distal dyad closes", () => {
    const k = new Kinematics(fiveBar());
    const r = verifyK1(k);
    expect(r.failures).toEqual([]);
    expect(r.ok, rep(r)).toBe(true);
  });

  it("Sarrus: the top plate rises straight, 2 l sin θ", () => {
    const k = new Kinematics(sarrus());
    const r = verifyK1(k);
    expect(r.failures).toEqual([]);
    expect(r.ok, rep(r)).toBe(true);
    const p = k.pose(0.8);
    const top = p.bodies.get("top")!;
    expect(Math.hypot(top.t[0], top.t[1])).toBeLessThan(1e-12);
    const th = 10 + 60 * (0.5 - 0.5 * Math.cos(0.8));
    expect(top.t[2]).toBeCloseTo(80 * (Math.sin(th * D) - Math.sin(30 * D)), 9);
  });

  it("escapement: wheel steps one tooth per half swing", () => {
    const k = new Kinematics(escapement());
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    const a = k.pose(0.9).values["wheel-angle"]!;
    const b = k.pose(0.9 + Math.PI).values["wheel-angle"]!;
    expect(b - a).toBeCloseTo(12, 5);
  });

  it("flexure: the beam rotates about its pseudo-rigid-body pivot", () => {
    const k = new Kinematics(flexureHinge());
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    expect(k.pose(Math.PI).values["bend-state"]).toBeCloseTo(30 / 45, 9);
  });

  it("belt drive: the driven pulley turns by the radius ratio, the teeth ride the obround path", () => {
    const k = new Kinematics(beltDrive());
    const r = verifyK1(k, { samples: 720 });
    expect(r.maxResidual).toBeLessThan(1e-9);
    const p = k.pose(0.7);
    expect(p.values["p2-angle"]).toBeCloseTo(0.5 * ((2 * 0.7 * 180) / Math.PI), 6);
    const travel = p.values["belt-travel"]!;
    const here = pathAt({ C: 80, r: 20 }, 100 + travel);
    const p0 = pathAt({ C: 80, r: 20 }, 100);
    const t2 = xf.apply(p.bodies.get("t2")!, [p0.x, p0.y, 0]);
    expect(t2[0]).toBeCloseTo(here.x, 9);
    expect(t2[1]).toBeCloseTo(here.y, 9);
  });
});

describe("numeric fallback", () => {
  it("solves the same four-bar as the closed form, flagged, K1 < 1e-9", () => {
    const num = new Kinematics(crankRockerNumeric());
    const cf = new Kinematics(crankRocker());
    const r = verifyK1(num);
    expect(r.failures).toEqual([]);
    expect(r.maxResidual).toBeLessThan(1e-9);
    expect(r.fallback.length).toBeGreaterThan(0);
    for (const deg of [10, 90, 200, 333]) {
      const a = num.pose(deg * D).bodies.get("rocker")!;
      const b = cf.pose(deg * D).bodies.get("rocker")!;
      for (let i = 0; i < 9; i++) expect(a.R[i]!).toBeCloseTo(b.R[i]!, 6);
    }
    // random access still lands on the branch it continued on
    const early = num.pose(0.2).bodies.get("coupler")!;
    num.pose(5);
    const again = num.pose(0.2).bodies.get("coupler")!;
    for (let i = 0; i < 9; i++) expect(again.R[i]!).toBeCloseTo(early.R[i]!, 6);
  });
});

describe("controls", () => {
  it("parameter expressions move the geometry; the cycle repeats and K1 holds at each setting", () => {
    const k = new Kinematics(sliderCrank());
    for (const params of [{ r: 20 }, { r: 35, l: 100 }, { r: 25, e: 0 }] as Record<string, number>[]) {
      const r = verifyK1(k, { controls: { params } });
      expect(r.ok, JSON.stringify(params) + rep(r)).toBe(true);
      const stroke = (k.pose(Math.PI, { params }).outputs["slider-x"] as number) - (k.pose(0, { params }).outputs["slider-x"] as number);
      expect(Math.abs(stroke)).toBeGreaterThan(2 * (params.r ?? 30) - 3);
      expect(Math.abs(stroke)).toBeLessThanOrEqual(2 * (params.r ?? 30) + 1e-9);
    }
  });

  it("a selector sets parameters of the setting it names", () => {
    const k = new Kinematics(sliderCrank());
    const strokeOf = (choice: string) => {
      const c = { select: { stroke: choice } };
      const a = k.pose(0, c).outputs["slider-x"] as number;
      const b = k.pose(Math.PI, c).outputs["slider-x"] as number;
      expect(verifyK1(k, { controls: c, samples: 180 }).ok).toBe(true);
      return Math.abs(a - b);
    };
    expect(strokeOf("short")).toBeLessThan(strokeOf("long"));
    expect(strokeOf("short")).toBeGreaterThan(36);
  });

  it("a design choice flips the closure and K1 says the reference geometry no longer agrees", () => {
    const k = new Kinematics(sliderCrank());
    const near = verifyK1(k, { controls: { design: { closure: "near" } }, samples: 180 });
    expect(near.referenceAgreement).toBeGreaterThan(1);
    expect(near.ok).toBe(false);
  });

  it("an unreachable setting is reported as a failure, not a wrong pose", () => {
    const k = new Kinematics(sliderCrank());
    const r = verifyK1(k, { controls: { params: { r: 40, l: 30 } }, samples: 90 });
    expect(r.ok).toBe(false);
    expect(r.maxResidual > 1e-6 || r.failures.length > 0).toBe(true);
  });
});
