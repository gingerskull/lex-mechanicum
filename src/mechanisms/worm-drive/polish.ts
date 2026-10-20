// Overrides and additions to the generated worm drive assembly (standard 5.2). The rules give the wheel a live shaft in
// a housing behind the base, straddle mounted in a bridge (J2, A9), the worm a shaft in plan between two pillow blocks,
// located in the block on its -x side (J10), the mesh its shim packs, thrust washers both ways on the worm and timing
// marks (J9), and the drive: a motor beside the worm's shaft, belted across it to a pulley on its free end (V1 to V6).
// What differs:
// - a phosphor bronze wheel on a hub and six arms (M2, M10), a case-hardened and ground steel worm (M10);
// - an external circlip on the shaft past the worm's outer thrust washer, so the worm's thrust reaches the located
//   block both ways (F4);
// - oil for the sliding contact: a felt oiler in a block on the base pressed on the worm's thread, fed from an oil hole
//   on top, in place of the rule's grease (F8);
// - notes, the self-locking note and build rules (A16).
import type { Polish } from "../../assemble/api";
import { roundRect } from "../../core/geom";
import { leadAngle } from "../../core/spatial";
import type { PinJoint } from "../../rules/types";
import { RW, YW, ZW, m, w } from "./model";

/** Friction coefficient of oiled hardened steel on phosphor bronze at rest. */
const MU = 0.1;
/** The oiler block in plan (x from and to; y of its face toward the worm, 3 mm clear of the thread, and of its back) and its height, mm. */
const OIL = { x0: 2, x1: 26, y0: YW - RW - 3, y1: YW - RW - 17, h: 24 };

export const polish: Polish = (A, H) => {
  const jG = A.ctx.info.find((j): j is PinJoint => j.kind === "pin" && j.id === "pG")!;
  const wheel = A.get("wheel")!;
  const worm = A.get("worm")!;

  // ---- M2, M10: a bronze wheel on a hub and six arms (it starts and stops with the motor); the rim keeps 2 modules under the roots ----
  const rRoot = w.d2 / 2 - 1.25 * m;
  wheel.holes.push(...H.spokes({ rIn: jG.d / 2 + 4.5 + 8, rOut: rRoot - 2 * m, n: 6, half: 5, fillet: 3 }));
  A.set("wheel", { name: "Worm wheel, 30 teeth, hub and six arms", mat: "Phosphor bronze CuSn12, teeth hobbed", why: "bronze against the hardened worm: the pair slides, so the softer wheel wears in and does not seize" });
  A.set("worm", { name: "Worm, single start, module 3", mat: "Steel 16MnCr5, case-hardened, thread ground", why: "the hard, ground thread slides across the bronze teeth" });

  // ---- F4: the worm held on its shaft past its outer thrust washer, so its thrust either way reaches the located block ----
  const tw1 = A.get("mesh-worm-wheel-worm-tw1")!;
  const clip = H.circlip("pW-worm-cl", 10, { axis: "x", body: worm.body, at: [0, 0, 0], z0: tw1.z1, ex: worm.ex, joints: ["pW"], why: "holds the worm on the shaft toward the floating block, so the thrust that way runs through the shaft to the located block" });
  A.add(clip);

  // ---- F8: a felt oiler pressed on the worm's thread; the thread carries the oil round into the mesh ----
  const ex = A.get("pW-blkA")!.ex;
  const G = { body: "ground", at: [0, 0, 0] as [number, number, number], ex, joints: ["mesh-worm-wheel"] };
  const xm = (OIL.x0 + OIL.x1) / 2;
  const block = H.plate("oiler", roundRect(OIL.x0, OIL.y1, OIL.x1, OIL.y0, 2), {
    ...G,
    kind: "bracket",
    name: `Oiler block ${OIL.x1 - OIL.x0} x ${OIL.y0 - OIL.y1} x ${OIL.h}, the felt in a pocket on its face`,
    z0: A.b1,
    z1: A.b1 + OIL.h,
    why: "holds the felt against the worm and its oil above it",
  });
  // its face 0.2 mm off the thread's tips in the drawing: the clamp check (A12) reads any face contact with a turning
  // part as a clamp, and has no wiper exception
  const felt = H.felt("oiler-felt", roundRect(xm - 6, OIL.y0 - 1, xm + 6, YW - RW - 0.2, 1), {
    ...G,
    name: "Felt oiler 12 x 4 x 12, oil-soaked wool felt, pressed on the worm's thread",
    z0: ZW - 8,
    z1: ZW + 4,
    why: "wipes oil onto the thread, which carries it into the mesh: the worm and wheel slide (F8)",
  });
  // an oil hole from the block's top down to the felt, a sink round it
  block.marks.push(...H.oilSink(1.5, xm, OIL.y0 - 2.5));
  const screws = [OIL.x0 + 7, OIL.x1 - 7].flatMap((x, k) =>
    H.screw(`oiler-sc${k}`, "socket", 4, OIL.h + 6, { at: [x, (OIL.y0 + OIL.y1) / 2, 0], face: A.b1 + OIL.h, dir: -1, ex: ex + 1, joints: ["mesh-worm-wheel"], lock: "threadlocker, medium (Loctite 243)", ...(k ? { name: "" } : {}) }),
  );
  A.add(block, felt, ...screws);

  // ---- A16 ----
  const gamma = leadAngle(w.lead, w.d1);
  const phi = Math.atan(MU);
  const deg = (a: number) => (a / (Math.PI / 180)).toFixed(1);
  const mesh = A.joint("mesh-worm-wheel");
  mesh.note = `${mesh.note.replace(" Open gears: greased at assembly.", "")} The pair slides along the thread, so it is oiled, not greased: a felt in a block on the base presses on the worm's thread and the thread carries the oil into the mesh; the felt is fed from an oil hole on the block's top (F8). The wheel's shim sets its mid-plane on the worm's axis. Lead angle ${deg(gamma)}°, about the friction angle of oiled steel on bronze at rest (μ ${MU}, ${deg(phi)}°): the wheel cannot drive the worm back at rest, but under vibration it may creep, so it is no substitute for a brake.`;
  (mesh.serves.F8 ??= []).push(felt.id);
  const jW = A.joint("pW", {
    note: `${A.joint("pW").note} The worm stands between its blocks, never overhung. The located block takes the worm's thrust both ways: toward it through the shim, the inner thrust washer and the inner collar; away from it through the outer thrust washer and a circlip on the shaft, the shaft and the outer collar.`,
  });
  (jW.serves.F2 ??= []).push(clip.id);
  (jW.serves.F4 ??= []).push(clip.id);
  A.rules.push(
    { title: "Worm between two blocks", text: "The worm is never overhung: one block each side of it, the one on the -x side located by two collars, the other floating, so the shaft can grow." },
    { title: "Thrust both ways to one block", text: "The mesh pushes the worm along its shaft, one way driving, the other way braking: thrust washers each side of it and a circlip on the shaft take it to the located block either way." },
    { title: "Mid-plane on the axis", text: "The wheel's shim pack sets its mid-plane on the worm's axis, the worm's shim its place along the shaft; together they set the backlash and where the teeth bear." },
    { title: "Hard on soft, oiled", text: "A case-hardened ground worm on a phosphor bronze wheel; the contact slides, so a felt keeps the thread oiled." },
    { title: "Self-locking is not a brake", text: "At 5.7° the lead angle is about the friction angle: the wheel will not drive the worm at rest, but vibration can make it creep." },
  );
};
