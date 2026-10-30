// The part to watch (T18, SD30 of the style reference): the solids a record names in teaching.focus are flagged, so the
// drawing tints them in the accent. A `{ body }` entry takes the body's own part and its pieces, never the hardware or
// bearings mounted on it; a `{ body, kind }` entry takes the solids of that kind on the body (a ball screw's balls), and
// the rest of that body is flagged as their cover, drawn lighter so they show through it.
import type { Rule } from "./types";

/** What a cover never takes: the screws that hold it, which stay as they are. */
const FIXINGS = new Set(["head", "shank"]);

export const focus: Rule = {
  id: "focus",
  tier: "AUTO",
  ids: ["T18"],
  fixture: "wobble-box",
  applies: (ctx) => !!(ctx.teaching as { focus?: unknown } | undefined)?.focus,
  apply() {},
  last(ctx) {
    const entries = ((ctx.teaching as { focus?: { body: string; kind?: string }[] } | undefined)?.focus ?? []);
    for (const f of entries) {
      let hit = 0;
      for (const s of ctx.solids) {
        if (s.body !== f.body) continue;
        const own = f.kind ? s.kind === f.kind : s.role !== "hw" && s.role !== "bearing";
        if (own) {
          s.flags.focus = true;
          hit++;
        } else if (f.kind && !FIXINGS.has(s.kind)) s.flags.cover = true;
      }
      if (hit) (ctx.fired.focus ??= []).push(`${f.body}${f.kind ? `:${f.kind}` : ""} (${hit})`);
      else ctx.issues.push(`focus: ${f.body}${f.kind ? ` ${f.kind}` : ""} picks no solid`);
    }
  },
};
