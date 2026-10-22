# Audit: Block and tackle (block-and-tackle)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 148 · FAIL 0 · N/A 19 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass issue holds only this mechanism's decisions; plan and status in #218 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R7 (#218): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states that the motion can check is a claim and agrees (T9) |
| P10 | PASS | HAND · equal-time ticks on the hook and on the fall's end side by side (4:1 spacing); an index mark on every sheave (rates 1:2:3:4); the block spacing as a dimension and the load line; plot of the rise against the fall hauled |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (reeve); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · sheaves Ø60, rope pitch radius 28.4, 4 parts; pins 135 mm apart with the load down, the lower pin 8 mm to the right; 160 mm of fall for 40.07 mm of rise |
| K7 | PASS | DATA · drivers haul (linear) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one linear driver, the fall |
| K10 | PASS | AUTO / DATA · one closure, no branch to choose; design choices declared |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · ticks every 20 mm of fall on the hook's path and on the fall's end: four fall ticks to one hook tick |
| T5 | PASS | DATA · the load line and the block spacing |
| T6 | PASS | HAND / DATA · 4:1 in the two tick rows and the plot; 1:2:3:4 in the sheaves' index marks |
| T7 | PASS | DATA · PLAN: both blocks, every rope part and the fall in plain view |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | PASS | AUTO · 13 solids drawn see-through: part-3-rope, fall-rope, sheave-UB-wrap, fall-slide-rail0, fall-slide-keeper, U-A-0-sp, U-A-slv, U-A-bb · the crossing part, the fall, the upper bridge and the slide's rail and keeper drawn see-through where they cross principle parts in plan |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the upper block's bridge moved off the sweeps |
| T12 | PASS | HAND · 18 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the fall hauled is the one control |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · grooved sheaves (core and two flanges) with index marks; braided rope parts between tangent points, wraps in the grooves; a hook block on a swivel with a bushed eye on a guide rod; a clamp post for the fall's end |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge over the upper block, one rod block, one slide, one motor plate |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | PASS | AUTO / HAND · each rope part stretched between its two solved tangent points (D9), the crossing part slanting between its sheaves' planes; wraps fixed arcs on the far side of each sheave |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 143 solids unsound |
| D7 | PASS | HAND · sheaves plain; richness in the rope, the guide and the slide |
| A1 | PASS | AUTO · guide J5, L-A J3, fall-slide J5, U-A J1, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · guide J5, L-A J3, fall-slide J5, U-A J1, drive drive · upper sheaves on a dead axle in a bridge (J1); lower sheaves on a shoulder bolt in the lower block (J3); the rope by J12 |
| A3 | PASS | AUTO · fired: classify (11 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (33 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | N/A | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · no live shaft: the sheaves turn on their pins |
| A6 | PASS | AUTO · fired: j5-slide (24 solids), j13-compliant (no solids), standoffs (no solids) · the carriage on a dowelled reference rail and a gibbed rail, on risers; the hook block on a ground rod |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (18 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the upper pin carried both sides by its bridge; the lower bolt through the block |
| A10 | PASS | HAND · fired: placement (12 solids), placement solver · each pair of sheaves in one plane (A and B); only the crossing part runs between planes, slanted |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (37 solids), strap-sheave (no solids), j1-dead-axle (33 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 142 solids, 69 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: fall-slide · a note per joint with its badge (the carriage's slide is the driver's, its note the drive's); build rules: the rope reeved over two planes, the crossing part slanting; the load on a guide rod; the fall clamped on the carriage |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (32.0 mm), 0 clevises; stack per joint in the Joints table · placement: the A sheaves on one slab, the B sheaves and the carriage on the next (the rope's parts tie them), the guide on the lower block's |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: U-A-bridge · the upper bridge routed off the sweeps; see-through where it still covers the upper sheaves in plan |
| A20 | PASS | AUTO · support per joint: U-A bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: guide J5, L-A J3, fall-slide J5, U-A J1 |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (3 solids) · cable clips on the drive's lead |
| E1 | PASS | AUTO · every solid has one explode level; levels -20 to 4 · one level per solid; the rope parts stretch, and explode with their blocks |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (33 solids) · upper sheaves on a dead axle: bearings, circlips, spacers and thrust washers, bridge on spigoted posts |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft on the base normal |
| J3 | PASS | AUTO · fired: j3-moving-pin (14 solids), cross-bearings (no solids), ring-hub (no solids) · lower sheaves on a shoulder bolt through the lower block, bearings circlipped |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (24 solids), tongue-slot (no solids) · the carriage's slide: reference rail and gibbed rail, keeper, wipers, nipple, stops with pads; the load's guide: a bushed eye on a ground rod |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j12-flexible (37 solids), j8-belt (no solids) · a rope, not a belt (J12); the drive is a Scotch yoke |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids), j11-screw (no solids) · no shaft in plan |
| J12 | PASS | AUTO · fired: j12-flexible (37 solids), j12-other (no solids), strap-sheave (no solids) · rope parts stretched between their solved tangent points, wraps in the grooves; the dead end on the becket; the fall clamped on the carriage; guards round the upper sheaves |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at guide, fall-slide, U-A; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · bridge on spigoted posts; rail and rod block dowelled |
| F2 | PASS | AUTO · served at L-A, fall-slide, U-A; fired: j12-flexible (37 solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids) · every bearing circlipped; the keeper laps the carriage; guards keep the rope in its grooves |
| F3 | PASS | AUTO · served at guide, L-A; fired: j12-flexible (37 solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · the hook on its swivel pin; the fall's end clamped between two jaws |
| F4 | PASS | AUTO / HAND · served at L-A, U-A; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), j11-screw (no solids) · thrust washers between the sheaves |
| F5 | PASS | AUTO / HAND · served at fall-slide; fired: j5-slide (24 solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · stops with neoprene pads past each end of the carriage's travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (37 solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at fall-slide; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (37 solids), j5-slide (24 solids), j12-other (no solids), adjustable-length (no solids) · the gib sets the carriage's slide |
| F8 | PASS | AUTO · served at fall-slide; fired: j12-flexible (37 solids), cross-bearings (no solids), tongue-slot (no solids), j11-screw (no solids), lubrication (1 solid) · wipers and a grease nipple on the slide; sealed bearings |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (no solids) · an index mark on every sheave's top flange: their turns count 1:2:3:4 |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (37 solids), drive (no solids), yoke-drive (21 solids) · home flag and fork sensor on the crank (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | N/A | HAND · nothing large starts and stops with the motor but the yoke and crank |
| M3 | PASS | AUTO · fired: j3-moving-pin (14 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (18 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (33 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (33 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 136 of 142 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (33 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 16 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · gear motor under the base, one turn per cycle, a crank and a Scotch yoke to a pin in the carriage |
| V2 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · one motor plate hung from the base on two standoffs |
| V3 | PASS | AUTO / HAND · fired: drive (no solids) · yoke, crank and motor clear of the feet (A15) |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no drive belt: a Scotch yoke |
| V5 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · a linear input of 160 mm: a Scotch yoke follows the driver's cosine law exactly |
| V6 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids), cable-clip (3 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (13 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 22.0 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): setup 30.3 ms over the 20 ms target (142 solids, the drive's 21 among them); frames 1.3 to 1.9 ms; the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 43 of 142 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 22.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/block-and-tackle: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| guide | J5 | – | – | – | Dowel pin Ø4 h6, rod block to base | none | Swivel pin Ø6, the hook turns on it | none | none | none | none | none | none | none |
| L-A | J3 | reeve | – | – | none | 2 x Internal circlip DIN 472, Ø24; Shoulder bolt Ø12 x 35, M10 (ISO 7379) | Shoulder bolt Ø12 x 35, M10 (ISO 7379) | Inner-race spacer 12.2x16.2 | none | none | none | none | none | none |
| fall-slide | J5 | driver | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 222, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| U-A | J1 | reeve | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | 2 x Internal circlip DIN 472, Ø24; External circlip DIN 471, Ø12 | none | Inner-race spacer 12.2x16.2; Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| U-A-bridge | U-A | bridge | moved | 1.5 | sheave-UA, sheave-UB | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | 1.82 |
| DL-B | 0 | 171 | 1.77 |
| DL-C | 0 | 0 | 1.9 |
| DL-D | 11 | 0 | 1.68 |
| DL-E | 12 | 1 | 1.74 |
| DL-F | 0 | 0 | 1.63 |
| DL-G | 0 | 0 | 1.81 |
| DL-H | 12 | 0 | 1.73 |
| never | 99 | 143 | 1.74 |

## Promotion candidates
None left: the rope (stretched parts between solved tangent points, slanting between planes; wraps; the rope's end clamped on a moving body) and the load's guide rod are the J12 rule; the reeve is a kin block.

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 6 of 6 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 20.8 KB
screenshots: dist/shots3/block-and-tackle (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
