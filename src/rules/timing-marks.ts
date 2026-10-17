// F9: marks for reassembly in phase. Match marks on both gears at the pitch point of every mesh, a zero line on every
// cam and an index line on the base under it. Linkage phase marks are the polish's.
import { toLocal } from "../core/poly";
import { poseOf } from "../model/pose";
import type { Rule } from "./types";

export const timingMarks: Rule = {
  id: "timing-marks",
  tier: "AUTO",
  ids: ["F9"],
  applies: (ctx) => ctx.info.some((j) => j.kind === "mesh" || j.kind === "cam"),
  apply(ctx) {
    for (const j of ctx.info) {
      if (j.kind === "mesh") {
        for (const g of [j.a, j.b]) {
          const q = poseOf(g, ctx.s0);
          const host = ctx.solidOf[g.id];
          if (!q || !host || !g.m) continue;
          const l = toLocal(q, j.at);
          const r = Math.hypot(l[0], l[1]) || 1;
          const u: [number, number] = [l[0] / r, l[1] / r];
          // a short line just inside the pitch point, on the tooth (one gear) and the gap (the other) that meet
          const r0 = r - 2.2 * g.m;
          const r1 = r - 1.3 * g.m;
          host.marks.push({ kind: "timing", pts: [[u[0] * r0, u[1] * r0], [u[0] * r1, u[1] * r1]] });
        }
        (ctx.joint(j.id)!.serves.F9 ??= []).push(j.a.id, j.b.id);
      }
      if (j.kind === "cam") {
        const host = ctx.solidOf[j.cam.id];
        const q = poseOf(j.cam, ctx.s0);
        if (!host || !q) continue;
        const r = Math.max(...j.cam.shape.outer.map(([x, y]) => Math.hypot(x, y)));
        host.marks.push({ kind: "timing", pts: [[r * 0.3, 0], [r - 1.5, 0]] });
        ctx.get("base")?.marks.push({ kind: "timing", pts: [[q[0] + r + 2, q[1]], [q[0] + r + 6, q[1]]] });
        (ctx.joint(j.id)!.serves.F9 ??= []).push(j.cam.id);
      }
    }
  },
};
