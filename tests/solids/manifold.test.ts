// Manifold at build time: every operation meshes, hole walls keep their tag through booleans, and the output is the
// same every run.
import { createHash } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { circle } from "../../src/core/geom";
import { checkMesh } from "../../src/solids/check";
import { atPose } from "../../src/solids/frame";
import { manifold, meshOf } from "../../src/solids/manifold";
import { extrudeOp, revolveOp, tessellate, volume } from "../../src/solids/tessellate";
import { TAG, type MeshData, type Profile, type Solid3 } from "../../src/solids/types";

let M: Awaited<ReturnType<typeof manifold>>;
beforeAll(async () => {
  M = await manifold();
});

type In = Pick<Solid3, "id" | "profile" | "op" | "features" | "mesh">;
const count = (t: Uint8Array, g: number) => t.reduce((n, x) => n + (x === g ? 1 : 0), 0);
const rect = (w: number, h: number): Profile => ({ outer: [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], holes: [] });
const hash = (m: MeshData) => createHash("sha256").update(Buffer.from(m.pos.buffer)).update(Buffer.from(m.tri.buffer)).update(m.tag).digest("hex");

describe("meshOf", () => {
  it("meshes a plate with a bore and tags the bore wall as a hole wall", () => {
    const s: In = { id: "plate", profile: { outer: rect(20, 20).outer, holes: [circle(4, 0, 0, 32).reverse()] }, op: extrudeOp(3) };
    const m = meshOf(M, s);
    expect(checkMesh(m).issues).toEqual([]);
    expect(count(m.tag, TAG.hole)).toBe(64);
    expect(count(m.tag, TAG.cap)).toBeGreaterThan(0);
    expect(volume(m)).toBeCloseTo(volume(tessellate(s.profile, s.op)), 3);
  });

  it("matches the browser's tessellation for twist and taper", () => {
    const s: In = { id: "twisted", profile: { outer: circle(8, 0, 0, 12).map(([x, y], i) => (i % 2 ? [x * 0.6, y * 0.6] : [x, y]) as [number, number]), holes: [] }, op: extrudeOp(10, { twist: 30, scaleTop: 0.7 }) };
    const m = meshOf(M, s);
    expect(checkMesh(m).issues).toEqual([]);
    // a twisted wall quad is not flat, so the two meshes differ by the diagonal they pick (about 1.5 %)
    expect(Math.abs(volume(m) / volume(tessellate(s.profile, s.op)) - 1)).toBeLessThan(0.02);
  });

  it("revolves a stepped shaft", () => {
    const profile: Profile = { outer: [[0, 0], [6, 0], [6, 20], [4, 20], [4, 30], [0, 30]], holes: [] };
    const op = revolveOp(profile);
    const m = meshOf(M, { id: "shaft", profile, op });
    expect(checkMesh(m).issues).toEqual([]);
    expect(volume(m) / volume(tessellate(profile, op))).toBeCloseTo(1, 4);
  });

  it("keeps the hole tag through a cut feature: a bored revolved cylinder with a keyway", () => {
    const profile: Profile = { outer: [[0, 0], [10, 0], [10, 12], [0, 12]], holes: [] };
    const bore: Profile = { outer: circle(3, 0, 0, 32), holes: [] };
    const key: Profile = { outer: [[-1, 2], [1, 2], [1, 4], [-1, 4]], holes: [] };
    const m = meshOf(M, {
      id: "gear-blank",
      profile,
      op: revolveOp(profile),
      features: [
        { mode: "cut", profile: bore, op: extrudeOp(14), frame: atPose(0, 0, -1) },
        { mode: "cut", profile: key, op: extrudeOp(14), frame: atPose(0, 0, -1) },
      ],
    });
    const r = checkMesh(m);
    expect(r.issues).toEqual([]);
    expect(r.holeWalls).toBeGreaterThan(64);
    // the outer cylinder and the two flat ends keep their own tags
    expect(count(m.tag, TAG.wall)).toBeGreaterThan(0);
    expect(count(m.tag, TAG.cap)).toBeGreaterThan(0);
  });

  it("adds a feature: a boss on a plate", () => {
    const m = meshOf(M, {
      id: "boss",
      profile: rect(20, 20),
      op: extrudeOp(3),
      features: [{ mode: "add", profile: { outer: circle(4, 0, 0, 32), holes: [] }, op: extrudeOp(5), frame: atPose(0, 0, 3) }],
    });
    expect(checkMesh(m).issues).toEqual([]);
    expect(volume(m)).toBeGreaterThan(1200);
  });

  it("feeds a sweep and a loft through ofMesh, holes included", () => {
    const sweepProfile: Profile = { outer: circle(3, 0, 0, 24), holes: [circle(1.2, 0, 0, 16).reverse()] };
    const sweep = meshOf(M, { id: "pipe", profile: sweepProfile, op: { op: "sweep", path: [[0, 0, 0], [0, 0, 10], [0, 0, 20]] } });
    expect(checkMesh(sweep).issues).toEqual([]);
    expect(count(sweep.tag, TAG.hole)).toBe(16 * 2 * 2);
    const a = rect(10, 10);
    const b = { outer: a.outer.map(([x, y]) => [x / 2, y / 2] as [number, number]), holes: [] };
    const loft = meshOf(M, { id: "tooth", profile: a, op: { op: "loft", sections: [{ z: 0, ...a }, { z: 6, ...b }] } });
    expect(checkMesh(loft).issues).toEqual([]);
    expect(volume(loft)).toBeCloseTo(350, 3);
  });

  it("gives the same bytes on every run", () => {
    const s: In = { id: "plate", profile: { outer: circle(15, 0, 0, 40), holes: [circle(4, 0, 0, 32).reverse()] }, op: extrudeOp(4, { twist: 20 }) };
    expect(hash(meshOf(M, s))).toBe(hash(meshOf(M, s)));
  });
});
