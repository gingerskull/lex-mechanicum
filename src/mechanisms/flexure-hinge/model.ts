// Flexure hinge (catalogue "flexure-hinge"): one aluminium 7075 blank, 10 mm thick (the hinge width b), with a circular
// notch milled from both sides: two full-radius slots R = 5 whose ends leave a neck t = 0.8 at the thinnest point. The
// block left of the notch is clamped to the base; the lever right of it, 60 mm from the neck centre N to its tip T,
// rocks about N as the neck bends (pseudo-rigid-body model: a revolute at N with a torsional spring K).
// The blank is drawn as three parts of one piece, each rigid (D9): the block (ground), the neck (fixed, its bend shown by
// the `bend` overlay) and the lever (the input, turned about N). The notch circles are tangent to the block's face and
// the lever's root face, so the three outlines meet without a step.
// Paros and Weisbord: K = 2 E b t^2.5 / (9 π sqrt(R)) = 12,984 N·mm/rad. The lever rocks ±2° (the catalogue range, the
// elastic limit of this neck in 7075), so the tip moves ±2.09 mm. Drawn true to the model, not exaggerated (K1).
import { D2R, TAU, circle, roundRect, type Vec2 } from "../../core/geom";
import { osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

/** Notch radius, neck thickness, hinge width (the blank's thickness), lever length to the tip, mm; E, N/mm². */
export const R = 5;
export const t = 0.8;
export const b = 10;
export const LARM = 60;
const E = 71700;
/** Rotational stiffness of the circular notch, N·mm/rad (Paros and Weisbord, simplified). */
export const K = (2 * E * b * t ** 2.5) / (9 * Math.PI * Math.sqrt(R));
/** The lever's swing, radians. */
export const SWING = 2 * D2R;
/** The lever's half width at its root and its tip boss radius; the drive pin's bore at the tip. */
const W_ROOT = 9;
const R_TIP = 7;
export const PIN_D = 4;

/** The notch's edge: y of the upper notch circle (centre (0, R + t/2)) at x, |x| <= R. */
const notch = (x: number) => R + t / 2 - Math.sqrt(Math.max(0, R * R - x * x));

const neckOutline: Vec2[] = [
  ...Array.from({ length: 25 }, (_, i): Vec2 => {
    const x = R - (2 * R * i) / 24;
    return [x, notch(x)];
  }),
  ...Array.from({ length: 25 }, (_, i): Vec2 => {
    const x = -R + (2 * R * i) / 24;
    return [x, -notch(x)];
  }),
];

/** The tangent point on the tip boss of the line from a root corner (side s: -1 lower, +1 upper). */
function tangent(s: number): Vec2 {
  const p: Vec2 = [R, s * W_ROOT];
  const dx = LARM - p[0];
  const dy = -p[1];
  const d = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx) + s * Math.asin(R_TIP / d);
  const at = a + s * (Math.PI / 2);
  return [LARM + R_TIP * Math.cos(at), R_TIP * Math.sin(at)];
}

/** The lever: a flat root face on the neck, tapering to a boss round the drive pin at the tip. */
function leverOutline(): Vec2[] {
  const lo = tangent(-1);
  const hi = tangent(1);
  const a0 = Math.atan2(lo[1], lo[0] - LARM);
  let a1 = Math.atan2(hi[1], hi[0] - LARM);
  while (a1 < a0) a1 += TAU;
  const n = 24;
  const arc = Array.from({ length: n + 1 }, (_, i): Vec2 => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [LARM + R_TIP * Math.cos(a), R_TIP * Math.sin(a)];
  });
  return [[R, -W_ROOT], ...arc, [R, W_ROOT], [R, notch(R)], [R, -notch(R)]];
}

const swing = osc(-SWING, SWING);
const tip = (th: number): Vec2 => [LARM * Math.cos(th), LARM * Math.sin(th)];

const BLANK = { thick: b, name: "Flexure blank, aluminium 7075-T6" };

export default defineMechanism({
  id: "flexure-hinge",
  input: { kind: "oscillating", part: "lever" },
  parts: [
    P.custom("block", roundRect(-45, -20, -R, 20, 3), { ...BLANK, role: "ground", fixed: [0, 0, 0], name: "Flexure blank, block" }),
    P.custom("neck", neckOutline, { ...BLANK, role: "link", fixed: [0, 0, 0], name: `Flexure neck, circular notch R ${R}, t ${t}` }),
    P.custom("lever", leverOutline(), {
      ...BLANK,
      role: "driver",
      at: "N",
      spin: (s) => s.th as number,
      holes: [circle(PIN_D / 2, LARM, 0, 24)],
      name: "Flexure blank, lever",
    }),
  ],
  compliant: [{ neck: "neck", ground: "block", lever: "lever", at: "N", range: [-SWING, SWING] }],
  solve(u): Solved {
    const th = swing(u);
    return { pts: { N: [0, 0], T: tip(th) }, th, torque: K * th };
  },
  paths: ["T"],
  vel: ["T"],
  traceZ: b + 0.5,
  forces: (s) => {
    // the drive's push at the tip, square to the lever, against the neck's restoring torque (scaled for the drawing)
    const th = s.th as number;
    const T = s.pts.T!;
    const F = (K * th) / LARM;
    const n: Vec2 = [-Math.sin(th), Math.cos(th)];
    const k = 1.2;
    return [{ type: "axial", a: T, b: [T[0] + n[0] * F * k, T[1] + n[1] * F * k], key: "tip force" }];
  },
  angles: (s) => [
    { type: "bend", c: [0, 0], a: 0, L: 2 * R, w: t, bend: s.th as number, key: "neck" },
    { type: "angle", c: [0, 0], a: [LARM * 0.8, 0], b: s.pts.T!, r: LARM * 0.8, key: "lever", value: ((s.th as number) * 180) / Math.PI },
  ],
  plot: { label: "Restoring torque", unit: "N·mm", f: (s) => -(s.torque as number) },
});
