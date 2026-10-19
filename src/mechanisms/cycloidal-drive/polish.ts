// Overrides and additions to the generated cycloidal drive assembly (standard 5.2). The model has the housing plate, the
// eccentric cam (keyed to the input shaft), the disc, the output pins and the output flange; the rules build the input
// shaft's housing, key and bearings (the flange rides on the shaft on its own bearing, coaxial), the housing plate's
// posts and the drive. What differs from the rules:
// - the twelve ring pins, hardened Ø10 dowels pressed into the housing plate and held at their tops by a cover ring on
//   four tie standoffs (the pins are the polish's: as parts they would each get posts from the rules);
// - the bearing between the eccentric cam and the disc (6804, 20 x 32 x 7), held by an internal circlip each side of the disc;
// - the flange is a hub and six spokes, one through each output pin (M2), so the disc shows between them;
// - the six output pins pressed into the flange and each held by an M4 screw down its axis, four tapped holes in the
//   flange's hub for the load (the output);
// - notes, badges and build rules (A16).
import { circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { circlipInt } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { N, NOUT, R, Rr, Ro } from "./model";

const TAU = Math.PI * 2;
const OX = 72;
/** Tie standoffs between the housing plate and the cover ring: count, pitch circle radius. */
const TIES = { n: 4, R: 62 };
const OUT = { n: 4, M: 3, R: 14.5 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const housing = A.get("housing")!;
  const flange = A.get("flange")!;
  const disc = A.get("disc")!;
  const b1 = ctx.b1;

  // ---- the ring pins: twelve hardened Ø10 dowels from the housing plate up through the disc to the cover ring ----
  const zCover0 = flange.z1 + 4;
  const zCover1 = zCover0 + 6;
  const pins: string[] = [];
  const holeAt = (k: number): Vec2 => polar(R, (k * TAU) / N);
  for (let k = 0; k < N; k++) {
    const [x, y] = holeAt(k);
    housing.holes.push(circle(Rr, x + OX, y, 72));
    A.add(
      H.dowel(`rp${k}`, 2 * Rr, {
        name: k ? "" : `Ring pin Ø${2 * Rr}, hardened and ground, 12 off, pressed into the housing plate and the cover ring`,
        body: "ground",
        at: [x, y, 0],
        joints: ["ring-pins"],
        role: "ground",
        z0: housing.z0,
        z1: zCover1,
        ex: 0.5,
        group: "ring-pins",
      }),
    );
    pins.push(`rp${k}`);
  }
  const cover = H.plate("cover", H.disc(72), {
    name: "Cover ring, holds the ring pins at their tops",
    body: "ground",
    at: [0, 0, 0],
    role: "ground",
    holes: [H.disc(46), ...Array.from({ length: N }, (_, k) => circle(Rr, ...holeAt(k), 72))],
    z0: zCover0,
    z1: zCover1,
    ex: 3,
    joints: ["ring-pins"],
  });
  A.add(cover);
  for (let k = 0; k < TIES.n; k++) {
    const c = polar(TIES.R, ((k + 0.5) * TAU) / TIES.n) as Vec2;
    const G = { at: [c[0], c[1], 0] as [number, number, number], joints: ["ring-pins"] };
    housing.holes.push(circle(2.8, c[0] + OX, c[1], 20));
    cover.holes.push(circle(2.8, c[0], c[1], 20));
    A.add(H.standoff(`tie${k}`, { ...G, name: k ? "" : `Tie standoff Ø10 x ${(zCover0 - housing.z1).toFixed(0)}, M5, cover ring to housing plate`, outer: H.disc(5), D: 10, z0: housing.z1, z1: zCover0, ex: 1.5 }));
    A.add(H.screw(`tie${k}-top`, "button", 5, zCover1 - housing.z1 + 8, { ...G, face: zCover1, dir: -1, ex: 3.5 }));
    A.add(H.screw(`tie${k}-bot`, "button", 5, b1 - ctx.b0 + 8, { ...G, face: housing.z0, dir: 1, ex: -0.5 }));
  }

  // ---- M2: the flange is a hub and six spokes, one through each output pin, so the disc shows between them ----
  flange.holes.push(...H.spokes({ rIn: 15, rOut: 33, n: NOUT, half: 7.5, fillet: 4 }));
  flange.name = "Output flange, hub, rim and six spokes";

  // ---- the output pins: pressed into the flange, each held by an M4 down its axis ----
  const hubHoles = H.boltCircle(OUT.n, OUT.R, Math.PI / 4);
  for (const [x, y] of hubHoles) flange.marks.push({ kind: "thread", pts: circle(OUT.M / 2 - 0.2, x, y, 16) });
  for (let j = 0; j < NOUT; j++) {
    const g = (j * TAU) / NOUT;
    const [x, y] = polar(Ro, g) as Vec2;
    const pin = A.get(`op${j}`)!;
    flange.holes.push(circle(Rr, x, y, 72));
    A.set(`op${j}`, { z1: flange.z0 + 5, name: j ? "" : `Output pin Ø${2 * Rr}, hardened and ground, 6 off, pressed 5 mm into the flange, M4 down its axis`, mat: "Steel, hardened and ground" });
    A.add(H.screw(`op${j}-s`, "button", 4, flange.z1 - (pin.z0 + 2), { body: pin.body, at: [0, 0, 0], joints: [], face: flange.z1, dir: -1, ex: flange.ex + 1 }));
  }

  // ---- the bearing between the eccentric cam and the disc: 6804, a circlip each side of the disc ----
  const cl = circlipInt(32);
  const zb0 = disc.z0 + cl.s;
  A.add(
    H.bearing("disc-brg", { name: "6804", d: 20, D: 32, B: 7 }, { body: "disc", at: [0, 0, 0], joints: ["E"], z0: zb0, closure: "shield", ex: disc.ex }),
    H.circlip("disc-cl0", 32, { internal: true, body: "disc", at: [0, 0, 0], joints: ["E"], z0: disc.z0, z1: zb0, ex: disc.ex }),
    H.circlip("disc-cl1", 32, { internal: true, body: "disc", at: [0, 0, 0], joints: ["E"], z0: zb0 + 7, z1: zb0 + 7 + cl.s, ex: disc.ex }),
  );
  // ---- F8: the output pins slide in the disc's holes: an oil sink round each pin screw on the flange ----
  for (let j = 0; j < NOUT; j++) flange.marks.push(...H.oilSink(5.6, ...(polar(Ro, (j * TAU) / NOUT) as Vec2)));
  (A.joint("ring-pins").serves.F8 ??= []).push("flange");

  // ---- F9: no gear mesh, so the rules mark nothing: index lines on the housing at ring pin 1, on the disc at its zero line and on the cam at its
  // eccentric side, which line up at the assembly phase ----
  housing.marks.push({ kind: "timing", pts: [[R + OX + 12, 0], [R + OX + 18, 0]] });
  disc.marks.push({ kind: "timing", pts: [[R - 14, 0], [R - 8, 0]] });
  A.get("eccentric")!.marks.push({ kind: "timing", pts: [[5, 0], [9, 0]] });
  (A.joint("pO").serves.F9 ??= []).push("housing", "disc", "eccentric");
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("ring-pins", {
    title: "Ring pins",
    note: `Twelve hardened Ø${2 * Rr} pins on R ${R}, pressed into the housing plate and the cover ring, which four Ø10 tie standoffs hold ${(zCover0 - housing.z1).toFixed(0)} mm apart: the pins carry the disc's reaction in double support, the lobes roll on them, the output pins ride in the disc's holes.`,
    badge: ["double support", "ok"],
    serves: { F1: pins },
  });
  A.rules.push(
    { title: "Pins in, then the disc", text: "Press the ring pins into the housing plate, lay the disc over the eccentric cam with its bearing, then the flange with its pins in the disc's holes, then the cover ring over the pin tops and the tie standoffs." },
    { title: "Output pins one side only", text: "Each output pin touches its hole on one side, at 2 mm offset, because the holes are 2 mm wider than the pins: the disc's wobble is taken up and only its slow turn goes on to the flange." },
    { title: "Balance", text: "A single disc wobbles the shaft; a second disc on the opposite cam, 180° out of phase, cancels it. This model shows one disc, the catalogue's note." },
    { title: "Phase", text: "The input shaft is eleven turns to one output turn, the same eccentric phase every time: the key on the shaft fixes the cam, the flange's pin pattern is symmetric, so there is nothing to time but the cam against the pins." },
    { title: "Kinematics untouched", text: "The disc profile, the pin circle and the eccentricity are the model's; pins, plates, bearings and screws are fitted round them." },
  );
};
