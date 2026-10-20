# Mechanism standard

```
version: 2.7
date: 2026-10-20
supersedes: 1.0 (the hand-off standard of 2026-10-16)
```

This is the one document that says what every mechanism in the library must be: its record and page content, its
kinematic model, its part design, how it is built as a physical assembly, the mechanical detail it carries, its
drive, how it is drawn, and how its detail is scaled for performance. Where this document and the code disagree on
a rule, the document wins and the code is the bug. Where they disagree on a value (a size, a weight), the code's
style or hardware table wins and the document is updated.

**The ideal is a watch movement.** Every screw, jewel, spring, bridge and pin in a movement exists because something
must be located, held, carried, limited, adjusted, oiled, timed or protected. A mechanism here is complete when it
would really work on a bench: not when it looks finished. Nothing is decorative; the big parts stay plain; the
richness is in what makes the mechanism move and hold together.

**One procedure for everything.** There is no separate "new mechanism" and "upgrade" workflow. An agent given a
mechanism runs a **conformance pass** (section 1): generate the audit, fix what fails, verify, record. A mechanism
that does not exist yet is one that fails everything, and the first fix is to create its model from the catalogue.

**Two kinds of rule.** Most requirements are met by code: the rules engine builds every joint from its type
(section 5b), stage 3 adds fasteners, the style is global. The rest depend on the particular mechanism's loads,
sweeps and geometry and can only be decided by hand. Every requirement says which it is. Automatic does not mean
unchecked: the audit confirms the rule fired and did the right thing for this mechanism.

| Tier | Meaning | What the agent does |
|---|---|---|
| **AUTO** | Done by the rules engine (`src/rules`), the hardware primitives (`src/hardware`), stage 3, the packager or the renderer, for every mechanism. | Verify it fired and fits. Never re-implement it by hand. If it is wrong for this mechanism, override it in the polish and say why in the audit. |
| **HAND** | Depends on this mechanism. No rule can decide it. | Decide and build it per the standard. This is the craft. |
| **STYLE** | Global look, `src/style` only. | Never set per mechanism. Report a problem; do not patch it locally. |
| **DATA** | Catalogue content (`data/catalog`). | Fill or correct the catalogue record; the page and the model read it by id. |
| **SITE** | Page or app behaviour shared by all mechanisms. | Report if failing; fix in the site, not in a record. |
| **FLAG** | Measured and reported, never pass or fail. | Note it in the audit; look at it when convenient. |

A requirement marked AUTO whose rule does not exist yet in the code is audited as **AUTO-TODO**: apply it by hand in
the polish, mark it in the audit, and list it under promotion candidates. The rule gets written as its own change
(section 0).

**Promotion.** When the same hand fix appears in three mechanisms, or a joint type recurs, it becomes a rule module
or an `H.*` primitive with a fixture test, then every mechanism's checks are rerun. That is a change of its own, never
folded into a mechanism's conformance pass.

Requirement ids (P1, K2, A9, J3, DL2 ...) are stable: audits, notes, issues and commit messages refer to them.

---

## 0. Versioning and conformance

| Id | Requirement | Tier |
|---|---|---|
| S1 | This document carries a `version` header and a changelog. Every changelog entry names the requirement ids it touches and its tier: **AUTO** or **STYLE** (code; every mechanism picks it up on rebuild), **HAND** (a mechanism meets it only when re-polished), **DATA**, **SITE**. | DATA |
| S2 | Every mechanism's audit sheet (`src/mechanisms/<id>/audit.md`) starts with a header: `standard: <version>`, `date`, `result: pass | open`, `detail: full | <rung>`. It is the only per-mechanism record of conformance. | HAND |
| S3 | `tools/conformance` reads every audit header and this changelog and reports, per mechanism: the audited version, the HAND changes since, the current check results (K, A15, A12). It runs as a test: a mechanism behind a HAND change fails until its audit is redone or the item is deferred in the report with a reason. AUTO and STYLE changes never require a re-audit; they rerun every mechanism's checks. | AUTO |
| S4 | Board issues hold mechanism-specific decisions and open items only, pointing at requirement ids. No requirement text, style values or rule descriptions live in issues. | SITE |

---

## 1. The conformance pass

Run this for any mechanism, whatever state it is in.

1. **Locate.** `src/mechanisms/<id>/`: `model.ts` (kinematics), `polish.ts` (overrides and additions), `audit.md`.
   If the folder does not exist, create the model from the catalogue entry (`data/catalog/mechanisms.json`, field
   `build`: members, joints, params, defining relations, range, overlays, input). Start from the nearest existing
   mechanism in the same family. Register nothing: the registry reads the folder.
2. **Generate the audit.** `tools/audit <id>` assembles the mechanism and writes `audit.md` from the template
   (section 11): one row per requirement with the evidence the tool can collect (check results, clearance, solid
   lists, sizes), and the ten-function table per joint filled from the assembly (which component serves each
   function, or "none"). Rows the tool cannot judge are left `?`.
3. **Judge.** Replace every `?` with PASS, FAIL or N/A and one line of evidence or reason. For section 6 go through
   every joint and every part.
4. **Fix, in this order:** DATA and kinematics (P, K) → assembly structure (A, J) → explode (E) → part design (D) →
   functional completeness (F) → manufacturing evidence (M) → drive (V) → detail levels (DL) → reuse and
   performance (R). STYLE and SITE items are reported, not fixed in the record. Everything that is not global and not
   deferred with a reason gets fixed.
5. **Verify** (section 10): every tool clean, screenshots at plan, 28°, side view and full explode in both sheets,
   bench run.
6. **Record.** Regenerate the audit (the tool keeps judged rows), finish it, set the header. List promotion candidates.

---

## 2. Record and page content (P)

Source of truth for facts: the master catalogue (`data/catalog`, schema and vocabularies in
`data/catalog/record-spec.md`). A mechanism in the code is a folder; its prose, tags, references and media come
from the catalogue entry with the same id.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| P1 | The catalogue has a complete record for the id: `name, aka, family, level, summary, motion, ratio, dof, topology, backdrivable, tags, explain {motion, forces, benefits, limits}, build, examples, references, media`, and `real_world` (YouTube videos of real footage; may be empty). The folder has `model.ts`, `polish.ts`, `audit.md`. | DATA | `tools/check <id>` prints no `MISSING` |
| P2 | Facets use the controlled vocabularies of the record spec, exact spelling. | DATA | catalogue validator |
| P3 | **At a glance:** ratio (kind, class, typical), axis relation, output character, backdrivable, other names, plus family, motion, level, dof, and the drive (motorised or hand operated, section 8). | DATA / SITE | page |
| P4 | **Tags grouped** into Function, Property and Application, keywords underneath. | DATA | page |
| P5 | **Explanation:** how it moves, forces, benefits, limits; then where you'll find it: 2 to 4 real-world uses, each with one line. | DATA | page |
| P6 | **Links:** references (Wikipedia plus at least one hard source) and photos and video (at least one video of the real thing, one photo page). In the real world: YouTube videos of real products or machines at work, never animations or renders; none rather than a wrong one. Only URLs that were actually found. | DATA | page |
| P7 | The page reads the catalogue by id at build time. No prose in `model.ts` or `polish.ts`. | SITE / HAND | lint: no text fields in records |
| P8 | **Not on the page:** no parts list, no "how it is built" section, no joint sections. | SITE | page |
| P9 | Explanation text matches what the code does (dwell, ratio, swing, stroke). | HAND | read `explain` against `solve()` and the plot |
| P10 | Overlays are meaningful for this mechanism: traced `paths` (first gets the comet), `vel`, `forces`, `angles`, `plot` of output against input. | HAND | screenshots with overlays |
| P11 | Prose: plain language, short sentences, no em dashes, mm and degrees. | DATA | read |

