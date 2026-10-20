// Overrides and additions to the generated block-and-tackle assembly (standard 5.2). The rope's parts, wraps, becket,
// hook and swivel, the slides, the drive and every pin stack are the model's and the rules'. What differs from them:
// - the rope's wraps lie in their sheaves' grooves and meet the straight parts at the tangent points (allowed contacts);
//   the fall's eye is spliced round a thimble on the carriage pin;
// - a guard over each upper sheave (F2): the rope rule places guards only over sheaves that are fixed parts, and these
//   turn on a fixed pin (AUTO-TODO);
// - the becket stands on a post screwed into the base (A11);
// - spoked sheaves (M2: they reverse every stroke, and the spokes show them turn);
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { arcPts } from "../../core/geom";
import { solid } from "../../hardware/solid";
import { RS } from "./model";

export const polish: Polish = (A, H) => {
  const flex = "flex-rope-0";

  // ---- the rope's contacts, by design ----
  const touches: Record<string, string[]> = { wUA: ["UA", "r2", "r3"], wUB: ["UB", "r4", "fall"], wLA: ["LA", "r1", "r2"], wLB: ["LB", "r3", "r4"] };
  for (const [id, other] of Object.entries(touches)) A.set(id, { allow: [...(A.get(id)!.allow ?? []), ...other] });
  A.set("fall", { allow: [...(A.get("fall")!.allow ?? []), ...A.find(/^pF-/).map((s) => s.id)] });

  // ---- F2 (AUTO-TODO): a guard over each upper sheave's rim keeps the rope in its groove when it goes slack ----
  for (const id of ["UA", "UB"]) {
    const s = A.get(id)!;
    const band = [...arcPts(0, 0, RS + 4, Math.PI * 0.15, Math.PI * 0.85, Math.PI / 24), ...arcPts(0, 0, RS + 2, Math.PI * 0.85, Math.PI * 0.15, Math.PI / 24)];
    A.add(solid(`${flex}-${id}-guard`, { body: "ground", kind: "stop", role: "hw", name: id === "UA" ? "Rope guard over the sheave, steel strip" : "", qty: id === "UA" ? 2 : 0, outer: band, z0: s.z0 - 1, z1: s.z1 + 1, ex: s.ex, joints: [flex], mat: "Steel S235" }));
    (A.joint(flex).serves.F2 ??= []).push(`${flex}-${id}-guard`);
  }

  // ---- A11: the becket's pin stands in a post screwed up from under the base ----
  const pin = A.get(`${flex}-becket-pin`)!;
  const at = pin.at;
  A.add(H.standoff(`${flex}-becket-post`, { body: "ground", at, z0: A.b1, z1: pin.z0, ex: pin.ex - 0.5, joints: [flex], name: `Becket post Ø10 x ${(pin.z0 - A.b1).toFixed(0)}, the becket pin threaded into its top` }));
  A.add(H.screw(`${flex}-becket-post-bot`, "button", 5, A.b1 - A.b0 + 8, { body: "ground", at, face: A.b0, dir: 1, ex: -1.5, joints: [flex], lock: "threadlocker, medium strength (Loctite 243)" }));

  // ---- M2: spoked sheaves, hub round the bearing, five arms ----
  for (const id of ["UA", "UB", "LA", "LB"]) A.get(id)!.holes.push(...H.spokes({ rIn: 14, rOut: 23, n: 5, half: 3, fillet: 1.5 }));

  // ---- A16: notes, badges, build rules ----
  A.joint("pU", {
    note: `${A.joint("pU").note.replace(/ No room for stops beyond the U[AB]'s swing\./g, "")} The sheaves need no stops: the rope turns them, a few turns each way.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pL", {
    note: `The lower block's pin: ${A.joint("pL").note} The top cheek is the bottom cheek's clevis twin, so both sheaves turn between the cheeks and the bolt works in double shear.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pK", {
    note: `Distance bolt under the sheaves: a sleeve between the cheeks sets their spacing and the bolt clamps them. ${A.joint("pK").note}`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pF", {
    note: `The fall's eye is spliced round a thimble on this pin, so the carriage hauls the rope. ${A.joint("pF").note}`,
    badge: ["single shear", "warn"],
  });
  A.joint(flex, {
    note: "Double tackle: the dead end on a becket under the upper block, four parts between the blocks and the fall from upper sheave B. Each straight part is stretched between its tangent points; the wraps lie in the grooves. Parts 1 and 2 run in plane A, part 4 and the fall in plane B, part 3 crosses between them. The hook hangs on a swivel; a guard over each upper sheave keeps the rope in its groove when it goes slack.",
    badge: ["rope reeved", "ok"],
  });
  A.rules.push(
    { title: "Reeved to a fixed plan", text: "Dead end on the upper block, lower A, upper A, lower B, upper B, fall: four parts carry the block, so the fall moves four times as far as the load." },
    { title: "Three rope heights", text: "Plane A and plane B ropes run in their sheaves' grooves; the crossing part runs between the sheaves, so no two rope parts share a height." },
    { title: "Fall clear of the lower block", text: "The lower block hangs 8 mm right of the upper pin, so the fall runs past the lower sheaves with 4.8 mm to spare." },
    { title: "Guided block", text: "The lower block runs on a slide, the idealised vertical guide; its cheeks and the distance bolt hold both sheaves in double shear." },
    { title: "Kinematics untouched", text: "Tangent points, rope lengths, sheave angles and the fall's travel are the model's; the hardware is built round them." },
  );
};
