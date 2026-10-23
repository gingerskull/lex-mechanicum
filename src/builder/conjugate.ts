// Non-circular gears (J6, D1): a pitch curve of its own (an ellipse about a focus) carries teeth spaced equally along
// it, and the gear it drives is cut as the envelope of the first one's teeth over the cycle, so the pair is conjugate
// by construction however far the pitch normal leans from the radius (rack teeth set on the normal of both would jam).
import type { Vec2 } from "../core/geom";
import { D2R } from "../core/geom";
import type { Kinematics } from "../kin/compose";
import { xf } from "../kin/math";
import type { Controls, Kin } from "../kin/types";
import type { Wasm } from "./ctx";
import { fromPlane, planeCoords } from "./frames";
import { sampleBodies } from "./sample";
import { unionTree } from "./view";
import type { BodyGeom } from "./shapes";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** A pitch curve given by `shape.pitch`: an ellipse { a, e, perihelion (deg in the body's frame) } about a focus. */
export interface PitchCurve {
  a: number;
  e: number;
  /** Direction of the nearest point to the focus, radians in the body's frame. */
  peri: number;
}

export const pitchOf = (shape: Record<string, unknown>): PitchCurve | null => {
  const p = shape.pitch as Record<string, unknown> | undefined;
  if (!p || p.curve !== "ellipse") return null;
  return { a: num(p.a, 40), e: num(p.e, 0.3), peri: num(p.perihelion, 0) * D2R };
};

/** Radius of an ellipse about its focus at angle th (radians, the body's frame). */
const rOf = (c: PitchCurve, th: number): number => (c.a * (1 - c.e * c.e)) / (1 + c.e * Math.cos(th - c.peri));

/** The pitch curve offset outward by d along its normal, n points. */
export function pitchRing(c: PitchCurve, d: number, n = 360): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const th = (i * 2 * Math.PI) / n;
    const r = rOf(c, th);
    const p: Vec2 = [r * Math.cos(th), r * Math.sin(th)];
    const h = 1e-4;
    const r2 = rOf(c, th + h);
    const t: Vec2 = [r2 * Math.cos(th + h) - p[0], r2 * Math.sin(th + h) - p[1]];
    const L = Math.hypot(t[0], t[1]);
    pts.push([p[0] + (d * t[1]) / L, p[1] - (d * t[0]) / L]);
  }
  return pts;
}

/**
 * Teeth set on the pitch curve's normal, z of them spaced equally by arc length (module = perimeter / π z), 20° flanks,
 * addendum one module and dedendum 1.25; a tooth centred where the curve starts its arc (the perihelion).
 */
export function noncircularOutline(c: PitchCurve, z: number, n = 24 * z): { outer: Vec2[]; module: number } {
  // the curve by its arc length, from the perihelion
  const N = 4000;
  const P: Vec2[] = [];
  const s: number[] = [0];
  for (let i = 0; i <= N; i++) {
    const th = c.peri + (i * 2 * Math.PI) / N;
    const r = rOf(c, th);
    P.push([r * Math.cos(th), r * Math.sin(th)]);
    if (i) s.push(s[i - 1]! + Math.hypot(P[i]![0] - P[i - 1]![0], P[i]![1] - P[i - 1]![1]));
  }
  const L = s[N]!;
  const p = L / z;
  const m = p / Math.PI;
  const tan = Math.tan(20 * D2R);
  const out: Vec2[] = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const si = (i * L) / n;
    while (k < N - 1 && s[k + 1]! < si) k++;
    const f = (si - s[k]!) / (s[k + 1]! - s[k]! || 1);
    const q: Vec2 = [P[k]![0] + f * (P[k + 1]![0] - P[k]![0]), P[k]![1] + f * (P[k + 1]![1] - P[k]![1])];
    const t: Vec2 = [P[k + 1]![0] - P[k]![0], P[k + 1]![1] - P[k]![1]];
    const tl = Math.hypot(t[0], t[1]) || 1;
    const x = si - p * Math.round(si / p);
    const h = Math.max(-1.25 * m, Math.min(m, (p / 4 - Math.abs(x)) / tan));
    void x;
    out.push([q[0] + (h * t[1]) / tl, q[1] - (h * t[0]) / tl]);
  }
  return { outer: out, module: m };
}

/**
 * The driven gear of each non-circular mesh (`ncg` joint) cut as the envelope of the driver's teeth: its blank (the pitch
 * curve plus an addendum) less the driver's outline, grown by the running clearance, at every sample of the cycle.
 */
export function cutConjugates(M: Wasm, K: Kinematics, kin: Kin, geoms: Map<string, BodyGeom>, controls?: Controls): void {
  for (const j of kin.joints) {
    if (j.type !== "gear-mesh" || !j.ncg) continue;
    const A = geoms.get(j.a);
    const B = geoms.get(j.b);
    const cb = B ? pitchOf(B.shape) : null;
    if (!A || !B || !cb) continue;
    const s = sampleBodies(K, kin, 720, controls);
    const xa = s.xfs.get(j.a)!;
    const xb = s.xfs.get(j.b)!;
    const m = num(B.shape.module, 3);
    const grown = new M.CrossSection([A.profile.outer], "NonZero").offset(0.15, "Round");
    const rings = grown.toPolygons() as Vec2[][];
    grown.delete();
    const cuts = xa.map((Xa, i) => {
      const rel = xf.mul(xf.inv(xb[i]!), Xa);
      return new M.CrossSection(rings.map((r) => r.map((q): Vec2 => planeCoords(B.frame, xf.apply(rel, fromPlane(A.frame, q, 0))).uv)), "NonZero");
    });
    const env = unionTree(M, cuts);
    cuts.forEach((c) => c.delete());
    const blank = new M.CrossSection([pitchRing(cb, m)], "NonZero");
    const cut = blank.subtract(env);
    const polys = cut.toPolygons() as Vec2[][];
    blank.delete();
    env.delete();
    cut.delete();
    // the largest ring is the outline
    const area = (r: Vec2[]) => r.reduce((a, p, i) => a + p[0] * r[(i + 1) % r.length]![1] - r[(i + 1) % r.length]![0] * p[1], 0) / 2;
    const outer = polys.sort((p, q) => Math.abs(area(q)) - Math.abs(area(p)))[0];
    if (outer) B.profile = { outer: area(outer) < 0 ? outer.slice().reverse() : outer, holes: B.profile.holes };
  }
}
