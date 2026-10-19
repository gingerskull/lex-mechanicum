// Star wheel and pin (catalogue "star-wheel"): a driver turning about O1 carries a finger pin (Ø3, on radius 12) that
// reaches into a ten-toothed star wheel on O2, 28 away (the finger's circle runs 4 mm inside the star's tip circle: 28 - 12 = 16
// against the tip radius 20); each turn of the driver the finger enters a gap, pushes a tooth and leaves, and the star has stepped
// 36° the other way. A jumper, a lever on J (40, 22) with a Ø5.6 roller at its tip (the catalogue's Ø4 has no room for its stud, K6) pressed to the star by a leaf spring, seats in a
// gap between steps, holds the star in its detent, and once the finger has pushed a tooth past the jumper's peak it snaps the star
// on into the next detent. Teeth are straight-flanked, tip radius 20, root radius 14, about 66° between a tooth's flanks (the
// catalogue's 60°, with the roots half a pitch from the tips; K6).
// The catalogue's two phases are simulated, not stored: the star is pushed ahead of the finger (turned clockwise just far
// enough to keep the finger's circle, with 0.3 mm of play, off its flank) for as long as they touch, then the jumper snaps it to
// the next detent over 30° of the driver's turn; the jumper's roller is found by lowering it onto the star's outline. The star's rest
// phase is the one the jumper's arm fixes (the roller in a gap, the arm 22 long from J). One cycle is one driver turn, the star
// 36° on, which its ten teeth repeat (K2): the driver angle runs from -π to π so the push is in the middle of the cycle.
import { D2R, TAU, circle, polar, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const N = 10;
export const c = 28;
export const rf = 12;
export const rFinger = 1.5;
export const rTip = 20;
export const rRoot = 13;
export const Lj = 22;
export const rRoller = 2.8;
export const O1: Vec2 = [0, 0];
export const O2: Vec2 = [c, 0];
export const J: Vec2 = [40, 22];
export const pitch = TAU / N;
const PLAY = 0.3;

const outlineAt = (tau0: number): Vec2[] => {
  const out: Vec2[] = [];
  for (let k = 0; k < N; k++) out.push(polar(rTip, tau0 + k * pitch), polar(rRoot, tau0 + (k + 0.5) * pitch));
  return out;
};
const rotate = (pts: Vec2[], a: number): Vec2[] => {
  const co = Math.cos(a);
  const si = Math.sin(a);
  return pts.map(([x, y]): Vec2 => [x * co - y * si, x * si + y * co]);
};
const segDist = (p: Vec2, a: Vec2, b: Vec2): number => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
const inPoly = (p: Vec2, poly: Vec2[]): boolean => {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!;
    const b = poly[j]!;
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) ins = !ins;
  }
  return ins;
};
/** Signed distance of a point (star frame) from the star's material: negative inside. */
const sd = (p: Vec2, poly: Vec2[]): number => {
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) d = Math.min(d, segDist(p, poly[i]!, poly[(i + 1) % poly.length]!));
  return inPoly(p, poly) ? -d : d;
};

// ---- the rest phase: the roller touches both flanks of a gap, the arm J to roller being 22 long ----
const flank0 = outlineAt(0);
/** Radial distance of a roller centre on a gap's bisector that touches both flanks. */
const rg = (() => {
  let lo = rRoot;
  let hi = rTip + 5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (sd(polar(mid, pitch / 2), flank0) >= rRoller) hi = mid;
    else lo = mid;
  }
  return hi;
})();
const dJ = Math.hypot(J[0] - O2[0], J[1] - O2[1]);
const alphaGap = Math.atan2(J[1] - O2[1], J[0] - O2[0]) + Math.acos((rg * rg + dJ * dJ - Lj * Lj) / (2 * rg * dJ));
/** The star's angle at rest: the gap bisector at alphaGap. */
export const tau0 = alphaGap - pitch / 2;
const base = outlineAt(tau0);

// ---- the finger pushes the star clockwise, then the jumper snaps it on ----
const UN = 1440;
/** The star's angle from rest (0 down to -pitch) at driver angle -π + 2π i / UN. */
const psiTab: number[] = (() => {
  const tab: number[] = [];
  let psi = 0;
  let released = -1;
  for (let i = 0; i <= UN; i++) {
    const F = polar(rf, -Math.PI + (TAU * i) / UN);
    const Fs: Vec2 = [F[0] - c, F[1]];
    if (released < 0) {
      for (let g = 0; g < 5000 && sd(Fs, rotate(base, psi)) < rFinger + PLAY; g++) psi -= 0.01 * D2R;
      if (psi < -1e-6 && Math.hypot(Fs[0], Fs[1]) > rTip + rFinger + 0.5 && F[1] > 0) released = i;
    }
    tab.push(psi);
  }
  const iL = released < 0 ? UN : released;
  const psiL = tab[iL]!;
  const span = Math.round((30 / 360) * UN);
  for (let i = iL; i <= UN; i++) {
    const f = Math.min(1, (i - iL) / span);
    tab[i] = psiL + (-pitch - psiL) * (0.5 - 0.5 * Math.cos(Math.PI * f));
  }
  return tab;
})();
/** How far the finger has pushed the star at the moment of release (a positive angle, from rest). */
export const pushed = (() => {
  let k = 1;
  while (k < UN && psiTab[k]! <= psiTab[k - 1]! + 1e-9) k++;
  return -psiTab[k - 1]!;
})();
export const psiAt = (phi: number): number => {
  const w = (phi + Math.PI) / TAU;
  const loops = Math.floor(w + 1e-9);
  const f = Math.max(0, Math.min(UN, (w - loops) * UN));
  const i = Math.min(UN - 1, Math.floor(f));
  return psiTab[i]! + (psiTab[i + 1]! - psiTab[i]!) * (f - i) - pitch * loops;
};

