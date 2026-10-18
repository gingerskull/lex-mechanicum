// Overrides and additions to the generated Tusi couple assembly (standard 5.2). The layering (carrier arm under, ring and
// planet in one plane above it, tracer pegs on the planet) and the wider ring rim are the model's; the rules build every
// stack on them. What differs from the rules:
// - the ring on four posts instead of two, located by a round spigot and a slotted one (F1, A11);
// - the planet's tooth-meshing marks put where the meshing teeth are (the J6 mark rule places an internal mesh's marks
//   on the far side of the ring: promotion candidate), a 15° scale on the ring face and an index on the arm (F9);
// - the two tracer pegs as Ø2 pins pressed into planet teeth on the pitch circle (a tracer is a real part);
// - notes, badges and build rules (A16).
import { D2R, polar, slot, xf, type Pose, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { R, m, r } from "./model";

/** Tracer peg: pin Ø, and how far the hole wall is from the tooth flank. */
const PEG = 2;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const ring = A.get("ring")!;
  const planet = A.get("planet")!;
  const arm = A.get("arm")!;

  // ---- F1, A11: the ring on four posts. The rule's two stay; two more stand 90° round, copied from them. Post 0 gets
  // a round Ø6 spigot into the ring, post 1 (opposite) one in a radial slot, so the ring goes back exactly centred ----
  const rot = (s: { at: Pose }, a: number): Pose => {
    const [x, y] = s.at;
    return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), 0];
  };
  for (const [src, dst] of [["ring-post0", "ring-post2"], ["ring-post1", "ring-post3"]] as const) {
    for (const s of A.find((t) => t.id === src || t.id.startsWith(`${src}-`))) {
      const id = s.id.replace(src, dst);
      A.add({ ...s, id, at: rot(s, Math.PI / 2), group: s.group ? s.group.replace(src, dst) : undefined, name: "", holes: s.holes.map((h) => h.slice()), marks: s.marks.slice() });
    }
  }
  // the standard's own hole for each post's screw is replaced by the spigot seat on posts 0 and 1 (a Ø6 reamed hole and a
  // slot with 3 mm of play along the line of the two) and stays a clearance hole on posts 2 and 3
  ring.holes = ring.holes.filter((h) => h.length > 60);
  const post = (k: number): Pose => A.get(`ring-post${k}`)!.at;
  const axis = Math.atan2(post(0)[1], post(0)[0]);
  ring.holes.push(H.disc(3.0, post(0)[0], post(0)[1]));
  ring.holes.push(xf(slot(-1.5, 1.5, 0, 3.0), [post(1)[0], post(1)[1], axis]));
  ring.holes.push(H.disc(2.8, post(2)[0], post(2)[1]), H.disc(2.8, post(3)[0], post(3)[1]));
  for (const k of [0, 1])
    A.add(
      H.spigot(`ring-post${k}-spigot`, {
        name: k ? "" : "Spigot Ø6 h7 on the standoff, one round, one in a slot",
        at: post(k),
        z0: ring.z0,
        z1: ring.z0 + 3,
        ex: ring.ex,
        joints: ["ring-post"],
        allow: ["ring"],
      }),
    );
  A.joint("ring-post", { at: post(0).slice(0, 2) as Vec2 });

  // ---- tracer pegs: a Ø2 pin pressed into the planet's tooth on the pitch circle, under each head (X at +r, Y at -r) ----
  const tx = A.get("tX")!;
  for (const [id, x] of [["tX", r], ["tY", -r]] as const) {
    planet.holes.push(H.disc(PEG / 2, x, 0));
    A.add(
      H.dowel(`${id}-pin`, PEG, {
        name: id === "tX" ? `Tracer pin Ø${PEG} h6, pressed in the planet tooth` : "",
        body: "planet",
        at: [x, 0, 0],
        z0: planet.z0 + 1.5,
        z1: tx.z0 + 2.5,
        ex: planet.ex,
        joints: ["tracers"],
        allow: ["planet", id],
      }),
    );
  }
  A.joint("tracers", {
    type: "post",
    at: [R, 0],
    title: "Tracers · X and Y",
    note: `Each tracer is a Ø6.4 head on a Ø${PEG} pin pressed into a planet tooth, on the pitch circle (radius ${r}), the head 1 mm over the planet face and the ring. X sits on the tooth that meets the ring on the x axis at arm angle 0, Y on the tooth opposite, which crosses the input axis. The pitch circle is where the straight line is exact: a point inside it would trace an ellipse.`,
    badge: ["on the pitch circle", "ok"],
    serves: { F1: ["tX-pin", "tY-pin"], F2: ["tX-pin", "tY-pin"] },
  });
  planet.joints.push("tracers");

  // ---- F9: marks. The J6 rule's timing marks for an internal mesh land on the wrong side of the ring: replaced ----
  for (const s of [ring, planet]) s.marks = s.marks.filter((k) => k.kind !== "timing");
  // at arm angle 0 the planet tooth at +x (local angle 0) stands in the ring space at angle 0: a line on each, and one on the arm
  ring.marks.push({ kind: "timing", pts: [[R + 6.5, 0], [R + 10.5, 0]] });
  planet.marks.push({ kind: "timing", pts: [[r - 2.2 * m, 0], [r - 1.3 * m, 0]] });
  arm.marks.push({ kind: "index", pts: [[16, 0], [22, 0]] });
  for (let a = 0; a < 360; a += 15) {
    // not under a post head (the posts stand at 13° + k 90°)
    if (Math.abs((((a - axis / D2R) % 90) + 90) % 90 - 0) < 6 || Math.abs((((a - axis / D2R) % 90) + 90) % 90 - 90) < 6) continue;
    const L = a % 90 === 0 ? 4.5 : 2.5;
    ring.marks.push({ kind: "scale", pts: [polar(R + 7, a * D2R), polar(R + 7 + L, a * D2R)] });
  }
  A.joint("mesh-ring-planet", { at: [R, 0] });
  ctx.joint("mesh-ring-planet")!.serves.F9 = ["ring", "planet", "arm"];

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO", {
    note: `${A.joint("pO").note} The carrier arm is keyed on the shaft's top, under the planet: the planet's pitch circle passes through the input axis, so the planet always covers it and nothing, no bridge and no second arm plate, can stand above the shaft. Single shear, carried by the two housing bearings 15 mm apart.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pC", {
    note: `${A.joint("pC").note} Single shear is forced: a second carrier plate over the planet would have to reach the input shaft, which the planet itself covers. The planet is a wide gear on a flanged bearing (${sz("pC-planet-brg")}) held by an inner-race spacer from the arm, with a short overhang; its turning is exactly the arm's, backwards.`,
    badge: ["single shear", "warn"],
    serves: { F4: ["pC-planet-brg", "pC-sp0"] },
  });
  A.joint("mesh-ring-planet", {
    note: `${A.joint("mesh-ring-planet").note} Both gears are module ${m}, 20°, and the centre distance is the arm (${R - r} mm): exact by the model, so no eccentric is possible or needed. The planet turns backwards, once per arm turn. Open teeth: greased at assembly, nothing else carries the oil.`,
  });
  A.joint("ring-post", {
    note: `Four Ø10 standoffs hold the ring 12 mm over the base outside the planet's tooth tips (68 mm) and the arm's sweep (42 mm); M5 button heads from both sides. Round Ø6 spigot at one, slotted spigot opposite: the ring goes back centred on the input axis.`,
    badge: ["located and held", "ok"],
    serves: { F1: ["ring-post0-spigot", "ring-post1-spigot"], F2: ["ring-post0-top", "ring-post1-top", "ring-post2-top", "ring-post3-top"] },
  });
  A.rules.push(
    { title: "Exactly twice as many teeth", text: "Ring 32, planet 16, module 4: the arm is 32 mm and every pitch point of the planet runs on a straight diameter. Change a tooth count and the line becomes an ellipse." },
    { title: "Tracers on the pitch circle", text: "Each tracer pin stands in a planet tooth on the pitch circle. A pin even 1 mm inside would draw an ellipse." },
    { title: "Assemble in phase", text: "Set the arm to 0°: the marked planet tooth meets the marked ring space on the x axis. The 15° scale on the ring reads the arm's angle." },
    { title: "Arm low, ring and planet in one plane", text: "The planet covers the input axis, so the arm sits under it; the ring is held up to the planet's plane on four posts outside its tooth tips." },
    { title: "Kinematics untouched", text: "Ring, planet and arm are the model's; posts, bearing, pins and marks are designed round them." },
  );
};
