# Changelog

## 0.44.0, Gryphonne — 2026-10-27

- Six new mechanisms, each built from its record at standard 3.11:
  - Self-reversing screw: one-way rotation drives a carriage back and forth along crossing right- and left-hand
    grooves of lead 48, three turns out and three back for a 120 mm stroke; a swivelling shoe longer than a crossing
    keeps to its own groove.
  - Wobble box: a journal machined at 20° on the input hub nods a trunnion ring on one double-row bearing, which rocks
    a perpendicular output shaft through ±20°, all four axes meeting at one point (a spherical four-bar).
  - Walking-beam transfer: a beam on two equal cranks lifts every ball off its notch, carries it one station and sets
    it down; the balls go round a closed circuit through a return lane beside the transfer, so the cycle loops with no
    jump.
  - Hobson's joint: three rods bent at 90° slide in the bores of two discs at a right angle and carry the turn round
    the corner at exactly 1:1.
  - Rack-and-pinion stroke doubler: a pinion on a carrier rolls on a held rack and drives a free rack twice the
    carrier's 80 mm stroke.
  - Chain stroke doubler: two chains anchored to the base run round a two-row sprocket on the carrier to the output and
    drive it twice the carrier's stroke, one chain for each direction.
- Engine: cam tracks of several turns and a trapezoidal law, a crossing barrel groove and a groove shoe; a spherical
  four-bar block and the oblique-journal kit; a walking-beam block, with parts handed on round a closed circuit and
  each checked against the one it replaces; an elbow-rods block and the leg-bore kit; gear-mesh rolls a pinion on a
  held rack, and a held rack is seated and dowelled on the base; a strand block and an open chain anchored at both
  ends. Every existing mechanism's package is unchanged.
- The catalogue merges the n-numbered batch files of later waves; `n1.json` holds the six records.
- A mechanism page may load up to 110 KB of JavaScript gzipped (was 100 KB): every page carries the whole kinematic
  library, now about 105 KB with the new blocks.

## 0.43.3, Agripinaa — 2026-10-27

- Tooling for batch mechanism passes. A fresh audit sheet fills the rows the rules' output or the pipeline decides
  (about a third of them), and `npm run judge` writes the rest into the sheet, one row on many sheets or a file of
  judgements at once. Conformance and clearance take the ids of the mechanisms in hand, or `changed`, and
  `npm run test:changed` runs only the tests a change touches. Each family's kinematic blocks, body shapes and contact
  kits live in files of their own, so passes on different families no longer edit the same files.
- Builds are cached per mechanism, and CI keeps the cache between runs: a pull request that changes one mechanism
  builds only that one again.
- The workflow describes how batch passes run: the readiness gate, shared work first, small passes, merges.

## 0.43.2, Agripinaa — 2026-10-27

- The original teaching review is kept in `docs/teaching-review.md`. The workflow says which work needs local
  Chrome and which runs anywhere. The look match against the hand-off proposal (style SQ2) is retired; our own
  snapshot baselines hold the look.

## 0.43.1, Agripinaa — 2026-10-25

- The library is headed Lex Mechanicum, under a Mechanism Library kicker. Its link preview fits: a shorter description,
  and a card with the name and what the site does beside the mark, at an address that changes with the card so
  services fetch the new one.

## 0.43.0, Agripinaa — 2026-10-25

