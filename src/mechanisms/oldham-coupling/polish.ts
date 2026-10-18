// Overrides and additions to the generated Oldham coupling assembly (standard 5.2). The rules build the input shaft in
// its housing cartridge behind the base, the keyed hub, the pulley drive, the base and the feet; the model's twins make
// each hub and the disc one rigid body. What differs from the rules:
// - the output shaft comes down into its hub from a bridge, because the shafts of a coupling meet from opposite sides
//   of the stack: a second J2 cartridge (H.housing, turned over) on a bridge over the whole assembly;
// - each hub's slot plate is screwed and dowelled to its back plate; hardened wear strips and felt oilers line the
//   slots the tongues run in (M14, F8); match marks (F9); the disc and tongues are acetal;
// - notes, badges and build rules (A16).
import { bbox, circle, offsetPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { baseCorners, growBase } from "../../rules/base";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import type { RuleContext } from "../../rules/types";
import type { Solid } from "../../hardware/solid";
import { innerRingD, keyFor } from "../../hardware/tables";
import { R, Rm, SL, T, Z, e, ws, wr } from "./model";

/** Wear strip thickness: the slot is relieved by it behind the strips, so their faces are the modelled walls. */
const STRIP = 1.5;
/** Felt oiler: its face stands 0.2 mm off the tongue. */
const FELT_FACE = wr / 2 + 0.2;
/** The output shaft: Ø10 like the input (A3), the same bearing in its cartridge. */
const D = 10;
const ACETAL = "Acetal (POM-C), natural";
const ALU = "Aluminium 6061-T6, hard anodised";

const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const O2: Vec2 = [e, 0];
  const hubInBack = A.get("hubInBack")!;
  const hubIn = A.get("hubIn")!;
  const hubOut = A.get("hubOut")!;
  const hubOutBack = A.get("hubOutBack")!;
  const disc = A.get("disc")!;
  const tA = A.get("tongueA")!;
  const tB = A.get("tongueB")!;

  // ---- explode order of the stack: back plate, slot plate, disc with its tongues, slot plate, back plate (E4) ----
  hubIn.ex = 1;
  tA.ex = tB.ex = disc.ex;
  hubOut.ex = 3;

  // ---- the base takes the bridge posts: grown to the right, the feet and mounting holes moved with it ----
  const [bx0, by0, bx1, by1] = bbox(A.get("base")!.outer);
  growBase(ctx, [bx0, by0, bx1 + 20, by1]);
  baseCorners(ctx).forEach((c, i) => {
    const f = A.get(`foot${i}`);
    if (f) f.at = [c[0], c[1], 0];
  });

  // ---- the output side: a bridge over the whole stack on two spigoted posts, placed where no hub passes ----
  const br = H.bridge(A, { id: "O2-bridge", over: [O2], zMin: Z.backOut + T + 0.5, joint: "O2", rBoss: 22 })!;
  const bridge = br.bridge;
  bridge.name = "Bridge over the output hub, on two spigoted posts";
  bridge.why = "carries the output shaft's cartridge clear above the hubs, so the shaft meets the stack from the side opposite the input (A9)";
  bridge.holes.push(circle(D / 2 + 1, ...O2));
  const zHub = Z.backOut + T;
  const zt = br.z1;
  const exCart = bridge.ex + 1;

  // the cartridge: H.housing built hanging below a plane at 0, then turned over onto the bridge's top face
  const made: Solid[] = [];
  const shim = { ...ctx, b0: 0, add: (...l: (Solid | Solid[])[]) => { const f = l.flat(); made.push(...f); return f; } } as RuleContext;
  A.joint("O2", { type: "J2", at: O2, title: "O2 · Output shaft", note: "", serves: {} });
  const cart = H.housing(shim as never, "O2", { at: O2, d: D });
  for (const s of made) {
    [s.z0, s.z1] = [zt - s.z1, zt - s.z0];
    if (s.threadZ) s.threadZ = [zt - s.threadZ[1], zt - s.threadZ[0]];
    delete s.span;
    s.ex = exCart;
    if (s.kind === "head") s.headTop = true;
    s.name = s.name.replace(/to the base/, "to the bridge").replace(/to base/, "to bridge");
  }
  A.add(made);
  const top = zt + (0 - cart.z0);
  const [b0, b1] = [zt - cart.lower[1], zt - cart.lower[0]];
  void b0;
  // dowel holes in the bridge (the screws' tapped holes are cut by stage 3)
  for (const s of made) if (s.kind === "dowel") bridge.holes.push(circle(s.d! / 2, s.at[0], s.at[1]));
  const cartBottom = zt - cart.upper[1];
  void cartBottom;

  // ---- the output shaft down into its hub, keyed (A5), the hub held by a flush end screw (F2) ----
  const k = keyFor(D)!;
  const zs0 = Z.backOut + 0.5;
  const zTop = top + 1.5 + 8 + 0.5;
  const G = { body: "hubOutBack", at: [0, 0, 0] as [number, number, number], joints: ["O2"] };
  const keyOutline: Vec2[] = [[D / 2 - k.t1, -k.b / 2], [D / 2 - k.t1 + k.h, -k.b / 2], [D / 2 - k.t1 + k.h, k.b / 2], [D / 2 - k.t1, k.b / 2]];
  hubOutBack.holes[0] = circle(D / 2 + 0.01, 0, 0, 36);
  hubOutBack.marks.push({ kind: "keyway", pts: keyOutline });
  A.add(
    H.shaft("O2-shaft", { d: D, z0: zs0, z1: zTop, keyway: [Z.backOut, zHub] }, { ...G, name: `Output shaft Ø${D} h6, feather key ${k.b} x ${k.h}`, role: "output", ex: hubOutBack.ex }),
    H.key("O2-hubOutBack-key", k.b, T, { ...G, outer: keyOutline, z0: Z.backOut, z1: zHub, ex: hubOutBack.ex }),
    H.screw("O2-end", "csk", 5, 12, { ...G, face: Z.backOut, dir: 1, ex: hubOutBack.ex, name: "Countersunk M5 x 12 (ISO 10642), into the shaft end, flush" }),
  );
  // the thrust washer under the bridge, on the hub: it takes the hub's upward load off the bridge (F4)
  const gap = bridge.z0 - zHub;
  const tw = gap > 3.2 ? 1.5 : gap;
  A.add(H.thrustWasher("O2-tw", D + 0.2, D + 6, { ...G, z0: zHub, z1: zHub + tw, ex: hubOutBack.ex, why: "takes the hub's load on the bridge's underside (F4)" }));
  if (gap > 3.2) A.add(H.spacer("O2-tw-sp", D + 0.2, D + 6, { ...G, name: "Spacer, thrust washer to the bridge", z0: zHub + tw, z1: bridge.z0, ex: hubOutBack.ex }));
  // top of the shaft: an inner-race spacer from the cartridge's top bearing, a collar with a set screw holding the shaft up (F2, F3)
  const rIn = innerRingD(cart.bearing);
  const zTb = zt - cart.lower[0];
  A.add(
    H.spacer("O2-top-sp", D + 0.2, rIn, { ...G, name: "Spacer, top bearing inner race to the collar", z0: zTb, z1: top + 1.5, ex: exCart + 0.5 }),
    H.collar("O2-collar", D, D + 10, { ...G, z0: top + 1.5, z1: top + 9.5, ex: exCart + 1 }),
    H.setScrew("O2-collar-ss", 3, { ...G, at: [(D + 10) / 2 - 2, 0, 0], z0: top + 3, z1: top + 7.5, ex: exCart + 1 }),
    H.tube("O2-hsleeve", D + 0.2, Math.min(D + 3, rIn), { name: "Spacer sleeve between the cartridge bearings, inner races", ...G, z0: zt - cart.upper[0], z1: zt - cart.lower[1] + 0, ex: exCart, inset: true }),
  );
  void b1;

  // ---- each hub: a slot plate screwed and dowelled to its back plate (F1, F3, A11) ----
  const slotPlate = (id: string, plate: Solid, back: Solid, below: boolean) => {
    const bolt = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]): Vec2 => [(a! * 60) / Math.SQRT2, (b! * 60) / Math.SQRT2]);
    const dowels: Vec2[] = [[0, 60], [0, -60]];
    // screws come from the face away from the other plate: up from under the input back plate, up from under the output slot plate
    const base = below ? back : plate;
    const face = base.z0;
    bolt.forEach((p, i) => A.add(H.screw(`${id}-sc${i}`, "csk", 2.5, 10, { body: "hubInBack" === back.id ? back.id : back.id, at: [p[0], p[1], 0], face, dir: 1, ex: base.ex, joints: [id], name: i ? "" : undefined, qty: i ? 0 : 4 })));
    dowels.forEach((p, i) => {
      A.add(H.dowel(`${id}-dw${i}`, 4, { body: back.id, at: [p[0], p[1], 0], z0: below ? back.z0 + 2 : plate.z0 + 2, z1: below ? plate.z0 + 4 : back.z0 + 4, ex: back.ex, joints: [id], name: i ? "" : "Dowel pin Ø4 x 8 h6, slot plate to back plate", qty: i ? 0 : 2 }));
      plate.holes.push(circle(2, ...p));
      back.holes.push(circle(2, ...p));
    });
  };
  slotPlate("hubIn-fix", hubIn, hubInBack, true);
  slotPlate("hubOut-fix", hubOut, hubOutBack, false);

  // ---- M14, F8: hardened wear strips in every slot wall, a felt oiler in each, the slots relieved behind them ----
  const liner = (id: string, host: Solid, upFace: boolean) => {
    host.holes[0] = offsetPoly(host.holes[0]!, STRIP);
    const body = hubInBack.id === "hubInBack" && host === hubIn ? "hubInBack" : "hubOutBack";
    const common = { body, at: [0, 0, 0] as [number, number, number], ex: host.ex, joints: [id], z0: host.z0, z1: host.z1 };
    const L = SL - ws / 2;
    let n = 0;
    for (const side of [1, -1]) {
      const y0 = side > 0 ? ws / 2 : -ws / 2 - STRIP;
      const y1 = y0 + STRIP;
      for (const [x0, x1] of [[-L, -6], [6, L]] as const) {
        const i = n++;
        A.add(H.wearStrip(`${id}-ws${i}`, rect(x0, x1, y0, y1), { ...common, name: i ? "" : `Wear strip ${x1 - x0} x ${STRIP}, hardened, 2 x M2 csk`, qty: i ? 0 : 4, role: host.role }));
        for (const f of [0.25, 0.75]) {
          const p: Vec2 = [x0 + (x1 - x0) * f, side * (ws / 2 + STRIP + 1.1)];
          A.add(H.screw(`${id}-ws${i}-sc${f * 4}`, "csk", 2, 5, { body, at: [p[0], p[1], 0], face: upFace ? host.z1 : host.z0, dir: upFace ? -1 : 1, ex: host.ex, joints: [id], name: "", qty: 0 }));
        }
      }
      const fy: [number, number] = side > 0 ? [FELT_FACE, ws / 2 + STRIP] : [-ws / 2 - STRIP, -FELT_FACE];
      A.add(H.felt(`${id}-felt${side > 0 ? 0 : 1}`, rect(-5, 5, fy[0], fy[1]), { ...common, name: side > 0 ? "Felt oiler 10 x 2.3, oil-soaked wool felt, in the relieved wall" : "", qty: side > 0 ? 2 : 0, why: "keeps the tongue faces oiled (F8)" }));
    }
  };
  liner("T1", hubIn, true);
  liner("T2", hubOut, false);

  // ---- F9: match marks on the hubs' rims and the disc: with the tongues along their slots the parts go back in phase ----
  hubIn.marks.push({ kind: "timing", pts: [[R - 8, 0], [R - 2, 0]] });
  hubOut.marks.push({ kind: "timing", pts: [[R - 8, 0], [R - 2, 0]] });
  disc.marks.push({ kind: "timing", pts: [[Rm - 8, 0], [Rm - 2, 0]] });

  // L5: the output back plate and the bridge cover the tongues' working zone from above: drawn see-through
  hubOutBack.seeThrough = true;
  bridge.seeThrough = true;
  H.boreChamfers(hubInBack);
  H.boreChamfers(hubOutBack);
  locking.apply(ctx);
  materials.apply(ctx);
  for (const s of [hubInBack, hubIn, hubOut, hubOutBack]) s.mat = ALU;
  for (const s of [disc, tA, tB]) s.mat = ACETAL;
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  const ids = (re: RegExp) => A.find(re).map((t) => t.id);
  A.joint("pO1", { note: `${A.joint("pO1").note} The input hub is a keyed back plate with the slot plate screwed and dowelled on it; the shaft end sits 0.5 mm under the tongue.` });
  A.joint("O2", {
    type: "J2",
    at: O2,
    title: "O2 · Output shaft",
    note: `Output shaft Ø${D}, feather-keyed to the output back plate, held in a second housing cartridge of two sealed bearings on the bridge: it enters the stack from the side opposite the input, as the collinear shafts of a real coupling do. The hub hangs from the collar on the shaft top; a bronze thrust washer runs on the bridge underside; the hub is fitted to the shaft with a flush end screw before the slot plate goes on, and the bridge and cartridge are lowered over the shaft last. The bridge posts stand outside the sweep of both hubs (${(bridge.z0 - zHub).toFixed(1)} mm over the hub, clear).`,
    badge: ["two bearings", "ok"],
  });
  A.joint("T1", {
    type: "J5",
    at: [0, 0],
    title: "Tongue · input slot",
    note: "The disc's input tongue slides ±28 mm along the input slot (the tongue is 16 wide in an 18 slot, 1 mm clear each side). The walls are hardened strips screwed into the relieved slot, the faces are the modelled walls; a felt oiler in each wall wipes the tongue faces. The tongue is moulded with the disc in acetal and is the wearing part.",
    badge: ["hardened walls", "ok"],
    serves: { F8: ids(/^T1-felt/), F9: ["hubIn", "disc"], F7: [] },
  });
  A.joint("T2", {
    type: "J5",
    at: O2,
    title: "Tongue · output slot",
    note: "The output tongue lies square to the input one and slides ±28 mm along the output slot, the same strips and felts as the input slot. Torque passes as side force between tongue and wall, square to the slot; the disc is a sacrificial acetal part and acts as a torque fuse.",
    badge: ["hardened walls", "ok"],
    serves: { F8: ids(/^T2-felt/), F9: ["hubOut", "disc"] },
  });
  A.joint("hubIn-fix", { type: "post", at: [0, 0], title: "Input hub · slot plate on back plate", note: "Four countersunk M2.5 from under the back plate into the slot plate and two Ø4 dowels locate the slot plate square to the keyed back plate, so the slot stays on the shaft's key (F1, F3).", badge: ["located", "ok"], serves: { F1: ids(/^hubIn-fix-dw/), F3: ids(/^hubIn-fix-(sc|dw)/) } });
  A.joint("hubOut-fix", { type: "post", at: O2, title: "Output hub · slot plate on back plate", note: "Four countersunk M2.5 from under the slot plate into the back plate and two Ø4 dowels, as on the input hub; the screws are put in before the hub subassembly is lowered onto the disc.", badge: ["located", "ok"], serves: { F1: ids(/^hubOut-fix-dw/), F3: ids(/^hubOut-fix-(sc|dw)/) } });
  A.rules.push(
    { title: "Shafts meet from opposite sides", text: "The input shaft comes up through the base into the input hub; the output shaft comes down from a bridge into the output hub, so neither shaft passes through the other hub." },
    { title: "Slot plate on a back plate", text: "A blind groove cannot be milled out of the shaft side, so each hub is a keyed back plate with a slot plate screwed and dowelled on it." },
    { title: "Hard walls, soft tongue", text: "Hardened strips line both slots and felt oilers wipe the tongue; the acetal tongues wear and the disc is the part to replace." },
    { title: "Slot clears the stroke", text: "Each slot is 106 mm long: the tongue's 48 mm plus its ±28 mm stroke, 1 mm to spare at each end." },
    { title: "Kinematics untouched", text: "Offset, slot widths, tongue sizes and disc position are the model's; strips, plates and the bridge are built around them." },
  );
};
