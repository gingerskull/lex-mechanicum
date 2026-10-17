// Gear meshing. Teeth are centred on local angle k·2π/z (as gearOutline draws them).
import { TAU } from "./geom";

/**
 * External pair: the angle gear 2 must have so a gap meets gear 1's tooth, given gear 1 at th1 and alpha the
 * direction from gear 1's centre to gear 2's. Rolling is built in, so this is the whole kinematics of the pair.
 */
export const mesh = (th1: number, z1: number, z2: number, alpha = 0): number =>
  alpha + Math.PI - (TAU / z2) * (0.5 - ((alpha - th1) * z1) / TAU);

/** Internal: the angle of a planet (zp) at direction alpha inside a ring gear (zr) at angle thR. */
export const meshIn = (thR: number, zr: number, zp: number, alpha: number): number => alpha - ((alpha - thR) * zr) / zp;
