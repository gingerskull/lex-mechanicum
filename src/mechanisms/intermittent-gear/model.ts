// Intermittent gear (catalogue "intermittent-gear"): module 4, a driver with 5 of its 20 teeth cut and a plain locking
// disc, a driven gear of 20 full teeth and a locking plate with 4 concave arcs, centre distance m(z1 + z2)/2 = 80.
// While the driver's teeth are in mesh the driven gear turns 1:1 the other way for 90° of driver rotation (5 of 20
// pitches); for the other 270° the disc rides in a concave arc of the plate and holds it. Teeth and locking work in
// two planes: disc and plate on layer 0, gears on layer 1, each pair on one keyed shaft.
// K6: the catalogue's disc radius 36 and arc radius 36.5 are used as given. The plate lobes between the arcs are
// cut to a radius of 45 so the arcs have material to lock on; the disc is relieved where those lobes pass it.
import { TAU, arcPts, circle, dBore, polar, wrap, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

export const m = 4;
export const z1 = 20;
export const z2 = 20;
/** Teeth actually cut on the driver. */
export const nT = 5;
export const cd = (m * (z1 + z2)) / 2;
const rp = (m * z1) / 2;
const alpha = (20 * Math.PI) / 180;
/** Locking disc radius, locking arc radius (catalogue). */
export const RL = 36;
export const RC = 36.5;
/** Plate lobe radius between the arcs, and the clearance the disc keeps from a lobe. */
export const RO = 45;
const GAP = 1.2;
/** One pitch, the driver turn for which the output moves (nT pitches), and the stops per driven turn. */
const pitch = TAU / z1;
export const sweep = nT * pitch;
export const stops = z2 / nT;
const half = pitch / 2;
/** The driver angle at which the first tooth to enter meets the line of centres, and the one where the last leaves. */
const lo = -(nT - 1) * pitch - half;
const hi = half;
/** u = 0 is the middle of the mesh. */
const th0 = (lo + hi) / 2;
/** Driven angle in the dwell (the clamp at hi): the plate's arcs face the driver there. */
const base = Math.PI - Math.PI / z2;
const bDwell = base - hi;

/** Plate outline in the driven gear's frame (it turns with the gear on one key): the arcs face the driver in the dwell. */
const off = Math.PI - bDwell;
export function plateOutline(): Vec2[] {
  const dl = Math.acos((cd * cd + RC * RC - RO * RO) / (2 * cd * RC));
  const gm = Math.atan2(RC * Math.sin(dl), cd - RC * Math.cos(dl));
  const out: Vec2[] = [];
  const stp = TAU / stops;
  for (let j = 0; j < stops; j++) {
    const b = off + j * stp;
    const C = polar(cd, b);
    // the concave arc, centred on the driver axis as seen from the plate
    out.push(...arcPts(C[0], C[1], RC, b + Math.PI + dl, b + Math.PI - dl, Math.PI / 60));
    out.push(...arcPts(0, 0, RO, b + gm, b + stp - gm, Math.PI / 36).slice(0, -1));
  }
  return out;
}

/**
 * The disc: radius RL, cut back round the sector where the plate's lobes pass it while the teeth are in mesh. The
 * relief is taken from the plate's real outline swept over the mesh, with GAP of running clearance.
 */
function discOutline(): Vec2[] {
  const plate = plateOutline();
  const N = 720;
  const raw = new Array<number>(N).fill(RL);
  const steps = 60;
  for (let s = 0; s <= steps; s++) {
    const th = lo + ((hi - lo) * s) / steps;
    const b = base - th;
    // plate placed with its arcs facing the driver at the dwell angle, then turned with the driven gear
    const spin = b;
    const co = Math.cos(spin);
    const si = Math.sin(spin);
    for (const q of plate) {
      const x = q[0] * co - q[1] * si + cd;
      const y = q[0] * si + q[1] * co;
      const r = Math.hypot(x, y);
      if (r > RL + GAP + 6) continue;
      // into the disc frame (the driver turned by th)
      const phi = Math.atan2(y, x) - th;
      const w = Math.ceil((GAP + 1.5) / r / (TAU / N)) + 1;
      const k0 = Math.round((((phi % TAU) + TAU) % TAU) / (TAU / N));
      for (let d = -w; d <= w; d++) {
        const k = (((k0 + d) % N) + N) % N;
        raw[k] = Math.min(raw[k]!, Math.max(8, r - GAP));
      }
    }
  }
  // smooth, never above the raw envelope
  let r = raw.slice();
  for (let pass = 0; pass < 6; pass++) r = r.map((v, i) => Math.min(raw[i]!, (r[(i + N - 1) % N]! + 2 * v + r[(i + 1) % N]!) / 4));
  const out: Vec2[] = [];
  for (let i = 0; i < N; i += 2) out.push(polar(r[i]!, (i / N) * TAU));
  return out;
}

/**
 * The end teeth are shortened to a tip radius (K6: real mutilated gears thin or shorten them): the last of the five
 * to enter would meet the stopped gear's teeth on the way in, the first would meet them on the way out.
 */
const ENTRY_TIP = 38.8;
const EXIT_TIP = 39.5;
const trim = (pts: Vec2[]): Vec2[] =>
  pts.map((q): Vec2 => {
    const r = Math.hypot(q[0], q[1]);
    const a = wrap(Math.atan2(q[1], q[0]));
    const k = Math.round(a / pitch);
    const tip = k === 0 ? EXIT_TIP : k === nT - 1 ? ENTRY_TIP : Infinity;
    return Math.abs(a - k * pitch) < half && r > tip ? polar(tip, Math.atan2(q[1], q[0])) : q;
  });

const driver = P.gear("driver", z1, m, { role: "driver", layer: 1, at: "O1", spin: (s) => s.th as number, bore: false, teeth: (k) => k < nT, name: "Driver, 5 of 20 teeth" });
const driven = P.gear("driven", z2, m, { role: "output", layer: 1, at: "O2", spin: (s) => s.b as number, bore: false, name: "Driven gear, 20 teeth" });
const disc = P.custom("disc", discOutline(), { role: "driver", at: "O1", spin: (s) => s.th as number, marks: [circle(24, 0, 0, 48)], name: "Locking disc" });
const plate = P.custom("plate", plateOutline(), { role: "output", at: "O2", spin: (s) => s.b as number, marks: [circle(30, 0, 0, 48)], name: "Locking plate" });
driver.shape.outer = trim(driver.shape.outer);
// keyed bores that size the shafts (A3): Ø8 on a D-flat, which transmits the torque itself (A5, F3)
driver.shape.holes = [dBore(5)];
disc.shape.holes = [dBore(5)];
driven.shape.holes = [dBore(5)];
plate.shape.holes = [dBore(5)];

/** Driver angle clamped to the mesh window, plus whole turns: the driver angle that has moved the driven gear. */
function eff(th: number): number {
  const phi = wrap(th);
  const k = Math.floor((th + Math.PI) / TAU);
  return Math.max(lo, Math.min(hi, phi)) - lo + k * sweep;
}

export default defineMechanism({
  id: "intermittent-gear",
  input: { kind: "rotary", part: "driver" },
  parts: [driver, disc, driven, plate, P.cap("p1", -1, 7, { fixed: [0, 0, 0], accent: true, span: 3 }), P.cap("p2", -1, 7, { fixed: [cd, 0, 0], span: 3 })],
  traceZ: 8.5,
  solve(u): Solved {
    const th = u + th0;
    // the driven gear turns the other way at the gear ratio z1 / z2 while the teeth are in mesh
    const b = base - (eff(th) + lo) * (z1 / z2);
    const phi = wrap(th);
    const engaged = phi > lo && phi < hi;
    return { pts: { O1: [0, 0], O2: [cd, 0], Tp: polar(rp, th) }, th, b, engaged };
  },
  paths: ["Tp"],
  vel: ["Tp"],
  forces(s) {
    const out: ReturnType<NonNullable<Parameters<typeof defineMechanism>[0]["forces"]>> = [{ type: "spin", c: [0, 0], r: rp + 12, key: "input" }];
    // the tooth force acts along the line of action: tangent to both base circles, through the pitch point
    if (s.engaged) out.push({ type: "axial", a: polar(rp * Math.cos(alpha), alpha), b: polar(rp * Math.cos(alpha), Math.PI + alpha, cd, 0), key: "line of action" });
    return out;
  },
  angles: (s) => (s.engaged ? [{ type: "angle", c: [rp, 0], a: [rp, 22], b: polar(22, Math.PI / 2 + alpha, rp, 0), r: 18, key: "pressure angle", value: 20 }] : []),
  plot: { label: "Driven angle", unit: "°", f: (s, u) => (eff(u + th0) - eff(th0)) * (z1 / z2) * (180 / Math.PI) },
});
