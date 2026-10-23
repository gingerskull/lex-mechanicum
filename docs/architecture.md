# Architecture

How the code is organised and how a mechanism gets from its catalogue record to a drawn page. The rules a mechanism
must meet are in `docs/mechanism-standard.md`; the look is in `docs/style-reference.md`.

## Stack

TypeScript, Vite, Astro (static site, one page per mechanism), WebGL2 for the solids with a Canvas 2D layer for the
sheet around them, Manifold (build time only) for watertight meshes and the 3D checks, Vitest for unit and headless
checks, local Chrome (playwright-core) for everything that draws. Building, packaging, checks and audits run in Node
without a DOM; drawing needs WebGL2, so shots, thumbnails, the bench and the visual snapshots draw in local Chrome,
never in Node.

## Layout and dependency direction

Dependencies point downward only; nothing below imports from above.

```
data/catalog/sources/*.json      research records (hand-edited, validated); record v3 carries a `kin` and a `teaching` block
data/catalog/mechanisms.json     generated merge, committed; the site, tools and tests read it
data/release-names.json          the release codenames, in the order they are used (hand-edited)
data/codenames.json              the codename of each named minor release, written by the release step; the footer reads it
src/catalog/                     record schema and vocabularies (the kin and teaching blocks in kin.ts), merge, validator,
                                 views, loadCatalog / recordById
src/style/                       tokens (palettes, type, sizes), form (geometry-affecting values), draft (renderer
                                 knobs), detail (the detail ladder), kinds (solid kinds, roles, mark kinds, effects),
                                 theme (rgb resolution, font strings), forge (the hidden Forge sheet's unlock and
                                 effects). One source per value; tokens.css is generated.
src/core/                        geometry, involute and flexible-member profiles (flex.ts: HTD pulleys, ISO 606
                                 sprockets), polygon queries (poly.ts), bevel, worm, helical and screw geometry
                                 (spatial.ts), the axis type of a hardware primitive (axis.ts)
src/kin/                         the kinematic library: closed-form blocks (blocks/: linkages, gears, cams, couplings,
                                 spatial, timed, members), the composition of a record's kin block (compose.ts: drivers,
                                 solve list, bodies, numeric fallback, controls), the K1 verifier (verify.ts, the
                                 loop-closure residual) and the time map (timemap.ts)
src/hardware/                    tables (bearings, screws, circlips, keys, pulleys, springs, motors) as data; the
                                 primitive Solid type (an outline with an extent along its axis); primitives H.*; the
                                 housing bearing and the pillow block's sizes (sub/)
src/solids/                      Solid v3 (types.ts: a profile, an operation and a 3D frame), tessellation, edges, helix
                                 sweeps, conveyed and driven parts, Manifold meshes (manifold.ts, Node only), the SOLID
                                 check, quantising, the primitives lifted to Solid3 (lift.ts), and the browser setup of a
                                 package (prepare, setup and the setup worker)
src/builder/                     the hardware builder: poses (the record's composition, else the numeric solver), the
                                 placement solver (slabs per family of parallel planes), sites and kits (one per joint
                                 type: block, hardware rule, explode axis, see-through zone, rungs), the axial stack
                                 builder with its support selector, the support router against swept volumes (Manifold
                                 hulls of sampled poses, least gap), the shared parts, the polish API v3 and the rules
                                 registry that the standard's AUTO table is generated from. Bodies a joint fixes in space
                                 (a bevel gear on its cone, a universal joint's yokes and cross, a swinging cylinder and
                                 its piston, a fixed port face) are placed where the joints put them, not on a slab; their
                                 kits are cross-pin, trunnion and piston-bore beside J1 to J13, with eccentric (a sheave in
                                 its strap), hub (a part on a fixed hub), die (a die in a curved link) and the covers rule;
                                 arms.ts makes an outboard arm (a return crank on a crank pin's end) a body of its own for
                                 the build. A slider on the ground is placed lowest, clear of its rails' zone; a body's
                                 `shape.wheel` is built by the wheels rule (wheel, stub axle, upright tube)
src/package/                     package v2: the format (format2.ts: encode, decode, the joint notes and bounds), packing
                                 (pack2.ts), the build of a record (build3.ts) and of a registered mechanism with its
                                 polish (build.ts), Node
src/checks/                      the 3D checks: clash3 (A15: Manifold intersections after a box and oriented-box filter,
                                 penetration depth 2V/A against 0.1 mm, hand `allow` flagged unnecessary), clamp3 (A12, M6),
                                 record (the K checks of a record: the K1 residual, K2, branch continuity, mobility K11, the
                                 claim table T9 in claims.ts, SOLID D11), source (a record built by the hardware builder,
                                 posed by its own kin block), run (the `ci` and `full` profiles and the result cache)
src/audit/                       the audit generator (generate3.ts), the sheet reader and writer (sheet.ts) and the
                                 conformance report (conformance.ts)
src/render/                      canvas factory, detail dial, pattern tiles, the paper and its tooth (sheet.ts), plot
src/render/v3/                   the 3D drafting renderer: camera (turntable and AUX bases, named views, fit), views (record
                                 view strings, sections, details), scene (solid table: poses, explode, paper and role
                                 styles), bake (triangles and edges for the GPU), visibility (principle see-through),
                                 shaders and gpu (depth peeling, composite, analytic edges; one shared context), annotate
                                 (traces, ghosts, phantoms, overlays, centrelines, dimensions, trails, highlights), sheet
                                 (frame and title block), poser (a record's kin block as body matrices and named points),
                                 session (one canvas, redraw only on change)
src/mechanisms/index.ts          the registry: a mechanism is a catalogue record with an audit at standard 3.0 or later;
                                 allIds, loadV3 (record and polish), Node only
src/mechanisms/v3.ts             the polishes, id -> lazy import of polish3.ts
src/mechanisms/<id>/polish3.ts   the true exceptions to the builder (polish API v3); a mechanism with none has no file
src/mechanisms/<id>/audit.md     conformance record
site/                            Astro: layout, pages (library, one page per mechanism, 404), components (the stage is
                                 Stage3.astro), islands (theme, filters and the sort menu, card, stage3, the engine chunk
                                 engine3, load3, views, the Recovered badge, the Forge sheet), the library's orders
                                 (sort.ts), CSS on the generated tokens.css
tools/                           command-line tools (below)
site/thumbs/                     the committed card thumbnails and stage stills (WebP) and their fingerprint manifest
tests/                           unit and fixture tests, the record and 3D checks, site build test, visual snapshots;
                                 fixture scenes of the 3D renderer (tests/fixtures/scene3.ts, ids "fx3-...")
```

