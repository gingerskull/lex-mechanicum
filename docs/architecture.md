# Architecture

How the code is organised and how a mechanism gets from a kinematic model to a drawn page. The rules a mechanism
must meet are in `docs/mechanism-standard.md`; the look is in `docs/style-reference.md`.

## Stack

TypeScript, Vite, Astro (static site, one page per mechanism), WebGL2 for the solids with a Canvas 2D layer for the
sheet around them, Vitest for unit and headless checks, local Chrome (playwright-core) for everything that draws.
Packaging, rules, checks and audits run in Node without a DOM; drawing needs WebGL2, so shots, thumbnails, the bench
and the visual snapshots draw in local Chrome, never in Node.

## Layout and dependency direction

Dependencies point downward only; nothing below imports from above.

```
data/catalog/sources/*.json      research records (hand-edited, validated)
data/catalog/mechanisms.json     generated merge, committed; the site, tools and tests read it
src/catalog/                     record schema and vocabularies, merge, validator, views, loadCatalog / recordById
src/style/                       tokens (palettes, type, sizes), form (geometry-affecting values), draft (renderer
                                 knobs), detail (the detail ladder), kinds (solid kinds, roles, mark kinds, effects),
                                 theme (rgb resolution, font strings). One source per value; tokens.css is generated.
src/core/                        geometry, vectors, involute gears and meshing, polygon queries (poly.ts), the
                                 out-of-plane axis (axis.ts: plane mapping, world boxes), bevel, worm, helical and
                                 screw geometry (spatial.ts)
src/parts/                       the part family: link (stadium or tapered), plate, cap, slider, rails, slotLink, gear,
                                 ringGear, rack, disc, custom, tracer; every part may carry a plating offset (dz) and
                                 a clevis twin; heights()
src/model/                       the MechanismModel contract, defineMechanism, poseOf, sample, basePlate, checkModel
src/hardware/                    tables (bearings, screws, circlips, keys, pulleys, springs, motors) as data; the
                                 Solid type; primitives H.*; subassemblies in sub/ (housing, pillow block, bridge, slide and its rail seat, stops,
                                 eccentric mount, turnbuckle, drag pack, locking segment, output coupling, follower train, sensor,
                                 drive by input kind, a universal joint's cross bearings)
src/rules/                       context, classify (slots closed and open, over the cycle; pins on x or y axes; declared
                                 crossed meshes, screws, flexible members and compliant joints), one module per rule
                                 (J1 to J13), the
                                 registry and autoTable(); stage 3 fasteners; the headroom and see-through stages; the
                                 rigid explode pass
src/assemble/                    assemble(model): rules -> polish(A, H) -> fasteners -> headroom -> see-through ->
                                 explode; the polish API; solid poses; clearance, clamp and edge-distance checks
src/package/                     the package format (pack, encode, decode), the loader, buildPackage (Node)
src/audit/                       the audit generator and the conformance report
src/render/                      canvas factory, projector, world solids, slices, session, the drafting frame,
                                 detail dial, pattern tiles, sheet frame and title block, overlays, plot
src/render/gl/                   the solids on the GPU: geometry (items, once per session), plan (a frame as slice
                                 and chunk tables, pure, unit-tested in Node), shaders, the page's one shared context
src/mechanisms/<id>/model.ts     kinematics only
src/mechanisms/<id>/polish.ts    overrides and additions to the generated assembly
src/mechanisms/<id>/audit.md     conformance record
src/mechanisms/models.ts         id -> lazy import of the model: all the browser loads
src/mechanisms/index.ts          registry: the models plus a lazy import of each polish, for Node
site/                            Astro: layout, pages (library, one page per mechanism), components, islands
                                 (theme, filters, card, stage, engine), CSS on the generated tokens.css
tools/                           command-line tools (below)
site/thumbs/                     the committed card thumbnails and stage stills (WebP) and their fingerprint manifest
tests/                           unit and fixture tests, per-mechanism checks, site build test, visual snapshots;
                                 fixture scenes (tests/fixtures/scenes.ts, ids "fx-...") that `shot` and `bench` draw
```

## From model to page

1. **Model.** `src/mechanisms/<id>/model.ts` defines parts from the part family, the input kind, and `solve(u)` for
   the cycle phase u in 0..2π. Heights belong to the model too: a part plated off its layer (`dz`), a clevis plate
   twinned with its partner (`twin`), tapered links sized to their bosses. It holds no prose and no style; name, text,
   tags and links come from the catalogue record with the same id.
   A member whose axis is none of x, y, z (a universal joint's cross, a swash plate) declares `axis: "p"` and a
   `frame`: the model's `solve(u)` returns that frame (an origin and two unit directions) and the part's plane follows
   it every phase.
   A part may declare an **axis** (`axis: "x" | "y"`, z by default) with its start along it (`along`): it then stands
   out of the plan plane, a shaft in plan or a disc on edge. Its outline, its pose and the solved points that place it
   lie in the plane normal to the axis (`src/core/axis.ts`: for x the plane's (u, v) is world (y, z), for y it is
   (x, z); v is always up), and its extent along the axis takes the place of the z range. The solver still returns
   2D points; each part reads them in its own plane. Its `layer` is then only its explode level.
2. **Assemble.** `assemble(model)` runs the rules (every joint built from its type, then base, standoffs, feet,
   lubrication, timing marks, materials, drive, straddle bridges over live gear shafts), then the mechanism's
   `polish(A, H)` (only what differs), then stage 3 fasteners, then the headroom stage (a shoulder bolt head lifted on
   a shim that would meet a solid gets a shoulder ground to length), then the see-through stage (a static solid that
   hides a working zone, such as the pitch point of a mesh, is marked to be drawn see-through), then the rigid explode
   pass. The result is a list of solids: extruded outlines in body-local millimetres with z ranges, explode levels,
   detail rungs, roles, materials and joint membership. A solid carries its part's axis: its z0..z1 then run along
   that axis. The explode lifts every level along the base z, whatever the axis, so a shaft in plan rises as a whole
   (a fastener on an x or y axis stays with its level). The clearance, clamp and rule-context tests compare two
   solids on different axes by their world boxes.
3. **Package.** At build time, `tools/package` assembles every mechanism and writes a compact package (typed arrays)
   with the solids, traced paths, bounds, plot data and joint notes. A solid's axis is two flag bits (none for z, so
   a mechanism with no out-of-plane part packs exactly as before); the bounds' z range includes the world z swept by
   the x and y solids. The rules engine, the hardware library and the
   polishes never reach the browser.
