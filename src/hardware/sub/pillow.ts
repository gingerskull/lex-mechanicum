// H.pillowBlock (J10): a bearing block for a shaft in plan (src/core/axis.ts). A cast-iron housing on the shaft's axis,
// straight sides up from its foot to a round boss over the bearing, standing on a foot plate that lies on the base: two
// socket screws down through the foot into the base and two dowels (F1, A11). A located block holds its bearing
// between two internal circlips (F2); a floating one lets the outer ring slide, so the shaft can grow. A block for a
// dead shaft clamps the shaft by a set screw instead of carrying a bearing.
import { arcPts, type Vec2 } from "../../core/geom";
import type { RuleContext } from "../../rules/types";
import { bearing, circlip, disc, dowel, plate, screw, setScrew } from "../primitives";
import { solid, type Solid } from "../solid";
import { circlipInt, type Bearing } from "../tables";
import { housingBearing } from "./housing";

export interface PillowSpec {
  /** The shaft's axis and its centre in the plane normal to it (u across, v up). */
  axis: "x" | "y";
  P: Vec2;
  /** Where the block starts along the axis, world mm. */
  w0: number;
  d: number;
  /** A live shaft turns in a bearing; a dead one is clamped. */
  live: boolean;
  /** A located block holds its bearing both ways; a floating one does not. */
  located: boolean;
  ex: number;
  /** Name only the first block of a set. */
  first: boolean;
}

export interface PillowResult {
  housing: Solid;
  foot: Solid;
  bearing: Bearing | null;
  /** The block's extent along the axis. */
  w: [number, number];
  /** The bearing's extent along the axis (the shaft's seat). */
  seat: [number, number];
}

const FOOT = 8;

/** The boss radius of a block for a shaft of Ø d. */
const bossR = (d: number, live: boolean): number => (live ? housingBearing(d).D / 2 + 5 : d / 2 + 6);

/**
 * How far a shaft in plan's centre must stand over the base top for its blocks: the foot, and the boss's lower part
 * (the base growth rule of J10: the base drops under a shaft in plan until its blocks fit).
 */
export const pillowRise = (d: number): number => FOOT + 0.4 * bossR(d, true) + 1;

/** The width of a block along the shaft, mm. */
export const pillowWidth = (d: number, live: boolean): number => (live ? housingBearing(d).B + 6 : 12);

export function pillowBlock(ctx: RuleContext, id: string, s: PillowSpec): PillowResult {
  const b = s.live ? housingBearing(s.d) : null;
  const L = pillowWidth(s.d, s.live);
  const Rb = bossR(s.d, s.live);
  const top = ctx.b1 + FOOT;
  const [p, q] = s.P;
  if (q - Rb * 0.4 < top)
    throw new Error(`pillow block ${id}: the shaft centre (z ${q.toFixed(1)}) stands ${(q - ctx.b1).toFixed(1)} mm over the base, a block needs ${(top - ctx.b1 + Rb * 0.4).toFixed(1)}: raise the shaft or lower the parts under it`);
  // plan coordinates: along the axis, and across it (the plane's u)
  const plan = (along: number, across: number): Vec2 => (s.axis === "x" ? [along, across] : [across, along]);
  const wm = s.w0 + L / 2;
  const half = Rb + 9;
  const foot = plate(`${id}-foot`, [plan(s.w0 - 2, p - half), plan(s.w0 + L + 2, p - half), plan(s.w0 + L + 2, p + half), plan(s.w0 - 2, p + half)], {
    kind: "housing",
    role: "ground",
    name: s.first ? `Pillow block foot ${2 * half} x ${L + 4} x ${FOOT}, screwed and dowelled to the base` : "",
    z0: ctx.b1,
    z1: top,
    ex: s.ex,
    mat: "Cast iron EN-GJL-250",
    joints: [id],
    why: "carries the block on the base and takes its screws and dowels (F1)",
  });
  // the housing in the plane: straight sides from the foot to the half-round boss over the shaft
  const outer: Vec2[] = [[p - Rb, top], [p + Rb, top], ...arcPts(p, q, Rb, 0, Math.PI, Math.PI / 32)];
  const housing = solid(id, {
    name: s.first ? `Pillow block, ${b ? `bored for a ${b.name ? `${b.name}-2RS` : "bearing"}` : `clamping the Ø${s.d} shaft`}` : "",
    kind: "housing",
    role: "ground",
    axis: s.axis,
    at: [0, 0, 0],
    outer,
    holes: [disc(b ? b.D / 2 + 0.15 : s.d / 2 + 0.02, p, q)],
    z0: s.w0,
    z1: s.w0 + L,
    ex: s.ex,
    mat: "Cast iron EN-GJL-250",
    joints: [id],
    chamfer: 0.6,
    why: "holds the shaft's bearing at the shaft's height",
  });
  ctx.add(foot, housing);
  let seat: [number, number] = [s.w0, s.w0 + L];
  if (b) {
    seat = [wm - b.B / 2, wm + b.B / 2];
    ctx.add(bearing(`${id}-brg`, b, { axis: s.axis, at: [p, q, 0], z0: seat[0], z1: seat[1], closure: "seal", ex: s.ex, joints: [id], ...(s.first ? {} : { name: "" }), seat: s.located ? "circlip each side" : "floating" }));
    if (s.located) {
      const c = circlipInt(b.D);
      for (const [k, z] of [[0, seat[0] - c.s], [1, seat[1]]] as const)
        ctx.add(circlip(`${id}-cl${k}`, b.D, { internal: true, axis: s.axis, at: [p, q, 0], z0: z, z1: z + c.s, ex: s.ex, joints: [id], name: k || !s.first ? "" : undefined }));
    }
  } else ctx.add(setScrew(`${id}-ss`, 4, { axis: s.axis, at: [p, q + s.d / 2 + 3, 0], outer: disc(2), z0: wm - 2, z1: wm + 2, ex: s.ex, joints: [id], name: "Set screw M4 on a flat, clamps the dead shaft (F2, F3)" }));
  // two screws down through the foot into the base, two dowels on the other diagonal (F1)
  const sx = Rb + 4.5;
  for (const [k, u] of [[0, -sx], [1, sx]] as const) {
    const at = plan(wm, p + u);
    ctx.add(screw(`${id}-sc${k}`, "socket", 5, FOOT + 8, { at: [at[0], at[1], 0], face: top, dir: -1, ex: s.ex + 1, joints: [id], name: k || !s.first ? "" : undefined, qty: k || !s.first ? 0 : undefined }));
    const dw = plan(k ? s.w0 + 1.5 : s.w0 + L - 1.5, p + (k ? u + 2.5 : u - 2.5));
    ctx.add(dowel(`${id}-dw${k}`, 4, { at: [dw[0], dw[1], 0], z0: top - FOOT + 0.5 - 6, z1: top, ex: s.ex, joints: [id], name: k || !s.first ? "" : "Dowel pin Ø4 x 14 h6, block to base", qty: k || !s.first ? 0 : 2 }));
  }
  return { housing, foot, bearing: b, w: [s.w0, s.w0 + L], seat };
}
