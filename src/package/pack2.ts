// Build-time packing for package v2 (Node): v3 solids to shapes and instances. A plain solid becomes a profile shape and
// an operation; a boolean result (features, or a hand-made mesh) becomes a quantised mesh shape, from the `meshOf`
// callback (Manifold, src/solids/manifold.ts) so this module stays free of it. Solids with the same shape share one.
import type { Vec2 } from "../core/geom";
import type { Sampled } from "../model/sample";
import type { Joint } from "../rules/types";
import { rounded } from "../solids/frame";
import { checkMesh } from "../solids/check";
import { quantise } from "../solids/quantise";
import { cleanRing, dropCollinear, tessellate } from "../solids/tessellate";
import { isPlain, type MeshData, type Op, type Profile, type Solid3, type Vec3 } from "../solids/types";
import { gridFor, type PackageBounds } from "./format";
import { FLAG3, type Flag3, type PackedSolid3, type Package2, type Shape2 } from "./format2";

export interface Pack2Input {
  id: string;
  standard?: string;
  result?: string;
  solids: Solid3[];
  joints: Joint[];
  levels: number[];
  b0: number;
  b1: number;
  bounds: PackageBounds;
}

const FIELD_FLAGS = ["inset", "accent", "faint", "isBase", "headTop", "seeThrough"] as const satisfies readonly Flag3[];

const coords = (op: Op): number[] => (op.op === "sweep" ? op.path.flat() : op.op === "loft" ? op.sections.flatMap((s) => [s.outer, ...s.holes].flat(2)) : []);