4. **Render.** The renderer loads a package and the mechanism's `solve`, keeps a per-canvas session (paper tile,
   slice cuts, its geometry on the GPU) and draws a frame for a given u and view (tilt, explode, overlays, detail
   position). The paper and construction lines go on the 2D canvas; the solids are planned on the CPU as slice and
   chunk tables and drawn on the GPU in one instanced call per target (the frame and the lines layer), each chunk's op
   number written as depth so a fill or stroke covers a pixel once and the paint order holds; the result is
   composited onto the canvas, and centrelines, dimensions, traces, sheet and overlays are drawn over it. A solid on an
   x or y axis is drawn by the same items: its slice row carries the axis, the shaders map its plane to the screen
   (a y face by one affine, as a z face; an x face is edge-on) and sweep its walls along the projected axis; a y solid
   shows its low-y end, the end nearer the viewer; a posed solid's slice row carries its own local-to-screen affine. A
   member that changes shape is a stretched or deforming solid whose
   outline is made again each frame (its items rewritten in the GPU buffer in place, the point count fixed), or a
   small rigid solid carried along a closed path (a `convey` motion). Two solid modifiers change a solid along its axis: `taper` scales
   its outline toward the far end (a bevel gear's toothed frustum, a cone) and `helix` turns it by its lead (a
   helical gear); the slice row then carries the outline's pose at both ends and the walls run between them. A helix
   that would wind more than a quarter turn (a screw, a worm) keeps its outline and carries thread marks at its lead
   instead. Every
   session on a page shares one WebGL2 context; a lost context is rebuilt and the drawing redrawn. Thumbnails, the
   stage, the screenshot tool and the visual tests all use this one renderer.
5. **Site.** Astro builds one static page per registered mechanism: the drawing stage, controls, at-a-glance facts,
   plot, tags, explanation, references and media. Library thumbnails are committed images; the engine loads on hover
   or navigation. A browser without WebGL2 gets the stage's still and a one-line note; the rest of the page works.

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
| `thumbs [id ...] [--all] [--hook]` (`npm run thumbs`) | redraws the stale thumbnails and stills in `site/thumbs` and their manifest |
| `bench [id ...]` (`npm run bench`) | the browser bench: frame times per view and dial position, draw counters, package size, rung counts (Q5, DL5) |
| `compare [--shots --ref dir] [--cards] [--lose]` | the renderer's look against reference images, card drawings per dial position, the lost-context check |
| `tokens-css` (`npm run tokens`) | writes `site/styles/tokens.css` and its `@font-face` rules |
| `site-assets` (in `prebuild`) | fonts and packages into `site/public`; checks the thumbnails' fingerprints and copies them (never draws) |
| `lint-style` (in `npm run lint`) | colour and font literals outside `src/style`, style keys in records |
| `standard-table`, `style-table` (`npm run docs:tables`) | the generated tables of the standard and the style reference |

Tools that draw go through `tools/chrome.ts`: it bundles the drawing page (`tools/draw-page`), serves it with the
IBM Plex faces and the packages built from the current code, and opens it in the installed Chrome (playwright-core,
channel `chrome`, no browser download) on the real GPU with the frame-rate cap off. Frame times are measured on
paced animation frames; reading a pixel back each frame would stall Chrome's canvas and give false costs.

Thumbnails are committed: `site/thumbs/manifest.json` holds each mechanism's fingerprint (its package bytes, its
model, the renderer, the style and the thumbnail view, the source parts taken from the drawing page's bundle inputs),
so a mechanism change redraws its own images, a renderer or style change redraws all, and catalogue or site changes
none. The pre-push hook redraws what is stale; the site build only compares.

## Invariants

- Kinematics are exact and never altered by hardware, style or detail (standard K1).
- Every look value is global in `src/style`; no colour, weight or font anywhere else (standard L1, style SA).
- Rules are modules with fixture tests; the standard's AUTO table is generated from the registry.
- Depth order is kept by slicing every solid at every overlapping z boundary and painting far to near. A solid on an
  x or y axis is cut along its own axis where another solid's box meets it, and ordered among the z slices by the
  plane that separates their boxes (`depthOrder`); a frame without one is ordered exactly as before.
- Nothing draws in Node: drawing is WebGL2, in the browser or in local Chrome.
- The detail ladder is one data table (`src/style/detail.ts`) ordered by what a viewer notices; the mechanism is
  always packaged at full detail.
