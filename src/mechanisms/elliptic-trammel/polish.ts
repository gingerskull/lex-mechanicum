// Overrides and additions to the generated trammel assembly (standard 5.2). The rules find one groove pair per block
// (the build phase puts each block in one), seat it on ground pads and fit its slide. What differs from the rules:
// - the other groove pair of each axis gets the same seat and the same slide hardware by hand (AUTO-TODO: the rules
//   find a slide only where the block stands at the build phase), without a second set of stops and wipers;
// - notes, badges and build rules (A16).
import { bbox, type Vec2 } from "../../core/geom";
import { toWorld } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import type { SlideJoint } from "../../rules/types";

/** The seat the rules give a rail (rules/standoffs.ts railSeat): pad length, pitch, screw and dowel sizes. */
const PAD = { L: 12, pitch: 45, M: 3, dowel: 3, dowelIn: 5 };
const fmt = (v: number) => String(+v.toFixed(1));

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- the second pair of each axis: pads, dowels and screws as the rules seat the first, then the slide ----
  const seat = (id: string, jid: string) => {
    const part = ctx.parts[id]!;
    const q = A.get(id)!;
    const F = part.fixed!;
    A.drop(new RegExp(`^${id}-post`));
    q.joints = q.joints.filter((j) => j !== `${id}-post`);
    ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== `${id}-post`));
    q.holes.length = 0;
    const [x0, , x1] = bbox(part.shape.outer);
    const w = bbox(part.shape.outer)[3] - bbox(part.shape.outer)[1];
    const a = x0 + w / 2 + PAD.L / 2 + 0.5;
    const b = x1 - w / 2 - PAD.L / 2 - 0.5;
    const n = Math.max(2, Math.ceil((b - a) / PAD.pitch) + 1);
    const at = Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
    const h = q.z0 - ctx.b1;
    const serves: string[] = [];
    at.forEach((x, k) => {
      const first = k === 0;
      A.add(H.standoff(`${jid}${k}`, {
        name: first ? `Rail pad ${fmt(w)} x ${PAD.L} x ${fmt(h)}, steel, ground` : "",
        qty: first ? n : 0,
        mat: "Steel C45, ground",
        outer: [[x - PAD.L / 2, -w / 2], [x + PAD.L / 2, -w / 2], [x + PAD.L / 2, w / 2], [x - PAD.L / 2, w / 2]],
        D: undefined,
        at: F,
        z0: ctx.b1,
        z1: q.z0,
        ex: -1,
        joints: [jid],
      }));
      const c = toWorld(F, [x, 0]);
      q.holes.push(H.disc(PAD.M / 2 + 0.3, x, 0));
      A.add(H.screw(`${jid}${k}-sc`, "csk", PAD.M, q.z1 - ctx.b1 + 1.5 * PAD.M, { at: [c[0], c[1], 0], face: q.z1, dir: -1, ex: q.ex, joints: [jid], name: first ? undefined : "", qty: first ? n : 0 }));
      if (k === 0 || k === n - 1) {
        const d = toWorld(F, [x + (k ? 1 : -1) * (PAD.L / 2 - PAD.dowel / 2 - 1.5), 0]);
        const id2 = `${jid}${k}-dowel`;
        A.add(H.dowel(id2, PAD.dowel, { at: [d[0], d[1], 0], z0: ctx.b1 - PAD.dowelIn, z1: q.z0 + Math.min(3, (q.z1 - q.z0) / 2), ex: -1, joints: [jid], name: k ? "" : `Dowel pin Ø${PAD.dowel} h6 (ISO 8734), rail to base`, qty: k ? 0 : 2 }));
        serves.push(id2);
      }
    });
    A.joint(jid, { type: "post", at: toWorld(F, [at[0]!, 0]) as Vec2, title: `Seat · ${q.name}`, note: `Seated on ${n} ground steel pads ${fmt(h)} mm thick, one under each fixing: a countersunk M${PAD.M} down through rail and pad into the base at each, two Ø${PAD.dowel} dowels through the end pads locating it.`, badge: ["seated and dowelled", "ok"], serves: { F1: serves } });
    q.joints.push(jid);
  };

  for (const [blk, a, b, tag] of [["blockX", "xla", "xlb", "left"], ["blockY", "yda", "ydb", "lower"]] as const) {
    seat(a, `${a}-seat`);
    seat(b, `${b}-seat`);
    const main = ctx.info.find((j): j is SlideJoint => j.kind === "slide" && j.slider.id === blk)!;
    const sj: SlideJoint = { kind: "slide", id: `slide-${blk}-${tag}`, type: "J5", rails: [ctx.parts[a]!, ctx.parts[b]!], slider: main.slider, axis: main.axis, range: main.range };
    A.joint(sj.id, { type: "J5", at: toWorld(ctx.parts[b]!.fixed!, [0, 0]) as Vec2, title: `Slide · ${tag} grooves of ${A.get(blk)!.name}` });
    A.get(a)!.joints.push(sj.id);
    A.get(b)!.joints.push(sj.id);
    H.slide(A, sj);
    // the first pair carries the wipers and both end stops for the whole travel: not a second set
    A.drop(new RegExp(`^${sj.id}-(wiper|stop|bump)`));
    const J = A.joint(sj.id);
    for (const k of ["F5", "F8"] as const) if (J.serves[k]) J.serves[k] = J.serves[k]!.filter((id) => A.solids.some((t) => t.id === id));
    J.note += " Wipers and end stops are on the first pair of this axis, which sees the whole travel.";
  }

  // the seats are new solids: locking and materials for them, as the rules give the rest
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pA", {
    note: `${A.joint("pA").note} Single shear is forced: the rod turns a full circle round A, so no cap or post can reach over it. The rod rides 3 mm over the block; the shoulder bolt threads into the block and the rod runs on a bearing between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `${A.joint("pB").note} Single shear for the same reason as A: the rod circles B.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pM", {
    note: `${A.joint("pM").note} Single shear: the crank is under the blocks and the rod over them, 9 mm apart, and both turn fully, so nothing can bridge them; the bolt threads into the crank, the rod has the bearing. The crank pin's circle of 30 mm is why no groove wall stands within 40 mm of O.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Crank under, rod over", text: "The input shaft stops under the blocks, so a block can cross the pivot on its way through the crossing; the crank is plated 3 mm up, 1 mm under them, and the rod rides 3 mm over the blocks and the keepers." },
    { title: "Grooves cut back to the crank pin's circle", text: "The crank pin sweeps a 30 mm circle through the block layer, so each groove starts 40 mm from the centre; the 40 mm blocks are in their grooves again from 20 mm either side, and cross the opening on the rod." },
    { title: "Four groove pairs, one hardware set", text: "Every pair is seated on ground pads, dowelled, with a keeper, a bronze gib and a grease nipple; wipers and the end stops are fitted once, at the ends of the travel." },
    { title: "Single shear at every pin", text: "Rod and crank each turn a full circle, so no cap or post can reach over a pin: bolts thread into the lower part, bearings sit in the rod between inner-race spacers." },
    { title: "Kinematics untouched", text: "Block and pen distances, the crank length and the groove lines are the solver's; plating, outlines and hardware are designed round them." },
  );
};
