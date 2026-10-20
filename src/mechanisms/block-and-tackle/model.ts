// Block and tackle (catalogue "block-and-tackle"): a double tackle, four rope parts between a fixed upper block and a
// moving lower block, laid out in plan. The catalogue's vertical is y: the upper block's pin U is at the origin, the
// lower block hangs below it along -y on a guide (the idealised prismatic pair), and the fall runs down along -y to the
// input carriage.
// Sheaves 60 mm (the rope's centreline on a 56.8 mm pitch circle, inside the rim). Each block carries two sheaves on its
// pin, sheave A on layer 1 and sheave B on layer 3.
// Reeving: dead end on a becket under the upper block, down to lower A (part 1), up to upper A (part 2), across to
// lower B (part 3), up to upper B (part 4), and the fall down from upper B. Parts 1 and 2 run in plane A, part 4 and the
// fall in plane B; part 3 passes from plane A to plane B and is drawn in the plane between them, so the three rope
// lines on the left side lie at three heights and are told apart at any tilt.
// K6: the catalogue's 400 mm block spacing is scaled to the bench: the pins are 120 to 95 mm apart, the load rises
// 25 mm while the fall is hauled about 100 mm (n = 4). The lower block's pin sits 8 mm to the right of the upper pin,
// so the fall clears the lower sheaves by 4.8 mm as it runs past them (a fleet of 3.8° to 4.8° on the four parts).
// The input oscillates: the fall is hauled in and paid out over the cycle. The model runs on the block spacing and
// derives the fall from the rope length, so the ratio is exact for the slight fleet (about 4.0).
import { arcPts, circle, roundRect, type Vec2 } from "../../core/geom";
import { osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Part, Solved } from "../../model/types";
import { P } from "../../parts";

/** Sheave rim radius and the rope's pitch radius (the rope sits in the groove, inside the rim), rope radius, mm. */
export const RS = 30;
export const RP = 28.4;
const RR = 1.6;
/** The lower block's pin offset to the right of the upper pin, mm. */
const DX = 8;
/** Pin spacing at each end of the stroke: block lowest, block highest. */
export const D_MAX = 120;
export const D_MIN = 95;
/** The dead end: the rope leaves the becket here, straight above lower sheave A's left tangent point. */
const DEAD: Vec2 = [DX - RP, -52];
/** The fall's end, the input carriage's pin, at the block's lowest position. */
const F_TOP = -158;
/** From the lower pin: the distance bolt and the hook, mm down the block. */
const K_OFF = 38;
const H_OFF = 56;
/** The input carriage: length along the fall, and its pin below the carriage's top end. */
const CAR_L = 30;
const CAR_PIN = 7;
/**
 * Plating (K1: heights may change, centres may not): the carriage and its track sit 7 mm under layer 3, so the fall
 * (z 32) runs in clear over the end stop's screw head and takes the carriage's pin above the carriage.
 */
const CAR_DZ = -7;

const spacing = osc(D_MAX, D_MIN);
const fleet = (D: number) => Math.atan2(DX, D);
const PHI = [fleet(D_MAX), fleet(D_MIN)] as const;

/** Rope length from the dead end to the upper sheave B's last tangent point, less the wraps (they are constant). */
const ropeIn = (D: number): number => D + DEAD[1] + 3 * Math.hypot(DX, D);
const C_ROPE = ropeIn(D_MAX) - F_TOP;
/** The fall hauled over the stroke, mm. */
export const PULL = ropeIn(D_MAX) - ropeIn(D_MIN);

/** A straight rope part: outline at unit length along x, stretched between two solved points (D9). */
const span = (id: string, a: string, b: string, layer: number, dz: number, name: string): Part =>
  P.custom(id, [[0, -RR], [1, -RR], [1, RR], [0, RR]], { role: "link", layer, dz, thick: 2 * RR, between: [a, b], stretch: true, name });

/** The rope's wrap over a sheave, a fixed arc on the block (the sheave turns under it), a0 to a1 counter-clockwise. */
const wrap = (id: string, a0: number, a1: number, layer: number, dz: number, place: { at: string }, name: string): Part =>
  P.custom(id, [...arcPts(0, 0, RP + RR, a0, a1, Math.PI / 36), ...arcPts(0, 0, RP - RR, a1, a0, Math.PI / 36)], { role: "link", layer, dz, thick: 2 * RR, ...place, name });

const sheave = (id: string, layer: number, at: string, k: string, name: string): Part =>
  P.disc(id, RS, { role: "link", layer, at, spin: (s) => s[k] as number, marks: [circle(RP - RR, 0, 0, 72)], name });

/** Plane A ropes at z 12 to 15.2, part 3 between the sheaves at z 22 to 25.2, plane B ropes at z 32 to 35.2. */
const PA = { layer: 2, dz: -8 };
const PM = { layer: 2, dz: 2 };
const PB = { layer: 5, dz: -18 };

/** The lower block's body (rails along -y, local x down the block): from 10 above its pin to past the hook. */
const blockOutline = roundRect(-10, -12, H_OFF + 6, 12, 6);
const BLOCK_SPIN = () => -Math.PI / 2;

