// Turkey trot walker on engine v3: the exceptions to the builder (standard 5.2, R7).
// - M10: the themed scenery of a seasonal mechanism (P14) is made as a carved wooden toy, not as machine parts: the
//   body's shells, head and neck in carved and painted lime wood, the treadmill's rails and turned legs in walnut, the
//   feathers in painted lime wood, the knife and fork in steel with rosewood handles. The rules' defaults name steel and
//   aluminium.
// - E2, E9: the carved pieces are glued to the part they carry, so each comes off as one: the body with its shells, head,
//   neck and arm, each leg with its carved skin, the treadmill frame with its far rail, deck, ties and legs, each carriage
//   with its knife or fork.
// - P14, L8: each feather carries its quill, chevron bars and a hatched band near its tip, engraved on its face toward the
//   body (the feathers' plates are the kinematic bodies themselves, so their marks go on their own parts).
// - F5, F7 (not built yet): the toes stay level on a light torsion spring round each ankle pin, its legs against the shank
//   and the toe plate's lug: no rule builds a sprung joint between two moving parts.
// - A5, J2: the crank shaft turns in a moving frame, so the rules build its pins as shoulder bolts on bearings; it is a
//   live shaft with the cranks and the cam keyed on it, in a bearing seated in the outer layers of either shell.
// - J10, T12: the carved rails are the drums' bearing housings (as in the concept): each drum's shaft runs in a bearing in
//   either rail, so the rules' pillow blocks under the rear drum and the cartridge housing on the near rail are not built
//   (named in the record's `teaching.exceptions`); the rear shaft runs on past the near rail to the cutlery's crank discs.
import type { Polish } from "../../builder";
import { patternMarks } from "../../builder/decor";
import type { Frame } from "../../builder/frames";
import { BEARINGS } from "../../hardware/tables";
import type { Vec3 } from "../../kin/math";

