// The cycle sampled once for the whole build: every body's transform at evenly spaced phases (K2: the cycle repeats). A
// part that moves fast between two phases (a follower flung round by a double crank) would pass a pin between samples
// unseen, so the sampling is doubled until no point of any part moves more than `STEP` mm from one sample to the next.
import { Kinematics } from "../kin/compose";
import type { Controls, Kin } from "../kin/types";
import { v3, xf, type Vec3, type Xf } from "../kin/math";
import type { Sampled } from "./placer";
import type { BodyGeom } from "./shapes";
import { fromPlane } from "./frames";

const STEP = 6;
const MAX = 360;

function once(K: Kinematics, kin: Kin, n: number, controls?: Controls): Sampled {
  const us: number[] = [];
  const xfs = new Map<string, Xf[]>(kin.bodies.map((b) => [b.id, []]));
  for (let i = 0; i < n; i++) {
    const u = (i / n) * 2 * Math.PI;
    us.push(u);
    const p = K.pose(u, controls);
    for (const b of kin.bodies) xfs.get(b.id)!.push(p.bodies.get(b.id) ?? xf.id());
  }
  return { us, xfs };
}

/** Largest distance any probe point of any body moves between neighbouring samples. */
function worstStep(s: Sampled, probes: Map<string, Vec3[]>): number {
  let worst = 0;
  for (const [id, pts] of probes) {
    const xs = s.xfs.get(id);
    if (!xs) continue;
    for (let i = 0; i < xs.length; i++) {
      const A = xs[i]!;
      const B = xs[(i + 1) % xs.length]!;
      for (const p of pts) worst = Math.max(worst, v3.dist(xf.apply(A, p), xf.apply(B, p)));
    }
  }
  return worst;
}

export function sampleBodies(K: Kinematics, kin: Kin, n: number, controls?: Controls, geoms?: Map<string, BodyGeom>): Sampled {
  let s = once(K, kin, n, controls);
  if (!geoms) return s;
  // the far points of each outline stand for the part
  const probes = new Map<string, Vec3[]>();
  for (const [id, g] of geoms) {
    // a body of revolution turning on its own axis (a screw) moves no point of its outline off where it was
    if (g.axisym) continue;
    const world = g.profile.outer.map((q) => fromPlane(g.frame, q, 0));
    const c = world.reduce((a, p) => v3.add(a, p), [0, 0, 0] as Vec3);
    const cen = v3.mul(c, 1 / world.length);
    probes.set(id, [...world].sort((a, b) => v3.dist(b, cen) - v3.dist(a, cen)).slice(0, 4));
  }
  while (n < MAX && worstStep(s, probes) > STEP) {
    n = Math.min(MAX, n * 2);
    s = once(K, kin, n, controls);
  }
  return s;
}
