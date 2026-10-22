// The kits of a cycloidal (pin-ring) drive, built in world axes about the drive's centre:
//  - eccentric-bearing: a disc that runs on an eccentric (a cam keyed to its shaft, a revolute between them whose pin is
//    the eccentric's centre): a needle roller ring in the disc's bore, round the eccentric (J3, F2);
//  - pin-ring: N ring pins fixed to the ground on a circle, the lobed disc rolling on them (J6): each a hardened roller on
//    a pin pressed into a ring housing on the base, a cover ring over the pin tops holding them (F1, F2), drawn
//    see-through where it laps the disc (T10);
//  - pin-hole: the output pins (`count` of them, fixed to the output flange on a circle) running in the disc's holes, which
//    are larger than the pins by the eccentricity (J4, M14): a roller sleeve on each pin.
import { circle, type Vec2 } from "../../core/geom";
import { H } from "../../hardware/primitives";
import type { BuildCtx } from "../ctx";
import { frameAlong } from "../frames";
import { Local, titleOf } from "../lib";
import type { Rule } from "./types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const shapeOf = (ctx: BuildCtx, id: string) => (ctx.kin.bodies.find((b) => b.id === id)?.shape ?? {}) as Record<string, unknown>;

/** A body's part's world z range. */
function zOf(ctx: BuildCtx, body: string): [number, number] | null {
  const p = ctx.parts.get(body);
  if (!p) return null;
  const h = p.op.op === "extrude" ? p.op.h : 6;
  return [p.frame.o[2], p.frame.o[2] + h];
}

export const eccentricBearing: Rule = {
  id: "eccentric-bearing",
  tier: "AUTO",
  ids: ["J3", "F2"],
  fixture: "cycloidal-drive",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "eccentric-bearing"),
  apply(ctx) {
    for (const j of ctx.joints.filter((q) => q.kit === "eccentric-bearing")) {
      const ecc = typeof shapeOf(ctx, j.a).offset === "number" ? j.a : j.b;
      const disc = ecc === j.a ? j.b : j.a;
      const r = num(shapeOf(ctx, ecc).radius, 12);
      const z = zOf(ctx, disc);
      if (!z) continue;
      const L = new Local(frameAlong([j.at[0]!, j.at[1]!, 0], [0, 0, 1], [1, 0, 0]), { joints: [j.id] });
      // the needle ring rides the disc; the bore it sits in is cut by the disc's own shape
      L.add(H.solid(`${j.id}-needles`, { name: `Needle roller ring ${2 * r}x${2 * r + 6}, caged`, kind: "bearing", role: "bearing", mat: "Bearing steel 100Cr6", outer: circle(r + 2.95, 0, 0, 48), holes: [circle(r + 0.05, 0, 0, 48).reverse()], z0: z[0] + 0.5, z1: z[1] - 0.5, body: disc }));
      ctx.add(L.out());
      ctx.note({ id: j.id, kit: "eccentric-bearing", at: j.at, title: `eccentric-bearing · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the ${disc} runs on the Ø${2 * r} eccentric, keyed to the input shaft, on a caged needle roller ring in its bore; the eccentric's faces and the parts above and below hold the ring.`, serves: { F2: [`${j.id}-needles`] }, badge: ["needle ring", "ok"] });
    }
  },
};

