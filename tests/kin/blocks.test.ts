import { describe, expect, it } from "vitest";
import {
  PRB,
  type CamSchedule,
  bennettAngles,
  bennettB,
  bennettClosure,
  bennettCondition,
  camMotion,
  centreDistance,
  differentialAdvance,
  dyadRPR,
  dyadRRP,
  dyadRRR,
  ellipticalAngle,
  ellipticalRatio,
  evalExpr,
  fiveBarFK,
  fiveBarIK,
  flatContactOffset,
  flexureEnd,
  genevaAngle,
  genevaEngagement,
  genevaIndex,
  hookeAngle,
  hookeSpeedRatio,
  lawRise,
  meshPhase,
  meshRatio,
  pathAt,
  pathLength,
  pitchPoint,
  pressureAngle,
  rackTravel,
  sarrusPair,
  screwAdvance,
  simulateEscapement,
  sprocketRadius,
  starWheelAngle,
  timeMap,
  willis,
} from "../../src/kin";

const D = Math.PI / 180;
const TAU = Math.PI * 2;

describe("dyad", () => {
  it("RRR: 3-4-5 style closure on both branches", () => {
    const s = dyadRRR([0, 0, 0], [5, 0, 0], 3, 4);
    expect(s.reachable).toBe(true);
    expect(s.roots[0][0]).toBeCloseTo(1.8, 12);
    expect(s.roots[0][1]).toBeCloseTo(2.4, 12);
    expect(s.roots[1][0]).toBeCloseTo(1.8, 12);
    expect(s.roots[1][1]).toBeCloseTo(-2.4, 12);
  });

  it("RRR: left branch flips with the direction a→b, unreachable links are flagged", () => {
    const s = dyadRRR([0, 0, 0], [-5, 0, 0], 3, 4);
    expect(s.roots[0][1]).toBeCloseTo(-2.4, 12); // left of a→b seen from +z is now −y
    expect(dyadRRR([0, 0, 0], [10, 0, 0], 3, 4).reachable).toBe(false);
    // tangent: h = 0, one root
    const t = dyadRRR([0, 0, 0], [7, 0, 0], 3, 4);
    expect(t.h).toBeCloseTo(0, 12);
    expect(t.roots[0][0]).toBeCloseTo(3, 12);
  });

  it("RRR works in any plane through a (normal n)", () => {
    const s = dyadRRR([0, 0, 0], [0, 5, 0], 3, 4, [1, 0, 0]);
    expect(Math.abs(s.roots[0][0])).toBeLessThan(1e-12);
    expect(Math.hypot(s.roots[0][1], s.roots[0][2])).toBeCloseTo(3, 12);
  });

  it("RRP: far and near closures of a crank and a slide", () => {
    const s = dyadRRP([0, 0, 0], 5, [0, 3, 0], [1, 0, 0]);
    expect(s.s[0]).toBeCloseTo(4, 12);
    expect(s.s[1]).toBeCloseTo(-4, 12);
    expect(s.points[0][1]).toBeCloseTo(3, 12);
    expect(dyadRRP([0, 0, 0], 2, [0, 3, 0], [1, 0, 0]).reachable).toBe(false);
  });

  it("RPR: slot angle and pin distance", () => {
    const r = dyadRPR([0, 0, 0], [3, 3, 0]);
    expect(r.angle).toBeCloseTo(Math.PI / 4, 12);
    expect(r.dist).toBeCloseTo(3 * Math.SQRT2, 12);
  });
});

