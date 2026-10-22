// DRAFT: every knob of the drafting renderer (style Part IV). Colours by token name only; never a hex or a font string.
// Units: line widths, offsets and screen spacing in CSS px; alphas 0..1 (multiplied into the token colour); patterns in
// mm with a px floor; angles in degrees unless a comment says radians; `s` is the projection scale in px per mm.

import type { ColorName, TOKENS } from "./tokens";

export type PatternKind = "dots" | "hatch" | "cross" | "dash" | "none";
export type FontFamily = "display" | "body" | "mono";
export type TypeSize = keyof typeof TOKENS.type.size;

/** A canvas font: family by token name, CSS weight, size by token name. Turned into a font string by font(). */
export interface FontSpec {
  family: FontFamily;
  weight: number;
  size: TypeSize;
}

/** A coloured stroke: token colour, width in px, alpha 0..1. */
export interface Stroke {
  color: ColorName;
  width: number;
  alpha: number;
}

export interface RoleSurface {
  pattern: PatternKind;
  step?: number; // mm, pattern pitch on the part (never under minPx on screen)
  alpha?: number; // 0..1, pattern ink alpha (times the theme's patternGain)
  tint?: number; // 0..1, flat ink tint on the top face
}

/** Surface keys: the part roles, the solid-only roles and the base plate. */
export type SurfaceKey = "driver" | "link" | "output" | "ground" | "base" | "bearing" | "hw" | "trace";

