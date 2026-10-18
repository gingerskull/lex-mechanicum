import { beforeAll, describe, expect, it } from "vitest";
import { indexParts } from "../../src/assemble/pose";
import { area } from "../../src/core/geom";
import { models } from "../../src/mechanisms/models";
import type { MechanismModel } from "../../src/model/types";
import { buildPackage } from "../../src/package/build";
import type { Package } from "../../src/package/format";
import { ladder } from "../../src/render/detail";
import { buildItems, ITEM_TEXELS, type Items } from "../../src/render/gl/geometry";
import { Chunks, planFrame } from "../../src/render/gl/plan";
import { MODE, PER_ROW, ROW } from "../../src/render/gl/shaders";
import { projector } from "../../src/render/projector";
import { FACING, facingStep, slices, wallsOf } from "../../src/render/slices";
import { prepare, worldSolids, type Prepared } from "../../src/render/world";
import { theme } from "../../src/style/theme";

const ITEM = ITEM_TEXELS * 4;
let pkg: Package;
let model: MechanismModel;
let P: Prepared[];
let items: Items;
beforeAll(async () => {
  pkg = (await buildPackage("four-bar")).pkg;
  model = await models["four-bar"]!();
  P = prepare(pkg);
  items = buildItems(P);
}, 60_000);

const item = (i: number) => Array.from(items.data.subarray(i * ITEM, (i + 1) * ITEM));

describe("GPU items", () => {
  it("give every solid its outline edges, top-face triangles and outline vertices", () => {
    for (const p of P) {
      const it = items.solids.get(p)!;
      expect(it.outer[1]).toBe(p.outer.length);
      expect(it.verts[1]).toBe(p.outer.length);
      expect(it.holes[1]).toBe(p.holes.reduce((n, h) => n + h.length, 0));
      // a polygon with holes triangulates to at most n + 2h - 2 triangles (fewer where points are collinear)
      expect(it.tris[1]).toBeGreaterThan(0);
      expect(it.tris[1]).toBeLessThanOrEqual(p.outer.length + p.holes.reduce((n, h) => n + h.length, 0) + 2 * p.holes.length - 2);
    }
    expect(items.data.length).toBe(items.count * ITEM);
  });

  it("chain each ring's edges with the distance along it, from 0 at its start", () => {
    const p = P.find((q) => q.holes.length)!;
    const it = items.solids.get(p)!;
    const first = item(it.outer[0]);
    expect(first[2]).toBe(0);
    for (let i = it.outer[0] + 1; i < it.outer[0] + it.outer[1]; i++) expect(item(i)[2]).toBeCloseTo(item(i - 1)[3]!, 4);
    // the first hole edge starts again at 0 and names its hole
    expect(item(it.holes[0])[2]).toBe(0);
    expect(item(it.holes[0])[1]).toBeGreaterThanOrEqual(0);
    expect(first[1]).toBe(-1);
  });

  it("tell each hole where its edges are, for clipping hole walls", () => {
    for (let h = 0; h < items.holes.length / 2; h++) {
      const [s, n] = [items.holes[2 * h]!, items.holes[2 * h + 1]!];
      for (let i = s; i < s + n; i++) expect(item(i)[1]).toBe(h);
    }
  });
});

