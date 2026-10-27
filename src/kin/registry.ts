// The block registry: each `solve` step names one of these. A block reads named inputs through the context, calls the
// closed forms in ./blocks, and writes points, values and body poses. The blocks of each family are in a file of
// their own under ./steps (the couplings in ./blocks/couplings), the exact `in` fields of each block listed above
// it; a family adds its blocks here with one line.
import type { BlockFn } from "./ctx";
import { LINKAGE_BLOCKS } from "./steps/linkage";
import { SPATIAL_BLOCKS } from "./steps/spatial";
import { SPHERICAL_BLOCKS } from "./steps/spherical";
import { GEAR_BLOCKS } from "./steps/gears";
import { CAM_BLOCKS } from "./steps/cam";
import { MEMBER_BLOCKS } from "./steps/members";
import { TIMED_BLOCKS } from "./steps/timed";
import { COUPLING_BLOCKS } from "./blocks/couplings";

export { gearDelta } from "./steps/gears";
export { roundedSquareAt } from "./steps/linkage";

export const BLOCKS: Record<string, BlockFn> = {
  ...LINKAGE_BLOCKS,
  ...SPATIAL_BLOCKS,
  ...SPHERICAL_BLOCKS,
  ...GEAR_BLOCKS,
  ...CAM_BLOCKS,
  ...MEMBER_BLOCKS,
  ...TIMED_BLOCKS,
  ...COUPLING_BLOCKS,
};
