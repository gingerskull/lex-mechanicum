// One fixture model per joint type: each rule adds the solids its standard row names, and nothing else.
import { describe, expect, it } from "vitest";
import { bbox } from "../../src/core/geom";
import { SHOULDER_LENGTHS } from "../../src/hardware/tables";
import { j1 } from "../../src/rules/j1-dead-axle";
import { j2 } from "../../src/rules/j2-live-shaft";
import { j3 } from "../../src/rules/j3-moving-pin";
import { j4 } from "../../src/rules/j4-slot-roller";
import { j5 } from "../../src/rules/j5-slide";
import { j6 } from "../../src/rules/j6-mesh";
import { j7 } from "../../src/rules/j7-cam";
import walschaerts from "../../src/mechanisms/walschaerts-valve-gear/model";
import { hungModel, j1Model, j2Model, j3Model, j4Model, j5Model, j6Model, j7Model } from "../fixtures/models";
import { contextBefore, kinds, run } from "./helpers";

const only = (k: Record<string, number>) => Object.keys(k).sort();

describe("J1 dead axle", () => {
  it("builds shaft, bearing, two spacers, two circlips, thrust washer, bridge on two spigoted posts with four screws, nut, oil sink", () => {
    const ctx = contextBefore(j1Model, j1);
    const added = run(ctx, j1);
    expect(kinds(added)).toEqual({
      shaft: 3, // shoulder, undercut, thread
      head: 5, // axle head and four post screws
      shank: 4,
      bearing: 1,
      bearingBalls: 1,
      bearingCage: 1,
      circlipInternal: 2,
      spacer: 2,
      thrustWasher: 1,
      bridge: 1,
      standoff: 2,
      spigot: 2,
      washer: 2, // under the nut, and the shim making up the axle's standard shoulder length
      nut: 1,
    });
    const bridge = added.find((s) => s.kind === "bridge")!;
    expect(bridge.marks.some((m) => m.kind === "oilSink")).toBe(true);
    // 1.5 x M6 does not fit the 8 mm aluminium base: through it to a nyloc
    expect(added.find((s) => s.kind === "nut")!.name).toMatch(/Nyloc nut M6/);
    expect(ctx.joint("pO")!.badge).toEqual(["both ends held", "ok"]);
  });
});

describe("J2 live shaft", () => {
  it("builds the housing cartridge, keyed shaft, thrust washer and end retainer", () => {
    const ctx = contextBefore(j2Model, j2);
    const k = kinds(run(ctx, j2));
    expect(k).toMatchObject({ housing: 1, bearing: 2, circlipInternal: 2, waveWasher: 1, dowel: 2, thrustWasher: 1, key: 1, sleeve: 1, washer: 1 });
    expect(only(k)).toEqual(["bearing", "bearingBalls", "bearingCage", "circlipInternal", "dowel", "head", "housing", "key", "shaft", "shank", "sleeve", "thrustWasher", "washer", "waveWasher"]);
    const j = ctx.pinJoint("pO")!;
    expect(j.below).toBeDefined();
    expect(ctx.get("base")!.holes.length).toBe(5); // four mounting holes and the shaft
  });
});

describe("J3 moving pin", () => {
  it("threads the shoulder bolt through the lowest part and seats a bearing in the other", () => {
    const ctx = contextBefore(j3Model, j3);
    const added = run(ctx, j3).filter((s) => s.joints.includes("pA"));
    expect(only(kinds(added))).toEqual(["bearing", "bearingBalls", "bearingCage", "circlipInternal", "head", "shaft", "sleeve", "spacer", "washer"]);
    // the shoulder is a standard ISO 7379 length; a shim under the head makes up the stack
    const bolt = added.find((s) => s.id === "pA-bolt")!;
    const L = Number(/x (\d+(?:\.\d+)?),/.exec(bolt.name)![1]);
    expect(SHOULDER_LENGTHS).toContain(L);
    expect(added.find((s) => s.id === "pA-bolt-head")!.z0).toBeCloseTo(6 + L, 6);
    expect(added.find((s) => s.id === "pA-bolt-shim")!.z1).toBeCloseTo(6 + L, 6);
    const thread = added.find((s) => s.kind === "shaft" && s.marks.some((m) => m.kind === "thread"))!;
    // the thread lies in the crank (z 0 to 6), the shoulder above it
    expect([thread.z0, thread.z1]).toEqual([0, 6]);
    expect(added.find((s) => s.kind === "bearing")!.body).toBe("coupler");
  });
});

