// Toggle clamp on engine v3: the exceptions to the builder (standard 5.2, R7).
// - F7, D1: the plunger carries an adjustable spindle with a rubber pad; the pad, not the slider's face, meets the work,
//   and the spindle's thread sets where it bites. It reaches 36 mm past the slider's front face.
// - F5: the slide's front end stop is dropped: the linkage limits the plunger's forward travel at dead centre (and the
//   handle's stop at 3 degrees past it), and the spindle passes where that stop would stand. The back end stop stays.
import type { Polish } from "../../builder";
import type { Vec3 } from "../../kin/math";

export const polish: Polish = (A) => {
  const face = A.pin("plunger", [55, 0, 0]);
  const plunger = A.get("plunger")!;
  const mid = plunger.frame.o[2] + (plunger.op.op === "extrude" ? plunger.op.h : 7) / 2;
  const f = { o: [face[0], face[1], mid] as Vec3, x: [0, 0, 1] as Vec3, z: [1, 0, 0] as Vec3 };
  A.build(f, (L, h) => {
    L.add(...h.shaft("plunger-spindle", { d: 6, z0: -10, z1: 30 }, { body: "plunger", name: "Clamp spindle M6 x 40, threaded into the plunger" }));
    L.add(h.nut("plunger-spindle-jam", 6, { body: "plunger", z0: 0, name: "Jam nut M6, locks the spindle's setting" }));
    L.add(h.bumper("plunger-spindle-pad", 0, 8, { body: "plunger", z0: 30, z1: 36, name: "Spindle pad, neoprene Ø8, bonded to a steel cap" }));
  }, { joints: ["slide"] });
  A.drop(/^slide-(stop0|pad0)$/);
};
