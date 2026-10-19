// Polish of the desmodromic cam (standard 5.2): hardened rings and pads (M14), the camshaft straddled (A9), the collar, seat and
// fork fittings, oilers (F8), the drive's cable clip moved off the bracket (V6), notes and build rules (A16).
import { arcPts, circle, offsetPoly, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { straddle } from "../../rules/j2-straddle";
import { cutArc } from "./geometry";
import { G0, L, base2, collarX0, collarX1, headR, lobeClose, lobeOpen, phi1, phi2, rr, rt, seatX, stemW } from "./model";

const D2R = Math.PI / 180;
const HARD = "Tool steel O1, hardened 58 HRC";
const TRACK = 4;
const PAD = 4;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const lo = A.get("rockerClose")!;
  const hi = A.get("forkUpper")!;
  const cLo = A.get("collarLo")!;
  const cHi = A.get("collarHi")!;
  const valve = A.get("valve")!;

  // A9: the camshaft straddled; the plain shaft above the top lobe starts at the lobe's top face
  straddle(ctx, [ctx.pinJoint("pO")!]);
  A.set("pO-shaft", { z1: A.get("lobeOpen")!.z1 });
  A.set("pO-shaft-up", { z0: A.get("lobeOpen")!.z1 });

  // M14: each lobe's track a hardened ring screwed into the rim (its outside is the profile, K1); windows in the big lobe
  for (const id of ["lobeOpen", "lobeClose"]) {
    const cam = A.get(id)!;
    const track = cam.outer;
    const body = offsetPoly(track, -TRACK);
    cam.outer = body;
    const G = { body: id, z0: cam.z0, z1: cam.z1, ex: cam.ex, joints: [`cam-${id}`], role: cam.role };
    A.add(H.wearStrip(`${id}-track`, track, { ...G, holes: [body], mat: HARD, name: `Track insert, hardened ring ${TRACK} mm deep, 8 x M2 csk` }));
    for (let i = 0; i < 8; i++) {
      const k = Math.floor(((i + 0.5) * track.length) / 8);
      const [a, b] = [track[k]!, body[k]!];
      A.add(H.screw(`${id}-track-sc${i}`, "csk", 2, 5, { body: id, at: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], face: cam.z1, dir: -1, ex: cam.ex, joints: G.joints, name: i ? "" : undefined, qty: i ? 0 : 8 }));
    }
    H.boreChamfers(cam);
  }
  A.get("lobeClose")!.holes.push(...H.spokes({ rIn: 14, rOut: base2 - TRACK - 4, n: 5, half: 4, fillet: 3 }));

  // M14: each shoe a hardened pad screwed into the cam arm, over the arc the lobe touches (30° to 130°)
  for (const [id, phi, s] of [["rockerOpen", phi1, 1], ["rockerClose", phi2, -1]] as const) {
    const rk = A.get(id)!;
    const f = phi - Math.PI / 2;
    const c = polar(L, f);
    const [a0, a1] = s > 0 ? [30 * D2R, 130 * D2R] : [-130 * D2R, -30 * D2R];
    rk.outer = cutArc(rk.outer, c, rr, f, a0, a1, PAD);
    const j = `cam-${id === "rockerOpen" ? "lobeOpen" : "lobeClose"}`;
    A.add(H.wearStrip(`${id}-shoe`, [...arcPts(c[0], c[1], rr, f + a0, f + a1, 3 * D2R), ...arcPts(c[0], c[1], rr - PAD, f + a1, f + a0, 3 * D2R)], { body: id, z0: rk.z0, z1: rk.z1, ex: rk.ex, joints: [j], role: rk.role, mat: HARD, name: `Shoe pad, hardened, ${PAD} mm deep, 2 x M2 csk` }));
    for (const [i, t] of [a0 + 25 * D2R, a1 - 25 * D2R].entries()) {
      const p = polar(rr - PAD / 2, f + t, c[0], c[1]);
      A.add(H.screw(`${id}-shoe-sc${i}`, "csk", 2, 5, { body: id, at: [p[0], p[1], 0], face: rk.z1, dir: -1, ex: rk.ex, joints: [j], name: i ? "" : undefined, qty: i ? 0 : 2 }));
    }
  }
  for (const id of ["rockerOpen", "rockerClose", "forkUpper"]) A.set(id, { mat: "Steel 16MnCr5, case-hardened" });

  // the valve: collar halves clamped on two bolts through sleeves, a cross dowel; the stem's end is hardened
  valve.mat = "Steel 16MnCr5, case-hardened";
  const xc = (collarX0 + collarX1) / 2 - G0;
  valve.holes.push(H.disc(1.5, xc, 0));
  const vG = { body: "valve", ex: valve.ex, joints: ["valve-collar"] };
  for (const c of [cLo, cHi]) {
    c.holes.push(H.disc(1.5, xc, 0), ...[9.5, -9.5].map((y) => H.disc(1.8, xc, y)));
    c.mat = "Steel 16MnCr5, case-hardened";
    c.joints.push("valve-collar");
  }
  cLo.name = "Collar half, lower, 12 x 30 x 4.5, case-hardened";
  cHi.name = "Collar half, upper";
  A.add(H.dowel("collar-dowel", 3, { ...vG, at: [xc, 0, 0], z0: cLo.z0 + 1, z1: cHi.z1 - 1, name: "Cross dowel Ø3 h6 (ISO 8734), collar to stem" }));
  for (const [i, y] of [9.5, -9.5].entries()) {
    A.add(H.tube(`collar-sleeve${i}`, 3.2, 7, { ...vG, at: [xc, y, 0], z0: valve.z0, z1: valve.z1 - 0.1, name: i ? "" : "Clamp sleeve Ø7 x 6.9, steel", qty: i ? 0 : 2 }));
    A.add(H.screw(`collar-sc${i}`, "button", 3, cHi.z1 - cLo.z0 - 1, { ...vG, at: [xc, y, 0], face: cHi.z1, dir: -1, ex: hi.ex, name: i ? "" : undefined, qty: i ? 0 : 2 }));
  }

  // the fork: a hardened Ø10 pad on each nose reaching in to the collar's face, a post tying the plates
  for (const [k, pl, face, dir, z0, z1] of [["lo", lo, lo.z0, 1, lo.z1, cLo.z0 + 3], ["hi", hi, hi.z1, -1, cHi.z1 - 3, hi.z0]] as const) {
    const G = { body: "rockerClose", ex: pl.ex, joints: ["valve-collar"] };
    A.add(H.wearStrip(`nose-pad-${k}`, H.disc(rt), { ...G, at: [L, 0, 0], role: "link", mat: HARD, z0, z1, name: k === "lo" ? "Nose pad Ø10 x 5, hardened, on an M3 csk screw" : "", qty: k === "lo" ? 2 : 0 }));
    A.add(H.screw(`nose-pad-${k}-sc`, "csk", 3, 8, { ...G, at: [L, 0, 0], face, dir, name: "" }));
  }
  const T = { body: "rockerClose", at: [11, 0, 0] as [number, number, number], joints: ["pQ2"] };
  A.add(H.standoff("fork-tie", { ...T, outer: H.disc(3.5), D: 7, z0: lo.z1, z1: hi.z0, ex: lo.ex, span: [lo.ex, hi.ex], role: "link", name: "Fork tie Ø7, steel, between the plates", mat: "Steel C45, black oxide" }));
  A.add(H.screw("fork-tie-hi", "button", 3, hi.z1 - lo.z1 + 4, { ...T, face: hi.z1, dir: -1, ex: hi.ex, name: "" }), H.screw("fork-tie-lo", "button", 3, hi.z0 - lo.z0 + 4, { ...T, face: lo.z0, dir: 1, ex: lo.ex, name: "" }));

  // F5, closing: two hardened seat blocks screwed to the base, their faces the head's cone with the valve shut
  for (const s of [1, -1] as const) {
    const f = [[seatX - 9, s * (stemW / 2 + 0.4)], [seatX, s * (headR + 0.4)]] as Vec2[];
    const id = `valve-seat${s > 0 ? 0 : 1}`;
    A.add(H.plate(id, [f[0]!, f[1]!, [seatX, s * (headR + 9)], [seatX - 21, s * (headR + 9)], [seatX - 21, f[0]![1]]], { z0: A.b1, z1: valve.z1, ex: 1, role: "ground", mat: HARD, joints: ["valve-seat"], name: s > 0 ? "Valve seat insert, hardened, two halves, 2 x M3 csk each" : "", qty: s > 0 ? 2 : 0 }));
    for (const [k, dx] of [-8, -4].entries()) A.add(H.screw(`${id}-sc${k}`, "csk", 3, valve.z1 - A.b1 + 4, { at: [seatX - 9 + dx, s * (headR + 4), 0], face: valve.z1, dir: -1, ex: 1, joints: ["valve-seat"], name: "" }));
  }

  // F8: a felt oiler on each lobe's track at its highest point, on a holder screwed to the base
  const o = A.pin("pO")!;
  for (const [id, pts] of [["lobeOpen", lobeOpen], ["lobeClose", lobeClose]] as const) {
    const cam = A.get(id)!;
    const rMax = Math.max(...pts.map(([x, y]) => Math.hypot(x, y)));
    const G = { joints: [`cam-${id}`], ex: cam.ex };
    for (let k = 0; k < 48; k++) {
      const a = -Math.PI / 2 + Math.ceil(k / 2) * (k % 2 ? 0.2 : -0.2);
      const p = polar(rMax + 3.1, a, o[0], o[1]);
      if (ctx.clearance(p, 7, A.b1, cam.z1) < 0.5) continue;
      const q = polar(rMax + 9.8, a, o[0], o[1]);
      A.add(H.plate(`${id}-oiler-holder`, H.disc(5, q[0], q[1]), { ...G, name: "Oiler holder, screwed to the base", z0: A.b1, z1: cam.z1 }), H.felt(`${id}-oiler`, circle(2.5, p[0], p[1], 20), { ...G, z0: cam.z0 + 0.5, z1: cam.z1 - 0.5 }));
      A.add(H.screw(`${id}-oiler-sc`, "socket", 3, 8, { at: [q[0], q[1], 0], face: cam.z1, dir: -1, ex: cam.ex, joints: G.joints }));
      (A.joint(`cam-${id}`).serves.F8 ??= []).push(`${id}-oiler`);
      break;
    }
  }

  // V6: the cable clip lands on the motor bracket's flange: slide it, with its screw, along its lead to a clear spot
  const lead = A.get("drive-lead0");
  const wall = A.get("drive-wall");
  if (lead && wall) {
    const n = lead.outer.length / 2;
    for (let i = 0; i + 1 < n; i++) {
      const [a, b] = [0, 1].map((k) => [(lead.outer[i + k]![0] + lead.outer[2 * n - 1 - i - k]![0]) / 2, (lead.outer[i + k]![1] + lead.outer[2 * n - 1 - i - k]![1]) / 2]) as [Vec2, Vec2];
      const p: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 8 || Math.hypot(p[0] - wall.at[0], p[1] - wall.at[1]) < 33) continue;
      A.set("drive-clip", { at: [p[0], p[1], Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2] });
      for (const id of ["drive-clip-sc", "drive-clip-sc-sh"]) A.set(id, { at: [p[0], p[1], 0] });
      break;
    }
  }
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // A16
  A.joint("pQ1", { note: `${A.joint("pQ1").note} The closing lobe, 38 in radius, turns under this pivot with 4.6 mm to spare, so no axle rises from the base: the stud hangs from its bridge into the rocker alone.` });
  A.joint("pQ2", { note: `${A.joint("pQ2").note} A clevis: two plates round the stem and collar on one axle, tied by a post.`, badge: ["double shear", "ok"] });
  A.joint("valve-collar", { type: "post", at: [collarX0 + 6, 0], title: "Collar · Valve", note: "Two 4.5 mm halves clamp the stem on two M3 bolts through sleeves, a Ø3 cross dowel locating them; the fork's plates bear on its face through a hardened pad each, from above and below.", badge: ["double shear", "ok"], serves: { F1: ["collar-dowel"], F2: ["collar-sc0"] } });
  A.joint("valve-seat", { type: "stop", at: [seatX, 0], title: "Stop · Valve seat", note: "Two hardened blocks screwed to the base, their faces the head's cone: the valve shuts on them and the fork holds it there.", badge: ["hard stop", "ok"], serves: { F5: ["valve-seat0"] } });
  for (const id of ["cam-lobeOpen", "cam-lobeClose"]) A.joint(id, { note: `The shoe, radius ${rr}, rides its lobe with 0.1 mm of lash at every angle: the lobe is its envelope. Ring and pad are hardened and screwed in, so wear is replaced by changing them.`, badge: ["conjugate lobe", "ok"] });
  A.rules.push(
    { title: "Two lobes, one valve", text: "The opening lobe pushes the stem's end, the closing lobe pulls the collar through its fork: no return spring." },
    { title: "Each lobe is its shoe's envelope", text: "Each rocker is 0.1 mm from its lobe at every angle: set the lash by the shoe pad's thickness." },
    { title: "Fork round the stem", text: "Two plates on one axle with the stem and collar between; pads reach in from both sides, so the pull is straight." },
    { title: "Kinematics untouched", text: "Lobes, shoes, noses and the valve's faces are the model's; pads, rings and screws are cut behind them." },
  );
};
