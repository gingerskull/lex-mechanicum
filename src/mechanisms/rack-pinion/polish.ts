// Overrides and additions to the generated rack and pinion assembly (standard 5.2). The rules build the live pinion
// shaft (housing cartridge, keyed shaft, hub), the rack mesh joint, the motor and belt. The rules skip two things for a
// rack, so this polish states them:
// - the pinion is carried on both sides (A9): the straddle rule leaves out rack meshes, so the bridge over the shaft is
//   called here, on the side away from the rack;
// - the rack's guide. The J5 slide rule wants twin rails round the slider, and the pinion sits against the rack's tooth
//   side, so the guide is built here as the slide rule builds one, a few blocks: a hardened bed under the rack, rear
//   guide bars (the dowelled reference) with a bronze gib against the rack's back face clamped under a keeper by the
//   keeper's screws, a felt wiper at each end of the guide and a nipple, a front guard bar past the pinion, a backing
//   roller on an eccentric stud opposite the mesh (the backlash adjuster), an end stop at each end.
// - the drive's cable clip is moved off the motor bracket (the cabling rule places it on the longest run, here over
//   the bracket flange).
import { circle, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { straddle } from "../../rules/j2-straddle";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { K, THETA, pitch, rp } from "./model";

const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** Rack travel: the pose's x runs from xLo to xHi; the rack ends reach 8.5 pitches either side of it. */
const xLo = pitch / 2 - rp * THETA;
const xHi = pitch / 2 + rp * THETA;
const END = (K + 0.5) * pitch;
const LEFT = xLo - END;
const RIGHT = xHi + END;

/** Rack back face and tooth tip lines, world y. */
const yBack = -rp - 1.25 * 4 - 12;
const yTip = -rp + 4;
const ZR1 = 7;
/** Guide bar height: the rack's top plus 0.3 mm for the keeper to ride on. */
const ZB1 = ZR1 + 0.3;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const b1 = ctx.b1;
  const base = A.get("base")!;

  // ---- A9: the pinion shaft runs on up into a floating bearing in a bridge ----
  straddle(ctx, [ctx.pinJoint("pO")!]);

  // ---- the rack guide (J5 by hand) ----
  const S = "rack-slide";
  const serve = (k: "F1" | "F2" | "F5" | "F7" | "F8", ...ids: string[]) => ((A.joint(S).serves[k] ??= []).push(...ids));
  const G = { joints: [S], ex: 0 };
  const dowelAt = (id: string, p: Vec2, z0: number, z1: number, first: boolean, n: number, name: string, ex: number) => {
    base.holes.push(circle(1.5, p[0], p[1], 20));
    return H.dowel(id, 3, { ...G, ex, at: [p[0], p[1], 0], z0, z1, name: first ? name : "", qty: first ? n : 0 });
  };
  A.joint(S, { type: "J5", at: [0, -rp], title: "Slide · Rack", note: "", serves: {} });

  // bed: a hardened strip under the rack's body, flush with the base's top 2 mm up; screwed down and dowelled at the ends (F1, M14)
  const BED = { x0: LEFT - 2, x1: RIGHT + 1.5, y0: yBack + 0.5, y1: yBack + 10.5 };
  const bedY = (BED.y0 + BED.y1) / 2;
  const bedHoles: Vec2[][] = [circle(1.5, BED.x0 + 4, bedY, 20), circle(1.5, BED.x1 - 4, bedY, 20)];
  const bed = H.wearStrip("rack-bed", rect(BED.x0, BED.x1, BED.y0, BED.y1), { ...G, ex: -0.5, z0: b1, z1: 0, holes: bedHoles, name: "Bed strip, hardened and ground, 2 mm, screwed to the base" });
  A.add(bed);
  serve("F1", bed.id);
  const nb = 4;
  for (let k = 0; k < nb; k++) {
    const x = BED.x0 + 14 + ((BED.x1 - BED.x0 - 28) * k) / (nb - 1);
    A.add(H.screw(`rack-bed-sc${k}`, "csk", 3, 8, { ...G, ex: -0.5, at: [x, bedY, 0], face: -0.2, dir: -1, name: k ? "" : undefined, qty: k ? 0 : nb }));
  }
  A.add(dowelAt("rack-bed-dw0", [BED.x0 + 4, bedY], b1 - 6, -0.5, true, 2, "Dowel pin Ø3 x 10 h6, bed to base", -0.5), dowelAt("rack-bed-dw1", [BED.x1 - 4, bedY], b1 - 6, -0.5, false, 2, "", -0.5));

  // rear guide bars either side of the backing roller (the reference, dowelled), a gib clamped under each keeper, wipers
  const bars = [
    { id: "L", x0: LEFT - 3, x1: -17 },
    { id: "R", x0: 17, x1: RIGHT + 2 },
  ];
  const yBar0 = yBack - 13;
  const yBar1 = yBack - 3.2;
  const yGib0 = yBar1;
  const yGib1 = yBack - 0.2;
  const nip = { done: false };
  bars.forEach((b, i) => {
    const holes = [circle(1.5, b.x0 + 4, (yBar0 + yBar1) / 2, 20), circle(1.5, b.x1 - 4, (yBar0 + yBar1) / 2, 20)];
    const bar = H.plate(`rack-guide-${b.id}`, rect(b.x0, b.x1, yBar0, yBar1), { ...G, z0: b1, z1: ZB1, holes, mat: "Steel C45, ground and blackened", name: "Rear guide bar, ground steel, screwed and dowelled", qty: i ? 0 : 2 });
    if (i) bar.name = "";
    A.add(bar);
    serve("F1", bar.id);
    A.add(dowelAt(`rack-guide-${b.id}-dw0`, [b.x0 + 4, (yBar0 + yBar1) / 2], b1 - 6, b1 + 4, !i, 4, "Dowel pin Ø3 x 10 h6, guide to base", 0), dowelAt(`rack-guide-${b.id}-dw1`, [b.x1 - 4, (yBar0 + yBar1) / 2], b1 - 6, b1 + 4, false, 4, "", 0));
    // gib strip against the rack's back face, up to the keeper, so the keeper's screws clamp it once it is set (F7, M14);
    // shortened at the guide's outer end to leave room for the wiper
    const gx0 = i ? b.x0 + 1.5 : b.x0 + 8;
    const gx1 = i ? b.x1 - 8 : b.x1 - 1.5;
    const gib = H.gib(`rack-gib-${b.id}`, gx1 - gx0, { ...G, z0: b1, z1: ZB1, outer: rect(gx0, gx1, yGib0, yGib1), name: i ? "" : "Gib strip 3 x 9, bronze, against the rack's back face, clamped under the keeper", qty: i ? 0 : 2 });
    A.add(gib);
    serve("F7", gib.id);
    // keeper over the gib and the rack's back edge, screwed down through the bar into the base (F2)
    const kp = H.plate(`rack-keeper-${b.id}`, rect(b.x0 + 1, b.x1 - 1, yBar0, yBack + 2), { ...G, ex: 1, z0: ZB1, z1: ZB1 + 2.5, mat: "Steel, ground", name: i ? "" : "Keeper plate, holds the rack down", qty: i ? 0 : 2 });
    A.add(kp);
    serve("F2", kp.id);
    for (const [k, f] of [0.15, 0.85].entries())
      A.add(H.screw(`rack-keeper-${b.id}-sc${k}`, "csk", 4, kp.z1 - b1 + 5, { ...G, ex: 1, at: [b.x0 + 1 + (b.x1 - b.x0 - 2) * f, (yBar0 + yBar1) / 2, 0], face: kp.z1, dir: -1, name: i + k ? "" : undefined, qty: i + k ? 0 : 4 }));
    // a felt wiper at the guide's outer end, riding on the rack's back face (F8)
    {
      const x0 = i ? b.x1 - 5.5 : b.x0 + 1.5;
      const w = H.wiper(`rack-wiper-${b.id}`, rect(x0, x0 + 4, yGib0, yGib1), { ...G, z0: b1 + 2, z1: ZR1 - 1, name: i ? "" : undefined, qty: i ? 0 : 2 });
      A.add(w);
      serve("F8", w.id);
    }
    // grease nipple on the right keeper, mid-length, between the screws (F8)
    if (!nip.done && i === 1) {
      const n = H.nipple("rack-nipple", { ...G, ex: 1, at: [b.x0 + (b.x1 - b.x0) * 0.25, yBar1 + 1.5, 0], z0: kp.z1 });
      A.add(n);
      serve("F8", n.id);
      nip.done = true;
    }
  });

  // front guard bars beyond the pinion, 0.5 mm clear of the tooth tips: the rack cannot drift toward the pinion. Not a
  // bearing face, so screwed only
  const fronts = [
    { id: "L", x0: LEFT - 3, x1: -38 },
    { id: "R", x0: 38, x1: RIGHT + 2 },
  ];
  fronts.forEach((f, i) => {
    const y0 = yTip + 0.5;
    const y1 = yTip + 9.5;
    const yc = (y0 + y1) / 2;
    const bar = H.plate(`rack-front-${f.id}`, rect(f.x0, f.x1, y0, y1), { ...G, z0: b1, z1: ZB1, mat: "Steel C45, ground and blackened", name: i ? "" : "Front guard bar, ground steel, screwed", qty: i ? 0 : 2 });
    A.add(bar);
    for (let k = 0; k < 2; k++) A.add(H.screw(`rack-front-${f.id}-sc${k}`, "button", 4, ZB1 - b1 + 6, { ...G, at: [f.x0 + 10 + (f.x1 - f.x0 - 20) * k, yc, 0], face: ZB1, dir: -1, name: i + k ? "" : undefined, qty: i + k ? 0 : 4 }));
  });

  // end stops 1.5 mm past the rack's ends at the ends of its travel: a hardened block with a neoprene pad (F5)
  [[LEFT, -1], [RIGHT, 1]].forEach(([end, dir], k) => {
    const x = end! + dir! * 1.5;
    const y0 = yBack + 1;
    const y1 = yBack + 11;
    const pad = rect(Math.min(x, x + dir! * 2), Math.max(x, x + dir! * 2), y0, y1);
    const blk = rect(Math.min(x + dir! * 2, x + dir! * 10), Math.max(x + dir! * 2, x + dir! * 10), y0, y1);
    const s = H.stop(`rack-stop${k}`, blk, { ...G, z0: b1, z1: ZR1 - 1, name: k ? "" : "End stop block, hardened", qty: k ? 0 : 2 });
    const bp = H.bumper(`rack-bump${k}`, 0, 0, { ...G, outer: pad, z0: b1 + 1, z1: ZR1 - 1.5, name: k ? "" : "Stop pad, neoprene 2 mm", qty: k ? 0 : 2 });
    A.add(s, bp);
    serve("F5", s.id, bp.id);
    A.add(H.screw(`rack-stop${k}-sc`, "button", 4, ZR1 - 1 - b1 + 6, { ...G, at: [x + dir! * 6, (y0 + y1) / 2, 0], face: ZR1 - 1, dir: -1, name: k ? "" : undefined, qty: k ? 0 : 2 }));
  });

  // ---- the backing roller opposite the mesh (J4, F7): on a stud in an eccentric flange, turned to set the backlash ----
  const Y = "rack-yoke";
  const yc = yBack - 6.6;
  const Yg = { joints: [Y], ex: 0 };
  A.joint(Y, { type: "J4", at: [0, yc], title: "Backing roller · opposite the mesh", note: "", serves: {} });
  const ecc = H.eccentric("rack-yoke-ecc", 4, 8, 0.5, { ...Yg, at: [0, yc, 0], z0: b1, z1: b1 + 1.5, slots: [Math.PI, 0] });
  ecc.name = "Eccentric flange Ø18, 0.5 mm offset bore Ø4, arc slots, index line";
  const sp0 = H.spacer("rack-yoke-sp0", 4.2, 6, { ...Yg, at: [0, yc, 0], z0: b1 + 1.5, z1: b1 + 2.2, name: "Inner-race spacer 4.2x6" });
  const rl = H.roller("rack-yoke-roller", 4, 13, { ...Yg, at: [0, yc, 0], z0: b1 + 2.2, z1: b1 + 7.2, name: "Track roller 624 (4x13x5) on Ø4 stud, sealed, rolls on the rack's back face" });
  const sp1 = H.spacer("rack-yoke-sp1", 4.2, 6, { ...Yg, at: [0, yc, 0], z0: b1 + 7.2, z1: b1 + 7.9, name: "" });
  A.add(ecc, sp0, rl, sp1);
  A.add(H.screw("rack-yoke-stud", "socket", 4, 14, { ...Yg, at: [0, yc, 0], face: b1 + 7.9, dir: -1, name: "Stud screw M4, socket head, into the base" }));
  A.joint(Y).serves.F7 = [ecc.id];
  A.joint(Y).serves.F2 = [sp1.id];
  A.joint(Y).serves.F4 = [sp0.id];

  // ---- the cable clip off the bracket flange ----
  const lead = A.get("drive-lead0");
  const clip = A.get("drive-clip");
  if (lead && clip) {
    const near = lead.outer.filter((p) => Math.abs(p[1] - 33) < 1.5);
    const cx = near.reduce((s, p) => s + p[0], 0) / (near.length || 1);
    A.drop(/^drive-clip(-sc)?(-sh)?$/);
    A.add(H.cableClip("drive-clip", { ...clip, at: [cx, 33, Math.PI] }));
    A.add(H.screw("drive-clip-sc", "button", 3, 6, { joints: ["drive"], ex: -2, at: [cx, 33, 0], face: ctx.b0 - 3.2, dir: 1, name: "Button head M3 x 6, cable clip" }));
  }

  // ---- A16 ----
  A.joint(S, {
    note: "Rack on a hardened bed strip, held down by a keeper over its back edge on each rear guide bar, kept off the pinion by a front guard bar past it. The rear bars are the dowelled reference; a bronze gib between them and the rack's back face is set to take out the play, then clamped by the keeper, whose two screws go down through keeper and bar into the base. A felt wiper at each end of the guide, a grease nipple on the right keeper, rubber stops just past each end of the travel. The bed and gibs are the replaceable wear parts. The J5 slide rule needs rails round the slider and the pinion sits on the tooth side, so the guide is built by hand, from the rule's parts and in its layout.",
    badge: ["guided both sides", "ok"],
  });
  A.joint(Y, {
    note: "Track roller 624 (Ø13) on an M4 stud, behind the rack opposite the mesh: it takes the force that pushes rack and pinion apart (F tan 20°) and sets the backlash. The stud sits in an eccentric flange with arc slots, turned to bring the roller to the rack's back face and then clamped. Roller between inner-race spacers, stud screwed into the base.",
    badge: ["backlash set here", "ok"],
  });
  A.joint("pO", { note: `${A.joint("pO").note} The rack mesh sits beside the shaft, so the straddle rule leaves it out: the polish calls it. The shaft runs on up into a floating bearing in a bridge on the side away from the rack. The drive reverses the pinion over its ±150°; the stops are the rack's.` });
  A.rules.push(
    { title: "Carried on both sides", text: "The pinion shaft runs from its housing below to a floating bearing in a bridge above: no overhung pinion. The bridge stands on the side away from the rack." },
    { title: "Guided, held down, adjustable", text: "Rack on a hardened bed, keepers over its back edge clamping a bronze gib against it, a front guard 0.5 mm clear of the tooth tips, felt wipers and a nipple." },
    { title: "Backlash at the roller", text: "A roller on an eccentric stud behind the rack opposite the mesh carries the separating force and sets the backlash; turn it, then clamp." },
    { title: "Stopped on rubber", text: "Hard stops with neoprene pads 1.5 mm past each rack end at the ends of the ±83.8 mm travel, so a drive that runs on lands on rubber." },
    { title: "Kinematics untouched", text: "Tooth profiles, the pitch line at y = -32 and the half-pitch phasing are the model's; bed, guides, roller and stops are designed round them." },
  );

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;
};
