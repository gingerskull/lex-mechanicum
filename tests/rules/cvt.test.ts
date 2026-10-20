// The CVT engine step (standard 2.12): tapered solids posed by a sliding frame, deforming outlines that carry their
// holes, a posed solid whose end reaches a seat, and J12's CVT rule over sheave pairs (the fixture fx-cvt).
import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { extentAt, indexParts, ringsAt, solidBox, solidPose } from "../../src/assemble/pose";
import { frameAxis, framePoint } from "../../src/core/axis";
import { beltLength, beltRing, radiusFor } from "../../src/core/flex";
import { checkModel } from "../../src/model/check";
import { defineMechanism } from "../../src/model/define";
import { buildFrom } from "../../src/package/build";
import { decode, encode } from "../../src/package/format";
import { ladder } from "../../src/render/detail";
import { buildItems, ITEM_TEXELS, refreshItems } from "../../src/render/gl/geometry";
import { planFrame } from "../../src/render/gl/plan";
import { PER_ROW, ROW, SLICE } from "../../src/render/gl/shaders";
import { projector } from "../../src/render/projector";
import { depthOrder, slices } from "../../src/render/slices";
import { prepare, worldSolids } from "../../src/render/world";
import { theme } from "../../src/style/theme";
import { CVT, cvtModel } from "../fixtures/models";

const parts = indexParts(cvtModel);

describe("CVT geometry", () => {
  it("solves the second wrap radius from the belt length and keeps a band's point counts", () => {
    const L = beltLength(25, 25, 110);
    for (const r1 of [18, 25, 32]) expect(beltLength(r1, radiusFor(r1, 110, L), 110)).toBeCloseTo(L, 6);
    expect(beltRing([0, 0], 18, [110, 0], 33, 24)).toHaveLength(48);
    expect(beltRing([0, 0], 32, [110, 0], 17, 24)).toHaveLength(48);
  });
});

describe("posed solids: taper, deform with holes, reach", () => {
  const b = buildFrom("fx-cvt", { model: cvtModel });
  const P = prepare(b.pkg);
  const at = (u: number) => worldSolids(P, cvtModel, parts, cvtModel.solve(u), u, 0, () => true);

  it("boxes a tapered posed half at both ends and slides it along its axis", () => {
    const sl = P.find((p) => p.s.id === "outSlide")!;
    expect(sl.mods).toBe(true);
    const zs = [0, 1.5, 3, 4.5].map((u) => {
      const w = at(u).find((x) => x.p === sl)!;
      // the far end (z1) is the wide back, radius R: the plan box holds it
      expect(w.bb[2] - w.bb[0]).toBeCloseTo(2 * CVT.R, 0);
      return w.z0;
    });
    expect(Math.max(...zs) - Math.min(...zs)).toBeGreaterThan(3);
  });

  it("writes a posed tapered slice (code 7) with the far end's scale relative to the near end", () => {
    const u = 1.1;
    const W = at(u);
    const Pr = projector({ tilt: 28 }, { w: 1200, h: 800 }, b.pkg.bounds, [b.pkg.bounds.z0, b.pkg.bounds.z1], 40);
    const list = depthOrder(slices(W), (a, c) => a.top - c.top || a.z0 - c.z0, Pr);
    const items = buildItems(P);
    const out = planFrame({ list, T: theme("dark"), LD: ladder("full", { tilt: 28, explode: 0 }), cardK: { plate: 1, base: 1 }, Pr, items, dynStart: Math.ceil(items.data.length / (4 * ROW)) * PER_ROW });
    const i = list.findIndex((Sl) => Sl.w.p.s.id === "outSlide");
    const r = Array.from(out.slices.subarray(i * SLICE, (i + 1) * SLICE));
    expect(r[7]).toBe(7);
    const k = (w: number) => 1 + (1 / CVT.k - 1) * (w / CVT.t);
    // the near end's affine is scaled by k(top); the far end by k(z0) / k(top) on it
    expect(Math.hypot(r[14]!, r[15]!)).toBeCloseTo(k(r[4]!) / k(r[5]!), 5);
    // the near end's affine maps a point of the half's plane where its frame puts it
    const s = cvtModel.solve(u);
    const f = s.frames!.outSlide!;
    const q: [number, number] = [5, -2];
    const kq = k(r[5]!);
    // the half is fixed in its frame, which turns with the shaft
    const X = framePoint(f, [kq * q[0], kq * q[1]], r[5]!);
    const ref = Pr.P(X[0], X[1], X[2]);
    expect(r[0]! * q[0] + r[1]! * q[1] + r[8]! * r[5]! + r[10]!).toBeCloseTo(ref[0], 3);
    expect(r[2]! * q[0] + r[3]! * q[1] + r[9]! * r[5]! + r[11]!).toBeCloseTo(ref[1], 3);
  });

  it("deforms the posed belt's outer and inner edges and refreshes its hole items in place", async () => {
    const back = await decode(await encode(b.pkg));
    const Q = prepare(back);
    const belt = Q.find((p) => p.s.id === "vbelt")!;
    expect(belt.dyn).toBe("deform");
    const items = buildItems(Q);
    const W = worldSolids(Q, cvtModel, parts, cvtModel.solve(1.3), 1.3, 0, () => true);
    const w = W.find((x) => x.p === belt)!;
    expect(w.local!.holes).toHaveLength(1);
    expect(w.local!.holes[0]).toHaveLength(belt.holes[0]!.length);
    expect(w.local!.holes[0]![0]).not.toEqual(belt.holes[0]![0]);
    const it = items.solids.get(belt)!;
    const before = items.data.slice();
    const [lo, hi] = refreshItems(items, belt, w.local!);
    expect([lo, hi]).toEqual([it.outer[0], it.verts[0] + it.verts[1] - 1]);
    for (let i = 0; i < items.data.length; i++) if (i < lo * ITEM_TEXELS * 4 || i >= (hi + 1) * ITEM_TEXELS * 4) expect(items.data[i]).toBe(before[i]);
    const o = it.holes[0] * ITEM_TEXELS * 4;
    expect(items.data[o + 4]).toBeCloseTo(w.local!.holes[0]![0]![0], 4);
    // the hole id stays, so the hole walls still clip to it
    expect(items.data[o + 1]).toBe(before[o + 1]);
  });

  it("reads the deformed holes in the checks, and reports a deforming ring whose point count changes", () => {
    const { assembly } = assembleWith(cvtModel);
    const belt = assembly.solids.find((t) => t.id === "vbelt")!;
    const s = cvtModel.solve(2);
    expect(ringsAt(parts, belt, s).holes[0]![0]).toEqual(beltRing([0, 0], (s.r1 as number) - CVT.h / 2, [CVT.C, 0], (s.r2 as number) - CVT.h / 2, CVT.n)[0]);
    const bad = defineMechanism({
      ...cvtModel,
      id: "fx-cvt-bad",
      parts: cvtModel.parts.map((p) => (p.id === "vbelt" ? { ...p, deform: (x) => ({ outer: p.shape.outer, holes: [(x.r1 as number) > 25 ? p.shape.holes[0]!.slice(1) : p.shape.holes[0]!] }) } : p)),
    });
    expect(checkModel(bad).findings.some((f) => f.type === "WARN" && f.part === "vbelt")).toBe(true);
  });
});

