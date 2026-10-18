// The hand fixes promoted to rules and primitives: plating offsets, clevis twins, tapered links, open slots classified
// over the cycle, straddle-mounted live shafts, the drag pack, locking segment, output coupling and spoke helpers, slide
// stops that shorten to fit, the cheaper bridge post search and shoulder bolt headroom.
import { describe, expect, it } from "vitest";
import { TAU, arcPts, bbox } from "../../src/core/geom";
import { holeSlot, notchAt } from "../../src/core/poly";
import { assemble, assembleWith } from "../../src/assemble";
import { HP } from "../../src/assemble/api";
import { solid } from "../../src/hardware/solid";
import geneva from "../../src/mechanisms/geneva/model";
import locomotive from "../../src/mechanisms/locomotive-drive/model";
import scissor from "../../src/mechanisms/scissor-lift/model";
import fourBar from "../../src/mechanisms/four-bar/model";
import sliderCrank from "../../src/mechanisms/slider-crank/model";
import { heights } from "../../src/parts";
import { createContext } from "../../src/rules/context";
import { baseCorners } from "../../src/rules/base";
import { headroom } from "../../src/rules/headroom";
import { j2Straddle } from "../../src/rules/j2-straddle";
import { j4 } from "../../src/rules/j4-slot-roller";
import { runRules } from "../../src/rules/registry";
import { stops } from "../../src/rules/stops";
import type { PinJoint } from "../../src/rules/types";
import { clevisModel, j3Model, j6Model } from "../fixtures/models";
import { contextBefore, kinds, run } from "./helpers";

const built = (m: typeof clevisModel) => {
  const ctx = createContext(m);
  runRules(ctx);
  return ctx;
};

describe("plating offsets (K1)", () => {
  it("moves a part off its layer while its explode level stays the layer's", () => {
    const coupler = clevisModel.parts.find((p) => p.id === "coupler")!;
    expect(heights(coupler)).toEqual([7.5, 13.5]);
    const ctx = createContext(clevisModel);
    expect(ctx.levels).toEqual([0, 10, 20]);
    expect(ctx.solidOf["coupler"]!.z0).toBe(7.5);
    expect(ctx.solidOf["coupler"]!.ex).toBe(1);
  });

  it("builds the pin stacks on the plated part", () => {
    const ctx = built(clevisModel);
    const brg = ctx.get("pA-coupler-brg")!;
    expect(brg.z0).toBeGreaterThanOrEqual(7.5);
    expect(brg.z1).toBeLessThanOrEqual(13.5 + 1.2);
  });
});

describe("clevis twin (A9)", () => {
  it("turns the twin with the bolt at a moving pin: a plain hole on the shoulder, no bearing", () => {
    const ctx = built(clevisModel);
    const pB = ctx.pinJoint("pB")!;
    expect(pB.driven.map((x) => x.part.id)).toEqual(["rocker", "front"]);
    expect(ctx.solids.some((s) => s.id.startsWith("pB-front-brg"))).toBe(false);
    const front = ctx.get("front")!;
    expect(front.holes.some((h) => { const [x0, , x1] = bbox(h); return Math.abs((x1 - x0) / 2 - (pB.d / 2 + 0.1)) < 0.05; })).toBe(true);
    // the head sits on the front plate
    expect(ctx.get("pB-bolt-head")!.z0).toBeGreaterThan(front.z1);
  });

  it("gives each plate its bearing on a ground pivot, and the pair one set of stops", () => {
    const ctx = built(clevisModel);
    expect(ctx.get("pO4-rocker-brg")).toBeDefined();
    expect(ctx.get("pO4-front-brg")).toBeDefined();
    expect(ctx.fired[stops.id]!.filter((id) => /stop\d$/.test(id))).toEqual(["pO4-stop0", "pO4-stop1"]);
  });

  it("rides its partner's body in the assembly", () => {
    const a = assemble(clevisModel);
    expect(a.solids.filter((s) => s.body === "front")).toEqual([]);
    expect(a.solids.find((s) => s.id === "front")!.body).toBe("rocker");
  });
});

