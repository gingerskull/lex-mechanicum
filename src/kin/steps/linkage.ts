// Planar linkage blocks: the RRR and slider dyads, the class-III triad, the five-bar (both ways), and the points a
// linkage closes on: a point along a line, two lines' crossing, a target path from the cycle phase.
import { type BlockFn, KinError } from "../ctx";
import { R2D, TAU, type Vec3, v3, xf } from "../math";
import { dyadRPR, dyadRRP, dyadRRR, fiveBarFK, fiveBarIK } from "../blocks/linkage";
import { outName, outPoint, outVal, spin, str } from "./shared";

/**
 * dyad (RRR). in: a, b (points), ra, rb (lengths: the link from a, the link from b), n (plane normal, default +z),
 * body (optional: the link from a, posed here by its turn about a, so a later block can read its other points).
 * out: the point closing both links. branch picks the side (+1: left of a→b seen from +n).
 */
const dyad: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const n: Vec3 = i.n ? c.vec(i.n) : [0, 0, 1];
  const a = c.vec(i.a);
  const sol = dyadRRR(a, c.vec(i.b), c.num(i.ra), c.num(i.rb), n);
  const k = c.root(sol.roots, sol.h);
  outPoint(c, s, sol.roots[k]);
  if (typeof i.body === "string") {
    const a0 = c.refVec(i.a);
    const p0 = c.refPt(outName(s) ?? "");
    const nn = v3.unit(n);
    const ang = (d: Vec3) => Math.atan2(v3.dot(nn, v3.cross([1, 0, 0], d)), v3.dot([1, 0, 0], d));
    const dAng = ang(v3.sub(sol.roots[k], a)) - ang(v3.sub(p0, a0));
    c.setXf(i.body, xf.mul(xf.trans(v3.sub(a, a0)), xf.rotAbout(a0, nn, dAng)));
  }
};

/**
 * slider-dyad. in.kind "rrp": a (pivot), r (link length), p, d (a point and direction of the slide). out: the point;
 * out.s: the slide coordinate. branch: +1 far along d, −1 near.
 * in.kind "rpr": a (slot link pivot), p (the pin's point), body (the slotted link, optional), n. out.angle, out.dist (deg, mm).
 * in.kind "rpp": a (the pin), p, d (a point and direction of the slide; the slot is square to it). out: the slotted
 * body's point on the slide; out.s: the slide coordinate.
 */
const sliderDyad: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const kind = (i.kind as string | undefined) ?? "rrp";
  if (kind === "rrp") {
    const sol = dyadRRP(c.vec(i.a), c.num(i.r), c.vec(i.p), c.vec(i.d));
    const k = c.root(sol.points, sol.h);
    outPoint(c, s, sol.points[k], typeof s.out === "string" ? "" : "p");
    outVal(c, s, sol.s[k], "s");
    // the slide's body, posed by its travel, so a later block can read its other points (a crosshead's arm)
    const on = outName(s, typeof s.out === "string" ? "" : "p");
    if (typeof i.body === "string" && on) c.setXf(i.body, xf.trans(v3.sub(sol.points[k], c.refPt(on))));
    return;
  }
  if (kind === "rpp") {
    // a pin in a straight slot square to the slide (Scotch yoke): the slotted body's point on the slide is the pin's
    // projection on it, x = r cos θ exactly
    const p0 = c.vec(i.p);
    const d = v3.unit(c.vec(i.d));
    const t = v3.dot(v3.sub(c.vec(i.a), p0), d);
    outPoint(c, s, v3.add(p0, v3.mul(d, t)), typeof s.out === "string" ? "" : "p");
    outVal(c, s, t, "s");
    return;
  }
  if (kind === "rpr") {
    const a = c.vec(i.a);
    const n = i.n ? c.vec(i.n) : ([0, 0, 1] as Vec3);
    const r = dyadRPR(a, c.vec(i.p), n);
    const r0 = dyadRPR(c.refVec(i.a), c.refVec(i.p), n);
    outVal(c, s, r.angle * R2D, "angle");
    outVal(c, s, r.dist, "dist");
    if (typeof i.body === "string") {
      const dAng = Math.atan2(Math.sin(r.angle - r0.angle), Math.cos(r.angle - r0.angle));
      c.setXf(i.body, xf.mul(xf.trans(v3.sub(a, c.refVec(i.a))), xf.rotAbout(c.refVec(i.a), n, dAng)));
    }
    return;
  }
  throw new KinError(`slider-dyad kind ${kind}`);
};

