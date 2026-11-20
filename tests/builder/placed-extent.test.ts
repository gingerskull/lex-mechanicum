// A part the record places (`place`) is measured by its own faces and its own facing, wherever the placement solver's slab
// would put it (issue 280): the stack's members, `ctx.extent`, the slide kit (J5), a contact's slabs and the headroom
// check all read the same span.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import { contactOf } from "../../src/builder/contact";
import { spanAlong, type BuildCtx, type RecordLike } from "../../src/builder/ctx";
import type { Frame } from "../../src/builder/frames";
import { slabRange } from "../../src/builder/placer";
import { membersOf, siteFrame } from "../../src/builder/rules/stacks";
import { worldManifold } from "../../src/builder/sweeps";
import type { Kin } from "../../src/kin";
import type { Solid3 } from "../../src/solids/types";
import * as F from "../kin/fixtures";
import { fixtureRecord } from "./fixtures";

const builds = new Map<string, Promise<BuildCtx>>();
const build = (name: string, rec?: RecordLike) => {
  if (!builds.has(name)) builds.set(name, buildWithContext(rec ?? fixtureRecord(name)).then(({ ctx }) => ctx));
  return builds.get(name)!;
};
afterAll(async () => {
  for (const c of builds.values()) (await c).dispose();
});

/** A solid's world range along a frame's z, from the frame's origin, read from its built mesh. */
const along = (ctx: BuildCtx, s: Solid3, f: Frame): [number, number] => {
  const m = worldManifold(ctx.M, s);
  const mesh = m.getMesh();
  m.delete();
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < mesh.vertProperties.length; i += mesh.numProp) {
    const w = (mesh.vertProperties[i]! - f.o[0]) * f.z[0] + (mesh.vertProperties[i + 1]! - f.o[1]) * f.z[1] + (mesh.vertProperties[i + 2]! - f.o[2]) * f.z[2];
    lo = Math.min(lo, w);
    hi = Math.max(hi, w);
  }
  return [lo, hi];
};

const box = (ctx: BuildCtx, id: string) => {
  const m = worldManifold(ctx.M, ctx.get(id)!);
  const b = m.boundingBox();
  m.delete();
  return b;
};

/** The Geneva fixture with its wheel placed by the record, its frame facing down the axis (against the crank's). */
function genevaFacingDown(): RecordLike {
  const k = F.geneva();
  const c = 20 / Math.sin(Math.PI / 4);
  const kin: Kin = { ...k, bodies: k.bodies.map((b) => (b.id === "wheel" ? ({ ...b, frame: { origin: [c, 0, 9], x: [1, 0, 0], z: [0, 0, -1] }, shape: { place: 0, thickness: 6 } } as unknown as typeof b) : b)) };
  return { id: "genevaFacingDown", kin };
}

describe("a part's own span", () => {
  const up: Frame = { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] };
  const plate = (o: [number, number, number], z: [number, number, number]): Solid3 => ({ frame: { o, x: [1, 0, 0], z }, op: { op: "extrude", h: 6, steps: 1 }, profile: { outer: [], holes: [] } }) as unknown as Solid3;

  it("runs along the frame from its origin when it faces the same way, back from it when it faces the other", () => {
    expect(spanAlong(plate([0, 0, 10], [0, 0, 1]), up)).toEqual([10, 16]);
    expect(spanAlong(plate([0, 0, 10], [0, 0, -1]), up)).toEqual([4, 10]);
  });

  it("gives no span for a part that is not square to the frame", () => {
    expect(spanAlong(plate([0, 0, 0], [1, 0, 0]), up)).toBeNull();
  });
});