describe("tapered links in the part family (D1)", () => {
  it("draws a link to its boss radii, and the rules read the real outline", () => {
    const crank = clevisModel.parts.find((p) => p.id === "crank")!;
    const [x0, y0, x1, y1] = bbox(crank.shape.outer);
    expect([x0, y0, y1]).toEqual([-13, -13, 13].map((v) => expect.closeTo(v, 1)));
    expect(x1).toBeCloseTo(40 + 9.5, 1);
    const ctx = built(clevisModel);
    const at = ctx.pinJoint("pA")!.joined.find((x) => x.part.id === "crank")!;
    expect(at.R).toBeCloseTo(9.5, 1);
  });
});

describe("J4 for open slots, classified over the cycle", () => {
  it("finds every slot of the Geneva wheel the roller runs in, though they are open at the rim", () => {
    const ctx = contextBefore(geneva, j4);
    const pR = ctx.pinJoint("pR") as PinJoint;
    expect(pR.type).toBe("J4");
    const x = pR.joined.find((y) => y.part.id === "wheel")!;
    expect(x.how).toBe("slot");
    expect(x.slots).toHaveLength(4);
    for (const s of x.slots!) {
      expect(s.open).toBe(true);
      expect(s.w).toBeCloseTo(7, 1);
      // the roller reaches 5 mm short of the slot end (the model's depth)
      expect(s.reach[0]).toBeGreaterThan(4);
    }
  });

  it("builds the roller, strips on every slot wall and a felt in every slot end", () => {
    const ctx = contextBefore(geneva, j4);
    const k = kinds(run(ctx, j4));
    expect(k).toMatchObject({ roller: 1, wearStrip: 8, felt: 4 });
    // the felts sit inside the wheel, in the relieved slot ends
    const wheel = ctx.get("wheel")!;
    for (const f of ctx.solids.filter((s) => s.kind === "felt")) expect([f.z0, f.z1]).toEqual([wheel.z0 + 1, wheel.z1 - 1]);
  });

  it("takes a notch for a slot only where its walls run parallel", () => {
    // an L-shaped plate: a point in the inside corner is not in a slot
    const L: [number, number][] = [[0, 0], [60, 0], [60, 20], [20, 20], [20, 60], [0, 60]];
    expect(notchAt(L, [30, 30], 12)).toBeNull();
    // a plate with a 14 mm slot cut in from its right edge
    const U: [number, number][] = [[0, -30], [60, -30], [60, -7], [20, -7], [20, 7], [60, 7], [60, 30], [0, 30]];
    expect(notchAt(U, [35, 2], 12)).toMatchObject({ w: expect.closeTo(7, 1), open: true });
  });

  it("still reads a closed slot from its hole", () => {
    expect(holeSlot([[0, -6], [40, -6], [40, 6], [0, 6]], 0)).toMatchObject({ c0: [6, 0], u: [1, 0], len: 28, w: 6, open: false });
  });
});

describe("straddle-mounted live gear shafts (A9)", () => {
  it("bridges both shafts of a mesh, a floating bearing in each, the backlash eccentric at the top as well", () => {
    const ctx = contextBefore(j6Model, j2Straddle);
    run(ctx, j2Straddle);
    const br = ctx.get("p1-p2-bridge")!;
    expect(br.kind).toBe("bridge");
    expect(br.joints).toEqual(expect.arrayContaining(["p1", "p2"]));
    expect(ctx.get("p1-top-brg")!.z1).toBeCloseTo(br.z1, 6);
    expect(ctx.get("p2-top-ecc-fl")).toBeDefined();
    expect(ctx.get("p1-top-ecc-fl")).toBeUndefined();
    for (const id of ["p1", "p2"]) {
      const up = ctx.get(`${id}-shaft-up`)!;
      expect(up.z0).toBeLessThan(br.z0);
      expect(ctx.joint(id)!.badge).toEqual(["straddle mounted", "ok"]);
    }
  });

  it("leaves a shaft that something sweeps over alone", () => {
    const ctx = built(clevisModel);
    expect(ctx.solids.some((s) => s.id.includes("top-brg"))).toBe(false);
  });
});

