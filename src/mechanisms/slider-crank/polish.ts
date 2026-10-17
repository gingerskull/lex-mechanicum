// Overrides and additions to the generated slider-crank assembly (standard 5.2). What differs from the rules:
// - plating (K1): the crank rides 2.5 mm up, so the crank pin, single shear because the rod sweeps over the input boss,
//   has a 1.5 mm overhang (A9); the rod cannot come down instead, the slide's keeper runs under it;
// - the crosshead is a clevis (A9): a cap 1.5 mm over the rod, on a post on the side the rod never swings to, so the
//   wrist pin works in double shear; the cap turns with the bolt (plain hole) and rides the crosshead's body;
// - a counterweighted crank (M2), a tapered rod (D1),
//   the lower end stop the slide could not place (F5);
// - notes, badges and build rules (A16).
import { bbox, roundedPoly, type Vec2 } from "../../core/geom";
import { edgeDist, toWorld } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { buildMovingPin } from "../../rules/j3-moving-pin";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { PLATING, l, r } from "./model";

/** Crank: pin boss, input boss and a counterweight lobe opposite the pin (M2). */
const CW: Vec2[] = [[r, 0], [-16, 13], [-16, -13]];

const near = (h: Vec2[], p: Vec2, tol = 0.5) => {
  const [x0, y0, x1, y1] = bbox(h);
  return Math.hypot((x0 + x1) / 2 - p[0], (y0 + y1) / 2 - p[1]) < tol;
};
const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const crank = A.get("crank")!;
  const rod = A.get("rod")!;
  const block = A.get("block")!;
  const cap = A.get("cap")!;
  const pA = ctx.pinJoint("pA")!;
  const pB = ctx.pinJoint("pB")!;

  // ---- D1, M2: counterweighted crank, tapered rod ----
  crank.name = "Crank, counterweighted";
  crank.outer = roundedPoly(CW, 9.5);
  crank.marks.push({ kind: "boss", pts: H.disc(11.4) });
  rod.outer = H.taper(l, 8.5, 8);

  // ---- plating: the crank up, the cap down; the input stack follows the crank, A and B are rebuilt ----
  const dz = PLATING.crank!;
  for (const [id, d] of Object.entries(PLATING)) {
    const s = A.get(id)!;
    s.z0 += d;
    s.z1 += d;
  }
  for (const s of A.find((t) => ["pO-crank-key", "pO-end", "pO-end-sh"].includes(t.id))) {
    s.z0 += dz;
    s.z1 += dz;
    if (s.threadZ) s.threadZ = [s.threadZ[0] + dz, s.threadZ[1] + dz];
  }
  const shaftTop = A.find((t) => t.group === "pO-shaft").reduce((p, q) => (q.z1 > p.z1 ? q : p));
  shaftTop.z1 += dz;
  // the bronze thrust washer stays on the base; a spacer turning with the shaft fills the gap up to the crank
  const tw = A.get("pO-tw")!;
  tw.z1 = tw.z0 + 1.5;
  A.add(H.spacer("pO-sp", tw.d!, tw.D!, { name: "Spacer, thrust washer to the crank", body: "crank", at: tw.at, z0: tw.z1, z1: crank.z0, ex: crank.ex, joints: ["pO"] }));

  A.drop((s) => s.id.startsWith("pA-") || s.id.startsWith("pB-"));
  for (const j of [pA, pB]) {
    const J = A.joint(j.id);
    J.serves = {};
    for (const x of j.joined) {
      const host = A.solidOf[x.part.id]!;
      host.holes = host.holes.filter((h) => !near(h, x.L));
      host.marks = host.marks.filter((mk) => !(mk.kind === "thread" && near(mk.pts, x.L)) && !(mk.kind === "boreEntry" && near(mk.pts, x.L, 2)));
      x.z0 = host.z0;
      x.z1 = host.z1;
      x.R = edgeDist(host.outer, x.L);
    }
  }
  // at B the cap turns with the bolt: a plain hole on the shoulder, the head bearing on it
  pB.driven.push(pB.joined.find((x) => x.part.id === "cap")!);
  buildMovingPin(ctx, pA);
  buildMovingPin(ctx, pB);
  cap.holes.push(H.disc(pB.d / 2 + 0.1));
  H.boreChamfers(cap);

  // ---- the cap's post, on the side away from the rod, screwed down into the crosshead ----
  const postX = 14;
  A.add(H.standoff("cap-post", { name: "Cap post Ø8", outer: H.disc(4), D: 8, role: "output", body: "block", at: [postX, 0, 0], z0: block.z1, z1: cap.z0, ex: cap.ex - 0.5, joints: ["pB"], mat: "Steel C45, black oxide" }));
  A.add(H.screw("cap-sc", "button", 3, cap.z1 - block.z1 + 4, { body: "block", at: [postX, 0, 0], face: cap.z1, dir: -1, ex: cap.ex, joints: ["pB"] }));
  for (const s of A.solids) if (s.body === "cap") s.body = "block";

  // ---- F5: the lower end stop, shorter than the slide's so it clears the crank's sweep ----
  const sj = ctx.info.find((j) => j.kind === "slide")!;
  if (sj.kind === "slide" && !A.get("slide-block-stop1")) {
    const F = sj.rails[1].fixed!;
    const [sx0] = bbox(sj.slider.shape.outer);
    const x = sj.range[0] - F[0] + sx0 - 2;
    const yIn: [number, number] = [4, 23];
    const W = (pts: Vec2[]) => pts.map((p) => toWorld(F, p));
    const zTop = block.z1 - 1;
    A.add(H.stop("slide-block-stop1", W(rect(x - 9.5, x - 3.5, ...yIn)), { name: "", qty: 0, z0: A.b1, z1: zTop, joints: ["slide-block"] }));
    A.add(H.bumper("slide-block-bump1", 0, 0, { outer: W(rect(x - 3.5, x - 1.5, ...yIn)), name: "", qty: 0, z0: A.b1 + 1, z1: zTop - 0.5, joints: ["slide-block"] }));
    const c = toWorld(F, [x - 6.5, (yIn[0] + yIn[1]) / 2]);
    A.add(H.screw("slide-block-stop1-sc", "button", 4, zTop - A.b1 + 6, { at: [c[0], c[1], 0], face: zTop, dir: -1, name: "", joints: ["slide-block"] }));
    (A.joint("slide-block").serves.F5 ??= []).push("slide-block-stop1");
    for (const t of A.find(/^slide-block-(stop0|bump0)$/)) t.qty = 2;
  }

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  const J5 = A.joint("slide-block");
  J5.note = J5.note.replace(/ No room for the lower end stop: something moving passes there\./, "") + " The lower end stop is shorter, to clear the crank's sweep. The rails are hardened, ground and screwed down: they and the bronze gib are the replaceable wear parts.";
  A.joint("pA", { note: `${A.joint("pA").note} Single shear is forced: the rod sweeps over the input boss. The crank is plated up so the overhang under the rod is 1.5 mm.`, badge: ["single shear", "warn"] });
  A.joint("pB", {
    note: `Crosshead clevis: the crosshead below and a cap 1.5 mm over the rod, the cap on a post at x ${postX} where the rod never swings, so the wrist pin works in double shear. ${A.get("pB-bolt")?.name ?? ""} threaded into the crosshead, shoulder through a plain hole in the cap; the rod's bearing between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  for (const id of ["raila-post", "railb-post"]) {
    const j = A.joint(id);
    j.note += " Clear of every sweep (clearance 0).";
    j.badge = ["clear of sweeps", "ok"];
  }
  A.rules.push(
    { title: "Crank and crosshead low, rod above", text: "Crank, crosshead and rails work near the base; the rod rides over the slide's keeper, so the crank is lifted to keep the crank pin's overhang at 1.5 mm." },
    { title: "Clevis at the crosshead", text: "The wrist pin is held above and below: a cap on a post on the side the rod never swings to." },
    { title: "Balanced crank", text: "A counterweight lobe opposite the pin balances the pin, the big end and part of the rod." },
    { title: "Guided, adjustable, wiped", text: "Keeper on one rail, a bronze gib with adjusting screws on the other, hardened rails, felt wipers, a grease nipple, rubber end stops just past the stroke." },
    { title: "Kinematics untouched", text: "Pin centres, the guide line and the stroke are the model's; the hardware is designed round them." },
  );
};
