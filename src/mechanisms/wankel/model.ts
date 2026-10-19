// Wankel rotary engine (catalogue "wankel"): a curved-triangle rotor with an internal gear of 45 teeth turns on an
// eccentric (e = 15) round a fixed external gear of 30 teeth on the shaft's axis, module 2, so the rotor turns one third of
// the shaft's speed (rotor angle t/3, the gears' ratio 30:45 = 2:3) and its centre goes round the shaft on radius e. Each
// apex, R = 103 from the rotor's centre, traces the housing's epitrochoid x = R cos a + e cos 3a, y = R sin a + e sin 3a
// (a = t/3, apex k a further k 120°), K = R / e = 6.9; each of the three chambers breathes once every 1080° of shaft. The
// shaft turns the way the rotor does. One cycle is one rotor turn, three shaft turns: the rotor, the housing's bore and the
// gears are then exactly back, and every apex has been through every part of the bore (K2).
// The rotor is drawn as the catalogue says, with flanks as arcs slightly inside the inner envelope: each flank an arc
// about the opposite apex through the two apexes (a Reuleaux triangle), apexes at R - 0.4 (an apex seal's wear); the
// housing's bore is the epitrochoid itself. The rotor gear's cavity is rotated PHASE in the rotor frame so the gears' teeth
// interleave at t = 0 (found by sliding it against the fixed gear), and cut 0.12 mm backlash, as a cut gear would be (K6).
// The rotor is two plates, the toothed ring plate on layer 0 and a web on layer 2 that carries its bearing on the eccentric
// journal, bolted together at the apexes round the crank web (layer 1, plated 4 mm up under the journal), polish.
import { D2R, TAU, arcPts, circle, offsetPoly, polar, gearOutline, roundedPoly, xf, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 2;
export const zf = 30;
export const zr = 45;
export const R = 103;
export const e = 15;
const RA = R - 0.4;
/** The rotor gear's cavity phase in the rotor frame at t = 0 (degrees): teeth interleave with the fixed gear's. */
const PHASE = 3.849 * D2R;
const BACKLASH = 0.12;
/** Flank arc radius over the apex-to-apex side: 1 is the Reuleaux triangle, larger is flatter. */
const FLANK = 1.25;
/** The web's bore for the rotor bearing on the eccentric (6804, OD 32). */
export const BORE_R = 16;
export const APEX = RA;

/** The housing's bore: the epitrochoid traced by the apexes. */
const bore: Vec2[] = Array.from({ length: 360 }, (_, i): Vec2 => {
  const a = (i / 360) * TAU;
  return [R * Math.cos(a) + e * Math.cos(3 * a), R * Math.sin(a) + e * Math.sin(3 * a)];
});

/** The curved-triangle rotor outline about its centre: apex k at k 120°, flanks arcs about the opposite apex. */
function rotorOutline(r: number): Vec2[] {
  const out: Vec2[] = [];
  const side = r * Math.sqrt(3);
  const rho = FLANK * side;
  for (let k = 0; k < 3; k++) {
    const a0 = (k * TAU) / 3;
    const a1 = a0 + TAU / 3;
    const p0 = polar(r, a0);
    const p1 = polar(r, a1);
    const mid: Vec2 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    const dm = Math.hypot(mid[0], mid[1]);
    const dc = Math.sqrt(rho * rho - (side / 2) * (side / 2));
    // the arc's centre lies on the far side of the rotor centre from the flank's middle
    const c: Vec2 = [mid[0] - (mid[0] / dm) * dc, mid[1] - (mid[1] / dm) * dc];
    const t0 = Math.atan2(p0[1] - c[1], p0[0] - c[0]);
    let t1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]);
    while (t1 < t0) t1 += TAU;
    out.push(...arcPts(c[0], c[1], rho, t0, t1, Math.PI / 360).slice(0, -1));
  }
  return out;
}

