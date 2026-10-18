// Overrides and additions to the generated Klann assembly (standard 5.2). The plating, the layer order and the tapered
// links are the model's; the rules build every stack on them. What differs from the rules:
// - the two rocker pivots A and B: the leg (and, at B, the connector) sweeps over them, so the rules' bridge (which
//   stands above every sweep) would put the axle through the plates. Each axle ends on a circlip just above the
//   rocker's bearing and the plate above runs clear over it, as on the locomotive drive's wheel axles;
// - a lightening window in the connector and in the leg, the big oscillating plates (D2, M2);
// - an index on the crank and a zero line on the base, so the crank goes back in phase (F9);
// - notes, badges and build rules (A16).
import { polar, type Vec2 } from "../../core/geom";
import { edgeDist, inside } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { bearingName } from "../../hardware/primitives";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

/** The plates' plan corners (the pins), body-local, as in the model. */
const CONNECTOR: Vec2[] = [[0, 0], [44, 0], [82, -8.7]];
const LEG: Vec2[] = [[0, 0], [66.9, 0], [124.9, 33.5]];

/** Web left round every boss and edge by a window (M2): the boss radius 11 plus 6 mm. */
const BOSS = 11;
const WEB = 6;
/** Window cutter radius (M5). */
const CUTTER = 4;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- A and B: no bridge. The rules' bridge, its posts and the sleeve up to it come out; the axle stops at the rocker ----
  for (const [pid, part] of [["pA", "upper-rocker"], ["pB", "lower-rocker"]] as const) {
    const brg = A.get(`${pid}-${part}-brg`)!;
    const s2 = A.get(`${pid}-axle-s2`)!;
    const zc = brg.z1;
    A.drop(new RegExp(`^${pid}-(bridge|sp-top)`));
    A.drop(`${pid}-axle-shim`);
    A.drop(`${pid}-axle-head`);
    A.drop(`${pid}-axle-s2`);
    ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== `${pid}-bridge-post`));
    const exA = brg.ex + 1.5;
    const G = { body: s2.body, at: s2.at, ex: exA, joints: [pid], group: `${pid}-axle`, mat: s2.mat };
    H.shaft(`${pid}-axle-up`, { d: 10, z0: s2.z0, z1: zc + 1.4, grooves: [zc] }, { ...G, name: "" }).forEach((s) => A.add(s));
    A.add(H.circlip(`${pid}-axle-cl`, 10, { body: s2.body, at: s2.at, z0: zc, z1: zc + 1, ex: exA, joints: [pid], name: "External circlip DIN 471, Ø10" }));
    for (const s of A.find(new RegExp(`^${pid}-axle(-s1)?$`))) s.ex = exA;
    A.set(`${pid}-axle`, { name: "Stub axle Ø10, shouldered, circlip groove, M8 thread through the base, M8 nyloc underneath" });
    // the bearing is sealed: no bridge above to oil it from
    if (brg.closure === "open")
      Object.assign(brg, { closure: "seal", name: bearingName(brg.d!, brg.D!, "seal", !!A.get(`${pid}-${part}-brg-fl`)), mat: "Bearing steel 100Cr6, rubber seals" });
  }

  // ---- D2, M2: one lightening window in the connector and in the leg: they swing, so their mass is inertia. The
  // biggest similar triangle that keeps WEB mm of web to every edge and boss ----
  const window = (id: string, tri: Vec2[]) => {
    const solid0 = A.get(id)!;
    const g: Vec2 = [(tri[0]![0] + tri[1]![0] + tri[2]![0]) / 3, (tri[0]![1] + tri[1]![1] + tri[2]![1]) / 3];
    for (let s = 0.8; s > 0.15; s -= 0.01) {
      const w = H.window(tri.map(([x, y]): Vec2 => [g[0] + (x - g[0]) * s, g[1] + (y - g[1]) * s]), CUTTER);
      const ok = w.every((p) => inside(solid0.outer, p) && edgeDist(solid0.outer, p) >= WEB - 0.01 && tri.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) >= BOSS + WEB - 0.01));
      if (ok) {
        solid0.holes.push(w);
        return;
      }
    }
  };
  window("connector", CONNECTOR);
  window("leg", LEG);

  locking.apply(ctx);
  materials.apply(ctx);

  // ---- F9: the crank's phase. An index line on the crank and a zero line on the base at crank angle 0 (C at (-20, 0),
  // toward the leg), with a tick every 90°: the crank goes back on the shaft in phase, so the foot lands where the
  // other leg of a pair expects it ----
  A.get("crank")!.marks.push({ kind: "index", pts: [[16, 0], [20, 0]] });
  const base = A.get("base")!;
  for (let q = 0; q < 4; q++) base.marks.push({ kind: "scale", pts: [polar(44, Math.PI + (q * Math.PI) / 2), polar(q ? 48 : 52, Math.PI + (q * Math.PI) / 2)] });
  (A.joint("pO").serves.F9 ??= []).push("crank", "base");
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO", {
    note: `${A.joint("pO").note} Support can only come from behind: the connector sweeps over this hub.`,
  });
  for (const [pid, who] of [["pA", "the leg sweeps over the axle"], ["pB", "the connector and the leg sweep over the axle"]] as const) {
    // the bridge's posts, spigots and oil sink are gone: what serves the locate, retain and thrust functions now
    const part = pid === "pA" ? "upper-rocker" : "lower-rocker";
    Object.assign(A.joint(pid).serves, { F2: [`${pid}-axle-cl`, `${pid}-${part}-cl0`], F4: [`${pid}-sp0-tw`] });
    delete A.joint(pid).serves.F1;
    delete A.joint(pid).serves.F8;
    A.joint(pid, {
      note: `Stub axle Ø10 shouldered into the base, M8 nyloc underneath. The rocker carries a sealed bearing between a circlip below and an external circlip on the axle end; ${who}, so there is no bridge: nothing stands above the rocker and the plate over it clears the axle end by 1.1 mm.`,
      badge: ["single shear", "warn"],
    });
  }
  A.joint("pC", {
    note: `${A.joint("pC").note} Single shear is forced: the connector sweeps over the crank's boss, so no clevis or bridge fits; the connector is plated low so the overhang is short.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pE", {
    note: `${A.joint("pE").note} Single shear: the connector rides over the lower rocker and nothing can stand above it at E. ${sz("pE-bolt")}.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pK", {
    note: `${A.joint("pK").note} The leg rides over the connector: single shear, the shortest overhang the stack allows.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pH", {
    note: `${A.joint("pH").note} The leg rides over the upper rocker: single shear, no plane above to carry a second plate.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Rockers lowest, leg on top", text: "The connector and the leg sweep over both rocker pivots, so the lower rocker takes the base plane, the connector and the upper rocker the next and the leg the one above: nothing stands above A and B and their axles are stubs." },
    { title: "Exact patent pose", text: "At crank angle 0 the crank points toward the leg, C at (-20, 0): the index line on the crank meets the zero line on the base and the foot is at the patent pose. Rebuild from there." },
    { title: "Spacers on inner races only", text: "Every bearing is clamped through its inner race, so tightening a bolt never squeezes a moving part." },
    { title: "Pair legs half a turn apart", text: "A walker takes a second leg, mirrored and set 180° out of phase: the zero line is the reference for both." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's, scaled from the patent coordinates; plating heights, outlines and hardware are designed around them." },
  );
};
