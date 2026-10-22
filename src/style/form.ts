// FORM: values that change geometry or what the build adds (style SA5). Read by the rules, the hardware and the
// renderer; never colour, opacity or line weight. Geometry in mm.

// ISO metric coarse pitch by nominal diameter: [nominal Ø mm, pitch mm].
const ISO_COARSE: readonly (readonly [number, number])[] = [
  [2, 0.4], [2.5, 0.45], [3, 0.5], [4, 0.7], [5, 0.8], [6, 1], [8, 1.25], [10, 1.5], [12, 1.75], [16, 2], [20, 2.5],
];

export const FORM = {
  // Edge break drawn just inside every top-face edge, mm per part kind; `scale` multiplies them all.
  chamfer: {
    scale: 1.5, // factor
    plate: 0.8, // mm
    standoff: 0.6, // mm
    washer: 0.35, // mm
    tube: 0.5, // mm
    head: 0.45, // mm
    button: 0.6, // mm
    csk: 0, // mm, countersunk heads get none
  },
  thread: {
    pitch: (d: number): number => ISO_COARSE.find(([n]) => d <= n + 0.25)?.[1] ?? 2.5, // mm, ISO coarse pitch for Ø d mm
  },
  explode: {
    gap: 11, // mm per explode level at full explode
    clear: 0.5, // levels, how far a screw backs out past the topmost part it passes
  },
} as const;

export type Form = typeof FORM;
