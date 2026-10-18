// Overrides and additions to the generated Whitworth assembly (standard 5.2). The plating (gears and lever, the rod
// and the ram's cap), the clevis at the ram and the slotted lever are the model's. The rules build the live pinion
// shaft in its housing, the track roller and wear strips in the lever's slot, the ram on its rails and the bolts at B
// and C. What differs from the rules:
// - the rod sweeps over the lever pivot, so no bridge fits there: the pivot axle's head sits just over the lever;
// - the bull gear is a ring that turns on the fixed hub: a bronze bushing, thrust washers above and below, a hub flange
//   and a retainer plate screwed down by the hub's two screws (the rules know nothing of a ring on a hub);
// - the cap's post on the ram, on the side the rod never swings to;
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { bearingName } from "../../hardware/primitives";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { Rbore, Rhub, e } from "./model";

const R_FLANGE = 34;
const R_THRUST = 31;
/** Gear plane: 3 mm below the layer grid (model dz), the bull gear 7 mm thick. */
const GZ0 = -3;
const GZ1 = 4;
const T_W = 1.5;
const RET = 2;
/** The first rail pad moves this far along the rail, out of the lever's sweep. */
const PAD_SHIFT = 14;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const hub = A.get("hub")!;
  const lever = A.get("lever")!;
  const ram = A.get("ram")!;
  const cap = A.get("cap")!;
  const exBull = ctx.get("bull")!.ex;

  // ---- pivot O3: no bridge (the rod passes over), the axle's head sits 2 mm over the bearing ----
  A.drop(/^pO3-bridge/);
  A.drop("pO3-axle-shim");
  const brg = A.get("pO3-lever-brg-fl")!;
  const zHead = brg.z1 + 1;
  A.set("pO3-sp-top", { z1: zHead, name: "Inner-race spacer 10.2x13.1", kind: "spacer", span: undefined });
  A.set("pO3-axle-s2", { z1: zHead });
  const head = A.get("pO3-axle-head")!;
  const hh = head.z1 - head.z0;
  A.set("pO3-axle-head", { z0: zHead, z1: zHead + hh });
  const lb = A.get("pO3-lever-brg")!;
  for (const id of ["pO3-lever-brg", "pO3-lever-brg-fl"]) A.set(id, { closure: "shield", name: id === "pO3-lever-brg" ? bearingName(lb.d!, lb.D!, "shield", true) : "" });
  const J3 = A.joint("pO3");
  J3.serves.F1 = ["pO3-axle", "pO3-axle-s2"];
  delete J3.serves.F8;

  // ---- the bull gear on its hub ----
  const flange = H.plate("hub-flange", H.disc(R_FLANGE), {
    name: `Hub flange Ø${2 * R_FLANGE}, steel, pressed on and pinned`,
    role: "hw",
    kind: "plate",
    body: "ground",
    at: [0, 0, 0],
    z0: hub.z0,
    z1: GZ0 - T_W,
    holes: [H.disc(Rhub)],
    ex: hub.ex,
    mat: "Steel C45, black oxide",
    joints: ["O2"],
  });
  const thrust = (id: string, z0: number, name: string, qty: number) =>
    H.thrustWasher(id, 2 * Rhub + 0.1, 2 * R_THRUST, { name, qty, at: [0, 0, 0], z0, z1: z0 + T_W, ex: exBull, joints: ["O2"], body: "ground" });
  const bush = H.bushing("bull-bush", 2 * Rhub, 2 * Rbore, {
    name: `Bronze bushing Ø${2 * Rhub} x Ø${2 * Rbore} x ${GZ1 - GZ0}, oil-impregnated`,
    body: "bull",
    at: [0, 0, 0],
    z0: GZ0,
    z1: GZ1,
    ex: exBull,
    joints: ["O2"],
  });
  // the bushing rides in the bull gear: it is pressed in, so it carries the gear's level and its hole is the hub's
  bush.holes = [H.disc(Rhub + 0.05)];
  const retainer = H.plate("bull-retainer", H.disc(R_THRUST), {
    name: `Bull gear retainer plate Ø${2 * R_THRUST} x ${RET}`,
    role: "hw",
    kind: "plate",
    body: "ground",
    at: [0, 0, 0],
    z0: GZ1 + T_W,
    z1: GZ1 + T_W + RET,
    holes: [H.disc(5.25, 0, -e)],
    marks: H.oilSink(1.6, 0, Rbore - 1).concat(H.oilSink(1.6, 0, -(Rbore - 1))),
    ex: exBull + 0.5,
    mat: "Steel, zinc plated",
    joints: ["O2"],
  });
  A.add(flange, thrust("bull-tw-lo", GZ0 - T_W, `Thrust washer Ø${2 * Rhub} x Ø${2 * R_THRUST} x ${T_W}, bronze`, 2), bush, thrust("bull-tw-hi", GZ1, "", 0), retainer);
  // the hub's two posts, placed by hand: the rule's pair would land on the pivot's bore. Their screws clamp the retainer
  // plate down on the hub from above and pull the hub down from below.
  A.drop(/^hub-post/);
  ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== "hub-post" && j.id !== "pO3-bridge-post"));
  const posts: [number, number][] = [[-15, 11], [15, 11]];
  const zR = retainer.z1;
  const M = 5;
  posts.forEach(([x, y], k) => {
    const G = { at: [x, y, 0] as [number, number, number], joints: ["hub-post"] };
    hub.holes.push(H.disc(M / 2 + 0.3, x, y));
    retainer.holes.push(H.disc(M / 2 + 0.3, x, y));
    A.add(H.standoff(`hub-post${k}`, { ...G, name: k ? "" : `Standoff Ø10 x ${(hub.z0 - A.b1).toFixed(0)}, M5`, qty: k ? 0 : 2, outer: H.disc(5), D: 10, z0: A.b1, z1: hub.z0, span: [-1, hub.ex], ex: -1 }));
    A.add(H.screw(`hub-post${k}-top`, "button", M, zR - hub.z0 + 1.5 * M, { ...G, face: zR, dir: -1, ex: hub.ex, name: k ? "" : undefined, qty: k ? 0 : 2 }));
    A.add(H.screw(`hub-post${k}-bot`, "button", M, A.b1 - A.b0 + 1.5 * M, { ...G, face: A.b0, dir: 1, ex: -1, name: k ? "" : undefined, qty: k ? 0 : 2 }));
  });
  // two dowels through the hub into the base locate it, so the pivot goes back exactly e from the gear's axis (F1, K1)
  const dows: [number, number][] = [[-17, -8], [17, -8]];
  dows.forEach(([x, y], k) => {
    hub.holes.push(H.disc(1.5, x, y));
    A.add(H.dowel(`hub-dw${k}`, 3, { at: [x, y, 0], z0: A.b1 - 5, z1: hub.z0 + 5, ex: -1, joints: ["hub-post"], name: k ? "" : "Dowel pin Ø3 h6 (ISO 8734), hub to base", qty: k ? 0 : 2 }));
  });
  A.joint("hub-post", {
    type: "post",
    at: [0, 11],
    title: "Post · Pivot hub",
    note: `Two Ø10 standoffs, ${(hub.z0 - A.b1).toFixed(0)} mm, hold the hub off the base; M5 button heads from both sides, the top pair also clamping the retainer plate. Two Ø3 dowels through the hub into the base put the pivot back exactly ${e} mm from the gear's axis.`,
    badge: ["seated and dowelled", "ok"],
    serves: { F1: ["hub-dw0", "hub-dw1"] },
  });
  A.joint("O2", {
    type: "J1",
    at: [0, 0],
    title: "Bull gear on its hub",
    note: `The bull gear is a ring on the fixed hub (Ø${2 * Rhub}); the hub is bored for the lever pivot's axle at O3, ${e} mm from the gear's axis. A sintered bronze bushing in the bull gear's bore runs on the hub, oiled from two sinks in the retainer plate; the gear is located between a bronze thrust washer on the hub flange and one under the retainer plate, which two M5 screws clamp to the hub. Torque comes in at the teeth only, so no key is needed.`,
    badge: ["both ends held", "ok"],
    serves: { F1: [hub.id, flange.id], F2: [retainer.id], F4: ["bull-tw-lo", "bull-tw-hi"], F8: [bush.id, retainer.id] },
  });

  // ---- the cap's post on the ram, on the side the rod never swings to, screwed down into the ram ----
  const postX = 14;
  A.add(H.standoff("cap-post", { name: "Cap post Ø8", outer: H.disc(4), D: 8, role: "output", body: "ram", at: [postX, 0, 0], z0: ram.z1, z1: cap.z0, ex: cap.ex - 0.5, joints: ["pC"], mat: "Steel C45, black oxide" }));
  A.add(H.screw("cap-sc", "button", 3, cap.z1 - ram.z1 + 3, { body: "ram", at: [postX, 0, 0], face: cap.z1, dir: -1, ex: cap.ex, joints: ["pC"] }));

  // ---- V6 workaround: the cabling rule puts the terminal block on the base edge straight under the motor bracket's wall,
  // where its screw cuts the wall. Slide the block, its screw and the last runs of both leads along the edge, clear of
  // the bracket (a rule fix would make the cabling rule avoid the bracket; see the audit) ----
  {
    const wall = A.get("drive-wall");
    const term = A.get("drive-terminal");
    if (wall && term) {
      const R = 25;
      const x1 = wall.at[0] + R + 12;
      const dx = x1 - term.at[0];
      if (dx > 0) {
        for (const id of ["drive-terminal", "drive-terminal-sc", "drive-terminal-sc-sh"]) {
          const s = A.get(id);
          if (s) A.set(id, { at: [s.at[0] + dx, s.at[1], s.at[2]] });
        }
        const centre = (outer: [number, number][]): [number, number][] => {
          const n = outer.length / 2;
          return Array.from({ length: n }, (_, i): [number, number] => [(outer[i]![0] + outer[2 * n - 1 - i]![0]) / 2, (outer[i]![1] + outer[2 * n - 1 - i]![1]) / 2]);
        };
        const runs: [number, number][][] = [];
        for (const id of ["drive-lead0", "drive-lead1"]) {
          const s = A.get(id);
          if (!s) continue;
          const pts = centre(s.outer as [number, number][]);
          const ax = pts[pts.length - 2]![0];
          for (let i = Math.max(1, pts.length - 3); i < pts.length; i++) if (Math.abs(pts[i]![0] - ax) < 1e-6) pts[i] = [pts[i]![0] + dx, pts[i]![1]];
          A.set(id, { outer: H.lead("t", pts).outer });
          runs.push(pts);
        }
        // the clip holds the motor lead on its longest run
        const clip = A.get("drive-clip");
        const p0 = runs[0];
        if (clip && p0) {
          let best = 0;
          const len = (i: number) => Math.hypot(p0[i + 1]![0] - p0[i]![0], p0[i + 1]![1] - p0[i]![1]);
          for (let i = 1; i < p0.length - 1; i++) if (len(i) > len(best)) best = i;
          const a = p0[best]!;
          const b = p0[best + 1]!;
          const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          A.set("drive-clip", { at: [mid[0], mid[1], Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2] });
          for (const id of ["drive-clip-sc", "drive-clip-sc-sh"]) A.set(id, { at: [mid[0], mid[1], 0] });
        }
      }
    }
  }

  // ---- the rails run from 54 so the ram (28 wide, C from 68 to 132) stays on them over the whole stroke; the first
  // pad stood in the lever's 66 mm sweep, so it and its screw and dowel move 14 mm along, clear of the sweep ----
  for (const k of ["a", "b"]) {
    const pad = A.get(`rail${k}-seat0`)!;
    A.set(`rail${k}-seat0`, { outer: (pad.outer as [number, number][]).map(([x, y]): [number, number] => [x + PAD_SHIFT, y]) });
    for (const id of [`rail${k}-seat0-sc`, `rail${k}-seat0-sc-sh`, `rail${k}-seat0-dowel`]) {
      const s = A.get(id);
      if (s) A.set(id, { at: [s.at[0] + PAD_SHIFT, s.at[1], s.at[2]] });
    }
  }

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO3", {
    note: `Dead axle through the pivot hub and the base, to a washer and nyloc underneath; ${sz("pO3-axle")} The rod sweeps over this pivot at ${A.get("pO3-axle-head")!.z0.toFixed(0)} to ${(lever.z1 + 9).toFixed(0)} mm, so no bridge fits: the axle is held in the hub and the base instead, the lever overhung 5 mm above the hub, its bearing shielded. The head sits 2 mm over the bearing, 4 mm under the rod.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pPn", {
    note: `${A.joint("pPn").note} No straddle bridge over the shaft: the lever's tip sweeps over the pinion, 0.9 mm over the shaft end, so the shaft is carried by the two housing bearings alone, 15 mm apart, and the pinion is plated 3 mm low to give the lever that room.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pA", { note: `${A.joint("pA").note} The crank pin carries a track roller that runs in the lever's slot, 26 to 54 mm from the pivot. Single shear is forced: the lever sweeps over the bull gear, so the pin is held by the gear alone; the lever is plated 1.5 mm up.` });
  A.joint("pB", { note: `${A.joint("pB").note} Single shear is forced: the lever sweeps under the rod and nothing can stand above or below the pair.` });
  A.joint("pC", {
    note: `Clevis: the ram below the rod and its cap 1.5 mm over it, the cap on a post on the side the rod never swings to, so the wrist pin works in double shear. ${sz("pC-bolt")} threaded into the ram; the rod's bearing between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("slide-ram", { note: `${A.joint("slide-ram").note} The rails are hardened, ground and screwed down on pads: they and the bronze gib are the replaceable wear parts. They start 54 mm from O3, so the ram (28 wide) stays on them over its whole stroke; the lever passes under their near end, and the first pad stands past its sweep.` });

  A.rules.push(
    { title: "Ring gear on a fixed hub", text: "The lever pivot sits inside the bull gear's circle, so the gear is a ring on a hub that carries the pivot stud: a bronze bushing, thrust washers above and below, a retainer plate." },
    { title: "Gears low, lever over them, rod over the lever", text: "Gears 3 mm below the grid, the lever 1.5 mm up, the ram and rails 20 mm up, the rod over the ram: the lever clears the pinion hub, the roller pin and the ram, and nothing is stacked only to clear something." },
    { title: "Roller in the slot", text: "The crank pin's track roller runs in the lever's slot between hardened wear strips; the slot is cut for the pin's whole run, from 26 to 54 mm from the pivot." },
    { title: "Clevis at the ram", text: "The wrist pin is held above and below: a cap on a post on the side of the ram the rod never swings to." },
    { title: "Kinematics untouched", text: "Pin centres, the slot line, the ram line and the gear mesh are the model's; the hardware is designed round them." },
  );
};