describe("H.dragPack, H.lockingSegment, H.outputCoupling, H.spokes", () => {
  it("sizes the drag pack to the face it bears on and puts the disc against the turning part", () => {
    const ctx = createContext(j3Model);
    const [disc, ww] = HP.dragPack(ctx, "pO4", { at: [0, 0], d: 17.5, D: 21, z0: 10, z1: 12, ex: 1, part: "above", on: "the hub", by: "the bridge" });
    expect([disc!.d, disc!.D, ww!.d, ww!.D]).toEqual([17.5, 21, 17.5, 21]);
    expect(disc!.z1).toBe(12);
    expect(ww!.z0).toBe(10);
    expect(disc!.name).toBe("Drag pack: bronze friction disc 17.5x21.0, on the hub");
  });

  it("cuts a locking segment from an arc of the outline and screws it on", () => {
    const ctx = createContext(j3Model);
    const host = solid("disc", { kind: "part", role: "driver", outer: [...arcPts(0, 0, 30, 0.6, TAU - 0.6), [10, 0]], z0: 0, z1: 6 });
    const out = HP.lockingSegment(ctx, host, { r: 30, depth: 4, joint: "pO2" });
    expect(kinds(out)).toMatchObject({ wearStrip: 1, head: 4 });
    expect(host.outer.some(([x, y]) => Math.abs(Math.hypot(x, y) - 26) < 0.05)).toBe(true);
  });

  it("couples the output on the free end of a straddle-mounted shaft", () => {
    const ctx = built(j6Model);
    const out = HP.outputCoupling(ctx, "p2", { R: 17, t: 6, holes: 4, M: 4, pcd: 12 });
    const fl = out.find((s) => s.id === "p2-flange")!;
    expect(fl.holes).toHaveLength(5);
    expect(ctx.get("p2-flange-key")).toBeDefined();
    expect(Math.max(...ctx.solids.filter((s) => s.id.startsWith("p2-shaft-up")).map((s) => s.z1))).toBeCloseTo(fl.z1, 6);
  });

  it("cuts n filleted windows between the hub and the rim", () => {
    const w = HP.spokes({ rIn: 18, rOut: 40, n: 6, half: 4, fillet: 3 });
    expect(w).toHaveLength(6);
    for (const win of w) for (const [x, y] of win) expect(Math.hypot(x, y)).toBeGreaterThan(17.9);
  });
});

describe("slide end stops that fit", () => {
  it("shortens the slider-crank's lower stop to clear the crank instead of dropping it", () => {
    const { assembly } = assembleWith(sliderCrank);
    const stops = assembly.solids.filter((s) => s.kind === "stop");
    expect(stops).toHaveLength(2);
    const len = (id: string) => { const [x0, , x1] = bbox(assembly.solids.find((s) => s.id === id)!.outer); return x1 - x0; };
    expect(len("slide-block-stop0")).toBeCloseTo(8, 1);
    expect(len("slide-block-stop1")).toBeLessThan(8);
    expect(assembly.joints.find((j) => j.id === "slide-block")!.note).toMatch(/lower end stop is \d mm long/);
  });
});

describe("bridge post search", () => {
  it("tests posts with ctx.hits, which agrees with the sign of ctx.clearance", () => {
    const ctx = built(fourBar);
    for (let x = -60; x <= 170; x += 23)
      for (let y = -60; y <= 120; y += 19) expect(ctx.hits([x, y], 7, ctx.b1, ctx.b1 + 80)).toBe(ctx.clearance([x, y], 7, ctx.b1, ctx.b1 + 80) < 0);
  });
});

