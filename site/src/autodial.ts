// The stage's Auto dial (standard DL4): one rung at a time, with hysteresis. A frame's cost is the longer of the draw
// call (CPU) and how long the GPU was still busy with the previous frame when this one started (a fence, so neither the
// display's refresh rate nor the page's scrolling counts against the drawing).

/** Step down after this many slow frames, back up after this many fast ones. */
export const AUTO = { slowMs: 14, fastMs: 7, slowN: 30, fastN: 180 };

export interface AutoState {
  rung: number;
  slow: number;
  fast: number;
}

/** Counts one frame and moves the rung (0 = full, `last` = the coarsest Auto may reach). Returns true when it moved. */
export function autoStep(s: AutoState, ms: number, gpuLagMs: number, last: number): boolean {
  const cost = Math.max(ms, gpuLagMs);
  if (cost > AUTO.slowMs) {
    s.fast = 0;
    if (++s.slow >= AUTO.slowN && s.rung < last) {
      s.rung++;
      s.slow = 0;
      return true;
    }
  } else if (cost < AUTO.fastMs) {
    s.slow = 0;
    if (++s.fast >= AUTO.fastN && s.rung > 0) {
      s.rung--;
      s.fast = 0;
      return true;
    }
  }
  return false;
}
