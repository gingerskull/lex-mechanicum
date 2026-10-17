// A6: fixed plates floating above the base sit on Ø10 standoffs, screwed from both sides, spigoted when the plate
// holds a bearing (F1).
import { xf, type Vec2 } from "../core/geom";
import { inside, toLocal } from "../core/poly";
import { disc, screw, spigot, standoff } from "../hardware/primitives";
import { STANDOFF } from "../hardware/tables";
import type { Rule } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));

export const standoffs: Rule = {
  id: "standoffs",
  tier: "AUTO",
  ids: ["A6"],
  applies: (ctx) => ctx.model.parts.some((p) => p.fixed && p.role !== "pin" && p.role !== "trace"),
  apply(ctx) {
    for (const p of ctx.model.parts) {
      if (!p.fixed || p.role === "pin" || p.role === "trace") continue;
      const q = ctx.solidOf[p.id]!;
      if (q.z0 <= ctx.b1 + 0.5) continue;
      const O = xf(p.shape.outer, p.fixed);
      // posts at the two points of the outline farthest apart, 8 mm in; one post in the middle of a small plate
      let best: [number, number, number] = [0, 0, -1];
      for (let i = 0; i < O.length; i += 2)
        for (let k = i + 1; k < O.length; k += 2) {
          const dd = Math.hypot(O[i]![0] - O[k]![0], O[i]![1] - O[k]![1]);
          if (dd > best[2]) best = [i, k, dd];
        }
      const cx = O.reduce((a, v) => a + v[0], 0) / O.length;
      const cy = O.reduce((a, v) => a + v[1], 0) / O.length;
      const pts: Vec2[] = best[2] > 40 ? [O[best[0]]!, O[best[1]]!] : [[cx, cy]];
      const holdsBearing = ctx.solids.some((t) => t.body === p.id && (t.kind === "bearing" || t.kind === "bushing"));
      const jid = `${p.id}-post`;
      let n = 0;
      pts.forEach((p0, k) => {
        const dx = cx - p0[0];
        const dy = cy - p0[1];
        const L = Math.hypot(dx, dy) || 1;
        const ins = Math.min(8, L);
        const c: Vec2 = [p0[0] + (dx / L) * ins, p0[1] + (dy / L) * ins];
        if (!inside(O, c)) return;
        const at: [number, number, number] = [c[0], c[1], 0];
        const G = { at, joints: [jid] };
        const l = toLocal(p.fixed!, c);
        q.holes.push(disc(holdsBearing ? STANDOFF.spigotD / 2 : STANDOFF.M / 2 + 0.3, ...l));
        ctx.add(standoff(`${jid}${k}`, { ...G, name: n ? "" : `Standoff Ø${STANDOFF.D} x ${fmt(q.z0 - ctx.b1)}, M${STANDOFF.M}${holdsBearing ? `, Ø${STANDOFF.spigotD} spigot` : ""}`, z0: ctx.b1, z1: q.z0, span: [-1, q.ex], ex: -1 }));
        if (holdsBearing) ctx.add(spigot(`${jid}${k}-spigot`, { ...G, z0: q.z0, z1: q.z0 + Math.min(3, q.z1 - q.z0), ex: q.ex, allow: [p.id] }));
        ctx.add(screw(`${jid}${k}-top`, "button", STANDOFF.M, q.z1 - q.z0 + 1.5 * STANDOFF.M, { ...G, face: q.z1, dir: -1, ex: q.ex }));
        ctx.add(screw(`${jid}${k}-bot`, "button", STANDOFF.M, ctx.b1 - ctx.b0 + 1.5 * STANDOFF.M, { ...G, face: ctx.b0, dir: 1, ex: -1 }));
        n++;
      });
      if (!n) continue;
      ctx.joints.push({
        id: jid,
        type: "post",
        at: pts[0]!,
        title: `Post · ${q.name}`,
        note: `Ø${STANDOFF.D} standoff${n > 1 ? "s" : ""}, ${fmt(q.z0 - ctx.b1)} mm, holding the ${q.name.toLowerCase()} off the base; M${STANDOFF.M} button heads from both sides${holdsBearing ? "; spigoted because the plate carries a bearing" : ""}.`,
        badge: ["check sweep", "warn"],
        serves: holdsBearing ? { F1: pts.map((_, k) => `${jid}${k}-spigot`) } : {},
      });
      q.joints.push(jid);
    }
  },
};
