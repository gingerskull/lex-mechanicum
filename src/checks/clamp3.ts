// A12 and M6 on 3D solids. A12: a turning stack never touches a ground face, so tightening never squeezes a moving
// part (contact through a bearing's inner race is allowed, and a thrust washer is the designed sliding face, F4). M6:
// the wall round a round hole in a plate, 1.2 mm round a bearing seat and 1.5 mm elsewhere. Build time, Node only.
import type { Vec2 } from "../core/geom";
import { edgeDist } from "../core/poly";
import type { Mat4 } from "../solids/frame";
import { manifold, meshOf } from "../solids/manifold";
import type { Solid3, Vec3 } from "../solids/types";
import { localBox, matClose, obbMeet, obbOf, type Box, type Placer, withScale } from "./clash3";

type Wasm = Awaited<ReturnType<typeof manifold>>;
type Mf = InstanceType<Wasm["Manifold"]>;

/** Designed sliding faces: a thrust washer, a slide's wear strip (F4). */
const SLIDING = new Set(["thrustWasher", "wearStrip", "belt"]);

/** How far a face may lie from another and still touch, mm. */
const TOUCH = 0.05;
/** The shift that turns a face contact into a measurable overlap, mm. */
const PROBE = 0.1;
/** A contact patch smaller than this is an edge, not a face, mm². */
const MIN_PATCH = 0.5;

const axisOf = (m: Mat4, i: number): Vec3 => {
  const l = Math.hypot(m[4 * i]!, m[4 * i + 1]!, m[4 * i + 2]!) || 1;
  return [m[4 * i]! / l, m[4 * i + 1]! / l, m[4 * i + 2]! / l];
};

/** Largest distance of the points from the local z axis of the matrix. */
function radial(pts: Vec3[], m: Mat4): number {
  const z = axisOf(m, 2);
  let worst = 0;
  for (const p of pts) {
    const d: Vec3 = [p[0] - m[12]!, p[1] - m[13]!, p[2] - m[14]!];
    const t = d[0] * z[0] + d[1] * z[1] + d[2] * z[2];
    worst = Math.max(worst, Math.hypot(d[0] - t * z[0], d[1] - t * z[1], d[2] - t * z[2]));
  }
  return worst;
}

/**
 * The face contact of a posed solid with a posed ground solid: they do not interpenetrate (that is A15's finding, and a
 * fit by design is not a face contact), but the first nudged by a probe along its own axis overlaps it by a patch of more
 * than `MIN_PATCH`. Returns the patch's points
 * (for the bearing-race test), or null when they do not touch face to face.
 */
function patchOf(A: Mf, B: Mf, ma: Mat4): Vec3[] | null {
  const now = A.intersect(B);
  const deep = now.volume();
  now.delete();
  if (deep > MIN_PATCH * TOUCH) return null;
  // only faces across the turning part's own axis clamp it: a slide's side against its gib is the designed sliding face
  {
    const u = axisOf(ma, 2);
    for (const sign of [1, -1]) {
      const moved = A.translate([u[0] * sign * PROBE, u[1] * sign * PROBE, u[2] * sign * PROBE]);
      const x = moved.intersect(B);
      const hit = x.volume() > MIN_PATCH * PROBE;
      let pts: Vec3[] | null = null;
      if (hit) {
        const g = x.getMesh();
        pts = [];
        for (let i = 0; i < g.numVert; i++) pts.push([g.vertProperties[i * g.numProp]!, g.vertProperties[i * g.numProp + 1]!, g.vertProperties[i * g.numProp + 2]!]);
      }
      x.delete();
      moved.delete();
      if (pts) return pts;
    }
  }
  return null;
}

/** Phases (radians) that no whole-number speed ratio maps onto the sampled grid's: they only decide what moves. */
const PROBES = [0.7137, 2.0913, 4.3301];

