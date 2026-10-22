// Package v2 (standard R4, D10): plain solids ship as profiles, boolean results and generators as quantised meshes,
// identical hardware once; decode(encode(p)) equals p and the bytes are the same on every build.
import { createHash } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { circle } from "../../src/core/geom";
import { buildPackage, type Built } from "../../src/package/build";
import { decode2, encode2, FLAG3, hasFlag3, type Package2 } from "../../src/package/format2";
import { pack2, type Sampled } from "../../src/package/pack2";
import { checkMesh } from "../../src/solids/check";
import { atPose } from "../../src/solids/frame";
import { manifold, meshOf } from "../../src/solids/manifold";
import { quantise } from "../../src/solids/quantise";
import { extrudeOp, revolveOp } from "../../src/solids/tessellate";
import type { Profile, Solid3 } from "../../src/solids/types";

const PILOTS = ["four-bar", "spur-gears", "bevel-gears"];
const built: Record<string, Built> = {};
const blobs: Record<string, Uint8Array> = {};

beforeAll(async () => {
  for (const id of PILOTS) {
    built[id] = await buildPackage(id);
    blobs[id] = await encode2(built[id]!.pkg);
  }
}, 120_000);

const same = (a: Package2, b: Package2) => {
  const { traces, plot, shapes, ...rest } = a;
  const { traces: t2, plot: p2, shapes: s2, ...rest2 } = b;
  expect(rest2).toEqual(rest);
  for (const k of Object.keys(traces)) expect(Array.from(t2[k]!)).toEqual(Array.from(traces[k]!));
  expect(Array.from(p2 ?? [])).toEqual(Array.from(plot ?? []));
  expect(s2.length).toBe(shapes.length);
  shapes.forEach((s, i) => {
    const t = s2[i]!;
    expect(t.op).toEqual(s.op);
    expect(t.profile).toEqual(s.profile);
    expect(t.marks).toEqual(s.marks);
    expect(Array.from(t.cap ?? [])).toEqual(Array.from(s.cap ?? []));
    if (s.mesh) {
      expect(Array.from(t.mesh!.pos)).toEqual(Array.from(s.mesh.pos));
      expect(Array.from(t.mesh!.tri)).toEqual(Array.from(s.mesh.tri));
      expect(Array.from(t.mesh!.tag)).toEqual(Array.from(s.mesh.tag));
    }
  });
};

describe("pilot packages", () => {
  it.each(PILOTS)("%s: every solid meshes and is sound", (id) => {
    const b = built[id]!;
    expect(b.failed).toEqual([]);
    expect(b.reports.filter((r) => !r.report.ok).map((r) => `${r.id}: ${r.report.issues.join("; ")}`)).toEqual([]);
  });

  it.each(PILOTS)("%s: decode(encode(p)) is p, and identical hardware is one shape", async (id) => {
    const b = built[id]!;
    same(b.pkg, await decode2(blobs[id]!));
    expect(b.pkg.shapes.length).toBeLessThan(b.pkg.solids.length);
  });

  it("gives the same bytes on a second build", async () => {
    const again = await encode2((await buildPackage("four-bar")).pkg);
    expect(createHash("sha256").update(again).digest("hex")).toBe(createHash("sha256").update(blobs["four-bar"]!).digest("hex"));
  });

  it("keeps what the renderer reads on every solid", () => {
    const b = built["four-bar"]!;
    b.solids.forEach((s, i) => {
      const p = b.pkg.solids[i]!;
      expect(p.id).toBe(s.id);
      expect(p.detail).toBe(s.detail);
      expect(p.ex).toBe(s.ex + 0);
      expect(hasFlag3(p, "isBase")).toBe(!!s.flags.isBase);
      expect(p.flags & FLAG3.accent ? true : false).toBe(!!s.flags.accent);
    });
  });
});

