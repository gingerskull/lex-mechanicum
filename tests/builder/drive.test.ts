// The drive of an oscillating or a linear input (standard V1 to V6, F10): the motor, its crank and link that swing the
// input through exactly its range, the compliant lever's pin in its arc slot, the belt loop and carriage of a slide, and
// no motor for a hand-worked input.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { inside } from "../../src/core/poly";
import { type Vec3, v3, xf } from "../../src/kin/math";
import { driveXf } from "../../src/solids/drive";
import type { Solid3 } from "../../src/solids/types";
import { fixtureRecord } from "./fixtures";

const built = new Map<string, Promise<BuildCtx>>();
const build = (name: string) => {
  if (!built.has(name)) built.set(name, buildWithContext(fixtureRecord(name)).then(({ ctx }) => ctx));
  return built.get(name)!;
};
afterAll(async () => {
  for (const p of built.values()) (await p).dispose();
});

const get = (ctx: BuildCtx, id: string): Solid3 => {
  const s = ctx.get(id);
  if (!s) throw new Error(`no solid ${id}`);
  return s;
};
/** Distance in the plane normal to the drive's axis. */
let axis: Vec3 = [0, 0, 1];
const flat = (a: Vec3, b: Vec3): number => v3.len(v3.perp(v3.sub(a, b), axis));

/** The crank and the link at 72 phases: the crank throw and the link length kept, one turn of the crank per cycle. */
function crankAndLink(ctx: BuildCtx): void {
  const crank = get(ctx, "drive-crank").drive!;
  const link = get(ctx, "drive-link").drive!;
  expect(crank.part).toBe("crank");
  expect(link.part).toBe("link");
  const end = get(ctx, "drive-link-b1");
  axis = crank.axis;
  // the link's far pin rides the input's lever, or a step-up's sector
  const lever = (X: ReturnType<typeof xf.id>, u: number) => (crank.step ? driveXf({ ...crank, part: "sector" }, X, u) : X);
  let turn = 0;
  let prev = NaN;
  for (let k = 0; k <= 72; k++) {
    const u = (k / 72) * Math.PI * 2;
    const X = ctx.K.pose(u).bodies.get(crank.input)!;
    const T = xf.apply(lever(X, u), crank.tip);
    const C = xf.apply(driveXf(crank, X, u), crank.pin);
    expect(flat(C, crank.motor)).toBeCloseTo(crank.r, 6);
    expect(flat(C, T)).toBeCloseTo(crank.L, 6);
    // the link's far bushing stays on the lever's pin
    expect(flat(xf.apply(driveXf(link, X, u), end.frame.o), T)).toBeLessThan(1e-6);
    const e = v3.unit(v3.perp(v3.sub(crank.pin, crank.motor), axis));
    const f = v3.cross(axis, e);
    const a = Math.atan2(v3.dot(v3.sub(C, crank.motor), f), v3.dot(v3.sub(C, crank.motor), e));
    if (k) {
      let d = a - prev;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      turn += d;
    }
    prev = a;
  }
  expect(Math.abs(turn)).toBeCloseTo(2 * Math.PI, 3);
  // a dead centre at each end of the swing (u = 0 and u = π: the driver at its range's ends)
  for (const u of [0, Math.PI]) {
    const T = xf.apply(lever(ctx.K.pose(u).bodies.get(crank.input)!, u), crank.tip);
    const D = flat(T, crank.motor);
    expect(Math.min(Math.abs(D - (crank.L + crank.r)), Math.abs(D - (crank.L - crank.r)))).toBeLessThan(1e-6);
  }
}

