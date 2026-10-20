// Fixture scenes for the 3D renderer: boxes and discs as package v2 solids, with a poser coded by hand, so the renderer's
// maths, its principle visibility and its annotation are tested without the build pipeline. `scene3()` makes the package
// and the prepared geometry (no GPU); `tools/chrome3.ts` serves the same package to local Chrome for the drawn checks.
import type { Teaching } from "../../src/catalog/kin";
import { circle, type Vec2 } from "../../src/core/geom";
import type { PackedSolid3, Package2, Shape2 } from "../../src/package/format2";
import { FORMAT2, FLAG3 } from "../../src/package/format2";
import type { Poser } from "../../src/render/v3/poser";
import type { Scene } from "../../src/render/v3/scene";
import { IDENTITY, atPose, mat4 } from "../../src/solids/frame";
import { prepareShapes } from "../../src/solids/prepare";
import { extrudeOp } from "../../src/solids/tessellate";
import type { Frame } from "../../src/solids/types";
import type { RungId } from "../../src/style/detail";
import type { SolidKind, SolidRole } from "../../src/style/kinds";

export interface Fx {
  id: string;
  body: string;
  /** x0, y0, x1, y1 of a rectangle, or a disc: [cx, cy, r]. */
  rect?: [number, number, number, number];
  disc?: [number, number, number];
  z0: number;
  z1: number;
  role?: SolidRole;
  kind?: SolidKind;
  flags?: number;
  ex?: number;
  fr?: Frame;
  detail?: RungId;
  /** A round hole through a rectangle: cx, cy, r. */
  hole?: [number, number, number];
}

const rect = ([x0, y0, x1, y1]: [number, number, number, number]): Vec2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** A package of the given solids (each its own shape), and its prepared triangles and edges. */
export function pkg3(solids: Fx[]): { pkg: Package2; meshes: ReturnType<typeof prepareShapes>["meshes"]; edges: ReturnType<typeof prepareShapes>["edges"] } {
  const shapes: Shape2[] = [];
  const packed: PackedSolid3[] = solids.map((s, i) => {
    const ring = s.rect ? rect(s.rect) : circle(s.disc![2], s.disc![0], s.disc![1], 48);
    shapes.push({ profile: { outer: ring, holes: s.hole ? [circle(s.hole[2], s.hole[0], s.hole[1], 48).reverse()] : [] }, op: extrudeOp(s.z1 - s.z0) });
    return { id: s.id, name: "", kind: s.kind ?? "part", role: s.role ?? "link", body: s.body, fr: s.fr ?? atPose(0, 0, s.z0), shape: i, ex: s.ex ?? 0, detail: s.detail ?? "never", flags: s.flags ?? 0 };
  });
  const all = solids.flatMap((s) => (s.rect ? [[s.rect[0], s.rect[1]], [s.rect[2], s.rect[3]]] : [[s.disc![0] - s.disc![2], s.disc![1] - s.disc![2]], [s.disc![0] + s.disc![2], s.disc![1] + s.disc![2]]]));
  const bounds = { minX: Math.min(...all.map((p) => p[0]!)), minY: Math.min(...all.map((p) => p[1]!)), maxX: Math.max(...all.map((p) => p[0]!)), maxY: Math.max(...all.map((p) => p[1]!)), z0: Math.min(...solids.map((s) => s.z0)), z1: Math.max(...solids.map((s) => s.z1)) };
  const pkg: Package2 = { v: FORMAT2, id: "fx3", standard: "3.0", result: "", bounds, grid: 64, b0: bounds.z0, b1: bounds.z0, levels: [0], traces: {}, vmax: {}, joints: [], shapes, solids: packed };
  const p = prepareShapes(shapes);
  return { pkg, meshes: p.meshes, edges: p.edges };
}

/** A body that turns about (cx, cy) at one revolution per cycle; every other body stays. */
export function turning(body: string, cx: number, cy: number, points: Record<string, (u: number) => [number, number, number]> = {}): Poser {
  return {
    period: Math.PI * 2,
    place: (s, u) => {
      if (s.body !== body) return mat4(IDENTITY);
      const c = Math.cos(u), n = Math.sin(u);
      return [c, n, 0, 0, -n, c, 0, 0, 0, 0, 1, 0, cx - c * cx + n * cy, cy - n * cx - c * cy, 0, 1];
    },
    point: (u, id, ctl) => (points[id] ? points[id]!(u + (ctl?.drivers?.["phase"] ?? 0)) : null),
    span: () => null,
  };
}

export const FLAGS = FLAG3;

export function scene3(solids: Fx[], o: { poser?: Poser; teaching?: Teaching | null } = {}): Scene {
  const { pkg, meshes, edges } = pkg3(solids);
  const poser = o.poser ?? { period: Math.PI * 2, place: () => mat4(IDENTITY), point: () => null, span: () => null };
  return { pkg, meshes, edges, poser, teaching: o.teaching ?? null, info: { title: "Fixture", no: "FX-1" } };
}

/**
 * Overlapping translucent boxes in plan at three depths (and the same scene with every solid on a rung the dial drops, for
 * the paper behind them): the drawn check compares the peeled composite with a ray-cast of their top faces.
 */
export const DEPTH: Fx[] = [
  { id: "a", body: "g", rect: [0, 0, 60, 60], z0: 0, z1: 4, role: "hw", kind: "plate" },
  { id: "b", body: "g", rect: [30, 0, 90, 60], z0: 6, z1: 10, role: "trace", kind: "standoff" },
  { id: "c", body: "g", rect: [15, 30, 75, 90], z0: 12, z1: 16, role: "hw", kind: "plate" },
];

/** A block with a bore and a cross hole, for the section views. */
export const BLOCK: Fx[] = [
  { id: "block", body: "g", rect: [0, 0, 80, 50], z0: 0, z1: 30, role: "ground", kind: "housing", hole: [40, 25, 10] },
  { id: "pin", body: "g", disc: [40, 25, 6], z0: 4, z1: 36, role: "driver", kind: "shaft" },
];

const hidden = (xs: Fx[]): Fx[] => xs.map((s) => ({ ...s, kind: "nipple", detail: "E" }));

export const fixtures3: Record<string, Fx[]> = { "fx3-depth": DEPTH, "fx3-depth-bg": hidden(DEPTH), "fx3-depth-swap": DEPTH.map((s) => (s.id === "a" ? { ...s, z0: 18, z1: 22 } : s)), "fx3-block": BLOCK };