describe("five-bar", () => {
  const g = { A1: [-30, 0, 0] as [number, number, number], A2: [30, 0, 0] as [number, number, number], l1: 40, l2: 40, l3: 60, l4: 60 };
  it("inverse kinematics inverts the forward step on every elbow choice", () => {
    for (const [th1, th2] of [
      [100 * D, 70 * D],
      [120 * D, 40 * D],
      [90 * D, 90 * D],
    ] as [number, number][]) {
      const fk = fiveBarFK(g, th1, th2, 1);
      // the end point sees elbow 1 on the +n side of A1→P iff cross > 0; read it off and ask for the same
      const side = (A: number[], E: number[], P: number[]) => ((E[0]! - A[0]!) * (P[1]! - A[1]!) - (E[1]! - A[1]!) * (P[0]! - A[0]!) > 0 ? -1 : 1);
      const e1 = side(g.A1, fk.E1, fk.P) as 1 | -1;
      const e2 = side(g.A2, fk.E2, fk.P) as 1 | -1;
      const ik = fiveBarIK(g, fk.P, e1, e2);
      expect(ik).not.toBeNull();
      expect(Math.cos(ik!.th1)).toBeCloseTo(Math.cos(th1), 9);
      expect(Math.sin(ik!.th1)).toBeCloseTo(Math.sin(th1), 9);
      expect(Math.cos(ik!.th2)).toBeCloseTo(Math.cos(th2), 9);
      expect(Math.sin(ik!.th2)).toBeCloseTo(Math.sin(th2), 9);
    }
  });
  it("a target out of reach has no solution", () => {
    expect(fiveBarIK(g, [0, 500, 0])).toBeNull();
  });
  it("the end point is 60 from both elbows", () => {
    const fk = fiveBarFK(g, 100 * D, 80 * D, 1);
    expect(Math.hypot(fk.P[0] - fk.E1[0], fk.P[1] - fk.E1[1])).toBeCloseTo(60, 9);
    expect(Math.hypot(fk.P[0] - fk.E2[0], fk.P[1] - fk.E2[1])).toBeCloseTo(60, 9);
  });
});

describe("Hooke and homokinetic", () => {
  it("tan θ2 = tan θ1 / cos β, on the same turn as θ1", () => {
    for (const beta of [10, 25, 45].map((x) => x * D))
      for (let deg = 5; deg < 720; deg += 17) {
        const t1 = deg * D;
        if (Math.abs(Math.cos(t1)) < 1e-6) continue;
        const t2 = hookeAngle(t1, beta);
        expect(Math.tan(t2)).toBeCloseTo(Math.tan(t1) / Math.cos(beta), 8);
        expect(Math.abs(t2 - t1)).toBeLessThan(Math.PI / 2);
      }
  });
  it("is continuous across the quadrant boundaries and advances 2π per turn", () => {
    let prev = hookeAngle(0, 0.5);
    for (let deg = 1; deg <= 720; deg++) {
      const t = hookeAngle(deg * D, 0.5);
      expect(t - prev).toBeGreaterThan(0);
      expect(t - prev).toBeLessThan(0.1);
      prev = t;
    }
    expect(hookeAngle(TAU, 0.5)).toBeCloseTo(TAU, 12);
  });
  it("speed ratio is 1/cos β at θ1 = 0 and cos β at 90°, and matches the derivative", () => {
    const beta = 30 * D;
    expect(hookeSpeedRatio(0, beta)).toBeCloseTo(1 / Math.cos(beta), 12);
    expect(hookeSpeedRatio(Math.PI / 2, beta)).toBeCloseTo(Math.cos(beta), 12);
    const h = 1e-6;
    const th = 0.7;
    const d = (hookeAngle(th + h, beta) - hookeAngle(th - h, beta)) / (2 * h);
    expect(hookeSpeedRatio(th, beta)).toBeCloseTo(d, 6);
  });
});

describe("Bennett", () => {
  const p = (() => {
    const a = 60;
    const alpha = 40 * D;
    const beta = 70 * D;
    return { a, b: bennettB(a, alpha, beta), alpha, beta };
  })();
  it("satisfies Bennett's condition and closes the loop at every crank angle", () => {
    expect(Math.abs(bennettCondition(p))).toBeLessThan(1e-12);
    for (let deg = -170; deg <= 170; deg += 7) expect(bennettClosure(p, deg * D)).toBeLessThan(1e-12);
  });
  it("opposite joints turn equal and opposite, and the second angle follows tan(θ2/2) tan(θ1/2) = k", () => {
    const k = Math.sin((p.beta + p.alpha) / 2) / Math.sin((p.beta - p.alpha) / 2);
    const t = bennettAngles(p, 1.1);
    expect(t.th3).toBeCloseTo(-t.th1, 12);
    expect(t.th4).toBeCloseTo(-t.th2, 12);
    expect(Math.tan(t.th1 / 2) * Math.tan(t.th2 / 2)).toBeCloseTo(k, 12);
  });
  it("a linkage that violates the condition does not close", () => {
    const bad = { ...p, b: p.b * 1.1 };
    expect(bennettClosure(bad, 1)).toBeGreaterThan(1e-3);
  });
});

