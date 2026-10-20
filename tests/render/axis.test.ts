// Drawing across axes (#165): the slices of x and y solids, their depth order among z slices, and the slice and chunk
// rows the frame plan writes for them (the fixture scene of tests/fixtures/scenes.ts).
import { beforeAll, describe, expect, it } from "vitest";
import { indexParts } from "../../src/assemble/pose";
import type { MechanismModel } from "../../src/model/types";
import { buildFrom } from "../../src/package/build";
import type { Package } from "../../src/package/format";
import { ladder } from "../../src/render/detail";
import { buildItems, ITEM_TEXELS, type Items } from "../../src/render/gl/geometry";
import { planFrame, type Chunks } from "../../src/render/gl/plan";
import { MODE, PER_ROW, ROW } from "../../src/render/gl/shaders";
import { projector } from "../../src/render/projector";
import { boxOfSliceable, depthOrder, separate, slices, type Slice, type Sliceable } from "../../src/render/slices";
import { prepare, worldSolids, type Prepared, type World } from "../../src/render/world";
import { theme } from "../../src/style/theme";
import { scenes } from "../fixtures/scenes";

const ITEM = ITEM_TEXELS * 4;
const flat = (z0: number, z1: number, bb: [number, number, number, number]): Sliceable => ({ z0, z1, bb });
// a shaft along y: plan box x -6..6, y -58..58, world z 30..42
const shaftY = (): Sliceable => ({ z0: 30, z1: 42, bb: [-6, -58, 6, 58], axis: "y", along: [-58, 58] });

describe("slices across axes", () => {
  it("cuts a y solid along y at the y bounds of a solid whose box meets it, and that solid at its z bounds", () => {
    const block = flat(25, 50, [-16, -46, 16, -34]);
    const out = slices([shaftY(), block]);
    expect(out.filter((s) => s.w.axis === "y").map((s) => [s.z0, s.top])).toEqual([[-58, -46], [-46, -34], [-34, 58]]);
    expect(out.filter((s) => s.w === block).map((s) => [s.z0, s.top])).toEqual([[25, 30], [30, 42], [42, 50]]);
  });

  it("leaves a y solid whole when no box meets it, and marks its low-y slice as the face seen", () => {
    const out = slices([shaftY(), flat(0, 6, [-50, -50, 50, 50])]);
    expect(out.filter((s) => s.w.axis === "y")).toHaveLength(1);
    const cut = slices([shaftY(), flat(25, 50, [-16, -46, 16, -34])]).filter((s) => s.w.axis === "y");
    expect(cut.find((s) => s.isTop)!.z0).toBe(-58);
    expect(cut.find((s) => s.isBottom)!.top).toBe(58);
  });

  it("orders boxes by the plane between them: lower or farther back first", () => {
    const t = { ct: Math.cos(0.5), st: Math.sin(0.5) };
    expect(separate([0, 0, 0, 10, 10, 5], [0, 0, 6, 10, 10, 9], t)).toBe(-1);
    expect(separate([0, 20, 0, 10, 30, 5], [0, 0, 0, 10, 10, 30], t)).toBe(-1);
    expect(separate([0, 0, 0, 10, 10, 5], [20, 0, 0, 30, 10, 5], t)).toBe(0);
    // below but in front: the two never overlap on screen
    expect(separate([0, 0, 0, 10, 10, 5], [0, 20, 6, 10, 30, 9], { ct: Math.cos(1.2), st: Math.sin(1.2) })).toBe(0);
  });

  it("keeps the z slices' order and puts each y slice after what it covers and before what covers it", () => {
    const base = flat(-10, -2, [-60, -70, 60, 70]);
    const block = flat(25, 50, [-16, -46, 16, -34]);
    const high = flat(60, 66, [-10, 0, 10, 10]);
    const W = [shaftY(), base, block, high];
    const t = { ct: Math.cos(0.5), st: Math.sin(0.5) };
    const cmp = (a: Slice, b: Slice) => a.top - b.top || a.z0 - b.z0;
    const L = depthOrder(slices(W), cmp, t);
    const idx = (f: (s: Slice) => boolean) => L.findIndex(f);
    const sY = (a: number) => idx((s) => s.w.axis === "y" && s.z0 === a);
    // the base is below everything; the plate above the shaft covers it; the shaft in the block's bore is drawn first
    expect(idx((s) => s.w === base)).toBeLessThan(sY(-34));
    expect(sY(-34)).toBeLessThan(idx((s) => s.w === high));
    expect(sY(-46)).toBeLessThan(idx((s) => s.w === block && s.z0 === 30));
    // the z slices keep their own order
    const zs = L.filter((s) => s.w.axis !== "y");
    expect(zs).toEqual([...zs].sort(cmp));
  });

  it("gives every slice its world box", () => {
    expect(boxOfSliceable(shaftY(), -46, -34)).toEqual([-6, -46, 30, 6, -34, 42]);
    expect(boxOfSliceable(flat(1, 2, [0, 0, 3, 4]), 1.5, 2)).toEqual([0, 0, 1.5, 3, 4, 2]);
  });
});

