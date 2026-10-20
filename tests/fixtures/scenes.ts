// Fixture scenes for the drawing tools: a model and a polish built like a mechanism, drawn by tools/shot and the bench
// through tools/chrome.ts (ids start with "fx-"), never registered on the site.
import type { Polish } from "../../src/assemble/api";
import { arcPts, circle, roundRect, type Vec2 } from "../../src/core/geom";
import { bevel, bevelOutline, pitchCones, worm } from "../../src/core/spatial";
import { defineMechanism } from "../../src/model/define";
import type { MechanismModel } from "../../src/model/types";
import { P } from "../../src/parts";
import { beltModel, chainModel, deformModel, flexureModel, ropeModel, ujointModel } from "./models";

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

/**
 * Cone and helix forms (#166): the catalogue's straight bevel pair, 16:32 at module 4 with a 20 mm face, the wheel lying
 * on the base plane and the pinion's axis along x, the pitch cones sharing their apex over the wheel's centre; each
 * gear is its toothed frustum (Tredgold back-cone teeth, tapered toward the apex) on a shaft.
 */
function bevelPair(): Scene {
  const [d1, d2] = pitchCones(16, 32);
  const pin = bevel(16, 4, d1, 20);
  const gear = bevel(32, 4, d2, 20);
  // the wheel's back face at z 10: the apex is gear.apex above it, the pinion's axis at the apex height
  const z0 = 10;
  const zp = z0 + gear.apex;
  return {
    model: defineMechanism({
      id: "fx-bevel-pair",
      input: { kind: "rotary", part: "gear" },
      parts: [
        { ...P.custom("gear", bevelOutline(32, 4, d2), { role: "output", layer: 1, at: "G", spin: (s) => s.a as number, holes: [circle(8, 0, 0, 40)] }), thick: gear.axial, taper: gear.inner, m: 4, z: 32 },
        P.cap("pG", 0, 7, { fixed: [0, 0, 0], accent: true }),
        { ...P.custom("pinion", bevelOutline(16, 4, d1), { role: "driver", layer: 3, at: "Q", spin: (s) => (-2 * (s.a as number)) + Math.PI / 16, holes: [circle(6, 0, 0, 40)], axis: "x", along: -pin.apex }), thick: pin.axial, taper: pin.inner, m: 4, z: 16 },
        P.disc("pshaft", 6, { role: "driver", layer: 3, at: "Q", spin: (s) => -2 * (s.a as number), axis: "x", along: -130, thick: 130 - pin.apex + pin.axial, marks: [] }),
      ],
      solve: (u) => ({ pts: { G: [0, 0], Q: [0, zp] }, a: u }),
    }),
    polish() {},
  };
}

/** The catalogue's worm drive: module 3, one start, q 10, 30 teeth, centre distance 60; the worm along x beside the wheel. */
function wormPair(): Scene {
  const w = worm(3, 1, 30, 10);
  const face = 12;
  return {
    model: defineMechanism({
      id: "fx-worm-pair",
      input: { kind: "rotary", part: "wheel" },
      parts: [
        { ...P.gear("wheel", 30, 3, { role: "output", at: "G", spin: (s) => s.a as number }), thick: face, helix: w.wheelLead },
        P.cap("pG", -1, 7, { fixed: [0, 0, 0], accent: true }),
        P.disc("worm", w.d1 / 2 + 3, { role: "driver", layer: 2, at: "W", spin: (s) => (s.a as number) / w.ratio, axis: "x", along: -30, thick: 60, helix: w.lead, marks: [] }),
        P.disc("wshaft", 6, { role: "driver", layer: 2, at: "W", spin: (s) => (s.a as number) / w.ratio, axis: "x", along: -75, thick: 150, marks: [] }),
      ],
      solve: (u) => ({ pts: { G: [0, 0], W: [-w.a, face / 2] }, a: u / 30 }),
    }),
    polish() {},
  };
}

export const scenes: Record<string, Scene> = Object.fromEntries([shaftInPlan("y"), shaftInPlan("x"), bevelPair(), wormPair()].map((s) => [s.model.id, s]));

/** Flexible members (#168): the chain on two sprockets, the timing belt on two pulleys and the rope over two sheaves of the rule fixtures. */
export const flexScenes: Scene[] = [chainModel, beltModel, ropeModel, flexureModel, deformModel, ujointModel].map((model) => ({ model, polish() {} }));
for (const s of flexScenes) scenes[s.model.id] = s;
