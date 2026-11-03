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
import { BEARINGS } from "../../hardware/tables";

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
  const live = (id: string, joint: string, turn: string, name: string, ends: [number, number], brg: [number, string][], spacers: [number, number][]) => {
    const at = A.ctx.S.joints.get(joint)!.at;
    const o = A.local(turn, at);
    const y = A.local(turn, [at[0], at[1] + 1, at[2]]);
    A.build(A.frame(turn, o, [y[0] - o[0], y[1] - o[1], y[2] - o[2]]), (L, H) => {
      L.add(H.shaft(`${id}-shaft`, { d: 8, z0: ends[0], z1: ends[1], flat: true }, { body: turn, name }));
      brg.forEach(([z, host], k) => L.add(H.bearing(`${id}-brg${k}`, B688, { body: host, z0: z, z1: z + B688.B, closure: "seal" })));
      spacers.forEach(([z0, z1], k) => L.add(H.spacer(`${id}-sp${k}`, 8.2, 10.8, { body: turn, z0, z1, ...(k ? { name: "" } : {}) })));
      // the end washer bears on the inner race alone where the end stands at a bearing
      ([[ends[0], -1], [ends[1], 1]] as const).forEach(([z, s], k) => {
        L.add(H.washer(`${id}-ew${k}`, 3.2, 9.5, { body: turn, z0: s > 0 ? z : z - 1.5, z1: s > 0 ? z + 1.5 : z, name: k ? "" : "End washer 3.2x9.5 x 1.5" }));
        L.add(H.screw(`${id}-es${k}`, "csk", 3, 10, { body: turn, face: z + s * 1.5, dir: s > 0 ? -1 : 1, ...(k ? { name: "" } : {}) }));
      });
    }, { joints: [joint] });
    // its note replaces the rules' one (A16)
    const old = A.ctx.notes.findIndex((n) => n.id === joint);
    if (old >= 0) A.ctx.notes.splice(old, 1);
    const held = brg[0]![1] === "ground" ? "each carved rail" : "each shell";
    A.note({ id: joint, kit: "J2", at, title: `J2 · ${joint}`, note: `${name}, in two sealed 688 bearings, one in ${held},${Math.abs(brg[1]![0] - brg[0]![0]).toFixed(0)} mm apart; clamped through inner-race spacers by an end washer and a countersunk screw at each end.`, badge: ["double shear", "ok"], d: 8, serves: { F2: [`${id}-ew0`, `${id}-ew1`], F3: [`${id}-shaft`] } });
  };
  // the crank shaft: the cranks and the cam keyed on it, a bearing seated in the outer layers of either shell
  A.drop(/^O-/);
  live("O", "O", "crank", "Crank shaft Ø8, live, D-flat: the cranks and the cam keyed on it", [-65, 65], [[-34, "body"], [29, "body"]], [[-60, -34], [-29, -16], [-10, 29], [34, 60]]);
  // the drums: each shaft in a bearing in either carved rail; the rear one runs on to the cutlery's crank discs
  A.drop(/^R[RF]-/);
  const kd = A.ctx.kin.bodies.find((b) => b.id === "crankK")!.shape as { place: number; thickness: number };
  const fd = A.ctx.kin.bodies.find((b) => b.id === "crankFk")!.shape as { place: number; thickness: number };
  const disc = (s: { place: number; thickness: number }): [number, number] => [s.place, s.place + s.thickness];
  const [k0, k1] = disc(kd), [f0] = disc(fd);
  live("RR", "RR", "rollerR", "Rear drum's shaft Ø8, live, D-flat: the drum and the cutlery's crank discs keyed on it", [f0, 79], [[-79, "ground"], [74, "ground"]], [[k1, -79], [-74, -66], [66, 74], [disc(fd)[1], k0]]);
  live("RF", "RF", "rollerF", "Front drum's shaft Ø8, live, D-flat", [-79, 79], [[-79, "ground"], [74, "ground"]], [[-74, -66], [66, 74]]);
  void h;
};
