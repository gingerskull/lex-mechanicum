// Tusi couple (catalogue "tusi-couple"): a 16-tooth planet rolling inside a fixed 32-tooth ring, module 4, so R = 2r
// (R 64, r 32). The arm O→C carries the planet at C, length R - r = 32. The planet turns backwards by exactly the
// arm angle u, so any point on its pitch circle runs on a straight diameter of the ring: tracer X (the planet's tooth
// on the line of centres at u = 0) along the x axis, tracer Y (the opposite tooth, which passes through O) along the y
// axis. Tooth phase: the ring has a tooth space and the planet a tooth on the +x axis at u = 0, so they mesh at every
// u. The catalogue puts Y "90° round from X" on the ring; on the planet itself it is the diametrically opposite
// tooth, the pitch point that lies on O at u = 0 (K6, a deliberate reading of the build spec).
import { D2R, dBore, polar } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P, heights } from "../../parts";

export const m = 4;
export const zr = 32;
export const zp = 16;
/** Ring and planet pitch radii; the arm is R - r long. */
export const R = (m * zr) / 2;
export const r = (m * zp) / 2;

/** Keyed bore of the arm on the input (D-bore, A5). */
const KEYED = dBore(5);
/** Arm boss radii (D1): round the keyed input, round the planet pin. */
const ARM_R: [number, number] = [13, 10];
/** Tracer pegs stand on the planet top (on a Ø3 pin, 1 mm clear of the ring face). */
const PEG_DZ = 8;
/**
 * Plating (K1: heights may change, centres may not): the ring sits on layer 0 with the arm, whose sweep never reaches
 * it, but 10 mm up so its teeth are in the planet's plane (the planet, on layer 1, covers the input axis and must stay
 * clear of the input shaft's cap).
 */
const RING_DZ = 10;
/** Ring rim radius: 4 mm wider than the standard 80, so the ring posts stand outside the planet's tooth tips (68). */
const RIM = 84;

const tx = P.tracer("tX", 1, { at: "X", dz: PEG_DZ, thick: 5, r: 3.2, name: "Tracer X" });
const ty = P.tracer("tY", 1, { at: "Y", dz: PEG_DZ, thick: 5, r: 3.2, name: "Tracer Y" });

export default defineMechanism({
  id: "tusi-couple",
  input: { kind: "rotary", part: "arm" },
  parts: [
    P.ringGear("ring", zr, m, { role: "ground", layer: 0, dz: RING_DZ, rim: RIM, fixed: [0, 0, 0], name: "Ring gear, 32 teeth" }),
    P.link("arm", R - r, { role: "driver", layer: 0, r: ARM_R, holes: [KEYED], between: ["O", "C"], name: "Carrier arm" }),
    P.gear("planet", zp, m, { role: "output", layer: 1, at: "C", spin: (s) => s.rot as number, bore: false, name: "Planet, 16 teeth" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pC", 0, 5.5, { at: "C" }),
    tx,
    ty,
  ],
  traceZ: heights(tx)[1],
  solve(u) {
    const C = polar(R - r, u);
    // the planet's absolute turn is -(zr/zp - 1) u = -u
    const rot = -u;
    return {
      pts: { O: [0, 0], C, X: polar(r, rot, C[0], C[1]), Y: polar(r, rot + Math.PI, C[0], C[1]), M: polar(R, u) },
      rot,
      th: u,
    };
  },
  paths: ["X", "Y"],
  vel: ["X", "Y"],
  forces: (s) => {
    const th = s.th as number;
    const M = s.pts.M!;
    // the ring's push on the planet at the mesh: tangential, tipped 20° toward the centre by the pressure angle
    return [
      { type: "spin", c: [0, 0], r: R - r + 16, key: "input", z: 1.2 },
      { type: "axial", a: M, b: polar(30, th + Math.PI / 2 + 20 * D2R, M[0], M[1]), key: "tooth force" },
    ];
  },
  angles(s) {
    const th = ((((s.th as number) / D2R) % 360) + 360) % 360;
    return [{ type: "angle", c: [0, 0], a: [R - r, 0], b: s.pts.C!, r: 20, key: "arm", value: th, z: 1.2 }];
  },
  plot: { label: "Tracer X position", unit: "mm", f: (s) => s.pts.X![0] },
});
