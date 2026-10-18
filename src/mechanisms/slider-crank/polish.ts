// Overrides and additions to the generated slider-crank assembly (standard 5.2). The plating (crank up, cap down), the
// crosshead clevis (the cap a twin of the crosshead), the counterweighted crank and the tapered rod are the model's;
// the rules build every stack on them. What differs from the rules:
// - the cap's post, on the side the rod never swings to, screwed down into the crosshead;
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const block = A.get("block")!;
  const cap = A.get("cap")!;

  // ---- the cap's post, on the side away from the rod, screwed down into the crosshead ----
  const postX = 14;
  A.add(H.standoff("cap-post", { name: "Cap post Ø8", outer: H.disc(4), D: 8, role: "output", body: "block", at: [postX, 0, 0], z0: block.z1, z1: cap.z0, ex: cap.ex - 0.5, joints: ["pB"], mat: "Steel C45, black oxide" }));
  A.add(H.screw("cap-sc", "button", 3, cap.z1 - block.z1 + 4, { body: "block", at: [postX, 0, 0], face: cap.z1, dir: -1, ex: cap.ex, joints: ["pB"] }));

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  const J5 = A.joint("slide-block");
  J5.note += " The rails are hardened, ground and screwed down: they and the bronze gib are the replaceable wear parts.";
  A.joint("pA", { note: `${A.joint("pA").note} Single shear is forced: the rod sweeps over the input boss. The crank is plated up so the overhang under the rod is 1.5 mm.`, badge: ["single shear", "warn"] });
  A.joint("pB", {
    note: `Crosshead clevis: the crosshead below and a cap 1.5 mm over the rod, the cap on a post at x ${postX} where the rod never swings, so the wrist pin works in double shear. ${A.get("pB-bolt")?.name ?? ""} threaded into the crosshead, shoulder through a plain hole in the cap; the rod's bearing between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.rules.push(
    { title: "Crank and crosshead low, rod above", text: "Crank, crosshead and rails work near the base; the rod rides over the slide's keeper, so the crank is lifted to keep the crank pin's overhang at 1.5 mm." },
    { title: "Clevis at the crosshead", text: "The wrist pin is held above and below: a cap on a post on the side the rod never swings to." },
    { title: "Balanced crank", text: "A counterweight lobe opposite the pin balances the pin, the big end and part of the rod." },
    { title: "Guided, adjustable, wiped", text: "Keeper on one rail, a bronze gib with adjusting screws on the other, hardened rails, felt wipers, a grease nipple, rubber end stops just past the stroke." },
    { title: "Kinematics untouched", text: "Pin centres, the guide line and the stroke are the model's; the hardware is designed round them." },
  );
};
