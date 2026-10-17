// Catalogue hardware as data: the only sizes a build may use (standard R2). Sizes in mm.

/** Deep-groove ball bearings, miniature and thin-section series. */
export interface Bearing {
  name: string;
  d: number;
  D: number;
  B: number;
}

export const BEARINGS: readonly Bearing[] = (
  [
    ["683", 3, 7, 3], ["693", 3, 8, 4], ["623", 3, 10, 4], ["684", 4, 9, 4], ["694", 4, 11, 4], ["624", 4, 13, 5],
    ["685", 5, 11, 5], ["695", 5, 13, 4], ["625", 5, 16, 5], ["686", 6, 13, 5], ["696", 6, 15, 5], ["626", 6, 19, 6],
    ["688", 8, 16, 5], ["698", 8, 19, 6], ["608", 8, 22, 7], ["6800", 10, 19, 5], ["6900", 10, 22, 6],
    ["6000", 10, 26, 8], ["6801", 12, 21, 5], ["6901", 12, 24, 6], ["6802", 15, 24, 5], ["6803", 17, 26, 5],
    ["6804", 20, 32, 7],
  ] as const
).map(([name, d, D, B]) => ({ name, d, D, B }));

/** Bore sizes with a catalogue bearing, largest first. */
export const BORES: readonly number[] = [...new Set(BEARINGS.map((b) => b.d))].sort((a, b) => b - a);

/** Wall left round a bearing seat in its boss (standard A3). */
export const BEARING_WALL = 1.2;
/** Axial room a bearing seat needs for one internal circlip and its groove. */
export const CIRCLIP_ROOM = 1.0;

/**
 * The largest bearing of bore d that fits a boss of radius R with a 1.2 mm wall in a plate t thick. A bearing that
 * leaves room for a circlip (B ≤ t − 1) is preferred over a wider one, so the outer race can be retained (F2).
 */
export function bearingFor(d: number, R: number, t = 6): Bearing | null {
  const fit = BEARINGS.filter((b) => b.d === d && b.D / 2 + BEARING_WALL <= R && b.B <= t);
  const roomy = fit.filter((b) => b.B <= t - CIRCLIP_ROOM);
  const pick = (l: Bearing[]) => [...l].sort((a, b) => b.D - a.D)[0] ?? null;
  return pick(roomy) ?? pick(fit);
}

/** Flanged versions (F-series): flange Ø and width, by bearing designation. */
export const FLANGE = (b: Bearing): { D: number; w: number } => ({ D: b.D + Math.max(1.5, b.D * 0.12), w: b.B >= 6 ? 1.5 : 1.1 });

/** Metric screw sizes in use (R2). */
export const SCREW_SIZES = [2, 2.5, 3, 4, 5, 6, 8] as const;
export type ScrewSize = (typeof SCREW_SIZES)[number] | 10 | 12;

export type HeadKind = "socket" | "button" | "csk";

interface HeadSize {
  dk: number; // head Ø
  k: number; // head height
  s: number; // hex key across flats
}

/** Head sizes: ISO 4762 socket cap, ISO 7380 button (DIN 912/7380 proportions below M3), ISO 10642 countersunk. */
export const HEADS: Record<HeadKind, Record<number, HeadSize>> = {
  socket: {
    2: { dk: 3.8, k: 2, s: 1.5 }, 2.5: { dk: 4.5, k: 2.5, s: 2 }, 3: { dk: 5.5, k: 3, s: 2.5 }, 4: { dk: 7, k: 4, s: 3 },
    5: { dk: 8.5, k: 5, s: 4 }, 6: { dk: 10, k: 6, s: 5 }, 8: { dk: 13, k: 8, s: 6 }, 10: { dk: 16, k: 10, s: 8 },
  },
  button: {
    2: { dk: 3.5, k: 1.3, s: 1.3 }, 2.5: { dk: 4.7, k: 1.5, s: 1.5 }, 3: { dk: 5.7, k: 1.65, s: 2 },
    4: { dk: 7.6, k: 2.2, s: 2.5 }, 5: { dk: 9.5, k: 2.75, s: 3 }, 6: { dk: 10.5, k: 3.3, s: 4 }, 8: { dk: 14, k: 4.4, s: 5 },
  },
  csk: {
    2: { dk: 3.8, k: 1.2, s: 1.3 }, 2.5: { dk: 4.7, k: 1.5, s: 1.5 }, 3: { dk: 6.72, k: 1.86, s: 2 },
    4: { dk: 8.96, k: 2.48, s: 2.5 }, 5: { dk: 11.2, k: 3.1, s: 3 }, 6: { dk: 13.44, k: 3.72, s: 4 }, 8: { dk: 17.92, k: 4.96, s: 5 },
  },
};