// ---- the jumper: its arm angle with the roller lowered onto the star at star angle psi ----
const gRest: Vec2 = polar(rg, alphaGap, c, 0);
const tRest = Math.atan2(gRest[1] - J[1], gRest[0] - J[0]);
const away = (() => {
  const g = (t: number): Vec2 => [J[0] + Lj * Math.cos(t) - c, J[1] + Lj * Math.sin(t)];
  return sd(g(tRest + 0.05), base) > sd(g(tRest - 0.05), base) ? 1 : -1;
})();
const JT = 720;
const armTab: number[] = (() => {
  const tab: number[] = [];
  for (let i = 0; i <= JT; i++) {
    const poly = rotate(base, (-pitch * i) / JT);
    let hit = tRest;
    for (let s = 0; s < 1200; s++) {
      const t = tRest + away * (0.9 - s * 0.0015);
      const G: Vec2 = [J[0] + Lj * Math.cos(t) - c, J[1] + Lj * Math.sin(t)];
      if (sd(G, poly) <= rRoller) {
        hit = t;
        break;
      }
    }
    tab.push(hit);
  }
  return tab;
})();
const armAngle = (psi: number): number => {
  const w = ((((-psi / pitch) % 1) + 1) % 1) * JT;
  const i = Math.min(JT - 1, Math.floor(w));
  return armTab[i]! + (armTab[i + 1]! - armTab[i]!) * (w - i);
};

/** Driver disc radius; the jumper's boss radii. */
const DRIVER_R = 15;
const JUMP_R: [number, number] = [8, 6.5];
// the whole layout is turned 180° about the driver axis from the catalogue's (the star to the left of the driver): the drive's bracket
// then finds a spot whose screws clear the base edge (K6, deliberate); the design frame above is the catalogue's
export const W = (v: Vec2): Vec2 => [-v[0], -v[1]];
const starPart = P.custom("star", rotate(outlineAt(tau0), -tau0), { role: "output", layer: 0, at: "O2", spin: (s) => (s.psi as number) + tau0 + Math.PI, name: "Star wheel, 10 teeth" });
const driver = P.disc("driver", DRIVER_R, { role: "driver", layer: -1, at: "O1", spin: (s) => (s.phi as number) + Math.PI, holes: [circle(6, 0, 0, 36)], name: "Driver" });
const finger = P.disc("finger", rFinger, { role: "link", layer: 0, at: "F", thick: 7, name: "Finger pin Ø3", marks: [] });
// the roller turns on a Ø2 stud in the jumper's tip (the polish builds the stud and its bushing); no model pin: a Ø5.6 roller has no room for the rules' bearing
const roller = P.disc("roller", rRoller, { role: "link", layer: 0, at: "RJ", thick: 7, holes: [circle(1.1, 0, 0, 20)], name: "Jumper roller Ø5.6", marks: [] });
const jumper = P.link("jumper", Lj, { role: "link", layer: -1, r: JUMP_R, between: ["J", "RJ"], name: "Jumper" });

export default defineMechanism({
  id: "star-wheel",
  input: { kind: "rotary", part: "driver" },
  parts: [
    driver,
    starPart,
    finger,
    jumper,
    roller,
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true, span: 1 }),
    P.cap("pO2", -1, 7, { fixed: [-c, 0, 0], span: 2 }),
    P.cap("pJ", -1, 4, { fixed: [-J[0], -J[1], 0], span: 1, top: "free" }),
  ],
  solve(u) {
    const phi = u - Math.PI;
    const psi = psiAt(phi);
    const t = armAngle(psi);
    return { pts: { O1, O2: W(O2), J: W(J), F: W(polar(rf, phi)), RJ: W([J[0] + Lj * Math.cos(t), J[1] + Lj * Math.sin(t)]) }, phi, psi, t };
  },
  paths: ["F"],
  vel: ["F"],
  forces: () => [{ type: "spin", c: [0, 0], r: DRIVER_R + 8, key: "input", z: 1.2 }],
  plot: { label: "Star angle", unit: "°", f: (s) => ((s.psi as number) * -1) / D2R },
});
