// Desmodromic valve cam (catalogue "desmodromic-cam"): two lobes on camshaft O drive one valve both ways. The opening rocker
// (pivot Q1, arms 30 / 30) pushes the stem's end, the closing rocker (pivot Q2, arms 30 / 30, a fork of two plates) pulls the
// collar back. Each rides its lobe on a round shoe of radius 8 at the end of its cam arm, so each lobe is the envelope of its
// shoe: its centre path in the cam's frame offset inward by the shoe radius plus the lash. `shoeGap` measures the gap from the
// lobe outline itself (the tests sample it), it is not read off the construction.
// Valve lift y(θ): cycloidal, 60° rise, 60° return, 240° dwell, h 10, lash 0.1. The rocker angle is ψ = asin(y / 30); each tip
// arm stands at right angles to the valve axis with the valve shut and ends in a nose of radius 5, and the stem's end face and
// the collar's face lie one nose radius from the nose centres, so the lift is exactly 30 sin ψ (the contact slides on the face).
// Frame: valve axis along +x, opening toward +x; both pivots 30 below it; both rockers turn clockwise as the valve opens.
// Differences from the catalogue (K6): the lobes' radial lift is 10.15, not 10 (the shoe moves on an arc; the valve's lift is
// exactly 10); the base circle 18 is the opening lobe's smallest radius and 28 the closing lobe's smallest (at full lift; it
// is largest while the valve is shut); "psi2 = -psi1" is the sense of a fork on the far side, here both rockers pivot on one
// side and turn the same way; sliding shoes, no rollers; 0.1 of lash at each shoe and none at the noses; the cam arms stand at
// 150° to the tip arms and are cranked 6 mm away from the lobe, which reaches past the arm's axis.
import { D2R, TAU, dBore, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { OverlayItem, Solved } from "../../model/types";
import { P } from "../../parts";
import { ang, bone, circInt, contactAt, envelope, gap, wrap, type Round } from "./geometry";

export const L = 30;
export const lash = 0.1;
export const rr = 8;
export const rt = 5;
export const base1 = 18;
export const base2 = 28;
const h = 10;
const beta = 60 * D2R;
const cyc = (f: number) => f - Math.sin(TAU * f) / TAU;

/** Valve lift; `acc` > 0 while it is accelerated toward open (the opening lobe carries it). */
export function law(th: number): { y: number; acc: number } {
  const a = ((th % TAU) + TAU) % TAU;
  if (a < beta) return { y: h * cyc(a / beta), acc: Math.sin(TAU * (a / beta)) };
  if (a < 2 * beta) return { y: h * (1 - cyc((a - beta) / beta)), acc: -Math.sin(TAU * ((a - beta) / beta)) };
  return { y: 0, acc: 0 };
}
export const psi = (th: number): number => Math.asin(law(th).y / L);

// Layout: stem end at x = rt, collar 12 long from x 19, the fork's pivot one nose radius past it.
export const E0 = rt;
export const Q1: Vec2 = [0, -L];
export const collarX0 = 19;
export const collarX1 = collarX0 + 12;
export const Q2: Vec2 = [collarX1 + rt, -L];
// The shoes are rho1 = 18 + rr + lash from O (opening, shut) and rho2 = 28 + rr + lash (closing, valve fully open). Each cam arm
// stands at 90° ∓ g to the line from its shoe to O (g = 9° and -10°: the pressure angles are then least, 33° and 27° at the
// cycloid's steepest), which fixes the distance of O from each pivot; O is below the intersection of the two circles.
const g1 = 9 * D2R;
const g2 = -10 * D2R;
const rho1 = base1 + rr + lash;
const rho2 = base2 + rr + lash;
export const O: Vec2 = circInt(Q1, Math.sqrt(L * L + rho1 * rho1 + 2 * L * rho1 * Math.sin(g1)), Q2, Math.sqrt(L * L + rho2 * rho2 - 2 * L * rho2 * Math.sin(g2))).find((p) => p[1] < Q1[1])!;
function armDir(Q: Vec2, rho: number, want: number): number {
  const ok = circInt(Q, L, O, rho).filter((p) => Math.abs(wrap(ang(p, O) - ang(Q, p) - want)) < 1e-6);
  if (ok.length !== 1) throw new Error("desmodromic-cam: no unique shoe position");
  return ang(Q, ok[0]!);
}
export const phi1 = armDir(Q1, rho1, Math.PI / 2 - g1);
export const phi2 = armDir(Q2, rho2, -Math.PI / 2 - g2) + Math.asin(h / L);
const padAt = (Q: Vec2, phi: number, th: number): Vec2 => [Q[0] + L * Math.cos(phi - psi(th)), Q[1] + L * Math.sin(phi - psi(th))];
export const pad1 = (th: number) => padAt(Q1, phi1, th);
export const pad2 = (th: number) => padAt(Q2, phi2, th);

export const lobeOpen = envelope(pad1, O, rr + lash);
export const lobeClose = envelope(pad2, O, rr + lash);

/** Gap between a shoe and its lobe at cam angle θ, measured from the lobe's outline (the tests sample it at every angle). */
export const shoeGap = (which: 1 | 2, th: number): number => gap(which === 1 ? lobeOpen : lobeClose, which === 1 ? pad1 : pad2, O, th, rr);

/** The contact point on the lobe, the unit normal from the shoe centre toward it, and the pressure angle (degrees). */
export const contact = (which: 1 | 2, th: number) => contactAt(which === 1 ? pad1 : pad2, O, th, rr + lash);

const BOSS = 10;
/** The tip arm narrows to the nose's width 15 short of it, so only the nose meets the stem's end or the collar's face. */
const tipArm: Round = { a: [0, 0], ra: BOSS, b: [L, 0], rb: rt, knee: (L - 15) / L };
/** The cam arm's neck ends 6 to the side of the shoe away from the lobe (side +1: lobe on the left), which reaches past the arm's axis. */
function bell(phi: number, side: 1 | -1): Vec2[] {
  const f = phi - Math.PI / 2;
  const pad: Vec2 = [L * Math.cos(f), L * Math.sin(f)];
  const end: Vec2 = [pad[0] + 6 * Math.cos(f - (side * Math.PI) / 2), pad[1] + 6 * Math.sin(f - (side * Math.PI) / 2)];
  return bone([tipArm, { a: [0, 0], ra: BOSS, b: end, rb: 5.5 }], [{ a: pad, ra: rr, b: pad, rb: rr }], 2.5, 0.8);
}

// ---- the valve: origin G on the axis, x along it; guide strips, head seat at 140 ----
export const guideX0 = 60;
export const guideX1 = 116;
export const G0 = 88;
export const stemW = 10;
export const headR = 17;
export const seatX = 140;
const xE = E0 - G0;
const xH = seatX - G0;
const VALVE: Vec2[] = [[xE, -5], [xH - 9, -5], [xH, -headR], [xH + 4, -headR], [xH + 7, -headR + 3], [xH + 7, headR - 3], [xH + 4, headR], [xH, headR], [xH - 9, 5], [xE, 5]];
// the collar's halves, 12 x 30 x 4.5, one under the stem and one over it
export const collarT = 4.5;
const collarOutline: Vec2[] = [[collarX0 - G0, -15], [collarX1 - G0, -15], [collarX1 - G0, 15], [collarX0 - G0, 15]];
// Plating (K1): the closing lobe and the fork's lower plate 2.5 low, the upper plate 2.5 high: 25 apart round the stem and
// collar, with room for the nose pads that reach in to the collar's face.
const LO = -2.5;
const HI = 2.5;
const spinTh = (s: Solved) => s.th as number;
const spinRock = (s: Solved) => s.ang as number;

export default defineMechanism({
  id: "desmodromic-cam",
  input: { kind: "rotary", part: "lobeOpen" },
  parts: [
    P.custom("lobeOpen", lobeOpen, { role: "driver", layer: 0, holes: [dBore(5)], marks: [ring(base1)], at: "O", spin: spinTh, name: "Opening lobe" }),
    P.custom("lobeClose", lobeClose, { role: "driver", layer: -1, dz: LO, holes: [dBore(5)], marks: [ring(base2)], at: "O", spin: spinTh, name: "Closing lobe" }),
    P.custom("rockerOpen", bell(phi1, 1), { role: "link", layer: 0, at: "Q1", spin: spinRock, name: "Opening rocker" }),
    P.custom("rockerClose", bell(phi2, -1), { role: "link", layer: -1, dz: LO, at: "Q2", spin: spinRock, name: "Closing rocker, lower fork plate" }),
    P.custom("forkUpper", bone([tipArm], [], 2.5, 0.8), { role: "link", layer: 1, dz: HI, twin: "rockerClose", at: "Q2", spin: spinRock, name: "Closing rocker, upper fork plate" }),
    P.custom("valve", VALVE, { role: "output", layer: 0, thick: 7, between: ["G", "H"], name: "Valve" }),
    // model parts, so that the sweeps the rules keep clear include them; bolts, dowel and hardening are the polish's
    P.custom("collarLo", collarOutline, { role: "output", layer: 0, dz: -collarT, thick: collarT, between: ["G", "H"], name: "Collar half, lower" }),
    P.custom("collarHi", collarOutline, { role: "output", layer: 0, dz: 7, thick: collarT, between: ["G", "H"], name: "Collar half, upper" }),
    ...P.rails("guide", guideX0, guideX1, stemW, { layer: 0, fixed: [0, 0, 0], name: "Valve guide strip" }),
    P.cap("pO", -1, 7, { fixed: [O[0], O[1], 0], accent: true, span: 2 }),
    P.cap("pQ1", 0, 7, { fixed: [Q1[0], Q1[1], 0], span: 1, top: "hung" }),
    P.cap("pQ2", -1, 7, { fixed: [Q2[0], Q2[1], 0], span: 3 }),
  ],
  cams: [
    { cam: "lobeOpen", follower: "rockerOpen" },
    { cam: "lobeClose", follower: "rockerClose" },
  ],
  traceZ: 8,
  solve(u): Solved {
    const { y, acc } = law(u);
    const a = Math.PI / 2 - psi(u);
    const G: Vec2 = [G0 + y, 0];
    const nose = (Q: Vec2): Vec2 => [Q[0] + L * Math.cos(a), Q[1] + L * Math.sin(a)];
    return { pts: { O, Q1, Q2, P1: pad1(u), P2: pad2(u), G, H: [G[0] + 1, 0], N1: nose(Q1), N2: nose(Q2) }, th: u, ang: a, lift: y, load: acc > 0 ? 1 : acc < 0 ? 2 : 0 };
  },
  paths: ["N1", "N2"],
  vel: ["G"],
  forces(q) {
    const out: OverlayItem[] = [{ type: "spin", c: O, r: 22, key: "input", z: 1.2 }];
    if (q.load) {
      const k = contact(q.load as 1 | 2, q.th as number);
      out.unshift({ type: "axial", a: k.c, b: [k.c[0] + 30 * k.n[0], k.c[1] + 30 * k.n[1]], key: q.load === 1 ? "opening lobe" : "closing lobe" });
    }
    return out;
  },
  plot: { label: "Valve lift", unit: "mm", f: (q) => q.lift as number },
});
