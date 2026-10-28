// A plate cam with a swinging roller follower (the cam-rocker block) and its outline (src/builder/shapes/swingcam.ts):
// the roller centre stands at the pitch radius on the rocker's arc, K1 holds over the cycle, and the cam's outline is the
// roller's envelope.
import { describe, expect, it } from "vitest";
import { Kinematics } from "../../src/kin/compose";
import type { Kin } from "../../src/kin/types";
import { verifyK1 } from "../../src/kin/verify";
import { swingRoller, swingSide } from "../../src/kin/steps/camrocker";
import { offsetRing, swingPitchCurve } from "../../src/builder/shapes/swingcam";
import { camMotion, scheduleOf } from "../../src/kin/blocks/cam";

const D = Math.PI / 180;
// cam on C at the origin turned by the input, rocker pivot G, roller arm 32 to the roller centre at rb = 33 from C
const C = [0, 0, 0] as [number, number, number];
const G = [-34, -30, 0] as [number, number, number];
const P0 = swingRoller(C, G, 32, 33, [0, 0, 1], -1)!;
const cam = { schedule: [{ kind: "dwell" as const, span: 120 }, { kind: "rise" as const, span: 90, law: "cycloidal" }, { kind: "dwell" as const, span: 30 }, { kind: "return" as const, span: 90, law: "cycloidal" }, { kind: "dwell" as const, span: 30 }], lift: 12, rb: 33, theta0: 0 };

function swingKin(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground", shape: { type: "plate", rect: [100, 100] }, at: { frame: { origin: [0, 0, -8] } } },
      { id: "cam", role: "driver", shape: { type: "cam", form: "rocker", rollerRadius: 5, thick: 8, bore: 10 }, at: { joint: "O" } },
      { id: "rocker", role: "follower", shape: { type: "link", length: 32, boss: [8, 7] }, at: { joint: "G" } },
      { id: "roller", role: "follower", shape: { type: "disc", radius: 5, thickness: 8 }, at: { joint: "R" } },
    ],
    joints: [
      { id: "O", type: "revolute", a: "ground", b: "cam", at: C, axis: [0, 0, 1] },
      { id: "G", type: "revolute", a: "ground", b: "rocker", at: G, axis: [0, 0, 1] },
      { id: "R", type: "revolute", a: "rocker", b: "roller", at: P0, axis: [0, 0, 1] },
      { id: "K", type: "cam-contact", a: "roller", b: "cam", at: P0, axis: [0, 0, 1], ca: C, follower: "roller", cam } as never,
    ],
    params: [],
    design: [],
    drivers: [{ id: "input", joint: "O", kind: "rotary", range: [0, 360], default: 0 }],
    solve: [{ block: "cam-rocker", id: "rise", joints: ["K", "G", "R"], in: { joint: "K", input: "input", pivot: "G", follower: ["rocker", "roller"] }, out: { s: "s", angle: "swing", pressure: "pressure" } }],
    points: [],
    outputs: [{ id: "swing", of: "rocker", kind: "angle", unit: "deg" }],
    fallback: null,
  } as unknown as Kin;
}

describe("cam-rocker block", () => {
  it("keeps the roller centre at the pitch radius on the rocker's arc (K1)", () => {
    const k = new Kinematics(swingKin());
    const rep = verifyK1(k, { samples: 120 });
    expect(rep.maxResidual).toBeLessThan(1e-9);
    const sched = scheduleOf(cam, (v) => Number(v), () => "cycloidal");
    for (const u of [0, 150, 165, 230, 300]) {
      const p = k.pose(u * D);
      const X = p.bodies.get("rocker")!;
      const R = [X.R[0]! * P0[0] + X.R[1]! * P0[1] + X.t[0], X.R[3]! * P0[0] + X.R[4]! * P0[1] + X.t[1]];
      expect(Math.hypot(R[0]!, R[1]!)).toBeCloseTo(33 + camMotion(sched, u * D).s, 9);
      expect(Math.hypot(R[0]! - G[0], R[1]! - G[1])).toBeCloseTo(32, 9);
    }
    // the swing is zero on the base circle and the pressure angle a finite angle under 90
    expect(k.pose(60 * D).values.swing).toBeCloseTo(0, 9);
    const pr = k.pose(165 * D).values.pressure!;
    expect(pr).toBeGreaterThan(0);
    expect(pr).toBeLessThan(90);
  });

  it("finds the side of the reference roller and refuses a pitch radius the arm cannot reach", () => {
    expect(swingSide(C, G, P0, [0, 0, 1])).toBe(-1);
    expect(swingRoller(C, G, 32, 200, [0, 0, 1], 1)).toBeNull();
  });
});

describe("swing cam outline", () => {
  it("is the pitch curve offset inward by the roller radius", () => {
    const sched = scheduleOf(cam, (v) => Number(v), () => "cycloidal");
    const pitch = swingPitchCurve({ C, axis: [0, 0, 1], G, n: [0, 0, 1], P0, rb: 33, th0: 0, s: (th) => camMotion(sched, th).s }, (p) => [p[0], p[1]], 360);
    const r = pitch.map(([x, y]) => Math.hypot(x, y));
    expect(Math.min(...r)).toBeCloseTo(33, 6);
    expect(Math.max(...r)).toBeCloseTo(45, 6);
    const outline = offsetRing(pitch, -5);
    // every pitch point stands one roller radius from the outline, near its own offset point
    for (let i = 0; i < pitch.length; i += 7) {
      const p = pitch[i]!;
      const d = Math.min(...outline.map(([x, y]) => Math.hypot(x - p[0], y - p[1])));
      expect(d).toBeGreaterThan(4.9);
      expect(d).toBeLessThan(5.05);
    }
  });
});
