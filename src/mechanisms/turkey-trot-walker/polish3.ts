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
// - F5, F7: the toes stay level on a light torsion spring round each ankle pin, its legs against the shank and the toe
//   plate's lug: no rule builds a sprung joint between two moving parts.
import type { Polish } from "../../builder";
import { patternMarks } from "../../builder/decor";

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
  const q = A.local("lever", A.ctx.S.joints.get("Q")!.at);
  A.build(A.frame("lever", q), (L, H) => {
    L.add(H.dowel("Q-stud", 4, { body: "lever", z0: -2, z1: 7.6, name: "Stud Ø4, pressed into the lever" }));
    L.add(H.roller("Q-roller", 4, 5, { body: "lever", z0: 3.2, z1: 6.8, name: "Roller Ø5 in the hanger's slot" }));
  }, { joints: ["Q"] });
  void h;
};
