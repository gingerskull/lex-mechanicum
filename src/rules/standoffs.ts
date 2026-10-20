// A6: fixed plates floating above the base sit on Ø10 standoffs, screwed from both sides, spigoted when the plate
// holds a bearing (F1). A slide rail sits on a ground steel riser instead (pads where something passes under it),
// screwed down into the base; the reference rail is dowelled (F1), as a rail is on a machine (`seatRail`). A compliant
// blank's ground block and its neck stand on no posts: J13 seats and clamps the block, and nothing goes through a neck.
import { xf, type Vec2 } from "../core/geom";
import { edgeDist, inside, toLocal } from "../core/poly";
import { disc, screw, spigot, standoff } from "../hardware/primitives";
import { seatRail } from "../hardware/sub/slide";
import { STANDOFF } from "../hardware/tables";
import type { Rule } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));

export const standoffs: Rule = {
  id: "standoffs",
  tier: "AUTO",
  ids: ["A6"],
  applies: (ctx) => ctx.model.parts.some((p) => p.fixed && p.role !== "pin" && p.role !== "trace"),
  apply(ctx) {
    // rail id -> its slide; rail b is the reference, rail a carries the gib and keeper
    const rails = new Map(ctx.info.flatMap((j) => (j.kind === "slide" ? j.rails.map((r, k) => [r.id, { j, ref: k === 1 }] as const) : [])));
    // a timing belt's band rides its pulleys (J12): no plate, no posts
    const bands = new Set((ctx.model.flexible ?? []).flatMap((f) => (f.form === "belt" ? [f.band] : [])));
    const blank = new Set((ctx.model.compliant ?? []).flatMap((c) => [c.ground, c.neck]));
    for (const p of ctx.model.parts) {
      // a fixed part on an x or y axis is carried by its own mount (J10), not on posts
      if (!p.fixed || p.role === "pin" || p.role === "trace" || p.axis || bands.has(p.id) || blank.has(p.id)) continue;
      const q = ctx.solidOf[p.id]!;
      const onSlide = rails.get(p.id);
      if (onSlide) {
        const keeper = onSlide.ref ? undefined : ctx.get(`${onSlide.j.id}-keeper`);
        seatRail(ctx, p, `${p.id}-seat`, { ref: onSlide.ref, top: keeper ? { id: keeper.id, z1: keeper.z1, ex: keeper.ex } : undefined });
        continue;
      }
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
      const ends: Vec2[] = [O[best[0]]!, O[best[1]]!];
      const ux = (ends[1]![0] - ends[0]![0]) / (best[2] || 1);
      const uy = (ends[1]![1] - ends[0]![1]) / (best[2] || 1);
      const h = best[2] / 2;
      const pts: Vec2[] = best[2] > 40 ? [[cx - ux * (h - 8), cy - uy * (h - 8)], [cx + ux * (h - 8), cy + uy * (h - 8)]] : [[cx, cy]];
      const holdsBearing = ctx.solids.some((t) => t.body === p.id && (t.kind === "bearing" || t.kind === "bushing"));
      const jid = `${p.id}-post`;
      let n = 0;
      const sizes: number[] = [];
      pts.forEach((c0, k) => {
        // centre the post across the plate: the deepest point on the line across it
        let c = c0;
        for (let t = -6; t <= 6; t += 0.1) {
          const q: Vec2 = [c0[0] - uy * t, c0[1] + ux * t];
          if (inside(O, q) && edgeDist(O, q) > edgeDist(O, c) + 1e-9) c = q;
        }
        if (!inside(O, c)) return;
        const at: [number, number, number] = [c[0], c[1], 0];
        const G = { at, joints: [jid] };
        const l = toLocal(p.fixed!, c);
        // a plate narrower than a Ø10 post (a rail) sits on a post its own width, fastened by a flush M3
        const width = 2 * edgeDist(p.shape.outer, l);
        const narrow = width < STANDOFF.D + 2;
        const D = narrow ? Math.max(5, Math.floor(width - 1)) : STANDOFF.D;
        const M = narrow ? 3 : STANDOFF.M;
        sizes.push(narrow ? D : 0);
        q.holes.push(disc(holdsBearing && !narrow ? STANDOFF.spigotD / 2 : M / 2 + 0.3, ...l));
        ctx.add(standoff(`${jid}${k}`, { ...G, name: n ? "" : `Standoff Ø${D} x ${fmt(q.z0 - ctx.b1)}, M${M}${holdsBearing && !narrow ? `, Ø${STANDOFF.spigotD} spigot` : ""}`, outer: disc(D / 2), D, z0: ctx.b1, z1: q.z0, span: [-1, q.ex], ex: -1 }));
        if (holdsBearing && !narrow) ctx.add(spigot(`${jid}${k}-spigot`, { ...G, z0: q.z0, z1: q.z0 + Math.min(3, q.z1 - q.z0), ex: q.ex, allow: [p.id] }));
        ctx.add(screw(`${jid}${k}-top`, narrow ? "csk" : "button", M, q.z1 - q.z0 + 1.5 * M, { ...G, face: q.z1, dir: -1, ex: q.ex }));
        ctx.add(screw(`${jid}${k}-bot`, "button", M, ctx.b1 - ctx.b0 + 1.5 * M, { ...G, face: ctx.b0, dir: 1, ex: -1 }));
        n++;
      });
      if (!n) continue;
      // the note speaks of rail posts only when every post is one
      const rail = sizes.every((v) => v > 0);
      const size = rail ? `Ø${Math.min(...sizes)}, the rail's width,` : `Ø${STANDOFF.D}`;
      const heads = rail ? "a flush M3 on top, an M3 button head under the base" : `M${STANDOFF.M} button heads from both sides`;
      ctx.joints.push({
        id: jid,
        type: "post",
        at: pts[0]!,
        title: `Post · ${q.name}`,
        note: `${size} standoff${n > 1 ? "s" : ""}, ${fmt(q.z0 - ctx.b1)} mm, holding the ${q.name.toLowerCase()} off the base; ${heads}${holdsBearing ? "; spigoted because the plate carries a bearing" : ""}.`,
        badge: ["check sweep", "warn"],
        serves: holdsBearing ? { F1: pts.map((_, k) => `${jid}${k}-spigot`) } : {},
      });
      q.joints.push(jid);
    }
  },
};
