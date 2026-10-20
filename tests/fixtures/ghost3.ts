// A fixture mechanism for the teaching layers of the 3D renderer: a crank turning about O, a rocker swinging about O2, a
// die point whose path depends on a control (ghost traces for its other settings), the rocker's extreme positions as
// phantoms, and construction overlays of every kind the renderer draws. Hand-coded kinematics, so it draws without the
// build pipeline; `tools/chrome3.ts` serves its package and teaching block under the id "fx3-ghost".
import type { Teaching } from "../../src/catalog/kin";
import type { Poser } from "../../src/render/v3/poser";
import { atPose } from "../../src/solids/frame";
import type { Fx } from "./scene3";

export const GHOST: Fx[] = [
  { id: "base", body: "ground", rect: [-30, -50, 140, 50], z0: 0, z1: 6, role: "ground", kind: "base", flags: 8 },
  { id: "crank", body: "crank", rect: [-6, -5, 40, 5], z0: 12, z1: 18, role: "driver" },
  { id: "rocker", body: "rocker", rect: [-6, -5, 50, 5], z0: 20, z1: 26, role: "output", fr: atPose(80, 0, 20) },
  { id: "post", body: "ground", disc: [80, 0, 7], z0: 6, z1: 40, role: "ground", kind: "standoff" },
  { id: "plate", body: "ground", rect: [60, -22, 110, 22], z0: 40, z1: 44, role: "ground", kind: "plate" },
];

const rot = (a: number, cx: number, cy: number): [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, cx - c * cx + s * cy, cy - s * cx - c * cy, 0, 1];
};

export const ghostPoser: Poser = {
  period: Math.PI * 2,
  place: (s, u) => (s.body === "crank" ? rot(u, 0, 0) : s.body === "rocker" ? rot(0.5 * Math.sin(u), 80, 0) : rot(0, 0, 0)),
  point: (u, id, ctl) => {
    const a = 0.5 * Math.sin(u);
    switch (id) {
      case "O": return [0, 0, 22];
      case "O2": return [80, 0, 22];
      case "P": return [40 * Math.cos(u), 40 * Math.sin(u), 22];
      case "T": return [80 + 50 * Math.cos(a), 50 * Math.sin(a), 22];
      case "D": return [60 + 20 * Math.sin(u), 10 * (ctl?.drivers?.["die"] ?? 0) * Math.cos(u), 22];
      default: return null;
    }
  },
  span: () => null,
};

export const ghostTeaching = {
  review: { verdict: "keep", date: "2026-10-20", note: "fixture" },
  principle: [{ body: "rocker" }, { body: "crank" }],
  traces: [
    { id: "die", point: "D", comet: true, ghosts: [{ control: "die", value: 1 }, { control: "die", value: -1 }] },
    { id: "tip", point: "T", ticks: { every: 30 } },
  ],
  overlays: [
    { id: "dead", kind: "line", from: "O", to: "O2", label: "CENTRE LINE" },
    { id: "swing", kind: "arc", center: "O2", through: "T", label: "ARC OF T" },
    { id: "bore", kind: "circle", center: "O2", radius: 12, label: "SEAT" },
    { id: "arm", kind: "dimension", from: "O", to: "P", label: "CRANK" },
    { id: "ws", kind: "workspace", point: "D", label: "DIE RANGE" },
  ],
  view: "PLAN",
  controls: [{ id: "die", kind: "driver", driver: "die" }],
  plot: { x: "input", y: "tip", label: "TIP" },
  claims: [],
  exceptions: [],
} as unknown as Teaching;

/** Force, angle and velocity items for the overlay layer: a push on the crank tip, the crank's angle from the centre line, and the tip's speed. */
export const ghostItems = {
  forces: (u: number) => [{ type: "force" as const, a: ghostPoser.point(u, "P")!, b: [ghostPoser.point(u, "P")![0] + 25, ghostPoser.point(u, "P")![1] - 20, 22] as [number, number, number], key: "LOAD" }],
  angles: (u: number) => [{ type: "angle" as const, c: [0, 0, 22] as [number, number, number], a: [40, 0, 22] as [number, number, number], b: ghostPoser.point(u, "P")!, r: 22, key: "CRANK", value: (u * 180) / Math.PI }],
  velocity: [{ point: "P", max: 40 }],
};
