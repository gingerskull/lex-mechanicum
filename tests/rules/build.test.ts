// The rules that run over the whole build: base, standoffs, stops, drive, belt, feet, lubrication, timing, locking,
// materials.
import { describe, expect, it } from "vitest";
import { TAU } from "../../src/core/geom";
import { assembleWith } from "../../src/assemble";
import { solidPose } from "../../src/assemble/pose";
import fourBar from "../../src/mechanisms/four-bar/model";
import geneva from "../../src/mechanisms/geneva/model";
import { hullOf } from "../../src/hardware/primitives";
import { defineMechanism } from "../../src/model/define";
import { P } from "../../src/parts";
import { V } from "../../src/core/vec";
import { base } from "../../src/rules/base";
import { feet } from "../../src/rules/feet";
import { j8 } from "../../src/rules/j8-belt";
import { lubrication } from "../../src/rules/lubrication";
import { standoffs } from "../../src/rules/standoffs";
import { stops } from "../../src/rules/stops";
import { timingMarks } from "../../src/rules/timing-marks";
import { j1Model, j2Model, j3Model, j5Model, j6Model, j7Model, manualModel, oscModel } from "../fixtures/models";
import { contextBefore, kinds, run } from "./helpers";

describe("base", () => {
  it("lays an 8 mm plate 2 mm under the lowest part with four mounting holes, engraved paths and a scale", () => {
    const ctx = contextBefore(fourBar, base);
    const [b] = run(ctx, base);
    expect([b!.z0, b!.z1]).toEqual([-10, -2]);
    expect(b!.holes).toHaveLength(4);
    expect(b!.marks.some((m) => m.kind === "engrave")).toBe(true);
    expect(b!.marks.filter((m) => m.kind === "scale").length).toBeGreaterThan(10);
  });
});

describe("feet", () => {
  it("puts four rubber feet on the corner-arc centres when nothing hangs there", () => {
    const ctx = contextBefore(j1Model, feet);
    expect(kinds(run(ctx, feet))).toEqual({ foot: 4 });
  });
});

describe("standoffs", () => {
  it("seats each slide rail on ground pads, screwed into the base at each and dowelled at the ends", () => {
    const ctx = contextBefore(j5Model, standoffs);
    const added = run(ctx, standoffs);
    const pads = added.filter((s) => s.kind === "standoff");
    // two rails, 117 mm of straight run each: pads at most 45 mm apart
    expect(pads.length).toBe(8);
    for (const p of pads) expect([p.z0, p.z1]).toEqual([ctx.b1, 0]);
    expect(added.filter((s) => s.headKind === "csk")).toHaveLength(8);
    expect(added.filter((s) => s.kind === "dowel")).toHaveLength(4);
    // nothing hangs under the base
    expect(added.filter((s) => s.z1 <= ctx.b0)).toEqual([]);
    expect(ctx.joint("raila-seat")!.serves.F1).toHaveLength(2);
  });

  it("gives a rail no posts", () => {
    const ctx = contextBefore(j5Model, standoffs);
    expect(ctx.solids.some((s) => s.id.startsWith("raila-post"))).toBe(false);
  });
});

describe("stops", () => {
  it("puts two bumpers just outside the rocker's swing and none on the input", () => {
    const ctx = contextBefore(j3Model, stops);
    const added = run(ctx, stops);
    expect(kinds(added)).toEqual({ bumper: 2, head: 2, shank: 2 });
    expect(added.every((s) => s.joints.includes("pO4"))).toBe(true);
  });

  it("gives a part that indexes (a Geneva wheel) no stops: it ends the cycle at another angle", () => {
    const ctx = contextBefore(geneva, stops);
    expect(run(ctx, stops)).toEqual([]);
  });
});

describe("bridge", () => {
  it("is two filleted arms when its posts stand far from the pivot, one plate when they are close", () => {
    const area = (P: [number, number][]) => Math.abs(P.reduce((s, p, i) => s + p[0] * P[(i + 1) % P.length]![1] - P[(i + 1) % P.length]![0] * p[1], 0) / 2);
    const far = assembleWith(geneva).assembly.solids.find((s) => s.id === "pW-bridge")!;
    const close = assembleWith(fourBar).assembly.solids.find((s) => s.id === "pO4-bridge")!;
    // the arms leave out the triangle between them: well under the hull of the same circles
    const hull = (s: typeof far) => area(hullOf(s.outer.map(([x, y]): [number, number, number] => [x, y, 0])));
    expect(area(far.outer)).toBeLessThan(0.75 * hull(far));
    expect(area(close.outer)).toBeGreaterThan(0.97 * hull(close));
  });
});

