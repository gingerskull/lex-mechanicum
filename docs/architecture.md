# Architecture

How the code is organised and how a mechanism gets from a kinematic model to a drawn page. The rules a mechanism
must meet are in `docs/mechanism-standard.md`; the look is in `docs/style-reference.md`.

## Stack

TypeScript, Vite, Astro (static site, one page per mechanism), Canvas 2D for the drawings, Vitest for unit and
headless checks, Playwright (local) for visual snapshots. Everything under `src/` runs in Node without a DOM: the
renderer takes a canvas factory, so checks, packaging, audit generation and benchmarks run headless.

## Layout and dependency direction

Dependencies point downward only; nothing below imports from above.

```
data/catalog/sources/*.json      research records (hand-edited, validated)
data/catalog/mechanisms.json     generated merge, committed; the site, tools and tests read it
src/style/                       tokens (palettes, type, sizes), form (geometry-affecting: base plate, chamfers,
                                 thread, fasteners, explode), draft (renderer knobs), detail (the detail ladder).
                                 One source per value; the site's tokens.css is generated from tokens.
src/core/                        geometry, vectors, kinematic helpers, involute gears, meshing
src/parts/                       the part family: link, plate, cap, slider, rails, slotLink, gear, ringGear, rack,
                                 disc, custom, tracer
src/model/                       the MechanismModel type (parts, input kind, solve, overlays), poseOf, sampling
src/hardware/                    catalogue tables as data (bearings, screws, circlips, keys, pulleys, springs);
                                 primitives H.* (stepped shafts, heads, washers, clips, dowels, springs, nipples,
                                 sensors); subassemblies (housing, bridge, slide, eccentric, stops, drag pack,
                                 belt drive, follower train)
src/rules/                       stage 1: one module per rule, a registry that runs them in order; stage 3
                                 fasteners; rigid explode
src/assemble/                    assemble(model): rules -> polish(A, H) -> fasteners -> explode; the polish API
src/package/                     build-time packaging of the assembled mechanism, and the loader
src/render/                      projector, slicing, the drafting renderer, overlays, plot, sheet frame
src/mechanisms/<id>/model.ts     kinematics only
src/mechanisms/<id>/polish.ts    overrides and additions to the generated assembly
src/mechanisms/<id>/audit.md     conformance record
src/mechanisms/index.ts          registry: id -> lazy import
site/                            Astro layouts, pages, the stage island, CSS generated from tokens
tools/                           command-line tools
tests/                           unit, per-mechanism checks, visual snapshots
```

## From model to page

1. **Model.** `src/mechanisms/<id>/model.ts` defines parts from the part family, the input kind, and `solve(u)` for
   the cycle phase u in 0..2π. It holds no prose and no style; name, text, tags and links come from the catalogue
   record with the same id.
2. **Assemble.** `assemble(model)` runs the rules (every joint built from its type, then base, standoffs, feet,
   lubrication, timing marks, materials, drive), then the mechanism's `polish(A, H)` (only what differs), then
   stage 3 fasteners, then the rigid explode pass. The result is a list of solids: extruded outlines in body-local
   millimetres with z ranges, explode levels, detail rungs, roles, materials and joint membership.
3. **Package.** At build time, `tools/package` assembles every mechanism and writes a compact package (typed arrays)
   with the solids, traced paths, bounds, plot data and joint notes. The rules engine, the hardware library and the
   polishes never reach the browser.
4. **Render.** The renderer loads a package and the mechanism's `solve`, keeps a per-card session with its caches
   (paths, slice lists, paper tiles) and draws a frame for a given u and view (tilt, explode, overlays, detail
   position). Thumbnails, the stage, the screenshot tool and the visual tests all use this one renderer.
5. **Site.** Astro builds one static page per catalogue record: the drawing stage, controls, at-a-glance facts,
   plot, tags, explanation, references and media. Library thumbnails are pre-rendered images; the engine loads on
   hover or navigation.

## Invariants

- Kinematics are exact and never altered by hardware, style or detail (standard K1).
- Every look value is global in `src/style`; no colour, weight or font anywhere else (standard L1, style SA).
- Rules are modules with fixture tests; the standard's AUTO table is generated from the registry.
- Depth order is kept by slicing every solid at every overlapping z boundary and painting far to near.
- The detail ladder is one data table (`src/style/detail.ts`) ordered by what a viewer notices; the mechanism is
  always packaged at full detail.
