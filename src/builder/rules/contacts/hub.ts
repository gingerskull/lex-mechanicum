// Hub: a part turning on a fixed hub screwed to the base, on a split bronze liner under a cap ring.
import { circle } from "../../../core/geom";
import { H } from "../../../hardware/primitives";
import { titleOf } from "../../lib";
import type { Rule } from "../types";
import { baseZ, bodyOf, contactRule } from "./kit";

/**
 * A part that turns on a fixed hub (a bull gear round the pivot of the lever it drives): the hub a post of the radius
 * the joint gives, screwed to the base, the part on a split bronze liner round it, a cap ring screwed on the hub's top
 * lapping the part (F2). Another pivot may stand inside the hub: the cap is a ring round it.
 */
const hub = contactRule({
  id: "hub",
  ids: ["J1", "F1", "F2", "M14"],
  fixture: "whitworth",
  kits: ["hub"],
  build(ctx, c, L) {
    const id = c.id;
    const R = (c.ji.joint as unknown as { radius: number }).radius;
    const part = c.a === "ground" ? c.b : c.a;
    const ze = ctx.extent(part);
    const pp = ctx.parts.get(part);
    if (!ze || !pp || !ctx.base) return { note: `${titleOf(id)}: a part on a fixed hub.` };
    const top = ze.w0 + (pp.op.op === "extrude" ? pp.op.h : ze.w1 - ze.w0);
    const baseTop = baseZ(ctx, c);
    const bore = (ctx.kin.bodies.find((b) => b.id === part)?.shape as { bore?: number } | undefined)?.bore;
    const rb = bore ? bore / 2 : R + 2;
    L.add(H.plate(`${id}-hub`, circle(R, 0, 0, 96), { body: "ground", kind: "housing", role: "ground", name: `Fixed hub Ø${2 * R}, screwed to the base`, z0: baseTop, z1: top - 0.3, mat: "Steel C45, ground" }));
    L.add(H.bushing(`${id}-liner`, 2 * R + 0.1, 2 * rb, { body: bodyOf(ctx, part), z0: ze.w0 + 0.3, z1: top - 0.3, name: `Split bronze liner ${2 * R}x${2 * rb}, in the part round the hub` }));
    const ri = R - 3;
    L.add(H.plate(`${id}-cap`, circle(rb + 2, 0, 0, 96), { body: "ground", kind: "plate", role: "ground", name: `Cap ring Ø${2 * (rb + 2)}, screwed on the hub, laps the part`, z0: top + 0.3, z1: top + 2.3, holes: [circle(ri, 0, 0, 64).reverse()], mat: "Steel, hardened" }));
    for (let k = 0; k < 3; k++) {
      const a = Math.PI / 6 + (k * 2 * Math.PI) / 3;
      L.add(H.screw(`${id}-sc${k}`, "csk", 3, 8, { body: "ground", at: [(R - 1.5) * Math.cos(a), (R - 1.5) * Math.sin(a), 0], face: top + 2.3, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 3 }) }));
    }
    const pt = ctx.parts.get(part);
    if (pt) pt.slides = [...(pt.slides ?? []), `${id}-cap`, `${id}-hub`];
    return {
      serves: { F1: [`${id}-hub`], F2: [`${id}-cap`], M14: [`${id}-liner`] },
      note: `${titleOf(id)}: the part turns on a fixed hub Ø${2 * R} screwed to the base through slotted holes (it slides to set a mesh's backlash), on a split bronze liner (the wear part); a cap ring on the hub's top laps it; a pivot that stands inside it rises through the hub.`,
    };
  },
});

export const HUB_KITS: Rule[] = [hub];
