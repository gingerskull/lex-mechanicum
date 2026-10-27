// Pin in a slot (J4) and its kin: a track roller on a stud in a slot cut in the other body, a pin and lobe, and a groove
// cam (a roller in the cam's own groove, or in a slot).
import type { Vec2 } from "../../../core/geom";
import { H } from "../../../hardware/primitives";
import { circlipExt } from "../../../hardware/tables";
import { fromPlane, planeCoords } from "../../frames";
import type { BuildCtx } from "../../ctx";
import { type Contact, cutRing, mid, stadium } from "../../contact";
import { Local, Local as LocalFrame, titleOf } from "../../lib";
import type { Rule } from "../types";
import { v3 } from "../../../kin/math";
import { type KitBuild, ROLLER, bodyOf, contactRule, partId } from "./kit";

/** A track roller on a stud in a slot cut in the other body, wear strips on its walls, a felt oiler. */
function rollerInSlot(ctx: BuildCtx, c: Contact, L: Local, what: string): ReturnType<KitBuild> {
  const id = c.id;
  const d = ROLLER.d;
  const D = 13;
  const zc = mid(c.zb, mid(c.za));
  const rw = 4;
  const lo = Math.min(c.za?.[0] ?? zc, c.zb?.[0] ?? zc) - 0.5;
  const hi = Math.max(c.za?.[1] ?? zc, c.zb?.[1] ?? zc) + 1;
  const carrier = bodyOf(ctx, c.a);
  L.add(H.shaft(`${id}-stud`, { d, z0: lo, z1: hi }, { body: carrier, name: `Stud Ø${d} x ${+(hi - lo).toFixed(1)}, pressed into the pin carrier` }));
  L.add(H.roller(`${id}-roller`, d, D, { body: carrier, z0: zc - rw / 2, z1: zc + rw / 2 }));
  // a wheel that carries its own slots (a Geneva wheel, cut from the record's numbers) needs only the roller and its stud
  if (String(ctx.geoms.get(c.b)?.shape.type ?? "").startsWith("geneva")) return { serves: {}, note: `${titleOf(id)}: ${what}; Ø${D} track roller on a Ø${d} stud pressed into the crank, running in the wheel's own slots.` };
  const sw = (D + 0.4) / 2 + 1.5;
  const relief = 4;
  const x0 = c.run[0] - relief;
  const x1 = c.run[1];
  const sid = partId(ctx, c.b);
  if (sid) cutRing(ctx, c, sid, stadium(x0, x1, sw));
  const z0 = c.zb?.[0] ?? zc - 3;
  const z1 = c.zb?.[1] ?? zc + 3;
  const strips: string[] = [];
  for (const [k, y] of [[0, sw - 0.75], [1, -(sw - 0.75)]] as const) {
    const wall: Vec2[] = [[x0 - D / 2, y - 0.75], [x1 + D / 2, y - 0.75], [x1 + D / 2, y + 0.75], [x0 - D / 2, y + 0.75]];
    L.add(H.wearStrip(`${id}-wear${k}`, wall, { body: bodyOf(ctx, c.b), z0: z0 + 0.5, z1: z1 - 0.5, ...(k ? { name: "" } : { qty: 2 }) }));
    strips.push(`${id}-wear${k}`);
  }
  L.add(H.felt(`${id}-felt`, [[x0 - D / 2 - 3.5, -1.5], [x0 - D / 2 + 0.5, -1.5], [x0 - D / 2 + 0.5, 1.5], [x0 - D / 2 - 3.5, 1.5]], { body: bodyOf(ctx, c.b), z0: z0 + 1, z1: z1 - 1 }));
  void circlipExt;
  return { serves: { F8: [`${id}-felt`], M14: strips }, note: `${titleOf(id)}: ${what}; Ø${D} track roller on a Ø${d} stud, hardened wear strips in the slot walls, a felt oiler in the relieved end.` };
}

const j4 = contactRule({ id: "j4-slot-roller", ids: ["J4", "M14"], fixture: "kin:geneva", kits: ["J4"], build: (ctx, c, L) => rollerInSlot(ctx, c, L, "pin in a slot") });
const pinLobe = contactRule({ id: "pin-lobe", ids: ["J4", "M14"], fixture: "kin:pinLobe", kits: ["pin-lobe"], build: (ctx, c, L) => rollerInSlot(ctx, c, L, "pin and lobe") });
/**
 * A groove cam. Where the cam's own shape carries its groove (a face-groove or barrel cam, cut by the builder from the
 * joint's law) and the record carries the roller, the kit adds what the groove needs: a felt oiler on the follower beside
 * the roller (F8) and a zero line on the cam (F9); the groove holds the follower both ways, so no spring (F6). Otherwise
 * it is a roller in a slot cut in the other body.
 */
const grooveCam = contactRule({
  id: "groove-cam",
  ids: ["J7", "M14"],
  fixture: "kin:grooveCam",
  kits: ["groove-cam"],
  build(ctx, c, L) {
    const camBody = [c.a, c.b].find((b) => { const sh = ctx.geoms.get(b)?.shape; return String(sh?.type) === "cam" && (sh?.form === "face-groove" || sh?.form === "barrel"); });
    if (!camBody) return rollerInSlot(ctx, c, L, "roller in a groove");
    const roller = camBody === c.a ? c.b : c.a;
    const rg = ctx.geoms.get(roller);
    const rr = Number(rg?.shape.radius ?? 5);
    // the body the roller's pin is in: the follower that carries the oiler
    const pinJ = ctx.kin.joints.find((j) => j.type === "revolute" && (j.a === roller || j.b === roller));
    const carrier = pinJ ? (pinJ.a === roller ? pinJ.b : pinJ.a) : roller;
    const exC = ctx.extent(carrier);
    const serves: Record<string, string[]> = {};
    if (rg && exC) {
      // a felt wick on the follower's underside dipping toward the groove, beside the roller, clear of the walls' tops
      const Lw = new LocalFrame({ o: rg.frame.o, x: rg.frame.x, z: rg.frame.z }, { joints: [c.id] });
      const zc = v3.dot(v3.sub(fromPlane(exC.frame, [0, 0], exC.w0), rg.frame.o), rg.frame.z);
      Lw.add(H.felt(`${c.id}-oil`, [[-2, rr + 1.5], [2, rr + 1.5], [2, rr + 4.5], [-2, rr + 4.5]], { body: carrier, z0: zc - 0.8, z1: zc, name: "Felt oiler over the groove, oil-soaked wool felt" }));
      ctx.add(Lw.out());
      serves.F8 = [`${c.id}-oil`];
    }
    const part = ctx.parts.get(camBody);
    if (part) {
      const p = planeCoords(part.frame, c.at).uv;
      const L0 = Math.hypot(p[0], p[1]) || 1;
      const r0 = Number(ctx.geoms.get(camBody)?.shape.bore ?? 10) / 2 + 5;
      part.marks.push({ kind: "timing", pts: [[(p[0] / L0) * r0, (p[1] / L0) * r0], [(p[0] / L0) * (L0 - rr - 3), (p[1] / L0) * (L0 - rr - 3)]] });
      serves.F9 = [camBody];
    }
    void L;
    return { serves, note: `${titleOf(c.id)}: roller in the cam's own groove (form-closed, so no spring); felt oiler over the groove; zero line on the cam.` };
  },
});

export const SLOT_KITS: Rule[] = [j4, pinLobe, grooveCam];
