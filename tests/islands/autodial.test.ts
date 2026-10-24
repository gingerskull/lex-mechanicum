import { describe, expect, it } from "vitest";
import { AUTO, autoLast, autoSettle, autoState, autoStep, isDesktop, type AutoState } from "../../site/src/autodial";

const LADDER = ["full", "A", "B", "C", "D", "E", "F", "G"];
const LAST = LADDER.length - 1;

/** Feeds frames of [cpu ms, gpu ms] and returns the rungs after each. */
const play = (s: AutoState, frames: [number, number][], last = LAST) => frames.map(([c, g]) => (autoStep(s, c, g, last), s.rung));
const times = (n: number, f: [number, number]): [number, number][] => Array.from({ length: n }, () => f);

/**
 * A fast desktop through orbit, scrub and explode: a shader compile and the first upload at the start, a garbage
 * collection or a busy tab now and then, and a stretch of heavier frames while exploding, 20 s at 60 Hz. Frame times in
 * the shape the stage measured on a desktop GPU, with the spikes made worse than seen.
 */
function desktopTrace(): [number, number][] {
  const out: [number, number][] = [[180, 40], [60, 25], [35, 12]];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 1200; i++) {
    let cpu = 2.5 + rnd() * 2.5;
    let gpu = 1.5 + rnd() * 2;
    if (i % 97 === 0) cpu = 40 + rnd() * 30; // a garbage collection
    if (i % 31 === 0) gpu += 13; // the compositor or another tab on the GPU
    if (i > 600 && i < 760) {
      cpu += 6; // exploding: trails and the moving solids
      gpu += 6 * rnd();
    }
    out.push([cpu, gpu]);
  }
  return out;
}

describe("the Auto dial", () => {
  it("holds full detail through a fast desktop's trace, spikes and all", () => {
    const rungs = play(autoState(), desktopTrace());
    expect(Math.max(...rungs)).toBe(0);
  });

  it("never steps down on a one-off long frame, nor on a burst shorter than most of the window", () => {
    const s = autoState();
    play(s, times(AUTO.settle + AUTO.window, [3, 2]));
    play(s, times(Math.floor(AUTO.slowShare * AUTO.window) - 1, [30, 30]));
    expect(s.rung).toBe(0);
  });

  it("steps down one rung when most frames of the window are slow, and counts afresh after it", () => {
    const s = autoState();
    const rungs = play(s, times(AUTO.settle + AUTO.window, [25, 25]));
    expect(rungs.at(-1)).toBe(1);
    expect(s.why).toBe(25);
    // the next window starts after the settle frames: no second step in the same stretch
    expect(play(s, times(AUTO.settle + AUTO.window - 1, [25, 25])).at(-1)).toBe(1);
    expect(play(s, times(1, [25, 25])).at(-1)).toBe(2);
  });

  it("counts the GPU's time as well as the draw call's", () => {
    const s = autoState();
    expect(play(s, times(AUTO.settle + AUTO.window, [2, 20])).at(-1)).toBe(1);
  });

  it("steps back up after a run of fast frames, and waits twice as long each time it had to step back down", () => {
    const s = autoState();
    play(s, times(AUTO.settle + AUTO.window, [25, 25]));
    expect(s.rung).toBe(1);
    const need = s.need;
    expect(need).toBe(AUTO.upRun * 2);
    expect(play(s, times(AUTO.settle + need, [3, 2])).at(-1)).toBe(0);
    play(s, times(AUTO.settle + AUTO.window, [25, 25]));
    expect(s.need).toBe(need * 2);
    expect(play(s, times(AUTO.settle + need, [3, 2])).at(-1)).toBe(1);
  });

  it("degrades a phone that cannot keep up, one rung at a time, down to the last rung it may reach", () => {
    const s = autoState();
    const rungs = play(s, times(20 * (AUTO.settle + AUTO.window), [9, 26]));
    for (let i = 1; i < rungs.length; i++) expect(rungs[i]! - rungs[i - 1]!).toBeLessThanOrEqual(1);
    expect(rungs.at(-1)).toBe(LAST);
  });

  it("skips the first frames after it is told to settle", () => {
    const s = autoState();
    play(s, times(AUTO.settle + AUTO.window - 1, [25, 25]));
    autoSettle(s);
    expect(play(s, times(AUTO.settle + AUTO.window - 1, [25, 25])).at(-1)).toBe(0);
  });

  it("keeps a desktop's look: Auto reaches no further than the desktop floor there", () => {
    const floor = autoLast(LADDER, true, AUTO.desktopFloor);
    expect(LADDER[floor]).toBe(AUTO.desktopFloor);
    expect(autoLast(LADDER, false, AUTO.desktopFloor)).toBe(LAST);
    const s = autoState();
    play(s, times(20 * (AUTO.settle + AUTO.window), [30, 30]), floor);
    expect(s.rung).toBe(floor);
  });

  it("calls a fine pointer with eight cores and no touch a desktop, and a phone not", () => {
    const w = (fine: boolean, coarse: boolean, cores: number, touch: number) => ({
      matchMedia: (q: string) => ({ matches: q === "(pointer: fine)" ? fine : q === "(any-pointer: coarse)" ? coarse : false }),
      navigator: { hardwareConcurrency: cores, maxTouchPoints: touch },
    });
    expect(isDesktop(w(true, false, 16, 0))).toBe(true);
    expect(isDesktop(w(false, true, 6, 5))).toBe(false);
    expect(isDesktop(w(true, false, 4, 0))).toBe(false);
    expect(isDesktop(w(true, true, 8, 10))).toBe(false);
  });
});
