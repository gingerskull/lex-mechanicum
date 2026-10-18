// Overrides and additions to the generated pantograph assembly (standard 5.2). The plating, the two clevis pairs (the
// arm A-E and the bar M1-T, their front plates twins of the rear ones) and the tapered links are the model's; the rules
// build every stack on them. What differs from the rules:
// - the hand knob sits on the arm between the input boss and the first pivot (the rule's spot is off a link this narrow);
// - the lower stop, which the rule cannot place because the working zone fills the base round the arm's other end;
// - the arm's swing engraved on the base with an index line on the arm (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import { edgeDist, inside } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const h = 55;
/** Knob centre along the arm: 24 to 36 mm, clear of the input boss (13) and the M1 boss (45.5). */
const KNOB_X = 30;
const R_STOP = 6;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const armO = ctx.parts["armO"]!;
  const O: Vec2 = [0, 0];

  // ---- the knob, on the arm's axis between the two bosses ----
  A.set("drive-handle", { at: [KNOB_X, 0, 0] });
  A.set("drive-handle-sleeve", { at: [KNOB_X, 0, 0] });

  // ---- F5: the rule's lower stop does not fit (the working zone fills the base there), so the stop sits at the
  // nearest spot outside every sweep, on the base, working outward from the arm's lower limit ----
  const sw = swing(ctx, armO)!;
  const base = A.get("base")!;
  const have = A.find(/^drive-stop\d$/).length;
  if (have < 2) {
    const top = A.get("armO")!.z0 + (A.get("armO")!.z1 - A.get("armO")!.z0) * 0.7;
    let found: Vec2 | null = null;
    for (let rr = 30; rr < 2 * h * 0.7 && !found; rr += 1)
      for (let s = 2 * D2R; s < 0.9 && !found; s += 0.02) {
        const a = sw[0] - s;
        const p = polar(rr, a);
        if (!inside(base.outer, p) || edgeDist(base.outer, p) < 8) continue;
        if (ctx.clearance(p, R_STOP, ctx.b1, top + 2.3, (t) => t.isBase === true) >= 1) found = p;
      }
    if (found) {
      const G = { at: [found[0], found[1], 0] as [number, number, number], joints: ["drive"], ex: 0 };
      A.add(H.bumper("drive-stop1", 4.3, 2 * R_STOP, { ...G, z0: ctx.b1, z1: top, name: "", qty: 0 }));
      A.add(H.screw("drive-stop1-sc", "button", 4, top - ctx.b1 + 6, { ...G, face: top, dir: -1, name: "", qty: 0 }));
    }
  }

  // the added stop screw takes its locking method and material like the generated ones
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the arm's swing engraved on the base, read off an index line on the arm tip. The elbow and the bars can be
  // put back on two branches; the scale shows at a glance that the arm went back on the modelled one ----
  const R0 = 2 * h + 13;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O)] });
  base.marks.push({ kind: "scale", pts: arcPts(O[0], O[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("armO")!.marks.push({ kind: "index", pts: [[2 * h + 6, 0], [2 * h + 9.2, 0]] });

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO", {
    note: `${A.joint("pO").note} The arm carries the hand knob. Nothing sweeps over this hub, so the support comes from behind.`,
  });
  A.joint("pA", {
    note: `Clevis: the front and rear plates of the elbow arm straddle the arm O-A, so the elbow works in double shear. ${sz("pA-bolt")} threaded into the rear plate, shoulder through a plain hole in the front plate; ${sz("pA-armO-brg")} in the middle arm between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pM1", {
    note: `Clevis: the bar M1-T is a front and rear pair round the arm O-A, so M1 works in double shear. The bearing sits in the arm, between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pM2", {
    note: `Clevis: the elbow arm's two plates straddle the bar T-M2, so M2 works in double shear. The front plate ends 20 mm short of the pen, so the pen sits in the rear plate alone.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pT", {
    note: `Clevis: the bar M1-T pair straddles the bar T-M2 at the stylus, so the stylus joint works in double shear.`,
    badge: ["double shear", "ok"],
  });
  A.rules.push(
    { title: "Middle plates and clevis pairs", text: "The arm O-A and the bar T-M2 are single plates on the middle layer; the arm A-E and the bar M1-T are front and rear pairs round them. Every joint is in double shear and nothing is stacked only to clear something." },
    { title: "Parallelogram, not a guess", text: "M1 and M2 are the midpoints of the two 110 mm arms and the bars are 55 mm, so M1-A-M2-T is a rhombus and the pen stays on the line O-T at twice its distance. The pivots are drilled to those centres; the model's centres are never altered by the hardware." },
    { title: "Hand operated, banked by stops", text: "A knob on the arm between the input boss and the first pivot moves the whole linkage. Rubber-faced stop posts just outside the arm's swing keep the elbow off the straight-arm singularity with the hand off." },
    { title: "Spacers on inner races only", text: "Every bearing is clamped through its inner race, so tightening a bolt never squeezes a moving part." },
    { title: "Pen on the rear plate", text: "The front plate of the elbow arm stops short of the pen, so the pen can be lifted and replaced without taking the clevis apart." },
  );
};
