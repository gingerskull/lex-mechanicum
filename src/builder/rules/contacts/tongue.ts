// Tongue in slot: liners on the slot's walls and a grease nipple into the slot.
import { H } from "../../../hardware/primitives";
import { fromPlane, planeCoords } from "../../frames";
import { MIN_GAP } from "../../constants";
import { clearance } from "../../router";
import { mid } from "../../contact";
import { Local, titleOf } from "../../lib";
import type { Rule } from "../types";
import { v3 } from "../../../kin/math";
import { bodyOf, contactRule } from "./kit";

const tongueSlot = contactRule({
  id: "tongue-slot",
  ids: ["J5", "F8", "M14"],
  fixture: "kin:tongueSlot",
  kits: ["tongue-slot"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.zb, mid(c.za));
    const run = Math.max(8, c.run[1] - c.run[0]);
    // the slotted body names its slot (`slot: { width, length }`): the liners line its walls, the nipple greases it from
    // its far end, pointing out along it (an Oldham hub, whose face the disc sweeps over); else a narrow slot in b
    const shapeOf = (b: string) => ctx.kin.bodies.find((q) => q.id === b)?.shape as { slot?: { width?: number; length?: number } } | undefined;
    const slotted = [c.b, c.a].find((b) => shapeOf(b)?.slot);
    const slot = slotted ? shapeOf(slotted)!.slot! : undefined;
    const body = bodyOf(ctx, slotted ?? c.b);
    const half = slot?.width ? slot.width / 2 - 0.6 : 4;
    // the slot's walls are the slotted body's jaws (`bars`) where it has them: the liners run their height
    const g0 = slotted ? ctx.geoms.get(slotted) : undefined;
    const jaws = (g0?.shape.bars as { z?: [number, number] }[] | undefined)?.map((b) => b.z).filter((q): q is [number, number] => Array.isArray(q));
    const wz = (h: number) => (g0 ? planeCoords(L.frame, v3.add(g0.frame.o, v3.mul(g0.frame.z, h))).w : z);
    const [lz0, lz1] = jaws?.length ? ([wz(Math.min(...jaws.map((q) => q[0]))), wz(Math.max(...jaws.map((q) => q[1])))].sort((p, q) => p - q) as [number, number]) : [z - 2, z + 2];
    for (const [k, y] of [[0, half], [1, -half]] as const) L.add(H.wearStrip(`${id}-liner${k}`, [[-run / 2 - 4, y - 0.6], [run / 2 + 4, y - 0.6], [run / 2 + 4, y + 0.6], [-run / 2 - 4, y + 0.6]], { body, z0: lz0 + 0.5, z1: lz1 - 0.5, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    if (slot?.length && slotted) {
      // the slot runs symmetric about the slotted body's centre; the nipple stands at its end beyond the liners
      const g = ctx.geoms.get(slotted);
      const cx = g ? planeCoords(L.frame, g.frame.o).uv[0] : 0;
      // at whichever end of the slot it keeps clear of the supports and the other parts' sweeps
      const at = (sg: 1 | -1) => {
        const f = { o: fromPlane(L.frame, [cx + (sg * (slot.length ?? 0)) / 2, 0], (lz0 + lz1) / 2), x: L.frame.z, z: v3.mul(L.frame.x, sg) };
        const N = new Local(f, { joints: [id] });
        N.add(H.nipple(`${id}-nip`, { body, z0: 0, z1: 9 }));
        return N.out();
      };
      const plus = at(1);
      ctx.add(clearance(ctx, plus, (q) => q.body === body) >= MIN_GAP ? plus : at(-1));
    } else L.add(H.nipple(`${id}-nip`, { body, at: [0, 9, 0], z0: z, z1: z + 9 }));
    return { serves: { M14: [`${id}-liner0`], F8: [`${id}-nip`] }, note: `${titleOf(id)}: tongue in its slot; liners on both sides and a grease nipple into the slot.` };
  },
});

export const TONGUE_KITS: Rule[] = [tongueSlot];