describe("drive: oscillating input on a shaft", () => {
  it("builds the motor in its flange, a crank and link under it, a lever keyed on the input shaft", async () => {
    const ctx = await build("watt-linkage");
    expect(ctx.issues.filter((i) => i.startsWith("drive"))).toEqual([]);
    for (const id of ["drive-motor", "drive-flange", "drive-shaft", "drive-crank", "drive-crank-pin", "drive-link", "drive-lever", "drive-tip-pin", "drive-flag", "drive-sensor", "drive-sensor-post", "drive-terminals", "drive-lead", "drive-lead-sensor"]) get(ctx, id);
    const input = get(ctx, "drive-crank").drive!.input;
    // the lever, its pin and the flag ride the input (V6: the home flag on the input)
    for (const id of ["drive-lever", "drive-tip-pin", "drive-flag"]) expect(get(ctx, id).body).toBe(input);
    // everything of the drive is under the base (V2: nothing shows on top of the base)
    const top = ctx.base!.bottom;
    for (const s of ctx.solids.filter((q) => q.joints.includes("drive") && q.kind !== "standoff" && q.kind !== "head" && q.kind !== "shank")) expect(s.frame.o[2], s.id).toBeLessThanOrEqual(top + 1e-6);
    expect(ctx.notes.find((n) => n.id === "drive")?.badge).toEqual(["motor driven", "ok"]);
    crankAndLink(ctx);
  });

  it("gives the drive's moving parts their pose from the input, carried by no body's sweep", async () => {
    const ctx = await build("watt-linkage");
    for (const id of ["drive-crank", "drive-crank-pin", "drive-shaft"]) expect(get(ctx, id).drive?.part).toBe("crank");
    for (const id of ["drive-link", "drive-link-b0", "drive-link-b1"]) expect(get(ctx, id).drive?.part).toBe("link");
    expect(get(ctx, "drive-crank").body).toBe("ground");
  });
});

describe("drive: oscillating input, wider swings and shafts in plan", () => {
  it("steps a swing wider than a crank and link can give through a gear sector meshed with a pinion on the input", async () => {
    const ctx = await build("lever-escapement");
    expect(ctx.issues.filter((i) => i.startsWith("drive"))).toEqual([]);
    const crank = get(ctx, "drive-crank").drive!;
    expect(crank.step?.ratio).toBeGreaterThan(1);
    expect(get(ctx, "drive-sector").drive?.part).toBe("sector");
    expect(get(ctx, "drive-pinion").body).toBe(crank.input);
    // the sector turns against the pinion by the ratio
    for (let k = 0; k < 72; k++) {
      const u = (k / 72) * Math.PI * 2;
      const P = ctx.K.pose(u);
      // only where the input's turn reads without wrapping
      if (Math.abs(P.values.input! - crank.step!.def) > 120) continue;
      const X = P.bodies.get(crank.input)!;
      const input = xf.angleAbout(X, crank.axis);
      const sector = xf.angleAbout(driveXf({ ...crank, part: "sector" }, X, u), crank.axis);
      expect(sector * crank.step!.ratio + input).toBeCloseTo(0, 6);
    }
    crankAndLink(ctx);
  });

  it("drives a shaft in plan from a motor on an angle bracket, its axis along the shaft", async () => {
    const ctx = await build("anchor-escapement");
    expect(ctx.issues.filter((i) => i.startsWith("drive"))).toEqual([]);
    const crank = get(ctx, "drive-crank").drive!;
    expect(Math.abs(crank.axis[2])).toBeLessThan(1e-9);
    for (const id of ["drive-bracket", "drive-bracket-foot", "drive-motor", "drive-lever", "drive-sensor-post"]) get(ctx, id);
    crankAndLink(ctx);
  });
});

