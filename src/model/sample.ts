import { boxOf, isOut, planCorners } from "../core/axis";
import { TAU, bbox, circle, ring, roundRect, xf } from "../core/geom";
import { partShape, poseOf, velocity } from "./pose";
import type { MechanismModel, Part, Vec2 } from "./types";

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Sampled {
  /** Samples per cycle. */
  n: number;
  /** The traced points over one cycle, n points each. */
  traces: Record<string, Vec2[]>;
  /** Largest speed of each velocity point, mm per radian of phase. */
  vmax: Record<string, number>;
  /** Swept envelope of every part and trace over the cycle. */
  coreBounds: Bounds;
  /** The plot function at 181 phases from 0 to 2π, or null without a plot. */
  plotData: number[] | null;
}

/** Samples one cycle for traced paths, velocity scale, swept bounds and plot data. */
export function sample(model: MechanismModel, n = 360): Sampled {
  const traces: Record<string, Vec2[]> = {};
  const vmax: Record<string, number> = {};
  for (const k of model.paths ?? []) traces[k] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const grow = ([x, y]: Vec2) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };
  for (let i = 0; i < n; i++) {
    const u = (i / n) * TAU;
    const s = model.solve(u);
    for (const k in traces) {
      const q = s.pts[k];
      if (q) traces[k]!.push(q);
    }
    // the envelope is coarse in phase (every 4th sample): it sizes the base plate, which has a margin anyway
    if (i % 4 === 0)
      for (const p of model.parts) {
        const pose = poseOf(p, s);
        if (!pose) continue;
        // a part on an x or y axis covers its box's plan footprint, from `along` over its thickness
        if (isOut(p.axis)) {
          const w0 = (p.along ?? 0) + (p.dz ?? 0);
          for (const q of planCorners(boxOf(p.axis, xf(partShape(p, s), pose), w0, w0 + p.thick))) grow(q);
        } else for (const q of xf(partShape(p, s), pose)) grow(q);
      }
    for (const k of model.vel ?? []) {
      const v = velocity(model, u, k);
      vmax[k] = Math.max(vmax[k] ?? 0, Math.hypot(v[0], v[1]));
    }
  }
  for (const k in traces) for (const q of traces[k]!) grow(q);
  let plotData: number[] | null = null;
  if (model.plot) {
    plotData = [];
    for (let i = 0; i <= 180; i++) {
      const u = (i / 180) * TAU;
      plotData.push(model.plot.f(model.solve(u), u));
    }
  }
  return { n, traces, vmax, coreBounds: { minX, minY, maxX, maxY }, plotData };
}

/** The base-plate form values (src/style/form.ts, FORM.base), typed structurally. */
export interface BaseForm {
  cornerR: number;
  margin: number;
  footR: number;
  mountHoleR: number;
}

export interface BasePlate {
  part: Part;
  bounds: Bounds;
  /** Corner-arc centres: mounting holes and feet sit here, concentric with the corners. */
  corners: Vec2[];
  /** Foot outlines at the corners, radius footR. */
  feet: Vec2[][];
}

/** Counterbore radius over the mounting-hole radius, mm. */
const COUNTERBORE = 2.2;

/**
 * The base plate: a rounded rectangle `margin` outside the swept envelope, engraved with the traced paths, a ring
 * round each fixed ground pivot and a counterbored mounting hole at each corner centre. Its z is set by assembly.
 */
export function basePlate(model: MechanismModel, sampled: Sampled, form: BaseForm): BasePlate {
  const { minX, minY, maxX, maxY } = sampled.coreBounds;
  const M = form.margin;
  const outer = roundRect(minX - M, minY - M, maxX + M, maxY + M, form.cornerR);
  const [x0, y0, x1, y1] = bbox(outer);
  const cr = form.cornerR;
  const corners: Vec2[] = [
    [x0 + cr, y0 + cr],
    [x1 - cr, y0 + cr],
    [x1 - cr, y1 - cr],
    [x0 + cr, y1 - cr],
  ];
  const groundPins = model.parts.filter((p) => p.role === "pin" && p.fixed && p.layer < 0);
  const pinR = (p: Part) => Math.max(...p.shape.outer.map((q) => Math.hypot(q[0], q[1])));
  const part: Part = {
    id: "base",
    role: "ground",
    layer: -1,
    thick: 8,
    fixed: [0, 0, 0],
    name: "Base",
    shape: { outer, holes: [] },
    marks: [
      ...Object.values(sampled.traces),
      ...groundPins.map((p) => ring(pinR(p) + 3.5, p.fixed![0], p.fixed![1])),
      ...corners.flatMap(([x, y]) => [circle(form.mountHoleR + COUNTERBORE, x, y, 32), circle(form.mountHoleR, x, y, 24)]),
    ],
  };
  return {
    part,
    bounds: { minX: minX - M, minY: minY - M, maxX: maxX + M, maxY: maxY + M },
    corners,
    feet: corners.map(([x, y]) => circle(form.footR, x, y, 32)),
  };
}
