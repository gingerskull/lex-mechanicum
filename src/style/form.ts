// FORM: values that change geometry or what the build adds (style SA5). Read by the rules, the hardware and the
// renderer; never colour, opacity or line weight. Geometry in mm.

// ISO metric coarse pitch by nominal diameter: [nominal Ø mm, pitch mm].
const ISO_COARSE: readonly (readonly [number, number])[] = [
  [2, 0.4], [2.5, 0.45], [3, 0.5], [4, 0.7], [5, 0.8], [6, 1], [8, 1.25], [10, 1.5], [12, 1.75], [16, 2], [20, 2.5],
];

export const FORM = {
  base: {
    cornerR: 12, // mm, plan corner radius of every base plate (true circular arcs)
    margin: 16, // mm, clearance from the swept envelope to the plate edge
    footR: 6.5, // mm, rubber foot radius; feet sit on the corner-arc centres
    mountHoleR: 2.8, // mm, counterbored mounting hole radius at each corner centre
  },
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
    show: true, // helix lines on threaded shanks
    minPitchPx: 2.4, // CSS px, drawn pitch floor: real pitch or this, whichever is coarser
    pitch: (d: number): number => ISO_COARSE.find(([n]) => d <= n + 0.25)?.[1] ?? 2.5, // mm, ISO coarse pitch for Ø d mm
  },
  fasteners: {
    shanks: true, // every screw head gets its threaded shank into the part it fastens (stage 3)
    holes: true, // every plate a shank passes gets a clearance hole, tapped where it ends
    clearance: 0.3, // mm, radial clearance of a through hole
  },
  explode: {
    gap: 11, // mm per explode level at full explode
    clear: 0.5, // levels, how far a screw backs out past the topmost part it passes
  },
} as const;

export type Form = typeof FORM;
