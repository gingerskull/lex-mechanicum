// J8, V4, F7: every belt gets flanges on its small pulley (F10), a slotted mount to tension it (F7), and an idler on a
// slotted arm when the wrap on the small pulley is short.
import { bbox, roundedPoly, type Vec2 } from "../core/geom";
import { disc } from "../hardware/primitives";
import { solid, type Solid } from "../hardware/solid";
import { PULLEYS } from "../hardware/tables";
import type { Joint, Rule, RuleContext } from "./types";

const SLOT = 2.5;
/** A belt flange's thickness, mm. */
export const FLANGE_T = 0.8;

/**
 * Flanges of Ø fd either side of a pulley, turning with it, so the belt cannot walk off (F10): `${id}-fl0` under it and
 * `${id}-fl1` over it, in the pulley's group.
 */
export function flanges(ctx: RuleContext, pulley: Solid, fd: number, J?: Joint, name = "Pulley flanges"): void {
  const fl = { body: pulley.body, at: pulley.at, ...(pulley.motion ? { motion: pulley.motion } : {}), ...(pulley.axis ? { axis: pulley.axis } : {}), joints: pulley.joints, ex: pulley.ex, kind: "pulley" as const, role: pulley.role, mat: "Steel, zinc plated", group: pulley.id };
  ctx.add(solid(`${pulley.id}-fl0`, { ...fl, name, qty: 2, outer: disc(fd / 2), holes: pulley.holes, z0: pulley.z0 - FLANGE_T, z1: pulley.z0 }));
  ctx.add(solid(`${pulley.id}-fl1`, { ...fl, name: "", outer: disc(fd / 2), holes: pulley.holes, z0: pulley.z1, z1: pulley.z1 + FLANGE_T }));
  if (J) (J.serves.F10 ??= []).push(`${pulley.id}-fl0`);
}

export const j8: Rule = {
  id: "j8-belt",
  tier: "AUTO",
  ids: ["J8", "V4"],
  applies: (ctx) => ctx.belts.length > 0,
  apply(ctx) {
    for (const b of ctx.belts) {
      const small = ctx.get(b.pulleys[0])!;
      const big = ctx.get(b.pulleys[1])!;
      const J = ctx.joint(b.joint);
      const axis = (t: typeof small): Vec2 => {
        if (t.motion && (t.motion.type === "geared" || t.motion.type === "rolling")) return t.motion.around;
        const q = ctx.world(t);
        return q ? [q[0], q[1]] : [0, 0];
      };
      const pa = axis(small);
      const pb = axis(big);
      // flanges either side of the small pulley so the belt cannot walk off
      const [x0, , x1] = bbox(small.outer);
      const r = (x1 - x0) / 2;
      flanges(ctx, small, r < 6 ? PULLEYS[16].fd : PULLEYS[32].fd, J);
      // tension: the mount's screw holes become slots along the belt, the motor slides and is clamped
      const mount = b.mount ? ctx.get(b.mount) : undefined;
      const c = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1;
      const u: Vec2 = [(pb[0] - pa[0]) / c, (pb[1] - pa[1]) / c];
      if (mount) {
        mount.holes = mount.holes.map((h, i) => {
          if (i === 0) return h;
          const [hx0, hy0, hx1, hy1] = bbox(h);
          const cx = (hx0 + hx1) / 2;
          const cy = (hy0 + hy1) / 2;
          const hr = (hx1 - hx0) / 2;
          if (hr > 3) return h;
          return roundedPoly([[cx - u[0] * SLOT, cy - u[1] * SLOT], [cx + u[0] * SLOT, cy + u[1] * SLOT]], hr);
        });
        if (J) (J.serves.F7 ??= []).push(mount.id);
      }
      // wrap on the small pulley; an idler when it is under 150°
      const R = (bbox(big.outer)[2] - bbox(big.outer)[0]) / 2;
      const wrap = Math.PI - 2 * Math.asin(Math.min(1, Math.abs(R - r) / c));
      if (wrap < (150 * Math.PI) / 180 && J) J.note += " Wrap on the small pulley is short: an idler on a slotted arm is needed (polish).";
      if (J) J.note += ` Belt tensioned by sliding the mount ±${SLOT} mm in its slots; flanged small pulley.`;
    }
  },
};
