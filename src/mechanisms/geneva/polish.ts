// Overrides and additions to the generated Geneva assembly (standard 5.2). What differs from the rules:
// - the roller stud: the slots open at the rim, so the rules see no slot; the stud is built here as J4 for the clevis
//   arm, a track roller between the arm plates, hardened wear strips on every slot wall, a felt oiler in every slot end;
// - the front arm plate turns with the rear one: a plain hole on the stud's shoulder, then it rides the rear plate's body;
// - a replaceable hardened locking segment on the disc (M14), a drag pack on the wheel (F6), lobe windows in the wheel
//   (M2), station marks (F9), tapered arms (D1);
// - notes, badges and build rules (A16).
import { TAU, arcPts, bbox, circle, polar, roundedPoly, type Vec2 } from "../../core/geom";
import { edgeDist, inside } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { materials } from "../../rules/materials";
import { locking } from "../../rules/locking";
import { boltName, raceD, shoulderBolt, stackSpacers, tappedMark, type Element } from "../../rules/pins";
import { FLANGE, SHOULDER_BOLTS, circlipInt } from "../../hardware/tables";
import { a, c, depth, hw, n, rl, Rw, step, wheelOutline } from "./model";

/** Wear strip thickness; the slot is relieved by as much behind it, so the strip faces are the modelled walls. */
const STRIP = 1.5;
/** Locking segment depth, radial: hardened ring sector whose outside is the modelled locking arc. */
const SEG = 4;
/** Web left round every working surface and seat by the lobe windows (M2): stiff enough at 6 mm thick. */
const WEB = 8;
/** Share of the wheel's area the windows take out (M2). */
const LIGHTEN = 0.3;
/** Arm boss radii (D1): round the keyed Ø8 input, round the Ø6 roller stud. */
const ARM_R: [number, number] = [12, 8];

