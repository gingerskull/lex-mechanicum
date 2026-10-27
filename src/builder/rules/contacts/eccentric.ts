// Eccentric: a sheave turning in its strap on a split bronze liner, a cheek ring lapping the strap, an oil nipple.
import { H } from "../../../hardware/primitives";
import { NIPPLES } from "../../../hardware/tables";
import { titleOf } from "../../lib";
import type { Rule } from "../types";
import { bodyOf, contactRule } from "./kit";

/**
 * A sheave turning in its strap (an eccentric): the strap's bore lined with a split bronze liner on the sheave's rim, a
 * cheek ring screwed to the sheave's top face lapping the strap, which its pin at the far end locates the other way
 * (F2), an oil nipple on the strap's ring (F8). The journal is the sheave itself, so there is no pin.
 */
const eccentric = contactRule({
  id: "eccentric",
  ids: ["J3", "F2", "F8", "M14"],
  fixture: "eccentric-sheave",
  kits: ["eccentric"],
  build(ctx, c, L) {
    const id = c.id;
    const rec = c.ji.joint as unknown as { radius: number };
    const R = rec.radius;
    const sheave = ctx.kin.bodies.find((b) => b.id === c.a)?.shape?.type === "disc" ? c.a : c.b;
    const strap = sheave === c.a ? c.b : c.a;
    const zs = ctx.extent(sheave);
    const zt0 = ctx.extent(strap);
    // a strap with a plate of its own on top (a rotor's gear ring) runs on the eccentric with its lower plate
    const tg = ctx.geoms.get(strap);
    const zt = zt0 && tg?.upper ? { ...zt0, w1: zt0.w1 - tg.upper.h } : zt0;
    const z0 = Math.min(zs?.w0 ?? -4, zt?.w0 ?? -4);
    // the sheave's own plate: its slab may be taller (a rotor's gear ring stands over it)
    const sp = ctx.parts.get(sheave);
    const zsTop = zs && sp && sp.op.op === "extrude" ? zs.w0 + sp.op.h : (zs?.w1 ?? 4);
    const z1 = Math.max(zsTop, zt?.w1 ?? 4);
    const bore = ((ctx.kin.bodies.find((b) => b.id === strap)?.shape as { bore?: number } | undefined)?.bore ?? R + 2);
    L.add(H.bushing(`${id}-liner`, 2 * R + 0.1, 2 * bore, { body: bodyOf(ctx, strap), z0: (zt?.w0 ?? z0) + 0.3, z1: (zt?.w1 ?? z1) - 0.3, name: `Split bronze liner ${2 * R}x${2 * bore}, in the strap round the sheave` }));
    const lap = bore + 2;
    L.add(H.washer(`${id}-cheek`, 2 * R - 10, 2 * lap, { body: bodyOf(ctx, sheave), z0: z1 + 0.3, z1: z1 + 2.3, name: `Cheek ring ${2 * R - 10}x${2 * lap}, screwed to the sheave, laps the strap` }));
    // the nipple on the strap's ring, outside the cheek ring, on the side away from the rod; a strap with a plate on top
    // of it is oiled through the shaft instead
    const nip = !tg?.upper;
    if (nip) L.add(H.nipple(`${id}-nip`, { body: bodyOf(ctx, strap), at: [-(lap + NIPPLES.s / 2 + 2), 0, 0], z0: zt?.w1 ?? z1, z1: (zt?.w1 ?? z1) + 9 }));
    const part = ctx.parts.get(strap);
    if (part) part.slides = [...(part.slides ?? []), `${id}-cheek`];
    return {
      serves: { F2: [`${id}-cheek`], F8: nip ? [`${id}-nip`] : [], M14: [`${id}-liner`] },
      note: `${titleOf(id)}: the Ø${2 * R} eccentric turns in its strap on a split bronze liner (the replaceable wear part); a cheek ring on the eccentric's top face laps the strap, ${nip ? "whose pin at the rod end locates it the other way; an oil nipple on the strap's ring feeds the liner" : "whose own gear ring keeps it in mesh the other way; oil comes up through the shaft"}.`,
    };
  },
});

export const ECCENTRIC_KITS: Rule[] = [eccentric];
