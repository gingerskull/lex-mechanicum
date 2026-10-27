// Belt and flexible member (J8, J12): an idler on the slack span, and a rope's end on a becket pin under a guard over
// its sheave.
import { circle, roundRect, type Vec2 } from "../../../core/geom";
import { H } from "../../../hardware/primitives";
import { planeCoords } from "../../frames";
import type { BuildCtx } from "../../ctx";
import { type Contact, freeSpot, mid, stadium } from "../../contact";
import { Local, titleOf } from "../../lib";
import type { Rule } from "../types";
import { v3 } from "../../../kin/math";
import { type KitBuild, ROLLER, contactRule } from "./kit";

/** An idler on the slack span: a flanged flat pulley on a stud through an arm slotted across the span, on two posts (F7, F10). */
function idler(ctx: BuildCtx, c: Contact, L: Local, what: string): ReturnType<KitBuild> {
  const id = c.id;
  const ga = ctx.geoms.get(c.a);
  const gb = ctx.geoms.get(c.b);
  const pa = ga ? ga.frame.o : c.at;
  const pb = gb ? gb.frame.o : c.at;
  const span = v3.sub(pb, pa);
  const mid3 = v3.add(pa, v3.mul(span, 0.35));
  const along = v3.unit(span);
  const nrm = v3.cross(c.frame.z, along);
  const R = 9;
  const z = mid(c.za, mid(c.zb));
  const p0 = planeCoords(c.frame, c.at).uv;
  const tries: Vec2[] = [];
  for (const side of [1, -1]) for (const off of [14, 20, 28, 40]) tries.push([side * off, 0]);
  const centre = planeCoords(c.frame, mid3).uv;
  const nuv = planeCoords({ ...c.frame, o: [0, 0, 0] }, nrm).uv;
  const spot = freeSpot(ctx, centre, R, tries.map(([s]) => [nuv[0] * s, nuv[1] * s] as Vec2), c.frame.o[2] + z - 6, c.frame.o[2] + z + 8);
  if (!spot) {
    ctx.issues.push(`${id}: no free place for an idler on the span`);
    return { note: `${titleOf(id)}: ${what}; no free place for the idler found.` };
  }
  const q: Vec2 = [spot[0] - p0[0], spot[1] - p0[1]];
  L.add(H.bearing(`${id}-idler-brg`, ROLLER, { at: [q[0], q[1], 0], z0: z - 2.5, z1: z + 2.5, closure: "seal" }));
  L.add(H.solid(`${id}-idler`, { name: `Flat idler Ø${2 * R}, flanged`, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6, anodised", outer: circle(R, q[0], q[1], 36), holes: [circle(ROLLER.D / 2, q[0], q[1], 24)], z0: z - 3, z1: z + 3, D: 2 * R }));
  L.add(H.plate(`${id}-arm`, roundRect(q[0] - 6, q[1] - 22, q[0] + 6, q[1] + 22, 3), { kind: "bracket", role: "ground", name: "Idler arm, slotted across the span", z0: z + 4, z1: z + 8, holes: [stadium(q[1] - 12, q[1] + 12, 2.6).map(([a, b]): Vec2 => [q[0] + b * 0 + (a - q[1]) * 0 + 0, a])] }));
  void idler;
  return { serves: { F7: [`${id}-arm`], F10: [`${id}-idler`] }, note: `${titleOf(id)}: ${what}; idler on a sealed bearing on a stud through an arm slotted across the span, for the take-up.` };
}

const j8 = contactRule({ id: "j8-belt", ids: ["J8", "V4"], fixture: "kin:beltDrive", kits: ["J8"], build: (ctx, c, L) => idler(ctx, c, L, "belt") });
// a timing belt between two pulleys is built by src/builder/flexible.ts
const j12 = contactRule({ id: "j12-other", ids: ["J12", "F7"], fixture: "kin:cableLoop", kits: ["J12"], skip: (ji) => ["belt", "chain", "rope", "cvt"].includes(String((ji.joint as unknown as Record<string, unknown>).flexible)), build: (ctx, c, L) => idler(ctx, c, L, "flexible member") });

const strapSheave = contactRule({
  id: "strap-sheave",
  ids: ["J12", "F1", "F2", "A11"],
  fixture: "kin:rope",
  kits: ["strap-sheave"],
  // a rope reeved over sheaves is built by src/builder/flexible.ts
  skip: (ji) => String((ji.joint as unknown as Record<string, unknown>).flexible) === "rope" && !!(ji.joint as unknown as Record<string, unknown>).ends,
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.za, mid(c.zb));
    L.add(H.dowel(`${id}-becket`, 4, { body: "ground", at: [8, 0, 0], z0: z - 5, z1: z + 5, name: "Becket pin Ø4, in a post screwed to the base" }));
    L.add(H.collar(`${id}-thimble`, 4, 10, { body: "ground", at: [8, 0, 0], z0: z - 2, z1: z + 2, name: "Thimble Ø10 on the becket pin" }));
    L.add(H.plate(`${id}-guard`, roundRect(-16, -16, 16, 16, 4), { body: "ground", kind: "bracket", role: "ground", name: "Guard over the sheave, keeps the rope in its groove", z0: z + 4, z1: z + 6.5 }));
    return { serves: { F1: [`${id}-becket`], F2: [`${id}-guard`] }, note: `${titleOf(id)}: rope end on a becket pin with a thimble; a guard over the sheave keeps the rope in its groove.` };
  },
});

export const FLEXIBLE_KITS: Rule[] = [j8, j12, strapSheave];
