// Overrides and additions to the generated crank-shaper assembly (standard 5.2). The plating (the lever and the ram's
// cap 2.5 mm down), the ram's clevis (the cap a twin of the ram) and the slot are the model's; the rules build every
// stack on them: a live crank shaft, a dead axle with a bridge and stops at the lever pivot, a track roller with wear
// strips in the slot, the ram on its rails. Nothing in the generated build differs, so this polish only writes the
// engineering record (A16).
import type { Polish } from "../../assemble/api";

export const polish: Polish = (A) => {
  const sz = (id: string) => A.get(id)?.name ?? "";

  A.joint("pO2", {
    note: `${A.joint("pO2").note} The lever's slot sweeps over this shaft end, 1 to 4 mm above it, so nothing stands proud of the crank here.`,
  });
  A.joint("pO3", {
    note: `${A.joint("pO3").note} The lever rocks only ±23.6° about this axle, so rubber-faced stops sit just outside the swing and a bridge over the lever holds the axle's top end.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pA", {
    note: `${A.joint("pA").note} The crank pin carries a track roller that runs in the lever's slot, 60 to 140 mm from the pivot. Single shear is forced: the lever sweeps over the crank, so the pin is held by the crank alone, with the shortest overhang (the lever is plated 2.5 mm down).`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `${A.joint("pB").note} Single shear is forced: a rear plate under the lever tip would sweep through the ram rails. The lever is plated down to 1.5 mm over the link, so the overhang is 1.5 mm; ${sz("pB-bolt")} threaded into the link, bearing in the lever.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pC", {
    note: `Clevis: the ram below and its cap 1.5 mm over the link, the cap on a post on the side the link never swings to, so the wrist pin works in double shear. ${sz("pC-bolt")} threaded into the ram, shoulder through a plain hole in the cap; the link's bearing between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("slide-ram", { note: `${A.joint("slide-ram").note} The rails are hardened, ground and screwed down on their risers: they and the bronze gib are the replaceable wear parts.` });

  A.rules.push(
    { title: "Crank and link low, lever above", text: "Crank and link share one plane; the lever rides 1.5 mm over both, so the crank pin and the link's pin both work with a 1.5 mm overhang under the lever." },
    { title: "Roller in the slot", text: "The crank pin's track roller runs in the lever's slot between hardened wear strips; the slot is cut for the pin's whole run from 60 to 140 mm out." },
    { title: "Clevis at the ram", text: "The wrist pin is held above and below: a cap on a post on the side of the ram the link never swings to." },
    { title: "Banked lever", text: "Stops sit just outside the lever's swing and a bridge over the pivot holds the axle top and bottom." },
    { title: "Kinematics untouched", text: "Pin centres, the slot line, the lever swing and the ram line are the model's; the hardware is designed round them." },
  );
};
