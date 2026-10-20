// The hand fixes of the first compliant passes (flexure hinge, bistable) promoted to rules: the J13 seat plate under
// the clamped block and no posts under a blank, dowel holes through block, clamp plate and seat, stops a fifth of the
// half swing past it on the lever's edge or banking a guided body's travel, the neck one piece with its lever and block
// (clearance and model check), fixed parts that deform swept rather than ground, the oscillating drive through a pin in
// a J13 lever's tip, and one material for the blank.
import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { indexParts, isGround, solidPose } from "../../src/assemble/pose";
import { D2R, TAU, xf, type Vec2 } from "../../src/core/geom";
import { inside, toLocal } from "../../src/core/poly";
import { defineMechanism } from "../../src/model/define";
import { checkModel } from "../../src/model/check";
import { P } from "../../src/parts";
import { createContext } from "../../src/rules/context";
import { BLANK } from "../../src/rules/materials";
import { STOP_MARGIN, j13 } from "../../src/rules/j13-compliant";
import { deformModel, flexureDriveModel, flexureModel, guidedModel } from "../fixtures/models";
import { contextBefore, run } from "./helpers";

const J = "flexure-neck";
const centre = (h: Vec2[]): Vec2 => h.reduce((a, p): Vec2 => [a[0] + p[0] / h.length, a[1] + p[1] / h.length], [0, 0]);

describe("J13 seat: the clamped block on a ground plate of its own outline, never on posts", () => {
  for (const m of [flexureModel, guidedModel])
    it(`${m.id}: a seat under each block from the base to its underside; no post under a block or a neck`, () => {
      const { assembly: a } = assembleWith(m);
      for (const c of m.compliant!) {
        const id = `flexure-${c.neck}`;
        const seat = a.solids.find((s) => s.id === `${id}-seat`)!;
        const block = a.solids.find((s) => s.id === c.ground)!;
        expect(seat.z0).toBeCloseTo(a.b1, 9);
        expect(seat.z1).toBeCloseTo(block.z0, 9);
        expect(seat.outer).toEqual(xf(m.parts.find((p) => p.id === c.ground)!.shape.outer, m.parts.find((p) => p.id === c.ground)!.fixed!));
        expect(a.solids.some((s) => s.id.startsWith(`${c.ground}-post`) || s.id.startsWith(`${c.neck}-post`))).toBe(false);
        expect(a.joints.some((j) => j.id.endsWith("-post"))).toBe(false);
      }
    });
});

describe("J13 dowels: reamed through block, clamp plate and seat", () => {
  it("cuts a Ø3 hole at each dowel in the block (its own frame), the clamp plate and the seat", () => {
    for (const m of [flexureModel, guidedModel]) {
      const ctx = contextBefore(m, j13);
      run(ctx, j13);
      for (const c of m.compliant!) {
        const id = `flexure-${c.neck}`;
        const g = m.parts.find((p) => p.id === c.ground)!.fixed!;
        for (const k of [0, 1]) {
          const d = ctx.get(`${id}-cdw${k}`)!;
          const at: Vec2 = [d.at[0], d.at[1]];
          const holed = (holes: Vec2[][], p: Vec2) => holes.some((h) => Math.hypot(...(centre(h).map((v, i) => v - p[i]!) as Vec2)) < 1e-6 && inside(h, p));
          expect(holed(ctx.get(c.ground)!.holes, toLocal(g, at))).toBe(true);
          expect(holed(ctx.get(`${id}-clamp`)!.holes, at)).toBe(true);
          expect(holed(ctx.get(`${id}-seat`)!.holes, at)).toBe(true);
        }
      }
    }
  });
});

