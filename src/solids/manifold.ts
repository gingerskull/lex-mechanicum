// Build-time geometry (Node only, never shipped): a Solid3 as a watertight Manifold mesh with face tags. Every operand
// of a boolean is made original first, so the triangles of the hole walls and of the cuts keep their own id through
// the boolean and are tagged apart from the body's walls and caps. Sweeps and lofts come from the small generators of
// src/solids/tessellate.ts and enter Manifold through ofMesh; a hand-made `mesh` enters the same way. Meshes are in
// the solid's own frame (not placed on its body).
import Module from "manifold-3d";
import type { Vec2 } from "../core/geom";
import { cross, dot, mat4, norm } from "./frame";
import { CAP_COS, orient, tessellate } from "./tessellate";
import { TAG, type LoftSection, type MeshData, type Op, type Profile, type Solid3, type Vec3 } from "./types";

type Wasm = Awaited<ReturnType<typeof Module>>;
type Mf = InstanceType<Wasm["Manifold"]>;

let W: Wasm | null = null;
/** The Manifold module, loaded once. */
export async function manifold(): Promise<Wasm> {
  if (!W) {
    W = await Module();
    W.setup();
  }
  return W;
}

/** How far a cutter runs past the faces it cuts through, mm. */
const OVER = 1;

const rot = (P: readonly Vec2[], a: number, k: number): Vec2[] => {
  const c = Math.cos(a) * k;
  const s = Math.sin(a) * k;
  return P.map(([x, y]): Vec2 => [c * x - s * y, s * x + c * y]);
};

/** One prism of an extrude op between heights w0 and w1 (the part spans 0..h; a cutter reaches past it). */
function prism(M: Wasm, rings: Vec2[][], op: Extract<Op, { op: "extrude" }>, w0: number, w1: number): Mf {
  const k1 = op.scaleTop ?? 1;
  const tw = op.twist ?? 0;
  const kAt = (w: number) => 1 + ((k1 - 1) * w) / op.h;
  const aAt = (w: number) => (tw * w) / op.h;
  const ka = kAt(w0);
  const kb = kAt(w1);
  const base = rings.map((r) => rot(r, (aAt(w0) * Math.PI) / 180, ka));
  const cs = new M.CrossSection(base, "NonZero");
  const twist = aAt(w1) - aAt(w0);
  // nDivisions counts the extra layers, so a prism of `steps` segments takes steps - 1; a cutter that runs past the
  // ends keeps the body's segment length
  const steps = twist ? Math.max(2, Math.round((op.steps * (w1 - w0)) / op.h)) : 1;
  const m = M.Manifold.extrude(cs, w1 - w0, steps - 1, twist, [kb / ka, kb / ka]).translate([0, 0, w0]);
  cs.delete();
  return m;
}

const ccw = (r: readonly Vec2[]): Vec2[] => (orient({ outer: r as Vec2[], holes: [] }).outer);

