// Escapement contacts: a pallet's hardened stone on its set screw, and a balance's impulse pin in the lever's fork.
import { circle } from "../../../core/geom";
import { H } from "../../../hardware/primitives";
import { mid } from "../../contact";
import { titleOf } from "../../lib";
import type { Rule } from "../types";
import { bodyOf, contactRule } from "./kit";

const pallet = contactRule({
  id: "pallet-contact",
  ids: ["J7", "F6", "M14"],
  fixture: "kin:escapement",
  kits: ["pallet"],
  build(ctx, c, L) {
    const id = c.id;
    const pal = c.a;
    const z0 = ctx.extent(pal)?.w0 ?? 0;
    const z1 = ctx.extent(pal)?.w1 ?? z0 + 6;
    L.add(H.wearStrip(`${id}-stone`, [[-4, -1.2], [4, -1.2], [4, 1.2], [-4, 1.2]], { body: bodyOf(ctx, pal), z0: z0 + 0.5, z1: z1 - 0.5, name: "Pallet stone, hardened, set in the pallet" }));
    L.add(H.setScrew(`${id}-ss`, 2, { body: bodyOf(ctx, pal), at: [0, 2.5, 0], z0: z0 + 1, z1: z1 - 1, outer: circle(1, 0, 0, 12), name: "Set screw M2, adjusts the pallet stone" }));
    return { serves: { M14: [`${id}-stone`], F6: [`${id}-ss`] }, note: `${titleOf(id)}: pallet contact; a hardened pallet stone set in the pallet and held by a set screw for the adjustment.` };
  },
});

const forkPin = contactRule({
  id: "fork-pin",
  ids: ["J4", "F2"],
  fixture: "kin:fork",
  kits: ["fork-pin"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.zb, mid(c.za));
    L.add(H.roller(`${id}-pin`, 2, 5, { body: bodyOf(ctx, c.a), z0: z - 2, z1: z + 2, name: "Impulse pin Ø5, jewelled, on the balance" }));
    L.add(H.dowel(`${id}-guard`, 2, { body: bodyOf(ctx, c.b), at: [6, 6, 0], z0: z - 3, z1: z + 3, name: "Guard pin Ø2, keeps the lever from tripping" }));
    return { serves: { F2: [`${id}-pin`] }, note: `${titleOf(id)}: impulse pin in the fork; a guard pin beside the fork mouth.` };
  },
});

export const ESCAPEMENT_KITS: Rule[] = [pallet, forkPin];
