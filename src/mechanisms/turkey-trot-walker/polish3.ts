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
// - F5, F7: the toes stay level on a light torsion spring round each ankle pin's head, one tail on the toe plate and one
//   up the shank: no rule builds a sprung joint between two moving parts.
// - A5, J2: the crank shaft turns in a moving frame, so the rules build its pins as shoulder bolts on bearings; it is a
//   live shaft with the cranks and the cam keyed on it, in a bearing seated in the outer layers of either shell.
// - J10, T12: the carved rails are the drums' bearing housings (as in the concept): each drum's shaft runs in a bearing in
//   either rail, so the rules' pillow blocks under the rear drum and the cartridge housing on the near rail are not built
//   (named in the record's `teaching.exceptions`); the rear shaft runs on past the near rail and ends in the knife's
//   crank disc, held by a set screw in its rim instead of an end washer.
// - A9, J3, J5: the fork's crank is a return crank clamped on the knife's crank pin (owner's decision, 4 Nov), so no shaft
//   runs through the knife rod's plane; the knife slide's front end stands back 5 mm, clear of the pin (returnCrank).
// - L2: the toes' hinge lugs end at the toe plate's sole, not under it in the belt.
// - J4: the spreader's rod runs straight in each feather's own slot (Q1 to Q21): the kit's stud, track roller, wear
//   strips and felt are not built, nor its wider cut for the roller, which is wider than a feather's tail and would cut
//   away all the tail's material round the slot (fanSlots). The rod ends 2 mm past the last feather, a DIN 471 circlip
//   in a groove behind it holding the stack; the record's rod runs on 8 mm past the stack (rodEnd).
// - J5: the spreader rises and falls on a guide rod pressed into the body's arm, through a bushed boss on its web: the
//   kit builds no guide for a rod carried crosswise between two moving bodies.
// - J3: the feathers turn on a Ø6 stud pressed into a walnut post glued into the rump's web, each in a bushing, held by a
//   washer and a circlip behind the last: the rules thread a shoulder bolt into the first feather, as the body has no
//   solid at the pivot, which leaves the fan hanging behind the rump (fanPivot).
// - V1 to V3, F10: the motor is in the body, not under the base: the crank shaft turns in the moving body, so the drive
//   rule finds no fixed live shaft. A pancake motor on three standoffs on the web's far face, in the far cavity, belted
//   16T to 32T to the crank shaft; the far shells are pocketed round it. No home flag or sensor is built.
// - L8, P14: "CARVE" and the knife's and the fork's stroke ends engraved on the keepers of the slide block.
import type { Polish } from "../../builder";
import { patternMarks } from "../../builder/decor";
import type { Frame } from "../../builder/frames";
import type { Local } from "../../builder/lib";
import { stroke } from "../../hardware/primitives";
import { BEARINGS, MOTORS, PULLEYS, circlipExt } from "../../hardware/tables";
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
  fanSlots(A);
  rodEnd(A);
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
  ankleSprings(A);
  spreaderGuide(A, h);
  fanPivot(A, h);
  motor(A, h);
  carveMarks(A);
};

/** A frame at a world point, z along world +Y (local z is world Y less the point's), x along world -X (local y is Z up). */
const acrossY = (p: Vec3): Frame => ({ o: [p[0], 0, p[2]], x: [-1, 0, 0], z: [0, 1, 0] });

