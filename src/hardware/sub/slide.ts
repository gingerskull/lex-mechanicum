// H.slide (J5): a prismatic slide on two rails. Keeper plate over one rail (F2), a bronze gib strip with adjusting
// screws and lock nuts on the other (F7), felt wipers at both ends of the slider and a grease nipple feeding the guide
// (F8), end stops with neoprene bumpers just beyond the travel (F5).
import { bbox, type Pose, type Vec2 } from "../../core/geom";
import { toLocal, toWorld } from "../../core/poly";
import { heights } from "../../parts";
import { clearOf } from "../../rules/space";
import type { RuleContext, SlideJoint } from "../../rules/types";
import { bumper, gib, nipple, nut, plate, screw, setScrew, stop, wiper } from "../primitives";
import { solid } from "../solid";

const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [
  [Math.min(x0, x1), Math.min(y0, y1)],
  [Math.max(x0, x1), Math.min(y0, y1)],
  [Math.max(x0, x1), Math.max(y0, y1)],
  [Math.min(x0, x1), Math.max(y0, y1)],
];

export function slide(ctx: RuleContext, j: SlideJoint): void {
  const J = ctx.joint(j.id)!;
  const [ra, rb] = j.rails;
  const F: Pose = rb.fixed!;
  const W = (pts: Vec2[]) => pts.map((p) => toWorld(F, p));
  const yA = toLocal(F, [ra.fixed![0], ra.fixed![1]])[1];
  const sg = Math.sign(yA) || 1;
  const [, , Lr0] = bbox(rb.shape.outer);
  const Lr = Lr0 - 3.5;
  const rz1 = heights(rb)[1];
  const [sz0, sz1] = heights(j.slider);
  const [sx0, sy0, sx1, sy1] = bbox(j.slider.shape.outer);
  const yAi = yA - 3.5 * sg;
  const G = { joints: [j.id], ex: ctx.solidOf[rb.id]!.ex };
  const serve = (k: "F2" | "F5" | "F7" | "F8", id: string) => (J.serves[k] ??= []).push(id);

  // keeper over rail a, riding on a shim so it clears the slider top by 0.3 mm
  const kz0 = sz1 + 0.3;
  const keeper = plate(`${j.id}-keeper`, W(rect(-2.5, Lr + 2.5, yAi - 2 * sg, yA + 3.5 * sg)), { ...G, name: "Keeper plate, holds the slider down", z0: kz0, z1: kz0 + 2.5, mat: "Steel, ground" });
  const shim = solid(`${j.id}-shim`, { ...G, name: "Shim under the keeper", kind: "shim", outer: W(rect(-2.5, Lr + 2.5, yA - 3.5 * sg, yA + 3.5 * sg)), z0: rz1, z1: kz0, mat: "Steel shim stock" });
  ctx.add(keeper, shim);
  serve("F2", keeper.id);
  [0.15, 0.5, 0.85].forEach((f, k) => {
    const p = toWorld(F, [Lr * f, yA]);
    ctx.add(screw(`${j.id}-keeper-sc${k}`, "button", 3, keeper.z1 - rz1 + 4, { ...G, at: [p[0], p[1], 0], face: keeper.z1, dir: -1, name: k ? "" : undefined, qty: k ? 0 : 3 }));
  });

  // gib along rail b's inner edge, adjusting screws and lock nuts on its outer half (F7)
  const g = gib(`${j.id}-gib`, Lr, { ...G, outer: W(rect(0, Lr, 1 * sg, 3.5 * sg)), z0: rz1, z1: sz1 - 0.2 });
  ctx.add(g);
  serve("F7", g.id);
  [0.2, 0.5, 0.8].forEach((f, k) => {
    const p = toWorld(F, [Lr * f, -2 * sg]);
    const at: [number, number, number] = [p[0], p[1], 0];
    ctx.add(setScrew(`${j.id}-gib-ss${k}`, 2.5, { ...G, at, z0: rz1, z1: rz1 + 3, name: k ? "" : "Gib adjusting screw M2.5 (DIN 916)", qty: k ? 0 : 3, group: `${j.id}-gib-ss${k}` }));
    ctx.add(nut(`${j.id}-gib-nut${k}`, 2.5, { ...G, at, z0: rz1, z1: rz1 + 2, name: k ? "" : "Lock nut M2.5", qty: k ? 0 : 3, lock: "jam nut", group: `${j.id}-gib-ss${k}` }));
  });

  // felt wipers at both ends of the slider (F8)
  const sl = ctx.solidOf[j.slider.id]!;
  for (const [k, x0, x1] of [[0, sx1, sx1 + 2], [1, sx0 - 2, sx0]] as const) {
    const w = wiper(`${j.id}-wiper${k}`, rect(x0, x1, sy0 + 1, sy1 - 1), { body: j.slider.id, z0: sz0 + 1, z1: sz1 - 1, ex: sl.ex, joints: [j.id], name: k ? "" : undefined, qty: k ? 0 : 2 });
    ctx.add(w);
    serve("F8", w.id);
  }

  // end stops (F5): a hardened block with a neoprene pad, 1.5 mm past each end of the travel
  const off = F[0] * j.axis[0] + F[1] * j.axis[1];
  const ends: [number, number][] = [[j.range[1] - off + sx1 + 2, 1], [j.range[0] - off + sx0 - 2, -1]];
  const yIn0 = 3.5 * sg + 0.5 * sg;
  const yIn1 = yAi - 0.5 * sg;
  ends.forEach(([x, dir], k) => {
    const pad = rect(x + dir * 1.5, x + dir * 3.5, yIn0, yIn1);
    const blk = rect(x + dir * 3.5, x + dir * 11.5, yIn0, yIn1);
    if (!clearOf(ctx, W(blk), ctx.b1, sz1) || !clearOf(ctx, W(pad), ctx.b1, sz1 - 1)) {
      J.note += ` No room for the ${k ? "lower" : "upper"} end stop: something moving passes there.`;
      return;
    }
    const s = stop(`${j.id}-stop${k}`, W(blk), { ...G, z0: ctx.b1, z1: sz1 - 1, name: k ? "" : "End stop block, hardened", qty: k ? 0 : 2 });
    const b = bumper(`${j.id}-bump${k}`, 0, 0, { ...G, outer: W(pad), z0: ctx.b1 + 1, z1: sz1 - 1.5, name: k ? "" : "Stop pad, neoprene 2 mm", qty: k ? 0 : 2 });
    ctx.add(s, b);
    serve("F5", s.id);
    const c = toWorld(F, [x + dir * 7.5, (yIn0 + yIn1) / 2]);
    ctx.add(screw(`${j.id}-stop${k}-sc`, "socket", 4, sz1 - 1 - ctx.b1 + 6, { ...G, at: [c[0], c[1], 0], face: sz1 - 1, dir: -1, name: k ? "" : undefined }));
  });

  // grease nipple on the keeper, where nothing passes over it (F8)
  for (const f of [0.08, 0.92, 0.3, 0.7, 0.5]) {
    const p = toWorld(F, [Lr * f, yA + 0.5 * sg]);
    const n = nipple(`${j.id}-nipple`, { ...G, at: [p[0], p[1], 0], z0: keeper.z1 });
    if (!clearOf(ctx, n.outer.map(([x, y]) => [x + p[0], y + p[1]] as Vec2), n.z0, n.z1)) continue;
    ctx.add(n);
    serve("F8", n.id);
    break;
  }
  J.note = `Slide on two rails: keeper plate on one, a bronze gib with three adjusting screws and lock nuts on the other, felt wipers at both ends of the slider${J.serves.F8?.some((s) => s.endsWith("nipple")) ? ", a grease nipple on the keeper" : ""}, end stops just past the travel.${J.note}`;
  J.badge = ["guided both sides", "ok"];
}