- Ready for search and sharing: a sitemap and robots.txt, a canonical address on every page, and titles that carry
  the name (Lex Mechanicum · Mechanism Library; a mechanism's page is "<name> · Lex Mechanicum"). Each mechanism has
  its own social card for link previews, its drawing on the Blueprint sheet over a title block with its name, drawn
  locally and committed like the thumbnails (`npm run cards`). Pages carry structured data (a LearningResource per
  mechanism), the Search Console tag and cookie-free GoatCounter page counts, and each deploy tells IndexNow engines
  about the pages.

## 0.42.0, Triplex Phall — 2026-10-25

- Gears couple cleanly: bevel and hypoid teeth are true three-dimensional teeth on the back cone, a ring gear's
  standing up from its face, in the long-and-short proportions real ring-and-pinion sets use, set so every tooth meets
  a gap. The hypoid pair, the differential and the bevel pair mesh without parts passing through each other.
- A turning shaft, roller, disc or ball shows that it turns: faint rulings fixed to it, which fade where they would
  crowd. Stray rings on plates and discs are gone: a boss ring is engraved only round a pin.
- Traced paths no longer jump: the drawing plays on from cycle to cycle, a path is drawn whole over the cycles it takes
  to close, and the comet follows the motion; the plot shows an angle without its jump. The worm reads as a clean
  thread.
- Mechanisms fixed: the governor's links are pinned to lugs on the sleeve; the bistable beams run whole to the shuttle;
  the tackle's ropes run in their sheaves' grooves, the dead end round a thimble; the desmodromic rockers clear the cam;
  the Geneva wheel's windows stand clear of its edges; the Wankel's cover has windows over the rotor; the five-bar's
  knobs sit on their cranks; the Schmidt coupling's index arrows stay on their rings. The Ackermann linkage sits on a
  plate its own size, its construction lines ending at the edge. The trammel is worked by hand at a knob on its rod,
  both blocks riding in one cross-shaped groove plate.

## 0.41.0, Stygies — 2026-10-24

- The drawings read as solid parts: plates, brackets, mounts and pillow blocks are paper at a convincing opacity with
  stepped wall shading, and a part that covers a moving one goes see-through as a whole, faces and walls alike, as a
  tinted pane. Small hardware keeps its opacity. A pillow block on a level shaft is one casting.
- Nothing pops while the drawing turns or plays: see-through parts, role patterns and outlines fade over a range
  instead of switching, and smooth outlines glide; a local test watches for pop-ins.
- The stage: a sideways drag steps through the cycle again; a right drag, a Shift drag or two fingers orbit; keys 1 to
  5 pick the named views and 0 resets. A record that declares a plan opens at the 28 degree view. The tilt slider is
  gone; the overlay chips sit on the views' row, and a hint line under the drawing says how to handle it.
- Auto detail holds full detail on a fast machine: it measures the GPU's own time, steps down only on a sustained
  cost, and says why when it does.
- The explode reads as a disassembly: the main parts come apart one by one, supports keep their screws, bearings and
  shims, nothing is left inside another part, and the mechanism holds still while exploded. From a plan it eases to
  the 28 degree view.
- Construction lines start off. Turned on, each label is a drafting callout on its line, in the empty space beside
  the drawing, and stays put while the drawing plays; hovering one picks its line out and pulses its arrowhead, and a
  click pins it. On a phone the labels are numbered markers with a key under the stage. Equal-time ticks are short
  strokes across the path, a trace seen edge-on fades, and nothing is engraved on the base plate for a trace.
- Pages load faster: each phase is solved once, and the closure tables and the escapements' and star wheel's
  simulations ship with the page (the anchor escapement went from about 5 s to under half a second on a desktop).
- A bevel gear whose face lies nearly flat draws its teeth. Cards and stills draw at detail A-C and start the
  animation without a jump; cards carry no labels. Standard 3.10, style reference 3.8.

## 0.40.0, Ryza — 2026-10-23

- The hidden sheet is easier to wake, on a phone too. A riddle, for the curious: the switch turns at a touch, but the
  forge answers only a hand that stays, one breath to be heard, two to be kindled. The archive leaves a few more hints
  for those who search it, or lose their way in it.
- And it lives more while it is on: scanlines split warm and cool, a band of furnace light rolling down the screen,
  fringed lettering, small flickers here and there, a breathing glow, and a wider colour split on the drawing. Still
  calm under reduced motion and never more than 3 flashes a second. The Motive force line, which overflowed the
  title block on a phone, is gone. Style reference 3.7.

## 0.39.0, Metalica — 2026-10-23

- A hidden third sheet, Forge: oxide-red paper, bone ink and brass, so the drawings recolour too. Finding it plays a
  short moment (flicker, torn bands, a red and blue split, noise that settles into furnace light, and a new line in the
  title block); while it is on, the page carries fine grain, scanlines, a slow dimming, a warm vignette and a rare
  glitch pulse, and the drawing a matching post-process that goes with the paper grain on the detail dial. Calm under
  reduced motion, never more than 3 flashes a second, and the public sheets, thumbnails and snapshots are unchanged.
  How to find it is left to readers of the sixteen laws.
- The icons' fingerprint reads only the public sheets' colours. Style reference 3.6.

## 0.38.0, Lucius — 2026-10-23

- The set code is ST: sheets are numbered ST-01 to ST-89 on the cards, the mechanism pages, the library's title block
  and the drawings' DWG cell, and the library search finds a sheet by its number (an old MX-07 finds ST-07).
- The drawing sheet's frame carries a microprint between its two borders: "LEX MECHANICUM" in 8-bit ASCII, ones and
  zeros so small they read as a dotted rule. The title block gains a DATE cell with the mechanism's origin as an
  Imperial date (`800.026.M3` for 20 October 2026, years before 1 in M0), and is a little wider to hold it.
- While a drawing is paused, its input ring breathes: a 5 s cycle between 35% and full strength, redrawn 15 times a
  second; never while playing or under reduced motion.
- Every record has an `added` date, the day its sheet went live (backfilled from the git history; a test fails a drawn
  mechanism without one), and the library's New order follows it. A sheet wears a "Recovered" badge on its card and
  its page for its first 7 days, decided in the browser when the page is viewed, so it goes without a release.
- Style reference 3.5.

## 0.37.2, Graia — 2026-10-23

- The app is renamed Lex Mechanicum: the library's kicker, the footer, the site name in every page's head, the
  README, the docs and the package. The repository is now `gingerskull/lex-mechanicum` and the site moves to
  https://gingerskull.github.io/lex-mechanicum/ (the old Pages address no longer serves it). `MDB_JOBS` is now
  `LM_JOBS`.

## 0.37.1, Graia — 2026-10-23

- The checks and the site build about 5× faster, with the same packages and check results (spur-gears' gear bridge
  stands on another pair of posts): a union tree for the sweeps' outlines and the conjugate cut, hulls built only when a
  query needs them and kept across rebuilds, indexed outlines in the placement solver, each mechanism built once per
  run for its checks and its package (`dist/cache/built`), a pool of processes for conformance, clearance, the site
  assets and the thumbnails, unit tests that share their builds, and a clearance cache keyed on the checks' own code.
  Locally, conformance takes 27 s instead of 10 min and the pre-push hook 1.5 min instead of about 20.

## 0.37.0, Graia — 2026-10-22

- True 3D engine (standard 3.0, style reference 3.0): every mechanism is built from its catalogue record v3 (a `kin`
  block and a `teaching` block) through closed-form kinematic blocks checked by a loop-closure residual, a hardware
  builder (joint kits, axial stacks, a support router, a placement solver) and solids built by Manifold at build time,
  shipped as package v2 (`.mx2`). Clearance is penetration depth in 3D; the drafting renderer works by depth buffer
  with a free orthographic camera, section and detail views, traces, construction overlays and a time map.
- All 89 mechanisms rebuilt from scratch on the new engine in seven batches, the 20 still open among them; each passes
  its audit at standard 3.x with its teaching review, record, audit sheet and thumbnails.
- Rules (standard 3.1 to 3.7): wheels on stub axles; the crank-and-link drive for every oscillating input, with a gear
  step-up for a wide swing, a belt-driven carriage for a linear input and a knob for a hand-worked one; a reversing
  motor through the in-plan belt drive for a screw run back and forth; a drive on a shaft in plan placed where it
  clears the sweeps; kits for cams, screws, compliant blanks, belts, chains, ropes, CVTs, friction contacts,
  eccentrics, dies, hubs, covers, ball sockets and gears (compound, helical, herringbone, worm, spiral bevel,
  non-circular, ring on carrier rollers, cycloidal pin ring, differential spiders); the clamp check also reads probe
  phases off the profile's grid.
- Standard 3.8 groups every requirement under sixteen numbered laws, checked by a test.
- Cut-over (standard 3.9, style reference 3.4): the 2.5D engine, v1 packages, the per-mechanism models and polishes,
  the engine switch and the 3D stamp are gone. Site JavaScript drops from 185.7 to 84.9 KB gzipped, of which a
  mechanism page loads 81.9 KB; the visual baselines are redrawn by the 3D renderer.
- Site (style reference 3.1 to 3.3): a warmer README and subheading that name education; a Sort button beside
  Filters, New by default and kept in the address; "No pattern found" for an empty search and a 404 page (sheet
  ST-404); the mark split into favicon and footer mark; the sheet switch is one cog, turned on Blueprint.
- Catalogue: every record carries the mechanism's origin date.
- Releases take a codename from `data/release-names.json` through `npm run release`, shown beside the version in the
  footer; this is the first.

## 0.36.0 — 2026-10-20

- Worm drive added to standard 2.14: module 3, single start, 30:1, the worm on a shaft in plan between two pillow
  blocks in front of a bronze wheel on hub and arms; the located block takes the worm's thrust both ways, a felt
  oiler feeds the thread, the self-locking note says it is no brake.
- Helical gear pair added to standard 2.14: 17 to 34 teeth, normal module 3, 20° helix of opposite hands, on straddled
  z shafts; the axial thrust taken by opposed angular-contact bearings and thrust washers under circlips.
- Rules (standard 2.14): a shaft in plan's far pillow block stands past the parts unless a moving part's sweep outline
  meets its area, so a worm runs between two blocks; clearance between a part on z and one on an x or y axis tests the
  z outline against the other's footprint in plan where their boxes meet.

## 0.35.0 — 2026-10-20

- Flexure hinge added to standard 2.13: a circular-notch hinge cut in one 7075 blank, ±2° drawn true with the bend
  overlay, stop pins just past the swing, the block seated, clamped and dowelled, driven by a crank and link through a
  pin in the lever's tip.
- Bistable compliant mechanism added to standard 2.13: a von Mises truss cut in one acetal blank, two beams bent as
  fixed-guided curves, the shuttle snapping between ±7 mm; the pusher drives it through two preloaded springs, so it
  snaps near the force peak, at 97 % of it.
- Rules (standard 2.13): a compliant block on a seat plate of its own outline with dowels reamed through block, clamp
  plate and seat; stops placed by the swing or, for a guided body, at its travel ends; the neck one piece with its
  block and lever in the checks; a fixed part that bends is swept, not ground; an oscillating input on a compliant
  lever driven through a pin in its tip; the blank one material.
- Tests: unit tests time out at 30 s, as the rule fixtures need on the CI runner.

## 0.34.0 — 2026-10-20

- Belt drive added to standard 2.11: an HTD 8M timing belt, 24 to 48 grooves, 2:1, its teeth carried round the
  pulleys, a flanged idler on the slack span on a slotted arm, both shafts straddle mounted.
- Friction wheel drive added to standard 2.11: a rubber-tyred wheel on a hex sleeve across a ground steel disc, shifted
  along its shaft by a fork on a slide to set the ratio from 3 to -1, the disc pressed on the wheel by disc springs.
- Chain drive added to standard 2.12: an ISO 08B roller chain, 15 to 30 teeth on ISO 606 sprockets, 62 links, its
  rollers and link plates carried round, a toothed idler on the slack span, greased.
- Rules (standard 2.11): a timing belt declared as a flexible member, the idler shared by chain and belt, a bridge over
  each live shaft joined by a chain, belt or CVT, the timing pulley part `P.pulley`; the audit lists J10 to J13 among
  the joints.
- Engine (standard 2.12): posed solids honour their taper and their deforming outline, deforming outlines carry holes,
  a posed solid can reach a fixed point (a spring keeping its seat); the CVT rule names its fixed and sliding halves,
  sizes its keys from the shaft and springs only the halves that ask; `P.sprocket`, the chain conveyed on a path a
  whole number of pitches long, the idler a toothed sprocket on the rollers' line.

## 0.33.0 — 2026-10-20

- Rules: the hand fixes of the two spatial-engine pilots promoted (standard 2.10, AUTO).
  - A rotary input on a shaft in plan is motorised: a motor beside the shaft on an angle bracket, belted across it to
    a pulley on its free end, with a home flag, a fork sensor and leads to the terminal block.
  - J10 grows the base under a pillow block that stands past it, and holds a part overhung on a live shaft's free end
    by a washer and a countersunk screw.
  - Live gear shafts in a crossed mesh are straddle mounted; the bridge keeps its box clear of parts on axes in plan.
    The J2 spacer under a gear's back face stops at the J9 thrust washer.
  - Ropes: a guard over every sheave whose centre stands still, the becket and the hook at their own sheaves' heights,
    the becket on a post, the parts that carry the load counted in the note; `P.ropeSpan` and `P.ropeWrap`, the wraps
    allowed against their sheaves and spans.
  - The model check and classify read stretched parts at their solved outline.
- Bevel gear pair and block and tackle: their polishes keep only what is particular to them (spokes, notes, the fall's
  eye). The tackle builds as before. The bevel pair's base no longer grows on the side away from the drive, its motor
  pulley, bell and flanges turn, and the slots and motor screws follow the under-base drive.

## 0.32.0 — 2026-10-20

- Bevel gear pair added to standard 2.9, the first pilot of the spatial engine: the catalogue's 16:32 pair at module 4,
  Tredgold back-cone teeth on tapered gears. The wheel is on a straddled live shaft on the base. The pinion is on a
  shaft in plan in two pillow blocks behind it. Shims set the mounting distance and thrust washers sit where the mesh
  pushes. The pinion is driven by a motor beside its shaft, belted to its free end, built by hand until a rule drives a
  shaft in plan.
- Block and tackle added to standard 2.9, the first pilot of flexible members: two sheaves on each block, four parts of
  rope stretched between the sheaves, giving 4:1. The lower block runs on a slide, the fall is hauled by the linear
  belt drive, each sheave turns by the rope paid past it, and the rope has a becket, a swivel hook and guards.
- Renderer: an x or posed solid keeps its silhouettes on every slice at a reduced detail dial (they are its outline).
  `H.screw` puts a screw's shank on the screw's axis.

## 0.31.0 — 2026-10-20

- Engine: posed axes. A member whose axis is none of x, y, z (a universal joint's cross, a swash plate) is posed every
  phase by a frame from the solved state: its outline lies in that frame's plane, it is boxed in it for the checks and
  the base, the renderer draws it through one affine per slice, and the depth order places it by its world box.
- Standard 2.9: D8 and L6 cover posed axes; the shaft couplings playbook poses the cross. AUTO.
- Fixture scene: a universal joint at 30°, drawn over a full turn.

## 0.30.0 — 2026-10-20

- Engine: members that change shape over the cycle.
  - A part between two solved points can be stretched along its length (rope spans, springs).
  - Small solids can be carried along a closed path by a solved travel (chain rollers and links).
  - A few solids can take their outline from the solved state each frame (a flexspline). Their GPU items are rewritten
    in place, and the bench counts them.
  - A flexure's bend and stress zone are drawn as an overlay.
- Rules:
  - J12, flexible members: a chain carried round its sprockets with an idler on a slotted arm; a rope with becket,
    swivel and sheave guards; CVT sheaves keyed and sprung.
  - J13, compliant joints: stop pins past the swing, the blank clamped and dowelled.
- Standard 2.8: D9, J12, J13 and their playbooks, all AUTO.
- Fixture scenes: a chain on two sprockets, a rope over two sheaves, a flexure, and a deforming ring.

## 0.29.0 — 2026-10-20

- Rules for spatial joints and standard 2.7:
  - **J10, shaft in plan:** a fixed pin on an x or y axis runs in two pillow blocks (`H.pillowBlock`), each a cast housing
    on the shaft's axis on a foot screwed and dowelled to the base. A live shaft has a bearing in each block, located
    in the nearer by collars and floating in the other; a dead one is clamped, with every part on its own bearing.
    Where something sweeps past the shaft's far end, both blocks stand behind the part. The base drops under the
    shaft until the blocks fit, and a hand-turned input gets a handwheel on the free end.
  - **J9, crossed-axis mesh:** declared in the model's `meshes`; shims set each gear's mounting distance, thrust
    washers go where the mesh pushes, and timing marks are added at the mesh.
  - **J11, screw:** declared in `screws`; the thread is drawn at its lead, with a bronze or ball nut on the carriage
    (ball return, wipers) and anti-rotation from its slide or a key.
  - `H.crossBearings` for a universal joint's needle cups.
  - Joints in the plane of a pin on an x or y axis (J3, J4) build there.
  - The model check accepts J9 and J11 between axes and reports a crossed mesh on one axis.
- Standard 2.7: D8 (axis), J9 to J11, A1, A2, L6, Q1; playbooks for spatial gears, shaft couplings and screws. Every
  change is AUTO, so every mechanism stays current at its audited version.

## 0.28.0 — 2026-10-20

- Engine: two solid modifiers. `taper` scales a solid's outline toward its far end (a bevel gear, a cone);
  `helix` gives it a lead, turning its outline along the axis (a helical gear) or, where that would wind more than
  a quarter turn, drawing thread marks at the lead (a screw, a worm). The package carries both; the slice row holds the
  outline's pose at each end.
- Geometry in `src/core/spatial.ts`: bevel pitch cones and Tredgold back-cone teeth, worm and wheel, helical and
  crossed helical gears, screw lead and trapezoidal and metric threads, each checked against the catalogue's specs.
- Fixture scenes: the catalogue's bevel pair (16:32, module 4) and worm drive (module 3, 30:1).

## 0.27.0 — 2026-10-20

- Renderer: solids on an x or y axis are drawn with the z solids, at every tilt and explode. A y face is mapped to
  the screen by one affine and an x face is edge-on; walls sweep along the projected axis; outlines, hidden lines,
  silhouettes, threads and dashes follow the axis. Depth order: such a solid is cut along its own axis where another
  solid's box meets it, and placed among the z slices by the plane that separates their boxes; a drawing without
  one is ordered exactly as before. The rules leave parts on another axis to their own joints (pins, meshes, slides,
  posts, stage 3 fasteners, headroom, see-through), and the base sits under the lowest point of such a part.
- Tools: fixture scenes (`tests/fixtures/scenes.ts`) draw with `tools/shot` and `tools/bench` like mechanisms: a shaft
  in plan in two pillow blocks with a wheel and a gear, along y and along x.

## 0.26.0 — 2026-10-20

- Engine: a part and its solids may stand out of the plan plane on an x or y axis (a shaft in plan, a disc on edge),
  placed along it by `along`; the solver's points are read in the part's own plane. The model check asks an x or y
  part for its place along the axis and refuses a joint between parts of different axes that no joint type allows
  yet. The explode lifts them along the base z as a whole; the clearance, clamp and rule-context tests compare solids
  on different axes by their world boxes; the package carries the axis as flag bits and the renderer's world solids
  turn their outlines into world coordinates. Every existing package is byte-identical.

## 0.25.0 — 2026-10-20

- Library: the search, Filters and theme row spans the full layout width, the search box has a clear (x) control
  (Escape clears too), and once the bar sticks on scroll it shows the library's name and count (omitted on phones).
  A mechanism page's compact bar has the same edges as the page.
- Mechanism page: three view modes for the drawing. Wide (desktop) spans the canvas across the layout with "At a
  glance" (two thirds, its facts in a low wrapping row) and the graph side by side below it; full screen uses the Fullscreen API, and on a short landscape screen
  its controls move into a rail beside the drawing with vertical sliders. The Wide choice is remembered.

## 0.24.0 — 2026-10-20

- Anchor escapement added to standard 2.6: a 30-tooth wheel and a recoil anchor whose two pallet faces are turned 35°
  off the dead line. The wheel is found by simulation: urged forward by its train, stopped and pushed back by the
  pallets, it advances 12° per pendulum period with about 1° of recoil. The motor swings the anchor through the
  pendulum's ±3°; the pendulum is drawn shortened. An eccentric under the wheel axle sets the depth of engagement.
- Lever escapement added to standard 2.6, scaled 2x: a 15-tooth club wheel, a pallet lever with two ruby stones and a
  fork, a balance on three arms with a flat hairspring. The impulse pin is in the fork only within 20° of the balance's
  rest; the lever flips 5.1° either side and the wheel advances about 12° each beat, by the anchor's simulation.
- The oscillating drive works for a swing too small for its 22 mm lever to give a 5 mm crank: a longer lever and a
  2 mm crank. Every existing mechanism is unchanged.
- CI: the Check job may run 8 minutes (was 5); the desmodromic cam's slowest test has a 30 s limit; eslint ignores
  `.claude/`, so a lint run from a checkout with extra worktrees works.

## 0.23.0 — 2026-10-19

- Desmodromic valve cam added to standard 2.6: two lobes on one camshaft, each the envelope of its rocker's shoe so that
  the shoe is 0.1 mm from the lobe at every angle (sampled from the outlines in a test); an opening rocker on a hung
  stud pushing the stem's end, a closing rocker that is a clevis of two plates round the valve pulling a split collar
  back through hardened nose pads, the valve in two guide strips with a hardened seat; hardened rings and shoe pads.

## 0.22.0 — 2026-10-19

- Internal Geneva drive added to standard 2.6: four slots opening inward, the crank turning 270° for each 90° step of the
  wheel and resting it for 90°. The crank axis lies in the wheel's material, so the wheel is a ring carried on three flanged
  rollers and the crank hangs above it from a bridge; the wheel is two plates turning as one, the locking plate cut from the
  crank's sweep so the concave locking arcs come out of the motion, with wear strips and felts in the slots, a hardened
  locking segment on the crank and a hand knob on the roller stud (hand operated).

## 0.21.0 — 2026-10-19

- Internal gear pair added to standard 2.6: the ring gear has no hub, so it is carried on its rim by three flanged track rollers
  on dead axles, a retaining ring over each, and nothing crosses the mesh.
- Sun and planet gear added: the planet fixed to the connecting rod through a hub sleeve and four screws, the retainer
  turning on the sun shaft between the sun and a flywheel, a beam that rocks about 24° either side.
- Non-circular gears added: two elliptical gears of 26 teeth spaced equally along the pitch curve, the driven gear's speed
  swinging between 0.54 and 1.86 of the input's, four spokes in each.
- Cycloidal drive added: eleven lobes on twelve ring pins and six output pins in holes 2 mm wider, 11:1 reversing; a cycle is
  one turn of the output (eleven of the input).
- Ravigneaux gearset added (first gear, carrier held): three pinion pairs, the long pinion in two halves bolted into one gear,
  the ring carried on its rim by three rollers.
- Wankel rotary engine added: the rotor on an eccentric journal turning a third of the shaft's speed round the fixed gear,
  its apexes tracing the housing's epitrochoid, apex seals as replaceable strips.
- Star wheel and pin added: the finger pushes the star ahead of it (simulated) and the sprung jumper snaps it into the next
  detent, ten teeth.
- Cam with flat-faced follower added: cycloidal rise, dwell, return and dwell, the flat face sliding across the cam, a
  replaceable hardened track ring.
- Face groove cam added: the groove cut as a ring and an island screwed on a base disc, a track roller in the groove, no
  spring.
- Schmidt coupling added: three discs and six links joining two shafts 50 apart, the middle disc floating, the output pivot hung
  from a bridge.
- Sprag clutch added (the driving state): sixteen sprags between the races at their locking tilt, a garter spring, the outer race
  carried on a spider.
- The keyed-bore rule no longer takes a moving part's wide round hole for a keyed bore (a ring gear turning round a pin).
- Internal Geneva drive, desmodromic valve cam, anchor escapement and lever escapement are not yet built: their issues say why.

## 0.20.0 — 2026-10-19

- A ground pivot that the links below it sweep over can be carried from above: a pin marked hung in the model gets a
  stub from a bridge on two posts into the topmost part only. A pin marked free gets no bridge (a part sweeps over its
  axle), and its bearings are shielded instead of oiled. Unmarked pivots are built as before.
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
