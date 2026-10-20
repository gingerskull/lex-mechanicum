// The support router (A19, T11): posts, bridges and pillow blocks are placed against the real swept volumes (a Manifold
// hull of each moving body's sampled poses, then the least gap), outside every moving part's sweep with the margin of A14,
// and, among the places that clear, where they cover the least of the principle parts in the default view (T10, T11). A
// support is never removed (T12): what the router cannot move off a principle part is recorded as covering it, and the
// see-through stage draws it so.
import { TAU, circle, type Vec2 } from "../core/geom";
import { H } from "../hardware/primitives";
import { STANDOFF } from "../hardware/tables";
import type { Solid3 } from "../solids/types";
import { type Vec3 } from "../kin/math";
import type { BuildCtx } from "./ctx";
import { MIN_GAP } from "./constants";
import { place, type Frame } from "./frames";
import { pointDist } from "./planar";
import { worldManifold } from "./sweeps";
import { projectAlong } from "./view";

type Wasm = BuildCtx["M"];
type Mf = InstanceType<Wasm["Manifold"]>;

const STATIC_KINDS = new Set(["standoff", "bridge", "housing", "bracket", "plate", "foot", "stop", "bumper"]);

/** Whether a solid is fixed hardware a new support must keep clear of. */
const isStatic = (s: Solid3): boolean => s.body === "ground" && STATIC_KINDS.has(s.kind) && !s.flags.isBase;

/**
 * Least gap from the given solids to every moving part's swept volume, and to the fixed supports built so far
 * (`skip` names solids that touch by design), mm; `search` caps the distance looked for.
 */
export function clearance(ctx: BuildCtx, solids: readonly Solid3[], skip: (s: Solid3) => boolean = () => false, search = MIN_GAP + 2): number {
  let g = search;
  for (const s of solids) {
    const m = worldManifold(ctx.M, s);
    g = Math.min(g, ctx.sweeps.gap(m, undefined, search));
    if (g > 0)
      for (const q of ctx.solids) {
        if (!isStatic(q) || skip(q)) continue;
        g = Math.min(g, m.minGap(ctx.sweeps.staticOf(q), search));
        if (g <= 0) break;
      }
    m.delete();
    if (g <= 0) return 0;
  }
  return g;
}

export interface BridgeRoute {
  posts: [Vec2, Vec2];
  /** World z of the underside and the top of the beam. */
  bottom: number;
  top: number;
  footprint: Vec2[];
  /** Principle bodies the beam covers in the default view. */
  covers: string[];
  /** The first-choice pair (nearest, ignoring the sweeps and the view) was not taken. */
  moved: boolean;
  tried: number;
  gap: number;
}

const BEAM_T = 6;
const POST_R = STANDOFF.D / 2;

function hullPoly(cs: [number, number, number][]): Vec2[] {
  return H.hullOf(cs);
}

const prism = (M: Wasm, poly: readonly Vec2[], z0: number, z1: number): Mf => {
  const cs = new M.CrossSection([poly.map((p): Vec2 => [p[0], p[1]])], "NonZero");
  const m = M.Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
  cs.delete();
  return m;
};

/**
 * Routes a bridge over the pivot `over`: two posts on the base outside every sweep, a beam above everything that passes
 * under its footprint. Returns null only when no post pair exists within the search radius.
 */
