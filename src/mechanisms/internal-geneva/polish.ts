// Overrides and additions to the generated internal Geneva assembly (standard 5.2). The rules read the hung stud and the
// roller axles; the slot plate, locking plate and the crank's roller stud are not joints they know, so they are built here.
import { circle, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { Rc, ROLLER_ANGLES, ROLLER_R, RIM, a, c, cavity, hw, n, rs } from "./model";

const STRIP = 1.5;
/** Roller stud bore and the roller's outside Ø. */
const STUD = 4;
const ROLLER_D = 2 * hw - 0.3;
/** Roller flange and retaining ring: radius, thicknesses, screws. */
const FL = { R: ROLLER_R + 3, t: 1.5, top: 1.2, screws: 3, M: 2, pcd: 11.2 };
/** Spacers between the plates: radius, Ø, screw M and length. */
const SP = { R: 73, D: 8, M: 4, L: 16 };
/** Output: tapped holes on the locking plate's rim. */
const OUT = { M: 3, R: 83 };
const step = (2 * Math.PI) / n;
const bis = (k: number) => k * step + step / 2;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const wheel = A.get("wheel")!;
  const lock = A.get("lock")!;
  const crank = A.get("crank")!;
  const knob = A.get("knob")!;

  A.drop(/^pP-/);
  const pPj = A.joint("pP");
  pPj.serves = {};

  // ---- slots: relieved behind wear strips (M14), felts in the slot ends (F8) ----
  wheel.holes[0] = cavity(hw + STRIP);
  const root = c + a;
  const xm = Math.sqrt(Rc * Rc - (hw + STRIP + 1.2) ** 2) + 1.2;
  const G = { body: "wheel", at: [0, 0, 0] as [number, number, number], ex: wheel.ex, joints: ["pP"], z0: wheel.z0, z1: wheel.z1 };
  const rot = (p: Vec2, th: number): Vec2 => [p[0] * Math.cos(th) - p[1] * Math.sin(th), p[0] * Math.sin(th) + p[1] * Math.cos(th)];
  const lenW = root - xm;
  for (let k = 0; k < n; k++) {
    const th = k * step;
    for (const sg of [1, -1]) {
      const i = 2 * k + (sg > 0 ? 0 : 1);
      const strip: Vec2[] = [[xm, hw + 1.2], [xm, hw + STRIP], [root, hw + STRIP], [root, hw], [xm + 1.2, hw]];
      const P = strip.map(([x, y]) => rot([x, sg * y], th));
      A.add(H.wearStrip(`pP-ws${i}`, P, { ...G, name: i ? "" : `Wear strip ${lenW.toFixed(1)} x ${STRIP}, hardened, 2 x M2 csk`, qty: i ? 0 : 2 * n }));
      for (const f of [0.2, 0.8]) {
        const p = rot([root - lenW * f, sg * (hw + STRIP + 0.7)], th);
        A.add(H.screw(`pP-ws${i}-sc${f * 10}`, "csk", 2, 5, { body: "wheel", at: [p[0], p[1], 0], face: wheel.z1, dir: -1, ex: wheel.ex, joints: ["pP"], name: "" }));
      }
    }
    const rEnd = hw + STRIP - 0.1;
    const brush = ROLLER_D / 2 - 0.25;
    const t0 = Math.acos(brush / rEnd);
    const pts: Vec2[] = [];
    for (let q = 0; q <= 16; q++) pts.push(rot(polar(rEnd, -t0 + (2 * t0 * q) / 16, root, 0), th));
    A.add(H.felt(`pP-felt${k}`, pts, { ...G, name: k ? "" : "Felt oiler, oil-soaked wool felt", qty: k ? 0 : n, z0: wheel.z0 + 1, z1: wheel.z1 - 1, allow: ["pP-roller"] }));
  }
  pPj.serves.F8 = Array.from({ length: n }, (_, k) => `pP-felt${k}`);

  // ---- the roller stud: collar under the crank, roller under a circlip, M3 end through the crank into the knob ----
  const zc = crank.z0;
  const S = { body: "crank", at: [a, 0, 0] as [number, number, number], joints: ["pP"], ex: crank.ex - 0.5 };
  const zr0 = wheel.z0 + 0.4;
  const zr1 = wheel.z1 - 0.4;
  const zk = knob.z1;
  A.add(
    H.shaft("pP-stud", { d: STUD, z0: wheel.z0, z1: zk, shoulders: [{ z: zc - 1.6, D: 6.5, h: 1.6 }], grooves: [wheel.z0], thread: { M: 3, z0: zc + 0.75, z1: zk } }, {
      ...S,
      name: `Roller stud Ø${STUD}, collar Ø6.5, M3 thread, circlip groove`,
    }),
  );
  A.add(H.roller("pP-roller", STUD, ROLLER_D, { ...S, z0: zr0, z1: zr1, group: "pP-stud", name: `Track roller Ø${ROLLER_D.toFixed(1)} on Ø${STUD} stud, sealed` }));
  A.add(H.circlip("pP-clip", STUD, { ...S, z0: wheel.z0, z1: wheel.z0 + 0.4, group: "pP-stud", name: `External circlip DIN 471, Ø${STUD}` }));
  A.add(H.tube("pP-sp", STUD + 0.2, 6.5, { ...S, z0: zr1, z1: zc - 1.6, group: "pP-stud", name: `Spacer sleeve ${STUD + 0.2}x6.5` }));
  // the rules' bolt seats come out of the crank and knob
  const nearP = (h: Vec2[]) => Math.max(...h.map((p) => Math.hypot(p[0] - a, p[1]))) < 12;
  crank.holes = crank.holes.filter((h) => !nearP(h));
  crank.marks = crank.marks.filter((m) => !((m.kind === "boreEntry" || m.kind === "thread") && nearP(m.pts)));
  crank.holes.push(circle(1.7, a, 0, 24));
  H.boreChamfers(crank);
  knob.holes = [circle(1.5, 0, 0, 24)];
  knob.marks = knob.marks.filter((m) => m.kind === "boss");
  knob.marks.push({ kind: "thread", pts: circle(1.5 + 0.45, 0, 0, 24) });
  Object.assign(knob, { name: "Handle knob Ø14 x 12, phenolic, M3 brass insert, on the roller stud", mat: "Phenolic, black", accent: true, headTop: true, joints: ["pP"] });
  pPj.serves.F2 = ["pP-clip", "pP-stud"];
  pPj.serves.F4 = ["pP-sp"];
  pPj.serves.F8 = [...pPj.serves.F8, "pP-roller"];

  // ---- the rules' bridge stood over the pin's own head, dropped above: lower the hung pivot's bridge group onto the knob ----
  const dz = knob.z1 + 1 - A.get("pO-bridge")!.z0;
  for (const t of A.find(/^pO-(bridge|bridge-post\d-(spigot|top|top-sh)|uw|nut|axle-s[34])$/)) Object.assign(t, { z0: t.z0 + dz, z1: t.z1 + dz });
  for (const t of A.find(/^pO-(bridge-post\d|sp0|axle-s2)$/)) t.z1 += dz;
  const post0 = A.get("pO-bridge-post0")!;
  post0.name = post0.name.replace(/x [\d.]+/, `x ${+(post0.z1 - ctx.b1).toFixed(1)}`);
  const fix = (j: string, re: RegExp) => (A.joint(j).note = A.joint(j).note.replace(re, (_, v, r) => `${+(+v + dz).toFixed(1)}${r}`));
  fix("pO", /([\d.]+)( mm of sleeve)/);
  fix("pO-bridge-post", /([\d.]+)( mm, where)/);

  // ---- M14: the locking arc is a replaceable hardened segment on the crank ----
  H.lockingSegment(A, crank, { r: rs, depth: 4, joint: "pO" });

  // ---- A11, F1: the plates join on four spacers and screws, two dowels ----
  const zs0 = wheel.z1;
  const zs1 = lock.z0;
  for (let k = 0; k < n; k++) {
    const [x, y] = polar(SP.R, bis(k));
    A.add(H.tube(`wheel-sp${k}`, SP.M + 0.4, SP.D, { body: "wheel", at: [x, y, 0], z0: zs0, z1: zs1, ex: wheel.ex + 0.5, joints: ["pW-join"], name: k ? "" : `Spacer sleeve ${SP.M + 0.4}x${SP.D}` }));
    A.add(H.screw(`wheel-sc${k}`, "csk", SP.M, SP.L, { body: "wheel", at: [x, y, 0], face: lock.z1, dir: -1, ex: lock.ex, joints: ["pW-join"], name: k ? "" : undefined, qty: k ? 0 : n }));
  }
  const dow: [Vec2, boolean][] = [[polar(SP.R, bis(0) + 0.2), false], [polar(SP.R, bis(2) + 0.2), true]];
  dow.forEach(([p, slotted], i) => {
    A.add(H.dowel(`wheel-dw${i}`, 4, { body: "wheel", at: [p[0], p[1], 0], z0: wheel.z1 - 3, z1: lock.z0 + 3, ex: wheel.ex + 0.5, joints: ["pW-join"], name: i ? "" : "Dowel pin Ø4 h6 (ISO 8734)", qty: i ? 0 : 2 }));
    wheel.holes.push(circle(2, p[0], p[1], 20));
    // the second dowel sits in a slot, so the plates go back square (F1)
    const u = polar(1, bis(2) + 0.2 + Math.PI / 2);
    lock.holes.push(slotted ? roundedPoly([[p[0] - u[0], p[1] - u[1]], [p[0] + u[0], p[1] + u[1]]], 2) : circle(2, p[0], p[1], 20));
  });
  A.joint("pW-join", { type: "post", at: polar(SP.R, bis(0)), title: "Plate join · slot and locking plates", note: `Four Ø${SP.D} spacers, ${(zs1 - zs0).toFixed(0)} mm, four countersunk M${SP.M} into the slot plate; two Ø4 dowels, a round hole and a slot, put the plates back square.`, badge: ["one rigid wheel", "ok"], serves: { F1: ["wheel-dw0", "wheel-dw1"], F2: ["wheel-sc0"] } });

  // ---- M2: lobe windows in the slot plate, WEB mm from every working surface (the largest that fit, found once) ----
  const win = H.window([polar(42, bis(0)), polar(66, bis(0) - 0.5), polar(66, bis(0) + 0.5)], 3);
  for (let k = 0; k < n; k++) wheel.holes.push(win.map((p) => rot(p, k * step)));

  // ---- F9: station dots and an index line ----
  for (let k = 0; k < n; k++) for (let i = 0; i <= k; i++) lock.marks.push({ kind: "timing", pts: circle(0.8, ...polar(66, bis(k) + (i - k / 2) * 0.05), 10) });
  A.get("base")!.marks.push({ kind: "timing", pts: [[RIM + 3, 0], [RIM + 7, 0]] });

  for (let k = 0; k < n; k++) lock.marks.push({ kind: "thread", pts: circle(OUT.M / 2 + 0.45, ...polar(OUT.R, k * step), 20) });
  lock.name = `Locking plate, ${n} x M${OUT.M} tapped for the load`;

  // ---- F2, F4: each roller flanged under the plate, captured over it ----
  ROLLER_ANGLES.forEach((_, k) => {
    const id = `pR${k}`;
    const roller = A.get(`roller${k}`)!;
    const R = { body: `roller${k}`, at: [0, 0, 0] as [number, number, number], joints: [id], role: roller.role, mat: "Steel C45, case hardened" };
    const bore = 8;
    A.add(
      H.plate(`${id}-flange`, H.disc(FL.R), { ...R, name: `Roller flange Ø${2 * FL.R}, ${FL.t} mm`, holes: [H.disc(bore)], z0: roller.z0 - FL.t, z1: roller.z0, ex: roller.ex, kind: "retainerPlate" }),
      H.plate(`${id}-cap`, H.disc(FL.R), { ...R, name: `Roller retaining ring Ø${2 * FL.R}, ${FL.top} mm`, holes: [H.disc(9.1)], z0: wheel.z1, z1: wheel.z1 + FL.top, ex: roller.ex, kind: "retainerPlate" }),
    );
    for (let i = 0; i < FL.screws; i++) {
      const [x, y] = polar(FL.pcd, (i * 2 * Math.PI) / FL.screws + Math.PI / 6) as Vec2;
      A.add(H.screw(`${id}-cap-s${i}`, "csk", FL.M, 6, { ...R, at: [x, y, 0], face: wheel.z1 + FL.top, dir: -1, ex: roller.ex }));
    }
  });

  H.boreChamfers(wheel);
  H.boreChamfers(lock);
  locking.apply(ctx);
  materials.apply(ctx);
  for (const s of [wheel, lock]) s.mat = "Aluminium 6061-T6, hard anodised";
  ctx.rule = rule;

  // ---- A16 ----
  pPj.note = `Track roller Ø${ROLLER_D.toFixed(1)} on a Ø${STUD} stud hung from the crank: collar, spacer, roller, circlip; the M3 end passes the crank into the knob. Hardened wear strips on every slot wall, a felt in each slot end. Overhung, single shear.`;
  pPj.badge = ["single shear", "warn"];
  A.joint("pO", { note: `${A.joint("pO").note} Nothing rises from the base: the wheel passes over this point.` });
  A.joint("drive", { title: "Drive · hand operated", note: "Hand operated: a motor would need a shaft from the base at the crank axis, through the wheel (K6).", badge: ["hand operated", "ok"] });
  ROLLER_ANGLES.forEach((_, k) => {
    const j = A.joint(`pR${k}`);
    j.note = `${j.note} The roller runs on the plate's rim (Ø${2 * RIM}); a ${FL.t} mm flange under it and a ${FL.top} mm ring over it, 3 x M${FL.M} csk, capture the plate.`;
    j.badge = ["ring carried and captured", "ok"];
  });
  A.rules.push(
    { title: "The ring has no centre", text: "The crank axis lies in the wheel's material, so no shaft may cross it: the wheel is a ring on three flanged rollers, the crank hangs from a bridge." },
    { title: "Two plates, one wheel", text: "The slot plate takes the roller; the locking plate lies in the crank's plane, cut to its swept shape 1 mm clear. Spacers, screws and dowels make one wheel." },
    { title: "Hard where it wears", text: "Screwed, hardened strips in the slots and a screwed segment on the crank: replace those, not the plates." },
    { title: "Bridge last", text: "Rollers and ring, then the crank on its stud with the knob, then the bridge on its posts in the wheel's opening, then the nut." },
    { title: "Kinematics untouched", text: "Slot walls, crank, sector and swept opening are the model's; strips, segment, windows and screws go round them." },
  );
};
