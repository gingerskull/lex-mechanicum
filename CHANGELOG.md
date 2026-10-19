# Changelog

## 0.20.0 — 2026-10-19

- A ground pivot that the links below it sweep over is carried from above: a stub from a bridge on two posts into the
  topmost part only. A pivot with a part sweeping over its axle gets no bridge, and its bearings are shielded instead
  of oiled.
- Hart's inversor added to standard 2.6: five planes, the ground pivot A hung from a bridge, a slotted stud to set AB.
- Rhombic drive added to standard 2.6: two geared cranks, four rods on two layers, the piston and displacer yokes on
  rails above the gears.
- Drag-link quick-return added to standard 2.6: the output crank split round a bridge, the follower below and the ram
  arm above on one keyed shaft in the bridge's bearing, the rod over everything.
- Walschaerts valve gear added to standard 2.6: the expansion link as two curved bars with hardened wear strips, a
  bronze die block, the trunnion hung from a bridge, the reverse arm on an eccentric bushing.

## 0.19.0 — 2026-10-19

- Offset slider-crank is built to standard 2.0: a slider-crank whose slide line sits 20 mm off the crank centre, stroke
  61.4 mm, time ratio 1.09:1.
- Eccentric sheave and strap is built to standard 2.0: a 12 mm eccentric disc in a strap on a bronze liner with flange
  rings, driving a valve rod block 24 mm.

## 0.18.0 — 2026-10-19

- Roberts' linkage, to the current standard: equal rockers and an isosceles coupler whose apex runs along the line
  through the pivots; the ground length is set by an eccentric bushing at one pivot.
- The Scott Russell linkage, to the current standard: a crank and a beam pinned at its midpoint, one end on a belt-driven
  slider; the other end runs exactly at right angles; the crank carries a turnbuckle.
- Evans' grasshopper, to the current standard: the Scott Russell core with a long swing link in place of the slider,
  with an eccentric bushing at the swing link's pivot.
- The belt drive of a linear input moves its idler out along the track when a ground pivot's hardware sits in the way.

## 0.17.0 — 2026-10-19

- Bell crank: an L-shaped lever turning a horizontal pull into a vertical push, on a belt-driven carriage, with a clevis lever and a slide at each rod.
- Five-bar linkage: the geared one-input version, a 22-tooth and a 28-tooth gear coupling the two cranks, the tip tracing a curve.
- Stephenson six-bar linkage: a four-bar whose coupler point drives a dyad to an output rocker, belt-driven.
- Watt six-bar linkage: two four-bars in series on a ternary rocker, the output rocker swinging about 91°.
- Klann linkage: the walking leg, its foot tracing a flat stance stroke and a lifted return.

## 0.16.0 — 2026-10-19

- Ackermann steering linkage: built to the standard (2.6), with a drive by its input kind, an audit sheet, both sheets,
  every tilt and the explode; the tie rod has a turnbuckle and the wheels' lock is engraved on the base.
- Parallelogram linkage: built to the standard; the coupler carries the exact-length turnbuckle and the follower's axle
  clears the coupler that sweeps over it.
- Antiparallelogram linkage: built to the standard; the follower hangs from a bridge so the long crank passes under it.
- Double-crank linkage: built to the standard; the output crank hangs from a bridge so the input crank passes under it.
- Double-rocker linkage: built to the standard, driven 20° to 86° inside its toggle positions.
- The antiparallelogram's record now says its cranks turn the same way, and the double-rocker's typical line gives the
  driven swing (66° in, about 31° out).

## 0.15.0 — 2026-10-19

- The sheet switch is one button with a sun or moon icon, on the library's bar beside the search and Filters and on a
  mechanism page beside its name; the "Sheet" label is gone. On a mechanism page, once the heading scrolls away, a
  compact bar shows the mechanism's name and the switch.
- "All mechanisms" is now "Back to library", and it returns to the mechanism you are on: the library shows that
  mechanism's card, with the filters and search as you left them.
- Previous and Next on a mechanism page step through what the library shows, filters and search included.
- The filter panel has a "Clear all filters" button.
- Switching the sheet on a mechanism page and going back to the library keeps the new sheet.

## 0.14.2 — 2026-10-19

- "All mechanisms" on a mechanism page returns to the library as it was left: the same filters, search and scroll
  position, as Back when the page was opened from the library, and from the tab's last library state after moving
  between mechanisms. The library's filters and search now live in its URL.
- Library thumbnails for the current sheet are fetched once the page is idle, so they no longer pop in while
  scrolling.
- Scrolling the page with a finger on the drawing no longer pauses it: only a sideways drag (which scrubs) or a tap
  (which plays or pauses) does.
- On the Drafting sheet the paper no longer turns darker at full detail: the paper grain keeps the sheet's tone, so
  dropping it (DL-A) changes only the texture.
- On a phone, the filter panel's headings sit above their chips again, not below them.

## 0.14.1 — 2026-10-18

- The stage's Auto dial no longer drops detail on a phone when the page scrolls, and no longer steps down and up:
  it asks the GPU whether the previous frame is done instead of timing the gaps between frames, which scrolling and
  a phone's changing refresh rate stretch. The stage draws nothing while it is scrolled out of view.
- Redrawing the thumbnails keeps the committed images when a redraw looks the same, so a renderer change that does
  not show no longer rewrites every image.

## 0.14.0 — 2026-10-18

