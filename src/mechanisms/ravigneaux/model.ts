// Ravigneaux planetary gearset (catalogue "ravigneaux"): a small sun (30 teeth) and a large sun (36), three pairs of
// pinions on a carrier, a short pinion (18) meshing the small sun and the long pinion (24), the long pinion meshing the
// large sun and the ring (84), module 2, 20°. The pinion pairs sit on orbit radii 48 and 60, 44.05° apart (the short-long
// centre distance (18 + 24) m / 2 = 42); R = Sl + 2 Pl = 84. Two degrees of freedom until a brake holds a member; this
// model is first gear: the CARRIER held (its pins are dead axles), the small sun the input, the ring the output at
// Ss / R = 30 / 84 of the input, the large sun idling on the shaft the other way. The long pinion is two gears one above
// the other (layers 0 and 1), rigid: the lower one meshes the short pinion, the upper one the large sun and the ring,
// which the short pinion's orbit forbids sharing a plane with (the catalogue's "twice the face width"). One cycle is one
// input turn: every gear is then exactly 30 teeth on (18 x 5/3, 24 x 5/4, 36 x 5/6, 84 x 5/14), so the picture repeats (K2).
// The ring has no hub: three rollers on dead axles carry it on its rim, as on the internal gear pair (K6: the catalogue
// gives the ring no support). The ring gaps are cut BACKLASH wider on each flank (0.12 mm), as a cut ring would be: the
// model check counts a tooth vertex inside the other gear as an overlap. The 18-tooth pinion is drawn involute down to the
// base circle with no undercut (K6). Sets 2 and 3 are plated 0.2 mm up (heights only) so the mesh rules classify and build one set (as on the planetary).
import { D2R, TAU, circle, offsetPoly, polar, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 2;
export const Ss = 30;
export const Sl = 36;
export const Ps = 18;
export const Pl = 24;
export const R = 84;
export const nSet = 3;
/** Orbit radii of the short and long pinions and the angle between a pair (short-long distance 42). */
export const rS = (m * (Ss + Ps)) / 2;
export const rL = (m * (Sl + Pl)) / 2;
export const gamma = Math.acos((rS * rS + rL * rL - ((m * (Ps + Pl)) / 2) ** 2) / (2 * rS * rL));
export const RIM = 94;
export const ROLLER_R = 14;
export const ROLLER_ANGLES = [90, 210, 330].map((d) => (d * Math.PI) / 180);
const BACKLASH = 0.12;
/** The upper layer is plated 3 mm up (heights only): room for the small sun's hub and its set screw under the large sun's bearing. */
const UP = 3;
/** Tooth phases at u = 0, found by sliding each gear against its mate until their teeth interleave (turns of a pinion pair repeat every 120°). */
const PH = { short: 9.956 * D2R, long: 4.187 * D2R, sunL: 5.6 * D2R, ring: 2.576 * D2R };

const ring = P.ringGear("ring", R, m, { role: "output", layer: 1, dz: UP, at: "O", spin: (s) => (s.wR as number) + PH.ring, rim: RIM, name: "Ring gear, 84 teeth" });
ring.shape.holes = ring.shape.holes.map((h) => offsetPoly(h, BACKLASH));
const small = P.gear("sunS", Ss, m, { role: "driver", layer: 0, at: "O", spin: (s) => s.a as number, bore: false, name: "Small sun, 30 teeth" });
small.shape.holes = [circle(6, 0, 0, 36)];
const large = P.gear("sunL", Sl, m, { role: "link", layer: 1, dz: UP, at: "O", spin: (s) => (s.wL as number) + PH.sunL, bore: false, name: "Large sun, 36 teeth" });
const sets = [0, 1, 2];
const short = sets.map((k) => P.gear(`short${k}`, Ps, m, { role: "link", layer: 0, dz: k ? 0.2 : 0, at: `S${k}`, spin: (s) => (s.wS as number) + PH.short + (k * TAU) / nSet, bore: false, name: `Short pinion ${k + 1}, 18 teeth` }));
const long0 = sets.map((k) => P.gear(`long${k}`, Pl, m, { role: "link", layer: 0, dz: k ? 0.2 : 0, at: `L${k}`, spin: (s) => (s.wP as number) + PH.long + (k * TAU) / nSet, bore: false, name: `Long pinion ${k + 1}, 24 teeth, lower half` }));
const long1 = sets.map((k) => P.gear(`longT${k}`, Pl, m, { role: "link", layer: 1, dz: UP + (k ? 0.2 : 0), at: `L${k}`, spin: (s) => (s.wP as number) + PH.long + (k * TAU) / nSet, bore: false, name: `Long pinion ${k + 1}, 24 teeth, upper half` }));
const rollers = ROLLER_ANGLES.map((_, k) =>
  P.disc(`roller${k}`, ROLLER_R, { role: "link", layer: 1, dz: UP, at: `R${k}`, spin: (s) => s.wRoll as number, name: `Carrier roller ${k + 1}`, marks: [circle(ROLLER_R - 3, 0, 0, 36)] }),
);
const at3 = (r: number, a: number): [number, number, number] => [...polar(r, a), 0] as [number, number, number];

export default defineMechanism({
  id: "ravigneaux",
  input: { kind: "rotary", part: "sunS" },
  parts: [
    ring,
    small,
    large,
    ...short,
    ...long0,
    ...long1,
    ...rollers,
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 3 }),
    ...sets.map((k) => P.cap(`pS${k}`, -1, 5.5, { fixed: at3(rS, (k * TAU) / nSet), span: 1 })),
    ...sets.map((k) => P.cap(`pL${k}`, -1, 5.5, { fixed: at3(rL, (k * TAU) / nSet + gamma), span: 2 })),
    ...ROLLER_ANGLES.map((t, k) => P.cap(`pR${k}`, 0, 5.5, { fixed: at3(RIM + ROLLER_R, t), span: 1 })),
  ],
  solve(u) {
    const a = u;
    // carrier held: short pinion -Ss/Ps, long pinion +Ss/Pl, large sun -Ss/Sl, ring +Ss/R of the small sun
    const wS = -(Ss / Ps) * a;
    const wP = (Ss / Pl) * a;
    const wL = -(Ss / Sl) * a;
    const wR = (Ss / R) * a;
    // a roller turns the other way, RIM / ROLLER_R times the ring
    const wRoll = -wR * (RIM / ROLLER_R);
    const pts: Record<string, Vec2> = { O: [0, 0] };
    sets.forEach((k) => {
      pts[`S${k}`] = polar(rS, (k * TAU) / nSet);
      pts[`L${k}`] = polar(rL, (k * TAU) / nSet + gamma);
    });
    ROLLER_ANGLES.forEach((t, k) => (pts[`R${k}`] = polar(RIM + ROLLER_R, t)));
    return { pts, a, wS, wP, wL, wR, wRoll };
  },
  vel: ["S0", "L0"],
  forces: () => [
    { type: "spin", c: [0, 0], r: 40, key: "input", z: 1.2 },
    { type: "spin", c: [0, 0], r: RIM + 6, key: "output", z: 1.2 },
  ],
  plot: { label: "Ring angle", unit: "°", f: (s) => ((s.wR as number) * 180) / Math.PI },
});
