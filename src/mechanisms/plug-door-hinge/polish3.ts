// Plug-door hinge on engine v3: the exceptions to the builder (standard 5.2, R7).
// - F5: the open stop. The door ends its swing folded flat outside, its outer face 6 mm off the wall's outer face; a
//   neoprene bumper on the wall's outer face, under the door's free half, takes it there. The stops rule serves a lever
//   that swings on its own pivot, and this door lands on the wall instead. The closed stop needs nothing added: the stop
//   lips on the door's inner face seat on the jambs.
import type { Polish } from "../../builder";
import type { Vec3 } from "../../kin/math";

/** Where the bumper stands on the wall's outer face (world, mm), and its length out to 0.2 mm short of the door. */
const BUMPER = { at: [-70, 0, 15] as Vec3, D: 12, L: 5.8 };

export const polish: Polish = (A) => {
  const f = { o: BUMPER.at, x: [1, 0, 0] as Vec3, z: [0, -1, 0] as Vec3 };
  A.build(f, (L, h) => {
    L.add(h.bumper("open-bumper", 0, BUMPER.D, { body: "wall", z0: 0, z1: BUMPER.L, name: `Stop bumper, neoprene Ø${BUMPER.D}, bonded to a steel stud: the door lands on it open` }));
    L.add(...h.shaft("open-bumper-stud", { d: 4, z0: -8, z1: 0 }, { body: "wall", name: "Bumper stud M4, threaded into the wall, threadlocked" }));
  }, { joints: ["H"] });
  A.note({ id: "door-stops", kit: "stops", at: BUMPER.at, title: "Stops · door", note: "Closed: the stop lips on the door's inner face seat on the jambs, 0.2 mm off at the closed pose. Open: the door's outer face lands on a neoprene bumper on the wall's outer face, 0.2 mm off at the end of the track's run.", serves: { F5: ["open-bumper", "door-panel"] }, badge: ["stopped both ends", "ok"] });
};
