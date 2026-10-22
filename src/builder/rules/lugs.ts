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
import { H } from "../../hardware/primitives";
import { Local, titleOf } from "../lib";
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

/**
 * Posts under a fixed body that has joints of its own (a swash plate's cylinder block, which no stack holds): the record
 * names them in its shape, `posts: [{ at: [x, y], top, r? }]` in world reference coordinates, each a round column from
 * the base's top up into the body, screwed through the base (F1).
 */
export const posts: Rule = {
  id: "posts",
  tier: "AUTO",
  ids: ["A7", "F1"],
  fixture: "swash-plate",
  applies: (ctx) => ctx.kin.bodies.some((b) => Array.isArray((b.shape as { posts?: unknown } | undefined)?.posts)),
  apply(ctx: BuildCtx) {
    if (!ctx.base) return;
    for (const b of ctx.kin.bodies) {
      const raw = (b.shape as { posts?: unknown } | undefined)?.posts;
      // a `posts` in prose (a record's note on its frame) is not a list of posts
      const list = (Array.isArray(raw) ? raw : []) as { at: [number, number]; top: number; r?: number }[];
      list.forEach((p, k) => {
        const r = p.r ?? 8;
        const f = frameAlong([p.at[0], p.at[1], ctx.base!.top], [0, 0, 1]);
        const L = new Local(f, { joints: [] });
        L.add(H.solid(`${b.id}-post${k}`, { name: k ? "" : `Post Ø${2 * r}, carries the ${titleOf(b.id).toLowerCase()}`, qty: k ? 0 : list.length, kind: "standoff", role: "ground", mat: "Steel C45, ground", outer: circle(r, 0, 0, 32), z0: 0, z1: p.top - ctx.base!.top, body: "ground" }));
        L.add(H.screw(`${b.id}-post${k}-sc`, "socket", 6, 16, { face: ctx.base!.bottom - ctx.base!.top, dir: 1, body: "ground", ...(k ? { name: "", qty: 0 } : {}) }));
        ctx.add(L.out());
      });
    }
  },
};
