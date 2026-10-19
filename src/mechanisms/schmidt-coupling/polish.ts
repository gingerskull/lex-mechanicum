// Overrides and additions to the generated Schmidt coupling assembly (standard 5.2). The model has the three discs, the six links and
// their twelve moving pins; the rules build the input's live shaft, housing and key, the twelve shoulder-bolt joints, the output's
// hung pivot (a stud from a bridge over the output disc, since no shaft may rise through the links' sweep), the base and the drive.
// What differs from the rules:
// - the output: four tapped holes in the output disc's hub (M3 on its pitch circle) take the load;
// - index lines on the three discs for the pins of set A and set B, and their lines on the base under the input and output discs
//   (F9): the discs must go back with each pin set in phase, set B 60° from set A;
// - notes, badges and build rules (A16).
import { circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { O1, O3, r } from "./model";

const OUT = { n: 4, M: 3, R: 20 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const discIn = A.get("discIn")!;
  const discMid = A.get("discMid")!;
  const discOut = A.get("discOut")!;

  // ---- the output: four tapped holes on the output disc's hub ----
  for (const [x, y] of H.boltCircle(OUT.n, OUT.R, Math.PI / 4)) discOut.marks.push({ kind: "thread", pts: circle(OUT.M / 2 - 0.2, x, y, 16) });
  discOut.name = `Output disc, ${OUT.n} x M${OUT.M} tapped in the hub for the load`;

  // ---- F9: index lines at the pins of set A (angle 0) and set B (60°) on the discs, and on the base under the shafts ----
  const line = (a: number, r0: number, r1: number): Vec2[] => [polar(r0, a), polar(r1, a)];
  discIn.marks.push({ kind: "timing", pts: line(0, r + 5, r + 9) });
  discMid.marks.push({ kind: "timing", pts: line(0, r + 5, r + 9) }, { kind: "timing", pts: line(Math.PI / 3, r + 5, r + 9) });
  discOut.marks.push({ kind: "timing", pts: line(Math.PI / 3, r + 5, r + 9) });
  const base = A.get("base")!;
  base.marks.push({ kind: "timing", pts: [polar(r + 12, 0, O1[0], O1[1]), polar(r + 16, 0, O1[0], O1[1])] });
  base.marks.push({ kind: "timing", pts: [polar(r + 12, Math.PI / 3, O3[0], O3[1]), polar(r + 16, Math.PI / 3, O3[0], O3[1])] });
  (A.joint("pO1").serves.F9 ??= []).push("discIn", "base");
  (A.joint("pO3").serves.F9 ??= []).push("discOut", "discMid", "base");
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pO3", {
    note: `${A.joint("pO3").note} The output disc's pivot is a stud hung from a bridge over it: the input's shaft rises from the base, but no shaft may rise through the sweeps of the links, so the output turns on a stud from above.`,
  });
  A.rules.push(
    { title: "Three links where two would do", text: "The set of three at 120° carries the drive through the dead centres where two links would fold; each link is the side of a parallelogram, so it only translates, and the three never touch if their eyes are small enough: the pitch circle is 44 mm so the links clear each other at the ends of their sweep." },
    { title: "The middle disc floats", text: "It has no shaft: the links alone carry it, and it turns about a point fixed in space, C, 54.5 mm off the line of the shafts. Fit sets A and B on the middle disc 60° apart." },
    { title: "Layers on one stud each", text: "Disc, links A, middle disc, links B, output disc, each pair on a pin with its head above and a bearing in the upper part; the heads clear the part above by their own height." },
    { title: "Phase", text: "Index lines on the three discs and on the base: the input's pin 1 on the base line, the middle disc's pins on its lines, the output's on the 60° line, then the bridge over the output stud." },
    { title: "Kinematics untouched", text: "The pitch circles, the link lengths and the centre C are the model's; pins, bearings, the bridge and marks are fitted round them." },
  );
};
