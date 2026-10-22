// Crank and slide forms of the library: the slider dyad's pin in a square slot (rpp), a dyad that poses the link it
// closes (so a later block reads that link's other points), point positions read as one number, a manual driver held
// by a control and scaled to its joint, an arc slot's residual, and the claim stats of reciprocating outputs.
import { describe, expect, it } from "vitest";
import { checkClaims, type Claim } from "../../src/checks/claims";
import { Kinematics, jointResidual, resolveJoint, xf } from "../../src/kin";
import type { Kin } from "../../src/kin/types";
import { recordById } from "../../src/catalog";

const ground = { id: "ground", role: "ground", shape: { type: "plate", rect: [100, 100] } };
const crank = (r: number) => ({ id: "crank", role: "driver", shape: { type: "link", length: r }, at: { joint: "O" } });
const O = { id: "O", type: "revolute", a: "ground", b: "crank", at: [0, 0, 0], axis: [0, 0, 1] } as const;
const input = { id: "input", joint: "O", kind: "rotary", range: [0, 360], default: 0 } as const;

/** Scotch yoke: a pin at r = 40 in a slot square to the slide. */
function yoke(): Kin {
  return {
    bodies: [ground, crank(40), { id: "yoke", role: "output", shape: { type: "slider" }, frame: { origin: [40, 0, 0] } }],
    joints: [
      O,
      { id: "A", type: "pin-in-slot", a: "crank", b: "yoke", at: [40, 0, 0], axis: [0, 0, 1], slot: { from: [40, -41, 0], to: [40, 41, 0] } },
      { id: "G", type: "prismatic", a: "yoke", b: "ground", at: [100, 0, 0], axis: [1, 0, 0] },
    ],
    drivers: [input],
    solve: [{ block: "slider-dyad", id: "yoke", in: { kind: "rpp", a: "A", p: "O", d: [1, 0, 0] }, out: "Y" }],
    points: [{ id: "Y", body: "yoke", local: [0, 0, 0] }],
    outputs: [{ id: "x", of: "Y", kind: "position", axis: "x" }, { id: "rA", of: "A", kind: "position", axis: "radius" }],
  } as unknown as Kin;
}

/** Offset slider-crank r 30, l 90, e 40: rod B on the slide y = e, its obliquity from a point on the slide line. */
function offsetCrank(): Kin {
  return {
    bodies: [ground, crank(30), { id: "rod", role: "link", shape: { type: "link" }, at: { joint: "A" } }, { id: "slider", role: "slider", shape: { type: "slider" }, at: { joint: "B" } }],
    joints: [
      O,
      { id: "A", type: "revolute", a: "crank", b: "rod", at: [30, 0, 0], axis: [0, 0, 1] },
      { id: "B", type: "revolute", a: "rod", b: "slider", at: ["30+sqrt(8100-1600)", 40, 0], axis: [0, 0, 1] },
      { id: "P", type: "prismatic", a: "slider", b: "ground", at: ["30+sqrt(8100-1600)", 40, 0], axis: [1, 0, 0] },
    ],
    params: [{ id: "l", value: 90, unit: "mm", min: 90, max: 90 }],
    drivers: [input],
    solve: [{ block: "slider-dyad", id: "rod", in: { kind: "rrp", a: "A", r: "l", p: [0, 40, 0], d: [1, 0, 0] }, out: "B" }],
    points: [{ id: "L", body: "ground", local: [0, 40, 0] }],
    outputs: [{ id: "x", of: "B", kind: "position", axis: "x" }, { id: "lean", of: "B", from: "A", to: "L", kind: "angle" }, { id: "gap", of: "B", kind: "position", relativeTo: "A" }, { id: "down", of: "B", kind: "position", axis: "-y" }],
  } as unknown as Kin;
}

