// Indexing wheels and their drivers from the record's numbers (D1, K6): the Geneva wheel with its slots, locking arcs and
// small windows, external or internal, and its crank with the locking disc (or sector), the relief that lets the wheel
// turn, the arm above the wheel and the pin down into the slots. Outlines are in the body's plane coordinates: the
// wheel's x points at the crank's centre, the crank's at its pin. Slots, arcs and windows are cut features (D8).
import { TAU, circle, type Vec2 } from "../core/geom";
import type { Feature, Profile } from "../solids/types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** A stadium from radius r0 to r1 along the direction a, half-width h. */
export function radialSlot(a: number, r0: number, r1: number, h: number, n = 12): Vec2[] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const pts: Vec2[] = [];
  for (let i = 0; i <= n; i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / n;
    pts.push([r1 + h * Math.cos(t), h * Math.sin(t)]);
  }
  for (let i = 0; i <= n; i++) {
    const t = Math.PI / 2 + (Math.PI * i) / n;
    pts.push([r0 + h * Math.cos(t), h * Math.sin(t)]);
  }
  return pts.map(([x, y]): Vec2 => [x * c - y * s, x * s + y * c]);
}

const cut = (outer: Vec2[], z0: number, h: number): Feature => ({ mode: "cut", profile: { outer, holes: [] }, op: { op: "extrude", h, steps: 1 }, frame: { o: [0, 0, z0], x: [1, 0, 0], z: [0, 0, 1] } });

export interface IndexerPart {
  profile: Profile;
  thick: number;
  features: Feature[];
}

/**
 * A Geneva wheel (`genevaWheel`): `n` slots of half-width `hw` from radius `slotEnd` out through the rim (`tip`),
 * straddling the line to the crank at ±π/n at the reference (mid-dwell); between them concave locking arcs of radius
 * `lock` + `clear`, centred `c` away; `windows` (small round lightening holes, radius `windowR` at `windowAt`) between the
 * slots, behind the arcs and a wall of at least their own radius clear of them, so the wheel's turn shows without a lattice (M2). Internal (`internal: { rimIn, rimOut }`): a
 * ring whose slots open inward from `slotEnd` (the mouth) to `slotRoot`, the arcs on its inner edge.
 */
export function genevaWheel(sh: Record<string, unknown>): IndexerPart {
  const n = num(sh.n, 4);
  const c = num(sh.c, 110);
  const hw = num(sh.hw, 6);
  const thick = num(sh.thickness, 8);
  const lockR = num(sh.lock, 50) + num(sh.clear, 0.3);
  const f: Feature[] = [];
  const internal = sh.internal as Record<string, unknown> | undefined;
  if (internal) {
    const rIn = num(internal.rimIn, 76);
    const rOut = num(internal.rimOut, 88);
    const mouth = num(sh.slotEnd, 28);
    const root = num(sh.slotRoot, 72);
    // the ring: material from the slots' mouths to the rim; a hub web below joins it to the shaft (a piece)
    for (let k = 0; k < n; k++) {
      const a = Math.PI / n + (k * TAU) / n;
      f.push(cut(radialSlot(a, Math.max(1, mouth - 30), root, hw), -1, thick + 2));
      const b = (k * TAU) / n;
      f.push(cut(circle(lockR, c * Math.cos(b), c * Math.sin(b), 96), -1, thick + 2));
    }
    void rIn;
    return { profile: { outer: circle(rOut, 0, 0, 144), holes: [circle(Math.max(4, mouth - 2), 0, 0, 72).reverse()] }, thick, features: f };
  }
  const tip = num(sh.tip, 80);
  const slotEnd = num(sh.slotEnd, 27);
  const wR = num(sh.windowR, 0);
  // a window stands well clear of the locking arc beside it: at least its own radius (4 mm at the least) of wall
  // and clear of the bore by as much: with no room between, no windows
  const wAt = Math.min(num(sh.windowAt, 0), c - lockR - wR - Math.max(4, wR));
  const roomy = wAt >= num(sh.bore, 10) / 2 + wR + Math.max(4, wR);
  for (let k = 0; k < n; k++) {
    const a = Math.PI / n + (k * TAU) / n;
    f.push(cut(radialSlot(a, slotEnd, tip + 10, hw), -1, thick + 2));
    const b = (k * TAU) / n;
    f.push(cut(circle(lockR, c * Math.cos(b), c * Math.sin(b), 96), -1, thick + 2));
    if (wR > 0 && roomy) f.push(cut(circle(wR, wAt * Math.cos(b), wAt * Math.sin(b), 32), -1, thick + 2));
  }
  return { profile: { outer: circle(tip, 0, 0, 144), holes: [circle(num(sh.bore, 10) / 2, 0, 0, 28).reverse()] }, thick, features: f };
}

