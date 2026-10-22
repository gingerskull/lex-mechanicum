// TOKENS: the two sheet palettes, the type families and the shared sizes. One source per value (style SA1); the site's
// tokens.css is generated from this file (SA2), the renderer reads it through theme(). Semantic names only (SA3).
// Colours are hex strings; alphas and gains are 0..1; sizes are CSS px unless a comment says otherwise.

export type ThemeKey = "dark" | "light";

/** The colour tokens of a theme, by semantic name. */
export type ColorName = "bg" | "paper" | "paperEdge" | "ink" | "grid" | "accent" | "accentInk" | "vel" | "warn" | "ok";

export interface Theme extends Record<ColorName, string> {
  name: string; // sheet name shown in the theme switch
  patternGain: number; // multiplies every role-pattern alpha on this sheet, 0..1
  grain: number; // paper tooth strength, 0..1 alpha of the noise tile
}

/** A value that differs per sheet. */
export type PerTheme<T> = Record<ThemeKey, T>;

export const COLOR_NAMES: readonly ColorName[] = [
  "bg", "paper", "paperEdge", "ink", "grid", "accent", "accentInk", "vel", "warn", "ok",
];

export const TOKENS = {
  themes: {
    dark: {
      name: "Blueprint",
      bg: "#0F1A26", // page background outside sheets
      paper: "#142130", // sheets, cards, panels, surface fill on drawings
      paperEdge: "#0C151F", // outer stop of the drawing's paper gradient
      ink: "#E6EDF5", // all lines, patterns, text
      grid: "#A9BCD2", // sheet grid, used at low alpha
      accent: "#F29A6B", // input ring, traced paths, forces, the page's few highlights (SF2, SD5)
      accentInk: "#1A0E06", // text on an accent fill
      vel: "#9CCFE0", // velocity overlay
      warn: "#FFC46B", // amber: out-of-range forces and angles, single-shear badge
      ok: "#9FE8C8", // double-shear badge
      patternGain: 1, // 0..1
      grain: 0.035, // 0..1, overlay blend (draft.paper.grainBlend)
    },
    light: {
      name: "Drafting",
      bg: "#ECE9E0",
      paper: "#F3F1EA",
      paperEdge: "#E6E2D6",
      ink: "#1C2636",
      grid: "#5B8BC4",
      accent: "#D4472B",
      accentInk: "#FFF7F2",
      vel: "#2B6CB0",
      warn: "#A8620B",
      ok: "#1F7A55",
      patternGain: 0.8, // 0..1: patterns read the same weight on bright paper (SF6)
      grain: 0.05, // 0..1, multiply blend
    },
  } satisfies PerTheme<Theme>,

  // Derived ink tiers for the page: alpha of ink (0..1) per sheet; tokens.css turns them into colour-mixes of --ink.
  tiers: {
    body: { dark: 0.82, light: 0.84 }, // body text
    muted: { dark: 0.62, light: 0.64 }, // secondary text
    faint: { dark: 0.42, light: 0.45 }, // labels only (SF5)
    line: { dark: 0.2, light: 0.2 }, // internal rules
    line2: { dark: 0.38, light: 0.42 }, // frames
    surface: { dark: 0.035, light: 0.025 }, // faint panel fill
    surface2: { dark: 0.08, light: 0.06 }, // hover / pressed panel fill
    mark: { dark: 0.2, light: 0.16 }, // the faded mark at the foot of every page
  } satisfies Record<string, PerTheme<number>>,

  // Page grid alphas: alpha of the grid colour (0..1) per sheet, minor and major lines.
  gridTiers: {
    grid1: { dark: 0.06, light: 0.08 },
    grid2: { dark: 0.11, light: 0.15 },
  } satisfies Record<string, PerTheme<number>>,

  type: {
    display: '"IBM Plex Sans Condensed", "Arial Narrow", system-ui, sans-serif', // titles, card names, section heads
    body: '"IBM Plex Sans", "Helvetica Neue", system-ui, sans-serif', // running text
    mono: '"IBM Plex Mono", ui-monospace, Menlo, monospace', // technical lettering, every canvas label
    weights: {
      display: [500, 600, 700], // CSS font-weight values shipped in the subset
      body: [400, 500, 600],
      mono: [400, 500, 600],
    },
    leading: 1.55, // body line height, unitless multiple of the font size
    tracking: {
      display: 0.015, // em, uppercase display lettering (.01 to .02)
      mono: 0.08, // em, default for mono labels (.04 to .14)
      monoWide: 0.14, // em, widest mono tracking (kickers, title-block keys)
    },
    size: {
      body: 15, // px, body text
      titleKey: 7, // px, title-block key
      titleValue: 8.5, // px, title-block value
      zone: 8.5, // px, sheet zone marks
      dims: 10, // px, dimension labels
      callout: 9.5, // px, joint highlight callout
      overlay: 11, // px, overlay labels
      overlaySmall: 10, // px, small overlay labels (lines, dims)
      plot: 10, // px, output plot labels
    },
  },

  size: {
    grid: 12, // px, sheet grid minor pitch, canvas and page (SF12)
    gridMajor: 5, // count, minor squares per major line
    maxWidth: 1280, // px, page content width
    cardMin: 290, // px, minimum card width in the library grid
    gap: 20, // px, card grid and mechanism layout gap
    headerPadY: 30, // px, header vertical padding
    headerPadX: 22, // px, header horizontal padding
    barPad: 9, // px, sticky bar row padding
    side: 330, // px, mechanism page side column
    gutter: 16, // px, phone side gutter (SS9)
    play: 38, // px, play button diameter, the one round control
    marker: 30, // px, explanation marker diameter
    bpWide: 1000, // px, mechanism layout drops to one column below this
    bpPhone: 640, // px, phone layout below this
    focusOffset: 3, // px, focus outline offset (SS10)
    mark: 44, // px, side of the faded mark at the foot of every page
    transition: 0.2, // s, colour and border transitions (SS11)
  },

  ratio: {
    stage: "16 / 10", // aspect ratio of the stage
    stagePhone: "4 / 3", // stage under bpPhone, and the card drawing field
  },
} as const;

export type Tokens = typeof TOKENS;
