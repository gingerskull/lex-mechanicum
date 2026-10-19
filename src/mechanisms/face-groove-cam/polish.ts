// Overrides and additions to the generated face groove cam assembly (standard 5.2). The model has the base disc keyed to the shaft,
// the hardened ring and island that make the groove, the follower and its rails; the rules build the live shaft, the slide on its
// risers, the base and the drive. A form-closed cam needs no spring, and the model declares no J7 contact (no follower train). What
// differs from the rules:
// - the ring (outer wall) and the island (inner wall) screwed down onto the base disc: they are the groove's replaceable hardened walls
//   (M14), with a keyed island that rides the shaft only through the screws;
// - the roller: a bought Ø10 track roller in the groove on a stud screwed into the follower's arm, on a spacer, the follower
//   carrying the roller in the groove from above (F2);
// - the shaft straddle mounted: nothing sweeps over the cam's axis, so a bridge over it (A9);
// - a zero line on the cam and its index on the base (F9);
// - notes, badges and build rules (A16).
import { circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { straddle } from "../../rules/j2-straddle";
import { R, rollerD, stem } from "./model";

const TAU = Math.PI * 2;
const RING_SCREWS = { n: 6, M: 3, R: R - 5 };
const ISLAND_SCREWS = { n: 3, M: 3, R: 21 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const base = A.get("camBase")!;
  const ring = A.get("camRing")!;
  const island = A.get("camIsland")!;
  const follower = A.get("follower")!;

  // ---- M14: the ring and the island screwed down onto the base disc, hardened ----
  const screws = (id: string, host: typeof ring, n: number, M: number, Rr: number, a0: number, name: string) => {
    for (let i = 0; i < n; i++) {
      const [x, y] = polar(Rr, (i * TAU) / n + a0) as Vec2;
      host.holes.push(circle(M / 2 + 0.3, x, y, 20));
      base.marks.push({ kind: "thread", pts: circle(M / 2 - 0.2, x, y, 16) });
      A.add(
        H.screw(`${id}-s${i}`, "button", M, host.z1 - base.z1 + 6, { body: "camBase", at: [x, y, 0], joints: ["pO"], face: host.z1, dir: -1, ex: host.ex + 0.4, name: i ? "" : name }),
      );
    }
  };
  screws("ring", ring, RING_SCREWS.n, RING_SCREWS.M, RING_SCREWS.R, Math.PI / 6, `Button head M${RING_SCREWS.M}, ring plate to base disc, ${RING_SCREWS.n} off`);
  screws("island", island, ISLAND_SCREWS.n, ISLAND_SCREWS.M, ISLAND_SCREWS.R, Math.PI / 6, `Button head M${ISLAND_SCREWS.M}, island to base disc, ${ISLAND_SCREWS.n} off`);
  for (const id of ["camRing", "camIsland"]) A.set(id, { mat: "Tool steel O1, hardened 58 HRC", name: A.get(id)!.name });

  // ---- the roller in the groove: a track roller on a stud in the follower's arm, on a spacer ----
  const zr0 = ring.z0;
  const zr1 = ring.z1;
  const G = { body: "follower", at: [-stem, 0, 0] as [number, number, number], joints: ["slide-follower"] };
  A.add(H.roller("groove-roller", 4, rollerD - 0.3, { ...G, name: `Track roller Ø${rollerD - 0.3} on Ø4 stud, in the groove`, role: "bearing", z0: zr0, z1: zr1, ex: follower.ex - 1 }));
  A.add(H.tube("groove-roller-sp", 4.2, 8, { ...G, name: "Spacer sleeve Ø8 x 4, bronze", role: follower.role, z0: zr1, z1: follower.z0, ex: follower.ex - 0.5, mat: "Bronze" }));
  A.add(H.screw("groove-roller-s", "button", 4, follower.z1 - zr0 - 2, { ...G, face: follower.z1, dir: -1, ex: follower.ex + 1 }));

  // ---- A9: the shaft straddle mounted, a bridge over the cam's axis (nothing sweeps over it) ----
  straddle(ctx, [ctx.pinJoint("pO")!]);

  // ---- F9: a zero line on the base disc and its index on the base ----
  base.marks.push({ kind: "timing", pts: [polar(R - 14, 0), polar(R - 8, 0)] });
  A.get("base")!.marks.push({ kind: "timing", pts: [polar(R + 3, 0), polar(R + 8, 0)] });
  (A.joint("pO").serves.F9 ??= []).push("camBase", "base");
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pO", {
    note: `${A.joint("pO").note} The base disc is keyed to the shaft; the ring and the island are screwed down onto it, and the groove is the gap between them: the roller runs in it, form-closed, so no spring is needed.`,
  });
  A.rules.push(
    { title: "A groove cut in two", text: "A groove in a face is blind: the walls are a ring and an island, hardened and screwed to the base disc, so the groove is the gap between them and a worn wall is replaced, not the disc." },
    { title: "Form-closed, no spring", text: "The roller is 0.1 mm smaller than the groove's width on each side: it touches the outer wall when pushed out and the inner wall when pulled in, so the follower follows the cam without a spring." },
    { title: "Roller from above", text: "The follower's arm runs over the cam and carries the roller down into the groove on a stud and a spacer; the carriage slides on its rails outside the disc." },
    { title: "Timed to go back", text: "A zero line on the disc and an index on the base: fit the disc with the line on the index and the follower at the bottom of its stroke." },
    { title: "Kinematics untouched", text: "The groove's pitch curve and walls are the model's; screws, spacer, bridge and marks are cut round it." },
  );
};