/** A12 over `n` phases: one sentence per pair. */
export async function clampCheck3(solids: Solid3[], placer: Placer, n = 12): Promise<string[]> {
  const M = await manifold();
  const S = solids.filter((s) => !s.flags.faint && s.role !== "trace");
  const phases = Array.from({ length: n }, (_, i) => (i / n) * Math.PI * 2);
  const mats: Mat4[][] = phases.map((u) => S.map((s) => withScale(placer.place(s, u), placer.stretch?.(s, u) ?? 1)));
  // a stretched member (a belt) changes length, not place: it is as fixed as its seat
  const rigid: Mat4[][] = phases.map((u) => S.map((s) => placer.place(s, u)));
  // what moves is read at phases off the sampled grid as well: a part that turns a whole number of times between two
  // sampled phases (a wheel at twice a disc's speed, sampled at 0 and π) stands at the same pose on the grid
  const probes = PROBES.map((u) => S.map((s) => placer.place(s, u)));
  const moving = S.map((_, i) => [...rigid, ...probes].some((row) => !matClose(row[i]!, rigid[0]![i]!)));
  const local: (Box | null)[] = S.map((s) => localBox(M, s));
  const base: (Mf | null | undefined)[] = S.map((_, i) => (local[i] ? undefined : null));
  const baseOf = (i: number): Mf | null => {
    if (base[i] !== undefined) return base[i]!;
    try {
      const m = meshOf(M, S[i]!);
      base[i] = M.Manifold.ofMesh(new M.Mesh({ numProp: 3, vertProperties: m.pos, triVerts: m.tri }));
    } catch {
      base[i] = null;
    }
    return base[i]!;
  };
  const out = new Set<string>();
  for (let p = 0; p < n; p++) {
    const obb = S.map((_, i) => (local[i] ? obbOf(local[i]!, mats[p]![i]!) : null));
    for (let r = 0; r < S.length; r++) {
      const R = S[r]!;
      if (!moving[r] || SLIDING.has(R.kind) || !local[r]) continue;
      for (let g = 0; g < S.length; g++) {
        const G = S[g]!;
        if (moving[g] || SLIDING.has(G.kind) || !local[g]) continue;
        // a face the design slides on (a port face on its standard) is no clamp
        if (R.slides?.includes(G.id) || G.slides?.includes(R.id)) continue;
        const key = `${R.id} (turning) touches the ground face of ${G.id}`;
        if (out.has(key) || !obbMeet(obb[r]!, obb[g]!, -TOUCH)) continue;
        if (!baseOf(r) || !baseOf(g)) continue;
        const A = baseOf(r)!.transform(mats[p]![r]!);
        const B = baseOf(g)!.transform(mats[p]![g]!);
        const patch = patchOf(A, B, mats[p]![r]!);
        A.delete();
        B.delete();
        if (!patch) continue;
        const brg = R.kind === "bearing" ? R : G.kind === "bearing" ? G : null;
        if (brg && brg.d !== undefined && brg.D !== undefined) {
          const inner = (brg.d + (brg.D - brg.d) * 0.36) / 2;
          if (radial(patch, mats[p]![brg === R ? r : g]!) <= inner + TOUCH) continue;
        }
        out.add(key);
      }
    }
  }
  base.forEach((m) => m?.delete());
  return [...out];
}

const yOf = (s: Solid3): Vec3 => {
  const z = s.frame.z;
  const x = s.frame.x;
  return [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
};

/** M6: walls round round holes in plates, 1.2 mm round a bearing seat and 1.5 mm elsewhere. */
export function edgeCheck3(solids: Solid3[]): string[] {
  const out: string[] = [];
  const kinds = new Set(["part", "plate", "bracket", "bridge", "housing"]);
  for (const t of solids) {
    if (!kinds.has(t.kind)) continue;
    const y = yOf(t);
    for (const h of t.profile.holes) {
      const xs = h.map((p) => p[0]);
      const ys = h.map((p) => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const r = (x1 - x0) / 2;
      if (Math.abs((y1 - y0) / 2 - r) > 0.05) continue;
      const c: Vec2 = [(x0 + x1) / 2, (y0 + y1) / 2];
      // round holes only: a window with a square bounding box is not one
      if (h.some((p) => Math.abs(Math.hypot(p[0] - c[0], p[1] - c[1]) - r) > 0.1)) continue;
      const wall = edgeDist(t.profile.outer, c) - r;
      // a bearing on the same body whose axis passes through the hole's centre seats in it
      const cw: Vec3 = [t.frame.o[0] + t.frame.x[0] * c[0] + y[0] * c[1], t.frame.o[1] + t.frame.x[1] * c[0] + y[1] * c[1], t.frame.o[2] + t.frame.x[2] * c[0] + y[2] * c[1]];
      const seat = solids.some((b) => {
        if (b.kind !== "bearing" || b.body !== t.body) return false;
        const d: Vec3 = [b.frame.o[0] - cw[0], b.frame.o[1] - cw[1], b.frame.o[2] - cw[2]];
        const along = d[0] * b.frame.z[0] + d[1] * b.frame.z[1] + d[2] * b.frame.z[2];
        return Math.hypot(d[0] - along * b.frame.z[0], d[1] - along * b.frame.z[1], d[2] - along * b.frame.z[2]) < 0.1;
      });
      const min = seat ? 1.2 : 1.5;
      if (wall < min - 0.05) out.push(`${t.id}: wall ${wall.toFixed(2)} mm round the Ø${(2 * r).toFixed(1)} hole at (${c[0].toFixed(1)}, ${c[1].toFixed(1)}), needs ${min}`);
    }
  }
  return out;
}
