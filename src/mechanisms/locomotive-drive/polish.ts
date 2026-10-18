// Overrides and additions to the generated locomotive-drive assembly (standard 5.2). The plating (rods and guide bars
// at their heights), the thick wheels and the linear input are the model's; the rules build every stack on them. What
// differs from the rules:
// - the wheel axles: the coupling and main rods sweep over both axles, so the rules' bridge (which stands above every
//   sweep) would put the axle through the rods. Each axle ends below the wheel face on a circlip, with a sealed bearing
//   and a hub cap, and the rods run clear over it;
// - six spokes' worth of windows in each wheel (M2), kept away from the crank pin boss; quartering marks (F9);
// - the belt carriage clamped to the belt, the base slot cut to its full travel, the base grown left to hold the tensioner arm, a fork sensor on the home flag (V6);
// - notes, badges and build rules (A16).
import { bbox, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { BEARINGS } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { growBase } from "../../rules/base";
import { R, r } from "./model";

/** Z of the circlip's lower face on each axle: the top of the wheel bearing's inner race. */
const WHEELS = [1, 2] as const;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  for (const k of WHEELS) {
    const pid = `pW${k}`;
    const wheel = A.get(`wheel${k}`)!;
    const brg = A.get(`${pid}-wheel${k}-brg`)!;
    const s2 = A.get(`${pid}-axle-s2`)!;
    const zc = brg.z1;
    // ---- the rules' bridge, its posts and the sleeve up to it come out; the axle stops at the wheel ----
    A.drop(new RegExp(`^${pid}-(bridge|sp-top)`));
    A.drop(`${pid}-axle-shim`);
    A.drop(`${pid}-axle-head`);
    A.drop(`${pid}-axle-s2`);
    ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== `${pid}-bridge-post`));
    const exA = wheel.ex + 1.5;
    const G = { body: s2.body, at: s2.at, ex: exA, joints: [pid], group: `${pid}-axle`, mat: s2.mat };
    H.shaft(`${pid}-axle-up`, { d: 10, z0: s2.z0, z1: zc + 1.6, grooves: [zc] }, { ...G, name: "" }).forEach((s) => A.add(s));
    A.add(H.circlip(`${pid}-axle-cl`, 10, { body: s2.body, at: s2.at, z0: zc, z1: zc + 1, ex: exA, joints: [pid], name: "External circlip DIN 471, Ø10" }));
    for (const s of A.find(new RegExp(`^${pid}-axle(-s1)?$`))) s.ex = exA;
    A.set(`${pid}-axle`, { name: "Stub axle Ø10, shouldered, circlip groove, M8 thread through the base, M8 nyloc underneath" });
    // the bearing is sealed: no bridge above to oil it from
    const old = A.drop(new RegExp(`^${pid}-wheel${k}-brg`));
    const b = BEARINGS.find((x) => x.d === 10 && x.D === 26)!;
    for (const s of H.bearing(`${pid}-wheel${k}-brg`, b, { body: brg.body, at: brg.at, ex: brg.ex, joints: brg.joints, z0: brg.z0, z1: brg.z1, closure: "seal", seat: old[0]!.seat })) A.add(s);
  }

  // ---- M2: windows between spokes, none within reach of the crank pin boss (edge distance of its tapped hole) ----
  const pinAt: Vec2 = [r, 0];
  const windows = H.spokes({ rIn: 19, rOut: R - 5, n: 6, half: 4.5, fillet: 3 }).filter((w) => Math.min(...w.map((p) => Math.hypot(p[0] - pinAt[0], p[1] - pinAt[1]))) > 12);
  for (const k of WHEELS) {
    const wheel = A.get(`wheel${k}`)!;
    wheel.holes.push(...windows);
    // F9: a mark on the rim at the crank pin, the same on both wheels: the rod only fits when both read the same
    wheel.marks.push({ kind: "timing", pts: [polar(R - 3.5, 0), polar(R - 0.8, 0)] });
    H.boreChamfers(wheel);
  }

  // ---- the belt carriage: over the belt, a clamp plate under it, the base slot cut to its full travel ----
  const car = A.get("drive-carriage")!;
  const belt = A.get("drive-belt")!;
  const [cx0, cy0, cx1, cy1] = bbox(car.outer);
  const base = A.get("base")!;
  // the linear drive's tensioner arm and idler stand past the base's left edge (the rule never calls growBase for the
  // far pulley): grow the plate to hold the arm's end with the same margin the plate keeps elsewhere
  const arm = A.get("drive-tensioner")!;
  growBase(ctx, [Math.min(...arm.outer.map((p) => p[0])) + arm.at[0] - 8, bbox(base.outer)[1], bbox(base.outer)[2], bbox(base.outer)[3]]);
  const old = base.holes.findIndex((h) => {
    const [a, b, c, d] = bbox(h);
    return Math.abs((b + d) / 2 - (cy0 + cy1) / 2) < 0.2 && c - a > 30;
  });
  const yc = (cy0 + cy1) / 2;
  const [h0, , h1] = bbox(base.holes[old]!);
  if (old >= 0) base.holes.splice(old, 1);
  base.holes.push(roundedPoly([[h0 + 5 - (cx1 - cx0) / 2 + 5, yc], [h1 - 5 + (cx1 - cx0) / 2 - 5, yc]], 5.5));
  const zClampTop = belt.z0;
  car.z0 = belt.z1 + 0.2;
  A.add(H.plate("drive-clamp", roundedPoly([[-6, yc], [6, yc]], 6), { body: car.body, at: car.at, kind: "bracket", role: "driver", name: "Belt clamp plate, 2 mm", mat: "Aluminium 6061-T6", z0: zClampTop - 2.2, z1: zClampTop - 0.2, ex: car.ex, joints: ["drive"] }));
  [-4.2, 4.2].forEach((x, i) => A.add(H.screw("drive-clamp-sc" + i, "button", 3, 2.2 + belt.z1 - belt.z0 + 4.4, { body: car.body, at: [x, yc - 2.4, 0], face: zClampTop - 2.2, dir: 1, ex: car.ex, joints: ["drive"], name: i ? "" : undefined, qty: i ? 0 : 2 })));

  // ---- V6: the fork sensor on the home flag (home at the inner dead centre, u = 0), the sensor lead routed round the motor ----
  const flag = A.get("drive-flag")!;
  const home = ctx.model.solve(0).pts.X!;
  const sens = H.sensor(A, "drive-sensor", { axis: [home[0], 0], a: Math.PI / 2, rIn: flag.at[1] + 3, rOut: flag.at[1] + 9.6, zv: flag.z0, t: flag.z1 - flag.z0, joint: "drive", ex: -5 });
  A.add(H.screw("drive-sensor-sc", "button", 3, 8, { at: [home[0], flag.at[1] + 9.6 + 3, 0], face: sens[0]!.z1, dir: 1, ex: -5, joints: ["drive"], name: "Button head M3 x 8, sensor to base" }));
  const term = A.get("drive-terminal")!;
  A.drop("drive-lead1");
  const clamp: Vec2 = [term.at[0] + 5, term.at[1] + 4];
  A.add(H.lead("drive-lead1", [[home[0], flag.at[1] + 9.6 + 3], [home[0], 32], [clamp[0], 32], [clamp[0], clamp[1] + 10], clamp], { joints: ["drive"], ex: -2, z0: ctx.b0 - 2.6, z1: ctx.b0 - 0.8, name: "Sensor lead, 3-core" }));

  locking.apply(ctx);
  materials.apply(ctx);
  for (const k of WHEELS) A.get(`wheel${k}`)!.mat = "Cast steel, machined, black oxide";
  ctx.rule = rule;

  // ---- A16 ----
  const rod = (id: string, text: string, badge: [string, "ok" | "warn"]) => A.joint(id, { note: `${A.joint(id).note} ${text}`, badge });
  for (const k of WHEELS) {
    A.joint(`pW${k}`, {
      note: `Stub axle Ø10 shouldered into the base, M8 nyloc underneath. The wheel is 14 mm thick and carries a sealed 6000 bearing between two circlips; an external circlip on the axle end, below the wheel face, retains it. The rods sweep over the axle, so there is no bridge: nothing stands above the wheel and the coupling rod clears the axle end by 3.5 mm.`,
      badge: ["single shear", "warn"],
      serves: { F1: [`pW${k}-axle-s1`], F2: [`pW${k}-axle-cl`, `pW${k}-wheel${k}-cl0`, `pW${k}-wheel${k}-cl1`], F4: [`pW${k}-sp0-tw`], F9: [`wheel${k}`] },
    });
  }
  A.joint("drive").serves.F10 = ["drive-flag", "drive-sensor"];
  rod("pC1", "The main rod rides outside the coupling rod on the same pin, as the catalogue has it. The pin is threaded through the 14 mm wheel and is the one fixed to the wheel.", ["stacked", "warn"]);
  A.joint("pX", { note: `${A.joint("pX").note} The wrist pin holds the main rod to the crosshead; the keeper plate runs under the rod.` });
  A.joint("drive", { note: `${A.joint("drive").note} The carriage clamps the belt between itself and a plate, and the base slot is cut to the carriage's full length of travel.` });
  A.rules.push(
    { title: "Rods over the wheels", text: "The coupling rod and the main rod both sweep over the axle ends, so the axles stop below the wheel faces and the rods run clear over them." },
    { title: "Both wheels read the same", text: "A mark on each rim at the crank pin: the coupling rod only fits when both wheels read alike." },
    { title: "Crosshead low, rod high", text: "The crosshead and its guide bars sit under the main rod, which runs over the keeper plate. The guide bars stand on tall ground pads." },
    { title: "Windows away from the pin", text: "The wheel windows stop short of the crank pin boss so its tapped hole keeps its edge distance." },
    { title: "Kinematics untouched", text: "Wheel radius 34, crank 17, rod lengths 80 and the guide line are the model's; the hardware is designed round them." },
  );
};
