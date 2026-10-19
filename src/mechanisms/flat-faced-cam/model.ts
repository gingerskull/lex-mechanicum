// Cam with flat-faced follower (catalogue "flat-faced-cam"): a plate cam, base circle rb 30, lift h 15, cycloidal rise over
// 120°, a 60° dwell at the top, a cycloidal return over 120° and a 60° dwell at the bottom, drives a follower whose flat face
// (40 wide) stays square to the stroke. The profile is the envelope of the face's lines: in the cam's frame the face's line
// stands at distance rb + s(θ) from the axis with its normal at (sin θ, cos θ), so the profile point is
// x = (rb + s) sin θ + s' cos θ, y = (rb + s) cos θ - s' sin θ, and the lift is exactly s(θ). The contact slides across the face
// by s' = ds/dθ (at most 2h/β = 14.3 mm, inside the half face of 20); the radius of curvature rb + s + s'' stays positive
// (about 9.9 mm at its least with these figures), so the cam has no cusp. The cam turns counter-clockwise (θ = u). The follower is a
// T: a foot 40 wide whose underside is the face, and a stem 14 wide that slides between two rails above the cam.
import { D2R, TAU, dBore, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

export const rb = 30;
export const h = 15;
export const faceW = 40;
const betaR = 120 * D2R;
const dwellT = 60 * D2R;
/** Distance from the face to the carriage centre G along the guide (the stem). */
export const stem = 60;

/** Cycloidal rise function s(f) and its derivative, f in 0..1. */
const cyc = (f: number) => f - Math.sin(TAU * f) / TAU;
const dcyc = (f: number) => 1 - Math.cos(TAU * f);

/** Lift s and ds/dθ at cam angle θ. */
export function law(th: number): { s: number; ds: number } {
  const a = ((th % TAU) + TAU) % TAU;
  if (a < betaR) return { s: h * cyc(a / betaR), ds: (h * dcyc(a / betaR)) / betaR };
  if (a < betaR + dwellT) return { s: h, ds: 0 };
  if (a < 2 * betaR + dwellT) {
    const f = (a - betaR - dwellT) / betaR;
    return { s: h * (1 - cyc(f)), ds: (-h * dcyc(f)) / betaR };
  }
  return { s: 0, ds: 0 };
}

/** The cam's outline in its own frame: one profile point per degree. */
function camOutline(n = 360): Vec2[] {
  const out: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const th = (i / n) * TAU;
    const { s, ds } = law(th);
    out.push([(rb + s) * Math.sin(th) + ds * Math.cos(th), (rb + s) * Math.cos(th) - ds * Math.sin(th)]);
  }
  // the points run clockwise as θ grows: reverse for a counter-clockwise outline
  return out.reverse();
}

/** Follower in the carriage frame (local x up the guide, G at the origin): foot 40 wide on the face, a stem 14 wide to past G. */
const FOOT_T = 8;
const FOLLOWER: Vec2[] = [
  [-stem, -faceW / 2],
  [-stem, faceW / 2],
  [-stem + FOOT_T, faceW / 2],
  [-stem + FOOT_T, 7],
  [8, 7],
  [8, -7],
  [-stem + FOOT_T, -7],
  [-stem + FOOT_T, -faceW / 2],
];
/** Keyed bore of the cam on the Ø10 input (D-bore, A5). */
const KEYED = dBore(5);

export default defineMechanism({
  id: "flat-faced-cam",
  input: { kind: "rotary", part: "cam" },
  parts: [
    P.custom("cam", camOutline(), { role: "driver", holes: [KEYED], marks: [ring(rb - 3)], at: "O", spin: (q) => q.th as number, name: "Plate cam" }),
    P.custom("follower", FOLLOWER, { role: "output", thick: 7, between: ["G", "H"], name: "Follower, flat face 40 wide" }),
    ...P.rails("rail", 64, 154, 16, { layer: 0, fixed: [0, 0, Math.PI / 2], name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 1 }),
  ],
  cams: [{ cam: "cam", follower: "follower" }],
  solve(u): Solved {
    const th = u;
    const { s, ds } = law(th);
    const y = rb + s;
    const G: Vec2 = [0, y + stem];
    // the contact slides across the face by s'
    const C: Vec2 = [ds, y];
    return { pts: { O: [0, 0], G, H: [0, G[1] + 1], C }, th, lift: s, contact: C };
  },
  paths: ["C"],
  vel: ["C"],
  forces: (q) => {
    const C = q.contact as Vec2;
    return [
      { type: "axial", a: C, b: [C[0], C[1] + 34], key: "cam push" },
      { type: "spin", c: [0, 0], r: 22, key: "input", z: 1.2 },
    ];
  },
  plot: { label: "Follower lift", unit: "mm", f: (q) => q.lift as number },
});
