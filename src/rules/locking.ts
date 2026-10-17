// M13: a locking method on every threaded fastener. Nuts are nyloc; shoulder bolts and axles are threadlocked
// (medium strength) so they can be serviced; set screws low strength; screws into plates take threadlocker too.
import type { Rule } from "./types";

export const LOCKS = {
  bolt: "threadlocker, medium strength (Loctite 243)",
  setScrew: "threadlocker, low strength (Loctite 222)",
  screw: "threadlocker, medium strength (Loctite 243)",
  nut: "nylon insert (DIN 985)",
} as const;

export const locking: Rule = {
  id: "locking",
  tier: "AUTO",
  ids: ["M13"],
  applies: () => true,
  apply(ctx) {
    const groups = new Map<string, string>();
    for (const t of ctx.solids) {
      if (t.lock) continue;
      if (t.kind === "nut") t.lock = LOCKS.nut;
      else if (t.kind === "setScrew") t.lock = LOCKS.setScrew;
      else if (t.kind === "head" || t.kind === "shank" || (t.kind === "shaft" && t.thread)) {
        const bolt = /shoulder bolt|axle/i.test(t.name) || /-(bolt|axle)/.test(t.group ?? "");
        t.lock = bolt ? LOCKS.bolt : LOCKS.screw;
      }
      if (t.lock && t.group) groups.set(t.group, groups.get(t.group) ?? t.lock);
    }
    // one method per fastener body
    for (const t of ctx.solids) if (t.group && groups.has(t.group) && (t.kind === "head" || t.kind === "shank" || t.kind === "shaft")) t.lock = groups.get(t.group)!;
  },
};
