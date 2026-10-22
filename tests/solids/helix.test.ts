import { describe, expect, it } from "vitest";
import { helixSweep } from "../../src/solids/helix";
import { tessellate } from "../../src/solids/tessellate";

/** Each vertex's radius and its axial offset from the helix at its own angle, unwrapped by the turn it lies on. */
function check(hand: "right" | "left") {
  const lead = 3;
  const r = 4.25;
  const pts: [number, number][] = [[-0.2, -1.02], [1.75, -0.55], [1.75, 0.55], [-0.2, 1.02]];
  const { profile, op } = helixSweep({ r, lead, z0: 0, z1: 30, hand }, pts);
  const m = tessellate(profile, op);
  let worstR = 0;
  let worstV = 0;
  const s = hand === "left" ? -1 : 1;
  for (let i = 0; i < m.pos.length; i += 3) {
    const x = m.pos[i]!, y = m.pos[i + 1]!, z = m.pos[i + 2]!;
    const rad = Math.hypot(x, y) - r;
    // the helix's z at this angle, the nearest turn
    const a = Math.atan2(y, x);
    const base = (s * a * lead) / (2 * Math.PI);
    const k = Math.round((z - base) / lead);
    const v = z - base - k * lead;
    // the profile point it came from has u = rad and |v| within the half width at that u
    const half = 1.02 - ((rad + 0.2) / 1.95) * (1.02 - 0.55);
    worstR = Math.max(worstR, rad < -0.2 - 0.02 || rad > 1.75 + 0.02 ? 1 : 0);
    worstV = Math.max(worstV, Math.abs(v) - half);
  }
  return { worstR, worstV, tri: m.tri.length / 3 };
}

describe("helixSweep", () => {
  it("keeps a thread's axial profile true at every turn, either hand", () => {
    for (const hand of ["right", "left"] as const) {
      const c = check(hand);
      expect(c.worstR).toBe(0);
      expect(c.worstV).toBeLessThan(0.02);
      expect(c.tri).toBeGreaterThan(1000);
    }
  });
});
