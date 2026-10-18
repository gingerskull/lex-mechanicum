// Overrides and additions to the generated Jansen assembly (standard 5.2). The layers, the bowed bar k and the plating
// are the model's; the rules build every stack on them: a live shaft at O, a dead axle and bridge at Y, shoulder bolts
// at A to E, stops for the two parts that swing on Y, the base and the drive. What differs from the rules:
// - lightening windows in the two triangles, the big oscillating plates (D2, M2);
// - bar k made adjustable by H.turnbuckle, set at its exact length (F7);
// - an index on the crank and a zero line on the base, so the crank goes back in phase (F9);
// - notes, badges and build rules (A16).
import { polar, type Vec2 } from "../../core/geom";
import { edgeDist, inside } from "../../core/poly";
import type { Polish } from "../../assemble/api";

/** The triangles' plan corners (the pins), body-local, as in the model. */
const third = (pq: number, pr: number, qr: number): Vec2 => {
  const x = (pq * pq + pr * pr - qr * qr) / (2 * pq);
  return [x, Math.sqrt(pr * pr - x * x)];
};
const UPPER: Vec2[] = [[0, 0], [83, 0], third(83, 80.2, 111.6)];
const FOOT: Vec2[] = [[0, 0], [73.4, 0], third(73.4, 98, 131.4)];

/** Web left round every boss and edge by a window (M2): the boss radius 10 plus 6 mm. */
const BOSS = 10;
const WEB = 6;
/** Window cutter radius (M5). */
const CUTTER = 4;

/** Bar k: its length and the bow of its outline (the model's); the turnbuckle sits at the bow's crest. */
const K = 123.8;
const K_BOW = 7;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- D2, M2: one lightening window in each triangle: they swing, so their mass is inertia. The biggest similar
  // triangle that keeps WEB mm of web to every edge and boss ----
  const window = (id: string, tri: Vec2[]) => {
    const solid0 = A.get(id)!;
    const g: Vec2 = [(tri[0]![0] + tri[1]![0] + tri[2]![0]) / 3, (tri[0]![1] + tri[1]![1] + tri[2]![1]) / 3];
    for (let s = 0.8; s > 0.15; s -= 0.01) {
      const w = H.window(tri.map(([x, y]): Vec2 => [g[0] + (x - g[0]) * s, g[1] + (y - g[1]) * s]), CUTTER);
      const ok = w.every((p) => inside(solid0.outer, p) && edgeDist(solid0.outer, p) >= WEB - 0.01 && tri.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) >= BOSS + WEB - 0.01));
      if (ok) {
        solid0.holes.push(w);
        return;
      }
    }
  };
  window("upper", UPPER);
  window("foot", FOOT);

  // ---- F7: bar k is the one adjustable link, a turnbuckle at its bow's crest, where the bar runs straight along x,
  // set at its exact 123.8 mm between pin centres (K1) ----
  H.turnbuckle(A, "bar-k", {
    at: [K / 2, K_BOW],
    set: K,
    title: "Adjuster · bar k",
    why: "Bar k is the one adjustable link: a Jansen leg walks right only while its holy numbers hold, so one length is made trimmable.",
  });

  // ---- F9: the crank's phase. An index line on the crank and a zero line on the base at crank angle 0, with a tick every
  // 90°: the crank goes back on the shaft in phase, so the foot lands where the others in a set of legs expect it ----
  A.get("crank")!.marks.push({ kind: "index", pts: [[16, 0], [20, 0]] });
  const base = A.get("base")!;
  for (let q = 0; q < 4; q++) base.marks.push({ kind: "scale", pts: [polar(44, (q * Math.PI) / 2), polar(q ? 48 : 52, (q * Math.PI) / 2)] });

  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  const jO = A.joint("pO");
  (jO.serves.F9 ??= []).push("crank", "base");
  A.joint("pO", { note: `${jO.note} Bars j and k pass over the crank hub, so the crank is the lowest plane and support comes from behind.` });
  A.joint("pA", {
    note: `${A.joint("pA").note} Bar j sits between the crank and bar k: the shoulder works in double shear with the head clamping the stack on the inner races; nothing sweeps over the head.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pY", {
    note: `${A.joint("pY").note} The upper triangle and bar c swing on this axle, each on its own bearing; bar k passes under the bridge and its bow keeps its edge 8.8 mm from the axle centre.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pB", {
    note: `${A.joint("pB").note} Single shear, forced: no plane is free above the bars to put a clevis in, and the head clamps the two bearings on inner races. ${sz("pB-bolt")}.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pC", {
    note: `${A.joint("pC").note} Bar c sits between the foot triangle and bar k: the pin works in double shear.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pD", {
    note: `${A.joint("pD").note} Single shear, forced as at B: the upper triangle and bar f are the only two parts, with the head over the bearing and nothing above to carry a second plate.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pE", {
    note: `${A.joint("pE").note} Single shear, forced as at B and D; bar f and the foot triangle are clamped on inner races.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Crank lowest, bar k on top", text: "Every bar passes over the crank hub, so the crank takes the bottom plane; the two triangles share it, the bars j, c and f the next, bar k the top. Nothing is stacked only to clear something." },
    { title: "Bar k bowed", text: "The Y pivot sits 2.3 mm from a straight bar k, so k is a shallow arc, bowed 7 mm away from it: the pin centres, and the length, are unchanged." },
    { title: "Exact numbers", text: "The leg walks only while Jansen's holy numbers hold, so bar k is made in two halves joined by a turnbuckle with jam nuts, set at 123.8 mm between pin centres." },
    { title: "Two parts swing on Y", text: "The upper triangle and bar c each turn on their own bearing on one axle held at both ends, with a stop pair for each just beyond its swing." },
    { title: "Set the crank to the zero line", text: "Index line on the crank and zero line on the base: with the crank at the zero line the foot is at the start of its stride. Rebuild from there." },
  );
};
