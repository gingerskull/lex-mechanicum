// Sizes the builder shares. The slab pitch is the plate thickness plus the gap an inner-race spacer or a thrust washer
// leaves between two plates on one axis; the hand-set layers of the first builds were measured in the same values.
/** Plate thickness, mm. */
export const THICK = 6;
/** Distance from one slab of a stack to the next, mm. */
export const PITCH = 10;
/** The gap between two slabs, mm. */
export const SLAB_GAP = PITCH - THICK;
/** Clearance a support keeps from every moving part's swept volume (A14), mm. */
export const MIN_GAP = 1.5;
/** Number of phases the sweeps and the placement solver sample over the cycle. */
export const SAMPLES = 72;
/** Samples when the poses come from the numeric solver, which continues from the last pose in steps of 3 degrees. */
export const SAMPLES_NUMERIC = 125;
/** Margin left to a neighbour on one slab (lateral clearance of bodies sharing a plane), mm. */
export const LATERAL = 1.2;
/** Base plate thickness (A7) and the gap under the lowest part. */
export const BASE_T = 8;
export const BASE_GAP = 2;
/** Wall of the drive bracket and of a lever that carries a stop, mm (M6 allows no feature under 1.5 mm). */
export const LEVER_WALL = 3;
/** Gap above a stack where a plate passes right over its bolt: the head and its clearance (A13), mm. */
export const HEADROOM = 8;
/** The most a point of a moving part may travel between two poses whose hull stands for the sweep, mm. */
export const SWEEP_STEP = 3;
/** Gap under a moving pin's first part where a plate passes right under it: the bolt's thread end, mm. */
export const THREAD_ROOM = 9;
/** Gap above a slider on the ground: its rails stand 1.5 mm proud, the keeper 3 mm more, then the least gap (J5), mm. */
export const SLIDE_ROOM = 1.5 + 3 + MIN_GAP + 1;
/** How far a ground slider's rails, gib and end stops reach past its swept outline (J5), along the slide and across, mm. */
export const RAIL_ZONE = { along: 24, across: 12 };
