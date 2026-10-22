// Record v3: the `kin` and `teaching` blocks. The source of truth is data/catalog/record-spec.md ("Record v3"); a change
// there is made here in the same commit.

export const KIN_VOCAB = {
  bodyRole: ["ground", "driver", "link", "output", "slider", "gear", "cam", "follower", "pawl", "spring", "belt", "frame"],
  shape: [
    "link", "plate", "slotLink", "slider", "gear", "rack", "ringGear", "cam", "disc", "shaft", "sprocket", "pulley",
    "rope", "cage", "cross", "tracer", "cylinder", "piston", "custom", "genevaWheel", "genevaCrank", "intermittentDriver", "intermittentDriven", "star",
  ],
  customOp: ["extrude", "revolve", "sweep", "loft"],
  joint: [
    "revolute", "prismatic", "cylindrical", "screw", "pin-in-slot", "gear-mesh", "cam-contact", "belt", "rolling",
    "spherical", "universal", "planar", "flexure",
  ],
  flexible: ["belt", "chain", "rope", "cvt"],
  driver: ["rotary", "oscillating", "linear", "manual", "select"],
  block: [
    "dyad", "slider-dyad", "gear-mesh", "willis", "hooke", "homokinetic", "bennett", "cam", "screw", "convey",
    "flexure", "escapement", "rocker", "indexer", "star",
  ],
  output: ["angle", "position", "speed-ratio", "path"],
} as const;

export const TEACHING_VOCAB = {
  verdict: ["keep", "tweak", "rethink"],
  overlay: ["line", "arc", "circle", "chord", "dimension", "axis-line", "workspace", "bend"],
  viewName: ["PLAN", "FRONT", "SIDE", "ISOMETRIC", "DIMETRIC"],
  viewKind: ["section", "detail"],
  control: ["driver", "param", "design", "selector"],
  stat: ["range", "max", "min", "mean", "ratio", "phase", "dwell", "at"],
} as const;

type Vec3 = [number, number, number] | [number, number];

export interface KinBody {
  id: string;
  role: (typeof KIN_VOCAB.bodyRole)[number];
  shape: { type: (typeof KIN_VOCAB.shape)[number]; op?: string; profile?: unknown; [k: string]: unknown };
  at?: { joint?: string; point?: string; frame?: { origin?: Vec3; rot?: Vec3 } };
  [k: string]: unknown;
}

export interface KinJoint {
  id: string;
  type: (typeof KIN_VOCAB.joint)[number];
  a: string;
  b: string;
  at?: Vec3 | string;
  axis?: Vec3;
  limits?: [number, number];
  flexible?: (typeof KIN_VOCAB.flexible)[number];
  [k: string]: unknown;
}

export interface KinParam {
  id: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  note?: string;
}

export interface KinDesign {
  id: string;
  options: (string | number)[];
  value: string | number;
}

export interface KinDriver {
  id: string;
  joint?: string;
  kind: (typeof KIN_VOCAB.driver)[number];
  range?: [number, number];
  default?: number | string;
  lo?: number;
  hi?: number;
  options?: Record<string, unknown>[] | string[];
  [k: string]: unknown;
}

export interface KinSolve {
  block: string;
  id: string;
  /** The joints this block solves (every joint that is not a driver's belongs to exactly one block). */
  joints?: string[];
  in: Record<string, unknown>;
  out: string | string[];
  branch?: string;
  opts?: Record<string, unknown>;
}

export interface KinPoint {
  id: string;
  body: string;
  local: Vec3;
}

export interface KinOutput {
  id: string;
  of: string;
  kind: (typeof KIN_VOCAB.output)[number];
  unit?: string;
}

export interface Kin {
  bodies: KinBody[];
  joints: KinJoint[];
  params: KinParam[];
  design: KinDesign[];
  drivers: KinDriver[];
  solve: KinSolve[];
  points: KinPoint[];
  outputs: KinOutput[];
  fallback: null | { numeric: true; loops: unknown[]; joints?: string[] };
}

export interface Teaching {
  review: { verdict: (typeof TEACHING_VOCAB.verdict)[number]; date: string; note: string };
  principle: { body?: string; point?: string }[];
  traces: { id: string; point: string; ticks?: { every: number }; ghosts?: { control: string; value: unknown }[]; comet?: boolean; /** Drawn in this body's frame (a cam's pitch curve turns with the cam). */ frame?: string }[];
  overlays: { id: string; kind: (typeof TEACHING_VOCAB.overlay)[number]; label?: string; [k: string]: unknown }[];
  view: string;
  views?: { id: string; kind: (typeof TEACHING_VOCAB.viewKind)[number]; highlight?: string[]; [k: string]: unknown }[];
  controls: { id: string; kind: (typeof TEACHING_VOCAB.control)[number]; [k: string]: unknown }[];
  timeMap?: { feature: string; slow: number; span: [number, number] };
  plot: { x: string; y: string; label: string } | { x: string; y: string; label: string }[];
  claims: { text: string; output: string; stat: (typeof TEACHING_VOCAB.stat)[number]; value: number; tol: number }[];
  exceptions: { reason: string; [k: string]: unknown }[];
}
