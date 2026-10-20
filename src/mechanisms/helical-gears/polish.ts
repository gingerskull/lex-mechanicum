// Overrides and additions to the generated helical gear assembly (standard 5.2). The rules read the pair as a
// parallel mesh (J6): hubs and set screws, the backlash eccentric under the output housing and at the top of its
// shaft, both shafts straddle mounted in one bridge (A9), thrust washers under the gears, timing marks, and the belt
// drive under the base. What differs from the rules:
// - the mesh pushes along the shafts (Fa = Ft tan β, 36% of the tooth force), one gear up and the other down, both
//   ways when the drive reverses or brakes: each housing pair is an opposed pair of angular-contact bearings of the
//   same size, spring preloaded by the housing's wave washer, so the located end takes the thrust either way (F4);
// - an output flange on the output shaft above the bridge, where the load is coupled;
// - the mesh named helical, notes and build rules (A16).
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

/** Output flange: Ø, thickness, tapped holes on their circle. */
const FL = { R: 17, t: 6, holes: 4, M: 4, pcd: 12 };
/** The angular-contact series of the housings' bearings (same envelope as the 68xx they replace). */
const AC: Record<string, string> = { p1: "71800 CD (10x19x5)", p2: "71801 CD (12x21x5)" };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- F4: the located pair in each housing takes the axial thrust both ways ----
  for (const [jid, brg] of Object.entries(AC)) {
    A.set(`${jid}-hb0`, { name: `Bearing ${brg}, angular contact, opposed pair` });
    (A.joint(jid).serves.F4 ??= []).push(`${jid}-hb0`, `${jid}-hb1`);
  }

  // ---- the output flange on the free shaft end above the bridge ----
  H.outputCoupling(A, "p2", FL);
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  // the housing pairs are angular contact (F4 above)
  for (const [jid, brg] of Object.entries(AC)) {
    const J = A.joint(jid);
    J.note = J.note.replace(/two sealed 680\d bearings/, `an opposed pair of sealed ${brg.split(" (")[0]} angular-contact bearings`);
  }
  A.joint("p1", {
    note: `${A.joint("p1").note} Driving forward, the mesh lifts the pinion: the thrust runs through the hub and the top circlip into the shaft and down to the angular-contact pair, which locates it; reversed, the pinion bears down on its thrust washer.`,
  });
  A.joint("p2", {
    note: `${A.joint("p2").note} Driving forward, the mesh presses the gear down onto its bronze thrust washer; reversed or braking, it lifts it against the hub's circlip into the angular-contact pair. Above the bridge, a keyed flange with four M${FL.M} tapped holes takes the load.`,
  });
  const mesh = A.joint("mesh-pinion-gear");
  mesh.note = mesh.note.replace(/^Spur mesh of pinion and gear/, "Helical mesh of the 20° right-hand pinion and the 20° left-hand gear");
  mesh.note = `${mesh.note} The contact line sweeps diagonally across the 30 mm face, overlap ratio 1.09, so more than one pair of teeth always carries the load. The thrust Ft tan β pushes the two shafts opposite ways; each is taken by its located housing pair.`;
  A.rules.push(
    { title: "Opposite hands", text: "On parallel shafts the pinion is right hand and the gear left hand at the same 20° helix: only then do the teeth stay in mesh up the face." },
    { title: "Thrust has a home both ways", text: "The mesh pushes one gear up and the other down, and swaps when the drive reverses: each housing holds an opposed angular-contact pair, and each gear sits on a bronze thrust washer under a circlip over its hub." },
    { title: "Carried on both sides", text: "Nothing sweeps over the gears, so each shaft runs from its housing below to a floating bearing in the bridge above; the housing pair locates, the bridge bearing floats." },
    { title: "Backlash set at both ends", text: "Eccentric bushings under the output housing and in the bridge are turned together to set the backlash, then clamped, so the shafts stay parallel and the contact line runs the full face." },
    { title: "Kinematics untouched", text: "Transverse profiles, helix leads, pitch circles and the centre distance are the model's; hubs, bearings and the flange are fitted round them." },
  );
};
