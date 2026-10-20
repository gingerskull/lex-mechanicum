// Chain drive (catalogue "chain-drive"): an ISO 08B roller chain (12.7 mm pitch, Ø8.5 rollers) from a 15-tooth driver
// sprocket to a 30-tooth driven sprocket, ratio 2:1, both turning the same way.
// K6: the catalogue's 62 links fix the centre distance (C = 248.5 mm, centresFor on the pitch circles; the J12 rule
// conveys the chain on a path exactly 62 pitches long; the catalogue's 254 mm would need 62.8 links). Sprocket pitch
// circles p / sin(180°/z): 61.1 and 121.4 mm.
// The chain advances one pitch per tooth, so its travel is the driver's angle times z1·p / 2π (the mean chain speed),
// not times the pitch radius: the rollers then meet every tooth gap of both sprockets turn after turn. On the wrap the
// rollers ride the pitch circle where the real chain rides the pitch polygon: they sit within 0.35 mm of their seats,
// and the chordal ripple (1 - cos 12° = 2.2 % of speed, under 0.05 mm of position) is too small to draw.
// The sprockets are ISO 606 (P.sprocket). Driver on the left at O1, turning counter-clockwise: the upper span runs onto
// it and is the tight side, the lower span is slack.
import { centresFor, sprocketR, sprocketSeat } from "../../core/flex";
import { TAU, circle, polar, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

/** ISO 08B roller chain: pitch and roller Ø, mm; tooth counts and chain length in links. */
export const CH = { p: 12.7, d1: 8.5 };
export const Z1 = 15;
export const Z2 = 30;
export const N_LINKS = 62;
export const R1 = sprocketR(Z1, CH.p);
export const R2 = sprocketR(Z2, CH.p);
/** Centre distance for a whole number of links on the pitch circles. */
export const C = centresFor(R1, R2, N_LINKS * CH.p);
/** Half the angle the spans make with the line of centres. */
export const BETA = Math.asin((R2 - R1) / C);
const SPAN = Math.sqrt(C * C - (R2 - R1) * (R2 - R1));
/** Chain travel per radian of the driver: one pitch per tooth. */
const K = (Z1 * CH.p) / TAU;
/** ISO 606 roller seat radius, mm. */
export const SEAT = sprocketSeat(CH.d1);

// Phases: a roller sits in its seat at mid-wrap on each sprocket (the chain path starts at the driver's upper tangent
// point and runs counter-clockwise; the travel grows with the input).
const PHI0 = Math.PI / 2 + BETA;
const MID1 = (R1 * (Math.PI - 2 * BETA)) / 2;
const PHI1 = PHI0 + MID1 / R1 - MID1 / K;
const S2 = R1 * (Math.PI - 2 * BETA) + SPAN;
const MID2 = S2 + (R2 * (Math.PI + 2 * BETA)) / 2;
const PHI2 = -Math.PI / 2 - BETA + (MID2 - S2) / R2 - (MID2 / K) * (Z1 / Z2);

const driver = P.sprocket("driver", Z1, CH.p, CH.d1, { a0: PHI1, role: "driver", at: "O1", spin: (s) => s.a as number, holes: [circle(6, 0, 0, 36)], name: `Driver sprocket, ${Z1} teeth, ISO 08B` });
const driven = P.sprocket("driven", Z2, CH.p, CH.d1, { role: "output", at: "O2", spin: (s) => s.b as number, holes: [circle(7.2, 0, 0, 36)], name: `Driven sprocket, ${Z2} teeth, ISO 08B` });

export default defineMechanism({
  id: "chain-drive",
  input: { kind: "rotary", part: "driver" },
  parts: [driver, driven, P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true }), P.cap("pO2", -1, 7, { fixed: [C, 0, 0] })],
  flexible: [{ form: "chain", over: ["driver", "driven"], travel: "t", pitch: CH.p, roller: CH.d1 }],
  solve(u) {
    const a = u;
    // one pitch of chain per tooth: the driven sprocket turns z1/z2 of the driver
    const t = u * K;
    const b = (u * Z1) / Z2 + PHI2;
    return {
      pts: {
        O1: [0, 0],
        O2: [C, 0],
        V1: polar(R1, a + Math.PI / 2),
        T1: polar(R1, PHI0),
        T1b: polar(R2, PHI0, C, 0),
        S1: polar(R1, -PHI0),
        S1b: polar(R2, -PHI0, C, 0),
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
      { type: "spin", c: [0, 0], r: R1 + 16, key: "input" },
      { type: "spin", c: [C, 0], r: R2 + 14, key: "output" },
      { type: "axial", a: along(T.T1!, T.T1b!, 40), b: T.T1!, key: "tight side" },
      { type: "axial", a: along(T.S1!, T.S1b!, 20), b: T.S1!, key: "slack side" },
    ];
  },
  plot: { label: "Driven sprocket angle", unit: "°", f: (_s, u) => ((u * Z1) / Z2) * (180 / Math.PI) },
});
