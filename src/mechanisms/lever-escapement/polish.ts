// Overrides and additions to the generated lever escapement assembly (standard 5.2). The wheel, the lever with its two
// pallet stones, the impulse pin, the roller and the balance (a clevis twin of the roller on the one staff) are the
// model's; the rules build the balance staff's live shaft and housing, the wheel's and the lever's dead axles with their
// bridges, the lever's stops just past its rests and the drive. What differs:
// - the hairspring: a flat spiral under the balance, its inner end on the staff, its outer end in a stud on a post (F6:
//   the balance's return; drawn at rest, a rigid solid);
// - the balance lightened to a rim on three arms (M2);
// - a beat dot on the balance rim and its line on the base (F9);
// - the depth of engagement adjustable: the wheel's axle in an eccentric bushing in the base (F7);
// - steel wheel, ruby stones, brass balance, alloy hairspring (M10);
// - notes, badges and build rules (A16).
import { D2R, TAU, circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { B, amp, bank, rBal, table, win } from "./model";

/** Hairspring: inner and outer radius, turns, strip width; the stud's angle about B. */
const HS = { r0: 8, r1: 30, turns: 4, w: 1, at: 40 * D2R };

/** A flat spiral strip about B, from r0 to r1 in `turns` turns, as one closed outline (out along one edge, back along the other). */
function spiral(): Vec2[] {
  const n = 48 * HS.turns;
  const edge = (off: number) =>
    Array.from({ length: n + 1 }, (_, i): Vec2 => {
      const t = i / n;
      const a = HS.at + TAU * HS.turns * (t - 1);
      return polar(HS.r0 + (HS.r1 - HS.r0) * t + off, a, ...B);
    });
  return [...edge(HS.w / 2), ...edge(-HS.w / 2).reverse()];
}

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- F6: the hairspring, between the roller and the balance; its outer end pinned in a stud on a Ø8 post ----
  const roller = A.get("roller")!;
  const balance = A.get("balance")!;
  const z0 = roller.z1 + 0.6;
  const z1 = z0 + 1;
  const hs = H.spring("hairspring", "leaf", { body: "ground", at: [0, 0, 0], z0, z1, ex: balance.ex - 0.5, joints: ["pB"], name: `Hairspring, flat spiral, ${HS.turns} turns, ${HS.w} mm strip` });
  hs.outer = spiral();
  hs.mat = "Nivarox-type alloy, spring tempered";
  A.add(hs);
  const S = polar(HS.r1 + 3, HS.at, ...B);
  A.add(H.standoff("hs-post", { name: "Hairspring stud post Ø8", outer: H.disc(4), D: 8, role: "ground", body: "ground", at: [S[0], S[1], 0], z0: ctx.b1, z1: z0, ex: balance.ex - 0.5, joints: ["pB"], mat: "Steel C45, black oxide" }));
  A.add(H.screw("hs-stud-sc", "button", 2, z1 - ctx.b1 - 4, { body: "ground", at: [S[0], S[1], 0], face: z1, dir: -1, ex: balance.ex + 0.5, joints: ["pB"], name: undefined }));
  (A.joint("pB").serves.F6 ??= []).push(hs.id);

  // ---- M2: the balance is a rim on three arms; the inertia is in the rim ----
  const seat = 10;
  balance.holes.push(...H.spokes({ rIn: seat + 4, rOut: rBal - 6, n: 3, half: 3.5, fillet: 3 }));

  // ---- F9: in beat: a dot on the balance rim and a line on the base, together when the balance is at rest ----
  balance.marks.push({ kind: "timing", pts: circle(0.8, 0, rBal - 2, 12) });
  A.get("base")!.marks.push({ kind: "timing", pts: [[B[0], B[1] + rBal + 2], [B[0], B[1] + rBal + 7]] });

  // ---- F7: the depth the stones reach into the teeth, set by an eccentric bushing under the wheel's axle ----
  const pW = ctx.pinJoint("pW")!;
  H.eccentricMount(A, "pW", { at: [0, 0], d: pW.d });

  H.boreChamfers(A.get("wheel")!);
  locking.apply(ctx);
  materials.apply(ctx);
  A.get("wheel")!.mat = "Steel 20NiCrMo2, case-hardened and polished";
  A.get("stone1")!.mat = "Synthetic ruby, set in shellac";
  A.get("stone2")!.mat = "Synthetic ruby, set in shellac";
  A.get("lever")!.mat = "Steel C60, hardened";
  balance.mat = "Brass CuBe2 (glucydur-type)";
  A.get("pin")!.mat = "Synthetic ruby";
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  const beat = (table.advance / 2 / D2R).toFixed(0);
  const Jb = A.joint("pB");
  Jb.note = `${Jb.note} The roller and the balance are keyed to the one staff; the hairspring's inner end is pinned to the staff, its outer end in the stud. The balance swings ±${(amp / D2R).toFixed(0)}°.`;
  Jb.badge = ["single shear", "warn"];
  const Jl = A.joint("pL");
  Jl.note = `${Jl.note} The lever carries both stones and the fork. It rests against a banking ${(bank / D2R).toFixed(1)}° either side of the line of centres, held there by the draw of the locking faces; the stops stand just past each rest.`;
  Jl.badge = ["both ends held", "ok"];
  const Jw = A.joint("pW");
  Jw.note = `${Jw.note} The wheel runs free on its bearing; its train turns it forward and the stones stop it. It advances ${beat}° each beat. The axle stands in an eccentric bushing in the base, which sets the depth of the stones.`;
  Jw.badge = ["both ends held", "ok"];
  A.joint("fork", {
    type: "J4",
    at: [B[0], B[1] - 16],
    title: "Fork · impulse pin",
    note: `The ruby impulse pin enters the lever's fork only while the balance is within ${(win / D2R).toFixed(0)}° of its rest. It unlocks the lever, the wheel pushes the lever on across the stone's impulse face and the fork gives the pin its impulse; then the pin leaves the fork and the balance swings free.`,
    badge: ["detached", "ok"],
    serves: {},
  });
  A.joint("pallets", {
    type: "J7",
    at: [0, 40],
    title: "Escapement · stones on the wheel",
    note: "Each club tooth locks on a stone's locking face, slides across the stone's impulse face as the lever flips, and drops onto the other stone. The stones are ruby, set in slots in the lever with shellac, and want a trace of escapement oil.",
    badge: ["lever", "ok"],
    serves: {},
  });
  A.rules.push(
    { title: "Free most of the swing", text: `The pin is in the fork only within ${(win / D2R).toFixed(0)}° of the balance's rest; the other ${((amp - win) / D2R).toFixed(0)}° each way the balance is detached.` },
    { title: "Half a tooth per beat", text: `The stones span 2.5 teeth, so each beat releases half a tooth: ${beat}° of wheel.` },
    { title: "Depth by the eccentric", text: "The stones' depth into the teeth is set by turning the wheel axle's eccentric bushing, not by moving the stones." },
    { title: "Oil the stones only", text: "A trace of escapement oil on the stones' faces; the pin and the fork stay dry." },
    { title: "Kinematics untouched", text: "Tooth form, stones, fork and centres are the model's; the hairspring is drawn at rest." },
  );
};
