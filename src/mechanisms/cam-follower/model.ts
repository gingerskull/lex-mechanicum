// Cam and roller follower (catalogue "cam-follower"): plate cam, base circle rb 30, rise h 22, roller rr 8, in-line
// follower on a vertical guide through the cam axis. The profile is cycloidal, s(f) = f - sin(2πf)/2π, rising over 180°
// of cam turn and returning over 180° (no dwell). As the catalogue says, the law is cut into the cam surface radius and
// the lift is the highest roller position that touches the profile (the envelope), so it is close to the cycloidal
// law but not exactly it. The cam turns clockwise (θ = -u), so the contact point on the cam moves counter-clockwise
// round it and the lift at phase u is read at profile angle ψ = u.
// The follower is a clevis (A9): the front plate, which is also the carriage that slides between the rails above the
// cam, and a rear plate below it, with the roller between them on one pin (double shear).
import { D2R, TAU, capsule, dBore, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

/** Base circle, rise, roller radius. */
export const rb = 30;
export const h = 22;
export const rr = 8;
/**
 * Distance from the roller centre to the carriage centre along the guide (the stem). The catalogue gives a 70 mm stem
 * and a guide from y 70 to 100; here the carriage is 60 mm up the stem and the rails run y 64 to 154, so the
 * carriage stays between them over the whole 22 mm stroke with room for the spring above it (a deliberate difference).
 */
export const stem = 60;
/** Roller turns per cam turn, a whole number so the cycle repeats (the true ratio varies about a mean of 5.1). */
const ROLL = 5;

/** Cycloidal rise s(f), f in 0..1. */
const s = (f: number) => f - Math.sin(TAU * f) / TAU;
/** Cam surface radius at profile angle ψ (0 at the start of the rise). */
const radius = (psi: number) => {
  const a = ((psi % TAU) + TAU) % TAU;
  return rb + h * (a <= Math.PI ? s(a / Math.PI) : s((TAU - a) / Math.PI));
};

/** Cam outline in the cam's frame: local angle φ = ψ + 90°, so ψ = 0 sits under a follower on the +y line at θ = 0. */
function camOutline(n = 360): Vec2[] {
  const out: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const phi = (i / n) * TAU;
    const r = radius(phi - Math.PI / 2);
    out.push([r * Math.cos(phi), r * Math.sin(phi)]);
  }
  return out;
}

/** Roller centre height for a cam turned by θ, and the contact point: the highest touching position. */
function lift(th: number): { y: number; c: Vec2 } {
  const g = (psi: number) => {
    const phi = psi + Math.PI / 2;
    const r = radius(psi);
    const x = r * Math.cos(phi + th);
    const d = rr * rr - x * x;
    return d < 0 ? -Infinity : r * Math.sin(phi + th) + Math.sqrt(d);
  };
  // the touch lies within asin(rr / rb) of the point under the follower, which is ψ = -th
  const span = Math.asin(rr / rb) + 0.05;
  const c0 = -th;
  let best = c0;
  let by = -Infinity;
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const p = c0 - span + (2 * span * i) / N;
    const y = g(p);
    if (y > by) {
      by = y;
      best = p;
    }
  }
  let a = best - (2 * span) / N;
  let b = best + (2 * span) / N;
  const gr = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 40; i++) {
    const x1 = b - gr * (b - a);
    const x2 = a + gr * (b - a);
    if (g(x1) > g(x2)) b = x2;
    else a = x1;
  }
  const psi = (a + b) / 2;
  const phi = psi + Math.PI / 2;
  const r = radius(psi);
  return { y: g(psi), c: [r * Math.cos(phi + th), r * Math.sin(phi + th)] };
}

/** Follower plate outline in the carriage frame (local x along the guide, up): a stadium from the roller boss to past
 * the carriage centre, 20 wide to run between the rails. */
const FOLLOWER = capsule(stem + 8, 20).map(([x, y]): Vec2 => [x - stem, y]);
/** Rear plate: the boss under the roller and a short arm, the other half of the clevis. */
const REAR = capsule(24, 20).map(([x, y]): Vec2 => [x - stem, y]);
/** Keyed bore of the cam on the Ø8 input (D-bore, A5). */
const KEYED = dBore(5);

export default defineMechanism({
  id: "cam-follower",
  input: { kind: "rotary", part: "cam" },
  parts: [
    P.custom("cam", camOutline(), { role: "driver", holes: [KEYED], marks: [ring(rb)], at: "O", spin: (q) => q.th as number, name: "Plate cam" }),
    P.custom("follower", FOLLOWER, { role: "output", layer: 1, thick: 7, twin: "forkRear", between: ["G", "H"], name: "Follower, front plate and carriage" }),
    P.custom("forkRear", REAR, { role: "output", layer: -1, thick: 7, between: ["G", "H"], name: "Follower, rear plate" }),
    P.disc("roller", rr, { role: "output", at: "F", spin: (q) => q.roll as number, name: "Follower roller", marks: [ring(rr - 3)] }),
    ...P.rails("rail", 64, 154, 20, { layer: 1, fixed: [0, 0, Math.PI / 2], name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
    P.cap("pF", -1, 5.5, { at: "F", span: 3 }),
  ],
  cams: [{ cam: "cam", follower: "follower" }],
  traceZ: 16.8,
  solve(u): Solved {
    const th = -u;
    const { y, c } = lift(th);
    const G: Vec2 = [0, y + stem];
    return {
      // H one millimetre above G gives the carriage its direction: up the guide
      pts: { O: [0, 0], F: [0, y], G, H: [0, G[1] + 1], C: c },
      th,
      roll: ROLL * u,
      lift: y - (rb + rr),
      contact: c,
    };
  },
  paths: ["F"],
  vel: ["F"],
  forces(q) {
    const C = q.contact as Vec2;
    const F = q.pts.F!;
    const n: Vec2 = [(F[0] - C[0]) / rr, (F[1] - C[1]) / rr];
    return [
      { type: "axial", a: C, b: [C[0] + 34 * n[0], C[1] + 34 * n[1]], key: "cam push" },
      { type: "spin", c: [0, 0], r: 22, dir: -1, key: "input", z: 1.2 },
    ];
  },
  angles(q) {
    const C = q.contact as Vec2;
    const F = q.pts.F!;
    const n: Vec2 = [(F[0] - C[0]) / rr, (F[1] - C[1]) / rr];
    const phi = Math.abs(Math.atan2(n[0], n[1])) / D2R;
    return [{ type: "angle", c: F, a: [F[0], F[1] + 40], b: [F[0] + 40 * n[0], F[1] + 40 * n[1]], r: 26, key: "pressure", value: phi, warn: phi > 30 }];
  },
  plot: { label: "Follower lift", unit: "mm", f: (q) => q.lift as number },
});
