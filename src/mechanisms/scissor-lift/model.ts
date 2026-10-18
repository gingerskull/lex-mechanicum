// Scissor lift (catalogue "scissor-lift"): three stages of crossed bars, L 90, the carriage span w running from 85
// (lowered) to 50 (raised). Stage height h = sqrt(L² - w²) = 29.6 to 74.8, platform height H = 3h = 88.8 to 224.5.
// Pins L_k sit on x = 0 and R_k on x = w at height k h; bar a_k joins L_k to R_k+1 and bar b_k joins R_k to L_k+1, the two
// crossing at M_k. The carriage carries R0 along the track; the platform is pinned at L3 and slotted at R3, so it stays
// level whatever the span. Every b bar is a clevis: a front plate (a twin) over the a bars, so each pin works in double
// shear (A9). The platform is 150 mm long (the catalogue says 120): the belt drive's motor sits past the carriage's
// travel and the base, which follows the platform, has to reach it.
import { ring } from "../../core/geom";
import { V, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Part, Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const L = 90;
export const N = 3;
/** Carriage span range: lowered, raised. */
export const W_LOW = 85;
export const W_HIGH = 50;
/** Platform height at each end of the travel, mm. */
export const H_LOW = N * Math.sqrt(L * L - W_LOW * W_LOW);
export const H_HIGH = N * Math.sqrt(L * L - W_HIGH * W_HIGH);
/** Platform point C, measured from L3. */
const PLAT = 45;
const span = osc(W_LOW, W_HIGH);

/** Bar boss radius: the bearing at each end and at the middle pin. */
const BAR_R: [number, number] = [9.5, 9.5];
/**
 * Plating (K1: heights may change, centres may not): the platform rides this far above its layer, over the heads of the
 * pins that pass under it when the lift is lowered.
 */
const PLAT_DZ = 3.5;

/** A scissor bar with its middle pin boss engraved like the end bosses (D1). */
function bar(id: string, layer: number, between: [string, string], name: string, twin?: string): Part {
  const p = P.link(id, L, { role: "link", layer, r: BAR_R, between, name, ...(twin ? { twin } : {}) });
  p.marks.push(ring(BAR_R[0] - 1.6, L / 2, 0));
  return p;
}

const pins = (): Part[] => {
  const out: Part[] = [];
  // ground pivot at the foot of the first bar; the carriage pin is the input (the accent)
  out.push(P.cap("pL0", -1, 7, { fixed: [0, 0, 0], span: 3 }));
  out.push(P.cap("pR0", 0, 5.5, { at: "R0", span: 3, accent: true }));
  for (let k = 0; k < N; k++) out.push(P.cap(`pM${k}`, 1, 5.5, { at: `M${k}`, span: 2 }));
  for (let k = 1; k < N; k++) {
    out.push(P.cap(`pL${k}`, 1, 5.5, { at: `L${k}`, span: 2 }));
    out.push(P.cap(`pR${k}`, 1, 5.5, { at: `R${k}`, span: 2 }));
  }
  out.push(P.cap(`pL${N}`, 1, 5.5, { at: `L${N}`, span: 3 }));
  out.push(P.cap(`pR${N}`, 2, 5.5, { at: `R${N}`, span: 2 }));
  return out;
};

const tracer = P.tracer("tC", 4, { at: "C", dz: PLAT_DZ, name: "Platform point" });

export default defineMechanism({
  id: "scissor-lift",
  input: { kind: "linear", part: "carriage" },
  parts: [
    P.slider("carriage", 36, 20, { role: "driver", at: "R0", name: "Carriage" }),
    ...P.rails("rail", 30, 105, 20, { name: "Track" }),
    // b bars at layer 1 over the carriage, a bars at layer 2 over them, the b front plates at layer 3: every crossing is
    // on its own layer and every a bar sits between its two b plates
    ...Array.from({ length: N }, (_, k) => bar(`b${k}`, 1, [`R${k}`, `L${k + 1}`], `Bar b${k}, rear plate`)),
    ...Array.from({ length: N }, (_, k) => bar(`a${k}`, 2, [`L${k}`, `R${k + 1}`], `Bar a${k}`)),
    ...Array.from({ length: N }, (_, k) => bar(`b${k}f`, 3, [`R${k}`, `L${k + 1}`], `Bar b${k}, front plate`, `b${k}`)),
    P.slotLink("platform", 150, 48.5, 86.5, { role: "output", layer: 4, dz: PLAT_DZ, w: 22, slotW: 12, at: `L${N}`, name: "Platform" }),
    ...pins(),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const w = span(u);
    const h = Math.sqrt(L * L - w * w);
    const pts: Record<string, Vec2> = {};
    for (let k = 0; k <= N; k++) {
      pts[`L${k}`] = [0, k * h];
      pts[`R${k}`] = [w, k * h];
    }
    for (let k = 0; k < N; k++) pts[`M${k}`] = [w / 2, (k + 0.5) * h];
    pts.C = V.add(pts[`L${N}`]!, [PLAT, 0]);
    return { pts, w, h, th: u };
  },
  paths: ["C"],
  vel: ["C", "R0"],
  forces: (s) => [
    { type: "axial", a: s.pts.L0!, b: s.pts.R1!, key: "bar" },
    { type: "axial", a: s.pts.R0!, b: [(s.w as number) - 34, 0], key: "carriage push" },
  ],
  angles(s) {
    const w = s.w as number;
    const h = s.h as number;
    return [{ type: "angle", c: s.pts.L0!, a: [w, 0], b: s.pts.R1!, r: 34, key: "bar", value: (Math.atan2(h, w) * 180) / Math.PI }];
  },
  plot: { label: "Platform height", unit: "mm", f: (s) => s.pts[`L${N}`]![1] },
});
