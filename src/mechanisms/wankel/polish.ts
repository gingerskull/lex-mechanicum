// Overrides and additions to the generated Wankel assembly (standard 5.2). The model has the housing with its epitrochoid
// bore, the fixed gear on the shaft's axis, the rotor's toothed ring plate, its web, and the crank web keyed to the input
// shaft; the rules build the shaft's housing, key and bearings, the posts under the housing and the fixed gear, the mesh's
// marks and the drive. What differs from the rules:
// - the eccentric journal, a pin on the crank web at E, and the bearing between it and the rotor web (6804, a circlip each
//   side): the rotor turns on it (F2);
// - the rotor's ring plate and web bolted together at the three apexes through spacer sleeves, round the crank web (the
//   rotor is one body);
// - the three apex seals, hardened strips in slots at the apexes, replaceable wear parts that slide on the housing (M14, F8);
// - inside fillets R6 where the web's arms meet (M7);
// - the turning spacer on the shaft lifted off the fixed gear's face (A12);
// - notes, badges and build rules (A16).
import { circle, polar, roundedPoly, xf, type Vec2 } from "../../core/geom";
import { circlipInt } from "../../hardware/tables";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { APEX, BORE_R, e } from "./model";

const TAU = Math.PI * 2;
const JOURNAL_R = 10;
/** The spacer sleeves and screws joining the rotor's plates, on the apexes' radius; the journal's own screws. */
const JOIN = { R: 80, M: 4 };
const JOURNAL_SCREWS = { n: 3, R: 6, M: 3 };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const rotor = A.get("rotor")!;
  const web = A.get("rotorWeb")!;
  const crank = A.get("crank")!;
  const fgear = A.get("fgear")!;

  // ---- M7: the web's inside corners between the arms are filleted R6 ----
  web.outer = H.filletPoly(web.outer, 6);

  // ---- A12: the shaft's turning spacer stands clear of the fixed gear's face ----
  A.set("pO-sp0", { z0: fgear.z1 + 0.6 });

  // ---- the journal: a pin on the crank web at E, up through the rotor web's bearing ----
  const zTop = web.z1;
  const journal = H.plate("journal", H.disc(JOURNAL_R), {
    name: "Eccentric journal Ø20, on the crank web",
    body: "crank",
    at: [e, 0, 0],
    role: "driver",
    kind: "plate",
    z0: crank.z1,
    z1: zTop,
    ex: crank.ex + 0.5,
    joints: ["pO"],
    mat: "Steel C45, ground",
  });
  A.add(journal);
  for (let i = 0; i < JOURNAL_SCREWS.n; i++) {
    const [x, y] = polar(JOURNAL_SCREWS.R, (i * TAU) / JOURNAL_SCREWS.n + Math.PI / 6) as Vec2;
    journal.holes.push(circle(JOURNAL_SCREWS.M / 2 + 0.3, x, y, 16));
    crank.marks.push({ kind: "thread", pts: circle(JOURNAL_SCREWS.M / 2 - 0.2, e + x, y, 16) });
    A.add(H.screw(`journal-s${i}`, "csk", JOURNAL_SCREWS.M, zTop - (crank.z0 + 2), { body: "crank", at: [e + x, y, 0], joints: ["pO"], face: zTop, dir: -1, ex: journal.ex + 0.5 }));
  }
  // the rotor web's bearing on it, a circlip each side
  const cl = circlipInt(2 * BORE_R);
  const zb0 = web.z0 + cl.s;
  A.add(
    H.bearing("rotor-brg", { name: "6804", d: 20, D: 32, B: 7 }, { body: "rotorWeb", at: [0, 0, 0], joints: ["pO"], z0: zb0, closure: "shield", ex: web.ex }),
    H.circlip("rotor-cl0", 2 * BORE_R, { internal: true, body: "rotorWeb", at: [0, 0, 0], joints: ["pO"], z0: web.z0, z1: zb0, ex: web.ex }),
    H.circlip("rotor-cl1", 2 * BORE_R, { internal: true, body: "rotorWeb", at: [0, 0, 0], joints: ["pO"], z0: zb0 + 7, z1: zb0 + 7 + cl.s, ex: web.ex }),
  );

  // ---- the rotor's plates bolted together at the three apexes, round the crank web ----
  for (let k = 0; k < 3; k++) {
    const [x, y] = polar(JOIN.R, (k * TAU) / 3) as Vec2;
    const G = { body: "rotor", at: [x, y, 0] as [number, number, number], joints: ["pO"] };
    A.add(H.tube(`rotor-sp${k}`, JOIN.M + 0.4, 12, { ...G, name: k ? "" : `Rotor spacer sleeve Ø12 x ${(web.z0 - rotor.z1).toFixed(0)}, 3 off, between the ring plate and the web`, role: rotor.role, z0: rotor.z1, z1: web.z0, ex: rotor.ex + 0.5, mat: "Steel C45" }));
    web.holes.push(circle(JOIN.M / 2 + 0.3, x, y, 20));
    rotor.marks.push({ kind: "thread", pts: circle(JOIN.M / 2 - 0.3, x, y, 20) });
    A.add(H.screw(`rotor-s${k}`, "button", JOIN.M, web.z1 - (rotor.z1 - 5), { ...G, face: web.z1, dir: -1, ex: web.ex + 0.5 }));
  }

  // ---- M14, F8: the apex seals, hardened strips in slots at the apexes, on the rotor ----
  for (let k = 0; k < 3; k++) {
    const strip = xf(roundedPoly([[APEX - 4, -5.5], [APEX - 4, 5.5]], 1.1), [0, 0, (k * TAU) / 3]);
    A.add(
      H.wearStrip(`apex-seal${k}`, strip, {
        name: k ? "" : "Apex seal, hardened strip in the rotor's apex slot, 3 off, spring-loaded",
        body: "rotor",
        at: [0, 0, 0],
        role: rotor.role,
        z0: rotor.z0 + 0.5,
        z1: rotor.z1 - 0.5,
        ex: rotor.ex + 0.2,
        joints: [],
      }),
    );
  }
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pO", { note: `${A.joint("pO").note} The shaft ends under the crank web, which carries the eccentric journal; the rotor's web rides on the journal on a 6804 between two circlips, and the rotor turns on that, a third of the shaft's speed, round the fixed gear.` });
  A.rules.push(
    { title: "Gear phase first", text: "Match marks at the mesh of the fixed gear and the rotor's internal teeth: set them on the line of centres with an apex pointing at the housing's long axis, then close the plates." },
    { title: "The rotor is one body", text: "The ring plate and the web are bolted through three spacer sleeves at the apexes, round the crank web; the web carries the journal's bearing, the ring plate the internal gear and the apex seals." },
    { title: "Apex seals are wear parts", text: "Three hardened strips in slots at the apexes slide on the housing's bore; they are the parts that wear, screwed out and replaced." },
    { title: "Backlash comes from the gears' tolerances", text: "The crank is cut to the eccentricity, 15 mm, so the centre distance of the gears is fixed, not adjusted: the gears are cut with their backlash." },
    { title: "Kinematics untouched", text: "The bore, the rotor outline, the gear teeth and the eccentricity are the model's; the journal, bearing, sleeves, screws and seals are fitted round them." },
  );
};
