// A7, D4, M4: the base plate, 8 mm thick, 2 mm under the lowest part, four counterbored mounting holes on the
// corner-arc centres, traced paths engraved, a 5 mm scale along the front edge. Clearance holes for live shafts are
// cut by J2.
import { bbox, circle } from "../core/geom";
import { marks, solid } from "../hardware/solid";
import { basePlate } from "../model/sample";
import type { Rule } from "./types";

/** Counterbore radius over the mounting hole radius, mm. */
const COUNTERBORE = 2.2;

export const base: Rule = {
  id: "base",
  tier: "AUTO",
  ids: ["A7", "D4", "M4"],
  applies: () => true,
  apply(ctx) {
    const bp = basePlate(ctx.model, ctx.sampled, ctx.form.base);
    const outer = bp.part.shape.outer;
    const [x0, y0, x1] = bbox(outer);
    const r = ctx.form.base.mountHoleR;
    // 5 mm pitch, longer ticks every 10 and 50 mm: 1 mm would be noise at this size
    const scale = [];
    for (let x = Math.ceil((x0 + 30) / 5) * 5; x <= x1 - 30; x += 5) {
      const L = x % 50 === 0 ? 4.5 : x % 10 === 0 ? 3 : 1.6;
      scale.push([[x, y0 + 7], [x, y0 + 7 + L]] as [number, number][]);
    }
    ctx.add(
      solid("base", {
        name: "Base plate",
        kind: "base",
        role: "ground",
        z0: ctx.b0,
        z1: ctx.b1,
        outer,
        holes: bp.corners.map(([x, y]) => circle(r, x, y, 24)),
        marks: [
          ...marks("engrave", ...Object.values(ctx.sampled.traces)),
          ...marks("boreEntry", ...bp.corners.map(([x, y]) => circle(r + COUNTERBORE, x, y, 32))),
          ...marks("scale", ...scale),
        ],
        isBase: true,
        ex: -1,
        mat: "Aluminium 6061-T6, bead-blasted and anodised",
        why: "the bench every other part is located on",
      }),
    );
  },
};
