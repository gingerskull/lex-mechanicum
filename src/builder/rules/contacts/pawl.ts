// Pawl and tooth: a torsion spring round the pawl's pivot holds it on the teeth.
import { H } from "../../../hardware/primitives";
import { fromPlane } from "../../frames";
import { Local as LocalFrame, titleOf } from "../../lib";
import type { Rule } from "../types";
import { v3, type Vec3 } from "../../../kin/math";
import { contactRule } from "./kit";

/**
 * A pawl (or a jumper) on a tooth: a torsion spring coiled round the pawl's own pivot, above the pawl, one leg on a pin in
 * the base and the other on the pawl, holds it onto the teeth (F6); it stays inside the base whatever the pawl does.
 */
const pawlTooth = contactRule({
  id: "pawl-tooth",
  ids: ["J7", "F6", "F5"],
  fixture: "kin:ratchet",
  kits: ["pawl-tooth"],
  build(ctx, c) {
    const id = c.id;
    const pawl = [c.a, c.b].find((b) => { const r = ctx.kin.bodies.find((q) => q.id === b)?.role; return r === "pawl" || r === "spring"; }) ?? c.a;
    // the pawl's pivot: on the ground (a holding pawl, a jumper) or on the body that carries it (a driving pawl on a lever)
    const pivot = ctx.joints.find((j) => j.joint.type === "revolute" && (j.a === pawl || j.b === pawl) && ![c.a, c.b].includes(j.a === pawl ? j.b : j.a));
    const carrier = pivot ? (pivot.a === pawl ? pivot.b : pivot.a) : "ground";
    const ex = ctx.extent(pawl);
    if (!pivot || !ex) return { note: `${titleOf(id)}: pawl on a tooth.` };
    const z = pivot.axis;
    // the top of the pawl's own part where it stands (a part placed by its joint is not on a slab)
    const part = ctx.parts.get(pawl);
    const top = part && part.op.op === "extrude" ? v3.dot(v3.sub(part.frame.o as Vec3, pivot.at), z) + part.op.h : v3.dot(v3.sub(fromPlane(ex.frame, [0, 0], ex.w1), pivot.at), z);
    const L = new LocalFrame({ o: pivot.at, x: [1, 0, 0], z }, { joints: [id] });
    const stack = ctx.stacks.get(pivot.site ?? pivot.id);
    const d = stack?.d ?? 4;
    // the coil sits on the pawl's boss, round the pin's head
    const D = d + 9;
    L.add(H.spring(`${id}-spring`, "torsion", { body: carrier, D, wire: 0.8, z0: top + 0.3, z1: top + 3.3, name: `Torsion spring Ø${D}, wire 0.8: holds the pawl on the teeth` }));
    ctx.add(L.out());
    return { serves: { F6: [`${id}-spring`] }, note: `${titleOf(id)}: pawl on a tooth; a torsion spring round its pivot holds it on the teeth.` };
  },
});

export const PAWL_KITS: Rule[] = [pawlTooth];
