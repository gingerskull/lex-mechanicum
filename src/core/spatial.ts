// Geometry of gears and screws whose axes leave the plan plane: bevel pitch cones and their back-cone teeth,
// worm and wheel, helical gears (parallel and crossed), and screw threads. Millimetres and radians; every formula is
// unit-tested against a worked example (tests/core/spatial.test.ts).
import { D2R, TAU, polar, type Vec2 } from "./geom";

/** Standard pressure angle, radians. */
export const ALPHA = 20 * D2R;

// --- bevel gears ---------------------------------------------------------------------------------------------------

/** Pitch cone angles of a bevel pair with z1, z2 teeth and shaft angle sigma (default 90°): tan δ1 = sin Σ / (z2/z1 + cos Σ). */
export function pitchCones(z1: number, z2: number, sigma = Math.PI / 2): [number, number] {
  const d1 = Math.atan2(Math.sin(sigma), z2 / z1 + Math.cos(sigma));
  return [d1, sigma - d1];
}

export interface Bevel {
  /** Outer pitch diameter d = z m and pitch cone angle δ. */
  d: number;
  delta: number;
  /** Outer cone distance Re = d / (2 sin δ), apex to the outer pitch circle along the cone. */
  Re: number;
  /** Back cone radius rv = d / (2 cos δ) and the virtual (equivalent spur) tooth count zv = z / cos δ (Tredgold). */
  rv: number;
  zv: number;
  /** Face width b and the scale of the inner end, (Re - b) / Re: the taper of the toothed frustum. */
  b: number;
  inner: number;
  /** Axial distance from the apex to the outer pitch circle (Re cos δ), and the toothed length along the axis (b cos δ). */
  apex: number;
  axial: number;
}

/** One gear of a bevel pair at outer module m; face width b, by default Re / 3 (the practical maximum). */
export function bevel(z: number, m: number, delta: number, b?: number): Bevel {
  const d = z * m;
  const Re = d / (2 * Math.sin(delta));
  const w = b ?? Re / 3;
  return { d, delta, Re, rv: d / (2 * Math.cos(delta)), zv: z / Math.cos(delta), b: w, inner: (Re - w) / Re, apex: Re * Math.cos(delta), axial: w * Math.cos(delta) };
}

/**
 * The outer tooth outline of a bevel gear seen along its axis, by Tredgold's approximation: the teeth are those of the
 * virtual spur gear on the back cone (zv teeth, radius rv), laid back onto the gear. A point at distance ρ from the
 * virtual centre lies (ρ - rv) cos δ off the pitch circle radially; arc lengths along the pitch circle are kept.
 */
export function bevelOutline(z: number, m: number, delta: number): Vec2[] {
  const c = Math.cos(delta);
  const r = (z * m) / 2;
  const rv = r / c;
  const zv = z / c;
  // the virtual gear's involute flank: half the tooth's angle at radius ρ (as gearOutline draws a tooth)
  const rb = rv * Math.cos(ALPHA);
  const inv = (a: number) => Math.tan(a) - a;
  const psi = (rho: number) => Math.max(0.004, Math.PI / (2 * zv) + inv(ALPHA) - inv(Math.acos(rb / Math.max(rho, rb))));
  // a point of the virtual tooth at ρ, laid back onto the gear: radius r + (ρ - rv) cos δ, the arc at ρ kept
  const at = (rho: number, a: number, side: number): Vec2 => {
    const R = r + (rho - rv) * c;
    return polar(R, a + (side * psi(rho) * rho) / R);
  };
  const ra = rv + m;
  const rf = rv - 1.25 * m;
  const N = 5;
  const pts: Vec2[] = [];
  for (let k = 0; k < z; k++) {
    const a = (k * TAU) / z;
    for (let i = 0; i <= N; i++) pts.push(at(rf + ((ra - rf) * i) / N, a, -1));
    for (let i = N; i >= 0; i--) pts.push(at(rf + ((ra - rf) * i) / N, a, 1));
    const Rf = r - 1.25 * m * c;
    const a0 = Math.atan2(pts[pts.length - 1]![1], pts[pts.length - 1]![0]);
    const a1 = a + TAU / z - (psi(rf) * rf) / Rf;
    for (let i = 1; i < 4; i++) pts.push(polar(Rf, a0 + ((((a1 - a0 + 3 * Math.PI) % TAU) - Math.PI) * i) / 4));
  }
  return pts;
}

// --- worm and wheel ------------------------------------------------------------------------------------------------

export interface Worm {
  /** Axial pitch p = π m, lead L = z1 p, worm pitch diameter d1 = q m, wheel pitch diameter d2 = z2 m. */
  p: number;
  lead: number;
  d1: number;
  d2: number;
  /** Lead angle γ = atan(z1 / q) = atan(L / (π d1)). */
  gamma: number;
  /** Centre distance a = m (q + z2) / 2. */
  a: number;
  /** Ratio: wheel turns per worm turn, z1 / z2. */
  ratio: number;
  /** The wheel's helix lead (its teeth lie at the lead angle γ): π d2 / tan γ. */
  wheelLead: number;
}

