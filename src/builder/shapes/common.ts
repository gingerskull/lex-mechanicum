// What the shape files share: the number readers, a ring of points turned about the origin, a signed area, a plain
// bore, and the forms a family's outlines (by the shape's `type`, or a `custom` shape's profile) and its body
// geometries take.
import { circle, type Vec2 } from "../../core/geom";
import type { Kin, KinBody } from "../../kin/types";
import type { Setup } from "../../kin/compose";
import type { Feature, LoftSection, MeshData, Profile } from "../../solids/types";
import type { Bevel3 } from "../bevel3";
import type { BodyGeom } from "../shapes";

/** A body's outline in its plane coordinates and what its shape adds to it (a loft, a twist, an upper plate, features). */
export type Outline = { profile: Profile; thick: number; approx: boolean; scaleTop?: number; twist?: number; loft?: LoftSection[]; exact?: boolean; exactOffset?: number; upper?: BodyGeom["upper"]; plan?: Vec2[]; features?: Feature[]; mesh?: MeshData; teeth?: Bevel3 };

/**
 * The outline of a shape type (or of a `custom` shape's profile), null where the shape leaves the body to its stand-in.
 * `pins` are the body's joints in plane coordinates, `far` the farthest one's distance, `type` the shape's type.
 */
export type OutlineFn = (shape: Record<string, unknown>, pins: Vec2[], far: number, type: string) => Outline | null;

/** A body's geometry of its own beyond its outline (pieces, features, a part standing where its joints put it), or null. */
export type GeomFn = (kin: Kin, S: Setup, b: KinBody, g: BodyGeom) => BodyGeom | null;

export const signedArea = (p: Vec2[]): number => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]!; return a + q[0] * r[1] - r[0] * q[1]; }, 0) / 2;

export const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
export const pair = (v: unknown, d: [number, number]): [number, number] => (Array.isArray(v) && v.length >= 2 ? [num(v[0], d[0]), num(v[1], d[1])] : d);

export const rot = (pts: Vec2[], a: number): Vec2[] => pts.map(([x, y]): Vec2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);

/** A plain bore of radius r about the origin. */
export const hole = (r: number): Vec2[] => circle(r, 0, 0, 28);