describe("Sarrus pair", () => {
  it("equal links: the top rises 2 l sin θ with no lateral drift", () => {
    for (const th of [10, 40, 85].map((x) => x * D)) {
      const s = sarrusPair(50, 50, th);
      expect(s.reachable).toBe(true);
      expect(s.phi).toBeCloseTo(th, 12);
      expect(s.z).toBeCloseTo(100 * Math.sin(th), 12);
    }
  });
  it("unequal links keep the top over its base: l2 cos φ = l1 cos θ", () => {
    const s = sarrusPair(40, 60, 50 * D);
    expect(60 * Math.cos(s.phi)).toBeCloseTo(40 * Math.cos(50 * D), 12);
    expect(s.z).toBeCloseTo(40 * Math.sin(50 * D) + 60 * Math.sin(s.phi), 12);
  });
  it("links too short to reach are flagged", () => {
    expect(sarrusPair(60, 40, 10 * D).reachable).toBe(false);
  });
});

describe("gear mesh", () => {
  it("ratios: external reverses, internal keeps the sense, crossed takes the hand", () => {
    expect(meshRatio({ za: 20, zb: 30 })).toBeCloseTo(-2 / 3, 12);
    expect(meshRatio({ za: 20, zb: 50, internal: true })).toBeCloseTo(0.4, 12);
    expect(meshRatio({ za: 1, zb: 30, sign: -1 })).toBeCloseTo(-1 / 30, 12);
    expect(meshRatio({ za: 1, zb: 30, sign: 1 })).toBeCloseTo(1 / 30, 12);
  });
  it("centre distance: sum for external, difference for internal", () => {
    expect(centreDistance({ za: 20, zb: 30 }, 2)).toBe(50);
    expect(centreDistance({ za: 20, zb: 50, internal: true }, 2)).toBe(30);
  });
  it("the phase puts a gap of b opposite every tooth of a on the line of centres", () => {
    const za = 20;
    const zb = 30;
    const pb = TAU / zb;
    for (let k = 0; k < za; k++) {
      const tha = (TAU * k) / za;
      const thb = meshPhase(zb) - (za / zb) * tha;
      // b's teeth sit at thb + j pb; the gap between two is half a pitch from them; line of centres is at π from b
      const off = (((Math.PI - thb) / pb) % 1 + 1) % 1;
      expect(Math.abs(off - 0.5)).toBeLessThan(1e-9);
    }
  });
  it("rack travel is the pitch radius times the turn", () => {
    expect(rackTravel(12, 0.5)).toBe(6);
  });
  it("elliptical pair: the mate turns one turn per turn, ratio is r1/r2 and equals the derivative", () => {
    const e = 0.3;
    expect(ellipticalAngle(e, TAU)).toBeCloseTo(TAU, 12);
    expect(ellipticalAngle(e, 0)).toBe(0);
    for (const phi of [0.4, 1.3, 2.9, 4.1, 5.5]) {
      const h = 1e-6;
      const d = (ellipticalAngle(e, phi + h) - ellipticalAngle(e, phi - h)) / (2 * h);
      expect(ellipticalRatio(e, phi)).toBeCloseTo(d, 6);
      // pitch curves r1 = p/(1 − e cos φ), r2 = 2a − r1: ratio r1/r2
      const a = 100;
      const r1 = (a * (1 - e * e)) / (1 - e * Math.cos(phi));
      expect(ellipticalRatio(e, phi)).toBeCloseTo(r1 / (2 * a - r1), 9);
    }
    expect(ellipticalRatio(e, 0)).toBeCloseTo((1 + e) / (1 - e), 12);
  });
});

