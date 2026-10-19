// Klann linkage (catalogue "klann-linkage"): a modified Stephenson III chain, the leg of a walker, scaled (x 74.63) from
// the pivot coordinates of US patent 6,260,862 so the crank is 20 mm. Frame pivots O (0, 0), A (-17.4, 46.0) and
// B (-44.0, -13.1). Crank OC 20; ternary connector C, E, K (CE 44.0, EK 39.0, CK 82.5, K at local (82.0, -8.7) in the
// frame C to E); lower rocker BE 23.9; upper rocker AH 38.6; ternary leg H, K, F (HK 66.9, KF 66.9, HF 129.3, F at local
// (124.9, 33.5) in the frame H to K). Mobility 3(6 - 1) - 2·7 = 1. Branches as the catalogue, which reproduce the patent
// pose at crank angle 0 (C at (-20, 0), pointing toward the leg): E = circleX(C, 44.0, B, 23.9, -1),
// H = circleX(K, 66.9, A, 38.6, +1). The foot F sweeps about 75 x 39 mm, flat for roughly a third of the turn.
import { D2R } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

const r = 20;
const CE = 44;
const BE = 23.9;
const AH = 38.6;
const HK = 66.9;
const O: Vec2 = [0, 0];
const A: Vec2 = [-17.4, 46.0];
const B: Vec2 = [-44.0, -13.1];
/** K in the connector frame (x along C to E) and F in the leg frame (x along H to K). */
const K_LOCAL: Vec2 = [82.0, -8.7];
const F_LOCAL: Vec2 = [124.9, 33.5];

/**
 * Plating (K1: heights may change, centres may not): the connector and the upper rocker sit 1.5 mm under their layer, the
 * leg 3 mm under its layer, over them. The connector sweeps over the lower rocker's pivot B and the leg over both ground
 * pivots A and B, so each axle ends 1.1 mm under the plate that passes over it.
 */
const CONNECTOR_DZ = -1.5;
const LEG_DZ = -3;
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const ROCKER_R: [number, number] = [12, 9.5];

/** The pin centres for a crank angle (0 puts C at (-20, 0)), on the one assembly branch. */
function pose(u: number): { C: Vec2; E: Vec2; K: Vec2; H: Vec2; F: Vec2 } {
  const C = V.at(O, u + Math.PI, r);
  const E = circleX(C, CE, B, BE, -1);
  const K = V.at(C, V.ang(C, E), K_LOCAL[0], K_LOCAL[1]);
  const H = circleX(K, HK, A, AH, 1);
  const F = V.at(H, V.ang(H, K), F_LOCAL[0], F_LOCAL[1]);
  return { C, E, K, H, F };
}

/** The lowest the foot gets; the plot reads the foot height above it. */
const FOOT_LOW = Math.min(...Array.from({ length: 720 }, (_, q) => pose((q / 720) * 2 * Math.PI).F[1]));

export default defineMechanism({
  id: "klann-linkage",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", r, { role: "driver", r: CRANK_R, between: ["O", "C"] }),
    P.link("lower-rocker", BE, { r: ROCKER_R, between: ["B", "E"], name: "Lower rocker" }),
    P.plate("connector", [[0, 0], [CE, 0], K_LOCAL], { layer: 1, r: 11, dz: CONNECTOR_DZ, between: ["C", "E"], name: "Connector" }),
    P.link("upper-rocker", AH, { layer: 1, dz: CONNECTOR_DZ, r: ROCKER_R, between: ["A", "H"], name: "Upper rocker" }),
    P.plate("leg", [[0, 0], [HK, 0], F_LOCAL], { role: "output", layer: 2, r: 11, dz: LEG_DZ, between: ["H", "K"], name: "Leg" }),
    P.cap("pO", -1, 7, { fixed: [O[0], O[1], 0], accent: true }),
    P.cap("pA", -1, 7, { fixed: [A[0], A[1], 0], span: 2 }),
    P.cap("pB", -1, 7, { fixed: [B[0], B[1], 0] }),
    P.cap("pC", 0, 5.5, { at: "C" }),
    P.cap("pE", 0, 5.5, { at: "E" }),
    P.cap("pK", 1, 5.5, { at: "K" }),
    P.cap("pH", 1, 5.5, { at: "H" }),
  ],
  traceZ: 22,
  solve(u) {
    const { C, E, K, H, F } = pose(u);
    return { pts: { O, A, B, C, E, K, H, F }, th: u };
  },
  paths: ["F"],
  vel: ["F", "K"],
  forces: (s) => [
    { type: "axial", a: s.pts.C!, b: s.pts.E!, key: "connector" },
    { type: "axial", a: s.pts.H!, b: s.pts.K!, key: "leg" },
    { type: "spin", c: O, r: 30, key: "input", z: 1.2 },
  ],
  angles(s, u) {
    const th = ((((u / D2R) % 360) + 360) % 360);
    return [{ type: "angle", c: O, a: [-r, 0], b: s.pts.C!, r: 16, key: "crank", value: th, z: 1.2 }];
  },
  plot: { label: "Foot height", unit: "mm", f: (s) => s.pts.F![1] - FOOT_LOW },
});
