// Overrides and additions to the generated star wheel assembly (standard 5.2). The model has the driver disc (below the
// star), the star wheel on a dead axle, the finger pin, the jumper (below the star, its arm passing under the teeth) and its
// roller; the rules build the driver's live shaft, the star's axle and bearing, the jumper's pivot, the base and the drive.
// What differs from the rules:
// - the finger pin pressed into the driver disc and the roller on a stud screwed into the jumper's tip, on a spacer, the
//   roller turning on the screw's shank (the rules have no pin for a Ø5.6 roller);
// - a leaf spring screwed on a post, pressing the jumper's arm toward the star (F6): the jumper's only way of holding the star
//   in its detent; drawn at the arm's highest lift, 0.5 mm clear of it;
// - an index mark on a star tooth and its line on the base, which line up at rest (F9);
// - notes, badges and build rules (A16).
import { polar, type Vec2 } from "../../core/geom";
import { toWorld } from "../../core/poly";
import { poseOf } from "../../model/pose";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { Lj, O2, rf, tau0, W } from "./model";

const TAU = Math.PI * 2;
/** Leaf spring: length from its screw to the arm, thickness, and the gap kept at the arm's highest lift. */
const LEAF = { L: 26, t: 0.8, gap: 3.6 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const model = A.m;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const driver = A.get("driver")!;
  const star = A.get("star")!;
  const jumper = A.get("jumper")!;
  const roller = A.get("roller")!;
  const part = (id: string) => model.parts.find((p) => p.id === id)!;

  // ---- the finger pin pressed into the driver disc ----
  driver.holes.push(circle1(1.5, rf, 0));
  A.set("finger", { z0: driver.z0 + 2, name: "Finger pin Ø3 h6, hardened, pressed into the driver disc and set with threadlocker", mat: "Steel, hardened and ground" });

  // ---- the roller on a screw in the jumper's tip: spacer under it, M2 button screw down its axis ----
  const G = { body: "jumper", at: [Lj, 0, 0] as [number, number, number], joints: ["pJ"] };
  A.add(H.spacer("jroller-sp", 2.1, 5, { ...G, name: "Spacer Ø5 x 2.1, bronze, under the roller", role: jumper.role, z0: jumper.z1, z1: roller.z0, ex: jumper.ex + 0.4 }));
  A.add(H.screw("jroller-s", "button", 2, roller.z1 + 1.3 - (jumper.z1 - 4), { ...G, face: roller.z1 + 1.3, dir: -1, ex: roller.ex + 0.8 }));
  A.set("roller", { name: "Jumper roller Ø5.6, hardened, turning on the screw's shank", mat: "Steel 100Cr6, hardened" });

  // ---- F6: a leaf spring on a post, pressing the jumper toward the star ----
  const jp = part("jumper");
  const pose = (u: number) => poseOf(jp, model.solve(u))!;
  // the arm's outer face: the side away from the star at rest
  const starC = W(O2);
  const rest = pose(0);
  const side = (sgn: number) => toWorld(rest, [Lj / 2, sgn * 6.5]);
  const sg = Math.hypot(side(1)[0] - starC[0], side(1)[1] - starC[1]) > Math.hypot(side(-1)[0] - starC[0], side(-1)[1] - starC[1]) ? 1 : -1;
  const nrm = (q: ReturnType<typeof pose>) => toWorld([0, 0, q[2]], [0, sg]);
  // highest lift: the arm's outer face farthest out along its rest normal
  const n0 = nrm(rest);
  let best = 0;
  let hi = -1e9;
  for (let i = 0; i < 360; i++) {
    const q = pose((i / 360) * TAU);
    const e = toWorld(q, [Lj / 2, sg * 6.5]);
    const lift = e[0] * n0[0] + e[1] * n0[1];
    if (lift > hi) {
      hi = lift;
      best = i;
    }
  }
  const qh = pose((best / 360) * TAU);
  const Q = toWorld(qh, [Lj / 2, sg * 6.5]);
  const nh = nrm(qh);
  const E: Vec2 = [Q[0] + (LEAF.gap + 0.1) * nh[0], Q[1] + (LEAF.gap + 0.1) * nh[1]];
  const dir = Math.atan2(nh[1], nh[0]) - sg * 0.6;
  const Pp: Vec2 = [E[0] + LEAF.L * Math.cos(dir), E[1] + LEAF.L * Math.sin(dir)];
  const z0 = jumper.z0 + 2.5;
  const z1 = z0 + LEAF.t;
  const sp = H.spring("jumper-spring", "leaf", { L: LEAF.L, wire: LEAF.t, body: "ground", at: [Pp[0], Pp[1], dir + Math.PI], z0, z1, ex: jumper.ex, joints: ["pJ"], name: `Leaf spring ${LEAF.L} x 6 x ${LEAF.t}, jumper` });
  A.add(sp);
  A.add(H.standoff("jumper-spring-post", { name: "Spring post Ø8", outer: H.disc(4), D: 8, role: "ground", body: "ground", at: [Pp[0], Pp[1], 0], z0: ctx.b1, z1: z0, ex: jumper.ex - 0.5, joints: ["pJ"], mat: "Steel C45, black oxide" }));
  A.add(H.screw("jumper-spring-sc", "button", 3, z1 - ctx.b1 + 4, { body: "ground", at: [Pp[0], Pp[1], 0], face: z1, dir: -1, ex: jumper.ex + 0.5, joints: ["pJ"], name: undefined }));
  (A.joint("pJ").serves.F6 ??= []).push(sp.id);

  // ---- F9: an index mark on tooth 0 of the star and its line on the base: at rest the tooth sits on the line ----
  const t0 = tau0 + Math.PI;
  star.marks.push({ kind: "timing", pts: [polar(7, tau0), polar(10.5, tau0)] });
  const base = A.get("base")!;
  base.marks.push({ kind: "timing", pts: [polar(23, t0, starC[0], starC[1]), polar(27, t0, starC[0], starC[1])] });
  (A.joint("pO2").serves.F9 ??= []).push("star", "base");
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pJ", {
    note: `${A.joint("pJ").note} The jumper's arm passes under the star's teeth to its roller, which turns on an M2 screw in the arm's tip; a leaf spring screwed on a post presses the arm toward the star, so the roller seats in a gap and holds the star in its detent, then snaps it on once the finger has pushed a tooth past the peak.`,
    badge: ["jumper sprung", "ok"],
  });
  A.rules.push(
    { title: "Finger in a gap, roller in a gap", text: "At rest the roller sits in a gap with the finger a quarter turn from the star; fit the star with the index tooth on the base line, then the driver, so the finger enters the next gap on its first turn." },
    { title: "The jumper decides the step", text: "The finger pushes a tooth only past the jumper's peak, a little over half a pitch; the leaf spring does the rest, so the star always stops in a detent, never between." },
    { title: "Jumper under the star", text: "The arm runs under the teeth, the roller stands up into the star's plane on its screw, so nothing crosses the finger's path." },
    { title: "Play on the finger", text: "The finger runs 0.3 mm clear of the flanks that do not push, so it never binds in the gap; teeth are cut with sharp roots." },
    { title: "Kinematics untouched", text: "The star's teeth, the finger circle, the jumper's length and pivot are the model's; screws, spacers, spring and marks are fitted round them." },
  );
};

function circle1(r: number, x: number, y: number): Vec2[] {
  return Array.from({ length: 24 }, (_, i): Vec2 => [x + r * Math.cos((i / 24) * TAU), y + r * Math.sin((i / 24) * TAU)]);
}
