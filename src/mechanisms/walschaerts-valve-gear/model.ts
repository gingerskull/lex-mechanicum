// Walschaerts valve gear (catalogue "walschaerts-valve-gear"), a scaled bench model. Wheel O (0, 0): main crank pin
// Cp at r 60, return crank pin Rc at 25, 90° ahead. Main rod 260 to the crosshead on y = 0 (stroke 120); eccentric rod
// 220 rocks the expansion link about its trunnion Lt through its foot. The slot is an arc of radius 180 about the radius
// rod's end at mid gear, the trunnion at its middle (constant lead). The die D carries the radius rod (180) to Rt, the
// top of the combination lever (110); the spindle pin Vs is 22 below Rt on the valve axis y = 110; the union link (60)
// drives the lever's foot from the crosshead arm. The lifting link (110) from the reverse arm Lr hangs on the die pin,
// so the die slips a little along the slot and every loop closes exactly. Die 0.8 (forward); valve travel 24 mm at
// die 0 = 2 (lap + lead), about 49 at 0.8, 58 at 1.0.
// Deviations (K6): the spindle pin is 22 below the lever's top, not 15: the catalogue also gives 24 mm mid-gear travel,
// which 15 gives as 16. The lifting link hangs on the die pin. The wheel is drawn as its crank web (see below).
import { arcPts, circle, D2R, ring, roundedPoly, type Vec2 } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const r = 60;
export const rr = 25;
export const Lm = 260;
export const Le = 220;
export const R = 180;
export const Lrod = 180;
export const Lcl = 110;
export const VS = 22;
export const Lun = 60;
export const Llift = 110;
export const DIE = 0.8;
/** Die travel along the slot at die ±1, degrees of the slot arc about its centre. */
export const THETA = 24;
const YV = 110;
const O: Vec2 = [0, 0];
export const Lt: Vec2 = [244, 132];
/** The arm on the crosshead to the union pin Uc. */
const ARM: Vec2 = [104, 22];

/** A point of the slot arc in the link's frame (origin the trunnion, arc centre R along +x). */
export const arcAt = (deg: number, rad = R): Vec2 => [R + rad * Math.cos((180 + deg) * D2R), rad * Math.sin((180 + deg) * D2R)];
/** The foot's ear on the link's convex side, in the link's frame. */
const FOOT: Vec2 = [-30, -82];

/** Root of f on [lo, hi] nearest to `near`, by a scan and bisection. */
function root(f: (x: number) => number, lo: number, hi: number, n: number, near: number): number {
  let best = NaN;
  let x0 = lo;
  let f0 = f(x0);
  for (let k = 1; k <= n; k++) {
    const x1 = lo + ((hi - lo) * k) / n;
    const f1 = f(x1);
    if (Number.isFinite(f0) && Number.isFinite(f1) && f0 * f1 <= 0) {
      let a = x0;
      let b = x1;
      let fa = f0;
      for (let i = 0; i < 48; i++) {
        const m = (a + b) / 2;
        const fm = f(m);
        if (fa * fm <= 0) b = m;
        else {
          a = m;
          fa = fm;
        }
      }
      const q = (a + b) / 2;
      if (Number.isNaN(best) || Math.abs(q - near) < Math.abs(best - near)) best = q;
    }
    x0 = x1;
    f0 = f1;
  }
  return best;
}

/** The expansion link's angle and slot centre at wheel angle u. */
function linkAt(u: number) {
  const Rc: Vec2 = V.at(O, u + Math.PI / 2, rr);
  const Lf = circleX(Rc, Le, Lt, Math.hypot(...FOOT), -1);
  const th = Math.atan2(Lf[1] - Lt[1], Lf[0] - Lt[0]) - Math.atan2(FOOT[1], FOOT[0]);
  const Zl = V.rot([R, 0], th);
  return { Rc, Lf, th, Zw: [Lt[0] + Zl[0], Lt[1] + Zl[1]] as Vec2 };
}

/** The reverse arm: where the lifting link hangs from, so the die sits at DIE at the reference phase. */
const Lr: Vec2 = (() => {
  const k = linkAt(0.3);
  const a = arcAt(DIE * THETA);
  const l = V.rot([a[0] - R, a[1]], k.th);
  return [k.Zw[0] + l[0], k.Zw[1] + l[1] + Llift];
})();

/** The lever: Rt on the radius rod's circle about D, Vs on the valve axis, the union link its length. */
function lever(D: Vec2, Uc: Vec2): { Rt: Vec2; psi: number } {
  const rt = (psi: number): Vec2 | null => {
    const y = YV + VS * Math.cos(psi);
    const t = Lrod ** 2 - (y - D[1]) ** 2;
    return t < 0 ? null : [D[0] + Math.sqrt(t), y];
  };
  const g = (psi: number) => {
    const q = rt(psi);
    return q ? Math.hypot(q[0] + Lcl * Math.sin(psi) - Uc[0], q[1] - Lcl * Math.cos(psi) - Uc[1]) - Lun : NaN;
  };
  const psi = root(g, -60 * D2R, 60 * D2R, 48, 12 * D2R);
  return { Rt: rt(psi)!, psi };
}