## From record to page

1. **Record.** `data/catalog/sources` holds the record v3 of a mechanism: its prose, and its `kin` block (bodies,
   joints with 3D axes, drivers, the solve list of closed-form blocks, points, outputs, parameters, design choices and
   selectors) and its `teaching` block (the principle, traces, construction overlays, default view, section and detail
   views, controls, time map, claims). `src/kin` composes the kin block into a `Kinematics`: `pose(u, controls)` solves
   every body at the cycle phase u, and the K1 verifier checks every declared joint in 3D over the cycle.
2. **Build.** `buildAssembly(record, { polish })` (src/builder) poses the bodies, places them on slabs (the placement
   solver), builds every joint from its kit with the axial stack builder, routes the supports against the swept
   volumes, runs the shared rules (base, standoffs, feet, lubrication, timing marks, materials, drive, fasteners,
   headroom, see-through, explode), then the mechanism's polish (only what differs). The result is a list of Solid3:
   a profile, an operation (extrude, revolve, sweep, loft, with features cut or added) and a frame on the body it
   rides, with explode axis, detail rung, role, material and joint membership.
3. **Package.** At build time, `buildPackage(id)` builds the record with its polish, meshes and checks every solid in
   Manifold (D11), samples the traces the teaching block names, and packs package v2: a plain solid as a profile and an
   operation, a boolean result as a quantised mesh, identical hardware once, with the joint notes, bounds and the top
   face planes the teaching layers lift points onto. The kinematic library, the builder, the hardware library and the
   polishes never reach the browser.
4. **Render.** The browser decodes the package, tessellates the shapes and finds their drafting edges (in a module
   worker on the site), bakes them into the GPU's arrays once, and poses every solid each frame from the record's kin
   block (`kinPoser`). A frame is the style's paint order: paper, base-plate construction lines, the solids peeled on
   the GPU (one shared WebGL2 context per page; a lost context is rebuilt and the drawing redrawn), centrelines,
   dimensions, paper tooth, teaching traces and overlays, the sheet, and the force, velocity and angle overlays. The
   camera is a turntable orbit that snaps to the named views, or an auxiliary view down an axis; a section hides the
   near side at draw time, a detail view magnifies a window. Thumbnails, the stage, the screenshot tool and the visual
   tests all use this one renderer.
