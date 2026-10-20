// Swept volumes (A19): the space each moving body, with the hardware it carries, passes through over the cycle. A body's
// sweep is the convex hulls of its poses taken two at a time (consecutive samples), so it covers the path between
// samples and a hole or a notch is filled, never the other way. Supports are routed against these with Manifold's
// least gap. Build time, Node only.
import { type Mat4, apply, mat4 } from "../solids/frame";
import { meshOf, type manifold } from "../solids/manifold";
import type { Solid3 } from "../solids/types";
import { m3, v3, xf, type Vec3, type Xf } from "../kin/math";
import { SWEEP_STEP } from "./constants";
import type { Vec2 } from "../core/geom";
import type { BuildCtx } from "./ctx";
import { projectAlong } from "./view";

type Wasm = Awaited<ReturnType<typeof manifold>>;
type Mf = InstanceType<Wasm["Manifold"]>;

/** A solid as a Manifold in world reference coordinates. */
export function worldManifold(M: Wasm, s: Solid3): Mf {
  const m = meshOf(M, s);
  const g = new M.Mesh({ numProp: 3, vertProperties: m.pos, triVerts: m.tri });
  const base = M.Manifold.ofMesh(g);
  const out = base.transform(mat4(s.frame));
  base.delete();
  return out;
}