describe("J12 CVT rule", () => {
  const { assembly } = assembleWith(cvtModel);
  const get = (id: string) => assembly.solids.find((t) => t.id === id);

  it("keys each sliding half from the keys table and springs only the half the spec asks for", () => {
    for (const h of ["inSlide", "outSlide"]) {
      const k = get(`flex-cvt-0-${h}-key`)!;
      expect(k.axis).toBe("p");
      expect(k.body).toBe(h);
      // the Ø10 shaft takes a 3 x 3 feather key (DIN 6885)
      const ys = k.outer.map((q) => q[1]);
      expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(3, 6);
    }
    expect(get("flex-cvt-0-inSlide-spring")).toBeUndefined();
    expect(get("flex-cvt-0-inSlide-seat")).toBeUndefined();
    expect(get("flex-cvt-0-outSlide-seat")!.body).toBe("outFixed");
    const J = assembly.joints.find((j) => j.id === "flex-cvt-0")!;
    expect(J.serves.F6).toEqual(["flex-cvt-0-outSlide-spring"]);
    expect(J.serves.F3).toHaveLength(2);
  });

  it("compresses the spring between the sliding half's back and the seat at every phase", () => {
    const sp = get("flex-cvt-0-outSlide-spring")!;
    const seat = get("flex-cvt-0-outSlide-seat")!;
    const half = get("outSlide")!;
    const lens: number[] = [];
    for (const u of [0, 1, 2, 3, 4, 5, 6]) {
      const s = cvtModel.solve(u);
      const f = s.frames!.outSlide!;
      expect(frameAxis(f)[2]).toBeCloseTo(1, 9);
      const [w0, w1] = extentAt(sp, f);
      // its near end on the half's back, its far end on the seat's face
      expect(w0).toBe(half.z1);
      expect(f.o[2] + w1).toBeCloseTo(seat.z0, 9);
      lens.push(w1 - w0);
      const q = solidPose(cvtModel, parts, sp, s, u)!;
      expect(solidBox(sp, q, s, parts)[5]).toBeCloseTo(seat.z0, 6);
    }
    expect(Math.min(...lens)).toBeGreaterThan(7.9);
    expect(Math.max(...lens) - Math.min(...lens)).toBeGreaterThan(3);
  });

  it("runs the output shaft on through the travel and the seat, and the model and the build are clean", () => {
    expect(get("pO2-shaft-cvt")!.z1).toBeGreaterThan(get("flex-cvt-0-outSlide-seat")!.z1);
    expect(get("pO2-end")).toBeUndefined();
    expect(checkModel(cvtModel).findings).toEqual([]);
    expect(clearance(cvtModel, assembly, 36)).toEqual([]);
    expect(clampCheck(cvtModel, assembly, 6)).toEqual([]);
  });

  it("packs the spring's reach", async () => {
    const b = buildFrom("fx-cvt", { model: cvtModel });
    const back = await decode(await encode(b.pkg));
    expect(back.solids.find((s) => s.id === "flex-cvt-0-outSlide-spring")!.reach!.end).toBe(1);
  });
});
