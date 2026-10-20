// Fixture scenes for the drawing tools: a model and a polish built like a mechanism, drawn by tools/shot and the bench
// through tools/chrome.ts (ids start with "fx-"), never registered on the site.
import type { Polish } from "../../src/assemble/api";
import { arcPts, circle, roundRect, type Vec2 } from "../../src/core/geom";
import { defineMechanism } from "../../src/model/define";
import type { MechanismModel } from "../../src/model/types";
import { P } from "../../src/parts";

export interface Scene {
  model: MechanismModel;
  polish: Polish;
}

/** Shaft centre height above the plan origin and its radius, mm. */
const SZ = 36;
const SR = 6;

/**
 * Axes across the plan (#165): a shaft in plan along y (or x) in two pillow blocks above the base, a wheel on the shaft
 * standing normal to it, and a z gear behind them whose plan overlaps the wheel and the shaft's far end, so every tilt
 * sets z solids and solids on the shaft's axis in front of and behind each other.
 */
function shaftInPlan(axis: "x" | "y"): Scene {
  // the y scene's plan points, swapped for the x scene
  const at = ([a, b]: Vec2): Vec2 => (axis === "x" ? [b, a] : [a, b]);
  const G = at([26, 78]);
  return {
    model: defineMechanism({
      id: axis === "y" ? "fx-shaft-in-plan" : "fx-shaft-in-plan-x",
      input: { kind: "rotary", part: "gear" },
      parts: [
        P.gear("gear", 24, 2, { at: "G", spin: (s) => s.a as number }),
        P.cap("pG", -1, 7, { fixed: [G[0], G[1], 0], accent: true }),
        P.disc("shaft", SR, { axis, along: -58, thick: 116, layer: 3, at: "S", spin: (s) => -(s.a as number), role: "output", marks: [] }),
        P.disc("wheel", 24, { axis, along: -4, thick: 8, layer: 3, at: "S", spin: (s) => -(s.a as number), role: "output", holes: [circle(SR + 0.05, 0, 0, 48)] }),
      ],
      solve: (u) => ({ pts: { G, S: [0, SZ] }, a: u }),
    }),
    polish(A, H) {
      const top = A.b1 + 8;
      const ex = A.solidOf.shaft!.ex;
      for (const [k, y0] of [["a", -46], ["b", 34]] as const) {
        const y1 = y0 + 12;
        const [p0, p1] = [at([-26, y0]), at([26, y1])];
        // the foot is a plate on the base (screwed through it), the housing a solid along the shaft's axis on the foot
        A.add(H.plate(`block-${k}-foot`, roundRect(p0[0], p0[1], p1[0], p1[1], 3), { kind: "housing", role: "ground", name: k === "a" ? "Pillow block foot" : "", z0: A.b1, z1: top, ex, mat: "Cast iron" }));
        // the housing in the shaft's plane: straight sides up from the foot to a half-round boss over the shaft
        const body: Vec2[] = [[-16, top], [16, top], ...arcPts(0, SZ, 16, 0, Math.PI, Math.PI / 32)];
        A.add(H.plate(`block-${k}`, body, { kind: "housing", role: "ground", axis, name: k === "a" ? "Pillow block, bored for the shaft" : "", holes: [circle(SR + 0.1, 0, SZ, 48)], z0: y0, z1: y1, ex, mat: "Cast iron" }));
        for (const x of [-20, 20]) {
          const q = at([x, (y0 + y1) / 2]);
          A.add(H.screw(`block-${k}-sc${x > 0 ? 1 : 0}`, "socket", 5, 12, { at: [q[0], q[1], 0], face: top, dir: -1, ex: ex + 1 }));
        }
      }
    },
  };
}

export const scenes: Record<string, Scene> = Object.fromEntries([shaftInPlan("y"), shaftInPlan("x")].map((s) => [s.model.id, s]));