Joint notes, badges and build rules (A16) are still written: they are the engineering record the audit reads and
they explain the build to the next agent. They are not shown on the page.

---

## 3. Kinematic model (K)

The animated model is the truth. Everything else is built around it and may never change it.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| K1 | **Kinematics exact.** Pin centres, link lengths, slot widths, gear meshes, cam and locking profiles come from `model.ts`. Styling, hardware and detail never alter a working surface or a centre. Layers and thicknesses may change; geometry may not. | HAND | diff of model geometry; `check` link error ~0 |
| K2 | `solve(u)`: u is 0..2π per cycle, continuous, periodic, finite. Oscillating inputs use `osc(lo, hi)(u)`. | HAND | `check`: no NaN, periodicity none, no `POSE JUMP` |
| K3 | Parts only from the part family (link, plate, cap, slider, rails, slotLink, gear, ringGear, rack, disc, custom, tracer). Placement by `fixed`, `between`, `at` or `poses`. | HAND | typecheck |
| K4 | Roles `driver, link, output, ground, pin, trace`. The input shaft cap has `accent: true`, the only colour accent in the drawing. | HAND | code |
| K5 | Layers integer, 10 mm apart, 6 mm thick; parts that cross are on different layers; a pin's `layer` is the lowest it joins and `span` the layers it passes. Ground pivots layer −1, radius 7; moving pins radius 5.5. | HAND | `check`: no `INTERFERE`, `OVERLAP`, `WARN` |
| K6 | Dimensions and defining relations agree with the catalogue build spec (Geneva c = r / sin(π/n), Grashof, Hoekens ratios); where the site deliberately differs, a code comment says so. | DATA | compare |
| K7 | **Input kind declared:** `input: "rotary" | "oscillating" | "linear" | "manual"`, with the input part named. The drive rule (section 8) and the stop rule (F5) read it. | HAND | typecheck |

---

## 4. Part design language (D)