/**
 * triad (an Assur group of class III: a ternary lever on three binary links). in: a (a point), ra (the link from a to
 * the lever's first pin p1; default its reference length), lever (body), p1, p2, p3 (the lever's three pins, joint
 * names), slide (a prismatic joint to the ground that the second pin runs along), c (a point), rc (the link from the
 * third pin to c; default its reference length), n (plane normal). For a trial turn of the lever the first link and the
 * slide close in closed form (a circle and a line, on the reference's side); the turn that closes the third link is
 * found by a scan and bisection, the root nearest the reference turn taken. out { p1, p2, p3 }; the lever is posed. A
 * Walschaerts radius rod, combination lever, union link and valve spindle.
 */
const triad: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const nz = v3.unit(i.n ? c.vec(i.n) : [0, 0, 1]);
  const A = c.vec(i.a);
  const A0 = c.refVec(i.a);
  const C = c.vec(i.c);
  const P1 = c.jointAt(str(i.p1, "triad.p1"));
  const P2 = c.jointAt(str(i.p2, "triad.p2"));
  const P3 = c.jointAt(str(i.p3, "triad.p3"));
  // the links' lengths as the joints give them, unless the record names them
  const ra = i.ra !== undefined ? c.num(i.ra) : v3.dist(A0, P1);
  const rc = i.rc !== undefined ? c.num(i.rc) : v3.dist(P3, c.refVec(i.c));
  const sl = str(i.slide, "triad.slide");
  const L0 = c.jointAt(sl);
  const d = v3.unit(c.jointAxis(sl));
  const nn = v3.unit(v3.cross(nz, d));
  const v2 = v3.sub(P2, P1);
  const v3_ = v3.sub(P3, P1);
  const rot = (u: Vec3, a: number): Vec3 => xf.dir(xf.rotAbout([0, 0, 0], nz, a), u);
  // the first pin on the circle about a and on the line its second pin's slide puts it on, the reference's side
  const foot = (a: Vec3, k: number) => v3.add(a, v3.mul(nn, k - v3.dot(nn, a)));
  const k0 = v3.dot(nn, L0) - v3.dot(nn, v2);
  const side = Math.sign(v3.dot(d, v3.sub(P1, foot(A0, k0)))) || 1;
  const first = (dl: number): Vec3 | null => {
    const k = v3.dot(nn, L0) - v3.dot(nn, rot(v2, dl));
    const F = foot(A, k);
    const t = v3.dist(F, A);
    if (t > ra) return null;
    return v3.add(F, v3.mul(d, side * Math.sqrt(ra * ra - t * t)));
  };
  const g = (dl: number): number | null => {
    const X = first(dl);
    return X ? v3.dist(v3.add(X, rot(v3_, dl)), C) - rc : null;
  };
  // the closing turn nearest the reference: scan outward from 0, then bisect
  const step = Math.PI / 180;
  let root: number | null = null;
  for (let k = 0; k < 180 && root === null; k++)
    for (const sg of [1, -1]) {
      const x0 = sg * k * step;
      const x1 = sg * (k + 1) * step;
      const g0 = g(x0);
      const g1 = g(x1);
      if (g0 === null || g1 === null || Math.sign(g0) === Math.sign(g1)) continue;
      let lo = x0;
      let hi = x1;
      let glo = g0;
      for (let it = 0; it < 80; it++) {
        const m = (lo + hi) / 2;
        const gm = g(m)!;
        if (Math.sign(gm) === Math.sign(glo)) {
          lo = m;
          glo = gm;
        } else hi = m;
      }
      root = (lo + hi) / 2;
      break;
    }
  if (root === null) throw new KinError(`triad ${s.id}: the links cannot close`);
  const X = first(root)!;
  const out = (s.out ?? {}) as Record<string, string>;
  if (out.p1) c.setPt(out.p1, X);
  if (out.p2) c.setPt(out.p2, v3.add(X, rot(v2, root)));
  if (out.p3) c.setPt(out.p3, v3.add(X, rot(v3_, root)));
  if (typeof i.lever === "string") c.setXf(i.lever, xf.mul(xf.trans(v3.sub(X, P1)), xf.rotAbout(P1, nz, root)));
};

