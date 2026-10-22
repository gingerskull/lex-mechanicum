// A thread, a ball groove's land or a spring wire as a sweep along a helix (standard D8: "sweep: a helix, a thread"). The
// sweep's frames are rotation minimising, which drift about a helix's tangent at a constant rate (its torsion); the
// sweep's `twist`, linear in arc length like the drift, takes it out, so the profile's u stays on the radius all along
// and an axial section through the thread shows its true profile at every turn.
import { segmentsFor, pathFrames } from "./tessellate";
import type { Op, Profile, Vec3 } from "./types";

export interface HelixSpec {
  /** Radius of the path (the profile's u = 0), mm. */
  r: number;
  /** Axial advance per turn, mm. */
  lead: number;
  /** Axial range of the path, local z. */
  z0: number;
  z1: number;
  hand?: "right" | "left";
  /** Angle of the path at z0, radians, about local z from local x. */
  phase?: number;
  /** Facets per turn (default from the radius, as a revolve). */
  segments?: number;
}

type Sweep = Extract<Op, { op: "sweep" }>;

/** The helix path about local z. */
export function helixPath(h: HelixSpec): Vec3[] {
  const turns = (h.z1 - h.z0) / h.lead;
  const per = h.segments ?? segmentsFor(h.r + 1);
  const n = Math.max(2, Math.ceil(Math.abs(turns) * per));
  const s = h.hand === "left" ? -1 : 1;
  const ph = h.phase ?? 0;
  const path: Vec3[] = [];
  for (let k = 0; k <= n; k++) {
    const a = ph + s * (k / n) * turns * 2 * Math.PI;
    path.push([h.r * Math.cos(a), h.r * Math.sin(a), h.z0 + (k / n) * (h.z1 - h.z0)]);
  }
  return path;
}

/**
 * A helical sweep about local z: `pts` is the profile in the axial plane, (u, v) with u outward along the radius from
 * the path radius `r` and v along +z. The profile is laid in the sweep's first frame so u runs outward along the radius,
 * and the op's twist keeps it there to the end.
 */
export function helixSweep(h: HelixSpec, pts: [number, number][]): { profile: Profile; op: Sweep } {
  const path = helixPath(h);
  const F = pathFrames(path, false);
  // the inward radius's angle in each frame's (x, y)
  const inwardAt = (k: number): number => {
    const p = path[k]!;
    const f = F[k]!;
    const l = Math.hypot(p[0], p[1]);
    const ix = -(p[0] * f.x[0] + p[1] * f.x[1]) / l;
    const iy = -(p[0] * f.y[0] + p[1] * f.y[1]) / l;
    return Math.atan2(iy, ix);
  };
  const a0 = inwardAt(0);
  let drift = 0;
  let prev = a0;
  for (let k = 1; k < path.length; k++) {
    const a = inwardAt(k);
    let d = a - prev;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    drift += d;
    prev = a;
  }
  // in the first frame: outward is opposite the inward radius; the axis is the perpendicular whose world z is positive
  const out: [number, number] = [-Math.cos(a0), -Math.sin(a0)];
  const f0 = F[0]!;
  const cand: [number, number] = [-out[1], out[0]];
  const ax: [number, number] = cand[0] * f0.x[2] + cand[1] * f0.y[2] >= 0 ? cand : [-cand[0], -cand[1]];
  const outer = pts.map(([u, v]): [number, number] => [u * out[0] + v * ax[0], u * out[1] + v * ax[1]]);
  let area = 0;
  for (let i = 0; i < outer.length; i++) {
    const a = outer[i]!;
    const b = outer[(i + 1) % outer.length]!;
    area += a[0] * b[1] - b[0] * a[1];
  }
  if (area < 0) outer.reverse();
  return { profile: { outer, holes: [] }, op: { op: "sweep", path, twist: (drift * 180) / Math.PI } };
}