export const SCREW_STANDARD: Record<HeadKind, string> = { socket: "ISO 4762", button: "ISO 7380", csk: "ISO 10642" };

/** Standard screw lengths (R2, M9). */
export const SCREW_LENGTHS = [3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80] as const;

/** The shortest standard length at least L. */
export const standardLength = (L: number): number => SCREW_LENGTHS.find((l) => l >= L - 1e-6) ?? Math.ceil(L / 10) * 10;

/** Hex nuts, ISO 4032 widths across flats; nyloc DIN 985 heights. */
export const NUTS: Record<number, { s: number; m: number }> = {
  2: { s: 4, m: 2.8 }, 2.5: { s: 5, m: 3 }, 3: { s: 5.5, m: 4 }, 4: { s: 7, m: 5 }, 5: { s: 8, m: 5 }, 6: { s: 10, m: 6 },
  8: { s: 13, m: 8 }, 10: { s: 16, m: 10 },
};

/** Plain washers ISO 7089: outside Ø and thickness. */
export const WASHERS: Record<number, { D: number; h: number }> = {
  2: { D: 5, h: 0.3 }, 2.5: { D: 6, h: 0.5 }, 3: { D: 7, h: 0.5 }, 4: { D: 9, h: 0.8 }, 5: { D: 10, h: 1 }, 6: { D: 12, h: 1.6 },
  8: { D: 16, h: 1.6 }, 10: { D: 20, h: 2 },
};

/** Shoulder bolts ISO 7379 by shoulder Ø: thread, head Ø, head height, key. Below Ø6 the proportions are carried down. */
export const SHOULDER_BOLTS: Record<number, { M: number; dk: number; k: number; s: number }> = {
  3: { M: 2.5, dk: 5.5, k: 2.5, s: 2 }, 4: { M: 3, dk: 7, k: 3, s: 2.5 }, 5: { M: 4, dk: 8.5, k: 3.5, s: 3 },
  6: { M: 5, dk: 10, k: 4.5, s: 3 }, 8: { M: 6, dk: 13, k: 5.5, s: 4 }, 10: { M: 8, dk: 16, k: 7, s: 5 },
  12: { M: 10, dk: 18, k: 8, s: 6 }, 15: { M: 12, dk: 22, k: 10, s: 8 }, 17: { M: 12, dk: 24, k: 10, s: 8 },
  20: { M: 16, dk: 28, k: 12, s: 10 },
};

/** Thread for a shaft or axle end of Ø d. */
/** ISO 7379 shoulder lengths, mm. */
export const SHOULDER_LENGTHS = [4, 5, 6, 8, 10, 12, 16, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100] as const;

/** The shortest ISO 7379 shoulder length at least L. */
export const shoulderLength = (L: number): number => SHOULDER_LENGTHS.find((l) => l >= L - 0.05) ?? Math.ceil(L / 10) * 10;

export const threadFor = (d: number): number => SHOULDER_BOLTS[d]?.M ?? Math.max(2, Math.floor(d * 0.8));

export const headD = (d: number): number => SHOULDER_BOLTS[d]?.dk ?? Math.round(d * 1.66 + 0.4);
export const headH = (d: number): number => SHOULDER_BOLTS[d]?.k ?? Math.max(3, Math.round(d * 0.62 * 2) / 2);
export const socket = (d: number): number => SHOULDER_BOLTS[d]?.s ?? Math.max(2, Math.round(d * 0.5 * 2) / 2);

/** Thread engagement a fastener needs in a material (M9): 1.5 d in aluminium, 1 d in steel. */
export const engagement = (M: number, mat: "aluminium" | "steel"): number => (mat === "aluminium" ? 1.5 : 1) * M;

/** External circlips DIN 471 by shaft Ø: groove Ø, thickness, radial lug width. */
export const CIRCLIPS_EXT: Record<number, { d2: number; s: number; b: number }> = {
  3: { d2: 2.8, s: 0.4, b: 0.9 }, 4: { d2: 3.8, s: 0.4, b: 1 }, 5: { d2: 4.8, s: 0.6, b: 1.1 }, 6: { d2: 5.7, s: 0.7, b: 1.3 },
  8: { d2: 7.6, s: 0.8, b: 1.5 }, 10: { d2: 9.6, s: 1, b: 1.8 }, 12: { d2: 11.5, s: 1, b: 2.1 }, 15: { d2: 14.3, s: 1, b: 2.2 },
  17: { d2: 16.2, s: 1, b: 2.3 }, 20: { d2: 19, s: 1.2, b: 2.6 },
};