describe("crank and slide forms", () => {
  it("rpp: the yoke follows x = r cos θ exactly, and the pin stays in its slot", () => {
    const K = new Kinematics(yoke());
    for (const deg of [0, 37, 90, 200, 311]) {
      const P = K.pose((deg * Math.PI) / 180);
      expect(P.outputs.x as number).toBeCloseTo(40 * Math.cos((deg * Math.PI) / 180), 9);
      expect(P.outputs.rA as number).toBeCloseTo(40, 9);
      const j = K.joints().find((r) => r.joint.id === "A")!;
      expect(Math.hypot(...jointResidual(j, P.bodies.get("crank")!, P.bodies.get("yoke")!))).toBeLessThan(1e-9);
    }
  });

  it("a point's position as one number: a component, a radius, a distance", () => {
    const P = new Kinematics(offsetCrank()).pose(1);
    const B = P.points.get("B")!;
    const A = P.points.get("A")!;
    expect(P.outputs.x).toBeCloseTo(B[0], 12);
    expect(P.outputs.gap).toBeCloseTo(90, 9);
    expect(P.outputs.down).toBeCloseTo(-B[1], 12);
    expect(Math.hypot(B[0] - A[0], B[1] - A[1])).toBeCloseTo(90, 9);
  });

  it("a dyad with a body poses that link so a later block can read its other points", () => {
    // crank 20, coupler 60, follower 50 about (40, 0), and a point C on the follower 30 past its pivot
    const kin = {
      bodies: [ground, crank(20), { id: "coupler", role: "link", shape: { type: "link" }, at: { joint: "A" } }, { id: "follower", role: "output", shape: { type: "link" }, at: { joint: "F" } }],
      joints: [
        O,
        { id: "A", type: "revolute", a: "crank", b: "coupler", at: [20, 0, 0], axis: [0, 0, 1] },
        { id: "B", type: "revolute", a: "coupler", b: "follower", at: [40 - 5, Math.sqrt(2500 - 25), 0], axis: [0, 0, 1] },
        { id: "F", type: "revolute", a: "ground", b: "follower", at: [40, 0, 0], axis: [0, 0, 1] },
      ],
      drivers: [input],
      solve: [{ block: "dyad", id: "d", in: { a: "F", b: "A", ra: 50, rb: 60, body: "follower" }, branch: "right", out: "B" }],
      points: [{ id: "C", body: "follower", local: [-30, 0, 0] }],
    } as unknown as Kin;
    const K = new Kinematics(kin);
    for (const u of [0, 1.1, 2.5, 4]) {
      const P = K.pose(u);
      const B = P.points.get("B")!;
      const C = P.points.get("C")!;
      // C stays 30 behind the pivot, on the line from B through F
      expect(Math.hypot(C[0] - 40, C[1])).toBeCloseTo(30, 9);
      expect((B[0] - 40) * C[1] - B[1] * (C[0] - 40)).toBeCloseTo(0, 6);
    }
  });

  it("a manual driver held by a control moves its joint by its scale from the record's default", () => {
    const kin = {
      bodies: [ground, { id: "arm", role: "link", shape: { type: "link" }, at: { joint: "R" } }],
      joints: [{ id: "R", type: "revolute", a: "ground", b: "arm", at: [0, 0, 0], axis: [0, 0, 1] }],
      drivers: [{ id: "die", joint: "R", kind: "manual", range: [-1, 1], default: 0.8, scale: -20 }],
      solve: [],
      points: [{ id: "T", body: "arm", local: [100, 0, 0] }],
    } as unknown as Kin;
    const K = new Kinematics(kin);
    const at = (die?: number) => K.pose(0.3, die === undefined ? undefined : { drivers: { die } }).points.get("T")!;
    expect(at()[1]).toBeCloseTo(0, 12);
    // die 1 is 0.2 past the default: the arm turns -4 degrees
    expect(Math.atan2(at(1)[1], at(1)[0]) * (180 / Math.PI)).toBeCloseTo(-4, 9);
    expect(Math.atan2(at(-1)[1], at(-1)[0]) * (180 / Math.PI)).toBeCloseTo(36, 9);
  });

  it("an arc slot: the pin's miss from the arc's radius", () => {
    const j = resolveJoint({ id: "s", type: "pin-in-slot", a: "p", b: "l", at: [100, 0, 0], axis: [0, 0, 1], slot: { arc: { center: [0, 0, 0], radius: 100 } } } as never, (v) => Number(v), (v) => (v as number[]).map(Number) as [number, number, number]);
    expect(jointResidual(j, xf.id(), xf.id())[0]).toBeCloseTo(0, 12);
    expect(jointResidual(j, xf.trans([5, 0, 0]), xf.id())[0]).toBeCloseTo(5, 12);
  });
});