/**
 * five-bar. in: A1, A2 (base points), l1 l2 (cranks), l3 l4 (distal links), n.
 * mode "fk" (default): th1, th2 (crank angles, deg), out {P, E1, E2}; branch picks the side of the distal dyad.
 * mode "ik": target (a point), elbow1, elbow2 (+1/−1), cranks [body, body], joints [j1, j2]; out {th1, th2, E1, E2}.
 */
const fiveBar: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const g = { A1: c.vec(i.A1), A2: c.vec(i.A2), l1: c.num(i.l1), l2: c.num(i.l2), l3: c.num(i.l3), l4: c.num(i.l4), n: i.n ? c.vec(i.n) : undefined };
  if ((i.mode as string | undefined) === "ik") {
    const r = fiveBarIK(g, c.vec(i.target), (c.num(i.elbow1 ?? 1) >= 0 ? 1 : -1), (c.num(i.elbow2 ?? 1) >= 0 ? 1 : -1));
    if (!r) throw new KinError(`five-bar ${s.id}: target out of reach`);
    outVal(c, s, r.th1 * R2D, "th1");
    outVal(c, s, r.th2 * R2D, "th2");
    outPoint(c, s, r.E1, "E1");
    outPoint(c, s, r.E2, "E2");
    const cranks = (i.cranks as string[] | undefined) ?? [];
    const joints = (i.joints as string[] | undefined) ?? [];
    [r.th1, r.th2].forEach((th, k) => {
      const body = cranks[k];
      const j = joints[k];
      if (body && j) spin(c, body, c.jointAt(j), c.jointAxis(j), c.delta(`th${k}`, th));
    });
    return;
  }
  const th1 = c.rad(i.th1);
  const th2 = c.rad(i.th2);
  const base = fiveBarFK(g, th1, th2, 1);
  const alt = fiveBarFK(g, th1, th2, -1);
  const k = c.root([[...base.P], [...alt.P]], base.h);
  const sol = k === 0 ? base : alt;
  outPoint(c, s, sol.P, "P");
  outPoint(c, s, sol.E1, "E1");
  outPoint(c, s, sol.E2, "E2");
};

/**
 * lerp. in: a, b (points), t (a number): out = a + t (b − a), a point on the line through two others (a scissor bar's
 * far pin, 2 M − R, from its near pin and its middle pin).
 */
const lerp: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const a = c.vec(i.a);
  outPoint(c, s, v3.add(a, v3.mul(v3.sub(c.vec(i.b), a), c.num(i.t))));
};

/**
 * line-crossing. in: a1, a2 (two points of one line), b1, b2 (of the other), n (plane normal, default +z), sum
 * (optional). out: where the lines cross in that plane (the crossing of an antiparallelogram's bars, an instant
 * centre). Where the lines run together (an antiparallelogram's change points) the crossing is the limit: the point
 * on the line a1→a2 whose distances to a1 and b1 add up to `sum` (the ellipse with foci a1 and b1); without `sum`
 * parallel lines do not cross and the block fails there.
 */