export const pinRing: Rule = {
  id: "pin-ring",
  tier: "AUTO",
  ids: ["J6", "F1", "F2"],
  fixture: "cycloidal-drive",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "pin-ring"),
  apply(ctx) {
    for (const j of ctx.joints.filter((q) => q.kit === "pin-ring")) {
      const disc = j.a === "ground" ? j.b : j.a;
      const pins = (shapeOf(ctx, "ground").pins ?? {}) as Record<string, unknown>;
      const N = num(pins.count, 10);
      const rr = num(pins.radius, 5);
      const R = num(pins.circle, 50);
      const z = zOf(ctx, disc);
      if (!z || !ctx.base) continue;
      const c: Vec2 = [num((ctx.kin.joints.find((q) => q.id === j.id)?.ca as number[] | undefined)?.[0], 0), num((ctx.kin.joints.find((q) => q.id === j.id)?.ca as number[] | undefined)?.[1], 0)];
      const L = new Local(frameAlong([c[0], c[1], 0], [0, 0, 1], [1, 0, 0]), { joints: [j.id] });
      const bt = ctx.base.top;
      const top = z[1] + 0.5;
      // the housing ring under the disc, round the parts under it, from the base; the cover ring over the pin tops
      const rIn = R - rr - 3;
      const rOut = R + rr + 9;
      const pinHoles = (r: number) => Array.from({ length: N }, (_, k) => circle(r, R * Math.cos((k * 2 * Math.PI) / N), R * Math.sin((k * 2 * Math.PI) / N), 20).reverse());
      L.add(H.plate(`${j.id}-housing`, circle(rOut, 0, 0, 96), { body: "ground", kind: "housing", name: `Pin ring housing Ø${2 * rOut}, the ring pins pressed in`, z0: bt, z1: z[0] - 0.5, holes: [circle(rIn, 0, 0, 96).reverse(), ...pinHoles(rr - 2)] }));
      L.add(H.plate(`${j.id}-cover`, circle(rOut, 0, 0, 96), { body: "ground", kind: "plate", name: "Cover ring over the pin tops, screwed to them", z0: top, z1: top + 4, holes: [circle(rIn, 0, 0, 96).reverse(), ...pinHoles(1.7)] }));
      for (let k = 0; k < N; k++) {
        const a = (k * 2 * Math.PI) / N;
        const p: [number, number, number] = [R * Math.cos(a), R * Math.sin(a), 0];
        const first = k === 0;
        L.add(H.dowel(`${j.id}-pin${k}`, 2 * rr - 4, { body: "ground", at: p, z0: bt - 0.5, z1: top, ...(first ? { name: `Ring pin Ø${2 * rr - 4}, hardened, pressed into the housing`, qty: N } : { name: "", qty: 0 }) }));
        L.add(H.roller(`${j.id}-roller${k}`, 2 * rr - 4, 2 * rr, { body: "ground", at: p, z0: z[0], z1: z[1], ...(first ? { qty: N } : { name: "", qty: 0 }) }));
        L.add(H.screw(`${j.id}-sc${k}`, "csk", 3, 10, { body: "ground", at: p, face: top + 4, dir: -1, ...(first ? { qty: N } : { name: "", qty: 0 }) }));
      }
      // the housing stands on the base: screwed up from under it
      for (let k = 0; k < 4; k++) {
        const a = Math.PI / 4 + (k * Math.PI) / 2;
        L.add(H.screw(`${j.id}-hs${k}`, "socket", 4, ctx.base.top - ctx.base.bottom + 8, { body: "ground", at: [(R + rr + 5) * Math.cos(a), (R + rr + 5) * Math.sin(a), 0], face: ctx.base.bottom, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 4 }) }));
        ctx.baseHoles.push({ at: [c[0] + (R + rr + 5) * Math.cos(a), c[1] + (R + rr + 5) * Math.sin(a)], r: 2.2, joint: j.id });
      }
      const out = L.out();
      // the cover laps the disc: drawn see-through so the lobes on the pins stay in view (T10)
      for (const s of out) if (s.id === `${j.id}-cover`) s.flags.seeThrough = true;
      ctx.add(out);
      ctx.covers.set(`${j.id}-cover`, [disc]);
      ctx.note({ id: j.id, kit: "pin-ring", at: j.at, title: `pin-ring · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: ${N} hardened rollers Ø${2 * rr} on pins pressed into a ring housing on the base, the disc's lobes rolling on them; a cover ring screwed to the pin tops holds the pins at both ends; the reaction goes through the pins into the housing and the base.`, serves: { F1: [`${j.id}-housing`], F2: [`${j.id}-cover`] }, badge: ["pin ring", "ok"] });
    }
  },
};

export const pinHole: Rule = {
  id: "pin-hole",
  tier: "AUTO",
  ids: ["J4", "M14"],
  fixture: "cycloidal-drive",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "pin-hole"),
  apply(ctx) {
    for (const j of ctx.joints.filter((q) => q.kit === "pin-hole")) {
      const kj = ctx.kin.joints.find((q) => q.id === j.id)!;
      const slotBody = String((kj.slot as Record<string, unknown> | undefined)?.body ?? j.b);
      const carrier = slotBody === j.a ? j.b : j.a;
      const sh = shapeOf(ctx, carrier);
      const pins = (sh.pins ?? {}) as Record<string, unknown>;
      const n = num(pins.count, 1);
      const r = num(pins.radius, 4);
      const Rc = num(pins.circle, 20);
      const start = num(pins.start, 0);
      const zc = zOf(ctx, carrier);
      const zd = zOf(ctx, slotBody);
      const part = ctx.parts.get(carrier);
      if (!zc || !zd || !part) continue;
      // the pins stand on the carrier's face toward the disc and run through the disc's holes
      const up = zd[0] > zc[0];
      const z0 = up ? zc[0] : zd[0] - 1;
      const z1 = up ? zd[1] + 1 : zc[1];
      // in world axes: the pins on their circle about the carrier's centre, angles from the carrier's x
      const L = new Local(frameAlong([0, 0, 0], [0, 0, 1], [1, 0, 0]), { joints: [j.id] });
      const a0 = Math.atan2(part.frame.x[1]!, part.frame.x[0]!);
      for (let k = 0; k < n; k++) {
        const a = a0 + ((start + (k * 360) / n) * Math.PI) / 180;
        const p: [number, number, number] = [part.frame.o[0] + Rc * Math.cos(a), part.frame.o[1] + Rc * Math.sin(a), 0];
        const first = k === 0;
        L.add(H.dowel(`${j.id}-pin${k}`, 2 * r - 2, { body: carrier, at: p, z0, z1, ...(first ? { name: `Output pin Ø${2 * r - 2}, pressed into the flange`, qty: n } : { name: "", qty: 0 }) }));
        L.add(H.roller(`${j.id}-sleeve${k}`, 2 * r - 2, 2 * r, { body: carrier, at: p, z0: zd[0] + 0.5, z1: zd[1] - 0.5, ...(first ? { name: `Roller sleeve Ø${2 * r} on the output pin`, qty: n } : { name: "", qty: 0 }) }));
      }
      ctx.add(L.out());
      ctx.note({ id: j.id, kit: "pin-hole", at: j.at, title: `pin-hole · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: ${n} output pins Ø${2 * r - 2} pressed into the ${carrier}, each with a Ø${2 * r} roller sleeve running round its hole in the ${slotBody} (the hole larger by the eccentricity), so the disc's turn passes to the ${carrier} and its wobble does not.`, serves: {}, badge: ["output pins", "ok"] });
    }
  },
};
