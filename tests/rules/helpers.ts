// Runs rules on a fixture model and reports what one rule added.
import { createContext } from "../../src/rules/context";
import { rules } from "../../src/rules/registry";
import type { Rule, RuleContext } from "../../src/rules/types";
import type { MechanismModel } from "../../src/model/types";
import type { Solid } from "../../src/hardware/solid";

/** A context with every rule before `rule` in the registry already run. */
export function contextBefore(model: MechanismModel, rule: Rule, only?: string[]): RuleContext {
  const ctx = createContext(model);
  for (const r of rules) {
    if (r === rule) break;
    if (only && !only.includes(r.id)) continue;
    ctx.rule = r.id;
    if (r.applies(ctx)) r.apply(ctx);
  }
  return ctx;
}

/** Runs `rule` on the context and returns the solids it added. */
export function run(ctx: RuleContext, rule: Rule): Solid[] {
  ctx.rule = rule.id;
  if (rule.applies(ctx)) rule.apply(ctx);
  return (ctx.fired[rule.id] ?? []).map((id) => ctx.get(id)!).filter(Boolean);
}

/** Count of solids by kind. */
export const kinds = (list: Solid[]): Record<string, number> => {
  const m: Record<string, number> = {};
  for (const s of list) m[s.kind] = (m[s.kind] ?? 0) + 1;
  return m;
};
