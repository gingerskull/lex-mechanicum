// Overrides and additions to the generated non-circular gear assembly (standard 5.2). The rules classify the pair as
// one mesh (the model declares both gears as 26 teeth of module 2a / 26, K6), straddle mount both shafts in a bridge,
// give each gear its hub, the backlash eccentric, the housings and the drive. What differs from the rules:
// - lightening windows in both gears (M2): the variable speed makes each gear start, slow and speed up twice a turn,
//   so the mass goes into the rim, four spokes between a hub and the rim, every corner filleted;
// - the timing mark on gear 2 moved onto its real mesh radius: the rule puts it at the mean pitch radius (a), which is
//   outside the short side of the ellipse, where gear 2 meets the long side of gear 1 at the assembly phase (F9);
// - notes, badges and build rules (A16).
import { polar, type Vec2 } from "../../core/geom";
import { clipHalfPlane } from "../../core/poly";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { a, arcOf, e, pitchAt } from "./model";

/** Spoke count, half-width, hub radius round the focus, and how far inside the pitch curve the rim's inner edge runs. */
const SPOKES = 4;
const HALF = 4;
const HUB = 17;
const RIM_IN = 10;

/** The window between spokes k and k+1: inside the pitch curve offset by RIM_IN, outside the hub, between the spoke strips. */
function window(k: number): Vec2[] {
  const b0 = (k * 2 * Math.PI) / SPOKES;
  const b1 = b0 + (2 * Math.PI) / SPOKES;
  const outer: Vec2[] = [];
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const al = b0 + ((b1 - b0) * i) / n;
    const q = pitchAt(arcOf(al));
    outer.push([q.p[0] - RIM_IN * q.n[0], q.p[1] - RIM_IN * q.n[1]]);
  }
  const inner: Vec2[] = [];
  for (let i = n; i >= 0; i--) inner.push(polar(HUB, b0 + ((b1 - b0) * i) / n));
  let w: Vec2[] = [...outer, ...inner];
  const d0: Vec2 = [Math.cos(b0), Math.sin(b0)];
  const d1: Vec2 = [Math.cos(b1), Math.sin(b1)];
  // keep the side of spoke k's strip toward k+1, and the side of spoke k+1's strip toward k
  w = clipHalfPlane(w, [-d0[1] * HALF, d0[0] * HALF], [-d0[1], d0[0]]);
  w = clipHalfPlane(w, [d1[1] * HALF, -d1[0] * HALF], [d1[1], -d1[0]]);
  return w;
}

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- M2: four spokes in each gear ----
  for (const id of ["gear1", "gear2"]) {
    const g = A.get(id)!;
    for (let k = 0; k < SPOKES; k++) g.holes.push(H.filletPoly(window(k), 4));
    g.name = `${g.name}, hub, rim and ${SPOKES} spokes`;
  }

  // ---- F9: gear 2's mark where its short side meets gear 1's long side at the assembly phase (local α = π) ----
  const g2 = A.get("gear2")!;
  g2.marks = g2.marks.filter((m) => m.kind !== "timing");
  const root2 = a * (1 - e) - 1.25 * 3.0;
  g2.marks.push({ kind: "timing", pts: [[-(root2 - 10), 0], [-(root2 - 7), 0]] });
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.rules.push(
    { title: "Phase first, then the bridge", text: "The long side of one gear must meet the short side of the other: set the timing marks on the line of centres, then lower the bridge over both shafts. The wrong phase puts a tooth on a tooth and jams within a quarter turn." },
    { title: "Both gears carried on both sides", text: "Nothing sweeps over either gear, so each shaft runs from its housing below to a floating bearing in the bridge above: no overhung gear." },
    { title: "Backlash is a compromise", text: "The centre distance is exact only at the line of centres where the arcs roll equal; the eccentric bushings under the housing and in the bridge set the mean backlash, and the teeth are cut thinner for the rest." },
    { title: "Teeth spaced along the curve", text: "26 teeth equal in arc length along the pitch curve, not in angle: the pitch is 9.45 mm everywhere, and each gear's perimeter holds a whole number of teeth." },
    { title: "Kinematics untouched", text: "The pitch curves, the centre distance and the tooth positions are the model's; spokes, hubs, bearings and marks are cut round them." },
  );
};