describe("drive", () => {
  it("rotary: motor, bracket, belt, two pulleys, flag, sensor, terminal block and clip", () => {
    const { assembly: a } = assembleWith(j2Model);
    const k = kinds(a.solids.filter((s) => s.joints.includes("drive")));
    expect(k).toMatchObject({ motor: 2, bracket: 3, belt: 1, flag: 1, terminalBlock: 1, cableClip: 1 });
    expect(k.pulley).toBeGreaterThanOrEqual(2);
    expect(k.sensor).toBe(3);
    expect(a.joints.find((j) => j.id === "drive")!.badge).toEqual(["motorised", "ok"]);
  });

  it("rotary: the leads are laid as cables, round the input housing and square into the terminal block", () => {
    const { assembly: a } = assembleWith(fourBar);
    const housing = a.solids.find((s) => s.kind === "housing")!;
    const hR = Math.max(...housing.outer.map(([x, y]) => Math.hypot(x, y)));
    const block = a.solids.find((s) => s.id === "drive-terminal")!;
    for (const id of ["drive-lead0", "drive-lead1"]) {
      const lead = a.solids.find((s) => s.id === id)!;
      // the strip's centre line: every point clear of the housing's footprint
      for (const [x, y] of lead.outer) expect(Math.hypot(x - housing.at[0], y - housing.at[1])).toBeGreaterThan(hR);
      // the last point lies on the block, the run into it square to the block's long side
      const n = lead.outer.length / 2;
      const end = [(lead.outer[n - 1]![0] + lead.outer[n]![0]) / 2, (lead.outer[n - 1]![1] + lead.outer[n]![1]) / 2];
      expect(Math.hypot(end[0]! - block.at[0], end[1]! - block.at[1])).toBeLessThan(10);
      const prev = [(lead.outer[n - 2]![0] + lead.outer[n + 1]![0]) / 2, (lead.outer[n - 2]![1] + lead.outer[n + 1]![1]) / 2];
      const along = [Math.cos(block.at[2]), Math.sin(block.at[2])];
      expect(Math.abs((end[0]! - prev[0]!) * along[0]! + (end[1]! - prev[1]!) * along[1]!)).toBeLessThan(1e-6);
    }
  });

  it("oscillating: a crank and link whose far pin follows the rocker through its whole modelled range", () => {
    const { assembly: a, ctx } = assembleWith(oscModel);
    const crank = a.solids.find((s) => s.id === "drive-crank")!;
    const link = a.solids.find((s) => s.id === "drive-link")!;
    const m = crank.motion!;
    expect(m.type).toBe("crank");
    if (m.type !== "crank") return;
    for (let i = 0; i < 36; i++) {
      const u = (i / 36) * TAU;
      const s = oscModel.solve(u);
      const C = solidPose(oscModel, ctx.parts, link, s, u)!;
      const K = solidPose(oscModel, ctx.parts, crank, s, u)!;
      // the crank pin on the motor circle, the link reaching the lever tip on the rocker
      expect(Math.hypot(C[0] - m.motor[0], C[1] - m.motor[1])).toBeCloseTo(m.r, 6);
      const tipAng = Math.atan2(s.pts.A![1], s.pts.A![0]) + m.off;
      const T = [m.pivot[0] + m.rho * Math.cos(tipAng), m.pivot[1] + m.rho * Math.sin(tipAng)];
      expect(C[0] + m.L * Math.cos(C[2])).toBeCloseTo(T[0]!, 6);
      expect(C[1] + m.L * Math.sin(C[2])).toBeCloseTo(T[1]!, 6);
      expect(K[2]).not.toBeNaN();
    }
  });

  it("manual: a handle and stops, no motor", () => {
    const { assembly: a } = assembleWith(manualModel);
    const k = kinds(a.solids.filter((s) => s.joints.includes("drive")));
    expect(a.solids.some((s) => s.id === "drive-handle")).toBe(true);
    expect(k.bumper).toBe(2);
    expect(a.solids.some((s) => s.kind === "motor" || s.kind === "belt")).toBe(false);
  });
});

describe("j8-belt", () => {
  it("flanges the small pulley and slots the mount's screw holes along the belt", () => {
    const ctx = contextBefore(j2Model, j8);
    const holes = ctx.get("drive-top")!.holes.length;
    expect(kinds(run(ctx, j8))).toEqual({ pulley: 2 });
    const top = ctx.get("drive-top")!;
    expect(top.holes).toHaveLength(holes);
    // a slot is longer than it is wide
    const h = top.holes[1]!;
    const span = Math.max(...h.flatMap((p) => h.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1]))));
    // a 2.5 mm slot each way round an M3 clearance hole: 3.4 + 2 x 2.5
    expect(span).toBeCloseTo(8.4, 1);
  });
});

describe("lubrication", () => {
  it("oils a plain bushing through its part and leaves sealed bearings alone", () => {
    const bush = defineMechanism({
      id: "fx-bush",
      input: { kind: "rotary", part: "arm" },
      parts: [P.link("arm", 40, { role: "output", w: 9, between: ["O", "A"] }), P.cap("pO", -1, 2.5, { fixed: [0, 0, 0] })],
      solve: (u) => ({ pts: { O: [0, 0], A: V.at([0, 0], u, 40) } }),
    });
    const ctx = contextBefore(bush, lubrication);
    expect(ctx.solids.some((s) => s.kind === "bushing")).toBe(true);
    run(ctx, lubrication);
    expect(ctx.get("arm")!.marks.filter((m) => m.kind === "oilSink").length).toBeGreaterThanOrEqual(2);
  });
});

describe("timing marks", () => {
  it("marks both gears at the mesh and the cam's zero line", () => {
    const g = contextBefore(j6Model, timingMarks);
    run(g, timingMarks);
    for (const id of ["g1", "g2"]) expect(g.get(id)!.marks.filter((m) => m.kind === "timing")).toHaveLength(1);
    const c = contextBefore(j7Model, timingMarks);
    run(c, timingMarks);
    expect(c.get("cam")!.marks.some((m) => m.kind === "timing")).toBe(true);
  });
});

describe("locking and materials", () => {
  it("leaves no threaded fastener without a locking method and no solid without a material", () => {
    const { assembly: a } = assembleWith(fourBar);
    for (const s of a.solids) {
      if (["head", "shank", "nut", "setScrew"].includes(s.kind)) expect(s.lock, s.id).toBeTruthy();
      expect(s.mat, s.id).toBeTruthy();
    }
  });
});
