// Jansen's linkage (catalogue "jansen-linkage"): Theo Jansen's holy numbers at scale 2 (the catalogue's S). Crank m 30
// about O; bars j 100 and k 123.8 from the crank pin A; upper triangle Y B D (b 83, d 80.2, e 111.6) pivoted at the
// ground point Y (-76, -15.6); bar c 78.6 from Y to C; bar f 78.8 from D to E; foot triangle C E F (g 73.4, h 131.4,
// i 98). Mobility 3(8-1) - 2·10 = 1. Solve as the catalogue notes: B, C, D, E, F each a circle intersection.
import { D2R, arcPts, ring, type Vec2 } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import { P, heights } from "../../parts";

const m = 30;
const j = 100;
const k = 123.8;
const b = 83;
const c = 78.6;
const d = 80.2;
const e = 111.6;
const f = 78.8;
const g = 73.4;
const h = 131.4;
const i = 98;
const O: Vec2 = [0, 0];
const Y: Vec2 = [-76, -15.6];

/** Local coordinates of the third corner of a triangle with sides |PQ| = pq, |PR| = pr, |QR| = qr; local x runs P to Q. */
const third = (pq: number, pr: number, qr: number): Vec2 => {
  const x = (pq * pq + pr * pr - qr * qr) / (2 * pq);
  return [x, Math.sqrt(pr * pr - x * x)];
};
/** D in the upper triangle (from Y toward B) and F in the foot triangle (from C toward E), on the solved side (+y). */
const D_LOCAL = third(b, d, e);
const F_LOCAL = third(g, i, h);

/** Boss radii (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const BAR_R: [number, number] = [9.5, 9.5];

/**
 * Bar k, bowed 7 mm away from Y (D1, D2). The ground pivot Y lies only 2.3 mm outside a straight bar k at its nearest,
 * and the Y axle (with its spacers and the bridge above) has to stand clear of it. The bow is a circular arc through
 * both pin centres, so the pin-to-pin length is exact (K1); only the outline moves. Local x runs A to C; the bow is
 * toward +y, away from Y.
 */
const BOW = 7;
function bowedBar(L: number, sag: number, r: number): Vec2[] {
  const R = (L * L / 4 + sag * sag) / (2 * sag);
  const cx = L / 2;
  const cy = sag - R;
  const phi = Math.asin(L / (2 * R));
  const arc = (rr: number, t0: number, t1: number): Vec2[] => {
    const n = Math.ceil(Math.abs(t1 - t0) / (Math.PI / 60));
    const out: Vec2[] = [];
    for (let q = 0; q <= n; q++) {
      const t = t0 + ((t1 - t0) * q) / n;
      out.push([cx + rr * Math.sin(t), cy + rr * Math.cos(t)]);
    }
    return out;
  };
  const capC = arcPts(cx + R * Math.sin(phi), cy + R * Math.cos(phi), r, -Math.PI / 2 - phi, Math.PI / 2 - phi, Math.PI / 14);
  const capA = arcPts(cx - R * Math.sin(phi), cy + R * Math.cos(phi), r, Math.PI / 2 + phi, (3 * Math.PI) / 2 + phi, Math.PI / 14);
  return [...arc(R - r, -phi, phi), ...capC, ...arc(R + r, phi, -phi), ...capA];
}

/**
 * Layers (K5). Everything sweeps over the crank axis O and the pins A, Y and D, so the order is forced: the crank
 * lowest (the others pass over the shaft), the upper triangle and the foot triangle in its plane (their sweeps never
 * meet the crank's), bars j and c and f in the next plane and bar k in the top one (the only part over the crank pin
 * stack, which joins the crank, j and k).
 */
const tracer = P.tracer("foot-point", 0, { at: "F", name: "Foot point" });

/** The pin centres at crank phase u: each from the two before it (one assembly branch throughout). */
const chain = (u: number): Record<string, Vec2> => {
  const A = V.at(O, u, m);
  const B = circleX(A, j, Y, b, -1);
  const C = circleX(A, k, Y, c, 1);
  const D = circleX(B, e, Y, d, -1);
  const E = circleX(D, f, C, g, -1);
  const F = circleX(E, h, C, i, -1);
  return { O, Y, A, B, C, D, E, F };
};
/** The lowest the foot point gets, y -183.7 mm: the plot reads the foot height above it (the catalogue lift of 45 mm). */
const FOOT_LOW = Math.min(...Array.from({ length: 720 }, (_, q) => chain((q / 720) * 2 * Math.PI).F![1]));

export default defineMechanism({
  id: "jansen-linkage",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", m, { role: "driver", layer: 0, r: CRANK_R, between: ["O", "A"] }),
    P.link("bar-j", j, { layer: 1, r: BAR_R, between: ["A", "B"], name: "Bar j" }),
    { ...P.custom("bar-k", bowedBar(k, BOW, BAR_R[0]), { layer: 2, between: ["A", "C"], name: "Bar k", marks: [ring(BAR_R[0] - 1.6), ring(BAR_R[0] - 1.6, k, 0)] }), len: k },
    P.plate("upper", [[0, 0], [b, 0], D_LOCAL], { layer: 0, r: 10, between: ["Y", "B"], name: "Upper triangle" }),
    P.link("bar-c", c, { layer: 1, r: BAR_R, between: ["Y", "C"], name: "Bar c" }),
    P.link("bar-f", f, { layer: 1, r: BAR_R, between: ["D", "E"], name: "Bar f" }),
    P.plate("foot", [[0, 0], [g, 0], F_LOCAL], { role: "output", layer: 0, r: 10, between: ["C", "E"], name: "Foot triangle" }),
    P.cap("pO", -1, 7, { fixed: [O[0], O[1], 0], accent: true }),
    P.cap("pY", -1, 7, { fixed: [Y[0], Y[1], 0], span: 2 }),
    P.cap("pA", 0, 5.5, { at: "A", span: 2 }),
    P.cap("pB", 0, 5.5, { at: "B", span: 1 }),
    P.cap("pC", 0, 5.5, { at: "C", span: 2 }),
    P.cap("pD", 0, 5.5, { at: "D", span: 1 }),
    P.cap("pE", 0, 5.5, { at: "E", span: 1 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    return { pts: chain(u), th: u };
  },
  paths: ["F"],
  vel: ["F", "E"],
  forces: (s) => [
    { type: "axial", a: s.pts.D!, b: s.pts.E!, key: "bar" },
    { type: "spin", c: O, r: 28, key: "input", z: 1.2 },
  ],
  angles(s, u) {
    const th = ((((u / D2R) % 360) + 360) % 360);
    return [{ type: "angle", c: O, a: [m, 0], b: s.pts.A!, r: 20, key: "crank", value: th, z: 1.2 }];
  },
  plot: { label: "Foot height", unit: "mm", f: (s) => s.pts.F![1] - FOOT_LOW },
});
