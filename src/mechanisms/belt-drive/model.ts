// Belt drive (catalogue "belt-drive"): an open timing belt from a 24-groove driver pulley to a 48-groove driven pulley,
// ratio 2:1, both turning the same way. The belt is an HTD 8M timing belt (8 mm pitch, 3.4 mm teeth), so the ratio is
// exact and the motion shows: its teeth sit in the pulleys' grooves and are carried round the loop.
// K6: the catalogue's 60 and 120 mm pitch diameters at a 200 mm centre distance become the 8M pitch circles of 24 and 48
// grooves (61.1 and 122.2 mm), and the centre distance is set for a whole number of belt teeth (87, 696 mm pitch length;
// C = 201.7 mm), as a timing belt needs. The catalogue's sag on the slack side is taken up by the idler (the rules), so both
// spans are drawn straight.
// The belt is declared a timing belt (J12): its back is the fixed band round the pitch path here (it looks the same at
// every phase), its teeth are carried round by the solved travel t (the rules). Driver on the left at O1, turning
// counter-clockwise: the upper span runs onto it and is the tight side, the lower span is slack.
import { HTD as PROFILES, beltPath, centresFor } from "../../core/flex";
import { TAU, circle, polar, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

/** HTD 8M: the pitch and the profile (pitch line differential, tooth and belt height, the groove), mm. */
export const HTD = { p: 8, ...PROFILES[8]! };
export const Z1 = 24;
export const Z2 = 48;
export const N_TEETH = 87;
export const R1 = (HTD.p * Z1) / TAU;
export const R2 = (HTD.p * Z2) / TAU;
export const C = centresFor(R1, R2, N_TEETH * HTD.p);
/** Half the angle the spans make with the line of centres. */
export const BETA = Math.asin((R2 - R1) / C);
const SPAN = Math.sqrt(C * C - (R2 - R1) * (R2 - R1));
/** Driven phase: its grooves meet the teeth that arrive from the lower span. */
const PHI2 = -Math.PI / 2 - BETA - (R1 * (Math.PI - 2 * BETA) + SPAN) / R2;
/** Driver phase: a groove at the path's start. */
const PHI1 = Math.PI / 2 + BETA;

/** The band of the belt's back: from the teeth's root line to the back, offset from the pitch path. */
const band = (off: number): Vec2[] => beltPath([0, 0], R1 + off, [C, 0], R2 + off, Math.PI / 96);

const driver = P.pulley("driver", Z1, HTD.p, { a0: PHI1, role: "driver", at: "O1", spin: (s) => s.a as number, holes: [circle(6, 0, 0, 36)], name: `Driver timing pulley, ${Z1} grooves HTD 8M` });
const driven = P.pulley("driven", Z2, HTD.p, { role: "output", at: "O2", spin: (s) => s.b as number, holes: [circle(7.2, 0, 0, 36)], name: `Driven timing pulley, ${Z2} grooves HTD 8M` });

export default defineMechanism({
  id: "belt-drive",
  input: { kind: "rotary", part: "driver" },
  parts: [
    driver,
    driven,
    P.custom("belt", band(HTD.hs - HTD.ht - HTD.pld), {
      role: "link",
      dz: 0.6,
      thick: 5.8,
      fixed: [0, 0, 0],
      holes: [band(-HTD.pld + 0.05)],
      name: `Timing belt HTD 8M, ${N_TEETH} teeth, ${N_TEETH * HTD.p} mm pitch length, 6 mm wide`,
    }),
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO2", -1, 7, { fixed: [C, 0, 0] }),
  ],
  flexible: [{ form: "belt", over: ["driver", "driven"], travel: "t", pitch: HTD.p, band: "belt" }],
  solve(u) {
    const a = u;
    // no slip: the belt's travel is the driver's pitch radius times its angle; the driven pulley turns by it over its own
    const t = u * R1;
    const b = t / R2 + PHI2;
    return {
      pts: {
        O1: [0, 0],
        O2: [C, 0],
        V1: polar(R1, a + Math.PI / 2),
        T1: polar(R1, PHI1),
        T1b: polar(R2, PHI1, C, 0),
        S1: polar(R1, -PHI1),
        S1b: polar(R2, -PHI1, C, 0),
      },
      a,
      b,
      t,
    };
  },
  vel: ["V1"],
  traceZ: 7.5,
  forces: (s) => {
    const T = s.pts;
    const along = (p: Vec2, q: Vec2, l: number): Vec2 => {
      const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
      return [p[0] + ((q[0] - p[0]) * l) / d, p[1] + ((q[1] - p[1]) * l) / d];
    };
    return [
      { type: "spin", c: [0, 0], r: R1 + 14, key: "input" },
      { type: "spin", c: [C, 0], r: R2 + 12, key: "output" },
      { type: "axial", a: along(T.T1!, T.T1b!, 40), b: T.T1!, key: "tight side" },
      { type: "axial", a: along(T.S1!, T.S1b!, 20), b: T.S1!, key: "slack side" },
    ];
  },
  plot: { label: "Driven pulley angle", unit: "°", f: (_s, u) => (u / 2) * (180 / Math.PI) },
});
