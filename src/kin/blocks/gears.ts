// Gear blocks: mesh (parallel, crossed, internal, rack, non-circular) and the Willis train.

export interface MeshSpec {
  za: number;
  zb: number;
  /** Internal mesh: b is a ring gear, the two turn the same way. */
  internal?: boolean;
  /** Crossed axes (helical, worm, hypoid, bevel): the sense follows the hand, given as the sign. */
  sign?: 1 | -1;
}

/** Angle of b per angle of a: −za/zb for an external mesh, +za/zb for an internal one; crossed meshes take `sign`. */
export function meshRatio(m: MeshSpec): number {
  const mag = m.za / m.zb;
  if (m.sign !== undefined) return m.sign * mag;
  return m.internal ? mag : -mag;
}

/** Centre distance of a spur pair of module `mod`: (za + zb) mod / 2 external, (zb − za) mod / 2 internal. */
export const centreDistance = (m: MeshSpec, mod: number): number => (((m.internal ? m.zb - m.za : m.za + m.zb) * mod) / 2);

/**
 * Angle of b that makes the teeth mesh, for an external pair with a tooth of a on the line of centres at θa = 0:
 * b then has a gap there. θb = θb0 − (za/zb) θa afterwards.
 */
export const meshPhase = (zb: number): number => Math.PI - Math.PI / zb;

/** Rack and pinion: rack travel for a pinion turn (pitch radius r). */
export const rackTravel = (r: number, theta: number): number => r * theta;

/**
 * Equal elliptical gears on their foci (eccentricity e, centre distance 2a): angle of the mate from the angle of the
 * driver, θ2 = 2 atan2((1+e) sin(φ/2), (1−e) cos(φ/2)). The driver φ is measured from its perihelion.
 */
export function ellipticalAngle(e: number, phi: number): number {
  const half = phi / 2;
  const raw = 2 * Math.atan2((1 + e) * Math.sin(half), (1 - e) * Math.cos(half));
  // same turn as φ
  const turns = Math.round((phi - raw) / (2 * Math.PI));
  return raw + turns * 2 * Math.PI;
}

/** dθ2/dφ of the equal elliptical pair: (1−e²) / (1 + e² − 2e cos φ), which is r1/r2 of the pitch curves. */
export const ellipticalRatio = (e: number, phi: number): number => (1 - e * e) / (1 + e * e - 2 * e * Math.cos(phi));

export type WillisPort = "sun" | "ring" | "carrier";

export interface WillisSpec {
  /** Sun and ring teeth: the fixed-carrier ratio is i0 = −zr / zs (planet idlers of any count in between). */
  zs: number;
  zr: number;
  zp?: number;
}

/**
 * Willis (tabular) method for a simple planetary set: (ωs − ωc) / (ωr − ωc) = −zr / zs. Two ports are given, the third
 * is solved; a given port may be 0 (a brake). All values are angles (or speeds): the relation is linear.
 */
export function willis(spec: WillisSpec, known: Partial<Record<WillisPort, number>>): Record<WillisPort, number> & { planet: number | null } {
  const i0 = -spec.zr / spec.zs;
  let { sun, ring, carrier } = known;
  const given = [sun, ring, carrier].filter((v) => v !== undefined).length;
  if (given !== 2) throw new Error("willis needs exactly two known ports");
  if (carrier === undefined) {
    // sun − c = i0 (ring − c)  →  c (1 − i0)... solve: sun − i0 ring = c (1 − i0)
    carrier = (sun! - i0 * ring!) / (1 - i0);
  } else if (sun === undefined) {
    sun = carrier + i0 * (ring! - carrier);
  } else {
    ring = carrier + (sun - carrier) / i0;
  }
  const planet = spec.zp ? carrier - (spec.zs / spec.zp) * (sun! - carrier) : null;
  return { sun: sun!, ring: ring!, carrier, planet };
}

export type RavigneauxMember = "sunS" | "sunL" | "carrier" | "ring";

export interface RavigneauxSpec {
  /** Teeth: small sun, large sun, short pinion, long pinion, ring. */
  zSs: number;
  zSl: number;
  zPs: number;
  zPl: number;
  zR: number;
}

/**
 * A Ravigneaux set (two suns, short and long pinions on one carrier, one ring) has two degrees of freedom:
 * (ωR − ωc) = +zSs/zR (ωSs − ωc) (small sun, short, long, ring) and (ωR − ωc) = −zSl/zR (ωSl − ωc) (large sun, long,
 * ring). The input member turns `input`; one member is held (angle 0), or two are locked (one angle). Returns every
 * member's angle and the pinions' turns on their own pins (relative to the carrier).
 */
export function ravigneaux(
  spec: RavigneauxSpec,
  input: number,
  inputMember: RavigneauxMember,
  held: RavigneauxMember | null,
  locked: [RavigneauxMember, RavigneauxMember] | null,
): Record<RavigneauxMember, number> & { short: number; long: number } {
  const ks = spec.zSs / spec.zR;
  const kl = -spec.zSl / spec.zR;
  // unknowns [Ss, Sl, c, R]: two Willis rows, the input row and a hold or lock row
  const A: number[][] = [
    [-ks, 0, ks - 1, 1],
    [0, -kl, kl - 1, 1],
  ];
  const b = [0, 0];
  const idx: Record<RavigneauxMember, number> = { sunS: 0, sunL: 1, carrier: 2, ring: 3 };
  const row = (m: RavigneauxMember): number[] => [0, 1, 2, 3].map((k) => (k === idx[m] ? 1 : 0));
  A.push(row(inputMember));
  b.push(input);
  if (locked) {
    const r = row(locked[0]);
    r[idx[locked[1]]] = -1;
    A.push(r);
  } else if (held) A.push(row(held));
  else throw new Error("ravigneaux needs a held member or a lock");
  b.push(0);
  const x = solve4(A, b);
  const [sunS, sunL, carrier, ring] = x as [number, number, number, number];
  const short = -(spec.zSs / spec.zPs) * (sunS - carrier);
  const long = -(spec.zPs / spec.zPl) * short;
  return { sunS, sunL, carrier, ring, short, long };
}

/** Gaussian elimination with partial pivoting for a small square system. */
function solve4(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]!]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r]![c]!) > Math.abs(M[p]![c]!)) p = r;
    if (Math.abs(M[p]![c]!) < 1e-12) throw new Error("ravigneaux: the held or locked members leave the set free");
    [M[c], M[p]] = [M[p]!, M[c]!];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r]![c]! / M[c]![c]!;
      for (let k = c; k <= n; k++) M[r]![k]! -= f * M[c]![k]!;
    }
  }
  return M.map((r, i) => r[n]! / r[i]!);
}