export const polish: Polish = (A, h) => {
  const mat = (f: RegExp, m: string) => A.find(f).forEach((s) => A.set(s.id, { mat: m }));
  mat(/^body(-(band[NF]|shell[NF]\d+|neckN|head|beak|wattle|snood))?$/, "Lime wood, carved and painted");
  mat(/^body-arm$/, "Walnut, oiled");
  mat(/^leg(F)?-skin$/, "Lime wood, carved and painted");
  mat(/^treadmill(-(railF|railN-carving|tie[RF]))?$/, "Walnut, carved and oiled");
  mat(/^treadmill-leg[RF][NF]$/, "Walnut, turned and oiled");
  mat(/^treadmill-deck$/, "Birch plywood");
  mat(/^f\d+$/, "Lime wood, painted");
  mat(/^(knife|fork)-(blade|tines|bolster)$/, "Stainless steel, blunted");
  mat(/^(knife|fork)-handle$/, "Rosewood, brass rivets");
  const group = (f: RegExp, g: string) => A.find(f).forEach((s) => A.set(s.id, { group: g }));
  group(/^body-/, "body-prop");
  group(/^leg-skin$/, "leg-prop");
  group(/^legF-skin$/, "legF-prop");
  group(/^treadmill-/, "treadmill-prop");
  group(/^knife-(handle|bolster|blade)$/, "knife-prop");
  group(/^fork-(handle|tines)$/, "fork-prop");
  // the feathers' quills, chevrons and banded tips
  for (const s of A.find(/^f\d+$/)) {
    const pts = s.profile.outer;
    const top = Math.max(...pts.map((q) => q[1]));
    const w = Math.max(...pts.filter((q) => q[1] > top - 40).map((q) => Math.abs(q[0])));
    const marks = [...s.marks, { kind: "carve" as const, pts: [[0, 12], [0, top - 6]] as [number, number][] }];
    for (const f of [0.55, 0.62, 0.69]) {
      const y = top * f;
      marks.push({ kind: "carve" as const, pts: [[-w * 0.55, y - 3], [0, y + 1], [w * 0.55, y - 3]] });
    }
    const band = { outer: pts.filter((q) => q[1] > top * 0.8 && q[1] < top * 0.88), holes: [] };
    if (band.outer.length >= 3) marks.push(...patternMarks({ outer: [[-w, top * 0.8], [w, top * 0.8], [w, top * 0.88], [-w, top * 0.88]], holes: [] }, "hatch", { angle: 60 }));
    A.set(s.id, { marks });
  }
  // the spreader: the rod itself runs in the feathers' slots, and the lever's pin carries a roller in the hanger's slot
  A.drop(/^Q\d*-(stud|roller|wear\d|felt|shaft|pin)/);
  // the rod is plain: no pin of the slots is bored into it
  const rod = A.get("spreader");
  if (rod) A.set("spreader", { profile: { outer: rod.profile.outer, holes: [] } });
  const q = A.local("lever", A.ctx.S.joints.get("Q")!.at);
  A.build(A.frame("lever", q), (L, H) => {
    L.add(H.dowel("Q-stud", 4, { body: "lever", z0: -2, z1: 7.6, name: "Stud Ø4, pressed into the lever" }));
    L.add(H.roller("Q-roller", 4, 5, { body: "lever", z0: 3.2, z1: 6.8, name: "Roller Ø5 in the hanger's slot" }));
  }, { joints: ["Q"] });

  // live shafts across the walker (world Y), built as stacks: a shaft keyed to the parts it turns, a bearing in each
  // housing, inner-race spacers between, an end washer and a countersunk screw into each end (A12, F2)
  const B688 = BEARINGS.find((b) => b.name === "688")!;
  // `disc0`: the near end ends in a disc keyed on it and held by a set screw in the disc's rim, with no end washer, so
  // nothing stands proud of the disc where a rod sweeps by
  const live = (id: string, joint: string, turn: string, name: string, ends: [number, number], brg: [number, string][], spacers: [number, number][], disc0?: { body: string; r: number }) => {
    const at = A.ctx.S.joints.get(joint)!.at;
    const o = A.local(turn, at);
    const y = A.local(turn, [at[0], at[1] + 1, at[2]]);
    A.build(A.frame(turn, o, [y[0] - o[0], y[1] - o[1], y[2] - o[2]]), (L, H) => {
      L.add(H.shaft(`${id}-shaft`, { d: 8, z0: ends[0], z1: ends[1], flat: true }, { body: turn, name }));
      brg.forEach(([z, host], k) => L.add(H.bearing(`${id}-brg${k}`, B688, { body: host, z0: z, z1: z + B688.B, closure: "seal" })));
      spacers.forEach(([z0, z1], k) => L.add(H.spacer(`${id}-sp${k}`, 8.2, 10.8, { body: turn, z0, z1, ...(k ? { name: "" } : {}) })));
      // the end washer bears on the inner race alone where the end stands at a bearing
      ([[ends[0], -1], [ends[1], 1]] as const).forEach(([z, s], k) => {
        if (k === 0 && disc0) return;
        L.add(H.washer(`${id}-ew${k}`, 3.2, 9.5, { body: turn, z0: s > 0 ? z : z - 1.5, z1: s > 0 ? z + 1.5 : z, name: k && !disc0 ? "" : "End washer 3.2x9.5 x 1.5" }));
        L.add(H.screw(`${id}-es${k}`, "csk", 3, 10, { body: turn, face: z + s * 1.5, dir: s > 0 ? -1 : 1, ...(k && !disc0 ? { name: "" } : {}) }));
      });
    }, { joints: [joint] });
    if (disc0) {
      const d = A.get(disc0.body)!;
      const h0 = d.op.op === "extrude" ? d.op.h : 4;
      const yd = d.frame.o[1] + (d.frame.z[1] * h0) / 2;
      A.build({ o: [at[0], yd, at[2]], x: [1, 0, 0], z: [0, 0, 1] }, (L, H) => {
        L.add(H.setScrew(`${id}-ss0`, 3, { body: disc0.body, z0: 4.1, z1: disc0.r - 0.2, name: "Set screw M3 (DIN 916), threadlocked: the disc on the shaft's flat, holding the stack at that end" }));
      }, { joints: [joint] });
    }
    // its note replaces the rules' one (A16)
    const old = A.ctx.notes.findIndex((n) => n.id === joint);
    if (old >= 0) A.ctx.notes.splice(old, 1);
    const held = brg[0]![1] === "ground" ? "each carved rail" : "each shell";
    const clamp = disc0 ? "by the disc's set screw at its near end and an end washer and a countersunk screw at the other" : "by an end washer and a countersunk screw at each end";
    A.note({ id: joint, kit: "J2", at, title: `J2 · ${joint}`, note: `${name}, in two sealed 688 bearings, one in ${held},${Math.abs(brg[1]![0] - brg[0]![0]).toFixed(0)} mm apart; clamped through inner-race spacers ${clamp}.`, badge: ["double shear", "ok"], d: 8, serves: { F2: disc0 ? [`${id}-ss0`, `${id}-ew1`] : [`${id}-ew0`, `${id}-ew1`], F3: [`${id}-shaft`] } });
  };
  // the crank shaft: the cranks and the cam keyed on it, a bearing seated in the outer layers of either shell
  A.drop(/^O-/);
  live("O", "O", "crank", "Crank shaft Ø8, live, D-flat: the cranks and the cam keyed on it", [-65, 65], [[-34, "body"], [29, "body"]], [[-60, -34], [-29, -16], [-10, 29], [34, 60]]);
  // the drums: each shaft in a bearing in either carved rail; the rear one runs on to the knife's crank disc and ends in it
  A.drop(/^R[RF]-/);
  const kd = A.ctx.kin.bodies.find((b) => b.id === "crankK")!.shape as { place: number; thickness: number };
  const fd = A.ctx.kin.bodies.find((b) => b.id === "crankFk")!.shape as { place: number; thickness: number };
  const disc = (s: { place: number; thickness: number }): [number, number] => [s.place, s.place + s.thickness];
  const [k0, k1] = disc(kd), [f0, f1] = disc(fd);
  live("RR", "RR", "rollerR", "Rear drum's shaft Ø8, live, D-flat: the drum and the knife's crank disc keyed on it", [k0, 79], [[-79, "ground"], [74, "ground"]], [[k1, -79], [-74, -66], [66, 74]], { body: "crankK", r: 14.5 });
  live("RF", "RF", "rollerF", "Front drum's shaft Ø8, live, D-flat", [-79, 79], [[-79, "ground"], [74, "ground"]], [[-74, -66], [66, 74]]);
  returnCrank(A, h, { k0, k1, f0, f1 });
  // the toes' hinge lugs end at the toe plate's sole: the lugs rule rounds the web past the plate's mid-plane by its boss
  // radius, which on a plate thinner than the boss runs out under the sole and into the belt (L2)
  for (const t of ["toes", "toesF"]) {
    const plate = A.get(t)!;
    for (const lug of A.find(new RegExp(`^${t}-lug-`))) {
      const ly: Vec3 = [lug.frame.z[1] * lug.frame.x[2] - lug.frame.z[2] * lug.frame.x[1], lug.frame.z[2] * lug.frame.x[0] - lug.frame.z[0] * lug.frame.x[2], lug.frame.z[0] * lug.frame.x[1] - lug.frame.z[1] * lug.frame.x[0]];
      if (Math.abs(ly[2] - 1) > 1e-9) continue;
      const sole = plate.frame.o[2] - lug.frame.o[2];
      A.set(lug.id, { profile: { outer: clipBelow(lug.profile.outer as [number, number][], sole), holes: lug.profile.holes } });
    }
  }
};