/** Internal circlips DIN 472 by bore Ø: groove Ø, thickness, radial lug width. */
export const CIRCLIPS_INT: Record<number, { d2: number; s: number; b: number }> = {
  7: { d2: 7.4, s: 0.6, b: 0.9 }, 8: { d2: 8.4, s: 0.8, b: 1 }, 9: { d2: 9.4, s: 0.8, b: 1.1 }, 10: { d2: 10.4, s: 1, b: 1.2 },
  11: { d2: 11.4, s: 1, b: 1.3 }, 13: { d2: 13.6, s: 1, b: 1.5 }, 15: { d2: 15.7, s: 1, b: 1.6 }, 16: { d2: 16.8, s: 1, b: 1.7 },
  19: { d2: 20, s: 1, b: 2 }, 21: { d2: 22, s: 1, b: 2.1 }, 22: { d2: 23, s: 1, b: 2.2 }, 24: { d2: 25.2, s: 1.2, b: 2.3 },
  26: { d2: 27.2, s: 1.2, b: 2.4 }, 32: { d2: 33.7, s: 1.2, b: 2.8 },
};

const nearest = <T>(table: Record<number, T>, d: number): T => {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  return table[keys.find((k) => k >= d - 1e-6) ?? keys[keys.length - 1]!]!;
};
export const circlipExt = (d: number) => nearest(CIRCLIPS_EXT, d);
export const circlipInt = (D: number) => nearest(CIRCLIPS_INT, D);

/** Torque transmission by shaft size (A5): D-flat up to Ø8, DIN 6885 feather key above. */
export const KEYS: readonly { over: number; upTo: number; b: number; h: number; t1: number }[] = [
  { over: 8, upTo: 10, b: 3, h: 3, t1: 1.8 },
  { over: 10, upTo: 12, b: 4, h: 4, t1: 2.5 },
  { over: 12, upTo: 17, b: 5, h: 5, t1: 3 },
  { over: 17, upTo: 22, b: 6, h: 6, t1: 3.5 },
];
export const keyFor = (d: number) => (d <= 8 ? null : (KEYS.find((k) => d > k.over && d <= k.upTo) ?? KEYS[KEYS.length - 1]!));

/** Shaft Ø series (R2). */
export const SHAFTS = [6, 8, 10, 12] as const;

/** GT2 timing pulleys: teeth, pitch Ø, outside Ø, flange Ø. Belt 6 mm wide, 1.38 thick. */
export const PULLEYS: Record<16 | 32, { T: number; pd: number; od: number; fd: number }> = {
  16: { T: 16, pd: 10.19, od: 9.68, fd: 14 },
  32: { T: 32, pd: 20.37, od: 19.86, fd: 24 },
};
export const BELT = { width: 6, thick: 1.38 };

/** Compression springs: wire Ø, outside Ø, free length, rate N/mm. */
export const SPRINGS: readonly { wire: number; D: number; L0: number; rate: number }[] = [
  { wire: 0.6, D: 5, L0: 12, rate: 1.2 },
  { wire: 0.8, D: 6, L0: 16, rate: 2.1 },
  { wire: 0.8, D: 8, L0: 20, rate: 1.1 },
  { wire: 1, D: 10, L0: 25, rate: 1.6 },
];

/** Grease nipple DIN 71412 type A, M6: hex across flats, overall height, head Ø. */
export const NIPPLES = { M: 6, s: 7, h: 9, head: 5.5 };

/** Fork (slot) sensor for the home flag (V6): body, slot width and depth. */
export const SENSOR = { w: 12, l: 25, h: 10, slot: 5, depth: 8, vane: 1 };

/** Standoffs: Ø10 hex-free round, with an Ø6 h7 spigot when the plate holds a bearing (A6). */
export const STANDOFF = { D: 10, M: 5, spigotD: 6, spigotH: 3 };

/** Dowel pins ISO 8734, h6. */
export const DOWELS = [3, 4] as const;

/** Brushless pancake outrunner (V1) and the brushed alternative. */
export const MOTORS = {
  pancake: { name: "Brushless pancake motor Ø50 x 18, 24 V", R: 25, H: 18, shaft: 4 },
  brushed: { name: "DC motor Ø36 x 57, 12 V", R: 18, H: 57, shaft: 4 },
} as const;
