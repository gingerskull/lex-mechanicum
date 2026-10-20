// M10: materials named on every solid, by kind and role, where nothing set one. Contact surfaces are hard: links that
// carry pins, gears, cams and rails are steel; plates and brackets aluminium; bushings and thrust washers bronze.
import type { Solid } from "../hardware/solid";
import type { Rule, RuleContext } from "./types";

function forPart(ctx: RuleContext, t: Solid): string {
  const p = ctx.parts[t.body];
  if (!p) return "Aluminium 6061-T6, anodised";
  if (ctx.model.cams?.some((c) => c.cam === p.id)) return "Steel 16MnCr5, case-hardened";
  // a timing belt's back and its pulleys (J12)
  for (const f of ctx.model.flexible ?? []) {
    if (f.form !== "belt") continue;
    if (f.band === p.id) return "Neoprene, glass-fibre cords";
    if (f.over.includes(p.id)) return "Aluminium 6061-T6, anodised";
  }
  if (p.z !== undefined || p.m !== undefined) return "Steel C45, teeth induction-hardened";
  if (p.fixed && p.role === "ground") return "Steel C45, hardened and ground";
  if (p.len !== undefined) return "Steel C45, black oxide";
  if (ctx.info.some((j) => j.kind === "slide" && j.slider.id === p.id)) return "Bronze CuSn8";
  return "Aluminium 6061-T6, anodised";
}

const BY_KIND: Partial<Record<Solid["kind"], string>> = {
  base: "Aluminium 6061-T6, bead-blasted and anodised",
  plate: "Aluminium 6061-T6, anodised",
  bracket: "Aluminium 6061, bead-blasted",
  housing: "Aluminium 6061-T6, anodised",
  bridge: "Aluminium 6061-T6, anodised",
  standoff: "Stainless steel A2",
  spacer: "Steel, hardened",
  washer: "Steel, hardened",
  sleeve: "Steel",
  shim: "Steel shim stock",
};

export const materials: Rule = {
  id: "materials",
  tier: "AUTO",
  ids: ["M10"],
  applies: () => true,
  apply(ctx) {
    for (const t of ctx.solids) {
      if (t.kind === "part" && ctx.solidOf[t.id] === t) t.mat ??= forPart(ctx, t);
      t.mat ??= BY_KIND[t.kind] ?? "Steel";
    }
  },
};