/** The web: a hub round the bearing and three tapered arms to the apexes, the way a carrier is (the gears show between them). */
const HUB_R = 24;
const ARM_R = 10;
const ARM_L = 80;
function spider(): Vec2[] {
  const a = Math.acos((HUB_R - ARM_R) / ARM_L);
  const cross = (p: Vec2, d: Vec2, q: Vec2, e2: Vec2): Vec2 => {
    const den = d[0] * e2[1] - d[1] * e2[0];
    const t = ((q[0] - p[0]) * e2[1] - (q[1] - p[1]) * e2[0]) / den;
    return [p[0] + d[0] * t, p[1] + d[1] * t];
  };
  const out: Vec2[] = [];
  for (let k = 0; k < 3; k++) {
    const th = (k * TAU) / 3;
    const C = polar(ARM_L, th);
    out.push(...arcPts(C[0], C[1], ARM_R, th - a, th + a, Math.PI / 24));
    const th2 = th + TAU / 3;
    const C2 = polar(ARM_L, th2);
    const p = polar(ARM_R, th + a, C[0], C[1]);
    const d: Vec2 = [p[0] - polar(HUB_R, th + a)[0], p[1] - polar(HUB_R, th + a)[1]];
    const q = polar(ARM_R, th2 - a, C2[0], C2[1]);
    const e2: Vec2 = [q[0] - polar(HUB_R, th2 - a)[0], q[1] - polar(HUB_R, th2 - a)[1]];
    out.push(cross(p, d, q, e2));
  }
  return out;
}

const outer = rotorOutline(RA);
const cavity = offsetPoly(xf(gearOutline(zr, m, 1.25, 1), [0, 0, PHASE]), BACKLASH);
const rotor = P.custom("rotor", outer, { role: "output", layer: 0, at: "E", spin: (s) => s.rho as number, holes: [cavity], name: "Rotor, ring plate with 45 internal teeth" });
rotor.z = zr;
rotor.m = m;
const web = P.custom("rotorWeb", spider(), { role: "output", layer: 2, thick: 9.6, at: "E", spin: (s) => s.rho as number, holes: [circle(BORE_R, 0, 0, 48)], name: "Rotor web" });
const fgear = P.gear("fgear", zf, m, { role: "ground", layer: 0, fixed: [0, 0, 0], bore: false, name: "Fixed gear, 30 teeth" });
fgear.shape.holes = [circle(6.2, 0, 0, 36)];
// The crank web turns with the shaft: a stadium round the shaft and the journal, keyed to the shaft; the journal (the polish's,
// a pin on the web at E) carries the rotor web's bearing.
const crank = P.custom("crank", roundedPoly([[0, 0], [e, 0]], 21), { role: "driver", layer: 1, dz: 4, at: "O", spin: (s) => s.th as number, holes: [circle(6, 0, 0, 36)], name: "Crank web" });
const housing = P.custom("housing", [...roundRectPts()], { role: "ground", layer: 0, fixed: [-148, 0, 0], holes: [bore.map((p): Vec2 => [p[0] + 148, p[1]])], name: "Housing, epitrochoid bore" });

function roundRectPts(): Vec2[] {
  const [x0, y0, x1, y1] = [-120 + 148 - 30, -118, 120 + 148 + 30, 118];
  const r = 22;
  const pts: Vec2[] = [];
  for (const [cx, cy, a0] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI], [x1 - r, y0 + r, (3 * Math.PI) / 2]] as const) pts.push(...arcPts(cx, cy, r, a0, a0 + Math.PI / 2, Math.PI / 24));
  return pts;
}

export default defineMechanism({
  id: "wankel",
  input: { kind: "rotary", part: "crank" },
  parts: [housing, fgear, rotor, web, crank, P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 })],
  solve(u) {
    // one cycle is one rotor turn: three shaft turns
    const th = 3 * u;
    const E = polar(e, th);
    const pts: Record<string, Vec2> = { O: [0, 0], E };
    for (let k = 0; k < 3; k++) pts[`A${k}`] = polar(R, u + (k * TAU) / 3, E[0], E[1]);
    return { pts, th, rho: u };
  },
  paths: ["A0"],
  vel: ["A0"],
  forces: () => [
    { type: "spin", c: [0, 0], r: 38, key: "input", z: 1.2 },
    { type: "spin", c: [0, 0], r: 56, key: "output", z: 1.2 },
  ],
  plot: { label: "Rotor angle", unit: "°", f: (s) => ((s.rho as number) * 180) / Math.PI },
});
