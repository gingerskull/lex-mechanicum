// Overrides and additions to the generated anchor escapement assembly (standard 5.2). The wheel, the anchor with its
// pallets and the pendulum (a clevis twin of the anchor, keyed under it on the one arbor) are the model's; the rules
// build the anchor's live shaft and housing, the wheel's dead axle, bearing and bridge, the base and the oscillating
// drive (motor, short crank and link swinging the arbor through exactly the pendulum's ±3°). What differs:
// - the depth of engagement adjustable: the wheel's axle in an eccentric bushing in the base (F7), drawn at its set
//   point, the centre distance exact;
// - six spokes in the wheel (M2);
// - a beat line on the base under the bob (F9): the clock is in beat when the bob rests over it;
// - brass wheel, hardened steel anchor (M10);
// - notes, badges and build rules (A16).
import { D2R, bbox, polar } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { A as Apiv, Lp, amp, rRoot, table } from "./model";

/** Spoke web left round the bearing seat and under the tooth roots (M2). */
const WEB = 7;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const wheel = A.get("wheel")!;

  // ---- F7: the depth the pallets reach into the teeth is set by the centre distance: the wheel's axle sits in an
  // eccentric bushing in the base, turned to set the depth and clamped ----
  const pE = ctx.pinJoint("pE")!;
  H.eccentricMount(A, "pE", { at: [0, 0], d: pE.d });

  // ---- F5: the rule leaves the input to its drive; with the drive off the pendulum would swing on, so it gets a stop
  // 2° beyond each end of its swing, beside the rod (the rod points along the pendulum's local y) ----
  const pend = ctx.parts["pendulum"]!;
  const st = H.stops(A, { part: pend, pivot: Apiv, range: [Math.PI / 2 - amp, Math.PI / 2 + amp], joint: "pA" });
  A.joint("pA").serves.F5 = [...(A.joint("pA").serves.F5 ?? []), ...st];

  // ---- M2: six spokes; the web keeps WEB mm round the wheel's bearing and under the tooth roots ----
  const brg = A.get("pE-wheel-brg");
  const fl = A.get("pE-wheel-brg-fl");
  const seat = Math.max(brg?.D ?? 16, fl?.D ?? 0) / 2 + 0.2;
  wheel.holes.push(...H.spokes({ rIn: seat + WEB, rOut: rRoot - WEB, n: 6, half: 4.5, fillet: 3 }));

  // ---- F9: the beat line, on the base just past the bob, where the bob's centre line rests ----
  const base = A.get("base")!;
  const [, , , y1] = bbox(base.outer);
  const yb = Math.min(Apiv[1] + Lp + 20, y1 - 6);
  base.marks.push({ kind: "timing", pts: [[0, yb], [0, yb + 5]] });
  base.marks.push({ kind: "timing", pts: [polar(Lp + 20, 90 * D2R + amp, ...Apiv), polar(Lp + 23, 90 * D2R + amp, ...Apiv)] });
  base.marks.push({ kind: "timing", pts: [polar(Lp + 20, 90 * D2R - amp, ...Apiv), polar(Lp + 23, 90 * D2R - amp, ...Apiv)] });

  H.boreChamfers(wheel);
  locking.apply(ctx);
  materials.apply(ctx);
  wheel.mat = "Brass CuZn39Pb3, teeth hardened by hammering";
  A.get("anchor")!.mat = "Steel 42CrMo4, pallet faces hardened, ground and polished";
  A.get("pendulum")!.mat = "Steel rod, brass bob";
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  const adv = (table.advance / D2R).toFixed(0);
  const Ja = A.joint("pA");
  Ja.note = `${Ja.note} The anchor and the pendulum are keyed to the one arbor, the pendulum under the anchor, so the pendulum's swing is the anchor's: ±${(amp / D2R).toFixed(0)}°.`;
  Ja.badge = ["single shear", "warn"];
  const Je = A.joint("pE");
  Je.note = `${Je.note} The wheel runs free on its bearing; its train turns it forward and the pallets stop it. It advances ${adv}° per pendulum period in two drops. The axle stands in an eccentric bushing in the base, which sets how deep the pallets reach into the teeth.`;
  Je.badge = ["both ends held", "ok"];
  A.joint("escapement", {
    type: "J7",
    at: [0, 50],
    title: "Escapement · pallets on the wheel",
    note: "Each pallet face is turned 35° off the line that would hold the wheel dead. As a pallet goes into the teeth its face pushes the locked tooth back (the recoil); as it comes out the tooth slides along the face and pushes the anchor (the impulse) until it drops off the face's end, and the wheel turns on until a tooth lands on the other pallet. The faces are hardened and polished and want a drop of clock oil.",
    badge: ["recoil", "ok"],
    serves: {},
  });
  A.rules.push(
    { title: "One tooth per period", text: `The pallets sit 7.5 teeth apart, so each swing releases half a tooth: the wheel advances ${adv}° per pendulum period.` },
    { title: "Depth by the eccentric", text: "How deep the pallets reach into the teeth is set by turning the wheel axle's eccentric bushing, not by bending the anchor." },
    { title: "In beat", text: "The two drops should be heard evenly; the beat line on the base shows where the bob rests when the anchor is centred." },
    { title: "Oil the pallets only", text: "The pallet faces get a trace of clock oil; the teeth stay dry." },
    { title: "Kinematics untouched", text: "Tooth form, pallet faces and centre distance are the model's; the eccentric is drawn at its set point." },
  );
};