describe("shoulder bolt headroom", () => {
  it("grinds the shoulder to length where the lifted head would meet a solid above", () => {
    const ctx = built(clevisModel);
    const head = ctx.get("pA-bolt-head")!;
    const top = head.z1;
    const lift = ctx.get("pA-bolt-shim")!.z1 - ctx.get("pA-bolt-shim")!.z0;
    expect(lift).toBeGreaterThan(0.5);
    // a cover over the crank pin's whole path, just under the lifted head's top
    ctx.add(solid("cover", { kind: "plate", outer: arcPts(0, 0, 60, 0, TAU), z0: top - 0.3, z1: top + 6 }));
    headroom(ctx);
    expect(ctx.get("pA-bolt-shim")).toBeUndefined();
    expect(head.z1).toBeCloseTo(top - lift, 6);
    expect(ctx.get("pA-bolt")!.name).toMatch(/shoulder ground from \d+/);
    expect(ctx.joint("pA")!.note).toMatch(/shoulder is ground/);
  });

  it("only reports a lift where the head clears", () => {
    const ctx = built(clevisModel);
    headroom(ctx);
    expect(ctx.get("pO4-axle-shim")).toBeDefined();
    expect(ctx.joint("pO4")!.note).toMatch(/lifts the head 4 mm on a shim/);
  });
});

describe("stops grow the base (F5, #65)", () => {
  it("keeps every stop post, with an 8 mm margin, over the base, and the feet on the grown corners", () => {
    const ctx = built(clevisModel);
    const [x0, y0, x1, y1] = bbox(ctx.get("base")!.outer);
    const posts = ctx.solids.filter((t) => /-stop\d$/.test(t.id));
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) {
      expect(p.at[0] - 6 - 8).toBeGreaterThanOrEqual(x0 - 1e-6);
      expect(p.at[0] + 6 + 8).toBeLessThanOrEqual(x1 + 1e-6);
      expect(p.at[1] - 6 - 8).toBeGreaterThanOrEqual(y0 - 1e-6);
      expect(p.at[1] + 6 + 8).toBeLessThanOrEqual(y1 + 1e-6);
    }
    for (const f of ctx.solids.filter((t) => t.kind === "foot")) {
      expect(baseCorners(ctx).some(([x, y]) => Math.hypot(f.at[0] - x, f.at[1] - y) < 1e-6)).toBe(true);
    }
  });
});

describe("linear drive (V6, #65)", () => {
  for (const [name, model] of [["locomotive-drive", locomotive], ["scissor-lift", scissor]] as const) {
    it(`${name}: base holds the loop, slot clears the carriage, carriage sits on the belt, a fork sensor takes the vane`, () => {
      const ctx = built(model);
      const base = ctx.get("base")!;
      const [x0, y0, x1, y1] = bbox(base.outer);
      for (const id of ["drive-tensioner", "drive-idler", "drive-sensor", "drive-floor"]) {
        const t = ctx.get(id)!;
        const [a, b, c, d] = bbox(t.outer);
        const q = t.at;
        expect(a + q[0]).toBeGreaterThanOrEqual(x0 - 1e-6);
        expect(c + q[0]).toBeLessThanOrEqual(x1 + 1e-6);
        expect(b + q[1]).toBeGreaterThanOrEqual(y0 - 1e-6);
        expect(d + q[1]).toBeLessThanOrEqual(y1 + 1e-6);
      }
      // the carriage seats on the belt's top
      expect(ctx.get("drive-carriage")!.z0).toBeGreaterThanOrEqual(ctx.get("drive-belt")!.z1);
      // the slot reaches 10.5 mm past the carriage centre at each end of the stroke
      const slot = base.holes.find((h) => { const [a, b, c, d] = bbox(h); return Math.min(c - a, d - b) > 9.5 && Math.min(c - a, d - b) < 10.5 && Math.max(c - a, d - b) > 30; })!;
      const car = ctx.get("drive-carriage")!;
      const [a, b, c, d] = bbox(slot);
      const [ca, cb, cc, cd] = bbox(car.outer);
      expect(Math.max(c - a, d - b)).toBeGreaterThan(Math.max(cc - ca, cd - cb));
      expect(ctx.get("drive-sensor")).toBeDefined();
      expect(ctx.get("drive-sensor-arm0")).toBeDefined();
      expect(ctx.get("drive-lead1")).toBeDefined();
    });
  }
});
