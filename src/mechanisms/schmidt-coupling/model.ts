// Schmidt coupling (catalogue "schmidt-coupling"): three discs and two sets of three links join two parallel shafts e = 50 apart
// so that they turn together at exactly the same speed. The input disc turns about O1 with three pins at r = 40, 120° apart; three
// links A of length L = 60 join them to three pins on a floating middle disc, whose centre C is fixed in space (|C - O1| = |C - O3|
// = L, so C = (e/2, sqrt(L² - e²/4)) = (25, 54.5)) and which turns about C with the same angle; three links B, joining its other
// three pins (offset 60°) to three pins at r = 40 on the output disc about O3, finish the chain. Every link is a parallelogram's
// side, its vector the constant C - O1 or O3 - C, so every disc turns θ with the input and the output is in phase.
// The middle disc has no shaft: the links alone carry it. Heights: input disc layer 0, links A on layer 1, middle disc 2, links B 3, a gap (the heads of the pins below),
// output disc on layer 5; the output pivot is HUNG from a bridge over the output disc, since no shaft may rise from the base through the
// links' sweep (K6, deliberate; the catalogue shows the discs as pseudo-3D layers and does not carry the output shaft).
// The pins are on r = 44, not the catalogue's 40 (K6): with 40 the three links of a set meet end to end within 9.3 mm at the
// ends of their sweep, which leaves eyes of 4.6 mm, too small for a bearing; with 44 the gap is 16.2 mm and the eyes are 7.8 mm.
// One cycle is one input turn; the three pins on each disc repeat in 120°, so the picture repeats in a third of it, and the cycle
// is whole (K2).
import { TAU, dBore, polar, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

export const e = 50;
export const L = 60;
export const r = 44;
export const O1: Vec2 = [0, 0];
export const O3: Vec2 = [e, 0];
export const C: Vec2 = [e / 2, Math.sqrt(L * L - (e / 2) ** 2)];
const DISC_R = 53;
const LINK_W = 16;
const ks = [0, 1, 2];
/** The middle disc rides 3 mm up and the links B 7 (heights only): each clears the heads of the pins below it. */
const UP_MID = 3;
const UP_B = 7;

const discIn = P.disc("discIn", DISC_R, { role: "driver", layer: 0, holes: [dBore(5)], at: "O1", spin: (s) => s.th as number, name: "Input disc", marks: [ring(DISC_R - 3)] });
const discMid = P.disc("discMid", DISC_R, { role: "link", layer: 2, dz: UP_MID, at: "C", spin: (s) => s.th as number, name: "Middle disc, floating", marks: [ring(DISC_R - 3)] });
const discOut = P.disc("discOut", DISC_R, { role: "output", layer: 5, at: "O3", spin: (s) => s.th as number, name: "Output disc", marks: [ring(DISC_R - 3)] });
const linkA = ks.map((k) => P.link(`linkA${k}`, L, { role: "link", layer: 1, w: LINK_W, between: [`PA${k}`, `QA${k}`], name: `Link A${k + 1}` }));
const linkB = ks.map((k) => P.link(`linkB${k}`, L, { role: "link", layer: 3, dz: UP_B, w: LINK_W, between: [`QB${k}`, `PO${k}`], name: `Link B${k + 1}` }));

export default defineMechanism({
  id: "schmidt-coupling",
  input: { kind: "rotary", part: "discIn" },
  parts: [
    discIn,
    ...linkA,
    discMid,
    ...linkB,
    discOut,
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true, span: 1 }),
    P.cap("pO3", 5, 7, { fixed: [e, 0, 0], span: 0, top: "hung" }),
    ...ks.map((k) => P.cap(`cA${k}`, 0, 5.5, { at: `PA${k}`, span: 1 })),
    ...ks.map((k) => P.cap(`dA${k}`, 1, 5.5, { at: `QA${k}`, span: 1 })),
    ...ks.map((k) => P.cap(`dB${k}`, 2, 5.5, { at: `QB${k}`, span: 1 })),
    ...ks.map((k) => P.cap(`cB${k}`, 3, 5.5, { at: `PO${k}`, span: 2 })),
  ],
  solve(u): Solved {
    const th = u;
    const pts: Record<string, Vec2> = { O1, O3, C };
    for (const k of ks) {
      const a = th + (k * TAU) / 3;
      const b = a + Math.PI / 3;
      pts[`PA${k}`] = polar(r, a, O1[0], O1[1]);
      pts[`QA${k}`] = polar(r, a, C[0], C[1]);
      pts[`QB${k}`] = polar(r, b, C[0], C[1]);
      pts[`PO${k}`] = polar(r, b, O3[0], O3[1]);
    }
    return { pts, th };
  },
  paths: ["QA0", "PO0"],
  vel: ["PA0", "QB0"],
  forces: () => [
    { type: "spin", c: O1, r: DISC_R + 6, key: "input", z: 1.2 },
    { type: "spin", c: O3, r: DISC_R + 6, key: "output", z: 1.2 },
  ],
  plot: { label: "Output angle", unit: "°", f: (s) => ((s.th as number) * 180) / Math.PI },
});
