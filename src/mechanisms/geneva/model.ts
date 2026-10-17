// Geneva drive (catalogue "geneva"): 4 slots, centre distance c 110. Tangential entry: crank radius a = c sin(π/n),
// slot mouth radius R = c cos(π/n), both 77.8. The wheel moves during 90° of crank rotation and dwells for 270°,
// turning opposite to the crank; while the roller is out, the locking disc sits in a concave arc of the wheel.
// The drive arm is a clevis of two plates straddling the wheel plane, so the roller stud works in double shear (A9).
import { TAU, arcPts, dBore, polar, ring, wrap, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

export const n = 4;
export const c = 110;
export const a = c * Math.sin(Math.PI / n);
const R = c * Math.cos(Math.PI / n);
/** Roller radius the profiles are cut for, and the slot half-width. */
const pr = 5.5;
export const hw = 7;
/** Wheel tip radius: the slot mouth plus the roller, 2 mm clear. */
export const Rw = Math.hypot(R, pr) + 2;
/** Slot end radius: 5 mm inside the roller's deepest point (c - a). */
export const depth = Math.max(8, c - a - 5);
/** Locking disc radius 0.65 a; the wheel's locking arcs are cut 1.5 mm larger (running clearance). */
export const rl = 0.65 * a;
const rhoW = rl + 1.5;
/** The disc's relief: a circle about the wheel centre, 3 mm outside the wheel tips. */
const rhoD = Rw + 3;
export const step = TAU / n;
/** Half the crank angle during which the roller is in a slot: 90° - 180°/n. */
const half = Math.PI / 2 - Math.PI / n;

/** The wheel outline; `w` is the slot half-width (the polish relieves the slots behind their wear strips). */
export function wheelOutline(w = hw): Vec2[] {
  const out: Vec2[] = [];
  const slotHalf = Math.asin(w / Rw);
  const sq = Math.sqrt(Rw * Rw - w * w);
  // the locking arc meets the tip circle where a circle rhoW about the crank axis (c along the bisector) crosses it
  const beta = Math.acos((Rw * Rw + c * c - rhoW * rhoW) / (2 * Rw * c));
  for (let k = 0; k < n; k++) {
    const th = k * step;
    const u: Vec2 = [Math.cos(th), Math.sin(th)];
    const nn: Vec2 = [-Math.sin(th), Math.cos(th)];
    out.push([sq * u[0] - w * nn[0], sq * u[1] - w * nn[1]]);
    out.push(...arcPts(depth * u[0], depth * u[1], w, th - Math.PI / 2, th - 1.5 * Math.PI, Math.PI / 10));
    out.push([sq * u[0] + w * nn[0], sq * u[1] + w * nn[1]]);
    const bis = th + step / 2;
    out.push(...arcPts(0, 0, Rw, th + slotHalf, bis - beta));
    const C = polar(c, bis);
    const P1 = polar(Rw, bis - beta);
    const P2 = polar(Rw, bis + beta);
    const mid = bis + Math.PI;
    const g1 = mid + wrap(Math.atan2(P1[1] - C[1], P1[0] - C[0]) - mid);
    const g2 = mid + wrap(Math.atan2(P2[1] - C[1], P2[0] - C[0]) - mid);
    out.push(...arcPts(C[0], C[1], rhoW, g1, g2).slice(1, -1));
    out.push(...arcPts(0, 0, Rw, bis + beta, th + step - slotHalf));
  }
  return out;
}

function discOutline(): Vec2[] {
  // the relief faces the roller (local +x): the arc of radius rhoD about the wheel centre at (c, 0)
  const xI = (rl * rl - rhoD * rhoD + c * c) / (2 * c);
  const al = Math.acos(Math.max(-1, Math.min(1, xI / rl)));
  const out = arcPts(0, 0, rl, al, TAU - al);
  const q1 = polar(rl, -al);
  const q2 = polar(rl, al);
  const h1 = Math.PI + wrap(Math.atan2(q1[1], q1[0] - c) - Math.PI);
  const h2 = Math.PI + wrap(Math.atan2(q2[1], q2[0] - c) - Math.PI);
  out.push(...arcPts(c, 0, rhoD, h1, h2).slice(1, -1));
  return out;
}

/** Keyed bore of the three parts on the input shaft (D-bore, A5). */
const KEYED = dBore(5);

export default defineMechanism({
  id: "geneva",
  input: { kind: "rotary", part: "arm" },
  parts: [
    P.custom("disc", discOutline(), { role: "driver", holes: [KEYED], marks: [ring(30)], between: ["O", "Ox"], name: "Locking disc" }),
    P.custom("wheel", wheelOutline(), { role: "output", marks: [ring(14)], at: "W", spin: (s) => s.wheel as number, name: "Geneva wheel" }),
    P.link("armRear", a, { role: "driver", layer: -1, w: 16, holes: [KEYED], between: ["O", "R"], name: "Drive arm, rear plate" }),
    P.link("arm", a, { role: "driver", layer: 1, w: 16, holes: [KEYED], between: ["O", "R"], name: "Drive arm, front plate" }),
    P.cap("pD", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
    P.cap("pW", 0, 7, { fixed: [c, 0, 0], span: 0 }),
    P.cap("pR", -1, pr, { at: "R", span: 2 }),
  ],
  traceZ: 16.8,
  solve(u): Solved {
    // u = 0 is mid-index, the roller on the line of centres: the build is laid out with the roller in a slot
    const th = u;
    const phi = wrap(th);
    const k = Math.floor((th + Math.PI) / TAU);
    const engaged = Math.abs(phi) < half;
    let wl: number;
    if (engaged) {
      const Pp = polar(a, phi);
      wl = wrap(Math.atan2(Pp[1], Pp[0] - c) - Math.PI);
    } else wl = phi > 0 ? -Math.PI / n : Math.PI / n;
    const wheel = Math.PI + wl - k * step;
    return { pts: { O: [0, 0], Ox: polar(1, th), R: polar(a, th), W: [c, 0] }, th, engaged, wheel };
  },
  paths: ["R"],
  vel: ["R"],
  forces(s) {
    const out: ReturnType<NonNullable<Parameters<typeof defineMechanism>[0]["forces"]>> = [{ type: "spin", c: [0, 0], r: a + 16, key: "input" }];
    if (s.engaged) {
      const th = s.th as number;
      const Rp = s.pts.R!;
      out.push({ type: "axial", a: Rp, b: [Rp[0] - 34 * Math.sin(th), Rp[1] + 34 * Math.cos(th)], key: "roller on slot" });
    }
    return out;
  },
  angles(s) {
    if (!s.engaged) return [];
    const Rp = s.pts.R!;
    const v = (Math.atan2(Rp[1], Rp[0] - c) * 180) / Math.PI;
    return [{ type: "angle", c: [c, 0], a: [0, 0], b: Rp, r: 30, key: "wheel", value: Math.abs(v + (Rp[1] > 0 ? -180 : 180)) }];
  },
  plot: { label: "Wheel angle", unit: "°", f: (s) => ((Math.PI / n - ((s.wheel as number) - Math.PI + step)) * 180) / Math.PI },
});
