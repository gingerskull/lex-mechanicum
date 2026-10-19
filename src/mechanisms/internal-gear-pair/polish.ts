// Overrides and additions to the generated internal gear pair assembly (standard 5.2). The rules give the pinion a live
// shaft straddle mounted in a bridge, each carrier roller a dead axle under a bridge, the mesh its hub, eccentric and
// marks, and the drive. What differs from the rules:
// - the ring has no hub, so each carrier roller gets a flange under the ring and a retaining ring over it, three
//   countersunk screws holding the upper one: the ring is seated and captured by its three rollers (F2, F4);
// - four tapped holes on the ring's rim take the load (the output);
// - notes, badges and build rules (A16).
import { circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { ROLLER_ANGLES, ROLLER_R, RIM } from "./model";

/** Output: tapped holes on the ring rim, thread and pitch circle radius. */
const OUT = { n: 4, M: 2.5, R: RIM - 4 };
/** Roller flange: radius, thickness under the ring, retaining ring thickness over it, screws on their circle. */
const FL = { R: ROLLER_R + 3, t: 1.5, top: 0.9, screws: 3, M: 2.5, pcd: 11 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const ring = A.get("ring")!;

  // ---- F2, F4: each roller is flanged under the ring and captured over it ----
  ROLLER_ANGLES.forEach((_, k) => {
    const id = `pR${k}`;
    const roller = A.get(`roller${k}`)!;
    const G = { body: `roller${k}`, at: [0, 0, 0] as [number, number, number], joints: [id], role: roller.role, mat: "Steel C45, case hardened" };
    const bore = 8; // the roller bearing F688 is Ø16
    A.add(
      H.plate(`${id}-flange`, H.disc(FL.R), {
        ...G,
        name: `Roller flange Ø${2 * FL.R}, ${FL.t} mm, under the ring`,
        holes: [H.disc(bore)],
        z0: roller.z0 - FL.t,
        z1: roller.z0,
        ex: roller.ex,
        kind: "retainerPlate",
      }),
      H.plate(`${id}-cap`, H.disc(FL.R), {
        ...G,
        name: `Roller retaining ring Ø${2 * FL.R}, ${FL.top} mm, over the ring`,
        holes: [H.disc(bore + 0.6)],
        z0: ring.z1,
        z1: ring.z1 + FL.top,
        ex: roller.ex,
        kind: "retainerPlate",
      }),
    );
    for (let i = 0; i < FL.screws; i++) {
      const [x, y] = polar(FL.pcd, (i * 2 * Math.PI) / FL.screws + Math.PI / 6) as Vec2;
      A.add(H.screw(`${id}-cap-s${i}`, "csk", FL.M, ring.z1 + FL.top - roller.z0, { ...G, at: [x, y, 0], face: ring.z1 + FL.top, dir: -1, ex: roller.ex }));
    }
  });

  // ---- the output: four tapped holes on the ring's rim ----
  for (const [x, y] of H.boltCircle(OUT.n, OUT.R, Math.PI / 4)) ring.marks.push({ kind: "thread", pts: circle(OUT.M / 2 + 0.4, x, y, 20) });
  ring.name = `Ring gear, 40 teeth, ${OUT.n} x M${OUT.M} tapped in the rim for the load`;
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  for (let k = 0; k < ROLLER_ANGLES.length; k++) {
    const j = A.joint(`pR${k}`);
    j.note = `${j.note} The roller runs on the ring's outer face (Ø${2 * RIM}); a ${FL.t} mm flange under the ring carries it and a ${FL.top} mm retaining ring over it, held by ${FL.screws} countersunk M${FL.M}, captures it axially.`;
    j.badge = ["ring carried and captured", "ok"];
  }
  A.rules.push(
    { title: "The ring has no centre", text: "A ring gear has no hub to put a shaft through, so it is carried on its rim by three rollers on dead axles, 120° apart; nothing crosses the mesh." },
    { title: "Rollers first, ring in from above", text: "Fit the flanges and rollers on their axles, lay the ring on the three flanges, then screw the retaining rings on over it." },
    { title: "Backlash at the pinion", text: "The pinion shaft sits on an eccentric bushing under its housing and in its bridge: turn both to set the backlash, clamp, and the rollers keep the ring where it is." },
    { title: "Mark to go back in phase", text: "Match marks on the pinion tooth and the ring gap that meet on the line of centres." },
    { title: "Kinematics untouched", text: "Tooth profiles, pitch circles, the centre distance and the ring rim are the model's; flanges, screws and marks are fitted round them." },
  );
};
