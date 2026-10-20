// Principle visibility at runtime (standard T10, style SP12): a static solid that covers a principle part in the current
// view is drawn see-through, automatically, at the view being drawn. It is a change of opacity, never a depth bias or a
// reorder (T17, SD1). "Covers" is judged on the part's swept box over the whole cycle, so the set does not flicker as the
// part moves under a plate's edge: the solid's box overlaps the swept box on the sheet and reaches nearer the viewer than
// the part ever does. Pure maths: the renderer, the audit and the tests share it.
import { mat4 } from "../../solids/frame";
import type { Vec3 } from "../../solids/types";
import { depthOf, project, type Camera } from "./camera";
import { applyMat, mulMat, type Runtime } from "./scene";

/** How much of the smaller of the two sheet areas (the part's swept box, the covering solid) their overlap must fill, 0..1. */
const OVERLAP = 0.25;

/** Samples of the cycle the swept box is found from. */
const SAMPLES = 36;

/** The world box swept by each principle solid over the cycle (zeros for any other solid). Cached on the runtime. */
export function swept(rt: Runtime): Float32Array {
  const cache = rt as Runtime & { _sweep?: Float32Array };
  if (cache._sweep) return cache._sweep;
  const out = new Float32Array(rt.n * 6);
  const { scene } = rt;
  scene.pkg.solids.forEach((s, i) => {
    if (!rt.principle[i]) return;
    const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    const F = mat4(s.fr);
    for (let k = 0; k < SAMPLES; k++) {
      const m = mulMat(scene.poser.place(s, (k / SAMPLES) * scene.poser.period), F);
      for (const x of [rt.box[i * 6]!, rt.box[i * 6 + 3]!])
        for (const y of [rt.box[i * 6 + 1]!, rt.box[i * 6 + 4]!])
          for (const z of [rt.box[i * 6 + 2]!, rt.box[i * 6 + 5]!]) {
            const p = applyMat(m, [x, y, z]);
            for (let a = 0; a < 3; a++) {
              if (p[a]! < b[a]!) b[a] = p[a]!;
              if (p[a]! > b[a + 3]!) b[a + 3] = p[a]!;
            }
          }
    }
    out.set(b, i * 6);
  });
  cache._sweep = out;
  return out;
}

interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** Nearest and farthest depth toward the viewer. */
  dn: number;
  df: number;
}

function rectOf(C: Camera, b: ArrayLike<number>, o: number): Rect {
  const r: Rect = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity, dn: -Infinity, df: Infinity };
  for (const x of [b[o]!, b[o + 3]!])
    for (const y of [b[o + 1]!, b[o + 4]!])
      for (const z of [b[o + 2]!, b[o + 5]!]) {
        const p: Vec3 = [x, y, z];
        const [sx, sy] = project(C, p);
        const d = depthOf(C, p);
        if (sx < r.x0) r.x0 = sx;
        if (sx > r.x1) r.x1 = sx;
        if (sy < r.y0) r.y0 = sy;
        if (sy > r.y1) r.y1 = sy;
        if (d > r.dn) r.dn = d;
        if (d < r.df) r.df = d;
      }
  return r;
}

/**
 * The solids to draw see-through in this view: every fixed solid that is not itself a principle part, overlaps a principle
 * part's swept box on the sheet, and reaches nearer the viewer than that part does. `boxes` are the world boxes of the
 * solids as placed (six floats each); `fixed` solids do not move, so their placed box is their box over the cycle.
 */
export function seeThrough(rt: Runtime, boxes: ArrayLike<number>, C: Camera, out = new Uint8Array(rt.n)): Uint8Array {
  out.fill(0);
  const sw = swept(rt);
  const parts: { r: Rect; area: number }[] = [];
  for (let i = 0; i < rt.n; i++) {
    if (!rt.principle[i]) continue;
    const r = rectOf(C, sw, i * 6);
    parts.push({ r, area: Math.max(1e-6, (r.x1 - r.x0) * (r.y1 - r.y0)) });
  }
  if (!parts.length) return out;
  for (let c = 0; c < rt.n; c++) {
    if (rt.principle[c] || !rt.fixed[c] || rt.isBase[c]) continue;
    const r = rectOf(C, boxes, c * 6);
    for (const p of parts) {
      const w = Math.min(r.x1, p.r.x1) - Math.max(r.x0, p.r.x0);
      const h = Math.min(r.y1, p.r.y1) - Math.max(r.y0, p.r.y0);
      if (w <= 0 || h <= 0) continue;
      if ((w * h) / Math.min(p.area, Math.max(1e-6, (r.x1 - r.x0) * (r.y1 - r.y0))) < OVERLAP) continue;
      if (r.dn <= p.r.dn) continue;
      out[c] = 1;
      break;
    }
  }
  return out;
}
