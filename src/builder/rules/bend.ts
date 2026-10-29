// Supports that follow a control (F7): a control that changes the geometry (a bend, an offset) carries each moved
// joint's ground hardware with it (src/render/v3/poser), so a shaft's pillow blocks swing with the bend. They are bolted
// through slots in the base along the path each bolt takes over the control's range, as an adjustable support is: a bolt
// through the foot and the slot, a washer and a nyloc nut under the base that clamp it where it is set, and no dowels,
// which would pin it; a hole the joint has through the base (a shaft's) becomes a slot along its path too. The slots go
// into the base's holes before the base is made, so the plate grows to carry the support at both ends of the range.
import { type Vec2 } from "../../core/geom";
import { NUTS, WASHERS, standardLength } from "../../hardware/tables";
import { H } from "../../hardware/primitives";
import { jointFrame, moves, xf, type Vec3, type Xf } from "../../kin/math";
import type { Controls } from "../../kin/types";
import type { BuildCtx } from "../ctx";
import { parallel, place } from "../frames";
import { titleOf } from "../lib";
import { UP } from "../sites";
import type { Rule } from "./types";

/** Settings of a control sampled across its range, for the paths the bolts take. */
const STEPS = 24;
/** Radial clearance of a bolt in its slot (mm), as a clearance hole's (rules/shared, fasteners). */
const CLEAR = 0.3;
/** Thread past the nut (mm). */
const PAST = 1.5;

const UPF = { o: [0, 0, 0] as Vec3, x: [1, 0, 0] as Vec3, z: [0, 0, 1] as Vec3 };

/**
 * Every ground joint a param control moves, with the control's id and the joint's move from the built setting to each of
 * STEPS + 1 settings across the control's range, in order from its least to its most.
 */
export function followers(ctx: BuildCtx): Map<string, { control: string; D: Xf[] }> {
  const out = new Map<string, { control: string; D: Xf[] }>();
  const base = ctx.source.controls;
  for (const c of ctx.teaching?.controls ?? []) {
    if (c.kind !== "param" || !c.param) continue;
    const p = ctx.kin.params?.find((q) => q.id === c.param);
    if (!p || p.min === undefined || p.max === undefined || !(p.max > p.min)) continue;
    const setups = Array.from({ length: STEPS + 1 }, (_, i) => {
      const v = p.min! + ((p.max! - p.min!) * i) / STEPS;
      const ctl: Controls = { ...base, params: { ...base?.params, [p.id]: v } };
      return ctx.K.setup(ctl);
    });
    for (const j of ctx.kin.joints) {
      if (j.a !== "ground" && j.b !== "ground") continue;
      const r0 = ctx.S.joints.get(j.id);
      if (!r0) continue;
      const F0 = xf.inv(jointFrame(r0.at, r0.axis));
      const D = setups.map((S) => {
        const r = S.joints.get(j.id);
        return r ? xf.mul(jointFrame(r.at, r.axis), F0) : xf.id();
      });
      if (D.some(moves)) out.set(j.id, { control: c.id, D });
    }
  }
  return out;
}

/** A slot of half-width r along a path: its sides offset either way, a half round at each end. */
export function slotAlong(path: Vec2[], r: number): Vec2[] {
  const n = path.length;
  const dir = (i: number): Vec2 => {
    const a = path[Math.max(0, i - 1)]!;
    const b = path[Math.min(n - 1, i + 1)]!;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  };
  const side = (s: 1 | -1): Vec2[] => path.map((p, i) => [p[0] - s * dir(i)[1] * r, p[1] + s * dir(i)[0] * r]);
  // a half round out past the end the way `t` runs: from its right side, counter-clockwise through `t`, to its left
  const cap = (p: Vec2, t: Vec2): Vec2[] => {
    const a0 = Math.atan2(-t[0], t[1]);
    return Array.from({ length: 23 }, (_, k) => {
      const a = a0 + (Math.PI * (k + 1)) / 24;
      return [p[0] + r * Math.cos(a), p[1] + r * Math.sin(a)] as Vec2;
    });
  };
  // counter-clockwise: the right side forward, round the far end, the left side back, round the near end
  return [...side(-1), ...cap(path[n - 1]!, dir(n - 1)), ...side(1).reverse(), ...cap(path[0]!, [-dir(0)[0], -dir(0)[1]])];
}

