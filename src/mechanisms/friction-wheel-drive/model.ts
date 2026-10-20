// Friction wheel drive (catalogue "friction-wheel-drive"): a flat steel disc, radius 100, turns on a live shaft on z; a
// rubber-tyred wheel, radius 30, stands on edge on a shaft in plan along x whose axis lies 30 above the disc face and
// crosses the disc's axis, so the tyre rests on the face. The wheel slides along its shaft on a hex sleeve; its
// distance from the disc's axis is the contact radius R, and it turns at R / r_w times the disc's speed, backward
// past the centre (omega_w = omega_d R / r_w).
// The wheel's position along its shaft is a ratio setting (the catalogue's extra slide, not a degree of freedom). It
// is shown sweeping the catalogue's range over the cycle, R from 90 to -30 and back (3.0 to -1.0 x the disc speed),
// set by a shift carriage on a slide beside the disc whose fork rides a groove in the wheel's hub. The wheel and the
// fork translate along the shaft, so they lie in the plane of a posed frame "W" (axis x, origin at x = R); the sleeve
// and the shaft stay on axis x.
// The disc makes two turns per cycle. The wheel's angle is the integral of R / r_w over the disc's angle, two whole
// turns per cycle since R averages r_w (K2: periodic).
// K6: the catalogue's dimensions are kept (disc 100, wheel 30, shaft 30 over the face, R from -30 to 90); its R = 60
// is the middle of the swept range's working part, passed at u = 1.23 and 5.05.
import { TAU, circle, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

/** Disc and wheel radii, the wheel's tyre radius under its tread, mm. */
export const RD = 100;
export const RW = 30;
export const RT = 26;
/** The disc's face (layer 1, 8 thick) and the wheel shaft's height over it. */
export const Z_FACE = 18;
export const ZC = Z_FACE + RW;
/** Tyre width along the shaft, mm. */
export const TW = 12;
/** Disc turns per cycle. */
const N = 2;
/** Contact radius over the cycle: from 90 through the disc's centre to -30 and back. */
const R_MID = 30;
const R_AMP = 60;
export const radius = (u: number): number => R_MID + R_AMP * Math.cos(u);
/** The fork's plane along the shaft from the wheel's centre, and the shift carriage's slide across the disc, mm. */
export const FORK = [14, 22] as const;
export const Y_SLIDE = -120;
/** Hex sleeve across flats, its ends along x. */
export const HEX = 16;
export const SLEEVE = [-108, 118] as const;

/** The hex sleeve: a hexagon across flats `HEX`, flats top and bottom at the assembly phase. */
const hexOutline = (af: number): Vec2[] => Array.from({ length: 6 }, (_, i): Vec2 => [(af / Math.sqrt(3)) * Math.cos((i * TAU) / 6), (af / Math.sqrt(3)) * Math.sin((i * TAU) / 6)]);

/** The fork arm in the frame's plane (y across, z up): a bar from the carriage's post to a half ring round the hub's neck. */
export const FORK_BAR = 12;
/** The fork's half ring round the hub's neck (the neck is 11.5 in radius), mm. */
export const FORK_R = [12, 19] as const;
const forkOutline = (): Vec2[] => {
  const [ri, ro] = FORK_R;
  const arc = (r: number, a0: number, a1: number, n: number): Vec2[] =>
    Array.from({ length: n + 1 }, (_, k): Vec2 => [r * Math.cos(a0 + ((a1 - a0) * k) / n), ZC + r * Math.sin(a0 + ((a1 - a0) * k) / n)]);
  // the half ring opens toward +y, round the neck above and below the shaft; the bar leaves its left side along -y to
  // the post on the carriage, from the shaft's height down FORK_BAR
  const aBar = Math.PI + Math.asin(FORK_BAR / ro);
  return [
    ...arc(ro, Math.PI / 2, Math.PI, 12),
    [Y_SLIDE - 4, ZC],
    [Y_SLIDE - 4, ZC - FORK_BAR],
    ...arc(ro, aBar, 1.5 * Math.PI, 6),
    ...arc(ri, 1.5 * Math.PI, Math.PI / 2, 24),
  ];
};

const wheelSpin = (s: Solved) => s.th as number;
const W = { axis: "p" as const, frame: "W" };

export default defineMechanism({
  id: "friction-wheel-drive",
  input: { kind: "rotary", part: "disc" },
  parts: [
    P.disc("disc", RD, { role: "driver", layer: 1, thick: 8, at: "O", spin: (s) => s.a as number, holes: [circle(7.2, 0, 0, 36)], marks: [], name: "Drive disc Ø200 x 8, face ground" }),
    // the wheel, its tread the tyre's (the polish splits it into an aluminium centre and a rubber tyre), sliding on the
    // hex sleeve
    P.disc("wheel", RW, { ...W, role: "output", layer: 4, along: -TW / 2, thick: TW, at: "Wc", spin: wheelSpin, holes: [hexOutline(HEX + 0.2)], marks: [], name: "Friction wheel Ø60 x 12" }),
    P.custom("sleeve", hexOutline(HEX), { role: "output", axis: "x", along: SLEEVE[0], thick: SLEEVE[1] - SLEEVE[0], layer: 3, at: "S", spin: wheelSpin, holes: [circle(6, 0, 0, 36)], name: `Hex sleeve AF ${HEX}, the wheel's spline` }),
    // the shift: a carriage on a slide beside the disc, its fork arm in the wheel's hub groove
    P.slider("carriage", 30, 20, { role: "link", layer: 0, at: "C", name: "Shift carriage" }),
    ...P.rails("shift", -42, 134, 20, { fixed: [0, Y_SLIDE, 0], name: "Shift rail" }),
    P.custom("fork", forkOutline(), { ...W, role: "link", layer: 5, along: FORK[0], thick: FORK[1] - FORK[0], at: "F0", name: "Shift fork" }),
    P.cap("pD", 0, 7, { fixed: [0, 0, 0], span: 2, accent: true }),
    P.cap("pW", 3, 7, { axis: "x", along: SLEEVE[0] - 4, span: 23, fixed: [0, ZC, 0] }),
  ],
  solve(u): Solved {
    const R = radius(u);
    const a = N * u;
    // the wheel's angle: d(th) = R / r_w d(a), so th = N (R_MID u + R_AMP sin u) / r_w
    const th = (N * (R_MID * u + R_AMP * Math.sin(u))) / RW;
    return {
      pts: {
        O: [0, 0],
        // in the plane of x (y across, z up): the shaft, the wheel's centre and the fork's origin
        S: [0, ZC],
        Wc: [0, ZC],
        F0: [0, 0],
        C: [R + (FORK[0] + FORK[1]) / 2, Y_SLIDE],
        // the contact at the assembly plane, and the tyre's tread point that starts at the contact, seen in plan
        K: [R, 0],
        Tp: [R, RW * Math.sin(th)],
      },
      frames: { W: { o: [R, 0, 0], u: [0, 1, 0], v: [0, 0, 1] } },
      a,
      th,
      R,
    };
  },
  vel: ["Tp"],
  traceZ: Z_FACE,
  // the disc's spin, and the shift: the carriage moved along the slide sets the ratio (push / pull)
  forces: (s) => {
    const x = s.pts.C![0];
    return [
      { type: "spin", c: [0, 0], r: RD + 8, dir: 1, key: "input", z: Z_FACE / 10 },
      { type: "axial", a: [x - 24, Y_SLIDE], b: [x + 24, Y_SLIDE], key: "shift", z: 1 },
    ];
  },
  plot: { label: "Wheel speed over disc speed", unit: "", f: (s) => (s.R as number) / RW },
});
