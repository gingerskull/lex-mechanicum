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
src/catalog/                     record schema and vocabularies, merge, validator, views, loadCatalog / recordById
src/style/                       tokens (palettes, type, sizes), form (geometry-affecting values), draft (renderer
                                 knobs), detail (the detail ladder), kinds (solid kinds, roles, mark kinds, effects),
                                 theme (rgb resolution, font strings). One source per value; tokens.css is generated.
src/core/                        geometry, vectors, involute gears and meshing, polygon queries (poly.ts)
src/parts/                       the part family: link (stadium or tapered), plate, cap, slider, rails, slotLink, gear,
                                 ringGear, rack, disc, custom, tracer; every part may carry a plating offset (dz) and
                                 a clevis twin; heights()
src/model/                       the MechanismModel contract, defineMechanism, poseOf, sample, basePlate, checkModel
src/hardware/                    tables (bearings, screws, circlips, keys, pulleys, springs, motors) as data; the
                                 Solid type; primitives H.*; subassemblies in sub/ (housing, bridge, slide, stops,
                                 eccentric mount, drag pack, locking segment, output coupling, follower train, sensor,
                                 drive by input kind)
src/rules/                       context, classify (slots closed and open, over the cycle), one module per rule, the
                                 registry and autoTable(); stage 3 fasteners; the headroom and see-through stages; the
                                 rigid explode pass
src/assemble/                    assemble(model): rules -> polish(A, H) -> fasteners -> headroom -> see-through ->
                                 explode; the polish API; solid poses; clearance, clamp and edge-distance checks
src/package/                     the package format (pack, encode, decode), the loader, buildPackage (Node)
src/audit/                       the audit generator and the conformance report
src/render/                      canvas factory, projector, world solids, slices, session, the drafting frame,
                                 detail dial, patterns, sheet frame and title block, overlays, plot
src/mechanisms/<id>/model.ts     kinematics only
src/mechanisms/<id>/polish.ts    overrides and additions to the generated assembly
src/mechanisms/<id>/audit.md     conformance record
src/mechanisms/models.ts         id -> lazy import of the model: all the browser loads
src/mechanisms/index.ts          registry: the models plus a lazy import of each polish, for Node
site/                            Astro: layout, pages (library, one page per mechanism), components, islands
                                 (theme, filters, card, stage, engine), CSS on the generated tokens.css
tools/                           command-line tools (below)
tests/                           unit and fixture tests, per-mechanism checks, site build test, visual snapshots
```

## From model to page

1. **Model.** `src/mechanisms/<id>/model.ts` defines parts from the part family, the input kind, and `solve(u)` for
   the cycle phase u in 0..2π. Heights belong to the model too: a part plated off its layer (`dz`), a clevis plate
   twinned with its partner (`twin`), tapered links sized to their bosses. It holds no prose and no style; name, text,
   tags and links come from the catalogue record with the same id.
2. **Assemble.** `assemble(model)` runs the rules (every joint built from its type, then base, standoffs, feet,
   lubrication, timing marks, materials, drive, straddle bridges over live gear shafts), then the mechanism's
   `polish(A, H)` (only what differs), then stage 3 fasteners, then the headroom stage (a shoulder bolt head lifted on
   a shim that would meet a solid gets a shoulder ground to length), then the see-through stage (a static solid that
   hides a working zone, such as the pitch point of a mesh, is marked to be drawn see-through), then the rigid explode
   pass. The result is a list of solids: extruded outlines in body-local millimetres with z ranges, explode levels,
   detail rungs, roles, materials and joint membership.
3. **Package.** At build time, `tools/package` assembles every mechanism and writes a compact package (typed arrays)
   with the solids, traced paths, bounds, plot data and joint notes. The rules engine, the hardware library and the
   polishes never reach the browser.
4. **Render.** The renderer loads a package and the mechanism's `solve`, keeps a per-card session with its caches
   (paths, slice lists, paper tiles) and draws a frame for a given u and view (tilt, explode, overlays, detail
   position). Thumbnails, the stage, the screenshot tool and the visual tests all use this one renderer.
5. **Site.** Astro builds one static page per registered mechanism: the drawing stage, controls, at-a-glance facts,
   plot, tags, explanation, references and media. Library thumbnails are pre-rendered images; the engine loads on
   hover or navigation.

## Tools

`npx tsx tools/<name>.ts` (or the npm script in brackets):

| Tool | What it does |
|---|---|
| `catalog` (`npm run catalog`) | merges and validates the sources, writes `mechanisms.json` and the CSV and Markdown views |
| `check <id>` | kinematic checks of a model (standard Q1) |
| `clearance <id \| all>` | assembles and reports clashes, clamp faults and hole walls (Q2) |
| `package [id ...]` (`npm run package`) | writes `dist/packages/<id>.mxp` (Q3) |
| `audit <id>` (`npm run audit`) | writes or regenerates `src/mechanisms/<id>/audit.md` (Q6) |
| `conformance` (`npm run conformance`) | audited standard version per mechanism (Q7), part of `npm run check` |
| `shot <id> [options]` (`npm run shot`) | one frame to a PNG (Q4) |
| `thumbs [id ...]` (`npm run thumbs`) | the library thumbnails |
| `bench [id ...]` (`npm run bench`) | frame times per view and dial position, rung counts (Q5); `bench-page/build.ts` builds the same bench as a browser page |
| `tokens-css` (`npm run tokens`) | writes `site/styles/tokens.css` and its `@font-face` rules |
| `site-assets` (in `prebuild`) | fonts, packages and thumbnails into `site/public` |
| `lint-style` (in `npm run lint`) | colour and font literals outside `src/style`, style keys in records |
| `standard-table`, `style-table` (`npm run docs:tables`) | the generated tables of the standard and the style reference |

Node draws with **@napi-rs/canvas** (`tools/canvas-node.ts`): prebuilt for Windows and Linux, with `Path2D`,
`DOMMatrix`, pattern transforms and WOFF2 fonts (the IBM Plex faces from the `@fontsource` packages). The renderer
only sees a `CanvasFactory`, so the same code draws in the browser.

## Invariants

- Kinematics are exact and never altered by hardware, style or detail (standard K1).
- Every look value is global in `src/style`; no colour, weight or font anywhere else (standard L1, style SA).
- Rules are modules with fixture tests; the standard's AUTO table is generated from the registry.
- Depth order is kept by slicing every solid at every overlapping z boundary and painting far to near.
- The detail ladder is one data table (`src/style/detail.ts`) ordered by what a viewer notices; the mechanism is
  always packaged at full detail.