describe("meshes in a package", () => {
  const stub: Sampled = { n: 0, traces: {}, vmax: {}, coreBounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 }, plotData: null };
  const common = (): Omit<Solid3, "id" | "frame" | "profile" | "op"> => ({ kind: "part", role: "link", body: "ground", name: "", marks: [], ex: 0, joints: [], detail: "never", flags: {} });
  const bored: Profile = { outer: [[0, 0], [10, 0], [10, 12], [0, 12]], holes: [] };
  const solids: Solid3[] = [
    // a revolved blank with a bore and a keyway: a boolean result, shipped as a mesh
    {
      ...common(),
      id: "blank",
      frame: atPose(0, 0, 0),
      profile: bored,
      op: revolveOp(bored),
      features: [
        { mode: "cut", profile: { outer: circle(3, 0, 0, 32), holes: [] }, op: extrudeOp(14), frame: atPose(0, 0, -1) },
        { mode: "cut", profile: { outer: [[-1, 2], [1, 2], [1, 4], [-1, 4]], holes: [] }, op: extrudeOp(14), frame: atPose(0, 0, -1) },
      ],
    },
    // two identical washers and a swept loop: profiles
    ...[0, 1].map((i): Solid3 => ({ ...common(), id: `washer${i}`, frame: atPose(i * 30, 0, 0), profile: { outer: circle(5, 0, 0, 24), holes: [circle(2, 0, 0, 16).reverse()] }, op: extrudeOp(1) })),
    { ...common(), id: "link", frame: atPose(0, 40, 0), profile: { outer: circle(1.5, 0, 0, 16), holes: [] }, op: { op: "sweep", closed: true, path: Array.from({ length: 24 }, (_, i): [number, number, number] => [10 * Math.cos((i / 24) * 2 * Math.PI), 6 * Math.sin((i / 24) * 2 * Math.PI), 0]) } },
    { ...common(), id: "tooth", frame: atPose(0, 60, 0), profile: { outer: [[-2, -1], [2, -1], [2, 1], [-2, 1]], holes: [] }, op: { op: "loft", sections: [{ z: 0, outer: [[-2, -1], [2, -1], [2, 1], [-2, 1]], holes: [] }, { z: 5, outer: [[-1, -0.5], [1, -0.5], [1, 0.5], [-1, 0.5]], holes: [] }] } },
  ];
  let pkg: Package2;
  let M: Awaited<ReturnType<typeof manifold>>;
  beforeAll(async () => {
    M = await manifold();
    pkg = pack2({ id: "synthetic", solids, joints: [], levels: [0], b0: 0, b1: 0, bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, z0: 0, z1: 12 } }, stub, (s) => meshOf(M, s));
  });

  it("ships the boolean as a quantised mesh and the rest as profiles, washers shared", () => {
    expect(pkg.shapes.filter((s) => s.mesh).length).toBe(1);
    expect(pkg.shapes.length).toBe(4);
    expect(pkg.solids[1]!.shape).toBe(pkg.solids[2]!.shape);
    const m = pkg.shapes.find((s) => s.mesh)!.mesh!;
    expect(Array.from(m.pos).every((v) => Math.abs(v * 64 - Math.round(v * 64)) < 1e-4)).toBe(true);
    expect(checkMesh(m).issues).toEqual([]);
  });

  it("round-trips meshes, sweeps and lofts", async () => {
    same(pkg, await decode2(await encode2(pkg)));
  });

  it("mesh output is the same bytes on every run (golden)", () => {
    const m = quantise(meshOf(M, solids[0]!));
    const h = createHash("sha256").update(Buffer.from(m.pos.buffer)).update(Buffer.from(m.tri.buffer)).update(m.tag).digest("hex");
    expect(h).toBe(createHash("sha256").update(Buffer.from(quantise(meshOf(M, solids[0]!)).pos.buffer)).update(Buffer.from(m.tri.buffer)).update(m.tag).digest("hex"));
    // pinned: a change here means Manifold or the build changed the geometry, which the thumbnails' fingerprints follow
    expect(h).toMatchInlineSnapshot(`"81460a0d2eb95936ccfddce101544d0fea97027e147c38903fbfb1afe11fad78"`);
  });
});