export function routeBridge(ctx: BuildCtx, o: { id: string; over: Vec2; rB: number; minBottom: number; baseTop: number }): BridgeRoute | null {
  const M = ctx.M;
  const zAll = ctx.sweeps.bounds()?.[5] ?? o.minBottom;
  const zTall = Math.max(zAll, o.minBottom) + 4;
  // candidate post centres, nearest first
  const cands: { p: Vec2; r: number; a: number; ok?: boolean }[] = [];
  for (let r = 22; r <= 190; r += 4)
    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * TAU;
      cands.push({ p: [o.over[0] + r * Math.cos(a), o.over[1] + r * Math.sin(a)], r, a });
    }
  // a post stands from the base above every sweep, so it is judged in plan against the outline of all of them (A14)
  const swept = ctx.sweeps.planPolys();
  const fixed = ctx.solids.filter(isStatic).map((q) => ctx.sweeps.staticPolys(q));
  const dist = (polys: Vec2[][], p: Vec2): number => polys.reduce((m, r) => Math.min(m, pointDist(r, p[0], p[1])), Infinity);
  const valid = (c: (typeof cands)[0]): boolean => {
    if (c.ok !== undefined) return c.ok;
    c.ok = dist(swept, c.p) >= POST_R + MIN_GAP && fixed.every((f) => dist(f, c.p) >= POST_R + 1);
    return c.ok;
  };
  const sepDeg = (A: (typeof cands)[0], B: (typeof cands)[0]) => Math.abs(Math.atan2(Math.sin(A.a - B.a), Math.cos(A.a - B.a))) * (180 / Math.PI);
  // pairs of valid candidates by cost, the nearest few kept for the full evaluation
  const best: { A: (typeof cands)[0]; B: (typeof cands)[0]; cost: number }[] = [];
  let tried = 0;
  const KEEP = 10;
  let worst = Infinity;
  for (let i = 0; i < cands.length && 2 * cands[i]!.r < worst; i++) {
    const A = cands[i]!;
    if (!valid(A)) continue;
    for (let j = i + 1; j < cands.length && A.r + cands[j]!.r < worst; j++) {
      const B = cands[j]!;
      const sep = sepDeg(A, B);
      if (sep < 50 || sep > 165 || Math.hypot(A.p[0] - B.p[0], A.p[1] - B.p[1]) < 20) continue;
      const cost = A.r + B.r + 0.3 * Math.abs(sep - 100);
      if (best.length >= KEEP && cost >= worst) continue;
      if (!valid(B)) continue;
      tried++;
      best.push({ A, B, cost });
      best.sort((x, y) => x.cost - y.cost);
      if (best.length > KEEP) best.pop();
      if (best.length >= KEEP) worst = best[best.length - 1]!.cost;
    }
  }
  if (!best.length) return null;
  // the full evaluation: the beam over each pair, its underside above what passes under it, and what it covers
  const viewDir = ctx.viewDir();
  const principle = [...ctx.principle].map((b) => ({ b, proj: ctx.sweeps.of(b)?.project(viewDir) ?? null }));
  interface Eval {
    pair: (typeof best)[0];
    bottom: number;
    footprint: Vec2[];
    area: number;
    covers: string[];
  }
  const evals: Eval[] = [];
  for (const pair of best) {
    const footprint = hullPoly([[o.over[0], o.over[1], o.rB], [pair.A.p[0], pair.A.p[1], POST_R + 1.5], [pair.B.p[0], pair.B.p[1], POST_R + 1.5]]);
    // what the beam covers is read at its lowest height; the underside is worked out for the pair taken
    const beam = prism(M, footprint, o.minBottom, o.minBottom + BEAM_T);
    const fp = projectAlong(beam, viewDir);
    let area = 0;
    const covers: string[] = [];
    for (const p of principle) {
      if (!p.proj) continue;
      const x = fp.intersect(p.proj);
      const a = x.area();
      x.delete();
      if (a > 0.5) {
        area += a;
        covers.push(p.b);
      }
    }
    fp.delete();
    beam.delete();
    evals.push({ pair, bottom: o.minBottom, footprint, area, covers });
  }
  principle.forEach((p) => p.proj?.delete());
  // outside the principle's footprint first, then the shortest
  evals.sort((a, b) => (a.covers.length ? 1 : 0) - (b.covers.length ? 1 : 0) || a.area - b.area || a.pair.cost - b.pair.cost);
  const pick = evals[0]!;
  {
    // the underside above everything that passes under the footprint, moving or fixed
    const tall = prism(M, pick.footprint, o.baseTop, zTall + 30);
    let bottom = o.minBottom;
    for (const b of ctx.sweeps.moving()) {
      const t = ctx.sweeps.of(b)?.topWithin(tall);
      if (t !== null && t !== undefined) bottom = Math.max(bottom, t + MIN_GAP);
    }
    for (const q of ctx.solids) {
      if (!isStatic(q)) continue;
      const inter = ctx.sweeps.staticOf(q).intersect(tall);
      if (!inter.isEmpty()) bottom = Math.max(bottom, (inter.boundingBox().max as number[])[2]! + 1);
      inter.delete();
    }
    tall.delete();
    pick.bottom = Math.ceil(bottom * 2) / 2;
  }
  const first = best[0]!;
  const cover = [...ctx.principle].length ? pick.covers : [];
  return {
    posts: [pick.pair.A.p, pick.pair.B.p],
    bottom: pick.bottom,
    top: pick.bottom + BEAM_T,
    footprint: pick.footprint,
    covers: cover,
    moved: pick.pair !== first,
    tried,
    gap: MIN_GAP,
  };
}

