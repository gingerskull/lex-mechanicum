// Overrides and additions to the generated Scott Russell assembly (standard 5.2). The layers (slider and rails 0, crank
// 1, beam 2), the narrow slider and the tapered bars are the model's; the rules build every stack, the slide, its stops
// and the belt drive on them. What differs from the rules:
// - the crank made adjustable by H.turnbuckle, in its own plane (F7): the beam end runs exactly straight only when the
//   crank, half the beam and the other half are equal;
// - a stroke scale on the base beside the track with an index on the slider, and a height scale for the beam end (F9);
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { a } from "./model";

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F7: the straight line holds only when |OM| = |MB| = |MP|, so one length is adjustable: the crank, halfway
  // between O and M. The crank is plated between the rails below and the beam above, with no room over or under it, so
  // the turnbuckle sits in the crank's own plane ----
  H.turnbuckle(A, "crank", {
    at: [a / 2, 0],
    set: a,
    title: "Adjuster · crank",
    why: `It sets O to M equal to half the beam, so the end of the beam runs exactly on the line. Nothing sweeps in the crank's plane between O and M, so the body and nuts stay clear.`,
  });

  // ---- F9: the slider's stroke engraved beside the track, read off an index line on the slider; the beam end's height
  // engraved beside its line ----
  const base = A.get("base")!;
  for (let x = 20; x <= 95; x += 5) base.marks.push({ kind: "scale", pts: [[x, -22], [x, x % 25 === 20 ? -27 : -24.6]] });
  base.marks.push({ kind: "scale", pts: [[20, -22], [95, -22]] });
  A.get("slider")!.marks.push({ kind: "index", pts: [[0, -5], [0, -9.5]] });
  for (let y = 30; y <= 100; y += 10) base.marks.push({ kind: "scale", pts: [[-14, y], [y % 50 === 0 ? -19 : -16.6, y]] });
  base.marks.push({ kind: "scale", pts: [[-14, 30], [-14, 100]] });

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO", {
    note: `${A.joint("pO").note} The crank is the only part on this axle and the beam passes well clear of it, so the bridge over the top closes the load path: both ends held.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pM", {
    note: `Single shear is forced: the beam crosses over the crank and nothing can sit above it. ${sz("pM-bolt")} threaded through the crank; the bearing in the beam sits between inner-race spacers and the beam is one layer above the crank.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `The slider pin is the input: ${sz("pB-bolt")} threaded into the slider, the beam's bearing above it on spacers. Single shear, because the beam swings over the slider and nothing can sit above it. The belt pushes the slider. ${A.joint("pB").note}`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Crank over the track, beam over the crank", text: "The crank sweeps over the rails, so it rides one layer above the slider and the rails; the beam crosses over the crank. Each pin passes only through the parts it joins." },
    { title: "Equal lengths are exact", text: "The crank is 50 mm between centres and the beam 100 mm with the crank pin at its midpoint. The crank carries a turnbuckle set at 50 mm; the drawing shows it at the set point, so every pin centre stays the model's." },
    { title: "Slider clear of the pivot", text: "At the near end of the stroke the slider comes within 9 mm of the ground axle, so the block is only 22 mm long and the belt idler is set further out along the track." },
    { title: "Stops outside the stroke", text: "Rubber-faced end stops sit just past each end of the slider's travel and catch it with the belt off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
