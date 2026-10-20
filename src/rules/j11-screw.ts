// J11: a screw joint the model declares (MechanismModel.screws). The screw lies on an x or y axis and is carried by its
// shaft in plan (J10: one located end, one floating, F2, F4); its thread is drawn by its helix at the lead. The nut is a
// block on the nut part straddling the screw: a bronze lead nut with a flange screwed to the carriage, or a flanged
// ball nut with its ball return over the top and a wiper seal at each end (F8). A nut on a slide (J5) is held from
// turning by the slide; one that is not gets an anti-rotation key in a guide slot (F3).
import { boxOf } from "../core/axis";
import { roundRect, type Vec2 } from "../core/geom";
import { key, plate, screw, stroke, tube, wiper } from "../hardware/primitives";
import { heights } from "../parts";
import { poseOf } from "../model/pose";
import type { Rule, RuleContext, ScrewJoint } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));

function buildScrew(ctx: RuleContext, j: ScrewJoint): void {
  const J = ctx.joint(j.id)!;
  const axis = j.screw.axis as "x" | "y";
  const sol = ctx.solidOf[j.screw.id]!;
  // the thread, drawn at the lead along the screw (a long helix draws as thread marks)
  sol.helix = j.lead;
  sol.name = `${j.form === "ball" ? "Ball screw" : "Lead screw"}, lead ${fmt(Math.abs(j.lead))} ${j.lead < 0 ? "left" : "right"} hand`;
  sol.mat = j.form === "ball" ? "Steel 50CrMo4, induction hardened and ground" : "Steel C45, rolled thread";
  const q = poseOf(j.screw, ctx.s0);
  const nq = poseOf(j.nut, ctx.s0);
  if (!q || !nq) return;
  const R = Math.max(...j.screw.shape.outer.map(([a, b]) => Math.hypot(a, b)));
  const [w0, w1] = heights(j.screw);
  const B = boxOf(axis, j.screw.shape.outer.map(([a, b]): Vec2 => [a + q[0], b + q[1]]), w0, w1);
  // the nut block in plan, on the nut part, centred on the screw across and on the nut along
  const nut = ctx.solidOf[j.nut.id]!;
  const along = axis === "x" ? 0 : 1;
  const len = j.form === "ball" ? 40 : 24;
  const wid = 2 * R + 14;
  const across: [number, number] = axis === "x" ? [B[1], B[4]] : [B[0], B[3]];
  const mid = (across[0] + across[1]) / 2;
  // block outline in the nut's local frame (a slider's pose has no turn along the screw)
  const c = [nq[0], nq[1]];
  const rect = (l: number, w: number): Vec2[] =>
    roundRect(...((): [number, number, number, number] => {
      const a0 = -l / 2;
      const a1 = l / 2;
      const b0 = mid - w / 2 - (along === 0 ? c[1]! : c[0]!);
      const b1 = mid + w / 2 - (along === 0 ? c[1]! : c[0]!);
      return along === 0 ? [a0, b0, a1, b1] : [b0, a0, b1, a1];
    })(), 2);
  const zc = (B[2] + B[5]) / 2;
  const G = { body: j.nut.id, joints: [j.id], ex: nut.ex };
  const body = plate(`${j.id}-nut`, rect(len, wid), {
    ...G,
    kind: "bushing",
    role: "bearing",
    name: j.form === "ball" ? `Flanged ball nut for Ø${fmt(2 * R)} x ${fmt(Math.abs(j.lead))}, preloaded` : `Lead nut, bronze, flanged, for Ø${fmt(2 * R)} x ${fmt(Math.abs(j.lead))}`,
    mat: j.form === "ball" ? "Bearing steel 100Cr6, balls in two circuits" : "Bronze CuSn12",
    z0: zc - R - 6,
    z1: zc + R + 6,
    why: "turns the screw's rotation into the carriage's travel",
    // the screw runs through the nut's bore, which a block on the plan axis cannot cut
    allow: [j.screw.id, ...ctx.solids.filter((t) => t.body === j.screw.id || t.group?.endsWith("-shaft")).map((t) => t.id)],
  });
  ctx.add(body);
  (J.serves.F3 ??= []).push(body.id);
  if (j.form === "ball") {
    // the ball return over the top and a wiper at each end (F8)
    const half = len / 2 - 4;
    const pts: Vec2[] = along === 0 ? [[-half, mid - (c[1] ?? 0)], [half, mid - (c[1] ?? 0)]] : [[mid - (c[0] ?? 0), -half], [mid - (c[0] ?? 0), half]];
    ctx.add(tube(`${j.id}-return`, 0, 4, { ...G, name: "Ball return tube, clamped to the nut", outer: stroke(pts, 2.5), holes: [], z0: zc + R + 6, z1: zc + R + 10, mat: "Steel, formed tube" }));
    for (const s of [-1, 1]) {
      const wp: Vec2[] = rect(2, wid - 4).map(([a, b]) => (along === 0 ? [a + s * (len / 2 + 1), b] : [a, b + s * (len / 2 + 1)]));
      ctx.add(wiper(`${j.id}-wiper${s < 0 ? 0 : 1}`, wp, { ...G, z0: zc - R - 2, z1: zc + R + 2, name: s < 0 ? "Wiper seal, both nut ends" : "", qty: s < 0 ? 2 : 0 }));
      (J.serves.F8 ??= []).push(`${j.id}-wiper${s < 0 ? 0 : 1}`);
    }
  }
  // the flange screws into the carriage
  for (const s of [-1, 1]) {
    const at: Vec2 = along === 0 ? [s * (len / 2 - 4), mid - (c[1] ?? 0) + wid / 2 - 3] : [mid - (c[0] ?? 0) + wid / 2 - 3, s * (len / 2 - 4)];
    ctx.add(screw(`${j.id}-nsc${s < 0 ? 0 : 1}`, "socket", 4, 10, { ...G, at: [at[0], at[1], 0], face: zc + R + 6, dir: -1, ex: nut.ex + 1, name: s < 0 ? undefined : "", qty: s < 0 ? 2 : 0 }));
  }
  // anti-rotation: a slide holds the nut; otherwise a key in a guide slot (F3)
  const onSlide = ctx.info.some((x) => x.kind === "slide" && x.slider.id === j.nut.id);
  if (!onSlide) {
    const k = key(`${j.id}-antirot`, 4, len - 6, { ...G, outer: rect(len - 6, 4).map(([a, b]) => (along === 0 ? [a, b - wid / 2 - 2] : [a - wid / 2 - 2, b])), z0: zc - R - 6, z1: zc - R - 2, name: "Anti-rotation key in the guide slot, hardened" });
    ctx.add(k);
    (J.serves.F3 ??= []).push(k.id);
  }
  J.note = `${j.form === "ball" ? "Ball screw" : "Lead screw"} along ${axis}, lead ${fmt(Math.abs(j.lead))}: ${j.form === "ball" ? "a preloaded ball nut with its ball return and two wipers" : "a flanged bronze nut"} screwed to the ${j.nut.id}, held from turning by ${onSlide ? "its slide" : "a key in a guide slot"}; the screw's end bearings, one located and one floating, from its shaft in plan (J10).`;
  J.badge = [onSlide ? "nut on a slide" : "anti-rotation key", "ok"];
}

export const j11: Rule = {
  id: "j11-screw",
  tier: "AUTO",
  ids: ["J11", "F3", "F8"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J11"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "screw") buildScrew(ctx, j);
  },
};
