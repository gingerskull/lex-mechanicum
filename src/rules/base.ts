// A7, D4, M4: the base plate, 8 mm thick, 2 mm under the lowest part, four counterbored mounting holes on the
// corner-arc centres, traced paths engraved, a 5 mm scale along the front edge. Clearance holes for live shafts are
// cut by J2.
import { bbox, circle, roundRect } from "../core/geom";
import { marks, solid, type Mark } from "../hardware/solid";
import { basePlate } from "../model/sample";
import type { Rule, RuleContext } from "./types";

/** Counterbore radius over the mounting hole radius, mm. */
const COUNTERBORE = 2.2;

/** Corner-arc centres of a base outline (D4): mounting holes and feet sit here. */
export function baseCorners(ctx: RuleContext): [number, number][] {
  const [x0, y0, x1, y1] = bbox(ctx.get("base")!.outer);
  const r = ctx.form.base.cornerR;
  return [[x0 + r, y0 + r], [x1 - r, y0 + r], [x1 - r, y1 - r], [x0 + r, y1 - r]];
}

function scaleMarks(x0: number, x1: number, y0: number): Mark[] {
  // 5 mm pitch, longer ticks every 10 and 50 mm: 1 mm would be noise at this size
  const out: Mark[] = [];
  for (let x = Math.ceil((x0 + 30) / 5) * 5; x <= x1 - 30; x += 5) {
    const L = x % 50 === 0 ? 4.5 : x % 10 === 0 ? 3 : 1.6;
    out.push({ kind: "scale", pts: [[x, y0 + 7], [x, y0 + 7 + L]] });
  }
  return out;
}

/** Grows the base plate to cover a box (the drive's bracket), moving its mounting holes, counterbores and scale. */
export function growBase(ctx: RuleContext, box: [number, number, number, number]): void {
  const b = ctx.get("base")!;
  const [a0, a1, a2, a3] = bbox(b.outer);
  const x0 = Math.min(a0, box[0]);
  const y0 = Math.min(a1, box[1]);
  const x1 = Math.max(a2, box[2]);
  const y1 = Math.max(a3, box[3]);
  b.outer = roundRect(x0, y0, x1, y1, ctx.form.base.cornerR);
  const r = ctx.form.base.mountHoleR;
  const corners = baseCorners(ctx);
  b.holes.splice(0, 4, ...corners.map(([x, y]) => circle(r, x, y, 24)));
  const cb = b.marks.filter((m) => m.kind === "boreEntry").slice(0, 4);
  b.marks = b.marks.filter((m) => !cb.includes(m) && m.kind !== "scale");
  b.marks.push(...marks("boreEntry", ...corners.map(([x, y]) => circle(r + COUNTERBORE, x, y, 32))), ...scaleMarks(x0, x1, y0));
}

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
          ...scaleMarks(x0, x1, y0),
        ],
        isBase: true,
        ex: -1,
        mat: "Aluminium 6061-T6, bead-blasted and anodised",
        why: "the bench every other part is located on",
      }),
    );
  },
};
