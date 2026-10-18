// Planetary gear set (catalogue "planetary"): sun 13, three planets of 11, ring 35, module 4, 20° pressure angle.
// Concentric: zr = zs + 2 zp = 35, planet centres on a carrier circle of radius m(zs + zp)/2 = 48, equal spacing
// (zs + zr)/3 = 16 teeth. The ring is held; the sun drives; the carrier turns with the sun at 13/48 of its speed
// (1 + 35/13 = 3.69:1 reduction). One cycle is one carrier turn: the sun then makes 48/13 turns and the planets 24/11
// turns backwards, and since 48 teeth of the sun and 24 of the planets are whole numbers of teeth the whole train looks
// the same again, so the cycle is periodic (K2). One sun turn is not periodic, because the carrier is then 97.5° on
// (K6, deliberate: the catalogue's "sun 360°" is the same motion measured on the input).
// The 11-tooth planets are drawn involute down to the base circle with a radial flank below it, without the undercut a
// generating cutter would leave (a deliberate simplification of the drawing, K6).
// Heights: ring, sun and planets share layer 0; the carrier is a cage of two plates, one a layer below and one above
// (a clevis, A9), so every planet pin works in double shear and the sun's shaft passes through both.
import { TAU, arcPts, circle, offsetPoly, polar, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 4;
export const zs = 13;
export const zp = 11;
export const zr = 35;
export const nP = 3;
/** Sun-planet centre distance = carrier arm length. */
export const cd = (m * (zs + zp)) / 2;
export const rs = (m * zs) / 2;
export const rp = (m * zp) / 2;
export const rr = (m * zr) / 2;
/** Carrier turns per sun turn with the ring held: zs / (zs + zr). */
export const kC = zs / (zs + zr);
const alpha = (20 * Math.PI) / 180;

/** Boss radii of the carrier plates: round the sun shaft's bearing, round the planet pins. */
export const HUB_R = 18;
export const ARM_R = 10;
/** The upper plate is plated 3 mm up, clear of the sun hub and its circlip (K1: heights may change, centres may not). */
const TOP_DZ = 3;

/**
 * The carrier plate: three tapered arms from the hub to the planet pins. Each arm is the outer tangent pair of its two
 * bosses; neighbouring arms meet in a sharp inside corner (the polish fillets it, M7).
 */
function carrierOutline(): Vec2[] {
  const a = Math.acos((HUB_R - ARM_R) / cd);
  const out: Vec2[] = [];
  const cross = (p: Vec2, d: Vec2, q: Vec2, e: Vec2): Vec2 => {
    const den = d[0] * e[1] - d[1] * e[0];
    const t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / den;
    return [p[0] + d[0] * t, p[1] + d[1] * t];
  };
  for (let k = 0; k < nP; k++) {
    const th = (k * TAU) / nP;
    const C = polar(cd, th);
    out.push(...arcPts(C[0], C[1], ARM_R, th - a, th + a, Math.PI / 24));
    // this arm's upper tangent meets the next arm's lower tangent
    const th2 = th + TAU / nP;
    const C2 = polar(cd, th2);
    const p = polar(ARM_R, th + a, C[0], C[1]);
    const d: Vec2 = [p[0] - polar(HUB_R, th + a)[0], p[1] - polar(HUB_R, th + a)[1]];
    const q = polar(ARM_R, th2 - a, C2[0], C2[1]);
    const e: Vec2 = [q[0] - polar(HUB_R, th2 - a)[0], q[1] - polar(HUB_R, th2 - a)[1]];
    out.push(cross(p, d, q, e));
  }
  return out;
}

// Backlash: the ring gaps are cut BACKLASH wider on each flank (0.12 mm on a module 4 tooth), as a cut ring would be.
// The model check counts any planet vertex in the ring body as an overlap, so a zero-backlash internal mesh cannot pass it.
export const BACKLASH = 0.12;
const ringGear = P.ringGear("ring", zr, m, { role: "ground", fixed: [0, 0, 0], rim: 94, name: "Ring gear, 35 teeth (held)" });
ringGear.shape.holes = ringGear.shape.holes.map((h) => offsetPoly(h, BACKLASH));

const sun = P.gear("sun", zs, m, { role: "driver", at: "O", spin: (s) => s.a as number, bore: false, name: "Sun gear, 13 teeth" });
// keyed bore that sizes the input shaft (A3): Ø10
sun.shape.holes = [circle(6, 0, 0, 36)];
const planets = [0, 1, 2].map((k) => {
  const g = P.gear(`planet${k}`, zp, m, { role: "link", dz: k ? 0.2 : 0, at: `C${k}`, spin: (s) => s.b as number, bore: false, name: `Planet gear ${k + 1}, 11 teeth` });
  return g;
});
const plate = (id: string, layer: number, name: string, extra: { twin?: string; dz?: number } = {}) =>
  P.custom(id, carrierOutline(), { role: "output", layer, at: "O", spin: (s) => s.c as number, name, marks: [ring(HUB_R - 2.5)], ...extra });

export default defineMechanism({
  id: "planetary",
  input: { kind: "rotary", part: "sun" },
  parts: [
    ringGear,
    sun,
    ...planets,
    plate("carrier", -1, "Carrier, lower plate"),
    plate("carrier-top", 1, "Carrier, upper plate", { twin: "carrier", dz: TOP_DZ }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 3 }),
    ...[0, 1, 2].map((k) => P.cap(`pC${k}`, -1, 5.5, { at: `C${k}`, span: 2 })),
  ],
  solve(u) {
    const c = u;
    const a = u / kC;
    // planet turn from the ring mesh: relative to the carrier +(zr/zp) times the ring's (-c), so absolute c (1 - zr/zp)
    const b = c * (1 - zr / zp);
    const pts: Record<string, Vec2> = { O: [0, 0] };
    for (let k = 0; k < nP; k++) pts[`C${k}`] = polar(cd, c + (k * TAU) / nP);
    return { pts, a, b, c };
  },
  paths: ["C0"],
  vel: ["C0", "C1", "C2"],
  forces: (s, u) => [
    { type: "spin", c: [0, 0], r: rs + 8, key: "input", z: 1.2 },
    { type: "spin", c: [0, 0], r: cd + ARM_R + 6, key: "output", z: 1.2 },
    // the tooth force at the sun-planet mesh acts along the line of action: tangent to both base circles, through the pitch point
    { type: "axial", a: polar(rs * Math.cos(alpha), u + alpha), b: polar(rp * Math.cos(alpha), u + Math.PI + alpha, ...s.pts.C0!), key: "line of action" },
  ],
  angles: (_s, u) => [{ type: "angle", c: [0, 0], a: [cd + ARM_R + 10, 0], b: polar(cd + ARM_R + 10, u), r: cd + 6, key: "carrier", value: ((u % TAU) * 180) / Math.PI, z: 1.2 }],
  plot: { label: "Sun angle", unit: "°", f: (_s, u) => (u / kC) * (180 / Math.PI) },
});
