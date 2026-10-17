# Changelog

## 0.3.0 — 2026-10-17

- Style files: tokens for both sheets, form, drafting knobs and the detail ladder; `tokens.css` generated from them;
  a lint that fails on colour or font literals outside `src/style` and on style keys in mechanism records.
- Core geometry, the part family, the model contract, cycle sampling, the base plate and the kinematic checks;
  the four-bar model and `tools/check.ts`.
- Hardware tables, primitives and subassemblies; the rules engine builds every joint by type (J1 to J8), then base,
  standoffs, stops, drive by input kind with sensing and cabling, feet, lubrication, timing marks, locking and
  materials; stage 3 fasteners, the rigid explode pass, the polish API; clearance, clamp and hole-wall checks
  (`tools/clearance.ts`). The four-bar builds complete without a polish and with zero clashes.

## 0.2.0 — 2026-10-17

- Catalogue build: typed record schema, merge of batch and patch sources, validator, generated
  `data/catalog/mechanisms.json` with CSV and Markdown views (`npm run catalog`); waivers for documented research
  gaps and a real-use video for the star wheel.
- TypeScript, ESLint and Vitest set up; `npm run check`, a pre-push hook and the pull request CI workflow.

## 0.1.0 — 2026-10-17

- Repository, project board, issue templates and conventions.
- Mechanism standard 2.0, style reference, architecture and workflow documents.
- Catalogue sources imported (89 mechanisms) with the record spec.
