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
export type SurfaceKey = "driver" | "link" | "link2" | "output" | "ground" | "base" | "bearing" | "hw" | "trace";

export const DRAFT = {
  // Paper: radial gradient paper -> paperEdge, then grain (paint order step 1, step 7).
  paper: {
    centre: [0.5, 0.45] as const, // gradient centre as a fraction of canvas width, height
    radius: 0.75, // gradient radius as a fraction of the larger canvas side
    grainTile: 128, // px, side of the cached noise tile
    grainBlend: { dark: "overlay", light: "multiply", forge: "overlay" } as const, // composite operation of the paper tooth per sheet
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
  card: {
    detail: "C" as const, // detail dial position of a card drawing (DL): sharp, without wall shading or the deep layers
    refW: 320, // px, width of the canvas the card thumbnails are drawn on; a live card scales its margin to it
    lines: 0.8, // factor on every line's width on a card, so its weights read in proportion to the mechanism page's
    plateTopFactor: 0.6, // factor on lines.plateTop on a card
    baseTopFactor: 0.6, // factor on lines.baseTop on a card
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
    silhouetteShare: 1.6, // factor on a smooth outline's share of the line, so two edges sharing it read as one line
    edge: 0.7, // px, visible bottom edges of non-plates
    edgeAlpha: 0.7, // 0..1
    chamfer: 0.45, // px
    chamferAlpha: 0.5, // 0..1
    chamferMinScale: 1.5, // px per mm, chamfer lines drawn only above this projection scale
    capFade: 0.12, // cos of a cap toward the viewer below which its bold top outline blends into the far cap's style (no pop as it turns edge-on)
    marks: 0.6, // px, engraved marks
    marksAlpha: 0.55, // 0..1
    carve: 0.55, // px, carved lines and features on decorated scenery
    carveAlpha: 0.6, // 0..1
    quilt: 0.45, // px, fill patterns on scenery (quilting, hatching)
    quiltAlpha: 0.35, // 0..1
    thread: 0.5, // px, thread helices
    threadAlpha: 0.45, // 0..1
    baseChamferGain: 0.7, // factor on chamferAlpha for the base plate
    baseMarksGain: 0.75, // factor on marksAlpha for the base plate
    // How an edge looks where a part covers it (SD3): width and alpha are factors on the visible line.
    hidden: { dash: [3, 2.4] as const, width: 0.75, alpha: 0.5 }, // dash px, factor, factor
    // Ring round the input shaft head (SD5).
    accentRing: {
      color: "accent" as ColorName,
      width: 1.8, // px
      radius: 0.62, // factor on the head's projected half-size, per axis
      alpha: 1, // 0..1 on the lines layer
      hiddenAlpha: 0.7, // 0..1 on the frame (shows through covering parts)
      segments: 72, // straight pieces of the ring
      // While the drawing is paused, the ring breathes (none while it plays, none under reduced motion): its strength
      // runs from 1 down to `low` and back once a `period`, redrawn `fps` times a second.
      breathe: { period: 5, low: 0.35, fps: 15 }, // s, 0..1, count per s
    },
  },

  // Surfaces: paper opacity per kind, 0..1 (SD2), and how much each erases the lines layer (SD3).
  fill: {
    // a floor under a piece of the same body (an internal Geneva wheel's web, seen through its ring's slots), so a cut
    // through the piece reads as a cut, not as more of the piece (SD4)
    floor: {
      pattern: 0, // 0..1, share of its role pattern
      tint: 0, // 0..1, ink tint on its faces
    },
    plate: 0.9,
    other: 0.95,
    base: 0.96, // laid once, on the top face (the parts under it read only through `occlude.base`)
    wall: 0.86,
    baseWallGain: 0.8, // factor on `wall` for the base plate's walls
    wallOcclude: 0.9, // factor on the occlusion for side walls
    occlude: { plate: 1, other: 0.97, base: 0.92 }, // the base lets a twelfth of what is under it show through
    // A solid over a working zone or a principle part (L5, T10): a factor on its paper (`opacity`) and on its occlusion
    // (`occlude`), so what lies behind reads through it, and a flat ink wash on its faces (`tint`, 0..1), so it still reads
    // as a solid pane and never as empty outlines.
    seeThrough: { opacity: 0.85, occlude: 0.9, tint: 0.06, kinds: ["plate", "bridge", "housing", "bracket", "part"] as const },
    // Ink shade on side walls, stepped by facing: alpha = shade * (from + span * i / (steps - 1)).
    wallShade: {
      shade: 0.1, // 0..1 ink alpha
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
    link2: { pattern: "cross", step: 2.6, alpha: 0.3, tint: 0 }, // a second set of like links, told apart from the first (T16)
    output: { pattern: "hatch", step: 2.1, alpha: 0.3, tint: 0.03 },
    ground: { pattern: "dash", step: 3.2, alpha: 0.24, tint: 0.035 },
    base: { pattern: "dots", step: 4.0, alpha: 0.18, tint: 0 },
    bearing: { pattern: "cross", step: 0.9, alpha: 0.22, tint: 0.06 },
    hw: { pattern: "none", tint: 0.12 },
    trace: { pattern: "none", tint: 0.2 },
  } satisfies Record<SurfaceKey, RoleSurface>,

  minPx: 2.2, // px, a pattern step (and any repeated mark) is never drawn finer than this on screen (SF11)

  // Pattern tiles: one tile is one pattern step, mapped through the part's pose.
  pattern: {
    offBelowCos: 0.15, // patterns are gone when cos(tilt) is below this (near edge-on, SD11)
    fadeCos: 0.15, // over this much cos(tilt) above offBelowCos a pattern fades in, so it never switches off in one frame
    superBelowPx: 8, // device px, a pattern step finer than this on screen is sampled four times per pixel (no shimmer)
    tile: 24, // px, cached tile side (tile units below)
    dotRadius: 3.6, // tile px, soft dot radius
    dotMid: [0.55, 0.8] as const, // gradient stop position and its alpha, soft dot falloff
    lineWidth: 2.2, // tile px, hatch, cross and dash strokes
    dashes: [[3, 10, 6], [15, 22, 18]] as const, // tile px, dash segments as [x0, x1, y]
  },

  // The part to watch (SD30): a small or internal critical part a record names in teaching.focus, tinted in the accent.
  focus: {
    accent: 0.55, // 0..1, the tint toward the accent on its faces, walls and cut faces; its own opacity is kept
    edge: 1.25, // factor on its edges' width, which stay ink
    cover: 0.25, // factor on a see-through part's opacity for the rest of a body whose pieces are the part (a nut round its balls)
  },

  // Rulings on a turning round part (SD29): faint lines along its round walls and short ticks round the rim of its faces,
  // registered to the part, so a plain shaft, roller or disc shows that it turns. Toothed parts show it by their teeth.
  // A running belt carries the same lines across it, carried round with its travel.
  spin: {
    pitch: 7, // mm, ruling spacing round the part's largest radius (the count is the same on every step of a shaft)
    count: [8, 48] as const, // rulings round the part, least and most (a multiple of four)
    width: 0.6, // px
    alpha: 0.45, // 0..1, times the face's faint factor
    fadePx: [3, 6] as const, // px, rulings closer than this on screen fade out (from fully gone to fully drawn)
    band: 0.14, // factor on the radius, the ticks' length in from the rim on a face
    bandMax: 5, // mm, the ticks' longest length
    gap: 30, // degrees, a round part's widest ring has no gap wider than this round the axis (a polygon's corners do)
    round: [0.85, 0.97] as const, // factors on the radius: a part with no outline point between them is round (a gear's teeth fill the band)
    belt: [5, 9] as const, // mm, a running belt's mark spacing, least and most: a whole number round it, the count whose cycle's travel is nearest a whole number of marks
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
    planOpens: 28, // degrees of tilt a record that declares PLAN opens at (it reads flat in plan; T7)
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
  tick: { half: 3, width: 1, alpha: 0.75, minGap: 10, minPath: 60 }, // px half length across the path, px, 0..1 of the path's accent, px least spacing on screen, px shortest path that carries ticks
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
    // A curved path seen edge-on (SD7): it fades out as its screen thinness falls, relative to its own in 3D, through
    // `fade`; a path thinner than `straight` in 3D is straight and always drawn.
    edgeOn: { fade: [0.06, 0.18] as const, straight: 0.05 }, // ratios, ratio
    headStroke: 1.2, // px
    // A point whose path does not close over one cycle (a gear's mark turns on past a whole turn) is followed for up to
    // `cycles` cycles, until its path closes or has gone all round, in `samples` samples at most.
    cycles: 40, // count
    samples: 1440, // count
  },

  // Chain centrelines through every joint head (SD6).
  centre: {
    dash: [9, 2.5, 1.5, 2.5] as const, // px, long dash, gap, short dash, gap
    width: 0.6, // px
    alpha: 0.5, // 0..1
    overshoot: 6, // px past the head
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
    // The microprint (LM-05): between the two borders, in the gaps between the zone marks, a line of ones and zeros so
    // small that it reads as a dotted rule; zoomed in, it is the 8-bit ASCII of the sheet's MICROPRINT text.
    microprint: { color: "grid" as ColorName, alpha: 0.5, gap: 3 }, // token, 0..1, px clear of a zone mark or a corner
    titleBlock: true,
    titleMinCanvas: 420, // px, title block only on canvases wider than this
    titleMaxW: 270, // px, block width cap
    titleMinW: 250, // px, block width floor, so the DATE cell holds its date on a narrow stage
    titleWFrac: 0.4, // fraction of canvas width, block width between the two
    titleRow: 15, // px, row height (4 rows)
    titleSplit: 0.6, // fraction of block width where the second column starts
    titlePaper: 0.92, // 0..1, paper alpha of the block
    titleRule: { width: 0.8, alpha: 0.6 }, // px, 0..1
    titleKeyAlpha: 0.5, // 0..1
    titleValueAlpha: 0.9, // 0..1
    titleKeyX: 4, // px, key inset
    titleKeyY: 5, // px, key baseline from the row top
    titleValueX: 40, // px, value inset
    titleValueMargin: 44, // px, value truncated to the cell width less this
    elevationTilt: 80, // degrees, the side view of the detail ladder at or above this tilt
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
    arrowDim: 7, // px, dimension arrowheads
    shortLine: 70, // px, a construction line shorter than this carries its label past its far end
    shortGap: 8, // px, gap from that end to the label
    arrowAngle: 0.42, // radians, arrowhead half-angle
    angleR: 22, // mm, default angle arc radius
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
    // Construction labels (SD22): callouts on a stage at least `minStage` wide, else numbered markers with a key.
    labels: {
      minStage: 640, // px, the narrowest stage that gets callouts
      dim: 0.35, // 0..1, the other labels while one is picked out
      samples: 24, // phases of the cycle a label's anchor is followed over to set its place
    },
    // Construction labels on a wide stage as elbow callouts (SD22): drop, shoulder, lettering on the shoulder.
    callout: {
      drop: 16, // px, the shortest drop from the anchor to the shoulder
      rows: 10, // rows tried above the anchor, and as many below
      maxRun: 320, // px, the longest shoulder run before the lettering (to carry it clear of the drawing)
      runStep: 16, // px, the shoulder runs tried
      overDrawing: 60, // cost of lettering wholly over the drawing, against px of leader (perPx)
      perPx: 0.05, // cost per px of leader (drop and run)
      otherSide: 3, // cost of the shoulder running inboard instead of outboard
      clear: 8, // px, the lettering's clearance from the drawing
      rowGap: 6, // px, between rows
      sepX: 12, // px, the least paper between two labels across
      sepY: 8, // px, the least paper between two labels up and down
      textH: 11, // px, the lettering's height
      lift: 3, // px, the lettering above its shoulder
      gap: 6, // px, from the drop to the lettering, and past it to the shoulder's end
      width: 1.1, // px, leader
      leaderAlpha: 0.9, // 0..1
      textAlpha: 1, // 0..1
      arrow: 7, // px, the arrowhead's length at the element
      arrowAngle: 0.38, // radians, its half-angle
      dot: 2.4, // px, radius of the dot where a leader has no drop
      panel: 0.85, // 0..1, paper behind the lettering
      replanDeg: 25, // degrees the view turns before the rows are chosen again
      sep: 16, // px, the least distance between two labels' anchors (each takes its own point on its element)
      tween: 200, // ms, a row moving to its new place
    },
    // A picked construction label's end (SD22): it swells by `amount` and settles once a `period` (none under reduced motion).
    pulse: { amount: 0.45, period: 1100 }, // factor, ms
    // Construction labels on a narrow stage (SD22): numbered markers by the anchors, the key under the stage.
    marker: { r: 7, width: 0.9, offset: 9, leaderWidth: 0.6, leaderAlpha: 0.45, dim: 0.4 }, // px, px, px, px, 0..1, 0..1
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
    micro: { family: "mono", weight: 500, size: "micro" },
    dims: { family: "mono", weight: 500, size: "dims" },
    callout: { family: "mono", weight: 600, size: "callout" },
    overlay: { family: "mono", weight: 500, size: "overlay" },
    overlaySmall: { family: "mono", weight: 500, size: "overlaySmall" },
    plot: { family: "mono", weight: 500, size: "plot" },
  } satisfies { uppercase: boolean } & Record<string, FontSpec | boolean>,
} as const;

export type Draft = typeof DRAFT;
