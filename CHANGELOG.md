# Changelog

## 0.11.1 — 2026-10-18

- Licensed: the code under MIT (`LICENSE`), the catalogue, documents and drawings under Creative Commons
  Attribution-ShareAlike 4.0 (`LICENSE-CONTENT`); the README says which covers what and the site footer names both.

## 0.11.0 — 2026-10-18

- Mechanism pages: the tags move from the side column to a full-width band above the explanation, one column per
  group, so the explanation follows the stage with no empty area under it (style reference 2.2, SS5).
- Tags and the at-a-glance family, input, output and level link to the library, filtered by that value or searching
  for it; the library reads its filters and search from the address (SS3).
- The output plot no longer runs past the right edge of its panel.

## 0.10.1 — 2026-10-18

- The base plate lets a tenth of the parts under it show through, as meant in 0.7.0: the parts passing through it cut
  it into slices and each slice hid what was under it again, so nothing showed. The base now covers once, at its top
  face (paper 0.96, which keeps its look).

## 0.10.0 — 2026-10-18

- Real-world examples on every mechanism page are YouTube videos of real products and machines at work, never product
  pages, animations or renders (standard 2.3, P1, P6). The catalogue validator takes only YouTube links there and no
  longer asks for a minimum: a mechanism with no solid video shows no "In the real world" section.

## 0.9.0 — 2026-10-18

- Slide rails sit on the base on ground steel pads, one under each fixing at most 45 mm apart, a countersunk M3 down
  through rail and pad into the base at each and a Ø3 dowel through each end pad (standard 2.2, A6, F1). Nothing hangs
  under the base for them any more; on the slider-crank the motor moves in closer (belt span 83 to 47 mm).

## 0.8.0 — 2026-10-18

The hand fixes of the first four conformance passes promoted to rules and primitives (standard 2.1); the polishes
shrink to what is particular to each mechanism, and their audits are regenerated.

- Model: parts carry a plating offset (`dz`) and a clevis twin (`twin`); `P.link` takes boss radii and draws a tapered
  link. The rules build every stack on the plated heights, turn a twin with the bolt (plain hole on the shoulder),
  give each twinned plate its bearing on a ground pivot and the pair one set of stops, and put the twin on its
  partner's body. Explode levels follow the layer grid.
- J4: open slots (notches in an outline) are classified as slots, over the whole cycle and over as many cycles as an
  indexing part takes to come round; the roller, the wear strips on every slot wall and a felt in every slot end come
  from the rule. The Geneva drive's roller stud is now built by the rules.
- J2: live gear shafts with nothing sweeping over them are straddle mounted in a bridge, a floating bearing per shaft,
  the backlash eccentric at both ends. A plated part high over the base gets a thrust washer and a spacer.
- Primitives: `H.dragPack` takes the inner and outer diameter of the face it bears on; `H.lockingSegment`,
  `H.outputCoupling`, `H.spokes` and `H.filletPoly`; bore chamfers no longer repeat on a hole that has them.
- Slide end stops are shortened to clear a sweep before they are dropped; a shoulder bolt head lifted on a shim that
  would meet a solid gets a shoulder ground to length, a clear one is noted.
- The bridge post search tests only pairs that can beat the best so far, with a sign-only hit test; assembly time per
  mechanism falls from 0.6 to 1.3 s to 0.03 to 0.2 s.
- With the real outlines in the model, the rules size some pins up (A3): the four-bar's O4 axle Ø10, the Geneva
  roller stud Ø8, the slider-crank wrist pin Ø6.

## 0.7.0 — 2026-10-18

- Working zones stay in view (L5): a see-through stage after the fasteners marks every static solid that hides the
  pitch point of a mesh or the run of a slot roller, and the renderer draws it at 50 % opacity (paper and
  occlusion halved), once at its top face. The spur gear bridge now shows the mesh under it. A check in the clearance tests
  fails when a working zone is hidden.
- The base plate lets a tenth of the lines under it through.
- Stage: the forces overlay is off by default; the "Full detail" button is replaced by Auto and a Detail slider (Auto
  adapts to the frame time and the slider follows it; moving the slider sets the level by hand).
- README rewritten for visitors, with screenshots, the controls and the parts of a mechanism's page.

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
