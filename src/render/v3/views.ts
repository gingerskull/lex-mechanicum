// The views of a drawing (standard T7, T8, L7, L9; style SD10, SD19, SD20): the named orientation a record opens in, the
// section views (a cut plane) and detail views (a magnified window) it declares, and the explode. A view is plain data;
// the renderer reads it and nothing in it changes the solids (a section hides the near side at draw time).
import { DRAFT } from "../../style/draft";
import type { Teaching } from "../../catalog/kin";
import type { Vec3 } from "../../solids/types";
import { namedOrient, NAMED_VIEWS, snapped, type NamedView, type Orient } from "./camera";

/** A cut: the half space the normal points into is removed; the cut faces are hatched. */
export interface SectionSpec {
  /** Name for the title block: SECTION A-A. */
  name: string;
  origin: Vec3;
  /** Points toward the removed side. */
  normal: Vec3;
  /** Bodies or points the view is about; drawn with the highlight. */
  highlight: string[];
}

/** A magnified window of the drawing. */
export interface DetailSpec {
  name: string;
  /** A world point, or a named point of the mechanism. */
  centre: Vec3 | string;
  /** Factor on the fitted scale. */
  scale: number;
  highlight: string[];
}

export interface ViewState {
  orient: Orient;
  /** The joint an AUX view looks down, for the title block. */
  auxName?: string;
  section?: SectionSpec;
  detail?: DetailSpec;
  /** 0 (assembled) to 1 (full explode). */
  explode: number;
}

export const ISO: ViewState = { orient: namedOrient("ISOMETRIC"), explode: 0 };

const num = (s: string): number | null => (s !== "" && Number.isFinite(Number(s)) ? Number(s) : null);

/** Parses a record's view string: PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, "AUX <joint>" or "VIEW az el". Null if it is none. */
export function parseView(text: string, axisOf: (joint: string) => Vec3 | null = () => null): { orient: Orient; auxName?: string } | null {
  const t = text.trim();
  const up = t.toUpperCase();
  if ((NAMED_VIEWS as readonly string[]).includes(up)) return { orient: namedOrient(up as NamedView) };
  const aux = /^AUX\s+(\S+)$/i.exec(t);
  if (aux) {
    const a = axisOf(aux[1]!);
    return a ? { orient: { yaw: 0, tilt: 0, aux: a }, auxName: aux[1]! } : null;
  }
  const v = /^VIEW\s+(-?[\d.]+)\s+(-?[\d.]+)$/i.exec(t);
  if (v) {
    const az = num(v[1]!), el = num(v[2]!);
    if (az !== null && el !== null) return { orient: snapped({ yaw: az, tilt: 90 - el }) };
  }
  return null;
}

/**
 * The view a record opens in (its `teaching.view`), or the isometric when it does not parse. A plan reads flat, so a
 * record that declares one opens tilted to the 28 degree view, its layout kept and its depth shown (T7); any other view
 * it declares (a front elevation, a view down an axis) is kept as it is.
 */
export function defaultView(t: Pick<Teaching, "view"> | null | undefined, axisOf?: (joint: string) => Vec3 | null): ViewState {
  const p = t ? parseView(t.view, axisOf) : null;
  if (p && !p.orient.aux && p.orient.tilt === 0) return { orient: { yaw: p.orient.yaw, tilt: DRAFT.camera.planOpens }, explode: 0 };
  return p ? { orient: p.orient, ...(p.auxName ? { auxName: p.auxName } : {}), explode: 0 } : ISO;
}

const vec3 = (v: unknown): Vec3 | null => (Array.isArray(v) && v.length >= 2 && v.every((x) => typeof x === "number") ? [v[0] as number, v[1] as number, (v[2] as number | undefined) ?? 0] : null);
const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const label = (id: string): string => id.toUpperCase();

/**
 * The section and detail views of a record's `teaching.views`, each with the camera it reads best in: a section looks
 * straight at its cut plane, a detail keeps the record's default orientation.
 */
export function viewsOf(t: Pick<Teaching, "view" | "views"> | null | undefined, axisOf?: (joint: string) => Vec3 | null): { id: string; state: ViewState }[] {
  if (!t?.views) return [];
  const base = defaultView(t, axisOf);
  const out: { id: string; state: ViewState }[] = [];
  for (const v of t.views) {
    if (v.kind === "section") {
      const plane = v.plane as { origin?: unknown; normal?: unknown } | undefined;
      const origin = vec3(plane?.origin), normal = vec3(plane?.normal);
      if (!origin || !normal) continue;
      // a section may magnify a window of its cut (a thread's flanks in a nut): a centre and a scale, as a detail
      const centre = vec3(v.center) ?? (typeof v.center === "string" ? v.center : null);
      const detail = centre && typeof v.scale === "number" ? { detail: { name: `SECTION ${label(v.id)}`, centre, scale: v.scale, highlight: [] } } : {};
      out.push({ id: v.id, state: { orient: { yaw: 0, tilt: 0, aux: normal }, section: { name: `SECTION ${label(v.id)}`, origin, normal, highlight: v.highlight ?? [] }, ...detail, explode: 0 } });
    } else if (v.kind === "detail") {
      const centre = vec3(v.center) ?? (typeof v.center === "string" ? v.center : null);
      if (!centre) continue;
      out.push({ id: v.id, state: { ...base, detail: { name: `DETAIL ${label(v.id)}`, centre, scale: typeof v.scale === "number" ? v.scale : 3, highlight: strs(v.highlight) } } });
    }
  }
  return out;
}
