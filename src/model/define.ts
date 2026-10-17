import type { MechanismModel, Role } from "./types";

const ROLES: readonly Role[] = ["driver", "link", "output", "ground", "pin", "trace"];
const KINDS = ["rotary", "oscillating", "linear", "manual"];

/** Validates a model's static structure (ids unique, input part present, roles and layers valid) and returns it. */
export function defineMechanism(m: MechanismModel): MechanismModel {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const p of m.parts) {
    if (seen.has(p.id)) problems.push(`duplicate part id "${p.id}"`);
    seen.add(p.id);
    if (!ROLES.includes(p.role)) problems.push(`part "${p.id}": unknown role "${String(p.role)}"`);
    if (!Number.isInteger(p.layer)) problems.push(`part "${p.id}": layer ${p.layer} is not an integer`);
    if (!p.fixed && !p.between && !p.at) problems.push(`part "${p.id}": no placement (fixed, between or at)`);
  }
  if (!KINDS.includes(m.input.kind)) problems.push(`unknown input kind "${String(m.input.kind)}"`);
  if (!seen.has(m.input.part)) problems.push(`input part "${m.input.part}" is not a part`);
  if (problems.length) throw new Error(`mechanism "${m.id}": ${problems.join("; ")}`);
  return m;
}
