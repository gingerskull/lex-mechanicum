// The rigid explode pass (standard 5a). Every solid ends with one level (E1). A screw is one body with its washer and
// leaves along its axis to the head side, half a level clear of the last part it passes (E2, E3); a nut goes the
// other way. Pressed parts were given their seat's level by the rules (E5); bought units are groups (E6); loose
// spacers sit midway between what they separate (E7); a shaft keeps its builder's level (E8).
import { inside, toLocal } from "../core/poly";
import type { Solid } from "../hardware/solid";
import { rigid } from "./fasteners";
import type { RuleContext } from "./types";

export function rigidExplode(ctx: RuleContext): void {
  const S = ctx.solids;
  const clear = ctx.form.explode.clear;
  const lvl = (t: Solid) => (t.span ? (t.span[0] + t.span[1]) / 2 : t.ex);
  const groups = new Map<string, Solid[]>();
  for (const t of S) if (t.group) (groups.get(t.group) ?? groups.set(t.group, []).get(t.group)!).push(t);
  const done = new Set<Solid>();
  const set = (t: Solid, L: number) => {
    t.ex = L;
    delete t.span;
    done.add(t);
  };
  const axisOf = (t: Solid) => {
    const q = ctx.world(t);
    return q ? ([q[0], q[1]] as [number, number]) : null;
  };
  const sameAxis = (a: Solid, b: Solid) => {
    const p = axisOf(a);
    const q = axisOf(b);
    return !!p && !!q && Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.3;
  };

  for (const [g, members] of groups) {
    const head = members.find((t) => t.kind === "head");
    if (!head) {
      // a bought unit or a shaft: one level, the first member's
      const L = members.reduce((m, t) => Math.min(m, lvl(t)), Infinity);
      for (const t of members) set(t, Number.isFinite(L) ? L : 0);
      continue;
    }
    const z0 = Math.min(...members.map((t) => t.z0));
    const z1 = Math.max(...members.map((t) => t.z1));
    const up = head.z0 + head.z1 > z0 + z1;
    const P = axisOf(head);
    const passed = P
      ? S.filter((t) => t.group !== g && !["head", "shank", "nut", "washer"].includes(t.kind) && Math.min(t.z1, z1) - Math.max(t.z0, z0) > 0.3 && (() => {
          const q = ctx.world(t);
          return !!q && inside(t.outer, toLocal(q, P));
        })())
      : [];
    const levels = passed.map((t) => (t.span ? (up ? Math.max(...t.span) : Math.min(...t.span)) : t.ex));
    const L = up ? Math.max(head.ex, ...levels.map((v) => v + clear)) : Math.min(head.ex, ...levels.map((v) => v - clear));
    for (const t of members) set(t, L);
    // the washer under the head goes with it
    for (const t of S) if (!done.has(t) && t.kind === "washer" && sameAxis(t, head) && rigid(ctx, t, head) && Math.min(Math.abs(t.z1 - head.z0), Math.abs(t.z0 - head.z1)) < 0.3) set(t, L);
    // a nut on the far end leaves the other way
    for (const n of S) {
      if (done.has(n) || n.kind !== "nut" || !sameAxis(n, head) || !rigid(ctx, n, head)) continue;
      if (Math.min(n.z1, z1) - Math.max(n.z0, z0) < -0.3) continue;
      const nl = up ? Math.min(n.ex, ...levels.map((v) => v - 2 * clear)) : Math.max(n.ex, ...levels.map((v) => v + 2 * clear));
      for (const t of n.group ? (groups.get(n.group) ?? [n]) : [n]) set(t, nl);
    }
  }
  for (const t of S) if (!done.has(t)) set(t, lvl(t));
}