const near = (h: Vec2[], p: Vec2, tol = 0.5) => {
  const [x0, y0, x1, y1] = bbox(h);
  return Math.hypot((x0 + x1) / 2 - p[0], (y0 + y1) / 2 - p[1]) < tol;
};
const rot = (p: Vec2, t: number): Vec2 => [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const pR = ctx.pinJoint("pR")!;
  const wheel = A.get("wheel")!;
  const disc = A.get("disc")!;
  const rear = A.get("armRear")!;
  const front = A.get("arm")!;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- D1: tapered arms ----
  for (const s of [rear, front]) {
    s.outer = H.taper(a, ...ARM_R);
    s.marks = s.marks.filter((m) => m.kind !== "boss").concat({ kind: "boss", pts: H.disc(ARM_R[0] - 1.6) }, { kind: "boss", pts: H.disc(ARM_R[1] - 1.6, a, 0) });
  }

  // ---- the roller stud (J4): shoulder bolt threaded into the rear plate, roller in the wheel plane, head on the front ----
  A.drop((s) => s.id.startsWith("pR-"));
  for (const s of [rear, front]) {
    s.holes = s.holes.filter((h) => !near(h, [a, 0]));
    s.marks = s.marks.filter((m) => !(m.kind === "thread" && near(m.pts, [a, 0])) && !(m.kind === "boreEntry" && near(m.pts, [a, 0], 2)));
  }
  const J = A.joint("pR");
  J.type = "J4";
  J.serves = {};
  const d = pR.d;
  const M = SHOULDER_BOLTS[d]!.M;
  const at = pR.at;
  const D = 2 * hw - 0.3;
  const roller = H.roller("pR-roller", d, D, { body: "armRear", at, z0: wheel.z0 + 0.3, z1: wheel.z1 - 0.3, ex: wheel.ex, joints: ["pR"], group: "pR-bolt" });
  A.add(roller);
  const els: Element[] = [
    { z0: rear.z0, z1: rear.z1, ex: rear.ex, over: rear.z1, label: "" },
    { z0: roller.z0, z1: roller.z1, ex: wheel.ex, over: roller.z1, label: "" },
    { z0: front.z0, z1: front.z1, ex: front.ex, over: front.z1, label: "" },
  ];
  stackSpacers(ctx, pR, els, "armRear", at, false);
  rear.holes.push(H.disc(M / 2, a, 0));
  rear.marks.push(tappedMark(M, a, 0));
  front.holes.push(H.disc(d / 2 + 0.1, a, 0));
  const zt = front.z1 + 0.6;
  A.add(H.spacer("pR-top", d + 0.2, raceD(ctx, pR, d + 3.2), { name: "Washer under the head", body: "armRear", at, z0: front.z1, z1: zt, ex: front.ex, joints: ["pR"] }));
  shoulderBolt(ctx, pR, { id: "pR-bolt", body: "armRear", at, z0: rear.z1, z1: zt, thread: [rear.z0, rear.z1], name: `${boltName(d, zt - rear.z1)}, roller stud`, ex: front.ex + 1 });
  J.serves.F2 = ["pR-bolt-head"];

  // ---- wear strips on every slot wall (M14), the slots relieved behind them; a felt oiler in every slot end (F8) ----
  wheel.outer = wheelOutline(hw + STRIP);
  const mouth = Math.sqrt(Rw * Rw - (hw + STRIP) ** 2);
  for (let k = 0; k < n; k++) {
    const th = k * step;
    for (const side of [1, -1]) {
      const i = 2 * k + (side > 0 ? 0 : 1);
      const y0 = side * hw;
      const y1 = side * (hw + STRIP);
      const rect: Vec2[] = [[depth, y0], [mouth, y0], [mouth, y1], [depth, y1]].map((p) => rot(p as Vec2, th));
      A.add(H.wearStrip(`pR-ws${i}`, rect, { name: i ? "" : `Wear strip ${(mouth - depth).toFixed(1)} x ${STRIP}, hardened, 2 x M2 csk`, qty: i ? 0 : 2 * n, body: "wheel", z0: wheel.z0, z1: wheel.z1, ex: wheel.ex, joints: ["pR"] }));
      for (const [s, f] of [[0, 0.2], [1, 0.8]] as const) {
        const p = rot([depth + (mouth - depth) * f, side * (hw + STRIP + 0.7)], th);
        A.add(H.screw(`pR-ws${i}-sc${s}`, "csk", 2, 5, { body: "wheel", at: [p[0], p[1], 0], face: wheel.z1, dir: -1, ex: wheel.ex, joints: ["pR"], name: i || s ? "" : undefined, qty: i || s ? 0 : 4 * n }));
      }
    }
    // the felt fills the relieved slot end and brushes the roller at the deepest point of each index
    const reach = c - a - D / 2 + 0.25;
    const rEnd = hw + STRIP - 0.1;
    const t0 = Math.acos(Math.min(1, (reach - depth) / rEnd));
    const felt = arcPts(depth, 0, rEnd, t0, TAU - t0).map((p) => rot(p, th));
    A.add(H.felt(`pR-felt${k}`, felt, { name: k ? "" : "Felt oiler in the slot end, oil-soaked wool felt", qty: k ? 0 : n, body: "wheel", z0: wheel.z0 + 1, z1: wheel.z1 - 1, ex: wheel.ex, joints: ["pR"], allow: ["pR-roller"] }));
  }
  J.serves.F8 = Array.from({ length: n }, (_, k) => `pR-felt${k}`);

  // ---- M14: the locking arc is a replaceable hardened segment, held by countersunk screws on the joint line ----
  const back = disc.outer.filter(([x, y]) => Math.abs(Math.hypot(x, y) - rl) < 0.05);
  const angs = back.map(([x, y]) => (Math.atan2(y, x) + TAU) % TAU).sort((p, q) => p - q);
  const s0 = angs[0]! + 0.12;
  const s1 = angs[angs.length - 1]! - 0.12;
  const relief = disc.outer.filter(([x, y]) => Math.abs(Math.hypot(x, y) - rl) >= 0.05);
  disc.outer = [...arcPts(0, 0, rl, angs[0]!, s0, 0.05), ...arcPts(0, 0, rl - SEG, s0, s1), ...arcPts(0, 0, rl, s1, angs[angs.length - 1]!, 0.05), ...relief];
  A.add(H.wearStrip("disc-seg", [...arcPts(0, 0, rl, s0, s1), ...arcPts(0, 0, rl - SEG, s1, s0)], { name: "Locking segment, hardened, 4 x M3 csk", body: "disc", z0: disc.z0, z1: disc.z1, ex: disc.ex, joints: ["pD"], role: "driver" }));
  for (let i = 0; i < 4; i++) {
    const p = polar(rl - SEG, s0 + ((s1 - s0) * (i + 0.5)) / 4);
    A.add(H.screw(`disc-seg-sc${i}`, "csk", 3, 6, { body: "disc", at: [p[0], p[1], 0], face: disc.z1, dir: -1, ex: disc.ex, joints: ["pD"], name: i ? "" : undefined, qty: i ? 0 : 4 }));
  }

  // ---- F6: drag pack. The locking arcs run with 1.5 mm clearance, so the locked wheel could rattle: a bronze disc on
  // the outer ring's flange, a wave washer under the bridge, a light drag that holds it ----
  const brg = A.get("pW-wheel-brg")!;
  const fl = A.get("pW-wheel-brg-fl");
  const top = (fl ?? brg).z1;
  const bridge = A.get("pW-bridge")!;
  const dIn = circlipInt(brg.D!).d2 - 2 * circlipInt(brg.D!).b + 1;
  const dOut = fl ? FLANGE({ d: brg.d!, D: brg.D!, B: brg.z1 - brg.z0, name: "" }).D : brg.D!;
  const W: [number, number, number] = [c, 0, 0];
  const gap = bridge.z0 - top;
  A.add(H.thrustWasher("pW-drag-disc", dIn, dOut, { name: `Drag pack: bronze friction disc ${dIn.toFixed(1)}x${dOut.toFixed(1)}, on the outer ring flange`, at: W, z0: top, z1: top + gap * 0.55, ex: bridge.ex - 0.5, joints: ["pW"] }));
  A.add(H.waveWasher("pW-drag-ww", dIn, dOut, { name: "Drag pack: wave washer, preloaded by the bridge", at: W, z0: top + gap * 0.55, z1: bridge.z0, ex: bridge.ex - 0.5, joints: ["pW"] }));
  A.joint("pW").serves.F6 = ["pW-drag-disc", "pW-drag-ww"];

  // ---- M2: lobe windows, WEB mm from every working surface and from the bearing seat ----
  const seatR = (brg.D! / 2) + 0.15;
  const ok = (pts: Vec2[]) => pts.every((p) => inside(wheel.outer, p) && edgeDist(wheel.outer, p) >= WEB - 0.01 && Math.hypot(...p) >= seatR + WEB);
  let best: Vec2[] | null = null;
  let area = 0;
  // about a third of the wheel's mass, the inertia that the roller has to start and stop each index
  const polyArea = (P: Vec2[]) => Math.abs(P.reduce((s2, p, i) => s2 + p[0] * P[(i + 1) % P.length]![1] - P[(i + 1) % P.length]![0] * p[1], 0) / 2);
  const maxWindow = (polyArea(wheel.outer) * LIGHTEN) / n;
  for (let k = 0; k < n; k++) {
    const mid = k * step + step / 2;
    if (k === 0) {
      for (let r0 = seatR + WEB + 3; r0 < 40; r0 += 2)
        for (let r1 = r0 + 8; r1 < Rw; r1 += 2)
          for (let dl = 0.1; dl < step / 2; dl += 0.06) {
            const v: Vec2[] = [polar(r0, mid), polar(r1, mid - dl), polar(r1, mid + dl)];
            const w = H.window(v, 3);
            if (!ok(w)) continue;
            const ar = polyArea(w);
            if (ar > area && ar <= maxWindow) {
              area = ar;
              best = v.map((p) => rot(p, -mid));
            }
          }
    }
    if (best) wheel.holes.push(H.window(best.map((p) => rot(p, mid)), 3));
  }

  // ---- F9: station marks. Dots 1 to 4 at each locking arc, an index line on the base: with the disc in a locking
  // arc, the wheel goes back on the station it came off ----
  for (let k = 0; k < n; k++) {
    const mid = k * step + step / 2;
    // just inside the locking arc, in the web the window leaves
    for (let i = 0; i <= k; i++) wheel.marks.push({ kind: "timing", pts: circle(0.8, ...polar(c - rl - 1.5 - 4, mid + (i - k / 2) * 0.06), 10) });
  }
  // during the dwell a locking arc faces the disc, so the opposite one points along +x from the wheel centre
  A.get("base")!.marks.push({ kind: "timing", pts: [[c + Rw + 3, 0], [c + Rw + 7, 0]] });

  // ---- the front plate rides the rear plate's body: one rigid arm ----
  for (const s of A.solids) if (s.body === "arm") s.body = "armRear";
  H.boreChamfers(front);
  H.boreChamfers(wheel);
  locking.apply(ctx);
  materials.apply(ctx);
  for (const s of [wheel, disc]) s.mat = "Aluminium 6061-T6, hard anodised";
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  A.joint("pD", { note: `${A.joint("pD").note} The two arm plates and the locking disc are one keyed stack between spacers; the stud ties the plates at the roller end.` });
  J.note = `Track roller Ø${D.toFixed(1)} on a Ø${d} shoulder bolt between the two arm plates: the clevis puts the stud in double shear. The bolt threads M${M} into the rear plate; the shoulder passes a plain hole in the front plate under the head. The roller runs on hardened wear strips screwed to every slot wall; a felt in each slot end oils it at the deepest point of each index.`;
  J.badge = ["double shear", "ok"];
  A.joint("pW", { note: `${A.joint("pW").note} A drag pack (bronze disc on the outer ring flange, wave washer under the bridge) holds the wheel in its 1.5 mm locking clearance so it cannot rattle while locked.` });
  A.rules.push(
    { title: "Disc and wheel share one plane", text: "The locking disc and the wheel work in the same plane; the arm plates sit one layer above and below, so the roller stud is held at both ends." },
    { title: "Hard where it wears", text: "The roller runs on screwed, hardened wear strips and the locking arc is a screwed, hardened segment: both are replaced, the aluminium wheel and disc are not." },
    { title: "Locked, but not loose", text: "The locking arcs run with 1.5 mm clearance; a drag pack on the wheel takes up the play so the wheel stays put through the dwell." },
    { title: "Back on the right station", text: "Station dots on the wheel and an index line on the base: rebuild with the disc in a locking arc and the dot count matching." },
    { title: "Kinematics untouched", text: "Slot walls, locking arcs and the relief are the model's; strips, segment and windows are cut around them." },
  );
};
