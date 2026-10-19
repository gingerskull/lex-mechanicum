// Anchor escapement (catalogue "anchor-escapement"), the recoil form: a 30-tooth escape wheel (tip radius 50, root 44,
// pointed teeth undercut 1° on the face that meets the pallets) on E, and an anchor on A, 70.7 above E (r / cos 45°),
// whose two pallets sit 90° apart on the wheel (7.5 teeth). The pendulum is the clock: it swings the anchor
// phi = ±3° (one cycle is one pendulum period). Each pallet is a hardened block whose working face is turned 35° off
// the line that would hold the wheel dead, so the same face locks the tooth, pushes it back as the pallet goes in (the
// recoil) and gives the impulse as it comes out.
// The wheel is not stored: it is found by simulation (escape.ts), urged forward by its train and stopped or pushed back
// by the pallets. It advances exactly 12° per period, in two drops, with about 1° of recoil, and rests most of the time.
// The pallet places were found by searching for a wheel that advances one tooth per period without jamming; the faces
// give about 3° of lift (K6: the catalogue's 3° to 4°).
// The pendulum is drawn shortened and pointing away from the wheel: the catalogue's 994 mm rod hangs below A on a wall
// clock; on the bench the plan is flat and a 120 mm rod with its bob stands for it (K6, deliberate).
import { D2R, TAU, arcPts, polar, ring, type Vec2 } from "../../core/geom";
import { osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { OverlayItem, Solved } from "../../model/types";
import { P } from "../../parts";
import { escapeTable, wheelAt } from "./escape";

export const N = 30;
export const rTip = 50;
export const rRoot = 44;
export const pitch = TAU / N;
/** Wheel to anchor arbor, r / cos 45° (the pallets act on tangents from A). */
export const d = rTip / Math.cos(Math.PI / 4);
export const A: Vec2 = [0, d];
/** Pendulum semi-amplitude. */
export const amp = 3 * D2R;
/** Shown pendulum: rod length to the bob centre and bob radius (the catalogue's L = 994, shortened). */
export const Lp = 120;
const BOB = 18;
/** Tooth: the back slope runs 8° behind the tip, the face 1° (the undercut). */
const BACK = 8 * D2R;
const UNDER = 1 * D2R;
/** Pallet face turn off the dead line, face half-length, block depth. */
const GAMMA = 35 * D2R;
const HALF = 3;
const DEPTH = 2.5;

/** A pallet block: its face centred on polar (rc, psi) about E, turned `turn`, the block behind it along the wheel's motion. */
function pallet(psi: number, rc: number, turn: number): Vec2[] {
  const C = polar(rc, psi);
  const u: Vec2 = [Math.cos(turn), Math.sin(turn)];
  const tw: Vec2 = [-Math.sin(psi), Math.cos(psi)];
  const f0: Vec2 = [C[0] - u[0] * HALF, C[1] - u[1] * HALF];
  const f1: Vec2 = [C[0] + u[0] * HALF, C[1] + u[1] * HALF];
  return [f0, f1, [f1[0] + tw[0] * DEPTH, f1[1] + tw[1] * DEPTH], [f0[0] + tw[0] * DEPTH, f0[1] + tw[1] * DEPTH]];
}
/** Entry pallet (right, face facing the tooth from below) and exit pallet (left, face facing it from above). */
export const P1 = pallet(46.5 * D2R, 52, Math.PI / 4 - GAMMA);
export const P2 = pallet(127.5 * D2R, 51, -(Math.PI / 4 - GAMMA));

export const phiOf = (u: number): number => osc(-amp, amp)(u);
const tooth: Vec2[] = [polar(rRoot, -BACK), [rTip, 0], polar(rRoot, -UNDER)];
export const table = escapeTable({ n: N, tooth, rRoot, pallets: [P1, P2], pivot: A, phi: phiOf });

/** The wheel: pointed teeth on a root circle. */
function wheelOutline(): Vec2[] {
  const out: Vec2[] = [];
  for (let k = 0; k < N; k++) {
    const t = k * pitch;
    out.push(polar(rRoot, t - BACK), polar(rTip, t), polar(rRoot, t - UNDER));
    out.push(...arcPts(0, 0, rRoot, t - UNDER + D2R, t + pitch - BACK - D2R, 2 * D2R));
  }
  return out;
}

const loc = (p: Vec2): Vec2 => [p[0] - A[0], p[1] - A[1]];
/**
 * The anchor in its own frame (origin on A): a boss round the arbor and two arms bowed well outside the tooth tips,
 * each ending in its pallet block. Every edge but the pallet faces stays at least 3 mm outside the tip circle over the
 * swing.
 */
function anchorOutline(): Vec2[] {
  const [f0, f1, b1, b0] = P1 as [Vec2, Vec2, Vec2, Vec2];
  const [g0, g1, c1, c0] = P2 as [Vec2, Vec2, Vec2, Vec2];
  // where the right arm's inner edge meets the pallet's back, 53.5 from E
  const q1: Vec2 = [b1[0] + (b0[0] - b1[0]) * 0.2, b1[1] + (b0[1] - b1[1]) * 0.2];
  const pts: Vec2[] = [
    f0,
    f1,
    b1,
    [40.2, 44.5],
    [33, 58],
    [20, 68.5],
    ...arcPts(A[0], A[1], 10, -5 * D2R, 185 * D2R, 10 * D2R),
    [-20, 68.5],
    [-34, 57],
    [-39.5, 44],
    c0,
    c1,
    g1,
    g0,
    [-28, 50],
    [-18, 60],
    ...arcPts(A[0], A[1], 10, 230 * D2R, 310 * D2R, 10 * D2R),
    [18, 60],
    [30, 50],
    q1,
    b0,
  ];
  return pts.map(loc);
}

/** The keyed bore on the arbor (a D-flat, as the drive's lever has). */
const KEYED = (() => {
  const r = 5;
  const c = Array.from({ length: 28 }, (_, i): Vec2 => [r * Math.cos((i / 28) * TAU), r * Math.sin((i / 28) * TAU)]);
  return c.map(([x, y]): Vec2 => [Math.min(x, r * 0.68), y]);
})();

/** Pendulum: boss on the arbor, a rod to the bob, the bob, along local +y: away from the wheel, in the anchor's frame (one keyed bore for both). */
function pendulumOutline(): Vec2[] {
  const w = 3.5;
  const R0 = 10;
  const a0 = Math.asin(w / R0);
  const a1 = Math.asin(w / BOB);
  const along = [...arcPts(0, 0, R0, a0, TAU - a0, 10 * D2R), ...arcPts(Lp, 0, BOB, Math.PI + a1, TAU + Math.PI - a1, 10 * D2R)];
  return along.map(([x, y]): Vec2 => [-y, x]);
}

export default defineMechanism({
  id: "anchor-escapement",
  input: { kind: "oscillating", part: "anchor" },
  parts: [
    P.custom("wheel", wheelOutline(), { role: "output", layer: 0, at: "E", spin: (s) => s.w as number, marks: [ring(rRoot - 3)], name: "Escape wheel, 30 teeth" }),
    P.custom("anchor", anchorOutline(), { role: "driver", layer: 0, at: "A", spin: (s) => s.phi as number, holes: [KEYED], marks: [ring(8.4)], name: "Anchor, entry and exit pallets" }),
    P.custom("pendulum", pendulumOutline(), { role: "link", layer: -1, at: "A", twin: "anchor", spin: (s) => s.phi as number, holes: [KEYED], marks: [ring(8.4), ring(BOB - 3, 0, Lp)], name: "Pendulum, shortened" }),
    P.cap("pE", -1, 7, { fixed: [0, 0, 0], span: 1 }),
    P.cap("pA", -1, 7, { fixed: [A[0], A[1], 0], accent: true, span: 1 }),
  ],
  traceZ: 16.8,
  solve(u): Solved {
    const phi = phiOf(u);
    const w = wheelAt(table, u);
    const bob: Vec2 = [A[0] - Lp * Math.sin(phi), A[1] + Lp * Math.cos(phi)];
    return { pts: { E: [0, 0], A, B: bob }, phi, w };
  },
  paths: ["B"],
  vel: ["B"],
  forces(): OverlayItem[] {
    return [
      { type: "spin", c: A, r: 16, key: "input", z: 1.2 },
      { type: "spin", c: [0, 0], r: rRoot - 8, dir: 1, key: "train", z: 1.2 },
    ];
  },
  angles(s) {
    const phi = s.phi as number;
    return [{ type: "angle", c: A, a: [A[0], A[1] + Lp * 0.75], b: [A[0] - Lp * 0.75 * Math.sin(phi), A[1] + Lp * 0.75 * Math.cos(phi)], r: Lp * 0.75, key: "swing", value: phi / D2R, z: 1.2 }];
  },
  plot: { label: "Wheel angle", unit: "°", f: (s) => ((s.w as number) - table.tab[0]!) / D2R },
});
