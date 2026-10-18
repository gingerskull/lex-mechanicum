// Overrides and additions to the generated Geneva assembly (standard 5.2). The clevis arm (the front plate a twin of
// the rear one) and the tapered arms are the model's; the rules find the open slots over the cycle and build the
// roller stud, the wear strips on every slot wall and the felt in every slot end. What differs from the rules:
// - a replaceable hardened locking segment on the disc (M14), a drag pack on the wheel (F6);
// - lobe windows in the wheel (M2), station marks (F9);
// - notes, badges and build rules (A16).
import { circle, polar, type Vec2 } from "../../core/geom";
import { edgeDist, inside } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { materials } from "../../rules/materials";
import { locking } from "../../rules/locking";
import { FLANGE, SHOULDER_BOLTS, circlipInt } from "../../hardware/tables";
import { c, hw, n, rl, Rw, step } from "./model";

/** Locking segment depth, radial: hardened ring sector whose outside is the modelled locking arc. */
const SEG = 4;
/** Web left round every working surface and seat by the lobe windows (M2): stiff enough at 6 mm thick. */
const WEB = 8;
/** Share of the wheel's area the windows take out (M2). */
const LIGHTEN = 0.3;

const rot = (p: Vec2, t: number): Vec2 => [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const pR = ctx.pinJoint("pR")!;
  const wheel = A.get("wheel")!;
  const disc = A.get("disc")!;
  const rule = ctx.rule;
  ctx.rule = "polish";

  const J = A.joint("pR");
  const d = pR.d;
  const M = SHOULDER_BOLTS[d]!.M;
  const D = 2 * hw - 0.3;

  // ---- M14: the locking arc is a replaceable hardened segment, held by countersunk screws on the joint line ----
  H.lockingSegment(A, disc, { r: rl, depth: SEG, joint: "pD" });

  // ---- F6: drag pack. The locking arcs run with 1.5 mm clearance, so the locked wheel could rattle: a bronze disc on
  // the outer ring's flange, a wave washer under the bridge, a light drag that holds it ----
  const brg = A.get("pW-wheel-brg")!;
  const fl = A.get("pW-wheel-brg-fl");
  const bridge = A.get("pW-bridge")!;
  const clip = circlipInt(brg.D!);
  const dOut = fl ? FLANGE({ d: brg.d!, D: brg.D!, B: brg.z1 - brg.z0, name: "" }).D : brg.D!;
  H.dragPack(A, "pW", { at: [c, 0], d: clip.d2 - 2 * clip.b + 1, D: dOut, z0: (fl ?? brg).z1, z1: bridge.z0, ex: bridge.ex - 0.5, on: "the outer ring flange", by: "the bridge" });

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
