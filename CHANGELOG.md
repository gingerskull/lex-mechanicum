# Changelog

## 0.6.0 — 2026-10-18

First release: four mechanisms to standard 2.0 (four-bar linkage, Geneva drive, spur gear pair, slider-crank), the
site, the tools and the docs.

- The site is published on GitHub Pages at https://gingerskull.github.io/mechanism-database/ by a workflow on merges
  to main; links, thumbnails, packages and fonts follow the deploy base path.
- The browser loads mechanism models only (`src/mechanisms/models.ts`); a site test fails if a polish, rule or
  hardware module reaches a page (R4).
- A stage smaller than its margins keeps a positive drawing scale instead of throwing on its first frame.
- README and architecture describe the release; the bench report, its gaps and the follow-ups are on the board.

## 0.5.0 — 2026-10-18

- Conformance passes to standard 2.0 for the four first mechanisms, each with its audit sheet judged `pass`: the
  four-bar (clevis rocker, coupler plated for a 1.5 mm crank pin overhang, swing scale), the Geneva drive (clevis arm,
  roller on hardened slot strips, replaceable locking segment, drag pack, lobe windows, station marks), the spur gear
  pair (both shafts straddle mounted in a bridge, backlash eccentrics at both ends of the output shaft, output flange,
  spoked gear) and the slider-crank (crosshead clevis, counterweighted crank, end stops at both ends).
- Rules: drive leads laid as cables round the input housing; shoulder bolts and axles in ISO 7379 lengths with a
  shim; keyed bores cut to the shaft; inner-race spacers capped at the inner ring on small shafts; a bridge whose
  posts stand far from its pivot is built as two filleted arms; no stops on a part that indexes; the edge check
  judges round holes only; D-flats count as torque transmission.
- Catalogue: the slider-crank text says the slider is faster in the half of the stroke farther from the crank.

## 0.4.0 — 2026-10-17

- Packages: every mechanism assembled at build time into a compressed binary package the browser loads (four-bar
  22.9 KB); the audit generator and the conformance report, part of `npm run check`; the four-bar draft audit.
- The drafting renderer: one code path for the stage, cards, screenshots and tests, in the browser and in Node
  (@napi-rs/canvas); both sheets, every tilt, explode, overlays, plot, sheet frame and title block, the detail dial;
  screenshot, thumbnail and bench tools; visual snapshots against our own baselines (local).
- The static site: library with pre-rendered thumbnails, search and facets, cards that animate on hover; one page
  per mechanism with the live stage, controls, adaptive detail, facts, plot, tags, explanation and links; theme
  switch; self-hosted IBM Plex; the version in the footer. CI builds and checks it when it changes.
- Docs: the standard's AUTO table and the style reference's Part VI are generated from the code and checked; the
  audit template matches the generator; architecture and README describe the modules and tools as built.

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
