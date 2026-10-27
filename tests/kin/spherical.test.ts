import { describe, expect, it } from "vitest";
import { D2R, hookeAngle, sphericalFourBar, sphericalLinkAngles, v3, wobbleSwing, wrapPi, type Vec3 } from "../../src/kin";

/** The output angle on the root that passes through the reference pose (ψ = 0 at θ = 0). */
function swingOf(a1: Vec3, a2: Vec3, a3: Vec3, a4: Vec3, th: number): { psi: number; a2: Vec3; a3: Vec3 } {
  const ref = sphericalFourBar(a1, a2, a3, a4, 0, 1);
  const side = Math.abs(ref.roots[0]) <= Math.abs(ref.roots[1]) ? 1 : -1;
  return sphericalFourBar(a1, a2, a3, a4, th, side);
}

describe("spherical four-bar", () => {
  it("gives the wobble drive's swing, amplitude exactly the journal angle", () => {
    for (const alpha of [5, 15, 25].map((d) => d * D2R)) {
      const a1: Vec3 = [1, 0, 0];
      const a2: Vec3 = [Math.cos(alpha), Math.sin(alpha), 0];
      const a3: Vec3 = [0, 0, 1];
      const a4: Vec3 = [0, 1, 0];
      const links = sphericalLinkAngles(a1, a2, a3, a4);
      expect(links[0]).toBeCloseTo(alpha, 12);
      for (const l of links.slice(1)) expect(l).toBeCloseTo(Math.PI / 2, 12);
      let peak = 0;
      for (let d = 0; d < 360; d += 3) {
        const th = d * D2R;
        const s = swingOf(a1, a2, a3, a4, th);
        // the loop closes: the coupler keeps its 90 degree link angle
        expect(Math.abs(v3.dot(s.a2, s.a3))).toBeLessThan(1e-12);
        // psi = atan(tan(alpha) sin(theta)) from the mid-swing pose (the output turns about -y for +theta about +x)
        expect(Math.abs(-s.psi - wobbleSwing(alpha, th - Math.PI / 2))).toBeLessThan(1e-12);
        peak = Math.max(peak, Math.abs(s.psi));
      }
      expect(peak).toBeCloseTo(alpha, 12);
    }
  });

  it("is the Hooke joint when the input, coupler and output links are all 90 degrees", () => {
    const beta = 30 * D2R;
    const a1: Vec3 = [1, 0, 0];
    const a4: Vec3 = [Math.cos(beta), Math.sin(beta), 0];
    const a2: Vec3 = [0, 0, 1];
    const a3 = v3.unit(v3.cross(a2, a4));
    for (let d = 0; d < 360; d += 10) {
      const th = d * D2R;
      const s = swingOf(a1, a2, a3, a4, th);
      const ref = hookeAngle(Math.PI / 2 + th, beta) - hookeAngle(Math.PI / 2, beta);
      expect(Math.abs(wrapPi(s.psi - ref))).toBeLessThan(1e-9);
    }
  });
});