describe("the frame plan across axes", () => {
  const scene = (id: string) => {
    const b = buildFrom(id, scenes[id]!);
    const P = prepare(b.pkg);
    return { pkg: b.pkg, model: b.model, P, items: buildItems(P) };
  };
  let y: { pkg: Package; model: MechanismModel; P: Prepared[]; items: Items };
  let x: typeof y;
  beforeAll(() => {
    y = scene("fx-shaft-in-plan");
    x = scene("fx-shaft-in-plan-x");
  });
  const plan = (s: typeof y, tilt: number) => {
    const view = { tilt, explode: 0 };
    const LD = ladder("full", view);
    const W = worldSolids(s.P, s.model, indexParts(s.model), s.model.solve(1.1), 1.1, 0, () => true);
    const Pr = projector(view, { w: 1200, h: 800 }, s.pkg.bounds, [s.pkg.bounds.z0, s.pkg.bounds.z1], 40);
    const list = depthOrder(slices(W), (a, b) => a.top - b.top || Pr.key(...a.w.c) - Pr.key(...b.w.c) || a.z0 - b.z0, Pr);
    const dynStart = Math.ceil(s.items.data.length / (4 * ROW)) * PER_ROW;
    return { list, out: planFrame({ list, T: theme("dark"), LD, cardK: { plate: 1, base: 1 }, Pr, items: s.items, dynStart }) };
  };
  const row = (o: Float32Array, i: number) => Array.from(o.subarray(i * 8, i * 8 + 8));
  const chunks = (c: Chunks) => Array.from({ length: c.n }, (_, i) => Array.from(c.data.subarray(i * ITEM, (i + 1) * ITEM)));

  it("writes the axis code, the far and the near end of each slice: a y slice is seen from its low-y end", () => {
    for (const [s, code] of [[y, 2], [x, 1]] as const) {
      const { list, out } = plan(s, 28);
      list.forEach((Sl: Slice<World>, i) => {
        const r = row(out.slices, i);
        expect(r[7]).toBe(Sl.w.axis ? code : 0);
        const [far, near] = Sl.w.axis === "y" ? [Sl.top, Sl.z0] : [Sl.z0, Sl.top];
        expect(r[4]).toBeCloseTo(far, 4);
        expect(r[5]).toBeCloseTo(near, 4);
      });
    }
  });

  it("draws the top outline of a y solid at its near end, and no hole walls for an x solid", () => {
    const { list, out } = plan(y, 28);
    const lines = chunks(out.lines).filter((k) => k[3] === MODE.line);
    const shaftTop = list.findIndex((s) => s.w.p.s.id === "shaft" && s.isTop);
    expect(lines.some((k) => k[2] === shaftTop && k[5] === -58)).toBe(true);
    const px = plan(x, 28);
    const holeWalls = chunks(px.out.frame).filter((k) => k[3] === MODE.holeWall && px.list[k[2]!]!.w.axis === "x");
    expect(holeWalls).toEqual([]);
  });

  it("keeps the paint order with x and y slices: op numbers never go back", () => {
    for (const s of [x, y])
      for (const tilt of [0, 28, 60, 88]) {
        const { out } = plan(s, tilt);
        for (const c of [out.frame, out.lines]) {
          const ops = chunks(c).map((k) => k[4]!);
          for (let i = 1; i < ops.length; i++) expect(ops[i]).toBeGreaterThanOrEqual(ops[i - 1]!);
        }
      }
  });
});
