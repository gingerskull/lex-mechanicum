// Overrides and additions to the generated friction wheel drive (standard 5.2). The rules give the disc an input shaft
// in a housing behind the base with the motor under it (J2, V1 to V6), the wheel's hex sleeve a shaft in plan in two
// pillow blocks past the disc's rim (J10), and the shift carriage its slide with gib, keeper, wipers, nipple and end
// stops (J5). No rule knows a friction contact (AUTO-TODO, promotion candidate), so the polish builds it:
// - the wheel split into an aluminium centre on a hub and five arms and a bonded rubber tyre (M2, M10), the hub's
//   groove for the fork, the sleeve held on the shaft between two circlips (F2);
// - the contact force: the disc slides on its key, pressed up onto the tyre by four disc springs on a seat collar,
//   set by a shim (F4, F6, F7), in place of the rule's spacer under the disc;
// - the shift: a post on the carriage carries the fork, screwed to it by the knob's stud; index ticks on the base at
//   the ratio stations and a pointer on the carriage (F9);
// - the posed wheel and fork are cleared of the shaft by the box test only: their bores are allowed round it;
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { roundRect, type Vec2 } from "../../core/geom";
import type { Solid } from "../../hardware/solid";
import { FORK, FORK_BAR, FORK_R, RT, RW, TW, Y_SLIDE, ZC, radius } from "./model";

const CONTACT = "contact-wheel-disc";
/** Hub and neck radii round the hex bore, mm. */
const HUB = 15;
const NECK = FORK_R[0] - 0.5;