export const bendSlots: Rule = {
  id: "bend-slots",
  tier: "AUTO",
  ids: ["F7", "F1"],
  fixture: "universal-joint",
  applies: (ctx) => (ctx.teaching?.controls ?? []).some((c) => c.kind === "param"),
  apply() {},
  after(ctx) {
    const base = ctx.base;
    if (!base) return;
    const moved = followers(ctx);
    for (const [jid, { control, D }] of moved) {
      const pins: string[] = [];
      const nuts: string[] = [];
      const bolts: string[] = [];
      const along = (at: readonly number[]): Vec2[] =>
        D.map((X): Vec2 => {
          const q = xf.apply(X, [at[0]!, at[1]!, at[2] ?? base.top]);
          return [q[0], q[1]];
        });
      const runOf = (path: Vec2[]) => path.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - path[i - 1]![0], p[1] - path[i - 1]![1]) : 0), 0);
      // the joint's own holes through the base (a shaft's clearance hole) run along its path
      for (const h of ctx.baseHoles) {
        if (h.joint !== jid || h.ring || !(h.r > 0)) continue;
        const path = along(h.at);
        if (runOf(path) < 0.05) continue;
        h.ring = slotAlong(path, h.r);
      }
      for (const s of [...ctx.solids]) {
        if (s.body !== "ground" || !s.joints.includes(jid) || s.op.op !== "extrude" || !parallel(s.frame.z, UP)) continue;
        const z0 = s.frame.o[2];
        const z1 = z0 + s.op.h;
        if (z1 <= base.bottom + 0.05 || z0 >= base.top - 0.05) continue;
        // a dowel into the base would pin the support: it goes
        if (s.kind === "dowel") {
          ctx.solids = ctx.solids.filter((q) => q !== s);
          pins.push(s.id);
          continue;
        }
        if (s.kind !== "shank") continue;
        const at = s.frame.o;
        const path = along(at);
        if (runOf(path) < 0.05) continue;
        const M = s.thread?.m ?? Math.round(s.d ?? 5);
        ctx.baseHoles.push({ at: [at[0], at[1]], r: 0, joint: jid, ring: slotAlong(path, (s.d ?? M) / 2 + CLEAR) });
        // the bolt runs on through the base to a washer and a nut under it
        const w = WASHERS[M] ?? WASHERS[5]!;
        const nut = NUTS[M] ?? NUTS[5]!;
        const top = z1;
        const low = base.bottom - w.h - nut.m - PAST;
        const L = standardLength(top - low);
        s.frame = { ...s.frame, o: [at[0], at[1], top - L] };
        s.op = { ...s.op, h: L };
        if (s.thread) s.thread = { ...s.thread, z0: 0, z1: L };
        const head = ctx.solids.find((q) => q.group === s.group && q.kind === "head");
        if (head?.name) head.name = head.name.replace(/ x \d+(\.\d+)? \(/, ` x ${L} (`);
        if (head) bolts.push(head.id);
        const own = { body: "ground", joints: [...s.joints], ...(s.group ? { group: s.group } : {}) };
        const first = !nuts.length;
        nuts.push(`${s.id}-nut`);
        ctx.add(
          place(UPF, H.plainWasher(`${s.id}-wsh`, M, { at: [at[0], at[1], 0], z0: base.bottom - w.h, ...own, ...(first ? {} : { name: "" }) })),
          place(UPF, H.nut(`${s.id}-nut`, M, { at: [at[0], at[1], 0], z0: base.bottom - w.h - nut.m, z1: base.bottom - w.h, ...own, ...(first ? { name: `Nyloc nut M${M} (DIN 985) under the base, clamping the support where the ${control} control sets it` } : { name: "" }) })),
        );
      }
      // the feet say how they are held, and the joint's note says why
      for (const s of ctx.solids) if (s.joints.includes(jid) && s.name.includes("screwed and dowelled to the base")) s.name = s.name.replace("screwed and dowelled to the base", "bolted through slots in the base");
      for (const nt of ctx.notes) {
        if (nt.id !== jid) continue;
        for (const f of Object.keys(nt.serves ?? {}) as (keyof NonNullable<typeof nt.serves>)[]) nt.serves![f] = nt.serves![f]!.filter((x) => !pins.includes(x));
        // the bolts through the slots fix the support (F1), their nuts clamp it where the control sets it (F7)
        if (nuts.length) nt.serves = { ...nt.serves, F1: [...(nt.serves?.F1 ?? []), ...bolts], F7: [...(nt.serves?.F7 ?? []), ...nuts] };
        nt.note += ` Its supports follow the ${control} control: each is bolted through slots in the base that run along the path its bolts take over the control's range, clamped by a nut under the base where the control sets it, and not dowelled (F7).`;
      }
      (ctx.fired["bend-slots"] ??= []).push(`${titleOf(jid)}: slots for ${pins.length ? `${pins.length} dowels dropped, ` : ""}its bolts`);
    }
  },
};
