// Catalogue record type and controlled vocabularies. The source of truth for both is data/catalog/record-spec.md;
// a change there is made here in the same commit.
import type { Kin, Teaching } from "./kin";

export const VOCABULARIES = {
  family: [
    "Linkage", "Straight-line linkage", "Quick-return", "Gears", "Intermittent", "Cam", "Coupling", "Screw",
    "Flexible drive", "Friction drive", "Escapement", "Clutch & ratchet", "Spatial linkage", "Compliant",
  ],
  level: ["Basic", "Intermediate", "Advanced"],
  motion: [
    "Rotary", "Oscillating", "Linear", "Intermittent rotary", "Intermittent linear", "Straight line", "Path", "Helical",
  ],
  character: [
    "Continuous", "Reciprocating", "Intermittent", "Dwell", "One-way", "Variable speed", "Quick-return", "Harmonic",
    "Constant velocity", "Non-uniform", "Reversing", "Self-locking", "Toggle",
  ],
  axes: [
    "Parallel", "Coaxial", "Perpendicular intersecting", "Perpendicular skew", "Angled intersecting", "Offset parallel",
    "Rotary-to-in-plane", "Rotary-to-along-axis", "Same line", "n/a",
  ],
  plane: ["Planar", "Spatial"],
  ratioKind: [
    "Reduction", "Step-up", "Unity", "Selectable", "Variable", "Continuously variable", "Stroke", "Index step",
    "Force amplification", "Scaling", "None",
  ],
  ratioClass: [
    "1:1", "Low (<5:1)", "Medium (5:1 to 50:1)", "High (50:1 to 500:1)", "Very high (>500:1)", "Variable", "n/a",
  ],
  function: [
    "Motion conversion", "Speed reduction", "Speed increase", "Torque multiplication", "Force amplification",
    "Straight-line generation", "Path generation", "Function generation", "Indexing", "Dwell", "Quick return",
    "One-way drive", "Locking", "Clamping", "Lifting", "Walking", "Scaling & copying", "Drawing curves",
    "Shaft coupling", "Misalignment compensation", "Differential & summing", "Power splitting", "Timing & regulation",
    "Energy storage", "Reversing", "Positioning", "Steering", "Valve timing", "Pumping & compression",
  ],
  property: [
    "Exact", "Approximate", "Compact", "Coaxial", "High ratio", "Low backlash", "Self-locking", "Backdrivable",
    "Smooth (harmonic)", "Shock at engagement", "Positive drive", "Friction-based", "Over-centre", "Grashof",
    "Non-Grashof", "Singular positions", "Balanced", "Few parts", "Precision", "High load", "Historic",
  ],
  application: [
    "Automotive", "Machine tools", "Robotics", "Clocks & watches", "Packaging & automation", "Aerospace",
    "Agriculture", "Printing & textiles", "Film & optics", "Steam & engines", "Railways", "Toys & kinetic art",
    "Medical", "Consumer products", "Construction & lifting", "Marine", "Instruments", "Energy", "Education",
  ],
  refKind: [
    "wikipedia", "textbook", "kmoddl", "paper", "standard", "patent", "museum", "engineering-guide", "calculator",
  ],
  mediaKind: ["video", "photos", "animation", "interactive"],
  precision: ["day", "year", "period"],
} as const;

export type Vocabularies = typeof VOCABULARIES;
type Of<K extends keyof Vocabularies> = Vocabularies[K][number];

export type Family = Of<"family">;
export type Level = Of<"level">;
export type Motion = Of<"motion">;
export type Character = Of<"character">;
export type Axes = Of<"axes">;
export type Plane = Of<"plane">;
export type RatioKind = Of<"ratioKind">;
export type RatioClass = Of<"ratioClass">;
export type FunctionTag = Of<"function">;
export type PropertyTag = Of<"property">;
export type ApplicationTag = Of<"application">;
export type ReferenceKind = Of<"refKind">;
export type MediaKind = Of<"mediaKind">;
export type Precision = Of<"precision">;

export interface Link<K extends string> {
  title: string;
  url: string;
  kind: K;
}

