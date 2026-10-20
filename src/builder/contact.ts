// What a contact joint (a slot, a slide, a mesh, a cam, a belt, a screw) needs to know about itself to be built (A21): the
// frame it is built in, the slabs of its two bodies along the axis, and how far one body runs on the other over the
// cycle. All of it comes from the declared joint and the sampled poses, never from overlapping outlines.
import { circle, type Vec2 } from "../core/geom";
import { v3, xf, type Vec3 } from "../kin/math";
import type { Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import { fromPlane, parallel, planeCoords, type Frame } from "./frames";
import { Local } from "./lib";
import type { JointInfo } from "./sites";

export interface Contact {
  ji: JointInfo;
  id: string;
  a: string;
  b: string;
  /** On the contact point at the family's origin plane: z the stacking normal, x the direction a runs on b. */
  frame: Frame;
  /** Slabs of the two bodies along z (null for the ground or a body that is not stacked). */
  za: [number, number] | null;
  zb: [number, number] | null;
  /** Extent of a's point along x on b over the cycle, and the spread across it. */
  run: [number, number];
  across: number;
  /** Largest distance from the point to the outline of each body. */
  ra: number;
  rb: number;
  /** The contact point, world reference coordinates (on the joint's own plane). */
  at: Vec3;
}

const reach = (ctx: BuildCtx, body: string, p: Vec3): number => {
  const g = ctx.geoms.get(body);
  if (!g) return 0;
  const q = planeCoords(g.frame, p).uv;
  return g.profile.outer.reduce((m, [x, y]) => Math.max(m, Math.hypot(x - q[0], y - q[1])), 0);
};

export function contactOf(ctx: BuildCtx, ji: JointInfo): Contact | null {
  const bodies = [ji.a, ji.b];
  const stacked = bodies.find((b) => ctx.placement.slab.has(b));
  if (!stacked) return null;
  const fam = ctx.placement.families[ctx.placement.slab.get(stacked)![0]]!.frame;
  const P = ji.at;
  const uv = planeCoords(fam, P).uv;
  const origin = fromPlane(fam, uv, 0);
  // the path of a's point in b's reference frame over the cycle
  const path: Vec3[] = ctx.sampled.us.map((_, i) => {
    const Xa = ctx.xfOf(ji.a, i);
    const Xb = ji.b === "ground" ? xf.id() : ctx.xfOf(ji.b, i);
    return xf.apply(xf.inv(Xb), xf.apply(Xa, P));
  });
  let best = 0;
  let dir: Vec3 | null = null;
  for (let i = 0; i < path.length; i += 2)
    for (let j = i + 1; j < path.length; j += 2) {
      const d = v3.dist(path[i]!, path[j]!);
      if (d > best) {
        best = d;
        dir = v3.sub(path[j]!, path[i]!);
      }
    }
  // the direction of the run, kept in the plane; failing that the line from a's centre to the point
  let x: Vec3 = dir && best > 0.5 ? v3.perp(dir, fam.z) : [0, 0, 0];
  if (v3.len(x) < 1e-6) {
    const g = ctx.geoms.get(ji.a) ?? ctx.geoms.get(ji.b);
    x = g ? v3.perp(v3.sub(P, g.frame.o), fam.z) : fam.x;
    if (v3.len(x) < 1e-6) x = fam.x;
  }
  x = v3.unit(x);
  const frame: Frame = { o: origin, x, z: fam.z };
  const loc = path.map((p) => planeCoords(frame, p).uv);
  const xs = loc.map((q) => q[0]);
  const ys = loc.map((q) => q[1]);
  const range = (b: string): [number, number] | null => {
    const e = ctx.extent(b);
    if (!e || !parallel(e.frame.z, fam.z)) return null;
    return [e.w0, e.w1];
  };
  const p0 = planeCoords(frame, P).uv[0];
  return {
    ji,
    id: ji.id,
    a: ji.a,
    b: ji.b,
    frame,
    za: range(ji.a),
    zb: range(ji.b),
    run: [Math.min(...xs) - p0, Math.max(...xs) - p0],
    across: Math.max(...ys) - Math.min(...ys),
    ra: reach(ctx, ji.a, P),
    rb: reach(ctx, ji.b, P),
    at: P,
  };
}

/** A stadium from x0 to x1 along the contact's x, half-width r, as a ring in the contact frame. */
export function stadium(x0: number, x1: number, r: number, y = 0): Vec2[] {
  const pts: Vec2[] = [];
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / n;
    pts.push([x1 + r * Math.cos(t), y + r * Math.sin(t)]);
  }
  for (let i = 0; i <= n; i++) {
    const t = Math.PI / 2 + (Math.PI * i) / n;
    pts.push([x0 + r * Math.cos(t), y + r * Math.sin(t)]);
  }
  return pts;
}

/** Cuts a ring (given in the contact frame, about the contact point) from a body's part as a hole in its profile. */
export function cutRing(ctx: BuildCtx, c: Contact, solidId: string, ring: Vec2[]): void {
  const part = [...ctx.parts.values(), ...ctx.twins.values()].find((p) => p.id === solidId);
  if (!part) return;
  const p0 = planeCoords(c.frame, c.at).uv;
  const pts = ring.map(([u, v]): Vec2 => planeCoords(part.frame, fromPlane(c.frame, [p0[0] + u, p0[1] + v], 0)).uv);
  // a hole winds clockwise
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!;
    const q = pts[(i + 1) % pts.length]!;
    a += p[0] * q[1] - q[0] * p[1];
  }
  part.profile.holes.push(a > 0 ? pts.slice().reverse() : pts);
}

/** A local builder in the contact frame, on the contact point. */
export function localAt(ctx: BuildCtx, c: Contact): Local {
  void ctx;
  const p0 = planeCoords(c.frame, c.at).uv;
  return new Local({ o: fromPlane(c.frame, p0, 0), x: c.frame.x, z: c.frame.z }, { joints: [c.id] });
}

/** The centre of a body's slab along the contact normal, or a fallback. */
export const mid = (z: [number, number] | null, fallback = 0): number => (z ? (z[0] + z[1]) / 2 : fallback);

/** A free spot for a stud of radius r near `want`: the first of a ring of candidates that clears the sweeps. */
export function freeSpot(ctx: BuildCtx, base: Vec2, r: number, tries: Vec2[], z0: number, z1: number, skip?: (s: Solid3) => boolean): Vec2 | null {
  const M = ctx.M;
  for (const p of tries) {
    const q: Vec2 = [base[0] + p[0], base[1] + p[1]];
    const m = M.Manifold.cylinder(z1 - z0, r, r, 16).translate([q[0], q[1], z0]);
    const g = ctx.sweeps.gap(m, undefined, 3);
    m.delete();
    if (g >= 1.5) return q;
    void skip;
  }
  return null;
}

/** Candidate offsets on rings round a point, nearest first. */
export function ringOffsets(r0: number, r1: number, step = 4, n = 16): Vec2[] {
  const out: Vec2[] = [];
  for (let r = r0; r <= r1; r += step) for (let k = 0; k < n; k++) out.push([r * Math.cos((2 * Math.PI * k) / n), r * Math.sin((2 * Math.PI * k) / n)]);
  return out;
}

export { circle };