const vertexCache = new WeakMap<Solid3, Vec3[]>();
/** The mesh vertices of a solid in world reference coordinates (cached per solid). */
export function worldPoints(M: Wasm, s: Solid3): Vec3[] {
  const hit = vertexCache.get(s);
  if (hit) return hit;
  const m = meshOf(M, s);
  const out: Vec3[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < m.pos.length; i += 3) {
    const k = `${Math.round(m.pos[i]! * 20)},${Math.round(m.pos[i + 1]! * 20)},${Math.round(m.pos[i + 2]! * 20)}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(apply(s.frame, [m.pos[i]!, m.pos[i + 1]!, m.pos[i + 2]!]));
  }
  vertexCache.set(s, out);
  return out;
}

/** The pose a fraction t of the way from A to B: the turn between them taken in proportion, the shift linearly. */
export function between(A: Xf, B: Xf, t: number): Xf {
  const rel = m3.mul(m3.T(A.R), B.R);
  const w = m3.log(rel);
  const ang = v3.len(w);
  const R = ang < 1e-12 ? A.R : m3.mul(A.R, m3.axisAngle(w, ang * t));
  return { R, t: v3.lerp(A.t, B.t, t) };
}

/** The matrix of a rigid transform, column-major. */
export const xfMat = (X: Xf): Mat4 => [X.R[0], X.R[3], X.R[6], 0, X.R[1], X.R[4], X.R[7], 0, X.R[2], X.R[5], X.R[8], 0, X.t[0], X.t[1], X.t[2], 1];

type Box = [number, number, number, number, number, number];
const boxGap3 = (a: Box, b: Box): number => {
  const dx = Math.max(0, a[0] - b[3], b[0] - a[3]);
  const dy = Math.max(0, a[1] - b[4], b[1] - a[4]);
  const dz = Math.max(0, a[2] - b[5], b[2] - a[5]);
  return Math.hypot(dx, dy, dz);
};
const boxOfMf = (m: Mf): Box => {
  const b = m.boundingBox();
  const lo = b.min as number[];
  const hi = b.max as number[];
  return [lo[0]!, lo[1]!, lo[2]!, hi[0]!, hi[1]!, hi[2]!];
};

/**
 * A swept volume: the convex hulls of consecutive poses, kept apart (their union is a costly boolean and nothing here
 * needs it: a gap is the least over the hulls, a height the greatest, an outline the union of the projections).
 */
export class Swept {
  readonly box: Box;
  private boxes: Box[];
  constructor(
    private M: Wasm,
    readonly hulls: Mf[],
  ) {
    this.boxes = hulls.map(boxOfMf);
    this.box = this.boxes.reduce<Box>((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2]), Math.max(a[3], b[3]), Math.max(a[4], b[4]), Math.max(a[5], b[5])], [...this.boxes[0]!]);
  }

  /** Least distance from a shape to the volume, at most `search`. */
  gap(shape: Mf, search: number): number {
    const sb = boxOfMf(shape);
    let g = search;
    for (let i = 0; i < this.hulls.length; i++) {
      if (boxGap3(sb, this.boxes[i]!) >= g) continue;
      g = Math.min(g, shape.minGap(this.hulls[i]!, g));
      if (g <= 0) return 0;
    }
    return g;
  }

  /** The greatest z the volume reaches inside a prism, or null when it does not meet it. */
  topWithin(prism: Mf): number | null {
    const pb = boxOfMf(prism);
    let top: number | null = null;
    for (let i = 0; i < this.hulls.length; i++) {
      if (boxGap3(pb, this.boxes[i]!) > 0) continue;
      const x = this.hulls[i]!.intersect(prism);
      if (!x.isEmpty()) {
        const t = (x.boundingBox().max as number[])[2]!;
        top = top === null ? t : Math.max(top, t);
      }
      x.delete();
    }
    return top;
  }

  /** The outline seen along a direction: the union of the hulls' projections. */
  project(dir: Vec3): InstanceType<Wasm["CrossSection"]> {
    const parts = this.hulls.map((h) => projectAlong(h, dir));
    const u = this.M.CrossSection.union(parts);
    parts.forEach((p) => p.delete());
    return u;
  }

  delete(): void {
    this.hulls.forEach((h) => h.delete());
  }
}

export class Sweeps {
  private cache = new Map<string, { key: string; volume: Swept }>();
  private own: { delete(): void }[] = [];
  private statics = new Map<string, { s: Solid3; m: Mf }>();
  private plan: { key: string; polys: Vec2[][] } | null = null;
  private staticPlan = new Map<string, { s: Solid3; polys: Vec2[][] }>();
  constructor(private ctx: BuildCtx) {}

  /** The solids that ride a body now: its own part and its twin first. */
  private riding(body: string): Solid3[] {
    const out: Solid3[] = [];
    const p = this.ctx.parts.get(body);
    if (p) out.push(p);
    const t = this.ctx.twins.get(body);
    if (t) out.push(t);
    for (const s of this.ctx.solids) if (s.body === body) out.push(s);
    return out;
  }

  /** The outline of every moving body's sweep seen from above, as rings (a post is judged against it in plan). */
  planPolys(): Vec2[][] {
    const bodies = this.moving();
    const vs = bodies.map((b) => this.of(b));
    const key = bodies.map((b, i) => `${b}:${vs[i] ? this.cache.get(b)?.key : ""}`).join("|");
    if (this.plan && this.plan.key === key) return this.plan.polys;
    const parts = vs.filter((v): v is Swept => !!v).map((v) => v.project([0, 0, -1]));
    const u = this.ctx.M.CrossSection.union(parts);
    const polys = u.toPolygons() as Vec2[][];
    parts.forEach((p) => p.delete());
    u.delete();
    this.plan = { key, polys };
    return polys;
  }

  /** A fixed solid's outline from above. */
  staticPolys(s: Solid3): Vec2[][] {
    const hit = this.staticPlan.get(s.id);
    if (hit && hit.s === s) return hit.polys;
    const m = this.staticOf(s);
    const cs = m.project();
    const polys = cs.toPolygons() as Vec2[][];
    cs.delete();
    this.staticPlan.set(s.id, { s, polys });
    return polys;
  }

  /** Forget the sweeps of these bodies: something rode them that did not before. */
  touch(bodies: string[]): void {
    for (const b of bodies) {
      const c = this.cache.get(b);
      if (c) {
        c.volume.delete();
        this.cache.delete(b);
      }
    }
  }

  /** The swept volume of a body, in world reference coordinates. */
  of(body: string): Swept | null {
    const solids = this.riding(body);
    if (!solids.length) return null;
    const key = `${solids.length}:${solids.map((s) => s.id).join(",")}`;
    const hit = this.cache.get(body);
    if (hit && hit.key === key) return hit.volume;
    hit?.volume.delete();
    const M = this.ctx.M;
    // the vertices of everything the body carries, in world reference coordinates
    const pts: Vec3[] = [];
    for (const sol of solids) for (const v of worldPoints(M, sol)) pts.push(v);
    const n = this.ctx.sampled.us.length;
    const step = n > 200 ? 2 : 1;
    // the farthest points of the body stand for it when judging how far it moves between two samples
    const c0 = pts.reduce((a, p) => v3.add(a, p), [0, 0, 0] as Vec3);
    const cen = v3.mul(c0, 1 / pts.length);
    const probe = [...pts].sort((a, b) => v3.dist(b, cen) - v3.dist(a, cen)).slice(0, 6);
    const xs: Xf[] = [];
    for (let i = 0; i < n; i += step) xs.push(this.ctx.xfOf(body, i));
    const refined: Xf[] = [];
    for (let i = 0; i < xs.length; i++) {
      const A = xs[i]!;
      const B = xs[(i + 1) % xs.length]!;
      refined.push(A);
      // a fast part is sampled finer so the hull of two poses never covers more than it sweeps (SWEEP_STEP mm apart)
      const move = Math.max(...probe.map((p) => v3.dist(xf.apply(A, p), xf.apply(B, p))));
      const sub = Math.min(24, Math.floor(move / SWEEP_STEP));
      for (let k = 1; k <= sub; k++) refined.push(between(A, B, k / (sub + 1)));
    }
    const poses: Vec3[][] = refined.map((X) => pts.map((p) => xf.apply(X, p)));
    const hulls: Mf[] = [];
    for (let i = 0; i < poses.length; i++) hulls.push(M.Manifold.hull([...poses[i]!, ...poses[(i + 1) % poses.length]!]));
    const volume = new Swept(M, hulls);
    this.cache.set(body, { key, volume });
    return volume;
  }

  /** Bodies that move (a pose that differs from the reference at some sample). */
  moving(): string[] {
    const out: string[] = [];
    for (const [id, xs] of this.ctx.sampled.xfs) {
      if (id === "ground") continue;
      const moves = xs.some((X) => X.t.some((v) => Math.abs(v) > 1e-6) || X.R.some((v, k) => Math.abs(v - (k % 4 === 0 ? 1 : 0)) > 1e-9));
      if (moves) out.push(id);
    }
    return out;
  }

  /**
   * Least distance from a shape to the swept volume of the given bodies (default: every moving body), at most
   * `search`; 0 when they overlap.
   */
  gap(shape: Mf, bodies?: string[], search = 20): number {
    let g = search;
    for (const b of bodies ?? this.moving()) {
      const v = this.of(b);
      if (!v) continue;
      g = Math.min(g, v.gap(shape, g));
      if (g <= 0) return 0;
    }
    return g;
  }

  /** Bounding box of every body's sweep (the ground excluded), [x0, y0, z0, x1, y1, z1]. */
  bounds(): Box | null {
    let b: Box | null = null;
    for (const id of this.ctx.kin.bodies.map((q) => q.id)) {
      const v = id === "ground" ? null : this.of(id);
      if (!v) continue;
      b = b ? [Math.min(b[0], v.box[0]), Math.min(b[1], v.box[1]), Math.min(b[2], v.box[2]), Math.max(b[3], v.box[3]), Math.max(b[4], v.box[4]), Math.max(b[5], v.box[5])] : [...v.box];
    }
    return b;
  }

  /** A fixed solid as a Manifold (cached per solid id; a solid that changed is rebuilt). */
  staticOf(s: Solid3): Mf {
    const hit = this.statics.get(s.id);
    if (hit && hit.s === s) return hit.m;
    hit?.m.delete();
    const m = worldManifold(this.ctx.M, s);
    this.statics.set(s.id, { s, m });
    return m;
  }

  /** Track a temporary Manifold so `dispose` frees it. */
  keep<T extends { delete(): void }>(m: T): T {
    this.own.push(m);
    return m;
  }

  dispose(): void {
    for (const c of this.cache.values()) c.volume.delete();
    this.cache.clear();
    for (const c of this.statics.values()) c.m.delete();
    this.statics.clear();
    for (const m of this.own) m.delete();
    this.own = [];
  }
}
