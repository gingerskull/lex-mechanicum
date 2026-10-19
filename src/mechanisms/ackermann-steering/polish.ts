// Overrides and additions to the generated Ackermann steering assembly (standard 5.2). The plating (tie rod over the arm
// tips), the layer order and the tapered arms are the model's; the rules build every stack on them. What differs from
// the rules:
// - the tie rod made adjustable by H.turnbuckle in its own plane (F7): the toe is set by the rod's length, which must
//   meet the model exactly;
// - the input shaft end retained by a circlip above the lever, because the drive link passes over the shaft end (the
//   rule's retaining washer and screw there would foul it; the same hand fix as Peaucellier-Lipkin);
// - a pair of stops for the input arm, which the rules skip (its drive limits it) (F5);
// - the input arm's swing engraved on the base with an index line on its tip (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { shoulderLength } from "../../hardware/tables";
import { growBase } from "../../rules/base";
import { boltName, raceD } from "../../rules/pins";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const w = 150;
const r = 30;
const t = w - 2 * r * Math.sin(Math.atan2(w / 2, 250));
const KL: Vec2 = [-w / 2, 0];
const KR: Vec2 = [w / 2, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const pPR = ctx.pinJoint("pPR")!;

  // ---- F7: toe is the tie rod's length, so the rod is the one adjustable link: a turnbuckle halfway along it, in the rod's
  // own plane (nothing fits above or below the swept stack) ----
  H.turnbuckle(A, "tieRod", {
    at: [t / 2, 0],
    set: t,
    title: "Adjuster · tie rod",
    why: `It sets the tie rod to ${t.toFixed(1)} mm between pin centres, which is the toe-in at straight ahead and the Ackermann error everywhere else. Nothing sweeps in the rod's plane between the pins.`,
  });

  // ---- F5: the rule skips the input arm (its drive limits it); with the drive off it would still over-travel, so it gets
  // its own pair of stops 2° beyond each end (Appendix A) ----
  const sw = swing(ctx, ctx.parts["armL"]!)!;
  const pKL = ctx.pinJoint("pKL")!;
  const sL = H.stops(A, { part: ctx.parts["armL"]!, pivot: pKL.P, range: sw, joint: "pKL" });
  A.joint("pKL").serves.F5 = [...(A.joint("pKL").serves.F5 ?? []), ...sL];

  // ---- the drive: the link crosses the input shaft end, so the retaining washer and screw there would foul it. Retain the
  // lever from above with an external circlip instead; the shaft end is flush with the lever ----
  const lever = A.get("drive-lever");
  if (lever && A.get("pKL-rw")) {
    for (const id of ["pKL-rw", "pKL-rs", "pKL-rs-sh"]) A.drop(id);
    A.add(H.circlip("pKL-lever-cl", pKL.d, { body: lever.body, at: [pKL.at[0], pKL.at[1], 0], z0: lever.z1, z1: lever.z1 + 1, ex: lever.ex, joints: ["pKL"] }));
    const J = A.joint("pKL");
    J.serves.F2 = [...(J.serves.F2 ?? []).filter((x) => x !== "pKL-rs"), "pKL-lever-cl"];
  }

  // ---- M6: the motor lead's cable clip landed on the bracket's flange, its screw hole 0.06 mm from the flange edge: slide
  // the clip 8 mm along the lead toward the terminal block, off the flange ----
  const term = A.get("drive-terminal");
  const clip = A.get("drive-clip");
  if (term && clip) {
    const d: Vec2 = [term.at[0] - clip.at[0], term.at[1] - clip.at[1]];
    const L = Math.hypot(...d) || 1;
    for (const t of A.find(/^drive-clip/)) t.at = [t.at[0] + (8 * d[0]) / L, t.at[1] + (8 * d[1]) / L, t.at[2]];
  }

  // ---- A9: the right kingpin carries nothing above it (the rod never reaches this hub), so it wants a bridge, but the base
  // is sized to the swing and has no room for the posts: the rule fell back to a washer under the head. Grow the base,
  // place the bridge, and rebuild the axle top as the rule does (sleeve up to the bridge, shim, head over it) ----
  {
    const j = ctx.pinJoint("pKR")!;
    const top = A.get("pKR-top")!;
    const flange = A.get("pKR-armR-brg-fl")!;
    growBase(ctx, [KR[0] - 60, -60, KR[0] + 60, 65]);
    const br = H.bridge(A, { id: "pKR-bridge", over: [KR], zMin: flange.z1 + 0.5, joint: "pKR" });
    if (!br) throw new Error("ackermann-steering: no bridge position over KR");
    br.bridge.holes.push(H.disc(j.d / 2 + 0.01, ...KR));
    br.bridge.marks.push(...H.oilSink(j.d / 2, ...KR));
    const zb = A.get("pKR-axle-s1")!;
    const zBase = zb.z0;
    const zArm = top.z0;
    const gap = br.z0 - zArm;
    const G = { at: top.at, ex: top.ex, joints: ["pKR"] };
    A.drop("pKR-top");
    if (gap > 0.3) {
      const D = raceD(ctx, j, gap > 3.2 ? j.d + 4 : j.d + 3.2);
      A.add((gap > 3.2 ? H.tube : H.spacer)("pKR-sp-top", j.d + 0.2, D, { ...G, z0: zArm, z1: br.z0, span: [top.ex, br.bridge.ex], name: gap > 3.2 ? `Inner-race spacer sleeve ${+(j.d + 0.2).toFixed(1)}x${+D.toFixed(1)}` : `Inner-race spacer ${+(j.d + 0.2).toFixed(1)}x${+D.toFixed(1)}` }));
    }
    const zh = zBase + shoulderLength(br.z1 - zBase);
    const head = A.get("pKR-axle-head")!;
    const k = head.z1 - head.z0;
    A.set("pKR-axle-s2", { z1: zh });
    A.set("pKR-axle-head", { z0: zh, z1: zh + k });
    if (zh - br.z1 > 0.05) A.set("pKR-axle-shim", { z0: br.z1, z1: zh, name: `Shim washer ${+(j.d + 0.2).toFixed(1)}x16x${+(zh - br.z1).toFixed(1)}, under the head` });
    else A.drop("pKR-axle-shim");
    A.set("pKR-axle", { name: `${boltName(j.d, br.z1 - zBase).replace("Shoulder bolt", "Axle, shoulder bolt")}, through the base, M8 nyloc underneath` });
    const J = A.joint("pKR");
    J.serves.F8 = [...(J.serves.F8 ?? []), "pKR-bridge"];
    J.serves.F1 = [...(J.serves.F1 ?? []), "pKR-bridge-post0-spigot", "pKR-bridge-post1-spigot"];
    J.badge = ["both ends held", "ok"];
  }

  // ---- M13, M10: the new stops (and the turnbuckle) are named and threadlocked like every other fastener (the locking and
  // materials rules ran before the polish) ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the input arm's swing engraved on the base, read off an index line on the arm tip: steering is trimmed by
  // eye, so the scale shows the lock at a glance ----
  const base = A.get("base")!;
  const R0 = r + 13;
  for (let a = Math.ceil(sw[0] / D2R / 5) * 5; a <= sw[1] / D2R + 0.01; a += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, a * D2R, ...KL), polar(R0 + (a % 15 === 0 ? 5 : 2.6), a * D2R, ...KL)] });
  base.marks.push({ kind: "scale", pts: arcPts(KL[0], KL[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("armL")!.marks.push({ kind: "index", pts: [[r + 6, 0], [r + 9.2, 0]] });
  (A.joint("pKL").serves.F9 ??= []).push("base", "armL");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pKL", {
    note: `${A.joint("pKL").note} Oscillating input: the shaft carries the drive lever below the base and two stops stand 2° beyond the ends of the swing. The arm sweeps over nothing here, so the support comes from the housing behind it.`,
  });
  A.joint("pKR", {
    note: `Dead axle Ø10, through the base to a washer and M8 nyloc and held at the top by the bridge; a F6800 bearing in the right knuckle arm, the arm and its stops on the base layer. The tie rod never reaches this hub, so a bridge fits over it: the posts stand where no arm or rod passes.`,
  });
  A.joint("pPL", {
    note: `Single shear is forced: the tie rod sweeps over the left arm tip and nothing can sit above it. ${sz("pPL-bolt")} threaded through the arm; the rod is plated low so the overhang is short, and the bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pPR", {
    note: `Single shear is forced: the tie rod sweeps over the right arm tip and nothing can sit above it. ${sz("pPR-bolt")} threaded through the arm at a Ø${pPR.d} pin; the bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Arms on the base layer, tie rod above", text: "The two knuckle arms never meet in the swing, so they share one plane; the tie rod rides above both. Nothing is stacked only to clear something." },
    { title: "Exact toe, one adjuster", text: `The Ackermann trapezoid depends on the tie rod's length (${t.toFixed(1)} mm) against the arm angle: the rod has a turnbuckle at its middle, drawn at its set point, so every pin centre is the model's.` },
    { title: "Single shear at both tie rod ends", text: "The rod sweeps over each arm tip, so no clevis or bridge fits above it. Each bearing sits between inner-race spacers and the pin is the shortest that holds." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of both arms' travel: untouched in running, they catch the arms with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
