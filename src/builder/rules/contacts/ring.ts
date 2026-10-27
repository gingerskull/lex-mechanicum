// A ring on its hub, held by a retainer ring, and a ring on rollers, kept apart by a cage ring.
import { H } from "../../../hardware/primitives";
import { mid } from "../../contact";
import { titleOf } from "../../lib";
import type { Rule } from "../types";
import { bodyOf, contactRule } from "./kit";

const ringHub = contactRule({
  id: "ring-hub",
  ids: ["J3", "F2"],
  fixture: "kin:ringHub",
  kits: ["ring-hub"],
  build(ctx, c, L) {
    const id = c.id;
    const z = ctx.extent(c.a)?.w1 ?? 0;
    L.add(H.retainerPlate(`${id}-ret`, 14, 26, { body: "ground", z0: z + 0.5, z1: z + 2.5, name: "Retainer ring over the ring on its hub" }));
    return { serves: { F2: [`${id}-ret`] }, note: `${titleOf(id)}: ring on its hub, held by a retainer ring.` };
  },
});

const ringRollers = contactRule({
  id: "ring-rollers",
  ids: ["J6", "F2"],
  fixture: "kin:ringRollers",
  kits: ["ring-rollers"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.za, mid(c.zb));
    L.add(H.washer(`${id}-cage`, 36, 42, { body: bodyOf(ctx, c.a), z0: z - 1.5, z1: z + 1.5, name: "Roller cage ring, keeps the rollers apart" }));
    return { serves: { F2: [`${id}-cage`] }, note: `${titleOf(id)}: ring on rollers; a cage ring keeps the rollers apart.` };
  },
});

export const RING_KITS: Rule[] = [ringHub, ringRollers];
