// The pillow block's sizes (J10): a bearing block for a shaft in plan, a cast-iron housing on the shaft's axis, straight
// sides up from its foot to a round boss over the bearing, standing on a foot plate that lies on the base. The builder's
// support router (src/builder/supports.ts) makes the block from these.
import { housingBearing } from "./housing";

/** The foot plate's thickness, mm. */
export const FOOT = 8;

/** The boss radius of a block for a shaft of Ø d: the housing's half-width across the shaft. */
export const bossR = (d: number, live: boolean): number => (live ? housingBearing(d).D / 2 + 5 : d / 2 + 6);

/** The foot plate's half-width across the shaft, and how far it stands past the block along it, mm. */
export const footHalf = (d: number, live: boolean): number => bossR(d, live) + 9;
export const FOOT_PAST = 2;

/**
 * How far a shaft in plan's centre must stand over the base top for its blocks: the foot, and the boss's lower part
 * (the base growth rule of J10: the base drops under a shaft in plan until its blocks fit).
 */
export const pillowRise = (d: number): number => FOOT + 0.4 * bossR(d, true) + 1;

/** The width of a block along the shaft, mm. */
export const pillowWidth = (d: number, live: boolean): number => (live ? housingBearing(d).B + 6 : 12);
