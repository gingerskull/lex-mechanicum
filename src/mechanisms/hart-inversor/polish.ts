// Overrides and additions to the generated Hart's inversor assembly (standard 5.2). The layer order (crank and FD at
// the bottom, EF, CD, CE on top), the plating (CD and CE up) and the hung ground pivot A are the model's and the rules';
// the rules build every stack on them. What differs from the rules:
// - the ground pivot A adjustable: the stud sits in a short slot in its bridge, clamped by the nut (F7): AB = Bg sets the
//   line x = 2700 / (2 AB), the one exact length the ground carries;
// - the input shaft end retained by a circlip above the lever, because the drive link passes under the shaft end (rule
//   bug, see the audit); the lever gets a full wall round the shaft;
// - stops for the input crank, which the rules skip (its drive limits it) (F5);
// - the crank's swing engraved on the base with an index line on the crank (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const crankL = 20;
const B: Vec2 = [20, 0];
const SLOT = 1.5;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F7: the stud of the hung pivot A in a slot along AB, clamped by its nut; drawn at the set point ----
  const bridge = A.get("pA-bridge")!;
  const pA = ctx.pinJoint("pA")!;
  const hole = bridge.holes.findIndex((h) => h.some((p) => Math.hypot(p[0] - pA.P[0], p[1] - pA.P[1]) < 6));
  const hr = (Math.max(...bridge.holes[hole]!.map((p) => p[0])) - Math.min(...bridge.holes[hole]!.map((p) => p[0]))) / 2;
  bridge.holes[hole] = roundedPoly([[pA.P[0] - SLOT, pA.P[1]], [pA.P[0] + SLOT, pA.P[1]]], hr);
  (A.joint("pA").serves.F7 ??= []).push(bridge.id);

  // ---- the drive: the rule puts the motor on the far side of the input shaft, so the link crosses under the shaft end
  // and the retaining washer and screw there would foul it. Retain the lever from above with an external circlip
  // instead; the shaft end is flush with the lever. The lever's wall round the Ø10 bore is under 1.5 mm: widen it ----
  const lever = A.get("drive-lever");
  const rw = A.get("pB-rw");
  if (lever && rw) {
    const zl = lever.z1;
    for (const id of ["pB-rw", "pB-rs", "pB-rs-sh"]) A.drop(id);
    const d = ctx.pinJoint("pB")!.d;
    A.add(H.circlip("pB-lever-cl", d, { body: lever.body, at: [B[0], B[1], 0], z0: zl, z1: zl + 1, ex: lever.ex, joints: ["pB"] }));
    Object.assign(lever, { outer: roundedPoly([[0, 0], [22, 0]], 7) });
    const J = A.joint("pB");
    J.serves.F2 = [...(J.serves.F2 ?? []).filter((x) => x !== "pB-rs"), "pB-lever-cl"];
  }

  // ---- F5: the rule skips the input crank (its drive limits it); with the drive off it would still over-travel, so
  // it gets its own pair of stops 2° beyond each end (Appendix A) ----
  const sw = swing(ctx, ctx.parts["crank"]!)!;
  const sC = H.stops(A, { part: ctx.parts["crank"]!, pivot: B, range: sw, joint: "pB" });
  A.joint("pB").serves.F5 = [...(A.joint("pB").serves.F5 ?? []), ...sC];

  // ---- M13, M10: the new stops and the circlip are named and threadlocked like every other fastener (the locking
  // and materials rules ran before the polish) ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the crank's swing engraved on the base about B, read off an index line on the crank tip. The antiparallelogram
  // goes back together on two branches; the scale shows it went back on the modelled one ----
  const base = A.get("base")!;
  const R0 = crankL + 13;
  for (let t = Math.ceil(sw[0] / D2R / 10) * 10; t <= sw[1] / D2R + 0.01; t += 10)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...B), polar(R0 + (t % 30 === 0 ? 5 : 2.6), t * D2R, ...B)] });
  base.marks.push({ kind: "scale", pts: arcPts(B[0], B[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("crank")!.marks.push({ kind: "index", pts: [[crankL + 6, 0], [crankL + 9.2, 0]] });
  (A.joint("pB").serves.F9 ??= []).push("base", "crank");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pA", {
    note: `Hung pivot: the long bars EF and CD sweep over A and the crank over its neighbour, so no axle can rise from the base. ${sz("pA-axle")} is carried from a bridge on two spigoted posts outside every sweep, the stud running down into short bar CE only, a bearing there between inner-race spacers and an external circlip under it; nothing below CE meets the pivot. The stud sits in a ${2 * SLOT} mm slot along AB, clamped by its nut: the pivot offset AB is the one exact ground length, set on the bench.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `${A.joint("pB").note} Oscillating input: the shaft carries the drive lever below the base, held by a circlip, and two stops stand 2° beyond the ends of the 160° swing. EF, CD and CE all sweep over this shaft, so the support comes from the housing behind it.`,
  });
  A.joint("pg", {
    note: `Crank pin g joins the crank (layer 0) to the middle of EF (layer 1): ${sz("pg-bolt")} threaded into the crank, bearing in EF, head clear under CD. Single shear is forced: EF and CD pass over it.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pE", {
    note: `E joins EF (layer 1) to CE (layer 3) through the layer of CD, which never sweeps over E: ${sz("pE-bolt")} threaded into EF, bearing in CE between inner-race spacers.`,
    badge: ["stacked", "warn"],
  });
  A.joint("pC", {
    note: `C joins CD (layer 2) to CE (layer 3), the two plated 3.5 mm up together: ${sz("pC-bolt")} threaded into CD, bearing in CE.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pF", {
    note: `F joins FD (layer 0) to EF (layer 1): ${sz("pF-bolt")} threaded into FD, bearing in EF, head under CD.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pD", {
    note: `D joins FD (layer 0) to CD (layer 2) through the layer of EF, which never sweeps over D: ${sz("pD-bolt")} threaded into FD, bearing in CD between inner-race spacers.`,
    badge: ["stacked", "warn"],
  });
  A.rules.push(
    { title: "Five planes, no through-pin conflicts", text: "EF passes through the line of the input pivot B and 4 mm from A, CE passes B and CD 10 mm from it, so the crank and FD ride the bottom plane, then EF, CD and CE: each pin joins layers whose sweeps never meet it." },
    { title: "Ground pivot A hung from a bridge", text: "A stub from a bridge on two spigoted posts runs down into CE only, so the long bars sweep under the pivot with nothing rising from the base; the nut above the bridge clamps it." },
    { title: "One adjustable length", text: "AB = Bg = 20 sets the line x = 2700 / (2 AB): the stud at A sits in a slot along AB, clamped, shown at its set point; the drawn centres stay exact." },
    { title: "Stops outside the swing", text: "Rubber-faced stops 2° beyond each end of the crank's 160° swing and of CE's swing: untouched in running, they catch the linkage with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines, slot and hardware are designed around them." },
  );
};