describe("Willis train", () => {
  const spec = { zs: 24, zr: 72, zp: 24 };
  it("sun fixed, ring in: carrier turns zr / (zs + zr) of the ring", () => {
    const w = willis(spec, { sun: 0, ring: 1 });
    expect(w.carrier).toBeCloseTo(72 / 96, 12);
  });
  it("ring fixed, sun in: carrier turns zs / (zs + zr) of the sun", () => {
    expect(willis(spec, { ring: 0, sun: 1 }).carrier).toBeCloseTo(24 / 96, 12);
  });
  it("carrier fixed: the ring turns against the sun by zs / zr", () => {
    expect(willis(spec, { carrier: 0, sun: 1 }).ring).toBeCloseTo(-24 / 72, 12);
  });
  it("two drivers: carrier = (zs ωs + zr ωr) / (zs + zr)", () => {
    const w = willis(spec, { sun: 1, ring: 2 });
    expect(w.carrier).toBeCloseTo((24 * 1 + 72 * 2) / 96, 12);
  });
  it("solves whichever port is missing and keeps the relation", () => {
    const w = willis(spec, { carrier: 0.4, sun: 1.5 });
    expect((w.sun - w.carrier) / (w.ring - w.carrier)).toBeCloseTo(-72 / 24, 12);
  });
  it("planet: ωp = ωc − (zs / zp)(ωs − ωc)", () => {
    const w = willis(spec, { sun: 3, ring: 0 });
    expect(w.planet).toBeCloseTo(w.carrier - (24 / 24) * (3 - w.carrier), 12);
  });
  it("differential (ring = sun): carrier is the mean", () => {
    const w = willis({ zs: 20, zr: 20 }, { sun: 2, ring: 6 });
    expect(w.carrier).toBeCloseTo(4, 12);
  });
  it("needs exactly two known ports", () => {
    expect(() => willis(spec, { sun: 1 })).toThrow();
  });
});

describe("cam", () => {
  it("laws rise from 0 to 1 with zero end velocity (cycloidal, harmonic, 3-4-5)", () => {
    for (const law of ["cycloidal", "harmonic", "poly345"] as const) {
      expect(lawRise(law, 0).s).toBeCloseTo(0, 12);
      expect(lawRise(law, 1).s).toBeCloseTo(1, 12);
      expect(lawRise(law, 0.5).s).toBeCloseTo(0.5, 12);
      expect(Math.abs(lawRise(law, 0).v)).toBeLessThan(1e-12);
      expect(Math.abs(lawRise(law, 1).v)).toBeLessThan(1e-12);
    }
    expect(lawRise("uniform", 0.25).s).toBe(0.25);
  });
  it("the velocity is the derivative of the displacement", () => {
    for (const law of ["cycloidal", "harmonic", "poly345"] as const)
      for (const x of [0.1, 0.37, 0.8]) {
        const h = 1e-6;
        expect(lawRise(law, x).v).toBeCloseTo((lawRise(law, x + h).s - lawRise(law, x - h).s) / (2 * h), 6);
      }
  });
  const sched: CamSchedule = {
    lift: 12,
    segments: [
      { kind: "rise", span: 120 * D, law: "cycloidal" },
      { kind: "dwell", span: 60 * D },
      { kind: "return", span: 120 * D, law: "harmonic" },
      { kind: "dwell", span: 60 * D },
    ],
  };
  it("rise, dwell, return, dwell: lift, dwells, periodic and continuous", () => {
    expect(camMotion(sched, 0).s).toBeCloseTo(0, 12);
    expect(camMotion(sched, 120 * D).s).toBeCloseTo(12, 9);
    expect(camMotion(sched, 150 * D).s).toBeCloseTo(12, 12);
    expect(camMotion(sched, 150 * D).v).toBe(0);
    expect(camMotion(sched, 300 * D).s).toBeCloseTo(0, 9);
    expect(camMotion(sched, 330 * D).s).toBeCloseTo(0, 9);
    expect(camMotion(sched, 360 * D + 60 * D).s).toBeCloseTo(camMotion(sched, 60 * D).s, 12);
    expect(camMotion(sched, -60 * D).s).toBeCloseTo(camMotion(sched, 300 * D).s, 12);
    let prev = camMotion(sched, 0).s;
    for (let deg = 1; deg <= 360; deg++) {
      const s = camMotion(sched, deg * D).s;
      expect(Math.abs(s - prev)).toBeLessThan(0.5);
      prev = s;
    }
  });
  it("ds/dθ matches the displacement", () => {
    for (const deg of [20, 70, 200, 250]) {
      const h = 1e-6;
      expect(camMotion(sched, deg * D).v).toBeCloseTo((camMotion(sched, deg * D + h).s - camMotion(sched, deg * D - h).s) / (2 * h), 5);
    }
  });
  it("pressure angle: tan φ = (v − e) / (√(rp² − e²) + s); flat follower has an offset instead", () => {
    expect(pressureAngle({ rb: 30 }, 10, 5)).toBeCloseTo(Math.atan(5 / 40), 12);
    expect(pressureAngle({ rb: 30, e: 6 }, 10, 5)).toBeCloseTo(Math.atan2(5 - 6, Math.sqrt(900 - 36) + 10), 12);
    expect(flatContactOffset(7)).toBe(7);
  });
  it("pitch point lies at the pitch radius from the cam centre", () => {
    const p = pitchPoint({ rb: 30, e: 6 }, 10, 0.9);
    expect(Math.hypot(p[0], p[1])).toBeCloseTo(Math.hypot(6, Math.sqrt(900 - 36) + 10), 12);
  });
});

