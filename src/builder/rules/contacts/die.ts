// Die: a round bronze die on a stud or spigot in a curved link's slotted upper cheek (an expansion link).
import { H } from "../../../hardware/primitives";
import { titleOf } from "../../lib";
import type { Rule } from "../types";
import { v3 } from "../../../kin/math";
import { bodyOf, contactRule } from "./kit";

/**
 * A die in a curved link's slot (an expansion link): a bronze die, round so it sits any way in the curve, on a hardened
 * stud pressed into the pin carrier, running in the slotted upper cheek over the solid lower one (M14: the die is the
 * wear part).
 */
const die = contactRule({
  id: "die",
  ids: ["J4", "M14"],
  fixture: "walschaerts-valve-gear",
  kits: ["die"],
  build(ctx, c, L) {
    const id = c.id;
    const g = ctx.geoms.get(c.b);
    const zl = ctx.extent(c.b);
    const za = ctx.extent(c.a);
    if (!g?.upper || !zl || !za) return { note: `${titleOf(id)}: pin in a curved slot.` };
    const sa = (g.shape.profile as { slotArc?: { width?: number } }).slotArc ?? {};
    const D = (sa.width ?? 15) - 0.4;
    const z0 = zl.w1 - g.upper.h + 0.3;
    const z1 = zl.w1 - 0.3;
    // a pin through the same point (the lifting link's on the radius rod) carries the die on a spigot down from its
    // lowest part; else a stud pressed into the pin carrier does
    const site = ctx.sites.find((s) => !s.fixed && v3.dist(s.at, c.at) < 0.05);
    const lowest = site ? site.bodies.map((b) => ({ b, e: ctx.extent(b) })).filter((x) => x.e).sort((x, y) => x.e!.w0 - y.e!.w0)[0] : undefined;
    const carrier = lowest ? lowest.b : bodyOf(ctx, c.a);
    const top = lowest ? lowest.e!.w0 : za.w0 + Math.min(6, za.w1 - za.w0 - 1);
    L.add(H.roller(`${id}-die`, 6, D, { body: carrier, z0, z1, name: `Die, bronze, Ø${+D.toFixed(1)}, runs in the link's slot` }));
    L.add(H.shaft(`${id}-stud`, { d: 6, z0: z0 - 0.2, z1: top }, { body: carrier, name: lowest ? "Die spigot Ø6, screwed into the pin below its lowest part" : "Die stud Ø6, hardened, pressed into the pin carrier" }));
    return { serves: { M14: [`${id}-die`] }, note: `${titleOf(id)}: a round bronze die on a hardened stud runs in the link's curved slot, in the upper cheek over the solid lower one that carries the trunnion; the die is the replaceable wear part.` };
  },
});

export const DIE_KITS: Rule[] = [die];
