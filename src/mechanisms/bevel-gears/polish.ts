// Overrides and additions to the generated bevel gear assembly (standard 5.2). The rules give the gear a live shaft in a
// housing behind the base (J2), the pinion a shaft in plan in two pillow blocks, both behind it since the pinion
// overhangs the gear (J10), and the mesh its shim packs, thrust washers and timing marks (J9). What differs:
// - the gear shaft is straddle mounted in a bridge (A9): the J2 straddle runs for parallel meshes only;
// - the J2 stack under the gear stops at the J9 thrust washer instead of running through it;
// - the pinion is held on its shaft end by a washer and a countersunk screw (F2);
// - the base grows under the outer pillow block and the drive;
// - the drive (AUTO-TODO): the belt drive turns a z shaft only, so the motor stands beside the pinion's shaft on an
//   angle bracket, its axis along x, and a GT2 belt runs 16:32 in a plane across the shaft to a pulley on the shaft's
//   free end; tension by slots in the bracket, flanges on the small pulley, home flag and fork sensor, leads to a
//   terminal block on the base edge (V1 to V6, F10);
// - notes, badges and build rules (A16).
import type { Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import type { Solid } from "../../hardware/solid";
import { BELT, MOTORS, PULLEYS } from "../../hardware/tables";
import { growBase } from "../../rules/base";
import { feet } from "../../rules/feet";
import { straddle } from "../../rules/j2-straddle";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import type { PinJoint } from "../../rules/types";
import { gw, m, zApex } from "./model";

/** H.screw leaves the shank on z: a screw on an x axis gets its shank on x too. */
const onX = (s: Solid[]): Solid[] => s.map((t) => Object.assign(t, { axis: "x" as const }));

/** The drive's belt plane along x, the motor's centre across the shaft (y) and its bracket, mm. */
const DR = { x0: -124, x1: -117, ym: 70, upright: [-130, -126] as [number, number], foot: 5 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const b1 = ctx.b1;

  // ---- A9: the gear shaft carried on both sides, its top in a floating bearing in a bridge ----
  // the bridge search does not see the pinion's sweep (a part on an x axis): a keep-out over the pinion's side of the
  // gear, there only while the bridge is placed, keeps its posts and arms on the open side
  const jG = ctx.info.find((j): j is PinJoint => j.kind === "pin" && j.id === "pG")!;
  const keep = H.plate("keep-out", [[-200, -70], [-25, -70], [-25, 70], [-200, 70]], { z0: b1, z1: b1 + 80 });
  A.add(keep);
  straddle(ctx, [jG]);
  A.drop("keep-out");

  // ---- the J2 spacer under the gear stops at the J9 thrust washer (both stacks sit under the gear's back face) ----
  const tw = A.get("mesh-pinion-gear-gear-tw0")!;
  A.set("pG-tw-sp", { z1: tw.z0 });

  // ---- M2: the gear on a hub and six arms; the rim keeps 2 modules under the roots (the windows taper with the teeth) ----
  const rRoot = gw.d / 2 - 1.25 * m * Math.cos(gw.delta);
  A.get("gear")!.holes.push(...H.spokes({ rIn: jG.d / 2 + 4.5 + 8, rOut: rRoot - 2 * m, n: 6, half: 5, fillet: 3 }));

  // ---- F2: the pinion held on the shaft end, a washer over its small end and a countersunk screw ----
  const pn = A.get("pinion")!;
  const shaft = A.get("pQ-shaft")!;
  const Q = { body: "pinion", axis: "x" as const, at: [0, 0, 0] as [number, number, number], joints: ["pQ"], ex: pn.ex };
  shaft.z1 = pn.z1;
  A.add(H.washer("pQ-end-w", 4.3, 16, { ...Q, name: "End washer Ø16 x 2, steel", z0: pn.z1, z1: pn.z1 + 2, inset: false }));
  A.add(onX(H.screw("pQ-end", "csk", 4, 10, { ...Q, face: pn.z1 + 2, dir: -1, name: "Countersunk M4 x 10 (ISO 10642), into the shaft end", lock: "threadlocker, medium (Loctite 243)" })));
  (A.joint("pQ").serves.F2 ??= []).push("pQ-end-w", "pQ-end");

  // ---- the drive: pulley on the shaft's free end, motor beside on an angle bracket (AUTO-TODO, V1 to V6) ----
  const pIn = PULLEYS[32];
  const pM = PULLEYS[16];
  const mot = MOTORS.pancake;
  const yc = 0;
  const zc = zApex;
  shaft.z0 = DR.x0 - 7;
  const S = { ...Q, joints: ["drive", "pQ"] };
  A.add(
    H.solid("drive-pulley-in", { ...S, kind: "pulley", role: "driver", name: "Input pulley GT2 32T, keyed", mat: "Aluminium 6061-T6, anodised", outer: H.disc(pIn.od / 2), holes: [H.disc(5.01)], z0: DR.x0, z1: DR.x1 }),
    H.solid("drive-hub-in", { ...S, kind: "pulley", role: "driver", name: "Pulley hub, 2 x M3 set screws at 90°", outer: H.disc(8), holes: [H.disc(5.01)], z0: DR.x0 - 5.5, z1: DR.x0 }),
    H.setScrew("drive-hub-ss0", 3, { ...S, at: [8 - 1.6, 0, 0], z0: DR.x0 - 4, z1: DR.x0 - 1.5 }),
    H.setScrew("drive-hub-ss1", 3, { ...S, at: [0, 8 - 1.6, 0], z0: DR.x0 - 4, z1: DR.x0 - 1.5, name: "" }),
  );
  // the motor pulley, flanged both sides (J8, F10), on the motor shaft
  const M: Vec2 = [DR.ym, zc];
  const G = { axis: "x" as const, joints: ["drive"], ex: pn.ex, at: [M[0], M[1], 0] as [number, number, number] };
  A.add(
    H.solid("drive-pulley-m", { ...G, kind: "pulley", role: "driver", name: "Motor pulley GT2 16T, D-bore", mat: "Aluminium 6061-T6", outer: H.disc(pM.od / 2), holes: [H.disc(2.05)], z0: DR.x0, z1: DR.x1, group: "drive-pm" }),
    H.solid("drive-pulley-m-fl0", { ...G, kind: "pulley", role: "driver", name: "Pulley flanges Ø14, both sides", mat: "Aluminium 6061-T6", outer: H.disc(pM.fd / 2), holes: [H.disc(2.05)], z0: DR.x0 - 1, z1: DR.x0, group: "drive-pm" }),
    H.solid("drive-pulley-m-fl1", { ...G, kind: "pulley", role: "driver", name: "", outer: H.disc(pM.fd / 2), holes: [H.disc(2.05)], z0: DR.x1, z1: DR.x1 + 1, group: "drive-pm" }),
    H.shaft("drive-shaft", { d: mot.shaft, z0: DR.upright[0] - 10, z1: DR.x1 + 1.5, flat: true }, { ...G, name: `Motor shaft Ø${mot.shaft}, D-flat`, role: "ground", group: "drive-pm" }),
  );
  // the belt loop in the plane across the shaft
  A.add(
    H.solid("drive-belt", {
      axis: "x",
      kind: "belt",
      name: `Timing belt GT2, ${BELT.width} mm, closed loop`,
      mat: "Neoprene, glass-fibre cords",
      outer: H.hullOf([[yc, zc, pIn.pd / 2 + BELT.thick], [M[0], M[1], pM.pd / 2 + BELT.thick]]),
      holes: [H.hullOf([[yc, zc, pIn.pd / 2 + 0.15], [M[0], M[1], pM.pd / 2 + 0.15]])],
      z0: DR.x0 + 0.5,
      z1: DR.x1 - 0.5,
      ex: pn.ex,
      joints: ["drive"],
      chamfer: 0,
    }),
  );
  // the angle bracket: a foot on the base and an upright the motor's face screws to, slotted along y for belt tension
  const R = mot.R;
  const [u0, u1] = DR.upright;
  const yb0 = M[0] - R - 5;
  const yb1 = M[0] + R + 5;
  const zt = M[1] + R + 5;
  const B = { kind: "bracket" as const, role: "ground" as const, mat: "Aluminium 6061, bead-blasted", group: "drive-bracket", joints: ["drive"], ex: pn.ex, chamfer: 0.8 };
  const slot = (y: number, z: number, r: number): Vec2[] => H.window([[y - 4, z], [y + 4, z]] as Vec2[], r);
  const face: Vec2[] = [[M[0], M[1] + R - 6], [M[0], M[1] - R + 6]];
  A.add(
    H.solid("drive-upright", {
      ...B,
      axis: "x",
      name: "Motor bracket, one-piece angle, slotted for belt tension",
      outer: [[yb0, b1 + DR.foot], [yb1, b1 + DR.foot], [yb1, zt - 6], [yb1 - 6, zt], [yb0 + 6, zt], [yb0, zt - 6]],
      holes: [slot(M[0], M[1], 6.5), ...face.map(([y, z]) => slot(y, z, 1.7))],
      z0: u0,
      z1: u1,
    }),
  );
  const fx0 = u0 - mot.H - 6;
  const fx1 = u1;
  const footHoles: Vec2[] = [[fx0 + 5, yb0 + 5], [fx0 + 5, yb1 - 5]];
  A.add(
    H.plate("drive-foot", [[fx0, yb0], [fx1, yb0], [fx1, yb1], [fx0, yb1]], { ...B, name: "", holes: footHoles.map(([x, y]) => H.window([[x, y - 3], [x, y + 3]] as Vec2[], 2.2)), z0: b1, z1: b1 + DR.foot }),
  );
  // two screws through the slotted foot into the base, one more pair through the upright's foot flange
  footHoles.forEach(([x, y], k) => A.add(H.screw(`drive-foot-sc${k}`, "socket", 4, 12, { at: [x, y, 0], face: b1 + DR.foot, dir: -1, joints: ["drive"], ex: pn.ex + 1, name: k ? "" : "Socket head M4 x 12, bracket to base, in slots for belt tension", qty: k ? 0 : 2 })));
  // the motor on the upright's outer face, screwed through the slots
  const MO = { axis: "x" as const, at: [M[0], M[1], 0] as [number, number, number], joints: ["drive"], ex: pn.ex, group: "drive-motor", role: "ground" as const };
  A.add(
    H.solid("drive-motor", { ...MO, kind: "motor", name: mot.name, mat: "Aluminium flange, steel bell", outer: H.disc(R - 3), holes: [H.disc(2.1)], z0: u0 - 3, z1: u0, chamfer: 0.8 }),
    H.solid("drive-bell", { ...MO, kind: "motor", name: "", mat: "Steel, black e-coat", outer: H.disc(R), holes: [H.disc(2.1)], z0: u0 - mot.H, z1: u0 - 3.5 }),
    H.solid("drive-stator", { ...MO, kind: "motorInternal", name: "Stator, 12 teeth, 3-phase windings", faint: true, outer: H.disc(19.8), holes: [H.disc(4.6)], z0: u0 - 14, z1: u0 - 4.5 }),
  );
  face.forEach(([y, z], k) =>
    A.add(onX(H.screw(`drive-face-sc${k}`, "button", 3, 8, { axis: "x", at: [y, z, 0], face: u1, dir: -1, joints: ["drive"], ex: pn.ex, name: k ? "" : "Button head M3 x 8, motor to bracket, in slots", qty: k ? 0 : 2 }))),
  );
  ctx.belts.push({ belt: "drive-belt", pulleys: ["drive-pulley-m", "drive-pulley-in"], mount: "drive-upright", joint: "drive" });

  // V6, F10: a home flag on the located collar between the blocks, read by a fork sensor on a post
  const col = A.get("pQ-cA0")!;
  const zv = col.z0 - 1;
  A.add(H.flag("drive-flag", 9.5, 18, -Math.PI / 2, { ...Q, joints: ["drive"], z0: zv, z1: zv + 1 }));
  const sens = H.sensor(A, "drive-sensor", { axis: [yc, zc], a: -Math.PI / 2, rIn: 13, rOut: 19.5, zv, t: 1, joint: "drive", ex: pn.ex });
  for (const s of sens) s.axis = "x";
  const zs = zc - 19.5 - 6;
  A.add(H.standoff("drive-post", { at: [zv + 0.5, yc, 0], z0: b1, z1: zs, joints: ["drive"], ex: pn.ex, name: "Sensor post Ø10, M5" }));

  // ---- the base under the outer block and the drive ----
  const yEdge = yb1 + 14;
  growBase(ctx, [fx0 - 8, -(yEdge - 20), 0, yEdge]);
  A.drop(/^foot\d$/);
  feet.apply(ctx);

  // leads: motor and sensor to a terminal block on the base's back edge, one clip on the base top
  const T: Vec2 = [fx0 + 22, yEdge - 10];
  const L = { joints: ["drive"], ex: pn.ex };
  A.add(H.terminalBlock("drive-terminal", 4, { ...L, at: [T[0], T[1], 0], z0: b1, z1: b1 + 8 }));
  A.add(H.screw("drive-terminal-sc", "button", 3, 10, { ...L, at: [T[0], T[1], 0], face: b1 + 8, dir: -1, name: "Button head M3 x 10, terminal block to base" }));
  const yl = yb1 + 2;
  A.add(H.lead("drive-lead0-up", [[M[0] + R + 0.3, M[1]], [yl, M[1]], [yl, b1 + 0.9]], { ...L, axis: "x", z0: u0 - mot.H + 2, z1: u0 - mot.H + 3.8, name: "Motor phase leads, 3-core" }));
  const xl = u0 - mot.H + 2.9;
  A.add(H.lead("drive-lead0", [[xl, yl], [xl, T[1] - 8], [T[0] - 5, T[1] - 8], [T[0] - 5, T[1] - 4]], { ...L, z0: b1, z1: b1 + 1.8, name: "" }));
  A.add(H.lead("drive-lead1", [[zv + 0.5, yc + 6], [zv + 0.5, T[1] - 12], [T[0] + 5, T[1] - 12], [T[0] + 5, T[1] - 4]], { ...L, z0: b1, z1: b1 + 1.8, name: "Sensor lead, 3-core" }));
  const cx = (zv + 0.5 + T[0]) / 2;
  A.add(H.cableClip("drive-clip", { ...L, at: [cx, T[1] - 12, 0], z0: b1, z1: b1 + 3.2 }));
  A.add(H.screw("drive-clip-sc", "button", 3, 6, { ...L, at: [cx, T[1] - 12, 0], face: b1 + 3.2, dir: -1, name: "Button head M3 x 6, cable clip" }));

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  const c = Math.hypot(M[0] - yc, M[1] - zc);
  const drive = A.joint("drive");
  drive.note = `Brushless pancake motor Ø50 x 18 beside the pinion's shaft on a one-piece angle bracket, its axis along x; GT2 belt 32:16 over ${c.toFixed(0)} mm in a plane across the shaft to the input pulley on its free end, past the outer block. Tension by the slots in the bracket's foot and upright; flanged motor pulley; home flag on the located collar read by a fork sensor on a post; leads to a terminal block on the base edge. Built by hand: the belt drive rule turns a z shaft only.`;
  drive.badge = ["motorised, by hand", "warn"];
  drive.serves = { F10: ["drive-flag", "drive-sensor", "drive-pulley-m-fl0", "drive-pulley-m-fl1"], F7: ["drive-upright"] };
  A.joint("pQ", { note: `${A.joint("pQ").note} The pinion is held on the shaft end by a washer and a countersunk M4; the mesh pushes it back onto its shim and thrust washer.` });
  const mesh = A.joint("mesh-pinion-gear");
  mesh.note = `${mesh.note} The teeth are open, greased at assembly (F8). The gear's back face sits on its own thrust washer, the housing's spacer stopping short of it.`;
  A.rules.push(
    { title: "One apex", text: "Both pitch cones must meet at one point: the shim packs behind each gear set its mounting distance, and so the backlash and where the teeth bear." },
    { title: "Pushed away from the apex", text: "The mesh pushes each gear toward its back face: a bronze thrust washer there takes it, on the pinion against the located block's collars, on the gear against the housing." },
    { title: "Pinion overhung, gear straddled", text: "The pinion overhangs the gear, so both its blocks stand behind it, far apart; the gear shaft runs from its housing below to a floating bearing in a bridge above." },
    { title: "Marked to go back in phase", text: "Timing marks on tooth 0 of each gear: the pinion's marked tooth goes in beside the gear's marked tooth." },
    { title: "Kinematics untouched", text: "Cone angles, back-cone teeth and the apex are the model's; blocks, bridge, shims and the drive are fitted round them." },
  );
};
