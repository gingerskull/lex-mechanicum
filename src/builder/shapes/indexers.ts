// Intermittent drives: a mutilated gear pair, a Geneva wheel and crank (an internal wheel's ring on its web), and a
// roller-gear indexer's turret rollers.
import { D2R, TAU, circle, gearOutline } from "../../core/geom";
import { type Vec3, v3 } from "../../kin/math";
import { genevaCrank, genevaWheel, intermittentDriven, intermittentDriver } from "../indexers";
import type { BodyGeom } from "../shapes";
import { type OutlineFn, num } from "./common";

const intermittent: OutlineFn = (shape, _pins, _far, type) => {
  const part = type === "intermittentDriver" ? intermittentDriver(shape, gearOutline) : intermittentDriven(shape, gearOutline);
  return { profile: part.profile, thick: part.thick, approx: false, features: part.features };
};

const geneva: OutlineFn = (shape, _pins, _far, type) => {
  const part = type === "genevaWheel" ? genevaWheel(shape) : genevaCrank(shape);
  return { profile: part.profile, thick: part.thick, approx: false, features: part.features };
};

/**
 * An internal Geneva wheel (`genevaWheel` with `internal`): its own part is the web under the ring (`web` thick, a plain
 * disc on the wheel's shaft), so the shaft's stack ends below the ring where the crank's pin passes; the slotted ring is a
 * piece of the body in the ring's plane, its slots and arcs cut as features.
 */
export function ringWheel(g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) !== "genevaWheel" || !g.shape.internal) return null;
  const web = num(g.shape.web, 6);
  const place = num(g.shape.place, 0);
  const rOut = num((g.shape.internal as Record<string, unknown>).rimOut, 88);
  const F = g.frame;
  const ring = { id: `${g.id}-ring`, name: "", frame: { o: v3.add(F.o, v3.mul(F.z, place)), x: F.x, z: F.z }, profile: g.profile, h: g.thick, ...(g.features ? { features: g.features } : {}) };
  return { ...g, profile: { outer: circle(rOut, 0, 0, 144), holes: [] }, thick: web, features: [], exact: { offset: place - web - 1 }, pieces: [...(g.pieces ?? []), ring] };
}

/** A turret's radial rollers (`rollers` { n, pitchRadius, diameter, length, firstAt }) in its mid-plane, as pieces. */
export function turretRollers(g: BodyGeom): NonNullable<BodyGeom["pieces"]> {
  const ro = g.shape.rollers as Record<string, number>;
  const F = g.frame;
  const Fy = v3.cross(F.z, F.x);
  const mid = num(g.shape.place, 0) + g.thick / 2;
  const out: NonNullable<BodyGeom["pieces"]> = [];
  const n = num(ro.n, 8);
  const len = num(ro.length, 18);
  for (let k = 0; k < n; k++) {
    // firstAt is from the world x, as the rib reads it; in the body's frame, from its own x
    const a = num(ro.firstAt, 0) * D2R + (k * TAU) / n;
    const d: Vec3 = [Math.cos(a), Math.sin(a), 0];
    const o = v3.add(v3.add(F.o, v3.mul(F.z, mid)), v3.mul(d, num(ro.pitchRadius, 60) - len / 2));
    const x = v3.unit(v3.cross(F.z, d));
    out.push({ id: `${g.id}-roller${k}`, name: "", frame: { o, x, z: d }, profile: { outer: circle(num(ro.diameter, 20) / 2, 0, 0, 32), holes: [] }, h: len });
  }
  void Fy;
  return out;
}

export const INDEXER_OUTLINES: Record<string, OutlineFn> = { intermittentDriver: intermittent, intermittentDriven: intermittent, genevaWheel: geneva, genevaCrank: geneva };