describe("J4 pin in slot", () => {
  it("adds a track roller, two screwed wear strips and a felt oiler; the strips' faces are the modelled slot walls", () => {
    const ctx = contextBefore(j4Model, j4);
    const k = kinds(run(ctx, j4));
    expect(k).toMatchObject({ roller: 1, wearStrip: 2, felt: 1 });
    expect(only(k)).toEqual(["felt", "head", "roller", "shaft", "shank", "sleeve", "spacer", "washer", "wearStrip"]);
    expect(ctx.get("pA-lever-roller")!.D).toBeCloseTo(12 - 0.3, 6);
  });
});

describe("J5 slide", () => {
  it("adds a gib clamped under the keeper, wipers, nipple and two end stops with pads, as a few blocks", () => {
    const ctx = contextBefore(j5Model, j5);
    const k = kinds(run(ctx, j5));
    // the stop screws are the only screws the slide adds: the keeper's are the rail's fixing screws (A6)
    expect(k).toEqual({ plate: 1, gib: 1, wiper: 2, stop: 2, bumper: 2, nipple: 1, head: 2, shank: 2 });
    expect(only(k)).not.toContain("setScrew");
    expect(only(k)).not.toContain("nut");
    expect(only(k)).not.toContain("shim");
  });
});

describe("J6 gear mesh", () => {
  it("adds hubs with set screws and asks J2 for an eccentric under the second shaft", () => {
    const ctx = contextBefore(j6Model, j6);
    expect(kinds(run(ctx, j6))).toEqual({ part: 2, setScrew: 2 });
    expect(ctx.pinJoint("p2")!.eccentric).toBe(true);
    run(ctx, j2);
    expect(ctx.solids.filter((s) => s.kind === "eccentric")).toHaveLength(1);
    // the gears are held by circlips over their hubs
    expect(ctx.solids.filter((s) => s.kind === "circlipExternal")).toHaveLength(2);
  });
});

describe("J7 cam", () => {
  it("adds the return spring, its seats and preload screw; a follower on a slide needs no guide bushing", () => {
    const ctx = contextBefore(j7Model, j7);
    const k = kinds(run(ctx, j7));
    expect(k).toMatchObject({ spring: 1, washer: 1, plate: 1, setScrew: 1 });
    expect(k.bushing).toBeUndefined();
  });
});

describe("J1 hung pivot", () => {
  it("carries a pivot from a bridge into the top part only when a lower part sweeps over it", () => {
    const ctx = contextBefore(hungModel, j1);
    expect(ctx.pinJoint("pO4")!.type).toBe("J1");
    const added = run(ctx, j1);
    const lever = ctx.get("lever")!;
    const bridge = added.find((s) => s.kind === "bridge")!;
    const stud = ctx.get("pO4-axle")!;
    // the stud ends just under the lever, nothing of it reaches the layers below
    expect(stud.z0).toBeGreaterThan(lever.z0 - 2);
    expect(stud.z0).toBeLessThan(lever.z0);
    expect(bridge.z0).toBeGreaterThan(lever.z1);
    expect(added.some((s) => s.kind === "thrustWasher")).toBe(false);
    expect(kinds(added)).toMatchObject({ bridge: 1, standoff: 2, spigot: 2, circlipExternal: 1, nut: 1 });
    expect(ctx.joint("pO4")!.badge).toEqual(["single shear", "warn"]);
    // the base carries no axle hole for it
    expect(ctx.get("base")!.holes.some((h) => Math.abs(bbox(h)[0] + bbox(h)[2] - 50) < 1 && Math.abs(bbox(h)[1] + bbox(h)[3]) < 1)).toBe(false);
  });

  it("leaves a pivot with nothing sweeping under it as a dead axle on the base", () => {
    const ctx = contextBefore(j3Model, j1);
    run(ctx, j1);
    expect(ctx.get("pO4-axle")!.z0).toBeLessThan(ctx.b1);
  });
});

describe("J1 free pivot", () => {
  it("gives a pivot the model declares free no bridge, and shields its bearing", () => {
    const ctx = contextBefore(walschaerts, j1);
    run(ctx, j1);
    expect(ctx.get("pLr-bridge")).toBeUndefined();
    expect(ctx.joint("pLr")!.badge).toEqual(["single shear", "warn"]);
    const brg = ctx.get("pLr-lifting-brg")!;
    expect(brg.closure).toBe("shield");
    expect(brg.name).toMatch(/ZZ/);
  });

  it("still bridges a pivot that is not declared", () => {
    const ctx = contextBefore(j3Model, j1);
    run(ctx, j1);
    expect(ctx.get("pO4-bridge")).toBeDefined();
  });
});
