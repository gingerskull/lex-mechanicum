// A composite track's plate (a pin-in-slot whose slot is `track`): a plate on the base following the track, the groove
// cut along its centre line, a hardened liner in each wall, a relief past each end and a felt oiler in the start's
// relief. Plane geometry in the track's own coordinates (src/kin/blocks/track.ts, the same geometry the K1 residual and
// the target-path block read); the contact kit (rules/contacts/track.ts) places it under the follower.
import type { Vec2 } from "../../core/geom";
import { hullOf } from "../../hardware/primitives";
import { type Track, trackAt, trackOffset } from "../../kin/blocks/track";
import { signedArea } from "./common";

/**
 * The follower and its plate, mm: a stud-type track roller Ø`D` x `B` on a hardened stud Ø`d`, a bronze thrust washer
 * `washer` thick over the roller, the groove `play` wider than the roller each side, a liner `liner` thick in each wall,
 * `wall` of plate beyond each liner, a `relief` past each end, the groove's floor `under` below the roller and the plate
 * `floor` thick under the groove; the roller stands `proud` above the plate's top, which keeps `gap` from every moving
 * part over it.
 */
export const TRACK_FOLLOWER = { D: 16, d: 6, B: 7, washer: 1.2, play: 0.2, liner: 1.5, wall: 10, relief: 4, under: 2, floor: 4, proud: 0.3, gap: 1.5 } as const;

/** The levels of the follower and its plate from the plate's top (along the track's normal). */
export function trackLevels(top: number): { washer: [number, number]; roller: [number, number]; top: number; floor: number; bottom: number } {
  const F = TRACK_FOLLOWER;
  const r1 = top + F.proud;
  const r0 = r1 - F.B;
  const floor = r0 - F.under;
  return { washer: [r1, r1 + F.washer], roller: [r0, r1], top, floor, bottom: floor - F.floor };
}

const add = (a: Vec2, b: Vec2, k = 1): Vec2 => [a[0] + k * b[0], a[1] + k * b[1]];
const dir = (h: number): Vec2 => [Math.cos(h), Math.sin(h)];
const left = (h: number): Vec2 => [-Math.sin(h), Math.cos(h)];

/** Points of an arc about c from angle a0 to a1 (counter-clockwise when a1 > a0), ends excluded, chords within `sag`. */
function arcPts(c: Vec2, r: number, a0: number, a1: number, sag: number): Vec2[] {
  const dTh = r > sag ? 2 * Math.acos(1 - sag / r) : Math.PI / 8;
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / Math.min(dTh, Math.PI / 8)));
  return Array.from({ length: n - 1 }, (_, i) => add(c, dir(a0 + ((a1 - a0) * (i + 1)) / n), r));
}

/**
 * The band `half` each side of the track's centre line, run on straight `ext` past each end and closed by a half round:
 * a counter-clockwise ring. Its inner side is true only where every arc's radius exceeds `half` (see `bandFits`).
 */
export function trackBand(t: Track, half: number, ext: number, sag = 0.01): Vec2[] {
  const a = trackAt(t, 0);
  const b = trackAt(t, t.length);
  const S = add(a.p, dir(a.h), -ext);
  const E = add(b.p, dir(b.h), ext);
  const ring: Vec2[] = [];
  ring.push(add(S, left(a.h), -half), ...trackOffset(t, -half, sag), add(E, left(b.h), -half));
  ring.push(...arcPts(E, half, b.h - Math.PI / 2, b.h + Math.PI / 2, sag));
  ring.push(add(E, left(b.h), half), ...trackOffset(t, half, sag).reverse(), add(S, left(a.h), half));
  ring.push(...arcPts(S, half, a.h + Math.PI / 2, a.h + (3 * Math.PI) / 2, sag));
  const out = ring.filter((p, i) => {
    const q = ring[(i + ring.length - 1) % ring.length]!;
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6;
  });
  return signedArea(out) < 0 ? out.reverse() : out;
}

/** The band of half-width `half` has a true inner side: every arc's radius exceeds it by `margin`. */
export const bandFits = (t: Track, half: number, margin = 0.5): boolean => t.segs.every((g) => g.k === 0 || 1 / Math.abs(g.k) > half + margin);

/** One wall's liner: the strip between offsets o0 and o1 (signed, + left) along the whole track, counter-clockwise. */
function liner(t: Track, o0: number, o1: number): Vec2[] {
  const ring = [...trackOffset(t, o0), ...trackOffset(t, o1).reverse()];
  return signedArea(ring) < 0 ? ring.reverse() : ring;
}

export interface TrackPlate {
  /** The plate's outline: the band round the groove, or the hull of it where an arc is too tight for a band. */
  outline: Vec2[];
  /** The cut along the track: the groove between the liners' outer faces, with its reliefs. */
  groove: Vec2[];
  /** The two liners, left and right. */
  liners: [Vec2[], Vec2[]];
  /** The felt pad in the start's relief. */
  felt: Vec2[];
  /** Screw and dowel centres in the walls beyond the liners. */
  screws: Vec2[];
  dowels: Vec2[];
  /** The groove's width between the liners (the roller's Ø plus its play). */
  width: number;
}

/**
 * The plate for a track: null when an arc is too tight for the groove itself (its radius at most the groove's half
 * width), which no plate can carry.
 */
export function trackPlate(t: Track): TrackPlate | null {
  const F = TRACK_FOLLOWER;
  const w = F.D + 2 * F.play;
  const hw = w / 2 + F.liner;
  const half = hw + F.wall;
  if (!bandFits(t, hw, F.liner)) return null;
  const outline = bandFits(t, half) ? trackBand(t, half, F.relief, 0.05) : hullOf(trackOffset(t, 0, 0.2).map((p): [number, number, number] => [p[0], p[1], half]).concat(ends(t, F.relief, half)));
  const groove = trackBand(t, hw, F.relief);
  const liners: [Vec2[], Vec2[]] = [liner(t, w / 2, hw), liner(t, -hw, -w / 2)];
  // the felt in the start's relief, clear of the roller at the track's start
  const a = trackAt(t, 0);
  const back = (x: number, y: number): Vec2 => add(add(a.p, dir(a.h), -x), left(a.h), y);
  const f0 = F.D / 2 + 1;
  const f1 = f0 + 3;
  const felt = [back(f1, -3), back(f0, -3), back(f0, 3), back(f1, 3)];
  // a screw in each wall near each end, and two dowels diagonally across between them (F1)
  const at = (s: number, side: number): Vec2 => {
    const q = trackAt(t, s);
    return add(q.p, left(q.h), side * (hw + F.wall / 2));
  };
  const L = t.length;
  const screws = [at(0.1 * L, 1), at(0.1 * L, -1), at(0.9 * L, 1), at(0.9 * L, -1)];
  const dowels = [at(0.3 * L, 1), at(0.7 * L, -1)];
  return { outline, groove, liners, felt: signedArea(felt) < 0 ? felt.reverse() : felt, screws, dowels, width: w };
}

/** The ends of the band run on past the track, as circles for a hull. */
function ends(t: Track, ext: number, r: number): [number, number, number][] {
  const a = trackAt(t, 0);
  const b = trackAt(t, t.length);
  const S = add(a.p, dir(a.h), -ext);
  const E = add(b.p, dir(b.h), ext);
  return [[S[0], S[1], r], [E[0], E[1], r]];
}
