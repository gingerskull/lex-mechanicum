// Overrides and additions to the generated oscillating cylinder assembly (standard 5.2). The stack (port standard,
// cylinder floor, frame and piston, cover), the counterweighted crank, the notched piston and the crank pin are the
// model's; the rules build the trunnion as a dead axle with a track roller in the piston notch and wear strips,
// bearings in floor and cover, the stops, the bridge and the drive. What differs from the rules:
// - the port standard's posts are screwed up flush from underneath: a button head on its face would be in the way of
//   the cylinder's port face (A14);
// - the bridge is lifted to make room for the compression spring that holds the port face down (F6);
// - the cylinder block (floor, frame, cover) is screwed together and dowelled (F1, A17); its bore corners are rounded
//   (M5); a grease nipple feeds the bore (F8);
// - the swing engraved on the base with an index line on the cover (F9);
// - the base grown over the stops, the cover drawn see-through over the piston (A7, L5);
// - notes, badges and build rules (A16).
import { D2R, arcPts, bbox, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import type { Solid } from "../../hardware/solid";
import { baseCorners, growBase } from "../../rules/base";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { swing } from "../../hardware/sub/stops";
import { BORE, bore, d as D3 } from "./model";

/** Free height of the port-face spring, mm. */
const SPRING_H = 10;
/** The bronze thrust washer between the spring and the rocking cover bearing flange. */
const WASHER = 1;
/** Screws holding the cylinder block together, in its own frame: M3 into the floor, and the two dowels. */
const BLOCK_SCREWS: Vec2[] = [[-38, -24], [-38, 24], [38, -24], [38, 24]];
const BLOCK_DOWELS: Vec2[] = [[-14, -24], [14, 24]];
/** Where the grease nipple stands on the cover, along the bore. */
const NIPPLE_X = -24;

function lift(s: Solid, dz: number, keepBottom = false): void {
  s.z1 += dz;
  if (!keepBottom) s.z0 += dz;
  if (s.threadZ) s.threadZ = keepBottom ? [s.threadZ[0], s.threadZ[1] + dz] : [s.threadZ[0] + dz, s.threadZ[1] + dz];
}

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const floor = A.get("cyl-floor")!;
  const frame = A.get("cyl-frame")!;
  const cover = A.get("cyl-cover")!;
  const std = A.get("standard")!;
  const base = A.get("base")!;
  const rod = A.get("rod")!;

  // ---- A7: the base takes the stops: they stand just beyond the swing, past the old right edge (H.stops does not grow the
  // base, promotion candidate); the feet and mounting holes move with the grown corners ----
  const [bx0, by0, bx1, by1] = bbox(base.outer);
  let sx1 = bx1;
  for (const k of [0, 1]) {
    const st = A.get(`pO3-stop${k}`);
    if (st) sx1 = Math.max(sx1, st.at[0] + 6 + 8);
  }
  if (sx1 > bx1) {
    growBase(ctx, [bx0, by0, sx1, by1]);
    baseCorners(ctx).forEach((c, i) => {
      const f = A.get(`foot${i}`);
      if (f) f.at = [c[0], c[1], 0];
    });
  }

  // ---- L5: the cover and the floor hide the piston and its rod, which move in and out of the block: drawn see-through ----
  cover.seeThrough = true;

  // ---- M5: the T cut of the bore with a cutter radius at its corners ----
  // M14: the piston slides on two hardened wear strips screwed into the bore walls; the bore is relieved by the strip
  // thickness behind them, so the strips' faces are the modelled walls (K1)
  const STRIP = 1.5;
  frame.holes[0] = H.filletPoly(bore.map(([x, y]): Vec2 => (Math.abs(y) >= 20 ? [x, Math.sign(y) * (Math.abs(y) + STRIP)] : [x, y])), 2);
  const L = BORE / 2 - 1;
  [1, -1].forEach((sg, k) => {
    const y0 = sg * 20;
    const y1 = sg * (20 + STRIP);
    A.add(H.wearStrip(`bore-ws${k}`, [[-L, y0], [L, y0], [L, y1], [-L, y1]], { body: "cyl-frame", at: [0, 0, 0], z0: frame.z0, z1: frame.z1, ex: frame.ex, joints: ["pO3"], name: k ? "" : `Wear strip ${2 * L} x ${STRIP}, hardened, 2 x M2 csk, bore wall`, qty: k ? 0 : 2 }));
    for (const x of [-L * 0.6, L * 0.6]) {
      const yy = sg * (20 + STRIP + 0.7);
      A.add(H.screw(`bore-ws${k}-sc${x < 0 ? 0 : 1}`, "csk", 2, 5, { body: "cyl-frame", at: [x, yy, 0], face: frame.z1, dir: -1, ex: frame.ex + 0.5, joints: ["pO3"], name: "" }));
    }
  });

  // ---- A14: the standard's top screws flush (countersunk), so the lapped port face runs clear of them ----
  for (const k of [0, 1]) {
    const head = A.get(`standard-post${k}-top`)!;
    const sh = A.get(`standard-post${k}-top-sh`)!;
    A.drop(`standard-post${k}-top`);
    A.drop(`standard-post${k}-top-sh`);
    A.add(H.screw(`standard-post${k}-top`, "csk", 5, 14, { body: "ground", at: head.at, face: std.z1, dir: -1, ex: head.ex, joints: head.joints }));
    void sh;
  }

  // ---- F6: lift the bridge to make room for the spring that holds the port face down ----
  const bridge = A.get("pO3-bridge")!;
  const flange = A.get("pO3-cyl-cover-brg-fl")!;
  const dz = SPRING_H + WASHER - (bridge.z0 - flange.z1);
  const at = A.pin("pO3")!;
  if (dz > 0) {
    lift(bridge, dz);
    for (const k of [0, 1]) {
      lift(A.get(`pO3-bridge-post${k}`)!, dz, true);
      lift(A.get(`pO3-bridge-post${k}-spigot`)!, dz);
      lift(A.get(`pO3-bridge-post${k}-top`)!, dz);
      lift(A.get(`pO3-bridge-post${k}-top-sh`)!, dz, false);
      A.get(`pO3-bridge-post${k}-top-sh`)!.z0 -= dz;
    }
    lift(A.get("pO3-axle-s2")!, dz, true);
    lift(A.get("pO3-axle-shim")!, dz);
    lift(A.get("pO3-axle-head")!, dz);
    const sp = A.get("pO3-sp-top")!;
    const sleeve = H.tube(sp.id, sp.d!, sp.D!, { body: sp.body, at: sp.at, z0: sp.z0, z1: bridge.z0, ex: sp.ex, joints: sp.joints, span: sp.span, name: `Inner-race spacer sleeve ${+sp.d!.toFixed(1)}x${+sp.D!.toFixed(1)}` });
    A.drop(sp.id);
    A.add(sleeve);
  }
  const spring = H.spring("pO3-spring", "compression", {
    D: 18,
    wire: 1.2,
    name: `Compression spring Ø18 x ${SPRING_H}, wire 1.2, port-face preload`,
    body: "ground",
    at: [at[0], at[1], 0],
    z0: flange.z1 + WASHER,
    z1: flange.z1 + WASHER + SPRING_H,
    ex: Math.max(cover.ex, bridge.ex) - 0.5,
    joints: ["pO3"],
    span: [cover.ex, bridge.ex],
    allow: [bridge.id],
  });
  const sleeveD = A.get("pO3-sp-top")!.D!;
  const tw = H.thrustWasher("pO3-spring-tw", sleeveD + 0.3, 18, { body: "ground", at: [at[0], at[1], 0], z0: flange.z1, z1: flange.z1 + WASHER, ex: cover.ex + 0.25, joints: ["pO3"], name: "Thrust washer 13.4x18, bronze, under the spring" });
  A.add(spring, tw);
  (A.joint("pO3").serves.F6 ??= []).push(spring.id);

  // ---- F1, A17: the cylinder block, screwed into the floor from the cover and dowelled ----
  const M = 3;
  const scr = (x: number, y: number, k: number): void => {
    const L = cover.z1 - (floor.z0 + 1.5);
    A.add(H.screw(`blk-sc${k}`, "socket", M, L, { body: "cyl-floor", at: [x, y, 0], face: cover.z1, dir: -1, ex: cover.ex + 0.5, joints: ["pO3"], name: k ? "" : undefined, qty: k ? 0 : 4 }));
  };
  BLOCK_SCREWS.forEach(([x, y], k) => {
    scr(x, y, k);
    // the screw passes cover and frame (bodies of their own, so stage 3 leaves them): clearance holes, and a tapped blind hole in the floor
    for (const t of [cover, frame]) t.holes.push(H.disc(M / 2 + ctx.form.fasteners.clearance, x, y));
    floor.marks.push({ kind: "thread", pts: H.disc(M / 2 + 0.45, x, y) });
  });
  BLOCK_DOWELS.forEach(([x, y], k) => {
    for (const t of [frame, cover]) t.holes.push(H.disc(1.5, x, y));
    A.add(H.dowel(`blk-dw${k}`, 3, { body: "cyl-floor", at: [x, y, 0], z0: floor.z0 + 4, z1: cover.z1 - 0.5, ex: floor.ex, name: k ? "" : "Dowel pin Ø3 x 22 h6, frame and cover to the port block", qty: k ? 0 : 2, joints: ["pO3"] }));
  });

  // ---- F8: grease nipple on the cover feeding the bore ----
  const nip = H.nipple("bore-nipple", { body: "cyl-cover", at: [NIPPLE_X, 0, 0], z0: cover.z1, ex: cover.ex + 0.5, joints: ["pO3"], name: "Grease nipple DIN 71412 M6, feeding the bore" });
  cover.holes.push(H.disc(2.5, NIPPLE_X, 0));
  A.add(nip);
  A.joint("pO3").serves.F8?.push(nip.id);

  // ---- F9: the swing engraved on the base, read off an index line on the cover's head end ----
  const sw = swing(ctx, ctx.parts["cyl-cover"]!)!;
  const R0 = BORE / 2 + 5 + 12;
  const O3: Vec2 = [D3, 0];
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O3), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O3)] });
  base.marks.push({ kind: "scale", pts: arcPts(O3[0], O3[1], R0, sw[0], sw[1], Math.PI / 90) });
  cover.marks.push({ kind: "index", pts: [[BORE / 2 + 5 - 3, 0], [BORE / 2 + 5 - 0.2, 0]] });

  H.boreChamfers(frame);
  void rod;
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pA", {
    note: `${A.joint("pA").note} Single shear is forced: the rod sweeps over the input shaft at the far end of the stroke, so no plate can go over the big end. The crank is plated up so the overhang under the rod is as short as the stack allows.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pO3", {
    note: `${A.joint("pO3").note} The stud runs in the notch of the piston on a track roller between hardened wear strips; floor and cover turn on bearings; the compression spring on the top sleeve, through a bronze thrust washer, holds the port face down on the standard.`,
  });
  A.rules.push(
    { title: "Port face on a spring", text: "A spring on the trunnion presses the cylinder block down on the port standard, so the ports seal and the block still rocks free." },
    { title: "Trunnion through the block, not through the bore", text: "The trunnion stud passes floor and cover and runs on a roller in the notched piston: the piston straddles it where the stroke crosses the trunnion line." },
    { title: "One block, screwed and dowelled", text: "Floor, frame and cover are one cylinder: four screws into the floor and two dowels, so it goes back square after a clean-out." },
    { title: "Stops outside the swing", text: "Rubber-faced stops sit just beyond the cylinder's ±17° swing, to catch it with the drive off." },
    { title: "Kinematics untouched", text: "Crank, trunnion and bore centres are the solver's; plating, bores and hardware are designed round them." },
  );
};
