// Scotch yoke (catalogue "scotch-yoke"): crank radius r 40, slot half length 41 (it must exceed r), slot width 12.
// The slot lies across the guide: the yoke's slot centre is at x = r cos θ, so the stroke is 2r = 80 mm and the
// motion is exactly harmonic (v = -r ω sin θ). The yoke is a slotted frame tied by a bar to the crosshead on the
// rails; the crosshead centre G rides at x = d + r cos θ, from 80 to 160 mm. The catalogue's "x = 95 to 135" for the
// rod is half the stroke (a slip in the record: the stroke it gives is 80), so the site follows the stroke.
import { D2R, arcPts, ring, roundedPoly, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const r = 40;
/** Slot: centre-line half length (> r) and width. */
export const slotHalf = 41;
export const slotW = 12;
/** Yoke slot centre to crosshead centre, mm: the tie bar between them. */
export const d = 120;
const O: Vec2 = [0, 0];

/** Crank: pin boss, input boss and a counterweight lobe opposite the pin (M2), boss radius 9.5. */
const CW: Vec2[] = [[r, 0], [-18, 14], [-18, -14]];

/** A yoke outline from the slot centre's frame into the crosshead's (centre G, d to the right). */
const shift = (pts: Vec2[]): Vec2[] => pts.map(([x, y]): Vec2 => [x - d, y]);

/** Yoke frame: head 28 wide, 110 long (walls 8 mm either side of the slot), with a tongue for the tie bar. */
function yokeOutline(): Vec2[] {
  const hx = 14;
  const hy = 55;
  const cr = 12;
  const tx = 36;
  const th = 10;
  const f = 3;
  const out: Vec2[] = [];
  // counter-clockwise from the right end of the lower edge
  out.push(...arcPts(hx - cr, -hy + cr, cr, -Math.PI / 2, 0));
  out.push([hx, -th - f]);
  out.push(...arcPts(hx + f, -th - f, f, Math.PI, Math.PI / 2, Math.PI / 12));
  out.push([tx - 4, -th]);
  out.push(...arcPts(tx - 4, -th + 4, 4, -Math.PI / 2, 0));
  out.push(...arcPts(tx - 4, th - 4, 4, 0, Math.PI / 2));
  out.push([hx + f, th]);
  out.push(...arcPts(hx + f, th + f, f, -Math.PI / 2, -Math.PI, Math.PI / 12));
  out.push(...arcPts(hx - cr, hy - cr, cr, 0, Math.PI / 2));
  out.push(...arcPts(-hx + cr, hy - cr, cr, Math.PI / 2, Math.PI));
  out.push(...arcPts(-hx + cr, -hy + cr, cr, Math.PI, 1.5 * Math.PI));
  return out;
}

export default defineMechanism({
  id: "scotch-yoke",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.custom("crank", roundedPoly(CW, 9.5), { role: "driver", layer: -1, dz: 2.5, between: ["O", "A"], name: "Counterweighted crank", marks: [ring(7.9), ring(7.9, r, 0), ring(11.4)] }),
    // the crosshead, the yoke and the tie bar are one rigid body: the yoke and the bar are twins of the crosshead, drawn
    // in its frame (centre G), so the rules and the build treat them as one moving body
    P.slider("block", 36, 24, { at: "G", name: "Crosshead", noRing: true }),
    P.custom("yoke", shift(yokeOutline()), {
      role: "output",
      layer: 0,
      thick: 7,
      at: "G",
      twin: "block",
      holes: [shift(roundedPoly([[0, -slotHalf], [0, slotHalf]], slotW / 2))],
      marks: [ring(5, 22 - d, 0)],
      name: "Yoke",
    }),
    // the tie bar lies over the yoke tongue and the crosshead, screwed down into both
    P.custom("bar", roundedPoly([[22 - d, 0], [0, 0]], 7), { role: "output", layer: 1, dz: -3, thick: 6, at: "G", twin: "block", name: "Tie bar" }),
    ...P.rails("rail", 60, d + r + 18 + 18, 24, { name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, th: 8.5, span: 0 }),
    P.cap("pA", -1, 5.5, { at: "A", span: 2 }),
  ],
  traceZ: 16.8,
  solve(u) {
    const A: Vec2 = [r * Math.cos(u), r * Math.sin(u)];
    return { pts: { O, A, Y: [A[0], 0], G: [A[0] + d, 0] } };
  },
  paths: ["A"],
  vel: ["G", "A"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: [s.pts.A![0] + 34, s.pts.A![1]], key: "slot wall" },
    { type: "spin", c: O, r: 30, key: "input", z: 1.2 },
  ],
  angles: (s) => {
    const th = (Math.atan2(s.pts.A![1], s.pts.A![0]) / D2R + 360) % 360;
    return [{ type: "angle", c: O, a: [30, 0], b: s.pts.A!, r: 24, key: "crank", value: th }];
  },
  plot: { label: "Yoke position", unit: "mm", f: (s) => s.pts.Y![0] },
});