/** The ankle springs: a torsion coil round the ankle pin's head, between the toe plate and the leg (F5, F7). */
function ankleSprings(A: Parameters<Polish>[0]): void {
  for (const [s, toes, leg] of [["n", "toes", "leg"], ["f", "toesF", "legF"]] as const) {
    const F = A.ctx.S.joints.get(`F${s}`)!.at, K = A.ctx.S.joints.get(`K${s}`)!.at;
    const spanY = (id: string): number[] => {
      const q = A.get(id);
      return q ? [q.frame.o[1], q.frame.o[1] + q.frame.z[1] * (q.op.op === "extrude" ? q.op.h : 0)] : [];
    };
    // the coil round the pin's head and washer, from the head's end to 0.5 mm off the leg's (or its skin's) face
    const hy = [...spanY(`F${s}-bolt-head`), ...spanY(`F${s}-bolt-wsh`)];
    const ly = [...spanY(leg), ...spanY(`${leg}-skin`)];
    const below = Math.max(...hy) < Math.max(...ly);
    const [z0, z1] = below ? [Math.min(...hy) + 0.1, Math.min(...ly) - 0.5] : [Math.max(...ly) + 0.5, Math.max(...hy) - 0.1];
    const D = 9, wire = 0.6;
    const toW = (p: Vec3): [number, number] => [-(p[0] - F[0]), p[2] - F[2]];
    const k = toW(K), kl = Math.hypot(k[0], k[1]), up: [number, number] = [k[0] / kl, k[1] / kl];
    const sole = A.get(toes)!.frame.o[2] + (A.get(toes)!.op.op === "extrude" ? (A.get(toes)!.op as { h: number }).h : 0) - F[2];
    A.build(acrossY(F), (L, H) => {
      L.add(H.spring(`F${s}-spring`, "torsion", { D, wire, body: toes, z0, z1, name: `Torsion spring Ø${D}, wire ${wire}: holds the toes level against their stops` }));
      // its tails: one down on the toe plate, one up the shank
      const zt = below ? z0 : z1 - wire;
      L.add(H.solid(`F${s}-spring-toe`, { name: "", kind: "spring", mat: "Spring steel EN 10270", body: toes, outer: stroke([[D / 2 - wire / 2, 0], [D / 2 - wire / 2, sole + wire / 2], [D / 2 + 5, sole + wire / 2]], wire / 2), z0: zt, z1: zt + wire }));
      // (from just outside the coil: the coil turns with the toes, the tail with the leg)
      const r = D / 2 + wire / 2 + 0.1, a = Math.atan2(up[1], up[0]) + Math.PI / 2;
      const zs = below ? z1 - wire : z0;
      L.add(H.solid(`F${s}-spring-leg`, { name: "", kind: "spring", mat: "Spring steel EN 10270", body: leg, outer: stroke([[r * Math.cos(a), r * Math.sin(a)], [r * Math.cos(a) + up[0] * 10, r * Math.sin(a) + up[1] * 10]], wire / 2), z0: zs, z1: zs + wire }));
    }, { joints: [`F${s}`] });
  }
}

/** The spreader's guide: a rod pressed into the body's arm, through a bushed boss on the spreader's web (J5). */
function spreaderGuide(A: Parameters<Polish>[0], h: Parameters<Polish>[1]): void {
  const g: Vec3 = [-180.5, -4, 0];
  const web = A.get("spreader-web")!, arm = A.get("body-arm")!;
  const z0 = Math.min(...worldZ(web)), z1 = Math.max(...worldZ(web));
  const armTop = Math.max(...worldZ(arm));
  A.build({ o: g, x: [1, 0, 0], z: [0, 0, 1] }, (L, H) => {
    L.add(H.solid("SS-boss", { name: "Guide boss on the spreader's web", kind: "plate", role: "link", mat: "Brass", body: "spreader", outer: h.disc(4.5), holes: [h.disc(3).reverse()], z0, z1 }));
    L.add(H.bushing("SS-bush", 4, 6, { body: "spreader", z0, z1 }));
    L.add(H.shaft("SS-rod", { d: 4, z0: armTop - 9, z1: z1 + 4.5 }, { body: "body", name: "Guide rod Ø4 h6, pressed into the body's arm: the spreader rises and falls on it" }));
  }, { joints: ["SS"] });
}

/**
 * The feathers' own slots (J4): the rod runs straight in the slot each feather's record shape gives it, so the kit's
 * wider cut for its track roller (dropped with the roller) is not made either. The kit's cut is the hole that encloses
 * one of the record's own windows with room to spare all round.
 */
