// Overrides and additions to the generated toggle clamp assembly (standard 5.2). The plating (handle plates 1.5 mm
// either side of the link), the clevis at the knee (the front handle plate a twin of the rear one), the clevis at the
// plunger (the cap a twin of the plunger) and the notched plunger are the model's; the rules build every stack on
// them. What differs from the rules:
// - the hand grip at the end of the handle, in place of the generated knob (it would sit off the handle);
// - the handle stops on the grip arm, where the handle really lands, in place of the generated ones on the arm axis;
// - the clamp spindle and its lock nut in the plunger's notch (F7), and no forward slide stop (the spindle tip passes
//   where it would stand);
// - notes, badges and build rules (A16).
import { solid } from "../../hardware/solid";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { NUTS } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { g, T } from "./model";

/** Spindle M5, clamp pad head 4 mm thick and 12 wide, lock nut on the notch's back wall at x 28. */
const M = 5;
const WALL = 28;
const PAD_X = 59;
const FACE = 63;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const handle = A.get("handle")!;
  const plunger = A.get("plunger")!;
  const slideJ = A.joint("slide-plunger");

  // ---- the generated knob and stops are replaced: the knob would sit off the handle, the stops on the arm axis ----
  A.drop(/^drive-(handle|stop)/);
  const drive = A.joint("drive");
  drive.serves.F5 = [];

  // ---- the hand grip: a phenolic sleeve on the handle's end, on a button-head screw into the handle plate ----
  const gripH = 16;
  A.add(H.standoff("grip", { name: "Handle grip Ø16, phenolic, on an M4 screw", outer: H.disc(8), D: 16, role: "driver", body: "handle", at: [T[0], T[1], 0], z0: handle.z1, z1: handle.z1 + gripH, ex: handle.ex + 1, joints: ["drive"], mat: "Phenolic, black" }));
  A.add(H.screw("grip-sc", "button", 4, gripH + handle.z1 - handle.z0, { body: "handle", at: [T[0], T[1], 0], face: handle.z1 + gripH, dir: -1, ex: handle.ex + 1, joints: ["drive"] }));

  // ---- F5: the handle's stops, on the grip arm. The over-centre stop takes the handle at +3° and holds the toggle just
  // past dead centre; the open stop takes it at -70° ----
  const sw = swing(ctx, ctx.parts["handle"]!)!;
  const ids = H.stops(A, { part: ctx.parts["handle"]!, pivot: [0, 0], range: [sw[0] + g, sw[1] + g], margin: 0, joint: "drive" });
  drive.serves.F5 = ids;

  // ---- F7: the clamp spindle M5 in the plunger's notch, a thin lock nut against the back wall ----
  const nut = NUTS[M]!;
  const z0 = plunger.z0;
  const z1 = plunger.z1;
  const G = { body: "plunger", joints: ["slide-plunger"], ex: plunger.ex + 0.5, at: [0, 0, 0] as [number, number, number] };
  const rect = (x0: number, x1: number, h: number): [number, number][] => [[x0, -h], [x1, -h], [x1, h], [x0, h]];
  const tick = (x: number): { kind: "thread"; pts: [number, number][] } => ({ kind: "thread", pts: [[x, -M / 2 + 0.3], [x, M / 2 - 0.3]] });
  const spindle = solid("spindle", {
    ...G,
    name: `Clamp spindle M${M}, 35 long, hardened pad head Ø12`,
    kind: "shaft",
    role: "hw",
    mat: "Steel C45, hardened pad face, black oxide",
    outer: [...rect(WALL, PAD_X, M / 2).slice(0, 2), [PAD_X, -6], [FACE, -6], [FACE, 6], [PAD_X, 6], ...rect(WALL, PAD_X, M / 2).slice(2)],
    marks: Array.from({ length: 6 }, (_, i) => tick(WALL + 7 + i * 3)),
    thread: M,
    z0: z0 + 0.5,
    z1: z1 - 0.5,
    group: "spindle",
  });
  const lock = solid("spindle-nut", {
    ...G,
    ex: plunger.ex + 1,
    name: `Lock nut M${M} (DIN 439, thin)`,
    kind: "nut",
    role: "hw",
    mat: "Steel 8, zinc plated",
    outer: rect(WALL, WALL + nut.m, 4.4),
    thread: M,
    lock: "jam nut",
    z0: z0 - 0.5,
    z1: z1 + 0.5,
  });
  A.add(spindle, lock);
  slideJ.serves.F7 = [...(slideJ.serves.F7 ?? []), spindle.id, lock.id];

  // the forward slide stop stood where the spindle tip passes: the over-centre stop and the work face end the travel
  const gone = A.drop(/^slide-plunger-(stop|bump)0/);
  slideJ.serves.F5 = (slideJ.serves.F5 ?? []).filter((id) => !gone.some((s) => s.id === id));

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pO", { note: `${A.joint("pO").note} The handle's two plates are keyed to the shaft one on each side of the cartridge housing, so the handle load goes shaft, bearings, housing, base.` });
  A.joint("pA", {
    note: `Knee clevis: the handle's rear and front plates straddle the link 1.5 mm either side, so the pin works in double shear under the toggle load. ${A.get("pA-bolt")?.name ?? ""} threaded into the rear plate, shoulder through a plain hole in the front plate; the link's bearing between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pB", {
    note: `Plunger clevis: the plunger below and a cap 1.5 mm over the link, the cap on a post at x 14 where the link never swings, so the pin works in double shear. ${A.get("pB-bolt")?.name ?? ""} threaded into the plunger, shoulder through a plain hole in the cap.`,
    badge: ["double shear", "ok"],
  });
  slideJ.note += ` The clamp spindle sits in a notch in the plunger: M${M} threaded into the notch's back wall (a blind tapped hole along the axis, not drawn), a thin lock nut on that wall, a hardened pad head at the tip, whose face is the clamp pad at 63 mm. Turn the spindle to set the clamp height, then lock the nut.`;
  A.rules.push(
    { title: "Over centre, held by a stop", text: "The handle goes 3° past the line of arm and link and lands on a stop on its grip arm: the load tries to turn it further onto the stop, so the clamp holds itself." },
    { title: "Clevis at both joints that carry the toggle load", text: "The handle's two plates straddle the link at the knee and the plunger's cap closes over it at the plunger, so both pins work in double shear." },
    { title: "Adjustable spindle, locked", text: "The pad height is set with the spindle and fixed with a lock nut, so made parts meet the modelled clamp stack." },
    { title: "Plunger guided both sides", text: "Keeper on one rail, a bronze gib with adjusting screws on the other, hardened rails, wipers and a grease nipple; the forward stop is the work face and the over-centre stop." },
    { title: "Kinematics untouched", text: "Pin centres, the guide line, the handle swing and the pad face are the model's; the hardware is designed round them." },
  );
};
