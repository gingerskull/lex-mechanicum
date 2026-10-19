// Lever escapement (catalogue "lever-escapement"), the Swiss lever, scaled 2x from the catalogue's model for the bench
// (K6: wheel radius 40 instead of 20, fork 60 from the lever pivot, roller radius 16). Three arbors on a line: the
// escape wheel on W (15 club teeth), the pallet lever on L, the balance on B. The lever pivot sits at r / cos 30° from W,
// so its two pallet stones act on tangents 60° apart on the wheel (2.5 teeth; K6: the catalogue's 28 mm at scale would
// put them 3.7 teeth apart, where they could not take turns).
// The balance is the clock: theta_b = 270° sin u, one cycle a full balance period, two beats. Its impulse pin, on the
// roller 16 from B, is in the lever's fork only while |theta_b| < 20° (the window); the lever then follows the pin and
// flips from one banking to the other, 5.1° either side (lift 10.3°), and rests on the banking the rest of the swing.
// The escape wheel is found by the anchor escapement's simulation (escape.ts): urged forward by its train, held by a
// stone's face while the lever is banked, released and driven forward across the stones' faces while the lever flips.
// It advances 24° per balance period, about 12° per beat. Stone places and face angles were found by searching for a
// wheel that takes even beats without jamming.
// The lever body sits a layer above the wheel; its stones reach down into the wheel's plane, as jewels do.
import { D2R, TAU, arcPts, circle, polar, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { OverlayItem, Solved } from "../../model/types";
import { P } from "../../parts";
import { escapeTable, wheelAt } from "../anchor-escapement/escape";

export const N = 15;
export const rTip = 40;
export const rRoot = 33;
export const pitch = TAU / N;
/** Wheel to lever pivot (tangential stones 60° apart), lever pivot to fork, roller radius. */
export const dWL = rTip / Math.cos(Math.PI / 6);
export const lf = 60;
export const rr = 16;
export const W: Vec2 = [0, 0];
export const L: Vec2 = [0, dWL];
export const B: Vec2 = [0, dWL + lf + rr];
/** Balance amplitude, the half-width of the pin's window, the balance radius. */
export const amp = 270 * D2R;
export const win = 20 * D2R;
export const rBal = 50;
/** Lever angle that keeps the fork's slot on the impulse pin. */
const followPin = (t: number): number => Math.atan2(rr * Math.sin(t), lf + rr - rr * Math.cos(t));
/** The banking: where the lever rests outside the window. */
export const bank = followPin(win);
export const thetaOf = (u: number): number => amp * Math.sin(u);
export const leverOf = (u: number): number => {
  // the balance turns the pin one way, the fork the other: the lever turns against the balance
  const t = thetaOf(u);
  return -(Math.abs(t) < win ? followPin(t) : Math.sign(t) * bank);
};

/** Club tooth: back slope from 15° behind, the club's impulse face across the tip, the locking face undercut 1°. */
const tooth: Vec2[] = [polar(rRoot, -15 * D2R), polar(rTip, -2 * D2R), polar(rTip - 1, 1.5 * D2R), polar(rRoot, -1 * D2R)];

/** A pallet stone: its face centred on polar (rc, psi) about W, turned `turn`, the stone behind it along the wheel's motion. */
function stone(psi: number, rc: number, turn: number, half: number, depth: number): Vec2[] {
  const C = polar(rc, psi);
  const u: Vec2 = [Math.cos(turn), Math.sin(turn)];
  const tw: Vec2 = [-Math.sin(psi), Math.cos(psi)];
  const f0: Vec2 = [C[0] - u[0] * half, C[1] - u[1] * half];
  const f1: Vec2 = [C[0] + u[0] * half, C[1] + u[1] * half];
  return [f0, f1, [f1[0] + tw[0] * depth, f1[1] + tw[1] * depth], [f0[0] + tw[0] * depth, f0[1] + tw[1] * depth]];
}
const G = 33.5 * D2R;
export const S1 = stone(55.5 * D2R, 40.2, Math.PI / 3 - G, 2.68, 2.96);
export const S2 = stone(116.1 * D2R, 42.9, -(Math.PI / 3 - G), 2.68, 2.96);
export const table = escapeTable({ n: N, tooth, rRoot, pallets: [S1, S2], pivot: L, phi: leverOf, steps: 1440, dmax: 0.5 * D2R });

function wheelOutline(): Vec2[] {
  const out: Vec2[] = [];
  for (let k = 0; k < N; k++) {
    const t = k * pitch;
    out.push(...tooth.map(([x, y]): Vec2 => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]));
    out.push(...arcPts(0, 0, rRoot, t + 0.5 * D2R, t + pitch - 15.5 * D2R, 2 * D2R));
  }
  return out;
}

