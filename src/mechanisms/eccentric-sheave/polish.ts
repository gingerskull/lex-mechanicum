// Overrides and additions to the generated eccentric-sheave assembly (standard 5.2). The rules build the live input
// shaft in its housing, keyed to the sheave, the valve rod's block on its rails with the keeper and gib, the wrist pin
// at V and the drive. They know nothing of a strap riding on a disc, so the sheave-in-strap bearing E is built here:
// - a bronze liner pressed into the strap's bore, the disc running in it;
// - two flanges on the sheave, screwed to it, holding the strap on the disc (one above, one below, a ring clear of the
//   shaft); the strap is fitted over the disc first, then the flanges;
// - a grease nipple tapped into the strap's ring, feeding the liner;
// - the cap's post, on the side the rod never swings to, screwed down into the valve rod's block;
// - the motor lead's cable clip moved off the bracket's rim (M6);
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { R, Rbore, Rstrap, e } from "./model";

const R_FL = 43;
const T_FL = 1.5;
const GAP = 0.5;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const block = A.get("block")!;
  const cap = A.get("cap")!;
  const sheave = A.get("sheave")!;
  const strap = A.get("strap")!;
  // the strap comes off over the disc: one level above the sheave, with everything pressed into it (E4, E5)
  for (const t of A.find((t) => t.body === "strap")) t.ex = sheave.ex + 1;
  const z0 = sheave.z0;
  const z1 = sheave.z1;

  // ---- E: the strap rides on the disc, in a bronze liner ----
  const liner = H.bushing("strap-liner", 2 * R + 0.2, 2 * Rbore, {
    name: `Bronze liner Ø${2 * R + 0.2} x Ø${2 * Rbore} x ${z1 - z0}`,
    body: "strap",
    at: [0, 0, 0],
    z0,
    z1,
    ex: strap.ex,
    joints: ["E"],
  });
  // flanges on the sheave: a ring above and below, clear of the shaft, each 0.5 mm off the strap's faces
  const zTop = z1 + GAP;
  const zBot = z0 - GAP - T_FL;
  const screwPts: [number, number][] = [0, 1, 2].map((k) => [e + 30 * Math.cos((k * 2 * Math.PI) / 3 + 0.5), 30 * Math.sin((k * 2 * Math.PI) / 3 + 0.5)]);
  const GF = { body: "sheave", role: "hw" as const, kind: "plate" as const, mat: "Steel C45, black oxide", joints: ["E"] };
  const top = H.plate("sheave-flange-top", H.disc(R_FL, e, 0), {
    ...GF,
    name: `Sheave flange ring Ø${2 * R_FL} x ${T_FL}, screwed to the sheave`,
    at: [0, 0, 0],
    z0: zTop,
    z1: zTop + T_FL,
    holes: [H.disc(10), ...screwPts.map(([x, y]) => H.disc(1.7, x, y))],
    ex: strap.ex + 1,
  });
  const bot = H.plate("sheave-flange-bot", H.disc(R_FL, e, 0), {
    ...GF,
    name: "",
    at: [0, 0, 0],
    z0: zBot,
    z1: zBot + T_FL,
    holes: [H.disc(10), ...screwPts.map(([x, y]) => H.disc(1.7, x, y))],
    ex: sheave.ex,
  });
  A.add(liner, top, bot);
  screwPts.forEach(([x, y], k) => {
    const G = { body: "sheave", at: [x, y, 0] as [number, number, number], joints: ["E"], name: k ? "" : undefined, qty: k ? 0 : 3 };
    A.add(H.screw(`sheave-flange-top-sc${k}`, "button", 3, top.z1 - z0 + 3, { ...G, face: top.z1, dir: -1, ex: top.ex }));
    A.add(H.screw(`sheave-flange-bot-sc${k}`, "button", 3, z1 - bot.z0 + 3, { ...G, face: bot.z0, dir: 1, ex: bot.ex }));
  });
  // the grease nipple in the strap's ring, over the liner
  const nipAt: [number, number, number] = [0, 50, 0];
  const nip = H.nipple("strap-nipple", { body: "strap", at: nipAt, z0: z1, ex: strap.ex + 0.5, joints: ["E"], name: "Grease nipple DIN 71412 M6, feeding the strap liner" });
  A.add(nip);
  strap.holes.push(H.disc(3, nipAt[0], nipAt[1]));

  // ---- the cap's post, on the side away from the rod, screwed down into the valve rod's block ----
  const postX = 14;
  A.add(H.standoff("cap-post", { name: "Cap post Ø8", outer: H.disc(4), D: 8, role: "output", body: "block", at: [postX, 0, 0], z0: block.z1, z1: cap.z0, ex: cap.ex - 0.5, joints: ["pV"], mat: "Steel C45, black oxide" }));
  A.add(H.screw("cap-sc", "button", 3, cap.z1 - block.z1 + 4, { body: "block", at: [postX, 0, 0], face: cap.z1, dir: -1, ex: cap.ex, joints: ["pV"] }));

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("E", {
    type: "J3",
    at: [e, 0],
    title: "Sheave in strap",
    note: `The strap is the big end of the eccentric rod: its bore runs on the Ø${2 * R} sheave in a bronze liner, fed by a grease nipple. The two flanges (0.5 mm clear of the strap) hold it on the disc and are screwed to the sheave; they turn with it. The sheave is keyed to the shaft at O, ${e} mm off its centre, so this one bearing is the crank pin of the equivalent slider-crank.`,
    badge: ["both faces held", "ok"],
    serves: { F2: [top.id, bot.id], F3: ["pO-sheave-key"], F4: [liner.id], F8: [liner.id, nip.id], F1: [liner.id] },
  });
  A.joint("pO", { note: `${A.joint("pO").note} The sheave is the only part on the shaft, so the shaft is carried by the two housing bearings alone, 15 mm apart: a bridge over its end would need posts outside the strap's R${Rstrap} sweep, so there is none.`, badge: ["single shear", "warn"] });
  A.joint("pV", {
    note: `Crosshead clevis on the valve rod: the block below and a cap 1.5 mm over the strap's rod end, the cap on a post at x ${postX} where the rod never swings to, so the wrist pin works in double shear. ${A.get("pV-bolt")?.name ?? ""} threaded into the block, shoulder through a plain hole in the cap; the rod's bearing between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  const J5 = A.joint("slide-block");
  J5.note += " The rails are hardened, ground and screwed down: they and the bronze gib are the replaceable wear parts.";
  A.rules.push(
    { title: "Strap on a bronze liner", text: "The strap's bore runs on the sheave in a pressed bronze liner, greased from a nipple on the strap's ring: the big rubbing area is the weak point of an eccentric, so it is made renewable." },
    { title: "Flanged sheave", text: "A flange above and a ring below, screwed to the sheave, keep the strap on the disc. The strap goes on over the disc first, then the flanges." },
    { title: "Clevis at the valve rod", text: "The wrist pin is held above and below: a cap on a post on the side of the block the rod never swings to." },
    { title: "Throw from the offset", text: `The sheave's bore sits ${e} mm off the disc's centre; the key is cut there, so the eccentric cannot be fitted wrong.` },
    { title: "Kinematics untouched", text: "The sheave's offset, the rod length and the guide line are the model's; the hardware is designed round them." },
  );
};
