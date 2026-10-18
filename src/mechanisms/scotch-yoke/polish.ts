// Overrides and additions to the generated Scotch yoke assembly (standard 5.2). The plating (crank up under the yoke),
// the counterweighted crank, the slotted yoke and its tie bar are the model's; the rules find the slot the crank pin
// runs in and build the track roller, the wear strips on both slot walls and the felt oiler, and the slide on the
// rails. What differs from the rules:
// - the tie bar fixed to the yoke tongue and the crosshead: two screws and a dowel at the crosshead end, one screw
//   and a dowel at the yoke end (F1, A9);
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { d, r } from "./model";

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const yoke = A.get("yoke")!;
  const block = A.get("block")!;
  const bar = A.get("bar")!;
  const L = bar.z1 - yoke.z1 + 6;

  // ---- the tie bar: screwed down into the yoke tongue and the crosshead, located by a dowel at each end ----
  const fix = (id: string, at: [number, number, number], first: boolean) =>
    A.add(H.screw(id, "button", 4, L, { body: "block", at, face: bar.z1, dir: -1, ex: bar.ex, joints: ["slide-block"], ...(first ? { qty: 3 } : { name: "", qty: 0 }) }));
  fix("bar-sc0", [22 - d, 0, 0], true);
  fix("bar-sc1", [0, 0, 0], false);
  fix("bar-sc2", [-14, 0, 0], false);
  A.add(H.dowel("bar-dw0", 3, { body: "block", at: [30 - d, 0, 0], z0: yoke.z1 - 4, z1: bar.z1 - 1, ex: bar.ex, joints: ["slide-block"], name: "Dowel pin Ø3 h6 (ISO 8734), tie bar to yoke and crosshead", qty: 2 }));
  A.add(H.dowel("bar-dw1", 3, { body: "block", at: [-7, 0, 0], z0: block.z1 - 4, z1: bar.z1 - 1, ex: bar.ex, joints: ["slide-block"], name: "", qty: 0 }));

  // ---- F9: with the yoke at its far stroke the crank points along the guide; an index mark on the yoke edge lines up
  // with a line on the base, so the crank goes back on its key in phase with the yoke ----
  const base = A.get("base")!;
  yoke.marks.push({ kind: "timing", pts: [[-d, -54], [-d, -50.5]] });
  base.marks.push({ kind: "timing", pts: [[r, -61], [r, -57]] });

  locking.apply(ctx);
  materials.apply(ctx);
  // M9: the M6 stud threads into the 6 mm crank, which has to be steel for 1 d of engagement
  A.get("crank")!.mat = "Steel C45, black oxide";
  ctx.rule = rule;

  // ---- A16 ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pA", {
    note: `${A.joint("pA").note} Single shear is forced: the yoke sweeps over the crank, so no cap or bridge fits above it. The crank is plated up so the yoke runs 1.5 mm over it and the stud's unsupported length is the yoke's thickness; the roller (the slide block of the pin in its slot) rolls on the hardened wear strips on the slot walls. The slot is longer than the crank throw by 2 mm a side, so the roller never reaches an end.`,
    badge: ["single shear", "warn"],
  });
  A.joint("slide-block", {
    note: `${A.joint("slide-block").note} The tie bar (${sz("bar")}) is screwed and dowelled to the yoke tongue and the crosshead, so the yoke, bar and crosshead move as one body; the rails are hardened, ground and screwed down through their risers.`,
  });
  A.rules.push(
    { title: "Crank low, yoke over it", text: `The crank runs under the yoke so the input shaft ends below it; the crank is lifted until the yoke clears it by 1.5 mm.` },
    { title: "Roller in the slot", text: "The crank pin carries a track roller that rolls between hardened wear strips screwed to both walls of the slot; a felt in the slot end oils them." },
    { title: "One rigid body", text: `The yoke, the ${d} mm tie bar and the crosshead are screwed together and dowelled at both ends, so the slot stays exactly square to the guide.` },
    { title: "Guided, adjustable, wiped", text: "A bronze gib clamped under a keeper on one rail, the other rail the dowelled reference, felt wipers and a grease nipple; the stroke is set by the crank, so the end stops only catch a fault." },
    { title: "Kinematics untouched", text: "Crank radius, slot centre line and guide line are the model's; the hardware is designed round them." },
  );
};
