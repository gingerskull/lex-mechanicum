// Overrides and additions to the generated trammel assembly (standard 5.2). The model carries what moves (crank, rod,
// blocks, pen); the rules build the input shaft, the three pins and the base. What the rules cannot place, the polish
// states (#61, review fix):
// - the groove plate, one piece, a + with both grooves cut through it, on three posts outside the rod's sweep, drawn
//   see-through because the crank and rod turn under it;
// - the slide hardware of its four half-arms, as the slide rule builds a slide: a bronze gib on one wall clamped under a
//   keeper plate that laps the block, by the keeper's two screws; the other wall is the reference; felt wipers on the
//   blocks, a grease nipple per groove, neoprene end pads (J5, F2, F5, F7, F8);
// - the base grown to the plate, notes, badges and build rules (A16).
import { type Vec2 } from "../../core/geom";
import { toWorld } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { STANDOFF } from "../../hardware/tables";
import { baseCorners, growBase } from "../../rules/base";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { ARM_X, ARM_Y, BLOCK_W, GAP, GROOVE, PLATE_T, WALL, plateShape } from "./model";

const g = GAP / 2;
/** Layer 2 of the model: the blocks and the plate stand at this z. */
const Z = 20;
/** Keeper plate thickness, the lap it takes over the block, the gib thickness, the pad thickness, mm. */
const KEEP = 2.5;
const LAP = 1;
const GIB = 1.2;
const PAD = 2;
/** The slide hardware runs from the crossing's edge to just short of the pad. */
const X0 = g + 12;
const X1 = GROOVE - PAD - 4;
/** Posts under the plate: two at the ends of the y arm, one at the closed end of the -x arm, all outside the rod's sweep. */
const POSTS: Vec2[] = [[0, ARM_Y - 8], [0, -(ARM_Y - 8)], [-(ARM_X - 8), 0]];

