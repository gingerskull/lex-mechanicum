// Overrides and additions to the generated spur gear assembly (standard 5.2). What differs from the rules:
// - straddle mounting (A9): nothing sweeps over the gears, so both shafts run up into a bridge on two spigoted posts in
//   the waist between the tip circles; each shaft gets a floating bearing there, the housing pair below still locates;
// - backlash (F7): the rules put the output housing on an eccentric bushing; with the shaft's top held by the bridge,
//   its top bearing sits in a second eccentric so both ends move together;
// - an output flange with four tapped holes on the output shaft above the bridge, where the load is coupled;
// - six spokes in the gear (M2), notes, badges and build rules (A16).
import { TAU, arcPts, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { headHeight } from "../../hardware/primitives";
import { housingBearing } from "../../hardware/sub/housing";
import { FLANGE, circlipInt, innerRingD, keyFor } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { cd, m, z2 } from "./model";

/** Backlash eccentricity, as the rules' bottom eccentric. */
const ECC = 0.3;
/** Output flange: Ø, thickness, tapped holes on their circle. */
const FL = { R: 17, t: 6, holes: 4, M: 4, pcd: 12 };
const SPOKES = 6;

/** Round every corner of a closed outline with radius r (convex and concave alike), for milled windows (M5). */
function fillet(P: Vec2[], r: number): Vec2[] {
  const out: Vec2[] = [];
  const n = P.length;
  for (let i = 0; i < n; i++) {
    const p = P[(i - 1 + n) % n]!;
    const c = P[i]!;
    const q = P[(i + 1) % n]!;
    const u: Vec2 = [p[0] - c[0], p[1] - c[1]];
    const v: Vec2 = [q[0] - c[0], q[1] - c[1]];
    const lu = Math.hypot(...u);
    const lv = Math.hypot(...v);
    const th = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (lu * lv))));
    const t = r / Math.tan(th / 2);
    if (th > Math.PI - 0.15 || t > 0.45 * Math.min(lu, lv)) {
      out.push(c);
      continue;
    }
    const a: Vec2 = [c[0] + (u[0] / lu) * t, c[1] + (u[1] / lu) * t];
    const b: Vec2 = [c[0] + (v[0] / lv) * t, c[1] + (v[1] / lv) * t];
    const bis: Vec2 = [u[0] / lu + v[0] / lv, u[1] / lu + v[1] / lv];
    const bl = Math.hypot(...bis);
    const h = r / Math.sin(th / 2);
    const C: Vec2 = [c[0] + (bis[0] / bl) * h, c[1] + (bis[1] / bl) * h];
    const a0 = Math.atan2(a[1] - C[1], a[0] - C[0]);
    let a1 = Math.atan2(b[1] - C[1], b[0] - C[0]);
    while (a1 - a0 > Math.PI) a1 -= TAU;
    while (a0 - a1 > Math.PI) a1 += TAU;
    out.push(...arcPts(C[0], C[1], r, a0, a1, Math.PI / 12));
  }
  return out;
}

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const gear = A.get("gear")!;
  const shafts = [
    { pin: ctx.pinJoint("p1")!, P: [0, 0] as Vec2, body: "pinion" },
    { pin: ctx.pinJoint("p2")!, P: [cd, 0] as Vec2, body: "gear" },
  ];

  // ---- the bridge over both shafts, above the gear hubs and their circlips ----
  const zMin = Math.max(...A.find((s) => s.kind === "circlipExternal" && /-cl-top$/.test(s.id)).map((s) => s.z1)) + 0.5;
  const outR = shafts.map((s) => housingBearing(s.pin.d).D / 2 + 3 + 5 + 1.5);
  const br = H.bridge(A, { id: "bridge", over: shafts.map((s) => s.P), zMin, joint: "p1", rBoss: Math.max(...outR) })!;
  br.bridge.joints.push("p2");
  const Zb = br.z1;

  for (const [k, s] of shafts.entries()) {
    const d = s.pin.d;
    const b = housingBearing(d);
    const out = k === 1;
    const at: [number, number, number] = [s.P[0], s.P[1], 0];
    const G = { at, joints: [s.pin.id], ex: br.bridge.ex };
    // the bearing seat: in the bridge for the input, in an eccentric bushing for the output
    let seatTop = Zb;
    if (out) {
      const Db = b.D + 6;
      // the bushing's offset bore sits on the shaft axis: the bushing itself is drawn ECC off it
      const bAt: [number, number, number] = [s.P[0] - ECC, s.P[1], 0];
      br.bridge.holes.push(H.disc(Db / 2 + 0.1, bAt[0], bAt[1]));
      A.add(H.solid("p2-top-ecc", { kind: "eccentric", name: "", mat: "Bronze CuSn8", outer: H.disc(Db / 2), holes: [H.disc(b.D / 2 + 0.05, ECC, 0)], at: bAt, z0: br.z0, z1: Zb, ex: br.bridge.ex, joints: ["p2"], group: "p2-top-ecc" }));
      const fl = H.eccentric("p2-top-ecc-fl", b.D, Db, ECC, { at: bAt, z0: Zb, z1: Zb + 2.5, ex: br.bridge.ex, joints: ["p2"], group: "p2-top-ecc", slots: [Math.PI / 2, -Math.PI / 2] });
      fl.name = `Eccentric bushing Ø${Db}, ${ECC} mm offset bore Ø${b.D}, flanged, top of the output shaft`;
      A.add(fl);
      const slotR = (Db + 10) / 2 - 2.6;
      for (const [i, a] of [Math.PI / 2, -Math.PI / 2].entries())
        A.add(H.screw(`p2-top-ecc-sc${i}`, "button", 3, 8, { at: [bAt[0] + slotR * Math.cos(a), bAt[1] + slotR * Math.sin(a), 0], face: Zb + 2.5, dir: -1, ex: br.bridge.ex, joints: ["p2"], name: i ? "" : undefined, qty: i ? 0 : 2 }));
      seatTop = Zb + 2.5;
    } else br.bridge.holes.push(H.disc(b.D / 2 + 0.15, ...s.P));
    // a flanged bearing, floating on the shaft: the housing pair below locates it
    const F = FLANGE(b);
    const zb0 = seatTop - b.B;
    A.add(H.bearing(`${s.pin.id}-top-brg`, b, { ...G, z0: zb0, z1: seatTop, flange: "top", name: `Bearing F${b.name}ZZ (${b.d}x${b.D}x${b.B}), floating`, seat: "flange on top, circlip below" }));
    const cl = circlipInt(b.D);
    A.add(H.circlip(`${s.pin.id}-top-cl`, b.D, { internal: true, ...G, z0: zb0 - cl.s, z1: zb0 }));
    (A.joint(s.pin.id).serves.F2 ??= []).push(`${s.pin.id}-top-brg`, `${s.pin.id}-top-cl`);
    // the shaft runs on up: through its bearing for the input, to the output flange for the output
    const segs = A.find((t) => t.group === `${s.pin.id}-shaft` && t.kind === "shaft");
    const top = segs.reduce((p, q) => (q.z1 > p.z1 ? q : p));
    top.marks = top.marks.filter((mk) => mk.kind !== "chamfer" && mk.kind !== "boreEntry");
    // the flange clears the bearing flange and the bushing's clamp screw heads
    const zFl = seatTop + Math.max(F.w, headHeight("button", 3)) + 0.6;
    const zTop = out ? zFl + FL.t : seatTop;
    A.add(H.shaft(`${s.pin.id}-shaft-up`, { d, z0: top.z1, z1: zTop }, { body: s.body, at: top.at, ex: top.ex, joints: [s.pin.id], group: `${s.pin.id}-shaft`, name: "" }));
    if (out) {
      // inner-race spacer, then the flange: keyed, held by a flush end screw, four tapped holes for the load
      const zf = zFl;
      A.add(H.spacer("p2-top-sp", d + 0.2, innerRingD(b), { body: s.body, at: top.at, z0: seatTop, z1: zf, ex: br.bridge.ex, joints: ["p2"] }));
      const key = keyFor(d)!;
      const holes = H.boltCircle(FL.holes, FL.pcd, Math.PI / 4);
      A.add(H.plate("output-flange", H.disc(FL.R), {
        name: `Output flange Ø${2 * FL.R}, keyed, ${FL.holes} x M${FL.M} tapped for the load`,
        role: "output",
        body: s.body,
        at: top.at,
        z0: zf,
        z1: zf + FL.t,
        ex: br.bridge.ex + 1,
        holes: [H.disc(d / 2 + 0.01)],
        marks: [...holes.map(([x, y]) => ({ kind: "thread" as const, pts: H.disc(FL.M / 2 + 0.45, x, y) })), { kind: "keyway", pts: [[d / 2 - 1, -key.b / 2], [d / 2 + key.h - key.t1, -key.b / 2], [d / 2 + key.h - key.t1, key.b / 2], [d / 2 - 1, key.b / 2]] }],
        joints: ["p2"],
        mat: "Steel C45, black oxide",
      }));
      for (const [x, y] of holes) A.get("output-flange")!.holes.push(H.disc(FL.M / 2, x, y));
      A.add(H.key("p2-flange-key", key.b, FL.t, { body: s.body, at: top.at, outer: [[d / 2 - key.t1, -key.b / 2], [d / 2 - key.t1 + key.h, -key.b / 2], [d / 2 - key.t1 + key.h, key.b / 2], [d / 2 - key.t1, key.b / 2]], z0: zf, z1: zf + FL.t, ex: br.bridge.ex + 1, joints: ["p2"] }));
      A.add(H.screw("p2-flange-end", "csk", 6, 14, { body: s.body, at: top.at, face: zf + FL.t, dir: -1, ex: br.bridge.ex + 1.5, joints: ["p2"], headTop: true, name: "Countersunk M6 x 14 (ISO 10642), into the shaft end, flush" }));
      (A.joint("p2").serves.F3 ??= []).push("p2-flange-key");
      (A.joint("p2").serves.F2 ??= []).push("p2-flange-end");
      (A.joint("mesh-pinion-gear").serves.F7 ??= []).push("p2-top-ecc-fl");
    }
  }

  // ---- M2: six spokes; the rim keeps 2 modules under the tooth roots, the hub 8 mm round the bore ----
  const rRoot = (m * z2) / 2 - 1.25 * m;
  const rOut = rRoot - 2 * m;
  const rIn = shafts[1]!.pin.d / 2 + 4.5 + 8;
  const half = 4;
  for (let k = 0; k < SPOKES; k++) {
    const a0 = (k * TAU) / SPOKES + Math.PI / SPOKES;
    const a1 = a0 + TAU / SPOKES;
    const e0 = Math.asin(half / rIn);
    const f0 = Math.asin(half / rOut);
    const win = [...arcPts(0, 0, rOut, a0 + f0, a1 - f0, Math.PI / 40), ...arcPts(0, 0, rIn, a1 - e0, a0 + e0, Math.PI / 40)];
    gear.holes.push(fillet(win, 3));
  }
  H.boreChamfers(br.bridge);
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("p1", { note: `${A.joint("p1").note} Straddle mounted: the shaft runs on up into a floating bearing in the bridge, so the pinion is carried on both sides.` });
  A.joint("p2", { note: `${A.joint("p2").note} Straddle mounted like the input; its top bearing sits in an eccentric bushing in the bridge, turned with the one under the housing so the shaft stays upright when the backlash is set. Above the bridge, a keyed flange with four M${FL.M} tapped holes takes the load.` });
  A.joint("mesh-pinion-gear", { note: `${A.joint("mesh-pinion-gear").note} Both ends of the output shaft sit on eccentrics (bottom and top), set together.` });
  A.rules.push(
    { title: "Carried on both sides", text: "Nothing sweeps over the gears, so each shaft runs from its housing below to a floating bearing in the bridge above: no overhung gear." },
    { title: "One end locates, the other floats", text: "The housing pair locates each shaft axially; the bridge bearings slide on their shafts, so the three bearings never fight." },
    { title: "Backlash set at both ends", text: "Eccentric bushings under the output housing and in the bridge are turned together to set the backlash, then clamped." },
    { title: "Marked to go back in phase", text: "Match marks on the two teeth that meet at the line of centres." },
    { title: "Kinematics untouched", text: "Tooth profiles, pitch circles and the centre distance are the model's; hubs, spokes and the flange are designed round them." },
  );
};