/** Reduces v3 solids to a package. Coordinates are snapped to the package grid; meshes are quantised to 1/64 mm. */
export function pack2(a: Pack2Input, sampled: Sampled, meshOf: (s: Solid3) => MeshData, o: { allMesh?: boolean; fixProfile?: (p: Profile) => Profile | null } = {}): Package2 {
  const candidate = (s: Solid3) => isPlain(s) && !o.allMesh;
  const raw = (s: Solid3): Profile => ({ outer: cleanRing(s.profile.outer), holes: s.profile.holes.map(cleanRing) });
  let max = 0;
  const see = (xs: Iterable<number>) => {
    for (const x of xs) max = Math.max(max, Math.abs(x));
  };
  for (const s of a.solids) {
    for (const m of s.marks) see(m.pts.flat());
    if (!candidate(s)) continue;
    see(s.profile.outer.flat());
    for (const h of s.profile.holes) see(h.flat());
    see(coords(s.op));
  }
  const traceRaw: Record<string, number[]> = {};
  for (const [k, pts] of Object.entries(sampled.traces)) see((traceRaw[k] = pts.flat()));
  const grid = gridFor(max);
  const snap = (x: number) => Math.round(x * grid) / grid + 0;
  const snap2 = (r: readonly Vec2[]): Vec2[] => r.map(([x, y]): Vec2 => [snap(x), snap(y)]);
  // snapped and without points on a straight run: a stretched or deforming member keeps every point (its count is fixed)
  const snapP = (p: Profile, keepAll = false): Profile => {
    const ring = (r: readonly Vec2[]) => (keepAll ? snap2(r) : dropCollinear(snap2(r)));
    return { outer: ring(p.outer), holes: p.holes.map(ring) };
  };
  const snapOp = (op: Op): Op => {
    if (op.op === "sweep") return { ...op, path: op.path.map((p): Vec3 => [snap(p[0]), snap(p[1]), snap(p[2])]) };
    if (op.op === "loft") return { op: "loft", sections: op.sections.map((s) => ({ z: snap(s.z), outer: snap2(s.outer), holes: s.holes.map(snap2) })) };
    return op;
  };

  // The profile that ships, as the browser will triangulate it: a profile whose holes overlap each other or the rim has
  // them united by Manifold at build time; one that still does not triangulate into a closed solid is a boolean result
  // and ships as a mesh. A stretched or deforming member must stay a profile whatever it is.
  const sound = (p: Profile, op: Op) => checkMesh(tessellate(p, op), { thin: false }).ok;
  const chosen = new Map<Solid3, Profile | null>();
  for (const s of a.solids) {
    if (!candidate(s)) continue;
    const keepAll = !!(s.stretch || s.deform);
    const snapped = snapP(raw(s), keepAll);
    const op = snapOp(s.op);
    let pick: Profile | null = sound(snapped, op) ? snapped : null;
    if (!pick && o.fixProfile && s.profile.holes.length && (s.op.op === "extrude" || s.op.op === "sweep")) {
      const fixed = o.fixProfile(raw(s));
      const f = fixed && snapP(fixed, keepAll);
      if (f && sound(f, op)) pick = f;
    }
    chosen.set(s, pick ?? (s.stretch || s.deform ? snapped : null));
  }
  const plain = (s: Solid3) => !!chosen.get(s);

  const shapes: Shape2[] = [];
  const index = new Map<string, number>();
  const shapeOf = (s: Solid3): number => {
    const marks = s.marks.map((m) => ({ kind: m.kind, pts: snap2(cleanRingKeep(m.pts)) }));
    let shape: Shape2;
    let key: string;
    if (plain(s)) {
      const profile = chosen.get(s)!;
      const op = snapOp(s.op);
      shape = { profile, marks, op };
      key = JSON.stringify([op, profile, marks]);
    } else {
      const mesh = quantise(meshOf(s));
      if (mesh.tag.length || !isPlain(s)) {
        shape = { mesh, marks };
        key = JSON.stringify([marks, Array.from(mesh.pos), Array.from(mesh.tri), Array.from(mesh.tag)]);
      } else {
        // Manifold made nothing of it (a solid with no volume, which SOLID reports): keep its profile so nothing vanishes
        const profile = snapP(raw(s), true);
        const op = snapOp(s.op);
        shape = { profile, marks, op };
        key = JSON.stringify([op, profile, marks]);
      }
    }
    const hit = index.get(key);
    if (hit !== undefined) return hit;
    index.set(key, shapes.length);
    shapes.push(shape);
    return shapes.length - 1;
  };

  const solids = a.solids.map((s): PackedSolid3 => {
    let flags = 0;
    for (const f of FIELD_FLAGS) if (s.flags[f]) flags |= FLAG3[f];
    if (s.deform) flags |= FLAG3.deform;
    const p: PackedSolid3 = { id: s.id, name: s.name, kind: s.kind, role: s.role, body: s.body, fr: rounded(s.frame), shape: shapeOf(s), ex: s.ex, detail: s.detail, flags };
    if (s.joints.length) p.joints = [...s.joints];
    if (s.group !== undefined) p.group = s.group;
    if (s.motion) p.motion = s.motion;
    if (s.mat !== undefined) p.mat = s.mat;
    if (s.closure) p.closure = s.closure;
    if (s.headKind) p.headKind = s.headKind;
    if (s.chamfer !== undefined) p.chamfer = s.chamfer;
    if (s.thread) p.thr = { ...s.thread };
    if (s.stretch) p.stretch = [s.stretch[0], s.stretch[1]];
    if (s.posedBy) p.posedBy = s.posedBy;
    if (s.reach) p.reach = { to: [s.reach.to[0], s.reach.to[1], s.reach.to[2]], end: s.reach.end };
    if (s.legacyAxis) p.legacyAxis = s.legacyAxis;
    return p;
  });
  const traces: Record<string, Float32Array> = {};
  for (const [k, xs] of Object.entries(traceRaw)) traces[k] = Float32Array.from(xs, snap);
  const pkg: Package2 = {
    v: 2,
    id: a.id,
    standard: a.standard ?? "none",
    result: a.result ?? "none",
    bounds: { ...a.bounds },
    grid,
    b0: a.b0,
    b1: a.b1,
    levels: [...a.levels],
    traces,
    vmax: { ...sampled.vmax },
    joints: a.joints.map((j) => structuredClone(j)),
    shapes,
    solids,
  };
  if (sampled.plotData) pkg.plot = Float32Array.from(sampled.plotData);
  return pkg;
}

/** A mark's points are kept as they are (an open polyline has no closing duplicate to drop). */
const cleanRingKeep = (p: readonly Vec2[]): Vec2[] => p.map((q): Vec2 => [q[0], q[1]]);