function fanSlots(A: Parameters<Polish>[0]): void {
  type P2 = readonly number[];
  const inPoly = (p: P2, poly: readonly P2[]) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i]!, b = poly[j]!;
      if (a[1]! > p[1]! !== b[1]! > p[1]! && p[0]! < ((b[0]! - a[0]!) * (p[1]! - a[1]!)) / (b[1]! - a[1]!) + a[0]!) c = !c;
    }
    return c;
  };
  const box = (q: readonly P2[]) => [Math.min(...q.map((p) => p[0]!)), Math.max(...q.map((p) => p[0]!)), Math.min(...q.map((p) => p[1]!)), Math.max(...q.map((p) => p[1]!))] as const;
  for (const s of A.find(/^f\d+$/)) {
    const own = A.ctx.geoms.get(s.body)?.profile.holes ?? [];
    const kits = (hl: readonly P2[]) => {
      const b = box(hl);
      return own.some((w) => {
        const o = box(w);
        return inPoly([(o[0] + o[1]) / 2, (o[2] + o[3]) / 2], hl) && b[0] < o[0] - 0.5 && b[1] > o[1] + 0.5 && b[2] < o[2] - 0.5 && b[3] > o[3] + 0.5;
      });
    };
    const holes = s.profile.holes.filter((hl) => !kits(hl));
    if (holes.length !== s.profile.holes.length) A.set(s.id, { profile: { outer: s.profile.outer, holes } });
  }
}

/**
 * The rod's end (J4): it stops 2 mm past the last feather, a DIN 471 circlip in a groove just behind it holding the
 * stack against the spreader's web.
 */
function rodEnd(A: Parameters<Polish>[0]): void {
  const rod = A.get("spreader")!;
  const f21 = A.get("f21")!;
  // depth along the rod's own z (it runs back along -X from the web) of the last feather's back face
  const zs = [0, f21.op.op === "extrude" ? f21.op.h : 0].map((t) => (f21.frame.o[0] + f21.frame.z[0] * t - rod.frame.o[0]) * rod.frame.z[0]);
  const back = Math.max(...zs);
  const g = back + 0.2, end = back + 2;
  if (rod.op.op === "extrude") A.set("spreader", { op: { ...rod.op, h: g } });
  A.build({ o: rod.frame.o, x: rod.frame.x, z: rod.frame.z }, (L, H) => {
    L.add(H.shaft("spreader-end", { d: 4, z0: g, z1: end, grooves: [g] }, { body: "spreader", name: "", ...(rod.mat ? { mat: rod.mat } : {}) }));
    L.add(H.circlip("spreader-cl", 4, { body: "spreader", z0: g + 0.05 }));
  }, { joints: Array.from({ length: 21 }, (_, i) => `Q${i + 1}`) });
}

/**
 * The fan's pivot on the body (J3): a walnut post glued into the rump's web carries a steel stud on which every feather
 * turns in its own bushing, held by a washer and a circlip behind the last one. The rules thread a shoulder bolt into the
 * first feather, as the body has no solid at P, so the stack would hang free of the rump.
 */
