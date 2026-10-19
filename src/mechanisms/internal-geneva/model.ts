// Internal Geneva drive (catalogue "internal-geneva"): 4 slots, c 40, crank a = c sin(π/n) = 28.28, slot mouth radius
// c cos(π/n) = 28.28, the slots open inward. The pin is in a slot while the crank turns 270° and the wheel turns the same
// way through 90°; for the other 90° the pin passes through the middle and a locking sector holds the wheel. The crank
// axis sits in the wheel's material, so the build departs from the catalogue's single cup (K6, all deliberate):
// - the wheel is a ring carried on its rim by three flanged rollers on dead axles (as the internal gear pair), the crank
//   hangs above it on a stud held from a bridge: no shaft crosses the wheel plane;
// - the wheel is two plates turning as one: the slot plate (layer 0) takes the pin's roller, the locking plate (layer 1,
//   a twin of it) lies in the crank's plane. Its opening is the crank swept through the cycle, 1 mm clear, so the
//   concave locking arcs come out of the sweep of the convex sector (radius 16, opposite the pin);
// - the input is turned by hand (`manual`): a motor needs a shaft rising from the base at O, through the wheel.
// The pin is the catalogue's Ø8 in a slot 8.2 wide, so each mouth has a 1.2 mm lead-in.
import { TAU, arcPts, circle, offsetPoly, polar, taper, wrap, xf, type Vec2 } from "../../core/geom";
import { rayHit } from "../../core/poly";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

export const n = 4;
export const c = 40;
export const a = c * Math.sin(Math.PI / n);
/** Pin radius and slot half-width (Ø8 in 8.2). */
export const pr = 4;
export const hw = 4.1;
/** Plate radius, carrier rollers and their angles. */
export const RIM = 88;
export const ROLLER_R = 14;
export const ROLLER_ANGLES = [90, 210, 330].map((d) => (d * Math.PI) / 180);
/** Crank boss radii, locking sector radius and half-angle. */
export const CRANK_R: [number, number] = [12, 7];
export const rs = 16;
const gam = (70 * Math.PI) / 180;
/** Locking plate clearance round the swept crank. */
export const LOCK_CLR = 1;
/** Slot plate central opening, slot mouth lead-in. */
export const Rc = 30;
const LEAD = 1.2;
const step = TAU / n;
/** Half the crank angle during which the pin is in a slot: 90° + 180°/n. */
const half = Math.PI / 2 + Math.PI / n;

/** Slot plate opening: central circle, n radial slots of half-width w, lead-ins. */
export function cavity(w = hw): Vec2[] {
  const out: Vec2[] = [];
  const root = c + a;
  const x0 = (y: number) => Math.sqrt(Rc * Rc - y * y);
  for (let k = 0; k < n; k++) {
    const th = k * step;
    const xl = x0(w + LEAD);
    out.push(...xf([[xl, -(w + LEAD)], [xl + LEAD, -w], ...arcPts(root, 0, w, -Math.PI / 2, Math.PI / 2, Math.PI / 12), [xl + LEAD, w], [xl, w + LEAD]], [0, 0, th]));
    const a0 = th + Math.asin((w + LEAD) / Rc);
    const a1 = th + step - Math.asin((w + LEAD) / Rc);
    out.push(...arcPts(0, 0, Rc, a0, a1, Math.PI / 30).slice(1, -1));
  }
  return out;
}

/** The crank: shaft at the origin, pin at (a, 0), tapered arm, locking sector behind. */
export function crankOutline(): Vec2[] {
  const arm = taper(a, CRANK_R[0], CRANK_R[1]);
  const out: Vec2[] = [];
  const edges = [Math.PI - gam, Math.PI + gam].map((t) => wrap(t));
  const angles: number[] = [];
  for (let k = 0; k < 360; k++) angles.push(-Math.PI + (k / 360) * TAU);
  for (const e of edges) angles.push(e - 1e-6, e + 1e-6);
  angles.sort((p, q) => p - q);
  for (const ph of angles) {
    let r = rayHit(arm, [0, 0], [Math.cos(ph), Math.sin(ph)]);
    if (!Number.isFinite(r)) r = 0;
    if (Math.abs(wrap(ph - Math.PI)) <= gam + 1e-9) r = Math.max(r, rs);
    out.push(polar(r, ph));
  }
  return out;
}

/** Wheel's total turn at crank angle u: follows the pin through each index, rests between. */
export function wheelAt(u: number): { w: number; engaged: boolean; th: number; psi: number } {
  const th = wrap(u);
  const k = Math.round((u - th) / TAU);
  const engaged = Math.abs(th) < half;
  let g: number;
  let psi = 0;
  if (engaged) {
    const Pp = polar(a, th, c, 0);
    psi = Math.atan2(Pp[1], Pp[0]);
    g = psi;
  } else g = th > 0 ? Math.PI / 4 : -Math.PI / 4;
  return { w: k * (Math.PI / 2) + g, engaged, th, psi };
}