describe("stack members span their own faces (symptom 1)", () => {
  for (const id of ["desmodromic-cam", "plug-door-hinge", "lever-escapement"]) {
    it(`${id}: every member's span is its part's built faces along the stack`, async () => {
      const ctx = await build(id);
      let n = 0;
      for (const site of ctx.sites.filter((s) => ctx.stacks.has(s.id))) {
        const f0 = siteFrame(ctx, site);
        if (!f0) continue;
        for (const m of membersOf(ctx, site, f0, new Set())) {
          const s = ctx.get(m.solid);
          if (!s || s.op.op !== "extrude" || s.features?.length) continue;
          const w = along(ctx, s, f0);
          expect(m.w0, `${site.id} ${m.solid}`).toBeCloseTo(w[0], 3);
          expect(m.w1, `${site.id} ${m.solid}`).toBeCloseTo(w[1], 3);
          n++;
        }
      }
      expect(n).toBeGreaterThanOrEqual(2);
    });
  }

  it("desmodromic-cam: the closing rocker's pillow blocks stand either side of it, not both beyond it", async () => {
    const ctx = await build("desmodromic-cam");
    const rocker = box(ctx, "rocker-close");
    const b0 = box(ctx, "Q2-pb-b0");
    const b1 = box(ctx, "Q2-pb-b1");
    const y = [(b0.min[1] + b0.max[1]) / 2, (b1.min[1] + b1.max[1]) / 2].sort((a, b) => a - b);
    expect(y[0]!).toBeLessThan(rocker.min[1]);
    expect(y[1]!).toBeGreaterThan(rocker.max[1]);
  });
});

describe("ctx.extent of a placed part (symptom 3)", () => {
  it("plug-door-hinge: the guide arm and the door span their own faces, so no false headroom report at D", async () => {
    const ctx = await build("plug-door-hinge");
    for (const [b, w] of [["guide-arm", [0, 6]], ["door", [8, 20]], ["goose-neck", [20.5, 26.5]]] as const) {
      const e = ctx.extent(b)!;
      const k = e.frame.z[2] > 0 ? 1 : -1;
      const z = [e.frame.o[2] + k * e.w0, e.frame.o[2] + k * e.w1].sort((p, q) => p - q);
      expect(z[0], b).toBeCloseTo(w[0], 6);
      expect(z[1], b).toBeCloseTo(w[1], 6);
    }
    expect(ctx.issues.filter((s) => s.startsWith("headroom"))).toEqual([]);
    // the pin turned head down (D) spans the guide arm and the door with no hand-set frame axes on either: its head under
    // the arm
    expect(box(ctx, "D-bolt-head").max[2]).toBeLessThanOrEqual(0 + 1e-6);
  });

  it("lever-escapement: the impulse pin stands in the placed lever's fork, not on the slab under it", async () => {
    const ctx = await build("lever-escapement");
    const lever = box(ctx, "lever");
    const pin = box(ctx, "fork-pin");
    expect(pin.min[2]).toBeGreaterThanOrEqual(lever.min[2] - 1e-6);
    expect(pin.max[2]).toBeLessThanOrEqual(lever.max[2] + 1e-6);
    const slab = slabRange(ctx.placement, "lever")!;
    expect(slab.w0).not.toBeCloseTo(ctx.extent("lever")!.w0, 3);
  });
});

describe("the slide kit reads the placed slider (symptom 2)", () => {
  it("face-groove-cam: the slide rails stand at the follower's own level, flush with its top", async () => {
    const ctx = await build("face-groove-cam");
    const fol = box(ctx, "follower");
    for (const id of ["G-rail0", "G-rail1"]) {
      const r = box(ctx, id);
      expect(r.min[2], id).toBeCloseTo(fol.min[2], 6);
      expect(r.max[2], id).toBeCloseTo(fol.max[2], 6);
    }
    expect(box(ctx, "G-keeper").min[2]).toBeCloseTo(fol.max[2], 6);
  });
});

describe("a contact's slabs follow a part facing the other way (symptom 4)", () => {
  it("a Geneva wheel placed facing down the axis: the contact reads its own faces, and the roller runs inside them", async () => {
    const ctx = await build("genevaFacingDown", genevaFacingDown());
    const ji = ctx.joints.find((j) => j.id === "Pin")!;
    const c = contactOf(ctx, ji)!;
    const wheel = along(ctx, ctx.get("wheel")!, c.frame);
    expect(c.zb![0]).toBeCloseTo(wheel[0], 6);
    expect(c.zb![1]).toBeCloseTo(wheel[1], 6);
    // the wheel spans z 3 to 9 in the world, below its frame's origin
    const w = box(ctx, "wheel");
    expect(w.min[2]).toBeCloseTo(3, 6);
    expect(w.max[2]).toBeCloseTo(9, 6);
    const roller = ctx.solids.find((s) => s.id.startsWith("Pin-") && /roller/.test(s.id));
    if (roller) {
      const r = box(ctx, roller.id);
      expect(r.min[2]).toBeGreaterThanOrEqual(3 - 1e-6);
      expect(r.max[2]).toBeLessThanOrEqual(9 + 1e-6);
    }
  });
});
