// J8, V4, F7: every belt gets flanges on its small pulley (F10), a slotted mount to tension it (F7), and an idler on a
// slotted arm when the wrap on the small pulley is short.
import { bbox, roundedPoly, type Vec2 } from "../core/geom";
import { disc } from "../hardware/primitives";
import { solid } from "../hardware/solid";
import { PULLEYS } from "../hardware/tables";
import type { Rule } from "./types";

const SLOT = 2.5;

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
      const fl = { body: small.body, at: small.at, ...(small.motion ? { motion: small.motion } : {}), ...(small.axis ? { axis: small.axis } : {}), joints: small.joints, ex: small.ex, kind: "pulley" as const, role: small.role, mat: "Steel, zinc plated", group: small.id };
      const fd = r < 6 ? PULLEYS[16].fd : PULLEYS[32].fd;
      ctx.add(solid(`${small.id}-fl0`, { ...fl, name: "Pulley flanges", qty: 2, outer: disc(fd / 2), holes: small.holes, z0: small.z0 - 0.8, z1: small.z0 }));
      ctx.add(solid(`${small.id}-fl1`, { ...fl, name: "", outer: disc(fd / 2), holes: small.holes, z0: small.z1, z1: small.z1 + 0.8 }));
      if (J) (J.serves.F10 ??= []).push(`${small.id}-fl0`);
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