- The drawings are drawn with WebGL2 in place of Canvas 2D: a full-detail frame takes 1.4–3.6 ms on desktop for
  every mechanism and view, against 23–62 ms before on the mechanisms compared, with the look held. One GPU context
  per page is shared by the stage and the cards; a lost context is rebuilt and the drawing comes back. Lines get
  round joins and caps, hidden line dashes keep their length at any tilt, and silhouettes run down each part's far
  left and right.
- Standard 2.6: the pixel ratio cap moves from DL-C to DL-G, the last rung the Auto dial reaches. The Auto dial also
  steps down when frames miss the display's rate.
- Library cards draw at dial B, sharp and with wall shading; only the last three hovered cards keep a live drawing,
  so memory stays flat, and off-screen cards cost no layout or paint.
- A browser without WebGL2 shows a large still of the drawing with a note; the rest of the page works.
- Thumbnails are committed as WebP with fingerprints of what they are drawn from; the site build checks them and
  never draws. Shots, thumbnails, the bench and the visual snapshots draw in local Chrome; the bench is the browser
  bench, with draw counters.

## 0.13.1 — 2026-10-18

- Library cards on touch screens: a tap or a scroll that touches a card while its animation plays no longer restarts
  it from the first frame. One card animates at a time; a tap on another card or on the page stops it. With a mouse,
  hover still starts it from the thumbnail's pose and leaving stops it.


## 0.13.0 — 2026-10-18

- Standard 2.5 (F7, HAND): `H.turnbuckle`, an adjuster for a moving link. It cuts the link across, joins the halves with
  a left- and a right-hand stud, a flat body and a jam nut on each stud, all inside the link's own plane, set at the
  model's length with the drawn length exact. Hoekens, the pantograph and Jansen use it (Jansen's hand-built one is
  replaced); Hoekens and the pantograph now pass F7. The other audits were re-checked for F7 and moved to 2.5; the
  trammel and the locomotive drive defer it for their next pass.
- Pantograph: the elbow arm's front plate is a strap from A to M2, so the adjuster is in view.


## 0.12.3 — 2026-10-18

- Spur gear pair: the forces overlay no longer draws the line-of-action arrow (it ran the full length between the base
  circles and was labelled push / pull, which a gear tooth is not); the spin arrows and the 20° pressure angle stay.
- Library cards: the hover animation draws at detail D and always restarts from the thumbnail's pose; the bold plate
  and base outlines are drawn thinner on cards (style value `DRAFT.card`), and the thumbnails use the same view.
- Library page on phones: the set title block is one low strip across the header (shown at every width), and the
  bar is two rows, search and Filters on the first and the sheet switch alone on the second (SS2, SS3).


## 0.12.2 — 2026-10-18

- Standard 2.4: a linear guide is a few blocks. Each slide is now two rails on one riser each, a bronze gib clamped
  under the keeper (no separate shim, set screws or lock nuts), a screwed end block with a neoprene pad at each end,
  a wiper at each end of the slider and one nipple; half to two thirds of the parts it had. The hand-built guides of
  the rack and pinion and the trammel follow the same layout.
- The stops and the linear drive grow the base for what they add (posts, tensioner, sensor), and the linear drive
  lengthens its carriage slot, seats the carriage on the belt and adds the fork sensor, so three polishes lose their
  hand fixes.


## 0.12.1 — 2026-10-18

- Trammel of Archimedes: one cross-shaped groove plate; the crank and rod turn under it and only the blocks run in the
  grooves, so nothing crosses where it cannot.
- Oscillating cylinder: the cover plate is see-through so the piston and rod read; the base grows to hold the stop
  posts.
- Toggle clamp: closes against a fixed work-piece, which is also the forward stop.
- Whitworth: the rails start where the ram's left end reaches, so the ram stays on them over the whole stroke.
- Locomotive driving gear: the base grows to hold the drive's tensioner arm.
- Ratchet and pawl: the wheel turns continuously over any number of loops (it jumped back one pitch at each loop
  point, which also made the spokes hop). A new model check compares five loops: every point must repeat and no
  part may jump at a loop point.
- Planetary: the F9 timing mark of an internal mesh was drawn on the wrong side and orbited the canvas; fixed in the
  mesh classifier. Geneva: the bore-entry ring is only drawn on round holes, so the wheel windows lose their faint
  circle.


## 0.12.0 — 2026-10-18

- Twenty-two more mechanisms built to standard 2.3 through the conformance pass: cam and roller follower, Chebyshev,
  crank and slotted lever, Trammel of Archimedes, compound gear train, Hoekens, intermittent gear, Jansen, locomotive
  driving gear, Oldham coupling, oscillating cylinder, pantograph, Peaucellier-Lipkin, planetary, rack and pinion,
  ratchet and pawl, scissor lift, Scotch yoke, toggle clamp, Tusi couple, Watt and Whitworth. Each has its audit sheet,
  8 visual baselines and a joints table. Hoekens and the pantograph stay open on F7 (no adjuster fits their free
  pins yet).
- Catalogue: real-world and media links checked, one dead link replaced; the Scotch yoke rod span, the scissor lift
  platform length and ratio text, the trammel groove cut-back and a few explanations were corrected to the built model.
- Fix: two arms swinging on one pivot get their own stop ids; the oscillating drive lever is wider so its wall round
  the shaft bore meets the minimum.


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