describe("screw, convey, flexure", () => {
  it("advance is the lead per turn, by hand; differential is the difference", () => {
    expect(screwAdvance(4, TAU)).toBeCloseTo(4, 12);
    expect(screwAdvance(4, TAU, "left")).toBeCloseTo(-4, 12);
    expect(screwAdvance(4, Math.PI / 2)).toBeCloseTo(1, 12);
    expect(differentialAdvance(1.5, 1.25, TAU * 4)).toBeCloseTo(1, 12);
  });
  it("the obround path is closed, continuous and has the right length", () => {
    const path = { C: 80, r: 20 };
    expect(pathLength(path)).toBeCloseTo(160 + 40 * Math.PI, 12);
    const a = pathAt(path, 0);
    const b = pathAt(path, pathLength(path));
    expect(b.x).toBeCloseTo(a.x, 9);
    expect(b.y).toBeCloseTo(a.y, 9);
    let prev = pathAt(path, 0);
    for (let s = 0.5; s < pathLength(path); s += 0.5) {
      const q = pathAt(path, s);
      expect(Math.hypot(q.x - prev.x, q.y - prev.y)).toBeLessThan(0.5 + 1e-9);
      prev = q;
    }
    expect(pathAt(path, 80 + Math.PI * 20 / 2).heading).toBeCloseTo(Math.PI / 2, 9);
    expect(pathAt(path, 80 + Math.PI * 20 + 40).y).toBeCloseTo(20, 9);
  });
  it("sprocket pitch radius", () => {
    expect(sprocketRadius(12.7, 16)).toBeCloseTo(12.7 / (2 * Math.sin(Math.PI / 16)), 12);
  });
  it("pseudo-rigid-body flexure end follows a = l(1 − γ(1 − cos Θ)), b = γ l sin Θ", () => {
    const e0 = flexureEnd(50, 0);
    expect(e0.a).toBeCloseTo(50, 12);
    expect(e0.b).toBe(0);
    const e = flexureEnd(50, Math.PI / 2);
    expect(e.a).toBeCloseTo(50 * (1 - PRB.gamma), 12);
    expect(e.b).toBeCloseTo(PRB.gamma * 50, 12);
    expect(e.bend).toBeCloseTo(1, 12);
  });
});

describe("Geneva and star wheel", () => {
  it("one index per crank turn, held between, engaged within ±(π/2 − π/n)", () => {
    for (const n of [3, 4, 6, 8]) {
      const half = genevaEngagement(n);
      expect(half).toBeCloseTo(Math.PI / 2 - Math.PI / n, 12);
      expect(genevaIndex(n, half + 0.01).engaged).toBe(false);
      expect(genevaIndex(n, 0).engaged).toBe(true);
      expect(genevaAngle(n, 0)).toBeCloseTo(Math.PI / n, 12);
      // at the end of the engagement the wheel has turned a full index
      expect(genevaAngle(n, half) - genevaAngle(n, -half)).toBeCloseTo(TAU / n, 9);
      expect(genevaAngle(n, TAU) - genevaAngle(n, 0)).toBeCloseTo(TAU / n, 12);
      expect(genevaAngle(n, 10 * TAU + 0.3) - genevaAngle(n, 0.3)).toBeCloseTo((10 * TAU) / n, 9);
    }
  });
  it("wheel speed ratio is zero at the entry and exit (no shock) and peaks at the line of centres", () => {
    const n = 4;
    const half = genevaEngagement(n);
    expect(genevaIndex(n, half - 1e-9).ratio).toBeCloseTo(0, 6);
    const k = 1 / Math.sin(Math.PI / n);
    expect(genevaIndex(n, 0).ratio).toBeCloseTo(1 / (k - 1), 9);
    const h = 1e-6;
    const num = (genevaIndex(n, 0.3 + h).angle - genevaIndex(n, 0.3 - h).angle) / (2 * h);
    expect(genevaIndex(n, 0.3).ratio).toBeCloseTo(num, 6);
  });
  it("star wheel follows the same law", () => {
    expect(starWheelAngle(5, 0.2)).toBe(genevaAngle(5, 0.2));
  });
});