export const DRAFT = {
  // Paper: radial gradient paper -> paperEdge, then grain (paint order step 1, step 7).
  paper: {
    centre: [0.5, 0.45] as const, // gradient centre as a fraction of canvas width, height
    radius: 0.75, // gradient radius as a fraction of the larger canvas side
    grainTile: 128, // px, side of the cached noise tile
    grainBlend: { dark: "overlay", light: "multiply" } as const, // composite operation of the paper tooth per sheet
  },

  // Drawing-sheet grid: pitch from TOKENS.size.grid / gridMajor, colour `grid`.
  grid: {
    minorAlpha: 0.07, // 0..1
    majorAlpha: 0.14, // 0..1
    minorWidth: 0.5, // px
    majorWidth: 0.8, // px
  },

  // Library cards (SS1): the thumbnail and the hover animation draw a small sheet, so they leave out detail nobody sees
  // and thin the two bold outlines. Used only for a view with `card` set; the mechanism page is untouched.
  // The GPU solids pass: antialiasing samples per pixel, fewer on a phone or a dense screen, where a pixel is smaller.
  gpu: {
    samples: 8, // antialiasing samples per pixel
    samplesDense: 4, // coarse pointer or device pixel ratio of 2 and more
  },

  card: {
    detail: "B" as const, // detail dial position of a card drawing (DL): sharp, with wall shading
    plateTopFactor: 0.7, // factor on lines.plateTop on a card
    baseTopFactor: 0.7, // factor on lines.baseTop on a card
  },

  // Line hierarchy, thick to thin (SF10). Colour is ink unless a key says otherwise.
  lines: {
    plateTop: 1.7, // px, bold top outline of plates
    otherTop: 1.1, // px, top outline of everything else
    baseTop: 1.5, // px, top outline of the base plate
    plateBottom: 0.9, // px, bottom outline of plates (back edge included)
    bottomAlpha: 0.75, // 0..1
    silhouette: 0.8, // px, vertical edges down the side walls
    silhouetteAlpha: 0.8, // 0..1
    edge: 0.7, // px, visible bottom edges of non-plates
    edgeAlpha: 0.7, // 0..1
    chamfer: 0.45, // px
    chamferAlpha: 0.5, // 0..1
    chamferMinScale: 1.5, // px per mm, chamfer lines drawn only above this projection scale
    marks: 0.6, // px, engraved marks
    marksAlpha: 0.55, // 0..1
    thread: 0.5, // px, thread helices
    threadAlpha: 0.45, // 0..1
    baseChamferGain: 0.7, // factor on chamferAlpha for the base plate
    baseMarksGain: 0.75, // factor on marksAlpha for the base plate
    // How an edge looks where a part covers it (SD3): width and alpha are factors on the visible line.
    hidden: { dash: [3, 2.4] as const, width: 0.75, alpha: 0.85 }, // dash px, factor, factor
    // Ring round the input shaft head (SD5).
    accentRing: {
      color: "accent" as ColorName,
      width: 1.8, // px
      radius: 0.62, // factor on the head's projected half-size, per axis
      alpha: 1, // 0..1 on the lines layer
      hiddenAlpha: 0.7, // 0..1 on the frame (shows through covering parts)
      segments: 72, // straight pieces of the ring
    },
  },

  // Surfaces: paper opacity per kind, 0..1 (SD2), and how much each erases the lines layer (SD3).
  fill: {
    plate: 0.64,
    other: 0.8,
    base: 0.96, // laid once, on the top face (the parts under it read only through `occlude.base`)
    wall: 0.55,
    baseWallGain: 0.8, // factor on `wall` for the base plate's walls
    wallOcclude: 0.9, // factor on the occlusion for side walls
    occlude: { plate: 1, other: 0.85, base: 0.9 }, // the base lets a tenth of what is under it show through
    // A solid over a working zone of the mechanism (a mesh, a slot roller's run, L5): its opacity, a factor on its paper
    // and on its occlusion, so the zone reads through it at half strength.
    seeThrough: { opacity: 0.5 },
    // Ink shade on side walls, stepped by facing: alpha = shade * (from + span * i / (steps - 1)).
    wallShade: {
      shade: 0.045, // 0..1 ink alpha
      steps: 5, // count of facing buckets
      light: [0.75, -0.25] as const, // screen direction the light comes from (x right, y down), the wall facing it is lightest
      outer: { from: 0.4, span: 0.9 }, // factors, outer walls
      hole: { from: 1.2, span: 1 }, // factors, walls inside holes (darker)
    },
  },

  // Role surfaces (SD4): patterns on top faces only, registered to the part's pose.
  role: {
    driver: { pattern: "dots", step: 1.3, alpha: 0.55, tint: 0.05 },
    link: { pattern: "dots", step: 2.4, alpha: 0.34, tint: 0 },
    output: { pattern: "hatch", step: 2.1, alpha: 0.3, tint: 0.03 },
    ground: { pattern: "dash", step: 3.2, alpha: 0.24, tint: 0 },
    base: { pattern: "dots", step: 4.0, alpha: 0.18, tint: 0 },
    bearing: { pattern: "cross", step: 0.9, alpha: 0.22, tint: 0.06 },
    hw: { pattern: "none", tint: 0.12 },
    trace: { pattern: "none", tint: 0.2 },
  } satisfies Record<SurfaceKey, RoleSurface>,

  minPx: 2.2, // px, a pattern step (and any repeated mark) is never drawn finer than this on screen (SF11)

  // Pattern tiles: one tile is one pattern step, mapped through the part's pose.
  pattern: {
    offBelowCos: 0.15, // patterns switch off when cos(tilt) is below this (near edge-on, SD11)
    tile: 24, // px, cached tile side (tile units below)
    dotRadius: 3.6, // tile px, soft dot radius
    dotMid: [0.55, 0.8] as const, // gradient stop position and its alpha, soft dot falloff
    lineWidth: 2.2, // tile px, hatch, cross and dash strokes
    dashes: [[3, 10, 6], [15, 22, 18]] as const, // tile px, dash segments as [x0, x1, y]
  },

  // Loose touches, the complete list (SD9).
  sketch: {
    overshoot: 14, // px, construction lines run this far past the base plate's corners
    alpha: 0.32, // 0..1
    width: 0.55, // px
    doubleOffset: 0.7, // px, second pencil pass offset (x; y is -0.6 of it)
    doubleOffsetY: -0.6, // factor on doubleOffset for the y shift
    doubleAlpha: 0.3, // 0..1
  },

  // Depth peeling (SD1, SD3): the renderer peels the nearest surfaces of each pixel, front to back.
  peel: {
    layers: 4, // count, depth layers peeled at full detail (at most 4)
    layersLow: 2, // count, layers once rung C is dropped (the deep layers go with the wall shading)
    edgeEps: 0.05, // mm, an edge is covered only by a surface nearer than its depth less this
    ownEps: 0.3, // mm, extra margin for the faces of the edge's own solid (added to ownPx / s)
    ownPx: 2.5, // px, margin for the faces of the edge's own solid, as a screen distance
  },

  // The camera (SD11): a turntable about z. A view is [yaw, tilt] in degrees: yaw turns the drawing about z, tilt is the
  // angle from plan (0) to side elevation (90).
  camera: {
    pad: 28, // px, margin round the drawing when a view is fitted to the sheet
    snap: 4, // degrees, a view this close to a named view is that view (title block, orbit snapping)
    views: { PLAN: [0, 0], FRONT: [0, 90], SIDE: [90, 90], ISOMETRIC: [45, 54.7356], DIMETRIC: [20.7, 70.5288] } as Record<string, readonly [number, number]>, // [yaw, tilt] degrees
    auxMinCos: 0.02, // an AUX view down an axis that stands this close to vertical turns the drawing's up to y
  },

  // Section views (SD19): the cut faces are paper hatched at 45 degrees, with a bold outline.
  section: {
    hatch: { pitch: 7, width: 1.2, alpha: 0.45 }, // px between lines, px, 0..1 ink
    outline: { width: 1.6, alpha: 1 }, // px, 0..1: the bold outline of a cut face
  },

  // Detail views (SD20): a magnified window, framed and lettered.
  detailView: {
    frame: { width: 1, alpha: 0.7, dash: [6, 3] as const }, // px, 0..1, px: the window's frame in the main view
    minScale: 1.5, // factor, the least magnification a detail view is drawn at
  },

  // Ghost paths, phantom positions, ticks, explode trails (SD21, SD23, SD24, SD12).
  ghost: { alpha: 0.4, dash: [3, 3] as const, width: 1 }, // factor on path.alpha, px, px
  phantom: { dash: [4, 3] as const, width: 0.8, alpha: 0.85 }, // px, px, factor on the hidden lines' alpha
  tick: { half: 3.5, width: 1, alpha: 0.8 }, // px half length of the cross mark, px, 0..1 ink
  trail: { width: 0.7, alpha: 0.55, dash: [2, 3] as const }, // px, 0..1, px: explode trail lines

  // Traced paths and the comet (SD7), accent.
  path: {
    color: "accent" as ColorName,
    dash: [1.5, 3.5] as const, // px
    width: 1, // px
    alpha: 0.55, // 0..1
    otherGain: 0.8, // factor on alpha for every path after the first
    comet: 2.6, // px, comet trail width at the head
    cometMin: 0.4, // px, comet trail width at the tail
    cometAlpha: 0.95, // 0..1 at the head, fading to 0
    cometSamples: 80, // count, longest trail in path samples (at most half the path)
    headR: 2.6, // px, open circle at the current point
    headStroke: 1.2, // px
  },

  // Chain centrelines through every joint head (SD6).
  centre: {
    dash: [9, 2.5, 1.5, 2.5] as const, // px, long dash, gap, short dash, gap
    width: 0.6, // px
    alpha: 0.5, // 0..1
    overshoot: 6, // px past the head
    maxTilt: 60, // degrees, hidden at and above this tilt
    endOnDeg: 8, // degrees, an axis this close to the view direction is drawn as a centre cross (3D renderer)
    cross: 6, // px, half length of the centre cross seen end-on (3D renderer)
    minScale: 0.8, // px per mm, hidden when the drawing is smaller than this
  },

  // Overall base-plate dimensions (SD8), detail stage only.
  dims: {
    offset: 18, // px, dimension line distance from the plate
    gap: 3, // px, gap between the plate and an extension line
    ext: 5, // px, extension line past the dimension line
    alpha: 0.6, // 0..1
    width: 0.7, // px
    arrow: 7, // px, filled arrowhead length
    arrowAngle: 0.3, // radians, arrowhead half-angle
    labelPad: 8, // px, extra knock-out width round a label
    labelH: 12, // px, knock-out height
    labelPaper: 0.95, // 0..1, paper alpha of the knock-out
    labelGain: 0.25, // added to alpha for the label text (capped at 1)
    minDepthPx: 40, // px, depth label only when the projected depth is at least this
    minCos: 0.2, // dimensions drawn only when cos(tilt) is above this
  },

  // Sheet frame, zones and title block (SD10), detail stage only.
  sheet: {
    inset: 10, // px, outer border from the canvas edge
    innerOffset: 4, // px, inner border inside the outer one
    outer: { width: 1, alpha: 0.55 }, // px, 0..1
    inner: { width: 0.5, alpha: 0.3 }, // px, 0..1
    zones: true, // zone ticks with numbers across and letters down
    zonePitch: 140, // px, target zone width (at least 2 zones each way)
    zoneTick: 4, // px
    zoneAlpha: 0.45, // 0..1, zone labels
    zoneLabelInset: 2.5, // px from the border
    titleBlock: true,
    titleMinCanvas: 420, // px, title block only on canvases wider than this
    titleMaxW: 250, // px, block width cap
    titleWFrac: 0.4, // fraction of canvas width, block width otherwise
    titleRow: 15, // px, row height (3 rows)
    titleSplit: 0.62, // fraction of block width where the second column starts
    titlePaper: 0.92, // 0..1, paper alpha of the block
    titleRule: { width: 0.8, alpha: 0.6 }, // px, 0..1
    titleKeyAlpha: 0.5, // 0..1
    titleValueAlpha: 0.9, // 0..1
    titleKeyX: 4, // px, key inset
    titleKeyY: 5, // px, key baseline from the row top
    titleValueX: 40, // px, value inset
    titleValueMargin: 44, // px, value truncated to the cell width less this
    planTilt: 8, // degrees, VIEW reads PLAN at or below this
    elevationTilt: 80, // degrees, VIEW reads ELEVATION at or above this; also the side view of the detail ladder
    defaultTilt: 28, // degrees, the view when none is given
    stamp: { text: "3D", width: 0.8, alpha: 0.85 }, // the transition stamp in the title block (SS13): its lettering, hairline px, ink alpha
  },

  // Overlays (SD14): colours by token name, never changing the drawing beneath.
  overlays: {
    forces: { color: "accent", alpha: 1 },
    forcesWarn: { color: "warn", alpha: 1 },
    angles: { color: "ink", alpha: 0.9 },
    velocity: { color: "vel", alpha: 1 },
    panel: { color: "paper", alpha: 0.92 }, // label panel fill
    border: { color: "ink", alpha: 0.35 }, // label panel hairline
    width: 1.6, // px, force and velocity arrows
    arrow: 10, // px, force arrowhead
    arrowSmall: 9, // px, axial and spin arrowheads
    arrowDim: 7, // px, dimension arrowheads
    shortLine: 70, // px, a construction line shorter than this carries its label past its far end
    shortGap: 8, // px, gap from that end to the label
    arrowAngle: 0.42, // radians, arrowhead half-angle
    axialDash: [5, 4] as const, // px
    axialOvershoot: 14, // px past each end
    angleR: 22, // mm, default angle arc radius
    spinR: 24, // mm, default spin arc radius
    angleGuide: { width: 1, alpha: 0.55, dash: [3, 3] as const, reach: 1.5 }, // px, 0..1, px, factor on radius
    angleArc: 1.8, // px
    bend: { width: 1.4, zoneAlpha: 0.35, ticks: 5 }, // px, 0..1, count: a flexure's bent centreline and stress zone ticks
    line: { width: 1, alpha: 0.6, dash: [4, 4] as const }, // px, 0..1, px
    dimWidth: 1, // px
    velocityLen: 34, // px, arrow length at the point's peak speed
    velocityMin: 2, // px, shorter arrows are not drawn
    labelPadX: 6, // px, text inset in the panel
    labelH: 19, // px, panel height
    labelHSmall: 17, // px, small panel height
    labelBorder: 0.8, // px, panel hairline width
    labelEdge: 4, // px, labels kept this far inside the canvas
    labelSpacing: 3, // px, gap when a label is pushed below another
  },

  // Output plot (SD15).
  plot: {
    margin: { left: 40, right: 8, top: 8, bottom: 22 }, // px
    grid: { width: 1, alpha: 0.14, dash: [2, 3] as const }, // px, 0..1, px
    labelAlpha: 0.5, // 0..1, axis tick labels
    curve: { width: 1.6, alpha: 0.95 }, // px, 0..1, ink
    ghost: { width: 1, alpha: 0.45, dash: [3, 3] as const }, // px, 0..1, px: the same output at the settings not selected
    second: { width: 1.2, alpha: 0.7, dash: [7, 3] as const }, // px, 0..1, px: a further output in the same unit
    hatch: { pitch: 5, width: 0.7, alpha: 0.18 }, // px, px, 0..1, hatching under the curve
    cursorAlpha: 0.6, // 0..1, accent cursor line
    pointR: 4, // px, current point in accent
    pad: 0.08, // fraction of the value range added above and below
    ticks: 3, // count, target value gridlines
    dprMax: 2, // device pixel ratio cap of the plot canvas
  },

  // Joint highlight callout, accent.
  highlight: {
    color: "accent" as ColorName,
    r: 18, // px, dashed circle radius
    dash: [4, 3] as const, // px
    width: 1.3, // px
    alpha: 0.95, // 0..1
    leader: [13, 30, 52] as const, // px, leader start (diagonal), elbow, end (horizontal)
    labelOffset: 32, // px, label position right of and above the head
  },

  // Canvas lettering (SF8): families and sizes by token name, CSS font-weight.
  type: {
    uppercase: true, // canvas lettering is uppercase (SF7)
    titleKey: { family: "mono", weight: 500, size: "titleKey" },
    titleValue: { family: "mono", weight: 600, size: "titleValue" },
    zone: { family: "mono", weight: 500, size: "zone" },
    dims: { family: "mono", weight: 500, size: "dims" },
    callout: { family: "mono", weight: 600, size: "callout" },
    overlay: { family: "mono", weight: 500, size: "overlay" },
    overlaySmall: { family: "mono", weight: 500, size: "overlaySmall" },
    plot: { family: "mono", weight: 500, size: "plot" },
  } satisfies { uppercase: boolean } & Record<string, FontSpec | boolean>,
} as const;

export type Draft = typeof DRAFT;