/** Locking plate opening: farthest reach along each ray from W of the crank (grown by clr) swept through a cycle, folded into one quarter. */
export function lockOpening(clr = LOCK_CLR): Vec2[] {
  const body = offsetPoly(crankOutline(), clr);
  const NR = 2880;
  const keep = 8;
  const per = NR / n;
  const f = new Float64Array(per);
  const POSES = 720;
  for (let i = 0; i < POSES; i++) {
    const u = (i / POSES) * TAU;
    const { w } = wheelAt(u);
    const pts = xf(xf(body, [c, 0, u]), [0, 0, -w]);
    for (let e = 0; e < pts.length; e++) {
      const p0 = pts[e]!;
      const p1 = pts[(e + 1) % pts.length]!;
      const a0 = Math.atan2(p0[1], p0[0]);
      const d = wrap(Math.atan2(p1[1], p1[0]) - a0);
      const ex = p1[0] - p0[0];
      const ey = p1[1] - p0[1];
      const j0 = Math.ceil((Math.min(a0, a0 + d) / TAU) * NR);
      const j1 = Math.floor((Math.max(a0, a0 + d) / TAU) * NR);
      for (let j = j0; j <= j1; j++) {
        const ph = (j / NR) * TAU;
        const dx = Math.cos(ph);
        const dy = Math.sin(ph);
        const den = dx * ey - dy * ex;
        if (Math.abs(den) < 1e-12) continue;
        const t = (p0[0] * ey - p0[1] * ex) / den;
        const s = (p0[0] * dy - p0[1] * dx) / den;
        if (t <= 0 || s < -1e-9 || s > 1 + 1e-9) continue;
        const jj = ((j % per) + per) % per;
        if (t > f[jj]!) f[jj] = t;
      }
    }
  }
  const out: Vec2[] = [];
  for (let j = 0; j < NR; j += keep) out.push(polar(f[j % per]!, (j / NR) * TAU));
  return out;
}

const slotPlate = P.custom("wheel", circle(RIM, 0, 0, 120), { role: "output", holes: [cavity()], at: "W", spin: (s) => s.w as number, name: "Slot plate" });
const lockPlate = P.custom("lock", circle(RIM, 0, 0, 120), { role: "output", layer: 1, holes: [lockOpening()], at: "W", spin: (s) => s.w as number, twin: "wheel", name: "Locking plate" });
const crank = P.custom("crank", crankOutline(), {
  role: "driver",
  layer: 1,
  at: "O",
  spin: (s) => s.th as number,
  name: "Crank",
  marks: [circle(CRANK_R[0] - 1.6, 0, 0, 48), circle(CRANK_R[1] - 1.6, a, 0, 36)],
});
/** Hand knob on the roller stud: in the model so the bridge clears its sweep. */
const knob = P.disc("knob", 7, { role: "driver", layer: 2, dz: -4, thick: 12, at: "P", name: "Handle knob", marks: [circle(4.5, 0, 0, 36)] });
const rollers = ROLLER_ANGLES.map((_, k) =>
  P.disc(`roller${k}`, ROLLER_R, { role: "link", at: `R${k}`, spin: (s) => s.roll as number, name: `Carrier roller ${k + 1}`, marks: [circle(ROLLER_R - 3, 0, 0, 36)] }),
);

export default defineMechanism({
  id: "internal-geneva",
  input: { kind: "manual", part: "crank" },
  parts: [
    slotPlate,
    lockPlate,
    crank,
    knob,
    ...rollers,
    // hung from a bridge into the crank only
    P.cap("pO", 1, 7, { fixed: [c, 0, 0], span: 1, top: "hung" }),
    // the roller pin hangs from the crank into the slots
    P.cap("pP", 0, pr, { at: "P", span: 2, over: 0 }),
    ...ROLLER_ANGLES.map((t, k) => P.cap(`pR${k}`, -1, 5.5, { fixed: [...polar(RIM + ROLLER_R, t), 0] as [number, number, number] })),
  ],
  traceZ: 16.8,
  solve(u): Solved {
    const { w, engaged, th, psi } = wheelAt(u);
    // a roller on the rim turns the other way, RIM / ROLLER_R times as fast
    const roll = -w * (RIM / ROLLER_R);
    const pts: Record<string, Vec2> = { W: [0, 0], O: [c, 0], P: polar(a, th, c, 0) };
    ROLLER_ANGLES.forEach((t, k) => (pts[`R${k}`] = polar(RIM + ROLLER_R, t)));
    return { pts, th, w, engaged, psi, roll };
  },
  paths: ["P"],
  vel: ["P"],
  forces(s) {
    const out: ReturnType<NonNullable<Parameters<typeof defineMechanism>[0]["forces"]>> = [{ type: "spin", c: [c, 0], r: a + 16, key: "input" }];
    if (s.engaged) {
      const th = s.th as number;
      const Pp = s.pts.P!;
      out.push({ type: "axial", a: Pp, b: [Pp[0] - 34 * Math.sin(th), Pp[1] + 34 * Math.cos(th)], key: "pin on slot" });
    }
    return out;
  },
  angles(s) {
    if (!s.engaged) return [];
    return [{ type: "angle", c: [0, 0], a: [c, 0], b: s.pts.P!, r: 22, key: "wheel", value: (Math.abs(s.psi as number) * 180) / Math.PI }];
  },
  plot: { label: "Wheel angle", unit: "°", f: (s) => ((s.w as number) * 180) / Math.PI },
});