5. **Site.** Astro builds one static page per registered mechanism (`src/mechanisms`): the stage (`Stage3.astro`,
   `islands/stage3.ts`, the engine chunk `islands/engine3.ts`) with orbit, the named views, the record's section and
   detail views and controls, the time map; the at-a-glance facts, plot, tags, explanation, references and media. The
   page ships the package v2 and a `meta` file (the record's name, teaching and kin blocks). The setup runs in a module
   worker; the shared GPU context builds its programs while the package downloads; the first frame draws at the
   coarsest dial until the page is idle. Library thumbnails are committed images; the engine loads on hover or
   navigation. A browser without WebGL2 gets the stage's still and a one-line note; the rest of the page works.

## Tools

`npx tsx tools/<name>.ts` (or the npm script in brackets):

| Tool | What it does |
|---|---|
| `catalog` (`npm run catalog`) | merges and validates the sources, writes `mechanisms.json` and the CSV and Markdown views |
| `kin-check <id \| file>` (`npm run kin-check`) | validates the kin and teaching blocks of the named records and lists the numbers in the explanation no claim mentions |
| `check <id \| all> [n] [--no-solids]` | the kinematic checks of a record (standard Q1): K1 residual, periodicity, branch continuity, mobility, the claim table, SOLID |
| `clearance <id \| all \| changed>` | clashes, clamp faults and hole walls in 3D (Q2); `--ci` samples 8 phases, the default `--full` 72 phases and audits the hand `allow` exemptions; `changed` is the pre-push selection |
| `package [id ...] [--mesh]` (`npm run package`) | writes `dist/packages/<id>.mx2` (Q3): every solid meshed and checked (SOLID), the size and the shapes per kind |
| `audit <id> [--ci]` (`npm run audit`) | writes or regenerates `src/mechanisms/<id>/audit.md` (Q6): the `teaching:` line, kit and block per joint, K1 residual, claim table, supports and the 3D clearance |
| `conformance` (`npm run conformance`) | audited standard version and check results per mechanism (Q7), part of `npm run check` |
| `shot3 <id> [options]` (`npm run shot`) | one frame to a PNG in any named view, section, detail or explode (Q4); `--set` draws the Q4 set |
| `thumbs [id ...] [--all] [--hook]` (`npm run thumbs`) | redraws the stale thumbnails and stills in `site/thumbs` and their manifest |
| `bench [id ...]` (`npm run bench`) | the browser bench (Q5, R6, R10, DL5) in local Chrome: package size, setup split into decode, tessellate, edges and GPU (and in a worker), frames per view and dial position, flags against the R6 targets |
| `bench --page` (`npm run bench:page`) | builds the bench page as a static folder (`dist/bench-page`) to publish and open on a phone |
| `bench3 [id ...]` | frame times of the 3D renderer per view, paced and with a one-pixel read-back, setup and first frame |
| `pilots3` | the acceptance shot set of the pilots and the teaching layers |
| `npm run test:e2e` (`tools/site-e2e.ts`) | builds the site, then runs the browser tests of the stage (desktop, phone, no WebGL2) and the library (sort, empty search, 404) in local Chrome |
| `compare [--shots --ref dir] [--cards] [--lose]` | the renderer's look against reference images, card drawings per dial position, the lost-context check |
| `tokens-css` (`npm run tokens`) | writes `site/styles/tokens.css` and its `@font-face` rules |
| `site-assets` (in `prebuild`) | fonts, packages and meta files into `site/public`; checks the thumbnails' fingerprints and copies them (never draws) |
| `lint-style` (in `npm run lint`) | colour and font literals outside `src/style`, style keys in records |
| `standard-table`, `style-table` (`npm run docs:tables`) | the generated tables of the standard and the style reference |
| `release minor \| patch [--date ...]` (`npm run release -- minor`) | the release step: the version bump, the CHANGELOG heading with the codename, `data/codenames.json` for the footer (`docs/workflow.md`, Versions) |

The tools that go through every mechanism (conformance, clearance, site-assets, the thumbnails' fingerprints) build each
one once per state of the sources (`src/package/built.ts`): the build gives the package and the checks alike and is
kept in `dist/cache/built` under a hash of `src/`, `data/catalog/`, the lockfile and the Node version, so the tools of
one run, the pre-push hook's included, build a mechanism once between them. They run in a pool of child processes
(`tools/pool.ts`), as many as the cores and the memory allow (a big build reaches about 2 GB); `LM_JOBS` sets the size,
and `LM_JOBS=1` runs in one process.

Tools that draw go through `tools/chrome3.ts`: it bundles the drawing page (`tools/draw3-page`), serves it with the
IBM Plex faces, the packages built from the current code and the records' teaching and kin blocks, and opens it in the
installed Chrome (playwright-core, channel `chrome`, no browser download) on the real GPU with the frame-rate cap off.
Frame times are measured on paced animation frames; reading a pixel back each frame would stall Chrome's canvas and
give false costs.

Thumbnails are committed: `site/thumbs/manifest.json` holds each mechanism's fingerprint (its package bytes, its model
(the record's kin and teaching blocks and its polish), the renderer, the style and the thumbnail view, the source parts
taken from the drawing page's bundle inputs), so a mechanism change redraws its own images, a renderer or style change
redraws all, and catalogue prose or site changes none. The pre-push hook redraws what is stale; the site build only
compares.

## Invariants

- Kinematics are exact and never altered by hardware, style or detail (standard K1): the K1 verifier checks every
  declared joint over the cycle, and the solids are posed by the same kin block.
- Every look value is global in `src/style`; no colour, weight or font anywhere else (standard L1, style SA).
- Rules are modules with fixture tests; the standard's AUTO table is generated from the builder's registry.
- Depth order is the GPU's depth buffer (depth peeling for the see-through layers); a principle part is never drawn
  out of depth order, only made see-through by what covers it (T10, T17).
- Nothing draws in Node: drawing is WebGL2, in the browser or in local Chrome.
- The detail ladder is one data table (`src/style/detail.ts`) ordered by what a viewer notices; the mechanism is
  always packaged at full detail.