describe("escapement simulation", () => {
  const z = 30;
  const pitch = TAU / z;
  const spec = { kind: "anchor" as const, z, amplitude: 4 * D, lock: 0.35, drop: 0.2, recoil: 0.12 };
  const sim = simulateEscapement(spec);
  it("the wheel advances exactly one pitch per half swing and the cycle repeats", () => {
    for (const u of [0.2, 1.1, 2.5, 4.0, 5.9]) {
      expect(sim.at(u + Math.PI).wheel - sim.at(u).wheel).toBeCloseTo(pitch, 6);
      expect(sim.at(u + TAU).wheel - sim.at(u).wheel).toBeCloseTo(2 * pitch, 6);
    }
  });
  it("is locked at the extremes of the swing and released near the centre", () => {
    expect(sim.at(Math.PI / 2).locked).toBe(true);
    expect(sim.at(3 * Math.PI / 2).locked).toBe(true);
    expect(sim.at(0).locked).toBe(false);
  });
  it("never runs backwards by more than the recoil", () => {
    let maxBack = 0;
    for (let i = 1; i < sim.table.length; i++) maxBack = Math.max(maxBack, sim.table[i - 1]!.wheel - sim.table[i]!.wheel);
    expect(maxBack).toBeLessThan(pitch * spec.recoil);
    // dead-beat (no recoil): the wheel never moves back at all
    const dead = simulateEscapement({ ...spec, recoil: 0 });
    for (let i = 1; i < dead.table.length; i++) expect(dead.table[i]!.wheel).toBeGreaterThanOrEqual(dead.table[i - 1]!.wheel - 1e-12);
  });
  it("the pallet swings with amplitude A sin u", () => {
    expect(sim.at(Math.PI / 2).pallet).toBeCloseTo(4 * D, 12);
    expect(sim.at(Math.PI).pallet).toBeCloseTo(0, 9);
  });
});

describe("time map and expressions", () => {
  it("is the identity without a span and a bijection with one", () => {
    const id = timeMap(undefined);
    expect(id.uOf(0.25)).toBeCloseTo(TAU / 4, 12);
    const m = timeMap({ span: [160, 200], slow: 3 });
    for (const t of [0, 0.1, 0.4, 0.5, 0.77, 0.99]) expect(m.tOf(m.uOf(t))).toBeCloseTo(t, 9);
    expect(m.uOf(0)).toBeCloseTo(0, 12);
    // slower inside the span: a span of 40° takes 3 × as long as 40° elsewhere
    const dtIn = m.tOf(200 * D) - m.tOf(160 * D);
    const dtOut = m.tOf(40 * D) - m.tOf(0);
    expect(dtIn / dtOut).toBeCloseTo(3, 9);
  });
  it("handles a span that wraps past 360", () => {
    const m = timeMap({ span: [340, 20], slow: 2 });
    for (const t of [0, 0.2, 0.6, 0.95]) expect(m.tOf(m.uOf(t))).toBeCloseTo(t, 9);
  });
  it("expressions: arithmetic, precedence, names, degrees", () => {
    const look = (n: string) => ({ a: 4, b: 3 })[n as "a" | "b"];
    expect(evalExpr("2*a+b", look)).toBe(11);
    expect(evalExpr("-(a-b)^2 + 10/4", look)).toBeCloseTo(1.5, 12);
    expect(evalExpr("sqrt(a*a+b*b)", look)).toBe(5);
    expect(evalExpr("cos(60)*a", look)).toBeCloseTo(2, 12);
    expect(() => evalExpr("a + c", look)).toThrow();
    expect(() => evalExpr("a +", look)).toThrow();
  });
});