export const polish: Polish = (A, H) => {
  const wheel = A.get("wheel")!;
  const disc = A.get("disc")!;
  const carriage = A.get("carriage")!;
  const fork = A.get("fork")!;
  const bore = wheel.holes[0]!;
  const P = { axis: "p" as const, frame: "W", body: "wheel", at: [0, 0, 0] as [number, number, number], ex: wheel.ex, joints: [CONTACT] };

  // ---- the wheel: aluminium centre on a hub and five arms (it reverses), bonded tyre, hub with the fork's groove ----
  A.set("wheel", { outer: H.disc(RT), name: `Wheel centre Ø${2 * RT} x ${TW}, hub and five arms`, holes: [bore, ...H.spokes({ rIn: HUB + 1.5, rOut: RT - 4, n: 5, half: 3.5, fillet: 1.5 })] });
  const tyre = H.solid("tyre", {
    ...P,
    kind: "part",
    role: "output",
    name: `Tyre Ø${2 * RW} x Ø${2 * RT} x ${TW}, nitrile rubber, bonded to the centre`,
    outer: H.disc(RW),
    holes: [H.disc(RT)],
    z0: -TW / 2,
    z1: TW / 2,
    mat: "Nitrile rubber NBR, 70 Shore A",
    why: "the friction face: rubber on the steel disc, mu about 0.5",
  });
  const hub = (id: string, r: number, z0: number, z1: number, name: string): Solid =>
    H.solid(id, { ...P, kind: "part", role: "output", name, outer: H.disc(r), holes: [bore], z0, z1, mat: "Aluminium 6061-T6, anodised", why: "carries the wheel along the sleeve; the fork runs in its groove" });
  const hubs = [
    hub("wheel-hub", HUB, TW / 2, FORK[0], `Wheel hub Ø${2 * HUB}, hex bored, the fork's groove Ø${2 * NECK} x ${FORK[1] - FORK[0]} between two shoulders`),
    hub("wheel-neck", NECK, FORK[0], FORK[1], ""),
    hub("wheel-flange", HUB, FORK[1], FORK[1] + 4, ""),
  ];
  A.add(tyre, ...hubs);

  // the sleeve held on the shaft between two circlips (F2); the key a short one at the middle
  const sleeve = A.get("sleeve")!;
  const SL = { axis: "x" as const, body: "sleeve", at: [0, 0, 0] as [number, number, number], ex: sleeve.ex, joints: ["pW"] };
  const clips = [H.circlip("pW-sleeve-cl0", 10, { ...SL, z0: sleeve.z0 - 1 }), H.circlip("pW-sleeve-cl1", 10, { ...SL, z0: sleeve.z1, name: "" })];
  A.add(...clips);
  const mid = (sleeve.z0 + sleeve.z1) / 2;
  A.set("pW-sleeve-key", { z0: mid - 20, z1: mid + 20, name: "Feather key 3 x 3 x 40 (DIN 6885), sleeve to shaft" });

  // ---- the contact force: disc springs under the disc, on a seat collar, set by a shim ----
  const tw = A.drop("pD-tw-sp")[0]!;
  const D = { body: "disc", at: [0, 0, 0] as [number, number, number], ex: disc.ex, joints: ["pD", CONTACT] };
  const z0 = tw.z0;
  const seat = H.collar("pD-seat", 12, 24, { ...D, z0, z1: z0 + 4.5, name: "Spring seat collar Ø12 x Ø24 x 4.5, set screw M4", why: "carries the disc springs on the shaft, so the bearings and not the base take the contact force (F4)" });
  const seatSS = H.setScrew("pD-seat-ss", 4, { ...D, at: [10, 0, 0], z0: z0 + 1, z1: z0 + 3.5 });
  const shim = H.washer("pD-shim", 12.2, 25, { ...D, kind: "shim", z0: z0 + 4.5, z1: z0 + 5, name: "Shim 12.2 x 25 x 0.5, sets the contact force", why: "added or taken out to set the spring's preload, and so the contact force (F7)" });
  const n = 4;
  const h = (disc.z0 - (z0 + 5)) / n;
  const springs = Array.from({ length: n }, (_, k) =>
    H.waveWasher(`pD-dspr${k}`, 12.2, 25, {
      ...D,
      z0: z0 + 5 + k * h,
      z1: z0 + 5 + (k + 1) * h,
      detail: "H",
      name: k ? "" : `Disc spring DIN 2093 C 25 (25 x 12.2 x 0.7), ${n} in series, 200 N on the tyre`,
      qty: k ? 0 : n,
      why: "presses the disc up onto the tyre; the force that the drive's torque rides on (F6)",
    }),
  );
  A.add(seat, seatSS, shim, ...springs);
  A.set("disc", { mat: "Steel S355, face ground", why: "the driving face the tyre runs on" });

  // ---- the shift: a post on the carriage, the fork screwed to it by the knob's stud ----
  const post = H.solid("shift-post", {
    kind: "bracket",
    role: "link",
    body: "carriage",
    at: [0, 0, 0],
    outer: roundRect(-4, -4, 4, 4, 1.5),
    z0: carriage.z1,
    z1: ZC - FORK_BAR,
    ex: carriage.ex,
    joints: ["slide-carriage"],
    mat: carriage.mat ?? "Bronze CuSn8",
    name: `Fork post 8 x 8 x ${ZC - FORK_BAR - carriage.z1}, machined with the carriage`,
    why: "lifts the fork from the carriage to the shaft's height",
  });
  const knob = H.screw("shift-knob", "socket", 4, 20, { body: "carriage", at: [0, 0, 0], face: ZC, dir: -1, ex: fork.ex + 1, joints: ["slide-carriage"], lock: "threadlocker, medium (Loctite 243)" });
  A.add(post, ...knob);
  const kh = knob[0]!;
  A.set(kh.id, {
    outer: H.disc(8),
    z1: ZC + 12,
    D: 16,
    mat: "Phenolic resin, knurled",
    marks: Array.from({ length: 24 }, (_, k): Vec2[] => [
      [7 * Math.cos((k * Math.PI) / 12), 7 * Math.sin((k * Math.PI) / 12)],
      [8 * Math.cos((k * Math.PI) / 12), 8 * Math.sin((k * Math.PI) / 12)],
    ]).map((pts) => ({ kind: "knurl" as const, pts })),
    name: "Shift knob Ø16 x 12, phenolic, on an M4 x 20 stud through the fork into the post",
    why: "the hand that sets the ratio; its stud screws the fork to the post",
  });
  // F9: the ratio stations engraved on the base beside the reference rail, the pointer on the carriage
  const base = A.get("base")!;
  const yT = Y_SLIDE - 13.5 - 3.5 - 2;
  for (const k of [3, 2, 1, 0, -1]) {
    const x = radius(0) - (3 - k) * RW + (FORK[0] + FORK[1]) / 2;
    base.marks.push({ kind: "index", pts: [[x, yT], [x, yT - (k === 0 ? 6 : 4)]] });
  }
  carriage.marks.push({ kind: "index", pts: [[0, -10], [0, -6]] });

  // ---- the box test sees the bores of the posed wheel and fork as solid: allowed round the shaft and sleeve ----
  const round = A.find((s) => s.id === "sleeve" || s.id === "pW-sleeve-key" || /^pW-shaft/.test(s.id) || /^pW-sleeve-cl/.test(s.id)).map((s) => s.id);
  for (const s of [wheel, tyre, ...hubs]) s.allow = [...(s.allow ?? []), ...round];
  fork.allow = [...(fork.allow ?? []), ...round, post.id, ...knob.map((s) => s.id)];

  // ---- A16 ----
  const K = A.s0.pts.K!;
  A.joint(CONTACT, {
    at: [K[0], K[1]],
    title: "Contact · wheel and disc",
    note: "Friction contact, rubber tyre on the ground steel face. Four disc springs on a seat collar press the disc up onto the tyre with 200 N; the disc slides on its key, so the force holds as the tyre wears, and a shim under the springs sets it. The wheel slides along its hex sleeve, moved by the fork in its hub's groove. Torque is limited to mu N r_w, about 3 N m: past it the tyre slips, so the contact is its own overload clutch. Kept dry: no grease near the faces.",
    badge: ["preloaded", "ok"],
    serves: { F2: [fork.id], F3: [tyre.id], F4: [seat.id], F6: springs.map((s) => s.id), F7: [shim.id], F10: [tyre.id] },
  });
  A.joint("pD", { note: `${A.joint("pD").note} The disc slides on its key: disc springs on a seat collar press it up onto the tyre; the flush end screw only catches it when the wheel shaft is out.`, badge: ["single shear", "warn"] });
  A.joint("pW", {
    note: `${A.joint("pW").note} The sleeve is held on the shaft between two circlips; the wheel's hub slides along it, its hex taking the torque. The blocks stand past the disc's rim, so the wheel crosses the whole face between them.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("slide-carriage", { note: `The shift: ${A.joint("slide-carriage").note} The post on the carriage carries the fork; the knob's stud screws them together. The end stops are the ends of the ratio range, 3.0 forward and 1.0 back. The gib's drag holds a setting.` });
  A.rules.push(
    { title: "Pressed, not clamped", text: "The disc slides on its key and disc springs press it onto the tyre, so the contact force holds as the rubber wears; a shim under the springs sets it." },
    { title: "Shaft over the face", text: "The wheel's shaft runs 30 mm over the disc face and crosses its axis; its blocks stand past the rim, so the wheel can cross the centre and reverse." },
    { title: "Hex to slide, key to hold", text: "The wheel slides on a hex sleeve that is keyed to the shaft and held between circlips; the fork in the hub's groove moves it." },
    { title: "Kept dry", text: "The friction faces are never oiled: the slide's nipple sits beyond the disc's rim and the hex sleeve runs dry." },
    { title: "Kinematics untouched", text: "Disc and tyre radii, the shaft's height and the contact radius are the model's; the springs, the hub and the shift are fitted round them." },
  );
};