const loc = (p: Vec2): Vec2 => [p[0] - L[0], p[1] - L[1]];
/** Fork: slot half-width (the Ø4 pin plus play), tine width, slot bottom and tine tips along the lever. */
const SLOT = 2.15;
const TINE = 2.4;
const Y0 = lf - 4.5;
const YT = lf - 0.6;
/** The lever in its own frame (origin on L, pointing to B at rest): the stones' seat across the bottom, the fork at the top. */
function leverOutline(): Vec2[] {
  const x1 = SLOT + TINE;
  return [
    [16, -17],
    [26.5, -16.5],
    [28, -9],
    [8, 6],
    [x1, Y0 - 6],
    [x1, YT],
    [SLOT, YT],
    ...arcPts(0, Y0, SLOT, 0, -Math.PI, Math.PI / 8),
    [-SLOT, YT],
    [-x1, YT],
    [-x1, Y0 - 6],
    [-8, 6],
    [-26, -4],
    [-26, -12],
    [-15.5, -13],
    [-7, -9.5],
    [7, -9.5],
  ];
}

/** The keyed bore on the balance staff (a D-flat). */
const KEYED = (() => {
  const r = 5;
  return circle(r, 0, 0, 28).map(([x, y]): Vec2 => [Math.min(x, r * 0.68), y]);
})();

export default defineMechanism({
  id: "lever-escapement",
  input: { kind: "rotary", part: "balance" },
  parts: [
    P.custom("wheel", wheelOutline(), { role: "output", layer: 0, dz: 2, at: "W", spin: (s) => s.w as number, marks: [ring(rRoot - 3)], name: "Escape wheel, 15 club teeth" }),
    P.custom("lever", leverOutline(), { role: "link", layer: 1, at: "L", spin: (s) => s.lever as number, marks: [ring(6.4)], name: "Pallet lever" }),
    P.custom("stone1", S1.map(loc), { role: "link", layer: 0, thick: 10, at: "L", spin: (s) => s.lever as number, name: "Entry pallet stone" }),
    P.custom("stone2", S2.map(loc), { role: "link", layer: 0, thick: 10, at: "L", spin: (s) => s.lever as number, name: "Exit pallet stone" }),
    P.disc("pin", 2, { role: "link", layer: 1, at: "IP", thick: 10, marks: [], name: "Impulse pin Ø4" }),
    P.disc("roller", rr + 4, { role: "driver", layer: 2, at: "B", spin: (s) => s.theta as number, holes: [KEYED], marks: [ring(8.4)], name: "Impulse roller" }),
    P.disc("balance", rBal, { role: "driver", layer: 3, at: "B", twin: "roller", spin: (s) => s.theta as number, holes: [KEYED], marks: [ring(rBal - 4)], name: "Balance wheel" }),
    P.cap("pW", -1, 7, { fixed: [W[0], W[1], 0], span: 1 }),
    P.cap("pL", 1, 5.5, { fixed: [L[0], L[1], 0], span: 0 }),
    P.cap("pB", 2, 7, { fixed: [B[0], B[1], 0], accent: true, span: 1 }),
  ],
  traceZ: 16.8,
  solve(u): Solved {
    const theta = thetaOf(u);
    const lever = leverOf(u);
    // the lever's local y points to B at rest; its pose angle is the lever angle
    const IP: Vec2 = [B[0] + rr * Math.sin(theta), B[1] - rr * Math.cos(theta)];
    return { pts: { W, L, B, IP }, theta, lever, w: wheelAt(table, u) };
  },
  paths: ["IP"],
  vel: ["IP"],
  forces(): OverlayItem[] {
    return [
      { type: "spin", c: B, r: rBal + 6, key: "input", z: 1.2 },
      { type: "spin", c: W, r: rRoot - 8, dir: 1, key: "train", z: 1.2 },
    ];
  },
  angles(s) {
    const lv = s.lever as number;
    return [{ type: "angle", c: L, a: [L[0], L[1] + 40], b: [L[0] - 40 * Math.sin(lv), L[1] + 40 * Math.cos(lv)], r: 40, key: "lever", value: lv / D2R, z: 1.2 }];
  },
  plot: { label: "Wheel angle", unit: "°", f: (s) => ((s.w as number) - table.tab[0]!) / D2R },
});
