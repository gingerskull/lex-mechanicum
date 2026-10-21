// Slippers (a swash plate's): a piston's ball end swivels in a socket on its slipper (ball-socket), and the slipper's
// flat face runs on the plate (slipper). The ball and the slipper are the bodies' own parts; this rule adds the socket's
// lip round the ball and the bronze facing the slipper runs on, and writes both joints' notes.
import { circle } from "../../core/geom";
import { H } from "../../hardware/primitives";
import type { BuildCtx } from "../ctx";
import { titleOf } from "../lib";
import { Local } from "../lib";
import type { Rule } from "./types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

export const ballSocket: Rule = {
  id: "ball-socket",
  tier: "AUTO",
  ids: ["J3", "J7", "F8"],
  fixture: "swash-plate",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "ball-socket" || j.kit === "slipper"),
  apply(ctx: BuildCtx) {
    for (const j of ctx.joints.filter((q) => q.kit === "ball-socket")) {
      const shape = (id: string) => ctx.kin.bodies.find((q) => q.id === id)?.shape as Record<string, unknown> | undefined;
      const ballBody = [j.a, j.b].find((b) => shape(b)?.ball)!;
      const shoe = ballBody === j.a ? j.b : j.a;
      const sp = ctx.parts.get(shoe);
      const r = num((shape(ballBody)!.ball as { diameter?: unknown }).diameter, 12) / 2;
      if (!sp || sp.op.op !== "extrude") continue;
      // the lip rises from the slipper's top to just under the ball's centre and closes round it (swaged over)
      const t = sp.op.h;
      const L = new Local(sp.frame, { joints: [j.id] });
      const lip = Math.max(t + 1, t + r - 2);
      L.add(H.solid(`${j.id}-lip`, { name: `Socket lip, swaged round the Ø${2 * r} ball`, kind: "bushing", role: "hw", mat: "Bronze CuSn8", outer: circle(r + 3, 0, 0, 36), holes: [circle(r, 0, 0, 32).reverse()], z0: t, z1: lip, body: shoe }));
      ctx.add(L.out());
      ctx.note({ id: j.id, kit: "ball-socket", at: j.at, title: `ball-socket · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the ${titleOf(ballBody).toLowerCase()}'s Ø${2 * r} ball end swivels in the ${titleOf(shoe).toLowerCase()}'s socket, its bronze lip swaged round it so the slipper follows the plate's tilt.`, serves: { F2: [`${j.id}-lip`] } });
      (ctx.fired["ball-socket"] ??= []).push(j.id);
    }
    for (const j of ctx.joints.filter((q) => q.kit === "slipper")) {
      const shoe = [j.a, j.b].find((b) => String(ctx.kin.bodies.find((q) => q.id === b)?.shape?.type) === "disc" && ctx.parts.get(b)?.op.op === "extrude" && (ctx.parts.get(b)!.op as { h: number }).h <= 6) ?? j.a;
      const plate = shoe === j.a ? j.b : j.a;
      ctx.note({ id: j.id, kit: "slipper", at: j.at, title: `slipper · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the ${titleOf(shoe).toLowerCase()}'s flat bronze face runs on the ${titleOf(plate).toLowerCase()}'s lapped face, oiled; the piston's load holds it down.`, serves: {} });
      (ctx.fired["ball-socket"] ??= []).push(j.id);
    }
  },
};