describe("triad", () => {
  it("closes the radius rod, combination lever, union link and spindle of a valve gear at every die setting", () => {
    const kin = recordById("walschaerts-valve-gear")!.kin as unknown as Kin;
    const K = new Kinematics(kin);
    for (const die of [1, 0.8, 0, -1])
      for (const u of [0, 0.7, 2.1, 3.3, 4.9]) {
        const P = K.pose(u, { drivers: { die } });
        expect(P.fallback).toEqual([]);
        for (const j of K.joints({ drivers: { die } }).filter((r) => ["Rt", "Vs", "vguide", "Ub", "Uc"].includes(r.joint.id))) {
          const res = jointResidual(j, P.bodies.get(j.joint.a)!, P.bodies.get(j.joint.b)!);
          expect(Math.hypot(...res), `${j.joint.id} at die ${die}, u ${u}`).toBeLessThan(1e-9);
        }
      }
  });
});

describe("claim stats of reciprocating outputs", () => {
  const K = new Kinematics(offsetCrank());
  const outs = offsetCrank().outputs!;
  const one = (c: Partial<Claim>) => checkClaims(K, [{ text: "", output: "x", stat: "range", value: 0, tol: 1e9, ...c } as Claim], outs)[0]!;
  // closed form: the dead centres where crank and rod are in line, at asin(e / (l + r)) and 180 + asin(e / (l - r))
  const slow = 180 + (Math.asin(40 / 60) - Math.asin(40 / 120)) * (180 / Math.PI);
  it("time-ratio and the strokes between the extremes", () => {
    const quick = 360 - slow;
    expect(one({ stat: "phase", from: "max", to: "min" }).got!).toBeCloseTo(slow, 0);
    expect(one({ stat: "phase", from: "min", to: "max" }).got!).toBeCloseTo(quick, 0);
    expect(one({ stat: "time-ratio" }).got!).toBeCloseTo(slow / quick, 2);
  });

  it("phase against another output: the lag of the first harmonic, signed", () => {
    const kin = yoke();
    kin.outputs!.push({ id: "y", of: "A", kind: "position", axis: "y" } as never);
    const Ky = new Kinematics(kin);
    const r = checkClaims(Ky, [{ text: "", output: "y", stat: "phase", against: "x", value: 90, tol: 0.5 } as Claim], kin.outputs!)[0]!;
    // y = r sin θ lags x = r cos θ by 90 degrees
    expect(r.status).toBe("ok");
  });

  it("a claim that holds at a control setting", () => {
    const kin = {
      bodies: [ground, { id: "arm", role: "link", shape: { type: "link" }, at: { joint: "R" } }],
      joints: [{ id: "R", type: "revolute", a: "ground", b: "arm", at: [0, 0, 0], axis: [0, 0, 1] }],
      drivers: [{ id: "input", joint: "R", kind: "rotary", range: [0, 360], default: 0 }, { id: "off", kind: "manual", range: [0, 10], default: 0 }],
      solve: [],
      points: [{ id: "T", body: "arm", local: [100, 0, 0] }],
      outputs: [{ id: "tx", of: "T", kind: "position", axis: "x" }],
    } as unknown as Kin;
    const c = { text: "", output: "tx", stat: "range", value: 200, tol: 1e-6, when: { control: "k", value: 3 } } as Claim;
    const none = checkClaims(new Kinematics(kin), [c], kin.outputs!)[0]!;
    expect(none.status).toBe("uncheckable");
    const ok = checkClaims(new Kinematics(kin), [c], kin.outputs!, { controlsOf: (w) => ({ drivers: { off: Number(w.value) } }) })[0]!;
    expect(ok.status).toBe("ok");
  });
});