describe("drive: oscillating compliant lever (J13)", () => {
  it("drives a pin in the lever's tip through an arc slot in the base, the motor on the line of the tip's chord", async () => {
    const ctx = await build("kin:compliantLever");
    axis = [0, 0, 1];
    expect(ctx.issues.filter((i) => i.startsWith("drive"))).toEqual([]);
    const crank = get(ctx, "drive-crank").drive!;
    expect(get(ctx, "drive-tip-pin").body).toBe(crank.input);
    expect(get(ctx, "drive-flag").body).toBe(crank.input);
    for (const id of ["drive-top", "drive-wall", "drive-floor", "drive-motor"]) get(ctx, id);
    // the motor on the chord's line: its distances to the tip's ends differ by the full chord
    const ends = [0, Math.PI].map((u) => xf.apply(ctx.K.pose(u).bodies.get(crank.input)!, crank.tip));
    const chord = flat(ends[0]!, ends[1]!);
    expect(Math.abs(flat(ends[0]!, crank.motor) - flat(ends[1]!, crank.motor))).toBeCloseTo(chord, 3);
    expect(2 * crank.r).toBeCloseTo(chord, 3);
    // the slot in the base takes the pin over the whole swing
    const slot = ctx.baseHoles.find((h) => h.joint === "drive")?.ring;
    expect(slot).toBeTruthy();
    for (let k = 0; k < 36; k++) {
      const T = xf.apply(ctx.K.pose((k / 36) * Math.PI * 2).bodies.get(crank.input)!, crank.tip);
      expect(inside(slot!, [T[0], T[1]]), `pin in its slot at ${k}`).toBe(true);
    }
    crankAndLink(ctx);
  });
});

describe("drive: linear input", () => {
  it("builds a belt loop along the stroke, a carriage on the slider through a slot in the base, a tensioner", async () => {
    const ctx = await build("scott-russell");
    expect(ctx.issues.filter((i) => i.startsWith("drive"))).toEqual([]);
    for (const id of ["drive-top", "drive-wall", "drive-floor", "drive-motor", "drive-pulley-motor", "drive-idler", "drive-belt", "drive-tensioner", "drive-carriage", "drive-belt-clamp", "drive-flag", "drive-sensor", "drive-terminals"]) get(ctx, id);
    const carriage = get(ctx, "drive-carriage");
    const slider = ctx.kin.joints.find((j) => j.id === "S")!;
    const sliderBody = slider.a === "ground" ? slider.b : slider.a;
    expect(carriage.body).toBe(sliderBody);
    expect(get(ctx, "drive-flag").body).toBe(sliderBody);
    // the carriage stays in its slot over the whole stroke
    const slot = ctx.baseHoles.find((h) => h.joint === "drive")?.ring;
    expect(slot).toBeTruthy();
    const corners = carriage.profile.outer.map((p) => v3.add(carriage.frame.o, v3.add(v3.mul(carriage.frame.x, p[0]), v3.mul(v3.cross(carriage.frame.z, carriage.frame.x), p[1]))));
    ctx.sampled.us.forEach((_, i) => {
      const X = ctx.xfOf(sliderBody, i);
      for (const c of corners) {
        const w = xf.apply(X, c);
        expect(inside(slot!, [w[0], w[1]])).toBe(true);
      }
    });
  });
});

describe("drive: manual input", () => {
  it("works a hand stroke (a manual driver with lo and hi) through its range, with a knob and no motor", async () => {
    const ctx = await build("toggle-clamp");
    const d = ctx.kin.drivers.find((x) => x.id === "handle")!;
    expect(d.kind).toBe("manual");
    expect(ctx.K.pose(0).values.handle).toBeCloseTo(d.lo!, 6);
    expect(ctx.K.pose(Math.PI).values.handle).toBeCloseTo(d.hi!, 6);
    expect(ctx.solids.some((s) => s.kind === "motor")).toBe(false);
    expect(get(ctx, "drive-knob").body).toBe("handle");
  });

  it("builds no motor for a hand-worked input, a knob on each input instead", async () => {
    const ctx = await build("five-bar");
    expect(ctx.solids.some((s) => s.kind === "motor")).toBe(false);
    const inputs = ctx.kin.drivers.filter((d) => d.kind === "manual").map((d) => ctx.kin.joints.find((j) => j.id === d.joint)!).map((j) => (j.a === "ground" ? j.b : j.a));
    expect(inputs.map((b, n) => get(ctx, `drive-knob${n}`).body)).toEqual(inputs);
    expect(ctx.notes.find((n) => n.id === "drive")?.badge).toEqual(["hand operated", "ok"]);
  });
});