function fanPivot(A: Parameters<Polish>[0], h: Parameters<Polish>[1]): void {
  const P = A.ctx.S.joints.get("P1")!.at;
  const joints = Array.from({ length: 21 }, (_, i) => `P${i + 1}`);
  A.drop(/^P1-bolt/);
  // the first feather turns in a bushing like the others (the rules tapped it for the bolt)
  const f1 = A.get("f1")!, f2 = A.get("f2")!;
  const centre = (q: number[][]) => [q.reduce((s, p) => s + p[0]!, 0) / q.length, q.reduce((s, p) => s + p[1]!, 0) / q.length];
  const near0 = (q: number[][]) => Math.hypot(centre(q)[0]!, centre(q)[1]!) < 0.5;
  const bore = f2.profile.holes.find(near0)!;
  A.set("f1", { profile: { outer: f1.profile.outer, holes: f1.profile.holes.map((q) => (near0(q) ? bore : q)) } });
  // local z runs back along -X from P: the depth behind P of a feather's two faces
  const depth = (id: string): [number, number] => {
    const s = A.get(id)!;
    const hh = s.op.op === "extrude" ? s.op.h : 0;
    const zs = [s.frame.o[0], s.frame.o[0] + s.frame.z[0] * hh].map((x) => P[0] - x);
    return [Math.min(...zs), Math.max(...zs)];
  };
  const front = depth("f1")[0], zEnd = depth("f21")[1];
  const rump = -172; // the post's foot (world X), where the rump's face meets the post's underside
  const c = circlipExt(6);
  const zw = zEnd + 0.3, zg = zw + 1;
  A.build({ o: P, x: [0, 1, 0], z: [-1, 0, 0] }, (L, H) => {
    L.add(H.bushing("P1-0-bush", 6, 9, { body: "f1", z0: front, z1: depth("f1")[1] }));
    L.add(H.solid("P-post", { name: "Fan post, walnut, glued into the rump's web", kind: "plate", role: "link", mat: "Walnut, oiled", outer: h.disc(7), holes: [h.disc(3).reverse()], z0: P[0] - rump, z1: front - 0.5, body: "body" }));
    L.add(H.shaft("P-stud", { d: 6, z0: P[0] - rump + 4, z1: zg + c.s + 1.2, grooves: [zg] }, { body: "body", name: "Fan stud Ø6 h6, pressed into the post: every feather turns on it in its bushing" }));
    L.add(H.washer("P-wsh", 6.4, 12, { body: "body", z0: zw, z1: zg, name: "Washer 6.4x12 x 1, behind the last feather" }));
    L.add(H.circlip("P-cl", 6, { body: "body", z0: zg + 0.05 }));
  }, { joints });
  // the post's tongue, in the plane of the web and glued into it
  A.build({ o: [P[0], 0, P[2]], x: [-1, 0, 0], z: [0, 1, 0] }, (L, H) => {
    L.add(H.solid("P-tongue", { name: "", kind: "plate", role: "link", mat: "Walnut, oiled", outer: h.hullOf([[P[0] + 178, 0, 7], [P[0] + 158, 0, 7]]), z0: -3, z1: 3, body: "body" }));
  }, { joints });
  const old = A.ctx.notes.findIndex((n) => n.id === "P1");
  if (old >= 0) A.ctx.notes.splice(old, 1);
  A.note({ id: "P1", kit: "J3", at: P, title: "J3 · P1", note: "P1 to P21: the feathers' common pivot, a Ø6 stud pressed into a walnut post that stands out of the rump's web; each feather turns on it in a bronze bushing, the stack held by a washer and a circlip behind the last feather.", badge: ["post on the rump", "ok"], d: 6, serves: { F2: ["P-cl"], F3: ["P-stud"] } });
}

/** The world Z of a solid's profile at its two faces. */
function worldZ(s: { frame: Frame; profile: { outer: number[][] }; op: { op: string; h?: number } }): number[] {
  const f = s.frame, y = [f.z[1] * f.x[2] - f.z[2] * f.x[1], f.z[2] * f.x[0] - f.z[0] * f.x[2], f.z[0] * f.x[1] - f.z[1] * f.x[0]];
  const hh = s.op.op === "extrude" ? (s.op.h ?? 0) : 0;
  return s.profile.outer.flatMap(([u, v]) => [0, hh].map((w) => f.o[2] + f.x[2] * u! + y[2]! * v! + f.z[2] * w));
}