const lineCrossing: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const n = v3.unit(i.n ? c.vec(i.n) : [0, 0, 1]);
  const p = c.vec(i.a1);
  const d = v3.perp(v3.sub(c.vec(i.a2), p), n);
  const q = c.vec(i.b1);
  const e = v3.perp(v3.sub(c.vec(i.b2), q), n);
  const den = v3.dot(v3.cross(d, e), n);
  if (Math.abs(den) > 1e-6 * v3.len(d) * v3.len(e)) {
    const t = v3.dot(v3.cross(v3.sub(q, p), e), n) / den;
    outPoint(c, s, v3.add(p, v3.mul(d, t)));
    return;
  }
  if (i.sum === undefined) throw new KinError(`line-crossing ${s.id}: the lines are parallel`);
  // on the ray p + rho u: rho + |p + rho u - q| = L gives rho = (L^2 - |q - p|^2) / (2 (L - u.(q - p)))
  const L = c.num(i.sum);
  const u = v3.unit(d);
  const w = v3.perp(v3.sub(q, p), n);
  const rho = (L * L - v3.dot(w, w)) / (2 * (L - v3.dot(u, w)));
  outPoint(c, s, v3.add(p, v3.mul(u, rho)));
};

/**
 * target-path. A point that goes once round a closed curve per cycle, from the cycle phase itself: the target a tip or a
 * stylus follows, the linkage closing on it by inverse kinematics. in.shape "rounded-square": cx, cy (centre), side,
 * corner (radius), at constant speed along the outline, counter-clockwise from the middle of the right side; "flower":
 * cx, cy, r0, lobe, lobes (default 5): r = r0 + lobe cos(lobes u) at the polar angle u. n (plane normal) is +z.
 */
const targetPath: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const cx = c.num(i.cx), cy = c.num(i.cy);
  const u = ((c.u % TAU) + TAU) % TAU;
  if (i.shape === "flower") {
    const r = c.num(i.r0) + c.num(i.lobe) * Math.cos(c.num(i.lobes ?? 5) * u);
    outPoint(c, s, [cx + r * Math.cos(u), cy + r * Math.sin(u), 0]);
    return;
  }
  if (i.shape !== "rounded-square") throw new KinError(`target-path ${s.id}: unknown shape ${String(i.shape)}`);
  outPoint(c, s, roundedSquareAt(cx, cy, c.num(i.side), c.num(i.corner), u / TAU));
};

/** A point at the fraction f of the way round a rounded square, counter-clockwise from the middle of its right side. */
export function roundedSquareAt(cx: number, cy: number, side: number, corner: number, f: number): Vec3 {
  const h = side / 2;
  const st = side - 2 * corner;
  const arc = (Math.PI / 2) * corner;
  const total = 4 * (st + arc);
  let L = ((((f % 1) + 1) % 1) * total + st / 2) % total; // from the bottom of the right side's straight run
  // four sides in turn: right (up), top (left), left (down), bottom (right); each a straight run then a corner
  const dirs: [number, number][] = [[0, 1], [-1, 0], [0, -1], [1, 0]];
  const starts: [number, number][] = [[h, -h + corner], [h - corner, h], [-h, h - corner], [-h + corner, -h]];
  for (let k = 0; k < 4; k++) {
    const [dx, dy] = dirs[k]!;
    const [sx, sy] = starts[k]!;
    if (L <= st) return [cx + sx + dx * L, cy + sy + dy * L, 0];
    L -= st;
    if (L <= arc || k === 3) {
      // the corner's centre is inward of the run's end; it turns a quarter, counter-clockwise
      const ex = sx + dx * st, ey = sy + dy * st;
      const ox = ex - dy * corner, oy = ey + dx * corner;
      const a0 = Math.atan2(ey - oy, ex - ox);
      const a = a0 + Math.min(L, arc) / corner;
      return [cx + ox + corner * Math.cos(a), cy + oy + corner * Math.sin(a), 0];
    }
    L -= arc;
  }
  return [cx + h, cy, 0];
}

export const LINKAGE_BLOCKS: Record<string, BlockFn> = {
  dyad,
  "slider-dyad": sliderDyad,
  "five-bar": fiveBar,
  triad,
  lerp,
  "line-crossing": lineCrossing,
  "target-path": targetPath,
};
