# Audit: Barrel cam (barrel-cam)
standard: 3.0 · date: 2026-10-21 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 150 · FAIL 0 · N/A 17 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass issue holds only this mechanism's decisions; batch status in #216 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R5 (#216): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · the roller centre traced (the unrolled groove seen from the front), ticks every 15 degrees; the drum axis, the groove normal and the pressure angle; plot of slide position |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.6e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (cam); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the driver carries the accent on its shaft |
| K6 | PASS | DATA · cycloidal rise 120, dwell 60, return 120, dwell 60, stroke 30 at the pitch radius 60: tan φ = s'/Rp, 25.5 at most; the groove is cut from the joint's own law (barrel form of the cam block and K1) |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the stroke and radius controls are not offered (the drum is built at build time), recorded in the review |
| K10 | PASS | AUTO / DATA · one closure, continuous over the cycle |
| K11 | PASS | AUTO · mobility counted 2, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the roller centre F: its run along the drum with stop and go |
| T5 | PASS | DATA · the drum axis, the groove normal through the roller, the pressure angle against the slide's line |
| T6 | PASS | HAND / DATA · 30 mm of stroke on a 140 mm drum; the groove's slope and dwells read in front elevation |
| T7 | PASS | DATA · FRONT, where the groove's slope under the roller is the pressure angle at true size |
| T8 | N/A | DATA · the roller in its groove shows in FRONT |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 15 solids drawn see-through: O-pb-b0-brg-balls, O-pb-b1-brg-balls, G-rail1, G-gib, G-keeper, G-sc0, G-sc0-sh, G-sc1 · nothing static covers the drum or the roller in FRONT |
| T11 | PASS | AUTO · 1 support routed, 0 moved off a sweep · the slide's guide on the base under the drum, off its sweep; pillow blocks at the drum's ends |
| T12 | PASS | HAND · 18 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the drum's turn (see K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · a plain drum with its groove cut by the law; roller follower on a stud in an upright |
| D2 | PASS | HAND · the upright tapers from its foot on the slide to a boss at the stud, narrower than the roller |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · two pillow blocks for the drum shaft, one rail pair for the slide, one motor bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · the groove is a boolean: a tube of the groove's section carried round the drum on the law, subtracted by Manifold; every other solid a profile, an operation and a frame |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · the grooved drum ships as a mesh (a boolean result), the rest as profiles |
| D11 | PASS | AUTO · SOLID: 0 of 90 solids unsound |
| D7 | PASS | HAND · drum and slide plain; richness in the stacks, the slide and the drive |
| A1 | PASS | AUTO · F J3, O J10, C groove-cam, G J5, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · F J3, O J10, C groove-cam, G J5, drive drive · drum on a live shaft in plan (J10) in two pillow blocks; roller on a shoulder bolt in the upright (J3); slide in a gibbed guide (J5); groove cam (J7, form-closed) |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (30 solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (20 solids), j13-compliant (no solids), standoffs (no solids) · the slide's guide on the base, rails dowelled |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (28 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · drum straddled by its two pillow blocks |
| A10 | PASS | HAND · fired: placement (7 solids), placement solver · the drum on its axis and the roller in its groove stand where their joints put them; the slide on its slab |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 96 solids, 53 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: C, G · a note per joint; build rules: groove cut from the law, guide under the drum, stud upright narrower than the roller |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (140.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 1 support routed (0 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: none · supports placed off the principle's sweep where the router could |
| A20 | PASS | AUTO · support per joint: O pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: F J3, O J10, C groove-cam, G J5, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · end stops at both ends of the slide's travel; cable clips |
| E1 | PASS | AUTO · every solid has one explode level; levels -13 to 8.5 · one level per solid |
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
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft |
| J3 | PASS | AUTO · fired: j3-moving-pin (5 solids), cross-bearings (no solids), ring-hub (no solids) · built by its kit (Joints table) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (20 solids), tongue-slot (no solids) · built by its kit (Joints table) |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | PASS | AUTO · fired: groove-cam (2 solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · built by its kit (Joints table) |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (30 solids) · built by its kit (Joints table) |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, G; fired: j2-live-shaft (no solids), j10-shaft-in-plan (30 solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at F, O, G; fired: j2-live-shaft (no solids), j10-shaft-in-plan (30 solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at F, O; fired: j2-live-shaft (no solids), j10-shaft-in-plan (30 solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (30 solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at G; fired: j5-slide (20 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · an end stop with a pad at each end of the slide's travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · form-closed: the groove holds the roller both ways, no spring |
| F7 | PASS | AUTO / HAND · served at G; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (20 solids), j12-flexible (no solids), adjustable-length (no solids) · the gib takes up the slide's play |
| F8 | PASS | AUTO · served at C, G; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at C; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · a zero line engraved on the drum's end at the start of the rise |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (5 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (28 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 93 of 96 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 13 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (2 solids), pallet-contact (no solids), tongue-slot (no solids) · the roller rolls on the walls; the slide is gibbed and wiped |
| V1 | PASS | AUTO · fired: drive (30 solids) · pancake motor under the base, GT2 belt to the input shaft |
| V2 | PASS | AUTO · fired: drive (30 solids) · one flange or bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (15 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 36.0 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 33 of 96 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 36.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F | J3 | – | – | – | none | Shoulder bolt Ø5 x 4, M4 (ISO 7379) | Shoulder bolt Ø5 x 4, M4 (ISO 7379) | none | none | none | none | none | none | none |
| O | J10 | driver | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø21 | Feather key 4 x 4 x 139 (DIN 6885) | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| C | groove-cam | cam | – | – | none | none | none | none | none | none | none | Felt oiler over the groove, oil-soaked wool felt | Drum | none |
| G | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 90, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O-pb | O | pillow | first choice | 1.5 | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 5 | 0 | 1.4 |
| DL-B | 0 | 208 | 1.35 |
| DL-C | 0 | 0 | 1.34 |
| DL-D | 3 | 0 | 1.39 |
| DL-E | 12 | 1 | 1.47 |
| DL-F | 0 | 0 | 1.42 |
| DL-G | 0 | 0 | 1.4 |
| DL-H | 9 | 0 | 1.38 |
| never | 61 | 102 | 1.37 |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 4.6e-14 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 35.7 KB
screenshots: dist/shots3/barrel-cam (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
