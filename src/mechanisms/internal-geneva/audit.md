# Audit: Internal Geneva drive (internal-geneva)
standard: 3.0 · date: 2026-10-21 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 146 · FAIL 0 · N/A 21 · open: none

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
| P10 | PASS | HAND · a rim mark traced with 10-degree equal-time ticks and the pin's circle; line of centres, the slot line, the locking sector; plots of wheel angle and speed ratio |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 3.6e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (indexer); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the crank drives, accent on its shaft; the wheel is the output |
| K6 | PASS | DATA · c = 40, a = c sin(π/4) = 28.28 (exact); 90 degrees per index, driven for 270 and held for 90 degrees of crank, the same way as the crank, peak speed ratio 0.41 (indexer block, internal law added to the library) |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver, its cycle starting as the pin enters (phase 45, the reference mid-dwell); the slot-count control is not offered (built at build time), recorded in the review |
| K10 | PASS | AUTO / DATA · one closure, continuous over the cycle |
| K11 | PASS | AUTO · mobility counted 0, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · a mark on the wheel's rim with equal-time ticks: it moves for most of the turn, gently; the pin's circle |
| T5 | PASS | DATA · line of centres, the slot line to the pin, the locking sector's circle |
| T6 | PASS | HAND / DATA · same direction and the gentle 0.41 peak read against the external Geneva's 2.41 |
| T7 | PASS | DATA · PLAN |
| T8 | N/A | DATA · everything lies in one plane in plain view |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 5 solids drawn see-through: O-bb, O-bridge, W-ecl, W-axle-s4, W-axle-s5 · the crank's hanger over the top is drawn see-through where it covers the locking sector |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the crank hung from above (record support: hung), the wheel on a stub axle from below: nothing crosses the ring's plane |
| T12 | PASS | HAND · 13 support solids; dropped by the polish: none |
| T13 | N/A | DATA · the index lasts a quarter of the cycle |
| T14 | PASS | HAND / DATA · the crank's turn (see K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · a slotted ring on its web, concave locking arcs at the slots' mouths; the crank's locking sector; the arm above; a track roller on the pin |
| D2 | PASS | HAND · the ring wide where the slots carry; the web joins it to the shaft below |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one hanger for the crank, one stub axle for the wheel |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · slots, arcs, windows and the relief are cut features (booleans, shipped as meshes); every other solid a profile, an operation and a frame |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · the wheel and the locking disc ship as meshes (booleans), the rest as profiles |
| D11 | PASS | AUTO · SOLID: 0 of 89 solids unsound |
| D7 | PASS | HAND · wheel and crank plain; richness in the stacks and the roller |
| A1 | PASS | AUTO · O J2, S J4, L J7, W J1, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · O J2, S J4, L J7, W J1, drive drive · crank on a live shaft hung from above (J2), wheel on a dead stub axle (J1), pin in slot (J4: roller on a stud), locking contact (J7) |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (11 solids), axial stack builder · stepped shafts with shoulders, grooves and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (6 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the crank overhung from its hanger; the wheel on its stub |
| A10 | PASS | HAND · fired: placement (6 solids), placement solver · the ring, the sector and the roller in one plane; the web below, the arm above |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (11 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 89 solids, 52 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: S, L · a note per joint; build rules: the wheel's own part is its web so its axle stops below the ring; the crank hung from above |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (8.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O-bridge · supports placed off the principle's sweep where the router could |
| A20 | PASS | AUTO · support per joint: O hung · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: O J2, S J4, L J7, W J1, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops: both parts turn on; cable clips |
| E1 | PASS | AUTO · every solid has one explode level; levels -5 to 3.5 · one level per solid |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (11 solids) · built by its kit (Joints table) |
| J2 | PASS | AUTO · fired: j2-live-shaft (39 solids) · built by its kit (Joints table) |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | PASS | AUTO · fired: j4-slot-roller (3 solids), pin-lobe (no solids), fork-pin (no solids) · built by its kit (Joints table) |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | PASS | AUTO · fired: groove-cam (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids) · built by its kit (Joints table) |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, W; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at O, W; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at O; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O, W; fired: j9-crossed-mesh (no solids), j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · both parts turn on through the cycle; the locking arcs hold the wheel between indexes |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · the locking disc holds the wheel at rest; no spring |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · nothing to adjust: the slots and arcs are cut to the centre distance |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · the index needs no timing mark: any slot takes the pin |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (6 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (11 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (11 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 87 of 89 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (11 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 12 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (3 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the roller rolls in the slots; the locking surfaces are oiled |
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
| L5 | PASS | AUTO / HAND · fired: see-through (5 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 27.3 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 25 of 89 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 27.3 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| O | J2 | driver | hung (moved) | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 7 (DIN 6885) | Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| S | J4 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| L | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| W | J1 | – | – | – | Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O-bridge | O | hung | moved | 1.5 | crank, wheel | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 7 | 0 | 1.45 |
| DL-B | 0 | 119 | 1.49 |
| DL-C | 0 | 0 | 1.48 |
| DL-D | 4 | 0 | 1.52 |
| DL-E | 8 | 1 | 1.51 |
| DL-F | 0 | 0 | 1.51 |
| DL-G | 0 | 0 | 1.54 |
| DL-H | 6 | 0 | 1.46 |
| never | 64 | 118 | 1.47 |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 3.6e-14 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 27.4 KB
screenshots: dist/shots3/internal-geneva (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
