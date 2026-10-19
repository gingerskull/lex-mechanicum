// Overrides and additions to the generated Ravigneaux assembly (standard 5.2). The rules give the small sun a live shaft
// with its housing, key and hub, the large sun a bearing on that shaft, every planet pin a dead axle under a bridge on
// spigoted posts, each long pinion a bearing in each half, every mesh its marks, and the drive. The carrier is held (first
// gear), so there is no carrier part: the six pinion axles stand in the base. What differs from the rules:
// - the long pinion is one gear in two halves: a hub sleeve between them and three screws through the upper half into the
//   lower one make them turn as one, on their two bearings (the catalogue's "twice the face width");
// - the ring has no hub: each roller gets a flange under the ring and a retaining ring over it, held by three countersunk
//   screws, so the ring is seated and captured by its three rollers (F2, F4), and four tapped holes on its rim take the load;
// - notes, badges and build rules (A16).
import { circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { RIM, ROLLER_ANGLES, ROLLER_R, nSet } from "./model";

const OUT = { n: 4, M: 2.5, R: RIM - 4 };
const FL = { R: ROLLER_R + 3, t: 1.5, top: 0.9, screws: 3, M: 2.5, pcd: 11 };
/** Hub sleeve between the long pinion's halves: bore (clear of the inner-race spacers), outside Ø, screws. */
const HUB = { d: 14, D: 33, screws: 3, M: 3, pcd: 29.5 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const ring = A.get("ring")!;

  // ---- the long pinions: halves bolted into one gear ----
  for (let k = 0; k < nSet; k++) {
    const lo = A.get(`long${k}`)!;
    const up = A.get(`longT${k}`)!;
    A.add(
      H.tube(`pL${k}-hub`, HUB.d, HUB.D, {
        name: k ? "" : `Long pinion hub sleeve Ø${HUB.D}, ${(up.z0 - lo.z1).toFixed(0)} mm, upper half bolted to the lower`,
        body: lo.body,
        at: [0, 0, 0],
        joints: [`pL${k}`],
        role: lo.role,
        z0: lo.z1,
        z1: up.z0,
        ex: lo.ex + 0.5,
        mat: "Steel C45",
      }),
    );
    for (let i = 0; i < HUB.screws; i++) {
      const [x, y] = polar(HUB.pcd / 2, (i * 2 * Math.PI) / HUB.screws + Math.PI / 6) as Vec2;
      up.holes.push(circle(HUB.M / 2 + 0.3, x, y, 16));
      A.get(`pL${k}-hub`)!.holes.push(circle(HUB.M / 2 + 0.3, x, y, 16));
      lo.marks.push({ kind: "thread", pts: circle(HUB.M / 2 - 0.2, x, y, 16) });
      A.add(H.screw(`pL${k}-hub-s${i}`, "button", HUB.M, up.z1 - (lo.z1 - 3), { body: lo.body, at: [x, y, 0], joints: [`pL${k}`], face: up.z1, dir: -1, ex: up.ex }));
    }
  }

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
  ring.name = `Ring gear, 84 teeth, ${OUT.n} x M${OUT.M} tapped in the rim for the load`;
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  for (let k = 0; k < nSet; k++) {
    const j = A.joint(`pL${k}`);
    j.note = `${j.note} The two halves of the long pinion are bolted to each other through a hub sleeve (three M${HUB.M}) and turn as one gear on their two bearings.`;
    j.badge = ["two halves as one gear", "ok"];
  }
  for (let k = 0; k < ROLLER_ANGLES.length; k++) {
    const j = A.joint(`pR${k}`);
    j.note = `${j.note} The roller runs on the ring's outer face (Ø${2 * RIM}); a ${FL.t} mm flange under the ring carries it and a ${FL.top} mm retaining ring over it, held by ${FL.screws} countersunk M${FL.M}, captures it axially.`;
    j.badge = ["ring carried and captured", "ok"];
  }
  A.rules.push(
    { title: "Carrier held, six axles in the base", text: "First gear holds the carrier, so the three short and three long pinions turn on dead axles in the base, each under its own bridge: each pinion is carried on both sides." },
    { title: "Pairs go in in phase", text: "Match marks at every mesh: the small sun and a short pinion, the short and the long, the long and the large sun and the ring. Fit the three pairs with the marked teeth toward the middle, then close the bridges." },
    { title: "The long pinion is one gear", text: "Its lower half meshes the short pinion, its upper half the large sun and the ring; the hub sleeve and three screws make the halves one, on two bearings." },
    { title: "The ring has no centre", text: "It is carried on its rim by three rollers on dead axles, flanged under and captured over it; nothing crosses the mesh. Backlash is set at the small sun by its eccentric." },
    { title: "Kinematics untouched", text: "The tooth profiles, the pitch circles, the orbit radii 48 and 60 and the ring are the model's; hubs, sleeves, screws and marks are fitted round them." },
  );
};