export default defineMechanism({
  id: "block-and-tackle",
  input: { kind: "linear", part: "carriage" },
  parts: [
    // the lower block slides on its guide; its top cheek (a clevis twin) carries the other end of both pins
    P.custom("block", blockOutline, { role: "output", layer: 0, thick: 7, at: "L", spin: BLOCK_SPIN, name: "Lower block, bottom cheek" }),
    P.plate("cheek", [[0, 0], [K_OFF, 0]], { role: "output", layer: 4, r: 10, twin: "block", at: "L", spin: BLOCK_SPIN, name: "Lower block, top cheek" }),
    ...P.rails("guide", 80, 188, 24, { fixed: [DX, 0, -Math.PI / 2], name: "Block guide bar" }),
    sheave("UA", 1, "U", "tUA", "Upper sheave A, 60 mm"),
    sheave("UB", 3, "U", "tUB", "Upper sheave B, 60 mm"),
    sheave("LA", 1, "L", "tLA", "Lower sheave A, 60 mm"),
    sheave("LB", 3, "L", "tLB", "Lower sheave B, 60 mm"),
    // the rope: four parts between the blocks and the fall, stretched between their tangent points
    span("r1", "D0", "LAl", PA.layer, PA.dz, "Rope, part 1 (standing part)"),
    span("r2", "LAr", "UAr", PA.layer, PA.dz, "Rope, part 2"),
    span("r3", "UAl", "LBl", PM.layer, PM.dz, "Rope, part 3 (crossing from plane A to plane B)"),
    span("r4", "LBr", "UBr", PB.layer, PB.dz, "Rope, part 4"),
    span("fall", "UBl", "F", PB.layer, PB.dz, "Rope, the fall"),
    // its wraps: fixed arcs on each block, cut just inside the tangent points' small travel with the fleet
    wrap("wUA", PHI[1], Math.PI + PHI[0], PA.layer, PA.dz, { at: "U" }, "Rope wrap over upper sheave A"),
    wrap("wUB", PHI[1], Math.PI, PB.layer, PB.dz, { at: "U" }, "Rope wrap over upper sheave B"),
    wrap("wLA", Math.PI, 2 * Math.PI + PHI[0], PA.layer, PA.dz, { at: "L" }, "Rope wrap under lower sheave A"),
    wrap("wLB", Math.PI + PHI[1], 2 * Math.PI + PHI[0], PB.layer, PB.dz, { at: "L" }, "Rope wrap under lower sheave B"),
    // the input carriage takes the fall's end on its pin
    P.slider("carriage", CAR_L, 20, { role: "driver", layer: 3, dz: CAR_DZ, at: "Fc", spin: BLOCK_SPIN, noRing: true, name: "Fall carriage" }),
    ...P.rails("track", -F_TOP - CAR_PIN - 5, -F_TOP - CAR_PIN + CAR_L + PULL + 5, 20, { layer: 3, fixed: [-RP, 0, -Math.PI / 2], name: "Fall track" }).map((p) => ({ ...p, dz: CAR_DZ })),
    P.cap("pU", -1, 7, { fixed: [0, 0, 0], span: 4 }),
    P.cap("pL", 0, 5.5, { at: "L", span: 4 }),
    P.cap("pK", 0, 5.5, { at: "K", span: 4 }),
    P.cap("pF", 3, 5.5, { at: "F", span: 1, dz: CAR_DZ, accent: true }),
  ],
  flexible: [{ form: "rope", over: ["UA", "UB", "LA", "LB"], spans: ["r1", "r2", "r3", "r4", "fall"], dead: "D0", hook: "Hk", load: "block" }],
  solve(u): Solved {
    const D = spacing(u);
    const l = Math.hypot(DX, D);
    // the unit normal to the line of centres, to the right: the four parts' tangent points sit at ± RP along it
    const n: Vec2 = [D / l, DX / l];
    const L: Vec2 = [DX, -D];
    const at = (c: Vec2, k: number): Vec2 => [c[0] + k * RP * n[0], c[1] + k * RP * n[1]];
    const l1 = D + DEAD[1];
    const yF = ropeIn(D) - C_ROPE;
    const F: Vec2 = [-RP, yF];
    // each sheave turns with the rope through it (no slip): its angle is the rope paid past it over the pitch radius,
    // counter-clockwise as the block rises (lower A at the load's speed, upper A 2x, lower B 3x, upper B 4x)
    return {
      pts: {
        U: [0, 0],
        L,
        K: [DX, -D - K_OFF],
        Hk: [DX, -D - H_OFF],
        D0: DEAD,
        LAl: [DX - RP, -D],
        LAr: at(L, 1),
        UAr: at([0, 0], 1),
        UAl: at([0, 0], -1),
        LBl: at(L, -1),
        LBr: at(L, 1),
        UBr: at([0, 0], 1),
        UBl: [-RP, 0],
        F,
        Fc: [-RP, yF + CAR_PIN - CAR_L / 2],
      },
      D,
      rise: D_MAX - D,
      pull: F_TOP - yF,
      tLA: -l1 / RP,
      tUA: -(l1 + l) / RP,
      tLB: -(l1 + 2 * l) / RP,
      tUB: -(l1 + 3 * l) / RP,
    };
  },
  paths: ["Hk"],
  vel: ["Hk", "F"],
  forces: (s) => [
    { type: "axial", a: s.pts.Hk!, b: [s.pts.Hk![0], s.pts.Hk![1] - 40], key: "load" },
    { type: "axial", a: s.pts.F!, b: [s.pts.F![0], s.pts.F![1] - 30], key: "fall pull" },
  ],
  plot: { label: "Load rise", unit: "mm", f: (s) => s.rise as number },
});