/**
 * A Geneva crank's locking disc (`genevaCrank`, in the wheel's plane): a disc of radius `lock` with the `relief` cut on
 * the pin's side, centred `c` out along the pin's line, so the wheel's tips pass while the pin drives (`sector`: the
 * internal Geneva's locking sector, `halfAngle` either side of the line away from the pin). The pin (`pin` at `a`) and
 * the arm are pieces (shapes.ts), the arm above the wheel.
 */
export function genevaCrank(sh: Record<string, unknown>): IndexerPart {
  const thick = num(sh.thickness, 8);
  const lock = num(sh.lock, 50);
  const c = num(sh.c, 110);
  const f: Feature[] = [];
  const sector = num(sh.halfAngle, 0);
  if (sector > 0) {
    // the locking sector: the disc less everything outside ±halfAngle about the side away from the pin
    const h = (sector * Math.PI) / 180;
    const R = lock + 2;
    const wedge: Vec2[] = [[0, 0]];
    for (let i = 0; i <= 24; i++) {
      const t = h + ((TAU - 2 * h) * i) / 24 + Math.PI;
      wedge.push([R * 2 * Math.cos(t), R * 2 * Math.sin(t)]);
    }
    f.push(cut(wedge, -1, thick + 2));
    return { profile: { outer: circle(lock, 0, 0, 96), holes: [] }, thick, features: f };
  }
  f.push(cut(circle(num(sh.relief, 83), c, 0, 144), -1, thick + 2));
  return { profile: { outer: circle(lock, 0, 0, 96), holes: [] }, thick, features: f };
}

const sector = (r0: number, r1: number, a0: number, a1: number, n = 24): Vec2[] => {
  const out: Vec2[] = [];
  for (let i = 0; i <= n; i++) out.push([r1 * Math.cos(a0 + ((a1 - a0) * i) / n), r1 * Math.sin(a0 + ((a1 - a0) * i) / n)]);
  for (let i = n; i >= 0; i--) out.push([r0 * Math.cos(a0 + ((a1 - a0) * i) / n), r0 * Math.sin(a0 + ((a1 - a0) * i) / n)]);
  return out;
};

const add = (outer: Vec2[], z0: number, h: number): Feature => ({ ...cut(outer, z0, h), mode: "add" });

/**
 * The driver of a single-plane intermittent gear (`intermittentDriver`): `kept` teeth of `z` (module `m`) centred on the
 * frame's angle `at` (deg), the rest of the turn a plain convex locking rim of radius `rim`, tapered to the root over
 * `relief` degrees at its two ends so the driven gear can start and stop; the first and last teeth shortened to `entryTip`
 * and `exitTip` (the driver turns counter-clockwise, so the entry tooth is the one at the larger angle).
 */