/** A round end of an arc bar at degrees a, from radius `from` to radius `to`, bulging toward a + 2 beyond (beyond ±1). */
function endCap(a: number, from: number, to: number, beyond: 1 | -1): Vec2[] {
  const c = arcAt(a, (from + to) / 2);
  const ang = (q: Vec2) => Math.atan2(q[1] - c[1], q[0] - c[0]);
  const t0 = ang(arcAt(a, from));
  const t1 = ang(arcAt(a + beyond * 2, (from + to) / 2)) - t0;
  const v = Math.atan2(Math.sin(t1), Math.cos(t1));
  return arcPts(c[0], c[1], Math.abs(to - from) / 2, t0, t0 + Math.sign(v) * Math.PI, Math.PI / 18).slice(1, -1);
}

/** An arc bar between radii r0 < r1 from degrees a0 to a1 (a0 < a1), round-ended. */
export function bar(a0: number, a1: number, r0: number, r1: number): Vec2[] {
  const n = Math.ceil(a1 - a0);
  const at = (i: number, rad: number) => arcAt(a0 + ((a1 - a0) * i) / n, rad);
  const out: Vec2[] = [];
  for (let i = 0; i <= n; i++) out.push(at(i, r1));
  out.push(...endCap(a1, r1, r0, 1));
  for (let i = n; i >= 0; i--) out.push(at(i, r0));
  return [...out, ...endCap(a0, r0, r1, -1)];
}

/** The slot is the gap between two arc bars, GAP each side of the arc, each bar BW wide, to BAR_END degrees. */
export const GAP = 7.5;
export const BW = 10;
export const BAR_END = THETA + 5.5;
const R_OUT = [R + GAP, R + GAP + BW] as const;

