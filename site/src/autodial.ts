// The stage's Auto dial (standard DL4): one rung at a time, with hysteresis. A frame's cost is the longer of the draw
// call (CPU) and the GPU's own time for a frame (a timer query; where the browser has none, how long the GPU was still
// busy with the previous frame when this one started, from a fence). Neither the display's refresh rate nor the page's
// scrolling counts against the drawing. The dial steps down only when most frames of the last stretch were over budget,
// so a one-off long frame (a shader compile, a garbage collection, a busy tab) never moves it; it steps back up after a
// shorter run of fast frames, and each step back down doubles that run, so it settles instead of hunting.

export const AUTO = {
  budgetMs: 14, // a frame that costs more is slow
  fastMs: 7, // a frame that costs less is fast
  window: 120, // frames a step down looks back over (2 s at 60 Hz)
  slowShare: 0.75, // share of slow frames in the window that steps one rung down
  upRun: 90, // fast frames in a row that step one rung up (1.5 s at 60 Hz)
  upRunMax: 1440, // the longest that run grows to after steps back down
  settle: 30, // frames not counted after the page starts drawing or the rung moves
  desktopFloor: "B", // the coarsest rung Auto reaches on a desktop-class device (autoLast)
};

export interface AutoState {
  rung: number;
  /** Ring buffer of the last `AUTO.window` frames: 1 for a slow one. */
  marks: Uint8Array;
  at: number;
  /** Frames in the buffer, and how many of them were slow. */
  seen: number;
  slowIn: number;
  /** Fast frames in a row, and how many it takes to step up now. */
  fast: number;
  need: number;
  /** Frames still to skip before counting. */
  skip: number;
  /** The median cost of the window when the dial last stepped down, ms, for the readout. */
  why: number | null;
}

export const autoState = (rung = 0): AutoState => ({ rung, marks: new Uint8Array(AUTO.window), at: 0, seen: 0, slowIn: 0, fast: 0, need: AUTO.upRun, skip: AUTO.settle, why: null });

const costs = new Float64Array(AUTO.window);

/** Starts counting afresh after `AUTO.settle` frames: on the first frames of a page, and after the rung moved. */
export function autoSettle(s: AutoState): void {
  s.marks.fill(0);
  s.at = 0;
  s.seen = 0;
  s.slowIn = 0;
  s.fast = 0;
  s.skip = AUTO.settle;
}

/**
 * Counts one frame and moves the rung, never past `last` (the coarsest Auto may reach on this device). `gpuMs` is the
 * timer's measure where there is one, else the fence's lag. Returns true when the rung moved.
 */
export function autoStep(s: AutoState, cpuMs: number, gpuMs: number, last: number): boolean {
  if (s.skip > 0) {
    s.skip--;
    return false;
  }
  const cost = Math.max(cpuMs, gpuMs);
  const slow = cost > AUTO.budgetMs ? 1 : 0;
  s.slowIn += slow - s.marks[s.at]!;
  s.marks[s.at] = slow;
  costs[s.at] = cost;
  s.at = (s.at + 1) % AUTO.window;
  s.seen = Math.min(AUTO.window, s.seen + 1);
  s.fast = cost < AUTO.fastMs ? s.fast + 1 : 0;
  if (s.seen === AUTO.window && s.slowIn >= AUTO.slowShare * AUTO.window && s.rung < last) {
    s.why = [...costs].sort((a, b) => a - b)[AUTO.window >> 1]!;
    s.rung++;
    // a rung that had to be left again is trusted less: the next step up waits twice as long
    s.need = Math.min(AUTO.upRunMax, s.need * 2);
    autoSettle(s);
    return true;
  }
  if (s.fast >= s.need && s.rung > 0) {
    s.rung--;
    if (s.rung === 0) s.why = null;
    autoSettle(s);
    return true;
  }
  return false;
}

/**
 * The coarsest rung Auto may reach (an index into the stage's ladder, `last` its end). A desktop-class device (a fine
 * pointer, no touch, eight or more cores) keeps everything up to and including `desktopFloor`'s rung: there a slow frame
 * comes from a large canvas or a busy machine, and dropping the look would mislead more than it saves.
 */
export function autoLast(ladder: readonly string[], desktop: boolean, desktopFloor: string): number {
  const last = ladder.length - 1;
  if (!desktop) return last;
  const i = ladder.indexOf(desktopFloor);
  return i < 0 ? last : Math.min(last, i);
}

/** A device the dial treats as desktop-class. */
export const isDesktop = (w: { matchMedia(q: string): { matches: boolean }; navigator: { hardwareConcurrency?: number; maxTouchPoints?: number } }): boolean =>
  w.matchMedia("(pointer: fine)").matches && !w.matchMedia("(any-pointer: coarse)").matches && (w.navigator.maxTouchPoints ?? 0) === 0 && (w.navigator.hardwareConcurrency ?? 0) >= 8;
