// Internal gear pair (catalogue "internal-gear-pair"): an 18-tooth pinion on O1 drives a 40-tooth ring gear on O2,
// module 3, 20° pressure angle, centre distance m(z2 - z1)/2 = 33. Ratio 40:18 = 2.22:1, the ring turning the same
// way (162° per pinion turn). A ring has no hub, so it is carried on its rim: three fixed track rollers on dead axles
// run on its outer face (the way a kiln or a slewing ring is carried), and nothing sweeps over the mesh. One cycle is
// one pinion turn; the ring is then 162° on, which looks the same again because it has whole teeth (K2).
// The ring gaps are cut BACKLASH wider on each flank, as a cut ring would be; the model check counts any pinion vertex
// in the ring body as an overlap, so a zero-backlash internal mesh cannot pass it (K6, deliberate).
// The 18-tooth pinion is drawn involute down to the base circle with a radial flank below it (a deliberate
// simplification of the drawing, K6).
import { circle, offsetPoly, polar } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 3;
export const z1 = 18;
export const z2 = 40;
export const cd = (m * (z2 - z1)) / 2;
export const r1 = (m * z1) / 2;
export const r2 = (m * z2) / 2;
const alpha = (20 * Math.PI) / 180;
/** Ring outer radius and the rollers that carry it. */
export const RIM = 72;
export const ROLLER_R = 14;
export const ROLLER_ANGLES = [90, 210, 330].map((d) => (d * Math.PI) / 180);
export const BACKLASH = 0.12;

const ring = P.ringGear("ring", z2, m, { role: "output", at: "O2", spin: (s) => s.b as number, rim: RIM, name: "Ring gear, 40 teeth" });
ring.shape.holes = ring.shape.holes.map((h) => offsetPoly(h, BACKLASH));
const pinion = P.gear("pinion", z1, m, { role: "driver", at: "O1", spin: (s) => s.a as number, bore: false, name: "Pinion, 18 teeth" });
// keyed bore that sizes the input shaft (A3): Ø10
pinion.shape.holes = [circle(6, 0, 0, 36)];
const rollers = ROLLER_ANGLES.map((_, k) =>
  P.disc(`roller${k}`, ROLLER_R, { role: "link", at: `R${k}`, spin: (s) => s.c as number, name: `Carrier roller ${k + 1}`, marks: [circle(ROLLER_R - 3, 0, 0, 36)] }),
);

export default defineMechanism({
  id: "internal-gear-pair",
  input: { kind: "rotary", part: "pinion" },
  parts: [
    ring,
    pinion,
    ...rollers,
    P.cap("p1", -1, 7, { fixed: [cd, 0, 0], accent: true }),
    ...ROLLER_ANGLES.map((t, k) => P.cap(`pR${k}`, -1, 5.5, { fixed: [...polar(RIM + ROLLER_R, t), 0] as [number, number, number] })),
  ],
  solve(u) {
    const a = u;
    // same sense; a pinion tooth sits in a ring gap on the line of centres at u = 0
    const b = (u * z1) / z2;
    // a roller rolling on the ring's outer face turns the other way, RIM / ROLLER_R times as fast
    const c = -b * (RIM / ROLLER_R);
    const pts: Record<string, [number, number]> = { O2: [0, 0], O1: [cd, 0], Tp: polar(r1, a, cd, 0) };
    ROLLER_ANGLES.forEach((t, k) => (pts[`R${k}`] = polar(RIM + ROLLER_R, t)));
    return { pts, a, b, c };
  },
  vel: ["Tp"],
  forces: () => [
    { type: "spin", c: [cd, 0], r: r1 + 10, key: "input" },
    { type: "spin", c: [0, 0], r: RIM + 6, key: "output" },
  ],
  angles: () => [{ type: "angle", c: [r1 + cd, 0], a: [r1 + cd, 22], b: polar(22, Math.PI / 2 - alpha, r1 + cd, 0), r: 18, key: "pressure angle", value: 20 }],
  plot: { label: "Ring angle", unit: "°", f: (_s, u) => ((u * z1) / z2) * (180 / Math.PI) },
});