/** The solids of a routed bridge: beam on two spigoted posts, M5 button heads from both sides (F1, A11). */
export function bridgeSolids(ctx: BuildCtx, o: { id: string; over: Vec2; route: BridgeRoute; hole: number; baseTop: number; baseBottom: number; joints: string[]; boreSolid?: string }): Solid3[] {
  const { route: r } = o;
  const up: Frame = { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] };
  const [P0, P1] = r.posts;
  const u: Vec2 = [(P1[0] - P0[0]) / 40, (P1[1] - P0[1]) / 40];
  const holes: Vec2[][] = [
    circle(o.hole, o.over[0], o.over[1], 32).reverse(),
    circle(STANDOFF.spigotD / 2, P0[0], P0[1], 28).reverse(),
    // the second post's spigot sits in a slot toward the first, so the bridge goes back square after a rebuild
    slotRing([P1[0] - u[0], P1[1] - u[1]], [P1[0] + u[0], P1[1] + u[1]], STANDOFF.spigotD / 2),
  ];
  const beam = place(up, H.plate(o.id, r.footprint, {
    name: "Bridge over the pivot, on two spigoted posts",
    kind: "bridge",
    z0: r.bottom,
    z1: r.top,
    holes,
    joints: [...o.joints, `${o.id}-post`],
    why: "holds the axle's top end so it works in double shear (A9, A11)",
  }));
  const out: Solid3[] = [...beam];
  [P0, P1].forEach((p, k) => {
    const j = [`${o.id}-post`];
    const at: [number, number, number] = [p[0], p[1], 0];
    const nm = k ? "" : `Standoff Ø${STANDOFF.D} x ${+(r.bottom - o.baseTop).toFixed(1)}, M${STANDOFF.M}, Ø${STANDOFF.spigotD} h7 spigot`;
    out.push(...place(up, H.standoff(`${o.id}-post${k}`, { ...(k ? { name: "" } : { name: nm }), qty: k ? 0 : 2, at, z0: o.baseTop, z1: r.bottom, joints: j })));
    out.push(...place(up, H.spigot(`${o.id}-post${k}-spigot`, { at, z0: r.bottom, z1: r.bottom + 3, joints: j, allow: [o.id] })));
    out.push(...place(up, H.screw(`${o.id}-post${k}-top`, "button", STANDOFF.M, BEAM_T + 1.5 * STANDOFF.M, { at, face: r.top, dir: -1, joints: j, ...(k ? { name: "" } : {}) })));
    out.push(...place(up, H.screw(`${o.id}-post${k}-bot`, "button", STANDOFF.M, o.baseTop - o.baseBottom + 1.5 * STANDOFF.M, { at, face: o.baseBottom, dir: 1, joints: j, ...(k ? { name: "" } : {}) })));
  });
  return out;
}

function slotRing(a: Vec2, b: Vec2, r: number): Vec2[] {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const pts: Vec2[] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = ang - Math.PI / 2 + (Math.PI * i) / n;
    pts.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]);
  }
  for (let i = 0; i <= n; i++) {
    const t = ang + Math.PI / 2 + (Math.PI * i) / n;
    pts.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]);
  }
  return pts.reverse();
}

// ---- pillow blocks

export interface PillowRoute {
  /** Axial coordinates of the two blocks' centres. */
  w: [number, number];
  width: number;
  moved: boolean;
  tried: number;
  covers: string[];
  gap: number;
}

export function unitAlong(f: Frame, w: number): Vec3 {
  return [f.o[0] + f.z[0] * w, f.o[1] + f.z[1] * w, f.o[2] + f.z[2] * w];
}

/** A frame standing on the base under the axis point P: x along the axis' horizontal run, z up. */
export function standFrame(P: Vec3, axis: Vec3, z: number): Frame {
  const h: Vec3 = [axis[0], axis[1], 0];
  const l = Math.hypot(h[0], h[1]);
  const x: Vec3 = l > 1e-6 ? [h[0] / l, h[1] / l, 0] : [1, 0, 0];
  return { o: [P[0], P[1], z], x, z: [0, 0, 1] };
}

