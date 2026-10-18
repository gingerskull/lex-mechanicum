// A6: fixed plates floating above the base sit on Ø10 standoffs, screwed from both sides, spigoted when the plate
// holds a bearing (F1). A slide rail sits on the base on ground steel pads instead, screwed down through rail and pad
// and located by two dowels (F1), as a rail is on a machine.
import { bbox, xf, type Vec2 } from "../core/geom";
import { edgeDist, inside, toLocal, toWorld } from "../core/poly";
import { disc, dowel, screw, spigot, standoff } from "../hardware/primitives";
import { STANDOFF } from "../hardware/tables";
import type { Part } from "../model/types";
import type { Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));

/** Rail pads: length along the rail, the most a pad may be from the next, the screw and dowel sizes. */
const PAD = { L: 12, pitch: 45, M: 3, dowel: 3, dowelIn: 5 };

/**
 * A slide rail on ground steel pads (F1): a pad under each fixing, at the rail's ends and evenly between them, ground
 * to the gap over the base; a countersunk screw down through rail and pad into the base at each, and a dowel through
 * each end pad into the base, so the rail goes back straight after a rebuild.
 */
function railSeat(ctx: RuleContext, p: Part, jid: string): void {
  const q = ctx.solidOf[p.id]!;
  const F = p.fixed!;
  const [x0, , x1] = bbox(p.shape.outer);
  const w = bbox(p.shape.outer)[3] - bbox(p.shape.outer)[1];
  // the straight run of a stadium rail, the pads inside it
  const a = x0 + w / 2 + PAD.L / 2 + 0.5;
  const b = x1 - w / 2 - PAD.L / 2 - 0.5;
  const n = Math.max(2, Math.ceil((b - a) / PAD.pitch) + 1);
  const at = Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
  const h = q.z0 - ctx.b1;
  const serves: string[] = [];
  at.forEach((x, k) => {
    const first = k === 0;
    ctx.add(standoff(`${jid}${k}`, {
      name: first ? `Rail pad ${fmt(w)} x ${PAD.L} x ${fmt(h)}, steel, ground` : "",
      qty: first ? n : 0,
      mat: "Steel C45, ground",
      outer: [[x - PAD.L / 2, -w / 2], [x + PAD.L / 2, -w / 2], [x + PAD.L / 2, w / 2], [x - PAD.L / 2, w / 2]],
      D: undefined,
      at: F,
      z0: ctx.b1,
      z1: q.z0,
      ex: -1,
      joints: [jid],
    }));
    const c = toWorld(F, [x, 0]);
    q.holes.push(disc(PAD.M / 2 + 0.3, x, 0));
    ctx.add(screw(`${jid}${k}-sc`, "csk", PAD.M, q.z1 - ctx.b1 + 1.5 * PAD.M, { at: [c[0], c[1], 0], face: q.z1, dir: -1, ex: q.ex, joints: [jid], name: first ? undefined : "", qty: first ? n : 0 }));
    if (k === 0 || k === n - 1) {
      // a dowel through the end pad, toward the rail's end, into the base and up into the rail
      const d = toWorld(F, [x + (k ? 1 : -1) * (PAD.L / 2 - PAD.dowel / 2 - 1.5), 0]);
      const id = `${jid}${k}-dowel`;
      ctx.add(dowel(id, PAD.dowel, { at: [d[0], d[1], 0], z0: ctx.b1 - PAD.dowelIn, z1: q.z0 + Math.min(3, (q.z1 - q.z0) / 2), ex: -1, joints: [jid], name: k ? "" : `Dowel pin Ø${PAD.dowel} h6 (ISO 8734), rail to base`, qty: k ? 0 : 2 }));
      serves.push(id);
    }
  });
  ctx.joints.push({
    id: jid,
    type: "post",
    at: toWorld(F, [at[0]!, 0]),
    title: `Seat · ${q.name}`,
    note: `Seated on ${n} ground steel pads ${fmt(h)} mm thick, one under each fixing: a countersunk M${PAD.M} down through rail and pad into the base at each, two Ø${PAD.dowel} dowels through the end pads locating it, so the rail goes back straight after a rebuild.`,
    badge: ["seated and dowelled", "ok"],
    serves: { F1: serves },
  });
  q.joints.push(jid);
}

export const standoffs: Rule = {
  id: "standoffs",
  tier: "AUTO",
  ids: ["A6"],
  applies: (ctx) => ctx.model.parts.some((p) => p.fixed && p.role !== "pin" && p.role !== "trace"),
  apply(ctx) {
    const rails = new Set(ctx.info.flatMap((j) => (j.kind === "slide" ? j.rails.map((r) => r.id) : [])));
    for (const p of ctx.model.parts) {
      if (!p.fixed || p.role === "pin" || p.role === "trace") continue;
      const q = ctx.solidOf[p.id]!;
      if (q.z0 <= ctx.b1 + 0.5) continue;
      if (rails.has(p.id)) {
        railSeat(ctx, p, `${p.id}-seat`);
        continue;
      }
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