/** A worm pair: axial module m, z1 starts, z2 wheel teeth, diameter factor q. */
export function worm(m: number, z1: number, z2: number, q: number): Worm {
  const p = Math.PI * m;
  const d1 = q * m;
  const d2 = z2 * m;
  const gamma = Math.atan(z1 / q);
  return { p, lead: z1 * p, d1, d2, gamma, a: (m * (q + z2)) / 2, ratio: z1 / z2, wheelLead: (Math.PI * d2) / Math.tan(gamma) };
}

/**
 * The section of a worm square to its axis (an Archimedean worm: straight 20° flanks in its axial section), as a polar
 * outline of n points: the radius at angle θ is the axial profile's radius at x = θ lead / 2π, with a tooth centred on
 * θ = 0 for each start. Turned by 2π x / lead along the axis (right hand counter-clockwise), it sweeps the thread.
 */
export function wormSection(m: number, starts: number, d1: number, n = 96): Vec2[] {
  const p = Math.PI * m;
  const rp = d1 / 2;
  const ra = rp + m;
  const rf = rp - 1.25 * m;
  const t = Math.tan(ALPHA);
  const lead = starts * p;
  return Array.from({ length: n }, (_, i): Vec2 => {
    const th = (i * 2 * Math.PI) / n;
    let x = (th * lead) / (2 * Math.PI);
    x = x - p * Math.round(x / p);
    const r = Math.max(rf, Math.min(ra, rp + (p / 4 - Math.abs(x)) / t));
    return [r * Math.cos(th), r * Math.sin(th)];
  });
}

// --- helical gears -------------------------------------------------------------------------------------------------

/** Transverse module mt = mn / cos β. */
export const transverseModule = (mn: number, beta: number): number => mn / Math.cos(beta);

/** Transverse pressure angle: tan αt = tan αn / cos β. */
export const transversePressure = (beta: number, alphaN = ALPHA): number => Math.atan(Math.tan(alphaN) / Math.cos(beta));

/** Pitch diameter of a helical gear, z mn / cos β. */
export const helicalDiameter = (z: number, mn: number, beta: number): number => (z * mn) / Math.cos(beta);

/** Centre distance of a parallel helical pair, mn (z1 + z2) / (2 cos β). */
export const helicalCentres = (z1: number, z2: number, mn: number, beta: number): number => (mn * (z1 + z2)) / (2 * Math.cos(beta));

/** Centre distance of crossed helical gears, (d1 + d2) / 2 with d = z mn / cos β; the shaft angle is β1 + β2 (same hand). */
export const crossedCentres = (z1: number, beta1: number, z2: number, beta2: number, mn: number): number =>
  (helicalDiameter(z1, mn, beta1) + helicalDiameter(z2, mn, beta2)) / 2;

/** Helix lead of a gear of pitch diameter d at helix angle β: π d / tan β (signed by the hand: + right, - left). */
export const helixLead = (d: number, beta: number, hand: 1 | -1 = 1): number => (hand * Math.PI * d) / Math.tan(beta);

/** Angle the transverse profile turns through over an axial length w for a lead L: 2π w / L. */
export const twist = (w: number, lead: number): number => (TAU * w) / lead;

// --- screws --------------------------------------------------------------------------------------------------------

/** Lead of a screw: starts x pitch. */
export const screwLead = (p: number, starts = 1): number => starts * p;

/** Lead angle at the mean diameter: atan(L / (π dm)). */
export const leadAngle = (lead: number, dm: number): number => Math.atan(lead / (Math.PI * dm));

/** Axial travel of the nut for a screw turned through θ radians. */
export const travel = (lead: number, theta: number): number => (lead * theta) / TAU;

/** A screw self-locks when the friction angle atan μ exceeds the lead angle. */
export const selfLocking = (lead: number, dm: number, mu: number): boolean => Math.atan(mu) > leadAngle(lead, dm);

export interface Thread {
  d: number;
  p: number;
  /** Pitch (mean) diameter d2, minor diameter of the screw d3, minor diameter of the nut D1. */
  d2: number;
  d3: number;
  D1: number;
  /** Flank angle (included), radians. */
  angle: number;
}

/** ISO 2904 trapezoidal thread Tr d x p (30° flanks): d2 = d - p/2, d3 = d - (p + 2 ac), D1 = d - p. */
export function trapezoidal(d: number, p: number): Thread {
  const ac = p <= 1.5 ? 0.15 : p <= 5 ? 0.25 : p <= 12 ? 0.5 : 1;
  return { d, p, d2: d - p / 2, d3: d - (p + 2 * ac), D1: d - p, angle: 30 * D2R };
}

/** ISO metric coarse thread M d x p (60° flanks): d2 = d - 0.6495 p, d3 = d - 1.2269 p, D1 = d - 1.0825 p. */
export function metric(d: number, p: number): Thread {
  return { d, p, d2: d - 0.649519 * p, d3: d - 1.226869 * p, D1: d - 1.082532 * p, angle: 60 * D2R };
}
