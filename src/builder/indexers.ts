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
 * slots, behind the arcs, so the wheel's turn shows without a lattice (M2). Internal (`internal: { rimIn, rimOut }`): a
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
  const wAt = num(sh.windowAt, 0);
  for (let k = 0; k < n; k++) {
    const a = Math.PI / n + (k * TAU) / n;
    f.push(cut(radialSlot(a, slotEnd, tip + 10, hw), -1, thick + 2));
    const b = (k * TAU) / n;
    f.push(cut(circle(lockR, c * Math.cos(b), c * Math.sin(b), 96), -1, thick + 2));
    if (wR > 0) f.push(cut(circle(wR, wAt * Math.cos(b), wAt * Math.sin(b), 32), -1, thick + 2));
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
