// Bistable compliant mechanism (catalogue "bistable-compliant"): a von Mises truss cut as one blank. Two flexible beams
// run from anchor pads at x = ±c, y = 0, to a central shuttle that moves along y. The pseudo-rigid-body model of the
// catalogue is kept exactly: each beam's chord runs from its anchor to the shuttle centre S = (0, y), of length
// L(y) = sqrt(c² + y²) with c = L0 cos θ0, so the beams are longest (L0, unstressed) at y = ±h = ±L0 sin θ0 and most
// compressed at y = 0, where the shuttle is unstable. The beams are drawn bending, not telescoping (catalogue note):
// each is a fixed-guided beam clamped at both ends at the as-made angle θ0, its centreline the cubic between its ends,
// straight in the as-made state and an S in the far state (a deforming outline, D9).
// The input is a pusher on a slide along y. Its pin (a track roller) sits in a window in the shuttle between two
// preloaded compression springs, so the pusher drives the shuttle through a spring of rate ks (both springs together).
// The shuttle stands where the springs balance the beams: F(y) = ks (y - q), q the pusher's offset. Pushed from +h, it
// follows the pusher down that branch until the beams' force, past its peak, falls faster than the springs' rate
// (F'(y) = ks): there it has no balance left on its side and snaps ahead of the pusher onto the far branch, then rides it
// to the far state; back the same way. A soft spring snaps at the force peak; ks = 0.4 N/mm snaps at y = ±3.43 mm, at
// 97 % of the 4.09 N peak (y = ±3.99 mm), the catalogue's "about ±4 mm". The snap is a short, fast transfer between
// the two balances.
// K6: L0 = 40 mm, θ0 = 10°, ka = 50 N/mm as the catalogue; the stable states at ±6.95 mm. The guide of the pseudo-rigid
// model is the pusher's slide: the roller in the shuttle's window holds the shuttle on the y axis.
import { D2R, TAU, circle, roundRect, type Vec2 } from "../../core/geom";
import { osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { OverlayItem, Solved } from "../../model/types";
import { P } from "../../parts";

/** Beam free length and as-made angle, axial stiffness (pseudo-rigid model), from the catalogue. */
const L0 = 40;
const TH0 = 10 * D2R;
const KA = 50;
/** Anchor half-span and the stable offset, mm. */
export const C = L0 * Math.cos(TH0);
export const H0 = L0 * Math.sin(TH0);
/** Beam width in the plane (its depth is the blank's 6 mm). */
const TW = 1.5;
/** The springs' rate together, N/mm; the pusher's half stroke, mm (past the snap by 1 mm). */
export const KS = 0.4;
/** Shuttle: half width (the beams join its sides), its reach south of its centre. */
const WS = 12;
const HS = 13;
export const SHUTTLE_BOTTOM = HS;
/** The roller's radius (the J4 track roller in the window), the window's width, the springs' solid length, mm. */
const RR = 5.5;
const WIN_W = 12;
const SOLID = 5;
/** The springs' ends stand this far off the window's ends in the drawing (the outlines never share an edge), mm. */
const SEAT = 0.1;
/** Pusher: pin to slider-block centre, block half length and half width (the rail gap), boss radius at the pin. */
const ARM = 76;
const BL = 15;
const BW = 12;
const BOSS = 9;
/** The snap's duration in cycle phase, radians. */
const SNAP = 8 * D2R;

/** Force of the beams on the shuttle along +y, N: positive pushes it away from the centre (pseudo-rigid model). */
export const force = (y: number): number => {
  const L = Math.hypot(C, y);
  return (2 * KA * (L0 - L) * y) / L;
};
/** dF/dy. */
const slope = (y: number): number => {
  const L = Math.hypot(C, y);
  return 2 * KA * (L0 / L - 1 - (L0 * y * y) / L ** 3);
};
const bisect = (f: (x: number) => number, a: number, b: number): number => {
  let fa = f(a);
  for (let i = 0; i < 80; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (fm === 0) return m;
    if (Math.sign(fm) === Math.sign(fa)) [a, fa] = [m, fm];
    else b = m;
  }
  return (a + b) / 2;
};
/** The force peak and the snap: where the beams' force falls as fast as the springs' rate. */
export const Y_PEAK = bisect(slope, 0, H0);
export const Y_SNAP = bisect((y) => slope(y) - KS, 0, Y_PEAK);
/** The pusher's offset at the snap, and its half stroke. */
const Q_SNAP = force(Y_SNAP) / KS - Y_SNAP;
const QM = Q_SNAP + 1;
/** The shuttle's balance on the upper branch (y >= Y_SNAP) for the pusher at q; the lower branch by symmetry. */
const upper = (q: number) => bisect((y) => y - force(y) / KS - q, Y_SNAP, Math.max(QM, H0) + 1);
const lower = (q: number) => -upper(-q);

const pusher = osc(QM, -QM);
const U1 = Math.acos(-Q_SNAP / QM);
const U2 = TAU - Math.acos(Q_SNAP / QM);
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
/** The shuttle's y with the pusher at q, phase v in 0..2π: on its branch, or snapping from one to the other. */
function shuttleY(q: number, v: number): number {
  if (v < U1) return upper(q);
  if (v < U1 + SNAP) return Y_SNAP + (lower(q) - Y_SNAP) * smooth((v - U1) / SNAP);
  if (v < U2) return lower(q);
  if (v < U2 + SNAP) return -Y_SNAP + (upper(q) + Y_SNAP) * smooth((v - U2) / SNAP);
  return upper(q);
}

/** The roller's largest offset from the window's centre over the cycle, and the window's half length from it. */
const DMAX = Math.max(...Array.from({ length: 1441 }, (_, i) => (i / 1440) * TAU).map((u) => Math.abs(pusher(u) - shuttleY(pusher(u), u))));
/** The springs' length at rest (roller centred): solid, the largest stroke and 1 mm to spare. */
export const SPRING_L = SOLID + Math.ceil(DMAX) + 1;
/** Their free length: still preloaded with the roller at its farthest from them. */
const FREE = SPRING_L + Math.ceil(DMAX);
const WH = RR + SPRING_L;
/** The window's centre north of the shuttle's centre: 5 mm of wall at its south end. */
const SO = WH - HS + 5;
/** The shuttle's north end: past the window's far end by a wall of 6 mm. */
export const SHUTTLE_TOP = SO + WH + 6;
/** Anchor pad: length outward from the beam root, half height. */
const PAD_L = 24;
const PAD_H = 16;

/** The left beam's centreline y at x (world), with the shuttle at y: clamped at θ0 at both ends; and its slope. */
function beamY(x: number, y: number): [number, number] {
  const t = (x + C) / C;
  const v = y * (3 * t * t - 2 * t * t * t) + H0 * (t - 3 * t * t + 2 * t * t * t);
  const d = (y * (6 * t - 6 * t * t) + H0 * (1 - 6 * t + 6 * t * t)) / C;
  return [v, d];
}

const N_BEAM = 24;
/** A beam's outline from its anchor's face to the shuttle's side, local to its anchor point; side -1 left, +1 right. */
function beam(y: number, s: -1 | 1): Vec2[] {
  const up: Vec2[] = [];
  const lo: Vec2[] = [];
  for (let i = 0; i <= N_BEAM; i++) {
    const x = -C + ((C - WS) * i) / N_BEAM;
    const [v, d] = beamY(x, y);
    const e = (TW / 2) * Math.hypot(1, d);
    up.push([-s * (x + C), v + e]);
    lo.push([-s * (x + C), v - e]);
  }
  const out = [...lo, ...up.reverse()];
  return s < 0 ? out : out.reverse();
}

/** A compression spring Ø6 seen from above at unit length along x: its wire zig-zagging across the coil. */
const COILS = 11;
const spring: Vec2[] = (() => {
  const mid = Array.from({ length: 2 * COILS + 1 }, (_, i): Vec2 => [i / (2 * COILS), i % 2 ? 2.7 : -2.7]);
  return [...mid.map(([x, y]): Vec2 => [x, y - 0.3]), ...mid.reverse().map(([x, y]): Vec2 => [x, y + 0.3])];
})();

/** The pusher: a slider block with square ends on its rails and a tapered arm to the boss round its pin (local x = +y). */
function pusherOutline(): Vec2[] {
  const pts: Vec2[] = [...roundRect(-BL, -BW, BL, BW, 4), ...circle(BOSS, -ARM, 0, 48)].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cr = (o: Vec2, a: Vec2, b: Vec2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Vec2[]) => {
    const h: Vec2[] = [];
    for (const p of list) {
      while (h.length >= 2 && cr(h[h.length - 2]!, h[h.length - 1]!, p) <= 0) h.pop();
      h.push(p);
    }
    return h.slice(0, -1);
  };
  return [...half(pts), ...half(pts.slice().reverse())];
}

/** A bend overlay at a beam end: the zone of length LN from its clamped end along the beam. */
const LN = 8;
function bends(y: number, key: (end: "anchor" | "shuttle") => string | undefined, s: -1 | 1): OverlayItem[] {
  const at = (x: number): Vec2 => [-s * x, beamY(x, y)[0]];
  const ang = (x: number) => {
    const a = Math.atan(beamY(x, y)[1]);
    return s < 0 ? a : Math.PI - a;
  };
  const th = s < 0 ? TH0 : Math.PI - TH0;
  const x1 = -C + LN * Math.cos(TH0);
  const x2 = -WS - LN * Math.cos(TH0);
  const mid = (a: Vec2, b: Vec2): Vec2 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return [
    { type: "bend", c: mid(at(-C), at(x1)), a: th, L: LN, w: TW, bend: ang(x1) - th, key: key("anchor") },
    { type: "bend", c: mid(at(x2), at(-WS)), a: ang(x2), L: LN, w: TW, bend: th - ang(x2), key: key("shuttle") },
  ];
}

const AL: Vec2 = [-C, 0];
const AR: Vec2 = [C, 0];
const pad = (s: -1 | 1) => roundRect(s < 0 ? -PAD_L : 0, -PAD_H, s < 0 ? 0 : PAD_L, PAD_H, 3);

export default defineMechanism({
  id: "bistable-compliant",
  input: { kind: "linear", part: "pusher" },
  parts: [
    // the one-piece blank: two anchor pads, two beams, the shuttle with its spring window
    P.custom("anchorL", pad(-1), { role: "ground", fixed: [-C, 0, 0], name: "Anchor pad, left (blank)" }),
    P.custom("anchorR", pad(1), { role: "ground", fixed: [C, 0, 0], name: "Anchor pad, right (blank)" }),
    P.custom("beamL", beam(H0, -1), { role: "link", at: "AL", deform: (s) => beam(s.y as number, -1), name: "Beam, left (blank)" }),
    P.custom("beamR", beam(H0, 1), { role: "link", at: "AR", deform: (s) => beam(s.y as number, 1), name: "Beam, right (blank)" }),
    P.custom("shuttle", roundRect(-WS, -HS, WS, SHUTTLE_TOP, 3), { role: "output", at: "S", holes: [roundRect(-WIN_W / 2, SO - WH, WIN_W / 2, SO + WH, 1)], name: "Shuttle (blank)" }),
    // the springs either side of the roller, from the window's ends to the roller's rim
    P.custom("springS", spring, { role: "link", between: ["W0", "R0"], stretch: true, name: `Compression spring Ø6, wire 0.45, ${KS / 2} N/mm, free length ${FREE}, south of the roller` }),
    P.custom("springN", spring, { role: "link", between: ["W1", "R1"], stretch: true, name: `Compression spring Ø6, wire 0.45, ${KS / 2} N/mm, free length ${FREE}, north of the roller` }),
    // the input: a pusher on its slide, its pin in the shuttle's window
    P.custom("pusher", pusherOutline(), { role: "driver", layer: 1, at: "Pc", spin: () => Math.PI / 2, name: "Pusher" }),
    ...P.rails("guide", -(BL + QM + 8), BL + QM + 8, 2 * BW, { layer: 1, fixed: [0, SO + ARM, Math.PI / 2], name: "Pusher guide bar" }),
    P.cap("pQ", 0, RR, { at: "Q", span: 2, accent: true }),
  ],
  compliant: [
    { neck: "beamL", ground: "anchorL", lever: "shuttle", at: "AL", range: [-TH0, TH0] },
    { neck: "beamR", ground: "anchorR", lever: "shuttle", at: "AR", range: [Math.PI - TH0, Math.PI + TH0] },
  ],
  solve(u): Solved {
    const q = pusher(u);
    const y = shuttleY(q, ((u % TAU) + TAU) % TAU);
    // the roller sits q - y from the window's centre, the springs between it and the window's ends
    const Q: Vec2 = [0, q + SO];
    const [ym] = beamY(-(C + WS) / 2, y);
    return {
      pts: { AL, AR, S: [0, y], Q, Pc: [0, Q[1] + ARM], ML: [-(C + WS) / 2, ym], MR: [(C + WS) / 2, ym], W0: [0, y + SO - WH + SEAT], R0: [0, Q[1] - RR], R1: [0, Q[1] + RR], W1: [0, y + SO + WH - SEAT] },
      y,
      q,
      // the springs' push on the shuttle; where they balance the beams it is the beams' force F(y)
      push: KS * (y - q),
    };
  },
  paths: ["S", "ML"],
  vel: ["S"],
  forces: (s) => [
    { type: "axial", a: AL, b: s.pts.S!, key: "beam" },
    { type: "axial", a: AR, b: s.pts.S! },
    { type: "axial", a: s.pts.Q!, b: [0, s.pts.Q![1] + 30], key: "pusher" },
  ],
  angles: (s) => [...bends(s.y as number, (e) => (e === "anchor" ? "root" : "tip"), -1), ...bends(s.y as number, () => undefined, 1)],
  plot: { label: "Push force", unit: "N", f: (s) => s.push as number },
});
