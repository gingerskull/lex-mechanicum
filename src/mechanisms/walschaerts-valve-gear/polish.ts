// Overrides and additions to the generated Walschaerts valve gear assembly (standard 5.2). What differs from the rules:
// - the die: the rule's bolt at D gives way to a stud running up into a bronze die block in the slot, held by a circlip
//   (the slot is the gap between the link's two bars, which the rules do not see as a slot);
// - the slot as at the Whitworth lever: hardened screwed wear strips (M14), an end block at each end (F5), the bars tied
//   by the trunnion's cover and an end strap at each end, on posts;
// - the reverse arm on an eccentric bushing (F7); match marks for the return crank (F9); notes and rules (A16).
import { circle, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { BAR_END, BW, GAP, R, arcAt, bar, r, rr } from "./model";

const STRIP = 1.5;
const BLOCK0 = 26.5;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const link = A.get("link")!;
  const cap = A.get("linkcap")!;
  const z0 = link.z0;
  const z1 = link.z1;
  const G = { body: "link", ex: link.ex, joints: ["pD"] };
  const atL = (p: Vec2): [number, number, number] => [p[0], p[1], 0];

  // ---- the die: the rule's shoulder bolt at D is replaced by a stud threaded into the lifting link, running up
  // through the radius rod's bearing into a bronze die block in the slot, held by an external circlip ----
  const old = A.get("pD-bolt")!;
  const top = A.get("pD-top")!;
  const pD = ctx.pinJoint("pD")!;
  const lift = A.get("lifting")!;
  const D = { body: old.body, at: old.at, joints: ["pD"] };
  const ex = A.get("pD-bolt-head")!.ex;
  A.drop(/^pD-bolt/);
  const clip = 0.7;
  A.add(H.shaft("pD-stud", { d: pD.d, z0: lift.z0, z1: z1 + clip + 0.4, thread: { M: 5, z0: lift.z0, z1: lift.z1 }, grooves: [z1] }, { ...D, ex, name: `Die stud Ø${pD.d}, M5 threaded into the lifting link, circlip groove`, mat: "Alloy steel 12.9, ground shoulder, black oxide" }));
  A.add(H.tube("pD-sp-die", pD.d + 0.2, top.D!, { ...D, z0: top.z1, z1: z0, ex: link.ex - 0.5, name: `Spacer sleeve ${pD.d + 0.2}x${top.D!.toFixed(1)}, under the die` }));
  const die = H.plate("die", circle(GAP - STRIP - 0.25, 0, 0, 40), {
    ...D,
    kind: "part",
    role: "link",
    z0,
    z1,
    ex: link.ex,
    holes: [circle(pD.d / 2 + 0.05, 0, 0, 28)],
    marks: H.oilSink(pD.d / 2),
    mat: "Bronze CuSn12, oil-grooved",
    name: `Die block Ø${2 * (GAP - STRIP - 0.25)}, bronze, turning on the stud`,
    why: "runs in the slot between the wear strips and carries the radius rod (J4)",
  });
  A.add(die);
  A.add(H.circlip("pD-clip", pD.d, { ...D, z0: z1, z1: z1 + clip, ex: link.ex }));
  const J = A.joint("pD");
  (J.serves.F2 ??= []).push("pD-clip");
  (J.serves.F8 ??= []).push("die");

  // ---- M14: hardened wear strips on both faces of the slot, between the end blocks, two countersunk M2 at each third ----
  const faces: [number, number, number][] = [
    [R + GAP - STRIP, R + GAP, R + GAP + 1.8],
    [R - GAP, R - GAP + STRIP, R - GAP - 1.8],
  ];
  faces.forEach(([r0, r1, rs], k) => {
    A.add(H.wearStrip(`ws${k}`, bar(-BLOCK0 + 2, BLOCK0 - 2, r0, r1), { ...G, z0, z1, name: k ? "" : "Wear strip, curved R180, hardened, 4 x M2 csk", qty: k ? 0 : 2 }));
    [-17, -6, 6, 17].forEach((t, i) => A.add(H.screw(`ws${k}-sc${i}`, "csk", 2, 5, { ...G, at: atL(arcAt(t, rs)), face: z1, dir: -1, name: "" })));
    (J.serves.F2 ??= []).push(`ws${k}`);
  });

  // ---- F5: an end block closes each end of the slot, 3.5 mm past the die's travel; a strap at each end ties the bars ----
  const ties: { id: string; t: number }[] = [
    { id: "lend0", t: -(BLOCK0 + BAR_END) / 2 },
    { id: "lend1", t: (BLOCK0 + BAR_END) / 2 },
  ];
  ties.forEach(({ id, t }, k) => {
    const s = Math.sign(t);
    A.add(H.plate(`${id}-block`, bar(s > 0 ? BLOCK0 : -BAR_END, s > 0 ? BAR_END : -BLOCK0, R - GAP, R + GAP), { ...G, kind: "stop", role: "link", z0, z1, mat: "Steel C45, hardened", name: k ? "" : "Slot end block, hardened, screwed from the strap", qty: k ? 0 : 2 }));
    A.add(H.plate(`${id}-strap`, roundedPoly([arcAt(t, R - GAP - BW / 2), arcAt(t, R + GAP + BW / 2)], 5.5), { ...G, kind: "part", role: "link", z0: cap.z0, z1: cap.z1, ex: cap.ex, mat: "Steel C45, black oxide", name: k ? "" : "Link end strap, ties the bars over the slot end", qty: k ? 0 : 2 }));
  });
  (J.serves.F5 ??= []).push("lend0-block", "lend1-block");

  // ---- posts under the cover and the end straps, one on each bar and one into each end block ----
  const posts: Vec2[] = [arcAt(0, R - GAP - BW / 2), arcAt(0, R + GAP + BW / 2)];
  for (const { t } of ties) posts.push(arcAt(t, R - GAP - BW / 2), arcAt(t, R + GAP + BW / 2), arcAt(t, R));
  posts.forEach((p, i) => {
    A.add(H.tube(`lpost${i}`, 3.2, 6, { ...G, at: atL(p), z0: z1, z1: cap.z0, ex: cap.ex - 0.5, name: i ? "" : "Link post Ø6, between bar and strap", qty: i ? 0 : posts.length }));
    A.add(H.screw(`lpost${i}-sc`, "button", 3, cap.z1 - z1 + 4.5, { ...G, at: atL(p), face: cap.z1, dir: -1, ex: cap.ex, name: i ? "" : undefined }));
  });

  // ---- F7: the reverse arm on an eccentric bushing in the base: turned to put the die exactly at its setting ----
  H.eccentricMount(A, "pLr", { at: A.pin("pLr")!, d: ctx.pinJoint("pLr")!.d });

  // ---- F9: the return crank's 90° lead marked on the crank web and the return crank ----
  A.get("wheel")!.marks.push({ kind: "index", pts: [[r - 12, -11], [r - 12, -7]] });
  A.get("retcrank")!.marks.push({ kind: "index", pts: [[r - 12, -7], [r - 12, -4]] }, { kind: "index", pts: [[-4, rr - 12], [-1, rr - 12]] });
  (A.joint("pCp").serves.F9 ??= []).push("wheel", "retcrank");

  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO", { note: `${A.joint("pO").note} The rods sweep over the axle: support from the housing behind it.` });
  A.joint("pCp", {
    note: `${sz("pCp-bolt")} threaded into the crank web, a bearing in the main rod, the return crank on the shoulder outside it: double shear.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pRc", { note: `${sz("pRc-bolt")} threaded into the return crank, a bearing in the eccentric rod; single shear, the main rod sweeps under it.`, badge: ["single shear", "warn"] });
  A.joint("pXh", { note: `Crosshead and its arm straddle the main rod's small end, ${sz("pXh-bolt")}: double shear.`, badge: ["double shear", "ok"] });
  A.joint("pLf", { note: `${sz("pLf-bolt")} threaded into the eccentric rod, a bearing in the link's ear; single shear.`, badge: ["single shear", "warn"] });
  A.joint("pLt", {
    note: `${A.joint("pLt").note} The die passes the trunnion's place, so the link hangs from the cover strap over the slot.`,
  });
  A.joint("pD", {
    note: `A stud in the lifting link carries the radius rod on a bearing and a bronze die block in the slot, held by a circlip, between hardened strips, 3.5 mm short of the end blocks; single shear.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pRt", { note: `${sz("pRt-bolt")} threaded into the radius rod, a bearing in the lever.`, badge: ["single shear", "warn"] });
  A.joint("pVs", { note: `${sz("pVs-bolt")} through the lever, a bearing in the spindle block above the radius rod.`, badge: ["stacked", "warn"] });
  A.joint("pUb", { note: `${sz("pUb-bolt")}, a bearing in the union link.`, badge: ["single shear", "warn"] });
  A.joint("pUc", { note: `${sz("pUc-bolt")} threaded into the crosshead arm, through layers nothing sweeps here.`, badge: ["stacked", "warn"] });
  A.joint("pLr", {
    note: `${A.joint("pLr").note} The reverse arm: an eccentric bushing in the base sets the die's place in the slot. The link sweeps over it: no bridge.`,
  });
  A.rules.push(
    { title: "The slot is a gap between two bars", text: "The die passes the trunnion's place, so the link is two curved bars tied by the trunnion's cover and an end strap at each end." },
    { title: "Trunnion carried from above", text: "A stub from a bridge into the cover only; die, radius rod and lifting link pass under it." },
    { title: "Replaceable slot faces", text: "Hardened strips on both slot faces and a bronze die: the wear parts." },
    { title: "Clevis at both big ends", text: "Return crank and crosshead arm straddle the main rod's two ends." },
    { title: "Kinematics untouched", text: "Pin centres, the slot arc and the die's slip are the solver's; the hardware is designed round them." },
  );
};