/** The outer bar with the foot's ear: from 8° down, its convex edge is the hull of that edge and the ear circle. */
function outerBarWithEar(): Vec2[] {
  const pts: Vec2[] = [...circle(11, FOOT[0], FOOT[1], 36), ...endCap(BAR_END, R_OUT[1], R_OUT[0], 1)];
  for (let d = 8; d <= BAR_END; d++) pts.push(arcAt(d, R_OUT[1]));
  // the hull, counter-clockwise (monotone chain)
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cr = (o: Vec2, a: Vec2, b: Vec2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const H: Vec2[] = [];
  for (const list of [pts, [...pts].reverse()]) {
    const h: Vec2[] = [];
    for (const p of list) {
      while (h.length > 1 && cr(h[h.length - 2]!, h[h.length - 1]!, p) <= 0) h.pop();
      h.push(p);
    }
    H.push(...h.slice(0, -1));
  }
  const near = (q: Vec2) => H.reduce((bi, p, i) => (Math.hypot(p[0] - q[0], p[1] - q[1]) < Math.hypot(H[bi]![0] - q[0], H[bi]![1] - q[1]) ? i : bi), 0);
  const iA = near(arcAt(8, R_OUT[1]));
  const iB = near(arcAt(BAR_END, R_OUT[0]));
  // from the edge at 8° round the ear to the inner edge at the bar's end: the way that passes the foot
  const walk = (d: number): Vec2[] => {
    const w: Vec2[] = [];
    for (let i = iA; ; i = (i + d + H.length) % H.length) if (w.push(H[i]!) && i === iB) return w;
  };
  const dist = (P: Vec2[]) => Math.min(...P.map((p) => Math.hypot(p[0] - FOOT[0], p[1] - FOOT[1])));
  const path = [walk(1), walk(-1)].sort((p, q) => dist(p) - dist(q))[0]!;
  const out: Vec2[] = [];
  for (let d = -BAR_END; d < 8; d++) out.push(arcAt(d, R_OUT[1]));
  out.push(...path.slice(0, -1));
  for (let d = BAR_END; d >= -BAR_END; d--) out.push(arcAt(d, R_OUT[0]));
  return [...out, ...endCap(-BAR_END, R_OUT[0], R_OUT[1], -1)];
}

const link = P.custom("link", outerBarWithEar(), {
  role: "link",
  layer: 4,
  at: "Lt",
  spin: (s) => s.th as number,
  marks: [ring(8, FOOT[0], FOOT[1])],
  name: "Expansion link, outer bar",
});
const linkIn = P.custom("linkb", bar(-BAR_END, BAR_END, R - GAP - BW, R - GAP), {
  role: "link",
  layer: 4,
  twin: "link",
  at: "Lt",
  spin: (s) => s.th as number,
  name: "Expansion link, inner bar",
});

/** The wheel as its crank web with a balance tail: a disc would hold the return crank pin, which stands above the main rod. */
const wheel = P.custom("wheel", roundedPoly([[r, 0], [0, 0], [-30, 0]], 12), { role: "driver", layer: 0, at: "O", spin: (s) => s.u as number, name: "Crank web of the driving wheel", marks: [ring(8, r, 0), ring(8)] });
wheel.shape.holes = [circle(6, 0, 0, 36)];

export default defineMechanism({
  id: "walschaerts-valve-gear",
  input: { kind: "rotary", part: "wheel" },
  parts: [
    wheel,
    // the return crank: an arm fixed to the wheel on the crank pin, outside the main rod, carrying the eccentric rod's pin
    P.plate("retcrank", [[r, 0], [0, rr]], { role: "driver", layer: 2, r: 9.5, twin: "wheel", at: "O", spin: (s) => s.u as number, name: "Return crank" }),
    P.link("mainrod", Lm, { layer: 1, r: [9.5, 9.5], between: ["Cp", "Xh"], name: "Main rod" }),
    P.link("eccrod", Le, { layer: 3, dz: 3.5, r: [8.5, 8.5], between: ["Rc", "Lf"], name: "Eccentric rod" }),
    P.slider("crosshead", 26, 20, { role: "output", layer: 0, at: "Xh", name: "Crosshead" }),
    P.plate("xarm", [[0, 0], ARM], { role: "output", layer: 2, r: 9, twin: "crosshead", at: "Xh", name: "Crosshead arm" }),
    link,
    linkIn,
    P.plate("linkcap", [[-24, 0], [24, 0]], { layer: 5, r: 9, twin: "link", at: "Lt", spin: (s) => s.th as number, name: "Link cover" }),
    P.link("radiusrod", Lrod, { layer: 3, r: [9, 9], between: ["D", "Rt"], name: "Radius rod" }),
    P.link("lifting", Llift, { layer: 2, r: [8, 8], between: ["Lr", "D"], name: "Lifting link" }),
    P.link("comblever", Lcl, { layer: 4, r: [9, 9], between: ["Rt", "Ub"], name: "Combination lever" }),
    P.link("union", Lun, { layer: 5, r: [8, 8], between: ["Uc", "Ub"], name: "Union link" }),
    P.slider("spindle", 28, 12, { role: "output", layer: 6, at: "Vs", name: "Valve spindle" }),
    ...P.rails("guide", 165, 355, 20, { layer: 0, name: "Crosshead guide" }),
    ...P.rails("vrail", 365, 475, 12, { layer: 6, fixed: [0, YV, 0], name: "Valve guide" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pCp", 0, 5.5, { at: "Cp", span: 2 }),
    P.cap("pRc", 2, 5.5, { at: "Rc", span: 1 }),
    P.cap("pXh", 0, 5.5, { at: "Xh", span: 2 }),
    P.cap("pLf", 3, 5.5, { at: "Lf", span: 1 }),
    P.cap("pLt", 5, 6, { fixed: [Lt[0], Lt[1], 0], span: 0, top: "hung" }),
    P.cap("pD", 2, 5.5, { at: "D", span: 1 }),
    P.cap("pRt", 3, 5.5, { at: "Rt", span: 1 }),
    P.cap("pVs", 4, 5.5, { at: "Vs", span: 2 }),
    P.cap("pUb", 4, 5.5, { at: "Ub", span: 1 }),
    P.cap("pUc", 2, 5.5, { at: "Uc", span: 3 }),
    P.cap("pLr", 1, 7, { fixed: [Lr[0], Lr[1], 0], span: 1, top: "free" }),
  ],
  traceZ: 50.8,
  solve(u) {
    const C: Vec2 = V.at(O, u, r);
    const Xh: Vec2 = [C[0] + Math.sqrt(Lm * Lm - C[1] * C[1]), 0];
    const { Rc, Lf, th, Zw } = linkAt(u);
    const Uc: Vec2 = [Xh[0] + ARM[0], ARM[1]];
    // the die sits where the arc about the slot centre meets the lifting link's circle about the reverse arm
    const D = circleX(Zw, R, Lr, Llift, 1);
    const { Rt, psi } = lever(D, Uc);
    const Ub: Vec2 = [Rt[0] + Lcl * Math.sin(psi), Rt[1] - Lcl * Math.cos(psi)];
    const Vs: Vec2 = [Rt[0] + VS * Math.sin(psi), YV];
    return { pts: { O, Cp: C, Xh, Rc, Lf, Lt, D, Rt, Ub, Vs, Uc, Lr }, u, th, psi };
  },
  paths: ["Vs", "Xh"],
  vel: ["Vs", "Xh"],
  forces: (s) => [
    { type: "axial", a: s.pts.Cp!, b: s.pts.Xh!, key: "main rod" },
    { type: "axial", a: s.pts.D!, b: s.pts.Rt!, key: "radius rod" },
    { type: "spin", c: O, r: 90, key: "input", z: 1.2 },
  ],
  plot: { label: "Valve position", unit: "mm", f: (s) => s.pts.Vs![0] },
});
