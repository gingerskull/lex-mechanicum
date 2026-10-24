# Audit: Rack and pinion (rack-pinion)
standard: 3.0 · date: 2026-10-21 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 149 · FAIL 0 · N/A 18 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the batch issue (#215) holds only this mechanism's decisions; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R4 (#215): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states about the motion is a claim and agrees (T9) |
| P10 | PASS | HAND · marks on the pinion's pitch circle and the rack's pitch line, ticks every 30 deg; pitch circle, pitch line and the 20 deg line of action; plot of rack travel |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.3e-15 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (gear-mesh); no numeric fallback · composed from the block library (gear-mesh, rack form: travel = pitch radius x angle); no fallback, no one-off model |
| K4 | PASS | HAND · pinion driver with the accent on its shaft, rack output |
| K6 | PASS | DATA · module 4, 16 teeth: pitch radius 32, 32 mm of rack per radian, 0.559 mm per degree |
| K7 | PASS | DATA · drivers input (oscillating) · oscillating driver ±150 deg declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one oscillating driver; the tooth-count design choice is not offered as a control (parts built for 16 teeth) |
| K10 | PASS | AUTO / DATA · one closure; the rack mesh declared with the pitch radius and the slide's axis |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (2 solids) · a mark on the pinion's pitch circle and one on the rack's pitch line, ticks every 30 deg: equal 16.8 mm steps on both |
| T5 | PASS | DATA · the pitch circle, the pitch line and the line of action through the pitch point |
| T6 | PASS | HAND / DATA · the pitch circle rolls on the pitch line without slip: the two tick rows match tick for tick |
| T7 | PASS | DATA · PLAN, where the pitch circle and the pitch line show true |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 2 ok, 0 off, 0 uncheckable of 2 |
| T10 | PASS | AUTO · 0 solids drawn see-through · the bridge over the pinion drawn see-through with its stack (A19); the rack's toothed side has no rail over it |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the pinion's bridge moved off the mesh; the rack's guides kept to its back |
| T12 | PASS | HAND · 16 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input; no other control (K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · involute pinion, module 4; a straight-flanked 20 deg rack on the same pitch |
| D2 | PASS | HAND · material where the teeth carry; plain gear discs on keyed hubs |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge over the pinion on two posts; the rack's gibbed rail, way and keeper; the motor flange and the drive's gear sector on its post under the base |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 113 solids unsound |
| D7 | PASS | HAND · gears plain; richness in the stacks |
| A1 | PASS | AUTO · M J6, O J2, S J5, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · M J6, O J2, S J5, drive drive · pinion on a live shaft (J2) straddled by a bridge; rack on a slide (J5) guided from its back; parallel mesh J6 |
| A3 | PASS | AUTO · fired: classify (3 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (43 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (25 solids), j13-compliant (no solids), standoffs (no solids) · the rack on a gibbed rail under a keeper and a hardened strip on a ground way under its back half; its toothed side open |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (23 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · pinion straddle mounted (housing under, bridge over) |
| A10 | PASS | HAND · fired: placement (4 solids), placement solver · pinion and rack on one slab; nothing stacked to clear |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 102 solids, 55 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 4 joint notes; no note: none; no badge: M, S · a note per joint; build rules: the rack guided from its back, the pinion holds it against the gib, which sets the mesh |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (14.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O-bridge · bridge first choice, moved off the mesh; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: O bridge · one axial stack builder with its support selector; the slide kit for the rack |
| A21 | PASS | AUTO · kit per joint: M J6, O J2, S J5, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · end stops at both ends of the rack's travel (J5); no swing stops: the drive positions the pinion |
| E1 | PASS | AUTO · every solid has one explode level; levels -4.5 to 4.5 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | N/A | AUTO · fired: trunnion (no solids), j1-dead-axle (no solids) · no dead axle |
| J2 | PASS | AUTO · fired: j2-live-shaft (43 solids) · pinion shaft: housing, keyed with a clamp hub, bridge over the top, the drive pulley below |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (25 solids), tongue-slot (no solids) · rack slide: gibbed rail under a keeper, wear strip on a way, wipers on both ends, grease nipple, end stops with pads |
| J6 | PASS | AUTO · fired: j6-mesh (1 solid), ring-rollers (no solids) · parallel mesh: eccentric bushing for the pinion's centre distance, timing marks at the mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, S; fired: j2-live-shaft (43 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at O, S; fired: j2-live-shaft (43 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at O; fired: j2-live-shaft (43 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (43 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at S; fired: j5-slide (25 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · end stop blocks with neoprene pads past both ends of the rack's travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at M, S; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), j5-slide (25 solids), j12-flexible (no solids), adjustable-length (no solids) · eccentric bushing at the pinion; the gib sets the rack against it |
| F8 | PASS | AUTO · served at S; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at M; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), timing-marks (1 solid) · timing marks at the mesh |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (23 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 100 of 102 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 16 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the hardened wear strip under the rack is the replaceable wear part |
| V1 | PASS | AUTO · fired: drive (26 solids) · pancake motor under the base; a crank and link swing a 60T gear sector that turns a 20T pinion on the input shaft 3 times as far |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · crank, link and gear sector clear of feet and housings (A15) |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no belt: the drive is a crank, a link and a gear sector |
| V5 | PASS | AUTO · fired: drive (26 solids) · oscillating input over 180 deg: a crank and link swing a gear sector that steps the swing up 3:1 to the input's 300 deg, dead centres at the ends of the swing |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (no solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (2 solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 19.5 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish; nothing sampled by hand |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 38 of 102 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 19.5 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/rack-pinion: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M | J6 | gear-mesh | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Pinion; Rack | none |
| O | J2 | driver | bridge (moved) | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 13 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| S | J5 | – | – | – | 2 x Dowel pin Ø3 h6, gibbed rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 381.2, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| drive | drive | – | – | – | none | External circlip DIN 471, Ø12; 2 x External circlip DIN 471, Ø4 | Feather key 4 x 4 x 9 (DIN 6885) | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O-bridge | O | bridge | moved | 1.5 | pinion | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| S (rack slide) | rails on both sides of the slider | gibbed rail, keeper and a wear strip on a way, all on the rack's back | the toothed side stays open for the pinion; promoted to the slide kit (a rack is guided from its back) |
| drive | oscillating input: crank and link (V5) | the belt drive with a reversing motor | a 300 deg swing is beyond a crank and link; promoted to the drive rule (oscillating over 180 deg) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 5 | 0 | – |
| DL-B | 0 | 143 | – |
| DL-C | 0 | 0 | 1.05 |
| DL-D | 5 | 0 | – |
| DL-E | 16 | 3 | – |
| DL-F | 0 | 0 | – |
| DL-G | 0 | 0 | 1.06 |
| DL-H | 19 | 0 | – |
| never | 68 | 146 | 0.93 (full) |

## Promotion candidates
None left: the toothed rack outline, the rack guided from its back and the reversing belt drive for a swing over 180 deg are rules of the builder.

## Verification
check: clean · K1 residual: 4.3e-15 · claims: 2 of 2 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.6 KB
screenshots: dist/shots3/rack-pinion (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: tools/bench3 (desktop; 28 deg paced 0.93 ms full, 1.05 at C, 1.06 at G; phone by David)
