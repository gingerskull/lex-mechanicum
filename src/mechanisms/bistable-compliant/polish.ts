// Overrides and additions to the generated bistable assembly (standard 5.2). The pusher's slide, its roller in the
// shuttle's window, the anchor clamps on their seat plates with reamed dowels, the drive and the stops banking the
// shuttle are the rules'. What differs from them:
// - the blank (pads, beams, shuttle) is acetal, not the rules' 7075: a plastic blank snaps at a finger's force;
// - the two springs in the window are compression springs (kind and material);
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { H0, KS, SPRING_L, Y_PEAK, Y_SNAP, force } from "./model";

const fmt = (v: number) => String(+v.toFixed(2));

export const polish: Polish = (A) => {
  for (const id of ["anchorL", "anchorR", "beamL", "beamR", "shuttle"]) A.set(id, { mat: "Acetal POM-C, milled from one plate" });
  for (const id of ["springS", "springN"]) A.set(id, { kind: "spring", mat: "Spring steel EN 10270, preloaded" });

  for (const [j, b] of [["flexure-beamL", "left"], ["flexure-beamR", "right"]] as const)
    A.joint(j, {
      note: `Fixed-guided beam, ${b}: its root is cut into the anchor pad and its tip into the shuttle, both at the as-made 10°, so it bends into an S when the shuttle crosses over (the overlay shows the bend at each end). The pad stands on a ground seat plate, clamped under a plate by two M4 screws, and two Ø3 dowels set the anchors 78.8 mm apart, the span that makes the blank bistable (F1, F2). Hardened pins bank the shuttle's ends just past each stable state, so neither beam is driven past its two shapes (F5).`,
    });
  A.joint("pQ", {
    note: `The pusher's pin: ${A.joint("pQ").note} The roller sits between two preloaded springs in the shuttle's window, ${KS} N/mm together: the pusher drives the shuttle through them until the beams' force, at ${fmt(force(Y_SNAP))} N near its ${fmt(force(Y_PEAK))} N peak, falls faster than the springs' rate; then the shuttle snaps ahead of the pusher to its other state.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "One blank", text: "Pads, beams and shuttle are milled from one acetal plate: no pins, no wear, no backlash in the switching part." },
    { title: "Span set by dowels", text: "The two pads are dowelled to the base 78.8 mm apart: the span against the 40 mm beams sets both stable states and the switching force." },
    { title: "Snap at the force peak", text: `The pusher drives the shuttle through springs of ${KS} N/mm, so the shuttle snaps at y = ±${fmt(Y_SNAP)} mm, where the beams' force falls faster than the springs' rate, near its peak; a stiff pusher would carry it to the centre.` },
    { title: "Springs never solid", text: `Each spring is ${SPRING_L} mm long with the roller centred: at the largest push it keeps more than a millimetre over its solid length, and its free length outreaches the farthest stretch, so both stay preloaded and the rate holds both ways.` },
    { title: "Kinematics untouched", text: `Beam chords, the shuttle's balance against the springs and its ±${fmt(H0)} mm states are the model's; the beams' bend is drawn from the solved state.` },
  );
};