export function intermittentDriver(sh: Record<string, unknown>, gearOutline: (z: number, m: number, ad?: number, de?: number, teeth?: (k: number) => boolean) => Vec2[]): IndexerPart {
  const z = num(sh.z, 20);
  const m = num(sh.m, 4);
  const kept = num(sh.kept, 5);
  const at = (num(sh.at, 180) * Math.PI) / 180;
  const pitch = TAU / z;
  // the teeth centred on `at`: an odd count centred on a tooth; an even count on a space, the outline turned half a pitch
  const rot = kept % 2 ? 0 : pitch / 2;
  const k0 = at / pitch;
  const kc = (at - rot) / pitch;
  const keep = new Set(Array.from({ length: kept }, (_, i) => (((Math.round(kc - (kept - 1) / 2 + i) % z) + z) % z)));
  const thick = num(sh.thickness, 10);
  const rf = (m * z) / 2 - 1.25 * m;
  const rim = num(sh.rim, 39);
  // the rim runs between the end teeth's outer spaces: the toothed window spans kept + 1 pitches
  const half = ((kept + (kept % 2 ? 0 : 1)) * pitch) / 2;
  const rel = (num(sh.relief, 10) * Math.PI) / 180;
  const f: Feature[] = [];
  // the rim over the untoothed turn, tapering to the root at its ends
  const a0 = at + half;
  const a1 = at + TAU - half;
  const ring: Vec2[] = [];
  const N = 120;
  for (let i = 0; i <= N; i++) {
    const a = a0 + ((a1 - a0) * i) / N;
    const e = Math.min(a - a0, a1 - a) / rel;
    const r = e >= 1 ? rim : rf - 0.5 + (rim - rf + 0.5) * Math.max(0, e);
    ring.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  ring.push([0, 0]);
  f.push(add(ring, 0, thick));
  // the end teeth shortened
  const entry = ((k0 + (kept - 1) / 2) * pitch);
  const exit = ((k0 - (kept - 1) / 2) * pitch);
  f.push(cut(sector(num(sh.entryTip, 42.8), rf + 2.5 * m, entry - pitch / 2, entry + pitch / 2), -1, thick + 2));
  f.push(cut(sector(num(sh.exitTip, 43.5), rf + 2.5 * m, exit - pitch / 2, exit + pitch / 2), -1, thick + 2));
  const outer = gearOutline(z, m, 1, 1.25, (k) => keep.has(k)).map(([x, y]): Vec2 => [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]);
  return { profile: { outer, holes: [circle(num(sh.bore, 10) / 2, 0, 0, 28).reverse()] }, thick, features: f };
}

/**
 * The driven gear of a single-plane intermittent gear (`intermittentDriven`): a full gear of `z`, a tooth on the frame's
 * x (toward the driver) at rest, or a space with `space: true`; every `every` teeth the tips that face the driver at rest
 * are cut to a concave arc of radius `arc` centred `cd` away (the driver's axis), the locking arc its rim runs in.
 */
export function intermittentDriven(sh: Record<string, unknown>, gearOutline: (z: number, m: number) => Vec2[]): IndexerPart {
  const z = num(sh.z, 20);
  const m = num(sh.m, 4);
  const every = num(sh.every, 5);
  const cd = num(sh.cd, 80);
  const arc = num(sh.arc, 39.5);
  const thick = num(sh.thickness, 10);
  // a tooth or a space on the line to the driver at rest: a space when the driver's toothed window is centred on a
  // space (an even count of teeth), a tooth when on a tooth (an odd count): `space` true or false
  const half = sh.space === true ? Math.PI / z : 0;
  const outer = gearOutline(z, m).map(([x, y]): Vec2 => [x * Math.cos(half) - y * Math.sin(half), x * Math.sin(half) + y * Math.cos(half)]);
  const f: Feature[] = [];
  for (let k = 0; k < z / every; k++) {
    const b = (k * every * TAU) / z;
    f.push(cut(circle(arc, cd * Math.cos(b), cd * Math.sin(b), 144), -1, thick + 2));
  }
  return { profile: { outer, holes: [circle(num(sh.bore, 10) / 2, 0, 0, 28).reverse()] }, thick, features: f };
}
