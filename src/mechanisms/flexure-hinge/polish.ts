// Overrides and additions to the generated flexure-hinge assembly (standard 5.2). The blank's one material, its seat
// plate, clamp plate, screws and dowels, the stop pins and the drive through the lever's tip are the rules'. What
// differs from them: the notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { K, LARM, R, SWING, b, t } from "./model";

const fmt = (v: number) => String(+v.toFixed(2));
const deg = (v: number) => (v * 180) / Math.PI;

export const polish: Polish = (A) => {
  const margin = fmt(deg(0.2 * SWING));
  A.joint("flexure-neck", {
    note: `Circular notch R ${R}, neck ${t} mm, ${b} mm wide, cut in one 7075 blank: K = ${Math.round(K)} N·mm/rad, the lever rocking ±${fmt(deg(SWING))}° about the neck centre with no pin, no play and no wear. The block stands on a ground seat plate and is clamped to the base under a plate, two screws and two dowels (F1, F2); the stop pins meet the lever ${margin}° past each end of the swing, before the neck yields (F5). The neck is drawn rigid; its bend shows on the overlay.`,
  });
  A.rules.push(
    { title: "One blank, no pivot", text: "Block, neck and lever are one piece of 7075; the lever turns about the neck centre by bending the neck, with no pin, play or wear." },
    { title: "Neck in its elastic range", text: `The ±${fmt(deg(SWING))}° swing keeps the neck's bending stress under the alloy's limit; the stop pins catch the lever ${margin}° further on.` },
    { title: "Lever clear of the base", text: "The block stands on a 2 mm ground seat plate, so the lever swings over the base without touching it." },
    { title: "Exact swing from the crank", text: `The crank's throw and the link's dead centres set the lever's swing; the tip moves ±${fmt(LARM * Math.sin(SWING))} mm.` },
    { title: "Kinematics untouched", text: "The neck centre, the lever's length and its angle are the model's; the seat, stops, clamp and drive are built round them." },
  );
};
