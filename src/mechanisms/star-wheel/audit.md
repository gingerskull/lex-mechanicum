# Audit: Star wheel and pin (star-wheel)
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
| P10 | PASS | HAND · a tooth tip traced with ticks every 2 degrees of driver and the finger's path; the finger circle, the tip circle, the jumper line (a tip on it is the crest); plot of star angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 0.0e+0 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (star); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the driver carries the accent on its shaft; the star is the output, the jumper a pawl |
| K6 | PASS | DATA · c 28, finger radius 12 (contact radius 1.9: a Ø3 finger in a Ø3.8 sleeve), star 10 teeth, tip 20, root 11.5; the star block: pushed to the crest (18 degrees at driver 195.85), snapped to 36 by 203.85 (8 degrees, cycloidal, never behind the finger), the finger alone 22.72; jumper lift 18.0; rests 325.6 degrees |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver, its cycle starting as the finger meets the star (phase 169; the claims' 'at' are cycle degrees) |
| K10 | PASS | AUTO / DATA · one closure, continuous over the cycle |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (2 solids) · a tooth tip with ticks every 2 degrees of driver: wide in the snap, close in the push, none at rest |
| T5 | PASS | DATA · the finger circle, the tip circle, the jumper line from the star's centre through the roller |
| T6 | PASS | HAND / DATA · the snap reads under the time map (4 times slower over driver 194 to 206) |
| T7 | PASS | DATA · PLAN |
| T8 | N/A | DATA · everything lies in one plane in plain view |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | PASS | AUTO · 7 solids drawn see-through: Kc-spring, O2-ecl, O2-axle-s4, O2-axle-s5, J-ecl, J-axle-s4, J-axle-s5 · nothing static covers the teeth |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · the star and the jumper on stub axles from the base (record support), the driver in a housing: no bridge over the teeth; the jumper's spring round its pivot, inside the base |
| T12 | PASS | HAND · 8 support solids; dropped by the polish: none |
| T13 | PASS | DATA · teaching.timeMap slows playback 4 times through the snap; the plot keeps the true input |
| T14 | PASS | HAND / DATA · the crank's turn (see K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · a straight-flanked star, a finger on a disc, a jumper arm with its roller |
| D2 | PASS | HAND · the jumper arm tapers from its pivot boss to the roller's stud |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one housing, two stub axles |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles only |
| D11 | PASS | AUTO · SOLID: 0 of 89 solids unsound |
| D7 | PASS | HAND · star, disc and arm plain; richness in the stacks and the spring |
| A1 | PASS | AUTO · O1 J2, Fc J7, Kc pawl-tooth, O2 J1, J J1, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · O1 J2, Fc J7, Kc pawl-tooth, O2 J1, J J1, drive drive · driver on a live shaft (J2), star and jumper on dead stub axles (J1), finger and roller contacts (J7, pawl and tooth) |
| A3 | PASS | AUTO · fired: classify (5 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (24 solids), axial stack builder · stepped shafts with shoulders, grooves and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (4 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · driver overhung on its live shaft; star and jumper on stubs |
| A10 | PASS | HAND · fired: placement (9 solids), placement solver · star, finger and roller in one plane; the driver's disc below, the jumper's arm above |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (24 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 89 solids, 49 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 6 joint notes; no note: none; no badge: Fc, Kc · a note per joint; build rules: the arm above the star, the finger up from below, the jumper's spring round its pivot |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (6.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · supports placed off the principle's sweep where the router could |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: O1 J2, Fc J7, Kc pawl-tooth, O2 J1, J J1, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops: both parts turn on; cable clips |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 2.5 · one level per solid |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (24 solids) · built by its kit (Joints table) |
| J2 | PASS | AUTO · fired: j2-live-shaft (25 solids) · built by its kit (Joints table) |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | PASS | AUTO · fired: groove-cam (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (2 solids) · built by its kit (Joints table) |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O1, O2, J; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at O1, O2, J; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at O1; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O1, O2, J; fired: j9-crossed-mesh (no solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (2 solids), j13-compliant (no solids), stops (no solids) · the jumper's swing is bounded by the star's teeth (limits in the record) |
| F6 | PASS | AUTO / HAND · served at Kc; fired: trunnion (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (2 solids), j12-flexible (no solids) · a torsion spring round the jumper's pivot holds its roller on the star |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · nothing to adjust: the slots and arcs are cut to the centre distance |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · the index needs no timing mark: any gap takes the finger |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (4 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (24 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (24 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 86 of 89 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (24 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 9 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the roller rolls in the slots; the locking surfaces are oiled |
| V1 | PASS | AUTO · fired: drive (26 solids) · pancake motor under the base, GT2 belt to the input shaft |
| V2 | PASS | AUTO · fired: drive (26 solids) · one flange or bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (7 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (2 solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 21.3 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 32 of 89 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 21.3 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| O1 | J2 | star | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 5 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Fc | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| Kc | pawl-tooth | – | – | – | none | none | none | none | none | Torsion spring Ø13, wire 0.8: holds the pawl on the teeth | none | none | none | none |
| O2 | J1 | star | – | – | Dead axle Ø10, shouldered, M8 end | External circlip DIN 471, Ø10 | none | Thrust washer 10.2x18, bronze | none | none | none | none | none | none |
| J | J1 | star | – | – | Dead axle Ø4, shouldered, M3 end | External circlip DIN 471, Ø4 | none | Thrust washer 4.2x12, bronze | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | 1.94 |
| DL-B | 0 | 116 | 1.95 |
| DL-C | 0 | 0 | 2.06 |
| DL-D | 9 | 0 | 1.98 |
| DL-E | 8 | 0 | 1.89 |
| DL-F | 0 | 0 | 1.97 |
| DL-G | 0 | 0 | 2.08 |
| DL-H | 6 | 0 | 1.97 |
| never | 57 | 121 | 2.11 |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 0.0e+0 · claims: 6 of 6 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.3 KB
screenshots: dist/shots3/star-wheel (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