describe("J13 stops", () => {
  it("a turning lever: the pin touches the lever's edge a fifth of the half swing past each end", () => {
    const { assembly: a } = assembleWith(flexureDriveModel);
    const c = flexureDriveModel.compliant![0]!;
    const m = (STOP_MARGIN * (c.range[1] - c.range[0])) / 2;
    expect(m).toBeCloseTo(0.4 * D2R, 12);
    const lever = flexureDriveModel.parts.find((p) => p.id === "lever")!;
    // with the lever turned to each stop angle the pin touches it; at the end of the swing it clears by about the margin
    for (const [k, end] of [[0, c.range[0] - m], [1, c.range[1] + m]] as const) {
      const pin = a.solids.find((s) => s.id === `${J}-stop${k}`)!;
      const L = xf(lever.shape.outer, [0, 0, end]);
      const dist = (Q: Vec2[]) => Math.min(...Q.map((p, i) => {
        const q = Q[(i + 1) % Q.length]!;
        const t = Math.max(0, Math.min(1, ((pin.at[0] - p[0]) * (q[0] - p[0]) + (pin.at[1] - p[1]) * (q[1] - p[1])) / ((q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2)));
        return Math.hypot(p[0] + t * (q[0] - p[0]) - pin.at[0], p[1] + t * (q[1] - p[1]) - pin.at[1]);
      }));
      expect(dist(L)).toBeCloseTo(2.5, 1);
      expect(dist(xf(lever.shape.outer, [0, 0, k ? c.range[1] : c.range[0]]))).toBeGreaterThan(2.6);
    }
    expect(a.joints.find((j) => j.id === J)!.note).toMatch(/stop pins 0\.4° past each end of the 4° swing/);
  });

  it("a guided body: a pin at each end of its solved travel, past its end faces by a fifth of the half travel, on each ground's side", () => {
    const ctx = contextBefore(guidedModel, j13);
    run(ctx, j13);
    const m = STOP_MARGIN * 5;
    for (const [id, s] of [["flexure-neckL", -1], ["flexure-neckR", 1]] as const) {
      const lo = ctx.get(`${id}-stop0`)!;
      const hi = ctx.get(`${id}-stop1`)!;
      expect(lo.at[0]).toBeCloseTo(s * 5, 9);
      expect(hi.at[0]).toBeCloseTo(s * 5, 9);
      expect(lo.at[1]).toBeCloseTo(-5 - 12 - m - 2.5, 6);
      expect(hi.at[1]).toBeCloseTo(5 + 12 + m + 2.5, 6);
      expect(ctx.joint(id)!.note).toMatch(/stop pins bank the shuttle 1 mm past each end of its travel/);
    }
  });

  it("builds clear over the cycle", () => {
    for (const m of [flexureModel, flexureDriveModel, guidedModel]) {
      const { assembly } = assembleWith(m);
      expect(clearance(m, assembly).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
      expect(clampCheck(m, assembly)).toEqual([]);
    }
  });
});

describe("a compliant neck is one piece with its lever and its block", () => {
  // the neck runs 2 mm into the lever's root: by design, not a clash
  const model = defineMechanism({
    id: "fx-neck-into-lever",
    input: { kind: "manual", part: "lever" },
    parts: [
      P.custom("block", [[-40, -20], [-6, -20], [-6, 20], [-40, 20]], { role: "ground", fixed: [0, 0, 0] }),
      P.custom("neck", [[-8, -3], [8, -3], [8, 3], [-8, 3]], { role: "link", fixed: [0, 0, 0] }),
      P.custom("lever", [[6, -6], [70, -6], [70, 6], [6, 6]], { role: "driver", at: "N", spin: (s) => s.b as number }),
    ],
    compliant: [{ neck: "neck", ground: "block", lever: "lever", at: "N", range: [-3 * D2R, 3 * D2R] }],
    solve: (u) => ({ pts: { N: [0, 0] }, b: 3 * D2R * Math.sin(u) }),
  });
  it("is no OVERLAP in the model check and no clash in clearance", () => {
    expect(checkModel(model).findings.filter((f) => f.type === "OVERLAP")).toEqual([]);
    const { assembly } = assembleWith(model);
    expect(clearance(model, assembly).filter((c) => [c.a, c.b].includes("neck"))).toEqual([]);
  });
  it("while the same parts with no compliant joint do overlap", () => {
    const plain = { ...model, compliant: undefined };
    expect(checkModel(plain).findings.some((f) => f.type === "OVERLAP")).toBe(true);
  });
});

describe("isGround: a fixed part that deforms or stretches is not ground", () => {
  it("keys the fixed flexspline and the fixed bending necks as moving, and sweeps them", () => {
    expect(isGround(indexParts(deformModel), "flexspline")).toBe(false);
    expect(isGround(indexParts(guidedModel), "neckL")).toBe(false);
    expect(isGround(indexParts(guidedModel), "blockL")).toBe(true);
    const ctx = createContext(guidedModel);
    const sw = ctx.sweeps().find((s) => s.part.id === "neckL")!;
    expect(sw.regions.length).toBeGreaterThan(1);
    // the swept neck is seen by the context's clearance where it bends to at the travel's end, not only where it stands
    expect(ctx.hits([-12, 5], 0.5, 0, 6)).toBe(true);
  });
});

describe("oscillating drive for a J13 lever (V5)", () => {
  const { assembly: a } = assembleWith(flexureDriveModel);
  const get = (id: string) => a.solids.find((s) => s.id === id)!;
  it("presses a pin into the lever's tip bore, down through an arc slot in the base, circlips on both pins", () => {
    const pin = get("drive-pin");
    expect(pin.body).toBe("lever");
    expect(pin.at[0]).toBeCloseTo(60, 9);
    expect(pin.at[1]).toBeCloseTo(0, 9);
    expect(pin.z1).toBe(get("lever").z1);
    expect(pin.z0).toBeLessThan(a.b0);
    const slot = get("base").holes.find((h) => inside(h, [60, 0]))!;
    for (const b of [-2 * D2R, 2 * D2R]) expect(inside(slot, [60 * Math.cos(b), 60 * Math.sin(b)])).toBe(true);
    expect(inside(slot, [60 * Math.cos(5 * D2R), 60 * Math.sin(5 * D2R)])).toBe(false);
    expect(a.joints.find((j) => j.id === "drive")!.serves.F2).toEqual(["drive-pin-cl", "drive-crank-pin-cl"]);
  });
  it("puts the motor on the tip chord's line, the crank half the chord: the link's dead centres at the ends of the swing", () => {
    const crank = get("drive-crank");
    const mo = crank.motion as { motor: Vec2; r: number; L: number; pivot: Vec2; rho: number };
    expect(mo.pivot).toEqual([0, 0]);
    expect(mo.rho).toBeCloseTo(60, 9);
    expect(mo.r).toBeCloseTo(60 * Math.sin(2 * D2R), 9);
    expect(mo.motor[0]).toBeCloseTo(60 * Math.cos(2 * D2R), 9);
    const T = (b: number): Vec2 => [60 * Math.cos(b), 60 * Math.sin(b)];
    const d = (b: number) => Math.hypot(T(b)[0] - mo.motor[0], T(b)[1] - mo.motor[1]);
    expect(Math.max(d(2 * D2R), d(-2 * D2R))).toBeCloseTo(mo.L + mo.r, 9);
    expect(Math.min(d(2 * D2R), d(-2 * D2R))).toBeCloseTo(mo.L - mo.r, 9);
    // the link follows the pin round the cycle; the motor's bell turns at the motor, with the crank
    const parts = indexParts(flexureDriveModel);
    for (let i = 0; i < 12; i++) {
      const u = (i / 12) * TAU;
      const s = flexureDriveModel.solve(u);
      const lk = solidPose(flexureDriveModel, parts, get("drive-link"), s, u)!;
      const tip = T(s.b as number);
      const end = xf([[mo.L, 0]], lk)[0]!;
      expect(Math.hypot(end[0] - tip[0], end[1] - tip[1])).toBeLessThan(1e-6);
      const bell = solidPose(flexureDriveModel, parts, get("drive-bell"), s, u)!;
      expect(Math.hypot(bell[0] - mo.motor[0], bell[1] - mo.motor[1])).toBeLessThan(1e-9);
    }
    expect(get("drive-floor").name).toMatch(/link window/);
    expect(a.joints.find((j) => j.id === "drive")!.badge).toEqual(["motorised", "ok"]);
  });
  it("adds a tip bore to a lever that has none", () => {
    const m = { ...flexureDriveModel, id: "fx-flexure-drive-nobore", parts: flexureDriveModel.parts.map((p) => (p.id === "lever" ? { ...p, shape: { ...p.shape, holes: [] } } : p)) };
    const { assembly } = assembleWith(m);
    const lever = assembly.solids.find((s) => s.id === "lever")!;
    expect(lever.holes.some((h) => inside(h, [59, 0]))).toBe(true);
    expect(assembly.solids.find((s) => s.id === "drive-pin")!.at[0]).toBeCloseTo(59, 9);
  });
});

describe("one material for the blank (M10)", () => {
  it("names block, neck and lever of every joint the blank's material", () => {
    for (const m of [flexureDriveModel, guidedModel]) {
      const { assembly: a } = assembleWith(m);
      for (const c of m.compliant!) for (const id of [c.ground, c.neck, c.lever]) expect(a.solids.find((s) => s.id === id)!.mat).toBe(BLANK);
    }
  });
});