/** When the mechanism was first invented, patented, used or described, whichever is earliest (record-spec.md). */
export interface Origin {
  /** YYYY-MM-DD, the year negative before the year 1 (-0250 is 250 BC). */
  date: string;
  /** day: the full date is known; year: only the year, the month and day come from the id; period: a best-guess year. */
  precision: Precision;
  /** What the date is and the source URL, or a best guess marked as such. */
  note: string;
}

/** A real product or machine using the mechanism, shown in a YouTube video of real footage (no animations or renders). */
export interface RealWorld {
  product: string;
  maker?: string;
  use: string;
  /** youtube.com/watch, youtube.com/shorts or youtu.be. */
  url: string;
  note?: string;
}

/** The festive duty class of a seasonal record (record-spec.md, DUTY; what each means is in the seasonal catalogue). */
export const DUTIES = ["Domestic", "Community", "Commercial", "Municipal"] as const;
export type Duty = (typeof DUTIES)[number];

/** One year's occurrence of a holiday, YYYY-MM-DD, both days included (the same day for a one-day holiday). */
export interface Occurrence {
  start: string;
  end: string;
}

/** What makes a record a fictional seasonal mechanism (standard P14; record-spec.md, "Seasonal records"). */
export interface Season {
  occasion: string;
  /** Prose: how the date is found each year. */
  date_rule: string;
  duty: Duty;
  /** Each year's occurrence, in order, written a few years ahead. */
  dates: Occurrence[];
}

/** A generated image of a seasonal mechanism at work in its invented setting, shown on its page once it has a file. */
export interface SeasonImage {
  prompt: string;
  alt: string;
  /** The WebP's name in site/seasonal/, empty until the image is made and reviewed. */
  file?: string;
}

export interface BuildSpec {
  ground: string;
  input: string;
  output: string;
  members: { id: string; role: string; def: string }[];
  joints: { id: string; type: string; between: string[] }[];
  params: { name: string; value: number | string; unit?: string; note?: string }[];
  defining_relations?: string;
  range?: string;
  overlays?: string[];
  plot?: string;
  notes?: string;
}

export interface CatalogRecord {
  /** 2 until the cut-over, 3 after; v3 requires `kin` and `teaching` and rejects the retired `build` fields. */
  record_version?: 2 | 3;
  id: string;
  name: string;
  aka?: string[];
  in_site?: boolean;
  family: Family;
  level: Level;
  summary: string;
  motion: {
    input: Motion;
    output: Motion;
    /** Derived on merge: "Input → Output". */
    label: string;
    output_character: Character[];
    axes: Axes;
    plane: Plane;
  };
  ratio: { kind: RatioKind; class: RatioClass; typical: string };
  dof: number;
  topology?: { links: number; revolute: number; prismatic: number; higher_pairs: number; notes?: string };
  backdrivable: string;
  tags: {
    function: FunctionTag[];
    property: PropertyTag[];
    application: ApplicationTag[];
    keywords?: string[];
  };
  explain: { motion: string; forces: string; benefits: string; limits: string };
  build: BuildSpec;
  /** Record v3: the kinematic model. Present on every record; required at record_version 3. */
  kin?: Kin;
  /** Record v3: what makes the drawing teach. */
  teaching?: Teaching;
  examples?: { use: string; detail: string }[];
  references: Link<ReferenceKind>[];
  media: Link<MediaKind>[];
  /** May be empty: no video is better than a wrong one. */
  real_world?: RealWorld[];
  related: string[];
  /** Set from the patch file sources/origin.json; the validator requires it. */
  origin?: Origin;
  /** The day the mechanism's sheet went live, YYYY-MM-DD, from the patch file sources/added.json; every drawn mechanism
   * has one (the Recovered badge, the library's New order). */
  added?: string;
  /** Minimum counts this record is exempt from, set in a patch file where research found no more. */
  waive?: Waivable[];
  /** A fictional seasonal mechanism (standard P14): its occasion and dates; it has no references, media or real_world. */
  season?: Season;
  /** A seasonal record's 2 to 4 generated images, in place of its links. */
  images?: SeasonImage[];
}

export const WAIVABLE = ["media", "references"] as const;
export type Waivable = (typeof WAIVABLE)[number];

export interface Catalog {
  version: number;
  generated: string;
  vocabularies: Vocabularies;
  mechanisms: CatalogRecord[];
}
