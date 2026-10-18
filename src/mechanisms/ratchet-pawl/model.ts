// Ratchet and pawl (catalogue "ratchet-pawl"): 12 teeth, root radius 50, tip radius 62, the steep face spanning 3° and the
// back slope 27°. The lever swings 62° to 98° about the wheel axis O (a 36° stroke = a 30° pitch + 6° of overtravel); its
// pawl, 56 mm from pivot D to tip, sits on the lever at Rp = hypot(50, 56) = 75.1 mm, so its line is tangent to the root
// circle where it engages. The holding pawl is the same beak on a frame pivot H at 75.1 mm, -32°.
// Both pawls are pushers: the tip is ahead of its pivot and meets the steep face from behind. The first 6° of the forward
// stroke is lost motion (the tip rides down the last of the back slope into the root), the next 30° push the wheel one
// tooth, and on the return the tip climbs the back slope of the tooth behind, over its tip and down into the root.
// The holding pawl rests 10° behind the face it holds (the backlash) and climbs the same slopes as the wheel advances.
import { D2R, TAU, arcPts, clamp, polar, ring, type Vec2 } from "../../core/geom";
import { osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { OverlayItem, Solved } from "../../model/types";
import { P } from "../../parts";

export const N = 12;
export const rRoot = 50;
export const rTip = 62;
/** Pawl length, pivot to tip. */
export const Lp = 56;
/** Pivot radius: the pawl line is tangent to the root circle at engagement. */
export const Rp = Math.hypot(rRoot, Lp);
export const leverLen = 128;
export const pitch = TAU / N;
/** Lever swing, 36° = pitch + 6° of overtravel. */
export const swingLo = 62 * D2R;
export const swingHi = 98 * D2R;
export const holdAt = -32 * D2R;
/** The steep face spans 3° of wheel angle, the back slope the other 27°. */
const faceSpan = 3 * D2R;
/** Angle at O between pivot and tip when the tip is at radius r (law of cosines on O, pivot, tip). */
const delta = (r: number): number => Math.acos(clamp((r * r + Rp * Rp - Lp * Lp) / (2 * r * Rp), -1, 1));
/** Lever angle at which the driving pawl meets the face; the push lasts one pitch from here. */
const alphaPush = 68 * D2R;
/** Wheel angle at the start of the cycle: with the tip at the foot of a face (radius 50) at lever angle `alphaPush`. */
const omega0 = alphaPush + delta(rRoot) - 4 * pitch;

const F: Vec2 = [rRoot, 0];
const K: Vec2 = polar(rTip, faceSpan);
const F2: Vec2 = polar(rRoot, pitch);
const cross = (a: Vec2, b: Vec2) => a[0] * b[1] - a[1] * b[0];
/** Radius of the wheel profile at angle t (0 to one pitch) from the foot of a face. */
function profile(t: number): number {
  const d: Vec2 = [Math.cos(t), Math.sin(t)];
  const [A, B] = t < faceSpan ? [F, K] : [K, F2];
  const e: Vec2 = [B[0] - A[0], B[1] - A[1]];
  return cross(A, e) / cross(d, e);
}
const mod = (a: number) => ((a % pitch) + pitch) % pitch;

/** Polar angle of a pawl tip resting on the profile: pivot at angle `pa`, wheel turned by `omega`. */
function tipAngle(pa: number, omega: number): number {
  let lo = pa + delta(rTip) - 1.5 * D2R;
  let hi = pa + delta(rRoot) + 1.5 * D2R;
  const h = (g: number) => g - pa - delta(profile(mod(g - omega)));
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (h(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** The wheel: sawtooth, each tooth a steep face then the back slope; a sharp tip and a sharp root, the cutter's. */
function wheelOutline(): Vec2[] {
  const out: Vec2[] = [];
  for (let k = 0; k < N; k++) out.push(polar(rRoot, k * pitch), polar(rTip, k * pitch + faceSpan));
  return out;
}

/** Pawl boss radius at the pivot. */
const BOSS = 9;
/**
 * Pawl outline in its own frame (x from the pivot to the tip, y negative away from the wheel centre), cut round the
 * wheel where it is engaged: a round boss at the pivot, an arm bowed outside the tip circle, and a finger down into the
 * root whose front edge lies along the steep face and whose foot is bevelled 32° off its axis so it clears the back slope. The tip is
 * the point (Lp, 0).
 */
function pawlOutline(): Vec2[] {
  const xK = Lp + K[1];
  const yK = -(K[0] - F[0]);
  const fw = 4.5;
  const bevel = fw / Math.tan(32 * D2R);
  return [
    [Lp, 0],
    [xK, yK],
    [xK, yK - 12],
    [xK - 2.2, yK - 14.5],
    [42, -24],
    [28, -19.5],
    [14, -15],
    ...arcPts(0, 0, BOSS, -Math.PI / 2, (-3 * Math.PI) / 2, Math.PI / 18),
    [10, 2],
    [22, -6],
    [28, -9.5],
    [40, -14],
    [Lp - fw, -15],
    [Lp - fw, -bevel],
  ];
}

/** Boss radii of the lever plates (D1): round the keyed Ø8 input, round the free end. */
const LEVER_R: [number, number] = [12, 8];
const KEYED = (() => {
  const r = 5;
  const c = Array.from({ length: 28 }, (_, i): Vec2 => [r * Math.cos((i / 28) * TAU), r * Math.sin((i / 28) * TAU)]);
  return c.map(([x, y]): Vec2 => [Math.min(x, r * 0.68), y]);
})();

export default defineMechanism({
  id: "ratchet-pawl",
  input: { kind: "oscillating", part: "lever" },
  parts: [
    P.custom("wheel", wheelOutline(), { role: "output", marks: [ring(14), ring(46)], at: "O", spin: (s) => s.wheel as number, name: "Ratchet wheel" }),
    P.link("leverRear", leverLen, { role: "driver", layer: -1, r: LEVER_R, holes: [KEYED], between: ["O", "E"], name: "Lever, rear plate" }),
    P.link("lever", leverLen, { role: "driver", layer: 1, r: LEVER_R, holes: [KEYED], twin: "leverRear", between: ["O", "E"], name: "Lever, front plate" }),
    P.custom("pawl", pawlOutline(), { role: "link", between: ["D", "TD"], name: "Driving pawl" }),
    P.custom("holdPawl", pawlOutline(), { role: "link", between: ["H", "TH"], name: "Holding pawl" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
    P.cap("pD", -1, 5.5, { at: "D", span: 2 }),
    P.cap("pH", 0, 7, { fixed: [...polar(Rp, holdAt), 0], span: 0 }),
  ],
  traceZ: 16.8,
  solve(u): Solved {
    // the player runs u on past 2π: lever and pawls repeat every cycle, the wheel keeps its count (one pitch per cycle)
    const k = Math.floor(u / TAU);
    const ph = u - TAU * k;
    const a = osc(swingLo, swingHi)(ph);
    // the wheel is pushed one pitch while the lever goes forward from alphaPush to the end of the stroke, and stays put
    const w = omega0 + k * pitch + (ph <= Math.PI ? clamp(a - alphaPush, 0, pitch) : pitch);
    const D = polar(Rp, a);
    const H = polar(Rp, holdAt);
    const TD = polar(profile(mod(tipAngle(a, w) - w)), tipAngle(a, w));
    const TH = polar(profile(mod(tipAngle(holdAt, w) - w)), tipAngle(holdAt, w));
    const driving = ph <= Math.PI && a > alphaPush;
    return { pts: { O: [0, 0], E: polar(leverLen, a), D, TD, H, TH }, th: a, wheel: w, driving };
  },
  paths: ["TD"],
  vel: ["TD"],
  forces(s): OverlayItem[] {
    const out: OverlayItem[] = [{ type: "spin", c: [0, 0], r: leverLen * 0.5, key: "input", z: 1.2 }];
    if (s.driving) out.push({ type: "axial", a: s.pts.D!, b: s.pts.TD!, key: "pawl" });
    return out;
  },
  angles(s) {
    const th = s.th as number;
    return [{ type: "angle", c: [0, 0], a: polar(leverLen * 0.7, swingLo), b: s.pts.E!, r: leverLen * 0.7, key: "stroke", value: (th - swingLo) / D2R, z: 1.2 }];
  },
  plot: { label: "Wheel angle", unit: "°", f: (s) => ((s.wheel as number) - omega0) / D2R },
});