/** A sweep path run past both ends by OVER along the end tangents (a cutter through a swept body). */
function longer(path: Vec3[]): Vec3[] {
  const a = path[0]!;
  const b = path[1]!;
  const y = path[path.length - 1]!;
  const x = path[path.length - 2]!;
  const t0 = norm([a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
  const t1 = norm([y[0] - x[0], y[1] - x[1], y[2] - x[2]]);
  return [[a[0] + OVER * t0[0], a[1] + OVER * t0[1], a[2] + OVER * t0[2]], ...path, [y[0] + OVER * t1[0], y[1] + OVER * t1[1], y[2] + OVER * t1[2]]];
}

/** Loft sections run past both ends by OVER in z, the rings continued in a straight line. */
function loftLonger(S: LoftSection[]): LoftSection[] {
  const ext = (a: LoftSection, b: LoftSection, to: number): LoftSection => {
    const t = (to - a.z) / (b.z - a.z);
    const mix = (p: Vec2, q: Vec2): Vec2 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    return { z: to, outer: a.outer.map((p, i) => mix(p, b.outer[i]!)), holes: a.holes.map((h, k) => h.map((p, i) => mix(p, b.holes[k]![i]!))) };
  };
  const n = S.length;
  return [ext(S[0]!, S[1]!, S[0]!.z - OVER), ...S, ext(S[n - 1]!, S[n - 2]!, S[n - 1]!.z + OVER)];
}

function fromMesh(M: Wasm, m: MeshData, what: string): Mf {
  const g = new M.Mesh({ numProp: 3, vertProperties: m.pos, triVerts: m.tri });
  const out = M.Manifold.ofMesh(g);
  const st = out.status();
  if (st !== "NoError") throw new Error(`${what}: Manifold rejects the mesh (${st})`);
  return out;
}

interface Shape {
  /** The body without its profile's holes. */
  body: Mf;
  /** One cutter per profile hole. */
  cutters: Mf[];
}

/** The shape a profile and an op make, as Manifold solids: the outer body and a cutter for each hole. */
function shapeOf(M: Wasm, profile: Profile, op: Op, what: string): Shape {
  const p = orient(profile);
  if (op.op === "extrude") {
    const body = prism(M, [p.outer], op, 0, op.h);
    const cutters = p.holes.map((h) => prism(M, [ccw(h.slice().reverse())], op, -OVER, op.h + OVER));
    return { body, cutters };
  }
  if (op.op === "revolve") {
    const rev = (ring: Vec2[]) => {
      const cs = new M.CrossSection([ring], "NonZero");
      const m = M.Manifold.revolve(cs, op.segments, 360);
      cs.delete();
      return m;
    };
    return { body: rev(p.outer), cutters: p.holes.map((h) => rev(ccw(h.slice().reverse()))) };
  }
  if (op.op === "sweep") {
    const body = fromMesh(M, tessellate({ outer: p.outer, holes: [] }, op), what);
    const long: Op = op.closed ? op : { ...op, path: longer(op.path) };
    const cutters = p.holes.map((h) => fromMesh(M, tessellate({ outer: ccw(h.slice().reverse()), holes: [] }, long), what));
    return { body, cutters };
  }
  const S = op.sections;
  const solo = (s: LoftSection[], pick: (x: LoftSection) => Vec2[]): LoftSection[] => s.map((x) => ({ z: x.z, outer: pick(x), holes: [] }));
  const body = fromMesh(M, tessellate({ outer: S[0]!.outer, holes: [] }, { op: "loft", sections: solo(S, (x) => x.outer) }), what);
  const long = loftLonger(S);
  const cutters = (S[0]!.holes).map((_, k) =>
    fromMesh(M, tessellate({ outer: [], holes: [] }, { op: "loft", sections: solo(long, (x) => x.holes[k]!.slice().reverse()) }), what),
  );
  return { body, cutters };
}

/** The faces of the primary shape that count as caps: all flat faces across the z axis, or the end planes of a sweep. */
function capTest(s: Pick<Solid3, "op">): (n: Vec3, c: Vec3) => boolean {
  const op = s.op;
  if (op.op === "extrude" || op.op === "revolve") return (n) => Math.abs(n[2]) > CAP_COS;
  const planes: { n: Vec3; p: Vec3 }[] = [];
  if (op.op === "sweep" && !op.closed) {
    const P = op.path;
    const t0 = norm([P[1]![0] - P[0]![0], P[1]![1] - P[0]![1], P[1]![2] - P[0]![2]]);
    const m = P.length;
    const t1 = norm([P[m - 1]![0] - P[m - 2]![0], P[m - 1]![1] - P[m - 2]![1], P[m - 1]![2] - P[m - 2]![2]]);
    planes.push({ n: [-t0[0], -t0[1], -t0[2]], p: P[0]! }, { n: t1, p: P[m - 1]! });
  } else if (op.op === "loft") {
    planes.push({ n: [0, 0, -1], p: [0, 0, op.sections[0]!.z] }, { n: [0, 0, 1], p: [0, 0, op.sections[op.sections.length - 1]!.z] });
  }
  return (n, c) => planes.some((q) => dot(n, q.n) > CAP_COS && Math.abs(dot([c[0] - q.p[0], c[1] - q.p[1], c[2] - q.p[2]], q.n)) < 1e-3);
}

/**
 * The mesh of a solid, tagged, in the solid's own frame. Throws when Manifold rejects an operand (an open or
 * self-intersecting generator mesh).
 */
export function meshOf(M: Wasm, s: Pick<Solid3, "id" | "profile" | "op" | "features" | "mesh">): MeshData {
  const live: { delete(): void }[] = [];
  const keep = <T extends { delete(): void }>(m: T): T => (live.push(m), m);
  try {
    let body: Mf;
    const holeIds = new Set<number>();
    if (s.mesh) {
      body = keep(fromMesh(M, s.mesh, s.id)).asOriginal();
    } else {
      const sh = shapeOf(M, s.profile, s.op, s.id);
      live.push(sh.body, ...sh.cutters);
      body = keep(sh.body.asOriginal());
      for (const c of sh.cutters) {
        const o = keep(c.asOriginal());
        holeIds.add(o.originalID());
        body = keep(body.subtract(o));
      }
    }
    for (const f of s.features ?? []) {
      const sh = shapeOf(M, f.profile, f.op, s.id);
      live.push(sh.body, ...sh.cutters);
      let part = keep(sh.body.asOriginal());
      const cut = f.mode === "cut";
      if (cut) holeIds.add(part.originalID());
      for (const c of sh.cutters) {
        const o = keep(c.asOriginal());
        holeIds.add(o.originalID());
        part = keep(part.subtract(o));
      }
      const placed = keep(part.transform(mat4(f.frame)));
      body = keep(cut ? body.subtract(placed) : body.add(placed));
    }
    const g = body.getMesh();
    const np = g.numProp;
    const pos = new Float32Array(g.numVert * 3);
    for (let i = 0; i < g.numVert; i++) for (let k = 0; k < 3; k++) pos[i * 3 + k] = g.vertProperties[i * np + k]!;
    const tri = new Uint32Array(g.triVerts);
    const tag = new Uint8Array(g.numTri);
    const runOf = new Int32Array(g.numTri);
    for (let r = 0; r < g.runOriginalID.length; r++) for (let t = g.runIndex[r]! / 3; t < g.runIndex[r + 1]! / 3; t++) runOf[t] = g.runOriginalID[r]!;
    const isCap = capTest(s);
    for (let t = 0; t < g.numTri; t++) {
      const a = tri[3 * t]! * 3;
      const b = tri[3 * t + 1]! * 3;
      const c = tri[3 * t + 2]! * 3;
      if (holeIds.has(runOf[t]!)) {
        tag[t] = TAG.hole;
        continue;
      }
      const n = norm(cross([pos[b]! - pos[a]!, pos[b + 1]! - pos[a + 1]!, pos[b + 2]! - pos[a + 2]!], [pos[c]! - pos[a]!, pos[c + 1]! - pos[a + 1]!, pos[c + 2]! - pos[a + 2]!]));
      // the cap plane test reads one vertex: caps are flat, so every vertex of the triangle lies in it
      tag[t] = isCap(n, [pos[a]!, pos[a + 1]!, pos[a + 2]!]) ? TAG.cap : TAG.wall;
    }
    return { pos, tri, tag };
  } finally {
    for (const m of live) m.delete();
  }
}
