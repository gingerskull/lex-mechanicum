import { describe, expect, it } from "vitest";
import { AUTO, autoStep, type AutoState } from "../../site/src/autodial";

const run = (s: AutoState, n: number, ms: number, lag = 0) => {
  for (let i = 0; i < n; i++) autoStep(s, ms, lag, 7);
  return s.rung;
};

describe("the Auto dial", () => {
  it("steps down one rung after a run of slow frames, and back up after a long run of fast ones", () => {
    const s: AutoState = { rung: 0, slow: 0, fast: 0 };
    expect(run(s, AUTO.slowN - 1, 20)).toBe(0);
    expect(run(s, 1, 20)).toBe(1);
    expect(run(s, AUTO.fastN, 2)).toBe(0);
  });

  it("counts a GPU still busy with the last frame as slow, though the draw call was quick", () => {
    expect(run({ rung: 0, slow: 0, fast: 0 }, AUTO.slowN, 2, 25)).toBe(1);
  });

  it("holds between the thresholds, and a fast frame ends a run of slow ones", () => {
    const s: AutoState = { rung: 2, slow: 0, fast: 0 };
    expect(run(s, 500, 10)).toBe(2);
    run(s, AUTO.slowN - 1, 20);
    run(s, 1, 2);
    expect(run(s, AUTO.slowN - 1, 20)).toBe(2);
  });

  it("never passes the last rung Auto may reach", () => {
    expect(run({ rung: 7, slow: 0, fast: 0 }, 10 * AUTO.slowN, 50)).toBe(7);
  });
});