Minimal, monochrome industrial design: parts that look as if a careful company designed and sold them. One family of
forms, reused everywhere.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| D1 | **One element, one form, everywhere.** Link: tapered stadium sized to its bearings, engraved boss rings. Pivot: flush cap, ground larger. Slider and rail: link profile with square ends on two thin stadium rails. Slot link: stadium slot with walls as wide as the end radius. Gear: true involute teeth, plain web or hub and arms, keyed bore. Cam: profile with one engraved base circle, roller follower. Base plate: squircle slab, paths engraved, corner holes. Tapered links are part of the part family (`P.link` with boss radii), so the rules see the real outline. | HAND | screenshot against other mechanisms |
| D2 | Shapes follow load: material where the load runs, bosses round every pin, lightening windows only on big plates and inertia-critical parts. | HAND | review |
| D3 | Roles told apart by surface pattern and tone, never hue. | STYLE | theme switch |
| D4 | Consistent radii: base-plate corners from the form style; feet and corner standoffs concentric with the corner arcs. | AUTO | screenshot |
| D5 | **Solid, designed mounts** over scattered standoffs: one bracket, bridge or post pair, shaped as a part. | HAND (shape) / AUTO (`H.bridge`) | review |
| D6 | **Nothing cosmetic distracts.** Supporting elements read quieter than the mechanism but stay clearly visible. | HAND + STYLE | screenshots |
| D8 | **Axis.** A part lies on the base plane (axis z, the default) or stands out of it on an x or y axis of the base: a shaft in plan, a disc on edge, a bevel pinion, a worm, a screw. Such a part declares `axis` and `along` (where it starts along the axis); its outline, its pose and the solved points that place it lie in the plane normal to the axis, and its extent along the axis takes the place of the z range. Joints between parts on different axes are only those that allow it (J9, J11), declared in the model (`meshes`, `screws`). Solid modifiers give the forms along the axis: `taper` (a bevel gear's frustum, a cone) and `helix` (a helical gear's teeth, a screw's thread, at its lead). | AUTO (z by default; `tools/check` reports `AXIS`) / HAND (where a mechanism needs an axis) | `tools/check` |
| D7 | **The big parts stay plain.** Bars, plates, wheels, brackets and the base carry only load-driven shape (D2) and manufacturing evidence (section 7). All richness is in what makes the mechanism move and hold: shafts, bearings, clips, spacers, keys, screws, nuts, springs, stops, adjusters, oilers, marks, sensors. | HAND | review |

---

## 5. Assembly: how it is built (A)

Every mechanism is drawn as the bench assembly it would really be. Three stages: the rules, the hand polish, the
fasteners; then the rigid explode pass.

### 5.1 Stage 1: the rules (AUTO)

The rules engine reads the kinematic model once (which parts each pin joins, in what order up the stack, which parts
slide in which slots, which gears mesh) and builds every joint from its type (section 5b). Then the base, standoffs,
feet, lubrication, timing marks, materials and the drive.

| Id | Rule | Tier |
|---|---|---|
| A1 | Every joint is classified by type (J1 to J11) from the model: fixed or moving pin, keyed or bored part, slot (closed, or open at the rim), slide, mesh, cam contact, belt, a pin on an x or y axis, a declared crossed-axis mesh or screw. Slots are found over the whole cycle, and over as many cycles as an indexing part takes to come round, so an intermittent contact is seen whatever the assembly phase. The canonical build of that type is generated in full. | AUTO |
| A2 | A fixed pin that drives (the accent input, or a fixed pin with a keyed part) is a **live shaft** (J2); any other fixed pin is a **dead axle** (J1); a moving pin is a **shoulder bolt** joint (J3); a pin in a slot carries a **track roller** (J4); rails carry a **slide** (J5); meshing gears get **mesh hardware** (J6); a cam gets its **follower train** (J7). A fixed pin on an x or y axis is a **shaft in plan** (J10), live or dead; a moving one is built in its own plane like any J3 or J4; a declared crossed-axis mesh gets **J9** and a declared screw **J11**. | AUTO |
| A3 | **Catalogue sizing:** bore = largest catalogue bore every boss on the joint can take; each part gets the largest bearing its boss fits with a 1.2 mm wall, else a bronze bushing; gaps get inner-race spacers. | AUTO |
| A4 | **Shafts are stepped profiles** (`H.shaft`): shoulders at every seat, circlip grooves, set-screw flats, thread with undercut, chamfered ends, wrench flats where tightened without a head, centre holes on turned ends. | AUTO |
| A5 | **Keys by shaft size:** D-flat to Ø8; feather key and keyway above Ø8; taper pin on cross-pinned small parts. Every keyed part gets the matching bore. | AUTO |
| A6 | Fixed plates floating above the base sit on Ø10 **standoffs**, screwed from both sides; **spigoted** when the plate holds a bearing. A slide rail sits on the base on a **ground steel riser** along its straight run, split into pads on the free runs where a moving part passes under the rail; a countersunk screw at each fixing, near each end of a riser and at most 100 mm apart, down through rail and riser into the base; the reference rail of the slide dowelled by its end screws (F1). | AUTO |
| A7 | **Base plate** 8 mm thick, 2 mm under the lowest part, four counterbored mounting holes on the corner-arc centres, rubber feet unless a housing hangs there, traced paths engraved, 5 mm engraved scale along the front edge, a clearance hole for every live shaft. | AUTO |
| A8 | **Stage 3 fasteners** (after the polish): every head gets its threaded shank from `thread` (never along a shoulder), including heads seated over a pre-drilled hole or in a counterbore; every plate a shank passes gets a clearance hole, tapped where it ends; blind tapped holes are marks, not through holes; two screws meeting in a standoff stop short of the middle. | AUTO |

The rules run in registry order (`src/rules/registry.ts`). Which rule or stage serves which AUTO requirement,
generated from `autoTable()` by `tools/standard-table.ts`:

<!-- auto-table:start (generated, do not edit) -->
| Rule or stage | Serves |
|---|---|
| `classify` | A1, A2, A3 |
| `base` | A7, D4, M4 |
| `j6-mesh` | J6, F7 |
| `j2-live-shaft` | J2, A5, F1, F2, F3, F4 |
| `j10-shaft-in-plan` | J10, A5, F1, F2, F3, F4 |
| `j9-crossed-mesh` | J9, F4, F7, F9 |
| `j11-screw` | J11, F3, F8 |
| `j3-moving-pin` | J3, A12, M3 |
| `j4-slot-roller` | J4, M14 |
| `j5-slide` | J5, F5, F7 |
| `j7-cam` | J7, F6 |
| `j1-dead-axle` | J1, A4, A11, M8, M9, M11 |
| `stops` | F5 |
| `standoffs` | A6 |
| `drive` | V1, V2, V3, V5, V6, F10 |
| `j8-belt` | J8, V4 |
| `j2-straddle` | A9, J2 |
| `feet` | A7, D4 |
| `lubrication` | F8 |
| `timing-marks` | F9 |
| `locking` | M13 |
| `materials` | M10 |
| `fasteners (stage 3)` | A8, M4 |
| `headroom` | A13 |
| `see-through` | L5 |
| `explode` | E1, E2, E3, E5, E6, E7, E8 |
| `hardware primitives` | A13, M1, M3, M5, M11, R3 |
| `checks (clearance, clamp, edge distance)` | A12, A15, M6 |
<!-- auto-table:end -->

### 5.2 Stage 2: hand polish (HAND, mandatory for every mechanism)

The rules know nothing about loads or sweeps. The polish (`polish.ts`, API `A` and `H`) states only what differs
from the generated assembly: overrides, variant choices, additions, notes. It never re-describes a joint. It must
meet:

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| A9 | **Double shear wherever the sweeps allow** (clevis pairs, a bridge over a ground pivot, a fork end). Single shear only where a part sweeps over the joint, then with the shortest overhang (1 to 1.5 mm) and two bearings far apart. A clevis is declared in the model (a part's `twin`, plating with `dz`); a live gear shaft with nothing over it is straddle mounted by the rules. | HAND (choice) / AUTO (clevis twin, plating, straddle J2) | joint note + badge |
| A10 | **Balanced stack:** parts whose sweeps never meet share one plane; nothing is stacked only to clear something. | HAND | side view |
| A11 | **Load path closed:** for every joint you can say where its load goes to ground (bolt → bearing → housing → base). Both ends of a dead axle held. Every housing and bridge screwed and dowelled. | HAND (choice) / AUTO (parts) | joint note |
| A12 | **Bearings clamped through inner-race spacers**, so tightening never squeezes a moving part. A rotating stack never touches a ground face. | AUTO (spacers) / AUTO check | `tools/check` clamp check |
| A13 | **Named hardware** with real catalogue sizes ("Shoulder bolt Ø6 x 15, M5", "Bearing 6900-2RS (10x22x6)") and materials (M10). | AUTO (defaults) / HAND (variants) | names in the solid list |
| A14 | **Sweep clearance:** posts, standoffs, brackets, stops, sensors and every added detail clear of every moving part's sweep; state the margin in the note. | HAND | `tools/clearance` |
| A15 | **Zero clashes** over the full cycle. | AUTO check | `tools/clearance <id>` = 0 |
| A16 | **Engineering record:** a joint note for every joint saying why it is built that way, a badge (`["double shear","ok"]`, `["single shear","warn"]`, `["both ends held","ok"]`), and 3 to 5 build rules specific to this mechanism. Not on the page (P8). | HAND | code |
| A17 | **Assemblable and serviceable:** there is an order in which it goes together; every fastener can be reached by a tool when assembled; every pressed bearing can be pulled; nothing is trapped. | HAND | walk the explode |

### 5a. Explode (E)

The explode view pulls the assembly apart along the pin axes, in the order a fitter would take it apart, every part
whole, every screw out of its hole as one piece. Explode is encoded per solid as a stack level; the renderer moves a
level by a fixed gap at full explode.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| E1 | **Nothing stretches.** Every solid is rigid: one explode level. Shafts, bolts, axles, shanks and standoffs included. | AUTO | explode at 100%: no part longer than at 0% |
| E2 | **A fastener is one body.** Head, shank, the washer under the head and the nut on the far end move together. | AUTO | each head stays on its shank |
| E3 | **Screws back out the way they went in**, along their axis, to the head side, half a level clear of the topmost part they pass. A nut goes the opposite way. | AUTO | explode |
| E4 | **Reverse assembly order:** the last part fitted goes furthest; a bridge and its screws come off before the parts they clamp. | HAND (levels follow A17) | walk the explode |
| E5 | **Pressed and bonded parts stay put:** bearings, bushings, dowels, inserts, circlips and wear strips move with the part they sit in; track rollers stay on their stud. | AUTO | explode |
| E6 | **Bought units stay whole:** motor, bearing, track roller, sensor, pulley pair. Motor and bracket move as one; the belt stays in the pulley plane. | AUTO | explode |
| E7 | **Loose spacers and washers sit midway** between the parts they separate. | AUTO | explode |
| E8 | **Keyed parts on one shaft keep their order**; the shaft leaves to the side it was fitted from. | AUTO | explode |
| E9 | **Readable at full explode:** nothing inside another part, labels attached, nothing leaves the frame. | HAND | screenshots at 100%, 28° and 70° |

### 5b. Joint-type catalogue (J)

The canonical full build per joint kind. The rules generate it; the polish picks variants (open or sealed, key or
D-flat, clevis or single, which side the bridge goes) and overrides what the sweeps forbid. A joint is not done until
every line of its row exists or is marked N/A with a reason in the audit.

| Id | Joint kind | Canonical build |
|---|---|---|
| J1 | **Ground revolute, dead axle** | Shouldered axle (A4); a bearing in every turning part; inner-race spacers; circlip or retainer plate on both sides of each bearing (F2); thrust washer against the base (F4); bridge over the top on spigoted posts, dowelled (F1); axle through the base to a washer and nyloc, or threaded with an undercut where the base is thick enough (M9); oil sink on the bridge over an open bearing (F8). |
| J2 | **Ground revolute, live shaft** | Housing cartridge behind the base: two bearings, spacer sleeve, wave-washer preload, circlips, shield or seal (F2, F4); housing screwed and dowelled to the base (F1, A11); keyed shaft (A5) with pulley on a hub with two set screws at 90° or a clamp hub (F3); end retainer on the shaft end (F2); thrust washer under the first part (F4); home flag on the pulley or shaft (F10); clearance hole in the base (A7). A gear shaft with nothing sweeping over it is straddle mounted: a bridge over the shafts of the mesh, a floating flanged bearing in it per shaft, the backlash eccentric at the top as well as the bottom (A9, F7). |
| J3 | **Moving revolute** (pin between links) | Shoulder bolt threaded into the lowest part, bearing in every other part, inner-race spacers, threadlocker or nyloc (M13), clevis where the sweeps allow (A9), bore chamfers (M3). |
| J4 | **Pin in slot** | Track roller on a stud; hardened wear strips screwed into the walls of every slot the roller runs in (M14); felt oiler per slot, in the relieved end where the roller leaves room (F8); relief at the slot ends. |
| J5 | **Prismatic slide** | A few blocks. One rail is the plain reference, dowelled (F1); on the other a bronze gib bears on the slider's side and a keeper plate over it laps the slider (F2); the gib is slotted, set across against the slider and clamped by the keeper's screws, which are the rail's own fixing screws, down through keeper, gib, rail and riser (F7, A6, M13). A felt wiper at each end of the slider, a grease nipple on the keeper (F8); one end stop block with a neoprene pad just past each end of the travel (F5). No separate shim, gib adjusting screws or lock nuts. |
| J6 | **Gear mesh** | Hubs with key or D-flat and set screw (F3); eccentric bushing with flange, arc slots and clamp screws on one shaft for backlash (F7); timing marks at the mesh (F9); thrust washers and retaining rings on each shaft (F2, F4). |
| J7 | **Cam contact** | Roller follower on a stud; return spring with seat, guide and preload screw, or form closure (F6); follower guide bushing with circlip (F2); anti-rotation key on flat followers (F3); felt oiler on the track (F8); zero line (F9); hardened cam (M10). |
| J8 | **Belt** | Flanged small pulley (F10); slotted mount for tension (F7); idler on a slotted arm where the wrap is short; belt guard only if see-through. |
| J9 | **Crossed-axis mesh** (bevel, hypoid, worm, crossed helical; declared in `meshes`) | Each gear keyed on its shaft (J2 or J10) and located on it (F2); a shim pack at its back face sets its mounting distance, and so the backlash and the contact pattern (F7); a bronze thrust washer wherever the mesh pushes along a shaft: toward a bevel or hypoid gear's back face (away from the apex), both ways on a worm and on crossed helical gears (F4); timing marks at the mesh (F9). Pitch cones, the back-cone teeth (Tredgold), lead and lead angle from `src/core/spatial.ts`. |
| J10 | **Shaft in plan** (a fixed pin on an x or y axis) | Two pillow blocks on the base past either end of what the shaft carries, or both behind it where something sweeps past its far end, far apart (A9): a cast housing on the shaft's axis on a foot plate, two screws down into the base and two dowels (F1, A11). Live: a sealed bearing in each block, located in the nearer by two shaft collars against its inner race, floating in the other (F2, F4); keyed parts as J2 (A5, F3). Dead: the shaft clamped in both blocks by set screws, every part on its own bearing (F2). The base drops under the shaft until its blocks fit (base growth). A hand-turned input takes a handwheel on the free shaft end (V5). |
| J11 | **Screw** (lead or ball; declared in `screws`) | The screw on its shaft in plan (J10: one end located, one floating, F2, F4); its thread drawn by its helix at the lead; the nut a block on the carriage: a flanged bronze nut, or a preloaded ball nut with its ball return and a wiper at each end (F8); the flange screwed to the carriage; anti-rotation from the carriage's slide (J5) or a key in a guide slot (F3). |

---

## 6. Functional completeness (F)

What turns a correct assembly into a believable machine. Every joint and every part is run through the ten
functions. This section replaces the earlier "detail budget": there is no cap on functional detail, only a floor on
readability.

### 6.0 Complete, then readable

A joint is **complete** when the assembly would really work:

- every bearing is retained axially on both sides, and either located or preloaded;
- every rotating part is located, keyed and retained;
- every fastener has its thread engagement (M9) and a locking method (M13);
- every sliding pair has its guide, keeper, wipers and lubrication;
- every adjustable fit has its adjuster and its clamp;
- every phase has its mark;
- every motorised input has its sensor and its cable.

A detail is **admitted** only if it passes all four: (1) function: you can finish "without it, ___ would happen" with a
physical consequence; (2) kinematics untouched (K1); (3) zero clashes (A15); (4) readable at our scale: a feature under
about 1 mm on screen with no outline of its own becomes one mark or nothing.

**Excluded on sight**, even though watches have them: Côtes de Genève, perlage, decorative anglage, blued screws as
colour, sunburst finishes, engraved names or logos, skeletonising for looks.

Every admitted solid carries a **detail level** (section 9b) so the drawing can be scaled on slow devices without
changing what the mechanism is.

### 6.1 The ten functions

| Id | Function | Watch analogue | Our hardware | Applies when | Tier |
|---|---|---|---|---|---|
| F1 | **Locate** a part so it goes back in the same place | Bridge steady pins | 2 dowels per removable plate (one round hole, one slot), spigots, shaft shoulders | Any removable plate that carries a bearing (bridges, housings, brackets) | AUTO (J1, J2, A6) |
| F2 | **Retain axially** | Screwed chatons, cap jewels | External circlip on shafts, internal circlip or shoulder + retainer plate in bores, E-clips on small pins, shaft collars, end retainers | Every bearing; every part on a shaft that is not clamped | AUTO (J1 to J7) |
| F3 | **Transmit torque** | Squared arbors, cannon pinion | D-flat, feather key, clamp hub, set screw on a flat, taper or shear pin | Every keyed part | AUTO (A5) |
| F4 | **Carry thrust, set end-shake** | Endstones | Bronze thrust washer, shims, wave or Belleville washer for preload or drag | Every rotating part free axially | AUTO (J1, J2, J6) / HAND (drag) |
| F5 | **Limit travel** | Banking pins | Hard stop with elastomer bumper, stop pin, end-of-stroke block, just outside the working range | Oscillating or linear outputs that could over-travel with the drive off | AUTO (`H.stops` from the solved range; slide end stops shortened to clear a sweep before they are dropped) / HAND (placement check) |
| F6 | **Hold a position** | Click and click spring, jumper | Spring ball or roller detent, pawl spring, drag pack (wave washer + bronze disc) | Rest positions not positively locked; ratchets; anything that rattles in a clearance | HAND (call) / AUTO (`H.dragPack`, `H.spring`) |
| F7 | **Adjust** so made parts meet the exact model | Regulator, eccentric bankings | Slotted holes + clamp, eccentric bushing, shims, gib strip, idler on an eccentric, turnbuckle | Every belt drive, every gear mesh, every slide, every exact length ratio | AUTO (J5, J6, J8) / HAND (links: call `H.eccentricMount` where a ground pivot carries the exact dimension, `H.turnbuckle` on a moving link) |
| F8 | **Lubricate** | Oil sinks, oil cups | Oil sink at an exposed pivot, oil hole and groove to a bushing, grease nipple on a slide, felt wiper on a sliding surface | Sliding contacts, plain bushings, open bearings. Not sealed bearings | AUTO by joint type |
| F9 | **Time and reference** for reassembly in phase | Beat marks, wheel index dots | Match marks at meshing teeth, zero line, index station marks, timing dowel | Anything with phase: gears, cams, Geneva, indexers, multi-crank linkages | AUTO (J6, J7, Geneva stations) / HAND (linkages) |
| F10 | **Protect and sense** | Shock protection, case | Pulley flanges, slip clutch or shear pin, home flag + fork sensor, see-through guard | Motor-driven builds | AUTO (flanges, sensor) / HAND (clutch) |

### 6.2 Detail on components

- **Shafts and axles** (A4): shoulders at every seat; circlip grooves where a part relies on friction; set-screw
  flats; thread undercuts; chamfered ends; centre holes; wrench flats.
- **Bearings:** closure chosen and drawn per joint: open (balls visible, oiled from a sink), shield (one extra
  ring), seal (flush). Retained by a shoulder on one side and a circlip or retainer plate on the other. Preloaded by a
  wave washer where floating. Bore entry chamfers on every seat.
- **Fasteners:** a screw in every hole drawn for one; washers under heads on aluminium; a locking method on every
  one (M13); head type by access: socket where a key reaches, button on thin plates, countersunk where something
  sweeps over.
- **Plates, bridges, brackets:** dowels or spigots (F1), spot faces and counterbores (M4), jack-screw holes beside
  dowels on tight plates, slotted holes where adjustable (F7), inside fillets where load turns a corner (M7).
- **Gears, wheels, discs:** hub and arms on anything that starts, stops or reverses (M2); hub with key or clamp
  (F3); tooth edge chamfers; timing marks (F9); replaceable locking segment on an indexing disc (M14).
- **Links and arms:** bosses proud of the web on both faces; oil hole to a plain bushing (F8); clamp where keyed.
- **Pulleys and belts:** flanges on the small pulley, two set screws at 90° or a clamp hub, tension slot, idler.
- **Springs** (`H.spring`): compression (seat, guide pin or bore, preload screw), torsion (post and tail stop), leaf
  (screwed at one end, bearing on a hardened pad). Drawn as the coil or leaf outline with its seat as a real part.
- **Slides** (J5): a few blocks, each guide function carried by one of them. A dowelled reference rail; a gib clamped
  under the keeper by the rail's screws, set on its slotted holes; a wiper at each end of the slider, a nipple, one end
  stop block at each end. The hardened, screwed rails and the gib are the replaceable wear parts (M14).
- **Sensing and cabling** (motorised builds): 1 mm vane on the input pulley or shaft collar, fork sensor on the
  bracket or a post, leads from motor and sensor to a terminal block on the base edge, one cable clip under the base.

### 6.3 Ancillary parts and sizes

| Part | Size at our scale | Functions | Drawing notes |
|---|---|---|---|
| Dowel pin | Ø3 to 4, flush or 1 mm proud | F1 | Plain disc, no head; pairs placed diagonally |
| Spigot | Ø6 h7 turned on a standoff | F1 | Fits a reamed hole or a slot in the bridge |
| External circlip DIN 471 | shaft Ø6 to 12, 0.8 to 1.2 thick | F2 | Ring with two ears and holes |
| Internal circlip DIN 472 | bore Ø19 to 28 | F2 | Ears inward |
| E-clip | Ø6 pins | F2 | Open-sided |
| Shaft collar with set screw | Ø10 shaft, Ø20 x 8 | F2, F3 | Set screw shows in side view |
| Bearing retainer plate | ring, 3 x M2.5 | F2 | Fully functional, very watch-like |
| Feather key DIN 6885 | 3 x 3 on Ø10, 4 x 4 on Ø12 | F3 | Keyway drawn as a mark on shaft and hub |
| Set screw DIN 916 | M3 or M4 on a flat | F3 | Two at 90° on hubs |
| Wave or Belleville washer | bearing OD, 0.3 to 0.5 | F4, F6 | Wave drawn as marks |
| Stop block + bumper | 6 to 10 mm, neoprene pad | F5 | Outside sweeps except at end of travel |
| Stop pin | Ø4 in base | F5 | Simplest banking pin |
| Ball detent plunger | M6 | F6 | Threaded body, spring and ball (faint), V notch |
| Compression spring | Ø6 to 10 wire 0.8 | F6 | Seat and guide as parts |
| Leaf or pawl spring | 0.8 wire or thin leaf | F6 | Thin curved plate screwed at one end |
| Eccentric bushing | Ø16 with offset Ø10 bore, flanged | F7 | Arc slots, two clamp screws, spanner holes, index line |
| Gib strip | the rail's width, as thick as the slider stands over the rail, slotted at each rail screw | F7 | On the keeper rail of every slide, clamped under the keeper by the rail's screws |
| Jack screw + slots | M4 | F7 | Slots in a mount flange, screw against a lug |
| Turnbuckle (`H.turnbuckle`) | M3 studs in a 6 mm link, body 5d long, as wide as the link allows (2d + 2 to 4d), milled flat to the link's thickness; DIN 439 jam nuts | F7, M13 | The link cut in two halves on one body, left and right hand studs threadlocked into the half ends, the body and the nuts flush in the link's plane; index line on the body |
| Idler pulley | bearing on a stud | F7 | On a slotted arm |
| Oil sink | Ø3 to 4 countersink at a pivot | F8 | One ring round an axle end on a bridge |
| Grease nipple DIN 71412 | M6, hex 7 | F8 | On a boss feeding a slide; reachable |
| Felt wiper | 3 x 6 pad in a clip | F8 | Against a sliding surface |
| Match marks, zero line, station dots | engraved line or dot | F9 | One mark per part |
| Wear strip | 1.5 x slot depth, hardened, 2 screws | M14 | In slot walls and cam tracks |
| Slip clutch | Belleville stack + nut on a pulley | F10 | Pulley on a bushing between friction discs |
| Shear pin | Ø2 brass through hub and shaft | F10 | One visible pin |
| Home flag + fork sensor | 1 mm vane, 12 x 25 sensor | F10 | Vane on a rotating part, sensor off the base |
| Terminal block + cable clip | 4-way block on the base edge, P-clip under the base | F10 | Leads as thin rounded strips |

---

## 7. Evidence of manufacture (M)

Every real part shows how it was made and how it is assembled. These features pass the admission test by
definition, as long as they are readable.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| M1 | **Outer edge breaks:** every top-face edge chamfered (sizes per part kind in the form style). | AUTO | screenshot |
| M2 | **Load- and inertia-driven shaping:** bosses round every loaded hole; hub and arms on wheels that start, stop or reverse; webs or ribs on long brackets; lightening windows (`H.window`, `H.spokes`, filleted) only where mass or inertia matters. | HAND | review |
| M3 | **Bore entry chamfers** on every bearing seat and through hole, drawn as a second ring. | AUTO | screenshot |
| M4 | **Seats for heads:** counterbores for socket heads, countersinks for countersunk screws, spot faces on rough or curved faces. | AUTO (base, csk, housings) / HAND (others) | screenshot |
| M5 | **No sharp inside corners on milled parts:** pockets, windows and slots carry a cutter radius ≥ 1.5 mm; slots have full-radius ends. | AUTO (`H.window`) / HAND | outline review |
| M6 | **Edge distance and walls:** hole centres ≥ 1.5 × hole Ø from any edge; ≥ 1.2 mm wall round bearings; no feature thinner than 1.5 mm in a plate. | AUTO check | `tools/check` |
| M7 | **Inside fillets** where load turns a corner in a bracket or plate. | HAND | review |
| M8 | **Thread undercut** where a thread meets a shoulder. | AUTO (A4) | section |
| M9 | **Thread realism:** ISO coarse pitch; engagement ≥ 1.5 × d in aluminium, ≥ 1 × d in steel, else through to a nut; screw lengths from standard series. | AUTO (rule) / HAND (variant) | names |
| M10 | **Materials and finishes named** per part: aluminium 6061 anodised or bead-blasted for plates; case-hardened steel for contact surfaces; bronze for bushings and thrust washers; neoprene for feet and bumpers; spring steel for clips and springs. Contact surfaces are hard. | AUTO (defaults by kind and role) / HAND (overrides) | `mat` on solids |
| M11 | **Turned-part marks:** centre holes on shaft ends, wrench flats, chamfered shaft ends. | AUTO (A4) | screenshot |
| M12 | **Tool access** (with A17): every screw reachable by its key; every pressed bearing removable (a hole or slot behind it). | HAND | explode |
| M13 | **Locking on every threaded fastener:** nyloc nut, threadlocker (named), spring washer, tab washer or wire. Drawn where it is a part (nut insert ring, washer); named otherwise. | AUTO (default per joint type) / HAND (variant) | names |
| M14 | **Replaceable wear parts** where there is sliding contact: slot liners, locking segments, cam track inserts, slide strips, as separate screwed solids of hard material. | AUTO (J4, J5, J7) / HAND (call `H.lockingSegment` for a locking arc, special surfaces) | solids |

---

## 8. Drive (V)

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| V1 | **Standard prime mover:** brushless pancake outrunner Ø50 x 18 under the base, faint internals turning at belt ratio, GT2 belt, default 32:16. Brushed Ø36 DC motor as the alternative setting. Every mechanism with a rotary, oscillating or linear input is motorised. | AUTO (`H.drive`) | screenshot |
| V2 | **One solid bracket:** top flange against the base, floor for the motor, full-height window for the belt; flange screws go up into the base from inside; nothing shows on top of the base. | AUTO | side view |
| V3 | Belt and pulleys clear of feet, housings and base hardware; where the belt passes under a post, its lower screw becomes a flush countersunk screw. | AUTO (rule) / HAND (motor position) | `tools/clearance` |
| V4 | Drive detail: pulley flanges, set screws or clamp hub, belt tension slot, idler where needed (J8). | AUTO | screenshot |
| V5 | **Drive by input kind** (K7): `rotary`: belt to the input pulley. `oscillating`: motor, short crank and connecting link swinging the rocker through exactly the modelled range; the crank belongs to the drive. `linear`: belt loop along the stroke with a carriage clamped to the input slider, tensioner on the far pulley. `manual`: no motor; a handle, knob or lever on the input and a stop at the end of the range; the page says hand operated. | AUTO | screenshot, page |
| V6 | **Sensing and cabling:** home flag on the input and a fork sensor on the bracket or a post; motor and sensor leads to a terminal block on the base edge, one cable clip under the base. | AUTO | underside view |

---

## 9. Look and rendering (L)

The look is the blueprint / drafting scheme: dark Blueprint and light Drafting sheets. Full styling lives in
`docs/style-reference.md`; this section keeps the rules a mechanism build depends on.

| Id | Requirement | Tier |
|---|---|---|
| L1 | **Every look value is global**, in `src/style`. A mechanism never carries colours, line weights, opacities, patterns or fonts. | STYLE |
| L2 | **Records carry no look.** A model and a polish supply geometry, roles, materials, marks, detail levels and `accent: true` on the input; the renderer decides how they look. | HAND (don't break it) |
| L3 | **Roles carry the look.** Each role has its own surface: driver fine stipple, link sparse dots, output hatching, ground soft dashes, base a faint dot grid, bearings cross-hatch, hardware plain. Every solid's `role` must be right. | HAND |
| L4 | **One accent colour** for the input shaft ring, the traced path and the forces. `accent: true` goes on the input only. | HAND (flag) / STYLE |
| L5 | **Transparency stays.** Surfaces are semi-transparent and a covered edge becomes a dashed hidden line, so screws in holes, bearings in bores and shanks through plates show. Model them as real solids with real holes, never as a mark on a top face. A static solid that hides a working zone (the pitch point of a mesh, the run of a slot roller) is drawn see-through, so the zone stays in view. | AUTO (stage 3, see-through) / HAND |
| L6 | **Correct depth order** at every tilt: solids sliced at every overlapping z boundary; a solid on an x or y axis cut along its own axis where another solid's box meets it and placed by the plane between their boxes; nothing paints in front of what it sits behind. | AUTO |
| L7 | **View:** tilt from 0° (true plan) to 88° (side elevation), no sideways shear. Pseudo-2D only. | STYLE |
| L8 | **Drawing conventions the mechanism feeds:** chain centrelines through every joint head and base-plate dimensions are automatic. Engraved scales, index marks and match marks are `marks` and draw as fine ink lines. Fill patterns never get finer than the on-screen floor; a detail under about 1 mm becomes one mark or nothing. | AUTO / HAND |

### 9a. Reuse and performance (R)

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| R1 | **Reuse before you draw.** If the part family, `H.*` or a subassembly already makes the part, use it. Never redraw a standard part inline in a polish. A part needed by two mechanisms becomes an `H.*` primitive first. | HAND | read the polish for inline outlines |
| R2 | **Standard size series.** Bearings only from the catalogue table; screws M2, M2.5, M3, M4, M5, M6, M8; shafts Ø6, 8, 10, 12; standoffs Ø10; GT2 pulleys 16T and 32T; circlips, keys and springs from their tables. As few distinct sizes per mechanism as the loads allow. | HAND | sizes listed in the audit |
| R3 | **Shared subassemblies are one function, never copied:** housing, bridge, slide, eccentric, stops, drag pack, belt drive, sensor. | AUTO | code |
| R4 | **Pre-built packages.** The assembled mechanism (solids, traces, bounds, plot, joints) is packaged at build time; the browser loads the package, `solve(u)` and the renderer. The rules, hardware library and polish are never shipped. | AUTO | `tools/package` |
| R5 | **Polish states only what differs** from the rules. No heavy sampling inside a polish; when it needs the swept range, sample once (≤ 180 steps). | HAND | polish ms in the bench |
| R6 | **Load time and frame time are measured, not gated.** `tools/bench` reports package size, session setup, frame time at plan, 28°, side and explode, on the detail stage and a thumbnail, against the targets in the design (8 ms desktop frame, 16 ms phone, 20 ms setup). Over target is a flag to look at (section 9b), never a reason to cut function. | FLAG | bench report |
| R7 | **Small records.** `model.ts` and `polish.ts` together under about 20 KB; no stored point lists where geometry can be generated. | HAND | file size |
| R8 | **Draw only what is seen.** Thumbnails are pre-rendered images; cards animate on hover only; the stage draws only when u, view or theme changed. | SITE / AUTO | profile |

### 9b. Detail levels (DL)

Richness is never traded against performance in the model: a mechanism is audited and packaged at full detail. What
can be scaled is the drawing, through one dial with a ladder of rungs. Each rung names the things that stop being
drawn when the dial passes it: solids, marks and render effects alike. **The ladder is ordered by what a viewer
notices, from least to most, never by what costs most to draw.** A rung that removes a part of the build sits near
the top because the build then reads as incomplete, however cheap or expensive that part is to draw.

The ladder is data, not code: one ordered table in `src/style/detail.ts`, each rung with an id, a description and
the selectors it drops (solid kinds, roles, mark kinds, render effects). Re-ranking a rung from measurements is a
one-line change there and nowhere else. The order below is the starting point, to be validated by dedicated
performance and perception tests later.

| Rung | Dropped | What stops being drawn | Why it sits here |
|---|---|---|---|
| DL-A | first | Paper grain; bearing balls and cages; motor internals (stator, windings, magnets, commutator) | Faint by design; nothing about the build is lost |
| DL-B | | Manufacturing marks: chamfer lines, bore-entry rings, head flutes, hex sockets, knurls, keyway marks, thread helices | Texture of the parts, not their presence |
| DL-C | | Wall shading steps (walls flat), silhouette lines on inner slices (kept on the top slice) | Softens the drawing without removing a line that carries meaning |
| DL-D | | Stack hardware hidden inside a joint: inner-race spacers, thrust and plain washers, sleeves, shims, internal circlips | Invisible inside the stack unless exploded; drawn again whenever explode > 0 |
| DL-E | | Service and sensing parts: oil sinks, nipples, felts, wipers, home flag, sensor, terminal block, cable clip, leads, timing marks | Small distinct parts off the load path; the build still reads complete |
| DL-F | | Role surface patterns (roles then read by tone and outline only) | Large areas change; roles get harder to tell apart |
| DL-G | | Hidden lines (the dashed copies of covered edges); device pixel ratio capped at 1 | A drafting convention the whole look leans on; a soft image is seen at once |
| DL-H | last | Retention and adjustment parts: external circlips, retainer plates, nuts, set screws, eccentric bushings, gib strips, stops, springs, wear strips, dowels, spigots | Without these the build reads as incomplete |
| never | | The mechanism's parts, base plate, every joint's main hardware (shaft or bolt, head, bearings, housing, bridge, standoffs), motor, bracket, belt, pulleys, traced paths, overlays | The build itself and what the page is for |

| Id | Requirement | Tier |
|---|---|---|
| DL1 | Every solid, mark and render effect maps to one rung through the selectors in `detail.ts`; primitives and rules tag what they make (kind, role, mark kind); a polish may move a specific solid up the ladder (toward "never") and says why in the audit, never down. | AUTO / HAND |
| DL2 | A mechanism may declare a **default dial position** in the model (full unless the audit finds a reason); the audit header records it. The package stores everything; the dial is applied when drawing, never at packaging. | HAND |
| DL3 | **View-aware exceptions live in the table too:** DL-D is drawn whenever explode > 0; DL-B marks are skipped at side elevation (tilt ≥ 80°) because they are edge-on. | AUTO |
| DL4 | **Adaptive:** the site measures frame time on the stage and moves the dial one rung at a time with hysteresis, never past DL-G on its own, never on a thumbnail or a screenshot. The visitor can pin full detail. The dial position shows in the title block ("DETAIL A-H" or "FULL") so a screenshot is never mistaken for the full build. | SITE |
| DL5 | **Measured:** the bench reports, per mechanism, the solids and marks on each rung and the frame time at each dial position, so the ladder can be re-ranked from evidence and the cost of each rung is known. | FLAG |

---

## 10. Verification (Q)

| Id | Check | Pass |
|---|---|---|
| Q1 | `tools/check <id>` | no `MISSING`, `NaN`, `LINK LEN`, `POSE JUMP`, `INTERFERE`, `OVERLAP`, `WARN`, `AXIS`, clamp or edge-distance fault; periodicity none |
| Q2 | `tools/clearance <id>` | 0 clashes over the full cycle |
| Q3 | `tools/package <id>` and the site build | package written, page builds |
| Q4 | `tools/shot <id>`: plan, 28°, side, full explode at 28° and 70°, both sheets, overlays on | nothing clips, details readable, nothing distracts, E1 to E9 hold |
| Q5 | `tools/bench <id>` | report written; flags noted in the audit (not a failure) |
| Q6 | `tools/audit <id>` regenerated and judged | every requirement PASS or N/A with reason, or FAIL listed as open with a reason; ten-function table complete for every joint |
| Q7 | `tools/conformance` | the mechanism is at the current standard version |

Checks Q1, Q2, Q6 and Q7 run as tests for the changed mechanism; all mechanisms when the rules, hardware, style or
renderer change. Q4 and Q5 run locally.

---

## 11. Audit sheet template

`tools/audit <id>` writes this. A row the tools decide outright (P1, K2, A12, A15, M6, R7, Q1, Q2) is filled and
regenerated every time; every other row gets its tier and the evidence the tools collect (rule firing, joint types,
names, sizes, materials, locking, rungs) and a `?` to judge. Judged rows, hand entries in the joints table, the
header, deferrals, variants, promotion candidates and measured frame times survive regeneration. A deferral is a line
`defer: <ids or version> · <reason>`; no reason, no deferral.

```markdown
# Audit: <name> (<id>)
standard: 2.0 · date: YYYY-MM-DD · result: pass | open · detail: full · pass: build | audit+fix

## Summary
PASS n · FAIL n · N/A n · open: ...

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| ... | | |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| <joint> | J3 | component / none / – reason | | | | | | | | | |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|

## Promotion candidates
Hand fixes that should become rules or primitives.

## Verification
check · clearance · clamp · edge distance · package
screenshots (paths) · bench (flags)
```

---

## Appendix A. Family playbooks

Start here, then run the full ten-function audit.

**Linkages** (four-bar, Watt, Chebyshev, Hoekens, Peaucellier, Jansen, pantograph, scissor lift)
- F5 stops just outside the rocker's range (`H.stops`); F2 circlips or shoulder bolts on every moving pin.
- F7 where the model depends on an exact length ratio (straight-line linkages, pantographs), one length is adjustable,
  shown at its set point, drawn length exact: `H.eccentricMount` where a ground pivot carries the exact dimension,
  `H.turnbuckle` on a moving link otherwise (in the link's own plane, so it fits a swept stack with no room above or
  below the link).
- Scissor lift and pantograph: `manual` input with a handle and stops, or `linear` with a belt carriage.

**Gears** (spur, gear train, planetary, rack and pinion)
- J6 on every mesh; M2 hub and arms on large wheels; F8 open gears are greased, oil sinks on bridge pivots.
- Rack: screwed and dowelled to the base, F5 end stops, F8 felt wiper. Planetary: marks for planet phase.

**Intermittent** (Geneva, intermittent gear, ratchet and pawl)
- M2 lighten the indexed member; F6 drag pack where locking is not positive; M14 a screwed locking segment on the
  Geneva disc; ratchet: real pawl spring screwed down, second holding pawl if the model has one; F10 home sensor.

**Quick-return and slider** (slider-crank, scotch yoke, crank shaper, Whitworth, oscillating cylinder, locomotive drive, toggle clamp)
- J5 on every slide (reference rail, gib under the keeper, wipers, nipple, an end stop at each end); J4 in every slot
  with wear strips.
- Scotch yoke: slide block in the slot (M14 liners). Toggle clamp: `manual`, over-centre stop visible (F5), adjustable
  spindle with lock nut (F7). Oscillating cylinder: pivot pin retained (F2); spring holding the port face (F6).

**Cam** (cam follower)
- J7 complete: return spring with seat and preload, guide bushing with circlip, anti-rotation key on flat followers,
  felt oiler, zero line; hardened cam and a replaceable track insert where the roller runs (M14).

**Couplings** (Oldham, universal joints)
- Each shaft in its own J2 cartridge; F8 lubrication of sliding tongues; F3 clamp hubs on shaft ends.

**Spatial gears** (bevel, hypoid, worm, helical, herringbone, crossed helical)
- The geometry from `src/core/spatial.ts`: bevel pitch cones from the tooth counts and shaft angle, the gear a toothed
  frustum (`taper` = the inner end's scale) with Tredgold back-cone teeth; a worm's lead and lead angle, its wheel at
  the lead angle; a helical gear's transverse profile turned by its `helix`.
- Declare every crossed mesh in `meshes` (J9), the worm first. A gear on an x or y axis turns on a shaft in plan
  (J10); a bevel pinion overhangs its wheel, so its blocks stand behind it.
- F7 by the shim packs (mounting distance); F4 where the mesh pushes; F9 marks at the mesh; herringbone: one shaft
  located, the other free to float so the halves share the load.

**Shaft couplings** (universal joint, double Cardan, Rzeppa, flexible couplings)
- Each shaft on its own support (J2 or J10); the cross of a universal joint in needle cups held by circlips
  (`H.crossBearings`, F2), a grease nipple on the cross (F8); clamp hubs or keyed yokes on the shaft ends (F3).
- A member that tilts as it turns (the cross, a cage, a swash plate) waits for posed axes; its build follows the
  decision on it.

**Screws** (lead screw, ball screw, screw jack)
- Declare the screw in `screws` (J11): the screw on a shaft in plan (J10) with one end located and one floating; the
  thread drawn by its helix at the lead (`src/core/spatial.ts`: lead, lead angle, self-locking).
- The nut on a carriage that slides (J5), so the slide holds it from turning; a ball nut's return and wipers (F8); end
  stops just past the travel (F5).

**Curve generators** (Tusi couple, elliptic trammel)
- Trammel: F7 adjustable slider pins at the model's lengths; J5 on the slots. Tusi: F9 marks for the planet's phase.

## Appendix B. Hardware primitives and subassemblies

Primitives (`H.*`): `plate, shaft (stepped profile), bearing (open / shield / seal), roller, bushing, washer, wave
washer, tube, shank, head (socket / button / csk), nut, standoff, spigot, dowel, circlip (internal / external),
retainer plate, key, set screw, collar, spring (compression / torsion / leaf), stop, bumper, nipple, felt, oil sink
(marks), wear strip, eccentric bushing, gib, wiper, flag, sensor, terminal block, cable clip, lead`, helpers
`disc, hex, taper, boltCircle, hullOf, window, filletPoly, spokes, boreChamfers`.

Subassemblies: `H.housing` (J2 cartridge), `H.bridge` (posts, spigots, dowels, lobes), `H.slide` (J5, a few
blocks) with `seatRail` and `railLayout` (A6: the rail's riser, or pads clear of what passes under it, and its screws),
`H.eccentric` (J6 backlash), `H.eccentricMount` (F7 at a ground pivot), `H.turnbuckle` (F7 on a moving link: the
link in two halves joined in its own plane by left and right hand studs, a flat body and jam nuts), `H.stops` (F5 from
the solved range), `H.dragPack` (F6, sized to the face it bears on), `H.lockingSegment` (M14), `H.outputCoupling` (a
keyed flange on a straddle-mounted output), `H.followerTrain` (J7), `H.drive` (V1 to V6 by input kind), `H.sensor` (V6), `H.pillowBlock` (J10: a bearing block
for a shaft in plan, a housing on its axis on a foot plate, screwed and dowelled), `H.crossBearings` (the four needle
cups and circlips of a universal joint's cross).

Every primitive has real catalogue sizes, a default material, a default locking method where threaded, and a
default detail level.

---

## Changelog

- **2.7 (2026-10-20).** Spatial mechanisms. A part may stand out of the plan plane on an x or y axis, with solid forms
  along it (taper, helix); every existing part is on z and meets it unchanged [D8, AUTO]. Joint classification covers
  pins on x or y axes and declared crossed meshes and screws [A1, A2, AUTO]. New joint rows: crossed-axis mesh,
  shaft in plan with its pillow blocks and the base growth under it, screw [J9 to J11, AUTO]. Depth order across
  axes [L6, AUTO]. The model check reports `AXIS` [Q1, AUTO]. Playbooks for spatial gears, shaft couplings and
  screws; `H.pillowBlock` and `H.crossBearings` in Appendix B.
- **2.6 (2026-10-18).** The device pixel ratio cap moves from DL-C to DL-G: a soft drawing is seen at once, and on the
  GPU renderer a frame's cost hardly follows its pixel count (browser bench, DL5), so it goes last of the effects
  [DL-C, DL-G, AUTO].
- **2.5 (2026-10-18).** An F7 adjuster for moving links: `H.turnbuckle` makes a link adjustable at its set point in its
  own plane (two halves on one body, left and right hand studs, a body milled flat to the link's thickness, jam nuts), so
  an exact length that sits between free pins, or on a link with no room above or below in the swept stack, can be
  trimmed with the drawn length exact. A polish calls it on the link that carries the exact dimension; the Linkages
  playbook says which adjuster goes where [F7, HAND].
- **2.4 (2026-10-18).** Linear guides are a few blocks with retaining screws and end stops. A slide is a dowelled
  reference rail and a rail carrying a bronze gib clamped under the keeper; the keeper's screws are the rail's fixing
  screws, so the shim, the separate keeper screws, the gib adjusting screws and their lock nuts go: the gib is set on
  slotted holes and clamped (adjust kept, by the clamp). One end stop block with a pad at each end, a wiper at each end
  of the slider, one nipple [J5, F2, F5, F7, F8, M13, AUTO]. Rails sit on one ground riser each, split into pads only on
  the runs where nothing passes under the rail, screws near each riser end and at most 100 mm apart; only the reference
  rail is dowelled [A6, F1, AUTO].
- **2.3 (2026-10-18).** Real-world examples are YouTube videos of real footage, never product pages, animations or
  renders, and may be none [P1, P6, DATA].
- **2.2 (2026-10-18).** Slide rails sit on ground steel pads, screwed through into the base and dowelled at the ends,
  instead of on posts [A6, F1, AUTO].
- **2.1 (2026-10-18).** Hand fixes from the first four conformance passes promoted to rules and primitives, and one new
  stage. Working zones stay in view: a static solid over a mesh pitch point or a slot roller's run is drawn see-through
  [L5, AUTO]. Plating offsets (`dz`) and clevis twins (`twin`) in the model contract, read by the rules [K1, A9, AUTO].
  Tapered links in the part family [D1, AUTO]. Open slots, and pins classified over the cycle [A1, J4, M14, AUTO].
  Straddle-mounted live gear shafts with the top eccentric [J2, F7, AUTO]. `H.dragPack` sized to the face it bears on,
  `H.lockingSegment`, `H.outputCoupling`, `H.spokes` [F6, M14, M2, AUTO]. Slide end stops shortened before they are
  dropped [F5, AUTO]. Shoulder bolt headroom: a lifted head that would meet a solid gets a shoulder ground to length,
  a clear one is reported [A13, AUTO].
- **2.0 (2026-10-17).** Rewritten for the rebuilt engine. Section 0 added (versioning, conformance tool, audit
  generator) [S1 to S4, DATA/AUTO]. Detail budget of 6.0 replaced by functional completeness [F, HAND → mostly AUTO by
  joint type]. Joint-type catalogue added [J1 to J8, AUTO]. Shafts as stepped profiles, keys by size, locking on every
  fastener, replaceable wear parts, springs, lubrication and timing marks by joint type, sensing and cabling
  [A4, A5, M13, M14, F6, F8, F9, V6, AUTO]. Input kind and drive by input kind [K7, V5, HAND + AUTO]. Detail levels
  [DL, AUTO/SITE]. Pre-built packages [R4, AUTO]. Glow renderer and second-renderer requirement removed [L2, SQ7].
  Status table and hand-time logs removed (the board holds status). File layout changed to `src/mechanisms/<id>/`.
- **1.0 (2026-10-16).** The hand-off standard: conformance pass, tiers, P K D A E F M V L R Q, audit template,
  family playbooks.
