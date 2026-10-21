// Hinge lugs (A1, A2): a body whose own plane is not square to one of its hinges (a Sarrus top plate on its edge
// hinges, a governor's spindle head carrying the arms, a sleeve carrying the links) meets that hinge through a lug the
// record names in its shape: `lugs: [{ joint, span: [w0, w1], r? }]`, the span along the joint's axis from the joint's
// point. The lug is a boss on the axis joined to the body's part by a web, both one solid of the body; it becomes a
// member of the hinge's stack, so the pin, bores and bearings are the stack builder's as for any part.
import { circle, roundedPoly, type Vec2 } from "../../core/geom";
import type { Solid3 } from "../../solids/types";
import { extrudeOp } from "../../solids/tessellate";
import { type Vec3, v3 } from "../../kin/math";
import type { BuildCtx } from "../ctx";
import { canon, fromPlane, frameAlong, planeCoords } from "../frames";
import type { Rule } from "./types";

export interface LugSpec {
  joint: string;
  span: [number, number];
  /** Boss radius round the pin (default 8). */
  r?: number;
  /** A plain knuckle on the axis, no web to the body's part (a spatial link's far knuckle, joined by its bar). */
  round?: boolean;
}

/** The point of a polygon nearest `p`, and whether `p` is inside it. */
function nearestOn(poly: Vec2[], p: Vec2): { q: Vec2; inside: boolean } {
  let best: Vec2 = poly[0]!;
  let bd = Infinity;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j]!;
    const b = poly[i]!;
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
    const q: Vec2 = [a[0] + dx * t, a[1] + dy * t];
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (d < bd) {
      bd = d;
      best = q;
    }
  }
  return { q: best, inside };
}

/** Where a lug on `part` for the hinge at `p` meets the part: inside it, nearest the hinge. */
function rootOf(part: Solid3, p: Vec3): Vec3 {
  const h = part.op.op === "extrude" ? part.op.h : 6;
  const { uv, w } = planeCoords(part.frame, p);
  const { q, inside } = nearestOn(part.profile.outer, uv);
  const d = Math.hypot(q[0] - uv[0], q[1] - uv[1]) || 1;
  // a little inside the outline (3 mm past its edge) and inside the thickness
  const at: Vec2 = inside ? uv : [q[0] + ((q[0] - uv[0]) / d) * 3, q[1] + ((q[1] - uv[1]) / d) * 3];
  return fromPlane(part.frame, at, Math.max(1, Math.min(h - 1, w)));
}

export const lugs: Rule = {
  id: "lugs",
  tier: "AUTO",
  ids: ["A1", "A2"],
  fixture: "sarrus-linkage",
  applies: (ctx) => ctx.kin.bodies.some((b) => Array.isArray((b.shape as { lugs?: unknown } | undefined)?.lugs) || b.shape?.type === "spatial-link"),
  apply(ctx: BuildCtx) {
    for (const b of ctx.kin.bodies) {
      const sh = (b.shape ?? {}) as { lugs?: LugSpec[]; type?: unknown; far?: { joint?: string; span?: [number, number] }; knuckle?: number };
      const specs: LugSpec[] = [...(sh.lugs ?? [])];
      // a spatial link's knuckle on its far hinge is a lug standing on the axis (its bar joins it to the body)
      if (sh.type === "spatial-link" && sh.far?.joint && sh.far.span) specs.push({ joint: sh.far.joint, span: sh.far.span, r: sh.knuckle ?? 9, round: true });
      const part = ctx.parts.get(b.id);
      if (!specs.length || !part) continue;
      for (const L of specs) {
        const j = ctx.joints.find((q) => q.id === L.joint);
        if (!j) {
          ctx.issues.push(`lug on ${b.id}: no joint ${L.joint}`);
          continue;
        }
        const axis = canon(j.axis);
        const r = L.r ?? 8;
        const [w0, w1] = L.span[0] <= L.span[1] ? L.span : [L.span[1], L.span[0]];
        const f = frameAlong(v3.add(j.at as Vec3, v3.mul(axis, w0)), axis);
        const root: Vec2 = L.round ? [0, 0] : planeCoords(f, rootOf(part, j.at as Vec3)).uv;
        const outer = Math.hypot(root[0], root[1]) > 1 ? roundedPoly([[0, 0], root], r) : circle(r, 0, 0, 36);
        const lug: Solid3 = {
          ...part,
          id: `${b.id}-lug-${L.joint}`,
          name: "",
          frame: f,
          profile: { outer, holes: [] },
          op: extrudeOp(w1 - w0),
          marks: [],
          joints: [L.joint],
        };
        ctx.add(lug);
        const site = j.site ?? j.id;
        const list = ctx.lugs.get(site) ?? [];
        list.push(lug);
        ctx.lugs.set(site, list);
      }
    }
  },
};