/** The motor in the body's far cavity, belted to the crank shaft (V1 to V3). */
function motor(A: Parameters<Polish>[0], h: Parameters<Polish>[1]): void {
  const O = A.ctx.S.joints.get("O")!.at;
  const M: Vec3 = [-62, 0, 20];
  const mot = MOTORS.pancake;
  const web1 = 3; // the web's far face
  const belt: [number, number] = [web1 + 1, web1 + 9]; // the pulleys' span, flanges included
  const m0 = belt[1] + 0.5, m1 = m0 + mot.H;
  const P16 = PULLEYS[16], P32 = PULLEYS[32];
  const F = acrossY(O);
  const loc = (p: Vec3): [number, number] => [-(p[0] - O[0]), p[2] - O[2]];
  const m = loc(M);
  const pulley = (L: Local, H: Parameters<Polish>[1],id: string, c: [number, number], p: typeof P16, bore: number, body: string) => {
    const hole = () => [h.disc(bore / 2 + 0.05, c[0], c[1]).reverse()];
    L.add(H.solid(id, { name: `GT2 timing pulley ${p.T}T`, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6", outer: h.disc(p.od / 2, c[0], c[1]), holes: hole(), z0: belt[0]! + 1, z1: belt[1]! - 1, body }));
    L.add(H.solid(`${id}-fl0`, { name: "", kind: "pulley", role: "hw", outer: h.disc(p.fd / 2, c[0], c[1]), holes: hole(), z0: belt[0]!, z1: belt[0]! + 1, body }));
    L.add(H.solid(`${id}-fl1`, { name: "", kind: "pulley", role: "hw", outer: h.disc(p.fd / 2, c[0], c[1]), holes: hole(), z0: belt[1]! - 1, z1: belt[1]!, body }));
  };
  A.build(F, (L, H) => {
    L.add(H.solid("drive-motor", { name: mot.name, kind: "motor", role: "hw", mat: "Aluminium housing, neodymium rotor", outer: h.disc(mot.R, m[0], m[1]), z0: m0, z1: m1, body: "body" }));
    L.add(H.solid("drive-motor-core", { name: "", kind: "motorInternal", role: "hw", outer: h.disc(mot.R - 4, m[0], m[1]), z0: m0 + 3, z1: m1 - 3, faint: true, inset: true, body: "body" }));
    L.add(H.shaft("drive-shaft", { d: mot.shaft, z0: belt[0]! + 0.5, z1: m0 }, { name: `Motor shaft Ø${mot.shaft}`, at: [m[0], m[1], 0], body: "body" }));
    pulley(L, H, "drive-pulley-motor", m, P16, mot.shaft, "body");
    pulley(L, H, "drive-pulley-shaft", [0, 0], P32, 8, "crank");
    const rb = P16.pd / 2, rB = P32.pd / 2;
    L.add(H.solid("drive-belt", { name: "GT2 belt 6 mm, closed loop", kind: "belt", role: "hw", mat: "Neoprene, glass-fibre cords", outer: h.hullOf([[m[0], m[1], rb + 0.7], [0, 0, rB + 0.7]]), holes: [h.hullOf([[m[0], m[1], rb - 0.7], [0, 0, rB - 0.7]]).reverse()], z0: belt[0]! + 1.5, z1: belt[1]! - 1.5, body: "body" }));
    // three standoffs from the web to the motor's face, away from the belt; a countersunk screw from the web's near face
    const toO = Math.atan2(-m[1], -m[0]);
    [1, 3, 5].forEach((k, i) => {
      const a = toO + (k * Math.PI) / 3;
      const at: Vec3 = [m[0] + 19 * Math.cos(a), m[1] + 19 * Math.sin(a), 0];
      L.add(H.standoff(`drive-so${i}`, { at, z0: web1, z1: m0, body: "body", name: i ? "" : "Standoff Ø10, M3: the motor's face screwed to it", ...(i ? { qty: 0 } : { qty: 3 }) }));
      L.add(H.screw(`drive-sc${i}`, "csk", 3, 8, { at, face: -web1, dir: 1, body: "body", ...(i ? { name: "", qty: 0 } : { qty: 3 }) }));
    });
  }, { joints: ["drive"] });
  // the crank shaft's spacer splits round its pulley
  const sp = A.get("O-sp2")!;
  const spz = [sp.frame.o[1], sp.frame.o[1] + sp.frame.z[1] * (sp.op.op === "extrude" ? sp.op.h : 0)].sort((a, b) => a - b);
  A.drop("O-sp2");
  A.build(F, (L, H) => {
    L.add(H.spacer("O-sp2", 8.2, 10.8, { body: "crank", z0: spz[0]!, z1: belt[0]!, name: "" }));
    L.add(H.spacer("O-sp4", 8.2, 10.8, { body: "crank", z0: belt[1]!, z1: spz[1]!, name: "" }));
  }, { joints: ["O"] });
  // the far shells pocketed round the motor
  for (const s of A.find(/^body-shellF\d+$/)) {
    const zz = [s.frame.o[1], s.frame.o[1] + s.frame.z[1] * (s.op.op === "extrude" ? s.op.h : 0)];
    if (Math.max(...zz) <= m0 || Math.min(...zz) >= m1) continue;
    const c: Vec3 = [M[0], s.frame.o[1], M[2]];
    const f = s.frame, yy: Vec3 = [f.z[1] * f.x[2] - f.z[2] * f.x[1], f.z[2] * f.x[0] - f.z[0] * f.x[2], f.z[0] * f.x[1] - f.z[1] * f.x[0]];
    const d: Vec3 = [c[0] - f.o[0], c[1] - f.o[1], c[2] - f.o[2]];
    const u = d[0] * f.x[0] + d[1] * f.x[1] + d[2] * f.x[2], v = d[0] * yy[0] + d[1] * yy[1] + d[2] * yy[2];
    A.set(s.id, { profile: { outer: s.profile.outer, holes: [...s.profile.holes, h.disc(mot.R + 1, u, v).reverse()] } });
  }
  A.note({ id: "drive", kit: "drive", at: M, title: "Drive", note: "Brushless pancake motor in the body's far cavity, its face on three standoffs screwed to the web; GT2 16T to 32T belt to a pulley keyed on the crank shaft between the web and the motor; the far shells pocketed round it.", badge: ["motor driven", "ok"] });
}

/** "CARVE" and the carriages' stroke ends, engraved on the keepers' tops (L8). */
function carveMarks(A: Parameters<Polish>[0]): void {
  const G: Record<string, [number, number][][]> = {
    C: [[[3.5, 4.2], [2.8, 5], [0.7, 5], [0, 4.2], [0, 0.8], [0.7, 0], [2.8, 0], [3.5, 0.8]]],
    A: [[[0, 0], [1.75, 5], [3.5, 0]], [[0.6, 1.8], [2.9, 1.8]]],
    R: [[[0, 0], [0, 5], [2.6, 5], [3.4, 4.3], [3.4, 3.2], [2.6, 2.5], [0, 2.5]], [[1.6, 2.5], [3.5, 0]]],
    V: [[[0, 5], [1.75, 0], [3.5, 5]]],
    E: [[[3.5, 5], [0, 5], [0, 0], [3.5, 0]], [[0, 2.5], [2.6, 2.5]]],
  };
  for (const [slide, carriage, text] of [["KS", "knife", "CARVE"], ["FS", "fork", ""]] as const) {
    const k = A.get(`${slide}-keeper`)!;
    if (Math.abs(k.frame.x[0] - 1) > 1e-9 || Math.abs(k.frame.z[2] - 1) > 1e-9) continue;
    const c = A.get(carriage)!;
    const cx = c.profile.outer.map((p) => p[0]!), back = Math.min(...cx);
    // the carriage's rear edge at either end of its stroke, in the keeper's frame: an in-line slider-crank, its pin on the
    // slide's line at the reference, so the carriage stands at one end there and twice the crank from it at the other
    const pin = A.ctx.S.joints.get(slide === "KS" ? "KA" : "FA")!.at, axis = A.ctx.S.joints.get("RR")!.at;
    const dx = pin[0] - axis[0];
    const run: [number, number] = dx > 0 ? [-2 * dx, 0] : [0, -2 * dx];
    const ends = run.map((s) => c.frame.o[0] + back + s - k.frame.o[0]);
    const ky = k.profile.outer.map((p) => p[1]!), y0 = Math.min(...ky), y1 = Math.max(...ky);
    const yb = y0 + 2, yt = yb + 2.5;
    const marks = [...k.marks, { kind: "carve" as const, pts: [[ends[0]!, yb], [ends[1]!, yb]] as [number, number][] }];
    for (const x of ends) marks.push({ kind: "carve" as const, pts: [[x, yb - 1], [x, yt]] });
    if (text) {
      const w = text.length * 3.5 + (text.length - 1) * 1.2;
      let x = (ends[0]! + ends[1]!) / 2 - w / 2;
      const base = yt + 1;
      if (base + 5 < y1 - 1) for (const ch of text) {
        for (const pl of G[ch]!) marks.push({ kind: "carve" as const, pts: pl.map(([u, v]): [number, number] => [x + u, base + v]) });
        x += 4.7;
      }
    }
    A.set(k.id, { marks });
  }
}

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