describe("chunk tables", () => {
  it("number instances on from chunk to chunk and skip empty ranges", () => {
    const c = new Chunks();
    c.push([10, 4], 0, MODE.wall, 1, [0.5]);
    c.push([20, 0], 0, MODE.face, 2, []);
    c.push([30, 3], 1, MODE.line, 3, [1, 2, 3, 4, 5, 6, 7]);
    expect(c.n).toBe(2);
    expect(c.instances).toBe(7);
    expect(Array.from(c.data.subarray(0, 6))).toEqual([0, 10, 0, MODE.wall, 1, 0.5]);
    expect(Array.from(c.data.subarray(12, 24))).toEqual([4, 30, 1, MODE.line, 3, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("grow by whole texture rows", () => {
    const c = new Chunks();
    for (let i = 0; i < PER_ROW + 1; i++) c.push([i, 1], 0, MODE.line, i + 1, []);
    expect(c.n).toBe(PER_ROW + 1);
    expect(c.data.length % (ROW * 4)).toBe(0);
    expect(c.data[PER_ROW * ITEM + 1]).toBe(PER_ROW);
  });
});

describe("facing", () => {
  it("sees a wall whose outward normal points along the extrusion", () => {
    // a square in screen px (y down) extruded downwards, as a top face is: only its lower edge faces the viewer
    const sq: [number, number][] = [[0, 0], [10, 0], [10, 10], [0, 10]];
    const { vis } = wallsOf(sq, [0, 5], area(sq) > 0 ? 1 : -1);
    expect(vis).toEqual([false, false, true, false]);
  });

  it("steps the shade by the normal's light direction, clamped to the steps", () => {
    const [lx, ly] = FACING.light;
    const n = Math.hypot(lx, ly);
    expect(facingStep(lx / n, ly / n, 5)).toBe(4);
    expect(facingStep(-lx / n, -ly / n, 5)).toBe(0);
    expect(facingStep(0, 0, 5)).toBe(2);
  });
});

describe("the frame plan", () => {
  const plan = (tilt: number, dial: Parameters<typeof ladder>[0] = "full") => {
    const view = { tilt, explode: 0 };
    const LD = ladder(dial, view);
    const W = worldSolids(P, model, indexParts(model), model.solve(1.1), 1.1, 0, (p) => LD.solid(p.s.detail));
    const Pr = projector(view, { w: 1200, h: 800 }, pkg.bounds, [-20, 60], 40);
    const list = slices(W).sort((a, b) => a.top - b.top || Pr.key(...a.w.c) - Pr.key(...b.w.c) || a.z0 - b.z0);
    const dynStart = Math.ceil(items.data.length / (4 * ROW)) * PER_ROW;
    return { list, Pr, out: planFrame({ list, T: theme("dark"), LD, cardK: { plate: 1, base: 1 }, Pr, items, dynStart }), dynStart };
  };
  const chunks = (c: Chunks) => Array.from({ length: c.n }, (_, i) => Array.from(c.data.subarray(i * ITEM, (i + 1) * ITEM)));

  it("keeps the paint order: op numbers never go back, on either target", () => {
    const { out } = plan(28);
    for (const c of [out.frame, out.lines]) {
      const ops = chunks(c).map((k) => k[4]!);
      for (let i = 1; i < ops.length; i++) expect(ops[i]).toBeGreaterThanOrEqual(ops[i - 1]!);
      expect(Math.max(...ops)).toBeLessThan(out.ops);
    }
  });

  it("writes one slice row per slice and points every chunk at a slice", () => {
    const { list, out } = plan(28);
    expect(out.slices.length).toBe(list.length * 8);
    for (const k of [...chunks(out.frame), ...chunks(out.lines)]) expect(k[2]).toBeLessThan(list.length);
  });

  it("dashes only hidden lines on the frame, with a phase for every item", () => {
    const { out } = plan(28);
    for (const k of chunks(out.lines)) if (k[3] === MODE.line) expect(k[9]).toBe(0);
    const all = chunks(out.frame);
    let n = 0;
    all.forEach((k, i) => {
      if (k[3] !== MODE.line || !k[9]) return;
      // the chunk's items take consecutive phases from its pointer on
      const count = (all[i + 1]?.[0] ?? out.frame.instances) - k[0]!;
      expect(k[9]! - 1).toBe(n);
      n += count;
    });
    expect(n).toBeGreaterThan(0);
    expect(out.dash.length).toBe(n);
  });

  it("measures dash phases on the projected length, so a dash is as long on screen at any tilt", () => {
    // a ring along x keeps its length at any tilt; along y it shortens by cos(tilt)
    const a = plan(0).out;
    const b = plan(80).out;
    const sum = (d: Float32Array) => d.reduce((s, x) => s + x, 0);
    expect(sum(b.dash)).toBeLessThan(sum(a.dash));
  });

  it("draws no hidden lines once DL-G is passed", () => {
    const { out } = plan(28, "G");
    expect(out.dash.length).toBe(0);
    expect(chunks(out.frame).some((k) => k[3] === MODE.line)).toBe(false);
  });

  it("adds the silhouettes at each outline's far left and right as screen segments after the static items", () => {
    const { list, out, dynStart } = plan(28);
    const screen = chunks(out.lines).filter((k) => k[3] === MODE.screen);
    expect(screen.length).toBeGreaterThanOrEqual(list.filter((s) => s.isTop).length);
    for (const k of screen) expect(k[1]).toBeGreaterThanOrEqual(dynStart);
    expect(out.dyn.length % ITEM).toBe(0);
  });

  it("lists a joint head for every head seen from above", () => {
    const { list, out } = plan(28);
    expect(out.heads.length).toBe(list.filter((s) => s.isTop && s.w.p.headTop).length);
  });
});