const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [[Math.min(x0, x1), Math.min(y0, y1)], [Math.max(x0, x1), Math.min(y0, y1)], [Math.max(x0, x1), Math.max(y0, y1)], [Math.min(x0, x1), Math.max(y0, y1)]];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const ex = A.exOf(Z);
  const { outer, groove } = plateShape();

  // ---- the base takes the plate (A7) ----
  growBase(ctx, [-ARM_X - 14, -ARM_Y - 14, ARM_X + 14, ARM_Y + 14]);
  baseCorners(ctx).forEach((c, i) => {
    const f = A.get(`foot${i}`);
    if (f) f.at = [c[0], c[1], 0];
  });

  // ---- the groove plate and its posts ----
  const plate = A.add(H.plate("groove-plate", outer, {
    name: "Groove plate, one piece, grooves ground",
    mat: "Steel C45, ground",
    holes: [groove, ...POSTS.map(([x, y]) => H.disc(STANDOFF.spigotD / 2 + 0.05, x, y))],
    z0: Z,
    z1: Z + PLATE_T,
    ex,
    seeThrough: true,
    why: "the one plate both grooves are cut in, so the blocks cross the centre in a groove",
  }))[0]!;
  const seat = "groove-plate-post";
  const seatServes: string[] = [];
  POSTS.forEach(([x, y], k) => {
    const at: [number, number, number] = [x, y, 0];
    const G = { at, joints: [seat] };
    A.add(H.standoff(`${seat}${k}`, { ...G, name: k ? "" : `Standoff Ø${STANDOFF.D} x ${+(Z - ctx.b1).toFixed(1)}, M${STANDOFF.M}, Ø${STANDOFF.spigotD} spigot`, qty: k ? 0 : POSTS.length, outer: H.disc(STANDOFF.D / 2), D: STANDOFF.D, z0: ctx.b1, z1: Z, span: [-1, ex], ex: -1 }));
    const sp = A.add(H.spigot(`${seat}${k}-spigot`, { ...G, z0: Z, z1: Z + STANDOFF.spigotH, ex, allow: [plate.id] }))[0]!;
    seatServes.push(sp.id);
    A.add(H.screw(`${seat}${k}-top`, "button", STANDOFF.M, plate.z1 - Z + 1.5 * STANDOFF.M, { ...G, face: plate.z1, dir: -1, ex }));
    A.add(H.screw(`${seat}${k}-bot`, "button", STANDOFF.M, ctx.b1 - ctx.b0 + 1.5 * STANDOFF.M, { ...G, face: ctx.b0, dir: 1, ex: -1 }));
    plate.holes.push(H.disc(STANDOFF.M / 2 + 0.3, x, y));
  });
  A.joint(seat, {
    type: "post",
    at: POSTS[0]!,
    title: "Post · Groove plate",
    note: `Three Ø${STANDOFF.D} standoffs, ${+(Z - ctx.b1).toFixed(1)} mm, hold the plate over the crank and rod: two at the ends of the y arm and one at the closed end of the x arm, all outside the rod's sweep (the pen end reaches 106.5 mm up the y arm, the posts' inner edge is at ${ARM_Y - 8 - STANDOFF.D / 2}). Each is spigoted into a reamed hole in the plate, which locates it, and screwed from both sides.`,
    badge: ["check sweep", "warn"],
    serves: { F1: seatServes },
  });
  plate.joints.push(seat);

  // ---- the slide hardware of each half arm, in the arm's frame (x outward from the centre, y across) ----
  const blocks: Record<string, string> = { "+x": "blockX", "-x": "blockX", "+y": "blockY", "-y": "blockY" };
  const arms: [string, number][] = [["+x", 0], ["-x", Math.PI], ["+y", Math.PI / 2], ["-y", -Math.PI / 2]];
  const slideJ: Record<string, string> = { blockX: "slide-blockX", blockY: "slide-blockY" };
  for (const bk of ["blockX", "blockY"]) {
    A.joint(slideJ[bk]!, { type: "J5", at: [0, 0], title: `Slide · ${A.get(bk)!.name}`, note: "", serves: {} });
    A.get(bk)!.joints.push(slideJ[bk]!);
  }
  const z0 = Z + PLATE_T;
  arms.forEach(([tag, a]) => {
    const bk = blocks[tag]!;
    const jid = slideJ[bk]!;
    const J = A.joint(jid);
    const W = (pts: Vec2[]) => pts.map((p) => toWorld([0, 0, a], p));
    const lead = tag === "+x" || tag === "+y";
    const G = { joints: [jid], ex, body: "ground" };
    const serve = (k: "F2" | "F5" | "F7" | "F8", id: string) => (J.serves[k] ??= []).push(id);
    const n = 2;

    // bronze gib on the - wall, up to the plate's top, so the keeper over it clamps it once it is set (F7)
    const gb = H.gib(`${jid}-${tag}-gib`, X1 - X0, { ...G, outer: W(rect(X0, X1, -g, -g + GIB)), z0: Z + 0.2, z1: z0, name: lead ? `Gib strip ${GIB} x ${+(z0 - Z - 0.2).toFixed(1)} x ${X1 - X0}, bronze, clamped under the keeper` : "", qty: lead ? n : 0 });
    A.add(gb);
    serve("F7", gb.id);
    // keeper over the - wall and the gib, riding on the plate, lapping the block by 1.5 mm (F2); its two screws clamp
    // the gib
    const keeper = H.plate(`${jid}-${tag}-keeper`, W(rect(X0, X1, -g - WALL, -BLOCK_W / 2 + LAP)), { ...G, name: lead ? "Keeper plate, holds the block down and clamps the gib" : "", qty: lead ? n : 0, z0, z1: z0 + KEEP, mat: "Steel, ground" });
    A.add(keeper);
    serve("F2", keeper.id);
    [0.15, 0.85].forEach((f, k) => {
      const p = toWorld([0, 0, a], [X0 + (X1 - X0) * f, -g - WALL / 2]);
      const first = lead && k === 0;
      A.add(H.screw(`${jid}-${tag}-keeper-sc${k}`, "csk", 3, KEEP + 4, { ...G, at: [p[0], p[1], 0], face: keeper.z1, dir: -1, name: first ? undefined : "", qty: first ? 2 * n : 0 }));
    });

    // neoprene end pad on the groove's closed end (F5): the wall is the stop
    const pad = H.bumper(`${jid}-${tag}-pad`, 0, 0, { ...G, outer: W(rect(GROOVE - PAD, GROOVE, -g + GIB + 0.5, g - 0.5)), z0: Z + 1, z1: z0 - 1.5, name: lead ? "Stop pad, neoprene 2 mm" : "", qty: lead ? n : 0 });
    A.add(pad);
    serve("F5", pad.id);

    // a grease nipple on the keeper of each groove's leading half arm (F8): the grease runs the groove's length
    if (lead) {
      const pn = toWorld([0, 0, a], [(X0 + X1) / 2, -g - WALL / 2]);
      const nip = H.nipple(`${jid}-${tag}-nipple`, { ...G, at: [pn[0], pn[1], 0], z0: keeper.z1 });
      A.add(nip);
      serve("F8", nip.id);
    }
  });
  // felt wipers at the ends of each block (F8): on the block, so they travel with it
  for (const bk of ["blockX", "blockY"]) {
    const b = A.get(bk)!;
    const J = A.joint(slideJ[bk]!);
    [1, -1].forEach((sg, k) => {
      const w = H.wiper(`${slideJ[bk]}-wiper${k}`, rect(sg * 20, sg * 22, -BLOCK_W / 2 + 1, BLOCK_W / 2 - 1), { body: bk, z0: b.z0 + 1, z1: b.z1 - 1, ex: b.ex, joints: [slideJ[bk]!], name: k === 0 ? "Felt wiper in a steel clip" : "", qty: k === 0 ? 2 : 0 });
      A.add(w);
      (J.serves.F8 ??= []).push(w.id);
    });
  }
  for (const bk of ["blockX", "blockY"]) {
    const J = A.joint(slideJ[bk]!);
    J.badge = ["guided both sides", "ok"];
    J.note = `${A.get(bk)!.name} runs in a groove of the one-piece plate, 20 mm wide, ground; it crosses the centre in the groove. On each half arm a bronze gib on one wall takes the play out against the other wall, the reference, and a keeper plate over it laps the block by ${LAP} mm and holds it down; the keeper's two screws clamp the gib once it is set. Felt wipers at both ends of the block, a grease nipple on one keeper per groove, and a neoprene pad on each closed groove end, 2 mm past the block's travel.`;
  }

  // hardware is new: locking and materials as the rules give the rest
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pA", {
    note: `${A.joint("pA").note} Single shear is forced: the rod turns a full circle round A, so no cap or post can reach over it. The rod is under the block; the shoulder bolt goes down through the block into the rod, which runs on a bearing between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `${A.joint("pB").note} Single shear for the same reason as A: the rod circles B.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pM", {
    note: `${A.joint("pM").note} Single shear: crank and rod are one layer apart and both turn fully, so nothing can bridge them; the bolt threads into the crank, the rod has the bearing. Both are under the groove plate, so the crank pin never meets a groove wall.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "One plate, both grooves", text: "The two grooves are cut through one plate and meet at its centre, so a block crosses the middle in a groove and nothing is cut back; the plate is ground, then the blocks are dropped into it from above." },
    { title: "Everything that turns is under the plate", text: "The crank on the input shaft, the rod over it, and the pen on the rod. Only the blocks stand in the plate's layer and the pins go down from them onto the rod, so no part crosses another where it cannot." },
    { title: "Posts outside the sweep", text: "The plate stands on three spigoted posts, two at the ends of the y arm beyond the pen's reach and one at the closed x end, none under the rod's sweep." },
    { title: "Slide hardware once per half arm", text: "A gib clamped under a keeper and a neoprene pad serve each half arm, a nipple each groove; set the gibs and fit the keepers last, after the blocks are in." },
    { title: "Single shear at every pin", text: "Rod and crank each turn a full circle, so no cap or post can reach over a pin: bolts thread into the lower part, bearings sit in the rod between inner-race spacers." },
  );
};
