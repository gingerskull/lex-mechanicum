// Face groove cam (catalogue "face-groove-cam"): a disc of radius 75 with a groove cut in its face, whose centreline is
// r(θ) = rb + s(θ), rb = 35, lift h = 20, a 3-4-5 polynomial rise over 120°, a 60° dwell at the top, the same law back over 120°
// and a 60° dwell at the bottom, drives a follower that slides on a radial guide through the axis with a Ø10 roller in the 10.2 wide
// groove: the contact is form-closed, so no spring is needed. The groove's walls are the pitch curve offset by ±5.1, so the groove
// has two walls and the roller touches the outer one when it is pushed out and the inner one when it is pulled in. The maximum
// pressure angle atan(s' / (rb + s)) is about 24° with these figures. The cam turns counter-clockwise (θ = u); the roller's centre is
// at polar angle -θ in the cam's frame.
// A groove cut in a face is blind, so the disc is three plates: the base disc (10 thick, keyed) and on it, screwed down, a ring with the
// groove's outer wall as its hole and an island with the inner wall as its outline (6 thick each); the groove is the gap between them.
// The roller is the polish's (a bought track roller on a stud in the follower): the model keeps its centre, the clearance test
// runs over it in the groove with 0.15 mm each side.
import { D2R, TAU, circle, dBore, polar, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

export const rb = 35;
export const h = 20;
export const R = 75;
export const rollerD = 10;
export const grooveW = 10.2;
const betaR = 120 * D2R;
const dwellT = 60 * D2R;
/** Distance from the roller centre to the carriage centre G along the guide. */
export const stem = 60;

/** 3-4-5 polynomial rise s(f) and its derivative, f in 0..1. */
const p345 = (f: number) => 10 * f ** 3 - 15 * f ** 4 + 6 * f ** 5;
const dp345 = (f: number) => 30 * f ** 2 - 60 * f ** 3 + 30 * f ** 4;

/** Lift s and ds/dθ at cam angle θ. */
export function law(th: number): { s: number; ds: number } {
  const a = ((th % TAU) + TAU) % TAU;
  if (a < betaR) return { s: h * p345(a / betaR), ds: (h * dp345(a / betaR)) / betaR };
  if (a < betaR + dwellT) return { s: h, ds: 0 };
  if (a < 2 * betaR + dwellT) {
    const f = (a - betaR - dwellT) / betaR;
    return { s: h * (1 - p345(f)), ds: (-h * dp345(f)) / betaR };
  }
  return { s: 0, ds: 0 };
}

/** The pitch curve in the cam's frame at cam angle θ: the roller centre at polar angle -θ. */
const pitch = (th: number): Vec2 => polar(rb + law(th).s, -th);

/** The groove's inner and outer walls, offset ±w/2 along the pitch curve's normal, one point per half degree. */
function walls(n = 720): { inner: Vec2[]; outer: Vec2[] } {
  const inner: Vec2[] = [];
  const outer: Vec2[] = [];
  const w = grooveW / 2;
  for (let i = 0; i < n; i++) {
    const th = (i / n) * TAU;
    const e = 1e-4;
    const a = pitch(th - e);
    const b = pitch(th + e);
    const T: Vec2 = [b[0] - a[0], b[1] - a[1]];
    const L = Math.hypot(T[0], T[1]);
    let N: Vec2 = [T[1] / L, -T[0] / L];
    const P0 = pitch(th);
    // the outward normal has a positive component along the radius
    if (N[0] * P0[0] + N[1] * P0[1] < 0) N = [-N[0], -N[1]];
    inner.push([P0[0] - w * N[0], P0[1] - w * N[1]]);
    outer.push([P0[0] + w * N[0], P0[1] + w * N[1]]);
  }
  return { inner, outer };
}
const W = walls();

/** The island's central opening: wider than the rules' limit for a keyed bore (28), so only the base disc is keyed to the shaft; the island is screwed to it. */
const KEYED = circle(15, 0, 0, 48);
const FOLLOWER: Vec2[] = [
  [-stem - 9, -10],
  [-stem - 9, 10],
  [-stem, 10],
  [-stem + 10, 8],
  [24, 8],
  [24, -8],
  [-stem + 10, -8],
  [-stem, -10],
];

const base = P.disc("camBase", R, { role: "driver", layer: 0, thick: 10, holes: [dBore(5)], at: "O", spin: (q) => q.th as number, name: "Cam disc, base plate", marks: [ring(R - 3)] });
const ringPlate = P.custom("camRing", circle(R, 0, 0, 96), { role: "driver", layer: 1, thick: 6, holes: [W.outer], at: "O", spin: (q) => q.th as number, name: "Cam disc, ring plate with the groove's outer wall" });
const island = P.custom("camIsland", W.inner, { role: "driver", layer: 1, thick: 6, holes: [KEYED], at: "O", spin: (q) => q.th as number, name: "Cam disc, island with the groove's inner wall" });

export default defineMechanism({
  id: "face-groove-cam",
  input: { kind: "rotary", part: "camBase" },
  parts: [
    base,
    ringPlate,
    island,
    P.custom("follower", FOLLOWER, { role: "output", layer: 2, thick: 6, between: ["G", "H"], name: "Follower, arm and carriage" }),
    ...P.rails("rail", 84, 150, 20, { layer: 2, fixed: [0, 0, 0], name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
  ],
  solve(u): Solved {
    const th = u;
    const { s, ds } = law(th);
    const r = rb + s;
    const G: Vec2 = [r + stem, 0];
    // pressure angle at the roller
    const phi = Math.atan2(ds, rb + s);
    return { pts: { O: [0, 0], F: [r, 0], G, H: [G[0] + 1, 0] }, th, lift: s, phi };
  },
  paths: ["F"],
  vel: ["F"],
  forces: (q) => [
    { type: "axial", a: q.pts.F!, b: [q.pts.F![0], q.pts.F![1] + 24 * Math.sign(q.phi as number || 1)], key: "groove push" },
    { type: "spin", c: [0, 0], r: 22, key: "input", z: 1.2 },
  ],
  angles: (q) => [{ type: "angle", c: q.pts.F!, a: [q.pts.F![0] + 40, 0], b: [q.pts.F![0] + 40 * Math.cos(q.phi as number), 40 * Math.sin(q.phi as number)], r: 26, key: "pressure", value: Math.abs(q.phi as number) / D2R, warn: Math.abs(q.phi as number) / D2R > 30 }],
  plot: { label: "Follower lift", unit: "mm", f: (q) => q.lift as number },
});