/** A polygon cut by the line v = c, keeping v ≥ c. */
function clipBelow(p: [number, number][], c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i]!, b = p[(i + 1) % p.length]!;
    const ia = a[1] >= c, ib = b[1] >= c;
    if (ia) out.push(a);
    if (ia !== ib) out.push([a[0] + ((b[0] - a[0]) * (c - a[1])) / (b[1] - a[1]), c]);
  }
  return out;
}

/**
 * The fork's crank is a return crank clamped on the knife's crank pin (A9, J3): the rear shaft ends in the knife's disc,
 * so the knife's rod never sweeps over it, and a stepped pin screwed into the disc carries the rod's bearing and runs on
 * past the knife's slide to the return crank, whose boss a set screw clamps on it. The return crank turns with the disc
 * about the shaft's axis, so the kinematics (crankFk on RRf) are as before; no part stands on that axis outboard of the
 * disc. The knife slide's gibbed rail, its riser, the keeper and the keeper's front screw end 5 mm shorter at the front,
 * clear of the pin's sweep (the J5 kit shortens a rail only for the sweeps it sees, and the pin is the polish's).
 */
function returnCrank(A: Parameters<Polish>[0], h: Parameters<Polish>[1], y: { k0: number; k1: number; f0: number; f1: number }): void {
  const ka = A.ctx.S.joints.get("KA")!.at, fa = A.ctx.S.joints.get("FA")!.at;
  const rr = A.ctx.S.joints.get("RR")!.at;
  const on = (body: string, p: Vec3): Frame => {
    const o = A.local(body, [p[0], 0, p[2]]);
    const u = A.local(body, [p[0], 1, p[2]]);
    return A.frame(body, o, [u[0] - o[0], u[1] - o[1], u[2] - o[2]]);
  };
  const rod = A.ctx.kin.bodies.find((b) => b.id === "knifeRod")!.shape as { place: number; thickness: number };
  const r0 = ka[1] + rod.place; // the knife rod's outer face (world Y)
  const B693 = BEARINGS.find((b) => b.name === "693")!;
  A.drop(/^KA-/);
  A.build(on("crankK", ka), (L, H) => {
    L.add(H.shaft("KA-pin", { d: 5, z0: y.f0, z1: r0 }, { body: "crankK", name: "Knife's crank pin Ø5/Ø3, stepped, screwed into the knife's disc; the fork's return crank clamped on its outer end" }));
    L.add(H.shaft("KA-pin-s1", { d: 3, z0: r0, z1: y.k1 - 0.5, thread: { M: 3, z0: y.k0, z1: y.k1 - 0.5 } }, { body: "crankK", name: "" }));
    L.add(H.spacer("KA-shim", 3.2, 4.7, { body: "crankK", z0: r0, z1: r0 + 0.5, name: "Shim 3.2x4.7 x 0.5, the bearing's inner race off the pin's shoulder" }));
    L.add(H.bearing("KA-brg", B693, { body: "knifeRod", z0: r0 + 0.5, z1: r0 + 0.5 + B693.B }));
    L.add(H.spacer("KA-sp", 3.2, 4.7, { body: "crankK", z0: r0 + 0.5 + B693.B, z1: y.k0 }));
  }, { joints: ["KA"] });
  // the return crank: an arm from the knife's crank pin to the fork's, through the shaft's axis, bored only at its ends
  const fk = A.get("crankFk")!;
  const pk = A.local("crankFk", [ka[0], fk.frame.o[1], ka[2]]), pf = A.local("crankFk", [fa[0], fk.frame.o[1], fa[2]]);
  const centre = (q: [number, number][]) => [q.reduce((s, p) => s + p[0], 0) / q.length, q.reduce((s, p) => s + p[1], 0) / q.length];
  const faHole = fk.profile.holes.find((q) => Math.hypot(centre(q)[0]! - pf[0], centre(q)[1]! - pf[1]) < 1);
  const bore = h.disc(2.55, pk[0], pk[1]).reverse();
  A.set("crankFk", { profile: { outer: h.hullOf([[pk[0], pk[1], 6.5], [pf[0], pf[1], 6]]), holes: [bore, ...(faHole ? [faHole] : [])] } });
  // its boss's set screw bears on the pin, radially outward from the axis
  const out: Vec3 = [Math.sign(ka[0] - rr[0]), 0, 0];
  A.build({ o: [ka[0], (y.f0 + y.f1) / 2, ka[2]], x: [0, 0, 1], z: out }, (L, H) => {
    L.add(H.setScrew("FA-ss", 3, { body: "crankFk", z0: 2.6, z1: 6.4, name: "Set screw M3 (DIN 916), threadlocked: clamps the return crank on the knife's crank pin" }));
  }, { joints: ["FA"] });
  const old = A.ctx.notes.findIndex((n) => n.id === "KA");
  if (old >= 0) A.ctx.notes.splice(old, 1);
  A.note({ id: "KA", kit: "J3", at: ka, title: "J3 · KA", note: `KA: the knife's crank pin, stepped Ø5/Ø3 and screwed into the knife's disc, carries the rod's 693 bearing between a shim and an inner-race spacer and runs on ${(r0 - y.f0).toFixed(0)} mm to the fork's return crank, clamped on it by a set screw; the shaft ends in the disc, clear of the rod.`, badge: ["single shear", "warn"], d: 3, serves: { F2: ["KA-pin-s1", "FA-ss"], F3: ["KA-pin", "FA-ss"] } });
  // the knife slide's front end, 5 mm back, clear of the pin
  const front = Math.max(...["KS-rail1"].map((id) => Math.max(...A.get(id)!.profile.outer.map((p) => A.get(id)!.frame.o[0] + p[0]))));
  const cut = front - 12;
  const back = (id: string) => {
    const s = A.get(id);
    if (!s || Math.abs(s.frame.x[0] - 1) > 1e-9) return;
    const mv = (q: [number, number][]) => q.map(([u, v]): [number, number] => [s.frame.o[0] + u > cut ? u - 5 : u, v]);
    A.set(id, { profile: { outer: mv(s.profile.outer as [number, number][]), holes: s.profile.holes.map((q) => mv(q as [number, number][])) } });
  };
  ["KS-rail1", "KS-riser1", "KS-keeper"].forEach(back);
  for (const s of A.find(/^KS-sc1(-sh)?$/)) A.set(s.id, { frame: { ...s.frame, o: [s.frame.o[0] - 5, s.frame.o[1], s.frame.o[2]] } });
}
