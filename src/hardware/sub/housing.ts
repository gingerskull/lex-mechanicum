// H.housing (J2): the live-shaft cartridge behind the base. Two sealed bearings, internal circlips, a wave washer
// preloading the upper bearing (F2, F4), three counterbored socket heads up into the base and two dowels (F1, A11).
// With `eccentric`, an eccentric bushing between housing and base sets the mesh backlash (F7), its arc slots taking
// the housing screws.
import type { Vec2 } from "../../core/geom";
import type { RuleContext } from "../../rules/types";
import { bearing, circlip, disc, dowel, eccentric, plate, screw, waveWasher } from "../primitives";
import { marks, type Solid } from "../solid";
import { BEARINGS, HEADS, circlipInt, type Bearing } from "../tables";

export interface HousingResult {
  housing: Solid;
  z0: number;
  z1: number;
  lower: [number, number];
  upper: [number, number];
  bearing: Bearing;
}

const ECC = 3;

export function housingBearing(d: number): Bearing {
  return [...BEARINGS].filter((b) => b.d === d && b.B <= 7).sort((a, b) => a.D - b.D)[0] ?? { name: "", d, D: d + 8, B: 5 };
}

export function housing(ctx: RuleContext, jid: string, spec: { at: Vec2; d: number; eccentric?: boolean }): HousingResult {
  const b = housingBearing(spec.d);
  const top = spec.eccentric ? ctx.b0 - ECC : ctx.b0;
  const L = Math.max(22, 2 * b.B + 12);
  const z0 = top - L;
  const Rs = b.D / 2 + 4.5;
  const Rh = b.D / 2 + 8.5;
  const head = HEADS.socket[3]!;
  const sAng = [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3];
  const screwsAt = sAng.map((a): Vec2 => [Rs * Math.cos(a), Rs * Math.sin(a)]);
  const dowelsAt = [Math.PI / 6 + Math.PI / 2, Math.PI / 6 + Math.PI / 2 + Math.PI].map((a): Vec2 => [Rs * Math.cos(a), Rs * Math.sin(a)]);
  const G = { at: [spec.at[0], spec.at[1], 0] as [number, number, number], ex: -3, joints: [jid] };
  const h = plate(`${jid}-housing`, disc(Rh), {
    name: `Bearing housing Ø${2 * Rh} x ${L}, screwed and dowelled to the base`,
    kind: "housing",
    ...G,
    z0,
    z1: top,
    holes: [disc(b.D / 2 + 0.15), ...screwsAt.map((p) => disc(1.7, ...p)), ...dowelsAt.map((p) => disc(1.5, ...p))],
    marks: marks("boreEntry", ...screwsAt.map((p) => disc(head.dk / 2 + 0.3, ...p))),
    why: "carries the live shaft in two bearings far apart, behind the base",
  });
  ctx.add(h);
  const lower: [number, number] = [z0 + 1, z0 + 1 + b.B];
  const upper: [number, number] = [top - 1 - b.B, top - 1];
  ctx.add(bearing(`${jid}-hb0`, b, { ...G, z0: lower[0], z1: lower[1], closure: "seal", name: `${b.name ? `Bearing ${b.name}-2RS (${b.d}x${b.D}x${b.B})` : "Bearing"}`, qty: 2 }));
  ctx.add(bearing(`${jid}-hb1`, b, { ...G, z0: upper[0], z1: upper[1], closure: "seal", name: "" }));
  const c = circlipInt(b.D);
  const ww = 0.4;
  ctx.add(circlip(`${jid}-hcl0`, b.D, { internal: true, ...G, z0: lower[1], z1: lower[1] + c.s, qty: 2 }));
  ctx.add(circlip(`${jid}-hcl1`, b.D, { internal: true, ...G, z0: upper[0] - ww - c.s, z1: upper[0] - ww, name: "" }));
  ctx.add(waveWasher(`${jid}-hww`, (b.d + b.D) / 2, b.D - 0.2, { ...G, z0: upper[0] - ww, z1: upper[0], why: "preloads the upper bearing so the shaft has no end float (F4)" }));
  // screws from the counterbores up through the housing (and the eccentric) into the base, 1.5 d in aluminium
  const seat = z0 + 0.2 + head.k;
  screwsAt.forEach((p, k) =>
    ctx.add(screw(`${jid}-hsc${k}`, "socket", 3, ctx.b0 - seat + 4.5, { ...G, at: [spec.at[0] + p[0], spec.at[1] + p[1], 0], face: seat, dir: 1, name: k ? "" : undefined, qty: k ? 0 : 3 })),
  );
  dowelsAt.forEach((p, k) =>
    ctx.add(dowel(`${jid}-hdw${k}`, 3, { ...G, at: [spec.at[0] + p[0], spec.at[1] + p[1], 0], z0: top - 6, z1: ctx.b0 + 4, name: k ? "" : "Dowel pin Ø3 x 10 h6, housing to base", qty: k ? 0 : 2 })),
  );
  const J = ctx.joint(jid);
  if (J) {
    (J.serves.F1 ??= []).push(`${jid}-hdw0`, `${jid}-hdw1`);
    (J.serves.F2 ??= []).push(`${jid}-hcl0`, `${jid}-hcl1`);
    (J.serves.F4 ??= []).push(`${jid}-hww`);
  }
  if (spec.eccentric) {
    const e = eccentric(`${jid}-ecc`, spec.d + 2, 2 * Rh - 10, 0.3, {
      ...G,
      ex: -2,
      z0: top,
      z1: ctx.b0,
      slots: sAng,
      slotR: Rs,
      why: "turned to set the mesh backlash, then clamped by the housing screws (F7)",
    });
    ctx.add(e);
    if (J) (J.serves.F7 ??= []).push(e.id);
  }
  return { housing: h, z0, z1: top, lower, upper, bearing: b };
}
